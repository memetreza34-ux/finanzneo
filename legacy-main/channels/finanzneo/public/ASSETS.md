# Assets — FinanzNeo

Lizenz-Log pro Datei. Große Dateien (`*.mp3/*.mov/*.wav`) bleiben lokal (gitignored) — nur diese Tabelle + Nutzung im Code kommen ins Repo.

## sfx/ — Kern-SFX-Set (kanalweit, kategorie-basiert)

| Datei | Quelle | Lizenz | Datum | YouTube-Monetarisierung erlaubt? |
|---|---|---|---|---|
| whoosh-1.mp3 | Mixkit (assets.mixkit.co/active_storage/sfx/1485) | Mixkit License (frei, kommerziell) | 2026-07-10 | ja |
| whoosh-2.mp3 | Mixkit (sfx/1489) | Mixkit License | 2026-07-10 | ja |
| impact-1.mp3 | Mixkit (sfx/1143) | Mixkit License | 2026-07-10 | ja |
| impact-2.mp3 | Mixkit (sfx/1687) | Mixkit License | 2026-07-10 | ja |
| pop-1.mp3 | Mixkit (sfx/2354) | Mixkit License | 2026-07-10 | ja |
| pop-2.mp3 | Mixkit (sfx/2357) | Mixkit License | 2026-07-10 | ja |
| click-1.mp3 | Mixkit (sfx/1109) | Mixkit License | 2026-07-10 | ja |
| click-2.mp3 | Mixkit (sfx/1111) | Mixkit License | 2026-07-10 | ja |
| chime-1.mp3 | Mixkit (sfx/109) | Mixkit License | 2026-07-10 | ja |
| chime-2.mp3 | Mixkit (sfx/2841, Kategorie "money") | Mixkit License | 2026-07-10 | ja |
| riser-1.mp3 | Mixkit (sfx/1088) | Mixkit License | 2026-07-10 | ja |
| riser-2.mp3 | Mixkit (sfx/1093) | Mixkit License | 2026-07-10 | ja |
| coin-1.mp3 | Mixkit (sfx/866) | Mixkit License | 2026-07-10 | ja |
| coin-2.mp3 | Mixkit (sfx/253) | Mixkit License | 2026-07-10 | ja |

**Mixkit License** (mixkit.co/license/#sfxLicense): kostenlos, keine Attribution nötig, kommerzielle Nutzung inkl. YouTube-Monetarisierung erlaubt. Kein Weiterverkauf als eigenständiges Sound-Pack.

**Zuordnung zu Bausteinen:** `channels/finanzneo/bausteine/sfx-map.ts` (Baustein → Kategorie + Timing-Offset). Nutzung via `<Sfx>` aus `@studio/core`, siehe `core/gehirn/SOUND.md`.

**Kein Musik-Bett** — kurz probeweise für Diversifikation eingebaut (2026-07-20), auf Armans
Wunsch noch am selben Tag wieder entfernt: nur SFX, keine Musik. Bleibt die Konvention für alle
Reels, bis explizit anders gewünscht.

## B-Roll (Reserve, aktuell NICHT genutzt)

Bewusste Entscheidung: FinanzNeo baut Szenen aus animierten Bausteinen (Icons/Charts/3D-Puck),
keine echten Foto/Video-Aufnahmen — siehe Diversifikation-Reel-Umbau (echte KI-Fotos raus, 3D rein).
Falls doch mal ein Beat mit echtem Video-B-Roll gebraucht wird (z. B. Menschenmengen, Städte,
Büro-Atmosphäre — Dinge, die kein Icon gut trifft), hier kostenlose, kommerziell nutzbare Quellen:

| Quelle | Lizenz | Hinweis |
|---|---|---|
| pixabay.com/videos | Pixabay License, frei, keine Attribution | größte Auswahl |
| pexels.com/videos | Pexels License, frei, keine Attribution | gute Qualität, kuratiert |
| coverr.co | Frei, keine Attribution | kleinere, handverlesene Sammlung |
| videezy.com | Teils Attribution nötig (pro Clip prüfen) | viel Auswahl, Lizenz variiert |

Einbindung wäre `<OffthreadVideo>` aus Remotion, nicht `<Video>` (sauberer bei Frame-genauem Seek).
Nur nutzen, wenn ein Beat es wirklich braucht — nicht standardmäßig einbauen (Governance wie bei
Bausteinen: erst prüfen, ob's mit einem vorhandenen Icon/Baustein auch geht).

## Licht-Leaks / Overlay-Effekte

Kein externer Download nötig — `@remotion/light-leaks` ist bereits als Paket installiert
(`node_modules/@remotion/light-leaks`), aber noch nicht in `@studio/core` exportiert/genutzt.
Synthetisch, deterministisch (`seed`-Prop), kein Lizenz-Thema. Motion-Bro/RocketStock-artige
AE-Overlay-Packs sind NICHT direkt nutzbar (After-Effects-Plugin-Format, kein Remotion-Import) —
nur falls dort echte MP4/MOV-Dateien (nicht `.mogrt`/`.ffx`) zum Download stehen, ließen die sich
per `<OffthreadVideo>` + CSS `mixBlendMode: 'screen'` einbinden. Für uns aktuell nicht nötig,
`@remotion/light-leaks` deckt den Look nativ ab.
