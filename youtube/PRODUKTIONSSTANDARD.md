# FinanzNeo — YouTube-Longform-Produktionsstandard

> Bei Widersprüchen gilt `CLAUDE.md`. Für YouTube-Motion gilt zusätzlich `docs/YOUTUBE-MOTION-V3.md`. Für die Wahl zwischen Remotion, Bild+Remotion, SVG, Icons und Lottie gilt `docs/FINANZNEO-VISUAL-SELECTION-RULE.md`.

## Projektstruktur

```text
youtube/
└── <Woche>/                      z. B. 2026-09-14_bis_2026-09-20 (Montag bis Sonntag)
    └── <Thema>/                  z. B. notgroschen
        ├── 01-script/            script.txt · voiceover ← du · word-timings.json
        ├── 02-bilder/            alle-bildprompts.txt · bildwelt.txt
        │                         ZIP-HIER-REIN/ ← du · 00-ALLE-BILDER-HIER-REIN/
        ├── 03-export/            video.mp4 · thumbnail.png · titel.txt
        │                         beschreibung.txt · kapitel.txt · keywords.txt
        │                         hashtags.txt · social/
        └── 04-projekt/           briefing · quellen · visual-index.json
                                  visual-plan · remotion-plan · VISUALS/
```

Im Alltag berührst du nur `01-script`, `02-bilder` und `03-export`. `04-projekt` hält
Recherche und Technik und muss für Phase 2 nicht geöffnet werden.

## Format und Inhalt

- eigenständiges längeres Finanz-Erklärvideo, kein verlängertes Reel
- keine YouTube Shorts
- 1920 × 1080, horizontal 16:9, 30 fps
- Länge folgt dem Thema; keine künstlichen Füllpassagen
- Hook ohne langes Intro
- Kapitel mit klaren Zwischenzielen und Payoffs
- einfache Sprache für Finanzanfänger
- Zahlen, Annahmen und Datenstand prüfbar dokumentieren
- keine individuelle Anlageberatung oder garantierte Rendite

## Skript, das sich bebildern lässt

Das Skript entscheidet, ob gute Visuals überhaupt möglich sind. Es wird deshalb von Anfang an so geschrieben, dass zu jedem Gedanken etwas Sichtbares gehört.

- Jeder Absatz nennt **konkrete Dinge**: Waschmaschine, Rechnung, Konto, Kalenderblatt, Geldschein. Abstrakte Sätze ohne Gegenstand lassen sich nur mit Text bebildern — und Text ist als Hauptaussage verboten.
- Zahlen kommen mit ihrem Bezug: nicht „eine Reserve aufbauen", sondern „1.500 Euro im Monat, also 4.500 für drei Monate". Eine Zahl mit Bezug wird ein Füllstand, ein Stapel, eine Höhe.
- Vergleiche werden als **zwei Zustände** formuliert, nicht als Begriffspaar. „Vorher / nachher", „mit / ohne", „Person A / Person B" ergeben eine sichtbare Veränderung.
- Eine Aufzählung im Text wird zu einer Reihe echter Gegenstände. Vier Fragen heißen vier Dinge, nicht vier Kästchen.
- Wo das Skript nur benennt statt zu zeigen, wird es umformuliert — nicht die Animation mit Text gefüllt.

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

Erlaubte Visualtypen — eine Szene ist ein Bild **oder** Bewegung, nie beides:

- `image`
- `animation`
- `data`

### Nichts wird abgeschnitten

Gilt für Bilder wie für Motion, und zwar über die ganze Kette:

