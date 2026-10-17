# Remotion-Spezifikation visual-07

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Kapitel 3 — Die drei Tricks der Abo-Falle
- Sprechtext-Bezug: Trick eins: 30 Tage gratis, ab Tag 31 jeden Monat 12,99 €
- Startet bei: „Trick eins: gratis zum Start“ · Stufen bei: „Trick eins“ · „Tag einunddreißig“ · „Ab jetzt jeden Monat“
- Viewer Change: 30 grüne Gratis-Tage, dann kippt Tag 31 rot und ab jetzt kommt jeden Monat eine Abbuchung.
- Animation Intent: Den Moment zeigen, in dem aus „gratis“ unbemerkt ein bezahltes Abo wird.
- Mechanik: free-trial-days-flip-to-monthly-debits
- Technikbeschreibung: Tagesstreifen wird von einer Marke grün gefüllt; Tag 31 springt rot herein; die 30 Tage schrumpfen zum ersten Monatsfeld, Monate 2–12 fallen als rote Abbuchungen nach, Zähler bis 142,89 €.
- Tool Stack: Remotion, React, spring, src/design-system/daten.tsx
- Composition Family: timeline-state-flip
- Motion Signature Camera: still
- Motion Signature Layout: Tagesstreifen oben → Monatsreihe darunter, Zähler unten
- Motion Signature Transformation: Scrub über Tage, Zustandswechsel, Zusammenfalten zu Monat 1
- Sichtbare Zustände: 30 Tage gratis → Tag 31: −12,99 € → jeden Monat −12,99 €
- Motion Channels: Tage füllen sich, Tag 31 kippt, Monatsabbuchungen fallen, Zähler
- Regeln: Größen aus Werten (skala), wertzeigende Federn ohne Überschwingen, Inhalt oberhalb der Untertitel-Zone (y ≤ 860), Quelle oben links
- SFX-Cues: optional bei Landungen/Einrasten (Phase 3)
