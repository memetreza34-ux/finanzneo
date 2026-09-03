# Warum die kleine Kreditkartenrate teuer werden kann

Einfache Struktur:
- 01-script = Voiceover-Skript
- 02-audio = finales Voiceover
- 03-szenen = Cover, V9-Bildprompts, Szenen und Nutzerbilder
- 04-caption = universelle Caption und Wort-Timings
- 05-projektdateien = Recherche, Timeline, Phase-3-Handoff
- 06-export = fertiges Upload-Paket

3 Phasen:
1. Phase 1 erstellt Recherche, Skript, V9-Bildprompts und jede Animation als fertige animation.tsx.
2. Nutzer erstellt Flow-Bilder, finales Audio und echte Wortzeiten.
3. Der konfigurierte Executor integriert exakt diese Assets/Animationen und rendert nur über Preflight + QA.

Reel-Canvas: immer statisch #000000, keine Partikel/Aurora/Grid/Glow-Hintergründe.
V5: Header Y154 / 56 px / max 2 Zeilen, Visual Y320–1400, Caption bottom340.

## Cover- und Export-Automatik
- Szene 01 ist immer eine Bildszene und automatisch das Cover; es gibt keinen separaten Cover-Bildjob.
- Das Flow-Bild selbst enthält keinen Reel-Titel; Remotion rendert den exakten Titel ab Frame 0.
- Nach bestandener Phase-3-Render-QA wird der Export automatisch gestartet.
