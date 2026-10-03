#!/usr/bin/env node

import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-future-reel-phase1-motion-direction-v1.mjs <Reel-Pfad>');
  process.exit(1);
}

const CONTRACT_ID = 'finanzneo-phase1-hybrid-motion-v2';
const LIBRARY_ID = 'finanzneo-finance-motion-library-v1';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const read = (path) => readFileSync(path, 'utf8');
const write = (path, content) => writeFileSync(path, content.endsWith('\n') ? content : `${content}\n`, 'utf8');
const index = JSON.parse(read(indexPath));
const scenes = Array.isArray(index.scenes) ? index.scenes : [];

index.phase1MotionDirectionContract = {
  id: CONTRACT_ID,
  financeMotionLibraryId: LIBRARY_ID,
  appliesToNewReelsOnly: true,
  legacyReelsUntouched: true,
  analyzeSpokenPointBeforeTechnique: true,
  viewerUnderstandingBeforeImplementation: true,
  visualQuestionBeforeTechnique: true,
  mechanismDerivedFromContent: true,
  librarySearchAfterMechanismDefinition: true,
  libraryBestFitPreferred: true,
  libraryUseNeverForced: true,
  customBuildAllowed: true,
  reusableCustomMechanicsMayBecomeLibraryCandidates: true,
  parametersMustFollowSceneContent: true,
  supportAssetsCannotDriveSceneConcept: true,
  phase1DirectionMustPrecedeMotionDesign: true,
  phase1DirectionMustPrecedeAnimationCode: true,
  motionArtDirectorSkill: '.agents/plugins/finanzneo-motion/skills/motion-art-director/SKILL.md',
  visualQaGateRequiredBeforePhase3Render: true,
};

index.scenes = scenes.map((scene) => {
  if (scene.type !== 'animation') return scene;
  const existing = scene.phase1MotionDirection && typeof scene.phase1MotionDirection === 'object'
    ? scene.phase1MotionDirection
    : {};
  return {
    ...scene,
    phase1MotionDirection: {
      spokenPoint: existing.spokenPoint ?? '[EINFÜGEN — konkrete finanzielle Aussage dieser Szene]',
      viewerMustUnderstand: existing.viewerMustUnderstand ?? '[EINFÜGEN — was der Zuschauer danach sichtbar verstanden haben muss]',
      visualQuestion: existing.visualQuestion ?? '[EINFÜGEN — welche sichtbare Frage muss die Animation beantworten?]',
      chosenMechanism: existing.chosenMechanism ?? '[EINFÜGEN — konkrete sichtbare Hauptmechanik, noch ohne Tool-first-Logik]',
      mechanismRationale: existing.mechanismRationale ?? '[EINFÜGEN — warum erklärt genau diese Mechanik diesen Sprechpunkt am besten?]',
      implementationDecision: existing.implementationDecision ?? 'custom-build',
      financeMotionId: existing.financeMotionId ?? 'none',
      libraryFitReason: existing.libraryFitReason ?? 'none',
      parameterPlan: existing.parameterPlan ?? 'none',
      customReason: existing.customReason ?? '[EINFÜGEN — warum keine vorhandene Library-Mechanik ausreichend passt]',
      libraryPromotionCandidate: existing.libraryPromotionCandidate ?? false,
    },
  };
});

write(indexPath, JSON.stringify(index, null, 2));

const projectDir = resolve(root, '05-projektdateien');
mkdirSync(projectDir, {recursive: true});
write(resolve(projectDir, 'phase1-motion-direction-v1.md'), `# Phase 1 Hybrid Motion Direction V2\n\nPHASE1_MOTION_DIRECTION: ${CONTRACT_ID}\nFINANCE_MOTION_LIBRARY: ${LIBRARY_ID}\n\n## Verbindliche Reihenfolge\n\nSprechpunkt analysieren -> sichtbares Verständnisziel -> visuelle Frage -> beste Hauptmechanik definieren -> Finance Motion Library auf echten Best-Fit prüfen -> Library parametrisieren ODER individuell bauen -> motionDesign -> animation.tsx.\n\n## Library ist Werkzeug, kein Käfig\n\nDie Library wird erst geprüft, nachdem die inhaltlich richtige Mechanik feststeht. Passt eine vorhandene Finance-Motion-Mechanik semantisch wirklich, wird sie bevorzugt und mit szenenspezifischen Parametern verwendet. Passt keine ausreichend gut, wird ohne Umweg eine individuelle Animation gebaut.\n\n## Wiederverwendung\n\nEine gute Mechanik darf innerhalb eines Reels und über viele Reels hinweg wiederverwendet werden. Wiederholung ist erlaubt, wenn die Finanzlogik dieselbe ist; nur Werte, Labels, Gewichtungen, Richtung, Timing oder andere echte Inhaltsparameter ändern sich. Künstliche Einmaligkeit ist kein Qualitätsmerkmal.\n\n## Wachstum der Library\n\nEine individuell gebaute Animation kann als libraryPromotionCandidate markiert werden, wenn ihre Mechanik verallgemeinerbar und parametrisiert wiederverwendbar ist. Nicht jede Custom-Animation muss in die Library.\n\n## Art Direction + Visual QA\n\nNach der inhaltlich/technisch fertigen Animation prüft der Motion Art Director Proportionen, Materialität, Tiefe, Perspektive, Blickführung, Kamera und RESULT HOLD. Danach prüft Playwright START, TRIGGER, MID-MECHANISM, NEAR RESULT und FINAL RESULT HOLD. Vor Phase-3-Render müssen beide Gates in \`visual-qa.md\` explizit PASS sein. Das gilt für Library-Best-Fit und Custom-Build gleichermaßen.\n\n## Pflichtfelder\n\nJede Animationsszene dokumentiert spokenPoint, viewerMustUnderstand, visualQuestion, chosenMechanism, mechanismRationale, implementationDecision, financeMotionId, libraryFitReason, parameterPlan, customReason und libraryPromotionCandidate.\n`);

