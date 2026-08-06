# Allgemeines Build-System für alle zukünftigen FinanzNeo-Reels

## Grundprinzip

Jedes neue Reel verwendet dieselbe Produktionspipeline. Individuell sind nur Thema, Prozessbilder, Skript, Composition und Animationen. Audioverarbeitung, Transkription, Medienerkennung, Rendering und QA sind allgemein.

Das bestehende ETF-Testreel bleibt im bisherigen Profil. Alle danach geplanten Reels verwenden **Visual Quality V2**.

## Visual Quality V2

Profil:

```text
finanzneo-process-v2
```

Zielverteilung:

```text
60 % Bilder / 40 % Animationen
```

Erlaubter ganzzahliger Bereich:

```text
55–65 % Bilder / 35–45 % Animationen
```

Standardverteilungen:

| Szenen | Bilder | Animationen |
|---:|---:|---:|
| 5 | 3 | 2 |
| 7 | 4 | 3 |
| 8 | 5 | 3 |
| 9 | 5 | 4 |

Bevorzugter Standard: **7 Szenen mit 4 Prozessbildern und 3 hochwertigen Animationen**.

### Prozessbilder

Jede Bildszene muss gleichzeitig zeigen:

- Ausgangslage,
- Prozessweg oder sichtbare Verbindung,
- Ergebnis.

Das Bild soll innerhalb ungefähr einer Sekunde verständlich sein. Nicht zulässig sind dekorative Figuren neben Finanzobjekten, wiederholte transparente Miniaturkästen, Dashboard-Karten, unverbundene Icon-Sammlungen und winzige Bildbeschriftungen.

### Überschriftensystem

Alle zukünftigen Compositions verwenden:

```text
alles/channels/finanzneo/src/reels/shared/FinanzNeoSceneHeader.tsx
```

Profil:

```text
finanzneo-scene-header-v2
```

Pflichtmerkmale:

- helle Hauptüberschrift,
- mindestens 72 px, Standard 78 px,
- maximal zwei Zeilen,
- passendes Icon pro Szene,
- weicher dunkler Verlauf im oberen Bildbereich,
- lesbarer Textschatten,
- heller grüner oder mintfarbener Kicker.

Schwarze oder dunkelgraue Hauptschrift auf dunklem Hintergrund und harte schwarze Textboxen sind verboten.

### Animationen

Jede Animation besitzt:

- eigenen Startzustand,
- konkrete sichtbare Handlung,
- eigenen Endzustand,
- eigene Raum- oder Bewegungslogik,
- relative Phasen anhand der endgültigen transkriptbasierten Szenendauer.

Eine schwache Animation wird nicht ergänzt, nur um die Quote zu erfüllen. Qualitätsboden ist das Niveau der beiden guten ETF-Prozessanimationen oder besser.

## Ablauf

### 1. Projekt anlegen

Der normale Reel-Scaffolder erzeugt automatisch:

```text
timeline/reel-build-manifest.json
timeline/visual-quality-profile.json
```

Anfangsstatus:

```text
awaiting-prebuild
```

In diesem Zustand darf Codex keine Animation entwickeln.

### 2. Vorarbeit vollständig abschließen

Vor dem technischen Build werden erstellt:

- vollständiges Skript,
- Prozess-Bildprompts,
- fertige individuelle Animationskomponenten,
- komplette Remotion-Composition,
- gemeinsamer Scene Header,
- eigener Remotion-Einstiegspunkt,
- vollständige Manifestpfade.

Anschließend wird das Manifest auf `prebuilt-ready` gesetzt und die Vorarbeitsfreigaben werden auf `true` gesetzt.

### 3. Nutzer legt Medien ab

- genau eine beliebig benannte Audio- oder Videodatei in `02-audio/`
- genau ein beliebig benanntes Prozessbild in jedem erwarteten Bildszenenordner

### 4. Codex führt nur den allgemeinen Build aus

Aus `alles/`:

```bash
npm run finance:reel:build -- <projektordner>
```

## Automatische Pipeline

Der allgemeine Befehl:

1. prüft das Build-Manifest,
2. bestätigt die vorprogrammierte Composition,
3. bestätigt alle vorprogrammierten Animationen,
4. prüft 60/40-Verteilung, Prozessbilder und Scene Header V2,
5. beschleunigt das Voiceover pitch-erhaltend auf 1,10×,
6. transkribiert lokal mit Whisper.cpp,
7. erzeugt echte Wort-Zeitstempel,
8. berechnet lückenlose Szenengrenzen,
9. erkennt Bilder nach Szenenordnern,
10. erzeugt allgemeine Render-Props,
11. führt Tests und TypeScript aus,
12. rendert MP4 und Cover,
13. erzeugt Kontaktbogen und QA-Berichte.

## Manifestvertrag

Pflichtfelder:

```text
version
slug
status
visualQualityProfile
sceneHeaderProfile
codexAnimationCodingRequired
expectedDistribution
composition.id
composition.entryPoint
composition.sourceRoot
runtime.prepareScript
runtime.propsFile
expectedSourceFiles
animations
outputs
prebuiltApproval
```

Für jedes fertige zukünftige Reel gilt:

```text
status: prebuilt-ready
visualQualityProfile: finanzneo-process-v2
sceneHeaderProfile: finanzneo-scene-header-v2
codexAnimationCodingRequired: false
animations[*].editableByCodex: false
prebuiltApproval.visualQualityV2Implemented: true
```

## Allgemeine Befehle

```bash
npm run finance:reel:verify -- <projektordner>
npm run finance:reel:prepare -- <projektordner>
npm run finance:reel:build -- <projektordner>
```

Der Build-Befehl führt `verify` und `prepare` selbst aus. Normalerweise ist nur `finance:reel:build` nötig.

## Automatische Ausgaben

```text
06-video/final-reel.mp4
00-cover/cover.png
05-review/contact-sheet.png
05-review/codex-render-qa.json
05-review/build-report.json
```

## Grenzen

Der allgemeine Builder erfindet keine individuelle Animation. Diese wird vorher vollständig programmiert. Dadurch spart Codex Tokens und konzentriert sich nur auf Ausführung und konkrete technische Fehler.

Die finale visuelle Freigabe bleibt immer manuell.
