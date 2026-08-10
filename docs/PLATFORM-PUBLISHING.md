# FinanzNeo — Plattform-Publishing

Dieses Dokument definiert die gemeinsame Publishing-Caption für Instagram Reels, TikTok, Facebook Reels und Snapchat.

`CLAUDE.md` bleibt die höchste Regelquelle.

**YouTube-Regel:** FinanzNeo veröffentlicht keine YouTube Shorts. YouTube ist ausschließlich für eigenständige längere Videos unter `youtube/` vorgesehen.

## 1. Einfache Struktur

```text
04-caption/
├── caption.txt
└── word-timings.json
```

- `caption.txt` = die **eine fertige Social-Caption für alle vier Reel-Plattformen**
- `word-timings.json` = echte Wortzeiten für die Video-Untertitel; keine Publishing-Metadaten

Keine zusätzlichen plattformspezifischen Caption-Dateien.

## 2. Eine Caption für alle Plattformen

Dieselbe `caption.txt` wird **1:1 und unverändert** verwendet für:

- Instagram Reels
- TikTok
- Facebook Reels
- Snapchat

Es werden keine separaten Varianten erstellt.

## 3. Verbindlicher Caption-Aufbau

Die finale Datei enthält direkt den kopierfertigen Text — ohne `CAPTION:`, `CTA:` oder andere Template-Überschriften.

Empfohlene Dramaturgie:

```text
[STARKE ERSTE ZEILE / HOOK]

[KURZE KERNAUSSAGE ODER AHA-NUTZEN]

[KURZER NATÜRLICHER CTA, WENN PASSEND]

#Hashtag1 #Hashtag2 #Hashtag3 #Hashtag4 #Hashtag5
```

Regeln:

- erste Zeile soll sofort Neugier, ein konkretes Problem oder einen klaren Nutzen auslösen
- kurz genug, dass dieselbe Caption plattformübergreifend sinnvoll bleibt
- Inhalt muss exakt zum Reel passen
- möglichst speicher-/teilbar formulieren, aber nicht künstlich clickbaiten
- kein Versprechen wie `geht garantiert viral`
- CTA nur, wenn er natürlich passt
- **genau 5 Hashtags**
- alle 5 Hashtags müssen thematisch relevant und eindeutig sein
- keine zufälligen Trend-Tags, kein Hashtag-Spam und kein irrelevantes `#fyp`, `#foryou` oder `#viral`
- Fakten nicht verändern oder neue unbelegte Behauptungen hinzufügen
- Quellen/Datenstand bleiben primär in `05-projektdateien/recherche-quellen.md`
- `Keine Anlageberatung` nur in die Caption aufnehmen, wenn es für das konkrete Reel sinnvoll/notwendig ist

## 4. Verbotene alte Dateien

In aktiven neuen Reel-Projekten dürfen diese Dateien nicht existieren:

```text
instagram-reels.txt
tiktok.txt
facebook-reels.txt
snapchat.txt
youtube-shorts.txt
```

Alte Archive können historisch anders aufgebaut sein; sie sind keine Vorlage für neue Reels.

## 5. Qualitätsziel

Die Caption soll möglichst stark für Aufmerksamkeit, Saves, Shares und Kommentare formuliert sein. Viralität kann nicht garantiert werden. Optimiert wird auf:

- starke erste Zeile
- sofort verständlichen Nutzen
- konkrete Sprache
- kurze Lesedauer
- natürliche Interaktion
- genau 5 relevante Hashtags

## 6. Abschlussregel

Publishing-seitig ist ein neues Reel vorbereitet, wenn `04-caption/caption.txt` als finale universelle Caption vorliegt und exakt fünf relevante, eindeutige Hashtags enthält.

YouTube gehört nicht zu diesem Reel-Publishing-Schritt. Longform-YouTube wird separat unter `youtube/` produziert.
