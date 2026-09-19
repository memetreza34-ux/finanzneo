// FinanzNeo YouTube Motion Kit — gemeinsamer Baukasten für Longform-Animationen.
//
// Bis hierher hatte jedes YouTube-Projekt eine eigene kleine motion-kit.tsx, die
// genau drei Dinge konnte: Bühne, Panel, Farben. Phase 1 hatte damit nichts als
// beschriftete Kästen zur Hand — und genau die sind laut CLAUDE.md §11 als
// Hauptsprache verboten. Dieser Baukasten reicht die bestehende Bibliothek durch.

import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../brand/fonts';

export {
  YouTubeAnimationFrame,
  YouTubeInfoText,
  YouTubeHeader,
  YouTubeImage,
  YouTubePhysicalStage,
  YouTubeStage,
} from './components';
export {YOUTUBE_FORMAT, YOUTUBE_STYLE, youtubeLayoutIssues} from './layout';

/**
 * Echtes 3D. Licht und Material sind dort einmal entschieden, damit eine Szene
 * nur noch Körper setzen muss. Der Render braucht dafür `--gl=angle`, was die
 * Renderkette gesetzt hat.
 */
export {Coin3D, CoinStack3D, Material, Slab3D, Tank3D, ThreeStage, THREE_MATERIALS} from './three-kit';
export type {ThreeMaterial} from './three-kit';

export {Icon} from '../brand/components/Icon';
export type {IconName} from '../brand/components/Icon';
export {LottieBox} from '../brand/components/Lottie';
export {
  PremiumDepthGuide,
  PhysicalAccount,
  PhysicalBill,
  PhysicalCalendarPage,
  PhysicalCoinStack,
  PhysicalObject,
  PhysicalPhone,
  PhysicalPolicy,
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

/**
 * Die Kanalschrift, nicht Arial.
 *
 * `MotionStage` hat hier bis jetzt Arial erzwungen und damit die lokal geladene
 * Inter in 17 Szenen ueberschrieben, waehrend Header und Untertitel darueber in
 * Inter standen. Die Fallbacks bleiben stehen, falls das Laden scheitert.
 */
export const FONT_STACK = `${FONT.body}, Helvetica, Arial, sans-serif`;

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

/**
 * Bühne für eine Animationsszene.
 *
 * Der Hintergrund bleibt transparent. `COLORS.black` ist #050505 und lag damit
 * als messbar helleres Rechteck über dem #000000-Grund der Komposition — im
 * Render sichtbar als Kante an Ober- und Unterkante der Visualzone (gemessen
 * RGB 5,5,5 gegen 0,0,0). CLAUDE.md §10 lässt genau einen produktiven
 * Hintergrund zu, und der liegt bereits darunter.
 *
 * `transparent` ist ohne Wirkung und bleibt nur stehen, weil drei versiegelte
 * Szenen des Notgroschen-Videos es setzen. Ein Entfernen wuerde deren Hash
 * aendern, ohne am Bild etwas zu verbessern. Neue Szenen lassen es weg.
 */
export const MotionStage: React.FC<{children: React.ReactNode; transparent?: boolean}> = ({children}) => (
  <AbsoluteFill style={{backgroundColor: 'transparent', color: COLORS.white, fontFamily: FONT_STACK, overflow: 'hidden'}}>
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

// ── Bewegung und Zeichnen ───────────────────────────────────────────────────
// Liegt im Design-System, damit Reels und YouTube dieselben Bauteile benutzen.
export {
  CameraPush,
  clamp01,
  dropIn,
  ease,
  fitLabel,
  frameAt,
  linear,
  progressBetween,
  settle,
} from '../design-system/motion';
export type {DropMotion} from '../design-system/motion';

export {
  Arrow,
  Circle,
  ContactShadow,
  DrawnLine,
  Ellipse,
  ObjectBikeWheel,
  ObjectCrate,
  ObjectGlasses,
  ObjectSuitcase,
  ObjectTable,
  OBJECT_TONES,
  Pie,
  Polygon,
  Rect,
  Star,
  Triangle,
} from '../design-system/object-kit';
export type {ObjectProps} from '../design-system/object-kit';

/**
 * Bewegungsunschärfe kommt aus dem Brand-Kit.
 *
 * `CameraBlur` dort ist bereits `CameraMotionBlur` mit denselben Vorgaben. Eine
 * zweite Fassung hier waere dieselbe Komponente unter anderem Namen.
 */
export {CameraBlur} from '../brand/components/Effects';

/** YouTube-Typografie: Kleinzeile und grosse Zahl. Kein Bewegungsbauteil. */
export const FinanceEyebrow: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{fontSize: 30, fontWeight: 700, letterSpacing: 1.2, color: COLORS.gray, textTransform: 'uppercase', ...style}}>{children}</div>
);

export const FinanceValue: React.FC<{children: React.ReactNode; color?: string; style?: React.CSSProperties}> = ({children, color = COLORS.white, style}) => (
  <div style={{fontSize: 88, lineHeight: 0.96, fontWeight: 900, letterSpacing: -3, color, fontVariantNumeric: 'tabular-nums', ...style}}>{children}</div>
);
