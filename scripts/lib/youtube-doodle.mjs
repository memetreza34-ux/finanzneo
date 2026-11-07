// Doodle-Bilder für YouTube-Folien (finanzneo-youtube-doodle-v1, Arman 31.10.2026).
//
// Arman: „wie Finanzbär, aber ohne KI und kostenlos“. Standard sind handgezeichnete Freehand-Doodles
// (Streamline, CC BY 4.0) — schwarze Kritzellinie mit einem Farbakzent, genau der Look von
// Finanzbärs Glühbirne und Schere. Geholt über die freie Iconify-API, nur aus geprüften Sammlungen.
// Fehlt dort ein Motiv: freie Emoji-Sammlungen; erst danach ein Flow-Sticker (youtube-sticker.mjs).
// Kanonische Regel: docs/YOUTUBE-BILDMIX-UND-COVER.md

import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';

export const YOUTUBE_DOODLE_STANDARD_ID = 'finanzneo-youtube-doodle-v1';
/** Ablage unter public/ (staticFile), je Sammlung ein Ordner. */
export const YOUTUBE_DOODLE_DIR = 'doodles';
export const YOUTUBE_DOODLE_API = 'https://api.iconify.design';

/** Erlaubte Sammlungen in Suchreihenfolge. `nachweis` landet automatisch in der Videobeschreibung. */
export const YOUTUBE_DOODLE_SAMMLUNGEN = {
  'streamline-freehand-color': {rang: 1, lizenz: 'CC BY 4.0', nachweis: 'Streamline Freehand (streamlinehq.com), CC BY 4.0'},
  'streamline-freehand': {rang: 2, lizenz: 'CC BY 4.0', nachweis: 'Streamline Freehand (streamlinehq.com), CC BY 4.0'},
  'fluent-emoji-flat': {rang: 3, lizenz: 'MIT', nachweis: null},
  noto: {rang: 4, lizenz: 'Apache 2.0', nachweis: null},
};

/** Freehand-Akzent (Original Blau #0C6FFF) → FinanzNeo-Grün, damit Doodles zur Kanalfarbe passen. */
export const YOUTUBE_DOODLE_AKZENT = '#4F8A67';
export const faerbeDoodle = (svg) => svg.replace(/#0c6fff/gi, YOUTUBE_DOODLE_AKZENT);

/** Doodle-Verweis „sammlung:name“ (z. B. streamline-freehand-color:saving-piggy-bank). */
export const YOUTUBE_DOODLE_ID = /^([a-z0-9-]+):([a-z0-9-]+)$/;
export const istDoodle = (wert) => typeof wert === 'string' && YOUTUBE_DOODLE_ID.test(wert);
export const doodleTeile = (id) => {
  const [, sammlung, name] = YOUTUBE_DOODLE_ID.exec(id) ?? [];
  return {sammlung, name};
};
export const youtubeDoodleDatei = (id) => {
  const {sammlung, name} = doodleTeile(id);
  return `${YOUTUBE_DOODLE_DIR}/${sammlung}/${name}.svg`;
};
export const youtubeDoodleQuelle = (id) => {
  const {sammlung, name} = doodleTeile(id);
  return `${YOUTUBE_DOODLE_API}/${sammlung}/${name}.svg`;
};
export const doodleVorhanden = (repo, id) => existsSync(resolve(repo, 'public', youtubeDoodleDatei(id)));

export const pruefeDoodleVerweis = (id, wo, doodle) => {
  if (!istDoodle(doodle)) return [`${id}: ${wo} „${doodle}“ ist kein Doodle-Verweis „sammlung:name“.`];
  const {sammlung} = doodleTeile(doodle);
  if (!YOUTUBE_DOODLE_SAMMLUNGEN[sammlung]) return [`${id}: ${wo} stammt aus „${sammlung}“ — erlaubt sind nur ${Object.keys(YOUTUBE_DOODLE_SAMMLUNGEN).join(', ')}.`];
  return [];
};

/** Bildnachweise für die Videobeschreibung (je Sammlung einmal). */
export const doodleNachweise = (ids) => [...new Set(ids.map((id) => YOUTUBE_DOODLE_SAMMLUNGEN[doodleTeile(id).sammlung]?.nachweis).filter(Boolean))];

/** Lädt fehlende Doodles nach public/doodles/. Gibt die neu geladenen IDs zurück. */
export const ladeDoodles = async (repo, ids) => {
  const neu = [];
  for (const id of new Set(ids)) {
    if (doodleVorhanden(repo, id)) continue;
    const antwort = await fetch(youtubeDoodleQuelle(id));
    const svg = antwort.ok ? await antwort.text() : '';
    if (!svg.startsWith('<svg')) throw new Error(`Doodle ${id} nicht gefunden (${antwort.status}).`);
    const ziel = resolve(repo, 'public', youtubeDoodleDatei(id));
    mkdirSync(dirname(ziel), {recursive: true});
    writeFileSync(ziel, faerbeDoodle(svg));
    neu.push(id);
  }
  return neu;
};
