# FinanzNeo Image World V3

**World ID:** `finanzneo-connected-studio-v3`

Dieses Dokument beschreibt ab jetzt den verbindlichen Referenzstil für FinanzNeo-KI-Bilder.

## 1. Referenzbild-Idee

Der gewünschte Look entspricht diesem Prinzip:

> Eine stilisierte 3D-Person steht neben EINER großen, klaren Finanzmetapher. Beispiel: eine hohe Sanduhr mit leuchtenden Euro-Münzen. Münzen fallen sichtbar durch die Sanduhr, ein Teil verschwindet unten in einem rot-orange leuchtenden Verlust-Riss. Kurze deutsche Objektlabels wie `Wartezeit` und `Verlorene Zinsen` erklären nur die relevanten Elemente.

Nicht die konkrete Sanduhr ist verbindlich, sondern **diese Art der visuellen Erklärung**.

## 2. Verbindlicher Stil

- Premium fintech editorial 3D render style
- deep charcoal green-black background
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
2. optional **eine stilisierte anonyme 3D-Person** daneben
3. nur wenige unterstützende Objekte
4. einen klar sichtbaren Ursache-Wirkungs-Zusammenhang
5. 1–3 kurze deutsche Objektlabels

Das Bild soll wie eine einzelne hochwertige Editorial-Illustration wirken, nicht wie eine kleine Welt oder ein Game-Level.

## 4. Stilisierte Person

Eine stilisierte 3D-Person ist erlaubt und oft erwünscht, wenn sie Maßstab, Aufmerksamkeit oder Handlung verbessert.

- anonym
- erwachsen
- glatte stilisierte 3D-Geometrie
- natürliche einfache Pose
- keine erkennbare reale Person
- kein Fotorealismus
- Person darf das Hauptobjekt nicht verdecken

Nicht jede Szene muss eine Person enthalten. Die Metapher bleibt wichtiger als die Figur.

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

## 6. Verbindliche Negativfläche

Für jedes 9:16-Quellbild:

```text
obere 15 % = komplett leerer dunkler Negativraum
mittlere 60 % = gesamte Bildhandlung
untere 25 % = komplett leerer dunkler, uncluttered Negativraum
```

In den oberen 15 % und unteren 25 % dürfen keine wichtigen Gegenstände, Münzen, Personen, Labels oder Effekte liegen.

Die Bereiche sollen wirklich ruhig sein, nicht mit Architektur, Plattformen oder Deko gefüllt werden.

## 7. Was ausdrücklich nicht gewünscht ist

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

## 8. Prompt-Grundmuster

Ein guter Prompt soll sprachlich ungefähr diesem Muster folgen:

```text
A stylized 3D person standing beside [ONE LARGE FINANCIAL METAPHOR].
[Describe a visible cause-and-effect action using only a few objects.]
Include German text labels: '[Label 1]' near [object 1], and '[Label 2]' near [object 2].
Premium fintech editorial render style.
Background is deep charcoal green-black.
Accents in vivid emerald and mint green.
Use smooth rounded 3D geometry, soft bevelled edges, confident high-contrast studio lighting with bold rim light.
Ensure the top 15 percent of the image is completely empty dark negative space,
and the bottom 25 percent is also completely empty uncluttered negative space.
The composition is vertical 9:16.
No photorealism, no real humans, no UI dashboards.
```

Jeder Szenenprompt wird inhaltlich neu formuliert, behält aber dieses visuelle Sprachmuster.

## 9. Google-Flow-Ablauf

```text
PROMPT LESEN
→ GENAU EIN BILD ERZEUGEN
→ SOFORT KORREKT UMBENENNEN
→ MOTIV + LABELS + DATEINAME PRÜFEN
→ ERST DANN NÄCHSTES BILD
```

Bildnummer = echte Szenennummer.

Animationsszenen erhalten kein Bild und behalten ihre Nummer.

Erst nach Abschluss kommen alle Nutzerbilder gemeinsam nach:

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

## 10. Ablehnungskriterien

Bild neu erzeugen, wenn:

- es wie ein Diorama oder Game-Level aussieht
- die Metapher nicht sofort verständlich ist
- zu viele kleine Objekte vorkommen
- obere 15 % nicht frei sind
- untere 25 % nicht frei sind
- große Headline oder ganzer Satz generiert wurde
- Objektlabels falsch geschrieben sind
- zusätzliche Texte auftauchen
- die Figur fotorealistisch wirkt
- Hintergrund nicht deep charcoal green-black ist
- Emerald/Mint-Rim-Light und Premium-3D-Qualität fehlen
