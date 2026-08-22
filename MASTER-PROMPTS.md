# FinanzNeo — aktuelle Master-Prompts

> `CLAUDE.md` ist die höchste Regelquelle.

Vor neuen Reels zusätzlich lesen:

- `docs/3-PHASEN-WORKFLOW.md`
- `reels/PRODUKTIONSSTANDARD.md`
- `docs/FINANZNEO-IMAGE-WORLD-V3.md`
- `docs/IMAGE-SYSTEM.md`
- `docs/BEAT-TO-IMAGE-RULES.md`
- `docs/IMAGE-PROMPT-LIBRARY.md`
- `docs/IMAGE-QA-CHECKLIST.md`
- `docs/PLATFORM-PUBLISHING.md`

Vor YouTube-Longform zusätzlich lesen:

- `docs/YOUTUBE-LONGFORM-WORKFLOW.md`
- `youtube/PRODUKTIONSSTANDARD.md`

## 1. Phase 1 — ChatGPT bereitet komplett vor

```text
Neues FinanzNeo-Reel.

Thema: [THEMA]

Arbeite nach allen aktuellen Repo-Regeln und erstelle selbstständig:
1. Recherche mit Quellen und Datenstand
2. Lernziel und Kernaussage
3. geprüftes 60–90-Sekunden-Skript
4. Szenen-/Beat-Liste
5. animation-first Zuordnung: ungefähr 60 % echte Remotion-Mechanismen und 40 % Bilder; geringeren Animationsanteil fachlich begründen
6. vollständige Google-Flow-Bildprompts mit echtem Szenen-Dateinamen
7. Remotion-Spezifikationen mit visueller Metapher, Startzustand, sichtbarer Handlung/Mechanismus und Endzustand
8. Master-Caption + Reel-Plattformdateien für Instagram Reels, TikTok, Facebook Reels und Snapchat

Antigravity erzeugt keine Bilder. Der Nutzer erzeugt alle Bilder selbst mit Google Flow.
Keine YouTube Shorts erzeugen. YouTube ist ausschließlich ein separater Longform-Bereich unter `youtube/`.

Schreibe alle Ergebnisse direkt in die verbindliche Reel-Struktur. Entferne alle Platzhalter aus Skript, Recherche, Szenenplan, Bildprompts, scene-index und Plattformtexten. Erzeuge selbst keine finalen Bilder und kein Ersatz-Voiceover.
Erstelle `03-szenen/alle-bildprompts.txt` als einzige Agent-Übergabedatei mit `FLOW_AGENT_PROTOCOL: finanzneo-flow-sequential-v1` und `FINANZNEO_SERIES_LOCK: finanzneo-same-world-v1`. Der Agent muss genau ein Bild erzeugen, vollständig warten, sofort exakt umbenennen, prüfen und erst danach fortfahren. Fehlerhafte Bilder werden unter derselben Nummer neu erzeugt.
Definiere im `scene-index.json` außerdem den sichtbaren Remotion-Covertext: Headline, Akzentzeile und Payoff. Das Google-Flow-Coverbild selbst enthält keine große Headline.
```

## 2. Phase 3 — Antigravity baut autonom

```text
Mach das Reel: reels/<Woche>/<Tag>/<Reel>

Prüfe zuerst vollständig mit `npm run reel:ready -- <Reel-Pfad>`.
Wenn die Prüfung erfolgreich ist, beginne sofort und arbeite ohne Rückfragen oder Zwischenstopps bis zur technischen und visuellen QA des fertigen Renders.
Rendere das finale Video direkt nach `<Reel-Pfad>/06-export/reel.mp4` und das finale Cover mit sichtbarer Remotion-Headline, Akzentzeile und Payoff direkt nach `<Reel-Pfad>/06-export/cover.png`.
Beende den Auftrag erst nach erfolgreichem `npm run reel:final -- <Reel-Pfad>`.
Triff normale Detailentscheidungen selbst nach CLAUDE.md.
Stoppe nur bei echten Pflichtasset-, Fakten-, Sicherheits-, Validator-, Build- oder Renderblockern. Melde dann alle Blocker gesammelt mit exakten Pfaden.
```

## 3. Bildprompt erstellen

