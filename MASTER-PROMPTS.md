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
3. geprüftes 60–90-Sekunden-Skript
4. Szenen-/Beat-Plan
5. Bild-/Remotion-Zuordnung
6. vollständige Google-Flow-Bildprompts mit echten Szenennummern und finalen Dateinamen
7. Remotion-Spezifikationen
8. Master-Caption + Instagram/TikTok/Facebook/Snapchat-Dateien

Antigravity erzeugt keine finalen Bilder.
Keine YouTube Shorts.
```

## 2. FinanzNeo-Bildprompt

```text
Erstelle einen FinanzNeo-Bildprompt für:
[SATZ]

Verbindlich:
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
- keine Dioramen, Game-Level, Neon-Tunnel, Sci-Fi-Korridore oder Dashboards
- bekannte Marken nur, wenn sie konkret relevant sind

Direkt beim Prompt den endgültigen Dateinamen angeben.
Bildnummer = echte Szenennummer; Animationsnummern bleiben reserviert.
```

## 3. Google-Flow-Produktion

```text
Arbeite 03-szenen/alle-bildprompts.txt strikt chronologisch ab.

Pro Bild:
1. genau EIN Bild erzeugen
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
- Bildszenen mit adaptive-safe-fill, NICHT contain
- Bildfläche maximal zwischen Headline und Caption nutzen
- zuerst nur leeren nahtlosen Hintergrund croppen
- Gesicht, Labels, Hero-Objekt und Geld/Wert schützen
- kein sichtbares Bild-im-Bild-Panel, keine unscharfe Bildkopie
- Untertitel bevorzugt 1 vollständiger Satz, maximal 2 sehr kurze Sätze, hart max. 2 Zeilen
- aktives Wort exakt nach echtem start/end grün
- Satzwechsel beim ersten gesprochenen Wort des nächsten Satzes
- kurze Pausen ohne Caption-Lücke
- vier Reel-Plattformdateien fertigstellen
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
- Bild nutzt die verfügbare Fläche maximal
- kein kleines Poster/Inlay
- kein sichtbarer rechteckiger Bildrand
- Headline bleibt lesbar
- Caption bleibt oberhalb der Plattform-UI-Totzone
- rechts genügend UI-Abstand
- Gesicht/Labels/Hero-Objekt/Geld nicht abgeschnitten
- keine zwei Hintergründe/Bänder
- keine Floor-Wall-Grenze/Horizont

Prüfe Captions:
- echte Audio-Synchronität
- max. 2 Zeilen
- bevorzugt ein Satz
- aktive Wortfarbe stimmt exakt mit gesprochener Position überein
- keine unnötigen Leerphasen
```

## 6. Publishing

```text
04-caption/ enthält:
- caption.txt
- instagram-reels.txt
- tiktok.txt
- facebook-reels.txt
- snapchat.txt
- word-timings.json

Keine YouTube Shorts.
YouTube ausschließlich separater Longform-Workflow unter youtube/.
```
