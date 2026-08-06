# Regeln für künftige Reel-Quellordner

Jeder Unterordner enthält genau eine fertig vorbereitete Remotion-Composition.

Vor dem Codex-Build müssen bereits vorhanden sein:

- eigener Remotion-Einstiegspunkt,
- vollständige Composition,
- alle individuellen Animationskomponenten,
- Bildszenen, Audio, Captions und Overlays,
- Bewegungsphasen relativ zur finalen Szenendauer.

## Visual Quality V2

Alle neuen Quellordner nach dem ETF-Testreel setzen im Paket:

```text
creativeRules.visualQualityProfile: finanzneo-process-v2
```

Die Composition muss 55–65 Prozent Bildszenen und 35–45 Prozent Animationsszenen enthalten. Bevorzugter Produktionsstandard: **neun Szenen mit fünf Prozessbildern und vier hochwertigen Animationen**.

### Prozessbilder

Jede Bildszene zeigt in einem kohärenten Vollbild:

- sichtbare Ausgangslage,
- eindeutigen Prozessweg oder eine Verbindung,
- sichtbares Ergebnis.

Die Bildbewegung besteht aus mindestens zwei kontrollierten Phasen: zuerst Gesamtprozess, danach Fokusfahrt entlang des Prozesswegs zum Ergebnis. Keine dekorative Figur neben einem Finanzobjekt, keine wiederholten Miniaturkästen und keine winzigen Bildbeschriftungen.

### Gemeinsamer Scene Header

Jede neue Composition importiert und verwendet:

```text
../shared/FinanzNeoSceneHeader
```

Quelle:

```text
alles/channels/finanzneo/src/reels/shared/FinanzNeoSceneHeader.tsx
```

Profil:

```text
finanzneo-scene-header-v2
```

Der Header erzwingt:

- helle Hauptüberschrift,
- mindestens 72 px, Standard 78 px,
- maximal zwei Zeilen,
- passendes Icon pro Szene,
- weichen dunklen oberen Verlauf,
- starken lesbaren Textschatten.

Keine schwarze oder dunkelgraue Hauptüberschrift auf dunklem Hintergrund. Keine harte schwarze Rechteckbox.

### Animationen

Jede Animation besitzt einen eigenen Startzustand, eine sichtbare Handlung, einen anderen Endzustand und eine andere Raumlogik als die übrigen Animationen. Keine Dashboard-Karte, kein Balken und kein Zähler als einzige Handlung.

Die Composition liest die allgemeinen Runtime-Props mit Reel-Metadaten, Audio, Captions und Szenen. Animations- und Bildphasen skalieren immer relativ zu `durationInFrames` und nicht zu alten geschätzten Frames.

Erst nach vollständiger Vorprogrammierung darf das Projektmanifest auf `prebuilt-ready` gesetzt werden. Alle Animationen bleiben für Codex gesperrt (`editableByCodex: false`). Danach führt Codex nur den allgemeinen Befehl aus:

```bash
npm run finance:reel:build -- <projektordner>
```

Keine kreative Neuentwicklung durch Codex.
