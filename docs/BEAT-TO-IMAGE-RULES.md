# FinanzNeo — Beat-zu-Visual-Regeln V9

Bei Widerspruch gilt `CLAUDE.md`.

## 1. Grundentscheidung

Für jeden gesprochenen Beat genau den Visualtyp wählen, der die Aussage am schnellsten verständlich macht.

### A. Google-Flow-Bild

Für Zustände, konkrete Gegenstände, Situationen und sofort lesbare Beispiele.

Beispiele:

- Karte / Terminal / Rechnung
- Risiko oder Schutz als klares Objektmotiv
- Konsum-/Alltagssituation
- räumlicher Vorher-/Nachher-Zustand

Bildwelt immer nach `docs/IMAGE-SYSTEM.md` und V9.

### B. Native Remotion-Animation

Für echte Veränderung oder Mechanik:

- Umrechnung
- Kosten entstehen
- Geld bewegt sich
- Vorher → Nachher
- Rechnung entwickelt sich
- zwei Wege führen zu unterschiedlichen Ergebnissen

Phase 1 liefert dafür bereits die produktionsreife `animation.tsx`. Phase 3 integriert sie nur.

### C. Präzisions-Overlay

Ein Bild darf in Remotion um **wenige** präzise Elemente ergänzt werden, z. B. eine notwendige Zahl, kurze Markierung oder Quelle. Das Overlay darf das eigentliche Bild nicht durch ein Dashboard ersetzen.

## 2. Entscheidungsfragen

1. Ist die Aussage ein Zustand oder konkretes Beispiel? → Bild.
2. Muss sich etwas sichtbar verändern? → Animation.
3. Ist nur eine geprüfte Zahl zusätzlich nötig? → Bild + kleines Overlay.
4. Wäre ein weiteres Objekt nur Dekoration? → weglassen.
5. Würde die Szene wie UI/Flowchart wirken? → neu vereinfachen.

## 3. Zielverteilung

```text
ungefähr 60 % Bildbeats
ungefähr 40 % native Animationen
```

Keine starre Quote. Qualität und Timing gewinnen.

## 4. V9-Bildregel

Jedes Flow-Bild:

- quadratisch `1:1`
- `finanzneo-stylized-3d-animated-black-v9`
- nahtloser tiefschwarzer Hintergrund
- klar stylized 3D animated
- eine klare Hauptaussage/Hauptaktion
- **keine feste Objektanzahl**
- zusätzliche Objekte nur, wenn sie helfen
- kurze deutsche Labels nur wenn nötig
- keine UI-/Dashboard-/Flowchart-/Diorama-Komposition

## 5. Animationsregel

Jede Animation:

```text
START → SICHTBARER MECHANISMUS → ERGEBNIS
```

- `PremiumPhysicalStage` transparent
- zentraler Reel-Hintergrund statisch `#000000`
- mindestens ein echtes sichtbares Hauptmotiv
- keine feste Support-Objekt-Anzahl
- keine Partikel/Aurora/Grid/Glow-Flächen als Hintergrund
- kein Background-Motion-Hack
- ohne Ton grundsätzlich verständlich

## 6. Timing

- Bildbeat ideal 3,5–5,5 s
- Bildbeat absolut max. 6 s
- Animationsbeat ideal 4,5–7 s
- Schnitte folgen finalem Audio und sinnvollen Satz-/Phrasenanfängen

## 7. Ausgabeformat pro Beat

```text
Beat [Nummer]
Sprechtext: „...“
Hauptaussage: ...
Visualtyp: [Bild / Animation / Bild + kleines Overlay]
Begründung: ...
Hauptmotiv/Hauptmechanismus: ...
Erlaubte Labels: ...
Benötigte Daten: ...
```

## 8. Ablehnen und neu planen bei

- Visual nur dekorativ
- mehrere konkurrierende Hauptaussagen
- unnötiger Objektfülle
- UI-/Dashboard-/Flowchart-Sprache
- nicht tiefschwarzem Flow-Hintergrund
- Animation ohne echte Ursache-Wirkung
- Bildbeat über 6 Sekunden
- Background-Motion statt Szenenanimation
