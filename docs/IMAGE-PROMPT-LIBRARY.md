# FinanzNeo — Bildprompt-Bibliothek

Diese Datei enthält die verbindliche Prompt-Sprache für neue FinanzNeo-Bilder. Bei Widerspruch gilt `CLAUDE.md`.

## Grundregel

Jeder Prompt besteht aus:

1. finalem Dateinamen
2. erlaubtem Text für genau diesen Bildtyp
3. einer starken visuellen Metapher / einem großen Hauptobjekt
4. einer sichtbaren Ursache-Wirkung
5. dem unveränderten Qualitäts- und Hintergrundblock

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
Place the main subject around the visual center and leave natural breathing room without changing the background.

NEGATIVES:
No photorealism, no real identifiable human, no faceless character, no back-view-only person, no UI dashboard, no app screen, no tiny isometric diorama, no neon tunnel, no sci-fi corridor, no miniature game level, no clutter, no random labels, no Pixar, no clay.
```

## Textregel für Szenenbilder `Bild 01+`

```text
No headline. No subtitle. No explanatory sentence. No CTA.
Only the explicitly requested short German object labels, normally 1–3 words, directly near the related object.
```

Eine Person ist nicht in jeder Szene Pflicht. Wenn keine Person die Erklärung verbessert, bleibt nur die starke Metapher. Wenn eine Person vorkommt, gilt die Gesichtsregel immer.

## Szenenblock `Bild 01+`

```text
GOOGLE FLOW – FINALER DATEINAME:
Bild XX - Kurzer Szenenname.png

BESCHRIFTUNGEN – EXAKT SO:
- [Label 1]
- [Label 2]

BILDPROMPT:
A stylized 3D adult person with a clearly visible stylized face, front-facing or in a natural three-quarter view, standing beside [ONE LARGE FINANCIAL METAPHOR].
[Describe one clear cause-and-effect action using only a few large objects.]
Include German object labels: '[Label 1]' near [object 1], and '[Label 2]' near [object 2].
No headline. No subtitle. No explanatory sentence.
[Append the complete quality block above.]
```

## Cover `Bild 00` — Pflichtüberschrift aus Google Flow

Das Cover ist die einzige Headline-Ausnahme.

Jeder Cover-Prompt enthält exakt diesen Block:

```text
GOOGLE FLOW – FINALER DATEINAME:
Bild 00 - Kurzer Cover-Name.png

COVER-ÜBERSCHRIFT – EXAKT SO:
[EXAKTE DEUTSCHE COVER-ÜBERSCHRIFT]

TYPOGRAFIE:
Include the exact German cover headline directly in the generated image.
Large, premium, bold and immediately readable on a smartphone.
Maximum two lines.
Spell it exactly.
Do not create a separate text box, header band, panel or second background behind the headline.
Do not add a subtitle, CTA, explanatory sentence or extra random text.

BILDPROMPT:
[ONE LARGE COVER METAPHOR THAT EXPLAINS THE REEL TOPIC IN ONE GLANCE.]
Include the exact German cover headline '[EXAKTE DEUTSCHE COVER-ÜBERSCHRIFT]' directly in the generated image.
[Append the complete quality block above.]
```

Cover-Headline-Regeln:

- ungefähr 3–8 Wörter
- maximal zwei Zeilen
- nennt konkret das Reel-Thema
- nicht vage wie `Das musst du wissen`
- keine zweite Unterzeile/Subtitle
- Schreibweise exakt prüfen
- fehlt/falsch/abgeschnitten/schlecht lesbar → Cover in Google Flow neu erzeugen
- **niemals später in Remotion ergänzen oder reparieren**

Kurze Objektlabels sind auf dem Cover nur erlaubt, wenn sie für die Metapher zusätzlich nötig sind. Die Cover-Überschrift ist die Haupttextaussage.

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

Allgemein:

- Prozent-Zonen wie `top 15 / middle 60 / bottom 25`
- zwei sichtbare Hintergründe/Bänder
- sichtbare Boden-Wand-Grenze oder Horizont
- alte gebogene Studioarchitektur als Pflicht
- Miniatur-Diorama/Game-Level
- gesichtslose Person
- falsche/zusätzliche Texte

Cover `Bild 00` ablehnen bei:

- fehlender, falsch geschriebener, abgeschnittener oder schlecht lesbarer Pflichtüberschrift
- zusätzlichem Subtitle/CTA/erklärendem Satz
- separatem Headline-Balken/Panel

Szenenbilder `Bild 01+` ablehnen bei:

- großer generierter Headline
- Subtitle/ganzer erklärender Satz
- falschen/zusätzlichen Objektlabels
