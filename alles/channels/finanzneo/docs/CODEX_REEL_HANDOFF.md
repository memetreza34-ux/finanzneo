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
- Szenenreihenfolge und vorläufige Szenenlängen,
- `image` oder `animation` pro Szene,
- vollständiger Bildprompt für jede Bildszene,
- genaue Remotion-Beschreibung für jede Animationsszene,
- Overlays, Übergänge und optionale Sound-Cues,
- Quellen und geprüfte Finanzrechnungen.

Maschinenlesbares Paket:

```text
<projekt>/timeline/codex-reel-package.json
```

Die geplanten Szenenzeiten sind noch nicht die endgültigen Renderzeiten.

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

## Phase C – Audio synchronisieren und transkribieren

Vor dem eigentlichen Build aus `alles/` ausführen:

```bash
npm run finance:codex-reel:captions -- <projekt>
```

Der Befehl führt die vollständige Audio- und Timing-Pipeline aus:

1. einzige Originalaufnahme in `02-audio/` erkennen,
2. Originaldatei unverändert lassen,
3. mit FFmpeg `atempo=1.10` eine pitch-erhaltende 1,10×-Version erzeugen,
4. eine 16-kHz-WAV-Datei für Whisper erstellen,
5. lokal mit Whisper.cpp auf Deutsch transkribieren,
6. echte Wort-Zeitstempel erzeugen,
7. das Transkript mit den freigegebenen `voiceText`-Blöcken abgleichen,
8. Szenengrenzen an den tatsächlich gesprochenen Abschnitten setzen,
9. Composition-Dauer und Szenendauern aktualisieren.

Erzeugte Dateien:

```text
<projekt>/render/audio/voiceover-runtime-1-10x.wav
<projekt>/04-caption/voiceover-final.captions.json
<projekt>/04-caption/voiceover-transcript.json
<projekt>/timeline/scene-timing.json
<projekt>/timeline/transcript-timing.md
<projekt>/05-review/audio-sync-report.json
```

### Zeitregeln

- Die Originalaufnahme und die 1,10×-Runtime-Datei dürfen unterschiedliche Dauern haben.
- Geplante und endgültige Szenenzeiten dürfen unterschiedlich sein.
- Die Szenenreihenfolge und die freigegebenen Aussagen bleiben unverändert.
- Nach der Transkription ist `timeline/scene-timing.json` die zeitliche Quelle der Wahrheit.
- Im Render wird die erzeugte Runtime-Datei verwendet, nicht die langsame Originalaufnahme.
- Echte Whisper-Zeitstempel ersetzen rechnerisch verteilte Untertitel.
- Bei zu geringer Übereinstimmung zwischen Transkript und freigegebenem Skript stoppt die Pipeline.

Anschließend prüfen:

```bash
npm run finance:codex-reel:check-ready -- <projekt>
```

Die Prüfung verlangt danach Runtime-Audio, Transkript, Captions und echte Szenengrenzen.

## Phase D – Codex baut das Reel

Codex übernimmt:

1. Projekt- und Assetprüfung.
2. Übernahme der automatisch erkannten Medienpfade.
3. Übernahme der transkriptbasierten Szenenzeiten.
4. Reel-spezifische Remotion-Composition.
5. Einbindung aller Bilder.
6. Bildfahrten und Zooms relativ zur finalen Szenendauer.
7. Umsetzung der beschriebenen narrativen Animationen.
8. Einbindung des 1,10×-Runtime-Voiceovers.
9. Einbindung der echten Wort-Captions.
10. Overlays, Cover, Übergänge und freigegebene Sound-Cues.
11. TypeScript, Tests, Stills, MP4-Render und visuelle Prüfung.

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
npm run finance:codex-reel:captions -- <PROJEKTORDNER>
npm run finance:codex-reel:check-ready -- <PROJEKTORDNER>

Verwende exakt die automatisch erkannten Bildpfade, die erzeugte 1,10×-Runtime-Audiodatei und die transkriptbasierten Szenenzeiten.

Regeln:
- Genau eine unterstützte Datei in 02-audio; Dateiname egal.
- Genau eine unterstützte Bilddatei pro erwarteter Bildszene; Dateiname egal.
- Der scene-XX-Ordner bestimmt die Szenennummer.
- Das Original-Audio bleibt unverändert.
- Das Runtime-Audio wird pitch-erhaltend auf 1,10× erzeugt.
- timeline/scene-timing.json bestimmt die Szenengrenzen.
- Keine geschätzten Caption-Zeiten verwenden, wenn Whisper-Zeitstempel existieren.
- Bei null oder mehreren Medien oder zu geringer Transkript-Abdeckung stoppen.

Wenn die Prüfung erfolgreich ist:
1. Erstelle eine isolierte reel-spezifische Remotion-Composition.
2. Übernimm Skript, Reihenfolge, Cover, erkannte Bilder und Animationsbeschreibungen unverändert.
3. Bildszenen nehmen die Hauptfläche ein und werden nicht in Dashboard-Karten verwandelt.
4. Bild- und Animationsphasen relativ zur endgültigen Szenendauer skalieren.
5. Integriere Runtime-Voiceover, echte Captions, Overlays und Übergänge.
6. Erzeuge reel-spezifische Befehle für Studio, Stills, Render und Validierung.
7. Führe Regressionstest, Typecheck, Tests, Stills und vollständigen MP4-Render aus.
8. Prüfe mindestens einen Frame pro Szene, alle Übergänge, Untertitelbereich, Cover, Audio-Synchronität und Videoende.

Nicht mergen, keine Feature-Flags aktivieren, keine produktive Composition ersetzen und den PR nicht auf Ready setzen.

Berichte getrennt:
- implementierte Dateien,
- tatsächlich ausgeführte Befehle,
- bestandene Tests,
- erkannte Medienpfade,
- Original- und Runtime-Audiodauer,
- Transkript-Abdeckung,
- endgültige Szenenzeiten,
- Renderpfade und Dateigrößen,
- visuelle Prüfung pro Szene,
- verbleibende Probleme,
- Merge- und Produktionsstatus.
```

## Abnahme

Ein Reel ist erst fertig, wenn Runtime-Audio, Transkript, echte Captions, endgültige Szenenzeiten, MP4, Kontaktbogen, technische Prüfungen, visuelle Synchronitätsprüfung und Nutzerfreigabe vollständig vorhanden sind.
