import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {PhysicalObject, PhysicalPhone, PhysicalTag, YouTubePhysicalStage, ease} from '../../motion-kit';

export const MECHANIC_ID = 'endless-item-pile';
export const VISUAL_TECHNIQUE_ID = 'items-drop-until-frame-overflows';
export const COMPOSITION_FAMILY_ID = 'physical-accumulation';
export const RESULT_HOLD_FRAMES = 40;

export const ANIMATION_NARRATIVE = {
  START: 'Eine leere Fläche, auf der noch nichts liegt',
  MECHANISM: 'Ein Gegenstand nach dem anderen fällt herein und der Stapel wächst',
  RESULT: 'Der Stapel läuft oben aus dem Bild — die Liste hört nie auf',
};

export const PREMIUM_VISUAL_NARRATIVE = {
  HERO: 'Der wachsende Stapel Alltagsgegenstände',
  SUPPORT: 'Handy, Brille, Koffer, Rad als die immer gleichen Kandidaten',
  MATERIAL: 'Metall, Glas, Hartschale, Gummi — lauter ersetzbare Dinge',
  DEPTH: 'Der Stapel baut sich nach vorn und nach oben auf',
};

/** Jeder Gegenstand fällt an seinen Platz im Stapel. Alles bleibt in y 180-990. */
const ITEMS = [
  {key: 'phone', label: 'Handy', x: 700, rest: 760, start: 6},
  {key: 'glasses', label: 'Brille', x: 880, rest: 660, start: 34},
  {key: 'case', label: 'Koffer', x: 640, rest: 560, start: 62},
  {key: 'wheel', label: 'Fahrrad', x: 900, rest: 450, start: 90},
  {key: 'more1', label: '', x: 720, rest: 350, start: 118},
  {key: 'more2', label: '', x: 860, rest: 260, start: 142},
  {key: 'more3', label: '', x: 780, rest: 186, start: 164},
];

export const YouTubeVisual05Animation: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <YouTubePhysicalStage>
      {ITEMS.map((item) => {
        // Kanal 1 — der Gegenstand fällt von oben an seine Position im Stapel.
        const drop = ease(frame, item.start, item.start + 22);
        const y = interpolate(drop, [0, 1], [150, item.rest]);
        // Kanal 2 — je höher der Stapel, desto kleiner und blasser die Neuzugänge.
        const fade = item.label === '' ? 0.55 : 1;

        return (
          <div
            key={item.key}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              transform: `translate(${item.x}px, ${y}px)`,
              opacity: drop * fade,
            }}
          >
            {item.key === 'phone' ? <PhysicalPhone x={0} y={0} scale={0.62} rotate={-8} /> : null}
            {item.key !== 'phone' ? (
              <PhysicalObject
                x={0}
                y={0}
                width={item.label === '' ? 150 : 190}
                height={item.label === '' ? 70 : 92}
                material="neutral"
                radius={18}
                rotateZ={item.start % 2 === 0 ? -6 : 5}
              >
                {item.label ? (
                  <div style={{padding: '22px 18px', fontSize: 26, fontWeight: 900, color: '#142019'}}>{item.label}</div>
                ) : null}
              </PhysicalObject>
            ) : null}
          </div>
        );
      })}

      <div style={{position: 'absolute', left: 250, top: 820, opacity: ease(frame, 150, 176)}}>
        <PhysicalTag material="warning">und so weiter</PhysicalTag>
      </div>
    </YouTubePhysicalStage>
  );
};
