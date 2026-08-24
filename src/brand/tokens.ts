// ════════════════════════════════════════════════════════════════════════════
//  FINANZNEO · BRAND TOKENS
//  Eine zentrale Quelle für Farben, Easing, Helpers — überall importiert.
// ════════════════════════════════════════════════════════════════════════════
import { Easing, interpolate } from 'remotion';

// ─── Marken-Farben — SEMANTISCH (Farbe = Bedeutung) ──────────────────────────
// Grün = Signatur. Weiß dominiert Text. Akzente nach Sinn (nie zufällig).
export const C = {
  // Hintergründe
  bg:       '#0A1A0F',   // dunkelgrün — Standard
  bgDeep:   '#06120A',   // tiefer (Vignette)
  bgNeutral:'#0B0F14',   // dunkel-neutral (wenn Grün nicht passt)
  bgLight:  '#F4F7F5',   // heller BG (für seltene Hell-Szenen)
  surface:  '#11261A',   // Premium-Fläche / radialer Mittelpunkt
  surfaceStrong: '#112A1B',
  surfacePositive: '#0E3B27',

  // Neutral / Text
  white:    '#FFFFFF',   // ⚪ neutral, clean, Aussagen — Haupt-Textfarbe
  whiteSoft:'#F4FAF6',
  gray:     '#9DB0A6',   // gedämpfter Text
  graySoft: '#8FA89A',
  grayDk:   '#5A6B61',
  ink:      '#0A1410',   // NUR dunkler Text auf hellem BG; NIE auf dunklen Reel-Flächen
  line:     'rgba(255,255,255,0.10)',

  // 🟢 Grün — Wachstum, positiv, Lösung (Signatur)
  accent:   '#00D26A',
  accentLt: '#5CFFAD',
  accentSoft:'#7BFFC0',
  accentDk: '#00803F',

  // 🔴 Rot — Verlust, Problem, Gefahr
  negative: '#FF3333',
  negativeLt:'#FF6B6B',
  negativeDk:'#B01030',

  // 🟡 Gold — Geld, Zahlen, Highlight
  gold:     '#FFC83D',
  goldLt:   '#FFE49A',

  // 🔵 Blau — Vertrauen, ruhig, Info
  blue:     '#3D8BFF',
  blueLt:   '#8FBEFF',

  // 🟣 Lila — premium, besonders
  purple:   '#B98CFF',
  purpleLt: '#D9C4FF',
} as const;

// Semantische Kurz-Wahl: nach Bedeutung statt Farbname denken.
export const MEANING = {
  positive: C.accent,   // Wachstum/Lösung
  problem:  C.negative, // Verlust/Gefahr
  money:    C.gold,     // Zahlen/Geld
  trust:    C.blue,     // sicher/Info
  premium:  C.purple,   // besonders
  neutral:  C.white,    // Aussage
} as const;

// Verbindliche Animationspalette für dunkle Reel-Szenen.
// Schwarz ist absichtlich NICHT enthalten: auf dem dunklen FinanzNeo-Hintergrund
// müssen alle Informationen mobil sofort lesbar bleiben.
export const ANIMATION_COLORS = {
  neutralText: C.white,
  secondaryText: C.whiteSoft,
  focus: C.accent,
  positive: C.accent,
  warning: C.negative,
  loss: C.negative,
  money: C.gold,
  blackOnDarkForbidden: true,
} as const;

// Disziplinierte Premium-Palette für ruhige Finanzgrafiken.
// Diese Alias-Struktur ersetzt die frühere zweite Palette in src/bausteine.
export const PREMIUM = {
  ink: C.whiteSoft,
  muted: C.graySoft,
  line: C.line,
  positive: C.accent,
  positiveLight: C.accentSoft,
  positiveDeep: C.surfacePositive,
  money: C.gold,
  loss: C.negativeLt,
} as const;

// ─── Format ───────────────────────────────────────────────────────────────────
export const FORMAT = {
  landscape: { width: 1920, height: 1080 },  // YouTube
  vertical:  { width: 1080, height: 1920 },  // Shorts/TikTok/Reels
  fps: 30,
} as const;

// ─── Safe Areas für vertikale Reels ─────────────────────────────────────────
export const SAFE_AREA = {
  topRatio: 0.18,
  bottomRatio: 0.22,
  topPx: Math.round(FORMAT.vertical.height * 0.18),
  bottomPx: Math.round(FORMAT.vertical.height * 0.22),
} as const;

