# Playwright Visual QA — Notgroschen richtig aufbauen

Status: **required before final visual approval**

This QA plan applies to the existing Reel only:

```text
reels/2026-08-24_bis_2026-08-30/freitag/reel-02_notgroschen-richtig-aufbauen
```

Do not create a second reel or a QA copy.

## Tool

Use the FinanzNeo Antigravity skill:

```text
.agents/plugins/finanzneo-motion/skills/playwright-visual-qa/SKILL.md
```

Use the official Playwright CLI via `npx -y @playwright/cli@latest` and the local Remotion Studio.

## Global checks across all 15 scenes

For every inspected scene:

- Header visually centered.
- Icon optical size consistent with peer scenes.
- Icon-to-first-line gap consistent.
- Two-line title never drags icon downward.
- Main visual remains inside Y320–1400.
- No hero object or label collides with caption zone.
- Main visual is large enough; no avoidable giant dead area.
- Black canvas remains clean `#000000`.
- Captions remain readable and visually separated from the scene visual.
- Scene result is understandable without relying on a long explanatory label.

## Image scenes — inspect one stable frame each

After final Flow assets are present, inspect one stable frame for:

| Scene | Header | Main QA focus |
|---|---|---|
| 01 | Unerwartet wird schnell teuer | Cover/first-scene balance, hero scale, centered composition |
| 03 | Das ist kein Notfall | Classification clarity, no tiny symbolic clutter |
| 05 | Wie groß sollte er sein? | readable financial comparison, balanced object scale |
| 07 | Das Geld muss verfügbar bleiben | **two-line header**, icon anchored to first line, no excessive gap |
| 08 | Tagesgeld passt dafür gut | account/label readability and visual centering |
| 10 | Automatisiere deinen Aufbau | calendar/transfer concept instantly readable |
| 12 | Nach Nutzung wieder auffüllen | refill mechanism clear in a static frame |
| 13 | Eine Rechnung bleibt eine Rechnung | **two-line header**, icon position/gap consistency |
| 15 | Drei Regeln zum Merken | final summary not overcrowded, clean ending composition |

## Animation scenes — representative local frames

Frames below are **scene-local** checkpoints. If the final duration differs, preserve the semantic checkpoints rather than blindly using the number.

### scene-02 — emergency-reserve-pays-real-bill

Inspect approximately:

| Frame | State | Must show |
|---:|---|---|
| 0–4 | START | broken washer + household context clearly staged |
| 28–34 | TRIGGER | repair bill visibly entering/falling |
| 62–70 | MID | reserve awake + money visibly released/traveling |
| 92–100 | NEAR RESULT | money reaches bill, account protection becomes clear |
| final hold | RESULT | bill paid, Girokonto protected, clean readable end state |

Reject if money movement is too small, bill/account spacing feels random, or result looks almost like start.

### scene-04 — buffer-intercepts-before-overdraft

Inspect approximately:

| Frame | State | Must show |
|---:|---|---|
| 0–4 | START | bill, Girokonto and Dispo risk relationship readable |
| 44–54 | TRIGGER | bill clearly approaching danger |
| 68–76 | MID | reserve physically intercepts + money movement starts |
| 90–98 | NEAR RESULT | bill paid, Dispo visibly retreating |
| final hold | RESULT | protected account + debt avoided, no card/flowchart look |

Reject if the scene reads like a diagram rather than a physical intervention.

### scene-06 — obligations-raise-reserve-target

Inspect approximately:

| Frame | State | Must show |
|---:|---|---|
| 0–4 | START | small reserve with uncluttered space for incoming obligations |
| 28–36 | TRIGGER | rent + next cost visibly entering |
| 58–68 | MID | multiple real obligations present while target visibly grows |
| 88–96 | NEAR RESULT | reserve/coin target near full explanatory state |
| final hold | RESULT | DEIN ZIEL readable, composition still feels real-world not dashboard |

Reject if three bills simply become three cards with no visible cause/effect.

### scene-09 — monthly-deposits-fill-reserve

Inspect approximately:

| Frame | State | Must show |
|---:|---|---|
| 0–8 | START | January + low reserve clearly readable |
| 38–44 | TRIGGER | February page change + first deposit effect visible |
| 68–76 | MID | month progression and second/third deposit visually distinct |
| 98–106 | NEAR RESULT | third deposit reaches reserve |
| final hold | RESULT | first buffer achieved, no progress-bar substitute |

Reject if calendar pages overlap awkwardly, coin paths cross text, or repeated deposits feel static.

### scene-11 — salary-splits-into-separate-reserve

Inspect approximately:

| Frame | State | Must show |
|---:|---|---|
| 0–4 | START | Girokonto/Tagesgeld spatial separation immediately readable |
| 28–38 | TRIGGER | salary visibly lands on Girokonto |
| 58–70 | MID | reserve share physically moves toward Tagesgeld |
| 90–100 | NEAR RESULT | everyday bills stay with Girokonto while reserve remains separate |
| final hold | RESULT | clear Alltag vs Reserve separation, balanced two-account composition |

Reject if the money route becomes a generic flowchart or the two accounts look like mismatched UI cards.

### scene-14 — reserve-stops-countdown-and-opens-options

Inspect approximately:

| Frame | State | Must show |
|---:|---|---|
| 0–4 | START | broken washer + bill + early pressure context |
| 28–36 | TRIGGER | countdown/pressure active, reserve begins response |
| 68–78 | MID | money visibly moving to the bill |
| 94–104 | NEAR RESULT | payment complete and countdown visibly stopping |
| final hold | RESULT | calm options visible, hierarchy cleaner than the panic state |

Reject if timer dominates the whole scene, choices appear too early, or the final state is more cluttered than the problem state.

## Cross-scene header comparison

Take side-by-side screenshots or otherwise directly compare at least:

- scene-01 vs scene-03 vs scene-05: one-line header rhythm;
- scene-07 vs scene-13: two-line header icon anchoring;
- one animation scene vs one image scene: same header/icon visual system.

The visible icon box should feel consistent even when underlying SVG viewBoxes differ.

## Final Playwright QA result

Record only one of:

```text
PLAYWRIGHT_VISUAL_QA=PASS
```

or

```text
PLAYWRIGHT_VISUAL_QA=FAIL
```

If FAIL, list exact scene IDs and visible reasons, fix canonical source, and rerun affected checkpoints.

PASS does not replace `reel:validate`, Phase-3 preflight, render smoke test or final post-render QA.
