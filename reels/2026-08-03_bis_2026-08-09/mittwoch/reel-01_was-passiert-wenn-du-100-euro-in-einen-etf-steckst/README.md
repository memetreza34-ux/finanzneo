# Was passiert, wenn du 100 Euro in einen ETF steckst?

Dieses Reel ist kreativ geplant und technisch vorprogrammiert. Codex soll keine Animation mehr entwerfen oder neu schreiben.

## Was bereits fertig programmiert ist

- vollständige Remotion-Composition
- fünf bildgeführte Szenen mit zweiphasigen Kamerabewegungen
- Szene 2: Kauforder läuft vom Broker zum Handelsplatz und wird gematcht
- Szene 5: Wertpapierkorb wird im Primärmarkt gegen neue ETF-Anteile getauscht
- globale Überschriften und Caption-Safe-Zone
- 1,10×-Audioverarbeitung mit erhaltener Tonhöhe
- lokale Whisper.cpp-Transkription
- automatische Szenengrenzen aus echten Wort-Zeitstempeln
- automatische Bilderkennung nach `scene-XX`-Ordner
- Cover-, MP4-, Kontaktbogen- und QA-Erzeugung

Der vorprogrammierte Code liegt unter:

```text
alles/channels/finanzneo/src/reels/2026-08-05-etf-kauf-100-euro/
```

## Deine Medien

### Audio

Lege genau eine Audio- oder Mediendatei in:

```text
02-audio/
```

Der Dateiname ist egal. Auch `F 1.mp4` wird erkannt, sofern eine Audiospur vorhanden ist.

### Bilder

Lege bei jeder Bildszene genau eine Bilddatei direkt in den passenden Ordner:

```text
03-szenen/EINZELNE-SZENEN/scene-01/<beliebiger-name>.jpeg
03-szenen/EINZELNE-SZENEN/scene-03/<beliebiger-name>.png
03-szenen/EINZELNE-SZENEN/scene-04/<beliebiger-name>.webp
03-szenen/EINZELNE-SZENEN/scene-06/<beliebiger-name>.jpg
03-szenen/EINZELNE-SZENEN/scene-07/<beliebiger-name>.png
```

Der Ordner bestimmt die Szene. Der Dateiname ist egal. Pro erwarteter Bildszene darf genau eine unterstützte Bilddatei vorhanden sein.

## Einziger normaler Build-Befehl

Aus `alles/`:

```bash
npm run finance:etf-reel:build -- \
../reels/2026-08-03_bis_2026-08-09/mittwoch/reel-01_was-passiert-wenn-du-100-euro-in-einen-etf-steckst
```

Dieser Befehl führt automatisch aus:

1. prüfen, dass beide Animationen bereits programmiert sind,
2. Stimme pitch-erhaltend auf 1,10× verarbeiten,
3. Audio lokal auf Deutsch transkribieren,
4. echte Wort-Zeitstempel und Szenengrenzen erzeugen,
5. Bilder automatisch erkennen und für Remotion bereitstellen,
6. Regressionstest und TypeScript-Prüfung ausführen,
7. das vollständige Reel rendern,
8. Cover erstellen,
9. technische Video- und Audio-QA ausführen,
10. Kontaktbogen und Build-Bericht erzeugen.

## Automatische Ausgaben

```text
06-video/final-reel.mp4
00-cover/cover.png
05-review/contact-sheet.png
05-review/codex-render-qa.json
05-review/build-report.json
```

## Zeitregeln

Die ursprünglich geplanten Szenenzeiten sind nur Startwerte. Nach der Transkription gilt:

```text
timeline/scene-timing.json
```

Die Animations- und Bildbewegungsphasen skalieren automatisch zur endgültigen Szenendauer. Codex muss keine Frames neu planen.

## Aktueller Stand

- Skript freigegeben
- fünf Bildprompts fertig
- beide Remotion-Animationen programmiert
- vollständige Reel-Composition programmiert
- automatischer Gesamtbuilder programmiert
- lokale Transkription, TypeScript-Prüfung, Tests und Render noch nicht ausgeführt
- manuelle visuelle Freigabe weiterhin erforderlich
