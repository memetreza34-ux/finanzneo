# FinanzNeo — YouTube-Longform-Produktionsstandard

> Bei Widersprüchen gilt `CLAUDE.md`. Für YouTube-Motion gilt zusätzlich `docs/YOUTUBE-MOTION-V3.md`. Für die Wahl zwischen Remotion, Bild+Remotion, SVG, Icons und Lottie gilt `docs/FINANZNEO-VISUAL-SELECTION-RULE.md`.

## Projektstruktur — einfach (Arman, 10.10.2026)

Sichtbar ist nur, was der Nutzer anfasst. Alles andere liegt unter `_intern/` (Recherche, Visual-Index, Animationen, Zeitplan, Seal, Publishing-Details).

```text
youtube/<Projekt>/
├── 1-script/script.txt              Sprechtext zum Einsprechen
├── 2-bildprompts/bildprompts.txt    alle Flow-Prompts inkl. Thumbnail, in 5er-Batches
├── 3-bilder-hier-rein/              fertige Flow-Bilder, exakt benannt
├── 4-audio-hier-rein/               genau eine Sprachaufnahme
├── 5-export/                        cover.png · video.mp4 · caption.txt · untertitel-zeitstempel.txt
└── _intern/                         alles andere
```

`5-export/` füllt `npm run youtube:render` automatisch: `caption.txt` = finaler Titel + YouTube-Beschreibung, `untertitel-zeitstempel.txt` = Sprechtext satzweise mit Zeit ab `00:00` für die YouTube-Untertitel.

Kanonischer Themen-Scope: `docs/CONTENT-SCOPE.md`.

## Format und Inhalt

- eigenständiges längeres Finanzvideo, kein verlängertes Reel
- Themen-Scope: **alles rund um Finanzen**; Grundlagen, fortgeschrittene Themen, aktuelle Finanz-News, Gesetze/Regeländerungen, Unternehmen, Banken, Märkte, Börse, ETFs/Aktien/Krypto, Kredite, Steuern, Versicherungen, Immobilien, Gehalt, Rente, Verbraucherfinanzen, Betrugsmaschen und Wirtschaft mit klarem Finanzbezug sind zulässig
- auch Listen-, Ranking-, Vergleichs-, Fallstudien-, News- und „X Dinge…“-Formate sind zulässig
- keine YouTube Shorts
- 1920 × 1080, horizontal 16:9, 30 fps
- Länge folgt dem Thema; keine künstlichen Füllpassagen
- Hook ohne langes Intro
- Kapitel mit klaren Zwischenzielen und Payoffs
- klare, zugängliche Sprache; komplexe Themen werden einfach erklärt, ohne die Themenauswahl auf Anfängerstoff zu begrenzen
- Zahlen, Annahmen und Datenstand prüfbar dokumentieren; aktuelle Themen immer mit aktuellem Recherche- und Quellenstand
- keine individuelle Anlageberatung oder garantierte Rendite

## Viewer-change-first Visualplanung

Es gibt **keine feste Visualzahl, keine feste Bild-/Animationsquote und keine feste Animationsbibliothek**.

```text
Skript
→ gesprochene Gedanken
→ sichtbare Visual Beats
→ Viewer Change: Was soll der Zuschauer tatsächlich sehen, das sich verändert?
→ beste Visualart und Technik für genau diesen Beat
→ sinnvolle Gruppierung
```

Erlaubte Visualtypen:

- `image`
- `animation`
- `hybrid`
- `data`

## Visual Selection V1

`VISUAL_SELECTION_STANDARD: finanzneo-visual-selection-v1`

Vor der Technik wird entschieden, ob der Sprechpunkt als **statisches Visual** oder als **echte zeitliche Veränderung** besser funktioniert.

- **statische Aussage → Google Flow IMAGE**
  - auch Charts, Timelines, Vergleiche, Dokumente, Zahlenvisuals, Metaphern, Unternehmen/Marken und komplexe statische Erklärbilder dürfen vollständig von Flow erzeugt werden
- **sichtbare Entwicklung/Bewegung über Zeit → Remotion ANIMATION**
- **HYBRID** nur wenn ein starkes Flow-Standbild plus echte zeitliche Remotion-Information nachweislich besser erklärt
- SVG, Icons, Lottie und andere Techniken sind Werkzeuge innerhalb einer Animations-/Hybrid-Szene, nicht automatisch ein eigener Inhaltstyp

Komplexes Thema bedeutet nicht automatisch Animation. Wenn eine komplexe Aussage als klares statisches Bild verständlich ist, bleibt sie IMAGE.

