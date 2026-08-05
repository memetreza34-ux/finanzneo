# Laufzeitentscheidung

## Entscheidung

Das vorhandene Voiceover wird vollständig und unverändert verwendet.

- gemessene Audiodauer: **72,42 Sekunden**
- frühere Planung: 51,50 Sekunden
- neue Reel-Dauer: **72,42 Sekunden**
- Remotion-Composition: **2.173 Frames bei 30 FPS**

## Nicht erlaubt

- Voiceover beschleunigen
- Voiceover kürzen
- Voiceover zeitlich strecken
- Satzteile entfernen

## Neue Szenenzeiten

| Szene | Start | Ende | Dauer |
|---|---:|---:|---:|
| 1 | 0,00 s | 7,73 s | 7,73 s |
| 2 | 7,73 s | 18,97 s | 11,24 s |
| 3 | 18,97 s | 29,50 s | 10,53 s |
| 4 | 29,50 s | 40,03 s | 10,53 s |
| 5 | 40,03 s | 52,03 s | 12,00 s |
| 6 | 52,03 s | 61,90 s | 9,87 s |
| 7 | 61,90 s | 72,42 s | 10,52 s |

## Umsetzung

- `timeline/codex-reel-package.json` aktualisiert
- `timeline/storyboard.md` aktualisiert
- `timeline/motion-design.md` aktualisiert
- Validator auf 25–90 Sekunden erweitert
- Regressionstest für 72,42 Sekunden ergänzt
- Captions müssen aus der realen Audiodauer neu erzeugt und anschließend visuell geprüft werden
