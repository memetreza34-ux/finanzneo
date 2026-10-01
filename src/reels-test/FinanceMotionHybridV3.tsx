import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {
  C,
  Captions,
  PhysicalAccount,
  PhysicalBill,
  PhysicalObject,
  PremiumPhysicalStage,
  SceneHeader,
  type CaptionWord,
} from '../brand';

export const FINANCE_MOTION_HYBRID_V3_FRAMES = 180;

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const cinematic = Easing.bezier(0.16, 1, 0.3, 1);

const progress = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {
    ...clamp,
    easing: cinematic,
  });

const makeCaptionWords = (text: string): CaptionWord[] => {
  const words = text.trim().split(/\s+/);
  const start = 0.3;
  const end = 5.35;
  const step = (end - start) / Math.max(1, words.length);

  return words.map((word, index) => ({
    word,
    start: start + step * index,
    end: start + step * (index + 0.84),
  }));
};

const InsuranceBarrier: React.FC<{
  x: number;
  y: number;
  scale: number;
  opacity: number;
}> = ({x, y, scale, opacity}) => (
  <PhysicalObject
    x={x}
    y={y}
    width={250}
    height={320}
    material="structure"
    radius={62}
    rotateY={-6}
    scale={scale}
    opacity={opacity}
    style={{overflow: 'visible'}}
  >
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
      }}
    >
      <div
        style={{
          width: 96,
          height: 112,
          clipPath: 'polygon(50% 0%, 92% 16%, 84% 70%, 50% 100%, 16% 70%, 8% 16%)',
          background: 'linear-gradient(180deg,#B7FFD7 0%,#54F3A2 46%,#0C7A47 100%)',
          boxShadow: '0 16px 32px rgba(0,0,0,0.32)',
        }}
      />
      <div style={{fontSize: 31, fontWeight: 950, textAlign: 'center'}}>Versicherung</div>
      <div style={{fontSize: 20, fontWeight: 850, opacity: 0.78}}>fängt den Großschaden ab</div>
    </div>
  </PhysicalObject>
);

