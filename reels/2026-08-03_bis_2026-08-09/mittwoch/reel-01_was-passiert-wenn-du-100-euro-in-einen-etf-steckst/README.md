# Was passiert, wenn du 100 Euro in einen ETF steckst?

Dieses Reel verwendet eine einfache, dateinamenunabhängige Medienablage und eine transkriptbasierte Synchronisierung.

## Reihenfolge

1. Cover in `00-cover`
2. Skript und Voiceover-Anweisung in `01-voice-script`
3. Originalaufnahme in `02-audio`
4. Bildprompts, Szenenbeschreibungen und Bilder in `03-szenen/EINZELNE-SZENEN`
5. Captions und Transkript in `04-caption`
6. Prüfung und Quellen in `05-review`
7. fertiges Video in `06-video`
8. technische Renderdateien und Timingdaten in `render` und `timeline`

## Audio

Lege genau eine Audio- oder Mediendatei in diesen Ordner:

```text
02-audio/
```

Der Dateiname ist egal. Auch eine Datei wie `F 1.mp4` wird erkannt, sofern sie eine Audiospur besitzt. Sind mehrere passende Dateien vorhanden, stoppt die Prüfung zur Sicherheit.

Die Originalaufnahme bleibt unverändert. Vor dem Build wird automatisch:

1. eine pitch-erhaltende 1,10×-Version erzeugt,
2. die verarbeitete Stimme lokal mit Whisper.cpp auf Deutsch transkribiert,
3. echte Wort-Zeitstempel erzeugt,
4. jede Szene an den tatsächlich gesprochenen Abschnitt angepasst.

Aus `alles/` ausführen:

```bash
npm run finance:codex-reel:captions -- \
../reels/2026-08-03_bis_2026-08-09/mittwoch/reel-01_was-passiert-wenn-du-100-euro-in-einen-etf-steckst
```

Danach entstehen unter anderem:

```text
render/audio/voiceover-runtime-1-10x.wav
04-caption/voiceover-final.captions.json
04-caption/voiceover-transcript.json
timeline/scene-timing.json
timeline/transcript-timing.md
```

Geplante und endgültige Szenenzeiten müssen nicht identisch sein. Nach der Verarbeitung ist `timeline/scene-timing.json` verbindlich.

## Bilder

Jede Bildszene erhält genau eine Bilddatei direkt im passenden Szenenordner:

```text
03-szenen/EINZELNE-SZENEN/scene-01/<beliebiger-name>.jpeg
03-szenen/EINZELNE-SZENEN/scene-03/<beliebiger-name>.png
03-szenen/EINZELNE-SZENEN/scene-04/<beliebiger-name>.webp
03-szenen/EINZELNE-SZENEN/scene-06/<beliebiger-name>.jpg
03-szenen/EINZELNE-SZENEN/scene-07/<beliebiger-name>.png
```

Der Ordner bestimmt die Szene. Der Name der Bilddatei ist egal. In einem Bildszenenordner darf nur eine unterstützte Bilddatei liegen.

Unterstützte Bildformate: PNG, JPG, JPEG, WEBP und AVIF.

## Aktueller Stand

- Skript freigegeben
- fünf Bildprompts fertig
- zwei Remotion-Animationen geplant
- automatische Bild- und Audioerkennung umgesetzt
- 1,10×-Audio- und Whisper-Synchronisierung im Repository programmiert
- lokale Transkription, Tests, Remotion-Code und finales Video noch nicht ausgeführt beziehungsweise erstellt
