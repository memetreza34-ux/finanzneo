# Technische Hinweise

## Video

- 1080 × 1920
- 9:16
- 30 fps
- Zielbereich nach finalem Voiceover: 60–90 Sekunden
- keine starre Gleichverteilung der Szenendauer

## Bildquellen

- Google-Flow-Quellbilder immer quadratisch 1:1
- Bilddarstellung im Reel: `contain`
- maximale absichtliche Skalierung: 1.04
- maximaler Source-Crop je Seite: 0.20
- maximaler Gesamt-Crop: 0.34
- keine unscharfe Kopie des Bildes als Hintergrund
- alle zentralen Motive, Geldobjekte und Labels vollständig erhalten

## Visuelle Bildwelt

- `FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3`
- `FINANZNEO_SERIES_LOCK: finanzneo-same-world-v1`
- ein einziger nahtloser charcoal-green-black Hintergrund
- keine Horizontlinie, Boden-/Wand-Trennung oder Hintergrundbänder
- Gold nur für Geld/finanziellen Wert
- Rot-Orange nur für Verlust, Risiko oder Preisdruck
- Emerald/Mint als positive/markentypische Akzente
- Premium Fintech Editorial 3D, nicht fotorealistisch, nicht kindlich

## Bildtext

- keine generierte Headline
- keine generierten Untertitel
- keine ganzen erklärenden Sätze
- nur die pro Prompt erlaubten kurzen deutschen Objektlabels

## Layout im finalen Reel

- Headline ungefähr im oberen sicheren Bereich um Y ≈ 78
- zentraler Visual-/Animationsbereich ungefähr Y ≈ 270–1350
- Untertitel ungefähr 320 px über dem unteren Rand
- linker Subtitle-Abstand ca. 62 px
- rechter Subtitle-Abstand ca. 150 px
- Plattform-UI und Caption-Zone dürfen keine wichtigen Motive verdecken

## Untertitel

- `sentence-with-audio-synced-active-word`
- vollständiger aktueller Satz, maximal zwei balancierte Zeilen
- aktives Wort: Finance-Green
- restlicher Satz: weiß
- keine vertikale Wortbewegung
- keine Wort-Skalierung
- kein unnötiges Verschwinden während kurzer Pausen
- ausschließlich echte Wortzeiten aus finalem Voiceover

## Audio

- ungefähr -16 LUFS Integrated
- True Peak höchstens -1 dBTP
- finales Voiceover ist alleinige Timing-Quelle

## Phase 3

Start erst nach erfolgreichem:

```bash
npm run reel:ready -- reels/2026-08-24_bis_2026-08-30/montag/reel-01_persoenliche-inflation
```

Danach: Asset-Integration → echte Timings → Remotion-Bau → Typecheck/Validatoren → Preview → visuelle Frame-QA → finaler MP4-Render → Audio-QA.
