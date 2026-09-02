# Reel Regression Guard

## Zweck

Dieser Guard schützt bereits funktionierende, versionierte Reel-Produktionen vor unbeabsichtigten Änderungen.

Die Baseline wurde vom bekannten funktionierenden Future-V3-Stand angelegt:

- Source Commit: `353d20c06513fd6024171a7eb842a3e9ebc3ff3e`
- Baseline-Datei: `config/reel-regression-baseline.json`
- Prüfer: `scripts/check-reel-regression-baseline.mjs`
- Lokaler Check: `npm run reel:regression:check`
- Der Check ist zusätzlich Bestandteil von `npm run validate` und läuft damit in der bestehenden GitHub-CI.

## Was geschützt ist

Der Guard speichert für abgeschlossene Produktionsordner den exakten Git-Tree-Hash. Damit werden Änderungen an jeder darin versionierten Datei erkannt, einschließlich Hinzufügen, Löschen oder Umbenennen innerhalb eines geschützten Ordners.

Aktuell geschützt:

- komplette Produktionswoche `2026-08-24_bis_2026-08-30`
- Montag `2026-08-31_bis_2026-09-06`
- Dienstag `2026-08-31_bis_2026-09-06`
- Mittwoch `2026-08-31_bis_2026-09-06`

## Was weiterhin erlaubt ist

Neue Produktionsordner und neue Reels außerhalb der geschützten Ordner bleiben erlaubt. Der Guard verändert weder `reel:create` noch Bildwelt, Animationen, Audio, Timing, Phase 3, Render-QA oder Export.

## Absichtliche Änderung eines geschützten Reels

Eine Baseline darf nicht nebenbei angepasst werden, nur damit CI wieder grün wird. Wenn ein geschütztes Reel wirklich geändert werden soll:

1. Änderung ausdrücklich festlegen und separat reviewen.
2. Reel vollständig mit den normalen FinanzNeo-Gates validieren und rendern.
3. Erst nach erfolgreicher Prüfung den neuen Tree-Hash bewusst in `config/reel-regression-baseline.json` übernehmen.
4. In der PR-Beschreibung dokumentieren, welches geschützte Reel warum neu gebaselined wurde.

## Grenze des Schutzes

Der Guard schützt Git-versionierte Dateien. Dateien, die absichtlich durch `.gitignore` ausgeschlossen oder nur lokal vorhanden sind, können durch eine GitHub-CI-Baseline nicht eingefroren werden.
