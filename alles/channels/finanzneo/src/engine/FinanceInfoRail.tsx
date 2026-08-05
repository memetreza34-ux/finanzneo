import React from 'react';
import {ChevronRight, CircleDot} from 'lucide-react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const FinanceInfoRail: React.FC<{
  details?: string[];
}> = ({details = []}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const visibleDetails = details.slice(0, 4);

  if (!visibleDetails.length) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 12,
        maxWidth: 940,
        margin: '0 auto',
      }}
    >
      {visibleDetails.map((detail, index) => {
        const start = Math.round(fps * (0.55 + index * 0.5));
        const reveal = spring({
          frame: Math.max(0, frame - start),
          fps,
          config: {damping: 18, stiffness: 150},
        });
        const opacity = interpolate(reveal, [0, 1], [0, 1]);

        return (
          <React.Fragment key={`${detail}-${index}`}>
            {index > 0 && (
              <ChevronRight
                size={24}
                strokeWidth={2.3}
                style={{
                  color: 'rgba(245,247,244,0.42)',
                  opacity,
                  flexShrink: 0,
                }}
              />
            )}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                padding: '14px 18px',
                borderRadius: 20,
                background: 'rgba(5, 21, 11, 0.90)',
                border: '1.5px solid color-mix(in srgb, var(--accent) 28%, transparent)',
                boxShadow: '0 14px 34px rgba(0,0,0,0.28)',
                color: '#F5F7F4',
                fontSize: 25,
                lineHeight: 1.05,
                fontWeight: 760,
                opacity,
                transform: `translateY(${(1 - reveal) * 22}px) scale(${0.94 + reveal * 0.06})`,
              }}
            >
              <CircleDot
                size={23}
                strokeWidth={2.5}
                style={{color: 'var(--accent)', flexShrink: 0}}
              />
              <span>{detail}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
