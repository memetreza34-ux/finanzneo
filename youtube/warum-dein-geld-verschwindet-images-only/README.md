# Warum dein Geld am Monatsende immer weg ist

PRODUCTION_MODE: images-only
TARGET_DURATION: ca. 2:30
FORMAT: YouTube Longform 16:9
VISUAL_COUNT: 20

Dieses Testvideo verwendet ausschließlich statische Google-Flow-Bilder als Visualquelle. Keine Remotion-Erklärgrafiken, keine Charts, keine Icons, keine eingeblendeten Überschriften und keine Animationen.

Regeln:
- 1 Bild = 1 dominanter Gedanke.
- Normalerweise 1–2 kurze Voiceover-Sätze pro Bild.
- Alle Bilder in `finanzneo-youtube-grounded-3d-black-v1`.
- Jedes Bild braucht eine kleine sichtbare Geschichte oder räumliche Beziehung.
- Kein permanentes Tisch-/Katalog-Layout.
- Kein permanentes Floating-Template.
- Nur kurze physische deutsche Objektlabels, wenn ein wichtiges Objekt sonst missverständlich wäre.
- Keine kritischen Beträge oder Prozente im Bild.
- Die 20 Bilder werden später nur als statische Bildfolge mit Voiceover geschnitten.

Produktionsreihenfolge:
1. `02-script/script-fliess-text.txt` als Voiceover aufnehmen.
2. `04-visuals/alle-bildprompts.txt` komplett an Google Flow geben.
3. Flow erzeugt Bild 01 bis Bild 20 strikt nacheinander und benennt jedes Bild sofort um.
4. Alle Bilder nach `04-visuals/00-ALLE-BILDER-HIER-REIN/` legen.
5. Bilder nach dem finalen Voiceover schneiden; keine Remotion-Visuals ergänzen.