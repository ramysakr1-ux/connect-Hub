# Connect's 45-minute "Teaching writing" (src/app/input-sessions/sessions/teaching-writing.tsx), on Lite's desk.
# Content word for word, American spelling; the film, the matching, the reveal cards, the product/process choices and
# the order debrief work as they do on Connect. Minutes are read from Connect's agenda strip.
TITLE = 'Teaching writing: product, process, and the difference it makes'
LONG = 'teaching-writing'
SUB = ('This session is staged like the lesson it teaches: prepare ideas, get useful language, do the task, get feedback. '
       'Do the stages first: the debrief afterwards is where it gets named. Along the way it builds the one distinction that '
       'shapes every writing lesson: product versus process.')
NAV = [('s1', '1 · Lead-in'), ('s2', '2 · Preparing to write'), ('s3', '3 · Useful language'), ('s4', '4 · Task types'),
       ('s5', '5 · Read and check'), ('s6', '6 · Detail and classify'), ('s7', '7 · Debrief')]

NOTES = '''<h4>Running this session</h4>
<p>Don’t name “the Productive Skills framework” until the debrief: trainees should recognize the shape themselves from Teaching Speaking. Do name product and process explicitly once the read-and-check stage lands; that distinction is the whole point of this particular session.</p>
<h4>Trainer notes</h4>
<p>Correct order: Lead-in, Preparing to write, Useful language, Task, Feedback: the same Productive Skills shape as Teaching Speaking. Point out at the reveal that trainees have now done this framework twice, once per productive skill.</p>
<h4>Product / process answers</h4>
<p>1 = product (studying a model text and its structure), 2 = process (drafting and redrafting based on feedback), 3 = process (peer feedback between drafts), 4 = product (matching a fixed format or genre, e.g. a formal letter template).</p>
<h4>Push past "process is better"</h4>
<p>Most CELTA writing lessons blend both, and a low-level group often needs more product scaffolding (a model to imitate) before process stages make sense to them.</p>
<h4>Stage 2 has to be real</h4>
<p>Preparing to write only works if trainees genuinely recall something real: don't let them skip to Stage 3. The point is to feel content coming before language, same as in Teaching Speaking.</p>
<h4>If time allows</h4>
<p>Ask trainees which of the five task types would need the most redrafting time in a real 45-minute TP slot: most land on collaborative or transactional writing, not free writing.</p>'''

