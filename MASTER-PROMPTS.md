# FinanzNeo — aktuelle Master-Prompts

> `CLAUDE.md` ist die höchste Regelquelle.

## 1. Neues Reel komplett vorbereiten

```text
Neues FinanzNeo-Reel.
Thema: [THEMA]

Lies zuerst CLAUDE.md und reels/PRODUKTIONSSTANDARD.md vollständig.

Erstelle selbstständig:
1. Recherche mit Quellen und Datenstand
2. Lernziel/Kernaussage
3. geprüftes 60–90-Sekunden-Skript mit kurzen, untertitelfreundlichen Sätzen
4. Szenen-/Beat-Plan
5. Bild-/Remotion-Zuordnung
6. vollständige Google-Flow-Bildprompts mit echten Szenennummern und finalen Dateinamen
7. Remotion-Spezifikationen
8. genau EINE universelle Social-Caption für Instagram Reels, TikTok, Facebook Reels und Snapchat mit exakt 5 relevanten Hashtags

Antigravity erzeugt keine finalen Bilder.
Keine YouTube Shorts.
```

## 2. FinanzNeo-Bildprompt

```text
Erstelle einen FinanzNeo-Bildprompt für:
[SATZ]

Verbindlich:
- vertikal 9:16
- Premium Fintech Editorial 3D
- EINE dominante Finanzmetapher / Hero-Objekt
- optional stilisierte erwachsene 3D-Person; Gesicht klar sichtbar
- deep charcoal green-black
- emerald/mint
- Gold nur für Geld/Wert
- Rot-Orange nur für Risiko/Verlust/Schulden
- kurze deutsche Objektlabels, normalerweise 1–3 Wörter
- keine Headline, kein Untertitel, kein erklärender Satz im KI-Bild
- genau EIN nahtloser Hintergrund von oben bis unten
- keine Prozent-Zonen, Bänder, Floor-Wall-Grenze, Horizont oder Panels
- wichtige Motive und Labels vollständig innerhalb des 9:16-Frames halten; später kein absichtlicher Crop
- keine Dioramen, Game-Level, Neon-Tunnel, Sci-Fi-Korridore oder Dashboards
- bekannte Marken nur, wenn sie konkret relevant sind

Direkt beim Prompt den endgültigen Dateinamen angeben.
Bildnummer = echte Szenennummer; Animationsnummern bleiben reserviert.
```

## 3. Google-Flow-Produktion

```text
Arbeite 03-szenen/alle-bildprompts.txt strikt chronologisch ab.

Pro Bild:
1. genau EIN vertikales 9:16-Bild erzeugen
2. sofort endgültig umbenennen
3. Motiv + Labels + Gesicht + nahtlosen Hintergrund + Dateiname prüfen
4. erst dann nächstes Bild

Cover = Bild 00.
Animationsszenen erzeugen kein Bild und behalten ihre Nummer.
Erst am Ende alle finalen Bilder gemeinsam nach 03-szenen/00-ALLE-BILDER-HIER-REIN/.
```

## 4. Reel vollständig fertigstellen — Antigravity Autopilot

```text
Die finalen Bilder und das finale Audio sind vorhanden. Mach das Reel vollständig von Anfang bis Ende fertig.

Verbindlich:
- Nutzerbilder ausschließlich aus 03-szenen/00-ALLE-BILDER-HIER-REIN/
- finales Audio ausschließlich aus 02-audio/
- fehlt/falsch/mehrdeutig: BLOCKED mit exaktem Pfad; nichts ersetzen oder erraten
- keine Zwischenfragen wie „Weiter?“
- echte Wort-start/end-Zeitstempel aus genau diesem finalen Audio erzeugen
- keine gleichmäßig geschätzten Wortzeiten
- Szenenschnitte an echten Satzanfängen
- Bildszenen full-frame-no-crop: komplettes vertikales 9:16-Bild über die gesamte 1080×1920-Szene
- Nutzerbilder NICHT in VisualStage oder einen kleineren Mittel-Container setzen
- kein absichtlicher Crop, Zoom/Focal-Point-Vertrag, Inset-Panel oder unscharfe Bildkopie
- Headline und Untertitel als Overlay über demselben Vollbild
- nur weicher kontinuierlicher Transparenz-Scrim; keine harten Header/Footer-Hintergründe
- native Remotion-Szenen mit EINEM durchgehenden Full-Canvas-Hintergrund, kein Boden/Horizont/Studio-Split
- Untertitel GENAU 1 vollständiger Satz gleichzeitig, hart max. 2 Zeilen
- keine schwarze/undurchsichtige Caption-Karte
- bei zu langem Satz Satz sinnvoll teilen statt Schrift winzig zu machen
- aktives Wort exakt nach echtem start/end grün
- Satzwechsel beim ersten gesprochenen Wort des nächsten Satzes
- kurze Pausen ohne Caption-Lücke
- genau EINE universelle Social-Caption fertigstellen
- dieselbe Caption unverändert für Instagram Reels, TikTok, Facebook Reels und Snapchat
- Caption mit starker erster Zeile, kurzem Nutzen/Aha, natürlichem CTA wenn passend und EXAKT 5 relevanten Hashtags
- keine separaten Plattform-Caption-Dateien
- npm run reel:validate -- <TARGET-REEL> --final
- TypeScript prüfen
- Preview rendern und visuell prüfen
- vollständiges MP4 rendern und prüfen
- behebbare Fehler selbstständig fixen und alle betroffenen Checks/Render wiederholen
- Safety Audit
- Commit/Draft-PR, aber nicht mergen oder veröffentlichen

Ende nur mit PRODUCTION COMPLETE oder BLOCKED.
```

## 5. Bild-/Render-QA

```text
Prüfe jede Bildszene im finalen Render:
- Nutzerbild läuft vollständig von Y=0 bis Y=1920
- kein abgeschnittener/abgesetzter unterer Bildbereich
- kein kleiner Bildcontainer/Posterinlay
- kein sichtbarer rechteckiger Bildrand
- keine harte obere/untere Hintergrundfläche
- kein zweiter/dritter wahrnehmbarer Hintergrund
- Headline bleibt lesbar als Overlay
- Caption bleibt oberhalb der Plattform-UI-Totzone
- rechts genügend UI-Abstand
- keine schwarze Caption-Karte

Prüfe native Remotion-Szenen:
- ein durchgehender Full-Canvas-Hintergrund
- kein Boden/Horizont/Wand-/Studio-Split

Prüfe Captions:
- echte Audio-Synchronität
- GENAU 1 Satz gleichzeitig
- max. 2 Zeilen
- gut lesbare Smartphone-Schrift
- aktive Wortfarbe stimmt exakt mit gesprochener Position überein
- keine unnötigen Leerphasen
```

## 6. Universelle Social-Caption

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
