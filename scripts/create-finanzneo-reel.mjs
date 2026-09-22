#!/usr/bin/env node

// Legt ein neues Reel atomar an: Grundgerüst + aktuelle Produktionsverträge.
// Neue Reels erhalten Cover Hook V3: Titel ab Frame 0, Captions ab erstem gesprochenen Wort.
// Zusätzlich gelten Quality Guards V1: IMAGE xor ANIMATION, tatsächliche Source-Diversität
// und horizontale Animation-Safe-Zone mit Post-Render-Rand-QA.
// Bildplanung V5 erweitert V4: erst die gesamte Bildfolge planen, dann Einzelprompts.
// V5-Hardening erzwingt bewusste kreative Entscheidungen und einen kompilierten Director-Brief.
// V5.1 Dynamic Staging ergänzt Frame-Füllung, aktive Cause/Effect-Inszenierung,
// Human Reaction, räumlichen Druck und Impact Composition.
// Die globale V9-Bildwelt bleibt dabei unverändert gesperrt.

import {spawnSync} from 'node:child_process';
import {existsSync, readdirSync, rmSync, rmdirSync} from 'node:fs';
import {dirname, resolve} from 'node:path';

const args = process.argv.slice(2);
const targetIndex = args.indexOf('--target');
const target = targetIndex === -1 ? null : args[targetIndex + 1] ?? null;

if (!target) {
  console.error('Nutzung: npm run reel:create -- --target reels/<Woche>/<Tag>/<Reel> --title "Titel" [--types image,animation,...]');
  process.exit(1);
}

const absolutesZiel = resolve(target);
const bestandVorher = existsSync(absolutesZiel);
const reelsWurzel = resolve('reels');

const zuruecknehmen = () => {
  if (bestandVorher || !existsSync(absolutesZiel)) return;
  rmSync(absolutesZiel, {recursive: true, force: true});
  let ordner = dirname(absolutesZiel);
  while (ordner.startsWith(reelsWurzel) && ordner !== reelsWurzel) {
    if (!existsSync(ordner) || readdirSync(ordner).length > 0) break;
    rmdirSync(ordner);
    ordner = dirname(ordner);
  }
  console.error(`\nAngelegtes Reel wurde wieder entfernt: ${target}`);
  console.error('Ursache oben beheben und reel:create erneut ausführen.');
};

const run = (script, scriptArgs = []) => spawnSync(process.execPath, [resolve(script), ...scriptArgs], {stdio: 'inherit'});

const steps = [
  ['scripts/scaffold-finanzneo-reel.mjs', args],
  ['scripts/apply-flow-autonomous-contract.mjs', [target]],
  ['scripts/apply-stylized-animated-black-world-v9.mjs', [target]],
  ['scripts/apply-phase3-completion-contract.mjs', [target]],
  ['scripts/apply-reel-layout-v5.mjs', [target]],
  ['scripts/apply-phase1-animation-code-contract.mjs', [target]],
  ['scripts/apply-premium-animation-v2.mjs', [target]],
  ['scripts/apply-scene01-cover-export-contract.mjs', [target]],
  ['scripts/apply-visual-beat-contract.mjs', [target]],
  ['scripts/apply-future-cover-hook-v3.mjs', [target]],
  // Legacy bleibt im Repo: scripts/apply-future-image-storytelling-v4.mjs
  // Neue Reels erhalten direkt V5, Hardening und V5.1 Dynamic Staging.
  ['scripts/apply-future-image-storytelling-v5.mjs', [target]],
  ['scripts/apply-future-image-storytelling-v5-hardening.mjs', [target]],
  ['scripts/apply-future-image-storytelling-v5-staging.mjs', [target]],
  ['scripts/apply-future-production-standard-v3.mjs', [target]],
  ['scripts/apply-future-reel-presentation-v1.mjs', [target]],
  ['scripts/apply-future-reel-phase1-motion-direction-v1.mjs', [target]],
  ['scripts/apply-reel-quality-guards-v1.mjs', [target]],
];

for (const [script, scriptArgs] of steps) {
  const result = run(script, scriptArgs);
  if (result.status !== 0) {
    zuruecknehmen();
    process.exit(result.status ?? 1);
  }
}

console.log('\n✓ Neues Reel vollständig angelegt.');
console.log('  Google Flow: Strict-Single-Job V3 · immer genau 1 Bildjob.');
console.log('  Bildwelt V9 bleibt unverändert gesperrt. Storytelling V5 plant zuerst die ganze Bildfolge und erst danach Einzelprompts.');
console.log('  V5-Hardening: keine kreativen Defaults; Kamera, Energie, Licht, Klassen, Label-Budget und Interrupt werden bewusst gewählt.');
console.log('  V5.1 Dynamic Staging: kein kleines Motiv im leeren Schwarz; aktive Handlung, sichtbare Konsequenz, räumlicher Druck und lesbare Human Reaction.');
console.log('  V5.1 Impact Composition: spätestens innerhalb jedes 4-IMAGE-Fensters ein starker Perspektiv-/Raum-/Scale-Beat.');
console.log('  Nach fertiger Phase-1-Bildplanung: npm run reel:image-prompts:compile -- <Reel-Pfad>.');
console.log('  Der Compiler schreibt V5 + V5.1 direkt in jeden IMAGE PROMPT, damit Flow die Regie nicht aus Metadaten erraten muss.');
console.log('  Grounded first, nicht literal-only: reale Finanzsituation bleibt sofort lesbar; abstrakte Rätsel bleiben verboten.');
console.log('  V5 Anti-Wiederholung: Archetyp, Composition, Location, Kamera, Hauptmotiv, Human Presence und Table/Document-Muster werden sequenzweit gesteuert.');
console.log('  Cover Hook V3: Hero-Bild + exakter Titel ab Frame 0; Captions ab erstem gesprochenen Wort.');
console.log('  Szene-Typen: exakt IMAGE oder ANIMATION — kein Bild+Animations-Hybrid als Hauptvisual.');
console.log('  IMAGE: Bild + Titel/Header/Icon + Caption; keine erklärende Remotion-Hauptanimation über dem Bild.');
console.log('  ANIMATION: individuelle Remotion-Hauptanimation + Header/Icon + Caption; kein Flow-Bild als Hauptvisual.');
console.log('  Motion Direction: Inhalt -> Verständnisziel -> visuelle Frage -> individuelle Mechanik -> Technik.');
console.log('  Source Diversity Guard: tatsächliche animation.tsx-Primitives werden verglichen; Metadaten allein reichen nicht.');
console.log('  Animation Safe Zone: X72–1008 · Visual Y320–1400 · perspektivischer Innenabstand + Post-Render-Rand-QA.');
console.log('  Audio V3: Candidate wird vor Render-QA auf -16 LUFS / -1 dBTP gemastert.');
console.log('  Phase 3: Preflight + Render-QA + Edge-Band-QA + Export-Gate.');
