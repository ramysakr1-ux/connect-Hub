# Grades report: the report's readiness, complete build spec

Repo: `ramysakr1-ux/connect-Hub` @ `main`, read 7 Oct 2026 18:36Z.
Design: `Magic Touches.dc.html`, 10a. Drop-in: `13_grades_report.html` in this folder.

Screen only, display only:
- **Unchanged:** `paint*()`, `DATA`, saving, `buildPrintable()`, Copy all, per-section copy, "Copy this profile", the Appian field order, and every key.
- **Print:** none of this prints.
- **Colours:** the grade selects' own (`.fail` brick, `.set` teal, `.top` gold-deep, `.out` grey).

Sections 1–5 cover the edits, the three touches and the tests. The appendices hold the exact code, copied verbatim from the drop-in. Where the two differ, the appendix wins.

## 1. What changes (two edits)

1. A CSS block goes before `</style>`, including an `@property --gr-p` so the ring animates.
2. An IIFE goes at the end of the `text/x-hub-app` script, after the boot IIFE.

There are no markup or `paint` changes.

**When it re-applies:**
- A `MutationObserver` on `#jump`, `#cohort` and `#cands` (childList), ignoring its own `gr-*` nodes.
- 200ms after any `input` or `change` (capture).
- Any click on `[data-add]` or `[data-remove]`.

## 2. What counts as "written" (`parts(p)`)

| Part | Counted when | Present when |
|---|---|---|
| Provisional grade | `d.provisional` | always |
| Each of `SECTIONS` (the six strengths and areas lists) | at least one item with text | always |
| `EVIDENCE` | text | `wantsEvidence(p, d.provisional)` is true |
| Final grade | `d.final` | always |
| Each of `FIELDS` (update, and the evidence provided) | text | only once `d.final` is set |
| Hours attended | `d.hoursAttended` | always |

**Overall comment:** not counted, because it's optional.

**Totals:** 9 parts before a final grade; 11 or 12 after one, depending on whether `EVIDENCE` is required.

## 3. The jump bar: readiness rings

**Ring.** Each `a[href^="#c"]` gets `span.gr-ring`, absolutely positioned at `inset:-4px`.
- A conic gradient, `var(--gr-c)` up to `--gr-p`%, then `oklch(91% 0.012 82)`, masked to a 3px ring.
- `--gr-p` = written ÷ total × 100. It animates over .6s, because it is registered with `@property`.
- **Ring colour:** `--gold` while the trainee has no final grade. Teal once they have one (`a.done`, which the page already sets), or when the profile is complete.

**Complete (`a.gr-full`).** The letter fills `--teal` with `--paper` text.

**Tooltip.** `title` and `aria-label` read: "{name} · {ok} of {total} written · still to write: Planning: Strengths, Final grade, …", or "· ready".

**Count line.** The existing "n of N final grades" gains " · **x of N** profiles complete".

**Focus-visible:** 2px `--gold-lifted` outline, offset 5 (outside the ring).

## 4. The cohort's spread (`.gr-wrap`, in each `.gt` after `p.sc`)

**Bar (`.gr-spread`).** Flex, gap 2, 8px tall, margin 0 20 12, radius 4. `role="img"`, with an aria-label listing the counts.

**Segments.** Each `i` has `flex-grow` = its count, a minimum width of 6px, and animates over .5s. They run in this order:

| Segment | Colour |
|---|---|
| fail | `--brick` |
| set | `--teal` |
| top | `--gold-deep` |
| out | `--grey` |
| not set | the track colour |

Each grade is classified by the page's own `gradeClass(g)`, so the split grades ("FAIL / PASS", "PASS / PASS B", "PASS B / PASS A") count as `set`, exactly as their selects are coloured.

**Key (`.gr-key`).** 0.72rem `--grey`. One entry per non-empty tone: an 8px swatch, the count in bold `--ink`, then the words.

