# CELTA 5: the booklet's route, complete build spec

Repo: `ramysakr1-ux/connect-Hub` @ `main`, read 7 Oct 2026.
Design: `Magic Touches.dc.html`, 7a. Drop-in: `20_celta5.html` in this folder.

Display only. Cambridge's wording, the signatures, the PDF builder and the printout are unchanged, and the route is hidden in print. The only markup change is that the `nav.jump` line in `render()` is replaced. Sections 1–4 cover the stations, styles, motion and phone behaviour. The appendices hold the exact code, copied verbatim from the drop-in. Where the two differ, the appendix wins.

## 1. What changes (three edits)

1. `<nav class="jump">…nine links…</nav>` in `render()` becomes `${c5Route([...], my)}`. Each station is `[anchor, label, [stateText, tone]]`, in the booklet's order.
2. `c5Conf`, `c5Count`, `c5Closed` and `c5Route` go just above `stageState`.
3. A CSS block goes before `</style>`.

The old `.jump` rules are left in place, now unused, so the drop-in diff stays small. Delete them when merging if you like.

## 2. The stations (same anchors as before)

| # | Anchor | Label | State | Tone |
|---|---|---|---|---|
| 1 | `#read` | Read and confirm | "n of 2 signed", from `conf.portfolio.at` and `conf.appeals.at` | 2 → good, 1 → attn, 0 → open |
| 2 | `#s1` | Stage 1 | `st1`, from the existing `stageState` | Signed → good · Returned — to sign → attn · With your tutor → wait · Open → open |
| 3 | `#s2` | Stage 2 | `st2` | as above |
| 4 | `#s3` | Stage 3 | `st3` | as above |
| 5 | `#tp` | Teaching practice | "n returned" (`tpRows().length`), or "None yet" | good when above 0 |
| 6 | `#obs` | Observations | "n turned in" (`obsRows().length`), or "None yet" | good when above 0 |
| 7 | `#wa` | Written assignments | "n of 4 closed" (fol, lrt, lsrt, lfc with `stage === 'closed'`) | 4 → good, 1–3 → wait, 0 → open |
| 8 | `#att` | Attendance | none | open |
| 9 | `#final` | Final declaration | `stF`: Signed → good, "Tutor has signed — your turn" → attn, Open → open | as given |

**The first attn station** gets `.first` and pulses. That is the next thing to sign.

## 3. Styles

| Element | Spec |
|---|---|
| `.c5r` | margin 0 0 24, padding 16 14 14, `--paper`, 1px `--sand-line`, radius 12, `overflow-x:auto` (a phone scrolls the route, never the page) |
| `.c5r ol` | a grid of nine columns, `minmax(96px,1fr)` |
| `ol::before` (the line) | 2px `--row-line`, top 13, from the first dot's centre to the last (`calc(100% / 18)` in from each end) |
| `a` | column, centred, gap 3, padding 0 4 2, `--ink`, no underline, radius 8 |
| `i` (dot) | 28px circle, `--paper`, 2px `--sand-line`, Karla 700 12px, `--grey`, showing the number (or ✓ when good). Transition: transform .15s |
| `b` | margin-top 5, 0.76rem 700, line-height 1.25, balanced wrap |
| `small` | 0.7rem, line-height 1.3, `--grey`, balanced wrap |

| Tone | Dot | Small text |
|---|---|---|
| good | `--teal` fill and border, `--paper` ✓ | `--teal-deep` |
| attn | `--gold-lifted` fill and border, `--ink-warm` text | `--gold-deep`, 700 |
| wait | border `--pill-wait-line`, text `--pill-wait-text` | `--pill-wait-text` |
| open | defaults | defaults |

**Pulse.** `li.attn.first i` runs `c5r-pulse`: 2.2s, a gold ring 0 → 9px from `oklch(70% 0.12 72 / .55)`.

**Hover:** the dot scales to 1.12, and the label turns `--teal` with an underline (offset 3).

**Focus-visible:** 2px `--gold-lifted` outline, offset 2.

