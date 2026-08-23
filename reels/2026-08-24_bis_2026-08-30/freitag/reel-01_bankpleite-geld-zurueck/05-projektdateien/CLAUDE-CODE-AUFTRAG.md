# CLAUDE CODE — PHASE-3-AUFTRAG

## Ziel
Baue und rendere ausschließlich:
`reels/2026-08-24_bis_2026-08-30/freitag/reel-01_bankpleite-geld-zurueck`

## Branch
`reel/2026-08-28-bankpleite-geld-zurueck`

## Start
1. Root-`CLAUDE.md` lesen.
2. Kompletten Reel-Ordner lesen.
3. `npm run reel:ready -- reels/2026-08-24_bis_2026-08-30/freitag/reel-01_bankpleite-geld-zurueck`
4. Bei echtem Phase-2-Blocker stoppen und alle fehlenden Dateien gesammelt nennen.
5. Bei grünem Readiness-Gate Phase 3 vollständig ohne Geschmacksrückfragen ausführen.

## Verbindlich
- finales Voiceover + echte Wort-Timings sind alleinige Timingquelle
- jeder Beat beginnt am `audioTrigger` aus `scene-index.json`, Zielabweichung max. ca. 0,15 s
- kein Bild länger als 6 s
- jede Szene SceneHeader + Icon
- Header ca. Y=118; zentrale Visualzone ca. Y=390–1560
- Captions Premium V3: satzbasiert, Active hellgrün, Rest weiß, ca. bottom=285, crisp Backplate, kein Glow-Blur
- Animationen einheitliche Bühne + Start→Mechanismus→Ergebnis
- Übergänge 4–6 Frames, gleicher Bewegungsfluss, kein Fade-to-black
- Weiß neutral, Grün Schutz/Fokus, Gold Geld, Rot Warnung; kein Schwarz auf dunkler Fläche
- keine Fakten oder Voiceover-Sätze stillschweigend ändern
- keine Bilder selbst generieren
- andere Reels nicht verändern
- nicht mergen

## Checks
- `npm run reel:validate -- <Reel-Pfad>`
- `npm run typecheck`
- `npm run build`
- Preview/Frames mobil prüfen
- komplette MP4 mit Ton ansehen
- Animationen zusätzlich ohne Ton auf Verständlichkeit prüfen
- Bildwechsel gegen Audio-Trigger prüfen

## Finalrender
Hochwertige Renderpipeline mit H.264 CRF14, PNG-Zwischenframes, AAC320k, yuv420p verwenden. Audioziel ungefähr -16 LUFS / <= -1 dBTP kontrollieren.

## Startprompt
`Mach Phase 3 vollständig für reels/2026-08-24_bis_2026-08-30/freitag/reel-01_bankpleite-geld-zurueck. Halte dich an 05-projektdateien/CLAUDE-CODE-AUFTRAG.md und CLAUDE.md. Stoppe nur bei einem echten reel:ready-Blocker.`