| | Words |
|---|---|
| fail | "Fail" |
| set (provisional) | "Pass to Pass B" |
| set (final) | "Pass / Pass B" |
| top | "Pass A" |
| out | "Withdrawn / extension / deferral" |
| not set | "n not set" |

**Rebuild:** only when the HTML changes, so there's no flicker.

## 5. Each trainee's head (`.chead .gr-head`)

**The move (`.gr-move`).** Shown when the provisional is one of the seven grades and the final is one of the four.

| Direction | Rule | Look | Note |
|---|---|---|---|
| up | final rank > provisional rank | `--gold-wash`, `--amber-edge`, `--gold-deep` | "↑ the evidence sections say why" |
| down | final rank < provisional rank | brick 8% on paper, brick 35% edge, `--brick` | "↓ the update says why" |
| same | equal ranks | no fill, `--sand-line` edge, `--teal` | none |

- **Ranks:** provisional = its index in `FAIL…PASS A` (0–6); final = FAIL 0, PASS 2, PASS B 4, PASS A 6. So "PASS B / PASS A" (5) → "PASS A" (6) counts as up, and "PASS / PASS B" (3) → "PASS" (2) counts as down.
- **Outcomes** (withdrawn, extension, deferral): no move shown.
- **Pill style:** radius 999, padding 4 11, 0.78rem 700. The provisional is shown at weight 500 and opacity .8, then →, then the final.

**What's left (`.gr-left`).** 0.76rem `--grey`: "**n** of N still to write", or "Every part written".

**Print:** all `gr-*` hidden.

## 6. Test

1. **Empty cohort:** every ring is empty and gold. The spread bars are one grey "N not set". There are no move pills.
2. **Setting a provisional:** the ring grows. The provisional spread gains a segment, coloured like the select.
3. **Writing a strength:** that trainee's ring grows within 200ms.
4. **Setting a final above the provisional:** the ring turns teal and its total rises (FIELDS now count), and the gold "↑ the evidence sections say why" pill appears. A final below the provisional shows the brick "↓" pill.
5. **Filling every part:** the letter fills teal, and "profiles complete" counts it.
6. **Hovering a letter:** the tooltip lists what's still to write.
7. **Withdrawn:** no move pill, and the spread counts it as grey.
8. **Read-only (assessor):** the same display.
9. **Print, Copy all and Copy this profile:** unchanged, with nothing from v2.
10. **Reduced motion:** no ring or bar animation.

---

