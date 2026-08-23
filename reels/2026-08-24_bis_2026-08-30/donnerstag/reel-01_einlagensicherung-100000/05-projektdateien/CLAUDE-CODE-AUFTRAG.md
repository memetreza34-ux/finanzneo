# CLAUDE CODE — PHASE-3-AUFTRAG

## Ziel
Baue und rendere ausschließlich diesen Reel:
`reels/2026-08-24_bis_2026-08-30/donnerstag/reel-01_einlagensicherung-100000`

## Sicherheitsregeln
- Arbeite nur auf Branch `reel/2026-08-27-einlagensicherung-100000-claude-code`.
- `main` niemals direkt verändern.
- Keine bestehenden anderen Reels ändern.
- Keine Google-Flow-Bilder selbst generieren oder ersetzen.
- Keine Fakten/Sprechtexte stillschweigend umschreiben.
- Globale Regeln nur ändern, wenn ein echter technischer Defekt den Reel blockiert; lokale Reel-Lösung bevorzugen.

## Start
1. Repository-Regeln aus Root-`CLAUDE.md` lesen.
2. Diesen Auftrag und den kompletten Reel-Ordner lesen.
3. Ausführen:
   `npm run reel:ready -- reels/2026-08-24_bis_2026-08-30/donnerstag/reel-01_einlagensicherung-100000`
4. Wenn Phase 2 noch fehlt: STOPP und gesammelt melden, welche Bilder/Audio/Wortzeiten fehlen. Nichts erfinden.
5. Wenn `reel:ready` grün ist: ohne weitere Rückfragen Phase 3 vollständig ausführen.

## Verbindliche Umsetzung
- echte Wort-Timings sind alleinige Timingquelle
- jeder Szenenstart folgt dem `audioTrigger` aus `scene-index.json`, max. ca. 0,15 s Abweichung
- Bilder niemals länger als 6 s
- jede Szene `SceneHeader` + passendes Icon
- Header ca. Y=118, zentrale Visualzone ca. Y=390–1560
- Captions V3: Satzbasiert, Active-Word hellgrün, Rest weiß, bottom≈285, crisp Backplate, kein Glow-Blur
- Animationen: einheitliche Premium-Bühne, Start→Mechanismus→Ergebnis, keine bloßen Zoom/Fade-Effekte
- Übergänge: 4–6 Frames, inhaltlich motiviert, gleiche Continuity-Sprache, kein Fade-to-black
- keine schwarzen Texte auf dunklen Flächen
- Weiß neutral, Grün Schutz/Fokus, Gold Geld, Rot Warnung

## Qualitätsprüfung
Vor Finalrender:
- `npm run reel:validate -- <Reel-Pfad>`
- `npm run typecheck`
- `npm run build`
- Preview/Frames mobil prüfen: Header, Captions, Bildgröße, Animationen, Übergänge, Audio-Sync
- jede Animation auch ohne Ton verständlich?
- stimmen Bildwechsel mit gesprochenen Aussagen?

## Finalrender
Nutze die hochwertige Renderpipeline (`scripts/render-validated.mjs`) mit H.264 CRF14, PNG-Zwischenframes, AAC320k und yuv420p. Danach finale MP4 visuell prüfen und Audioziel kontrollieren.

## Fertigmeldung
Nur melden: welche Dateien/Composition erstellt wurden, welche Checks liefen, finaler MP4-Pfad und verbleibende echte Warnungen. Nicht mergen.

## Prompt zum Starten in Claude Code
`Mach Phase 3 vollständig für reels/2026-08-24_bis_2026-08-30/donnerstag/reel-01_einlagensicherung-100000. Halte dich an 05-projektdateien/CLAUDE-CODE-AUFTRAG.md und CLAUDE.md. Stoppe nur bei einem echten reel:ready-Blocker.`
