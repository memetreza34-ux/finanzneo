import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdtempSync, mkdirSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import test from 'node:test';

const validator = resolve('scripts/validate-future-image-storytelling-v3.mjs');
const STORY_MOMENT_REVISION = 'finanzneo-readable-story-moment-v1';
const POLICY = `IMAGE_STORYTELLING_CONTRACT: finanzneo-image-storytelling-v3
STORY_MOMENT_REVISION: ${STORY_MOMENT_REVISION}
Familiar things, clear story, creative when useful.
TRANSFERABILITY-TEST
ABSTRAKTE FINANZKÖRPER
Förderbänder, Schienen, Schranken, Käfige
intuitive Metaphern`;

const contract = {
  id: 'finanzneo-image-storytelling-v3',
  appliesToNewReelsOnly: true,
  storyMomentRevision: STORY_MOMENT_REVISION,
  literalFirstRequired: true,
  directRealWorldDepictionPreferred: true,
  recognizableFinanceContextRequired: true,
  exactVoiceBeatVisualMatchRequired: true,
  transferabilityTestRequired: true,
  metaphorFallbackOnly: false,
  metaphorNeedsExplicitJustification: true,
  intuitiveMetaphorAllowed: true,
  intuitiveMetaphorMayBeatLiteralWhenClearer: true,
  familiarObjectsOrCharactersRequired: true,
  instantStoryReadRequired: true,
  exaggeratedPhysicalStoryAllowed: true,
  familiarObjectMetaphorRequired: true,
  animationFilmStoryFrameRequired: true,
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
  animationFilmRenderingRequired: true,
  groundedStoryMomentRequired: true,
  abstractFinanceObjectAsDefaultForbidden: true,
  phaseAQualityReferenceOnly: true,
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
    contextAnchor: overrides.contextAnchor ?? 'Bankkunde, Smartphone und konkrete Überweisungsdaten',
    storyMoment: overrides.storyMoment ?? 'Der Kunde erkennt den sichtbaren Unterschied zwischen Empfängername und IBAN und stoppt vor der Freigabe.',
    voiceVisualMatch: overrides.voiceVisualMatch ?? 'Die sichtbare Abweichung zwischen Name und IBAN löst die Reaktion der Figur aus.',
    instantReadTest: overrides.instantReadTest ?? 'PASS - Figur, Smartphone und Warnung machen die gestoppte Überweisung sofort verständlich.',
    transferabilityTest: overrides.transferabilityTest ?? 'PASS - Die konkrete Name-IBAN-Prüfung passt nicht unverändert zu anderen Finanzthemen.',
    metaphorJustification: overrides.metaphorJustification ?? 'none',
  };

  const imagePrompt = overrides.imagePrompt ?? 'Create a premium stylized 3D animated-film frame: a bank customer checks a transfer on a smartphone, notices a clear recipient-name versus IBAN mismatch and visibly pauses before authorizing it.';
  const prompt = `VISUAL_STRATEGY: ${meta.strategy}
LITERAL_REAL_WORLD_SITUATION: ${meta.literalSituation}
REAL_WORLD_CONTEXT_ANCHOR: ${meta.contextAnchor}
VISUAL_STORY_MOMENT: ${meta.storyMoment}
VOICEOVER_VISUAL_MATCH: ${meta.voiceVisualMatch}
INSTANT_READ_TEST: ${meta.instantReadTest}
TRANSFERABILITY_TEST: ${meta.transferabilityTest}
METAPHOR_JUSTIFICATION: ${meta.metaphorJustification}

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

test('Story-Moment V1 akzeptiert eine konkrete verständliche Animationsfilm-Szene', () => {
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

test('Instant-Read-Test blockiert eine Szene ohne sofort lesbare Aussage', () => {
  const root = makeReel({instantReadTest: 'Man versteht es vielleicht.'});
  try {
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /INSTANT_READ_TEST|instantReadTest/i);
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

test('intuitive Metapher mit bekannten Dingen ist ausdrücklich erlaubt', () => {
  const root = makeReel({
    strategy: 'metaphor',
    literalSituation: 'Eine Ratenzahlung wirkt anfangs klein, verursacht aber über die Laufzeit deutlich höhere Gesamtkosten.',
    contextAnchor: 'Stilisierte Person, Fernseher, kleiner Ratenzettel und echter langer Kassenzettel',
    storyMoment: 'Die Figur hält vorne den winzigen Ratenzettel, während hinter dem Fernseher ein übertrieben langer Kassenzettel bis in die schwarze Tiefe ausrollt.',
    voiceVisualMatch: 'Kleine Rate vorne und riesige Gesamtrechnung dahinter zeigen direkt den Gegensatz aus dem Voiceover.',
    instantReadTest: 'PASS - Bekannte Figur, Fernseher und Kassenzettel machen klein jetzt versus teuer insgesamt sofort lesbar.',
    transferabilityTest: 'PASS - Fernseher, Rate und langer Gesamtkassenzettel bilden spezifisch das Ratenzahlungsproblem ab.',
    metaphorJustification: 'Die übertriebene Länge des echten Kassenzettels macht die langfristigen Gesamtkosten schneller verständlich als eine trockene Zahlentafel.',
    imagePrompt: 'Create a premium stylized 3D animated-film frame on deep black: a character holds a tiny installment-payment slip beside a television while an absurdly long but recognizable real receipt unrolls behind the television into the distance.',
  });
  try {
    execFileSync(process.execPath, [validator, root], {stdio: 'pipe'});
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('abstrakter capital body wird als literal-Standard blockiert', () => {
  const root = makeReel({
    imagePrompt: 'Create a giant emerald capital body beside a red fee token on a black background.',
  });
  try {
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /abstrakte Finanzkörper|capital body|literal-Hauptidee/i);
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

test('Legacy-V3 ohne Story-Moment-Revision bleibt gültig', () => {
  const root = mkdtempSync(join(tmpdir(), 'finanzneo-image-v3-legacy-'));
  try {
    const legacyContract = {...contract};
    delete (legacyContract as {storyMomentRevision?: string}).storyMomentRevision;
    (legacyContract as {metaphorFallbackOnly: boolean}).metaphorFallbackOnly = true;
    for (const key of ['intuitiveMetaphorAllowed', 'intuitiveMetaphorMayBeatLiteralWhenClearer', 'familiarObjectsOrCharactersRequired', 'instantStoryReadRequired', 'exaggeratedPhysicalStoryAllowed', 'familiarObjectMetaphorRequired', 'animationFilmStoryFrameRequired']) {
      delete (legacyContract as Record<string, unknown>)[key];
    }
    mkdirSync(join(root, '03-szenen'), {recursive: true});
    writeFileSync(join(root, '03-szenen/scene-index.json'), JSON.stringify({imageStorytellingContract: legacyContract, scenes: []}));
    for (const relative of ['alle-bildprompts.txt', 'bildwelt.txt', '00-cover/cover.txt']) {
      const path = join(root, '03-szenen', relative);
      mkdirSync(resolve(path, '..'), {recursive: true});
      writeFileSync(path, 'IMAGE_STORYTELLING_CONTRACT: finanzneo-image-storytelling-v3\nLiteral first, creative second.\nTRANSFERABILITY-TEST\nABSTRAKTE FINANZKÖRPER\nFörderbänder, Schienen, Schranken, Käfige');
    }
    for (const relative of ['szenenplan.md', 'ANTIGRAVITY-AUFTRAG.md']) {
      const path = join(root, '05-projektdateien', relative);
      mkdirSync(resolve(path, '..'), {recursive: true});
      writeFileSync(path, 'IMAGE_STORYTELLING_CONTRACT: finanzneo-image-storytelling-v3\nLiteral first, creative second.\nTRANSFERABILITY-TEST\nABSTRAKTE FINANZKÖRPER\nFörderbänder, Schienen, Schranken, Käfige');
    }
    execFileSync(process.execPath, [validator, root], {stdio: 'pipe'});
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});
