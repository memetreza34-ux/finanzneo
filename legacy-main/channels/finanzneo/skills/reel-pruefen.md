# Skill: FinanzNeo-Reel prüfen

## Projektbasis

Nur Projekte unter diesem Muster prüfen:

```text
channels/finanzneo/reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Reel-Name/
```

`public/reels/` ist nur automatisches Remotion-Staging und niemals der Produktionsordner.

## Pflichtstruktur

- genau ein Reel-Ordner pro Tagesnummer,
- keine vorsorglich erzeugten leeren Tagesordner,
- `README.md`,
- `01-script-audio/script.md`,
- `01-script-audio/script-fliesstext.txt`,
- `01-script-audio/voiceover.txt`,
- `01-script-audio/audio/voiceover-final.wav`,
- `01-script-audio/audio/sfx/`,
- `02-bilder/bildprompts.md`,
- einzelne `02-bilder/prompts/<NN>-<szene>.txt`,
- exakt benannte Bilder unter `02-bilder/images/`,
- `03-caption/voiceover-final.captions.json`,
- `03-caption/social-caption.md`,
- `04-pdf/inhalt.md`,
- bei PDF-CTA eine gültige PDF unter `04-pdf/`,
- `05-export/`,
- `06-projektdateien/storyboard.md`,
- `06-projektdateien/motion-design.md`,
- `06-projektdateien/scene-plan.json`,
- `06-projektdateien/production-status.json`,
- `06-projektdateien/sources.md`,
- `06-projektdateien/prompt-manifest.json`,
- `06-projektdateien/content-package-report.json`,
- `06-projektdateien/asset-manifest.json`,
- finales Alignment.

## Themen- und Tagesprüfung

Prüfen:

- Thema wurde als `trend`, `evergreen` oder `user` dokumentiert,
- Auswahlgrund ist konkret,
- Thema ist nicht verwendet, reserviert oder stark ähnlich,
- genau ein Wochentag ist zugeordnet,
- pro Tagesnummer existiert genau ein Reel,
- es wurden keine sieben leeren Tagesordner angelegt.

## Ordnersperre

```bash
node scripts/check-finance-project-folder.mjs <projektordner>
```

## Inhaltspaket-Prüfung

Bevor Audio oder Bilder vom Nutzer angefordert werden:

```bash
npm run finance:content-ready -- <projektordner>
```

Sie prüft:

- fertiges und synchrones Skript,
- direkt kopierbaren Voiceover-Text,
- vollständige Quellen,
- 6–9 Bildbriefe und Einzelprompts,
- fertige Social Caption,
- vollständigen PDF-Inhalt,
- vollständiges Storyboard,
- vollständigen Motion-Plan,
- dokumentierte Themenwahl,
- entfernte TODO-, KEYWORD- und Platzhaltertexte.

Nur bei grünem `content-package-report.json` darf das Inhaltspaket als fertig gemeldet werden.

## Bildanzahl

Für ein normales Reel mit 60–75 Sekunden müssen 6–9 Bildbeats vorhanden sein. Zielwert ist 7.

Prüfen:

- drei Bilder sind kein Produktionsziel,
- höchstens zwei Szenen hintereinander ohne neues Bild oder gleichwertige Remotion-Visualisierung,
- keine Bilddatei wird für verschiedene Aussagen wiederverwendet,
- Vorher/Nachher, 2-in-1, 3-in-1 und 4-in-1 werden nur passend eingesetzt.

## Promptprüfung

```bash
npm run finance:image-prompts -- <projektordner>
npm run finance:image-prompt-qa -- <projektordner>
```

Jeder Einzelprompt muss:

- direkt kopierbar sein,
- ungefähr 140–260 Wörter umfassen,
- mit demselben FinanzNeo-Serienanker beginnen,
- zwei bis vier natürliche Absätze besitzen,
- den vollständigen gesprochenen Satz enthalten,
- Hauptmotiv, funktionale Nebenmotive und Ursache–Wirkung erklären,
- freie Header-, Daten- und Caption-Zonen enthalten,
- getrennte Motion-Ebenen vorbereiten,
- mit Sammeldatei, Manifest und Szenenplan synchron sein.

