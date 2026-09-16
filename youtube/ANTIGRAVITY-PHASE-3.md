# Antigravity — Phase-3-Auftrag

Diesen Text als Prompt an Antigravity geben. Ein Platzhalter: `<PROJEKT>`.

---

Arbeite ausschließlich im Repository

```
https://github.com/memetreza34-ux/finanzneo.git
Branch: youtube/notgroschen-bildwelt-reelworld
```

**Lege keine eigene Kopie an und arbeite nicht aus einem Scratch-Ordner.** Wenn du bereits eine Kopie unter `~/.gemini/antigravity/scratch/finanzneo` hast, benutze sie nicht — sie ist veraltet und hat die alte Ordnerstruktur. Klone oder aktualisiere das echte Repository und arbeite dort.

Prüfe vor dem ersten Schritt:

```bash
git rev-parse --abbrev-ref HEAD      # muss youtube/notgroschen-bildwelt-reelworld sein
git pull --ff-only
ls youtube/<PROJEKT>                 # muss 01-script 02-bilder 03-export 04-projekt zeigen
```

Siehst du stattdessen `01-recherche`, `04-visuals` oder `07-export`, bist du in der alten Kopie. Abbrechen und melden.

## Auftrag

Mach Phase 3 für `youtube/<PROJEKT>`.

```bash
npm ci
npm run youtube:ready          -- youtube/<PROJEKT>
npm run youtube:phase3:stage   -- youtube/<PROJEKT>
npm run youtube:phase3:build   -- youtube/<PROJEKT>
npm run youtube:render         -- youtube/<PROJEKT>
```

`youtube:render` fährt Preflight, Render, Render-QA und Export in einem Lauf. Bricht ein Schritt ab, ist das das Ergebnis — nicht der Anlass, ihn zu umgehen.

## Was du nicht tust

- keine Bilder erzeugen; die kommen vom Nutzer aus Google Flow
- kein Ersatz-Voiceover erzeugen
- versiegelten Phase-1-Animationscode nicht kreativ ersetzen, vereinfachen oder neu schreiben
- keine Validator-, Seal- oder Gate-Prüfung abschwächen, damit ein Lauf grün wird
- kein Merge, kein Force-Push, kein Branch löschen
- nicht direkt auf `main` arbeiten

Findest du einen echten Fehler im Repo, melde ihn mit Pfad und Zeile, statt ihn zu umgehen.

## Wenn `youtube:ready` blockiert

Die Meldung nennt jede fehlende Sache namentlich. Zwei Sorten:

- **Phase-1-Blocker** gehören ChatGPT. Melden, nicht selbst füllen.
- **Phase-2-Blocker** gehören dem Nutzer: Bilder, Voiceover, Wortzeiten. Melden, nicht ersetzen.

Sammle alle Blocker und gib sie mit exakten Pfaden aus. Erfinde nichts, um weiterzukommen.

## Wenn es durchläuft

Das fertige Video und das Upload-Paket liegen in `youtube/<PROJEKT>/03-export/`. Melde:

- Pfad und Größe der MP4
- Länge und ob die Render-QA bestanden hat
- ob Thumbnail und Kapitel übernommen wurden
- alle Hinweise aus `timeline.notes`, falls welche kamen

Committe das Ergebnis auf dem genannten Branch. Nicht nach `main` mergen.

## Kontext, falls du mehr brauchst

```
youtube/PRODUKTIONSSTANDARD.md          Format, Layout V1, Phase 3
docs/YOUTUBE-LONGFORM-WORKFLOW.md       die drei Phasen
docs/YOUTUBE-MOTION-BAUKASTEN.md        Layout, Bausteine, Icons, Lottie
CLAUDE.md                               höchste Repo-Regel
```

Für Phase 3 reicht normalerweise `PRODUKTIONSSTANDARD.md`. Lies nicht das ganze Repo, bevor du anfängst.
