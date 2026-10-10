# Remotion-Spezifikation visual-11

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Kapitel 4 — Das Gesetz ist auf deiner Seite
- Sprechtext-Bezug: Früher +12 Monate automatische Verlängerung, heute monatlich kündbar
- Startet bei: „Die gute Nachricht“ · Stufen bei: „Früher hat sich“ · „weiteres Jahr“ · „ersten März“ · „Mindestlaufzeit läuft“ · „einem Monat Frist“
- Viewer Change: Alter Vertrag: nach 24 Monaten rastet ein ganzes Jahr mit Schloss ein. Neuer Vertrag: danach einzelne Monate, jeder kündbar.
- Animation Intent: Die Gesetzesänderung als Unterschied zweier Zeitleisten sofort sichtbar machen.
- Mechanik: auto-renewal-lock-versus-monthly-exits
- Technikbeschreibung: Zwei Zeitleisten zeichnen sich; oben rastet ein roter +12-Monate-Block mit Schloss ein; unten folgen grüne Einzelmonate mit Ausgangsmarken, das Schloss öffnet sich.
- Tool Stack: Remotion, React, SVG, spring, src/design-system/daten.tsx
- Composition Family: before-after-timelines
- Motion Signature Camera: still
- Motion Signature Layout: zwei Zeitleisten übereinander
- Motion Signature Transformation: Einrasten eines Blocks vs. Aufreihen einzelner Monate
- Sichtbare Zustände: alter Vertrag → +12 Monate gesperrt → neuer Vertrag → Einzelmonate → monatlich kündbar
- Motion Channels: Leisten zeichnen sich, Block rastet ein, Monate reihen sich, Schloss öffnet
- Regeln: Größen aus Werten (skala), wertzeigende Federn ohne Überschwingen, Inhalt oberhalb der Untertitel-Zone (y ≤ 860), Quelle oben links
- SFX-Cues: optional bei Landungen/Einrasten (Phase 3)
