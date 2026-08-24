# CLAUDE CODE — PHASE-3-AUFTRAG

## Ziel
Baue, prüfe, rendere und exportiere ausschließlich:
`reels/2026-08-24_bis_2026-08-30/samstag/reel-01_euro-oder-landeswaehrung`

## Branch
`reel/2026-08-29-euro-oder-landeswaehrung`

## Start
1. Root-`CLAUDE.md` lesen.
2. Kompletten Reel-Ordner lesen.
3. `npm run reel:ready -- reels/2026-08-24_bis_2026-08-30/samstag/reel-01_euro-oder-landeswaehrung` ausführen.
4. Bei echtem Phase-2-Blocker stoppen und alle fehlenden Dateien gesammelt nennen.
5. Bei grünem Readiness-Gate Phase 3 vollständig ohne Geschmacksrückfragen ausführen.

## Verbindlich
- finale Voiceover-Datei + echte Wort-Timings sind alleinige Timingquelle
- `audioTrigger` pro Szene als semantischer Schnittanker verwenden; Zielabweichung maximal ca. 0,15 s
- kein Bild länger als 6 s
- jede Szene SceneHeader + eigenes Icon
- Layout, Captionmaße und Transitiondauer ausschließlich aus `REEL_STYLE` übernehmen; keine veralteten Reel-Metadaten priorisieren
- zentrale Premium-V3-Positionen aktuell: Header ca. Y=118, Visualzone ca. Y=390–1560, Caption ca. bottom=285
- zentrale Continuity aktuell 3 Frames; kein Fade-to-black
- Captions: aktives Wort hellgrün, Rest weiß, crisp Backplate, kein Stroke/Glow/Jump/Scale, niemals Wörter der nächsten Szene vorgreifen lassen
- Flow-Bilder nicht neu erzeugen oder ersetzen
- Flow-Bilder inklusive Cover als 1:1-Quellen behandeln und sauber in die 9:16-Komposition integrieren
- Animationen: gemeinsame Premium-Bühne, START → MECHANISMUS → ERGEBNIS, ohne Ton verständlich
- Weiß neutral, Grün Fokus/Lösung, Rot Warnung, Gold Geld/Wert; kein Schwarz auf dunkler Fläche
- Fakten und Voiceover nicht stillschweigend umschreiben
- keine anderen Reels verändern
- nicht mergen

## Checks
- `npm run reel:validate -- <Reel-Pfad>`
- `npm run typecheck`
- `npm run build`
- Preview/Frames mobil prüfen
- komplette MP4 mit Ton ansehen
- Animationen zusätzlich ohne Ton auf Verständlichkeit prüfen
- Bildwechsel gegen Audio-Trigger prüfen

## Finalrender und Export
Hochwertige Renderpipeline mit H.264 CRF14, PNG-Zwischenframes, AAC320k und yuv420p verwenden. Audioziel ungefähr -16 LUFS / <= -1 dBTP kontrollieren. Danach `npm run reel:export -- <Reel-Pfad> --video <EXAKTER-FINALER-MP4-PFAD>` verwenden.

## Startprompt
`Mach Phase 3 vollständig für reels/2026-08-24_bis_2026-08-30/samstag/reel-01_euro-oder-landeswaehrung. Halte dich an 05-projektdateien/CLAUDE-CODE-AUFTRAG.md und CLAUDE.md. Stoppe nur bei einem echten reel:ready-Blocker.`
