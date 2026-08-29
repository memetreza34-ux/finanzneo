# Animationen — Phase 1

Lock: finanzneo-phase1-animation-code-v1  
Premium-Lock: finanzneo-premium-physical-animation-v2  
Visuelles Ziel: finanzneo-stylized-3d-animated-black-v9

Jede Animationsszene besitzt ihre kanonische `animation.tsx`. Phase 3 darf sie nicht ersetzen oder vereinfachen. `PremiumPhysicalStage` bleibt transparent; der zentrale Reel-Canvas ist statisch `#000000`. Sichtbare Animation bleibt hart in Y320–1400.

## Neuer Qualitätsstandard

Animationen sind kleine visuelle Geschichten in derselben realitätsnahen stylized-3D-Welt wie die Flow-Bilder:

- reale Gegenstände und Situationen zuerst;
- START → sichtbare physische Aktion → eindeutiges Ergebnis;
- jede Animationsszene braucht eine eigene Mechanik (`MECHANIC_ID`);
- mehrere koordinierte Motion-Channels statt einer einzigen Progress-Variable;
- deutsche Labels nur unterstützend;
- generische Kartenreihen dürfen niemals die Hauptsprache sein;
- Fortschritts-/Ladebalken dürfen niemals die eigentliche Animation ersetzen;
- Ergebnis bleibt mindestens 15 Frames stabil.

## Dieses Reel

- **scene-02 — Dafür ist der Notgroschen da**  
  `emergency-reserve-pays-real-bill` — kaputte Waschmaschine → Reparaturrechnung → Notgroschen bezahlt → Girokonto geschützt.

- **scene-04 — Der Puffer stoppt Schulden**  
  `buffer-intercepts-before-overdraft` — Rechnung nähert sich Girokonto/Dispo → Notgroschen fängt sie physisch ab → Dispo verschwindet.

- **scene-06 — Die richtige Höhe ist individuell**  
  `obligations-raise-reserve-target` — Miete/Fixkosten/Mobilität erscheinen nacheinander → sichtbares Reserve-Ziel wächst mit den Verpflichtungen.

- **scene-09 — Starte mit einem ersten Puffer**  
  `monthly-deposits-fill-reserve` — Kalender wechselt Monat für Monat → 50-€-Einzahlungen wandern in die Reserve → erster Puffer wird erreicht.

- **scene-11 — Trenne Puffer und Alltag**  
  `salary-splits-into-separate-reserve` — Geld trennt sich vom Girokonto zum Tagesgeld → Alltagsausgaben belasten nur Giro → Reserve bleibt separat.

- **scene-14 — Der Puffer kauft dir Zeit**  
  `reserve-stops-countdown-and-opens-options` — kaputte Waschmaschine + Rechnung + Countdown → Notgroschen bezahlt → Countdown stoppt → Entscheidungsoptionen öffnen sich.

Kanonische Dateien liegen jeweils unter `03-szenen/EINZELNE-SZENEN/scene-XX/animation.tsx`.

## Phase-3-Priorität

Für die tatsächliche Animation ist **immer die aktuelle kanonische `animation.tsx` die technische Wahrheit**. Ältere Kurzbeschreibungen, `mainIdea`-Texte oder historische `animationIntent`-Formulierungen dürfen den versiegelten Code weder überschreiben noch zurück in eine abstrakte Karten-/Symbolanimation interpretieren. Phase 3 bindet exakt den Export aus der versiegelten Datei ein.

## CINEMATIC REAL-WORLD ANIMATIONSVERTRAG
Premium Visual Lock: finanzneo-premium-physical-animation-v2
Visual Target World: finanzneo-stylized-3d-animated-black-v9

Pflicht:
- dieselbe realitätsnahe stylized-3D-Welt wie die Flow-Bilder; klar nicht fotorealistisch
- echte Alltagssituation bzw. konkrete Finanzhandlung zuerst, abstrakte Symbole nur unterstützend
- STARTZUSTAND → konkrete physische Hauptaktion → sichtbare Ursache/Wirkung → eindeutiges Ergebnis
- mindestens zwei konkrete Realwelt-Objekte/-Instanzen in der visuellen Handlung
- eindeutige MECHANIC_ID je Animationsszene; keine Mechanik im selben Reel doppelt verwenden
- PRIMARY_ACTION benennt die tatsächliche physische Zustandsänderung
- mehrere koordinierte Motion-Channels statt einer einzigen globalen Progress-Variable
- kurze deutsche Labels dürfen helfen, tragen aber niemals allein die Erklärung
- sichtbare Materialität, Dicke, Tiefe und Kontakt-Schatten
- PremiumPhysicalStage bleibt transparent; der zentrale Reel-Canvas darunter ist statisch #000000
- Ergebnis mindestens 15 Frames stabil halten

Bevorzugte konkrete Primitives, wenn passend:
- PhysicalBill
- PhysicalAccount
- PhysicalWasher
- PhysicalReserveTank
- PhysicalCalendarPage
- PhysicalCoinStack

Streng verboten als Hauptsprache:
- drei oder mehr generische beschriftete Kästen/Karten, die nur A → B → C darstellen
- Lade-/Fortschrittsbalken als Ersatz für die eigentliche Handlung
- Dashboard-/Control-Panel-/App-UI-Look
- Flowchart als Hauptkomposition
- kleine Boxen mit dünnen Verbindungslinien
- reine Texttafel mit Fade/Scale
- abstrakte Schild-/Pfeil-/Münz-Metapher, wenn eine reale Situation darstellbar ist
- Partikel/Aurora/Grid/Glow/Gradient als Animationshintergrund
- dekorative Bewegung ohne erklärenden Mechanismus

## IN-PLACE REBUILD 2026-08-29

Das bestehende Reel wurde am selben Pfad neu aufgebaut. Alle sechs kanonischen animation.tsx wurden überschrieben; es existiert kein zweites Reel. Scene-index, Remotion-Spezifikationen und Phase-3-Auftrag verweisen auf diese neuen Dateien.
