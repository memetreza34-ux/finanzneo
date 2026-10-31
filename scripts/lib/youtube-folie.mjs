// Erklär-Folien für YouTube-Longform (finanzneo-youtube-folie-v2, Arman 30.10.2026).
//
// Aus der Analyse von Finanzbär: Der Großteil eines erfolgreichen Finanzvideos sind schlichte
// weiße Folien — wenig Text, ein farbiges 3D-Icon, große Zahlen, Pfeile, Vergleiche. Jedes Teil
// erscheint beim gesprochenen Wort; betonte Stellen bekommen den gelben FinanzNeo-Marker.
// Icons nur aus dem Katalog scripts/lib/youtube-icons.mjs.
// Kanonische Regel: docs/YOUTUBE-BILDMIX-UND-COVER.md

import {istYouTubeIcon} from './youtube-icons.mjs';
import {pruefeStickerVerweis} from './youtube-sticker.mjs';

export const YOUTUBE_FOLIE_STANDARD_ID = 'finanzneo-youtube-folie-v2';
export const YOUTUBE_FOLIE_MAX_ZEILEN = 5;
export const YOUTUBE_FOLIE_MAX_ZEICHEN = 46;
export const YOUTUBE_FOLIE_TITEL_MAX_ZEICHEN = 40;
/** Kurze Beschriftungen neben Icons (Ablauf, Vergleich). */
export const YOUTUBE_FOLIE_KURZ_MAX_ZEICHEN = 24;
export const YOUTUBE_FOLIE_FORMEN = ['zeilen', 'zahl', 'begriff', 'ablauf', 'vergleich', 'metapher', 'wolke', 'zitat'];
export const YOUTUBE_FOLIE_ZITAT_MAX_ZEICHEN = 220;

const text = (wert) => typeof wert === 'string' && wert.trim() && !wert.trim().startsWith('[');

/**
 * Genau eine Form pro Folie, dazu optional `titel` und `icon`:
 *   zeilen:    [{text, cue, betont?}]                           Stichpunkte, nummeriert
 *   zahl:      {wert, label, cue, ton?: 'gruen'|'rot'}          große Zahl (mit icon daneben)
 *   begriff:   {text, cue, betont?}                             großes icon (Pflicht), darunter der Begriff
 *   ablauf:    {von:{icon,text,cue}, nach:{icon,text,cue}, punkte?:[{text,cue}]}   A → B
 *   vergleich: [{icon, text, cue, oben?, hinweis?}]             2–3 Varianten untereinander
 *   metapher:  {sticker, motiv?, cue, text?, betont?}          Metapher-Sticker groß, optional ein Satz darunter
 *   wolke:     {sticker, motiv?, woerter:[{text,cue}]}          Sticker in der Mitte, 3–6 Begriffe erscheinen drumherum
 *   zitat:     {text, von, cue, betont?}                        Zitat, kursiv, mit Quelle
 * Sticker kommen aus der Kanal-Bibliothek (scripts/lib/youtube-sticker.mjs). `motiv` ist nur Pflicht, wenn
 * der Sticker dort noch fehlt — `optionen.stickerVorhanden(name)` sagt das (ohne Funktion: keine Prüfung).
 */
