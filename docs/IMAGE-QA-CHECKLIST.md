# FinanzNeo — Bild-QA-Checkliste

Diese Checkliste gilt für einzelne Bilder und den gesamten Bildsatz. Bei Widerspruch gilt `CLAUDE.md`.

## 1. Satzgenauigkeit

- [ ] Bild erklärt exakt den zugehörigen gesprochenen Satz.
- [ ] Problem/Lösung werden nicht vertauscht.
- [ ] Aussage innerhalb einer Sekunde erkennbar.
- [ ] Nur eine Hauptaussage pro Bild.

## 2. Verbindlicher Bildstil

- [ ] Premium fintech editorial 3D render style.
- [ ] Deep charcoal green-black Grundwelt.
- [ ] Emerald/Mint-Akzente konsistent.
- [ ] Gold nur für Geld/Wert.
- [ ] Warmes Rot-Orange nur für Risiko/Verlust/Schulden.
- [ ] Smooth rounded geometry, soft bevelled edges.
- [ ] Eine starke Metapher / ein großes Hauptobjekt.
- [ ] Keine Miniatur-Dioramen, Game-Level, Neon-Tunnel oder Sci-Fi-Korridore.
- [ ] Same-World-Lock bestanden: Hintergrundmaterial, Lichtsignatur, Geometriesprache, Materialfinish und Farbrollen stimmen mit dem restlichen Bildsatz überein.

## 3. Hintergrund — kritischer Pflichtpunkt

- [ ] Genau EIN nahtloser Hintergrund von oben bis unten.
- [ ] Gleicher Material-/Ton-/Gradient-Verlauf über das ganze Bild.
- [ ] Keine horizontale Trennlinie.
- [ ] Kein anderes oberes oder unteres Band.
- [ ] Keine separaten Zonen/Panels.
- [ ] Keine sichtbare Boden-Wand-Grenze.
- [ ] Kein sichtbarer Horizont/Studio-Split.
- [ ] Freie Fläche oberhalb/unterhalb des Motivs entsteht natürlich, ohne Hintergrundwechsel.

**Sofort neu erzeugen:** zwei Hintergründe, Tonwertband, Boden-Wand-Kante oder sichtbare horizontale Zone.

## 4. Person

Wenn eine Person vorkommt:

- [ ] Gesicht klar sichtbar.
- [ ] Augen, Nase und Mund stilisiert erkennbar.
- [ ] frontal oder natürliche 3/4-Ansicht.
- [ ] keine reale identifizierbare Person.
- [ ] keine gesichtslose/blanke Figur.
- [ ] keine reine Rückenansicht.

## 5. Text und Labels

- [ ] Keine große Überschrift im KI-Bild.
- [ ] Kein Untertitel.
- [ ] Kein ganzer erklärender Satz.
- [ ] Nur explizit erlaubte kurze deutsche Objektlabels.
- [ ] Labels korrekt geschrieben.
- [ ] Labels direkt am passenden Objekt.
- [ ] Keine zufälligen Zusatztexte/Fantasiewörter.

## 6. Marken

Wenn Marken verwendet werden:

- [ ] Marke ist inhaltlich relevant.
- [ ] Name korrekt geschrieben.
- [ ] keine erfundene Partnerschaft/Empfehlung suggeriert.
- [ ] keine unnötige Marken-Deko.

## 7. Komposition

- [ ] vertical 9:16.
- [ ] Hauptmotiv groß und smartphone-lesbar.
- [ ] wenige große unterstützende Elemente.
- [ ] natürlicher freier Raum oberhalb und unterhalb.
- [ ] keine Prozent-Zonen im Prompt oder sichtbare Zonen im Ergebnis.
- [ ] keine Dashboard-/Mini-Panel-Komposition.

## 8. Remotion-Darstellung

- [ ] Bild mit `contain`.
- [ ] keine unscharfe Bildkopie als sichtbarer Hintergrund.
- [ ] Source-Crop oben höchstens 0.20.
- [ ] Source-Crop unten höchstens 0.20.
- [ ] Gesamt-Crop höchstens 0.34.
- [ ] zusätzliche Skalierung höchstens 1.04.
- [ ] kein Motiv/Label abgeschnitten.

## 9. Timing und Untertitel

- [ ] Bildwechsel am Beginn des zugehörigen Satzes.
- [ ] genau ein vollständiger Untertitelsatz sichtbar.
- [ ] aktuelles Wort grün, Rest weiß.
- [ ] maximal zwei Zeilen.
- [ ] keine Caption-Lücken.

## 10. Freigabeablauf

1. Einzelbild gegen Satz prüfen.
2. Hintergrund explizit auf horizontale Bänder/Zonen prüfen.
3. Person/Gesicht prüfen.
4. Labels prüfen.
5. alle Bilder als Kontaktbogen prüfen.
6. Same-World-Konsistenz des gesamten Kontaktbogens prüfen.
7. Anfang/Mitte/Ende jeder Bildszene im Render prüfen.
8. komplette MP4 mit Ton ansehen.

## Sofort neu erzeugen

- zwei sichtbare Hintergründe/Bänder
- Boden-Wand-Grenze/Horizont
- gesichtslose oder abgewandte Person
- falsche/zusätzliche Labels
- große Headline oder Satz
- Diorama/Game-Level
- falsche Farbwelt
- Bildaussage passt nicht zum Satz

## Protokoll

```text
Bildsatz-QA: [FREIGEGEBEN / ÜBERARBEITEN / NEU ERSTELLEN]
Same-World-Lock: [BESTANDEN / NICHT BESTANDEN]
Seamless Background: [BESTANDEN / NICHT BESTANDEN]
Gesicht: [BESTANDEN / NICHT BESTANDEN / NICHT RELEVANT]
Labels: [BESTANDEN / NICHT BESTANDEN]
Satzgenauigkeit: [BESTANDEN / NICHT BESTANDEN]
Render-Crops: [BESTANDEN / NICHT BESTANDEN]
```