**Arriving at a section.** `section.part:target` flashes a 3px gold ring that fades over 1.4s. The browser's own hash jump does the scrolling.

**Reduced motion:** no transitions, pulse or flash.

**Print:** `.c5r` hidden.

## 4. Test

1. **A fresh candidate:** route reads 0 of 2 signed, Open ×3, None yet ×2, 0 of 4 closed, Attendance, Open. Nothing pulses.
2. **One confirmation signed:** Read and confirm turns gold, "1 of 2 signed", and pulses.
3. **Stage 1 returned to the candidate:** "Returned — to sign" in gold. If it's the first gold station, it's the one that pulses.
4. **Stage 2 submitted:** "With your tutor", grey-blue.
5. **TPs returned, sheets turned in, assignments closed:** the counts update and turn teal.
6. **Clicking a station** jumps to its section, which flashes gold.
7. **Tutor's view** (`?trainee=`): the same route, with the same states.
8. **375px:** the route scrolls sideways inside its box, and the page doesn't.
9. **Print and the Cambridge PDF:** unchanged, with no route.

---

## Appendix A: v7 CSS (verbatim)
```css
  /* ---- v7 (7 Oct 2026): the booklet's route ---- */
  .c5r{margin:0 0 24px; padding:16px 14px 14px; background:var(--paper); border:1px solid var(--sand-line); border-radius:12px; overflow-x:auto; -webkit-overflow-scrolling:touch;}
  .c5r ol{list-style:none; margin:0; padding:0; display:grid; grid-template-columns:repeat(9,minmax(96px,1fr)); position:relative;}
  .c5r ol::before{content:''; position:absolute; left:calc(100% / 18); right:calc(100% / 18); top:13px; height:2px; background:var(--row-line);}
  .c5r li{position:relative; text-align:center;}
  .c5r a{display:flex; flex-direction:column; align-items:center; gap:3px; padding:0 4px 2px; text-decoration:none; color:var(--ink); border-radius:8px;}
  .c5r i{position:relative; z-index:1; width:28px; height:28px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-style:normal;
    font:700 12px 'Karla',sans-serif; background:var(--paper); border:2px solid var(--sand-line); color:var(--grey); transition:transform .15s ease;}
  .c5r b{margin-top:5px; font-size:0.76rem; font-weight:700; line-height:1.25; text-wrap:balance;}
  .c5r small{font-size:0.7rem; line-height:1.3; color:var(--grey); text-wrap:balance;}
  .c5r li.good i{background:var(--teal); border-color:var(--teal); color:var(--paper);}
  .c5r li.good small{color:var(--teal-deep);}
  .c5r li.attn i{background:var(--gold-lifted); border-color:var(--gold-lifted); color:var(--ink-warm);}
  .c5r li.attn small{color:var(--gold-deep); font-weight:700;}
  .c5r li.attn.first i{animation:c5r-pulse 2.2s ease-out infinite;}
  .c5r li.wait i{border-color:var(--pill-wait-line); color:var(--pill-wait-text);}
  .c5r li.wait small{color:var(--pill-wait-text);}
  .c5r a:hover i{transform:scale(1.12);}
  .c5r a:hover b{color:var(--teal); text-decoration:underline; text-underline-offset:3px;}
  .c5r a:focus-visible{outline:2px solid var(--gold-lifted); outline-offset:2px;}
  section.part:target{animation:c5r-hit 1.4s ease-out 1;}
  @keyframes c5r-pulse{0%{box-shadow:0 0 0 0 oklch(70% 0.12 72 / .55);}70%{box-shadow:0 0 0 9px oklch(70% 0.12 72 / 0);}100%{box-shadow:0 0 0 0 oklch(70% 0.12 72 / 0);}}
  @keyframes c5r-hit{0%{box-shadow:0 0 0 3px oklch(70% 0.12 72 / .7);}100%{box-shadow:0 0 0 3px oklch(70% 0.12 72 / 0);}}
  @media(prefers-reduced-motion:reduce){ .c5r i{transition:none;} .c5r li.attn.first i, section.part:target{animation:none;} }
  @media print{ .c5r{display:none !important;} }
```

