# Produktionscheckliste

## Struktur und Code

- [x] 10 Szenen vorhanden
- [x] exakt 6 Bildszenen
- [x] exakt 4 Remotion-Animationsszenen
- [x] Verhältnis exakt 60 % / 40 %
- [x] jede Szene besitzt exakt eine Produktionsquelle
- [x] keine Motionprompt- oder Szenen-Platzhalterdateien
- [x] Überschrift ist als eigener oberer Bereich umgesetzt
- [x] Bild-/Animationsbereich endet oberhalb der Untertitel
- [x] Untertitel besitzen keine Kicker-Pille
- [x] Szene 02 und 07 zeigen ihre beiden Sätze nacheinander
- [x] Rechenszenen bleiben native Remotion-Animationen
- [x] Cover- und Bildprompts vorhanden
- [x] Bildprompts verlangen keinen eingebetteten Text
- [x] Quellen und Rechnungen dokumentiert

## Vor finalem Render

- [ ] sechs finale KI-Bilder in die korrekten Bildszenenordner legen
- [ ] Bildzuordnung nach `BILD-ZUORDNUNG.md` kontrollieren
- [ ] insbesondere Szene 03 = Kontostand, Szene 05 = Fixkosten, Szene 07 = Rücklage
- [ ] pro Bildszene höchstens eine finale Bilddatei
- [ ] `npm run assets:drei-konten` ausführen
- [ ] finales Voiceover einbinden
- [ ] Untertitel-Cue-Wechsel gegen das echte Voiceover kontrollieren
- [ ] `npm run validate:drei-konten` ausführen
- [ ] `npm run typecheck` ausführen
- [ ] Vorschau bei 3, 9, 15, 21, 27, 33, 39, 45, 51 und 57 Sekunden prüfen
- [ ] kein Motiv, Betrag oder Kartenblock liegt hinter dem Untertitel
- [ ] finalen Export vollständig ansehen
