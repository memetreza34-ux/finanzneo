// FinanzNeo YouTube Motion Kit — gemeinsamer Baukasten für Longform-Animationen.
//
// Bis hierher hatte jedes YouTube-Projekt eine eigene kleine motion-kit.tsx, die
// genau drei Dinge konnte: Bühne, Panel, Farben. Phase 1 hatte damit nichts als
// beschriftete Kästen zur Hand — und genau die sind laut CLAUDE.md §11 als
// Hauptsprache verboten. Dieser Baukasten reicht die bestehende Bibliothek durch.

import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';

export {Icon} from '../brand/components/Icon';
export type {IconName} from '../brand/components/Icon';
export {LottieBox} from '../brand/components/Lottie';
export {
  PremiumPhysicalStage,
  PremiumDepthGuide,
  PhysicalAccount,
  PhysicalBill,
  PhysicalCalendarPage,
  PhysicalCoinStack,
  PhysicalObject,
  PhysicalRail,
  PhysicalReserveTank,
  PhysicalTag,
  PhysicalWasher,
} from '../brand/components/PremiumPhysical';

/**
 * YouTube hat bewusst eine eigene Palette. Die Reel-Tokens in `src/brand/tokens.ts`
 * sind grünstichig dunkel (`bg:#0A1A0F`); die YouTube-Bildwelt
 * `finanzneo-youtube-cg-animated-black-v2` verlangt reines Schwarz, damit
 * Flow-Bilder und Remotion-Flächen nahtlos ineinander übergehen.
 */
export const COLORS = {
  black: '#050505',
  white: '#F7F7F2',
  gray: '#A7ADB4',
  green: '#2DD881',
  red: '#FF6B4A',
  gold: '#D8B15A',
  panel: '#111315',
  line: '#2A2F34',
} as const;

export const FONT_STACK = 'Arial, Helvetica, sans-serif';

/** Vorhandene Icons. Phase 1 wählt nur aus dieser Liste und erfindet keine Namen. */
export const YOUTUBE_ICONS = [
  'arrowRight', 'bank', 'bulb', 'calendar', 'chart-bar', 'chart-up', 'check', 'clock',
  'coins', 'cross', 'document', 'euro', 'flame', 'hourglass', 'list', 'lock', 'percent',
  'phone', 'receipt', 'repeat', 'rocket', 'search', 'shield', 'target', 'trending',
  'wallet', 'warning',
] as const;

/** Vorhandene Lottie-Dateien unter public/lottie/. Nur diese sind lokal gerendert verfügbar. */
export const YOUTUBE_LOTTIE = [
  'geldboerse', 'konfetti', 'lupe', 'muenze', 'muenzen', 'sicherheit', 'sparschwein',
  'trend', 'trendauf', 'wachstum', 'warenkorb', 'warnung', 'zeit', 'ziel',
] as const;

export const lottieFile = (name: (typeof YOUTUBE_LOTTIE)[number]) => `lottie/${name}.json`;

export const MotionStage: React.FC<{children: React.ReactNode; transparent?: boolean}> = ({children, transparent = false}) => (
  <AbsoluteFill style={{backgroundColor: transparent ? 'transparent' : COLORS.black, color: COLORS.white, fontFamily: FONT_STACK, overflow: 'hidden'}}>
    {children}
  </AbsoluteFill>
);

/**
 * Bewusst zurückhaltend einsetzen: ein Panel ist ein Rahmen, keine Erklärung.
 * Eine Szene, die nur aus Panels und Text besteht, ist keine Animation.
 */
export const Panel: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{backgroundColor: COLORS.panel, border: `2px solid ${COLORS.line}`, borderRadius: 28, boxSizing: 'border-box', ...style}}>{children}</div>
);

export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

/**
 * Motion-V3-Timing: Beats werden als Anteil der finalen Szenendauer ausgedrückt,
 * damit Phase 3 auf das echte Voiceover retimen kann, ohne einen eingefrorenen
 * Schwanz zu erzeugen.
 */
export const frameAt = (durationInFrames: number, ratio: number) => (
  Math.max(0, Math.round((Math.max(2, durationInFrames) - 1) * clamp01(ratio)))
);

export const progressBetween = (
  frame: number,
  durationInFrames: number,
  startRatio: number,
  endRatio: number,
) => {
  const start = frameAt(durationInFrames, startRatio);
  const end = Math.max(start + 1, frameAt(durationInFrames, endRatio));
  return interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

export const FinanceEyebrow: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{fontSize: 30, fontWeight: 700, letterSpacing: 1.2, color: COLORS.gray, textTransform: 'uppercase', ...style}}>{children}</div>
);

export const FinanceValue: React.FC<{children: React.ReactNode; color?: string; style?: React.CSSProperties}> = ({children, color = COLORS.white, style}) => (
  <div style={{fontSize: 88, lineHeight: 0.96, fontWeight: 900, letterSpacing: -3, color, fontVariantNumeric: 'tabular-nums', ...style}}>{children}</div>
);
