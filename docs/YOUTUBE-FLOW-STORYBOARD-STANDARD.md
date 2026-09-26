# FinanzNeo — YouTube Flow Storyboard Standard

`FLOW_STORYBOARD_STANDARD: finanzneo-youtube-flow-storyboard-v1`

## Ziel

Google-Flow-Bilder sollen leicht verständlich, visuell unterhaltsam und als zusammenhängende FinanzNeo-Serie erkennbar sein. Ein Flow-Bild erklärt genau **einen** gesprochenen Hauptgedanken und fühlt sich wie ein eingefrorener Moment aus einer hochwertigen 3D-Animationsgeschichte an.

Die freigegebene Bildwelt bleibt unverändert:

`finanzneo-youtube-grounded-3d-black-v1`

## 1 Bild = 1 Gedanke

Für Flow-Visuals gilt standardmäßig:

- genau ein dominanter Sprechgedanke pro Bild;
- normalerweise **1–2 kurze Voiceover-Sätze pro Bild**;
- wenn ein Beat mehrere unabhängige Aussagen enthält, wird er in mehrere Visuals geteilt;
- ein Bild darf länger stehen, wenn die 1–2 Sätze weiterhin denselben Gedanken erklären.

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

## Feste Bildwelt, variable Inszenierung

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

## Phase A: Flow-Bild darf statisch erklärt werden

Phase A bleibt vollständig **ohne Animation**, darf ein Flow-Bild aber mit exakten statischen Remotion-Elementen ergänzen.

### `3d-story`

Flow-Bild trägt den Gedanken alleine. Remotion ergänzt nur das normale Szenenlayout mit Überschrift + Icon.

### `3d-explainer`

Flow-Bild erzählt weiterhin die eigentliche Szene. Zusätzlich dürfen statisch ergänzt werden:

- 1–3 kurze Labels;
- Pfeile;
- exakte Zahlen;
- eine kurze Gleichung;
- ein kompakter Vergleich;
- eine Markierung oder einfache Verbindungslinie.

Wenn so ein Overlay geplant ist, muss der Flow-Prompt **gezielt freie Fläche dafür reservieren**. Die freie Fläche wird szenenspezifisch festgelegt, z. B. rechts neben dem Hauptobjekt oder im oberen rechten Drittel. Sie darf nicht blind in jedem Bild an derselben Stelle liegen.

Wichtig:
- keine Überschrift oder Icon in Flow generieren;
- wichtige Erklärtexte und Zahlen nicht in Flow generieren;
- keine UI-Kartenwand über das Bild legen;
- Overlay nur verwenden, wenn es die Aussage wirklich schneller verständlich macht;
- Bildwelt selbst bleibt exakt dieselbe.

Beispiel für einen Prompt-Zusatz:

```text
COMPOSITION:
Place the main 3D story on the left two-thirds of the contained visual frame. Keep a clean, dark negative-space area on the right for one short exact number comparison that will be added later by the static video layout. Do not generate that text into the image.
```

## Wann gar kein Flow-Bild nötig ist

Wenn eine Zahl, Rechnung, ein Vergleich oder Mini-Chart den Sprechpunkt klarer erklärt als eine 3D-Szene, soll in Phase A ein statisches Remotion-Visual verwendet werden. Flow wird dann nicht künstlich erzwungen.

Beispiele:

```text
5 € × 20 = 100 €
```

```text
Gehalt     2.500 € → 3.000 €
Ausgaben   1.900 € → 2.400 €
```

Das ist weiterhin Phase A, solange sich nichts bewegt.

## Beschriftungen im Flow-Bild

Beschrifte nur wichtige physische Objekte, die ohne Text missverstanden werden könnten.

Beispiele: `Rechnung`, `Versicherung`, `Zinsen`, `Miete`, `Nebenkosten`, `Vertrag`, `Notar`, `Grundbuch`.

Regeln:

- kurze deutsche Wörter direkt physisch auf Dokument/Karte/Tag/Objekt;
- keine schwebenden UI-Labels;
- offensichtliche Objekte nicht beschriften;
- wichtige Beträge, Prozente und Vergleiche grundsätzlich im Video-Layout;
- ein Betrag darf nur im Flow-Bild stehen, wenn er natürlicher und wesentlicher Bestandteil des physischen Objekts ist und ausdrücklich geplant wurde.

## Google-Flow-Handoff mit mehreren Bildern

`04-visuals/alle-bildprompts.txt` ist **ein gemeinsamer Prompt/Handoff**, der mehrere fertige Bildblöcke enthalten darf.

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

Jeder Bildblock enthält mindestens:

1. `FINAL FILE NAME`
2. `VOICEOVER CONTEXT`
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

Der Bildblock muss **copy/paste-ready** für Google Flow sein.

## Szenenplanung

Für jeden Beat:

```text
1–2 kurze Sätze
→ genau ein Hauptgedanke
→ 3D-Story, 3D-Explainer, Static-Data oder echtes Asset?
→ wenn Flow: welche kleine visuelle Geschichte erklärt den Gedanken?
→ braucht die Szene später exakten Text/Zahl/Pfeil?
→ wenn ja: konkrete negative space im Flow-Prompt reservieren
→ welche 1–3 Objekte sind nötig?
→ welche Objekte brauchen kurze physische deutsche Labels?
→ welche Kamera/Komposition macht Ursache und Folge sofort sichtbar?
→ fertigen Flow-Prompt schreiben
```

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
9. wichtige Erklärzahlen nicht unnötig dem Bildgenerator überlassen wurden;
10. bei geplantem statischem Overlay die vereinbarte freie Fläche wirklich vorhanden ist;
11. das Bild horizontal 16:9 ist.

## Kurzregel

> **Ein Flow-Bild = ein Gedanke = meist 1–2 kurze Sätze = dieselbe FinanzNeo-3D-Welt. Phase A darf es statisch mit exakten Texten, Pfeilen oder Zahlen ergänzen, aber nie animieren.**
