# FinanzNeo Image World V3

**World ID:** `finanzneo-connected-studio-v3`

Dieses Dokument beschreibt den verbindlichen Referenzstil für FinanzNeo-KI-Bilder.

## 1. Referenzbild-Idee

Der gewünschte Look entspricht diesem Prinzip:

> Eine stilisierte 3D-Person mit klar sichtbarem Gesicht steht neben EINER großen, klaren Finanzmetapher. Beispiel: eine hohe Sanduhr mit leuchtenden Euro-Münzen. Münzen fallen sichtbar durch die Sanduhr, ein Teil verschwindet unten in einem rot-orange leuchtenden Verlust-Riss. Kurze deutsche Objektlabels wie `Wartezeit` und `Verlorene Zinsen` erklären nur die relevanten Elemente.

Nicht die konkrete Sanduhr ist verbindlich, sondern **diese Art der visuellen Erklärung**.

## 2. Verbindlicher Stil

- Premium fintech editorial 3D render style
- ein einziger durchgehender deep charcoal green-black background
- vivid emerald and mint-green accents
- Gold ausschließlich für Euro-Münzen, Geld und finanziellen Wert
- warmes Rot-Orange ausschließlich für Verlust, Risiko, Schulden oder blockiertes Geld
- smooth rounded 3D geometry
- soft bevelled edges
- hochwertige matte und transparente Materialien
- confident high-contrast studio lighting
- kräftiges smaragdgrünes Rim Light
- stilisiert, hochwertig und modern
- nicht fotorealistisch
- kein Pixar-/Clay-/Kindercartoon-Look

## 3. Bildaufbau

Jede Bildszene verwendet möglichst:

1. **eine dominante Metapher oder ein großes Hauptobjekt**
2. optional **eine stilisierte anonyme 3D-Person mit sichtbarem Gesicht** daneben
3. nur wenige unterstützende Objekte
4. einen klar sichtbaren Ursache-Wirkungs-Zusammenhang
5. 1–3 kurze deutsche Objektlabels

Das Bild soll wie eine einzelne hochwertige Editorial-Illustration wirken, nicht wie eine kleine Welt oder ein Game-Level.

## 4. Stilisierte Person — Gesicht verbindlich

Wenn eine Person im Bild vorkommt, muss ihr Gesicht klar sichtbar sein.

- anonym
- erwachsen
- glatte stilisierte 3D-Geometrie
- frontal oder natürliche 3/4-Ansicht bevorzugt
- Augen, Nase und Mund klar als stilisierte Gesichtszüge erkennbar
- natürliche einfache Pose
- keine erkennbare reale Person
- kein Fotorealismus
- Person darf das Hauptobjekt nicht verdecken

Nicht erlaubt:

- gesichtslose Mannequin-Figur
- komplett glattes/blankes Gesicht
- verstecktes Gesicht
- reine Rückenansicht
- komplett von der Kamera abgewandte Person

Nicht jede Szene muss eine Person enthalten. Wenn eine Person vorkommt, gilt die Gesichtsregel immer.

## 5. Textregel

### Niemals

- große Überschrift
- Untertitel
- ganzer erklärender Satz
- CTA
- Absatz
- große Poster-Typografie

### Gewünscht

Nur kurze deutsche Objekt-Beschriftungen:

- normalerweise 1–3 Wörter
- direkt neben dem zugehörigen Objekt
- klein bis mittelgroß
- klare Sans-Serif-Schrift
- weiß oder hellgrau
- nur so viele Labels wie nötig

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

Keine englischen Labels, keine Fantasiewörter und keine zufälligen Zusatztexte.

## 6. Ein einziger durchgehender Hintergrund

Das gesamte 9:16-Bild verwendet **einen einzigen nahtlosen Hintergrund** von der oberen bis zur unteren Bildkante.

Verbindlich:

- deep charcoal green-black als Grundwelt
- derselbe Hintergrund oben, in der Mitte und unten
- subtile weiche Vignette oder Lichtabstufung erlaubt
- jede Abstufung muss kontinuierlich und nahtlos verlaufen

Nicht erlaubt:

