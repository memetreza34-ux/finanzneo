# FinanzNeo-Reel-Produktionsstandard

> Bei Widersprüchen gilt immer `CLAUDE.md`.

## 1. Einfache Reel-Struktur

```text
01-script/
02-audio/
03-szenen/
04-caption/
05-projektdateien/
README.md
```

Keine doppelten Hauptordner für Script, Bilder, Caption, Review, Export oder Video anlegen, wenn sie nicht technisch zwingend nötig sind.

`04-caption/` enthält Master-Caption, Reel-Plattformtexte und Wort-Timings:

```text
caption.txt
instagram-reels.txt
tiktok.txt
facebook-reels.txt
snapchat.txt
word-timings.json
```

**YouTube-Regel:** Keine YouTube Shorts. Reel-Projekte erzeugen keine `youtube-shorts.txt`. YouTube ist ausschließlich für eigenständige längere Videos unter `youtube/` vorgesehen.

## 2. Genau eine Produktionsquelle pro Szene

### Bildszene

```text
scene-XX/
├── bildprompt.txt
└── szene.md
```

Das finale Nutzerbild wird zunächst nicht manuell in den Szenenordner gelegt, sondern nach vollständiger Google-Flow-Produktion gemeinsam gesammelt.

### Remotion-Szene

```text
scene-XX/
├── remotion.md
└── szene.md
```

Eine Remotion-Szene enthält keinen Bildprompt und erzeugt kein Bild.

## 3. Google Flow — Einzelbild-Ablauf

Einzige Übergabedatei an den Google-Flow-KI-Agenten:

```text
03-szenen/alle-bildprompts.txt
```

Protokoll-ID: `finanzneo-flow-sequential-v1`.

Formatregel: Google Flow erzeugt Cover und Szenenbilder immer quadratisch `1:1`. Das fertige Reel bleibt `9:16`; Remotion platziert die 1:1-Bilder mit `contain`.

```text
PROMPT LESEN
→ GENAU EIN BILD ERZEUGEN
→ VOLLSTÄNDIG WARTEN
→ SOFORT ENDGÜLTIG UMBENENNEN
→ MOTIV + LABELS + GESICHT + HINTERGRUND + DATEINAME PRÜFEN
→ ERST DANN NÄCHSTES BILD
```

Keine 3er-Batches, keine parallele Vorbereitung und kein späteres Sammel-Umbenennen. Bei einem Fehler dieselbe Bildnummer neu erzeugen und erst nach bestandener QA fortfahren.

### Keine Bild-zu-Bild-Referenz

Für Reel-Bilder wird **kein** Cover oder vorheriges Szenenbild als Image-to-Image-/Referenzbild hochgeladen.

Die Same-World-Konsistenz entsteht ausschließlich durch denselben ausgeschriebenen Lock für:

- World ID
- Stylized-3D-Look
- Materialien
- Geometriesprache
- Farbrollen
- Hintergrund
- Lichtsignatur

So bleibt der Stil einheitlich, ohne dass Flow Kamera, Silhouette oder Komposition des Covers in alle Folgebilder kopiert.

## 4. Nummerierung

Bildnummer = echte chronologische Szenennummer.

```text
Bild 00 = Cover
Bild 01 = Szene 01
Bild 02 = Szene 02
...
```

Animationsszenen behalten ihre Nummer, bekommen aber kein Bild.

Beispiel:

```text
Szene 01 = Bild      → Bild 01
Szene 02 = Animation → kein Bild 02
Szene 03 = Bild      → Bild 03
```

Nie nach der Anzahl tatsächlich erzeugter Bilder neu nummerieren. `03-szenen/scene-index.json` ist die technische Autorität.

## 5. Dateiname direkt an jedem Prompt

In `03-szenen/alle-bildprompts.txt` und jedem einzelnen `bildprompt.txt` steht direkt der endgültige Dateiname:

```text
Bild XX - Kurzer Szenenname.png
```

Animationsszenen stehen chronologisch an ihrer Stelle mit `KEIN BILD XX ERZEUGEN`.

## 6. Finaler Sammelordner

Erst wenn alle Bilder einzeln erzeugt, umbenannt und geprüft wurden, kommen sie gemeinsam nach:

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

Google Flow verteilt die Bilder nicht auf einzelne Szenenordner.

## 7. Antigravity erzeugt keine Bilder

