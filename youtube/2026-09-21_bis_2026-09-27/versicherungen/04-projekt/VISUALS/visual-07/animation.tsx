import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {PhysicalBill, PhysicalTag, YouTubePhysicalStage, ease} from '../../motion-kit';

export const MECHANIC_ID = 'small-bounces-large-caught';
export const VISUAL_TECHNIQUE_ID = 'two-sizes-meet-the-same-net';
export const COMPOSITION_FAMILY_ID = 'physical-threshold';
export const RESULT_HOLD_FRAMES = 44;

export const ANIMATION_NARRATIVE = {
  START: 'Ein gespanntes Netz liegt quer im Bild, darüber ist noch nichts',
  MECHANISM: 'Ein kleiner Beleg fällt darauf und springt ab, ein großer fällt und wird gehalten',
  RESULT: 'Nur der große Schaden liegt im Netz — dafür ist es da',
};

export const PREMIUM_VISUAL_NARRATIVE = {
  HERO: 'Das Netz, das nur den großen Schaden hält',
  SUPPORT: 'Ein kleiner und ein großer Schadensbeleg',
  MATERIAL: 'Gespanntes Seil gegen Papier',
  DEPTH: 'Netz im Vordergrund, fallende Belege dahinter',
};

const NET_Y = 700;

export const YouTubeVisual07Animation: React.FC = () => {
  const frame = useCurrentFrame();

  // Kanal 1 — das Netz spannt sich auf.
  const spun = ease(frame, 0, 24);

  // Kanal 2 — der kleine Beleg fällt und prallt ab.
  const smallDrop = ease(frame, 30, 58);
  const smallBounce = ease(frame, 58, 96);
  const smallY = interpolate(smallDrop, [0, 1], [210, NET_Y - 150])
    + Math.sin(smallBounce * Math.PI) * -120
    + smallBounce * 260;

  // Kanal 3 — der große Beleg fällt und wird gehalten; das Netz gibt nach.
  const largeDrop = ease(frame, 104, 150);
  const largeY = interpolate(largeDrop, [0, 1], [190, NET_Y - 250]);
  const sag = largeDrop * 54;

  return (
    <YouTubePhysicalStage>
      {/* Das Netz: gespannte Seile, die unter Last durchhängen. */}
      <div style={{position: 'absolute', left: 240, top: NET_Y, width: 1440, height: 200}}>
        {[0, 1, 2, 3, 4, 5].map((strand) => (
          <div
            key={strand}
            style={{
              position: 'absolute',
              left: `${strand * 19}%`,
              top: 0,
              width: `${spun * 24}%`,
              height: 9,
              borderRadius: 5,
              background: 'linear-gradient(90deg,#4B5459,#8E969C,#4B5459)',
              transform: `translateY(${sag}px) rotate(${(strand - 2.5) * 1.1}deg)`,
              opacity: spun,
            }}
          />
        ))}
        <div style={{
          position: 'absolute', left: 0, top: 0, width: `${spun * 100}%`, height: 9, borderRadius: 5, // zone-ok: relativ zum Container in der Zone
          background: 'linear-gradient(90deg,#6CFFB5,#0C7A47)',
          transform: `translateY(${sag * 1.15}px)`,
        }} />
      </div>

      <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(430px, ${smallY}px) scale(0.42)`, opacity: smallDrop}}> // zone-ok: relativ zum Container in der Zone
        <PhysicalBill x={0} y={0} amount="250 €" label="Kleiner Schaden" rotate={-6} />
      </div>

      <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(1060px, ${largeY}px) scale(1.18)`, opacity: largeDrop}}> // zone-ok: relativ zum Container in der Zone
        <PhysicalBill x={0} y={0} amount="480.000 €" label="Großer Schaden" rotate={3} />
      </div>

      <div style={{position: 'absolute', left: 300, top: 930, opacity: smallBounce}}>
        <PhysicalTag material="neutral">prallt ab</PhysicalTag>
      </div>
      <div style={{position: 'absolute', left: 1180, top: 930, opacity: ease(frame, 150, 176)}}>
        <PhysicalTag material="positive">wird gehalten</PhysicalTag>
      </div>
    </YouTubePhysicalStage>
  );
};
