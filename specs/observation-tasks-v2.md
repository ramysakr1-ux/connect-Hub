# Observation tasks: how far each sheet has got, complete build spec

Repo: `ramysakr1-ux/connect-Hub` @ `main` (tree `f868e7bc87aa`), read 7 Oct 2026 18:56Z.
Design: `Magic Touches.dc.html`, 12b. Drop-in: `18_observation_tasks.html` in this folder.

Display only:
- **Unchanged:** `answered()`, `expectedOf()`, `statusOf()`, the chips, saving (`touch`), bullets, the Turn in handler and the turned-in banner text.
- **Read-only** (tutor or assessor reading): the list lines and the meter show. There is no Turn in button, so no pulse.

Sections 1–4 cover the edits, the list lines, the open sheet and the tests. The appendices hold the exact code, copied verbatim from the drop-in. Where the two differ, the appendix wins.

## 1. What changes (three edits)

1. **`row()`:** `<a class="task">` gains three attributes.
   - `data-n` = `answered(k)`
   - `data-exp` = `expectedOf(t)`
   - `data-in` = 1 when the sheet is turned in (turned-in sheets only)
2. **CSS:** a block before `</style>`.
3. **JS:** an IIFE at the end of the app script. It re-applies after every `list()` and `sheet()` via a `MutationObserver` on `#app`.

**On an open sheet, the meter updates:**
- 120ms after `input` or `change`.
- After clicks on `.tick-o`, checkboxes and radios.

The page's own `touch()` has already written to `WORK` by then.

## 2. The list: progress hairlines

**Placement.** Each `a.task` (now `position:relative`) gains `span.ob-line`: absolute, left 64 (past the 52px TP label), right 0, bottom −1, 2px tall, `aria-hidden`.

**Fill (`i`).** Width animates over .5s `cubic-bezier(.2,.7,.2,1)`.

| State | Width | Colour |
|---|---|---|
| Turned in, or `n ≥ exp` | 100% | `--teal` (`.full`) |
| Partly answered | n ÷ exp | `--gold` |
| `exp` unknown and n > 0 | 50% | `--gold` |
| Not started | 0 | — |

**Agreement with the chips.** The colours match the existing chip meanings: `.st.part` is gold, and `.st.done` is green or teal.

**On phones (≤600px):** the line runs full width.

## 3. The open sheet

### 3.1 Meter (`.ob-meter`)

**Placement.** Appended to `.bar`, pushed right with `margin-left:auto`. `.bar` now wraps. On phones it takes the full width.

**Parts:**
- A track, 120×6px, radius 3, `oklch(91% 0.012 82)`.
- A fill, `--gold`, or `--teal` when full, with width transitioning over .4s.
- The text "**n** of e answered", 0.8rem `--grey`, with the number in `--ink` and tabular figures.

**Counting.** The same `answered(k)` and `expectedOf(t)` as the list chips, so a parts sheet counts parts, not cells. The key comes from the URL's `task` and `sit` via `recKey`.

**Labels.** `aria-live="polite"`.

### 3.2 Ready pulse

The first time the sheet becomes full while open and not yet turned in, `#turnIn` gets `.ob-ready`: one gold ring pulse over 1.6s. It doesn't fire on opening an already-full sheet.

### 3.3 Turn-in moment

On a click on `#turnIn`, the page sets `turnedInAt` and re-renders. The new `.turned` banner gets `.ob-new`: a .55s settle, from scale 1.08 / −1.5° to rest, with its origin at the left. Banners that were already there on load don't animate.

**Reduced motion:** no transitions, pulse or settle.

**Print:** no lines or meter.

## 4. Test

1. **List:** Film 2 turned in has a full teal line. Live 1 with 2 of 5 has a 40% gold line. Not-started rows have none.
2. **Opening Live 1:** the meter reads "2 of 5 answered".
   - Typing in the third box: "3 of 5" within about 120ms.
   - Filling all five: the meter turns teal, and Turn in pulses once.
