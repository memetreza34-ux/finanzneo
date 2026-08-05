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

const SECURITY_BLOCKS = [
  {label: 'TECH', color: ETF_COLORS.blue},
  {label: 'MEDIZIN', color: ETF_COLORS.green},
  {label: 'INDUSTRIE', color: ETF_COLORS.gold},
  {label: 'KONSUM', color: ETF_COLORS.orange},
] as const;

const SecurityBasket: React.FC<{
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  transferProgress?: number;
}> = ({x, y, scale = 1, opacity = 1, transferProgress = 0}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 278,
      height: 238,
      opacity,
      transform: `translate(-50%, -50%) scale(${scale})`,
      transformOrigin: '50% 50%',
      zIndex: 28,
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: 18,
        right: 18,
        bottom: 0,
        height: 112,
        borderRadius: '24px 24px 42px 42px',
        background: 'linear-gradient(180deg, rgba(244,201,93,0.24), rgba(244,201,93,0.09))',
        border: '3px solid rgba(244,201,93,0.62)',
        boxShadow: '0 28px 50px rgba(0,0,0,0.36)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 54,
        right: 54,
        top: 18,
        height: 150,
        border: '7px solid rgba(244,201,93,0.62)',
        borderBottom: 'none',
        borderRadius: '80px 80px 0 0',
      }}
    />
    {SECURITY_BLOCKS.map((block, index) => {
      const row = Math.floor(index / 2);
      const column = index % 2;
      const fly = clamp01((transferProgress - index * 0.08) / 0.55);
      return (
        <div
          key={block.label}
          style={{
            position: 'absolute',
            left: 38 + column * 106 + fly * 360,
            top: 80 + row * 68 - fly * (30 + index * 8),
            width: 92,
            height: 58,
            borderRadius: 17,
            background: `linear-gradient(145deg, ${block.color}, ${block.color}99)`,
            color: '#07120B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: block.label.length > 6 ? 15 : 18,
            fontWeight: 950,
            boxShadow: `0 12px 28px rgba(0,0,0,0.32), 0 0 18px ${block.color}44`,
            transform: `rotate(${(column ? 2 : -2) + fly * 7}deg) scale(${1 - fly * 0.12})`,
            opacity: 1 - clamp01((fly - 0.82) / 0.18),
          }}
        >
          {block.label}
        </div>
      );
    })}
  </div>
);

