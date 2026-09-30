# Google Flow 5er-Workflow + Cover-Style-Referenz V1

Diese Regel gilt für neue FinanzNeo-Reels mit Google-Flow-Bildszenen.

## Ziel

Bildwelt-Konsistenz ohne unkontrolliertes Bild-zu-Bild-Kopieren:

1. zuerst 3 Cover-Varianten,
2. Nutzer wählt A/B/C,
3. nur das gewählte Cover wird zum finalen Bild 01 / Cover,
4. dieses eine Bild stabilisiert den visuellen Stil der restlichen Flow-Bilder,
5. restliche Bilder werden in Arbeitsblöcken zu maximal 5 Bildern erstellt,
6. innerhalb jedes Blocks bleibt immer genau 1 Bildjob gleichzeitig aktiv.

## Cover-Gate

Vor der Nutzerentscheidung dürfen keine normalen Szenenbilder erzeugt werden.

Die drei Cover-Varianten müssen:
- dasselbe Reel-Thema zeigen,
- sichtbaren Cover-Text enthalten,
- drei deutlich unterschiedliche Kompositionen besitzen,
- dieselbe V9-Welt verwenden,
- 1:1 sein,
- tiefschwarzen Hintergrund verwenden.

Nach A/B/C-Auswahl:
- gewählte Variante exakt zum finalen Bild-01-Dateinamen umbenennen,
- nicht gewählte Varianten nicht als Produktionsassets verwenden,
- gewähltes Cover als einzige visuelle Style-Referenz für die restlichen Bilder nutzen.

## Erlaubte Referenz-Nutzung

Das gewählte Cover darf ausschließlich stabilisieren:
- Materialgefühl,
- 3D-Formensprache,
- Beleuchtung,
- Kontrast,
- Farbcharakter,
- Kameragefühl,
- Render-Look.

Es darf NICHT kopiert werden:
- Cover-Text,
- Cover-Layout,
- konkrete Objektanordnung,
- Motivinhalt, wenn der aktuelle Szenenprompt etwas anderes verlangt.

Jede Szene bleibt eine frische, individuell geschriebene Komposition.

## 5er-Blöcke

`BLOCKGRÖSSE = 5` bedeutet NICHT fünf gleichzeitige Generierungen.

Pflicht innerhalb jedes Blocks:
1. genau ein Bild starten,
2. vollständig auf Ergebnis warten,
3. V9-Look + Motiv + Labels + deep-black prüfen,
4. exakt umbenennen,
5. erst dann das nächste Bild starten.

`MAX_CONCURRENT_GENERATIONS = 1` bleibt immer verbindlich.

Nach maximal fünf fertigen Bildern muss der Flow-Agent stoppen und auf Nutzerfreigabe warten, bevor der nächste Block beginnt.

## Animationen

Animationsszenen bleiben als Szenennummer reserviert und werden in Flow ausdrücklich als `KEIN BILD XX` markiert.

## Zentrale Übergabe

`03-szenen/alle-bildprompts.txt` ist die einzige operative Flow-Übergabedatei und muss enthalten:
- 3 Cover-Varianten,
- Nutzerwahl-Gate,
- Cover-Style-Referenz-Regel,
- 5er-Blöcke,
- alle individuellen `bildprompt.txt` vollständig,
- alle reservierten Animationsnummern.

Der harte Validator `scripts/validate-central-flow-prompts.mjs` muss diese Struktur ablehnen, sobald einer dieser Teile fehlt.
