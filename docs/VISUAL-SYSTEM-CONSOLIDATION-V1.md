# FinanzNeo — Visual System Consolidation V1

## Zweck

Diese Datei konsolidiert die bereits vorhandenen aktiven Reel-Regeln. Sie führt **keine neue Bildwelt** und **keinen neuen Renderstil** ein.

Kanonisch bleiben:

- Bildwelt: `finanzneo-stylized-3d-animated-black-v9`
- Reel-Canvas: statisch `#000000`
- Layout: V5, Visualzone `Y320–1400`
- Google Flow: `finanzneo-flow-strict-single-job-v3`
- Animation: Phase 1 liefert finalen, versiegelbaren Remotion-Code

Das Ziel ist eine einzige sichtbare Sprache statt getrennten Bild-, Library- und Custom-Motion-Welten.

## 1. Eine Welt, zwei Darstellungsarten

IMAGE und ANIMATION dürfen technisch verschieden entstehen, müssen visuell aber wie dieselbe Serie aussehen.

Gemeinsam:

- premium stylized 3D animation-film rendering
- sichtbar stilisiert, nicht fotorealistisch
- hochwertige Modellierung und Materialien
- klare Tiefe, Licht und Kontaktschatten
- Deep Black als ruhige Weltgrenze
- Emerald = positiv/Wachstum
- Gold = Geld/Wert
- Red-Orange = Kosten/Risiko
- wenige starke Hauptobjekte statt vieler kleiner UI-Elemente
- Aussage muss ohne Untertitel grundsätzlich lesbar sein

## 2. Bildwelt — verständlicher Story-Moment statt trockener Illustration

V9 beschreibt **wie** das Bild aussieht. Die Bildidee kommt aus dem Sprechpunkt.

Die verbindliche Reihenfolge lautet:

```text
Sprechpunkt
→ was soll der Zuschauer in 1–2 Sekunden verstehen?
→ bekannte Figur und/oder bekannte Gegenstände wählen
→ daraus einen klaren sichtbaren Story-Moment bauen
→ wenn hilfreich: einfache, sofort verständliche Übertreibung oder Metapher
→ Komposition
→ V9-Rendering
```

### Zielbild

Jedes gute FinanzNeo-Bild soll sich wie ein **eingefrorener Frame aus einem hochwertigen 3D-Animationsfilm** anfühlen.

Nicht nur Dinge nebeneinanderstellen. Es soll eine kleine Situation passieren:

- eine Figur reagiert auf etwas,
- ein Gegenstand verursacht sichtbar eine Folge,
- mehrere bekannte Dinge konkurrieren um dasselbe Budget,
- eine kleine Sache wird über Zeit sichtbar groß,
- eine Verpflichtung zieht sich sichtbar in die Tiefe,
- ein Vorher/Nachher-Kontrast wird in einem Frame verständlich.

### Vertraute Anker

Bevorzugt werden bekannte Figuren und reale bzw. sofort erkennbare Dinge, zum Beispiel:

- Person / Familie / Kunde / Arbeitnehmer
- Rechnung / Kassenzettel / Gebührenbeleg
- Geld / Portemonnaie / Konto / Karte
- Smartphone / Vertrag / Kalender
- Fernseher / Sofa / Laptop / Auto / Einkauf
- Waschmaschine / Reparatur / Haushaltskosten
- Sparrate / Depotunterlagen / Bankkontakt

Die Szene darf bewusst übertrieben sein. Ein riesiger Kassenzettel hinter einem Fernseher ist erlaubt, weil die Bedeutung sofort verständlich ist. Eine lange Reihe kleiner Gebührenzettel darf in die Tiefe laufen, wenn sofort klar wird: **klein einzeln, groß über Zeit**.

### Metaphern — ausdrücklich erlaubt, wenn sie sofort lesbar sind

Eine gute Metapher ist **kein Rätsel**. Sie benutzt bekannte Dinge und eine bekannte Handlung.

Gute Richtung:

- kleiner Ratenzettel vorne, riesiger Gesamtkassenzettel dahinter
- mehrere Produkte ziehen gleichzeitig am selben Portemonnaie/Budget
- kleine wiederkehrende Gebührenzettel sammeln sich über Jahre zu einem großen Stapel
- eine Person läuft, während eine lange Reihe von Rechnungen sichtbar hinterherzieht

Schlechte Richtung:

- `capital body`
- `wealth tower`
- `value block`
- `investment block`
- `fee token`
- Fantasie-Klammer
- erfundene Finanzmaschine
- abstrakte geometrische Wertkörper ohne selbsterklärende reale Bedeutung

Die Regel lautet daher nicht **„nur literal“**, sondern:

```text
bekannt + sofort verständlich + visuelle Geschichte
```

Eine intuitive Metapher darf eine wörtliche Darstellung schlagen, wenn sie den Sprechpunkt schneller, klarer und unterhaltsamer erklärt.

## 3. Komposition — wie ein Animationsfilm-Frame

Bevorzugt:

