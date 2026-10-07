# Tutor dashboard, daily view: complete build spec

Repo: `ramysakr1-ux/connect-Hub` @ `main`, read 7 Oct 2026. The setup welcome v2 is already live there.
Design: `Magic Touches.dc.html`, 6a and 6b. Drop-in: `5_tutor_dashboard.html` in this folder, built on the current `main` (setup welcome included).

Display only: nothing is stored, and the queue, the tabs, `paintJoin`'s words and behaviour, and every key are unchanged. Sections 1–3 cover every element, state, hover, focus, motion, phone and print rule, and the logic. The appendices hold the exact code, copied verbatim from the drop-in. Where the two differ, the appendix wins.

## What changes (four edits)

1. `<div class="dv6-brief" id="dv6Brief" hidden>` goes immediately before `#queue`.
2. `paint()` calls `paintBrief()` after `paintRows()`.
3. `paintBrief()` and `DV6_FIRST` sit just below `paint()`.
4. A CSS block goes before `</style>`.

---

## 1. The day line (`#dv6Brief`, 6a)

**Frame.** Flex, centred, gap 8, wraps, margin-top 22.
- Hidden until first painted.
- Never drawn on the setup screen, because `paint()` returns before `paintBrief` while the card shows.

**Parts, in order. Each appears only when it applies.**

