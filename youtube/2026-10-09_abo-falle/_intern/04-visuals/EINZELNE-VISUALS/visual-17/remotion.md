# Remotion-Spezifikation visual-17

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Kapitel 5 — Der 15-Minuten-Abo-Check
- Sprechtext-Bezug: Jedes Abo ×12, Jahresbetrag prüfen, zögern = kündigen
- Startet bei: „Schreib jedes Abo auf“ · Stufen bei: „Schreib jedes Abo auf“ · „mal zwölf“ · „Würde ich diesen“ · „Alles, wo du zögerst“
- Viewer Change: Fünf Abos werden aufgeschrieben, jede Zeile wird zum Jahresbetrag, zwei werden gestrichen und die Summe fällt.
- Animation Intent: Den Abo-Check als einfache Rechnung vormachen, die man selbst nachmachen kann.
- Mechanik: subscription-list-times-twelve-strike
- Technikbeschreibung: Notizzettel: Zeilen erscheinen, Spalte ×12 rechnet hoch, Summe zählt, Prüfmarkierung wandert, zwei Zeilen werden gezeichnet durchgestrichen.
- Tool Stack: Remotion, React, @remotion/paths, src/design-system/daten.tsx
- Composition Family: checklist-calculation
- Motion Signature Camera: still
- Motion Signature Layout: zentraler Notizzettel mit drei Spalten
- Motion Signature Transformation: Hochrechnen, Prüfen, Durchstreichen
- Sichtbare Zustände: fünf Abos → jede Zeile × 12, Summe 575,40 € → jede Zeile prüfen → zwei gestrichen, 335,64 €
- Motion Channels: Zeilen schreiben, Jahresbeträge rechnen, Markierung prüft, Durchstreichen, Summe sinkt
- Regeln: Größen aus Werten (skala), wertzeigende Federn ohne Überschwingen, Inhalt oberhalb der Untertitel-Zone (y ≤ 860), Quelle oben links
- SFX-Cues: optional bei Landungen/Einrasten (Phase 3)
