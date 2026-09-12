import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {C, FORMAT} from '../brand/tokens';

export const FINANCE_MOTION_LAB_ADVANCED_SCENE_FRAMES = 120;
export const FINANCE_MOTION_LAB_ADVANCED_SCENES = 7;
export const FINANCE_MOTION_LAB_ADVANCED_FRAMES =
  FINANCE_MOTION_LAB_ADVANCED_SCENE_FRAMES * FINANCE_MOTION_LAB_ADVANCED_SCENES;

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const progress = (frame: number, from = 8, to = 100) =>
  interpolate(frame, [from, to], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const SceneShell: React.FC<{
  eyebrow: string;
  title: string;
  technique: string;
  children: React.ReactNode;
}> = ({eyebrow, title, technique, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const intro = spring({
    frame,
    fps,
    config: {damping: 19, stiffness: 150, mass: 0.82},
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000000',
        color: C.white,
        fontFamily: 'Arial, Helvetica, sans-serif',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 116,
          left: 70,
          right: 70,
          textAlign: 'center',
          opacity: interpolate(intro, [0, 1], [0, 1], clamp),
          transform: `translateY(${interpolate(intro, [0, 1], [24, 0], clamp)}px)`,
        }}
      >
        <div
          style={{
            color: C.accentLt,
            fontSize: 24,
            fontWeight: 850,
            letterSpacing: 4.5,
            textTransform: 'uppercase',
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 58,
            lineHeight: 1.03,
            fontWeight: 950,
            letterSpacing: -2.2,
          }}
        >
          {title}
        </div>
        <div style={{marginTop: 16, fontSize: 23, color: C.gray, fontWeight: 750}}>
          {technique}
        </div>
      </div>

      <div style={{position: 'absolute', top: 390, left: 58, right: 58, bottom: 170}}>
        {children}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 74,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 20,
          color: C.grayDk,
          fontWeight: 750,
          letterSpacing: 2,
        }}
      >
        FINANZNEO · ADVANCED FINANCE MOTION
      </div>
    </AbsoluteFill>
  );
};

const FeeDragRibbon: React.FC = () => {
  const frame = useCurrentFrame();
  const p = progress(frame, 8, 104);
  const reveal = `${p * 100}%`;

  return (
    <SceneShell eyebrow="Test 01" title="Was Gebühren langfristig kosten" technique="Capital Ribbon · Fee Drag · Same Start, Different Outcome">
      <div style={{position: 'absolute', inset: 0, padding: '80px 34px'}}>
        {[
          {label: 'ETF A · 0,20 % TER', end: '91.000 €', high: 168, low: 142, color: C.accentLt},
          {label: 'Fonds B · 1,50 % Kosten', end: '69.000 €', high: 168, low: 66, color: C.negativeLt},
        ].map((lane, index) => {
          const top = 160 + index * 420;
          return (
            <div key={lane.label} style={{position: 'absolute', left: 20, right: 20, top}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24}}>
                <div style={{fontSize: 27, fontWeight: 850}}>{lane.label}</div>
                <div style={{fontSize: 31, fontWeight: 950, color: lane.color}}>{lane.end}</div>
              </div>
              <div style={{height: 190, position: 'relative', borderRadius: 28, overflow: 'hidden', border: `1px solid ${C.line}`}}>
                <div style={{position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.035)'}} />
                <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: reveal, overflow: 'hidden'}}>
                  <svg viewBox="0 0 900 190" preserveAspectRatio="none" style={{width: 900, height: 190}}>
                    <polygon
                      points={`0,${(190 - lane.high) / 2} 900,${(190 - lane.low) / 2} 900,${(190 + lane.low) / 2} 0,${(190 + lane.high) / 2}`}
                      fill={lane.color}
                      opacity="0.88"
                    />
                    <line x1="85" x2="815" y1="95" y2="95" stroke="rgba(0,0,0,0.34)" strokeWidth="2" strokeDasharray="12 14" />
                  </svg>
                </div>
                {[0, 1, 2, 3].map((cut) => {
                  const cutP = interpolate(p, [0.25 + cut * 0.15, 0.42 + cut * 0.15], [0, 1], clamp);
                  return index === 1 ? (
                    <div
                      key={cut}
                      style={{
                        position: 'absolute',
                        left: 340 + cut * 115,
                        top: 38,
                        width: 38,
                        height: 114,
                        borderRadius: 10,
                        backgroundColor: C.negativeDk,
                        opacity: cutP,
                        transform: `translateY(${interpolate(cutP, [0, 1], [-26, 88], clamp)}px) rotate(${8 + cut * 4}deg)`,
                      }}
                    />
                  ) : null;
                })}
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 14, fontSize: 20, color: C.gray}}>
                <span>Start</span><span>10 Jahre</span><span>20 Jahre</span><span>30 Jahre</span>
              </div>
            </div>
          );
        })}
      </div>
    </SceneShell>
  );
};

