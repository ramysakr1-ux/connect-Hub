# Self-evaluation: complete build spec

Repo: `ramysakr1-ux/connect-Hub` @ `main`, read 7 Oct 2026.
Design: `Magic Touches.dc.html`, 5a. Drop-in: `2_trainee_self_evaluation.html` in this folder.

Display only: nothing is stored, and the turn-in rule, the bring-in button, the record and the printout are unchanged. It is the same language as 2b and 3c (the feedback-writer and plan strips). Sections 1–5 cover every element, state, hover, focus, motion, phone and print rule, and the logic. The appendices hold the exact code, copied verbatim from the drop-in. Where the two differ, the appendix wins.

## What changes (four edits)

1. `<span class="sv5-env" id="sv5Env" hidden>` goes after `#turnInBtn` in the action bar's `.lhs`.
2. `<div class="sv5" id="sv5">` goes at the start of `.rhs`.
3. A CSS block goes before `</style>`.
4. An IIFE goes at the end of the app script.

---

## 1. The six steps (`#sv5`)

**Steps, in page order:**

| # | Label | Ticked when | Field |
|---|---|---|---|
| 1 | Went to plan | the field has text | `#sWell` |
| 2 | Didn't | the field has text | `#sNot` |
| 3 | Evidence | the field has text | `#sLearn` |
| 4 | Differently | the field has text | `#sDiff` |
| 5 | Action points | every carried point has its "What I did" written | `#apList` |
| 6 | Next TP | the field has text | `#sNext` |

**Step 5 on the first TP.** When `chub:tpHistory` is empty and no point is carried, there is nothing to answer, so step 5 counts as done.

**Step (`button`).**
- Inline-flex, gap 5, height 28, padding 0 9 0 5, radius 999.
- `--paper` fill, 1.5px `--sand-line` border.
- Karla 600 0.74rem, `--grey`.
- Transitions: transform .15s, border .15s, background and colour .2s.
- Inside: `i`, an 18px circle (`--box` fill, `--ink-warm` text, 10px 700) showing the number or "✓", then the label `span`.

| State | Spec |
|---|---|
| ticked (`.ok`) | border `oklch(78% 0.04 195)`, text `--teal-deep`, circle `--teal` with `--paper` text |
| hover | lifts 2px, border `--teal` |
| focus-visible | 2px `--gold-lifted` outline, offset 2 |

**Between steps:** `.sep`, an 8 × 1.5px `--sand-line` rule.

**Click.**
- Scrolls the step's card to 24px from the top (`window.scrollTo`, smooth; no `scrollIntoView`).
- Flashes the card with `.sv5-hit`: a 3px gold ring fading over 1.4s.
- Focuses the card's first field after 400ms.

**Ready.** When all six are ticked, `#turnInBtn` gets `.sv5-ready`: one gold pulse (0 → 12px from `oklch(70% 0.12 72 / .6)`, 1.6s). It is removed when the form stops being ready.

**Responsive:**
- ≤1000px: the labels and separators hide, leaving numbered circles only.
- ≤640px: the strip hides.

**Print:** hidden.

## 2. Carried action points (`#apList .ap-row`)

Every row is re-read on each repaint.

**Carried (`.sv5-carried`).** A row whose `.ap-prev` has text.
- Padding 12 12 12 10, radius 10, `--gold-wash` fill, inset 1.5px `--amber-edge` ring.
- The `.n` circle is `--gold-lifted`, with a small "★" (9px, `--gold-deep`) at its top right.
- The `.ap-did` border is `--gold`, which says "answer this".

**Answered (`.sv5-answered`).** Carried, and `.ap-did` has text.
- Fill `color-mix(--teal 6%, --paper)`, inset 1.5px `oklch(78% 0.04 195)` ring.
- The `.n` circle is `--teal` with `--paper` text, and the ★ is gone.
- The `.ap-did` border is `oklch(78% 0.04 195)`.

**Transitions:** background and box-shadow, .3s.

**Print:** no fill, no ring and no padding, so the record prints as before.

The bring-in button, the add and remove buttons, and the numbering are unchanged. A `MutationObserver` on `#apList` repaints when rows are added or removed.

## 3. The sealed feedback line (`#sv5Env`)

**Shown when:** `chub:feedback.status === 'returned'` with `docHTML`, and `chub:selfeval` is not yet `turned_in`. This is screen 4's reflect-first gate, said here.

**Text:** "{fTutor first name}’s feedback is waiting — turning this in opens it". Without a tutor name: "Your tutor’s feedback is waiting…".

