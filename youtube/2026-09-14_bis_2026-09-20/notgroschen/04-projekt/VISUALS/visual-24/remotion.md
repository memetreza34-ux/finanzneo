# Visual 24 — Remotion
MOTION_STANDARD: finanzneo-youtube-motion-v3
Viewer Change: Drei Monatskarten kippen nacheinander weg, jede schiebt denselben Goldbetrag nach rechts, und die Reserve steigt Stufe für Stufe.
Animation Intent: Routine statt monatlicher Entscheidung erklären — die Wiederholung selbst ist die Aussage.
Mechanik: recurring-month-cycle
Technik: calendar-reserve-cycle
Tool Stack: Remotion, CSS 3D, interpolate, spring
Start: Drei aufrechte Monatskarten, leere Reserve
Mechanismus: Pro Zyklus kippt eine Karte um `rotateX`, ein Goldbetrag wandert zur Reserve, die Füllung rastet per `spring` auf die nächste Stufe ein
Resultat: Alle drei Monate abgearbeitet, Reserve auf voller Höhe, Schlusszeile blendet ein
Motion Channels: Kalenderfortschritt; Reservewachstum
Timing: Alle Beats über `progressBetween` als Anteil der Szenendauer, damit Phase 3 auf das echte Voiceover retimen kann, ohne einen eingefrorenen Schwanz zu erzeugen