## Appendix A: existing jump, cohort and head rules (verbatim, `main`)
```css
  /* ---- the sticky letter bar: one tap to any trainee ---- */
  .jump{position:sticky; top:0; z-index:20; display:flex; align-items:center; gap:6px; flex-wrap:wrap;
    padding:10px 0; margin:18px 0 0; background:color-mix(in oklab, var(--sand) 92%, transparent); backdrop-filter:blur(6px);}
  .jump a{display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; border-radius:50%;
    font-family:'Instrument Sans',sans-serif; font-size:11px; font-weight:600; letter-spacing:.04em;
    color:var(--ink); background:var(--card); border:1px solid var(--sand-line); text-decoration:none;}
  .jump a:hover{border-color:var(--grey); color:var(--ink);} /* hue-free: hover lifts the contrast, never the colour */
  .jump a.done{border-color:var(--teal); color:var(--teal);}
  .jump .count{margin-left:6px; font-size:0.78rem; color:var(--grey);}

  /* ---- the cohort: two grade tables, side by side ---- */
  .cohort{display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-top:18px;}
  @media(max-width:860px){ .cohort{grid-template-columns:1fr;} }
  /* Paper, as the rest of Lite. The beige fills this shape arrived with read
     as washed-out beside the other screens (Ramy, 25 Sep 2026); the colour
     is the left edge, gold for the provisional table, teal for the final. */
  .gt{background:var(--surface); border-radius:10px; border-left:5px solid var(--gold); overflow:hidden;}
  .gt.fin{border-left-color:var(--teal);}
  /* the course-level four: same card, and its sections sit inside it rather
     than on a trainee, so they get the card's padding */
  .gt.course-gt{border-left-color:var(--teal-deep); padding-bottom:6px;}
  .gt.course-gt .sec{padding:0 20px 14px;}
  .gt.course-gt .sec:last-child{padding-bottom:18px;}
  .gt h2{margin:0; padding:15px 20px 3px; font-family:'Newsreader',Georgia,serif; font-size:1.1rem; font-weight:700;}
  .gt p.sc{margin:0; padding:0 20px 12px; font-size:0.76rem; color:var(--grey); line-height:1.5;}
  .gt table{width:100%; border-collapse:collapse; font-size:0.86rem;}
  .gt td{padding:7px 20px; border-top:1px solid var(--row-line); vertical-align:middle;}
  .gt td.l{width:1%; white-space:nowrap; font-family:'Instrument Sans',sans-serif; font-size:11px; font-weight:600; color:var(--grey);}
  .gt td.n{font-weight:600;}
  .gt td.n .wd{font-weight:400; color:var(--grey); font-style:italic; font-size:0.78rem; margin-left:6px;}
  .gt td.s{width:46%;}
  select.grade{width:100%; font-family:'Karla',sans-serif; font-size:0.84rem; font-weight:700; color:var(--ink);
    padding:7px 10px; border:1.5px solid var(--sand-line); border-radius:6px; background:var(--box); cursor:pointer;}
  select.grade.set{color:var(--teal); border-color:color-mix(in oklab, var(--teal) 45%, transparent);}
  select.grade.fail{color:var(--brick); border-color:color-mix(in oklab, var(--brick) 45%, transparent);}
  select.grade.top{color:var(--gold-deep); border-color:color-mix(in oklab, var(--gold-deep) 50%, transparent);}
  select.grade.out{color:var(--grey); font-style:italic; border-color:var(--sand-line);}
  select.grade:disabled{opacity:1; cursor:default;}

  .cand{background:var(--surface); border-radius:10px; border-left:5px solid var(--gold); margin-top:22px; scroll-margin-top:64px;}
  .chead{display:flex; align-items:flex-end; justify-content:space-between; gap:16px; flex-wrap:wrap;
    padding:18px 24px 14px; border-bottom:1px solid var(--sand-line);}
  .chead h2{margin:0; font-family:'Newsreader',Georgia,serif; font-size:1.35rem; font-weight:600;}
  .chead .ltr{font-family:'Instrument Sans',sans-serif; font-size:12px; font-weight:600; letter-spacing:.16em; color:var(--grey); margin-right:10px;}
  .chead .cap{font-size:0.8rem; color:var(--brick); line-height:1.5;}
```

