import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from 'remotion';
import {
  C,
  Captions,
  PhysicalCoinStack,
  PhysicalObject,
  PremiumPhysicalStage,
  SceneHeader,
  type CaptionWord,
} from '../brand';

export const FINANCE_MOTION_ABSTRACT_V3_FRAMES = 180;

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
  const start = 0.28;
  const end = 5.35;
  const step = (end - start) / Math.max(1, words.length);

  return words.map((word, index) => ({
    word,
    start: start + step * index,
    end: start + step * (index + 0.84),
  }));
};

const sectors = [
  {label: 'Tech', x: 618, y: 370, material: 'warning' as const},
  {label: 'Industrie', x: 790, y: 570, material: 'structure' as const},
  {label: 'Gesundheit', x: 618, y: 790, material: 'positive' as const},
  {label: 'Konsum', x: 396, y: 655, material: 'neutral' as const},
];

const FlowCoin: React.FC<{
  frame: number;
  index: number;
}> = ({frame, index}) => {
  const target = sectors[index];
  const p = progress(frame, 50 + index * 8, 96 + index * 8);
  const x = interpolate(p, [0, 1], [355, target.x + 45], clamp);
  const y = interpolate(
    p,
    [0, 0.48, 1],
    [580, 490 - index * 18, target.y + 80],
    {...clamp, easing: Easing.bezier(0.34, 0, 0.22, 1)},
  );
  const opacity = interpolate(p, [0, 0.08, 0.9, 1], [0, 1, 1, 0], clamp);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 70,
        height: 27,
        borderRadius: '50%',
        background: 'linear-gradient(180deg,#FFF0AD 0%,#E4B733 42%,#8E6210 100%)',
        border: '2px solid #FFE59B',
        boxShadow: '0 12px 20px rgba(0,0,0,0.34), inset 0 2px 0 rgba(255,255,255,0.4)',
        opacity,
        rotate: `${interpolate(p, [0, 1], [-10, 12], clamp)}deg`,
        scale: interpolate(p, [0, 0.55, 1], [0.84, 1.08, 0.92], clamp),
        zIndex: 9,
      }}
    />
  );
};

