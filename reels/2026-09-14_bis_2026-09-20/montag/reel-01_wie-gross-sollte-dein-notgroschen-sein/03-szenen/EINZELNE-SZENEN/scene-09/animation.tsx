import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ANIMATION_COLORS, PhysicalCalendarPage, PhysicalCoinStack, PhysicalTag, PremiumPhysicalStage} from '../../../../../../../src/design-system';

/**
 * MECHANIC_ID: three-calendar-auto-save-rhythm
 * PRIMARY_ACTION: Drei Monatskalender werden nacheinander aktiv; unter jedem Monat erscheint derselbe kleine Goldstapel und bleibt als sichtbarer Beleg der automatischen Sparroutine stehen.
 * ANIMATION_NARRATIVE
 * START: Nur der erste Kalender ist präsent und noch kein Monatsbetrag liegt darunter.
 * MECHANISM: SEP, OKT und NOV werden nacheinander aktiviert. Zu jedem Monatswechsel fällt exakt derselbe kleine Goldstapel an dieselbe relative Position unter den Kalender.
 * RESULT: Drei Kalender und drei identische Sparbeträge stehen als klare Wiederholung nebeneinander; AUTO JEDEN MONAT fasst nur die sichtbare Routine zusammen.
 * PREMIUM_VISUAL_NARRATIVE
 * HERO: Zeitliche Wiederholung über drei große physische Kalenderblätter — kein Konto, kein Reservetank und keine Geldbewegung zwischen zwei Karten.
 * SUPPORT: Eine zurückhaltende Zeitlinie verbindet die drei Monate; die Goldstapel zeigen den identischen Betrag.
 * MATERIAL: Warmes Ivory für Kalender, Emerald Monatskopf, Gold für den wiederholten Sparbetrag.
 * DEPTH: Drei große Monatsblätter verteilen sich gleichmäßig innerhalb X=125–955 und bleiben vollständig im sicheren Innenbereich.
 */
export const RESULT_HOLD_FRAMES = 24;
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};

export const Scene09Animation: React.FC<{durationFrames?:number}> = ({durationFrames=135}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const sep = spring({frame, fps, config:{damping:18, stiffness:110}, durationInFrames:22});
  const okt = spring({frame:Math.max(0,frame-34), fps, config:{damping:18, stiffness:110}, durationInFrames:22});
  const nov = spring({frame:Math.max(0,frame-68), fps, config:{damping:18, stiffness:110}, durationInFrames:22});
  const coin1 = interpolate(frame,[16,38],[0,1],clamp);
  const coin2 = interpolate(frame,[50,72],[0,1],clamp);
  const coin3 = interpolate(frame,[84,106],[0,1],clamp);
  const lineProgress = interpolate(frame,[12,98],[0,1],clamp);
  const resultIn = interpolate(frame,[102,Math.max(112,durationFrames-RESULT_HOLD_FRAMES)],[0,1],clamp);

  return (
    <PremiumPhysicalStage>
      <div style={{
        position:'absolute',left:160,top:770,width:720,height:8,
        borderRadius:999,background:'rgba(255,255,255,0.10)',overflow:'hidden',
      }}>
        <div style={{width:`${lineProgress*100}%`,height:'100%',borderRadius:999,background:ANIMATION_COLORS.positive}} />
      </div>

      <PhysicalCalendarPage x={125} y={465-(1-sep)*30} month="SEP" amount="+ 100 €" scale={0.90+sep*0.05} opacity={sep} rotate={-3} />
      <PhysicalCalendarPage x={435} y={465-(1-okt)*30} month="OKT" amount="+ 100 €" scale={0.90+okt*0.05} opacity={okt} rotate={0} />
      <PhysicalCalendarPage x={745} y={465-(1-nov)*30} month="NOV" amount="+ 100 €" scale={0.90+nov*0.05} opacity={nov} rotate={3} />

      <PhysicalCoinStack x={155} y={815-(1-coin1)*75} count={3} scale={0.50+coin1*0.06} opacity={coin1} />
      <PhysicalCoinStack x={465} y={815-(1-coin2)*75} count={3} scale={0.50+coin2*0.06} opacity={coin2} />
      <PhysicalCoinStack x={775} y={815-(1-coin3)*75} count={3} scale={0.50+coin3*0.06} opacity={coin3} />

      <div style={{
        position:'absolute',left:355,top:1040,
        opacity:resultIn,
        transform:`translateY(${(1-resultIn)*14}px) scale(${0.96+resultIn*0.04})`,
        color:ANIMATION_COLORS.positive,
      }}>
        <PhysicalTag material="positive" style={{fontSize:25}}>AUTO JEDEN MONAT</PhysicalTag>
      </div>
    </PremiumPhysicalStage>
  );
};
