# FinanzNeo — YouTube-Longform in drei Phasen

> Bei Widersprüchen gilt `CLAUDE.md`. Für Motion gilt zusätzlich `docs/YOUTUBE-MOTION-V3.md`. Für externe Medien gilt zusätzlich `docs/FINANZNEO-EXTERNAL-ASSET-SOURCES.md`.

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
- pro Motion-Visual `viewerChange`, `animationIntent`, `mechanicId`, `visualTechniqueId`, `techniqueDescription`, freien `compositionFamilyId`, `toolStack`, `motionSignature`, Motion Channels und Visual Beats
- Thumbnail-Prompt und Thumbnail-Brief
- Titelvarianten, finalen Titel, Beschreibung, Kapitel, Keywords, Hashtags
- Quellen-/Disclaimer-Text, angehefteten Kommentar, Community-Post und Upload-Checkliste
- Promo-Texte für Instagram, TikTok, Facebook und Snapchat
- bei echtem Mehrwert einen optionalen Plan für lizenzierte externe Support-Assets wie B-Roll, Icons, Fotos oder kleine Lottie-Cues

### Externe Assets in Phase 1 — nur als geplanter Support

Externe Medien werden **nicht** nachträglich zufällig in Phase 3 erfunden. Wenn ein Beat von echter Bewegung, einem präzisen Icon oder einem kleinen Support-Cue profitiert, plant Phase 1 dafür einen expliziten Asset-Slot.

Reihenfolge:

```text
Sprechpunkt
→ Viewer Change
→ Hauptvisual bestimmen
→ prüfen, ob externes Asset einen klaren Erklärwert bringt
→ Asset-Slot mit Zweck und erlaubtem Typ dokumentieren
→ Hauptmechanik bleibt unabhängig vom konkreten Stocktreffer verständlich
```

Zulässige Rollen:

- `broll`: kurzer realer Cutaway oder Pattern Interrupt mit erklärender Bewegung
- `icon`: semantische Kurzschrift innerhalb einer Remotion-Szene
- `photo`: nur wenn ein reales Standbild klarer ist als Flow/Remotion
- `lottie`: kleine Supportbewegung wie Check, Warning, Clock oder Document

Nicht zulässig:

- Stockmaterial als Ersatz für eine bereits definierte Hauptmechanik
- generische Finance-B-Roll ohne Bezug zum gesprochenen Punkt
- Asset-Auswahl nur weil ein Clip „gut aussieht“
- Remote-Medien im produktiven Render
- ungeklärte oder nicht kommerziell nutzbare Lizenz

Projektbezogen werden dafür verwendet:

```text
06-projektdateien/external-assets-plan.md
06-projektdateien/external-assets-manifest.json
04-visuals/external-assets/external-assets-ledger.json
```

Das Manifest beschreibt nur erlaubte Slots und ihren Zweck. Ein Slot darf leer bleiben, wenn kein Asset die Qualitäts- und Lizenzprüfung besteht. Das Video muss auch ohne den optionalen Asset-Treffer inhaltlich funktionieren.

### Motion-Auswahl — Viewer Change zuerst

Nicht zuerst eine vorhandene Komponente oder Animationsfamilie wählen.

Für jeden Motion-Beat zuerst in einem Satz beantworten:

> Was soll der Zuschauer tatsächlich sehen, das sich verändert, enthüllt, vergleicht, aufbaut, zerlegt oder räumlich erschließt?

Danach darf Phase 1 frei zwischen Custom React, SVG, CSS 3D, Canvas, Three.js/R3F, Datenvisualisierung, Timeline, Kinetic Type, Document Motion, Simulation, Flow+Remotion-Hybrid und weiteren sinnvollen oder neu kombinierten Remotion-Techniken wählen.

Composition Families sind nur freie Beschreibungen, keine Whitelist. Bestehende FinanzNeo-Komponenten und `Physical*`-Primitives sind optionale Werkzeuge, keine Pflichtvorlagen.

Vor Freigabe prüft Phase 1 die letzten vier Motion-Visuals. Ein anderer Name reicht nicht als Variation: Kamera, Layout und sichtbare Transformation dürfen nicht einfach wiederholt werden, außer die Wiederholung ist für Verständnis/Vergleich wirklich sinnvoll und wird mit `repeatTechniqueReason` begründet.

Vor Phase 2:

```bash
npm run youtube:validate -- youtube/<Projekt>
npm run youtube:animation:validate -- youtube/<Projekt>
npm run youtube:phase1:seal -- youtube/<Projekt>
```

Der Motion-V3-Seal bindet sowohl die kanonischen Motion-Quellen per SHA-256 als auch den kreativen Vertrag aus Viewer Change, Intent, Mechanik, Technikbeschreibung, Tool-Stack, Motion-Signatur, Channels und Beats.

