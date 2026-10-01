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

## 2. Bilder — Story zuerst, Rendering danach

V9 beschreibt **wie** das Bild aussieht, nicht **was** die Erklärung ist.

Reihenfolge:

```text
Sprechpunkt
→ konkrete reale Situation / Finanzhandlung
→ sichtbare Ursache und Wirkung
→ Komposition
→ V9-Rendering
```

Bevorzugte Anker sind erkennbare Dinge und Handlungen, z. B. Rechnung, Überweisung, Konto, Karte, Sparrate, Kalender, Vertrag, Einkauf, Reparatur oder Zahlung.

Nicht als automatische Standardsprache:

- `capital body`
- `wealth tower`
- `value block`
- `investment block`
- `fee token`
- isolierte abstrakte Wertkörper
- generische Tresor-/Münz-/Pfeil-Kompositionen

Solche Abstraktionen sind nur als bewusst begründete Metapher erlaubt.

Die frühere YouTube-Phase-A-Arbeit darf als **Qualitätsreferenz** für Modellierung, Licht, Tiefe, Kamera und Story-Moment dienen. Sie ist kein separater Reel-Vertrag.

## 3. Animationen — dieselbe Welt muss sich bewegen

Eine Animationsszene beginnt nicht bei einer vorhandenen Library-Komponente, sondern bei der Aussage.

```text
Sprechpunkt
→ was muss sichtbar verstanden werden?
→ reale/erkennbare Ausgangssituation
→ Mechanik
→ Finance Motion Library auf semantischen Fit prüfen
→ Same-World-Pass prüfen
→ direkter Library-Einsatz ODER Custom-Build
```

Die Finance Motion Library ist ein **Mechanik-Werkzeugkasten**, keine Art-Direction.

Direkter Library-Einsatz ist nur sinnvoll, wenn das Resultat sichtbar zur V9-Serie passt. Wenn eine Library-Komponente wie abstrakte Dashboard-/Infografik-Sprache wirkt, wird die Mechanik individuell in der FinanzNeo-Welt umgesetzt.

## 4. Harte Layout-Grenze für animation.tsx

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

## 5. Google Flow — eine kanonische Ausführung

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

## 6. Qualität wird nicht durch grünes CI bewiesen

CI prüft technische Verträge. Es beweist nicht allein, dass ein Bild oder eine Animation gut aussieht.

Vor einer globalen visuellen Promotion braucht es einen echten visuellen Test:

- reale Flow-Bilder statt Text-/Box-Platzhalter
- echte Animationen im finalen Reel-Layout
- representative Frames bzw. kompletter Test-Render
- Prüfung auf Verständlichkeit, Stilgleichheit, Größe, Leerräume und Ursache→Wirkung

Ein technisch grüner Test mit Platzhalterbildern darf nicht als Beweis für die Bildwelt gelten.

## 7. Entscheidungsregel

Wenn zwei Regeln kollidieren, gewinnt für die visuelle Entscheidung:

```text
Verständlichkeit des Sprechpunkts
→ erkennbare konkrete Situation
→ gleiche FinanzNeo-Welt
→ klare Ursache/Wirkung
→ technische Wiederverwendung
```

Wiederverwendung ist nachgeordnet. Kein Library- oder Prompt-Baustein wird benutzt, wenn er die sichtbare Qualität verschlechtert.
