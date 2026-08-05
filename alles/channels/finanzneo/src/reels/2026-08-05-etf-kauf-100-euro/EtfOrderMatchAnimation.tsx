import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  AnimationSafeArea,
  ETF_COLORS,
  GlowPill,
  SceneBackground,
  clamp01,
  pop,
  progress,
  sceneProgress,
} from './visual';

const Phone: React.FC<{orderProgress: number}> = ({orderProgress}) => (
  <div
    style={{
      position: 'absolute',
      left: 28,
      top: 306,
      width: 216,
      height: 410,
      borderRadius: 42,
      background: 'linear-gradient(145deg, #29362D, #0A110D)',
      border: '4px solid rgba(255,255,255,0.22)',
      boxShadow: '0 34px 70px rgba(0,0,0,0.48), inset 0 0 0 5px rgba(255,255,255,0.035)',
      transform: `perspective(900px) rotateY(-11deg) translateX(${-18 * orderProgress}px)`,
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 14,
        borderRadius: 31,
        background: 'linear-gradient(180deg, #0B2315, #06110A)',
        overflow: 'hidden',
      }}
    >
      <div style={{position: 'absolute', top: 28, left: 24, right: 24, fontSize: 22, color: ETF_COLORS.muted, fontWeight: 800}}>Broker</div>
      <div style={{position: 'absolute', top: 92, left: 24, fontSize: 42, fontWeight: 950, color: ETF_COLORS.text}}>100 €</div>
      <div
        style={{
          position: 'absolute',
          left: 24,
          right: 24,
          bottom: 48,
          height: 78,
          borderRadius: 22,
          background: ETF_COLORS.green,
          color: '#06120A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 26,
          fontWeight: 950,
          boxShadow: `0 0 ${22 + orderProgress * 24}px rgba(98,245,154,${0.25 + orderProgress * 0.35})`,
        }}
      >
        ETF KAUFEN
      </div>
    </div>
  </div>
);

const BrokerGate: React.FC<{open: number}> = ({open}) => (
  <div
    style={{
      position: 'absolute',
      left: 318,
      top: 270,
      width: 178,
      height: 490,
      borderRadius: 38,
      background: 'linear-gradient(180deg, rgba(23,55,35,0.98), rgba(7,18,11,0.98))',
      border: `2px solid rgba(98,245,154,${0.22 + open * 0.45})`,
      boxShadow: `0 26px 80px rgba(0,0,0,0.42), 0 0 ${40 * open}px rgba(98,245,154,0.28)`,
      overflow: 'hidden',
    }}
  >
    <div style={{position: 'absolute', top: 28, left: 0, right: 0, textAlign: 'center', color: ETF_COLORS.green, fontSize: 22, fontWeight: 950, letterSpacing: 2}}>BROKER</div>
    <div
      style={{
        position: 'absolute',
        top: 102,
        bottom: 72,
        left: 56,
        right: 56,
        borderRadius: 24,
        background: `linear-gradient(180deg, rgba(98,245,154,${0.06 + open * 0.15}), rgba(98,245,154,${0.15 + open * 0.22}))`,
        border: `2px solid rgba(98,245,154,${0.2 + open * 0.55})`,
      }}
    />
    {[0, 1, 2].map((index) => (
      <div
        key={index}
        style={{
          position: 'absolute',
          left: 34,
          right: 34,
          top: 148 + index * 92,
          height: 10,
          borderRadius: 99,
          background: 'rgba(255,255,255,0.08)',
        }}
      />
    ))}
  </div>
);

const Rail: React.FC<{
  top: number;
  color: string;
  label: string;
  reverse?: boolean;
}> = ({top, color, label, reverse = false}) => (
  <div style={{position: 'absolute', left: 540, right: 26, top, height: 138}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 55, height: 18, borderRadius: 99, background: 'rgba(255,255,255,0.1)'}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 99, background: `linear-gradient(${reverse ? '270deg' : '90deg'}, transparent, ${color}55, transparent)`}} />
    </div>
    <div style={{position: 'absolute', top: 0, [reverse ? 'right' : 'left']: 0}}>
      <GlowPill color={color}>{label}</GlowPill>
    </div>
    {[0, 1, 2, 3].map((index) => (
      <div
        key={index}
        style={{
          position: 'absolute',
          top: 49,
          left: 42 + index * 110,
          width: 12,
          height: 30,
          borderRadius: 5,
          background: 'rgba(255,255,255,0.16)',
        }}
      />
    ))}
  </div>
);

