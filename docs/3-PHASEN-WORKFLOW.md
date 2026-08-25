# FinanzNeo — verbindlicher 3-Phasen-Workflow

> Bei Widersprüchen gilt `CLAUDE.md`. Für Layout, Captions und Übergänge gilt technisch `REEL_STYLE` in `src/brand/tokens.ts`.

## Phase 1 — ChatGPT bereitet alles vor

Normales ChatGPT erstellt im Reel-Ordner vollständig:

- Recherche, Quellen und Datenstand
- geprüftes 60–90-Sekunden-Skript
- Hook, Dramaturgie und Szenenplan
- pro Szene eine Zwischenüberschrift, die die Kernaussage genau dieser Szene trifft, plus ein eigenes passendes Icon
- Bild-/Remotion-Zuordnung
- Cover- und Bildprompts für Google Flow
- exakte endgültige Dateinamen nach echten Szenennummern
- Remotion-Spezifikationen
- Master-Caption und Texte für Instagram Reels, TikTok, Facebook Reels und Snapchat

In Phase 1 bleiben keine Platzhalter in diesen Inhalten. ChatGPT erzeugt keine finalen Bilder und kein Ersatz-Voiceover.

**Übergabe an Phase 1: `docs/PHASE-1-BRIEFING.md`** — vollständig kopieren.

## Phase 2 — Nutzer erstellt Bilder und Audio

1. Jedes Cover-/Szenenbild einzeln mit Google Flow erzeugen.
2. Dem Google-Flow-KI-Agenten ausschließlich `03-szenen/alle-bildprompts.txt` übergeben.
3. Agent strikt arbeiten lassen: genau ein Bild → vollständig intern warten → sofort exakt umbenennen → Same-World- und Bild-QA → automatisch nächstes Bild.
4. Jedes erzeugte Bild muss quadratisch `1:1` sein; nicht `9:16`.
5. Bei einem Fehler dieselbe Bildnummer neu erzeugen; niemals mehrere Bilder parallel starten.
6. **Keine Bildreferenz verwenden.** `Bild 00` oder andere Szenenbilder niemals als Referenz hochladen oder anhängen.
7. Alle Bilder gemeinsam in `03-szenen/00-ALLE-BILDER-HIER-REIN/` ablegen.
8. Genau ein finales Voiceover in `02-audio/` ablegen.
9. Aus genau diesem Audio echte Wort-Zeitstempel erzeugen:

```bash
python3 scripts/captions.py \
  reels/<Woche>/<Tag>/<Reel>/02-audio/<audio>.mp3 \
  reels/<Woche>/<Tag>/<Reel>/04-caption/word-timings.json
```

## Phase 3 — Executor aus `scene-index.json`

Der Auftrag lautet:

```text
Mach das Reel: reels/<Woche>/<Tag>/<Reel>
```

Zuerst läuft immer:

```bash
npm run reel:ready -- reels/<Woche>/<Tag>/<Reel>
```

`phase3Executor` entscheidet danach verbindlich:

| Wert | Ausführung | Übergabe |
|---|---|---|
| `antigravity` | Antigravity | `MASTER-PROMPTS.md`, Phase-3-Abschnitt |
| `claude-code` | Claude Code | `05-projektdateien/CLAUDE-CODE-AUFTRAG.md` im Reel |

Bei `claude-code` blockiert Readiness, wenn der Auftrag fehlt oder noch Platzhalter enthält.

### Hard Completion Gate

Eine erfolgreich erzeugte MP4 ist **noch kein fertiges Reel**. Verbindliche
Details: `docs/PHASE-3-COMPLETION-GATE.md`.

Nach grünem `reel:ready` läuft Phase 3 in dieser Reihenfolge:

```bash
npm run reel:phase3:init -- <Reel-Pfad> <Composition-ID>
# jede scene-index-Szene wirklich implementieren und Manifest vervollständigen
npm run reel:phase3:preflight -- <Reel-Pfad>
npm run reel:render -- <Reel-Pfad>/05-projektdateien/phase3-production-manifest.json
npm run reel:export -- <Reel-Pfad> <Final-MP4>
```

