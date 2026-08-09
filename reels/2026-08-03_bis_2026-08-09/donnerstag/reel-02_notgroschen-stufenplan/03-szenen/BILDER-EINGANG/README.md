# Bilder-Eingang

Lege hier alle fertigen Bilder gesammelt ab. Du musst sie nicht mehr selbst auf die Szenenordner verteilen.

## Benennung

- `Bild 00` = Cover
- `Bild 01` = Szene 01
- `Bild 02` = Szene 02
- `Bild 03` = Szene 03
- usw.

Akzeptierte Beispiele:

```text
Bild 00.png
bild01.jpg
image_02.webp
03.png
```

Danach:

```bash
npm run reel:sort-images -- reels/2026-08-03_bis_2026-08-09/donnerstag/reel-02_notgroschen-stufenplan --dry-run
npm run reel:sort-images -- reels/2026-08-03_bis_2026-08-09/donnerstag/reel-02_notgroschen-stufenplan
```

Das Skript liest `scene-index.json` und sortiert nur in echte Bildszenen. Es überschreibt niemals bestehende Bilder. Bei Doppelungen, falschen Nummern oder einer Remotion-Szene wird nichts verschoben.
