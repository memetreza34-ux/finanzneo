# FinanzNeo Reel Template

Datengetriebene Vorlage für vertikale FinanzNeo-Reels von 60 bis 90 Sekunden.

## Ziel

Ein neues Reel soll hauptsächlich über eine Konfiguration entstehen, nicht durch vollständiges Neuprogrammieren jeder Szene.

## Unterstützte Beat-Typen

- `hook`
- `explain`
- `number`
- `compare`
- `checklist`
- `image`
- `cta`

## Verbindliche Regeln

Die Konfiguration wird vor dem Render geprüft:

- Gesamtdauer zwischen 60 und 90 Sekunden
- erster Beat ist `hook`
- letzter Beat ist `cta`
- jede Beat-ID ist eindeutig
- jede Dauer ist eine positive ganze Framezahl
- Image-Beats besitzen eine Datei
- Checklisten besitzen mindestens einen Punkt
- erklärende Remotion-Beats besitzen Startzustand, Handlung, Endzustand und visuelle Metapher
- Untertitel bestehen aus echten Satzgruppen statt Wortblöcken

## Beispiel

```tsx
import type {ReelConfig} from './types';

export const config: ReelConfig = {
  id: 'inflation-grundlage',
  title: 'Was macht Inflation mit deinem Geld?',
  fps: 30,
  audioSrc: 'audio/inflation.mp3',
  captions: sentences,
  beats: [
    {
      id: 'hook',
      type: 'hook',
      durationInFrames: 240,
      headline: 'DEIN GELD WIRD WENIGER WERT',
      subline: 'Auch wenn die Zahl auf dem Konto gleich bleibt.',
    },
    {
      id: 'image',
      type: 'image',
      durationInFrames: 330,
      headline: 'DIESELBE SUMME KAUFT WENIGER',
      imageSrc: 'images/inflation-01.webp',
      alt: 'Geld verliert auf dem Weg zu einem Warenkorb sichtbar an Kaufkraft',
    },
    {
      id: 'cta',
      type: 'cta',
      durationInFrames: 270,
      headline: 'PRÜFE DEINE KAUFKRAFT',
      body: 'Nutze den kostenlosen Inflationsrechner.',
      keyword: 'INFLATION',
      offer: 'Kostenlose Checkliste und Rechner-Anleitung',
    },
  ],
};
```

Das Beispiel oben ist absichtlich unvollständig und muss vor Nutzung auf mindestens 60 Sekunden erweitert werden. Die automatische Validierung verhindert einen zu kurzen Render.

## Safe Areas

Die Vorlage trennt:

- oberen Bereich für Remotion-Überschriften
- mittleren Bereich für Bild, Zahl oder Erklärung
- unteren Bereich für Untertitel

Alle Werte kommen ausschließlich aus `src/brand/reel-contract.json`. Untertitel beginnen bei Y = 1360 direkt unter dem Visual, lassen rechts 150 px für Plattform-Bedienelemente frei und dürfen höchstens bis Y = 1600 reichen.

## Satz-Karaoke

- genau ein vollständiger Satz sichtbar
- höchstens 12 Wörter und 68 Zeichen pro Satz
- aktives Wort grün, übrige Wörter weiß
- keine Sprung-, Größen- oder Scale-Animation
- maximal zwei Zeilen
- zu lange Sätze verursachen einen Validierungsfehler und müssen im Skript gekürzt werden

## Cover

`ReelCover` setzt das quadratische Nutzerbild mit `contain` ein und rendert die eigentliche Cover-Headline zuverlässig in Remotion. Text wird nicht in das Google-Flow-Bild eingebrannt.

## Animationsqualität

Jeder Erklär-, Zahlen-, Vergleichs- und Checklisten-Beat benötigt `motion` mit:

- `visualMetaphor`
- `startState`
- `action`
- `endState`

Ein bloßer Fade, Zoom, wackelndes Icon oder erscheinender Balken genügt nicht als erklärende Animation.

Für die Studio-Prüfung:

```ts
showSafeAreaGuide: true
```

Vor dem Produktionsrender:

```ts
showSafeAreaGuide: false
```

## Bilder

Image-Beats erwarten Bilder, die bereits nach diesen Dokumenten freigegeben wurden:

- `docs/IMAGE-SYSTEM.md`
- `docs/IMAGE-QA-CHECKLIST.md`

Die Vorlage repariert kein falsch komponiertes KI-Bild.

## Zahlen

Zahlenbeats dürfen keine erfundenen Ergebnisse enthalten. Werte kommen aus:

- `src/finance/calculations.ts`
- validierten Datendateien
- klar markierten Beispielannahmen

## Demo

`ReelTemplateDemo.tsx` enthält eine 65-Sekunden-Demo zum Thema Notgroschen.

Die Demo:

- liegt unter Experiments
- zeigt das Safe-Area-Raster
- besitzt noch kein Voiceover und keine echten Untertitel
- ist nicht zur Veröffentlichung freigegeben
