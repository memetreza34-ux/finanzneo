# FinanzNeo – vollständige Übergabe an Codex

## Ziel

Der kreative Teil wird vorab vollständig vorbereitet. Codex soll nicht erneut Thema, Skript oder Bildideen erfinden, sondern das freigegebene Paket technisch hochwertig umsetzen.

## Phase A – kreatives Reel-Paket

Vor dem Start in Codex müssen feststehen:

- Thema und zentrale Frage,
- Hook und Payoff,
- vollständiger deutscher Voiceover-Text,
- Cover-Text,
- Szenenreihenfolge und Szenenlängen,
- Entscheidung `image` oder `animation` pro Szene,
- finaler Bildprompt für jede Bildszene,
- genaue Remotion-Beschreibung für jede Animationsszene,
- Overlays, Untertitelstil, Übergänge und optionale Sound-Cues,
- Quellen und geprüfte Finanzrechnungen.

Diese Angaben werden in

```text
06-projektdateien/codex-reel-package.json
```

gespeichert. Ausgangspunkt ist:

```text
channels/finanzneo/templates/codex-reel-package.template.json
```

## Phase B – Medien durch den Nutzer

Der Nutzer erzeugt nur die im Paket genannten Medien und legt sie exakt unter den angegebenen Pfaden ab.

Pflicht:

```text
01-script-audio/audio/voiceover-final.wav
02-bilder/images/<scene>.png
02-bilder/prompts/<scene>.txt
```

Optionale Soundeffekte werden ebenfalls nur verwendet, wenn ihr Pfad im Paket eingetragen ist.

Vor Codex:

```bash
npm run finance:codex-reel:check-ready -- <projektordner>
```

Der Befehl stoppt bei fehlenden Dateien, Platzhaltern, falschem Bild-Animations-Verhältnis oder unvollständigen Freigaben.

## Phase C – Codex baut das Reel

Codex übernimmt:

1. Projekt- und Assetprüfung.
2. Reel-spezifische Remotion-Composition.
3. Einbindung aller Bilder.
4. Bildfahrten, Zooms und Parallax laut Paket.
5. Entwicklung der beschriebenen narrativen Animationen.
6. Voiceover-Einbindung.
7. Untertitel.
8. Overlays, Cover, Übergänge und freigegebene Sound-Cues.
9. TypeScript, Tests, Stills und MP4-Render.
10. Visuelle Prüfung und einen ehrlichen Abschlussbericht.

Fehlen finale Wort-Zeitstempel, darf Codex nach erfolgreicher Assetprüfung provisorische Captions erzeugen:

```bash
npm run finance:codex-reel:captions -- <projektordner>
```

Diese Captions beruhen auf Skript und Audiodauer, nicht auf Spracherkennung. Die Synchronität muss im Video geprüft werden.

## Standardauftrag für Codex

```text
Arbeite im Repository FinanzNeo und befolge alle AGENTS.md-Dateien.

Aktives Projekt:
<PROJEKTORDNER>

Lies zuerst:
- 06-projektdateien/codex-reel-package.json
- 06-projektdateien/scene-plan.json
- 06-projektdateien/production-status.json
- 06-projektdateien/asset-manifest.json, falls vorhanden

Führe vor jeder Codeänderung aus:
npm run finance:codex-reel:check-ready -- <PROJEKTORDNER>

Stoppe bei einem Fehler und nenne die exakten fehlenden oder widersprüchlichen Felder und Dateien.

Wenn die Prüfung erfolgreich ist:
1. Erstelle eine isolierte reel-spezifische Remotion-Composition unter dem im Paket vorgesehenen Source-Pfad.
2. Übernimm Skript, Szenenreihenfolge, Cover-Text, Bilddateien und Animationsbeschreibungen unverändert.
3. Bildszenen müssen die Hauptfläche einnehmen. Verwandle sie nicht in Dashboard-Karten.
4. Entwickle nur die im Paket vorgesehenen Animationsszenen. Jede Animation muss ihre beschriebene Handlung, Startlage und Endlage sichtbar zeigen.
5. Integriere Voiceover, Captions, Overlays, Übergänge und freigegebene Sound-Cues.
6. Erzeuge reel-spezifische Befehle für Studio, Stills, Render und Validierung.
7. Führe Typecheck, Tests, Stills und den vollständigen MP4-Render aus.
8. Prüfe mindestens einen Frame pro Szene, alle Übergänge, Untertitelbereich, Cover und Videoende.

Nicht mergen, keine Feature-Flags aktivieren, keine produktive Composition ersetzen und den PR nicht auf Ready setzen.

Berichte getrennt:
- implementierte Dateien,
- tatsächlich ausgeführte Befehle,
- bestandene Tests,
- Renderpfade und Dateigrößen,
- visuelle Prüfung pro Szene,
- verbleibende Probleme,
- Merge- und Produktionsstatus.
```

## Abnahme

Ein Reel gilt nicht allein durch einen erfolgreichen Render als fertig. Erforderlich sind:

- vollständiges MP4 vorhanden,
- alle Bilder korrekt verwendet,
- Voiceover vollständig hörbar,
- Caption-Safe-Zone frei,
- Bildszenen überwiegen sichtbar,
- Animationsszenen erklären unterschiedliche Handlungen,
- keine wiederholten Dashboard-Layouts,
- keine falschen Finanzwerte,
- Nutzerfreigabe nach Sichtung.
