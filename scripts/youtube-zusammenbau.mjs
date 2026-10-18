#!/usr/bin/env node
// Phase 3 für YouTube-Longform: Wortzeiten → Zeitplan → Medien → Remotion-Registry.
//
//   npm run youtube:zusammenbau -- youtube/<Projekt> [--whisper <whisper.json>] [--vorschau]
//
// --whisper   erzeugt 03-audio/word-timings.json: Die Wörter kommen aus dem Skript
//             (1-script/script.txt), die Zeiten aus Whisper. Whisper schreibt
//             Zahlen als Ziffern und verhört sich gelegentlich — das Skript bleibt die Wahrheit,
//             Whisper liefert nur die Zeit. Nicht zuordenbare Wörter werden zwischen den
//             sicheren Ankern nach Zeichenlänge verteilt.
// --vorschau  erlaubt fehlende Nutzerbilder (sichtbar markiert). Ohne --vorschau bricht der
//             Zusammenbau ab, wenn ein Bild fehlt.
// --untertitel brennt Untertitel ins Video. Standard für YouTube: keine eingebrannten
//             Untertitel (Arman, 10.10.2026); die Zeitstempel-Datei schreibt youtube:render
//             nach 5-export/.
//
// Ergebnis: _intern/06-projektdateien/timeline.json (Frames, Beats, Bilder), Medien unter
// public/youtube/<Projekt>/ und src/youtube-projekt/projekte.generated.ts.

import {copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {basename, relative, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {ACTIVE_WORD_COLOR, AUDIO_INBOX, IMAGE_INBOX, INTERN_DIR, SCRIPT_FILE, SUBTITLE_MODE, YOUTUBE_ENDCARD_SECONDS, YOUTUBE_IMAGE_WARN_HOLD_SECONDS, YOUTUBE_QUALITY_RULES_IDS, internWurzel} from './lib/youtube-contract.mjs';
import {verbindeAudioTeile} from './youtube-audio-teile.mjs';

const args = process.argv.slice(2);
const wert = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const projektArg = args.find((a) => !a.startsWith('--') && a !== wert('--whisper'));
if (!projektArg) {
  console.error('Aufruf: npm run youtube:zusammenbau -- youtube/<Projekt> [--whisper <whisper.json>] [--vorschau]');
  process.exit(1);
}
const repo = process.cwd();
const projektRoot = resolve(projektArg);
const root = internWurzel(projektArg);
const slug = basename(projektRoot);
const vorschau = args.includes('--vorschau');
const fehler = [];
const lies = (p) => JSON.parse(readFileSync(p, 'utf8'));
const schreibJson = (p, d) => writeFileSync(p, JSON.stringify(d, null, 2) + '\n');

// ─── Text-Normalisierung ─────────────────────────────────────────────────────
export const norm = (wort) =>
  wort
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]/g, '');
const tokens = (text) => text.split(/\s+/).map((t) => t.trim()).filter(Boolean);

