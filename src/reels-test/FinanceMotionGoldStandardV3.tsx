import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  C,
  Captions,
  PhysicalAccount,
  PhysicalBill,
  PhysicalReserveTank,
  PhysicalWasher,
  PremiumPhysicalStage,
  SceneHeader,
  type CaptionWord,
} from '../brand';

export const FINANCE_MOTION_GOLD_STANDARD_V3_FRAMES = 180;

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const progress = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {
    ...clamp,
    easing: ease,
  });

const makeCaptionWords = (text: string): CaptionWord[] => {
  const words = text.trim().split(/\s+/);
  const start = 0.28;
  const end = 5.45;
  const step = (end - start) / Math.max(1, words.length);

  return words.map((word, index) => ({
    word,
    start: start + step * index,
    end: start + step * (index + 0.84),
  }));
};

const MovingCoin: React.FC<{
  index: number;
  frame: number;
}> = ({index, frame}) => {
  const p = progress(frame, 100 + index * 5, 126 + index * 5);
  const opacity = interpolate(p, [0, 0.08, 0.9, 1], [0, 1, 1, 0], clamp);
  const x = interpolate(p, [0, 1], [520, 635], clamp);
  const y = interpolate(p, [0, 0.5, 1], [690 - index * 10, 540 - index * 8, 475], {
    ...clamp,
    easing: Easing.bezier(0.35, 0, 0.18, 1),
  });
  const scale = interpolate(p, [0, 0.55, 1], [0.82, 1.08, 0.92], clamp);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 72,
        height: 28,
        borderRadius: '50%',
        background: 'linear-gradient(180deg,#FFF0AD 0%,#E4B733 42%,#8E6210 100%)',
        border: '2px solid #FFE59B',
        boxShadow: '0 12px 20px rgba(0,0,0,0.35), inset 0 2px 0 rgba(255,255,255,0.42)',
        opacity,
        scale,
        rotate: `${interpolate(p, [0, 1], [-8, 10], clamp)}deg`,
        zIndex: 8,
      }}
    />
  );
};

