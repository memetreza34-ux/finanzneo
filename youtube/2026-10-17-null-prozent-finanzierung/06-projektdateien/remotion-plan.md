# Technischer Remotion-Plan

Motion Standard: `finanzneo-youtube-motion-v3`. Sechs eigenständige, deterministische 1920×1080-Visuals mit `useCurrentFrame()` + `interpolate()`. Keine Platzhalter, kein `Math.random`, keine Remote-Assets. Exakte Codes unter `04-visuals/EINZELNE-VISUALS/visual-XX/animation.tsx`.

Motion 02: Zwölf Rate-Zellen füllen sich nacheinander; `50 × 12 = 600` als Payoff.
Motion 05: Kassenbon ergänzt freiwilligen Versicherungsposten; 600 → 696.
Motion 07: Zwei horizontale Preisprofile; Preisunterschied 50 wird als Vergleichslinie deutlich.
Motion 09: Elf kleine Raten gegen eine große Schlussrate; nur Verteilungsunterschied, gleiche Summe 600.
Motion 10: Drei separate monatliche Zahlungen fließen zusammen; 110 €/Monat; keine Zinsbehauptung.
Motion 12: Vier Vertrags-Prüfschritte erscheinen auf einem großen nachvollziehbaren Dokument, anschließend Gesamtkosten als Schlussbotschaft.

- Farben: pure black, kontrastiertes Off-White, Emerald für Klarheit, Rot-Orange nur für Kosten/Warnung; kein permanenter bewegter Hintergrund.
- Bild-Visuals: keine eigenmächtige Generierung von Phase-2-Assets; 16:9-Nutzerbilder semantisch in sichere Bühne integrieren.
- Captions: vollständig audio-synchron mit aktiven grünen Wörtern; ab dem ersten gesprochenen Wort, nicht verzögert.
- Timing: aus echten Wort-Zeitstempeln, keine starren Szenendauern.
- Motion-V3-Quellen nach lokaler Animation-Validation SHA256-sealen; Phase 3 ausschließlich versiegelten Code verwenden.
