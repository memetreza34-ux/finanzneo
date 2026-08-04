import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {AnimatedNumber} from '../primitives/AnimatedNumber';

const COLORS = {
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
const money = (value: number): string => `${Math.round(value).toLocaleString('de-DE')} €`;

const useProgress = (delay = 0): number => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return clamp01((frame - delay) / Math.max(1, durationInFrames - delay - 1));
};

const Scene: React.FC<React.PropsWithChildren<{category: string; title: string; subtitle: string}>> = ({
  category,
  title,
  subtitle,
  children,
}) => (
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
    <div style={{fontSize: 27, letterSpacing: 2.6, color: COLORS.green, fontWeight: 850}}>{category.toUpperCase()}</div>
    <div style={{fontSize: 72, lineHeight: 0.98, fontWeight: 950, marginTop: 20, maxWidth: 930}}>{title}</div>
    <div style={{fontSize: 30, lineHeight: 1.35, color: COLORS.muted, marginTop: 22, maxWidth: 910}}>{subtitle}</div>
    <div style={{position: 'relative', flex: 1, marginTop: 52}}>{children}</div>
  </AbsoluteFill>
);

const Card: React.FC<React.PropsWithChildren<{style?: React.CSSProperties}>> = ({children, style}) => (
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

export type SubscriptionItem = {label: string; monthlyCost: number};

export const calculateAnnualSubscriptionCost = (items: readonly SubscriptionItem[]): number =>
  items.reduce((sum, item) => sum + Math.max(0, item.monthlyCost) * 12, 0);

export const SubscriptionCreepAnimation: React.FC<{items: readonly SubscriptionItem[]}> = ({items}) => {
  const progress = useProgress();
  const annual = calculateAnnualSubscriptionCost(items);
  const monthly = annual / 12;
  return (
    <Scene category="Konsum & Verträge" title="Abo-Kosten wachsen leise" subtitle="Viele kleine Monatsbeträge werden zu einer überraschend großen Jahresbelastung.">
      <Card style={{height: 835, padding: 38, boxSizing: 'border-box'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
          <div><div style={{fontSize: 25, color: COLORS.muted}}>Monatlich</div><div style={{fontSize: 66, fontWeight: 950}}><AnimatedNumber value={monthly * progress} suffix=" €" /></div></div>
          <div style={{textAlign: 'right'}}><div style={{fontSize: 25, color: COLORS.muted}}>Pro Jahr</div><div style={{fontSize: 58, fontWeight: 950, color: COLORS.red}}><AnimatedNumber value={annual * progress} suffix=" €" /></div></div>
        </div>
        <div style={{display: 'grid', gap: 16, marginTop: 42}}>
          {items.map((item, index) => {
            const local = clamp01(progress * 1.35 - index * 0.09);
            return (
              <div key={item.label} style={{display: 'grid', gridTemplateColumns: '220px 1fr 130px', gap: 16, alignItems: 'center', padding: 18, borderRadius: 22, background: COLORS.panelSoft, transform: `translateX(${(1 - local) * 120}px)`, opacity: local}}>
                <div style={{fontSize: 26, fontWeight: 850}}>{item.label}</div>
                <div style={{height: 30, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden'}}><div style={{height: '100%', width: `${Math.min(100, item.monthlyCost / Math.max(...items.map((x) => x.monthlyCost), 1) * 100 * local)}%`, background: index % 2 ? COLORS.gold : COLORS.red, borderRadius: 99}} /></div>
                <div style={{fontSize: 27, textAlign: 'right', fontWeight: 900}}>{money(item.monthlyCost)}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </Scene>
  );
};

export const calculateExchangeReceived = (
  sourceAmount: number,
  providerRate: number,
  feePercent: number,
  fixedFee: number,
): number => Math.max(0, Math.max(0, sourceAmount) * (1 - Math.max(0, feePercent) / 100) - Math.max(0, fixedFee)) * Math.max(0, providerRate);

export const calculateExchangeLoss = (
  sourceAmount: number,
  referenceRate: number,
  providerRate: number,
  feePercent: number,
  fixedFee: number,
): number => Math.max(0, Math.max(0, sourceAmount) * Math.max(0, referenceRate) - calculateExchangeReceived(sourceAmount, providerRate, feePercent, fixedFee));

export const CurrencyExchangeSpreadAnimation: React.FC<{
  sourceAmount: number;
  referenceRate: number;
  providerRate: number;
  feePercent: number;
  fixedFee: number;
}> = ({sourceAmount, referenceRate, providerRate, feePercent, fixedFee}) => {
  const progress = useProgress();
  const ideal = sourceAmount * referenceRate;
  const received = calculateExchangeReceived(sourceAmount, providerRate, feePercent, fixedFee);
  const loss = calculateExchangeLoss(sourceAmount, referenceRate, providerRate, feePercent, fixedFee);
  return (
    <Scene category="Kosten & Gebühren" title="Wechselkurs und Gebühren" subtitle="Zeigt Spread, prozentuale Gebühr und Fixkosten in einer einzigen Geldbewegung.">
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, height: 830}}>
        <Card style={{padding: 36, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          <div><div style={{fontSize: 25, color: COLORS.muted}}>Ausgangsbetrag</div><div style={{fontSize: 66, fontWeight: 950}}>{money(sourceAmount)}</div></div>
          <div style={{height: 420, position: 'relative'}}>
            <div style={{position: 'absolute', left: 48, right: 48, top: 48, height: 52, borderRadius: 99, background: COLORS.green, transform: `scaleX(${progress})`, transformOrigin: 'left'}} />
            <div style={{position: 'absolute', left: 48, right: 120, top: 178, height: 46, borderRadius: 99, background: COLORS.gold, transform: `scaleX(${progress})`, transformOrigin: 'left'}} />
            <div style={{position: 'absolute', left: 48, right: 200, top: 304, height: 40, borderRadius: 99, background: COLORS.red, transform: `scaleX(${progress})`, transformOrigin: 'left'}} />
            <div style={{position: 'absolute', left: 48, top: 112, fontSize: 24, color: COLORS.muted}}>Referenzkurs {referenceRate.toLocaleString('de-DE')}</div>
            <div style={{position: 'absolute', left: 48, top: 238, fontSize: 24, color: COLORS.muted}}>Anbieterkurs {providerRate.toLocaleString('de-DE')}</div>
          </div>
        </Card>
        <Card style={{padding: 36, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          <div><div style={{fontSize: 25, color: COLORS.muted}}>Tatsächlich erhalten</div><div style={{fontSize: 62, fontWeight: 950, color: COLORS.green}}><AnimatedNumber value={received * progress} suffix="" decimals={2} /></div></div>
          <div style={{display: 'grid', gap: 18}}>
            <div style={{padding: 24, borderRadius: 24, background: COLORS.panelSoft}}><div style={{fontSize: 23, color: COLORS.muted}}>Idealer Gegenwert</div><div style={{fontSize: 42, fontWeight: 900}}>{ideal.toLocaleString('de-DE', {maximumFractionDigits: 2})}</div></div>
            <div style={{padding: 24, borderRadius: 24, background: COLORS.panelSoft}}><div style={{fontSize: 23, color: COLORS.muted}}>Verlust durch Spread und Gebühren</div><div style={{fontSize: 44, fontWeight: 950, color: COLORS.red}}><AnimatedNumber value={loss * progress} decimals={2} /></div></div>
          </div>
          <div style={{fontSize: 24, color: COLORS.muted}}>{feePercent.toLocaleString('de-DE')} % Gebühr + {money(fixedFee)} Fixkosten</div>
        </Card>
      </div>
    </Scene>
  );
};

export const calculateLoanMonthlyPayment = (principal: number, annualRatePercent: number, years: number): number => {
  const safePrincipal = Math.max(0, principal);
  const months = Math.max(1, Math.round(Math.max(0, years) * 12));
  const rate = Math.max(0, annualRatePercent) / 100 / 12;
  if (rate === 0) return safePrincipal / months;
  return safePrincipal * rate / (1 - Math.pow(1 + rate, -months));
};

export const calculateRefinanceBreakEvenMonths = (
  balance: number,
  currentRatePercent: number,
  newRatePercent: number,
  yearsRemaining: number,
  closingCosts: number,
): number => {
  const oldPayment = calculateLoanMonthlyPayment(balance, currentRatePercent, yearsRemaining);
  const newPayment = calculateLoanMonthlyPayment(balance, newRatePercent, yearsRemaining);
  const monthlySavings = oldPayment - newPayment;
  return monthlySavings > 0 ? Math.ceil(Math.max(0, closingCosts) / monthlySavings) : 0;
};

export const LoanRefinanceBreakEvenAnimation: React.FC<{
  balance: number;
  currentRatePercent: number;
  newRatePercent: number;
  yearsRemaining: number;
  closingCosts: number;
}> = ({balance, currentRatePercent, newRatePercent, yearsRemaining, closingCosts}) => {
  const progress = useProgress();
  const oldPayment = calculateLoanMonthlyPayment(balance, currentRatePercent, yearsRemaining);
  const newPayment = calculateLoanMonthlyPayment(balance, newRatePercent, yearsRemaining);
  const savings = Math.max(0, oldPayment - newPayment);
  const breakEven = calculateRefinanceBreakEvenMonths(balance, currentRatePercent, newRatePercent, yearsRemaining, closingCosts);
  return (
    <Scene category="Immobilien & Kredite" title="Umschuldung: Wann lohnt sie sich?" subtitle="Vergleicht alte und neue Rate und markiert den Monat, ab dem die Wechselkosten aufgeholt sind.">
      <Card style={{height: 835, padding: 38, boxSizing: 'border-box'}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24}}>
          {[['Alter Kredit', currentRatePercent, oldPayment, COLORS.red], ['Neuer Kredit', newRatePercent, newPayment, COLORS.green]].map(([label, rate, payment, color]) => (
            <div key={String(label)} style={{padding: 28, borderRadius: 28, background: COLORS.panelSoft}}><div style={{fontSize: 25, color: COLORS.muted}}>{label}</div><div style={{fontSize: 48, fontWeight: 950, color: String(color)}}>{Number(rate).toLocaleString('de-DE')} %</div><div style={{fontSize: 38, fontWeight: 900, marginTop: 16}}>{money(Number(payment))} / Monat</div></div>
          ))}
        </div>
        <div style={{marginTop: 48, height: 180, position: 'relative'}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 70, height: 22, borderRadius: 99, background: 'rgba(255,255,255,0.08)'}} />
          <div style={{position: 'absolute', left: 0, width: `${progress * 100}%`, top: 70, height: 22, borderRadius: 99, background: COLORS.green}} />
          <div style={{position: 'absolute', left: `${Math.min(100, breakEven / Math.max(1, breakEven + 24) * 100)}%`, top: 35, width: 4, height: 92, background: COLORS.gold}} />
          <div style={{position: 'absolute', left: `${Math.min(88, breakEven / Math.max(1, breakEven + 24) * 100)}%`, top: 0, fontSize: 24, color: COLORS.gold, fontWeight: 900}}>Break-even Monat {breakEven}</div>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18, marginTop: 40}}>
          <div style={{padding: 22, borderRadius: 22, background: COLORS.panelSoft}}><div style={{fontSize: 22, color: COLORS.muted}}>Restschuld</div><div style={{fontSize: 35, fontWeight: 900}}>{money(balance)}</div></div>
          <div style={{padding: 22, borderRadius: 22, background: COLORS.panelSoft}}><div style={{fontSize: 22, color: COLORS.muted}}>Wechselkosten</div><div style={{fontSize: 35, fontWeight: 900}}>{money(closingCosts)}</div></div>
          <div style={{padding: 22, borderRadius: 22, background: COLORS.panelSoft}}><div style={{fontSize: 22, color: COLORS.muted}}>Monatlich gespart</div><div style={{fontSize: 35, fontWeight: 950, color: COLORS.green}}><AnimatedNumber value={savings * progress} suffix=" €" /></div></div>
        </div>
      </Card>
    </Scene>
  );
};

export const calculateDividendTotalReturnPercent = (dividendYieldPercent: number, priceChangePercent: number): number =>
  Math.max(0, dividendYieldPercent) + priceChangePercent;

export const DividendYieldTrapAnimation: React.FC<{
  initialInvestment: number;
  dividendYieldPercent: number;
  priceChangePercent: number;
}> = ({initialInvestment, dividendYieldPercent, priceChangePercent}) => {
  const progress = useProgress();
  const dividend = initialInvestment * Math.max(0, dividendYieldPercent) / 100;
  const priceValue = initialInvestment * (1 + priceChangePercent / 100);
  const endValue = Math.max(0, priceValue + dividend);
  const totalReturn = calculateDividendTotalReturnPercent(dividendYieldPercent, priceChangePercent);
  return (
    <Scene category="Investieren" title="Die Dividendenrendite-Falle" subtitle="Eine hohe Ausschüttung kann einen starken Kursverlust nicht automatisch ausgleichen.">
      <div style={{display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 28, height: 830}}>
        <Card style={{padding: 36, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <div style={{fontSize: 26, color: COLORS.muted}}>Dividendenrendite</div><div style={{fontSize: 96, fontWeight: 950, color: COLORS.gold, transform: `scale(${0.8 + progress * 0.2})`}}>{dividendYieldPercent.toLocaleString('de-DE')} %</div><div style={{fontSize: 30, marginTop: 26}}>Ausschüttung {money(dividend)}</div>
        </Card>
        <Card style={{padding: 36, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          <div><div style={{fontSize: 25, color: COLORS.muted}}>Kursentwicklung</div><div style={{fontSize: 66, fontWeight: 950, color: priceChangePercent < 0 ? COLORS.red : COLORS.green}}>{priceChangePercent > 0 ? '+' : ''}{priceChangePercent.toLocaleString('de-DE')} %</div></div>
          <div style={{height: 280, display: 'flex', alignItems: 'end', gap: 34}}>
            <div style={{flex: 1, height: 250, borderRadius: '26px 26px 8px 8px', background: COLORS.blue}} />
            <div style={{flex: 1, height: `${Math.max(20, 250 * clamp01(endValue / Math.max(1, initialInvestment)) * progress)}px`, borderRadius: '26px 26px 8px 8px', background: totalReturn >= 0 ? COLORS.green : COLORS.red}} />
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 25}}><span>Start {money(initialInvestment)}</span><span>Ende {money(endValue)}</span></div>
          <div style={{padding: 22, borderRadius: 22, background: COLORS.panelSoft}}><div style={{fontSize: 23, color: COLORS.muted}}>Gesamtrendite</div><div style={{fontSize: 48, fontWeight: 950, color: totalReturn >= 0 ? COLORS.green : COLORS.red}}>{totalReturn > 0 ? '+' : ''}{totalReturn.toLocaleString('de-DE')} %</div></div>
        </Card>
      </div>
    </Scene>
  );
};

export const calculateFreedomYears = (
  monthlyIncome: number,
  savingsRatePercent: number,
  annualReturnPercent: number,
  withdrawalRatePercent: number,
  maxYears = 100,
): number => {
  const monthlySavings = Math.max(0, monthlyIncome) * clamp01(savingsRatePercent / 100);
  const annualExpenses = Math.max(0, monthlyIncome - monthlySavings) * 12;
  const target = withdrawalRatePercent > 0 ? annualExpenses / (withdrawalRatePercent / 100) : 0;
  if (target <= 0) return 0;
  const monthlyRate = Math.max(0, annualReturnPercent) / 100 / 12;
  let balance = 0;
  for (let month = 1; month <= maxYears * 12; month += 1) {
    balance = balance * (1 + monthlyRate) + monthlySavings;
    if (balance >= target) return month / 12;
  }
  return 0;
};

export const SavingsRateFreedomTimelineAnimation: React.FC<{
  monthlyIncome: number;
  savingsRates: readonly number[];
  annualReturnPercent: number;
  withdrawalRatePercent: number;
}> = ({monthlyIncome, savingsRates, annualReturnPercent, withdrawalRatePercent}) => {
  const progress = useProgress();
  const results = savingsRates.map((rate) => ({rate, years: calculateFreedomYears(monthlyIncome, rate, annualReturnPercent, withdrawalRatePercent)}));
  const maxYears = Math.max(...results.map((item) => item.years), 1);
  return (
    <Scene category="Finanzielle Freiheit" title="Sparquote gegen Zeit" subtitle="Zeigt, wie eine höhere Sparquote den Weg zur finanziellen Unabhängigkeit verkürzen kann.">
      <Card style={{height: 835, padding: 42, boxSizing: 'border-box'}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}><div><div style={{fontSize: 25, color: COLORS.muted}}>Monatseinkommen</div><div style={{fontSize: 58, fontWeight: 950}}>{money(monthlyIncome)}</div></div><div style={{textAlign: 'right', fontSize: 24, color: COLORS.muted}}>{annualReturnPercent.toLocaleString('de-DE')} % Rendite · {withdrawalRatePercent.toLocaleString('de-DE')} % Entnahmerate</div></div>
        <div style={{display: 'grid', gap: 28, marginTop: 58}}>
          {results.map((item, index) => {
            const local = clamp01(progress * 1.25 - index * 0.09);
            return (
              <div key={item.rate} style={{display: 'grid', gridTemplateColumns: '150px 1fr 150px', gap: 20, alignItems: 'center'}}>
                <div style={{fontSize: 34, fontWeight: 950, color: index === results.length - 1 ? COLORS.green : COLORS.text}}>{item.rate} %</div>
                <div style={{height: 62, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden'}}><div style={{height: '100%', width: `${Math.max(3, item.years / maxYears * 100 * local)}%`, borderRadius: 99, background: index === 0 ? COLORS.red : index === results.length - 1 ? COLORS.green : COLORS.gold}} /></div>
                <div style={{fontSize: 31, fontWeight: 900, textAlign: 'right'}}>{item.years > 0 ? `${item.years.toFixed(1)} J.` : '—'}</div>
              </div>
            );
          })}
        </div>
        <div style={{marginTop: 60, padding: 26, borderRadius: 26, background: COLORS.panelSoft, fontSize: 27, lineHeight: 1.45, color: COLORS.muted}}>Modellrechnung mit konstantem Einkommen, konstanter Rendite und unveränderter Sparquote. Keine Renditegarantie.</div>
      </Card>
    </Scene>
  );
};

export type BnplContract = {label: string; monthlyPayment: number; remainingMonths: number};

export const calculateBnplMonthlyLoad = (contracts: readonly BnplContract[]): number =>
  contracts.reduce((sum, item) => sum + Math.max(0, item.monthlyPayment), 0);

export const calculateBnplCommittedAmount = (contracts: readonly BnplContract[]): number =>
  contracts.reduce((sum, item) => sum + Math.max(0, item.monthlyPayment) * Math.max(0, item.remainingMonths), 0);

export const BnplInstallmentStackAnimation: React.FC<{monthlyIncome: number; contracts: readonly BnplContract[]}> = ({monthlyIncome, contracts}) => {
  const progress = useProgress();
  const monthlyLoad = calculateBnplMonthlyLoad(contracts);
  const committed = calculateBnplCommittedAmount(contracts);
  const share = monthlyIncome > 0 ? monthlyLoad / monthlyIncome * 100 : 0;
  return (
    <Scene category="Konsum & Verträge" title="Ratenkäufe stapeln sich" subtitle="Mehrere kleine Buy-now-pay-later-Raten werden zu einer festen monatlichen Belastung.">
      <div style={{display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 28, height: 830}}>
        <Card style={{padding: 36, overflow: 'hidden'}}>
          <div style={{fontSize: 25, color: COLORS.muted}}>Aktive Raten</div>
          <div style={{display: 'grid', gap: 18, marginTop: 34}}>
            {contracts.map((item, index) => {
              const local = clamp01(progress * 1.4 - index * 0.1);
              return <div key={item.label} style={{padding: 24, borderRadius: 24, background: COLORS.panelSoft, transform: `translateY(${(1 - local) * 80}px)`, opacity: local}}><div style={{display: 'flex', justifyContent: 'space-between'}}><span style={{fontSize: 28, fontWeight: 900}}>{item.label}</span><span style={{fontSize: 28, fontWeight: 950, color: COLORS.red}}>{money(item.monthlyPayment)}</span></div><div style={{fontSize: 22, color: COLORS.muted, marginTop: 10}}>noch {item.remainingMonths} Monate</div></div>;
            })}
          </div>
        </Card>
        <Card style={{padding: 36, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          <div><div style={{fontSize: 25, color: COLORS.muted}}>Monatliche Belastung</div><div style={{fontSize: 64, fontWeight: 950, color: COLORS.red}}><AnimatedNumber value={monthlyLoad * progress} suffix=" €" /></div></div>
          <div style={{position: 'relative', width: 300, height: 300, margin: '0 auto'}}><div style={{position: 'absolute', inset: 0, borderRadius: '50%', border: '34px solid rgba(255,255,255,0.07)'}} /><div style={{position: 'absolute', inset: 0, borderRadius: '50%', border: `34px solid ${COLORS.gold}`, clipPath: `polygon(0 0, ${Math.min(100, share * progress)}% 0, ${Math.min(100, share * progress)}% 100%, 0 100%)`}} /><div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 48, fontWeight: 950}}>{share.toFixed(1)} %</div></div>
          <div style={{padding: 24, borderRadius: 24, background: COLORS.panelSoft}}><div style={{fontSize: 23, color: COLORS.muted}}>Noch gebunden</div><div style={{fontSize: 46, fontWeight: 950, color: COLORS.gold}}><AnimatedNumber value={committed * progress} suffix=" €" /></div></div>
        </Card>
      </div>
    </Scene>
  );
};
