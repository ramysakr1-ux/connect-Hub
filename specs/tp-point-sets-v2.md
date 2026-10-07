# TP point sets: the set at a glance, complete build spec

Repo: `ramysakr1-ux/connect-Hub` @ `main` (tree `20d1c6f74b50`), read 7 Oct 2026 18:49Z.
Design: `Magic Touches.dc.html`, 11c. Drop-in: `28_tp_point_sets.html` in this folder.

Display only:
- **Unchanged:** `render()`, `wire()`, the set tabs, the library chooser and contribution, the pages panel and PDF calibration, sessions, slots, stages and saving.
- **Views:** tutor only. The non-tutor and empty states render no `.sess`, so nothing applies there.

Sections 1–4 cover the edits, the map and the tests. The appendices hold the exact code, copied verbatim from the drop-in. Where the two differ, the appendix wins.

## 1. What changes (two edits)

1. A CSS block goes before `</style>`.
2. An IIFE goes at the end of the `text/x-hub-app` script.

**When it re-applies:**
- A `MutationObserver` on `#app` (childList).
- `input` and `change` inside `#app`.

All three are debounced to 150ms.

**Reads:** `S`, `OPEN`, `sessionIds()` and `setNames()`, the page's own. A slot is "staged" when `(slot.stages || []).length > 0`, the same test the contribution count uses.

## 2. The map (`.sm-map`)

**Placement.** Before the first `.sess`, so after the pages panel and before the sessions.

**Frame.** Margin 0 0 14, padding 14/16/12, `--paper`, 1px `--sand-line`, radius 10.

**Head (`.sm-top`).** Flex, baseline, space-between, wraps.

| Element | Spec |
|---|---|
| `b` | "{done} of {all} slots staged", Newsreader 700, 1.1rem, `--teal-deep` |
| `span` | 0.76rem `--grey`: "Each cell is one session: three slots, teal once a slot has its stages. Click to open it." |

**Grid (`.sm-grid`).**
- Columns: `22px repeat(--sm-n, minmax(0,1fr))`, where `--sm-n` is the number of TPs. Gap 5.
- Header row: "TP n", 0.66rem 700, tracked, uppercase, `--grey`, centred.
- One row per teaching set (A, B). The row label is the letter, 0.7rem 700 `--grey`, with the set's name from `setNames()` as its title.

**Cell (`button.sm-cell`).**
- Flex, gap 2, 22px tall, padding 3, 1px `--sand-line`, radius 6, `--surface` fill.
- Transitions: transform and border, .15s.

| Part or state | Spec |
|---|---|
| `i` × slots (3) | flex 1, radius 2. `oklch(91% 0.012 82)` when not staged; `--teal` when staged (`.on`), fading over .3s |
| `.full` (every slot staged) | border teal at 45% |
| `.open` (`OPEN === id`) | 2px `--gold` ring, matching `.sess.open`'s gold edge |
| hover | lifts 1px, border `--teal` |
| focus-visible | 2px `--gold-lifted` outline, offset 2 |

**Tooltip.** `title` and `aria-label` read "TP 3 · Jordan · 2 of 3 slots staged".

**Click:**
- If the session isn't open, the IIFE clicks its `button.shead[data-open=id]`, so the page's own handler sets `OPEN` and re-renders.
- On the next frame it scrolls the window to that `.sess`, 16px above it (`window.scrollTo`, smooth). `scrollIntoView` is not used.
- If the session is already open, it only scrolls.

**Responsive and print:**
- ≤560px: cells are 18px tall with padding 2, and the gap is 4 × 3.
- Print: hidden.
- Reduced motion: no transitions.

## 3. Interaction with existing state

- **Switching set tabs:** `S` changes, `render()` runs, and the map is rebuilt for the new set.
- **Adding or removing a stage:** handled by the page's own buttons, which re-render, so the bar turns teal.
- **Importing a slot or applying a scaffold:** same as above.
- **Rebuilds:** the map is only replaced when its HTML differs.

## 4. Test

1. **A new blank set:** "0 of 36 slots staged", all bars grey.
2. **Opening TP 1 · A and adding a stage to slot 1:** the first bar of the TP 1 / A cell turns teal, and the count reads 1.
3. **Clicking the TP 4 / B cell:** that session opens with its gold edge, the page scrolls to it, and the cell is ringed gold.
4. **Taking a set from the library:** every cell is full and teal-edged, with the count at the full number.
5. **Switching set tabs:** the map shows the other set.
6. **Keyboard:** Tab reaches each cell, and Enter opens it.
7. **375px:** the grid fits without sideways scroll at 6 TPs.
8. **Print:** no map.

---

## Appendix A: existing session rules (verbatim, `main`)
```css
  .sess{background:var(--surface); border:1px solid var(--sand-line); border-radius:10px; margin:0 0 10px; overflow:hidden;}
  .sess.open{border-left:5px solid var(--gold);}
  .shead{display:flex; align-items:center; gap:12px; flex-wrap:wrap; width:100%; text-align:left;
    padding:12px 16px; background:none; border:0; font-family:inherit; cursor:pointer;}
  .shead:hover{background:var(--box);}
  .shead b{font-family:'Newsreader',Georgia,serif; font-size:1.08rem;}
  .shead .who{font-size:0.74rem; color:var(--grey); letter-spacing:.04em;}
  .shead .state{margin-left:auto; font-size:0.72rem; font-weight:700; letter-spacing:.05em;
    text-transform:uppercase; color:var(--grey);}
  .shead .state.done{color:var(--teal);}
  .sbody{padding:0 16px 16px; border-top:1px solid var(--sand-line);}
```

