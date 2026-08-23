# FinanzNeo — Caption, Scene Header & Animation Clarity V2

Dieses Dokument ist verbindlich für neue Reel-Produktionen. Bei Widerspruch gilt `CLAUDE.md`.

## 1. Untertitel

Auf dunklen FinanzNeo-Reel-Hintergründen gilt fest:

- aktuelles gesprochenes Wort: **FinanzNeo-Grün** `#00D26A`
- restliche Wörter: **Weiß** `#FFFFFF`
- **kein Gelb/Gold als Karaoke-Active-Word**
- **kein schwarzer Untertiteltext**
- maximal zwei Zeilen
- satzbasierte Caption-Einheiten
- kein Word-Jump
- keine Größenanimation / kein Scale-Pop
- kurze Pausen halten die vorherige Caption sichtbar
- keine Caption-Lücken
- mobil lesbarer Shadow/Stroke oder subtiler dunkler Caption-Hintergrund erlaubt

Technische Standardkomponente: `src/brand/components/Captions.tsx`.

## 2. Zwischenüberschrift in jeder Szene

**Jede einzelne Reel-Szene benötigt oben eine Zwischenüberschrift mit Icon.**

Technische Standardkomponente:

```tsx
<SceneHeader title="KONTOAUSZUG PRÜFEN" icon="search" />
```

Regeln:

- Icon links, Headline rechts
- Standard-Iconfarbe: FinanzNeo-Grün
- Headline: Weiß
- gleiche Position und gleiche Grundgestaltung über den gesamten Reel
- Headline bleibt während der Szene sichtbar
- kurze, direkte Formulierung
- Icon muss zur Aussage passen
- Rot nur bei Problem/Warnung
- Gold nur bei Geld/Wert, nicht als allgemeine Textfarbe

## 3. Animationsfarben auf dunklem Hintergrund

Verbindliche Palette aus `ANIMATION_COLORS`:

- **Weiß** = neutrale Information
- **Grün** = Fokus, Lösung, positive Entwicklung, zentrale Erklärung
- **Rot** = Problem, Warnung, unnötige Kosten, Verlust
- **Gold** = Geldbetrag, Summe, finanzieller Wert
- **Schwarz** = auf dunklen Reel-Flächen verboten

`C.ink` darf nur für dunklen Text auf einer tatsächlich hellen Fläche benutzt werden.

## 4. Verständliche Remotion-Animationen

Jede Erkläranimation muss inhaltlich nach diesem Muster funktionieren:

```text
STARTZUSTAND
→ SICHTBARE VERÄNDERUNG / MECHANISMUS
→ EINDEUTIGES ERGEBNIS
```

Die Bewegung selbst muss die Aussage erklären. Reine Zooms, Fades, Zahlen-Popups oder dekorative Bewegung reichen nicht.

Für komplexere Mechanismen kann `MechanismCue` verwendet werden, z. B.:

```tsx
<MechanismCue label="START" value="49,95 € / MONAT" tone="neutral" />
<MechanismCue label="ERGEBNIS" value="599,40 € / JAHR" tone="money" />
```

## 5. Animation ohne Ton verständlich

Vor Freigabe jeder Animation prüfen:

1. Ist innerhalb von 2 Sekunden klar, worum es geht?
2. Ist der Startzustand sichtbar?
3. Ist die Veränderung sichtbar und logisch?
4. Ist das Ergebnis deutlich hervorgehoben?
5. Ist jede Text-/Zahlenfarbe auf dem Hintergrund gut lesbar?
6. Gibt es irgendeinen schwarzen Text auf dunklem Hintergrund? Falls ja: korrigieren.
7. Bleibt die Zwischenüberschrift mit Icon sichtbar?

## 6. Timing

- Bildbeats ideal: 3,5–5,5 Sekunden
- Bildbeat absolut maximal: 6 Sekunden
- Animationsbeats ideal: 4,5–7 Sekunden
- wenn ein Bild mehr als 6 Sekunden Erklärzeit braucht: splitten oder animieren

## 7. Mobil-QA

Kontaktbogen allein reicht nicht. Zusätzlich bei 100 % Reel-Größe prüfen:

- Untertitel lesbar
- Active-Word wirklich grün
- Headlines deutlich genug
- Icons erkennbar
- keine schwarzen Texte auf dunklen Flächen
- Geldwerte klar gold oder weiß/grün nach Bedeutung
- rote Elemente ausschließlich für Warnung/Problem
- Animation ohne Voiceover grundlegend nachvollziehbar
