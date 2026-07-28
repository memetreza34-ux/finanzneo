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
- [x] wiederverwendbare Bildprompt-Bibliothek mit acht Finanzthemen anlegen
- [x] harte Bild-QA-Checkliste mit Punktefreigabe einführen
- [x] verbindliche Beat-zu-Bild-Entscheidungsregeln dokumentieren
- [x] Bildsystem in Startanleitung, Produktionsablauf und Master-Prompts verankern

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

Status: **in Arbeit**

Zielstruktur:

```text
src/
├── design-system/
├── production/
├── experiments/
├── showcases/
└── root/
```

- [x] produktive Registrierungen von Demos und Stiltests trennen
- [x] `Root.tsx` in Production-, Experiment- und Showcase-Registries aufteilen
- [x] Regeln für die Zuordnung neuer Compositions dokumentieren
- [x] automatische Prüfung auf doppelte oder falsch platzierte Composition-IDs ergänzen
- [ ] Quellkomponenten selbst in `production/`, `experiments/` und `showcases/` verschieben
- [ ] alte Varianten bewerten und schwache Varianten archivieren
- [ ] verbleibende unklare Dateinamen vereinheitlichen

## Phase 4 — Baukästen konsolidieren

Status: **in Arbeit**

- [x] `src/brand` und `src/bausteine` vollständig inventarisieren
- [x] `src/design-system/index.ts` als einzigen öffentlichen Importpfad anlegen
- [x] zentrale Dokumentation für Kernsystem und Premium-Erweiterungen erstellen
- [x] doppelte Markenfarben aus `src/bausteine/fn_core.tsx` entfernen
- [x] externe Google-Font-Ladung aus `src/bausteine/fn_core.tsx` entfernen
- [x] Premium-Palette und Safe-Area-Werte in `src/brand/tokens.ts` zentralisieren
- [x] Premium-Bausteine über kollisionsfreie Namensräume exportieren
- [x] Design-System-Validator gegen neue Farb- und Font-Duplikate ergänzen
- [x] erste produktive Komposition auf `src/design-system` migrieren
- [x] Hintergründe auf `standard`, `data` und `premium` als offizielle Varianten reduzieren
- [x] experimentelle Hintergrundvarianten klar kennzeichnen
- [x] verbindlichen Komponenten-Katalog mit Standard- und Spezialfällen erstellen
- [x] riskante synthetische Chart-Komponenten im Katalog als ungeeignet für reale Finanzbehauptungen markieren
- [x] bessere Spezialkomponenten aus `src/bausteine` als empfohlene Namensräume markieren
- [ ] weitere produktive Dateien schrittweise auf `src/design-system` migrieren
- [ ] alte Varianten bewerten und schwache Varianten archivieren
- [ ] ungenutzte `@remotion/google-fonts`-Abhängigkeit nach vollständigem Importsuchlauf entfernen

## Phase 5 — Finanzielle Faktensicherheit

Status: **in Arbeit**

- [x] bekannten falschen 248.000-€-Demoendwert entfernen
- [x] synthetische Zinseszins-Kurven in den Premium-Charts durch echte Sparplanrechnungen ersetzen
- [x] zentralen Sparplanrechner unter `src/finance/calculations.ts` anlegen
- [x] Einzahlungen, Renditeannahmen, Laufzeit und Einschränkungen in Chart-Captions sichtbar machen
- [x] scheinbar historische Crash-Daten als schematisches Beispiel kennzeichnen
- [x] Referenzwerte und verbotene Fantasiekurven automatisch validieren
- [x] ShortHook-Endwert und Einzahlungen an den zentralen Rechner anbinden
- [x] Hintergrund-Demo von frei eingetragener Zahl auf zentrale Sparplanrechnung umstellen
- [ ] weitere JSX-Dateien vollständig auf frei eingetragene Finanzzahlen prüfen
- [ ] zentrale Rechner für Inflation und Kredit ergänzen
- [ ] Rechenannahmen als wiederverwendbare strukturierte Datensätze speichern
- [ ] Datenquelle und Datenstand für echte historische Daten verpflichtend machen

## Phase 6 — Qualitätsautomatisierung

- [ ] TypeScript `strict` schrittweise aktivieren
- [x] `typecheck`-Script hinzufügen
- [ ] Linting ergänzen
- [x] Asset-Validator hinzufügen
- [x] Composition-Registry-Validator hinzufügen
- [x] Design-System-Validator hinzufügen
- [x] Finanzformel- und Chart-Validator hinzufügen
- [x] visuelles 18-/22-Prozent-Safe-Area-Prüfraster ergänzen
- [ ] Render-Smoke-Test für eine vertikale Testkomposition
- [ ] automatisierte Keyframe-Prüfung ergänzen

## Phase 7 — Produktionsvorlage

Status: **als Nächstes**

Eine standardisierte 60–90-Sekunden-Reel-Vorlage bauen:

- [ ] datengetriebene Beat-Konfiguration
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
- [ ] experimentelle Demo-Composition

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
3. ~~ein Premium-Chart verwendet unpassende Zinseszins-Zahlen~~ **behoben**
4. ~~zwei parallele Komponentensysteme definieren Farben und Fonts doppelt~~ **Kernproblem behoben**
5. ~~Dokumente enthalten widersprüchliche Disclaimer-, Untertitel- und Formatregeln~~ **behoben**
