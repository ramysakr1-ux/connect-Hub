# How it works + the pre-course key, complete build spec

Repo: `ramysakr1-ux/connect-Hub` @ `main`, read 7 Oct 2026 19:16Z.
Design: `Magic Touches.dc.html`, 14a and 14b. Drop-ins: `17_how_it_works.html` and `30_precourse_key.html` in this folder.

Both are display only, and nothing is stored. Section A covers 17 and section B covers 30, each with its own tests. The appendices hold the exact code, copied verbatim from the drop-ins. Where the two differ, the appendix wins.

---

## A. How it works (`17_how_it_works.html`): where you are on the page

**Unchanged:** the copy, the role filtering (`?for=volunteer` and the role script), the volunteer language buttons, and the FAQ markup.

### A.1 Edits

1. A CSS block goes before `</style>`.
2. A new `<script>` goes just before `</body>`, after the existing scripts.

### A.2 Sticky jump row

`.jump` becomes:
- `position:sticky; top:0; z-index:10`
- padding 10px 0, margin-top 16 (was 26)
- background `color-mix(--sand 92%, transparent)` with `backdrop-filter:blur(6px)`, the same treatment as the grades report's letter bar

`section.card` `scroll-margin-top` goes from 16 to 68px, so a jump lands below the row.

**Phone (≤600px).** The row doesn't wrap. It scrolls sideways with a hidden scrollbar, and its pills don't shrink.

**Print.** The row is hidden.

### A.3 Scroll-spy

- **Which pill is lit:** on scroll (rAF-throttled), resize and hashchange, the lit pill belongs to the last visible section whose top is at or above the row's bottom + 24px. Before the first section, the first visible pill is lit.
- **Lit pill (`a.hw-on`):** `--teal` fill and border, `--paper` text, `aria-current="location"`.
- **Transitions:** border .15s, background and colour .2s.
- **Phone:** if the row overflows, it scrolls smoothly so the lit pill stays in view.
- **Hidden sections:** sections hidden by role filtering are skipped. In `?for=volunteer` the row is already hidden by the page.

**Focus-visible:** 2px `--gold-lifted` outline, offset 2.

### A.4 Questions

- **Opening:** `details.q[open] > .a` slides in (`hw-open`, .28s, from translateY −6px, fading in).
- **Hover:** the summary turns `--teal` (.15s).

**Reduced motion:** no transitions or slide.

### A.5 Test (17)

1. Scrolling down: the pills light in turn, and the row stays on top.
2. Clicking "If you are a tutor": it lands below the row, and the tutor pill is lit.
3. Trainee view: the hidden sections' pills are skipped by the spy.
4. `?for=volunteer`: unchanged, with no row.
5. 375px: the row scrolls sideways and follows the lit pill.
6. Opening a question: the answer slides in.
7. Print: no row.

---

## B. Pre-course key (`30_precourse_key.html`): try it first

**Trainee view only** (`IS_TRAINEE`).
- **Tutors and assessors:** unchanged.
- **Unchanged:** the key data (`precourse-key.js`), the opens-two-days-before gate, the copy and print.

### B.1 Edits

1. A CSS block goes before `</style>`. All its rules are scoped under `#app.pk`.
2. An IIFE goes after the `hub:ready` listener. It re-applies after every `render()` via a `MutationObserver` on `#app` (childList).

### B.2 Covered answers

**Covered task (`.task.pk-cov`).**
- `.a` gets `filter:blur(6px)`, opacity .55, `user-select:none` and `pointer-events:none`. The answer stays in the DOM, so print and screen readers are unaffected.
- Lifting it transitions filter and opacity over .25s.

**Tasks with no key** (`.a.none`, "Your own answer…"): never covered.

**"Show the answer" button (`button.pk-show`).**
- Placement: appended to each covered task.
- Style: 0.8rem 600 `--teal`, `--paper` fill, 1.5px `--sand-line` border, radius 999, padding 5/12, margin-top 10.
- Hover: border `--teal`, lifts 1px.
- Click: uncovers that task, removes the button, and the task's `h3` gains a teal ✓ (`.pk-seen`).

### B.3 Tools row

The existing `.tools` (Print / Save as PDF) gains two things.

**A first button, `.btn.pk-all`.**
- Reads "Show all the answers": uncovers every keyed task and counts them all as checked.
- Then reads "Cover them again": covers all and resets the count.

**A last item, `.pk-count`** (`aria-live="polite"`):
- Text: "**n** of N checked", where N is the tasks that have a key.
- Bar: 90×5px, `oklch(91% 0.012 82)` track, `--teal` fill (.35s).

**State:** a set of task ids in memory for this visit. It survives re-renders (`hub:ready`) and resets on reload. Nothing is stored.

### B.4 Print

- Every answer is shown, with no blur.
- No buttons, count or ticks.

**Reduced motion:** no transitions.

### B.5 Test (30)