Kanonische Detailregel:

```text
docs/FINANZNEO-VISUAL-SELECTION-RULE.md
```


## Remotion / Motion V3

Kanonische YouTube-Motion-Welt und wiederverwendbare V3-Engine:

```text
docs/FINANZNEO-YOUTUBE-MOTION-WORLD-V1.md
docs/YOUTUBE-LIGHT-MOTION-V3-ENGINE.md
```

`MOTION_STANDARD: finanzneo-youtube-motion-v3`

`MOTION_WORLD: finanzneo-youtube-light-motion-v2`

### Grundregel

YouTube-Animationen folgen einer hellen, sauberen 2D-Richtung.

Fest:
- 1920 × 1080 / 16:9
- heller Hintergrund
- 2D / flache Grafik / Editorial
- kein Full-3D und keine pseudo-3D-Blöcke
- keine dunklen oder schwarzen Szenen
- keine großen generischen Szenenüberschriften

Unterschiedliche Designs bleiben ausdrücklich erlaubt: Vergleiche, Charts, Tabellen, Icons, Dokumente, Timelines, Prozesse, Flow-Diagramme, Karten, abstrakte 2D-Geometrie und andere helle Custom-Designs.

Text in der Animation ist nur inhaltsbezogen: Werte, Kategorien, Prozentwerte, Tabellenköpfe und kurze Callouts.

Jedes Motion-Visual braucht:

- produktionsreife `animation.tsx` bereits in Phase 1
- `viewerChange`
- `animationIntent`
- `mechanicId`
- `visualTechniqueId`
- `techniqueDescription`
- freien `compositionFamilyId`
- `toolStack`
- `motionSignature` mit `camera`, `layout`, `transformation`
- mindestens **eine** sinnvolle erklärende Motion
- mindestens zwei sichtbare Visual Beats: Start + Result

**Komposition mittig:** Weil keine Untertitel eingebrannt werden, steht der Inhalt vertikal mittig im 1920 × 1080-Bild (`DATEN.mitteY`), Quelle oben links. Nicht mehr nach oben schieben.

Eine klare Hauptbewegung darf vollständig reichen. Mehr Motion ist kein Qualitätsmerkmal. Neue YouTube-Visuals verwenden nach Möglichkeit die datengetriebenen Mechaniken unter `src/youtube-motion/light-v3/`; ein isolierter Demo-Effekt ist keine Freigabe.

Kontaktbogen und kompletter Clip müssen nach dem Render visuell geprüft werden. Der dedizierte Test liefert 10/35/65/90-Prozent-Frames; automatischer Build-Erfolg allein ist keine ästhetische Freigabe.


### Echte Vielfalt statt umbenannter Wiederholung

Ein neuer Technikname allein zählt nicht als neue Animation.

Technische Wiederholungschecks sind nur Hinweise auf mögliche Copy-Paste-Motion und **keine kreative Stilgrenze**.

Die gleiche Mechanik, gleiche Familie oder gleiche Kamera darf wiederholt werden, wenn sie für den Inhalt die beste Lösung ist. Unterschiedliche Szenen dürfen ebenso komplett unterschiedliche Welten nutzen.

Das Ziel ist **nicht**, zwanghaft jeden Effekt nur einmal zu verwenden. Das Ziel ist, für jeden Gedanken die klarste visuelle Erklärung zu wählen und bequeme Copy-Paste-Motion zu verhindern.

Vor Phase 2:

```bash
npm run youtube:animation:validate -- youtube/<Projekt>
npm run youtube:phase1:seal -- youtube/<Projekt>
```

Der Phase-1-Seal schützt danach sowohl den Motion-Code als auch den kreativen V3-Vertrag (`viewerChange`, Technikbeschreibung, Tool-Stack, Motion-Signatur, Beats und Channels). Phase 3 darf die Mechanik nicht kreativ ersetzen oder vereinfachen.

## Bildwelt und Google Flow

`IMAGE_WORLD: finanzneo-editorial-finance-v1`

Kanonische Bildwelt:

```text
docs/FINANZNEO-IMAGE-WORLD.md
```

Für alle statischen YouTube-Visuals gilt:

- ein gesprochener Gedanke → eine einfache visuelle Idee
- auf den ersten Blick verständlich
- Flow darf Metaphern, Illustrationen, Charts, Timelines, Vergleiche, Dokumente, Zahlenvisuals, Zitate, Unternehmen/Marken und einfache Szenen vollständig erzeugen
- 2D oder leichtes 2.5D bevorzugt; einfaches 3D nur wenn sinnvoll
- Hintergründe flexibel; kein Schwarz-Zwang
- wenige große, gut lesbare Elemente
- keine dekorative AI-Slop-Finanzoptik ohne Erklärwert
- Bildprompts bleiben Englisch
- keine generische Headline automatisch; Zahlen, kurze Labels, Daten, Zitate und Dokumenttext sind erlaubt, wenn hilfreich

