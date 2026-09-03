# ANTIGRAVITY — PHASE 3

1. Nutzer liefert alle finalen Google-Flow-Bilder aus 03-szenen/00-ALLE-BILDER-HIER-REIN/.
2. Nutzer liefert genau ein finales Voiceover in 02-audio/.
3. Erzeuge oder übernehme echte Wort-Zeitstempel aus diesem Voiceover.
4. Retiming folgt finanzneo-visual-beats-v2; keine künstlich gleich langen Szenen und keine tote visuelle Wartezeit.
5. Nutze exakt die versiegelten Phase-1-animation.tsx-Dateien; nach dem Seal keine Mechanik kreativ ersetzen.
6. SFX nur framegenau und unterhalb der Voiceover-Priorität.
7. Playwright-/Render-QA ist Pflicht; sichtbarer Timing-, Layout- oder Erklärfehler = FAIL.
8. Danach Preflight → Candidate → Render-QA → automatischer Export nach 06-export/.

Antigravity erzeugt weder die finalen Google-Flow-Bilder noch das Haupt-Voiceover.


COVER_HOOK_CONTRACT: finanzneo-cover-hook-v2

## Szene 01 — harter Render-Vertrag

- Szene 01 ist ein echtes Reel-Cover und zugleich der erste sichtbare Videoframe.
- Rendere den exakten Titel aus scene-index.title mit Remotion bereits bei Frame 0. Kein Fade-in, kein Intro davor, keine verzögerte Einblendung.
- Während scene-01 darf KEINE Caption-/Subtitle-Komponente gemountet oder sichtbar sein. Untertitel beginnen erst mit scene-02.
- Szene 01 enthält nur Hero-Bild + Reel-Titel. Kein normales SceneHeader-Icon, keine zweite Textzeile als Erklärung, kein CTA, keine Zusatzkarte.
- Der Titel muss mindestens die ersten 30 Frames stabil lesbar sein und darf während scene-01 sichtbar bleiben.
- Das Flow-Bild selbst enthält den Titel NICHT; die exakte Typografie kommt aus Remotion.
- Implementiere die Caption-Sperre im tatsächlichen Composition-Code über die aktive Szene/Frame-Grenze, nicht nur über Metadaten.
- Playwright/Render-QA muss Frame 0 prüfen: Titel sichtbar, Bild sichtbar, keine Untertitel, kein Icon, keine Zusatztexte.
- Der finale Export erzeugt cover.png aus Frame 0 der bereits geprüften finalen MP4. So ist das Cover exakt dieselbe sichtbare erste Szene inklusive Titel.


IMAGE_STORYTELLING_CONTRACT: finanzneo-image-storytelling-v2

FUTURE IMAGE STORYTELLING V2 — VERBINDLICH:
- Baue zuerst eine konkrete Alltagssituation, sichtbare Handlung, sichtbaren Konflikt oder sichtbare Konsequenz; erst danach Stil/Details.
- Das Motiv muss ohne Untertitel in unter einer Sekunde verständlich und interessant sein.
- Keine stumpfen Symbolbilder als Haupterklärung: kein einzelnes Sparschwein, keine einzelne Münze, kein isoliertes Konto-Icon, wenn eine echte Situation die Aussage besser zeigt.
- Keine dekorative Objektansammlung und kein statisches Katalog-Stillleben. Jedes relevante Objekt braucht eine Funktion in der Aussage.
- Bevorzuge Ursache → Wirkung, Vorher → Nachher, Handlung → Konsequenz oder einen klaren visuellen Kontrast.
- Eine Person oder menschlicher Kontext darf eingesetzt werden, wenn dadurch die Alltagssituation sofort klarer wird; Menschen sind kein Pflicht-Dekor.
- Kurze deutsche Objektlabels sind nur Ergänzung. Das Bild muss die Aussage bereits ohne Label tragen.
- Wenn ein Satz mehrere konkrete visuelle Gedanken enthält, lieber ein zusätzliches Bild / einen zusätzlichen Visual Beat planen als ein überladenes Bild.
- Unterhaltung entsteht durch Handlung, Spannung, Kontrast und sichtbare Veränderung — nicht durch zufällige Deko.

## Future V3 Finalisierung

FUTURE_PRODUCTION_STANDARD: finanzneo-future-production-v3

Vor Post-Render-QA wird der finale Candidate automatisch auf -16 LUFS / -1 dBTP gemastert. Nicht manuell umgehen. Bei langen statischen Holds lieber zusätzliche Visual Beats nutzen. Animations-Hauptmechanik groß und bildfüllend halten; excessive empty space gilt als Qualitätsfehler.
