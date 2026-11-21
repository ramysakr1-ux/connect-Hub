# Connect's "Teaching exam classes" (src/app/input-sessions/sessions/teaching-exam-classes.tsx), on Lite's desk. Content
# word for word, American spelling; the CEFR ladder, the acronym matching, the exam explorer, the corridor questions
# (locked on the first pick) and the examiner cards work as they do on Connect.
TITLE = 'Teaching exam classes'
LONG = 'teaching-exam-classes'
SUB = ('Young learners to C2, Cambridge, IELTS, TOEFL and PTE: what each one is, who it is for, and which you would recommend when a '
       'student asks in the corridor. Then the other side of the desk: how teachers become examiners.')
NAV = [('s1', '1 · The CEFR ladder'), ('s2', '2 · Acronyms'), ('s3', '3 · Exam explorer'), ('s4', '4 · Which exam?'),
       ('s5', '5 · Being an examiner'), ('s6', '6 · Wrap-up')]

NOTES = '''<h4>Running this session</h4>
<p>Deliberately light: it sits in the last week, after the final TP. The exam explorer is theirs to wander through at their own pace; don’t walk them through every card. The scenarios are where the session earns its place: every trainee will be asked one of these questions in their first month of work.</p>
<h4>0–8 · Ladder from the bottom</h4>
<p>Open the rungs bottom-up and ask, at each one, which of their TP learners sat there. The ladder is only useful if it attaches to people they have taught.</p>
<h4>8–16 · Acronyms, old and new names</h4>
<p>Half the room will know the old names (FCE, CAE), half the new (B2 First, C1 Advanced). Both are still used in job adverts and by parents; they need to recognize both.</p>
<h4>16–31 · Explorer, hands off</h4>
<p>Do not present the cards. Set the task, "find the exam you would least like to teach, and say why", and let them browse. Fifteen minutes; collect three answers.</p>
<h4>31–39 · Scenarios lock</h4>
<p>The picks lock on first click on purpose: in the corridor there is no second guess. Where they get one wrong, the feedback names the reason: read one or two aloud.</p>
<h4>39–49 · Examining is a real option</h4>
<p>Be concrete about money and timing: exam seasons, day rates at your own center, how long standardization took you. If anyone in the room examines, hand over.</p>
<h4>49–50 · Close</h4>
<p>Three questions, no feedback. This is the last input session before course close; leave them with something to look up tonight.</p>'''

BODY = r'''
  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="stage-title">The CEFR ladder <span class="badge">8 minutes</span></div>
      <p class="lead">Bottom rung up. Click each for the descriptor, and at each one, name a learner from your own TP who sat there.</p>
      <div class="ladder" id="ladder"></div>
    </div>
  </section>

  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">Decode the acronyms <span class="badge">8 minutes</span></div>
      <p class="lead">Half the profession says FCE, half says B2 First. Job adverts and parents use both, so you need to recognize both.</p>
      <div id="match"></div>
    </div>
  </section>

  <section id="s3" data-n="3">
    <div class="card" data-n="3">
      <div class="stage-title">Exam explorer <span class="badge">15 minutes</span></div>
      <p class="lead">Nine exams, yours to wander. Find the one you would least like to teach, and be ready to say why.</p>
      <div class="exams" id="exams"></div>
    </div>
  </section>

  <section id="s4" data-n="4">
    <div class="card" data-n="4">
      <div class="stage-title">Which exam? <span class="badge">8 minutes</span></div>
      <p class="lead">Five corridor questions. Your pick locks on the first click: in the corridor there is no second guess.</p>
      <div id="scenarios"></div>
    </div>
  </section>

  <section id="s5" data-n="5">
    <div class="card" data-n="5">
      <div class="stage-title">Being an examiner <span class="badge">10 minutes</span></div>
      <p class="lead">The other side of the desk, and a real route into paid work with a CELTA.</p>
      <div id="roles"></div>
    </div>
  </section>

  <section id="s6" data-n="6">
    <div class="card" data-n="6">
      <div class="stage-title">Wrap-up <span class="badge">1 minute</span></div>
      <div class="closing">
        <h3>You can now tell your KET from your CAE</h3>
        <p>And an IELTS band from a TOEFL score. That is more than most first-year teachers can say, and it is the question you will be asked most.</p>
      </div>
      <ol class="closeq" id="closing"></ol>
    </div>
  </section>
'''

