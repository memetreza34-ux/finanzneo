# FinanzNeo — Verbindlicher 3-Phasen-Produktionsablauf

## Überblick
Jedes neue FinanzNeo-Reel durchläuft exakt 3 Phasen in strikter Reihenfolge. Keine Phase kann übersprungen werden. Phase 3 darf NIEMALS starten, bevor Phase 2 vollständig abgeschlossen ist.

## Phase 1 – Vorbereitung
**Wer:** ChatGPT (Recherche & Texte) + Antigravity (Remotion-Code)
**Wann fertig:** Skript ✅ + Bildprompts ✅ + Remotion-Code ✅ (typecheck grün)

ChatGPT:
- Thema recherchieren, Fakten und Quellen prüfen
- Finalen Voiceover-Fließtext schreiben → 01-script/script-fliess-text.txt
- Alle Bildprompts für Google Flow erstellen → 03-szenen/alle-bildprompts.txt
- Szenenstruktur und scene-index.json befüllen
- Social-Caption-Vorlage erstellen → 04-caption/caption.txt

Antigravity (baut den KOMPLETTEN Remotion-Code BEREITS IN PHASE 1):
- Neuen Branch erstellen
- npm run reel:create ausführen um Ordnerstruktur zu scaffolden
- src/reels/<reel-name>/ vollständig implementieren:
  - config.ts mit Szenenstruktur, Kopien, Farben
  - Alle Animationskomponenten (eine Komponente pro Animations-Szene)
  - Hauptkompositions-Datei
  - KaraokeCaptions.tsx (mit Platzhalter-Timings)
  - asset-manifest.json (Platzhalter, wird in Phase 3 befüllt)
- Composition in ProductionCompositions.tsx registrieren
- TypeScript-Check muss grün sein
- Storyboard-Preview rendern (mit Platzhaltern) um Animationen zu zeigen

WICHTIG: Antigravity rendert in Phase 1 NUR einen Storyboard-Preview mit Platzhaltern — NIEMALS ein finales Video!

## Phase 2 – Materialerstellung
**Wer:** Nutzer alleine
**Wann fertig:** Alle Bilder in 03-szenen/00-ALLE-BILDER-HIER-REIN/ ✅ + genau ein Audio in 02-audio/ ✅

Nutzer:
- Alle Bilder mit Google Flow anhand der Prompts aus Phase 1 generieren
- Bilder exakt nach Vorgabe benennen (Bild 00, Bild 01, etc.)
- Alle Bilder gemeinsam nach 03-szenen/00-ALLE-BILDER-HIER-REIN/ legen
- Voiceover-Audio erstellen (z.B. ElevenLabs)
- Audio nach 02-audio/ legen

Antigravity tut in Phase 2 NICHTS. Wartet auf Freigabe durch den Nutzer.

## Phase 3 – Produktion (Antigravity Autopilot)
**Wer:** Antigravity, vollautomatisch
**Trigger:** Nutzer sagt 'Mach das Reel', 'Erstelle das Reel', 'Mach es fertig' oder liefert Bilder + Audio
**Wann fertig:** PRODUCTION COMPLETE (alle Checks aus CLAUDE.md Sektion 18)

Antigravity durchläuft OHNE Rückfragen:
1. Mediengrenze prüfen (nur Dateien aus dem Ziel-Reel)
2. Pflichtmedien validieren
3. Echte Whisper-Wortzeiten aus finalem Audio erzeugen
4. Szenenstarts/-dauern ableiten → config.ts aktualisieren
5. asset-manifest.json mit echten Dateipfaden befüllen
6. Bilder als full-frame-no-crop integrieren
7. Karaoke-Captions mit echten Wortzeiten einbinden
8. Validator + TypeScript prüfen
9. Preview rendern → Nutzer zeigen
10. Vollständiges MP4 rendern
11. Safety Audit
12. Commit + Draft-PR

## Stopp-Regeln für Antigravity
Antigravity stoppt NUR bei echten Blockern (siehe CLAUDE.md Sektion 17).
KEIN generisches 'Weiter?' zwischen den Schritten.
Fehler selbst beheben und weiterarbeiten.

## Verbotene Abkürzungen
- Phase 3 NIEMALS ohne abgeschlossene Phase 2 starten
- NIEMALS ein finales Reel mit Platzhalter-Bildern/Audio rendern
- NIEMALS Bilder oder Audio aus anderen Quellen verwenden (harte Mediengrenze)
- NIEMALS Wortzeiten schätzen statt aus echtem Audio ableiten
