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

## Validierter Security-Fix vom 2. September 2026

Während der Einführung des Guards meldete `npm audit --audit-level=high` eine bestehende High-Severity-Schwachstelle in der transitiven Abhängigkeit `fast-uri` 3.1.5.

Der Lockfile-Fix wurde absichtlich minimal gehalten:

- `fast-uri` wurde von 3.1.5 auf 3.1.6 aktualisiert.
- Ein semantischer Lockfile-Vergleich bestätigte, dass ausschließlich `node_modules/fast-uri` geändert wurde.
- `npm ci` lief danach reproduzierbar durch.
- `npm audit --audit-level=high` meldete 0 Schwachstellen.
- `npm run validate` bestand vollständig, einschließlich 68/68 Tests.
- das Remotion-Bundle wurde erfolgreich erstellt.
- der Smoke-Test renderte 56/56 registrierte Compositions fehlerfrei.
- die Regression-Baseline war sowohl vor als auch nach allen Prüfungen unverändert.
- der komplette `reels/`-Tree blieb auf `f9e23de75a6157cfcb8811d5ddcee6df4cc16223`.

Der dafür verwendete einmalige Schreib-Workflow wurde nach erfolgreicher Prüfung wieder aus dem Branch entfernt. Anschließend bestand auch der normale PR-Workflow `FinanzNeo Validate` auf dem endgültigen Branchzustand vollständig.

## Absichtliche Änderung eines geschützten Reels

Eine Baseline darf nicht nebenbei angepasst werden, nur damit CI wieder grün wird. Wenn ein geschütztes Reel wirklich geändert werden soll:

1. Änderung ausdrücklich festlegen und separat reviewen.
2. Reel vollständig mit den normalen FinanzNeo-Gates validieren und rendern.
3. Erst nach erfolgreicher Prüfung den neuen Tree-Hash bewusst in `config/reel-regression-baseline.json` übernehmen.
4. In der PR-Beschreibung dokumentieren, welches geschützte Reel warum neu gebaselined wurde.

## Grenze des Schutzes

Der Guard schützt Git-versionierte Dateien. Dateien, die absichtlich durch `.gitignore` ausgeschlossen oder nur lokal vorhanden sind, können durch eine GitHub-CI-Baseline nicht eingefroren werden.
