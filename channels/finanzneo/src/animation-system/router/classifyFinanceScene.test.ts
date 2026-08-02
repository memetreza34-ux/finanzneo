import {describe, expect, it} from 'vitest';
import {classifyFinanceScene} from './classifyFinanceScene';

describe('classifyFinanceScene', () => {
  it('always falls back to image while feature flags are disabled', () => {
    const decision = classifyFinanceScene({
      message: 'Zinseszins lässt dein Vermögen wachsen.',
      voiceText: 'Zinseszins lässt dein Vermögen wachsen.',
    });

    expect(decision.mode).toBe('image');
    expect(decision.template).toBeUndefined();
    expect(decision.confidence).toBe(1);
  });
});
