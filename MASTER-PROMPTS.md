# FinanzNeo — aktuelle Master-Prompts

> `CLAUDE.md` ist die höchste Regelquelle.

Vor Reels lesen:

- `docs/PHASE-1-BRIEFING.md`
- `docs/PHASE-1-ANIMATION-CODE-STANDARD.md`
- `docs/3-PHASEN-WORKFLOW.md`
- `docs/PHASE-3-COMPLETION-GATE.md`
- `reels/PRODUKTIONSSTANDARD.md`

## 1. Phase 1 — ChatGPT bereitet komplett vor

Phase 1 liefert Recherche, szenenweises Skript, V9-Bildprompts, natürliche Header,
Remotion-Spezifikationen und für jede Animationsszene bereits die finale
`animation.tsx`. Phase 3 darf keine fehlende Animation erfinden.

## 2. Phase 3 — Antigravity / Claude Code integriert autonom

```text
Mach das Reel: reels/<Woche>/<Tag>/<Reel>

1. Zuerst:
   npm run reel:ready -- <Reel-Pfad>

   Bei FAIL: STOP. Keine Ersatzbilder, kein Ersatz-Audio,
   keine Ersatz-Timings und keine Ersatzanimation bauen.

2. Prüfe scene-index.json -> phase3Executor.
   Nur der konfigurierte Executor führt Phase 3 aus.

3. Produktionsmanifest:
   npm run reel:phase3:init -- <Reel-Pfad> <Composition-ID>

4. Jede Szene implementieren.

   Bildszene:
   - exaktes Nutzerbild sichtbar rendern
   - kein Stock-/Placeholder-/Caption-only-Ersatz

   Animationsszene:
   - DIREKT scene.animationSourceFile aus Phase 1 verwenden
   - componentPath exakt auf diese versiegelte Datei
   - componentExport = scene.animationExport
   - customAnimations/Dispatch vollständig binden
   - keine Ersatzanimation
   - versiegelte animation.tsx nicht ändern
   - fehlendes Binding = harter Fehler

5. REEL-BACKGROUND:
   #000000, statisch, ohne Dekoration.

   VERBOTEN:
   - FNBgAurora
   - FNBgParticles
   - FNBgGrid
   - FNBgRadial
   - Partikelfelder
   - Aurora-/Glow-Hintergründe
   - dekorative Background-Gradienten/Vignetten
   - Background-Motion als Ersatz für echte Szenenbewegung

6. Finales V5-Layout ausschließlich aus REEL_STYLE:
   - Header Y154
   - Header 56 px, Minimum 50 px, maximal 2 Zeilen
   - 34-px-Linien-Icon
   - weißer Text, keine Capsule / kein Chip / kein Panel / kein ALL CAPS
   - Visual Y320–1400
   - AnimationStage hart auf Y320–1400 geclippt
   - Captions bottom340, 50 px, maximal 2 Zeilen
   - Transition 3 Frames

7. phase3-production-manifest.json vollständig machen.

8. Pflicht vor Render:
   npm run reel:phase3:preflight -- <Reel-Pfad>

9. Produktiven Render nur so starten:
   npm run reel:render -- <Reel-Pfad>/05-projektdateien/phase3-production-manifest.json

   Zuerst entsteht *.phase3-candidate.mp4.
   Post-Render-QA prüft pro Szene echten visuellen Inhalt,
   echte Animationsbewegung, schwarzen freien Rand, Audio, Dimensionen und Timeline.
   Schwarzes/leeres Visual = FAIL.

10. Danach:
   npm run reel:export -- <Reel-Pfad> <Final-MP4>

FINAL_COMPLETE erst bei erfolgreichem Export und vollständigem 06-export/.

STRIKT VERBOTEN:
- eigene Phase-3-Ersatzanimationen
- wackelnde Rechtecke / Debug-Boxen / Testflächen
- Math.sin/Math.cos als künstliches Dauerwackeln
- Dummy-/Placeholder-Komponenten
- generische Bewegung nur zum Bestehen der QA
- Hintergrundeffekte zum Bestehen der QA
- Caption-only-/Header-only-Szenen akzeptieren
- Candidate-MP4 als final ausgeben
- versiegelten Phase-1-Animationscode verändern
```

