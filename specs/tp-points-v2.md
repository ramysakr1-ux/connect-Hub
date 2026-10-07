# TP points: the families, visible, complete build spec

Repo: `ramysakr1-ux/connect-Hub` @ `main` (tree `20d1c6f74b50`), read 7 Oct 2026 18:45Z.
Design: `Magic Touches.dc.html`, 11b. Drop-in: `24_tp_points.html` in this folder.

Display only:
- **Unchanged:** `build()`, the rotation (`window.hubRotation`), the selects' change handler and `persist`, the materials panel, release, and every warning or note (9.1.2, same type on the same day, early repeats, after not to standard, families not met).
- **Views:** tutor view only. The trainee's day view has no `select[data-t]`, so nothing applies there.

Sections 1–6 cover the edits, the four touches and the tests. The appendices hold the exact code, copied verbatim from the drop-in. Where the two differ, the appendix wins.

## 1. What changes (two edits)

1. A CSS block goes before `</style>`.
2. An IIFE goes at the end of the `text/x-hub-app` script. It exits if `R.familyOf` is missing.

**When it re-applies:**
- A `MutationObserver` on `#app` (childList).
- `change` on any `select[data-tp][data-t]` (capture), so the edge and pips follow at once.

**Family.** `R.familyOf(select.value)`, the page's own: `language`, `receptive` or `productive`, or empty.

## 2. Family edge on each select

| Class | Left edge (4px) |
|---|---|
| `.fm` (every rotation select) | `--sand-line`, padding-left 6px, transitions .2s |
| `.fm-language` | `--gold-deep`. It matches the page's existing `.tbl .lang` gold. |
| `.fm-receptive` | `--teal` |
| `.fm-productive` | `--ink-warm` |

The select's `title` is the family's name.

**Print:** the edge drops back to 1px.

## 3. Family pips under each trainee

- **Placement:** `td.who` gains `.fm-pips`: flex, gap 3, margin-top 5. It sits under the letter and name.
- **Pips:** three `i`, each 16×5 with radius 3, in the order language, receptive, productive.
  - Not met: `oklch(91% 0.012 82)`.
  - Met (`.on`): the family colour, faded in over .3s.
- **Counting:** a family is met if any TP 1…`TPS` select for that trainee is in it. This is the same window `familiesNotMet` uses, so the pips agree with the "Not met by TP n" note.
- **Tooltip:** `title` reads "Language focus", or "… — not met yet".
- **Print:** hidden.

## 4. Key

- **Placement:** inserted once per group, before the rotation table's `.wrap`, so it sits under the release bar.
- **Style:** 0.74rem `--grey`. Each family has a 4×14px swatch, followed by "Under each name: the families met by TP {TPS}."
- **Print:** hidden.

## 5. Same-day ring

- **On focus** of a rotation select, every other select in the same group and TP column gets `td.fm-col`: `box-shadow:0 0 0 2px oklch(70% 0.12 72 / .45)`. Any with the same value as the focused one get `.fm-same`, a 2px `--gold` ring.
- **On blur:** cleared.
- **Scope:** the ring is a reading aid only. `R.clashes` and its warning remain the rule, and they are per teaching set. The ring covers the whole column, so a gold ring across sets is a cue to look, not an error.

**Reduced motion:** no transitions.

## 6. Test

1. **Tutor view after "Build":** every select has a family edge. Each trainee shows pips, and missing families are grey.
2. **Changing a TP 3 select from Grammar to Speaking:** the edge turns ink-warm at once. If that was the trainee's only language lesson, the language pip goes grey; after the save re-render, the 9.1.2 warning appears as before.
3. **The pips and the "Not met by TP n" note agree** for every trainee.
4. **Focusing a TP 2 select:** the TP 2 column rings, and same-type cells ring gold. Blurring clears it.
5. **Opening Materials:** the panel is unchanged. After re-render, the edges and pips re-apply.
6. **Trainee's day view:** no change.
7. **≤700px stacked table:** edges and pips still show, and the key wraps.
8. **Print:** no key or pips, with 1px edges.

---

## Appendix A: existing table rules (verbatim, `main`)
```css
  .tbl{width:100%; border-collapse:collapse; font-size:0.8rem; background:var(--paper); border:1px solid var(--sand-line); border-radius:8px; overflow:hidden;}
  .tbl th,.tbl td{border:1px solid var(--sand-line); padding:6px 8px; text-align:left; vertical-align:top;}
  .tbl th{background:var(--box); font-size:0.7rem; letter-spacing:.06em; text-transform:uppercase; color:var(--grey);}
  .tbl td.who{white-space:nowrap; font-weight:700;}
  .tbl td.who small{display:block; font-weight:500; color:var(--grey); font-size:0.72rem;}
  .tbl select{font-family:inherit; font-size:0.76rem; width:100%; padding:3px 4px; border:1px solid var(--sand-line); border-radius:5px; background:var(--paper); color:var(--ink);}
  .tbl .lang{color:var(--gold-deep); font-weight:700;}
  .tbl .ref{color:var(--grey); font-style:italic;}
  .tbl tr.mine{background:var(--sand-deep);}
```