export const FinanceMotionHybridV3: React.FC = () => {
  const frame = useCurrentFrame();

  const imageEnter = progress(frame, 0, 26);
  const damageFocus = progress(frame, 18, 52);
  const billReveal = progress(frame, 34, 63);
  const billTravel = progress(frame, 54, 96);
  const barrierEnter = progress(frame, 72, 109);
  const absorb = progress(frame, 102, 132);
  const deductibleReveal = progress(frame, 125, 151);
  const result = progress(frame, 145, 164);

  const cameraX = interpolate(
    frame,
    [0, 48, 98, 142, 179],
    [42, 18, -18, -42, -42],
    {...clamp, easing: cinematic},
  );
  const cameraY = interpolate(
    frame,
    [0, 60, 118, 160],
    [20, 0, -12, -18],
    {...clamp, easing: cinematic},
  );
  const cameraScale = interpolate(
    frame,
    [0, 46, 105, 155],
    [1.07, 1.025, 1, 1.03],
    {...clamp, easing: cinematic},
  );

  const imageScale = interpolate(damageFocus, [0, 1], [1.08, 1.16], clamp);
  const imageX = interpolate(damageFocus, [0, 1], [0, -38], clamp);
  const imageOpacity = interpolate(imageEnter, [0, 0.16, 1], [0, 1, 1], clamp);

  const billX = interpolate(billTravel, [0, 1], [258, 522], clamp);
  const billY = interpolate(billTravel, [0, 0.56, 1], [542, 430, 446], clamp);
  const billScale = interpolate(billReveal, [0, 1], [0.72, 1], clamp) * interpolate(absorb, [0, 1], [1, 0.72], clamp);
  const billOpacity = interpolate(billReveal, [0, 0.12, 1], [0, 1, 1], clamp) * interpolate(absorb, [0.72, 1], [1, 0], clamp);

  const barrierY = interpolate(barrierEnter, [0, 1], [820, 458], clamp);
  const barrierScale = interpolate(barrierEnter, [0, 1], [0.78, 1], clamp);
  const barrierOpacity = interpolate(barrierEnter, [0, 0.12, 1], [0, 1, 1], clamp);

  const accountState = result > 0.35 ? 'protected' as const : 'normal' as const;
  const accountScale = interpolate(result, [0, 0.45, 1], [1, 1.04, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        background: '#000',
        color: C.white,
        fontFamily: 'Arial, Helvetica, sans-serif',
        overflow: 'hidden',
      }}
    >
      <SceneHeader title="Versicherung begrenzt große Schäden" icon="shield" />

      <PremiumPhysicalStage>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            translate: `${cameraX}px ${cameraY}px`,
            scale: cameraScale,
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 42,
              top: 330,
              width: 610,
              height: 600,
              borderRadius: 58,
              overflow: 'hidden',
              opacity: imageOpacity,
              boxShadow: '0 36px 80px rgba(0,0,0,0.58)',
              border: '1px solid rgba(255,255,255,0.12)',
              translate: `${imageX}px 0`,
              scale: imageScale,
              transformOrigin: '50% 55%',
            }}
          >
            <Img
              src={staticFile('experiments/image-world-consistency-v1/hybrid-test-v1/wasserschaden.webp')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, rgba(0,0,0,0.02) 48%, rgba(0,0,0,0.54) 100%)',
              }}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              left: 180,
              top: 770,
              width: 410,
              height: 120,
              borderRadius: '50%',
              background: 'radial-gradient(ellipse at center, rgba(62,158,221,0.26), rgba(62,158,221,0) 72%)',
              filter: 'blur(10px)',
              opacity: damageFocus,
              translate: `${cameraX * -0.14}px ${cameraY * -0.1}px`,
            }}
          />

          <div style={{position: 'absolute', inset: 0, translate: `${cameraX * -0.52}px ${cameraY * -0.32}px`, zIndex: 6}}>
            <PhysicalBill
              x={billX}
              y={billY}
              amount="18.000 €"
              label="Wasserschaden"
              rotate={interpolate(billTravel, [0, 1], [-12, -2], clamp)}
              scale={billScale}
              opacity={billOpacity}
            />
          </div>

          <div style={{position: 'absolute', inset: 0, translate: `${cameraX * -0.78}px ${cameraY * -0.46}px`, zIndex: 8}}>
            <InsuranceBarrier
              x={430}
              y={barrierY}
              scale={barrierScale}
              opacity={barrierOpacity}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              inset: 0,
              translate: `${cameraX * -0.92}px ${cameraY * -0.56}px`,
              zIndex: 9,
              opacity: deductibleReveal,
              scale: interpolate(deductibleReveal, [0, 1], [0.82, 1], clamp),
              transformOrigin: '790px 620px',
            }}
          >
            <PhysicalBill
              x={670}
              y={482}
              amount="500 €"
              label="Selbstbeteiligung"
              rotate={3}
              scale={0.78}
              opacity={1}
              paid={frame >= 151}
            />
          </div>

          <div style={{position: 'absolute', inset: 0, translate: `${cameraX * -0.34}px ${cameraY * -0.22}px`, zIndex: 4}}>
            <PhysicalAccount
              x={744}
              y={824}
              label="Alltagskonto"
              balance="2.450 €"
              state={accountState}
              scale={accountScale}
              tilt={2}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              left: 635,
              top: 745,
              width: 390,
              height: 310,
              borderRadius: '50%',
              border: '5px solid rgba(108,255,181,0.58)',
              boxShadow: '0 0 0 18px rgba(12,122,71,0.07), 0 0 62px rgba(108,255,181,0.12)',
              opacity: interpolate(result, [0, 0.35, 1], [0, 0.4, 0.82], clamp),
              scale: interpolate(result, [0, 1], [0.9, 1], clamp),
              zIndex: 2,
            }}
          />
        </div>
      </PremiumPhysicalStage>

      <div
        style={{
          position: 'absolute',
          left: 90,
          right: 90,
          top: 1270,
          textAlign: 'center',
          opacity: result,
          translate: `0 ${interpolate(result, [0, 1], [24, 0], clamp)}px`,
        }}
      >
        <div style={{fontSize: 33, fontWeight: 950, color: '#6CFFB5', letterSpacing: -0.6}}>
          18.000 € Schaden → nur 500 € treffen dein Budget.
        </div>
      </div>

      <Captions
        words={makeCaptionWords(
          'Beim Wasserschaden begrenzt die Versicherung den großen finanziellen Treffer auf deinen eigenen Anteil.',
        )}
      />
    </AbsoluteFill>
  );
};