- ein klares Hero-Motiv
- 3/4-Kamera oder räumlich gestaffelte Perspektive, wenn passend
- Vordergrund / Mittelgrund / Hintergrund für Tiefe
- große, gut lesbare Objekte
- Figur mit klarer Pose oder Reaktion, wenn sie die Szene verbessert
- starke visuelle Beziehung zwischen Hauptobjekten
- schwarzer Raum als Bühne, nicht als leere Fläche

Vermeiden:

- Corporate-3D-Stockfigur, die nur neben einem Gegenstand steht
- symmetrische Produktkatalog-Komposition
- isolierter Geldstapel + Schild ohne Handlung
- mehrere kleine Info-Karten
- Dashboard / App-UI / Flowchart
- dekorative Symbolsammlung
- zu viel leerer Raum ohne dramaturgische Funktion

## 4. Story-Moment-QA

Ein Bild besteht nur, wenn diese Fragen mit **Ja** beantwortet werden:

1. Versteht man in ungefähr 1–2 Sekunden, was hier passiert?
2. Tragen bekannte Figuren/Gegenstände die Bedeutung?
3. Gibt es eine sichtbare Beziehung, Handlung, Reaktion, Ursache/Wirkung oder Progression?
4. Würde die Szene auch ohne Untertitel grundsätzlich funktionieren?
5. Ist eine verwendete Metapher sofort intuitiv statt erklärungsbedürftig?
6. Sieht die Szene wie ein hochwertiger stylized-3D-Animationsfilm-Frame aus?
7. Ist sie spezifisch genug für genau diesen Sprechpunkt?

Wenn die Antwort nur lautet „sieht hübsch aus“, ist die Szene nicht gut genug.

## 5. Animationen — dieselbe Welt muss sich bewegen

Eine Animationsszene beginnt nicht bei einer vorhandenen Library-Komponente, sondern bei der Aussage.

```text
Sprechpunkt
→ sichtbares Verständnisziel
→ bekannte Figur/Gegenstände oder sofort verständlicher Story-Moment
→ Hauptmechanik
→ Finance Motion Library auf semantischen Fit prüfen
→ Same-World-Pass prüfen
→ direkter Library-Einsatz ODER Custom-Build
```

Die Finance Motion Library ist ein **Mechanik-Werkzeugkasten**, keine Art-Direction.

Direkter Library-Einsatz ist nur sinnvoll, wenn das Resultat sichtbar zur V9-Serie passt. Wenn eine Library-Komponente wie abstrakte Dashboard-/Infografik-Sprache oder erfundene Value-Geometrie wirkt, wird die Mechanik individuell in der FinanzNeo-Welt umgesetzt.

Auch Animationen dürfen intuitive Übertreibung und verständliche physische Metaphern benutzen, solange bekannte Dinge die Bedeutung tragen und die Handlung ohne Text lesbar bleibt.

## 6. Harte Layout-Grenze für animation.tsx

`animation.tsx` besitzt nur den visuellen Inhalt innerhalb der AnimationStage.

Nicht in einer Szenenanimation rendern:

- eigenen schwarzen Vollbild-Canvas
- lokalen `SceneShell`
- eigenen globalen Header
- eigene globale Caption
- dekorativen Hintergrund

Diese Ebenen gehören ausschließlich dem zentralen Reel-Layout.

Damit gibt es genau eine Instanz von:

- Canvas
- Header
- Caption
- Safe-Zone-Clipping

## 7. Google Flow — eine kanonische Ausführung

Der globale Reel-Vertrag bleibt `Strict Single Job V3`:

```text
genau ein Bildjob
→ auf Ergebnis warten
→ exakt umbenennen
→ QA
→ bei PASS nächstes Bild
```

Keine parallelen Jobs, kein Batch und keine Queue.

Branch- oder Reel-Experimente mit alternativen Cover-Gates, Referenzbildern oder Blockstopps sind **nicht automatisch globale Regeln**. Sie müssen separat evaluiert und ausdrücklich in den kanonischen Flow-Vertrag übernommen werden, bevor sie als Repo-Standard gelten.

## 8. Qualität wird nicht durch grünes CI bewiesen

CI prüft technische Verträge. Es beweist nicht allein, dass ein Bild oder eine Animation gut aussieht.

Vor einer globalen visuellen Promotion braucht es einen echten visuellen Test:

- reale Flow-Bilder statt Text-/Box-Platzhalter
- echte Animationen im finalen Reel-Layout
- representative Frames bzw. kompletter Test-Render
- Prüfung auf Verständlichkeit, Stilgleichheit, Größe, Leerräume, Story-Moment und Ursache→Wirkung

Ein technisch grüner Test mit Platzhalterbildern darf nicht als Beweis für die Bildwelt gelten.

## 9. Entscheidungsregel

Wenn zwei Regeln kollidieren, gewinnt für die visuelle Entscheidung:

```text
Verständlichkeit des Sprechpunkts
→ bekannte Figuren/Gegenstände
→ klarer Story-Moment
→ intuitive Übertreibung/Metapher, wenn sie besser erklärt
→ gleiche FinanzNeo-Welt
→ technische Wiederverwendung
```

Wiederverwendung ist nachgeordnet. Kein Library- oder Prompt-Baustein wird benutzt, wenn er die sichtbare Qualität verschlechtert.
