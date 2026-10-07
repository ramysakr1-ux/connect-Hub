# Assignment wording: what is yours, and what is not saved, complete build spec

Repo: `ramysakr1-ux/connect-Hub` @ `main`, read 7 Oct 2026 19:00Z.
Design: `Magic Touches.dc.html`, 13b, under 13a (the observation wording editor, same language). Drop-in: `8_assignment_wording.html` in this folder.

Display only:
- **Unchanged:** `renderList()`, `renderEditor()`, every `update*` function, `persist()` / "Save assignment", the release switch and due date that save at once, the order arrows, the syllabus-criteria check and replace, and the prose banner.
- **Storage:** nothing new is stored.

Sections 1–5 cover the edits, the comparisons, the list, the editor and the tests. The appendices hold the exact code, copied verbatim from the drop-in. Where the two differ, the appendix wins.

## 1. What changes (two edits)

1. A CSS block goes before `</style>`.
2. An IIFE goes after the final `renderList(); renderEditor(); renderProseBanner();`.

**When it re-applies** (debounced to 120ms):
- `input`, `change` and `click` in `#editor`.
- A click in `#list`.
- `MutationObserver`s on `#editor` (subtree) and `#list`, ignoring its own `aw-*` nodes.

## 2. The three comparisons

| Question | Compared | Notes |
|---|---|---|
| Is this assignment's wording edited? | `DATA[k]` vs `DEFAULT_DATA[k]` | `dueAt` and `released` are removed first, because they're course settings. Criteria strings are normalised to `{text, sectionIndex:null}`, as the page does on load. `_order` lives at the top level and is never compared. |
| Is this section changed? | `JSON(DATA[CURRENT].sections[i])` vs every shipped section's JSON | A section is "as shipped" if an identical section exists anywhere in the default, so reordering alone doesn't mark a section changed. A section with no default is always changed. |
| Is anything unsaved? | `DATA[CURRENT]` vs the saved record (`localStorage[STORE_KEY][CURRENT]`, or `DEFAULT_DATA` when nothing is saved yet) | Both sides are criteria-normalised, so an old record with string criteria doesn't read as unsaved. |

## 3. The list

Each `button[data-a]` whose wording is edited gains `span.aw-ed` "· edited": weight 500, 0.72rem, `--gold-deep`. On the active (teal) button it's `oklch(88% 0.06 80)`, for contrast.

This is the same mark the observation wording list already uses.

## 4. The editor

**Changed sections.**
- `.section.aw-changed` gets a left edge of `--gold-deep` (the house `--gold`, deepened).
- `.section-head` gains `span.aw-chg` "Changed": 0.64rem 700, ls .08em, uppercase, padding 2/8, radius 999, `--gold-wash`, 1px `--amber-edge`, `--gold-deep`. Its `title` reads "Differs from Connect's shipped wording".

**Unsaved state.**
- The Save button (`.actions .btn`) reads "Save assignment — not saved yet" and gets a 3px ring of `oklch(70% 0.12 72 / .55)` (.2s).
- `span.aw-state` "Changes not saved" (0.8rem 600 `--teal`, with a 7px teal dot before it) goes after `#savedNote`.
- After Save, both clear. The page's own "Saved" flash still shows.

**Reduced motion:** no transition.

## 5. Test

1. **First open, nothing saved:** no "edited" marks, no tags, and Save reads plainly.
2. **Typing in LRT's instructions:**
   - The section is tagged "Changed" with a deeper edge.
   - Save reads "— not saved yet", with the ring and "Changes not saved".
   - Clicking Save clears the unsaved state; "Changed" stays, and the list reads "LRT · edited".
3. **Moving a section up:** no "Changed" tag (the content is identical to a shipped section). Save shows unsaved until it's saved.
4. **Adding a field:** that section is "Changed" and the assignment is unsaved.
5. **Flipping the release switch or setting a due date:** these save at once, there's no "edited" mark, and nothing is unsaved.
6. **Replace with the syllabus's criteria:** unsaved until it's saved. Sections are unaffected.
7. **Switching assignment:** the marks are recomputed for the new one.

---

## Appendix A: existing list and section rules (verbatim, `main`)
```css
  .list button{display:block; width:100%; text-align:left; background:none; border:none; border-radius:8px;
    padding:12px 14px; font-family:'Karla',sans-serif; font-size:0.88rem; font-weight:600; color:var(--ink); cursor:pointer;}
  .list button.active{background:var(--teal); color:var(--paper);}
  .list button:not(.active):hover{background:var(--sand);}
  .list button.missing{color:var(--grey); font-weight:500;}
  .section{border:1.5px solid var(--sand-line); border-left:5px solid var(--gold); border-radius:8px; padding:16px 18px; margin-bottom:14px; background:var(--surface);}
  .section-head{display:flex; align-items:center; gap:8px; margin-bottom:10px;}
```

