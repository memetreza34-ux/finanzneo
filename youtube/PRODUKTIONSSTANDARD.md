# FinanzNeo — YouTube-Longform-Produktionsstandard

> Bei Widersprüchen gilt `CLAUDE.md`. Für Flow-Storyboard/Prompting gilt `docs/YOUTUBE-FLOW-STORYBOARD-STANDARD.md`. Für YouTube-Motion gilt `docs/YOUTUBE-MOTION-V4-SIMPLE.md`. Für die Visualwahl gilt `docs/FINANZNEO-VISUAL-SELECTION-RULE.md`.

## Ziel

FinanzNeo ist ein **faceless Simple-Finance-Explainer**: seriös und strukturiert erklärt, visuell direkt, wenige Elemente, einfache Animationen und bei Flow-Bildern eine kleine visuelle Geschichte statt statischer Produktkatalog-Inszenierung. Nicht Finanzbär oder Finanzfluss kopieren; übernommen werden nur die Prinzipien verständliche Struktur, konkrete Beispiele, große lesbare Informationen und zweckmäßige Bewegung.

## Projektstruktur

```text
01-recherche/
02-script/
03-audio/
04-visuals/
05-publishing/
06-projektdateien/
README.md
```

## Format und Inhalt

- eigenständiges längeres Finanz-Erklärvideo, kein verlängertes Reel
- keine YouTube Shorts
- 1920 × 1080, horizontal 16:9, 30 fps
- Länge folgt dem Thema; keine künstlichen Füllpassagen
- Hook ohne langes Intro
- Kapitel mit klaren Zwischenzielen und Payoffs
- einfache Sprache für Finanzanfänger
- konkrete Beispiele statt unnötig abstrakter Formulierungen
- Zahlen, Annahmen und Datenstand prüfbar dokumentieren
- keine individuelle Anlageberatung oder garantierte Rendite

## Simple-first Visualplanung

Es gibt **keine feste Visualzahl und keine feste Bild-/Animationsquote**.

```text
Skript
→ einzelner gesprochener Gedanke
→ Was muss der Zuschauer verstehen?
→ einfachste klare Visualform
→ geeignetste Assetquelle
→ nur notwendige Bewegung
```

### Szenengröße

Für Flow gilt als Standard:

> **1 Bild = 1 dominanter Gedanke = normalerweise 1–2 kurze Voiceover-Sätze.**

Wenn ein Sprechblock mehrere unabhängige Aussagen, Beispiele oder Konsequenzen enthält, wird er in mehrere Visuals geteilt. Die Regel ist semantisch, kein starres Satz-Zählwerk: Zwei kurze Sätze dürfen zusammengehören; fünf verschiedene Gedanken gehören nicht in ein einziges Flow-Bild.

Erlaubte Visualtypen:

- `animation`
- `data`
- `image`
- `hybrid`
- `real-asset`

### Asset-Reihenfolge

1. **Remotion** — Default für Zahlen, Vergleiche, Prozente, Charts, Zeitverläufe, Aufteilungen, Rechenwege und Prozesse.
2. **Echtes Asset** — reale Website, App, Dokument, Factsheet, Logo, Produkt oder Quelle.
3. **Google Flow** — nur wenn eine konkrete Situation als Bild deutlich besser verständlich ist.

Vor jedem Flow-Bild gilt:

> Kann Text, Zahl, Icon, Chart, Diagramm, Screenshot oder echtes Asset diesen Punkt gleich gut oder besser erklären?

**Ja → kein Flow. Nein → Flow nur mit konkreter `flowReason`.**

Wichtig: **Simple-first betrifft die Komposition und Erklärlogik, nicht die Bildstil-Dimension.** Wenn Flow gewählt wird, bleibt die freigegebene premium stylized 3D FinanzNeo-Welt Pflicht.

## Flow Storyboard Standard

Kanonische Regel:

```text
docs/YOUTUBE-FLOW-STORYBOARD-STANDARD.md
```

Jedes Flow-Bild muss eine sinnvolle sichtbare Beziehung zwischen den wichtigen Elementen zeigen. Gute Bilder wirken wie ein eingefrorener Moment aus einer Finanzgeschichte: etwas zieht, drückt, blockiert, schützt, wächst, stapelt sich, öffnet sich, wickelt sich, bewegt sich durch Tiefe oder legt eine Konsequenz frei.

Nicht als Default erlaubt:

- Objekt + Dokument + Objekt ordentlich auf einem Tisch
- zentrierter Produktshot mit Finanz-Props
- symmetrische Katalog-Anordnung
- schwebende Objekte ohne Ursache/Wirkung
- dieselbe erfolgreiche Komposition für jedes neue Thema

