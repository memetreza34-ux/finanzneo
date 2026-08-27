# FinanzNeo — verbindliches Projekt-Gehirn

> Diese Datei ist die höchste interne Quelle für Strategie, Gestaltung und Produktion.
> Bei Widersprüchen mit älteren Dateien gilt immer `CLAUDE.md`.

## 1. Kanal und Ziel

- Kanal: **FinanzNeo**
- Sprache: Deutsch
- Inhalt: Finanzgrundlagen für Menschen mit wenig oder keinem Vorwissen
- Ansprache: direkt mit **du**, einfach, professionell, nahbar
- Reel-Plattformen: TikTok, Instagram Reels, Facebook Reels, Snapchat
- YouTube: nur eigenständige Longform unter `youtube/`; **keine YouTube Shorts**
- Reel-Standard: 60–90 Sekunden, 1080 × 1920, 9:16, 30 fps

## 2. Repository-Sicherheit

- Nie direkt auf `main` arbeiten.
- Neues Thema = neuer Branch + neuer Reel-Ordner.
- Bestehende Reels sind read-only, außer sie werden ausdrücklich als Ziel genannt.
- Nie mergen, force-pushen, History umschreiben oder Branches/Reels löschen, außer ausdrücklich angefordert.
- Keine Regeln, Validatoren, Tests, Finance-Berechnungen oder Locks schwächen, nur damit etwas „grün“ wird.
- Technischer Erfolg darf nie durch visuelle oder inhaltliche Platzhalter erkauft werden.

## 3. Drei Phasen — Verantwortungsgrenze

### Phase 1 — ChatGPT

Phase 1 ist für die **komplette kreative Planung und die fertigen Animationsquellen** verantwortlich:

- Recherche + Quellen
- geprüftes szenenweises Voiceover-Skript
- Dramaturgie und Szenenplan
- Bild-/Animations-Zuordnung
- vollständige Google-Flow-Prompts
- normale Szenenüberschriften + Icons
- Remotion-Spezifikationen
- **produktionsreife `animation.tsx` für jede Animationsszene**
- Master- und Plattform-Captions

Verbindliche Detailquellen:

- `docs/PHASE-1-BRIEFING.md`
- `docs/GLOBAL-IMAGE-WORLD-LOCK.md`
- `docs/PHASE-1-ANIMATION-CODE-STANDARD.md`

Phase 1 ist erst fertig, wenn keine Platzhalter mehr vorkommen und jede Animation ohne kreativen Umbau durch Phase 3 final gerendert werden könnte.

### Phase 2 — Nutzer

- erzeugt Cover + Szenenbilder mit Google Flow
- legt alle exakt benannten Bilder gemeinsam in `03-szenen/00-ALLE-BILDER-HIER-REIN/`
- legt genau ein finales Voiceover in `02-audio/`
- erzeugt daraus echte Wort-Zeitstempel

### Phase 3 — Antigravity oder Claude Code

`scene-index.json -> phase3Executor` entscheidet den Executor.

Phase 3:

- integriert Nutzerbilder
- verwendet **direkt den in Phase 1 erstellten Animationscode**
- baut Timeline, Header, Captions und Composition
- validiert, rendert, prüft und exportiert

**Phase 3 darf keine fehlende kreative Animation erfinden, vereinfachen oder ersetzen.**
Debug-Rechtecke, Testflächen, Dummy-Komponenten, künstliches Dauerwackeln oder QA-Hacks sind verboten.

`npm run reel:ready -- <Reel-Pfad>` versiegelt den kanonischen Phase-1-Animationscode per SHA-256. Danach blockiert der Phase-3-Preflight jede Änderung oder Ersatzkomponente.

## 4. Reel-Struktur

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

## 5. Skript- und Beat-Regeln

- Hook in den ersten 2 Sekunden
- Standardumfang ca. 15 Visual-Beats; 14–16 als Zielkorridor
- Ziel ungefähr 60 % Bild / 40 % Animation, Qualität vor Quote
- nie mehr als zwei Bildszenen direkt hintereinander
- Bildbeat ideal 3,5–5,5 s, absolut max. 6,0 s
- Animation ideal 4,5–7,0 s
- Skript **von Anfang an Szene für Szene schreiben**, nicht nachträglich zerschneiden
- Bildszene meist 9–14 Wörter, absolut max. 15
- Animationsszene meist 11–16 Wörter, absolut max. 17
- kurze klare Sätze, kein unnötiger Fachjargon, keine Füllsätze
- Logik: Hook → Problem → Erklärung → Beispiel → Lösung/Merksatz → CTA
- Zahlen nur nach Prüfung; Beispielannahmen klar kennzeichnen
- keine individuelle Anlageempfehlung

