# Volunteer register and assessor pack: complete build spec

Repo: `ramysakr1-ux/connect-Hub` @ `main`, read 7 Oct 2026.
Design: `Magic Touches.dc.html`, 9a and 9b. Drop-ins in this folder:
- `25_volunteer_register.html`
- `12_assessor_pack.html`

Both are display only. Taps, records, the store and the printed pack are unchanged. Sections A and B cover every element, state, hover, focus, motion, phone and print rule, and the logic. The appendices hold the exact code, copied verbatim from the drop-ins. Where the two differ, the appendix wins.

---

## A. Volunteer register (`25`, 9a)

### Edits
1. The `COMING` sentence (`p.legend.coming`) becomes the `.vr9-coming` card markup. The same numbers and words go into its parts.
2. A CSS block goes before `</style>`.
3. An IIFE goes at the end of the last script. It watches `#app` (childList) and re-applies after every `render()`.

### A1. Today's block
- **Which blocks:** every `.seg` for `TODAY`. That means `[data-d=TODAY]` in the tutor's view, or the `title` that starts "{dm(TODAY)} —" in the read-only view.
- **Style:** `.vr9-today`, a ring `0 0 0 2px --paper, 0 0 0 4px --gold-lifted`.
- It sits outside the block, so the fill (in the room, part, still to come) stays readable. The page's own focus ring rule is kept too.

### A2. The room count (`.vr9-now`)
- **Placement:** before `.reg`, only when there are today blocks.
- **Text:** "**N** in the room today", plus " · M for part of it" when anyone came for part of it. A right-hand note says the ring is on every row.
- **N and M:** today's blocks with `.here` (N) and `.part` (M).

| Element | Spec |
|---|---|
| `.vr9-now` | flex, baseline, gap 10, wraps, margin 0 0 12, padding 12/16, radius 12, `--teal-deep` fill, `--paper` text |
| `b` | Newsreader 1.7rem |
| `span` | 0.88rem, `oklch(91% 0.018 190)` |
| `small` | 0.78rem, `oklch(84% 0.02 190)`, pushed right |

`aria-live="polite"`, so a tap updates it. Hidden in print.

### A3. The pop
A capture-phase click on `.seg[data-i][data-d]` remembers which block was tapped. After the re-render, that block gets `.vr9-pop`: scale 1 → 1.35 → 1 over .38s, easing `cubic-bezier(.2,.7,.2,1.4)`.

### A4. The next class (`.vr9-coming`)
**Layout.** A grid with `auto auto minmax(0,1fr)` columns, gap 10 × 26, padding 16/18, radius 12, `--paper` fill, 1px `--sand-line`.

| Part | Spec |
|---|---|
| `.lead` | `.k` "Next class" (Instrument Sans 700, 10px, tracking .16em, `--gold-deep`), then `b` the date (Newsreader 1.15rem), then `small` "TP n at hh:mm" (0.78rem `--grey`) |
| `.num` | centred, padding 0 22, with a 1px `--row-line` on each side. `b`: yes + no answer (the existing "expect about" figure), Newsreader 700 2.6rem `--teal-deep`. `small`: "expected" |
| `.split .bar` | 10px, radius 99, segments by flex: yes `--teal` · no answer `--gold-lifted` · no `oklch(85% 0.01 80)` |
| `.split .keys` | 0.78rem `--ink-warm`, 9px swatches: "N said yes", "N have not answered", "N said no" |

**Phone:** the bar goes full width, and the number loses its side rules.
**Print:** a plain 1px border.

---

## B. Assessor pack (`12`, 9b)

### Edits
1. `renderList()`'s innerHTML starts with `${ap9Visit()}`.
2. The observing panel gains the class `ap9-obs`.
3. `ap9Chips()` runs after the list renders.
4. A CSS block goes before `</style>`.

`ap9Visit` and `ap9Chips` sit above `checksHTML`. The single-trainee view (`renderOne`) is unchanged.

### B1. The welcome (`.ap9`)

| Element | Spec |
|---|---|
| Card | relative, overflow hidden, margin 0 0 22, padding 30/32/24, radius 16, `--teal-deep`, `--paper` text |
| Mark | absolute, right −140, top −80, 520px wide, opacity .13, `ap9-drift` 18s |
| `.k` | centre · course, Instrument Sans 600, 11px, tracking .26em, `oklch(80% 0.1 75)` |
| `h2` | "Welcome to the course." Newsreader 700, `clamp(30px,4.4vw,46px)`, line-height 1.02 |
| `.when` | "Your visit: **{visitWhen()}**", the page's own function, so the date and TP times are the same string as elsewhere. Without a date: "The centre has not set the visit date yet." 1rem `oklch(91% 0.018 190)` |
| `.ap9-stats` | flex, gap 12. Each tile: min-width 150, padding 14/16/12, radius 12, `--teal` fill, 1px `--teal-lifted`. `b` Newsreader 700 2.1rem, `span` 0.8rem |

**The three stats:**
- Trainees on the course: `PEOPLE.length`.
- You are observing: the chosen trainees in `SETTINGS.assessorVisit`. Only shown when the centre has chosen some.
- Handbook checks met: "x of y", counting `courseChecks()` rows with `state === 'met'`.

