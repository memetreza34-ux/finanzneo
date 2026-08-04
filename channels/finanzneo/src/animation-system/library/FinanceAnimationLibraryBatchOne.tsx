import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {AnimatedNumber} from '../primitives/AnimatedNumber';

const COLORS = {
  background: '#06110A',
  panel: 'rgba(13, 35, 21, 0.94)',
  panelSoft: 'rgba(255,255,255,0.055)',
  text: '#F5F7F4',
  muted: '#AFC0B4',
  green: '#5CFF9A',
  gold: '#F8C96B',
  red: '#FF6B6B',
  blue: '#78B7FF',
} as const;

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));
const formatEuro = (value: number): string => `${Math.round(value).toLocaleString('de-DE')} €`;

const useProgress = (delay = 0): number => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return clamp01((frame - delay) / Math.max(1, durationInFrames - delay - 1));
};

const LibraryScene: React.FC<{
  category: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}> = ({category, title, subtitle, children}) => (
  <AbsoluteFill
    style={{
      background:
        'radial-gradient(circle at 50% 12%, rgba(92,255,154,0.12), transparent 34%), linear-gradient(180deg, #041008 0%, #07170D 58%, #050D08 100%)',
      color: COLORS.text,
      padding: '90px 76px 250px',
      boxSizing: 'border-box',
      fontFamily: 'Inter, Arial, sans-serif',
      overflow: 'hidden',
    }}
  >
    <div style={{fontSize: 27, letterSpacing: 2.6, color: COLORS.green, fontWeight: 850}}>
      {category.toUpperCase()}
    </div>
    <div style={{fontSize: 74, lineHeight: 0.98, fontWeight: 950, marginTop: 20, maxWidth: 920}}>
      {title}
    </div>
    <div style={{fontSize: 31, lineHeight: 1.35, color: COLORS.muted, marginTop: 22, maxWidth: 900}}>
      {subtitle}
    </div>
    <div style={{position: 'relative', flex: 1, marginTop: 54}}>{children}</div>
  </AbsoluteFill>
);

const GlassCard: React.FC<React.PropsWithChildren<{style?: React.CSSProperties}>> = ({
  children,
  style,
}) => (
  <div
    style={{
      borderRadius: 34,
      background: COLORS.panel,
      border: '1px solid rgba(92,255,154,0.18)',
      boxShadow: '0 28px 90px rgba(0,0,0,0.28)',
      ...style,
    }}
  >
    {children}
  </div>
);

export const calculateCrashValue = (startValue: number, crashPercent: number): number =>
  Math.max(0, startValue * (1 - crashPercent / 100));

export const calculateRecoveryValue = (
  startValue: number,
  crashPercent: number,
  recoveryPercent: number,
): number => calculateCrashValue(startValue, crashPercent) * (1 + recoveryPercent / 100);

export type MarketCrashRecoveryAnimationProps = {
  startValue: number;
  crashPercent: number;
  recoveryPercent: number;
  months: number;
};

