# FinanzNeo — aktueller Produktionsablauf

> `CLAUDE.md` ist die höchste Regelquelle. Für neue Reels zusätzlich verbindlich: `docs/REEL-QUALITY-CONTRACT-V2.md`.

## 1. Vorbereitung

Vor jedem Reel lesen:

- `CLAUDE.md`
- `reels/PRODUKTIONSSTANDARD.md`
- `docs/REEL-QUALITY-CONTRACT-V2.md`
- `docs/BEAT-TO-IMAGE-RULES.md`
- Ziel-Reel `03-szenen/scene-index.json`
- Ziel-Reel `03-szenen/alle-bildprompts.txt`

Neues Thema gegen bestehende Reels prüfen, Fakten recherchieren, Quellen/Datenstand festhalten und keine Zahlen erfinden.

## 2. Skript und Visual-Plan

- 60–90 Sekunden als Reel-Standard
- kurze, klare deutsche Sätze
- dynamische Beats sind animation-first
- Zielmix: 60 % native Remotion-Animation / 40 % Google-Flow-Bilder
- finale Laufzeit: 55–65 % Animation / 35–45 % Bilder
- bei 10 Szenen standardmäßig 6 Animationen + 4 Bilder
- höchstens eine Bildszene direkt hintereinander
- statische Bildszene normalerweise maximal 8 Sekunden
- jede Szene braucht Hauptaussage, Visualtyp und konkrete Begründung
- jede Bildszene braucht ein `expectedVisual`

Remotion bevorzugen für Vergleich, Rechnung, Timeline, Wachstum, Geldfluss, Mechanismus, Schrittfolge und sichtbare Ursache→Wirkung.

Bilder bevorzugen für Hook, konkrete Alltagssituation, starke einzelne Metapher und Abschlussbild.

## 3. Google Flow

Antigravity erzeugt keine finalen Bilder.

```text
Prompt lesen
→ genau EIN vertikales 9:16-Bild erzeugen
→ sofort endgültig umbenennen
→ Motiv + erlaubten Text + Gesicht + nahtlosen Hintergrund prüfen
→ beim Cover zusätzlich exakte Pflichtüberschrift prüfen
→ erst dann nächstes Bild
```

**Cover `Bild 00`:** große deutsche Überschrift direkt im Google-Flow-Bild. Exakter Wortlaut unter `COVER-ÜBERSCHRIFT – EXAKT SO:`. Falsch/fehlend/abgeschnitten/unlesbar → neu in Google Flow erzeugen, nie in Remotion reparieren.

**Szenenbilder `Bild 01+`:** keine KI-Headline, kein KI-Untertitel und kein erklärender Satz; nur ausdrücklich gewünschte kurze deutsche Objektlabels.

Alle finalen Nutzerbilder ausschließlich nach:

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

Finales Voiceover ausschließlich nach:

```text
02-audio/
```

Keine Ersatzmedien aus anderen Ordnern/Reels/Downloads/Web/Stock/Cache/Alt-Exporten.

## 4. Bild-QA vor Remotion

Jedes tatsächlich gelieferte Bild vor dem Einbau einzeln gegen den gesprochenen Beat prüfen:

- Motiv passt exakt zur Aussage
- Hauptaussage in ungefähr einer Sekunde verständlich
- keine zufälligen/falschen Wörter
- nur erlaubte Labels
- Zahlen stimmen
- keine widersprüchliche Zusatzinformation
- keine unnötige Textwiederholung aus Bildlabel + Headline + Caption
- Bildwelt/Background/Person-Regeln eingehalten

Wenn eine Neugenerierung nötig ist → **BLOCKED**. Antigravity erzeugt keinen Ersatz.

## 5. Remotion-Bilddarstellung

Bildszenen verwenden `full-frame-no-crop`:

- komplettes vertikales 9:16-Nutzerbild über die gesamte 1080×1920-Szene
- kein kleiner `VisualStage` / kein Inset-Poster
- kein absichtlicher Crop oder Focal-Zoom-Vertrag
- kein sichtbarer Bildrand und keine unscharfe Bildkopie
- Szenen 01+: Headline + Caption als Overlay über demselben Vollbild
- Cover: keine Remotion-Headline
- nur weicher kontinuierlicher Transparenz-Scrim
- kein separater Header-/Footer-Hintergrund

Native Remotion-Szenen nutzen einen einzigen durchgehenden Full-Canvas-Hintergrund ohne Boden/Horizont/Studio-Split.

## 6. Audio, Timeline und Untertitel

Finales Audio ist die einzige Zeitquelle.