## 3. Bildprompt erstellen — V9

```text
Erstelle einen FinanzNeo-Bildprompt für diesen gesprochenen Satz:
[SATZ]

Verbindlich:
- Quellbild 1:1
- WORLD LOCK: finanzneo-stylized-3d-animated-black-v9
- klar nicht-realistische stylized 3D animated Bildwelt
- soft rounded shapes, vereinfachte erkennbare Details
- premium, leicht verspielt, nicht technisch
- tiefschwarzer sauberer Hintergrund Pflicht
- Inhalt/Klarheit vor Objektzahl; keine feste Anzahl
- Emerald positiv, Ivory/Soft Gray neutral, Gold Geld/Wert, Rot-Orange Warnung/Kosten
- keine Headline, kein Untertitel, kein erklärender Satz
- nur kurze deutsche Objektlabels
- kein Realismus, Produktfoto, Dashboard, App-UI, Flowchart, Mini-Boxen, Microchip, Diorama, Clutter
- Prompt mittellang
- finalen Dateinamen direkt angeben
- Bildnummer = echte Szenennummer

Falls Marke/Logo/App vorkommt:
- erkennbar ähnlich, aber stilisiert in derselben 3D-Animationswelt
- kein flach aufgeklebtes echtes Logo
- kein Screenshot-/photorealistischer Marken-UI-Look
```

## 4. Google Flow

```text
Strict Single Job V3:
1. aktuellen Bildblock lesen
2. GENAU EIN Bild starten
3. intern auf Ergebnis warten
4. sofort exakt umbenennen
5. V9-QA
6. bei Fehler dieselbe Bildnummer wiederholen
7. erst nach PASS nächsten Bildblock freischalten

Nie Batch, parallel, Queue oder Nutzer-„weiter“.
Cover = Bild 00. Animationsnummern erzeugen kein Bild.
```

## 5. Voiceover, Timing und Remotion

```text
Nur finales Voiceover verwenden.
Echte Wort-Timings daraus erzeugen.
Szenenschnitte an echten Satz-/Phrasenanfängen.

1080×1920, 30 fps.
Reel-Hintergrund immer statisch #000000.
Keine Partikel/Aurora/Grid/Glow-Hintergründe.
Bilder mit contain.
V5: Header Y154 / 56 px / max 2 Zeilen, Visual Y320–1400, Caption bottom340.
Animationen hart auf Y320–1400 begrenzen.
Aktives Caption-Wort grün, Rest weiß, max. zwei Zeilen.
Animationsszenen direkt aus den versiegelten Phase-1-animation.tsx-Dateien.
```

## 6. Finale QA

```text
- reel:ready
- Asset-Sync
- Produktionsmanifest vollständig
- reel:phase3:preflight
- Candidate-Render nur über reel:render
- Post-Render-QA pro Szene
- visueller Kern nicht leer
- Animation erklärt wirklich den Inhalt
- freier Rand bleibt statisch schwarz
- komplette MP4 mit Ton
- reel:export

Eine MP4 allein ist kein fertiges Reel.
Untertitel/Header/Hintergrund allein sind kein gültiges Szenenvisual.
Keine Prüfung als bestanden behaupten, wenn sie nicht tatsächlich ausgeführt wurde.
```

## 7. Publishing

Pflicht in `04-caption/`:

- `caption.txt`
- `instagram-reels.txt`
- `tiktok.txt`
- `facebook-reels.txt`
- `snapchat.txt`

Keine YouTube Shorts. YouTube-Longform bleibt separat unter `youtube/`.