Progressive Bildfolgen sind ausdrücklich erlaubt. Wenn Visual B nur eine Erweiterung von Visual A ist, wird das exakt freigegebene Bild A als echte Referenz an Flow angehängt. Der Prompt von B bleibt vollständig und beschreibt nur die geplante Ergänzung/Änderung.

Einzige Übergabe an Google Flow bleibt:

```text
2-bildprompts/bildprompts.txt
```

Bilder werden in Batches von bis zu **5 gleichzeitig** erzeugt (`finanzneo-flow-batch5-v1`, Arman 10.10.2026): jedes Bild ein eigener Job, sofort exakt umbenannt und geprüft; Fehler werden im selben Batch neu erzeugt, erst dann startet der nächste Batch. Fortsetzungen mit Referenzbild liegen immer in einem späteren Batch. **Alle sichtbaren Texte im Bild sind deutsch.**

### Eine Stilvorlage für den ganzen Kanal (Arman, 17.10.2026)

- **Bildwelt = ruhig & minimal** (Arman, 17.10.2026): wie die Bilder vom 7. Oktober (Berg mit Zielflagge, Treppe, Weg zur Flagge, Steuerstufen, Kaufkraft, saubere Gebäude) — viel leerer Raum, wenige Elemente, Bild-Metaphern, kleine Figuren ohne detaillierte Gesichter, wenig Text. Volle Alltagsszenen mit vielen Details (wie Teile von Video 1 und 2) sind **nicht** das Ziel.
- `youtube/_kanal/FinanzNeo Stilvorlage.png` ist die **kanalweite Stilvorlage** und muss ein Bild aus dieser ruhigen Welt sein (aus dem Flow-Projekt vom 7. Oktober). Fehlt sie, bricht `youtube-plan-anwenden` bewusst ab. Jedes Bild jedes neuen Videos — auch das Thumbnail — hängt sie als `STYLE_REFERENCE:` an.
- Grund: Mit dem Thumbnail als Vorlage blieb jedes Video in sich einheitlich, aber die Videos drifteten untereinander (Supermarkt: Hintergrund schwankte zwischen #F7ECCF und #F7F0D8, Strich und Palette uneinheitlich; 0 %: fast überall exakt #F9E9CB).
- Die Vorlage wird nur bewusst ausgetauscht (neue Datei, Eintrag in `VERBESSERUNGEN.md`).
- Projekte vor dem 17.10.2026 behalten das Thumbnail als Stilvorlage (`imageWorld.styleMaster: "thumbnail"`).

### Nur Illustration, Thumbnail als Stilvorlage (Arman, 10.10.2026)

- Alle YouTube-Bilder sind **weiche, handgezeichnete 2D-Editorial-Illustrationen** auf warmem Creme: zarte Bleistiftlinien, sanft gemalte Farbflächen, gedeckte Erdtöne (Sand, Terrakotta, Salbei, Staubblau, warmes Grau). **Nie fotorealistisch, nie Foto, nie glänzendes 3D.**
- **Batch 1 enthält nur das Thumbnail.** Erst wenn es fertig und freigegeben ist, startet Batch 2.
- Jedes weitere Bild hängt das freigegebene Thumbnail als `STYLE_REFERENCE:` an — übernommen werden nur Zeichenstil, Farben und Detailgrad, nie Komposition oder Headline.
- `youtube:create` erzeugt das automatisch (`imageWorld.styleMaster: "thumbnail"`); `youtube:validate` prüft es.


## Audio, Timing und Untertitel

- genau ein finales Voiceover in `4-audio-hier-rein/`
- echte Wort-Zeitstempel aus genau diesem Audio
- Schnitte folgen Sprache, Visual Beats, Kapiteln und Payoffs
- keine pauschal gleich langen Visuals
- **keine eingebrannten Untertitel** im YouTube-Video (Arman, 10.10.2026); Wort-Zeitstempel steuern nur Schnitte und Animationsstufen
- `youtube:render` legt `5-export/untertitel-zeitstempel.txt` (Satz für Satz ab `00:00`) für die YouTube-Untertitel ab; `--untertitel` beim Zusammenbau brennt Untertitel nur auf ausdrücklichen Wunsch ein
- Audioziel ungefähr -16 LUFS, True Peak höchstens -1 dBTP
- Aufnahme in mehreren Teilen ist erlaubt: einfach alle Teile in `4-audio-hier-rein/` legen (Reihenfolge nach Dateiname). Zusammenbau bzw. Render verbinden sie zu `voiceover.wav`, legen die Originale unter `_intern/03-audio/teile/` ab und nennen die Nahtstellen zum Reinhören.
- Optionale Hintergrundmusik: `_intern/03-audio/musik.mp3|wav|m4a` (lizenzfrei!). `youtube:render` mischt sie mit −24 dB unter die Stimme, in Schleife, mit Aus-/Einblende.

## Qualitätsregeln V1 (`finanzneo-youtube-quality-v1`, Arman 10.10.2026)

Aus dem Feedback zum ersten Video. Gelten für alle mit `youtube:create` neu angelegten Projekte (`qualityRules` im Visual-Index); ältere Projekte werden nicht rückwirkend migriert.

| Regel | Grenze | Prüfung |
|---|---|---|
| Standbild ohne neue Information | max. **8 s** (geschätzt aus dem Skript, 142 Wörter/Min. inkl. Pausen — an Video 1 und 2 gemessen) | `youtube:validate` Fehler; nach echtem Audio warnt der Zusammenbau ab 10 s |
| Hook bis zum ersten inhaltlichen Kapitel | max. **20 s** | `youtube:validate` |
| Kommentarfrage | muss im Skript stehen, im mittleren Teil (30–75 % der Wörter) | `youtube:validate` |
| Endkarte | **15 s** nach dem Voiceover, Kanalname oben, Fläche frei für die YouTube-Endelemente | automatisch im Zusammenbau |

## Qualitätsregeln V2 — Skript, Bild und Animation fest gebunden (`finanzneo-youtube-quality-v2`, 17.10.2026)

Aus der Wettbewerbsanalyse (simplicissimus, Kurzgesagt, Finanzfluss) und der Rückschau zu Video 1 und 2. Gilt für alle neu angelegten Projekte zusätzlich zu V1:

| Regel | Warum | Prüfung |
|---|---|---|
| **Hook ohne Ankündigung** — kein „In diesem Video …“, „heute erkläre ich …“, „ich zeige dir …“; Start mit Szene, Person oder Konflikt | Die stärksten Erklärvideos starten mit einer Geschichte, nicht mit einem Inhaltsverzeichnis | `youtube:validate` |
| **Hauptfigur** (`story.protagonist`, z. B. „Lena“) wird im Hook genannt und trägt das Video; bewusst `null` nur mit Begründung (z. B. reine News) | Eine Figur verbindet Skript („Lena zahlt …“), Bilder (dieselbe Figur) und Animationen („Lenas Raten“) zu einer Geschichte | `youtube:validate` |
| **Figur ohne Flow-„Charakter“** — `story.figurBild` (`'Thumbnail'` oder Bildnummer) legt die Figur einmal fest; jedes Bild mit `figur: true` hängt dieses Bild als `CHARACTER_REFERENCE:` an („dieselbe Person wie in …“) und liegt in einem späteren Batch | Gleiche Figur in jedem Bild ohne Extra-Schritt in Flow (Arman, 17.10.2026) | Plan-Generator + `youtube:validate` |
| **`keyword` pro Bild** — ein Wort, das genau in seinem Sprechabschnitt fällt und das Bild zeigt | Bild zeigt, was in dem Moment gesagt wird, nicht nur ungefähr das Thema | `youtube:validate` |
| **`bridgeObject` pro Animation** — ein Objekt aus dem Bild davor oder danach, das die Animation sichtbar weiterträgt (gleiche Form, Farbe, Name) | Kein Weltwechsel zwischen Illustration und Grafik; die Animation ist die bewegte Fortsetzung des Bildes | `youtube:validate` + Motion-Director |

Zu lange Standbilder löst man mit einem zusätzlichen Bild oder mit `akzente[]` am Visual (`{cue, text, ton}`): Ein Akzent erscheint beim gesprochenen Wort als kleine Karte auf dem Bild und zählt als neue sichtbare Information.

## Vollständiges Publishing-Paket

`_intern/05-publishing/` enthält (für den Upload reicht `5-export/caption.txt`):

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

`youtube:ready` prüft Phase 1, den unveränderten Motion-V3-Seal, exakte Nutzerbilder, 16:9-Abmessungen, genau ein lesbares Voiceover, passende Wortzeiten und das vollständige Publishing-Paket. Nur ein erfolgreicher Lauf gibt Phase 3 frei.