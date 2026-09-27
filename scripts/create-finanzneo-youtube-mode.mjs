#!/usr/bin/env node
import {existsSync, readFileSync, readdirSync, statSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const args = process.argv.slice(2);
const valueOf = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};

const mode = valueOf('--mode');
const target = valueOf('--target');
const title = valueOf('--title');
const typesArg = valueOf('--types');
const visualCountArg = valueOf('--visual-count');

const allowedModes = ['images-only', 'hybrid'];
const phaseAAllowedTypes = new Set(['image', 'hybrid', 'data', 'real-asset']);
if (!mode || !allowedModes.includes(mode)) {
  console.error(`--mode muss enthalten: ${allowedModes.join(' | ')}`);
  process.exit(1);
}
if (!target || !title) {
  console.error('Nutzung: npm run youtube:create:mode -- --mode <images-only|hybrid> --target youtube/<Projekt> --title "Titel" [--visual-count N | --types ...]');
  process.exit(1);
}

let types = typesArg;
if (mode === 'images-only') {
  if (typesArg && visualCountArg) {
    console.error('Phase A: entweder --visual-count für reine 3D-Storybilder ODER --types für eine gemischte statische Planung verwenden, nicht beides.');
    process.exit(1);
  }
  if (typesArg) {
    const requested = typesArg.split(',').map((value) => value.trim()).filter(Boolean);
    if (requested.length === 0) {
      console.error('Phase A: --types darf nicht leer sein.');
      process.exit(1);
    }
    const forbidden = requested.filter((type) => !phaseAAllowedTypes.has(type));
    if (forbidden.length > 0) {
      console.error(`Phase A erlaubt nur statische Typen: ${[...phaseAAllowedTypes].join(', ')}. Verboten/ungültig: ${forbidden.join(', ')}`);
      process.exit(1);
    }
    types = requested.join(',');
  } else {
    const visualCount = Number(visualCountArg);
    if (!Number.isInteger(visualCount) || visualCount < 1) {
      console.error('Phase A benötigt entweder --visual-count mit einer ganzen Zahl >= 1 oder --types mit einer statischen Mischung.');
      process.exit(1);
    }
    types = Array.from({length: visualCount}, () => 'image').join(',');
  }
} else if (!typesArg) {
  console.error('hybrid benötigt --types, z. B. image,hybrid,animation,data,image.');
  process.exit(1);
}

const scaffold = spawnSync(process.execPath, [
  resolve('scripts/scaffold-finanzneo-youtube.mjs'),
  '--target', target,
  '--title', title,
  '--types', types,
], {encoding: 'utf8'});

if (scaffold.status !== 0) {
  process.stderr.write(scaffold.stderr || scaffold.stdout || 'Scaffolder fehlgeschlagen.\n');
  process.exit(scaffold.status ?? 1);
}

const root = resolve(target);
if (!existsSync(root)) {
  console.error(`Projektordner wurde nicht erzeugt: ${target}`);
  process.exit(1);
}

const sharedLayoutContract = {
  id: 'finanzneo-youtube-framed-scene-v2',
  frameWidth: 1920,
  frameHeight: 1080,
  sceneHeadingRequired: true,
  sceneIconRequired: true,
  flowImageFullscreenForbidden: true,
  flowImagePlacement: 'contained-visual-window',
  deepBlackFrameBackgroundVisibleForFlow: true,
  headingAndIconOutsideFlowImage: true,
  phaseAStaticUsesContainedVisualWindow: true,
  hybridPureRemotionMayUseFullFrame: true,
  hybridRemotionOverlayMayExtendBeyondFlowWindow: true,
  hybridFlowImageItselfRemainsContained: true,
  hybridMotionCanvas: 'full-1920x1080',
  motionSafeAreaPx: 64,
  unintentionalCroppingForbidden: true,
  criticalContentMustRemainInsideSafeArea: true,
  recommendedOuterMarginPx: 72,
  recommendedHeaderHeightPx: [150, 190],
  recommendedIconSizePx: [56, 72],
  recommendedVisualWindowMaxWidthRatio: 0.78,
  recommendedVisualWindowMaxHeightRatio: 0.70,
};

