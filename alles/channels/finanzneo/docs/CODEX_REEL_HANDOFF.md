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
02-audio/
  <genau eine Audiodatei, Name egal>
03-szenen/
  alle-bildprompts.txt
  EINZELNE-SZENEN/
    scene-01/
      bildprompt.txt
      szene.md
      <genau eine Bilddatei, Name egal>
    scene-02/
      animation.md
  scene-index.json
04-caption/
05-review/
06-video/
render/
timeline/
```

Es gibt keinen zentralen Bilder-Einfügeordner. Jede Bilddatei liegt direkt im passenden Szenenordner. Der Ordner bestimmt die Szenennummer.

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

### Voiceover

Genau eine unterstützte Datei in:

```text
<projekt>/02-audio/
```

Der Name ist egal. Unterstützt werden WAV, MP3, M4A, AAC, FLAC, OGG, OPUS sowie MP4, MOV, M4V und WEBM mit Audiospur.

### Bilder

Bei jeder Bildszene genau eine unterstützte Bilddatei in:

```text
<projekt>/03-szenen/EINZELNE-SZENEN/scene-XX/
```

Der Name ist egal. Unterstützt werden PNG, JPG, JPEG, WEBP und AVIF.

Beispiel:

```text
scene-01/100_euros_irgendwas.jpeg → Szene 1
scene-03/export.png               → Szene 3
```

Bei null oder mehreren passenden Dateien stoppt der Validator, damit nichts verwechselt wird.

Vor Codex aus `alles/`:

```bash
npm run finance:codex-reel:check-ready -- <projekt>
```

Die Ausgabe nennt den tatsächlich erkannten Audio- und Bildpfad für jede Bildszene.

## Laufzeitregel

Die reale Voiceover-Datei ist die zeitliche Quelle der Wahrheit. Das Paket darf zwischen 25 und 90 Sekunden lang sein.

Wenn die gemessene Audiodauer deutlich von der geplanten Szenensumme abweicht, wird nicht automatisch beschleunigt, gekürzt oder gestreckt. Stattdessen müssen `composition.targetDurationSec`, `composition.durationInFrames`, `voiceover.measuredDurationSec` und alle `scene.durationSec` auf dieselbe reale Laufzeit abgestimmt werden.

Bei längeren Bildszenen sind mindestens zwei kontrollierte Bewegungsphasen vorzusehen, damit das Bild nicht über viele Sekunden statisch bleibt.

## Phase C – Codex baut das Reel

Codex übernimmt:

1. Projekt- und Assetprüfung.
2. Übernahme der automatisch erkannten Medienpfade.
3. Reel-spezifische Remotion-Composition.
4. Einbindung aller Bilder.
5. Bildfahrten und Zooms laut Paket.
6. Umsetzung der beschriebenen narrativen Animationen.
7. Voiceover-Einbindung.
8. Untertitel.
9. Overlays, Cover, Übergänge und freigegebene Sound-Cues.
10. TypeScript, Tests, Stills, MP4-Render und visuelle Prüfung.

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

Verwende exakt die in der Ausgabe automatisch erkannten Medienpfade. Fordere keine Umbenennung an.

Regeln:
- Genau eine unterstützte Datei in 02-audio; Dateiname egal.
- Genau eine unterstützte Bilddatei pro erwarteter Bildszene; Dateiname egal.
- Der scene-XX-Ordner bestimmt die Szenennummer.
- Die gemessene Audiodauer ist die zeitliche Quelle der Wahrheit.
- Audio nicht automatisch beschleunigen, kürzen oder zeitlich strecken.
- Bei null oder mehreren passenden Dateien stoppen und die Kandidaten nennen.

Wenn die Prüfung erfolgreich ist:
1. Erstelle eine isolierte reel-spezifische Remotion-Composition.
2. Übernimm Skript, Reihenfolge, Cover, erkannte Bilder und Animationsbeschreibungen unverändert.
3. Bildszenen nehmen die Hauptfläche ein und werden nicht in Dashboard-Karten verwandelt.
4. Längere Bildszenen erhalten mindestens zwei geplante Bewegungsphasen.
5. Entwickle nur die vorgesehenen Animationsszenen.
6. Integriere Voiceover, Captions, Overlays und Übergänge.
7. Erzeuge reel-spezifische Befehle für Studio, Stills, Render und Validierung.
8. Führe Typecheck, Tests, Stills und den vollständigen MP4-Render aus.
9. Prüfe mindestens einen Frame pro Szene, alle Übergänge, Untertitelbereich, Cover, Synchronität und Videoende.

Nicht mergen, keine Feature-Flags aktivieren, keine produktive Composition ersetzen und den PR nicht auf Ready setzen.

Berichte getrennt:
- implementierte Dateien,
- tatsächlich ausgeführte Befehle,
- bestandene Tests,
- erkannte Medienpfade,
- Renderpfade und Dateigrößen,
- visuelle Prüfung pro Szene,
- verbleibende Probleme,
- Merge- und Produktionsstatus.
```

## Abnahme

Ein Reel ist erst fertig, wenn MP4, Bilder, Voiceover, Captions, Kontaktbogen, technische Prüfungen, visuelle Prüfung und Nutzerfreigabe vollständig vorhanden sind.
