# FinanzNeo-Reel-Produktionsstandard

> Bei Widersprüchen gilt immer `CLAUDE.md`.

## 1. Einfache Reel-Struktur

```text
01-script/
02-audio/
03-szenen/
04-caption/
05-projektdateien/
06-export/
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

## 2. Produktionsquelle pro Szene

### Bildszene

```text
scene-XX/
├── bildprompt.txt
└── szene.md
```

### Remotion-Szene

```text
scene-XX/
├── remotion.md
├── animation.tsx
└── szene.md
```

Für Animationsszenen ist `animation.tsx` seit V5 die **kanonische produktionsreife Phase-1-Quelle**. `remotion.md` beschreibt die Mechanik; der TSX-Code setzt sie bereits vollständig um. Phase 3 darf keine eigene Ersatzanimation bauen.

## 3. Google Flow — Einzelbild-Ablauf

Einzige Übergabedatei an den Google-Flow-KI-Agenten:

```text
03-szenen/alle-bildprompts.txt
```

Formatregel: Google Flow erzeugt Cover und Szenenbilder immer quadratisch `1:1`. Das fertige Reel bleibt `9:16`; Remotion platziert die 1:1-Bilder mit `contain`.

```text
PROMPT LESEN
→ GENAU EIN BILD ERZEUGEN
→ VOLLSTÄNDIG WARTEN
→ SOFORT ENDGÜLTIG UMBENENNEN
→ MOTIV + LABELS + HINTERGRUND + STIL + DATEINAME PRÜFEN
→ ERST DANN NÄCHSTES BILD
```

Keine Batches, keine parallele Vorbereitung und kein späteres Sammel-Umbenennen. Bei einem Fehler dieselbe Bildnummer neu erzeugen und erst nach bestandener QA fortfahren.

### Keine Bild-zu-Bild-Referenz

Für Reel-Bilder wird **kein** Cover oder vorheriges Szenenbild als Image-to-Image-/Referenzbild hochgeladen. Die Same-World-Konsistenz entsteht ausschließlich durch denselben ausgeschriebenen World-Lock.

## 4. Nummerierung

Bildnummer = echte chronologische Szenennummer.

```text
Bild 00 = Cover
Bild 01 = Szene 01
Bild 02 = Szene 02
...
```

Animationsszenen behalten ihre Nummer, bekommen aber kein Bild.

## 5. Finaler Sammelordner

Erst wenn alle Bilder einzeln erzeugt, umbenannt und geprüft wurden, kommen sie gemeinsam nach:

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

## 6. Phase 1 erzeugt keine Bilder, aber fertigen Animationscode

- Der Nutzer erstellt Cover und finale Szenenbilder selbst.
- Phase 1 erstellt Recherche, Skript, Szenenplan, Bildprompts, Dateinamen, Remotion-Spezifikationen, **fertigen Animations-TSX-Code**, Captions und Publishing-Texte.
- Phase 3 erzeugt keine Bilder und erfindet keine fehlende Animation.
- Fehlt ein Nutzerbild, genaue fehlende Datei melden und warten.
- Keine Ersatzbilder oder Stockbilder verwenden.

## 7. Verbindliche Bildwelt — Stylized 3D Animated Black V9

World ID:

```text
finanzneo-connected-studio-v3
```

Series Lock:

```text
finanzneo-same-world-v1
```

Aktueller Visual Lock:

```text
finanzneo-stylized-3d-animated-black-v9
```

Stil:

- klar stylized 3D animated
- niemals realistisch / photorealistisch
- soft rounded shapes
- vereinfachte erkennbare Details
- clean materials
- premium, freundlich und leicht verspielt
- klare Hauptaussage oder Hauptaktion
- keine feste Objektanzahl
- Inhalt und Verständlichkeit vor Deko
- Emerald Green für positiv/bevorzugt
- Warm Ivory + Soft Gray für neutrale Flächen
- Gold nur für Geld/Wert
- Warm Red-Orange nur für Warnung/Kosten/Verlust

## 8. Kritische Hintergrundregel — Deep Black Pflicht

Jedes Flow-Bild nutzt genau einen nahtlosen tiefschwarzen Hintergrund.

```text
Use one seamless deep black background.
Keep it clean, minimal and uninterrupted.
No bright studio background.
No floor-wall boundary.
No horizon line.
No colored background zones.
```

Das Motiv muss sich durch clean soft studio lighting, klare Highlights, lesbare Schatten und weiche Kontaktschatten deutlich vom Schwarz lösen.

## 9. Personenregel

Wenn eine Person vorkommt:

- klar stilisiert und nicht realistisch
- Gesicht gut sichtbar
- frontal oder natürliche 3/4-Ansicht bevorzugt
- keine gesichtslose Figur
- keine reine Rückenansicht
- keine reale/identifizierbare Person

## 10. Text im KI-Bild

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

## 11. Darstellung in Remotion

- Bild mit `object-fit: contain`
- keine sichtbare unscharfe Kopie desselben Bildes im Hintergrund
- Source-Crop oben höchstens `0.20`
- Source-Crop unten höchstens `0.20`
- Source-Crop insgesamt höchstens `0.34`
- zusätzliche Skalierung höchstens `1.04`
- wichtige Motive und Labels nie abschneiden

## 12. Timing

Ziel grob 60 % Bildbeats / 40 % Remotion-Animationen. Die Quote ist kein Grund, ein Bild künstlich lange stehen zu lassen.

- Bildbeat ideal: 3,5–5,5 Sekunden
- Bildbeat absolut maximal: 6,0 Sekunden
- Animation ideal: 4,5–7,0 Sekunden
- wenn ein Bild mehr als 6 Sekunden Erklärzeit braucht: splitten oder animieren

## 13. Zwischenüberschrift — V5 Plain Header

Jede Bild- und Animationsszene besitzt oben eine klare Zwischenüberschrift mit passendem Icon.

Standard:

```tsx
<SceneHeader title="Kontoauszug prüfen" icon="search" />
```

Regeln:

- mittig zentriert
- normale Schreibweise / Sentence Case
- neutral weißer Text
- einfaches Linien-Icon als semantischer Farbakzent
- keine Capsule, kein Chip, kein Panel, keine pillenförmige Box
- jede Szene ein eigenes, inhaltlich passendes Icon
- Überschrift ist eine Aussage oder Frage — nie nur Stichwort/Zahl
- kurze direkte Formulierung, etwa 3–6 Wörter
- semantische Farbe primär über das Icon: grün normal/positiv, rot Warnung, gold Geld/Wert

## 14. Layout V5 — 1080 × 1920

Verbindliche Quelle: `REEL_STYLE` in `src/brand/tokens.ts`.

```text
Header               Y = 154
Visual               Y = 320–1480
Untertitel           340 px über dem unteren Rand
Header links/rechts  80 px
Caption links        72 px
Caption rechts       140 px
Szenenübergang       3 Frames · kein Fade-to-black
```

Ziel der V5-Verschiebung:

- oben mehr ruhige Luft
- Header näher am Visual
- Bilder und Animationen sichtbar höher
- Untertitel höher und weiter weg vom unteren Rand
- Bild- und Animationsszenen auf derselben vertikalen Bühne

## 15. Untertitel

- satzbasierte Caption-Einheit sichtbar
- aktuelles Wort immer FinanzNeo-grün
- restliche Wörter immer weiß
- kein gelbes/goldenes Active-Word
- kein schwarzer Untertiteltext
- maximal zwei Zeilen
- keine springenden Wörter
- keine Größenanimation / kein Scale-Pop
- kurze Pausen halten die vorherige Caption sichtbar
- keine Caption-Lücken
- Standardposition V5: `bottom = 340`

Technische Standardkomponente: `src/brand/components/Captions.tsx`.

## 16. Animationsklarheit — Phase 1 ist verantwortlich

Verbindliche Detailquelle: `docs/PHASE-1-ANIMATION-CODE-STANDARD.md`.

Jede native Remotion-Erkläranimation folgt zwingend:

```text
STARTZUSTAND
→ SICHTBARE VERÄNDERUNG / MECHANISMUS
→ EINDEUTIGES ERGEBNIS
→ mindestens 15 Frames stabiler Endzustand
```

Phase 1 liefert pro Animationsszene:

```text
remotion.md
animation.tsx
```

Pflicht im Code:

- `useCurrentFrame`
- `AnimationStage`
- `ANIMATION_COLORS`
- `prog`, `interpolate` oder `spring`
- `ANIMATION_NARRATIVE` mit START / MECHANISM / RESULT
- `RESULT_HOLD_FRAMES >= 15`
- produktionsreifer Export `SceneXXAnimation`

Visuell muss die Animation zur V9-Bildwelt passen: nicht realistisch, soft rounded, deep-black Hintergrund, klare Hauptaktion, keine feste Objektanzahl.

Verboten:

- `Math.sin`/`Math.cos` als künstliches Dauerwackeln nur für Frame-Diff
- wackelnde Rechtecke, Debug-Boxen, bunte Testflächen
- Dummy-/Placeholder-Komponenten
- generische Cards + Text ohne sichtbaren Mechanismus
- reine Zooms/Fades/Zahlen-Popups als komplette Animation
- „technisch bestehen, später hübsch machen"
- schwarzer Text auf dunklen Reel-Flächen

Bei erfolgreichem `reel:ready` wird jede Phase-1-Animationsdatei per SHA-256 versiegelt. Phase 3 muss direkt diese Quelle verwenden; ein veränderter Hash blockiert den Preflight.

## 17. Satzbasierte Szenenschnitte

```text
finales Voiceover
→ echte Wort-Zeitstempel
→ Satz- und bei Bedarf sinnvolle Phrasenanfänge
→ Szenenstarts
→ relative Animationsdauer
```

Kein starres Raster gleich langer Szenen.

## 18. Audio

```text
Integrated Loudness: ungefähr -16 LUFS
True Peak: höchstens -1 dBTP
```

Am finalen Export messen.

## 19. Bild-/Reel-QA

Vor Freigabe:

1. Bild gegen gesprochenen Beat prüfen
2. tiefschwarzen nahtlosen Hintergrund prüfen
3. stylized 3D animated statt Realismus/Produktfoto prüfen
4. Clutter und unnötige Props ausschließen
5. Gesicht prüfen, falls Person vorkommt
6. Labels prüfen
7. alle Bilder als Kontaktbogen prüfen
8. Anfang/Mitte/Ende jeder Bildszene im Render prüfen
9. jede Szene auf Plain-Header + Icon prüfen
10. Caption-Active-Word auf Grün prüfen
11. schwarzen Text auf dunklen Szenen ausschließen
12. jede Animation auf Start → Mechanismus → Ergebnis prüfen
13. Phase-1-Animationshash gegen Seal prüfen
14. Animationen einmal ohne Ton ansehen
15. vollständige MP4 mit Ton ansehen

Sofort korrigieren bei:

- nicht tiefschwarzem Flow-Hintergrund
- Realismus / Produktfoto-Look
- UI-/Dashboard-/Flowchart-Look
- unnötigem Clutter
- falschen Labels
- großer Headline/Satz im KI-Bild
- Miniatur-Diorama
- falscher Satzzuordnung
- Bildbeat > 6 Sekunden
- fehlender Szenenüberschrift oder fehlendem Icon
- Header-Capsule/Chip statt normaler Typografie
- künstlicher ALL-CAPS-Formatierung
- gelbem/goldenem Karaoke-Active-Word
- schwarzem Text auf dunklem Hintergrund
- unverständlicher/dekorativer Animation ohne klare Ursache-Wirkung
- Debug-/Wackel-/Placeholder-Animation
- durch Phase 3 ersetztem Animationscode

## 20. Plattform-Publishing

Verbindlich ist `docs/PLATFORM-PUBLISHING.md`.

Pflichtdateien in `04-caption/`:

```text
caption.txt
instagram-reels.txt
tiktok.txt
facebook-reels.txt
snapchat.txt
```

Keine YouTube Shorts erzeugen, validieren oder veröffentlichen.

## 21. Automatische Erstellung

```bash
npm run reel:create -- \
  --target reels/<Woche>/<Tag>/<Reel> \
  --title "Reel-Titel"
```

Der öffentliche Ersteller setzt automatisch:

- Flow Strict-Single-Job V3
- Stylized 3D Animated Black V9
- Phase-3-Completion-Gate
- Reel-Layout V5
- Phase-1-Animationscode-Vertrag

## 22. Automatische Prüfung

```bash
npm run validate:image-world
npm run reel:validate -- reels/<Woche>/<Tag>/<Reel>
```

Der Validator prüft zusätzlich:

- V9-Bildwelt + deep-black Hintergrund
- mittel-lange Einzelprompts
- flexible Objektanzahl
- V5-Layout
- Plain Header
- vollständigen kanonischen Animationscode
- keine Placeholder-/Wackel-Hacks
- Phase-3-Completion-Vertrag

Vor Phase 3:

```bash
npm run reel:ready -- reels/<Woche>/<Tag>/<Reel>
```

Bei Erfolg wird der Phase-1-Animationscode versiegelt. Erst danach darf Phase 3 starten.

Validator/Typecheck/Preview müssen tatsächlich ausgeführt werden, bevor ein Reel als technisch fertig bezeichnet wird. Technischer Erfolg ersetzt nicht die visuelle Freigabe.
