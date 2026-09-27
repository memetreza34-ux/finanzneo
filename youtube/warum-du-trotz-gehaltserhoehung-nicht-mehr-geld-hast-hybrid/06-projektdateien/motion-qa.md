# YouTube 16:9 Motion QA — Gehaltserhöhung

STANDARD: finanzneo-youtube-visual-qa-16x9-v1
MOTION_QUALITY_STANDARD: finanzneo-youtube-motion-quality-v1
PRODUCTION_MODE: hybrid
LAYOUT_CONTRACT: finanzneo-youtube-framed-scene-v2

Für jede Motion-Szene werden fünf repräsentative Zustände geprüft: `START`, `25%`, `50%`, `75%`, `RESULT HOLD`.

## Harte Checks

- Hauptmechanik ist ohne Voiceover grob verständlich
- START und RESULT sind sichtbar verschieden
- reine Remotion darf die volle 1920×1080-Fläche nutzen
- kritische Inhalte bleiben mindestens 64 px von allen Außenkanten entfernt
- keine wichtigen Texte, Zahlen, Balken, Linien oder Objekte werden abgeschnitten
- Resultat ist als Standbild lesbar
- Zahlen und Einheiten stimmen mit Skript/Datenplan überein
- Motion schlägt die dokumentierte statische Alternative
- Flow-Bilder bleiben contained; nur Remotion darf bei Bedarf Full-Frame werden
- keine Bewegung nur als Dekoration

## Szenen

02 Geldabzweigung · 03 freier Spielraum · 04 Gehalt/Ausgaben · 06 kleine Extras · 07 Lifestyle-Creep-Basis · 09 Fixkosten über Monate · 10 Vorher/Nachher · 13 Monatsrest · 14 Aufteilung · 15 300-Euro-Beispiel · 16 zuerst sichern · 17 Wachstum über Monate.

PASS erst nach Sichtprüfung aller fünf Zustände pro Motion-Szene.
