import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import {mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import test from 'node:test';

const compiler = resolve('scripts/compile-future-image-prompts-v5.mjs');
const validator = resolve('scripts/validate-future-image-storytelling-v5-hardening.mjs');
const CONTRACT = 'finanzneo-image-storytelling-v5';
const HARDENING = 'finanzneo-image-storytelling-v5-hardening-v1';

type Meta = {
  strategy: string;
  visualMode: string;
  sequenceRole: string;
  energyLevel: number;
  visualArchetype: string;
  locationFamily: string;
  locationClass: string;
  humanPresence: string;
  compositionFamily: string;
  mainSubjectFamily: string;
  mainSubjectClass: string;
  tableDocumentScene: boolean;
  literalSituation: string;
  contextAnchor: string;
  voiceVisualMatch: string;
  visualPurpose: string;
  storyAction: string;
  tensionOrConsequence: string;
  visualHook: string;
  shotScale: string;
  cameraAngle: string;
  depthPlan: string;
  emotionalBeat: string;
  causeEffect: string;
  patternInterrupt: string;
  patternInterruptType: string;
  motionHint: string;
  noveltyCheck: string;
  lightingVariation: string;
  labelBudget: number;
  labelBudgetJustification: string;
};

const baseMeta = (overrides: Partial<Meta> = {}): Meta => ({
  strategy: 'literal',
  visualMode: 'cause-effect',
  sequenceRole: 'hook',
  energyLevel: 5,
  visualArchetype: 'character-action',
  locationFamily: 'Küche',
  locationClass: 'home',
  humanPresence: 'single-person',
  compositionFamily: 'face-led',
  mainSubjectFamily: 'Gehaltsumschlag',
  mainSubjectClass: 'money',
  tableDocumentScene: false,
  literalSituation: 'Eine Person legt ihr Gehalt sichtbar neben die bereits wartenden Fixkosten.',
  contextAnchor: 'Monatlicher Haushalts-Cashflow direkt nach Gehaltseingang',
  voiceVisualMatch: 'Fixkosten greifen sichtbar auf den verfügbaren Geldbetrag zu.',
  visualPurpose: 'Druck der Fixkosten sofort verstehen',
  storyAction: 'Der verfügbare Geldstapel wird sichtbar kleiner, während Kosten ihn beanspruchen.',
  tensionOrConsequence: 'Ein großer Teil des Geldes ist sofort gebunden.',
  visualHook: 'Ein großer Geldstapel wird sichtbar von Kostenobjekten bedrängt.',
  shotScale: 'close-up',
  cameraAngle: 'low-angle',
  depthPlan: 'Kosten vorne, Geld zentral, Person klar dahinter.',
  emotionalBeat: 'Druck und sofortige Wiedererkennung',
  causeEffect: 'Gehalt kommt an und wird sichtbar durch Fixkosten reduziert.',
  patternInterrupt: 'starker Einstieg',
  patternInterruptType: 'reveal',
  motionHint: 'hard hold',
  noveltyCheck: 'PASS - eröffnet die Sequenz mit menschlicher Reaktion und engem Low-Angle.',
  lightingVariation: 'dramatic-low-key',
  labelBudget: 1,
  labelBudgetJustification: 'none',
  ...overrides,
});

const markerPrompt = (meta: Meta, body = 'Show the exact grounded finance situation with clear cause and effect.') => `VISUAL_STRATEGY: ${meta.strategy}
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

IMAGE PROMPT:
${body}

STYLE:
Locked FinanzNeo V9 world.
`;

const makeReel = (customize?: (metas: Meta[]) => void, bodies: string[] = []) => {
  const root = mkdtempSync(join(tmpdir(), 'finanzneo-v5-hardening-'));
  const write = (relative: string, content: string) => {
    const path = join(root, relative);
    mkdirSync(resolve(path, '..'), {recursive: true});
    writeFileSync(path, content, 'utf8');
  };

  const metas = [
    baseMeta(),
    baseMeta({
      visualMode: 'pov', sequenceRole: 'detail', energyLevel: 3, visualArchetype: 'pov',
      locationFamily: 'Supermarkt', locationClass: 'retail', humanPresence: 'hands-only', compositionFamily: 'object-led',
      mainSubjectFamily: 'Einkauf', mainSubjectClass: 'purchase', shotScale: 'macro', cameraAngle: 'top-down',
      patternInterrupt: 'Perspektive springt auf Hände und Einkauf', patternInterruptType: 'camera-change', lightingVariation: 'top-light',
      noveltyCheck: 'PASS - wechselt zu objektgeführtem Top-down-POV im Supermarkt.',
    }),
    baseMeta({
      visualMode: 'comparison', sequenceRole: 'contrast', energyLevel: 4, visualArchetype: 'comparison',
      locationFamily: 'Bahnsteig', locationClass: 'transport', humanPresence: 'multi-person', compositionFamily: 'comparison',
      mainSubjectFamily: 'Pendelkosten', mainSubjectClass: 'bill', shotScale: 'wide', cameraAngle: 'eye-level',
      patternInterrupt: 'Ort und Bildlogik wechseln in einen klaren Vergleich', patternInterruptType: 'location-change', lightingVariation: 'side-key',
      noveltyCheck: 'PASS - erster weiter Vergleich mit mehreren Personen und neuem Ort.',
    }),
    baseMeta({
      visualMode: 'object-story', sequenceRole: 'payoff', energyLevel: 2, visualArchetype: 'object-story',
      locationFamily: 'Arbeitsplatz', locationClass: 'work', humanPresence: 'hands-only', compositionFamily: 'process',
      mainSubjectFamily: 'Dauerauftrag', mainSubjectClass: 'savings', shotScale: 'medium', cameraAngle: 'over-shoulder',
      patternInterrupt: 'Ruhiger Prozess-Payoff', patternInterruptType: 'human-change', lightingVariation: 'warm-practical',
      noveltyCheck: 'PASS - ruhiger Prozess mit neuem Hauptmotiv, Ort und Over-Shoulder-Perspektive.',
    }),
  ];
  customize?.(metas);

  const contract = {
    id: CONTRACT,
    hardeningId: HARDENING,
    compiledDirectionInsideImagePromptRequired: true,
    explicitCreativeChoiceRequired: true,
    semanticFamilyClassesRequired: true,
    lightingVariationRequired: true,
    labelBudgetRequired: true,
    patternInterruptMustChangeVisualDimension: true,
    diversityWindowsRequired: true,
    tableDocumentPromptPlausibilityRequired: true,
    minDistinctArchetypesPerSixImages: 3,
    minDistinctCompositionFamiliesPerSixImages: 3,
    minDistinctCameraAnglesPerSixImages: 3,
    minDistinctLocationClassesPerSixImages: 3,
    minDistinctMainSubjectClassesPerSixImages: 3,
    maxLabelsWithoutJustification: 2,
  };
  const scenes = metas.map((meta, i) => ({
    id: `scene-0${i + 1}`,
    type: 'image',
    planFile: `EINZELNE-SZENEN/scene-0${i + 1}/bildprompt.txt`,
    imageStorytelling: meta,
  }));
  write('03-szenen/scene-index.json', JSON.stringify({imageStorytellingContract: contract, scenes}, null, 2));
  scenes.forEach((scene, i) => write(`03-szenen/${scene.planFile}`, markerPrompt(metas[i], bodies[i])));
  write('03-szenen/00-cover/cover.txt', markerPrompt(metas[0], bodies[0]));
  write('03-szenen/alle-bildprompts.txt', metas.map((meta, i) => markerPrompt(meta, bodies[i])).join('\n---\n'));
  return root;
};

test('Compiler schreibt V5-Regie in den echten IMAGE PROMPT und Hardening akzeptiert diverse Sequenz', () => {
  const root = makeReel();
  try {
    execFileSync(process.execPath, [compiler, root], {stdio: 'pipe'});
    execFileSync(process.execPath, [validator, root], {stdio: 'pipe'});
    const prompt = readFileSync(join(root, '03-szenen/EINZELNE-SZENEN/scene-01/bildprompt.txt'), 'utf8');
    assert.match(prompt, /V5_COMPILED_DIRECTION_START/);
    assert.match(prompt, /Camera: close-up, low-angle/);
    assert.match(prompt, /Lighting variation inside the locked V9 world: dramatic-low-key/);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('Hardening blockiert zu geringe Kamera-Diversität über 4 Bilder', () => {
  const root = makeReel((metas) => {
    metas[0].cameraAngle = 'eye-level';
    metas[1].cameraAngle = 'eye-level';
    metas[2].cameraAngle = 'top-down';
    metas[3].cameraAngle = 'top-down';
    metas[1].patternInterruptType = 'scale-change';
    metas[1].shotScale = 'macro';
  });
  try {
    execFileSync(process.execPath, [compiler, root], {stdio: 'pipe'});
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Camera Angles/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});

test('Hardening blockiert TABLE_DOCUMENT_SCENE=false bei Tisch plus Rechnung im echten Prompt', () => {
  const root = makeReel(undefined, ['A person sits at a desk with an invoice as the main visual language.']);
  try {
    execFileSync(process.execPath, [compiler, root], {stdio: 'pipe'});
    const result = spawnSync(process.execPath, [validator, root], {encoding: 'utf8'});
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /TABLE_DOCUMENT_SCENE=false/i);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});
