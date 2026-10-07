# Observation wording: what differs, field by field, complete build spec

Repo: `ramysakr1-ux/connect-Hub` @ `main`, read 7 Oct 2026 19:00Z.
Design: `Magic Touches.dc.html`, 13a. Drop-in: `19_observation_wording.html` in this folder.

Display only:
- **Unchanged:** `renderList()` and its "· edited" mark, `renderEditor()`, Save wording (`#saveOne`, still explicit), Back to the centre's sheet (`#resetOne`), the Word import and review, and `persist`.
- **Storage:** nothing new is stored.

Sections 1–6 cover the edits, the comparison, the tags, the original text, the Save button and the tests. The appendices hold the exact code, copied verbatim from the drop-in. Where the two differ, the appendix wins.

## 1. What changes (two edits)

1. A CSS block goes before `</style>`.
2. An IIFE goes after the final `renderList(); renderEditor();`.

**When it re-applies:**
- On every `input` in `#editor`.
- After every `renderEditor()`, via a `MutationObserver` on `#editor` (childList).
- Switching task clears the open "original" panels.

## 2. The comparison

| Field | Element | Default (`DEFAULTS`) | Saved (`DATA`) | Normalised |
|---|---|---|---|---|
| Title, Recording line, Subtitle, Brief | `[data-f=title/recording/sub/brief]` | `t[k]` | `t[k]` | `trim()` |
| Questions / focus | `[data-f=rows]` | `t.rows.join('\n')` | same | split on lines, trim each, drop empties, rejoin |
| Part title | `[data-p][data-pf=title]` | `t.parts[i].title` | same | `trim()` |
| Part lines | `[data-p][data-pf=lines]` | `t.parts[i].lines.join('\n')` | same | as rows |

The normalisation matches exactly what Save does to each field, so stray spaces or blank lines never count as a change.

- **Changed:** the typed value ≠ the default. A task with no default (imported, new) counts every field as changed.
- **Unsaved:** the typed value ≠ the saved record.
- **Parts:** a part reports changed or unsaved if either its title or its lines do. Its tags sit once, on the part.

## 3. Tags (`.wd-tags`)

**Placement.**
- Fields: appended inside the section's `h4`.
- Parts: absolutely positioned top-right of `.part`. Static above the part on phones (≤600px).

| Tag | Spec |
|---|---|
| `.wd-chg` "Changed" | 0.66rem 700, ls .08em, uppercase, padding 2/8, radius 999, `--gold-wash`, 1px `--amber-edge`, `--gold-deep` |
| `.wd-uns` "not saved" | 0.7rem 600 `--teal`, with a 6px `--teal` dot before it |
| `.wd-see` | "See the original" or "Hide the original", 0.72rem 600 `--teal`, underlined on hover, gold focus ring, `aria-expanded`. Only shown when changed. |

**Changed sections.** A changed field's `.section` takes a `--gold-deep` left edge, deepening the house `--gold`.

## 4. The original (`.wd-orig`)

**When.** Shown under the field or part when it's changed and toggled open.

**Style.** Margin-top 8, padding 9/12, `--paper`, 1px dashed `--sand-line`, radius 6. 0.82rem, line-height 1.55, `--ink-warm`, `white-space:pre-line`.

**Content.**
- A label "The centre's sheet": 0.66rem, uppercase, `--grey`.
- Then the default text, escaped. For a part, that's its title, then its lines.
- If the default is empty: "Empty on the centre's sheet." in italic `--grey`.

**Behaviour.** Read-only; nothing copies it back. "Back to the centre's sheet" remains the way to revert.

## 5. Save button

- **Label:** "Save wording (n changes)" while n fields are unsaved. It goes back to "Save wording" when there are none.
- **Ring:** `box-shadow:0 0 0 3px oklch(70% 0.12 72 / .55)` while there are unsaved fields, with a .2s transition.

**Reduced motion:** no transition.

**Print:** n/a (screen only).

## 6. Test

1. **An untouched task:** no tags, and Save reads "Save wording".
2. **Editing the title:**
   - "Changed" and "not saved" appear, the section edge deepens, and Save reads "Save wording (1 change)" with a ring.
   - Saving: the re-render shows "Changed" only, and the list shows "· edited" as before.
3. **"See the original":** the shipped title shows beneath, and "Hide the original" closes it.
4. **Typing the original wording back exactly:** "Changed" disappears. Adding a trailing space or a blank line in Questions doesn't count.
5. **Parts task:** editing part B's lines tags part B once, top-right. "See the original" shows B's title and lines.
6. **Back to the centre's sheet:** after the confirm, all tags clear.
7. **Switching task:** open originals close.
8. **375px:** part tags sit above the part.