const RebalancingScale: React.FC = () => {
  const frame = useCurrentFrame();
  const p = progress(frame, 14, 96);
  const beamAngle = interpolate(p, [0, 1], [-8, 0], clamp);
  const transferX = interpolate(p, [0, 1], [-145, 145], clamp);
  const transferY = interpolate(p, [0, 0.5, 1], [0, -90, 0], clamp);

  return (
    <SceneShell eyebrow="Test 02" title="Rebalancing: zurück auf 70/30" technique="Portfolio Balance Beam · Weight Transfer · Target Lock">
      <div style={{position: 'absolute', inset: 0}}>
        <div style={{position: 'absolute', top: 150, left: 120, right: 120, display: 'flex', justifyContent: 'space-between'}}>
          <div style={{fontSize: 30, fontWeight: 900, color: C.accentLt}}>Aktien 82 %</div>
          <div style={{fontSize: 30, fontWeight: 900, color: C.blueLt}}>Anleihen 18 %</div>
        </div>

        <div
          style={{
            position: 'absolute',
            top: 470,
            left: 150,
            width: 660,
            height: 26,
            borderRadius: 999,
            backgroundColor: C.white,
            transformOrigin: '50% 50%',
            transform: `rotate(${beamAngle}deg)`,
          }}
        >
          <div style={{position: 'absolute', left: 42, top: -126, display: 'flex', gap: 12, alignItems: 'flex-end'}}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} style={{width: 62, height: 66 + i * 14, borderRadius: 14, backgroundColor: C.accentDk, border: `2px solid ${C.accentLt}`}} />
            ))}
          </div>
          <div style={{position: 'absolute', right: 42, top: -96, display: 'flex', gap: 12, alignItems: 'flex-end'}}>
            {[0, 1].map((i) => (
              <div key={i} style={{width: 74, height: 76 + i * 12, borderRadius: 14, backgroundColor: '#0c1a22', border: `2px solid ${C.blueLt}`}} />
            ))}
          </div>
          <div
            style={{
              position: 'absolute',
              left: 280,
              top: -112,
              width: 76,
              height: 76,
              borderRadius: 16,
              backgroundColor: C.accentLt,
              boxShadow: `0 0 28px rgba(92,255,173,0.24)`,
              transform: `translate(${transferX}px, ${transferY}px)`,
            }}
          />
        </div>

        <div style={{position: 'absolute', top: 494, left: 450, width: 0, height: 0, borderLeft: '54px solid transparent', borderRight: '54px solid transparent', borderBottom: `110px solid ${C.grayDk}`}} />

        <div style={{position: 'absolute', left: 150, right: 150, top: 720, display: 'flex', justifyContent: 'space-between'}}>
          <div style={{fontSize: 26, fontWeight: 850, color: p > 0.72 ? C.accentLt : C.gray}}>Ziel: 70 %</div>
          <div style={{fontSize: 26, fontWeight: 850, color: p > 0.72 ? C.blueLt : C.gray}}>Ziel: 30 %</div>
        </div>
        <div style={{position: 'absolute', top: 860, left: 170, right: 170, textAlign: 'center', fontSize: 28, fontWeight: 850, color: C.white, opacity: interpolate(p, [0.72, 1], [0, 1], clamp)}}>
          Nicht mehr Risiko nehmen – Gewicht zurücksetzen.
        </div>
      </div>
    </SceneShell>
  );
};

