# FinanzNeo — Bereinigungs- und Verbesserungsplan

Die Reihenfolge ist verbindlich. Neue Features werden nicht vorgezogen, wenn dadurch alte Widersprüche bestehen bleiben.

## Phase 1 — Grundlage und Bildsystem

Status: **abgeschlossen**

- [x] `CLAUDE.md` als einzige verbindliche Quelle
- [x] Primärformat auf 60–90 Sekunden vertikal umstellen
- [x] Untertitel verpflichtend machen
- [x] neuen Premium-isometrischen Erklärbildstil festlegen
- [x] Safe Areas oben und unten festschreiben
- [x] Monetarisierungsweg PDF → Leads → Affiliate dokumentieren
- [x] alte widersprüchliche Anleitungen ersetzen

## Phase 2 — Produktionssicherheit

Status: **in Arbeit**

- [x] ein einziges Caption-Datenformat definieren: `finanzneo-caption-v1`
- [x] Caption-Generator und React-Komponenten angleichen
- [x] frühere Caption-Formate über `src/lib/captions.ts` normalisieren
- [x] produktiv importierte Caption-Dateien nicht mehr über `.gitignore` ausschließen
- [x] versionierten Platzhalter für die bisher fehlende Hook-Caption anlegen
- [x] Caption-Platzhalter vor Produktionsrender erkennen und blockieren
- [x] fehlende Audio-Dateien vor Produktionsrender erkennen und verständlich melden
- [x] manifestbasierte Asset-Prüfung einbauen
- [x] Standard-Render über Asset-Prüfung absichern
- [ ] weitere produktive Kompositionen mit eigenen Manifesten ausstatten
- [ ] reproduzierbaren Setup-Befehl und vollständige Installationsprüfung herstellen

## Phase 3 — Repo-Struktur

Zielstruktur:

```text
src/
├── design-system/
├── production/
├── experiments/
├── showcases/
└── root/
```

- [ ] produktive Reels von Demos und Stiltests trennen
- [ ] `Root.tsx` in Production-, Experiment- und Showcase-Registries aufteilen
- [ ] alte Varianten archivieren
- [ ] eindeutige Dateinamen und Composition-IDs verwenden

## Phase 4 — Baukästen konsolidieren

- [ ] `src/brand` und `src/bausteine` vollständig inventarisieren
- [ ] doppelte Tokens, Fonts und Hintergründe entfernen
- [ ] pro Funktion nur eine empfohlene Hauptkomponente behalten
- [ ] bessere Spezialkomponenten aus `src/bausteine` in das zentrale Designsystem übernehmen
- [ ] veraltete oder schwache Komponenten archivieren
- [ ] zentrale Exports und Dokumentation erzeugen

## Phase 5 — Finanzielle Faktensicherheit

- [ ] falsche Demo-Zahlen entfernen
- [ ] zentrale Rechner für Zinseszins, Sparplan, Kredit und Inflation anlegen
- [ ] Rechenannahmen als strukturierte Daten speichern
- [ ] Zahlen in Charts nicht mehr frei im JSX erfinden
- [ ] Datenquelle, Stand und Annahmen verpflichtend machen
- [ ] Validierungstests für bekannte Beispielwerte ergänzen

## Phase 6 — Qualitätsautomatisierung

- [ ] TypeScript `strict` schrittweise aktivieren
- [x] `typecheck`-Script hinzufügen
- [ ] Linting ergänzen
- [x] Asset-Validator hinzufügen
- [ ] Daten-Validator hinzufügen
- [ ] Render-Smoke-Test für eine vertikale Testkomposition
- [ ] Safe-Area-Test oder visuelle Prüfraster ergänzen

## Phase 7 — Produktionsvorlage

Eine standardisierte 60–90-Sekunden-Reel-Vorlage bauen:

- [ ] Hook
- [ ] Problem
- [ ] Erklärung
- [ ] Beispiel
- [ ] Lösung oder Merksatz
- [ ] CTA
- [ ] Untertitel
- [ ] dezenter Rechtshinweis
- [ ] Bild- und Remotion-Safe-Areas
- [ ] Quellenblock für Caption/Description

## Phase 8 — Serienproduktion

Erst nach Abschluss der kritischen Punkte:

- [ ] erste 30 Grundlagenideen planen
- [ ] Themen-Duplikate verhindern
- [ ] aus jedem Thema Skript, Bildprompts, Audioordner, Caption und PDF-CTA erzeugen
- [ ] erst bauen, wenn alle Pflichtassets vorhanden sind
- [ ] Ergebnisse plattformübergreifend ausgeben

## Sofort blockierende Fehler

Diese Punkte haben Vorrang vor neuen Animationseffekten:

1. ~~Caption-Format stimmt nicht zwischen Generator und Short-Komponente überein~~ **behoben**
2. ~~Pflicht-Caption-Dateien werden ignoriert, aber direkt importiert~~ **behoben**
3. ein Premium-Chart verwendet unpassende Zinseszins-Zahlen
4. zwei parallele Komponentensysteme definieren Farben und Fonts doppelt
5. ~~Dokumente enthalten widersprüchliche Disclaimer-, Untertitel- und Formatregeln~~ **behoben**