---

## Appendix A: existing editor rules (verbatim, `main`)
```css
  .editor{background:var(--card); border-radius:10px; padding:24px 28px;}
  .editor h2{font-family:'Newsreader',Georgia,serif; font-size:1.25rem; margin:0 0 2px;}
  .notice{font-size:0.8rem; color:var(--grey); margin:0 0 18px; line-height:1.5;}
  .section{border:1.5px solid var(--sand-line); border-left:5px solid var(--gold); border-radius:8px; padding:16px 18px; margin-bottom:14px; background:var(--surface);}
  .section h4{margin:0 0 6px; font-size:0.72rem; letter-spacing:.06em; text-transform:uppercase; color:var(--grey);}
  .section .hint{font-size:0.78rem; color:var(--grey); margin:0 0 8px; line-height:1.5;}
  input[type=text], textarea{width:100%; font-family:'Karla',sans-serif; font-size:0.88rem; line-height:1.5; padding:8px 10px;
    border:1.5px solid var(--sand-line); border-radius:6px; background:var(--box); color:var(--ink); resize:vertical;}
  input[type=text]:focus, textarea:focus{outline:none; border-color:var(--teal);}
  .part{margin-bottom:12px;}
  .part .letter{font-family:'Newsreader',Georgia,serif; font-weight:700; margin-right:8px;}
  .part input{margin-bottom:6px;}
  .fixed{font-size:0.8rem; color:var(--grey); background:var(--box); border-radius:6px; padding:8px 10px; margin:0 0 14px;}
  .actions{display:flex; justify-content:space-between; align-items:center; margin-top:20px; gap:12px; flex-wrap:wrap;}
  .btn{font-family:'Karla',sans-serif; font-size:0.85rem; font-weight:700; padding:10px 20px; border-radius:var(--r-control);
    border:1.5px solid var(--teal); background:var(--teal); color:var(--paper); cursor:pointer;}
  .btn:not(.secondary):hover{background:var(--teal-lifted); border-color:var(--teal-lifted);}
  .btn.secondary{background:none; color:var(--teal);}
  .saved{font-size:0.8rem; color:var(--grey);}
```

## Appendix B: v2 CSS (verbatim)
```css
  /* ---- v2 (7 Oct 2026): what differs, field by field --------------------------
     The list already says a task is "edited"; now each field says it. A field
     whose text differs from the centre's sheet carries a gold "Changed" tag and
     a "See the original" toggle that shows the shipped wording beneath it, read
     only. A field typed in but not yet saved carries a quiet "not saved" mark,
     and the Save button counts them. Display only; Save, Back to the centre's
     sheet and the import are untouched. Design: Magic Touches, 13a. */
  .section h4, .part{position:relative;}
  .wd-tags{display:inline-flex; gap:8px; align-items:center; margin-left:10px; vertical-align:1px; text-transform:none; letter-spacing:0;}
  .wd-chg{font-size:0.66rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; padding:2px 8px; border-radius:999px; background:var(--gold-wash); border:1px solid var(--amber-edge); color:var(--gold-deep);}
  .wd-uns{display:inline-flex; align-items:center; gap:5px; font-size:0.7rem; font-weight:600; color:var(--teal);}
  .wd-uns::before{content:''; width:6px; height:6px; border-radius:50%; background:var(--teal);}
  .wd-see{font:inherit; font-size:0.72rem; font-weight:600; color:var(--teal); background:none; border:0; padding:0; cursor:pointer;}
  .wd-see:hover{text-decoration:underline; text-underline-offset:3px;}
  .wd-see:focus-visible{outline:2px solid var(--gold-lifted); outline-offset:2px;}
  .wd-orig{margin:8px 0 0; padding:9px 12px; background:var(--paper); border:1px dashed var(--sand-line); border-radius:6px; font-size:0.82rem; line-height:1.55; color:var(--ink-warm); white-space:pre-line;}
  .wd-orig b{display:block; font-size:0.66rem; letter-spacing:.08em; text-transform:uppercase; color:var(--grey); margin-bottom:3px;}
  .wd-orig.none{color:var(--grey); font-style:italic;}
  .section.wd-changed{border-left-color:var(--gold-deep);}
  .part .wd-tags{position:absolute; right:0; top:2px; margin:0;}
  #saveOne{transition:box-shadow .2s ease;}
  #saveOne.wd-dirty{box-shadow:0 0 0 3px oklch(70% 0.12 72 / .55);}
  @media(prefers-reduced-motion:reduce){ #saveOne{transition:none;} }
  @media(max-width:600px){ .part .wd-tags{position:static; margin:0 0 4px;} }
```

