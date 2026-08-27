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
- Visualzone Y320–1480
- Untertitel bottom340
- Header mittig, normaler weißer Text + einfaches Linien-Icon
- keine Capsule, kein Chip, kein Panel, kein erzwungenes ALL CAPS
- Bilder und Animationen nutzen die Visualzone groß und sichtbar

ZWISCHENÜBERSCHRIFT
Jede Szene braucht eine natürliche Aussage oder Frage, meist 3–6 Wörter, ungefähr max. 40 Zeichen. Kein reines Stichwort und keine reine Zahl. Icon muss zur Aussage passen.

Erlaubte Icons:
euro, clock, hourglass, shield, check, cross, coins, bank, rocket, wallet, percent, flame, target, bulb, lock, trending, calendar, phone, search, receipt, repeat, document, list, warning

headerTone:
- default/positive = grünes Icon
- warning = rotes Icon
- money = goldenes Icon
- neutral = weißes Icon
Headertext bleibt weiß.

UNTERTITEL
- aktuelles Wort grün, Rest weiß
- max. 2 Zeilen
- 50 px Basis, Weight 800
- kein Stroke, kein Jump/Scale
- kein Wort der nächsten Szene vor der Szenengrenze

════════════════════════════════════════
BILDWELT — PREMIUM PHYSICAL EDITORIAL V8
════════════════════════════════════════

Jeder Bildprompt enthält:

FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3
FINANZNEO_SERIES_LOCK: finanzneo-same-world-v1
STYLIZED_3D_LOCK: finanzneo-stylized-3d-editorial-v5
PREMIUM_VISUAL_WORLD_LOCK: finanzneo-premium-physical-editorial-v8
GENERATED_IMAGE_ASPECT_RATIO: 1:1
FLOW_AGENT_PROTOCOL: finanzneo-flow-sequential-v1
GOOGLE FLOW – FINALER DATEINAME:
Bild XX - Kurzer Szenenname.png

ZIELWELT
Nicht mehr UI/Dashboard/Flowchart. Stattdessen hochwertige stylized-3D Financial Editorial Object World.

PFLICHT PRO BILD
- EIN dominantes, sofort erkennbares physisches Hero-Objekt
- Hero ungefähr 45–65 % der nutzbaren Komposition
- nur 2–4 unterstützende konkrete Objekte
- medium-close 3/4-Kamera, keine weit entfernte Isometrie
- starke Silhouette
- klare Vordergrund-/Hero-/Hintergrundstaffelung
- sichtbare Dicke, rounded industrial bevels, glaubwürdiges Gewicht
- purposeful overlap, Kontakt-Schatten, Ambient-Occlusion-Eindruck
- cinematic soft key light von vorn/oben links
- kontrolliertes Emerald-Rim-Light von hinten rechts
- lesbare Schattenseite
- dunkle Struktur + Creme/Weiß + mindestens ein semantischer Akzent

MATERIALROLLEN
- Struktur: satin dark-emerald anodized metal / Premium-Polymer
- Neutral: warmes Ivory/Creme, Keramik-/Steinwirkung
- Geld/Wert: gebürstetes Messing / sculpted gold
- Warnung/Kosten: warmes Rot-Orange
- Glas: nur sparsam als Sekundärmaterial

PHYSISCHES STORYTELLING
Zeige konkrete Ursache-Wirkung mit Objekten, z. B. Karte → Terminal, Gebühren-Tag → Beleg, Währungsobjekt → anderer Weg, Bankobjekt → übernimmt Umrechnung, Gate → öffnet/schließt, Waage → kippt, Beleg → verlängert sich.

TEXT IM BILD
- keine Headline, kein Untertitel, kein CTA, kein erklärender Satz
- nur kurze deutsche Objektlabels, meist 1–2 Wörter
- Labels als physische Plakette/Sticker/Tag/Prägung
- Aussage muss auch ohne Labels verständlich sein

GERÄTE
ATM, Kartenterminal, Telefon oder Rechner sind erlaubt, wenn sie das konkrete physische Hero-Objekt sind. Kein UI-Mockup daraus machen.

