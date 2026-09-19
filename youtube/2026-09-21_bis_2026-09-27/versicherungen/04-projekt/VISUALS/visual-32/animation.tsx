import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {PhysicalBill, PhysicalObject, PhysicalTag, YouTubePhysicalStage, ease} from '../../motion-kit';

export const MECHANIC_ID = 'damages-sorted-by-size';
export const VISUAL_TECHNIQUE_ID = 'items-roll-into-two-bins';
export const COMPOSITION_FAMILY_ID = 'physical-sorting';
export const RESULT_HOLD_FRAMES = 44;

export const ANIMATION_NARRATIVE = {
  START: 'Eine Rutsche führt auf zwei Behälter zu, beide leer',
  MECHANISM: 'Schadensbelege rollen herunter und fallen je nach Größe links oder rechts hinein',
  RESULT: 'Jeder Schaden liegt in dem Behälter, der zu seiner Größe gehört',
};

export const PREMIUM_VISUAL_NARRATIVE = {
  HERO: 'Die Belege, die sich selbst sortieren',
  SUPPORT: 'Die Rutsche und die zwei Behälter',
  MATERIAL: 'Glatte Bahn, Papier, offene Behälter',
  DEPTH: 'Rutsche oben, Behälter unten davor',
};

const DROPS = [
  {amount: '250 €', big: false, at: 16},
  {amount: '600 €', big: false, at: 52},
  {amount: '480.000 €', big: true, at: 92},
  {amount: '120 €', big: false, at: 134},
];

export const YouTubeVisual32Animation: React.FC = () => {
  const frame = useCurrentFrame();

  // Kanal 1 — die Rutsche wird sichtbar.
  const chute = ease(frame, 0, 22);

  return (
    <YouTubePhysicalStage>
      <div style={{
        position: 'absolute', left: 700, top: 260,
        width: `${chute * 520}px`, height: 12, borderRadius: 6,
        background: 'linear-gradient(90deg,#C9CFD1,#6E7378)',
        transform: 'rotate(7deg)', transformOrigin: 'left center',
      }} />

      <PhysicalObject x={280} y={720} width={420} height={210} material="neutral" radius={20} opacity={0.9}>
        <div style={{padding: 26, fontSize: 28, fontWeight: 900, color: '#142019'}}>Notgroschen</div>
      </PhysicalObject>
      <PhysicalObject x={1180} y={640} width={480} height={290} material="positive" radius={20} opacity={0.9}>
        <div style={{padding: 26, fontSize: 28, fontWeight: 900}}>Versicherung</div>
      </PhysicalObject>

      {DROPS.map((drop) => {
        // Kanal 2 — jeder Beleg rollt los und fällt in seinen Behälter.
        const roll = ease(frame, drop.at, drop.at + 42);
        const targetX = drop.big ? 1300 : 400;
        const x = interpolate(roll, [0, 1], [760, targetX]);
        const y = interpolate(roll, [0, 1], [280, drop.big ? 700 : 780]);
        return (
          <div
            key={drop.amount}
            style={{
              position: 'absolute', left: 0, top: 0, // zone-ok: Position steckt im transform darunter
              transform: `translate(${x}px, ${y}px) scale(${drop.big ? 0.62 : 0.32}) rotate(${roll * (drop.big ? 20 : -26)}deg)`,
              opacity: roll < 0.96 ? roll : 0,
            }}
          >
            <PhysicalBill x={0} y={0} amount={drop.amount} label="Schaden" />
          </div>
        );
      })}

      <div style={{position: 'absolute', left: 320, top: 950, opacity: ease(frame, 160, 186)}}>
        <PhysicalTag material="neutral">kleine Schäden</PhysicalTag>
      </div>
      <div style={{position: 'absolute', left: 1240, top: 950, opacity: ease(frame, 160, 186)}}>
        <PhysicalTag material="positive">große Schäden</PhysicalTag>
      </div>
    </YouTubePhysicalStage>
  );
};