// ─── Audio ───────────────────────────────────────────────────────────────────
// Aufnahme in mehreren Teilen? Erst zu einer voiceover.wav verbinden.
try {verbindeAudioTeile(projektArg);} catch (error) {console.error(`✗ ${error.message}`); process.exit(1);}
const AUDIO = ['.wav', '.mp3', '.m4a', '.aiff', '.aif'];
const audioDatei = readdirSync(resolve(root, AUDIO_INBOX)).find((f) => AUDIO.some((e) => f.toLowerCase().endsWith(e)));
if (!audioDatei) {
  console.error('Keine Sprachaufnahme in 4-audio-hier-rein/.');
  process.exit(1);
}
const audioPfad = resolve(root, AUDIO_INBOX, audioDatei);
const dauerSek = Number(spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', audioPfad], {encoding: 'utf8'}).stdout.trim());

// ─── 1. Wortzeiten aus Skript + Whisper ──────────────────────────────────────
const timingPfad = resolve(root, '03-audio/word-timings.json');
const whisperArg = wert('--whisper');
if (whisperArg) {
  const skript = readFileSync(resolve(root, SCRIPT_FILE), 'utf8').replace(/^\s*\[[^\]]*\]\s*$/gm, '');
  const s = tokens(skript).map((wort) => ({wort, n: norm(wort)})).filter((t) => t.n);
  const w = lies(resolve(whisperArg)).segments.flatMap((seg) => seg.words).map((x) => ({n: norm(x.word), start: x.start, end: x.end})).filter((x) => x.n);

  // Needleman-Wunsch: gleiche Wörter verankern, alles andere wird interpoliert.
  const gleich = (a, b) => a === b || (a.length >= 5 && b.length >= 5 && (a.startsWith(b) || b.startsWith(a)));
  const N = s.length;
  const M = w.length;
  const dp = Array.from({length: N + 1}, () => new Int32Array(M + 1));
  const weg = Array.from({length: N + 1}, () => new Uint8Array(M + 1));
  for (let i = 1; i <= N; i++) {dp[i][0] = -i; weg[i][0] = 1;}
  for (let j = 1; j <= M; j++) {dp[0][j] = -j; weg[0][j] = 2;}
  for (let i = 1; i <= N; i++) {
    for (let j = 1; j <= M; j++) {
      const diag = dp[i - 1][j - 1] + (gleich(s[i - 1].n, w[j - 1].n) ? 3 : -1);
      const hoch = dp[i - 1][j] - 1;
      const links = dp[i][j - 1] - 1;
      if (diag >= hoch && diag >= links) {dp[i][j] = diag; weg[i][j] = 0;}
      else if (hoch >= links) {dp[i][j] = hoch; weg[i][j] = 1;}
      else {dp[i][j] = links; weg[i][j] = 2;}
    }
  }
  const anker = new Array(N).fill(null);
  for (let i = N, j = M; i > 0 || j > 0;) {
    if (i > 0 && j > 0 && weg[i][j] === 0) {
      if (gleich(s[i - 1].n, w[j - 1].n)) anker[i - 1] = w[j - 1];
      i--; j--;
    } else if (i > 0 && (j === 0 || weg[i][j] === 1)) i--;
    else j--;
  }
  // Lücken zwischen Ankern nach Zeichenlänge füllen.
  const woerter = s.map((t, i) => ({word: t.wort, start: anker[i]?.start ?? null, end: anker[i]?.end ?? null, anker: Boolean(anker[i])}));
  for (let i = 0; i < N;) {
    if (woerter[i].anker) {i++; continue;}
    let k = i;
    while (k < N && !woerter[k].anker) k++;
    const von = i > 0 ? woerter[i - 1].end : 0;
    const bis = k < N ? woerter[k].start : dauerSek;
    const laengen = woerter.slice(i, k).map((x) => norm(x.word).length || 1);
    const summe = laengen.reduce((a, b) => a + b, 0);
    let t = von;
    for (let x = i; x < k; x++) {
      const d = ((bis - von) * laengen[x - i]) / summe;
      woerter[x].start = t;
      woerter[x].end = t + d;
      t += d;
    }
    i = k;
  }
  for (const x of woerter) {
    x.start = Math.round(x.start * 1000) / 1000;
    x.end = Math.round(Math.max(x.end, x.start) * 1000) / 1000;
  }
  const quote = woerter.filter((x) => x.anker).length / N;
  if (quote < 0.8) fehler.push(`Nur ${(quote * 100).toFixed(0)} % der Skriptwörter in der Aufnahme wiedergefunden — Aufnahme und Skript prüfen.`);

  // Untertitel: ganze Sätze; Sätze über 11 Wörter werden in gleich lange Teile geteilt,
  // bevorzugt hinter einem Komma oder Doppelpunkt nahe der Mitte — nie ein Wort allein.
  const saetze = [];
  const ganze = [];
  let satz = [];
  for (const x of woerter) {
    satz.push(x);
    if (/[.!?]$/.test(x.word)) {ganze.push(satz); satz = [];}
  }
  if (satz.length) ganze.push(satz);
  const teile = (ws) => {
    if (ws.length <= 11) return [ws];
    const n = Math.ceil(ws.length / 10);
    const ziel = Math.round(ws.length / n);
    let schnitt = ziel;
    for (let d = 0; d <= 3; d++) {
      if (/[,:;]$/.test(ws[ziel - 1 + d]?.word ?? '')) {schnitt = ziel + d; break;}
      if (/[,:;]$/.test(ws[ziel - 1 - d]?.word ?? '')) {schnitt = ziel - d; break;}
    }
    return [ws.slice(0, schnitt), ...teile(ws.slice(schnitt))];
  };
  for (const g of ganze) {
    for (const t of teile(g)) saetze.push({text: t.map((x) => x.word).join(' '), start: t[0].start, end: t[t.length - 1].end, words: t.map(({word, start, end}) => ({word, start, end}))});
  }
  schreibJson(timingPfad, {
    version: 'finanzneo-caption-v1',
    language: 'de',
    source: `4-audio-hier-rein/${audioDatei}`,
    generatedAt: new Date().toISOString(),
    duration: Math.round(dauerSek * 1000) / 1000,
    wordCount: woerter.length,
    fps: 30,
    subtitleMode: SUBTITLE_MODE,
    activeWordColor: ACTIVE_WORD_COLOR,
    alignment: {method: 'script-text-with-whisper-anchors', anchoredShare: Math.round(quote * 1000) / 1000},
    words: woerter.map(({word, start, end}) => ({word, start, end})),
    sentences: saetze,
  });
  console.log(`✓ Wortzeiten: ${woerter.length} Skriptwörter, ${(quote * 100).toFixed(1)} % sicher in der Aufnahme verankert.`);
}

