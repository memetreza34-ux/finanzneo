import { describe, it, expect } from 'vitest';
import { duckVolumeAt, toFrameWindows } from './audio';

const opts = { windowsFrames: [[30, 90]] as [number, number][], baseVolume: 0.2, duckVolume: 0.05, rampFrames: 10 };

describe('duckVolumeAt (Auto-Ducking)', () => {
  it('spielt volle Lautstärke außerhalb der Sprech-Fenster', () => {
    expect(duckVolumeAt(0, opts)).toBeCloseTo(0.2);
    expect(duckVolumeAt(120, opts)).toBeCloseTo(0.2);
  });

  it('duckt voll, während die Stimme spricht', () => {
    expect(duckVolumeAt(60, opts)).toBeCloseTo(0.05);
  });

  it('rampt weich rein und raus', () => {
    expect(duckVolumeAt(25, opts)).toBeLessThan(0.2);   // schon am Absenken
    expect(duckVolumeAt(25, opts)).toBeGreaterThan(0.05);
    expect(duckVolumeAt(95, opts)).toBeGreaterThan(0.05); // wieder am Anheben
  });

  it('rechnet Sekunden-Fenster in Frames um', () => {
    expect(toFrameWindows([[1, 2]], 30)).toEqual([[30, 60]]);
  });
});
