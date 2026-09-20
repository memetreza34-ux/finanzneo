#!/usr/bin/env node

import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-future-reel-phase1-motion-direction-v1.mjs <Reel-Pfad>');
  process.exit(1);
}

const CONTRACT_ID = 'finanzneo-phase1-individual-motion-v1';
const MOTION_CORE_ID = 'finanzneo-motion-core-v1';
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
  ...(index.phase1MotionDirectionContract ?? {}),
  id: CONTRACT_ID,
  appliesToNewReelsOnly: true,
  legacyReelsUntouched: true,
  analyzeSpokenPointBeforeTechnique: true,
  viewerUnderstandingBeforeImplementation: true,
  visualQuestionBeforeTechnique: true,
  mechanismDerivedFromContent: true,
  noFixedAnimationMenu: true,
  semanticMechanicFamiliesNotTemplates: true,
  toolsFollowContent: true,
  templateReuseOnlyWhenBestFit: true,
  reuseNeedsExplicitJustification: true,
  supportAssetsCannotDriveSceneConcept: true,
  phase1DirectionMustPrecedeMotionDesign: true,
  phase1DirectionMustPrecedeAnimationCode: true,
  motionCoreVersion: MOTION_CORE_ID,
  canonicalMotionSource: 'src/motion',
  mechanicSelectionRule: '.agents/plugins/finanzneo-motion/rules/mechanic-selection.md',
  motionDirectorSkill: '.agents/plugins/finanzneo-motion/skills/remotion-director/SKILL.md',
  mechanicLedgerRequired: true,
  antiRepetitionGateRequired: true,
  coreReuseBeforeLocalPrimitive: true,
  legacyLabsNotStyleReference: true,
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
      mechanicId: existing.mechanicId ?? '[EINFÜGEN — eindeutiger lower-kebab-case Mechanik-Slug]',
      heroObject: existing.heroObject ?? '[EINFÜGEN — physisches Hauptobjekt]',
      supportObjects: existing.supportObjects ?? '[EINFÜGEN — sinnvolle Support-Objekte oder none]',
      primaryAction: existing.primaryAction ?? '[EINFÜGEN — konkrete physische Zustandsänderung]',
      motionAxis: existing.motionAxis ?? '[EINFÜGEN — dominante Bewegungsrichtung/Bewegungslogik]',
      resultType: existing.resultType ?? '[EINFÜGEN — sichtbarer Ergebnistyp]',
      uniquenessRationale: existing.uniquenessRationale ?? '[EINFÜGEN — warum wiederholt diese Szene keine andere Animation des Reels?]',
      reuseDecision: existing.reuseDecision ?? 'invent-new',
      reusedTechniqueId: existing.reusedTechniqueId ?? 'none',
      reuseJustification: existing.reuseJustification ?? 'none',
    },
  };
});

write(indexPath, JSON.stringify(index, null, 2));

const projectDir = resolve(root, '05-projektdateien');
mkdirSync(projectDir, {recursive: true});
write(resolve(projectDir, 'phase1-motion-direction-v1.md'), `# Phase 1 Motion Direction V1\n\nPHASE1_MOTION_DIRECTION: ${CONTRACT_ID}\nMOTION_CORE: ${MOTION_CORE_ID}\nCANONICAL_MOTION_SOURCE: src/motion\n\n## Verbindliche Reihenfolge\n\nSprechpunkt analysieren -> sichtbares Verständnisziel -> visuelle Frage -> physische Ursache/Wirkung -> eindeutige MECHANIC_ID -> Hero/Support -> individuell beste Hauptmechanik -> passende Technik -> motionDesign -> animation.tsx.\n\n## Motion Core ist kein Animations-Menü\n\n\`src/motion\` ist die kanonische technische Basis für Stage, Physical-Primitives, Timing und Springs. Die Mechanik-Familien sind semantische Ursache/Wirkungs-Referenzen, keine fertigen Layout-Schablonen. Bestehende Animationen, Lotties, Icons, SVGs oder frühere Mechaniken sind Werkzeuge und Referenzen, niemals das kreative Auswahlmenü. Jede Animationsszene wird zuerst aus ihrem Inhalt hergeleitet.\n\n## Wiederverwendung\n\nWiederverwendung ist erlaubt, wenn dieselbe Mechanik für diesen Sprechpunkt wirklich die klarste Lösung ist, etwa für Vergleich oder bewusste Kontinuität. Dann reuseDecision=reuse-best-fit setzen, reusedTechniqueId angeben und reuseJustification konkret ausfüllen. Reuse nur aus Bequemlichkeit ist verboten.\n\n## Anti-Wiederholung\n\nVor Code alle Animationsszenen des Reels in \`motion-mechanic-ledger.md\` vergleichen. Dieselbe MECHANIC_ID ist verboten. Wenn mindestens drei Kerndimensionen aus Hero, Primary Action, Motion Axis, Result Type und Mechanik-Familie übereinstimmen, die physische Erklärung neu entwerfen. Farbe, Text, Icon, Mirroring, Timing, Kamera oder Lottie-Akzent zählen nicht als neue Mechanik.\n\n## Pflichtfelder\n\nJede Animationsszene dokumentiert phase1MotionDirection mit spokenPoint, viewerMustUnderstand, visualQuestion, chosenMechanism, mechanismRationale, mechanicId, heroObject, supportObjects, primaryAction, motionAxis, resultType, uniquenessRationale, reuseDecision, reusedTechniqueId und reuseJustification.\n`);

