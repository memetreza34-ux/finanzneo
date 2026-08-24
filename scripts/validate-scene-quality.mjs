#!/usr/bin/env node

// Prüft die inhaltliche Qualität der Szenenmetadaten eines Reels.
// Das gemeinsame Scene-Schema läuft hier als Teil von reel:validate mit, damit
// Readiness und Reel-Validator nicht mehr unterschiedliche Formen akzeptieren.

import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';

import {validatePhase3Executor, validateSceneShape} from './lib/reel-scene-schema.mjs';

const target = process.argv[2];
if (!target) {
  console.error('Nutzung: node scripts/validate-scene-quality.mjs <Reel-Projektordner>');
  process.exit(1);
}

const root = resolve(target);
const indexPath = resolve(root, '03-szenen/scene-index.json');
const errors = [];
const warnings = [];

if (!existsSync(indexPath)) {
  console.error('03-szenen/scene-index.json fehlt.');
  process.exit(1);
}

const index = JSON.parse(readFileSync(indexPath, 'utf8'));
const scenes = Array.isArray(index.scenes) ? index.scenes : [];

errors.push(...validatePhase3Executor(index.phase3Executor));

// Erlaubte Icon-Namen direkt aus der Komponente lesen.
const iconSource = readFileSync(resolve('src/brand/components/Icon.tsx'), 'utf8');
const iconStart = iconSource.indexOf('const PATHS');
const iconBlock = iconStart === -1 ? '' : iconSource.slice(iconStart, iconSource.indexOf('\n};', iconStart));
const ICONS = new Set([...iconBlock.matchAll(/^\s+'?([a-z][a-zA-Z-]*)'?\s*:/gm)].map((m) => m[1]));

