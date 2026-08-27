# Claude Code — Phase 3 Auftrag

Reel: `reels/2026-08-24_bis_2026-08-30/samstag/reel-01_ausland-euro-oder-landeswaehrung`

1. Starte mit `npm run reel:ready -- <Reel-Pfad>`.
2. Wenn Phase 2 unvollständig ist, exakt fehlende Dateien melden und stoppen.
3. Verwende ausschließlich die finalen Nutzerbilder aus `03-szenen/00-ALLE-BILDER-HIER-REIN/`.
4. Verwende genau eine finale Voiceover-Datei aus `02-audio/`.
5. Verwende die echten Wort-Timings aus `04-caption/word-timings.json`.
6. Für Szenen 02, 04, 06 und 08 ausschließlich die kanonische, versiegelte Phase-1-`animation.tsx` und den angegebenen Export verwenden.
7. Keine Ersatzanimation, kein eigener vereinfachter Motion-Code.
8. V5: Header Y154, Visual Y320–1480, Caption bottom340.
9. Erst Preflight, Candidate-Render und Post-Render-QA. Final-MP4 nur nach bestandenem QA-Gate.

## Animations-Dispatch — zwingend vor dem ersten Render

Die vier Animationsszenen dürfen NICHT als normale Explain-/CTA-Beats oder als Fallback behandelt werden.

Verbindliche Mapping-Keys:

```text
scene-02 -> Scene02Animation
scene-04 -> Scene04Animation
scene-06 -> Scene06Animation
scene-08 -> Scene08Animation
```

Für jeden dieser Beats gilt in der Produktions-Config:

```tsx
{
  id: 'scene-02',
  type: 'animation',
  animationId: 'scene-02',
  // headline, icon, durationInFrames ...
}
```

Und `ReelTemplate` MUSS beim Render das vollständige Mapping erhalten:

```tsx
<ReelTemplate
  config={config}
  customAnimations={{
    'scene-02': <Scene02Animation durationFrames={/* echte Szenendauer */} />,
    'scene-04': <Scene04Animation durationFrames={/* echte Szenendauer */} />,
    'scene-06': <Scene06Animation durationFrames={/* echte Szenendauer */} />,
    'scene-08': <Scene08Animation durationFrames={/* echte Szenendauer */} />,
  }}
/>
```

Die Komponenten werden direkt aus den kanonischen Phase-1-Dateien importiert:

```text
03-szenen/EINZELNE-SZENEN/scene-02/animation.tsx
03-szenen/EINZELNE-SZENEN/scene-04/animation.tsx
03-szenen/EINZELNE-SZENEN/scene-06/animation.tsx
03-szenen/EINZELNE-SZENEN/scene-08/animation.tsx
```

HARTES GATE:
- Vor dem ersten Render müssen Anzahl der `type: 'animation'`-Beats, Anzahl der `customAnimations`-Bindings und Anzahl der Animationsszenen im `scene-index.json` identisch sein.
- Kein fehlendes Binding darf durch CTA, Explain, Caption-only, roten Debugtext oder sonstigen Fallback ersetzt werden.
- Das zentrale `ReelTemplate` bricht bei fehlendem Binding absichtlich mit `MISSING ANIMATION BINDING` ab.
- Bei diesem Fehler zuerst die Zuordnung reparieren; niemals den Fehler durch einen visuellen Platzhalter umgehen.
