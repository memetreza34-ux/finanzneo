import {describe, expect, it} from 'vitest';
import type {FinanceAnimationScene} from '../contracts';
import {FINANCE_ANIMATION_INPUT_LIMITS} from '../inputLimits';
import type {
  FinanceAnimationValidationInput,
  FinanceImageSceneValidationInput,
} from './validateAnimationScene';
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
    const imageScene: FinanceImageSceneValidationInput = {
      message: baseScene.message,
      voiceText: baseScene.voiceText,
      labels: baseScene.labels,
      data: baseScene.data,
      mode: 'image',
    };

    expect(validateAnimationScene(imageScene)).toEqual([]);
  });

  it('meldet fehlende Kernaussage und Voiceover', () => {
    const issues = validateAnimationScene({...baseScene, message: ' ', voiceText: ''});
    expect(issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['missing-message', 'missing-voice-text']),
    );
  });

  it('warnt bei zu vielen sichtbaren Labels und fehlenden Daten', () => {
    const issues = validateAnimationScene({
      ...baseScene,
      labels: ['1', '2', '3', '4', '5', '6'],
      data: {},
    });
    expect(issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['too-many-labels', 'missing-data']),
    );
  });

  it('warnt bei leeren und doppelten Labels', () => {
    const issues = validateAnimationScene({
      ...baseScene,
      labels: ['ETF', ' ', 'etf'],
    });

    expect(issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['empty-label', 'duplicate-labels']),
    );
  });

  it('erkennt doppelte Labels unabhängig von Groß- und Kleinschreibung', () => {
    const issues = validateAnimationScene({
      ...baseScene,
      labels: ['Rendite', 'RENDiTE'],
    });

    expect(issues.map((issue) => issue.code)).toContain('duplicate-labels');
  });

  it('blockiert überlange Texte auch bei typisierten Direktaufrufen', () => {
    const issues = validateAnimationScene({
      ...baseScene,
      message: 'M'.repeat(FINANCE_ANIMATION_INPUT_LIMITS.maxTextLength + 1),
      voiceText: 'V'.repeat(FINANCE_ANIMATION_INPUT_LIMITS.maxTextLength + 1),
    });

    expect(issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['message-too-long', 'voice-text-too-long']),
    );
  });

  it('blockiert Labelanzahl und Labellänge über der Eingabegrenze', () => {
    const labels = Array.from(
      {length: FINANCE_ANIMATION_INPUT_LIMITS.maxLabels + 1},
      (_, index) => index === 0
        ? 'L'.repeat(FINANCE_ANIMATION_INPUT_LIMITS.maxLabelLength + 1)
        : `Label ${index}`,
    );
    const issues = validateAnimationScene({...baseScene, labels});

    expect(issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['too-many-input-labels', 'input-label-too-long']),
    );
  });

  it('blockiert zu viele Datenfelder bei typisierten Direktaufrufen', () => {
    const data = Object.fromEntries(
      Array.from(
        {length: FINANCE_ANIMATION_INPUT_LIMITS.maxDataFields + 1},
        (_, index) => [`field${index}`, index],
      ),
    );
    const issues = validateAnimationScene({...baseScene, data});

    expect(issues.map((issue) => issue.code)).toContain('too-many-data-fields');
  });

  it('verarbeitet fehlerhafte Laufzeitwerte ohne Ausnahme', () => {
    const malformed = {
      ...baseScene,
      message: 123,
      voiceText: null,
      labels: ['ETF', 42],
      data: [],
    } as unknown as FinanceAnimationValidationInput;

    expect(() => validateAnimationScene(malformed)).not.toThrow();
    expect(validateAnimationScene(malformed).map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        'missing-message',
        'missing-voice-text',
        'invalid-data',
        'invalid-labels',
        'empty-label',
      ]),
    );
  });
});
