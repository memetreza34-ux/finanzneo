# FinanzNeo Remotion-Studio

Ein Projekt zur Erstellung von vertikalen Finanz-Erklärvideos (Reels, TikToks, Shorts) für die Marke FinanzNeo.

## Tech Stack
- **React**: Für den deklarativen Aufbau der Video-Komponenten
- **TypeScript**: Für typsicheren Code
- **Remotion**: Das Framework, um aus React-Code Videos zu generieren

## Installation
```bash
npm install
```

## Nutzung

### Studio starten (Vorschau)
Das Remotion Studio starten, um die Videos im Browser (meist unter http://localhost:3000) anzusehen:
```bash
npm run studio
```

### Video rendern (MP4-Export)
Um eine Video-Komposition als fertige .mp4-Datei zu exportieren, nutze das entsprechende npm-Skript:
```bash
npm run render:drei-konten
npm run render:notgroschen
npm run render:zinseszins
```
*(Die gerenderten Dateien landen jeweils in ihrem Projektordner im Verzeichnis `reels/`.)*

## Weitere Informationen
Bitte beachte die folgenden Dateien für detaillierte Erläuterungen und Abläufe:
- [START-HIER.md](./START-HIER.md) – Eine allgemeine Einführung ins Projekt.
- [ANLEITUNG.md](./ANLEITUNG.md) – Detaillierte Anleitungen, Architektur-Konzepte und Workflow-Schritte.
