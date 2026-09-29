# Fees 30 Years — Phase-1 Custom Reel V1

Composition: `ReelsTestFees30YearsCustomV1`
Duration: 60 seconds / 1800 frames / 30 fps / 9:16

## Production intent

This is the first reel calibration where every animation is designed individually for its exact spoken point during Phase 1.

No scene imports a ready-made Finance Motion Library component. The library may remain available as a reference/toolbox, but the visible mechanism in this test reel is scene-specific custom Remotion code.

## Script

### Scene 01 — 0–10 s
**Header:** 1 % klingt fast nach nichts

Voice/Caption: Ein Prozent Gebühren wirkt klein. Aber es greift nicht nur einmal an.

Custom mechanism: a small fee chip repeatedly breaks real pieces out of the same capital body.

### Scene 02 — 10–20 s
**Header:** Der Abstand wächst langsam

Voice/Caption: Beide starten gleich. Nur ein Weg verliert jedes Jahr ein kleines Stück an Kosten.

Custom mechanism: two equal capital towers start together; only the fee path is repeatedly shaved and visibly falls behind.

### Scene 03 — 20–30 s
**Header:** Gebühren nehmen auch künftige Rendite

Voice/Caption: Das Problem ist nicht nur die Gebühr selbst: Das fehlende Geld kann später keine Rendite mehr erzeugen.

Custom mechanism: generated returns flow back into the capital engine while a fee siphon diverts part before compounding.

### Scene 04 — 30–40 s
**Header:** Der kleine Unterschied wird groß

Voice/Caption: Je länger du investierst, desto stärker arbeitet der Zinseszins auch gegen unnötige Kosten.

Custom mechanism: two trajectories separate over time and the physical distance between them becomes the explanatory object.

### Scene 05 — 40–50 s
**Header:** Nach 30 Jahren: rund 77.000 € Unterschied

Voice/Caption: Beispiel: 10.000 € Start, 300 € monatlich, 7 % statt 6 % Rendite nach Kosten.

Custom mechanism: two final capital vaults build to their true relative heights; numbers appear only after the build.

Reference calculation using monthly equivalent rates from annual effective returns:
- 7 % annual: approximately 426,958 €
- 6 % annual: approximately 349,789 €
- difference: approximately 77,170 €

This is an illustrative calculation, not a prediction.

### Scene 06 — 50–60 s
**Header:** 1 % ist klein. 30 Jahre sind es nicht.

Voice/Caption: Darum lohnt es sich, laufende Kosten zu prüfen – bevor sie jahrelang mitwachsen.

Custom mechanism: fee fragments from the story aggregate into one final lost-value pile; the ~77,000 € payoff appears only after aggregation.

## Visual rules

- pure black canvas
- central visual zone stays inside the vertical reel composition
- stylized 3D-ish materials and depth
- no dashboard/app UI as main explanation
- labels only support the mechanism
- payoff is not revealed before the explanatory action
- deterministic Remotion animation
- no direct reuse of a Finance Motion Library composition
