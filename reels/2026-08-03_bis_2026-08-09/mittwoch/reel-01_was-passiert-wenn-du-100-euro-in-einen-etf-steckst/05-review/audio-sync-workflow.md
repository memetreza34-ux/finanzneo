# Automatische Audio-Synchronisierung

## Ziel

Die Originalaufnahme kann länger oder langsamer sein als beim ersten Szenenplan geschätzt. Deshalb werden die endgültigen Zeiten nicht mehr manuell geraten.

## Ablauf

1. Originalaufnahme aus `02-audio/` automatisch erkennen.
2. Originaldatei unverändert aufbewahren.
3. Mit FFmpeg `atempo=1.10` eine pitch-erhaltende Runtime-Datei erzeugen.
4. Runtime-Datei als 16-kHz-WAV für Whisper vorbereiten.
5. Lokal mit Whisper.cpp, Modell `small`, Sprache Deutsch transkribieren.
6. Echte Wort-Zeitstempel erzeugen.
7. Transkript mit dem freigegebenen Szenenskript abgleichen.
8. Szenengrenzen aus den tatsächlich gesprochenen Abschnitten berechnen.
9. Composition, Captions und Codex-Paket automatisch aktualisieren.

## Verbindlicher Befehl

Aus `alles/`:

```bash
npm run finance:codex-reel:captions -- \
../reels/2026-08-03_bis_2026-08-09/mittwoch/reel-01_was-passiert-wenn-du-100-euro-in-einen-etf-steckst
```

Alternativ trägt derselbe Prozess den eindeutigen Namen:

```bash
npm run finance:codex-reel:sync-audio -- \
../reels/2026-08-03_bis_2026-08-09/mittwoch/reel-01_was-passiert-wenn-du-100-euro-in-einen-etf-steckst
```

## Erwartetes Ergebnis

Aus 72,42 Sekunden Originalaudio werden bei 1,10× ungefähr 65,84 Sekunden. Die exakt gemessene Runtime-Dauer und die endgültigen Szenenzeiten werden erst beim lokalen Lauf festgelegt.

## Sicherheitsgrenzen

- keine Wörter entfernen
- Tonhöhe erhalten
- Original nicht überschreiben
- bei mehreren Audioquellen stoppen
- bei geringer Transkript-Übereinstimmung stoppen
- echte Zeitstempel nicht durch Schätzwerte ersetzen
- visuelle Synchronitätsprüfung nach dem Render bleibt Pflicht
