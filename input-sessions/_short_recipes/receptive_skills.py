# Connect's 45-minute "Receptive skills — taught the way you'll teach it" (src/app/input-sessions/sessions/receptive-skills.tsx),
# on Lite's desk. Content word for word, American spelling; the reveals, the term match and the seven-stage order work as
# they do on Connect. The answer key is staff-only on Connect, so here it shows only on a tutor's link (body.tutor, set by
# the gate at the foot of the page). Connect's agenda has a 0-2 Lead-in with no content of its own, and the debrief's
# order starts with it: here it is a two-minute personal prompt in the text's own terms (interest, background knowledge,
# reading for what you need). The last two minutes are Connect's trainer-notes slot (43-45), as on its sister sessions.
TITLE = 'Receptive skills: taught the way you’ll teach it'
LONG = 'receptive-skills'
SUB = ('This session is staged exactly like the lesson it teaches: pre-taught vocab, a discussion of how the skill should be taught, '
       'reading the text to check those ideas, then detail questions. Do the tasks first: the debrief afterward is where it gets named.'
       '<span class="pairs">Pairs with: Speakout B2 TP1.1, Identity &amp; personality</span>')
NAV = [('s1', '1 · Lead-in'), ('s2', '2 · What are receptive skills?'), ('s3', '3 · Pre-teach vocab'), ('s4', '4 · Predict the staging'),
       ('s5', '5 · Read the text'), ('s6', '6 · Detail questions'), ('s7', '7 · Debrief')]

NOTES = '''<h4>Running this session</h4>
<p>Don’t name “receptive skills” until the debrief. Time the gist task honestly: a real time limit is part of what’s being modeled, not a formality.</p>
<h4>A real time limit, not a formality</h4>
<p>Time the gist task honestly, out loud, so trainees feel the pressure that forces skimming rather than close reading.</p>
<h4>Peer check is doing real work</h4>
<p>Don’t skip straight to whole-class feedback: the peer-check step is part of what’s being modeled, not padding.</p>'''

BODY = r'''
  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="stage-title">Lead-in <span class="badge">2 minutes</span></div>
      <p class="lead">Think of the last thing you read or listened to in English, or in any language, that was not for a class. What made you want to read it or hear it? And how did you take it in: every word, or just enough to get what you needed?</p>
      <p class="quiet">Tell your partner, about a minute. Keep the answer: the text below comes back to it.</p>
    </div>
  </section>
  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">What are receptive skills? <span class="badge">3 minutes</span></div>
      <div class="reveal-card hero" onclick="this.classList.toggle('open')"><div class="q">What is a receptive skill?</div><div class="hint">Click to reveal</div><div class="a">Reading or listening</div></div>
    </div>
  </section>

  <section id="s3" data-n="3">
    <div class="card" data-n="3">
      <div class="stage-title">Pre-teach vocab <span class="badge">5 minutes</span></div>
      <div id="match"></div>
      <p class="quiet">These are the words you needed before reading, and the terms you’ll teach with, from tomorrow on.</p>
    </div>
  </section>

  <section id="s4" data-n="4">
    <div class="card" data-n="4">
      <div class="stage-title">Stage 2 · Predict the staging <span class="badge">3 minutes</span></div>
      <p class="lead">How do you think receptive skills lessons should be taught?</p>
      <p class="quiet">Discuss with your partner, about a minute.</p>
    </div>
  </section>

  <section id="s5" data-n="5">
    <div class="card" data-n="5">
      <div class="stage-title">Stage 3 · Read the text and check if your ideas were right or wrong <span class="badge">12 minutes</span></div>
      <div class="text-block">
        <p class="tb-title">Staging a receptive skills lesson</p>
        <p>A receptive skills lesson never starts cold. It opens by creating interest in the topic (visuals, personalization, brainstorming what the class already knows) because background knowledge is part of how anyone understands a text, not a shortcut around it. Only then does the lesson pre-teach vocabulary, and only the words essential to understanding.</p>
        <p>The gist task comes next, testing global understanding only. For reading, students read silently under a time limit, so they read quickly and concentrate on the gist rather than the detail; for listening, the recording plays once. Only once gist is secure does the lesson set a specific information or detail task, prompting closer reading or listening.</p>
        <p>Peer checking before whole-class feedback plays a major role in a receptive skills lesson: it increases involvement, builds confidence by making correction feel safer than the teacher stepping in first, deepens understanding as students explain answers to each other, and builds the teamwork and communication skills that matter beyond the classroom.</p>
        <p>The lesson closes with a follow-up task based on something related to the text: a language focus, a discussion, a role play or a written task.</p>
      </div>
    </div>
  </section>

  <section id="s6" data-n="6">
    <div class="card" data-n="6">
      <div class="stage-title">Stage 4 · Detail questions and peer check <span class="badge">10 minutes</span></div>
      <p class="quiet">More time now: look again at the text and answer these questions, then check with your partner.</p>
      <div id="details"></div>
    </div>
  </section>

  <section id="s7" data-n="7">
    <div class="card" data-n="7">
      <div class="stage-title">Debrief: order the stages <span class="badge">8 minutes</span></div>
      <div id="order"></div>
      <div id="key" class="tutor-only"></div>
    </div>
  </section>
'''