const DebtStrategies: React.FC = () => {
  const frame = useCurrentFrame();
  const p = progress(frame, 8, 108);
  const debts = [
    {name: 'Kredit A', amount: '1.000 €', rate: '5 %'},
    {name: 'Kredit B', amount: '4.000 €', rate: '12 %'},
    {name: 'Kredit C', amount: '10.000 €', rate: '7 %'},
  ];
  const snowballOrder = [0, 1, 2];
  const avalancheOrder = [1, 2, 0];

  const Lane: React.FC<{title: string; order: number[]; accent: string}> = ({title, order, accent}) => (
    <div style={{width: '47%'}}>
      <div style={{fontSize: 30, fontWeight: 950, color: accent, textAlign: 'center', marginBottom: 28}}>{title}</div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 22}}>
        {debts.map((debt, debtIndex) => {
          const rank = order.indexOf(debtIndex);
          const done = interpolate(p, [0.18 + rank * 0.24, 0.36 + rank * 0.24], [0, 1], clamp);
          return (
            <div
              key={debt.name}
              style={{
                height: 150,
                borderRadius: 24,
                border: `2px solid ${done > 0.8 ? accent : C.line}`,
                background: done > 0.8 ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.045)',
                padding: '22px 24px',
                position: 'relative',
                opacity: interpolate(done, [0, 1], [1, 0.34], clamp),
                transform: `scale(${interpolate(done, [0, 1], [1, 0.96], clamp)})`,
              }}
            >
              <div style={{fontSize: 24, fontWeight: 900}}>{debt.name}</div>
              <div style={{marginTop: 9, fontSize: 29, fontWeight: 950}}>{debt.amount}</div>
              <div style={{position: 'absolute', right: 22, bottom: 20, fontSize: 22, color: C.gray}}>{debt.rate} Zins</div>
              <div
                style={{
                  position: 'absolute',
                  left: 22,
                  right: 22,
                  top: '50%',
                  height: 6,
                  backgroundColor: accent,
                  borderRadius: 999,
                  transformOrigin: 'left center',
                  transform: `scaleX(${done}) rotate(-3deg)`,
                }}
              />
              <div style={{position: 'absolute', right: 18, top: 16, fontSize: 18, fontWeight: 950, color: accent, opacity: done}}>GETILGT</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <SceneShell eyebrow="Test 03" title="Schneeball oder Lawine?" technique="Strategy Race · Different Payoff Order · Card Elimination">
      <div style={{position: 'absolute', inset: '70px 20px', display: 'flex', justifyContent: 'space-between'}}>
        <Lane title="Schneeball" order={snowballOrder} accent={C.accentLt} />
        <Lane title="Lawine" order={avalancheOrder} accent={C.gold} />
      </div>
      <div style={{position: 'absolute', bottom: 70, left: 70, right: 70, textAlign: 'center', fontSize: 24, color: C.gray}}>
        Schneeball: kleinste Schuld zuerst · Lawine: höchster Zins zuerst
      </div>
    </SceneShell>
  );
};

const EtfReplication: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rows = [
    {name: 'Unternehmen A', weight: 38, color: C.accentLt},
    {name: 'Unternehmen B', weight: 27, color: C.blueLt},
    {name: 'Unternehmen C', weight: 20, color: C.gold},
    {name: 'Unternehmen D', weight: 15, color: C.purpleLt},
  ];

  return (
    <SceneShell eyebrow="Test 04" title="Wie ein ETF einen Index nachbildet" technique="Weight Mirroring · Source-to-Replica Morph · Synchronous Settlement">
      <div style={{position: 'absolute', inset: '70px 20px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', padding: '0 48px', marginBottom: 28}}>
          <div style={{fontSize: 28, fontWeight: 950}}>INDEX</div>
          <div style={{fontSize: 28, fontWeight: 950, color: C.accentLt}}>ETF</div>
        </div>

        {rows.map((row, index) => {
          const settle = spring({
            frame: frame - 10 - index * 14,
            fps,
            config: {damping: 18, stiffness: 130, mass: 0.85},
          });
          const y = 120 + index * 190;
          const width = 240 + row.weight * 7;
          return (
            <React.Fragment key={row.name}>
              <div
                style={{
                  position: 'absolute',
                  left: 20,
                  top: y,
                  width,
                  height: 112,
                  borderRadius: 22,
                  border: `2px solid ${row.color}`,
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  padding: '20px 22px',
                }}
              >
                <div style={{fontSize: 22, fontWeight: 850}}>{row.name}</div>
                <div style={{marginTop: 10, fontSize: 31, fontWeight: 950, color: row.color}}>{row.weight} %</div>
              </div>

              <div
                style={{
                  position: 'absolute',
                  left: interpolate(settle, [0, 1], [40, 520], clamp),
                  top: y,
                  width,
                  height: 112,
                  borderRadius: 22,
                  border: `2px solid ${row.color}`,
                  backgroundColor: row.color,
                  color: '#000',
                  padding: '20px 22px',
                  opacity: interpolate(settle, [0, 0.12, 1], [0, 0.72, 1], clamp),
                }}
              >
                <div style={{fontSize: 22, fontWeight: 900}}>ETF-Anteil</div>
                <div style={{marginTop: 10, fontSize: 31, fontWeight: 950}}>{row.weight} %</div>
              </div>
            </React.Fragment>
          );
        })}

        <div style={{position: 'absolute', left: 405, top: 82, bottom: 110, width: 2, background: C.line}} />
        <div style={{position: 'absolute', bottom: 22, left: 100, right: 100, textAlign: 'center', fontSize: 25, color: C.gray}}>
          Der ETF übernimmt die Gewichte des Index – nicht einfach nur die Namen.
        </div>
      </div>
    </SceneShell>
  );
};

