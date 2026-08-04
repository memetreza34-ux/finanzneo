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
  violet: '#B78CFF',
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
    <div style={{fontSize: 74, lineHeight: 0.98, fontWeight: 950, marginTop: 20, maxWidth: 930}}>
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

export const calculateNetSalary = (
  grossSalary: number,
  incomeTax: number,
  socialContributions: number,
  otherDeductions = 0,
): number => Math.max(0, grossSalary - incomeTax - socialContributions - otherDeductions);

export type GrossNetWaterfallAnimationProps = {
  grossSalary: number;
  incomeTax: number;
  socialContributions: number;
  otherDeductions?: number;
};

export const GrossNetWaterfallAnimation: React.FC<GrossNetWaterfallAnimationProps> = ({
  grossSalary,
  incomeTax,
  socialContributions,
  otherDeductions = 0,
}) => {
  const progress = useProgress();
  const netSalary = calculateNetSalary(grossSalary, incomeTax, socialContributions, otherDeductions);
  const deductions = [
    {label: 'Steuern', value: incomeTax, color: COLORS.red},
    {label: 'Sozialabgaben', value: socialContributions, color: COLORS.gold},
    {label: 'Weitere Abzüge', value: otherDeductions, color: COLORS.violet},
  ].filter((item) => item.value > 0);

  return (
    <LibraryScene
      category="Steuern & Gehalt"
      title="Brutto wird Netto"
      subtitle="Macht sichtbar, welche Abzüge vom Bruttogehalt bis zum Auszahlungsbetrag abfließen."
    >
      <GlassCard style={{height: 830, padding: 42, boxSizing: 'border-box'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
          <div>
            <div style={{fontSize: 25, color: COLORS.muted}}>Bruttogehalt</div>
            <div style={{fontSize: 72, fontWeight: 950}}>{formatEuro(grossSalary)}</div>
          </div>
          <div style={{textAlign: 'right'}}>
            <div style={{fontSize: 25, color: COLORS.muted}}>Netto</div>
            <div style={{fontSize: 72, fontWeight: 950, color: COLORS.green}}>
              <AnimatedNumber value={netSalary * progress} suffix=" €" />
            </div>
          </div>
        </div>

        <div style={{position: 'relative', height: 470, marginTop: 38}}>
          <div style={{position: 'absolute', left: 70, right: 70, top: 42, height: 54, borderRadius: 99, background: COLORS.blue}} />
          <div style={{position: 'absolute', left: 70, top: 12, fontSize: 25, fontWeight: 850}}>BRUTTO</div>
          {deductions.map((item, index) => {
            const local = clamp01(progress * 1.5 - index * 0.18);
            const share = grossSalary > 0 ? item.value / grossSalary : 0;
            return (
              <div
                key={item.label}
                style={{
                  position: 'absolute',
                  left: 130 + index * 245,
                  top: 100 + local * 165,
                  width: 210,
                  opacity: local,
                  transform: `translateY(${(1 - local) * -80}px)`,
                  textAlign: 'center',
                }}
              >
                <div style={{height: 165, width: 18, margin: '0 auto', background: item.color, borderRadius: 99}} />
                <div style={{marginTop: 12, padding: 18, borderRadius: 22, background: COLORS.panelSoft}}>
                  <div style={{fontSize: 22, color: COLORS.muted}}>{item.label}</div>
                  <div style={{fontSize: 31, fontWeight: 900, color: item.color}}>{formatEuro(item.value)}</div>
                  <div style={{fontSize: 21, color: COLORS.muted}}>{(share * 100).toFixed(1)} %</div>
                </div>
              </div>
            );
          })}
          <div
            style={{
              position: 'absolute',
              left: 70,
              right: 70,
              bottom: 8,
              height: 74,
              borderRadius: 99,
              background: 'rgba(92,255,154,0.12)',
              overflow: 'hidden',
              border: '1px solid rgba(92,255,154,0.28)',
            }}
          >
            <div style={{height: '100%', width: `${(netSalary / Math.max(1, grossSalary)) * progress * 100}%`, background: COLORS.green, borderRadius: 99}} />
            <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 27, fontWeight: 950, color: '#06110A'}}>AUSZAHLUNG</div>
          </div>
        </div>
      </GlassCard>
    </LibraryScene>
  );
};