```text
Erstelle einen FinanzNeo-Bildprompt für diesen gesprochenen Satz:
[SATZ]

Verbindlich:
- Google-Flow-Quellbild immer quadratisch 1:1; Breite und Höhe identisch
- kein Portrait-/Hochformat; 9:16 entsteht erst in Remotion
- Premium Fintech Editorial 3D
- EINE dominante Finanzmetapher / großes Hauptobjekt
- optional stilisierte erwachsene 3D-Person
- wenn Person: Gesicht mit Augen, Nase und Mund klar sichtbar; frontal oder natürliche 3/4-Ansicht
- deep charcoal green-black
- vivid emerald/mint
- Gold nur für Geld/Wert
- warmes Rot-Orange nur für Risiko/Verlust/Schulden
- smooth rounded 3D geometry, soft bevelled edges
- nur explizit notwendige kurze deutsche Objektlabels, normalerweise 1–3 Wörter
- keine große Headline, kein Untertitel, kein erklärender Satz
- relevante bekannte Marken erlaubt, wenn sie wirklich zur Aussage gehören und keine Partnerschaft suggeriert wird

KRITISCHER HINTERGRUND:
Use ONE single seamless continuous deep charcoal green-black background from top edge to bottom edge.
No horizontal bands.
No top/bottom sections.
No percentage zones.
No floor-wall boundary.
No horizon line.
No panels.
Leave natural empty space above/below only by reducing objects, never by changing the background.

Nicht verwenden:
- Diorama
- Game-Level
- Neon-Tunnel
- Sci-Fi-Korridor
- Dashboard/App-UI
- Fotorealismus
- gesichtslose Figur

Direkt am Prompt den endgültigen Dateinamen angeben.
Bildnummer = echte Szenennummer; Animationsnummern bleiben reserviert.
```

## 4. Google-Flow-Sammelprompt erstellen

```text
Erstelle `03-szenen/alle-bildprompts.txt` in chronologischer Szenenreihenfolge.

Für jedes benötigte Bild:
1. Prompt lesen
2. GENAU EIN Bild erzeugen
3. sofort endgültig umbenennen
4. Motiv + Labels + Gesicht + nahtlosen Hintergrund + Dateiname prüfen
5. erst dann nächstes Bild

Cover = Bild 00.
Jede Bildszene nutzt ihre echte Szenennummer.
Animationsszenen bekommen kein Bild; ihre Nummer bleibt reserviert.
Erst nach Abschluss alle Bilder gemeinsam nach `03-szenen/00-ALLE-BILDER-HIER-REIN/`.
```

## 5. Bild-QA

```text
Prüfe jedes Nutzerbild nach den aktuellen FinanzNeo-Regeln.

Sofort NEU ERSTELLEN melden bei:
- zwei sichtbaren Hintergründen/Bändern
- horizontaler Trennkante
- Floor-Wall-Grenze/Horizont
- gesichtsloser/abgewandter Person
- falschen oder zusätzlichen Labels
- großer Headline/Untertitel/erklärendem Satz
- Diorama/Game-Level/Tunnel-Look
- falscher Zuordnung zum gesprochenen Satz

Antigravity darf das Bild nicht selbst neu generieren.
```

## 6. Voiceover, Timing und Remotion

```text
Nutze ausschließlich das finale Voiceover.
Erzeuge echte Wort-Timings daraus.
Szenenschnitte beginnen an den echten Satzanfängen.

Baue 1080×1920 bei 30 fps.
Bilder mit contain.
Keine unscharfe Bildkopie als Hintergrund.
Überschriften/Icons in Remotion.
Genau ein vollständiger Untertitelsatz sichtbar.
Aktuelles Wort grün, Rest weiß.
Maximal zwei Zeilen.
Maximal 12 Wörter und 68 Zeichen pro Satz; längere Sätze im Skript kürzen.
Untertitel direkt unter dem Visual und ausschließlich nach `src/brand/reel-contract.json` positionieren.
Keine Sprung-, Größen- oder Scale-Animation der Untertitel.
Jede erklärende Animation zeigt Startzustand → sichtbare Handlung/Mechanismus → Endzustand.
Animationen relativ zur tatsächlichen Szenendauer.
```

## 7. Finale technische QA