const DividendSplit: React.FC = () => {
  const frame = useCurrentFrame();
  const p = progress(frame, 8, 105);
  const enter = interpolate(p, [0, 0.22], [0, 1], clamp);
  const split = interpolate(p, [0.26, 0.58], [0, 1], clamp);
  const reinvest = interpolate(p, [0.58, 1], [0, 1], clamp);

  return (
    <SceneShell eyebrow="Test 05" title="Dividende: Steuer und Reinvestition" technique="Semantic Split · Tax Extraction · Net-to-Units Transformation">
      <div style={{position: 'absolute', inset: 0}}>
        <div
          style={{
            position: 'absolute',
            left: 300,
            top: 135,
            width: 360,
            height: 180,
            borderRadius: 28,
            backgroundColor: C.accentLt,
            color: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            transform: `translateY(${interpolate(enter, [0, 1], [-90, 0], clamp)}px) scale(${interpolate(enter, [0, 1], [0.7, 1], clamp)})`,
            opacity: enter * (1 - split * 0.15),
          }}
        >
          <div style={{fontSize: 28, fontWeight: 900}}>DIVIDENDE</div>
          <div style={{fontSize: 58, fontWeight: 950}}>100 €</div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: interpolate(split, [0, 1], [300, 105], clamp),
            top: interpolate(split, [0, 1], [390, 520], clamp),
            width: 280,
            height: 160,
            borderRadius: 26,
            backgroundColor: C.negativeDk,
            border: `2px solid ${C.negativeLt}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            opacity: split,
          }}
        >
          <div style={{fontSize: 22, fontWeight: 850}}>STEUER</div>
          <div style={{fontSize: 44, fontWeight: 950, color: C.negativeLt}}>26 €</div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: interpolate(split, [0, 1], [380, 565], clamp),
            top: interpolate(split, [0, 1], [390, 520], clamp),
            width: 300,
            height: 160,
            borderRadius: 26,
            backgroundColor: C.accentDk,
            border: `2px solid ${C.accentLt}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            opacity: split * (1 - reinvest * 0.7),
          }}
        >
          <div style={{fontSize: 22, fontWeight: 850}}>NETTO</div>
          <div style={{fontSize: 44, fontWeight: 950, color: C.accentLt}}>74 €</div>
        </div>

        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 540 + (i % 2) * 165,
              top: 500 + Math.floor(i / 2) * 150,
              width: 140,
              height: 118,
              borderRadius: 22,
              backgroundColor: C.accentLt,
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              fontWeight: 950,
              opacity: reinvest,
              transform: `scale(${interpolate(reinvest, [0, 1], [0.55, 1], clamp)}) translateY(${interpolate(reinvest, [0, 1], [45, 0], clamp)}px)`,
            }}
          >
            <div style={{fontSize: 20}}>ETF</div>
            <div style={{fontSize: 28}}>ANTEIL</div>
          </div>
        ))}

        <div style={{position: 'absolute', left: 475, top: 690, fontSize: 25, color: C.accentLt, fontWeight: 850, opacity: reinvest}}>
          zurück investiert
        </div>
      </div>
    </SceneShell>
  );
};

