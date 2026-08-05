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
- vollständige Bildprompts,
- alle individuellen Remotion-Animationen als fertiger Code,
- komplette Reel-Composition,
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

## Produktionsmodus

Standardmäßig:

- 5 bis 9 Szenen,
- mehr Bildszenen als Animationsszenen,
- Zielwert 5 Bilder und 2 Animationen,
- höchstens 40 Prozent Animationsszenen,
- keine zwei Animationen direkt hintereinander,
- keine Dashboard-Szene als Standardlösung.

Bilder bleiben Vollbild. Längere Bildszenen erhalten mindestens zwei kontrollierte Bewegungsphasen. Animationen zeigen konkrete Prozesse, Transformationen oder Ursache-Wirkung und werden vor dem Handoff vollständig programmiert.

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
