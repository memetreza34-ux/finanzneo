// ════════════════════════════════════════════════════════════════════════════
//  FINANZNEO CORE · BRAND-KIT (getrimmt) — nur tatsächlich genutzte Bausteine.
//  import { C, ThemeProvider, ... } from '@studio/core';
// ════════════════════════════════════════════════════════════════════════════
import './fonts';                       // Fonts beim Import laden

export * from './tokens';
export { ThemeProvider, useTheme, defaultTheme } from './theme';
export type { Theme } from './theme';
export { FONT } from './fonts';
export { Lucide, resolveLucide, IconStrike } from './components/Lucide';
export { Voiceover, SoundBed, Sfx, AudioVisualizer } from './components/Sound';
export { Captions, CaptionsBoxed } from './components/Captions';
export type { Caption } from './components/Captions';
export { PremiumIcon, PremiumIconLabel } from './components/PremiumIcon';
export type { PremiumIconSize } from './components/PremiumIcon';
export { PremiumGrade } from './components/PremiumGrade';
export type { GradeIntensity } from './components/PremiumGrade';
export { LightLeak } from '@remotion/light-leaks';
