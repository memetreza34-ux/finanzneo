# FinanzNeo — Bild-QA-Checkliste V9

Diese Checkliste gilt für einzelne Google-Flow-Bilder und den gesamten Bildsatz. Bei Widerspruch gilt `CLAUDE.md`.

## 1. Satzgenauigkeit

- [ ] Bild erklärt exakt den zugehörigen gesprochenen Beat.
- [ ] Nur eine Hauptaussage/Hauptaktion.
- [ ] Aussage innerhalb ungefähr 1–2 Sekunden verständlich.
- [ ] Problem/Lösung nicht vertauscht.

## 2. V9-Bildwelt

- [ ] `finanzneo-stylized-3d-animated-black-v9` erkennbar.
- [ ] klar stylized 3D animated, nicht photorealistisch.
- [ ] soft rounded, vereinfachte erkennbare Details.
- [ ] hochwertige, saubere Materialien.
- [ ] keine Produktfoto-/Stockfoto-Optik.
- [ ] keine Dashboard-/App-UI-/Flowchart-/Diorama-Sprache.

## 3. Hintergrund — harter Pflichtpunkt

- [ ] genau ein nahtloser **deep-black** Hintergrund.
- [ ] Hintergrund clean und minimal.
- [ ] keine helle Studiowelt.
- [ ] keine Boden-Wand-Grenze.
- [ ] kein Horizont.
- [ ] keine farbigen Background-Zonen.
- [ ] keine Aurora/Grid/Partikel-/Glow-Hintergrundoptik.

**Sofort neu erzeugen**, wenn der Hintergrund nicht tiefschwarz und ruhig ist.

## 4. Komposition

- [ ] klares Hauptmotiv oder klare Hauptaktion.
- [ ] **keine feste Objektanzahl** erzwungen.
- [ ] jedes Support-Objekt verbessert die Erklärung.
- [ ] keine Props zum Auffüllen.
- [ ] Hauptmotiv groß genug für Smartphone.
- [ ] kein Clutter.
- [ ] kein kleines technisches Boxen-/Connector-Layout.

## 5. Farben und Licht

- [ ] Emerald nur für Fokus/positiv/bevorzugt.
- [ ] Ivory/Soft Gray für neutrale Information.
- [ ] Gold nur für Geld/Wert.
- [ ] Red-Orange nur für Warnung/Kosten/Verlust.
- [ ] klare Highlights und lesbare Schatten.
- [ ] Motiv trennt sich deutlich vom schwarzen Hintergrund.

## 6. Text und Labels

- [ ] keine große Headline.
- [ ] kein Untertitel.
- [ ] kein ganzer erklärender Satz.
- [ ] kein CTA.
- [ ] nur ausdrücklich erlaubte kurze deutsche Labels.
- [ ] Labels korrekt geschrieben und am passenden Objekt.
- [ ] keine zufälligen Zusatztexte.

## 7. Marken / Logos

Wenn relevant:

- [ ] Marke inhaltlich nötig.
- [ ] erkennbar, aber stilisiert in derselben 3D-Welt.
- [ ] kein flach aufgeklebtes Real-Logo.
- [ ] kein Website-/App-Screenshot.
- [ ] keine photorealistische Marken-UI.
- [ ] keine erfundene Partnerschaft/Empfehlung.

## 8. Format

- [ ] Quellbild `1:1`.
- [ ] Breite und Höhe identisch.
- [ ] kein Portrait/Hochformat als Flow-Quelle.
- [ ] wichtige Motive/Labels nicht am Rand abgeschnitten.

## 9. Remotion-Darstellung

- [ ] 1:1-Quellbild wird im 9:16-Reel mit `contain` dargestellt.
- [ ] keine unscharfe Kopie des Bildes als Hintergrund.
- [ ] zentraler Reel-Canvas bleibt statisch `#000000`.
- [ ] keine Partikel/Aurora/Grid/Glow/Vignette als Remotion-Hintergrund.
- [ ] Bild selbst ist im visuellen Kern sichtbar.
- [ ] Header/Caption allein zählen nicht als Bildvisual.

## 10. Timing und Caption

- [ ] Bildbeat ideal 3,5–5,5 s.
- [ ] absolut max. 6 s.
- [ ] Schnitt folgt finalem Audio.
- [ ] aktives Caption-Wort grün, Rest weiß.
- [ ] max. zwei Caption-Zeilen.
- [ ] kein Vorgreifen in die nächste Szene.

## 11. Bildsatz-QA

1. jedes Bild gegen seinen gesprochenen Beat prüfen.
2. deep-black Hintergrund bei jedem Bild prüfen.
3. V9-Stil und Clarity prüfen.
4. Labels/Marken prüfen.
5. gesamten Bildsatz als Kontaktbogen prüfen.
6. keine Szene darf sichtbar aus der V9-Welt fallen.
7. Anfang/Mitte/Ende jeder Bildszene im Render prüfen.
8. komplette MP4 mit Ton prüfen.

## Sofort neu erzeugen / korrigieren

- Hintergrund nicht tiefschwarz
- Realismus/Produktfoto
- UI/Dashboard/Flowchart
- Miniatur-Diorama
- unnötiger Clutter
- falsche Labels
- große Headline/Satz
- Screenshot-/Flat-Logo-Look
- Bildaussage passt nicht zum Satz
- Bildbeat >6 s

## Protokoll

```text
Bildsatz-QA: [FREIGEGEBEN / ÜBERARBEITEN / NEU ERSTELLEN]
V9-World-Lock: [BESTANDEN / NICHT BESTANDEN]
Deep-Black Background: [BESTANDEN / NICHT BESTANDEN]
Clarity 1–2 s: [BESTANDEN / NICHT BESTANDEN]
Labels/Marken: [BESTANDEN / NICHT BESTANDEN]
Satzgenauigkeit: [BESTANDEN / NICHT BESTANDEN]
Render-Sichtbarkeit: [BESTANDEN / NICHT BESTANDEN]
```