const PurchasingPowerShelf: React.FC = () => {
  const frame = useCurrentFrame();
  const p = progress(frame, 8, 104);
  const late = p > 0.58;
  const items = ['Brot', 'Milch', 'Reis', 'Käse', 'Obst', 'Gemüse', 'Öl', 'Kaffee'];

  return (
    <SceneShell eyebrow="Test 06" title="Mehr Gehalt, trotzdem weniger Kaufkraft" technique="Purchasing-Power Shelf · Object Loss · Nominal-vs-Real Contrast">
      <div style={{position: 'absolute', inset: 0}}>
        <div style={{position: 'absolute', top: 80, left: 90, right: 90, display: 'flex', justifyContent: 'space-between'}}>
          <div style={{width: 350, borderRadius: 28, border: `2px solid ${C.accentLt}`, padding: '22px 28px', backgroundColor: 'rgba(92,255,173,0.06)'}}>
            <div style={{fontSize: 22, color: C.gray}}>GEHALT</div>
            <div style={{fontSize: 48, fontWeight: 950, marginTop: 6}}>{late ? '3.150 €' : '3.000 €'}</div>
            <div style={{fontSize: 20, color: C.accentLt, marginTop: 6}}>{late ? '+5 %' : 'heute'}</div>
          </div>
          <div style={{width: 350, borderRadius: 28, border: `2px solid ${C.negativeLt}`, padding: '22px 28px', backgroundColor: 'rgba(255,110,85,0.06)'}}>
            <div style={{fontSize: 22, color: C.gray}}>PREISE</div>
            <div style={{fontSize: 48, fontWeight: 950, marginTop: 6}}>{late ? '+8 %' : 'Basis'}</div>
            <div style={{fontSize: 20, color: C.negativeLt, marginTop: 6}}>{late ? 'steigen schneller' : 'heute'}</div>
          </div>
        </div>

        <div style={{position: 'absolute', top: 360, left: 80, right: 80}}>
          <div style={{fontSize: 25, fontWeight: 900, marginBottom: 18}}>Was dein Warenkorb noch schafft:</div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18}}>
            {items.map((item, index) => {
              const lost = late && index >= 6;
              return (
                <div
                  key={item}
                  style={{
                    height: 165,
                    borderRadius: 24,
                    border: `2px solid ${lost ? C.negativeDk : C.line}`,
                    backgroundColor: lost ? 'rgba(255,80,60,0.06)' : 'rgba(255,255,255,0.045)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: lost ? 0.24 : 1,
                    transform: `scale(${lost ? 0.9 : 1})`,
                  }}
                >
                  <div style={{fontSize: 27, fontWeight: 900}}>{item}</div>
                  <div style={{marginTop: 10, fontSize: 21, color: lost ? C.negativeLt : C.gray}}>{lost ? 'nicht mehr drin' : 'im Warenkorb'}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{position: 'absolute', left: 90, right: 90, bottom: 90, textAlign: 'center', fontSize: 31, fontWeight: 950, color: late ? C.negativeLt : C.gray}}>
          Nominal mehr Geld ≠ real mehr Kaufkraft
        </div>
      </div>
    </SceneShell>
  );
};

const BondRepricing: React.FC = () => {
  const frame = useCurrentFrame();
  const p = progress(frame, 10, 104);
  const sliderY = interpolate(p, [0, 1], [380, 180], clamp);
  const bondY = interpolate(p, [0, 1], [330, 620], clamp);
  const switched = p > 0.55;

  return (
    <SceneShell eyebrow="Test 07" title="Warum Anleihekurse bei höheren Zinsen fallen" technique="Inverse Repricing · Market-Rate Elevator · Old-Coupon Discount">
      <div style={{position: 'absolute', inset: 0}}>
        <div style={{position: 'absolute', left: 80, top: 120, width: 300, height: 720}}>
          <div style={{fontSize: 24, fontWeight: 900, marginBottom: 20}}>MARKTZINS</div>
          <div style={{position: 'absolute', left: 130, top: 80, bottom: 60, width: 10, borderRadius: 999, backgroundColor: C.line}} />
          {[2, 3, 4].map((rate, i) => (
            <div key={rate} style={{position: 'absolute', left: 175, top: 360 - i * 100, fontSize: 25, color: rate === (switched ? 4 : 2) ? C.accentLt : C.gray, fontWeight: 900}}>
              {rate} %
            </div>
          ))}
          <div style={{position: 'absolute', left: 93, top: sliderY, width: 84, height: 84, borderRadius: 999, backgroundColor: C.accentLt, boxShadow: '0 0 28px rgba(92,255,173,0.22)'}} />
        </div>

        <div style={{position: 'absolute', right: 65, top: 120, width: 520, height: 760}}>
          <div style={{fontSize: 24, fontWeight: 900, marginBottom: 24}}>ALTE ANLEIHE</div>
          <div style={{position: 'absolute', left: 0, top: 80, bottom: 70, width: 8, borderRadius: 999, backgroundColor: C.line}} />
          <div
            style={{
              position: 'absolute',
              left: 70,
              top: bondY,
              width: 410,
              height: 230,
              borderRadius: 30,
              border: `2px solid ${switched ? C.negativeLt : C.accentLt}`,
              backgroundColor: 'rgba(255,255,255,0.045)',
              padding: '30px 34px',
              boxShadow: switched ? '0 0 34px rgba(255,90,65,0.12)' : '0 0 34px rgba(92,255,173,0.12)',
            }}
          >
            <div style={{fontSize: 21, color: C.gray}}>KUPON</div>
            <div style={{fontSize: 56, fontWeight: 950, marginTop: 4}}>2 %</div>
            <div style={{marginTop: 20, fontSize: 22, color: C.gray}}>Marktwert</div>
            <div style={{fontSize: 39, fontWeight: 950, color: switched ? C.negativeLt : C.accentLt}}>{switched ? '84 €' : '100 €'}</div>
          </div>
        </div>

        <div style={{position: 'absolute', left: 110, right: 110, bottom: 54, textAlign: 'center', fontSize: 27, lineHeight: 1.25, fontWeight: 850, color: C.white}}>
          Neue Anleihen zahlen mehr Zins → die alte 2%-Anleihe muss günstiger werden.
        </div>
      </div>
    </SceneShell>
  );
};

const scenes = [
  FeeDragRibbon,
  RebalancingScale,
  DebtStrategies,
  EtfReplication,
  DividendSplit,
  PurchasingPowerShelf,
  BondRepricing,
];

export const FinanceMotionLabAdvanced: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#000000'}}>
    {scenes.map((Scene, index) => (
      <Sequence
        key={index}
        from={index * FINANCE_MOTION_LAB_ADVANCED_SCENE_FRAMES}
        durationInFrames={FINANCE_MOTION_LAB_ADVANCED_SCENE_FRAMES}
      >
        <Scene />
      </Sequence>
    ))}
  </AbsoluteFill>
);
