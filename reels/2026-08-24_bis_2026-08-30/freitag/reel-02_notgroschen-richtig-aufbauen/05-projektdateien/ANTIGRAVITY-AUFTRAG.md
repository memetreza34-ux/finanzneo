# Antigravity — Phase 3

Projekt: reels/2026-08-24_bis_2026-08-30/freitag/reel-02_notgroschen-richtig-aufbauen

Vor Phase 3 muss `reel:ready` erfolgreich sein. Verwende ausschließlich finale Nutzerbilder und exakt die versiegelten Phase-1-`animation.tsx`. Keine Ersatzanimation. Header Y154, Visual Y320–1400, Caption bottom340. Schwarzer Hintergrund, Header oder Caption allein zählen niemals als Szenenvisual. Fehlt Bild, Audio, Timing, Binding oder Hash: hart abbrechen statt Fallback.

## Verbindliche Endkette

1. Finale Composition vollständig implementieren.
2. Candidate ausschließlich über `reel:render` erzeugen.
3. Render-QA vollständig ausführen und PASS verlangen.
4. Erst nach PASS den finalen Export ausführen:

`npm run reel:export -- reels/2026-08-24_bis_2026-08-30/freitag/reel-02_notgroschen-richtig-aufbauen <exakte-geprüfte-mp4>`

5. Phase 3 ist **erst abgeschlossen**, wenn `06-export/` vollständig aufgebaut wurde.

## Pflichtinhalt von 06-export

- `reel-02_notgroschen-richtig-aufbauen.mp4` — fertiges, per Render-QA geprüftes Reel
- `caption-universal.txt`
- `caption-instagram.txt`
- `caption-tiktok.txt`
- `caption-facebook.txt`
- `caption-snapchat.txt`
- `untertitel.srt`
- Cover-Datei
- `bilder.zip`
- `UPLOAD.md`

Die fertige MP4 darf niemals durch eine Candidate-Datei, einen Platzhalter oder eine ungeprüfte Renderdatei ersetzt werden. Das Reel gilt nur dann als final fertig, wenn die geprüfte MP4 zusammen mit allen Plattform-Captions im Exportordner liegt.
