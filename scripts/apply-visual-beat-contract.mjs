#!/usr/bin/env node

import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-visual-beat-contract.mjs <Reel-Pfad>');
  process.exit(1);
}

const CONTRACT_ID = 'finanzneo-visual-beats-v2';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
index.visualBeatContract = {
  id: CONTRACT_ID,
  sceneCountFlexible: true,
  visualBeatCountFlexible: true,
  visualBeatPlanBeforeSceneCount: true,
  oneSpokenThoughtPerBeatRequired: true,
  splitMultiThoughtSentenceWhenHelpful: true,
  oneImagePerSentenceAllowed: true,
  oneImagePerSentencePreferredWhenItImprovesClarity: true,
  consecutiveImageScenesAllowedWhenMeaningAdvances: true,
  visualChangeWhenVoiceoverIntroducesNewConcreteIdea: true,
  extraImagePreferredOverOverloadedStill: true,
  staticImageBeatIdealSeconds: [1.8, 3.2],
  staticImageBeatHardMaxSeconds: 4.2,
  animationSceneTypicalSeconds: [3.0, 5.5],
  longerAnimationRequiresVisibleProgression: true,
  animationMustContainMultipleVisibleStates: true,
  visualMustAdvanceWithVoiceover: true,
  cameraMotionAloneDoesNotCountAsNewBeat: true,
  unchangedVisualAfterMessageUnderstoodForbidden: true,
  actualCutsFollowRealWordTimings: true,
  ratioIsGuidelineNotQuota: true,
};

index.timingStandard = {
  imageSceneIdealSeconds: [1.8, 3.2],
  imageSceneAbsoluteMaxSeconds: 4.2,
  animationSceneIdealSeconds: [3.0, 5.5],
  splitOrAnimateIfImageExceedsMax: true,
  visualBeatContractId: CONTRACT_ID,
  actualTimingSource: '04-caption/word-timings.json',
  cameraMotionDoesNotResetVisualBeat: true,
  newConcreteVoiceIdeaShouldTriggerVisualChange: true,
};

const scenes = Array.isArray(index.scenes) ? index.scenes : [];
index.scenes = scenes.map((scene) => {
  const planned = Number(scene.plannedDurationSeconds ?? scene.targetSeconds ?? 0);
  if (Array.isArray(scene.visualBeats) && scene.visualBeats.length > 0) {
    return {...scene, plannedDurationSeconds: planned};
  }
  return {
    ...scene,
    plannedDurationSeconds: planned,
    visualBeats: [{
      id: scene.id + '-beat-01',
      kind: scene.type === 'image' ? 'image' : 'animation-phase',
      voiceText: '[EINFÜGEN — genau dieser gesprochene Gedanke]',
      visualChange: '[EINFÜGEN — konkrete neue sichtbare Information oder Zustandsänderung]',
      startSecond: 0,
      endSecond: planned,
    }],
  };
});

writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

const projectDir = resolve(root, '05-projektdateien');
mkdirSync(projectDir, {recursive: true});
const beatPath = resolve(projectDir, 'visual-beats.md');
if (!existsSync(beatPath)) {
  writeFileSync(beatPath, `# Visual Beats\n\nVISUAL_BEAT_CONTRACT: ${CONTRACT_ID}\n\nPlanungsreihenfolge:\n\n1. gesprochene Gedanken bestimmen\n2. pro Gedanken einen sichtbaren Visual Beat festlegen\n3. zusätzliche Bilder einplanen, wenn ein Satz sonst visuell überladen oder zu lange statisch wäre\n4. erst danach Beats sinnvoll zu Szenen gruppieren\n5. finale Dauer aus echtem Voiceover ableiten\n\nRegeln:\n- Szenenzahl ist frei und richtet sich nach Thema und Rhythmus.\n- Ein gesprochener Gedanke braucht einen sichtbaren Beat.\n- Ein Satz darf und soll ein eigenes Bild bekommen, wenn das die Aussage schneller verständlich macht.\n- Führt das Voiceover einen neuen konkreten Gedanken ein, soll sich auch die sichtbare Information ändern.\n- Enthält ein Satz zwei Aktionen, Beispiele, einen Vergleich oder Vorher/Nachher, wird er bei Bedarf in mehrere Beats geteilt.\n- Statische Bilder ideal 1,8–3,2 s; ohne neue sichtbare Information maximal 4,2 s.\n- Mehrere Bildszenen nacheinander sind ausdrücklich erlaubt, wenn jedes Bild die Aussage sichtbar weiterführt.\n- Lieber ein zusätzliches gutes Bild als ein einziges überladenes oder langweilig lang stehendes Bild.\n- Kamera-Push oder Zoom allein zählt nicht als neuer Beat.\n- Animationen brauchen mehrere sichtbare Zustände und müssen mit dem Voiceover fortschreiten.\n\n[BEAT-PLAN IN PHASE 1 AUSFÜLLEN]\n`, 'utf8');
}

const scenePlanPath = resolve(projectDir, 'szenenplan.md');
if (existsSync(scenePlanPath)) {
  let scenePlan = readFileSync(scenePlanPath, 'utf8');
  if (!scenePlan.includes('VISUAL_BEAT_CONTRACT: ' + CONTRACT_ID)) {
    scenePlan += `\n## Visual-Beat-Timing\n\nVISUAL_BEAT_CONTRACT: ${CONTRACT_ID}\n\nNicht die Szenenzahl bestimmt den Rhythmus. Erst Voiceover-Gedanken und Visual Beats planen, dann Szenen gruppieren. Neue konkrete Aussage = möglichst neue sichtbare Information. Ein statisches Bild darf nicht weiterlaufen, nachdem seine Aussage bereits verstanden ist; lieber ein zusätzliches Bild als einen überladenen Still.\n`;
    writeFileSync(scenePlanPath, scenePlan, 'utf8');
  }
}

console.log('✓ Visual-Beat-Vertrag gesetzt: ' + CONTRACT_ID);
console.log('  Szenenzahl flexibel · zusätzliche Bilder ausdrücklich erlaubt · 1 Gedanke = 1 sichtbarer Beat.');
console.log('  Statischer Bildbeat ideal 1,8–3,2 s · ohne neue Information max. 4,2 s.');
console.log('  Bestehende V1-/Legacy-Reels werden nicht rückwirkend verändert.');
