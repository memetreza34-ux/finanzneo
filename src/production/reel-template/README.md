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
- **jeder Beat besitzt ein passendes `icon` für `SceneHeader`**
- Image-Beats besitzen eine Datei
- **Image-Beats dauern maximal 6,0 Sekunden**; sonst splitten oder animieren
- Checklisten besitzen mindestens einen Punkt

## Zwischenüberschrift + Icon

Jede Szene erhält automatisch über den zentralen Renderpfad einen `SceneHeader`.

```tsx
{
  id: 'kontoauszug',
  type: 'image',
  icon: 'search',
  headline: 'KONTOAUSZUG PRÜFEN',
  // ...
}
```

Standard:

- Icon grün
- Headline weiß
- gleiche Top-Position in jeder Szene
- `headerTone: 'warning'` nur für echte Warnung/Problem
- `headerTone: 'money'` nur für Geld-/Wertfokus

## Untertitel

Die zentrale `Captions`-Komponente erzwingt:

- aktive Wortfarbe: FinanzNeo-Grün
- restliche Wörter: Weiß
- satzbasierte Einheiten
- maximal zwei Zeilen
- kein gelbes/goldenes Karaoke-Active-Word
- kein schwarzer Untertiteltext
- kein Word-Jump
- kein Scale-Pop
- Caption-Safe-Area: bottom 320, left 62, right 150

Lokale `highlight`-/`color`-Overrides dürfen die Caption-Farblogik nicht verändern.

## Animationsfarben

Auf dunklen Reel-Flächen gilt `ANIMATION_COLORS`:

- weiß = neutral
- grün = Fokus/Lösung
- rot = Problem/Warnung/Verlust
- gold = Geld/Wert
- schwarz = verboten

Komplexe Erkläranimationen können `MechanismCue` für klar erkennbare Start-/Ergebniszustände verwenden.

Jede Erkläranimation folgt:

```text
START → SICHTBARER MECHANISMUS → ERGEBNIS
```

## Beispiel

```tsx
import type {ReelConfig} from './types';

export const config: ReelConfig = {
  id: 'inflation-grundlage',
  title: 'Was macht Inflation mit deinem Geld?',
  fps: 30,
  audioSrc: 'audio/inflation.mp3',
  captions: words,
  beats: [
    {
      id: 'hook',
      type: 'hook',
      icon: 'wallet',
      durationInFrames: 150,
      headline: 'DEIN GELD WIRD WENIGER WERT',
      subline: 'Auch wenn die Zahl auf dem Konto gleich bleibt.',
    },
    {
      id: 'image',
      type: 'image',
      icon: 'coins',
      durationInFrames: 150,
      headline: 'DIESELBE SUMME KAUFT WENIGER',
      imageSrc: 'images/inflation-01.webp',
      alt: 'Stylized 3D Kaufkraftmetapher',
    },
    {
      id: 'cta',
      type: 'cta',
      icon: 'check',
      durationInFrames: 150,
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

- oberen Bereich für `SceneHeader`
- mittleren Bereich für Bild, Zahl oder Erklärung
- unteren Bereich für Untertitel

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
- `docs/FINANZNEO-VISUAL-TIMING-AND-CLARITY-STANDARD.md`

Die Vorlage repariert kein falsch komponiertes KI-Bild.

## Zahlen

Zahlenbeats dürfen keine erfundenen Ergebnisse enthalten. Werte kommen aus:

- `src/finance/calculations.ts`
- validierten Datendateien
- klar markierten Beispielannahmen

## Demo

`ReelTemplateDemo.tsx` enthält eine Demo zum Thema Notgroschen.

Die Demo:

- liegt unter Experiments
- zeigt das Safe-Area-Raster
- besitzt pro Beat ein Icon
- nutzt die neue Caption-/SceneHeader-Logik
- besitzt noch kein Voiceover und keine echten Untertitel
- ist nicht zur Veröffentlichung freigegeben