const Transporter: React.FC<{
  x: number;
  y: number;
  wheelRotation: number;
  lift: number;
}> = ({x, y, wheelRotation, lift}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 380,
      height: 248,
      transform: 'translate(-50%, -50%)',
      zIndex: 18,
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: 0,
        bottom: 52,
        width: 244,
        height: 96,
        borderRadius: '30px 24px 18px 18px',
        background: 'linear-gradient(145deg, #2E4B38, #12251A)',
        border: '2px solid rgba(255,255,255,0.18)',
        boxShadow: '0 22px 46px rgba(0,0,0,0.42)',
      }}
    >
      <div style={{position: 'absolute', left: 26, top: 22, color: ETF_COLORS.mint, fontSize: 21, fontWeight: 950, letterSpacing: 1.4}}>AUTHORIZED</div>
      <div style={{position: 'absolute', left: 26, top: 51, color: ETF_COLORS.text, fontSize: 24, fontWeight: 950}}>PARTICIPANT</div>
    </div>
    <div
      style={{
        position: 'absolute',
        right: 10,
        bottom: 52,
        width: 126,
        height: 126,
        borderRadius: '38px 38px 16px 16px',
        background: 'linear-gradient(145deg, #315A40, #13271B)',
        border: '2px solid rgba(255,255,255,0.18)',
      }}
    >
      <div style={{position: 'absolute', left: 20, right: 20, top: 20, height: 52, borderRadius: 16, background: 'rgba(104,184,255,0.25)', border: '1px solid rgba(104,184,255,0.5)'}} />
    </div>
    {[84, 296].map((left) => (
      <div
        key={left}
        style={{
          position: 'absolute',
          left,
          bottom: 15,
          width: 72,
          height: 72,
          marginLeft: -36,
          borderRadius: '50%',
          background: '#07100A',
          border: '12px solid #24382C',
          transform: `rotate(${wheelRotation}deg)`,
          boxShadow: '0 8px 18px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{position: 'absolute', inset: 15, borderRadius: '50%', background: ETF_COLORS.gold}} />
      </div>
    ))}
    <div
      style={{
        position: 'absolute',
        left: 46,
        bottom: 148 + lift * 70,
        width: 232,
        height: 18,
        borderRadius: 99,
        background: ETF_COLORS.gold,
        boxShadow: '0 8px 20px rgba(0,0,0,0.34)',
      }}
    />
  </div>
);

const FundVault: React.FC<{
  doorOpen: number;
  intake: number;
  mint: number;
}> = ({doorOpen, intake, mint}) => (
  <div
    style={{
      position: 'absolute',
      right: 24,
      top: 76,
      width: 450,
      height: 830,
      borderRadius: 50,
      background: 'linear-gradient(160deg, #244D34, #0A1B11 66%)',
      border: `3px solid rgba(98,245,154,${0.25 + intake * 0.35})`,
      boxShadow: `0 38px 100px rgba(0,0,0,0.52), inset 0 0 100px rgba(0,0,0,0.32), 0 0 ${46 * intake}px rgba(98,245,154,0.22)`,
      overflow: 'hidden',
    }}
  >
    <div style={{position: 'absolute', top: 30, left: 0, right: 0, textAlign: 'center', fontSize: 24, fontWeight: 950, color: ETF_COLORS.green, letterSpacing: 3}}>ETF-FONDS</div>
    <div
      style={{
        position: 'absolute',
        left: 58,
        right: 58,
        top: 110,
        height: 420,
        borderRadius: 42,
        background: 'rgba(3,13,7,0.62)',
        border: '2px solid rgba(255,255,255,0.13)',
        overflow: 'hidden',
      }}
    >
      <div style={{position: 'absolute', inset: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignContent: 'center'}}>
        {SECURITY_BLOCKS.map((block, index) => {
          const settle = clamp01((intake - index * 0.1) / 0.55);
          return (
            <div
              key={block.label}
              style={{
                height: 116,
                borderRadius: 28,
                background: `linear-gradient(145deg, ${block.color}${Math.round((0.15 + settle * 0.65) * 255).toString(16).padStart(2, '0')}, ${block.color}28)`,
                border: `2px solid ${block.color}${Math.round((0.25 + settle * 0.5) * 255).toString(16).padStart(2, '0')}`,
                color: settle > 0.35 ? ETF_COLORS.text : ETF_COLORS.muted,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 21,
                fontWeight: 950,
                transform: `scale(${0.88 + settle * 0.12})`,
                boxShadow: settle > 0.6 ? `0 0 28px ${block.color}44` : 'none',
              }}
            >
              {block.label}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: '0% 50%',
          transform: `perspective(700px) rotateY(${-105 * doorOpen}deg)`,
          borderRadius: 40,
          background: 'linear-gradient(145deg, rgba(49,81,60,0.98), rgba(14,34,22,0.98))',
          border: '3px solid rgba(255,255,255,0.18)',
          boxShadow: 'inset 0 0 70px rgba(0,0,0,0.34)',
        }}
      >
        <div style={{position: 'absolute', left: 48, right: 48, top: 74, bottom: 74, borderRadius: '50%', border: '16px solid rgba(255,255,255,0.11)'}} />
        <div style={{position: 'absolute', left: '50%', top: '50%', width: 72, height: 72, marginLeft: -36, marginTop: -36, borderRadius: '50%', background: ETF_COLORS.gold, border: '9px solid rgba(5,16,9,0.5)'}} />
      </div>
    </div>

    <div style={{position: 'absolute', left: 58, right: 58, top: 564, fontSize: 22, color: ETF_COLORS.muted, fontWeight: 850}}>AUSGABE NEUER ANTEILE</div>
    <div
      style={{
        position: 'absolute',
        left: 58,
        right: 58,
        top: 610,
        height: 138,
        borderRadius: 36,
        background: 'rgba(4,14,8,0.78)',
        border: '2px solid rgba(98,245,154,0.22)',
        overflow: 'hidden',
      }}
    >
      {[0, 1, 2].map((index) => {
        const discProgress = clamp01((mint - index * 0.12) / 0.62);
        const x = interpolate(discProgress, [0, 1], [350, 74 + index * 105]);
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: x,
              top: 69,
              width: 84,
              height: 84,
              marginLeft: -42,
              marginTop: -42,
              borderRadius: '50%',
              background: 'linear-gradient(145deg, #D9FFE5, #62F59A)',
              color: '#06120A',
              border: '3px solid rgba(255,255,255,0.48)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 19,
              fontWeight: 950,
              transform: `rotate(${discProgress * 360}deg) scale(${0.72 + discProgress * 0.28})`,
              opacity: discProgress,
              boxShadow: '0 12px 28px rgba(0,0,0,0.38), 0 0 24px rgba(98,245,154,0.42)',
            }}
          >
            ETF
          </div>
        );
      })}
    </div>
  </div>
);

export const EtfCreationBasketExchangeAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const t = sceneProgress(frame, durationInFrames);

  const pickup = progress(t, 0.08, 0.27);
  const drive = progress(t, 0.23, 0.48, Easing.inOut(Easing.cubic));
  const doorOpen = progress(t, 0.42, 0.58);
  const transfer = progress(t, 0.52, 0.72);
  const intake = progress(t, 0.62, 0.81);
  const mint = progress(t, 0.75, 0.94);
  const exit = progress(t, 0.91, 1);

  const truckX = interpolate(drive, [0, 1], [225, 520]) + exit * 160;
  const truckY = 760;
  const basketX = t < 0.27 ? 245 : truckX - 34;
  const basketY = t < 0.27
    ? interpolate(pickup, [0, 1], [610, 590])
    : 590 - transfer * 72;
  const basketOpacity = 1 - clamp01((transfer - 0.74) / 0.2);
  const wheelRotation = (drive + exit) * 760;
  const completionPop = pop(frame, Math.round(durationInFrames * 0.78), fps);

  return (
    <SceneBackground accent={ETF_COLORS.gold}>
      <AnimationSafeArea>
        <AbsoluteFill>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 46,
              background: 'linear-gradient(145deg, rgba(31,42,28,0.96), rgba(6,16,9,0.96))',
              border: `1px solid ${ETF_COLORS.line}`,
              boxShadow: 'inset 0 0 100px rgba(0,0,0,0.38), 0 34px 90px rgba(0,0,0,0.44)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: 280,
                background: 'linear-gradient(180deg, rgba(57,65,48,0.22), rgba(9,18,11,0.78))',
                borderTop: '2px solid rgba(255,255,255,0.08)',
              }}
            />
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: index * 230 - 80,
                  bottom: 118,
                  width: 180,
                  height: 14,
                  transform: 'rotate(-8deg)',
                  borderRadius: 99,
                  background: 'rgba(244,201,93,0.14)',
                }}
              />
            ))}

            <div style={{position: 'absolute', left: 34, top: 34}}>
              <GlowPill color={ETF_COLORS.gold}>PRIMÄRMARKT · NUR BEI BEDARF</GlowPill>
            </div>

            <FundVault doorOpen={doorOpen} intake={intake} mint={mint} />
            <Transporter x={truckX} y={truckY} wheelRotation={wheelRotation} lift={pickup} />
            <SecurityBasket
              x={basketX}
              y={basketY}
              scale={0.93 + pickup * 0.07}
              opacity={basketOpacity}
              transferProgress={transfer}
            />

            {mint > 0.35 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 122,
                  top: 238,
                  width: 360,
                  minHeight: 166,
                  padding: '28px 30px',
                  boxSizing: 'border-box',
                  borderRadius: 38,
                  background: 'rgba(5,18,10,0.91)',
                  border: `2px solid rgba(98,245,154,${0.2 + mint * 0.45})`,
                  boxShadow: '0 26px 70px rgba(0,0,0,0.44)',
                  opacity: clamp01((mint - 0.35) / 0.25) * (1 - exit * 0.45),
                  transform: `scale(${0.9 + completionPop * 0.1})`,
                  transformOrigin: '50% 50%',
                }}
              >
                <div style={{fontSize: 22, color: ETF_COLORS.green, fontWeight: 950, letterSpacing: 2}}>TAUSCH ABGESCHLOSSEN</div>
                <div style={{fontSize: 34, lineHeight: 1.08, color: ETF_COLORS.text, fontWeight: 950, marginTop: 12}}>Wertpapierkorb gegen neue ETF-Anteile</div>
              </div>
            ) : null}
          </div>
        </AbsoluteFill>
      </AnimationSafeArea>
    </SceneBackground>
  );
};
