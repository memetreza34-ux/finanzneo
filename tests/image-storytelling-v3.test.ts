import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdtempSync, mkdirSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import test from 'node:test';

const validator = resolve('scripts/validate-future-image-storytelling-v3.mjs');
const POLICY = `IMAGE_STORYTELLING_CONTRACT: finanzneo-image-storytelling-v3
Literal first, creative second.
TRANSFERABILITY-TEST
Förderbänder, Schienen, Schranken, Käfige`;

const contract = {
  id: 'finanzneo-image-storytelling-v3',
  appliesToNewReelsOnly: true,
  literalFirstRequired: true,
  directRealWorldDepictionPreferred: true,
  recognizableFinanceContextRequired: true,
  exactVoiceBeatVisualMatchRequired: true,
  transferabilityTestRequired: true,
  metaphorFallbackOnly: true,
  metaphorNeedsExplicitJustification: true,
  genericFantasyMechanismAsDefaultForbidden: true,
  railsConveyorsGatesCagesPortalsAsDefaultForbidden: true,
  practicalEverydaySituationRequired: true,
  directMeaningWithoutCaptionRequired: true,
  visibleActionConflictOrConsequenceRequired: true,
  genericSymbolOnlyForbidden: true,
  isolatedFinanceIconAsMainStoryForbidden: true,
  decorativeObjectPileForbidden: true,
  staticCatalogCompositionForbidden: true,
  entertainmentThroughActionContrastOrConflictRequired: true,
  beforeAfterOrCauseEffectWhenHelpful: true,
  humanContextWhenHelpful: true,
  visualHookUnderOneSecondRequired: true,
  oneImagePerSentenceWhenItImprovesClarity: true,
  extraImagePreferredOverOverloadedStill: true,
  labelsSupplementalOnly: true,
};

const makeReel = (overrides: Record<string, string> = {}) => {
  const root = mkdtempSync(join(tmpdir(), 'finanzneo-image-v3-'));
  const write = (relative: string, content: string) => {
    const path = join(root, relative);
    mkdirSync(resolve(path, '..'), {recursive: true});
    writeFileSync(path, content, 'utf8');
  };

  const meta = {
    strategy: overrides.strategy ?? 'literal',
    literalSituation: overrides.literalSituation ?? 'Eine echte Überweisung wartet sichtbar vor der Freigabe.',
    contextAnchor: overrides.contextAnchor ?? 'Banküberweisung mit Empfängername und IBAN',
    voiceVisualMatch: overrides.voiceVisualMatch ?? 'Die sichtbare Abweichung zwischen Name und IBAN löst die Warnung aus.',
    transferabilityTest: overrides.transferabilityTest ?? 'PASS - Die konkrete Name-IBAN-Prüfung passt nicht unverändert zu anderen Finanzthemen.',
    metaphorJustification: overrides.metaphorJustification ?? 'none',
  };

  const prompt = `VISUAL_STRATEGY: ${meta.strategy}
LITERAL_REAL_WORLD_SITUATION: ${meta.literalSituation}
REAL_WORLD_CONTEXT_ANCHOR: ${meta.contextAnchor}
VOICEOVER_VISUAL_MATCH: ${meta.voiceVisualMatch}
TRANSFERABILITY_TEST: ${meta.transferabilityTest}
METAPHOR_JUSTIFICATION: ${meta.metaphorJustification}

IMAGE PROMPT:
Create a stylized 3D scene of a bank transfer before authorization. Show recipient name and IBAN visibly being compared, with a clear mismatch warning stopping the payment.

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

test('Literal-first V3 akzeptiert eine konkrete themenspezifische Bildplanung', () => {
  const root = makeReel();
  try {
    execFileSync(process.execPath, [validator, root], {stdio: 'pipe'});
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('Transferability-Test blockiert generische Bildplanung', () => {
  const root = makeReel({transferabilityTest: 'Dieses Bild ist allgemein passend.'});
  try {
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /TRANSFERABILITY_TEST|transferabilityTest/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('Metapher ohne konkrete Begründung wird blockiert', () => {
  const root = makeReel({strategy: 'metaphor', metaphorJustification: 'none'});
  try {
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /METAPHOR_JUSTIFICATION|Metapher/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('Bestehende V2-Reels bleiben rückwärtskompatibel', () => {
  const root = mkdtempSync(join(tmpdir(), 'finanzneo-image-v2-'));
  try {
    mkdirSync(join(root, '03-szenen'), {recursive: true});
    writeFileSync(join(root, '03-szenen/scene-index.json'), JSON.stringify({imageStorytellingContract: {id: 'finanzneo-image-storytelling-v2'}}));
    execFileSync(process.execPath, [validator, root], {stdio: 'pipe'});
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});
