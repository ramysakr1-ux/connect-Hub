# Connect's 45-minute "Giving feedback on tasks" (src/app/input-sessions/sessions/giving-feedback-on-tasks.tsx), on Lite's
# desk. Content word for word, American spelling; the method cards, the weak-move judging, the order exercise and the
# task cards for the live round work as they do on Connect.
TITLE = 'Giving feedback on tasks'
LONG = ''
SUB = ('Not error correction; this is feedback on whether students completed the task itself: did they get the right answer, finish '
       'the discussion, reach a decision. Skipping this stage means students never find out if the activity actually worked.')
NAV = [('s1', '1 · Lead-in'), ('s2', '2 · Method to task'), ('s3', '3 · Weak moves'), ('s4', '4 · The order'),
       ('s5', '5 · Run it live'), ('s6', '6 · Wrap-up')]

NOTES = '''<h4>Running this session</h4>
<p>Pairs for the first four stages, threes for the live round. Everything here is a planning decision: the method is chosen while writing the lesson, not improvised once the task has finished.</p>
<h4>0–5 · Lead-in from their own TP</h4>
<p>Every trainee has now watched at least six lessons. Anchor to one they saw this week. If nobody offers the "never found out" moment, offer one of your own.</p>
<h4>5–15 · Method to task</h4>
<p>Reveal one card together, then let pairs do the other four. The point is that the method is a design decision made while planning, not improvised after.</p>
<h4>15–28 · Weak moves</h4>
<p>Let them pick all five before discussing. The two "good" moves are deliberately different speeds: draw out when you would choose the slow one.</p>
<h4>28–35 · The order</h4>
<p>The trap is "address wrong answers" before "check as a group": you cannot know what went wrong until the room has checked. Say that out loud.</p>
<h4>35–43 · Run it live</h4>
<p>Strict timing: 90 seconds task, 60 seconds feedback, swap. Observers use the card note. Three rounds fits; do not let the task itself run long.</p>
<h4>43–45 · Close</h4>
<p>One line each. Write the methods on the board as they say them: it becomes the list they plan from tomorrow.</p>'''

BODY = r'''
  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="stage-title">Lead-in <span class="badge">5 minutes</span></div>
      <p class="lead">Think of the last TP you watched. After a task finished, how did the teacher check it, and how long did it take? In pairs: was there a moment where students never found out whether they were right?</p>
      <p class="quiet">Two minutes in pairs, then three answers from the room. No feedback from the trainer yet: the session supplies it.</p>
    </div>
  </section>

  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">Match the task to its feedback method <span class="badge">10 minutes</span></div>
      <p class="lead">Every task type needs a different way of checking answers. Click each task for the fastest, clearest way to close the loop.</p>
      <div id="methods"></div>
    </div>
  </section>

  <section id="s3" data-n="3">
    <div class="card" data-n="3">
      <div class="stage-title">Spot the weak feedback move <span class="badge">13 minutes</span></div>
      <p class="lead">Same task, five ways a teacher might run feedback on it. Pick each one to find out whether it works.</p>
      <div class="task-box"><b>Task:</b> pairs read a short text and answer five true/false comprehension questions.</div>
      <div id="moves"></div>
    </div>
  </section>

  <section id="s4" data-n="4">
    <div class="card" data-n="4">
      <div class="stage-title">The order that actually works <span class="badge">7 minutes</span></div>
      <div id="order"></div>
    </div>
  </section>

  <section id="s5" data-n="5">
    <div class="card" data-n="5">
      <div class="stage-title">Run it live <span class="badge">8 minutes</span></div>
      <p class="lead">In threes: one teacher, two students. The students do the task for 90 seconds, then the teacher runs feedback in under a minute, method matched to the task. Swap roles. Click a card to take it.</p>
      <div id="live"></div>
    </div>
  </section>

  <section id="s6" data-n="6">
    <div class="card" data-n="6">
      <div class="stage-title">Wrap-up <span class="badge">2 minutes</span></div>
      <p class="lead">One line each, round the room: the feedback method you will use in your next TP, and for which task.</p>
    </div>
  </section>
'''

