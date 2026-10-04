# FinanzNeo — YouTube-Longform-Produktionsstandard V4

> Aktiver Standard für neue FinanzNeo-YouTube-Videos. Bei Konflikten gilt zusätzlich `CLAUDE.md`. Neue Reels sind pausiert; YouTube Shorts sind verboten.

## Format

- eigenständiges YouTube-Longform-Video
- 1920 × 1080, horizontal 16:9, 30 fps
- Länge folgt dem Thema
- Hook ohne langes Intro
- einfache Sprache für Finanzanfänger
- Daten, Annahmen und Rechenwege prüfbar

## Grundprinzip

`LOOK FEST — INHALT FREI — WERKZEUG PASSEND`

Für jeden Sprechbeat wird zuerst bestimmt, was der Zuschauer sehen und verstehen soll. Danach wird das Werkzeug gewählt. Google Flow rendert Standbilder im Animationsfilm-Look: Menschen in Alltagsmomenten, Hände in Aktion, echte Gegenstände, kleine echte Orte. Remotion/SVG/React übernimmt präzise Daten-, Text-, Checklisten-, Timeline- und UI-Grafiken.

**Wichtig:** Google Flow ist kein Infografik-Generator. Flow zeigt den Moment aus dem Alltag, Remotion zeigt die exakte Zahl.

---

# 1. Werkzeugwahl — verbindlich

## Google Flow: Standbild aus einem stilisierten 3D-Animationsfilm

Flow wählt innerhalb derselben Bildwelt frei, was den Sprechbeat am schnellsten erklärt:

- **Character Moment** — eine Figur reagiert, zögert, entscheidet, zahlt, liest
- **Hands in Action** — Daumen über einem Knopf, Hand zieht eine Karte, Finger zählen Scheine
- **Object Story** — ein starker echter Gegenstand trägt die Idee (kaputte Waschmaschine mit Reparaturrechnung)
- **Everyday Scene** — wenige echte Gegenstände an einem kleinen echten Ort
- **Comparison Scene** — zwei echte Situationen nebeneinander im selben Bild
- **Creative Idea** — Übertreibung oder Bildidee aus echten Gegenständen, solange sie auf einen Blick lesbar ist
- **Hybrid Scene Plate** — Flow liefert die Szene, Remotion legt exakte Zahlen darüber

### Wann Flow richtig ist

Wenn ein Moment aus dem Alltag den Sprechbeat schnell erklärt:

- konkrete Alltagssituation mit Ursache und Wirkung
- Figur mit klarer Reaktion oder Handlung
- Hand, die gerade etwas tut
- ein dominanter echter Gegenstand mit sichtbarem Problem oder sichtbarer Lösung
- wenige bekannte Alltagsobjekte in einer zusammenhängenden Szene
- zwei Situationen im direkten Vergleich

### Nicht als generisches Flow-Infografikbild erzeugen

Wenn der Kern des Beats hauptsächlich aus präzisen Informationen besteht, gehört er in Remotion/SVG/React:

- exakte Zahlenaufteilung
- dichter Chart oder Datenverlauf
- lange Checkliste
- Timeline
- Tabelle
- mehrere Textzeilen
- exakter UI-/Settings-Zustand
- mathematisch exakter Vergleich

Flow darf bei einem Hybrid eine starke 3D-Szenenbasis liefern. Präzise Zahlen, Labels, UI-Zustände und Daten kann Remotion darüberlegen.

## Karten — der ruhige Standard für Text, Zitat und Tabelle

Vorbild Finanzbär, umgesetzt in der FinanzNeo-Welt (schwarz, Inter, grüne Hervorhebung). Baukasten: `src/design-system/karten.tsx`, Referenz-Composition `DemoKartenBaukasten`.

