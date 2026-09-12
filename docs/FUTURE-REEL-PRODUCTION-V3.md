# FinanzNeo Future Reel Production V3

`FUTURE_PRODUCTION_STANDARD: finanzneo-future-production-v3`

Dieser Standard gilt **nur für neue Reels**, die mit dem aktuellen `npm run reel:create` angelegt werden. Bestehende Montag-/Dienstag-/Mittwoch-Reels und ältere Projekte werden nicht rückwirkend migriert oder strenger bewertet.

## 1. Timing und Visual Beats

Der bestehende Visual-Beat-V2-Vertrag bleibt die Basis. Future V3 verschärft nur den Rhythmus:

- statischer Bildbeat ideal: **1,8–3,0 s**
- ab ca. **3,6 s** aktiv prüfen, ob ein weiteres Bild/Visual Beat die Aussage klarer macht
- ohne neue sichtbare Information: **hart maximal 4,0 s**
- ein Satz darf mehrere Bilder bekommen
- ein neuer konkreter Gedanke soll eine neue sichtbare Information auslösen
- echte Wort-Zeitstempel des finalen Nutzer-Voiceovers bleiben die finale Timing-Autorität

Ziel: kein statisches Bild bleibt nur deshalb stehen, weil der gesprochene Satz noch nicht zu Ende ist.

## 2. Animationsframing

Die physische Hauptmechanik muss im echten Render groß genug wirken. Schwarzer Leerraum ist nur dann sinnvoll, wenn er der Geschichte dient.

Post-Render-QA misst im visuellen Kern bei mehreren Zeitpunkten:

- **Peak active-pixel ratio >= 0,15**
- **Median active-pixel ratio >= 0,12**

Ein weiter Startzustand ist erlaubt, wenn die Animation anschließend sichtbar näher/größer zur eigentlichen Mechanik wechselt. Kamera-Zoom allein ersetzt keine echte Zustandsänderung.

## 3. Audio Mastering

Für Future-V3-Reels wird der Candidate **vor** der Render-QA automatisch gemastert:

- Integrated Loudness: **-16 LUFS**
- Ziel True Peak: **-1 dBTP**
- harter True-Peak-Maximalwert: **-0,8 dBTP**
- AAC **320k**
- **48 kHz**

Die V3-Render-QA misst danach das reale Ergebnis. Ein bloß vorhandener Audio-Stream reicht bei neuen V3-Reels nicht mehr.

## 4. Render-Reihenfolge

```text
Remotion Candidate
→ Future-V3 Audio Mastering
→ normale Phase-3 Render-QA
→ Future-V3 Audio-/Occupancy-QA
→ Final MP4
→ automatischer Export
```

Fehlt der V3-Marker im Reel, sind die neuen Mastering-/Occupancy-Schritte No-ops. Dadurch bleibt die bestehende Produktionshistorie unverändert.

## 5. Visual Selection — Planungsregel

`VISUAL_SELECTION_STANDARD: finanzneo-visual-selection-v1`

Für neue Reels wird bereits in Phase 1 nach `docs/FINANZNEO-VISUAL-SELECTION-RULE.md` geplant:

- einfache, zahlen-/datengetriebene Aussage → möglichst klare native Remotion-Erklärung
- komplexe oder reale Aussage → konkrete Bildszene bzw. Bildfolge bevorzugen; Remotion ergänzt nur, wenn es der zeitlichen Erklärung dient
- SVG für präzise Vektor-/Pfadlogik
- Icons nur als semantischer Support
- Lottie nur als kleine Support-Bewegung

Diese Planungsregel **schwächt keine harten Reel-Verträge ab**. `CLAUDE.md`, V9-Bildwelt, Reel-Layout, Phase-1-Codevertrag und Phase-3-Gates bleiben verbindlich.

Ziel: komplexe Finanzinhalte einfach sichtbar erklären, nicht technisch möglichst kompliziert animieren.

## 6. Future Reel Presentation V1

`FUTURE_REEL_PRESENTATION: finanzneo-future-reel-presentation-v1`

Für neue Reels gilt zusätzlich `docs/FUTURE-REEL-PRESENTATION-V1.md` als harter Zuschauer-Vertrag:

- scene-01 bleibt Cover-Sonderfall mit Hero-Bild + Reel-Titel
- ab scene-02 muss im **echten Render** oben `SceneHeader` + Icon sichtbar sein
- ab scene-02 müssen unten echte audio-synchrone Captions sichtbar sein
- Bildszenen dürfen nicht als kleine quadratische Karten in viel Schwarz erscheinen
- Motion-Diversität wird über sichtbare Haupttechnik, Hero-Objektfamilie und camera+layout+transformation geprüft
- ein anderes Lottie/Icon/SVG-Support-Asset macht eine sonst gleiche Animation nicht zu einer neuen Haupttechnik

Phase 1, Phase-3-Preflight und finaler Candidate prüfen unterschiedliche Teile dieses Vertrags. Metadaten allein können die sichtbare Render-QA nicht bestehen.