export const FinanceMotionGoldStandardV3: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const billReveal = progress(frame, 22, 52);
  const billTravel = progress(frame, 44, 84);
  const reserveIntercept = progress(frame, 68, 104);
  const payment = progress(frame, 101, 136);
  const result = spring({
    frame: frame - 136,
    fps,
    config: {damping: 22, stiffness: 150, mass: 0.9},
  });

  const cameraX = interpolate(
    frame,
    [0, 42, 92, 142, FINANCE_MOTION_GOLD_STANDARD_V3_FRAMES - 1],
    [92, 58, 0, -42, -42],
    {...clamp, easing: ease},
  );
  const cameraY = interpolate(
    frame,
    [0, 55, 110, 145],
    [18, 0, -10, -18],
    {...clamp, easing: ease},
  );
  const cameraScale = interpolate(
    frame,
    [0, 46, 105, 145],
    [1.08, 1.035, 1, 1.035],
    {...clamp, easing: ease},
  );

  const washerScale = interpolate(frame, [0, 34, 96], [1.08, 1.03, 0.95], {
    ...clamp,
    easing: ease,
  });

  const billX = interpolate(billTravel, [0, 1], [306, 575], clamp);
  const billY = interpolate(billTravel, [0, 0.52, 1], [458, 390, 408], clamp);
  const billScale = interpolate(billReveal, [0, 1], [0.7, 1], clamp);
  const billOpacity = interpolate(billReveal, [0, 0.15, 1], [0, 1, 1], clamp);
  const billRotate = interpolate(billTravel, [0, 1], [-13, -2], clamp);

  const reserveX = interpolate(reserveIntercept, [0, 1], [430, 418], clamp);
  const reserveY = interpolate(reserveIntercept, [0, 1], [860, 545], clamp);
  const reserveScale = interpolate(reserveIntercept, [0, 1], [0.86, 1], clamp);
  const reserveOpacity = interpolate(reserveIntercept, [0, 0.12, 1], [0, 1, 1], clamp);
  const reserveFill = interpolate(payment, [0, 1], [0.82, 0.61], clamp);

  const accountProtection = progress(frame, 128, 147);
  const accountScale = interpolate(result, [0, 0.5, 1], [1, 1.045, 1], clamp);
  const resultOpacity = interpolate(result, [0, 0.72, 1], [0, 1, 1], clamp);
  const resultY = interpolate(result, [0, 1], [28, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        background: '#000',
        color: C.white,
        fontFamily: 'Arial, Helvetica, sans-serif',
        overflow: 'hidden',
      }}
    >
      <SceneHeader title="Notgroschen fängt Reparaturkosten ab" icon="wallet" />

      <PremiumPhysicalStage>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: '50% 50%',
            translate: `${cameraX}px ${cameraY}px`,
            scale: cameraScale,
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 62,
              right: 62,
              bottom: 92,
              height: 110,
              borderRadius: '50%',
              background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.015) 52%, rgba(255,255,255,0) 76%)',
              filter: 'blur(12px)',
              translate: `${cameraX * -0.12}px ${cameraY * -0.08}px`,
              scale: 1.08,
            }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              translate: `${cameraX * -0.18}px ${cameraY * -0.12}px`,
            }}
          >
            <PhysicalWasher
              x={86}
              y={382}
              broken={frame < 144}
              scale={washerScale}
              opacity={1}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              inset: 0,
              translate: `${cameraX * -0.42}px ${cameraY * -0.28}px`,
            }}
          >
            <PhysicalAccount
              x={708}
              y={440}
              label="Girokonto"
              balance="2.450 €"
              state={accountProtection > 0.5 ? 'protected' : 'normal'}
              scale={accountScale}
              tilt={2}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              inset: 0,
              translate: `${cameraX * -0.72}px ${cameraY * -0.46}px`,
              zIndex: 6,
            }}
          >
            <PhysicalBill
              x={billX}
              y={billY}
              amount="480 €"
              label="Reparatur"
              rotate={billRotate}
              scale={billScale}
              opacity={billOpacity}
              paid={frame >= 136}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              inset: 0,
              translate: `${cameraX * -0.92}px ${cameraY * -0.58}px`,
              zIndex: 7,
            }}
          >
            <PhysicalReserveTank
              x={reserveX}
              y={reserveY}
              fill={reserveFill}
              label="Notgroschen"
              width={230}
              height={350}
              scale={reserveScale}
              opacity={reserveOpacity}
            />

            {[0, 1, 2, 3].map((index) => (
              <MovingCoin key={index} index={index} frame={frame} />
            ))}
          </div>

          <div
            style={{
              position: 'absolute',
              left: 630,
              top: 350,
              width: 430,
              height: 380,
              borderRadius: '50%',
              border: '5px solid rgba(108,255,181,0.64)',
              boxShadow: '0 0 0 18px rgba(12,122,71,0.08), 0 0 60px rgba(108,255,181,0.14)',
              opacity: interpolate(accountProtection, [0, 0.35, 1], [0, 0.42, 0.84], clamp),
              scale: interpolate(accountProtection, [0, 1], [0.88, 1], clamp),
              zIndex: 2,
            }}
          />
        </div>
      </PremiumPhysicalStage>

      <div
        style={{
          position: 'absolute',
          left: 110,
          right: 110,
          top: 1284,
          textAlign: 'center',
          opacity: resultOpacity,
          translate: `0 ${resultY}px`,
        }}
      >
        <div style={{fontSize: 34, fontWeight: 950, color: '#6CFFB5', letterSpacing: -0.6}}>
          Reparatur bezahlt. Girokonto bleibt geschützt.
        </div>
      </div>

      <Captions
        words={makeCaptionWords(
          'Der Notgroschen bezahlt die unerwartete Reparatur, ohne dass dein Alltag sofort ins Minus rutscht.',
        )}
      />
    </AbsoluteFill>
  );
};
