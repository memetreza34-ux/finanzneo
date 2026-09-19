import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {PhysicalPolicy, PhysicalTag, YouTubePhysicalStage, ease} from '../../motion-kit';

export const MECHANIC_ID = 'three-policies-in-order';
export const VISUAL_TECHNIQUE_ID = 'policies-stack-bottom-up';
export const COMPOSITION_FAMILY_ID = 'physical-sequence';
export const RESULT_HOLD_FRAMES = 50;

export const ANIMATION_NARRATIVE = {
  START: 'Eine leere Stelle, an der die erste Police liegen wird',
  MECHANISM: 'Drei Policen legen sich in fester Reihenfolge übereinander',
  RESULT: 'Der Stapel steht in der Reihenfolge, in der man vorgeht',
};

export const PREMIUM_VISUAL_NARRATIVE = {
  HERO: 'Der Stapel, der in einer festen Reihenfolge entsteht',
  SUPPORT: 'Drei benannte Policen',
  MATERIAL: 'Papier mit Siegel für die geltenden Policen',
  DEPTH: 'Jede neue Police liegt weiter vorn',
};

const STACK = [
  {label: '1. Privathaftpflicht', y: 700, at: 10},
  {label: '2. Berufsunfähigkeit', y: 520, at: 62},
  {label: '3. Hausrat', y: 340, at: 114},
];

export const YouTubeVisual30Animation: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <YouTubePhysicalStage>
      {STACK.map((item, index) => {
        // Kanal 1 — die Police fährt an ihren Platz.
        const placed = ease(frame, item.at, item.at + 38);
        const y = interpolate(placed, [0, 1], [190, item.y]);
        // Kanal 2 — erst danach wird sie benannt.
        const named = ease(frame, item.at + 32, item.at + 56);

        return (
          <React.Fragment key={item.label}>
            <div style={{
              position: 'absolute', left: 0, top: 0, // zone-ok: Position steckt im transform darunter
              transform: `translate(${700 + index * 26}px, ${y}px) scale(0.8)`,
              opacity: placed,
            }}>
              <PhysicalPolicy x={0} y={0} label={item.label} sealed rotate={index === 1 ? 3 : -2} />
            </div>
            <div style={{position: 'absolute', left: 1120 + index * 26, top: item.y + 40, opacity: named}}>
              <PhysicalTag material="positive">{item.label}</PhysicalTag>
            </div>
          </React.Fragment>
        );
      })}
    </YouTubePhysicalStage>
  );
};
