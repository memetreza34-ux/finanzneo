# FinanzNeo Unified Image World

## Authority

Diese Regel vereinheitlicht die visuelle KI-Bildwelt von FinanzNeo über Reels und YouTube. `CLAUDE.md` bleibt die höchste Repo-Autorität.

## One brand, one image world

Reels und YouTube verwenden dieselbe Core-Bildwelt:

- `FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3`
- `FINANZNEO_SERIES_LOCK: finanzneo-same-world-v1`
- `PREMIUM_VISUAL_WORLD_LOCK: finanzneo-stylized-3d-animated-black-v9`

Es darf keine separate YouTube-Art-Direction wie `finanzneo-youtube-grounded-3d-black-v1` als eigenständige Bildwelt eingeführt werden.

## What stays identical

Über alle Formate gleich halten:

- premium real-world-grounded stylized 3D
- klar stylized, niemals fotorealistisch
- glaubwürdige Objektproportionen und erkennbare Konstruktion
- deep seamless black als dominante Welt
- reale Alltagssituation / sichtbare Ursache-Wirkung vor abstrakter Metapher
- Emerald Green für positive/geschützte Reserve
- Warm Red-Orange für Kosten/Risiko/Verlust
- Warm Ivory / Soft Gray für neutrale Materialien
- dezentes Gold nur für Geld/Wert
- weiches Studio-Licht, lesbare Kontakt-Schatten, klare Separation
- keine generischen Finance-Icon-Kompositionen, Dashboards, App-UIs, Flowcharts oder Mini-Dioramen
- keine blau/lila Cyberpunk-Neonblöcke oder Sci-Fi-Dekoration

## What may differ by format

Nur Canvas und Komposition werden angepasst:

- Reels: bestehendes Reel-Quellformat gemäß Reel-Vertrag
- YouTube: horizontal 16:9

YouTube darf den breiteren Raum für mehr nützlichen realen Kontext, Tiefe oder Remotion-Negativraum verwenden. Das ist **keine** Erlaubnis für eine andere Material-, Farb-, Licht- oder Stilwelt.

## Prompt rule

Jeder neue FinanzNeo-YouTube-Bildprompt muss explizit auf `finanzneo-stylized-3d-animated-black-v9` gelockt sein oder über eine Projekt-Bildweltdatei eindeutig diesen Lock erben.

Wenn ein generiertes Bild wie Stockfoto, Photorealismus, Cyberpunk, andere Markenwelt oder generische Finance-UI wirkt, ist es ein QA-Fail und muss im selben Bildslot regeneriert werden.
