import { describe, it, expect } from 'vitest';
import { Caption, SceneConfig, Brief, Clip, ClipManifest, parseOrThrow } from './schemas';

describe('schemas', () => {
  it('akzeptiert ein gültiges Caption-Token (@remotion/captions)', () => {
    const w = parseOrThrow(Caption, { text: 'Hallo', startMs: 0, endMs: 400 });
    expect(w.text).toBe('Hallo');
  });

  it('lehnt ungültige SceneConfig ab', () => {
    expect(() => parseOrThrow(SceneConfig, { id: 'x', title: 't', durationInFrames: -5 }))
      .toThrow();
  });

  it('setzt fps-Default auf 30', () => {
    const s = parseOrThrow(SceneConfig, { id: 's1', title: 'Hook', durationInFrames: 150 });
    expect(s.fps).toBe(30);
  });
});

describe('Brief (Eingangstür)', () => {
  it('akzeptiert einen minimalen Brief und setzt Defaults', () => {
    const b = parseOrThrow(Brief, { topic: 'Was ist ein ETF?' });
    expect(b.topic).toBe('Was ist ein ETF?');
    expect(b.keyMessages).toEqual([]);      // Array-Defaults greifen
    expect(b.audience).toContain('du');     // Zielgruppen-Default
  });

  it('nimmt Fakten mit Quelle und Kernaussagen an', () => {
    const b = parseOrThrow(Brief, {
      topic: 'Inflation',
      keyMessages: ['Geld verliert an Wert'],
      facts: [{ claim: '2 % Ziel der EZB', source: 'https://ecb.europa.eu' }],
    });
    expect(b.facts[0].source).toContain('ecb');
  });

  it('lehnt einen Brief ohne topic ab', () => {
    expect(() => parseOrThrow(Brief, { keyMessages: ['x'] })).toThrow();
  });
});

describe('Clip-Manifest (plattform-neutrale Clips)', () => {
  it('akzeptiert einen AI-Clip mit Prompt', () => {
    const c = parseOrThrow(Clip, {
      id: 'intro', file: 'etf/clips/intro.mp4', source: 'higgsfield',
      prompt: 'cinematic slow zoom into a glowing coin', durationSec: 5,
    });
    expect(c.source).toBe('higgsfield');
  });

  it('lehnt eine unbekannte Quelle ab', () => {
    expect(() => parseOrThrow(Clip, { id: 'x', file: 'a.mp4', source: 'tiktok' })).toThrow();
  });

  it('validiert ein Manifest (Liste von Clips)', () => {
    const m = parseOrThrow(ClipManifest, [
      { id: 'a', file: 'v/clips/a.mp4', source: 'flow' },
      { id: 'b', file: 'v/clips/b.mp4', source: 'pexels', license: 'Pexels Free' },
    ]);
    expect(m).toHaveLength(2);
  });
});