const phaseAContract = {
  id: 'images-only',
  semanticName: 'phase-a-static',
  animationDisabledOnly: true,
  staticImageVisualsOnly: false,
  staticSceneLayoutRequired: true,
  staticLayoutAssemblyAllowed: true,
  remotionExplainerVisualsAllowed: true,
  staticRemotionExplainerVisualsAllowed: true,
  staticDataVisualsAllowed: true,
  staticHybridOverlaysAllowed: true,
  remotionAnimationAllowed: false,
  allowedVisualTypes: ['image', 'hybrid', 'data', 'real-asset'],
  forbiddenVisualTypes: ['animation'],
  allowedStaticVisualKinds: ['3d-story', '3d-explainer', 'static-data', 'real-asset'],
  assemblyIntent: 'static-framed-layout-sequence-with-voiceover',
  oneMainIdeaPerVisual: true,
  recommendedVoiceoverSentencesPerImage: [1, 2],
  exactTextAndNumbersInStaticLayoutAllowed: true,
  flowImageRequiredForEveryScene: false,
  mixIsHardQuota: false,
  layoutContractId: sharedLayoutContract.id,
};

const phaseBContract = {
  id: 'hybrid',
  staticImageVisualsOnly: false,
  staticLayoutAssemblyAllowed: true,
  remotionExplainerVisualsAllowed: true,
  remotionAnimationAllowed: true,
  fullFrameRemotionAllowed: true,
  fullFrameFlowForbidden: true,
  hybridOverlayMayUseFullFrame: true,
  allowedVisualTypes: ['image', 'hybrid', 'animation', 'data', 'real-asset'],
  assemblyIntent: 'script-first-content-first-earned-motion',
  oneMainIdeaPerVisual: true,
  recommendedVoiceoverSentencesPerImage: [1, 2],
  visualBalanceGuidance: {
    hardQuota: false,
    percentageTargetsForbidden: true,
    diagnosticOnly: true,
    rule: 'Never add motion or hybrid merely to hit a mix. The script determines the mix.',
  },
  motionGate: {
    motionMustExplainTemporalChangeOrDirectAttention: true,
    animationMustBeatStaticAlternative: true,
    strongStaticImageMayReplaceAnimation: true,
    staticDiagramMayReplaceAnimation: true,
    weakAnimationMustBeDowngraded: true,
    motionForMotionSakeForbidden: true,
  },
  hybridOverlapGuard: {
    imageAndMotionNeedDistinctJobs: true,
    semanticOverlapForbidden: true,
    motionMustNotRepeatWhatImageAlreadyExplains: true,
    imageMustNotRepeatWhatMotionAlreadyExplains: true,
    ifRolesOverlapChooseSingleStrongerMedium: true,
  },
  scriptVisualPlanning: {
    standardId: 'finanzneo-youtube-script-visual-planning-v1',
    planVisualBeforeFinalizingEachScriptBeat: true,
    eachBeatNeedsVisualIntent: true,
    eachMotionBeatNeedsStaticAlternative: true,
    eachHybridBeatNeedsDivisionOfLabor: true,
    rewriteWeaklyVisualizableScriptBeat: true,
    factsMustNotBeDistortedForVisualConvenience: true,
  },
  visualVarietyGuard: {
    sameVisualLogicRepeatedWithoutReasonForbidden: true,
    adjacentRepeatedTemplateNeedsReason: true,
    varietyServesClarityNotNovelty: true,
  },
  humanUsageGuidance: {
    recommendedMaxShare: 0.4,
    hardLimit: false,
    useOnlyWhen: ['reaction', 'choice', 'attention', 'consequence'],
    avoidRepeatedHumanTemplate: true,
  },
  abstractionGuard: {
    abstractOnlySceneNeedsClearExplanatoryAdvantage: true,
    avoidMultipleAbstractSchemasInARow: true,
    preferConcreteAnchorWhenMeaningWouldOtherwiseBeAmbiguous: true,
    staticDiagramOrExamplePreferredWhenMotionAddsNoValue: true,
  },
  layoutContractId: sharedLayoutContract.id,
};

