# Finance V1 — einfache Architektur zuerst

## Ziel

Ein sauberes, wiederverwendbares Produktionssystem ohne Themen-Composition und ohne neue Architektur pro Reel.

## Leitregel

**So wenig Ebenen wie möglich, so viele wie nötig.**

- Claude Code als einziger ausführender Agent
- drei Arbeitsmodi desselben Claude-Code-Laufs
- drei Pflichtdateien plus optionaler Revisionspatch
- eine Konfiguration
- ein Laufzeitvertrag
- acht technische Grundlayouts
- zwölf sichtbare Muster
- drei kurze Skills
- kein Musikbett und nur optionale semantische SFX

## Drei Arbeitsmodi von Claude Code

Claude Code bleibt in allen drei Modi derselbe Agent. Es findet keine automatische Übergabe an drei Subagenten statt.

### 1. Planen

- Fakten und Originalquellen prüfen
- Quellen, Abrufdaten und `claimIds` speichern
- Hook, zentrale Frage und Payoff festlegen
- 150–200 Wörter schreiben
- Skript vollständig auf `voiceText` je Szene verteilen
- Bildprompts, Layouts und Phasen festlegen
- strukturierte Rechnungen speichern
- optionale SFX nur bei einer sichtbaren Aktion planen

### 2. Bauen

- Originalstimme vorbereiten und Lautheit messen
- finale Stimme transkribieren
- Bilder und optionale SFX erfassen
- Bilder automatisch analysieren
- Szenen anhand der transkribierten Wörter ausrichten
- allgemeine `FinanceV1`-Composition verwenden

### 3. Prüfen

- Skript, Quellen, Rechnungen, Timing, Captions, Assets und Layoutregeln prüfen
- feste H.264-/AAC-Ausgabe rendern
- finale MP4 technisch analysieren
- acht Kontrollframes visuell prüfen
- nur konkrete Fehler korrigieren

Subagenten sind keine Standardebene. Claude Code nutzt sie nur bei einer wirklich unabhängigen Spezialaufgabe.

## Projektdateien

1. `scene-plan.json` — Quellen, Claims, Skript, Voiceover-Anweisung, `voiceText`, Bildprompts, Rechnungen, SFX und Szenen
2. `asset-manifest.json` — Bilder, Audio, Captions, Videos, Daten und Bildanalyse
3. `qa-report.json` — Fehler, Warnungen und Messwerte vor dem Render
4. `revision-patch.json` — nur bei mehreren gezielten Korrekturen

Nach dem Render entstehen zusätzlich außerhalb des Reel-Quellordners:

```text
out/<slug>.mp4
out/<slug>-qa/report.json
out/<slug>-qa/stills/
```

Keine zusätzlichen Standarddateien für Brief, Skript oder Renderinput.

## Eine Konfiguration und ein Vertrag

- `engine/config/finance-v1.json` ist die einzige Grenzwertquelle.
- `scripts/lib/finance-contracts.mjs` ist die einzige Laufzeitvalidierung.
- `src/engine/contracts.ts` typisiert nur den Renderer.

Parallele Finance-Schemas sind nicht erlaubt.

## Timing

Die finale Audiodatei ist die einzige Zeitquelle.

```text
Originalstimme
→ Pausen kürzen
→ leicht beschleunigen
→ normalisieren
→ tatsächliche Lautheit messen
→ transkribieren
→ Skriptwörter den Transkriptwörtern zuordnen
→ Szenengrenzen daraus berechnen
```

Keine proportionale Skalierung eines alten Plans.

## Layout-System

Technische Basis:

- Full Bleed
- Framed Image
- Big Number
- Split Comparison
- Process
- Chart
- Text Punch
- CTA

Sichtbare Varianten:

- Full Bleed Hero
- Detail Focus
- Framed Editorial
- Split Image/Text
- Multi Panel 2/3/4
- Big Number
- Calculation Build
- Comparison / Before-After
- Process / Checklist
- Chart / Timeline
- Text Punch / Payoff
- CTA

## Längere Szenen

