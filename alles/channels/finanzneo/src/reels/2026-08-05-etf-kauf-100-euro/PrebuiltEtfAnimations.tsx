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

export type PrebuiltEtfAnimationProps = {
  readonly sceneDurationInFrames: number;
};

const Capsule: React.FC<{
  x: number;
  y: number;
  color: string;
  label: string;
  value: string;
  opacity?: number;
  scale?: number;
}> = ({x, y, color, label, value, opacity = 1, scale = 1}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 188,
      height: 102,
      opacity,
      transform: `translate(-50%, -50%) scale(${scale})`,
      borderRadius: 32,
      background: `linear-gradient(145deg, ${color}, ${color}AA)`,
      border: '2px solid rgba(255,255,255,0.38)',
      color: '#06120A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 20px 52px rgba(0,0,0,0.44), 0 0 34px ${color}66`,
      zIndex: 24,
    }}
  >
    <div style={{fontSize: 20, fontWeight: 950, letterSpacing: 1.4}}>{label}</div>
    <div style={{fontSize: 32, fontWeight: 950, marginTop: 3}}>{value}</div>
  </div>
);

export const PrebuiltEtfOrderMatchAnimation: React.FC<PrebuiltEtfAnimationProps> = ({
  sceneDurationInFrames,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = sceneProgress(frame, sceneDurationInFrames);
  const launch = progress(t, 0.02, 0.2);
  const broker = progress(t, 0.16, 0.35);
  const hall = progress(t, 0.29, 0.48);
  const search = progress(t, 0.42, 0.69, Easing.inOut(Easing.cubic));
  const seller = progress(t, 0.65, 0.83);
  const matched = progress(t, 0.78, 0.92, Easing.out(Easing.back(1.4)));
  const exit = progress(t, 0.91, 1);

  const buyX = t < 0.2
    ? interpolate(launch, [0, 1], [178, 326])
    : t < 0.35
      ? interpolate(broker, [0, 1], [326, 502])
      : interpolate(search, [0, 1], [522, 730]) - matched * 16;
  const sellX = interpolate(seller, [0, 1], [1030, 745]);
  const packageX = interpolate(exit, [0, 1], [738, 1025]);
  const matchPop = pop(frame, Math.round(sceneDurationInFrames * 0.78), fps);

  return (
    <SceneBackground>
      <AnimationSafeArea>
        <AbsoluteFill>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 46,
              overflow: 'hidden',
              background: 'linear-gradient(145deg, rgba(18,42,27,0.96), rgba(5,14,8,0.96))',
              border: `1px solid ${ETF_COLORS.line}`,
              boxShadow: '0 36px 96px rgba(0,0,0,0.48), inset 0 0 90px rgba(0,0,0,0.34)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 24,
                top: 272,
                width: 218,
                height: 420,
                borderRadius: 42,
                background: 'linear-gradient(145deg, #2A382E, #0B130E)',
                border: '4px solid rgba(255,255,255,0.2)',
                transform: `perspective(800px) rotateY(-10deg) translateX(${-14 * launch}px)`,
                boxShadow: '0 30px 70px rgba(0,0,0,0.48)',
              }}
            >
              <div style={{position: 'absolute', inset: 14, borderRadius: 30, background: 'linear-gradient(180deg, #0B2315, #06110A)'}}>
                <div style={{position: 'absolute', top: 28, left: 24, fontSize: 22, color: ETF_COLORS.muted, fontWeight: 800}}>Broker</div>
                <div style={{position: 'absolute', top: 92, left: 24, fontSize: 43, color: ETF_COLORS.text, fontWeight: 950}}>100 €</div>
                <div style={{position: 'absolute', left: 22, right: 22, bottom: 46, height: 78, borderRadius: 22, background: ETF_COLORS.green, color: '#06120A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 25, fontWeight: 950}}>ETF KAUFEN</div>
              </div>
            </div>

            <div
              style={{
                position: 'absolute',
                left: 324,
                top: 236,
                width: 174,
                height: 510,
                borderRadius: 38,
                background: 'linear-gradient(180deg, rgba(28,61,40,0.98), rgba(7,18,11,0.98))',
                border: `2px solid rgba(98,245,154,${0.22 + broker * 0.5})`,
                boxShadow: `0 26px 72px rgba(0,0,0,0.44), 0 0 ${44 * broker}px rgba(98,245,154,0.24)`,
              }}
            >
              <div style={{position: 'absolute', top: 30, left: 0, right: 0, textAlign: 'center', color: ETF_COLORS.green, fontSize: 21, fontWeight: 950, letterSpacing: 2}}>BROKER</div>
              <div style={{position: 'absolute', left: 54, right: 54, top: 110, bottom: 78, borderRadius: 24, background: `rgba(98,245,154,${0.07 + broker * 0.17})`, border: `2px solid rgba(98,245,154,${0.2 + broker * 0.55})`}} />
            </div>

            <div
              style={{
                position: 'absolute',
                left: 508,
                right: 18,
                top: 72,
                bottom: 62,
                opacity: hall,
                borderRadius: 38,
                background: 'linear-gradient(145deg, rgba(16,40,25,0.95), rgba(6,16,9,0.96))',
                border: '1px solid rgba(104,184,255,0.25)',
              }}
            >
              <div style={{position: 'absolute', top: 28, left: 30, fontSize: 23, color: ETF_COLORS.blue, fontWeight: 950, letterSpacing: 2}}>HANDELSPLATZ</div>
              <div style={{position: 'absolute', left: 34, top: 150}}><GlowPill>KAUFORDER</GlowPill></div>
              <div style={{position: 'absolute', right: 34, top: 470}}><GlowPill color={ETF_COLORS.gold}>VERKAUF</GlowPill></div>
              {[222, 526].map((top, lane) => (
                <div key={top} style={{position: 'absolute', left: 42, right: 42, top, height: 18, borderRadius: 99, background: 'rgba(255,255,255,0.1)'}}>
                  <div style={{position: 'absolute', inset: 0, borderRadius: 99, background: `linear-gradient(${lane ? '270deg' : '90deg'}, transparent, ${lane ? ETF_COLORS.gold : ETF_COLORS.green}55, transparent)`}} />
                  {[0, 1, 2, 3].map((index) => <div key={index} style={{position: 'absolute', left: 42 + index * 102, top: -7, width: 12, height: 32, borderRadius: 5, background: 'rgba(255,255,255,0.16)'}} />)}
                </div>
              ))}
              <div style={{position: 'absolute', right: 34, bottom: 28, color: ETF_COLORS.muted, fontSize: 19, fontWeight: 800}}>Preis und Menge müssen passen</div>
            </div>

            <Capsule x={buyX} y={472} color={ETF_COLORS.green} label="KAUF" value="100 €" scale={0.88 + launch * 0.12} />
            <Capsule x={sellX} y={472} color={ETF_COLORS.gold} label="VERKAUF" value="1 Anteil" opacity={seller} scale={0.9 + seller * 0.1} />

            {matched > 0.02 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 738,
                  top: 472,
                  width: 250,
                  height: 136,
                  transform: `translate(-50%, -50%) scale(${0.84 + matchPop * 0.16})`,
                  borderRadius: 42,
                  background: 'linear-gradient(145deg, #D9FFE5, #62F59A)',
                  color: '#06120A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  opacity: matched * (1 - exit),
                  zIndex: 40,
                  boxShadow: '0 0 58px rgba(98,245,154,0.54), 0 24px 60px rgba(0,0,0,0.48)',
                }}
              >
                <div style={{fontSize: 23, fontWeight: 950, letterSpacing: 2}}>MATCH</div>
                <div style={{fontSize: 39, fontWeight: 950}}>AUSGEFÜHRT</div>
              </div>
            ) : null}

            {exit > 0.01 ? (
              <div style={{position: 'absolute', left: packageX, top: 472, width: 230, height: 112, transform: 'translate(-50%, -50%)', borderRadius: 36, background: 'linear-gradient(145deg, #D9FFE5, #62F59A)', color: '#06120A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 29, fontWeight: 950, opacity: clamp01(exit * 1.5), zIndex: 42, boxShadow: '0 20px 56px rgba(0,0,0,0.5), 0 0 38px rgba(98,245,154,0.38)'}}>TRANSAKTION</div>
            ) : null}
          </div>
        </AbsoluteFill>
      </AnimationSafeArea>
    </SceneBackground>
  );
};

