# FinanzNeo — verbindlicher Schreibschutz für Agenten

Diese Regeln gelten für jeden KI-Agenten und jede automatisierte Änderung in diesem Repository.

## Übergeordnete Arbeitsziele (P0)

**Kontinuierlich besser werden ist die höchste Qualitätspriorität:** Vor neuer Content-Arbeit die offenen Erkenntnisse aus `docs/VERBESSERUNGSLOG.md` beachten. Nach jeder tatsächlichen Videoproduktion eine konkrete, nachprüfbare Review- und Verbesserungsrunde gemäß `docs/QUALITAETS-VERBESSERUNGSPROZESS.md` dokumentieren; bekannte Fehler dauerhaft an der Systemursache beheben, ohne Schutzregeln aufzuweichen.

**Phase-1-Chat-Handoff ist Pflicht:** Nach jeder wirklich vollständigen Reel- oder YouTube-Phase 1 genau die zwei anklickbaren, auf GitHub geprüften Projekt-Links **hier im Chat** ausgeben: `alle-bildprompts.txt` (Google Flow) und `script-fliess-text.txt` (Voiceover). Die genauen Pfade und Bedingungen stehen in `CLAUDE.md`. Keine generische Repo-URL, keine Platzhalter-Links und keine Behauptung „fertig“, solange die Dateien nicht abrufbar sind.

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