// ─── 2. Zeitplan ─────────────────────────────────────────────────────────────
const timing = lies(timingPfad);
const fps = 30;
const index = lies(resolve(root, '04-visuals/visual-index.json'));
const skriptWoerter = timing.words;
const sn = skriptWoerter.map((x) => norm(x.word));
const finde = (cue, ab) => {
  const c = tokens(cue).map(norm).filter(Boolean);
  for (let i = ab; i <= sn.length - c.length; i++) if (c.every((t, k) => sn[i + k] === t)) return i;
  return -1;
};
let cursor = 0;
const visuals = [];
for (const v of index.visuals) {
  const i = v.startCue ? finde(v.startCue, cursor) : -1;
  if (i < 0) {fehler.push(`${v.id}: startCue „${v.startCue}“ nicht im Skript/Timing gefunden (ab Wort ${cursor}).`); continue;}
  cursor = i;
  const start = visuals.length === 0 ? 0 : Math.round(skriptWoerter[i].start * fps);
  let beatCursor = i;
  const beats = (v.beatCues ?? []).map((cue) => {
    const b = finde(cue, beatCursor);
    if (b < 0) {fehler.push(`${v.id}: beatCue „${cue}“ nicht gefunden.`); return null;}
    beatCursor = b;
    return Math.max(0, Math.round(skriptWoerter[b].start * fps) - start);
  });
  // Bild-Akzente: kurze Hinweise auf einem Standbild, jeweils beim gesprochenen Wort.
  let akzentCursor = i;
  const akzente = (v.akzente ?? []).map((a) => {
    const b = finde(a.cue, akzentCursor);
    if (b < 0) {fehler.push(`${v.id}: Akzent-Cue „${a.cue}“ nicht gefunden.`); return null;}
    akzentCursor = b;
    return {ab: Math.max(0, Math.round(skriptWoerter[b].start * fps) - start), text: a.text, ton: a.ton ?? 'neutral'};
  }).filter(Boolean);
  visuals.push({id: v.id, type: v.type, startFrame: start, beats, akzente, googleFlowFileName: v.googleFlowFileName});
}
const sprechEnde = Math.ceil((dauerSek + 0.8) * fps);
visuals.forEach((v, k) => {
  v.durationFrames = (k + 1 < visuals.length ? visuals[k + 1].startFrame : sprechEnde) - v.startFrame;
  if (v.durationFrames <= 0) fehler.push(`${v.id}: Dauer ${v.durationFrames} Frames — Reihenfolge der startCues prüfen.`);
});
// Qualitätsregeln: Endkarte für die YouTube-Endelemente + Warnung bei zu langen Standbildern.
const qualitaet = YOUTUBE_QUALITY_RULES_IDS.includes(index.qualityRules);
if (qualitaet) visuals.push({id: 'endkarte', type: 'endkarte', startFrame: sprechEnde, durationFrames: YOUTUBE_ENDCARD_SECONDS * fps, beats: [], akzente: []});
const gesamt = qualitaet ? sprechEnde + YOUTUBE_ENDCARD_SECONDS * fps : sprechEnde;
const langeBilder = visuals.filter((v) => v.type === 'image').map((v) => {
  const marken = [0, ...v.akzente.map((a) => a.ab), v.durationFrames].sort((a, b) => a - b);
  return {id: v.id, sek: Math.max(...marken.slice(1).map((m, k) => m - marken[k])) / fps};
}).filter((x) => x.sek > YOUTUBE_IMAGE_WARN_HOLD_SECONDS);

// ─── 3. Medien nach public/ ──────────────────────────────────────────────────
const publicDir = resolve(repo, 'public/youtube', slug);
mkdirSync(resolve(publicDir, 'bilder'), {recursive: true});
copyFileSync(audioPfad, resolve(publicDir, audioDatei));
const inbox = resolve(root, IMAGE_INBOX);
for (const v of visuals) {
  if (v.type !== 'image') continue;
  const quelle = resolve(inbox, v.googleFlowFileName ?? '');
  if (v.googleFlowFileName && existsSync(quelle)) {
    copyFileSync(quelle, resolve(publicDir, 'bilder', v.googleFlowFileName));
    v.bild = `youtube/${slug}/bilder/${v.googleFlowFileName}`;
  } else {
    v.bild = null;
    if (!vorschau) fehler.push(`${v.id}: Bild fehlt: 3-bilder-hier-rein/${v.googleFlowFileName}`);
  }
}

