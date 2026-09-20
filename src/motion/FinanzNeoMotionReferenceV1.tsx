import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {ANIMATION_COLORS, C, CLAMP, FORMAT, REEL_STYLE} from '../brand/tokens';
import {
  PhysicalAccount,
  PhysicalBill,
  PhysicalCoinStack,
  PhysicalObject,
  PhysicalReserveTank,
  PhysicalWasher,
  PremiumPhysicalStage,
} from './physical';
import {FN_MOTION, motionProgress, motionValue} from './tokens';

const SCENE_FRAMES = 90;
export const FINANZNEO_MOTION_REFERENCE_FRAMES = SCENE_FRAMES * 4;

const ReferenceHeader: React.FC<{number: string; title: string; note: string}> = ({number, title, note}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: FN_MOTION.springs.precise});
  return (
    <div
      style={{
        position: 'absolute',
        top: REEL_STYLE.header.top,
        left: REEL_STYLE.header.left,
        right: REEL_STYLE.header.right,
        color: C.white,
        textAlign: 'center',
        opacity: interpolate(enter, [0, 1], [0, 1], CLAMP),
        transform: `translateY(${interpolate(enter, [0, 1], [20, 0], CLAMP)}px)`,
      }}
    >
      <div style={{fontSize: 22, fontWeight: 900, letterSpacing: 4, color: C.gray}}>{number}</div>
      <div style={{marginTop: 10, fontSize: 54, lineHeight: 1, fontWeight: 950, letterSpacing: -1.8}}>{title}</div>
      <div style={{marginTop: 14, fontSize: 24, fontWeight: 750, color: C.gray}}>{note}</div>
    </div>
  );
};

const ResultLabel: React.FC<{children: React.ReactNode; progress: number; color?: string}> = ({children, progress, color = C.white}) => (
  <div
    style={{
      position: 'absolute',
      left: 110,
      right: 110,
      bottom: 44,
      textAlign: 'center',
      fontSize: 35,
      lineHeight: 1.05,
      fontWeight: 950,
      color,
      opacity: progress,
      transform: `translateY(${(1 - progress) * 18}px)`,
    }}
  >
    {children}
  </div>
);

const GrowthScene: React.FC = () => {
  const frame = useCurrentFrame();
  const action = motionProgress(frame, 14, 58);
  const result = motionProgress(frame, 58, 70);
  const accountEnter = motionProgress(frame, 5, 20);
  return (
    <AbsoluteFill>
      <ReferenceHeader number="MOTION 01" title="Wachstum wird aufgebaut" note="STATE → ACTION → RESULT" />
      <PremiumPhysicalStage>
        <PhysicalAccount x={530} y={315} balance="10.000 €" progress={accountEnter} label="START" />
        <PhysicalCoinStack x={165} y={340} progress={action} coins={9} role="money" />
        <div
          style={{
            position: 'absolute',
            left: 420,
            top: 445,
            width: 150,
            height: 20,
            borderRadius: 999,
            background: C.gold,
            opacity: action,
            transform: `scaleX(${action})`,
            transformOrigin: 'left center',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 540,
            top: 415,
            width: 0,
            height: 0,
            borderTop: '38px solid transparent',
            borderBottom: '38px solid transparent',
            borderLeft: `64px solid ${C.gold}`,
            opacity: action,
            transform: `translateX(${(1 - action) * -28}px)`,
          }}
        />
        <ResultLabel progress={result} color={ANIMATION_COLORS.money}>Mehr Kapital entsteht sichtbar aus wiederholten Einzahlungen.</ResultLabel>
      </PremiumPhysicalStage>
    </AbsoluteFill>
  );
};

const FeeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const machine = motionProgress(frame, 5, 18);
  const transfer = motionProgress(frame, 18, 55);
  const result = motionProgress(frame, 55, 68);
  const inputX = motionValue(frame, 18, 55, 20, 310);
  const inputOpacity = interpolate(transfer, [0, 0.72, 1], [1, 1, 0], CLAMP);
  return (
    <AbsoluteFill>
      <ReferenceHeader number="MOTION 02" title="Kosten nehmen sichtbar etwas weg" note="Keine Chart-Metapher, sondern physische Ursache/Wirkung" />
      <PremiumPhysicalStage>
        <PhysicalWasher x={380} y={205} progress={machine} role="warning" />
        <div style={{position: 'absolute', left: inputX, top: 350, opacity: inputOpacity}}>
          <PhysicalBill x={0} y={0} progress={1} value="100 €" />
        </div>
        <PhysicalBill x={704} y={350} progress={result} value="82 €" role="money" />
        <PhysicalObject
          x={520}
          y={motionValue(frame, 46, 66, 385, 650)}
          width={120}
          height={70}
          depth={12}
          radius={18}
          role="warning"
          opacity={result}
          rotate={motionValue(frame, 46, 66, 0, 18)}
        >
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontSize: 25, fontWeight: 950}}>18 €</div>
        </PhysicalObject>
        <ResultLabel progress={result} color={C.negativeLt}>Der Unterschied ist das sichtbare Ergebnis der Kosten.</ResultLabel>
      </PremiumPhysicalStage>
    </AbsoluteFill>
  );
};

const RebalanceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const action = motionProgress(frame, 15, 62);
  const result = motionProgress(frame, 62, 74);
  const leftFill = interpolate(action, [0, 1], [0.82, 0.7], CLAMP);
  const rightFill = interpolate(action, [0, 1], [0.18, 0.3], CLAMP);
  const coinX = motionValue(frame, 15, 62, 315, 715);
  const coinY = interpolate(action, [0, 0.5, 1], [405, 300, 405], CLAMP);
  return (
    <AbsoluteFill>
      <ReferenceHeader number="MOTION 03" title="Rebalancing ist ein Transfer" note="Ein Objekt bewegt sich, zwei Zustände ändern sich gemeinsam" />
      <PremiumPhysicalStage>
        <PhysicalReserveTank x={110} y={210} fill={leftFill} label={result > 0.5 ? 'AKTIEN 70 %' : 'AKTIEN 82 %'} role="positive" />
        <PhysicalReserveTank x={710} y={210} fill={rightFill} label={result > 0.5 ? 'ANLEIHEN 30 %' : 'ANLEIHEN 18 %'} role="money" />
        <PhysicalObject x={coinX} y={coinY} width={118} height={74} depth={14} radius={999} role="money" rotate={motionValue(frame, 15, 62, -8, 8)}>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4a2d00', fontSize: 38, fontWeight: 950}}>€</div>
        </PhysicalObject>
        <ResultLabel progress={result} color={C.accentLt}>Die Zielgewichtung wird durch einen konkreten Transfer wiederhergestellt.</ResultLabel>
      </PremiumPhysicalStage>
    </AbsoluteFill>
  );
};

const ResultLockScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const settle = spring({frame: frame - 8, fps, config: FN_MOTION.springs.heavy});
  const result = motionProgress(frame, 36, 50);
  const ring = interpolate(settle, [0, 1], [0.84, 1], CLAMP);
  return (
    <AbsoluteFill>
      <ReferenceHeader number="MOTION 04" title="Ergebnis bekommt Ruhe" note={`Result-Hold ≥ ${FN_MOTION.timing.resultHold} Frames`} />
      <PremiumPhysicalStage>
        <div style={{position: 'absolute', left: 292, top: 230, width: 496, height: 330, transform: `scale(${ring})`, opacity: Math.min(1, settle)}}>
          <div
            style={{
              position: 'absolute',
              inset: -26,
              borderRadius: 62,
              border: `7px solid ${C.accent}`,
              opacity: result,
              boxShadow: `0 0 44px rgba(0,210,106,${0.18 * result})`,
            }}
          />
          <PhysicalAccount x={33} y={32} balance="121.997 €" progress={Math.min(1, settle)} role="positive" label="ERGEBNIS" />
        </div>
        <PhysicalObject x={464} y={590} width={152} height={96} depth={14} radius={999} role="positive" opacity={result} scale={0.86 + 0.14 * result}>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#05311c', fontSize: 48, fontWeight: 950}}>✓</div>
        </PhysicalObject>
        <ResultLabel progress={result} color={C.accentLt}>Nach der Hauptaktion bleibt das Ergebnis stabil lesbar.</ResultLabel>
      </PremiumPhysicalStage>
    </AbsoluteFill>
  );
};

export const FinanzNeoMotionReferenceV1: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#000000', fontFamily: 'Arial, Helvetica, sans-serif', overflow: 'hidden'}}>
    <Sequence from={0} durationInFrames={SCENE_FRAMES} premountFor={FORMAT.fps}>
      <GrowthScene />
    </Sequence>
    <Sequence from={SCENE_FRAMES} durationInFrames={SCENE_FRAMES} premountFor={FORMAT.fps}>
      <FeeScene />
    </Sequence>
    <Sequence from={SCENE_FRAMES * 2} durationInFrames={SCENE_FRAMES} premountFor={FORMAT.fps}>
      <RebalanceScene />
    </Sequence>
    <Sequence from={SCENE_FRAMES * 3} durationInFrames={SCENE_FRAMES} premountFor={FORMAT.fps}>
      <ResultLockScene />
    </Sequence>
  </AbsoluteFill>
);
