# FinanzNeo — aktuelle Master-Prompts

> `CLAUDE.md` ist die höchste Regelquelle.

Vor Reels lesen:

- `docs/PHASE-1-BRIEFING.md`
- `docs/PHASE-1-ANIMATION-CODE-STANDARD.md`
- `docs/3-PHASEN-WORKFLOW.md`
- `docs/PHASE-3-COMPLETION-GATE.md`
- `reels/PRODUKTIONSSTANDARD.md`

## 1. Phase 1 — ChatGPT bereitet komplett vor

**Nicht diesen Abschnitt kopieren, sondern `docs/PHASE-1-BRIEFING.md`.**

Phase 1 liefert Recherche, szenenweises Skript, V9-Bildprompts, natürliche Header,
Remotion-Spezifikationen und für jede Animationsszene bereits die finale
`animation.tsx`. Phase 3 darf keine fehlende Animation erfinden.

## 2. Phase 3 — Antigravity / Claude Code integriert autonom

```text
Mach das Reel: reels/<Woche>/<Tag>/<Reel>

1. Zuerst:
   npm run reel:ready -- <Reel-Pfad>

   Wenn das fehlschlägt: STOP. Keine Ersatzbilder, kein Ersatz-Audio,
   keine Ersatz-Timings und keine Ersatzanimation bauen.

2. Prüfe scene-index.json -> phase3Executor.
   Nur der konfigurierte Executor führt Phase 3 aus.

3. Produktionsmanifest anlegen:
   npm run reel:phase3:init -- <Reel-Pfad> <Composition-ID>

4. JEDE scene-index-Szene implementieren.

   Bildszene:
   - exaktes Nutzerbild sichtbar rendern
   - kein Stock-/Placeholder-/Caption-only-Ersatz

   Animationsszene:
   - DIREKT scene.animationSourceFile aus Phase 1 verwenden
   - componentPath exakt auf diese versiegelte Datei
   - componentExport = scene.animationExport
   - customAnimations/Dispatch vollständig binden
   - KEINE Ersatzanimation
   - KEINE versiegelte animation.tsx ändern
   - fehlendes Binding muss hart fehlschlagen

5. REEL-BACKGROUND IST IMMER:
   #000000, statisch, ohne Dekoration.

   VERBOTEN:
   - FNBgAurora
   - FNBgParticles
   - FNBgGrid
   - FNBgRadial
   - Partikelfelder
   - bewegte Grids
   - Aurora-/Glow-Hintergründe
   - dekorative Hintergrund-Gradienten/Vignetten
   - Background-Motion als Ersatz für echte Szenenbewegung

6. V5-Layout ausschließlich aus REEL_STYLE:
   - Header Y154
   - normaler weißer Text + einfaches semantisches Linien-Icon
   - keine Capsule / kein Chip / kein Panel / kein erzwungenes ALL CAPS
   - Visual Y320–1480
   - Captions bottom340
   - Transition 3 Frames

7. phase3-production-manifest.json vollständig machen:
   - jede Szene implemented=true
   - startFrame + durationFrames lückenlos
   - Bild: sourceImageFileName + assetPath
   - Animation: canonicalSourcePath + canonicalSourceSha256 + componentPath + componentExport
   - audioImplemented=true
   - captionsImplemented=true
   - sceneHeadersImplemented=true
   - status=READY_TO_RENDER

8. Pflicht vor Render:
   npm run reel:phase3:preflight -- <Reel-Pfad>

   Preflight prüft zusätzlich den Pure-Black-Background-Vertrag.

9. Produktiven Render nur so starten:
   npm run reel:render -- <Reel-Pfad>/05-projektdateien/phase3-production-manifest.json

   Zuerst entsteht nur *.phase3-candidate.mp4.
   Post-Render-QA prüft pro Szene echten visuellen Inhalt, Animation-Motion,
   schwarzen freien Rand, Audio, Dimensionen und Timeline.
   Schwarzes/leeres Visual = FAIL.

10. Danach:
   npm run reel:export -- <Reel-Pfad> <Final-MP4>

FINAL_COMPLETE erst bei vollständig erzeugtem 06-export/.

STRIKT VERBOTEN:
- eigene Phase-3-Ersatzanimationen
- wackelnde Rechtecke / Debug-Boxen / Testflächen
- Math.sin/Math.cos als künstliches Dauerwackeln für Frame-Diff
- Dummy-/Placeholder-Komponenten
- generische Bewegung nur zum Bestehen der QA
- Hintergrundeffekte zum Bestehen der QA
- eine vorhandene MP4 als Fertigkeitsnachweis behandeln
- Caption-only-/Header-only-Szenen akzeptieren
- Candidate-MP4 als final ausgeben
- versiegelten Phase-1-Animationscode verändern

Stoppe nur bei echten Asset-, Fakten-, Sicherheits-, Validator-, Hash-, Build-, Render- oder Render-QA-Blockern. Alle Blocker gesammelt mit exakten Pfaden melden.
```

