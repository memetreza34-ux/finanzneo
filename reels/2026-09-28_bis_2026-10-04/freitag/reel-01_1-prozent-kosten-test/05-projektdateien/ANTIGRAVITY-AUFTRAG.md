# ANTIGRAVITY — PHASE 3

Finale Nutzerbilder, Voiceover und echte Wort-Timings integrieren. Danach Preflight → Candidate → Render-QA → Export.


COVER_HOOK_CONTRACT: finanzneo-cover-hook-v3

## Szene 01 — harter Render-Vertrag
- Exakter Reel-Titel ist ab Frame 0 sichtbar; kein Intro/Fade davor.
- Kein normaler SceneHeader und kein Header-Icon in scene-01.
- Sobald das Voiceover ab dem ersten gesprochenen Wort startet, MUSS die globale Captions-Komponente sichtbar und wortgenau synchron sein — auch innerhalb scene-01.
- Gesprochenes Audio ohne Captions ist verboten. Eine 5–6 Sekunden lange captionlose Cover-Szene ist ein harter FAIL.
- Das Flow-Bild selbst enthält weder Titel noch Untertitel.
- Frame-0-Coverexport bleibt erlaubt; Captions erscheinen nur, wenn bei Frame 0 bereits ein Wort gesprochen wird.
- Render-QA prüft Titel, Hero-Bild und Caption-Kontinuität ab dem ersten gesprochenen Wort.


IMAGE_STORYTELLING_CONTRACT: finanzneo-image-storytelling-v3
VISUAL_FORM_REVISION: finanzneo-free-visual-form-v1

FREE_VISUAL_FORM_POLICY: Form frei, Bildwelt fest.

FUTURE IMAGE STORYTELLING V3 — FREE VISUAL FORM VERBINDLICH:
- Beginne beim exakten Sprechbeat: Was soll der Zuschauer in 1–2 Sekunden verstehen?
- Wähle danach FREI die stärkste Darstellungsform. Erlaubt sind: character-story, object-story, comparison, chart, diagram, editorial-quote, illustration, metaphor und hybrid.
- Es gibt KEINEN Zwang zu Menschen, Alltagsobjekten, Story-Szenen oder Metaphern. Ein echtes Diagramm darf die beste Lösung sein. Ein einzelnes Objekt darf die beste Lösung sein. Ein starkes Zitat-/Editorialbild darf die beste Lösung sein.
- Die Freiheit betrifft die FORM, nicht die Qualität: Jede Szene muss exakt zum Sprechbeat passen, in 1–2 Sekunden lesbar sein und wie dieselbe FinanzNeo-Serie wirken.
- V9 bleibt der STYLE-LOCK: deep-black Bühne, premium stylized 3D / hochwertige FinanzNeo-Illustrationssprache, starke Tiefe, saubere Materialien, Emerald/Gold/Red-Orange in ihren Rollen, niemals billiger Corporate-/PowerPoint-/Stock-Look.
- CHARACTER-STORY: Figur nur einsetzen, wenn Pose, Reaktion oder Handlung wirklich etwas erklärt. Keine Corporate-3D-Figur, die nur dekorativ danebensteht.
- OBJECT-STORY: Ein oder wenige bekannte Objekte dürfen allein tragen, wenn die Aussage sofort verständlich ist.
- COMPARISON: A-vs-B darf direkt, symmetrisch oder räumlich inszeniert werden, solange der Unterschied sofort lesbar ist.
- CHART/DIAGRAM: Es muss ein ECHTES Diagramm bleiben. Reale Achsen, Skalen, Werte, Kategorien, Labels und mathematisch korrekte Proportionen verwenden, soweit der Diagrammtyp sie braucht. Ein Kreisdiagramm braucht keine erfundene X-/Y-Achse; ein Linien-/Balkendiagramm schon, wenn fachlich erforderlich.
- CHART/DIAGRAM darf hochwertig 3D inszeniert werden: physische Achsen, volumetrische Balken, elegante 3D-Linien, Materialtiefe, Licht und Schatten. Aber niemals Datenlogik für Dekoration opfern.
- EDITORIAL-QUOTE: Text darf Hauptmotiv sein, wenn der Sprechbeat davon profitiert. Typografie muss Teil der FinanzNeo-Welt sein und darf nicht wie eine Standard-Social-Template-Karte aussehen.
- ILLUSTRATION: freie erklärende Illustration ist erlaubt, auch ohne Mensch und ohne reale Mini-Szene, solange Bedeutung und Finanzbezug sofort klar sind.
- METAPHOR: intuitive Metaphern und Übertreibungen sind erlaubt. Sie dürfen kein Rätsel sein.
- HYBRID: Kombinationen sind ausdrücklich erlaubt, z. B. Figur + echtes Chart, Objekt + Diagramm, Zitat + visuelle Metapher oder Vergleich + Datenvisualisierung.
- Abstrakte Fantasie-Finanzkörper wie capital body, wealth tower, value block, investment block oder fee token sind KEINE automatische Standardsprache. Nur nutzen, wenn sie bewusst als verständliche Illustration/Metapher geplant sind und den Instant-Read-Test bestehen.
- Keine Bildart bekommt eine feste Quote. Nicht künstlich pro Video zwei Menschen, zwei Charts usw. erzwingen. Der Sprechbeat entscheidet.
- Abwechslung ist erwünscht: aufeinanderfolgende Szenen sollen nicht unnötig dieselbe Kompositionsidee wiederholen.
- POWERPOINT-/EXCEL-DEFAULT ist verboten: keine dünnen Standardachsen, langweiligen Standardbalken, generischen Diagrammvorlagen oder flachen Corporate-Infografiken als finale Bildwelt.
- SUBTITLE-OFF-TEST: Ohne Untertitel muss die Hauptaussage grundsätzlich erkennbar sein; bei Editorial-Quote darf der bewusst integrierte Haupttext Teil der Aussage sein.
- TRANSFERABILITY-TEST: Könnte dasselbe Bild unverändert zu fünf anderen Finanzthemen passen, ist es zu generisch.
- DATA_INTEGRITY_TEST: Bei chart/diagram muss dieser mit PASS beginnen und konkret bestätigen, dass Werte, Proportionen, Achsen/Labels und Aussage fachlich zusammenpassen. Bei allen anderen Formen exakt: not-applicable.
- Die frühere YouTube-Phase-A-DNA bleibt Qualitätsreferenz für Licht, Tiefe, Kamera, Figuren und hochwertige 3D-Inszenierung, aber sie begrenzt NICHT die Darstellungsform.
- Prompt und scene-index.json müssen bei VISUAL_FORM, VISUAL_CONCEPT, VOICEOVER_VISUAL_MATCH, INSTANT_READ_TEST, TRANSFERABILITY_TEST und DATA_INTEGRITY_TEST identisch sein.