STYLE = r'''
  .quiet{font-size:.88rem; font-style:italic; color:var(--grey); margin:4px 0 10px;}
  .task-box{background:var(--paper); border:1.5px dashed var(--sand-line); border-radius:var(--r-strip); padding:10px 14px; margin:0 0 10px; font-size:.9rem; line-height:1.5;}
  .hint{display:block; margin-top:6px; font-size:.76rem; font-weight:600; color:var(--teal);}
  .move{display:block; width:100%; text-align:left; font-family:'Karla',sans-serif; color:var(--ink); background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 16px; margin:8px 0; cursor:pointer; font-size:.9rem; line-height:1.5;}
  .move:hover:not(:disabled){border-color:var(--gold);}
  .move:disabled{cursor:default;}
  .move .top{display:flex; justify-content:space-between; gap:12px; align-items:flex-start;}
  .move .mark{flex:none; font-weight:700; font-size:.86rem; white-space:nowrap;}
  .move .why{display:block; margin-top:6px; font-size:.88rem;}
  .move.good{border-color:var(--teal); background:color-mix(in oklab, var(--teal) 7%, var(--paper));} .move.good .mark, .move.good .why{color:var(--teal);}
  .move.bad{border-color:var(--a-red); background:color-mix(in oklab, var(--a-red) 5%, var(--paper));} .move.bad .mark, .move.bad .why{color:var(--a-red);}
  .ox{display:flex; flex-direction:column; margin-top:10px;}
  .ox .order-line{justify-content:flex-start; width:100%; text-align:left; font-family:'Karla',sans-serif; color:var(--ink);}
  .ox .order-line .num{flex:none; min-width:24px; height:24px; border-radius:50%; background:var(--box); color:var(--grey); display:inline-flex; align-items:center; justify-content:center; font-size:.78rem;}
  .ox .order-line.done{border-color:var(--teal); background:color-mix(in oklab, var(--teal) 7%, var(--paper)); cursor:default;}
  .ox .order-line.done .num{background:var(--teal); color:var(--paper);}
  .ostat{font-size:.86rem; color:var(--grey); margin:4px 0 0;}
  .ointro{font-size:.95rem; color:#3b3a37; margin:0 0 6px;}
  .live .who{display:block; font:700 .68rem/1 'Karla',sans-serif; letter-spacing:.12em; text-transform:uppercase; color:var(--grey); margin:0 0 6px;}
  .live .task{font-size:.9rem; line-height:1.5;}
  .live .watch{display:none; margin-top:8px; padding-top:8px; border-top:1px solid var(--row-line); font-size:.88rem; color:var(--teal);}
  .live.open .watch{display:block;} .live.open .hint{display:none;}
  @media print{ .hint, .move .why, .move .mark, .live .watch{display:none !important;} }
  /* 21 Nov 2026: an answered task printed solved: the ordered stages printed their numbers and "All 4 in order". On paper each prints as it did untouched: a blank circle to number in, no count. */
  @media print{ .ostat{display:none !important;} .ox .order-line.done{border-color:#999 !important; background:none !important;} .ox .order-line .num{display:none !important;} .ox .order-line::before{content:""; flex:none; width:22px; height:22px; border:1px solid #999; border-radius:50%;} }
'''

