# FinanzNeo — YouTube Layoutstandard V1

`LAYOUT_STANDARD_ID: finanzneo-youtube-framed-v1`

Dieser Standard ist für neue YouTube-Longform-Videos verbindlich und überschreibt bei Layout-/Caption-Konflikten ältere Angaben in `PRODUKTIONSSTANDARD.md`.

## 1. Kein Bild und keine Animation als Vollbild

Das 1920×1080-Video bleibt eine gestaltete FinanzNeo-Bühne.

- Flow-Bilder werden **niemals randlos über die komplette Leinwand gezogen**.
- Remotion-Animationen werden **niemals als alleinige Vollbildfläche** gerendert.
- Jedes Visual sitzt in einem klaren Content-Frame mit sichtbarem Außenraum.
- Standard: ungefähr 120 px Seitenrand, eigener Kopfbereich oben, Content-Frame darunter.
- Der Content-Frame darf intern `cover` oder `contain` verwenden, aber der Frame selbst bleibt kleiner als die Leinwand.
- Schwarzer Hintergrund, ruhiger Rand, keine künstlichen Browser-/Dashboard-Chrome.

Referenzkomponente:

`src/design-system/youtube-stage.tsx -> YouTubeSectionFrame`

## 2. Jeder Visual Beat bekommt eine Zwischenüberschrift + Icon

Über dem Content-Frame steht immer eine kurze Zwischenüberschrift, die den aktuellen Gedanken benennt.

Beispiele:
- Kalender-Icon + „Was 5 € in einer Woche machen“
- Repeat-Icon + „Warum 5 € so klein wirken“
- Listen-Icon + „Der 7-Tage-Test“

Regeln:
- ein passendes Linien-Icon aus dem FinanzNeo-Iconset
- kurze natürliche Überschrift, keine zweite Voiceover-Zeile
- Überschrift beschreibt den Abschnitt, nicht Wort für Wort den gesprochenen Satz
- Header bleibt ruhig; keine aggressive Animation

## 3. Keine eingebrannten Untertitel

Im finalen Video gibt es **keine Untertitel/Captions im Bild**.

Erlaubt und weiterhin Pflicht:
- echte Wort-Zeitstempel für Schnitte
- `script-mit-zeitstempeln.txt` im Export
- `.srt` im Export für YouTube/optionale externe Untertitel

Nicht erlaubt:
- Wort-für-Wort-Captions unten im Bild
- grün markiertes aktives Wort
- Boxed Captions
- automatische Textwiederholung des Voiceovers

Die gesprochenen Inhalte sollen durch Bild, Animation und Zwischenüberschrift getragen werden.

## 4. Bildinhalt ist frei — Menschen niemals erzwingen

Die Bildwelt bleibt gleich, der Inhalt ist frei.

Erlaubt sind zum Beispiel:
- Menschen, wenn eine Person für die Handlung wirklich sinnvoll ist
- Hände
- Gegenstände
- Maschinen
- Fahrzeuge
- Räume und Orte
- Detailaufnahmen
- Dokumente
- Produkte ohne Logos
- Alltagssituationen
- ungewöhnliche, aber sofort verständliche Bildideen

Es gibt **keine Menschenquote** und **keine Objektquote**.

Vor jedem Flow-Bild gilt:
1. Was erklärt genau diesen gesprochenen Beat am schnellsten?
2. Braucht man dafür wirklich eine Person?
3. Gibt es ein Objekt, einen Ort, ein Detail oder eine Handlung, die besser ist?
4. Passt das Bild sichtbar in dieselbe FinanzNeo-Welt?
5. Ist die Szene eigenständig und nicht nur eine Wiederholung der letzten guten Idee?

## 5. Keine Bildidee auf Krampf

Nicht jedes abstrakte Thema muss ein Flow-Bild bekommen.

- konkrete Szene → Flow kann sinnvoll sein
- genaue Zahl / Vergleich / Ablauf → Remotion
- abstrakter Gedanke ohne gute Alltagsszene → Remotion/Karte statt erzwungener Menschenszene

„Gleicher Look“ bedeutet **nicht**:
- gleiche Person
- gleicher Tisch
- gleiche Kamera
- gleiche Requisiten

Es bedeutet nur gemeinsame Render-DNA, Licht, Schwarzraum und Farbrollen.

## 6. Layout-Datei pro Video

Jedes Projekt braucht:

`06-projektdateien/layout.json`

Darin stehen:
- Standard-ID
- Content-Frame-Regel
- Untertitel-Aus
- Zwischenüberschrift/Icons
- eigener Header pro Visual

`npm run youtube:validate -- youtube/<Projekt>` prüft diesen Vertrag.
