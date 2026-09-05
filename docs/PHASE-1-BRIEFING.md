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
- FUTURE_COVER_HOOK: finanzneo-cover-hook-v3
- scene-01 = Cover + erster echter Content-Hook
- Hook beginnt mit dem ersten gesprochenen Wort: Frage / Aussage / Problem / Warnung / Kontrast / konkrete Zahl + klarer Themenanker
- keine Begrüßung, keine neutrale Einleitung und kein separater 0,1-s-/3-Frame-Cover-Clip
- Ziel 14–16 Visual-Beats, Standard etwa 15
- ungefähr 60 % Bild / 40 % Remotion-Animation, Qualität vor Quote
- nie mehr als zwei Bildszenen direkt hintereinander
- Bildbeat ideal 3,5–5,5 s, absolut max. 6 s
- Animationsbeat ideal 4,5–7 s
- alle Flow-Bildszenen strikt 1:1; scene-01 ist automatisch das Cover UND der erste Content-Beat, kein separates Cover und kein Bild 00; Frame 0 ist nur der Cover-Snapshot derselben Hook-Szene

SKRIPT
Schreibe von Anfang an SZENE FÜR SZENE. Nicht erst Fließtext schreiben und nachträglich schneiden.

SZENE 01 — HARTE HOOK-REGEL
- scene-01 ist bereits der erste gesprochene Inhalt, nicht nur ein Titelbild
- erste gesprochene Zeile wird zusätzlich als `scene-01.hook.spokenLine` gespeichert
- `script-fliess-text.txt` muss exakt mit dieser Zeile beginnen
- `scene-01.hook.form`: question | claim | problem | warning | contrast | number
- `scene-01.hook.topicAnchor`: konkretes Thema/Objekt, das sofort erkennbar sein muss
- Cover-Headline muss selbst als Hook funktionieren, nicht nur als neutrale Themenbezeichnung
- Voiceover startet in scene-01; Captions dürfen nach Frame 0 bereits in scene-01 beginnen

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
- Inhalt realitätsnah und aus echten Alltagssituationen gedacht
- Darstellung klar stylized 3D, niemals fotorealistisch
- Gegenstände behalten glaubwürdige Proportionen, Aufbau und erkennbare Details
- semi-realistische Objektstruktur und Materialien, aber sichtbar stilisiertes Rendering
- hochwertig, sauber und professionell; nicht wie Spielzeug oder Icon-Pack
- Bild erklärt den gesprochenen Punkt und ist nicht nur Dekoration
- jede Szene darf anders komponiert sein, muss aber nach derselben Welt aussehen

ERKLÄRLOGIK — PFLICHT
- zuerst die konkrete reale Situation zeigen
- danach sichtbar machen: Was passiert? Was ist betroffen? Was löst oder verändert es?
- Ursache und Wirkung möglichst im selben Bild verständlich machen
- komplette Erklärszene statt einzelner schwebender Finanzsymbole
- vertraute reale Gegenstände nutzen, wenn sie zum Sprechtext passen: z. B. Waschmaschine, Rechnung, Konto-Unterlagen, Kalender, Einkaufsbeutel, Smartphone, Haushaltskosten
- Zuschauer muss die Aussage in ungefähr 1–2 Sekunden auch ohne Ton verstehen
- der Zuschauer darf keine Metapher entschlüsseln müssen
- Schild, Pfeil, Münze, Tresor usw. dürfen unterstützen, aber niemals die reale Situation ersetzen

HINTERGRUND — PFLICHT
- ein nahtloser deep-black Hintergrund
- sauber, minimal, ruhig
- ein kleiner glaubwürdiger Szenenkontext wie Küche, Waschecke, Schreibtisch oder Bankumgebung ist erlaubt, wenn er beim Erklären hilft und optisch in die schwarze Welt übergeht
- kein heller Studiohintergrund
- keine störenden farbigen Hintergrundzonen

OBJEKTE + KOMPOSITION
- vollständige verständliche Szene statt Symbolsammlung
- klare Hauptsituation oder Hauptaktion
- KEINE feste Objektanzahl
- so viele reale Kontextobjekte wie nötig, so wenige wie möglich
- zusätzliche Objekte nur, wenn sie die Aussage besser oder eindeutiger machen
- keine Props nur zum Auffüllen
- wichtige Gegenstände groß und direkt erkennbar
- keine winzigen Szenen, in denen man Rechnungen, Labels oder Handlungen nicht lesen kann

