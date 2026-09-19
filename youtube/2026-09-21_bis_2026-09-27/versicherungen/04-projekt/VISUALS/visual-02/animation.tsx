import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {PhysicalPhone, PhysicalPolicy, PhysicalTag, YouTubePhysicalStage} from '../../motion-kit';

export const MECHANIC_ID = 'policy-sheets-cover-objects';
export const VISUAL_TECHNIQUE_ID = 'covering-sheet-leaves-one-bare';
export const COMPOSITION_FAMILY_ID = 'physical-covering';
export const RESULT_HOLD_FRAMES = 54;

export const ANIMATION_NARRATIVE = {
  START: 'Handy, Fahrrad und Arbeitskleidung liegen unbedeckt nebeneinander',
  MECHANISM: 'Über die ersten beiden legt sich je eine Police, über das dritte nicht',
  RESULT: 'Zwei Gegenstände sind zugedeckt, die Arbeitskraft liegt weiter offen',
};

export const PREMIUM_VISUAL_NARRATIVE = {
  HERO: 'Die Police, die sich sichtbar über einen Gegenstand legt',
  SUPPORT: 'Drei Gegenstände auf einer Linie, einer bleibt ohne',
  MATERIAL: 'Papier für die Policen, Metall für das Gerät, Stoff für die Arbeitskleidung',
  DEPTH: 'Gegenstände auf einer Ebene, die Policen davor',
};

const ramp = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

/** Alles sitzt in der Visualzone y 180–990. */
const ROW_Y = 470;
const SLOTS = [
  {key: 'phone', x: 200, label: 'Handy', covered: true, start: 20},
  {key: 'bike', x: 730, label: 'Fahrrad', covered: true, start: 70},
  {key: 'work', x: 1260, label: 'Arbeitskraft', covered: false, start: 120},
];

export const YouTubeVisual02Animation: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <YouTubePhysicalStage>
      {SLOTS.map((slot) => {
        // Kanal 1 — der Gegenstand steht von Anfang an da.
        const shown = ramp(frame, 0, 18);
        // Kanal 2 — die Police sinkt herab, aber nur über zwei der drei.
        const cover = slot.covered ? ramp(frame, slot.start, slot.start + 34) : 0;

        return (
          <React.Fragment key={slot.key}>
            {slot.key === 'phone' ? (
              <PhysicalPhone x={slot.x + 50} y={ROW_Y} scale={1.16} opacity={shown} />
            ) : null}
            {slot.key === 'bike' ? (
              <div style={{position: 'absolute', left: slot.x + 20, top: ROW_Y + 30, opacity: shown}}>
                <div style={{
                  width: 260, height: 260, borderRadius: '50%',
                  border: '18px solid #6E7378',
                  boxShadow: '0 26px 44px rgba(0,0,0,0.44), inset 0 0 0 6px rgba(255,255,255,0.12)',
                }} />
              </div>
            ) : null}
            {slot.key === 'work' ? (
              <div style={{position: 'absolute', left: slot.x, top: ROW_Y + 60, opacity: shown}}>
                <div style={{
                  width: 300, height: 190, borderRadius: 26,
                  background: 'linear-gradient(150deg,#D9B98A 0%,#A98455 58%,#6B5031 100%)',
                  boxShadow: '0 28px 46px rgba(0,0,0,0.46)',
                }} />
              </div>
            ) : null}

            {/* Die Police kommt von oben und legt sich auf den Gegenstand. */}
            {slot.covered ? (
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                transform: `translate(${slot.x}px, ${interpolate(cover, [0, 1], [190, ROW_Y - 40])}px)`,
                opacity: cover,
              }}>
                <PhysicalPolicy x={0} y={0} label={slot.label} sealed scale={0.92} rotate={-3} />
              </div>
            ) : null}

            <div style={{position: 'absolute', left: slot.x + 40, top: 880, opacity: shown}}>
              <PhysicalTag material={slot.covered ? 'neutral' : 'warning'}>{slot.label}</PhysicalTag>
            </div>
          </React.Fragment>
        );
      })}
    </YouTubePhysicalStage>
  );
};
