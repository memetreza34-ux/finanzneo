# ANIMATIONEN

Phase 1 besitzt die kreative und technische Verantwortung. Pro Animationsszene: remotion.md + produktionsreife animation.tsx. Lock: finanzneo-phase1-animation-code-v1.

Visuell: V9 stylized 3D animated auf transparentem Stage über zentralem pure-black Canvas. AnimationStage clippt sichtbar hart auf Y320–1400. Keine Partikel/Aurora/Grid/Glow-Hintergründe.

Pflicht: STARTZUSTAND → SICHTBARER MECHANISMUS → EINDEUTIGES ERGEBNIS → Ergebnis mindestens 15 Frames stabil. Keine Dummy-/Debug-/Wackel-/Math.sin-/Math.cos-Bewegung zum Bestehen von QA.

[REMOTION-ANIMATIONEN EINFÜGEN]

## FINANCE MOTION LIBRARY + CUSTOM ANIMATIONSVERTRAG
Premium Visual Lock: finanzneo-premium-physical-animation-v2
Story Moment Revision: finanzneo-readable-story-moment-v1
Finance Motion Library: finanzneo-finance-motion-library-v1
Visual Target World: finanzneo-stylized-3d-animated-black-v9

GRUNDSATZ:
Die Finance Motion Library ist ein Mechanik-Werkzeugkasten, KEINE Stilvorlage. Eine vorhandene Mechanik darf nur direkt gerendert werden, wenn sie sichtbar dieselbe FinanzNeo-Welt wie die Flow-Bilder trifft. Sonst wird die Mechanik individuell in der V9-Welt umgesetzt.

DIE GLEICHE STORY-LOGIK WIE BEI DEN BILDERN:
- bekannte Figuren und/oder bekannte Gegenstände tragen die Bedeutung
- Animation wirkt wie eine kleine Szene aus einem hochwertigen 3D-Animationsfilm
- es passiert sichtbar etwas: Handlung -> Reaktion -> Folge/Payoff
- intuitive Übertreibungen und Metaphern sind ausdrücklich erlaubt, wenn sie ohne Erklärung sofort verständlich sind
- Beispiel gute Richtung: mehrere bekannte Rechnungen greifen nacheinander auf dasselbe Portemonnaie zu; ein langer Kassenzettel rollt sichtbar weiter; kleine wiederkehrende Gebühren sammeln sich über Zeit
- Beispiel schlechte Richtung: abstrakter capital body, fee token, value block oder geometrischer wealth tower ohne selbsterklärende reale Bedeutung
- keine Corporate-3D-Figur als reine Dekoration; wenn eine Figur vorkommt, tragen Pose/Reaktion/Handlung die Aussage mit

Verbindliche Reihenfolge in Phase 1:
1. Sprechpunkt und sichtbares Verständnisziel bestimmen.
2. Bekannte Figur/Gegenstände oder sofort verständlichen Story-Moment bestimmen.
3. Visuelle Hauptmechanik herleiten.
4. Finance Motion Library auf semantischen Best-Fit prüfen.
5. Bei Best-Fit zusätzlich SAME-WORLD-PASS prüfen.
6. Nur bei echtem Same-World-Pass direkt parametrisieren; sonst individuelle Animation bauen.
7. Produktionsreife animation.tsx liefern.

SAME-WORLD-PASS:
- dieselbe stylized-3D-Animationsfilm-Sprache wie V9
- bekannte Finanz-/Alltagsobjekte bevorzugen, wenn sie den Punkt klarer machen
- intuitive physische Übertreibung ist erlaubt, abstrakte erfundene Finanzkörper sind kein Default
- Emerald/Gold/Red-Orange bleiben Rollenfarben, aber Farbe allein ersetzt keine Bedeutung
- Ursache -> sichtbare Aktion -> Reaktion -> Payoff muss ohne Untertitel grundsätzlich verständlich sein

LAYOUT-VERTRAG:
- animation.tsx liefert NUR transparenten visuellen Inhalt für die Visualzone
- der globale Reel-Canvas bleibt #000000
- Header und Captions gehören ausschließlich dem globalen Reel-Layout
- lokale SceneShells, lokale schwarze Vollflächen, eigene Header und eigene Captions in animation.tsx sind verboten
- AnimationStage bleibt Y320–1400 und clippt den visuellen Inhalt zentral

Qualitätsregeln:
- START -> sichtbare Ursache/Aktion -> klares RESULT/PAYOFF
- ein klarer FOCAL_PATH
- PRIMARY_ACTION trägt die Erklärung; Nebenbewegungen unterstützen nur
- CAMERA_ROLE bewusst festlegen: still, follow, push oder reframe
- Ergebnis mindestens 15 Frames stabil halten
- kurze deutsche Labels dürfen helfen, tragen aber nie allein die Erklärung
- Parameter müssen exakt zum Sprechpunkt passen; kein Template-Füllmaterial

Weiterhin verboten als Hauptsprache:
- generische Karten-/Kästchenreihe
- Lade-/Fortschrittsbalken als Ersatz für die Finanzmechanik
- Dashboard-/Control-Panel-/App-UI-Look
- Flowchart als Hauptkomposition
- kleine Boxen mit dünnen Verbindungslinien
- reine Texttafel mit Fade/Scale
- Partikel/Aurora/Grid/Glow/Gradient als Animationshintergrund
- dekorative Bewegung ohne erklärenden Mechanismus

## Future V3 Framing

FUTURE_PRODUCTION_STANDARD: finanzneo-future-production-v3

Die Hauptmechanik muss groß und klar lesbar sein. Weiter Kontext ist nur erlaubt, wenn die Story ihn braucht und anschließend ein näherer/größerer Mechanikzustand folgt. Post-Render-QA misst reale Visualbelegung.

## Future Reel Presentation V1

FUTURE_REEL_PRESENTATION: finanzneo-future-reel-presentation-v1

Animationen müssen sich sichtbar unterscheiden, nicht nur technisch. motionDesign vollständig ausfüllen; die tatsächlichen TSX-Hauptobjekte werden zusätzlich durch den Source-Diversity-Guard geprüft.

## Phase 1 Hybrid Motion Direction V2

PHASE1_MOTION_DIRECTION: finanzneo-phase1-hybrid-motion-v2
FINANCE_MOTION_LIBRARY: finanzneo-finance-motion-library-v1

Erst Sprechpunkt -> Verständnisziel -> visuelle Frage -> beste Mechanik. Danach Finance Motion Library prüfen. Bei echtem Best-Fit library-best-fit + financeMotionId + konkrete parameterPlan verwenden; sonst custom-build. Gute Custom-Mechaniken dürfen später Library-Kandidaten werden.
