# FinanzNeo — verbindliches Projekt-Gehirn

> Diese Datei ist die höchste interne Quelle für Strategie, Gestaltung und Produktion. Bei Widersprüchen gilt immer diese Datei. `legacy-main/` ist Archiv und niemals Regelquelle.

## 1. Kanal und Formate

- Kanal: **FinanzNeo**
- Sprache: Deutsch
- Inhalt: verständliche Finanzgrundlagen für Anfänger
- Reel-Plattformen: TikTok, Instagram Reels, Facebook Reels, Snapchat
- **Keine YouTube Shorts.**
- YouTube ausschließlich als eigenständiges Longform-Format unter `youtube/`.
- Reels: 1080 × 1920, 30 fps, normalerweise ungefähr 60–90 Sekunden.
- Ansprache: direkt mit `du`, sachlich, verständlich, professionell.

## 2. Repository-Sicherheit

- Nicht direkt auf `main` arbeiten.
- Neues Thema = neuer Branch + neuer Reel-Ordner.
- Bestehende Reels nur ändern, wenn sie ausdrücklich Ziel des Auftrags sind.
- Kein Force-Push, History-Rewrite, Löschen, Merge oder Publishing ohne ausdrückliche Nutzerfreigabe.
- Validatoren, Tests und Finanzberechnungen niemals schwächen, nur damit etwas besteht.

## 3. Reel-Struktur

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
- `03-szenen/` = Bildwelt, Prompts, Szenen, finaler Bilder-Sammelordner
- `04-caption/` = eine universelle Social-Caption + echte Wort-Timings
- `05-projektdateien/` = Recherche, Animationen, Timeline, Technik, Final-QA

## 4. Harte Nutzer-Mediengrenze

Finale Benutzer-Medien ausschließlich aus:

```text
Bilder: <TARGET-REEL>/03-szenen/00-ALLE-BILDER-HIER-REIN/
Audio:  <TARGET-REEL>/02-audio/
```

Verboten als Ersatz:

- Medien aus anderen Reels
- `legacy-main/`
- Desktop/Downloads
- Web-/Stock-Medien
- Platzhalter
- alte Exporte
- Cache-Dateien
- ähnlich benannte Dateien außerhalb des Ziel-Reels

Fehlt eine Pflichtdatei, ist sie falsch/unlesbar oder ist das finale Audio nicht eindeutig → **BLOCKED** mit exaktem Pfad. Nichts erraten oder ersetzen.

## 5. Bildproduktion — ausschließlich Nutzer + Google Flow

Antigravity/Agenten erzeugen keine finalen Bilder.

Ablauf:

```text
Prompt lesen
→ genau EIN Bild erzeugen
→ sofort endgültig umbenennen
→ Motiv + Text + Gesicht + Hintergrund + Dateiname prüfen
→ erst dann nächstes Bild
```

Nummerierung:

- Cover = `Bild 00`
- Bildnummer = echte Szenennummer
- Animationsszenen behalten ihre Nummer, bekommen aber kein Bild
- Nummernlücken niemals schließen

Alle fertigen Nutzerbilder gemeinsam nach:

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

## 6. Verbindlicher Visual-Mix — animation-first

Für neue Reels gilt:

```text
Ziel: 60 % native Remotion-Animation
      40 % Google-Flow-Bildszenen

Finale Laufzeit:
Animation 55–65 %
Bilder    35–45 %
```

Bei 10 Szenen standardmäßig:

```text
6 Remotion-Szenen
4 Bildszenen
```

Zusätzlich:

- höchstens eine Bildszene direkt hintereinander
- statische Bildszene normalerweise maximal 8 Sekunden
- kein langer statischer Schluss-Tail
- Laufzeitquote ist wichtiger als nur die Szenenanzahl

**Remotion ist Standard** für dynamische Information:

- Vergleich / Vorher-Nachher
- Zahlen, Prozentwerte, Rechnungen
- Zeitachsen / Entwicklung über Zeit
- Wachstum / Zinseszins
- Geldflüsse
- Schrittfolgen
- Mechanismen
- Ursache → Wirkung mit sichtbarer Veränderung
- Risiko-/Realitätscheck
- Diagramme/Balken/Kurven

**Google-Flow-Bilder** bevorzugt für:

- Hook
- konkrete Alltagssituation
- starke einzelne Metapher
- räumlich sofort verständliches Problem
- Abschlussbild / Schlussmetapher

Ein Bild darf nicht nur gewählt werden, weil es einfacher zu produzieren ist.

Für neue V17-Reels ist `docs/REEL-QUALITY-CONTRACT-V2.md` verbindlich.

## 7. Bild-QA vor Remotion

Jedes Nutzerbild wird vor dem Einbau einzeln gegen den gesprochenen Beat geprüft:

- Motiv passt exakt zur Aussage
- Hauptaussage innerhalb ungefähr einer Sekunde verständlich
- keine zufälligen/falschen Wörter
- nur erlaubte Labels
- Zahlen stimmen mit Skript/Recherche überein
- keine widersprüchliche Zusatzinformation
- keine unnötige Dreifach-Wiederholung aus Bildlabel + Headline + Caption

