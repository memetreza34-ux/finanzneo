# FinanzNeo — YouTube Flow Storyboard Standard

`FLOW_STORYBOARD_STANDARD: finanzneo-youtube-flow-storyboard-v1`

## Ziel

Google-Flow-Bilder sollen leicht verständlich, visuell unterhaltsam und als zusammenhängende FinanzNeo-Serie erkennbar sein. Ein Flow-Bild erklärt genau **einen** gesprochenen Hauptgedanken und fühlt sich wie ein eingefrorener Moment aus einer hochwertigen 3D-Animationsgeschichte an.

## 1 Bild = 1 Gedanke

Für Flow-Visuals gilt standardmäßig:

- genau ein dominanter Sprechgedanke pro Bild;
- normalerweise **1–2 kurze Voiceover-Sätze pro Bild**;
- wenn ein Beat mehrere unabhängige Aussagen enthält, wird er in mehrere Visuals geteilt;
- ein Bild darf länger stehen, wenn die 1–2 Sätze weiterhin denselben Gedanken erklären;
- die Regel ist inhaltlich, nicht mechanisch: ein sehr kurzer Halbsatz kann mit dem Nachbarsatz zusammengehören, aber fünf unterschiedliche Aussagen dürfen nicht in ein Flow-Bild gepresst werden.

Prüffrage:

> Kann ich den Inhalt dieses Bildes in einem kurzen Satz zusammenfassen?

Wenn nein, Beat teilen.

## Visual Storytelling statt Produktkatalog

Simple-first bedeutet wenige Elemente und schnelle Verständlichkeit. Es bedeutet nicht langweilige Inszenierung.

Jedes Flow-Bild braucht eine sichtbare Beziehung zwischen den wichtigen Elementen, zum Beispiel:

- etwas zieht, drückt, blockiert oder schützt etwas anderes;
- etwas wächst, stapelt sich oder wird schwerer;
- etwas wickelt sich um ein anderes Objekt;
- eine Kette oder räumliche Progression zeigt Entwicklung;
- etwas öffnet sich und legt versteckte Kosten frei;
- Ursache und Folge liegen auf einer klaren visuellen Achse;
- ein reales Umfeld erzählt die Situation besser als schwebende Objekte.

Verbotener Default:

- Objekt + Dokument + Objekt ordentlich auf einem Tisch;
- zentrierter Produktshot mit Finanz-Props;
- symmetrische Katalog-Anordnung;
- schwebende Gegenstände ohne sichtbare Ursache/Wirkung;
- dieselbe erfolgreiche Komposition in jeder Szene wiederholen.

Tisch, Boden, Raum oder frei schwebende Objekte sind erlaubt, aber nur wenn sie den jeweiligen Sprechpunkt besser erzählen.

## Feste Bildwelt, variable Inszenierung

Alle Flow-Bilder verwenden:

`finanzneo-youtube-grounded-3d-black-v1`

Konstant bleiben:

- premium stylized 3D animation-film rendering;
- tiefe schwarze FinanzNeo-Welt;
- hochwertige semi-realistische, sichtbar stilisierte Materialien;
- weiches Premium-Studio-Licht;
- Emerald Green für positiv/Wert/Lösung;
- warmes Rot-Orange für Kosten/Risiko/Problem;
- Ivory/Grau für neutrale Objekte;
- 16:9 horizontal.

Variieren dürfen und sollen:

- Kamerawinkel;
- Vorder-/Mittel-/Hintergrund;
- physische Storytelling-Mechanik;
- lokale Umgebung;
- Objektpositionen;
- Bewegungsrichtung im Standbild;
- Lichtakzente, soweit semantisch sinnvoll.

## Beschriftungen

Beschrifte nur wichtige Objekte, die ohne Text missverstanden werden könnten.

Beispiele: `Rechnung`, `Versicherung`, `Zinsen`, `Miete`, `Nebenkosten`, `Vertrag`, `Notar`, `Grundbuch`.

Regeln:

- kurze deutsche Wörter direkt physisch auf Dokument/Karte/Tag/Objekt;
- keine schwebenden UI-Labels;
- offensichtliche Objekte nicht beschriften;
- wichtige Beträge, Prozente und Vergleiche grundsätzlich in Remotion;
- ein Betrag darf nur im Flow-Bild stehen, wenn er natürlicher und wesentlicher Bestandteil des physischen Objekts ist und ausdrücklich geplant wurde.

## Google-Flow-Handoff mit mehreren Bildern

`04-visuals/alle-bildprompts.txt` ist **ein gemeinsamer Prompt/Handoff**, der mehrere fertige Bildblöcke enthalten darf.

Das bedeutet nicht parallele Generierung.

Flow arbeitet weiterhin strikt sequenziell:

```text
BILD 01 erzeugen
→ vollständig warten
→ exakt umbenennen
→ QA
→ bei Fehler BILD 01 erneut erzeugen
→ erst nach PASS zu BILD 02
→ usw.
```

Ein realer Handoff kann z. B. 3, 5, 10 oder mehr Bildblöcke enthalten. Es gibt keine feste Batchgröße. Die Anzahl folgt dem Skript.

Jeder Bildblock enthält mindestens:

1. `FINAL FILE NAME`
2. `VOICEOVER CONTEXT` — normalerweise 1–2 kurze Sätze
3. `SCENE`
4. `IMPORTANT GERMAN OBJECT LABELS`
5. `OBJECTS`
6. `VISUAL STORYTELLING`
7. `COMPOSITION`
8. `MATERIALS`
9. `BACKGROUND`
10. `LIGHTING`
11. `COLOR LANGUAGE`
12. `TEXT`
13. `FORBIDDEN`

Der Bildblock muss **copy/paste-ready** für Google Flow sein. Keine abstrakten Platzhalter oder generische Masterprompt-Sätze in einer finalen Produktion.

## Szenenplanung

Für jeden Beat:

```text
1–2 kurze Sätze
→ genau ein Hauptgedanke
→ muss Flow wirklich verwendet werden?
→ wenn ja: welche kleine visuelle Geschichte erklärt den Gedanken?
→ welche 1–3 Objekte sind nötig?
→ welche Objekte brauchen kurze deutsche Labels?
→ welche Kamera/Komposition macht Ursache und Folge sofort sichtbar?
→ fertigen Flow-Prompt schreiben
```

Wenn Remotion, ein Chart, Text oder ein echtes Asset den Punkt besser erklärt, wird kein Flow-Bild erzwungen.

## QA

Ein Flow-Bild besteht nur, wenn:

1. es genau einen dominanten Gedanken trägt;
2. der zugehörige Voiceover-Beat normalerweise nicht mehr als 1–2 kurze Sätze enthält;
3. die Aussage in etwa 1–2 Sekunden erfassbar ist;
4. die premium stylized 3D FinanzNeo-Welt eindeutig erkennbar ist;
5. wichtige Objekte groß genug sind;
6. unklare Finanzobjekte bei Bedarf kurz auf Deutsch beschriftet sind;
7. eine sinnvolle visuelle Beziehung/Story zwischen den Elementen besteht;
8. das Bild nicht wie ein statischer Produktkatalog aussieht;
9. die Inszenierung nicht nur deshalb wiederholt wurde, weil sie vorher funktioniert hat;
10. wichtige Erklärzahlen nicht unnötig dem Bildgenerator überlassen wurden;
11. das Bild horizontal 16:9 ist.

## Kurzregel

> **Ein Flow-Bild = ein Gedanke = meist 1–2 kurze Sätze = eine kleine visuelle Geschichte in derselben FinanzNeo-3D-Welt.**
