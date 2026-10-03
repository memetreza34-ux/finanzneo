# FinanzNeo — YouTube-Longform-Produktionsstandard V4

> Aktiver Standard für neue FinanzNeo-YouTube-Videos. Bei Konflikten gilt zusätzlich `CLAUDE.md`. Neue Reels sind pausiert; YouTube Shorts sind verboten.

## Format

- eigenständiges YouTube-Longform-Video
- 1920 × 1080, horizontal 16:9, 30 fps
- Länge folgt dem Thema
- Hook ohne langes Intro
- einfache Sprache für Finanzanfänger
- Daten, Annahmen und Rechenwege prüfbar

## Grundprinzip

`FORM FREI — BILDWELT FEST — ENGINE PASSEND`

Für jeden Sprechbeat werden **zuerst Aussage und benötigte Präzision**, danach **das richtige Werkzeug** und erst danach die konkrete Gestaltung gewählt.

Nicht jeder Beat braucht ein Google-Flow-Bild. Nicht jeder Beat braucht komplexes 3D. Nicht jedes einfache Visual darf künstlich zu einem 3D-Panel gemacht werden.

---

# 1. Engine-Routing — verbindlich

## Remotion / SVG / React bevorzugen

Diese Visuals werden standardmäßig **code-basiert** gebaut:

- exakte Zahlen und Rechenaufteilungen
- Charts, Graphen und Datenverläufe
- Checklisten
- UI-/Settings-Ansichten
- Timelines
- Quotes / Key Statements
- text- oder datengetriebene Vergleiche
- einfache Symbole/Icons, wenn sie sauber in Code darstellbar sind
- Visuals, bei denen korrekte Typografie/Geometrie wichtiger ist als generierte Materialität

Warum: Zahlen, Text, Achsen und UI-Zustände müssen exakt sein. Google Flow soll dafür keine künstlichen Tiles, Dashboards oder fehlerhaften KI-Texte erzeugen.

## Google Flow verwenden

Flow ist für **physical / editorial / real-life scenes** gedacht:

- greifbare reale Objekte
- Alltagssituationen
- physische Ursache/Wirkung
- dokumentarisch-editoriale Objektmetaphern
- Szenen, bei denen Materialien, Licht, räumliche Tiefe und echte Gegenstände den Inhalt besser erklären als Code

Beispiele: Kreditkarte + echte Abrechnung, Rechnung + Kostenstempel, Vertrag + konkrete Klausel, Einkauf + Beleg, physische Waage, reale Dokument-/Objektsituation.

## Hybrid

Hybrid nur dann, wenn ein echtes Flow-Quellbild einen klaren Vorteil hat und Remotion danach eine sinnvolle Veränderung darauf ausführt. UI, Charts und reine Zahlengrafiken sind **kein Grund** für Hybrid.

---

# 2. Google-Flow-Bildwelt

`YOUTUBE_VISUAL_WORLD_LOCK: finanzneo-youtube-v9-front-readable-v2`

Primärer genehmigter Stilanker:

`finanzneo-premium-physical-editorial-v8`

Grounding-Referenz:

`finanzneo-youtube-grounded-3d-black-v1`

Kanonische Datei:

`config/finanzneo-image-worlds/finanzneo-youtube-v9-front-readable-v2.txt`

## Nicht verhandelbare Flow-Komposition

Jedes normale Flow-Szenenbild braucht:

1. **ein dominantes physisches Hero-Objekt**, ungefähr 45–65 % der nutzbaren Bildfläche
2. medium-close, sanfte 3/4-Editorial-Kamera als Standard
3. höchstens wenige unterstützende Objekte, nur wenn sie die Aussage verbessern
4. sichtbare Materialstärke, Kanten und Gewicht
5. klare Vordergrund-/Hero-/Sekundärtiefe
6. weiche Kontaktschatten und Ambient Occlusion
7. eine Aussage, die in etwa 1–2 Sekunden verstanden wird
8. keinen überwiegend leeren schwarzen Frame

## Material- und Farbwelt

- Premium stylized adult 3D financial editorial
- Deep charcoal green-black dominant
- Dark emerald/charcoal für Struktur
- Warm ivory/cream für neutrale Flächen, Papier und Information
- Red-orange nur für Risiko, Kosten, Verlust oder Schuld
- Emerald für positive/Lösungszustände
- Gold/Brass nur als kleiner Geld-/Wert-Akzent
- hochwertige Polymer-, Papier-, Metall-, Keramik- oder Glasmaterialien, wenn passend
- sichtbare Dicke, weiche Bevels, glaubwürdige Reflexionen
- cinematic soft key light + readable fill + kontrollierte Rim-Separation

## Flow Hard-Fail

Sofort verwerfen und denselben Job neu generieren bei:

- kleinem Motiv in riesiger schwarzer Leere
- mehreren kleinen schwebenden Tiles/Karten/Modulen
- Dashboard-/Control-Panel-Look
- Screenshot-/App-UI-Look
- Flowchart-/Präsentationsfolien-Look
- steriler Produktaufnahme ohne erklärende Handlung
- winziger isometrischer/Diorama-Kamera
- Canva-/PowerPoint-/Stock-Vector-/Icon-Look
- fehlender Tiefenhierarchie oder fehlenden Kontaktschatten
- childish clay/toy/Pixar
- Fotorealismus
- generischer Gold-Luxus-Finanz-KI
- richtigen Farben, aber falscher Physical-Editorial-Komposition