Blockieren bei:

- internen Überschriften,
- JSON- oder Planungsnotiz-Stil,
- allgemeinem Prompt ohne Szenenbezug,
- fehlendem Serienanker,
- positiver Labor-, Elektro-, Batterie-, Kabel- oder Cyberpunk-Welt,
- Produkt-Render oder isoliertem Objekt,
- erfundenen Logos,
- zu ähnlichen Prompts.

## Verbindliche Bildsichtprüfung

Jedes Bild manuell prüfen:

1. Aussage in 2–3 Sekunden verständlich.
2. vollständige Erklärszene statt Produktobjekt.
3. Fokus groß genug für Smartphone.
4. mindestens zwei funktionale Nebenmotive.
5. Ursache, Mechanismus und Geldfolge sichtbar.
6. Anthrazit, tiefes Waldgrün, Creme und entsättigtes Grau konsistent.
7. matte stilisierte isometrische Editorial-Optik.
8. gleiche Kamera, Materialien und Lichtstimmung.
9. Rot nur für Verlust oder Gefahr.
10. kein Labor-, Batterie-, Kabel-, Dashboard-, Kissen-, Geist-, Cyberpunk- oder Werbe-CGI-Look.
11. Header-, Daten- und Caption-Zonen frei.
12. Motion-Ebenen tatsächlich getrennt.
13. weder leer noch überladen.
14. alle Bilder wirken wie dieselbe FinanzNeo-Serie.

## Social-Caption-Prüfung

```bash
node scripts/check-finance-social-caption.mjs <projektordner>
```

## Exakte Medienprüfung

```bash
node scripts/check-finance-required-media.mjs <projektordner>
```

Sie blockiert bei fehlender oder leerer WAV-Datei, fehlenden Wort-Captions, fehlendem Einzelprompt, fehlendem oder anders benanntem Bild, beschädigten Medien, doppelten Asset-IDs oder fehlender gültiger PDF.

## Asset- und Alignmentprüfung

```bash
npm run finance:assets -- <projektordner>
npm run finance:align -- <projektordner>/06-projektdateien/scene-plan.json <projektordner>/03-caption/voiceover-final.captions.json <projektordner>/01-script-audio/audio/voiceover-final.wav
```

Kontrollieren:

- Manifest-Slug entspricht dem Reel-Slug,
- nur Runtime-Assets werden erfasst,
- Prompts, PDFs, Export und Projektdateien werden nicht als Render-Assets eingelesen,
- Voiceover besitzt messbare Dauer,
- Plan-, Caption- und Audioende stimmen überein,
- Alignment liegt über dem Mindestwert.

## Readiness

```bash
npm run typecheck
npm test
npm run finance:ready -- <projektordner>
```

Nur `READY` erlaubt Remotion oder Render.

## Reel-Sichtprüfung

1. Frame 0 zeigt Hauptmotiv und Konflikt.
2. persönliche Folge bis 1,5 Sekunden.
3. Kicker und Icon je Szene.
4. keine Text-/Caption-Kollision.
5. ungefähr höchstens 2,8 Sekunden ohne neue Bedeutung.
6. kein Zoom oder Glow als einzige Entwicklung.
7. höchstens eine kurze Text-only-Szene.
8. Zusatzinfos zeitlich gestaffelt.
9. Payoff beantwortet die Frage.
10. CTA dauert 3–5 Sekunden ohne Nachlauf.
11. Stimme ist verständlich und nicht monoton.
12. Finanzformulierungen entsprechen den Quellen.

## Render und Export

```bash
npm run finance:render -- <projektordner>
```

Nur bei bestandener Render-QA landen MP4, Social Caption, Untertitel, PDF und Exportmanifest unter `05-export/`.

## Fertig-Definition

Ein Reel ist erst fertig, wenn Themenwahl, einzelner Tagesordner, grünes Inhaltspaket, Skript, Voice, 6–9 Einzelprompts, Audio, Bilder, Wort-Captions, Social Caption, PDF-Regel, Asset-Ingest, Alignment, Readiness, Render-QA, Exportpaket und manuelle Kontrollframes vollständig bestanden sind.
