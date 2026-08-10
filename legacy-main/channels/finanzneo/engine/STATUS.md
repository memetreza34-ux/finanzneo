# Finance V1 — Status

## Claude-Code-Produktionssystem

Claude Code ist der einzige ausführende Agent für Finance V1. Die frühere kanalbezogene Codex-Anweisung wurde entfernt. Alle Reels verwenden denselben datenbasierten Produktionsweg und dieselbe allgemeine `FinanceV1`-Composition.

## Bereits verifiziertes Fundament

Vor dem Production-Finish-Pass wurden erfolgreich geprüft:

- ein kanonischer Laufzeitvertrag
- eine zentrale Grenzwertquelle
- produktionslange Startvorlage
- vollständiger Szenenplan mit Skript und `voiceText`
- semantische Wortausrichtung am finalen Transkript
- allgemeine Composition ohne Themen-Renderer
- datenbasierter Scaffolder
- echte Phasen-Assetwechsel
- relative Detailfokus-Koordinaten
- Textgrenzen und Schriftgrößenanpassung
- Caption-, Audio-, Plan- und Alignment-Prüfungen
- Typecheck und bestehende Tests
- allgemeiner Smoke-Render
- zwölf Galerie-Kontrollbilder
- neutraler End-to-End-Durchlauf unter Linux

## Production-Finish-Pass eingebaut

Neu hinzugefügt wurden:

- Claude Code als alleiniger Finance-Agenten-Einstieg über `CLAUDE.md`
- Quellen-IDs, Abrufdaten und `claimIds`
- Prüfung riskanter Finanzformulierungen
- strukturierte und automatisch geprüfte Rechnungen
- deterministische Hook-, Skript-, Payoff- und CTA-Prüfung
- automatische Bildanalyse für Helligkeit, Dichte, Fit, Fokus und Safe-Zones
- Erkennung nahezu doppelter Bilder
- durchgehende Captions einschließlich CTA
- optionale semantische SFX ohne Musikbett
- feste H.264-/AAC-Exportparameter
- tatsächliche Loudness- und True-Peak-Messung
- finale MP4-QA für Streams, Auflösung, FPS, Dauer, Schwarzbilder, Freeze-Abschnitte und Randstille
- acht automatisch erzeugte Kontrollframes
- neutrale Fixtures für SFX, Bildanalyse, Rechnung und MP4-QA
- standardisierte Motion-, Übergangs- und Bildprompt-Regeln

## Nach Claude-Code-Tiefenprüfung korrigiert

Claude Code reproduzierte auf Windows mit Node 24 einen echten `spawnSync(npx.cmd, ...)`-Fehler (`EINVAL`). Daraufhin wurden folgende Punkte umgesetzt:

- zentraler plattformübergreifender Subprozess-Runner unter `scripts/lib/run-command.mjs`
- Windows-sicherer Remotion-Aufruf im neutralen End-to-End-Test
- Windows-sicherer Remotion-Aufruf im echten Produktionsrender
- Finance-spezifische Vitest-Tests für den kanonischen Vertrag
- Finance-spezifische Vitest-Tests für ausgeführte QA-Regeln
- Testfälle für Skript-/`voiceText`-Abweichung, doppelte IDs, Phasenreihenfolge und SFX-Grenzen
- Testfälle für unbelegte Claims und falsche strukturierte Rechnungen
- eigener `windows-latest`-Smoke-Job mit vollständigem Finance-E2E-Render

Der lokale Bestätigungsbefehl auf Windows lautet:

```bash
npm test
npm run finance:e2e
npm run finance:render-qa-test
```

## Aktuelle Verifikation

Die GitHub-Actions-Jobs werden momentan vor dem ersten Workflow-Schritt beendet und liefern keine Logs. Das betrifft sowohl Ubuntu als auch Windows und ist daher kein nachgewiesener Codefehler. Die neuen Korrekturen dürfen dennoch erst nach einem tatsächlich ausgeführten Lauf oder einem erneuten lokalen Claude-Code-Lauf als vollständig verifiziert bezeichnet werden.

Zur Kosten- und Runnerkontrolle:

- `Finance V1 Check` ist die zentrale PR-Prüfung.
- allgemeine CI überspringt den Branch `finance-v1` und läuft nach dem Merge auf `main` wieder vollständig.
- die zwölf Galerie-Renderings laufen nur gezielt per `workflow_dispatch`.

## Bewusste Grenze

Noch nicht durch einen echten Produktionsfall belegt sind:

- Qualität eines vollständigen Reels mit echter KI-Stimme
- Qualität und Konsistenz echter generierter Finanzbilder
- Wirkung von Motion, Übergängen und SFX über das gesamte Video
- tatsächliche Caption- und Motivkollisionen in realen Szenen
- faktische Qualität eines konkreten Finanzthemas

Diese Punkte können nur mit einem echten Test-Reel und manueller Sichtprüfung bewertet werden.

## Nächster Freigabeschritt

1. Claude Code aktualisiert lokal auf den neuesten `finance-v1`-Stand.
2. `npm test`, `npm run finance:e2e` und `npm run finance:render-qa-test` unter Windows vollständig bestehen lassen.
3. Einen GitHub-Runner-Lauf abwarten, der tatsächlich Schritte ausführt.
4. Galerie nach visuellen Renderer-Änderungen einmal manuell ausführen.
5. Genau ein echtes Finanz-Reel kontrolliert durch die Pipeline bauen.
6. Höchstens zwei gezielte Korrekturrunden durchführen.

Der PR bleibt bis dahin Draft. `studio-clon/main` enthält nur die Branch-Routing-Sicherung; das Original-Repository `memetreza34-ux/studio` bleibt unverändert.
