import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {PhysicalCoinStack, PhysicalTag, YouTubePhysicalStage} from '../../motion-kit';

export const MECHANIC_ID = 'income-drops-to-remainder';
export const VISUAL_TECHNIQUE_ID = 'stack-shrinks-to-a-fraction';
export const COMPOSITION_FAMILY_ID = 'physical-shrink';
export const RESULT_HOLD_FRAMES = 48;

export const ANIMATION_NARRATIVE = {
  START: 'Ein voller Geldstapel steht für 2.200 Euro Einkommen',
  MECHANISM: 'Der Stapel sackt auf die Höhe zusammen, die bleibt',
  RESULT: 'Von 2.200 bleiben 400 — die fehlenden 1.800 stehen als markierte Lücke daneben',
};

export const PREMIUM_VISUAL_NARRATIVE = {
  HERO: 'Der zusammensackende Geldstapel',
  SUPPORT: 'Die markierte Lücke, die übrig bleibt',
  MATERIAL: 'Gold für das Geld, Warnrot für die Lücke',
  DEPTH: 'Stapel vorn, Lückenmarkierung dahinter',
};

const ramp = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

const BASE_Y = 880;
const FULL_HEIGHT = 520;
const REST_HEIGHT = 95;

export const YouTubeVisual19Animation: React.FC = () => {
  const frame = useCurrentFrame();

  // Kanal 1 — der volle Stapel steht zuerst.
  const full = ramp(frame, 0, 26);
  // Kanal 2 — er sackt auf den Rest zusammen.
  const collapse = ramp(frame, 48, 96);
  const height = interpolate(collapse, [0, 1], [FULL_HEIGHT, REST_HEIGHT]);
  // Kanal 3 — die Lücke wird danach markiert.
  const gap = ramp(frame, 100, 138);

  return (
    <YouTubePhysicalStage>
      {/* Der Stapel selbst: echte Münzen, deren Anzahl mit der Höhe sinkt. */}
      {[0, 1, 2, 3, 4, 5].map((level) => {
        const levelTop = BASE_Y - (level + 1) * (height / 6);
        const visible = level < Math.round((height / FULL_HEIGHT) * 6) ? 1 : 0;
        return (
          <div key={level} style={{position: 'absolute', left: 0, top: 0, transform: `translate(640px, ${levelTop}px)`, opacity: full * visible}}> // zone-ok: relativ zum Container in der Zone
            <PhysicalCoinStack x={0} y={0} count={4} scale={1.25} />
          </div>
        );
      })}

      <div style={{position: 'absolute', left: 620, top: BASE_Y + 28, opacity: full}}>
        <PhysicalTag material="money">{collapse > 0.6 ? '400 € bleiben' : '2.200 € netto'}</PhysicalTag>
      </div>

      {/* Die Lücke steht als eigener markierter Raum daneben. */}
      <div style={{
        position: 'absolute', left: 1080, top: BASE_Y - FULL_HEIGHT,
        width: 320, height: `${gap * (FULL_HEIGHT - REST_HEIGHT)}px`,
        border: '4px dashed #FF9B72', borderRadius: 14, opacity: gap,
      }} />
      <div style={{position: 'absolute', left: 1100, top: BASE_Y - FULL_HEIGHT - 64, opacity: gap}}>
        <PhysicalTag material="warning">1.800 € fehlen</PhysicalTag>
      </div>
    </YouTubePhysicalStage>
  );
};
