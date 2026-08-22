# FinanzNeo — verbindliches Bildsystem

Dieses Dokument definiert das Bildsystem für neue FinanzNeo-Reels. Bei Widerspruch gilt `CLAUDE.md`.

Verbindliche IDs:
- World ID: `finanzneo-connected-studio-v3`
- Series Lock ID: `finanzneo-same-world-v1`
- Physical Explainer Lock: `finanzneo-physical-explainer-v4`
- Stylized 3D Lock: `finanzneo-stylized-3d-editorial-v5`
- Google-Flow-Quellbildformat: immer `1:1`
- Visual Timing & Clarity Standard: `docs/FINANZNEO-VISUAL-TIMING-AND-CLARITY-STANDARD.md`

## Ziel
Jedes Bild erklärt genau eine Aussage sofort und alltagsnah.

## Höchste Stilregel
FinanzNeo-Bilder sind **premium stylized 3D CGI financial editorial explainers**.

`physical` bedeutet: erkennbare Alltagsgegenstände als bewusst gestaltete 3D-Props.
`physical` bedeutet ausdrücklich NICHT: fotorealistische Papier-, Büro- oder Produktfotografie.

### Verbindliche 3D-Merkmale
Jeder einzelne Bildprompt muss diese Merkmale selbst ausschreiben:
- clearly stylized premium 3D CGI render
- substantial volumetric objects with obvious depth
- simplified, slightly exaggerated proportions
- smooth rounded geometry and soft bevels
- thick cream-colored card/paper-like 3D surfaces instead of thin realistic paper
- dark charcoal/emerald premium plastic and brushed-metal details
- restrained transparent glass where useful
- chunky stylized gold value coins
- cinematic soft key light
- controlled emerald rim light
- soft but visible contact shadows
- foreground / midground / background separation
- mild depth-of-field allowed
- polished editorial render quality

### Hart verboten
Sofort neu erzeugen bei:
- photorealistic office photo
- realistic stationery photography
- stock-photo look
- thin flat realistic paper dominating the composition
- dashboard or app UI
- central screen / tablet / board
- floating cards, tiles, chips, badges, widgets
- control panel
- gameboard / board-game layout
- microchip/circuit-board look
- orbit/ring of modules
- repeated rectangular modules as the main structure
- mechanical gate / conveyor
- tiny isometric diorama
- sterile product-ad pedestal
- Pixar / clay / toy look

## Komposition
- EIN klares 3D-Hauptobjekt
- 2–5 unterstützende 3D-Alltagsobjekte
- natürliche Asymmetrie
- leichte Überlappung
- klare Tiefenstaffelung
- sichtbare Größenkontraste
- jedes Objekt muss die Aussage unterstützen
- Hauptaussage in unter 2 Sekunden erkennbar

## Gute direkte Alltagsmetaphern
- chunky stylized 3D desk calendar
- thick 3D receipt ribbon
- stylized contract folder
- 3D price tag
- 3D wallet
- oversized magnifying glass
- stylized gold-value coins
- headphones
- smartphone with dark/off screen
- SIM card
- membership tag
- shopping / household object

## Keine Bildreferenz-Abhängigkeit
Kein vorheriges Bild muss hochgeladen oder als Image-to-Image-Referenz verwendet werden.
Die Einheitlichkeit entsteht dadurch, dass **jeder einzelne Szenenprompt denselben vollständigen Style-Lock wiederholt**.

Vermeide Formulierungen wie:
- `same as Bild 00`
- `use previous image as reference`
- `copy the approved cover style`

Stattdessen enthält jeder Prompt selbst:
- 3D-Renderstil
- Geometrie
- Materialien
- Farbrollen
- Licht
- Hintergrund
- Perspektive
- Negativregeln

## Hintergrund
```text
Use ONE single seamless continuous deep charcoal green-black background across the entire square 1:1 image.
No floor-wall boundary, no horizon line, no panels, no bands, no sections.
Use a subtle continuous gradient/vignette only.
Objects cast soft contact shadows while the background remains uninterrupted.
```

## Farbrollen
- Deep charcoal green-black = Grundwelt
- Emerald/Mint = Akzent, Rim Light, positive Struktur
- Gold = nur Geld/Wert
- Warm red-orange = nur Warnung, unerwünschte Kosten, Schulden/Druck
- Warm cream/off-white = Papier-/Kartenflächen für Lesbarkeit

## Text im KI-Bild
Erlaubt:
- kurze deutsche Labels
- kurze Preiswerte
- kurze Fragen
- normalerweise 1–4 Wörter

Verboten:
- Headline
- Untertitel
- ganzer Satz
- CTA
- lange Erklärtexte
- schwebende UI-Badges

## Timing-Vertrag
- Bildbeat ideal 3,5–5,0 s
- normal max. 5,5 s
- absolut max. 6,0 s
- wenn länger nötig: splitten oder animieren
- Zielverteilung über tatsächliche Visual-Beats: ca. 60 % Bilder / 40 % Remotion
- Szenenanzahl wird aus Voiceover-Länge abgeleitet, nicht auf 10 fixiert

## Pflichtinhalt jedes einzelnen Bildprompts
1. finaler Dateiname
2. konkrete Bildaussage
3. konkrete Alltagsmetapher
4. Hauptobjekt + Nebenobjekte
5. vollständiger Stylized-3D-Lock
6. Farb-/Material-Lock
7. Kamera/Licht/Tiefenwirkung
8. erlaubte kurze Labels
9. nahtloser Hintergrund
10. harter Negativblock inkl. `NO photorealistic office/photo look`
11. QA: Aussage in unter 2 Sekunden lesbar

## Google-Flow-QA
Nach jedem Bild prüfen:
- sofort erkennbarer stylized 3D CGI render?
- starke 3D-Tiefe und Volumen?
- klar nicht fotorealistisch?
- alltagsnah und unmittelbar verständlich?
- keine UI-/Board-Struktur?
- kurze Labels korrekt?
- 1:1 und nahtloser Hintergrund?
- maximal 6 Sekunden nötig?

Wenn nicht: dieselbe Bildnummer neu erzeugen.