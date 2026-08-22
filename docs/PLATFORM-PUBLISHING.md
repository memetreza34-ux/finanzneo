# FinanzNeo — Plattform-Publishing

Dieses Dokument definiert die einfache Ausgabe-Struktur für Instagram Reels, TikTok, Facebook Reels und Snapchat.

`CLAUDE.md` bleibt die höchste Regelquelle.

**YouTube-Regel:** FinanzNeo veröffentlicht keine YouTube Shorts. YouTube ist ausschließlich für eigenständige längere Videos vorgesehen. Longform-Projekte liegen separat unter `youtube/`; Reel-Projekte werden nicht automatisch nach YouTube gespiegelt.

Das vollständige Longform-Upload-Paket einschließlich Titel, Beschreibung, Kapitel, Thumbnail-Brief, Quellen, Kommentar, Community-Post und vier Social-Promos ist in `youtube/PRODUKTIONSSTANDARD.md` definiert.

## 1. Keine neue Hauptordner-Struktur

Die bestehende einfache Reel-Struktur bleibt unverändert:

```text
01-script/
02-audio/
03-szenen/
04-caption/
05-projektdateien/
06-export/
README.md
```

Alle plattformspezifischen Veröffentlichungs-Texte für Reels liegen direkt in `04-caption/`.
Das plattformübergreifende finale Reel und sein Cover liegen ausschließlich als `06-export/reel.mp4` und `06-export/cover.png` vor.

## 2. Verbindlicher Inhalt von 04-caption

```text
04-caption/
├── caption.txt
├── instagram-reels.txt
├── tiktok.txt
├── facebook-reels.txt
├── snapchat.txt
└── word-timings.json
```

- `caption.txt` = geprüfte Master-Caption / gemeinsame Faktenbasis
- `instagram-reels.txt` = Instagram-Reels-Text
- `tiktok.txt` = TikTok-Text
- `facebook-reels.txt` = Facebook-Reels-Text
- `snapchat.txt` = Snapchat-Text
- `word-timings.json` = echte Wortzeiten für die Video-Untertitel, keine Publishing-Metadaten

`youtube-shorts.txt` ist in aktiven Reel-Projekten verboten.

## 3. Master-Caption

`caption.txt` ist die gemeinsame inhaltliche Quelle für alle Reel-Plattformtexte.

Sie enthält nur geprüfte Aussagen und bei Bedarf:

- kurze Zusammenfassung
- wichtige Annahmen
- Quellen-/Datenstand-Hinweis
- Hinweis `Keine Anlageberatung`, wenn sinnvoll
- PDF-/Kommentar-CTA, wenn für das Reel geplant

Plattformdateien dürfen die Fakten nicht verändern oder neue unbelegte Behauptungen hinzufügen.

## 4. Instagram Reels

`instagram-reels.txt`:

```text
CAPTION:
[plattformgerechter Text]

CTA:
[Frage / Kommentar-Keyword / PDF, falls geplant]

QUELLEN / HINWEIS:
[bei Bedarf]

HASHTAGS:
[passende Hashtags]

ANGEHEFTETER KOMMENTAR:
[optional]
```

## 5. TikTok

`tiktok.txt`:

```text
CAPTION:
[kurzer direkter Text]

CTA:
[Kommentar-/Follow-/PDF-CTA, falls geplant]

QUELLEN / HINWEIS:
[bei Bedarf]

HASHTAGS:
[passende Hashtags]
```

## 6. Facebook Reels

`facebook-reels.txt`:

```text
REEL-TEXT:
[verständlicher Begleittext]

CTA:
[Frage / Kommentar / PDF, falls geplant]

QUELLEN / HINWEIS:
[bei Bedarf]

HASHTAGS:
[passende Hashtags]
```

## 7. Snapchat

`snapchat.txt`:

```text
CAPTION:
[sehr kurze Begleitzeile]

CTA:
[optional]

QUELLEN / HINWEIS:
[nur wenn nötig]
```

## 8. Plattform-Regeln

- Dasselbe finale 9:16-Reel ist der Master für Instagram Reels, TikTok, Facebook Reels und Snapchat, solange keine konkrete Plattformanpassung nötig ist.
- Kein YouTube-Shorts-Upload und keine YouTube-Shorts-Metadaten aus einem Reel-Projekt erzeugen.
- YouTube-Longform ist ein eigenständiges Format unter `youtube/` und erhält einen separaten Workflow.
- Keine Fakten pro Plattform so umformulieren, dass sich ihre Bedeutung verändert.
- Keine Clickbait-Behauptung, die das Reel nicht erfüllt.
- Keine erfundenen Renditen, Garantien oder Finanzversprechen.
- Affiliate-/Werbebeziehungen transparent kennzeichnen, sobald relevant.
- Hashtags nur passend zum Inhalt; keine zufälligen Trend-Tags.
- Titel und Caption dürfen neugierig machen, aber nicht irreführen.
- Wenn exakte aktuelle Plattform-Limits oder neue Upload-Funktionen relevant werden, vor Veröffentlichung die aktuelle offizielle Plattform-Dokumentation prüfen; keine veralteten Limits im Repo fest verdrahten.

## 9. Abschlussregel pro Reel

Ein Reel ist publishing-seitig erst vorbereitet, wenn die vier Reel-Plattformdateien vorhanden und inhaltlich auf dasselbe finale Reel abgestimmt sind:

- Instagram Reels
- TikTok
- Facebook Reels
- Snapchat

Fehlende Plattformtexte verhindern einen rein manuellen technischen Remotion-Test nicht. Sie blockieren aber `npm run reel:ready` und damit den autonomen Start von Phase 3, weil ChatGPT sie bereits in Phase 1 vollständig vorbereitet.

YouTube gehört nicht zu diesem Reel-Publishing-Schritt. Längere YouTube-Videos werden separat unter `youtube/` produziert.