| Element | Spec |
|---|---|
| Pill | inline-flex, gap 7, padding 6 12, radius 999, `--gold-wash` fill, 1.5px `--gold` border, Karla 700 0.78rem, `--ink-warm` |
| `b` | a 16px `--gold` dot (the envelope's seal), glowing with `sv5-glow`: 2.4s, a 0 → 6px ring |

While shown, the `.barhint` beside it is hidden (`.sv5-env + .barhint`), so the bar holds one sentence. When the line is hidden, the barhint shows as before.

**Print:** hidden.

## 4. Repaints

- `input`, `change`, `click` and `keyup` on the document (capture), debounced to 150ms.
- The `#apList` observer.
- At load, and again at 800ms.

## 5. Test

1. **A fresh self-evaluation on TP1:** steps 1–4 and 6 are unticked, step 5 is ticked (nothing to carry), and no envelope line shows.
2. **Writing in each field** ticks its step. Clicking a step scrolls to its card, flashes it and puts the cursor in it.
3. **TP2, bringing in last TP's points:**
   - Each carried row turns gold with a ★.
   - Writing what you did turns that row teal.
   - Step 5 ticks when every carried row is answered.
4. **All six done:** Turn in pulses once. Clearing a field and writing it again pulses again.
5. **Feedback returned and sealed:** the gold line replaces the barhint. After turning in, it's gone.
6. **Widths:** at 1000px the circles show only; at 640px the strip hides.
7. **Print:** no strip, no gold rows, and the record is unchanged.
8. **Reduced motion:** no lift, pulse, glow or flash.

---

## Appendix A: v5 CSS (verbatim)
```css
  /* ---- v5 (7 Oct 2026): the reflection's shape -----------------------------
     Six steps in the action bar, one per question, each a door to its card and
     ticked once written; the carried action points as gold cards that turn
     teal when answered; and, when the feedback is back and sealed, one line
     beside Turn in saying that this is what opens it. Display only.
     Design: Magic Touches, 5a. */
  .sv5{display:flex; align-items:center; gap:4px; font-family:'Karla',sans-serif;}
  .sv5 button{display:inline-flex; align-items:center; gap:5px; height:28px; padding:0 9px 0 5px; border-radius:999px; cursor:pointer;
    border:1.5px solid var(--sand-line); background:var(--paper); color:var(--grey); font:600 0.74rem 'Karla',sans-serif; transition:transform .15s ease, border-color .15s, background-color .2s, color .2s;}
  .sv5 button i{width:18px; height:18px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-style:normal; font-size:10px; font-weight:700; background:var(--box); color:var(--ink-warm);}
  .sv5 button.ok{border-color:oklch(78% 0.04 195); color:var(--teal-deep);}
  .sv5 button.ok i{background:var(--teal); color:var(--paper);}
  .sv5 button:hover{transform:translateY(-2px); border-color:var(--teal);}
  .sv5 button:focus-visible{outline:2px solid var(--gold-lifted); outline-offset:2px;}
  .sv5 .sep{width:8px; height:1.5px; background:var(--sand-line);}
  .card.sv5-hit{animation:sv5-hit 1.4s ease-out 1;}
  /* the carried points */
  .ap-row.sv5-carried{padding:12px 12px 12px 10px; border-radius:10px; background:var(--gold-wash); box-shadow:inset 0 0 0 1.5px var(--amber-edge); transition:background-color .3s, box-shadow .3s;}
  .ap-row.sv5-carried .n{background:var(--gold-lifted);}
  .ap-row.sv5-carried .n::after{content:'\2605'; position:absolute; font-size:9px; transform:translate(10px,-10px); color:var(--gold-deep);}
  .ap-row.sv5-carried .ap-did{border-color:var(--gold);}
  .ap-row.sv5-answered{background:color-mix(in oklab, var(--teal) 6%, var(--paper)); box-shadow:inset 0 0 0 1.5px oklch(78% 0.04 195);}
  .ap-row.sv5-answered .n{background:var(--teal); color:var(--paper);}
  .ap-row.sv5-answered .n::after{content:none;}
  .ap-row.sv5-answered .ap-did{border-color:oklch(78% 0.04 195);}
  .ap-row .n{position:relative;}
  /* the sealed feedback, beside Turn in */
  .sv5-env{display:inline-flex; align-items:center; gap:7px; padding:6px 12px; border-radius:999px; background:var(--gold-wash); border:1.5px solid var(--gold);
    font:700 0.78rem 'Karla',sans-serif; color:var(--ink-warm);}
  .sv5-env[hidden]{display:none;}
  .sv5-env b{width:16px; height:16px; border-radius:50%; background:var(--gold); display:inline-block; animation:sv5-glow 2.4s ease-in-out infinite;}
  .sv5-env + .barhint{display:none;}
  #turnInBtn.sv5-ready{animation:sv5-ready 1.6s ease-out 1;}
  @keyframes sv5-ready{0%{box-shadow:0 0 0 0 oklch(70% 0.12 72 / .6);}100%{box-shadow:0 0 0 12px oklch(70% 0.12 72 / 0);}}
  @keyframes sv5-glow{0%,100%{box-shadow:0 0 0 0 oklch(70% 0.12 72 / .5);}50%{box-shadow:0 0 0 6px oklch(70% 0.12 72 / 0);}}
  @keyframes sv5-hit{0%{box-shadow:0 0 0 3px oklch(70% 0.12 72 / .7);}100%{box-shadow:0 0 0 3px oklch(70% 0.12 72 / 0);}}
  @media(prefers-reduced-motion:reduce){ .sv5 button, .ap-row{transition:none;} .sv5-env b, #turnInBtn.sv5-ready, .card.sv5-hit{animation:none;} }
  @media(max-width:1000px){ .sv5 button span, .sv5 .sep{display:none;} .sv5 button{padding:0 5px;} }
  @media(max-width:640px){ .sv5{display:none;} }
  @media print{ .sv5, .sv5-env{display:none !important;} .ap-row.sv5-carried, .ap-row.sv5-answered{background:none; box-shadow:none; padding:0;} }
```

## Appendix B: v5 JS (verbatim)
```js
/* ---- v5 (7 Oct 2026): the reflection's shape -----------------------------
     Six steps in the action bar, one per question, each a door to its card and
     ticked once written; the carried action points as gold cards that turn
     teal when answered; and, when the feedback is back and sealed, one line
     beside Turn in saying that this is what opens it. Display only.
     Design: Magic Touches, 5a. */
  .sv5{display:flex; align-items:center; gap:4px; font-family:'Karla',sans-serif;}
  .sv5 button{display:inline-flex; align-items:center; gap:5px; height:28px; padding:0 9px 0 5px; border-radius:999px; cursor:pointer;
    border:1.5px solid var(--sand-line); background:var(--paper); color:var(--grey); font:600 0.74rem 'Karla',sans-serif; transition:transform .15s ease, border-color .15s, background-color .2s, color .2s;}
  .sv5 button i{width:18px; height:18px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-style:normal; font-size:10px; font-weight:700; background:var(--box); color:var(--ink-warm);}
  .sv5 button.ok{border-color:oklch(78% 0.04 195); color:var(--teal-deep);}
  .sv5 button.ok i{background:var(--teal); color:var(--paper);}
  .sv5 button:hover{transform:translateY(-2px); border-color:var(--teal);}
  .sv5 button:focus-visible{outline:2px solid var(--gold-lifted); outline-offset:2px;}
  .sv5 .sep{width:8px; height:1.5px; background:var(--sand-line);}
  .card.sv5-hit{animation:sv5-hit 1.4s ease-out 1;}
  /* the carried points */
  .ap-row.sv5-carried{padding:12px 12px 12px 10px; border-radius:10px; background:var(--gold-wash); box-shadow:inset 0 0 0 1.5px var(--amber-edge); transition:background-color .3s, box-shadow .3s;}
  .ap-row.sv5-carried .n{background:var(--gold-lifted);}
  .ap-row.sv5-carried .n::after{content:'\2605'; position:absolute; font-size:9px; transform:translate(10px,-10px); color:var(--gold-deep);}
  .ap-row.sv5-carried .ap-did{border-color:var(--gold);}
  .ap-row.sv5-answered{background:color-mix(in oklab, var(--teal) 6%, var(--paper)); box-shadow:inset 0 0 0 1.5px oklch(78% 0.04 195);}
  .ap-row.sv5-answered .n{background:var(--teal); color:var(--paper);}
  .ap-row.sv5-answered .n::after{content:none;}
  .ap-row.sv5-answered .ap-did{border-color:oklch(78% 0.04 195);}
  .ap-row .n{position:relative;}
  /* the sealed feedback, beside Turn in */
  .sv5-env{display:inline-flex; align-items:center; gap:7px; padding:6px 12px; border-radius:999px; background:var(--gold-wash); border:1.5px solid var(--gold);
    font:700 0.78rem 'Karla',sans-serif; color:var(--ink-warm);}
  .sv5-env[hidden]{display:none;}
  .sv5-env b{width:16px; height:16px; border-radius:50%; background:var(--gold); display:inline-block; animation:sv5-glow 2.4s ease-in-out infinite;}
  .sv5-env + .barhint{display:none;}
  #turnInBtn.sv5-ready{animation:sv5-ready 1.6s ease-out 1;}
  @keyframes sv5-ready{0%{box-shadow:0 0 0 0 oklch(70% 0.12 72 / .6);}100%{box-shadow:0 0 0 12px oklch(70% 0.12 72 / 0);}}
  @keyframes sv5-glow{0%,100%{box-shadow:0 0 0 0 oklch(70% 0.12 72 / .5);}50%{box-shadow:0 0 0 6px oklch(70% 0.12 72 / 0);}}
  @keyframes sv5-hit{0%{box-shadow:0 0 0 3px oklch(70% 0.12 72 / .7);}100%{box-shadow:0 0 0 3px oklch(70% 0.12 72 / 0);}}
  @media(prefers-reduced-motion:reduce){ .sv5 button, .ap-row{transition:none;} .sv5-env b, #turnInBtn.sv5-ready, .card.sv5-hit{animation:none;} }
  @media(max-width:1000px){ .sv5 button span, .sv5 .sep{display:none;} .sv5 button{padding:0 5px;} }
  @media(max-width:640px){ .sv5{display:none;} }
  @media print{ .sv5, .sv5-env{display:none !important;} .ap-row.sv5-carried, .ap-row.sv5-answered{background:none; box-shadow:none; padding:0;} }
</style>
<link rel="stylesheet" href="hub-house.css?v=202610072028">
</head>
<body>
<div class="board">
  <a class="back" href="index.html">&larr; Back</a>
<div class="header">
    <div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:14px;">
      <div class="hub-centre-logo" style="width:44px;height:44px;border-radius:7px;border:1.5px dashed var(--sand-line);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:9px;color:var(--grey);text-align:center;line-height:1.2;">Centre<br>logo</div>
      <input id="fCentreName" class="hub-centre-name" type="text" placeholder="Centre name" style="font-family:'Newsreader',Georgia,serif;font-size:18px;color:var(--teal);border:none;border-bottom:1px solid var(--sand-line);background:transparent;padding:2px 4px;text-align:center;min-width:220px;">
    </div>
    <h1>Self-evaluation</h1>
    <p class="sub">Fill this in after you have taught, and before your tutor writes their feedback.
    Your plan is pulled in automatically below so you can evaluate against what you actually planned.
    This saves itself as you go — click <strong>Turn in</strong> when you're ready for your tutor to
    see it.</p>
    <div class="turnstatus" id="turnStatus"></div>
    <p class="loaded" id="loadedInfo" style="text-align:center;margin:6px 0 0;font-size:0.86rem;color:var(--teal);font-weight:600;"></p>
  </div>

  <div class="card recall" id="recall" style="display:none;">
    <h2>What you planned</h2>
    <p class="meta" id="recallMeta"></p>
    <dl id="recallAims"></dl>
    <ul class="stages" id="recallStages"></ul>
  </div>

  <div class="card good">
    <h2>What went to plan?</h2>
    <textarea id="sWell" class="blt" rows="4" placeholder="Name one thing that worked — and how you knew it worked."></textarea>
  </div>

  <div class="card change">
    <h2>What didn't go as planned, and why?</h2>
    <textarea id="sNot" class="blt" rows="4" placeholder="Name one thing — and say why you think it happened."></textarea>
  </div>

  <div class="card">
    <h2>What evidence did you see that the learners had learnt?</h2>
    <p class="guide">Not whether they enjoyed it — what they could do by the end that they could not
    do at the start.</p>
    <textarea id="sLearn" class="blt" rows="4" placeholder="What could they do at the end that they could not do at the start?"></textarea>
  </div>

  <div class="card change">
    <h2>What would you do differently if you taught it again?</h2>
    <textarea id="sDiff" class="blt" rows="4" placeholder="One change, and what difference you think it would make."></textarea>
  </div>

  <div class="card next">
    <h2>Your action points from the last TP</h2>
    <p class="guide">Bring them in from the file your tutor returned last time — no typing, no copying —
    then say what you actually did about each one in this lesson.</p>
    <div id="apList"></div>
    <button class="btn btn-gold" id="prevBtn">Bring in last TP's action points</button>
    <button class="btn-add" type="button" id="addAP">+ Add another</button>
  </div>

  <div class="card next">
    <h2>What do you want to work on in the next TP?</h2>
    <p class="guide">Your own priorities, before you read your tutor's.</p>
    <textarea id="sNext" class="blt" rows="3" placeholder="One or two things, in your own words."></textarea>
  </div>

</div>

<div class="actionbar">
  <div class="lhs">
    <button class="btn-submit" id="turnInBtn">Turn in</button>
    <span class="sv5-env" id="sv5Env" hidden></span>
    <span class="barhint">Your tutor gets access to your self-evaluation. You won't be able to edit it until they reopen it for you.</span>
  </div>
  <div class="rhs">
    <div class="sv5" id="sv5" aria-live="polite"></div>
    <span class="status" id="status"></span>
    <button class="btn-print" type="button" id="pdfBtn">Print / Save as PDF</button>
  </div>
</div>

<script src="hub-due.js?v=202610072028">
```

## Appendix C: markup edits (verbatim)
```html
    <span class="sv5-env" id="sv5Env" hidden></span>
    <div class="sv5" id="sv5" aria-live="polite"></div>
```
