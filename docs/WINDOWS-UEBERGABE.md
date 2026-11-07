# Umzug vom Mac auf Windows (Stand 06.11.2026)

## Mit welchem Branch weitermachen

`claude/adoring-neumann-051170`: enthält die neue YouTube-Bildwelt (weiße Folien, Belege, Doodles) und den Befehl `youtube:stimme`.

```bash
git clone https://github.com/memetreza34-ux/finanzneo.git
cd finanzneo
git checkout claude/adoring-neumann-051170
npm install
```

`main` auf GitHub ist älter: Die 7 Commits zur neuen Bildwelt stehen dort noch nicht. Sie gehören per Pull Request nach `main`.

## Was auf Windows anders ist

- **`youtube:stimme` läuft dort so noch nicht.** Der Befehl nutzt `mlx-audio`, und das gibt es nur für Apple-Chips. Qwen3-TTS selbst läuft auch mit PyTorch und einer NVIDIA-Grafikkarte, dafür muss `scripts/youtube-stimme.py` angepasst werden. Das ist noch nicht gebaut und nicht getestet. Referenz, Text und Einstellungen in `youtube/_kanal/stimme/` bleiben gleich.
- **`scripts/youtube-belege.mjs`** sucht den lokalen Chrome über `scripts/lib/youtube-chrome.mjs`. Unter Windows noch nicht getestet.

## Was nicht auf GitHub liegt

Vom Git ausgeschlossen, bei Bedarf per USB-Stick oder Cloud kopieren:

- `youtube/*/4-audio-hier-rein/voiceover.wav`: die fertigen Sprachaufnahmen
- `youtube/*/5-export/video.mp4`: die fertigen Videos
- `~/finanzneo-tts/`: Python-Umgebung, Modell, Hörproben
- `~/.claude/projects/-Users-arman-FinanzNeo-Claud/memory/`: Claudes Gedächtnis zu diesem Projekt (19 Dateien)