SCRIPT = r'''
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

const METHODS = [
  ['True/false or multiple-choice questions', 'Read out the statement, ask for a show of hands or a quick chorus answer: fast, and you can see who’s unsure without cold-calling anyone.'],
  ['Open discussion task (no single right answer)', 'Whole-class round-up: ask a few pairs what they concluded and why, rather than an “answer key”: the goal is comparing reasoning, not marking right/wrong.'],
  ['Ordering or matching task', 'Put the correct order on the board (or reveal an answer slide) and have students self-check against it: faster than going through it item by item out loud.'],
  ['Writing task (a short paragraph or email)', 'Peer feedback first using a simple checklist, then a few models shared with the class, not marking every paper live in the lesson.'],
  ['Information-gap or role-play', 'Ask a couple of pairs to briefly report what they found out: checks the task worked without restaging the whole role-play for the class.']
];
const MOVES = [
  ['Nominate one pair to read out all five answers while everyone else listens.', false, 'Only checks one pair’s work: the rest of the room never finds out if they were right.'],
  ['Put the answers on the board and have pairs self-check, then ask who got all five.', true, 'Every pair checks their own work directly, and the quick show of hands tells you where confusion is, fast.'],
  ['Ask “does everyone understand?” and move on.', false, 'This checks nothing: it’s a closed question nobody ever answers honestly.'],
  ['Go through the answers together, but ask a different pair to justify each one from the text.', true, 'Slower, but it surfaces reading strategy, not just the answer: worth it if you have the time.'],
  ['Collect every pair’s answers to mark after the lesson, say nothing in class.', false, 'Feedback that arrives after the lesson has ended can’t inform anything that happens in it.']
];
const ORDER_CORRECT = ['Students finish the task', 'Check answers as a group (method matched to task type)', 'Address any answers that came up wrong', 'Move to language focus or the next stage'];
const ORDER_SHUFFLED = ['Address any answers that came up wrong', 'Students finish the task', 'Move to language focus or the next stage', 'Check answers as a group (method matched to task type)'];
const LIVE_CARDS = [
  ['Students match six phrasal verbs to their meanings.', 'Did the answers go on the board so everyone self-checked, or did one student read them out while the rest waited?'],
  ['Pairs decide the three most useful apps for learning English.', 'Open task: did the teacher compare reasoning across pairs, or try to find a “right answer”?'],
  ['Students listen and note four prices from a short recording.', 'Fast method wanted: chorus or hands. Did the teacher also play the extract again for any price the room split on?']
];

// ---------- 2. Method to task ----------
$('methods').innerHTML = METHODS.map(m => '<div class="reveal-card" onclick="this.classList.toggle(\'open\')"><div class="q">' + esc(m[0]) + '</div><div class="a">' + esc(m[1]) + '</div></div>').join('');

// ---------- 3. Spot the weak move: one pick judges it, and it stays judged ----------
$('moves').innerHTML = MOVES.map((m, i) => '<button type="button" class="move" data-m="' + i + '"><span class="top"><span>' + esc(m[0]) + '</span></span><span class="hint">Click to judge it</span></button>').join('');
$('moves').addEventListener('click', e => {
  const b = e.target.closest('[data-m]'); if (!b || b.disabled) return;
  const m = MOVES[+b.dataset.m]; b.disabled = true; b.classList.add(m[1] ? 'good' : 'bad');
  b.innerHTML = '<span class="top"><span>' + esc(m[0]) + '</span><span class="mark">' + (m[1] ? '✓ Works' : '✗ Weak') + '</span></span><span class="why">' + esc(m[2]) + '</span>';
});

// ---------- 4. The order (Connect's OrderExercise): only the right next stage locks in ----------
function orderEx(el, correct, shuffled, intro){
  const picked = [];
  function draw(){
    el.innerHTML = '<p class="ointro">' + intro + '</p><div class="ox">'
      + shuffled.map((l, i) => { const n = picked.indexOf(l); return '<button type="button" class="order-line' + (n > -1 ? ' done' : '') + '" data-i="' + i + '"><span class="num">' + (n > -1 ? n + 1 : '?') + '</span><span>' + esc(l) + '</span></button>'; }).join('')
      + '</div><p class="ostat">' + (picked.length === correct.length ? 'All ' + correct.length + ' in order: that’s the staging.' : picked.length + ' of ' + correct.length + ' placed: click the one that comes next.') + '</p>';
  }
  el.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (!b) return; const l = shuffled[+b.dataset.i]; if (picked.indexOf(l) === -1 && correct[picked.length] === l) { picked.push(l); draw(); } });
  draw();
}
orderEx($('order'), ORDER_CORRECT, ORDER_SHUFFLED, 'Click each stage in the order you would run it.');

// ---------- 5. Run it live: take a card to see what to watch for ----------
$('live').innerHTML = LIVE_CARDS.map((c, i) => '<div class="reveal-card live" onclick="this.classList.toggle(\'open\')"><span class="who">Task card ' + (i + 1) + '</span><div class="task">' + esc(c[0]) + '</div><span class="hint">Click to take this card</span><div class="watch"><b>Watch for:</b> ' + esc(c[1]) + '</div></div>').join('');
'''
