# FinanzNeo — YouTube-Longform-Produktionsstandard

> Bei Widersprüchen gilt `CLAUDE.md`. Für YouTube-Motion gilt zusätzlich `docs/YOUTUBE-MOTION-V2.md`.

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

## Beat-first Visualplanung

Es gibt **keine feste Visualzahl und keine feste Bild-/Animationsquote**.

```text
Skript
→ gesprochene Gedanken
→ sichtbare Visual Beats
→ beste Visualart je Beat
→ sinnvolle Gruppierung
```

Erlaubte Visualtypen:

- `image`
- `animation`
- `hybrid`
- `data`

## Remotion / Motion V2

`MOTION_STANDARD: finanzneo-youtube-motion-v2`

Die visuelle Technik wird aus dem Inhalt gewählt, nicht aus einer festen Komponentenbibliothek. Custom React, SVG, CSS 3D, Canvas, Three.js/R3F, Masks, Paths/Shapes, Motion Blur, Effects, Lottie als Support, Datenvisualisierung und Bild+Motion-Hybrid sind erlaubt.

`PremiumPhysicalStage` und `Physical*` sind **optional**. Bestehende Komponenten sind Werkzeuge, keine Pflichtvorlagen.

Jedes Motion-Visual braucht:

- produktionsreife `animation.tsx` bereits in Phase 1
- `mechanicId`
- `visualTechniqueId`
- `compositionFamilyId`
- `animationIntent`
- mindestens zwei sinnvolle Motion Channels
- mindestens zwei sichtbare Visual Beats

Vor Phase 2:

```bash
npm run youtube:animation:validate -- youtube/<Projekt>
npm run youtube:phase1:seal -- youtube/<Projekt>
```

Nach dem Seal darf Phase 3 die kreative Mechanik nicht ersetzen.

## Bildwelt und Google Flow

Die bestehende FinanzNeo-Welt bleibt unverändert:

- `finanzneo-connected-studio-v3`
- `finanzneo-same-world-v1`
- YouTube-Quellbilder horizontal 16:9

Für neue YouTube-Bilder gilt **Literal first, creative second**:

- konkrete reale Situation zuerst
- klarer Finanz-/Alltagskontext
- sichtbarer Bezug zum Voiceover
- Metapher nur, wenn sie wirklich klarer ist
- kein generisches Finanzsymbolbild als Default

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

`youtube:ready` prüft Phase 1, den unveränderten Motion-Seal, exakte Nutzerbilder, 16:9-Abmessungen, genau ein lesbares Voiceover, passende Wortzeiten und das vollständige Publishing-Paket. Nur ein erfolgreicher Lauf gibt Phase 3 frei.
