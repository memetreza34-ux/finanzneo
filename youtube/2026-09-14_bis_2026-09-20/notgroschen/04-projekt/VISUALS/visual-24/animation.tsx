import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {PhysicalCalendarPage, PhysicalCoinStack, PhysicalReserveTank, YouTubePhysicalStage} from '../../motion-kit';

export const MECHANIC_ID = 'monthly-page-feeds-tank';
export const VISUAL_TECHNIQUE_ID = 'calendar-page-tear-into-reserve';
export const COMPOSITION_FAMILY_ID = 'physical-cycle';
export const RESULT_HOLD_FRAMES = 42;

export const ANIMATION_NARRATIVE = {
  START: 'Drei volle Kalenderblätter stehen aufgereiht, der Reservebehälter daneben ist leer',
  MECHANISM: 'Monat für Monat kippt ein Blatt weg und schickt denselben Betrag in den Behälter',
  RESULT: 'Der Behälter steht gefüllt, ohne dass irgendwo neu entschieden wurde',
};

export const PREMIUM_VISUAL_NARRATIVE = {
  HERO: 'Der Reservebehälter, der mit jedem Monat eine Stufe steigt',
  SUPPORT: 'Drei Kalenderblätter als Taktgeber, ein gleichbleibender Betrag als Fracht',
  MATERIAL: 'Papier für die Monate, Gold für den Betrag, Grün für die Reserve',
  DEPTH: 'Kalender vorn links, Fracht auf halber Höhe, Behälter hinten rechts',
};

const ramp = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

/**
 * Alles sitzt innerhalb der Visualzone y 180–990.
 *
 * Die Vorgängerfassung setzte eine Textzeile auf y 150 — oberhalb der Zone. Die
 * Animationsbühne clippt hart, also wurde die Zeile im Render abgeschnitten.
 */
const PAGES = [
  {month: 'Monat 1', x: 150, start: 10},
  {month: 'Monat 2', x: 430, start: 72},
  {month: 'Monat 3', x: 710, start: 134},
];

const TANK = {x: 1310, y: 290, width: 400, height: 560};
const TANK_BOTTOM = TANK.y + TANK.height;

export const YouTubeVisual24Animation: React.FC = () => {
  const frame = useCurrentFrame();

  // Kanal 1 — der Füllstand steigt mit jedem abgelieferten Monat um eine Stufe.
  let fill = 0;
  PAGES.forEach((page, index) => {
    fill = interpolate(frame, [page.start + 34, page.start + 52], [fill, (index + 1) / PAGES.length * 0.82], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  });

  return (
    <YouTubePhysicalStage>
      {PAGES.map((page) => {
        // Kanal 2 — das Blatt kippt nach vorn weg, sobald sein Monat vorbei ist.
        const tear = ramp(frame, page.start, page.start + 26);
        // Kanal 3 — der Betrag verlässt das Blatt und legt den Weg zum Behälter zurück.
        const carry = ramp(frame, page.start + 14, page.start + 52);
        const carryX = interpolate(carry, [0, 1], [page.x + 30, TANK.x - 190]);
        const lift = Math.sin(carry * Math.PI) * 74;
        return (
          <React.Fragment key={page.month}>
            <PhysicalCalendarPage
              x={page.x}
              y={356}
              month={page.month}
              amount="150 €"
              scale={1.34 - tear * 0.22}
              rotate={tear * -13}
              opacity={1 - tear * 0.72}
            />
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 700,
                transform: `translate(${carryX}px, ${-lift}px)`,
                opacity: carry > 0 && carry < 1 ? 1 : 0,
              }}
            >
              <PhysicalCoinStack x={0} y={0} count={3} scale={1.16} />
            </div>
          </React.Fragment>
        );
      })}

      <PhysicalReserveTank
        x={TANK.x}
        y={TANK.y}
        width={TANK.width}
        height={TANK.height}
        fill={fill}
        label="Notgroschen"
      />

      {/* Die erreichten Stufen bleiben als Marken an der Wand stehen. */}
      {PAGES.map((page, index) => {
        const reached = ramp(frame, page.start + 40, page.start + 54);
        const level = (index + 1) / PAGES.length * 0.82;
        return (
          <div
            key={`${page.month}-mark`}
            style={{
              position: 'absolute',
              left: TANK.x - 96,
              top: TANK_BOTTOM - level * TANK.height,
              width: `${reached * 96}px`,
              height: 3,
              background: '#F7F7F2',
              opacity: reached * 0.7,
            }}
          />
        );
      })}
    </YouTubePhysicalStage>
  );
};
