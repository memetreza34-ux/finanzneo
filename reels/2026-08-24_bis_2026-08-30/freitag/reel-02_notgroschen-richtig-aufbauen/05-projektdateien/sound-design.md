# Sound Design — Notgroschen richtig aufbauen

Status: **approved cue plan / assets still required**

This plan is tied to the current canonical Phase-1 animation sources. If animation timing changes, update this plan before sealing/rendering.

## Mix priority

```text
1. German voiceover
2. comprehension
3. subtle SFX
4. optional music only if explicitly added later
```

No placeholder beeps. If a listed asset is missing, report it instead of faking sound.

Final unique Reel assets belong under:

```text
public/sounds/reels/reel-02_notgroschen-richtig-aufbauen/
```

Shared library sounds may live under `public/sounds/<family>/`.

---

## scene-02 — Dafür ist der Notgroschen da

Canonical motion windows:

- bill fall: frames 4–34
- reserve wake: 20–48
- money release: 42–66
- money travel: 58–96
- bill paid/result: 82+

| Frame | Visible event | Sound | Family | Mix note |
|---:|---|---|---|---|
| 4 | Reparaturrechnung beginnt zu fallen | `scene-02-bill-enter.wav` | paper | sehr leiser Papier-Whoosh |
| 42 | Notgroschen wird aktiv / Geld löst sich | `scene-02-reserve-open.wav` | mechanical | kurzer präziser Mechanik-Click |
| 58 | Geldstapel bewegt sich zur Rechnung | `scene-02-money-travel.wav` | money | subtil, kein Casino-Sound |
| 88 | Rechnung ist sichtbar bezahlt / Konto geschützt | `scene-02-paid-confirm.wav` | ui-soft | kurzer leiser Confirm-Ton |

---

## scene-04 — Der Puffer stoppt Schulden

Canonical motion windows:

- bill approach: 4–54
- buffer rise: 34–68
- money release: 56–74
- money travel: 68–96
- debt retreat/result: 82+

| Frame | Visible event | Sound | Family | Mix note |
|---:|---|---|---|---|
| 4 | Rechnung setzt sich Richtung Giro/Dispo in Bewegung | `scene-04-bill-approach.wav` | paper/movement | leichter Papier-Whoosh |
| 34 | Notgroschen fährt in den Zahlungsweg | `scene-04-buffer-rise.wav` | mechanical/movement | weicher, gewichteter Move |
| 68 | Geld bewegt sich zur Rechnung | `scene-04-money-travel.wav` | money | kurz und sauber |
| 90 | Rechnung bezahlt, Dispo zieht sich zurück | `scene-04-debt-avoided.wav` | ui-soft | dezenter Erfolgs-Click |

---

## scene-06 — Die richtige Höhe ist individuell

Canonical motion windows:

- Miete: 4–28
- Fixkosten: 28–54
- Mobilität: 52–80
- Reserve target rise: 16–92
- final result: 88+

Prefer shared library paper sounds here to avoid unnecessary unique files.

| Frame | Visible event | Sound | Family | Mix note |
|---:|---|---|---|---|
| 4 | Mietrechnung erscheint | `paper/appear-soft.wav` | paper | sehr kurz |
| 28 | Fixkosten erscheinen | `paper/appear-soft.wav` | paper | gleiche Familie, etwas leiser im Mix |
| 52 | Mobilitätskosten erscheinen | `paper/appear-soft.wav` | paper | gleiche Familie |
| 92 | höheres individuelles Ziel steht fest | `ui-soft/confirm.wav` | ui-soft | nur wenn Voiceover Platz lässt |

No continuous rising tone. The growing reserve is visually clear and does not need constant audio.

---

## scene-09 — Starte mit einem ersten Puffer

Canonical motion windows:

- January deposit: 16–42
- February appears/deposit: 38–72
- March appears/deposit: 68–104
- result: 94+