export const pruefeFoliePlan = (visual, optionen = {}) => {
  const id = visual?.id ?? 'Folie';
  const f = visual?.folie;
  if (!f || typeof f !== 'object') return [`${id}: folie fehlt (eine Form aus ${YOUTUBE_FOLIE_FORMEN.join(', ')}).`];
  const fehler = [];
  const formen = YOUTUBE_FOLIE_FORMEN.filter((form) => f[form] !== undefined);
  if (formen.length !== 1) return [`${id}: folie braucht genau eine Form (${YOUTUBE_FOLIE_FORMEN.join(' | ')}), hat ${formen.length ? formen.join(' + ') : 'keine'}.`];
  const form = formen[0];

  const icon = (wert, wo) => {
    if (!text(wert)) fehler.push(`${id}: ${wo} fehlt.`);
    else if (!istYouTubeIcon(wert)) fehler.push(`${id}: ${wo} „${wert}“ ist nicht im Icon-Katalog (npm run youtube:icons -- --liste).`);
  };
  const kurz = (wert, wo, max = YOUTUBE_FOLIE_KURZ_MAX_ZEICHEN) => {
    if (!text(wert)) fehler.push(`${id}: ${wo} fehlt.`);
    else if (wert.length > max) fehler.push(`${id}: ${wo} hat ${wert.length} Zeichen (max. ${max}).`);
  };
  const cue = (wert, wo) => {
    if (!text(wert)) fehler.push(`${id}: ${wo}.cue fehlt (gesprochenes Wort, bei dem es erscheint).`);
  };
  const betont = (z, wo) => {
    if (z?.betont !== undefined && (!text(z.betont) || !String(z.text ?? '').includes(z.betont))) fehler.push(`${id}: ${wo}.betont muss ein Teil des Texts sein.`);
  };

  if (f.titel !== undefined) kurz(f.titel, 'folie.titel', YOUTUBE_FOLIE_TITEL_MAX_ZEICHEN);
  if (f.icon !== undefined) icon(f.icon, 'folie.icon');

  if (form === 'zeilen') {
    const zeilen = Array.isArray(f.zeilen) ? f.zeilen : [];
    if (zeilen.length < 1 || zeilen.length > YOUTUBE_FOLIE_MAX_ZEILEN) fehler.push(`${id}: folie.zeilen braucht 1–${YOUTUBE_FOLIE_MAX_ZEILEN} Zeilen.`);
    zeilen.forEach((z, k) => {
      if (!text(z?.text)) fehler.push(`${id}: folie.zeilen[${k}].text fehlt.`);
      else if (z.text.length > YOUTUBE_FOLIE_MAX_ZEICHEN) fehler.push(`${id}: folie.zeilen[${k}] hat ${z.text.length} Zeichen (max. ${YOUTUBE_FOLIE_MAX_ZEICHEN}) — kürzen, eine Folie ist kein Fließtext.`);
      cue(z?.cue, `folie.zeilen[${k}]`);
      betont(z, `folie.zeilen[${k}]`);
    });
  } else if (form === 'zahl') {
    if (!text(f.zahl.wert) || f.zahl.wert.length > 12) fehler.push(`${id}: folie.zahl.wert fehlt oder ist länger als 12 Zeichen (z. B. „540 €“).`);
    kurz(f.zahl.label, 'folie.zahl.label', YOUTUBE_FOLIE_MAX_ZEICHEN);
    cue(f.zahl.cue, 'folie.zahl');
    if (f.zahl.ton !== undefined && !['gruen', 'rot'].includes(f.zahl.ton)) fehler.push(`${id}: folie.zahl.ton ist gruen oder rot.`);
  } else if (form === 'begriff') {
    icon(f.icon, 'folie.icon (bei begriff Pflicht)');
    kurz(f.begriff.text, 'folie.begriff.text', YOUTUBE_FOLIE_TITEL_MAX_ZEICHEN);
    cue(f.begriff.cue, 'folie.begriff');
    betont(f.begriff, 'folie.begriff');
  } else if (form === 'ablauf') {
    for (const seite of ['von', 'nach']) {
      icon(f.ablauf[seite]?.icon, `folie.ablauf.${seite}.icon`);
      kurz(f.ablauf[seite]?.text, `folie.ablauf.${seite}.text`);
      cue(f.ablauf[seite]?.cue, `folie.ablauf.${seite}`);
    }
    const punkte = f.ablauf.punkte ?? [];
    if (!Array.isArray(punkte) || punkte.length > 3) fehler.push(`${id}: folie.ablauf.punkte höchstens 3.`);
    else punkte.forEach((p, k) => {kurz(p?.text, `folie.ablauf.punkte[${k}].text`); cue(p?.cue, `folie.ablauf.punkte[${k}]`);});
  } else if (form === 'metapher' || form === 'wolke') {
    const teil = f[form];
    const neu = optionen.stickerVorhanden ? !optionen.stickerVorhanden(teil?.sticker) : false;
    fehler.push(...pruefeStickerVerweis(id, `folie.${form}`, teil?.sticker, teil?.motiv, neu));
    if (form === 'metapher') {
      cue(teil?.cue, 'folie.metapher');
      if (teil?.text !== undefined) kurz(teil.text, 'folie.metapher.text', YOUTUBE_FOLIE_MAX_ZEICHEN);
      betont(teil, 'folie.metapher');
    } else {
      const woerter = Array.isArray(teil?.woerter) ? teil.woerter : [];
      if (woerter.length < 3 || woerter.length > 6) fehler.push(`${id}: folie.wolke.woerter braucht 3–6 Begriffe.`);
      woerter.forEach((w, k) => {kurz(w?.text, `folie.wolke.woerter[${k}].text`, 16); cue(w?.cue, `folie.wolke.woerter[${k}]`);});
    }
  } else if (form === 'zitat') {
    kurz(f.zitat.text, 'folie.zitat.text', YOUTUBE_FOLIE_ZITAT_MAX_ZEICHEN);
    kurz(f.zitat.von, 'folie.zitat.von', 40);
    cue(f.zitat.cue, 'folie.zitat');
    betont(f.zitat, 'folie.zitat');
  } else if (form === 'vergleich') {
    const zeilen = Array.isArray(f.vergleich) ? f.vergleich : [];
    if (zeilen.length < 2 || zeilen.length > 3) fehler.push(`${id}: folie.vergleich braucht 2–3 Varianten.`);
    zeilen.forEach((z, k) => {
      icon(z?.icon, `folie.vergleich[${k}].icon`);
      kurz(z?.text, `folie.vergleich[${k}].text`);
      cue(z?.cue, `folie.vergleich[${k}]`);
      if (z?.oben !== undefined) kurz(z.oben, `folie.vergleich[${k}].oben`);
      if (z?.hinweis !== undefined) kurz(z.hinweis, `folie.vergleich[${k}].hinweis`, 20);
    });
  }
  return fehler;
};

