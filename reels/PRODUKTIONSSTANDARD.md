# FinanzNeo-Reel-Produktionsstandard

> `CLAUDE.md` ist die höchste Regelquelle. Für neue Reels gilt zusätzlich `docs/REEL-QUALITY-CONTRACT-V2.md`. Alte widersprüchliche Bild-/Animationsquoten gelten nicht mehr.

## 1. Reel-Struktur

```text
01-script/
02-audio/
03-szenen/
04-caption/
05-projektdateien/
README.md
```

Keine doppelten Hauptordner für dieselbe Funktion.

## 2. Nutzer-Medien — harte Grenze

Finaler Build verwendet ausschließlich:

```text
Bilder: 03-szenen/00-ALLE-BILDER-HIER-REIN/
Audio:  02-audio/
```

- Bilddateien aus anderen Reels oder Einzel-Szenenordnern sind als finale Nutzer-Medien verboten.
- Keine Medien aus Archiv, Desktop, Downloads, Web, Stock, Cache oder alten Exporten.
- Keine Platzhalter/Ersatzmedien.
- Pflichtmedium fehlt/falsch/unlesbar → **BLOCKED** mit exaktem Pfad.
- Finaler Build verlangt genau eine finale Audiodatei.

## 3. Verbindlicher Visual-Mix — 60 % Animation / 40 % Bilder

Für normale 60–90-Sekunden-Reels:

```text
Ziel:       60 % native Remotion-Animation
            40 % Google-Flow-Bildszenen

Final:      55–65 % Animationslaufzeit
            35–45 % Bildlaufzeit
```

Bei 10 Szenen standardmäßig:

```text
6 Remotion-Szenen
4 Bildszenen
```

Zusätzlich:

- höchstens eine Bildszene direkt hintereinander
- statische Bildszene normalerweise maximal 8 Sekunden
- Laufzeitquote ist wichtiger als nur die Szenenanzahl
- kein statisches Bild nur zum Auffüllen
- kein langer statischer Schluss-Tail

Neue Reels werden über `npm run reel:create` mit `scene-index` Version 17 und dem Quality Contract V2 angelegt.

## 4. Animation-first bei dynamischer Information

Remotion ist Standard für:

- Vergleiche und Vorher/Nachher
- Zahlen, Prozentwerte und Rechnungen
- Zeitachsen und Entwicklung über Zeit
- Wachstum und Zinseszins
- Geldflüsse
- Schrittfolgen
- Mechanismen
- Ursache → Wirkung mit sichtbarer Veränderung
- Risiko-/Realitätscheck
- Diagramme/Balken/Kurven

Google-Flow-Bilder sind bevorzugt für:

- Hook / starke Einstiegssituation
- konkrete Alltagssituation
- starke einzelne Metapher
- räumlich sofort erfassbares Problem
- Abschlussbild / Schlussmetapher

Ein Bild darf nicht nur gewählt werden, weil es einfacher zu produzieren ist. Ein dekoratives oder semantisch schwaches Bild wird durch Remotion ersetzt.

Jede Szene braucht im Plan eine konkrete Visualtyp-Begründung. Bildszenen brauchen zusätzlich ein `expectedVisual`.

## 5. Google Flow und Bild-QA

```text
Prompt lesen
→ genau EIN Bild erzeugen
→ sofort endgültig umbenennen
→ Motiv + Text + Gesicht + Hintergrund + Dateiname prüfen
→ erst dann nächstes Bild
```

Bildnummer = echte Szenennummer. Cover = `Bild 00`. Animationsnummern bleiben reserviert.

Vor Remotion-Einbau wird jedes Nutzerbild einzeln gegen seinen Voice-Beat geprüft:

- Motiv passt exakt zur gesprochenen Aussage
- Hauptaussage innerhalb ungefähr einer Sekunde verständlich
- keine zufälligen/falschen Wörter
- nur erlaubte Labels
- Zahlen stimmen mit Skript/Recherche überein
- keine widersprüchliche Zusatzinformation
- keine unnötige Dreifach-Wiederholung aus Bildlabel + Headline + Untertitel