Szenen von etwa 5–8 Sekunden entwickeln sich in zwei bis drei Phasen.

- `at` steuert den relativen Zeitpunkt.
- `assetId` führt einen echten Assetwechsel aus.
- `focus` steuert relative Koordinaten für Detailfokus.
- Debug-Marker sind im Produktionsrender aus.
- Zoom allein ist keine inhaltliche Phase.

## Motion und Übergänge

Claude Code nutzt eine kleine feste Sprache:

- Reveal
- Focus
- Build
- Compare
- Payoff

Übergänge werden aus der Beziehung der Szenen gewählt:

- `cut` für einen neuen klaren Fakt
- `push` für Ursache und Folge
- `wipe` für Gegenüberstellung oder Wechsel
- `zoom-through` für Gesamtbild und Detail
- `match-move` für dasselbe Objekt in einem neuen Zustand

Keine zusätzliche Motion-Bibliothek ohne wiederkehrenden Bedarf.

## Sound

- kein Musikbett
- höchstens ein optionaler SFX-Cue pro Szene
- nur erlaubte Rollen aus der Konfiguration
- Standardlautstärke 0,18 und Maximum 0,30
- kein Sound nur wegen eines Schnitts

## Allgemeiner Renderer

Alle Themen verwenden dieselbe Composition:

```text
FinanceV1
← scene-plan.json
← asset-manifest.json
← finale Captions
← finale Audiodatei
```

`FinanceProductionLayer` ergänzt durchgehende Captions und optionale SFX. `finance:new` erzeugt nur Datenordner. Es gibt keine Themen-TSX-Datei und keine manuelle Root-Registrierung.

## QA vor dem Render

Automatisch geprüft werden:

- 60–75 Sekunden und 150–200 Wörter
- Hook, Satzlänge, Wiederholungen, Payoff und CTA
- 10–14 Szenen
- Layout- und Mustervielfalt
- Quellen- und `claimId`-Zuordnung
- riskante Finanzformulierungen
- strukturierte Rechnungen
- Transkript-Alignment
- Audio-, Plan- und Captionende
- Caption-Lücken und Überlappungen
- fehlende Assets und Phasen-Assets
- SFX-Rollen und Lautstärken
- Bildhelligkeit, Dichte, Safe-Zones und Duplikate
- Multi-Panel-Assetanzahl
- Detailfokus-Koordinaten
- Textgrenzen
- CTA-Dauer

## QA nach dem Render

Automatisch geprüft werden:

- Video- und Audiospur
- 1080×1920 und 30 fps
- Dauer, Codec und Pixelformat
- Loudness und True Peak
- Schwarzbildabschnitte
- auffällige Freeze-Abschnitte
- Anfangs- und Endstille
- acht Kontrollframes

Manuell bleiben:

- tatsächliche Qualität von Frame 0
- Motivverständlichkeit
- Caption-Kollisionen am gerenderten Bild
- optische Balance und Smartphone-Lesbarkeit
- Wirkung der Dramaturgie, Motion und SFX

## Neutraler End-to-End-Test

Der technische Test erzeugt temporär:

- 68 Sekunden Audio
- Wort-Captions
- drei analysierbare Platzhalterbilder
- einen SFX-Cue
- eine strukturierte Rechnung
- einen vollständigen Plan

Danach läuft:

```text
Ingest und Bildanalyse
→ Alignment
→ Skript- und Final-QA
→ generischer Kontrollframe
```

Eine zweite Fixture prüft die finale MP4-QA mit einem synthetischen 60-Sekunden-Video.

## Freigabe

Der erste echte Testfall beginnt erst, wenn:

- ein GitHub-Runner die vollständige Finance-Prüfung tatsächlich ausführt
- Typecheck und Tests bestehen
- der neutrale End-to-End-Test besteht
- die MP4-QA-Fixture besteht
- die Layout-Galerie nach visuellen Änderungen ohne Regressionen rendert
- keine parallele Vertrags- oder Agentenquelle existiert
- das System weiterhin einfach verständlich bleibt
