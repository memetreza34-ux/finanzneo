# FinanzNeo — verbindliches Projekt-Gehirn

> Diese Datei ist die höchste interne Quelle für Strategie, Gestaltung und Produktion. Bei Widersprüchen gilt immer diese Datei. `legacy-main/` ist Archiv und niemals Regelquelle.

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
→ Motiv + Text + Gesicht + Hintergrund + Dateiname prüfen
→ erst dann nächstes Bild
```

Nummerierung:

- Cover = `Bild 00`
- Bildnummer = echte Szenennummer
- Animationsszenen behalten ihre Nummer, bekommen aber kein Bild
- Nummernlücken niemals schließen

Für `Bild 00` zusätzlich immer die **exakt vorgegebene Cover-Überschrift** prüfen. Fehlt sie, ist sie falsch geschrieben, abgeschnitten oder schlecht lesbar, wird das Cover in Google Flow neu erzeugt. Remotion darf die Cover-Überschrift nicht nachträglich ergänzen oder reparieren.

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
- optional stilisierte anonyme erwachsene 3D-Person
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

## 8. Text im KI-Bild — Cover und Szenen klar getrennt

### Cover `Bild 00` — Überschrift direkt aus Google Flow

Das Cover ist die **einzige Headline-Ausnahme**.

Verbindlich:

- `Bild 00` enthält **eine große klare deutsche Cover-Überschrift direkt im von Google Flow erzeugten Bild**.
- Die Überschrift sagt konkret, worum es im Reel geht; kein vager allgemeiner Clickbait.
- Im Cover-Prompt steht immer ein eigener Block:

```text
COVER-ÜBERSCHRIFT – EXAKT SO:
[EXAKTE DEUTSCHE ÜBERSCHRIFT]
```

- Ziel: ungefähr 3–8 Wörter, maximal zwei Zeilen.
- Smartphone-lesbar, hochwertig und visuell klar priorisiert.
- Die Überschrift liegt direkt auf demselben nahtlosen Hintergrund; **keine separate Textbox, kein Header-Balken, kein zweiter Hintergrund**.
- Kein zusätzlicher Untertitel, CTA oder erklärender Satz im Cover.
- Schreibweise muss exakt stimmen. Fehlerhafte oder fehlende Cover-Typografie → Cover in Google Flow neu erzeugen.
- **Cover-Überschrift niemals in Remotion ergänzen, ersetzen oder überdecken.**

Kurze Objektlabels sind auf dem Cover nur erlaubt, wenn sie wirklich zusätzlich nötig sind. Die Cover-Überschrift trägt die Hauptaussage.

### Szenenbilder `Bild 01+`

Erlaubt:

- nur explizit gewünschte kurze deutsche Objektlabels
- normalerweise 1–3 Wörter
- direkt am zugehörigen Objekt

Verboten:

- KI-Headline
- Untertitel
- ganzer erklärender Satz
- CTA/Absatz
- zufällige Zusatztexte

**Szenenüberschriften ab Szene 01** und Karaoke-Untertitel werden in Remotion gerendert. Die Cover-Überschrift ist davon ausdrücklich ausgenommen.

## 9. Verbindliche Bilddarstellung in Remotion — full-frame-no-crop

Bildszenen verwenden das vollständige vertikale 9:16-Nutzerbild über die **gesamte 1080×1920-Szene**.

Verbindlich:

- kein mittlerer `VisualStage` oder anderer kleiner Bildcontainer um Nutzerbilder
- kein sichtbares 9:16-Poster innerhalb eines 9:16-Reels
- kein absichtlicher Crop des Nutzerbildes
- keine Zoom-/Focal-Point-Regeln als Standard
- keine unscharfe Kopie desselben Bildes als Hintergrund
- kein sichtbarer rechteckiger Bildrand
- bei Szenen `01+`: Szenenheadline liegt als Overlay über demselben Vollbild
- Untertitel liegt als Overlay über demselben Vollbild
- Cover `Bild 00`: keine zusätzliche Remotion-Headline; die Google-Flow-Cover-Überschrift bleibt unverändert
- für Lesbarkeit nur ein **weicher kontinuierlicher transparenter Scrim/Gradient**; keine harten Header-/Footer-Flächen
- da die Quelle vertikal 9:16 ist, darf `object-fit: contain` ausschließlich auf der **kompletten 1080×1920-Fläche** verwendet werden; `contain` in einem kleineren Mittel-Container ist verboten

Verbindliche Komponente für neue produktive Bildszenen:

```text
src/design-system/FullFrameImage.tsx
```

`AdaptiveSafeFillImage`, `focalX/focalY`, alte Scale-/Crop-Verträge und sichtbare Inset-Panels sind nicht mehr Teil des aktiven Produktionsstandards.

## 10. Verbindliches vertikales Layout

Richtwerte bei 1080 × 1920:

```text
Szenenheadline 01+ top:    ca. 72
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
- Szenenheadline 01+ und Untertitel sind Overlays, keine eigenen Hintergrundzonen.
- Cover-Headline ist Teil von `Bild 00`, nicht Teil des Remotion-Headline-Systems.
- Native Animationen nutzen den mittleren Inhaltsraum, aber ihr Hintergrund läuft nahtlos über die komplette Szene.
- Untertitel niedrig positionieren, aber klar oberhalb der TikTok/Instagram/Facebook/Snapchat-UI-Totzone.
- Rechts zusätzlicher Sicherheitsabstand für vertikale Plattform-Buttons.
- Keine harte schwarze Fläche unter dem Bild und kein separater grüner Header-Balken.