- `StichwortKarte` — großes Stichwort, optional Zusatzzeile, ein Teil wird grün markiert, wenn er gesagt wird
- `ZitatKarte` — nur Zitat und Autor (Zitat belegt)
- `TabellenKarte` — Zeilen erscheinen nacheinander, eine Zeile grün markiert
- `IconAblauf` — Linien-Icons mit Bogenpfeilen, optional ein Hinweis-Kasten
- `Zeitstrahl` — Punkte nacheinander, optional ein Sprung-Pfeil
- `KartenHinweis` — „Beispielrechnung: …“ oder Quelle am unteren Rand

Karten bewegen sich bewusst wenig: einblenden im Sprechrhythmus, mehr nicht.

## Remotion / SVG / React verwenden

Code-basierte Visuals sind die Standardwahl für:

- animierte Rechenaufteilung
- dynamische Charts / Datenverläufe
- sequenzielle Checklisten
- Timelines
- UI-Zustandswechsel
- frame-genaue Typografie
- exakte Zahlen und mathematische Proportionen
- Vergleiche, bei denen Text und Werte fehlerfrei sein müssen

## Hybrid

Hybrid nur, wenn das Flow-Bild als echte stylized-3D-Szene einen visuellen Mehrwert bringt. Ein Hybrid darf nicht benutzt werden, um eine schlechte Flow-Infografik nachträglich zu retten.

---

# 2. FinanzNeo-Bildwelt — Look fest, Inhalt frei

`YOUTUBE_VISUAL_WORLD_LOCK: finanzneo-youtube-animated-black-v3`

Source Visual Language: `finanzneo-stylized-3d-animated-black-v9`

Freigegebene Stilreferenzen (echte Flow-Bilder, die genau so aussehen sollen):

- Reel „Kurse schwanken“ (20.09.2026) — Figuren und Hände im Alltagsmoment
- YouTube „Notgroschen“ (17.09.2026) — echte Gegenstände auf tiefem Schwarz

Kanonische Datei: `config/finanzneo-image-worlds/finanzneo-youtube-animated-black-v3.txt`

## Der Look — immer gleich

Jedes Bild sieht aus wie ein Standbild aus einem hochwertigen stilisierten 3D-Animationsfilm über Geld im Alltag:

- stilisiertes 3D im Animationsfilm-Look, niemals fotorealistisch
- sympathische stilisierte Erwachsene mit ausdrucksstarken Gesichtern und klarer Körpersprache
- echte Alltagsgegenstände mit glaubwürdigen Proportionen und erkennbaren Details: Handy, Rechnung, Brief, Bankkarte, Geldbörse, Waschmaschine, Auto, Kalender
- halbrealistische Materialien, weich und sauber stilisiert gerendert
- warmes Hauptlicht, sanftes Randlicht gegen das Schwarz, weiche Kontaktschatten
- tiefes nahtloses Schwarz; ein kleiner echter Ort (Küchentisch, Waschecke, Flur, Ladentheke, Autoinnenraum) darf da sein, wenn er hilft, und läuft ins Schwarz aus

## Natürlich — kein KI-Look

Festgelegt von Arman am 04.10.2026 nach dem ersten echten Flow-Lauf (Notgroschen): Die Bildwelt stimmt, aber die Bilder dürfen nicht nach KI aussehen. Jedes Bild wirkt wie ein ruhiges Standbild aus einem Animationsfilm — einfach, natürlich, sofort verständlich. Nicht abstrakt und nicht schwer.

- wenige echte Gegenstände, glaubwürdig angeordnet; natürliche Proportionen, Farben und weiches Licht
- echte Dinge in einer echten Situation statt eines Symbols, das man entschlüsseln muss
- sauber, aber nicht plastik-glänzend; keine überschärften Details, keine übersättigten Farben
- Text nur exakt die verlangten Wörter; keine erfundenen Zusatzlabels
- **KI-Slop verboten:** leuchtende oder Neon-Kanten, Glas-/Kristallbalken und -blöcke, Wertblöcke und Wertstapel als Symbol, fallende Balken oder Pfeile, dramatisches rotes Glühen, Rauch, Funken, Lens Flares, Nebel, epische Poster-Dramatik, Geldscheinstapel als Deko, überladener Hintergrund

