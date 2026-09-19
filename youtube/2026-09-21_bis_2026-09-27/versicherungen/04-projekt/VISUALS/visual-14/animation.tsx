import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {PhysicalBill, PhysicalTag, YouTubePhysicalStage, ease} from '../../motion-kit';

export const MECHANIC_ID = 'worst-case-not-likely-case';
export const VISUAL_TECHNIQUE_ID = 'rare-large-outweighs-frequent-small';
export const COMPOSITION_FAMILY_ID = 'physical-balance';
export const RESULT_HOLD_FRAMES = 50;

export const ANIMATION_NARRATIVE = {
  START: 'Eine Waage steht im Gleichgewicht, beide Schalen sind leer',
  MECHANISM: 'Viele kleine Belege sammeln sich links, dann fällt rechts ein einziger großer',
  RESULT: 'Die eine große Seite senkt sich tief — sie wiegt schwerer als alle kleinen',
};

export const PREMIUM_VISUAL_NARRATIVE = {
  HERO: 'Die kippende Waage',
  SUPPORT: 'Viele kleine Belege links, ein großer rechts',
  MATERIAL: 'Metall für die Waage, Papier für die Belege',
  DEPTH: 'Balken hinten, Schalen davor',
};

const PIVOT = {x: 960, y: 380};

export const YouTubeVisual14Animation: React.FC = () => {
  const frame = useCurrentFrame();

  // Kanal 1 — die kleinen Belege sammeln sich nacheinander an.
  const small = ease(frame, 14, 104);
  // Kanal 2 — der eine große Beleg fällt und kippt die Waage.
  const largeDrop = ease(frame, 112, 148);
  const tilt = largeDrop * 15;

  const armY = (side: number) => Math.sin((tilt * Math.PI) / 180) * 420 * side;
  // Beim Kippen schwingen die Schalen leicht zur Seite, statt starr zu bleiben.
  const swing = interpolate(largeDrop, [0, 1], [0, 26]);

  return (
    <YouTubePhysicalStage>
      {/* Der Waagebalken kippt um seinen Drehpunkt. */}
      <div style={{
        position: 'absolute', left: PIVOT.x - 440, top: PIVOT.y,
        width: 880, height: 14, borderRadius: 7,
        background: 'linear-gradient(90deg,#4B5459,#C9CFD1,#4B5459)',
        transform: `rotate(${tilt}deg)`, transformOrigin: 'center',
        boxShadow: '0 12px 22px rgba(0,0,0,0.4)',
      }} />
      <div style={{
        position: 'absolute', left: PIVOT.x - 16, top: PIVOT.y, width: 32, height: 300,
        background: 'linear-gradient(180deg,#8E969C,#3A4247)',
      }} />

      {/* Linke Schale: viele kleine Belege. */}
      <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(${380 - swing}px, ${PIVOT.y + 120 + armY(-1)}px)`}}> // zone-ok: relativ zum Container in der Zone
        {[0, 1, 2, 3, 4].map((item) => {
          const shown = ease(frame, 14 + item * 18, 34 + item * 18);
          return (
            <div key={item} style={{position: 'absolute', left: item * 26, top: -item * 22, opacity: shown, transform: 'scale(0.3)'}}>
              <PhysicalBill x={0} y={0} amount="120 €" label="klein" rotate={item % 2 === 0 ? -5 : 4} />
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 20, top: 150, opacity: small}}> // zone-ok: relativ zum Container in der Zone
          <PhysicalTag material="neutral">viele kleine</PhysicalTag>
        </div>
      </div>

      {/* Rechte Schale: ein einziger großer Beleg. */}
      <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(${1310 + swing}px, ${PIVOT.y + 120 + armY(1)}px)`, opacity: largeDrop}}> // zone-ok: relativ zum Container in der Zone
        <div style={{transform: 'scale(0.74)'}}>
          <PhysicalBill x={0} y={0} amount="480.000 €" label="einmal groß" rotate={3} />
        </div>
        <div style={{position: 'absolute', left: 20, top: 270}}>
          <PhysicalTag material="warning">einmal groß</PhysicalTag>
        </div>
      </div>
    </YouTubePhysicalStage>
  );
};
