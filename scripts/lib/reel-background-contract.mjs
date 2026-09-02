import {existsSync, readFileSync} from 'node:fs';
import {relative, resolve} from 'node:path';

export const REEL_BACKGROUND_CONTRACT_ID = 'finanzneo-pure-black-background-v1';
export const REEL_BACKGROUND_HEX = '#000000';

const normalize = (path) => String(path).replaceAll('\\', '/');
const read = (path) => readFileSync(path, 'utf8');

export const validateCentralReelBackgroundContract = (projectRoot = resolve('.')) => {
  const errors = [];
  const required = {
    finance: resolve(projectRoot, 'src/design-system/FinanceBackground.tsx'),
    legacy: resolve(projectRoot, 'src/brand/components/Background.tsx'),
    template: resolve(projectRoot, 'src/production/reel-template/ReelTemplate.tsx'),
  };

  for (const [label, path] of Object.entries(required)) {
    if (!existsSync(path)) errors.push(`${label}: Pflichtdatei fehlt: ${normalize(relative(projectRoot, path))}`);
  }
  if (errors.length) return errors;

  const finance = read(required.finance);
  const legacy = read(required.legacy);
  const template = read(required.template);
  const legacyBackgroundSection = legacy.split('export const Progress')[0];

  if (!finance.includes(`REEL_BACKGROUND_COLOR = '${REEL_BACKGROUND_HEX}'`)) {
    errors.push(`FinanceBackground muss ${REEL_BACKGROUND_HEX} als einzige Reel-Hintergrundfarbe definieren.`);
  }
  if (!finance.includes('data-finanzneo-reel-background="pure-black-v1"')) {
    errors.push('FinanceBackground braucht den pure-black-v1 Marker.');
  }
  for (const forbidden of ['FNBgAurora', 'FNBgParticles', 'FNBgGrid', 'FNBgRadial', 'radial-gradient', 'linear-gradient', 'backgroundImage']) {
    if (finance.includes(forbidden)) errors.push(`FinanceBackground darf ${forbidden} nicht verwenden.`);
  }

  if (!legacyBackgroundSection.includes("backgroundColor: '#000000'")) {
    errors.push('Legacy Background muss ebenfalls statisch #000000 rendern.');
  }
  for (const forbidden of ['radial-gradient', 'linear-gradient', 'backgroundImage', 'translateY(', 'grid &&', 'glow ?']) {
    if (legacyBackgroundSection.includes(forbidden)) errors.push(`Legacy Background enthält verbotenen Hintergrundeffekt: ${forbidden}`);
  }
  if (!legacy.includes('export const Vignette: React.FC = () => null')) {
    errors.push('Legacy Vignette muss für Reels deaktiviert bleiben.');
  }

  if (!template.includes('data-finanzneo-canvas="pure-black-v1"')) {
    errors.push('ReelTemplate braucht den pure-black-v1 Canvas-Marker.');
  }
  if (!template.includes(`REEL_CANVAS_BLACK = '${REEL_BACKGROUND_HEX}'`)) {
    errors.push(`ReelTemplate muss den Root-Canvas auf ${REEL_BACKGROUND_HEX} setzen.`);
  }
  if (!template.includes('backgroundColor: REEL_CANVAS_BLACK')) {
    errors.push('ReelTemplate verwendet den schwarzen Root-Canvas nicht.');
  }

  return errors;
};

export const validatePhase3CompositionBackgroundSource = (compositionSourcePath) => {
  const errors = [];
  if (!compositionSourcePath || !existsSync(compositionSourcePath)) {
    errors.push('Composition-Quelldatei für Background-Prüfung fehlt.');
    return errors;
  }

  const source = read(compositionSourcePath);
  const forbiddenPatterns = [
    [/FNBgAurora/, 'FNBgAurora'],
    [/FNBgParticles/, 'FNBgParticles'],
    [/FNBgGrid/, 'FNBgGrid'],
    [/FNBgRadial/, 'FNBgRadial'],
    [/fn_backgrounds/, 'direkter fn_backgrounds-Import'],
    [/particles?\s*[:=]/i, 'Partikel-Hintergrund'],
  ];

  for (const [pattern, label] of forbiddenPatterns) {
    if (pattern.test(source)) errors.push(`Composition verwendet verbotenen Reel-Hintergrund: ${label}.`);
  }

  return errors;
};
