# Assignments and the lesson plan: complete build spec

Repo: `ramysakr1-ux/connect-Hub` @ `main`, read 7 Oct 2026.
Design: `Magic Touches.dc.html`, turn 3 (3a, 3b, 3c). Drop-ins in this folder:
- `9_assignment_submission.html`
- `10_tutor_assignment_marking.html`
- `1_trainee_plan_and_analysis.html`

All three changes are display only. No storage key is read differently, nothing new is written, and no rule changes (`wordCountOk`, `declOk`, `outcomeFor`, the turn-in gate). Sections 1–3 cover every element, state, hover, focus, motion, phone and print rule, and the logic. The appendices hold the exact code, copied verbatim from the drop-ins. Where the two differ, the appendix wins.

**Shared language.** These match 2b (the feedback writer strip):
- Karla for body text, Newsreader for numbers.
- `hub-tokens.css` colours. 3b also uses the page's `--mark-met-*` and `--mark-not-*` tokens from `hub-house.css`.
- A gold "ready" pulse is `0 0 0 0 → 0 0 0 12px` from `oklch(70% 0.12 72 / .6)` over 1.6s, played once.
- Reduced motion turns every animation and transition off.

---

## 1. Word meter (`9_assignment_submission.html`, 3a)

### What changes
- `#wcCounter` keeps its id and its place in `.header .meta`, beside the due pill.
- Both places that wrote its text, in `render()` and `refreshGate()`, now call `wcMeter(wc, a)`.
- `refreshGate()` also tracks `SUBMIT_WAS_OFF` and adds `.av3-ready` to `#submitBtn` on the one keystroke where it goes from disabled to enabled.
- A CSS block goes before `</style>`.

### `wcMeter(el, a)`
- **Count:** `n = countWords()` (unchanged). `lo = wordMin`, `hi = wordMax`.
- **Scale:** `top = max(hi × 1.15, n, 1)`. Every position is `min(100, v/top × 100)%`.
- **State:**

  | State | When | Text after the count |
  |---|---|---|
  | `under` | `n < lo` | "· N to go" |
  | `in` | `lo ≤ n ≤ hi` | "· in range" |
  | `over` | `n > hi` | "· N over" |

  The three states agree with `wordCountOk`.
- **Markup:** `.wm.{state}` (the span itself), `role="meter"` with aria value min, max, now and label. Inside it:
  - `.wm-track`, holding `.wm-band`, `.wm-fill` and `.wm-mark`.
  - `.wm-txt`, reading "**n** of lo–hi words · …".

### Styles

| Element | Spec |
|---|---|
| `.wm` | inline-flex, centred, gap 10, Karla 0.82rem, `--grey` |
| `.wm-track` | 180 × 8, radius 999, `--box` |
| `.wm-band` | absolute, 3px over the track top and bottom, radius 4. Fill `color-mix(--teal 14%)`, inset 1px ring `color-mix(--teal 35%)` |
| `.wm-fill` | from the left to `n`, radius 999, `--gold-lifted`. Transitions: width .35s `cubic-bezier(.2,.7,.2,1)`, colour .3s |
| `.wm-mark` | a 14px circle centred on `n`, `--paper`, 2.5px `--gold-deep` border, shadow `0 2px 4px oklch(30% 0.04 60 / .25)`. Transition: left .35s |
| `.wm-txt b` | Newsreader 1rem, `--ink` |
| under | text `--gold-deep` |
| in | fill `--teal`, mark border `--teal`, text `--teal-deep` |
| over | fill, mark and text (including the number) in `--brick` |
| `#submitBtn.av3-ready` | the gold pulse, once |
| ≤560px | wraps, gap 6, the track goes full width |
| print | the track is hidden and the text line prints |

---

## 2. Tally strip (`10_tutor_assignment_marking.html`, 3b)

### What changes
- The criteria card in `render()` gains `${mv2HTML(crit, marks)}` directly under its `h2`, above `deadlineWarn`. It uses the same `crit` and `marks` the rows below are drawn from.
- The function and a document-level click handler sit just above `outcomeFor`.
- A CSS block goes before `</style>`.

### Markup
- `.mv2` holds `.mv2-segs` and `p.mv2-n`.
- Each segment is `button.mv2-seg.{met|not|}` with `data-mv2=i`, showing `i+1`.
  - `title`: "{n}. {criterion text}"
  - `aria-label`: "Criterion n: Met / Not met / not yet marked"
- The counts read "**m** met · **k** not met · **r** to mark".

### Styles

