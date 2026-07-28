# FinanzNeo — Start hier

## Verbindliche Reihenfolge

1. Lies `CLAUDE.md`.
2. Lies bei Bildaufgaben `docs/IMAGE-SYSTEM.md`.
3. Entscheide den Visualtyp mit `docs/BEAT-TO-IMAGE-RULES.md`.
4. Nutze vorhandene Vorlagen aus `docs/IMAGE-PROMPT-LIBRARY.md`.
5. Prüfe jedes fertige Bild mit `docs/IMAGE-QA-CHECKLIST.md`.
6. Prüfe den aktuellen technischen Stand in `docs/REPO-CLEANUP-PLAN.md`.

`CLAUDE.md` ist die einzige verbindliche Quelle. Ältere Regeln gelten nicht, wenn sie davon abweichen.

## Aktueller Kanalstandard

- deutsche Finanzgrundlagen für Anfänger
- vertikale Reels von 60 bis 90 Sekunden
- Veröffentlichung auf allen Short-Plattformen
- Untertitel immer Pflicht
- Premium-isometrische 3D-Erklärbilder plus Remotion
- oben 18 % frei für die Überschrift
- unten 22 % frei für Untertitel
- kein langer Text im KI-Bild
- kostenlose PDF als erster Monetarisierungsschritt
- Affiliate-Angebote erst später und transparent

## Neuer Reel-Start

Gib Claude diesen Auftrag:

```text
Neues FinanzNeo-Reel.

Thema: [THEMA]
Ziel: Finanzanfänger sollen den Inhalt nach 60 bis 90 Sekunden verstehen.

Arbeite nach:
- CLAUDE.md
- docs/IMAGE-SYSTEM.md
- docs/BEAT-TO-IMAGE-RULES.md
- docs/IMAGE-PROMPT-LIBRARY.md
- docs/IMAGE-QA-CHECKLIST.md

Erstelle zuerst:
1. Recherche mit Quellen und Stand
2. geprüftes Skript
3. visuelle Beat-Liste
4. begründete Entscheidung je Beat: KI-Bild, Remotion oder Kombination
5. Bildprompts mit 18 % freiem oberen und 22 % freiem unteren Bereich
6. benötigte Ordner- und Assetliste

Baue noch keine Animation. Warte, bis Voiceover und alle benötigten Bilder vorhanden sind.
```

## Bildfreigabe

Jedes generierte Bild wird vor der Nutzung mit `docs/IMAGE-QA-CHECKLIST.md` bewertet.

Mindestanforderung:

- 13 von 14 Punkten für direkte Freigabe
- keine Regel unter „Sofort neu erstellen“ verletzt
- gesprochener Satz sofort verständlich
- Safe Areas vollständig frei
- kein langer Text im Bild

## Produktionsfreigabe

Erst wenn alle benötigten Assets vorhanden sind:

```text
Alle Pflichtassets sind vorhanden.

Prüfe zuerst:
- Voiceover-Datei vorhanden
- Bilder vollständig
- jedes Bild mit IMAGE-QA-CHECKLIST freigegeben
- Bild-Safe-Areas eingehalten
- Fakten und Zahlen validiert

Erzeuge danach Wort-Timings und Untertitel, zeige den Beat-für-Beat-Plan und baue anschließend das Reel mit Remotion.
```
