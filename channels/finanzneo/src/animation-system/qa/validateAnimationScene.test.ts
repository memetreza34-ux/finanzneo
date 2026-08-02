import {describe, expect, it} from 'vitest';
import type {FinanceAnimationRequest, FinanceAnimationScene} from '../contracts';
import {validateAnimationScene} from './validateAnimationScene';

const baseScene: FinanceAnimationScene = {
  mode: 'full-animation',
  template: 'compound-growth',
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
    const imageScene = {
      ...baseScene,
      mode: 'image',
    } as unknown as FinanceAnimationRequest & {mode: 'image'};

    expect(validateAnimationScene(imageScene)).toEqual([]);
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