export type TaxClassVariant = {label: string; netSalary: number};

export const findHighestNetVariant = (variants: readonly TaxClassVariant[]): TaxClassVariant | undefined =>
  [...variants].sort((left, right) => right.netSalary - left.netSalary)[0];

export type TaxClassComparisonAnimationProps = {
  grossSalary: number;
  variants: readonly TaxClassVariant[];
};

export const TaxClassComparisonAnimation: React.FC<TaxClassComparisonAnimationProps> = ({
  grossSalary,
  variants,
}) => {
  const progress = useProgress();
  const highest = Math.max(1, ...variants.map((item) => item.netSalary));
  const winner = findHighestNetVariant(variants);

  return (
    <LibraryScene
      category="Steuern & Gehalt"
      title="Steuerklassen vergleichen"
      subtitle="Stellt unterschiedliche Netto-Auszahlungen bei gleichem Bruttogehalt direkt nebeneinander."
    >
      <GlassCard style={{height: 830, padding: 38, boxSizing: 'border-box'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <div style={{fontSize: 25, color: COLORS.muted}}>Gleiches Brutto</div>
            <div style={{fontSize: 66, fontWeight: 950}}>{formatEuro(grossSalary)}</div>
          </div>
          <div style={{padding: '14px 22px', borderRadius: 99, background: 'rgba(92,255,154,0.12)', color: COLORS.green, fontSize: 24, fontWeight: 850}}>BEISPIELWERTE</div>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: `repeat(${Math.max(1, variants.length)}, 1fr)`, gap: 20, height: 590, marginTop: 36, alignItems: 'end'}}>
          {variants.map((item, index) => {
            const local = clamp01(progress * 1.35 - index * 0.12);
            const height = item.netSalary / highest * 430 * local;
            const isWinner = item.label === winner?.label;
            return (
              <div key={item.label} style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch'}}>
                <div style={{textAlign: 'center', marginBottom: 14, opacity: local}}>
                  <div style={{fontSize: 26, color: COLORS.muted}}>{item.label}</div>
                  <div style={{fontSize: 37, fontWeight: 950, color: isWinner ? COLORS.green : COLORS.text}}>{formatEuro(item.netSalary)}</div>
                </div>
                <div style={{height, minHeight: 4, borderRadius: '28px 28px 12px 12px', background: isWinner ? `linear-gradient(180deg, ${COLORS.green}, #1B8C4A)` : `linear-gradient(180deg, ${COLORS.blue}, #285C9E)`, boxShadow: isWinner ? '0 25px 70px rgba(92,255,154,0.24)' : 'none'}} />
                <div style={{marginTop: 12, padding: 14, borderRadius: 18, background: COLORS.panelSoft, textAlign: 'center', fontSize: 21, color: COLORS.muted}}>Abzüge: {formatEuro(Math.max(0, grossSalary - item.netSalary))}</div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </LibraryScene>
  );
};

export const calculateDcaShares = (totalCapital: number, prices: readonly number[]): number => {
  const usablePrices = prices.filter((price) => Number.isFinite(price) && price > 0);
  if (usablePrices.length === 0 || totalCapital <= 0) return 0;
  const installment = totalCapital / usablePrices.length;
  return usablePrices.reduce((sum, price) => sum + installment / price, 0);
};

export const calculateDcaEndValue = (totalCapital: number, prices: readonly number[]): number => {
  const finalPrice = prices.at(-1) ?? 0;
  return finalPrice > 0 ? calculateDcaShares(totalCapital, prices) * finalPrice : 0;
};

export const calculateLumpSumEndValue = (totalCapital: number, prices: readonly number[]): number => {
  const firstPrice = prices[0] ?? 0;
  const finalPrice = prices.at(-1) ?? 0;
  return firstPrice > 0 && finalPrice > 0 ? totalCapital / firstPrice * finalPrice : 0;
};

export type DcaVsLumpSumAnimationProps = {
  totalCapital: number;
  prices: readonly number[];
};

export const DcaVsLumpSumAnimation: React.FC<DcaVsLumpSumAnimationProps> = ({totalCapital, prices}) => {
  const progress = useProgress();
  const dcaValue = calculateDcaEndValue(totalCapital, prices);
  const lumpValue = calculateLumpSumEndValue(totalCapital, prices);
  const installment = prices.length > 0 ? totalCapital / prices.length : 0;
  const maxPrice = Math.max(1, ...prices);

  return (
    <LibraryScene
      category="Investieren"
      title="Sparplan gegen Einmalanlage"
      subtitle="Zeigt, wie Kaufzeitpunkt und schwankende Kurse die Anzahl gekaufter Anteile verändern."
    >
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26, height: 830}}>
        <GlassCard style={{padding: 32, overflow: 'hidden'}}>
          <div style={{fontSize: 26, color: COLORS.muted}}>Monatliche Käufe</div>
          <div style={{fontSize: 54, fontWeight: 950, marginTop: 8}}>DCA / Sparplan</div>
          <div style={{display: 'flex', alignItems: 'end', gap: 12, height: 430, marginTop: 34}}>
            {prices.map((price, index) => {
              const local = clamp01(progress * 1.35 - index * 0.1);
              const barHeight = price / maxPrice * 280;
              const shares = price > 0 ? installment / price : 0;
              return (
                <div key={`${price}-${index}`} style={{flex: 1, textAlign: 'center', opacity: local}}>
                  <div style={{fontSize: 18, color: COLORS.green, fontWeight: 850, marginBottom: 8}}>{shares.toFixed(1)}</div>
                  <div style={{height: barHeight * local, borderRadius: '14px 14px 6px 6px', background: index % 2 ? COLORS.gold : COLORS.green}} />
                  <div style={{fontSize: 18, color: COLORS.muted, marginTop: 8}}>{price} €</div>
                </div>
              );
            })}
          </div>
          <div style={{padding: 22, borderRadius: 22, background: COLORS.panelSoft, marginTop: 24}}>
            <div style={{fontSize: 23, color: COLORS.muted}}>Endwert</div>
            <div style={{fontSize: 45, fontWeight: 950, color: COLORS.green}}><AnimatedNumber value={dcaValue * progress} suffix=" €" /></div>
          </div>
        </GlassCard>
        <GlassCard style={{padding: 32, display: 'flex', flexDirection: 'column'}}>
          <div style={{fontSize: 26, color: COLORS.muted}}>Alles sofort investiert</div>
          <div style={{fontSize: 54, fontWeight: 950, marginTop: 8}}>Einmalanlage</div>
          <div style={{flex: 1, display: 'grid', placeItems: 'center'}}>
            <div style={{width: 310, height: 310, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #FFF4CF, #F8C96B 56%, #A06D15)', transform: `scale(${0.72 + progress * 0.28})`, display: 'grid', placeItems: 'center', color: '#06110A', textAlign: 'center', boxShadow: '0 35px 100px rgba(248,201,107,0.25)'}}>
              <div>
                <div style={{fontSize: 24, fontWeight: 850}}>START</div>
                <div style={{fontSize: 43, fontWeight: 950}}>{formatEuro(totalCapital)}</div>
              </div>
            </div>
          </div>
          <div style={{padding: 22, borderRadius: 22, background: COLORS.panelSoft}}>
            <div style={{fontSize: 23, color: COLORS.muted}}>Endwert</div>
            <div style={{fontSize: 45, fontWeight: 950, color: COLORS.gold}}><AnimatedNumber value={lumpValue * progress} suffix=" €" /></div>
          </div>
        </GlassCard>
      </div>
    </LibraryScene>
  );
};

export const calculateBubblePeakValue = (startValue: number, peakIncreasePercent: number): number =>
  Math.max(0, startValue * (1 + peakIncreasePercent / 100));

export const calculateBubbleCrashValue = (
  startValue: number,
  peakIncreasePercent: number,
  crashFromPeakPercent: number,
): number => calculateBubblePeakValue(startValue, peakIncreasePercent) * (1 - crashFromPeakPercent / 100);

export type MarketBubbleCycleAnimationProps = {
  startValue: number;
  peakIncreasePercent: number;
  crashFromPeakPercent: number;
};

export const MarketBubbleCycleAnimation: React.FC<MarketBubbleCycleAnimationProps> = ({
  startValue,
  peakIncreasePercent,
  crashFromPeakPercent,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = useProgress();
  const peak = calculateBubblePeakValue(startValue, peakIncreasePercent);
  const crash = calculateBubbleCrashValue(startValue, peakIncreasePercent, crashFromPeakPercent);
  const value = progress < 0.62
    ? interpolate(progress, [0, 0.62], [startValue, peak])
    : interpolate(progress, [0.62, 1], [peak, crash]);
  const bubbleScale = progress < 0.62
    ? interpolate(progress, [0, 0.62], [0.45, 1.45])
    : interpolate(progress, [0.62, 1], [1.45, 0.48]);
  const pulse = spring({frame, fps, config: {damping: 10, stiffness: 70, mass: 0.9}});

  return (
    <LibraryScene
      category="Börse & Märkte"
      title="Blase, Euphorie, Absturz"
      subtitle="Visualisiert die drei Phasen einer spekulativen Börsenblase ohne den Prozentbezug zu vermischen."
    >
      <GlassCard style={{height: 830, padding: 38, boxSizing: 'border-box', position: 'relative', overflow: 'hidden'}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div>
            <div style={{fontSize: 25, color: COLORS.muted}}>Marktwert</div>
            <div style={{fontSize: 72, fontWeight: 950, color: progress < 0.62 ? COLORS.green : COLORS.red}}><AnimatedNumber value={value} suffix=" €" /></div>
          </div>
          <div style={{textAlign: 'right', fontSize: 26, color: COLORS.muted}}>
            {progress < 0.28 ? 'Hoffnung' : progress < 0.62 ? 'Euphorie' : 'Panik'}
          </div>
        </div>
        <div style={{position: 'absolute', left: '50%', top: '54%', width: 470, height: 470, borderRadius: '50%', transform: `translate(-50%, -50%) scale(${bubbleScale})`, background: progress < 0.62 ? 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.8), rgba(183,140,255,0.72) 36%, rgba(120,183,255,0.14) 72%)' : 'radial-gradient(circle, rgba(255,107,107,0.18), rgba(255,107,107,0.02))', border: `4px solid ${progress < 0.62 ? 'rgba(183,140,255,0.8)' : 'rgba(255,107,107,0.45)'}`, opacity: progress < 0.96 ? 1 : 0.45, boxShadow: '0 40px 140px rgba(183,140,255,0.22)', display: 'grid', placeItems: 'center'}}>
          <div style={{fontSize: 44, fontWeight: 950, color: progress < 0.62 ? '#171020' : COLORS.red, transform: `scale(${0.8 + pulse * 0.2})`}}>{progress < 0.62 ? 'IMMER HÖHER' : 'PLATZT'}</div>
        </div>
        <div style={{position: 'absolute', left: 40, right: 40, bottom: 36, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16}}>
          {[
            ['Start', startValue, COLORS.blue],
            ['Hoch', peak, COLORS.violet],
            ['Nach Crash', crash, COLORS.red],
          ].map(([label, amount, color]) => (
            <div key={String(label)} style={{padding: 18, borderRadius: 20, background: COLORS.panelSoft}}>
              <div style={{fontSize: 21, color: COLORS.muted}}>{label}</div>
              <div style={{fontSize: 31, fontWeight: 900, color: String(color)}}>{formatEuro(Number(amount))}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </LibraryScene>
  );
};

export type InsurancePolicyCost = {label: string; monthlyPremium: number};

export const calculateAnnualInsuranceCost = (policies: readonly InsurancePolicyCost[]): number =>
  policies.reduce((sum, policy) => sum + Math.max(0, policy.monthlyPremium), 0) * 12;

export type InsuranceCostStackAnimationProps = {
  policies: readonly InsurancePolicyCost[];
  monthlyIncome: number;
};

export const InsuranceCostStackAnimation: React.FC<InsuranceCostStackAnimationProps> = ({
  policies,
  monthlyIncome,
}) => {
  const progress = useProgress();
  const monthlyTotal = calculateAnnualInsuranceCost(policies) / 12;
  const share = monthlyIncome > 0 ? monthlyTotal / monthlyIncome : 0;

  return (
    <LibraryScene
      category="Versicherungen"
      title="Versicherungskosten stapeln"
      subtitle="Fasst mehrere kleine Monatsbeiträge zu ihrer echten jährlichen Gesamtbelastung zusammen."
    >
      <div style={{display: 'grid', gridTemplateColumns: '1.08fr 0.92fr', gap: 26, height: 830}}>
        <GlassCard style={{padding: 34}}>
          <div style={{fontSize: 25, color: COLORS.muted}}>Monatliche Verträge</div>
          <div style={{display: 'grid', gap: 16, marginTop: 28}}>
            {policies.map((policy, index) => {
              const local = clamp01(progress * 1.5 - index * 0.12);
              return (
                <div key={policy.label} style={{display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'center', padding: 20, borderRadius: 22, background: COLORS.panelSoft, opacity: local, transform: `translateX(${(1 - local) * -80}px)`}}>
                  <div>
                    <div style={{fontSize: 27, fontWeight: 850}}>{policy.label}</div>
                    <div style={{height: 10, borderRadius: 99, background: 'rgba(255,255,255,0.07)', marginTop: 12, overflow: 'hidden'}}>
                      <div style={{height: '100%', width: `${Math.min(100, policy.monthlyPremium / Math.max(1, monthlyTotal) * 100) * local}%`, background: index % 2 ? COLORS.blue : COLORS.green}} />
                    </div>
                  </div>
                  <div style={{fontSize: 30, fontWeight: 950, color: COLORS.gold}}>{formatEuro(policy.monthlyPremium)}</div>
                </div>
              );
            })}
          </div>
        </GlassCard>
        <GlassCard style={{padding: 34, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          <div>
            <div style={{fontSize: 25, color: COLORS.muted}}>Gesamt pro Monat</div>
            <div style={{fontSize: 61, fontWeight: 950, color: COLORS.gold}}><AnimatedNumber value={monthlyTotal * progress} suffix=" €" /></div>
          </div>
          <div style={{position: 'relative', height: 350, display: 'grid', placeItems: 'center'}}>
            <div style={{width: 310, height: 210, borderRadius: '160px 160px 28px 28px', background: 'linear-gradient(180deg, #78B7FF, #315D99)', transform: `scale(${0.72 + progress * 0.28})`, display: 'grid', placeItems: 'center', color: '#06110A', fontSize: 40, fontWeight: 950, boxShadow: '0 30px 100px rgba(120,183,255,0.24)'}}>SCHUTZ</div>
            <div style={{position: 'absolute', width: 16, height: 150, bottom: 10, background: COLORS.blue, borderRadius: 99}} />
          </div>
          <div style={{padding: 22, borderRadius: 22, background: COLORS.panelSoft}}>
            <div style={{fontSize: 22, color: COLORS.muted}}>Jährlich</div>
            <div style={{fontSize: 43, fontWeight: 950, color: COLORS.red}}><AnimatedNumber value={calculateAnnualInsuranceCost(policies) * progress} suffix=" €" /></div>
            <div style={{fontSize: 23, color: COLORS.muted, marginTop: 6}}>{(share * 100).toFixed(1)} % des Monatsnettos</div>
          </div>
        </GlassCard>
      </div>
    </LibraryScene>
  );
};

export type WealthDistributionGroup = {
  label: string;
  populationPercent: number;
  wealthPercent: number;
};

export const normalizeWealthDistribution = (
  groups: readonly WealthDistributionGroup[],
): WealthDistributionGroup[] => {
  const sanitized = groups.map((group) => ({
    label: group.label,
    populationPercent: Math.max(0, Number.isFinite(group.populationPercent) ? group.populationPercent : 0),
    wealthPercent: Math.max(0, Number.isFinite(group.wealthPercent) ? group.wealthPercent : 0),
  }));
  const populationTotal = sanitized.reduce((sum, group) => sum + group.populationPercent, 0);
  const wealthTotal = sanitized.reduce((sum, group) => sum + group.wealthPercent, 0);
  return sanitized.map((group) => ({
    label: group.label,
    populationPercent: populationTotal > 0 ? group.populationPercent / populationTotal * 100 : 0,
    wealthPercent: wealthTotal > 0 ? group.wealthPercent / wealthTotal * 100 : 0,
  }));
};

export const calculateLargestWealthShare = (groups: readonly WealthDistributionGroup[]): number =>
  Math.max(0, ...normalizeWealthDistribution(groups).map((group) => group.wealthPercent));

export type WealthDistributionAnimationProps = {
  groups: readonly WealthDistributionGroup[];
};

export const WealthDistributionAnimation: React.FC<WealthDistributionAnimationProps> = ({groups}) => {
  const progress = useProgress();
  const normalized = normalizeWealthDistribution(groups);

  return (
    <LibraryScene
      category="Vermögen"
      title="Wer besitzt wie viel?"
      subtitle="Vergleicht Bevölkerungsanteile mit dem jeweils gehaltenen Anteil am Gesamtvermögen."
    >
      <GlassCard style={{height: 830, padding: 38, boxSizing: 'border-box'}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 30}}>
          <div style={{fontSize: 25, color: COLORS.muted}}>Bevölkerung</div>
          <div style={{fontSize: 25, color: COLORS.muted}}>Vermögensanteil</div>
        </div>
        <div style={{display: 'grid', gap: 20}}>
          {normalized.map((group, index) => {
            const local = clamp01(progress * 1.45 - index * 0.13);
            return (
              <div key={group.label} style={{display: 'grid', gridTemplateColumns: '150px 1fr 1fr', gap: 18, alignItems: 'center', opacity: local}}>
                <div style={{fontSize: 26, fontWeight: 850}}>{group.label}</div>
                <div style={{height: 62, borderRadius: 18, background: 'rgba(255,255,255,0.07)', overflow: 'hidden', position: 'relative'}}>
                  <div style={{height: '100%', width: `${group.populationPercent * local}%`, background: COLORS.blue, borderRadius: 18}} />
                  <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 23, fontWeight: 900}}>{group.populationPercent.toFixed(1)} %</div>
                </div>
                <div style={{height: 62, borderRadius: 18, background: 'rgba(255,255,255,0.07)', overflow: 'hidden', position: 'relative'}}>
                  <div style={{height: '100%', width: `${group.wealthPercent * local}%`, background: index === normalized.length - 1 ? COLORS.gold : COLORS.green, borderRadius: 18}} />
                  <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 23, fontWeight: 900, color: group.wealthPercent > 55 ? '#06110A' : COLORS.text}}>{group.wealthPercent.toFixed(1)} %</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{marginTop: 38, padding: 28, borderRadius: 26, background: COLORS.panelSoft, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <div style={{fontSize: 23, color: COLORS.muted}}>Größter Vermögensanteil</div>
            <div style={{fontSize: 50, fontWeight: 950, color: COLORS.gold}}><AnimatedNumber value={calculateLargestWealthShare(groups) * progress} suffix=" %" decimals={1} /></div>
          </div>
          <div style={{display: 'flex', gap: 8, alignItems: 'end'}}>
            {Array.from({length: 10}, (_, index) => <div key={index} style={{width: 35, height: 45 + index * 15 * progress, borderRadius: 8, background: index > 7 ? COLORS.gold : 'rgba(92,255,154,0.32)'}} />)}
          </div>
        </div>
      </GlassCard>
    </LibraryScene>
  );
};
