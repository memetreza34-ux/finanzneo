# Antigravity — Phase 3 — bestehendes Reel neu aufbauen

Projekt: `reels/2026-08-24_bis_2026-08-30/freitag/reel-02_notgroschen-richtig-aufbauen`

## IN-PLACE-LOCK

Dieses Reel existiert bereits und wurde in Phase 1 neu aufgebaut.

- KEIN neues Reel anlegen.
- KEINEN zweiten Reel-Ordner erzeugen.
- KEINE neuen scene-IDs erzeugen.
- Genau diesen bestehenden Pfad weiterverwenden.
- Skript/Aussagen und Reihenfolge der 15 Szenen bleiben erhalten.
- Die aktuellen Dateien unter `03-szenen/EINZELNE-SZENEN/scene-XX/animation.tsx` sind die einzige kanonische Animationsquelle.
- Alte Shield-/Karten-/Balken-Ersatzanimationen dürfen nicht rekonstruiert werden.

Vor Phase 3 muss `reel:ready` erfolgreich sein. Verwende ausschließlich finale Nutzerbilder aus `03-szenen/00-ALLE-BILDER-HIER-REIN/` und exakt die versiegelten Phase-1-`animation.tsx`. Keine Ersatzanimation. Header Y154, Visual Y320–1400, Caption bottom340. Schwarzer Hintergrund, Header oder Caption allein zählen niemals als Szenenvisual. Fehlt Bild, Audio, Timing, Binding oder Hash: hart abbrechen statt Fallback.

## FinanzNeo Professional Motion Stack

Workspace-Plugin:

```text
.agents/plugins/finanzneo-motion/
```

Der PreInvocation-Hook bootstrapped bei Bedarf die offiziellen Remotion Agent Skills und den ElevenLabs `sound-effects` Agent Skill. Manuell prüf-/installierbar über:

```bash
npm run antigravity:motion:bootstrap
```

Verbindliche Projekt-Skills/-Regeln:

- `remotion-director` — cinematische Realwelt-Mechanik, mehrere Motion-Channels, kontrollierte Tiefe/Kamera
- `lottie-motion` — Lottie Creator MCP nur als gezielte Support-Ebene
- `sound-design` — subtile framegenaue SFX, Voiceover bleibt dominant
- `playwright-visual-qa` — visuelle Remotion-Studio-Prüfung von Headern, Icons, Safe-Zones, Spacing und repräsentativen Animationszuständen

Generische Agent-Skills sind beratend. `CLAUDE.md`, `scene-index.json`, die kanonische `animation.tsx` und FinanzNeo-Regeln haben Vorrang.

## Lottie Creator MCP

Der konfigurierte `lottiefiles-creator` MCP ist ein kontrolliertes Motion-Authoring-Werkzeug.

Für DIESES Reel nach dem Animation-Seal gilt in Phase 3:

- keine neue Lottie-Idee erfinden;
- keine kanonische `animation.tsx` durch eine Lottie-Vorlage ersetzen;
- keine generische Icon-/Card-Animation als Ersatz bauen;
- bereits committed und versiegelte Lottie-Assets dürfen exakt integriert werden, wenn die kanonische Animation sie referenziert;
- benötigt eine Szene nachträglich ein neues Lottie-Asset oder eine neue Mechanik, zurück zu Phase-1-Motion-Authoring statt stiller Phase-3-Änderung.

Für zukünftige Reels kann Lottie **vor dem Animation-Seal** als unterstützende Ebene genutzt werden, insbesondere für Kalender-Flips, Geldfluss-Akzente, Check-/Warning-Motion, Chart-Strokes, Icon-Acting und andere kompakte 2D/2.5D-Bewegungen. Reale Hauptmechaniken bleiben in Remotion/Three/HTML, wenn sie dort verständlicher sind.

Lottie-Audio ist nicht erlaubt.

## Sound Design — Pflichtprüfung

Verbindlicher Cue-Plan dieses Reels:

```text
05-projektdateien/sound-design.md
```

Der Plan ist framegenau auf die sechs kanonischen Animationen abgestimmt.

Vor finalem Render:

1. Cue-Plan gegen die aktuellen `animation.tsx` prüfen.
2. Nur die dort freigegebenen SFX verwenden/generieren.
3. Wenn lokal `ELEVENLABS_API_KEY` vorhanden ist, darf der installierte ElevenLabs `sound-effects` Skill fehlende freigegebene SFX erzeugen.
4. Niemals API-Key oder `.env` committen.
5. Finale SFX ausschließlich lokal unter `public/sounds/` ablegen.
6. Keine Remote-Sound-URLs und keine Runtime-Generierung im finalen Render.
7. Keine Placeholder-Beeps bei fehlenden Sounds.
8. Voiceover bleibt klar dominant; optionale Cues entfernen, wenn der Mix zu voll wird.
9. SFX exakt an sichtbare Motion-Events binden, nicht bloß an gesprochene Wörter.

