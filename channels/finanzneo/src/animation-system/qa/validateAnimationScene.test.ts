import {describe, expect, it} from 'vitest';
import {validateAnimationScene} from './validateAnimationScene';

const baseScene = {
  mode: 'full-animation' as const,
  template: 'compound-growth' as const,
  message: 'Zinseszins beschleunigt das Wachstum.',
  voiceText: 'Deine Erträge erwirtschaften mit der Zeit neue Erträge.',
  labels: ['Einzahlung', 'Rendite'],
  data: {startCapital: 1000, monthlyRate: 200, annualReturn: 7, years: 20},
};

describe('validateAnimationScene', () => {
  it('akzeptiert eine vollständige Animationsszene', () => {
    expect(validateAnimationScene(baseScene)).toEqual([]);
  });

  it('überspringt reine Bildszenen', () => {
    expect(validateAnimationScene({...baseScene, mode: 'image'})).toEqual([]);
  });

  it('meldet fehlende Kernaussage und Voiceover', () => {
    const issues = validateAnimationScene({...baseScene, message: ' ', voiceText: ''});
    expect(issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['missing-message', 'missing-voice-text']),
    );
  });

  it('warnt bei zu vielen Labels und fehlenden Daten', () => {
    const issues = validateAnimationScene({
      ...baseScene,
      labels: ['1', '2', '3', '4', '5', '6'],
      data: {},
    });
    expect(issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['too-many-labels', 'missing-data']),
    );
  });
});
