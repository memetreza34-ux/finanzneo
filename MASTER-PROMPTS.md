# FinanzNeo — aktuelle Master-Prompts

> `CLAUDE.md` ist die verbindliche Quelle. Diese Prompts setzen die dort definierten Regeln um.

## Pflichtdokumente für Bildarbeit

- `docs/IMAGE-SYSTEM.md`
- `docs/BEAT-TO-IMAGE-RULES.md`
- `docs/IMAGE-PROMPT-LIBRARY.md`
- `docs/IMAGE-QA-CHECKLIST.md`

## 1. Neues Reel planen

```text
Neues FinanzNeo-Reel.

Thema: [THEMA]

Ziel:
Ein deutscher Finanzanfänger soll das Thema nach 60 bis 90 Sekunden verstehen.

Arbeite verbindlich nach:
- CLAUDE.md
- docs/IMAGE-SYSTEM.md
- docs/BEAT-TO-IMAGE-RULES.md
- docs/IMAGE-PROMPT-LIBRARY.md
- docs/IMAGE-QA-CHECKLIST.md

Erstelle zuerst:
1. Recherche mit Quellen und Datenstand
2. Lernziel und Kernaussage
3. geprüftes Skript
4. visuelle Beat-Liste mit ungefähr 6 bis 10 Beats
5. begründete Entscheidung je Beat: KI-Bild, Remotion oder Kombination
6. Liste aller benötigten Assets und Zielordner

Baue noch nichts. Warte, bis Voiceover und Bilder vollständig vorhanden sind.
```

## 2. Skript prüfen und verbessern

```text
Prüfe dieses FinanzNeo-Skript streng:

[SKRIPT]

Bewerte:
- Hook innerhalb der ersten 2 Sekunden
- sofort verständliches Thema
- einfache Sprache
- keine Füllsätze
- keine Wiederholungen
- jeder Satz visualisierbar
- Zahlen und Aussagen belegbar
- keine individuelle Anlageempfehlung
- Dauer 60 bis 90 Sekunden
- klarer Merksatz
- kurzer passender PDF-CTA

Überarbeite alle Schwächen und gib danach nur die verbesserte Fassung plus eine kurze Liste der geprüften Fakten aus.
```

## 3. Visuelle Beat-Liste erstellen

```text
Teile dieses Skript in ungefähr 6 bis 10 visuelle Beats:

[SKRIPT]

Arbeite nach docs/BEAT-TO-IMAGE-RULES.md.

Gib je Beat aus:
- zugehöriger Sprechtext
- Hauptaussage
- Visualtyp: KI-Bild, Remotion oder Kombination
- Begründung für den Visualtyp
- konkrete Bildidee
- konkrete Remotion-Komponenten
- benötigte Daten/Zahlen
- Dauer
- Übergangslogik

Regeln:
- KI-Bilder für konkrete Szenen, Gegenstände und visuelle Metaphern
- Remotion für Überschriften, Untertitel, Zahlen, Quellen, Diagramme und Tabellen
- Kombination für erklärende Szene plus genaue Daten oder Hervorhebungen
- keine bedeutungslosen Hintergrundbilder
- kein Bild ohne sichtbare Entwicklung länger stehen lassen
- ungefähr 2 bis 5 KI-Bilder pro Reel als Richtwert
```

## 4. Bildprompts erstellen

```text
Erstelle für die markierten KI-Bild-Beats vollständige Bildprompts nach:
- docs/IMAGE-SYSTEM.md
- docs/IMAGE-PROMPT-LIBRARY.md

Nutze vorhandene Themenvorlagen, wenn eine passende Vorlage existiert.

Pflicht pro Prompt:
- gesprochener Satz am Anfang
- Premium-isometrische redaktionelle 3D-Finanzwelt
- dunkler Anthrazit-Hintergrund
- tiefe grüne Akzente
- Gold nur bei Geld
- vollständige erklärende Szene
- Ausgangspunkt → Entwicklung → Ergebnis
- 2 bis 4 große Hauptelemente
- obere 18 % frei
- untere 22 % frei
- kein Text als Standard
- höchstens drei kleine deutsche Labels mit maximal drei Wörtern
- keine unnötigen Marken
- Dateiname und Zielordner

Gib jeden Prompt einzeln in einem kopierbaren Codeblock aus.
```