### B2. Section chips (`#ap9Jump`)
- **Built from:** `ap9Chips()` reads every `#app h2.sect` after render. Each heading without an id gets `ap9-sN`, and its chip is a link to it. The chip label is the heading's first text node, without the `small`.
- **Row:** flex, gap 6, wraps, margin-top 20, a top border `oklch(99.5% 0.004 90 / .2)`.

| State | Spec |
|---|---|
| chip | padding 6/12, radius 999, fill `oklch(99.5% 0.004 90 / .1)`, 1px border `/ .3`, `--paper` text, Karla 600 0.8rem |
| hover | `--gold-lifted` fill and border, `--ink-warm` text, lifts 2px |
| focus-visible | 2px `--gold-lifted` outline |
| arriving (`h2.sect:target`) | a 4px gold ring and `--gold-wash` fill fading over 1.4s |

### B3. Observing panel (`.panel.ap9-obs`)
- A 4px `--gold` left edge and `--gold-wash` fill. Row rules in `--amber-edge`.
- **Print:** plain.

**Screen only.** `.ap9` is hidden in print, so the printed pack starts where it always has.

---

## Test

1. **Register on a teaching day:**
   - Today's block on every row is ringed gold, and the strip reads "N in the room today".
   - Tap a block: it pops, the count updates, and the hours update as before.
2. **Register before the course or on a non-teaching day:** no ring and no strip.
3. **Next class with replies:** the card shows the date, the expected number, and the yes / not answered / no bar. With no replies yet, the bar is all gold.
4. **Phone (375px):** blocks are 30px tap targets (existing rule), the ring is still visible, and the card stacks.
5. **Pack with a visit date and chosen trainees:**
   - The welcome shows the visit, 12 / 4 / "11 of 12".
   - Chips jump to each section, which flashes.
   - The observing panel is gold-edged.
6. **Pack with no visit date:** "The centre has not set the visit date yet." With no chosen trainees, there's no "observing" tile.
7. **Print the pack:** no welcome and no gold panel; identical to `main`.
8. **Reduced motion:** no pop, drift or flash.

---

## Appendix A: register v9 CSS (verbatim)
```css
  /* ---- v9 (7 Oct 2026): the register in the room -----------------------------
     Today's block on every row ringed in gold, a count of who is in the room
     today, a block that pops when it is marked, and the next class as a
     headcount card. Same taps, same records. Design: Magic Touches, 9a. */
  .seg.vr9-today{box-shadow:0 0 0 2px var(--paper), 0 0 0 4px var(--gold-lifted);}
  .seg.vr9-pop{animation:vr9-pop .38s cubic-bezier(.2,.7,.2,1.4) 1;}
  .vr9-now{display:flex; align-items:baseline; gap:10px; flex-wrap:wrap; margin:0 0 12px; padding:12px 16px; border-radius:12px; background:var(--teal-deep); color:var(--paper);}
  .vr9-now b{font-family:'Newsreader',Georgia,serif; font-size:1.7rem; line-height:1;}
  .vr9-now span{font-size:0.88rem; color:oklch(91% 0.018 190);}
  .vr9-now small{margin-left:auto; font-size:0.78rem; color:oklch(84% 0.02 190);}
  .vr9-coming{display:grid; grid-template-columns:auto auto minmax(0,1fr); gap:10px 26px; align-items:center; margin:16px 0 0; padding:16px 18px; border-radius:12px;
    background:var(--paper); border:1px solid var(--sand-line);}
  .vr9-coming .lead .k{display:block; font-family:'Instrument Sans','Karla',sans-serif; font-size:10px; font-weight:700; letter-spacing:.16em; text-transform:uppercase; color:var(--gold-deep);}
  .vr9-coming .lead b{display:block; font-family:'Newsreader',Georgia,serif; font-size:1.15rem; margin-top:2px;}
  .vr9-coming .lead small{display:block; font-size:0.78rem; color:var(--grey); margin-top:2px;}
  .vr9-coming .num{text-align:center; padding:0 22px; border-left:1px solid var(--row-line); border-right:1px solid var(--row-line);}
  .vr9-coming .num b{display:block; font-family:'Newsreader',Georgia,serif; font-weight:700; font-size:2.6rem; line-height:1; color:var(--teal-deep);}
  .vr9-coming .num small{font-size:0.74rem; color:var(--grey);}
  .vr9-coming .bar{display:flex; height:10px; border-radius:99px; overflow:hidden; background:var(--box);}
  .vr9-coming .bar i{display:block; min-width:0;}
  .vr9-coming .keys{display:flex; gap:6px 16px; flex-wrap:wrap; margin-top:8px; font-size:0.78rem; color:var(--ink-warm);}
  .vr9-coming .keys i{display:inline-block; width:9px; height:9px; border-radius:3px; margin-right:5px; vertical-align:-1px;}
  .vr9-coming .y{background:var(--teal);} .vr9-coming .q{background:var(--gold-lifted);} .vr9-coming .n{background:oklch(85% 0.01 80);}
  @keyframes vr9-pop{0%{transform:scale(1);}45%{transform:scale(1.35);}100%{transform:scale(1);}}
  @media(prefers-reduced-motion:reduce){ .seg.vr9-pop{animation:none;} }
  @media(max-width:560px){ .vr9-coming{grid-template-columns:1fr auto;} .vr9-coming .split{grid-column:1 / -1;} .vr9-coming .num{border:0; padding:0;} .vr9-now small{margin-left:0; flex-basis:100%;} }
  @media print{ .vr9-now{display:none;} .seg.vr9-today{box-shadow:none;} .vr9-coming{border:1px solid #bbb;} }
```