STYLE = r'''  .quiet{font-size:.88rem; font-style:italic; color:var(--grey); margin:0 0 10px;}
  .reveal-card .hint{margin-top:4px;} .reveal-card.open .hint{display:none;}
  .reveal-card.hero{max-width:520px; padding:18px 20px;}
  .reveal-card.hero .q{font-family:'Newsreader',Georgia,serif; font-size:1.3rem; line-height:1.25;}
  .text-block p{margin:0 0 10px; line-height:1.6;} .text-block p:last-child{margin-bottom:0;}
  .text-block .tb-title{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.1rem; color:var(--ink);}
  .mhead{display:flex; justify-content:space-between; align-items:baseline; gap:10px; flex-wrap:wrap; font-size:.9rem;}
  .mhead span{color:var(--grey);}
  button.pill{font-family:'Karla',sans-serif; text-align:left; width:100%;}
  button.pill.term{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:.98rem;}
  button.pill.matched{cursor:default;}
  button.order-line{width:100%; justify-content:flex-start; text-align:left; font-family:'Karla',sans-serif; color:var(--ink);}
  .order-line .num{min-width:26px; height:26px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; text-align:center; background:var(--box); color:var(--grey); font-size:.8rem; flex:none;}
  .order-line.done{border-color:var(--teal); background:color-mix(in oklab, var(--teal) 7%, var(--paper)); cursor:default;}
  .order-line.done .num{background:var(--teal); color:#F0EEE9;}
  .ostatus{font-size:.88rem; color:var(--grey); margin:4px 0 0;}
  .ohead{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.15rem; margin:0 0 4px;}
  .ohead + p{font-size:.88rem; color:var(--grey); margin:0 0 10px;} .ohead + p b{color:var(--ink);}
  .btn-row{margin-top:14px;}
  .keyblock{margin-top:14px; border-top:1px solid var(--row-line); padding-top:12px;}
  .keyhead{display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;}
  .keyhead .lbl{font-size:.74rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--grey);}
  .keyhead .btn-row{margin:0;}
  .keypart{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 16px; margin-top:10px;}
  .keypart h4{margin:0 0 6px; font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.05rem;}
  .krow{display:grid; grid-template-columns:150px 1fr; gap:10px; padding:5px 0; border-bottom:1px solid var(--row-line); font-size:.88rem; line-height:1.45;}
  .krow:last-child{border-bottom:0;} .krow b{font-family:'Newsreader',Georgia,serif;} .krow span{color:var(--grey);}
  .krow.tf{grid-template-columns:1fr;} .krow.tf span{font-style:italic;}
  @media(max-width:560px){ .krow{grid-template-columns:1fr; gap:2px;} }
  .stagebox{margin-top:14px; border-top:1px solid var(--row-line); padding-top:12px;}
  .stagebox h4{margin:12px 0 4px; font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.1rem;}
  table.grid td:nth-child(2){white-space:nowrap;}
  @media print{ .keyblock{display:block;} .stagebox .btn{display:none;} }
  /* 21 Nov 2026: an answered task printed solved on the handout: matched meanings in a heavier weight; the ordered stages with their numbers, their dark circles and "3 of 7 placed" or "All seven in order". On paper each prints as it did untouched, without the count. */
  @media print{
    .ostatus{display:none !important;}
    .pill.matched:not(.term){font-weight:500;}
    .order-line.done .num{background:var(--box); color:var(--grey); font-size:0;} .order-line.done .num::after{content:"?"; font-size:.8rem;}
  }
  .tutor-only{display:none !important;} body.tutor .tutor-only{display:block !important;}
  .header .sub .pairs{display:block; margin-top:6px; font-style:normal; font-size:.84rem; color:var(--grey);}
  .krow.tf{grid-template-columns:1fr 110px;} .krow.tf span{font-style:normal; font-weight:600;}
  @media(max-width:560px){ .krow.tf{grid-template-columns:1fr;} }
  .korder{font-size:.9rem; line-height:1.6; margin:0;}
'''

