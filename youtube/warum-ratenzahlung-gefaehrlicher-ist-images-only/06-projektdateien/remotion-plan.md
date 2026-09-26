# Static-Layout-Plan — Animation deaktiviert

PRODUCTION_MODE: images-only
LAYOUT_CONTRACT: finanzneo-youtube-framed-scene-v1
IMAGE_WORLD: finanzneo-youtube-grounded-3d-black-v1 (unverändert)

Phase A unterscheidet sich nur durch fehlende Bewegung. Jede Endszene bleibt ein vollständiger 1920 × 1080 YouTube-Frame mit kurzer Überschrift + passendem Icon + eingebettetem Visualfenster auf sichtbarer deep-black FinanzNeo-Grundfläche. Flow-Bilder dürfen niemals fullscreen sein.

Erlaubte statische Erklärmittel: exakte kurze Labels, Zahlen, Pfeile, Markierungen, Vergleiche, Formeln und Mini-Charts. Bevorzugte Komponenten: `StaticNumber`, `StaticArrow`, `StaticLabels`, `StaticCompare`, `StaticMiniChart`.

Verboten: jede Frame-zu-Frame-Bewegung, `useCurrentFrame()` für sichtbare Motion, `interpolate()`, `spring()`, Count-up, Fade, Slide, Zoom, Chart-Grow, Icon-Animation und Kamerabewegung. Normale harte Cuts zwischen statischen Szenen sind erlaubt.
