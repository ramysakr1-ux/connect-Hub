# Connect's 45-minute "Teaching speaking" (src/app/input-sessions/sessions/teaching-speaking.tsx), on Lite's desk.
# Content word for word, American spelling; the reveal cards, the content-or-language choices and the order exercise
# work as they do on Connect.
TITLE = 'Teaching speaking: staged the way you’ll teach it'
LONG = 'teaching-speaking'
SUB = ('This session is staged exactly like the lesson it teaches: prepare ideas, get useful language, do the task, get feedback. '
       'Do the stages first: the debrief afterwards is where it gets named.')
NAV = [('s1', '1 · Lead-in'), ('s2', '2 · Preparing to speak'), ('s3', '3 · Useful language'), ('s4', '4 · Five task types'),
       ('s5', '5 · Read and check'), ('s6', '6 · Detail and classify'), ('s7', '7 · Debrief')]

NOTES = '''<h4>Running this session</h4>
<p>Don’t name “the Productive Skills framework” until the debrief. Let trainees move through preparing ideas, getting useful language, doing the task and getting feedback without knowing that’s the shape: the reveal is the point.</p>
<p>Correct order: Lead-in, Preparing to speak, Useful language, Task, Feedback. This is the exact Productive Skills shape from Lesson Framework: say so explicitly at the reveal; trainees should recognize it immediately from that earlier session.</p>
<h4>Monitoring answers</h4>
<p>1 = task achievement (didn't finish), 2 = language (form error, common enough to deal with as a class), 3 = language (positive: highlight good language too, not just errors), 4 = task achievement (participation imbalance, not a language point).</p>
<h4>Stage 2 has to be real</h4>
<p>Preparing to speak only works if trainees actually think of something real: don't let them skip straight to Stage 3. The point is to feel that ideas came before language, exactly as in the framework.</p>
<h4>At the debrief, if time allows</h4>
<p>Ask trainees to name which stage of today's session was optional in a real lesson (useful language) and which one they, as teachers, disappear from (task): both should fall out naturally from what they just lived through.</p>
<h4>The misreading to watch for</h4>
<p>Trainees conflating "communicative" with "no error correction at all": the point of delayed correction is timing, not avoidance.</p>'''

