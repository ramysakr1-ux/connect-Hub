# Connect's 45-minute "Functional language — taught the way you'll teach it" (src/app/input-sessions/sessions/functional-language.tsx),
# on Lite's desk. Content word for word, American spelling; the reveals, the term match, the rank by formality, the stage
# order, the answer key and the staging example work as they do on Connect.
TITLE = 'Functional language: taught the way you’ll teach it'
LONG = 'functional-language'
SUB = ('Functional language isn’t one grammar structure: it’s a set of phrases that all do the same social job. This session is '
       'staged the way a functional lesson is staged. Do the tasks first: naming what happened is what the debrief is for.')
NAV = [('s1', '1 · Lead-in'), ('s2', '2 · What is functional language?'), ('s3', '3 · Match the terms'),
       ('s4', '4 · Predict, read, detail check'), ('s5', '5 · Rank by formality'), ('s6', '6 · Debrief')]

NOTES = '''<h4>Running this session</h4>
<p>Don’t name “functional language” until the debrief. Push on appropriacy as hard as on meaning: a phrase that’s the wrong register is as wrong as one with the wrong grammar.</p>
<h4>Several exponents, not one form</h4>
<p>Watch for trainees trying to teach a single “correct” phrase: the point is a set students can choose between depending on context.</p>
<h4>Appropriacy is not optional</h4>
<p>A trainee who clarifies meaning and pronunciation but skips register has only done two-thirds of the job: push them to name who each exponent suits.</p>
<h4>Intonation carries the politeness</h4>
<p>The same words said flat can sound sarcastic or rude: model the rise-fall pattern yourself before asking students to produce it.</p>'''

BODY = r'''
  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="stage-title">Lead-in <span class="badge">2 minutes</span></div>
      <p class="lead">Quick show of hands: how many different ways can you think of, right now, to ask someone to close a window?</p>
    </div>
  </section>

  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">What is functional language? <span class="badge">3 minutes</span></div>
      <div class="reveal-card hero" onclick="this.classList.toggle('open')"><div class="q">What is functional language?</div><div class="hint">Click to reveal</div><div class="a">A set of phrases (exponents) that all achieve the same social function, chosen by context and formality.</div></div>
    </div>
  </section>

  <section id="s3" data-n="3">
    <div class="card" data-n="3">
      <div class="stage-title">Match the terms <span class="badge">5 minutes</span></div>
      <div id="match"></div>
    </div>
  </section>

  <section id="s4" data-n="4">
    <div class="card" data-n="4">
      <div class="stage-title">Predict, read the text, detail check <span class="badge">13 minutes</span></div>
      <p class="sl">Stage 2</p>
      <p class="lead">How do you think a functional language lesson should be staged?</p>
      <p class="quiet">Discuss with your partner, about a minute, no wrong answers yet.</p>
      <p class="sl">Stage 3 · Read the text and check if your ideas were right or wrong</p>
      <div class="text-block">
        <p class="tb-title">Staging a functional language lesson</p>
        <p>A functional lesson doesn’t clarify one grammar structure: it teaches a set of exponents that all achieve the same social function, such as suggesting, complaining, or apologizing. It usually opens with a situation or short dialogue that makes the function’s context obvious. From that context the teacher elicits or presents several exponents at once (“How about...?”, “Why don’t you...?”, “You could...”) rather than a single form. Meaning here is about the social effect (“What is this person trying to get the other person to do?”), and appropriacy matters as much as meaning: which exponent suits a close friend, and which suits a stranger or a boss? Pronunciation work usually centers on intonation, since a technically correct exponent said with the wrong intonation can sound rude or insincere. Practice moves from matching or ordering exponents by formality to freer roleplay in a realistic situation.</p>
      </div>
      <p class="sl">Stage 4</p>
      <p class="quiet">More time now: answer these from the text, then check with your partner.</p>
      <div id="details"></div>
    </div>
  </section>

  <section id="s5" data-n="5">
    <div class="card" data-n="5">
      <div class="stage-title">Rank by formality <span class="badge">10 minutes</span></div>
      <div id="rank"></div>
    </div>
  </section>

  <section id="s6" data-n="6">
    <div class="card" data-n="6">
      <div class="stage-title">Debrief <span class="badge">12 minutes</span></div>
      <div id="order"></div>
      <div id="key"></div>
      <div id="staging"></div>
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
  .sl{font-weight:700; font-size:.92rem; color:var(--ink); margin:18px 0 6px;} .sl:first-of-type{margin-top:4px;}
  .rank{display:flex; flex-direction:column; gap:6px; margin-top:8px;}
  .rank .row{background:var(--paper); border:1.5px solid var(--teal); border-radius:var(--r-control); padding:9px 14px; font-weight:600; font-size:.92rem; background:color-mix(in oklab, var(--teal) 7%, var(--paper));}
  .rank .row.no{border-color:var(--a-red); background:color-mix(in oklab, var(--a-red) 7%, var(--paper));}
  .rank button.opt{text-align:left; background:var(--paper); border:1.5px solid var(--sand-line); padding:9px 14px; font:400 .92rem 'Karla',sans-serif; color:var(--ink); cursor:pointer;}
  .rank button.opt:hover{border-color:var(--gold);}
  .rankmsg{font-size:.88rem; margin:8px 0 0;} .rankmsg.no{color:var(--a-red);} .rankmsg.ok{color:var(--teal);}
'''

