# Verbindlicher Ablauf für alle FinanzNeo-Reels

Diese Regeln gelten für jeden Wochen-, Wochentags- und Reel-Ordner unter `reels/`.

## Jedes Reel benötigt ein Build-Manifest

Pflichtdatei:

```text
timeline/reel-build-manifest.json
```

Version:

```text
finanzneo-reel-build-v1
```

## Klare Aufgabentrennung

Die kreative Vorarbeit erstellt vor dem Codex-Build vollständig:

- Skript und Szenenreihenfolge,
- Prozess-Bildprompts,
- individuelle Animationen als fertigen Remotion-Code,
- vollständige Reel-Composition,
- standardisiertes Überschriftensystem,
- Remotion-Einstiegspunkt,
- Manifest mit allen Quell- und Exportpfaden.

Codex darf diese Animationen, Bilder oder das Überschriftensystem nicht neu planen, umdeuten oder programmieren.

## Visual Quality V2

Alle Reels nach dem ETF-Testreel verwenden:

```text
creativeRules.visualQualityProfile: finanzneo-process-v2
```

Zielverteilung:

```text
60 % Bilder / 40 % Animationen
```

Erlaubter Bereich:

```text
55–65 % Bilder / 35–45 % Animationen
```

Bevorzugt bei sieben Szenen:

```text
4 Prozessbilder + 3 hochwertige Animationen
```

Jedes Bild muss Ausgangslage, Prozessweg und Ergebnis sichtbar verbinden. Reine Dekorationsbilder sind nicht zulässig.

Jede Composition verwendet:

```text
alles/channels/finanzneo/src/reels/shared/FinanzNeoSceneHeader.tsx
```

Die Hauptüberschrift ist hell, mindestens 72 px groß, maximal zweizeilig und besitzt ein passendes Icon sowie einen weichen dunklen oberen Verlauf. Schwarze Schrift auf dunklem Hintergrund ist verboten.

## Manifeststatus

### `awaiting-prebuild`

Die Vorarbeit ist noch nicht abgeschlossen. Codex muss stoppen. Es darf nicht versuchen, die fehlende Composition oder Animationen selbst zu erzeugen.

### `prebuilt-ready`

Composition und Animationen sind vollständig programmiert und ausdrücklich freigegeben. Codex führt aus `alles/` nur diesen allgemeinen Befehl aus:

```bash
npm run finance:reel:build -- <projektordner>
```

## Der allgemeine Build übernimmt

- Medienerkennung ohne feste Dateinamen,
- Prüfung des V2-Qualitätsprofils,
- 1,10×-Voiceover mit erhaltener Tonhöhe,
- lokale Whisper-Transkription,
- echte Wort- und Szenenzeiten,
- Runtime-Asset-Staging,
- TypeScript und Regressionstests,
- Remotion-Render,
- Cover, Kontaktbogen und QA-Berichte.

## Fehlerbehebung

Nur konkrete, reproduzierbare technische Fehler minimal beheben. Keine kreative Neuentwicklung, keine alternative Animation, kein globales Feature-Flag, kein Merge und keine automatische Nutzerfreigabe.
