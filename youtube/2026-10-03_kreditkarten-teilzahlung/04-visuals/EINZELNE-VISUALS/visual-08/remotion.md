# Remotion-Spezifikation visual-08

MOTION_STANDARD: finanzneo-youtube-motion-v3

- Kapitel: Abschluss
- Sprechtext-Bezug: Offener Saldo über Monate bedeutet: Du nutzt zusätzlich einen Kredit.
- Viewer Change: Auf dem von Google Flow erzeugten Einstellungsbild wandert die Auswahl sichtbar von Teilzahlung zu Vollzahlung 100 %; danach erscheint ein grüner Bestätigungszustand.
- Animation Intent: Der Schluss endet mit einer konkreten prüfbaren Handlung statt nur mit einer Warnung. Das statische Flow-Bild liefert die ruhige lesbare Basis, Remotion übernimmt nur die Zustandsänderung.
- Mechanik: payment-setting-switch
- Technikbeschreibung: Image-Composite. Auf dem frontalen Flow-Basisbild verschiebt sich ein farbcodierter Auswahlrahmen von Teilzahlung zu Vollzahlung 100 %; danach erscheint die Bestätigung.
- Tool Stack: React, CSS, Remotion interpolate, Flow source image
- Composition Family: image-composite
- Motion Signature Camera: statische Frontansicht auf dem Nutzerbild
- Motion Signature Layout: Flow-Basisbild vollflächig, Fokus-Overlay auf den beiden Abrechnungsoptionen
- Motion Signature Transformation: Fokus verschiebt sich von Teilzahlung zu Vollzahlung und bestätigt den Endzustand
- Startzustand: Teilzahlung ist im Flow-Bild markiert
- sichtbare Mechanik/Transformation: Auswahlrahmen bewegt sich zur zweiten Zeile und wechselt semantisch von Rot-Orange zu Emerald
- Resultat: Vollzahlung 100 % ist sichtbar ausgewählt und bestätigt
- Motion Channels: Position des Auswahlrahmens; Farbwechsel; Bestätigungs-Opacity
- SFX-Cues: optional dezenter Auswahlklick und Bestätigungs-Tick

Wichtig: Das Flow-Bild bleibt unverändert die Bildbasis. Remotion darf keine neue UI-Welt erfinden und ersetzt die im Flow-Bild vorhandene Typografie nicht.
