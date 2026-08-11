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

Native Remotion-Szenen verwenden ebenfalls genau einen durchgehenden Full-Canvas-Hintergrund ohne Boden, Horizont, Wand-Split oder Studio-Zonen.

## 7. Bilddarstellung — full-frame-no-crop

Verbindlich:

- Nutzerbild ist ein vertikales 9:16-Bild
- Nutzerbild belegt die **gesamte 1080×1920-Szene**
- kein `VisualStage` oder anderer kleiner Mittel-Container um Nutzerbilder
- kein absichtlicher Crop
- kein Zoom-/Focal-Point-Vertrag
- kein sichtbarer Inset-Bildrand
- keine unscharfe Bildkopie als Hintergrund
- Headline + Untertitel als Overlay über demselben Vollbild
- nur weicher kontinuierlicher Transparenz-Scrim für Lesbarkeit
- keine harte obere/untere Remotion-Hintergrundfläche

Produktive Bildszenen verwenden:

```text
src/design-system/FullFrameImage.tsx
```

`object-fit: contain` ist nur auf der kompletten 1080×1920-Szenenfläche für eine vertikale 9:16-Quelle zulässig; die alte kleine `contain`-Poster-Darstellung ist verboten.

`AdaptiveSafeFillImage`, `focalX/focalY` und alte Scale-/Crop-Verträge sind nicht mehr aktiv.

## 8. Vertikales Layout

Richtwerte für 1080 × 1920:

```text
headlineTop       ≈ 72
Bildszene          = Y 0–1920 vollständig
Animationsinhalt   ≈ Y 220–1490
subtitleBottom    ≈ 300
subtitleLeft      ≈ 64
subtitleRight     ≈ 156
platformUiBottom  ≥ 260
```

- Bildszenen besitzen keinen separaten mittleren Visualbereich.
- Native Animationsinhalte nutzen den Mittelraum, ihr Hintergrund bleibt aber Full-Canvas.
- Untertitel niedrig, aber oberhalb der Plattform-UI-Totzone.
- Rechts zusätzliche UI-Safe-Area.
- Kein schwarzer Footer unter dem Bild und kein separater Header-Hintergrund.

## 9. Untertitel

- **genau ein vollständiger Satz gleichzeitig**
- niemals zwei Sätze gleichzeitig
- hart maximal zwei sichtbare Zeilen
- ausreichend große Smartphone-Schrift; zu langen Satz sinnvoll teilen statt Text winzig zu machen
- aktives Wort grün, Rest weiß
- vorherigen Satz während kurzer Pause halten
- Satzwechsel exakt beim Start des ersten gesprochenen Wortes des neuen Satzes
- keine Caption-Lücken
- keine springenden Wörter/Größenanimation
- keine undurchsichtige/schwarze Caption-Karte

Generische Komponente:

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
- alle Szenenhintergründe ohne sichtbaren Floor-/Wall-/Horizont-Split

## 12. Publishing — eine Caption für alle Plattformen

`04-caption/` enthält nur:

```text
caption.txt
word-timings.json
```

`caption.txt` wird **unverändert** für Instagram Reels, TikTok, Facebook Reels und Snapchat verwendet.

Die finale Caption ist direkt kopierfertig und folgt diesem Standard:

- starke ehrliche Hook-Zeile am Anfang
- kurze Kernaussage / Aha-Nutzen
- natürlicher Save-/Follow-/Kommentar-CTA nur wenn passend
- **genau 5 passende Hashtags**
- keine zufälligen Trend-Tags, kein Hashtag-Spam
- keine garantierten Viralitätsversprechen
- kein `CAPTION:`-Header oder andere Template-Marker im finalen Text
- keine Fakten, die nicht durch Skript/Recherche gedeckt sind

Diese alten Dateien sind in aktiven neuen Reels verboten:

```text
instagram-reels.txt
tiktok.txt
facebook-reels.txt
snapchat.txt
youtube-shorts.txt
```

YouTube ausschließlich Longform unter `youtube/`.

## 13. Autopilot-Finalisierung

Wenn Pflichtbilder + genau ein Audio vorhanden sind und der Nutzer das Reel fertigstellen lässt, arbeitet Antigravity ohne `weiter?` bis zum vollständigen Ergebnis:

```text
Medien prüfen
→ echte Wortzeiten
→ Szenentiming
→ Remotion
→ full-frame-no-crop Bilder
→ genau-ein-Satz-Karaoke
→ eine universelle Caption + genau 5 Hashtags
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

Bei visueller QA explizit prüfen: kein zweiter Hintergrund, kein abgeschnittener Bildboden, keine harten Header/Footer-Flächen, kein Inset-Panel, keine schwarze Caption-Karte, keine zwei Untertitelsätze, sichere Untertitelposition.

Finaler Validator:

```bash
npm run reel:validate -- <TARGET-REEL> --final
```

Normale technische Fehler werden selbstständig behoben. Stoppen nur bei echten Blockern gemäß `CLAUDE.md`.

## 14. Freigabe

**PRODUCTION COMPLETE** erst nach tatsächlicher finaler Validierung, Typecheck, Preview, visueller Prüfung, vollständigem MP4, fertiger universeller Caption mit genau 5 Hashtags und Safety Audit.

Merge und Publishing bleiben separate Nutzerfreigaben.