- Ein Flow-Prompt verlangt **nie**, dass etwas beschnitten, zugeschnitten oder am Rand abgeschnitten wird. Das Bild wird vollständig als 16:9 erzeugt.
- Beim Einsortieren wird ein Nutzerbild **nie** beschnitten. `youtube:images:import` kopiert nur — es gibt keinen Grund, daran vorbei von Hand zuzuschneiden.
- Im Layout steht das Bild mit `objectFit: contain` in der Visualzone. Es wird vollständig gezeigt, auch wenn dabei schmale schwarze Ränder bleiben. Ränder sind kein Fehler; ein abgeschnittener Gegenstand ist einer.
- Eine Animation zeichnet ausschließlich innerhalb der Visualzone. Die Bühne clippt hart, und was außerhalb liegt, sieht niemand in der Preview, im Render aber als abgeschnittene Kante. `youtube:animation:validate` prüft das; ein bewusst relativer Wert wird mit `zone-ok` in derselben Zeile markiert.

### So viele Visuals wie die Aussage braucht

Mehr Bilder und mehr Animationen sind ausdrücklich erlaubt. Ein zusätzlicher Beat kostet nur einen Flow-Job, ein zu lange stehendes Bild kostet Zuschauer.

- Wichtige Aussagen, Zahlenbeispiele und Wendepunkte bekommen ein **eigenes** Visual, nicht eine Ecke eines bestehenden.
- Steht ein Standbild länger als etwa zwölf Sekunden, gehört an dieser Stelle ein weiterer Beat geprüft.
- Trägt ein Beat eine echte Veränderung — etwas wird mehr, weniger, wandert, kippt, geht auf —, ist eine Animation die bessere Wahl als ein Bild.
- Dieselbe Mechanik nicht zweimal im selben Video.

## Visual Selection V1

`VISUAL_SELECTION_STANDARD: finanzneo-visual-selection-v1`

Vor der konkreten Technik wird die Visualart festgelegt:

- **einfache, zahlen-/datengetriebene Erklärung → pure Remotion**
- **komplexe, reale oder räumliche Erklärung → Bild + Remotion Hybrid**
- **SVG → präzise Pfade, Charts, Linien, Verbindungen und Vektor-Mechaniken**
- **Icons → semantische Kurzschrift / Support**
- **Lottie → kleine Support-Bewegung, niemals Hauptstil**

Komplexes Thema bedeutet nicht automatisch komplexe Animation. Ziel ist, schwierige Finanzlogik so einfach sichtbar zu machen, dass der Zuschauer die Erklärung versteht und nicht die technische Komplexität wahrnimmt.

Icons, Lottie und SVG werden nur ergänzt, wenn sie einen konkreten Erklärwert haben. Ein vorhandenes Asset ist niemals allein ein Grund für die Visualwahl.

Kanonische Detailregel:

```text
docs/FINANZNEO-VISUAL-SELECTION-RULE.md
```

## Remotion / Motion V3

`MOTION_STANDARD: finanzneo-youtube-motion-v3`

### Grundregel

**Eine FinanzNeo-Welt, aber keine feste Animationsart.**

Die visuelle Technik wird erst gewählt, nachdem feststeht, was der Zuschauer tatsächlich sehen soll. Custom React, SVG, CSS 3D, Canvas, Three.js/R3F, Masks, Paths/Shapes, Motion Blur, Effects, Lottie als Support, konsistente SVG-Icons als Support, Datenvisualisierung, Bild+Motion-Hybrid sowie neue sinnvolle Kombinationen sind erlaubt.

Die bekannten Familien wie `spatial-3d`, `timeline`, `document-motion`, `data-viz`, `simulation` oder `camera-journey` sind **nur Beispiele zur Beschreibung**, keine Whitelist. Neue `compositionFamilyId`-Werte dürfen jederzeit entstehen, wenn sie die Szene besser beschreiben.

`Physical*` und bestehende FinanzNeo-Komponenten sind **optionale Werkzeuge**, keine Pflichtvorlagen. `PremiumPhysicalStage` ist dabei ausgenommen: sie clippt mit Reel-Tokens und schneidet in 16:9 bei y = 560 ab. Für YouTube gilt `YouTubePhysicalStage`.

Jedes Motion-Visual braucht:

