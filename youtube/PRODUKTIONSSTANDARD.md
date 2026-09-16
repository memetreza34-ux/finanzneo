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
04-visuals/alle-bildprompts.txt
```

Jedes Bild wird einzeln erzeugt, vollständig abgewartet, sofort exakt umbenannt und geprüft. Erst danach folgt das nächste Bild. Alle fertigen Dateien liegen gemeinsam in `04-visuals/00-ALLE-BILDER-HIER-REIN/`.

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