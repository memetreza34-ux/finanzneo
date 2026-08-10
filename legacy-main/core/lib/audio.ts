// ════════════════════════════════════════════════════════════════════════
//  @studio/core/lib/audio — reine Audio-Mathematik (KEIN Remotion-Import),
//  damit sie unit-testbar ist. Nutzt der <SoundBed>-Baustein fürs Auto-Ducking:
//  die Hintergrundmusik wird leiser, solange die Stimme spricht, mit weichen
//  Rampen rein/raus. Frame-basiert (deterministisch, seek-safe).
// ════════════════════════════════════════════════════════════════════════

const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp01(t);

export interface DuckOptions {
  windowsFrames: Array<[number, number]>; // Sprech-Fenster [von, bis] in Frames
  baseVolume: number;                     // Lautstärke ohne Stimme
  duckVolume: number;                     // Lautstärke während der Stimme (leiser)
  rampFrames: number;                     // weiche Rampe rein/raus (Frames)
}

/**
 * Lautstärke der Hintergrundmusik an einem Frame — geduckt in Sprech-Fenstern,
 * mit linearen Rampen davor/danach. Außerhalb aller Fenster = baseVolume.
 */
export function duckVolumeAt(frame: number, o: DuckOptions): number {
  let v = o.baseVolume;
  const r = Math.max(1, o.rampFrames);
  for (const [a, b] of o.windowsFrames) {
    if (frame < a - r || frame > b + r) continue;
    if (frame < a) v = Math.min(v, lerp(o.baseVolume, o.duckVolume, (frame - (a - r)) / r));   // rein
    else if (frame > b) v = Math.min(v, lerp(o.duckVolume, o.baseVolume, (frame - b) / r));     // raus
    else v = Math.min(v, o.duckVolume);                                                          // voll geduckt
  }
  return v;
}

/** Sekunden-Fenster → Frame-Fenster (fürs Ducking aus Captions/Beats). */
export function toFrameWindows(sec: Array<[number, number]>, fps: number): Array<[number, number]> {
  return sec.map(([a, b]) => [Math.round(a * fps), Math.round(b * fps)]);
}