| Frame | Visible event | Sound | Family | Mix note |
|---:|---|---|---|---|
| 16 | erste 50-€-Einzahlung startet | `money/land-soft.wav` | money | kleiner Deposit-Sound |
| 38 | Kalender wechselt auf Februar | `paper/page-flip.wav` | paper | kurzer Page Flip |
| 50 | zweite Einzahlung startet | `money/land-soft.wav` | money | wiedererkennbar, nicht lauter |
| 68 | Kalender wechselt auf März | `paper/page-flip.wav` | paper | kurzer Page Flip |
| 80 | dritte Einzahlung startet | `money/land-soft.wav` | money | dritter Deposit |
| 98 | „Erster Puffer“ erreicht | `ui-soft/confirm.wav` | ui-soft | sehr dezenter Abschluss |

This scene may use more cues because the three repeated monthly actions are the actual teaching mechanism. Keep every cue short.

---

## scene-11 — Trenne Puffer und Alltag

Canonical motion windows:

- salary drop: 3–28
- reserve split: 34–58
- transfer: 48–78
- rent arrives: 72–92
- shopping arrives: 84–104
- separated result: 92+

| Frame | Visible event | Sound | Family | Mix note |
|---:|---|---|---|---|
| 3 | Gehalt fällt aufs Girokonto | `scene-11-salary-land.wav` | money | weicher Geld-Landing-Sound |
| 48 | Reserveanteil trennt sich und wandert | `scene-11-transfer.wav` | money/movement | subtiler kurzer Transfer-Whoosh |
| 72 | Miete trifft nur das Girokonto | `paper/appear-soft.wav` | paper | leicht |
| 84 | Einkauf trifft nur das Girokonto | `paper/appear-soft.wav` | paper | leicht |
| 96 | Tagesgeld bleibt sichtbar separat | `ui-soft/confirm.wav` | ui-soft | optional, falls Sprache Platz lässt |

---

## scene-14 — Der Puffer kauft dir Zeit

Canonical motion windows:

- pressure/countdown: 4–30
- reserve move: 28–58
- money release/travel: 50–88
- bill paid: 78–98
- countdown stop: 76–100
- options open: 100+

| Frame | Visible event | Sound | Family | Mix note |
|---:|---|---|---|---|
| 4 | Zeitdruck/Countdown wird aktiv | `scene-14-warning-tick.wav` | ui-soft | ein einzelner kurzer Tick, kein Alarm-Loop |
| 28 | Notgroschen rückt zur Rechnung | `scene-14-reserve-move.wav` | mechanical/movement | gewichteter kurzer Move |
| 62 | Geld fließt zur Rechnung | `scene-14-money-travel.wav` | money | sehr subtil |
| 88 | Zahlung wird sichtbar abgeschlossen | `scene-14-paid-confirm.wav` | ui-soft | kurzer Confirm |
| 100 | Countdown stoppt | `scene-14-timer-stop.wav` | mechanical/ui-soft | klarer, ruhiger Stop-Click |
| 104 | Entscheidungsoptionen öffnen sich | `ui-soft/select.wav` | ui-soft | optional; nur behalten, wenn es nicht überlädt |

---

## Generation prompts

When the ElevenLabs `sound-effects` Agent Skill and local `ELEVENLABS_API_KEY` are available, generate only the missing approved assets.

Examples:

### Paper invoice movement

> Soft paper repair invoice sliding/falling into place, close clean paper movement, around 0.6 seconds, premium educational motion design, no music, no voice, no heavy cinematic impact.

### Money travel

> Subtle small stack of euro coins and cash moving quickly then settling, clean premium financial motion-design sound, around 0.5 seconds, no casino, no jackpot, no music, no voice.

### Mechanical reserve action

> Quiet precise mechanical latch or premium savings container activating, soft weighted click and tiny movement, around 0.4 seconds, no sci-fi, no music, no voice.

### Confirmation

> Very short soft success confirmation click with a restrained warm chime tail, premium UI motion design, around 0.35 seconds, no arcade reward, no music bed, no voice.

### Warning tick

> One restrained financial warning tick, dry and subtle, around 0.2 seconds, no emergency alarm, no siren, no music, no voice.

## Final QA

Before export:

- every referenced file exists locally;
- cues fire on the visible event, not before it;
- voiceover remains clearly dominant;
- no cue sounds like casino/jackpot audio;
- no remote sound URL exists;
- remove optional cues if the mix feels busy;
- render QA is listened to with headphones once before final export.