/** Alle Cues einer Folie in Sprechreihenfolge (jeder ist neue sichtbare Information). */
export const folieCues = (folie) => {
  if (!folie) return [];
  if (folie.zahl) return [folie.zahl.cue].filter(Boolean);
  if (folie.begriff) return [folie.begriff.cue].filter(Boolean);
  if (folie.ablauf) return [folie.ablauf.von?.cue, folie.ablauf.nach?.cue, ...(folie.ablauf.punkte ?? []).map((p) => p.cue)].filter(Boolean);
  if (folie.vergleich) return folie.vergleich.map((z) => z.cue).filter(Boolean);
  if (folie.metapher) return [folie.metapher.cue].filter(Boolean);
  if (folie.wolke) return (folie.wolke.woerter ?? []).map((w) => w.cue).filter(Boolean);
  if (folie.zitat) return [folie.zitat.cue].filter(Boolean);
  return (folie.zeilen ?? []).map((z) => z.cue).filter(Boolean);
};

/** Sichtbarer Text einer Folie (für Bezugsprüfungen). */
export const folieText = (folie) => {
  if (!folie) return '';
  const teile = [folie.titel, folie.zahl?.wert, folie.zahl?.label, folie.begriff?.text, folie.ablauf?.von?.text, folie.ablauf?.nach?.text, ...(folie.ablauf?.punkte ?? []).map((p) => p.text), ...(folie.vergleich ?? []).flatMap((z) => [z.oben, z.text, z.hinweis]), ...(folie.zeilen ?? []).map((z) => z.text), folie.metapher?.text, ...(folie.wolke?.woerter ?? []).map((w) => w.text), folie.zitat?.text];
  return teile.filter(Boolean).join(' ');
};

/** Alle Icons einer Folie. */
export const folieIcons = (folie) => [folie?.icon, folie?.ablauf?.von?.icon, folie?.ablauf?.nach?.icon, ...(folie?.vergleich ?? []).map((z) => z.icon)].filter(Boolean);

/** Sticker einer Folie mit Flow-Motiv (metapher, wolke). */
export const folieSticker = (folie) => [folie?.metapher, folie?.wolke].filter((t) => t?.sticker).map((t) => ({name: t.sticker, motiv: t.motiv}));