const modeContract = mode === 'images-only' ? phaseAContract : phaseBContract;

writeFileSync(resolve(root, '06-projektdateien/production-mode.json'), `${JSON.stringify(modeContract, null, 2)}\n`);
writeFileSync(resolve(root, '06-projektdateien/layout-contract.json'), `${JSON.stringify(sharedLayoutContract, null, 2)}\n`);

const scriptVisualPlan = `# Script + Visual Plan\n\nSTANDARD: finanzneo-youtube-script-visual-planning-v1\nPRODUCTION_MODE: ${mode}\n\nDas Skript wird erst gelockt, wenn jeder Beat visuell geplant ist.\n\n## Pflicht pro Beat\n\n- CORE_MESSAGE:\n- VOICEOVER:\n- VISUAL_FORM: image | static-explainer | hybrid | animation | real-asset\n- VISUAL_IDEA:\n- WHY_THIS_FORM:\n- STATIC_ALTERNATIVE:\n- MOTION_VALUE: nur wenn Motion echten Mehrwert hat\n- IMAGE_JOB: nur bei Hybrid\n- MOTION_JOB: nur bei Hybrid\n- OVERLAP_CHECK: PASS nur wenn Bild und Motion verschiedene Jobs haben\n- VARIETY_CHECK: keine unnötige Wiederholung der letzten Szenen\n\n## Regeln\n\n1. Zuerst die stärkste statische Lösung suchen.\n2. Animation nur behalten, wenn Bewegung klarer erklärt als die statische Alternative.\n3. Starkes Bild, Diagramm, Beispiel oder Vergleich darf schwache Animation ersetzen.\n4. Bild + Remotion nur bei klar getrennter Aufgabenteilung.\n5. Wenn Bild und Motion dasselbe sagen, nur das stärkere Medium behalten.\n6. Keine Quote für Motion/Hybrid erfüllen.\n7. Script-Beat umschreiben oder teilen, wenn er keine klare Visualisierung zulässt.\n8. Fakten niemals für Visuals verbiegen.\n`;
writeFileSync(resolve(root, '06-projektdateien/script-visual-plan.md'), scriptVisualPlan);

const staticKindForType = (type) => {
  if (type === 'hybrid') return '3d-explainer';
  if (type === 'data') return 'static-data';
  if (type === 'real-asset') return 'real-asset';
  return '3d-story';
};

const staticExplainerSource = (visual) => `import React from 'react';\nimport {AbsoluteFill} from 'remotion';\n\n/** PHASE A STATIC — keine Frame-Bewegung. */\nexport const ${visual.animationExport}: React.FC = () => (\n  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>\n    <div>[EINFÜGEN: STATISCHE PHASE-A-ERKLÄRUNG]</div>\n  </AbsoluteFill>\n);\n`;

const staticExplainerPlan = (visual) => `# Static-Remotion-Spezifikation ${visual.id}\n\nPRODUCTION_MODE: images-only\nMOTION_PRESET: STATIC\nANIMATION_DISABLED: true\n\n- Kapitel: [CHAPTER]\n- Sprechtext-Bezug: [SCRIPT BEAT]\n- Message: [WHAT MUST THE VIEWER UNDERSTAND?]\n- Static Visual Kind: ${staticKindForType(visual.type)}\n- Exact Text / Numbers: [ONLY THE EXACT SHORT CONTENT THAT IMPROVES COMPREHENSION]\n- Layout: [WHERE THE STATIC EXPLAINER SITS INSIDE THE CONTAINED VISUAL WINDOW]\n- Reason: [WHY THIS STATIC EXPLAINER IS CLEARER THAN A PURE 3D STORY]\n\nVerboten: useCurrentFrame(), interpolate(), spring(), CSS animation/transition oder jede Frame-zu-Frame-Bewegung.\n`;

