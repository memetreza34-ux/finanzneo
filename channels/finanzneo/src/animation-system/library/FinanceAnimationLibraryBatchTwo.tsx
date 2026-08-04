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
  purple: '#B99CFF',
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

export const calculatePercentChange = (startValue: number, endValue: number): number =>
  startValue > 0 ? (endValue - startValue) / startValue * 100 : 0;

export type StockVsEtfRaceAnimationProps = {
  stockStart: number;
  stockEnd: number;
  etfStart: number;
  etfEnd: number;
  months: number;
};

export const StockVsEtfRaceAnimation: React.FC<StockVsEtfRaceAnimationProps> = ({
  stockStart,
  stockEnd,
  etfStart,
  etfEnd,
  months,
}) => {
  const progress = useProgress();
  const stockCurrent = interpolate(progress, [0, 0.28, 0.52, 0.72, 1], [stockStart, stockStart * 1.18, stockStart * 0.83, stockStart * 1.36, stockEnd]);
  const etfCurrent = interpolate(progress, [0, 0.3, 0.62, 1], [etfStart, etfStart * 1.07, etfStart * 1.13, etfEnd]);
  const stockChange = calculatePercentChange(stockStart, stockEnd);
  const etfChange = calculatePercentChange(etfStart, etfEnd);

  const chartPoints = (volatile: boolean): string => {
    const source = volatile
      ? [[30, 390], [170, 260], [310, 470], [450, 210], [590, 330], [730, 150], [900, 105]]
      : [[30, 405], [170, 370], [310, 330], [450, 290], [590, 245], [730, 205], [900, 165]];
    const count = Math.max(2, Math.ceil(source.length * progress));
    return source.slice(0, count).map((point) => point.join(',')).join(' ');
  };

  return (
    <LibraryScene
      category="Börse & Märkte"
      title="Einzelaktie gegen ETF"
      subtitle="Vergleicht eine schwankungsreiche Einzelaktie mit einem breiter gestreuten ETF."
    >
      <GlassCard style={{height: 830, padding: 38, boxSizing: 'border-box'}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22}}>
          {[
            ['Einzelaktie', stockCurrent, stockChange, COLORS.gold],
            ['Welt-ETF', etfCurrent, etfChange, COLORS.green],
          ].map(([label, value, change, color]) => (
            <div key={String(label)} style={{padding: 24, borderRadius: 24, background: COLORS.panelSoft}}>
              <div style={{fontSize: 24, color: COLORS.muted}}>{label}</div>
              <div style={{fontSize: 55, fontWeight: 950, marginTop: 8}}>
                <AnimatedNumber value={Number(value)} suffix=" €" />
              </div>
              <div style={{fontSize: 29, color: String(color), fontWeight: 900}}>
                {Number(change) >= 0 ? '+' : ''}{Number(change).toFixed(1)} %
              </div>
            </div>
          ))}
        </div>
        <svg viewBox="0 0 940 510" style={{width: '100%', marginTop: 28}}>
          {[100, 220, 340, 460].map((y) => (
            <line key={y} x1="25" y1={y} x2="915" y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          ))}
          <polyline points={chartPoints(true)} fill="none" stroke={COLORS.gold} strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={chartPoints(false)} fill="none" stroke={COLORS.green} strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{textAlign: 'center', color: COLORS.muted, fontSize: 25, marginTop: -12}}>{months} Monate · Schwankung sichtbar machen</div>
      </GlassCard>
    </LibraryScene>
  );
};

export const calculateNominalSalary = (
  startingSalary: number,
  annualSalaryGrowthPercent: number,
  years: number,
): number => Math.max(0, startingSalary) * (1 + annualSalaryGrowthPercent / 100) ** Math.max(0, years);

