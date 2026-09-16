// FinanzNeo YouTube Layout V1 — einzige technische Wahrheit für 1920 × 1080.
//
// REEL_STYLE in src/brand/tokens.ts ist hart auf 1080 × 1920 ausgelegt
// (caption.bottom 340, header.top 154). Für Longform gelten eigene Werte;
// YouTube-Projekte dürfen sie nicht lokal überschreiben.
//
// WICHTIGER UNTERSCHIED ZUM REEL: YouTube bekommt KEINE Karaoke-Untertitel.
// Reels brauchen sie, weil sie stumm im Feed laufen. Longform wird mit Ton
// geschaut. Unten steht deshalb nur optionaler kurzer Infotext — dieselbe Rolle
// wie ein Label in einer Animation, kein mitlaufender Sprechtext.

export const YOUTUBE_FORMAT = {width: 1920, height: 1080, fps: 30} as const;

/**
 * Das Flow-Bild ist 16:9 wie der Frame. Es wird deshalb nicht formatfüllend
 * gesetzt, sondern auf exakt drei Viertel skaliert: 1440 × 810, zentriert bei
 * x = 240, y = 180. Darüber bleibt eine ruhige schwarze Bahn für die
 * Zwischenüberschrift, darunter eine schmale für optionalen Infotext.
 *
 * Weil die Bildwelt `finanzneo-youtube-cg-animated-black-v2` reines Schwarz als
 * Hintergrund vorschreibt, gehen die Bildkanten in die Videofläche über. Es
 * entsteht kein sichtbarer Kasten, obwohl das Bild kleiner steht.
 */
export const YOUTUBE_STYLE = {
  header: {
    top: 62,
    left: 120,
    right: 120,
    fontSize: 52,
    minFontSize: 46,
    iconSize: 40,
    iconBox: 46,
    gap: 16,
    maxWidth: 1480,
    maxLines: 2,
    enterFrames: 5,
  },
  visual: {
    top: 180,
    bottom: 990,
    left: 240,
    width: 1440,
    height: 810,
    /** 1440/1920 — das Bild steht exakt auf drei Vierteln der Framebreite. */
    scale: 3 / 4,
  },
  /** Optionale kurze Zeile unter dem Visual. Kein Sprechtext, keine Untertitel. */
  infoText: {
    bottom: 30,
    left: 200,
    right: 200,
    fontSize: 26,
    maxLines: 1,
  },
  transition: {
    continuityFrames: 3,
    imageEnterFrames: 5,
    fadeToBlackForbidden: true,
  },
  /** Karaoke-Untertitel sind auf YouTube ausdrücklich nicht vorgesehen. */
  captionsDisabled: true,
} as const;

/** Prüft, dass die Zonen sich nicht überlappen und im Frame liegen. */
export const youtubeLayoutIssues = () => {
  const issues: string[] = [];
  const {header, visual, infoText} = YOUTUBE_STYLE;
  const headerBottom = header.top + header.fontSize * 1.08 * header.maxLines;
  const infoTop = YOUTUBE_FORMAT.height - infoText.bottom - infoText.fontSize * 1.2 * infoText.maxLines;

  if (headerBottom > visual.top) issues.push(`Header (bis ${Math.round(headerBottom)}) ragt in die Visualzone (ab ${visual.top}).`);
  if (visual.bottom > infoTop) issues.push(`Visualzone (bis ${visual.bottom}) ragt in die Infotextzone (ab ${Math.round(infoTop)}).`);
  if (visual.top + visual.height !== visual.bottom) issues.push('Visualzone: top + height muss bottom ergeben.');
  if (visual.left * 2 + visual.width !== YOUTUBE_FORMAT.width) issues.push('Visualzone ist horizontal nicht zentriert.');
  if (Math.abs(visual.width / visual.height - 16 / 9) > 0.001) issues.push('Visualzone ist nicht 16:9.');
  if (infoText.bottom < 0) issues.push('Infotext liegt außerhalb des Frames.');

  return issues;
};
