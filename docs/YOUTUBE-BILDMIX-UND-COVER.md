# YouTube — Bildmix und Cover (Qualitätsregel V3, Arman 30.10.2026)

> Bei Widersprüchen gilt `CLAUDE.md`. Gilt für YouTube-Longform-Projekte mit `qualityRules: finanzneo-youtube-quality-v3`. Ältere Projekte werden nicht rückwirkend migriert.

## Warum

Analyse am 30.10.2026: Finanzbär (215.000 Abos) zeigt im Video kaum aufwendige Bilder. Sein Video zum Altersvorsorgedepot, als Vorschaubild alle 10 Sekunden angesehen, besteht fast nur aus:

- Folien: Stichpunkte, die nacheinander erscheinen; große Zahlen
- Screenshots von Anbieterseiten und Nachrichten
- wenigen Icons

Das Bild wechselt alle 5–10 Sekunden. Seine Thumbnails sind eine feste Marke: dunkler Grund, 2–4 riesige Wörter, eine Zahl, ein Objekt.

Unsere ersten Videos bestanden fast nur aus gezeichneten Bildern. Das sieht schön aus, wirkt aber weich und wenig belegt — und gefällt Arman nicht.

## Bildwelt: weiße Folien mit 3D-Icons (Arman 30.10.2026)

Armans Entscheidung nach der Demo: Die gezeichneten Flow-Bilder gefallen nicht als Hauptbildwelt. YouTube-Videos sehen ab jetzt aus wie Finanzbär im Prinzip:

- **weißer Hintergrund**, wenig Text, eine große Zahl oder ein Begriff
- daneben **ein farbiges 3D-Icon** aus dem festen Katalog (`scripts/lib/youtube-icons.mjs`, Microsoft Fluent Emoji 3D, MIT-Lizenz)
- **Metapher-Sticker** (seit 31.10.2026): kleine, simple Cartoon-Bilder frei auf Weiß — Glühbirne für die Idee, Schere für „kürzen“, ein Motor mit Begriffen drumherum, Detektiv mit Lupe. Genau wie Finanzbär.
- **Belege** (echte Screenshots mit Marker) für Gesetze, Zahlen, Anbieter, Presse
- große Flow-Szenenbilder nur noch selten oder gar nicht

## Bildmix

| Anteil (Richtwert) | Visual | Wofür |
|---|---|---|
| ca. 60 % | **folie** (weiß, mit Icon) + **data/animation** | Begriffe, Zahlen, Abläufe, Vergleiche, Aufzählungen, Rechnungen |
| ca. 25 % | **beleg** (`docs/YOUTUBE-BELEG-SZENEN.md`) | Gesetz, Behörde, Statistik, Anbieter, Presse |
| ca. 10–15 %, höchstens 40 % | **image** (Flow) | Hook, Gefühl, Alltagsszene |

Prüfungen in `youtube:validate` (Regel V3):

- Flow-Bilder tragen **höchstens 40 % der Sprechzeit** (geschätzt aus dem Skript). Ziel sind 10–15 %.
- Kein Bild, keine Folie und kein Beleg steht länger als **6 s** ohne neue Information. Jedes Folienteil und jede Markierung zählt als neue Information.
- Folien-Cues fallen in ihrem eigenen Sprechabschnitt.
- Folien-Icons stehen im Katalog und liegen als PNG in `public/icons/fluent-3d/`.

## Erklär-Folie (`type: 'folie'`, finanzneo-youtube-folie-v2)

Feste Vorlage `src/youtube-projekt/FolieVisual.tsx`:

- weißer Grund, Text dunkel, Nummern und Hinweise grün, Ziel/Rente orange
- jedes Teil erscheint bei seinem gesprochenen Wort; Icons springen kurz auf
- der betonte Teil bekommt den **gelben FinanzNeo-Marker**, denselben wie in Belegen und auf dem Cover

Kein Flow-Bild, kein Motion-Seal. Genau **eine Form** pro Folie, dazu optional `titel` und `icon`:

```js
// begriff — großes Icon, darunter der Begriff (icon Pflicht)
{type: 'folie', chapter: K1, cue: 'Das Altersvorsorgedepot', beat: 'Neues gefördertes Depot',
  folie: {icon: 'behoerde', begriff: {text: 'Staatlich gefördertes Depot', cue: 'gefördert', betont: 'gefördertes'}}}

// ablauf — A → B, optional bis 3 Punkte
folie: {ablauf: {von: {icon: 'chart_hoch', text: 'Ansparphase', cue: 'sparst'},
                 nach: {icon: 'seniorin', text: 'Rente', cue: 'Rente'},
                 punkte: [{text: 'Förderung', cue: 'Förderung'}, {text: 'Zulagen', cue: 'Zulagen'}]}}

// vergleich — 2–3 Varianten untereinander, hinweis als grüne Marke
folie: {vergleich: [
  {icon: 'computer', oben: 'Selbstverwaltetes', text: 'Depot', cue: 'selbst'},
  {icon: 'bank', oben: 'Standard-', text: 'Depot', hinweis: 'max. 1 % Kosten', cue: 'Standard'}]}

// zahl — große Zahl, mit Icon daneben; ton gruen/rot färbt statt Marker
folie: {icon: 'euroschein', zahl: {wert: '540 €', label: 'Förderung pro Jahr', cue: 'fünfhundertvierzig'}}
folie: {icon: 'kind', zahl: {wert: '+300 €', label: 'pro Kind pro Jahr', cue: 'Kind', ton: 'gruen'}}

// zeilen — 1–5 nummerierte Stichpunkte, je höchstens 46 Zeichen
folie: {titel: 'Staatliche Förderung', icon: 'geschenk', zeilen: [
  {text: 'Erste 360 € → 50 % Zulage', cue: 'Auf die ersten', betont: '50 %'},
  {text: 'Bis 1.800 € → 25 % Zulage', cue: 'Auf alles darüber', betont: '25 %'}]}
```

