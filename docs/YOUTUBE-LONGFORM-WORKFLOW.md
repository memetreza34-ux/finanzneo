# FinanzNeo — YouTube-Longform in drei Phasen

> Bei Widersprüchen gilt `CLAUDE.md`.

YouTube-Longform ist ein eigenständiges Format. Ein Reel wird weder gestreckt noch als YouTube Short gespiegelt. Ein Thema gehört in Longform, wenn es für Verständnis echte Tiefe braucht: mehrere Schritte, Beispiele, Vergleiche, Rechnungen, Einordnung oder häufige Fehler.

## Phase 1 — ChatGPT bereitet vollständig vor

ChatGPT erstellt im YouTube-Projektordner ohne offene Platzhalter:

- Briefing, Lernziel, Kernversprechen und Begründung für Longform
- geprüfte Recherche, Quellen, Datenstand, Annahmen und Rechenwege
- Hook, Kapitel-Dramaturgie und Retention-Plan
- vollständiges deutsches Voiceover-Skript
- Visual-Plan mit Bild-/Remotion-Zuordnung
- alle Google-Flow-Bildprompts in Englisch und mit exakten Dateinamen
- Thumbnail-Prompt und Thumbnail-Brief
- Titelvarianten, finalen Titel, Beschreibung, Kapitel, Keywords, Hashtags
- Quellen-/Disclaimer-Text, angehefteten Kommentar, Community-Post und Upload-Checkliste
- Promo-Texte für Instagram, TikTok, Facebook und Snapchat

Die Videolänge folgt dem Thema und dem fertigen Skript. Es gibt keine künstliche Mindestlänge und keine Füllpassagen.

## Phase 2 — Nutzer erstellt Bilder und Audio

Dem Google-Flow-KI-Agenten wird ausschließlich diese Datei gegeben:

```text
04-visuals/alle-bildprompts.txt
```

Der Agent arbeitet strikt:

```text
GENAU EIN BILD ERZEUGEN
→ VOLLSTÄNDIG WARTEN
→ SOFORT EXAKT UMBENENNEN
→ MOTIV + LABELS + GESICHT + HINTERGRUND + 16:9 + DATEINAME PRÜFEN
→ ERST DANN DAS NÄCHSTE BILD
```

- Thumbnail zuerst erzeugen und nach bestandener Prüfung als reine Stilreferenz nutzen.
- Nicht Motiv, Komposition oder Labels des Thumbnails in Folgebilder kopieren.
- Fehlerhafte Bildnummer wiederholen; nie parallel oder als Batch fortfahren.
- Animationsnummern überspringen, aber nicht neu nummerieren.
- Alle fertigen Dateien gemeinsam nach `04-visuals/00-ALLE-BILDER-HIER-REIN/` legen.
- Alle YouTube-Quellbilder und das Thumbnail sind horizontal `16:9`.
- Genau ein finales Voiceover in `03-audio/` ablegen.
- Aus genau diesem Audio echte Wort-Zeitstempel in `03-audio/word-timings.json` erzeugen.

Antigravity erzeugt keine fehlenden Bilder und kein Ersatz-Voiceover.

## Phase 3 — Antigravity baut autonom

Der Auftrag lautet:

```text
Mach das YouTube-Video: youtube/<Projekt>
```

Antigravity beginnt immer mit:

```bash
npm run youtube:ready -- youtube/<Projekt>
```

Bei erfolgreicher Prüfung arbeitet Antigravity ohne Rückfragen und Zwischenstopps:

1. finale Audio- und Bildassets einlesen
2. Timeline aus Voiceover, Kapiteln und Visual-Plan ableiten
3. Remotion-Animationen, Texteinblendungen und Untertitel bauen
4. 1920 × 1080 bei 30 fps rendern
5. Validator, Tests, Typecheck und Render-QA ausführen
6. Bildsatz, Thumbnail, komplette MP4, Ton und Lautheit prüfen
7. Kapitel-Zeitstempel und Upload-Paket an den finalen Render anpassen

Antigravity stoppt nur bei einem echten Blocker und meldet alle Blocker gesammelt mit exakten Pfaden: fehlendes/falsch benanntes Bild, fehlendes/mehrfaches/unlesbares Audio, falsche Wortzeiten, Fakten-/Sicherheitskonflikt oder nicht selbst lösbarer Validator-/Build-/Renderfehler.