STRENG VERBOTEN
- Dashboard / Control Panel
- Flowchart als Hauptkomposition
- kleine Kästen mit dünnen Linien
- floating UI cards/tiles/chips/pills/widgets/HUD
- generische rechteckige Info-Cards als Hauptobjekte
- Neon-Liniennetz als Hauptmotiv
- Microchip/Circuit-Board
- Gameboard, Orbit, Vier-Ecken-Kacheln
- tiny isometric diorama
- sterile Produktwerbung ohne erklärende Handlung
- kleines Objekt in riesigem dunklem Leerraum
- flache Poster-Komposition
- monochrom-grüner Gesamtlook
- Fotorealistik/Office-Still-Life
- Pixar/Clay/Toy

BILD-QA
Bild verwerfen und neu erzeugen, wenn Hero zu klein ist, zu viele kleine Objekte konkurrieren, UI/Flowchart-Look entsteht, Material/Tiefe/Licht zu schwach sind, zu viel Leerraum bleibt, alles fast nur grün ist oder die Aussage nur durch Text verständlich wird.

GOOGLE FLOW — STRICT SINGLE JOB
- maximal 1 laufender Bildjob
- nur aktuellen Bildblock ausführen
- auf Ergebnis warten
- sofort exakt umbenennen
- Premium-QA
- Fehler: dieselbe Bildnummer neu
- erst danach nächsten Bildblock freischalten
- kein Batch, kein Queueing, keine Galerie/Collage, kein Nutzer-„weiter“
- keine Bildreferenz

════════════════════════════════════════
ANIMATION — PREMIUM PHYSICAL ANIMATION V2
════════════════════════════════════════

Phase 1 ist vollständig verantwortlich. Für jede Animationsszene müssen `remotion.md` UND eine fertige `animation.tsx` existieren.

Locks:
- animationQualityLock: finanzneo-phase1-animation-code-v1
- animationPremiumVisualLock: finanzneo-premium-physical-animation-v2

PFLICHTLOGIK
STARTZUSTAND → SICHTBARER PHYSISCHER MECHANISMUS → EINDEUTIGES ERGEBNIS → Ergebnis mindestens 15 Frames stabil.

PFLICHT IM CODE
- useCurrentFrame
- ANIMATION_COLORS
- prog/interpolate/spring
- PremiumPhysicalStage
- mindestens zwei PhysicalObject-Instanzen
- mindestens eine semantische Materialrolle neutral/money/warning/positive
- RESULT_HOLD_FRAMES >= 15
- korrekter Exportname SceneXXAnimation

Pflichtkommentare:

ANIMATION_NARRATIVE
START: konkrete sichtbare Ausgangslage
MECHANISM: konkrete sichtbare Veränderung
RESULT: konkretes sichtbares Ergebnis

PREMIUM_VISUAL_NARRATIVE
HERO: großes dominantes physisches Hauptobjekt
SUPPORT: 2–4 konkrete Support-Objekte
MATERIAL: Material-/Farblogik
DEPTH: Vordergrund/Hero/Hintergrund + Lichttrennung

ANIMATIONS-ZIELWELT
Die Animation muss wie die Bildwelt wirken, nicht wie ein anderes Produkt:
- großes physisches Hero-Objekt
- 2–4 konkrete Support-Objekte
- sichtbare Dicke, Materialkanten, Schatten und Tiefe
- Creme/Weiß + Gold/Rot/Grün semantisch einsetzen
- Visualzone groß nutzen
- Mechanik durch echte Objektaktion erklären

STRENG VERBOTEN
- Dashboard-/Control-Panel-Look
- Flowchart als Hauptkomposition
- kleine Kästen mit dünnen Linien
- generische Info-Cards als Hauptsprache
- monochrom-grüne Szene
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
- Premium-V8-Bildwelt in jedem Bildprompt
- keine UI-/Flowchart-/monochrom-grüne Bildkomposition
- jede Animation erfüllt Premium Physical Animation V2
- Animationen sehen ohne Ton verständlich und hochwertig aus
- keine kreative Arbeit für Phase 3 übrig
```

## Repo-Prüfung

```bash
npm run validate:image-world
npm run reel:validate -- <Reel-Pfad>
npm run reel:ready -- <Reel-Pfad>
```
