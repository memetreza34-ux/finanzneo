# FinanzNeo — aktueller Produktionsablauf

> Verbindliche Regeln stehen in `CLAUDE.md`. Dieses Dokument beschreibt nur den Ablauf.

## Pflichtdokumente für Bildaufgaben

Vor jeder Bildplanung lesen:

- `docs/IMAGE-SYSTEM.md`
- `docs/BEAT-TO-IMAGE-RULES.md`
- `docs/IMAGE-PROMPT-LIBRARY.md`
- `docs/IMAGE-QA-CHECKLIST.md`

## Schritt 1 — Thema und Recherche

```text
Thema: [THEMA]

Recherchiere die notwendigen Fakten für ein deutsches FinanzNeo-Reel von 60 bis 90 Sekunden.
Nutze nachvollziehbare Quellen, nenne den Datenstand und trenne Fakten von Beispielannahmen.
Erfinde keine Zahlen.

Gib danach aus:
- Kernaussage
- Zielgruppe und Lernziel
- geprüfte Fakten
- Quellen
- mögliche Risiken oder Missverständnisse
```

## Schritt 2 — Skript

```text
Schreibe ein FinanzNeo-Skript von 60 bis 90 Sekunden.

Struktur:
1. Hook innerhalb der ersten 2 Sekunden
2. Problem
3. einfache Erklärung
4. konkretes Beispiel
5. Lösung oder Merksatz
6. kurzer CTA zu einer passenden kostenlosen PDF

Regeln:
- immer „du“
- kurze Sätze
- kein unnötiger Fachjargon
- jeder Satz muss visualisierbar sein
- keine Wiederholungen
- keine individuelle Anlageempfehlung
```

## Schritt 3 — Visuelle Beat-Liste

```text
Teile das Skript in ungefähr 6 bis 10 visuelle Beats.

Entscheide je Beat nach docs/BEAT-TO-IMAGE-RULES.md:
- KI-Bild
- Remotion
- Kombination

Begründe jede Entscheidung.
Nutze ein KI-Bild nur, wenn eine konkrete räumliche Szene, ein Gegenstand oder eine visuelle Metapher erklärt werden soll.
Nutze Remotion für Überschriften, Untertitel, Beträge, Zahlen, Quellen, Diagramme und Tabellen.

Gib jeden Beat im verbindlichen Format aus:
- Sprechtext
- Hauptaussage
- Visualtyp
- Begründung
- Bildinhalt
- Remotion-Inhalt
- benötigte Daten
- Dauer
- Übergang
```

## Schritt 4 — Bildprompts

```text
Erstelle für alle benötigten KI-Bilder vollständige Prompts nach:
- docs/IMAGE-SYSTEM.md
- docs/IMAGE-PROMPT-LIBRARY.md

Pflicht:
- Premium-isometrische redaktionelle 3D-Finanzwelt
- vollständige erklärende Szene statt Einzelobjekt
- Ausgangspunkt → Entwicklung → Ergebnis
- 2 bis 4 große Hauptelemente
- obere 18 % frei
- untere 22 % frei
- standardmäßig kein Text
- höchstens drei kleine deutsche Labels
- klare Ursache-Wirkungs-Logik
- Dateiname und Zielordner nennen

Nutze vorhandene Vorlagen aus der Prompt-Bibliothek als Grundlage und passe nur die konkrete Aussage an.
```

Arman generiert die Bilder in Google Flow / Nano Banana und legt sie in den genannten Ordner.

## Schritt 5 — Bild-QA

Jedes generierte Bild wird vor der Animation mit `docs/IMAGE-QA-CHECKLIST.md` geprüft.

```text
Prüfe jedes Bild einzeln mit der FinanzNeo-Bild-QA.

Gib aus:
Bild-QA: [FREIGEGEBEN / ÜBERARBEITEN / NEU ERSTELLEN]
Punkte: [X/14]

Bestanden:
- ...

Fehler:
- ...

Konkrekte Korrektur:
- ...
```

Direkte Freigabe nur bei:

- 13 bis 14 Punkten
- keiner verletzten Regel unter „Sofort neu erstellen“
- vollständig freien Safe Areas
- sofort verständlicher Aussage

## Schritt 6 — Voiceover und Assetprüfung

Arman legt die fertige Voiceover-Datei ab.

Vor dem Bauen müssen vorhanden sein:

- finale Voiceover-Datei
- alle benötigten und freigegebenen Bilder
- validierte Fakten und Zahlen
- festgelegte Composition-ID
- Zielplattformen

Wenn ein Pflichtasset fehlt, wird nicht mit Ersatzmaterial begonnen.

## Schritt 7 — Untertitel und Beat-Sync

```text
Erzeuge Wort-Timings aus der finalen Voiceover-Datei.
Verwende das einheitliche Caption-Format des Projekts.
Plane jede Animation passend zum gesprochenen Wort.
Zeige zuerst den Beat-für-Beat-Plan.
```

Untertitel sind bei allen vertikalen Videos Pflicht.

## Schritt 8 — Remotion-Bau

```text
Baue das vertikale Reel in 1080 × 1920 bei 30 fps.

Prüfe:
- Hook sofort sichtbar
- Bild-Safe-Areas frei
- Untertitel nicht über wichtigen Objekten
- keine überfüllten Szenen
- Zahlen und Diagramme korrekt
- Bilder nicht als bedeutungslose Tapete
- klare Übergänge
- kurzer CTA
- Bildbewegung unterstützt die Aussage
```

## Schritt 9 — QA und Ausgabe

Vor dem Vollrender:

1. Keyframes rendern
2. Safe Areas prüfen
3. Untertitel prüfen
4. Fakten und Zahlen erneut prüfen
5. visuelle Hierarchie bewerten
6. Bild-QA-Ergebnisse kontrollieren

Danach:

- finales 9:16-Video
- Plattform-Caption
- Quellen und Datenstand
- kurzer Hinweis „Keine Anlageberatung“
- PDF-CTA
- genau passende Hashtags

## Nicht mehr gültig

Folgende frühere Standards sind aufgehoben:

- Longform als primäres Produktionsformat
- zehnsekündiger Disclaimer vor der Hook
- Shorts ohne Untertitel
- reine Clean-2D-Bilder als alleiniger Hauptstil
- überfüllte KI-Infografiken mit langen Texten
- Animation starten, bevor alle Pflichtassets vorhanden sind
- KI-Bilder ohne begründete Beat-Entscheidung
- Bildfreigabe nur nach subjektivem Eindruck