- produktionsreife `animation.tsx` bereits in Phase 1
- `viewerChange` — was der Zuschauer konkret sichtbar verändern/enthüllen/vergleichen/reisen sehen soll
- `animationIntent` — warum genau diese Veränderung den gesprochenen Punkt erklärt
- `mechanicId`
- `visualTechniqueId`
- `techniqueDescription`
- freien `compositionFamilyId`
- `toolStack`
- `motionSignature` mit `camera`, `layout`, `transformation`
- mindestens zwei sinnvolle Motion Channels
- mindestens zwei sichtbare Visual Beats

### Jedes Video bekommt eigene Animationen

Animationen werden **pro Video neu gebaut**, nicht aus einem früheren übernommen.

- Keine Animation aus einem anderen Video kopieren, umbenennen oder mit getauschten Beschriftungen wiederverwenden.
- Die Mechanik einer Szene wird aus **ihrem** Satz abgeleitet: Was passiert dort konkret, und welcher Gegenstand macht das sichtbar? Nicht aus einem Katalog gewählt und dann passend geredet.
- `mechanicId` und `visualTechniqueId` sind pro Video neu und beschreiben, was in dieser Szene tatsächlich geschieht.
- Ein Baukasten-Primitive wie `PhysicalReserveTank` darf in mehreren Videos vorkommen — die **Mechanik** darum herum nicht. Derselbe Behälter, der in jedem Video gleich vollläuft, ist Wiederholung.
- Gründlich heißt: erst das Skript und die Szene lesen, dann die Mechanik festlegen, dann bauen. Nicht andersherum.

Der Grund ist derselbe wie bei der Vielfalt innerhalb eines Videos: Übernommene Motion passt fast nie genau auf den neuen Satz, und was nicht genau passt, erklärt nichts.

### Echte Vielfalt statt umbenannter Wiederholung

Ein neuer Technikname allein zählt nicht als neue Animation.

Die CI prüft zusätzlich:

- doppelte `visualTechniqueId`
- doppelte `mechanicId`
- identische `techniqueDescription`
- mehr als zwei gleiche Familien direkt hintereinander
- identische Kombination aus **Kamera + Layout + Transformation** innerhalb der letzten vier Motion-Visuals

Wiederholung bleibt erlaubt, wenn sie für den Inhalt tatsächlich die beste Lösung ist. Dann braucht sie eine konkrete `repeatTechniqueReason`.

Das Ziel ist **nicht**, zwanghaft jeden Effekt nur einmal zu verwenden. Das Ziel ist, für jeden Gedanken die klarste visuelle Erklärung zu wählen und bequeme Copy-Paste-Motion zu verhindern.

Vor Phase 2:

```bash
npm run youtube:animation:validate -- youtube/<Woche>/<Thema>
npm run youtube:phase1:seal -- youtube/<Woche>/<Thema>
```

Der Phase-1-Seal schützt danach sowohl den Motion-Code als auch den kreativen V3-Vertrag (`viewerChange`, Technikbeschreibung, Tool-Stack, Motion-Signatur, Beats und Channels). Phase 3 darf die Mechanik nicht kreativ ersetzen oder vereinfachen.

## Bildwelt und Google Flow

`IMAGE_WORLD: finanzneo-youtube-cg-animated-black-v2`

Kanonische YouTube-Bildwelt:

```text
config/finanzneo-image-worlds/finanzneo-youtube-cg-animated-black-v2.txt
```

Sie übernimmt die bestehende FinanzNeo-Grundwelt:

- `finanzneo-connected-studio-v3`
- `finanzneo-same-world-v1`
- stilistische Herkunft: `finanzneo-stylized-3d-animated-black-v9`
- YouTube-Quellbilder horizontal 16:9

**Kernsatz: real in der Identität, animiert im Rendering.**

- Identität echt: der Gegenstand ist genau das Ding, das ein deutscher Haushalt besitzt, mit den Merkmalen, an denen man ihn erkennt. Geld sind erkennbare Euro-Scheine mit richtiger Farbe und lesbarer Wertzahl; Geld behält seine echte Farbe.
- Material und Licht CGI: Frame aus einem vollständig CG-animierten 3D-Spielfilm, sauber modelliert, warmes Key Light mit weichem Rim Light. Keine Fototextur, kein gescanntes Material, kein Kamerakorn.
- Nichts im Bild wurde jemals fotografiert.