## Appendix B: v2 CSS (verbatim)
```css
  /* ---- v2 (7 Oct 2026): what is yours, and what is not saved ------------------
     The same language as the observation wording editor (13a). In the list, an
     assignment whose wording differs from Connect's shipped version says
     "edited". In the editor, a section that matches no section of the shipped
     version carries a gold "Changed" tag, and while anything typed has not
     been saved the Save button says so and wears a gold ring. Display only;
     Save, the switches that save at once, ordering and the syllabus check are
     untouched. Design: Magic Touches, 13b. */
  .list button .aw-ed{font-weight:500; font-size:0.72rem; color:var(--gold-deep); margin-left:4px;}
  .list button.active .aw-ed{color:oklch(88% 0.06 80);}
  .aw-chg{flex:none; font-family:'Karla',sans-serif; font-size:0.64rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; padding:2px 8px; border-radius:999px;
    background:var(--gold-wash); border:1px solid var(--amber-edge); color:var(--gold-deep); white-space:nowrap;}
  .section.aw-changed{border-left-color:var(--gold-deep);}
  .aw-state{display:inline-flex; align-items:center; gap:6px; font-size:0.8rem; font-weight:600; color:var(--teal);}
  .aw-state::before{content:''; width:7px; height:7px; border-radius:50%; background:var(--teal);}
  .actions .btn.aw-dirty{box-shadow:0 0 0 3px oklch(70% 0.12 72 / .55);}
  .actions .btn{transition:box-shadow .2s ease;}
  .aw-title-tag{margin-left:10px; vertical-align:2px;}
  @media(prefers-reduced-motion:reduce){ .actions .btn{transition:none;} }
```

## Appendix C: v2 JS (verbatim)
```js
/* ---- v2 (7 Oct 2026): what is yours, and what is not saved ------------------
     The same language as the observation wording editor (13a). In the list, an
     assignment whose wording differs from Connect's shipped version says
     "edited". In the editor, a section that matches no section of the shipped
     version carries a gold "Changed" tag, and while anything typed has not
     been saved the Save button says so and wears a gold ring. Display only;
     Save, the switches that save at once, ordering and the syllabus check are
     untouched. Design: Magic Touches, 13b. */
  .list button .aw-ed{font-weight:500; font-size:0.72rem; color:var(--gold-deep); margin-left:4px;}
  .list button.active .aw-ed{color:oklch(88% 0.06 80);}
  .aw-chg{flex:none; font-family:'Karla',sans-serif; font-size:0.64rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; padding:2px 8px; border-radius:999px;
    background:var(--gold-wash); border:1px solid var(--amber-edge); color:var(--gold-deep); white-space:nowrap;}
  .section.aw-changed{border-left-color:var(--gold-deep);}
  .aw-state{display:inline-flex; align-items:center; gap:6px; font-size:0.8rem; font-weight:600; color:var(--teal);}
  .aw-state::before{content:''; width:7px; height:7px; border-radius:50%; background:var(--teal);}
  .actions .btn.aw-dirty{box-shadow:0 0 0 3px oklch(70% 0.12 72 / .55);}
  .actions .btn{transition:box-shadow .2s ease;}
  .aw-title-tag{margin-left:10px; vertical-align:2px;}
  @media(prefers-reduced-motion:reduce){ .actions .btn{transition:none;} }
</style>
<link rel="stylesheet" href="hub-house.css?v=202610072156">
</head>
<body class="hub-paper">
<div class="board">
  <a class="back" href="6_centre_admin_dashboard.html">← Back to course admin</a>
  <div class="header" style="background:var(--surface); border-radius:6px; margin-bottom:22px;"><p class="eyebrow">Course admin · assignment wording</p><h1>Edit assignment</h1>
  <p class="sub">Rework this assignment as your own: rewrite instructions, add or remove sections, reorder them, and — for tasks with a pick-your-item step like LRT — edit the item choices trainees choose from. Changes only affect your centre.</p>
  </div>
  <div class="banner" id="proseBanner"></div>
  <div class="layout">
    <div class="list" id="list"></div>
    <div class="editor" id="editor"></div>
  </div>
</div>
<script src="assignment-defaults.js?v=202610072156">
```