Wenn das Bild neu generiert werden muss → **BLOCKED**. Antigravity erzeugt keinen Ersatz und kaschiert den Fehler nicht mit Remotion.

## 8. Bildwelt

World ID:

```text
FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
```

Verbindlich:

- Premium fintech editorial 3D
- eine dominante Finanzmetapher / großes Hero-Objekt
- wenige unterstützende Elemente
- optional stilisierte anonyme erwachsene 3D-Person
- wenn Person: Gesicht klar sichtbar, Augen/Nase/Mund erkennbar
- deep charcoal green-black
- vivid emerald/mint Akzente
- Gold nur für Geld/Wert
- warmes Rot-Orange nur für Verlust/Risiko/Schulden
- smooth rounded geometry, soft bevelled edges
- kein Fotorealismus, Pixar, Clay, Diorama, Neon-Tunnel, Sci-Fi-Korridor, Game-Level oder Dashboard

## 9. Genau EIN Hintergrund

Jeder Google-Flow-Prompt verlangt einen einzigen nahtlosen Hintergrund von oben bis unten.

Verboten:

- Prozent-Zonen
- horizontale Bänder
- separate obere/untere Fläche
- Floor-Wall-Grenze
- Horizont
- Studio-Wand-Split
- Panel-Hintergrund

Native Remotion-Szenen folgen demselben Prinzip: ein durchgehender Full-Canvas-Hintergrund ohne Boden/Horizont/Studio-Split.

## 10. Cover `Bild 00`

Das Cover ist die einzige generierte Headline-Ausnahme.

Verbindlich:

- große klare deutsche Überschrift direkt im Google-Flow-Bild
- Überschrift sagt konkret, worum es im Reel geht
- im Prompt exakt unter:

```text
COVER-ÜBERSCHRIFT – EXAKT SO:
[EXAKTE DEUTSCHE ÜBERSCHRIFT]
```

- ungefähr 3–8 Wörter
- maximal zwei Zeilen
- keine separate Textbox / kein Header-Balken / kein zweiter Hintergrund
- kein zusätzlicher Subtitle, CTA oder erklärender Satz
- falsche/fehlende/abgeschnittene Typografie → Cover neu erzeugen
- **Remotion darf die Cover-Überschrift niemals ergänzen, ersetzen oder reparieren**

## 11. Szenenbilder `Bild 01+`

Erlaubt:

- nur explizit gewünschte kurze deutsche Objektlabels
- normalerweise 1–3 Wörter
- direkt beim zugehörigen Objekt

Verboten:

- KI-Headline
- KI-Untertitel
- erklärender Satz
- CTA
- zufälliger Zusatztext

Szenenüberschriften ab Szene 01 werden in Remotion gerendert.

## 12. Bilddarstellung — full-frame-no-crop

Bildszenen verwenden das vollständige vertikale 9:16-Nutzerbild über die gesamte 1080×1920-Szene.

Verbindlich:

- kein kleiner mittlerer `VisualStage`
- kein sichtbares Poster/Inlay
- kein absichtlicher Crop/Focal-Zoom-Vertrag
- keine unscharfe Bildkopie als Hintergrund
- Szene 01+: Headline + Caption als Overlay über demselben Vollbild
- Cover: keine zusätzliche Remotion-Headline
- nur weicher transparenter Lesbarkeits-Scrim
- keine harten Header-/Footer-Flächen

Produktive Komponente:

```text
src/design-system/FullFrameImage.tsx
```

## 13. Untertitel — eine kurze Caption-Einheit gleichzeitig

Zu jedem Zeitpunkt ist genau **eine** Caption-Einheit sichtbar. Niemals zwei Einheiten gleichzeitig.

Bevorzugt ist ein kurzer vollständiger gesprochener Satz. Ist ein gesprochener Satz zu lang, wird er an einer natürlichen Bedeutungs-/Pausengrenze in mehrere **nacheinander** gezeigte Einheiten geteilt. Das Audio bleibt unverändert.

Für neue V17-Reels:

```text
max. 12 Wörter pro Caption-Einheit
max. 68 Zeichen pro Caption-Einheit
max. 2 sichtbare Zeilen
min. 42 px effektive Schriftgröße
subtitleBottom ≈ 320
subtitleLeft   ≈ 72
subtitleRight  ≈ 180
```

Verbindlich:

- kein horizontaler Überlauf
- kein Abschneiden am Rand
- keine Mini-Schrift als Rettung
- aktuelles gesprochenes Wort grün
- restliche Wörter weiß
- aktive Wortfarbe exakt während echter Wort-start/end-Zeit
- kurze Sprachpause: aktuelle Einheit halten
- Wechsel beim ersten gesprochenen Wort der nächsten Einheit
- keine schwarze/undurchsichtige Caption-Karte

Produktive Komponente:

```text
src/design-system/SentenceKaraokeCaptions.tsx
```

## 14. Timing — ausschließlich finales Audio

Wortzeiten niemals mathematisch gleichmäßig verteilen oder schätzen.

