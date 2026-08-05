#!/usr/bin/env node

// Der frühere Generator hat Wörter nur rechnerisch über die Audiodauer verteilt.
// Ab jetzt führt derselbe npm-Befehl die vollständige Audio-Pipeline aus:
// 1. Stimme pitch-erhaltend beschleunigen,
// 2. lokal mit Whisper.cpp transkribieren,
// 3. echte Wort-Zeitstempel erzeugen,
// 4. Szenen an den gesprochenen Abschnitten ausrichten.
await import('./sync-finance-reel-to-voiceover.mjs');
