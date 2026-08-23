# Technische Hinweise — Premium V3

- 1080 × 1920, 30 fps
- 15 Beats, 9 Bild / 6 Animation = exakt 60/40
- Bildbeat ideal 3,5–5,5 s; absolut max. 6 s
- Bild muss in unter 2 s verständlich sein
- Google Flow: strict 1:1, `contain` in Remotion, max. Scale 1.04
- Stylized 3D Lock: `finanzneo-stylized-3d-editorial-v5`
- keine Bildreferenz; vollständiger Text-Lock in jedem Prompt

## Layout
- jede Szene: `SceneHeader` + Icon
- Header Standard ungefähr Y=118
- Hauptvisual ungefähr Y=390–1560
- Hauptmechanismen zentral statt zu weit oben
- Untertitel ungefähr 285 px über dem unteren Rand
- Subtitle links ca. 72 px / rechts ca. 140 px

## Captions V3
- crisp, satz-/phrasenbasiert
- aktives Wort hellgrün, Rest weiß
- max. 2 Zeilen
- keine gelben Karaoke-Wörter
- kein schwarzer Text
- kein Glow-Blur, kein Word-Jump, kein Scale-Pop
- scharfer Stroke + kurzer Shadow + dunkle Premium-Backplate

## Animationen
- gemeinsame zentrale Bühne und dieselbe visuelle Sprache
- Start → Mechanismus → Ergebnis
- Ergebnis mindestens 0,5 s stabil
- Weiß neutral, Grün Fokus, Rot Warnung/Steuer, Gold Geld
- keine zufälligen Transition-Stile
- 4–6 Frame Premium-Continuity-Bewegung; kein Fade-to-black

## Timing
- finales Voiceover ist einzige Timing-Autorität
- Szenenstart am ersten relevanten Wort / Phrasenstart
- Zielabweichung max. ca. 0,15 s
- altes Visual darf nach neuem Audio-Trigger nicht weiterstehen
- neues Visual nicht deutlich vor seinem Trigger zeigen

## Final Render
- `scripts/render-validated.mjs`
- H.264
- CRF 14
- PNG-Zwischenframes
- AAC 320k
- yuv420p
- keine Preview-/Low-Bitrate-Einstellungen für Final Export

## Audio
- ungefähr -16 LUFS
- True Peak <= -1 dBTP
