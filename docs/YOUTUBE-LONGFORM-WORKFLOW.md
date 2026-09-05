# FinanzNeo — YouTube-Longform in drei Phasen

> Bei Widersprüchen gilt `CLAUDE.md`. Für Motion gilt zusätzlich `docs/YOUTUBE-MOTION-V2.md`.

YouTube-Longform ist ein eigenständiges Format. Ein Reel wird weder gestreckt noch als YouTube Short gespiegelt. Ein Thema gehört in Longform, wenn es für Verständnis echte Tiefe braucht: mehrere Schritte, Beispiele, Vergleiche, Rechnungen, Einordnung oder häufige Fehler.

## Phase 1 — ChatGPT bereitet vollständig vor

ChatGPT erstellt im YouTube-Projektordner ohne offene Platzhalter:

- Briefing, Lernziel, Kernversprechen und Begründung für Longform
- geprüfte Recherche, Quellen, Datenstand, Annahmen und Rechenwege
- Hook, Kapitel-Dramaturgie und Retention-Plan
- vollständiges deutsches Voiceover-Skript
- gesprochene Gedanken und sichtbare Visual Beats
- danach die beste Visualart je Beat: `image`, `animation`, `hybrid` oder `data`
- Visual-Plan ohne feste Visualzahl und ohne feste Bild-/Animationsquote
- alle Google-Flow-Bildprompts in Englisch und mit exakten Dateinamen
- für jedes Motion-Visual produktionsreife `animation.tsx`
- pro Motion-Visual `mechanicId`, `visualTechniqueId`, `compositionFamilyId`, Motion Channels und Visual Beats
- Thumbnail-Prompt und Thumbnail-Brief
- Titelvarianten, finalen Titel, Beschreibung, Kapitel, Keywords, Hashtags
- Quellen-/Disclaimer-Text, angehefteten Kommentar, Community-Post und Upload-Checkliste
- Promo-Texte für Instagram, TikTok, Facebook und Snapchat

### Motion-Auswahl

Nicht zuerst eine vorhandene Komponente wählen. Zuerst festlegen, was der Zuschauer sehen soll. Danach darf Phase 1 frei zwischen Custom React, SVG, CSS 3D, Canvas, Three.js/R3F, Datenvisualisierung, Timeline, Kinetic Type, Document Motion, Simulation, Flow+Remotion-Hybrid und weiteren sinnvollen Remotion-Techniken wählen.

Bestehende FinanzNeo-Komponenten und `Physical*`-Primitives sind optionale Werkzeuge, keine Pflichtvorlagen.

Vor Phase 2:

```bash
npm run youtube:validate -- youtube/<Projekt>
npm run youtube:animation:validate -- youtube/<Projekt>
npm run youtube:phase1:seal -- youtube/<Projekt>
```

Der Seal bindet die kanonischen Motion-Quellen per SHA-256.

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
→ LITERALEN SPRECHPUNKT + KONTEXT + LABELS + HINTERGRUND + 16:9 + DATEINAME PRÜFEN
→ ERST DANN DAS NÄCHSTE BILD
```

- Thumbnail zuerst erzeugen und nach bestandener Prüfung als reine Stilreferenz nutzen.
- Nicht Motiv, Komposition oder Labels des Thumbnails in Folgebilder kopieren.
- Neue Bilder folgen `Literal first, creative second`.
- Fehlerhafte Bildnummer wiederholen; nie parallel oder als Batch fortfahren.
- Nicht-Bild-Visualnummern überspringen, aber nicht neu nummerieren.
- Alle fertigen Dateien gemeinsam nach `04-visuals/00-ALLE-BILDER-HIER-REIN/` legen.
- Alle YouTube-Quellbilder und das Thumbnail sind horizontal `16:9`.
- Genau ein finales Voiceover in `03-audio/` ablegen.
- Aus genau diesem Audio echte Wort-Zeitstempel in `03-audio/word-timings.json` erzeugen.

Antigravity erzeugt keine fehlenden Bilder und kein Ersatz-Voiceover.

## Phase 3 — Integration, Retiming, QA und Render

Der Auftrag lautet:

```text
Mach das YouTube-Video: youtube/<Projekt>
```

Phase 3 beginnt immer mit:

```bash
npm run youtube:ready -- youtube/<Projekt>
```

Bei erfolgreicher Prüfung arbeitet der Executor ohne Rückfragen und Zwischenstopps:

1. finale Audio- und Bildassets einlesen
2. unveränderten Phase-1-Motion-Seal prüfen
3. Timeline aus Voiceover, Visual Beats und Kapiteln ableiten
4. versiegelte Motion-Quellen integrieren und nur zeitlich an echtes Audio anpassen
5. Texteinblendungen, Untertitel und freigegebene lokale SFX integrieren
6. 1920 × 1080 bei 30 fps rendern
7. Validator, Tests, Typecheck und Render-QA ausführen
8. Bildsatz, Thumbnail, komplette MP4, Ton und Lautheit prüfen
9. Kapitel-Zeitstempel und Upload-Paket an den finalen Render anpassen

Phase 3 darf eine versiegelte Animation **nicht** durch eine einfachere Karten-, Balken-, Coin- oder Standardanimation ersetzen. Kreative Änderungen bedeuten zurück zu Phase 1, erneute Motion-Validation und erneuten Seal.

Phase 3 stoppt nur bei einem echten Blocker und meldet alle Blocker gesammelt mit exakten Pfaden.
