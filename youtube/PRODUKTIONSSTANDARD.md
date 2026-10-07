# FinanzNeo — YouTube-Longform-Produktionsstandard

> Bei Widersprüchen gilt `CLAUDE.md`. Für YouTube-Motion gilt zusätzlich `docs/YOUTUBE-MOTION-V3.md`. Für die Wahl zwischen Remotion, Bild+Remotion, SVG, Icons und Lottie gilt `docs/FINANZNEO-VISUAL-SELECTION-RULE.md`.

## Projektstruktur

```text
01-recherche/
02-script/
03-audio/
04-visuals/
05-publishing/
06-projektdateien/
README.md
```

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

`PremiumPhysicalStage`, `Physical*` und bestehende FinanzNeo-Komponenten sind **optionale Werkzeuge**, keine Pflichtvorlagen.

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
npm run youtube:animation:validate -- youtube/<Projekt>
npm run youtube:phase1:seal -- youtube/<Projekt>
```

Der Phase-1-Seal schützt danach sowohl den Motion-Code als auch den kreativen V3-Vertrag (`viewerChange`, Technikbeschreibung, Tool-Stack, Motion-Signatur, Beats und Channels). Phase 3 darf die Mechanik nicht kreativ ersetzen oder vereinfachen.

## Bildwelt und Google Flow

`IMAGE_WORLD: finanzneo-youtube-grounded-3d-black-v1`

Kanonische YouTube-Bildwelt:

```text
config/finanzneo-image-worlds/finanzneo-youtube-grounded-3d-black-v1.txt
```

Sie übernimmt ausschließlich die FinanzNeo-Rendering-Sprache für 16:9:

- premium stylized 3D
- klar nicht fotorealistisch
- tiefe schwarze Welt
- FinanzNeo-Farbrollen
- sauberes weiches Studio-Licht
- konsistente Materialwirkung

Die frühere globale YouTube-Bildprompt-Formel ist entfernt. Keine Literal-first-, Ursache/Wirkung-, Kontextanker-, Objektzahl-, Label- oder Promptlängen-Regel wird automatisch erzwungen.

Bildprompts bleiben Englisch. Eine generische Überschrift wird nicht automatisch in das KI-Bild gesetzt; Text ist nur erlaubt, wenn die konkrete Szene ihn ausdrücklich vorsieht.

Einzige Übergabe an Google Flow bleibt:

```text
04-visuals/alle-bildprompts.txt
```

Jedes Bild wird einzeln erzeugt, vollständig abgewartet und exakt umbenannt.


## Audio, Timing und Untertitel

- genau ein finales Voiceover in `03-audio/`
- echte Wort-Zeitstempel aus genau diesem Audio
- Schnitte folgen Sprache, Visual Beats, Kapiteln und Payoffs
- keine pauschal gleich langen Visuals
- Untertitel satzweise; aktives Wort grün, Rest weiß
- Audioziel ungefähr -16 LUFS, True Peak höchstens -1 dBTP

## Vollständiges Publishing-Paket

`05-publishing/` enthält:

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