// ─── Verbindlicher Reel-Look (V4) ────────────────────────────────────────────
// Einzige Quelle für Untertitel-, Header- und Übergangswerte. Komponenten
// lesen ausschließlich hier — keine lokalen Zahlen mehr.
//
// Hintergrund: Untertitel wurden früher mit fontWeight 900, 64 px und einem
// 1,6-px-WebkitTextStroke gerendert. WebKit zeichnet die Kontur mittig auf der
// Glyphenkante, wächst also zur Hälfte IN den Buchstaben. Zusammen mit Weight
// 900 liefen die Innenräume von a/e/o/g zu — der Text wirkte dick und matschig.
// Kontrast liefert allein die dunkle Backplate.
export const REEL_STYLE = {
  caption: {
    fontSize: 50,
    minFontSize: 40,
    fontWeight: 800,
    letterSpacing: 0,
    lineHeight: 1.14,
    bottom: 285,
    left: 72,
    right: 140,
    maxWidth: 780,
    maxLines: 2,
    maxWords: 9,
    maxChars: 52,
    holdSeconds: 0.38,
    textShadow: '0 2px 7px rgba(0,0,0,0.55)',
    /** WebkitTextStroke ist auf Untertiteln verboten — siehe Kommentar oben. */
    textStrokeForbidden: true,
  },
  header: {
    /** Mittig zentriert — nicht linksbündig. */
    align: 'center',
    /** Headline in FinanzNeo-Grün, nicht weiß. */
    headlineColor: C.accentLt,
    top: 118,
    /** Bei zentriertem Header symmetrisch — sonst sitzt er optisch links. */
    left: 72,
    right: 72,
    fontSize: 46,
    iconBox: 46,
    iconSize: 26,
    gap: 12,
    /** Der Header steht beim Szenenwechsel sofort, er zieht nicht nach. */
    enterFrames: 4,
    textShadow: '0 2px 6px rgba(0,0,0,0.5)',
  },
  transition: {
    /** Kurzer Continuity-Schnitt statt träger Blende. Kein Fade-to-black. */
    continuityFrames: 3,
    imageEnterFrames: 4,
    fadeToBlackForbidden: true,
  },
  visual: {
    top: 390,
    bottom: 1560,
    /**
     * Animationen werden auf die Visualzone skaliert, statt klein zu wirken.
     * Bewusst moderat: höhere Werte schieben breite Beschriftungen seitlich
     * aus dem Bild. Breite Inhalte zusätzlich in AnimationStage begrenzen.
     */
    animationScale: 1.12,
  },
} as const;

// ─── Easing (Spring Physics als Standard) ────────────────────────────────────
export const E = {
  out:    Easing.bezier(0.16, 1, 0.3, 1),     // smooth ease-out
  inOut:  Easing.bezier(0.65, 0, 0.35, 1),
  in:     Easing.bezier(0.5, 0, 0.75, 0),
  spring: Easing.bezier(0.34, 1.56, 0.64, 1), // natürlicher Overshoot
} as const;

export const CLAMP = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

// ─── Sekunde → Frame ──────────────────────────────────────────────────────────
export const sec = (s: number, fps = FORMAT.fps) => Math.round(s * fps);

// ─── Animations-Helfer ────────────────────────────────────────────────────────
// Fortschritt 0→1 zwischen zwei Frames
export const prog = (f: number, a: number, b: number, e = E.out) =>
  interpolate(f, [a, b], [0, 1], { ...CLAMP, easing: e });

// Wert va→vb zwischen zwei Frames
export const lerpF = (f: number, va: number, vb: number, a: number, b: number, e = E.out) =>
  interpolate(f, [a, b], [va, vb], { ...CLAMP, easing: e });

// Lebenszyklus: rein → halten → raus (für sauberes Erscheinen + Verschwinden)
export const life = (f: number, inF: number, outF: number, ramp = 9) =>
  interpolate(f, [inF, inF + ramp, outF - ramp, outF], [0, 1, 1, 0], CLAMP);

// Deutsche Euro-Formatierung
export const euro = (n: number) => Math.round(n).toLocaleString('de-DE') + ' €';
export const num = (n: number) => Math.round(n).toLocaleString('de-DE');

// hex + alpha (0..1) → rgba-hex suffix
export const a = (hex: string, alpha: number) =>
  hex + Math.round(Math.min(1, Math.max(0, alpha)) * 255).toString(16).padStart(2, '0');
