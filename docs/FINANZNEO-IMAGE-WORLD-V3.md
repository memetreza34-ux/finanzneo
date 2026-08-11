# FinanzNeo Image World V3

**World ID:** `finanzneo-connected-studio-v3`

Dieses Dokument beschreibt den verbindlichen Referenzstil für FinanzNeo-KI-Bilder. Bei Widerspruch gilt `CLAUDE.md`.

## Referenzprinzip

Der gewünschte Look entspricht diesem Prinzip:

> Eine stilisierte 3D-Person mit klar sichtbarem Gesicht steht neben EINER großen Finanzmetapher. Beispiel: eine hohe Sanduhr mit leuchtenden Euro-Münzen; ein Teil der Münzen verschwindet in einem warm rot-orange leuchtenden Verlust-Riss. Kurze deutsche Objektlabels wie `Wartezeit` und `Verlorene Zinsen` erklären nur die relevanten Elemente.

Nicht die konkrete Sanduhr ist verbindlich, sondern diese **Art der visuellen Erklärung**.

## Verbindlicher Stil

- Premium fintech editorial 3D render style
- ONE seamless deep charcoal green-black background
- vivid emerald and mint-green accents
- Gold nur für Geld/Wert
- warmes Rot-Orange nur für Verlust, Risiko, Schulden oder blockiertes Geld
- smooth rounded 3D geometry
- soft bevelled edges
- hochwertige matte und transparente Materialien
- confident high-contrast studio lighting
- kräftiges smaragdgrünes Rim Light
- nicht fotorealistisch
- kein Pixar-/Clay-/Kindercartoon-Look

## Ein Bild = eine starke Metapher

Jede Bildszene verwendet möglichst:

1. eine dominante Metapher oder ein großes Hauptobjekt
2. optional eine stilisierte anonyme 3D-Person
3. wenige unterstützende Elemente
4. sichtbaren Ursache-Wirkungs-Zusammenhang
5. bei Szenenbildern wenige kurze deutsche Objektlabels

Das Ergebnis wirkt wie eine einzelne hochwertige Editorial-Illustration, nicht wie eine Miniaturwelt oder ein Game-Level.

## Personenregel

Wenn eine Person vorkommt:

- erwachsene stilisierte 3D-Person
- Gesicht klar sichtbar
- Augen, Nase und Mund erkennbar
- frontal oder natürliche 3/4-Ansicht bevorzugt
- keine reale/identifizierbare Person
- kein Fotorealismus

Nicht erlaubt:

- gesichtslose Mannequin-Figur
- blankes Gesicht
- verstecktes Gesicht
- reine Rückenansicht
- komplett abgewandte Person

## Textregel — Cover und Szenen trennen

### Cover `Bild 00` — einzige Headline-Ausnahme

Pflicht:

- eine große klare deutsche Cover-Überschrift direkt im Google-Flow-Bild
- exakte Vorgabe im Prompt unter:

```text
COVER-ÜBERSCHRIFT – EXAKT SO:
[EXAKTE DEUTSCHE COVER-ÜBERSCHRIFT]
```

- ungefähr 3–8 Wörter
- maximal zwei Zeilen
- sagt konkret, worum es im Reel geht
- hochwertige Smartphone-lesbare Typografie
- kein separater Header-Balken, keine Textbox, kein zweiter Hintergrund
- kein Subtitle, CTA oder erklärender Satz
- fehlend/falsch geschrieben/abgeschnitten/unlesbar → Cover neu in Google Flow erzeugen
- **niemals in Remotion ergänzen, ersetzen oder reparieren**

### Szenenbilder `Bild 01+`

#### Niemals

- große Überschrift
- Untertitel
- ganzer erklärender Satz
- CTA
- Absatz
- Poster-Typografie

#### Gewünscht

Nur kurze deutsche Objekt-Beschriftungen:

- normalerweise 1–3 Wörter
- direkt neben dem zugehörigen Objekt
- klein bis mittelgroß
- klare Sans-Serif-Schrift
- wenige Labels pro Bild

Beispiele:

```text
Wartezeit
Verlorene Zinsen
Notgroschen
Reparatur
Dispo
Ratenzahlung
500 €
Notfall
Konsum
Tagesgeld
Auffüllen
```

## Reale Marken und bekannte Namen

Bekannte Marken/Dienste dürfen verwendet werden, wenn sie für die Szene wirklich relevant sind, z. B. Netflix, Spotify, Disney+, Amazon oder Apple.

- keine zufällige Marken-Deko
- keine erfundene Partnerschaft/Empfehlung
- Namen korrekt schreiben
- nur notwendige Marken verwenden

## Hintergrundregel — keine zwei Hintergründe

**Keine Prozent-Zonen mehr verwenden.**

Das gesamte 9:16-Bild besitzt **einen einzigen nahtlosen Hintergrund** von oben bis unten.

Verbindlicher Promptblock:

