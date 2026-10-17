# Remotion-Spezifikation visual-30

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Kapitel 3 — Vier Fallen
- Sprechtext-Bezug: 11 × 30 € + 270 € Schlussrate = 600 € — die letzte Zahlung trifft viele unvorbereitet.
- Inhaltlicher Brief (Phase 1 Content): Beispiel: Monatsbalken-Diagramm mit 12 Säulen. Säulen 1–11 je 30 € erscheinen ruhig nacheinander; Säule 12 schießt auf 270 € hoch (wertgenau, gleiche Skala). Summe „600 €“. Callout an Säule 12: „Schlussrate“.
- Startet bei: „Zum Beispiel elf Raten zu dreißig Euro“ · Stufen bei: „Zum Beispiel elf Raten“ · „Und dann zweihundertsiebzig“ · „Zusammen sind das“ · „Aber die letzte Zahlung“
- Viewer Change: Ein Zahlungsplan mit 12 Monatsplätzen füllt sich mit elf flachen 30-€-Säulen, die Summe zählt bis 330 €; dann schießt Säule 12 auf derselben Skala auf 270 € hoch, die Summe rollt auf 600 € und ein Callout „Schlussrate = 9 Monatsraten auf einmal“ hängt an der letzten Säule.
- Animation Intent: Die gleiche Gesamtsumme wie beim fairen Beispiel versteckt hier ein Risiko im Zeitverlauf; erst die wertgenaue letzte Säule zeigt, wie unverhältnismäßig die Schlusszahlung gegenüber den kleinen Raten ist.
- Mechanik: flat-payment-plan-then-balloon-column-jump
- Technik-ID: twelve-month-columns-same-scale-final-balloon-with-running-total
- Technikbeschreibung: Säulendiagramm ab 0 € (270 € = 540 px, 30 € = 60 px) mit Monat 1–12; Säulen 1–11 wachsen gestaffelt, Klammer „11 × 30 € = 330 €“; Säule 12 wächst ohne Überschwingen auf 270 € in Orange; Summen-Zählwerk läuft 30 € pro Säule, dann 330 € → 600 €; Callout links an Säule 12.
- Tool Stack: Remotion, React, src/design-system/daten.tsx, Zaehlwerk (daten.tsx)
- Composition Family: data-viz
- Motion Signature Camera: still
- Motion Signature Layout: Monatssäulen über die ganze Breite, Summe oben links, Callout an der letzten Säule
- Motion Signature Transformation: flache Säulen wachsen nacheinander, letzte Säule springt hoch
- Startzustand: Leere Grundlinie mit Monat 1–12, Summe 0 €, Kennzeichnung „Beispiel: 600 € mit Schlussrate“.
- sichtbare Mechanik/Transformation: Ab Visual-Start wachsen Säulen 1–11 im 6-Frame-Takt auf 30 € (Wert über jeder Säule); das Summen-Zählwerk springt je Säule um 30 € bis 330 €; Klammer „11 × 30 € = 330 €“. Bei „Und dann zweihundertsiebzig“ schießt Säule 12 in 22 Frames orange auf 270 € (gleiche Skala). Bei „Zusammen sind das“ rollt die Summe 330 € → 600 € und wird dunkel.
- Resultat: Elf flache 30-€-Säulen, eine neunmal so hohe 270-€-Säule, Summe 600 €; bei „Aber die letzte Zahlung“ Callout „Schlussrate = 9 Monatsraten auf einmal“ an Säule 12.
- Concept A: Kumulierte Linie, die gleichmäßig steigt und im letzten Monat senkrecht springt — die Einzelzahlung 270 € wäre nur indirekt sichtbar.
- Concept B: 12 Monatssäulen ab 0 € auf einer Skala: 11 flache, eine riesige; laufende Summe darüber.
- Concept C: Kontoauszug-Tabelle mit 12 Zeilen, letzte Zeile rot — Tabelle ohne Größenvergleich, Schock fehlt.
- Chosen Concept: B — die einzige Darstellung, in der die Größe der Schlussrate direkt gegen die Monatsraten sichtbar ist (60 px vs. 540 px, exakt 1 : 9).
- Keyframe 10%: 4–5 Säulen à 30 €, Summe läuft.
- Keyframe 35%: 11 Säulen + Klammer 330 €, Säule 12 steht auf 270 €.
- Keyframe 65%: Summe 600 €, Callout erscheint.
- Keyframe 90%: Hold: Schlussrate = 9 Monatsraten auf einmal.
- Sichtbare Zustände: 11 Raten à 30 €, Summe 330 € → Schlussrate 270 € → Zusammen 600 € → Schlussrate = 9 Monatsraten auf einmal
- Motion Channels: Säulen 1–11 wachsen auf 30 €, Summe zählt bis 330 €, Säule 12 schießt auf 270 €, Summe rollt auf 600 €, Schlussraten-Callout erscheint
- SFX-Cues: optional leiser Tick je kleiner Säule; tiefer Akzent beim Hochschießen von Säule 12 („Und dann zweihundertsiebzig“ + 0–22 Frames). Keine SFX, die mit Stimme oder Hintergrundmusik konkurrieren.

## Timing

- Code: `animation.tsx`, Export `YouTubeVisual30Animation`, Prop `beats` (Frames ab Visual-Start, aus den beatCues).
- Vorschau-Beats ohne Audio (154 Wörter/Minute geschätzt): [0, 82, 152, 222] Frames, Vorschau-Dauer 330 Frames bei 30 fps. Phase 3 setzt die echten Wortzeiten ein; alle Stufen hängen relativ an den Beats, das Endergebnis steht spätestens ca. 20 Frames nach dem letzten Beat und bleibt danach unverändert stehen (mind. 15 Frames Hold bis zum Schnitt).
- Regeln: helles 2D, keine Szenenüberschrift, keine eingebrannten Untertitel, Inhalt vertikal mittig um `DATEN.mitteY`, Kennzeichnung klein oben links, Größen aus Werten.

## Hinweise / Annahmen

Beispielwerte aus dem Skript: 11 × 30 € = 330 €, + 270 € = 600 €; 270 € / 30 € = 9 Monatsraten. Skala ab 0 €: 270 € = 540 px, 30 € = 60 px.

## QA (Phase 1, Claude Code Opus 5.5)

- Gerendert über `out/null-prozent-qa/entry.tsx` mit Vorschau-Beats; Stills bei 10/35/65/90 % + letztem Frame + einem Übergangsframe sowie Voll-Clip (Kontaktbogen alle 0,5 s, verkleinert) geprüft: keine Überlappungen, nichts angeschnitten, Werte und Geometrie stimmen.