- Der Nutzer erstellt Cover und finale Szenenbilder selbst.
- Antigravity erstellt Recherche, Skript, Szenenplan, Bildprompts, Dateinamen, Remotion, Captions und technische Verarbeitung.
- Fehlt ein Nutzerbild, genaue fehlende Datei melden und warten.
- Keine Ersatzbilder, Stockbilder oder integrierte Bildgeneratoren verwenden.

## 8. Verbindliche Bildwelt

World ID:

```text
finanzneo-connected-studio-v3
```

Series Lock:

```text
finanzneo-same-world-v1
```

Stylized-3D-Lock:

```text
finanzneo-stylized-3d-editorial-v5
```

Verbindlich:

- `CLAUDE.md`
- `docs/IMAGE-SYSTEM.md`
- `docs/FINANZNEO-VISUAL-TIMING-AND-CLARITY-STANDARD.md`
- `docs/FINANZNEO-CAPTION-AND-SCENE-DESIGN-V2.md`
- `docs/IMAGE-PROMPT-LIBRARY.md`
- `docs/IMAGE-QA-CHECKLIST.md`

Stil:

- clearly stylized premium 3D CGI financial editorial explainer
- erkennbare Alltagsobjekte, aber chunky/volumetrisch modelliert
- abgerundete Formen und soft bevelled edges
- leicht überzeichnete statt fotorealistische Proportionen
- tiefe charcoal green-black Grundwelt
- emerald/mint Akzente
- Gold nur für Geld/Wert
- warmes Rot-Orange nur für Risiko/Verlust/unnötige Kosten
- cinematic soft key light + emerald rim light
- klare Vorder-/Mittel-/Hintergrundtiefe
- keine fotorealistischen Papier-/Büro-/Stockfoto-Stillleben
- kein Pixar, Clay oder Toy-Look
- keine Dioramen, Neon-Tunnel, Sci-Fi-Korridore, Dashboards oder Game-Level

## 9. Kritische Hintergrundregel — genau EIN Hintergrund

**Keine Prozent-Zonen verwenden.**

Jedes Bild nutzt genau einen nahtlosen Hintergrund von oben bis unten:

```text
Use ONE single seamless continuous deep charcoal green-black background across the entire square 1:1 image.
Keep the same continuous material, tone and gradient from top edge to bottom edge.
No horizontal divisions.
No visible top section or bottom section.
No separate zones or panels.
No dark/light band at the top or bottom.
No floor-wall boundary.
No horizon line.
No studio wall split.
Use only one subtle continuous gradient/vignette.
Do not create a visible floor, wall or studio horizon.
Objects may cast soft contact shadows.
Place the main subject around the visual center and leave generous natural empty space above and below without changing the background.
```

Verboten:

- `top 15 / middle 60 / bottom 25`
- andere harte Prozentbereiche
- sichtbare horizontale Tonwertkante
- Boden-/Wand-Trennung
- oberes/unteres Band
- mehrere Hintergrund-Panels

## 10. Personenregel

Wenn eine Person vorkommt:

- klare stilisierte Augen, Nase und Mund
- Gesicht gut sichtbar
- frontal oder natürliche 3/4-Ansicht bevorzugt
- keine gesichtslose Figur
- keine reine Rückenansicht
- keine reale/identifizierbare Person

## 11. Text im KI-Bild

Erlaubt:

- nur explizit vorgegebene kurze deutsche Objektlabels
- meist 1–3 Wörter
- direkt am passenden Objekt

Verboten:

- große Überschrift
- Untertitel
- ganzer erklärender Satz
- CTA
- zufällige Zusatztexte

Reale Marken/Dienste dürfen als relevante Alltagsbeispiele verwendet werden, wenn ihre Namen korrekt geschrieben werden und keine erfundene Partnerschaft suggeriert wird.

## 12. Darstellung in Remotion

- Bild mit `object-fit: contain`
- keine sichtbare unscharfe Kopie desselben Bildes im Hintergrund
- Source-Crop oben höchstens `0.20`
- Source-Crop unten höchstens `0.20`
- Source-Crop insgesamt höchstens `0.34`
- zusätzliche Skalierung höchstens `1.04`
- wichtige Motive und Labels nie abschneiden

## 13. Timing, Szenenüberschrift und Untertitel

### Timing