3. **Turn in:** the banner settles in with today's date.
4. **Back to the list:** that row's line is teal.
5. **Peer sheets** (notes, not turned in): the meter shows and there's no pulse. The list line follows the answers.
6. **Read-only:** the lines and meter show, with no button.
7. **375px:** the meter sits on its own line, and the lines run full width.

---

## Appendix A: existing list and bar rules (verbatim, `main`)
```css
  .task{display:flex; align-items:center; gap:12px; padding:11px 0; border-top:1px solid var(--sand-line);
    text-decoration:none; color:inherit;}
  .task:first-of-type{border-top:0;}
  .task .tp{flex:none; width:52px; font-size:0.72rem; font-weight:700; letter-spacing:.05em; color:var(--grey);}
  .task .nm{flex:1; min-width:0; font-size:0.92rem; font-weight:600; color:var(--ink);}
  .task .nm small{display:block; font-weight:400; font-size:0.79rem; color:var(--grey); margin-top:1px;}
  /* a row that opens: the house ring, no colour change (hover carries no hue) */
  .task:hover{box-shadow:var(--hub-ring, 0 0 0 2px oklch(86% 0.014 82)); border-radius:6px;}
  .st{flex:none; font-size:0.71rem; font-weight:700; padding:3px 9px; border-radius:999px;
    background:var(--box); color:var(--grey);}
  /* the tracker's 'fine' chip, so done reads the same everywhere */
  .st.done{background:oklch(95% 0.02 155); color:oklch(35% 0.08 155);}
  .st.part{background:oklch(94% 0.05 85); color:var(--gold);}
  .after{margin-top:22px; padding-top:16px; border-top:1px solid var(--sand-line);}
  .after h4{font-family:'Newsreader',Georgia,serif; font-size:1rem; margin:0 0 10px;}
  .tally{font-size:0.75rem; font-weight:700; color:var(--teal); background:var(--box);
    border-radius:999px; padding:3px 10px; white-space:nowrap;}
```

## Appendix B: the row() edit (verbatim)
```js
  return `<a class="task" href="${q}" data-n="${answered(k)}" data-exp="${expectedOf(t)}" data-in="${turnsIn(t) && (WORK[k] || {}).turnedInAt ? 1 : 0}">
