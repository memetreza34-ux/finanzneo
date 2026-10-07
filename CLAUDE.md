# FinanzNeo — verbindliches Projekt-Gehirn

> Höchste interne Quelle für Reel-Produktion. Bei Widersprüchen mit älteren Dateien gilt immer diese Datei. Für **neu erzeugte Reels mit `futureProductionStandard.id = finanzneo-future-production-v3`** gelten zusätzlich die strengeren Future-V3-Regeln aus `docs/FUTURE-REEL-PRODUCTION-V3.md`; ältere Reels werden nicht rückwirkend migriert.

## 1. Kanal und Format

- Kanal: **FinanzNeo**
- Sprache: Deutsch
- Themen-Scope: **alles rund um Finanzen**, solange ein klarer Bezug zu Geld, finanziellen Entscheidungen, Märkten, Unternehmen, Verbrauchern oder Wirtschaft besteht
- FinanzNeo ist **kein reiner Einsteigerkanal**. Er darf Grundlagen, fortgeschrittene Themen, aktuelle Finanz-News, Gesetzesänderungen, Rankings/Listicles, Fallbeispiele, Betrugsmaschen, Unternehmen, Banken, Börse, ETFs/Aktien/Krypto, Kredite, Steuern, Versicherungen, Immobilien, Gehalt, Rente, Sozialleistungen, Konsum, Inflation und wirtschaftliche Entwicklungen behandeln
- Stil: auch komplexe Themen einfach, professionell und verständlich erklären; **die Sprache ist zugänglich, nicht die Themenauswahl eingeschränkt**
- Reel-Plattformen: TikTok, Instagram Reels, Facebook Reels, Snapchat
- YouTube: ausschließlich Longform unter `youtube/`; **keine YouTube Shorts**
- Reel: 1080 × 1920, 9:16, 30 fps; typischerweise ca. 45–70 Sekunden, aber Inhalt und echtes Voiceover entscheiden

Kanonischer Themen-Scope: `docs/CONTENT-SCOPE.md`.

## 2. Repository-Sicherheit

- nie direkt auf `main` arbeiten
- neuer Auftrag = eigener Branch
- bestehende Reels nur ändern, wenn ausdrücklich Ziel des Auftrags
- kein Merge, Force-Push, History-Rewrite oder Branch-/Reel-Löschen ohne ausdrückliche Freigabe
- Validatoren, Tests und Gates nie abschwächen, nur damit etwas grün wird
- technischer Erfolg darf niemals mit Platzhaltern oder visueller Minderqualität erkauft werden

## 3. Drei Phasen — harte Verantwortungsgrenze

### Phase 1 — ChatGPT

Phase 1 liefert vollständig:

- Recherche + Quellen
- geprüftes Voiceover-Skript
- Dramaturgie und Szenenplan
- Bild-/Animations-Zuordnung
- Google-Flow-Prompts
- natürliche Szenenüberschriften + passende Icons
- Remotion-Spezifikationen
- **produktionsreife `animation.tsx` für jede Animationsszene**
- genau eine universelle Social-Caption: `04-caption/caption.txt`

Phase 1 ist erst fertig, wenn keine Platzhalter mehr vorkommen und Phase 3 keine kreative Animation mehr erfinden muss.

### Phase 2 — Nutzer

- erzeugt die Szenenbilder mit Google Flow; **scene-01 ist automatisch das Cover**, kein separater Cover-Bildjob und kein Bild 00
- legt alle finalen Bilder exakt benannt in `03-szenen/00-ALLE-BILDER-HIER-REIN/`
- legt genau ein finales Voiceover in `02-audio/`
- erzeugt echte Wort-Zeitstempel
- finale Flow-Bilder und das Haupt-Voiceover bleiben Nutzerverantwortung; kein Agent ersetzt oder generiert sie eigenmächtig

### Phase 3 — Antigravity oder Claude Code

`scene-index.json -> phase3Executor` bestimmt den Executor.

Phase 3 darf ausschließlich:

- finale Nutzerbilder integrieren
- den **versiegelten Phase-1-Animationscode** verwenden
- Timeline, Header und Captions integrieren
- bereits freigegebene SFX aus dem kanonischen Cue-Plan lokal und framegenau integrieren; optionale SFX dürfen vor dem finalen Render über den konfigurierten Sound-Skill erzeugt werden, niemals das Voiceover
- Playwright Visual QA gegen die lokale Remotion-Preview ausführen und sichtbare Fehler an der kanonischen Quelle beheben
- Preflight, Candidate-Render, Render-QA und Export ausführen

