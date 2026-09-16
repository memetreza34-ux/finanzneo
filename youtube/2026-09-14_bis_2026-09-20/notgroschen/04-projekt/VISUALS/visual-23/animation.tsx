import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp01, COLORS, frameAt, MotionStage, PhysicalCoinStack, PhysicalObject, progressBetween, YouTubePhysicalStage} from '../../motion-kit';

export const MECHANIC_ID = 'savings-rate-timefield';
export const VISUAL_TECHNIQUE_ID = 'rate-speed-comparison';
export const COMPOSITION_FAMILY_ID = 'data-viz';
export const ANIMATION_NARRATIVE = {START:'Drei leere Stapel, ein gemeinsames Ziel', MECHANISM:'Jede Rate legt Geld nach, unterschiedlich schnell', RESULT:'Alle erreichen dasselbe Ziel, nur zu verschiedenen Zeitpunkten'};

/** Beispielraten aus dem Skript. Die Zielhöhe ist für alle drei dieselbe. */
const RATES = [
  {label: '50 €', share: 0.45, y: 300},
  {label: '100 €', share: 0.72, y: 480},
  {label: '200 €', share: 1.0, y: 660},
];

export const YouTubeVisual23Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  // Kein Fortschrittsbalken: echtes Geld stappelt sich unterschiedlich schnell
  // auf dieselbe Ziellinie. Was man vergleicht, ist die Zeit bis dorthin.
  const fill = progressBetween(frame, durationInFrames, 0.10, 0.82);
  const targetLine = progressBetween(frame, durationInFrames, 0.04, 0.16);

  return <MotionStage>
    {/* Gemeinsame Ziellinie, gegen die alle drei laufen. */}
    <div style={{
      position: 'absolute',
      left: 1360,
      top: 260,
      width: 6,
      height: 480 * targetLine,
      backgroundColor: COLORS.green,
      opacity: 0.55,
    }} />
    <div style={{position: 'absolute', left: 1400, top: 258, fontSize: 28, color: COLORS.green, opacity: targetLine}}>Ziel</div>

    <YouTubePhysicalStage>
      {RATES.map((rate, index) => {
        const reached = clamp01(fill / rate.share);
        const arrive = spring({frame: frame - frameAt(durationInFrames, 0.10 + rate.share * 0.72), fps, config: {damping: 16, stiffness: 130}});
        const x = interpolate(reached, [0, 1], [330, 1300]);
        return (
          <React.Fragment key={rate.label}>
            {/* Sichtbare Bahn, damit der zurueckgelegte Weg lesbar wird. */}
            <PhysicalObject
              x={330}
              y={rate.y + 34}
              width={990}
              height={8}
              material="structure"
              opacity={0.5}
            />
            <PhysicalObject
              x={180}
              y={rate.y}
              width={130}
              height={92}
              material={reached >= 1 ? 'positive' : 'money'}
            >
              <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: 900}}>
                {rate.label}
              </div>
            </PhysicalObject>
            <PhysicalCoinStack
              x={x}
              y={rate.y - 96 - arrive * 10}
              count={Math.max(1, Math.round(1 + reached * 6))}
              scale={0.85}
            />
          </React.Fragment>
        );
      })}
    </YouTubePhysicalStage>
  </MotionStage>;
};
