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

Cover und Szenenbild folgen unterschiedlichen Textregeln.

**Cover (`Bild 00`) — Text ist Pflicht:**

- genau **eine Headline**: kurz, fett, 3–7 Wörter, helle/weiße Schrift
- genau **eine Subline** direkt darunter: ein kurzer Satz, leichter, gedämpfte helle Farbe
- die Headline sagt direkt, worum es im Reel geht — in einer Sekunde erfassbar, keine vage Andeutung
- Position: oberes Sicherheitsdrittel, damit sie nicht mit dem Remotion-Untertitel kollidiert (`SAFE_AREA.topRatio` / `bottomRatio` in `src/brand/tokens.ts`)

**Szenenbilder (`Bild 01` und folgende) — kein Satz im Bild:**

- keine Headline, keine Subline, kein ganzer Satz, kein CTA, kein Absatz
- erlaubt sind ausschließlich kurze deutsche Objektlabels, normalerweise 1–3 Wörter
- Labels stehen klein, klar lesbar und direkt neben dem Objekt, das sie benennen — nie darüber
- die Aussage der Szene kommt aus dem Voiceover und den Remotion-Untertiteln; ein Satz im Bild würde mit beidem konkurrieren

**Nicht erlaubt:**

- Satz oder Headline in einem Szenenbild
- mehr als eine Headline oder Subline im Cover
- Text im unteren Bilddrittel (kollidiert mit dem Remotion-Untertitel)
- CTA-Text im Bild
- erfundene Wörter, Zahlen oder Datumsangaben, die nicht ausdrücklich verlangt wurden
- englische Erklärtexte anstelle der deutschen Labels

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

Für **Szenenbilder** (kein Satz im Bild):

```text
GESPROCHENER SATZ DIESER SZENE:
[Der Voiceover-Satz — das Bild muss ihn vollständig erzählen.]

HERO — [welcher Satzteil]:
[ONE LARGE FINANCIAL METAPHOR], described with believable material detail, large and slightly angled in the center.

[ZWEITER BLOCK] — [welcher Satzteil]:
[Supporting object that carries this part of the sentence, with its visible cause-and-effect.]

[DRITTER BLOCK] — [welcher Satzteil]:
[Supporting object that carries this part of the sentence.]

Everything is grouped tightly around the hero as one connected still life. Every object serves the same sentence.

TEXT RULE – SEHR WICHTIG:
No headline. No subtitle. No sentence. No paragraph. No CTA. No title text of any kind anywhere in the image.
The ONLY text allowed are the short German object labels listed below, placed small, clearly legible, in a clean sans-serif, directly next to the object they describe and never overlapping it.

BESCHRIFTUNGEN – EXAKT DIESE, SONST KEIN TEXT:
- '[Label 1]' [wo genau im Bild]
- '[Label 2]' [wo genau im Bild]

Premium fintech editorial 3D render style with rich material detail. Deep charcoal green-black world. Accents in vivid emerald and mint green. Gold only for money/value. Warm red-orange only for danger/loss.
Objects are believable and detailed in construction, but the image stays a premium 3D illustration and never a photograph.
Use ONE single seamless continuous deep charcoal green-black background from top edge to bottom edge. No bands, no floor-wall boundary, no horizon line, no room, no table, no panels. Objects cast soft contact shadows directly onto the background. Fill the usable frame generously so it never looks empty.
Default is objects and metaphors only, no person. A single stylized hand is allowed.
Vertical 9:16.
No photorealism, no UI dashboard, no isometric diorama, no neon tunnel, no Pixar, no clay, no cartoon simplification.
```

Für das **Cover** gilt dasselbe Muster, zusätzlich mit eingebrannter Headline und Subline im oberen Drittel.

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
