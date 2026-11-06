# YouTube-Longform

Dieser Bereich ist ausschließlich für eigenständige längere FinanzNeo-Videos. Keine YouTube Shorts und keine gestreckten Reel-Kopien.

## Ordner eines Projekts

```text
1-script/            Sprechtext
2-bildprompts/       alle Flow-Prompts (5er-Batches)
3-bilder-hier-rein/  Flow-Bilder rein
4-audio-hier-rein/   voiceover.wav (automatisch per youtube:stimme oder eigene Aufnahme)
5-export/            Cover, Video, Caption, Untertitel mit Zeitstempeln
_intern/             alles andere
```

## Ablauf

```bash
npm run youtube:create -- --target youtube/<Projekt> --title "Titel"
npm run youtube:stimme -- youtube/<Projekt>
npm run youtube:zusammenbau -- youtube/<Projekt> --whisper youtube/<Projekt>/_intern/03-audio/whisper.json
npm run youtube:render -- youtube/<Projekt>
```

- Phase-1-Visualplanung: `_intern/06-projektdateien/visual-plan.mjs` schreiben (Bilder mit `cue`, `prompt`, optional `ref`/`akzente`; Motion mit `brief`), dann `node scripts/youtube-plan-anwenden.mjs youtube/<Projekt>` — erzeugt Visual-Index, Einzelprompts, die Flow-Übergabe (Batch 1 = Thumbnail) und die Motion-Ordner. Danach `youtube:validate` für die Qualitätsregeln.
- Voiceover: `youtube:stimme` spricht `1-script/script.txt` automatisch mit der Kanalstimme ein (lokal, −16 LUFS, Wortzeiten inklusive). Erst reinhören, dann Zusammenbau. Details und Einrichtung: [Kanalstimme](_kanal/stimme/README.md).
- Belege (echte Quellen-Screenshots, ab Regel V3 mindestens 3 pro Video): im Visual-Plan `type: 'beleg'` mit `quelle`, `quellenArt`, `url` und `markierungen[{text, cue}]`, dann `npm run youtube:belege -- youtube/<Projekt>`. Details: [Beleg-Szenen](../docs/YOUTUBE-BELEG-SZENEN.md).
- Bildwelt (Regel V3): weiße Folien mit 3D-Icons (`type: 'folie'`, Formen begriff/ablauf/vergleich/zahl/zeilen/metapher/wolke/zitat, Metapher-Sticker aus `public/sticker/`, `npm run youtube:icons -- --liste`) und Belege; Flow-Bilder nur selten, höchstens 40 % der Sprechzeit. Cover: `thumbnail.cover = {zeilen, marker}`, `npm run youtube:cover`. Details: [Bildmix und Cover](../docs/YOUTUBE-BILDMIX-UND-COVER.md).
- Eigene Sprachaufnahme in mehreren Teilen? Alle Teile in `4-audio-hier-rein/` legen — sie werden automatisch zu einer `voiceover.wav` verbunden.
- Optionale Hintergrundmusik: `_intern/03-audio/musik.mp3` (lizenzfrei), wird leise untergemischt.
- Neue Projekte prüfen automatisch: Standbilder max. 8 s, Hook max. 20 s, Kommentarfrage in der Mitte, Endkarte 15 s, Bilder nur Illustration mit Thumbnail als Stilvorlage. Details: [Produktionsstandard](PRODUKTIONSSTANDARD.md#qualitätsregeln-v1-finanzneo-youtube-quality-v1-arman-10102026).

## Neues Projekt

```bash
npm run youtube:create -- --target youtube/<Projekt> --title "Titel"
```

Ohne `--types` wird bewusst **keine feste Visualzahl** vorgegeben. Phase 1 plant zuerst Skript und Visual Beats. Wenn die Visualtypen bereits feststehen, können sie beim Scaffold übergeben werden:

```bash
npm run youtube:create -- --target youtube/<Projekt> --title "Titel" --types image,hybrid,animation,data,image
```

Erlaubt:

- `image`
- `animation`
- `hybrid`
- `data`
- `beleg`
- `folie`

Für Motion gilt V3: erst `viewerChange`, dann die beste Technik. Es gibt keine feste Animationsbibliothek und keine Whitelist für Composition Families.

Danach:

```bash
npm run youtube:validate -- youtube/<Projekt>
npm run youtube:animation:validate -- youtube/<Projekt>
npm run youtube:phase1:seal -- youtube/<Projekt>
npm run youtube:ready -- youtube/<Projekt>
```

Verbindlich:

- [Produktionsstandard](PRODUKTIONSSTANDARD.md)
- [YouTube Motion V3](../docs/YOUTUBE-MOTION-V3.md)
- [3-Phasen-Workflow](../docs/YOUTUBE-LONGFORM-WORKFLOW.md)
- `CLAUDE.md`

`youtube:ready` gibt Phase 3 nur frei, wenn Recherche, Skript, Visuals, produktionsreife und Motion-V3-versiegelte Quellen, Publishing-Paket, alle exakten 16:9-Nutzerbilder, genau ein finales Voiceover und echte Wort-Timings vollständig sind.

## Claude Code Motion Test (isoliertes Experiment)

Zum Test des mit `claude-opus-5-5` konfigurierten Motion-Directors ohne Produktionsvideo:
`tests/claude-motion/README.md`. Der Test startet mit `claude --agent finanzneo-motion-director`
und dem Slash-Befehl `/finanzneo-motion-test` im zugehörigen Feature-Branch.