DEUTSCHE BESCHRIFTUNGEN
- kurze deutsche Objektlabels sind ausdrücklich erlaubt und erwünscht, wenn sie Unklarheit verhindern
- Label direkt am passenden Objekt/Zustand platzieren
- Beispiele: „Notgroschen“, „Girokonto“, „Tagesgeld“, „Reparatur 280 €“, „Dispo“, „Dauerauftrag“, „Urlaub“, „Shopping“
- Labels kurz, gut lesbar und funktional
- keine Headline, kein Untertitel, kein CTA und kein langer Erklärungssatz im generierten Bild

MARKEN + LOGOS
Wenn Marke, Bank, App oder Logo relevant ist:
- Kernidentität erkennbar ähnlich halten
- aber als vereinfachtes 3D-Element in derselben Welt darstellen
- kein flach aufgeklebtes echtes Logo
- kein Website-/App-Screenshot
- kein fotorealistisches Markenprodukt oder realistische Marken-UI

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
- glaubwürdige Materialhinweise
- gute Trennung vom schwarzen Hintergrund
- weiche Kontaktschatten

STRENG VERBOTEN
- Fotorealismus / Stockfoto-Look
- generische Finance-Icon-Komposition als Haupterklärung
- nur Tresor + Schild + Münzen + Pfeil ohne reale Situation
- abstraktes Symbolrätsel, das Interpretation verlangt
- echtes Produktfoto
- flach aufgeklebtes echtes Logo / Screenshot-Marken-UI
- Dashboard / App UI als Hauptkomposition
- Flowchart als Hauptkomposition
- kleine Kästen, floating Info-Cards, technische UI-Flächen
- Microchip/Circuit-Look
- winzige Miniaturdarstellung, in der der Inhalt schlecht lesbar ist
- unnötiger Clutter

PROMPT-QUALITÄT — PFLICHT
- jeder einzelne Bildprompt wird individuell für exakt diesen Sprechpunkt vollständig ausgeschrieben
- niemals nur ein paar Stichwörter, eine Kurzbeschreibung oder eine generische Vorlage verwenden
- Google Flow darf die Bedeutung der Szene nicht selbst erfinden müssen
- Reihenfolge im Prompt: konkrete reale Situation und sichtbare Ursache/Wirkung → exakte kurze deutsche Labels, wenn hilfreich → Style → Background → Composition → Forbidden
- mittel-lang, aber konkret genug, dass Gegenstände, Situation, Beziehung und Aussage eindeutig sind
- keine riesigen Regelblöcke, die die konkrete Szene überdecken

BILD-QA
Bild verwerfen und dieselbe Bildnummer neu erzeugen, wenn:
- es nur hübsche Finanzsymbole zeigt, aber den gesprochenen Inhalt nicht erklärt
- man erst überlegen muss, was Tresor/Schild/Pfeile bedeuten sollen
- die Alltagssituation nicht klar erkennbar ist
- Ursache und Wirkung nicht verständlich sind
- wichtige deutsche Labels fehlen, obwohl die Szene sonst mehrdeutig ist
- Gegenstände wie generische Icons oder Spielzeug wirken statt wie erkennbare reale Objekte
- es fotorealistisch/stockfotoartig wird
- der Hintergrund nicht tiefschwarz ist
- zu viel Clutter entsteht
- die Szene wie UI/Flowchart wirkt
- eine Marke wie aufgeklebt/Screenshot aussieht

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
- V9-Bildwelt in jedem Bildprompt
- jeder Bildprompt zeigt eine konkrete realitätsnahe Erklärszene statt abstrakter Symbolsammlung
- Ursache/Wirkung ohne Ton verständlich
- deutsche Objektlabels verwendet, wenn sie Mehrdeutigkeit verhindern
- deep-black Hintergrund in jedem Bildprompt
- keine feste Objektanzahl
- keine Fotorealistik / Produktfoto-Optik / UI / Flowchart / Clutter
- keine generischen Tresor-Schild-Münzen-Symbolbilder als Ersatz für den Inhalt
- Marken/Logos erkennbar aber stilisiert
- Einzelprompts bleiben mittel-lang, vollständig und individuell geschrieben
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
