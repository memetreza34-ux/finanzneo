import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtempSync, readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import test from 'node:test';
import {messeBildGrund} from '../scripts/lib/youtube-bildgrund.mjs';

/** Testbild: Creme-Grund, unten ein dunkler „Tisch“, in der Mitte ein farbiges Motiv. */
const bild = (ordner: string, name: string, grund: string) => {
  const pfad = join(ordner, name);
  const filter = `drawbox=x=0:y=760:w=1920:h=320:color=0x8B6B4A:t=fill,drawbox=x=700:y=300:w=520:h=420:color=0x4F8A67:t=fill`;
  const r = spawnSync('ffmpeg', ['-nostdin', '-v', 'error', '-y', '-f', 'lavfi', '-i', `color=c=0x${grund}:s=1920x1080`, '-vf', filter, '-frames:v', '1', pfad]);
  assert.equal(r.status, 0, 'ffmpeg konnte kein Testbild erzeugen');
  return pfad;
};

test('Bildgrund: Rand-Median trifft den Creme-Ton, Tisch und Motiv zählen nicht', () => {
  const ordner = mkdtempSync(join(tmpdir(), 'bildgrund-'));
  const pfade = [bild(ordner, 'a.png', 'FCF4E1'), bild(ordner, 'b.png', 'FCF4E1'), bild(ordner, 'c.png', 'F0D8A8')];
  const ergebnis = messeBildGrund(pfade);
  assert.ok(ergebnis);
  assert.equal(ergebnis.bilder, 3);
  // Median über die Bilder: der Ausreißer c verschiebt den Wert nicht.
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(ergebnis.grund.slice(i, i + 2), 16));
  for (const [ist, soll] of [[r, 0xfc], [g, 0xf4], [b, 0xe1]]) assert.ok(Math.abs(ist - soll) <= 2, `${ergebnis.grund} weicht von #FCF4E1 ab`);
});

test('Bildgrund: ohne lesbare Bilder kein Wert (Video nutzt dann DATEN.grund)', () => {
  assert.equal(messeBildGrund([]), null);
  assert.equal(messeBildGrund(['/gibt/es/nicht.png']), null);
});

test('Zusammenbau misst den Grund nur bei Kanal-Stilvorlage und das Video reicht ihn weiter', () => {
  const zusammenbau = readFileSync('scripts/youtube-zusammenbau.mjs', 'utf8');
  assert.match(zusammenbau, /styleMaster === 'kanal'\s*\?\s*messeBildGrund\(/);
  const video = readFileSync('src/youtube-projekt/YouTubeVideo.tsx', 'utf8');
  assert.match(video, /<DatenGrund value=\{zeitplan\.grund \?\? DATEN\.grund\}>/);
});
