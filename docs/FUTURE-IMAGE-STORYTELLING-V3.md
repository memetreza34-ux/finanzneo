# FinanzNeo Future Image Storytelling V3

Contract: `finanzneo-image-storytelling-v3`

Aktuelle Revision für neue Reels:

```text
VISUAL_FORM_REVISION: finanzneo-free-visual-form-v1
FREE_VISUAL_FORM_POLICY: Form frei, Bildwelt fest.
```

Bestehende ältere Reels bleiben rückwärtskompatibel. Neue Reels wählen pro Sprechbeat frei die stärkste Darstellungsform.

## Kernregel

**Form frei, Bildwelt fest.**

Der Sprechbeat entscheidet, ob ein Mensch, ein Objekt, ein Vergleich, ein echtes Chart/Diagramm, ein Editorial-/Zitatbild, eine Illustration, eine Metapher oder eine Kombination davon am besten erklärt.

Es gibt keine Pflichtquote und keinen Zwang zu Menschen oder realen Alltagsszenen.

## Erlaubte VISUAL_FORM-Werte

- `character-story`
- `object-story`
- `comparison`
- `chart`
- `diagram`
- `editorial-quote`
- `illustration`
- `metaphor`
- `hybrid`

## Pflichtfelder vor Google Flow

Jede Bildszene dokumentiert identisch in `bildprompt.txt` und `scene-index.json`:

- `VISUAL_FORM`
- `VISUAL_CONCEPT`
- `VOICEOVER_VISUAL_MATCH`
- `INSTANT_READ_TEST: PASS - ...`
- `TRANSFERABILITY_TEST: PASS - ...`
- `DATA_INTEGRITY_TEST`

Für `chart` und `diagram` muss `DATA_INTEGRITY_TEST` mit `PASS` beginnen und konkret bestätigen, dass Werte, Proportionen, Achsen/Skalen/Labels und Aussage fachlich zusammenpassen.

Für alle anderen Formen gilt exakt:

```text
DATA_INTEGRITY_TEST: not-applicable
```

## Chart / Diagram — echte Datenvisualisierung

Ein Chart bleibt ein echtes Chart.

- Linien-/Balkendiagramme erhalten echte Achsen, Skalen und Labels, wenn der Diagrammtyp sie fachlich braucht.
- Kreis-/Donutdiagramme erhalten keine künstlichen X-/Y-Achsen.
- Werte und Proportionen müssen korrekt sein.
- 3D-Tiefe, physische Achsen, volumetrische Balken, hochwertige Materialien und Licht sind erlaubt, solange die Datenlogik nicht verfälscht wird.

**POWERPOINT-/EXCEL-DEFAULT ist verboten.** Keine langweiligen Standardbalken, dünnen Defaultachsen oder flachen Corporate-Infografik-Templates als finale Bildwelt.

## Andere Formen

### Character story
Eine Figur wird nur verwendet, wenn Pose, Reaktion oder Handlung die Aussage wirklich trägt. Keine Corporate-Stock-Figur als Dekoration.

### Object story
Ein oder wenige starke Objekte dürfen die komplette Aussage tragen, wenn sie sofort verständlich sind.

### Comparison
A-vs-B kann symmetrisch, räumlich oder editorial inszeniert werden. Der Unterschied muss sofort lesbar sein.

### Editorial / Quote
Kurze starke Typografie darf Hauptmotiv sein und als physisches 3D-/Illustrationselement in der FinanzNeo-Welt stehen.

### Illustration / Metapher
Freie Illustration und intuitive Metaphern sind ausdrücklich erlaubt. Sie dürfen kein Rätsel werden. Erfundenes `capital body`, `wealth tower`, `value block`, `investment block` oder `fee token` ist keine automatische Standardsprache.

### Hybrid
Kombinationen sind erlaubt, z. B. Figur + echtes Chart, Objekt + Diagramm, Zitat + Metapher oder Vergleich + Datenvisualisierung.

## QA

Ein Bild besteht nur, wenn:

1. die Aussage in ca. 1–2 Sekunden erkennbar ist,
2. es exakt zum Sprechbeat passt,
3. es nicht generisch zu fünf anderen Finanzthemen passt,
4. Chart-/Diagrammdaten fachlich korrekt sind,
5. es sichtbar zur selben FinanzNeo-V9-Serie gehört.

## Bildwelt bleibt fest

- `finanzneo-stylized-3d-animated-black-v9`
- 1:1 Google-Flow-Bilder
- Deep Black
- premium stylized 3D / hochwertige FinanzNeo-Illustrationssprache
- starke Tiefe, Licht und Materialqualität
- Emerald = positiv/Wachstum
- Gold = Geld/Wert
- Warm Red-Orange = Kosten/Warnung
- kein Fotorealismus
- kein billiger Corporate-/Stock-/PowerPoint-Look

Die frühere Phase-A-DNA bleibt Qualitätsreferenz für Licht, Tiefe, Kamera und hochwertige 3D-Inszenierung, begrenzt aber nicht die Darstellungsform.
