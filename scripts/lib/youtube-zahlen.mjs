// FinanzNeo — Zahlen-Rückschau V1 (finanzneo-youtube-zahlen-v1, Arman 31.10.2026)
//
// Echte YouTube-Studio-Zahlen je Video an festen Messtagen. Die Diagnose sucht den
// Engpass in Trichter-Reihenfolge: Reichweite → Klickrate → Hook → Mitte. Grenzen sind
// Richtwerte für kleine deutsche Erklärkanäle, keine Garantie.

import {existsSync, readFileSync, readdirSync} from 'node:fs';
import {join} from 'node:path';

export const YOUTUBE_ZAHLEN_ID ='finanzneo-youtube-zahlen-v1';
export const YOUTUBE_ZAHLEN_DATEI = '07-zahlen/zahlen.json';
export const YOUTUBE_ZAHLEN_MESSTAGE = [7, 28];
// Zählung der Videos startet laut THEMEN-REGISTER.md am 10.10.2026; alles davor waren Tests.
export const YOUTUBE_ZAHLEN_AB = '2026-10-10';

export const YOUTUBE_ZAHLEN_GRENZEN = {
  impressionenMin: 300,
  ctrSchwach: 2,
  ctrGut: 5,
  halten30Schwach: 50,
  halten30Gut: 70,
  prozentSchwach: 30,
  prozentGut: 45,
};

export const leereZahlen = (video) => ({version: YOUTUBE_ZAHLEN_ID, video, veroeffentlicht: null, eintraege: []});

// "2:10" → 130, "1:02:05" → 3725, "95" → 95
export const parseDauer = (text) => {
  if (text === undefined || text === null || text === '') return null;
  const teile = String(text).trim().split(':').map((t) => Number(t.replace(',', '.')));
  if (teile.some((t) => !Number.isFinite(t) || t < 0)) return NaN;
  return teile.reduce((summe, t) => summe * 60 + t, 0);
};

