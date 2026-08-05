import {describe, expect, it} from 'vitest';
// @ts-ignore — kanonischer Vertrag ist bewusst ein Node-ESM-Modul.
import {ScenePlan, SoundCue, normalizeWords} from './finance-contracts.mjs';
// @ts-ignore — zentrale Testplan-Fabrik ist bewusst ein Node-ESM-Modul.
import {createFinanceTestPlan} from './create-finance-test-plan.mjs';

const readTemplate = () => createFinanceTestPlan();

describe('Finance V1 Vertrag', () => {
  it('akzeptiert den kanonischen gültigen Testplan', () => {
    expect(() => ScenePlan.parse(readTemplate())).not.toThrow();
  });

  it('weist abweichendes scriptText zurück', () => {
    const plan = readTemplate();
    plan.scriptText = `${plan.scriptText} zusätzliches Wort`;

    const result = ScenePlan.safeParse(plan);
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue: {message: string}) => issue.message.includes('voiceText-Blöcken'))).toBe(true);
  });

  it('weist doppelte Szenen-IDs zurück', () => {
    const plan = readTemplate();
    plan.scenes[1].id = plan.scenes[0].id;

    const result = ScenePlan.safeParse(plan);
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue: {message: string}) => issue.message.includes('Doppelte Szenen-IDs'))).toBe(true);
  });

  it('weist nicht aufsteigende visualPhases zurück', () => {
    const plan = readTemplate();
    plan.scenes[0].visualPhases = [
      {at: 0.6, action: 'Zweiter Zustand'},
      {at: 0.2, action: 'Zu früher Zustand'},
    ];

    const result = ScenePlan.safeParse(plan);
    expect(result.success).toBe(false);
    expect(result.error?.issues.some((issue: {message: string}) => issue.message.includes('aufsteigender Reihenfolge'))).toBe(true);
  });

  it('begrenzt SFX-Lautstärke über die zentrale Konfiguration', () => {
    expect(SoundCue.safeParse({at: 0.5, assetId: 'audio-sfx-impact', volume: 0.18}).success).toBe(true);
    expect(SoundCue.safeParse({at: 0.5, assetId: 'audio-sfx-impact', volume: 0.9}).success).toBe(false);
  });

  it('normalisiert deutsche Finanzbegriffe deterministisch', () => {
    expect(normalizeWords('„EZB-Zins“: 3,5 % und 1.000 €')).toEqual([
      'ezb', 'zins', '3', '5', '%', 'und', '1', '000', '€',
    ]);
  });
});
