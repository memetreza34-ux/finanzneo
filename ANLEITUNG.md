# FinanzNeo — Step-by-Step Prompts (zum Einfügen)

> So nutzt du dein System. Starte immer mit:
> `cd ~/claude-code-video-toolkit/finanzneo && claude`
> Dann kennt der Chat automatisch dein Gehirn (Marke, Bausteine, Regeln).
> Fülle bei jedem Prompt die **[ECKIGEN KLAMMERN]** aus und füge ihn ein.
> Nach jedem Schritt: Claude zeigt Plan/Ergebnis → du sagst JA → weiter.

---

## ⚡ AKTUELLE PFLICHT-REGELN (Stand Juni 2026 — gelten immer)
1. ⚖️ **Hook zuerst** (Retention!). **Haftungsausschluss ans ENDE** des Hauptvideos (~10s, nicht
   gesprochen): `<Disclaimer durationInSeconds={10}/>` aus `./brand` + immer in die Beschreibung.
   Shorts: kein Intro-Disclaimer, nur kleiner Text + Beschreibung.
2. 🚫 **Claude erstellt NIE Audio** (kein TTS/say). Stimme kommt immer von dir als Datei →
   `public/audio/<name>.mp3`. Claude macht nur Whisper-Wort-Timing + Sync.
3. 🎬 **Standard-Look = Clean-Bold** (`Signature.tsx`/`CleanReel.tsx`). **Kein 3D, kein Manim** (verworfen).
4. 📈 **Echte Daten** statt erfundener Zahlen: `node scripts/fetch-data.mjs` (Yahoo/CoinGecko/
   ExchangeRate, gratis) → `public/data/*.json` → in Charts. Immer Quelle + Datum zeigen.
5. ✨ **Motion-Blur** (`<CameraBlur>`) bei schnellen Bewegungen. **Spacing wahren — nie quetschen.**
6. 🔍 Claude kann **selbst recherchieren + Script schreiben** (Web + Daten) — kein fremdes Video nötig.
7. 🎰 **Geld-Zahlen-Reveals:** für große Beträge die neuen ROLLERS nutzen (`DigitSlots`,
   `DramaticNumber`, `SplitFlap` …) statt nur RollingNumber — mehr Spannung, mehr Abwechslung.

---

## 🎬 DER ABLAUF (Überblick)

```
1 Video finden + analysieren   → Claude (OpenMontage)
2 Script schreiben             → Claude
3 Bilder planen                → Claude  (du generierst sie dann in Flow/Nano Banana)
   ↳ Audio                     → DU (Google Vids, echte Stimme) → in szene-X/audio/
   ↳ Bilder                    → DU (Flow/Nano Banana)          → in szene-X/bilder/
4 Animationen bauen            → Claude (Remotion-Baukasten)  ← Hauptschritt
5 Zusammenfügen + Audio        → Claude → final/
6 Thumbnail + YouTube-Text     → Claude
7 Shorts                       → Claude → shorts/
```

---

## SCHRITT 1 — Video analysieren + Ordner anlegen
```
Neues FinanzNeo-Video. Referenz-Video: [YOUTUBE-LINK]
Thema: [THEMA]   Videoname: [VIDEONAME]

Lade das Video mit yt-dlp, extrahier alle 2s einen Frame, schau sie dir an.
Analysiere: Struktur (Szenen+Dauer), Hook, Pacing, Stil, Schwächen.
Nur STIL & STRUKTUR übernehmen — Inhalt wird komplett eigen (rechtlich!).
Lege dann ~/Videos/Finanz-Kanal/[VIDEONAME]/ an, mit szene-N-[name]/{audio,bilder}/ + final/ + shorts/.
Zeig mir die Analyse + Ordnerstruktur. Dann warte auf mich.
```

## SCHRITT 2 — Script schreiben
```
Schreib das komplette Script (~12 Min) basierend auf der Analyse.
Regeln (Gehirn): kurze Sätze, immer "du", konkrete Zahlen, jeder Satz visualisierbar,
keine Füllwörter, "..." für Pausen, Spannungsbogen Problem→Lösung→CTA.
Format: Szene für Szene, NUR Sprechtext. Zeig mir alle Szenen. Dann warte.
```

## SCHRITT 3 — Bilder planen
```
Plane pro Szene: braucht sie ein Bild? (Option A klein / B groß / keins)
Denk an die Regel: großes Bild NUR wenn die Stimme über genau dieses Bild redet,
sonst Motion-Graphics aus dem Baukasten. Bild-Stil: futuristisch, dunkel, grüner Glow, kein Text.
Gib mir die fertige Bilder-Liste mit Beschreibungen — die generiere ich in Flow/Nano Banana.
```
> ⏸️ **Jetzt machst DU:** Audio in Google Vids aufnehmen → in `szene-N/audio/` ·
> Bilder generieren → in `szene-N/bilder/`. Dann Schritt 4.

## SCHRITT 4 — Animationen bauen  (Hauptschritt)
```
Bau die Animationen mit dem FinanzNeo-Baukasten. Audio + Bilder liegen in den Ordnern.
Pro Szene: Audio mit Whisper wortgenau transkribieren → Beat-für-Beat-Plan zeigen →
mein JA abwarten → bauen → Stills SELBST prüfen → min. 9/10.
Nutze Szenen-Vorlagen + Bausteine, abwechslungsreiche Übergänge (nie 2× gleich),
Farben nach Bedeutung, Bilder nie als Deko-Tapete. Format: [16:9 fürs Hauptvideo].
Fang mit Szene 1 an: erst Plan, dann warte.
```

## SCHRITT 5 — Zusammenfügen + Audio
```
Füge alle Szenen in Reihenfolge zu EINEM Video zusammen, Original-Audio durchgehend,
smoothe Übergänge zwischen Szenen. Finale QA (Gehirn Schritt 4): synchron? nichts hängt?
Übergänge smooth? konsistent? Bewerte 1-10, unter 9 → fixen. Output: final/[VIDEONAME]-final.mp4
```

## SCHRITT 6 — Thumbnail + YouTube
```
Erstelle: (1) Thumbnail 1280×720 in Brand (fette Zahl + Hook + Wachstum),
(2) 5 Titel-Optionen + Empfehlung, (3) YouTube-Beschreibung mit Kapiteln + CTA,
(4) Tags (5 Haupt + 10 Neben + 5 Long-Tail, deutsch).
```

## SCHRITT 7 — Shorts
```
Finde die 3 stärksten Momente fürs virale Potenzial. Baue pro Short:
1080×1920, 60-75s, starker Hook in 2s.
Pro Short: short-N.mp4 + short-N-info.txt (Timestamp, Titel, Caption, 5 Hashtags, Warum-viral).
Output: shorts/
```

---

## 💡 Spar-Tipps
- **Modell:** Opus 4.8 · **High** für die meiste Arbeit. Max nur bei harten Problemen, Sonnet für Kleinkram.
- **Neuer großer Schritt = neuer Chat** (frischer Kontext-Speicher) — das Gehirn lädt eh automatisch.
- Bei „zu langweilig/billig/unpassend" → sag's sofort, Claude ändert vor dem Voll-Render.
