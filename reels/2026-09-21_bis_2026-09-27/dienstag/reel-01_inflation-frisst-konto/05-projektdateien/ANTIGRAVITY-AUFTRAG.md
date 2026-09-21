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

LITERAL_FIRST_POLICY: Literal first, creative second.

FUTURE IMAGE STORYTELLING V3 — VERBINDLICH:
- Beginne beim exakten Sprechbeat: Was passiert in der echten Welt wirklich? Diese Situation ist die erste Wahl für das Bild.
- Zeige einen sofort erkennbaren Finanz-/Alltagskontext wie Überweisung, Rechnung, Karte, Konto, Einkauf, Vertrag, Bankkontakt oder Zahlung, wenn dieser Kontext im Sprechbeat vorkommt.
- Das Bild muss die gesprochene Aussage direkt zeigen; es darf nicht nur allgemein zum Oberthema Finanzen passen.
- SUBTITLE-OFF-TEST: Ohne Überschrift und Untertitel muss ein fremder Zuschauer ungefähr erkennen können, was gerade erklärt wird.
- TRANSFERABILITY-TEST: Könnte dasselbe Bild unverändert auch zu fünf anderen Finanzthemen passen, ist es zu generisch und muss neu geplant werden.
- Metaphern sind nur Fallback. Nutze sie erst, wenn die reale Situation visuell deutlich schlechter oder unverständlich wäre.
- Förderbänder, Schienen, Schranken, Käfige, Fantasie-Portale, Sortieranlagen, große Hebel und ähnliche Maschinen sind bei statischen Bildern KEINE Standard-Erklärung.
- Wird trotzdem eine Metapher gewählt, muss VISUAL_STRATEGY=metaphor gesetzt und METAPHOR_JUSTIFICATION konkret ausgefüllt werden.
- Ursache/Wirkung bleibt erwünscht, aber sie soll möglichst innerhalb der realen Situation stattfinden und nicht automatisch in eine Fantasiemaschine übersetzt werden.
- Kurze deutsche Objektlabels sind nur Ergänzung. Die Situation muss ohne Label verständlich bleiben.
- Weniger, passendere Objekte schlagen eine dekorative Finanzobjekt-Sammlung.
- Ein zusätzliches gutes Bild ist besser als ein überladener oder nur ungefähr passender Still.
- Die fünf Planwerte aus dem Bildprompt müssen identisch in scene-index.json unter scene.imageStorytelling stehen; Prompt und Index dürfen sich nicht widersprechen.

## Future V3 Finalisierung

FUTURE_PRODUCTION_STANDARD: finanzneo-future-production-v3

Vor Post-Render-QA wird der finale Candidate automatisch auf -16 LUFS / -1 dBTP gemastert. Nicht manuell umgehen. Bei langen statischen Holds lieber zusätzliche Visual Beats nutzen. Animations-Hauptmechanik groß und bildfüllend halten; excessive empty space gilt als Qualitätsfehler.

## Future Reel Presentation V1

FUTURE_REEL_PRESENTATION: finanzneo-future-reel-presentation-v1

Scene-01 bleibt Cover-Sonderfall ohne normalen Header/Icon. Bei Cover-Hook V3 starten globale audio-synchrone Captions mit dem ersten gesprochenen Wort. Ab scene-02 sind SceneHeader+Icon+Captions Pflicht. Hauptvisuals groß halten; keine ähnlichen Standard-Objektkompositionen für verschiedene Animationen.

## Phase 1 Motion Direction Lock

PHASE1_MOTION_DIRECTION: finanzneo-phase1-individual-motion-v1
MOTION_CORE: finanzneo-motion-core-v1

Phase 3 darf die in Phase 1 hergeleitete Hauptmechanik nicht durch eine bequemere Standardanimation ersetzen. Für neue Animationen ist src/motion die kanonische technische Basis. Lottie/Icon/SVG-Support darf ergänzen, aber nicht die kreative Hauptlogik austauschen. Vor produktivem Render müssen Motion Art Direction und Playwright Visual QA dokumentiert PASS sein.

# Reel Quality Guards V1

REEL_QUALITY_GUARDS: finanzneo-reel-quality-guards-v1

## Szene ist exklusiv
- IMAGE: Flow-Bild als Hauptvisual + Titel/Header/Caption. Keine erklärende Remotion-Hauptanimation darüber.
- ANIMATION: eigenständige Remotion-Hauptanimation. Kein Flow-Bild als Hauptvisual.

## Tatsächliche Animations-Diversität
Nicht nur motionDesign-Metadaten vergleichen. Der Validator liest die echte animation.tsx. Dieselben konkreten Physical-Primitives dürfen nicht drei der letzten vier Animationsszenen dominieren; stark überlappende direkte Nachbarszenen brauchen eine konkrete repetitionJustification.

## Horizontale Safe-Zone
Animations-Hauptobjekte bleiben inklusive perspektivischem Sicherheitsrand innerhalb X=72–1008. Statisch prüfbare JSX-Objekte werden vor Render validiert. Im finalen MP4 werden zusätzlich die äußeren Randbänder der Visualzone gesampelt; sichtbare Animationsinhalte dort sind ein FAIL.