export const formatDauer = (sekunden) => {
  if (!Number.isFinite(sekunden)) return '–';
  const s = Math.round(sekunden);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

// 3.4 → "3,4" für die Ausgabe
export const de = (n) => String(n).replace('.', ',');

const zahl = (text) => (text === undefined || text === null || text === '' ? null : Number(String(text).replace('%', '').replace(',', '.')));

export const eintragAusWerten = (werte, laengeSekunden) => {
  const dauer = parseDauer(werte.dauer);
  const prozent = zahl(werte.prozent) ?? (dauer && laengeSekunden ? Math.round((dauer / laengeSekunden) * 1000) / 10 : null);
  const eintrag = {
    tag: zahl(werte.tag),
    gemessenAm: werte.gemessenAm,
    impressionen: zahl(werte.impressionen),
    ctr: zahl(werte.ctr),
    aufrufe: zahl(werte.aufrufe),
    durchschnittDauerSek: dauer,
    prozentAngesehen: prozent,
    halten30: zahl(werte.halten30),
    abos: zahl(werte.abos),
    anteilSuche: zahl(werte.suche),
    anteilVorschlag: zahl(werte.vorschlag),
    titel: werte.titel ?? null,
    notiz: werte.notiz ?? null,
  };
  return Object.fromEntries(Object.entries(eintrag).filter(([, v]) => v !== null && v !== undefined));
};

export const pruefeEintrag = (eintrag) => {
  const fehler = [];
  const pflicht = ['tag', 'impressionen', 'ctr', 'aufrufe', 'halten30'];
  for (const feld of pflicht) if (eintrag[feld] === undefined) fehler.push(`--${feld} fehlt`);
  if (eintrag.durchschnittDauerSek === undefined) fehler.push('--dauer fehlt (durchschnittliche Wiedergabedauer, z. B. 2:10)');
  for (const [feld, wert] of Object.entries(eintrag)) {
    if (typeof wert === 'number' && (!Number.isFinite(wert) || wert < 0)) fehler.push(`${feld} ist keine gültige Zahl`);
  }
  for (const feld of ['ctr', 'halten30', 'prozentAngesehen', 'anteilSuche', 'anteilVorschlag']) {
    if (eintrag[feld] > 100) fehler.push(`${feld} ist ein Prozentwert und darf nicht über 100 liegen`);
  }
  return fehler;
};

// Engpass in Trichter-Reihenfolge: erst wenn eine Stufe passt, zählt die nächste.
export const diagnose = (eintrag, g = YOUTUBE_ZAHLEN_GRENZEN) => {
  const hinweise = [];
  let engpass = null;
  const setze = (stufe, text) => {
    if (!engpass) engpass = stufe;
    hinweise.push(text);
  };
  if (eintrag.impressionen < g.impressionenMin) {
    setze('Reichweite', `Nur ${eintrag.impressionen} Impressionen: YouTube zeigt das Video kaum. Thema mit Suchnachfrage wählen, Suchbegriff vorne in den Titel, Shorts als Zubringer.`);
    if (eintrag.anteilSuche !== undefined && eintrag.anteilSuche < 20) hinweise.push(`Nur ${de(eintrag.anteilSuche)} % der Impressionen aus der Suche: Titel und Beschreibung treffen den Suchbegriff nicht.`);
  }
  if (eintrag.ctr < g.ctrSchwach) setze('Klickrate', `Klickrate ${de(eintrag.ctr)} % (Richtwert ab ${g.ctrSchwach} %): Titel und Cover überzeugen nicht. Cover-Test mit 2–3 Varianten in YouTube Studio starten.`);
  else if (eintrag.ctr >= g.ctrGut) hinweise.push(`Klickrate ${de(eintrag.ctr)} %: gut — Titel- und Cover-Muster für die nächsten Videos übernehmen.`);
  if (eintrag.halten30 < g.halten30Schwach) setze('Hook', `Nach 30 s sind nur noch ${de(eintrag.halten30)} % dabei (Richtwert ab ${g.halten30Schwach} %): Hook hält das Versprechen aus Titel und Cover nicht schnell genug ein.`);
  else if (eintrag.halten30 >= g.halten30Gut) hinweise.push(`Nach 30 s noch ${de(eintrag.halten30)} % dabei: Hook funktioniert.`);
  if (eintrag.prozentAngesehen !== undefined) {
    if (eintrag.prozentAngesehen < g.prozentSchwach) setze('Mitte', `Im Schnitt ${de(eintrag.prozentAngesehen)} % angesehen (Richtwert ab ${g.prozentSchwach} %): in der Zuschauerbindungskurve die größte Absprungstelle suchen und als Regel festhalten.`);
    else if (eintrag.prozentAngesehen >= g.prozentGut) hinweise.push(`Im Schnitt ${de(eintrag.prozentAngesehen)} % angesehen: starke Bindung.`);
  }
  return {engpass, hinweise};
};

export const faelligeMesstage = (veroeffentlicht, eintraege, heute) => {
  if (!veroeffentlicht) return [];
  const alter = Math.floor((Date.parse(heute) - Date.parse(veroeffentlicht)) / 86400000);
  const erledigt = new Set(eintraege.map((e) => e.tag));
  return YOUTUBE_ZAHLEN_MESSTAGE.filter((tag) => alter >= tag && !erledigt.has(tag));
};

export const verbesserungsZeile = (datum, video, eintrag) => {
  const {engpass} = diagnose(eintrag);
  const werte = `Tag ${eintrag.tag}: ${eintrag.impressionen} Impressionen, CTR ${de(eintrag.ctr)} %, ${de(eintrag.halten30)} % nach 30 s${eintrag.prozentAngesehen !== undefined ? `, ${de(eintrag.prozentAngesehen)} % angesehen` : ''}`;
  return `| ${datum} | ${video} (Zahlen) | ${werte} — Engpass: ${engpass ?? 'keiner'} | [REGEL EINTRAGEN] |`;
};

// Alle gezählten Videos unter youtube/ (Ordner YYYY-MM-DD_<name>, ab YOUTUBE_ZAHLEN_AB).
export const ladeKanal = (youtubeWurzel, heute) => readdirSync(youtubeWurzel, {withFileTypes: true})
  .filter((e) => e.isDirectory() && /^\d{4}-\d{2}-\d{2}_/.test(e.name) && e.name.slice(0, 10) >= YOUTUBE_ZAHLEN_AB)
  .map((e) => {
    const datei = join(youtubeWurzel, e.name, '_intern', YOUTUBE_ZAHLEN_DATEI);
    const daten = existsSync(datei) ? JSON.parse(readFileSync(datei, 'utf8')) : leereZahlen(e.name);
    const gerendert = existsSync(join(youtubeWurzel, e.name, '5-export', 'video.mp4'));
    return {...daten, video: e.name, gerendert, faellig: faelligeMesstage(daten.veroeffentlicht, daten.eintraege, heute)};
  })
  .sort((a, b) => a.video.localeCompare(b.video));

// Hinweise, die vor jedem neuen Video erscheinen: fehlendes Veröffentlichungsdatum, fällige Messtage.
export const offeneZahlen = (kanal) => kanal.flatMap((v) => {
  // Ohne gerendertes Video ist das Projekt noch in Arbeit, nicht vergessen.
  if (!v.veroeffentlicht) return v.gerendert ? [`${v.video}: gerendert, aber Veröffentlichungsdatum fehlt (--veroeffentlicht JJJJ-MM-TT)`] : [];
  return v.faellig.map((tag) => `${v.video}: Zahlen für Tag ${tag} fällig`);
});
