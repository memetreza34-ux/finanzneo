// Erklär-Folien für YouTube-Longform (finanzneo-youtube-folie-v1, Arman 30.10.2026).
//
// Aus der Analyse von Finanzbär: Der Großteil eines erfolgreichen Finanzvideos sind schlichte
// Folien — Stichpunkte, die beim gesprochenen Wort erscheinen, und große Zahlen. Bei uns auf
// Kanal-Creme mit demselben gelben Marker wie Belege und Cover.
// Kanonische Regel: docs/YOUTUBE-BILDMIX-UND-COVER.md

export const YOUTUBE_FOLIE_STANDARD_ID = 'finanzneo-youtube-folie-v1';
export const YOUTUBE_FOLIE_MAX_ZEILEN = 5;
export const YOUTUBE_FOLIE_MAX_ZEICHEN = 46;
export const YOUTUBE_FOLIE_TITEL_MAX_ZEICHEN = 40;

const text = (wert) => typeof wert === 'string' && wert.trim() && !wert.trim().startsWith('[');

/**
 * Zwei Formen:
 *   liste: {titel?, zeilen: [{text, cue, betont?}]} — jede Zeile erscheint bei ihrem cue,
 *          `betont` (Teil des Texts) bekommt den gelben Marker.
 *   zahl:  {zahl: {wert, label, cue}, titel?}        — große Zahl, die beim cue einrastet.
 */
export const pruefeFoliePlan = (visual) => {
  const id = visual?.id ?? 'Folie';
  const f = visual?.folie;
  if (!f || typeof f !== 'object') return [`${id}: folie fehlt ({titel?, zeilen:[{text, cue, betont?}]} oder {zahl:{wert, label, cue}}).`];
  const fehler = [];
  if (f.titel !== undefined && (!text(f.titel) || f.titel.length > YOUTUBE_FOLIE_TITEL_MAX_ZEICHEN)) fehler.push(`${id}: folie.titel höchstens ${YOUTUBE_FOLIE_TITEL_MAX_ZEICHEN} Zeichen.`);
  if (f.zahl) {
    if (!text(f.zahl.wert) || f.zahl.wert.length > 12) fehler.push(`${id}: folie.zahl.wert fehlt oder ist länger als 12 Zeichen (z. B. „540 €“).`);
    if (!text(f.zahl.label) || f.zahl.label.length > YOUTUBE_FOLIE_MAX_ZEICHEN) fehler.push(`${id}: folie.zahl.label fehlt oder ist zu lang.`);
    if (!text(f.zahl.cue)) fehler.push(`${id}: folie.zahl.cue fehlt (gesprochenes Wort, bei dem die Zahl einrastet).`);
    if (f.zeilen) fehler.push(`${id}: folie hat entweder zahl oder zeilen, nicht beides.`);
    return fehler;
  }
  const zeilen = Array.isArray(f.zeilen) ? f.zeilen : [];
  if (zeilen.length < 1 || zeilen.length > YOUTUBE_FOLIE_MAX_ZEILEN) fehler.push(`${id}: folie.zeilen braucht 1–${YOUTUBE_FOLIE_MAX_ZEILEN} Zeilen.`);
  zeilen.forEach((z, k) => {
    if (!text(z?.text)) fehler.push(`${id}: folie.zeilen[${k}].text fehlt.`);
    else if (z.text.length > YOUTUBE_FOLIE_MAX_ZEICHEN) fehler.push(`${id}: folie.zeilen[${k}] hat ${z.text.length} Zeichen (max. ${YOUTUBE_FOLIE_MAX_ZEICHEN}) — kürzen, eine Folie ist kein Fließtext.`);
    if (!text(z?.cue)) fehler.push(`${id}: folie.zeilen[${k}].cue fehlt (gesprochenes Wort, bei dem die Zeile erscheint).`);
    if (z?.betont !== undefined && (!text(z.betont) || !String(z.text ?? '').includes(z.betont))) fehler.push(`${id}: folie.zeilen[${k}].betont muss ein Teil des Zeilentexts sein.`);
  });
  return fehler;
};

/** Alle Cues einer Folie in Sprechreihenfolge (jeder ist neue sichtbare Information). */
export const folieCues = (folie) => (folie?.zahl ? [folie.zahl.cue] : (folie?.zeilen ?? []).map((z) => z.cue)).filter(Boolean);
