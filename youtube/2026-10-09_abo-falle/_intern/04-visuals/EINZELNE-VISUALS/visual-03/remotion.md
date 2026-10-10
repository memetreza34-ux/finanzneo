# Remotion-Spezifikation visual-03

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Kapitel 2 — Was Abos wirklich kosten
- Sprechtext-Bezug: Haushalt mit Digital-Abos: 55 € → 62 € im Monat = 744 € im Jahr
- Startet bei: „Laut der aktuellen Submix-Studie“ · Stufen bei: „zweiundsechzig Euro“ · „fünfundfünfzig“ · „siebenhundertvierundvierzig“
- Viewer Change: Die Monatsausgabe 62 € (Vorjahr 55 €) wird zwölfmal aneinandergereiht und ergibt 744 € im Jahr.
- Animation Intent: Steigerung und Jahresbetrag direkt aus derselben Säule zeigen.
- Mechanik: monthly-column-replicates-into-year
- Technikbeschreibung: Zwei wertgenaue Säulen 55 €/62 € mit +7-€-Marke; die 62-€-Säule schrumpft in eine Reihe und verzwölffacht sich, Zähler zählt in 62-€-Schritten.
- Tool Stack: Remotion, React, spring, src/design-system/daten.tsx
- Composition Family: value-comparison-to-repetition
- Motion Signature Camera: still
- Motion Signature Layout: zwei Säulen mittig → Zwölferreihe unten, Zähler oben
- Motion Signature Transformation: Säule wächst, Vergleich, dann Replikation zur Reihe
- Sichtbare Zustände: 62 € pro Monat → 55 € im Vorjahr → 744 € im Jahr
- Motion Channels: Säulen wachsen, Säule wird Reihe, Zähler zählt
- Regeln: Größen aus Werten (skala), wertzeigende Federn ohne Überschwingen, Inhalt oberhalb der Untertitel-Zone (y ≤ 860), Quelle oben links
- SFX-Cues: optional bei Landungen/Einrasten (Phase 3)
