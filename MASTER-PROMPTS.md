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

Phase 1 liefert Recherche, szenenweises Skript, Bildprompts, natürliche Header,
Remotion-Spezifikationen und für jede Animationsszene bereits die finale
`animation.tsx`. Phase 3 darf keine fehlende Animation erfinden.

## 2. Phase 3 — Antigravity / Claude Code integriert autonom

```text
Mach das Reel: reels/<Woche>/<Tag>/<Reel>

1. Zuerst:
   npm run reel:ready -- <Reel-Pfad>

   Bei Erfolg sind die Phase-1-Animationsquellen per SHA-256 versiegelt.

2. Produktionsmanifest anlegen:
   npm run reel:phase3:init -- <Reel-Pfad> <Composition-ID>

3. JEDE scene-index-Szene implementieren.

   Bildszene:
   - echtes Nutzerbild als sichtbares Visual

   Animationsszene:
   - DIREKT scene.animationSourceFile aus Phase 1 verwenden
   - componentPath muss exakt diese kanonische Datei sein
   - componentExport muss scene.animationExport entsprechen
   - KEINE Ersatzanimation erstellen
   - KEINE versiegelte animation.tsx ändern

4. V5-Layout ausschließlich aus REEL_STYLE verwenden:
   - Header Y154
   - Plain Header: normaler weißer Text + einfaches semantisches Linien-Icon
   - keine Capsule / kein Chip / kein Panel
   - keine automatische ALL-CAPS-Transformation
   - Visual Y320–1480
   - Captions bottom340
   - Transition 3 Frames

5. phase3-production-manifest.json vollständig machen:
   - jede Szene implemented=true
   - startFrame + durationFrames lückenlos
   - Bild: sourceImageFileName + assetPath
   - Animation: canonicalSourcePath + canonicalSourceSha256 + componentPath + componentExport
   - audioImplemented=true
   - captionsImplemented=true
   - sceneHeadersImplemented=true
   - status=READY_TO_RENDER

6. Pflicht vor Render:
   npm run reel:phase3:preflight -- <Reel-Pfad>

7. Produktiven Render nur so starten:
   npm run reel:render -- <Reel-Pfad>/05-projektdateien/phase3-production-manifest.json

   Zuerst entsteht nur *.phase3-candidate.mp4.
   Erst Post-Render-QA PASSED gibt die finale MP4 frei.

8. Danach:
   npm run reel:export -- <Reel-Pfad> <Final-MP4>

FINAL_COMPLETE erst bei vollständig erzeugtem 06-export/.

STRIKT VERBOTEN:
- eigene Phase-3-Ersatzanimationen
- wackelnde Rechtecke / Debug-Boxen / Testflächen
- Math.sin/Math.cos als künstliches Dauerwackeln für Frame-Diff
- Dummy-/Placeholder-Komponenten
- generische Bewegung nur zum Bestehen der QA
- eine vorhandene MP4 als Fertigkeitsnachweis behandeln
- Caption-only-/Header-only-Szenen akzeptieren
- Candidate-MP4 als final ausgeben
- versiegelten Phase-1-Animationscode verändern

Stoppe nur bei echten Asset-, Fakten-, Sicherheits-, Validator-, Hash-, Build-, Render- oder Render-QA-Blockern. Alle Blocker gesammelt mit exakten Pfaden melden.
```

## 3. Bildprompt erstellen

```text
Erstelle einen FinanzNeo-Bildprompt für diesen gesprochenen Satz:
[SATZ]

Verbindlich:
- Quellbild immer 1:1
- Premium Stylized 3D + Physical Explainer V7
- ein großes physisches Hero-Objekt
- 3–6 konkrete themenspezifische physische Objekte
- deep charcoal green-black
- Emerald/Mint
- Gold nur Geld/Wert
- Rot-Orange nur Risiko/Verlust/Warnung
- keine Headline, kein Untertitel, kein erklärender Satz
- nur wenige kurze deutsche Objektlabels
- ein nahtloser Hintergrund von oben bis unten
- kein Dashboard/UI, Microchip, Gameboard, Orbit, Diorama, Fotorealismus
- wenn Person: Gesicht klar sichtbar
- endgültigen Dateinamen direkt angeben
- Bildnummer = echte Szenennummer
```

## 4. Google-Flow-Sammelprompt

```text
Erstelle 03-szenen/alle-bildprompts.txt chronologisch.

Strict Single Job:
1. aktuellen Bildblock lesen
2. GENAU EIN Bild starten
3. intern auf Ergebnis warten
4. sofort exakt umbenennen
5. QA
6. bei Fehler dieselbe Bildnummer wiederholen
7. erst nach PASS nächsten Bildblock freischalten

Nie Batch, parallel, Queue oder späteres Sammel-Umbenennen.
Nie Nutzer-„weiter“ verlangen.
Cover = Bild 00. Animationsnummern erzeugen kein Bild.
```

## 5. Bild-QA

```text
NEU ERSTELLEN bei:
- zwei Hintergründen/Bändern
- Floor-Wall-Grenze/Horizont
- gesichtsloser/abgewandter Person
- falschen Labels
- großer Headline/Untertitel/Satz
- Dashboard/UI/Microchip/Gameboard/Diorama-Look
- falscher Zuordnung zum gesprochenen Beat
```

## 6. Voiceover, Timing und Remotion

```text
Nur finales Voiceover verwenden.
Echte Wort-Timings daraus erzeugen.
Szenenschnitte an echten Satz-/Phrasenanfängen.

1080×1920, 30 fps.
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
- Preview
- Candidate-Render nur über reel:render
- Post-Render-QA pro Szene
- komplette freigegebene MP4 mit Ton
- Animationen zusätzlich ohne Ton
- Audio-Lautheit
- reel:export

Eine MP4 allein ist kein fertiges Reel.
Untertitel/Header allein sind kein gültiges Szenenvisual.
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

## 9. Phase 1 — YouTube-Longform

```text
Neues eigenständiges FinanzNeo-YouTube-Longform-Video.
Thema: [THEMA]

Arbeite nach CLAUDE.md, docs/YOUTUBE-LONGFORM-WORKFLOW.md und youtube/PRODUKTIONSSTANDARD.md.
Erstelle Recherche, vollständiges Skript, Kapitel-/Retention-Plan, Visual-Plan,
englische Flow-Prompts, Thumbnail-Brief, Titel, Beschreibung, Kapitel, Quellen,
Publishing und Promo ohne Platzhalter.

YouTube-Quellbilder/Thumbnail: 16:9.
Keine YouTube Shorts und keine gestreckte Reel-Kopie.
```

## 10. Phase 3 — YouTube-Longform

```text
Mach das YouTube-Video: youtube/<Projekt>
Prüfe zuerst npm run youtube:ready -- youtube/<Projekt>.
Bei Erfolg autonom bis technische und visuelle QA des 1920×1080-Renders.
```