Verbindliche Kette:

```text
finales Voiceover aus 02-audio
→ echte Wort-start/end-Zeitstempel
→ kurze Caption-Einheiten
→ Szenenstarts/-enden
→ Animationsdauer
→ finaler Render
```

Finale `word-timings.json`:

```text
timingStatus = final-audio-aligned
```

Finale `timeline.json`:

- jede Szene mit echtem `startFrame`
- jede Szene mit `durationFrames > 0`
- chronologisch und praktisch lückenlos
- kein ungelöster 0-Frame-Platzhalter
- Reel-Ende nicht unbegründet mehr als ungefähr eine Sekunde hinter letztem gesprochenen Inhalt

Kann echte Audio-Ausrichtung nicht erzeugt werden → **BLOCKED**.

## 15. Remotion

- 1080 × 1920, 30 fps
- Animationen relativ zur tatsächlichen Audio-/Szenendauer
- keine pauschal gleich langen Szenen
- Zahlen/Fakten nur aus geprüften Quellen oder reproduzierbaren Berechnungen
- Bild- und Animationsszenen visuell gleich hochwertig
- Bewegung muss Erklärfunktion haben, nicht nur Dekoration sein

## 16. Fakten und Finanzdaten

- keine erfundenen Zahlen
- aktuelle Fakten recherchieren
- Quelle und Stand festhalten
- Beispielannahmen als Beispiel markieren
- Rendite nie als sicher darstellen
- keine individuelle Anlageberatung
- Geldbeträge standardmäßig Euro

## 17. Publishing — genau eine Caption

`04-caption/` enthält nur:

```text
caption.txt
word-timings.json
```

`caption.txt` wird unverändert für TikTok, Instagram Reels, Facebook Reels und Snapchat verwendet.

Verbindlich:

- starke ehrliche Hook-Zeile
- kurzer Nutzen/Aha
- natürlicher CTA nur wenn passend
- **genau 5 relevante Hashtags**
- keine Plattformvarianten
- kein Hashtag-Spam / kein irrelevantes `#fyp`
- keine Viralitätsgarantie
- Fakten müssen mit Skript/Recherche übereinstimmen

## 18. Autopilot

Wenn Pflichtbilder + genau ein finales Audio vorhanden sind und der Nutzer `Mach das Reel`, `Erstelle das Reel`, `Mach es fertig` oder gleichwertig sagt:

- kein `Weiter?`
- kontinuierlich bis `PRODUCTION COMPLETE` oder echtem `BLOCKED`
- behebbare Fehler selbst korrigieren, erneut validieren/rendern
- kein Merge/Publishing/Löschen/Force-Push ohne separate Freigabe

Produktionsreihenfolge:

```text
Medien prüfen
→ Visualplan + 60/40 prüfen
→ jedes Bild semantisch gegen Voice-Beat prüfen
→ echte Wortzeiten
→ Caption-Einheiten
→ finale Timeline
→ reale 60/40-Laufzeit prüfen
→ Remotion bauen
→ Bilder integrieren
→ Untertitel
→ Social-Caption
→ Validator
→ TypeScript
→ Preview
→ Szenen-/Contact-Sheet-QA
→ Full MP4
→ vollständige MP4-QA
→ Audio-QA
→ final-qa.json
→ Final-Validator erneut
→ Safety Audit
```

## 19. Finale MP4-QA — Pflicht

Ein technisch erfolgreicher Render reicht nicht.

Für neue V17-Reels muss vor `PRODUCTION COMPLETE` die vollständige MP4 tatsächlich geprüft und dokumentiert werden in:

```text
05-projektdateien/final-qa.json
```

Pflichtprüfungen:

- komplette MP4 wirklich angesehen/geprüft
- jede Szene geprüft
- Bilder passen semantisch zum Voice-Beat
- keine falschen/unpassenden Google-Flow-Texte
- Szenenwechsel synchron mit Audio
- tatsächliche Animationslaufzeit 55–65 %
- keine Bildszene unnötig länger als 8 Sekunden
- keine zwei Bildszenen direkt hintereinander
- kein langer statischer Tail
- Untertitel vollständig innerhalb der Safe-Area
- Wortmarkierung synchron
- Audio ungefähr -16 LUFS; Validatorbereich -17 bis -15 LUFS
- True Peak höchstens -1 dBTP

`final-qa.json` darf erst nach echter Prüfung auf `passed` gesetzt werden.

## 20. Final-Validator und Freigabe

```bash
npm run reel:validate -- <TARGET-REEL> --final
```

Neue V17-Reels werden technisch blockiert bei falschem Visual-Mix, ungelöster Timeline, zu langen Bildszenen, unsicheren Caption-Einheiten, fehlender Final-MP4-QA oder falschem Audio-QA-Status.

**PRODUCTION COMPLETE** erst nach tatsächlicher finaler Validierung, Typecheck, Preview, vollständiger MP4-Prüfung, Audio-QA, `final-qa.json: passed`, universeller Caption mit genau 5 Hashtags und Safety Audit.