## Appendix B: v7 JS (verbatim)
```js
/* ---- v7 (7 Oct 2026): the booklet's route ---- */
  .c5r{margin:0 0 24px; padding:16px 14px 14px; background:var(--paper); border:1px solid var(--sand-line); border-radius:12px; overflow-x:auto; -webkit-overflow-scrolling:touch;}
  .c5r ol{list-style:none; margin:0; padding:0; display:grid; grid-template-columns:repeat(9,minmax(96px,1fr)); position:relative;}
  .c5r ol::before{content:''; position:absolute; left:calc(100% / 18); right:calc(100% / 18); top:13px; height:2px; background:var(--row-line);}
  .c5r li{position:relative; text-align:center;}
  .c5r a{display:flex; flex-direction:column; align-items:center; gap:3px; padding:0 4px 2px; text-decoration:none; color:var(--ink); border-radius:8px;}
  .c5r i{position:relative; z-index:1; width:28px; height:28px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-style:normal;
    font:700 12px 'Karla',sans-serif; background:var(--paper); border:2px solid var(--sand-line); color:var(--grey); transition:transform .15s ease;}
  .c5r b{margin-top:5px; font-size:0.76rem; font-weight:700; line-height:1.25; text-wrap:balance;}
  .c5r small{font-size:0.7rem; line-height:1.3; color:var(--grey); text-wrap:balance;}
  .c5r li.good i{background:var(--teal); border-color:var(--teal); color:var(--paper);}
  .c5r li.good small{color:var(--teal-deep);}
  .c5r li.attn i{background:var(--gold-lifted); border-color:var(--gold-lifted); color:var(--ink-warm);}
  .c5r li.attn small{color:var(--gold-deep); font-weight:700;}
  .c5r li.attn.first i{animation:c5r-pulse 2.2s ease-out infinite;}
  .c5r li.wait i{border-color:var(--pill-wait-line); color:var(--pill-wait-text);}
  .c5r li.wait small{color:var(--pill-wait-text);}
  .c5r a:hover i{transform:scale(1.12);}
  .c5r a:hover b{color:var(--teal); text-decoration:underline; text-underline-offset:3px;}
  .c5r a:focus-visible{outline:2px solid var(--gold-lifted); outline-offset:2px;}
  section.part:target{animation:c5r-hit 1.4s ease-out 1;}
  @keyframes c5r-pulse{0%{box-shadow:0 0 0 0 oklch(70% 0.12 72 / .55);}70%{box-shadow:0 0 0 9px oklch(70% 0.12 72 / 0);}100%{box-shadow:0 0 0 0 oklch(70% 0.12 72 / 0);}}
  @keyframes c5r-hit{0%{box-shadow:0 0 0 3px oklch(70% 0.12 72 / .7);}100%{box-shadow:0 0 0 3px oklch(70% 0.12 72 / 0);}}
  @media(prefers-reduced-motion:reduce){ .c5r i{transition:none;} .c5r li.attn.first i, section.part:target{animation:none;} }
  @media print{ .c5r{display:none !important;} }
</style>
<link rel="stylesheet" href="hub-house.css?v=202610072028">
</head>
<body class="hub-celta5 hub-paper hub-course">
<div class="board">
  <a class="back" id="back" href="index.html">&larr; Back</a>
  <div id="app"></div>
</div>
<!-- Cambridge's booklet, drawn in the browser: pdf-lib and its font kit as
     UMD scripts, then the port of Connect's replica engine. Loaded on every
     open of this page (1.3 MB, cached by the browser); the master PDF and the
     fonts come from the store only when the button is pressed. -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"></script>
<script src="https://unpkg.com/@pdf-lib/fontkit@1.1.1/dist/fontkit.umd.min.js"></script>
<script src="celta5-pdf.js?v=202610072028"></script>
<script src="hub-hand.js?v=202610072028"></script>
<script src="hub-ink.js?v=202610072028"></script>
<script src="assignment-defaults.js?v=202610072028"></script>
<script src="celta5-text.js?v=202610072028"></script>
<script src="celta5-appendix.js?v=202610072028"></script>
<script src="celta5-criteria.js?v=202610072028"></script>
<script src="hub-tracker.js?v=202610072028"></script>
<script src="observation-defaults.js?v=202610072028"></script>
<script src="hub-shared.js?v=202610072028"></script>
<script src="hub-store.js?v=202610072028"></script>
<script src="hub-say.js?v=202610072028"></script>
<script src="hub-sync.js?v=202610072028"></script>
<script type="text/x-hub-app">
const MODE = window.HubMode;            // trainee | tutor | assessor
const IS_TRAINEE = MODE === 'trainee', IS_TUTOR = MODE === 'tutor';
const P = new URLSearchParams(location.search);
const TOKEN = IS_TRAINEE ? null : (P.get('trainee') || '');
const $ = id => document.getElementById(id);
const esc = s => (s == null ? '' : String(s)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const rec = k => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch(e) { return null; } };
const KEYQ = ['t','k','ak','trainee'].filter(n => P.get(n)).map(n => n + '=' + encodeURIComponent(P.get(n))).join('&');
const T = window.HubTracker;
const TEXT = window.CONNECT_HUB_CELTA5_TEXT || [];
const CRIT = window.CONNECT_HUB_CRITERIA || [];
const SETTINGS = rec('connect_course_settings') || {};

/* ---- who, and the two halves ------------------------------------------- */
let who = null;              // { name, token, tr }  tr = the roster trainee (tutor/assessor) or a trainee-shaped object (candidate)
let C = {}, TT = {};         // C: the candidate's half (celta5); TT: the tutors' half (celta5t)
if (IS_TRAINEE) {
  const me = rec('hub:me') || {};
  who = { name: me.name || '', token: me.token || '' };
  C = rec('chub:celta5') || {}; TT = rec('chub:celta5t') || {};
  /* The tables read the same shapes the tracker reads, from the candidate's own keys. */
  who.tr = { id: me.token, name: me.name, tp: { plan: rec('chub:plan'), selfeval: rec('chub:selfeval'), feedback: rec('chub:feedback'), history: rec('chub:tpHistory') || {} },
             assignments: rec('connect_assignment_submissions_v1') || {}, tracker: rec('chub:tracker') || {}, observations: rec('connect_observations_v1') || {} };
} else {
  const roster = rec('connect_roster_v1') || {};
  const tr = TOKEN && roster.trainees ? roster.trainees[TOKEN] : null;
  if (tr) { who = { name: tr.name, token: TOKEN, tr }; C = tr.celta5 || {}; TT = tr.celta5t || {}; }
}
const saveC = () => { if (!IS_TRAINEE) return; localStorage.setItem('chub:celta5', JSON.stringify(C)); flash(); };
const saveT = () => {
  if (!IS_TUTOR) return;
  const r = rec('connect_roster_v1'); if (!r || !r.trainees || !r.trainees[TOKEN]) { alert('The roster has not loaded yet — give it a moment.'); return; }
  r.trainees[TOKEN].celta5t = TT; localStorage.setItem('connect_roster_v1', JSON.stringify(r)); flash();
};
let ft; const flash = () => { const s = $('savedNote'); if (!s) return; s.textContent = 'Saved'; clearTimeout(ft); ft = setTimeout(() => { if ($('savedNote')) $('savedNote').textContent = ''; }, 1400); };
const now = () => new Date().toISOString();
const when = iso => iso ? new Date(iso).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' }) : '';
const tutorName = () => (localStorage.getItem('chub:tutorName') || localStorage.getItem('hub:tutorName') || '').trim(); // chub:tutorName is what the dashboard's "Your name" keeps

/* ---- pieces ------------------------------------------------------------- */
const pill = (t, cls) => `<span class="st ${cls||''}">${t}</span>`;
/* The hours taught at each stage, as a starting figure. Cambridge asks for six
   hours of assessed teaching across the course, so with eight teaching
   practices each is forty-five minutes: Stage 1 comes after TP2 (1.5), Stage 2
   at the half-way point (3), Stage 3 at the end (6). Ramy, 30 Sep 2026: "that's
   the standard" -- and standard means a figure already in the box, not a rule.
   The tutor can type anything over it, and a centre whose course is built
   differently gets its own arithmetic from the number of teaching practices it
   actually runs. Nothing is written by looking: the figure goes into the record
   in memory and is saved with whatever the tutor does next. */
const ASSESSED_HOURS = 6;
function standardHours(which) {
  const tps = Math.max(2, parseInt(SETTINGS.tpCount, 10) || 8);
  const done = which === 's1' ? 2 : which === 's3' ? tps : Math.round(tps / 2);
  const h = ASSESSED_HOURS * done / tps;
  return String(Math.round(h * 100) / 100);
}

const field = (obj, key, label, opts) => {
  /* A stage's hours arrive filled in, unless somebody has already changed them
     or the stage has been returned and locked. */
  if (key === 'hoursTaught' && opts.mine && !opts.locked && !obj[key]) {
    obj[key] = standardHours(opts.o === 's2t' ? 's2' : opts.o);
  }
  const v = obj[key] || '';
  const mine = opts.mine;
  if (!mine) return `<label class="f">${label}</label><div class="ro ${v ? '' : 'empty'}">${v ? esc(v) : 'Nothing written yet'}</div>`;
  return `<label class="f">${label}</label>` + (opts.input
    ? `<input type="${opts.input}" data-o="${opts.o}" data-k="${key}" value="${esc(v)}"${opts.locked ? ' readonly' : ''}>`
    : `<textarea data-o="${opts.o}" data-k="${key}"${opts.locked ? ' readonly' : ''}>${esc(v)}</textarea>`);
};
const RATINGS = [['above','Above standard'],['to','To standard'],['not','Not to standard']];
const MARKS_TUTOR = ['S+','S','N'], MARKS_CAND = ['S+','S','N','X'];
const rating = (obj, key, opts) => {
  const v = obj[key] || '';
  if (!opts.mine || opts.locked) return `<div class="rating">${RATINGS.map(([k,l]) => `<label class="dis" style="${v===k ? 'background:var(--teal);border-color:var(--teal);color:var(--paper)' : 'opacity:.55'}">${l}</label>`).join('')}</div>`;
  return `<div class="rating">${RATINGS.map(([k,l]) => `<label><input type="radio" name="${opts.o}-${key}" data-o="${opts.o}" data-k="${key}" value="${k}"${v===k?' checked':''}><span>${l}</span></label>`).join('')}</div>`;
};
/* Cambridge's agree / do not agree is a CHOICE on the form, printed beside
   the signature line, and a signature is the act, not the answer. Stored as
   true/false so "not answered" stays distinct from "does not agree". */
const election = (obj, key, opts) => {
  const v = obj[key];
  const opt = (val, label) => (!opts.mine || opts.locked)
    ? `<label class="dis" style="${v===val ? 'background:var(--teal);border-color:var(--teal);color:var(--paper)' : 'opacity:.55'}">${label}</label>`
    : `<label><input type="radio" name="${opts.o}-${key}" data-elect="${opts.o}:${key}" value="${val?'y':'n'}"${v===val?' checked':''}><span>${label}</span></label>`;
  return `<div class="elect"><p class="lead">${opts.lead}</p><div class="rating">${opt(true, opts.yes)}${opt(false, opts.no)}</div></div>`;
};
/* one signature: a typed name and the moment */
const signature = (obj, key, opts) => {
  const s = obj[key];
  if (s && s.at) return `<div class="signed${s.ink ? ' inked' : ''}">${s.ink ? window.hubInk.svg(s.ink, 'sm', s.name) : ''}<div><b>${esc(s.name)}</b> — signed ${when(s.at)}</div></div>`;
  if (!opts.mine) return `<div class="ro empty" style="margin-top:12px">${opts.waiting || 'Not signed yet'}</div>`;
  if (opts.locked) return `<div class="ro empty" style="margin-top:12px">${opts.locked}</div>`;
  /* When the course already knows who this is -- every candidate, and a tutor
     who has signed before -- the name is shown, not offered for typing. A
     signature written from a name you can retype is a signature you can
     change, and Ramy's rule is that there is no way to change one. */
  const who = String(opts.prefill || '').trim();
  const field = who
    ? `<label class="f">Signing as</label><div class="signas">${esc(who)}</div><input type="hidden" data-sig="${opts.o}:${key}" value="${esc(who)}">`
    : `<label class="f">${opts.label || 'Your name, to sign'}</label><input type="text" data-sig="${opts.o}:${key}" placeholder="Type your name">`;
  return `<div class="sig"><div class="who">${field}</div><button class="btn primary" type="button" data-sign="${opts.o}:${key}">${opts.button || 'Sign'}</button></div>`;
};
const marksGrid = (candMarks, tutorMarks, opts) => {
  const topics = opts.topics; let last = '';
  /* Cambridge's scale, not a reduction of it. The form defines S+ "Above the
     Standard", S "Meets the Standard", N "Not to standard", and for the
     candidate's own column X "Not Applicable at this stage in the course
     because you have not yet focused on teaching or planning skills
     associated with that criterion". Lite offered S and N only, so nobody
     could record above standard -- evidence a Pass A rests on -- and a
     criterion the course had not reached looked identical to one failed
     (audit, 29 Sep 2026). X is the candidate's alone, as on the form. */
  const cell = (marks, mine, name) => code => {
    const v = (marks || {})[code] || '';
    const scale = name === 'cand' ? MARKS_CAND : MARKS_TUTOR;
    if (!mine) return `<span class="mk"><span class="shown${v ? '' : ' none'}">${scale.includes(v) ? esc(v) : '–'}</span></span>`;
    return `<span class="mk">${scale.map(m => `<label class="m${m.length > 1 ? ' wide' : ''}"><input type="radio" name="${name}-${code}" data-marks="${name}" data-code="${code}" value="${m}"${v===m?' checked':''}>${m}</label>`).join('')}</span>`;
  };
  const cCell = cell(candMarks, opts.candMine, 'cand'), tCell = cell(tutorMarks, opts.tutorMine, 'tutor');
  const names = { '1':'Learners and teachers, and the teaching and learning context', '2':'Language analysis and awareness', '3':'Language skills', '4':'Planning and resources for different teaching contexts', '5':'Developing teaching skills and professionalism' };
  let rows = '';
  CRIT.filter(c => topics.includes(c[1])).forEach(c => {
    if (c[1] !== last) { rows += `<tr class="topic"><td colspan="${opts.showCand ? 4 : 3}">${c[1]} · ${esc(names[c[1]] || '')}</td></tr>`; last = c[1]; }
    rows += `<tr><td class="code">${c[0]}</td><td>${esc(c[2])}</td>${opts.showCand ? `<td class="mark">${cCell(c[0])}</td>` : ''}<td class="mark">${tCell(c[0])}</td></tr>`;
  });
  return `<table class="grid"><thead><tr><th></th><th>Criterion</th>${opts.showCand ? '<th>You</th>' : ''}<th>Tutor</th></tr></thead><tbody>${rows}</tbody></table>
    <p class="note" style="margin:6px 0 0;font-size:0.76rem;color:var(--grey)">S+ — above the standard at this stage · S — meets the standard · N — not to standard${opts.showCand ? ' · X — not applicable yet (your column only)' : ''}</p>`;
};

/* ---- the tables that fill themselves ------------------------------------ */
const G_WORD = { ABOVE:'Above standard', STD:'To standard', NOTSTD:'Not to standard' };
function tpRows(){
  const hist = T.tpHistory(who.tr); const out = [];
  Object.keys(hist).sort((a,b) => a-b).forEach(n => {
    const fb = hist[n], f = (fb.state && fb.state.f) || {};
    const g = T.HUB_GRADE ? T.HUB_GRADE[String(f.fGrade || '').trim()] : '';
    out.push([`TP${n}`, f.fDate ? when(f.fDate) : '', f.fTime ? f.fTime + ' min' : '', f.fLevel || '', f.fStudents || '', f.fMain || '', G_WORD[g] || (f.fGrade || ''), f.fTutor || '']);
  });
  return out;
}
/* A sheet's length is what the candidate wrote, else what the sheet declares
   (the two live sheets declare 90): the prefill on the sheet is only the
   input's value until someone types, so the booklet read blank (second
   audit, 29 Sep 2026). */
const obsLength = (k, a) => { if (a && a.hLength) return a.hLength; try { const set = (rec('connect_observation_wording_v1') && rec('connect_observation_wording_v1').filmed) ? rec('connect_observation_wording_v1') : (window.CONNECT_HUB_OBSERVATION_DEFAULTS || {}); const t = [].concat(set.filmed || [], set.live || []).find(x => x && x.id === k); return t && t.minutes ? String(t.minutes) : ''; } catch (e) { return ''; } };
function obsRows(){
  const w = who.tr.observations || {}; const out = [];
  window.hubObservationSet().all.forEach(k => { const r = w[k]; if (!r || !r.turnedInAt) return; const a = r.a || {};
    out.push([k.startsWith('filmed') ? 'Filmed' : 'Live', a.hDate || '', obsLength(k, a), a.hLevel || '', a.hLearners || '', a.hLesson || '', a.hSigned || '', when(r.turnedInAt)]); });
  return out;
}
/* Cambridge's own Record of Assessment of Written Assignments (July 2023,
   page 12): four rows by title, and four columns -- Pass at the first
   submission, Pass at the second, Fail, and the candidate's signature under
   "I confirm that this is my own work".

   This page used to print Outcome / Round / Marking, which is Lite's internal
   language and is not on the form: "what is round two, round one unmarking?
   ... you're supposed to sign this. Can you make it like the one in the CELTA
   5?" (Ramy, 1 Oct 2026). The marks below are read from the same assignment
   records as before; only the shape is Cambridge's. A state with no outcome
   yet -- submitted and being marked, returned unmarked, not submitted -- ticks
   nothing, exactly as a paper form would carry nothing. */
function waTable(){
  const subs = who.tr.assignments || {};
  const W = (rec('connect_assignment_wording_v2') || window.CONNECT_HUB_DEFAULT_WORDING || {});
  const A = { fol:'Focus on the Learner', lrt:'Language Related Tasks', lsrt:'Language Skills Related Tasks', lfc:'Lessons from the Classroom' };
  Object.keys(A).forEach(k => { const t = (W[k] || {}).title; if (t && String(t).trim()) A[k] = String(t).trim(); });
  const wa = C.wa || {};
  const tick = '<span class="watick">\u2713</span>';
  const rows = ['fol','lrt','lsrt','lfc'].map(k => {
    const st = T.assignmentState(subs[k]);
    const first = st.code === 'PASS' && (!st.round || st.round === 1);
    const second = st.code === 'RES' || (st.code === 'PASS' && st.round > 1);
    const failed = st.code === 'FAIL';
    const sig = signature(wa, k, { o: 'wa', mine: IS_TRAINEE, prefill: who.name, label: 'Your name, to sign', button: 'Sign', waiting: 'Not signed yet' });
    return `<tr><td>${esc(A[k] || k.toUpperCase())}</td><td class="wac">${first ? tick : ''}</td><td class="wac">${second ? tick : ''}</td><td class="wac">${failed ? tick : ''}</td><td class="wasig">${sig}</td></tr>`;
  }).join('');
  return `<div class="watbl"><table class="grid"><thead><tr><th>Title</th><th class="wac">Pass<small>1st submission</small></th><th class="wac">Pass<small>2nd submission</small></th><th class="wac">Fail</th><th>Candidate signature<small>I confirm that this is my own work</small></th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function assignRows(){
  const subs = who.tr.assignments || {};
  /* Cambridge's page lists the four by TITLE. This read T.ASSIGN_LABEL, which
     is a marking-STATE map (PASS, FAIL, WAIT...), so A[k] was always undefined
     and the fallback printed FOL / LRT / LSRT / LFC on the record (audit,
     29 Sep 2026). The real titles are the centre's own wording, with the
     shipped defaults behind them. */
  const W = (rec('connect_assignment_wording_v2') || window.CONNECT_HUB_DEFAULT_WORDING || {});
  const A = { fol:'Focus on the Learner', lrt:'Language Related Tasks', lsrt:'Language Skills Related Tasks', lfc:'Lessons from the Classroom' };
  Object.keys(A).forEach(k => { const t = (W[k] || {}).title; if (t && String(t).trim()) A[k] = String(t).trim(); });
  return ['fol','lrt','lsrt','lfc'].map(k => { const st = T.assignmentState(subs[k]); const word = { PASS:'Pass', RES:'Pass (on resubmission)', FAIL:'Fail', FAILRES:'Resubmission required', WAIT:'Submitted, being marked', WAIT2:'Resubmitted, being marked', UNMARKED:'Returned unmarked', '':'Not submitted' }[st.code] || st.code;
    return [A[k] || k.toUpperCase(), word, st.round ? 'round ' + st.round : '', st.dm ? 'double-marked' : '']; });
}
const table = (head, rows, empty) => rows.length
  ? `<div class="tablewrap"><table class="grid"><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`
  : `<div class="ro empty">${empty}</div>`;

