import { random } from 'remotion';
import { E, CLAMP } from './tokens';
import { interpolate } from 'remotion';

// ════════════════════════════════════════════════════════════════════════════
//  ÜBERGÄNGE — als Style-Helfer. p = Fortschritt 0..1.
//  Nutzung:  <div style={{ ...slideIn(prog(f, a, b), 'left') }}>
//  Regel: nie 2× denselben hintereinander.
// ════════════════════════════════════════════════════════════════════════════

type Dir = 'left' | 'right' | 'up' | 'down';

// FADE — ruhig
export const fadeIn = (p: number): React.CSSProperties => ({ opacity: p });

// SLIDE — fließend
export const slideIn = (p: number, dir: Dir = 'up', dist = 120): React.CSSProperties => {
  const e = E.out(p);
  const off = (1 - e) * dist;
  const map: Record<Dir, string> = {
    left: `translateX(${-off}px)`, right: `translateX(${off}px)`,
    up: `translateY(${off}px)`, down: `translateY(${-off}px)`,
  };
  return { opacity: p, transform: map[dir] };
};

// ZOOM — Enthüllung
export const zoomIn = (p: number, from = 0.8): React.CSSProperties => {
  const e = E.spring(p);
  return { opacity: p, transform: `scale(${from + (1 - from) * e})` };
};

// POP — Overshoot
export const popIn = (p: number): React.CSSProperties => {
  const e = E.spring(p);
  return { opacity: Math.min(1, p * 1.5), transform: `scale(${0.6 + e * 0.4})` };
};

// WIPE — Maske von einer Seite (clip-path)
export const wipeIn = (p: number, dir: Dir = 'left'): React.CSSProperties => {
  const e = E.inOut(p);
  const pct = (1 - e) * 100;
  const map: Record<Dir, string> = {
    left:  `inset(0 ${pct}% 0 0)`, right: `inset(0 0 0 ${pct}%)`,
    up:    `inset(0 0 ${pct}% 0)`, down:  `inset(${pct}% 0 0 0)`,
  };
  return { clipPath: map[dir], WebkitClipPath: map[dir] };
};

// GLITCH — dramatisch. Braucht frame für den Jitter.
export const glitchStyle = (frame: number, energy: number): React.CSSProperties => {
  const jx = (random(`gx${frame}`) - 0.5) * 24 * energy;
  const jy = (random(`gy${frame}`) - 0.5) * 8 * energy;
  return { transform: `translate(${jx}px, ${jy}px)` };
};
// RGB-Split-Offsets für Glitch-Text (rote/grüne Kopien)
export const glitchOffset = (frame: number, energy: number) => ({
  x: (random(`go${frame}`) - 0.5) * 30 * energy,
});

// BLUR-IN — weich scharf werden
export const blurIn = (p: number): React.CSSProperties => ({
  opacity: p, filter: `blur(${(1 - E.out(p)) * 16}px)`,
});

// Hilfsfunktion: kombiniere mehrere Style-Objekte
export const combine = (...styles: React.CSSProperties[]): React.CSSProperties =>
  Object.assign({}, ...styles);

// Auto-Übergang für eine Szene (rein UND raus), per absoluter Frame.
// type wählt den Effekt; gibt fertiges Style-Objekt zurück.
export const sceneTransition = (
  frame: number, inF: number, outF: number,
  type: 'fade' | 'slide' | 'zoom' | 'wipe' | 'blur' = 'fade',
  ramp = 12,
): React.CSSProperties => {
  const pIn = interpolate(frame, [inF, inF + ramp], [0, 1], CLAMP);
  const pOut = interpolate(frame, [outF - ramp, outF], [1, 0], CLAMP);
  const p = Math.min(pIn, pOut);
  switch (type) {
    case 'slide': return slideIn(p, 'up');
    case 'zoom':  return zoomIn(p);
    case 'wipe':  return { ...fadeIn(p), ...wipeIn(pIn, 'left') };
    case 'blur':  return blurIn(p);
    default:      return fadeIn(p);
  }
};
