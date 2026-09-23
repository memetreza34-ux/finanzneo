# FinanzNeo Cover Anchor Flow V1

Contract: `finanzneo-cover-anchor-flow-v1`

## Ziel

Die erste bildbasierte Szene eines Reels oder Videos ist nicht nur Bild 1, sondern die **visuelle Master-Referenz** der gesamten Produktion.

Für Reels gilt:
- `scene-01` = erste Szene = Cover = Master Visual Anchor.
- Kein separates Bild 00.

Für YouTube-Longform gilt:
- `visual-01` = erster bildbasierter Video-Beat = Master Visual Anchor.
- Das Publishing-Thumbnail bleibt ein separates Asset, darf aber erst nach Freigabe des Anchors dessen Art Direction übernehmen.

## Phase A — Master Anchor zuerst

Die erste Szene wird besonders detailliert geplant. Sie muss die visuelle DNA festlegen:

- Formensprache / Abstraktionsgrad
- Charakter- und Gesichtssprache
- Raum-/Umgebungsdarstellung
- Materialien / Kanten / Oberflächen
- Lichtcharakter / Schatten
- Farbwirkung innerhalb der gesperrten FinanzNeo-Farbrollen
- Texturgrad / Detaildichte
- sichtbare Qualitätsmesslatte

Google Flow erzeugt zuerst ausschließlich dieses eine Bild. Danach:

`Ergebnis → exakt umbenennen → gemeinsamer Bildordner → echte Pixel-/Vision-QA → PASS`

Erst ein bestandener Anchor darf als Referenz für Folge-Bilder verwendet werden.

## Phase B — Folge-Bilder in 5er-Planblöcken

Nach dem Anchor werden die nächsten benötigten Bildszenen in Gruppen von **maximal fünf** gemeinsam aufeinander abgestimmt.

Das ist **keine Batch-Generierung**.

Ein 5er-Planblock bedeutet nur:
- die nächsten bis zu fünf Konzepte zusammen auf Rhythmus und Konsistenz planen,
- danach jedes Bild strikt einzeln erzeugen.

Ausführung:

`Bild → warten → umbenennen → QA → PASS → nächstes Bild`

Nach maximal fünf bestandenen Folge-Bildern beginnt der nächste Planblock.

## Referenzregel

Bei jedem Folge-Bild muss die freigegebene erste Szene als direkte visuelle Referenz/Vorlage verwendet werden.

Die Referenz steuert:
- Art Direction
- Charakterdesign-Sprache
- Abstraktionsgrad
- Geometrie
- Materialien
- Texturen
- Lichtcharakter
- Farbbehandlung
- Environment Rendering
- Black-World-Integration
- Finish-Qualität

Sie steuert **nicht** automatisch:
- Motiv
- Story
- Kamera
- Komposition
- Pose
- Requisiten

Diese Punkte kommen weiterhin aus dem individuellen Szenenprompt. Folge-Bilder dürfen also deutlich anders aussehen und trotzdem eindeutig derselben visuellen Welt angehören.

## Einzige persistente Generierungsreferenz

Nur das freigegebene Cover-/Anchor-Bild darf als persistente Generierungsreferenz verwendet werden.

Andere bereits erzeugte Bilder werden nur für QA, Near-Duplicate-Erkennung und Sequenz-Neuheit betrachtet. Dadurch entsteht keine schleichende Stilkopie von Szene zu Szene.

## Gemeinsamer Ausgabeordner

Reels:

`03-szenen/00-ALLE-BILDER-HIER-REIN/`

YouTube:

Der im Projekt unter `googleFlow.finalCollectionDirectory` definierte gemeinsame Bildordner.

Jede Datei wird unmittelbar nach ihrer Generierung exakt umbenannt und dort abgelegt. Kein Sammelumbenennen am Ende.

## Pixel-/Vision-QA

Bei Reels wird ein Folge-Bild zusätzlich gegen die echten aktuellen Pixel des Anchors geprüft.

Zusätzlicher Score:
- `anchorConsistency` — Mindestwert 85/100

Zusätzliche Hard-Fails:
- `anchorDrift` — Bild wirkt wie eine andere Art Direction / andere Serie
- `anchorContentCopy` — Bild kopiert nur Motiv oder Komposition des Covers statt die eigene Szene umzusetzen

Damit bedeutet Konsistenz nicht Gleichförmigkeit.

## Unverändert

- Google Flow bleibt **Strict Single Job** (`Strict-Single-Job`): maximal ein laufender Bildjob gleichzeitig.
- Keine Galerie, Collage, Kontaktbogen oder Mehrbild-Generierung.
- Creative Concept V1 bleibt frei: Einzelobjekt, Person, POV, reale Szene, Metapher, kontrollierte Fantasie usw.
- V5 Sequence-first / Hardening bleibt aktiv.
- Bestehende Projekte ohne diesen Contract bleiben Legacy-kompatibel.
- V9 wird durch diesen Contract nicht verändert.