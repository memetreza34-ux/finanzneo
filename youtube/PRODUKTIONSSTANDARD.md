# FinanzNeo — YouTube-Longform-Produktionsstandard V3

> YouTube Longform ist eigenständig. Reel-Regeln gelten nur dort, wo sie ausdrücklich gemeinsam sind. **Die Bildwelt ist NICHT eigenständig:** YouTube verwendet exakt dieselbe FinanzNeo-Bildwelt wie die Reels; nur das Quellformat ist horizontal 16:9 statt quadratisch.

## Projektstruktur — bewusst so einfach wie bei Reels

```text
01-script/
02-audio/
03-szenen/
04-caption/
05-projektdateien/
06-export/
README.md
```

Keine parallele alte Longform-Struktur mit `01-recherche`, `04-visuals` oder `05-publishing` neu erzeugen.

## Format

- eigenständiges Longform-Erklärvideo, kein verlängertes Reel
- keine YouTube Shorts
- final exakt 1920 × 1080
- 30 fps
- Hook beginnt sofort, kein neutrales Intro
- Länge folgt dem Thema; pro Projekt steht ein plausibles Zielzeitfenster im `scene-index.json`

## Beat-first + hohe Visualdichte

Es gibt keine feste Szenenzahl und keine feste Bild-/Animationsquote. **Zu wenig Visuals ist trotzdem nicht erlaubt.**

```text
Skript
→ gesprochene Gedanken
→ Wortbereiche
→ sichtbare Beats
→ beste Visualtechnik
→ produktionsreife Szene
```

Visualtypen:

- `image`
- `animation`
- `hybrid`
- `data`

Für ein typisches FinanzNeo-Video mit **8–10 Minuten** gilt als Mindestdichte:

- mindestens **24 unterschiedliche Bild-/Hybrid-Assets**
- mindestens **45 sichtbare Visual-Beats insgesamt**
- reine statische Bildbeats maximal **6 Sekunden**
- ein zusätzliches gutes Bild ist besser als ein überladener Still
- wenn ein Satz oder Gedanke zwei deutlich verschiedene reale Situationen enthält, darf und soll er in mehrere Visual-Beats geteilt werden

Diese Werte sind **keine starre Bild-/Animationsquote**. Wenn das Skript 30 oder 35 gute Bilder braucht, werden 30 oder 35 Bilder geplant.

## Motion V3

`MOTION_STANDARD: finanzneo-youtube-motion-v3`

Eine Animation ist **kein leicht bewegtes PowerPoint-Bild**. Sie muss einen Gedanken sichtbar passieren lassen.

Bestehende Komponenten und Physical-Primitives sind optionale Werkzeuge. Erlaubt sind u. a. Custom React, SVG/Paths, CSS 3D, Canvas, Three.js/R3F, Kamera-Fahrten, Datenvisualisierung, Simulation, Masking, Image-Compositing, Typografie und Kombinationen daraus.

Jede Motion-Szene benötigt:

- produktionsreife `animation.tsx` in Phase 1
- `viewerTakeaway`
- `qualityTier`: `hero` oder `support`
- `mechanicId`
- `visualTechniqueId`
- `compositionFamilyId`
- mehrere echte Motion-Channels
- mehrere Story-Beats
- konkrete `motionEvents`
- `previewDurationFrames`
- `maxQuietFrames`

Hero-Motion ist bewusst aufwendiger als Support-Motion. Bei längeren Produktionen müssen mindestens 30 % der Motion-Szenen Hero-Qualität haben.

### Verbot: interne Regieanweisungen im Bild

Texte wie diese dürfen niemals sichtbar gerendert werden:

- `Show ...`
- `Reveal ...`
- `Explain ...`
- `Animate ...`
- `Build ...`
- `Move the camera ...`
- `Finish with ...`

Sichtbarer Szenentext wird ausschließlich über `VIEWER_TEXT` als kurzer finaler **deutscher Zuschauertext** deklariert.

## Motion-QA vor dem Seal

```bash
npm run youtube:animation:validate -- youtube/<Projekt>
npm run youtube:motion:qa -- youtube/<Projekt>
npm run youtube:phase1:seal -- youtube/<Projekt>
```

`youtube:motion:qa` rendert pro Motion-Szene mehrere Frames über die Laufzeit und prüft u. a. sichtbaren Inhalt und tatsächliche Bildveränderung. Erst Source-QA **und** Render-QA erlauben den Seal.

Phase 3 darf versiegelte Motion nicht kreativ durch simplere Ersatzanimationen ersetzen.

## Bildwelt — exakt dieselbe wie bei den Reels

Verbindliche IDs:

- `finanzneo-connected-studio-v3`
- `finanzneo-same-world-v1`
- `finanzneo-stylized-3d-animated-black-v9`
- `finanzneo-image-storytelling-v3`

YouTube darf daraus **keine eigene futuristische Interpretation** machen.

### Was die Welt bedeutet

- premium, realitätsnah und erwachsen
- klar stylized 3D, aber niemals fotorealistisch
- glaubwürdige Objektproportionen und erkennbare reale Konstruktion
- reale Finanz-/Alltagssituation zuerst
- sichtbare Ursache/Wirkung
- deep-black Hintergrund mit sauberem Studio-Licht
- Emerald/Mint für positive/aktive Elemente
- Gold nur gezielt für Geld/Wert
- warmes Rot-Orange nur für Risiko, Verlust oder Kosten
- kurze deutsche Objektlabels nur wenn sie wirklich Klarheit schaffen

