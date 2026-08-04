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

export const calculateBondPriceChangePercent = (
  modifiedDuration: number,
  oldYieldPercent: number,
  newYieldPercent: number,
): number => {
  const deltaYield = (newYieldPercent - oldYieldPercent) / 100;
  return -Math.max(0, modifiedDuration) * deltaYield * 100;
};

export const calculateBondValueAfterRateChange = (
  bondValue: number,
  modifiedDuration: number,
  oldYieldPercent: number,
  newYieldPercent: number,
): number => Math.max(
  0,
  Math.max(0, bondValue) * (1 + calculateBondPriceChangePercent(modifiedDuration, oldYieldPercent, newYieldPercent) / 100),
);

export const BondRatePriceSeesawAnimation: React.FC<{
  bondValue: number;
  modifiedDuration: number;
  oldYieldPercent: number;
  newYieldPercent: number;
}> = ({bondValue, modifiedDuration, oldYieldPercent, newYieldPercent}) => {
  const progress = useProgress();
  const priceChange = calculateBondPriceChangePercent(modifiedDuration, oldYieldPercent, newYieldPercent);
  const endValue = calculateBondValueAfterRateChange(bondValue, modifiedDuration, oldYieldPercent, newYieldPercent);
  const rate = interpolate(progress, [0, 1], [oldYieldPercent, newYieldPercent]);
  const value = interpolate(progress, [0, 1], [bondValue, endValue]);
  const tilt = interpolate(progress, [0, 1], [0, newYieldPercent >= oldYieldPercent ? -12 : 12]);

  return (
    <LibraryScene
      category="Anleihen & Zinsen"
      title="Zinswende bei Anleihen"
      subtitle="Steigende Marktzinsen drücken bestehende Anleihekurse – fallende Zinsen wirken umgekehrt."
    >
      <GlassCard style={{height: 835, padding: 42, boxSizing: 'border-box'}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28}}>
          <div>
            <div style={{fontSize: 25, color: COLORS.muted}}>Marktzins</div>
            <div style={{fontSize: 70, fontWeight: 950, color: COLORS.gold}}>
              <AnimatedNumber value={rate} decimals={1} suffix=" %" />
            </div>
          </div>
          <div style={{textAlign: 'right'}}>
            <div style={{fontSize: 25, color: COLORS.muted}}>Anleihewert</div>
            <div style={{fontSize: 66, fontWeight: 950, color: priceChange < 0 ? COLORS.red : COLORS.green}}>
              <AnimatedNumber value={value} suffix=" €" />
            </div>
          </div>
        </div>

        <div style={{position: 'relative', height: 390, marginTop: 70}}>
          <div style={{position: 'absolute', left: '50%', top: 155, width: 62, height: 240, transform: 'translateX(-50%)', background: COLORS.panelSoft, borderRadius: 24}} />
          <div
            style={{
              position: 'absolute',
              left: 70,
              right: 70,
              top: 150,
              height: 28,
              borderRadius: 99,
              background: COLORS.blue,
              transform: `rotate(${tilt}deg)`,
              transformOrigin: 'center',
              boxShadow: '0 20px 60px rgba(120,183,255,0.22)',
            }}
          />
          <div style={{position: 'absolute', left: 105, top: 42, width: 250, padding: 28, borderRadius: 28, background: 'rgba(248,201,107,0.12)', textAlign: 'center'}}>
            <div style={{fontSize: 26, color: COLORS.muted}}>ZINS</div>
            <div style={{fontSize: 52, fontWeight: 950, color: COLORS.gold}}>{rate.toFixed(1)} %</div>
          </div>
          <div style={{position: 'absolute', right: 105, top: 42, width: 250, padding: 28, borderRadius: 28, background: 'rgba(255,107,107,0.11)', textAlign: 'center'}}>
            <div style={{fontSize: 26, color: COLORS.muted}}>KURS</div>
            <div style={{fontSize: 46, fontWeight: 950, color: priceChange < 0 ? COLORS.red : COLORS.green}}>{priceChange.toFixed(1)} %</div>
          </div>
        </div>

        <div style={{padding: 24, borderRadius: 24, background: COLORS.panelSoft, display: 'flex', justifyContent: 'space-between', fontSize: 25}}>
          <span>Modified Duration: {modifiedDuration.toLocaleString('de-DE')}</span>
          <span style={{color: COLORS.muted}}>Näherungsrechnung</span>
        </div>
      </GlassCard>
    </LibraryScene>
  );
};

