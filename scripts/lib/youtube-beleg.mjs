// Beleg-Szenen für YouTube-Longform (finanzneo-youtube-beleg-v1, Arman 30.10.2026).
//
// Ein Beleg ist ein echter Screenshot der Quelle (Gesetz, Behörde, Statistik, Pressemitteilung,
// Anbieterseite, kurzer Presseausschnitt), auf dem die gesprochene Aussage markiert wird.
// Kanonische Regel: docs/YOUTUBE-BELEG-SZENEN.md

export const YOUTUBE_BELEG_STANDARD_ID = 'finanzneo-youtube-beleg-v1';
export const YOUTUBE_BELEG_BILD = 'beleg.png';
export const YOUTUBE_BELEG_DATEN = 'beleg.json';
export const YOUTUBE_BELEG_PLAN = 'beleg.md';

/**
 * Quellenarten. `presse` = fremder redaktioneller Text: nur ein kurzer Ausschnitt als Beleg
 * (Zitatrecht § 51 UrhG), deshalb mit Längengrenze. Amtliche Texte (§ 5 UrhG) und eigene
 * Angaben von Unternehmen/Verbänden haben keine Grenze außer Lesbarkeit.
 */
export const YOUTUBE_BELEG_ARTEN = ['gesetz', 'behoerde', 'statistik', 'verbraucherschutz', 'unternehmen', 'presse'];
export const YOUTUBE_BELEG_PRESSE_MAX_ZEICHEN = 700;

/** Qualitätsregel V3: Belege je Video — einer je volle 90 s Sprechzeit, mindestens 3. */
export const YOUTUBE_BELEG_MINIMUM = 3;
export const YOUTUBE_BELEG_SEKUNDEN_PRO_BELEG = 90;
export const youtubeBelegSoll = (sprechSekunden) => Math.max(YOUTUBE_BELEG_MINIMUM, Math.floor(sprechSekunden / YOUTUBE_BELEG_SEKUNDEN_PRO_BELEG));

const text = (wert) => typeof wert === 'string' && wert.trim() && !wert.trim().startsWith('[');

/** Phase-1-Felder eines Beleg-Visuals im Visual-Index. */
export const pruefeBelegPlan = (visual) => {
  const fehler = [];
  const id = visual?.id ?? 'Beleg';
  if (!text(visual?.quelle)) fehler.push(`${id}: quelle fehlt (z. B. „Deutscher Bundestag“).`);
  if (!YOUTUBE_BELEG_ARTEN.includes(visual?.quellenArt)) fehler.push(`${id}: quellenArt muss ${YOUTUBE_BELEG_ARTEN.join(', ')} sein.`);
  let url = null;
  try {url = new URL(visual?.url);} catch {/* unten gemeldet */}
  if (!url || url.protocol !== 'https:') fehler.push(`${id}: url muss eine vollständige https-Adresse der Quelle sein.`);
  const marken = Array.isArray(visual?.markierungen) ? visual.markierungen : [];
  if (marken.length < 1) fehler.push(`${id}: markierungen[] fehlt — welcher Satz der Quelle belegt die Aussage?`);
  if (marken.length > 3) fehler.push(`${id}: höchstens 3 Markierungen je Beleg; sonst aufteilen.`);
  marken.forEach((m, k) => {
    if (!text(m?.text)) fehler.push(`${id}: markierungen[${k}].text fehlt (exakter Wortlaut auf der Seite).`);
    if (!text(m?.cue)) fehler.push(`${id}: markierungen[${k}].cue fehlt (gesprochenes Wort, bei dem markiert wird).`);
  });
  return fehler;
};

/** Ergebnis von `youtube:belege` gegen den Plan prüfen (Phase 1 fertig = Screenshot da und passend). */
export const pruefeBelegAufnahme = (visual, daten) => {
  const id = visual?.id ?? 'Beleg';
  if (!daten) return [`${id}: Beleg-Screenshot fehlt — npm run youtube:belege -- youtube/<Projekt> ausführen.`];
  const fehler = [];
  if (daten.standard !== YOUTUBE_BELEG_STANDARD_ID) fehler.push(`${id}: ${YOUTUBE_BELEG_DATEN} hat nicht den Standard ${YOUTUBE_BELEG_STANDARD_ID}.`);
  if (daten.url !== visual.url) fehler.push(`${id}: Screenshot stammt von ${daten.url}, Plan nennt ${visual.url} — youtube:belege erneut ausführen.`);
  const geplant = (visual.markierungen ?? []).map((m) => m.text);
  const gefunden = (daten.markierungen ?? []).filter((m) => m.rects?.length).map((m) => m.text);
  for (const t of geplant) if (!gefunden.includes(t)) fehler.push(`${id}: Markierung „${t}“ ist im Screenshot nicht belegt — youtube:belege erneut ausführen.`);
  if (!Array.isArray(daten.teile) || daten.teile.length < 1) fehler.push(`${id}: ${YOUTUBE_BELEG_DATEN} enthält keine Bildausschnitte.`);
  if (visual.quellenArt === 'presse' && (daten.auszugZeichen ?? Infinity) > YOUTUBE_BELEG_PRESSE_MAX_ZEICHEN) {
    fehler.push(`${id}: Presse-Ausschnitt hat ${daten.auszugZeichen} Zeichen (max. ${YOUTUBE_BELEG_PRESSE_MAX_ZEICHEN}); kürzere Fundstelle wählen.`);
  }
  return fehler;
};

/**
 * Ausschnitte eines Belegs in Seiten-CSS-Pixeln: Kopf (Logo der Quelle), Titel und Textblock(e),
 * später übereinander auf eine Karte gesetzt. Nah beieinander liegende Teile werden verschmolzen,
 * damit kein Satz zerschnitten wirkt; große Lücken (Video, Werbung, Bild) fallen weg.
 */
export const berechneBelegTeile = ({bloecke, titel, kopf, seitenBreite = 1440}) => {
  const spalte = [...bloecke, ...(titel ? [titel] : [])];
  const x0 = Math.max(0, Math.min(...spalte.map((b) => b.x)) - 32);
  const x1 = Math.min(seitenBreite, Math.max(...spalte.map((b) => b.x + b.w)) + 32);
  const w = x1 - x0;
  const roh = [...bloecke].sort((a, b) => a.y - b.y).map((b) => ({art: 'text', y0: b.y - 20, y1: b.y + b.h + 20}));
  if (titel && titel.y + titel.h < roh[0].y0) roh.unshift({art: 'titel', y0: titel.y - 16, y1: titel.y + titel.h + 16});
  const teile = [];
  for (const t of roh) {
    const letzter = teile[teile.length - 1];
    if (letzter && t.y0 - letzter.y1 < 140) {
      letzter.y1 = Math.max(letzter.y1, t.y1);
      if (t.art === 'text') letzter.art = 'text';
    } else teile.push({...t});
  }
  const ergebnis = teile.map((t) => ({art: t.art, x: x0, y: Math.max(0, t.y0), w, h: t.y1 - Math.max(0, t.y0)}));
  if (kopf && kopf.y + kopf.h <= ergebnis[0].y) ergebnis.unshift({art: 'kopf', x: 0, y: kopf.y, w, h: kopf.h});
  return ergebnis;
};