if (fehler.length) {
  console.error('\nZusammenbau abgebrochen:\n');
  fehler.forEach((f) => console.error(`- ${f}`));
  process.exit(1);
}

const captions = timing.sentences.map((s, k, alle) => ({
  start: Math.round(s.start * fps),
  end: Math.round((k + 1 < alle.length ? Math.min(alle[k + 1].start, s.end + 0.6) : s.end + 0.6) * fps),
  words: s.words.map((x) => ({text: x.word, start: Math.round(x.start * fps), end: Math.round(x.end * fps)})),
}));
const zeitplan = {
  version: 2,
  title: index.title,
  fps,
  timingSource: '03-audio/word-timings.json',
  cutRule: 'voice-beat-and-chapter-driven',
  fixedVisualCount: false,
  vorschau,
  durationFrames: gesamt,
  audio: `youtube/${slug}/${audioDatei}`,
  untertitel: args.includes('--untertitel'),
  visuals: visuals.map((v) => {
    const ohneDatei = {...v};
    delete ohneDatei.googleFlowFileName;
    return ohneDatei;
  }),
  captions,
};
schreibJson(resolve(root, '06-projektdateien/timeline.json'), zeitplan);

// ─── 4. Registry für Remotion ────────────────────────────────────────────────
const projekte = readdirSync(resolve(repo, 'youtube'), {withFileTypes: true})
  .filter((d) => d.isDirectory() && existsSync(resolve(repo, 'youtube', d.name, INTERN_DIR, '06-projektdateien/timeline.json')))
  .map((d) => d.name)
  .filter((name) => {
    try {return Array.isArray(lies(resolve(repo, 'youtube', name, INTERN_DIR, '06-projektdateien/timeline.json')).captions);} catch {return false;}
  })
  .sort();
const zeilen = ['// GENERIERT von scripts/youtube-zusammenbau.mjs — nicht von Hand ändern.', "import type React from 'react';", "import type {YouTubeZeitplan} from './YouTubeVideo';", ''];
const eintraege = [];
projekte.forEach((name, p) => {
  const idx = lies(resolve(repo, 'youtube', name, INTERN_DIR, '04-visuals/visual-index.json'));
  zeilen.push(`import zeitplan${p} from '../../youtube/${name}/${INTERN_DIR}/06-projektdateien/timeline.json';`);
  const anim = [];
  for (const v of idx.visuals.filter((x) => x.animationSourceFile)) {
    const pfad = relative(resolve(repo, 'src/youtube-projekt'), resolve(repo, 'youtube', name, INTERN_DIR, v.animationSourceFile)).replace(/\.tsx$/, '');
    const alias = `P${p}_${v.id.replace(/-/g, '_')}`;
    zeilen.push(`import {${v.animationExport} as ${alias}} from '${pfad}';`);
    anim.push(`'${v.id}': ${alias}`);
  }
  eintraege.push(`  {id: 'YouTube-${name.replace(/[^a-zA-Z0-9-]/g, '-')}', zeitplan: zeitplan${p} as unknown as YouTubeZeitplan, animationen: {${anim.join(', ')}}},`);
});
zeilen.push('', 'export const YOUTUBE_PROJEKTE: Array<{id: string; zeitplan: YouTubeZeitplan; animationen: Record<string, React.FC<{beats?: number[]}>>}> = [', ...eintraege, '];', '');
writeFileSync(resolve(repo, 'src/youtube-projekt/projekte.generated.ts'), zeilen.join('\n'));

console.log(`✓ Zeitplan: ${visuals.length} Visuals, ${(gesamt / fps).toFixed(1)} s${qualitaet ? ` inkl. ${YOUTUBE_ENDCARD_SECONDS} s Endkarte` : ''}${vorschau ? ' (Vorschau, fehlende Bilder markiert)' : ''}.`);
if (langeBilder.length) console.log(`⚠ Standbilder über ${YOUTUBE_IMAGE_WARN_HOLD_SECONDS} s: ${langeBilder.map((x) => `${x.id} ${x.sek.toFixed(1)} s`).join(', ')} — beim nächsten Mal Bild teilen oder akzente[] setzen.`);
console.log(`  Composition: YouTube-${slug.replace(/[^a-zA-Z0-9-]/g, "-")}`);