```

## Appendix C: v2 CSS (verbatim)
```css
  /* ---- v2 (7 Oct 2026): how far each sheet has got ---------------------------
     In the list, a hairline under each task fills as the sheet is answered:
     gold while in progress, teal once complete or turned in. On an open sheet,
     the bar carries a live meter, and turning in stamps the date on. Display
     only; answering, saving and turning in are untouched. Design: Magic
     Touches, 12b. */
  .task{position:relative;}
  .task .ob-line{position:absolute; left:64px; right:0; bottom:-1px; height:2px; border-radius:1px; background:transparent; overflow:hidden; pointer-events:none;}
  .task .ob-line i{display:block; height:100%; background:var(--gold); border-radius:1px; transition:width .5s cubic-bezier(.2,.7,.2,1);}
  .task .ob-line.full i{background:var(--teal);}
  .ob-meter{display:inline-flex; align-items:center; gap:10px; font-size:0.8rem; color:var(--grey);}
  .ob-meter .trk{width:120px; height:6px; border-radius:3px; background:oklch(91% 0.012 82); overflow:hidden;}
  .ob-meter .trk i{display:block; height:100%; border-radius:3px; background:var(--gold); transition:width .4s cubic-bezier(.2,.7,.2,1);}
  .ob-meter.full .trk i{background:var(--teal);}
  .ob-meter b{color:var(--ink); font-variant-numeric:tabular-nums;}
  .bar{flex-wrap:wrap;}
  .bar .ob-meter{margin-left:auto;}
  #turnIn.ob-ready{animation:ob-ready 1.6s ease-out 1;}
  .turned.ob-new{animation:ob-stamp .55s cubic-bezier(.3,1.4,.5,1) both; transform-origin:12% 50%;}
  @keyframes ob-ready{0%{box-shadow:0 0 0 0 oklch(70% 0.12 72 / .6);}100%{box-shadow:0 0 0 12px oklch(70% 0.12 72 / 0);}}
  @keyframes ob-stamp{0%{opacity:0; transform:scale(1.08) rotate(-1.5deg);}60%{opacity:1; transform:scale(.99) rotate(.3deg);}100%{transform:none;}}
  @media(prefers-reduced-motion:reduce){ .task .ob-line i, .ob-meter .trk i{transition:none;} #turnIn.ob-ready, .turned.ob-new{animation:none;} }
  @media(max-width:600px){ .task .ob-line{left:0;} .bar .ob-meter{margin-left:0; width:100%;} }
  @media print{ .ob-line, .ob-meter{display:none;} }
```

## Appendix D: v2 JS (verbatim)
```js
/* ---- v2 (7 Oct 2026): how far each sheet has got ---------------------------
     In the list, a hairline under each task fills as the sheet is answered:
     gold while in progress, teal once complete or turned in. On an open sheet,
     the bar carries a live meter, and turning in stamps the date on. Display
     only; answering, saving and turning in are untouched. Design: Magic
     Touches, 12b. */
  .task{position:relative;}
  .task .ob-line{position:absolute; left:64px; right:0; bottom:-1px; height:2px; border-radius:1px; background:transparent; overflow:hidden; pointer-events:none;}
  .task .ob-line i{display:block; height:100%; background:var(--gold); border-radius:1px; transition:width .5s cubic-bezier(.2,.7,.2,1);}
  .task .ob-line.full i{background:var(--teal);}
  .ob-meter{display:inline-flex; align-items:center; gap:10px; font-size:0.8rem; color:var(--grey);}
  .ob-meter .trk{width:120px; height:6px; border-radius:3px; background:oklch(91% 0.012 82); overflow:hidden;}
  .ob-meter .trk i{display:block; height:100%; border-radius:3px; background:var(--gold); transition:width .4s cubic-bezier(.2,.7,.2,1);}
  .ob-meter.full .trk i{background:var(--teal);}
  .ob-meter b{color:var(--ink); font-variant-numeric:tabular-nums;}
  .bar{flex-wrap:wrap;}
  .bar .ob-meter{margin-left:auto;}
  #turnIn.ob-ready{animation:ob-ready 1.6s ease-out 1;}
  .turned.ob-new{animation:ob-stamp .55s cubic-bezier(.3,1.4,.5,1) both; transform-origin:12% 50%;}
  @keyframes ob-ready{0%{box-shadow:0 0 0 0 oklch(70% 0.12 72 / .6);}100%{box-shadow:0 0 0 12px oklch(70% 0.12 72 / 0);}}
  @keyframes ob-stamp{0%{opacity:0; transform:scale(1.08) rotate(-1.5deg);}60%{opacity:1; transform:scale(.99) rotate(.3deg);}100%{transform:none;}}
  @media(prefers-reduced-motion:reduce){ .task .ob-line i, .ob-meter .trk i{transition:none;} #turnIn.ob-ready, .turned.ob-new{animation:none;} }
  @media(max-width:600px){ .task .ob-line{left:0;} .bar .ob-meter{margin-left:0; width:100%;} }
  @media print{ .ob-line, .ob-meter{display:none;} }
</style>
<link rel="stylesheet" href="hub-house.css?v=202610072151">
</head>
<body class="hub-obs hub-paper hub-course">
<div class="board">
  <a class="back" id="back" href="index.html">&larr; Back</a>
  <div id="app"></div>
</div>
<script src="observation-defaults.js?v=202610072151">
```