1. Trainee, after the key opens: every keyed answer is blurred with "Show the answer", and own-answer tasks are plain.
2. Showing task 3: it lifts, gets a ✓, and the count reads "1 of N".
3. "Show all the answers": all lift and the count is full. "Cover them again" covers all and resets the count.
4. Before the opening date: the existing "The key opens on …" message, with no tools.
5. Tutor or assessor: every answer visible, with no buttons.
6. Print, from any state: every answer visible.

---

## Appendix A: 17 existing jump and card rules (verbatim, `main`)
```css
  .jump{display:flex; flex-wrap:wrap; gap:8px; margin:26px 0 0;}
  .jump a{font-family:'Instrument Sans','Karla',sans-serif; font-size:11px; font-weight:600;
    letter-spacing:0.1em; text-transform:uppercase; text-decoration:none; color:var(--ink);
    border:1.5px solid var(--sand-line); border-radius:999px; padding:7px 14px;
    background:var(--box); transition:border-color .15s;}
  .jump a:hover{border-color:var(--grey); color:var(--ink);}

  section.card{background:var(--surface); border-radius:10px; border-left:5px solid var(--gold);
    margin-top:22px; padding:20px 24px 24px; scroll-margin-top:16px;}
  section.card.t{border-left-color:var(--teal);}
```

## Appendix B: 17 v2 CSS (verbatim)
```css
  /* ---- v2 (7 Oct 2026): where you are on the page ------------------------------
     The jump row stays at the top as you read and lights the section you are
     in; an answer in Questions opens with a short slide instead of a jump.
     Display only; the role filtering and the volunteer languages are
     untouched. Design: Magic Touches, 14a. */
  .jump{position:sticky; top:0; z-index:10; padding:10px 0; margin-top:16px; background:color-mix(in oklab, var(--sand) 92%, transparent); backdrop-filter:blur(6px);}
  .jump a{transition:border-color .15s, background-color .2s, color .2s;}
  .jump a.hw-on{background:var(--teal); border-color:var(--teal); color:var(--paper);}
  .jump a:focus-visible{outline:2px solid var(--gold-lifted); outline-offset:2px;}
  section.card{scroll-margin-top:68px;}
  details.q[open] > .a{animation:hw-open .28s cubic-bezier(.2,.7,.2,1) both;}
  details.q > summary{transition:color .15s;}
  details.q > summary:hover{color:var(--teal);}
  @keyframes hw-open{from{opacity:0; transform:translateY(-6px);}to{opacity:1; transform:none;}}
  @media(prefers-reduced-motion:reduce){ .jump a{transition:none;} details.q[open] > .a{animation:none;} }
  @media(max-width:600px){ .jump{flex-wrap:nowrap; overflow-x:auto; -webkit-overflow-scrolling:touch; scrollbar-width:none;} .jump a{flex:none;} }
  @media print{ .jump{position:static; display:none;} }
```

## Appendix C: 17 v2 JS (verbatim)
```html
<script>
/* ---- v2 (7 Oct 2026): where you are on the page --------------------------------
   Scroll-spy on the jump row: the section nearest the top (below the sticky
   row) lights its pill. Hidden sections (role filtering) are skipped.
   Stores nothing. */
(function(){
  var jump = document.querySelector('.jump'); if (!jump) return;
  var pills = Array.prototype.slice.call(jump.querySelectorAll('a[href^="#"]'));
  function spy(){
    var y = jump.getBoundingClientRect().bottom + 24, cur = null;
    pills.forEach(function (p) { var s = document.getElementById(p.getAttribute('href').slice(1)); if (!s || s.hidden || p.hidden) return; if (s.getBoundingClientRect().top <= y) cur = p; });
    if (!cur) cur = pills.filter(function (p) { return !p.hidden; })[0];
    pills.forEach(function (p) { var on = p === cur; p.classList.toggle('hw-on', on); if (on) p.setAttribute('aria-current', 'location'); else p.removeAttribute('aria-current'); });
    if (cur && jump.scrollWidth > jump.clientWidth) { var l = cur.offsetLeft - 12; if (l < jump.scrollLeft || cur.offsetLeft + cur.offsetWidth > jump.scrollLeft + jump.clientWidth) jump.scrollTo({ left: l, behavior: 'smooth' }); }
  }
  var raf = 0; window.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(function () { raf = 0; spy(); }); }, { passive: true });
  window.addEventListener('resize', spy); window.addEventListener('hashchange', function () { setTimeout(spy, 50); });
  setTimeout(spy, 0);
})();
</script>
```

## Appendix D: 30 existing task rules (verbatim, `main`)
```css
  .task{background:var(--surface); border:1px solid var(--sand-line); border-radius:10px; padding:16px 20px; margin-top:12px; page-break-inside:avoid;}
  .task h3{margin:0 0 6px; font-family:'Instrument Sans','Karla',sans-serif; font-size:0.78rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:var(--teal);}
  .task .q{margin:0; font-size:0.92rem; line-height:1.6; white-space:pre-wrap; color:var(--ink-warm);}
  .task .a{margin:10px 0 0; padding:10px 14px; border-left:3px solid var(--gold); background:var(--field); font-size:0.92rem; line-height:1.65; white-space:pre-wrap;}
  .task .a.none{color:var(--grey); font-style:italic; border-left-color:var(--sand-line);}
```