SCRIPT = r'''
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const reveal = (q, a) => '<div class="reveal-card" onclick="this.classList.toggle(\'open\')"><div class="q">' + esc(q) + '</div><div class="hint">Click to reveal</div><div class="a">' + esc(a) + '</div></div>';

const TERMS = [
  ['Exponent', 'One of several phrases that carry out a function, e.g. “How about...?” for suggesting.'],
  ['Function', 'The social job language does: suggesting, apologizing, complaining, requesting.'],
  ['Appropriacy', 'Whether an exponent fits the context: formality, relationship, setting.'],
  ['Register', 'The level of formality a phrase carries: casual, neutral, formal.'],
  ['Fixed expression', 'A phrase learned as a whole chunk rather than built word by word.']
];
const DETAILS = [
  ['A functional lesson clarifies a single correct form.', 'False: it teaches several exponents students choose between.'],
  ['Appropriacy is checked alongside meaning and pronunciation.', 'True.'],
  ['Intonation is a minor detail in functional language.', 'False: it often carries whether the phrase sounds polite or rude.'],
  ['Different exponents for the same function usually differ in formality.', 'True.'],
  ['Practice should include ordering or matching by formality.', 'True.'],
  ['A functional lesson always opens with a grammar rule.', 'False: it opens with a situation or dialogue establishing the function.']
];
// The rank by formality is the session's own practice stage, after the detail check: it is in the order too.
const CORRECT_ORDER = ['Pre-teach terms', 'Predict the staging', 'Read the text, check ideas', 'Detail check', 'Rank by formality'];
const SHUFFLED = ['Read the text, check ideas', 'Rank by formality', 'Pre-teach terms', 'Detail check', 'Predict the staging'];
const RANK_CORRECT = ['Would you mind closing the window?', 'Could you close the window?', 'Can you close the window?', 'Close the window, would you?'];
const RANK_SHUFFLED = ['Can you close the window?', 'Would you mind closing the window?', 'Close the window, would you?', 'Could you close the window?'];
const EXAMPLE_TITLE = 'Example lesson: making suggestions';
const EXAMPLE_ROWS = [
  ['Lead-in', '3′', 'Ss look at a picture of a messy shared kitchen: “What would you say to your flatmate?”'],
  ['Present exponents', '10′', 'T presents 4 suggestion exponents of varying formality, elicits the social effect of each.'],
  ['Meaning + appropriacy', '10′', 'Ss match exponents to situations (close friend vs. new flatmate vs. landlord).'],
  ['Pronunciation', '7′', 'T drills rise-fall intonation, contrasts with a flat, rude-sounding version.'],
  ['Freer practice', '15′', 'Roleplay: Ss choose the right exponent for three different relationships.']
];

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


// ---------- rank these exponents, most to least formal ----------
let ranked = [];
function drawRank(){
  const remaining = RANK_SHUFFLED.filter(x => ranked.indexOf(x) === -1);
  const full = ranked.length === RANK_CORRECT.length;
  const wrong = full && ranked.some((r, i) => r !== RANK_CORRECT[i]);
  $('rank').innerHTML = '<p class="sl">Rank these exponents, most to least formal</p><p class="quiet">Function: making a request. Click each in order, most formal first.</p>'
    + '<div class="rank">' + ranked.map((x, i) => '<div class="row' + (wrong ? ' no' : '') + '">' + (i + 1) + '. ' + esc(x) + '</div>').join('')
    + remaining.map(x => '<button type="button" class="opt" data-rank="' + esc(x) + '">' + esc(x) + '</button>').join('') + '</div>'
    + (wrong ? '<p class="rankmsg no">Not the order most people would rank these: reset and try again.</p>' : full ? '<p class="rankmsg ok">✓ In order.</p>' : '')
    + '<div class="btn-row"><button type="button" class="btn" data-reset>Reset</button></div>';
}
$('rank').addEventListener('click', e => {
  const b = e.target.closest('[data-rank]'); if (b) { ranked.push(b.dataset.rank); drawRank(); }
  if (e.target.closest('[data-reset]')) { ranked = []; drawRank(); }
});
drawRank();

matchTerms($('match'), TERMS);
$('details').innerHTML = DETAILS.map(d => reveal(d[0], d[1])).join('');
orderEx($('order'), CORRECT_ORDER, SHUFFLED, 'Debrief: put the stages back in order',
  'Click each stage in the order you just experienced it. This is a <b>loop input</b>: the session modeled the framework instead of only describing it.');
answerKey($('key'), TERMS, DETAILS);
stagingEx($('staging'), EXAMPLE_TITLE, EXAMPLE_ROWS);
'''