const indexPath = resolve(root, '04-visuals/visual-index.json');
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
index.productionMode = modeContract;
index.layoutContract = sharedLayoutContract;
index.scriptVisualPlanning = {
  standardId: 'finanzneo-youtube-script-visual-planning-v1',
  planFile: '06-projektdateien/script-visual-plan.md',
  scriptAndVisualDesignedTogether: true,
  staticAlternativeRequiredBeforeMotion: mode === 'hybrid',
  hybridSemanticOverlapForbidden: mode === 'hybrid',
};
index.thumbnail = {
  ...(index.thumbnail ?? {}),
  finalCoverTextRequired: true,
  headlineMustBePresentBeforeFinalExport: true,
  noTextThumbnailForbiddenAsFinal: true,
};

if (mode === 'images-only') {
  index.phaseA = {
    id: 'finanzneo-youtube-phase-a-static-v1',
    animationAllowed: false,
    imageWorldUnchanged: true,
    imageWorldId: 'finanzneo-youtube-grounded-3d-black-v1',
    allowedStaticVisualKinds: phaseAContract.allowedStaticVisualKinds,
    exactTextAndNumbersUseStaticRemotion: true,
    mixIsHardQuota: false,
  };

  for (const visual of index.visuals ?? []) {
    visual.phaseAVisualKind = staticKindForType(visual.type);
    if (visual.type === 'hybrid' || visual.type === 'data') {
      visual.animationDisabled = true;
      visual.motionPreset = 'STATIC';
      visual.viewerChange = 'No frame-to-frame movement; meaning is conveyed by the static composition.';
      visual.advancedReason = '';
      visual.toolStack = ['Remotion', 'static'];
      if (visual.animationSourceFile) writeFileSync(resolve(root, visual.animationSourceFile), staticExplainerSource(visual));
      if (visual.planFile) writeFileSync(resolve(root, visual.planFile), staticExplainerPlan(visual));
    }
  }
} else {
  index.phaseB = {
    id: 'finanzneo-youtube-phase-b-hybrid-v3-earned-motion',
    contentFirst: true,
    scriptFirstVisualPlanning: true,
    imageWorldUnchanged: true,
    imageWorldId: 'finanzneo-youtube-grounded-3d-black-v1',
    pureRemotionMayUseFullFrame: true,
    flowImageFullscreenForbidden: true,
    imagePlusRemotionAllowedOnlyWhenRolesDiffer: true,
    staticAlternativeRequiredBeforeMotion: true,
    strongStaticMayReplaceWeakAnimation: true,
    visualBalanceGuidance: phaseBContract.visualBalanceGuidance,
    motionGate: phaseBContract.motionGate,
    hybridOverlapGuard: phaseBContract.hybridOverlapGuard,
    scriptVisualPlanning: phaseBContract.scriptVisualPlanning,
    visualVarietyGuard: phaseBContract.visualVarietyGuard,
    humanUsageGuidance: phaseBContract.humanUsageGuidance,
    abstractionGuard: phaseBContract.abstractionGuard,
    motionSafeAreaPx: 64,
    unintentionalCroppingForbidden: true,
  };
}

writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);

