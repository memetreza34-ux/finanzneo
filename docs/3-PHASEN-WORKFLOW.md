# FinanzNeo — verbindlicher 3-Phasen-Workflow

> Bei Widersprüchen gilt `CLAUDE.md`.

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
ChatGPT hat keinen Repo-Zugriff; das Briefing enthält deshalb alle Regeln
ausgeschrieben statt auf Dateien zu verweisen.

## Phase 2 — Nutzer erstellt Bilder und Audio

1. Jedes Cover-/Szenenbild einzeln mit Google Flow erzeugen.
2. Dem Google-Flow-KI-Agenten ausschließlich `03-szenen/alle-bildprompts.txt` übergeben.
3. Agent strikt arbeiten lassen: genau ein Bild → vollständig warten → sofort exakt umbenennen → Same-World- und Bild-QA → erst dann nächstes Bild.
   Jedes erzeugte Bild muss quadratisch `1:1` sein; nicht `9:16`.
4. Bei einem Fehler dieselbe Bildnummer neu erzeugen; niemals parallel oder als Batch fortfahren.
5. **Keine Bildreferenz verwenden.** `Bild 00` oder andere Szenenbilder niemals als Referenz
   hochladen oder anhängen. Einheitlichkeit entsteht ausschließlich über den in jedem Prompt
   ausgeschriebenen Stil-, Material-, Farb- und Licht-Lock.
6. Alle Bilder gemeinsam in `03-szenen/00-ALLE-BILDER-HIER-REIN/` ablegen.
7. Genau ein finales Voiceover in `02-audio/` ablegen.
8. Aus genau diesem Audio echte Wort-Zeitstempel erzeugen:

```bash
python3 scripts/captions.py \
  reels/<Woche>/<Tag>/<Reel>/02-audio/<audio>.mp3 \
  reels/<Woche>/<Tag>/<Reel>/04-caption/word-timings.json
```

## Phase 3 — Antigravity baut autonom

Der Auftrag lautet:

```text
Mach das Reel: reels/<Woche>/<Tag>/<Reel>
```

Antigravity führt zuerst aus:

```bash
npm run reel:ready -- reels/<Woche>/<Tag>/<Reel>
```

Wenn die Prüfung erfolgreich ist, startet Antigravity ohne Rückfragen und ohne Zwischenstopps:

1. Bilder technisch synchronisieren
2. Timeline aus dem finalen Audio ableiten
3. Remotion-Szenen, Überschriften und Karaoke-Untertitel bauen
   - Zwischenüberschrift mittig und in FinanzNeo-Grün, mit eigenem Icon je Szene
   - Untertitel **pro Szene** clippen: kein Wort der nächsten Szene darf vorher sichtbar sein
4. Validator, Tests und Typecheck ausführen
5. Preview und finale MP4 rendern
6. Frames, Bildsatz, Ton und Lautheit prüfen

Antigravity trifft normale gestalterische und technische Detailentscheidungen selbstständig nach den Repo-Regeln.

## Einzige zulässige Stopps

Phase 3 stoppt nur bei einem echten Blocker und meldet alle Blocker gesammelt und mit exaktem Pfad:

- fehlendes oder falsch benanntes Nutzerbild
- fehlendes, mehrfaches oder unlesbares finales Audio
- fehlende oder nicht zum Audio passende Wort-Zeitstempel
- unvollständige Phase-1-Datei oder widersprüchlicher Szenenindex
- verletzter Finanz-, Sicherheits- oder Quellenvertrag
- nicht selbst lösbarer Validator-, Build- oder Renderfehler

Keine Rückfragen zu Geschmack, Übergängen, Layoutvarianten oder bereits durch das Repo entschiedenen Standards.
