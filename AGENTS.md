# FinanzNeo — Einstieg und Schreibschutz für Agenten

Diese Datei gilt für jeden KI-Agenten in diesem Repository. Sie sagt, wo du
anfängst und was du nicht anfassen darfst.

## Zuerst lesen

| Datei | Wofür |
|---|---|
| `START-HIER.md` | Landkarte: wie die drei Phasen zusammenspielen |
| `CLAUDE.md` | Projekt-Gehirn, höchste Regelquelle |
| `docs/PHASE-1-BRIEFING.md` | vollständige Regeln für Skript, Szenen, Bildprompts |

Bei Widersprüchen gilt `CLAUDE.md`. Bei Zahlenwerten (Layout, Untertitel,
Übergänge) gilt der Code: `REEL_STYLE` in `src/brand/tokens.ts`.

## So entsteht ein Reel

```text
PHASE 1  Recherche, Skript, Szenenplan, Bildprompts, Captions
PHASE 2  Nutzer: Bilder in Google Flow, Voiceover, Wort-Zeitstempel
PHASE 3  Remotion bauen, prüfen, rendern, exportieren
```

**Phase 1 im Detail:** Das Skript wird **Szene für Szene** geschrieben, nicht
nachträglich zerteilt. Wortbudget bei etwa 2,5 Wörtern pro Sekunde:

- Bildszene 3,5–5,5 s → **9–14 Wörter**
- Animationsszene 4,5–6,5 s → **11–16 Wörter**

Zustand → Bild. Veränderung → Animation. Standard sind 15 Beats (9 Bild /
6 Animation), nie mehr als zwei Bildszenen am Stück.

Jede Szene braucht eine Zwischenüberschrift, die als **Aussage** sagt, worum es
geht — nie nur ein Stichwort, nie nur eine Zahl — plus ein eigenes Icon aus der
Liste in `src/brand/components/Icon.tsx`.

## Befehle

```bash
npm run reel:create -- --target reels/<Woche>/<Tag>/<Reel> --title "Titel"
npm run reel:validate -- <Reel-Pfad>    # prüft Phase-1-Lieferung
npm run reel:ready -- <Reel-Pfad>       # Phase-3-Freigabe (braucht Assets)
npm run reel:export -- <Reel-Pfad>      # fertiges Upload-Paket in 06-export/
npm run validate                        # Repo gesamt
```

Was ein Validator meldet, ist ein Phase-1-Fehler und wird dort korrigiert —
nicht in Phase 3 überschrieben und nicht durch Aufweichen der Prüfung.


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
