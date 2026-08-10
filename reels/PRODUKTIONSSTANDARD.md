# FinanzNeo-Reel-Produktionsstandard

> `CLAUDE.md` ist die höchste Regelquelle. Bei Widersprüchen gilt ausschließlich `CLAUDE.md`.

## 1. Reel-Struktur

```text
01-script/
02-audio/
03-szenen/
04-caption/
05-projektdateien/
README.md
```

Keine doppelten Hauptordner für dieselbe Funktion.

## 2. Nutzer-Medien — harte Grenze

Finaler Build verwendet ausschließlich:

```text
Bilder: 03-szenen/00-ALLE-BILDER-HIER-REIN/
Audio:  02-audio/
```

- Bilddateien aus Einzel-Szenenordnern sind als Nutzer-Medien verboten.
- Keine Bilder/Audio aus anderen Reels, Archiv, Desktop, Downloads, Web, Stock, Cache oder alten Exporten.
- Keine Platzhalter/Ersatzmedien.
- Pflichtmedium fehlt/falsch/unlesbar → **BLOCKED** mit exaktem Pfad.
- Finaler Build verlangt genau eine finale Audiodatei.

## 3. Bild- vs. Remotion-Szene

Bildszene:

```text
scene-XX/
├── bildprompt.txt
└── szene.md
```

Remotion-Szene:

```text
scene-XX/
├── remotion.md
└── szene.md
```

Eine Szene hat exakt eine Produktionsquelle. Animationsszenen bekommen kein Nutzerbild.

## 4. Google Flow

```text
Prompt lesen
→ genau EIN Bild erzeugen
→ sofort endgültig umbenennen
→ Motiv + Labels + Gesicht + Hintergrund + Dateiname prüfen
→ erst dann nächstes Bild
```

Bildnummer = echte Szenennummer. Cover = `Bild 00`. Animationsnummern bleiben reserviert.

Alle fertigen Nutzerbilder erst nach Abschluss gemeinsam nach:

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

## 5. Bildwelt

- Premium Fintech Editorial 3D
- eine dominante Finanzmetapher / Hero-Objekt
- optional stilisierte erwachsene Person; Gesicht immer klar sichtbar
- deep charcoal green-black
- emerald/mint Akzente
- Gold für Geld/Wert
- Rot-Orange für Verlust/Risiko/Schulden
- smooth rounded geometry
- keine Dioramen, Neon-Tunnel, Sci-Fi-Korridore, Dashboards, Pixar/Clay/Fotorealismus
- nur kurze deutsche Objektlabels, normalerweise 1–3 Wörter
- keine KI-Headline, kein KI-Untertitel, kein erklärender Satz

## 6. Hintergrund

Jedes Nutzerbild hat einen einzigen nahtlosen Hintergrund von oben bis unten.

Verboten:

- Prozent-Zonen
- horizontale Bänder
- separate obere/untere Fläche
- Floor-Wall-Grenze
- Horizont
- Panels

## 7. Bilddarstellung — adaptive-safe-fill

**`contain` als Standard ist nicht mehr gültig.**

Verbindlich:

- Bild füllt die verfügbare visuelle Fläche maximal aus
- kein kleines Poster innerhalb des Hochkant-Reels
- kein sichtbarer Inset-Bildrand
- keine unscharfe Bildkopie als Hintergrund
- zuerst leeren nahtlosen Hintergrund croppen
- Gesicht, Objektlabels, Hero-Objekt und Geld/Wert schützen
- `focalX`/`focalY` je Szene nutzen
- keine alte 1.04-Scale-Grenze
- keine alten `0.20/0.34`-Crop-Grenzen

Neue produktive Bildszenen verwenden:

```text
src/design-system/AdaptiveSafeFillImage.tsx
```

## 8. Vertikales Layout

Richtwerte für 1080 × 1920:

```text
headlineTop      ≈ 70
visualTop        ≈ 210
visualBottom     ≈ 1515
subtitleBottom   ≈ 280
subtitleLeft     ≈ 60
subtitleRight    ≈ 180
platformUiBottom ≥ 260
```

Bild/Animation soll nahezu den gesamten Raum zwischen Headline und Caption verwenden. Untertitel niedrig, aber oberhalb der Plattform-UI-Totzone. Rechts zusätzliche UI-Safe-Area.

## 9. Untertitel

- bevorzugt ein vollständiger Satz gleichzeitig
- maximal zwei sehr kurze Sätze gleichzeitig
- hart maximal zwei sichtbare Zeilen
- aktives Wort grün, Rest weiß
- vorherigen Satz während kurzer Pause halten
- Satzwechsel exakt beim Start des ersten gesprochenen Wortes des neuen Satzes
- keine Caption-Lücken
- keine springenden Wörter/Größenanimation

Neue generische Komponente:

```text
src/design-system/SentenceKaraokeCaptions.tsx
```

## 10. Worttiming

Nur echtes finales Voiceover aus `02-audio/`.

```text
finales Audio
→ echte start/end-Zeitstempel jedes Wortes
→ Satzanfänge
→ Szenenschnitte
```

Verboten:

- gleichmäßige mathematische Verteilung von Wörtern
- geschätzte Wortzeiten
- alte provisorische Timingtabellen als finaler Stand

`04-caption/word-timings.json` muss für einen finalen Build `timingStatus: final-audio-aligned` enthalten.

## 11. Remotion

- 1080 × 1920, 30 fps
- Szenenschnitte an echten Satzanfängen
- Animationen relativ zur tatsächlichen Szenendauer
- keine pauschal gleich langen Szenen
- Headlines/Icons in Remotion
- Bild- und Animationsszenen müssen visuell ähnlich präsent sein

## 12. Publishing

`04-caption/`:

```text
caption.txt
instagram-reels.txt
tiktok.txt
facebook-reels.txt
snapchat.txt
word-timings.json
```

Keine YouTube Shorts. YouTube ausschließlich Longform unter `youtube/`.

## 13. Autopilot-Finalisierung

Wenn Pflichtbilder + genau ein Audio vorhanden sind und der Nutzer das Reel fertigstellen lässt, arbeitet Antigravity ohne `weiter?` bis zum vollständigen Ergebnis:

```text
Medien prüfen
→ echte Wortzeiten
→ Szenentiming
→ Remotion
→ adaptive-safe-fill Framing
→ Satz-Karaoke
→ Plattformtexte
→ finaler Validator
→ TypeScript
→ Preview
→ visuelle QA
→ Full MP4
→ Audio-QA
→ Fehler selbst beheben/rerun
→ Safety Audit
→ Commit/Draft-PR
```

Finaler Validator:

```bash
npm run reel:validate -- <TARGET-REEL> --final
```

Normale technische Fehler werden selbstständig behoben. Stoppen nur bei echten Blockern gemäß `CLAUDE.md`.

## 14. Freigabe

**PRODUCTION COMPLETE** erst nach tatsächlicher finaler Validierung, Typecheck, Preview, visueller Prüfung, vollständigem MP4 und Safety Audit.

Merge und Publishing bleiben separate Nutzerfreigaben.
