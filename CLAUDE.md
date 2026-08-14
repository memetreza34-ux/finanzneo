# FinanzNeo — verbindliches Projekt-Gehirn

> Diese Datei ist die höchste interne Quelle für Strategie, Gestaltung und Produktion. Bei Widersprüchen gilt immer diese Datei. `legacy-main/` ist Archiv und niemals Regelquelle.

## 0. Verbindlicher 3-Phasen-Produktionsablauf

**Phase 1 – Vorbereitung (ChatGPT):**
- ChatGPT recherchiert das Thema, findet aktuelle Fakten und Quellen
- ChatGPT erstellt den finalen Voiceover-Fließtext (geht nach 01-script/)
- ChatGPT erstellt alle Bildprompts für Google Flow (03-szenen/)
- ChatGPT erstellt die Social-Caption-Vorlage (04-caption/)
- ChatGPT erstellt die Szenen-Struktur und den Szenenplan
- Antigravity erstellt den KOMPLETTEN Remotion-Animationscode (src/reels/<name>/) inkl. config.ts, alle Animationskomponenten, KaraokeCaptions.tsx — NOCH OHNE echte Bilder/Audio. Es werden Placeholder/leere asset-manifest.json verwendet.
- Phase 1 endet wenn: Skript fertig, alle Prompts fertig, Remotion-Code komplett gebaut und typchecked

**Phase 2 – Materialerstellung (Nutzer + Google Flow):**
- Der Nutzer erstellt alle Bilder mit Google Flow anhand der fertigen Bildprompts aus Phase 1
- Der Nutzer erstellt das Voiceover-Audio (z.B. mit ElevenLabs)
- Der Nutzer liefert Bilder nach: 03-szenen/00-ALLE-BILDER-HIER-REIN/
- Der Nutzer liefert Audio nach: 02-audio/
- Phase 2 endet wenn: alle Pflichtbilder vorhanden + genau ein finales Audio vorhanden

**Phase 3 – Produktion (Antigravity Autopilot):**
- Antigravity übernimmt vollständig und führt den kompletten Produktionslauf durch (Sektion 16 gilt)
- Echte Whisper-Wortzeiten aus dem finalen Audio erzeugen
- Szenenstarts und -dauern aus Audio ableiten, config.ts aktualisieren
- Bilder integrieren (asset-manifest.json befüllen)
- Validator + TypeScript prüfen
- Preview rendern → Nutzer zeigen
- Vollständiges MP4 rendern
- Phase 3 endet erst wenn PRODUCTION COMPLETE (Sektion 18)

## 1. Kanal und Plattformen

- Kanal: **FinanzNeo**
- Sprache: Deutsch
- Inhalt: verständliche Finanzgrundlagen für Anfänger
- Reel-Plattformen: **TikTok, Instagram Reels, Facebook Reels, Snapchat**
- **Keine YouTube Shorts.**
- YouTube ausschließlich als eigenständiges Longform-Format unter `youtube/`.
- Reels standardmäßig 1080 × 1920, 30 fps, ungefähr 60–90 Sekunden.
- Ansprache: direkt mit `du`, sachlich, verständlich, professionell.

## 2. Repository-Sicherheit

- Nicht direkt auf `main` arbeiten.
- Neues Thema = neuer Branch + neuer Reel-Ordner.
- Bestehende Reels nur ändern, wenn sie ausdrücklich Ziel des Auftrags sind.
- Kein Force-Push, History-Rewrite, Löschen, Merge oder Publishing ohne ausdrückliche Nutzerfreigabe.
- Validatoren, Tests, Finanzberechnungen oder Lockfiles niemals schwächen, nur damit etwas besteht.
- Vor Änderungen Branch/HEAD/Diff prüfen; danach Safety-Audit.

## 3. Einfache Reel-Struktur

```text
01-script/
02-audio/
03-szenen/
04-caption/
05-projektdateien/
README.md
```

