# FinanzNeo — Plattform-Publishing

Dieses Dokument definiert die einfache Ausgabe-Struktur für YouTube Shorts, Instagram Reels, TikTok, Facebook Reels und Snapchat.

`CLAUDE.md` bleibt die höchste Regelquelle.

## 1. Keine neue Hauptordner-Struktur

Die bestehende einfache Reel-Struktur bleibt unverändert:

```text
01-script/
02-audio/
03-szenen/
04-caption/
05-projektdateien/
README.md
```

Alle plattformspezifischen Veröffentlichungs-Texte liegen direkt in `04-caption/`.

## 2. Verbindlicher Inhalt von 04-caption

```text
04-caption/
├── caption.txt
├── youtube-shorts.txt
├── instagram-reels.txt
├── tiktok.txt
├── facebook-reels.txt
├── snapchat.txt
└── word-timings.json
```

- `caption.txt` = geprüfte Master-Caption / gemeinsame Faktenbasis
- `youtube-shorts.txt` = YouTube-Shorts-Metadaten
- `instagram-reels.txt` = Instagram-Reels-Text
- `tiktok.txt` = TikTok-Text
- `facebook-reels.txt` = Facebook-Reels-Text
- `snapchat.txt` = Snapchat-Text
- `word-timings.json` = echte Wortzeiten für die Video-Untertitel, keine Publishing-Metadaten

## 3. Master-Caption

`caption.txt` ist die gemeinsame inhaltliche Quelle für alle Plattformtexte.

Sie enthält nur geprüfte Aussagen und bei Bedarf:

- kurze Zusammenfassung
- wichtige Annahmen
- Quellen-/Datenstand-Hinweis
- Hinweis `Keine Anlageberatung`, wenn sinnvoll
- PDF-/Kommentar-CTA, wenn für das Reel geplant

Plattformdateien dürfen die Fakten nicht verändern oder neue unbelegte Behauptungen hinzufügen.

## 4. YouTube Shorts

`youtube-shorts.txt` verwendet diese Struktur:

```text
TITEL:
[starker deutscher Titel]

BESCHREIBUNG:
[kurze verständliche Beschreibung]

CTA:
[Kommentar-/PDF-/Follow-CTA, falls geplant]

QUELLEN / HINWEIS:
[bei Bedarf]

HASHTAGS:
[wenige passende Hashtags]

ANGEHEFTETER KOMMENTAR:
[optional]
```

YouTube Shorts ist Teil der normalen Short-Produktion. Longform-YouTube ist ein separates späteres Format und wird nicht in einen Short-Reel-Ordner gemischt.

## 5. Instagram Reels

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

## 6. TikTok

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

## 7. Facebook Reels

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

## 8. Snapchat

`snapchat.txt`:

```text
CAPTION:
[sehr kurze Begleitzeile]

CTA:
[optional]

QUELLEN / HINWEIS:
[nur wenn nötig]
```

## 9. Plattform-Regeln

- Dasselbe finale 9:16-Reel ist der Master für alle Short-Plattformen, solange keine konkrete Plattformanpassung nötig ist.
- Keine Fakten pro Plattform umformulieren, bis ihre Bedeutung verändert wird.
- Keine Clickbait-Behauptung, die das Reel nicht erfüllt.
- Keine erfundenen Renditen, Garantien oder Finanzversprechen.
- Affiliate-/Werbebeziehungen transparent kennzeichnen, sobald relevant.
- Hashtags nur passend zum Inhalt; keine zufälligen Trend-Tags.
- Titel und Caption dürfen neugierig machen, aber nicht irreführen.
- Wenn exakte aktuelle Plattform-Limits oder neue Upload-Funktionen relevant werden, vor Veröffentlichung die aktuelle offizielle Plattform-Dokumentation prüfen; keine veralteten Limits im Repo fest verdrahten.

## 10. Abschlussregel pro Reel

Ein Reel ist publishing-seitig erst vorbereitet, wenn die fünf Plattformdateien vorhanden und inhaltlich auf dasselbe finale Reel abgestimmt sind:

- YouTube Shorts
- Instagram Reels
- TikTok
- Facebook Reels
- Snapchat

Fehlende Plattformtexte verhindern nicht den technischen Remotion-Render, müssen aber vor dem geplanten Cross-Platform-Publishing ergänzt werden.
