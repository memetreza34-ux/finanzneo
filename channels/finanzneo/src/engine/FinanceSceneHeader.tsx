import React from 'react';
import {
  AlertTriangle,
  BadgeEuro,
  Banknote,
  BarChart3,
  Calculator,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Coins,
  FileText,
  House,
  Landmark,
  Lightbulb,
  Percent,
  PiggyBank,
  Scale,
  ShieldCheck,
  ShoppingCart,
  Target,
  TrendingDown,
  TrendingUp,
  WalletCards,
  type LucideIcon,
} from 'lucide-react';
import {interpolate, useCurrentFrame} from 'remotion';
import type {FinanceSceneIcon} from './contracts';
// @ts-ignore — zentrale FinanzNeo-Produktionskonfiguration.
import financeConfig from '../../engine/config/finance-v1.json';

const ICONS: Record<FinanceSceneIcon, LucideIcon> = {
  wallet: WalletCards,
  bank: Landmark,
  cart: ShoppingCart,
  'trend-down': TrendingDown,
  'trend-up': TrendingUp,
  percent: Percent,
  calculator: Calculator,
  shield: ShieldCheck,
  warning: AlertTriangle,
  'piggy-bank': PiggyBank,
  scale: Scale,
  clock: Clock3,
  euro: BadgeEuro,
  document: FileText,
  idea: Lightbulb,
  chart: BarChart3,
  target: Target,
  coins: Coins,
  home: House,
  check: CheckCircle2,
  banknote: Banknote,
  money: CircleDollarSign,
};

export const FinanceSceneHeader: React.FC<{
  icon?: FinanceSceneIcon;
  label?: string;
  headline?: string;
  center?: boolean;
  compact?: boolean;
}> = ({icon = 'wallet', label = 'FINANZNEO', headline, center = false, compact = false}) => {
  const frame = useCurrentFrame();
  const motion = financeConfig.visuals.minimalMotion;
  const Icon = ICONS[icon];
  const badge = compact ? 48 : 54;
  const opacity = motion.headerAnimated
    ? interpolate(frame, [0, motion.headerFadeFrames], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : 1;
  const translateY = motion.headerAnimated
    ? interpolate(frame, [0, motion.headerFadeFrames], [motion.headerTranslatePixels, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : 0;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: center ? 'center' : 'flex-start',
        gap: compact ? 14 : 16,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          width: badge,
          height: badge,
          borderRadius: compact ? 15 : 17,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent)',
          background: 'rgba(6, 24, 13, 0.92)',
          border: '1.5px solid color-mix(in srgb, var(--accent) 42%, transparent)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.32)',
          flexShrink: 0,
        }}
      >
        <Icon size={compact ? 27 : 30} strokeWidth={2.35} />
      </div>
      <div style={{minWidth: 0, textAlign: center ? 'center' : 'left'}}>
        <div
          style={{
            color: 'var(--accent)',
            fontSize: compact ? 24 : 28,
            fontWeight: 850,
            letterSpacing: compact ? 2.6 : 3.2,
            lineHeight: 1,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </div>
        {headline && (
          <div
            style={{
              marginTop: 14,
              maxWidth: 850,
              color: '#F5F7F4',
              fontSize: compact ? 54 : 62,
              fontWeight: 900,
              lineHeight: 0.98,
              textWrap: 'balance',
              textShadow: '0 8px 28px rgba(0,0,0,0.78)',
            }}
          >
            {headline}
          </div>
        )}
      </div>
    </div>
  );
};
