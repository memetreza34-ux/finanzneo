# FinanzNeo Reel Template

Datengetriebene Vorlage für vertikale FinanzNeo-Reels von 60 bis 90 Sekunden.

## Ziel

Neue Reels übernehmen den kanonischen FinanceNeo-Vertrag automatisch. Verbindlich sind `CLAUDE.md`, `reels/PRODUKTIONSSTANDARD.md` und für V17+ `docs/REEL-QUALITY-CONTRACT-V2.md`.

## Visual-Mix für neue Reels

Ziel:

```text
60 % native Remotion-Animation
40 % Google-Flow-Bilder
```

Finale V17-Laufzeit:

```text
55–65 % Animation
35–45 % Bilder
```

Bei 10 Szenen standardmäßig 6 Animationen + 4 Bilder. Keine zwei Bildszenen direkt hintereinander; statische Bildszene normalerweise maximal 8 Sekunden.

Dynamische Information wie Vergleich, Rechnung, Timeline, Wachstum, Geldfluss oder Mechanismus ist animation-first.

## Beat-Typen

- `hook`
- `explain`
- `number`
- `compare`
- `checklist`
- `image`
- `cta`

## Image-Beats — full-frame-no-crop

Image-Beats verwenden `FullFrameImage`.

- komplette vertikale 9:16-Quelle über die gesamte 1080×1920-Szene
- kein mittlerer `VisualStage` / kein Inset-Poster
- kein absichtlicher Crop oder Focal-Point-Vertrag
- kein sichtbarer Bildrand
- keine unscharfe Bildkopie als Hintergrund
- Szene 01+: Headline + Caption als Overlay über demselben Vollbild
- nur weicher kontinuierlicher `FullFrameReadabilityScrim`
- keine harten Header-/Footer-Flächen

Jedes Nutzerbild muss vor Einbau semantisch gegen den gesprochenen Beat geprüft werden. Unpassendes/falsches Bild → nicht rendern; wenn Nutzer neu generieren muss → `BLOCKED`.

`focalX`, `focalY`, `objectFit` und Crop-/Scale-Regeln sind kein Teil des produktiven Image-Beat-Vertrags.

## Captions

Die Vorlage verwendet `SentenceKaraokeCaptions`.

- Wörter benötigen echte `start`/`end`-Zeitstempel aus dem finalen Audio
- genau **eine kurze Caption-Einheit gleichzeitig**
- ein langer gesprochener Satz darf in mehrere nacheinander angezeigte Bedeutungs-/Pauseneinheiten geteilt werden
- niemals zwei Caption-Einheiten gleichzeitig
- maximal 12 Wörter pro Einheit
- maximal 68 Zeichen pro Einheit
- hart maximal zwei sichtbare Zeilen
- mindestens 42 px effektive Schriftgröße
- aktives Wort grün nur während echter Wortzeit
- Einheit bleibt durch kurze Pause sichtbar
- Wechsel beim ersten gesprochenen Wort der nächsten Einheit
- keine gleichmäßig geschätzten Wortzeiten
- keine undurchsichtige/schwarze Caption-Karte
- horizontaler Overflow/Clipping ist ein Renderfehler

## Layout

```text
Headline Top        ≈ 72
Image Beat          = Full Frame Y 0–1920
Native Content      ≈ Y 220–1490
Caption Bottom      ≈ 320
Caption Left        ≈ 72
Caption Right       ≈ 180
Platform UI Bottom  ≥ 280
```

## Native Remotion-Szenen

Der Hintergrund läuft über die komplette 1080×1920-Szene und darf keinen Boden, Horizont, Wand-/Studio-Split oder sichtbare obere/untere Zone erzeugen.

Animationen sind nicht nur Dekoration. Sie erklären Bewegung, Vergleich, Rechnung, Zeitentwicklung oder Mechanismus.

## Timing

Finales Audio ist die einzige Zeitquelle:

```text
final audio
→ real word timestamps
→ caption units
→ resolved scene timeline
→ animation timing
```

Finale Timeline darf keine ungelösten `durationFrames: 0` enthalten.

## Konfigurationsprüfung

Vor finaler Freigabe werden u. a. geprüft:

- 60–90 Sekunden
- positive reale Frame-Dauern
- V17-Visualmix und Laufzeitquote
- keine direkt aufeinanderfolgenden Bildszenen
- Bildszene normalerweise <= 8 Sekunden
- Image-Beats besitzen Bildquelle
- keine alten Framing-Felder
- echte Caption-Zeitstempel
- Caption-Längen/Safe-Area
- vollständige Final-MP4-QA

## Safe-Area-Guide

Für Studio-Prüfung:

```ts
showSafeAreaGuide: true
```

Vor Produktionsrender:

```ts
showSafeAreaGuide: false
```

## Zahlen

Zahlenbeats dürfen keine erfundenen Ergebnisse enthalten. Werte kommen aus zentralen Finanzberechnungen, validierten Daten oder klar markierten Beispielannahmen.

## Final-QA

Neue V17-Reels dokumentieren die tatsächliche vollständige MP4-Prüfung in:

```text
05-projektdateien/final-qa.json
```

`status: passed` erst nach echter Prüfung von Bild/Voice-Match, Szenensync, Caption-Safe-Area, Wort-Sync, 55–65 % Animationslaufzeit, statischen Tails und Audiopegeln.

## Demo

`ReelTemplateDemo.tsx` liegt unter Experiments und ist keine Produktionsfreigabe.
