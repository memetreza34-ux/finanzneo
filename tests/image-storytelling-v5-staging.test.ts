import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import test from 'node:test';

const compiler = resolve('scripts/compile-future-image-prompts-v5.mjs');
const validator = resolve('scripts/validate-future-image-storytelling-v5-staging.mjs');
const CONTRACT = 'finanzneo-image-storytelling-v5';
const HARDENING = 'finanzneo-image-storytelling-v5-hardening-v1';
const STAGING = 'finanzneo-image-storytelling-v5-staging-v1';

type Meta = Record<string, string | number | boolean>;

const baseMeta = (overrides: Meta = {}): Meta => ({
  strategy: 'literal', visualMode: 'cause-effect', sequenceRole: 'hook', energyLevel: 5,
  visualArchetype: 'cause-effect', locationFamily: 'Werkstatt', locationClass: 'services',
  humanPresence: 'single-person', compositionFamily: 'scale-reveal', mainSubjectFamily: 'Reparatur', mainSubjectClass: 'bill',
  tableDocumentScene: false, literalSituation: 'Eine Reparaturrechnung verdrängt sichtbar den verfügbaren Geldbetrag.',
  contextAnchor: 'Reale Werkstatt mit Fahrzeug und Reparatursituation', voiceVisualMatch: 'Die Kosten beanspruchen sichtbar das verfügbare Geld.',
  visualPurpose: 'Kostenfolge sofort fühlen', storyAction: 'Die große Reparaturrechnung drückt den kleinen Geldumschlag an den Bildrand.',
  tensionOrConsequence: 'Für andere Ausgaben bleibt sichtbar weniger Platz und Geld.', visualHook: 'Die Rechnung dominiert den Vordergrund und bedrängt das Geld.',
  shotScale: 'wide', cameraAngle: 'low-angle', depthPlan: 'Dominanter Vordergrund mit Rechnung, Hauptmotiv in der Mitte, Werkstatt hinten.',
  emotionalBeat: 'Druck', causeEffect: 'Reparaturkosten verdrängen sichtbar die verfügbare Rücklage.',
  patternInterrupt: 'starker Scale-Einstieg', patternInterruptType: 'scale-change', motionHint: 'slow push-in',
  noveltyCheck: 'PASS - aktiver räumlicher Kostendruck statt Objektanordnung.', lightingVariation: 'dramatic-low-key',
  labelBudget: 1, labelBudgetJustification: 'none', metaphorJustification: 'none',
  frameOccupancyClass: 'tight', stagingMode: 'active-collision', causeEffectStrength: 'explicit',
  humanReaction: 'pressured', humanReactionJustification: 'none', spatialPressure: 'foreground-dominant', impactComposition: 'low-angle-scale',
  ...overrides,
});

const prompt = (meta: Meta) => `VISUAL_STRATEGY: ${meta.strategy}
VISUAL_MODE: ${meta.visualMode}
SEQUENCE_ROLE: ${meta.sequenceRole}
ENERGY_LEVEL: ${meta.energyLevel}
VISUAL_ARCHETYPE: ${meta.visualArchetype}
LOCATION_FAMILY: ${meta.locationFamily}
LOCATION_CLASS: ${meta.locationClass}
HUMAN_PRESENCE: ${meta.humanPresence}
COMPOSITION_FAMILY: ${meta.compositionFamily}
MAIN_SUBJECT_FAMILY: ${meta.mainSubjectFamily}
MAIN_SUBJECT_CLASS: ${meta.mainSubjectClass}
TABLE_DOCUMENT_SCENE: ${meta.tableDocumentScene}
LITERAL_REAL_WORLD_SITUATION: ${meta.literalSituation}
REAL_WORLD_CONTEXT_ANCHOR: ${meta.contextAnchor}
VOICEOVER_VISUAL_MATCH: ${meta.voiceVisualMatch}
VISUAL_PURPOSE: ${meta.visualPurpose}
STORY_ACTION: ${meta.storyAction}
TENSION_OR_CONSEQUENCE: ${meta.tensionOrConsequence}
VISUAL_HOOK: ${meta.visualHook}
SHOT_SCALE: ${meta.shotScale}
CAMERA_ANGLE: ${meta.cameraAngle}
DEPTH_PLAN: ${meta.depthPlan}
EMOTIONAL_BEAT: ${meta.emotionalBeat}
CAUSE_EFFECT: ${meta.causeEffect}
PATTERN_INTERRUPT: ${meta.patternInterrupt}
PATTERN_INTERRUPT_TYPE: ${meta.patternInterruptType}
MOTION_HINT: ${meta.motionHint}
NOVELTY_CHECK: ${meta.noveltyCheck}
LIGHTING_VARIATION: ${meta.lightingVariation}
LABEL_BUDGET: ${meta.labelBudget}
LABEL_BUDGET_JUSTIFICATION: ${meta.labelBudgetJustification}
FRAME_OCCUPANCY_CLASS: ${meta.frameOccupancyClass}
STAGING_MODE: ${meta.stagingMode}
CAUSE_EFFECT_STRENGTH: ${meta.causeEffectStrength}
HUMAN_REACTION: ${meta.humanReaction}
HUMAN_REACTION_JUSTIFICATION: ${meta.humanReactionJustification}
SPATIAL_PRESSURE: ${meta.spatialPressure}
IMPACT_COMPOSITION: ${meta.impactComposition}

IMAGE PROMPT:
Show the exact real-world situation with visible physical cause and consequence.

STYLE:
Locked FinanzNeo V9 world.
`;

