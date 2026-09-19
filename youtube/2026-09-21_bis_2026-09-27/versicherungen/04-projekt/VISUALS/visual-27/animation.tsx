import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {PhysicalBill, PhysicalPolicy, PhysicalTag, YouTubePhysicalStage} from '../../motion-kit';

export const MECHANIC_ID = 'double-cover-same-damage';
export const VISUAL_TECHNIQUE_ID = 'two-covers-for-one-small-item';
export const COMPOSITION_FAMILY_ID = 'physical-overlap';
export const RESULT_HOLD_FRAMES = 44;

export const ANIMATION_NARRATIVE = {
  START: 'Ein kleiner Schaden liegt da, der Notgroschen deckt ihn bereits ab',
  MECHANISM: 'Eine zweite Police legt sich über genau dieselbe Fläche',
  RESULT: 'Dieselbe Fläche ist doppelt gedeckt, und der Monatsbeitrag läuft trotzdem weiter',
};

export const PREMIUM_VISUAL_NARRATIVE = {
  HERO: 'Die zweite Police auf einer schon gedeckten Fläche',
  SUPPORT: 'Der kleine Schaden darunter, der laufende Beitrag daneben',
  MATERIAL: 'Grün für die vorhandene Deckung, Papier für die zusätzliche',
  DEPTH: 'Schaden unten, erste Deckung darüber, zweite ganz vorn',
};

const ramp = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

const SPOT = {x: 700, y: 480};

export const YouTubeVisual27Animation: React.FC = () => {
  const frame = useCurrentFrame();

  // Kanal 1 — der Schaden liegt von Anfang an da.
  const damage = ramp(frame, 0, 20);
  // Kanal 2 — die erste Deckung liegt bereits darüber.
  const first = ramp(frame, 22, 52);
  // Kanal 3 — die zweite Police sinkt auf dieselbe Stelle.
  const second = ramp(frame, 66, 112);
  // Kanal 4 — die Kosten laufen sichtbar weiter.
  const cost = ramp(frame, 112, 168);

  return (
    <YouTubePhysicalStage>
      <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(${SPOT.x}px, ${SPOT.y}px) scale(0.72)`, opacity: damage}}> // zone-ok: Position steckt im transform darunter
        <PhysicalBill x={0} y={0} amount="250 €" label="Schaden" rotate={-3} />
      </div>

      {/* Erste Deckung: der Notgroschen liegt schon darüber. */}
      <div style={{
        position: 'absolute', left: SPOT.x - 30, top: SPOT.y - 24,
        width: 300, height: `${first * 290}px`, borderRadius: 16,
        background: 'linear-gradient(180deg,rgba(108,255,181,0.32),rgba(12,122,71,0.5))',
        border: '3px solid #0C7A47', opacity: first,
      }} />
      <div style={{position: 'absolute', left: SPOT.x - 20, top: SPOT.y + 300, opacity: first}}>
        <PhysicalTag material="positive">Notgroschen deckt das</PhysicalTag>
      </div>

      {/* Zweite Police landet auf exakt derselben Fläche. */}
      <div style={{
        position: 'absolute', left: 0, top: 0, // zone-ok: Position steckt im transform darunter
        transform: `translate(${SPOT.x - 40}px, ${interpolate(second, [0, 1], [190, SPOT.y - 40])}px) scale(0.86)`,
        opacity: second,
      }}>
        <PhysicalPolicy x={0} y={0} label="Handy-Police" rotate={4} />
      </div>

      <div style={{position: 'absolute', left: 1240, top: 520, opacity: cost}}>
        <PhysicalTag material="warning">{`${Math.round(cost * 96)} € im Jahr`}</PhysicalTag>
      </div>
      <div style={{position: 'absolute', left: 1240, top: 610, opacity: cost}}>
        <PhysicalTag material="neutral">doppelt gedeckt</PhysicalTag>
      </div>
    </YouTubePhysicalStage>
  );
};