- `01-script/` = finaler Voiceover-Fließtext
- `02-audio/` = genau ein finales Nutzer-Voiceover
- `03-szenen/` = Bildwelt, Prompts, Szenen und finaler Nutzerbilder-Sammelordner
- `04-caption/` = genau **eine universelle Social-Caption** + echte Wort-Timings
- `05-projektdateien/` = Recherche, Quellen, Animationen, Timeline, Technik
- `ziel-reel.mp4` = Das finale gerenderte Video liegt im Hauptordner des jeweiligen Reels (nicht im globalen `out/` Ordner).

Keine doppelten Hauptordner für dieselbe Funktion anlegen.

## 4. Harte Nutzer-Mediengrenze

Für einen finalen Reel-Build dürfen Benutzer-Medien ausschließlich aus dem ausdrücklich gewählten Ziel-Reel kommen:

```text
Bilder: <TARGET-REEL>/03-szenen/00-ALLE-BILDER-HIER-REIN/
Audio:  <TARGET-REEL>/02-audio/
```

Verboten als Ersatz:

- Bilder/Audio aus anderen Reels
- `legacy-main/`
- Desktop/Downloads
- Web-/Stock-Medien
- generierte Platzhalter
- alte Exporte
- Cache-Dateien
- ähnlich benannte Dateien außerhalb des Ziel-Reels

Fehlt eine Pflichtdatei, ist sie unlesbar/falsch oder ist das finale Audio nicht eindeutig, lautet der Status **BLOCKED**. Exakten erwarteten Pfad/Dateinamen nennen. Nichts erraten oder ersetzen.

Repo-Code, Remotion-Komponenten, Designsystem und Skripte dürfen selbstverständlich normal verwendet werden; die Grenze betrifft Benutzer-Medien.

## 5. Bildproduktion — ausschließlich Nutzer + Google Flow

Antigravity/Agenten erzeugen keine finalen Bilder.

Google Flow Ablauf:

```text
Prompt lesen
→ GENAU EIN Bild erzeugen
→ sofort endgültig umbenennen
→ Motiv + Labels + Gesicht + Hintergrund + Dateiname prüfen
→ erst dann nächstes Bild
```

Nummerierung:

- Cover = `Bild 00`
- Bildnummer = echte Szenennummer
- Animationsszenen behalten ihre Nummer, bekommen aber kein Bild
- Nummernlücken niemals schließen

Nach vollständiger Bilderstellung kommen alle finalen Bilder gemeinsam nach:

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

## 6. Verbindliche Bildwelt — Premium Fintech Editorial 3D

World ID:

```text
FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
```

Verbindlich:

- Premium fintech editorial 3D render
- eine dominante Finanzmetapher / großes Hero-Objekt
- wenige unterstützende Elemente
- Person NUR wenn sie dem Inhalt hilft. Für abstrakte Themen (Zinsen, Kosten, Daten, Inflation) bevorzugt eine starke Finanzmetapher ohne Person.
- wenn Person: Gesicht klar sichtbar, Augen/Nase/Mund erkennbar, frontal oder natürliche 3/4-Ansicht
- deep charcoal green-black Grundwelt
- vivid emerald/mint Akzente
- Gold nur für Geld/Wert
- warmes Rot-Orange nur für Verlust/Risiko/Schulden
- smooth rounded geometry, soft bevelled edges
- kein Fotorealismus, Pixar oder Clay
- keine Dioramen, Neon-Tunnel, Sci-Fi-Korridore, Game-Level oder Dashboards

Relevante echte Marken/Dienste dürfen als konkrete Beispiele vorkommen, wenn sie korrekt geschrieben sind und keine Partnerschaft suggeriert wird.

## 7. Kritische Hintergrundregel — genau EIN Hintergrund

Jeder Google-Flow-Prompt verlangt einen einzigen nahtlosen Hintergrund von oben bis unten:

