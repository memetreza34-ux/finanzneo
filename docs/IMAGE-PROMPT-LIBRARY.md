# FinanzNeo — Bildprompt-Bibliothek

Diese Datei enthält die verbindliche Prompt-Sprache für neue FinanzNeo-Bilder. Bei Widerspruch gilt `CLAUDE.md`.

## Grundregel

Jeder Prompt besteht aus:

1. finalem Dateinamen
2. beim Cover Headline- und Sublinetext; bei Szenen kein Satz, nur Labels
3. erlaubten kurzen deutschen Objektlabels
4. einer starken visuellen Metapher / einem großen Hauptobjekt
5. einer sichtbaren Ursache-Wirkung
6. dem unveränderten Qualitäts- und Hintergrundblock

## Verbindlicher Qualitätsblock

```text
FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3

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

TEXT (Szenenbild):
No headline. No subtitle. No sentence. No paragraph. No CTA. No title text of any kind anywhere in the image.
The ONLY text allowed are the explicitly requested short German object labels, normally 1–3 words, placed small, clearly legible and directly next to the object they describe.
(Beim Cover stattdessen: eine eingebrannte Headline plus Subline im oberen Drittel.)

BACKGROUND:
Use ONE single seamless continuous deep charcoal green-black background across the entire vertical 9:16 image.
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

BESCHRIFTUNGEN – EXAKT DIESE, SONST KEIN TEXT:
- [Label 1]
- [Label 2]

BILDPROMPT:
[ONE LARGE FINANCIAL METAPHOR] as the clear hero of the image, large and centered.
[Describe one clear cause-and-effect action using only a few large objects.]
Default is objects only, no person. Add a stylized person with clearly visible face only if it genuinely helps.
Include German object labels: '[Label 1]' near [object 1], and '[Label 2]' near [object 2].
[Append the complete quality block above.]
```

Der Normalfall ist die starke Metapher ohne Person. Eine einzelne stilisierte Hand am Objekt gilt nicht als Person. Nur wenn eine Person die Erklärung wirklich verbessert, kommt sie dazu — dann gilt die Gesichtsregel immer.

## Cover

Beim Cover ist Text **Pflicht**, nie optional. Die Headline muss direkt sagen, worum es im Reel geht — das Thema soll in einer Sekunde erfassbar sein. Keine vagen Andeutungen und keine reine Neugier-Formel ohne Inhalt.

Muster: Headline nennt die konkrete Sache oder Zahl, Subline stellt die Frage oder den Nutzen dahinter.

```text
Headline: 25 € MEHR IM MONAT
Subline:  Was macht das in 20 Jahren?

Headline: INFLATION FRISST DEIN GELD
Subline:  Was 10.000 € in 20 Jahren noch wert sind.
```

Ansonsten gelten Metapher, Hintergrund und Textposition wie bei jedem anderen Bild.

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
- Cover ohne Headline oder Subline
- Szenenbild mit Satz, Headline oder Subline
- Text im unteren Bilddrittel
- ganzer Absatz im Bild
- gesichtslose Person
- falsche/zusätzliche Labels
