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

Wenn die Prüfung erfolgreich ist, startet der festgelegte Executor ohne
Geschmacksrückfragen und ohne Zwischenstopps:

1. Bilder technisch synchronisieren
2. Timeline aus dem finalen Audio ableiten
3. Remotion-Szenen, Überschriften und Karaoke-Untertitel bauen
   - Zwischenüberschrift mittig und in FinanzNeo-Grün, mit passendem Icon
   - Untertitel pro Szene clippen: kein Wort der nächsten Szene darf vorher sichtbar sein
4. zentrale `REEL_STYLE`-Werte verwenden; alte abweichende per-Reel-Stylemetadaten nicht als Override benutzen
5. Validator, Tests und Typecheck ausführen
6. Preview und finale MP4 rendern
7. Frames, Bildsatz, Ton und Lautheit prüfen
8. Animationen zusätzlich ohne Ton auf Verständlichkeit prüfen
9. Export-Paket erzeugen

## Einzige zulässige Stopps

Phase 3 stoppt nur bei einem echten Blocker und meldet alle Blocker gesammelt und mit exaktem Pfad:

- fehlendes oder falsch benanntes Nutzerbild
- fehlendes, mehrfaches oder unlesbares finales Audio
- fehlende oder nicht zum Audio passende Wort-Zeitstempel
- unvollständige Phase-1-Datei oder widersprüchlicher Szenenindex
- bei `claude-code`: fehlender/unvollständiger `CLAUDE-CODE-AUFTRAG.md`
- verletzter Finanz-, Sicherheits- oder Quellenvertrag
- nicht selbst lösbarer Validator-, Build- oder Renderfehler

Keine Rückfragen zu Geschmack, Übergängen, Layoutvarianten oder bereits durch das Repo entschiedenen Standards.

## Abschluss — sicherer Export

Phase 3 endet mit:

```bash
npm run reel:export -- <Reel-Pfad> <exakter-gerenderter-MP4-Pfad>
```

Der exakte Videopfad ist der sichere Standard. Ohne zweiten Parameter darf das
Exportskript nur automatisch auswählen, wenn die Datei eindeutig dem Reel
zugeordnet werden kann oder `out/` genau eine MP4 enthält. Bei mehreren
mehrdeutigen MP4-Dateien bricht es ab statt eine möglicherweise fremde Datei zu
übernehmen.

`06-export/` muss vollständig enthalten:

- fertige MP4
- Cover
- `bilder.zip`
- universelle Caption
- Instagram-/TikTok-/Facebook-/Snapchat-Caption
- `untertitel.srt`
- `UPLOAD.md`