## 11. Untertitel — genau EIN Satz

Verbindlich:

- **genau ein vollständiger Satz gleichzeitig**
- **niemals zwei Sätze gleichzeitig**
- **hart maximal zwei sichtbare Textzeilen**
- Schrift groß genug für Smartphone-Ansicht; nicht auf Mini-Schrift schrumpfen, um zu lange Sätze zu retten
- wenn ein Satz bei sinnvoller Schriftgröße nicht in zwei Zeilen passt, Skript/Satz sinnvoll aufteilen
- aktuelles gesprochenes Wort FinanzNeo-grün
- restliche Wörter weiß
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

## 13. Remotion und Animationen

- 1080 × 1920, 30 fps
- Animationen relativ zur tatsächlichen Audio-/Szenendauer
- keine pauschal gleich langen Szenen
- Bild- und Animationsszenen sollen denselben visuellen Flächenwert haben
- native Remotion-Hintergründe immer vollflächig und nahtlos; kein Boden/Horizont/Studio-Split
- Szenenüberschriften/Icons für Szene 01+ in Remotion
- Cover-Überschrift ausschließlich aus Google Flow, nicht in Remotion
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
2. Pflichtmedien validieren/synchronisieren; Cover zusätzlich auf exakte Google-Flow-Überschrift prüfen
3. echte Audio-Wortzeiten erzeugen
4. Szenenstarts/-dauern aus Audio ableiten
5. Remotion vollständig bauen
6. Bildszenen als `full-frame-no-crop` über 1080×1920 integrieren
7. Szenenheadlines 01+ + genau-ein-Satz-Karaoke-Captions als Overlays einbinden; **keine Remotion-Headline auf dem Cover**
8. **eine universelle Social-Caption mit genau 5 passenden Hashtags erstellen**
9. finalen Reel-Validator ausführen
10. TypeScript prüfen
11. Preview rendern
12. erste/mittlere/letzte Frames jeder Szene + Kontaktbogen + Untertitel/Übergänge prüfen
13. vollständiges MP4 rendern und mit Ton prüfen
14. explizit prüfen: Cover-Headline korrekt, kein zweiter Hintergrund, kein abgeschnittener Footer, kein Bildpanel, kein Caption-Kasten
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
- Cover-Überschrift fehlt/ist falsch geschrieben/abgeschnitten und das Cover muss vom Nutzer in Google Flow neu erzeugt werden
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
- Cover `Bild 00` die exakt vorgegebene, korrekt geschriebene Google-Flow-Überschrift enthält und keine Remotion-Ersatzheadline darüber liegt
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
