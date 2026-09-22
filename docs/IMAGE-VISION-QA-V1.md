# FinanzNeo Image Vision QA V1

CONTRACT_ID: `finanzneo-image-vision-qa-v1`

Diese Stufe prüft **nach Google Flow die tatsächlich erzeugte Bilddatei**. Sie ersetzt weder V9 noch V5-Hardening, sondern schließt die Lücke zwischen geplantem Prompt und real zurückgegebenen Pixeln.

## Harte Grenze

Die Node-Skripte selbst sind **kein Computer-Vision-Modell**. Semantische Aussagen wie „Kamera ist Low Angle“, „Szene wirkt wie generischer Schreibtisch“ oder „Handlung ist sofort verständlich“ dürfen nur von einem **multimodalen Evaluator** stammen, der die echte Bilddatei geöffnet und visuell geprüft hat.

Ein Prompt-, Metadaten- oder Dateinamen-Review allein ist **kein Pixel-QA-PASS**.

## Produktionsreihenfolge

```text
Google Flow: genau eine IMAGE-Szene erzeugen
→ Datei exakt umbenennen
→ Datei in 03-szenen/00-ALLE-BILDER-HIER-REIN/ ablegen
→ npm run reel:image-vision:prepare -- <Reel-Pfad> --scene scene-XX
→ multimodaler Evaluator öffnet die echte Bilddatei
→ Ergebnis nach resultSchema schreiben
→ npm run reel:image-vision:validate -- <Reel-Pfad> --scene scene-XX
→ PASS: nächste IMAGE-Szene darf freigeschaltet werden
→ REGENERATE: exakt dieselbe scene-XX / Bildnummer neu erzeugen
```

## SHA-256-Bindung

`prepare-image-vision-qa.mjs` berechnet den SHA-256-Hash der aktuellen Bilddatei. Request und Result müssen exakt auf diesen Hash zeigen.

Wird das Bild neu erzeugt oder ersetzt, ändert sich der Hash. Ein alter PASS wird damit automatisch ungültig und die Szene muss erneut visuell geprüft werden.

## Geprüfte Dimensionen

Jede IMAGE-Szene erhält Scores von 0–100 für:

- `planAlignment` — passt das echte Bild zum geplanten Sprechbeat und zur Regie?
- `cameraCompliance` — entsprechen Kamera und Shot Scale dem Plan?
- `actionReadability` — ist die sichtbare Handlung/Ursache-Wirkung klar?
- `hookStrength` — erzeugt das Bild sofort Interesse? Für scene-01/Cover gilt ein höherer Mindestwert.
- `visualInterest` — ist die Szene visuell stark statt statisch/generisch?
- `worldConsistency` — bleibt das Bild klar in V9: stylized 3D, Deep Black, nicht fotorealistisch?
- `compositionClarity` — klare Hierarchie, Hauptmotiv und verständliche Komposition?
- `sequenceNovelty` — unterscheidet sich das Bild ausreichend von den bereits erzeugten Bildern?

Mindestwerte werden zentral in `scripts/lib/image-vision-qa.mjs` definiert.

## Hard-Fail-Flags

Folgende sichtbare Fehler erzwingen `REGENERATE`:

- `photorealistic`
- `genericFinanceIconMain`
- `staticCatalogLike`
- `wrongBackground`
- `headlineOrSentenceInsideImage`
- `labelBudgetExceeded`
- `sceneMismatch`

Zusätzlich werden `genericDeskScene` und `deadSpaceDominant` streng bewertet. Sie dürfen nicht durch hohe generische Durchschnittswerte kaschiert werden.

## Evidenzpflicht

Ein Result braucht mindestens drei konkrete Beobachtungen aus den tatsächlichen Pixeln. Beispiele:

- „Die Kamera liegt sichtbar unterhalb des Hauptmotivs; Unterseite des Einkaufswagens dominiert die Perspektive.“
- „Die Rechnung kippt aus der Hand in Richtung roter Kostenfläche; Ursache und Konsequenz sind im selben Frame sichtbar.“
- „Der Hintergrund ist nahtlos tiefschwarz; Materialien und Figuren bleiben klar stilisiert statt fotografisch.“

Nicht ausreichend:

- „Prompt sieht gut aus.“
- „Sollte passen.“
- „V5 ist ausgefüllt.“

## Sequenzvergleich

Der Request enthält die Hashes der zu diesem Zeitpunkt bereits vorhandenen anderen Bilder. Der multimodale Evaluator darf diese Bilder **nur für QA/Variety vergleichen**, niemals als Generierungsreferenz an Flow übergeben.

Der Result-Report muss dieselben Vergleichshashes nennen. Ändert sich ein Vergleichsbild, wird ein alter Sequenzvergleich ungültig.

## Phase-3-Gate

Für neue gehärtete V5-Reels ruft `reel:ready` die Pixel-Vision-QA zwingend auf. Phase 3 startet nicht, wenn:

- ein Request fehlt,
- ein Result fehlt,
- der Bildhash nicht mehr passt,
- der multimodale Modus fehlt,
- konkrete Evidenz fehlt,
- Mindestwerte unterschritten werden,
- ein Hard-Fail aktiv ist,
- der Report `REGENERATE` verlangt.

Legacy-Reels ohne `finanzneo-image-storytelling-v5-hardening-v1` werden dadurch nicht rückwirkend migriert.

## Was diese Stufe bewusst nicht ändert

- V9-Bildwelt
- Deep Black
- Farbrollen und Materiallogik
- 1:1-Flow-Quellbilder
- Strict-Single-Job
- vorhandene Legacy-Reels
- bestehende Nutzerbilder ohne ausdrückliche Migration