## Appendix E: 30 v2 CSS (verbatim)
```css
  /* ---- v2 (7 Oct 2026): try it first -------------------------------------------
     For the trainee, each answer starts covered, with "Show the answer" to
     lift it, so the key can be used the way it is meant: try, then check. A
     count says how many have been checked, and "Show all" lifts the lot. Tutors
     and assessors see every answer as before; print always shows every
     answer. Nothing is stored. Design: Magic Touches, 14b. */
  .pk .task .a{transition:filter .25s ease, opacity .25s ease;}
  .pk .task.pk-cov .a{filter:blur(6px); opacity:.55; user-select:none; pointer-events:none;}
  .pk .task.pk-cov .a.none{filter:none; opacity:1; pointer-events:auto;}
  .pk-show{font:inherit; font-size:0.8rem; font-weight:600; color:var(--teal); background:var(--paper); border:1.5px solid var(--sand-line); border-radius:999px; padding:5px 12px; cursor:pointer; margin-top:10px;
    transition:border-color .15s, transform .15s;}
  .pk-show:hover{border-color:var(--teal); transform:translateY(-1px);}
  .pk-show:focus-visible, .pk-all:focus-visible{outline:2px solid var(--gold-lifted); outline-offset:2px;}
  .pk .task.pk-seen h3::after{content:'\2713'; margin-left:8px; color:var(--teal);}
  .pk-count{font-size:0.82rem; color:var(--grey);}
  .pk-count b{color:var(--ink); font-variant-numeric:tabular-nums;}
  .pk-bar{display:inline-block; width:90px; height:5px; margin-left:8px; vertical-align:2px; border-radius:3px; background:oklch(91% 0.012 82); overflow:hidden;}
  .pk-bar i{display:block; height:100%; background:var(--teal); border-radius:3px; transition:width .35s cubic-bezier(.2,.7,.2,1);}
  @media(prefers-reduced-motion:reduce){ .pk .task .a, .pk-show, .pk-bar i{transition:none;} }
  @media print{ .pk .task.pk-cov .a{filter:none; opacity:1;} .pk-show, .pk-count{display:none;} .pk .task.pk-seen h3::after{content:none;} }
```

## Appendix F: 30 v2 JS (verbatim)
```js
/* ---- v2 (7 Oct 2026): try it first -------------------------------------------
     For the trainee, each answer starts covered, with "Show the answer" to
     lift it, so the key can be used the way it is meant: try, then check. A
     count says how many have been checked, and "Show all" lifts the lot. Tutors
     and assessors see every answer as before; print always shows every
     answer. Nothing is stored. Design: Magic Touches, 14b. */
  .pk .task .a{transition:filter .25s ease, opacity .25s ease;}
  .pk .task.pk-cov .a{filter:blur(6px); opacity:.55; user-select:none; pointer-events:none;}
  .pk .task.pk-cov .a.none{filter:none; opacity:1; pointer-events:auto;}
  .pk-show{font:inherit; font-size:0.8rem; font-weight:600; color:var(--teal); background:var(--paper); border:1.5px solid var(--sand-line); border-radius:999px; padding:5px 12px; cursor:pointer; margin-top:10px;
    transition:border-color .15s, transform .15s;}
  .pk-show:hover{border-color:var(--teal); transform:translateY(-1px);}
  .pk-show:focus-visible, .pk-all:focus-visible{outline:2px solid var(--gold-lifted); outline-offset:2px;}
  .pk .task.pk-seen h3::after{content:'\2713'; margin-left:8px; color:var(--teal);}
  .pk-count{font-size:0.82rem; color:var(--grey);}
  .pk-count b{color:var(--ink); font-variant-numeric:tabular-nums;}
  .pk-bar{display:inline-block; width:90px; height:5px; margin-left:8px; vertical-align:2px; border-radius:3px; background:oklch(91% 0.012 82); overflow:hidden;}
  .pk-bar i{display:block; height:100%; background:var(--teal); border-radius:3px; transition:width .35s cubic-bezier(.2,.7,.2,1);}
  @media(prefers-reduced-motion:reduce){ .pk .task .a, .pk-show, .pk-bar i{transition:none;} }
  @media print{ .pk .task.pk-cov .a{filter:none; opacity:1;} .pk-show, .pk-count{display:none;} .pk .task.pk-seen h3::after{content:none;} }
</style>
</head>
<body>
<div class="board">
  <a class="back" id="back" href="index.html">&#8592; Back</a>
  <div id="app"></div>
</div>
<script src="hub-shared.js?v=202610072205">
```
