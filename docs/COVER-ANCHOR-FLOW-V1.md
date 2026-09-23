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

## Phase A — nur Master Anchor erzeugen und dann STOPP

Die erste Szene wird besonders detailliert geplant. Sie muss die visuelle DNA festlegen:

- Formensprache / Abstraktionsgrad
- Charakter- und Gesichtssprache
- Raum-/Umgebungsdarstellung
- Materialien / Kanten / Oberflächen
- Lichtcharakter / Schatten
- Farbwirkung innerhalb der gesperrten FinanzNeo-Farbrollen
- Texturgrad / Detaildichte
- sichtbare Qualitätsmesslatte

Google Flow erzeugt zuerst **ausschließlich dieses eine Bild**:

`scene-01 erzeugen → warten → exakt umbenennen → gemeinsamer Bildordner → Pixel-/Vision-QA`

Danach gilt ein **harter manueller Nutzer-Gate**:

- Flow/Agent muss STOPPEN.
- Kein Folge-Bild darf erzeugt werden.
- Ein technischer QA-PASS allein reicht noch nicht zum Start der Folge-Bilder.
- Erst wenn der Nutzer das tatsächliche Bild ausdrücklich freigibt, z. B. mit **„sieht gut aus“**, **„passt“**, **„weiter“** oder einer gleichwertigen eindeutigen Zustimmung, wird `APPROVED_COVER_ANCHOR` gesetzt.
- Bei Ablehnung oder Änderungswunsch wird nur Bild 01 erneut erzeugt. Danach erneut auf Nutzerfreigabe warten.

Damit bedeutet `APPROVED_COVER_ANCHOR` immer:

`echtes Bild 01 vorhanden + QA bestanden + Nutzer ausdrücklich zufrieden`.

## Phase B — nach Nutzerfreigabe autonom in 5er-Arbeitsblöcken

Nach `APPROVED_COVER_ANCHOR` arbeitet Flow/Agent die restlichen Bildszenen **ohne weitere Nutzerbestätigung zwischen den einzelnen Bildern** ab.

Die nächsten benötigten Bildszenen werden in Gruppen von **maximal fünf** gemeinsam auf Rhythmus, Abwechslung und Konsistenz geplant.

Ein 5er-Arbeitsblock bedeutet:

1. bis zu fünf Folge-Bilder gemeinsam planen,
2. dann weiterhin technisch **ein Bild nach dem anderen** erzeugen,
3. jedes Ergebnis sofort exakt umbenennen und im gemeinsamen Ordner speichern,
4. interne Pixel-/Vision-QA ausführen,
5. bei FAIL dieselbe Bildnummer automatisch neu erzeugen,
6. bei PASS ohne Nutzerstopp zum nächsten Bild im Block gehen,
7. nach Abschluss des Blocks automatisch den nächsten maximalen 5er-Block beginnen,
8. fortsetzen, bis alle geplanten Bilder fertig sind.

Ausführung innerhalb eines Blocks:

`Bild → warten → umbenennen → QA → PASS → nächstes Bild`

Blockfolge bei genügend Bildern:

`Bild 02–06 → Bild 07–11 → Bild 12–16 → ...`

**Nur der Anchor zwischen Phase A und Phase B braucht die ausdrückliche Nutzerfreigabe.**

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

Nur das ausdrücklich vom Nutzer freigegebene Cover-/Anchor-Bild darf als persistente Generierungsreferenz verwendet werden.

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
- 5er-Arbeitsblock bedeutet Automatisierungs-/Planblock, nicht fünf parallele Generierungen.
- Keine Galerie, Collage, Kontaktbogen oder Mehrbild-Generierung.
- Creative Concept V1 bleibt frei: Einzelobjekt, Person, POV, reale Szene, Metapher, kontrollierte Fantasie usw.
- V5 Sequence-first / Hardening bleibt aktiv.
- Bestehende Projekte ohne diesen Contract bleiben Legacy-kompatibel.
- V9 wird durch diesen Contract nicht verändert.