const OrderCapsule: React.FC<{
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
  color: string;
  label: string;
  amount: string;
  opacity?: number;
  glow?: number;
}> = ({x, y, scale = 1, rotate = 0, color, label, amount, opacity = 1, glow = 1}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 174,
      height: 94,
      borderRadius: 32,
      opacity,
      transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotate}deg)`,
      transformOrigin: '50% 50%',
      background: `linear-gradient(145deg, ${color}, ${color}B0)`,
      color: '#06120A',
      border: '2px solid rgba(255,255,255,0.38)',
      boxShadow: `0 18px 48px rgba(0,0,0,0.42), 0 0 ${34 * glow}px ${color}77`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 20,
    }}
  >
    <div style={{fontSize: 20, fontWeight: 950, letterSpacing: 1.2}}>{label}</div>
    <div style={{fontSize: 31, fontWeight: 950, marginTop: 2}}>{amount}</div>
  </div>
);

export const EtfOrderMatchAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const t = sceneProgress(frame, durationInFrames);

  const eject = progress(t, 0.03, 0.18);
  const throughBroker = progress(t, 0.14, 0.36);
  const enterHall = progress(t, 0.30, 0.49);
  const search = progress(t, 0.43, 0.68, Easing.inOut(Easing.cubic));
  const sellerEnter = progress(t, 0.66, 0.83);
  const match = progress(t, 0.79, 0.91, Easing.out(Easing.back(1.5)));
  const packageExit = progress(t, 0.90, 1);

  const orderX = t < 0.18
    ? interpolate(eject, [0, 1], [222, 304])
    : t < 0.36
      ? interpolate(throughBroker, [0, 1], [304, 478])
      : t < 0.68
        ? interpolate(search, [0, 1], [520, 782])
        : interpolate(match, [0, 1], [782, 722]);
  const orderY = t < 0.36 ? 515 : interpolate(enterHall, [0, 1], [515, 455]);

  const sellerX = interpolate(sellerEnter, [0, 1], [1035, 722]);
  const sellerY = 455;
  const lockScale = 0.82 + pop(frame, Math.round(durationInFrames * 0.79), fps) * 0.18;
  const pulse = Math.sin(frame / 4) * 0.5 + 0.5;
  const exitX = interpolate(packageExit, [0, 1], [722, 1040]);
  const cameraX = interpolate(enterHall, [0, 1], [0, -42], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <SceneBackground accent={ETF_COLORS.green}>
      <AnimationSafeArea>
        <AbsoluteFill
          style={{
            transform: `translateX(${cameraX}px) scale(${1 + enterHall * 0.025})`,
            transformOrigin: '50% 50%',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 46,
              background: 'linear-gradient(160deg, rgba(14,35,22,0.94), rgba(5,14,8,0.92))',
              border: `1px solid ${ETF_COLORS.line}`,
              boxShadow: 'inset 0 0 90px rgba(0,0,0,0.38), 0 34px 90px rgba(0,0,0,0.44)',
            }}
          />

          <Phone orderProgress={eject} />
          <BrokerGate open={throughBroker} />

          <div
            style={{
              position: 'absolute',
              left: 522,
              right: 18,
              top: 76,
              bottom: 74,
              opacity: enterHall,
              borderRadius: 38,
              background: 'linear-gradient(145deg, rgba(18,42,27,0.92), rgba(7,18,11,0.95))',
              border: `1px solid rgba(104,184,255,${0.18 + enterHall * 0.2})`,
              overflow: 'hidden',
            }}
          >
            <div style={{position: 'absolute', top: 28, left: 32, fontSize: 24, color: ETF_COLORS.blue, fontWeight: 950, letterSpacing: 2}}>HANDELSPLATZ</div>
            <Rail top={186} color={ETF_COLORS.green} label="KAUFORDER" />
            <Rail top={406} color={ETF_COLORS.gold} label="VERKAUFSANGEBOT" reverse />
            <div
              style={{
                position: 'absolute',
                left: 62,
                right: 62,
                top: 360,
                height: 3,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.26), transparent)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: 48,
                bottom: 42,
                color: ETF_COLORS.muted,
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              Preis + Menge müssen passen
            </div>
          </div>

          <OrderCapsule
            x={orderX}
            y={orderY}
            color={ETF_COLORS.green}
            label="KAUF"
            amount="100 €"
            scale={0.88 + eject * 0.12}
            glow={0.5 + search * 0.5}
          />

          <OrderCapsule
            x={sellerX}
            y={sellerY}
            color={ETF_COLORS.gold}
            label="VERKAUF"
            amount="1 Anteil"
            opacity={sellerEnter}
            scale={0.9 + sellerEnter * 0.1}
            glow={0.5 + sellerEnter * 0.5}
          />

          {match > 0.02 ? (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: 722,
                  top: 455,
                  width: 242,
                  height: 132,
                  transform: `translate(-50%, -50%) scale(${lockScale})`,
                  borderRadius: 42,
                  background: 'linear-gradient(145deg, #D9FFE5, #62F59A)',
                  color: '#06120A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  opacity: match * (1 - packageExit),
                  zIndex: 40,
                  boxShadow: `0 0 ${50 + pulse * 26}px rgba(98,245,154,0.56), 0 24px 60px rgba(0,0,0,0.48)`,
                }}
              >
                <div style={{fontSize: 24, fontWeight: 950, letterSpacing: 2}}>MATCH</div>
                <div style={{fontSize: 40, fontWeight: 950, marginTop: 2}}>AUSGEFÜHRT</div>
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: exitX,
                  top: 455,
                  width: 218,
                  height: 112,
                  transform: 'translate(-50%, -50%)',
                  borderRadius: 36,
                  background: 'linear-gradient(145deg, #D9FFE5, #62F59A)',
                  color: '#06120A',
                  display: packageExit > 0.02 ? 'flex' : 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 30,
                  fontWeight: 950,
                  opacity: clamp01(packageExit * 1.4),
                  zIndex: 41,
                  boxShadow: '0 20px 56px rgba(0,0,0,0.5), 0 0 38px rgba(98,245,154,0.38)',
                }}
              >
                TRANSAKTION
              </div>
            </>
          ) : null}
        </AbsoluteFill>
      </AnimationSafeArea>
    </SceneBackground>
  );
};
