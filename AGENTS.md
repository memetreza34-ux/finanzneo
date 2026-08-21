# FinanzNeo — verbindlicher Schreibschutz für Agenten

Diese Regeln gelten für jeden KI-Agenten und jede automatisierte Änderung in diesem Repository.

## Geschützte Bereiche

Ohne ausdrücklichen Auftrag des Nutzers dürfen folgende Bereiche nicht geändert, umbenannt oder gelöscht werden:

- `CLAUDE.md`, `MASTER-PROMPTS.md`, `START-HIER.md`
- Produktionsstandards und 3-Phasen-Workflows für Reels und YouTube
- Bildwelt-, Publishing- und Vertragsdateien
- Validatoren, Scaffolder, Readiness-Prüfungen und deren Tests
- `src/brand/`, `src/finance/` und `.github/workflows/`
- Lockfiles und `package.json`
- bestehende Reel-/YouTube-Projekte und Nutzerassets

## Pflichtablauf

1. Vor Änderungen Branch, Status und Start-HEAD prüfen.
2. Nie direkt auf `main` arbeiten.
3. Nur ausdrücklich beauftragte Dateien ändern.
4. Keine Schutzprüfung abschwächen oder umgehen, nur um einen Lauf grün zu bekommen.
5. Vor Abschluss `npm run validate` ausführen; bei Remotion-Änderungen zusätzlich `npm run build`.
6. Löschungen, Force-Push, Merge und Shared-History-Änderungen nur nach ausdrücklicher Nutzerfreigabe.

Absichtliche Änderungen an geschützten Kerndateien benötigen eine bewusste Einmalfreigabe beim Commit. Die Freigabe ist kein Ersatz für Tests und Nutzerauftrag.