## Appendix B: register v9 JS (verbatim)
```js
/* ---- v9 (7 Oct 2026): today's ring, the room count, the pop ------------------
   Layered on render(); reads the blocks it drew; stores nothing. */
(function(){
  const app = document.getElementById('app'); if (!app) return;
  let last = null;
  app.addEventListener('click', e => { const b = e.target.closest('.seg[data-i][data-d]'); if (b) last = b.dataset.i + '|' + b.dataset.d; }, true);
  function apply(){
    if (typeof TODAY === 'undefined') return;
    const today = [...app.querySelectorAll('.seg[data-d="' + TODAY + '"], .seg[title^="' + (typeof dm === 'function' ? dm(TODAY) : '\u0000') + ' \u2014"]')];
    today.forEach(el => el.classList.add('vr9-today'));
    if (last) { const [i, d] = last.split('|'); const el = app.querySelector('.seg[data-i="' + i + '"][data-d="' + d + '"]'); if (el) el.classList.add('vr9-pop'); last = null; }
    const reg = app.querySelector('.reg');
    if (reg && today.length && !app.querySelector('.vr9-now')) {
      const here = today.filter(el => el.classList.contains('here')).length, part = today.filter(el => el.classList.contains('part')).length;
      reg.insertAdjacentHTML('beforebegin', '<div class="vr9-now" aria-live="polite"><b>' + here + '</b><span>in the room today' + (part ? ' \u00b7 ' + part + ' for part of it' : '') + '</span><small>Today\u2019s block is ringed in gold on every row</small></div>');
    }
  }
  new MutationObserver(() => requestAnimationFrame(apply)).observe(app, { childList: true });
  apply();
})();
```

## Appendix C: register next-class markup (verbatim line)
```js
  .vr9-coming{display:grid; grid-template-columns:auto auto minmax(0,1fr); gap:10px 26px; align-items:center; margin:16px 0 0; padding:16px 18px; border-radius:12px;
```

## Appendix D: pack v9 CSS (verbatim)
```css
  /* ---- v9 (7 Oct 2026): the assessor's welcome ---- */
  .ap9{position:relative; overflow:hidden; margin:0 0 22px; padding:30px 32px 24px; border-radius:16px; background:var(--teal-deep); color:var(--paper);}
  .ap9 > *{position:relative;}
  .ap9 .ap9-mark{position:absolute; right:-140px; top:-80px; width:520px; height:auto; opacity:.13; pointer-events:none; animation:ap9-drift 18s ease-in-out infinite; transform-origin:50% 50%;}
  .ap9 .k{margin:0 0 10px; font-family:'Instrument Sans','Karla',sans-serif; font-size:11px; font-weight:600; letter-spacing:.26em; text-transform:uppercase; color:oklch(80% 0.1 75);}
  .ap9 h2{margin:0; font-family:'Newsreader',Georgia,serif; font-weight:700; font-size:clamp(30px,4.4vw,46px); line-height:1.02; letter-spacing:-0.02em; color:var(--paper);}
  .ap9 .when{margin:12px 0 0; font-size:1rem; color:oklch(91% 0.018 190);} .ap9 .when b{color:var(--paper);}
  .ap9-stats{display:flex; gap:12px; flex-wrap:wrap; margin:20px 0 0;}
  .ap9-stats div{min-width:150px; padding:14px 16px 12px; border-radius:12px; background:var(--teal); border:1px solid var(--teal-lifted);}
  .ap9-stats b{display:block; font-family:'Newsreader',Georgia,serif; font-weight:700; font-size:2.1rem; line-height:1; color:var(--paper);}
  .ap9-stats b small{font-size:1rem; color:oklch(91% 0.018 190); font-weight:600;}
  .ap9-stats span{display:block; margin-top:6px; font-size:0.8rem; color:oklch(91% 0.018 190);}
  .ap9-jump{display:flex; gap:6px; flex-wrap:wrap; margin:20px 0 0; padding-top:16px; border-top:1px solid oklch(99.5% 0.004 90 / .2);}
  .ap9-jump a{padding:6px 12px; border-radius:999px; background:oklch(99.5% 0.004 90 / .1); border:1px solid oklch(99.5% 0.004 90 / .3); color:var(--paper);
    font-family:'Karla',sans-serif; font-size:0.8rem; font-weight:600; text-decoration:none; transition:background-color .15s, transform .15s;}
  .ap9-jump a:hover{background:var(--gold-lifted); border-color:var(--gold-lifted); color:var(--ink-warm); transform:translateY(-2px);}
  .ap9-jump a:focus-visible{outline:2px solid var(--gold-lifted); outline-offset:2px;}
  h2.sect:target{animation:ap9-hit 1.4s ease-out 1; border-radius:6px;}
  /* the trainees the assessor is observing: gold-edged, first */
  .panel.ap9-obs{border-left:4px solid var(--gold); background:var(--gold-wash);}
  .panel.ap9-obs .docrow{border-bottom-color:var(--amber-edge);}
  @keyframes ap9-drift{0%,100%{transform:rotate(-8deg) scale(1);}50%{transform:rotate(-4deg) scale(1.04);}}
  @keyframes ap9-hit{0%{box-shadow:0 0 0 4px oklch(70% 0.12 72 / .7); background:var(--gold-wash);}100%{box-shadow:0 0 0 4px oklch(70% 0.12 72 / 0);}}
  @media(prefers-reduced-motion:reduce){ .ap9 .ap9-mark, h2.sect:target{animation:none;} .ap9-jump a{transition:none;} }
  @media(max-width:560px){ .ap9{padding:22px 18px 18px; border-radius:12px;} .ap9-stats div{min-width:0; flex:1 1 120px;} }
  @media print{ .ap9{display:none !important;} .panel.ap9-obs{border-left:0; background:none;} }
```

