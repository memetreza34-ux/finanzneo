import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp01, COLORS, frameAt, Icon, MotionStage, PhysicalBill, PhysicalReserveTank, progressBetween, YouTubePhysicalStage} from '../../motion-kit';

export const MECHANIC_ID = 'emergency-deplete-rebuild';
export const VISUAL_TECHNIQUE_ID = 'reserve-breathing-cycle';
export const COMPOSITION_FAMILY_ID = 'material-transformation';
export const ANIMATION_NARRATIVE = {START:'Volle Reserve', MECHANISM:'Der Notfall zieht Pegel ab, danach fuellen Raten ihn wieder auf', RESULT:'Reserve wieder auf Stand'};

export const YouTubeVisual26Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  // Der Pegel selbst ist die Aussage: erst faellt er, dann steigt er in Stufen
  // zurueck. Kein Balken, kein Textpfeil — ein Behaelter, der sich leert und fuellt.
  const drain = progressBetween(frame, durationInFrames, 0.12, 0.40);
  const refill = progressBetween(frame, durationInFrames, 0.52, 0.88);
  const level = clamp01(1 - 0.55 * drain + 0.5 * refill);

  const billLands = spring({frame: frame - frameAt(durationInFrames, 0.14), fps, config: {damping: 15, stiffness: 130}});
  const refillPulse = spring({frame: frame - frameAt(durationInFrames, 0.56), fps, config: {damping: 18, stiffness: 110}});

  return <MotionStage>
    <YouTubePhysicalStage>
      <PhysicalReserveTank x={700} y={300} fill={level} label="Notgroschen" width={300} height={430} />
      <PhysicalBill
        x={1180}
        y={340 + billLands * 40}
        amount="480 €"
        label="Reparatur"
        rotate={-6}
        scale={0.85 + billLands * 0.1}
        opacity={billLands}
        paid={drain > 0.8}
      />
    </YouTubePhysicalStage>

    {/* Die Rueckfuellung als drei sichtbare Stufen, nicht als Text. */}
    {[0.58, 0.70, 0.82].map((at, index) => {
      const step = progressBetween(frame, durationInFrames, at, at + 0.08);
      return <div key={at} style={{
        position: 'absolute',
        left: 620,
        top: 700 - index * 52,
        width: 60 * step,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.green,
        opacity: step,
      }} />;
    })}

    <div style={{position: 'absolute', left: 660, top: 790, display: 'flex', alignItems: 'center', gap: 16, opacity: refillPulse, transform: `translateY(${interpolate(refillPulse, [0, 1], [16, 0])}px)`}}>
      <Icon name="repeat" size={44} color={COLORS.green} stroke={2.2} />
      <span style={{fontSize: 34, fontWeight: 900, color: COLORS.green}}>wieder auffüllen</span>
    </div>
  </MotionStage>;
};
