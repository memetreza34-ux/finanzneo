# Phase 1 Hybrid Motion Direction V2

PHASE1_MOTION_DIRECTION: finanzneo-phase1-hybrid-motion-v2
FINANCE_MOTION_LIBRARY: finanzneo-finance-motion-library-v1

## Verbindliche Reihenfolge

Sprechpunkt analysieren -> sichtbares Verständnisziel -> visuelle Frage -> beste Hauptmechanik definieren -> Finance Motion Library auf echten Best-Fit prüfen -> Library parametrisieren ODER individuell bauen -> motionDesign -> animation.tsx.

## Library ist Werkzeug, kein Käfig

Die Library wird erst geprüft, nachdem die inhaltlich richtige Mechanik feststeht. Passt eine vorhandene Finance-Motion-Mechanik semantisch wirklich, wird sie bevorzugt und mit szenenspezifischen Parametern verwendet. Passt keine ausreichend gut, wird ohne Umweg eine individuelle Animation gebaut.

## Wiederverwendung

Eine gute Mechanik darf innerhalb eines Reels und über viele Reels hinweg wiederverwendet werden. Wiederholung ist erlaubt, wenn die Finanzlogik dieselbe ist; nur Werte, Labels, Gewichtungen, Richtung, Timing oder andere echte Inhaltsparameter ändern sich. Künstliche Einmaligkeit ist kein Qualitätsmerkmal.

## Wachstum der Library

Eine individuell gebaute Animation kann als libraryPromotionCandidate markiert werden, wenn ihre Mechanik verallgemeinerbar und parametrisiert wiederverwendbar ist. Nicht jede Custom-Animation muss in die Library.

## Pflichtfelder

Jede Animationsszene dokumentiert spokenPoint, viewerMustUnderstand, visualQuestion, chosenMechanism, mechanismRationale, implementationDecision, financeMotionId, libraryFitReason, parameterPlan, customReason und libraryPromotionCandidate.
