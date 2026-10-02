# Reel Quality Guards V1

REEL_QUALITY_GUARDS: finanzneo-reel-quality-guards-v1

## Szene ist exklusiv
- IMAGE: Flow-Bild als Hauptvisual + Titel/Header/Caption. Keine erklärende Remotion-Hauptanimation darüber.
- ANIMATION: eigenständige Remotion-Hauptanimation. Kein Flow-Bild als Hauptvisual.

## Tatsächliche Animations-Diversität
Nicht nur motionDesign-Metadaten vergleichen. Der Validator liest die echte animation.tsx. Dieselben konkreten Physical-Primitives dürfen nicht drei der letzten vier Animationsszenen dominieren; stark überlappende direkte Nachbarszenen brauchen eine konkrete repetitionJustification.

## Horizontale Safe-Zone
Animations-Hauptobjekte bleiben inklusive perspektivischem Sicherheitsrand innerhalb X=72–1008. Statisch prüfbare JSX-Objekte werden vor Render validiert. Im finalen MP4 werden zusätzlich die äußeren Randbänder der Visualzone gesampelt; sichtbare Animationsinhalte dort sind ein FAIL.