BODY = r'''
  <div class="crit"><span class="code">3b</span><p>Helping learners to produce written language: staged, purposeful writing tasks. Cambridge combines writing and speaking as one criterion (3b), not two.</p></div>

  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="stage-title">Stage 1 · Lead-in <span class="badge">2 minutes</span></div>
      <p class="lead">Probably the most universally recognizable attitude to writing there is.</p>
      <div class="film closed" data-src="https://www.youtube-nocookie.com/embed/w4NsjnL4ieA?end=95&rel=0&modestbranding=1" data-title="Session video"><button type="button" class="btn teal film-btn">Watch the film</button></div>
      <p class="film-link">If the frame stays black, <a href="https://www.youtube.com/watch?v=w4NsjnL4ieA" target="_blank" rel="noopener">watch it on YouTube</a>.</p>
      <p>What was his attitude to writing? Have you ever felt exactly like that?</p>
      <p class="quiet">Quick discussion, a minute.</p>
    </div>
  </section>

  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">Stage 2 · Preparing to write <span class="badge">3 minutes</span></div>
      <p class="lead">Think of the last piece of writing you did that actually mattered: a job application, a difficult email, a complaint. Did you write it once, or several times, changing it along the way?</p>
      <p class="quiet">A minute alone, then compare with a partner.</p>
    </div>
  </section>

  <section id="s3" data-n="3">
    <div class="card" data-n="3">
      <div class="stage-title">Stage 3 · Match each term to a real example <span class="badge">8 minutes</span></div>
      <div id="match"></div>
    </div>
  </section>

  <section id="s4" data-n="4">
    <div class="card" data-n="4">
      <div class="stage-title">Stage 4 · Now do it: pick the right task type <span class="badge">7 minutes</span></div>
      <p class="lead">Using the piece of writing from Stage 2: which task type below would suit teaching that kind of writing? Click each to see what it’s for, then tell your partner which you’d pick and why.</p>
      <div id="tasks"></div>
    </div>
  </section>

  <section id="s5" data-n="5">
    <div class="card" data-n="5">
      <div class="stage-title">Stage 4, continued · Read the text and check whether your ideas were right <span class="badge">8 minutes</span></div>
      <div class="passage">
        <h3>Product versus process</h3>
        <p>A product approach treats writing as the end result. Learners study a model text, notice its features and organization, then produce their own version closely following that model: the focus is on the finished piece matching a known format, like a formal email or a for-and-against essay.</p>
        <p>A process approach treats writing as a series of stages the writer moves through, not a single pass: generating ideas, planning or outlining, drafting, getting feedback, then redrafting based on that feedback before a final version. The focus shifts from the finished product to what happens on the way there.</p>
        <p>Most real writing lessons on this course blend both. A model text still supplies useful language and structure, borrowed from the product approach, but learners plan, draft and redraft rather than writing once and stopping, borrowed from process. Peer feedback between drafts does real work here: it increases involvement, lets writers see their draft through another reader’s eyes, and builds confidence by making revision feel normal rather than a correction.</p>
        <p>Feedback at the end still splits in two: first, whether the task was achieved (did the letter actually persuade, did the email cover everything asked), then delayed language feedback on accuracy, dealt with once the writing is finished rather than mid-draft.</p>
      </div>
    </div>
  </section>

  <section id="s6" data-n="6">
    <div class="card" data-n="6">
      <div class="stage-title">Stage 5 · Look again, then check with your partner <span class="badge">8 minutes</span></div>
      <div id="details"></div>
      <h3 class="sub-title">Stage 5, continued · Product move, or process move?</h3>
      <p class="lead">Four things a teacher might do in a writing lesson. Choose for each.</p>
      <div id="moves"></div>
    </div>
  </section>

  <section id="s7" data-n="7">
    <div class="card" data-n="7">
      <div class="stage-title">Debrief: put the stages back in order <span class="badge">7 minutes</span></div>
      <p class="lead">Click each stage in the order you just experienced it. This is a <b>loop input</b>: the session modeled the framework instead of only describing it.</p>
      <div id="order"></div>
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
  @media print{ .film-link{display:none;} }
  /* 21 Nov 2026: an answered task printed solved on "Print the handout": matched meanings in a heavier weight (and, with their terms, in their teal fill if the print was not made from the button); a picked move with its teal or red edge and its other option faded; the ordered stages with their numbers and "3 of 5 placed" or "All 5 in order". On paper each now prints as it did untouched: the stages carry a blank circle to number in, and no count. */
  @media print{
    .pill-match-wrap .pill.matched, .pill-match-wrap .pill.selected, .pill-match-wrap .pill.wrong{background:var(--field); border-color:var(--sand-line); color:var(--ink); font-weight:500;}
    .pill-match-wrap .pill.term.matched, .pill-match-wrap .pill.term.selected, .pill-match-wrap .pill.term.wrong{font-weight:600;}
    .mhead span, .status{display:none !important;}
    .scen.done{border-color:var(--sand-line) !important;}
    .scen .opt.good, .scen .opt.bad, .scen .opt.dim{background:var(--field); border-color:var(--sand-line); color:var(--ink); opacity:1;}
    .order-line.done{border-color:var(--sand-line); color:var(--ink);}
    .order-line .num{display:none !important;} button.order-line::after{content:""; flex:none; width:22px; height:22px; border:1px solid #999; border-radius:50%;}
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

// ---------- 3. useful language ----------
matchTerms('match', [
  ['Product approach', 'Learners study a sample cover letter, then write their own copying its structure.'],
  ['Process approach', 'Learners plan, write a first draft, get feedback, then write it again.'],
  ['Draft', 'A first attempt at the email, before any feedback.'],
  ['Redraft', 'The rewritten email after fixing what the feedback pointed out.'],
  ['Model text', 'The sample formal letter learners study before writing their own.'],
  ['Peer feedback', 'A partner reads your draft and suggests one change before the final version.']
]);

// ---------- 4. task types ----------
const TASK_TYPES = [
  ['Guided / parallel writing', 'Learners follow a model text closely, substituting their own details into the same structure.', 'Lower levels and fixed genres (a formal email, a for-and-against essay) where the format itself is the target language.'],
  ['Collaborative writing', 'Pairs or small groups plan and draft a text together, negotiating content and language as they go.', 'Generating and testing ideas out loud before committing them to paper; weaker writers get support mid-draft.'],
  ['Process writing with redrafting', 'Learners plan, write a first draft, get peer or teacher feedback, then produce a second, improved draft.', 'Longer or higher-stakes pieces where the finished quality matters more than speed: reports, personal statements.'],
  ['Transactional writing', 'A real-world functional text with a clear purpose: a complaint email, a text message arranging plans, a note to a colleague.', 'Practicing register and genre conventions tied to an authentic, everyday purpose.'],
  ['Free / creative writing', 'An open prompt (a short story, a description, a personal reflection) with minimal structural constraint.', 'Fluency in writing and personal expression, usually once accuracy in the genre is already secure.']
];
$('tasks').innerHTML = TASK_TYPES.map(t => revealCard(t[0], t[1] + ' Best for: ' + t[2])).join('');

// ---------- 5. detail ----------
const DETAILS = [
  ['What does a product approach focus on?', 'The finished piece matching a known format or structure, learned by studying and imitating a model text.'],
  ['What does a process approach add that a product approach doesn’t?', 'Planning, drafting, feedback and redrafting: treating writing as several stages rather than one attempt.'],
  ['Do most real writing lessons pick one approach only?', 'No. Most blend both: a model text for structure and language, then drafting and redrafting on top of it.'],
  ['What are the two parts of feedback at the end?', 'Task achievement first (did the writing do its job), then delayed language feedback on accuracy, not the other way round.']
];
$('details').innerHTML = DETAILS.map(d => revealCard(d[0], d[1])).join('');

const PP = ['Product move', 'Process move'];
choices('moves', [
  { text: 'Learners read a sample cover letter, label its sections, then write their own following the same structure.', choices: PP, correct: 0, feedback: 'Product move: studying and imitating a model text’s structure.' },
  { text: 'Learners write a first draft of a complaint email, get feedback from the teacher, then rewrite it before submitting.', choices: PP, correct: 1, feedback: 'Process move: drafting and redrafting based on feedback rather than stopping at the first attempt.' },
  { text: 'Before the final version, partners swap drafts and suggest one thing to add and one thing to cut.', choices: PP, correct: 1, feedback: 'Process move: peer feedback between drafts is a core process-approach stage.' },
  { text: 'The task specifies the writing must follow the exact layout of a formal letter, with a fixed opening and closing.', choices: PP, correct: 0, feedback: 'Product move: matching a fixed genre format is the defining feature of a product approach.' }
]);

// ---------- debrief ----------
orderStages('order', ['Lead-in', 'Preparing to write', 'Useful language', 'Task', 'Feedback'], ['Task', 'Lead-in', 'Feedback', 'Useful language', 'Preparing to write']);

// ---------- the film (the same player as Lite's long pages: cut at its end time, a Hide button) ----------
(function(){
  var open = null;
  window.addEventListener('message', function(e){
    if (!open || !open.iframe || e.source !== open.iframe.contentWindow) return;
    var d; try { d = JSON.parse(e.data); } catch (x) { return; }
    if (!d || d.event !== 'infoDelivery' || !d.info) return;
    var t = d.info.currentTime, st = d.info.playerState;
    if ((open.end && t != null && t >= open.end) || st === 0) open.close();
  });
  document.querySelectorAll('.film[data-src]').forEach(function(f){
    var btn = f.querySelector('.film-btn'); if (!btn) return;
    var end = (f.dataset.src.match(/[?&]end=(\d+)/) || [])[1];
    function close(){ try { if (open && open.iframe) open.iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'stopVideo', args: [] }), '*'); } catch (x) {} open = null; f.innerHTML = ''; f.classList.add('closed'); f.appendChild(btn); var a = f.parentNode.querySelector('.film-acts'); if (a) a.remove(); }
    btn.addEventListener('click', function(){
      f.classList.remove('closed'); f.innerHTML = '';
      var i = document.createElement('iframe'); i.src = f.dataset.src + (f.dataset.src.indexOf('?') === -1 ? '?' : '&') + 'autoplay=1&enablejsapi=1&origin=' + encodeURIComponent(location.origin); i.title = f.dataset.title || 'Film';
      i.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture'; i.allowFullscreen = true; f.appendChild(i);
      open = { iframe: i, end: end ? +end : 0, close: close };
      i.addEventListener('load', function(){ try { i.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }), '*'); } catch (x) {} });
      var acts = document.createElement('p'); acts.className = 'film-acts';
      var c = document.createElement('button'); c.type = 'button'; c.className = 'btn'; c.textContent = 'Hide the film'; c.addEventListener('click', close);
      acts.appendChild(c); f.parentNode.insertBefore(acts, f.nextSibling);
    });
  });
})();
'''
