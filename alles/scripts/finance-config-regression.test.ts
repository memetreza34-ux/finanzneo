import {describe, expect, it} from 'vitest';
// @ts-ignore — kanonischer Config-Loader ist bewusst ein Node-ESM-Modul.
import {loadFinanceConfig} from './lib/load-finance-config.mjs';

describe('Finance Konfigurations-Regressionen', () => {
  it('erlaubt detaillierte Bildprompts mit mindestens 6000 Zeichen', () => {
    const config = loadFinanceConfig();
    expect(config.textLimits.imagePrompt).toBeGreaterThanOrEqual(6000);
  });
});
