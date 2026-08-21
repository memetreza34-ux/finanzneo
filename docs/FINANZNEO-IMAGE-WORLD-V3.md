# FinanzNeo Image World V3

**World ID:** `finanzneo-connected-studio-v3`

**Series Lock ID:** `finanzneo-same-world-v1`

**Generated Image Aspect Ratio:** `1:1`

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
5. 1–3 kurze deutsche Objektlabels

Das Ergebnis wirkt wie eine einzelne hochwertige Editorial-Illustration, nicht wie eine Miniaturwelt oder ein Game-Level.

## Same-World-Lock über den gesamten Bildsatz

Alle Bilder eines Reels behalten exakt dieselbe Art Direction:

- gleiches deep-charcoal-green-black Hintergrundmaterial und gleicher Gradient-Charakter
- gleiche smaragdgrüne Rim-Light-Signatur und gleiches Kontrastniveau
- gleiche abgerundete Geometriesprache und Bevel-Weichheit
- gleiche matten/gläsernen Materialqualitäten
- unveränderte Farbrollen für Grün, Gold und Rot-Orange

Motive dürfen wechseln. Der Agent darf die Serie zwischen Bildern nicht in einen neuen Stil umdeuten. Wenn dieselbe Person in mehreren Bildern vorkommt, bleibt ihr stilisiertes Erscheinungsbild gleich.

Nach bestandener Cover-QA dient `Bild 00` als reine visuelle Stilreferenz für alle Folgebilder. Nur Bildwelt, Materialien, Geometriesprache, Farbrollen, Kontrast und Lichtsignatur übernehmen; niemals Cover-Motiv, Komposition oder Labels kopieren.

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

## Textregel

### Niemals

- große Überschrift
- Untertitel
- ganzer erklärender Satz
- CTA
- Absatz
- Poster-Typografie

### Gewünscht

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

Das gesamte quadratische 1:1-Bild besitzt **einen einzigen nahtlosen Hintergrund** von Kante zu Kante.

Verbindlicher Promptblock:

```text
Use ONE single seamless continuous deep charcoal green-black background across the entire square 1:1 image.
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
- riesige Typografie
- Fotorealismus
- reale Menschen
- gesichtslose Personen
- zwei oder mehr sichtbare Hintergrundzonen

## Prompt-Grundmuster

```text
A stylized 3D adult person with a clearly visible stylized face, front-facing or in a natural three-quarter view, standing beside [ONE LARGE FINANCIAL METAPHOR].
[Describe one visible cause-and-effect action using only a few large objects.]
Include German object labels: '[Label 1]' near [object 1], and '[Label 2]' near [object 2].
Premium fintech editorial 3D render style.
Use ONE single seamless continuous deep charcoal green-black background from top edge to bottom edge.
No horizontal bands, no top/bottom sections, no floor-wall boundary, no horizon line and no panels.
Accents in vivid emerald and mint green. Gold only for money/value. Warm red-orange only for danger/loss.
Use smooth rounded 3D geometry, soft bevelled edges and confident high-contrast studio lighting with bold emerald rim light.
Place the main subject around the visual center and leave generous natural empty space above and below without changing the background.
Square 1:1 source image. Width and height must be equal. No portrait or vertical format.
No photorealism, no real identifiable human, no faceless character, no UI dashboard, no headline, no subtitle, no explanatory sentence.
```

## Google-Flow-Ablauf

Einzige Agent-Übergabedatei: `03-szenen/alle-bildprompts.txt`.
Protokoll: `finanzneo-flow-sequential-v1`.

```text
PROMPT LESEN
→ GENAU EIN BILD ERZEUGEN
→ VOLLSTÄNDIG WARTEN
→ SOFORT KORREKT UMBENENNEN
→ MOTIV + LABELS + GESICHT + HINTERGRUND + DATEINAME PRÜFEN
→ ERST DANN NÄCHSTES BILD
```

Keine parallele Erzeugung. Bei fehlerhafter QA dieselbe Bildnummer neu erzeugen, unter demselben finalen Namen ersetzen und erst danach fortfahren.

Bildnummer = echte Szenennummer. Animationsszenen erhalten kein Bild und behalten ihre Nummer.

Erst nach Abschluss kommen alle Nutzerbilder gemeinsam nach:

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

## Sofort neu erzeugen, wenn

- zwei sichtbare Hintergründe/Bänder entstehen
- horizontale Trennlinie oder Tonwertkante entsteht
- Boden-/Wand-Grenze oder Horizont sichtbar ist
- Hintergrund nicht nahtlos durchläuft
- Figur kein sichtbares Gesicht hat
- reine Rückenansicht verwendet wird
- Diorama/Game-Level entsteht
- Metapher nicht sofort verständlich ist
- große Headline/Untertitel/Satz entsteht
- Objektlabels falsch oder zusätzlich sind
- Stil fotorealistisch/Pixar/Clay wird
