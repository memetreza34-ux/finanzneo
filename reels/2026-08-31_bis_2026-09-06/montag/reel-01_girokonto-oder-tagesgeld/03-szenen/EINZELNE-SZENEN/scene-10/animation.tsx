import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {ANIMATION_COLORS} from '../../../../../../../src/brand/tokens';
import {
  PhysicalAccount,
  PhysicalObject,
  PhysicalReserveTank,
  PremiumPhysicalStage,
} from '../../../../../../../src/motion';

/**
 * MECHANIC_ID: fn-result-lock
 * PRIMARY_ACTION: Girokonto und Tagesgeld setzen sich in zwei feste Rollenpositionen; danach rastet ein physischer Mittelverschluss ein und hält den Merksatz HEUTE gegen SPÄTER stabil fest.
 * ANIMATION_NARRATIVE
 * START: Girokonto und Tagesgeld stehen noch näher beieinander und wirken wie zwei Geldorte ohne endgültig gesetzte Rollen.
 * MECHANISM: Beide Objekte bewegen sich kontrolliert nach außen in ihre festen Plätze; anschließend senkt sich ein massiver Verschluss zwischen sie und verriegelt die Trennung.
 * RESULT: Girokonto bleibt links unter HEUTE, Tagesgeld rechts unter SPÄTER; der Endzustand hält ruhig und lesbar bis Szenenende.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Der finale räumlich verriegelte Zwei-Rollen-Zustand ist die Hauptaussage statt einer weiteren Geldbewegung.
 * SUPPORT: Girokonto, Tagesgeldbehälter und kurze HEUTE/SPÄTER-Marker machen die Merkhilfe sofort lesbar.
 * MATERIAL: Neutraler Girokörper, positiver Reservebehälter und ein schwerer neutraler Verschluss mit grünem Bestätigungskern.
 * DEPTH: Beide Geldorte setzen sich links und rechts auf derselben Ebene; der Verschluss kommt mittig aus dem Vordergrund und beendet die Bewegung.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export const Scene10Animation: React.FC<{durationFrames?: number}> = ({durationFrames = 180}) => {
  const frame = useCurrentFrame();
  const objectsIn = interpolate(frame, [2, 22], [0, 1], clamp);
  const spread = interpolate(frame, [20, 72], [0, 1], clamp);
  const markers = interpolate(frame, [54, 86], [0, 1], clamp);
  const lockDrop = interpolate(frame, [72, 112], [0, 1], clamp);
  const confirm = interpolate(frame, [104, 128], [0, 1], clamp);
  const result = interpolate(frame, [122, Math.max(132, durationFrames - RESULT_HOLD_FRAMES)], [0, 1], clamp);

  const giroX = interpolate(spread, [0, 1], [250, 70], clamp);
  const reserveX = interpolate(spread, [0, 1], [560, 750], clamp);
  const lockY = interpolate(lockDrop, [0, 1], [-260, 300], clamp);
  const leftSettle = interpolate(spread, [0, 0.78, 1], [0.96, 1.025, 1], clamp);
  const rightSettle = interpolate(spread, [0, 0.78, 1], [0.96, 1.02, 1], clamp);

  return (
    <PremiumPhysicalStage>
      <div
        style={{
          position: 'absolute',
          left: 130,
          top: 175,
          color: ANIMATION_COLORS.secondaryText,
          fontSize: 28,
          fontWeight: 950,
          letterSpacing: 2,
          opacity: markers,
          transform: `translateY(${(1 - markers) * 18}px)`,
        }}
      >
        HEUTE
      </div>

      <div
        style={{
          position: 'absolute',
          right: 105,
          top: 175,
          color: ANIMATION_COLORS.positive,
          fontSize: 28,
          fontWeight: 950,
          letterSpacing: 2,
          opacity: markers,
          transform: `translateY(${(1 - markers) * 18}px)`,
        }}
      >
        SPÄTER
      </div>

      <div style={{position: 'absolute', left: giroX, top: 265, transform: `scale(${leftSettle})`, transformOrigin: 'center'}}>
        <PhysicalAccount
          x={0}
          y={0}
          balance="HEUTE"
          label="GIROKONTO"
          progress={objectsIn}
          role="neutral"
        />
      </div>

      <div style={{position: 'absolute', left: reserveX, top: 225, transform: `scale(${rightSettle})`, transformOrigin: 'center'}}>
        <PhysicalReserveTank
          x={0}
          y={0}
          fill={0.72}
          label="TAGESGELD"
          role="positive"
        />
      </div>

      <PhysicalObject
        x={480}
        y={lockY}
        width={126}
        height={270}
        depth={24}
        radius={34}
        role="neutral"
        opacity={lockDrop}
        grounding={lockDrop}
      >
        <div style={{position: 'absolute', left: 28, right: 28, top: 44, height: 92, borderRadius: 999, border: '10px solid rgba(0,0,0,0.34)'}} />
        <div style={{position: 'absolute', left: 24, right: 24, bottom: 38, height: 86, borderRadius: 24, background: `rgba(0,210,106,${0.18 + confirm * 0.62})`}}>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#05311c', fontSize: 44, fontWeight: 950}}>✓</div>
        </div>
      </PhysicalObject>

      <div
        style={{
          position: 'absolute',
          left: 100,
          right: 100,
          top: 850,
          textAlign: 'center',
          color: ANIMATION_COLORS.positive,
          fontSize: 31,
          fontWeight: 950,
          opacity: result,
          transform: `translateY(${(1 - result) * 14}px)`,
        }}
      >
        GIRO FÜR HEUTE · TAGESGELD FÜR SPÄTER
      </div>
    </PremiumPhysicalStage>
  );
};