Externe Asset-Slots werden **nicht** in den Motion-Seal hineingefälscht. Der Seal schützt weiterhin die kreative Hauptmechanik. Ein später ausgewähltes Support-Asset darf diese Mechanik nicht ändern.

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

- Bilder folgen `finanzneo-youtube-cg-animated-black-v2`.
- Nicht Motiv, Komposition oder Labels eines anderen Bildes als Standardvorlage kopieren.
- Neue Bilder folgen `Literal first, creative second`.
- Fehlerhafte Bildnummer wiederholen; nie parallel oder als Batch fortfahren.
- Nicht-Bild-Visualnummern überspringen, aber nicht neu nummerieren.
- Alle fertigen Dateien gemeinsam nach `04-visuals/00-ALLE-BILDER-HIER-REIN/` legen.
- Alle YouTube-Quellbilder und das Thumbnail sind horizontal `16:9`.
- Genau ein finales Voiceover in `03-audio/` ablegen.
- Aus genau diesem Audio echte Wort-Zeitstempel in `03-audio/word-timings.json` erzeugen.

Antigravity erzeugt keine fehlenden Bilder und kein Ersatz-Voiceover.

Externe Support-Assets gehören **nicht** zum schnellen Phase-2-Flow-Hand-off. Sie werden erst in Phase 3 anhand des Phase-1-Manifests gesucht, geprüft und lokal integriert. Dadurch bleibt Phase 2 schlank.

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
2. unveränderten Phase-1-Motion-V3-Seal prüfen
3. `external-assets-manifest.json` lesen und nur dort freigegebene externe Slots berücksichtigen
4. für einen freigegebenen Slot zuerst vorhandene lokale Assets prüfen; andernfalls nur freigegebene Quellen aus `docs/FINANZNEO-EXTERNAL-ASSET-SOURCES.md` verwenden
5. jedes ausgewählte externe Asset vor Nutzung auf Lizenz, Qualität, Logos/Personen und Format prüfen und in `external-assets-ledger.json` dokumentieren
6. Asset lokal nach `04-visuals/external-assets/` speichern; produktiver Remotion-Code darf keine Remote-URL laden
7. Timeline aus Voiceover, Visual Beats und Kapiteln ableiten
8. versiegelte Motion-Quellen integrieren und nur zeitlich an echtes Audio anpassen
9. freigegebene B-Roll/Icon/Lottie-Supportschichten nur innerhalb ihres dokumentierten Zwecks integrieren
10. Texteinblendungen, Untertitel und freigegebene lokale SFX integrieren
11. 1920 × 1080 bei 30 fps rendern
12. Validator, Tests, Typecheck und Render-QA ausführen
13. Bildsatz, Thumbnail, komplette MP4, Ton, Lautheit und externe Asset-Attributionen prüfen
14. Kapitel-Zeitstempel und Upload-Paket an den finalen Render anpassen

### Harte Phase-3-Grenzen für externe Assets

Phase 3 darf:

- einen geplanten B-Roll-Slot mit einem passenden lizenzierten lokalen Clip füllen
- geplante lokale SVG-Icons als semantischen Support verwenden
- einen geplanten kleinen Lottie-Cue einsetzen
- einen Slot leer lassen, wenn kein Treffer die Qualitäts-/Lizenzprüfung besteht
- leichte technische Anpassungen wie Crop, Scale, Mask, Farbangleichung oder Timing vornehmen, wenn die Hauptmechanik unverändert bleibt

Phase 3 darf **nicht**:

- neue externe Asset-Slots erfinden, nur um das Video voller zu machen
- einen Flow-/Remotion-Hauptbeat durch Stockmaterial ersetzen
- eine versiegelte Animation kreativ umbauen, damit ein gefundener Clip hineinpasst
- ungeklärte Assets „vorläufig“ verwenden
- APIs/Remote-URLs zur Renderzeit aufrufen
- API-Keys oder Tokens committen

Wenn ein externes Asset eine kreative Änderung der versiegelten Hauptmechanik erfordern würde:

```text
STOP
→ zurück zu Phase 1
→ kanonische Motion/Planung ändern
→ youtube:animation:validate erneut ausführen
→ Phase-1-Seal neu erzeugen
```

Phase 3 darf eine versiegelte Animation **nicht** durch eine einfachere Karten-, Balken-, Coin-, Stock- oder Standardanimation ersetzen. Kreative Änderungen bedeuten zurück zu Phase 1, erneute Motion-Validation und erneuten Seal.

Phase 3 stoppt nur bei einem echten Blocker und meldet alle Blocker gesammelt mit exakten Pfaden.
