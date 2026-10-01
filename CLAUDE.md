# FinanzNeo — verbindliches Projekt-Gehirn

> Höchste interne Quelle für Reel-Produktion. Bei Widersprüchen mit älteren Dateien gilt diese Datei. `docs/VISUAL-SYSTEM-CONSOLIDATION-V1.md` präzisiert die gemeinsame Bild-/Animationssprache, ohne eine neue Bildwelt einzuführen. Für neue Reels mit `futureProductionStandard.id = finanzneo-future-production-v3` gelten zusätzlich die Future-V3-Gates.

## 1. Kanal und Format

- Kanal: **FinanzNeo**
- Sprache: Deutsch
- Ziel: Finanzgrundlagen einfach, professionell und verständlich erklären
- Reel-Plattformen: TikTok, Instagram Reels, Facebook Reels, Snapchat
- YouTube ausschließlich Longform unter `youtube/`; keine YouTube Shorts
- Reel: 1080×1920, 9:16, 30 fps
- Länge ergibt sich aus Inhalt und finalem Voiceover; typische Anfänger-Reels ca. 45–70 s

## 2. Repository-Sicherheit

- nie direkt auf `main` arbeiten
- neuer Auftrag = eigener Branch
- bestehende Reels nur ändern, wenn sie ausdrücklich Ziel des Auftrags sind
- kein Merge, Force-Push, History-Rewrite oder Löschen ohne ausdrückliche Nutzerfreigabe
- Validatoren/Gates nie abschwächen, nur damit CI grün wird
- technischer Erfolg darf niemals mit Platzhaltern oder visueller Minderqualität erkauft werden

## 3. Drei Phasen

### Phase 1 — ChatGPT

Phase 1 liefert vollständig:

- Recherche + Quellen
- geprüftes Voiceover-Skript
- Dramaturgie und Szenenplan
- Bild-/Animations-Zuordnung
- individuelle Google-Flow-Prompts
- natürliche Header + Icons
- Remotion-Spezifikationen
- produktionsreife `animation.tsx` für jede Animationsszene
- eine universelle Social-Caption

Phase 1 ist erst fertig, wenn keine kreativen Lücken/Platzhalter mehr offen sind.

### Phase 2 — Nutzer

- erzeugt finale Szenenbilder mit Google Flow
- `scene-01` ist automatisch das Cover; kein separates `Bild 00`
- legt alle finalen Bilder exakt benannt in `03-szenen/00-ALLE-BILDER-HIER-REIN/`
- legt genau ein finales Voiceover in `02-audio/`
- erzeugt echte Wort-Zeitstempel
- Agenten ersetzen Bilder oder Voiceover nicht eigenmächtig

### Phase 3 — Antigravity oder Claude Code

`scene-index.json -> phase3Executor` bestimmt den Executor.

Phase 3 darf:

- finale Nutzerbilder integrieren
- versiegelten Phase-1-Animationscode verwenden
- Timeline, Header und Captions integrieren
- freigegebene SFX framegenau integrieren
- Playwright Visual QA, Preflight, Candidate-Render, Render-QA und Export ausführen

Phase 3 darf versiegelte Animationen nicht kreativ ersetzen, vereinfachen oder neu erfinden.

## 4. Reel-Struktur

Cover-Regel: `scene-01` ist immer Bildszene und Cover. `03-szenen/00-cover/cover.txt` ist nur technischer Alias auf diese Szene.

```text
01-script/
02-audio/
03-szenen/
04-caption/
05-projektdateien/
06-export/
README.md
```

Animationsszene:

```text
03-szenen/EINZELNE-SZENEN/scene-XX/
├── szene.md
├── remotion.md
└── animation.tsx
```

Bildszene:

```text
03-szenen/EINZELNE-SZENEN/scene-XX/
├── szene.md
└── bildprompt.txt
```

## 5. Dramaturgie und Visual Beats

- Hook in den ersten 2 Sekunden
- keine feste Szenenzahl
- 1 gesprochener Gedanke = 1 sichtbarer Visual Beat
- Voiceover und Visual müssen gemeinsam fortschreiten
- neue Future-V3-Bildbeats ideal ca. 1,8–3,0 s; ohne neue sichtbare Information hart max. 4,0 s
- Animationen dürfen länger sein, müssen aber mehrere klar unterschiedliche Zustände zeigen
- ca. 60 % Bild / 40 % Animation ist nur Richtwert
- echte Wort-Zeitstempel bestimmen finale Schnitte
- Logik: Hook → Problem → Erklärung → Beispiel → Lösung/Merksatz
- Zahlen prüfen; Annahmen kennzeichnen

## 6. Bildwelt — Stylized 3D Animated Black V9

Verbindlich:

