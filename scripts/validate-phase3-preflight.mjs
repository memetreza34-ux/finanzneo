#!/usr/bin/env node

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {resolveProjectPath, validatePhase3Manifest} from './lib/phase3-completion.mjs';
import {sceneIsData, sceneNeedsFlowImage} from './lib/reel-scene-schema.mjs';
import {
  REEL_BACKGROUND_CONTRACT_ID,
  validateCentralReelBackgroundContract,
  validatePhase3CompositionBackgroundSource,
} from './lib/reel-background-contract.mjs';

const [target, manifestPath] = process.argv.slice(2);
if (!target) {
  console.error('Nutzung: npm run reel:phase3:preflight -- <Reel-Pfad> [phase3-production-manifest.json]');
  process.exit(1);
}

const PRESENTATION_ID = 'finanzneo-future-reel-presentation-v1';
const MOTION_CORE_ID = 'finanzneo-motion-core-v1';

try {
  const result = validatePhase3Manifest(resolve(target), manifestPath ?? null);

  const compositionPath = resolveProjectPath(result.manifest.compositionSourcePath);
  const backgroundErrors = [
    ...validateCentralReelBackgroundContract(resolve('.')),
    ...validatePhase3CompositionBackgroundSource(compositionPath),
  ];
  if (backgroundErrors.length) {
    throw new Error(`Reel-Background-Vertrag ${REEL_BACKGROUND_CONTRACT_ID} verletzt:\n${backgroundErrors.map((error) => `- ${error}`).join('\n')}`);
  }

  const presentation = result.index.futurePresentationContract;
  if (presentation) {
    if (presentation.id !== PRESENTATION_ID) {
      throw new Error(`Unbekannter Future-Reel-Presentation-Vertrag: ${String(presentation.id)}`);
    }

    const source = readFileSync(compositionPath, 'utf8');
    const presentationErrors = [];
    if (!/<SceneHeader\b/.test(source)) presentationErrors.push('Finale Composition rendert keinen <SceneHeader>. Ab scene-02 ist der sichtbare Header inklusive Icon Pflicht.');
    if (!/<Captions\b/.test(source)) presentationErrors.push('Finale Composition rendert keine <Captions>. Caption-Metadaten allein reichen nicht.');
    if (!/<Audio\b/.test(source)) presentationErrors.push('Finale Composition rendert kein <Audio>. Voiceover muss Bestandteil derselben Composition sein.');

    const timingPath = resolve(result.root, '04-caption/word-timings.json');
    if (!existsSync(timingPath)) {
      presentationErrors.push('04-caption/word-timings.json fehlt.');
    } else {
      try {
        const timing = JSON.parse(readFileSync(timingPath, 'utf8'));
        const words = Array.isArray(timing.words)
          ? timing.words
          : (Array.isArray(timing.sentences) ? timing.sentences.flatMap((sentence) => Array.isArray(sentence?.words) ? sentence.words : []) : []);
        if (words.length === 0) presentationErrors.push('word-timings.json enthält keine echten Wörter; sichtbare Captions können so nicht garantiert werden.');
        if (!Array.isArray(timing.sentences) || timing.sentences.length === 0) presentationErrors.push('word-timings.json enthält keine satzbasierten Caption-Gruppen.');
      } catch (error) {
        presentationErrors.push(`word-timings.json ist ungültig: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    if (presentationErrors.length) {
      throw new Error(`Future Reel Presentation ${PRESENTATION_ID} verletzt:\n${presentationErrors.map((error) => `- ${error}`).join('\n')}`);
    }
  }

  const motionContract = result.index.phase1MotionDirectionContract;
  const motionCoreQaRequired = motionContract?.motionCoreVersion === MOTION_CORE_ID
    && motionContract?.visualQaGateRequiredBeforePhase3Render === true;

  if (motionCoreQaRequired) {
    const visualQaPath = resolve(result.root, '05-projektdateien/visual-qa.md');
    const visualQaErrors = [];
    if (!existsSync(visualQaPath)) {
      visualQaErrors.push('05-projektdateien/visual-qa.md fehlt.');
    } else {
      const visualQa = readFileSync(visualQaPath, 'utf8');
      if (!/^MOTION_ART_DIRECTION=PASS$/m.test(visualQa)) {
        visualQaErrors.push('Motion Art Direction ist nicht PASS. Vor Render Proportionen, Materialität, Tiefe, Perspektive, Blickführung und RESULT HOLD visuell prüfen.');
      }
      if (!/^PLAYWRIGHT_VISUAL_QA=PASS$/m.test(visualQa)) {
        visualQaErrors.push('Playwright Visual QA ist nicht PASS. Vor Render echte repräsentative Frames/Screenshots prüfen.');
      }
      const pendingRows = visualQa.split('\n').filter((line) => /^\|[^|]+\|[^|]+\|\s*(?:PENDING|FAIL)\s*\|\s*$/i.test(line));
      if (pendingRows.length) {
        visualQaErrors.push(`${pendingRows.length} Visual-QA-Szenenzeile(n) stehen noch auf PENDING/FAIL.`);
      }
    }
    if (visualQaErrors.length) {
      throw new Error(`Motion-Core Visual-QA-Gate verletzt:\n${visualQaErrors.map((error) => `- ${error}`).join('\n')}`);
    }
  }

  const images = result.scenes.filter((scene) => sceneNeedsFlowImage(scene)).length;
  const animations = result.scenes.filter((scene) => scene.type === 'animation').length;
  const datenszenen = result.scenes.filter((scene) => sceneIsData(scene)).length;
  console.log('\n✓ PHASE-3-PREFLIGHT BESTANDEN');
  console.log(`  ${result.scenes.length} Szenen vollständig implementiert · ${images} Bild · ${animations} Animation · ${datenszenen} Daten`);
  console.log(`  Timeline lückenlos: ${result.totalFrames} Frames`);
  console.log(`  Hintergrund: ${REEL_BACKGROUND_CONTRACT_ID} · statisch #000000 · keine Partikel/Aurora/Grid`);
  if (presentation) console.log('  Presentation V1: echte Composition enthält Audio + SceneHeader + Captions; echte Wort-Timings vorhanden.');
  if (motionCoreQaRequired) console.log('  Motion Core V1: Motion Art Direction + Playwright Visual QA sind dokumentiert PASS.');
  console.log('  Caption-only-Szenen sind laut Manifest verboten; Render-QA folgt nach dem Render.');
} catch (error) {
  console.error(`\n✗ ${error instanceof Error ? error.message : String(error)}`);
  console.error('\nReel ist NICHT renderfertig. Kein finales MP4 ausgeben.');
  process.exit(1);
}