## 6. Google-Flow-Bildwelt — Premium Physical Editorial V8

Verbindliche Locks:

```text
FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
FINANZNEO_SERIES_LOCK: finanzneo-same-world-v1
STYLIZED_3D_LOCK: finanzneo-stylized-3d-editorial-v5
PREMIUM_VISUAL_WORLD_LOCK: finanzneo-premium-physical-editorial-v8
GENERATED_IMAGE_ASPECT_RATIO: 1:1
```

### Zielbild

Die Bildwelt ist **keine dunkle UI-/Dashboard-/Flowchart-Welt mehr**.
Sie ist eine hochwertige stylized-3D Financial Editorial Object World.

Pflicht:

- **ein dominantes physisches Hero-Objekt**, ungefähr 45–65 % der nutzbaren Komposition
- nur **2–4** unterstützende konkrete, themenspezifische Objekte
- medium-close 3/4-Kamera; keine weit entfernte isometrische Gesamtansicht
- starke Silhouette und klare Vordergrund-/Hero-/Hintergrundstaffelung
- sichtbare Dicke, industrielle rounded bevels und glaubwürdiges Gewicht
- purposeful overlap, Kontakt-Schatten und Ambient-Occlusion-Eindruck
- cinematic soft key light + kontrolliertes Emerald-Rim-Light
- lesbare Schattenseite; Motiv darf nicht im dunklen Hintergrund verschwinden
- mindestens drei Material-/Farbrollen pro Bild

### Materialien

- Struktur: satin dark-emerald anodized metal oder Premium-Polymer
- Neutral: warmes Ivory/Creme, Keramik-/Steinwirkung
- Geld/Wert: gebürstetes Messing / sculpted gold
- Warnung/Kosten/Verlust: warmes Rot-Orange
- Glas: nur zurückhaltend als Sekundärmaterial

### Farbe

Grün ist Marken- und Fokusfarbe, aber **kein monochromer Gesamtlook**.
Creme/Weiß bringt Klarheit, Gold steht für Geld/Wert, Rot-Orange für Kosten/Warnung.

### Physische Storytelling-Regel

Mechanismen sollen als konkrete Objektaktion lesbar sein, zum Beispiel:

- Karte geht in Terminal
- Gebühren-Tag heftet sich an einen Beleg
- Währungsobjekt wechselt einen physischen Weg
- Bankobjekt übernimmt die Umrechnung
- Gate öffnet/schließt
- Waage kippt
- Beleg verlängert sich
- Schloss greift ein

### Text im KI-Bild

- keine Headline
- kein Untertitel
- kein erklärender Satz
- kein CTA
- nur wenige kurze deutsche Objektlabels, normalerweise 1–2 Wörter
- Labels als physische Tags/Plaketten/Sticker/Prägungen
- Bild muss auch ohne Labels verständlich bleiben

### Geräte

ATM, Kartenterminal, Telefon oder Rechner sind erlaubt, wenn sie das konkrete physische Hero-Objekt des Themas sind. Das Bild darf dadurch niemals zu einem Dashboard-/UI-Mockup werden.

### Streng verboten

- Dashboard / Control Panel als Komposition
- Flowchart als Hauptkomposition
- kleine Kästen mit dünnen Verbindungslinien
- floating UI cards/tiles/chips/pills/widgets/HUD
- generische rechteckige Info-Cards als Hauptobjekte
- Neon-Liniennetz als Hauptmotiv
- Microchip/Circuit-Board
- Gameboard
- Orbit-/Satellitenmodule
- symmetrische Vier-Ecken-Kacheln
- tiny isometric diorama
- sterile Produktwerbung ohne erklärende Handlung
- kleines Objekt in riesigem dunklem Leerraum
- flache Poster-Komposition
- monochrom-grüne Gesamtkomposition
- Fotorealistik/Office-Still-Life
- Pixar/Clay/Toy

### Hintergrund

Ein einziger nahtloser deep-charcoal-green-black Raum mit subtiler Tiefe. Keine Floor-Wall-Grenze, kein Horizont, keine horizontalen Zonen oder Panels.

### Bild-QA

Bild neu erzeugen, wenn das Hero-Objekt zu klein ist, zu viele kleine Nebenobjekte konkurrieren, UI/Flowchart-Look entsteht, Material/Tiefe/Licht schwach sind, zu viel Leerraum bleibt oder die Aussage nur durch Text verstanden wird.

## 7. Google Flow — Strict Single Job

Verbindlicher Ausführungsmodus:

```text
FLOW_EXECUTION_MODE: finanzneo-flow-strict-single-job-v3
FLOW_STATE_MACHINE: finanzneo-flow-state-machine-v1
```

