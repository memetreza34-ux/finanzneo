# FinanzNeo — YouTube-Longform-Produktionsstandard

> Bei Widersprüchen gilt `CLAUDE.md`.

## Projektstruktur

```text
01-recherche/
02-script/
03-audio/
04-visuals/
05-publishing/
06-projektdateien/
README.md
```

## Format und Inhalt

- eigenständiges längeres Finanz-Erklärvideo, kein verlängertes Reel
- keine YouTube Shorts
- 1920 × 1080, horizontal 16:9, 30 fps
- Länge folgt dem Thema; keine künstlichen Füllpassagen
- Hook ohne langes Intro
- Kapitel mit klaren Zwischenzielen und Payoffs
- einfache Sprache für Finanzanfänger
- Zahlen, Annahmen und Datenstand prüfbar dokumentieren
- keine individuelle Anlageberatung oder garantierte Rendite

## Bildwelt und Google Flow

- dieselbe FinanzNeo-Welt wie bei Reels: `finanzneo-connected-studio-v3`
- derselbe Serien-Lock: `finanzneo-same-world-v1`
- YouTube-Quellbilder sind horizontal 16:9; Reel-Quellbilder bleiben separat 1:1
- Bildprompts immer Englisch; nur ausdrücklich gewünschte kurze Objektlabels im Bild sind Deutsch
- eine dominante Finanzmetapher, wenige unterstützende Objekte
- Person optional; wenn vorhanden, Gesicht klar sichtbar
- ein einziger nahtloser deep-charcoal-green-black Hintergrund
- Gold nur für Geld/Wert, warmes Rot-Orange nur für Risiko/Verlust/Schulden
- keine Headline, Untertitel oder erklärenden Sätze im KI-Bild
- Thumbnail zuerst; danach nur als Stilreferenz, nicht als Motivvorlage

Einzige Übergabe an Google Flow:

```text
04-visuals/alle-bildprompts.txt
```

Jedes Bild wird einzeln erzeugt, vollständig abgewartet, sofort exakt umbenannt und geprüft. Erst danach folgt das nächste Bild. Alle fertigen Dateien liegen gemeinsam in `04-visuals/00-ALLE-BILDER-HIER-REIN/`.

## Audio, Timing und Untertitel

- genau ein finales Voiceover in `03-audio/`
- echte Wort-Zeitstempel aus genau diesem Audio
- Schnitte folgen Sprache, Kapiteln und inhaltlichen Payoffs
- keine pauschal gleich langen Visuals
- Untertitel satzweise; aktives Wort grün, Rest weiß
- Audioziel ungefähr -16 LUFS, True Peak höchstens -1 dBTP

## Vollständiges Publishing-Paket

`05-publishing/` enthält:

- fünf belastbare Titelvarianten und einen finalen Titel
- vollständige Beschreibung
- Kapitel-Zeitstempel
- Keywords/Tags und passende Hashtags
- Thumbnail-Brief
- Quellen-/Disclaimer-Text
- angehefteten Kommentar
- Community-Post
- Upload-Checkliste
- Promo-Texte für Instagram, TikTok, Facebook und Snapchat

Titel und Thumbnail dürfen neugierig machen, aber nichts versprechen, was das Video nicht erfüllt. Aktuelle Plattformgrenzen werden nicht fest im Repo verdrahtet, sondern vor einer konkreten Veröffentlichung offiziell geprüft.

## Startfreigabe

```bash
npm run youtube:validate -- youtube/<Projekt>
npm run youtube:ready -- youtube/<Projekt>
```

`youtube:ready` prüft Phase 1, exakte Nutzerbilder, 16:9-Abmessungen, genau ein lesbares Voiceover, passende Wortzeiten und das vollständige Publishing-Paket. Nur ein erfolgreicher Lauf gibt Phase 3 frei.
