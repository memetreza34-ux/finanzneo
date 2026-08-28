# Phase-1-Briefing für ChatGPT

Dieses Dokument ist die verbindliche Übergabe an Phase 1. Bei Widersprüchen gilt `CLAUDE.md`.

## So wird es benutzt

1. Den Block unter „Briefing zum Kopieren“ verwenden.
2. `[THEMA]` ersetzen.
3. Phase 1 liefert alle Inhalte inklusive fertiger `animation.tsx`.
4. Phase 2 ergänzt Bilder, finales Voiceover und echte Wort-Zeitstempel.
5. Phase 3 startet erst mit `npm run reel:ready -- <Reel-Pfad>`.

---

## Briefing zum Kopieren

```text
Du erstellst Phase 1 eines FinanzNeo-Reels.

THEMA: [THEMA]

ZIEL
FinanzNeo erklärt Finanzgrundlagen auf Deutsch für Einsteiger. Direkte Du-Ansprache, einfach, professionell, visuell hochwertig. Plattformen: TikTok, Instagram Reels, Facebook Reels, Snapchat. Keine YouTube Shorts.

FORMAT
- 1080×1920, 9:16, 30 fps
- 60–90 Sekunden
- Hook in den ersten 2 Sekunden
- Ziel 14–16 Visual-Beats, Standard etwa 15
- ungefähr 60 % Bild / 40 % Remotion-Animation, Qualität vor Quote
- nie mehr als zwei Bildszenen direkt hintereinander
- Bildbeat ideal 3,5–5,5 s, absolut max. 6 s
- Animationsbeat ideal 4,5–7 s
- Flow-Quellbilder inklusive Cover strikt 1:1

SKRIPT
Schreibe von Anfang an SZENE FÜR SZENE. Nicht erst Fließtext schreiben und nachträglich schneiden.

Wortbudget:
- Bildszene: 9–14 Wörter, absolut max. 15
- Animationsszene: 11–16 Wörter, absolut max. 17

Bild = Zustand/Situation/Gegenstand/Beispiel.
Animation = Veränderung/Mechanismus/Rechnung/Vergleich/Vorher-Nachher.

Logik: Hook → Problem → Erklärung → Beispiel → Lösung/Merksatz → CTA.
Zahlen nur nach Prüfung. Keine individuelle Anlageempfehlung.

LAYOUT V5
- Header Y154
- Header 56 px, Minimum 50 px, maximal 2 Zeilen
- Icon 34 px
- Visualzone Y320–1400
- Untertitel bottom340, 50 px Basis, maximal 2 Zeilen
- Header mittig, reines Weiß + einfaches semantisches Linien-Icon
- keine Capsule, kein Chip, kein Panel, kein erzwungenes ALL CAPS
- lange Header auf max. zwei Zeilen umbrechen, nicht zu kleinen Labels schrumpfen
- AnimationStage clippt sichtbar hart auf Y320–1400
- Bilder und Animationen nutzen die Visualzone groß und sichtbar

ZWISCHENÜBERSCHRIFT
Jede Szene braucht eine natürliche Aussage oder Frage, meist 3–6 Wörter. Kein reines Stichwort und keine reine Zahl. Icon muss zur Aussage passen.

Erlaubte Icons:
euro, clock, hourglass, shield, check, cross, coins, bank, rocket, wallet, percent, flame, target, bulb, lock, trending, calendar, phone, search, receipt, repeat, document, list, warning

headerTone:
- default/positive = grünes Icon
- warning = rotes Icon
- money = goldenes Icon
- neutral = weißes Icon
Headertext bleibt #FFFFFF.

UNTERTITEL
- aktuelles Wort grün, Rest weiß
- max. 2 Zeilen
- 50 px Basis, Weight 800
- kein Stroke, kein Jump/Scale
- kein Wort der nächsten Szene vor der Szenengrenze

════════════════════════════════════════
BILDWELT — STYLIZED 3D ANIMATED BLACK V9
════════════════════════════════════════

Jeder Bildprompt enthält:

FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
FINANZNEO_SERIES_LOCK: finanzneo-same-world-v1
PREMIUM_VISUAL_WORLD_LOCK: finanzneo-stylized-3d-animated-black-v9
GENERATED_IMAGE_ASPECT_RATIO: 1:1
FLOW_AGENT_PROTOCOL: finanzneo-flow-sequential-v1
GOOGLE FLOW – FINALER DATEINAME:
Bild XX - Kurzer Szenenname.png

ZIELWELT
- klar stylized 3D animated, niemals realistisch oder photorealistisch
- polished 3D animated movie frame
- soft rounded shapes, simplified recognizable details
- premium, freundlich und leicht verspielt, aber nicht kindlich
- Inhalt und Verständlichkeit vor Deko
- jede Szene darf anders komponiert sein, muss aber nach derselben Welt aussehen

HINTERGRUND — PFLICHT
- ein nahtloser deep-black Hintergrund
- sauber, minimal, ruhig
- kein heller Studiohintergrund
- keine sichtbare Boden-Wand-Grenze, kein Horizont, keine farbigen Hintergrundzonen

OBJEKTE + KOMPOSITION
- klare Hauptaussage oder Hauptaktion
- KEINE feste Objektanzahl
- zusätzliche Objekte nur, wenn sie die Aussage besser, verständlicher oder interessanter machen
- keine Props nur zum Auffüllen
- Szene muss in ungefähr 1–2 Sekunden verständlich sein
- lieber einfach und stark als kompliziert und überladen

MARKEN + LOGOS
Wenn Marke, Bank, App oder Logo relevant ist:
- Kernidentität erkennbar ähnlich halten
- aber als vereinfachtes, abgerundetes 3D-Element in derselben Animationswelt darstellen
- kein flach aufgeklebtes echtes Logo
- kein Website-/App-Screenshot
- kein photorealistisches Markenprodukt oder realistische Marken-UI

FARBEN
- Emerald Green = positiv / bevorzugter Weg
- Warm Ivory + Soft Gray = neutrale Flächen
- Gold = nur Geld / Wert
- Warm Red-Orange = Warnung / Kosten / Verlust
- schwarzer Hintergrund bleibt dominant

LICHT
- clean soft studio lighting
- klare Highlights
- lesbare Schatten
- gute Trennung vom schwarzen Hintergrund
- weiche Kontaktschatten

TEXT IM BILD
- nur ausdrücklich verlangte kurze deutsche Labels
- keine Headline, kein Untertitel, kein CTA, kein erklärender Satz

STRENG VERBOTEN
- Realismus / Photorealismus
- echter Produktfoto-Look
- flach aufgeklebtes echtes Logo / Screenshot-Marken-UI
- Dashboard / App UI
- Flowchart als Hauptkomposition
- kleine Kästen, floating Info-Cards, technische UI-Flächen
- Microchip/Circuit-Look
- Miniatur-Diorama
- unnötiger Clutter

PROMPT-LÄNGE
- mittel-lang
- zuerst die konkrete Bildidee
- danach kurzer Style-/Background-/Forbidden-Block
- keine riesigen Regelblöcke, die die eigentliche Szene überdecken

BILD-QA
Bild verwerfen und neu erzeugen, wenn es realistisch aussieht, der Hintergrund nicht tiefschwarz ist, die Aussage schwer verständlich ist, zu viel Clutter entsteht, die Szene wie UI/Flowchart wirkt, eine Marke wie aufgeklebt/Screenshot aussieht oder die V9-Animationswelt nicht mehr erkennbar ist.

GOOGLE FLOW — STRICT SINGLE JOB
- FLOW_EXECUTION_MODE: finanzneo-flow-strict-single-job-v3
- maximal 1 laufender Bildjob
- nur aktuellen Bildblock ausführen
- auf Ergebnis warten
- sofort exakt umbenennen
- V9-QA
- Fehler: dieselbe Bildnummer neu
- erst danach nächsten Bildblock freischalten
- kein Batch, kein Queueing, keine Galerie/Collage, kein Nutzer-„weiter“
- keine Bildreferenz

════════════════════════════════════════
ANIMATION — V9-KOMPATIBLER PHASE-1-CODE
════════════════════════════════════════

Phase 1 ist vollständig verantwortlich. Für jede Animationsszene müssen `remotion.md` UND eine fertige `animation.tsx` existieren.

Technische Locks:
- animationQualityLock: finanzneo-phase1-animation-code-v1
- animationPremiumVisualLock: finanzneo-premium-physical-animation-v2

Visuelles Ziel: finanzneo-stylized-3d-animated-black-v9

PFLICHTLOGIK
STARTZUSTAND → SICHTBARER PHYSISCHER MECHANISMUS → EINDEUTIGES ERGEBNIS → Ergebnis mindestens 15 Frames stabil.

PFLICHT IM CODE
- useCurrentFrame
- ANIMATION_COLORS
- prog/interpolate/spring
- PremiumPhysicalStage
- mindestens ein echtes PhysicalObject als sichtbares Hauptmotiv
- KEINE feste Support-Objekt-Anzahl
- mindestens eine semantische Materialrolle neutral/money/warning/positive
- RESULT_HOLD_FRAMES >= 15
- korrekter Exportname SceneXXAnimation

Pflichtkommentare:

ANIMATION_NARRATIVE
START: konkrete sichtbare Ausgangslage
MECHANISM: konkrete sichtbare Veränderung
RESULT: konkretes sichtbares Ergebnis

PREMIUM_VISUAL_NARRATIVE
HERO: klares Hauptobjekt oder Hauptaktion
SUPPORT: nur sinnvolle Support-Objekte; keine feste Anzahl
MATERIAL: Material-/Farblogik
DEPTH: Vordergrund/Hauptmotiv/Hintergrund + Lichttrennung

ANIMATIONS-ZIELWELT
- klar nicht realistisch
- stylized 3D animated
- weiche, abgerundete Formen
- einfache verständliche Objektaktion
- Visualzone Y320–1400 sinnvoll nutzen
- sichtbare Ausgabe bleibt hart innerhalb Y320–1400
- PremiumPhysicalStage bleibt TRANSPARENT
- der einzige Remotion-Reel-Hintergrund ist zentral und statisch #000000

ANIMATIONS-HINTERGRUND STRENG VERBOTEN
- FNBgAurora
- FNBgParticles
- FNBgGrid
- FNBgRadial
- Partikelfelder
- Aurora-/Glow-Flächen
- bewegte Grids
- dekorative Hintergrund-Gradienten/Vignetten
- Hintergrundbewegung als Frame-Diff-Hack

WEITER STRENG VERBOTEN
- Dashboard-/Control-Panel-Look
- Flowchart als Hauptkomposition
- kleine Kästen mit dünnen Linien
- generische Info-Cards als Hauptsprache
- reine Texttafel
- Dummy/Placeholder/Debug/Testflächen
- Math.sin/Math.cos-Wackel-Hack
- reine Zoom/Fade/Popup-Bewegung als komplette Erklärung
- Bewegung nur für Frame-Diff
- „erst Tests bestehen, später hübsch machen“

Phase 3 darf den fertigen Phase-1-Code nicht ersetzen oder vereinfachen.

PHASE-3-DISPATCH
Jede Animationsszene muss als type=animation mit animationId in der Composition vorkommen und über customAnimations[animationId] an die exakte Phase-1-Komponente gebunden werden. Fehlendes Binding muss den Render hart abbrechen. Kein CTA-/Caption-only-/Dummy-Fallback.

LIEFERUNG PHASE 1
- 01-script/script-fliess-text.txt
- vollständiger Szenenplan
- scene-index.json
- cover.txt
- bildwelt.txt
- jeder bildprompt.txt vollständig
- alle-bildprompts.txt vollständig, Strict-Single-Job
- für jede Animation: szene.md + remotion.md + fertige animation.tsx
- recherche-quellen.md
- animationen.md
- caption.txt + Instagram/TikTok/Facebook/Snapchat
- word-timings.json bleibt ausschließlich Phase-2-Platzhalter
- Claude-Code-Auftrag, falls phase3Executor=claude-code

ABSCHLUSSPRÜFUNG PHASE 1
- keine Platzhalter außer expliziten Phase-2-Timingfeldern
- Fakten geprüft
- Bildbeats max. 6 s planbar
- V9-Bildwelt in jedem Bildprompt
- deep-black Hintergrund in jedem Bildprompt
- keine feste Objektanzahl
- keine Realistik / Produktfoto-Optik / UI / Flowchart / Clutter
- Marken/Logos erkennbar aber stilisiert
- Einzelprompts bleiben mittel-lang
- jede Animation erfüllt den Phase-1-Animationsvertrag und passt visuell zur V9-Welt
- Animations-Stage erzeugt keinen eigenen Hintergrund
- Animationen sehen ohne Ton verständlich und hochwertig aus
- keine kreative Arbeit für Phase 3 übrig
```

## Repo-Prüfung

```bash
npm run validate:image-world
npm run validate:reel-background
npm run reel:validate -- <Reel-Pfad>
npm run reel:ready -- <Reel-Pfad>
```
