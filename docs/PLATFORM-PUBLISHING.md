# FinanzNeo — Plattform-Publishing

`CLAUDE.md` bleibt die höchste Regelquelle.

## Reel-Plattformen

Dasselbe 9:16-Reel und dieselbe Caption werden standardmäßig auf folgenden Plattformen verwendet:

- Instagram Reels
- TikTok
- Facebook Reels
- Snapchat

YouTube Shorts werden nicht erzeugt. YouTube ist ausschließlich eigenständiges Longform unter `youtube/`.

## Kanonische Caption

Aktives Reel-Projekt:

```text
04-caption/
├── caption.txt
└── word-timings.json
```

- `caption.txt` = einzige Publishing-Caption für alle vier Reel-Plattformen
- `word-timings.json` = echte Wortzeiten für eingebrannte/optionale Untertitel, keine zweite Social-Caption

Separate Instagram-, TikTok-, Facebook- oder Snapchat-Captiondateien sind verboten. Dadurch gibt es nur eine inhaltliche Wahrheit und keinen Drift zwischen Plattformen.

## Finaler Export

Nach bestandener Render-QA kopiert der kanonische Export `04-caption/caption.txt` nach:

```text
06-export/caption-universal.txt
```

Diese eine Datei wird auf Instagram Reels, TikTok, Facebook Reels und Snapchat verwendet. Es werden keine separaten Plattform-Captiondateien erzeugt.

## Inhaltliche Regeln

Die Caption darf nur geprüfte Aussagen enthalten. Quellen-/Datenstand-Hinweise, Werbe-/Affiliate-Kennzeichnung und CTA werden nur ergänzt, wenn sie für das Reel tatsächlich nötig sind. Keine erfundenen Renditen, Garantien, irreführenden Versprechen oder zufälligen Trend-Hashtags.

Aktuelle Plattformlimits werden bei Bedarf vor Veröffentlichung anhand offizieller Quellen geprüft und nicht dauerhaft als fragile Zahlen in den Repo-Vertrag geschrieben.
