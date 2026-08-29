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

## FinanzNeo Motion Plugin / Lottie Creator MCP

Workspace-Plugin:

```text
.agents/plugins/finanzneo-motion/
```

Der dort konfigurierte `lottiefiles-creator` MCP ist ein kontrolliertes Motion-Authoring-Werkzeug.

Für DIESES bereits versiegelte Reel gilt in Phase 3:

- keine neue Lottie-Idee erfinden;
- keine kanonische `animation.tsx` durch eine Lottie-Vorlage ersetzen;
- keine generische Icon-/Card-Animation als Ersatz bauen;
- bereits committed und versiegelte Lottie-Assets dürfen exakt integriert werden, wenn die kanonische Animation sie referenziert;
- benötigt eine Szene nachträglich ein neues Lottie-Asset, zurück zu Phase-1-Motion-Authoring statt stiller Phase-3-Änderung.

Für zukünftige Reels kann Lottie **vor dem Animation-Seal** als unterstützende Ebene genutzt werden, insbesondere für Icon-Motion, Kalender-Flips, Geldfluss-Akzente, Check-/Warning-Motion, Chart-Strokes und andere kompakte 2D/2.5D-Bewegungen. Reale Hauptmechaniken bleiben in Remotion/Three/HTML, wenn sie dort verständlicher sind.

Lottie-Audio ist nicht erlaubt. Sounds werden separat in Remotion zeitgenau an die Bewegung gekoppelt.

## Verbindliche Endkette

1. Bestehende Composition dieses Reels vollständig implementieren/aktualisieren.
2. Candidate ausschließlich über reel:render erzeugen.
3. Render-QA vollständig ausführen und PASS verlangen.
4. Erst nach PASS final exportieren:

```bash
npm run reel:export -- reels/2026-08-24_bis_2026-08-30/freitag/reel-02_notgroschen-richtig-aufbauen <exakte-geprüfte-mp4>
```

5. Phase 3 ist erst abgeschlossen, wenn 06-export/ vollständig aufgebaut wurde.

## Pflichtinhalt von 06-export

- reel-02_notgroschen-richtig-aufbauen.mp4
- caption-universal.txt — **die einzige Caption für alle Reel-Plattformen**
- untertitel.srt
- Cover-Datei = exakt scene-01
- bilder.zip
- UPLOAD.md

Es werden keine separaten Instagram-/TikTok-/Facebook-/Snapchat-Captiondateien erzeugt.

Die fertige MP4 darf niemals durch eine Candidate-Datei, einen Platzhalter oder eine ungeprüfte Renderdatei ersetzt werden.