BODY = r'''
  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="crit"><span class="code">3b</span><p>Helping learners to produce oral language: a dedicated pass on speaking fluency. Cambridge combines speaking and writing as one criterion (3b), not two.</p></div>
      <div class="stage-title">Lead-in <span class="badge">2 minutes</span></div>
      <p class="label">Stage 1</p>
      <div class="reveal-card hero" onclick="this.classList.toggle('open')"><div class="q">What is a productive skill?</div><div class="a">Speaking or writing.</div></div>
    </div>
  </section>

  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">Preparing to speak <span class="badge">3 minutes</span></div>
      <p class="label">Stage 2</p>
      <p class="lead">Think of a real opinion or story you&rsquo;d actually want to share about your journey into teaching. Don&rsquo;t write it down yet, just have it ready.</p>
      <p class="quiet">A minute alone, then compare with a partner.</p>
    </div>
  </section>

  <section id="s3" data-n="3">
    <div class="card" data-n="3">
      <div class="stage-title">Six terms you&rsquo;ll need <span class="badge">8 minutes</span></div>
      <p class="label">Stage 3</p>
      <p class="lead">Click each to reveal.</p>
      <div id="terms"></div>
    </div>
  </section>

  <section id="s4" data-n="4">
    <div class="card" data-n="4">
      <div class="stage-title">Now do it: pick the right task type <span class="badge">7 minutes</span></div>
      <p class="label">Stage 4</p>
      <p class="lead">Using the opinion or story from Stage 2: which task type below would actually get a partner to hear it? Click each to see what it&rsquo;s for, then tell your partner which you&rsquo;d pick and why.</p>
      <div id="types"></div>
    </div>
  </section>

  <section id="s5" data-n="5">
    <div class="card" data-n="5">
      <div class="stage-title">Read the text and check whether your ideas were right <span class="badge">8 minutes</span></div>
      <p class="label">Stage 4, continued</p>
      <div class="text-block passage">
        <h3>Staging a productive skills lesson</h3>
        <p>A productive skills lesson doesn&rsquo;t open with instructions. It opens by creating interest in the topic and giving learners something to think or feel before they need any language for it: ideas and content come first, because nobody can speak or write about a topic they haven&rsquo;t engaged with yet.</p>
        <p>Useful language comes next, but only if it&rsquo;s needed: a handful of words or phrases learners are missing to do the task, not a full presentation. Many productive skills lessons skip this stage entirely if the target language was already covered earlier in the day.</p>
        <p>The task itself is where the teacher gets out of the way. Clear instructions, a genuine information gap or a real opinion to share, then the teacher circulates and monitors without interrupting: every minute of teacher talk here is a minute a learner isn&rsquo;t producing language.</p>
        <p>Feedback closes the lesson in two parts. First, feedback on whether the task was actually achieved: content, not language. Only after that does the teacher share language noticed while monitoring: what worked, and what to fix, dealt with once the task is over rather than mid-flow.</p>
      </div>
    </div>
  </section>

  <section id="s6" data-n="6">
    <div class="card" data-n="6">
      <div class="stage-title">Look again, then check with your partner <span class="badge">8 minutes</span></div>
      <p class="label">Stage 5</p>
      <div id="details"></div>
      <p class="label sub2">Stage 5, continued · Content feedback, or language feedback?</p>
      <p class="lead">Four things a teacher notices while monitoring a task. Choose for each.</p>
      <div id="monitoring"></div>
    </div>
  </section>

  <section id="s7" data-n="7">
    <div class="card" data-n="7">
      <div class="stage-title">Debrief: order the stages <span class="badge">7 minutes</span></div>
      <div id="order"></div>
    </div>
  </section>
'''

STYLE = r'''
  .crit{display:flex; gap:12px; align-items:flex-start; background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 16px; margin:0 0 18px;}
  .crit .code{flex:none; background:var(--teal); color:var(--paper); font-weight:700; font-size:.84rem; border-radius:5px; padding:3px 8px;}
  .crit p{margin:0; font-size:.9rem; line-height:1.55;}
  .reveal-card.hero{max-width:460px; padding:20px 22px; border-top:3px solid var(--teal);}
  .reveal-card.hero .q{font:600 1.3rem/1.3 'Newsreader',Georgia,serif;}
  .quiet{font-size:.88rem; font-style:italic; color:var(--grey); margin:4px 0 10px;}
  .passage h3{font:600 1.15rem/1.3 'Newsreader',Georgia,serif; color:var(--ink); margin:4px 0 8px;}
  .passage p{margin:0 0 10px;} .passage p:last-child{margin:0;}
  .sub2{margin-top:22px;}
  .scen{background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 16px; margin:0 0 10px;}
  .scen p{margin:0; font-size:.9rem; line-height:1.5;}
  .scen .opts{display:flex; flex-wrap:wrap; gap:8px; margin-top:10px;}
  .scen .opts .btn{margin:0;}
  .scen .fb{margin-top:8px; font-size:.88rem;}
  .scen.good{border-color:var(--teal); background:color-mix(in oklab, var(--teal) 7%, var(--paper));} .scen.good .fb{color:var(--teal);}
  .scen.bad{border-color:var(--a-red); background:color-mix(in oklab, var(--a-red) 5%, var(--paper));} .scen.bad .fb{color:var(--a-red);}
  .ox{display:flex; flex-direction:column; margin-top:10px;}
  .ox .order-line{justify-content:flex-start; width:100%; text-align:left; font-family:'Karla',sans-serif; color:var(--ink);}
  .ox .order-line .num{flex:none; min-width:24px; height:24px; border-radius:50%; background:var(--box); color:var(--grey); display:inline-flex; align-items:center; justify-content:center; font-size:.78rem;}
  .ox .order-line.done{border-color:var(--teal); background:color-mix(in oklab, var(--teal) 7%, var(--paper)); cursor:default;}
  .ox .order-line.done .num{background:var(--teal); color:var(--paper);}
  .ostat{font-size:.86rem; color:var(--grey); margin:4px 0 0;}
  .ointro{font-size:.9rem; color:var(--grey); margin:0 0 6px;} .ointro b{color:var(--ink);}
  @media print{ .scen .fb{display:none !important;} }
  /* 20 Nov 2026: an answered task printed solved: a picked scenario kept its right/wrong colors, and the ordered stages printed their numbers, their fill and "All 5 in order". On paper each prints as it did untouched: a blank circle to number in, no count. */
  @media print{ .scen.good, .scen.bad{border-color:var(--sand-line) !important; background:var(--paper) !important;} .scen .opts, .ostat{display:none !important;} .ox .order-line.done{border-color:#999 !important; background:none !important;} .ox .order-line .num{display:none !important;} .ox .order-line::before{content:""; flex:none; width:22px; height:22px; border:1px solid #999; border-radius:50%;} }
'''

