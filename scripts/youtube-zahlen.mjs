#!/usr/bin/env node
// FinanzNeo — Zahlen-Rückschau: echte YouTube-Studio-Zahlen je Video festhalten und auswerten.
//
//   npm run youtube:zahlen                                   Übersicht aller Videos + was fällig ist
//   npm run youtube:zahlen -- youtube/<Projekt> --veroeffentlicht 2026-10-12
//   npm run youtube:zahlen -- youtube/<Projekt> --tag 7 --impressionen 1200 --ctr 3,4 --aufrufe 41 \
//     --dauer 2:10 --halten30 58 [--prozent 31] [--abos 2] [--suche 35] [--vorschlag 20] [--notiz "…"]
//
// Werte aus YouTube Studio → Analytics, Zeitraum „seit Veröffentlichung“, am Messtag 7 und 28.
// Schreibt _intern/07-zahlen/zahlen.json und zeigt den Engpass (Reichweite → Klickrate → Hook → Mitte).

import {spawnSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {basename, dirname, resolve} from 'node:path';
import {EXPORT_FILES, YOUTUBE_PUBLISHING_FILES, internWurzel} from './lib/youtube-contract.mjs';
import {
  YOUTUBE_ZAHLEN_DATEI,
  YOUTUBE_ZAHLEN_MESSTAGE,
  de,
  diagnose,
  eintragAusWerten,
  formatDauer,
  ladeKanal,
  leereZahlen,
  offeneZahlen,
  pruefeEintrag,
  verbesserungsZeile,
} from './lib/youtube-zahlen.mjs';

const args = process.argv.slice(2);
const wert = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const projekt = args.find((a, i) => !a.startsWith('--') && !(args[i - 1] ?? '').startsWith('--'));
const heute = new Date().toISOString().slice(0, 10);
const istDatum = (text) => /^\d{4}-\d{2}-\d{2}$/.test(text ?? '') && !Number.isNaN(Date.parse(text));

const videoLaenge = (root) => {
  const video = resolve(root, EXPORT_FILES.video);
  if (!existsSync(video)) return null;
  const lauf = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', video], {encoding: 'utf8'});
  const sekunden = Number(lauf.stdout?.trim());
  return Number.isFinite(sekunden) && sekunden > 0 ? sekunden : null;
};

const zeigeDiagnose = (eintrag) => {
  const {engpass, hinweise} = diagnose(eintrag);
  console.log(`  Engpass: ${engpass ?? 'keiner — Muster dieses Videos beibehalten'}`);
  for (const h of hinweise) console.log(`  - ${h}`);
};

if (!projekt) {
  const kanal = ladeKanal(resolve('youtube'), heute);
  console.log('FinanzNeo — Zahlen je Video (letzter Messtag)\n');
  console.log('Video                                   | online     | Tag | Impr.  | CTR    | Aufrufe | 30 s   | angesehen | Engpass');
  console.log('----------------------------------------|------------|-----|--------|--------|---------|--------|-----------|-----------');
  for (const v of kanal) {
    const e = v.eintraege.at(-1);
    const zelle = (text, breite) => String(text ?? '–').padEnd(breite);
    console.log([
      zelle(v.video, 39), zelle(v.veroeffentlicht ?? (v.gerendert ? 'fehlt' : 'in Arbeit'), 10), zelle(e?.tag, 3), zelle(e?.impressionen, 6),
      zelle(e ? `${de(e.ctr)} %` : null, 6), zelle(e?.aufrufe, 7), zelle(e ? `${de(e.halten30)} %` : null, 6),
      zelle(e?.prozentAngesehen !== undefined ? `${de(e.prozentAngesehen)} %` : null, 9), e ? diagnose(e).engpass ?? 'keiner' : '–',
    ].join(' | '));
  }
  const offen = offeneZahlen(kanal);
  console.log(offen.length ? `\nOffen:\n${offen.map((o) => `- ${o}`).join('\n')}` : '\n✓ Keine Zahlen offen.');
  process.exit(0);
}

const root = internWurzel(projekt);
if (!existsSync(root)) {
  console.error(`Projekt nicht gefunden: ${root}`);
  process.exit(1);
}
const video = basename(dirname(root));
const datei = resolve(root, YOUTUBE_ZAHLEN_DATEI);
const daten = existsSync(datei) ? JSON.parse(readFileSync(datei, 'utf8')) : leereZahlen(video);

const veroeffentlicht = wert('--veroeffentlicht');
if (veroeffentlicht !== undefined) {
  if (!istDatum(veroeffentlicht)) {
    console.error('--veroeffentlicht braucht ein Datum im Format JJJJ-MM-TT.');
    process.exit(1);
  }
  daten.veroeffentlicht = veroeffentlicht;
}

if (wert('--tag') !== undefined) {
  if (!daten.veroeffentlicht) {
    console.error('Zuerst das Veröffentlichungsdatum setzen: --veroeffentlicht JJJJ-MM-TT');
    process.exit(1);
  }
  const titelDatei = resolve(root, YOUTUBE_PUBLISHING_FILES.finalTitle);
  const eintrag = eintragAusWerten({
    tag: wert('--tag'), gemessenAm: heute, impressionen: wert('--impressionen'), ctr: wert('--ctr'), aufrufe: wert('--aufrufe'),
    dauer: wert('--dauer'), prozent: wert('--prozent'), halten30: wert('--halten30'), abos: wert('--abos'),
    suche: wert('--suche'), vorschlag: wert('--vorschlag'), notiz: wert('--notiz'),
    titel: existsSync(titelDatei) ? readFileSync(titelDatei, 'utf8').trim() : undefined,
  }, videoLaenge(root));
  const fehler = pruefeEintrag(eintrag);
  if (fehler.length) {
    console.error('Zahlen unvollständig:\n' + fehler.map((f) => `- ${f}`).join('\n'));
    process.exit(1);
  }
  if (!YOUTUBE_ZAHLEN_MESSTAGE.includes(eintrag.tag)) console.warn(`Hinweis: Messtage sind ${YOUTUBE_ZAHLEN_MESSTAGE.join(' und ')} — Tag ${eintrag.tag} wird trotzdem gespeichert.`);
  daten.eintraege = [...daten.eintraege.filter((e) => e.tag !== eintrag.tag), eintrag].sort((a, b) => a.tag - b.tag);
  mkdirSync(dirname(datei), {recursive: true});
  writeFileSync(datei, `${JSON.stringify(daten, null, 2)}\n`);
  console.log(`✓ Zahlen Tag ${eintrag.tag} gespeichert: ${datei}`);
  console.log(`  ${eintrag.impressionen} Impressionen · CTR ${de(eintrag.ctr)} % · ${eintrag.aufrufe} Aufrufe · Ø ${formatDauer(eintrag.durchschnittDauerSek)}${eintrag.prozentAngesehen !== undefined ? ` (${de(eintrag.prozentAngesehen)} %)` : ''} · ${de(eintrag.halten30)} % nach 30 s`);
  zeigeDiagnose(eintrag);
  console.log('\nZeile für VERBESSERUNGEN.md (Regel ergänzen und eintragen):');
  console.log(verbesserungsZeile(heute, video, eintrag));
} else {
  mkdirSync(dirname(datei), {recursive: true});
  writeFileSync(datei, `${JSON.stringify(daten, null, 2)}\n`);
  console.log(`✓ ${video}: veröffentlicht ${daten.veroeffentlicht ?? '–'}; Messtage ${YOUTUBE_ZAHLEN_MESSTAGE.join(' und ')}.`);
  for (const e of daten.eintraege) {
    console.log(`\nTag ${e.tag} (${e.gemessenAm}):`);
    zeigeDiagnose(e);
  }
}
