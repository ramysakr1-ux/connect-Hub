# TP planning grid: the group's aims at a glance, complete build spec

Repo: `ramysakr1-ux/connect-Hub` @ `main` (tree `20d1c6f74b50`), read 7 Oct 2026 18:45Z.
Design: `Magic Touches.dc.html`, 11a. Drop-in: `21_tp_grid.html` in this folder.

Display only:
- **Unchanged:** `render()`, `wire()`, `gridSet` saving, release and unrelease, the due line, the clash note, and the six-a-group note.
- **Views:** the tutor, trainee and read-only views all get the same layer.
- **Storage:** nothing new is stored.

Sections 1–5 cover the edits, the three touches and the tests. The appendices hold the exact code, copied verbatim from the drop-in. Where the two differ, the appendix wins.

## 1. What changes (two edits)

1. A CSS block goes before `</style>`.
2. An IIFE goes after the final `render();` in the `text/x-hub-app` script.

**When it re-applies:**
- A `MutationObserver` on `#app` (childList), ignoring `ag-*` nodes.
- `change` and `input` inside `#app`, debounced to 120ms, so the map follows a choice before the save round-trip re-renders.

**Reading a cell (`cellVal`).** The `select` or `input` value; otherwise the `.ro` text, unless it is `.empty`.

## 2. The aim map (`.ag-map`), one per `section.group`

**Placement.** Inserted before `.tablewrap`, so it sits after the h2, release bar and due line.

**Frame.** Grid `auto minmax(0,1fr)`, gap 8 × 14, margin-top 14, padding 12/14, `--paper`, 1px `--sand-line`, radius 8. `aria-label` "Main aims chosen in this group".

**One line per TP** (the TPs present in the cells, normally the last two):

| Part | Spec |
|---|---|
| `.tp` | "TP{n}", Newsreader 700, 0.95rem |
| `.ag-chips` | flex, wraps, gap 6 |
| `.ag-chip` | one per distinct main aim, most-chosen first, then alphabetical. Padding 3/10, radius 999, 0.78rem 600, `--sand-deep` fill, 1px `--sand-line`, `--ink` |
| `.ag-chip.clash` | chosen by 2 or more: `--gold-wash` fill, `--gold` border, `--ink-warm` text, plus a bold Newsreader "×n" in `--gold-deep`. It agrees with the existing `td.clash` ring and `.clashnote`. |
| `.ag-none` | 0.76rem `--grey`: "n not chosen yet". When every main aim is chosen it reads "every main aim chosen" in `--teal` (`.all`). |

**Chip hover:**
- The chip lifts 1px with the shadow `0 6px 12px -8px oklch(30% 0.04 60 / .5)` (.15s).
- In the same group and TP, every main-aim cell holding that aim gets `.ag-lit`, a 2px inset `--teal` ring on the select or `.ro`.
- Moving off clears it.

**Rebuild:** only when the HTML changes.

## 3. Row complete tick

- **When:** every `td.cell` in the row has a value (main, sub and material for both TPs).
- **What:** `.nm` gains `span.ag-ok`: a 16px `--teal` circle with a `--paper` ✓ (10px 700) and margin-left 8. It pops in with `ag-in` (.35s, scale .4 → 1).
- **Labels:** `title` and `aria-label` "Every cell filled".
- **Removed** when a cell is emptied.

## 4. Group count

The section's h2 gains `span.ag-count`: "· **x of N** rows complete", 0.78rem Karla 500 `--grey`, with the numbers in `--ink`.

**Responsive and print:**
- ≤560px: the map is one column, and each TP label sits above its chips.
- Print: the map and count are hidden. The ticks print, which is harmless.
- Reduced motion: no lift or pop.

## 5. Test

1. **Tutor view, group of 4, nothing chosen:** each TP line reads "4 not chosen yet". The count is "0 of 4 rows complete".
2. **Choosing Grammar for two trainees' TP7:** the gold "Grammar ×2" chip appears, matching the existing clash ring and note.
3. **Hovering that chip:** both cells ring teal.
4. **Filling all six cells for one trainee:** a tick pops by the name, and the count reads "1 of 4".
5. **Trainee view:** their own row stays tinted (`tr.mine`). The map shows the whole group, including read-only rows.
6. **Release and unrelease:** after the re-render the map and ticks are re-applied, with no duplicates.
7. **375px:** the map stacks, and the table scrolls inside its own box as before.

---