```text
finales Audio
→ echte Wort-start/end-Zeitstempel
→ kurze Caption-Einheiten
→ echte Szenenstarts/-enden
→ Animationsdauer
→ Render
```

Verboten:

- gleichmäßiges Verteilen der Wörter
- geschätzte Wortzeiten
- provisorische Timings als final
- finale Timeline mit ungelösten `durationFrames: 0`

Untertitel für V17-Reels:

```text
1 Caption-Einheit gleichzeitig
max. 12 Wörter
max. 68 Zeichen
max. 2 Zeilen
min. 42 px
Bottom ≈ 320
Left ≈ 72
Right ≈ 180
```

Ist ein gesprochener Satz zu lang, darf er an einer natürlichen Bedeutungs-/Pausengrenze in mehrere **nacheinander** gezeigte Caption-Einheiten geteilt werden. Nie zwei gleichzeitig.

- kein horizontaler Überlauf/Clipping
- aktives Wort exakt nach echtem `start/end` grün
- kurze Pause: aktuelle Einheit halten
- Wechsel beim ersten gesprochenen Wort der nächsten Einheit
- keine schwarze/undurchsichtige Caption-Karte

Wenn echte Wortausrichtung nicht möglich ist → **BLOCKED**.

## 7. Reale 60/40-Laufzeit nach Audio-Timing

Nach Ermittlung der echten Szenendauern erneut prüfen:

```text
Animation: 55–65 %
Bilder:    35–45 %
```

Zusätzlich:

- keine Bildszene unnötig länger als 8 Sekunden
- keine zwei Bildszenen direkt hintereinander
- kein langer statischer Schluss-Tail

Wenn die Quote nicht passt, geeignete dynamische Beats in Remotion umplanen. Keine bedeutungslose Animation nur für die Quote.

## 8. Antigravity Autopilot

Wenn Pflichtbilder + genau ein finales Audio vorhanden sind und der Nutzer `Mach das Reel` / `Mach es fertig` sagt:

```text
Medien-Gate
→ Visualplan prüfen
→ jedes Bild semantisch prüfen
→ echte Wortzeiten
→ Caption-Einheiten
→ finale Timeline
→ reale 60/40-Laufzeit prüfen
→ Remotion
→ full-frame Bilder
→ sichere Karaoke-Captions
→ universelle Caption + genau 5 Hashtags
→ Final-Validator
→ TypeScript
→ Preview
→ Frame-/Contact-Sheet-QA
→ Full MP4
→ vollständige MP4-QA
→ Audio-QA
→ final-qa.json
→ Final-Validator erneut
→ Safety Audit
→ Commit/Draft-PR
```

Keine normalen `Weiter?`-Stopps. Behebbare Fehler selbst korrigieren und erneut prüfen/rendern.

## 9. Finale MP4-QA

Für neue V17-Reels Pflichtdatei:

```text
05-projektdateien/final-qa.json
```

Erst auf `passed` setzen, nachdem die finale MP4 tatsächlich vollständig geprüft wurde.

Pflichtprüfung:

- jedes Bild passt zum gesprochenen Moment
- Google-Flow-Texte/Labels korrekt
- Szenenwechsel synchron mit Audio
- tatsächliche Animationslaufzeit 55–65 %
- keine zu lange Bildszene
- kein langer statischer Tail
- Caption bleibt komplett innerhalb der Safe-Area
- Wortmarkierung synchron
- Audio ungefähr -16 LUFS, Validatorbereich -17 bis -15 LUFS
- True Peak höchstens -1 dBTP

## 10. Publishing

In `04-caption/` gibt es nur:

```text
caption.txt
word-timings.json
```

`caption.txt` wird unverändert für Instagram Reels, TikTok, Facebook Reels und Snapchat verwendet.

Finale Caption:

- starke ehrliche Hook-Zeile
- kurze Kernaussage/Aha-Nutzen
- kurzer CTA nur wenn passend
- **genau 5 relevante Hashtags**
- keine separaten Plattformvarianten
- kein Hashtag-Spam
- keine Viralitätsgarantie

Keine YouTube Shorts. YouTube ausschließlich Longform unter `youtube/`.

## 11. Fertig

Finaler Validator:

```bash
npm run reel:validate -- <TARGET-REEL> --final
```

`PRODUCTION COMPLETE` nur wenn Final-Validator, TypeScript, Preview, vollständige MP4-QA, Audio-QA, `final-qa.json: passed`, universelle Caption mit genau 5 Hashtags und Safety Audit tatsächlich erfolgt sind.

Merge/Upload sind separate Nutzerfreigaben.