STYLE = r'''

  .crit{display:flex; gap:12px; align-items:flex-start; background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 14px; margin:0 0 8px;}
  .crit .code{flex:none; background:var(--teal); color:var(--paper); font-weight:700; font-size:.8rem; padding:3px 8px; border-radius:5px;}
  .crit p{margin:0; font-size:.9rem; line-height:1.55;}
  .quiet{font-size:.84rem; font-style:italic; color:var(--grey); margin:8px 0 0;}
  .sub-title{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.12rem; margin:22px 0 4px;}
  .passage{font-size:.97rem; line-height:1.75; background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:14px 18px; margin:10px 0 0;}
  .passage h3{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.15rem; margin:0 0 8px;}
  .passage p{margin:0 0 10px;} .passage p:last-child{margin:0;}
  .reveal-card.open .hint{display:none;}
  .mhead{display:flex; justify-content:space-between; align-items:baseline; gap:10px; flex-wrap:wrap; margin:10px 0 0; font-size:.9rem;}
  .mhead span{color:var(--grey); font-weight:600;}
  .pill-match-wrap .pill{font-family:'Karla',sans-serif; text-align:left; width:100%; display:block;}
  .pill-match-wrap .pill.term{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:.98rem;}
  .pill.matched{cursor:default;}
  .scen{background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 14px; margin:0 0 8px;}
  .scen .lane-tag{margin-bottom:6px;}
  .scen .t{font-size:.92rem; margin:0 0 8px; line-height:1.55;}
  .scen .opts{display:flex; gap:8px; flex-wrap:wrap;}
  .scen .opt{background:var(--field); border:1.5px solid var(--sand-line); border-radius:999px; padding:5px 14px; font-size:.82rem; font-weight:700; color:var(--ink); cursor:pointer; min-height:34px; font-family:'Karla',sans-serif; text-align:left; line-height:1.35; transition:border-color .12s ease;}
  .scen .opt:hover{border-color:var(--gold);}
  .scen .opt:disabled{cursor:default;}
  .scen .opt.good{background:color-mix(in oklab, var(--teal) 11%, transparent); border-color:color-mix(in oklab, var(--teal) 30%, transparent); color:var(--teal);}
  .scen .opt.bad{background:color-mix(in oklab, var(--brick) 10%, transparent); border-color:color-mix(in oklab, var(--brick) 28%, transparent); color:var(--brick);}
  .scen .opt.dim{opacity:.45;}
  .scen .why{display:none; margin:8px 0 0; font-size:.88rem; line-height:1.5; border-top:1px solid var(--row-line); padding-top:8px;}
  .scen.done .why{display:block;}
  .scen.done.right{border-color:var(--teal);} .scen.done.right .why{color:var(--teal);}
  .scen.done.wrong{border-color:color-mix(in oklab, var(--brick) 40%, transparent);} .scen.done.wrong .why{color:var(--brick);}
  button.order-line{width:100%; font-family:'Karla',sans-serif; color:var(--ink); text-align:left;}
  .order-line.done{border-color:var(--teal); color:var(--teal); cursor:default;}
  .status{font-size:.86rem; font-weight:600; color:var(--gold-deep); margin:10px 0 0;}

  :root{--c-teal:oklch(38% 0.072 195); --c-gold:oklch(60% 0.11 70); --c-muted:oklch(51% 0.017 70); --c-red:oklch(45% 0.15 27); --c-warm:oklch(30% 0.042 58); --c-goldink:oklch(44% 0.1 68);}
  .ladder{display:flex; flex-direction:column-reverse; gap:8px; margin:12px 0 0;}
  .rung, .exam{display:flex; flex-direction:column; gap:4px; width:100%; text-align:left; background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:10px 14px; cursor:pointer; font-family:'Karla',sans-serif; color:var(--ink);}
  .rung{border-left-width:4px;}
  .rung:hover, .exam:hover{border-color:var(--gold);}
  .rung .top{display:flex; flex-wrap:wrap; justify-content:space-between; align-items:baseline; gap:4px 10px;}
  .rung .lvl{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.3rem; margin-right:10px;}
  .rung .name{font-weight:600; font-size:.95rem;}
  .rung .hint2, .exam .full{font-size:.76rem; color:var(--grey);}
  .rung .d, .exam .more{display:none; border-top:1px solid var(--row-line); padding-top:6px; font-size:.88rem; line-height:1.55;}
  .rung.open .d, .exam.open .more{display:flex; flex-direction:column; gap:4px;}
  .exams{display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:8px; margin:12px 0 0;}
  @media(max-width:900px){ .exams{grid-template-columns:repeat(2, minmax(0,1fr));} }
  @media(max-width:600px){ .exams{grid-template-columns:1fr;} }
  .exam{border-top-width:3px; height:100%;}
  .exam .acro{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.2rem;}
  .exam .lv{font-weight:600; font-size:.86rem;}
  .exam .fact{font-style:italic; color:var(--teal);}
  .exam .open-hint{margin-top:auto; padding-top:6px; font-size:.74rem; font-weight:600; color:var(--teal);}
  .exam.open .open-hint{display:none;}
  .reveal-card .a ul{margin:8px 0 0; padding-left:20px;} .reveal-card .a p{margin:0;}
  .closing{border:1.5px dashed var(--c-gold); border-radius:var(--r-strip); padding:14px 18px; margin:10px 0 12px;}
  .closing h3{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.2rem; margin:0 0 6px;}
  .closing p{margin:0; line-height:1.6;}
  .closeq{list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:8px; counter-reset:q;}
  .closeq li{display:flex; gap:12px; align-items:flex-start; background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:10px 14px; line-height:1.55; counter-increment:q;}
  .closeq li::before{content:counter(q); flex:none; width:22px; height:22px; border-radius:50%; background:var(--box); color:var(--grey); font-weight:700; font-size:.75rem; display:flex; align-items:center; justify-content:center;}
  @media print{ .rung .d, .exam .more{display:flex !important;} .open-hint{display:none !important;} }
  /* 21 Nov 2026: an answered task printed solved on the handout: each matched meaning in a heavier weight (and filled teal, if the print was not made from the button); a picked corridor question with its teal or red edge and the options not picked faded. On paper each now prints as it did untouched. */
  @media print{
    .pill.matched, .pill.selected, .pill.wrong{background:var(--field); border-color:var(--sand-line); color:var(--ink);} .pill.matched:not(.term){font-weight:500;}
    .scen.done.right, .scen.done.wrong{border-color:var(--sand-line);} .scen .opt.good, .scen .opt.bad{background:var(--field); border-color:var(--sand-line); color:var(--ink);} .scen .opt.dim{opacity:1;}
  }
'''

