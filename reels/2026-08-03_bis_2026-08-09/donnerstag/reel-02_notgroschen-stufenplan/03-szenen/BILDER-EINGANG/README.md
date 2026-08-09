# Bilder-Eingang

Lege hier alle fertigen Bilder gesammelt ab. Du musst sie nicht selbst auf die Szenenordner verteilen.

## Verbindliche Nummerierung

Die Bildnummer ist immer die **echte chronologische Szenennummer** im Reel.

- `Bild 00` = Cover
- `Bild 01` = Szene 01
- `Bild 02` = Szene 02
- `Bild 03` = Szene 03
- usw. bis zur letzten Szene

**Animationsszenen werden nicht aus der Nummerierung entfernt.** Eine Remotion-Szene behält ihre Nummer, bekommt aber einfach keine Bilddatei.

Beispiel:

```text
Szene 01 = Bild      → Bild 01.png
Szene 02 = Animation → kein Bild 02
Szene 03 = Bild      → Bild 03.png
```

Falsch wäre in diesem Beispiel, Szene 03 als `Bild 02.png` zu benennen.

## Dieses Notgroschen-Reel

```text
Bild 00 → Cover
Bild 01 → Szene 01
Bild 02 → Szene 02
kein Bild 03 → Szene 03 ist Animation
Bild 04 → Szene 04
kein Bild 05 → Szene 05 ist Animation
Bild 06 → Szene 06
kein Bild 07 → Szene 07 ist Animation
kein Bild 08 → Szene 08 ist Animation
Bild 09 → Szene 09
Bild 10 → Szene 10
```

Akzeptierte Dateinamen sind zum Beispiel:

```text
Bild 00.png
bild01.jpg
image_04.webp
09.png
```

Die KI und das Sortierskript dürfen die Nummer niemals nach der Anzahl der vorhandenen Bilder neu durchzählen. Maßgeblich ist ausschließlich `03-szenen/scene-index.json`.

Danach:

```bash
npm run reel:sort-images -- reels/2026-08-03_bis_2026-08-09/donnerstag/reel-02_notgroschen-stufenplan --dry-run
npm run reel:sort-images -- reels/2026-08-03_bis_2026-08-09/donnerstag/reel-02_notgroschen-stufenplan
```

Das Skript sortiert nur in echte Bildszenen. Es überschreibt niemals bestehende Bilder. Bei Doppelungen, falschen Nummern oder einer Remotion-Szene wird gar nichts verschoben.