const readmePath = resolve(root, 'README.md');
const readme = readFileSync(readmePath, 'utf8');
writeFileSync(readmePath, `${readme.trimEnd()}\n\n## Production Mode\n\nPRODUCTION_MODE: ${mode}\nLAYOUT_CONTRACT: ${sharedLayoutContract.id}\nSCRIPT_VISUAL_PLAN: 06-projektdateien/script-visual-plan.md\nTHUMBNAIL: finaler Cover-Text ist Pflicht vor Export.\n\n${mode === 'images-only'
  ? 'Phase A bleibt vollständig statisch. Flow-Bilder sind contained und nie fullscreen; statische Remotion-Erklärungen sind erlaubt.'
  : 'Phase B nutzt Earned Motion: Script und Visual zusammen planen, zuerst starke statische Alternative prüfen, Animation nur bei echtem Bewegungsmehrwert. Bild+Remotion nur bei klar getrennten Jobs ohne semantische Überlappung. Starke Bilder, Diagramme, Beispiele oder Vergleiche dürfen schwache Animation ersetzen. Keine Motion-Quote. Reine Remotion darf die komplette 1920×1080-Fläche nutzen; Flow-Bilder bleiben contained. Kritische Inhalte innerhalb ca. 64 px Safe Area halten.'}\n`);

if (mode === 'images-only') {
  const replaceImageOnlyPolicy = (text) => text
    .replaceAll('REMOTION_OVERLAY_TEXT: [IMPORTANT TEXT/NUMBERS ADDED LATER, NOT GENERATED IN THE IMAGE]', 'STATIC_REMOTION_OVERLAY: [OPTIONAL EXACT SHORT LABELS / NUMBERS / ARROWS ADDED LATER WITHOUT ANIMATION. IF USED, RESERVE CLEAN NEGATIVE SPACE IN THE COMPOSITION.]')
    .replaceAll('Important explanatory text and numbers will be added later in Remotion.', 'Important exact explanatory text, numbers or arrows may be added later as static Remotion overlays without animation. If such an overlay is planned, reserve the exact clean negative-space area requested by the storyboard.')
    .replaceAll('Remotion owns explanatory text and numbers.', 'The final static video layout owns exact explanatory text and numbers. Flow remains the 3D story visual and may reserve clean negative space for a planned static overlay.')
    .replaceAll('Do not generate the headline inside the image.', 'Do not generate the scene heading or icon inside the Flow image. Exact explanatory text or numbers are added later by the static video layout when planned.');

  const rewriteTxtFiles = (directory) => {
    for (const entry of readdirSync(directory)) {
      const path = resolve(directory, entry);
      const stats = statSync(path);
      if (stats.isDirectory()) rewriteTxtFiles(path);
      else if (entry.endsWith('.txt')) {
        const original = readFileSync(path, 'utf8');
        const replaced = replaceImageOnlyPolicy(original);
        if (replaced !== original) writeFileSync(path, replaced);
      }
    }
  };
  rewriteTxtFiles(resolve(root, '04-visuals'));

  writeFileSync(
    resolve(root, '06-projektdateien/remotion-plan.md'),
    '# Static-Layout-Plan — Animation deaktiviert\n\nPRODUCTION_MODE: images-only\nLAYOUT_CONTRACT: finanzneo-youtube-framed-scene-v2\nIMAGE_WORLD: finanzneo-youtube-grounded-3d-black-v1\n\nPhase A bleibt statisch. Flow-Bilder dürfen niemals fullscreen sein. Statische Labels, Zahlen, Pfeile, Vergleiche und Mini-Charts sind erlaubt.\n',
  );
}

console.log(scaffold.stdout.trim());
console.log(`\n✓ Production Mode gesetzt: ${mode}`);
console.log(`  Layout: ${sharedLayoutContract.id} · finaler Thumbnail-Text Pflicht · Flow niemals fullscreen`);
console.log('  Script+Visual-Plan erzeugt: 06-projektdateien/script-visual-plan.md');
if (mode === 'images-only') console.log('  Phase A Static · keine Animation');
else console.log('  Phase B Earned Motion · statische Alternative zuerst · Hybrid nur ohne semantische Überlappung · keine Motion-Quote');