Tisch, Boden, Raum oder frei schwebende Objekte sind erlaubt, wenn genau diese Inszenierung den Sprechpunkt am besten erzählt.

### Flow-Prompt-Format

Ein finaler Bildblock ist vollständig und copy/paste-ready und enthält:

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

Kurze deutsche Objektlabels werden nur dort verwendet, wo ein wichtiges Objekt sonst missverstanden werden könnte. Offensichtliche Objekte bleiben unbeschriftet. Wichtige Zahlen, Prozente und Vergleiche gehören grundsätzlich in Remotion.

### Ein gemeinsamer Prompt mit mehreren Bildern

`04-visuals/alle-bildprompts.txt` darf viele vollständige Bildblöcke in **einem gemeinsamen Google-Flow-Handoff** enthalten, z. B. 3, 5, 10 oder mehr. Es gibt keine feste Batchgröße.

Die Generierung bleibt trotzdem strikt sequenziell:

```text
BILD 01 erzeugen
→ vollständig warten
→ exakt umbenennen
→ QA
→ bei Fehler dasselbe Bild regenerieren
→ erst nach PASS zu BILD 02
```

Nie mehrere Bilder parallel erzeugen und nie zusätzliche Bilder erfinden.

## Motion V4 Simple

`MOTION_STANDARD: finanzneo-youtube-motion-v4-simple`

Kanonische Regel:

```text
docs/YOUTUBE-MOTION-V4-SIMPLE.md
```

### Standardbausteine

Bevorzugt werden wiederverwendbare Erklärmuster wie:

- Big Number
- Prozent
- Vergleich
- Balken
- Linie / Chart
- Timeline
- Money Flow
- Process Steps
- Simple Diagram
- Allocation
- Formula
- Highlight Text

Wiederholung ist ausdrücklich erlaubt, wenn das Muster erneut die klarste Erklärung ist. Konsistenz ist Teil der visuellen Sprache.

### Standardbewegungen

Bevorzugt:

- `FADE_IN`
- `SLIDE_UP`
- `SLIDE_LEFT`
- `SCALE_IN`
- `COUNT_UP`
- `BAR_GROW`
- `LINE_DRAW`
- `HIGHLIGHT`
- `SLOW_ZOOM`

Keine Pflicht zu künstlich unterschiedlichen Mechaniken, Kamerawegen oder Composition Families.

### Fortgeschrittene Motion

SVG, Canvas, CSS 3D, Three.js/R3F, Masks, Motion Blur, Simulationen und aufwendige Kamerawege sind möglich, aber nicht Standard. Sie benötigen eine inhaltliche `advancedReason`, warum ein einfaches Visual nicht gleich gut funktioniert.

### Minimale Motion-Metadaten

Jedes Motion-Visual braucht:

- produktionsreife `animation.tsx` in Phase 1
- `viewerChange`
- `reason`
- `motionPreset`
- `animationSourceFile`
- `animationExport`

Mehr technische Metadaten sind optional und dürfen die Szene nicht künstlich verkomplizieren.

Vor Phase 2:

```bash
npm run youtube:animation:validate -- youtube/<Projekt>
npm run youtube:phase1:seal -- youtube/<Projekt>
```

Der Seal schützt danach die freigegebene Motion-Quelle und den einfachen V4-Vertrag. Phase 3 darf Timing an das echte Voiceover anpassen, aber die Erklärung nicht unbemerkt durch eine andere Mechanik ersetzen.

## Bildwelt und Google Flow

`IMAGE_WORLD: finanzneo-youtube-grounded-3d-black-v1`

Kanonische Bildwelt:

```text
config/finanzneo-image-worlds/finanzneo-youtube-grounded-3d-black-v1.txt
```

### Stil

- premium **stylized 3D animation-film rendering**
- klar animierter 3D-Look, niemals flache Corporate-/Editorial-Vektorillustration
- glaubwürdige Alltagsobjekte und stilisierte Figuren mit ansprechenden Animationsfilm-Proportionen
- weiche, hochwertige Geometrie und semi-realistische Materialien, aber sichtbar stilisiert
- ein klarer Hauptgedanke
- wenige große, sofort lesbare Objekte
- tiefe nahtlose schwarze FinanzNeo-Welt als dominanter Hintergrund
- nur so viel lokaler Alltagskontext wie für das Verständnis nötig; Umgebung löst sich in Schwarz auf
- sauberes weiches Studio-Licht, Kontakt-Schatten und kontrollierte Highlights
- Emerald Green = positiv/Wert/Lösung; warmes Rot-Orange = Kosten/Risiko/Problem; Ivory/Grau = neutral
- nicht fotorealistisch, nicht anime, nicht flache 2D-Illustration, nicht isometrisch
- 16:9 horizontal