SCRIPT = r'''
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const reveal = (q, a) => '<div class="reveal-card" onclick="this.classList.toggle(\'open\')"><div class="q">' + esc(q) + '</div><div class="a">' + esc(a) + '</div></div>';

const TERMS = [
  ['STT vs TTT', 'Student Talking Time vs Teacher Talking Time. In a speaking lesson the aim is maximum STT: give clear instructions fast, then get out of the way.'],
  ['Task achievement', 'Whether the task actually got done (a discussion reached a decision, an info-gap found all the differences), independent of how accurate the language was.'],
  ['Monitoring', 'Listening in on pairs or groups while they work, without interrupting. The teacher notes good and problem language for feedback afterwards.'],
  ['Delayed error correction', 'Noting errors during the task and dealing with them once it finishes, rather than stopping learners mid-sentence to fix them.'],
  ['Information gap', 'Each speaker holds information the other doesn’t have, so there’s a genuine reason to talk, unlike a scripted dialogue both partners can already read.'],
  ['Communicative output', 'Real, purposeful language use, as opposed to the accuracy-focused mechanical practice covered in Drilling. This is the stage that comes after.']
];
const TASK_TYPES = [
  ['Information-gap', 'Two learners each have half a picture, schedule, or map; they describe their half to find the differences.', 'Practicing specific target language while guaranteeing a genuine need to speak.'],
  ['Role-play', 'Each learner gets a role card and situation (a customer complaining, a doctor’s appointment) and improvises within it.', 'Functional language and real-world transactional situations.'],
  ['Discussion', 'Open questions on a topic learners have opinions on, with no single right answer.', 'Fluency and free practice, usually near the end of a lesson.'],
  ['Problem-solving / ranking', 'A group ranks items or agrees on a solution together: a survival scenario, allocating a budget.', 'Extended negotiation, natural turn-taking, language of agreeing and disagreeing.'],
  ['Describe and draw / spot the difference', 'One learner describes an image while their partner draws it, or two similar pictures are compared for differences.', 'Lower levels, concrete vocabulary, and high engagement with low language demands.']
];
const DETAILS = [
  ['Should useful language always be pre-taught before a productive skills task?', 'No: it’s optional, and many lessons skip it entirely if the target language was already covered earlier.'],
  ['What comes before language in preparing to speak or write?', 'Ideas and content: engaging with the topic itself, something to actually say.'],
  ['What are the two parts of feedback at the end?', 'Task achievement first (content), then delayed language feedback (form), never the other way round.'],
  ['Why does the teacher get out of the way during the task?', 'To maximize STT and let monitoring happen instead of interrupting: every minute of TTT is a minute a learner isn’t producing language.']
];
const MONITORING = [
  { text: 'Two pairs never actually decided on a restaurant: they got distracted and ran out of time.', correct: 0,
    feedback: 'Task achievement: worth raising in feedback on the task itself, separate from any language point.' },
  { text: 'Half the class said “I am agree” instead of “I agree.”', correct: 1,
    feedback: 'Language feedback: a common form error, worth a quick delayed correction slot with the whole class.' },
  { text: 'One pair used “actually” really naturally to introduce a surprising fact.', correct: 1,
    feedback: 'Language feedback, but positive. Highlighting good language matters as much as fixing errors.' },
  { text: 'A student went completely silent when it was their turn; their partner did all the talking.', correct: 0,
    feedback: 'Task achievement / participation: worth noting for feedback, but it isn’t a language point.' }
];
const CHOICES = ['Task achievement', 'Language feedback'];
const CORRECT_ORDER = ['Lead-in', 'Preparing to speak', 'Useful language', 'Task', 'Feedback'];
const SHUFFLED = ['Task', 'Lead-in', 'Feedback', 'Useful language', 'Preparing to speak'];

$('terms').innerHTML = TERMS.map(t => reveal(t[0], t[1])).join('');
$('types').innerHTML = TASK_TYPES.map(t => reveal(t[0], t[1] + ' Best for: ' + t[2])).join('');
$('details').innerHTML = DETAILS.map(d => reveal(d[0], d[1])).join('');

// ---------- 6. Content or language feedback (Connect's ChoiceScenarioCard): the first pick locks in ----------
function drawScen(i, picked){
  const s = MONITORING[i], answered = picked !== undefined, ok = picked === s.correct;
  return '<div class="scen' + (answered ? (ok ? ' good' : ' bad') : '') + '" id="sc' + i + '"><p>' + esc(s.text) + '</p>'
    + (answered ? '<p class="fb">' + (ok ? '✓ ' : '✗ ') + esc(s.feedback) + '</p>'
                : '<div class="opts">' + CHOICES.map((c, j) => '<button type="button" class="btn" data-pick="' + i + ':' + j + '">' + esc(c) + '</button>').join('') + '</div>') + '</div>';
}
$('monitoring').innerHTML = MONITORING.map((_, i) => drawScen(i)).join('');
$('monitoring').addEventListener('click', e => {
  const b = e.target.closest('[data-pick]'); if (!b) return;
  const [i, j] = b.dataset.pick.split(':').map(Number);
  $('sc' + i).outerHTML = drawScen(i, j);
});

// ---------- 7. Debrief: order the stages (Connect's OrderExercise): only the right next stage locks in ----------
function orderEx(el, correct, shuffled, title, intro){
  const picked = [];
  function draw(){
    el.innerHTML = '<p class="label">' + title + '</p><p class="ointro">' + intro + '</p><div class="ox">'
      + shuffled.map((l, i) => { const n = picked.indexOf(l); return '<button type="button" class="order-line' + (n > -1 ? ' done' : '') + '" data-i="' + i + '"><span class="num">' + (n > -1 ? n + 1 : '?') + '</span><span>' + esc(l) + '</span></button>'; }).join('')
      + '</div><p class="ostat">' + (picked.length === correct.length ? 'All ' + correct.length + ' in order: that’s the staging.' : picked.length + ' of ' + correct.length + ' placed: click the one that comes next.') + '</p>';
  }
  el.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (!b) return; const l = shuffled[+b.dataset.i]; if (picked.indexOf(l) === -1 && correct[picked.length] === l) { picked.push(l); draw(); } });
  draw();
}
orderEx($('order'), CORRECT_ORDER, SHUFFLED, 'Debrief: put the stages back in order',
  'Click each stage in the order you just experienced it. This is a <b>loop input</b>: the session modeled the framework instead of only describing it.');
'''