Der Executor arbeitet ohne Geschmacksrückfragen:

1. Bilder technisch synchronisieren
2. Timeline aus dem finalen Audio ableiten
3. `phase3-production-manifest.json` anlegen und **jede** Szene einzeln belegen
4. Remotion-Szenen, Überschriften und Karaoke-Untertitel bauen
   - Bildszene = echtes sichtbares Bildlayer
   - Animationsszene = echte sichtbare Animationskomponente
   - Untertitel/SceneHeader allein zählen niemals als Szenenvisual
   - Zwischenüberschrift mittig und in FinanzNeo-Grün, mit passendem Icon
   - Untertitel pro Szene clippen: kein Wort der nächsten Szene darf vorher sichtbar sein
5. Produktionsmanifest auf `READY_TO_RENDER` setzen; Audio/Captions/Headers müssen als implementiert bestätigt sein
6. `reel:phase3:preflight` ausführen — ohne PASS kein produktiver Render
7. zentrale `REEL_STYLE`-Werte verwenden; alte abweichende per-Reel-Stylemetadaten nicht als Override benutzen
8. Validator, Tests und Typecheck ausführen
9. Preview prüfen
10. produktiven Render ausschließlich über `reel:render` starten
11. `reel:render` erzeugt zuerst nur `*.phase3-candidate.mp4`
12. automatische Post-Render-QA prüft jede Bildszene auf sichtbaren Inhalt und jede Animationsszene zusätzlich auf messbare Bewegung; Audio-Stream muss vorhanden sein
13. nur bei QA `PASSED` wird Candidate zur finalen MP4 umbenannt
14. komplette freigegebene MP4 mit Ton ansehen; Animationen zusätzlich ohne Ton prüfen
15. Export-Paket erzeugen; Export verifiziert Video-/scene-index-/Manifest-Hashes erneut

## Einzige zulässige Stopps

Phase 3 stoppt nur bei einem echten Blocker und meldet alle Blocker gesammelt und mit exaktem Pfad:

- fehlendes oder falsch benanntes Nutzerbild
- fehlendes, mehrfaches oder unlesbares finales Audio
- fehlende oder nicht zum Audio passende Wort-Zeitstempel
- unvollständige Phase-1-Datei oder widersprüchlicher Szenenindex
- bei `claude-code`: fehlender/unvollständiger `CLAUDE-CODE-AUFTRAG.md`
- verletzter Finanz-, Sicherheits- oder Quellenvertrag
- fehlende Bild-/Animationsimplementierung im Phase-3-Manifest
- Phase-3-Preflight schlägt fehl
- Post-Render-QA erkennt leere/Caption-only-Bildszene oder fehlende Animationsbewegung
- Finalvideo enthält keinen Audio-Stream
- nicht selbst lösbarer Validator-, Build- oder Renderfehler

Keine Rückfragen zu Geschmack, Übergängen, Layoutvarianten oder bereits durch das Repo entschiedenen Standards.

## Abschluss — sicherer Export

Phase 3 endet mit:

```bash
npm run reel:export -- <Reel-Pfad> <exakter-gerenderter-MP4-Pfad>
```

Der Export akzeptiert nur eine MP4, deren SHA-256 exakt mit dem bestandenen
`05-projektdateien/phase3-render-qa.json` übereinstimmt. Zusätzlich müssen die
Hashes von `scene-index.json` und `phase3-production-manifest.json` seit der QA
unverändert sein.

Candidate-Dateien werden nicht als finale Videos betrachtet. Bei fehlender oder
fehlgeschlagener Render-QA wird kein Upload-Paket erzeugt.

`06-export/` muss vollständig enthalten:

- fertige, visuell geprüfte MP4
- Cover
- `bilder.zip`
- universelle Caption
- Instagram-/TikTok-/Facebook-/Snapchat-Caption
- `untertitel.srt`
- `UPLOAD.md`

Erst dann ist der Status `FINAL_COMPLETE` zulässig.