`youtube:validate` lässt Bildprompts mit solchen abstrakten Motiven nicht durch.

## Der Inhalt — frei, wenn es passt

Es gibt keine Objektliste und keine Quote. Gegenstände, Orte, kreative Ideen, ab und zu Menschen — alles darf vorkommen, wenn es den Sprechpunkt visuell unterstützt. **Nichts auf Krampf:** Die meisten Bilder brauchen keine Person und keine Geschichte.

## Der entscheidende Moment — ab und zu

Nur wenn der Sprechpunkt von etwas handelt, das passiert, zeigt das Bild diese Sekunde. Die meisten Bilder brauchen das nicht. Technisches Feld in jedem Bildjob: `DECISIVE_MOMENT: <…>` oder `not-applicable`.

## Abwechslung

Jedes Bild zeigt eine sichtbar andere Situation, einen anderen Ort, Abstand oder Blickwinkel als das Bild davor. Die Einheit entsteht durch den Look, nie durch denselben Tisch, dieselbe Tasse oder dieselben Requisiten.

## Farben

- Emerald = positiv, Lösung, Sparen
- warmes Red-Orange = Kosten, Warnung, Verlust
- Gold = kleiner Geld-/Wert-Akzent
- Warm Ivory und Soft Gray = neutral
- natürliche Haut- und Kleidungsfarben sind erlaubt
- kein dunkelgrün-schwarzer Monochrom-Look

## Prompt-Form — Pflicht

Jeder Bildprompt ist **ein kurzer englischer Absatz in immer derselben Form**. Nur die Labels im Bild sind deutsch.

```text
Stylized 3D animated feature film still, 16:9. [Was im Bild ist]. [Optional: was gerade passiert]. [Ort, nur so viel wie nötig]. Only text: "[deutscher Text]". Warm soft light, deep black background. Not photorealistic, no logos.
```

Beispiel, das in Flow auf Anhieb gepasst hat:

```text
Stylized 3D animated film still, 16:9. A young man at a supermarket checkout has just paid by card: the card terminal glows green, but his relieved smile is freezing, because a small red-orange paper tag reading "Dispo" is swinging from his bank card. Groceries on the belt in front of him. Warm soft light, deep black background, only the checkout counter visible. Expressive faces, real everyday objects, not photorealistic, no logos. Only text: "Dispo".
```

Keine langen Regelblöcke im Einzelprompt — die Regeln stehen einmal im Master.

## Text in Flow-Szenenbildern

Kurze deutsche Objektlabels direkt am Gegenstand, wenn sie helfen: `Teilzahlung`, `Restschuld`, `Reparatur 280 €`.

- kein Titel im normalen Szenenbild
- kein Absatz, keine CTA-Sätze
- kein automatisch erzeugtes FinanzNeo-Logo / Wasserzeichen
- exakte Zahlen, die stimmen müssen, legt Remotion darüber

## Charts / Diagramme / Daten

Werden in Remotion/SVG/React gebaut — echte Achsen, exakte Werte, die Kurve zeichnet sich zum Sprechtext (Referenz: Composition `DemoZinseszinsLinienDiagramm`). Entschieden am 04.10.2026 nach direktem Vergleich mit einem Flow-Diagramm.

## UI / Settings

Werden in Remotion/React gebaut — fiktiv/unbranded, gerade, lesbar, frame-genau. Kein Flow-Screenshot und kein schwebendes Control-Panel.

---

# 3. Globaler Flow-Hard-Fail

Sofort verwerfen und denselben Job neu generieren bei:

- sieht nicht aus wie ein Standbild aus einem stilisierten 3D-Animationsfilm
- Fotorealismus / Stockfoto
- grün-goldene Symbolwelt als Hauptidee: Bankgebäude, Schild, Tresor, Münzberge, leuchtende Icons
- abstrakte Finanzskulptur statt echter Situation: Schuldenklammer, Zinsmagnet, Zahlungs-Token, Geldband, Wertblock, Wertstapel
- KI-Poster-Look: Glas- oder Leuchtbalken, Neon, Rauch, Funken, Drama, erfundene Mini-Labels
- dunkelgrün-schwarzer Monochrom-Look
- flache Infografik / Slide / Poster / Social-Media-Card
- Dashboard-/Control-Panel-/HUD-Look
- Chart, Diagramm, Checkliste, Settings-/UI-Layout oder Progress-Bar als generiertes Bild
- erfundenes oder falsch zugeordnetes Zitat
- kleine schwebende Tiles/Karten/Module
- heller oder farbiger Hintergrund
- winzige isometrische/Diorama-Perspektive, Hauptmotiv zu klein
- Spielzeug-, Plastik- oder Knete-Look
- aufgeräumter Endzustand statt Moment
- dieselbe Szene und derselbe Blickwinkel wie das vorige Bild
- reale identifizierbare Person oder aufgeklebtes echtes Logo

Qualitätsfragen:

1. Sieht es aus wie ein Standbild aus einem stilisierten 3D-Animationsfilm?
2. Ist genau eine Hauptaussage sofort klar?
3. Zeigt es einen Moment statt eines Endzustands?
4. Ist die Alltagssituation echt und erkennbar — ohne Rätsel?
5. Ist das Schwarz tief und das Hauptmotiv groß?
6. Wirkt es natürlich und ruhig — nicht wie ein KI-Poster?

Wenn eine Antwort nein ist: denselben Job neu generieren.

---

# 4. Prompt-Struktur

Der Nutzer kopiert **genau eine einzige Datei vollständig und 1:1** in Google Flow:

`04-visuals/alle-bildprompts.txt`

Diese Datei ist immer der vollständige ausführbare Master-Prompt.

Sie darf niemals ersetzt werden durch:

- Redirect
- Hinweistext
- Platzhalter
- „nicht mehr hier arbeiten“-Datei
- Verweis auf einen anderen Master-Prompt

Interne Promptquellen liegen gesammelt unter:

`04-visuals/01-BILDPROMPTS/`

Dort dürfen Bildwelt, Thumbnail-Prompt und einzelne interne Bildpromptquellen liegen. Der Nutzer kopiert diese Dateien nicht einzeln.

Jeder enthaltene einzelne Bildjob muss selbstständig genug sein, dass Google Flow den Bildstil nicht aus einem vorherigen Bild erraten muss.

---

# 5. Google Flow — Ausführung

`FLOW_EXECUTION_MODE: finanzneo-youtube-cover3-image5-parallel-v4`

Der Master-Prompt muss ausdrücklich verlangen:

- Bilder tatsächlich generieren
- nicht nur Prompts erklären oder zurückgeben
- nur geplante Scene-Jobs ausführen
- jeden Job QA-prüfen
- bei FAIL nur denselben Bildjob wiederholen

## Phase 0 — ein Google-Flow-Ordner pro Video

- genau ein Flow-Projekt (Ordner) pro Video, Name `FinanzNeo – <Videotitel>`
- Cover-Kandidaten und alle Szenenbilder entstehen in diesem einen Ordner

## Phase A — Cover

1. Exakt drei Kandidaten A/B/C als drei getrennte Ein-Bild-Jobs gleichzeitig starten.
2. Alle verwenden dieselbe FinanzNeo-Bildwelt.
3. Unterschiedliche Szenen/Kompositionen sind erwünscht.
4. Kurzer deutscher Hook, maximal 2 Zeilen, ideal 2–5 Wörter.
5. Alle drei QA-prüfen.
6. Danach genau einmal A/B/C vom Nutzer wählen lassen.
7. Die zwei nicht gewählten Kandidaten im Flow-Ordner löschen; nur der Gewinner bleibt und wird exakt umbenannt.
8. Der Gewinner wird niemals Style-Referenz für Szenenbilder.

