# Produktionscheckliste

## Struktur und Code

- [x] 10 Szenen vorhanden
- [x] exakt 6 Bildszenen
- [x] exakt 4 Remotion-Animationsszenen
- [x] Verhältnis exakt 60 % / 40 %
- [x] jede Szene besitzt exakt eine Produktionsquelle
- [x] Bildszenen besitzen ausschließlich `bildprompt.txt`
- [x] Remotion-Szenen besitzen ausschließlich `remotion.md`
- [x] keine `motionprompt.txt` oder `alle-motionprompts.txt`
- [x] vollständiger Remotion-Code vorhanden
- [x] Composition `DreiKontenSystem` registriert
- [x] Asset-Sync und Strukturvalidator vorhanden
- [x] Cover- und Bildprompts vorhanden
- [x] Quellen und Rechnungen dokumentiert

## Vor finalem Render

- [ ] sechs Platzhalterbilder durch finale Bilder ersetzen
- [ ] pro Bildszene höchstens eine finale Bilddatei
- [ ] `npm run assets:drei-konten` ausführen
- [ ] finales Voiceover als `02-audio/voiceover-final.wav` ablegen
- [ ] Audio in der Composition als `audioSrc` setzen oder beim Render über Input Props übergeben
- [ ] Wort-Captions nach finalem Audio erzeugen
- [ ] `npm run validate:drei-konten` ausführen
- [ ] `npm run typecheck` ausführen
- [ ] Vorschau vollständig ansehen
- [ ] finalen Export nach `06-video/` kopieren
