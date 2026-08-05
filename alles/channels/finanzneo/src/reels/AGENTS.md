# Regeln für künftige Reel-Quellordner

Jeder Unterordner enthält genau eine fertig vorbereitete Remotion-Composition.

Vor dem Codex-Build müssen bereits vorhanden sein:

- eigener Remotion-Einstiegspunkt,
- vollständige Composition,
- alle individuellen Animationskomponenten,
- Bildszenen, Audio, Captions und Overlays,
- Bewegungsphasen relativ zur finalen Szenendauer.

Die Composition liest die allgemeinen Runtime-Props mit Reel-Metadaten, Audio, Captions und Szenen. Animationsphasen skalieren immer relativ zu `durationInFrames` und nicht zu alten geschätzten Frames.

Erst nach vollständiger Vorprogrammierung darf das Projektmanifest auf `prebuilt-ready` gesetzt werden. Alle Animationen bleiben für Codex gesperrt (`editableByCodex: false`). Danach führt Codex nur den allgemeinen Befehl aus:

```bash
npm run finance:reel:build -- <projektordner>
```

Keine kreative Neuentwicklung durch Codex.