## Appendix E: pack v9 JS (verbatim)
```js
/* ---- v9 (7 Oct 2026): the assessor's welcome ---- */
  .ap9{position:relative; overflow:hidden; margin:0 0 22px; padding:30px 32px 24px; border-radius:16px; background:var(--teal-deep); color:var(--paper);}
  .ap9 > *{position:relative;}
  .ap9 .ap9-mark{position:absolute; right:-140px; top:-80px; width:520px; height:auto; opacity:.13; pointer-events:none; animation:ap9-drift 18s ease-in-out infinite; transform-origin:50% 50%;}
  .ap9 .k{margin:0 0 10px; font-family:'Instrument Sans','Karla',sans-serif; font-size:11px; font-weight:600; letter-spacing:.26em; text-transform:uppercase; color:oklch(80% 0.1 75);}
  .ap9 h2{margin:0; font-family:'Newsreader',Georgia,serif; font-weight:700; font-size:clamp(30px,4.4vw,46px); line-height:1.02; letter-spacing:-0.02em; color:var(--paper);}
  .ap9 .when{margin:12px 0 0; font-size:1rem; color:oklch(91% 0.018 190);} .ap9 .when b{color:var(--paper);}
  .ap9-stats{display:flex; gap:12px; flex-wrap:wrap; margin:20px 0 0;}
  .ap9-stats div{min-width:150px; padding:14px 16px 12px; border-radius:12px; background:var(--teal); border:1px solid var(--teal-lifted);}
  .ap9-stats b{display:block; font-family:'Newsreader',Georgia,serif; font-weight:700; font-size:2.1rem; line-height:1; color:var(--paper);}
  .ap9-stats b small{font-size:1rem; color:oklch(91% 0.018 190); font-weight:600;}
  .ap9-stats span{display:block; margin-top:6px; font-size:0.8rem; color:oklch(91% 0.018 190);}
  .ap9-jump{display:flex; gap:6px; flex-wrap:wrap; margin:20px 0 0; padding-top:16px; border-top:1px solid oklch(99.5% 0.004 90 / .2);}
  .ap9-jump a{padding:6px 12px; border-radius:999px; background:oklch(99.5% 0.004 90 / .1); border:1px solid oklch(99.5% 0.004 90 / .3); color:var(--paper);
    font-family:'Karla',sans-serif; font-size:0.8rem; font-weight:600; text-decoration:none; transition:background-color .15s, transform .15s;}
  .ap9-jump a:hover{background:var(--gold-lifted); border-color:var(--gold-lifted); color:var(--ink-warm); transform:translateY(-2px);}
  .ap9-jump a:focus-visible{outline:2px solid var(--gold-lifted); outline-offset:2px;}
  h2.sect:target{animation:ap9-hit 1.4s ease-out 1; border-radius:6px;}
  /* the trainees the assessor is observing: gold-edged, first */
  .panel.ap9-obs{border-left:4px solid var(--gold); background:var(--gold-wash);}
  .panel.ap9-obs .docrow{border-bottom-color:var(--amber-edge);}
  @keyframes ap9-drift{0%,100%{transform:rotate(-8deg) scale(1);}50%{transform:rotate(-4deg) scale(1.04);}}
  @keyframes ap9-hit{0%{box-shadow:0 0 0 4px oklch(70% 0.12 72 / .7); background:var(--gold-wash);}100%{box-shadow:0 0 0 4px oklch(70% 0.12 72 / 0);}}
  @media(prefers-reduced-motion:reduce){ .ap9 .ap9-mark, h2.sect:target{animation:none;} .ap9-jump a{transition:none;} }
  @media(max-width:560px){ .ap9{padding:22px 18px 18px; border-radius:12px;} .ap9-stats div{min-width:0; flex:1 1 120px;} }
  @media print{ .ap9{display:none !important;} .panel.ap9-obs{border-left:0; background:none;} }
</style>
<link rel="stylesheet" href="hub-house.css?v=202610072111">
</head>
<body>
<div class="board">
  <a class="back" id="backLink" href="12_assessor_pack.html" hidden>&#8592; All trainees</a>
  <div class="header">
    <div style="display:flex;align-items:center;justify-content:center;gap:10px;">
      <span style="width:40px;height:40px;border-radius:9px;background:var(--ink-warm);display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">
        <svg viewBox="8 30 104 60" width="26" height="15" fill="none" class="wordmark-spin">
          <path d="M56.1 42.2 A 24 24 0 1 0 56.1 77.8" stroke="var(--gold-lifted)" stroke-width="13" stroke-linecap="round"></path>
          <path d="M96.1 42.2 A 24 24 0 1 0 96.1 77.8" stroke="var(--paper)" stroke-width="13" stroke-linecap="round"></path>
        </svg>
      </span>
      <span class="hub-pair"><span style="font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-size:27px;line-height:0.85;letter-spacing:-0.012em;color:var(--gold);">Connect</span><span class="hub-word">Lite</span></span>
    </div>
    <p class="eyebrow">Assessor pack</p>
    <p class="course-name" id="courseName">Course</p>
    <p class="tag" id="centreLine"></p>
    <p class="access" id="accessLine"></p>
    <div class="toolbar" id="toolbar"></div>
    <div id="onlineRooms"></div>
  </div>

  <div id="app"></div>

  <p class="howline"><a href="17_how_it_works.html">How Connect Lite works</a> &mdash; every role, and the questions people ask</p>
  <footer class="foot"><span class="foot-mark"><svg viewBox="8 30 104 60" width="12" height="7" fill="none"><path d="M56.1 42.2 A 24 24 0 1 0 56.1 77.8" stroke="var(--gold-lifted)" stroke-width="13" stroke-linecap="round"></path><path d="M96.1 42.2 A 24 24 0 1 0 96.1 77.8" stroke="var(--paper)" stroke-width="13" stroke-linecap="round"></path></svg></span><span class="hub-credit">designed and built by <b>Ramy</b></span></footer>

</div>

<script src="observation-defaults.js?v=202610072111"></script>
<script src="hub-shared.js?v=202610072111"></script>
<script src="assignment-defaults.js?v=202610072111"></script>
<script src="hub-tracker.js?v=202610072111"></script>
<script src="hub-rotation.js?v=202610072111"></script>
<script src="hub-attendance.js?v=202610072111"></script>
<script src="hub-store.js?v=202610072111"></script>
<script src="hub-say.js?v=202610072111"></script>
<script src="hub-sync.js?v=202610072111"></script>
<script type="text/x-hub-app">
const T = window.HubTracker;
const $ = id => document.getElementById(id);
function esc(s){ return (s==null?'':String(s)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function rec(k){ try{ return JSON.parse(localStorage.getItem(k)); }catch(e){ return null; } }
function when(iso){ if(!iso) return ''; const d=new Date(iso); if(isNaN(d)) return ''; return d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})+' '+d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}); }
/* The date at the front of the string, read as written rather than converted.
   The store stamps the assessor expiry at 23:59:59 of its own day and sends it
   as UTC, so reading it as an instant moved it to the next day for anyone east
   of the store -- the same link then said 13 November when the page worked the
   date out itself and 14 November when the store answered (found walking the
   assessor role, 21 Sep 2026). A date named to a person is a day, not a moment. */
function longDate(iso){
  const m = String(iso == null ? '' : iso).match(/^(\d{4})-(\d{2})-(\d{2})/);
  const d = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(iso);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
}

const MODE = window.HubMode;
const params = new URLSearchParams(location.search);
const WHO = params.get('trainee') || '';
const SETTINGS = rec('connect_course_settings') || {};
/* The rooms an online course teaches in: the assessor joins the teaching
   practice from here on the day (Ramy, 28 Sep 2026). Print drops it. */
/* What and when, beside the door. The assessment date is the centre's
   (Course admin), and the times are the teaching practice slots of that day
   from the course's own timetable, in the course's clock -- so the assessor
   does not have to find the day in the timetable to know when to click.
   Ramy, 1 Oct 2026: "next to the link should be some information about what
   and when." */
function visitWhen(){
  const d = SETTINGS.visitDate;
  if (!d) return '';
  const day = (function(){ try { return new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }); } catch (e) { return d; } })();
  let times = '';
  try {
    const tt = rec('connect_timetable_v1') || {};
    const slots = (tt.slots || []).filter(sl => sl && sl.kind === 'tp' && sl.from);
    if (slots.length) {
      const from = slots[0].from, to = slots[slots.length - 1].to || '';
      times = ' \u00b7 ' + (to ? hubClockRange(from, to) : hubClock(from));
    }
  } catch (e) {}
  const zone = SETTINGS.timeZone && window.hubZoneName ? ' (' + window.hubZoneName(SETTINGS.timeZone) + ')' : '';
  return day + times + (times ? zone : '');
}
if (window.hubOnlineRoomsHTML) {
  const strip = hubOnlineRoomsHTML(SETTINGS, { all: true, assessor: true, when: visitWhen() });
  /* And the assessment timetable beside it, when the centre has provided one.
     It is the document that says what happens and at what hour on the day the
     assessor is there, and it was the last row of the last panel on the page
     (Ramy, 1 Oct 2026). It still appears in Course documents, where 14.1
     counts it; this is a door, not a second copy. */
  const at = ((SETTINGS.docs || {}).docAssessTimetable || '').trim();
  const when = visitWhen();
  /* The visit leads, and clicking it opens the timetable for the day -- what
     happens and at what hour. Ramy, 1 Oct 2026: "the visit should be, click on
     it and then it shows the time, the assessor visit timetable." The room
     follows it, because the room is the same one all day. */
  const day = at
    ? `<a class="or-join first" href="${esc(at)}" target="_blank" rel="noopener noreferrer">Visit timetable${when ? '<small>' + esc(when) + '</small>' : ''}</a>`
    : (when ? `<span class="or-when">${esc(when)}</span>` : '');
  document.getElementById('onlineRooms').innerHTML = strip
    ? strip.replace('<div class="online-rooms">', '<div class="online-rooms">' + day)
    : (day ? '<div class="online-rooms">' + day + '</div>' : '');
}
/* Where this centre files its grades. The assessor's own job at the end of a
   visit is to put the final grades into Appian, and until now the pack sent
   them looking for the address themselves. Set on Course admin -> Settings;
   http/https only, because the value is typed by a person and ends up in an
   href; nothing is shown at all when it is unset, since a dead link is worse
   than none. The grades stay open behind it -- copy here, paste there. */
const APPIAN = (function(){
  /* Cambridge's own address, from the CELTA Appian User Guidelines p1 -- the
     same for every centre, since what differs is the login and not the URL.
     The course setting overrides it for a centre with a bookmark or an SSO
     wrapper of its own. Built in rather than gated on that setting: Connect
     gated every Appian link on a per-centre field, the field was empty, and
     nobody ever saw the link. */
  const u = String(SETTINGS.appianUrl || '').trim();
  return /^https?:\/\//i.test(u) ? u : 'https://cambridget2.appiancloud.com/suite/';
})();
const appianBtn = (cls) =>
  `<a class="btn ${cls}" href="${APPIAN.replace(/"/g,'&quot;')}" target="_blank" rel="noopener">Open Appian</a>`;
