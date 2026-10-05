import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdtempSync, mkdirSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import test from 'node:test';

const validator = resolve('scripts/validate-future-image-storytelling-v3.mjs');
const REVISION = 'finanzneo-free-visual-form-v1';
const ALLOWED = ['character-story', 'object-story', 'comparison', 'chart', 'diagram', 'editorial-quote', 'illustration', 'metaphor', 'hybrid'];
const POLICY = `IMAGE_STORYTELLING_CONTRACT: finanzneo-image-storytelling-v3
VISUAL_FORM_REVISION: ${REVISION}
FREE_VISUAL_FORM_POLICY: Form frei, Bildwelt fest.
TRANSFERABILITY_TEST
CHART/DIAGRAM
POWERPOINT-/EXCEL-DEFAULT`;

const contract = {
  id: 'finanzneo-image-storytelling-v3',
  appliesToNewReelsOnly: true,
  visualFormRevision: REVISION,
  visualFormFreedomRequired: true,
  visualFormChosenPerBeatRequired: true,
  allowedVisualForms: ALLOWED,
  v9StyleLockRequired: true,
  exactVoiceBeatVisualMatchRequired: true,
  instantReadRequired: true,
  transferabilityTestRequired: true,
  recognizableFinanceContextRequired: true,
  humanOptional: true,
  realWorldObjectsOptional: true,
  intuitiveMetaphorAllowed: true,
  illustrationAllowed: true,
  editorialQuoteAllowed: true,
  comparisonAllowed: true,
  chartAllowed: true,
  diagramAllowed: true,
  hybridAllowed: true,
  textMayBePrimaryForEditorialQuote: true,
  realChartMustRemainRealChart: true,
  chartAxesLabelsWhenApplicableRequired: true,
  chartDataIntegrityRequired: true,
  premiumChartStylingRequired: true,
  powerPointExcelDefaultLookForbidden: true,
  genericCorporateLookForbidden: true,
  genericFantasyMechanismAsDefaultForbidden: true,
  decorativeObjectPileForbidden: true,
  staticCatalogCompositionForbidden: true,
  abstractFinanceObjectAsDefaultForbidden: true,
  animationFilmRenderingRequired: true,
  phaseAQualityReferenceOnly: true,
};

const makeReel = (overrides: Record<string, string> = {}) => {
  const root = mkdtempSync(join(tmpdir(), 'finanzneo-image-v3-free-'));
  const write = (relative: string, content: string) => {
    const path = join(root, relative);
    mkdirSync(resolve(path, '..'), {recursive: true});
    writeFileSync(path, content, 'utf8');
  };

  const visualForm = overrides.visualForm ?? 'object-story';
  const meta = {
    visualForm,
    visualConcept: overrides.visualConcept ?? 'Ein großes Portemonnaie verliert sichtbar mehrere kleine wiederkehrende Gebührenbelege.',
    voiceVisualMatch: overrides.voiceVisualMatch ?? 'Die wiederkehrenden Gebührenbelege zeigen direkt, dass kleine Kosten mehrfach vom Geld abgehen.',
    instantReadTest: overrides.instantReadTest ?? 'PASS - Portemonnaie und wiederkehrende Gebührenbelege machen den Geldabfluss sofort verständlich.',
    transferabilityTest: overrides.transferabilityTest ?? 'PASS - Die wiederkehrenden Gebührenbelege passen spezifisch zum gesprochenen Gebührenproblem.',
    dataIntegrityTest: overrides.dataIntegrityTest ?? (visualForm === 'chart' || visualForm === 'diagram'
      ? 'PASS - Werte, Proportionen, Achsen und Labels entsprechen exakt dem beschriebenen Vergleich.'
      : 'not-applicable'),
  };

  const imagePrompt = overrides.imagePrompt ?? 'Create a premium FinanzNeo V9 image on deep black with a large wallet and recurring fee receipts visibly reducing the money inside.';
  const prompt = `VISUAL_FORM: ${meta.visualForm}
VISUAL_CONCEPT: ${meta.visualConcept}
VOICEOVER_VISUAL_MATCH: ${meta.voiceVisualMatch}
INSTANT_READ_TEST: ${meta.instantReadTest}
TRANSFERABILITY_TEST: ${meta.transferabilityTest}
DATA_INTEGRITY_TEST: ${meta.dataIntegrityTest}

IMAGE PROMPT:
${imagePrompt}

${POLICY}
`;

  const index = {
    imageStorytellingContract: contract,
    scenes: [{
      id: 'scene-01',
      type: 'image',
      planFile: 'EINZELNE-SZENEN/scene-01/bildprompt.txt',
      imageStorytelling: meta,
    }],
  };

  write('03-szenen/scene-index.json', JSON.stringify(index, null, 2));
  write('03-szenen/EINZELNE-SZENEN/scene-01/bildprompt.txt', prompt);
  write('03-szenen/alle-bildprompts.txt', prompt + '\n' + POLICY);
  write('03-szenen/bildwelt.txt', POLICY);
  write('03-szenen/00-cover/cover.txt', prompt);
  write('05-projektdateien/szenenplan.md', POLICY);
  write('05-projektdateien/ANTIGRAVITY-AUFTRAG.md', POLICY);
  return root;
};

