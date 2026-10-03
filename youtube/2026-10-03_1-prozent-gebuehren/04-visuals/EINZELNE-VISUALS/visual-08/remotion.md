# Remotion-Spezifikation visual-08

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Schluss — Kosten vor dem Kauf prüfen
- Sprechtext-Bezug: Vergleiche bei ähnlichen Produkten die laufenden Kosten und prüfe die Kosteninformation über deine geplante Haltedauer.
- Viewer Change: Auf dem statischen Vergleichsdokument fährt ein heller Fokusrahmen kontrolliert über die Zeilen und verriegelt sich auf der Spalte laufende Kosten.
- Animation Intent: Die letzte Szene verwandelt die abstrakte Erkenntnis in eine konkrete Seh- und Prüfroutine.
- Mechanik: Ein Fokusfenster scannt das Dokument vertikal und verbreitert sich beim finalen Lock auf den relevanten Kostenbereich.
- Technikbeschreibung: Transparente CSS/React-Motion über einem vom Nutzer gelieferten Flow-Dokumentbild.
- Tool Stack: React, Remotion interpolate, CSS overlay
- Composition Family: document-motion
- Motion Signature Camera: static-front-document
- Motion Signature Layout: full-frame-document-with-moving-focus-window
- Motion Signature Transformation: highlight-window-scans-then-locks-on-cost-line
- Startzustand: Gesamtes Vergleichsdokument ist ohne Hervorhebung sichtbar.
- sichtbare Mechanik: Fokusrahmen fährt kontrolliert nach unten und richtet sich auf der Kostenspalte aus.
- Resultat: Kostenbereich bleibt hervorgehoben; Text Kosten vergleichen erscheint.
- Motion Channels: vertikale Fokusbewegung; Rahmenverbreiterung; Abschlusslabel-Fade
- Visual Beats: ruhiges Dokument; Scan beginnt; Fokus erreicht Kostenzeile; Fokus verriegelt und Handlungslabel erscheint
- SFX-Cues: leiser Scan-Whoosh, kurzer Lock-Click