Ziel grob 60 % Bildbeats / 40 % Remotion-Animationen. Die Quote ist kein Grund, ein Bild künstlich lange stehen zu lassen.

- Bildbeat ideal: 3,5–5,5 Sekunden
- Bildbeat absolut maximal: 6,0 Sekunden
- Animation ideal: 4,5–7,0 Sekunden
- wenn ein Bild mehr als 6 Sekunden Erklärzeit braucht: splitten oder animieren

### Zwischenüberschrift — Pflicht in jeder Szene

Jede Bild- und Animationsszene besitzt oben eine klare Zwischenüberschrift mit passendem Icon.

Standard:

```tsx
<SceneHeader title="KONTOAUSZUG PRÜFEN" icon="search" />
```

Regeln:

- **mittig zentriert**, Icon links neben der Headline
- **Headline in FinanzNeo-Grün** (Icon in derselben Farbe)
- **jede Szene ein eigenes, inhaltlich passendes Icon**
- **die Überschrift ist eine Aussage** — nie nur ein Stichwort, nie nur eine Zahl
- gleiche Position/Grundgestaltung im ganzen Reel
- kurze direkte Formulierung, 3–6 Wörter
- Rot nur für Warnung/Problem
- Gold nur für Geld/Wert
- kein schwarzer Text auf dunklem Reel-Hintergrund

### Layout 1080 × 1920

Verbindliche Quelle: `REEL_STYLE` in `src/brand/tokens.ts`.
Diese Werte hier sind eine Kopie — bei Abweichung gilt der Code.

```text
Headline             Y = 118
Visual               Y = 390–1560
Untertitel           285 px über dem unteren Rand
links 72 px
rechts 72 px (Header) / 140 px (Untertitel)
Szenenübergang       3 Frames · kein Fade-to-black
```

### Untertitel

- satzbasierte Caption-Einheit sichtbar
- aktuelles Wort **immer FinanzNeo-grün**
- restliche Wörter **immer weiß**
- kein gelbes/goldenes Active-Word
- kein schwarzer Untertiteltext
- maximal zwei Zeilen
- keine springenden Wörter
- keine Größenanimation / kein Scale-Pop
- kurze Pausen halten die vorherige Caption sichtbar
- keine Caption-Lücken

Technische Standardkomponente: `src/brand/components/Captions.tsx`.

## 14. Animationsklarheit

Jede native Remotion-Erkläranimation folgt zwingend:

```text
STARTZUSTAND
→ SICHTBARE VERÄNDERUNG / MECHANISMUS
→ EINDEUTIGES ERGEBNIS
```

Reine Zooms, Fades, Zahlen-Popups oder dekorative Bewegung sind keine ausreichende Erkläranimation.

Verbindliche Farblogik aus `ANIMATION_COLORS`:

- Weiß = neutrale Information
- Grün = Fokus/Lösung/zentrale Erklärung
- Rot = Warnung/Problem/Verlust/unnötige Kosten
- Gold = Geld/Summe/Wert
- Schwarz = auf dunklen Reel-Flächen verboten

Für komplexe Mechanismen kann `MechanismCue` für Start-/Ergebnis-Markierungen verwendet werden.

Vor Freigabe Animation zusätzlich **ohne Ton** prüfen: Grundmechanismus muss trotzdem nachvollziehbar sein.

## 15. Satzbasierte Szenenschnitte

```text
finales Voiceover
→ echte Wort-Zeitstempel
→ Satz- und bei Bedarf sinnvolle Phrasenanfänge
→ Szenenstarts
→ relative Animationsdauer
```

Kein starres Raster gleich langer Szenen.

## 16. Audio

```text
Integrated Loudness: ungefähr -16 LUFS
True Peak: höchstens -1 dBTP
```

Am finalen Export messen.

## 17. Bild-/Reel-QA

Vor Freigabe:

1. Bild gegen gesprochenen Beat prüfen
2. nahtlosen Hintergrund prüfen
3. stylized 3D statt Fotorealismus prüfen
4. horizontale Bänder/Floor-Wall-Split ausschließen
5. Gesicht prüfen, falls Person vorkommt
6. Labels prüfen
7. alle Bilder als Kontaktbogen prüfen
8. Anfang/Mitte/Ende jeder Bildszene im Render prüfen
9. jede Szene auf Zwischenüberschrift + Icon prüfen
10. Caption-Active-Word auf Grün prüfen
11. schwarzen Text auf dunklen Szenen ausschließen
12. jede Animation auf Start → Mechanismus → Ergebnis prüfen
13. Animationen einmal ohne Ton ansehen
14. vollständige MP4 mit Ton ansehen

