import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdtempSync, mkdirSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import test from 'node:test';

const validator = resolve('scripts/validate-future-reel-phase1-motion-direction-v1.mjs');
const CONTRACT_ID = 'finanzneo-phase1-individual-motion-v1';
const MOTION_CORE_ID = 'finanzneo-motion-core-v1';

type RootOptions = {
  withContract?: boolean;
  withMotionCore?: boolean;
  withVisualQa?: boolean;
  source?: string;
  ledger?: string;
};

const makeRoot = (
  directionOverrides: Record<string, unknown> = {},
  options: RootOptions = {},
) => {
  const {
    withContract = true,
    withMotionCore = true,
    withVisualQa = true,
    source = "import {PremiumPhysicalStage, PhysicalAccount} from '../../../../../../../src/motion';\nexport const Scene02Animation = () => null;\n",
    ledger,
  } = options;

  const root = mkdtempSync(join(tmpdir(), 'finanzneo-phase1-motion-'));
  mkdirSync(join(root, '03-szenen/EINZELNE-SZENEN/scene-02'), {recursive: true});
  mkdirSync(join(root, '05-projektdateien'), {recursive: true});

  const direction = {
    spokenPoint: 'Die Kreditrate besteht aus Zins und Tilgung und verändert sich über die Laufzeit.',
    viewerMustUnderstand: 'Der Zuschauer sieht, dass der Zinsanteil sinkt, während der Tilgungsanteil steigt.',
    visualQuestion: 'Wie verändert sich die Aufteilung einer gleichbleibenden Kreditrate sichtbar über die Zeit?',
    chosenMechanism: 'Eine feste Monatsrate teilt sich dynamisch in zwei physische Anteile, während parallel die Restschuld schrumpft.',
    mechanismRationale: 'Die physische Aufteilung zeigt direkt die beiden Aufgaben derselben Rate und verbindet sie sichtbar mit der sinkenden Restschuld.',
    mechanicId: 'fn-loan-rate-split',
    heroObject: 'physischer Monatsraten-Block',
    supportObjects: 'Restschuld-Körper und zwei getrennte Ratenanteile',
    primaryAction: 'Der Monatsraten-Block teilt sich sichtbar in Zins und Tilgung, während die Restschuld sinkt.',
    motionAxis: 'zentraler Split plus vertikale Restschuld-Reduktion',
    resultType: 'gleiche Rate mit verändertem Zins-Tilgungs-Verhältnis',
    uniquenessRationale: 'Diese Szene erklärt eine interne Aufteilung derselben Rate und keinen Transfer, Kostenabzug oder bloßen Ergebnisvergleich.',
    reuseDecision: 'invent-new',
    reusedTechniqueId: 'none',
    reuseJustification: 'none',
    ...directionOverrides,
  };

  const baseContract = {
    id: CONTRACT_ID,
    appliesToNewReelsOnly: true,
    legacyReelsUntouched: true,
    analyzeSpokenPointBeforeTechnique: true,
    viewerUnderstandingBeforeImplementation: true,
    visualQuestionBeforeTechnique: true,
    mechanismDerivedFromContent: true,
    noFixedAnimationMenu: true,
    toolsFollowContent: true,
    templateReuseOnlyWhenBestFit: true,
    reuseNeedsExplicitJustification: true,
    supportAssetsCannotDriveSceneConcept: true,
    phase1DirectionMustPrecedeMotionDesign: true,
    phase1DirectionMustPrecedeAnimationCode: true,
  };

  const motionCoreContract = withMotionCore ? {
    semanticMechanicFamiliesNotTemplates: true,
    motionCoreVersion: MOTION_CORE_ID,
    canonicalMotionSource: 'src/motion',
    mechanicRegistry: 'src/motion/mechanics.ts',
    mechanicSelectionRule: '.agents/plugins/finanzneo-motion/rules/mechanic-selection.md',
    motionDirectorSkill: '.agents/plugins/finanzneo-motion/skills/remotion-director/SKILL.md',
    motionArtDirectorSkill: '.agents/plugins/finanzneo-motion/skills/motion-art-director/SKILL.md',
    motionCoreCuratorSkill: '.agents/plugins/finanzneo-motion/skills/motion-core-curator/SKILL.md',
    mechanicLedgerRequired: true,
    antiRepetitionGateRequired: true,
    coreReuseBeforeLocalPrimitive: true,
    legacyLabsNotStyleReference: true,
    visualQaGateRequiredBeforePhase3Render: true,
  } : {};

  const index = {
    ...(withContract ? {
      phase1MotionDirectionContract: {
        ...baseContract,
        ...motionCoreContract,
      },
    } : {}),
    scenes: [{
      id: 'scene-02',
      type: 'animation',
      phase1MotionDirection: direction,
      motionDesign: {viewerChange: 'Die Aufteilung der Rate wird sichtbar verständlich.'},
      animationSourceFile: '03-szenen/EINZELNE-SZENEN/scene-02/animation.tsx',
    }],
  };

  writeFileSync(join(root, '03-szenen/scene-index.json'), JSON.stringify(index, null, 2));
  writeFileSync(join(root, '03-szenen/EINZELNE-SZENEN/scene-02/animation.tsx'), source);

  const policy = withMotionCore
    ? `PHASE1_MOTION_DIRECTION: ${CONTRACT_ID}\nMOTION_CORE: ${MOTION_CORE_ID}\nCANONICAL_MOTION_SOURCE: src/motion\nMECHANIC_REGISTRY: src/motion/mechanics.ts\nSprechpunkt -> Verständnisziel -> Mechanik.\nKein Animations-Menü.\n`
    : `PHASE1_MOTION_DIRECTION: ${CONTRACT_ID}\nSprechpunkt -> Verständnisziel -> Mechanik.\nKeine Animations-Auswahlliste.\n`;
  writeFileSync(join(root, '05-projektdateien/phase1-motion-direction-v1.md'), policy);

  if (withMotionCore) {
    writeFileSync(
      join(root, '05-projektdateien/motion-mechanic-ledger.md'),
      ledger ?? `SCENE_ID | MECHANIC_ID | HERO_OBJECT | PRIMARY_ACTION | MOTION_AXIS | RESULT_TYPE\nscene-02 | fn-loan-rate-split | Monatsrate | Split | zentral+vertikal | Verhältnis verändert\n`,
    );
    if (withVisualQa) {
      writeFileSync(
        join(root, '05-projektdateien/visual-qa.md'),
        `MOTION_ART_DIRECTION=PENDING\nPLAYWRIGHT_VISUAL_QA=PENDING\n| scene-02 | START / MID / RESULT | PENDING |\n`,
      );
    }
  }

  return root;
};

