# Warum dein Geld am Monatsende immer weg ist

PRODUCTION_MODE: images-only
TARGET_DURATION: ca. 2:30
FORMAT: YouTube Longform 16:9
VISUAL_COUNT: 20
LAYOUT_CONTRACT: finanzneo-youtube-framed-scene-v1

Dieses Testvideo verwendet ausschließlich statische Flow-Visuals als Hauptbilder. **Images-only bedeutet hier nur: keine Animation.** Das normale FinanzNeo-YouTube-Layout bleibt vollständig erhalten.

Jede fertige Szene enthält:
- eine kurze Überschrift im oberen Bereich,
- direkt daneben ein passendes Icon,
- darunter bzw. daneben das statische 3D-Flow-Visual in einem klar begrenzten Bildfenster,
- sichtbare deep-black FinanzNeo-Grundfläche um das Visual herum.

WICHTIG: Das Flow-Bild darf **niemals fullscreen** als kompletter 16:9-Hintergrund verwendet werden.

Regeln:
- 1 Szene = 1 dominanter Gedanke.
- Normalerweise 1–2 kurze Voiceover-Sätze pro Szene.
- Alle Flow-Bilder in `finanzneo-youtube-grounded-3d-black-v1`.
- Jedes Bild braucht eine kleine sichtbare Geschichte oder räumliche Beziehung.
- Kein permanentes Tisch-/Katalog-Layout.
- Kein permanentes Floating-Template.
- Nur kurze physische deutsche Objektlabels, wenn ein wichtiges Objekt sonst missverständlich wäre.
- Keine kritischen Beträge oder Prozente in das Flow-Bild einbrennen.
- Überschrift und Icon gehören zur statischen Video-Szene und werden außerhalb des Flow-Bildes gesetzt.
- Keine Bewegung, keine animierten Icons, keine animierten Titel, keine Kameraanimation und keine Erkläranimation.
- Der finale Videoschnitt darf normale statische Cuts zwischen den fertigen Szenen verwenden.

Produktionsreihenfolge:
1. `02-script/script-fliess-text.txt` als Voiceover aufnehmen.
2. `04-visuals/alle-bildprompts.txt` komplett an Google Flow geben.
3. Flow erzeugt Bild 01 bis Bild 20 strikt nacheinander und benennt jedes Bild sofort um.
4. Alle Bilder nach `04-visuals/00-ALLE-BILDER-HIER-REIN/` legen.
5. Für jede Szene Überschrift + passendes Icon + eingebettetes Flow-Bild nach `06-projektdateien/layout-contract.json` statisch zusammensetzen.
6. Diese fertigen statischen Szenen passend zum finalen Voiceover schneiden; keine Animation ergänzen.
