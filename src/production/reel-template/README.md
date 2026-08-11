# FinanzNeo Reel Template

Datengetriebene Vorlage für vertikale FinanzNeo-Reels von 60 bis 90 Sekunden.

## Ziel

Neue Reels übernehmen den kanonischen FinanceNeo-Vertrag automatisch, statt alte Layout-/Caption-Regeln neu zu erfinden.

## Beat-Typen

- `hook`
- `explain`
- `number`
- `compare`
- `checklist`
- `image`
- `cta`

## Image-Beats — verbindlich full-frame-no-crop

Image-Beats verwenden `FullFrameImage`.

- komplette vertikale 9:16-Quelle über die gesamte 1080×1920-Szene
- kein mittlerer `VisualStage` / kein Inset-Poster
- kein absichtlicher Crop oder Focal-Point-Vertrag
- kein sichtbarer Bildrand
- keine unscharfe Bildkopie als Hintergrund
- Headline + Caption liegen als Overlay über demselben Vollbild
- nur ein weicher kontinuierlicher `FullFrameReadabilityScrim` für Lesbarkeit
- keine harten Header-/Footer-Flächen

Beispiel:

```tsx
{
  id: 'image',
  type: 'image',
  durationInFrames: 330,
  headline: 'DIESELBE SUMME KAUFT WENIGER',
  imageSrc: 'images/inflation-01.webp',
  alt: 'Geld verliert auf dem Weg zu einem Warenkorb sichtbar an Kaufkraft',
}
```

`focalX`, `focalY`, `objectFit` und Crop-/Scale-Regeln sind kein Teil des produktiven Image-Beat-Vertrags.

## Captions

Die Vorlage verwendet `SentenceKaraokeCaptions`.

- Caption-Wörter benötigen echte `start`/`end`-Zeitstempel aus dem finalen Audio
- **genau ein vollständiger Satz gleichzeitig**
- niemals zwei Sätze gleichzeitig
- hart maximal zwei sichtbare Zeilen
- ausreichend große Smartphone-Schrift
- aktives Wort grün
- Satz bleibt durch kurze Pausen sichtbar
- Satzwechsel beim ersten Wort des nächsten Satzes
- keine gleichmäßig geschätzten Wortzeiten
- keine undurchsichtige/schwarze Caption-Karte

## Layout

```text
Headline Top        ≈ 72
Image Beat          = Full Frame Y 0–1920
Native Content      ≈ Y 220–1490
Caption Bottom      ≈ 300
Caption Left        ≈ 64
Caption Right       ≈ 156
Platform UI Bottom  ≥ 260
```

Untertitel bleiben oberhalb der Plattform-UI-Totzone; rechts bleibt zusätzlicher Abstand für vertikale UI-Buttons.

## Native Remotion-Szenen

Der Hintergrund läuft über die komplette 1080×1920-Szene und darf keinen Boden, Horizont, Wand-/Studio-Split oder sichtbare obere/untere Zone erzeugen.

## Konfigurationsprüfung

Vor dem Render werden u. a. geprüft:

- 60–90 Sekunden
- Hook zuerst, CTA zuletzt
- eindeutige Beat-IDs
- positive ganzzahlige Frame-Dauern
- Image-Beats besitzen Bildquelle
- keine alten Framing-Felder wie `focalX`, `focalY` oder `objectFit`
- Caption-Zeitstempel sind chronologisch und gültig

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

## Demo

`ReelTemplateDemo.tsx` liegt unter Experiments und ist keine Produktionsfreigabe. Der Validator verhindert, dass alte Adaptive-Safe-Fill-/Inset-/gruppenbasierte Caption-Regeln wieder in das produktive Template zurückkehren.