## Appendix B: v2 CSS (verbatim)
```css
  /* ---- v2 (7 Oct 2026): the report's readiness -------------------------------
     Screen only. Each letter in the jump bar carries a ring for how much of
     that trainee's profile is written; each grade table carries the cohort's
     spread; each trainee's head says when the final moved off the provisional,
     because that is when the evidence sections must say why. The colours are
     the grade selects' own. Print, Copy all and Appian copying are untouched.
     Design: Magic Touches, 10a. */
  .jump a{position:relative; overflow:visible;}
  .jump a .gr-ring{position:absolute; inset:-4px; border-radius:50%; pointer-events:none;
    background:conic-gradient(var(--gr-c, var(--gold)) calc(var(--gr-p, 0) * 1%), oklch(91% 0.012 82) 0);
    -webkit-mask:radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px)); mask:radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px));
    transition:--gr-p .6s cubic-bezier(.2,.7,.2,1);}
  .jump a.done .gr-ring{--gr-c:var(--teal);}
  .jump a.gr-full .gr-ring{--gr-c:var(--teal);}
  .jump a.gr-full{background:var(--teal); border-color:var(--teal); color:var(--paper);}
  .jump a:focus-visible{outline:2px solid var(--gold-lifted); outline-offset:5px;}
  .jump .count b{color:var(--ink); font-weight:700;}
  @property --gr-p{syntax:'<number>'; inherits:true; initial-value:0;}

  .gr-spread{display:flex; height:8px; margin:0 20px 12px; border-radius:4px; overflow:hidden; background:oklch(91% 0.012 82); gap:2px;}
  .gr-spread i{display:block; height:100%; min-width:6px; transition:flex-grow .5s cubic-bezier(.2,.7,.2,1);}
  .gr-spread .fail{background:var(--brick);}
  .gr-spread .set{background:var(--teal);}
  .gr-spread .top{background:var(--gold-deep);}
  .gr-spread .out{background:var(--grey);}
  .gr-spread .none{background:oklch(91% 0.012 82);}
  .gr-key{display:flex; flex-wrap:wrap; gap:4px 12px; margin:-6px 20px 12px; font-size:0.72rem; color:var(--grey);}
  .gr-key span{display:inline-flex; align-items:center; gap:5px;}
  .gr-key span i{width:8px; height:8px; border-radius:2px;}
  .gr-key b{color:var(--ink); font-weight:700;}

  .gr-move{display:inline-flex; align-items:center; gap:8px; padding:4px 11px; border-radius:999px; font-size:0.78rem; font-weight:700; white-space:nowrap;
    background:var(--gold-wash); border:1px solid var(--amber-edge); color:var(--gold-deep);}
  .gr-move.down{background:color-mix(in oklab, var(--brick) 8%, var(--paper)); border-color:color-mix(in oklab, var(--brick) 35%, transparent); color:var(--brick);}
  .gr-move.same{background:none; border-color:var(--sand-line); color:var(--teal);}
  .gr-move s{text-decoration:none; font-weight:500; opacity:.8;}
  .gr-move small{font-weight:500; color:var(--grey);}
  .gr-left{display:block; margin-top:4px; font-size:0.76rem; color:var(--grey);}
  .gr-left b{color:var(--ink);}
  @media(prefers-reduced-motion:reduce){ .jump a .gr-ring, .gr-spread i{transition:none;} }
  @media print{ .gr-spread, .gr-key, .gr-move, .gr-left{display:none !important;} }
```

