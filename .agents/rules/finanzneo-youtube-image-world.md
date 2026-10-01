# FinanzNeo YouTube Image World

## Scope

Diese Regel gilt NUR für FinanzNeo YouTube-Longform-Bildgenerierung. Reel-Regeln und die bestehende Reel-Bildwelt bleiben unverändert.

`CLAUDE.md` bleibt höchste Repo-Autorität.

## YouTube visual lock

- `FINANZNEO_WORLD_ID: finanzneo-connected-studio-v3`
- `FINANZNEO_SERIES_LOCK: finanzneo-same-world-v1`
- `YOUTUBE_VISUAL_WORLD_LOCK: finanzneo-youtube-animated-feature-3d-v1`
- horizontal 16:9

## Direct style reference

Für `youtube/video-01_notgroschen` ist die direkte Stilreferenz:

`04-visuals/00-ALLE-BILDER-HIER-REIN/YouTube Bild 01 - Waschmaschine kaputt.png`

Bild 01 ist NICHT nur eine thematische Referenz, sondern der verbindliche Render-/Look-Anker für alle weiteren Flow-Bilder dieses Videos.

Vor jedem weiteren Bild muss der Agent Bild 01 als visuelle Referenz verwenden bzw. in Flow als Reference/Style Image auswählen, wenn diese Funktion verfügbar ist. Zu übernehmen sind:

- Grad der 3D-Stilisierung
- weiche, gerundete Formen
- vereinfachte, aber sofort erkennbare Objekte
- Materialgefühl
- Lichtqualität
- Kontrast
- Tiefenwirkung
- Kameragefühl
- Schwarzwelt-Integration
- Farbintensität
- hochwertiger Animationsfilm-Look

Nicht kopieren: Motiv, konkrete Objektpositionen oder Komposition von Bild 01.

## Core look — animated feature, not realism

Ziel ist ein hochwertiger, filmischer 3D-Animationslook im Sinne moderner großer Animationsfilme — vom Nutzer als „Pixar-3D“ beschrieben — ohne Figuren oder Designs aus existierenden Filmen zu kopieren.

Die Welt ist REALITÄTSNAH im Sinn von: Gegenstände sind sofort als Waschmaschine, Auto, Rechnung, Konto, Haus usw. erkennbar.

Die Welt ist NICHT REALISTISCH im Sinn von Fotorealismus. Alles soll sichtbar als stylisierte 3D-Animation gerendert wirken.

Pflicht:
- clearly stylized animated-feature 3D
- smooth rounded geometry
- simplified forms and details
- soft sculpted surfaces
- cinematic soft lighting
- strong readable silhouettes
- appealing proportions
- controlled depth of field
- polished animated-film materials
- expressive but clean composition

Nicht erwünscht:
- photographic material response
- live-action look
- real-camera stock-photo appearance
- semi-photorealistic humans
- photorealistic cars or rooms
- realistic office/product-render aesthetic

Wenn Menschen vorkommen, sind es klar stilisierte 3D-Animationsfiguren, keine real wirkenden Personen.

## Representation freedom

Der Inhalt darf frei und kreativ dargestellt werden. Eine reale Szene ist KEIN Default.

Erlaubt sind innerhalb derselben Bildwelt:
- einzelne große 3D-Objekte frei im Raum
- schwebende Objektgruppen
- einfache 3D-Diagramme
- Charts und Kurven als physische stylisierte 3D-Objekte
- große Zahlen
- Zeitachsen
- Vorher/Nachher
- Links/Rechts-Vergleiche
- räumliche Geld-/Reserve-Mechaniken
- reduzierte Alltagskulissen, wenn der Ort für die Aussage wichtig ist
- stilisierte 3D-Charaktere, wenn Menschen die Aussage besser tragen

Diagramme und Charts dürfen ausdrücklich als Bild erzeugt werden, solange sie dieselbe animierte 3D-Material- und Lichtwelt besitzen und nicht wie Software-UI aussehen.

## Simplicity + entertainment

Ein Bild = ein klarer Gedanke.

- wenige große Elemente
- klare Hierarchie
- sofortige Verständlichkeit
- keine Pflicht, den ganzen Frame zu füllen
- schwarzer Negativraum ist erlaubt
- lieber 2 einfache Bildslots als 1 überladenes Bild, wenn Phase 1 dies sauber plant
- abwechslungsreiche Kompositionen statt wiederholter Schreibtische
- spannend durch Form, Tiefe, Perspektive, Größenunterschiede und klare visuelle Mechanik

## Palette

- deep black als Hauptbühne
- emerald green für Schutz/Reserve/positive Lösung
- warm red-orange für Kosten/Risiko/Verlust
- ivory/soft gray für neutral
- restrained gold für Geld/Wert

Keine blau/lila Cyberpunk-Welt und kein fremdes Neon-Farbsystem.

## Text

Nur kurze ausdrücklich angeforderte deutsche Objektlabels.
Keine automatisch erfundenen Headlines wie `FinanzNeo V9`.
Keine Untertitel, CTA, langen Erklärtexte oder UI-Texte im generierten Bild.

## Hard QA fail

Regenerieren, wenn das Ergebnis:
- fotorealistisch oder semi-fotorealistisch wirkt
- wie Stockfotografie aussieht
- wie Produktvisualisierung statt Animationsfilm aussieht
- einen real wirkenden Menschen zeigt
- einen fotorealistischen Auto-/Raum-Render zeigt
- vom Look von Bild 01 deutlich abweicht
- unnötig viele Elemente enthält
- wie Dashboard/App/UI aussieht
- Cyberpunk/Sci-Fi wird
- ohne Anforderung zusätzliche Texte erzeugt

## Reels are protected

Diese Regel darf keine Reel-Bildwelt, Reel-Prompts oder Reel-Validatoren umschreiben. Die Änderung ist absichtlich YouTube-only.