Phase 3 darf versiegelte Animationen **nicht kreativ ersetzen, vereinfachen oder neu erfinden**. Eine neue Animations-/Lottie-Idee nach dem Seal bedeutet zurück zu Phase 1, Änderung der kanonischen Quelle, erneute Validation und erneutes Seal.

## 4. Reel-Struktur

**Cover-Regel:** `scene-01` ist immer eine Bildszene und automatisch das Cover. Es wird kein separates Cover und kein `Bild 00` erzeugt. `03-szenen/00-cover/cover.txt` ist nur ein technischer Alias/Vertrag auf das Bild von `scene-01`.

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

## 5. Dramaturgie, Timing und Visual Beats

VISUAL_BEAT_COMPATIBILITY_BASE: finanzneo-visual-beats-v1
FUTURE_PRODUCTION_STANDARD: finanzneo-future-production-v3

- Hook in den ersten 2 Sekunden
- **keine feste Szenenzahl**: so wenige Szenen wie möglich, so viele wie nötig
- Visual Beats werden unabhängig von der Szenenzahl geplant; erst gesprochene Gedanken, dann sichtbare Beats, dann Szenengruppierung
- **1 gesprochener Gedanke = 1 sichtbarer Visual Beat**
- ein Satz darf ein eigenes Bild bekommen; enthält er zwei Aktionen, Beispiele, einen Vergleich oder Vorher/Nachher, wird er bei Bedarf in mehrere Beats geteilt
- mehrere Bildszenen direkt hintereinander sind erlaubt, wenn jedes neue Bild die Aussage sichtbar weiterführt
- Kompatibilitätsbasis älterer Reels: statischer Bildbeat ca. 1,8–3,4 s, max. 4,5 s. **Neue Future-V3-Reels:** ideal 1,8–3,0 s; ab ca. 3,6 s aktiv einen zusätzlichen Visual Beat prüfen; ohne neue sichtbare Information **hart max. 4,0 s**
- Animationen dürfen länger sein, müssen aber währenddessen mehrere klar unterschiedliche Zustände zeigen; Kamera-Push/Zoom allein zählt nicht als neuer Beat
- Voiceover und Visual müssen gemeinsam fortschreiten: ist die Bildaussage bereits verstanden, darf das Bild nicht unnötig stehen bleiben
- ungefähr 60 % Bild / 40 % Animation ist nur ein Richtwert; bei einfachen Erklärungen sind bewusst mehr Bilder erlaubt
- echte Wort-Zeitstempel bestimmen finale Schnitte und Szenendauern; keine künstlich gleich langen Szenen
- kurze klare Sätze, kein unnötiger Fachjargon
- Logik: Hook → Problem → Erklärung → Beispiel → Lösung/Merksatz; CTA nur wenn er wirklich passt
- Zahlen nur nach Prüfung; Beispielannahmen klar kennzeichnen

## 6. Bildwelt — Editorial Finance V1

Verbindlich:

```text
FINANZNEO_IMAGE_WORLD: finanzneo-editorial-finance-v1
FINANZNEO_IMAGE_SERIES: finanzneo-editorial-consistency-v1
```

Kanonische Quelle: `docs/FINANZNEO-IMAGE-WORLD.md`.

Grundlogik:

```text
1 gesprochener Gedanke
→ 1 einfache visuelle Idee
→ auf den ersten Blick verständlich
→ dann die passende Editorial-Darstellung wählen
```

Die Bildwelt ist flexibel:

- saubere Editorial-Finanzillustration
- überwiegend 2D oder leichtes 2.5D
- einfaches 3D nur wenn es dem Motiv wirklich hilft
- Hintergründe frei nach Motiv: warmes Off-White, Creme, helles Grau, gedämpfte Farbe, Anthrazit oder Schwarz
- Metaphern, Diagramme, Timelines, Vergleiche, Dokumente, Personen, Unternehmen/Marken und einfache Alltagsszenen sind erlaubt
- Text im Bild darf Zahlen, kurze Labels, Daten, Zitate oder Dokumenttext enthalten, wenn er erklärt statt dekoriert
- kein automatischer Headline-Zwang
- Finanzobjekte sind nicht in jedem Bild Pflicht; eine einfache allgemeine Metapher darf den Satz besser erklären

AI-Slop vermeiden: keine automatisch hinzugefügten Neon-Finanzwelten, Hologramme, Coin-Regen, futuristischen Dashboards, Miniaturstädte, Energie-Netzwerke, Podeste, Spielzeug-3D-Blöcke oder „cinematic finance“-Dekoration ohne echten Erklärwert.

### Progressive Bildfolgen

Mehrere Bildszenen dürfen dieselbe Grundkomposition stufenweise weiterentwickeln. Wenn Szene B auf Szene A aufbaut:

