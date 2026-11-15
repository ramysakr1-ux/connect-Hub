# Connect's 45-minute "Evaluating your plan" (src/app/input-sessions/sessions/evaluating-your-plan.tsx), on Lite's desk.
# Content word for word, American spelling; the plan-or-teaching choices (locked on the first pick), the reveal cards and
# the rewrite boxes work as they do on Connect. Lite has no long session of this.
TITLE = 'Evaluating your plan: what changes in the next one'
LONG = ''
SUB = ('You write a self-evaluation after every teaching practice, and it is assessed every time. Most of them are about how the teacher '
       'felt. This one is about whether the document was any good, which is a different question, a different criterion, and the only '
       'one that improves the next lesson.')
NAV = [('s1', '1 · Whose fault was it?'), ('s2', '2 · The plan, or the teaching?'), ('s3', '3 · Three questions'),
       ('s4', '4 · Rewrite it'), ('s5', '5 · Carry it forward'), ('s6', '6 · Wrap-up')]

NOTES = '''<h4>Running this session</h4>
<p>Trainees need their own last plan and their own last self-evaluation open beside this: the rewrite stage is done on their own words, not the examples. Do not let the session become a feedback session about their teaching; every time it drifts there, ask “and what does the next plan say differently?”</p>
<h4>Why this session exists</h4>
<p>4n is assessed on every self-evaluation a candidate writes (eight times over the course) and nothing on the course taught them what it is asking for. They evaluate their nerves, which is 5m, and the plan goes unexamined.</p>
<h4>1 · The imbalance is the point</h4>
<p>Let the "teacher" list run long before you say anything. When you ask what the PLAN did wrong, most rooms go quiet. That silence is worth sitting in for a few seconds.</p>
<h4>2 · The two that are both</h4>
<p>The instructions item and the "nobody could do the gist task" item are the arguments worth having. The test to give them: could you have prevented it at the desk? If yes, some of it belongs to the plan, however badly it also went in the room.</p>
<h4>3 · Evidence, not feeling</h4>
<p>"How do you know?" is the question to keep asking. A candidate who cannot say what learners produced by the end either wrote an unmeasurable aim or never built a stage that would show it: both are planning problems, and both are fixable tonight.</p>
<h4>4 · Use their own words</h4>
<p>The three examples are a warm-up. The real task is their own last self-evaluation, open beside this, rewritten. Collect two and read them out, with permission, and pick ones that improved.</p>
<h4>5 · Anticipated problems is the route</h4>
<p>If they take one thing: whatever went wrong that they had not predicted goes into the anticipated-problems section of the next plan. That single habit is most of 4n, and it shows up in the plan a tutor marks.</p>
<h4>Do not let it become feedback</h4>
<p>This is not a TP feedback session and it is not about how anyone taught. Every time it drifts, ask "and what does the next plan say differently?"</p>'''

