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

## Remotion-Framing — verbindlicher Stand

Bildszenen verwenden **full-frame-no-crop**:

- komplettes vertikales 9:16-Nutzerbild über die gesamte 1080×1920-Szene
- kein `VisualStage`/Mittel-Container um Nutzerbilder
- kein absichtlicher Crop, Zoom oder Focal-Point-Vertrag
- kein kleines Poster/Inlay
- kein sichtbarer Bildrand
- keine unscharfe Bildkopie
- Headline + Untertitel als Overlay über demselben Bild
- nur kontinuierlicher transparenter Lesbarkeits-Scrim
- keine harte obere/untere Hintergrundfläche

Richtlayout:

```text
headlineTop ≈ 72
imageScene = Y 0–1920
animationContent ≈ Y 220–1490
subtitleBottom ≈ 300
subtitleLeft ≈ 64
subtitleRight ≈ 156
platformUiSafeBottom ≥ 260
```

Native Remotion-Szenen verwenden einen durchgehenden Full-Canvas-Hintergrund ohne Boden, Horizont oder Studio-Split.

## Audio und Video-Captions

- genau ein finales Voiceover in `02-audio/`
- echte Wort-start/end-Zeitstempel aus genau diesem Audio
- keine gleichmäßig geschätzten Wortzeiten
- `word-timings.json` final nur mit `timingStatus: final-audio-aligned`
- **genau 1 vollständiger Satz gleichzeitig**
- niemals 2 Sätze gleichzeitig
- hart maximal 2 Zeilen
- ausreichend große Smartphone-Schrift
- keine schwarze/undurchsichtige Caption-Karte
- aktuelles Wort nur während seiner echten Audiozeit grün
- Satzwechsel exakt beim ersten Wort des nächsten Satzes
- kurze Pausen halten vorherigen Satz sichtbar

## Social-Caption

In `04-caption/` gibt es nur:

```text
caption.txt
word-timings.json
```

`caption.txt` wird unverändert für Instagram Reels, TikTok, Facebook Reels und Snapchat verwendet.

Pflicht:

- starke ehrliche erste Zeile
- kurze Kernaussage/Aha-Nutzen
- natürlicher CTA nur wenn passend
- exakt 5 relevante Hashtags
- keine separaten Plattform-Caption-Dateien
- keine zufälligen Viral-/FYP-Spam-Tags

## Finaler Build

```bash
npm run reel:validate -- reels/2026-08-03_bis_2026-08-09/donnerstag/reel-02_notgroschen-stufenplan --final
```

Danach TypeScript, Preview, erste/mittlere/letzte Frames jeder Szene, Kontaktbogen, Caption-Safe-Area, vollständiges MP4 mit Ton und Safety Audit.

Bei visueller QA besonders prüfen:

- kein zweiter Hintergrundbereich
- Bild reicht sichtbar bis zum unteren Frame
- kein separater Header/Footer
- kein Inset-Bildpanel
- keine schwarze Caption-Karte
- genau ein Untertitelsatz

`PRODUCTION COMPLETE` erst nach tatsächlichem Abschluss dieser Prüfungen.