| Element | Spec |
|---|---|
| `.mv2` | margin 4 0 16 |
| `.mv2-segs` | grid, `grid-auto-flow:column`, `grid-auto-columns:minmax(0,1fr)`, gap 4 |
| `.mv2-seg` | height 28, radius 6, Karla 700 11px, `--box` fill, 1.5px `--sand-line`, `--grey`. Transitions: transform .15s, background and border .2s |
| `.met` | `--mark-met-bg` / `--mark-met-line` / `--mark-met-text` (the toggle's own colours) |
| `.not` | `--mark-not-bg` / `--mark-not-line` / `--mark-not-text` |
| hover | lifts 2px |
| focus-visible | 2px `--teal` outline, offset 2 |
| `.mv2-n` | flex, gap 16, wraps, margin-top 10, 0.82rem `--grey` |
| `.mv2-n b` | Newsreader 1.05rem `--ink`, margin-right 3. Met in `--mark-met-text`, not met in `--mark-not-text` |
| print | hidden |

### Behaviour
- **Click:** finds `.crit-toggle[data-crit=i]` and its `.critrow`, then `window.scrollTo` to 80px above it (smooth; no `scrollIntoView`). The row gets `.mv2-hit` for 1.4s: a 3px gold ring and a `--gold-wash` background, both fading to nothing.
- **Updates:** the strip re-renders with the card on every toggle, because `render()` already repaints.
- **Never shown:** on an assignment with no criteria.

---

## 3. Plan shape (`1_trainee_plan_and_analysis.html`, 3c)

### What changes
- `<div class="pv2" id="pv2">` goes at the start of the action bar's `.rhs`.
- A CSS block goes before `</style>`.
- An IIFE goes at the end of the app script. It uses the page's own `rows()` and `procText()`.

### The six checks, in page order

| Label | Ticked when |
|---|---|
| Aims | `#fMain` has text |
| Problems | any field in `#probGrid` has text |
| Class | `#fProfile` has text |
| Materials | `#fMats` or `#fMatsLink` has text |
| Stages n/N | every row's `.t-proc` (through `procText`) has text, and there is at least one row |
| Time | `#total` reads "fits exactly" or "spare". If `#total.over`, the label becomes "Time over" in the brick state. |

### Stage dots
- One 9px square (radius 3) per row.
- Unwritten: `--box`.
- Written: the row's own `--hue`, which `paintRow` sets, so the dots match the spine. `--teal` if a row has no hue.
- Background transition .3s.

### Styles

| Element | Spec |
|---|---|
| `.pv2` | flex, gap 12, Karla 0.78rem, `--grey` |
| `.chk` | gap 10 |
| each check | an 8px ring (1.5px `--sand-line`) before the label |
| `.ok` | label `--teal-deep`, ring filled `--teal` |
| `.over` | label and ring `--brick` |
| `#turnInBtn.pv2-ready` | the gold pulse, once, when all six turn ticked |
| ≤1000px | only the dots and "Stages n/N" show |
| ≤640px | the strip hides |
| print | hidden |

### Repaints
- `input`, `change`, `click` and `keyup` on the document (capture), debounced to 150ms.
- A `MutationObserver` on `.board` (childList and subtree) catches rows added or removed and framework swaps.
- At load, and again at 800ms after draft restore.

---

## 4. Also in this round: "What worked" on the feedback envelope (1b)

This one is in `design_handoff_magic_touches/4_feedback_returned.html`. The opening panel now shows "What worked · N" (from `lSP` and `lST`, the first three, with "and N more…") beside "★ Carried into TP n" (starred `lAP` and `lAT`). Each point is shown with its criteria codes as small chips. The spec in that folder is updated with every value.

---

## 5. Test

1. **3a:**
   - Type into an FOL with a 750–1000 band: the marker moves, the line counts down "N to go", and the meter turns teal at 750 and brick past 1000.
   - Tick the declaration with writing in: Submit gives one gold pulse. Untick and re-tick: it pulses again.
2. **3a print:** the line prints, the track doesn't.
3. **3b:**
   - Mark criteria: segments recolour and the counts update.
   - Clicking segment 5 scrolls to criterion 5 and flashes it.
   - Resubmission marking shows the strip for round 2's marks.
4. **3c:**
   - On a fresh plan, everything is unticked and no stages are written.
   - Pick a framework: the dots appear grey. Write a stage: its dot takes the stage hue.
   - Go over the lesson length: "Time over" turns brick.
   - With all six done, Turn in pulses once.
5. **Widths:** 3c at 1000px shows only the dots and stages; at 640px it hides.
6. **Reduced motion:** no pulses, flashes or slides.

---

## Appendix A: `9_assignment_submission.html` v3 CSS (verbatim)
```css
  /* ---- v3 (7 Oct 2026): word meter + submit pulse ---- */
  .wm{display:inline-flex; align-items:center; gap:10px; font-family:'Karla',sans-serif; font-size:0.82rem; color:var(--grey);}
  .wm-track{position:relative; width:180px; height:8px; border-radius:999px; background:var(--box); overflow:visible;}
  .wm-band{position:absolute; top:-3px; bottom:-3px; border-radius:4px; background:color-mix(in oklab, var(--teal) 14%, transparent); box-shadow:inset 0 0 0 1px color-mix(in oklab, var(--teal) 35%, transparent);}
  .wm-fill{position:absolute; left:0; top:0; bottom:0; border-radius:999px; background:var(--gold-lifted); transition:width .35s cubic-bezier(.2,.7,.2,1), background-color .3s;}
  .wm-mark{position:absolute; top:50%; width:14px; height:14px; margin:-7px 0 0 -7px; border-radius:50%; background:var(--paper); border:2.5px solid var(--gold-deep);
    box-shadow:0 2px 4px oklch(30% 0.04 60 / .25); transition:left .35s cubic-bezier(.2,.7,.2,1), border-color .3s;}
  .wm-txt b{font-family:'Newsreader',Georgia,serif; font-size:1rem; color:var(--ink);}
  .wm.under .wm-txt{color:var(--gold-deep);}
  .wm.in .wm-fill{background:var(--teal);} .wm.in .wm-mark{border-color:var(--teal);} .wm.in .wm-txt{color:var(--teal-deep);}
  .wm.over .wm-fill{background:var(--brick);} .wm.over .wm-mark{border-color:var(--brick);} .wm.over .wm-txt, .wm.over .wm-txt b{color:var(--brick);}
  #submitBtn.av3-ready{animation:av3-ready 1.6s ease-out 1;}
  @keyframes av3-ready{0%{box-shadow:0 0 0 0 oklch(70% 0.12 72 / .6);}100%{box-shadow:0 0 0 12px oklch(70% 0.12 72 / 0);}}
  @media(prefers-reduced-motion:reduce){ .wm-fill, .wm-mark{transition:none;} #submitBtn.av3-ready{animation:none;} }
  @media(max-width:560px){ .wm{flex-wrap:wrap; gap:6px;} .wm-track{width:100%;} }
  @media print{ .wm-track{display:none;} }
```

## Appendix B: `9_assignment_submission.html` v3 JS (verbatim)
```js
/* ---- v3 (7 Oct 2026): the word meter ------------------------------------
   The counter as a track: the centre's band (wordMin to wordMax) drawn on
   it, the count as a fill and a marker. Same numbers, same words, same rule
   (wordCountOk); the colour says which side of the band you are on. */
let SUBMIT_WAS_OFF = true;
function wcMeter(el, a){
  const n = countWords(), lo = +a.wordMin || 0, hi = +a.wordMax || 0;
  const top = Math.max(hi * 1.15, n, 1), pc = v => Math.min(100, (v / top) * 100).toFixed(2) + '%';
  const state = n > hi && hi ? 'over' : n >= lo ? 'in' : 'under';
  el.className = 'wm ' + state;
  el.style.color = '';
  el.setAttribute('role', 'meter'); el.setAttribute('aria-valuemin', '0'); el.setAttribute('aria-valuemax', String(hi || lo)); el.setAttribute('aria-valuenow', String(n));
  el.setAttribute('aria-label', n + ' of ' + lo + '\u2013' + hi + ' words');
  el.innerHTML = '<span class="wm-track" aria-hidden="true"><span class="wm-band" style="left:' + pc(lo) + ';width:calc(' + pc(hi) + ' - ' + pc(lo) + ')"></span>'
    + '<span class="wm-fill" style="width:' + pc(n) + '"></span><span class="wm-mark" style="left:' + pc(n) + '"></span></span>'
    + '<span class="wm-txt"><b>' + n + '</b> of ' + lo + '\u2013' + hi + ' words'
    + (state === 'under' ? ' \u00b7 ' + (lo - n) + ' to go' : state === 'over' ? ' \u00b7 ' + (n - hi) + ' over' : ' \u00b7 in range') + '</span>';
}
```

Gate addition in `refreshGate()`:
```js
  /* v3: one gold pulse the moment Submit becomes pressable (7 Oct 2026) */
  if (btn) { if (!btn.disabled && SUBMIT_WAS_OFF) { btn.classList.remove('av3-ready'); void btn.offsetWidth; btn.classList.add('av3-ready'); } SUBMIT_WAS_OFF = btn.disabled; }
```

## Appendix C: `10_tutor_assignment_marking.html` v3 CSS (verbatim)
```css
  /* ---- v3 (7 Oct 2026): the tally strip ---- */
  .mv2{margin:4px 0 16px;}
  .mv2-segs{display:grid; grid-auto-flow:column; grid-auto-columns:minmax(0,1fr); gap:4px;}
  .mv2-seg{height:28px; padding:0; border-radius:6px; cursor:pointer; font:700 11px 'Karla',sans-serif;
    background:var(--box); border:1.5px solid var(--sand-line); color:var(--grey); transition:transform .15s ease, background-color .2s, border-color .2s;}
  .mv2-seg.met{background:var(--mark-met-bg); border-color:var(--mark-met-line); color:var(--mark-met-text);}
  .mv2-seg.not{background:var(--mark-not-bg); border-color:var(--mark-not-line); color:var(--mark-not-text);}
  .mv2-seg:hover{transform:translateY(-2px);}
  .mv2-seg:focus-visible{outline:2px solid var(--teal); outline-offset:2px;}
  .mv2-n{display:flex; gap:16px; flex-wrap:wrap; margin:10px 0 0; font-size:0.82rem; color:var(--grey);}
  .mv2-n b{font-family:'Newsreader',Georgia,serif; font-size:1.05rem; color:var(--ink); margin-right:3px;}
  .mv2-n .met b{color:var(--mark-met-text);} .mv2-n .not b{color:var(--mark-not-text);}
  .critrow.mv2-hit{animation:mv2-hit 1.4s ease-out 1; border-radius:8px;}
  @keyframes mv2-hit{0%{box-shadow:0 0 0 3px oklch(70% 0.12 72 / .7); background:var(--gold-wash);}100%{box-shadow:0 0 0 3px oklch(70% 0.12 72 / 0); background:transparent;}}
  @media(prefers-reduced-motion:reduce){ .mv2-seg{transition:none;} .critrow.mv2-hit{animation:none;} }
  @media print{ .mv2{display:none;} }
```

## Appendix D: `10_tutor_assignment_marking.html` v3 JS (verbatim)
```js
/* ---- v3 (7 Oct 2026): the tally strip ---- */
  .mv2{margin:4px 0 16px;}
  .mv2-segs{display:grid; grid-auto-flow:column; grid-auto-columns:minmax(0,1fr); gap:4px;}
  .mv2-seg{height:28px; padding:0; border-radius:6px; cursor:pointer; font:700 11px 'Karla',sans-serif;
    background:var(--box); border:1.5px solid var(--sand-line); color:var(--grey); transition:transform .15s ease, background-color .2s, border-color .2s;}
  .mv2-seg.met{background:var(--mark-met-bg); border-color:var(--mark-met-line); color:var(--mark-met-text);}
  .mv2-seg.not{background:var(--mark-not-bg); border-color:var(--mark-not-line); color:var(--mark-not-text);}
  .mv2-seg:hover{transform:translateY(-2px);}
  .mv2-seg:focus-visible{outline:2px solid var(--teal); outline-offset:2px;}
  .mv2-n{display:flex; gap:16px; flex-wrap:wrap; margin:10px 0 0; font-size:0.82rem; color:var(--grey);}
  .mv2-n b{font-family:'Newsreader',Georgia,serif; font-size:1.05rem; color:var(--ink); margin-right:3px;}
  .mv2-n .met b{color:var(--mark-met-text);} .mv2-n .not b{color:var(--mark-not-text);}
  .critrow.mv2-hit{animation:mv2-hit 1.4s ease-out 1; border-radius:8px;}
  @keyframes mv2-hit{0%{box-shadow:0 0 0 3px oklch(70% 0.12 72 / .7); background:var(--gold-wash);}100%{box-shadow:0 0 0 3px oklch(70% 0.12 72 / 0); background:transparent;}}
  @media(prefers-reduced-motion:reduce){ .mv2-seg{transition:none;} .critrow.mv2-hit{animation:none;} }
  @media print{ .mv2{display:none;} }
</style>
<link rel="stylesheet" href="hub-house.css?v=202610072021">
</head>
<body class="hub-assign hub-paper">
<div class="board">
  <a class="back" href="5_tutor_dashboard.html">&#8592; Back to dashboard</a>
<div class="picker" id="picker"></div>
  <div id="app"></div>
</div>
<script src="assignment-defaults.js?v=202610072021"></script>
<script src="hub-exchange.js?v=202610072021"></script>
<script src="hub-due.js?v=202610072021"></script>
<script src="hub-shared.js?v=202610072021"></script>
<script src="hub-store.js?v=202610072021"></script>
<script src="hub-say.js?v=202610072021"></script>
<script src="hub-sync.js?v=202610072021"></script>
<script type="text/x-hub-app">
/* Whose room this is -- see hubTutorRoomOnly in hub-shared.js. A trainee or an
   assessor who reached this page got the whole editable feedback form, grade
   dropdown and all (walk, 22 Sep 2026). */
if (window.hubTutorRoomOnly && hubTutorRoomOnly())
  throw new Error('Connect Lite: stopping this page on purpose \u2014 the tutors\u2019 room is not open to this link.');

const WORDING_KEY = 'connect_assignment_wording_v2';
const SUB_KEY = 'connect_assignment_submissions_v1';
let ORDER = ['fol','lrt','lsrt','lfc','a5']; // replaced by the centre's order once the wording is read
const NAMES = { lrt:'LRT', lsrt:'LSRT', fol:'FOL', lfc:'LFC', a5:'Assignment 5' };
const $ = id => document.getElementById(id);
function esc(s){ return (s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function nl2br(s){ return esc(s).replace(/\n/g,'<br>'); }

let WORDING = null;
try { WORDING = JSON.parse(localStorage.getItem(WORDING_KEY)); } catch(e) {}
// Nothing saved in this browser: the centre's standard wording (assignment-defaults.js).
if (!WORDING && window.CONNECT_HUB_DEFAULT_WORDING) WORDING = JSON.parse(JSON.stringify(window.CONNECT_HUB_DEFAULT_WORDING));
if (WORDING) { Object.keys(WORDING).forEach(k => {
  const a = WORDING[k]; if (!a || !a.criteria) return;
  a.criteria = a.criteria.map(c => typeof c === 'string' ? {text:c, sectionIndex:null} : c);
}); }
ORDER = hubAssignmentOrder(WORDING);

const ROSTER_KEY = 'connect_roster_v1';
function loadRoster(){ try{ return JSON.parse(localStorage.getItem(ROSTER_KEY)) || {trainees:{}}; }catch(e){ return {trainees:{}}; } }
function saveRoster(r){ localStorage.setItem(ROSTER_KEY, JSON.stringify(r)); }

const params = new URLSearchParams(location.search);
/* No assignment named: open the first one in the CENTRE's order, not a
   hard-coded one. This read defaulted to 'lrt', so the trainee home's
   "Written assignments" door landed on the second assignment however the
   centre had ordered them (trainee walk, 21 Sep 2026). */
let CURRENT = params.get('a') || (hubAssignmentOrder(WORDING).filter(k => k !== 'a5')[0] || 'fol');
const TRAINEE_ID = params.get('trainee') || '';
let OUTCOME = '';

/* Every door into this screen -- the dashboard's rows and the tracker's
   actions -- carries ?trainee=. Reached without one (a stale bookmark, a
   hand-typed URL), it used to fall through to connect_assignment_submissions_v1,
   which is a TRAINEE's own key and means nothing in a tutor's browser: an empty
   mark sheet, headed with the assignment's real name, that a tutor could type
   marks into for nobody. Found walking the tutor role, 21 Sep 2026. A mark
   sheet needs to know whose work it is. */
let SUBS = null;
if (TRAINEE_ID) {
  const roster = loadRoster();
  const tr = roster.trainees[TRAINEE_ID];
  SUBS = (tr && tr.assignments) || {};
} else {
  try { SUBS = JSON.parse(localStorage.getItem(SUB_KEY)); } catch(e) {}
}
if (!SUBS) SUBS = {};

/* Giving ONE trainee more time.
 *
 * The deadline belongs to the assignment and to everybody on the course. An
 * extension belongs to one person, so it is written into that trainee's own
 * tracker record -- TUTOR_ONLY in hub-sync, which is what stops a trainee
 * granting themselves one -- and hub-due only ever lets it ADD time.
 *
 * Offered whether or not the deadline has passed: a tutor who knows on Tuesday
 * that someone is in hospital should not have to wait until Friday night for
 * the button to appear (24 Sep 2026). */
function extKey(sub){
  return 'a:' + CURRENT + (sub && sub.stage === 'resubmission_needed' ? ':resub' : '');
}
function extensionsOf(){
  if (!TRAINEE_ID) return {};
  const tr = loadRoster().trainees[TRAINEE_ID];
  return (tr && tr.tracker && tr.tracker.extensions) || {};
}
function setExtension(sub, iso){
  if (!TRAINEE_ID) return;
  const roster = loadRoster();
  const tr = roster.trainees[TRAINEE_ID] || (roster.trainees[TRAINEE_ID] = { id:TRAINEE_ID, name:'Trainee', tp:{}, assignments:{} });
  tr.tracker = tr.tracker || {};
  tr.tracker.extensions = tr.tracker.extensions || {};
  if (iso) tr.tracker.extensions[extKey(sub)] = iso; else delete tr.tracker.extensions[extKey(sub)];
  saveRoster(roster);
  render();
}
function baseDue(a, sub){
  return sub && sub.stage === 'resubmission_needed'
    ? HubDue.windowFrom(sub.marked1At || sub.returnedAt, a && a.resubDays)
    : (a && a.dueAt) || '';
}
function dueRowHTML(a, sub){
  if (!TRAINEE_ID) return '';                       // nobody to extend
  const mine = HubDue.forPerson(baseDue(a, sub), extensionsOf()[extKey(sub)]);
  const st = HubDue.state(mine.iso);
  const isResub = sub.stage === 'resubmission_needed';
  const settled = sub.stage === 'submitted' || sub.stage === 'resubmitted' || sub.stage === 'closed';
  if (!st.has && settled) return '';
  const line = !st.has
    ? (isResub ? 'No resubmission window set for this assignment.' : 'No deadline set for this assignment.')
    : (st.past ? (isResub ? 'Resubmission closed ' : 'Closed ') + esc(st.due)
               : 'Due ' + esc(st.due) + ' \u00b7 ' + esc(st.text))
      + (mine.extended ? ' \u2014 extended for this trainee' : '');
  const prefill = HubDue.toLocalInput(new Date(Date.now() + 3 * HubDue.DAY).toISOString());
  /* red only while the passed deadline still needs somebody: once the work is
     in (or the assignment closed) the date is a fact, not an alarm */
  return `<div class="duerow ${st.past && !settled ? 'past' : ''}">
    <span class="dueline">${line}</span>
    ${settled ? '' : `<span class="dueacts">
      <input type="datetime-local" id="extAt" value="${esc(HubDue.toLocalInput(mine.extended ? mine.iso : '') || prefill)}">
      <button type="button" class="btn btn-quiet" id="extSet">${mine.extended ? 'Change it' : 'Give more time'}</button>
      ${mine.extended ? '<button type="button" class="btn btn-quiet" id="extClear">Remove</button>' : ''}
    </span>`}
  </div>`;
}

function saveSubs(){
  if (TRAINEE_ID) {
    const roster = loadRoster();
    if (!roster.trainees[TRAINEE_ID]) roster.trainees[TRAINEE_ID] = { id:TRAINEE_ID, name:'Trainee', tp:{}, assignments:{} };
    roster.trainees[TRAINEE_ID].assignments = SUBS;
    saveRoster(roster);
  } else {
    localStorage.setItem(SUB_KEY, JSON.stringify(SUBS));
  }
}
function subFor(key){ if (!SUBS[key]) SUBS[key] = { stage:'draft', usedResubmission:false, sub1:null, sub2:null, feedback:null, criteriaMarks:{sub1:[],sub2:[]}, criteriaComments:{sub1:[],sub2:[]}, markers:{first:'',second:'',doubleMarked:false} }; if(!SUBS[key].criteriaMarks) SUBS[key].criteriaMarks={sub1:[],sub2:[]}; if(!SUBS[key].criteriaComments) SUBS[key].criteriaComments={sub1:[],sub2:[]}; if(!SUBS[key].markers) SUBS[key].markers={first:'',second:'',doubleMarked:false}; return SUBS[key]; }

function renderPicker(){
  const suffix = TRAINEE_ID ? '&trainee='+encodeURIComponent(TRAINEE_ID) : '';
  $('picker').innerHTML = ORDER.filter(k => WORDING && WORDING[k] && (k !== 'a5' || a5InPlay(SUBS))).map(k =>
    `<button class="${k===CURRENT?'active':''}" data-a="${k}">${NAMES[k]}</button>`).join('')
    + (TRAINEE_ID ? `<span style="margin-left:12px; color:var(--grey); font-size:0.85rem; align-self:center;">Marking: ${esc((loadRoster().trainees[TRAINEE_ID]||{}).name||'trainee')}</span>` : '');
}
$('picker').addEventListener('click', e => { const b=e.target.closest('button'); if(!b) return; location.search='?a='+b.dataset.a+(TRAINEE_ID?'&trainee='+encodeURIComponent(TRAINEE_ID):''); });

function summarize(a, snap){
  if (!snap) return '<p class="note">Nothing submitted yet.</p>';
  let out = '';
  /* The word count, in the same figure the trainee was shown.
     Cambridge lists 750-1,000 words under the DESIGN of each assignment, not
     among the criteria a trainee is judged on (syllabus, Component 2), and
     the centre's own cover sheets put it under "Submission requirements"
     beside the declaration. Lite had it as a fifth/sixth/seventh criterion
     instead, which is where the tutor's only sight of the word count lived --
     so taking it out of the criteria lists (25 Sep 2026) had to put it here,
     or a tutor would have marked a 1,400-word assignment with nothing saying
     so. Counted exactly as screen 9 counts it, so the two agree. */
  if (a.wordMin) {
    const n = (Object.values(snap.text||{}).join(' ') + ' ' + Object.values(snap.fields||{}).join(' ')).match(/\S+/g);
    const c = n ? n.length : 0;
    const ok = c >= a.wordMin && c <= a.wordMax;
    out += `<p class="note" style="margin:0 0 10px;${ok?'':'color:var(--brick);'}">${c} words submitted, against ${esc(a.wordMin+'\u2013'+a.wordMax)}${ok?'':' \u2014 outside the range'}</p>`;
  }
  /* The materials the trainee linked -- worksheets, the coursebook page, a
     recording -- as something to OPEN, at the top of the submission. It was
     stored on every snapshot and read only for the overlap check; a tutor
     marking the assignment had no way to look at what it referred to
     (Ramy, 24 Sep 2026: "for assignments as well"). */
  const ml = (snap.materialsLink||'').trim();
  if (ml) out += `<p style="margin:0 0 10px;"><a class="mats-open" href="${esc(ml)}" target="_blank" rel="noopener">Open the materials \u2197</a></p>`;
  a.sections.forEach((s,i) => {
    // Reference material has no answer in it, so there is nothing to show a
    // tutor: hubIsReference covers both "Before you start" and the read-only
    // blocks an assignment can now carry (a letter, a text, a class profile).
    if (s.type==='text' && !hubIsReference(s) && snap.text && snap.text[i]) {
      out += `<div class="roundlabel">${esc(s.label)}</div><div class="readonly">${nl2br(snap.text[i])}</div>`;
    } else if (s.type==='picker' && snap.picked && snap.picked[i]) {
      const p = snap.picked[i] || {};
      out += `<div class="roundlabel">${esc(s.label)}</div><div class="readonly">${hubPickerCats(s).map(c =>
        `${esc(c.label)}: ${((c.fixed ? c.options : (p[c.key] || [])).map(esc).join(', ')) || '\u2014'}`).join('\n')}</div>`;
    } else if (s.type==='fields' && snap.fields) {
      const items = (snap.picked && (function(){ for(let j=i-1;j>=0;j--){ if(a.sections[j].type==='picker'){ return hubPickedItems(a.sections[j], snap.picked[j]); } } return []; })());
      (items||[]).forEach((item, ii) => {
        out += `<div class="roundlabel">${esc(s.label)} \u2014 ${esc(item)}</div>`;
        s.fields.forEach((f,fi) => {
          const v = snap.fields[`s${i}_i${ii}_f${fi}`];
          if (v) out += `<div class="readonly"><strong>${esc(f.label)}:</strong> ${nl2br(v)}</div>`;
        });
      });
    } else if (s.type==='declaration' && snap.decl && snap.decl[i]) {
      const d = snap.decl[i];
      out += `<div class="roundlabel">Declaration</div><div class="readonly">${s.items.map((it,ci)=>`${d.checks[ci]?'\u2611':'\u2610'} ${esc(it)}`).join('\n')}${s.aiToggle?`\nAI used: ${d.aiUsed==='yes'?('Yes \u2014 '+esc(d.aiPurpose)+' \u2014 '+esc(d.aiLink)):'No'}`:''}</div>`;
    }
  });
  return out || '<p class="note">Nothing submitted yet.</p>';
}

function render(){
  /* Every door into this screen -- the dashboard's rows, the tracker's actions
     -- carries ?trainee=. Reached without one (a stale bookmark, a hand-typed
     URL), this used to fall through to connect_assignment_submissions_v1, which
     is a TRAINEE's own key and means nothing in a tutor's browser: an empty
     mark sheet under the assignment's real name, which a tutor could type marks
     into for nobody. Found walking the tutor role, 21 Sep 2026. */
  if (!TRAINEE_ID) {
    $('picker').innerHTML = '';
    $('app').innerHTML =
      '<div style="max-width:560px; padding:26px 0;">' +
      '<h2 style="margin:0 0 10px; font-family:\'Newsreader\',Georgia,serif; font-weight:600; font-size:1.3rem;">Which trainee’s work?</h2>' +
      '<p style="margin:0 0 20px; font-size:0.9rem; line-height:1.6; color:var(--grey);">A mark sheet belongs to one trainee and one assignment. Open it from the dashboard or the trainee tracker, where the row you click says which.</p>' +
      '<a class="btn" href="5_tutor_dashboard.html">Back to dashboard</a></div>';
    return;
  }
  const a = WORDING && WORDING[CURRENT];
  if (!a){ $('app').innerHTML = '<div class="card"><p class="note">This assignment isn\u2019t set up yet.</p></div>'; return; }
  if (CURRENT === 'a5' && !a5InPlay(SUBS)){ $('app').innerHTML = '<div class="card"><p class="note">Assignment 5 has not been set for this trainee. Set it from the assignment where the plagiarism was found.</p></div>'; return; }
  const sub = subFor(CURRENT);
  OUTCOME = (sub.feedback && sub.feedback.outcome) || OUTCOME;

  let html = `<div class="header"><p class="eyebrow">Written assignments · marking</p><h1>${esc(a.title)}</h1>
    <span class="stage-pill ${sub.stage}">${({draft:'Not submitted', submitted:'Awaiting marking', returned_unmarked:'Returned unmarked', resubmission_needed:'Resubmission needed', resubmitted:'Resubmission awaiting marking', closed:'Closed'})[sub.stage]}</span>
    ${dueRowHTML(a, sub)}
    ${CURRENT !== 'a5' ? (a5InPlay(SUBS)
      ? `<p class="note" style="margin:12px 0 0;">Assignment 5 (plagiarism reflection) is set for this trainee${SUBS.a5 && SUBS.a5.assignedAfter ? ' after ' + esc(NAMES[SUBS.a5.assignedAfter] || SUBS.a5.assignedAfter) : ''}.${SUBS.a5 && SUBS.a5.stage === 'draft' ? ' <button type="button" class="btn btn-quiet" id="a5WithdrawBtn" style="margin-left:8px;">Withdraw it</button>' : ''}</p>`
      : `<p class="note" style="margin:12px 0 0;">Plagiarism found here? <button type="button" class="btn btn-quiet" id="a5SetBtn">Set Assignment 5 (plagiarism reflection)</button> It is a centre sanction, not one of the four, and stays out of sight until set.</p>`) : ''}
  </div>`;

  if (sub.stage !== 'draft') {
    /* Handbook 9.2.1: materials prepared for the language related task and the
       language skills task "SHOULD not be used as the basis for assessed TP
       lessons, or vice versa... This avoids the same content being assessed
       for two different components of assessment". A recommendation, so this
       is a flag in Cambridge's words and never a block.

       It used to compare against `tp.plan` ALONE -- the one live plan -- so it
       could see roughly one lesson out of eight, and a tutor who had watched
       it fire once would read its silence as clearance. Every returned lesson
       keeps its own plan at state.doc.plan, so the whole course is in reach
       (audit, 29 Sep 2026). Both submission rounds are checked, not just the
       first. */
    let overlapFlag = '';
    /* 9.2.1 names "the language related task and the language skills task";
       it says nothing about the other two, so they are not flagged. */
    try { if (!/^(lrt|lsrt)$/.test(CURRENT)) throw 0;
      const tr = TRAINEE_ID ? (loadRoster().trainees[TRAINEE_ID] || {}) : null;
      const norm = v => String(v || '').trim().replace(/[?#].*$/, '').replace(/\/+$/, '').toLowerCase();
      const lessons = [];
      const live = tr ? (tr.tp || {}).plan : JSON.parse(localStorage.getItem('chub:plan') || 'null');
      const liveLink = live && live.state && live.state.plan && live.state.plan.matsLink;
      if (liveLink) lessons.push({ tp: (live.state.meta || {}).tp || 'the current plan', link: liveLink });
      const hist = tr ? ((tr.tp || {}).history || {}) : (JSON.parse(localStorage.getItem('chub:tpHistory') || '{}') || {});
      Object.keys(hist).forEach(n => {
        const d = ((hist[n] || {}).state || {}).doc || {};
        const l = (d.plan || {}).matsLink;
        if (l) lessons.push({ tp: 'TP' + n, link: l });
      });
      const rounds = [['first submission', sub.sub1], ['resubmission', sub.sub2]];
      const hits = [];
      rounds.forEach(([label, r]) => {
        const sl = norm(r && r.materialsLink);
        if (!sl) return;
        lessons.forEach(L => { if (norm(L.link) === sl) hits.push(label + ' \u2014 same materials as ' + L.tp); });
      });
      if (hits.length) {        overlapFlag = `<div class="card" style="border-left-color:var(--brick);"><h2 style="color:var(--brick);">The same materials used twice</h2><p class="note" style="margin:0;">${hits.map(esc).join('<br>')}<br><br>Handbook 9.2.1: materials prepared for the language related task and the language skills task <b>should</b> not be used as the basis for assessed TP lessons, or vice versa \u2014 it avoids the same content being assessed twice, and the trainee being doubly credited or doubly penalised. A recommendation; the call is yours.</p></div>`;
      }
    } catch(e) {}
    html += overlapFlag;
    html += `<div class="card"><h2>Marker record</h2>
      <div class="row"><label>1st marker</label><input type="text" id="marker1" value="${esc(sub.markers.first)}" placeholder="Name"></div>
      <div class="row"><label>2nd marker (double-marking)</label><input type="text" id="marker2" value="${esc(sub.markers.second)}" placeholder="Leave blank if this assignment isn\u2019t in the double-marked sample"></div>
      <p class="note" style="margin:0;">Handbook 9.2.3: a proportion of each assignment <b>must</b> be double-marked (3 up to 9 trainees, 4 up to 16, 5 up to 24); double-marked ones <b>should</b> be initialled by both tutors.</p>
    </div>`;
  }

  if (sub.stage === 'draft') {
    html += `<div class="card"><p class="note">Nothing to mark yet \u2014 the trainee hasn\u2019t submitted this assignment.</p></div>`;
  } else {
    html += `<div class="card"><h2>First submission</h2>${summarize(a, sub.sub1)}</div>`;
    if (sub.sub2) html += `<div class="card"><h2>Resubmission</h2>${summarize(a, sub.sub2)}</div>`;
    if (sub.feedback && sub.feedback.outcome) {
      html += `<div class="card"><h2>Your feedback</h2><div class="readonly">${esc(sub.feedback.outcome)}${sub.feedback.generalComment1?('\n\n'+nl2br(sub.feedback.generalComment1)):''}${sub.feedback.generalComment2?('\n\n'+nl2br(sub.feedback.generalComment2)):''}</div></div>`;
    }

    if (sub.stage === 'resubmission_needed' || sub.stage === 'returned_unmarked') {
      /* Sent back: the criteria stay in view, read-only, with each mark and
         note as given in round one -- the trainee has always seen these on
         their page; the tutor had no view of their own marking until the
         resubmission arrived (Ramy, 28 Sep 2026: "I don't see this criteria").
         Round two, when it comes, draws these beside the fresh controls. */
      const crit1 = (a.criteria||[]), m1 = sub.criteriaMarks.sub1 || [], c1 = sub.criteriaComments.sub1 || [];
      if (crit1.length && (m1.length || c1.some(Boolean))) {
        html += `<div class="card"><h2>Assessment criteria <small style="font-family:'Karla',sans-serif;font-size:0.8rem;font-weight:500;color:var(--grey)">first submission, as marked</small></h2>
          ${crit1.map((c,i)=>{ const m=m1[i]; const cls=m===true?'met':m===false?'not':''; const label=m===true?'Met':m===false?'Not met':'Not marked';
            return `<div class="critrow" style="flex-direction:column; align-items:stretch;"><div class="critline"><div class="txt">${esc(c.text)}</div><span class="crit-toggle ${cls}" style="cursor:default">${label}</span></div>${c1[i] ? `<div class="readonly" style="margin:8px 0 0">${nl2br(c1[i])}</div>` : ''}</div>`; }).join('')}
        </div>`;
      }
      html += `<div class="card"><p class="note">${sub.stage === 'returned_unmarked' ? 'Returned unmarked \u2014 waiting on the trainee to submit again.' : 'Waiting on the trainee to resubmit \u2014 nothing more to mark until they do.'}</p></div>`;
    } else if (sub.stage === 'submitted' || sub.stage === 'resubmitted') {
      const round = sub.stage==='resubmitted' ? 'sub2' : 'sub1';
      const crit = (a.criteria||[]);
      const marks = sub.criteriaMarks[round];
      const allMarked = crit.length>0 && crit.every((c,i)=>marks[i]===true||marks[i]===false);
      const allMet = allMarked && crit.every((c,i)=>marks[i]===true);
      let derivedLabel, derivedCls;
      if (!allMarked) { derivedLabel = 'Mark every criterion to see the outcome'; derivedCls='pending'; }
      else {
        /* The SAME rule the save uses -- outcomeFor(). This pill used to work
           the answer out for itself and keyed only on the round, so for a
           trainee who had already used their one resubmission it read
           "Resubmission needed" while the note directly above it said the
           mark was a final Fail and the save recorded exactly that, closing
           the assignment. The tutor was shown one decision and made another,
           on a trainee's pass or fail (walk, 21 Sep 2026). */
        derivedLabel = outcomeFor(round, allMet, sub);
        derivedCls = /^Pass/.test(derivedLabel) ? 'pass' : 'fail';
      }

      let deadlineWarn = '';
      try {
        const cs = JSON.parse(localStorage.getItem('connect_course_settings'));
        if (cs && cs.end) {
          const end = new Date(cs.end + 'T23:59:59');
          const threeDaysOut = new Date(); threeDaysOut.setDate(threeDaysOut.getDate() + 3);
          if (round === 'sub1' && threeDaysOut > end) {
            deadlineWarn = `<p class="note" style="color:var(--brick);">A resubmission window (typically a few days) may run past the course end date (${esc(cs.end)}) \u2014 Handbook 9.2.3 requires the chance to resubmit within the span of the course. Check the trainee has real time left before sending this back.</p>`;
          }
        }
      } catch(e) {}
      html += `<div class="card"><h2>Assessment criteria</h2>
        ${mv2HTML(crit, marks)}
        ${deadlineWarn}
        ${sub.stage==='submitted' && sub.usedResubmission ? '<p class="note">This trainee has already used their one resubmission for this assignment \u2014 any criterion Not met here is a final Fail.</p>' : ''}
        ${crit.length ? crit.map((c,i)=>{
          const m = marks[i];
          const cls = m===true?'met':m===false?'not':'';
          const label = m===true?'Met':m===false?'Not met':'Not yet marked';
          const cm = (sub.criteriaComments[round]||[])[i] || '';
          /* Marking a RESUBMISSION is the act of checking whether what you
             flagged got fixed -- so the first round's verdict and your own note
             belong here, beside the control you are about to press. They were
             stored and rendered on the record, but this screen showed eight
             criteria all reading "Not yet marked" and nothing else, so the
             tutor re-judged blind or went hunting for their own words on
             another screen (walk, 21 Sep 2026). The trainee's own screen has
             always shown them these comments; the tutor had the worse view of
             the two. */
          const prevMark = round==='sub2' ? (sub.criteriaMarks.sub1||[])[i] : undefined;
          const prevComment = round==='sub2' ? ((sub.criteriaComments.sub1||[])[i] || '') : '';
          const prevLine = prevMark===undefined && !prevComment ? '' :
            `<div class="note" style="margin:6px 0 0; padding:6px 9px; border-radius:6px; background:var(--sand); font-size:0.78rem; line-height:1.5;">
              <b>First submission:</b> ${prevMark===true?'Met':prevMark===false?'Not met':'not marked'}${prevComment?` \u2014 ${esc(prevComment)}`:''}
            </div>`;
          return `<div class="critrow" style="flex-direction:column; align-items:stretch;">
            <div class="critline">
              <div class="txt">${esc(c.text)}</div>
              <button class="crit-toggle ${cls}" data-crit="${i}">${label}</button>
            </div>
            ${prevLine}
            <textarea data-crit-comment="${i}" rows="2" placeholder="Comment on this criterion (shown to the trainee if resubmitting)" style="margin-top:8px;">${esc(cm)}</textarea>
          </div>`;
        }).join('') : '<p class="note">No marking criteria set for this assignment yet \u2014 add them in the assignment builder.</p>'}
        <div class="derived ${derivedCls}">${derivedLabel}</div>
        <div class="xchg" id="xchg">
          <div class="xchg-acts">
            <button type="button" class="btn btn-gold" id="xCopy">Copy</button>
            <span class="note" style="margin:0;">the submission and the criteria, as text.</span>
            <button type="button" class="btn btn-quiet" id="xPasteToggle" style="margin-left:auto;">Paste something back</button>
          </div>
          <div id="xPaste" style="display:none; margin-top:12px;">
            <textarea id="xText" rows="4" placeholder="Paste here — it goes straight into the criteria. The outcome is still worked out from the marks."></textarea>
          </div>
          <p class="note" id="xDone" style="display:none; margin:8px 0 0;"></p>
        </div>
        <div class="row" style="margin-top:12px;"><label>General comment${round==='sub2'?' on the resubmission':''} (optional)</label>
          <textarea id="comment" rows="3" placeholder="Anything that does not belong to one criterion.">${esc((sub.feedback&&(round==='sub2'?sub.feedback.generalComment2:sub.feedback.generalComment1))||'')}</textarea></div>
        <div class="actions">
          <button type="button" class="btn btn-quiet" id="unmarkedBtn">Return unmarked</button>
          <button class="btn btn-teal" id="saveBtn" ${allMarked?'':'disabled'}>Save & return to trainee</button>
        </div>
      </div>`;
    }
  }

  $('app').innerHTML = html;
  document.querySelectorAll('[data-crit]').forEach(b => b.addEventListener('click', () => {
    const round = sub.stage==='resubmitted' ? 'sub2' : 'sub1';
    const i = +b.dataset.crit;
    const cur = sub.criteriaMarks[round][i];
    sub.criteriaMarks[round][i] = cur===true ? false : cur===false ? null : true;
    saveSubs(); render();
  }));
  const saveBtn = $('saveBtn');
  if (saveBtn) saveBtn.addEventListener('click', doSave);
  const unmarkedBtn = $('unmarkedBtn');
  if (unmarkedBtn) unmarkedBtn.addEventListener('click', doReturnUnmarked);
  wireExchange();
  const extBtn = $('extSet');
  if (extBtn) extBtn.addEventListener('click', () => {
    const v = ($('extAt') || {}).value;
    if (!v) return;
    setExtension(subFor(CURRENT), HubDue.fromLocalInput(v));
  });
  const extClr = $('extClear');
  if (extClr) extClr.addEventListener('click', () => setExtension(subFor(CURRENT), ''));

  const setBtn = $('a5SetBtn');
  if (setBtn) setBtn.addEventListener('click', async () => {
    if (!(await confirmModal('Set Assignment 5, the plagiarism reflection, for this trainee? It appears in their assignment list once you return this file to them.', 'Set Assignment 5'))) return;
    const a5 = subFor('a5');
    a5.assigned = true; a5.assignedAt = new Date().toISOString(); a5.assignedAfter = CURRENT;
    saveSubs(); renderPicker(); render();
  });
  const wBtn = $('a5WithdrawBtn');
  if (wBtn) wBtn.addEventListener('click', async () => {
    if (!(await confirmModal('Withdraw Assignment 5 for this trainee? Nothing has been submitted for it.', 'Withdraw'))) return;
    delete SUBS.a5;
    saveSubs(); renderPicker(); render();
  });
  const m1 = $('marker1'), m2 = $('marker2');
  // First marker defaults to the tutor's own name from the dashboard.
  try{ const tn=localStorage.getItem('chub:tutorName'); if(m1 && tn && !m1.value){ m1.value=tn; sub.markers.first=tn; saveSubs(); } }catch(e){}
  if (m1) m1.addEventListener('input', () => { sub.markers.first = m1.value; saveSubs(); });
  if (m2) m2.addEventListener('input', () => { sub.markers.second = m2.value; sub.markers.doubleMarked = !!m2.value.trim(); saveSubs(); });
  /* Comments keep as they are typed. Until 24 Sep 2026 only Save read them,
     and render() rebuilds the whole form on every pill click -- so a comment
     typed on criterion 1 vanished the moment criterion 2 was marked, and a
     tutor who switched trainee lost everything but the pills. */
  const rnd = sub.stage==='resubmitted' ? 'sub2' : 'sub1';
  document.querySelectorAll('[data-crit-comment]').forEach(el => el.addEventListener('input', () => {
    sub.criteriaComments[rnd] = sub.criteriaComments[rnd] || [];
    sub.criteriaComments[rnd][+el.dataset.critComment] = el.value; saveSubs();
  }));
  const gc = $('comment');
  if (gc) gc.addEventListener('input', () => {
    if (!sub.feedback) sub.feedback = { outcome:'', generalComment1:'', generalComment2:'' };
    sub.feedback[rnd==='sub2' ? 'generalComment2' : 'generalComment1'] = gc.value; saveSubs();
  });
}

function doSave(){
  const sub = subFor(CURRENT);
  const a = WORDING[CURRENT];
  const round = sub.stage==='resubmitted' ? 'sub2' : 'sub1';
  const crit = (a.criteria||[]);
  const marks = sub.criteriaMarks[round];
  const allMet = crit.length>0 && crit.every((c,i)=>marks[i]===true);
  const comment = $('comment').value;
  sub.criteriaComments[round] = crit.map((c,i)=>{ const el=document.querySelector(`[data-crit-comment="${i}"]`); return el?el.value:''; });
  if (!sub.feedback) sub.feedback = { outcome:'', generalComment1:'', generalComment2:'' };

  sub[round === 'sub2' ? 'marked2At' : 'marked1At'] = new Date().toISOString();
  if (round === 'sub2') sub.feedback.generalComment2 = comment;
  else sub.feedback.generalComment1 = comment;
  sub.feedback.outcome = outcomeFor(round, allMet, sub);
  sub.stage = sub.feedback.outcome === 'Resubmission needed' ? 'resubmission_needed' : 'closed';
  saveSubs();
  render();
}

/* What this marking comes to, in the words the trainee will see. Read by the
   pill the tutor is looking at AND by the save, so the screen cannot promise
   one outcome and record another. Handbook 9.2.3, not 9.2.2 (checked against
   the June 2025 Administration Handbook, 21 Sep 2026): 9.2.2 is "Providing
   support for written assignments"; the one-occasion rule is in 9.2.3, which
   says trainees must have the opportunity, within the time span of the
   course, to resubmit "on one occasion only for each assignment". Once it is
   used, a criterion not met is a Fail, not another chance. */
/* ---- v3 (7 Oct 2026): the tally strip ------------------------------------
   One segment per criterion, in order, coloured by its mark, over a count.
   A segment is a door to its criterion. Reads the marks render() already
   has; writes nothing. */
function mv2HTML(crit, marks){
  if (!crit || !crit.length) return '';
  const m = i => (marks || [])[i];
  const met = crit.filter((c, i) => m(i) === true).length, not = crit.filter((c, i) => m(i) === false).length, left = crit.length - met - not;
  return '<div class="mv2"><div class="mv2-segs">' + crit.map((c, i) => {
      const st = m(i) === true ? 'met' : m(i) === false ? 'not' : '';
      return '<button type="button" class="mv2-seg ' + st + '" data-mv2="' + i + '" title="' + esc((i + 1) + '. ' + c.text) + '" aria-label="' + esc('Criterion ' + (i + 1) + ': ' + (st === 'met' ? 'Met' : st === 'not' ? 'Not met' : 'not yet marked')) + '">' + (i + 1) + '</button>';
    }).join('') + '</div><p class="mv2-n"><span class="met"><b>' + met + '</b> met</span><span class="not"><b>' + not + '</b> not met</span><span><b>' + left + '</b> to mark</span></p></div>';
}
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('[data-mv2]'); if (!b) return;
  const t = document.querySelector('.crit-toggle[data-crit="' + b.dataset.mv2 + '"]'); if (!t) return;
  const row = t.closest('.critrow') || t;
  window.scrollTo({ top: row.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  row.classList.remove('mv2-hit'); void row.offsetWidth; row.classList.add('mv2-hit');
});
```

## Appendix E: `1_trainee_plan_and_analysis.html` v3 CSS (verbatim)
```css
  /* ---- v3 (7 Oct 2026): the plan's shape, in the action bar ----
     Six checks in the order of the page, and the stages as dots in their own
     hue once written. Turn in gives one gold pulse when all six are in.
     Display only: the rules for turning in are unchanged. */
  .pv2{display:flex; align-items:center; gap:12px; font-family:'Karla',sans-serif; font-size:0.78rem; color:var(--grey);}
  .pv2 .chk{display:inline-flex; gap:10px;}
  .pv2 .chk span{display:inline-flex; align-items:center; gap:4px; white-space:nowrap;}
  .pv2 .chk span:before{content:''; width:8px; height:8px; border-radius:50%; border:1.5px solid var(--sand-line);}
  .pv2 .chk span.ok{color:var(--teal-deep);} .pv2 .chk span.ok:before{background:var(--teal); border-color:var(--teal);}
  .pv2 .chk span.over{color:var(--brick);} .pv2 .chk span.over:before{background:var(--brick); border-color:var(--brick);}
  .pv2 .stg{display:inline-flex; gap:3px; align-items:center;}
  .pv2 .stg i{width:9px; height:9px; border-radius:3px; background:var(--box); transition:background-color .3s;}
  #turnInBtn.pv2-ready{animation:pv2-ready 1.6s ease-out 1;}
  @keyframes pv2-ready{0%{box-shadow:0 0 0 0 oklch(70% 0.12 72 / .6);}100%{box-shadow:0 0 0 12px oklch(70% 0.12 72 / 0);}}
  @media(prefers-reduced-motion:reduce){ .pv2 .stg i{transition:none;} #turnInBtn.pv2-ready{animation:none;} }
  @media(max-width:1000px){ .pv2 .chk span:not(.lead){display:none;} }
  @media(max-width:640px){ .pv2{display:none;} }
  @media print{ .pv2{display:none;} }
```

## Appendix F: `1_trainee_plan_and_analysis.html` v3 JS (verbatim)
```js
/* ---- v3 (7 Oct 2026): the plan's shape strip ------------------------------
   Reads the page; stores nothing. Repaints 150ms after any edit. */
(function(){
  const host = document.getElementById('pv2'); if (!host || typeof rows !== 'function') return;
  const val = id => { const el = document.getElementById(id); return el ? String(el.value || '').trim() : ''; };
  let was = false;
  function paint(){
    const all = rows();
    const written = all.map(tr => procText(tr.querySelector('.t-proc').value).trim() !== '');
    const nW = written.filter(Boolean).length;
    const prob = [...document.querySelectorAll('#probGrid textarea, #probGrid input')].some(el => String(el.value || '').trim());
    const tot = document.getElementById('total'), over = !!(tot && tot.classList.contains('over'));
    const fits = !!(tot && /fits exactly|spare/.test(tot.textContent || ''));
    const C = [
      ['Aims', !!val('fMain')], ['Problems', prob], ['Class', !!val('fProfile')],
      ['Materials', !!(val('fMats') || val('fMatsLink'))], ['Stages ' + nW + '/' + all.length, all.length > 0 && nW === all.length],
      [over ? 'Time over' : 'Time', fits, over]
    ];
    const ready = C.every(c => c[1]);
    host.innerHTML = '<span class="stg" title="' + nW + ' of ' + all.length + ' stages written">'
      + all.map((tr, i) => '<i style="' + (written[i] ? 'background:' + (getComputedStyle(tr).getPropertyValue('--hue').trim() || 'var(--teal)') : '') + '"></i>').join('') + '</span>'
      + '<span class="chk">' + C.map((c, i) => '<span class="' + (c[2] ? 'over' : c[1] ? 'ok' : '') + (i === 4 ? ' lead' : '') + '">' + c[0] + '</span>').join('') + '</span>';
    const btn = document.getElementById('turnInBtn');
    if (btn) { if (ready && !was) { btn.classList.remove('pv2-ready'); void btn.offsetWidth; btn.classList.add('pv2-ready'); } if (!ready) btn.classList.remove('pv2-ready'); }
    was = ready;
  }
  let t = null; const soon = () => { clearTimeout(t); t = setTimeout(paint, 150); };
  ['input', 'change', 'click', 'keyup'].forEach(ev => document.addEventListener(ev, soon, true));
  new MutationObserver(soon).observe(document.querySelector('.board') || document.body, { childList: true, subtree: true });
  paint(); setTimeout(paint, 800);
})();
```
