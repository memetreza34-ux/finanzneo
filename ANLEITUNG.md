# FinanzNeo — aktueller Produktionsablauf

> Verbindliche Regeln stehen in `CLAUDE.md`. Dieses Dokument beschreibt nur den Ablauf.

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

Entscheide je Beat:
- KI-Bild
- Remotion
- Kombination

Begründe die Entscheidung kurz.
Nutze ein KI-Bild nur, wenn eine konkrete räumliche Szene, ein Gegenstand oder eine visuelle Metapher erklärt werden soll.
Nutze Remotion für Überschriften, Untertitel, Beträge, Zahlen, Quellen, Diagramme und Tabellen.
```

## Schritt 4 — Bildprompts

```text
Erstelle für alle benötigten KI-Bilder vollständige Prompts nach docs/IMAGE-SYSTEM.md.

Pflicht:
- Premium-isometrische redaktionelle 3D-Finanzwelt
- vollständige erklärende Szene statt Einzelobjekt
- obere 18 % frei
- untere 22 % frei
- standardmäßig kein Text
- höchstens drei kleine deutsche Labels
- klare Ursache-Wirkungs-Logik
- Dateiname und Zielordner nennen
```

Arman generiert die Bilder in Google Flow / Nano Banana und legt sie in den genannten Ordner.

## Schritt 5 — Voiceover und Assetprüfung

Arman legt die fertige Voiceover-Datei ab.

Vor dem Bauen müssen vorhanden sein:

- finale Voiceover-Datei
- alle benötigten Bilder
- validierte Fakten und Zahlen
- festgelegte Composition-ID
- Zielplattformen

Wenn ein Pflichtasset fehlt, wird nicht mit Ersatzmaterial begonnen.

## Schritt 6 — Untertitel und Beat-Sync

```text
Erzeuge Wort-Timings aus der finalen Voiceover-Datei.
Verwende das einheitliche Caption-Format des Projekts.
Plane jede Animation passend zum gesprochenen Wort.
Zeige zuerst den Beat-für-Beat-Plan.
```

Untertitel sind bei allen vertikalen Videos Pflicht.

## Schritt 7 — Remotion-Bau

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
```

## Schritt 8 — QA und Ausgabe

Vor dem Vollrender:

1. Keyframes rendern
2. Safe Areas prüfen
3. Untertitel prüfen
4. Fakten und Zahlen erneut prüfen
5. visuelle Hierarchie bewerten

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