const makeReel = (customize?: (metas: Meta[]) => void) => {
  const root = mkdtempSync(join(tmpdir(), 'finanzneo-v51-staging-'));
  const write = (relative: string, content: string) => {
    const path = join(root, relative);
    mkdirSync(resolve(path, '..'), {recursive: true});
    writeFileSync(path, content, 'utf8');
  };
  const metas = [
    baseMeta(),
    baseMeta({
      sequenceRole: 'detail', visualArchetype: 'pov', locationFamily: 'Supermarkt', locationClass: 'retail',
      humanPresence: 'hands-only', compositionFamily: 'object-led', mainSubjectFamily: 'Einkauf', mainSubjectClass: 'purchase',
      shotScale: 'close-up', cameraAngle: 'pov', lightingVariation: 'top-light', stagingMode: 'active-use',
      humanReaction: 'concerned', spatialPressure: 'subject-dominant', impactComposition: 'strong-pov',
      patternInterruptType: 'camera-change', patternInterrupt: 'POV-Wechsel', causeEffectStrength: 'explicit',
    }),
    baseMeta({
      sequenceRole: 'contrast', visualMode: 'comparison', visualArchetype: 'comparison', locationFamily: 'Wohnung', locationClass: 'home',
      humanPresence: 'multi-person', compositionFamily: 'comparison', mainSubjectFamily: 'Haushalt', mainSubjectClass: 'housing',
      shotScale: 'wide', cameraAngle: 'eye-level', lightingVariation: 'warm-practical', frameOccupancyClass: 'environmental',
      stagingMode: 'comparison-action', causeEffectStrength: 'implied', humanReaction: 'surprised', spatialPressure: 'environmental-depth',
      impactComposition: 'environment-wide', patternInterruptType: 'location-change', patternInterrupt: 'echter Ortswechsel',
    }),
    baseMeta({
      sequenceRole: 'payoff', visualMode: 'object-story', visualArchetype: 'object-story', locationFamily: 'Küche', locationClass: 'home',
      humanPresence: 'hands-only', compositionFamily: 'process', mainSubjectFamily: 'Rücklage', mainSubjectClass: 'savings',
      shotScale: 'medium', cameraAngle: 'over-shoulder', lightingVariation: 'soft-key', frameOccupancyClass: 'balanced',
      stagingMode: 'payoff-action', causeEffectStrength: 'explicit', humanReaction: 'relieved', spatialPressure: 'balanced-depth',
      impactComposition: 'foreground-blocking', depthPlan: 'Rücklage klar im Vordergrund, Hände in der Mitte, Küche hinten.',
      patternInterruptType: 'human-change', patternInterrupt: 'ruhiger Payoff',
    }),
  ];
  customize?.(metas);

  const contract = {
    id: CONTRACT, hardeningId: HARDENING, stagingId: STAGING,
    dynamicStagingRequired: true, frameOccupancyRequired: true, explicitCauseEffectQuotaRequired: true,
    humanReactionRequired: true, spatialPressureRequired: true, impactCompositionQuotaRequired: true,
    catalogArrangementForbidden: true, minExplicitCauseEffectPerSixImages: 3,
    maxImagesWithoutImpactComposition: 3, minDistinctStagingModesPerSixImages: 3,
  };
  const scenes = metas.map((meta, i) => ({id: `scene-0${i + 1}`, type: 'image', planFile: `EINZELNE-SZENEN/scene-0${i + 1}/bildprompt.txt`, imageStorytelling: meta}));
  write('03-szenen/scene-index.json', JSON.stringify({imageStorytellingContract: contract, scenes}, null, 2));
  scenes.forEach((scene, i) => write(`03-szenen/${scene.planFile}`, prompt(metas[i])));
  write('03-szenen/00-cover/cover.txt', prompt(metas[0]));
  write('03-szenen/alle-bildprompts.txt', metas.map(prompt).join('\n---\n'));
  return root;
};

test('V5.1 compiler schreibt Dynamic Staging direkt in IMAGE PROMPT und Validator akzeptiert starke Sequenz', () => {
  const root = makeReel();
  try {
    execFileSync(process.execPath, [compiler, root], {stdio: 'pipe'});
    execFileSync(process.execPath, [validator, root], {stdio: 'pipe'});
    const source = readFileSync(join(root, '03-szenen/EINZELNE-SZENEN/scene-01/bildprompt.txt'), 'utf8');
    assert.match(source, /Dynamic staging mode: active-collision/);
    assert.match(source, /Frame occupancy: tight/);
    assert.match(source, /Cause\/effect strength: explicit/);
    assert.match(source, /Human reaction: pressured/);
    assert.match(source, /do not neatly arrange all explanatory objects side by side like a catalog display/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('V5.1 blockiert vier Bilder ohne Impact Composition', () => {
  const root = makeReel((metas) => metas.forEach((meta) => { meta.impactComposition = 'none'; }));
  try {
    execFileSync(process.execPath, [compiler, root], {stdio: 'pipe'});
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /keine echte IMPACT_COMPOSITION/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('V5.1 blockiert zu wenig explizite Cause-Effect-Szenen', () => {
  const root = makeReel((metas) => metas.forEach((meta) => { meta.causeEffectStrength = 'implied'; }));
  try {
    execFileSync(process.execPath, [compiler, root], {stdio: 'pipe'});
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /explicit Cause\/Effect/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('V5.1 verlangt Begründung für neutrale sichtbare Menschen', () => {
  const root = makeReel((metas) => {
    metas[0].humanReaction = 'neutral-justified';
    metas[0].humanReactionJustification = 'none';
  });
  try {
    execFileSync(process.execPath, [compiler, root], {stdio: 'pipe'});
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /neutral-justified braucht/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});