export const calculateRealSalary = (
  startingSalary: number,
  annualSalaryGrowthPercent: number,
  annualInflationPercent: number,
  years: number,
): number => {
  const nominal = calculateNominalSalary(startingSalary, annualSalaryGrowthPercent, years);
  const inflationFactor = (1 + annualInflationPercent / 100) ** Math.max(0, years);
  return inflationFactor > 0 ? nominal / inflationFactor : nominal;
};

export type SalaryVsInflationAnimationProps = {
  startingSalary: number;
  annualSalaryGrowthPercent: number;
  annualInflationPercent: number;
  years: number;
};

export const SalaryVsInflationAnimation: React.FC<SalaryVsInflationAnimationProps> = ({
  startingSalary,
  annualSalaryGrowthPercent,
  annualInflationPercent,
  years,
}) => {
  const progress = useProgress();
  const animatedYears = years * progress;
  const nominal = calculateNominalSalary(startingSalary, annualSalaryGrowthPercent, animatedYears);
  const real = calculateRealSalary(startingSalary, annualSalaryGrowthPercent, annualInflationPercent, animatedYears);
  const realChange = calculatePercentChange(startingSalary, real);
  const maxValue = Math.max(startingSalary, calculateNominalSalary(startingSalary, annualSalaryGrowthPercent, years));

  return (
    <LibraryScene
      category="Einkommen & Kaufkraft"
      title="Gehalt gegen Inflation"
      subtitle="Zeigt, warum ein steigendes Gehalt real trotzdem weniger Kaufkraft bedeuten kann."
    >
      <GlassCard style={{height: 830, padding: 42, boxSizing: 'border-box'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
          <div>
            <div style={{fontSize: 25, color: COLORS.muted}}>Nach {Math.round(animatedYears)} Jahren</div>
            <div style={{fontSize: 68, fontWeight: 950, marginTop: 8}}>
              <AnimatedNumber value={nominal} suffix=" €" />
            </div>
            <div style={{fontSize: 26, color: COLORS.muted}}>nominales Monatsgehalt</div>
          </div>
          <div style={{padding: '18px 22px', borderRadius: 22, background: realChange < 0 ? 'rgba(255,107,107,0.12)' : 'rgba(92,255,154,0.12)', textAlign: 'right'}}>
            <div style={{fontSize: 22, color: COLORS.muted}}>Reale Veränderung</div>
            <div style={{fontSize: 40, fontWeight: 950, color: realChange < 0 ? COLORS.red : COLORS.green}}>
              {realChange >= 0 ? '+' : ''}{realChange.toFixed(1)} %
            </div>
          </div>
        </div>
        <div style={{height: 470, display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'end', gap: 70, padding: '36px 86px 0'}}>
          {[
            ['Nominal', nominal, COLORS.gold],
            ['Kaufkraft heute', real, realChange < 0 ? COLORS.red : COLORS.green],
          ].map(([label, value, color]) => {
            const height = maxValue > 0 ? Number(value) / maxValue * 400 : 0;
            return (
              <div key={String(label)} style={{display: 'grid', justifyItems: 'center', alignItems: 'end', height: 440}}>
                <div style={{fontSize: 31, fontWeight: 900, color: String(color), marginBottom: 14}}>{formatEuro(Number(value))}</div>
                <div style={{width: 190, height, minHeight: 18, borderRadius: '28px 28px 12px 12px', background: String(color), boxShadow: `0 18px 54px ${String(color)}33`}} />
                <div style={{fontSize: 25, color: COLORS.muted, marginTop: 16, textAlign: 'center'}}>{label}</div>
              </div>
            );
          })}
        </div>
        <div style={{display: 'flex', justifyContent: 'center', gap: 34, fontSize: 25, color: COLORS.muted}}>
          <span>Gehalt +{annualSalaryGrowthPercent.toFixed(1)} % p. a.</span>
          <span>Inflation {annualInflationPercent.toFixed(1)} % p. a.</span>
        </div>
      </GlassCard>
    </LibraryScene>
  );
};

export type DebtSnowballDebt = {
  label: string;
  balance: number;
  annualInterestPercent: number;
};

export const calculateTotalDebt = (debts: readonly DebtSnowballDebt[]): number =>
  debts.reduce((sum, debt) => sum + Math.max(0, debt.balance), 0);

export const calculateDebtSnowballOrder = (
  debts: readonly DebtSnowballDebt[],
): DebtSnowballDebt[] => [...debts].sort((left, right) =>
  left.balance - right.balance || right.annualInterestPercent - left.annualInterestPercent,
);

export type DebtSnowballAnimationProps = {
  debts: readonly DebtSnowballDebt[];
  monthlyExtraPayment: number;
};

export const DebtSnowballAnimation: React.FC<DebtSnowballAnimationProps> = ({
  debts,
  monthlyExtraPayment,
}) => {
  const progress = useProgress();
  const ordered = calculateDebtSnowballOrder(debts);
  const originalTotal = calculateTotalDebt(ordered);
  const remainingTotal = ordered.reduce((sum, debt, index) => {
    const local = clamp01(progress * ordered.length - index);
    return sum + debt.balance * (1 - local);
  }, 0);

  return (
    <LibraryScene
      category="Immobilien & Kredite"
      title="Schulden-Schneeball"
      subtitle="Die kleinste Schuld fällt zuerst. Danach wandert die freie Rate zur nächsten Position."
    >
      <GlassCard style={{height: 830, padding: 40, boxSizing: 'border-box'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
          <div>
            <div style={{fontSize: 25, color: COLORS.muted}}>Restschuld</div>
            <div style={{fontSize: 68, fontWeight: 950, color: COLORS.red}}>
              <AnimatedNumber value={remainingTotal} suffix=" €" />
            </div>
          </div>
          <div style={{textAlign: 'right'}}>
            <div style={{fontSize: 24, color: COLORS.muted}}>Zusätzliche Rate</div>
            <div style={{fontSize: 42, fontWeight: 900, color: COLORS.green}}>{formatEuro(monthlyExtraPayment)}</div>
          </div>
        </div>
        <div style={{display: 'grid', gap: 24, marginTop: 48}}>
          {ordered.map((debt, index) => {
            const local = clamp01(progress * ordered.length - index);
            const remaining = debt.balance * (1 - local);
            return (
              <div key={debt.label} style={{padding: 26, borderRadius: 26, background: COLORS.panelSoft, border: local >= 0.99 ? '1px solid rgba(92,255,154,0.45)' : '1px solid rgba(255,255,255,0.06)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 18}}>
                  <div>
                    <div style={{fontSize: 30, fontWeight: 900}}>{index + 1}. {debt.label}</div>
                    <div style={{fontSize: 22, color: COLORS.muted, marginTop: 4}}>{debt.annualInterestPercent.toFixed(1)} % Zins</div>
                  </div>
                  <div style={{fontSize: 38, fontWeight: 950, color: local >= 0.99 ? COLORS.green : COLORS.text}}>{local >= 0.99 ? 'ERLEDIGT' : formatEuro(remaining)}</div>
                </div>
                <div style={{height: 25, borderRadius: 99, background: 'rgba(255,255,255,0.07)', marginTop: 18, overflow: 'hidden'}}>
                  <div style={{height: '100%', width: `${local * 100}%`, background: local >= 0.99 ? COLORS.green : COLORS.gold, borderRadius: 99}} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{fontSize: 24, color: COLORS.muted, marginTop: 28, textAlign: 'center'}}>Start: {formatEuro(originalTotal)} · freie Rate wächst mit jeder getilgten Schuld</div>
      </GlassCard>
    </LibraryScene>
  );
};

export const calculateSavingsGoalMonths = (
  targetAmount: number,
  currentAmount: number,
  monthlyContribution: number,
): number => {
  const missing = Math.max(0, targetAmount - currentAmount);
  if (missing === 0) return 0;
  if (monthlyContribution <= 0) return 0;
  return Math.ceil(missing / monthlyContribution);
};

export type SavingsGoalCountdownAnimationProps = {
  goalLabel: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
};

export const SavingsGoalCountdownAnimation: React.FC<SavingsGoalCountdownAnimationProps> = ({
  goalLabel,
  targetAmount,
  currentAmount,
  monthlyContribution,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = useProgress();
  const finalMonths = calculateSavingsGoalMonths(targetAmount, currentAmount, monthlyContribution);
  const animatedAmount = currentAmount + Math.max(0, targetAmount - currentAmount) * progress;
  const remainingMonths = Math.max(0, Math.ceil(finalMonths * (1 - progress)));
  const fill = targetAmount > 0 ? clamp01(animatedAmount / targetAmount) : 0;
  const pulse = spring({frame, fps, config: {damping: 13, stiffness: 90, mass: 0.8}});

  return (
    <LibraryScene
      category="Sparen & Sicherheit"
      title="Sparziel-Countdown"
      subtitle="Verbindet Zielbetrag, monatliche Rate und verbleibende Monate in einer Szene."
    >
      <GlassCard style={{height: 830, padding: 42, boxSizing: 'border-box', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 38}}>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          <div>
            <div style={{fontSize: 24, color: COLORS.muted}}>Sparziel</div>
            <div style={{fontSize: 62, fontWeight: 950, marginTop: 6}}>{goalLabel}</div>
            <div style={{fontSize: 54, fontWeight: 950, color: COLORS.green, marginTop: 18}}>
              <AnimatedNumber value={animatedAmount} suffix=" €" />
            </div>
            <div style={{fontSize: 26, color: COLORS.muted}}>von {formatEuro(targetAmount)}</div>
          </div>
          <div>
            <div style={{height: 62, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden'}}>
              <div style={{height: '100%', width: `${fill * 100}%`, borderRadius: 99, background: 'linear-gradient(90deg, #F8C96B, #5CFF9A)'}} />
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 14, fontSize: 24, color: COLORS.muted}}>
              <span>{Math.round(fill * 100)} % erreicht</span>
              <span>{formatEuro(monthlyContribution)} / Monat</span>
            </div>
          </div>
        </div>
        <div style={{display: 'grid', placeItems: 'center'}}>
          <div style={{width: 340, height: 340, borderRadius: '50%', border: '24px solid rgba(92,255,154,0.16)', background: 'radial-gradient(circle, rgba(92,255,154,0.14), rgba(13,35,21,0.94) 68%)', display: 'grid', placeItems: 'center', textAlign: 'center', transform: `scale(${0.92 + pulse * 0.08})`}}>
            <div>
              <div style={{fontSize: 105, fontWeight: 950, color: remainingMonths === 0 ? COLORS.green : COLORS.gold}}>{remainingMonths}</div>
              <div style={{fontSize: 27, color: COLORS.muted}}>MONATE</div>
              <div style={{fontSize: 24, fontWeight: 850, marginTop: 8}}>{remainingMonths === 0 ? 'ZIEL ERREICHT' : 'BIS ZUM ZIEL'}</div>
            </div>
          </div>
        </div>
      </GlassCard>
    </LibraryScene>
  );
};

export const calculateRetirementGap = (
  desiredMonthlyIncome: number,
  statutoryMonthlyIncome: number,
  privateMonthlyIncome: number,
): number => Math.max(0, desiredMonthlyIncome - statutoryMonthlyIncome - privateMonthlyIncome);

export type RetirementGapAnimationProps = {
  desiredMonthlyIncome: number;
  statutoryMonthlyIncome: number;
  privateMonthlyIncome: number;
  retirementYears: number;
};

export const RetirementGapAnimation: React.FC<RetirementGapAnimationProps> = ({
  desiredMonthlyIncome,
  statutoryMonthlyIncome,
  privateMonthlyIncome,
  retirementYears,
}) => {
  const progress = useProgress();
  const gap = calculateRetirementGap(desiredMonthlyIncome, statutoryMonthlyIncome, privateMonthlyIncome);
  const funded = Math.min(desiredMonthlyIncome, statutoryMonthlyIncome + privateMonthlyIncome);
  const max = Math.max(1, desiredMonthlyIncome);

  return (
    <LibraryScene
      category="Altersvorsorge"
      title="Rentenlücke sichtbar machen"
      subtitle="Zeigt gewünschtes Einkommen, sichere Quellen und die monatlich offene Lücke."
    >
      <GlassCard style={{height: 830, padding: 44, boxSizing: 'border-box'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
          <div>
            <div style={{fontSize: 25, color: COLORS.muted}}>Wunsch im Ruhestand</div>
            <div style={{fontSize: 67, fontWeight: 950}}>{formatEuro(desiredMonthlyIncome)}</div>
          </div>
          <div style={{textAlign: 'right'}}>
            <div style={{fontSize: 24, color: COLORS.muted}}>Ruhestandsphase</div>
            <div style={{fontSize: 42, fontWeight: 900}}>{retirementYears} Jahre</div>
          </div>
        </div>
        <div style={{marginTop: 54, display: 'grid', gap: 27}}>
          {[
            ['Gesetzliche Rente', statutoryMonthlyIncome, COLORS.blue],
            ['Private Vorsorge', privateMonthlyIncome, COLORS.green],
            ['Offene Rentenlücke', gap, COLORS.red],
          ].map(([label, value, color], index) => {
            const width = Number(value) / max * 100 * clamp01(progress * 1.3 - index * 0.12);
            return (
              <div key={String(label)}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 28, marginBottom: 11}}>
                  <span style={{color: COLORS.muted}}>{label}</span>
                  <span style={{fontWeight: 900, color: String(color)}}>{formatEuro(Number(value))}</span>
                </div>
                <div style={{height: 64, borderRadius: 18, background: 'rgba(255,255,255,0.06)', overflow: 'hidden'}}>
                  <div style={{height: '100%', width: `${width}%`, borderRadius: 18, background: String(color)}} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 52}}>
          <div style={{padding: 26, borderRadius: 25, background: COLORS.panelSoft}}>
            <div style={{fontSize: 23, color: COLORS.muted}}>Heute gedeckt</div>
            <div style={{fontSize: 43, fontWeight: 950, color: COLORS.green}}>{Math.round(funded / max * 100)} %</div>
          </div>
          <div style={{padding: 26, borderRadius: 25, background: 'rgba(255,107,107,0.1)'}}>
            <div style={{fontSize: 23, color: COLORS.muted}}>Gesamtlücke über {retirementYears} Jahre</div>
            <div style={{fontSize: 43, fontWeight: 950, color: COLORS.red}}>{formatEuro(gap * 12 * retirementYears)}</div>
          </div>
        </div>
      </GlassCard>
    </LibraryScene>
  );
};

export const calculateFeeAdjustedFutureValue = (
  initialInvestment: number,
  monthlyContribution: number,
  annualReturnPercent: number,
  annualFeePercent: number,
  years: number,
): number => {
  const months = Math.max(0, Math.round(years * 12));
  const annualNetPercent = Math.max(-99, annualReturnPercent - annualFeePercent);
  const monthlyRate = annualNetPercent / 100 / 12;
  if (months === 0) return Math.max(0, initialInvestment);
  if (monthlyRate === 0) {
    return Math.max(0, initialInvestment) + Math.max(0, monthlyContribution) * months;
  }
  const factor = (1 + monthlyRate) ** months;
  return Math.max(0, initialInvestment) * factor + Math.max(0, monthlyContribution) * ((factor - 1) / monthlyRate);
};

export const calculateEtfFeeGap = (
  initialInvestment: number,
  monthlyContribution: number,
  annualReturnPercent: number,
  lowFeePercent: number,
  highFeePercent: number,
  years: number,
): number => Math.max(0,
  calculateFeeAdjustedFutureValue(initialInvestment, monthlyContribution, annualReturnPercent, lowFeePercent, years)
  - calculateFeeAdjustedFutureValue(initialInvestment, monthlyContribution, annualReturnPercent, highFeePercent, years),
);

export type EtfFeeDragAnimationProps = {
  initialInvestment: number;
  monthlyContribution: number;
  annualReturnPercent: number;
  lowFeePercent: number;
  highFeePercent: number;
  years: number;
};

export const EtfFeeDragAnimation: React.FC<EtfFeeDragAnimationProps> = ({
  initialInvestment,
  monthlyContribution,
  annualReturnPercent,
  lowFeePercent,
  highFeePercent,
  years,
}) => {
  const progress = useProgress();
  const animatedYears = years * progress;
  const lowCostValue = calculateFeeAdjustedFutureValue(initialInvestment, monthlyContribution, annualReturnPercent, lowFeePercent, animatedYears);
  const highCostValue = calculateFeeAdjustedFutureValue(initialInvestment, monthlyContribution, annualReturnPercent, highFeePercent, animatedYears);
  const finalGap = calculateEtfFeeGap(initialInvestment, monthlyContribution, annualReturnPercent, lowFeePercent, highFeePercent, years);
  const maxValue = Math.max(1, calculateFeeAdjustedFutureValue(initialInvestment, monthlyContribution, annualReturnPercent, lowFeePercent, years));

  return (
    <LibraryScene
      category="Kosten & Gebühren"
      title="ETF-Kosten-Effekt"
      subtitle="Kleine jährliche Gebühren werden über Jahrzehnte zu einer großen Vermögensdifferenz."
    >
      <GlassCard style={{height: 830, padding: 42, boxSizing: 'border-box'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
          <div>
            <div style={{fontSize: 25, color: COLORS.muted}}>Laufzeit</div>
            <div style={{fontSize: 58, fontWeight: 950}}>{Math.round(animatedYears)} Jahre</div>
          </div>
          <div style={{textAlign: 'right'}}>
            <div style={{fontSize: 24, color: COLORS.muted}}>Endgültiger Gebührenabstand</div>
            <div style={{fontSize: 47, fontWeight: 950, color: COLORS.red}}>{formatEuro(finalGap)}</div>
          </div>
        </div>
        <div style={{height: 510, display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'end', gap: 68, padding: '40px 70px 0'}}>
          {[
            [`Günstiger ETF · ${lowFeePercent.toFixed(2)} %`, lowCostValue, COLORS.green],
            [`Teurer Fonds · ${highFeePercent.toFixed(2)} %`, highCostValue, COLORS.gold],
          ].map(([label, value, color]) => {
            const height = Number(value) / maxValue * 430;
            return (
              <div key={String(label)} style={{height: 475, display: 'grid', alignItems: 'end', justifyItems: 'center'}}>
                <div style={{fontSize: 33, fontWeight: 950, color: String(color), marginBottom: 12}}>{formatEuro(Number(value))}</div>
                <div style={{width: 230, height, minHeight: 16, borderRadius: '34px 34px 12px 12px', background: String(color), boxShadow: `0 18px 60px ${String(color)}2f`}} />
                <div style={{fontSize: 23, color: COLORS.muted, marginTop: 15, textAlign: 'center', maxWidth: 280}}>{label}</div>
              </div>
            );
          })}
        </div>
        <div style={{padding: 22, borderRadius: 22, background: 'rgba(255,107,107,0.09)', textAlign: 'center', fontSize: 27, color: COLORS.muted}}>
          Gleiche Rendite vor Kosten · Unterschied entsteht nur durch laufende Gebühren
        </div>
      </GlassCard>
    </LibraryScene>
  );
};
