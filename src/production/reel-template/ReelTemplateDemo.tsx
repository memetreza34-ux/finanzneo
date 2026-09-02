import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {
  ANIMATION_COLORS,
  AnimationStage,
  C,
  FINANCE_EXAMPLES,
  FONT,
  a,
  getEmergencyFundTarget,
  prog,
} from '../../design-system';
import {ReelTemplate} from './ReelTemplate';
import {
  getReelDurationInFrames,
  type ReelConfig,
} from './types';

const EMERGENCY_EXAMPLE = FINANCE_EXAMPLES.emergencyFund;
const EMERGENCY_FUND_TARGET = getEmergencyFundTarget();

const DemoEmergencyMechanism: React.FC = () => {
  const frame = useCurrentFrame();
  const expense = prog(frame, 8, 34);
  const transfer = prog(frame, 34, 72);
  const paid = prog(frame, 72, 104);

  return (
    <AnimationStage>
      <AbsoluteFill>
        <div style={{position:'absolute',left:110,top:650,width:260,height:180,borderRadius:34,background:a(C.negative,0.12),border:`2px solid ${a(C.negative,0.45)}`,opacity:expense,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT.title,fontSize:34,fontWeight:900,color:ANIMATION_COLORS.warning,textAlign:'center',padding:20}}>UNERWARTETE<br/>RECHNUNG</div>
        <div style={{position:'absolute',left:410,top:650,width:250,height:180,borderRadius:34,background:a(C.accent,0.10),border:`2px solid ${a(C.accent,0.42)}`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT.title,fontSize:34,fontWeight:900,color:ANIMATION_COLORS.focus,textAlign:'center'}}>NOTGROSCHEN</div>
        <div style={{position:'absolute',left:675,top:705,width:180,height:70,borderRadius:24,background:a(C.gold,0.10),border:`2px solid ${a(C.gold,0.42)}`,opacity:paid,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT.body,fontSize:28,fontWeight:900,color:ANIMATION_COLORS.money}}>BEZAHLT</div>
        <div style={{position:'absolute',left:360,top:720,width:300,height:18,borderRadius:9,background:a(C.whiteSoft,0.10),overflow:'hidden'}}><div style={{height:'100%',width:`${transfer*100}%`,background:ANIMATION_COLORS.focus}} /></div>
      </AbsoluteFill>
    </AnimationStage>
  );
};

export const REEL_TEMPLATE_DEMO_CONFIG: ReelConfig = {
  id: 'notgroschen-demo',
  title: 'Was ist ein Notgroschen?',
  fps: 30,
  disclaimer: 'BEISPIEL · KEINE ANLAGEBERATUNG',
  showSafeAreaGuide: true,
  beats: [
    {
      id: 'hook',
      type: 'hook',
      icon: 'wallet',
      durationInFrames: 240,
      background: 'premium',
      kicker: 'FINANZGRUNDLAGE',
      headline: 'EINE RECHNUNG',
      accent: 'UND DU BIST IM MINUS',
      subline: 'Genau davor schützt dich ein Notgroschen.',
    },
    {
      id: 'problem',
      type: 'explain',
      icon: 'warning',
      headerTone: 'warning',
      durationInFrames: 300,
      background: 'standard',
      kicker: 'DAS PROBLEM',
      headline: 'UNERWARTETE KOSTEN KOMMEN PLÖTZLICH',
      body: 'Eine kaputte Waschmaschine oder eine hohe Nachzahlung wartet nicht darauf, dass dein Gehalt kommt.',
      bullets: [
        'Reparatur oder Ersatz',
        'Nachzahlung oder Selbstbeteiligung',
        'Kurzfristiger Einkommensausfall',
      ],
    },
    {
      id: 'mechanism-animation',
      type: 'animation',
      animationId: 'emergency-mechanism',
      icon: 'repeat',
      durationInFrames: 180,
      background: 'standard',
      headline: 'Der Puffer übernimmt die Rechnung',
    },
    {
      id: 'example-number',
      type: 'number',
      icon: 'euro',
      headerTone: 'money',
      durationInFrames: 360,
      background: 'data',
      kicker: 'BEISPIEL',
      headline: 'WIE HOCH SOLLTE DER PUFFER SEIN?',
      label: `${EMERGENCY_EXAMPLE.targetMonths} notwendige Monatsausgaben`,
      value: EMERGENCY_FUND_TARGET,
      format: 'euro',
      detail: 'Das ist kein Pflichtwert, sondern ein verständlicher Startpunkt.',
      assumptions: `${EMERGENCY_EXAMPLE.monthlyNecessaryExpenses.toLocaleString('de-DE')} € notwendige Ausgaben × ${EMERGENCY_EXAMPLE.targetMonths} Monate`,
      sourceNote: EMERGENCY_EXAMPLE.disclosure,
    },
    {
      id: 'comparison',
      type: 'compare',
      icon: 'trending',
      durationInFrames: 390,
      background: 'data',
      kicker: 'DER UNTERSCHIED',
      headline: 'OHNE ODER MIT NOTGROSCHEN?',
      left: {
        label: 'Ohne Puffer',
        value: 'KREDIT',
        detail: 'Die Rechnung wird zu neuen Schulden.',
        tone: 'negative',
      },
      right: {
        label: 'Mit Puffer',
        value: 'BEZAHLT',
        detail: 'Die Rechnung wird gedeckt, ohne neue Schulden.',
        tone: 'positive',
      },
    },
    {
      id: 'solution',
      type: 'checklist',
      icon: 'check',
      durationInFrames: 390,
      background: 'standard',
      kicker: 'DIE LÖSUNG',
      headline: 'SO BAUST DU DEN NOTGROSCHEN AUF',
      items: [
        'Notwendige Monatsausgaben berechnen',
        'Persönlichen Zielbetrag festlegen',
        'Automatischen Dauerauftrag einrichten',
        'Geld getrennt und schnell verfügbar halten',
      ],
    },
    {
      id: 'cta',
      type: 'cta',
      icon: 'target',
      durationInFrames: 270,
      background: 'premium',
      kicker: 'DEIN NÄCHSTER SCHRITT',
      headline: 'BERECHNE DEINEN EIGENEN PUFFER',
      body: 'Starte klein. Entscheidend ist, dass du überhaupt einen finanziellen Abstand zu unerwarteten Rechnungen aufbaust.',
      keyword: 'NOTGROSCHEN',
      offer: 'Du erhältst die kostenlose Notgroschen-Checkliste.',
    },
  ],
};

export const REEL_TEMPLATE_DEMO_FRAMES = getReelDurationInFrames(
  REEL_TEMPLATE_DEMO_CONFIG,
);

export const ReelTemplateDemo: React.FC = () => (
  <ReelTemplate
    config={REEL_TEMPLATE_DEMO_CONFIG}
    customAnimations={{'emergency-mechanism': <DemoEmergencyMechanism />}}
  />
);
