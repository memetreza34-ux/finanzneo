import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp01, COLORS, frameAt, MotionStage, Panel, progressBetween} from '../../motion-kit';

export const MECHANIC_ID = 'recurring-month-cycle';
export const VISUAL_TECHNIQUE_ID = 'calendar-reserve-cycle';
export const COMPOSITION_FAMILY_ID = 'timeline';
export const ANIMATION_NARRATIVE = {START:'Erster Monat', MECHANISM:'Jeder Monatswechsel löst denselben Transfer aus', RESULT:'Reserve wächst durch Routine'};

const MONTHS = ['Monat 1', 'Monat 2', 'Monat 3'];
const CARD_X = [220, 560, 900];

export const YouTubeVisual24Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  // Drei identische Zyklen. Jeder Monat kippt weg, schiebt denselben Betrag nach
  // rechts und hebt die Reserve um eine Stufe. Die Wiederholung ist die Aussage.
  const cycles = MONTHS.map((label, index) => {
    const start = 0.10 + index * 0.24;
    const flip = progressBetween(frame, durationInFrames, start, start + 0.09);
    const send = progressBetween(frame, durationInFrames, start + 0.07, start + 0.18);
    const settled = spring({frame: frame - frameAt(durationInFrames, start + 0.18), fps, config: {damping: 16, stiffness: 140}});
    return {label, flip, send, settled};
  });

  const steps = cycles.reduce((sum, cycle) => sum + cycle.settled, 0);
  const fill = clamp01(steps / MONTHS.length);
  const closing = progressBetween(frame, durationInFrames, 0.82, 0.92);

  return <MotionStage>
    <div style={{position: 'absolute', left: 170, top: 150, fontSize: 32, fontWeight: 700, letterSpacing: 1.2, color: COLORS.gray}}>Einmal eingestellt</div>

    <div style={{position: 'absolute', left: 0, top: 300, width: 1180, height: 330, perspective: 1200}}>
      {cycles.map((cycle, index) => (
        <Panel key={cycle.label} style={{position: 'absolute', left: CARD_X[index], top: 0, width: 290, height: 250, padding: 40, transformOrigin: 'top center', transform: `rotateX(${-82 * cycle.flip}deg)`, opacity: 1 - cycle.flip * 0.75, borderColor: cycle.settled > 0.5 ? COLORS.green : COLORS.line}}>
          <div style={{fontSize: 30, color: COLORS.gray}}>Kalender</div>
          <div style={{fontSize: 56, fontWeight: 900, marginTop: 30}}>{cycle.label}</div>
        </Panel>
      ))}
      {cycles.map((cycle, index) => (
        <div key={`${cycle.label}-transfer`} style={{position: 'absolute', left: CARD_X[index] + 105, top: 285, width: 96, height: 54, borderRadius: 12, backgroundColor: COLORS.gold, opacity: cycle.send > 0 && cycle.send < 1 ? 1 : 0, transform: `translate(${interpolate(cycle.send, [0, 1], [0, 1420 - CARD_X[index] - 105])}px, ${interpolate(cycle.send, [0, 1], [0, 150])}px) scale(${interpolate(cycle.send, [0, 1], [1, 0.72])})`}}/>
      ))}
    </div>

    <Panel style={{position: 'absolute', left: 1400, top: 260, width: 360, height: 470, padding: 46, borderColor: COLORS.green}}>
      <div style={{fontSize: 36, fontWeight: 900}}>Notgroschen</div>
      <div style={{position: 'absolute', left: 46, right: 46, bottom: 46, height: 320, borderRadius: 24, border: `3px solid ${COLORS.line}`, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${fill * 100}%`, backgroundColor: COLORS.green}}/>
        {MONTHS.map((month, index) => (
          <div key={month} style={{position: 'absolute', left: 0, right: 0, bottom: `${((index + 1) / MONTHS.length) * 100}%`, height: 2, backgroundColor: COLORS.line}}/>
        ))}
      </div>
    </Panel>

    <div style={{position: 'absolute', left: 220, bottom: 140, fontSize: 34, color: COLORS.green, opacity: closing, transform: `translateY(${interpolate(closing, [0, 1], [18, 0])}px)`}}>Die Routine entscheidet, nicht die Motivation.</div>
  </MotionStage>;
};