/* Handbook 14.1: 2-3 days before, the centre must "give the assessor the
   course notification reference number". The Appian grade form gates on it,
   so a link to Appian without the reference is a door the assessor cannot
   open. Shown under the buttons, where they are about to need it. */
const refLine = () => {
  const r = String(SETTINGS.notificationRef || '').trim();
  return r ? `<p class="access" style="font-weight:500;">Course notification reference <b>${esc(r)}</b> — Appian asks for this</p>` : '';
};
/* How many teaching practices this course gives each trainee (Course admin
   > Settings). Eight when unset, which is every course made before the field
   existed -- and eight is the most the records model, so it is also the cap.
   Without it the pack said "6 of 8" and drew eight blocks for a course that
   only ever had six, showing two that were never going to be taught. */
const TP_TOTAL = (function(){ const n = parseInt(SETTINGS.tpCount, 10); return (n >= 1 && n <= HUB_MAX_TP) ? n : 8; })();

/* THE COURSE'S OWN NUMBERS, against the sections that set them. Lite recorded
   every one of these and checked none, and reported "N of TP_TOTAL" against
   the centre's own figure -- so a four-lesson course read "4 of 4" and looked
   complete to an assessor (audit, 29 Sep 2026).

   Each line carries Cambridge's own VERB, because "should" is a recommendation
   and "must" is not (Ramy, 29 Sep 2026). Nothing here blocks anything: it is
   what an assessor would ask in the room, answered in advance. */
