# Connect's 45-minute "Classroom management — think on your feet" (src/app/input-sessions/sessions/classroom-management.tsx),
# on Lite's desk. Content word for word, American spelling; the simulation, the instruction check and the clock work as
# they do on Connect.
TITLE = 'Classroom management: think on your feet'
LONG = 'classroom-management'
SUB = ('Classroom management is decisions made in real time, under a clock, with five things happening at once. The activities below '
       'put trainees in that position directly; nothing here is a worksheet. Correction has a session of its own.')
NAV = [('s1', '1 · Lead-in'), ('s2', '2 · What it covers'), ('s3', '3 · Monitoring'), ('s4', '4 · Instructions'),
       ('s5', '5 · Stopping an activity'), ('s6', '6 · Your internal clock'), ('s7', '7 · Wrap-up')]

NOTES = '''<h4>Running this session</h4>
<p>One shared screen for trainer and trainees: project it, or have trainees open it on their own devices for the individual activities. The real discussion is the live "what do you say?" choices, not a wrap-up after the fact.</p>
<h4>Running "What classroom management covers" · 15 minutes</h4>
<p>Give trainees a few minutes to go through the list themselves and click into the ones they're curious about, then a quick whole-group round to clarify what the task itself is asking for.</p>
<h4>Correction is deliberately absent from this list</h4>
<p>It's on the source handout, but it gets a full session of its own: naming it and moving on stops this turning into a correction discussion.</p>
<h4>Monitoring: Pair E is the trap</h4>
<p>It never changes status. Trainees who check in on it anyway are showing the most common new-teacher habit: over-monitoring the pair that's already fine because it's easiest, while a real problem elsewhere waits.</p>
<h4>Monitoring: there is no single correct order</h4>
<p>The debrief should surface reasoning, not a scored right answer, but off-task behavior and disputes usually cannot wait as long as "finished early", which just needs an extension task.</p>
<h4>Monitoring is deliberately face-to-face: use the contrast</h4>
<p>In the room you can see all five pairs at once and choose where to go. In breakout rooms you cannot: you see nothing until you join one. Online monitoring means rotating through rooms on a timer, watching the chat, or asking pairs to ping you, because you have lost the ambient awareness this simulation assumes. That contrast is the second slot.</p>
<h4>Instructions: walk the room, don't just watch the marks</h4>
<p>For anyone whose instruction flags, ask them to read it back and say, in their own words, why: what was missing or unclear. The check is a prompt for that conversation, not a grade.</p>'''

BODY = r'''
  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="stage-title">Lead-in <span class="badge">4 minutes</span></div>
      <p class="lead">What do you think classroom management entails? Four minutes to brainstorm as many things as you can in your group before moving on.</p>
    </div>
  </section>

  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">What classroom management entails <span class="badge">15 minutes</span></div>
      <p class="lead">The fuller list. Compare it with what your group brainstormed. Click each for a discussion prompt. Four are tagged: one has its own session, three you practice below.</p>
      <div class="stack" id="vars"></div>
    </div>
  </section>

  <section id="s3" data-n="3">
    <div class="card" data-n="3">
      <div class="stage-title">Monitoring <span class="badge">15 minutes</span></div>
      <p class="lead">Sixty seconds of a pairwork task. Pairs change as it runs. Go to one and choose what you actually say. You will not get to all of them, which is the point.</p>
      <div class="simhead"><button class="btn primary" id="simStart" type="button">Start the task</button><span class="clock" id="simClock">0:60</span></div>
      <div class="stack" id="pairs"></div>
      <div class="simdone" id="simDone" hidden><p>Time. Which pairs did you reach, in which order, and which one never actually needed you?</p><button class="btn" id="simAgain" type="button">Run it again</button></div>
    </div>
  </section>

  <section id="s4" data-n="4">
    <div class="card" data-n="4">
      <div class="stage-title">Instructions <span class="badge">20 minutes</span></div>
      <p class="lead">Write the instruction you would actually say, word for word. Then say it out loud to your partner, who does only what you literally asked for.</p>
      <div class="btn-row" id="taskPills"></div>
      <div class="text-block" id="taskText"></div>
      <textarea class="write-area" id="instr" rows="3" placeholder="&ldquo;Work in pairs. Ask your partner about their weekend&hellip;&rdquo;"></textarea>
      <ul class="ichecks" id="ichecks"></ul>
      <p class="quiet" id="ihint">The check appears as you type. It is a prompt for discussion, not a grade.</p>
    </div>
  </section>

  <section id="s5" data-n="5">
    <div class="card" data-n="5">
      <div class="stage-title">Stopping an activity</div>
      <p class="lead">Five ways to take the room back. Click each for when it is the right one.</p>
      <div id="stops"></div>
    </div>
  </section>

  <section id="s6" data-n="6">
    <div class="card" data-n="6">
      <div class="stage-title">Your internal clock <span class="badge">2 minutes</span></div>
      <p class="lead">Start it, and stop it when you think exactly one minute has passed. No counting, no watching anything.</p>
      <div class="btn-row"><button class="btn primary" id="clockBtn" type="button">Start</button><span class="feedback" id="clockSay"></span></div>
    </div>
  </section>

  <section id="s7" data-n="7">
    <div class="card" data-n="7">
      <div class="stage-title">Wrap-up <span class="badge">4 minutes</span></div>
      <p class="lead">One thing from the monitoring simulation you will do differently, and one instruction you will write down in full before your next TP rather than improvising it in the room.</p>
      <textarea class="write-area" rows="3" placeholder="What I'll do differently, and the instruction I'll write down"></textarea>
    </div>
  </section>
'''

