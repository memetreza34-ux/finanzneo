# Remotion-Spezifikation visual-07

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Drei Checks
- Sprechtext-Bezug: Prüfe Vollzahlung, Zinssatz und die Teilzahlungs-Einstellung.
- Viewer Change: Eine große stilisierte Kreditkarte erscheint links; rechts kommen nacheinander drei frei stehende Check-Zeilen hinzu.
- Animation Intent: Die Handlungsschritte bleiben exakt lesbar und werden bewusst in Remotion statt als KI-generierte Checklisten-Grafik gebaut.
- Mechanik: three-checks-sequential
- Technikbeschreibung: Große Kartenform als visueller Anker; drei Text-/Check-Zeilen gleiten zeitversetzt ein, ohne Panels, Cards oder Dashboard-Rahmen.
- Tool Stack: React, CSS, Remotion interpolate
- Composition Family: action-checklist-motion
- Motion Signature Camera: statische frontale Editorial-Ansicht mit leicht perspektivischer Kartenform
- Motion Signature Layout: große Karte links, drei offene Textzeilen rechts ohne Container
- Motion Signature Transformation: Karte blendet ein, danach erscheinen drei Check-Zeilen nacheinander
- Startzustand: nur die Karte
- sichtbare Mechanik/Transformation: sequenzieller Reveal der drei Handlungen
- Resultat: Vollzahlung 100 %, Zinssatz prüfen und Teilzahlung deaktivieren sind klar sichtbar
- Motion Channels: Karten-Opacity/Perspektive, horizontale Bewegung der Check-Zeilen, zeitversetzte Opacity
- SFX-Cues: optional drei dezente Check-Ticks