## Future V3 Finalisierung

FUTURE_PRODUCTION_STANDARD: finanzneo-future-production-v3

Vor Post-Render-QA wird der finale Candidate automatisch auf -16 LUFS / -1 dBTP gemastert. Nicht manuell umgehen. Bei langen statischen Holds lieber zusätzliche Visual Beats nutzen. Animations-Hauptmechanik groß und bildfüllend halten; excessive empty space gilt als Qualitätsfehler.

## Future Reel Presentation V1

FUTURE_REEL_PRESENTATION: finanzneo-future-reel-presentation-v1

Scene-01 bleibt Cover-Sonderfall ohne normalen Header/Icon. Bei Cover-Hook V3 starten globale audio-synchrone Captions mit dem ersten gesprochenen Wort. Ab scene-02 sind SceneHeader+Icon+Captions Pflicht. Hauptvisuals groß halten; keine ähnlichen Standard-Objektkompositionen für verschiedene Animationen.

## Phase 1 Motion Direction Lock

PHASE1_MOTION_DIRECTION: finanzneo-phase1-hybrid-motion-v2
FINANCE_MOTION_LIBRARY: finanzneo-finance-motion-library-v1

Phase 3 verwendet exakt die in Phase 1 festgelegte Library-Mechanik mit Parametern oder den versiegelten Custom-Code. Phase 3 darf nicht eigenmächtig zwischen Library und Custom wechseln.

# Reel Quality Guards V1

REEL_QUALITY_GUARDS: finanzneo-reel-quality-guards-v1

## Szene ist exklusiv
- IMAGE: Flow-Bild als Hauptvisual + Titel/Header/Caption. Keine erklärende Remotion-Hauptanimation darüber.
- ANIMATION: eigenständige Remotion-Hauptanimation. Kein Flow-Bild als Hauptvisual.

## Tatsächliche Animations-Diversität
Nicht nur motionDesign-Metadaten vergleichen. Der Validator liest die echte animation.tsx. Dieselben konkreten Physical-Primitives dürfen nicht drei der letzten vier Animationsszenen dominieren; stark überlappende direkte Nachbarszenen brauchen eine konkrete repetitionJustification.

## Horizontale Safe-Zone
Animations-Hauptobjekte bleiben inklusive perspektivischem Sicherheitsrand innerhalb X=72–1008. Statisch prüfbare JSX-Objekte werden vor Render validiert. Im finalen MP4 werden zusätzlich die äußeren Randbänder der Visualzone gesampelt; sichtbare Animationsinhalte dort sind ein FAIL.