```text
Wenn Nutzerbilder und finales Audio vorhanden sind:
- Asset-Sync/Ingest
- Reel-Validator
- Typecheck
- Preview-Render
- Kontaktbogen / erste-mittlere-letzte Frames
- komplette MP4 mit Ton
- Audio-Lautheit am finalen Export
- finales Video direkt unter `06-export/reel.mp4`
- finales Remotion-Cover direkt unter `06-export/cover.png`
- `npm run reel:final -- <Reel-Pfad>` erfolgreich

Keine Prüfung als bestanden behaupten, wenn sie nicht tatsächlich ausgeführt wurde.
```

## 8. Reel-Plattform-Publishing

```text
Erstelle aus der geprüften Master-Caption alle Reel-Veröffentlichungsdateien in `04-caption/`.

Pflichtdateien:
- instagram-reels.txt
- tiktok.txt
- facebook-reels.txt
- snapchat.txt

Instagram Reels:
CAPTION / CTA / QUELLEN-HINWEIS / HASHTAGS / optional ANGEHEFTETER KOMMENTAR

TikTok:
CAPTION / CTA / QUELLEN-HINWEIS / HASHTAGS

Facebook Reels:
REEL-TEXT / CTA / QUELLEN-HINWEIS / HASHTAGS

Snapchat:
CAPTION / optional CTA / Hinweis nur wenn nötig

Keine `youtube-shorts.txt` erstellen. Keine YouTube Shorts vorbereiten oder veröffentlichen.
YouTube ist ausschließlich für eigenständige längere Videos unter `youtube/` und besitzt einen separaten Workflow.

Alle Plattformtexte müssen dieselben geprüften Fakten verwenden. Keine neuen Behauptungen erfinden. Exakte aktuelle Plattform-Limits nur nach Prüfung offizieller Plattformquellen verwenden.
```

## 9. Phase 1 — YouTube-Longform vollständig vorbereiten

```text
Neues eigenständiges FinanzNeo-YouTube-Longform-Video.

Thema: [THEMA]

Arbeite nach CLAUDE.md, docs/YOUTUBE-LONGFORM-WORKFLOW.md und youtube/PRODUKTIONSSTANDARD.md.

Erstelle ohne offene Platzhalter:
1. Briefing, Zielgruppe, Lernziel, Kernversprechen und Begründung für Longform
2. geprüfte Recherche mit Quellen, Datenstand, Annahmen und Rechenwegen
3. Hook, Kapitel-Dramaturgie und Retention-Plan
4. vollständiges deutsches Voiceover-Skript ohne Füllpassagen
5. Visual-Plan mit begründeter Bild-/Remotion-Zuordnung
6. vollständige englische Google-Flow-Prompts mit exakten Dateinamen
7. englischen Thumbnail-Prompt und vollständigen Thumbnail-Brief
8. fünf Titelvarianten und einen finalen Titel
9. Beschreibung, Kapitel, Keywords/Tags, Hashtags, Quellen/Disclaimer
10. angehefteten Kommentar, Community-Post und Upload-Checkliste
11. Promo-Texte für Instagram, TikTok, Facebook und Snapchat

YouTube-Quellbilder und Thumbnail sind horizontal 16:9. Reel-Bilder bleiben separat 1:1.
Der Nutzer erzeugt alle Bilder. Antigravity erzeugt weder Bilder noch Ersatz-Voiceover.
Google Flow arbeitet strikt: genau ein Bild → vollständig warten → sofort exakt umbenennen → prüfen → erst dann das nächste Bild. Thumbnail zuerst und danach nur als Stilreferenz verwenden.
Keine YouTube Shorts und keine gestreckte Reel-Kopie erzeugen.
```

## 10. Phase 3 — YouTube-Longform autonom bauen

```text
Mach das YouTube-Video: youtube/<Projekt>

Prüfe zuerst vollständig mit `npm run youtube:ready -- youtube/<Projekt>`.
Wenn die Prüfung erfolgreich ist, beginne sofort und arbeite ohne Rückfragen oder Zwischenstopps bis zur technischen und visuellen QA des fertigen 1920×1080-Renders.
Leite Timeline, Kapitel, Visualwechsel und Untertitel aus dem finalen Voiceover und dem fertigen Plan ab.
Triff normale Detailentscheidungen selbst nach CLAUDE.md.
Stoppe nur bei echten Pflichtasset-, Fakten-, Sicherheits-, Validator-, Build- oder Renderblockern und melde alle gesammelt mit exakten Pfaden.
```