## Appendix B: v2 CSS (verbatim)
```css
  /* ---- v2 (7 Oct 2026): the families, visible ------------------------------
     The rotation is about three families (language focus, receptive skills,
     productive skills) and the notes below the table talk in them, but the
     table showed only the type. Each select now carries its family as a left
     edge, each trainee three pips for the families they have met in TP 1 to
     TPS, and the group a one-line key. Focusing a select rings the others in
     that TP column, so the same-day check can be read by eye. Display only;
     the rotation, the warnings and saving are untouched. Design: Magic
     Touches, 11b. */
  .tbl select.fm{border-left:4px solid var(--sand-line); padding-left:6px; transition:border-color .2s ease, box-shadow .15s ease;}
  .tbl select.fm-language{border-left-color:var(--gold-deep);}
  .tbl select.fm-receptive{border-left-color:var(--teal);}
  .tbl select.fm-productive{border-left-color:var(--ink-warm);}
  .tbl td.fm-col select{box-shadow:0 0 0 2px oklch(70% 0.12 72 / .45);}
  .tbl td.fm-col select.fm-same{box-shadow:0 0 0 2px var(--gold);}
  .fm-pips{display:flex; gap:3px; margin-top:5px;}
  .fm-pips i{width:16px; height:5px; border-radius:3px; background:oklch(91% 0.012 82); transition:background-color .3s ease;}
  .fm-pips i.on.language{background:var(--gold-deep);} .fm-pips i.on.receptive{background:var(--teal);} .fm-pips i.on.productive{background:var(--ink-warm);}
  .fm-key{display:flex; flex-wrap:wrap; gap:4px 16px; margin:6px 0 10px; font-size:0.74rem; color:var(--grey);}
  .fm-key span{display:inline-flex; align-items:center; gap:6px;}
  .fm-key i{width:4px; height:14px; border-radius:2px;}
  @media(prefers-reduced-motion:reduce){ .tbl select.fm, .fm-pips i{transition:none;} }
  @media print{ .fm-key, .fm-pips{display:none;} .tbl select.fm{border-left-width:1px;} }
```

## Appendix C: v2 JS (verbatim)
```js
/* ---- v2 (7 Oct 2026): the families, visible ------------------------------
     The rotation is about three families (language focus, receptive skills,
     productive skills) and the notes below the table talk in them, but the
     table showed only the type. Each select now carries its family as a left
     edge, each trainee three pips for the families they have met in TP 1 to
     TPS, and the group a one-line key. Focusing a select rings the others in
     that TP column, so the same-day check can be read by eye. Display only;
     the rotation, the warnings and saving are untouched. Design: Magic
     Touches, 11b. */
  .tbl select.fm{border-left:4px solid var(--sand-line); padding-left:6px; transition:border-color .2s ease, box-shadow .15s ease;}
  .tbl select.fm-language{border-left-color:var(--gold-deep);}
  .tbl select.fm-receptive{border-left-color:var(--teal);}
  .tbl select.fm-productive{border-left-color:var(--ink-warm);}
  .tbl td.fm-col select{box-shadow:0 0 0 2px oklch(70% 0.12 72 / .45);}
  .tbl td.fm-col select.fm-same{box-shadow:0 0 0 2px var(--gold);}
  .fm-pips{display:flex; gap:3px; margin-top:5px;}
  .fm-pips i{width:16px; height:5px; border-radius:3px; background:oklch(91% 0.012 82); transition:background-color .3s ease;}
  .fm-pips i.on.language{background:var(--gold-deep);} .fm-pips i.on.receptive{background:var(--teal);} .fm-pips i.on.productive{background:var(--ink-warm);}
  .fm-key{display:flex; flex-wrap:wrap; gap:4px 16px; margin:6px 0 10px; font-size:0.74rem; color:var(--grey);}
  .fm-key span{display:inline-flex; align-items:center; gap:6px;}
  .fm-key i{width:4px; height:14px; border-radius:2px;}
  @media(prefers-reduced-motion:reduce){ .tbl select.fm, .fm-pips i{transition:none;} }
  @media print{ .fm-key, .fm-pips{display:none;} .tbl select.fm{border-left-width:1px;} }
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