const visualQaPath = resolve(projectDir, 'visual-qa.md');
if (!existsSync(visualQaPath)) {
  const animationRows = scenes
    .filter((scene) => scene.type === 'animation')
    .map((scene) => `| ${scene.id} | START / TRIGGER / MID / NEAR RESULT / FINAL HOLD | PENDING |`)
    .join('\n');
  const imageRows = scenes
    .filter((scene) => scene.type === 'image')
    .map((scene) => `| ${scene.id} | stabiler Bildframe + Header/Caption/Safe-Zone | PENDING |`)
    .join('\n');

  write(visualQaPath, `# Visual QA\n\nPHASE1_MOTION_DIRECTION: ${CONTRACT_ID}\n\nMOTION_ART_DIRECTION=PENDING\nPLAYWRIGHT_VISUAL_QA=PENDING\n\nDiese Datei ist ein hartes Future-Reel-Gate. PASS erst nach echter Sichtprüfung in Remotion Studio/Playwright setzen. Metadaten oder Frame-0-Smoke allein reichen nicht.\n\n## Animationsszenen\n\n| SCENE | ZUSTÄNDE | STATUS |\n|---|---|---|\n${animationRows || '| none | - | PASS |'}\n\n## Bildszenen\n\n| SCENE | PRÜFUNG | STATUS |\n|---|---|---|\n${imageRows || '| none | - | PASS |'}\n\n## Art-Direction-Gate\n\nPrüfen: Hero-Größe, optische Zentrierung, Proportionen, Materialität, Tiefe, Perspektive, Blickführung, Kamera, Safe-Zones und sauberer RESULT HOLD. Nach echter Prüfung auf \`MOTION_ART_DIRECTION=PASS\` setzen.\n\n## Playwright-Gate\n\nAnimationsszenen mindestens an START, TRIGGER, MID-MECHANISM, NEAR RESULT und FINAL RESULT HOLD prüfen. Bildszenen an stabilem Frame prüfen. Nach echter Screenshot-/Pixelprüfung auf \`PLAYWRIGHT_VISUAL_QA=PASS\` setzen.\n\nBei einem Defekt bleibt der jeweilige Marker PENDING/FAIL und die Quelle wird korrigiert.\n`);
}

const append = (relativePath, heading, body) => {
  const path = resolve(root, relativePath);
  if (!existsSync(path)) return;
  const current = read(path);
  if (current.includes(`PHASE1_MOTION_DIRECTION: ${CONTRACT_ID}`)) return;
  write(path, `${current.trim()}\n\n## ${heading}\n\nPHASE1_MOTION_DIRECTION: ${CONTRACT_ID}\nFINANCE_MOTION_LIBRARY: ${LIBRARY_ID}\n\n${body}\n`);
};

append(
  '05-projektdateien/animationen.md',
  'Phase 1 Hybrid Motion Direction V2',
  'Erst Sprechpunkt -> Verständnisziel -> visuelle Frage -> beste Mechanik. Danach Finance Motion Library prüfen. Bei echtem Best-Fit library-best-fit + financeMotionId + konkrete parameterPlan verwenden; sonst custom-build. Gute Custom-Mechaniken dürfen später Library-Kandidaten werden.',
);
append(
  '05-projektdateien/szenenplan.md',
  'Phase 1 Hybrid Motion Direction V2',
  'Animationsszenen werden inhaltlich geplant. Die Library beschleunigt passende Standard-Finanzmechaniken, bestimmt aber nie den Sprechpunkt. Keine passende Library-Mechanik bedeutet individuelle Animation.',
);
append(
  '05-projektdateien/ANTIGRAVITY-AUFTRAG.md',
  'Phase 1 Motion Direction Lock',
  'Phase 3 verwendet exakt die in Phase 1 festgelegte Library-Mechanik mit Parametern oder den versiegelten Custom-Code. Phase 3 darf nicht eigenmächtig zwischen Library und Custom wechseln. Vor produktivem Render müssen Motion Art Direction und Playwright Visual QA dokumentiert PASS sein.',
);

console.log(`✓ Phase 1 Hybrid Motion Direction gesetzt: ${CONTRACT_ID}`);
console.log(`  Library: ${LIBRARY_ID}`);
console.log('  Inhalt -> Mechanik -> Library-Best-Fit oder Custom -> produktionsreifer Code.');
console.log('  Motion Art Direction + Playwright Visual QA werden als harte Preflight-Gates vorbereitet.');
console.log('  Bildwelt, Flow-Prompts und Bildszenen bleiben vollständig unberührt.');