const BLOCKS = [
  {label: 'TECH', color: ETF_COLORS.blue},
  {label: 'MEDIZIN', color: ETF_COLORS.green},
  {label: 'INDUSTRIE', color: ETF_COLORS.gold},
  {label: 'KONSUM', color: ETF_COLORS.orange},
] as const;

export const PrebuiltEtfCreationAnimation: React.FC<PrebuiltEtfAnimationProps> = ({
  sceneDurationInFrames,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = sceneProgress(frame, sceneDurationInFrames);
  const pickup = progress(t, 0.06, 0.25);
  const drive = progress(t, 0.2, 0.47, Easing.inOut(Easing.cubic));
  const open = progress(t, 0.4, 0.57);
  const transfer = progress(t, 0.5, 0.73);
  const mint = progress(t, 0.7, 0.94);
  const exit = progress(t, 0.91, 1);
  const truckX = interpolate(drive, [0, 1], [238, 544]) + exit * 155;
  const basketX = t < 0.25 ? 246 : truckX - 35;
  const basketY = t < 0.25 ? interpolate(pickup, [0, 1], [608, 570]) : 570 - transfer * 64;
  const completion = pop(frame, Math.round(sceneDurationInFrames * 0.72), fps);

  return (
    <SceneBackground accent={ETF_COLORS.gold}>
      <AnimationSafeArea>
        <AbsoluteFill>
          <div style={{position: 'absolute', inset: 0, borderRadius: 46, overflow: 'hidden', background: 'linear-gradient(145deg, rgba(38,48,34,0.96), rgba(6,16,9,0.96))', border: `1px solid ${ETF_COLORS.line}`, boxShadow: '0 36px 96px rgba(0,0,0,0.48), inset 0 0 90px rgba(0,0,0,0.34)'}}>
            <div style={{position: 'absolute', left: 30, top: 30}}><GlowPill color={ETF_COLORS.gold}>PRIMÄRMARKT · NUR BEI BEDARF</GlowPill></div>
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 270, background: 'linear-gradient(180deg, rgba(57,65,48,0.2), rgba(9,18,11,0.8))', borderTop: '2px solid rgba(255,255,255,0.08)'}} />

            <div style={{position: 'absolute', right: 22, top: 74, width: 446, height: 830, borderRadius: 50, background: 'linear-gradient(160deg, #244D34, #0A1B11 66%)', border: `3px solid rgba(98,245,154,${0.24 + transfer * 0.34})`, boxShadow: '0 38px 100px rgba(0,0,0,0.52), inset 0 0 100px rgba(0,0,0,0.32)', overflow: 'hidden'}}>
              <div style={{position: 'absolute', top: 28, left: 0, right: 0, textAlign: 'center', fontSize: 24, fontWeight: 950, color: ETF_COLORS.green, letterSpacing: 3}}>ETF-FONDS</div>
              <div style={{position: 'absolute', left: 56, right: 56, top: 108, height: 422, borderRadius: 42, background: 'rgba(3,13,7,0.64)', border: '2px solid rgba(255,255,255,0.13)', overflow: 'hidden'}}>
                <div style={{position: 'absolute', inset: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignContent: 'center'}}>
                  {BLOCKS.map((block, index) => {
                    const settle = clamp01((transfer - index * 0.08) / 0.7);
                    return <div key={block.label} style={{height: 116, borderRadius: 28, background: `${block.color}${settle > 0.45 ? 'A0' : '22'}`, border: `2px solid ${block.color}${settle > 0.45 ? 'C0' : '45'}`, color: settle > 0.45 ? '#07120B' : ETF_COLORS.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 950, transform: `scale(${0.9 + settle * 0.1})`, boxShadow: settle > 0.55 ? `0 0 26px ${block.color}44` : 'none'}}>{block.label}</div>;
                  })}
                </div>
                <div style={{position: 'absolute', inset: 0, transformOrigin: '0% 50%', transform: `perspective(700px) rotateY(${-105 * open}deg)`, borderRadius: 40, background: 'linear-gradient(145deg, rgba(49,81,60,0.99), rgba(14,34,22,0.99))', border: '3px solid rgba(255,255,255,0.18)'}}>
                  <div style={{position: 'absolute', left: 46, right: 46, top: 72, bottom: 72, borderRadius: '50%', border: '16px solid rgba(255,255,255,0.11)'}} />
                  <div style={{position: 'absolute', left: '50%', top: '50%', width: 72, height: 72, marginLeft: -36, marginTop: -36, borderRadius: '50%', background: ETF_COLORS.gold, border: '9px solid rgba(5,16,9,0.5)'}} />
                </div>
              </div>
              <div style={{position: 'absolute', left: 56, right: 56, top: 565, fontSize: 21, color: ETF_COLORS.muted, fontWeight: 850}}>AUSGABE NEUER ANTEILE</div>
              <div style={{position: 'absolute', left: 56, right: 56, top: 610, height: 138, borderRadius: 36, background: 'rgba(4,14,8,0.78)', border: '2px solid rgba(98,245,154,0.22)', overflow: 'hidden'}}>
                {[0, 1, 2].map((index) => {
                  const p = clamp01((mint - index * 0.1) / 0.7);
                  return <div key={index} style={{position: 'absolute', left: interpolate(p, [0, 1], [360, 70 + index * 108]), top: 69, width: 84, height: 84, marginLeft: -42, marginTop: -42, borderRadius: '50%', background: 'linear-gradient(145deg, #D9FFE5, #62F59A)', color: '#06120A', border: '3px solid rgba(255,255,255,0.48)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, fontWeight: 950, transform: `rotate(${p * 360}deg) scale(${0.72 + p * 0.28})`, opacity: p, boxShadow: '0 12px 28px rgba(0,0,0,0.38), 0 0 24px rgba(98,245,154,0.42)'}}>ETF</div>;
                })}
              </div>
            </div>

            <div style={{position: 'absolute', left: truckX, top: 760, width: 380, height: 248, transform: 'translate(-50%, -50%)', zIndex: 18}}>
              <div style={{position: 'absolute', left: 0, bottom: 52, width: 244, height: 96, borderRadius: '30px 24px 18px 18px', background: 'linear-gradient(145deg, #2E4B38, #12251A)', border: '2px solid rgba(255,255,255,0.18)', boxShadow: '0 22px 46px rgba(0,0,0,0.42)'}}>
                <div style={{position: 'absolute', left: 24, top: 20, color: ETF_COLORS.mint, fontSize: 20, fontWeight: 950, letterSpacing: 1.2}}>AUTHORIZED</div>
                <div style={{position: 'absolute', left: 24, top: 50, color: ETF_COLORS.text, fontSize: 23, fontWeight: 950}}>PARTICIPANT</div>
              </div>
              <div style={{position: 'absolute', right: 10, bottom: 52, width: 126, height: 126, borderRadius: '38px 38px 16px 16px', background: 'linear-gradient(145deg, #315A40, #13271B)', border: '2px solid rgba(255,255,255,0.18)'}} />
              {[84, 296].map((left) => <div key={left} style={{position: 'absolute', left, bottom: 15, width: 72, height: 72, marginLeft: -36, borderRadius: '50%', background: '#07100A', border: '12px solid #24382C', transform: `rotate(${(drive + exit) * 760}deg)`}}><div style={{position: 'absolute', inset: 15, borderRadius: '50%', background: ETF_COLORS.gold}} /></div>)}
              <div style={{position: 'absolute', left: 46, bottom: 148 + pickup * 66, width: 232, height: 18, borderRadius: 99, background: ETF_COLORS.gold}} />
            </div>

            <div style={{position: 'absolute', left: basketX, top: basketY, width: 278, height: 236, opacity: 1 - clamp01((transfer - 0.75) / 0.2), transform: 'translate(-50%, -50%)', zIndex: 28}}>
              <div style={{position: 'absolute', left: 18, right: 18, bottom: 0, height: 112, borderRadius: '24px 24px 42px 42px', background: 'linear-gradient(180deg, rgba(244,201,93,0.24), rgba(244,201,93,0.09))', border: '3px solid rgba(244,201,93,0.62)'}} />
              <div style={{position: 'absolute', left: 54, right: 54, top: 18, height: 150, border: '7px solid rgba(244,201,93,0.62)', borderBottom: 'none', borderRadius: '80px 80px 0 0'}} />
              {BLOCKS.map((block, index) => {
                const p = clamp01((transfer - index * 0.08) / 0.58);
                return <div key={block.label} style={{position: 'absolute', left: 38 + (index % 2) * 106 + p * 365, top: 80 + Math.floor(index / 2) * 68 - p * (28 + index * 8), width: 92, height: 58, borderRadius: 17, background: block.color, color: '#07120B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: block.label.length > 6 ? 15 : 18, fontWeight: 950, transform: `rotate(${(index % 2 ? 2 : -2) + p * 7}deg) scale(${1 - p * 0.12})`, opacity: 1 - clamp01((p - 0.82) / 0.18), boxShadow: `0 12px 28px rgba(0,0,0,0.32), 0 0 18px ${block.color}44`}}>{block.label}</div>;
              })}
            </div>

            {mint > 0.3 ? <div style={{position: 'absolute', left: 110, top: 226, width: 372, minHeight: 178, padding: '30px 32px', boxSizing: 'border-box', borderRadius: 38, background: 'rgba(5,18,10,0.92)', border: '2px solid rgba(98,245,154,0.48)', boxShadow: '0 26px 70px rgba(0,0,0,0.44)', opacity: clamp01((mint - 0.3) / 0.24) * (1 - exit * 0.4), transform: `scale(${0.9 + completion * 0.1})`, transformOrigin: '50% 50%'}}><div style={{fontSize: 21, color: ETF_COLORS.green, fontWeight: 950, letterSpacing: 2}}>TAUSCH ABGESCHLOSSEN</div><div style={{fontSize: 34, lineHeight: 1.08, color: ETF_COLORS.text, fontWeight: 950, marginTop: 12}}>Wertpapierkorb gegen neue ETF-Anteile</div></div> : null}
          </div>
        </AbsoluteFill>
      </AnimationSafeArea>
    </SceneBackground>
  );
};