Zu jedem Zeitpunkt maximal **ein** Bildjob:

```text
aktuellen Prompt lesen
→ GENAU EIN Bild starten
→ intern vollständig warten
→ sofort exakt umbenennen
→ Premium-QA
→ bei Fehler dieselbe Bildnummer neu erzeugen
→ erst nach bestandener QA nächsten Bildblock freischalten
```

Verboten:

- Batch-/Parallel-Erzeugung
- mehrere Prompts gleichzeitig anstoßen
- spätere Bilder vorab queueen
- erst alles generieren und danach umbenennen
- Nutzer-Zwischenfreigabe „weiter“ verlangen
- Bild-zu-Bild-Referenz verwenden

Cover = Bild 00. Bildnummer = echte Szenennummer. Animationsnummern bleiben reserviert und erzeugen kein Bild.

## 8. Reel-Layout V5 — einzige Wahrheit ist `REEL_STYLE`

Technische Quelle: `src/brand/tokens.ts -> REEL_STYLE`.

```text
Header               Y = 154
Visualzone           Y = 320–1480
Untertitel           bottom = 340
Caption links        72
Caption rechts       140
Szenenübergang       3 Frames
```

Reels dürfen diese Werte nicht lokal überschreiben.

## 9. Szenenüberschrift V5

Jede Szene zeigt eine kurze normale Überschrift mit passendem Linien-Icon.

- mittig
- Sentence Case / natürliche Schreibweise
- Text neutral weiß
- semantische Farbe primär über das Icon
- 3–6 Wörter als Richtwert
- Aussage oder Frage, nie nur Zahl/Stichwort

Verboten: automatische ALL-CAPS-Transformation, Header-Capsule, Chip, Pill, Panel/Box oder künstlich technische UI-Optik.

## 10. Untertitel

Standard: `src/brand/components/Captions.tsx`.

- satz-/phrasenbasierte Einheit
- aktuelles Wort grün, Rest weiß
- max. zwei Zeilen
- Font 50 px, minimum 40
- Weight 800
- kein Stroke, Jump oder Scale-Pop
- bottom = 340
- pro Szene clippen; kein Wort der nächsten Szene darf vorher sichtbar sein

## 11. Phase-1-Animationscode — Premium Physical Animation V2

Technischer Basis-Lock:

```text
finanzneo-phase1-animation-code-v1
```

Premium-Visual-Lock:

```text
finanzneo-premium-physical-animation-v2
```

Detailquelle: `docs/PHASE-1-ANIMATION-CODE-STANDARD.md`.

### Pflichtlogik

```text
STARTZUSTAND
→ SICHTBARER PHYSISCHER MECHANISMUS
→ EINDEUTIGES ERGEBNIS
→ Ergebnis mindestens 15 Frames stabil
```

### Pflicht im Code

- `useCurrentFrame`
- `ANIMATION_COLORS`
- `prog`, `interpolate` oder `spring`
- `PremiumPhysicalStage`
- mindestens zwei `PhysicalObject`-Instanzen
- mindestens eine semantische Materialrolle neben Struktur
- Exportname wie `Scene02Animation`
- `RESULT_HOLD_FRAMES >= 15`
- `ANIMATION_NARRATIVE` mit START / MECHANISM / RESULT
- `PREMIUM_VISUAL_NARRATIVE` mit HERO / SUPPORT / MATERIAL / DEPTH

### Visuelle Pflicht

Animationen müssen **dieselbe massive Premium-Objektwelt wie die Flow-Bilder** verwenden:

- großes dominantes Hero-Objekt
- 2–4 konkrete Support-Objekte
- sichtbare Materialität und Dicke
- klare Tiefenstaffelung
- Kontakt-Schatten / Lichttrennung
- Creme/Weiß + semantische Akzente neben Grün
- Szene nutzt die Visualzone sichtbar aus

### Streng verboten

- Dashboard-/Control-Panel-Hauptkomposition
- Flowchart als Hauptkomposition
- kleine Boxen mit dünnen Linien
- generische Info-Cards als Hauptsprache
- monochrom-grüne Gesamtkomposition
- reine Texttafeln
- `Math.sin` / `Math.cos` als künstliches Dauerwackeln
- Debug-Boxen, Testflächen, Dummy-/Placeholder-Komponenten
- reine Zoom/Fade/Popup-Bewegung als komplette Erklärung
- Bewegung nur für Frame-Diff
- TODO/TBD/TEMP/„später hübsch machen“

Phase 3 darf diese Animationen weder kreativ ersetzen noch vereinfachen.

## 12. Phase-3-Animationsseal

Bei erfolgreichem `reel:ready` entsteht `05-projektdateien/phase1-animation-seal.json`.

Phase-3-Preflight verlangt:

- `componentPath` zeigt direkt auf die Phase-1-Datei
- Exportname entspricht `scene-index.json`
- Hash entspricht dem Seal
- Phase 3 hat die Datei nicht verändert

## 13. Animation-Dispatch

`ReelTemplate` behandelt `type: "animation"` als first-class Beat.
Jede Animationsszene braucht ein echtes `customAnimations[animationId]`-Binding.
Fehlt ein Binding, muss der Render **hart abbrechen**. CTA-, Caption-only- oder Dummy-Fallback ist verboten.

## 14. Timing

```text
finales Voiceover
→ echte Wort-Timings
→ Satz-/sinnvolle Phrasenanfänge
→ Szenenstarts
→ relative Animationsdauer
```

Keine pauschal gleich langen Szenen. Bildbeat >6 s = splitten oder animieren.

## 15. Phase-3-Fertigkeitsvertrag

Eine MP4 allein bedeutet **nicht fertig**.

Pflicht:

1. `npm run reel:ready -- <Reel>`
2. Phase-3-Manifest
3. lückenlose Implementierung aller Szenen
4. Candidate-Render
5. Post-Render-QA pro Szene
6. Bildszenen müssen visuell belegt sein
7. Animationsszenen müssen sichtbaren Inhalt + echte Veränderung zeigen
8. Audio-Stream, 1080×1920 und Timeline-Dauer prüfen
9. QA = `PASSED`
10. erst dann Final-MP4
11. Export mit Hash-Gate
12. erst erfolgreicher Export = `FINAL_COMPLETE`

Caption-only-Szenen, fehlende Visuals oder fehlende Animation-Bindings blockieren.

## 16. Audio

```text
Integrated Loudness ≈ -16 LUFS
True Peak ≤ -1 dBTP
```

Keine Ersatz-Audiodatei erzeugen. Nach Audioänderungen Wortzeiten/Timeline neu prüfen.

## 17. QA und Abschlussdefinition

Sofort korrigieren bei:

- falschem/fehlendem Bild
- schwacher/kleiner Bildkomposition
- UI-/Flowchart-Look
- fehlendem Material-/Tiefen-/Lichtkontrast
- Bildbeat >6 s
- Caption-only-Szene
- Header-Capsule/Chip/ALL-CAPS-Stil
- falscher Header-/Visual-/Captionposition
- Debug-/Placeholder-/Wackelanimation
- Animation ohne Start → Mechanismus → Ergebnis
- Animation ohne PremiumPhysicalStage / PhysicalObject
- Phase-3-Ersatz des Phase-1-Animationscodes
- fehlendem Animation-Binding
- fehlendem Audio

Ein Reel ist erst fertig, wenn Validatoren, Typecheck, Render, visuelle QA, komplette MP4 mit Ton und Export tatsächlich erfolgreich ausgeführt wurden.

## 18. Publishing

`04-caption/` enthält:

```text
caption.txt
instagram-reels.txt
tiktok.txt
facebook-reels.txt
snapchat.txt
word-timings.json
```

Keine `youtube-shorts.txt`.

## 19. Automatische Erstellung und Prüfung

Neues Reel:

```bash
npm run reel:create -- --target reels/<Woche>/<Tag>/<Reel> --title "Titel"
```

Der öffentliche Ersteller setzt automatisch:

- Flow Strict-Single-Job V3
- Premium Visual World V8
- Phase-3-Completion-Gate
- Reel-Layout V5
- Phase-1-Animationscode-Vertrag
- Premium Physical Animation V2

Prüfung:

```bash
npm run validate:image-world
npm run reel:validate -- <Reel-Pfad>
npm run reel:ready -- <Reel-Pfad>
```

## 20. Aktive Prioritäten

1. Premium Physical V8 Bildwelt konsequent halten
2. Premium Physical Animation V2 auf dasselbe Qualitätsniveau bringen
3. Phase-1-Animationscode final und hochwertig liefern
4. Plain Header + V5-Vertikallayout konsequent halten
5. Caption-System sauber und mobil lesbar halten
6. Phase-3-Completion-Gate nicht umgehbar halten
7. erst danach Serienproduktion skalieren

## 21. YouTube-Longform

YouTube-Projekte liegen ausschließlich unter `youtube/` und folgen `docs/YOUTUBE-LONGFORM-WORKFLOW.md` sowie `youtube/PRODUKTIONSSTANDARD.md`.

- 1920 × 1080, 16:9, 30 fps
- eigenständiges Longform-Konzept
- keine gestreckte Reel-Kopie
- keine YouTube Shorts
- YouTube-Bild-/Thumbnail-Regeln sind vom 1:1-Reel-Quellbildvertrag getrennt