- horizontale Farbübergänge
- sichtbare Linie zwischen oberem/mittlerem/unterem Bereich
- dunkleres oder helleres Band oben
- separates Band unten
- unterschiedliche Hintergrund-Panels
- separate Bodenfläche, die wie ein horizontaler Farbstreifen wirkt
- drei erkennbare Hintergrundzonen

## 7. Negativfläche ohne Bänder

Für jedes 9:16-Quellbild:

```text
obere 15 % = keine Objekte/Labels/Effekte
mittlere 60 % = gesamte Bildhandlung
untere 25 % = keine Objekte/Labels/Effekte
```

WICHTIG: Oben und unten wird **kein anderer Hintergrund** erzeugt. Die freien Bereiche sind lediglich objektfreie Teile **desselben durchgehenden Hintergrunds**.

Die Bereiche dürfen niemals wie eigene Balken, Panels oder Farbzonen aussehen.

## 8. Was ausdrücklich nicht gewünscht ist

- winzige isometrische Dioramen
- mehrere kleine Räume oder Plattformen
- Neon-Tunnel
- Sci-Fi-Korridore
- futuristische Game-Level
- viele kleine Icons und Miniobjekte
- Dashboard-/App-UI
- abstrakte Rohrsysteme
- überladene Szenen
- riesige Typografie
- Fotorealismus
- reale Menschen
- gesichtslose Personen
- horizontale Hintergrundbänder oder sichtbare Übergänge oben/unten

## 9. Prompt-Grundmuster

Ein guter Prompt soll sprachlich ungefähr diesem Muster folgen:

```text
A stylized 3D person with a clearly visible stylized face, readable eyes, nose and mouth, front-facing or in a natural three-quarter view, standing beside [ONE LARGE FINANCIAL METAPHOR].
[Describe a visible cause-and-effect action using only a few objects.]
Include German text labels: '[Label 1]' near [object 1], and '[Label 2]' near [object 2].
Premium fintech editorial render style.
Use ONE seamless deep charcoal green-black background from top edge to bottom edge, with no horizontal bands or top/bottom transitions.
Accents in vivid emerald and mint green.
Use smooth rounded 3D geometry, soft bevelled edges, confident high-contrast studio lighting with bold rim light.
Keep the top 15 percent free of objects and labels, and keep the bottom 25 percent free of objects and labels, while using exactly the SAME continuous background in both areas.
The composition is vertical 9:16.
No photorealism, no real humans, no faceless characters, no hidden faces, no UI dashboards.
```

Jeder Szenenprompt wird inhaltlich neu formuliert, behält aber dieses visuelle Sprachmuster.

## 10. Google-Flow-Ablauf

```text
PROMPT LESEN
→ GENAU EIN BILD ERZEUGEN
→ SOFORT KORREKT UMBENENNEN
→ MOTIV + LABELS + GESICHT + HINTERGRUND + DATEINAME PRÜFEN
→ ERST DANN NÄCHSTES BILD
```

Bildnummer = echte Szenennummer.

Animationsszenen erhalten kein Bild und behalten ihre Nummer.

Erst nach Abschluss kommen alle Nutzerbilder gemeinsam nach:

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

## 11. Ablehnungskriterien

Bild neu erzeugen, wenn:

- es wie ein Diorama oder Game-Level aussieht
- die Metapher nicht sofort verständlich ist
- zu viele kleine Objekte vorkommen
- obere 15 % mit Objekten/Labels gefüllt sind
- untere 25 % mit Objekten/Labels gefüllt sind
- oben/unten sichtbare Hintergrundbänder oder Übergänge entstehen
- der Hintergrund nicht durchgehend einheitlich wirkt
- große Headline oder ganzer Satz generiert wurde
- Objektlabels falsch geschrieben sind
- zusätzliche Texte auftauchen
- eine dargestellte Person kein klar sichtbares Gesicht hat
- die Figur nur von hinten gezeigt wird
- die Figur fotorealistisch wirkt
- Hintergrund nicht deep charcoal green-black ist
- Emerald/Mint-Rim-Light und Premium-3D-Qualität fehlen