test('Free Visual Form akzeptiert object-story', () => {
  const root = makeReel();
  try {
    execFileSync(process.execPath, [validator, root], {stdio: 'pipe'});
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('Free Visual Form akzeptiert echtes Chart mit Datenintegrität', () => {
  const root = makeReel({
    visualForm: 'chart',
    visualConcept: 'Ein echtes Liniendiagramm mit X-Achse Jahre und Y-Achse Vermögen zeigt 7 Prozent und 6 Prozent über 30 Jahre.',
    voiceVisualMatch: 'Die beiden korrekt beschrifteten Wachstumslinien machen die zunehmende Renditedifferenz sichtbar.',
    instantReadTest: 'PASS - Zwei klar beschriftete Linien und der wachsende Abstand sind innerhalb einer Sekunde verständlich.',
    transferabilityTest: 'PASS - 7 Prozent gegen 6 Prozent über 30 Jahre ist spezifisch für diesen Renditevergleich.',
    dataIntegrityTest: 'PASS - X-Achse 0 bis 30 Jahre, Y-Achse Vermögen, beide Startwerte identisch und Endwerte proportional korrekt.',
    imagePrompt: 'Create a premium FinanzNeo V9 real line chart with labeled X and Y axes, 7% and 6% growth lines, correct values and cinematic 3D depth on deep black.',
  });
  try {
    execFileSync(process.execPath, [validator, root], {stdio: 'pipe'});
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('Free Visual Form akzeptiert editorial-quote als Hauptmotiv', () => {
  const root = makeReel({
    visualForm: 'editorial-quote',
    visualConcept: 'Große physische 3D-Typografie Kleine Kosten. Große Wirkung. steht vor einem anwachsenden Berg kleiner Gebührenbelege.',
    voiceVisualMatch: 'Die Hauptaussage wird direkt als Editorial-Text mit passender visueller Gebührenentwicklung gezeigt.',
    instantReadTest: 'PASS - Der kurze Haupttext und der wachsende Belegberg transportieren die Aussage sofort.',
    transferabilityTest: 'PASS - Text und Gebührenbelege beziehen sich konkret auf wiederkehrende Kosten.',
    dataIntegrityTest: 'not-applicable',
    imagePrompt: 'Create a premium FinanzNeo V9 editorial quote scene with physical 3D typography and a growing pile of fee receipts on deep black.',
  });
  try {
    execFileSync(process.execPath, [validator, root], {stdio: 'pipe'});
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('unbekannte Visual Form wird blockiert', () => {
  const root = makeReel({visualForm: 'boring-template'});
  try {
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /visualForm|VISUAL_FORM/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('Chart ohne Datenintegritäts-PASS wird blockiert', () => {
  const root = makeReel({visualForm: 'chart', dataIntegrityTest: 'not-applicable'});
  try {
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /DATA_INTEGRITY|dataIntegrity/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('Transferability-Test blockiert generische Planung', () => {
  const root = makeReel({transferabilityTest: 'Dieses Bild ist allgemein passend.'});
  try {
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /TRANSFERABILITY_TEST|transferabilityTest/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('abstrakter capital body ist außerhalb bewusster Illustration/Metapher gesperrt', () => {
  const root = makeReel({
    visualForm: 'object-story',
    imagePrompt: 'Create a giant emerald capital body beside a red fee token on a black background.',
  });
  try {
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /abstrakte Finanzkörper|VISUAL_FORM|capital body/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('bewusste Illustration darf abstrakter sein, wenn Planung und Instant-Read stimmen', () => {
  const root = makeReel({
    visualForm: 'illustration',
    visualConcept: 'Eine bewusst abstrahierte, klar beschriftete Renditelandschaft visualisiert den langfristigen Abstand zweier Entwicklungen.',
    voiceVisualMatch: 'Die zwei klar beschrifteten Verläufe zeigen exakt die unterschiedliche Entwicklung.',
    instantReadTest: 'PASS - Zwei deutlich beschriftete Wege mit sichtbar wachsendem Abstand machen den Vergleich sofort klar.',
    transferabilityTest: 'PASS - Die konkrete 7-Prozent-gegen-6-Prozent-Renditelandschaft gehört genau zu diesem Vergleich.',
    dataIntegrityTest: 'not-applicable',
    imagePrompt: 'Create a deliberate stylized finance illustration with two labeled return paths that separate over time, premium V9 depth and deep black stage.',
  });
  try {
    execFileSync(process.execPath, [validator, root], {stdio: 'pipe'});
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('bestehende V2-Reels bleiben rückwärtskompatibel', () => {
  const root = mkdtempSync(join(tmpdir(), 'finanzneo-image-v2-'));
  try {
    mkdirSync(join(root, '03-szenen'), {recursive: true});
    writeFileSync(join(root, '03-szenen/scene-index.json'), JSON.stringify({imageStorytellingContract: {id: 'finanzneo-image-storytelling-v2'}}));
    execFileSync(process.execPath, [validator, root], {stdio: 'pipe'});
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});
