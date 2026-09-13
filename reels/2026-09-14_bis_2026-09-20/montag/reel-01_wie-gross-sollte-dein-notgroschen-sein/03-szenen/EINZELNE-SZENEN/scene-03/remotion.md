# scene-03 — Remotion

ANIMATION_QUALITY_LOCK: finanzneo-phase1-animation-code-v1
PREMIUM_VISUAL_LOCK: finanzneo-premium-physical-animation-v2
VISUAL_TARGET_WORLD: finanzneo-stylized-3d-animated-black-v9

## Sprechtext
Das Geld bewegt sich dort ständig: rein, raus, bezahlen. Genau dafür ist das Girokonto gemacht.

## Mechanik
MECHANIC_ID: giro-salary-in-daily-payments-out

PRIMARY_ACTION: Gehalt kommt als echter Geldstapel ins Girokonto → Miete und Einkauf erscheinen → zwei Teilbeträge verlassen das Girokonto → beide Alltagsausgaben werden bezahlt → Girokonto bleibt als aktives Alltagskonto sichtbar.

## Pflicht
- START → MECHANISMUS → RESULT muss ohne Ton verständlich sein.
- Reale physische Objekte tragen die Erklärung.
- Mehrere koordinierte Motion-Channels mit unterschiedlicher Bewegungsphysik.
- Ergebnis mindestens 15 Frames stabil halten.
- Pure-black Canvas kommt zentral; AnimationStage bleibt transparent.
- Keine Kartenreihe, kein Dashboard, kein Flowchart und kein Fortschrittsbalken als Hauptgeschichte.
- Lottie nur als optionale Mikro-Ergänzung, niemals als Ersatz für die Hauptmechanik.
- SFX erst in Phase 3 anhand von sound-design.md framegenau ergänzen.
