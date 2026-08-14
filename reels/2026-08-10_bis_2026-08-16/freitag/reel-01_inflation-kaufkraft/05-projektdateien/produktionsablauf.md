# Produktionsablauf — Inflation / Kaufkraft

## A. Vorproduktion / Storyboard

Das Storyboard dient nur zur Prüfung von Layout, Headline/Subheadline und den sechs Remotion-Mechanismen.

```bash
npm run typecheck
npx remotion render src/index.ts InflationKaufkraftStoryboard reels/2026-08-10_bis_2026-08-16/freitag/reel-01_inflation-kaufkraft/storyboard-preview.mp4 --scale=0.5
```

Die vier Bildszenen sind im Storyboard ausdrücklich als `STORYBOARD-MOCK` markiert. Sie sind niemals finale Medien.

## B. Google Flow

Verwende ausschließlich:

`03-szenen/alle-bildprompts.txt`

Flow muss streng seriell arbeiten: genau ein Bild → vollständig warten → exakt umbenennen → prüfen → erst dann das nächste.

Erwartete Dateien:
- `Bild 00 - Inflation Kaufkraft Cover.png`
- `Bild 01 - 10000 Euro heute.png`
- `Bild 04 - Kontostand bleibt gleich.png`
- `Bild 07 - Einkaufskorb wird kleiner.png`
- `Bild 10 - Kaufkraft statt Kontostand.png`

Alle fünf anschließend ausschließlich nach:

`03-szenen/00-ALLE-BILDER-HIER-REIN/`

## C. Finales Voiceover

Den Text aus `01-script/voiceover.txt` exakt als finales Audio sprechen/generieren und **genau eine** Audiodatei nach `02-audio/` legen.

## D. Medien synchronisieren

```bash
node scripts/sync-inflation-kaufkraft-assets.mjs
```

Der Sync blockiert bei fehlenden Bildern oder wenn nicht genau ein finales Audio vorhanden ist.

## E. Echte Wortzeiten

Mit dem vorhandenen FinanzNeo-Whisper-Tool echte Wortgrenzen aus dem finalen Audio erzeugen:

```bash
python scripts/captions.py <PFAD-ZUM-FINALEN-AUDIO> <RAW-WORTZEITEN.json> --model small
```

Keine gleichmäßig verteilten oder geschätzten Wortzeiten. Die geprüften Wortgrenzen werden anschließend in `04-caption/word-timings.json` als kurze Caption-Einheiten übernommen; `timingStatus` wird nur nach echter Audioausrichtung auf `final-audio-aligned` gesetzt.

## F. Finale Timeline

Die 10 Szenenstarts werden an den tatsächlichen Satz-/Beat-Anfängen des finalen Audios gesetzt. `05-projektdateien/timeline.json` muss danach zehn chronologische, lückenlose Einträge mit `durationFrames > 0` enthalten.

## G. Runtime vorbereiten

```bash
node scripts/prepare-inflation-kaufkraft-runtime.mjs
```

Dieses Skript schreibt ausschließlich bei echten Wortzeiten + aufgelöster Timeline die Runtime-Daten für die finale `InflationKaufkraft`-Composition.

## H. Pre-Render QA

```bash
npm run reel:validate -- reels/2026-08-10_bis_2026-08-16/freitag/reel-01_inflation-kaufkraft --final
npm run typecheck
```

## I. Preview

```bash
npm run reel:preview -- reels/2026-08-10_bis_2026-08-16/freitag/reel-01_inflation-kaufkraft --scale=0.5 --composition=InflationKaufkraft
```

Prüfen: erste/mittlere/letzte Frames jeder Szene, Header/Visual/Caption-Abstände, Bildsemantik, Zahlen, Untertitel und Übergänge.

## J. Final render

```bash
npm run reel:render -- reels/2026-08-10_bis_2026-08-16/freitag/reel-01_inflation-kaufkraft --composition=InflationKaufkraft
```

Danach vollständige MP4 mit Ton ansehen, Audio ungefähr -16 LUFS und True Peak <= -1 dBTP prüfen und `final-qa.json` nur mit tatsächlich gemessenen/geprüften Werten auf `passed` setzen.

## K. Post-Render Gate

```bash
npm run reel:validate -- reels/2026-08-10_bis_2026-08-16/freitag/reel-01_inflation-kaufkraft --final --post-render
```

Erst danach darf der Status `PRODUCTION COMPLETE` lauten. Merge und Publishing bleiben separate Nutzerentscheidungen.
