# FinanzNeo — aktuelle Master-Prompts

> `CLAUDE.md` ist die höchste Regelquelle. Für neue Reels gilt zusätzlich `docs/REEL-QUALITY-CONTRACT-V2.md`.

## 1. Neues Reel komplett vorbereiten

```text
Neues FinanzNeo-Reel.
Thema: [THEMA]

Lies zuerst vollständig:
- CLAUDE.md
- reels/PRODUKTIONSSTANDARD.md
- docs/REEL-QUALITY-CONTRACT-V2.md
- docs/BEAT-TO-IMAGE-RULES.md

Erstelle selbstständig:
1. Recherche mit Quellen und Datenstand
2. Lernziel/Kernaussage
3. geprüftes 60–90-Sekunden-Skript mit kurzen, caption-tauglichen Sätzen/Meaning-Units
4. Szenen-/Beat-Plan
5. Bild-/Remotion-Zuordnung MIT Begründung je Szene
6. Zielmix: 60 % native Remotion-Animation / 40 % Google-Flow-Bilder
7. bei 10 Szenen standardmäßig 6 Animationen + 4 Bilder
8. dynamische Information animation-first: Vergleich, Rechnung, Timeline, Wachstum, Geldfluss, Mechanismus, Schritte, sichtbare Ursache→Wirkung
9. höchstens eine Bildszene direkt hintereinander; statische Bildszene normalerweise max. 8 Sekunden
10. für jede Bildszene ein konkretes expectedVisual
11. vollständige Google-Flow-Bildprompts mit echten Szenennummern und finalen Dateinamen
12. für Cover Bild 00 eine konkrete deutsche Pflichtüberschrift unter COVER-ÜBERSCHRIFT – EXAKT SO:; direkt in Google Flow erzeugen, später NICHT in Remotion ersetzen
13. Remotion-Spezifikationen
14. genau EINE universelle Social-Caption für Instagram Reels, TikTok, Facebook Reels und Snapchat mit exakt 5 relevanten Hashtags
15. Quality-Contract-Metadaten und pending 05-projektdateien/final-qa.json

Antigravity erzeugt keine finalen Bilder.
Keine YouTube Shorts.
```

## 2. FinanzNeo-Szenenbildprompt `Bild 01+`

```text
Erstelle einen FinanzNeo-Bildprompt für:
[SATZ / VOICE-BEAT]

Prüfe zuerst, ob dieser Beat wirklich ein statisches Bild sein sollte.
Wenn der Beat Vergleich, Rechnung, Timeline, Wachstum, Geldfluss, Mechanismus, Schrittfolge oder sichtbare Veränderung erklärt: Remotion bevorzugen und KEIN Bild nur aus Bequemlichkeit planen.

Wenn Bild wirklich passend:
- vertikal 9:16
- Premium Fintech Editorial 3D
- EINE dominante Finanzmetapher / Hero-Objekt
- Motiv muss die gesprochene Hauptaussage innerhalb ungefähr einer Sekunde verständlich machen
- optional stilisierte erwachsene 3D-Person; Gesicht klar sichtbar
- deep charcoal green-black
- emerald/mint
- Gold nur für Geld/Wert
- Rot-Orange nur für Risiko/Verlust/Schulden
- kurze deutsche Objektlabels, normalerweise 1–3 Wörter
- keine Headline, kein Untertitel, kein erklärender Satz im Szenenbild
- genau EIN nahtloser Hintergrund von oben bis unten
- keine Prozent-Zonen, Bänder, Floor-Wall-Grenze, Horizont oder Panels
- keine zufälligen/falschen Wörter
- Zahlen müssen mit Skript/Recherche übereinstimmen
- keine unnötige Textwiederholung aus Bildlabel + späterer Remotion-Headline + Caption
- keine Dioramen, Game-Level, Neon-Tunnel, Sci-Fi-Korridore oder Dashboards

Gib zusätzlich an:
Visual Role: [ROLLE]
Visual Selection Reason: [WARUM BILD HIER BESSER IST]
Expected Visual: [WAS MUSS SOFORT VERSTÄNDLICH SEIN]
Erlaubte Labels: [EXAKTE LABELS]
Finaler Dateiname: Bild XX - [NAME].png

Bildnummer = echte Szenennummer; Animationsnummern bleiben reserviert.
```

## 3. FinanzNeo-Coverprompt `Bild 00`

