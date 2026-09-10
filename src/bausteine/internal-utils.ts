import {CLAMP, num} from '../brand/tokens';

// Gemeinsame, rein interne Helfer fuer die historische Baustein-Kompatibilitaet.
// Keine dieser Funktionen ist Teil der oeffentlichen Design-System-API.
export const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const deterministicRand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5;
  return x - Math.floor(x);
};
export const reveal14 = (f: number, s: number, d = 14) => clamp01((f - s) / d);
export const reveal16 = (f: number, s: number, d = 16) => clamp01((f - s) / d);
export const formatIntegerDe = num;
export const clampInterpolation = CLAMP;