## Appendix B: v2 CSS (verbatim)
```css
  /* ---- v2 (7 Oct 2026): the set at a glance ---------------------------------
     A map above the sessions: one column per TP, a row per teaching set
     (A, B), and in each cell three bars for its three slots, teal once a
     slot has stages. Click a cell to open that session. The open one is
     ringed gold. Display only; the sessions, saving and the library are
     untouched. Design: Magic Touches, 11c. */
  .sm-map{margin:0 0 14px; padding:14px 16px 12px; background:var(--paper); border:1px solid var(--sand-line); border-radius:10px;}
  .sm-top{display:flex; align-items:baseline; justify-content:space-between; gap:12px; flex-wrap:wrap; margin:0 0 10px;}
  .sm-top b{font-family:'Newsreader',Georgia,serif; font-weight:700; font-size:1.1rem; color:var(--teal-deep);}
  .sm-top span{font-size:0.76rem; color:var(--grey);}
  .sm-grid{display:grid; grid-template-columns:22px repeat(var(--sm-n, 6), minmax(0,1fr)); gap:5px 5px; align-items:center;}
  .sm-grid .h{font-size:0.66rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:var(--grey); text-align:center;}
  .sm-grid .r{font-size:0.7rem; font-weight:700; color:var(--grey);}
  .sm-cell{display:flex; gap:2px; height:22px; padding:3px; border:1px solid var(--sand-line); border-radius:6px; background:var(--surface); cursor:pointer;
    transition:transform .15s ease, border-color .15s ease;}
  .sm-cell i{flex:1; border-radius:2px; background:oklch(91% 0.012 82); transition:background-color .3s ease;}
  .sm-cell i.on{background:var(--teal);}
  .sm-cell.full{border-color:color-mix(in oklab, var(--teal) 45%, transparent);}
  .sm-cell:hover{transform:translateY(-1px); border-color:var(--teal);}
  .sm-cell.open{box-shadow:0 0 0 2px var(--gold);}
  .sm-cell:focus-visible{outline:2px solid var(--gold-lifted); outline-offset:2px;}
  .sess{scroll-margin-top:16px;}
  @media(prefers-reduced-motion:reduce){ .sm-cell, .sm-cell i{transition:none;} }
  @media(max-width:560px){ .sm-cell{height:18px; padding:2px;} .sm-grid{gap:4px 3px;} }
  @media print{ .sm-map{display:none;} }
```

## Appendix C: v2 JS (verbatim)
```js
/* ---- v2 (7 Oct 2026): the set at a glance ---------------------------------
     A map above the sessions: one column per TP, a row per teaching set
     (A, B), and in each cell three bars for its three slots, teal once a
     slot has stages. Click a cell to open that session. The open one is
     ringed gold. Display only; the sessions, saving and the library are
     untouched. Design: Magic Touches, 11c. */
  .sm-map{margin:0 0 14px; padding:14px 16px 12px; background:var(--paper); border:1px solid var(--sand-line); border-radius:10px;}
  .sm-top{display:flex; align-items:baseline; justify-content:space-between; gap:12px; flex-wrap:wrap; margin:0 0 10px;}
  .sm-top b{font-family:'Newsreader',Georgia,serif; font-weight:700; font-size:1.1rem; color:var(--teal-deep);}
  .sm-top span{font-size:0.76rem; color:var(--grey);}
  .sm-grid{display:grid; grid-template-columns:22px repeat(var(--sm-n, 6), minmax(0,1fr)); gap:5px 5px; align-items:center;}
  .sm-grid .h{font-size:0.66rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:var(--grey); text-align:center;}
  .sm-grid .r{font-size:0.7rem; font-weight:700; color:var(--grey);}
  .sm-cell{display:flex; gap:2px; height:22px; padding:3px; border:1px solid var(--sand-line); border-radius:6px; background:var(--surface); cursor:pointer;
    transition:transform .15s ease, border-color .15s ease;}
  .sm-cell i{flex:1; border-radius:2px; background:oklch(91% 0.012 82); transition:background-color .3s ease;}
  .sm-cell i.on{background:var(--teal);}
  .sm-cell.full{border-color:color-mix(in oklab, var(--teal) 45%, transparent);}
  .sm-cell:hover{transform:translateY(-1px); border-color:var(--teal);}
  .sm-cell.open{box-shadow:0 0 0 2px var(--gold);}
  .sm-cell:focus-visible{outline:2px solid var(--gold-lifted); outline-offset:2px;}
  .sess{scroll-margin-top:16px;}
  @media(prefers-reduced-motion:reduce){ .sm-cell, .sm-cell i{transition:none;} }
  @media(max-width:560px){ .sm-cell{height:18px; padding:2px;} .sm-grid{gap:4px 3px;} }
  @media print{ .sm-map{display:none;} }
</style>
<link rel="stylesheet" href="hub-house.css?v=202610072111">
</head>
<body class="hub-grid hub-paper hub-course">
<div class="board">
  <a class="back" id="back" href="5_tutor_dashboard.html">&larr; Back</a>
  <div id="app"></div>
</div>
<script src="hub-shared.js?v=202610072111">
```
