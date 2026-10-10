# Remotion-Spezifikation visual-20

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Kapitel 7 — Merksatz
- Sprechtext-Bezug: Zwei gekündigte Abos = rund 240 € im Jahr
- Startet bei: „Ein Abo kostet nie nur“ · Stufen bei: „nie nur den Monatspreis“ · „mal zwölf“ · „Jedes Jahr“ · „zwei Abos“
- Viewer Change: 9,99 € werden zur Jahressäule, Jahr für Jahr wächst der Stapel — dann werden zwei gekündigte Abos zu 240 €, die bleiben.
- Animation Intent: Den Merksatz „Monatspreis × 12, jedes Jahr“ und die Belohnung des Kündigens zeigen.
- Mechanik: yearly-cost-stacks-turn-into-savings
- Technikbeschreibung: Chip wird Jahressäule, weitere Jahre stapeln sich mit Zähler; Umkehr: zwei grüne Jahresblöcke wachsen, Ergebnis ≈ 240 €.
- Tool Stack: Remotion, React, spring, src/design-system/daten.tsx
- Composition Family: cumulative-columns-reversal
- Motion Signature Camera: still
- Motion Signature Layout: Säule links, Zahl rechts
- Motion Signature Transformation: Stapeln über Jahre, dann Farbumkehr zu Ersparnis
- Sichtbare Zustände: 9,99 € pro Monat → 119,88 € pro Jahr → Jahr für Jahr → ≈ 240 € bleiben
- Motion Channels: Chip wird Säule, Jahre stapeln sich, Zähler, grüne Ersparnis wächst
- Regeln: Größen aus Werten (skala), wertzeigende Federn ohne Überschwingen, Inhalt oberhalb der Untertitel-Zone (y ≤ 860), Quelle oben links
- SFX-Cues: optional bei Landungen/Einrasten (Phase 3)
