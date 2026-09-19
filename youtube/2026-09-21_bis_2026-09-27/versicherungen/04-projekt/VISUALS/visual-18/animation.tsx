import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {PhysicalObject, PhysicalTag, YouTubePhysicalStage, ease} from '../../motion-kit';

export const MECHANIC_ID = 'pension-below-the-line';
export const VISUAL_TECHNIQUE_ID = 'bar-stops-under-a-reference-line';
export const COMPOSITION_FAMILY_ID = 'data-viz';
export const RESULT_HOLD_FRAMES = 52;

export const ANIMATION_NARRATIVE = {
  START: 'Die Grundsicherungslinie wird quer durchs Bild gezogen',
  MECHANISM: 'Der Balken der Erwerbsminderungsrente wächst nach oben',
  RESULT: 'Er bleibt deutlich unter der Linie stehen, die er erreichen müsste',
};

export const PREMIUM_VISUAL_NARRATIVE = {
  HERO: 'Der Balken, der zu früh aufhört',
  SUPPORT: 'Die Linie, die er nicht erreicht',
  MATERIAL: 'Warnrot für den zu kurzen Balken',
  DEPTH: 'Linie hinten, Balken davor',
};

const BASE_Y = 900;
const LINE_Y = 380;

export const YouTubeVisual18Animation: React.FC = () => {
  const frame = useCurrentFrame();

  // Kanal 1 — die Referenzlinie wird gezogen.
  const line = ease(frame, 8, 44);
  // Kanal 2 — der Balken wächst und stoppt weit darunter.
  const grow = ease(frame, 48, 116);
  const height = grow * 240;

  return (
    <YouTubePhysicalStage>
      <div style={{
        position: 'absolute', left: 260, top: LINE_Y,
        width: `${line * 1400}px`, height: 5,
        background: 'linear-gradient(90deg,#FFF5D8,#E8E0CC)',
        transform: `translateY(${interpolate(line, [0, 1], [-22, 0])}px)`,
      }} />
      <div style={{position: 'absolute', left: 1180, top: LINE_Y - 66, opacity: line}}>
        <PhysicalTag material="neutral">Grundsicherungsniveau</PhysicalTag>
      </div>

      <div style={{
        position: 'absolute', left: 620, top: BASE_Y - height,
        width: 300, height: `${height}px`, borderRadius: 16,
        background: 'linear-gradient(180deg,#FF9B72 0%,#B9422D 76%,#641B13 100%)',
        boxShadow: '0 24px 44px rgba(0,0,0,0.44)',
      }} />
      <div style={{position: 'absolute', left: 640, top: BASE_Y - height - 64, opacity: grow}}>
        <PhysicalTag material="warning">rund 400 € / Monat</PhysicalTag>
      </div>

      <PhysicalObject x={260} y={BASE_Y} width={1400} height={8} material="neutral" radius={4} opacity={0.45} />

      <div style={{position: 'absolute', left: 1010, top: 520, opacity: ease(frame, 120, 150)}}>
        <PhysicalTag material="warning">Lücke</PhysicalTag>
      </div>
    </YouTubePhysicalStage>
  );
};