const ledgerPath = resolve(projectDir, 'motion-mechanic-ledger.md');
if (!existsSync(ledgerPath)) {
  write(ledgerPath, `# Motion Mechanic Ledger\n\nMOTION_CORE: ${MOTION_CORE_ID}\n\nVor Implementierung jeder Animationsszene vollständig pflegen.\n\n| SCENE_ID | MECHANIC_ID | HERO_OBJECT | PRIMARY_ACTION | MOTION_AXIS | RESULT_TYPE | WARUM NICHT DOPPELT |\n|---|---|---|---|---|---|---|\n| [scene-XX] | [lower-kebab-case] | [HERO] | [AKTION] | [ACHSE/LOGIK] | [ERGEBNIS] | [BEGRÜNDUNG] |\n\n## Gate\n- keine MECHANIC_ID doppelt\n- bei mindestens drei gleichen Kerndimensionen Mechanik neu entwerfen\n- reine Farb-/Label-/Icon-/Kamera-/Timing-/Mirroring-Variation zählt nicht\n- src/motion zuerst prüfen; lokale Basis-Primitives nicht duplizieren\n`);
}

const append = (relativePath, heading, body) => {
  const path = resolve(root, relativePath);
  if (!existsSync(path)) return;
  const current = read(path);
  if (current.includes(`PHASE1_MOTION_DIRECTION: ${CONTRACT_ID}`)) return;
  write(path, `${current.trim()}\n\n## ${heading}\n\nPHASE1_MOTION_DIRECTION: ${CONTRACT_ID}\nMOTION_CORE: ${MOTION_CORE_ID}\n\n${body}\n`);
};

append(
  '05-projektdateien/animationen.md',
  'Phase 1 Individual Motion Direction V1',
  'Vor motionDesign oder animation.tsx jede Animationsszene herleiten: Sprechpunkt -> viewerMustUnderstand -> visualQuestion -> physische Ursache/Wirkung -> MECHANIC_ID -> Hero/Support -> chosenMechanism -> mechanismRationale. src/motion ist die kanonische technische Basis, aber kein kreatives Template-Menü. Mechanik-Ledger und Anti-Wiederholungs-Gate vor Code bestehen.',
);
append(
  '05-projektdateien/szenenplan.md',
  'Phase 1 Individual Motion Direction V1',
  'Animationsszenen werden nicht nach verfügbaren Komponenten geplant. Erst finanzielle Aussage und sichtbares Verständnisziel bestimmen; daraus die individuelle Hauptmechanik entwickeln. Danach Mechanik-Ledger prüfen und erst dann src/motion/Remotion-Technik wählen.',
);
append(
  '05-projektdateien/ANTIGRAVITY-AUFTRAG.md',
  'Phase 1 Motion Direction Lock',
  'Phase 3 darf die in Phase 1 hergeleitete Hauptmechanik nicht durch eine bequemere Standardanimation ersetzen. Für neue Animationen ist src/motion die kanonische technische Basis. Lottie/Icon/SVG-Support darf ergänzen, aber nicht die kreative Hauptlogik austauschen.',
);

console.log(`✓ Phase 1 Motion Direction gesetzt: ${CONTRACT_ID}`);
console.log(`✓ Motion Core gesetzt: ${MOTION_CORE_ID} · Quelle src/motion.`);
console.log('  Inhalt -> Verständnisziel -> Ursache/Wirkung -> MECHANIC_ID -> Hero/Support -> Mechanik -> Technik.');
console.log('  Mechanik-Ledger + Anti-Wiederholungs-Gate sind für neue Reels Pflicht.');
console.log('  Kein festes Template-Menü; Core-Primitives werden technisch wiederverwendet, Mechanik bleibt inhaltsgetrieben.');
