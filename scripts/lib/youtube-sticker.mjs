// Metapher-Sticker für YouTube-Folien (finanzneo-youtube-sticker-v1, Arman 31.10.2026).
//
// Wie Finanzbär: kleine, simple Metapher-Bilder frei auf Weiß (Glühbirne, Schere, Motor mit
// Begriffen drumherum, Detektiv mit Lupe). Flow zeichnet jeden Sticker EINMAL in einem festen
// Stil; danach liegt er in der Kanal-Bibliothek public/sticker/ und wird in jedem Video
// wiederverwendet. Pro Video entstehen so nur noch wenige neue Bilder.
// Kanonische Regel: docs/YOUTUBE-BILDMIX-UND-COVER.md

import {spawnSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';

export const YOUTUBE_STICKER_STANDARD_ID = 'finanzneo-youtube-sticker-v1';
/** Bibliothek unter public/ (staticFile) — wächst mit jedem Video. */
export const YOUTUBE_STICKER_DIR = 'sticker';
/** Name → {motiv, seit, projekt}. */
export const YOUTUBE_STICKER_KATALOG = `${YOUTUBE_STICKER_DIR}/katalog.json`;
export const YOUTUBE_STICKER_NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Fester Flow-Stil, damit alle Sticker wie aus einem Set aussehen. */
export const YOUTUBE_STICKER_STIL = `STICKER STYLE (FinanzNeo sticker set — identical for every sticker):
Simple flat 2D cartoon sticker illustration in the style of a clean explainer-video clipart. Clean dark outline of even medium weight, flat fills in 2–4 friendly colors with a warm yellow accent, almost no shading, no gradients, no texture, no 3D look, not a photo.
ONE clear subject (or a tiny group) that shows the metaphor at first glance, centered, filling about 70 % of the frame, with generous empty space around it.
Isolated on a pure flat white background (#FFFFFF): no scene, no floor, no frame, no border, no drop shadow, no vignette.
Square 1:1 format.
No text, no letters, no numbers and no logos anywhere — unless a word is written in quotes in the motif; then only exactly that word, in German.`;

export const youtubeStickerDatei = (name) => `${YOUTUBE_STICKER_DIR}/${name}.png`;
export const youtubeStickerFlowDatei = (name) => `YouTube Sticker - ${name}.png`;

/** Katalog der Kanal-Bibliothek (repo/public/sticker/katalog.json). */
export const leseStickerKatalog = (repo) => {
  const pfad = resolve(repo, 'public', YOUTUBE_STICKER_KATALOG);
  return existsSync(pfad) ? JSON.parse(readFileSync(pfad, 'utf8')) : {};
};
export const stickerVorhanden = (repo, name) => existsSync(resolve(repo, 'public', youtubeStickerDatei(name)));

/** Prüft einen Sticker-Verweis in einer Folie. `neu` = noch nicht in der Bibliothek → Motiv für Flow Pflicht. */
export const pruefeStickerVerweis = (id, wo, sticker, motiv, neu) => {
  const fehler = [];
  if (typeof sticker !== 'string' || !YOUTUBE_STICKER_NAME.test(sticker)) fehler.push(`${id}: ${wo}.sticker braucht einen Namen in kleinbuchstaben-mit-bindestrich (z. B. „detektiv-lupe“).`);
  else if (neu && (typeof motiv !== 'string' || motiv.trim().length < 12)) fehler.push(`${id}: Sticker „${sticker}“ ist noch nicht in der Bibliothek — ${wo}.motiv (englische Motivbeschreibung für Flow) fehlt.`);
  return fehler;
};

/**
 * Übernimmt ein fertiges Flow-Bild in die Bibliothek: weißen Rand wegschneiden (ffmpeg cropdetect auf
 * dem invertierten Bild), gleichmäßig 4 % Luft lassen, Katalog-Eintrag schreiben.
 */
export const importiereSticker = ({repo, quelle, name, motiv, projekt}) => {
  const ziel = resolve(repo, 'public', youtubeStickerDatei(name));
  mkdirSync(dirname(ziel), {recursive: true});
  const messung = spawnSync('ffmpeg', ['-hide_banner', '-i', quelle, '-vf', 'negate,cropdetect=limit=0.06:round=2:skip=0:reset=0', '-f', 'null', '-'], {encoding: 'utf8'});
  const crop = [...(messung.stderr ?? '').matchAll(/crop=(\d+):(\d+):(\d+):(\d+)/g)].pop();
  const filter = crop ? `crop=${crop[1]}:${crop[2]}:${crop[3]}:${crop[4]},pad=iw*1.08:ih*1.08:(ow-iw)/2:(oh-ih)/2:white` : 'null';
  const lauf = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', quelle, '-vf', filter, ziel], {encoding: 'utf8'});
  if (lauf.status !== 0) throw new Error(`Sticker ${name}: ffmpeg fehlgeschlagen — ${lauf.stderr}`);
  const katalogPfad = resolve(repo, 'public', YOUTUBE_STICKER_KATALOG);
  const katalog = leseStickerKatalog(repo);
  katalog[name] = {motiv: motiv ?? katalog[name]?.motiv ?? null, seit: new Date().toISOString().slice(0, 10), projekt};
  writeFileSync(katalogPfad, `${JSON.stringify(Object.fromEntries(Object.entries(katalog).sort(([a], [b]) => a.localeCompare(b))), null, 2)}\n`);
  return ziel;
};
