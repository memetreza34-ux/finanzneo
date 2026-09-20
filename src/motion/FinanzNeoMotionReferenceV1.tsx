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
  PhysicalCalendarPage,
  PhysicalCoinStack,
  PhysicalObject,
  PhysicalReserveTank,
  PhysicalWasher,
  PremiumPhysicalStage,
} from './physical';
import {FN_MOTION, motionProgress, motionValue} from './tokens';

const SCENE_FRAMES = 90;
const REFERENCE_SCENES = 10;
export const FINANZNEO_MOTION_REFERENCE_FRAMES = SCENE_FRAMES * REFERENCE_SCENES;

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
      <div style={{marginTop: 10, fontSize: 52, lineHeight: 1, fontWeight: 950, letterSpacing: -1.8}}>{title}</div>
      <div style={{marginTop: 14, fontSize: 23, fontWeight: 750, color: C.gray}}>{note}</div>
    </div>
  );
};

const ResultLabel: React.FC<{children: React.ReactNode; progress: number; color?: string}> = ({children, progress, color = C.white}) => (
  <div
    style={{
      position: 'absolute',
      left: 90,
      right: 90,
      bottom: 44,
      textAlign: 'center',
      fontSize: 34,
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

const FlowArrow: React.FC<{left: number; top: number; width: number; progress: number; role?: 'money' | 'positive' | 'warning'}> = ({left, top, width, progress, role = 'money'}) => {
  const color = role === 'positive' ? C.accent : role === 'warning' ? C.negativeLt : C.gold;
  return (
    <div style={{position: 'absolute', left, top, width: width + 62, height: 76, opacity: progress}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 28,
          width,
          height: 18,
          borderRadius: 999,
          background: color,
          transform: `scaleX(${progress})`,
          transformOrigin: 'left center',
          boxShadow: `0 8px 18px rgba(0,0,0,0.3)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: width - 2,
          top: 4,
          width: 0,
          height: 0,
          borderTop: '34px solid transparent',
          borderBottom: '34px solid transparent',
          borderLeft: `62px solid ${color}`,
          transform: `translateX(${(1 - progress) * -24}px)`,
        }}
      />
    </div>
  );
};

const GrowthScene: React.FC = () => {
  const frame = useCurrentFrame();
  const action = motionProgress(frame, 14, 58);
  const result = motionProgress(frame, 58, 70);
  const accountEnter = motionProgress(frame, 5, 20);
  return (
    <AbsoluteFill>
      <ReferenceHeader number="MOTION 01" title="Wachstum wird aufgebaut" note="Einzahlungen erzeugen sichtbar mehr Kapital" />
      <PremiumPhysicalStage>
        <PhysicalAccount x={530} y={315} balance="10.000 €" progress={accountEnter} label="START" />
        <PhysicalCoinStack x={165} y={340} progress={action} coins={9} role="money" />
        <FlowArrow left={420} top={417} width={122} progress={action} />
        <ResultLabel progress={result} color={ANIMATION_COLORS.money}>Wachstum entsteht durch sichtbaren Kapitalaufbau.</ResultLabel>
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
      <ReferenceHeader number="MOTION 02" title="Kosten nehmen sichtbar etwas weg" note="Physische Ursache und messbares Ergebnis" />
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
          grounding={result}
        >
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white, fontSize: 25, fontWeight: 950}}>18 €</div>
        </PhysicalObject>
        <ResultLabel progress={result} color={C.negativeLt}>Der fehlende Teil ist als Kostenverlust sichtbar.</ResultLabel>
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
      <ReferenceHeader number="MOTION 03" title="Rebalancing ist ein Transfer" note="Ein Wert bewegt sich, zwei Zustände ändern sich" />
      <PremiumPhysicalStage>
        <PhysicalReserveTank x={110} y={210} fill={leftFill} label={result > 0.5 ? 'AKTIEN 70 %' : 'AKTIEN 82 %'} role="positive" />
        <PhysicalReserveTank x={710} y={210} fill={rightFill} label={result > 0.5 ? 'ANLEIHEN 30 %' : 'ANLEIHEN 18 %'} role="money" />
        <PhysicalObject x={coinX} y={coinY} width={118} height={74} depth={14} radius={999} role="money" rotate={motionValue(frame, 15, 62, -8, 8)} grounding={0}>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4a2d00', fontSize: 38, fontWeight: 950}}>€</div>
        </PhysicalObject>
        <ResultLabel progress={result} color={C.accentLt}>Der Transfer stellt die Zielgewichtung wieder her.</ResultLabel>
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
      <ReferenceHeader number="MOTION 04" title="Ergebnis bekommt Ruhe" note={`Result-Hold mindestens ${FN_MOTION.timing.resultHold} Frames`} />
      <PremiumPhysicalStage>
        <div style={{position: 'absolute', left: 292, top: 230, width: 496, height: 330, transform: `scale(${ring})`, opacity: Math.min(1, settle)}}>
          <div
            style={{
              position: 'absolute',
              inset: -26,
              borderRadius: 62,
              border: `7px solid ${C.accent}`,
              opacity: result,
            }}
          />
          <PhysicalAccount x={33} y={32} balance="121.997 €" progress={Math.min(1, settle)} role="positive" label="ERGEBNIS" />
        </div>
        <PhysicalObject x={464} y={590} width={152} height={96} depth={14} radius={999} role="positive" opacity={result} scale={0.86 + 0.14 * result} grounding={result}>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#05311c', fontSize: 48, fontWeight: 950}}>✓</div>
        </PhysicalObject>
        <ResultLabel progress={result} color={C.accentLt}>Nach der Hauptaktion bleibt das Resultat stabil lesbar.</ResultLabel>
      </PremiumPhysicalStage>
    </AbsoluteFill>
  );
};

const SplitScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = motionProgress(frame, 6, 20);
  const split = motionProgress(frame, 20, 58);
  const result = motionProgress(frame, 58, 72);
  const leftX = motionValue(frame, 20, 58, 375, 120);
  const rightX = motionValue(frame, 20, 58, 375, 630);
  const leftScale = interpolate(split, [0, 1], [1, 0.86], CLAMP);
  const rightScale = interpolate(split, [0, 1], [1, 0.72], CLAMP);
  return (
    <AbsoluteFill>
      <ReferenceHeader number="MOTION 05" title="Aufteilung wird physisch getrennt" note="Ein Kapitalblock wird zu zwei klaren Anteilen" />
      <PremiumPhysicalStage>
        <PhysicalBill x={375} y={315} value="100 %" progress={enter * (1 - split)} />
        <PhysicalBill x={leftX} y={335} value="70 %" progress={split} scale={leftScale} role="positive" />
        <PhysicalBill x={rightX} y={335} value="30 %" progress={split} scale={rightScale} role="money" />
        <PhysicalObject x={474} y={220} width={132} height={112} depth={18} radius={30} role="neutral" opacity={split} grounding={0}>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111', fontSize: 46, fontWeight: 950}}>Y</div>
        </PhysicalObject>
        <ResultLabel progress={result} color={C.white}>Allokation wird als echte Trennung verständlich.</ResultLabel>
      </PremiumPhysicalStage>
    </AbsoluteFill>
  );
};

const AccountTransferScene: React.FC = () => {
  const frame = useCurrentFrame();
  const accounts = motionProgress(frame, 4, 18);
  const transfer = motionProgress(frame, 18, 62);
  const result = motionProgress(frame, 62, 74);
  const billX = motionValue(frame, 18, 62, 175, 600);
  const billY = interpolate(transfer, [0, 0.5, 1], [485, 340, 485], CLAMP);
  return (
    <AbsoluteFill>
      <ReferenceHeader number="MOTION 06" title="Überweisung ist ein Weg" note="Geld verlässt einen Ort und kommt an einem anderen an" />
      <PremiumPhysicalStage>
        <PhysicalAccount x={48} y={250} balance={result > 0.5 ? '4.000 €' : '5.000 €'} progress={accounts} label="GIRO" />
        <PhysicalAccount x={602} y={250} balance={result > 0.5 ? '11.000 €' : '10.000 €'} progress={accounts} role="positive" label="DEPOT" />
        <PhysicalObject x={billX} y={billY} width={170} height={92} depth={14} radius={22} role="money" opacity={transfer} grounding={0}>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4a2d00', fontSize: 34, fontWeight: 950}}>1.000 €</div>
        </PhysicalObject>
        <ResultLabel progress={result} color={C.accentLt}>Der Zielwert ändert sich erst nach dem sichtbaren Transfer.</ResultLabel>
      </PremiumPhysicalStage>
    </AbsoluteFill>
  );
};

const ShockBufferScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = motionProgress(frame, 5, 20);
  const shock = motionProgress(frame, 20, 56);
  const result = motionProgress(frame, 56, 72);
  const warningX = motionValue(frame, 20, 56, -160, 365);
  const reserveFill = interpolate(shock, [0, 1], [0.8, 0.48], CLAMP);
  return (
    <AbsoluteFill>
      <ReferenceHeader number="MOTION 07" title="Reserve fängt einen Schock ab" note="Risiko trifft zuerst den Puffer statt das Depot" />
      <PremiumPhysicalStage>
        <PhysicalReserveTank x={420} y={205} fill={reserveFill} label="NOTGROSCHEN" role="positive" />
        <PhysicalAccount x={690} y={300} balance="10.000 €" progress={enter} label="DEPOT" />
        <PhysicalObject x={warningX} y={330} width={190} height={132} depth={22} radius={28} role="warning" opacity={shock} rotate={motionValue(frame, 20, 56, -8, 0)} grounding={shock}>
          <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: C.white, fontWeight: 950}}>
            <div style={{fontSize: 46}}>!</div>
            <div style={{fontSize: 22, marginTop: 6}}>AUSGABE</div>
          </div>
        </PhysicalObject>
        <ResultLabel progress={result} color={C.accentLt}>Der Puffer sinkt – das Depot bleibt unberührt.</ResultLabel>
      </PremiumPhysicalStage>
    </AbsoluteFill>
  );
};

const ComparisonScene: React.FC = () => {
  const frame = useCurrentFrame();
  const base = motionProgress(frame, 5, 18);
  const action = motionProgress(frame, 18, 60);
  const result = motionProgress(frame, 60, 74);
  return (
    <AbsoluteFill>
      <ReferenceHeader number="MOTION 08" title="Vergleich zeigt zwei Ergebnisse" note="Gleicher Start, unterschiedliche Endzustände" />
      <PremiumPhysicalStage>
        <div style={{position: 'absolute', left: 120, top: 225, opacity: base}}>
          <PhysicalCoinStack x={0} y={160} progress={action} coins={5} role="warning" />
          <div style={{position: 'absolute', left: 22, top: 610, width: 250, textAlign: 'center', color: C.negativeLt, fontSize: 31, fontWeight: 950}}>69.000 €</div>
        </div>
        <div style={{position: 'absolute', left: 650, top: 100, opacity: base}}>
          <PhysicalCoinStack x={0} y={160} progress={action} coins={9} role="money" />
          <div style={{position: 'absolute', left: 18, top: 610, width: 250, textAlign: 'center', color: C.gold, fontSize: 31, fontWeight: 950}}>91.000 €</div>
        </div>
        <ResultLabel progress={result} color={C.gold}>Die Differenz ist als unterschiedliche Masse sichtbar.</ResultLabel>
      </PremiumPhysicalStage>
    </AbsoluteFill>
  );
};

const TimeCompoundingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const calendar = motionProgress(frame, 4, 18);
  const time = motionProgress(frame, 18, 62);
  const result = motionProgress(frame, 62, 74);
  const stackProgress = interpolate(time, [0, 1], [0.18, 1], CLAMP);
  const pageX = motionValue(frame, 18, 62, 105, 28);
  const pageOpacity = interpolate(time, [0, 0.78, 1], [1, 1, 0.2], CLAMP);
  return (
    <AbsoluteFill>
      <ReferenceHeader number="MOTION 09" title="Zeit macht Wachstum sichtbar" note="Kalender vergeht, Kapital bleibt und wächst weiter" />
      <PremiumPhysicalStage>
        <div style={{position: 'absolute', left: pageX, top: 250, opacity: pageOpacity}}>
          <PhysicalCalendarPage x={0} y={0} month="JAN" year={time > 0.55 ? '2036' : '2026'} progress={calendar} />
        </div>
        <FlowArrow left={355} top={395} width={150} progress={time} role="positive" />
        <PhysicalCoinStack x={650} y={260} progress={stackProgress} coins={10} role="money" />
        <ResultLabel progress={result} color={C.gold}>Zeit wird nicht als Linie, sondern als wachsender Bestand erklärt.</ResultLabel>
      </PremiumPhysicalStage>
    </AbsoluteFill>
  );
};

const PositiveResolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = motionProgress(frame, 4, 18);
  const fund = motionProgress(frame, 18, 58);
  const result = motionProgress(frame, 58, 72);
  const fill = interpolate(fund, [0, 1], [0.12, 0.72], CLAMP);
  const billX = motionValue(frame, 18, 58, 80, 395);
  const billOpacity = interpolate(fund, [0, 0.8, 1], [1, 1, 0], CLAMP);
  return (
    <AbsoluteFill>
      <ReferenceHeader number="MOTION 10" title="Lösung verändert den Zustand" note="Nicht nur grün markieren – die Ursache wird vorher gezeigt" />
      <PremiumPhysicalStage>
        <div style={{position: 'absolute', left: billX, top: 360, opacity: billOpacity}}>
          <PhysicalBill x={0} y={0} value="500 €" progress={enter} />
        </div>
        <PhysicalReserveTank x={445} y={205} fill={fill} label={result > 0.5 ? 'PUFFER GEFÜLLT' : 'PUFFER'} role="positive" />
        <PhysicalAccount x={705} y={305} balance="10.000 €" progress={enter} role="positive" label="DEPOT" />
        <ResultLabel progress={result} color={C.accentLt}>Ein gefüllter Puffer schafft einen stabilen Zielzustand.</ResultLabel>
      </PremiumPhysicalStage>
    </AbsoluteFill>
  );
};

const SCENES = [
  GrowthScene,
  FeeScene,
  RebalanceScene,
  ResultLockScene,
  SplitScene,
  AccountTransferScene,
  ShockBufferScene,
  ComparisonScene,
  TimeCompoundingScene,
  PositiveResolutionScene,
] as const;

export const FinanzNeoMotionReferenceV1: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#000000', fontFamily: 'Arial, Helvetica, sans-serif', overflow: 'hidden'}}>
    {SCENES.map((Scene, index) => (
      <Sequence key={index} from={index * SCENE_FRAMES} durationInFrames={SCENE_FRAMES} premountFor={FORMAT.fps}>
        <Scene />
      </Sequence>
    ))}
  </AbsoluteFill>
);