## Appendix A: existing grid rules (verbatim, `main`)
```css
  .tablewrap{overflow-x:auto; -webkit-overflow-scrolling:touch; margin:14px 0 0;}
  table.grid{width:100%; border-collapse:collapse; font-size:0.86rem; background:var(--paper); border:1px solid var(--sand-line); border-radius:8px;}
  table.grid th{font-size:0.66rem; letter-spacing:.06em; text-transform:uppercase; color:var(--grey); text-align:left; padding:8px 8px; border-bottom:1px solid var(--sand-line); font-weight:700; white-space:nowrap;}
  table.grid th.tp{text-align:center; font-family:'Newsreader',Georgia,serif; font-size:0.95rem; letter-spacing:0; text-transform:none; color:var(--ink); border-left:1px solid var(--sand-line);}
  table.grid td{padding:8px 8px; border-bottom:1px solid var(--sand-line); vertical-align:top;}
  table.grid td.first{border-left:1px solid var(--sand-line);}
  table.grid tr:last-child td{border-bottom:0;}
  table.grid tr.mine td{background:color-mix(in oklab, var(--teal) 6%, var(--paper));}
  .nm{font-weight:600; white-space:nowrap; display:flex; align-items:center;}
  .nm .you{font-size:0.66rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:var(--teal); margin-left:8px;}
  .sofar{font-size:0.74rem; color:var(--grey); margin-top:4px; white-space:normal; max-width:220px; line-height:1.4;}
  .sofar b{font-weight:600; color:var(--ink);}
  .cell{min-width:150px;}
  .cell .house-sel select, .cell input{width:100%; box-sizing:border-box; font:inherit; font-size:0.86rem;}
  /* One height for every cell -- the select, the material box and the
     read-only cell (Ramy, 28 Sep 2026: "make the materials box the same
     size as the rest"). The select's own height is 46px with the house's
     4px gold edge; the other two are built to match it. */
  .cell input{height:46px; padding:0 14px; border:1px solid var(--sand-line); border-left:4px solid var(--gold); border-radius:8px; background:var(--sand-deep); color:inherit;}
  .cell input:focus{outline:none; border-color:var(--gold);}
  table.grid .ro{height:46px; box-sizing:border-box; display:flex; align-items:center; padding:0 14px; border-radius:8px; background:var(--sand-deep); color:var(--ink); font-size:0.86rem;}
  table.grid .ro.empty{color:var(--faint); font-style:italic;}
  td.clash .ro, td.clash .house-sel select{box-shadow:inset 0 0 0 1.5px var(--gold);}
  .clashnote{font-size:0.78rem; color:var(--gold-deep); font-weight:600; margin:8px 0 0;}
  .aims{font-size:0.8rem; color:var(--grey); margin:12px 0 0; line-height:1.55;}
  .status{font-size:0.8rem; color:var(--grey); margin-left:auto;}
  .empty{padding:20px; color:var(--grey); font-size:0.9rem;}
  @media (max-width:560px){ .board{padding:18px 12px 60px;} section.group{padding:12px 12px 14px;} .sofar{max-width:160px;} }
  @media print{ .back, .relbar, .check, #hubSync{display:none !important;} body{background:#fff;} }
```

## Appendix B: v2 CSS (verbatim)
```css
  /* ---- v2 (7 Oct 2026): the group's aims at a glance ------------------------
     Above each group's table, one line per TP: the main aims the group has
     chosen, as chips, two of the same in gold (the clash the note below
     already names), and how many have not chosen. Each row that has all six
     cells filled gets a quiet tick by the name. Display only; the cells, the
     saving and the release are untouched. Design: Magic Touches, 11a. */
  .ag-map{display:grid; grid-template-columns:auto minmax(0,1fr); gap:8px 14px; align-items:center; margin:14px 0 0; padding:12px 14px; background:var(--paper); border:1px solid var(--sand-line); border-radius:8px;}
  .ag-map .tp{font-family:'Newsreader',Georgia,serif; font-weight:700; font-size:0.95rem;}
  .ag-chips{display:flex; flex-wrap:wrap; gap:6px; align-items:center;}
  .ag-chip{display:inline-flex; align-items:center; gap:6px; padding:3px 10px; border-radius:999px; font-size:0.78rem; font-weight:600;
    background:var(--sand-deep); border:1px solid var(--sand-line); color:var(--ink); transition:transform .15s ease, box-shadow .15s ease; cursor:default;}
  .ag-chip b{font-family:'Newsreader',Georgia,serif; font-weight:700; color:var(--gold-deep);}
  .ag-chip.clash{background:var(--gold-wash); border-color:var(--gold); color:var(--ink-warm);}
  .ag-chip:hover{transform:translateY(-1px); box-shadow:0 6px 12px -8px oklch(30% 0.04 60 / .5);}
  .ag-none{font-size:0.76rem; color:var(--grey);}
  .ag-none.all{color:var(--teal);}
  td.cell.ag-lit .house-sel select, td.cell.ag-lit .ro{box-shadow:inset 0 0 0 2px var(--teal);}
  .nm .ag-ok{display:inline-flex; align-items:center; justify-content:center; width:16px; height:16px; margin-left:8px; border-radius:50%;
    background:var(--teal); color:var(--paper); font-size:10px; font-weight:700; animation:ag-in .35s cubic-bezier(.3,1.5,.5,1) both;}
  .ag-count{font-size:0.78rem; color:var(--grey); margin-left:8px; font-family:'Karla',sans-serif; font-weight:500;}
  .ag-count b{color:var(--ink);}
  @keyframes ag-in{from{transform:scale(.4); opacity:0;}to{transform:none; opacity:1;}}
  @media(prefers-reduced-motion:reduce){ .ag-chip{transition:none;} .nm .ag-ok{animation:none;} }
  @media(max-width:560px){ .ag-map{grid-template-columns:1fr; gap:4px;} .ag-map .tp{margin-top:6px;} }
  @media print{ .ag-map, .ag-count{display:none;} }
```

