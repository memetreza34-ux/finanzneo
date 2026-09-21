#!/usr/bin/env node

import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-creative-director-v1.mjs <Reel-Pfad>');
  process.exit(1);
}

const ID = 'finanzneo-creative-director-v1';
const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const read = (path) => readFileSync(path, 'utf8');
const write = (path, content) => writeFileSync(path, content.endsWith('\n') ? content : `${content}\n`, 'utf8');
const index = JSON.parse(read(indexPath));

index.creativeDirectorContract = {
  id: ID,
  appliesToNewReelsOnly: true,
  runsBeforeVisualSelection: true,
  storyMomentBeforeStyleLockRequired: true,
  actionConsequenceOrContrastRequired: true,
  shotDesignRequired: true,
  shotDiversityRequired: true,
  uniqueStoryDetailRequired: true,
  realWorldContextAllowedInsideBlackWorld: true,
  labelsSupplementalOnly: true,
  genericFinancePosterForbidden: true,
  personPlusSymbolsOnEmptyBackgroundForbidden: true,
  bankShieldCoinsArrowDefaultForbidden: true,
  staticObjectCatalogForbidden: true,
  flatInfographicAnimationAsDefaultForbidden: true,
  zoomPanKenBurnsDoesNotCountAsNewBeat: true,
  boringSceneQaRequiredBeforeSeal: true,
  minimumStrongPassSignals: 4,
};

const placeholder = (label) => `[EINFÜGEN — ${label}]`;
for (const scene of Array.isArray(index.scenes) ? index.scenes : []) {
  if (!scene || typeof scene !== 'object') continue;
  scene.creativeDirection = {
    ...(scene.creativeDirection ?? {}),
    visualGoal: scene.creativeDirection?.visualGoal ?? placeholder('was soll der Zuschauer sichtbar verstehen'),
    viewerQuestion: scene.creativeDirection?.viewerQuestion ?? placeholder('welche Frage beantwortet dieser Beat'),
    storyMoment: scene.creativeDirection?.storyMoment ?? placeholder('interessantester konkrete sichtbare Moment'),
    primaryAction: scene.creativeDirection?.primaryAction ?? placeholder('was passiert gerade aktiv'),
    visibleConsequence: scene.creativeDirection?.visibleConsequence ?? placeholder('welche Folge oder Veränderung sieht man'),
    shotType: scene.creativeDirection?.shotType ?? placeholder('z. B. close-up, over-the-shoulder, wide, top-down'),
    cameraPosition: scene.creativeDirection?.cameraPosition ?? placeholder('konkrete Kameraposition und Blickrichtung'),
    foreground: scene.creativeDirection?.foreground ?? placeholder('Vordergrundelement oder none mit Begründung'),
    hero: scene.creativeDirection?.hero ?? placeholder('visuelles Hauptmotiv'),
    context: scene.creativeDirection?.context ?? placeholder('realer Szenenkontext in der schwarzen FinanzNeo-Welt'),
    uniqueDetail: scene.creativeDirection?.uniqueDetail ?? placeholder('konkretes Story-Detail, das nur zu diesem Beat passt'),
    differenceFromPreviousBeats: scene.creativeDirection?.differenceFromPreviousBeats ?? placeholder('sichtbare Abwechslung zu den letzten zwei Beats'),
    boringSceneRisk: scene.creativeDirection?.boringSceneRisk ?? placeholder('größtes Risiko, dass die Szene wie eine Folie wirkt'),
    boringSceneStatus: scene.creativeDirection?.boringSceneStatus ?? 'UNREVIEWED',
  };
}
write(indexPath, JSON.stringify(index, null, 2));

