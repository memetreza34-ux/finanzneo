# FinanzNeo — Bildprompt-Bibliothek

Diese Datei enthält die verbindliche Prompt-Sprache für neue FinanzNeo-Bilder. Bei Widerspruch gilt `CLAUDE.md`.

## Grundregel

Jeder Prompt besteht aus:

1. finalem Dateinamen
2. erlaubten kurzen deutschen Objektlabels
3. einer starken visuellen Metapher / einem großen Hauptobjekt
4. einer sichtbaren Ursache-Wirkung
5. dem unveränderten Qualitäts- und Hintergrundblock

## Verbindlicher Qualitätsblock

```text
FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
FINANZNEO_SERIES_LOCK: finanzneo-same-world-v1
GENERATED_IMAGE_ASPECT_RATIO: 1:1

FORMAT:
Create a square 1:1 source image. Width and height must be equal. No portrait or vertical format.

SAME-WORLD LOCK:
Keep the exact same background material and gradient character, emerald rim-light signature, rounded geometry language, bevel softness, matte/glass material finish, color roles, contrast level and premium editorial 3D quality across the complete image series. Do not reinterpret the visual universe between images.

STYLE:
Premium fintech editorial 3D render style.
Deep charcoal green-black world.
Vivid emerald and mint-green accents.
Gold only for money and financial value.
Warm red-orange only for danger, debt, loss or blocked money.
Smooth rounded 3D geometry, soft bevelled edges, premium matte/glass materials and confident high-contrast studio lighting with bold emerald rim light.

VISUAL LANGUAGE:
Use ONE dominant financial metaphor or one large hero object with only a few supporting elements.
A stylized anonymous 3D adult person may be included when useful.
If a person appears, the face must be clearly visible with stylized eyes, nose and mouth; use front-facing or natural three-quarter view.

TEXT:
No headline. No subtitle. No explanatory sentence. No CTA.
Only the explicitly requested short German object labels, normally 1–3 words, directly near the related object.

BACKGROUND:
Use ONE single seamless continuous deep charcoal green-black background across the entire square 1:1 image.
Keep the same continuous material, tone and gradient from the very top edge to the very bottom edge.
No horizontal divisions.
No visible top section.
No visible bottom section.
No separate zones.
No dark band at the top or bottom.
No floor-wall boundary.
No horizon line.
No studio wall split.
No panel background.
No layered backdrop.
Use only one subtle continuous gradient/vignette.
Do not create a visible floor, visible wall or visible studio horizon.
Objects may cast soft contact shadows, but the background itself remains one uninterrupted surface.
Place the main subject around the visual center and leave generous natural empty space above and below without changing the background.

NEGATIVES:
No photorealism, no real identifiable human, no faceless character, no back-view-only person, no UI dashboard, no app screen, no tiny isometric diorama, no neon tunnel, no sci-fi corridor, no miniature game level, no clutter, no giant typography, no random labels, no Pixar, no clay.
```

## Szenenblock

```text
GOOGLE FLOW – FINALER DATEINAME:
Bild XX - Kurzer Szenenname.png

FLOW_AGENT_PROTOCOL: finanzneo-flow-sequential-v1
Generate exactly this one image, wait until it is complete, rename it immediately, verify filename and QA, and only then continue. If QA fails, regenerate the same image number before proceeding.

BESCHRIFTUNGEN – EXAKT SO:
- [Label 1]
- [Label 2]

BILDPROMPT:
A stylized 3D adult person with a clearly visible stylized face, front-facing or in a natural three-quarter view, standing beside [ONE LARGE FINANCIAL METAPHOR].
[Describe one clear cause-and-effect action using only a few large objects.]
Include German object labels: '[Label 1]' near [object 1], and '[Label 2]' near [object 2].
[Append the complete quality block above.]
```

Eine Person ist nicht in jeder Szene Pflicht. Wenn keine Person die Erklärung verbessert, bleibt nur die starke Metapher. Wenn eine Person vorkommt, gilt die Gesichtsregel immer.

## Cover

Auch das Cover verwendet keine große generierte Headline. Thema über eine starke Metapher + wenige kurze Objektlabels verständlich machen.

## Reale Marken

Reale Marken/Dienste dürfen gezielt als konkrete Alltagsbeispiele verwendet werden, wenn sie für die Aussage relevant sind. Keine zufällige Marken-Deko und keine erfundene Partnerschaft suggerieren.

## Muster: Problem

```text
Zeige das konkrete Problem groß und verständlich.
Noch keine spätere Lösung zeigen.
Risiko/Verlust nur mit warmem Rot-Orange markieren.
```

## Muster: Schutz

```text
Zeige eine große Schutz-/Reserve-Metapher.
Goldenes Geld wird sichtbar geschützt oder umgeleitet.
Risiko wird klar blockiert.
```

## Muster: Entscheidung

```text
Zeige eine klare Gegenüberstellung mit wenigen großen Elementen.
Grün = sinnvoll/geschützt, Rot-Orange = Risiko/falsche Ausgabe.
Kurze Labels direkt an den beiden Optionen.
```

## Muster: Ergebnis

```text
Zeige ein ruhiges klares Endergebnis mit einer dominanten Metapher.
Keine überladene Zusammenfassung aller vorherigen Szenen.
```

## Sofort ablehnen

- Prozent-Zonen wie `top 15 / middle 60 / bottom 25`
- zwei sichtbare Hintergründe/Bänder
- sichtbare Boden-Wand-Grenze oder Horizont
- alte gebogene Studioarchitektur als Pflicht
- Miniatur-Diorama/Game-Level
- Textfreiheit als Regel (kurze deutsche Objektlabels sind ausdrücklich erlaubt)
- große generierte Headline/ganzer Satz
- gesichtslose Person
- falsche/zusätzliche Labels
