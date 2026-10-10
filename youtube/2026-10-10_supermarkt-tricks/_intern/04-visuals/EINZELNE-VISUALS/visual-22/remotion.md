# Remotion-Spezifikation visual-22

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Kapitel 3 — Preise und Angebote
- Sprechtext-Bezug: 30-Tage-Regel: Rabatt muss sich auf den niedrigsten Preis der letzten 30 Tage beziehen; der alte „Hochsetz-Trick“ ist verboten.
- Inhaltlicher Brief (Phase 1 Content): Preisverlauf über 30 Tage als Linie: 2,99 € flach, kurzer Sprung auf 3,99 €, dann Schild „−25 %“ → 2,99 €. Dann Referenzlinie „niedrigster Preis der letzten 30 Tage = 2,99 €“ → echter Rabatt 0 %, Schild wird als unzulässig markiert („verboten“).
- Startet bei: „Wer mit einer Preissenkung wirbt“ · Stufen bei: „Wer mit einer Preissenkung“ · „niedrigsten Preis“ · „kurz hochsetzen“ · „minus fünfundzwanzig Prozent“ · „Das ist heute verboten“
- Viewer Change: Ein Preisverlauf läuft 30 Tage flach bei 2,99 €, springt kurz auf 3,99 €, fällt mit einem „−25 %“-Schild zurück auf 2,99 €; dann legt sich die Referenzlinie des niedrigsten 30-Tage-Preises genau auf den Aktionspreis — echter Rabatt 0 %, das Schild ist verboten.
- Animation Intent: Die 30-Tage-Regel ist eine Zeitregel; erst wenn man den Verlauf und die Referenzlinie sieht, versteht man, warum das Hochsetzen vor der Aktion den Rabatt wertlos macht.
- Mechanik: price-history-trace-reference-check
- Technik-ID: step-line-30-day-window-with-lowest-price-reference
- Technikbeschreibung: Treppenlinie zeichnet sich Tag für Tag durch ein 30-Tage-Fenster (0-€-Basis), springt auf 3,99 € und zurück; rotes Rabattschild fährt ein; grüne gestrichelte Referenzlinie zieht sich über das Fenster, „−25 %“ wird durchgestrichen, Stempel „verboten“, „echter Rabatt: 0 %“.
- Tool Stack: Remotion, React, src/design-system/daten.tsx, SVG-Pfad (Treppenlinie)
- Composition Family: trend-trace
- Motion Signature Camera: still
- Motion Signature Layout: Preisdiagramm links, Rabattschild mit Stempel rechts
- Motion Signature Transformation: Linie zeichnet Zeit, Referenzlinie entlarvt das Schild
- Startzustand: Achsen (0 € bis 4,50 €, Hilfslinien 2,99 € und 3,99 €), Beschriftung „vor 30 Tagen“ / „heute“; die Preislinie beginnt bei 2,99 €.
- sichtbare Mechanik/Transformation: Die Linie läuft während der Regel gleichmäßig bis Tag 22 (bei „niedrigsten Preis“ hebt sich das Fenster „letzte 30 Tage“ ab); bei „kurz hochsetzen“ Stufe auf 3,99 € für Tag 23–27 mit Label „kurz hochgesetzt“; bei „minus fünfundzwanzig Prozent“ Stufe zurück auf 2,99 € und das rote Schild „−25 % · statt 3,99 € · 2,99 €“ fährt ein.
- Resultat: Bei „Das ist heute verboten“ zieht sich die grüne Referenzlinie „niedrigster Preis der letzten 30 Tage: 2,99 €“ über das Fenster und liegt exakt auf dem Aktionspreis; „−25 %“ wird durchgestrichen, Stempel „verboten“, darunter „echter Rabatt: 0 %“.
- Concept A: Zwei Preisschilder nebeneinander (Werbung −25 % gegen Rechnung 0 %) — statisch, die Zeitdimension der Regel fehlt.
- Concept B: Preisverlauf als Treppenlinie im 30-Tage-Fenster, Rabattschild, danach Referenzlinie des niedrigsten Preises als Prüfung.
- Concept C: Kalenderblatt mit 30 Tagesfeldern, in denen Preise stehen, ein Scanner sucht das Minimum — korrekt, aber kleinteilig und schwer lesbar.
- Chosen Concept: B — zeigt die Regel genau als das, was sie ist: Vergleich mit dem niedrigsten Preis im Zeitfenster.
- Keyframe 10%: Linie läuft flach bei 2,99 € durch die ersten Tage.
- Keyframe 35%: Fenster „letzte 30 Tage“ markiert, Linie bei etwa Tag 15, noch flach.
- Keyframe 65%: Linie auf 3,99 € hochgesetzt, Label „kurz hochgesetzt“.
- Keyframe 90%: Referenzlinie 2,99 €, Schild gestrichen, Stempel „verboten“, „echter Rabatt: 0 %“.
- Sichtbare Zustände: 30-Tage-Fenster, Preis flach 2,99 € → kurz hochgesetzt auf 3,99 € → Schild −25 % statt 3,99 € → niedrigster Preis 2,99 €: echter Rabatt 0 %, verboten
- Motion Channels: Preislinie läuft durch 30 Tage, Sprung auf 3,99 € und zurück, Rabattschild fährt ein, Referenzlinie zieht sich, Schild wird gestrichen und gestempelt
- SFX-Cues: optional kurzer Aufwärts-Tick beim Sprung auf 3,99 € (Beat „kurz hochsetzen“), Schild-Einfahrt (Beat „minus fünfundzwanzig Prozent“ + 6), Stempel-Schlag (Beat „Das ist heute verboten“ + 28).

## Timing

- Code: `animation.tsx`, Export `YouTubeVisual22Animation`, Prop `beats` (Frames ab Visual-Start, aus den beatCues).
- Vorschau-Beats ohne Audio (154 Wörter/Minute geschätzt): [0, 114, 275, 334, 389] Frames, Vorschau-Dauer 470 Frames bei 30 fps. Phase 3 setzt die echten Wortzeiten ein; alle Stufen hängen relativ an den Beats, das Ergebnis steht spätestens ca. 60 Frames nach dem letzten Beat.
- Regeln: helles 2D, keine Szenenüberschrift, keine eingebrannten Untertitel, Inhalt vertikal mittig um `DATEN.mitteY`, Quelle/Kennzeichnung klein oben links, Größen aus Werten.

## Hinweise / Annahmen

Abgeglichen (10.10.2026): Skript und Aufnahme sagen „minus fünfundzwanzig Prozent“, passend zum Schild „−25 %“ (3,99 € → 2,99 €). Preise sind Beispielwerte; Regel: § 11 PAngV seit 28.05.2022.