const planningBlock = `CREATIVE_DIRECTION_STANDARD: ${ID}
VISUAL_GOAL: [EINFÜGEN — was soll der Zuschauer sichtbar verstehen]
VIEWER_QUESTION: [EINFÜGEN — welche Frage beantwortet dieser Beat]
STORY_MOMENT: [EINFÜGEN — interessantester konkrete sichtbare Moment]
PRIMARY_ACTION: [EINFÜGEN — was passiert gerade aktiv]
VISIBLE_CONSEQUENCE: [EINFÜGEN — welche Folge oder Veränderung sieht man]
SHOT_TYPE: [EINFÜGEN]
CAMERA_POSITION: [EINFÜGEN]
FOREGROUND: [EINFÜGEN]
HERO: [EINFÜGEN]
CONTEXT: [EINFÜGEN]
UNIQUE_DETAIL: [EINFÜGEN — Story-Detail, das nur zu diesem Beat passt]
DIFFERENCE_FROM_PREVIOUS_BEATS: [EINFÜGEN]
BORING_SCENE_RISK: [EINFÜGEN]
BORING_SCENE_STATUS: UNREVIEWED`;

const policyBlock = `# Creative Director V1

CREATIVE_DIRECTION_STANDARD: ${ID}

Reihenfolge:
Sprechpunkt → Zuschauerfrage → Story Moment → Handlung/Konsequenz/Kontrast → Shot Design → IMAGE oder ANIMATION → Mechanik → Art Direction → Boring-Scene-QA.

Harte Regeln:
- FinanzNeo zeigt Momente, keine Folien.
- Style Lock kommt nach der visuellen Idee und darf sie nicht ersetzen.
- Person + Finanzsymbole + leerer Hintergrund ist als Standardidee verboten.
- Bank + Schild + Münzen + Pfeil ist keine ausreichende Hauptidee.
- Ein Still braucht Handlung, Konsequenz oder klaren Kontrast und ein einzigartiges Story-Detail.
- Eine Animation braucht START → Aktion/Ursache → Veränderung → RESULTAT.
- Karten, Chips, Icons, Balken und Rahmenbewegung sind keine automatische Premium-Animation.
- Ken-Burns/Zoom/Pan allein zählt nicht als neuer Visual Beat.
- Deep Black bleibt Markenwelt; reale Tische, Räume, Geräte, Rechnungen, Einkauf, Smartphone usw. dürfen die Szene glaubwürdig verankern.
- Vor Seal muss BORING_SCENE_STATUS auf PASS stehen.`;

for (const scene of Array.isArray(index.scenes) ? index.scenes : []) {
  if (!scene?.id) continue;
  const sceneFile = resolve(root, '03-szenen/EINZELNE-SZENEN', scene.id, 'szene.md');
  if (!existsSync(sceneFile)) continue;
  let source = read(sceneFile);
  if (!source.includes(`CREATIVE_DIRECTION_STANDARD: ${ID}`)) {
    source = `${source.trim()}\n\n## Creative Direction\n\n${planningBlock}\n`;
    write(sceneFile, source);
  }
}

const projectDir = resolve(root, '05-projektdateien');
mkdirSync(projectDir, {recursive: true});
write(resolve(projectDir, 'creative-director-v1.md'), `${policyBlock}\n\nKanonische Langfassung: docs/CREATIVE-DIRECTOR-V1.md\n`);

const appendPolicy = (relativePath) => {
  const path = resolve(root, relativePath);
  if (!existsSync(path)) return;
  const source = read(path);
  if (source.includes(`CREATIVE_DIRECTION_STANDARD: ${ID}`)) return;
  write(path, `${source.trim()}\n\n${policyBlock}\n`);
};

appendPolicy('05-projektdateien/szenenplan.md');
appendPolicy('05-projektdateien/ANTIGRAVITY-AUFTRAG.md');

console.log(`✓ Creative Director gesetzt: ${ID}`);
console.log('✓ Jede Szene besitzt Story Moment, Handlung/Konsequenz, Shot Design, Unique Detail und Boring-Scene-Status.');
console.log('✓ Style Lock kommt erst nach Creative Direction; Folien-/Symbolposter-Logik ist als Standardlösung verboten.');