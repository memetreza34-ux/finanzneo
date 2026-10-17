# Remotion-Spezifikation visual-33

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Kapitel 4 — Viele kleine Raten
- Sprechtext-Bezug: 50 € + 35 € + 25 € = 110 € — jeden Monat.
- Inhaltlicher Brief (Phase 1 Content): Drei Ratenkarten erscheinen nacheinander: „Fernseher 50 €“, „Handy 35 €“, „Kopfhörer 25 €“ — jede einzeln klein und harmlos. Dann rutschen sie zusammen zu einer Monatslast „110 € jeden Monat“, die sichtbar schwerer wirkt (z. B. Balken im Monatsbudget).
- Startet bei: „Fünfzig Euro für den Fernseher“ · Stufen bei: „Fünfzig Euro für den Fernseher“ · „Fünfunddreißig für das Handy“ · „Fünfundzwanzig für die Kopfhörer“ · „Jede Rate allein“ · „Zusammen sind es“ · „Jeden Monat“
- Viewer Change: Drei getrennte Ratenkarten erscheinen nacheinander (Fernseher 50 €, Handy 35 €, Kopfhörer 25 €), jede mit kurzem Balken und „wirkt harmlos“; dann rutschen die drei Balken aus den Karten Ende an Ende zu einem Monatsbalken zusammen, das Zählwerk zählt 50 → 85 → 110 € und zwölf Monatsfelder leuchten rot auf: „110 € jeden Monat“.
- Animation Intent: Einzeln wirkt jede Rate klein; erst das Zusammenschieben auf derselben Skala zeigt die echte Monatslast, und die Monatsreihe macht klar, dass sie jeden Monat wiederkommt.
- Mechanik: separate-installment-cards-merge-into-monthly-load
- Technik-ID: three-rate-cards-bars-slide-into-one-stacked-month-bar-with-month-repeat
- Technikbeschreibung: Drei weiße Karten mit Icon, Betrag und Balken (1 € = 8 px); bei „Zusammen“ verlassen die Balken gestaffelt ihre Karten und fügen sich zu einem 880-px-Monatsbalken (110 €) zusammen, leere gestrichelte Spuren bleiben in den Karten; Zählwerk rechts addiert beim Andocken; Reihe Jan–Dez leuchtet rot durch.
- Tool Stack: Remotion, React, src/design-system/daten.tsx, Zaehlwerk (daten.tsx), SVG-Icons
- Composition Family: merge-stack
- Motion Signature Camera: still
- Motion Signature Layout: drei Karten oben nebeneinander, Monatsbalken mit Zählwerk und Monatsreihe darunter
- Motion Signature Transformation: Einzelbalken wandern aus den Karten und verschmelzen zu einem Monatsbalken
- Startzustand: Karte „Fernseher 50 €“ mit blauem Balken (1 € = 8 px), Kennzeichnung „Beispiel: drei Finanzierungen gleichzeitig“.
- sichtbare Mechanik/Transformation: Bei „Fünfunddreißig für das Handy“ erscheint Karte Handy 35 €, bei „Fünfundzwanzig für die Kopfhörer“ Karte Kopfhörer 25 €. Bei „Jede Rate allein“ steht unter jeder Karte „✓ wirkt harmlos“. Bei „Zusammen sind es“ verlassen die drei Balken gestaffelt (8 Frames) ihre Karten und docken Ende an Ende zu einem Monatsbalken an; die Karten werden blass, leere gestrichelte Spuren bleiben; Zählwerk rot 50 → 85 → 110 €, Beschriftung „zusammen“, Monatsreihe Jan–Dez erscheint leer.
- Resultat: Bei „Jeden Monat“ leuchten Jan–Dez rot durch (fertig nach 11 Frames), „jeden Monat“ unter „110 €“; Endbild: Monatsbalken 50 € + 35 € + 25 € = 110 € jeden Monat.
- Concept A: Drei Raten fallen auf eine Waage und drücken sie nach unten — Gewicht ist keine exakte Größe.
- Concept B: Drei Karten mit Einzelbalken; die Balken wandern zu einem gemeinsamen Monatsbalken zusammen, Zählwerk addiert, Monatsreihe zeigt die Wiederholung.
- Concept C: Monatsbudget-Kreis, in dem drei Segmente erscheinen — ohne Budgetbetrag (nicht im Skript) wäre der Anteil erfunden.
- Chosen Concept: B — „einzeln harmlos, zusammen schwer“ wird als echtes Zusammenschieben auf gleicher Skala gezeigt; kein erfundenes Budget.
- Keyframe 10%: Fernseher-Karte, Balken wächst.
- Keyframe 35%: Alle drei Karten mit Balken (vor „harmlos“).
- Keyframe 65%: Monatsbalken komplett, Zählwerk 110 €, Monatsreihe noch leer.
- Keyframe 90%: Hold: 110 € jeden Monat, Monatsreihe rot.
- Sichtbare Zustände: Fernseher 50 € → Handy 35 € → Kopfhörer 25 € → Jede Rate wirkt harmlos → Zusammen 110 € → 110 € jeden Monat
- Motion Channels: Ratenkarten erscheinen einzeln, „wirkt harmlos“ unter jeder Karte, Balken rutschen zum Monatsbalken zusammen, Zählwerk 50 → 85 → 110 €, Monatsreihe leuchtet rot
- SFX-Cues: optional sanfter Klick beim Andocken jedes Balkens („Zusammen sind es“ + 24 / + 32 / + 40 Frames); leises Rollen beim Durchleuchten der Monate. Keine SFX, die mit Stimme oder Hintergrundmusik konkurrieren.

## Timing

- Code: `animation.tsx`, Export `YouTubeVisual33Animation`, Prop `beats` (Frames ab Visual-Start, aus den beatCues).
- Vorschau-Beats ohne Audio (154 Wörter/Minute geschätzt): [0, 58, 105, 152, 210, 269] Frames, Vorschau-Dauer 320 Frames bei 30 fps. Phase 3 setzt die echten Wortzeiten ein; alle Stufen hängen relativ an den Beats, das Endergebnis steht spätestens ca. 20 Frames nach dem letzten Beat und bleibt danach unverändert stehen (mind. 15 Frames Hold bis zum Schnitt).
- Regeln: helles 2D, keine Szenenüberschrift, keine eingebrannten Untertitel, Inhalt vertikal mittig um `DATEN.mitteY`, Kennzeichnung klein oben links, Größen aus Werten.

## Hinweise / Annahmen

Beispielwerte aus dem Skript: 50 € + 35 € + 25 € = 110 €. Skala 1 € = 8 px für Karten und Monatsbalken (110 € = 880 px).

## QA (Phase 1, Claude Code Opus 5.5)

- Gerendert über `out/null-prozent-qa/entry.tsx` mit Vorschau-Beats; Stills bei 10/35/65/90 % + letztem Frame + einem Übergangsframe sowie Voll-Clip (Kontaktbogen alle 0,5 s, verkleinert) geprüft: keine Überlappungen, nichts angeschnitten, Werte und Geometrie stimmen.