const PLACEHOLDER = /\[|EINFÜGEN|TODO|TBD|XXX|\.\.\./i;
const LEER_PHRASEN = new Set([
  'WICHTIG', 'ACHTUNG', 'HINWEIS', 'ÜBERSICHT', 'EINLEITUNG', 'FAZIT',
  'BEISPIEL', 'ZUSAMMENFASSUNG', 'INTRO', 'OUTRO', 'ERKLÄRUNG', 'INFO',
]);

const fps = Number(index.video?.fps) || 30;

const ausnahme = index.timingExceptions?.longImageBeats;
const ausnahmeLangeBildbeats = ausnahme?.allowed === true && typeof ausnahme.reason === 'string' && ausnahme.reason.trim().length > 20;
if (ausnahme?.allowed === true && !ausnahmeLangeBildbeats) {
  errors.push('timingExceptions.longImageBeats braucht eine aussagekräftige Begründung (reason).');
}

const seenIcons = new Map();
const seenHeadlines = new Map();

scenes.forEach((scene, position) => {
  const id = scene.id ?? `Position ${position + 1}`;

  // Das zentrale Schema ist jetzt ein harter Bestandteil von reel:validate.
  errors.push(...validateSceneShape(scene, {index: position}));

  const headline = typeof scene.headline === 'string' ? scene.headline.trim() : '';
  const icon = typeof scene.icon === 'string' ? scene.icon.trim() : '';

  if (!headline) {
    errors.push(`${id}: Zwischenüberschrift fehlt. Jede Szene braucht eine.`);
  } else {
    if (PLACEHOLDER.test(headline)) {
      errors.push(`${id}: Zwischenüberschrift ist noch ein Platzhalter: "${headline}"`);
    }

    const buchstaben = headline.replace(/[^A-Za-zÄÖÜäöüß]/g, '');
    if (buchstaben.length < 6) {
      errors.push(`${id}: Zwischenüberschrift ist keine Aussage, sondern nur eine Zahl/ein Zeichen: "${headline}". Formuliere, was die Szene erklärt.`);
    }

    const woerter = headline.split(/\s+/).filter(Boolean);
    if (woerter.length < 2) {
      errors.push(`${id}: Zwischenüberschrift "${headline}" ist ein Stichwort, keine Aussage. Mindestens zwei Wörter.`);
    }
    if (woerter.length > 7) {
      warnings.push(`${id}: Zwischenüberschrift hat ${woerter.length} Wörter — Ziel sind 3–6: "${headline}"`);
    }
    if (headline.length > 40) {
      warnings.push(`${id}: Zwischenüberschrift ist ${headline.length} Zeichen lang und könnte einzeilig nicht passen: "${headline}"`);
    }
    if (LEER_PHRASEN.has(headline.toUpperCase().replace(/[.:!?]/g, ''))) {
      errors.push(`${id}: Zwischenüberschrift "${headline}" sagt nichts über die Szene aus.`);
    }

    const key = headline.toUpperCase();
    if (seenHeadlines.has(key)) {
      errors.push(`${id}: Zwischenüberschrift ist identisch mit ${seenHeadlines.get(key)}: "${headline}"`);
    } else {
      seenHeadlines.set(key, id);
    }
  }

  if (!icon) {
    errors.push(`${id}: Icon fehlt. Jede Szene braucht ein passendes Linien-Icon.`);
  } else if (ICONS.size > 0 && !ICONS.has(icon)) {
    errors.push(`${id}: Icon "${icon}" existiert nicht. Verfügbar: ${[...ICONS].sort().join(', ')}`);
  } else {
    seenIcons.set(icon, (seenIcons.get(icon) ?? 0) + 1);
  }

  const tone = scene.headerTone ?? scene.tone;
  if (tone && !['default', 'positive', 'warning', 'money', 'neutral'].includes(tone)) {
    errors.push(`${id}: headerTone "${tone}" ist ungültig.`);
  }

  const dauerFrames = Number(scene.durationFrames);
  if (Number.isFinite(dauerFrames) && dauerFrames > 0) {
    const sekunden = dauerFrames / fps;
    if (scene.type === 'image' && sekunden > 6.0001) {
      if (ausnahmeLangeBildbeats) {
        warnings.push(`${id}: Bildbeat dauert ${sekunden.toFixed(1)} s (über 6,0 s) — durch dokumentierte Ausnahme erlaubt.`);
      } else {
        errors.push(`${id}: Bildbeat dauert ${sekunden.toFixed(1)} s. Maximal 6,0 s — splitten oder animieren.`);
      }
    }
    if (sekunden < 1.2) warnings.push(`${id}: Szene ist mit ${sekunden.toFixed(1)} s sehr kurz.`);
  }
});

const maxGleich = Math.max(2, Math.ceil(scenes.length / 5));
for (const [icon, anzahl] of seenIcons) {
  if (anzahl > maxGleich) {
    warnings.push(`Icon "${icon}" wird ${anzahl}× verwendet (Richtwert max. ${maxGleich}). Unterschiedliche Aussagen brauchen unterschiedliche Icons.`);
  }
}

const mitFrames = scenes.filter((s) => Number.isFinite(Number(s.startFrame)) && Number(s.durationFrames) > 0);
if (mitFrames.length === scenes.length && scenes.length > 0) {
  for (let i = 1; i < mitFrames.length; i += 1) {
    const vorher = mitFrames[i - 1];
    const ende = Number(vorher.startFrame) + Number(vorher.durationFrames);
    const start = Number(mitFrames[i].startFrame);
    if (start !== ende) {
      errors.push(`${mitFrames[i].id}: startFrame ${start} passt nicht an das Ende der Vorgängerszene (${ende}). Timeline muss lückenlos sein.`);
    }
  }
}

// Per-Reel-Style-Metadaten sind nur beschreibend. REEL_STYLE im Code gewinnt.
if (index.sceneHeader?.headlineColor && index.sceneHeader.headlineColor !== 'finance-green') {
  warnings.push(`scene-index.sceneHeader.headlineColor="${index.sceneHeader.headlineColor}" ist veraltet; gerendert wird zentral nach REEL_STYLE (finance-green).`);
}
if (Number(index.transitionContract?.continuityFramesMax) > 4) {
  warnings.push(`scene-index.transitionContract.continuityFramesMax=${index.transitionContract.continuityFramesMax} ist veraltet; REEL_STYLE begrenzt auf max. 4 Frames.`);
}

if (warnings.length) {
  console.warn('\nHinweise zur Szenenqualität:\n');
  warnings.forEach((w) => console.warn(`- ${w}`));
}

if (errors.length) {
  console.error('\nSzenenqualität nicht erfüllt:\n');
  errors.forEach((e) => console.error(`- ${e}`));
  console.error('\nJede Szene braucht eine klare Aussage, ein gültiges Icon und muss das zentrale Scene-Schema erfüllen.');
  process.exit(1);
}

console.log(`\n✓ Szenenqualität erfüllt: ${scenes.length} Szenen mit gültigem Schema, aussagekräftiger Überschrift, gültigem Icon und zulässiger Dauer.`);