## Phase B — Szenenbilder

- genau die geplanten Visuals mit Flow-Szenenbedarf — der Plan entscheidet, wie viele Bilder das Video braucht
- bis zu fünf getrennte Ein-Bild-Jobs parallel
- niemals ein Multi-Image-Request
- jedes Ergebnis sofort exakt umbenennen
- jedes Ergebnis sofort QA-prüfen
- bei Fehler das fehlerhafte Ergebnis im Flow-Ordner löschen und nur dieselbe Bildnummer neu generieren
- nächster Batch erst, wenn der aktuelle Batch vollständig PASS ist
- keine weitere Nutzerfreigabe zwischen Batches
- finaler Inventory-QA

`IMAGE_BATCH_SIZE = 5` ist eine maximale Batchgröße, keine Pflicht, fünf Bilder zu erzeugen.

## Abschluss — fertiger Flow-Ordner

- im Flow-Ordner liegen genau das gewählte Thumbnail und jedes geplante Szenenbild — jedes genau einmal, jedes nach seiner Szene benannt
- keine abgelehnten Cover, keine Fehlversuche, keine Duplikate
- kann Flow etwas nicht löschen oder umbenennen, listet der Agent genau auf, was der Nutzer tun muss
- danach lädt der Nutzer den Ordner herunter und legt alles in `04-visuals/00-ALLE-BILDER-HIER-REIN/`

---

# 6. Motion V3

`MOTION_STANDARD: finanzneo-youtube-motion-v3`

- mindestens zwei echte Motion-/Animationsvisuals pro Projekt
- keine starre Obergrenze oder Quote
- Viewer Change zuerst, Technik danach
- produktionsreife `animation.tsx` bereits in Phase 1
- Custom React, SVG, CSS 3D, Canvas, Three.js/R3F und Datenvisualisierung erlaubt
- bestehende Komponenten sind Werkzeuge, keine Stilpflicht
- Variation muss in echter Kamera/Layout/Transformation bestehen, nicht nur in neuen Namen
- Motion nutzt dieselbe FinanzNeo-Premium-Logik; die exakte Farbwahl darf content-spezifisch sein
- Präzisionsgrafiken dürfen bewusst grafisch und frontal sein; sie müssen nicht wie Flow-Bilder aussehen, aber klar zur Serie gehören

Ein normales YouTube-Projekt darf keine reine Slideshow sein.

---

# 7. Kamera und Präzision

Bei präzisen Charts, Daten, UI und Typografie:

- gerade Achsen
- korrekte Skalen
- mathematisch korrekte Werte
- lesbare Labels
- keine Perspektivverzerrung, wenn Genauigkeit darunter leidet

Flow-Szenen dürfen die Kamera frei passend zur Bildidee wählen: frontal, near-frontal, gentle 3/4 oder kontrolliert weiter für Umgebungen. Kein winziger entfernte Isometrie.

---

# 8. Audio und Timing

- genau ein finales Voiceover in `03-audio/`
- echte Wort-Zeitstempel
- Schnitte folgen Sprache, Visual Beats und Kapiteln
- keine pauschal gleich langen Visuals
- Untertitel satzweise; aktives Wort grün, Rest weiß
- Audioziel ca. -16 LUFS, True Peak max. -1 dBTP

---

# 9. Publishing

`05-publishing/` enthält Titelvarianten, finalen Titel, Beschreibung, Kapitel, Keywords/Tags, Hashtags, Thumbnail-Brief, Quellen/Disclaimer, Pinned Comment, Community-Post, Upload-Checkliste und Social-Promo-Texte.

---

# 10. Startfreigabe

```bash
npm run youtube:validate -- youtube/<Projekt>
npm run youtube:animation:validate -- youtube/<Projekt>
npm run youtube:phase1:seal -- youtube/<Projekt>
npm run youtube:ready -- youtube/<Projekt>
```

Nur ein erfolgreicher Lauf gibt Phase 3 frei.