/* ---- the page ------------------------------------------------------------ */
/* ---- v7 (7 Oct 2026): the booklet's route --------------------------------
   The jump links as a route through the booklet: nine stations in the
   booklet's order, each carrying the state the section heading already
   shows (signed, your turn, with the tutor, open) or a count from the tables
   that fill themselves. Same anchors as the old pills; nothing is stored.
   Design: Magic Touches, 7a. */
function c5Conf(conf){
  const n = ['portfolio', 'appeals'].filter(k => conf && conf[k] && conf[k].at).length;
  return n === 2 ? ['2 of 2 signed', 'good'] : [n + ' of 2 signed', n ? 'attn' : ''];
}
function c5Count(fn, word){
  let n = 0; try { const r = fn(); n = Array.isArray(r) ? r.length : 0; } catch (e) {}
  return [n ? n + ' ' + word : 'None yet', n ? 'good' : ''];
}
function c5Closed(who){
  const subs = (who && who.tr && who.tr.assignments) || {};
  const n = ['fol', 'lrt', 'lsrt', 'lfc'].filter(k => subs[k] && subs[k].stage === 'closed').length;
  return [n + ' of 4 closed', n === 4 ? 'good' : n ? 'wait' : ''];
}
function c5Route(stations, my){
  const firstTurn = stations.findIndex(x => x[2] && x[2][1] === 'attn');
  return '<nav class="c5r" aria-label="The booklet, section by section"><ol>' + stations.map(([id, label, st], i) => {
      const tone = (st && st[1]) || '', text = (st && st[0]) || '';
      const mark = tone === 'good' ? '\u2713' : String(i + 1);
      return '<li class="' + (tone || 'open') + (i === firstTurn ? ' first' : '') + '"><a href="#' + id + '"><i aria-hidden="true">' + mark + '</i><b>' + esc(label) + '</b>'
        + (text ? '<small>' + esc(text) + '</small>' : '') + '</a></li>';
    }).join('') + '</ol></nav>';
}
```

## Appendix C: the call in render() (verbatim)
```js
  ${c5Route([
    ['read', 'Read and confirm', c5Conf(conf)],
    ['s1', 'Stage 1', st1], ['s2', 'Stage 2', st2], ['s3', 'Stage 3', st3],
    ['tp', 'Teaching practice', c5Count(tpRows, 'returned')],
    ['obs', 'Observations', c5Count(obsRows, 'turned in')],
    ['wa', 'Written assignments', c5Closed(who)],
    ['att', 'Attendance', ['', '']],
    ['final', 'Final declaration', stF]
  ], my)}
```
