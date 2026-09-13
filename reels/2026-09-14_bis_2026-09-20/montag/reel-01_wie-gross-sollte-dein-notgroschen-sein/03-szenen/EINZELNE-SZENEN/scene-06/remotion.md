# scene-06 — Remotion

ANIMATION_QUALITY_LOCK: finanzneo-phase1-animation-code-v1
PREMIUM_VISUAL_LOCK: finanzneo-premium-physical-animation-v2
VISUAL_TARGET_WORLD: finanzneo-stylized-3d-animated-black-v9

## Sprechtext
Der Unterschied ist einfach: Girokonto bedeutet Alltag. Tagesgeld bedeutet Rücklage.

## Mechanik
MECHANIC_ID: daily-spending-moves-giro-reserve-stays

PRIMARY_ACTION: Girokonto und Tagesgeld stehen nebeneinander → Gehalt landet zunächst im Girokonto → eine Alltagsrechnung zieht Geld aus dem Girokonto → der Tagesgeld-Reservetank bleibt stabil → Ergebnis zeigt ALLTAG links und RÜCKLAGE rechts.

## Pflicht
- START → MECHANISMUS → RESULT muss ohne Ton verständlich sein.
- Reale physische Objekte tragen die Erklärung.
- Mehrere koordinierte Motion-Channels mit unterschiedlicher Bewegungsphysik.
- Ergebnis mindestens 15 Frames stabil halten.
- Pure-black Canvas kommt zentral; AnimationStage bleibt transparent.
- Keine Kartenreihe, kein Dashboard, kein Flowchart und kein Fortschrittsbalken als Hauptgeschichte.
- Lottie nur als optionale Mikro-Ergänzung, niemals als Ersatz für die Hauptmechanik.
- SFX erst in Phase 3 anhand von sound-design.md framegenau ergänzen.