```text
Use ONE single seamless continuous deep charcoal green-black background across the entire vertical 9:16 image.
Keep the same continuous material, tone and gradient from top edge to bottom edge.
No horizontal divisions.
No visible top or bottom section.
No separate zones or panels.
No dark/light bands.
No floor-wall boundary.
No horizon line.
No studio wall split.
Do not create a visible floor, wall or studio horizon.
Leave natural empty space by reducing content, never by changing the background.
```

Verboten sind insbesondere Prozent-Zonen wie `15/60/25` oder `18/64/18`.

Native Remotion-Szenen folgen demselben Prinzip: ein durchgehender Hintergrund über die komplette 1080×1920-Fläche, ohne Boden, Horizont, Wand-Split oder sichtbare Studio-Zonen.

## 8. Text im KI-Bild

Erlaubt:

- nur explizit gewünschte kurze deutsche Objektlabels
- normalerweise 1–3 Wörter
- direkt am zugehörigen Objekt

Verboten:

- große Headline
- Untertitel
- ganzer erklärender Satz
- CTA/Absatz
- zufällige Zusatztexte

Headlines und Karaoke-Untertitel werden in Remotion gerendert.

## 9. Verbindliche Bilddarstellung in Remotion

Verbindlich:
- Beide Modi sind zulässig: `full-frame-no-crop` (cinematic, headline+caption overlay) und `fit-between-text` (structured, image between header and caption zone)
- Die Wahl muss für jede Szene explizit in `scene-index.json` getroffen werden
- Keiner der beiden Modi ist der universelle Standard für neue Reels

## 10. Verbindliches vertikales Layout

Richtwerte bei 1080 × 1920:

```text
Headline top:              ca. 72
Bildszene:                 Y 0–1920 vollständig
Animationsinhalt start:    ca. 220
Animationsinhalt end:      ca. 1490
Subtitle bottom:           ca. 300
Subtitle left:             ca. 64
Subtitle right:            ca. 156
Platform UI unten:         mindestens ca. 260 px Sicherheitszone
```

Prinzipien:

- **Bildszenen besitzen keinen separaten mittleren Visualbereich.** Das Nutzerbild ist die komplette Szenenfläche.
- Headline und Untertitel sind Overlays, keine eigenen Hintergrundzonen.
- Native Animationen nutzen den mittleren Inhaltsraum, aber ihr Hintergrund läuft nahtlos über die komplette Szene.
- Untertitel niedrig positionieren, aber klar oberhalb der TikTok/Instagram/Facebook/Snapchat-UI-Totzone.
- Rechts zusätzlicher Sicherheitsabstand für vertikale Plattform-Buttons.
- Keine harte schwarze Fläche unter dem Bild und kein separater grüner Header-Balken.

## 11. Untertitel — streng limitiert (V17 Standard)

Verbindlich:

- **genau eine kurze Einheit gleichzeitig**
- **maximal 12 Wörter** pro Untertitel-Block
- **maximal 68 Zeichen** pro Untertitel-Block
- **hart maximal zwei sichtbare Textzeilen**
- **mindestens 42 px Schriftgröße** für Smartphone-Ansicht (kein Schrumpfen!)
- neue Safe-Area: **ungefähr Bottom 320 / Left 72 / Right 180**
- Natürliche Sprachpausen werden zwingend zum Teilen langer Sätze verwendet, um die Wort- und Zeichenlimits einzuhalten.
- aktuelles gesprochenes Wort FinanzNeo-grün, restliche Wörter weiß
- Satz bleibt während kurzer Sprachpause stehen
- Satzwechsel exakt beim ersten gesprochenen Wort des nächsten Satzes
- keine Caption-Lücken
- keine springenden Wörter oder Größenanimation
- **keine undurchsichtige/schwarze Caption-Karte**; Lesbarkeit durch Textschatten + kontinuierlichen Szenen-Scrim

Verbindliche generische Komponente:

```text
src/design-system/SentenceKaraokeCaptions.tsx
```

## 12. Timing — ausschließlich echtes finales Audio

