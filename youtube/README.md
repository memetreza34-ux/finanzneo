# YouTube-Longform — aktiver FinanzNeo-Produktionsmodus

Neue FinanzNeo-Videos werden aktuell ausschließlich hier gebaut. **Keine neuen Reels, keine YouTube Shorts.**

## Neues Projekt

```bash
npm run youtube:create -- --target youtube/<Projekt> --title "Titel"
```

Wenn Visualtypen schon feststehen, mindestens zwei Motion-Typen einplanen:

```bash
npm run youtube:create -- --target youtube/<Projekt> --title "Titel" --types image,animation,image,hybrid,image,animation,image
```

## Bildlogik

`BEDEUTUNG ZUERST — FORM FREI`

Vor jedem Flow-Bild zuerst den gesprochenen Gedanken verstehen. Danach die stärkste Darstellung wählen. Gleichberechtigt sind unter anderem:

- einzelnes Objekt / Detail
- Hände
- Mensch
- reale Szene
- Vergleich
- semantische Objektanordnung
- visuelle Metapher
- kreative Idee

**Kein scene-first. Kein Menschen-Zwang. Kein Ort-Zwang. Kein Tisch-Zwang.** Objekte dürfen frei im Raum stehen, wenn ihre Anordnung inhaltlich etwas erklärt. Dekorative Schweberei ohne Bedeutung ist dagegen unerwünscht.

Flow: 3 Thumbnail-Kandidaten parallel → Nutzerwahl → Szenenbilder in parallelen 5er-Batches → sofort Rename/QA → Final Inventory QA. Thumbnail und Bilder nutzen direkt dieselbe schriftliche V9-Bildwelt; das Thumbnail wird nie Style-Referenz.

Präzise Charts, Tabellen, UI und Rechenwege gehören zu Remotion. Mindestens zwei echte Motion-Visuals pro Projekt.

## Verbindliches YouTube-Layout

Zusätzlich gilt [LAYOUTSTANDARD.md](LAYOUTSTANDARD.md):

- kein Flow-Bild als randloser Vollbild-Hintergrund
- keine ungestaltete Remotion-Vollbildfläche
- jeder Visual Beat hat Zwischenüberschrift + passendes Icon
- Bilder und Animationen liegen in einem gerahmten Content-Bereich
- keine eingebrannten Untertitel/Captions
- Wort-Zeitstempel nur für Schnitte sowie SRT-/Zeitstempel-Export

## Validierung

```bash
npm run youtube:validate -- youtube/<Projekt>
```

Der Wrapper prüft Basisvertrag, Layoutvertrag und Meaning-first-Visualvertrag mit demselben Projektpfad.

Verbindlich: [Produktionsstandard V5](PRODUKTIONSSTANDARD.md), [Layoutstandard V2](LAYOUTSTANDARD.md), [YouTube Motion V3](../docs/YOUTUBE-MOTION-V3.md). Bei widersprüchlichen älteren YouTube-/Reel-Regeln haben die beiden YouTube-Standards Vorrang.


## Phase-3 Render-Contract

Jedes neue Projekt braucht neben `layout.json` auch `06-projektdateien/render-contract.json`.

- IMAGE → `YouTubeFramedImage`, `objectFit=contain`, niemals Vollbild
- MOTION/DATA → `YouTubeSectionFrame`
- Header + Icon für jeden Beat
- Thumbnail/Cover niemals in der Timeline
- Szenenbilder ausschließlich über ihren exakten `googleFlowFileName`

`youtube:validate` prüft diese Render-Routen jetzt ausdrücklich.