Sofort korrigieren bei:

- zwei sichtbaren Hintergründen/Bändern
- horizontaler Trennkante
- sichtbarer Boden-Wand-Grenze/Horizont
- gesichtsloser/abgewandter Person
- falschen Labels
- großer Headline/Satz im KI-Bild
- Diorama/Game-Level
- fotorealistischem Büro-/Papierlook
- falscher Satzzuordnung
- Bildbeat > 6 Sekunden
- fehlender Szenenüberschrift oder fehlendem Icon
- gelbem/goldenem Karaoke-Active-Word
- schwarzem Text auf dunklem Hintergrund
- unverständlicher/dekorativer Animation ohne klare Ursache-Wirkung

## 18. Plattform-Publishing

Verbindlich ist `docs/PLATFORM-PUBLISHING.md`.

Die vier Reel-Plattformdateien liegen direkt in `04-caption/`, damit keine neue komplizierte Hauptstruktur entsteht.

### Instagram Reels

`instagram-reels.txt`:

- Caption
- CTA
- Quellen/Hinweis
- Hashtags
- optional angehefteter Kommentar

### TikTok

`tiktok.txt`:

- kurze Caption
- CTA
- Quellen/Hinweis
- Hashtags

### Facebook Reels

`facebook-reels.txt`:

- Reel-Text
- CTA
- Quellen/Hinweis
- Hashtags

### Snapchat

`snapchat.txt`:

- sehr kurze Caption
- optional CTA
- Hinweis nur wenn nötig

`caption.txt` bleibt die gemeinsame geprüfte Faktenbasis. Plattformdateien dürfen keine neue unbelegte Aussage erfinden.

Keine YouTube Shorts erzeugen, validieren oder veröffentlichen. `youtube-shorts.txt` ist in aktiven Reel-Projekten verboten.

Wenn exakte aktuelle Plattform-Limits oder Upload-Funktionen relevant sind, vor Veröffentlichung offizielle Plattformquellen prüfen statt Limits im Repo fest zu verdrahten.

Longform-YouTube ist ein separates Format unter `youtube/` und wird nicht in Reel-Projekte gemischt oder automatisch aus ihnen gespiegelt.

## 19. Automatische Erstellung

Der verbindliche Ablauf ist `docs/3-PHASEN-WORKFLOW.md`: Phase 1 durch normales ChatGPT, Phase 2 durch den Nutzer mit Google Flow und finalem Audio, Phase 3 autonom durch Antigravity.

```bash
npm run reel:create -- \
  --target reels/<Woche>/<Tag>/<Reel> \
  --title "Reel-Titel"
```

Der Scaffolder erzeugt die einfache Struktur. Phase 1 muss die konkreten Bild-/Animationsbeats, kurzen Szenenüberschriften, Icons und vollständigen Prompts nach den aktuellen Regeln ausarbeiten. Der Nutzer erstellt die Bilder. Antigravity setzt in Phase 3 `SceneHeader`, `Captions`, `ANIMATION_COLORS` und bei Bedarf `MechanismCue` ein.

## 20. Automatische Prüfung

```bash
npm run reel:validate -- reels/<Woche>/<Tag>/<Reel>
```

Der Validator verlangt die vier Reel-Plattformdateien und blockiert aktive YouTube-Shorts-Artefakte.

Vor Phase 3 ist zusätzlich die strengere Einsatzprüfung Pflicht:

```bash
npm run reel:ready -- reels/<Woche>/<Tag>/<Reel>
```

Sie verlangt platzhalterfreie Phase-1-Inhalte, exakt benannte Bilder im gemeinsamen Bilderordner, genau ein finales Voiceover und echte dazugehörige Wort-Zeitstempel. Bei Erfolg arbeitet Antigravity ohne Rückfragen bis zur fertigen QA weiter. Bei Fehlern meldet es alle echten Blocker gesammelt.

Validator/Typecheck/Preview müssen tatsächlich ausgeführt werden, bevor ein Reel als technisch fertig bezeichnet wird. Technischer Erfolg ersetzt nicht die visuelle Freigabe.