```js
// metapher — ein Sticker groß, optional ein Satz darunter
folie: {metapher: {sticker: 'gluehbirne-idee', motiv: 'a glowing light bulb with small rays', cue: 'Idee',
                   text: 'Die ersten 100.000 € sind die schwersten', betont: '100.000 €'}}

// wolke — Sticker in der Mitte, 3–6 Begriffe erscheinen drumherum (je höchstens 16 Zeichen)
folie: {wolke: {sticker: 'motor-zahnraeder', motiv: 'a small engine block made of gears and pistons',
                woerter: [{text: 'Kosten', cue: 'Kosten'}, {text: 'Inflation', cue: 'Inflation'}, {text: 'Rendite', cue: 'Rendite'}]}}

// zitat — kursiv mit grünem Balken und Quelle (höchstens 220 Zeichen)
folie: {zitat: {text: 'Die ersten 100.000 € sind hart.', von: 'Charlie Munger (sinngemäß)', cue: 'Munger', betont: 'hart'}}
```

Kurze Beschriftungen (ablauf, vergleich) höchstens 24 Zeichen.

### Metapher-Sticker (finanzneo-youtube-sticker-v1)

- **Bibliothek:** `public/sticker/<name>.png` mit Katalog `public/sticker/katalog.json`. Sie wächst mit jedem Video; ein Sticker wird nur **einmal** erzeugt und danach überall wiederverwendet.
- **Name:** kleinbuchstaben-mit-bindestrich, beschreibend (`gluehbirne-idee`, `schere-kosten`, `detektiv-lupe`). Vor dem Planen in `katalog.json` nach einem passenden vorhandenen Sticker suchen.
- **Neuer Sticker:** `motiv` (englisch, eine einfache Metapher) angeben. `youtube:plan` schreibt dann einen eigenen STICKER-Auftrag in die Flow-Datei: fester Sticker-Stil (`YOUTUBE_STICKER_STIL`: flacher Cartoon, dunkle Kontur, 2–4 Farben mit Gelb, reines Weiß, quadratisch, kein Text), **ohne** Stilvorlage der Szenenbilder. Dateiname: `YouTube Sticker - <name>.png`.
- **Übernahme:** `youtube:zusammenbau` schneidet den weißen Rand weg und legt den Sticker in die Bibliothek. Danach braucht kein Video ihn mehr neu.
- Sticker sind quadratisch; die 16:9-Prüfung gilt nur für Szenenbilder.
- Ein Sticker zeigt **eine** Idee auf den ersten Blick. Keine Szene, kein Hintergrund, kein Text.

### Icons

- Katalog mit Bedeutungen: `npm run youtube:icons -- --liste`
- Neues Icon: Eintrag in `scripts/lib/youtube-icons.mjs` (Name → Fluent-Ordner, Bedeutung), dann `npm run youtube:icons`
- Achtung: `geldsack` trägt ein **$-Zeichen** — für Euro-Beträge `euroschein` oder `muenze` nehmen. Ein Sparschwein gibt es im Set nicht.
- Lizenz: `public/icons/fluent-3d/LICENSE` (MIT, Microsoft)

## Cover V1 (`thumbnail.cover`)

Flow zeichnet nur das Motiv in der **rechten Bildhälfte, ohne jeden Text**. Die linke Hälfte bleibt leere Creme. `npm run youtube:cover` setzt darauf den exakten Text: Flow erfindet keine Wörter mehr, und alle Cover sehen nach einer Marke aus.

```js
export const thumbnail = {
  file: 'YouTube Thumbnail - Altersvorsorgedepot.png',
  prompt: 'Jonas close-up, skeptical face, holding a small jar with coins …',
  cover: {zeilen: ['Kostet Jonas', '40.000 €'], marker: '40.000 €', ton: 'rot', kicker: 'Neu ab 2027'},
};
```

Regeln:

- 1–2 Zeilen, **höchstens 5 Wörter**, je Zeile höchstens 18 Zeichen
- `marker` ist ein Wort oder eine Zahl aus den Zeilen und bekommt den gelben Marker
- `ton` (rot/gruen/tinte) färbt die zweite Zeile; `kicker` ist eine kleine dunkle Marke darüber (optional, z. B. „Neu ab 2027“)
- **Creme bleibt:** Finanzbär ist dunkel-grün, Finanzfluss und Finanztip sind bunt bzw. dunkel. Creme fällt im Feed auf.
- `youtube:cover` schreibt `_intern/04-visuals/cover.png` (1280 × 720) und eine Feed-Vorschau in Handygröße (320 × 180). Dort muss der Text noch klar lesbar sein.
- `youtube:render` erzeugt das Cover automatisch und legt es als `5-export/cover.png` ab.

Ohne Projekt lässt sich ein Entwurf direkt testen:

```bash
npm run youtube:cover -- --bild <png> --zeilen "Kostet Jonas|40.000 €" --marker "40.000 €" --aus entwurf.png
```
