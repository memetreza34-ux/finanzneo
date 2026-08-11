# Technische Hinweise

## Format
- 1080 × 1920
- 30 fps
- Ziel: ca. 60–70 Sekunden, endgültige Dauer folgt finalem Voiceover

## Mediengrenze
Finale Bilder ausschließlich aus `03-szenen/00-ALLE-BILDER-HIER-REIN/`.
Finales Voiceover ausschließlich aus `02-audio/`.
Fehlende/falsche/mehrdeutige Pflichtmedien → BLOCKED. Keine Ersatzmedien.

## Bildszenen
- full-frame-no-crop
- komplettes vertikales 9:16-Nutzerbild über Y=0–1920
- kein VisualStage/Mittelcontainer um Nutzerbilder
- kein absichtlicher Crop/Zoom/Focal-Point-Vertrag
- keine unscharfe Bildkopie
- Headline + Untertitel als Overlay
- nur kontinuierlicher transparenter Lesbarkeits-Scrim
- keine harten Header-/Footer-Hintergründe

## Native Remotion-Szenen
- ein durchgehender Full-Canvas-Hintergrund
- kein Boden
- kein Horizont
- kein Studio-Split
- Animationsinhalt ungefähr Y 220–1490

## Untertitel
- genau 1 vollständiger Satz gleichzeitig
- niemals 2 Sätze gleichzeitig
- hart maximal 2 Zeilen
- echte Wort-start/end-Zeitstempel aus dem finalen Audio
- aktives Wort grün, Rest weiß
- keine schwarze/undurchsichtige Caption-Karte
- Caption ungefähr Bottom 300, Left 64, Right 156

## Publishing
Genau eine `04-caption/caption.txt`, unverändert für Instagram Reels, TikTok, Facebook Reels und Snapchat, mit exakt 5 relevanten Hashtags.

Keine YouTube Shorts.

## Finaler Lauf
`npm run reel:validate -- reels/2026-08-10_bis_2026-08-16/dienstag/reel-01_zinseszins-zeit --final`

Finalmodus erst möglich, wenn alle Pflichtbilder, genau ein finales Audio und echte `final-audio-aligned` Wortzeiten vorhanden sind.