## 3. Bildprompt erstellen — V9

```text
Erstelle einen FinanzNeo-Bildprompt für diesen gesprochenen Satz:
[SATZ]

Verbindlich:
- Quellbild immer 1:1
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
- Prompt mittellang halten
- endgültigen Dateinamen direkt angeben
- Bildnummer = echte Szenennummer

Falls Marke/Logo/App vorkommt:
- erkennbar ähnlich, aber stilisiert in derselben 3D-Animationswelt
- kein flach aufgeklebtes echtes Logo
- kein Screenshot-/photorealistischer Marken-UI-Look
```

## 4. Google-Flow-Sammelprompt

```text
Erstelle 03-szenen/alle-bildprompts.txt chronologisch.

Strict Single Job:
1. aktuellen Bildblock lesen
2. GENAU EIN Bild starten
3. intern auf Ergebnis warten
4. sofort exakt umbenennen
5. V9-QA
6. bei Fehler dieselbe Bildnummer wiederholen
7. erst nach PASS nächsten Bildblock freischalten

Nie Batch, parallel, Queue oder späteres Sammel-Umbenennen.
Nie Nutzer-„weiter“ verlangen.
Cover = Bild 00. Animationsnummern erzeugen kein Bild.
```

## 5. Bild-QA

```text
NEU ERSTELLEN bei:
- Hintergrund nicht tiefschwarz/clean
- fotorealistischem oder Produktfoto-Look
- falschen Labels
- großer Headline/Untertitel/Satz
- Dashboard/App-UI/Flowchart/Microchip/Diorama-Look
- Clutter oder unnötiger Komplexität
- falscher Zuordnung zum gesprochenen Beat
```

## 6. Voiceover, Timing und Remotion

```text
Nur finales Voiceover verwenden.
Echte Wort-Timings daraus erzeugen.
Szenenschnitte an echten Satz-/Phrasenanfängen.

1080×1920, 30 fps.
Reel-Hintergrund immer statisch #000000.
Keine Partikel/Aurora/Grid/Glow-Hintergründe.
Bilder mit contain.
V5: Header Y154, Visual 320–1480, Caption bottom340.
Header: normaler weißer Text + Icon, keine Capsule, keine ALL-CAPS-Erzwingung.
Aktives Caption-Wort grün, Rest weiß, max. zwei Zeilen.
Animationsszenen direkt aus den versiegelten Phase-1-animation.tsx-Dateien.
```

## 7. Finale technische und visuelle QA

```text
- reel:ready
- Asset-Sync
- Produktionsmanifest vollständig
- reel:phase3:preflight
- Tests + Typecheck
- Candidate-Render nur über reel:render
- Post-Render-QA pro Szene
- visueller Kern nicht leer
- freier Rand bleibt statisch schwarz
- komplette freigegebene MP4 mit Ton
- Animationen zusätzlich ohne Ton
- Audio-Lautheit
- reel:export

Eine MP4 allein ist kein fertiges Reel.
Untertitel/Header/Hintergrund allein sind kein gültiges Szenenvisual.
Keine Prüfung als bestanden behaupten, wenn sie nicht tatsächlich ausgeführt wurde.
```

## 8. Reel-Plattform-Publishing

Pflichtdateien in `04-caption/`:

- `caption.txt`
- `instagram-reels.txt`
- `tiktok.txt`
- `facebook-reels.txt`
- `snapchat.txt`

Keine YouTube Shorts.

## 9. YouTube

YouTube-Longform bleibt ein getrennter Workflow unter `youtube/`. Die hier definierte Reel-Pure-Black-Regel verändert YouTube nicht automatisch.