SCRIPT = r'''
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const reveal = (q, a) => '<div class="reveal-card" onclick="this.classList.toggle(\'open\')"><div class="q">' + esc(q) + '</div><div class="hint">Click to reveal</div><div class="a">' + esc(a) + '</div></div>';

const TERMS = [
  ['Skimming / Gist', 'Reading or listening fast over a whole text to get the main idea.'],
  ['Scanning / Specific information', 'Particular facts a reader or listener scans for, ignoring the rest, reading or listening.'],
  ['Detail', 'Finer points understood only on a closer, slower pass, reading or listening.'],
  ['Prediction', 'Guessing content from a title, image or context before reading or listening.'],
  ['Inference', 'Working out something the text or speaker implies but never states directly.'],
  ['Authentic text', 'A real text written or a real recording made for real readers or listeners, not simplified for learners.']
];
const DETAILS = [
  ['It’s a good idea to go cold into a text.', 'False.'],
  ['Using background knowledge helps us understand a text better.', 'True.'],
  ['After students have read for gist, you should ask them if there are any words they don’t know.', 'False.'],
  ['Asking students to “Just read” or “Just listen” is a valid task.', 'False.'],
  ['It’s a good idea to get students to read out loud.', 'False.'],
  ['Setting time limits for skim and scan reading is a good idea.', 'False: only for skimming.'],
  ['Students should be given the option to read/listen more than once for gist.', 'False.'],
  ['Students should answer comprehension questions from memory.', 'False.'],
  ['The teacher must be active and interact with the students while they read.', 'False.'],
  ['Reading tasks should progressively get more difficult.', 'True.'],
  ['The detail/specific information task comes before peer check.', 'True.'],
  ['A follow-up task should be based on something related to the text.', 'True.']
];
const ORDER_ITEMS = { 'lead-in': 'Lead-in', 'pre-teach': 'Pre-teach vocab', gist: 'Gist task', peer1: 'Peer check',
  detail: 'Detail / specific information', peer2: 'Peer check', followup: 'Speaking or writing task' };
const CORRECT_ORDER = ['lead-in', 'pre-teach', 'gist', 'peer1', 'detail', 'peer2', 'followup'];
const SHUFFLED = ['peer1', 'gist', 'detail', 'followup', 'pre-teach', 'lead-in', 'peer2'];
const CORRECT_ORDER_LABEL = CORRECT_ORDER.map(k => ORDER_ITEMS[k]).join(' · ');

// ---------- match each term to its meaning (Connect's MatchTermsExercise: right column reversed, a wrong pair flashes red and clears) ----------
function matchTerms(el, terms){
  let selL = null, selR = null, matched = new Set(), shake = [];
  const cls = (i, sel, side) => matched.has(i) ? ' matched' : (shake[side] === i ? ' wrong' : sel === i ? ' selected' : '');
  function draw(){
    el.innerHTML = '<div class="mhead"><b>Match each term to its meaning</b><span>' + matched.size + ' of ' + terms.length + ' matched</span></div>'
      + '<div class="pill-match-wrap"><div class="pill-col">' + terms.map((t, i) => '<button type="button" class="pill term' + cls(i, selL, 0) + '" data-l="' + i + '">' + esc(t[0]) + '</button>').join('') + '</div>'
      + '<div class="pill-col">' + terms.map((_, i) => terms.length - 1 - i).map(i => '<button type="button" class="pill' + cls(i, selR, 1) + '" data-r="' + i + '">' + esc(terms[i][1]) + '</button>').join('') + '</div></div>';
  }
  function tryMatch(){
    if (selL === null || selR === null) return;
    if (selL === selR) { matched.add(selL); selL = selR = null; }
    else { shake = [selL, selR]; setTimeout(() => { selL = selR = null; shake = []; draw(); }, 400); }
  }
  el.addEventListener('click', e => {
    if (shake.length) return;
    const l = e.target.closest('[data-l]'), r = e.target.closest('[data-r]');
    if (l && !matched.has(+l.dataset.l)) { selL = +l.dataset.l; tryMatch(); draw(); }
    if (r && !matched.has(+r.dataset.r)) { selR = +r.dataset.r; tryMatch(); draw(); }
  });
  draw();
}

// ---------- put the stages back in order (Connect's OrderExercise: only the correct next one locks in) ----------
function orderEx(el, correct, shuffled, title, intro){
  let picked = [];
  function draw(){
    const done = picked.length === correct.length;
    el.innerHTML = '<p class="ohead">' + title + '</p><p>' + intro + '</p>'
      + shuffled.map(lbl => { const idx = picked.indexOf(lbl);
          return '<button type="button" class="order-line' + (idx !== -1 ? ' done' : '') + '" data-o="' + esc(lbl) + '"><span class="num">' + (idx !== -1 ? idx + 1 : '?') + '</span><span>' + esc(lbl) + '</span></button>'; }).join('')
      + '<p class="ostatus">' + (done ? 'All ' + correct.length + ' in order: that’s the staging.' : picked.length + ' of ' + correct.length + ' placed: click the one that comes next.') + '</p>';
  }
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-o]'); if (!b) return;
    const lbl = b.dataset.o;
    if (picked.indexOf(lbl) === -1 && correct[picked.length] === lbl) { picked.push(lbl); draw(); }
  });
  draw();
}

// ---------- the answer key: hidden, then a handout to keep ----------
function answerKey(el, terms, details){
  let open = false;
  function draw(){
    if (!open) { el.innerHTML = '<div class="btn-row"><button type="button" class="btn" data-k="open">Reveal answer key: save or print to keep</button></div>'; return; }
    el.innerHTML = '<div class="keyblock"><div class="keyhead"><span class="lbl">Answer key: handout, to keep</span><div class="btn-row"><button type="button" class="btn" data-k="hide">Hide</button><button type="button" class="btn" data-k="print">Print</button></div></div>'
      + (terms.length ? '<div class="keypart"><h4>Terms</h4>' + terms.map(t => '<div class="krow"><b>' + esc(t[0]) + '</b><span>' + esc(t[1]) + '</span></div>').join('') + '</div>' : '')
      + (details.length ? '<div class="keypart"><h4>True or false</h4>' + details.map(d => '<div class="krow tf"><b>' + esc(d[0]) + '</b><span>' + esc(d[1]) + '</span></div>').join('') + '</div>' : '')
      + '</div>';
  }
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-k]'); if (!b) return;
    if (b.dataset.k === 'open') open = true; else if (b.dataset.k === 'hide') open = false; else { window.print(); return; }
    draw();
  });
  draw();
}

// ---------- the staging example ----------
function stagingEx(el, title, rows){
  let open = false;
  function draw(){
    el.innerHTML = '<div class="stagebox"><div class="btn-row"><button type="button" class="btn" data-s>' + (open ? 'Hide staging example' : 'See staging example') + '</button></div>'
      + (open ? '<h4>' + esc(title) + '</h4><table class="grid"><thead><tr><th>Stage</th><th>Time</th><th>Procedure</th></tr></thead><tbody>'
          + rows.map(r => '<tr><td><b>' + esc(r[0]) + '</b></td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>').join('') + '</tbody></table>' : '') + '</div>';
  }
  el.addEventListener('click', e => { if (e.target.closest('[data-s]')) { open = !open; draw(); } });
  draw();
}


// ---------- the seven stages: two share a label, so they go by key ----------
let picked = [];
function drawOrder(){
  const done = picked.length === CORRECT_ORDER.length;
  $('order').innerHTML = '<p class="ohead">Debrief: put the stages back in order</p><p>You just moved through these seven stages: click each one in the order you actually experienced it. This is a <b>loop input</b>: the session modeled the technique instead of only describing it.</p>'
    + SHUFFLED.map(k => { const idx = picked.indexOf(k);
        return '<button type="button" class="order-line' + (idx !== -1 ? ' done' : '') + '" data-o="' + k + '"><span class="num">' + (idx !== -1 ? idx + 1 : '?') + '</span><span>' + esc(ORDER_ITEMS[k]) + '</span></button>'; }).join('')
    + '<p class="ostatus">' + (done ? 'All seven in order: that’s the staging.' : picked.length + ' of 7 placed: click the one that comes next.') + '</p>';
}
$('order').addEventListener('click', e => {
  const b = e.target.closest('[data-o]'); if (!b) return;
  const k = b.dataset.o;
  if (picked.indexOf(k) === -1 && CORRECT_ORDER[picked.length] === k) { picked.push(k); drawOrder(); }
});
drawOrder();

// ---------- the answer key: trainer only ----------
let keyOpen = false;
function drawKey(){
  if (!keyOpen) { $('key').innerHTML = '<div class="btn-row"><button type="button" class="btn" data-k="open">Reveal answer key: trainer only</button></div>'; return; }
  $('key').innerHTML = '<div class="keyblock"><div class="keyhead"><span class="lbl">All done: handout · answer key, to keep</span><div class="btn-row"><button type="button" class="btn" data-k="hide">Hide</button><button type="button" class="btn" data-k="print">Print</button></div></div>'
    + '<div class="keypart"><h4>Terminology</h4>' + TERMS.map(t => '<div class="krow"><b>' + esc(t[0]) + '</b><span>' + esc(t[1]) + '</span></div>').join('') + '</div>'
    + '<div class="keypart"><h4>True or false</h4>' + DETAILS.map(d => '<div class="krow tf"><b>' + esc(d[0]) + '</b><span>' + esc(d[1]) + '</span></div>').join('') + '</div>'
    + '<div class="keypart"><h4>Correct stage order</h4><p class="korder">' + esc(CORRECT_ORDER_LABEL) + '</p></div></div>';
}
$('key').addEventListener('click', e => {
  const b = e.target.closest('[data-k]'); if (!b) return;
  if (b.dataset.k === 'open') keyOpen = true; else if (b.dataset.k === 'hide') keyOpen = false; else { window.print(); return; }
  drawKey();
});
drawKey();

matchTerms($('match'), TERMS);
$('details').innerHTML = DETAILS.map(d => reveal(d[0], d[1])).join('');
'''
