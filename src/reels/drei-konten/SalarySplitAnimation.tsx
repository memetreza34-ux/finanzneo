import React from 'react';
import {spring, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, a} from '../../brand';
import {SCENE_COPY} from './config';
import {Caption, SceneBackground, clamp, clamp01} from './shared';

const AccountCard: React.FC<{
  label: string;
  amount?: string;
  icon: string;
  delay: number;
  active?: boolean;
}> = ({label, amount, icon, delay, active = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reveal = clamp01(spring({
    frame: frame - delay,
    fps,
    config: {damping: 17, stiffness: 170, mass: 0.75},
  }));

  return (
    <div
      style={{
        width: 286,
        minHeight: 300,
        borderRadius: 34,
        padding: '34px 28px',
        background: active ? a(C.accent, 0.17) : 'rgba(255,255,255,0.055)',
        border: `2px solid ${active ? a(C.accentLt, 0.62) : 'rgba(255,255,255,0.12)'}`,
        boxShadow: active
          ? `0 22px 70px ${a(C.accent, 0.2)}`
          : '0 22px 70px rgba(0,0,0,.22)',
        transform: `translateY(${(1 - reveal) * 80}px) scale(${0.84 + reveal * 0.16})`,
        opacity: reveal,
        textAlign: 'center',
      }}
    >
      <div style={{fontSize: 76, lineHeight: 1}}>{icon}</div>
      <div
        style={{
          fontFamily: FONT.title,
          fontSize: 62,
          color: active ? C.accentLt : C.white,
          marginTop: 20,
          letterSpacing: 1.5,
        }}
      >
        {label}
      </div>
      {amount ? (
        <div
          style={{
            fontFamily: FONT.body,
            fontWeight: 800,
            fontSize: 38,
            color: C.gold,
            marginTop: 10,
          }}
        >
          {amount}
        </div>
      ) : null}
    </div>
  );
};

export const SalarySplitAnimation: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const drop = clamp01(spring({
    frame,
    fps,
    config: {damping: 18, stiffness: 140, mass: 0.8},
    durationInFrames: 42,
  }));
  const split = clamp01(spring({
    frame: frame - 32,
    fps,
    config: {damping: 20, stiffness: 155, mass: 0.75},
  }));
  const coinY = interpolate(drop, [0, 1], [-140, 500], clamp);
  const lineProgress = interpolate(split, [0, 1], [0, 1], clamp);

  return (
    <SceneBackground>
      <div
        style={{
          position: 'absolute',
          top: 365,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: FONT.title,
          fontSize: 104,
          color: C.white,
          letterSpacing: 2,
        }}
      >
        GEHALT <span style={{color: C.accent}}>SOFORT AUFTEILEN</span>
      </div>

      <div
        style={{
          position: 'absolute',
          top: coinY,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 182,
          height: 182,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          background: `radial-gradient(circle at 35% 28%, ${C.goldLt}, ${C.gold} 55%, #A96F00 100%)`,
          border: '10px solid rgba(255,255,255,.25)',
          boxShadow: `0 22px 80px ${a(C.gold, 0.34)}`,
          color: '#382400',
          fontFamily: FONT.title,
          fontSize: 78,
          zIndex: 4,
        }}
      >
        €
      </div>

      <div
        style={{
          position: 'absolute',
          top: 910,
          left: '50%',
          transform: `translateX(-50%) scale(${0.7 + split * 0.3})`,
          width: 210,
          height: 132,
          borderRadius: 30,
          display: 'grid',
          placeItems: 'center',
          background: C.accent,
          color: C.bg,
          fontFamily: FONT.body,
          fontWeight: 900,
          fontSize: 34,
          boxShadow: `0 20px 80px ${a(C.accent, 0.35)}`,
          opacity: split,
          zIndex: 5,
        }}
      >
        ZAHLTAG
      </div>

      {[-1, 0, 1].map((direction) => (
        <div
          key={direction}
          style={{
            position: 'absolute',
            top: 1032,
            left: '50%',
            width: Math.abs(direction) === 1 ? 310 : 8,
            height: Math.abs(direction) === 1 ? 8 : 166,
            background: C.accent,
            transformOrigin: direction < 0 ? 'right center' : 'left center',
            transform:
              direction === 0
                ? `translateX(-4px) scaleY(${lineProgress})`
                : `translateX(${direction < 0 ? -310 : 0}px) rotate(${direction * 18}deg) scaleX(${lineProgress})`,
            boxShadow: `0 0 20px ${a(C.accent, 0.5)}`,
            borderRadius: 999,
            opacity: split,
          }}
        />
      ))}

      <div
        style={{
          position: 'absolute',
          top: 1210,
          left: 80,
          right: 80,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <AccountCard label="FIXKOSTEN" icon="01" delay={48} />
        <AccountCard label="RÜCKLAGE" icon="02" delay={57} active />
        <AccountCard label="WOCHE" icon="03" delay={66} />
      </div>
      <Caption kicker={SCENE_COPY[3].kicker} text={SCENE_COPY[3].caption} durationInFrames={durationInFrames} />
    </SceneBackground>
  );
};