```text
Use ONE single seamless continuous deep charcoal green-black background across the entire vertical 9:16 image.
The background must keep the same continuous material, tone and gradient from the very top edge to the very bottom edge.
NO horizontal divisions.
NO visible top section.
NO visible bottom section.
NO separate zones.
NO dark band at the top.
NO dark band at the bottom.
NO floor-wall boundary.
NO horizon line.
NO studio wall split.
NO panel background.
NO layered backdrop.
Use only one subtle continuous background gradient or vignette across the whole image.
Do not create a visible floor, visible wall or visible studio horizon.
Objects may cast soft contact shadows, but the background itself remains one uninterrupted surface.
Place the main subject around the visual center and leave generous natural empty space above and below WITHOUT changing the background there.
```

Auch die Cover-Überschrift liegt direkt auf diesem einen Hintergrund; kein separater Textbereich.

Verboten:

- `top 15% / middle 60% / bottom 25%`
- andere harte Prozentzonen
- horizontale Farbkante
- obere/untere Bänder
- Boden-Wand-Grenze
- getrennte Panels

## Was ausdrücklich nicht gewünscht ist

- winzige isometrische Dioramen
- mehrere kleine Räume/Plattformen
- Neon-Tunnel
- Sci-Fi-Korridore
- futuristische Game-Level
- Dashboard-/App-UI
- abstrakte Rohrsysteme
- überladene Szenen
- Fotorealismus
- reale Menschen
- gesichtslose Personen
- zwei oder mehr sichtbare Hintergrundzonen
- riesige zufällige Typografie; ausgenommen ist die exakt vorgegebene Cover-Headline auf `Bild 00`

## Prompt-Grundmuster für Szenenbilder `Bild 01+`

```text
A stylized 3D adult person with a clearly visible stylized face, front-facing or in a natural three-quarter view, standing beside [ONE LARGE FINANCIAL METAPHOR].
[Describe one visible cause-and-effect action using only a few large objects.]
Include German object labels: '[Label 1]' near [object 1], and '[Label 2]' near [object 2].
Premium fintech editorial 3D render style.
Use ONE single seamless continuous deep charcoal green-black background from top edge to bottom edge.
No horizontal bands, no top/bottom sections, no floor-wall boundary, no horizon line and no panels.
Accents in vivid emerald and mint green. Gold only for money/value. Warm red-orange only for danger/loss.
Use smooth rounded 3D geometry, soft bevelled edges and confident high-contrast studio lighting with bold emerald rim light.
Place the main subject around the visual center and leave natural breathing room without changing the background.
Vertical 9:16.
No photorealism, no real identifiable human, no faceless character, no UI dashboard, no headline, no subtitle, no explanatory sentence.
```

## Cover-Prompt-Grundmuster `Bild 00`

```text
COVER-ÜBERSCHRIFT – EXAKT SO:
[EXAKTE DEUTSCHE COVER-ÜBERSCHRIFT]

Show [ONE LARGE COVER METAPHOR THAT EXPLAINS THE REEL TOPIC].
Include the exact German cover headline '[EXAKTE DEUTSCHE COVER-ÜBERSCHRIFT]' directly in the generated image.
Large, premium, bold, smartphone-readable, maximum two lines. Spell it exactly.
No subtitle, CTA, explanatory sentence or extra random text.
No separate text box, header band, panel or second background.
Use the same seamless FinanzNeo background and style rules.
```

## Google-Flow-Ablauf

```text
PROMPT LESEN
→ GENAU EIN BILD ERZEUGEN
→ SOFORT KORREKT UMBENENNEN
→ MOTIV + ERLAUBTEN TEXT + GESICHT + HINTERGRUND + DATEINAME PRÜFEN
→ ERST DANN NÄCHSTES BILD
```

Beim Cover zusätzlich die exakte Pflichtüberschrift prüfen.

Bildnummer = echte Szenennummer. Animationsszenen erhalten kein Bild und behalten ihre Nummer.

Erst nach Abschluss kommen alle Nutzerbilder gemeinsam nach:

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

## Sofort neu erzeugen, wenn

Allgemein:

- zwei sichtbare Hintergründe/Bänder entstehen
- horizontale Trennlinie oder Tonwertkante entsteht
- Boden-/Wand-Grenze oder Horizont sichtbar ist
- Hintergrund nicht nahtlos durchläuft
- Figur kein sichtbares Gesicht hat
- reine Rückenansicht verwendet wird
- Diorama/Game-Level entsteht
- Metapher nicht sofort verständlich ist
- Stil fotorealistisch/Pixar/Clay wird

Cover `Bild 00` zusätzlich:

- Pflichtüberschrift fehlt/falsch geschrieben/abgeschnitten/unlesbar ist
- Subtitle/CTA/erklärender Satz entsteht
- eigener Headline-Balken/Panel entsteht

Szenenbild `Bild 01+` zusätzlich:

- große Headline/Untertitel/Satz entsteht
- Objektlabels falsch oder zusätzlich sind
