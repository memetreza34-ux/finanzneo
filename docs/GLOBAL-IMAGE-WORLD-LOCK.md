# Globaler FinanzNeo Image-World-Lock

Für neue Reel-Quellbilder gilt ein globaler, maschinenlesbarer Premium-Bildwelt-Lock.
Die bisherige dunkle UI-/Flowchart-Anmutung ist ausdrücklich **nicht mehr die Zielwelt**.

## Kanonische Bildwelt

- Basiswelt: `finanzneo-connected-studio-v3`
- Same-World-Lock: `finanzneo-same-world-v1`
- Stylized-3D-Lock: `finanzneo-stylized-3d-editorial-v5`
- Premium-Physical-Lock: `finanzneo-premium-physical-editorial-v8`
- Lock-Datei: `config/finanzneo-image-world-lock.json`
- Weltdefinition: `config/finanzneo-image-worlds/finanzneo-premium-physical-editorial-v8.txt`

## Format

Alle Google-Flow-Quellbilder für Reels sind strikt `1:1`, einschließlich `Bild 00`.
Das finale Reel bleibt `9:16`; die vertikale Komposition entsteht erst in Remotion.

## Premium Physical Editorial V8

Jedes neue Flow-Bild braucht:

- **ein dominantes physisches Hero-Objekt**, ungefähr 45–65 % der nutzbaren Komposition
- nur **2–4** unterstützende konkrete Objekte
- medium-close 3/4-Kamera statt kleiner isometrischer Gesamtansicht
- starke Silhouette und klare Vordergrund-/Hero-/Hintergrundstaffelung
- sichtbare Dicke, Bevels, Materialkanten und Gewicht
- Kontakt-Schatten und Ambient-Occlusion-Eindruck
- cinematic key/rim lighting mit lesbarer Schattenseite
- mindestens drei Material-/Farbrollen: dunkle Struktur + Creme/Weiß + semantischer Akzent

Materialrollen:

- Struktur: satin dark-emerald anodized metal / Premium-Polymer
- Neutral: warmes Ivory/Creme, Keramik-/Steinwirkung
- Geld/Wert: gebürstetes Messing / Gold
- Warnung/Kosten: warmes Rot-Orange
- Glas: nur zurückhaltend als Sekundärmaterial

## Was ausdrücklich nicht mehr erlaubt ist

Als Hauptsprache verboten:

- Dashboard / Control Panel
- Flowchart
- kleine Kästen mit dünnen Verbindungslinien
- schwebende UI-Cards, Pills, Chips oder Widgets
- generische rechteckige Info-Karten als Hauptobjekte
- monochrom-grüne Gesamtkomposition
- Vier-Ecken-/Orbit-/Gameboard-Layouts
- Microchip-/Circuit-Board-Metaphern
- tiny isometric dioramas
- leerer schwarzer Raum mit kleinem Objekt
- flache Poster-Komposition
- sterile Produktwerbung ohne erklärende Handlung

Ein echtes Gerät wie ATM oder Kartenterminal ist erlaubt, wenn es das **physische Hero-Objekt** des Themas ist. Das Bild darf dadurch aber nicht zu einem UI-Mockup werden.

## Qualitätsregel

Ein Bild wird verworfen und neu erzeugt, wenn:

- das Hero-Objekt zu klein ist
- die Szene wie UI/Dashboard/Flowchart liest
- zu viele kleine Nebenobjekte konkurrieren
- zu viel dunkler Leerraum bleibt
- Objekte flach oder gewichtslos wirken
- Materialkontrast oder Tiefenstaffelung fehlen
- das Bild fast nur grün ist
- die Aussage nur über Textlabels verständlich wird

## Google Flow: Strict Single-Job State Machine

Autonom bedeutet **nicht Batch**.

Für jedes Bildset gilt zwingend:
1. Maximal ein laufender Bildgenerierungsjob (`concurrency = 1`).
2. Nur der aktuelle Bildblock ist ausführbar; alle späteren Bildblöcke bleiben gesperrt.
3. Der aktuelle Bildjob muss vollständig zurückgegeben werden.
4. Danach wird genau diese Datei sofort exakt umbenannt.
5. Danach folgt QA ausschließlich für dieses Bild.
6. Erst nach bestandener QA wird der nächste benötigte Bildblock freigeschaltet.
7. Bei QA-Fehler bleibt derselbe Schritt aktiv und nur dieselbe Bildnummer wird neu erzeugt.
8. Keine Nutzer-Zwischenfreigabe und kein `Weiter?`.

Hart verboten:
- mehrere Bilder in einem Generierungsaufruf
- mehrere Bildprompts in einem Bildjob
- parallele Generierung
- Queueing späterer Bilder
- alle Bilder zuerst erzeugen und anschließend gesammelt umbenennen
- Kontaktbogen, Galerie, Collage oder Multi-Panel als Ersatz für Einzelbilder

Der Ablaufvertrag heißt `finanzneo-flow-strict-single-job-v3`.

## Prüfung

```bash
npm run validate:image-world
npm run reel:validate -- <Reel-Pfad>
```

Neue Reels werden ausschließlich über `npm run reel:create` erstellt. Dieser Wrapper wendet automatisch Premium Visual V8 und Premium Physical Animation V2 an.
