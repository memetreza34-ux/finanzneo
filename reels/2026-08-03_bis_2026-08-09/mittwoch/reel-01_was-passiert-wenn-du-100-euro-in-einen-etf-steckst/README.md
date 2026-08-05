# Was passiert, wenn du 100 Euro in einen ETF steckst?

Dieses Reel verwendet eine einfache, dateinamenunabhängige Medienablage.

## Reihenfolge

1. Cover in `00-cover`
2. Skript und Voiceover-Anweisung in `01-voice-script`
3. fertige Audioaufnahme in `02-audio`
4. Bildprompts, Szenenbeschreibungen und Bilder in `03-szenen/EINZELNE-SZENEN`
5. Caption in `04-caption`
6. Prüfung und Quellen in `05-review`
7. fertiges Video in `06-video`
8. technische Renderdateien in `render` und `timeline`

## Audio

Lege genau eine Audio- oder Mediendatei in diesen Ordner:

```text
02-audio/
```

Der Dateiname ist egal. Auch eine Datei wie `F 1.mp4` wird erkannt, sofern sie eine Audiospur besitzt. Sind mehrere passende Dateien vorhanden, stoppt die Prüfung zur Sicherheit.

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

## Verbindliche Laufzeit

Die erkannte KI-Stimme läuft **72,42 Sekunden**. Diese Audiodauer ist jetzt die zeitliche Quelle der Wahrheit.

- Audio wird nicht beschleunigt
- Audio wird nicht gekürzt
- Audio wird nicht zeitlich gestreckt
- Composition: 2.173 Frames bei 30 FPS
- Szenenplan: insgesamt 72,42 Sekunden

Neue Szenenlängen:

| Szene | Dauer |
|---|---:|
| 1 | 7,73 s |
| 2 | 11,24 s |
| 3 | 10,53 s |
| 4 | 10,53 s |
| 5 | 12,00 s |
| 6 | 9,87 s |
| 7 | 10,52 s |

Längere Bildszenen verwenden mindestens zwei kontrollierte Bewegungsphasen, damit kein Bild rund zehn Sekunden statisch stehen bleibt.

## Aktueller Stand

- Skript freigegeben
- fünf Bildprompts fertig
- zwei Remotion-Animationen geplant
- lokale Bilder und Audio werden automatisch erkannt
- Reel-Paket, Storyboard und Motion-Plan auf 72,42 Sekunden aktualisiert
- Remotion-Code und finales Video sind noch nicht gebaut oder geprüft