export const MarketCrashRecoveryAnimation: React.FC<MarketCrashRecoveryAnimationProps> = ({
  startValue,
  crashPercent,
  recoveryPercent,
  months,
}) => {
  const progress = useProgress();
  const crashValue = calculateCrashValue(startValue, crashPercent);
  const recoveryValue = calculateRecoveryValue(startValue, crashPercent, recoveryPercent);
  const currentValue = progress < 0.45
    ? interpolate(progress, [0, 0.45], [startValue, crashValue])
    : interpolate(progress, [0.45, 1], [crashValue, recoveryValue]);
  const lineProgress = interpolate(progress, [0.04, 0.92], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const points = [
    [40, 190], [170, 165], [300, 200], [430, 410], [560, 500],
    [690, 425], [820, 310], [940, 245],
  ];
  const visibleCount = Math.max(2, Math.ceil(points.length * lineProgress));
  const visiblePoints = points.slice(0, visibleCount).map((point) => point.join(',')).join(' ');

  return (
    <LibraryScene
      category="Börse & Märkte"
      title="Crash und Erholung"
      subtitle="Zeigt Kurssturz, Tiefpunkt und Erholungsphase als klare Marktbewegung."
    >
      <GlassCard style={{height: 820, padding: 38, boxSizing: 'border-box'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
          <div>
            <div style={{fontSize: 26, color: COLORS.muted}}>Depotwert</div>
            <div style={{fontSize: 76, fontWeight: 950, marginTop: 8}}>
              <AnimatedNumber value={currentValue} suffix=" €" />
            </div>
          </div>
          <div style={{textAlign: 'right'}}>
            <div style={{fontSize: 24, color: COLORS.muted}}>Zeitraum</div>
            <div style={{fontSize: 40, fontWeight: 850}}>{months} Monate</div>
          </div>
        </div>
        <svg viewBox="0 0 980 580" style={{width: '100%', marginTop: 24, overflow: 'visible'}}>
          {[120, 260, 400, 540].map((y) => (
            <line key={y} x1="30" y1={y} x2="950" y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          ))}
          <polyline
            points={visiblePoints}
            fill="none"
            stroke={progress < 0.47 ? COLORS.red : COLORS.green}
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="560" cy="500" r={progress > 0.42 ? 20 : 0} fill={COLORS.red} />
          <circle cx="940" cy="245" r={progress > 0.88 ? 20 : 0} fill={COLORS.green} />
        </svg>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18, marginTop: -26}}>
          {[
            ['Start', formatEuro(startValue), COLORS.gold],
            ['Tiefpunkt', formatEuro(crashValue), COLORS.red],
            ['Erholung', formatEuro(recoveryValue), COLORS.green],
          ].map(([label, value, color]) => (
            <div key={label} style={{background: COLORS.panelSoft, borderRadius: 22, padding: 20}}>
              <div style={{fontSize: 23, color: COLORS.muted}}>{label}</div>
              <div style={{fontSize: 33, fontWeight: 900, color}}>{value}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </LibraryScene>
  );
};

export const calculateDividendIncome = (
  portfolioValue: number,
  annualYieldPercent: number,
): number => Math.max(0, portfolioValue * annualYieldPercent / 100);

export type DividendSnowballAnimationProps = {
  portfolioValue: number;
  annualYieldPercent: number;
  years: number;
};

export const DividendSnowballAnimation: React.FC<DividendSnowballAnimationProps> = ({
  portfolioValue,
  annualYieldPercent,
  years,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = useProgress();
  const annualDividend = calculateDividendIncome(portfolioValue, annualYieldPercent);
  const reinvested = annualDividend * years;
  const snowball = spring({frame, fps, config: {damping: 13, stiffness: 80, mass: 0.8}});

  return (
    <LibraryScene
      category="Investieren"
      title="Dividenden-Schneeball"
      subtitle="Visualisiert Ausschüttungen, Wiederanlage und den wachsenden Einkommensstrom."
    >
      <div style={{display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 28, height: 830}}>
        <GlassCard style={{padding: 34, position: 'relative', overflow: 'hidden'}}>
          <div style={{fontSize: 25, color: COLORS.muted}}>Jährliche Dividende</div>
          <div style={{fontSize: 70, fontWeight: 950, marginTop: 12, color: COLORS.green}}>
            <AnimatedNumber value={annualDividend * progress} suffix=" €" />
          </div>
          <div style={{position: 'absolute', inset: '180px 20px 20px'}}>
            {Array.from({length: 14}, (_, index) => {
              const angle = index * 0.72;
              const distance = 52 + index * 18;
              const size = 44 + index * 5;
              const local = clamp01(progress * 1.35 - index * 0.055);
              return (
                <div
                  key={index}
                  style={{
                    position: 'absolute',
                    left: `calc(50% + ${Math.cos(angle) * distance}px)`,
                    top: `calc(50% + ${Math.sin(angle) * distance}px)`,
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    background: index % 3 === 0 ? COLORS.gold : COLORS.green,
                    opacity: local,
                    transform: `translate(-50%, -50%) scale(${0.35 + local * 0.65})`,
                    boxShadow: '0 14px 34px rgba(92,255,154,0.18)',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 950,
                    color: '#07120B',
                    fontSize: 20,
                  }}
                >
                  €
                </div>
              );
            })}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 210,
                height: 210,
                borderRadius: '50%',
                transform: `translate(-50%, -50%) scale(${0.78 + snowball * 0.22})`,
                background: 'radial-gradient(circle at 35% 30%, #E8FFF0, #5CFF9A 55%, #1F9C55)',
                boxShadow: '0 35px 100px rgba(92,255,154,0.25)',
                display: 'grid',
                placeItems: 'center',
                color: '#041008',
                fontSize: 38,
                fontWeight: 950,
                textAlign: 'center',
              }}
            >
              WIEDER-<br />ANLAGE
            </div>
          </div>
        </GlassCard>
        <GlassCard style={{padding: 34, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          <div>
            <div style={{fontSize: 25, color: COLORS.muted}}>Depot</div>
            <div style={{fontSize: 62, fontWeight: 950, marginTop: 10}}>{formatEuro(portfolioValue)}</div>
          </div>
          <div style={{display: 'grid', gap: 18}}>
            {Array.from({length: years}, (_, index) => {
              const fill = clamp01(progress * years - index);
              return (
                <div key={index} style={{display: 'grid', gridTemplateColumns: '90px 1fr', gap: 16, alignItems: 'center'}}>
                  <div style={{fontSize: 25, color: COLORS.muted}}>Jahr {index + 1}</div>
                  <div style={{height: 34, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden'}}>
                    <div style={{height: '100%', width: `${fill * 100}%`, background: index % 2 ? COLORS.gold : COLORS.green, borderRadius: 99}} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{padding: 24, borderRadius: 24, background: COLORS.panelSoft}}>
            <div style={{fontSize: 23, color: COLORS.muted}}>Ausschüttungen in {years} Jahren</div>
            <div style={{fontSize: 45, fontWeight: 950, color: COLORS.gold}}>
              <AnimatedNumber value={reinvested * progress} suffix=" €" />
            </div>
          </div>
        </GlassCard>
      </div>
    </LibraryScene>
  );
};

export const calculateEmergencyFundTarget = (
  monthlyExpenses: number,
  targetMonths: number,
): number => Math.max(0, monthlyExpenses) * Math.max(0, targetMonths);

export type EmergencyFundAnimationProps = {
  monthlyExpenses: number;
  targetMonths: number;
  savedAmount: number;
};

export const EmergencyFundAnimation: React.FC<EmergencyFundAnimationProps> = ({
  monthlyExpenses,
  targetMonths,
  savedAmount,
}) => {
  const progress = useProgress();
  const target = calculateEmergencyFundTarget(monthlyExpenses, targetMonths);
  const savedProgress = target > 0 ? clamp01(savedAmount / target) : 0;
  const animatedProgress = savedProgress * progress;

  return (
    <LibraryScene
      category="Sparen & Sicherheit"
      title="Notgroschen aufbauen"
      subtitle="Zeigt das Ziel in Monatsausgaben und den bereits abgesicherten Zeitraum."
    >
      <GlassCard style={{height: 830, padding: 44, boxSizing: 'border-box', display: 'grid', gridTemplateRows: 'auto 1fr auto'}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div>
            <div style={{fontSize: 25, color: COLORS.muted}}>Zielbetrag</div>
            <div style={{fontSize: 68, fontWeight: 950}}>{formatEuro(target)}</div>
          </div>
          <div style={{textAlign: 'right'}}>
            <div style={{fontSize: 25, color: COLORS.muted}}>Monatsausgaben</div>
            <div style={{fontSize: 44, fontWeight: 900}}>{formatEuro(monthlyExpenses)}</div>
          </div>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', alignItems: 'center', gap: 42}}>
          <div style={{position: 'relative', height: 420}}>
            <svg viewBox="0 0 360 430" style={{width: '100%', height: '100%'}}>
              <path d="M180 28 L315 80 V205 C315 302 253 366 180 400 C107 366 45 302 45 205 V80 Z" fill="rgba(92,255,154,0.05)" stroke="rgba(92,255,154,0.35)" strokeWidth="16" />
              <clipPath id="emergency-shield-fill">
                <rect x="30" y={400 - 360 * animatedProgress} width="300" height={360 * animatedProgress} />
              </clipPath>
              <path d="M180 28 L315 80 V205 C315 302 253 366 180 400 C107 366 45 302 45 205 V80 Z" fill={COLORS.green} clipPath="url(#emergency-shield-fill)" />
              <text x="180" y="220" textAnchor="middle" fontSize="62" fontWeight="950" fill={animatedProgress > 0.45 ? '#041008' : COLORS.text}>
                {Math.round(animatedProgress * targetMonths)}
              </text>
              <text x="180" y="270" textAnchor="middle" fontSize="25" fontWeight="800" fill={animatedProgress > 0.55 ? '#041008' : COLORS.muted}>
                MONATE SICHER
              </text>
            </svg>
          </div>
          <div style={{display: 'grid', gap: 18}}>
            {Array.from({length: targetMonths}, (_, index) => {
              const filled = clamp01(animatedProgress * targetMonths - index);
              return (
                <div key={index} style={{display: 'grid', gridTemplateColumns: '120px 1fr', gap: 18, alignItems: 'center'}}>
                  <div style={{fontSize: 25, fontWeight: 800}}>Monat {index + 1}</div>
                  <div style={{height: 54, borderRadius: 18, background: 'rgba(255,255,255,0.07)', overflow: 'hidden'}}>
                    <div style={{width: `${filled * 100}%`, height: '100%', background: index < 2 ? COLORS.gold : COLORS.green}} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)'}}>
          <div style={{fontSize: 27, color: COLORS.muted}}>Bereits gespart</div>
          <div style={{fontSize: 54, fontWeight: 950, color: COLORS.green}}>
            <AnimatedNumber value={savedAmount * progress} suffix=" €" />
          </div>
        </div>
      </GlassCard>
    </LibraryScene>
  );
};

export const calculateMonthlyMortgagePayment = (
  principal: number,
  annualInterestPercent: number,
  years: number,
): number => {
  const months = Math.max(1, Math.round(years * 12));
  const rate = annualInterestPercent / 100 / 12;
  if (rate === 0) return principal / months;
  return principal * rate * (1 + rate) ** months / ((1 + rate) ** months - 1);
};

export const calculateRemainingMortgageBalance = (
  principal: number,
  annualInterestPercent: number,
  years: number,
  elapsedYears: number,
): number => {
  const totalMonths = Math.max(1, Math.round(years * 12));
  const paidMonths = Math.max(0, Math.min(totalMonths, Math.round(elapsedYears * 12)));
  const rate = annualInterestPercent / 100 / 12;
  const payment = calculateMonthlyMortgagePayment(principal, annualInterestPercent, years);
  if (rate === 0) return Math.max(0, principal - payment * paidMonths);
  return Math.max(0, principal * (1 + rate) ** paidMonths - payment * (((1 + rate) ** paidMonths - 1) / rate));
};

export type MortgageAmortizationAnimationProps = {
  principal: number;
  annualInterestPercent: number;
  years: number;
  elapsedYears: number;
};

export const MortgageAmortizationAnimation: React.FC<MortgageAmortizationAnimationProps> = ({
  principal,
  annualInterestPercent,
  years,
  elapsedYears,
}) => {
  const progress = useProgress();
  const payment = calculateMonthlyMortgagePayment(principal, annualInterestPercent, years);
  const remaining = calculateRemainingMortgageBalance(principal, annualInterestPercent, years, elapsedYears);
  const paidPrincipal = principal - remaining;
  const principalProgress = principal > 0 ? paidPrincipal / principal : 0;

  return (
    <LibraryScene
      category="Immobilien & Kredite"
      title="Baufinanzierung verstehen"
      subtitle="Zeigt Monatsrate, Restschuld und wie langsam die Tilgung am Anfang wächst."
    >
      <div style={{display: 'grid', gridTemplateColumns: '1.04fr 0.96fr', gap: 28, height: 830}}>
        <GlassCard style={{padding: 36, display: 'grid', gridTemplateRows: 'auto 1fr auto'}}>
          <div>
            <div style={{fontSize: 25, color: COLORS.muted}}>Restschuld nach {elapsedYears} Jahren</div>
            <div style={{fontSize: 68, fontWeight: 950, color: COLORS.gold}}>
              <AnimatedNumber value={interpolate(progress, [0, 1], [principal, remaining])} suffix=" €" />
            </div>
          </div>
          <div style={{position: 'relative', display: 'grid', placeItems: 'center'}}>
            <div style={{width: 360, height: 280, position: 'relative'}}>
              <div style={{position: 'absolute', left: 38, right: 38, bottom: 0, height: 205, background: 'linear-gradient(180deg,#173B26,#0A2113)', border: '5px solid rgba(92,255,154,0.32)', borderRadius: '18px 18px 28px 28px'}} />
              <div style={{position: 'absolute', left: 15, top: 18, width: 330, height: 190, transform: 'rotate(45deg)', background: COLORS.green, borderRadius: 20, opacity: 0.88}} />
              <div style={{position: 'absolute', left: 80, top: 86, width: 200, height: 150, background: '#0B1E12'}} />
              <div style={{position: 'absolute', left: 145, bottom: 0, width: 74, height: 120, background: COLORS.gold, borderRadius: '14px 14px 0 0'}} />
            </div>
            <div style={{position: 'absolute', bottom: 30, left: '8%', right: '8%', height: 34, borderRadius: 99, background: 'rgba(255,255,255,0.08)', overflow: 'hidden'}}>
              <div style={{height: '100%', width: `${principalProgress * progress * 100}%`, background: COLORS.green, borderRadius: 99}} />
            </div>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
            <div style={{background: COLORS.panelSoft, padding: 22, borderRadius: 22}}>
              <div style={{fontSize: 22, color: COLORS.muted}}>Getilgt</div>
              <div style={{fontSize: 38, fontWeight: 900, color: COLORS.green}}>{formatEuro(paidPrincipal)}</div>
            </div>
            <div style={{background: COLORS.panelSoft, padding: 22, borderRadius: 22}}>
              <div style={{fontSize: 22, color: COLORS.muted}}>Laufzeit</div>
              <div style={{fontSize: 38, fontWeight: 900}}>{years} Jahre</div>
            </div>
          </div>
        </GlassCard>
        <GlassCard style={{padding: 34, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          <div>
            <div style={{fontSize: 25, color: COLORS.muted}}>Monatsrate</div>
            <div style={{fontSize: 64, fontWeight: 950}}>{formatEuro(payment)}</div>
          </div>
          <div style={{position: 'relative', width: 360, height: 360, margin: '0 auto'}}>
            <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: `conic-gradient(${COLORS.green} 0 ${principalProgress * progress * 360}deg, rgba(255,255,255,0.07) ${principalProgress * progress * 360}deg 360deg)`}} />
            <div style={{position: 'absolute', inset: 55, borderRadius: '50%', background: '#0A2113', display: 'grid', placeItems: 'center', textAlign: 'center'}}>
              <div>
                <div style={{fontSize: 54, fontWeight: 950}}>{Math.round(principalProgress * progress * 100)}%</div>
                <div style={{fontSize: 22, color: COLORS.muted}}>Kredit getilgt</div>
              </div>
            </div>
          </div>
          <div style={{padding: 22, borderRadius: 22, background: 'rgba(248,201,107,0.09)', border: '1px solid rgba(248,201,107,0.22)', fontSize: 25, lineHeight: 1.35}}>
            Zinsen werden auf die jeweilige Restschuld berechnet. Deshalb steigt der Tilgungsanteil erst mit der Zeit.
          </div>
        </GlassCard>
      </div>
    </LibraryScene>
  );
};

export const calculateNetWorth = (assets: number, debts: number): number => assets - debts;

export type NetWorthStackAnimationProps = {
  cash: number;
  investments: number;
  property: number;
  debts: number;
};

export const NetWorthStackAnimation: React.FC<NetWorthStackAnimationProps> = ({
  cash,
  investments,
  property,
  debts,
}) => {
  const progress = useProgress();
  const assets = cash + investments + property;
  const netWorth = calculateNetWorth(assets, debts);
  const max = Math.max(1, assets, debts);
  const assetItems = [
    ['Cash', cash, COLORS.blue],
    ['Depot', investments, COLORS.green],
    ['Immobilie', property, COLORS.gold],
  ] as const;

  return (
    <LibraryScene
      category="Vermögen"
      title="Nettovermögen aufbauen"
      subtitle="Ordnet Vermögenswerte und Schulden, bevor daraus das echte Nettovermögen entsteht."
    >
      <GlassCard style={{height: 830, padding: 40, boxSizing: 'border-box', display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 34}}>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 22, padding: '30px 10px 50px'}}>
          {assetItems.map(([label, value, color], index) => {
            const local = clamp01(progress * 1.35 - index * 0.12);
            const height = Math.max(80, value / max * 560 * local);
            return (
              <div key={label} style={{flex: 1, display: 'grid', gridTemplateRows: '1fr auto', gap: 18, height: '100%', alignItems: 'end'}}>
                <div style={{alignSelf: 'end', height, borderRadius: '28px 28px 12px 12px', background: color, boxShadow: `0 24px 70px ${color}33`, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 18, color: '#06110A', fontWeight: 950, fontSize: 27}}>
                  {formatEuro(value)}
                </div>
                <div style={{fontSize: 24, fontWeight: 800, textAlign: 'center'}}>{label}</div>
              </div>
            );
          })}
        </div>
        <div style={{display: 'grid', gridTemplateRows: '1fr auto', gap: 22}}>
          <div style={{display: 'grid', placeItems: 'center'}}>
            <div style={{width: 300, height: 520, position: 'relative', borderRadius: 30, background: 'rgba(255,255,255,0.06)', overflow: 'hidden'}}>
              <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${debts / max * progress * 100}%`, background: `linear-gradient(180deg, ${COLORS.red}, #9D2D3A)`}} />
              <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center'}}>
                <div>
                  <div style={{fontSize: 25, color: COLORS.muted}}>Schulden</div>
                  <div style={{fontSize: 48, fontWeight: 950}}>{formatEuro(debts)}</div>
                </div>
              </div>
            </div>
          </div>
          <div style={{borderRadius: 28, padding: 25, background: netWorth >= 0 ? 'rgba(92,255,154,0.1)' : 'rgba(255,107,107,0.1)', border: `1px solid ${netWorth >= 0 ? 'rgba(92,255,154,0.25)' : 'rgba(255,107,107,0.25)'}`}}>
            <div style={{fontSize: 23, color: COLORS.muted}}>Nettovermögen</div>
            <div style={{fontSize: 52, fontWeight: 950, color: netWorth >= 0 ? COLORS.green : COLORS.red}}>
              <AnimatedNumber value={netWorth * progress} suffix=" €" />
            </div>
          </div>
        </div>
      </GlassCard>
    </LibraryScene>
  );
};

export const calculateFireTarget = (
  annualExpenses: number,
  withdrawalRatePercent: number,
): number => withdrawalRatePercent > 0
  ? annualExpenses / (withdrawalRatePercent / 100)
  : 0;

export type FireProgressAnimationProps = {
  annualExpenses: number;
  currentPortfolio: number;
  withdrawalRatePercent: number;
};

export const FireProgressAnimation: React.FC<FireProgressAnimationProps> = ({
  annualExpenses,
  currentPortfolio,
  withdrawalRatePercent,
}) => {
  const progress = useProgress();
  const target = calculateFireTarget(annualExpenses, withdrawalRatePercent);
  const fireProgress = target > 0 ? clamp01(currentPortfolio / target) : 0;
  const animated = fireProgress * progress;
  const degrees = animated * 360;

  return (
    <LibraryScene
      category="Finanzielle Freiheit"
      title="FIRE-Ziel erreichen"
      subtitle="Verbindet Jahresausgaben, Entnahmerate und den Fortschritt bis zur finanziellen Freiheit."
    >
      <GlassCard style={{height: 830, padding: 42, boxSizing: 'border-box', display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 34}}>
        <div style={{display: 'grid', placeItems: 'center'}}>
          <div style={{position: 'relative', width: 480, height: 480}}>
            <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: `conic-gradient(${COLORS.green} 0 ${degrees}deg, rgba(255,255,255,0.07) ${degrees}deg 360deg)`, boxShadow: '0 30px 120px rgba(92,255,154,0.16)'}} />
            <div style={{position: 'absolute', inset: 62, borderRadius: '50%', background: '#0A2113', display: 'grid', placeItems: 'center', textAlign: 'center'}}>
              <div>
                <div style={{fontSize: 88, fontWeight: 950}}>{Math.round(animated * 100)}%</div>
                <div style={{fontSize: 25, color: COLORS.muted}}>vom FIRE-Ziel</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          <div>
            <div style={{fontSize: 24, color: COLORS.muted}}>Benötigtes Vermögen</div>
            <div style={{fontSize: 65, fontWeight: 950, color: COLORS.gold}}>{formatEuro(target)}</div>
            <div style={{fontSize: 24, color: COLORS.muted, marginTop: 12}}>
              bei {withdrawalRatePercent.toLocaleString('de-DE')} % Entnahmerate
            </div>
          </div>
          <div style={{display: 'grid', gap: 18}}>
            {[
              ['Jahresausgaben', annualExpenses, COLORS.blue],
              ['Aktuelles Depot', currentPortfolio, COLORS.green],
              ['Fehlender Betrag', Math.max(0, target - currentPortfolio), COLORS.red],
            ].map(([label, value, color]) => (
              <div key={String(label)} style={{padding: 23, borderRadius: 24, background: COLORS.panelSoft, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <div style={{fontSize: 24, color: COLORS.muted}}>{label}</div>
                <div style={{fontSize: 37, fontWeight: 900, color: String(color)}}>{formatEuro(Number(value))}</div>
              </div>
            ))}
          </div>
          <div style={{padding: 23, borderRadius: 24, background: 'rgba(92,255,154,0.09)', border: '1px solid rgba(92,255,154,0.24)', fontSize: 25, lineHeight: 1.35}}>
            Das Ziel passt sich automatisch an die tatsächlichen Ausgaben und die gewählte Entnahmerate an.
          </div>
        </div>
      </GlassCard>
    </LibraryScene>
  );
};
