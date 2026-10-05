#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {
  PREMIUM_ANIMATION_LOCK,
  STORY_MOMENT_REVISION,
  premiumAnimationContractFields,
} from './lib/premium-animation-contract.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/apply-premium-animation-v2.mjs <Reel-Pfad>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const read = (path) => readFileSync(path, 'utf8');
const write = (path, content) => writeFileSync(path, content.endsWith('\n') ? content : `${content}\n`, 'utf8');

const index = JSON.parse(read(indexPath));
index.phase1AnimationCode = {
  ...(index.phase1AnimationCode ?? {}),
  ...premiumAnimationContractFields(),
};

const animations = Array.isArray(index.scenes)
  ? index.scenes.filter((scene) => scene?.type === 'animation')
  : [];

const contractHeading = '## FINANCE MOTION LIBRARY + CUSTOM ANIMATIONSVERTRAG';
const contractBlock = `
${contractHeading}
Premium Visual Lock: ${PREMIUM_ANIMATION_LOCK}
Story Moment Revision: ${STORY_MOMENT_REVISION}
Finance Motion Library: finanzneo-finance-motion-library-v1
Visual Target World: finanzneo-stylized-3d-animated-black-v9

GRUNDSATZ:
Die Finance Motion Library ist ein Mechanik-Werkzeugkasten, KEINE Stilvorlage. Eine vorhandene Mechanik darf nur direkt gerendert werden, wenn sie sichtbar dieselbe FinanzNeo-Welt wie die Flow-Bilder trifft. Sonst wird die Mechanik individuell in der V9-Welt umgesetzt.

DIE GLEICHE STORY-LOGIK WIE BEI DEN BILDERN:
- bekannte Figuren und/oder bekannte Gegenstände tragen die Bedeutung
- Animation wirkt wie eine kleine Szene aus einem hochwertigen 3D-Animationsfilm
- es passiert sichtbar etwas: Handlung -> Reaktion -> Folge/Payoff
- intuitive Übertreibungen und Metaphern sind ausdrücklich erlaubt, wenn sie ohne Erklärung sofort verständlich sind
- Beispiel gute Richtung: mehrere bekannte Rechnungen greifen nacheinander auf dasselbe Portemonnaie zu; ein langer Kassenzettel rollt sichtbar weiter; kleine wiederkehrende Gebühren sammeln sich über Zeit
- Beispiel schlechte Richtung: abstrakter capital body, fee token, value block oder geometrischer wealth tower ohne selbsterklärende reale Bedeutung
- keine Corporate-3D-Figur als reine Dekoration; wenn eine Figur vorkommt, tragen Pose/Reaktion/Handlung die Aussage mit

Verbindliche Reihenfolge in Phase 1:
1. Sprechpunkt und sichtbares Verständnisziel bestimmen.
2. Bekannte Figur/Gegenstände oder sofort verständlichen Story-Moment bestimmen.
3. Visuelle Hauptmechanik herleiten.
4. Finance Motion Library auf semantischen Best-Fit prüfen.
5. Bei Best-Fit zusätzlich SAME-WORLD-PASS prüfen.
6. Nur bei echtem Same-World-Pass direkt parametrisieren; sonst individuelle Animation bauen.
7. Produktionsreife animation.tsx liefern.

SAME-WORLD-PASS:
- dieselbe stylized-3D-Animationsfilm-Sprache wie V9
- bekannte Finanz-/Alltagsobjekte bevorzugen, wenn sie den Punkt klarer machen
- intuitive physische Übertreibung ist erlaubt, abstrakte erfundene Finanzkörper sind kein Default
- Emerald/Gold/Red-Orange bleiben Rollenfarben, aber Farbe allein ersetzt keine Bedeutung
- Ursache -> sichtbare Aktion -> Reaktion -> Payoff muss ohne Untertitel grundsätzlich verständlich sein

LAYOUT-VERTRAG:
- animation.tsx liefert NUR transparenten visuellen Inhalt für die Visualzone
- der globale Reel-Canvas bleibt #000000
- Header und Captions gehören ausschließlich dem globalen Reel-Layout
- lokale SceneShells, lokale schwarze Vollflächen, eigene Header und eigene Captions in animation.tsx sind verboten
- AnimationStage bleibt Y320–1400 und clippt den visuellen Inhalt zentral

Qualitätsregeln:
- START -> sichtbare Ursache/Aktion -> klares RESULT/PAYOFF
- ein klarer FOCAL_PATH
- PRIMARY_ACTION trägt die Erklärung; Nebenbewegungen unterstützen nur
- CAMERA_ROLE bewusst festlegen: still, follow, push oder reframe
- Ergebnis mindestens 15 Frames stabil halten
- kurze deutsche Labels dürfen helfen, tragen aber nie allein die Erklärung
- Parameter müssen exakt zum Sprechpunkt passen; kein Template-Füllmaterial

Weiterhin verboten als Hauptsprache:
- generische Karten-/Kästchenreihe
- Lade-/Fortschrittsbalken als Ersatz für die Finanzmechanik
- Dashboard-/Control-Panel-/App-UI-Look
- Flowchart als Hauptkomposition
- kleine Boxen mit dünnen Verbindungslinien
- reine Texttafel mit Fade/Scale
- Partikel/Aurora/Grid/Glow/Gradient als Animationshintergrund
- dekorative Bewegung ohne erklärenden Mechanismus
`;

for (const scene of animations) {
  scene.animationPremiumVisualLock = PREMIUM_ANIMATION_LOCK;
  const plan = String(scene.planFile ?? '').replace(/^03-szenen\//, '');
  const remotionPath = resolve(root, '03-szenen', plan);
  if (!existsSync(remotionPath)) {
    console.error(`Remotion-Spezifikation fehlt: ${remotionPath}`);
    process.exit(1);
  }
  const current = read(remotionPath);
  if (!current.includes(contractHeading)) {
    write(remotionPath, `${current.trim()}\n\n${contractBlock.trim()}\n`);
  }
}

write(indexPath, JSON.stringify(index, null, 2));

const overviewPath = resolve(root, '05-projektdateien/animationen.md');
if (existsSync(overviewPath)) {
  const overview = read(overviewPath);
  if (!overview.includes(contractHeading)) {
    write(overviewPath, `${overview.trim()}\n\n${contractBlock.trim()}\n`);
  }
}

console.log(`✓ Hybrid-Animationsvertrag angewendet: ${PREMIUM_ANIMATION_LOCK}`);
console.log(`✓ Story-Moment-Revision: ${STORY_MOMENT_REVISION}`);
console.log('  Bekannte Figuren/Gegenstände -> klare Handlung -> Same-World-Pass -> Library oder Custom.');
console.log('  Intuitive Übertreibung/Metapher erlaubt; abstrakte Finanzkörper sind kein Default.');
console.log('  animation.tsx bleibt transparenter Visual-Inhalt; Header/Caption/Canvas gehören dem Reel-Layout.');