STYLE = r'''
  .simhead{display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; margin:6px 0 4px;}
  .clock{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:2.4rem; font-variant-numeric:tabular-nums; color:var(--ink);}
  .clock.run{color:var(--a-red);}
  .pair{background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-strip); padding:11px 14px;}
  .pair.urgent{border-color:color-mix(in oklab, var(--a-red) 45%, var(--paper));}
  .pair.good{border-color:var(--teal); background:color-mix(in oklab, var(--teal) 6%, var(--paper));}
  .pair.bad{border-color:var(--a-red); background:color-mix(in oklab, var(--a-red) 5%, var(--paper));}
  .pair .top{display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap; font-weight:600; font-size:.92rem;}
  .pair .st{font-weight:700; font-size:.86rem;}
  .st.fine{color:var(--grey);} .st.stuck{color:var(--gold-deep);} .st.finished{color:var(--teal);} .st.offtask, .st.dispute{color:var(--a-red);}
  .pair .go{margin-top:8px; background:none; border:0; padding:0; font:600 .86rem 'Karla',sans-serif; color:var(--teal); cursor:pointer;}
  .pair .go:hover{text-decoration:underline; text-underline-offset:3px;}
  .opts{display:flex; flex-direction:column; gap:6px; margin-top:8px;}
  .opts button{text-align:left; background:var(--surface); border:1.5px solid var(--sand-line); border-radius:8px; padding:8px 12px; font:400 .88rem/1.45 'Karla',sans-serif; color:var(--ink); cursor:pointer;}
  .opts button:hover{border-color:var(--gold);}
  .pair .why{margin:8px 0 0; font-size:.88rem; line-height:1.5;}
  .pair.good .why{color:var(--teal);} .pair.bad .why{color:var(--a-red);}
  .simdone{display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin-top:12px; background:var(--paper); border:1.5px dashed var(--sand-line); border-radius:var(--r-strip); padding:11px 14px;}
  .simdone p{margin:0; font-size:.92rem;}
  .simdone[hidden]{display:none;}
  #taskPills .btn.on{background:var(--teal); color:var(--paper); border-color:var(--teal);}
  .ichecks{list-style:none; margin:10px 0 0; padding:0; display:flex; flex-direction:column; gap:6px;}
  .ichecks li{display:flex; gap:10px; align-items:flex-start; border:1.5px solid var(--sand-line); border-radius:8px; padding:8px 12px; font-size:.88rem; line-height:1.5; background:var(--paper);}
  .ichecks li.ok{border-color:color-mix(in oklab, var(--teal) 40%, var(--paper));}
  .ichecks li.no{border-color:var(--amber-edge); background:var(--gold-wash);}
  .ichecks li .m{font-weight:700; flex:none;} .ichecks li.ok .m{color:var(--teal);} .ichecks li.no .m{color:var(--gold-deep);}
  .quiet{font-size:.84rem; font-style:italic; color:var(--grey); margin:8px 0 0;}
  .quiet[hidden]{display:none;}
  @media print{ .simhead, #pairs, .simdone, .ichecks, #clockBtn, .clock{display:none !important;} }
  /* 21 Nov 2026: the handout printed only the one task of the four that was on the screen. On paper all four are listed (#taskPaper, built from TASKS below) and the screen's one is left off. */
  .task-paper{display:none;}
  @media print{ .task-paper{display:block; margin:10px 0 12px; padding-left:22px; line-height:1.55;} .task-paper li{margin:0 0 6px; break-inside:avoid;} #taskText{display:none !important;} }
'''

