# FinanzNeo Image World V3

**World ID:** `finanzneo-connected-studio-v3`

Dieses Dokument beschreibt den verbindlichen Referenzstil für FinanzNeo-KI-Bilder. Bei Widerspruch gilt `CLAUDE.md`.

## Referenzprinzip

Der gewünschte Look entspricht diesem Prinzip:

> EINE große Finanzmetapher steht im Mittelpunkt und erklärt die Aussage. Beispiel: eine hohe Sanduhr mit leuchtenden Euro-Münzen; ein Teil der Münzen verschwindet in einem rot-orange leuchtenden Verlust-Riss. Darüber im oberen Drittel eine kurze eingebrannte Headline mit Subline. Kurze deutsche Labels wie `Wartezeit` und `Verlorene Zinsen` erklären nur die relevanten Objekte. Eine Person ist möglich, aber nicht der Normalfall.

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

## Personenregel

**Standard ist ohne Person** — Objekte und Metaphern tragen die Erklärung. Eine einzelne stilisierte Hand am Objekt gilt nicht als Person.

Nur wenn eine Person die Erklärung wirklich verbessert:

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

Jedes Bild trägt genau **eine Headline** und **eine Subline**, direkt vom Bildmodell mit erzeugt — nicht nachträglich in Remotion.

- Headline: kurz, fett, 3–7 Wörter, maximal zwei Zeilen, helle/weiße Schrift
- Subline: ein kurzer Satz direkt unter der Headline, dünner/leichter als die Headline, gedämpfte helle Farbe (z. B. helles Grau oder Mint)
- Position: oberes Sicherheitsdrittel des Bildes, damit die Headline nicht mit dem Remotion-Untertitel am unteren Rand kollidiert (siehe Safe Area, `SAFE_AREA.topRatio` / `bottomRatio` in `src/brand/tokens.ts`)
- kein CTA, kein Fließtext, kein dritter Textblock im Bild
- optionale kurze deutsche Objektlabels bleiben erlaubt, sind aber nicht mehr das Haupttextmittel — Headline und Subline tragen die Aussage
- beim **Cover** ist der Text Pflicht und die Headline benennt das Thema des Reels direkt, sodass es in einer Sekunde erfassbar ist

**Nicht erlaubt:**

- mehr als eine Headline oder mehr als eine Subline
- Headline/Subline im unteren Bilddrittel (kollidiert mit dem Remotion-Untertitel)
- ganze Absätze oder mehrere Sätze
- CTA-Text im Bild
- englische Erklärtexte anstelle der deutschen Headline/Subline

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
[ONE LARGE FINANCIAL METAPHOR] as the clear hero of the image, large and centered.
[Describe one visible cause-and-effect action using only a few large objects.]
Bake the following typography directly into the image, inside the upper third of the frame, never in the lower third:
HEADLINE (bold, 3-7 words, bright white): '[HEADLINE]'
SUBLINE (lighter weight, directly below headline, muted light color): '[SUBLINE]'
No third text block, no CTA text, no paragraph.
Default is objects and metaphors only, no person. Only if a human presence genuinely helps the explanation, add a stylized 3D adult person with a clearly visible stylized face, front-facing or in a natural three-quarter view, standing beside the metaphor. A single stylized hand interacting with an object is also allowed and does not count as a person.
Premium fintech editorial 3D render style.
Use ONE single seamless continuous deep charcoal green-black background from top edge to bottom edge.
No horizontal bands, no top/bottom sections, no floor-wall boundary, no horizon line and no panels.
Accents in vivid emerald and mint green. Gold only for money/value. Warm red-orange only for danger/loss.
Use smooth rounded 3D geometry, soft bevelled edges and confident high-contrast studio lighting with bold emerald rim light.
Place the main subject around the visual center and leave generous natural empty space above and below without changing the background.
Vertical 9:16.
No photorealism, no real identifiable human, no faceless character, no UI dashboard, no explanatory paragraph.
```

## Google-Flow-Ablauf

```text
PROMPT LESEN
→ GENAU EIN BILD ERZEUGEN
→ SOFORT KORREKT UMBENENNEN
→ MOTIV + LABELS + GESICHT + HINTERGRUND + DATEINAME PRÜFEN
→ ERST DANN NÄCHSTES BILD
```

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
- Headline oder Subline fehlt, doppelt vorkommt oder im unteren Bilddrittel liegt
- ein dritter Textblock/CTA im Bild entsteht
- Objektlabels falsch oder zusätzlich sind
- Stil fotorealistisch/Pixar/Clay wird
