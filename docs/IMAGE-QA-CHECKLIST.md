# FinanzNeo — Bild- und Render-QA

> Bei Widerspruch gilt `CLAUDE.md`.

## Einzelbild

- [ ] Bild erklärt exakt den gesprochenen Satz.
- [ ] Eine dominante Finanzmetapher / Hero-Objekt.
- [ ] Premium Fintech Editorial 3D.
- [ ] Deep charcoal green-black + Emerald/Mint.
- [ ] Gold nur für Geld/Wert; Rot-Orange für Risiko/Verlust/Schulden.
- [ ] Genau EIN nahtloser Hintergrund von oben bis unten.
- [ ] Keine horizontalen Bänder, Panels, Floor-Wall-Grenze oder Horizont.
- [ ] Wenn Person: Gesicht klar sichtbar, frontal/3⁄4, Augen/Nase/Mund erkennbar.
- [ ] Nur erlaubte kurze deutsche Objektlabels.
- [ ] Keine KI-Headline, kein KI-Untertitel, kein erklärender Satz.
- [ ] Keine Dioramen, Game-Level, Neon-Tunnel, Sci-Fi-Korridore oder Dashboards.

## Remotion-Framing — Pflicht

- [ ] `adaptive-safe-fill`, nicht `contain`.
- [ ] Bild nutzt die verfügbare Fläche zwischen Headline und Caption maximal.
- [ ] Kein kleines Hochkant-Poster innerhalb des Hochkant-Reels.
- [ ] Kein sichtbarer rechteckiger Bildrand.
- [ ] Keine unscharfe Bildkopie als Hintergrund.
- [ ] Leerer nahtloser Hintergrund wird vor wichtigem Inhalt gecroppt.
- [ ] Gesicht bleibt vollständig lesbar.
- [ ] Objektlabels bleiben lesbar.
- [ ] Hero-Objekt bleibt verständlich.
- [ ] Geld/Wert wird nicht abgeschnitten.
- [ ] `focalX`/`focalY` pro Szene angepasst, falls nötig.
- [ ] Keine alte 1.04-Scale-Grenze oder 0.20/0.34-Crop-Regel verwendet.

## Layout / Plattform-Safe-Area

Richtwerte 1080×1920:

- [ ] Headline ungefähr ab Y 70.
- [ ] Visual beginnt ungefähr Y 210 oder früher, wenn sicher.
- [ ] Visual reicht ungefähr bis Y 1515.
- [ ] Caption ungefähr 280 px über Bottom.
- [ ] unten mindestens ca. 260 px Plattform-UI-Sicherheitszone.
- [ ] rechts ungefähr 180 px Abstand für Plattform-Buttons.
- [ ] keine unnötig großen leeren Bereiche zwischen Headline, Visual und Caption.

## Untertitel / Synchronität

- [ ] Wortzeiten stammen aus dem exakten finalen Voiceover.
- [ ] Keine gleichmäßig geschätzte Wortverteilung.
- [ ] Bevorzugt genau ein vollständiger Satz gleichzeitig.
- [ ] Maximal zwei sehr kurze Sätze nur wenn nötig.
- [ ] Hart maximal zwei sichtbare Zeilen.
- [ ] Aktives Wort exakt während seiner echten `start/end`-Zeit grün.
- [ ] Rest weiß.
- [ ] Satzwechsel beim ersten gesprochenen Wort des nächsten Satzes.
- [ ] Kurze Sprachpause hält den bisherigen Satz sichtbar.
- [ ] Keine Caption-Lücken oder Wort-Sprünge.

## Gesamtreel

1. Alle Nutzerbilder als Kontaktbogen prüfen.
2. Für jede Bildszene Anfang/Mitte/Ende prüfen.
3. Bild- und Animationsszenen auf vergleichbare visuelle Präsenz prüfen.
4. Caption-Safe-Area auf Plattform-UI prüfen.
5. Karaoke-Sync stichprobenartig und an schnellen/langsamen Wörtern prüfen.
6. Vollständige MP4 mit Ton ansehen.
7. Wenn ein Fehler technisch behebbar ist: fixen, neu rendern, erneut prüfen.

## Sofortige Ablehnung

Nutzerbild neu erzeugen bei:

- zwei sichtbaren Hintergründen/Bändern
- Floor-Wall-Grenze/Horizont
- gesichtsloser/abgewandter Person
- falschen Labels
- großer KI-Headline/Satz
- falscher Bildaussage

Remotion-Framing reparieren bei:

- kleinem Poster/Inlay
- sichtbarem Bildrand
- unnötig großer Leerfläche
- abgeschnittenem Gesicht/Label/Hero-Objekt/Geld
- Caption in Plattform-UI

## Protokoll

```text
Bildwelt: [BESTANDEN / NICHT BESTANDEN]
Adaptive Safe Fill: [BESTANDEN / NICHT BESTANDEN]
Headline/Visual-Flächennutzung: [BESTANDEN / NICHT BESTANDEN]
Caption Safe Area: [BESTANDEN / NICHT BESTANDEN]
Wort-Sync: [BESTANDEN / NICHT BESTANDEN]
Max. 2 Zeilen: [BESTANDEN / NICHT BESTANDEN]
Full-MP4-QA: [BESTANDEN / NICHT BESTANDEN]
```
