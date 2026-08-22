# FinanzNeo — verbindliches Bildsystem

Dieses Dokument definiert das Bildsystem für neue FinanzNeo-Reels. Bei Widerspruch gilt `CLAUDE.md`.

Verbindlicher Stilanker:

- World ID: `finanzneo-connected-studio-v3`
- Series Lock ID: `finanzneo-same-world-v1`
- Physical Explainer Lock: `finanzneo-physical-explainer-v4`
- Google-Flow-Quellbildformat: immer `1:1`
- Visual Timing & Clarity Standard: `docs/FINANZNEO-VISUAL-TIMING-AND-CLARITY-STANDARD.md`

## Ziel

Jedes Bild erklärt genau eine Aussage durch eine klare physische Szene:

```text
Ausgangspunkt → sichtbare Veränderung → verständliches Ergebnis
```

## Höchste neue Regel: Physical Explainer statt Fintech-UI

FinanzNeo-Bilder sind **premium stylized 3D financial editorial explainers aus erkennbaren physischen Gegenständen**.

Der Begriff `finance` darf von Google Flow NICHT als Software, Dashboard, App, Kontrollpanel oder digitale Produktoberfläche interpretiert werden.

### Verbindliche Komposition

- EIN großes erkennbares physisches Hauptobjekt
- wenige konkrete themenspezifische physische Nebenobjekte
- natürliche asymmetrische Anordnung
- leichte Überlappung
- Vorder-/Mittelgrund-Tiefe
- lokale weiche Kontakt-Schatten
- Kamera frontal oder natürliche sanfte 3/4-Ansicht
- Ergebnis wirkt wie ein hochwertiges Editorial-Stillleben, NICHT wie ein Interface

Gute Objektarten:

- Papierkalender
- Quittung / Kontoauszug / Vertrag
- Ordner / Umschlag
- Lupe
- physische Waage
- Euro-Münzen / Geldscheine
- Einkaufskorb
- Kopfhörer
- Smartphone als physischer Gegenstand mit dunklem/abgewandtem Screen
- SIM-Verpackung
- Mitgliedschafts-Key-Fob
- physische Preisschilder

## Hart verbotener Screenshot-Fehlermodus

Sofort neu erzeugen bei:

- digitalem Dashboard oder App-UI
- zentralem rechteckigem Board / Tablet / Screen / Panel
- mehreren gleichartigen rechteckigen Karten, Kacheln oder Blöcken als Bildsprache
- Floating Cards, Chips, Buttons, Badges oder Widgets
- Microchip-/Circuitboard-Look
- kreisförmigem Orbit oder Ring aus Modulen
- zwölf Slots in einem Mechanismus
- Gameboard-/Boardgame-Komposition
- mechanischem Prüf-Gate / Conveyor-Board
- Neon-Verbindungslinien, Rails, Röhren, Tracks oder abstrakten Finanzströmen
- Vier-Ecken-Modulaufbau
- winziger isometrischer Diorama-Perspektive
- sterilem Produkt-Sockel / leerer Produktwerbung

## Visueller Stil

- Premium stylized 3D financial editorial illustration
- deep charcoal green-black Grundwelt
- Emerald/Mint sparsam als Rim-Light und Strukturakzent, NICHT als leuchtende UI-Kontur
- Gold nur für Geld/Wert
- warmes Rot-Orange nur für Risiko/Verlust/unerwünschte Kosten
- matte Papier-, gebürstete Metall-, Glas- und hochwertige Kunststoffmaterialien
- substantial objects statt abstrakter Icons
- cinematic soft key light
- reale lokale Kontakt-Schatten
- zurückhaltendes smaragdgrünes Rim Light
- nicht fotorealistisch, kein Pixar/Clay/Toy-Look

## Same-World ohne Kompositionskopie

Das Cover `Bild 00` darf **nicht als Image-to-Image-/Bildreferenz hochgeladen oder angehängt werden**.

Stattdessen wird in jedem einzelnen Prompt derselbe ausgeschriebene Text-Lock für:

- Hintergrund
- Material
- Farbrollen
- Geometrie
- Licht
- Kontrast

wiederholt.

So bleibt die Welt konsistent, ohne dass Flow die Cover-Perspektive, Board-Form, Objektanordnung oder Silhouette in alle Szenen kopiert.

