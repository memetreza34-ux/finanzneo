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
- Bildprompts,
- individuelle Animationen als fertigen Remotion-Code,
- vollständige Reel-Composition,
- Remotion-Einstiegspunkt,
- Manifest mit allen Quell- und Exportpfaden.

Codex darf diese Animationen nicht neu planen, umdeuten oder programmieren.

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
- 1,10×-Voiceover mit erhaltener Tonhöhe,
- lokale Whisper-Transkription,
- echte Wort- und Szenenzeiten,
- Runtime-Asset-Staging,
- TypeScript und Regressionstests,
- Remotion-Render,
- Cover, Kontaktbogen und QA-Berichte.

## Fehlerbehebung

Nur konkrete, reproduzierbare technische Fehler minimal beheben. Keine kreative Neuentwicklung, keine alternative Animation, kein globales Feature-Flag, kein Merge und keine automatische Nutzerfreigabe.
