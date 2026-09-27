# Warum du trotz Gehaltserhöhung nicht mehr Geld hast — Variante B

YouTube-Longform-Test für **Variante B / hybrid**.

## Produktionsziel

Das Video übernimmt unverändert die freigegebene Bildwelt aus `youtube/warum-dein-geld-verschwindet-images-only`. Neu ist gezielte Remotion-Motion nur dort, wo zeitliche Veränderung, Geldfluss, Vergleich oder Aufteilung klarer wird.

## Format

- ca. 2:20–2:40
- 1920 × 1080, 30 fps
- Variante B / `hybrid`
- 18 Szenen
- 6 Flow-Storybilder
- 12 Remotion-Erklär-/Datenszenen
- 4 Szenen mit Menschen
- Layout: `finanzneo-youtube-framed-scene-v2`
- Cover-Text direkt im finalen Thumbnail: `MEHR GEHALT, TROTZDEM KNAPP?`

## Verbesserungen

- deutlich weniger Menschen und keine wiederholte `Mensch + Fragezeichen`-Schablone
- starke 3D-Storybilder bleiben statisch
- Motion nur bei echtem Erklärwert
- reine Remotion-/Datenszenen dürfen die komplette 1920×1080-Fläche nutzen
- kritische Motion-Inhalte bleiben mindestens 64 px vom Rand entfernt
- kein unbeabsichtigtes Clipping/Cropping
- Flow-Bilder selbst bleiben contained und nie fullscreen
- Thumbnail wird direkt mit exakter sichtbarer Headline erzeugt; Fehler in der Schrift bedeuten Regeneration desselben Thumbnails

## Audio

Der gemeinsame FinanzNeo-Audiovertrag bleibt verbindlich: verarbeitetes Voiceover ca. 1,10×, unnötig lange Pausen kürzen, danach Wort-Timings und Timeline aus genau dieser verarbeiteten Datei ableiten.

## Phase-1-Status

Phase 1 ist technisch abgeschlossen: System-CI, Motion-Validation, 16:9-Motion-Lab, Full-Frame-/Safe-Area-Regeln und alle 12 Motion-Szenen sind erfolgreich geprüft. Der deterministische `animation-seal.json` ist im Projekt committed und schützt den freigegebenen Motion-Stand.

## Nächster Produktionsschritt

Jetzt werden keine weiteren allgemeinen Systemänderungen benötigt. Für den eigentlichen Video-Bau fehlen nur noch die echten Produktionsassets:

- Thumbnail + 6 geplante Flow-Bilder nach `04-visuals/alle-bildprompts.txt`
- finales Voiceover
- Verarbeitung nach FinanzNeo-Audiovertrag
- echte Wort-Timings aus dem verarbeiteten Voiceover

Danach folgen `npm run youtube:ready`, finale Montage, Render und QA.
