import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, PhysicalCoinStack, PhysicalReserveTank, PhysicalTag, YouTubePhysicalStage} from '../../motion-kit';

export const MECHANIC_ID = 'reserve-tank-mark-contest';
export const VISUAL_TECHNIQUE_ID = 'filling-tank-competing-marks';
export const COMPOSITION_FAMILY_ID = 'physical-container';
export const RESULT_HOLD_FRAMES = 96;

export const ANIMATION_NARRATIVE = {
  START: 'Ein leerer Reservebehälter, daneben das Geld, das hinein könnte',
  MECHANISM: 'Der Behälter füllt sich in drei Stufen, jede setzt ihre eigene Marke an die Wand',
  RESULT: 'Drei Marken stehen gleichberechtigt am selben Behälter — keine ist die richtige Höhe',
};

export const PREMIUM_VISUAL_NARRATIVE = {
  HERO: 'Reservebehälter, der sichtbar steigt',
  SUPPORT: 'Drei Münzstapel als Quelle, drei Höhenmarken als Anspruch',
  MATERIAL: 'Gold für das Geld, Grün für die Reserve, Elfenbein für die neutrale Marke',
  DEPTH: 'Quelle vorn links, Behälter in der Mitte, Marken hinten rechts',
};

/**
 * Rampe zwischen zwei Frames.
 *
 * `progressBetween` aus dem Baukasten rechnet in Anteilen der Szenenlänge. Diese
 * Szene setzt ihre Stufen an feste Frames, weil jede Zielgröße genau dann stehen
 * soll, wenn sie gesprochen wird — deshalb hier die direkte Variante.
 */
const ramp = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

/**
 * Der Behälter in Framekoordinaten.
 *
 * Die Visualzone ist y 180–990 und 1920 breit. Der Behälter nimmt fast die volle
 * Zonenhöhe ein, damit die drei Marken weit genug auseinanderliegen, um als
 * verschiedene Höhen lesbar zu sein — und damit unter der Szene keine tote
 * schwarze Bahn stehen bleibt.
 */
const TANK = {x: 690, y: 262, width: 430, height: 620};
const TANK_BOTTOM = TANK.y + TANK.height;

/**
 * Die drei Zielgrößen aus dem Skript.
 *
 * `fill` ist der Füllstand, den die jeweilige Regel fordert — daraus ergibt sich
 * die Höhe ihrer Marke an der Behälterwand. Die Reihenfolge ist die des
 * gesprochenen Textes: 1.000 €, drei Monatsgehälter, viel mehr.
 */
const CLAIMS = [
  {label: '1.000 €', fill: 0.24, from: 36, to: 108},
  {label: '3 Monatsgehälter', fill: 0.55, from: 108, to: 186},
  {label: 'viel mehr?', fill: 0.86, from: 186, to: 264},
];

export const YouTubeVisual04Animation: React.FC = () => {
  const frame = useCurrentFrame();

  // Kanal 1 — der Füllstand. Er steigt stufenweise und hält zwischen den Stufen,
  // damit jede Zielgröße einen eigenen sichtbaren Zustand bekommt.
  let fill = 0;
  for (const claim of CLAIMS) {
    fill = interpolate(frame, [claim.from, claim.to - 18], [fill, claim.fill], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }

  // Kanal 2 — die Quelle links leert sich, während der Behälter steigt.
  const drain = ramp(frame, 36, 250);

  // Kanal 3 — am Ende tritt keine Marke hervor: alle drei atmen gemeinsam, statt
  // dass eine gewinnt. Das ist die Aussage der Szene.
  const contest = ramp(frame, 276, 330);

  return (
    <YouTubePhysicalStage>
      {/* Quelle: drei Stapel, die nacheinander in den Behälter wandern. */}
      {[0, 1, 2].map((index) => {
        const gone = interpolate(drain, [index * 0.3, index * 0.3 + 0.34], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <PhysicalCoinStack
            key={index}
            x={150 + index * 176}
            y={TANK_BOTTOM - 196 - gone * 120}
            count={6 - index}
            scale={1.26 - gone * 0.4}
            opacity={Math.max(0, 1 - gone * 1.35)}
          />
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

      {/* Die Marken sitzen auf der Höhe, die ihre Regel fordert. */}
      {CLAIMS.map((claim, index) => {
        const set = ramp(frame, claim.to - 30, claim.to);
        const markY = TANK_BOTTOM - claim.fill * TANK.height;
        const breathe = Math.abs(((contest * 3 + index * 0.33) % 1) - 0.5) * 2;
        const glow = contest > 0 ? 0.35 + breathe * 0.4 : 0.75;
        return (
          <div
            key={claim.label}
            style={{
              position: 'absolute',
              left: TANK.x + TANK.width,
              top: markY - 26,
              display: 'flex',
              alignItems: 'center',
              opacity: set,
              transform: `translateX(${(1 - set) * -46}px)`,
            }}
          >
            <div
              style={{
                width: `${set * 168}px`,
                height: 3,
                background: COLORS.white,
                opacity: glow,
              }}
            />
            <PhysicalTag material={index === 2 ? 'warning' : 'neutral'}>{claim.label}</PhysicalTag>
          </div>
        );
      })}
    </YouTubePhysicalStage>
  );
};
