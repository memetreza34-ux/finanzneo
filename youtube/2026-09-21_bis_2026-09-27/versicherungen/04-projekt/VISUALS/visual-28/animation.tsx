import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {PhysicalPolicy, PhysicalTag, YouTubePhysicalStage, ease} from '../../motion-kit';

export const MECHANIC_ID = 'small-premiums-add-up';
export const VISUAL_TECHNIQUE_ID = 'monthly-amounts-become-a-year';
export const COMPOSITION_FAMILY_ID = 'data-viz';
export const RESULT_HOLD_FRAMES = 48;

export const ANIMATION_NARRATIVE = {
  START: 'Drei kleine Monatsbeiträge von je 8 Euro',
  MECHANISM: 'Sie wiederholen sich zwölfmal und sammeln sich zu einer Jahressumme',
  RESULT: '288 Euro im Jahr stehen neben dem Beitrag einer ganzen Haftpflicht',
};

export const PREMIUM_VISUAL_NARRATIVE = {
  HERO: 'Die anwachsende Jahressumme',
  SUPPORT: 'Drei kleine Beiträge, zwölf Monate',
  MATERIAL: 'Papier für die Policen, Gold für die Summe',
  DEPTH: 'Monate links, Jahressumme rechts',
};

export const YouTubeVisual28Animation: React.FC = () => {
  const frame = useCurrentFrame();

  // Kanal 1 — die drei kleinen Policen liegen da.
  const shown = ease(frame, 0, 24);
  // Kanal 2 — die Monate laufen durch.
  const months = ease(frame, 30, 130);
  const monthCount = Math.round(months * 12);
  const total = Math.round(months * 288);
  // Kanal 3 — die Haftpflicht zum Vergleich.
  const compare = ease(frame, 138, 176);

  return (
    <YouTubePhysicalStage>
      {[0, 1, 2].map((slot) => (
        <div key={slot} style={{position: 'absolute', left: 0, top: 0, transform: `translate(${200 + slot * 200}px, 380px) scale(0.6)`, opacity: shown}}> // zone-ok: Position steckt im transform darunter
          <PhysicalPolicy x={0} y={0} label="8 € / Monat" rotate={slot === 1 ? 3 : -4} />
        </div>
      ))}

      <div style={{position: 'absolute', left: 250, top: 660, transform: `translateX(${interpolate(months, [0, 1], [0, 210])}px)`, opacity: months > 0 ? 1 : 0}}>
        <PhysicalTag material="neutral">{`Monat ${monthCount} von 12`}</PhysicalTag>
      </div>

      {/* Die Summe wächst als Säule mit. */}
      <div style={{
        position: 'absolute', left: 1020, top: 880 - months * 460,
        width: 300, height: `${months * 460}px`, borderRadius: 16,
        background: 'linear-gradient(180deg,#FFE59B 0%,#D5A72A 70%,#7A5610 100%)',
        boxShadow: '0 24px 44px rgba(0,0,0,0.42)',
      }} />
      <div style={{position: 'absolute', left: 1040, top: 880 - months * 460 - 64, opacity: months}}>
        <PhysicalTag material="money">{`${total} € im Jahr`}</PhysicalTag>
      </div>

      <div style={{position: 'absolute', left: 1420, top: 520, opacity: compare}}>
        <PhysicalTag material="positive">so viel wie eine ganze Haftpflicht</PhysicalTag>
      </div>
    </YouTubePhysicalStage>
  );
};
