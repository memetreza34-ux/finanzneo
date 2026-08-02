import {describe, expect, it} from 'vitest';
import {planFinanceAnimationScene} from './planFinanceAnimationScene';

describe('planFinanceAnimationScene', () => {
  it('bleibt im Bildmodus solange das System deaktiviert ist', () => {
    const result = planFinanceAnimationScene({
      message: 'Zinseszins lässt Vermögen wachsen.',
      voiceText: 'Durch Zinseszins entstehen auf frühere Erträge neue Erträge.',
      data: {
        startCapital: 1000,
        monthlyRate: 200,
        annualReturn: 7,
        years: 20,
      },
    });

    expect(result.decision.mode).toBe('image');
    expect(result.scene).toBeUndefined();
    expect(result.issues).toEqual([]);
  });
});
