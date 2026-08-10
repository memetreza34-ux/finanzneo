import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const FINANCE_CONFIG_PATH = path.resolve(
  here,
  '../../channels/finanzneo/engine/config/finance-v1.json',
);

let cached;

export const loadFinanceConfig = () => {
  if (cached) return cached;
  const raw = JSON.parse(fs.readFileSync(FINANCE_CONFIG_PATH, 'utf8'));
  if (raw?.version !== 'finance-v1') {
    throw new Error(`Ungültige Finance-Konfiguration: ${FINANCE_CONFIG_PATH}`);
  }

  cached = raw;
  return cached;
};