SCRIPT = r'''
const $ = id => document.getElementById(id);
const revealCard = (q, a) => '<div class="reveal-card" onclick="this.classList.toggle(\'open\')"><div class="q">' + q + '</div><div class="hint">Click to reveal</div><div class="a">' + a + '</div></div>';

// ---------- match each term to its meaning (Connect's MatchTermsExercise) ----------
// Click a term, then its meaning, in either order. A right pair locks; a wrong pair flashes red and clears.
// The meanings run in reverse order, as on Connect.
function matchTerms(id, terms){
  const box = $(id), right = terms.map((_, i) => i).reverse(), matched = new Set();
  let selL = null, selR = null, bad = null;
  const cls = (i, sel, side) => 'pill' + (matched.has(i) ? ' matched' : bad && bad[side] === i ? ' wrong' : sel === i ? ' selected' : '');
  function draw(){
    box.innerHTML = '<div class="mhead"><b>Match each term to its meaning</b><span>' + matched.size + ' of ' + terms.length + ' matched</span></div>'
      + '<div class="pill-match-wrap"><div class="pill-col">' + terms.map((t, i) => '<button type="button" class="' + cls(i, selL, 0) + ' term" data-l="' + i + '">' + t[0] + '</button>').join('') + '</div>'
      + '<div class="pill-col">' + right.map(i => '<button type="button" class="' + cls(i, selR, 1) + '" data-r="' + i + '">' + terms[i][1] + '</button>').join('') + '</div></div>';
  }
  function tryMatch(){
    if (selL === null || selR === null) return;
    if (selL === selR) { matched.add(selL); selL = selR = null; }
    else { bad = [selL, selR]; setTimeout(() => { bad = null; selL = selR = null; draw(); }, 400); }
  }
  box.addEventListener('click', e => {
    if (bad) return;
    const l = e.target.closest('[data-l]'), r = e.target.closest('[data-r]');
    if (l && !matched.has(+l.dataset.l)) { selL = +l.dataset.l; tryMatch(); draw(); }
    if (r && !matched.has(+r.dataset.r)) { selR = +r.dataset.r; tryMatch(); draw(); }
  });
  draw();
}

// ---------- one scenario, a row of choices, feedback once picked (Connect's ChoiceScenarioCard) ----------
// The answer locks on the first pick, as on Connect.
function choices(id, list){
  const box = $(id);
  box.innerHTML = list.map((s, k) => '<div class="scen" data-k="' + k + '">' + (s.lane ? '<div class="lane-tag"><span class="chip">' + s.lane + '</span></div>' : '')
    + '<p class="t">' + s.text + '</p><div class="opts">' + s.choices.map((c, i) => '<button type="button" class="opt" data-v="' + i + '">' + c + '</button>').join('') + '</div><p class="why"></p></div>').join('');
  box.addEventListener('click', e => {
    const b = e.target.closest('.opt'); if (!b) return;
    const d = b.closest('.scen'); if (d.classList.contains('done')) return;
    const s = list[+d.dataset.k], v = +b.dataset.v, ok = v === s.correct;
    d.classList.add('done', ok ? 'right' : 'wrong');
    d.querySelectorAll('.opt').forEach(o => { o.disabled = true; const ov = +o.dataset.v; o.classList.add(ov === s.correct ? 'good' : ov === v ? 'bad' : 'dim'); });
    d.querySelector('.why').textContent = (ok ? '✓ ' : '✗ ') + s.feedback;
  });
}

// ---------- put the stages back in order (Connect's OrderExercise) ----------
// Clicking the right next stage locks it in, numbered; any other click does nothing.
function orderStages(id, correct, shuffled){
  const box = $(id), picked = [];
  function draw(){
    box.innerHTML = shuffled.map(l => { const i = picked.indexOf(l); return '<button type="button" class="order-line' + (i > -1 ? ' done' : '') + '" data-o="' + l + '"><span>' + l + '</span><span class="num">' + (i > -1 ? i + 1 : '?') + '</span></button>'; }).join('')
      + '<p class="status">' + (picked.length === correct.length ? 'All ' + correct.length + ' in order: that’s the staging.' : picked.length + ' of ' + correct.length + ' placed. Click the one that comes next.') + '</p>';
  }
  box.addEventListener('click', e => { const b = e.target.closest('[data-o]'); if (!b) return; const l = b.dataset.o; if (!picked.includes(l) && correct[picked.length] === l) { picked.push(l); draw(); } });
  draw();
}


const MUTED = 'var(--c-muted)', TEAL = 'var(--c-teal)', WARM = 'var(--c-warm)', GOLD_INK = 'var(--c-goldink)', GOLD = 'var(--c-gold)', RED = 'var(--c-red)';

// ---------- 1. the CEFR ladder, drawn bottom-up ----------
const CEFR = [
  ['A1', 'Beginner', MUTED, 'pre-A1 Starters just below', 'Can understand and use very basic phrases, introduce themselves and ask simple questions. Cambridge: Pre-A1 Starters sits just below this.'],
  ['A2', 'Elementary', TEAL, 'Movers · Flyers · A2 Key', 'Can communicate in simple, routine tasks on familiar topics. Cambridge: Movers, Flyers and A2 Key (KET) sit here.'],
  ['B1', 'Intermediate', WARM, 'B1 Preliminary', 'Can deal with most situations while traveling, describe experiences and give reasons for opinions. Cambridge: B1 Preliminary (PET). IELTS, TOEFL and PTE candidates often start scoring in this range.'],
  ['B2', 'Upper-intermediate', GOLD_INK, 'B2 First, the most taken', 'Can interact fluently with native speakers and produce clear, detailed text. Cambridge: B2 First (FCE), the most widely taken Cambridge exam.'],
  ['C1', 'Advanced', GOLD, 'C1 Advanced', 'Can use language flexibly for social, academic and professional purposes. Cambridge: C1 Advanced (CAE), accepted by many universities and employers.'],
  ['C2', 'Proficiency', RED, 'C2 Proficiency', 'Can understand virtually everything and express themselves spontaneously with precision. Cambridge: C2 Proficiency (CPE), near-native level.']
];
$('ladder').innerHTML = CEFR.map(c => '<button type="button" class="rung" style="border-left-color:' + c[2] + '" onclick="this.classList.toggle(\'open\')"><span class="top"><span><span class="lvl" style="color:' + c[2] + '">' + c[0] + '</span><span class="name">' + c[1] + '</span></span><span class="hint2">' + c[3] + '</span></span><span class="d">' + c[4] + '</span></button>').join('');

// ---------- 2. acronyms ----------
matchTerms('match', [
  ['CEFR', 'Common European Framework of Reference for Languages'],
  ['YLE', 'Young Learners English (Starters, Movers, Flyers)'],
  ['KET', 'Key English Test, now called A2 Key'],
  ['PET', 'Preliminary English Test, now called B1 Preliminary'],
  ['FCE', 'First Certificate in English, now called B2 First'],
  ['CAE', 'Certificate in Advanced English, now called C1 Advanced'],
  ['CPE', 'Certificate of Proficiency in English, now called C2 Proficiency'],
  ['IELTS', 'International English Language Testing System'],
  ['TOEFL', 'Test of English as a Foreign Language'],
  ['PTE', 'Pearson Test of English'],
  ['TKT', 'Teaching Knowledge Test']
]);

// ---------- 3. exam explorer ----------
const EXAMS = [
  ['YLE', 'Starters · Movers · Flyers', MUTED, 'Pre-A1 – A2', '6–12', 'Listening, Reading & Writing, Speaking', 'Paper or computer', 'No pass or fail: candidates earn 1–5 shields, so every child comes away with something.'],
  ['A2 Key', 'KET: Key English Test', TEAL, 'A2', '12+', 'Reading & Writing, Listening, Speaking', 'Paper or computer', 'Often a learner’s first “proper” international exam.'],
  ['B1 Preliminary', 'PET: Preliminary English Test', WARM, 'B1', '14+', 'Reading, Writing, Listening, Speaking', 'Paper or computer', 'A common target for school-leaver exchange programs.'],
  ['B2 First', 'FCE: First Certificate in English', GOLD_INK, 'B2', '16+', 'Reading, Writing, Listening, Use of English, Speaking', 'Paper or computer', 'The single most widely taken Cambridge exam in the world.'],
  ['C1 Advanced', 'CAE: Certificate in Advanced English', GOLD, 'C1', '16+', 'Reading, Writing, Listening, Use of English, Speaking', 'Paper or computer', 'Accepted by thousands of universities and employers worldwide.'],
  ['C2 Proficiency', 'CPE: Certificate of Proficiency', RED, 'C2', '18+', 'Reading, Writing, Listening, Use of English, Speaking', 'Paper or computer', 'Near-native level: some questions trip up native speakers too.'],
  ['IELTS', 'International English Language Testing System', WARM, 'B1–C2 · band 0–9', '16+', 'Listening, Reading, Writing, Speaking (face-to-face)', 'Paper or computer · Academic or General Training', 'The Speaking test is a real conversation with an examiner, no computer involved.'],
  ['TOEFL iBT', 'Test of English as a Foreign Language', RED, 'B1–C2 · score 0–120', '16+', 'Reading, Listening, Speaking, Writing, all on computer', 'Computer-based', 'Speaking answers are recorded and sent off for scoring: you never talk to a live examiner.'],
  ['PTE Academic', 'Pearson Test of English', GOLD_INK, 'A2–C2 · score 10–90', '16+', 'All four skills, fully computer-based and AI-scored', 'Computer-based', 'Results are often ready in under 48 hours, the fastest of the major exams.']
];
$('exams').innerHTML = EXAMS.map(e => '<button type="button" class="exam" style="border-top-color:' + e[2] + '" onclick="this.classList.toggle(\'open\')"><span class="acro">' + e[0] + '</span><span class="full">' + e[1] + '</span><span class="lv" style="color:' + e[2] + '">' + e[3] + '</span>'
  + '<span class="more"><span><b>Age:</b> ' + e[4] + '</span><span><b>Skills:</b> ' + e[5] + '</span><span><b>Format:</b> ' + e[6] + '</span><span class="fact">' + e[7] + '</span></span><span class="open-hint">Click to open</span></button>').join('');

// ---------- 4. which exam? ----------
choices('scenarios', [
  { text: '“I’m 9 and I want to learn English through games, nothing scary!”', choices: ['YLE (Starters / Movers)', 'C2 Proficiency', 'PTE Academic'], correct: 0, feedback: 'Young Learners exams are built for this age: shields, not grades, and tasks that feel like play.' },
  { text: '“I want to study for a Bachelor’s degree in the United States.”', choices: ['A2 Key', 'TOEFL iBT', 'YLE'], correct: 1, feedback: 'TOEFL is the exam US universities know best; IELTS is widely accepted too, but TOEFL is the safe first answer.' },
  { text: '“I need a fast result: I have a visa deadline in one week and I’m comfortable on a computer.”', choices: ['PTE Academic', 'C2 Proficiency', 'B1 Preliminary'], correct: 0, feedback: 'PTE results usually land inside 48 hours, and it is accepted for most visa routes.' },
  { text: '“I’m B2 and I want a widely recognized certificate that doesn’t expire.”', choices: ['B2 First', 'IELTS', 'A2 Key'], correct: 0, feedback: 'Cambridge certificates do not expire; IELTS and TOEFL scores are usually only accepted for two years.' },
  { text: '“I’m moving to the UK for a skilled worker visa and need an official score. Face-to-face speaking is fine.”', choices: ['IELTS', 'TOEFL iBT', 'YLE'], correct: 0, feedback: 'IELTS for UKVI is the standard route, and its speaking test is a live interview.' }
]);

// ---------- 5. being an examiner ----------
const ROLES = [
  ['Speaking examiner', 'In Cambridge exams, speaking is usually assessed by two examiners: an interlocutor, who runs the conversation and asks the questions, and an assessor, who sits silently and scores. IELTS speaking is one examiner, face-to-face, following a structured script.', [
    'Requirements: a recognized teaching qualification (CELTA is enough to apply) and usually three years’ relevant experience.',
    'You apply through an approved center: British Council, a Cambridge-authorized center, IDP.',
    'Paid training, then standardization: practice sessions scored against a benchmark until you are reliably consistent.',
    'You sit in on live exams before being signed off to examine alone.',
    'Examiners are re-standardized regularly so everyone keeps marking to the same standard.']],
  ['Writing and other papers', 'Writing (and Reading or Listening, where relevant) is usually marked remotely, online, often from home: a popular route for teachers who want flexible exam-season income.', [
    'Same starting point: a teaching qualification and relevant experience.',
    'Apply via Cambridge English, the IELTS partners, or ETS / Pearson depending on the exam.',
    'Training is about applying the mark scheme consistently: many sample scripts, much moderation.',
    'You periodically re-mark “seeded” scripts with known scores to prove you are still calibrated.',
    'TKT (Teaching Knowledge Test) is a useful extra credential if you want to broaden into assessment work.']]
];
$('roles').innerHTML = ROLES.map(r => revealCard(r[0], '<p>' + r[1] + '</p><ul>' + r[2].map(x => '<li>' + x + '</li>').join('') + '</ul>')).join('');

// ---------- wrap-up ----------
$('closing').innerHTML = ['Which exam would you feel most confident teaching tomorrow?', 'Which one do you want to find out more about?', 'Would you consider training as an examiner, speaking or writing?'].map(q => '<li>' + q + '</li>').join('');
'''
