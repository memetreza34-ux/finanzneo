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

## 6. Google-Flow-Bildwelt — Stylized 3D Animated Black V9

Verbindliche Locks:

```text
FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
FINANZNEO_SERIES_LOCK: finanzneo-same-world-v1
PREMIUM_VISUAL_WORLD_LOCK: finanzneo-stylized-3d-animated-black-v9
GENERATED_IMAGE_ASPECT_RATIO: 1:1
```

### Zielbild

Die Bildwelt ist bewusst **nicht realistisch**.
Jedes Bild soll wie ein hochwertiger, klarer 3D-Animationsfilm-Frame wirken:

- stylized 3D animated
- soft rounded shapes
- vereinfachte, erkennbare Details
- clean materials
- premium, freundlich und leicht verspielt
- Inhalt und Verständlichkeit vor Deko
- jede Szene darf anders komponiert sein, muss aber klar aus derselben Welt kommen

### Schwarzer Hintergrund — Pflicht

Jedes Flow-Bild nutzt **einen nahtlosen deep-black Hintergrund**.

- clean und minimal
- keine helle Studiowelt
- keine Boden-Wand-Grenze
- kein Horizont
- keine farbigen Hintergrundzonen
- Motiv muss sich durch sauberes Licht klar vom Schwarz lösen

### Objekte und Komposition

Es gibt **keine feste Objektanzahl** und keinen festen Hero-Prozentkorridor.

- klare Hauptaussage oder Hauptaktion
- Support-Objekte nur, wenn sie die Erklärung verbessern
- keine Props zum Auffüllen
- 1 Objekt kann reichen; mehrere sind erlaubt, wenn sie sinnvoll sind
- Szene muss in ungefähr 1–2 Sekunden verständlich sein
- lieber einfach und stark als kompliziert und überladen

### Farbe

- Emerald Green = positiv / bevorzugt
- Warm Ivory + Soft Gray = neutral
- Gold = Geld / Wert
- Warm Red-Orange = Warnung / Kosten / Verlust
- Deep Black = Hintergrund

### Licht

- clean soft studio lighting
- klare Highlights
- lesbare Schatten
- gute Trennung vom schwarzen Hintergrund
- weiche Kontaktschatten

### Text im KI-Bild

- keine Headline
- kein Untertitel
- kein erklärender Satz
- kein CTA
- nur ausdrücklich verlangte kurze deutsche Labels

### Streng verboten

- Realismus / Photorealismus
- echter Produktfoto-Look
- Dashboard / App UI
- Flowchart als Hauptkomposition
- kleine Kästen, floating Info-Cards oder dichte technische Layouts
- Microchip-/Circuit-Board-Look
- Miniatur-Diorama
- unnötiger Clutter

### Prompt-Länge

Einzelprompts bleiben **mittel-lang**.
Die konkrete Bildidee kommt zuerst, danach ein kurzer Style-/Background-/Forbidden-Block.
Die Hauptidee darf nicht unter riesigen Regelblöcken verschwinden.

### Bild-QA

Bild neu erzeugen, wenn es realistisch oder produktfotoartig aussieht, der Hintergrund nicht tiefschwarz ist, die Aussage schwer verständlich ist, unnötiger Clutter entsteht oder die Szene wie UI/Flowchart wirkt.

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
→ V9-QA
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

Animationen müssen **zur Stylized 3D Animated Black V9 Bildwelt passen**:

- klar nicht realistisch
- soft rounded / vereinfachte 3D-Formen
- deep-black Hintergrund
- klare Hauptaktion
- keine feste Support-Objekt-Anzahl
- Emerald / Ivory / Soft Gray / Gold / Red-Orange semantisch einsetzen
- Szene nutzt die Visualzone sichtbar aus
- Mechanik muss sofort verständlich sein

### Streng verboten

- Dashboard-/Control-Panel-Hauptkomposition
- Flowchart als Hauptkomposition
- kleine Boxen mit dünnen Linien
- generische Info-Cards als Hauptsprache
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
- realistischer / produktfotoartiger Bildwelt
- nicht tiefschwarzem Flow-Hintergrund
- unklarer oder überladener Bildkomposition
- UI-/Flowchart-Look
- Bildbeat >6 s
- Caption-only-Szene
- Header-Capsule/Chip/ALL-CAPS-Stil
- falscher Header-/Visual-/Captionposition
- Debug-/Placeholder-/Wackelanimation
- Animation ohne Start → Mechanismus → Ergebnis
- Animation, die sichtbar nicht zur V9-Bildwelt passt
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
- Stylized 3D Animated Black V9
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

1. Stylized 3D Animated Black V9 Bildwelt konsequent halten
2. Animationen visuell auf dieselbe V9-Welt bringen
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