Wortzeiten dürfen niemals mathematisch gleichmäßig über einen Satz verteilt oder geschätzt werden.

Kette:

```text
finales Voiceover aus 02-audio
→ echte start/end-Zeitstempel jedes gesprochenen Wortes
→ Satzgrenzen
→ Szenenstarts an Satzanfängen
→ Remotion-Timing
```

`04-caption/word-timings.json` ist erst final, wenn:

```text
timingStatus = final-audio-aligned
```

Wenn keine echte Wortausrichtung aus dem finalen Audio erzeugt werden kann: **BLOCKED**, nicht schätzen.

## 13. Remotion und Animationen (60/40 Regel)

- **60% Remotion / 40% Bilder ist das Ziel, erlaubt 50-70%. Qualität über Quote: dynamische Information → Animation; starke statische Finanzmetapher → Bild**. Bei 10 Szenen: standardmäßig 6 Animationen + 4 Bilder.
- **Verboten als Animation**: einzelnes Icon, Zahl mit Zoom, statischer Balken mit Fade, Karte, Emoji als Hauptvisual. Jede Animation braucht sichtbaren Mechanismus: Start → Handlung → Ergebnis
- **Animation-first**: Zinseszins, Rechnungen, Vergleiche, Zeitachsen, Geldflüsse, Wachstum und Mechanismen werden standardmäßig mit Remotion gebaut (nicht als beliebiges statisches Bild).
- **Maximal eine Bildszene hintereinander** und normalerweise höchstens 8 Sekunden pro statischem Bild.
- 1080 × 1920, 30 fps
- Animationen relativ zur tatsächlichen Audio-/Szenendauer
- keine pauschal gleich langen Szenen
- Bild- und Animationsszenen sollen denselben visuellen Flächenwert haben
- native Remotion-Hintergründe immer vollflächig und nahtlos; kein Boden/Horizont/Studio-Split
- Überschriften/Icons in Remotion
- Zahlen/Fakten nur aus geprüften Quellen oder reproduzierbaren Berechnungen

## 14. Fakten und Finanzdaten

- keine erfundenen Zahlen
- aktuelle Fakten recherchieren
- Quelle und Stand festhalten
- Beispielannahmen als Beispiel markieren
- Rendite nie als sicher darstellen
- keine individuelle Anlageberatung
- Geldbeträge standardmäßig Euro

## 15. Publishing — genau EINE Caption für alle Reel-Plattformen

Direkt in `04-caption/` liegen nur:

```text
caption.txt
word-timings.json
```

`caption.txt` ist die **eine einzige fertige Social-Caption**, die unverändert für TikTok, Instagram Reels, Facebook Reels und Snapchat verwendet wird.

Verbindlicher Caption-Standard:

- keine separaten plattformspezifischen Caption-Dateien
- keine Varianten derselben Caption
- sofort kopierfertiger Text, keine Überschrift wie `CAPTION:` im finalen Inhalt
- erste Zeile = starker, ehrlicher Hook mit klarer Neugier oder relevantem Problem
- danach kurze Kernaussage/Aha-Nutzen des Reels
- kurzer natürlicher Save-/Follow-/Kommentar-CTA nur wenn passend
- **genau 5 Hashtags**
- alle 5 Hashtags müssen konkret zum Reel-Thema passen
- keine zufälligen Trend-Tags und kein irreführendes `#fyp`-Spam
- keine Behauptung wie „garantiert viral“; Ziel ist eine möglichst starke, teilbare, speicherbare Caption
- Fakten müssen mit Skript/Recherche übereinstimmen
- Quellen bleiben in `05-projektdateien/recherche-quellen.md`; die Caption soll nicht unnötig mit Quellenblöcken überladen werden
- `Keine Anlageberatung` nur ergänzen, wenn für die konkrete Aussage sinnvoll/notwendig

Verbotene alte Dateien in aktiven neuen Reels:

