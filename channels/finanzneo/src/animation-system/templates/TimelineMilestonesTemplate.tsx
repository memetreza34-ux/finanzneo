import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export type TimelineMilestone = {
  label: string;
  value: string;
};

export type TimelineMilestonesTemplateProps = {
  title?: string;
  milestones: TimelineMilestone[];
};

export type TimelineMilestoneState = {
  position: number;
  reveal: number;
  width: number;
};

const clamp01 = (value: number): number =>
  Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));

export const resolveTimelineMilestoneState = (
  index: number,
  count: number,
  progress: number,
): TimelineMilestoneState => {
  const safeCount = Math.max(1, Math.round(Number.isFinite(count) ? count : 1));
  const safeIndex = Math.max(
    0,
    Math.min(safeCount - 1, Math.round(Number.isFinite(index) ? index : 0)),
  );
  const position = safeCount <= 1 ? 0 : safeIndex / (safeCount - 1);
  const start = Math.max(0, position - 0.12);
  const end = Math.max(start + 0.02, Math.min(1, position + 0.02));
  const reveal = interpolate(clamp01(progress), [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return {
    position,
    reveal,
    width: Math.min(190, 820 / safeCount),
  };
};

export const TimelineMilestonesTemplate: React.FC<TimelineMilestonesTemplateProps> = ({
  title = 'Finanzielle Entwicklung',
  milestones,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{padding: 72, background: '#07120B', color: '#F5F7F4', fontFamily: 'Arial, sans-serif'}}>
      <div style={{fontSize: 34, fontWeight: 850, color: '#5CFF9A', letterSpacing: 2}}>{title}</div>
      <div style={{position: 'absolute', left: 108, right: 108, top: 460, height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.12)'}}>
        <div style={{height: '100%', width: `${progress * 100}%`, borderRadius: 999, background: '#5CFF9A', boxShadow: progress > 0 ? '0 0 28px rgba(92,255,154,0.42)' : 'none'}} />
      </div>
      <div style={{position: 'absolute', left: 88, right: 88, top: 370, display: 'flex', justifyContent: 'space-between'}}>
        {milestones.map((milestone, index) => {
          const state = resolveTimelineMilestoneState(index, milestones.length, progress);
          return (
            <div key={`${milestone.label}-${index}`} style={{width: state.width, textAlign: 'center', opacity: state.reveal, transform: `translateY(${(1 - state.reveal) * 34}px)`}}>
              <div style={{fontSize: 28, fontWeight: 850, color: '#AFC0B4'}}>{milestone.label}</div>
              <div style={{width: 32, height: 32, margin: '38px auto 26px', borderRadius: '50%', background: '#5CFF9A', border: '6px solid #143521', boxShadow: state.reveal > 0 ? '0 0 24px rgba(92,255,154,0.45)' : 'none'}} />
              <div style={{fontSize: 34, fontWeight: 950}}>{milestone.value}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
