import React from 'react';
import {
  Banknote,
  BarChart3,
  Calculator,
  CircleDollarSign,
  Clock3,
  Coins,
  FileText,
  Landmark,
  Lightbulb,
  PackageCheck,
  PiggyBank,
  Scale,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import {interpolate, useCurrentFrame} from 'remotion';

export const FINANZNEO_SCENE_HEADER_PROFILE = 'finanzneo-scene-header-v2' as const;

export type FinanzNeoSceneIcon =
  | 'bank'
  | 'banknote'
  | 'calculator'
  | 'chart'
  | 'clock'
  | 'coins'
  | 'document'
  | 'euro'
  | 'idea'
  | 'package'
  | 'piggy-bank'
  | 'scale'
  | 'shield'
  | 'shopping-cart'
  | 'smartphone'
  | 'target'
  | 'trend-down'
  | 'trend-up'
  | 'wallet'
  | 'workflow';

const ICONS: Record<FinanzNeoSceneIcon, LucideIcon> = {
  bank: Landmark,
  banknote: Banknote,
  calculator: Calculator,
  chart: BarChart3,
  clock: Clock3,
  coins: Coins,
  document: FileText,
  euro: CircleDollarSign,
  idea: Lightbulb,
  package: PackageCheck,
  'piggy-bank': PiggyBank,
  scale: Scale,
  shield: ShieldCheck,
  'shopping-cart': ShoppingCart,
  smartphone: Smartphone,
  target: Target,
  'trend-down': TrendingDown,
  'trend-up': TrendingUp,
  wallet: Wallet,
  workflow: Workflow,
};

export type FinanzNeoSceneHeaderProps = {
  kicker: string;
  headline: string;
  icon: FinanzNeoSceneIcon;
  body?: string;
  top?: number;
};

export const FinanzNeoSceneHeader: React.FC<FinanzNeoSceneHeaderProps> = ({
  kicker,
  headline,
  icon,
  body,
  top = 0,
}) => {
  const frame = useCurrentFrame();
  const Icon = ICONS[icon];
  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(frame, [0, 12], [18, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      data-finanzneo-header-profile={FINANZNEO_SCENE_HEADER_PROFILE}
      style={{
        position: 'absolute',
        top,
        left: 0,
        right: 0,
        height: 520,
        pointerEvents: 'none',
        background:
          'linear-gradient(180deg, rgba(3, 12, 8, 0.97) 0%, rgba(3, 12, 8, 0.86) 44%, rgba(3, 12, 8, 0.38) 76%, rgba(3, 12, 8, 0) 100%)',
        zIndex: 30,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 64,
          left: 64,
          right: 64,
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            marginBottom: 22,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 22,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(35, 219, 139, 0.16)',
              border: '2px solid rgba(94, 255, 183, 0.72)',
              boxShadow: '0 12px 34px rgba(0, 0, 0, 0.34)',
              flex: '0 0 auto',
            }}
          >
            <Icon size={42} strokeWidth={2.5} color="#72F2B4" aria-hidden="true" />
          </div>
          <div
            style={{
              color: '#72F2B4',
              fontSize: 27,
              lineHeight: 1,
              fontWeight: 800,
              letterSpacing: 2.6,
              textTransform: 'uppercase',
              textShadow: '0 3px 16px rgba(0, 0, 0, 0.72)',
            }}
          >
            {kicker}
          </div>
        </div>

        <div
          style={{
            color: '#F7FAF5',
            fontSize: 78,
            lineHeight: 0.98,
            fontWeight: 900,
            letterSpacing: -2.2,
            maxWidth: 930,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            overflow: 'hidden',
            textShadow: '0 5px 28px rgba(0, 0, 0, 0.92)',
          }}
        >
          {headline}
        </div>

        {body ? (
          <div
            style={{
              marginTop: 20,
              maxWidth: 860,
              color: '#D9E5DC',
              fontSize: 34,
              lineHeight: 1.15,
              fontWeight: 650,
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.88)',
            }}
          >
            {body}
          </div>
        ) : null}
      </div>
    </div>
  );
};