```text
Erstelle den Google-Flow-Coverprompt für das Reel:
[THEMA]

Verbindlich:
- Cover = Bild 00
- vertikal 9:16
- Premium Fintech Editorial 3D
- eine große klare Metapher, die das Reel-Thema in einem Blick erklärt
- genau EIN nahtloser deep-charcoal-green-black Hintergrund
- EINE große deutsche Cover-Überschrift direkt im generierten Google-Flow-Bild
- im Prompt steht zwingend:

COVER-ÜBERSCHRIFT – EXAKT SO:
[EXAKTE DEUTSCHE COVER-ÜBERSCHRIFT]

- ungefähr 3–8 Wörter, maximal 2 Zeilen
- Überschrift nennt konkret das Reel-Thema
- große hochwertige Smartphone-lesbare Typografie
- keine separate Textbox, kein Header-Balken, kein zweiter Hintergrund
- kein zusätzlicher Subtitle, CTA oder erklärender Satz
- Schreibweise exakt prüfen
- fehlt/falsch/abgeschnitten/unlesbar: Cover neu in Google Flow erzeugen
- Cover-Überschrift niemals später in Remotion ergänzen oder reparieren
```

## 4. Google-Flow-Produktion

```text
Arbeite 03-szenen/alle-bildprompts.txt strikt chronologisch ab.

Pro Bild:
1. genau EIN vertikales 9:16-Bild erzeugen
2. sofort endgültig umbenennen
3. Motiv gegen den exakten Voice-Beat prüfen
4. erlaubten Text, Zahlen, Gesicht, nahtlosen Hintergrund und Dateiname prüfen
5. beim Cover zusätzlich die exakte Pflichtüberschrift prüfen
6. erst dann nächstes Bild

Ein Bild ist NICHT freigegeben, wenn:
- es zwar schön aussieht, aber den Sprechbeat nicht klar erklärt
- zufällige/falsche Wörter erscheinen
- ein nicht erlaubtes Label erscheint
- Zahl/Fakt falsch ist
- zusätzliche Information der Aussage widerspricht

Cover = Bild 00 und enthält die Pflichtüberschrift direkt aus Google Flow.
Animationsszenen erzeugen kein Bild und behalten ihre Nummer.
Erst am Ende alle finalen Bilder gemeinsam nach 03-szenen/00-ALLE-BILDER-HIER-REIN/.
```

## 5. Reel vollständig fertigstellen — Antigravity Autopilot

```text
Die finalen Bilder und das finale Audio sind vorhanden. Mach das Reel vollständig von Anfang bis Ende fertig.

Verbindlich:
- Nutzerbilder ausschließlich aus 03-szenen/00-ALLE-BILDER-HIER-REIN/
- finales Audio ausschließlich aus 02-audio/
- fehlt/falsch/mehrdeutig: BLOCKED mit exaktem Pfad; nichts ersetzen oder erraten
- keine Zwischenfragen wie Weiter?

VOR DEM BAU:
- Visualplan prüfen: Ziel 60 % Animation / 40 % Bilder
- bei 10 Szenen standardmäßig 6 Animationen + 4 Bilder
- keine zwei Bildszenen direkt hintereinander
- jedes Nutzerbild gegen den exakten Voice-Beat prüfen
- unpassendes/falsches Bild, das neu generiert werden muss: BLOCKED
- Cover Bild 00 auf exakte Google-Flow-Überschrift prüfen

TIMING:
- echte Wort-start/end-Zeitstempel aus genau diesem finalen Audio erzeugen
- keine gleichmäßig geschätzten Wortzeiten
- lange gesprochene Sätze bei Bedarf in kurze nacheinander gezeigte Caption-Einheiten teilen, Audio nicht verändern
- finale Timeline aus echten Audiozeiten ableiten
- keine finalen startFrame/durationFrames-Platzhalter mit 0
- Timeline lückenlos/chronologisch

VISUALS:
- reale finale Laufzeit: 55–65 % native Remotion-Animation / 35–45 % Bilder
- Bildszene normalerweise max. 8 Sekunden
- kein langer statischer Schluss-Tail
- dynamische Information animation-first
- Bildszenen full-frame-no-crop über 1080×1920
- keine VisualStage-Inset-Bilder
- keine zusätzliche Remotion-Headline auf Bild 00
- native Remotion-Szenen mit EINEM durchgehenden Full-Canvas-Hintergrund

CAPTIONS V17+:
- genau 1 kurze Caption-Einheit gleichzeitig
- max. 12 Wörter
- max. 68 Zeichen
- max. 2 Zeilen
- min. 42 px effektive Schriftgröße
- ungefähr Bottom 320 / Left 72 / Right 180
- kein horizontaler Überlauf oder Abschneiden
- keine schwarze Caption-Karte
- aktives Wort exakt nach echtem start/end grün
- kurze Pause: aktuelle Einheit halten
- Wechsel am ersten gesprochenen Wort der nächsten Einheit

PUBLISHING:
- genau EINE universelle Social-Caption
- unverändert für Instagram Reels, TikTok, Facebook Reels und Snapchat
- starke erste Zeile + kurzer Nutzen/Aha + CTA wenn passend + EXAKT 5 relevante Hashtags

QA:
- npm run reel:validate -- <TARGET-REEL> --final
- TypeScript prüfen
- Preview rendern
- Anfang/Mitte/Ende jeder Szene + Contact Sheet prüfen
- vollständiges MP4 rendern und KOMPLETT prüfen
- Bild/Voice-Match, falsche KI-Texte, Szenen/Audio-Sync, Caption-Safe-Area und Wort-Sync prüfen
- reale Animationslaufzeit 55–65 % prüfen
- Audio messen: ungefähr -16 LUFS, Validatorbereich -17 bis -15; True Peak <= -1 dBTP
- 05-projektdateien/final-qa.json nur nach echter Prüfung auf passed setzen
- Final-Validator erneut ausführen
- behebbare Fehler selbstständig fixen und Checks/Render wiederholen
- Safety Audit
- Commit/Draft-PR, aber nicht mergen oder veröffentlichen

Ende nur mit PRODUCTION COMPLETE oder BLOCKED.
```