```text
instagram-reels.txt
tiktok.txt
facebook-reels.txt
snapchat.txt
youtube-shorts.txt
```

YouTube wird nicht automatisch gespiegelt; YouTube bleibt separater Longform-Bereich.

## 16. Finaler Produktionslauf / Antigravity Autopilot

Wenn alle Pflichtbilder + genau ein finales Audio vorhanden sind und der Nutzer `Mach das Reel`, `Erstelle das Reel`, `Mach es fertig` oder gleichwertig sagt, ist das ein zusammenhängender Produktionsauftrag.

Ohne `weiter?` durchlaufen:

1. Ziel-Reel und harte Mediengrenze prüfen
2. Pflichtmedien validieren/synchronisieren
3. echte Audio-Wortzeiten erzeugen
4. Szenenstarts/-dauern aus Audio ableiten
5. Remotion vollständig bauen
6. Bildszenen als `full-frame-no-crop` über 1080×1920 integrieren
7. Headline + genau-ein-Satz-Karaoke-Captions als Overlays einbinden
8. **eine universelle Social-Caption mit genau 5 passenden Hashtags erstellen**
9. finalen Reel-Validator ausführen
10. TypeScript prüfen
11. Preview rendern
12. erste/mittlere/letzte Frames jeder Szene + Kontaktbogen + Untertitel/Übergänge prüfen
13. vollständiges MP4 rendern und mit Ton prüfen
14. explizit prüfen: kein zweiter Hintergrund, kein abgeschnittener Footer, kein Bildpanel, kein Caption-Kasten
15. Audioziel prüfen, wenn Tooling vorhanden
16. behebbare Fehler selbst reparieren und Schleife wiederholen
17. Safety Audit
18. Commit + Draft-PR, wenn angemessen

Finale Validierung verwendet:

```bash
npm run reel:validate -- <TARGET-REEL> --final
```

Normale Validator-/TypeScript-/Renderfehler sind keine Nutzer-Checkpoints: selbst beheben und weiterarbeiten.

## 17. Wann wirklich gestoppt wird

Nur bei echten Blockern:

- Pflichtbild fehlt/ist falsch/unlesbar
- genau ein finales Audio fehlt oder ist mehrdeutig
- Bild muss vom Nutzer neu generiert werden
- echte Audio-Wortausrichtung technisch nicht möglich
- externer Credential/Quota/Permission-Blocker ohne sicheren Workaround
- nächste Aktion wäre Merge/Publish/Delete/Force-Push/History-Rewrite ohne Freigabe
- materielle inhaltliche Unklarheit, die nicht aus Reel-Dateien lösbar ist

Dann ausschließlich:

```text
BLOCKED
Fehlt/Problem: <exakter Pfad oder exakte Ursache>
Aktion: <genau eine erforderliche Nutzeraktion>
```

Kein generisches `Weiter?`.

## 18. Fertig-Definition

**PRODUCTION COMPLETE** erst wenn:

- alle Pflichtmedien aus dem Ziel-Reel verwendet wurden
- echte final-audio-basierte Wortzeiten vorliegen
- jedes Bild als vollständiges Full-Frame-9:16-Bild ohne absichtlichen Crop geprüft wurde
- kein sichtbarer zweiter Hintergrund/Header/Footer-/Inset-Bereich vorhanden ist
- genau ein Untertitelsatz gleichzeitig sichtbar ist und maximal zwei Zeilen nutzt
- Untertitelposition/Safe-Areas geprüft wurden
- keine undurchsichtige Caption-Karte vorhanden ist
- die eine universelle Social-Caption fertig ist und genau 5 passende Hashtags enthält
- Validator + TypeScript + Preview tatsächlich erfolgreich waren
- vollständiges MP4 gerendert und geprüft wurde
- behebbare Fehler beseitigt wurden
- Safety Audit erfolgt ist

Technischer Erfolg ist keine Publishing-Freigabe. Merge/Upload bleiben separate Nutzerentscheidungen.