Fehlt ein als erforderlich markierter SFX-Asset: melden und stoppen statt durch minderwertigen Ersatz zu kaschieren.

## Playwright Visual QA — Pflichtprüfung

Verbindlicher Plan:

```text
05-projektdateien/visual-qa.md
```

Standardweg ist die offizielle Playwright CLI, nicht Playwright MCP:

```bash
npm run studio -- --port=3000
npx -y @playwright/cli@latest open http://127.0.0.1:3000 --browser=chrome
```

Danach die exakte Produktions-Composition auswählen und den QA-Plan abarbeiten.

Pflicht:

1. Jede der 9 Bildszenen mindestens auf einem stabilen Frame visuell prüfen.
2. Jede der 6 Animationsszenen auf START, TRIGGER, MID-MECHANISM, NEAR RESULT und FINAL RESULT HOLD prüfen.
3. Zweizeilige Header von scene-07 und scene-13 direkt vergleichen.
4. Icon-Größe, Icon-zu-Text-Abstand, Zentrierung und vertikale Position über mehrere Szenen vergleichen.
5. Sichtbar kontrollieren, dass kein wichtiges Objekt Y320–1400 verlässt oder Caption/Header kollidiert.
6. Zu kleine Hauptanimationen, übermäßigen Leerraum, Clipping und unbalancierte Objektabstände als echten QA-Fehler behandeln.
7. Bei Fehlern die kanonische Source korrigieren und genau die betroffenen Frames erneut prüfen.
8. Temporäre `.playwright-cli/`-Daten, Screenshots und Traces nicht als Produktionsassets committen.

Vor finaler Freigabe muss der Plan mit folgendem Ergebnis abgeschlossen sein:

```text
PLAYWRIGHT_VISUAL_QA=PASS
```

Ein grüner TypeScript-/Smoke-Test ersetzt diesen visuellen PASS nicht.

## Motion-QA

Bei allen sechs Animationsszenen zusätzlich prüfen:

- reale Hauptaktion ist groß genug und sofort erkennbar;
- mehrere Motion-Channels reagieren koordiniert, nicht identisch;
- keine Szene kippt zurück in „3 Kästen + Pfeil + Balken“;
- Kamera/Parallax ist nur Support und nicht die Hauptanimation;
- Lottie bleibt Support und erzeugt keine generische Stock-Motion-Sprache;
- Resultat bleibt lange genug stabil;
- Header/Icon und Visual bleiben während der kompletten Bewegung korrekt zentriert und in ihrer Safe-Zone;
- SFX feuert exakt auf den sichtbaren Event-Frame.

## Verbindliche Endkette

1. Bestehende Composition dieses Reels vollständig implementieren/aktualisieren.
2. Alle finalen Bilder, Voiceover, Worttimings und freigegebenen erforderlichen SFX lokal vorhanden.
3. `reel:phase3:preflight` muss PASS liefern.
4. Playwright Visual QA vollständig nach `05-projektdateien/visual-qa.md` ausführen und `PLAYWRIGHT_VISUAL_QA=PASS` verlangen.
5. Candidate ausschließlich über `reel:render` erzeugen.
6. Render-QA vollständig mit **Bild und Audio** ausführen und PASS verlangen.
7. Nach PASS übernimmt der validierte Render-Workflow den finalen Export nach `06-export/`.
8. Phase 3 ist erst abgeschlossen, wenn `06-export/` vollständig aufgebaut wurde.

Ein direkter `reel:export`-Aufruf ist nur für einen kontrollierten Re-Export einer bereits geprüften finalen MP4 gedacht.

## Pflichtinhalt von 06-export

- `reel-02_notgroschen-richtig-aufbauen.mp4`
- `caption-universal.txt` — **die einzige Caption für alle Reel-Plattformen**
- `untertitel.srt`
- Cover-Datei = exakt scene-01
- `bilder.zip`
- `UPLOAD.md`

Es werden keine separaten Instagram-/TikTok-/Facebook-/Snapchat-Captiondateien erzeugt.

Die fertige MP4 darf niemals durch eine Candidate-Datei, einen Platzhalter oder eine ungeprüfte Renderdatei ersetzt werden.
