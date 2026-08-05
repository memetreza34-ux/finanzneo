# Allgemeines Build-System für alle zukünftigen FinanzNeo-Reels

## Grundprinzip

Jedes neue Reel verwendet dieselbe Produktionspipeline. Individuell sind nur Thema, Bilder, Skript, Composition und Animationen. Audioverarbeitung, Transkription, Medienerkennung, Rendering und QA sind allgemein.

## Ablauf

### 1. Projekt anlegen

Der normale Reel-Scaffolder erzeugt automatisch:

```text
timeline/reel-build-manifest.json
```

Anfangsstatus:

```text
awaiting-prebuild
```

In diesem Zustand darf Codex keine Animation entwickeln.

### 2. Vorarbeit vollständig abschließen

Vor dem technischen Build werden erstellt:

- vollständiges Skript,
- Bildprompts,
- fertige individuelle Animationskomponenten,
- komplette Remotion-Composition,
- eigener Remotion-Einstiegspunkt,
- vollständige Manifestpfade.

Anschließend wird das Manifest auf `prebuilt-ready` gesetzt und die drei Vorarbeitsfreigaben werden auf `true` gesetzt.

### 3. Nutzer legt Medien ab

- genau eine beliebig benannte Audio- oder Videodatei in `02-audio/`
- genau ein beliebig benanntes Bild in jedem erwarteten Bildszenenordner

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
4. beschleunigt das Voiceover pitch-erhaltend auf 1,10×,
5. transkribiert lokal mit Whisper.cpp,
6. erzeugt echte Wort-Zeitstempel,
7. berechnet lückenlose Szenengrenzen,
8. erkennt Bilder nach Szenenordnern,
9. erzeugt allgemeine Render-Props,
10. führt Tests und TypeScript aus,
11. rendert MP4 und Cover,
12. erzeugt Kontaktbogen und QA-Berichte.

## Manifestvertrag

Pflichtfelder:

```text
version
slug
status
codexAnimationCodingRequired
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

Für jedes fertige Reel gilt:

```text
status: prebuilt-ready
codexAnimationCodingRequired: false
animations[*].editableByCodex: false
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