Wenn ein Bild neu generiert werden muss → **BLOCKED**. Antigravity erzeugt keinen Ersatz.

## 6. Cover `Bild 00`

- eine große deutsche Cover-Überschrift direkt im Google-Flow-Bild ist Pflicht
- Überschrift nennt konkret das Reel-Thema
- im Prompt exakt unter `COVER-ÜBERSCHRIFT – EXAKT SO:`
- ungefähr 3–8 Wörter, maximal zwei Zeilen
- keine separate Textbox, kein Header-Balken, kein zweiter Hintergrund
- kein zusätzlicher Untertitel, CTA oder erklärender Satz
- falsche/fehlende/abgeschnittene Überschrift → Cover neu erzeugen
- **keine Cover-Überschrift in Remotion ergänzen oder ersetzen**

Szenenbilder `Bild 01+` enthalten nur kurze gewünschte Objektlabels; keine KI-Headline, keinen KI-Untertitel und keinen erklärenden Satz.

## 7. Bildwelt und Hintergrund

- Premium Fintech Editorial 3D
- eine dominante Finanzmetapher / Hero-Objekt
- optional stilisierte erwachsene Person; Gesicht klar sichtbar
- deep charcoal green-black
- emerald/mint Akzente
- Gold für Geld/Wert
- Rot-Orange für Verlust/Risiko/Schulden
- keine Dioramen, Neon-Tunnel, Sci-Fi-Korridore, Dashboards, Pixar/Clay/Fotorealismus

Jedes Nutzerbild und jede native Remotion-Szene besitzt genau einen durchgehenden Hintergrund ohne Prozent-Zonen, Bänder, Boden-Wand-Grenze, Horizont oder Studio-Split.

## 8. Bilddarstellung — full-frame-no-crop

- Nutzerbild ist vertikal 9:16 und belegt die gesamte 1080×1920-Szene
- kein kleiner `VisualStage` / Inset-Poster
- kein absichtlicher Crop oder Focal-Zoom-Vertrag
- keine unscharfe Bildkopie als Hintergrund
- Szene 01+: Headline + Untertitel als Overlay über demselben Vollbild
- Cover: keine Remotion-Ersatzheadline
- nur weicher kontinuierlicher Transparenz-Scrim für Lesbarkeit
- keine harten Header-/Footer-Flächen

Produktive Bildkomponente:

```text
src/design-system/FullFrameImage.tsx
```

## 9. Untertitel — eine kurze Caption-Einheit gleichzeitig

Zu jedem Zeitpunkt ist genau **eine** Caption-Einheit sichtbar. Niemals zwei Einheiten gleichzeitig.

Bevorzugt ist ein kurzer vollständiger gesprochener Satz. Ist ein gesprochener Satz zu lang, wird er an einer natürlichen Bedeutungs-/Pausengrenze in mehrere nacheinander gezeigte Einheiten geteilt.

Neue V17-Reels:

```text
max. 12 Wörter pro Einheit
max. 68 Zeichen pro Einheit
max. 2 sichtbare Zeilen
min. 42 px effektive Schriftgröße
subtitleBottom ≈ 320
subtitleLeft   ≈ 72
subtitleRight  ≈ 180
```

- kein horizontaler Überlauf
- kein Abschneiden am Rand
- keine Mini-Schrift als Rettung
- aktives Wort grün, Rest weiß
- aktives Wort exakt nach echten Audio-start/end-Zeiten
- kurze Pause: aktuelle Einheit halten
- Wechsel beim ersten gesprochenen Wort der nächsten Einheit
- keine undurchsichtige/schwarze Caption-Karte

Produktive Komponente:

```text
src/design-system/SentenceKaraokeCaptions.tsx
```

## 10. Timing — ausschließlich finales Audio

Verbindliche Reihenfolge:

```text
finales Audio aus 02-audio
→ echte Wort-start/end-Zeiten
→ Caption-Einheiten
→ Szenenstarts/-enden
→ Animationsdauer
→ Render
```

Verboten:

- mathematisch gleichmäßig verteilte Wortzeiten
- geschätzte Wortzeiten
- alte provisorische Timingtabellen als final
- finale Timeline mit ungelösten `durationFrames: 0`