## 5. Generierte Bilder prüfen

```text
Prüfe jedes generierte Bild einzeln nach docs/IMAGE-QA-CHECKLIST.md.

Gib aus:
Bild-QA: [FREIGEGEBEN / ÜBERARBEITEN / NEU ERSTELLEN]
Punkte: [X/14]

Bestanden:
- ...

Fehler:
- ...

Konkrete Korrektur:
- ...

Direkte Freigabe nur bei 13 bis 14 Punkten und keiner Regel unter „Sofort neu erstellen“.
```

## 6. Assets prüfen

```text
Prüfe vor dem Remotion-Bau alle Pflichtassets.

Benötigt:
- finale Voiceover-Datei
- alle geplanten Bilder
- Bild-QA-Freigabe für jedes verwendete Bild
- richtige Dateinamen
- freie obere 18 % in jedem Bild
- freie untere 22 % in jedem Bild
- validierte Zahlen
- Quellen und Datenstand

Wenn etwas fehlt, liste nur die fehlenden Punkte auf und beginne nicht mit dem Bau.
```

## 7. Untertitel und Sync

```text
Erzeuge aus der finalen Voiceover-Datei Wort-Timings im einheitlichen Projektformat.

Danach:
- prüfe die Transkription
- korrigiere erkennbare deutsche Fehler
- gruppiere Untertitel in kurze lesbare Einheiten
- hebe nur relevante Keywords hervor
- halte den unteren Safe-Bereich ein
- synchronisiere Animationen mit den gesprochenen Begriffen

Zeige zuerst den Beat-für-Beat-Sync-Plan.
```

## 8. Reel bauen

```text
Baue das freigegebene FinanzNeo-Reel in Remotion.

Format:
- 1080 × 1920
- 30 fps
- 60 bis 90 Sekunden
- Untertitel Pflicht

Pflicht:
- Hook zuerst
- kein langer Intro-Disclaimer
- nur freigegebene Premium-isometrische Bilder verwenden
- Bilder nur passend zum gesprochenen Inhalt
- Remotion für Titel, Untertitel, Zahlen, Charts, Quellen und CTA
- obere und untere Safe Areas respektieren
- jedes Element erscheint und verschwindet sauber
- keine überfüllten Szenen
- keine falschen oder ungeprüften Zahlen
- Kamerabewegung und Hervorhebung müssen die Aussage unterstützen

Rendere zuerst repräsentative Keyframes und prüfe sie selbst, bevor du den Vollrender startest.
```

## 9. Finale QA

```text
Prüfe das fertige Reel anhand von CLAUDE.md und docs/IMAGE-QA-CHECKLIST.md.

Bewerte konkret:
- Hook
- Verständlichkeit
- Bild-Skript-Passung
- Safe Areas
- Untertitel
- visuelle Hierarchie
- Fakten und Zahlen
- Quellen
- CTA
- Plattformtauglichkeit

Nenne konkrete Fehler. Eine Bewertung von 9/10 ist nur erlaubt, wenn keine kritischen Fehler vorhanden sind.
```

## 10. Caption und PDF-CTA

```text
Erstelle die Plattform-Caption für dieses FinanzNeo-Reel.

Sie soll:
- mit einem passenden Kommentar-Keyword und einer kostenlosen PDF beginnen
- den Inhalt kurz zusammenfassen
- keine unrealistischen Versprechen enthalten
- Quellen oder Datenstand nennen, wenn nötig
- Affiliate-Beziehungen später klar kennzeichnen
- mit einer Frage enden
- genau fünf passende deutsche Hashtags enthalten
- einen kurzen Hinweis „Keine Anlageberatung“ enthalten
```
