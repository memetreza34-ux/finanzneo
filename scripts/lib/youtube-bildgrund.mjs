// Hintergrund der Flow-Bilder messen (Arman, 24.10.2026): Flow trifft das Creme der Stilvorlage
// nicht exakt (Video 2 ≈ #F9E9CB, Video 3 ≈ #FCF4E1). Damit Animationen, Endkarte und Bilder
// denselben Ton haben, misst der Zusammenbau den Grund aller Bilder eines Videos und gibt ihn
// über `timeline.json → grund` an die Daten-Bühne weiter.
//
// Gemessen wird der obere Rand und die obere Hälfte der Seitenränder (unten liegen oft Tisch
// oder Boden), je Bild der Median, über alle Bilder wieder der Median — einzelne volle Szenen
// verschieben den Wert so nicht.

import {spawnSync} from 'node:child_process';

const B = 64;
const H = 36;

const median = (werte) => {
  const s = [...werte].sort((a, b) => a - b);
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
};

/** RGB-Median des Bildrands, oder null, wenn ffmpeg das Bild nicht lesen kann. */
export const randFarbe = (pfad) => {
  const r = spawnSync('ffmpeg', ['-nostdin', '-v', 'error', '-i', pfad, '-vf', `scale=${B}:${H}:flags=area`, '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], {maxBuffer: B * H * 3 + 1024});
  if (r.status !== 0 || r.stdout.length < B * H * 3) return null;
  const px = (x, y) => [0, 1, 2].map((k) => r.stdout[(y * B + x) * 3 + k]);
  const rand = [];
  for (let y = 0; y < 2; y++) for (let x = 0; x < B; x++) rand.push(px(x, y));
  for (let y = 2; y < H / 2; y++) for (const x of [0, 1, B - 2, B - 1]) rand.push(px(x, y));
  return [0, 1, 2].map((k) => median(rand.map((p) => p[k])));
};

const hex = (rgb) => `#${rgb.map((w) => Math.round(w).toString(16).padStart(2, '0')).join('').toUpperCase()}`;

/** Gemeinsamer Hintergrund aller Bilder als #RRGGBB, oder null ohne lesbare Bilder. */
export const messeBildGrund = (pfade) => {
  const farben = pfade.map(randFarbe).filter(Boolean);
  if (farben.length === 0) return null;
  return {grund: hex([0, 1, 2].map((k) => median(farben.map((f) => f[k])))), bilder: farben.length};
};
