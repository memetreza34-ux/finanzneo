# Validierungsstatus

Das redaktionelle Inhaltspaket wurde vollständig angelegt und statisch gegen die bekannten Finance-V1-Verträge geplant:

- 173 Wörter
- 10 Szenen
- 67,691 Sekunden
- 9 Bildszenen innerhalb des erlaubten Bereichs von 8–12
- letzte Szene als `text-punch` / `payoff`
- ausschließlich `cut`
- pro Bildszene genau eine visuelle Phase bei `at: 0`
- keine SFX
- Quellen-IDs, URLs, Abrufdaten und Claim-Verknüpfungen vorhanden
- strukturierte Rechnungen: 1.800−1.100=700, 1.200÷12=100, 600÷4=150

Noch nicht ausführbar geprüft, weil die finalen Binärmedien fehlen:

- `voiceover-final.wav`
- neun generierte JPG-Bilder
- `voiceover-final.captions.json`
- Asset-Manifest, Alignment, Render und Render-QA

Nach Einfügen der Medien lokal ausführen:

```bash
npm run finance:content-ready -- channels/finanzneo/reels/2026-08-03_bis_2026-08-09/04_Drei-Konten-System
npm run finance:assets -- channels/finanzneo/reels/2026-08-03_bis_2026-08-09/04_Drei-Konten-System
npm run finance:align -- channels/finanzneo/reels/2026-08-03_bis_2026-08-09/04_Drei-Konten-System/06-projektdateien/scene-plan.json channels/finanzneo/reels/2026-08-03_bis_2026-08-09/04_Drei-Konten-System/03-caption/voiceover-final.captions.json channels/finanzneo/reels/2026-08-03_bis_2026-08-09/04_Drei-Konten-System/01-script-audio/audio/voiceover-final.wav
npm run finance:ready -- channels/finanzneo/reels/2026-08-03_bis_2026-08-09/04_Drei-Konten-System
npm run finance:render -- channels/finanzneo/reels/2026-08-03_bis_2026-08-09/04_Drei-Konten-System
```
