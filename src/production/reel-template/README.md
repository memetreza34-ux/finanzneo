# FinanzNeo Reel Template

Datengetriebene Vorlage für vertikale FinanzNeo-Reels von 60 bis 90 Sekunden.

## Ziel

Neue Reels sollen den kanonischen FinanceNeo-Vertrag automatisch übernehmen, statt alte Layout-/Caption-Regeln neu zu erfinden.

## Beat-Typen

- `hook`
- `explain`
- `number`
- `compare`
- `checklist`
- `image`
- `cta`

## Image-Beats — verbindlich adaptive-safe-fill

Image-Beats verwenden `AdaptiveSafeFillImage`.

- kein `contain`-Standard
- kein kleines 9:16-Poster innerhalb des 9:16-Reels
- Bildfläche maximal zwischen Headline und Caption
- leeren nahtlosen Hintergrund zuerst croppen
- Gesicht, Labels, Hero-Objekt und Geld/Wert schützen
- optional `focalX` / `focalY` zwischen 0 und 1 setzen
- kein sichtbarer Bildrand
- keine unscharfe Bildkopie als Hintergrund

Beispiel:

```tsx
{
  id: 'image',
  type: 'image',
  durationInFrames: 330,
  headline: 'DIESELBE SUMME KAUFT WENIGER',
  imageSrc: 'images/inflation-01.webp',
  alt: 'Geld verliert auf dem Weg zu einem Warenkorb sichtbar an Kaufkraft',
  focalX: 0.5,
  focalY: 0.52,
}
```

## Captions

Die Vorlage verwendet `SentenceKaraokeCaptions` statt alter fester Wortgruppen.

- Caption-Wörter benötigen echte `start`/`end`-Zeitstempel aus dem finalen Audio
- bevorzugt ein vollständiger Satz gleichzeitig
- hart maximal zwei sichtbare Zeilen
- aktives Wort grün
- Satz bleibt durch kurze Pausen sichtbar
- Satzwechsel beim ersten Wort des nächsten Satzes
- keine gleichmäßig geschätzten Wortzeiten

## Layout

Für Bildszenen gilt ungefähr:

```text
Visual Y ≈ 210–1515
Caption Bottom ≈ 280
Caption Left ≈ 60
Caption Right ≈ 180
```

Untertitel bleiben oberhalb der Plattform-UI-Totzone; rechts bleibt zusätzlicher Abstand für vertikale UI-Buttons.

## Konfigurationsprüfung

Vor dem Render werden u. a. geprüft:

- 60–90 Sekunden
- Hook zuerst, CTA zuletzt
- eindeutige Beat-IDs
- positive ganzzahlige Frame-Dauern
- Image-Beats besitzen Bildquelle
- `focalX`/`focalY` liegen zwischen 0 und 1
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

`ReelTemplateDemo.tsx` liegt unter Experiments und ist keine Produktionsfreigabe. Der Validator verhindert, dass alte `contain`-/gruppenbasierte Caption-Regeln wieder in das produktive Template zurückkehren.