export const calculateCapitalGainsTax = (
  saleValue: number,
  costBasis: number,
  allowance: number,
  taxPercent: number,
): number => {
  const gain = Math.max(0, saleValue - costBasis);
  const taxableGain = Math.max(0, gain - Math.max(0, allowance));
  return taxableGain * Math.max(0, taxPercent) / 100;
};

export const calculateNetInvestmentProceeds = (
  saleValue: number,
  costBasis: number,
  allowance: number,
  taxPercent: number,
): number => Math.max(0, saleValue - calculateCapitalGainsTax(saleValue, costBasis, allowance, taxPercent));

export const CapitalGainsTaxWaterfallAnimation: React.FC<{
  saleValue: number;
  costBasis: number;
  allowance: number;
  taxPercent: number;
}> = ({saleValue, costBasis, allowance, taxPercent}) => {
  const progress = useProgress();
  const gain = Math.max(0, saleValue - costBasis);
  const tax = calculateCapitalGainsTax(saleValue, costBasis, allowance, taxPercent);
  const net = calculateNetInvestmentProceeds(saleValue, costBasis, allowance, taxPercent);
  const rows = [
    {label: 'Verkaufserlös', value: saleValue, color: COLORS.green},
    {label: 'Eingesetztes Kapital', value: costBasis, color: COLORS.blue},
    {label: 'Gewinn', value: gain, color: COLORS.gold},
    {label: 'Steuer', value: tax, color: COLORS.red},
  ];

  return (
    <LibraryScene
      category="Steuern & Gehalt"
      title="Kapitalertragsteuer-Abzug"
      subtitle="Vom Verkaufserlös bis zum Netto-Betrag: Gewinn, Freibetrag und Steuer werden getrennt sichtbar."
    >
      <GlassCard style={{height: 835, padding: 40, boxSizing: 'border-box'}}>
        <div style={{fontSize: 25, color: COLORS.muted}}>Netto-Auszahlung</div>
        <div style={{fontSize: 72, fontWeight: 950, color: COLORS.green}}>
          <AnimatedNumber value={net * progress} suffix=" €" />
        </div>
        <div style={{display: 'grid', gap: 18, marginTop: 44}}>
          {rows.map((row, index) => {
            const local = clamp01(progress * 1.35 - index * 0.1);
            return (
              <div key={row.label} style={{padding: 22, borderRadius: 24, background: COLORS.panelSoft}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 27, fontWeight: 850}}>
                  <span>{row.label}</span>
                  <span style={{color: row.color}}><AnimatedNumber value={row.value * local} suffix=" €" /></span>
                </div>
                <div style={{height: 24, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden', marginTop: 14}}>
                  <div style={{height: '100%', width: `${clamp01(row.value / Math.max(1, saleValue)) * local * 100}%`, background: row.color, borderRadius: 99}} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{marginTop: 24, fontSize: 24, color: COLORS.muted}}>
          Beispielwerte · Freibetrag {formatEuro(allowance)} · Steuersatz {taxPercent.toLocaleString('de-DE')} %
        </div>
      </GlassCard>
    </LibraryScene>
  );
};

export const calculateBusinessProfit = (revenue: number, expenses: number): number =>
  Math.max(0, revenue) - Math.max(0, expenses);

export const calculateOperatingCashflow = (
  revenue: number,
  expenses: number,
  depreciation: number,
  receivablesIncrease: number,
): number => calculateBusinessProfit(revenue, expenses) + Math.max(0, depreciation) - Math.max(0, receivablesIncrease);

export const BusinessProfitCashflowAnimation: React.FC<{
  revenue: number;
  expenses: number;
  depreciation: number;
  receivablesIncrease: number;
}> = ({revenue, expenses, depreciation, receivablesIncrease}) => {
  const progress = useProgress();
  const profit = calculateBusinessProfit(revenue, expenses);
  const cashflow = calculateOperatingCashflow(revenue, expenses, depreciation, receivablesIncrease);
  const items = [
    {label: 'Umsatz', value: revenue, color: COLORS.green},
    {label: 'Kosten', value: expenses, color: COLORS.red},
    {label: 'Gewinn', value: profit, color: COLORS.gold},
    {label: 'Operativer Cashflow', value: cashflow, color: COLORS.blue},
  ];

  return (
    <LibraryScene
      category="Business & Selbstständigkeit"
      title="Umsatz, Gewinn, Cashflow"
      subtitle="Zeigt, warum hoher Umsatz nicht automatisch hohen Gewinn oder verfügbares Geld bedeutet."
    >
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, height: 830}}>
        {items.map((item, index) => {
          const local = clamp01(progress * 1.3 - index * 0.08);
          return (
            <GlassCard key={item.label} style={{padding: 34, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
              <div>
                <div style={{fontSize: 27, color: COLORS.muted}}>{item.label}</div>
                <div style={{fontSize: 58, fontWeight: 950, color: item.color, marginTop: 12}}>
                  <AnimatedNumber value={item.value * local} suffix=" €" />
                </div>
              </div>
              <div style={{height: 420, display: 'flex', alignItems: 'end'}}>
                <div style={{width: '100%', height: `${Math.max(6, clamp01(item.value / Math.max(1, revenue)) * local * 100)}%`, borderRadius: '28px 28px 10px 10px', background: item.color, opacity: 0.88}} />
              </div>
            </GlassCard>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: -80, textAlign: 'center', fontSize: 23, color: COLORS.muted}}>
        Cashflow = Gewinn + Abschreibung − Forderungsaufbau
      </div>
    </LibraryScene>
  );
};

export const calculateGrossRentalYieldPercent = (
  monthlyColdRent: number,
  purchasePrice: number,
): number => purchasePrice > 0 ? Math.max(0, monthlyColdRent) * 12 / purchasePrice * 100 : 0;

export const calculateNetRentalYieldPercent = (
  monthlyColdRent: number,
  annualNonRecoverableCosts: number,
  purchasePrice: number,
  buyingCosts: number,
): number => {
  const invested = Math.max(0, purchasePrice) + Math.max(0, buyingCosts);
  const netAnnualRent = Math.max(0, monthlyColdRent) * 12 - Math.max(0, annualNonRecoverableCosts);
  return invested > 0 ? netAnnualRent / invested * 100 : 0;
};

export const RentalYieldBreakdownAnimation: React.FC<{
  monthlyColdRent: number;
  annualNonRecoverableCosts: number;
  purchasePrice: number;
  buyingCosts: number;
}> = ({monthlyColdRent, annualNonRecoverableCosts, purchasePrice, buyingCosts}) => {
  const progress = useProgress();
  const gross = calculateGrossRentalYieldPercent(monthlyColdRent, purchasePrice);
  const net = calculateNetRentalYieldPercent(monthlyColdRent, annualNonRecoverableCosts, purchasePrice, buyingCosts);
  const annualRent = monthlyColdRent * 12;

  return (
    <LibraryScene
      category="Immobilien & Kredite"
      title="Mietrendite aufschlüsseln"
      subtitle="Bruttorendite und Nettorendite werden mit Kaufnebenkosten und laufenden Kosten getrennt berechnet."
    >
      <GlassCard style={{height: 835, padding: 40, boxSizing: 'border-box'}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24}}>
          <div style={{padding: 28, borderRadius: 28, background: COLORS.panelSoft}}>
            <div style={{fontSize: 25, color: COLORS.muted}}>Bruttorendite</div>
            <div style={{fontSize: 68, fontWeight: 950, color: COLORS.gold}}><AnimatedNumber value={gross * progress} decimals={2} suffix=" %" /></div>
          </div>
          <div style={{padding: 28, borderRadius: 28, background: COLORS.panelSoft}}>
            <div style={{fontSize: 25, color: COLORS.muted}}>Nettorendite</div>
            <div style={{fontSize: 68, fontWeight: 950, color: COLORS.green}}><AnimatedNumber value={net * progress} decimals={2} suffix=" %" /></div>
          </div>
        </div>
        <div style={{display: 'grid', gap: 20, marginTop: 34}}>
          {[
            ['Jahreskaltmiete', annualRent, COLORS.green],
            ['Nicht umlagefähige Kosten', annualNonRecoverableCosts, COLORS.red],
            ['Kaufpreis', purchasePrice, COLORS.blue],
            ['Kaufnebenkosten', buyingCosts, COLORS.gold],
          ].map(([label, rawValue, color], index) => {
            const value = Number(rawValue);
            const local = clamp01(progress * 1.35 - index * 0.08);
            return (
              <div key={String(label)} style={{display: 'grid', gridTemplateColumns: '280px 1fr 190px', gap: 16, alignItems: 'center'}}>
                <div style={{fontSize: 25, color: COLORS.muted}}>{label}</div>
                <div style={{height: 32, background: COLORS.panelSoft, borderRadius: 99, overflow: 'hidden'}}>
                  <div style={{height: '100%', width: `${Math.max(2, clamp01(value / Math.max(1, purchasePrice)) * local * 100)}%`, background: String(color), borderRadius: 99}} />
                </div>
                <div style={{fontSize: 28, fontWeight: 900, textAlign: 'right'}}>{formatEuro(value)}</div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </LibraryScene>
  );
};

export type DiversificationPosition = {label: string; weightPercent: number; shockPercent: number};

export const calculateDiversifiedPortfolioShockPercent = (
  positions: readonly DiversificationPosition[],
): number => {
  const totalWeight = positions.reduce((sum, item) => sum + Math.max(0, item.weightPercent), 0);
  if (totalWeight <= 0) return 0;
  return positions.reduce(
    (sum, item) => sum + Math.max(0, item.weightPercent) / totalWeight * item.shockPercent,
    0,
  );
};

export const DiversificationShockAbsorberAnimation: React.FC<{
  portfolioValue: number;
  concentratedShockPercent: number;
  positions: readonly DiversificationPosition[];
}> = ({portfolioValue, concentratedShockPercent, positions}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = useProgress();
  const diversifiedShock = calculateDiversifiedPortfolioShockPercent(positions);
  const pulse = spring({frame, fps, config: {damping: 13, stiffness: 75}});
  const concentratedEnd = portfolioValue * (1 + concentratedShockPercent / 100);
  const diversifiedEnd = portfolioValue * (1 + diversifiedShock / 100);

  return (
    <LibraryScene
      category="Investieren"
      title="Diversifikations-Puffer"
      subtitle="Ein einzelner Einbruch trifft ein konzentriertes Depot stärker als ein breit verteiltes Portfolio."
    >
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, height: 830}}>
        <GlassCard style={{padding: 36, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          <div>
            <div style={{fontSize: 27, color: COLORS.muted}}>Konzentriert</div>
            <div style={{fontSize: 64, fontWeight: 950, color: COLORS.red}}><AnimatedNumber value={interpolate(progress, [0, 1], [portfolioValue, concentratedEnd])} suffix=" €" /></div>
          </div>
          <div style={{height: 430, display: 'grid', placeItems: 'center'}}>
            <div style={{width: 260, height: 260, borderRadius: '50%', background: COLORS.red, transform: `scale(${1 - progress * 0.48})`, display: 'grid', placeItems: 'center', fontSize: 54, fontWeight: 950, color: '#250606'}}>{concentratedShockPercent}%</div>
          </div>
          <div style={{fontSize: 24, color: COLORS.muted}}>Ein Risiko trägt fast das gesamte Depot.</div>
        </GlassCard>
        <GlassCard style={{padding: 36, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          <div>
            <div style={{fontSize: 27, color: COLORS.muted}}>Diversifiziert</div>
            <div style={{fontSize: 64, fontWeight: 950, color: COLORS.green}}><AnimatedNumber value={interpolate(progress, [0, 1], [portfolioValue, diversifiedEnd])} suffix=" €" /></div>
          </div>
          <div style={{height: 430, position: 'relative'}}>
            {positions.map((item, index) => {
              const angle = index / Math.max(1, positions.length) * Math.PI * 2;
              const radius = 120;
              return (
                <div key={item.label} style={{position: 'absolute', left: `calc(50% + ${Math.cos(angle) * radius}px)`, top: `calc(50% + ${Math.sin(angle) * radius}px)`, width: 130, height: 130, transform: `translate(-50%, -50%) scale(${0.75 + pulse * 0.25})`, borderRadius: '50%', background: index % 3 === 0 ? COLORS.green : index % 3 === 1 ? COLORS.gold : COLORS.blue, display: 'grid', placeItems: 'center', color: '#051009', textAlign: 'center', fontWeight: 950, fontSize: 19, padding: 10, boxSizing: 'border-box'}}>
                  {item.label}<br />{item.shockPercent}%
                </div>
              );
            })}
          </div>
          <div style={{fontSize: 24, color: COLORS.muted}}>Gesamtschock: {diversifiedShock.toFixed(1)} %</div>
        </GlassCard>
      </div>
    </LibraryScene>
  );
};

export const calculateSavingsRatePercent = (income: number, expenses: number): number =>
  income > 0 ? Math.max(0, income - Math.max(0, expenses)) / income * 100 : 0;

export const calculateLifestyleInflationLoss = (
  oldIncome: number,
  oldExpenses: number,
  newIncome: number,
  newExpenses: number,
): number => {
  const expectedSavings = Math.max(0, newIncome - oldExpenses);
  const actualSavings = Math.max(0, newIncome - newExpenses);
  return Math.max(0, expectedSavings - actualSavings);
};

export const LifestyleInflationAnimation: React.FC<{
  oldIncome: number;
  oldExpenses: number;
  newIncome: number;
  newExpenses: number;
}> = ({oldIncome, oldExpenses, newIncome, newExpenses}) => {
  const progress = useProgress();
  const oldSavings = Math.max(0, oldIncome - oldExpenses);
  const newSavings = Math.max(0, newIncome - newExpenses);
  const oldRate = calculateSavingsRatePercent(oldIncome, oldExpenses);
  const newRate = calculateSavingsRatePercent(newIncome, newExpenses);
  const lost = calculateLifestyleInflationLoss(oldIncome, oldExpenses, newIncome, newExpenses);

  return (
    <LibraryScene
      category="Einkommen & Kaufkraft"
      title="Lifestyle-Inflation"
      subtitle="Mehr Gehalt führt nicht automatisch zu mehr Vermögensaufbau, wenn die Ausgaben gleichzeitig mitwachsen."
    >
      <GlassCard style={{height: 835, padding: 40, boxSizing: 'border-box'}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28}}>
          {[
            {label: 'Vorher', income: oldIncome, expenses: oldExpenses, savings: oldSavings, rate: oldRate},
            {label: 'Nach Gehaltssprung', income: newIncome, expenses: newExpenses, savings: newSavings, rate: newRate},
          ].map((item, index) => {
            const local = clamp01(progress * 1.2 - index * 0.08);
            return (
              <div key={item.label} style={{padding: 30, borderRadius: 30, background: COLORS.panelSoft}}>
                <div style={{fontSize: 27, fontWeight: 900}}>{item.label}</div>
                <div style={{marginTop: 28, fontSize: 24, color: COLORS.muted}}>Einkommen</div>
                <div style={{fontSize: 52, fontWeight: 950, color: COLORS.green}}><AnimatedNumber value={item.income * local} suffix=" €" /></div>
                <div style={{marginTop: 20, fontSize: 24, color: COLORS.muted}}>Ausgaben</div>
                <div style={{fontSize: 48, fontWeight: 950, color: COLORS.red}}><AnimatedNumber value={item.expenses * local} suffix=" €" /></div>
                <div style={{marginTop: 20, height: 28, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden'}}>
                  <div style={{height: '100%', width: `${item.rate * local}%`, background: COLORS.gold, borderRadius: 99}} />
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 23}}>
                  <span style={{color: COLORS.muted}}>Sparquote</span><strong>{item.rate.toFixed(1)} %</strong>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{marginTop: 34, padding: 28, borderRadius: 28, background: 'rgba(255,107,107,0.09)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <div style={{fontSize: 25, color: COLORS.muted}}>Verlorener Sparpotenzial-Zuwachs</div>
            <div style={{fontSize: 58, fontWeight: 950, color: COLORS.red}}><AnimatedNumber value={lost * progress} suffix=" € / Monat" /></div>
          </div>
          <div style={{fontSize: 30, fontWeight: 900, color: COLORS.gold}}>Sparen: {formatEuro(newSavings)}</div>
        </div>
      </GlassCard>
    </LibraryScene>
  );
};