## Appendix C: v2 JS (verbatim)
```js
/* ---- v2 (7 Oct 2026): the report's readiness -------------------------------
     Screen only. Each letter in the jump bar carries a ring for how much of
     that trainee's profile is written; each grade table carries the cohort's
     spread; each trainee's head says when the final moved off the provisional,
     because that is when the evidence sections must say why. The colours are
     the grade selects' own. Print, Copy all and Appian copying are untouched.
     Design: Magic Touches, 10a. */
  .jump a{position:relative; overflow:visible;}
  .jump a .gr-ring{position:absolute; inset:-4px; border-radius:50%; pointer-events:none;
    background:conic-gradient(var(--gr-c, var(--gold)) calc(var(--gr-p, 0) * 1%), oklch(91% 0.012 82) 0);
    -webkit-mask:radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px)); mask:radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px));
    transition:--gr-p .6s cubic-bezier(.2,.7,.2,1);}
  .jump a.done .gr-ring{--gr-c:var(--teal);}
  .jump a.gr-full .gr-ring{--gr-c:var(--teal);}
  .jump a.gr-full{background:var(--teal); border-color:var(--teal); color:var(--paper);}
  .jump a:focus-visible{outline:2px solid var(--gold-lifted); outline-offset:5px;}
  .jump .count b{color:var(--ink); font-weight:700;}
  @property --gr-p{syntax:'<number>'; inherits:true; initial-value:0;}

  .gr-spread{display:flex; height:8px; margin:0 20px 12px; border-radius:4px; overflow:hidden; background:oklch(91% 0.012 82); gap:2px;}
  .gr-spread i{display:block; height:100%; min-width:6px; transition:flex-grow .5s cubic-bezier(.2,.7,.2,1);}
  .gr-spread .fail{background:var(--brick);}
  .gr-spread .set{background:var(--teal);}
  .gr-spread .top{background:var(--gold-deep);}
  .gr-spread .out{background:var(--grey);}
  .gr-spread .none{background:oklch(91% 0.012 82);}
  .gr-key{display:flex; flex-wrap:wrap; gap:4px 12px; margin:-6px 20px 12px; font-size:0.72rem; color:var(--grey);}
  .gr-key span{display:inline-flex; align-items:center; gap:5px;}
  .gr-key span i{width:8px; height:8px; border-radius:2px;}
  .gr-key b{color:var(--ink); font-weight:700;}

  .gr-move{display:inline-flex; align-items:center; gap:8px; padding:4px 11px; border-radius:999px; font-size:0.78rem; font-weight:700; white-space:nowrap;
    background:var(--gold-wash); border:1px solid var(--amber-edge); color:var(--gold-deep);}
  .gr-move.down{background:color-mix(in oklab, var(--brick) 8%, var(--paper)); border-color:color-mix(in oklab, var(--brick) 35%, transparent); color:var(--brick);}
  .gr-move.same{background:none; border-color:var(--sand-line); color:var(--teal);}
  .gr-move s{text-decoration:none; font-weight:500; opacity:.8;}
  .gr-move small{font-weight:500; color:var(--grey);}
  .gr-left{display:block; margin-top:4px; font-size:0.76rem; color:var(--grey);}
  .gr-left b{color:var(--ink);}
  @media(prefers-reduced-motion:reduce){ .jump a .gr-ring, .gr-spread i{transition:none;} }
  @media print{ .gr-spread, .gr-key, .gr-move, .gr-left{display:none !important;} }
</style>
<link rel="stylesheet" href="hub-house.css?v=202610072111">
</head>
<body>
<div class="board">
  <a class="back" href="5_tutor_dashboard.html">&larr; Tutor dashboard</a>

  <div class="chrome">
    <div class="lockup">
      <span class="tile">
        <svg viewBox="8 30 104 60" width="20" height="12" fill="none" class="wordmark-spin">
          <path d="M56.1 42.2 A 24 24 0 1 0 56.1 77.8" stroke="var(--gold-lifted)" stroke-width="13" stroke-linecap="round"></path>
          <path d="M96.1 42.2 A 24 24 0 1 0 96.1 77.8" stroke="var(--paper)" stroke-width="13" stroke-linecap="round"></path>
        </svg>
      </span>
      <span class="hub-pair"><span class="word">Connect</span><span class="hub-word">Lite</span></span>
    </div>
    <div class="role" id="roleLabel">Tutor</div>
  </div>

  <div class="title">
    <div>
      <h1>Grades report</h1>
      <p id="courseMeta">Provisional and final grades for every trainee on the course.</p>
    </div>
    <div class="titleacts">
      <button class="btn" id="saveBtn" type="button">Save</button>
      <span id="saveState">Saved</span>
      <button class="btn" id="copyAll" type="button">Copy all</button>
      <!-- Where these grades are going. Filled in from the course's own
           Appian address (Course admin -> Settings) and hidden until one is
           set, because a dead link is worse than none. It opens in its own
           tab so the grades stay open behind it -- the whole point is to copy
           from here and paste there. Shown to the ASSESSOR too: the final
           grades are theirs to file, and read-only has never meant they
           cannot copy. -->
      <a class="btn" id="appianLink" href="#" target="_blank" rel="noopener" hidden>Open Appian</a>
      <button class="btn-print" id="printBtn" type="button">Print / Save as PDF</button>
    </div>
  </div>

  <div class="jump" id="jump"></div>
  <div class="course" id="course"></div>
  <div class="cohort" id="cohort"></div>
  <div id="cands"></div>

  <!-- Every trainee, read-only, built only when Print is pressed. The screen
       edits one trainee at a time in textareas and selects, which is right for
       working and wrong for paper: what a centre keeps is the whole cohort as a
       document. -->
  <div id="printAll"></div>

</div>

<script src="hub-tracker.js?v=202610072111">
```