export const FinanceMotionAbstractV3: React.FC = () => {
  const frame = useCurrentFrame();

  const concentration = progress(frame, 0, 34);
  const etfEnter = progress(frame, 28, 58);
  const spread = progress(frame, 48, 111);
  const shock = progress(frame, 108, 132);
  const recovery = progress(frame, 126, 151);
  const result = progress(frame, 145, 164);

  const cameraX = interpolate(
    frame,
    [0, 38, 92, 142, 179],
    [112, 74, 8, -34, -34],
    {...clamp, easing: cinematic},
  );
  const cameraY = interpolate(
    frame,
    [0, 70, 130, 165],
    [20, 0, -10, -16],
    {...clamp, easing: cinematic},
  );
  const cameraScale = interpolate(
    frame,
    [0, 48, 112, 154],
    [1.08, 1.03, 0.98, 1.015],
    {...clamp, easing: cinematic},
  );

  const singleStockOpacity = interpolate(spread, [0, 0.42, 0.72], [1, 0.72, 0], clamp);
  const singleStockX = interpolate(spread, [0, 1], [545, 480], clamp);
  const etfScale = interpolate(etfEnter, [0, 1], [0.72, 1], clamp);
  const etfOpacity = interpolate(etfEnter, [0, 0.15, 1], [0, 1, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        background: '#000',
        color: C.white,
        fontFamily: 'Arial, Helvetica, sans-serif',
        overflow: 'hidden',
      }}
    >
      <SceneHeader title="Ein ETF verteilt dein Risiko" icon="chart-up" />

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
          <div style={{position: 'absolute', inset: 0, translate: `${cameraX * -0.2}px ${cameraY * -0.12}px`}}>
            <div
              style={{
                position: 'absolute',
                left: 118,
                top: 450,
                opacity: concentration,
                scale: interpolate(concentration, [0, 1], [0.86, 1], clamp),
              }}
            >
              <PhysicalCoinStack x={0} y={0} count={7} scale={1.15} />
              <div style={{position: 'absolute', left: -28, top: 192, width: 215, textAlign: 'center', fontSize: 29, fontWeight: 950}}>
                10.000 €
              </div>
            </div>
          </div>

          <div style={{position: 'absolute', inset: 0, translate: `${cameraX * -0.36}px ${cameraY * -0.22}px`, zIndex: 3}}>
            <PhysicalObject
              x={singleStockX}
              y={438}
              width={285}
              height={230}
              material="warning"
              radius={54}
              rotateY={-8}
              opacity={singleStockOpacity}
              scale={interpolate(concentration, [0, 1], [0.86, 1], clamp)}
            >
              <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{fontSize: 26, fontWeight: 900, opacity: 0.76}}>ALLES IN</div>
                <div style={{marginTop: 8, fontSize: 42, fontWeight: 950}}>1 Aktie</div>
                <div style={{marginTop: 13, fontSize: 20, fontWeight: 850, opacity: 0.75}}>ein einziger Treffer zählt voll</div>
              </div>
            </PhysicalObject>
          </div>

          <div style={{position: 'absolute', inset: 0, translate: `${cameraX * -0.58}px ${cameraY * -0.34}px`, zIndex: 6}}>
            <PhysicalObject
              x={330}
              y={475}
              width={250}
              height={250}
              material="money"
              radius={125}
              rotateY={0}
              rotateX={2}
              scale={etfScale}
              opacity={etfOpacity}
            >
              <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                <div style={{fontSize: 54, fontWeight: 950}}>ETF</div>
                <div style={{fontSize: 21, fontWeight: 850, marginTop: 6, opacity: 0.72}}>verteilt</div>
              </div>
            </PhysicalObject>

            {[0, 1, 2, 3].map((index) => (
              <FlowCoin key={index} frame={frame} index={index} />
            ))}
          </div>

          <div style={{position: 'absolute', inset: 0, translate: `${cameraX * -0.82}px ${cameraY * -0.5}px`, zIndex: 7}}>
            {sectors.map((sector, index) => {
              const appear = progress(frame, 72 + index * 8, 108 + index * 8);
              const isHit = index === 0;
              const hitDrop = isHit ? interpolate(shock, [0, 1], [0, 118], clamp) : 0;
              const hitRotate = isHit ? interpolate(shock, [0, 1], [0, 12], clamp) : 0;
              const hitOpacity = isHit ? interpolate(shock, [0, 1], [1, 0.34], clamp) : 1;
              const settle = isHit ? interpolate(recovery, [0, 1], [0.34, 0.46], clamp) : 1;

              return (
                <div
                  key={sector.label}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: appear * hitOpacity,
                    translate: `0 ${hitDrop}px`,
                    rotate: `${hitRotate}deg`,
                    scale: interpolate(appear, [0, 1], [0.72, 1], clamp),
                    transformOrigin: `${sector.x + 90}px ${sector.y + 80}px`,
                  }}
                >
                  <PhysicalObject
                    x={sector.x}
                    y={sector.y}
                    width={185}
                    height={165}
                    material={sector.material}
                    radius={42}
                    rotateY={-6}
                    scale={settle}
                  >
                    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                      <div style={{fontSize: 26, fontWeight: 950, textAlign: 'center'}}>{sector.label}</div>
                      <div style={{marginTop: 10, fontSize: 20, fontWeight: 850, opacity: 0.72}}>25 %</div>
                    </div>
                  </PhysicalObject>
                </div>
              );
            })}
          </div>

          <div
            style={{
              position: 'absolute',
              left: 570,
              top: 320,
              width: 245,
              height: 250,
              borderRadius: '50%',
              border: '6px solid rgba(255,96,72,0.7)',
              boxShadow: '0 0 0 18px rgba(255,96,72,0.06), 0 0 60px rgba(255,96,72,0.12)',
              opacity: interpolate(shock, [0, 0.22, 0.78, 1], [0, 0.9, 0.9, 0], clamp),
              scale: interpolate(shock, [0, 0.45, 1], [0.74, 1.06, 1.2], clamp),
              zIndex: 10,
            }}
          />

          <div
            style={{
              position: 'absolute',
              left: 350,
              top: 330,
              width: 690,
              height: 660,
              borderRadius: 90,
              border: '4px solid rgba(108,255,181,0.42)',
              boxShadow: '0 0 0 18px rgba(12,122,71,0.05), 0 0 72px rgba(108,255,181,0.08)',
              opacity: result,
              scale: interpolate(result, [0, 1], [0.96, 1], clamp),
              zIndex: 1,
            }}
          />
        </div>
      </PremiumPhysicalStage>

      <div
        style={{
          position: 'absolute',
          left: 92,
          right: 92,
          top: 1270,
          textAlign: 'center',
          opacity: result,
          translate: `0 ${interpolate(result, [0, 1], [24, 0], clamp)}px`,
        }}
      >
        <div style={{fontSize: 34, fontWeight: 950, color: '#6CFFB5', letterSpacing: -0.7}}>
          Ein Treffer trifft nur einen Teil – nicht dein ganzes Geld.
        </div>
      </div>

      <Captions
        words={makeCaptionWords(
          'Ein ETF verteilt dein Geld auf mehrere Bereiche, damit ein einzelner Rückschlag nicht alles gleichzeitig trifft.',
        )}
      />
    </AbsoluteFill>
  );
};
