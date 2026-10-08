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

Kanonische YouTube-Motion-Welt:

```text
docs/FINANZNEO-YOUTUBE-MOTION-WORLD-V1.md
```

`MOTION_STANDARD: finanzneo-youtube-motion-v3`

`MOTION_WORLD: finanzneo-youtube-open-motion-v1`

### Grundregel

YouTube-Animationen haben **keine feste Art-Direction**.

Fest bleibt nur:
- 1920 × 1080 / 16:9
- produktionsreife Remotion-Ausführung
- klare Erklärung
- hohe visuelle Qualität

Pro Szene darf frei gewählt werden:
- hell oder dunkel
- 2D / 2.5D / Full 3D
- Vergleich / Chart / Timeline / Dokument / Objektmetapher / abstrakte Welt
- statische oder bewegte Kamera
- komplett andere Palette oder Umgebung
- bestehende Komponenten oder komplett eigener Aufbau

Die statische Flow-Bildwelt ist **nur optionale Inspiration**. Auch eine komplett andere Animationswelt ist erlaubt, wenn sie besser funktioniert.

Ein einfacher Vergleich kann genauso richtig sein wie eine aufwendige 3D-Szene.

Custom React, SVG, Canvas, Paths/Shapes, Datenvisualisierung, Dokument-Motion, Timelines, Vergleiche, Lottie, Three.js/R3F und neue sinnvolle Kombinationen sind gleichberechtigte Werkzeuge.

Keine Stilfamilie wird pauschal verboten. Ablehnung erfolgt nur bei echten Qualitäts- oder Verständlichkeitsproblemen.

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

Eine klare Hauptbewegung darf vollständig reichen. Mehr Motion ist kein Qualitätsmerkmal.


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
04-visuals/alle-bildprompts.txt
```

Jedes Bild wird einzeln erzeugt, vollständig abgewartet, exakt umbenannt und geprüft.


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