`04-caption/word-timings.json` muss final `timingStatus: final-audio-aligned` enthalten.

`05-projektdateien/timeline.json` muss im Finalmodus lückenlos, chronologisch und vollständig aufgelöst sein. Das Reel-Ende darf nicht mehr als ungefähr eine Sekunde unbegründet hinter dem letzten gesprochenen Wort liegen.

## 11. Publishing — eine Caption für alle Reel-Plattformen

`04-caption/` enthält nur:

```text
caption.txt
word-timings.json
```

`caption.txt` wird unverändert für Instagram Reels, TikTok, Facebook Reels und Snapchat verwendet:

- starke ehrliche Hook-Zeile
- kurzer Nutzen/Aha
- natürlicher CTA nur wenn passend
- **genau 5 relevante Hashtags**
- keine separaten Plattformvarianten
- keine Viralitätsgarantie

Keine YouTube Shorts. YouTube ist ausschließlich Longform unter `youtube/`.

## 12. Finale MP4-QA — Pflicht

Ein erfolgreicher Typecheck oder ein technisch fertiger Render reicht nicht.

Vor `PRODUCTION COMPLETE` muss die vollständige finale MP4 tatsächlich geprüft werden. Für neue V17-Reels wird das Ergebnis in:

```text
05-projektdateien/final-qa.json
```

dokumentiert.

Pflicht-QA:

- jedes Bild passt zum gesprochenen Moment
- keine falschen/unpassenden Google-Flow-Texte
- Szenenwechsel synchron mit Audio
- tatsächliche Animationslaufzeit 55–65 %
- keine Bildszene unnötig länger als 8 Sekunden
- keine zwei Bildszenen direkt hintereinander
- kein langer statischer Tail
- Untertitel innerhalb der Safe-Area
- Untertitel groß genug
- aktive Wortmarkierung synchron
- Audio ungefähr -16 LUFS, True Peak höchstens -1 dBTP

`final-qa.json` darf erst nach echter Prüfung auf `passed` gesetzt werden.

## 13. Autopilot-Finalisierung

Wenn Pflichtbilder + genau ein finales Audio vorhanden sind und der Nutzer `Mach das Reel` / `Mach es fertig` sagt:

```text
Medien prüfen
→ jedes Bild semantisch gegen Voice-Beat prüfen
→ echte Wortzeiten
→ kurze Caption-Einheiten
→ finale Szenentimeline
→ 60/40-Laufzeitmix prüfen
→ Remotion implementieren
→ Bilder full-frame integrieren
→ Untertitel integrieren
→ universelle Caption + 5 Hashtags
→ finaler Validator
→ TypeScript
→ Preview
→ Frame-/Contact-Sheet-QA
→ Full MP4
→ vollständige MP4-QA
→ Audio-QA
→ final-qa.json auf passed
→ Validator erneut im Finalmodus
→ Safety Audit
→ Commit/Draft-PR
```

Keine normalen `Weiter?`-Stopps. Behebbare Fehler selbst korrigieren und erneut prüfen. Stop nur bei echten Blockern.

## 14. Final-Validator

```bash
npm run reel:validate -- <TARGET-REEL> --final
```

Für V17-Reels blockiert der Quality-Validator insbesondere:

- falschen 60/40-Plan oder falsche finale Laufzeitquote
- zwei Bildszenen direkt hintereinander
- Bildszene über 8 Sekunden
- ungelöste Timeline
- zu lange Caption-Einheiten
- fehlende echte Audio-Ausrichtung
- fehlende/negative Final-MP4-QA
- unpassende Audiopegel

Validatoren niemals schwächen, um einen fehlerhaften Reel-Build durchzulassen.

## 15. Freigabe

**PRODUCTION COMPLETE** erst nach tatsächlicher finaler Validierung, Typecheck, Preview, vollständiger MP4-Prüfung, Audio-QA, `final-qa.json: passed`, universeller Caption mit genau 5 Hashtags und Safety Audit.

Merge und Publishing bleiben separate Nutzerfreigaben.
