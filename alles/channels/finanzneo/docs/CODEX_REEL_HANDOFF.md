# FinanzNeo – vollständige Übergabe an Codex

## Hauptstruktur

```text
finanzneo/
├── reels/
├── youtube/
└── alles/
```

Technische Befehle werden aus `alles/` ausgeführt. Aktive Reel-Projekte liegen unter:

```text
../reels/<woche>/<wochentag>/<reel-name>/
```

## Verbindliche Projektstruktur

```text
00-cover/
01-voice-script/
  script.md
  script-fliesstext.txt
  voiceover-anweisung.txt
  voiceover-final.wav
03-szenen/
  alle-bildprompts.txt
  EINZELNE-SZENEN/
    scene-01/
      bildprompt.txt
      scene-01-<name>.png
      szene.md
  scene-index.json
04-caption/
05-review/
06-video/
render/
timeline/
```

Das Voiceover liegt direkt beim Skript. Jedes Bild liegt direkt beim zugehörigen Bildprompt. Es gibt weder einen getrennten Audioordner noch einen zentralen Bilder-Einfügeordner.

## Phase A – kreatives Paket

Vor Codex müssen feststehen:

- Thema, zentrale Frage, Hook und Payoff,
- vollständiger Voiceover-Text,
- Cover-Text,
- Szenenreihenfolge und Szenenlängen,
- `image` oder `animation` pro Szene,
- vollständiger Bildprompt für jede Bildszene,
- genaue Remotion-Beschreibung für jede Animationsszene,
- Overlays, Captions, Übergänge und optionale Sound-Cues,
- Quellen und geprüfte Finanzrechnungen.

Maschinenlesbares Paket:

```text
<projekt>/timeline/codex-reel-package.json
```

Vorlage:

```text
channels/finanzneo/templates/codex-reel-package.template.json
```

## Phase B – Medien durch den Nutzer

Pflichtpfade:

```text
<projekt>/01-voice-script/voiceover-final.wav
<projekt>/03-szenen/EINZELNE-SZENEN/<scene>/bildprompt.txt
<projekt>/03-szenen/EINZELNE-SZENEN/<scene>/<bilddatei>.png
```

Bei jeder Bildszene müssen Bild und Prompt denselben Elternordner haben.

Vor Codex aus `alles/`:

```bash
npm run finance:codex-reel:check-ready -- <projekt>
```

Bei einem Projekt im Root beginnt `<projekt>` normalerweise mit `../reels/`.

## Phase C – Codex baut das Reel

Codex übernimmt:

1. Projekt- und Assetprüfung.
2. Reel-spezifische Remotion-Composition.
3. Einbindung aller Bilder.
4. Bildfahrten und Zooms laut Paket.
5. Umsetzung der beschriebenen narrativen Animationen.
6. Voiceover-Einbindung.
7. Untertitel.
8. Overlays, Cover, Übergänge und freigegebene Sound-Cues.
9. TypeScript, Tests, Stills und MP4-Render.
10. Visuelle Prüfung und einen ehrlichen Abschlussbericht.

Fehlen finale Wort-Zeitstempel:

```bash
npm run finance:codex-reel:captions -- <projekt>
```

Die erzeugten Captions basieren auf Skript und Audiodauer, nicht auf Spracherkennung.

## Standardauftrag für Codex

```text
Arbeite im Repository FinanzNeo und befolge alle AGENTS.md-Dateien.

Wechsle zuerst in den technischen Ordner:
cd alles

Aktives Projekt:
<PROJEKTORDNER>

Lies zuerst:
- <PROJEKTORDNER>/timeline/codex-reel-package.json
- <PROJEKTORDNER>/03-szenen/scene-index.json
- <PROJEKTORDNER>/05-review/production-status.json

Führe vor jeder Codeänderung aus:
npm run finance:codex-reel:check-ready -- <PROJEKTORDNER>

Stoppe bei einem Fehler und nenne die exakten fehlenden oder widersprüchlichen Felder und Dateien.

Prüfe zusätzlich:
- Voiceover liegt unter 01-voice-script/voiceover-final.wav.
- Jede Bilddatei liegt im selben Szenenordner wie bildprompt.txt.
- Es existieren weder 02-audio/ noch 03-szenen/BILDER-HIER-EINFUEGEN/.

Wenn die Prüfung erfolgreich ist:
1. Erstelle eine isolierte reel-spezifische Remotion-Composition.
2. Übernimm Skript, Szenenreihenfolge, Cover-Text, Bilddateien und Animationsbeschreibungen unverändert.
3. Bildszenen müssen die Hauptfläche einnehmen. Verwandle sie nicht in Dashboard-Karten.
4. Entwickle nur die im Paket vorgesehenen Animationsszenen.
5. Integriere Voiceover, Captions, Overlays, Übergänge und freigegebene Sound-Cues.
6. Erzeuge reel-spezifische Befehle für Studio, Stills, Render und Validierung.
7. Führe Typecheck, Tests, Stills und den vollständigen MP4-Render aus.
8. Prüfe mindestens einen Frame pro Szene, alle Übergänge, Untertitelbereich, Cover und Videoende.

Nicht mergen, keine Feature-Flags aktivieren, keine produktive Composition ersetzen und den PR nicht auf Ready setzen.

Berichte getrennt:
- implementierte Dateien,
- tatsächlich ausgeführte Befehle,
- bestandene Tests,
- Renderpfade und Dateigrößen,
- visuelle Prüfung pro Szene,
- verbleibende Probleme,
- Merge- und Produktionsstatus.
```

## Abnahme

Ein Reel ist erst fertig, wenn MP4, Bilder, Voiceover, Captions, Kontaktbogen, technische Prüfungen, visuelle Prüfung und Nutzerfreigabe vollständig vorhanden sind.
