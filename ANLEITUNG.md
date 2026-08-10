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
- je Beat Bild / Remotion / Kombination wählen
- Bildnummer = echte Szenennummer; Animationen reservieren ihre Nummer

## 3. Google Flow

Antigravity erzeugt keine finalen Bilder.

```text
Prompt lesen
→ genau EIN Bild erzeugen
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

**Nicht mehr `contain`.**

Bildszenen verwenden `adaptive-safe-fill`:

- Bild nimmt nahezu die komplette nutzbare Fläche zwischen Headline und Caption ein
- kein kleines Poster innerhalb des Reels
- kein sichtbarer Bildrand und keine unscharfe Bildkopie
- zuerst leeren Hintergrund croppen
- Gesicht, Labels, Hero-Objekt und Geld/Wert schützen
- `focalX`/`focalY` pro Szene nutzen

Richtlayout 1080×1920:

```text
Headline ≈ Y 70
Visual   ≈ Y 210–1515
Caption  ≈ 280 px über Bottom
links    ≈ 60 px
rechts   ≈ 180 px
```

## 6. Audio und Untertitel

Wortzeiten ausschließlich aus dem exakten finalen Audio.

Verboten:

- gleichmäßiges Verteilen der Wörter
- geschätzte Wortzeiten
- provisorische Timings als final deklarieren

Untertitel:

- bevorzugt 1 vollständiger Satz gleichzeitig
- maximal 2 sehr kurze Sätze, falls nötig
- hart maximal 2 Zeilen
- aktives Wort grün nach echtem `start/end`
- Satz bleibt in kurzer Pause stehen
- Satzwechsel exakt beim ersten Wort des nächsten Satzes

Wenn echte Wortausrichtung nicht möglich ist → **BLOCKED**, nicht schätzen.

## 7. Antigravity Autopilot

Wenn Pflichtbilder + genau ein finales Audio vorhanden sind und der Nutzer `Mach das Reel` / `Mach es fertig` sagt, läuft der Auftrag ohne `weiter?` bis zum fertigen Ergebnis:

```text
Medien-Gate
→ echte Wortzeiten
→ Szenentiming
→ Remotion
→ adaptive-safe-fill
→ Satz-Karaoke
→ Plattformtexte
→ npm run reel:validate -- <TARGET-REEL> --final
→ TypeScript
→ Preview
→ visuelle QA
→ Full MP4
→ Fehler selbst beheben und erneut prüfen/rendern
→ Safety Audit
→ Commit/Draft-PR
```

Stoppen nur bei einem echten Blocker nach `CLAUDE.md`.

## 8. Publishing

Reel-Dateien:

```text
caption.txt
instagram-reels.txt
tiktok.txt
facebook-reels.txt
snapchat.txt
word-timings.json
```

Keine YouTube Shorts. YouTube ausschließlich Longform unter `youtube/`.

## 9. Fertig

`PRODUCTION COMPLETE` nur wenn finaler Validator, TypeScript, Preview, Bild-/Caption-QA, vollständiges MP4 und Safety Audit tatsächlich erfolgt sind.

Merge/Upload sind separate Nutzerfreigaben.