## Hintergrund — verbindlich nahtlos

Keine Prozent-Zonen verwenden.

```text
Use ONE single seamless continuous deep charcoal green-black background across the entire square 1:1 image.
Keep the same continuous material, tone and gradient from top edge to bottom edge.
No horizontal divisions, no top/bottom sections, no bands, no floor-wall boundary, no horizon line, no panels.
Use only one subtle continuous gradient/vignette.
Do not create a visible floor, wall or studio horizon.
Objects may cast soft local contact shadows.
```

## Personen

Wenn eine Person vorkommt:

- stilisierte erwachsene 3D-Person
- Gesicht klar sichtbar
- Augen, Nase und Mund erkennbar
- frontal oder natürliche 3/4-Ansicht
- keine gesichtslose Figur
- keine reine Rückenansicht
- keine reale/identifizierbare Person

Eine Person ist optional; physische Gegenstände dürfen die Erklärung allein tragen.

## Text im KI-Bild

Erlaubt:

- nur explizit vorgegebene kurze deutsche Objektlabels
- normalerweise 1–3 Wörter
- physisch auf Papier-Tags, Stickern, Quittungen oder kleinen befestigten Plaketten

Verboten:

- Headline
- Untertitel
- ganzer Satz
- CTA
- zufällige Zusatztexte
- floating/glowing labels
- digitale Badges / UI-Chips

## Timing, Dynamik und Verständlichkeit

Für alle neuen Bildszenen gilt zusätzlich der verbindliche Standard `docs/FINANZNEO-VISUAL-TIMING-AND-CLARITY-STANDARD.md`.

- Bildszenen ideal: **3,5–5,5 Sekunden**
- Bildszenen maximal: **6,0 Sekunden**
- Animationsszenen ideal: **4,5–7,0 Sekunden**
- wenn ein Bild länger als 6 Sekunden bräuchte: **splitten oder animieren**
- jede Bildszene hat genau **eine Hauptaussage**
- Hauptaussage muss in **unter 2 Sekunden** erkennbar sein
- Alltagssituation statt abstrakter Interpretation
- 2–5 unterstützende Alltagsobjekte statt sterilem Stillleben
- kurze Labels/Fragen/Preise erlaubt, **keine Sätze**
- Bilder sollen lebendig wirken: umgeblätterte Seiten, aufgefaltete Belege, Überschneidungen, direkte Objektbeziehungen, sichtbare Ursache-Wirkung

## Darstellung in Remotion

- 1:1-Quellbild im 9:16-Reel
- `object-fit: contain`
- keine sichtbare unscharfe Kopie desselben Bildes als Hintergrund
- Source-Crop oben höchstens `0.20`
- Source-Crop unten höchstens `0.20`
- Source-Crop insgesamt höchstens `0.34`
- zusätzliche Skalierung höchstens `1.04`
- Motive und Labels nie abschneiden

## Pflichtinhalt eines neuen Bildprompts

1. finaler Google-Flow-Dateiname
2. konkrete erlaubte deutsche Labels
3. konkrete physische Haupt-/Nebenobjekte statt abstrakter Metapher allein
4. sichtbarer Ursache-Wirkungs-Zusammenhang
5. Physical-Explainer-Lock
6. nahtloser Hintergrund
7. Personenregel
8. harter UI-/Board-/Diorama-Negativblock
9. Anweisung: `Bild 00` NICHT als Bildreferenz verwenden
10. Ziel: in unter 2 Sekunden verständlich und nicht länger als 6 Sekunden nötig

## Google-Flow-QA

Nach jedem Bild prüfen:

- erkennt man echte physische Gegenstände sofort?
- wirkt die Szene wie Editorial-Illustration statt UI?
- keine zentrale Platte / kein Board / kein Screen?
- keine Kachel-/Block-/Modulstruktur?
- keine isometrische Gameboard-Perspektive?
- Labels physisch statt schwebend?
- 1:1 und nahtloser Hintergrund?
- Hauptaussage in unter 2 Sekunden verständlich?
- braucht das Bild höchstens 6 Sekunden Bildschirmzeit?
- ist die Szene lebendig genug und nicht wie sterile Produktwerbung?

Wenn eine Antwort falsch ist: dieselbe Bildnummer neu erzeugen, erst danach fortfahren.
