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

Verbindliche Übergabe: **`docs/PHASE-1-BRIEFING.md`**.

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

**Phase 3 darf keine fehlende kreative Animation erfinden oder ersetzen.**
Insbesondere verboten: Debug-Rechtecke, Testflächen, Dummy-Komponenten, künstliches Dauerwackeln oder andere technische Hacks, nur damit QA/Frame-Diff besteht.

`npm run reel:ready -- <Reel-Pfad>` versiegelt den kanonischen Phase-1-Animationscode per SHA-256. Danach blockiert der Phase-3-Preflight jede Änderung oder Ersatzkomponente.

Vollständiger Ablauf: `docs/3-PHASEN-WORKFLOW.md`.

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
└── animation.tsx   ← kanonische Phase-1-Produktionsquelle
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

## 6. Google-Flow-Bildwelt

Verbindliche Locks:

```text
FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
FINANZNEO_SERIES_LOCK: finanzneo-same-world-v1
STYLIZED_3D_LOCK: finanzneo-stylized-3d-editorial-v5
PHYSICAL_EXPLAINER_LOCK: finanzneo-physical-explainer-editorial-v7
GENERATED_IMAGE_ASPECT_RATIO: 1:1
```

### Bildstil

- premium stylized 3D CGI financial editorial explainer
- ein großes physisches Hero-Objekt
- 3–6 konkrete themenspezifische physische Objekte
- chunky volumetrische Geometrie, rounded forms, soft bevels
- deep charcoal green-black Grundwelt
- Emerald/Mint als Signatur
- Gold nur für Geld/Wert
- warmes Rot-Orange nur für Risiko/Verlust/Warnung
- cinematic soft key light + emerald rim light
- klare Tiefenstaffelung und Kontakt-Schatten
- keine Fotorealistik, kein Pixar/Clay/Toy

### Streng verboten

- Dashboard/App-UI/Control Panel
- floating UI cards/tiles/buttons/HUD
- Microchip/Circuit-Board
- Gameboard
- Orbit-/Satellitenmodule
- symmetrische Vier-Ecken-Kacheln
- Neon-Liniennetz als Hauptmotiv
- Mini-Diorama
- sterile Produktwerbung
- sichtbare Hintergrundbänder
- Floor-Wall-Grenze oder Horizont

### Hintergrund

Jedes Bild nutzt **einen einzigen nahtlosen deep-charcoal-green-black Hintergrund von oben bis unten**. Keine Prozent-Zonen, keine Panels, keine horizontale Trennung.

### Text im KI-Bild

- keine Headline
- kein Untertitel
- kein erklärender Satz
- nur wenige kurze deutsche Objektlabels, normalerweise 1–3 Wörter

### Person

Optional stilisierte anonyme erwachsene Person. Wenn vorhanden: Gesicht mit Augen, Nase und Mund klar sichtbar; keine Rückenansicht, kein Fotorealismus.

## 7. Google Flow — Strict Single Job

Verbindlicher Ausführungsmodus:

```text
FLOW_EXECUTION_MODE: finanzneo-flow-strict-single-job-v3
FLOW_STATE_MACHINE: finanzneo-flow-state-machine-v1
```

Zu jedem Zeitpunkt darf maximal **ein** Bildjob laufen:

```text
aktuellen Prompt lesen
→ GENAU EIN Bild starten
→ intern vollständig auf Ergebnis warten
→ sofort exakt umbenennen
→ QA
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

Technische Quelle: **`src/brand/tokens.ts -> REEL_STYLE`**.

```text
Header               Y = 154
Visualzone           Y = 320–1480
Untertitel           bottom = 340
Caption links        72
Caption rechts       140
Szenenübergang       3 Frames
```

Ziel:

- oben mehr ruhige Luft
- Header etwas tiefer
- kleinerer Abstand zwischen Header und Visual
- Bilder und Animationen höher
- Untertitel höher
- unten wieder mehr ruhige Luft

Reels dürfen diese Werte nicht lokal überschreiben.

## 9. Szenenüberschrift V5 — normal statt UI-Chip

Jede Szene zeigt eine kurze normale Überschrift mit passendem Linien-Icon.

Verbindlich:

- mittig
- **Sentence Case / natürliche Schreibweise**
- Text neutral weiß
- semantische Farbe primär über das Icon
- Default/positiv = grünes Icon
- Warning = rotes Icon
- Money = goldenes Icon
- Neutral = weißes Icon
- 3–6 Wörter als Richtwert
- Aussage oder Frage, nie nur Zahl/Stichwort
- jede Szene passendes Icon

Streng verboten:

- automatische ALL-CAPS-Transformation
- Header-Capsule
- Chip
- Pill
- Panel/Box um die Überschrift
- künstlich technische UI-Optik

Standard:

```tsx
<SceneHeader title="Lokale Währung ist oft günstiger" icon="repeat" />
```

## 10. Untertitel

Standard: `src/brand/components/Captions.tsx`.

- genau eine satz-/phrasenbasierte Einheit
- aktuelles Wort grün
- Rest weiß
- max. zwei Zeilen
- Font 50 px, minimum 40
- Weight 800
- kein `WebkitTextStroke`
- kein Jump/Scale-Pop
- kein gelbes/goldenes Active-Word
- kein schwarzer Text
- **bottom = 340**
- pro Szene clippen: kein Wort der nächsten Szene darf vorher sichtbar sein

## 11. Phase-1-Animationscode — höchste Animationsregel

Detailquelle: **`docs/PHASE-1-ANIMATION-CODE-STANDARD.md`**.

Jede Animation muss bereits in Phase 1 als finale `animation.tsx` existieren.

### Pflichtlogik

```text
STARTZUSTAND
→ SICHTBARER MECHANISMUS
→ EINDEUTIGES ERGEBNIS
→ Ergebnis mindestens 15 Frames stabil
```

### Pflicht im Code

- `useCurrentFrame`
- `AnimationStage`
- `ANIMATION_COLORS`
- `prog`, `interpolate` oder `spring`
- Exportname wie `Scene02Animation`
- `RESULT_HOLD_FRAMES >= 15`
- Kommentarblock:

```text
ANIMATION_NARRATIVE
START: konkrete sichtbare Ausgangslage
MECHANISM: konkrete sichtbare Veränderung
RESULT: konkretes sichtbares Ergebnis
```

### Streng verboten

- `Math.sin` / `Math.cos` als künstliche Dauer-Wackelbewegung zur QA-Umgehung
- wackelnde Rechtecke
- Debug-Boxen
- bunte Testflächen
- Dummy-/Placeholder-Komponenten
- generische Cards + Text ohne Mechanismus
- reine Zoom/Fade/Popup-Bewegung als komplette Erkläranimation
- TODO/TBD/TEMP/„später hübsch machen“
- Bewegung nur, damit Frame-Diff > 0 ist
- schwarzer Text auf dunklem Hintergrund

Die Animation muss ohne Ton grundsätzlich verständlich sein und optisch dieselbe V5-Visualzone (`320–1480`) wie die Bildszenen nutzen.

## 12. Phase-3-Animationsseal

Bei erfolgreichem `reel:ready` entsteht:

```text
05-projektdateien/phase1-animation-seal.json
```

Darin steht der SHA-256-Hash jeder kanonischen `animation.tsx`.

Phase-3-Preflight verlangt:

- `componentPath` zeigt direkt auf diese Phase-1-Datei
- Exportname entspricht `scene-index.json`
- Hash entspricht dem Seal
- Phase 3 hat die Datei nicht verändert

Damit kann Phase 3 die Animation weder durch eine eigene Ersatzkomponente noch durch einen QA-Hack ersetzen.

## 13. Animationsfarben

`ANIMATION_COLORS` ist verbindlich:

- Weiß = neutral
- Grün = Fokus/Lösung
- Rot = Problem/Warnung/Verlust
- Gold = Geld/Wert
- Schwarz auf dunklem Reel-Hintergrund = verboten

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
9. QA muss `PASSED` sein
10. erst dann Final-MP4
11. Export mit Hash-Gate
12. erst erfolgreicher Export = `FINAL_COMPLETE`

Caption-only-Szenen oder fehlende Visuals blockieren.

## 16. Audio

Ziel im finalen Export:

```text
Integrated Loudness ≈ -16 LUFS
True Peak ≤ -1 dBTP
```

Keine Ersatz-Audiodatei erzeugen. Nach Audioänderungen Wortzeiten/Timeline neu prüfen.

## 17. QA und Abschlussdefinition

Sofort korrigieren bei:

- falschem/fehlendem Bild
- Bildbeat >6 s
- fehlendem Visual
- Caption-only-Szene
- Header-Capsule/Chip/ALL-CAPS-Stil
- falscher Header- oder Visualposition
- Untertitel zu tief oder Vorgreifen in nächste Szene
- Debug-/Placeholder-/Wackelanimation
- Animation ohne Start → Mechanismus → Ergebnis
- Phase-3-Ersatz des Phase-1-Animationscodes
- Animation ohne verständliche Aussage
- schwarzem Text auf dunklem Hintergrund
- zu kleiner/verlorener Animation
- überlappenden Elementen
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

Phase 3 endet mit vollständigem `06-export/`:

```text
<reel-name>.mp4
cover.png / entsprechendes Coverformat
bilder.zip
caption-universal.txt
caption-instagram.txt
caption-tiktok.txt
caption-facebook.txt
caption-snapchat.txt
untertitel.srt
UPLOAD.md
```

## 19. Automatische Erstellung und Prüfung

Neues Reel:

```bash
npm run reel:create -- --target reels/<Woche>/<Tag>/<Reel> --title "Titel"
```

Der öffentliche Ersteller setzt automatisch:

- Flow Strict-Single-Job V3
- Phase-3-Completion-Gate
- Reel-Layout V5
- Phase-1-Animationscode-Vertrag

Prüfung:

```bash
npm run reel:validate -- <Reel-Pfad>
npm run reel:ready -- <Reel-Pfad>
```

`reel:validate` blockiert unter anderem falsches V5-Layout, unvollständige Animationsquellen und Placeholder-/Wackel-Hacks.

## 20. Aktive Prioritäten

1. Phase-1-Animationscode final und hochwertig machen
2. Plain Header + V5-Vertikallayout konsequent halten
3. Stylized-3D/Physical-Explainer-V7-Bildwelt konsistent halten
4. Caption-System sauber und mobil lesbar halten
5. Phase-3-Completion-Gate nicht umgehbar halten
6. erst danach größere Serienproduktion skalieren

## 21. YouTube-Longform

YouTube-Projekte liegen ausschließlich unter `youtube/` und folgen `docs/YOUTUBE-LONGFORM-WORKFLOW.md` sowie `youtube/PRODUKTIONSSTANDARD.md`.

- 1920 × 1080, 16:9, 30 fps
- eigenständiges Longform-Konzept
- keine gestreckte Reel-Kopie
- keine YouTube Shorts
- YouTube-Bild-/Thumbnail-Regeln sind vom 1:1-Reel-Quellbildvertrag getrennt