### Was ausdrücklich NICHT die FinanzNeo-Welt ist

Die folgenden Looks müssen verworfen und neu generiert werden:

- generischer KI-Art-Look
- Neon-Sci-Fi / Cyberpunk
- leuchtende Technologie-Landschaften
- Miniatur-Dioramen oder Spielzeugwelten
- Weltkarten aus kleinen leuchtenden Gebäuden
- Fantasie-Tresore, Portale, Maschinen, Förderbänder oder Kabelnetzwerke als Ersatz für reale Situationen
- Fake-Broker-UIs oder Dashboard-Kompositionen
- erfundene Firmenlogos / Logo-Wände
- zufällige unlesbare KI-Texte
- unmögliche oder verschmolzene Geometrie
- übertriebener Glow
- dekorative Finance-Icon-Collagen
- Pixar-, Clay- oder Game-Asset-Optik

### Literal first, creative second

Jeder Bildbeat startet bei der Frage:

> **Was passiert im gesprochenen Satz in der echten Welt tatsächlich?**

Diese reale Situation ist die erste Bildwahl. Metaphern sind nur Fallback.

Pflichttests:

- **Subtitle-off-Test:** Ist ungefähr erkennbar, was erklärt wird, wenn alle Texte ausgeblendet sind?
- **Transferability-Test:** Könnte dieses Bild unverändert auch fünf andere Finanzthemen illustrieren? Wenn ja, ist es zu generisch.
- **Anti-AI-Look-Test:** Sieht das Bild nach typischer generischer Bild-KI statt nach bewusstem FinanzNeo-Art-Direction aus? Wenn ja, neu generieren.

Ein weiteres fokussiertes Bild ist besser als ein Bild, das gleichzeitig fünf Aussagen zeigen will.

## Google Flow

Flow-Datei:

```text
03-szenen/alle-bildprompts.txt
```

Fertige Bilder:

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

Flow arbeitet strikt **ein Bild nach dem anderen**:

`erzeugen → vollständig abwarten → exakt umbenennen → V9/Literal/Anti-AI-QA → erst dann nächstes Bild`

Keine Batches. Keine Prompt-Zusammenfassung. Keine Queue. Keine späte Sammelumbenennung.

## Audio, Wortzeiten und Timeline

Finales Voiceover:

```text
02-audio/
```

Wortzeiten:

```text
02-audio/word-timings.json
```

Jede Szene besitzt bereits in Phase 1 einen lückenlosen `wordStartIndex`/`wordEndIndex`-Bereich. Sobald das echte Voiceover transkribiert ist:

```bash
npm run youtube:timeline:build -- youtube/<Projekt>
```

Erst daraus entsteht die echte Frame-Timeline. `startFrame: 0` / `durationFrames: 0` ist **kein zulässiger Produktionszustand**.

## Untertitel sind Pflicht

Finale YouTube-Videos verwenden:

`finanzneo-youtube-caption-layer-v2`

- satzweise Caption-Gruppen
- Wortzeiten aus dem finalen Voiceover
- aktives Wort FinanzNeo-Grün
- Rest weiß
- lesbarer dunkler Hintergrund

Ein Video ohne echte Wortzeiten oder ohne gebundenen `YouTubeCaptionLayer` darf nicht final freigegeben werden.

## Phase-3-Start

```bash
npm run youtube:validate -- youtube/<Projekt>
npm run youtube:phase1:seal -- youtube/<Projekt>
npm run youtube:timeline:build -- youtube/<Projekt>
npm run youtube:ready -- youtube/<Projekt>
```

`youtube:ready` verlangt u. a.:

- finale Nutzerbilder
- genau ein lesbares Voiceover
- echte Wort-Timestamps
- aufgelöste lückenlose Timeline
- unveränderten Motion-Seal
- gültige Motion-Metadaten

## Finalrender — kein manueller Bypass

Offizieller Finalrender ausschließlich:

```bash
npm run youtube:render -- youtube/<Projekt>
```

Der Render erzeugt zunächst nur einen Candidate. Danach läuft automatisch `youtube:final:qa`.

Final-QA verlangt:

- exakt 1920 × 1080
- 30 fps
- Audio vorhanden
- verpflichtenden Caption-Layer in der Produktionscomposition
- keine extrem langen nahezu statischen Abschnitte
- kein insgesamt überwiegend statisches Longform-Video

Wenn die QA scheitert, wird der Candidate entfernt und **kein neues finales MP4 freigegeben**.

## Qualitätsprinzip

> Nicht fragen: „Welche vorhandene Komponente kann ich hier einsetzen?“  
> Fragen: „Was muss der Zuschauer in diesem Moment sichtbar passieren sehen, damit er den Gedanken sofort versteht?“

Und bei Bildern:

> Nicht fragen: „Welche coole 3D-Metapher passt zu ETF?“  
> Fragen: „Welche reale ETF-Situation zeigt genau diesen Satz und sieht in der bekannten FinanzNeo-Reel-Welt aus?“

Wenn eine Animation nahezu unverändert auch als PowerPoint-Folie funktionieren würde, ist sie nicht gut genug. Wenn ein Bild wie generische KI-Kunst statt wie FinanzNeo aussieht, ist es ebenfalls nicht gut genug.
