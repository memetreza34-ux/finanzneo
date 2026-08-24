# Globaler FinanzNeo Image-World-Lock

## Kanonischer Stand

Das Reel-System V4 behält seine bestehenden Basis-Locks:

- `FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3`
- `FINANZNEO_SERIES_LOCK: finanzneo-same-world-v1`
- `STYLIZED_3D_LOCK: finanzneo-stylized-3d-editorial-v5`

Zusätzlich gilt für **neue Reels** verbindlich:

- `PHYSICAL_EXPLAINER_LOCK: finanzneo-physical-explainer-editorial-v7`

Die maschinenlesbare Quelle ist `config/finanzneo-image-world-lock.json`.
Die ausgeschriebene Bildwelt steht in
`config/finanzneo-image-worlds/finanzneo-physical-explainer-editorial-v7.txt`.

## Bewusste Konfliktentscheidung gegenüber dem separaten V24-Zweig

Der frühere V24-Zweig verlangte für Cover Bild 00 `9:16`, während das
Reel-System V4 alle Google-Flow-Quellbilder als `1:1` behandelt. Für den
kanonischen V4-Stand wurde bewusst **1:1 für Cover und Szenenbilder** gewählt:

- Flow erzeugt ausschließlich 1:1
- Remotion erzeugt das finale 9:16-Reel
- dadurch existiert nur ein Quellbildvertrag

## Physical-Explainer-Regel

Jedes neue Bild zeigt:

1. ein großes physisches Hero-Objekt
2. 3–6 konkrete, themenspezifische Alltagsobjekte
3. natürliche asymmetrische Anordnung und Kontakt-Schatten
4. physische Tags/Schilder statt schwebender UI-Chips
5. einen einzigen nahtlosen charcoal-green-black Hintergrund

Verboten sind unter anderem UI-Dashboards, Microchip-/Circuit-Board-Look,
Gameboards, Orbit-Module, Vier-Ecken-Kachel-Layouts, abstrakte Liniennetze,
kleine Dioramen, Monolithen und sterile Produktwerbung.

## Prüfung

```bash
npm run validate:image-world
```

Der Check ist Bestandteil von `npm run validate` und blockiert Drift zwischen
Lock-Datei, World-Definition und Reel-Scaffold.
