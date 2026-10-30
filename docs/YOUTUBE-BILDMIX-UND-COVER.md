# YouTube — Bildmix und Cover (Qualitätsregel V3, Arman 30.10.2026)

> Bei Widersprüchen gilt `CLAUDE.md`. Gilt für YouTube-Longform-Projekte mit `qualityRules: finanzneo-youtube-quality-v3`. Ältere Projekte werden nicht rückwirkend migriert.

## Warum

Analyse am 30.10.2026: Finanzbär (215.000 Abos) zeigt im Video kaum aufwendige Bilder. Sein Video zum Altersvorsorgedepot, als Vorschaubild alle 10 Sekunden angesehen, besteht fast nur aus:

- Folien: Stichpunkte, die nacheinander erscheinen; große Zahlen
- Screenshots von Anbieterseiten und Nachrichten
- wenigen Icons

Das Bild wechselt alle 5–10 Sekunden. Seine Thumbnails sind eine feste Marke: dunkler Grund, 2–4 riesige Wörter, eine Zahl, ein Objekt.

Unsere ersten Videos bestanden fast nur aus gezeichneten Bildern. Das sieht schön aus, wirkt aber weich und wenig belegt.

## Bildmix

| Anteil (Richtwert) | Visual | Wofür |
|---|---|---|
| ca. 50 % | **folie** + **data/animation** | Zahlen, Aufzählungen, Regeln, Rechnungen, Vergleiche |
| ca. 25 % | **beleg** (`docs/YOUTUBE-BELEG-SZENEN.md`) | Gesetz, Behörde, Statistik, Anbieter, Presse |
| höchstens 40 % | **image** (Flow, gezeichnet) | Hook, Gefühl, Alltag, Metapher, die Figur |

Prüfungen in `youtube:validate` (Regel V3):

- Gezeichnete Bilder tragen **höchstens 40 % der Sprechzeit** (geschätzt aus dem Skript).
- Kein Bild, keine Folie und kein Beleg steht länger als **6 s** ohne neue Information (vorher 8 s). Jede Folienzeile und jede Markierung zählt als neue Information.
- Folien-Cues fallen in ihrem eigenen Sprechabschnitt.

## Erklär-Folie (`type: 'folie'`)

Feste Vorlage `src/youtube-projekt/FolieVisual.tsx`:

- Kanal-Creme, Text dunkel, Nummern grün
- der betonte Teil bekommt den **gelben FinanzNeo-Marker**, denselben wie in Belegen und auf dem Cover
- jede Zeile erscheint bei ihrem gesprochenen Wort
- ältere Zeilen treten zurück, die aktuelle ist voll sichtbar

Kein Flow-Bild, kein Motion-Seal.

```js
// Liste: 1–5 Zeilen, je höchstens 46 Zeichen
{type: 'folie', chapter: K2, cue: 'Die Förderung hat zwei Stufen', beat: 'Zwei Förderstufen',
  folie: {titel: 'Staatliche Förderung', zeilen: [
    {text: 'Erste 360 € → 50 % Zulage', cue: 'Auf die ersten', betont: '50 %'},
    {text: 'Bis 1.800 € → 25 % Zulage', cue: 'Auf alles darüber', betont: '25 %'},
  ]}}

// Große Zahl
{type: 'folie', chapter: K2, cue: 'Zusammen sind das', beat: 'Maximal 540 € pro Jahr',
  folie: {zahl: {wert: '540 €', label: 'Zulage pro Jahr, höchstens', cue: 'fünfhundertvierzig'}}}
```

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
