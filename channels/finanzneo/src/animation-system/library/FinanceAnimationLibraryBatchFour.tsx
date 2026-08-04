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
  panel: 'rgba(13,35,21,0.94)',
  panelSoft: 'rgba(255,255,255,0.055)',
  text: '#F5F7F4',
  muted: '#AFC0B4',
  green: '#5CFF9A',
  gold: '#F8C96B',
  red: '#FF6B6B',
  blue: '#78B7FF',
  purple: '#B98CFF',
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
    <div style={{fontSize: 72, lineHeight: 0.98, fontWeight: 950, marginTop: 20, maxWidth: 930}}>
      {title}
    </div>
    <div style={{fontSize: 30, lineHeight: 1.35, color: COLORS.muted, marginTop: 22, maxWidth: 910}}>
      {subtitle}
    </div>
    <div style={{position: 'relative', flex: 1, marginTop: 52}}>{children}</div>
  </AbsoluteFill>
);

const GlassCard: React.FC<React.PropsWithChildren<{style?: React.CSSProperties}>> = ({children, style}) => (
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

export type CashflowExpense = {label: string; amount: number};

export const calculateCashflowSurplus = (
  monthlyIncome: number,
  expenses: readonly CashflowExpense[],
): number => Math.max(0, monthlyIncome) - expenses.reduce((sum, item) => sum + Math.max(0, item.amount), 0);

export const CashflowSurplusFunnelAnimation: React.FC<{
  monthlyIncome: number;
  expenses: readonly CashflowExpense[];
}> = ({monthlyIncome, expenses}) => {
  const progress = useProgress();
  const totalExpenses = expenses.reduce((sum, item) => sum + Math.max(0, item.amount), 0);
  const surplus = calculateCashflowSurplus(monthlyIncome, expenses);
  const max = Math.max(monthlyIncome, totalExpenses, 1);

  return (
    <LibraryScene
      category="Budget & Cashflow"
      title="Cashflow-Trichter"
      subtitle="Zeigt, wie Einkommen durch Fixkosten fließt und welcher freie Monatsbetrag übrig bleibt."
    >
      <GlassCard style={{height: 840, padding: 38, boxSizing: 'border-box'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
          <div>
            <div style={{fontSize: 25, color: COLORS.muted}}>Monatliches Einkommen</div>
            <div style={{fontSize: 68, fontWeight: 950, color: COLORS.green}}>
              <AnimatedNumber value={monthlyIncome * progress} suffix=" €" />
            </div>
          </div>
          <div style={{textAlign: 'right'}}>
            <div style={{fontSize: 25, color: COLORS.muted}}>Frei verfügbar</div>
            <div style={{fontSize: 52, fontWeight: 950, color: surplus >= 0 ? COLORS.gold : COLORS.red}}>
              <AnimatedNumber value={surplus * progress} suffix=" €" />
            </div>
          </div>
        </div>

        <div style={{position: 'relative', height: 170, marginTop: 34}}>
          <div style={{position: 'absolute', left: '5%', right: '5%', top: 0, height: 42, borderRadius: 99, background: 'rgba(92,255,154,0.12)', overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${progress * 100}%`, background: COLORS.green, borderRadius: 99}} />
          </div>
          <div style={{position: 'absolute', left: '20%', right: '20%', top: 74, height: 34, borderRadius: 99, background: 'rgba(248,201,107,0.12)', overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${clamp01(totalExpenses / max) * progress * 100}%`, background: COLORS.red, borderRadius: 99}} />
          </div>
          <div style={{position: 'absolute', left: '35%', right: '35%', top: 132, height: 28, borderRadius: 99, background: 'rgba(248,201,107,0.12)', overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${clamp01(Math.max(0, surplus) / max) * progress * 100}%`, background: COLORS.gold, borderRadius: 99}} />
          </div>
        </div>

        <div style={{display: 'grid', gap: 16, marginTop: 22}}>
          {expenses.map((item, index) => {
            const local = clamp01(progress * 1.35 - index * 0.08);
            return (
              <div key={item.label} style={{display: 'grid', gridTemplateColumns: '220px 1fr 130px', gap: 16, alignItems: 'center'}}>
                <div style={{fontSize: 25, color: COLORS.muted}}>{item.label}</div>
                <div style={{height: 30, borderRadius: 99, background: COLORS.panelSoft, overflow: 'hidden'}}>
                  <div style={{height: '100%', width: `${clamp01(item.amount / max) * local * 100}%`, background: index % 2 ? COLORS.blue : COLORS.red, borderRadius: 99}} />
                </div>
                <div style={{fontSize: 28, fontWeight: 900, textAlign: 'right'}}>{formatEuro(item.amount)}</div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </LibraryScene>
  );
};

export type MinimumPaymentResult = {months: number; totalInterest: number; paid: boolean};

export const calculateMinimumPaymentPlan = (
  startingBalance: number,
  annualInterestPercent: number,
  minimumPaymentPercent: number,
  minimumPaymentFloor: number,
  maxMonths = 1200,
): MinimumPaymentResult => {
  let balance = Math.max(0, startingBalance);
  let totalInterest = 0;
  const monthlyRate = Math.max(0, annualInterestPercent) / 100 / 12;
  let months = 0;

  while (balance > 0.01 && months < maxMonths) {
    const interest = balance * monthlyRate;
    totalInterest += interest;
    balance += interest;
    const payment = Math.min(balance, Math.max(balance * Math.max(0, minimumPaymentPercent) / 100, Math.max(0, minimumPaymentFloor)));
    if (payment <= interest && payment < balance) {
      return {months: maxMonths, totalInterest, paid: false};
    }
    balance -= payment;
    months += 1;
  }

  return {months, totalInterest, paid: balance <= 0.01};
};

export const CreditCardMinimumPaymentAnimation: React.FC<{
  balance: number;
  annualInterestPercent: number;
  minimumPaymentPercent: number;
  minimumPaymentFloor: number;
}> = ({balance, annualInterestPercent, minimumPaymentPercent, minimumPaymentFloor}) => {
  const progress = useProgress();
  const result = calculateMinimumPaymentPlan(balance, annualInterestPercent, minimumPaymentPercent, minimumPaymentFloor);
  const shownMonths = Math.round(result.months * progress);
  const remaining = balance * (1 - Math.pow(progress, 1.8));

  return (
    <LibraryScene
      category="Immobilien & Kredite"
      title="Mindestzahlungs-Falle"
      subtitle="Zeigt, warum kleine Kreditkartenraten Laufzeit und Zinskosten stark verlängern können."
    >
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, height: 830}}>
        <GlassCard style={{padding: 36, position: 'relative', overflow: 'hidden'}}>
          <div style={{fontSize: 25, color: COLORS.muted}}>Restschuld</div>
          <div style={{fontSize: 70, fontWeight: 950, color: COLORS.red, marginTop: 10}}>
            <AnimatedNumber value={remaining} suffix=" €" />
          </div>
          <div style={{position: 'absolute', left: 42, right: 42, bottom: 54, height: 500, display: 'flex', alignItems: 'end', gap: 18}}>
            {Array.from({length: 12}, (_, index) => {
              const local = clamp01(progress * 1.25 - index * 0.045);
              const height = 440 * Math.pow(1 - index / 13, 1.35) * local;
              return <div key={index} style={{flex: 1, height, borderRadius: '18px 18px 6px 6px', background: index < 4 ? COLORS.red : COLORS.gold, opacity: 0.86}} />;
            })}
          </div>
        </GlassCard>
        <GlassCard style={{padding: 36, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          <div>
            <div style={{fontSize: 25, color: COLORS.muted}}>Zinssatz</div>
            <div style={{fontSize: 60, fontWeight: 950}}>{annualInterestPercent.toLocaleString('de-DE')} % p. a.</div>
          </div>
          <div style={{display: 'grid', gap: 18}}>
            <div style={{padding: 24, borderRadius: 24, background: COLORS.panelSoft}}>
              <div style={{fontSize: 23, color: COLORS.muted}}>Monate bis schuldenfrei</div>
              <div style={{fontSize: 52, fontWeight: 950, color: COLORS.gold}}>{shownMonths}</div>
            </div>
            <div style={{padding: 24, borderRadius: 24, background: COLORS.panelSoft}}>
              <div style={{fontSize: 23, color: COLORS.muted}}>Gesamte Zinsen</div>
              <div style={{fontSize: 50, fontWeight: 950, color: COLORS.red}}>
                <AnimatedNumber value={result.totalInterest * progress} suffix=" €" />
              </div>
            </div>
          </div>
          <div style={{fontSize: 24, lineHeight: 1.4, color: COLORS.muted}}>
            Mindestzahlung: {minimumPaymentPercent.toLocaleString('de-DE')} % oder mindestens {formatEuro(minimumPaymentFloor)}.
          </div>
        </GlassCard>
      </div>
    </LibraryScene>
  );
};

export type PortfolioWeight = {label: string; percent: number};
export type RebalanceTrade = {label: string; currentValue: number; targetValue: number; tradeValue: number};

export const calculateRebalanceTrades = (
  portfolioValue: number,
  current: readonly PortfolioWeight[],
  target: readonly PortfolioWeight[],
): readonly RebalanceTrade[] => {
  const targetByLabel = new Map(target.map((item) => [item.label, item.percent]));
  return current.map((item) => {
    const currentValue = Math.max(0, portfolioValue) * Math.max(0, item.percent) / 100;
    const targetValue = Math.max(0, portfolioValue) * Math.max(0, targetByLabel.get(item.label) ?? 0) / 100;
    return {label: item.label, currentValue, targetValue, tradeValue: targetValue - currentValue};
  });
};

export const PortfolioRebalancingAnimation: React.FC<{
  portfolioValue: number;
  current: readonly PortfolioWeight[];
  target: readonly PortfolioWeight[];
}> = ({portfolioValue, current, target}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = useProgress();
  const trades = calculateRebalanceTrades(portfolioValue, current, target);
  const pulse = spring({frame, fps, config: {damping: 15, stiffness: 80}});

  return (
    <LibraryScene
      category="Investieren"
      title="Portfolio-Rebalancing"
      subtitle="Verschiebt übergewichtete Positionen zurück auf die gewünschte Zielverteilung."
    >
      <GlassCard style={{height: 835, padding: 38, boxSizing: 'border-box'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
          <div>
            <div style={{fontSize: 25, color: COLORS.muted}}>Portfolio</div>
            <div style={{fontSize: 62, fontWeight: 950}}>{formatEuro(portfolioValue)}</div>
          </div>
          <div style={{fontSize: 28, fontWeight: 900, color: COLORS.green, transform: `scale(${0.92 + pulse * 0.08})`}}>ZIELGEWICHTE</div>
        </div>

        <div style={{display: 'grid', gap: 22, marginTop: 42}}>
          {trades.map((trade, index) => {
            const currentPercent = portfolioValue > 0 ? trade.currentValue / portfolioValue * 100 : 0;
            const targetPercent = portfolioValue > 0 ? trade.targetValue / portfolioValue * 100 : 0;
            const animatedPercent = interpolate(progress, [0.12 + index * 0.08, 0.9], [currentPercent, targetPercent], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            return (
              <div key={trade.label} style={{padding: 24, borderRadius: 26, background: COLORS.panelSoft}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div style={{fontSize: 29, fontWeight: 900}}>{trade.label}</div>
                  <div style={{fontSize: 26, color: trade.tradeValue >= 0 ? COLORS.green : COLORS.red, fontWeight: 900}}>
                    {trade.tradeValue >= 0 ? '+' : '−'}{formatEuro(Math.abs(trade.tradeValue))}
                  </div>
                </div>
                <div style={{height: 38, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden', marginTop: 16}}>
                  <div style={{height: '100%', width: `${Math.max(2, animatedPercent)}%`, background: index % 3 === 0 ? COLORS.green : index % 3 === 1 ? COLORS.gold : COLORS.blue, borderRadius: 99}} />
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 22, color: COLORS.muted}}>
                  <span>Ist {currentPercent.toFixed(0)} %</span><span>Ziel {targetPercent.toFixed(0)} %</span>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </LibraryScene>
  );
};

export const calculateRentVsBuyBreakEvenYears = (
  monthlyRent: number,
  annualRentIncreasePercent: number,
  upfrontBuyingCosts: number,
  monthlyOwnerCost: number,
  maxYears = 50,
): number => {
  let cumulativeRent = 0;
  let cumulativeOwner = Math.max(0, upfrontBuyingCosts);
  for (let year = 1; year <= maxYears; year += 1) {
    const annualRent = Math.max(0, monthlyRent) * 12 * Math.pow(1 + Math.max(0, annualRentIncreasePercent) / 100, year - 1);
    cumulativeRent += annualRent;
    cumulativeOwner += Math.max(0, monthlyOwnerCost) * 12;
    if (cumulativeRent >= cumulativeOwner) return year;
  }
  return 0;
};

export const RentVsBuyBreakEvenAnimation: React.FC<{
  monthlyRent: number;
  annualRentIncreasePercent: number;
  upfrontBuyingCosts: number;
  monthlyOwnerCost: number;
}> = ({monthlyRent, annualRentIncreasePercent, upfrontBuyingCosts, monthlyOwnerCost}) => {
  const progress = useProgress();
  const breakEvenYears = calculateRentVsBuyBreakEvenYears(monthlyRent, annualRentIncreasePercent, upfrontBuyingCosts, monthlyOwnerCost);
  const shownYear = Math.max(1, Math.round((breakEvenYears || 30) * progress));
  const rentTotal = Array.from({length: shownYear}, (_, index) => monthlyRent * 12 * Math.pow(1 + annualRentIncreasePercent / 100, index)).reduce((a, b) => a + b, 0);
  const ownerTotal = upfrontBuyingCosts + monthlyOwnerCost * 12 * shownYear;
  const max = Math.max(rentTotal, ownerTotal, 1);

  return (
    <LibraryScene
      category="Immobilien & Kredite"
      title="Mieten oder Kaufen?"
      subtitle="Stellt kumulierte Wohnkosten gegenüber und markiert den rechnerischen Gleichstand."
    >
      <GlassCard style={{height: 835, padding: 40, boxSizing: 'border-box'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
          <div>
            <div style={{fontSize: 25, color: COLORS.muted}}>Betrachtungsjahr</div>
            <div style={{fontSize: 68, fontWeight: 950}}>Jahr {shownYear}</div>
          </div>
          <div style={{textAlign: 'right'}}>
            <div style={{fontSize: 25, color: COLORS.muted}}>Rechnerischer Schnittpunkt</div>
            <div style={{fontSize: 44, fontWeight: 950, color: COLORS.gold}}>{breakEvenYears > 0 ? `Jahr ${breakEvenYears}` : 'nicht erreicht'}</div>
          </div>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, height: 520, alignItems: 'end', marginTop: 34}}>
          {[
            {label: 'Mieten', value: rentTotal, color: COLORS.blue, note: `${formatEuro(monthlyRent)} Startmiete`},
            {label: 'Kaufen', value: ownerTotal, color: COLORS.green, note: `${formatEuro(upfrontBuyingCosts)} Kaufnebenkosten`},
          ].map((item) => (
            <div key={item.label} style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'end'}}>
              <div style={{fontSize: 48, fontWeight: 950, color: item.color}}><AnimatedNumber value={item.value} suffix=" €" /></div>
              <div style={{height: `${Math.max(8, item.value / max * 390)}px`, background: item.color, borderRadius: '34px 34px 8px 8px', marginTop: 14, boxShadow: `0 25px 70px ${item.color}33`}} />
              <div style={{fontSize: 32, fontWeight: 900, marginTop: 14}}>{item.label}</div>
              <div style={{fontSize: 22, color: COLORS.muted}}>{item.note}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </LibraryScene>
  );
};

export const calculateRecoveryGainNeeded = (drawdownPercent: number): number => {
  const remaining = 1 - Math.max(0, Math.min(99.9, drawdownPercent)) / 100;
  return (1 / remaining - 1) * 100;
};

export const DrawdownRecoveryAnimation: React.FC<{startValue: number; drawdownPercent: number}> = ({startValue, drawdownPercent}) => {
  const progress = useProgress();
  const lowValue = startValue * (1 - drawdownPercent / 100);
  const neededGain = calculateRecoveryGainNeeded(drawdownPercent);
  const phase = progress < 0.48 ? progress / 0.48 : (progress - 0.48) / 0.52;
  const currentValue = progress < 0.48
    ? interpolate(phase, [0, 1], [startValue, lowValue])
    : interpolate(phase, [0, 1], [lowValue, startValue]);

  return (
    <LibraryScene
      category="Börse & Märkte"
      title="Verlust ist nicht gleich Gewinn"
      subtitle="Ein Kursverlust braucht prozentual einen deutlich größeren Anstieg, um den Ausgangswert zurückzuerreichen."
    >
      <GlassCard style={{height: 835, padding: 42, boxSizing: 'border-box'}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div>
            <div style={{fontSize: 25, color: COLORS.muted}}>Aktueller Depotwert</div>
            <div style={{fontSize: 72, fontWeight: 950}}><AnimatedNumber value={currentValue} suffix=" €" /></div>
          </div>
          <div style={{textAlign: 'right'}}>
            <div style={{fontSize: 25, color: COLORS.muted}}>Benötigte Erholung</div>
            <div style={{fontSize: 58, fontWeight: 950, color: COLORS.green}}>+{neededGain.toFixed(1)} %</div>
          </div>
        </div>
        <div style={{position: 'relative', height: 460, marginTop: 54}}>
          <div style={{position: 'absolute', left: 60, top: 20, bottom: 20, width: 18, borderRadius: 99, background: 'rgba(255,255,255,0.08)'}} />
          <div style={{position: 'absolute', left: 44, top: `${20 + (1 - currentValue / startValue) * 360}px`, width: 50, height: 50, borderRadius: '50%', background: progress < 0.48 ? COLORS.red : COLORS.green, boxShadow: '0 20px 50px rgba(92,255,154,0.25)'}} />
          <div style={{position: 'absolute', left: 130, right: 20, top: 20, padding: 28, borderRadius: 26, background: COLORS.panelSoft}}>
            <div style={{fontSize: 25, color: COLORS.muted}}>Start</div><div style={{fontSize: 44, fontWeight: 950}}>{formatEuro(startValue)}</div>
          </div>
          <div style={{position: 'absolute', left: 130, right: 20, top: 180, padding: 28, borderRadius: 26, background: 'rgba(255,107,107,0.08)'}}>
            <div style={{fontSize: 25, color: COLORS.muted}}>Nach −{drawdownPercent.toFixed(0)} %</div><div style={{fontSize: 44, fontWeight: 950, color: COLORS.red}}>{formatEuro(lowValue)}</div>
          </div>
          <div style={{position: 'absolute', left: 130, right: 20, top: 340, padding: 28, borderRadius: 26, background: 'rgba(92,255,154,0.08)'}}>
            <div style={{fontSize: 25, color: COLORS.muted}}>Zurück zum Start</div><div style={{fontSize: 44, fontWeight: 950, color: COLORS.green}}>+{neededGain.toFixed(1)} % nötig</div>
          </div>
        </div>
      </GlassCard>
    </LibraryScene>
  );
};

export const calculateSequenceEndBalance = (
  initialPortfolio: number,
  annualWithdrawal: number,
  annualReturnsPercent: readonly number[],
): number => annualReturnsPercent.reduce((balance, annualReturn) => {
  const afterReturn = Math.max(0, balance) * (1 + annualReturn / 100);
  return Math.max(0, afterReturn - Math.max(0, annualWithdrawal));
}, Math.max(0, initialPortfolio));

export const SequenceRiskAnimation: React.FC<{
  initialPortfolio: number;
  annualWithdrawal: number;
  returnsA: readonly number[];
  returnsB: readonly number[];
}> = ({initialPortfolio, annualWithdrawal, returnsA, returnsB}) => {
  const progress = useProgress();
  const years = Math.min(returnsA.length, returnsB.length);
  const visibleYears = Math.max(1, Math.ceil(years * progress));
  const endA = calculateSequenceEndBalance(initialPortfolio, annualWithdrawal, returnsA.slice(0, visibleYears));
  const endB = calculateSequenceEndBalance(initialPortfolio, annualWithdrawal, returnsB.slice(0, visibleYears));
  const max = Math.max(initialPortfolio, endA, endB, 1);

  return (
    <LibraryScene
      category="Altersvorsorge"
      title="Reihenfolge-Risiko"
      subtitle="Gleiche Renditen können im Ruhestand zu unterschiedlichen Ergebnissen führen, wenn schlechte Jahre früh kommen."
    >
      <GlassCard style={{height: 835, padding: 40, boxSizing: 'border-box'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
          <div>
            <div style={{fontSize: 25, color: COLORS.muted}}>Jährliche Entnahme</div>
            <div style={{fontSize: 56, fontWeight: 950}}>{formatEuro(annualWithdrawal)}</div>
          </div>
          <div style={{fontSize: 34, fontWeight: 900, color: COLORS.gold}}>Jahr {visibleYears}</div>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, height: 540, alignItems: 'end', marginTop: 34}}>
          {[
            {label: 'Gute Jahre zuerst', value: endA, color: COLORS.green, returns: returnsA},
            {label: 'Schlechte Jahre zuerst', value: endB, color: COLORS.red, returns: returnsB},
          ].map((item) => (
            <div key={item.label} style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'end'}}>
              <div style={{display: 'flex', gap: 7, height: 90, alignItems: 'end', marginBottom: 18}}>
                {item.returns.slice(0, visibleYears).map((value, index) => (
                  <div key={index} style={{flex: 1, height: `${20 + Math.min(65, Math.abs(value) * 2)}px`, borderRadius: 8, background: value >= 0 ? COLORS.green : COLORS.red, opacity: 0.9}} />
                ))}
              </div>
              <div style={{fontSize: 48, fontWeight: 950, color: item.color}}><AnimatedNumber value={item.value} suffix=" €" /></div>
              <div style={{height: `${Math.max(8, item.value / max * 330)}px`, background: item.color, borderRadius: '34px 34px 8px 8px', marginTop: 14}} />
              <div style={{fontSize: 29, fontWeight: 900, marginTop: 14}}>{item.label}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </LibraryScene>
  );
};