test('akzeptiert eine sauber Content-first hergeleitete Motion-Core-Animation', () => {
  const root = makeRoot();
  try {
    execFileSync(process.execPath, [validator, root], {stdio: 'pipe'});
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('blockiert fehlendes Visual-QA-Gate bei neuen Motion-Core-Reels', () => {
  const root = makeRoot({}, {withVisualQa: false});
  try {
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /visual-qa\.md|QA-Gate/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('blockiert eine Animation ohne konkrete Mechanik-Begründung', () => {
  const root = makeRoot({mechanismRationale: 'passt'});
  try {
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /mechanismRationale/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('blockiert Template-Reuse ohne inhaltliche Best-Fit-Begründung', () => {
  const root = makeRoot({
    reuseDecision: 'reuse-best-fit',
    reusedTechniqueId: 'loan-split-bar',
    reuseJustification: 'none',
  });
  try {
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /reuseJustification|Wiederverwendung/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('akzeptiert begründete Wiederverwendung, wenn sie für den Inhalt der beste Fit ist', () => {
  const root = makeRoot({
    reuseDecision: 'reuse-best-fit',
    reusedTechniqueId: 'loan-split-bar',
    reuseJustification: 'Der direkte Vergleich zur vorherigen Kredit-Szene ist nur mit derselben sichtbaren Teilungsmechanik sofort verständlich.',
  });
  try {
    execFileSync(process.execPath, [validator, root], {stdio: 'pipe'});
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('blockiert fehlenden Eintrag im Mechanik-Ledger', () => {
  const root = makeRoot({}, {ledger: 'SCENE_ID | MECHANIC_ID\nscene-99 | fn-other-mechanic\n'});
  try {
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /motion-mechanic-ledger|fehlt im/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('blockiert neue Motion-Core-Animation ohne src/motion-Import', () => {
  const root = makeRoot({}, {
    source: "import {interpolate} from 'remotion';\nexport const Scene02Animation = () => null;\n",
  });
  try {
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /src\/motion/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('blockiert alte Core-Primitives aus src/design-system bei Motion-Core-V1-Reels', () => {
  const root = makeRoot({}, {
    source: "import {PhysicalAccount, PremiumPhysicalStage} from '../../../../../../../src/design-system';\nimport {FN_MOTION} from '../../../../../../../src/motion';\nexport const Scene02Animation = () => null;\n",
  });
  try {
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /src\/design-system|Core-Primitives/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('älterer V1-Vertrag ohne Motion-Core-Erweiterung bleibt rückwärtskompatibel', () => {
  const root = makeRoot({}, {withMotionCore: false});
  try {
    execFileSync(process.execPath, [validator, root], {stdio: 'pipe'});
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('ältere Reels ohne neuen Marker bleiben rückwärtskompatibel', () => {
  const root = makeRoot({}, {withContract: false, withMotionCore: false});
  try {
    execFileSync(process.execPath, [validator, root], {stdio: 'pipe'});
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});