1. Szene A vollständig erzeugen und freigeben.
2. Für Szene B das **exakte freigegebene Bild aus Szene A als echte Bildreferenz anhängen**.
3. Der Prompt von Szene B bleibt vollständig und selbstständig formuliert.
4. Nur die geplante neue Information ergänzen oder ändern.
5. Für weitere Schritte jeweils das zuletzt freigegebene Bild als Referenz verwenden.

Nur „wie vorher“ oder „gleiches Bild“ in Textform reicht nicht ohne echte Referenzdatei.


## 7. Google Flow — Strict Single Job V3

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
→ erst nach PASS nächsten Bildblock freischalten
```

Verboten: Batch, parallele Jobs, Queue späterer Bilder, Kontaktbogen/Galerie als Ersatz, Nutzer-„weiter“ zwischen Bildern und Bild-zu-Bild-Referenzen.

## 8. Finales Reel-Layout V5

**Einzige technische Wahrheit:** `src/brand/tokens.ts -> REEL_STYLE`.

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

Reels dürfen diese Werte nicht lokal überschreiben.

### Header

- reines Weiß `#FFFFFF`
- Sentence Case / natürliche Schreibweise
- passendes Linien-Icon daneben
- semantische Farbe primär im Icon
- keine Capsule / Chip / Pill / Box
- kein automatisches ALL CAPS
- lange Titel umbrechen auf maximal zwei Zeilen statt auf kleine Label-Größe zu schrumpfen
- Icon immer in festem Slot und optisch normalisiert; unterschiedliche SVG-ViewBox-Füllungen dürfen nicht wie verschiedene Größen wirken
- bei zweizeiligen Titeln bleibt das Icon an der **ersten Textzeile** verankert und springt nicht vertikal
- die gesamte Header-Gruppe bleibt zentriert, der Text innerhalb der Gruppe ist linksbündig, damit der Abstand Icon → erste Textzeile konstant bleibt

### Visual-Safe-Zone

`AnimationStage` clippt produktive Animationen **hart auf Y320–1400**, während ihr internes 1080×1920-Koordinatensystem erhalten bleibt.

Damit gilt:

- kein Animationsinhalt sichtbar im Headerbereich
- kein Animationsinhalt sichtbar in der Caption-Zone
- Bilder und Animationen benutzen dieselbe visuelle Hauptzone

### SourceNote

Quellenhinweise liegen zentral oberhalb der Caption-Zone und dürfen zweizeilige Captions nicht überdecken.

## 9. Untertitel

Standard: `src/brand/components/Captions.tsx`.

- aktuelles Wort grün, Rest weiß
- max. zwei Zeilen
- Standard 50 px, Minimum 40 px
- Weight 800
- kein Stroke, Jump oder Scale-Pop
- `bottom = 340`
- pro Szene clippen; kein Wort der nächsten Szene darf vorgreifen

## 10. Remotion-Hintergrund — Pure Black V1

Der einzige produktive Reel-Hintergrund ist:

```text
#000000
statisch
```

`FinanceBackground` bleibt der technische äußere Reel-Canvas. Neue Animationen dürfen innerhalb ihrer Visualzone über `EditorialMotionStage` eine ruhige helle oder gedämpfte Editorial-Fläche erzeugen. Das verändert weder Header noch Captions noch den äußeren Reel-Canvas.

Streng verboten als Reel-Hintergrund:

- Partikel
- Aurora
- Grid
- Glow-Feld
- Vignette
- dekorative Gradient-Fläche
- Hintergrundbewegung

Hintergrundbewegung zählt niemals als Szenenanimation oder QA-Nachweis.

## 11. Phase-1-Animationscode — Editorial Motion V1

Basis-Lock:

```text
finanzneo-phase1-animation-code-v1
```

Aktive Motion-Welt für neue Reels:

```text
finanzneo-editorial-motion-v1
```

Visuelles Ziel:

```text
finanzneo-editorial-finance-v1
```

Kanonische Regel: `docs/FINANZNEO-EDITORIAL-MOTION-V1.md`.

Pflichtlogik:

```text
SPRECHPUNKT
→ WAS MUSS SICH SICHTBAR VERÄNDERN?
→ EINFACHSTE KLARE MOTION
→ EINDEUTIGES ERGEBNIS
→ Ergebnis mindestens 15 Frames stabil
```

Neue Animationen:

- 2D oder leichtes 2.5D bevorzugen
- matte, ruhige Formen
- wenige große Elemente
- Creme / Off-White / Hellgrau / gedämpfte Farbe als bevorzugte Animationsfläche
- Dark nur wenn inhaltlich sinnvoll
- einfaches 3D nur wenn Tiefe wirklich hilft
- Kamera standardmäßig still
- **eine** klare Hauptbewegung kann vollständig reichen
- keine Pflicht für mehrere Motion-Channels
- keine Pflicht für Physical Objects

Bei Library-Best-Fit:

```text
src/finance-motion/editorial-v1.tsx
FINANCE_MOTION_LIBRARY: finanzneo-editorial-motion-library-v1
```

Bei Custom-Build:

- `useCurrentFrame`
- `EDITORIAL_MOTION_COLORS`
- `prog`, `interpolate` oder `spring`
- framegenaue sichtbare Veränderung
- gleiche Editorial-Sprache wie die Flow-Bildwelt

Pflichtkommentare:

```text
ANIMATION_NARRATIVE
START
MECHANISM
RESULT

EDITORIAL_VISUAL_NARRATIVE
HERO
SUPPORT
SURFACE
SHAPE_LANGUAGE
```

Streng nicht als neue Default-Sprache verwenden:

- `PremiumPhysicalStage`
- alte `Physical*`-Primitives
- glänzende 3D-Münzen
- Podeste
- Metall-/Material-Showcase
- Neon / Hologramm / Coin-Spektakel
- Dashboard-/Control-Panel-Look
- Partikel-/Aurora-/Grid-Hintergrund
- unnötige Kamerafahrt
- künstlich viele Motion-Channels
- reine Bewegung nur für Frame-Diff
- Dummy-/Placeholder-/Debug-Flächen
- `Math.sin` / `Math.cos` als Dauerwackeln

Animationen müssen die Aussage **einfacher** machen und wie die bewegte Version der neuen FinanzNeo-Bildwelt aussehen.


## 12. Phase-3-Seal und Dispatch

`npm run reel:ready -- <Reel-Pfad>` versiegelt jede kanonische `animation.tsx` per SHA-256.

Phase 3 verlangt danach:

- exakten `componentPath`
- exakten Export
- unveränderten Hash
- echtes `customAnimations[animationId]`-Binding

Fehlt ein Binding: **Render hart abbrechen.** Kein CTA-/Text-/Black-Screen-Fallback.

## 13. Phase-3-Completion-Gate

Eine vorhandene MP4 bedeutet **nicht fertig**.

Pflichtkette:

```text
reel:ready
→ Phase-1-Animation-Seal
→ Phase-3-Preflight
→ Candidate Render
→ Post-Render-QA
→ Final MP4
→ automatischer reel:export nach 06-export/
→ FINAL_COMPLETE
```

Post-Render-QA muss mindestens prüfen:

- jede Szene hat echten visuellen Inhalt
- Header + Caption + Schwarz allein zählen nicht als Szenenvisual
- Bildszene zeigt wirklich das Nutzerbild
- Animationsszene zeigt echte Mechanik und sichtbare Veränderung
- Hintergrundbewegung zählt nicht
- freier Reel-Hintergrund bleibt schwarz
- Audio, Auflösung und Timeline stimmen
- bei Future-V3-Reels wird der Candidate **vor** der Render-QA automatisch auf -16 LUFS / -1 dBTP gemastert und danach real gemessen; bloß vorhandener Audio-Stream reicht nicht

Ein schwarzes/leeres oder Caption-only Reel darf niemals als fertig gelten.

## 14. Publishing

Für alle Reel-Plattformen gibt es genau **eine** Social-Caption.

Kanonische Quelle:

```text
04-caption/caption.txt
```

Finaler Export:

```text
06-export/caption-universal.txt
```

Dieselbe Caption wird für Instagram Reels, TikTok, Facebook Reels und Snapchat verwendet. Separate Dateien wie `instagram-reels.txt`, `tiktok.txt`, `facebook-reels.txt` oder `snapchat.txt` sind in aktiven Reel-Projekten verboten. YouTube Shorts existieren nicht; YouTube bleibt Longform unter `youtube/`.

## 15. Produktionsbefehle

Im normalen Phase-3-Lauf wird `reel:export` nach bestandener Render-QA automatisch von `render-validated.mjs` gestartet. Der direkte Befehl bleibt nur für einen kontrollierten erneuten Export vorhanden.

```bash
npm run reel:create -- --target <Reel-Pfad> --title "Titel"
npm run reel:validate -- <Reel-Pfad>
npm run reel:ready -- <Reel-Pfad>
npm run reel:phase3:preflight -- <Reel-Pfad>
npm run reel:export -- <Reel-Pfad>
```

Kein Agent darf einen fehlgeschlagenen Gate umgehen.
