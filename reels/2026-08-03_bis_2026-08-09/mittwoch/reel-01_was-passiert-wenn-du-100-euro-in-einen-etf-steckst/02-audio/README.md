# Audio hier ablegen

Lege genau **eine** Voiceover-Datei in diesen Ordner.

Der Dateiname ist egal. Beispiele wie `F 1.mp4`, `aufnahme.m4a` oder `voice.wav` werden automatisch erkannt.

Unterstützte Formate:

- WAV
- MP3
- M4A
- AAC
- FLAC
- OGG / OPUS
- MP4 / MOV / M4V / WEBM mit Audiospur

Bei mehreren passenden Dateien stoppt die Prüfung, damit Codex nicht die falsche Aufnahme verwendet.

## Was danach automatisch passiert

Die Originaldatei wird nicht verändert oder umbenannt.

Der Synchronisierungsbefehl:

```bash
npm run finance:codex-reel:captions -- <projektordner>
```

führt aus:

1. Stimme mit erhaltener Tonhöhe auf **1,10×** beschleunigen,
2. Runtime-Audio unter `render/audio/voiceover-runtime-1-10x.wav` speichern,
3. lokal auf Deutsch mit Whisper.cpp transkribieren,
4. echte Wort-Zeitstempel erzeugen,
5. Szenenzeiten an den gesprochenen Abschnitten ausrichten.

Das fertige Reel verwendet die erzeugte Runtime-Datei. Das Original bleibt als unveränderte Quelle in diesem Ordner.
