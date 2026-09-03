#!/usr/bin/env node

import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {
  PREMIUM_ANIMATION_LOCK,
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

const contractHeading = '## CINEMATIC REAL-WORLD ANIMATIONSVERTRAG';
const contractBlock = `
${contractHeading}
Premium Visual Lock: ${PREMIUM_ANIMATION_LOCK}
Visual Target World: finanzneo-stylized-3d-animated-black-v9

Pflicht:
- dieselbe realitätsnahe stylized-3D-Welt wie die Flow-Bilder; klar nicht fotorealistisch
- echte Alltagssituation bzw. konkrete Finanzhandlung zuerst, abstrakte Symbole nur unterstützend
- STARTZUSTAND → konkrete physische Hauptaktion → sichtbare Ursache/Wirkung → eindeutiges Ergebnis
- Remotion ist die freie Animationsfläche: eigene React-Komponenten, SVG, Masken, Clip-Paths, CSS-3D, Perspektive, Kamera-Choreografie, Morphing und bei Bedarf Three.js sind erlaubt
- vorhandene Physical*-Primitives sind OPTIONALE Helfer und niemals Voraussetzung oder Kreativitätsgrenze
- jede Szene erhält eine eindeutige MECHANIC_ID UND VISUAL_TECHNIQUE_ID; weder Mechanik noch Haupttechnik im selben Reel wiederholen
- PRIMARY_ACTION benennt die tatsächliche sichtbare Zustandsänderung
- mehrere koordinierte Motion-Channels statt einer einzigen globalen Progress-Variable
- kurze deutsche Labels dürfen helfen, tragen aber niemals allein die Erklärung
- AnimationStage oder PremiumPhysicalStage hält die sichtbare Ausgabe in der Visual-Safe-Zone; der zentrale Reel-Canvas darunter bleibt #000000
- Materialität, Tiefe, Perspektive und Kontakt-Schatten einsetzen, wenn sie zur gewählten Technik passen
- Ergebnis mindestens 15 Frames stabil halten

Mögliche Techniken — ausdrücklich keine geschlossene Liste:
- eigene SVG-Illustration und SVG-Morph/Mask-Reveal
- CSS-3D-Objekte, Perspektivräume und Kamerafahrten
- Clip-Path-/Slice-/Cutaway-Mechaniken
- Split-Screen, Match-Cut und Objekt-Transformation
- data-driven Shapes und echte Diagramm-Transformationen
- Canvas / Three.js / @remotion/three, wenn die Szene davon profitiert
- vorhandene Physical*-Primitives nur dann, wenn sie für genau diese Szene die beste Lösung sind

Streng verboten als Hauptsprache:
- drei oder mehr generische beschriftete Kästen/Karten, die nur A → B → C darstellen
- Lade-/Fortschrittsbalken als Ersatz für die eigentliche Handlung
- Dashboard-/Control-Panel-/App-UI-Look
- Flowchart als Hauptkomposition
- kleine Boxen mit dünnen Verbindungslinien
- reine Texttafel mit Fade/Scale
- abstrakte Schild-/Pfeil-/Münz-Metapher, wenn eine reale Situation darstellbar ist
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

console.log(`✓ Cinematic Animation Contract angewendet: ${PREMIUM_ANIMATION_LOCK}`);
console.log('  Remotion-Freiheit aktiv · jede Szene eigene MECHANIC_ID + VISUAL_TECHNIQUE_ID · mehrere Motion-Channels.');
console.log('  Generische Kartenreihen und Fortschrittsbalken dürfen die visuelle Geschichte nicht ersetzen.');
console.log('  Transparenter Stage über statischem #000000 Canvas · keine Partikel/Aurora/Grid/Glow-Hintergründe.');
