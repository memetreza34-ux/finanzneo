# FinanzNeo — aktueller Produktionsablauf

> `CLAUDE.md` ist die höchste Regelquelle. Dieses Dokument ist nur die praktische Kurzfassung.

## 1. Vorbereitung

Vor jedem Reel lesen:

- `CLAUDE.md`
- `reels/PRODUKTIONSSTANDARD.md`
- Ziel-Reel `03-szenen/scene-index.json`
- Ziel-Reel `03-szenen/alle-bildprompts.txt`

Neues Thema gegen bestehende Reels prüfen, Fakten recherchieren, Quellen/Datenstand festhalten und keine Zahlen erfinden.

## 2. Skript und Szenen

- 60–90 Sekunden als Reel-Standard
- Hook → Problem → Erklärung → Beispiel → Lösung/Merksatz → CTA
- kurze deutsche Sätze
- Sätze so schreiben, dass ein vollständiger Untertitelsatz bei guter Smartphone-Schrift in maximal zwei Zeilen passt
- je Beat Bild / Remotion / Kombination wählen
- Bildnummer = echte Szenennummer; Animationen reservieren ihre Nummer

## 3. Google Flow

Antigravity erzeugt keine finalen Bilder.

```text
Prompt lesen
→ genau EIN vertikales 9:16-Bild erzeugen
→ sofort endgültig umbenennen
→ Motiv + Labels + Gesicht + nahtlosen Hintergrund prüfen
→ erst dann nächstes Bild
```

Alle finalen Nutzerbilder ausschließlich nach:

```text
03-szenen/00-ALLE-BILDER-HIER-REIN/
```

Finales Voiceover ausschließlich nach:

```text
02-audio/
```

Keine Ersatzmedien aus anderen Ordnern/Reels/Downloads/Web/Stock/Cache/Alt-Exporten.

## 4. Bildwelt

- Premium Fintech Editorial 3D
- eine dominante Finanzmetapher / Hero-Objekt
- optional Person; Gesicht klar sichtbar
- deep charcoal green-black + emerald/mint
- Gold für Geld/Wert, Rot-Orange für Risiko/Verlust
- kurze deutsche Objektlabels, normalerweise 1–3 Wörter
- keine KI-Headline, kein KI-Untertitel, kein erklärender Satz
- genau ein nahtloser Hintergrund von oben bis unten
- keine Prozent-Zonen/Bänder/Floor-Wall-Grenze/Horizont/Panels

## 5. Remotion-Bilddarstellung

Bildszenen verwenden **full-frame-no-crop**:

- komplettes vertikales 9:16-Nutzerbild über die gesamte 1080×1920-Szene
- kein kleiner mittlerer Bildcontainer / kein `VisualStage` um Nutzerbilder
- kein absichtlicher Crop, Zoom oder Focal-Point-Vertrag
- kein sichtbarer Bildrand und keine unscharfe Bildkopie
- Headline + Untertitel als Overlay über demselben Vollbild
- nur weicher kontinuierlicher Transparenz-Scrim für Lesbarkeit
- kein separater Header-/Footer-Hintergrund

Richtlayout 1080×1920:

```text
Headline             ≈ Y 72
Bildszene            = Y 0–1920
Animationsinhalt     ≈ Y 220–1490
Caption              ≈ 300 px über Bottom
links                ≈ 64 px
rechts               ≈ 156 px
untere UI-Safe-Area  ≥ 260 px
```

Native Remotion-Szenen nutzen ebenfalls einen einzigen durchgehenden Full-Canvas-Hintergrund ohne Boden/Horizont/Studio-Split.

## 6. Audio und Untertitel

Wortzeiten ausschließlich aus dem exakten finalen Audio.

Verboten:

- gleichmäßiges Verteilen der Wörter
- geschätzte Wortzeiten
- provisorische Timings als final deklarieren

Untertitel:

- **genau 1 vollständiger Satz gleichzeitig**
- niemals 2 Sätze gleichzeitig
- hart maximal 2 Zeilen
- große lesbare Smartphone-Schrift; zu langen Satz sinnvoll teilen statt extrem verkleinern
- aktives Wort grün nach echtem `start/end`
- Satz bleibt in kurzer Pause stehen
- Satzwechsel exakt beim ersten Wort des nächsten Satzes
- keine schwarze/undurchsichtige Caption-Karte

Wenn echte Wortausrichtung nicht möglich ist → **BLOCKED**, nicht schätzen.

## 7. Antigravity Autopilot

Wenn Pflichtbilder + genau ein finales Audio vorhanden sind und der Nutzer `Mach das Reel` / `Mach es fertig` sagt, läuft der Auftrag ohne `weiter?` bis zum fertigen Ergebnis:

```text
Medien-Gate
→ echte Wortzeiten
→ Szenentiming
→ Remotion
→ full-frame-no-crop
→ genau-ein-Satz-Karaoke
→ eine universelle Caption mit genau 5 Hashtags
→ npm run reel:validate -- <TARGET-REEL> --final
→ TypeScript
→ Preview
→ visuelle QA
→ Full MP4
→ Fehler selbst beheben und erneut prüfen/rendern
→ Safety Audit
→ Commit/Draft-PR
```

Visuelle QA prüft explizit: kein zweiter Hintergrund, kein abgeschnittener Bildboden, keine harten Header/Footer-Flächen, kein Inset-Panel, keine schwarze Caption-Karte, genau ein Untertitelsatz, sichere Caption-Position.

Stoppen nur bei einem echten Blocker nach `CLAUDE.md`.

## 8. Publishing

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
- kein Hashtag-Spam / keine irrelevanten Trend-Tags
- keine garantierte Viralitätsbehauptung

Verboten in aktiven neuen Reels:

```text
instagram-reels.txt
tiktok.txt
facebook-reels.txt
snapchat.txt
youtube-shorts.txt
```

Keine YouTube Shorts. YouTube ausschließlich Longform unter `youtube/`.

## 9. Fertig

`PRODUCTION COMPLETE` nur wenn finaler Validator, TypeScript, Preview, Bild-/Caption-QA, vollständiges MP4, universelle Caption mit genau 5 Hashtags und Safety Audit tatsächlich erfolgt sind.

Merge/Upload sind separate Nutzerfreigaben.