**Simple bedeutet hier:** wenige Elemente, klare Komposition und schnelle Verständlichkeit. Es bedeutet **nicht** 2D, 2.5D, flachen Vektor-Look oder langweilige Produktshot-Inszenierung.

### Text und Zahlen

Wichtige Texte, Zahlen, Vergleiche und Labels werden grundsätzlich mit **Remotion** gerendert. Flow soll keine Headlines, Untertitel, langen Erklärtexte oder kritischen Zahlen erzeugen.

### Flow eignet sich z. B. für

- Einkauf / Inflation
- Miet- oder Nebenkosten-Situation
- Autoreparatur / unerwartete Ausgabe
- Arbeitsplatz / Gehalt / finanzielle Entscheidung
- Versicherung / Vertrag / Kündigung
- konkrete finanzielle Alltagssituation, bei der die 3D-Szene schneller verständlich ist als eine Grafik

### Flow eignet sich nicht für

- Prozentwerte
- Sparraten
- Gebührenvergleich
- Zinseszins
- Charts
- Zeitachsen
- ETF-Aufteilung
- Formeln
- reale Websites/Apps/Dokumente

### Flow-Handoff

```text
04-visuals/alle-bildprompts.txt
```

Benötigte Bilder weiterhin strikt einzeln erzeugen, vollständig abwarten, exakt umbenennen und prüfen. Erst danach das nächste Bild. Alle fertigen Dateien liegen in:

```text
04-visuals/00-ALLE-BILDER-HIER-REIN/
```

## Visual-QA

Vor Freigabe jedes Visuals:

1. Ist die Hauptaussage in ungefähr 1–2 Sekunden erkennbar?
2. Gibt es nur einen dominanten Gedanken?
3. Enthält ein Flow-Beat normalerweise nur 1–2 kurze Voiceover-Sätze?
4. Wurde ein Beat geteilt, wenn mehrere unabhängige Gedanken enthalten waren?
5. Kann etwas ohne Informationsverlust entfernt werden? Dann entfernen.
6. Ist Flow wirklich notwendig?
7. Wenn Flow verwendet wird: sieht das Bild eindeutig nach der freigegebenen premium stylized 3D FinanzNeo-Welt aus?
8. Gibt es eine sinnvolle visuelle Beziehung/Story statt statischer Katalog-Anordnung?
9. Sind wichtige unklare Objekte bei Bedarf kurz auf Deutsch beschriftet?
10. Werden wichtige Texte/Zahlen von Remotion gerendert?
11. Hat die Bewegung einen Erklärzweck?
12. Würde eine einfachere **Komposition** gleich gut funktionieren? Dann vereinfachen — aber nicht den Bildstil oder die sinnvolle visuelle Geschichte entfernen.

## Audio, Timing und Untertitel

- genau ein finales Voiceover in `03-audio/`
- echte Wort-Zeitstempel aus genau diesem Audio
- Schnitte folgen Sprache, Visual Beats, Kapiteln und Payoffs
- keine pauschal gleich langen Visuals
- Untertitel satzweise; aktives Wort grün, Rest weiß
- Audioziel ungefähr -16 LUFS, True Peak höchstens -1 dBTP

## Publishing-Paket

`05-publishing/` enthält:

- fünf belastbare Titelvarianten und einen finalen Titel
- vollständige Beschreibung
- Kapitel-Zeitstempel
- Keywords/Tags und passende Hashtags
- Thumbnail-Brief
- Quellen-/Disclaimer-Text
- angehefteten Kommentar
- Community-Post
- Upload-Checkliste
- Promo-Texte für Instagram, TikTok, Facebook und Snapchat

Titel und Thumbnail dürfen neugierig machen, aber nichts versprechen, was das Video nicht erfüllt.

## Startfreigabe

```bash
npm run youtube:validate -- youtube/<Projekt>
npm run youtube:animation:validate -- youtube/<Projekt>
npm run youtube:phase1:seal -- youtube/<Projekt>
npm run youtube:ready -- youtube/<Projekt>
```

`youtube:ready` prüft Phase 1, Motion-V4-Seal, exakte benötigte Bilder, 16:9-Abmessungen, genau ein lesbares Voiceover, passende Wortzeiten und das Publishing-Paket. Nur ein erfolgreicher Lauf gibt Phase 3 frei.
