# FinanzNeo — verbindliche Claude-Code-Regeln

## Repository-Struktur

Aktive Reel-Projekte liegen unter:

```text
../reels/<woche>/<wochentag>/<reel-name>/
```

Technischer Code liegt unter `alles/`. Nie erneut `channels/finanzneo/reels` als Produktionsablage erzeugen.

## Zwei klar getrennte Phasen

### Phase 1: vollständige Vorarbeit

Bei einem neuen Reel werden vor dem technischen Handoff vollständig erstellt:

- Thema, Quellen, Skript, Hook und Payoff,
- Szenenreihenfolge,
- vollständige Prozess-Bildprompts,
- alle individuellen Remotion-Animationen als fertiger Code,
- komplette Reel-Composition,
- gemeinsames Überschriftensystem,
- eigener Remotion-Einstiegspunkt,
- allgemeines Build-Manifest.

Jedes neue Projekt besitzt:

```text
timeline/reel-build-manifest.json
```

Während der Vorarbeit bleibt der Status:

```text
awaiting-prebuild
```

Erst wenn Composition und alle Animationen wirklich implementiert sind, wird gesetzt:

```text
status: prebuilt-ready
codexAnimationCodingRequired: false
prebuiltApproval.approvedByPlanningAssistant: true
prebuiltApproval.animationsImplemented: true
prebuiltApproval.compositionImplemented: true
prebuiltApproval.visualQualityV2Implemented: true
```

Animationsphasen müssen relativ zur späteren transkriptbasierten Szenendauer funktionieren. Keine alten festen Planungsframes verwenden.

### Phase 2: automatische Assembly

Bei einem Reel mit `prebuilt-ready` nichts kreativ neu planen und keine Animation neu programmieren. Aus `alles/` nur ausführen:

```bash
npm run finance:reel:build -- <projektordner>
```

Der allgemeine Build übernimmt automatisch:

- Manifest- und Quellcodeprüfung,
- beliebig benannte Medien erkennen,
- Voiceover pitch-erhaltend auf 1,10× bringen,
- lokale deutsche Whisper-Transkription,
- echte Wort- und Szenenzeiten,
- Runtime-Asset-Staging,
- TypeScript und Regressionstests,
- Remotion-Render,
- Cover, Kontaktbogen und QA-Berichte.

## Medienregeln

### Audio

Genau eine unterstützte Datei in `02-audio/`. Dateiname egal.

```text
.wav .mp3 .m4a .aac .flac .ogg .opus .mp4 .mov .m4v .webm
```

### Bilder

Bei jeder Bildszene genau eine Datei im passenden `scene-XX`-Ordner. Der Ordner bestimmt die Szene, nicht der Dateiname.

```text
.png .jpg .jpeg .webp .avif
```

Bei null oder mehreren passenden Dateien stoppen.

## Visual Quality V2 für alle zukünftigen Reels

Das bestehende ETF-Testreel bleibt im bisherigen Profil. Alle danach geplanten Reels verwenden:

```text
creativeRules.visualQualityProfile: finanzneo-process-v2
```

### Szenenverteilung

Ziel:

```text
60 % Bilder
40 % Animationen
```

Erlaubter ganzzahliger Bereich:

```text
55–65 % Bilder
35–45 % Animationen
```

Standardaufteilungen:

- 5 Szenen: 3 Bilder + 2 Animationen
- 7 Szenen: 4 Bilder + 3 Animationen
- 8 Szenen: 5 Bilder + 3 Animationen
- 9 Szenen: 5 Bilder + 4 Animationen

Bevorzugter Produktionsstandard: **9 Szenen mit 5 Prozessbildern und 4 hochwertigen Animationen**. Das passt zum bestehenden 60–75-Sekunden- und 9–14-Beat-System.

Keine schwache Animation nur zur Erfüllung der Quote. Jede Animation muss mindestens das Niveau der guten ETF-Prozessanimationen erreichen und einen eigenen Startzustand, eine sichtbare Handlung, einen eigenen Endzustand sowie eine andere Raumlogik besitzen.

## Prozessbilder

Bilder bleiben Vollbild, dürfen aber nicht bloß dekorativ sein. Jede Bildszene zeigt gleichzeitig:

1. sichtbare Ausgangslage,
2. sichtbaren Prozessweg oder eine klare Verbindung,
3. sichtbares Ergebnis.

Jeder Bildprompt und jedes Codex-Paket benötigen:

```text
image.process.startState
image.process.processPath
image.process.resultState
image.process.instantReadabilitySeconds: 1
image.process.decorativeOnly: false
```

Verboten:

- Figur steht nur neben einem Finanzobjekt,
- wiederholte transparente Miniaturkästen,
- viele kleine Dekorationen ohne Erklärwert,
- winzige Beschriftungen im generierten Bild,
- unverbundene Symbole,
- Dashboard-Karten als Bildersatz.

Längere Bildszenen erhalten mindestens zwei kontrollierte Bewegungsphasen, die entlang des Prozesswegs vom Ausgangspunkt zum Ergebnis führen.

## Überschriftensystem

Alle zukünftigen Compositions müssen verwenden:

```text
alles/channels/finanzneo/src/reels/shared/FinanzNeoSceneHeader.tsx
```

Profil:

```text
finanzneo-scene-header-v2
```

Pflicht:

- Hauptüberschrift mindestens 72 px, Standard 78 px,
- maximal zwei Zeilen,
- sehr helle Schrift,
- passendes Icon pro Szene,
- weicher dunkler Verlauf im oberen Bildbereich,
- deutlicher Textschatten,
- heller grüner oder mintfarbener Kicker,
- niemals schwarze oder dunkelgraue Hauptschrift auf dunklem Hintergrund,
- keine harte schwarze Rechteckbox hinter der Überschrift.

## Zeitliche Quelle der Wahrheit

Nach der lokalen Audioverarbeitung gilt:

```text
timeline/scene-timing.json
```

Geplante und endgültige Zeiten müssen nicht identisch sein. Die Originalaufnahme bleibt unverändert. Im Render wird die erzeugte 1,10×-Runtime-Datei verwendet.

## Fehlerbehebung in Phase 2

Nur den kleinsten konkret nachgewiesenen technischen Fehler beheben und denselben allgemeinen Build erneut ausführen.

Nicht erlaubt:

- kreative Neuentwicklung,
- alternative Animationen,
- spekulative Refaktorierung,
- globale Feature-Flags,
- automatisches Routing,
- Merge nach `main`,
- PR auf Ready setzen,
- menschliche Freigabe selbst behaupten.