---

# 3. Einfache Erklärvisuals

Einfache Visuals sind ausdrücklich erwünscht, wenn sie schneller erklären:

- große Zahl
- einzelnes Symbol
- Balken-/Linienchart
- Zielscheibe / Weg / Berg / Zielmetapher
- Asset-Gruppe
- Konzept-Cluster
- UI-Einstellung
- kurze Aussage / Quote

**Wichtig:** Einfach bezieht sich auf die **Komposition**, nicht auf ein bestimmtes Generierungswerkzeug.

- Zahl/Chart/UI/Quote/Checklist → meist Remotion
- physische Objektmetapher / reale Szene → meist Flow

So können Visuals ähnlich klar und reduziert sein wie gute Finance-Erklärkanäle, ohne die FinanzNeo-Identität zu verlieren.

---

# 4. Prompt-Struktur

Alle nutzerseitigen und internen Bildprompt-Dateien liegen unter:

`04-visuals/01-BILDPROMPTS/`

Der Nutzer kopiert ausschließlich:

`04-visuals/01-BILDPROMPTS/GOOGLE-FLOW-PROMPT.txt`

Interne Bildpromptquellen, Bildwelt und Thumbnail-Prompt liegen im selben Ordnerbereich. Bildprompts werden nicht lose im Projekt-Root und nicht zwischen Remotion-Dateien verteilt.

---

# 5. Google Flow — Ausführung

`FLOW_EXECUTION_MODE: finanzneo-youtube-cover3-image5-parallel-v4`

## Phase A — Cover

1. Exakt drei Kandidaten A/B/C als drei getrennte Ein-Bild-Jobs gleichzeitig starten.
2. Alle nutzen direkt dieselbe V9/V8-anchored Bildwelt.
3. Unterschiedliche Kompositionen, aber dieselbe Welt.
4. Kurzer deutscher Hook, maximal 2 Zeilen, ideal 2–5 Wörter.
5. Alle drei QA-prüfen.
6. Danach genau einmal A/B/C vom Nutzer wählen lassen.
7. Nur den Gewinner final übernehmen.
8. Der Gewinner wird niemals Style-Referenz für Szenenbilder.

## Phase B — Szenenbilder

Nur Beats, die nach dem Engine-Routing tatsächlich **Flow-Bilder** sind, werden generiert.

- bis zu fünf getrennte Ein-Bild-Jobs parallel
- niemals ein Multi-Image-Request
- jedes Ergebnis sofort exakt umbenennen
- jedes Ergebnis sofort QA-prüfen
- bei Fehler nur dieselbe Bildnummer neu generieren
- nächster Batch erst, wenn der aktuelle Batch vollständig PASS ist
- keine weitere Nutzerfreigabe zwischen Batches
- finaler Inventory-QA

---

# 6. Motion V3

`MOTION_STANDARD: finanzneo-youtube-motion-v3`

- mindestens zwei echte Motion-/Animationsvisuals pro Projekt
- keine starre Obergrenze oder Quote
- Viewer Change zuerst, Technik danach
- produktionsreife `animation.tsx` bereits in Phase 1
- Custom React, SVG, CSS 3D, Canvas, Three.js/R3F und Datenvisualisierung erlaubt
- bestehende Komponenten sind Werkzeuge, keine Stilpflicht
- Variation muss in echter Kamera/Layout/Transformation bestehen, nicht nur in neuen Namen
- Motion nutzt dieselbe FinanzNeo-Farb-/Typografie-/Premium-Logik

Ein normales YouTube-Projekt darf keine reine Slideshow sein.

---

# 7. Kamera für präzise Code-Visuals

Charts, Daten, UI und Typografie bleiben frontal und unverzerrt:

- gerade Achsen
- korrekte Skalen
- mathematisch korrekte Werte
- lesbare Labels
- keine schrägen Datenebenen
- keine Perspektivverzerrung, wenn Genauigkeit darunter leidet

Flow-Szenen dürfen dagegen eine sanfte 3/4-Editorial-Kamera verwenden, wenn dadurch physische Tiefe entsteht.

---

# 8. Audio und Timing

- genau ein finales Voiceover in `03-audio/`
- echte Wort-Zeitstempel
- Schnitte folgen Sprache, Visual Beats und Kapiteln
- keine pauschal gleich langen Visuals
- Untertitel satzweise; aktives Wort grün, Rest weiß
- Audioziel ca. -16 LUFS, True Peak max. -1 dBTP

---

# 9. Publishing

`05-publishing/` enthält Titelvarianten, finalen Titel, Beschreibung, Kapitel, Keywords/Tags, Hashtags, Thumbnail-Brief, Quellen/Disclaimer, Pinned Comment, Community-Post, Upload-Checkliste und Social-Promo-Texte.

---

# 10. Startfreigabe

```bash
npm run youtube:validate -- youtube/<Projekt>
npm run youtube:animation:validate -- youtube/<Projekt>
npm run youtube:phase1:seal -- youtube/<Projekt>
npm run youtube:ready -- youtube/<Projekt>
```

Nur ein erfolgreicher Lauf gibt Phase 3 frei.
