# FinanzNeo — YouTube Layoutstandard V2

`LAYOUT_STANDARD_ID: finanzneo-youtube-framed-v1`

Dieser Standard ist für neue YouTube-Longform-Videos verbindlich und überschreibt bei Layout-/Caption-Konflikten ältere Angaben in `CLAUDE.md`.

## 1. Kein Bild und keine Animation als ungestaltete Vollbildfläche

Das 1920×1080-Video bleibt eine gestaltete FinanzNeo-Bühne.

- Flow-Bilder werden nicht randlos als kompletter Hintergrund gezogen.
- Remotion-Animationen werden nicht als ungestaltete alleinige Vollbildfläche verwendet.
- Visuals sitzen in einem klaren Content-Frame mit sichtbarem Außenraum.
- Standard: ungefähr 120 px Seitenrand, eigener Kopfbereich oben, Content-Frame darunter.
- Der Content-Frame darf intern `cover` oder `contain` verwenden.
- Schwarzer Hintergrund, ruhiger Rand, keine künstliche Browser-/Dashboard-Chrome.

Referenzkomponente:

`src/design-system/youtube-stage.tsx -> YouTubeSectionFrame`

## 2. Jeder Visual Beat bekommt Zwischenüberschrift + Icon

Über dem Content-Frame steht eine kurze Zwischenüberschrift mit passendem Linien-Icon.

Regeln:

- kurze natürliche Überschrift
- kein zweites Voiceover als Textzeile
- Icon erklärt/markiert den Abschnitt
- Header ruhig, nicht aggressiv animiert
- maximal eine Zeile im Normalfall

## 3. Keine eingebrannten Untertitel

Im finalen Video gibt es **keine eingebrannten Untertitel/Captions**.

Wort-Timings bleiben Pflicht für:

- Schnitte
- Timing
- `script-mit-zeitstempeln.txt`
- `.srt` als externe YouTube-Untertitel

Nicht erlaubt:

- Wort-für-Wort-Captions im Bild
- aktives Wort grün markieren
- Boxed Captions
- automatische Wiederholung des Voiceovers als Text

## 4. Bildinhalt: Bedeutung zuerst, Form frei

`FLOW_IMAGE_POLICY: meaning-first-free-visual-v2`

Die Layout-Bühne entscheidet **nicht**, welche Bildform benutzt werden muss.

Erlaubt und gleichberechtigt:

- einzelnes Objekt
- Detail / Makro
- Hände
- Mensch
- reale Szene
- Vergleich
- Vorher/Nachher
- Ursache/Wirkung
- semantische Objektanordnung
- visuelle Metapher
- kreative Bildidee

Menschen, Orte, Tische und reale Räume sind niemals Pflicht.

### Semantische Objektanordnung

Objekte dürfen ohne Tisch oder reale Auflagefläche frei im Raum stehen, wenn ihre Position die Aussage erklärt.

Beispiele:

- kaputter Kopfhörer → neuer Kopfhörer → zwei Belege
- Wallet links ↔ Terminal rechts
- ein heutiger Beleg → mehrere wiederkehrende Belege

Nicht erlaubt ist bloß dekoratives Schweben ohne Bedeutung.

## 5. Keine Bildidee auf Krampf

Vor jeder Bildentscheidung:

1. Was soll der Zuschauer verstehen?
2. Welche Bildform erklärt es am schnellsten?
3. Hat jedes Element einen Grund?
4. Wird ein Mensch, Tisch oder Raum nur benutzt, weil das vorher funktioniert hat? Dann neu denken.

Präzise Zahlen/Charts/UI bleiben Remotion-owned. Eine konzeptuelle oder schematische Flow-Idee ist trotzdem erlaubt, solange sie keine Präzision vortäuscht.

## 6. Layout-Datei pro Video

Jedes Projekt braucht:

`06-projektdateien/layout.json`

Darin stehen mindestens:

- Standard-ID
- Content-Frame-Regel
- Untertitel aus
- Zwischenüberschrift/Icons
- eigener Header pro Visual
- `imagePolicy.meaningFirst = true`
- `imagePolicy.sceneFirst = false`
- `imagePolicy.peopleRequired = false`
- `imagePolicy.placeRequired = false`
- `imagePolicy.semanticObjectCompositionsAllowed = true`
- `imagePolicy.visualMetaphorsAllowed = true`

`npm run youtube:validate -- youtube/<Projekt>` prüft diesen Vertrag.


## 7. Render-Contract ist Pflicht

Zusätzlich zu `layout.json` braucht jedes neue Video:

`06-projektdateien/render-contract.json`

Dieser Vertrag ist **nicht nur Dokumentation**, sondern legt die konkrete Render-Route fest.

Für jeden IMAGE-Beat:

- `component = YouTubeFramedImage`
- `fullScreen = false`
- `objectFit = contain`
- `sourceFile` muss exakt dem `googleFlowFileName` des Beats entsprechen
- Titel und Icon müssen exakt aus `layout.json` kommen

Für Motion/Data:

- `component = YouTubeSectionFrame`
- `fullScreen = false`

### Thumbnail-Isolation

Das Thumbnail ist Upload-/Cover-Material und niemals Timeline-Material.

- `thumbnail.timelineEligible = false`
- keine Datei mit Präfix `YouTube Thumbnail` darf als Szenenquelle gerendert werden
- A/B/C-Coverkandidaten dürfen niemals in der Timeline auftauchen

Damit reicht es nicht mehr, nur `fullScreenForbidden: true` in JSON zu schreiben: **auch die konkrete Render-Route jedes Beats wird validiert.**
