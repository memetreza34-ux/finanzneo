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

```text
PROMPT LESEN
→ GENAU EIN BILD ERZEUGEN
→ SOFORT ENDGÜLTIG UMBENENNEN
→ MOTIV + LABELS + GESICHT + HINTERGRUND + DATEINAME PRÜFEN
→ ERST DANN NÄCHSTES BILD
```

Keine 3er-Batches und kein späteres Sammel-Umbenennen.

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

Verbindlich:

- `CLAUDE.md`
- `docs/FINANZNEO-IMAGE-WORLD-V3.md`
- `docs/IMAGE-SYSTEM.md`
- `docs/IMAGE-PROMPT-LIBRARY.md`
- `docs/IMAGE-QA-CHECKLIST.md`

Stil:

- Premium fintech editorial 3D render
- eine dominante Finanzmetapher / großes Hauptobjekt
- optional stilisierte erwachsene 3D-Person
- wenn Person: Gesicht klar sichtbar, frontal oder 3/4
- deep charcoal green-black Grundwelt
- emerald/mint Akzente
- Gold nur für Geld/Wert
- warmes Rot-Orange nur für Risiko/Verlust/Schulden
- smooth rounded geometry, soft bevelled edges
- kein Fotorealismus, Pixar oder Clay
- keine Dioramen, Neon-Tunnel, Sci-Fi-Korridore, Dashboards oder Game-Level

## 9. Kritische Hintergrundregel — genau EIN Hintergrund

**Keine Prozent-Zonen verwenden.**

Jedes Bild nutzt genau einen nahtlosen Hintergrund von oben bis unten:

```text
Use ONE single seamless continuous deep charcoal green-black background across the entire vertical 9:16 image.
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

## 13. Layout und Untertitel

1080 × 1920:

```text
Headline ungefähr ab Y = 78
Visual ungefähr Y = 270–1350
Untertitel 320 px über dem unteren Rand
links 62 px
rechts 150 px
```

Untertitel:

- genau ein vollständiger Satz sichtbar
- aktuelles Wort FinanzNeo-grün
- restliche Wörter weiß
- maximal zwei Zeilen
- keine springenden Wörter
- keine Größenanimation
- keine Caption-Lücken

## 14. Satzbasierte Szenenschnitte

```text
finales Voiceover
→ echte Wort-Zeitstempel
→ Satzanfänge
→ Szenenstarts
→ relative Animationsdauer
```

Kein starres Raster gleich langer Szenen.

## 15. Audio

```text
Integrated Loudness: ungefähr -16 LUFS
True Peak: höchstens -1 dBTP
```

Am finalen Export messen.

## 16. Bildsatz-QA

Vor Freigabe:

1. Bild gegen gesprochenen Satz prüfen
2. nahtlosen Hintergrund prüfen
3. horizontale Bänder/Floor-Wall-Split ausschließen
4. Gesicht prüfen, falls Person vorkommt
5. Labels prüfen
6. alle Bilder als Kontaktbogen prüfen
7. Anfang/Mitte/Ende jeder Bildszene im Render prüfen
8. vollständige MP4 mit Ton ansehen

Sofort neu erzeugen bei:

- zwei sichtbaren Hintergründen/Bändern
- horizontaler Trennkante
- sichtbarer Boden-Wand-Grenze/Horizont
- gesichtsloser/abgewandter Person
- falschen Labels
- großer Headline/Satz
- Diorama/Game-Level
- falscher Satzzuordnung

## 17. Plattform-Publishing

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

## 18. Automatische Erstellung

Der verbindliche Ablauf ist `docs/3-PHASEN-WORKFLOW.md`: Phase 1 durch normales ChatGPT, Phase 2 durch den Nutzer mit Google Flow und finalem Audio, Phase 3 autonom durch Antigravity.

```bash
npm run reel:create -- \
  --target reels/<Woche>/<Tag>/<Reel> \
  --title "Reel-Titel"
```

Der Scaffolder erzeugt die einfache Struktur, Bildprompts, `scene-index.json`, Master-Caption, die vier Reel-Plattformdateien, Wort-Timings und technische Hinweise nach den aktuellen Regeln. Er erzeugt keine YouTube-Shorts-Datei.

## 19. Automatische Prüfung

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