## Appendix C: v2 JS (verbatim)
```js
/* ---- v2 (7 Oct 2026): the group's aims at a glance ------------------------
     Above each group's table, one line per TP: the main aims the group has
     chosen, as chips, two of the same in gold (the clash the note below
     already names), and how many have not chosen. Each row that has all six
     cells filled gets a quiet tick by the name. Display only; the cells, the
     saving and the release are untouched. Design: Magic Touches, 11a. */
  .ag-map{display:grid; grid-template-columns:auto minmax(0,1fr); gap:8px 14px; align-items:center; margin:14px 0 0; padding:12px 14px; background:var(--paper); border:1px solid var(--sand-line); border-radius:8px;}
  .ag-map .tp{font-family:'Newsreader',Georgia,serif; font-weight:700; font-size:0.95rem;}
  .ag-chips{display:flex; flex-wrap:wrap; gap:6px; align-items:center;}
  .ag-chip{display:inline-flex; align-items:center; gap:6px; padding:3px 10px; border-radius:999px; font-size:0.78rem; font-weight:600;
    background:var(--sand-deep); border:1px solid var(--sand-line); color:var(--ink); transition:transform .15s ease, box-shadow .15s ease; cursor:default;}
  .ag-chip b{font-family:'Newsreader',Georgia,serif; font-weight:700; color:var(--gold-deep);}
  .ag-chip.clash{background:var(--gold-wash); border-color:var(--gold); color:var(--ink-warm);}
  .ag-chip:hover{transform:translateY(-1px); box-shadow:0 6px 12px -8px oklch(30% 0.04 60 / .5);}
  .ag-none{font-size:0.76rem; color:var(--grey);}
  .ag-none.all{color:var(--teal);}
  td.cell.ag-lit .house-sel select, td.cell.ag-lit .ro{box-shadow:inset 0 0 0 2px var(--teal);}
  .nm .ag-ok{display:inline-flex; align-items:center; justify-content:center; width:16px; height:16px; margin-left:8px; border-radius:50%;
    background:var(--teal); color:var(--paper); font-size:10px; font-weight:700; animation:ag-in .35s cubic-bezier(.3,1.5,.5,1) both;}
  .ag-count{font-size:0.78rem; color:var(--grey); margin-left:8px; font-family:'Karla',sans-serif; font-weight:500;}
  .ag-count b{color:var(--ink);}
  @keyframes ag-in{from{transform:scale(.4); opacity:0;}to{transform:none; opacity:1;}}
  @media(prefers-reduced-motion:reduce){ .ag-chip{transition:none;} .nm .ag-ok{animation:none;} }
  @media(max-width:560px){ .ag-map{grid-template-columns:1fr; gap:4px;} .ag-map .tp{margin-top:6px;} }
  @media print{ .ag-map, .ag-count{display:none;} }
</style>
<link rel="stylesheet" href="hub-house.css?v=202610072111">
</head>
<body class="hub-grid hub-paper hub-course">
<div class="board">
  <a class="back" id="back" href="index.html">&larr; Back</a>
  <div id="app"></div>
</div>
<script src="hub-due.js?v=202610072111">
```