function courseChecks(){
  const out = [];
  const say = (verb, label, state, detail, cite) => out.push({ verb, label, state, detail, cite });
  /* Contact hours: the timetable can now work this out, because it knows the
     shape of a day and how many days there are. Before the timetable existed
     this was a number somebody typed, and on C/18 nobody had (29 Sep 2026).
     Breaks and lunch are not contact; everything else on the day is. The
     typed value still wins when it is set, because a centre may count
     differently and the number belongs to them -- but when the two disagree
     the check says so, rather than quietly preferring one. */
  const tt = rec('connect_timetable_v1') || null;
  const fromTimetable = (function(){
    if (!tt || !tt.days || !tt.days.length || !tt.slots || !tt.slots.length) return null;
    const mins = tt.slots.reduce((n, sl) => {
      if (sl.kind === 'break') return n;
      const a = String(sl.from||'').match(/^(\d{1,2}):(\d{2})/), b = String(sl.to||'').match(/^(\d{1,2}):(\d{2})/);
      if (!a || !b) return n;
      const d = (+b[1]*60 + +b[2]) - (+a[1]*60 + +a[2]);
      return d > 0 ? n + d : n;
    }, 0);
    if (!mins) return null;
    return { perDay: mins, days: tt.days.length, hours: Math.round(mins * tt.days.length / 60) };
  })();
  const hours = parseInt(SETTINGS.totalHours, 10) || 0;
  const shown = hours || (fromTimetable ? fromTimetable.hours : 0);
  const disagree = hours && fromTimetable && Math.abs(hours - fromTimetable.hours) > 2;
  say('must', 'Course hours', !shown ? 'unknown' : shown >= 120 ? 'met' : 'short',
      !shown ? 'not set, and no timetable to work it out from'
        : hours && fromTimetable
          ? (disagree ? hours + ' contact hours set; the timetable comes to ' + fromTimetable.hours
                      : hours + ' contact hours, and the timetable agrees')
        : hours ? hours + ' contact hours'
        : fromTimetable.hours + ' contact hours, from the timetable (' + fromTimetable.days + ' days)',
      '3.1 — at least 120 contact hours');

  /* 13.5: the assessment in the second half of the course, as near the end as
     possible, and not on the last day. Date-only strings compared as such;
     the midpoint is worked out in UTC so no clock moves a day. */
  (function(){
    const v = String(SETTINGS.visitDate || '').slice(0, 10), s0 = String(SETTINGS.start || '').slice(0, 10), e0 = String(SETTINGS.end || '').slice(0, 10);
    const cite = '13.5 — in the second half of the course, as near the end as possible, not the last day';
    if (!v) { say('should', 'Assessment date', 'unknown', 'not set yet', cite); return; }
    if (!s0 || !e0) { say('should', 'Assessment date', 'unknown', v + ', but the course dates are not set', cite); return; }
    const ms = x => Date.UTC(+x.slice(0,4), +x.slice(5,7) - 1, +x.slice(8,10));
    const mid = (ms(s0) + ms(e0)) / 2;
    const last = v === e0, late = ms(v) >= mid;
    say('should', 'Assessment date', last ? 'short' : late ? 'met' : 'short',
        last ? v + ' is the last day of the course; the Handbook says avoid it' : late ? v + ', in the second half of the course' : v + ', in the first half of the course', cite);
  })();

  /* Two things a timetable makes checkable that nothing else could: a
     trainee teaches once a day, and a class takes no more than three hours
     of teaching practice in a day (Handbook 9.1.1 and §26). Both are about
     the SHAPE of the day, so before the timetable there was nothing to read. */
  if (tt && tt.slots && tt.slots.length) {
    const tpSlots = tt.slots.filter(sl => sl.kind === 'tp');
    const tpMins = tpSlots.reduce((n, sl) => {
      const a = String(sl.from||'').match(/^(\d{1,2}):(\d{2})/), b = String(sl.to||'').match(/^(\d{1,2}):(\d{2})/);
      if (!a || !b) return n;
      const d = (+b[1]*60 + +b[2]) - (+a[1]*60 + +a[2]);
      return d > 0 ? n + d : n;
    }, 0);
    if (tpMins) say('must', 'Teaching practice in a day', tpMins <= 180 ? 'met' : 'short',
        (tpMins/60).toFixed(tpMins % 60 ? 2 : 0).replace('.00','') + ' hours a day across ' + tpSlots.length + ' lesson' + (tpSlots.length===1?'':'s'),
        '9.1.1 — a class takes no more than three hours of teaching practice in a day');
    /* Once a day: the rotation gives each trainee one slot, but a tutor can
       change any of it, so this reads the teaching sets rather than trusting
       the shape. A set larger than the number of lessons means somebody has
       to teach twice, or somebody does not teach. */
    const R = window.hubRotation;
    if (R && tpSlots.length) {
      const sizes = {};
      const by = {};
      PEOPLE.forEach(t => { const g = String(t.group||''); (by[g] = by[g] || []).push({ token: t.id || t.token, name: t.name }); });
      let worst = 0, which = '';
      Object.keys(by).forEach(g => {
        R.setsFor(by[g]).forEach(set => { if (set.length > worst) { worst = set.length; which = 'Group ' + (g || '—'); } });
      });
      if (worst) say('must', 'Once a day each', worst <= tpSlots.length ? 'met' : 'short',
          worst <= tpSlots.length
            ? tpSlots.length + ' lessons a day, ' + worst + ' teaching — each trainee teaches once'
            : which + ' has ' + worst + ' teaching on a day with ' + tpSlots.length + ' lesson' + (tpSlots.length===1?'':'s'),
          '§26 — a trainee teaches on no more than one occasion a day');
    }
  }
  say('should', 'Teaching practices each', TP_TOTAL >= 8 ? 'met' : 'short',
      TP_TOTAL + ' per trainee', '9.1.2 — a minimum of eight occasions');

  /* Six hours, two levels one below intermediate, 40 minutes twice, never over
     an hour -- all read off the feedback sheets the tutors already filled in. */
  const BELOW = /^(a0|a1|a2|beginner|elementary|pre-int|pre int|pre-intermediate)/i;
  const perCand = PEOPLE.map(tr => {
    const hist = T.tpHistory(tr) || {};
    let mins = 0, over60 = 0, atLeast40 = 0; const levels = new Set(); let below = false;
    Object.keys(hist).forEach(n => {
      const f = ((hist[n].state || {}).f) || {};
      const m = parseInt(String(f.fTime || '').replace(/[^0-9]/g, ''), 10);
      if (m > 0) { mins += m; if (m > 60) over60++; if (m >= 40) atLeast40++; }
      const lv = String(f.fLevel || '').trim();
      if (lv) { levels.add(lv.toLowerCase()); if (BELOW.test(lv)) below = true; }
    });
    return { name: tr.name, mins, over60, atLeast40, levels: levels.size, below, taught: Object.keys(hist).length };
  }).filter(c => c.taught);
  const shortOf = (pred) => perCand.filter(pred).map(c => c.name);
  if (perCand.length) {
    /* A trainee with no minutes on any sheet is not "at six hours"; they are
       unknown, and the line says so rather than affirming a must (second
       audit, 29 Sep 2026: the old guard skipped them and read "met"). */
    const noSix = shortOf(c => c.mins && c.mins < 360), noMins = shortOf(c => !c.mins);
    say('must', 'Six hours of assessed teaching practice', noSix.length ? 'short' : noMins.length ? 'unknown' : 'met',
        noSix.length ? noSix.length + ' under six hours: ' + noSix.slice(0, 3).join(', ') + (noSix.length > 3 ? '…' : '')
          : noMins.length ? noMins.length + ' with no lesson lengths recorded yet' : 'every trainee at six hours or more',
        '9.1.1 — six hours of assessed teaching practice for each trainee');
    const oneLevel = shortOf(c => c.levels < 2);
    say('should', 'Two significantly different levels', oneLevel.length ? 'short' : 'met',
        oneLevel.length ? oneLevel.length + ' taught at one level only' : 'every trainee at two levels or more',
        '9.1.2 — at least two hours at two significantly different levels, one below intermediate');
    const noBelow = shortOf(c => !c.below);
    if (noBelow.length) say('should', 'A level below intermediate', 'short',
        noBelow.length + ' with nothing recorded below intermediate', '9.1.2 — one of which should be below intermediate');
    const short40 = shortOf(c => c.atLeast40 < 2);
    if (short40.length) say('should', 'Forty minutes, at least twice', 'short',
        short40.length + ' with fewer than two lessons of 40 minutes or more', '9.1.2 — a minimum of 40 minutes at least twice');
    const long = shortOf(c => c.over60 > 0);
    if (long.length) say('should', 'Never longer than an hour', 'short',
        long.length + ' with a lesson over 60 minutes', '9.1.2 — never longer than for one hour');
  }
  /* 7.1 sets the cohort and the group size; both are "must". */
  const n = PEOPLE.length;
  if (n) say('must', 'Trainees on the course', n >= 4 && n <= 24 ? 'met' : 'short',
      n + ' on the roster', '7.1 — minimum four, maximum 24');
  const groups = {};
  PEOPLE.forEach(tr => { const g = tr.group || ''; if (g) groups[g] = (groups[g] || 0) + 1; });
  const bad = Object.keys(groups).filter(g => groups[g] < 4 || groups[g] > 6);
  if (Object.keys(groups).length) say('must', 'Teaching practice groups', bad.length ? 'short' : 'met',
      bad.length ? bad.map(g => g + ' has ' + groups[g]).join(', ')
                 : (Object.keys(groups).length === 1 ? 'one group of ' + groups[Object.keys(groups)[0]]
                                                     : Object.keys(groups).length + ' groups, each 4 to 6'),
      '7.1 — groups must consist of 4–6 trainees');
  return out;
}
/* ---- v9 (7 Oct 2026): the assessor's welcome ------------------------------
   The pack's first screen for the one visitor from outside: who it is for,
   the visit, three numbers, and a way into each section. Screen only -- the
   printed pack starts where it always has. Design: Magic Touches, 9b. */
