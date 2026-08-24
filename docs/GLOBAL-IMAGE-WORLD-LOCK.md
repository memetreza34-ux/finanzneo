# Globaler FinanzNeo Image-World-Lock

Für neue Reel-Quellbilder gilt ein globaler, maschinenlesbarer Bildwelt-Lock.
Er erweitert die bestehende FinanzNeo-V4-Welt und ersetzt sie nicht.

## Kanonische Bildwelt

- Basiswelt: `finanzneo-connected-studio-v3`
- Same-World-Lock: `finanzneo-same-world-v1`
- Stylized-3D-Lock: `finanzneo-stylized-3d-editorial-v5`
- Physical-Explainer-Lock: `finanzneo-physical-explainer-editorial-v7`
- Lock-Datei: `config/finanzneo-image-world-lock.json`
- Weltdefinition: `config/finanzneo-image-worlds/finanzneo-physical-explainer-editorial-v7.txt`

## Format

Alle Google-Flow-Quellbilder für Reels sind strikt `1:1`, einschließlich `Bild 00`.
Das finale Reel bleibt `9:16`; die vertikale Komposition entsteht erst in Remotion.

## Physical Explainer

Jedes neue Flow-Bild braucht:
- ein großes physisches Hero-Objekt
- 3–6 erkennbare, themenspezifische physische Alltagsobjekte
- natürliche asymmetrische Anordnung
- Überlappung, Tiefe und Kontakt-Schatten
- physische kurze Tags/Schilder/Sticker statt schwebender UI-Chips

Verboten sind insbesondere Dashboard/UI-, Microchip/Circuit-Board-, Gameboard-, Orbit-, Vier-Ecken-Tile-, Liniennetz-, Monolith- und sterile Produktwerbe-Kompositionen.

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

Der maschinenlesbare Vertrag heißt `finanzneo-flow-strict-single-job-v3` und wird durch `scripts/validate-flow-autonomous-contract.mjs` geprüft.

## Prüfung

```bash
npm run validate:image-world
npm run reel:validate -- <Reel-Pfad>
```

Neue Reels werden über `npm run reel:create` erstellt. Der Wrapper setzt den Strict-Single-Job-Lock automatisch und rollt das neu angelegte Reel zurück, falls die Lock-Anwendung fehlschlägt.
