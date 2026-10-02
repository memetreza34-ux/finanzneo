#!/usr/bin/env node

// Legt ein neues Reel atomar an: Grundgerüst + aktuelle Produktionsverträge.
// Neue Reels erhalten Cover Hook V3: Titel ab Frame 0, Captions ab erstem gesprochenen Wort.
// Zusätzlich gelten Quality Guards V1: IMAGE xor ANIMATION, tatsächliche Source-Diversität
// und horizontale Animation-Safe-Zone mit Post-Render-Rand-QA.
// Bildplanung: FORM FREI — BILDWELT FEST. Pro Beat die stärkste Darstellungsform wählen.
// Google Flow wird am Ende erneut angewendet, damit paralleles 3-Cover-Gate,
// V9 als einzige Style-Autorität, 5er-Blöcke, Sofort-Rename und finaler
// Inventory-QA nicht von Zwischen-Skripten überschrieben werden können.

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
  rmSync(absolutesZiel, {recursive: true, force:true});
  let ordner = dirname(absolutesZiel);
  while (ordner.startsWith(reelsWurzel) && ordner !== reelsWurzel) {
    if (!existsSync(ordner) || readdirSync(ordner).length > 0) break;
    rmdirSync(ordner);
    ordner = dirname(ordner);
  }
  console.error(`\nAngelegtes Reel wurde wieder entfernt: ${target}`);
  console.error('Ursache oben beheben und reel:create erneut ausführen.');
};

const run = (script, scriptArgs = []) => spawnSync(process.execPath, [resolve(script), ...scriptArgs], {stdio:'inherit'});

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
  ['scripts/apply-future-image-storytelling-v3.mjs', [target]],
  ['scripts/apply-future-production-standard-v3.mjs', [target]],
  ['scripts/apply-future-reel-presentation-v1.mjs', [target]],
  ['scripts/apply-future-reel-phase1-motion-direction-v1.mjs', [target]],
  ['scripts/apply-reel-quality-guards-v1.mjs', [target]],
  // Final erneut anwenden: andere Produktionsverträge dürfen den zentralen
  // Cover-/5Pack-/Inventory-Flow nicht versehentlich verwässern.
  ['scripts/apply-flow-autonomous-contract.mjs', [target]],
];

for (const [script, scriptArgs] of steps) {
  const result = run(script, scriptArgs);
  if (result.status !== 0) {
    zuruecknehmen();
    process.exit(result.status ?? 1);
  }
}

console.log('\n✓ Neues Reel vollständig angelegt.');
console.log('  Google Flow: 3 Cover mit kurzem Inhalts-Hook gleichzeitig als getrennte Jobs -> Nutzerwahl A/B/C.');
console.log('  Gewähltes Cover = Scene 01, aber KEINE Style-Referenz; V9 bleibt einzige Style-Autorität für alle Bilder.');
console.log('  Danach: organisatorische 5er-Blöcke, technisch immer exakt 1 Szenenbildjob -> Sofort-Rename -> QA -> automatisch weiter.');
console.log('  Flow-Abschluss: vollständiger Inventory-/Dateinamen-QA; alle finalen Bilder gemeinsam im einen finalen Bildordner.');
console.log('  Visual Form V1: Form frei — Bildwelt fest.');
console.log('  IMAGE darf pro Beat character-story, object-story, comparison, chart, diagram, editorial-quote, illustration, metaphor oder hybrid sein.');
console.log('  CHART/DIAGRAM bleibt fachlich echt: korrekte Achsen/Skalen/Labels/Proportionen soweit erforderlich; kein PowerPoint-/Excel-Default.');
console.log('  Bildwelt: premium stylized 3D / hochwertige FinanzNeo-Illustrationssprache auf Deep Black; V9 bleibt Style-Lock.');
console.log('  Cover Hook V3: Hero-Bild + kurzer inhaltsbezogener Hook; maximal 2 Zeilen, ideal 2–5 Wörter.');
console.log('  Szene-Typen: exakt IMAGE oder ANIMATION — kein Bild+Animations-Hybrid als Hauptvisual.');
console.log('  IMAGE: Bild + Titel/Header/Icon + Caption; keine erklärende Remotion-Hauptanimation über dem Bild.');
console.log('  ANIMATION: dieselbe freie visuelle Regie, aber in derselben V9-Welt; Remotion-Hauptanimation + Header/Icon + Caption.');
console.log('  Motion Direction: Inhalt -> stärkste Darstellungsform -> Mechanik -> Same-World-Pass -> Finance Motion Library oder Custom-Build.');
console.log('  Finance Motion Library: passende Mechaniken parametrisieren und wiederverwenden; keine passende Mechanik = individuell bauen.');
console.log('  Source Diversity Guard: tatsächliche animation.tsx-Primitives werden verglichen; Metadaten allein reichen nicht.');
console.log('  Animation Safe Zone: X72–1008 · Visual Y320–1400 · perspektivischer Innenabstand + Post-Render-Rand-QA.');
console.log('  Lottie/Icons/SVG sind Support, nicht automatisch eine neue Hauptanimation.');
console.log('  Audio V3: Candidate wird vor Render-QA auf -16 LUFS / -1 dBTP gemastert.');
console.log('  Phase 3: Preflight + Render-QA + Edge-Band-QA + Export-Gate.');