```text
FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
FINANZNEO_SERIES_LOCK: finanzneo-same-world-v1
PREMIUM_VISUAL_WORLD_LOCK: finanzneo-stylized-3d-animated-black-v9
GENERATED_IMAGE_ASPECT_RATIO: 1:1
STORY_MOMENT_REVISION: finanzneo-readable-story-moment-v1
```

### Kernregel

V9 beschreibt **die Rendering-Welt**, nicht die Erklärung.

Die Bildidee folgt verbindlich dieser Reihenfolge:

```text
Sprechpunkt
→ was soll in 1–2 Sekunden verstanden werden?
→ bekannte Figur und/oder bekannte Gegenstände
→ klarer sichtbarer Story-Moment
→ intuitive Übertreibung/Metapher, wenn sie besser erklärt
→ Komposition
→ V9-Rendering
```

Das Ziel ist ein **eingefrorener Frame aus einem hochwertigen 3D-Animationsfilm**, nicht eine trockene Finanzillustration und nicht eine Sammlung hübscher Symbole.

Pflicht:

- klar stylized 3D, niemals fotorealistisch
- premium Animation-Film-Qualität
- bekannte Figuren/Gegenstände tragen die Bedeutung
- sichtbare Handlung, Reaktion, Ursache/Wirkung, Konflikt oder Progression
- hochwertige Materialien, Licht, Tiefe und Kontaktschatten
- tiefschwarze ruhige Bühne
- wichtige Gegenstände groß und sofort lesbar
- gleiche Welt über das gesamte Reel
- Zuschauer soll die Aussage in ca. 1–2 Sekunden auch ohne Ton verstehen

Bevorzugte bekannte Anker:

- Person / Familie / Kunde / Arbeitnehmer
- Rechnung / Kassenzettel / Gebührenbeleg
- Geld / Portemonnaie / Konto / Karte
- Smartphone / Vertrag / Kalender
- Fernseher / Sofa / Laptop / Auto / Einkauf
- Waschmaschine / Reparatur / Haushaltskosten
- Sparrate / Depotunterlagen / Bankkontakt

Menschen sind optional, dürfen aber ausdrücklich Hauptträger der Szene sein. Wenn eine Figur vorkommt, muss Pose, Reaktion oder Handlung die Aussage mittragen. Eine generische Corporate-3D-Figur, die nur neben einem Objekt steht, ist keine gute Szene.

### Intuitive Metaphern und Übertreibung

Metaphern sind **ausdrücklich erlaubt** und dürfen eine literal Darstellung schlagen, wenn sie schneller und klarer erklären.

Gute Richtung:

- kleiner Ratenzettel vorne, riesiger realer Kassenzettel dahinter
- mehrere bekannte Produkte ziehen gleichzeitig am selben Budget/Portemonnaie
- kleine Gebührenzettel sammeln sich sichtbar über viele Jahre zu einem großen Stapel
- eine Figur läuft, während eine lange Reihe von Rechnungen sichtbar hinterherzieht

Die Metapher darf kein Rätsel sein. Bekannte Dinge müssen die Bedeutung tragen.

Nicht als automatische Standardsprache:

- `capital body`
- `wealth tower`
- `value block`
- `investment block`
- `fee token`
- Fantasie-Klammer
- erfundene Finanzmaschine
- isolierte geometrische Wertkörper
- Tresor + Schild + Münzen + Pfeil als komplette Erklärung

Solche abstrakten Hauptmotive sind nur als bewusst begründete Metapher erlaubt und müssen trotzdem den Instant-Read-Test bestehen.

Die frühere YouTube-Phase-A-DNA darf als Qualitätsreferenz für Modellierung, Licht, Tiefe, Kamera und Story-Moment dienen. Sie ist kein separater Reel-Vertrag.

### Deutsche Labels

Kurze Objektlabels sind erlaubt, wenn sie Mehrdeutigkeit verhindern, z. B. `Notgroschen`, `Girokonto`, `Reparatur 280 €`, `Dauerauftrag`.

- direkt am passenden Objekt/Zustand
- kurz und lesbar
- keine Headline, kein CTA, kein erklärender Absatz im Flow-Bild

### Farbrollen

- Emerald = positiv / Wachstum
- Warm Ivory + Soft Gray = neutral
- Gold = Geld / Wert
- Warm Red-Orange = Warnung / Kosten / Verlust
- Deep Black = Hintergrund

### Prompt-QA

Neue Reels mit der Story-Moment-Revision dokumentieren zusätzlich:

```text
VISUAL_STORY_MOMENT
INSTANT_READ_TEST
```

Jeder Prompt ist individuell und mittel-lang:

```text
bekannte Figur/Gegenstände + sichtbarer Story-Moment
→ Ursache/Wirkung oder klare Progression
→ intuitive Übertreibung/Metapher wenn sinnvoll
→ kurze Labels wenn nötig
→ Style
→ Background
→ Composition
→ Brands/Logos falls relevant
→ Colors/Light
→ Text
→ Forbidden
```

Bild verwerfen und dieselbe Nummer neu erzeugen, wenn:

- es hübsch ist, aber den Sprechpunkt nicht erklärt
- keine kleine sichtbare Geschichte/Beziehung vorhanden ist
- die Situation oder Metapher erst entschlüsselt werden muss
- Ursache/Wirkung unklar ist
- es generisch zu vielen Finanzthemen passen würde
- eine Figur nur dekorativ herumsteht
- es fotorealistisch, UI-lastig, katalogartig oder cluttered wird
- der Hintergrund nicht deep black bleibt

## 7. Google Flow — Strict Single Job V3

```text
FLOW_EXECUTION_MODE: finanzneo-flow-strict-single-job-v3
FLOW_STATE_MACHINE: finanzneo-flow-state-machine-v1
```

Globaler Standard:

```text
aktuellen Bildblock lesen
→ GENAU EIN Bild starten
→ intern auf Ergebnis warten
→ sofort exakt umbenennen
→ V9-QA
→ bei Fehler dieselbe Bildnummer neu erzeugen
→ bei PASS nächsten Bildblock freischalten
```

Verboten:

- Batch
- parallele Jobs
- Queue späterer Bilder
- Kontaktbogen/Galerie als Ersatz
- Nutzer-„weiter“ zwischen Bildern
- Bild-zu-Bild-Referenzen im kanonischen Flow

Experimente mit Cover-Auswahl, Referenzbild oder Blockstopps sind nicht automatisch globale Regeln. Erst nach erfolgreichem Praxistest und ausdrücklicher Promotion dürfen sie den kanonischen Flow ersetzen.

## 8. Finales Reel-Layout V5

Einzige technische Wahrheit: `src/brand/tokens.ts -> REEL_STYLE`.

```text
Header               Y = 154
Header Text          56 px, Minimum 50 px
Header Icon          34 px
Header Zeilen        maximal 2
Visualzone           Y = 320–1400
Untertitel           bottom = 340
Caption Font         50 px, Minimum 40 px
Caption Zeilen       maximal 2
Szenenübergang       3 Frames
```

Header:

- Weiß `#FFFFFF`
- Sentence Case
- semantische Farbe primär im Linien-Icon
- keine Capsule / Chip / Pill / Box
- max. zwei Zeilen

`AnimationStage` clippt produktive Animationen hart auf Y320–1400. Kein Animationsinhalt im Header- oder Caption-Bereich.

## 9. Untertitel

Standard: `src/brand/components/Captions.tsx`.

- aktives Wort grün, Rest weiß
- max. zwei Zeilen
- 50 px, Minimum 40 px
- Weight 800
- kein Stroke, Jump oder Scale-Pop
- `bottom = 340`
- kein Wort der nächsten Szene darf vorgreifen

## 10. Reel-Hintergrund — Pure Black V1

Der einzige produktive Reel-Hintergrund ist:

```text
#000000
statisch
```

Verboten als Reel-Hintergrund:

- Partikel
- Aurora
- Grid
- Glow-Feld
- dekorative Vignette/Gradient-Fläche
- Hintergrundbewegung

Hintergrundbewegung zählt niemals als Szenenanimation oder QA-Nachweis.

## 11. Phase-1-Animationscode

Basis-Lock:

```text
finanzneo-phase1-animation-code-v1
```

Kompatibilitäts-Lock:

```text
finanzneo-premium-physical-animation-v2
```

Visuelles Ziel bleibt V9. Story-Moment-Revision bleibt `finanzneo-readable-story-moment-v1`.

### Eine Welt statt Motion-Sonderstil

Animation und Flow-Bild müssen wie dieselbe Serie aussehen.

Reihenfolge:

```text
SPRECHPUNKT
→ VERSTÄNDNISZIEL
→ BEKANNTE FIGUR/GEGENSTÄNDE ODER SOFORT VERSTÄNDLICHER STORY-MOMENT
→ HAUPTMECHANIK
→ FINANCE MOTION LIBRARY AUF SEMANTISCHEN FIT PRÜFEN
→ SAME-WORLD-PASS PRÜFEN
→ DIREKTER LIBRARY-EINSATZ ODER CUSTOM-BUILD
```

Die Finance Motion Library ist ein **Mechanik-Werkzeugkasten, keine Art-Direction**.

Direkter Library-Einsatz ist nur zulässig, wenn:

1. die Mechanik den gesprochenen Punkt wirklich erklärt und
2. das Resultat sichtbar zur V9-Serie und Story-Moment-Logik passt.

