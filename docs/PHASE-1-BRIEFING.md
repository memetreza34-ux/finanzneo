# Phase-1-Briefing für ChatGPT

Dieses Dokument ist die verbindliche Übergabe an Phase 1. Bei Widersprüchen gilt `CLAUDE.md`.

## So wird es benutzt

1. Den Block unter „Briefing zum Kopieren“ verwenden.
2. `[THEMA]` ersetzen.
3. Phase 1 liefert alle Inhalte inklusive fertiger `animation.tsx`.
4. Phase 2 ergänzt Bilder, finales Voiceover und echte Wort-Zeitstempel.
5. Phase 3 startet erst mit `npm run reel:ready -- <Reel-Pfad>`.

---

Kanonischer Themen-Scope: `docs/CONTENT-SCOPE.md`.

## Briefing zum Kopieren

```text
Du erstellst Phase 1 eines FinanzNeo-Reels.

THEMA: [THEMA]

ZIEL
FinanzNeo behandelt auf Deutsch **alles rund um Finanzen**. Das Thema darf Grundlagen oder fortgeschritten sein, zeitlos oder aktuell, praktisch oder analytisch. Erlaubt sind unter anderem Geld, Sparen, Investieren, Börse, ETFs, Aktien, Krypto, Banken, Kredite, Schulden, Steuern, Versicherungen, Immobilien, Gehalt, Rente, Sozialleistungen, Verbraucherfinanzen, Betrugsmaschen, Unternehmen, Finanzmärkte, Inflation, Wirtschaft mit klarem Finanzbezug, Gesetze/Regeländerungen sowie Formate wie „5 Dinge…“, Rankings, Vergleiche, Mythen und aktuelle Finanz-News.

Direkte Du-Ansprache, einfach, professionell, visuell hochwertig. **Einfach erklären ist Stil, keine Themenbegrenzung.** Plattformen: TikTok, Instagram Reels, Facebook Reels, Snapchat. Keine YouTube Shorts.

FORMAT
- 1080×1920, 9:16, 30 fps
- 60–90 Sekunden
- Hook in den ersten 2 Sekunden
- Ziel 14–16 Visual-Beats, Standard etwa 15
- ungefähr 60 % Bild / 40 % Remotion-Animation, Qualität vor Quote
- nie mehr als zwei Bildszenen direkt hintereinander
- Bildbeat ideal 3,5–5,5 s, absolut max. 6 s
- Animationsbeat ideal 4,5–7 s
- alle Flow-Bildszenen strikt 1:1; scene-01 ist automatisch das Cover, kein separates Cover und kein Bild 00

SKRIPT
Schreibe von Anfang an SZENE FÜR SZENE. Nicht erst Fließtext schreiben und nachträglich schneiden.

Wortbudget:
- Bildszene: 9–14 Wörter, absolut max. 15
- Animationsszene: 11–16 Wörter, absolut max. 17

Bild = Zustand/Situation/Gegenstand/Beispiel.
Animation = Veränderung/Mechanismus/Rechnung/Vergleich/Vorher-Nachher.

Logik: Hook → Problem → Erklärung → Beispiel → Lösung/Merksatz → CTA.
Zahlen, Datenstände und aktuelle Änderungen nur nach Prüfung. Bei News, Gesetzen, Steuern, Leistungen, Märkten oder anderen zeitabhängigen Themen immer aktuell recherchieren und Quellen dokumentieren. Keine individuelle Anlageempfehlung.

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
BILDWELT — EDITORIAL FINANCE V1
════════════════════════════════════════

FINANZNEO_IMAGE_WORLD: finanzneo-editorial-finance-v1
FINANZNEO_IMAGE_SERIES: finanzneo-editorial-consistency-v1
GENERATED_IMAGE_ASPECT_RATIO: 1:1

Kernregel:
1 gesprochener Gedanke → 1 einfache visuelle Idee → auf den ersten Blick verständlich.

Darstellung frei nach Inhalt:
- einfache Metapher
- Zahl + Objekt
- Editorial-Illustration
- Diagramm / Chart
- Prozess
- Timeline
- Vergleich
- Dokument
- Zitat + Illustration
- Unternehmen / Marke
- einfache Alltagsszene

Stil:
- überwiegend 2D oder leichtes 2.5D
- einfaches 3D nur wenn sinnvoll
- matte, ruhige Farben
- flexible Hintergründe; kein Schwarz-Zwang
- wenige große Elemente
- keine unnötige KI-Spektakel-Optik

Bildprompts:
- Englisch
- zuerst das exakte Motiv beschreiben
- keine generische Headline automatisch
- Zahlen, kurze Labels, Daten und Zitate erlaubt, wenn hilfreich

Progressive Folge:
- bei „gleiches Bild + eine Änderung“ das exakte freigegebene vorherige Szenenbild wirklich als Referenz anhängen
- Prompt trotzdem vollständig wiederholen
- pro Schritt möglichst nur eine neue Information

Kanonische Quelle: docs/FINANZNEO-IMAGE-WORLD.md

GOOGLE FLOW — STRICT SINGLE JOB
- maximal 1 laufender Bildjob
- vollständig warten
- sofort exakt umbenennen
- Bildidee + Dateiname prüfen
- erst danach nächster Bildblock
- Referenzbild nur dann anhängen, wenn die Szene ausdrücklich als Fortsetzung geplant ist

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
- 00-cover/cover.txt nur als technischer Alias auf scene-01; kein separater Cover-Prompt und kein zusätzlicher Bildjob
- bildwelt.txt
- jeder bildprompt.txt vollständig und individuell ausgeschrieben
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
- aktive Editorial-Finance-Bildwelt in jedem Bildprompt
- jede Bildidee ist auf den konkreten Sprechgedanken zugeschnitten
- Bildprompts sind Englisch
- keine generische Überschrift automatisch im KI-Bild
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