SCRIPT = r'''
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

// ---------- 2. What it entails ----------
const VARIABLES = [
  ['Seating and the teacher’s position in the class', 'Where you stand changes who you’re actually teaching. Online, what replaces “position”: camera framing, gallery view, pinned video?'],
  ['Eye contact', 'How do you spread eye contact across a whole room without ignoring the edges?'],
  ['Voice projection', 'Volume isn’t the only tool: pace, pitch and pausing carry weight too. What’s the risk of using the same volume for instructions as for feedback?'],
  ['Use of aids: whiteboard, audio, pictures, realia, handouts', 'Which aid would most change how you’d teach a classroom with no working screen?'],
  ['Names', 'Online, names are right there on screen; memorizing isn’t really the problem. Face-to-face, it is. Either way: how do you get the pronunciation right, and actually use names while you’re teaching, not just at the start?'],
  ['Praise and encouragement', 'What’s the difference between praise that motivates and praise a student tunes out?'],
  ['Rapport', 'Rapport isn’t the same as being liked. What builds it faster than friendliness does?'],
  ['Correction', null, 'Its own session'],
  ['Variety of activities', 'Variety for its own sake vs. variety that serves the lesson aims: where’s the line?'],
  ['Monitoring', null, 'Practiced below: simulation'],
  ['The teacher’s classroom language and instructions', null, 'Practiced below: instruction check'],
  ['Timing and pace', null, 'Practiced below: internal clock']
];
$('vars').innerHTML = VARIABLES.map((v, i) => {
  const n = String(i + 1).padStart(2, '0') + ' · ' + esc(v[0]);
  return v[1] ? '<div class="reveal-card" onclick="this.classList.toggle(\'open\')"><div class="q">' + n + '</div><div class="a">' + esc(v[1]) + '</div></div>'
              : '<div class="tagrow">' + n + '<span class="pill">' + esc(v[2]) + '</span></div>';
}).join('');

// ---------- 3. Monitoring ----------
const SIM_SECONDS = 60;
const PAIRS = [
  { key: 'A', changeAt: 20, status: 'stuck', text: 'Confused, hand half-raised' },
  { key: 'B', changeAt: 50, status: 'finished', text: 'Finished, sitting back' },
  { key: 'C', changeAt: 5, status: 'offtask', text: 'Chatting in L1, off task' },
  { key: 'D', changeAt: 35, status: 'dispute', text: 'Raised voices, disagreement' },
  { key: 'E', changeAt: null, status: 'fine', text: 'Working fine' }   // never changes: the trap
];
const RESPONSES = {
  stuck: [
    ['Give them the answer directly.', false, 'Fixes this instance but teaches them to wait for you instead of trying.'],
    ['Ask a couple of the CCQs again, more slowly.', true, 'Checks understanding without just handing over the answer.'],
    ['Tell them to keep going, you’ll come back.', false, 'Leaves them stuck and unsupported; they may disengage before you’re back.']],
  finished: [
    ['Let them sit until time’s up.', false, 'Wastes their time and often turns into chat that pulls others off task.'],
    ['Give a quick extension: compare with another early pair.', true, 'Keeps them engaged without cutting the main task short for everyone else.'],
    ['End the activity for the whole class now.', false, 'Cuts the activity short for pairs who still need the time.']],
  offtask: [
    ['Call out across the room to use English.', false, 'Public and vague: doesn’t address this pair directly, can embarrass them.'],
    ['Go over, gesture at the task, ask a quick question in English.', true, 'Direct and low-key: re-engages them without a public callout.'],
    ['Ignore it, it’s probably not important.', false, 'Off-task chat rarely resolves on its own and tends to spread.']],
  dispute: [
    ['Separate them immediately.', false, 'Often unnecessary and can escalate rather than defuse it.'],
    ['Go over, lower your own voice, ask what they disagree about.', true, 'Models the calm you want and treats it as content, not just noise.'],
    ['Raise your voice to be heard over them.', false, 'Matches their energy instead of defusing it.']],
  fine: [
    ['Stop them and ask if they have a problem.', false, 'Interrupts a pair that’s working well and can make them doubt themselves for no reason.'],
    ['Smile, nod, move on without stopping them.', true, 'Acknowledges them without breaking their flow; they don’t need input right now.'],
    ['Sit down and start explaining anyway.', false, 'Unneeded input eats time you needed for a pair that actually has a problem.']]
};
let elapsed = 0, running = false, timer = null, openPair = null, chosen = {};
function statusOf(p){ return p.changeAt === null ? 'fine' : (elapsed > 0 && elapsed >= p.changeAt) ? p.status : 'fine'; }
function drawPairs(){
  const left = Math.max(0, SIM_SECONDS - Math.floor(elapsed));
  $('simClock').textContent = '0:' + String(left).padStart(2, '0');
  $('simClock').classList.toggle('run', running);
  $('simStart').hidden = running || elapsed > 0;
  $('simDone').hidden = elapsed < SIM_SECONDS;
  const html = PAIRS.map(p => {   // 21 Nov 2026: kept in a name, and written to the page only when it has changed (see below)
    const st = statusOf(p), opts = RESPONSES[st], pick = chosen[p.key];
    const label = elapsed === 0 ? 'On task' : st === 'fine' ? 'Working fine' : p.text;
    const cls = pick !== undefined ? (opts[pick][1] ? ' good' : ' bad') : (st === 'offtask' || st === 'dispute') ? ' urgent' : '';
    let inner = '';
    if (pick !== undefined) inner = '<p class="why">' + (opts[pick][1] ? '✓ ' : '✗ ') + esc(opts[pick][2]) + '</p>';
    else if (openPair === p.key) inner = '<div class="opts">' + opts.map((o, i) => '<button type="button" data-pick="' + p.key + ':' + i + '">' + esc(o[0]) + '</button>').join('') + '</div>';
    else inner = '<button type="button" class="go" data-go="' + p.key + '">Go over to them</button>';
    return '<div class="pair' + cls + '"><div class="top"><span>Pair ' + p.key + '</span><span class="st ' + st + '">' + esc(label) + '</span></div>' + inner + '</div>';
  }).join('');
  // 21 Nov 2026: while the task ran, the pairs were redrawn five times a second, so a button was replaced between the press and the release and most presses did nothing. They are now redrawn only when something in them has changed.
  if (html !== drawPairs.shown) { $('pairs').innerHTML = html; drawPairs.shown = html; }
}
$('pairs').addEventListener('click', e => {
  const g = e.target.closest('[data-go]'), k = e.target.closest('[data-pick]');
  if (g) { openPair = g.dataset.go; drawPairs(); }
  if (k) { const [key, i] = k.dataset.pick.split(':'); chosen[key] = +i; drawPairs(); }
});
$('simStart').onclick = () => {
  running = true; drawPairs();
  timer = setInterval(() => { elapsed = Math.min(SIM_SECONDS, elapsed + 0.2); if (elapsed >= SIM_SECONDS) { clearInterval(timer); running = false; } drawPairs(); }, 200);
};
$('simAgain').onclick = () => { clearInterval(timer); running = false; elapsed = 0; chosen = {}; openPair = null; drawPairs(); };
drawPairs();

// ---------- 4. Instructions ----------
const TASKS = [
  ['Pairs interview each other about their weekend.', false],
  ['Groups of three put these six sentences in order to reconstruct the story.', false],
  ['Individually, correct the error in each of these five sentences, then compare in pairs.', true],
  ['In groups, decide which of three job candidates you would hire and prepare to justify your choice.', true]
];
const HEDGES = /\b(maybe|sort of|kind of|if you could|whenever|might|just)\b/i;
const POLITE_OPENER = /^\s*(if you don'?t mind|i(?:'d| would)? (?:like|want) you to|could you|would you mind|do you think you could|would it be possible|can you|please)\b/i;
const TASK_VERB = /\b(interview|ask|write|discuss|complete|decide|match|order|correct|read|listen|underline|circle|tell|put)\b/i;
const GROUPING = /\b(pairs?|groups?|individually|alone|everyone|whole class|threes)\b/i;
const BAD_ICQ = /\b(do you understand|is that clear|understand\?|clear\?)\b/i;
let task = 0;
function checkInstruction(t, needsICQ){
  t = t.trim(); if (!t) return null;
  return [
    [TASK_VERB.test(t), 'Says what to DO', 'Name the action: interview, order, decide, correct.'],
    [GROUPING.test(t), 'Says who with', 'Pairs, threes, groups, individually: say it before the task, not after.'],
    [!HEDGES.test(t), 'No hedging', '“Maybe”, “sort of”, “just”, “if you could”: all of it goes.'],
    [!POLITE_OPENER.test(t), 'An instruction, not a request', '“Could you…?” invites a yes or no. Say “Work in pairs.”'],
    [!needsICQ || (/\?/.test(t) && !BAD_ICQ.test(t)), needsICQ ? 'Has a real ICQ' : 'No false check',
      needsICQ ? 'This task needs a check question, and “Do you understand?” is not one. Ask something only someone who understood can answer.' : '“Do you understand?” checks nothing; leave it out.']
  ];
}
function drawTask(){
  $('taskPills').innerHTML = TASKS.map((_, i) => '<button type="button" class="btn' + (i === task ? ' on' : '') + '" data-task="' + i + '">Task ' + (i + 1) + '</button>').join('');
  $('taskText').innerHTML = '<b>The task:</b> ' + esc(TASKS[task][0]);
  drawChecks();
}
function drawChecks(){
  const r = checkInstruction($('instr').value, TASKS[task][1]);
  $('ihint').hidden = !!r;
  $('ichecks').innerHTML = !r ? '' : r.map(x => '<li class="' + (x[0] ? 'ok' : 'no') + '"><span class="m">' + (x[0] ? '✓' : '!') + '</span><span><b>' + esc(x[1]) + '</b>' + (x[0] ? '' : '. ' + esc(x[2])) + '</span></li>').join('');
}
$('taskPills').addEventListener('click', e => { const b = e.target.closest('[data-task]'); if (!b) return; task = +b.dataset.task; $('instr').value = ''; drawTask(); });
$('instr').addEventListener('input', drawChecks);
drawTask();
// 21 Nov 2026: the four tasks as a list for the paper only (the screen shows one at a time, and printed whichever it was on)
(function(){ const P = document.createElement('ol'); P.className = 'task-paper'; P.id = 'taskPaper'; P.innerHTML = TASKS.map(t => '<li>' + esc(t[0]) + '</li>').join(''); $('taskText').after(P); })();

// ---------- 5. Stopping an activity ----------
const STOPS = [
  ['Countdown (“finishing in 10… 9…”)', 'Good for tasks naturally winding down: a clear, low-drama endpoint without cutting anyone off mid-sentence.'],
  ['Hands up / raised hand signal', 'Fast and silent: best for noisy group work when your voice won’t carry, or online when unmuting everyone is chaos.'],
  ['Music (start/stop cue)', 'Works well with younger learners or energizers: the room self-polices when the music stops.'],
  ['One-minute warning, then stop', 'Best default for most tasks: lets students finish a thought instead of stopping abruptly.'],
  ['Move physically to the front / retake the floor', 'Reclaims attention without raising your voice: effective once rapport is established, less so early on.']
];
$('stops').innerHTML = STOPS.map(s => '<div class="reveal-card" onclick="this.classList.toggle(\'open\')"><div class="q">' + esc(s[0]) + '</div><div class="a">' + esc(s[1]) + '</div></div>').join('');

// ---------- 6. Internal clock ----------
let clockState = 'idle', started = 0;
$('clockBtn').onclick = () => {
  if (clockState === 'running') {
    const s = (Date.now() - started) / 1000; clockState = 'done';
    $('clockSay').innerHTML = '<b>' + s.toFixed(1) + 's.</b> ' + (s < 45 ? 'Short: under pressure a minute feels much longer than it is, which is why tasks get cut before learners are ready.'
      : s > 75 ? 'Long: easy to do when you are absorbed, and it is how a five-minute task quietly becomes twelve.'
      : 'Close. Most people are not, which is why you say the time out loud and set a timer rather than trusting the feeling.');
    $('clockBtn').textContent = 'Try again';
  } else { started = Date.now(); clockState = 'running'; $('clockSay').textContent = ''; $('clockBtn').textContent = 'Stop: that’s a minute'; }
};
'''
