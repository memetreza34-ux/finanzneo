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

Flow: 3 Thumbnail-Kandidaten parallel → Nutzerwahl → Szenenbilder in parallelen 5er-Batches → sofort Rename/QA → Final Inventory QA. Thumbnail und Bilder nutzen direkt dieselbe schriftliche V9-Bildwelt; das Thumbnail wird nie Style-Referenz.

Charts/Diagramme frontal und gerade. Mindestens zwei echte Motion-Visuals pro Projekt.

## Verbindliches YouTube-Layout

Zusätzlich gilt [LAYOUTSTANDARD.md](LAYOUTSTANDARD.md). Dieser Layoutstandard überschreibt ältere widersprüchliche Layout-/Caption-Regeln:

- **kein Flow-Bild als Vollbild**
- **keine Remotion-Animation als Vollbild**
- jeder Visual Beat hat eine **Zwischenüberschrift + passendes Icon**
- Bilder und Animationen liegen in einem gerahmten Content-Bereich
- **keine eingebrannten Untertitel/Captions im Video**
- Wort-Zeitstempel bleiben nur für Schnitte sowie SRT-/Zeitstempel-Export
- Menschen niemals erzwingen; Bildinhalt ist frei, solange Welt und Szene passen

Verbindlich: [Produktionsstandard](PRODUKTIONSSTANDARD.md), [Layoutstandard V1](LAYOUTSTANDARD.md), [YouTube Motion V3](../docs/YOUTUBE-MOTION-V3.md), `CLAUDE.md`.
