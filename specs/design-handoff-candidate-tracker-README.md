# Handoff: Candidate Tracker (trainer grid)

## Overview
A single trainer-facing grid showing every candidate on the course against every assessed item: four written assignments on one tab, eight teaching practices on the other. Same candidate rows on both tabs, so switching does not move anyone. Every cell is written by the thing that produced it — a submission, a mark sheet, a double marker's sign-off. Nothing on the grid is typed into it.

Built to sit inside Connect Hub, reading the records the Hub already holds.

## About the Design Files
`Candidate Tracker.dc.html` is a **design reference built in HTML** — a prototype showing intended look and behaviour, not production code to copy. Recreate it in the target codebase (repo: `ramysakr1-ux/celta-connect`, per `github.md`) using its existing components and patterns.

## Fidelity
**High-fidelity.** Colours, typography, spacing, grade vocabulary and copy are final. Sample candidate data is placeholder.

## Layout

Page: 1380px, 48px padding, Karla throughout, Newsreader for the page title only.

### Header block
Eyebrow (10.5px, uppercase, letter-spacing 0.14em, muted) → title "Candidate tracker" (Newsreader 30px/700, ink) → one line of body copy (12.5px, muted).

### The card
One rounded 8px card, 1px border `oklch(89.5% 0.012 82)`, background `oklch(97.6% 0.01 85)`, overflow hidden.

**Card header bar** — 1px bottom rule, 16px horizontal padding, space-between:
- Left: two tabs, `Assignments` and `Teaching practice`. Active is bold, ink-coloured, 2px bottom border pulled onto the rule. Inactive is medium weight, muted, no border.
- Right: four filter links (text, not pills) with live counts — `Everyone`, `To mark`, `Double marking`, `At risk`. Count sits after the label at 10px/700 in its own colour (blue / purple / red). Active filter is bold ink.

**Grid** — CSS grid, `210px repeat(N, 1fr) 58px` (N = 4 assignments or 8 TPs).
- TP tab only: a stage band row above the header — Stage 1 spans TP1–2, Stage 2 spans TP3–5, Stage 3 spans TP6–8. 9px uppercase, centred, 1px bottom rule with 4px side inset.
- Column header row: candidate count on the left (9px uppercase muted), each column label centred (11.5px/600) with `mark / DM` beneath it (9px, `oklch(66% 0.017 70)`), tail label on the right (`Passed` / `To std`). 1px bottom rule.
- Candidate rows: 38px tall, 1px bottom rule `oklch(93% 0.01 82)`, no per-cell borders — cells are separated by a 1px left rule only. Name at 12.5px/500. At-risk rows get a warm tint `oklch(97% 0.014 40)` and an "at risk" tag beside the name in red.
- Tail column: `3/4` passed, or `5/6` to standard across TP1–6. Red when at risk.
- Legend under the grid: 10px tokens above 10px labels, above a 1px top rule, wrapped in a flex row with 5px/16px gaps.

### Cells
No boxes, no badges. Each cell is two text parts:

```
first mark  /  DM second mark
```

Both parts always render once the item exists. The second part is `—` when nothing has been double marked, which is the normal case.

### Detail strip
Opens below the grid when a cell is clicked; the grid keeps full width. Four columns: identity (kicker, candidate name in Newsreader 20px, column name, status chip) · facts (label/value rows, 88px label column) · trail (time + event, 54px time column) · actions (stacked buttons, primary filled ink, secondary outlined, plus a Close link).

## Grade vocabulary

**Assignments** — one state per cell: not yet due (`·`), due, missing, in (submitted, unmarked), pass, resubmit, resub in, pass² (passed on resubmission), fail.

**Teaching practice** — three grades only: **above standard**, **to standard**, **not to standard**. There is no "below standard" — do not reintroduce it. Plus two non-grades: taught (feedback not signed off) and absent/rescheduled.

## Colour rule
**Colour marks only what needs a trainer.** Everything fine stays quiet grey-green text on no fill.

| Meaning | Ink | Fill |
| --- | --- | --- |
| Fine (pass, pass², to standard) | `oklch(55% 0.014 78)` | none |
| Above standard | `oklch(38% 0.085 155)` | none |
| Not yet due / absent | `oklch(76% 0.012 82)` | none |
| Waiting to be marked (in, resub in, taught) | `oklch(40% 0.09 235)` | `oklch(94.5% 0.03 232)` |
| Needs work (resubmit, due) | `oklch(45% 0.11 65)` | `oklch(94% 0.055 78)` |
| Wrong (missing, fail, not to standard) | `oklch(46% 0.17 25)` | `oklch(92% 0.05 25)` |
| Double mark, agreed or in progress | `oklch(62% 0.03 300)` | none |
| Double marks differ | `oklch(45% 0.15 300)` | none + ring `0 0 0 1.5px oklch(55% 0.17 300)` |

Three attention colours total: blue (waiting on you), amber (candidate has work to do), red (wrong). Purple is reserved entirely for double marking.

## Double marking
- Shown inline as the second half of every cell, prefixed `DM`.
- `/ —` no second mark.
- `/ DM …` second marker is working. First mark stays visible; for TP the second mark is blind, so the *second marker* does not see the first — this grid is the trainer's view, not the second marker's.
- `/ DM pass` agreed. Faint purple, no ring.
- `/ DM not std` differs from the first mark. Bold purple, ring around the cell. Must be standardised before the grade is released.
- The `Double marking` filter shows only candidates with a pending or disputed second mark.

## Interactions
- Tab switch resets the open detail strip, keeps the filter.
- Filter is a single selection, not multi.
- Any cell click opens the detail strip for that candidate × item.
- Detail actions are context-dependent: `Open the mark sheet` for unmarked work, `Send a reminder` for missing, `Sign off the feedback` for a taught-but-unsigned TP, `Standardise` when double marks differ, `Assign a second marker` when there is none.
  - **Three of those five are deliberately NOT built — Ramy, 22 September 2026: "leave them out."** `Send a reminder` has nothing to send through; Lite has no messaging. `Standardise` and `Assign a second marker` belong to the mark sheet, which is where the marker names and the double-marked flag are actually edited — consistent with folding double-marking into the tracker rather than giving it its own tab. Built and correct: `Open the mark sheet`, `Open the marked record`, `Sign off the feedback`, `Read the feedback`, `Open the TP record`, `Open the candidate's pack`. **This is a settled decision, not an outstanding gap — do not re-raise it.**
- At risk = any fail or missing assignment, or two or more not-to-standard TPs.

## Data it reads from Connect Hub
Per candidate, per assignment: state, first marker initials, second-marker state (none / in progress / agreed / differs). Per candidate, per TP: grade, tutor initials, blind second-mark state. Nothing is written from this screen except through the actions, which open the existing records.

## Assets
No images, no icon library, no SVG. Fonts: Karla 400–700 and Newsreader 600/700 from Google Fonts — the same pairing used across Connect and the Hub.

## Files
- `Candidate Tracker.dc.html` — the screen, standalone and interactive.
- `for-claude-code-candidate-tracker.md` — build spec: data shape, states, integration points.
