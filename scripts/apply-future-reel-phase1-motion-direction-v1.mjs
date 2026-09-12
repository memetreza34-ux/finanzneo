#!/usr/bin/env node

import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-future-reel-phase1-motion-direction-v1.mjs <Reel-Pfad>');
  process.exit(1);
}

const CONTRACT_ID = 'finanzneo-phase1-individual-motion-v1';
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

index.scenes = scenes.map((scene) => {
  if (scene.type !== 'animation' || scene.phase1MotionDirection) return scene;
  return {
    ...scene,
    phase1MotionDirection: {
      spokenPoint: '[EINFÜGEN — konkrete finanzielle Aussage dieser Szene]',
      viewerMustUnderstand: '[EINFÜGEN — was der Zuschauer danach sichtbar verstanden haben muss]',
      visualQuestion: '[EINFÜGEN — welche sichtbare Frage muss die Animation beantworten?]',
      chosenMechanism: '[EINFÜGEN — konkrete sichtbare Hauptmechanik, noch ohne Tool-first-Logik]',
      mechanismRationale: '[EINFÜGEN — warum erklärt genau diese Mechanik diesen Sprechpunkt am besten?]',
      reuseDecision: 'invent-new',
      reusedTechniqueId: 'none',
      reuseJustification: 'none',
    },
  };
});

write(indexPath, JSON.stringify(index, null, 2));

const projectDir = resolve(root, '05-projektdateien');
mkdirSync(projectDir, {recursive: true});
write(resolve(projectDir, 'phase1-motion-direction-v1.md'), `# Phase 1 Motion Direction V1\n\nPHASE1_MOTION_DIRECTION: ${CONTRACT_ID}\n\n## Verbindliche Reihenfolge\n\nSprechpunkt analysieren -> sichtbares Verständnisziel -> visuelle Frage -> individuell beste Hauptmechanik -> passende Technik -> motionDesign -> animation.tsx.\n\n## Keine Animations-Auswahlliste\n\nBestehende Animationen, Komponenten, Lotties, Icons, SVGs oder frühere Mechaniken sind Werkzeuge und Referenzen, niemals das kreative Auswahlmenü. Jede Animationsszene wird in Phase 1 zuerst aus ihrem Inhalt hergeleitet.\n\n## Wiederverwendung\n\nWiederverwendung ist erlaubt, wenn dieselbe Mechanik für diesen Sprechpunkt wirklich die klarste Lösung ist, etwa für Vergleich oder bewusste Kontinuität. Dann reuseDecision=reuse-best-fit setzen, reusedTechniqueId angeben und reuseJustification konkret ausfüllen. Reuse nur aus Bequemlichkeit ist verboten.\n\n## Pflichtfelder\n\nJede Animationsszene dokumentiert phase1MotionDirection mit spokenPoint, viewerMustUnderstand, visualQuestion, chosenMechanism, mechanismRationale, reuseDecision, reusedTechniqueId und reuseJustification.\n`);

const append = (relativePath, heading, body) => {
  const path = resolve(root, relativePath);
  if (!existsSync(path)) return;
  const current = read(path);
  if (current.includes(`PHASE1_MOTION_DIRECTION: ${CONTRACT_ID}`)) return;
  write(path, `${current.trim()}\n\n## ${heading}\n\nPHASE1_MOTION_DIRECTION: ${CONTRACT_ID}\n\n${body}\n`);
};

append(
  '05-projektdateien/animationen.md',
  'Phase 1 Individual Motion Direction V1',
  'Vor motionDesign oder animation.tsx jede Animationsszene in dieser Reihenfolge herleiten: Sprechpunkt -> viewerMustUnderstand -> visualQuestion -> chosenMechanism -> mechanismRationale. Nicht aus einer vorhandenen Animationsliste auswählen. Bestehende Mechanik nur mit reuseDecision=reuse-best-fit und konkreter Begründung wiederverwenden.',
);
append(
  '05-projektdateien/szenenplan.md',
  'Phase 1 Individual Motion Direction V1',
  'Animationsszenen werden nicht nach verfügbaren Komponenten geplant. Erst die finanzielle Aussage und das sichtbare Verständnisziel bestimmen; daraus die individuelle Hauptmechanik entwickeln. Tools werden erst danach gewählt.',
);
append(
  '05-projektdateien/ANTIGRAVITY-AUFTRAG.md',
  'Phase 1 Motion Direction Lock',
  'Phase 3 darf die in Phase 1 hergeleitete Hauptmechanik nicht durch eine bequemere Standardanimation ersetzen. Lottie/Icon/SVG-Support darf ergänzen, aber nicht die kreative Hauptlogik austauschen.',
);

console.log(`✓ Phase 1 Motion Direction gesetzt: ${CONTRACT_ID}`);
console.log('  Inhalt -> Verständnisziel -> visuelle Frage -> individuelle Mechanik -> Technik.');
console.log('  Keine feste Animations-Auswahlliste; Wiederverwendung nur als begründeter Best-Fit.');