## Appendix C: v2 JS (verbatim)
```js
/* ---- v2 (7 Oct 2026): what differs, field by field --------------------------
     The list already says a task is "edited"; now each field says it. A field
     whose text differs from the centre's sheet carries a gold "Changed" tag and
     a "See the original" toggle that shows the shipped wording beneath it, read
     only. A field typed in but not yet saved carries a quiet "not saved" mark,
     and the Save button counts them. Display only; Save, Back to the centre's
     sheet and the import are untouched. Design: Magic Touches, 13a. */
  .section h4, .part{position:relative;}
  .wd-tags{display:inline-flex; gap:8px; align-items:center; margin-left:10px; vertical-align:1px; text-transform:none; letter-spacing:0;}
  .wd-chg{font-size:0.66rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; padding:2px 8px; border-radius:999px; background:var(--gold-wash); border:1px solid var(--amber-edge); color:var(--gold-deep);}
  .wd-uns{display:inline-flex; align-items:center; gap:5px; font-size:0.7rem; font-weight:600; color:var(--teal);}
  .wd-uns::before{content:''; width:6px; height:6px; border-radius:50%; background:var(--teal);}
  .wd-see{font:inherit; font-size:0.72rem; font-weight:600; color:var(--teal); background:none; border:0; padding:0; cursor:pointer;}
  .wd-see:hover{text-decoration:underline; text-underline-offset:3px;}
  .wd-see:focus-visible{outline:2px solid var(--gold-lifted); outline-offset:2px;}
  .wd-orig{margin:8px 0 0; padding:9px 12px; background:var(--paper); border:1px dashed var(--sand-line); border-radius:6px; font-size:0.82rem; line-height:1.55; color:var(--ink-warm); white-space:pre-line;}
  .wd-orig b{display:block; font-size:0.66rem; letter-spacing:.08em; text-transform:uppercase; color:var(--grey); margin-bottom:3px;}
  .wd-orig.none{color:var(--grey); font-style:italic;}
  .section.wd-changed{border-left-color:var(--gold-deep);}
  .part .wd-tags{position:absolute; right:0; top:2px; margin:0;}
  #saveOne{transition:box-shadow .2s ease;}
  #saveOne.wd-dirty{box-shadow:0 0 0 3px oklch(70% 0.12 72 / .55);}
  @media(prefers-reduced-motion:reduce){ #saveOne{transition:none;} }
  @media(max-width:600px){ .part .wd-tags{position:static; margin:0 0 4px;} }
</style>
<link rel="stylesheet" href="hub-house.css?v=202610072156">
</head>
<body class="hub-paper">
<div class="board">
  <a class="back" href="6_centre_admin_dashboard.html">← Back to course admin</a>
  <p class="eyebrow">Course admin · observation tasks</p>
  <h1>Observation task wording</h1>
  <p class="sub">The words are yours: retitle a task, rewrite a question, change the brief. The shape of each sheet — a grid for three teachers, one notes column, lettered parts — stays, because that is what the trainee fills in and what prints.</p>
  <!-- Ramy, 27 Sep 2026: "should there be an option for them to just upload
       their own observation tasks and push into whatever we built here?"
       A Word or text file, read in the browser, sorted into the six shapes
       by its layout, shown for review, and only then saved. A first draft
       to check, not a promise: another centre's file has its own quirks. -->
  <div class="importrow">
    <span>Import from a file:</span>
    <select id="importGroup"><option value="peer">Peer observations</option><option value="filmed">Filmed lessons</option><option value="live">Live observation of experienced teachers</option></select>
    <button type="button" class="btn secondary" id="importBtn">⬆ Choose a Word or text file</button>
    <input type="file" id="importFile" accept=".docx,.txt,.md" style="display:none;">
    <span class="note">Reads your own sheets — numbered questions become rows, lettered A/B/C headings become parts, tick-boxes become tick lists, a table to fill in stays a table, “Before the lesson” and “After watching” are kept — and shows what it found before anything is replaced. A live sheet is one file: it replaces the demonstration class with the same number, or joins the group. Check every task afterwards; a file it has never seen is a first draft.</span>
  </div>
  <div class="layout">
    <nav class="list" id="list"></nav>
    <div class="editor" id="editor"></div>
  </div>
</div>
<script src="observation-defaults.js?v=202610072156">
```