## 6. Bild-/Render-QA

```text
Prüfe Cover Bild 00:
- exakte Pflichtüberschrift direkt im Google-Flow-Bild
- korrekt geschrieben, vollständig sichtbar, Smartphone-lesbar
- kein Subtitle/CTA/erklärender Satz
- kein separater Textbalken/Panel
- keine Remotion-Ersatzheadline

Prüfe jede Bildszene 01+:
- Motiv passt exakt zum gesprochenen Beat
- Hauptaussage sofort verständlich
- keine zufälligen/falschen Wörter
- nur erlaubte Labels
- Zahlen/Fakten korrekt
- keine widersprüchliche Zusatzinformation
- Nutzerbild läuft vollständig von Y=0 bis Y=1920
- kein kleiner Bildcontainer/Posterinlay
- kein zweiter/dritter wahrnehmbarer Hintergrund

Prüfe Visual-Mix:
- finale Animationslaufzeit 55–65 %
- finale Bildlaufzeit 35–45 %
- keine zwei Bildszenen direkt hintereinander
- Bildszene normalerweise max. 8 Sekunden
- kein langer statischer Schluss-Tail

Prüfe Captions:
- echte Audio-Synchronität
- genau 1 kurze Caption-Einheit gleichzeitig
- max. 12 Wörter / 68 Zeichen / 2 Zeilen
- mindestens 42 px
- komplett innerhalb der Safe-Area
- aktives Wort stimmt exakt mit gesprochener Position überein
- keine unnötigen Leerphasen

Prüfe finale MP4 vollständig und dokumentiere die echten Ergebnisse in 05-projektdateien/final-qa.json.
```

## 7. Universelle Social-Caption

```text
Erstelle genau EINE Caption für das fertige Reel.

Sie wird 1:1 auf Instagram Reels, TikTok, Facebook Reels und Snapchat verwendet.

Regeln:
- keine Plattformvarianten
- keine Überschrift wie CAPTION:
- erste Zeile = starker ehrlicher Hook
- danach kurze Kernaussage/Aha-Nutzen
- kurzer Save-/Follow-/Kommentar-CTA nur wenn passend
- EXAKT 5 passende Hashtags
- keine zufälligen Trend-Tags, kein Hashtag-Spam, kein irrelevantes #fyp
- keine erfundenen Fakten
- keine Viralitätsgarantie
- direkt kopierfertig in 04-caption/caption.txt

04-caption/ enthält nur:
- caption.txt
- word-timings.json

Nicht erstellen:
- instagram-reels.txt
- tiktok.txt
- facebook-reels.txt
- snapchat.txt
- youtube-shorts.txt
```
