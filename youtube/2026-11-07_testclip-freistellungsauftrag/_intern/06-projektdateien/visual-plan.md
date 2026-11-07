# Visual-Plan — Viewer Change First

1. Skript in gesprochene Gedanken zerlegen.
2. Jedem Gedanken einen sichtbaren Visual Beat geben.
3. Für jeden Motion-Beat zuerst in einem Satz festlegen: Was soll der Zuschauer tatsächlich sehen, das sich verändert, enthüllt, vergleicht oder räumlich erschließt?
4. Erst danach den besten Typ und die beste konkrete Technik wählen.
5. Technik darf frei erfunden oder kombiniert werden; Familien sind nur Beschreibungen, keine Whitelist.
6. Vor Freigabe die letzten vier Motion-Visuals auf echte Wiederholung von Kamera, Layout und Transformation prüfen.
7. Kein Standbild länger als ca. 8 s ohne neue Information: sonst zusätzliches Bild oder akzente[] ({cue, text, ton}) setzen. youtube:validate schätzt das aus dem Skript.
8. Die Endkarte (15 s für YouTube-Endelemente) hängt der Zusammenbau automatisch an.
9. Belege (Qualitätsregel V3): Zahlen, Gesetze, Fristen und Aussagen Dritter als echten Quellen-Screenshot zeigen — type 'beleg' mit quelle, quellenArt, url und markierungen[{text, cue}] (exakter Wortlaut der Seite). Einer je 90 s Sprechzeit, mindestens 3, der erste spätestens im ersten Kapitel nach dem Hook. Danach npm run youtube:belege. Regel: docs/YOUTUBE-BELEG-SZENEN.md
10. Bildwelt (V3): die meisten Beats als type 'folie' — weiße Folie mit 3D-Icon, Formen begriff / ablauf / vergleich / zahl / zeilen / metapher / wolke / zitat (Icons: npm run youtube:icons -- --liste; Metapher-Bilder individuell pro Video als Freehand-Doodle suchen: npm run youtube:doodles -- --suche "<englischer Begriff>"; Flow-Sticker mit motiv nur, wenn kein Doodle passt); Flow-Bilder nur für Hook, Gefühl, Alltagsszene (Ziel 10–15 %, max. 40 % der Sprechzeit); nichts steht länger als 6 s ohne neue Information.
11. Cover (V3): thumbnail.cover = {zeilen: max. 2, max. 5 Wörter, marker, ton?, kicker?}; Flow zeichnet nur das Motiv rechts ohne Text. Regel: docs/YOUTUBE-BILDMIX-UND-COVER.md

Keine feste Visualzahl. Keine feste Bild-/Animationsquote. Keine Standardanimation. Keine bestehende Komponente auswählen, bevor klar ist, was der Zuschauer sehen soll. Variation dient der Erklärung, nicht der Effekthascherei.