| # | Part | Source | Text |
|---|---|---|---|
| 1 | `.dv6-date` | `hubToday()` (demo clock) or the machine's date | "Tuesday 6 October" (en-GB, weekday long, day, month long) |
| 2 | Course day | `connect_timetable_v1.days` | "Day **N** of M", or "Starts in **N** day(s)" before day one, or "The course is finished" after the last |
| 3 | Teaching | today's `days[i].tp` | `a.dv6-chip.tp.now` "TP **n** today" → `23_timetable.html`. Otherwise the next day with `tp`: `a.dv6-chip.tp` "Next TP: **TP n**, Thu 8 Oct" |
| 4 | Deadline | `connect_assignment_wording_v2`, keys from `hubAssignmentOrder`, released only (`hubReleased`), with a `due` | the open one (`HubDue.state(due)`, not past) with the smallest `ms`: "FOL due · **3 days left**" (`ASSIGN_NAMES` + `HubDue`'s own text). `.soon` inside the last 24 hours |
| 5 | All clear | trainees on the course, and no TP with `tpState().act` and no assignment row with `s.act` | "✓ Nothing waiting on you" |

### Styles

| Element | Spec |
|---|---|
| `.dv6-date` | Newsreader 700, 1.15rem, `--teal-deep`, margin-right 6 (full width at ≤560px) |
| `.dv6-chip` | inline-flex, baseline, gap 4, padding 5 11, radius 999, `--paper` fill, 1px `--sand-line`, Karla 0.8rem `--ink-warm`, nowrap |
| `.dv6-chip b` | Newsreader 0.95rem, `--ink` |
| `a.dv6-chip` hover | lifts 2px, border `--teal` (transitions .15s) |
| `a.dv6-chip` focus-visible | 2px `--gold-lifted` outline, offset 2 |
| `.tp.now` | `--gold-wash` fill, `--gold` border, `b` in `--gold-deep` |
| `.due.soon` | `--gold-lifted` fill and border, `b` in `--ink-warm` |
| `.clear` | fill `color-mix(--teal 8%, --paper)`, border `oklch(78% 0.04 195)`, `--teal-deep`, 700 |
| print | hidden |

### Count-up
- **When:** the first time `paintBrief` runs, and only if `prefers-reduced-motion` isn't set.
- **What:** each `#queue .qcard .n` with a value above 0 counts from 0 to its value over 700ms, ease-out cubic (`1 − (1−k)³`), through `requestAnimationFrame`.
- **After that:** later paints, such as a tab click, show the number straight away.

---

## 2. The second tutor's welcome (`.welcome.join`, 6b)

CSS only. `paintJoin`'s markup and words are untouched. The setup card's `.welcome` isn't used any more (v2 replaced it), so these rules only reach the join card.

| Element | Spec |
|---|---|
| `.welcome.join` | relative, overflow hidden, `--teal-deep`, no top border, radius 16, padding 34 36 30, no max-width, `--paper` text |
| `.eyebrow` | `oklch(80% 0.1 75)`, 11px, tracking 0.26em |
| `h2` | `--paper`, `clamp(32px,4.4vw,48px)`, line-height 1.02, tracking −0.02em |
| `.wnow` | fill `oklch(37.5% 0.058 195 / .55)`, no border, radius 12, text `oklch(91% 0.018 190)`, `b` in `--paper` |
| `.wname` | the name block becomes a sheet: max-width 480, `--paper`, `--ink` text, radius 14, padding 20 22 18, rotated −1°, shadow `0 24px 44px -24px oklch(15% 0.04 195 / .7)`. The existing signature (`.wsig`) sits inside it as before |
| `.wgo` top border | `oklch(99.5% 0.004 90 / .2)` |
| `.btn.primary` ("Take me to the page") | `--gold-lifted` fill and border, `--ink-warm` text. Hover: `--gold` |
| `.linkbtn` | `oklch(91% 0.018 190)`, underline at 40%. Hover: `--paper` with full underline |
| ≤560px | padding 24 18 20, the sheet sits straight |

---

## 3. Test

1. **Day 2 with TP1 today:** "Tuesday 6 October · Day 2 of 20 · TP 1 today (gold) · FOL due · 3 days left". Clicking "TP 1 today" opens the timetable.
2. **A day with no TP:** "Next TP: TP 2, Wed 7 Oct".
3. **A deadline inside 24 hours:** its chip is solid gold.
4. **No feedback or marking waiting:** "✓ Nothing waiting on you" appears. It goes once anything turns in.
5. **First load:** the queue numbers count up. Clicking a queue card doesn't count them again.
6. **Before day one, and after the end:** "Starts in N days" and "The course is finished".
7. **A course with no timetable:** only the date, plus the deadline and all-clear if they apply.
8. **Second tutor (`chub:joined`):** the deep-teal welcome with the name on a tilted sheet and a gold button. "Take me to the page" fades it away as before.
9. **The setter's first-run card:** unchanged, and no day line.
10. **Reduced motion:** no count-up and no lift. **Print:** no day line.

---

## Appendix A: v6 CSS (verbatim)
```css
  /* ---- v6 (7 Oct 2026): the day line, a calm empty queue, the joining card ---- */
  .dv6-brief{display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin:22px 0 0;}
  .dv6-brief[hidden]{display:none;}
  .dv6-date{font-family:'Newsreader',Georgia,serif; font-weight:700; font-size:1.15rem; color:var(--teal-deep); margin-right:6px;}
  .dv6-chip{display:inline-flex; align-items:baseline; gap:4px; padding:5px 11px; border-radius:999px; background:var(--paper); border:1px solid var(--sand-line);
    font-family:'Karla',sans-serif; font-size:0.8rem; color:var(--ink-warm); text-decoration:none; white-space:nowrap;}
  .dv6-chip b{font-family:'Newsreader',Georgia,serif; font-size:0.95rem; color:var(--ink);}
  a.dv6-chip{transition:transform .15s ease, border-color .15s;}
  a.dv6-chip:hover{transform:translateY(-2px); border-color:var(--teal); color:var(--ink-warm);}
  a.dv6-chip:focus-visible{outline:2px solid var(--gold-lifted); outline-offset:2px;}
  .dv6-chip.tp.now{background:var(--gold-wash); border-color:var(--gold); color:var(--ink-warm);}
  .dv6-chip.tp.now b{color:var(--gold-deep);}
  .dv6-chip.due.soon{background:var(--gold-lifted); border-color:var(--gold-lifted);} .dv6-chip.due.soon b{color:var(--ink-warm);}
  .dv6-chip.clear{background:color-mix(in oklab, var(--teal) 8%, var(--paper)); border-color:oklch(78% 0.04 195); color:var(--teal-deep); font-weight:700;}
  /* the second tutor's welcome, in the setup welcome's language */
  .welcome.join{position:relative; overflow:hidden; background:var(--teal-deep); border-top:0; border-radius:16px; padding:34px 36px 30px; max-width:none; color:var(--paper);}
  .welcome.join .eyebrow{color:oklch(80% 0.1 75); font-size:11px; letter-spacing:0.26em;}
  .welcome.join h2{color:var(--paper); font-size:clamp(32px,4.4vw,48px); line-height:1.02; letter-spacing:-0.02em;}
  .welcome.join .wnow{background:oklch(37.5% 0.058 195 / .55); border:0; border-left:0; color:oklch(91% 0.018 190); border-radius:12px;}
  .welcome.join .wnow b{color:var(--paper);}
  .welcome.join .wname{max-width:480px; background:var(--paper); color:var(--ink); border-radius:14px; padding:20px 22px 18px; transform:rotate(-1deg);
    box-shadow:0 24px 44px -24px oklch(15% 0.04 195 / .7);}
  .welcome.join .wgo{border-top-color:oklch(99.5% 0.004 90 / .2);}
  .welcome.join .wgo .btn.primary{background:var(--gold-lifted); border-color:var(--gold-lifted); color:var(--ink-warm);}
  .welcome.join .wgo .btn.primary:hover{background:var(--gold); border-color:var(--gold);}
  .welcome.join .linkbtn{color:oklch(91% 0.018 190); text-decoration-color:oklch(91% 0.018 190 / .4);}
  .welcome.join .linkbtn:hover{text-decoration-color:var(--paper); color:var(--paper);}
  @media(prefers-reduced-motion:reduce){ a.dv6-chip{transition:none;} }
  @media(max-width:560px){ .welcome.join{padding:24px 18px 20px;} .welcome.join .wname{transform:none;} .dv6-date{flex-basis:100%;} }
  @media print{ .dv6-brief{display:none;} }
```

## Appendix B: v6 JS (verbatim)
```js
/* ---- v6 (7 Oct 2026): the day, in one line -------------------------------
   Above the queue: today's date, where today sits in the course, whether
   anyone teaches today (or when next), the nearest open deadline, and --
   when the queue is empty -- that nothing is waiting. All of it read from
   what the course already holds (timetable, wording, HubDue); nothing is
   stored. The queue's numbers count up once, the first time they are drawn.
   Design: Magic Touches, 6a. */
let DV6_FIRST = true;
function paintBrief(){
  const host = document.getElementById('dv6Brief'); if (!host) return;
  const rd = k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
  const tt = rd('connect_timetable_v1') || {}, days = Array.isArray(tt.days) ? tt.days : [];
  const p2 = n => String(n).padStart(2, '0');
  const now = new Date();
  const TODAY = (window.hubToday && hubToday()) || (now.getFullYear() + '-' + p2(now.getMonth() + 1) + '-' + p2(now.getDate()));
  const dt = d => new Date(d + 'T12:00:00');
  const between = (a, b) => Math.round((dt(b) - dt(a)) / 864e5);
  const chips = [];
  chips.push('<span class="dv6-date">' + esc(dt(TODAY).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })) + '</span>');
  if (days.length) {
    const i = days.findIndex(d => d && d.date === TODAY);
    if (i >= 0) chips.push('<span class="dv6-chip">Day <b>' + (i + 1) + '</b> of ' + days.length + '</span>');
    else if (TODAY < days[0].date) { const n = between(TODAY, days[0].date); chips.push('<span class="dv6-chip">Starts in <b>' + n + '</b> day' + (n === 1 ? '' : 's') + '</span>'); }
    else if (TODAY > days[days.length - 1].date) chips.push('<span class="dv6-chip">The course is finished</span>');
    const today = i >= 0 ? days[i] : null;
    if (today && today.tp) chips.push('<a class="dv6-chip tp now" href="23_timetable.html">TP <b>' + esc(today.tp) + '</b> today</a>');
    else { const nx = days.find(d => d && d.tp && d.date > TODAY); if (nx) chips.push('<a class="dv6-chip tp" href="23_timetable.html">Next TP: <b>TP ' + esc(nx.tp) + '</b>, ' + esc(dt(nx.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })) + '</a>'); }
  }
  /* the nearest deadline still open, among the assignments the trainees can see */
  try {
    const w = rd('connect_assignment_wording_v2') || {};
    const keys = (window.hubAssignmentOrder ? hubAssignmentOrder(w) : Object.keys(w)).filter(k => w[k] && w[k].due && (!window.hubReleased || hubReleased(w, k)));
    const open = keys.map(k => ({ k, st: window.HubDue ? HubDue.state(w[k].due) : null })).filter(x => x.st && x.st.has && !x.st.past).sort((a, b) => a.st.ms - b.st.ms)[0];
    if (open) chips.push('<span class="dv6-chip due' + (open.st.soon ? ' soon' : '') + '">' + esc(ASSIGN_NAMES[open.k] || open.k) + ' due \u00b7 <b>' + esc(open.st.text) + '</b></span>');
  } catch (e) {}
  /* nothing waiting on the tutor */
  const list = people();
  const waiting = list.filter(t => tpState(t).act).length + assignmentRows(list).filter(r => r.s.act).length;
  if (list.length && !waiting) chips.push('<span class="dv6-chip clear">\u2713 Nothing waiting on you</span>');
  host.innerHTML = chips.join('');
  host.hidden = false;
  /* the numbers count up, once */
  if (DV6_FIRST && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    DV6_FIRST = false;
    document.querySelectorAll('#queue .qcard .n').forEach(el => {
      const to = parseInt(el.textContent, 10) || 0; if (!to) return;
      const t0 = performance.now(), dur = 700;
      const step = t => { const k = Math.min(1, (t - t0) / dur); el.textContent = String(Math.round(to * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(step); };
      el.textContent = '0'; requestAnimationFrame(step);
    });
  } else DV6_FIRST = false;
}
```

## Appendix C: markup and call edits (verbatim)
```html
  <div class="dv6-brief" id="dv6Brief" hidden></div>
```
```js
  paintQueue(); paintTabsCounts(); paintRows(); paintBrief();
```