Die Wörter Pixar, Cartoon, Clay oder Toy stehen **nie** im Prompt — Bildmodelle lesen sie als Knetfiguren und Badespielzeug. Das Handwerk wird ausgeschrieben.

Es gibt **kein Referenzbild**. Kein Bild wird als Stilanker hochgeladen oder angehängt, auch kein freigegebenes aus derselben Serie. Google Flow hat zwischen zwei Jobs kein Gedächtnis; eine Bildreferenz schleppt Motiv und Layout mit, während der Renderstil trotzdem auf den fotografischen Default zurückfällt. Einheitlichkeit entsteht nur durch den ausgeschriebenen Style Lock in jedem einzelnen Prompt.

Weitere verbindliche Regeln der V2-Welt:

- **mindestens ein echtes 3D-Objekt pro Bild**; nie eine Szene nur aus Papier und Dokumenten
- **eine Beziehung pro Bild** — groß/klein, nah/fern, offen/zu, kippt/steht, drückt/wird gedrückt — plus ein sprechendes Detail, das genau diese Beziehung zeigt
- **Hintergrund reines Schwarz.** Ein kleiner zweckgebundener Ausschnitt eines echten Ortes ist erlaubt, wenn die Situation ihn braucht, und löst sich nach kurzer Distanz ins Schwarz auf. Nie ein ganzer Raum, nie ein Studioboden, nie eine Schreibtisch- oder Holzfläche, nie ein Verlaufshintergrund.
- **Menschen sind erlaubt**, wenn die Situation menschlich ist: stilisierte anonyme 3D-Animationsfilm-Person, Gesicht immer klar sichtbar, frontal oder Dreiviertelansicht, eine Person, einfache natürliche Pose. Nie eine reale oder identifizierbare Person, nie fotorealistische Haut, nie eine gesichtslose Figur, nie reine Rückenansicht. Die Situation bleibt auch ohne die Person lesbar.
- **kein Wort und keine Zahl als großes 3D-Objekt**, kein erfundener Text, keine erfundene Zahl
- **oben ruhiger schwarzer Freiraum** für die spätere Zwischenüberschrift
- Prompts kurz halten, Aufbau Stilblock → SCENE → kurze Stil-Erinnerung; der Stil steht vorne **und** hinten

Wiederkehrende Finance-Kit-Motive sind keine Pflichtmotive: Ordner, Münzstapel, Sparschwein, Tresor, Pflanzen, Pfeile oder leuchtende Geldpfade. Jede Szene wird aus dem tatsächlichen Sprechpunkt neu entwickelt.
Für neue YouTube-Bilder gilt **Literal first, creative second**:

- konkrete reale Situation zuerst
- klarer Finanz-/Alltagskontext
- sichtbarer Bezug zum Voiceover
- Ursache und Wirkung möglichst im selben Bild verständlich
- Metapher nur, wenn sie wirklich klarer ist
- kein generisches Finanzsymbolbild als Default
- keine flache Infografik oder Präsentationsfolie als Standardbild
- wichtige Objekte groß und auch im YouTube-Playback sofort lesbar
- lokaler Umgebungskontext nur, wenn er die Situation glaubwürdiger oder klarer macht; er löst sich in die schwarze FinanzNeo-Welt auf
- das Standbild muss bereits funktionieren, bevor Remotion-Bewegung hinzukommt

Bildprompts immer Englisch; nur ausdrücklich gewünschte kurze Objektlabels im Bild sind Deutsch. Keine Headline, Untertitel oder erklärenden Sätze im KI-Bild.

Einzige Übergabe an Google Flow:

```text
02-bilder/alle-bildprompts.txt
```

Jedes Bild wird einzeln erzeugt, vollständig abgewartet, sofort exakt umbenannt und geprüft. Erst danach folgt das nächste Bild. Alle fertigen Dateien liegen gemeinsam in `02-bilder/00-ALLE-BILDER-HIER-REIN/`.

