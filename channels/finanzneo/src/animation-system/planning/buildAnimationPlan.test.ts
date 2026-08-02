import {describe, expect, it} from 'vitest';
import {buildAnimationPlan} from './buildAnimationPlan';

describe('buildAnimationPlan', () => {
  it('bleibt bei deaktiviertem System im Bild-Fallback', () => {
    const plan = buildAnimationPlan({
      message: 'Zinseszins lässt dein Vermögen wachsen.',
      voiceText: 'Deine Gewinne erwirtschaften mit der Zeit neue Gewinne.',
      data: {
        startCapital: 1000,
        monthlyRate: 200,
        annualReturn: 7,
        years: 20,
      },
    });

    expect(plan.status).toBe('image-fallback');
    expect(plan.mode).toBe('image');
    expect(plan.scene).toBeUndefined();
    expect(plan.errors).toEqual([]);
  });
});