BODY = r'''
  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="stage-title">Whose fault was it? <span class="badge">5 minutes</span></div>
      <p class="lead">A lesson goes badly. In pairs, two lists: things the <b>plan</b> did, and things the <b>teacher</b> did. Two minutes, then read a few out.</p>
      <p class="quiet">Most lists come back almost entirely teacher. That imbalance is the session.</p>
    </div>
  </section>

  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">The plan, or the teaching? <span class="badge">12 minutes</span></div>
      <p class="lead">Six things trainees have actually written after a TP. Which criterion is each one really about: 4n (the plan) or 5m (how you taught)? Two of them are genuinely both.</p>
      <div id="sort"></div>
    </div>
  </section>

  <section id="s3" data-n="3">
    <div class="card" data-n="3">
      <div class="stage-title">The three questions <span class="badge">10 minutes</span></div>
      <p class="lead">Every plan evaluation answers these, in this order. Anything else is optional; these are not.</p>
      <div id="questions"></div>
    </div>
  </section>

  <section id="s4" data-n="4">
    <div class="card" data-n="4">
      <div class="stage-title">Rewrite it <span class="badge">10 minutes</span></div>
      <p class="lead">Three sentences from real self-evaluations. Rewrite each so it is about the plan, carries evidence, and says what changes, then compare with a version that does.</p>
      <div id="rewrites"></div>
      <p>Now the real one: open your own last self-evaluation and do the same to it.</p>
    </div>
  </section>

  <section id="s5" data-n="5">
    <div class="card" data-n="5">
      <div class="stage-title">Carry it forward <span class="badge">6 minutes</span></div>
      <p class="lead">Cambridge’s second bullet for 4n is “address weak areas in the planning of future TP lessons”. So: which part of the next plan does each lesson change?</p>
      <div id="carry"></div>
    </div>
  </section>

  <section id="s6" data-n="6">
    <div class="card" data-n="6">
      <div class="stage-title">Wrap-up <span class="badge">2 minutes</span></div>
      <p class="lead">Open your next lesson plan now, before you leave. Write one thing into it that came out of your last one: a timing, an instruction in full, an anticipated problem, an extension. One line, in the plan, today.</p>
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

  .rw{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:14px 16px; margin:12px 0 0;}
  .rw .weak{margin:0 0 6px; font-size:.95rem; line-height:1.55;}
  .rw .why2{margin:0 0 8px; font-size:.86rem; font-style:italic; color:var(--gold-deep);}
  .rw .write-area{margin:0;}
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
    // s.also: the other answer that counts too. An item that is genuinely both takes either answer, as on Connect
    // (its anyChoice), and its feedback says it is both; the one picked is the one marked.
    const s = list[+d.dataset.k], v = +b.dataset.v, also = s.also || [], ok = v === s.correct || also.includes(v);
    d.classList.add('done', ok ? 'right' : 'wrong');
    d.querySelectorAll('.opt').forEach(o => { o.disabled = true; const ov = +o.dataset.v; o.classList.add((also.length ? ov === v : ov === s.correct) ? 'good' : ov === v ? 'bad' : 'dim'); });
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


// ---------- 2. the plan, or the teaching? ----------
const PT = ['The plan', 'The teaching'];
choices('sort', [
  { text: '“I spent eleven minutes on the lead-in. I’d allowed four.”', choices: PT, correct: 0, feedback: 'The plan. Four minutes was never enough for that lead-in: the timing was wrong on paper before anyone stood up. Next plan: three minutes, and the discussion question cut to one.' },
  { text: '“I was really nervous at the start and my hands were shaking.”', choices: PT, correct: 1, feedback: 'The teaching, and it belongs in your self-evaluation, which is criterion 5m. It is real and it matters; it is just not what 4n is asking about.' },
  { text: '“Nobody could do the gist task. The text was too hard for them.”', choices: PT, correct: 0, also: [1], feedback: 'Both, and the plan first. In the room, monitoring could have caught it early enough to adapt the task (5m). But choosing a text above the level is a materials decision made at the desk (4c), and the anticipated-problems section should have caught it. Next plan: check the text against the level before you write the tasks, not after.' },
  { text: '“My instructions for the second activity confused everyone and I had to start again.”', choices: PT, correct: 1, also: [0], feedback: 'Both. Delivering the instructions was the teaching (5m), but look at the plan before you stop there. If the procedure column said “set up activity 2” rather than the words you would actually say, the plan let you improvise, and that IS a plan weakness.' },
  { text: '“The practice stage had no purpose. They just did it and we moved on.”', choices: PT, correct: 0, feedback: 'The plan. A stage with no stated aim is a staging failure on paper (4b). If you cannot say in one line what a stage is FOR, it should not be in the plan.' },
  { text: '“I finished eight minutes early and had nothing left.”', choices: PT, correct: 0, feedback: 'The plan, specifically the absence of one. Every plan needs an extension you can drop if you have time and lose if you do not. Next plan: write it in, at the bottom, every time.' }
]);

// ---------- 3. the three questions ----------
const QUESTIONS = [
  ['1 · Did the aim get achieved, and how do you know?', 'Not “I think it went well”. What did learners produce by the end that they could not produce at the start? If you cannot name the evidence, either the aim was unmeasurable when you wrote it (4a) or you never built a stage that would show it.'],
  ['2 · Did each stage do the job the plan said it would?', 'Go stage by stage down your own procedure. For each one: was it for this, and did it do this? A stage that ran fine but did not serve the aim is still a planning problem: it took time from a stage that would have.'],
  ['3 · What is different in the NEXT plan?', 'The one sentence that makes it 4n rather than a diary. Not “be more confident”. Something you will write differently: a timing, a set of instructions in full, an extension task, a CCQ you will script in advance, an anticipated problem you missed.']
];
$('questions').innerHTML = QUESTIONS.map(q => revealCard(q[0], q[1])).join('');

// ---------- 4. rewrite it ----------
const REWRITES = [
  ['“The lesson went quite well overall but I think I talked too much.”', 'Two judgments, no evidence, nothing about the plan, nothing to change.',
   '“The clarification stage ran to nine minutes of the twelve because I explained the form instead of eliciting it: the plan said ‘clarify meaning and form’ with no CCQs written out. Next plan: the CCQs go in the procedure column in full, with the expected answers.”'],
  ['“The students enjoyed the activity and were engaged.”', 'Engagement is not the aim. This tells a reader nothing about whether the learners could do anything at the end.',
   '“By the freer stage six of eight learners were using ‘used to’ unprompted, which was the aim: I could hear it while monitoring. The two who were not had been in the pair that finished the controlled practice first and sat waiting, so the plan needed an extension for early finishers.”'],
  ['“I ran out of time and didn’t do the last stage.”', 'True, but stops at the symptom. Which stage overran, and what was the plan’s share of it?',
   '“I lost the last stage because the reading took fourteen minutes against the eight I had planned: the text was 400 words and I had timed it as if it were 200. Next plan: cut the text or the tasks, and time the reading by actually reading it at learner pace.”']
];
$('rewrites').innerHTML = REWRITES.map(r => '<div class="rw"><p class="weak">' + r[0] + '</p><p class="why2">' + r[1] + '</p>'
  + '<textarea class="write-area" rows="3" placeholder="Rewrite it: what the plan did, how you know, and what is different next time."></textarea>'
  + revealCard('Compare with one that works', r[2]) + '</div>').join('');

// ---------- 5. carry it forward ----------
const CARRY = [
  ['Timing column', 'Every stage that overran by more than two minutes last time gets a new number, not the same one hopefully.'],
  ['Procedure column', 'Anything you improvised and got wrong gets written out in full: instructions, CCQs, the example you will board.'],
  ['Anticipated problems and solutions', 'Whatever actually went wrong that you had not predicted goes in this section of the next plan. This is the single most direct route from one lesson to the next.'],
  ['Materials', 'A text that was too long or too hard is a materials decision. Note the level check you will do before writing tasks.'],
  ['The extension you did not have', 'If you finished early once, every plan from now on ends with something droppable.']
];
$('carry').innerHTML = CARRY.map(c => revealCard(c[0], c[1])).join('');
'''