## Layout V1

Kanonische Quelle: `src/youtube/layout.ts`. Details und Komponenten: `docs/YOUTUBE-MOTION-BAUKASTEN.md`.

```text
  0 – 180     Kopfbahn        Zwischenüberschrift + Icon
180 – 990     Visualzone      Bild 1440 × 810 bei x = 240
990 – 1080    Infobahn        optionaler einzeiliger Infotext
```

Das Bild steht auf drei Vierteln der Framebreite, damit oben Platz für die Zwischenüberschrift bleibt. Da die Bildwelt reines Schwarz vorschreibt, gehen die Bildkanten in die Videofläche über.

## Audio, Timing und Untertitel

- genau ein finales Voiceover in `01-script/`
- echte Wort-Zeitstempel aus genau diesem Audio
- Schnitte folgen Sprache, Visual Beats, Kapiteln und Payoffs
- keine pauschal gleich langen Visuals
- **keine Untertitel** — weder ins Bild gebrannt noch als hochladbare Datei (SRT/VTT) im Export: Reels laufen stumm im Feed und brauchen Karaoke-Captions, Longform wird mit Ton geschaut. Unten steht höchstens optionaler einzeiliger Infotext. Die Wort-Zeitstempel dienen ausschließlich den Schnitten, nicht der Untertitelung
- Audioziel ungefähr -16 LUFS, True Peak höchstens -1 dBTP

## Vollständiges Publishing-Paket

`03-export/` enthält neben dem fertigen Video und dem Thumbnail:

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
npm run youtube:validate -- youtube/<Woche>/<Thema>
npm run youtube:animation:validate -- youtube/<Woche>/<Thema>
npm run youtube:phase1:seal -- youtube/<Woche>/<Thema>
npm run youtube:ready -- youtube/<Woche>/<Thema>
```

`youtube:ready` prüft Phase 1, den unveränderten Motion-V3-Seal, exakte Nutzerbilder, 16:9-Abmessungen, genau ein lesbares Voiceover, passende Wortzeiten und das vollständige Publishing-Paket. Nur ein erfolgreicher Lauf gibt Phase 3 frei.

## Phase 3 — von den Assets zur fertigen MP4

```bash
npm run youtube:phase3:stage -- youtube/<Woche>/<Thema>   # Assets nach public/ spiegeln
npm run youtube:phase3:build -- youtube/<Woche>/<Thema>   # Composition aus den Projektdaten erzeugen
npm run youtube:render       -- youtube/<Woche>/<Thema>   # Preflight, Render, QA und Export in einem Lauf
```

`youtube:render` fährt die ganze Kette und bricht an jedem Tor ab, statt ein halbes Video weiterzureichen:

```text
Preflight    youtube:ready · Animationsbindungen · gespiegelte Assets · Composition aktuell
Render       1920 × 1080, 30 fps, H.264 CRF 16
Render-QA    Auflösung · Framerate · Länge gegen Timeline · Tonspur
             pro Szene ein Frame auf echten Bildinhalt geprüft
Export       Video, Thumbnail und Kapitel-Zeitstempel nach 03-export/
```

Die Einzelschritte `youtube:phase3:preflight`, `youtube:phase3:qa` und `youtube:export` gibt es für kontrollierte Wiederholungen.

Die Composition wird **generiert**, nicht von Hand gepflegt: `youtube:phase3:build` schreibt sie aus `visual-index.json` und den Wortzeiten. Der Preflight vergleicht sie mit den aktuellen Projektdaten und blockiert, wenn sie veraltet ist.

**Eine vorhandene MP4 gilt nicht als fertig.** Die Render-QA misst je Szene die Spitzenhelligkeit in der Visualzone gegen den Schwarzwert des Videos — gemessen 223 bei echtem Inhalt gegen 16 bei Vollschwarz. Ein schwarzes oder nur mit Überschrift gefülltes Video fällt durch.