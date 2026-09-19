import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {PhysicalObject, PhysicalTag, YouTubePhysicalStage, ease} from '../../motion-kit';

export const MECHANIC_ID = 'coverage-levels-compared';
export const VISUAL_TECHNIQUE_ID = 'three-coverage-heights';
export const COMPOSITION_FAMILY_ID = 'data-viz';
export const RESULT_HOLD_FRAMES = 46;

export const ANIMATION_NARRATIVE = {
  START: 'Drei leere Stellen für drei Deckungssummen',
  MECHANISM: 'Die Säulen wachsen auf sehr unterschiedliche Höhen, die Beitragszeile darunter kaum',
  RESULT: 'Zehnfache Deckung steht neben einem fast gleichen Beitrag',
};

export const PREMIUM_VISUAL_NARRATIVE = {
  HERO: 'Die drei ungleich hohen Säulen',
  SUPPORT: 'Die Beitragszeile, die fast gleich bleibt',
  MATERIAL: 'Grün für Deckung, Gold für den Beitrag',
  DEPTH: 'Säulen hinten, Beiträge davor',
};

/** Die Säulen stehen auf y 880 und wachsen nach oben in die Zone hinein. */
const BASE_Y = 880;
const LEVELS = [
  {label: '10 Mio. €', height: 180, price: '~ 60 € / Jahr', x: 340, at: 14},
  {label: '50 Mio. €', height: 400, price: '~ 66 € / Jahr', x: 800, at: 56},
  {label: '100 Mio. €', height: 600, price: '~ 72 € / Jahr', x: 1260, at: 98},
];

export const YouTubeVisual13Animation: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <YouTubePhysicalStage>
      {LEVELS.map((level) => {
        // Kanal 1 — die Säule wächst von unten auf ihre Höhe.
        const grow = ease(frame, level.at, level.at + 34);
        // Kanal 2 — der Beitrag erscheint erst danach und bleibt klein.
        const priced = ease(frame, level.at + 30, level.at + 50);
        const height = grow * level.height;

        return (
          <React.Fragment key={level.label}>
            <div style={{
              position: 'absolute',
              left: level.x,
              top: BASE_Y - height,
              width: 260,
              height: `${height}px`,
              borderRadius: 18,
              background: 'linear-gradient(180deg,#6CFFB5 0%,#0C7A47 72%,#06442A 100%)',
              boxShadow: '0 24px 44px rgba(0,0,0,0.42)',
              transform: `scaleX(${interpolate(grow, [0, 1], [0.86, 1])})`,
            }} />
            <div style={{position: 'absolute', left: level.x + 20, top: BASE_Y - height - 62, opacity: grow}}>
              <PhysicalTag material="positive">{level.label}</PhysicalTag>
            </div>
            <div style={{position: 'absolute', left: level.x + 20, top: BASE_Y + 24, opacity: priced}}>
              <PhysicalTag material="money">{level.price}</PhysicalTag>
            </div>
          </React.Fragment>
        );
      })}

      <PhysicalObject x={300} y={BASE_Y} width={1290} height={8} material="neutral" radius={4} opacity={0.5} />
    </YouTubePhysicalStage>
  );
};
