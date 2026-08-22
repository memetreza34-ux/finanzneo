# SZENEN

Einzige Übergabedatei an den Google-Flow-KI-Agenten: `alle-bildprompts.txt`.

Ablauf:

1. genau 1 Bild erzeugen
2. vollständig abwarten
3. sofort exakt umbenennen
4. Motiv + Labels + sichtbares Gesicht falls Person + nahtlosen Hintergrund + Same-World-Lock prüfen
5. bei Fehler dieselbe Bildnummer neu erzeugen
6. erst dann zum nächsten Bild wechseln

Animationsszenen werden übersprungen und erhalten kein Google-Flow-Bild.

Keine Prozent-Zonen im Bildaufbau. Jedes Quellbild ist 1:1 und verwendet einen einzigen durchgehenden Hintergrund.