function ap9Visit(){
  const n = PEOPLE.length;
  const chosen = (SETTINGS.assessorVisit || []).filter(id => PEOPLE.some(p => p.id === id)).length;
  let met = 0, all = 0; try { const rows = courseChecks(); all = rows.length; met = rows.filter(r => r.state === 'met').length; } catch (e) {}
  const when = (typeof visitWhen === 'function' && visitWhen()) || '';
  const MARK = '<svg class="ap9-mark" viewBox="8 30 104 60" fill="none" aria-hidden="true"><path d="M56.1 42.2 A 24 24 0 1 0 56.1 77.8" stroke="var(--gold-lifted)" stroke-width="9" stroke-linecap="round"></path><path d="M96.1 42.2 A 24 24 0 1 0 96.1 77.8" stroke="var(--paper)" stroke-width="9" stroke-linecap="round"></path></svg>';
  const stat = (v, l) => '<div><b>' + v + '</b><span>' + l + '</span></div>';
  return '<section class="ap9" aria-label="Your visit">' + MARK
    + '<p class="k">' + esc([SETTINGS.centreName, SETTINGS.courseName].filter(Boolean).join(' \u00b7 ') || 'Assessor pack') + '</p>'
    + '<h2>Welcome to the course.</h2>'
    + (when ? '<p class="when">Your visit: <b>' + esc(when) + '</b></p>' : '<p class="when">The centre has not set the visit date yet.</p>')
    + '<div class="ap9-stats">' + stat(n, n === 1 ? 'trainee on the course' : 'trainees on the course')
      + (chosen ? stat(chosen, chosen === 1 ? 'you are observing' : 'you are observing') : '')
      + (all ? stat(met + '<small> of ' + all + '</small>', 'Handbook checks met') : '') + '</div>'
    + '<nav class="ap9-jump" id="ap9Jump" aria-label="Sections of the pack"></nav>'
    + '</section>';
}
/* the section chips, built from the headings render drew */
function ap9Chips(){
  const nav = document.getElementById('ap9Jump'); if (!nav || nav.childElementCount) return;
  const hs = [...document.querySelectorAll('#app h2.sect')];
  nav.innerHTML = hs.map((h, i) => { if (!h.id) h.id = 'ap9-s' + (i + 1); const t = (h.firstChild && h.firstChild.textContent || h.textContent).trim();
    return '<a href="#' + h.id + '">' + esc(t) + '</a>'; }).join('');
}
```
