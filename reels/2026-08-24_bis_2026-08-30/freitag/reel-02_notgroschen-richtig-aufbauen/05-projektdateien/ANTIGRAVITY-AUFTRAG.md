# Antigravity — Phase 3 — bestehendes Reel neu aufbauen

Projekt: reels/2026-08-24_bis_2026-08-30/freitag/reel-02_notgroschen-richtig-aufbauen

## IN-PLACE-LOCK

Dieses Reel existiert bereits und wurde in Phase 1 neu aufgebaut.

- KEIN neues Reel anlegen.
- KEINEN zweiten Reel-Ordner erzeugen.
- KEINE neuen scene-IDs erzeugen.
- Genau diesen bestehenden Pfad weiterverwenden.
- Skript/Aussagen und Reihenfolge der 15 Szenen bleiben erhalten.
- Die aktuellen Dateien unter 03-szenen/EINZELNE-SZENEN/scene-XX/animation.tsx sind die einzige kanonische Animationsquelle.
- Alte Shield-/Karten-/Balken-Ersatzanimationen dürfen nicht rekonstruiert werden.

Vor Phase 3 muss reel:ready erfolgreich sein. Verwende ausschließlich finale Nutzerbilder aus 03-szenen/00-ALLE-BILDER-HIER-REIN/ und exakt die versiegelten Phase-1-animation.tsx. Keine Ersatzanimation. Header Y154, Visual Y320–1400, Caption bottom340. Schwarzer Hintergrund, Header oder Caption allein zählen niemals als Szenenvisual. Fehlt Bild, Audio, Timing, Binding oder Hash: hart abbrechen statt Fallback.

## Verbindliche Endkette

1. Bestehende Composition dieses Reels vollständig implementieren/aktualisieren.
2. Candidate ausschließlich über reel:render erzeugen.
3. Render-QA vollständig ausführen und PASS verlangen.
4. Erst nach PASS final exportieren:

npm run reel:export -- reels/2026-08-24_bis_2026-08-30/freitag/reel-02_notgroschen-richtig-aufbauen <exakte-geprüfte-mp4>

5. Phase 3 ist erst abgeschlossen, wenn 06-export/ vollständig aufgebaut wurde.

## Pflichtinhalt von 06-export

- reel-02_notgroschen-richtig-aufbauen.mp4
- caption-universal.txt
- caption-instagram.txt
- caption-tiktok.txt
- caption-facebook.txt
- caption-snapchat.txt
- untertitel.srt
- Cover-Datei
- bilder.zip
- UPLOAD.md

Die fertige MP4 darf niemals durch eine Candidate-Datei, einen Platzhalter oder eine ungeprüfte Renderdatei ersetzt werden.