Wenn eine Library-Komponente wie Dashboard, Infografik oder abstrakte Value-Geometrie wirkt, wird die Mechanik individuell in der V9-Welt umgesetzt.

Auch Animationen dürfen intuitive Übertreibung/Metapher verwenden, wenn bekannte Figuren/Gegenstände die Bedeutung tragen und die Handlung ohne Untertitel lesbar bleibt.

### Pflichtlogik

```text
STARTZUSTAND
→ SICHTBARE URSACHE / HAUPTAKTION
→ REAKTION / VERÄNDERUNG
→ EINDEUTIGER PAYOFF
→ Ergebnis mindestens 15 Frames stabil
```

Pflichtmetadaten im Code:

- `MOTION_SOURCE`
- `FINANCE_MOTION_ID`
- `MECHANIC_ID`
- `FOCAL_PATH`
- `PRIMARY_ACTION`
- `CAMERA_ROLE`
- `PAYOFF`
- `ANIMATION_NARRATIVE` mit START / MECHANISM / RESULT
- `PREMIUM_VISUAL_NARRATIVE` mit HERO / SUPPORT / MATERIAL / DEPTH
- `RESULT_HOLD_FRAMES >= 15`

Custom-Build nutzt framebasierte Remotion-Logik (`useCurrentFrame`, `interpolate`, `spring` o. ä.) und zentrale `ANIMATION_COLORS`.

### animation.tsx besitzt nicht das Reel-Shell

`animation.tsx` liefert **nur transparenten visuellen Inhalt** für `AnimationStage`.

Verboten innerhalb einer Szenenanimation:

- eigener schwarzer Vollbild-Canvas
- lokale `SceneShell`
- eigener globaler Header
- eigene globale Caption
- eigener dekorativer Hintergrund

Header, Caption, Canvas und Safe-Zone-Clipping werden exakt einmal vom zentralen Reel-Layout gerendert.

### Verbotene Hauptsprache

- generische Karten-/Kästchenreihe
- Lade-/Fortschrittsbalken als Ersatz für die Finanzmechanik
- Dashboard-/Control-Panel-Komposition
- Flowchart
- reine Texttafel mit Fade/Scale
- kleine Boxen mit dünnen Verbindungslinien
- abstrakte `capital body`/`value block`/`wealth tower`-Mechanik ohne sofort lesbare bekannte Bedeutung
- Partikel/Aurora/Grid als Szenenhintergrund
- `Math.sin` / `Math.cos` als Frame-Diff-Hack
- Dummy-/Placeholder-Komponenten
- Library-Nutzung nur weil ein Baustein existiert

Technische Tests sind Pflicht, beweisen aber nicht allein die visuelle Qualität. Eine globale Stil-Promotion braucht einen echten visuellen Test mit realen Flow-Bildern und Animationen im finalen Reel-Layout.

## 12. Phase-3-Seal und Dispatch

`npm run reel:ready -- <Reel-Pfad>` versiegelt jede kanonische `animation.tsx` per SHA-256.

Phase 3 verlangt danach:

- exakten `componentPath`
- exakten Export
- unveränderten Hash
- vollständiges Binding

Fehlt ein Binding: Render hart abbrechen. Kein Ersatzvisual.

## 13. Phase-3-Completion-Gate

Eine vorhandene MP4 bedeutet nicht fertig.

```text
reel:ready
→ Phase-1-Animation-Seal
→ Phase-3-Preflight
→ Candidate Render
→ Post-Render-QA
→ Final MP4
→ reel:export
→ FINAL_COMPLETE
```

Post-Render-QA prüft mindestens:

- jede Szene hat echten visuellen Inhalt
- Header + Caption + Schwarz allein zählen nicht
- Bildszene zeigt wirklich Nutzerbild
- Animationsszene zeigt echte Mechanik/Veränderung
- freie Randbereiche bleiben schwarz
- Audio, Auflösung und Timeline stimmen
- Future-V3-Candidate wird auf -16 LUFS / -1 dBTP gemastert und gemessen

## 14. Publishing

Für alle Reel-Plattformen gibt es genau eine Social-Caption.

Kanonische Quelle:

```text
04-caption/caption.txt
```

Finaler Export:

```text
06-export/caption-universal.txt
```

Dieselbe Caption gilt für Instagram Reels, TikTok, Facebook Reels und Snapchat. YouTube bleibt Longform unter `youtube/`.

## 15. Produktionsbefehle

```bash
npm run reel:create -- --target <Reel-Pfad> --title "Titel"
npm run reel:validate -- <Reel-Pfad>
npm run reel:ready -- <Reel-Pfad>
npm run reel:phase3:preflight -- <Reel-Pfad>
npm run reel:export -- <Reel-Pfad>
```

Kein Agent darf einen fehlgeschlagenen Gate umgehen.
