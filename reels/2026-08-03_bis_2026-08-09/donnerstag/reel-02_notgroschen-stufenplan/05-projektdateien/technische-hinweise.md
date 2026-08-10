# Technische Hinweise — Notgroschen

## Remotion

- Composition: `NotgroschenStufenplan`
- Source: `src/reels/notgroschen/NotgroschenStufenplan.tsx`
- 1080 × 1920, 30 fps
- 10 Szenen: 6 Bildszenen + 4 Animationen

## Nutzer-Medien — harte Grenze

Finale Bilder ausschließlich aus:

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

Finales Voiceover ausschließlich aus:

```text
02-audio/
```

Fehlt/falsch/mehrdeutig → `BLOCKED`. Keine Ersatzmedien.

## Bildwelt

- World ID `finanzneo-connected-studio-v3`
- Premium Fintech Editorial 3D
- eine starke Finanzmetapher / Hero-Objekt
- Person optional; wenn vorhanden Gesicht sichtbar
- deep charcoal green-black + emerald/mint
- Gold für Geld/Wert
- Rot-Orange für Risiko/Verlust/Schulden
- kurze deutsche Objektlabels
- genau ein nahtloser Hintergrund
- keine Prozent-Zonen/Bänder/Floor-Wall-Grenze/Horizont/Panels

## Remotion-Framing — NEUER VERBINDLICHER STAND

Alte `contain`-/1.04-/0.20-/0.34-Regeln sind nicht mehr gültig.

Bildszenen verwenden `adaptive-safe-fill`:

- Bild füllt die nutzbare Visual-Fläche maximal
- kein kleines Poster/Inlay
- kein sichtbarer Bildrand
- keine unscharfe Bildkopie als Hintergrund
- zuerst leere nahtlose Hintergrundfläche croppen
- Gesicht, Labels, Hero-Objekt und Geld/Wert schützen
- pro Szene Focal Point verwenden

Richtlayout:

```text
headlineTop ≈ 70
visualTop ≈ 210
visualBottom ≈ 1515
subtitleBottom ≈ 280
subtitleLeft ≈ 60
subtitleRight ≈ 180
```

## Audio und Captions

- genau ein finales Voiceover in `02-audio/`
- echte Wort-start/end-Zeitstempel aus genau diesem Audio
- keine gleichmäßig geschätzten Wortzeiten
- `word-timings.json` final nur mit `timingStatus: final-audio-aligned`
- bevorzugt 1 vollständiger Satz gleichzeitig
- maximal 2 sehr kurze Sätze, falls nötig
- hart maximal 2 Zeilen
- aktuelles Wort nur während seiner echten Audiozeit grün
- Satzwechsel exakt beim ersten Wort des nächsten Satzes
- kurze Pausen halten vorherigen Satz sichtbar

## Finaler Build

```bash
npm run reel:validate -- reels/2026-08-03_bis_2026-08-09/donnerstag/reel-02_notgroschen-stufenplan --final
```

Danach TypeScript, Preview, Frame-/Kontaktbogen-QA, vollständiges MP4 mit Ton und Safety Audit.

`PRODUCTION COMPLETE` erst nach tatsächlichem Abschluss dieser Prüfungen.
