# Remotion Plan

Motion V3 ist für visual-02, 03, 04, 05, 07 und 08 vollständig als `animation.tsx` vorbereitet.

Alle sechs Animationen verwenden jetzt `YouTubeSectionFrame` aus `src/design-system/youtube-stage.tsx`.

Verbindlich:
- keine Animation als Vollbild
- oben immer Zwischenüberschrift + passendes Icon
- eigentliche Animation nur im gerahmten Content-Bereich
- keine eingebrannten Untertitel/Captions
- Wort-Timings nur für Schnitte und Exportdateien

Visuals:
- Visual 02: „Was 5 € in einer Woche machen“ + Kalender-Icon
- Visual 03: „Der 30-Tage-Effekt“ + Kalender-Icon
- Visual 04: „Was daraus in einem Jahr wird“ + Uhr-Icon
- Visual 05: „Warum 5 € so klein wirken“ + Repeat-Icon
- Visual 07: „Der 7-Tage-Test“ + Listen-Icon
- Visual 08: „Mach kleine Ausgaben sichtbar“ + Target-Icon

Jede Mechanik hat eigene Layout- und Transformationslogik. Phase 3 darf nur zum echten Voiceover retimen und integrieren; der gerahmte Layoutvertrag darf nicht entfernt werden.
