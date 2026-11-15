# Connect's 45-minute "Presentation, Practice, Production" (src/app/input-sessions/sessions/ppp.tsx), on Lite's desk.
# Content word for word, American spelling; the match, the reveal cards, the order debrief, the answer key and the
# staging example work as they do on Connect.
TITLE = 'Presentation, Practice, Production: taught the way you’ll teach it'
LONG = 'ppp'
SUB = 'This session is staged exactly like the lesson framework it teaches. Do the tasks first: naming what happened is what the debrief is for.'
NAV = [('s1', '1 · Lead-in'), ('s2', '2 · What is PPP?'), ('s3', '3 · Match the terms'), ('s4', '4 · Predict the staging'),
       ('s5', '5 · Read the text'), ('s6', '6 · Detail questions'), ('s7', '7 · Debrief')]

NOTES = '''<h4>Running this session</h4>
<p>Don't name "PPP" until the debrief. Present the form yourself in stage 3 rather than eliciting it: that contrast with the other frameworks is the point.</p>
<h4>Keep the order strict</h4>
<p>Accuracy work (presentation, then controlled practice) always precedes fluency work. Don't let the room jump ahead to production early.</p>
<h4>Its main weakness, worth naming</h4>
<p>PPP assumes the whole class needs the same language at the same time: a poor fit for mixed-level groups or when some students already partly know the form.</p>
<h4>Delayed feedback, genuinely delayed</h4>
<p>Resist correcting during production: note errors and address them once the freer practice has finished.</p>'''

BODY = r'''
  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="stage-title">Lead-in <span class="badge">2 minutes</span></div>
      <p class="lead">Quick show of hands: who learned a language mostly by being told the rule first, then practicing it? Did that work for you?</p>
    </div>
  </section>

  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">What is PPP? <span class="badge">3 minutes</span></div>
      <div class="reveal-card hero" onclick="this.classList.toggle('open')">
        <div class="q">What does PPP stand for?</div>
        <div class="hint">Click to reveal</div>
        <div class="a">Presentation, Practice, Production: language given, then practiced, then produced freely.</div>
      </div>
    </div>
  </section>

  <section id="s3" data-n="3">
    <div class="card" data-n="3">
      <div class="stage-title">Match the terms <span class="badge">5 minutes</span></div>
      <p class="lead">Match each term to its meaning. Click a term, then its meaning (either order).</p>
      <p class="mstatus" id="mStatus">0 of 5 matched</p>
      <div class="pill-match-wrap"><div class="pill-col" id="mLeft"></div><div class="pill-col" id="mRight"></div></div>
    </div>
  </section>

  <section id="s4" data-n="4">
    <div class="card" data-n="4">
      <div class="stage-title">Predict the staging <span class="badge">3 minutes</span></div>
      <p class="lead">How do you think a PPP lesson should be staged?</p>
      <p class="quiet">Discuss with your partner, about a minute: no wrong answers yet.</p>
    </div>
  </section>

  <section id="s5" data-n="5">
    <div class="card" data-n="5">
      <div class="stage-title">Read the text, check ideas <span class="badge">10 minutes</span></div>
      <p class="lead">Read the text and check if your ideas were right or wrong.</p>
      <div class="text-block">
        <h3 class="tb-h">Staging a PPP lesson</h3>
        <p>A PPP lesson opens with the target language given directly, not discovered. The teacher sets up a clear context, models the form once or twice, and checks meaning with CCQs, all before students produce anything themselves. Form comes next, usually a short board summary, then pronunciation: stress, weak forms, drilling chorally and individually. Practice follows in two distinct phases. Controlled practice comes first (gap-fills, substitution drills, matching), with one right answer and the teacher correcting closely as students work. Freer, or production, practice comes last: students use the language to say something of their own, the teacher monitors without interrupting, and feedback on errors is saved for the end. The three stages always run in that order (presentation, then practice, then production) because accuracy work has to come before fluency work in this framework.</p>
      </div>
    </div>
  </section>

  <section id="s6" data-n="6">
    <div class="card" data-n="6">
      <div class="stage-title">Detail questions <span class="badge">10 minutes</span></div>
      <p class="lead">More time now: answer these from the text, then check with your partner.</p>
      <div id="details"></div>
      <div class="text-block">
        <h3 class="tb-h">Presentation and practice, kept brief</h3>
        <p>Present the form directly: a short board example and a quick CCQ check, not an extended explanation. Then move to controlled practice (drilling, a gap-fill, or a matching task using the same form) before freer practice (students producing the language themselves in a short exchange or writing task). Keep each stage tight: PPP’s risk is spending too long presenting and leaving too little time for students to actually use the language.</p>
      </div>
    </div>
  </section>

  <section id="s7" data-n="7">
    <div class="card" data-n="7">
      <div class="stage-title">Debrief: put the stages back in order <span class="badge">10 minutes</span></div>
      <p class="lead">Click each stage in the order you just experienced it. This is a <b>loop input</b>: the session modeled the framework instead of only describing it.</p>
      <div id="order"></div>
      <p class="quiet" id="oStatus"></p>

      <div id="key">
        <div class="btn-row"><button class="btn" id="keyOpen" type="button">Reveal answer key: save or print to keep</button></div>
        <div id="keyBody" hidden>
          <div class="keyhead"><span class="keylabel">Answer key: handout, to keep</span>
            <span class="btn-row"><button class="btn" id="keyHide" type="button">Hide</button><button class="btn" id="keyPrint" type="button">Print</button></span></div>
          <div class="text-block"><h3 class="tb-h">Terms</h3><div id="keyTerms"></div></div>
          <div class="text-block"><h3 class="tb-h">True or false</h3><div id="keyTF"></div></div>
        </div>
      </div>

      <div class="btn-row"><button class="btn" id="exBtn" type="button">See staging example</button></div>
      <div id="exBody" hidden>
        <h3 class="ex-h">Example lesson: comparative adjectives</h3>
        <div class="extable"><div class="exrow exhead"><span>Stage</span><span>Time</span><span>Procedure</span></div><div id="exRows"></div></div>
      </div>
    </div>
  </section>
'''

STYLE = r'''
  .quiet{font-size:.88rem; font-style:italic; color:var(--grey); margin:4px 0 0;}
  .reveal-card.hero{max-width:28rem; text-align:center; padding:26px 22px; border-top:3px solid var(--teal);}
  .reveal-card.hero .q{font:600 1.3rem/1.3 'Newsreader',Georgia,serif;}
  .reveal-card.hero .hint{margin-top:10px;}
  .reveal-card.hero.open .hint{display:none;}
  .reveal-card.hero .a{text-align:left; color:var(--teal);}
  .mstatus{font-size:.84rem; font-weight:600; color:var(--grey); margin:0;}
  .pill{text-align:left;}
  .pill.term{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1rem;}
  .pill.matched{cursor:default;}
  .tb-h{margin:2px 0 6px; font:600 1.05rem 'Newsreader',Georgia,serif; color:var(--ink);}
  .text-block p{margin:0;}
  .order-line{width:100%; text-align:left; justify-content:flex-start; color:var(--ink); font-family:'Karla',sans-serif;}
  .order-line .num{min-width:24px; height:24px; border-radius:999px; display:inline-flex; align-items:center; justify-content:center; background:var(--box); color:var(--grey); font-size:.8rem;}
  .order-line.done{border-color:var(--teal); background:color-mix(in oklab, var(--teal) 9%, var(--paper)); cursor:default; font-weight:600;}
  .order-line.done .num{background:var(--teal); color:#F0EEE9;}
  #key, #exBtn{margin-top:6px;}
  .keyhead{display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap; margin-top:14px;}
  .keyhead .btn-row{margin-top:0;}
  .keylabel{font-family:'Karla',sans-serif; font-size:.78rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--grey);}
  .krow{display:grid; grid-template-columns:150px 1fr; gap:10px; padding:5px 0; border-bottom:1px solid var(--row-line); font-size:.88rem;}
  .krow:last-child, .ktf:last-child{border-bottom:0;}
  .krow b{font-family:'Newsreader',Georgia,serif; color:var(--ink);}
  .ktf{padding:6px 0; border-bottom:1px solid var(--row-line); font-size:.88rem;}
  .ktf p{margin:0;} .ktf p + p{font-style:italic; color:var(--grey);}
  .ex-h{margin:14px 0 8px; font:600 1.15rem 'Newsreader',Georgia,serif;}
  .extable{border:1px solid var(--sand-line); border-radius:var(--r-strip); overflow:hidden; background:var(--paper);}
  .exrow{display:grid; grid-template-columns:150px 60px 1fr; gap:8px; padding:8px 12px; border-bottom:1px solid var(--row-line); font-size:.86rem; line-height:1.5;}
  #exRows .exrow:last-child{border-bottom:0;}
  .exrow b{color:var(--ink);} .exrow span{color:var(--grey);}
  .exhead{background:var(--box); font-size:.7rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--grey);}
  @media(max-width:560px){
    .krow{grid-template-columns:1fr; gap:2px;}
    .exrow{grid-template-columns:1fr 44px;} .exrow > :nth-child(3){grid-column:1 / -1;}
  }
  @media print{
    body.print-key .wrap > *:not(#s7){display:none !important;}
    body.print-key #s7 .card > *:not(#key){display:none !important;}
    body.print-key #s7 .card{padding-left:0;} body.print-key #s7 .card::before{display:none;}
    body.print-key #keyOpen, body.print-key .keyhead .btn-row{display:none !important;}
  }
'''

SCRIPT = r'''
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

const TERMS = [
  ['Presentation', 'The teacher gives the target language directly, with context, model and CCQs.'],
  ['Controlled practice', 'Accuracy-focused practice with one right answer, teacher corrects closely.'],
  ['Production', 'Freer, fluency-focused practice using the learner’s own ideas.'],
  ['Drilling', 'Students repeat a word or sentence, chorally then individually, for pronunciation.'],
  ['MFP', 'Meaning, form, pronunciation, covered in that order before any practice begins.']
];
const DETAILS = [
  ['Students work out the rule themselves before the teacher confirms it.', 'False: the teacher presents the form directly.'],
  ['Practice always splits into controlled, then freer.', 'True.'],
  ['Feedback on errors during production is usually immediate, not delayed.', 'False: usually delayed to the end.'],
  ['Pronunciation is covered as part of presentation, not skipped.', 'True.'],
  ['PPP suits a class where everyone already knows the target form.', 'False: it assumes nobody has met it yet.'],
  ['The three stages can run in any order.', 'False: presentation, then practice, then production, always.']
];
const CORRECT_ORDER = ['Pre-teach terms', 'Predict the staging', 'Read the text, check ideas', 'Detail check'];
const SHUFFLED = ['Read the text, check ideas', 'Pre-teach terms', 'Detail check', 'Predict the staging'];
const EXAMPLE_ROWS = [
  ['Context', '3′', 'T holds up two phones: “Which one is bigger?”'],
  ['Presentation', '7′', 'T models “My phone is bigger than my friend’s”, drills, checks meaning with CCQs against the real phones.'],
  ['Form + pronunciation', '5′', 'Board: adjective + -er + than / more + adjective + than. Drill weak “than”.'],
  ['Controlled practice', '10′', 'Substitution table comparing classroom objects, T monitors closely.'],
  ['Freer practice', '15′', 'Ss compare their hometown and this city in open pairs.'],
  ['Delayed feedback', '5′', 'T addresses errors noted during production, as a whole class.']
];

// ---------- 3. Match the terms: right column reversed, as on Connect ----------
let selL = null, selR = null; const matched = new Set();
function drawMatch(){
  $('mStatus').textContent = matched.size + ' of ' + TERMS.length + ' matched';
  $('mLeft').innerHTML = TERMS.map((t, i) => '<button type="button" class="pill term' + (matched.has(i) ? ' matched' : selL === i ? ' selected' : '') + '" data-l="' + i + '">' + esc(t[0]) + '</button>').join('');
  $('mRight').innerHTML = TERMS.map((_, i) => TERMS.length - 1 - i).map(i => '<button type="button" class="pill' + (matched.has(i) ? ' matched' : selR === i ? ' selected' : '') + '" data-r="' + i + '">' + esc(TERMS[i][1]) + '</button>').join('');
}
function tryMatch(){
  if (selL === null || selR === null) return;
  if (selL === selR) { matched.add(selL); selL = selR = null; drawMatch(); return; }
  const l = selL, r = selR; drawMatch();
  document.querySelector('[data-l="' + l + '"]').classList.add('wrong'); document.querySelector('[data-r="' + r + '"]').classList.add('wrong');
  setTimeout(() => { selL = selR = null; drawMatch(); }, 400);
}
document.querySelector('.pill-match-wrap').addEventListener('click', e => {
  const l = e.target.closest('[data-l]'), r = e.target.closest('[data-r]');
  if (l && !matched.has(+l.dataset.l)) { selL = +l.dataset.l; drawMatch(); tryMatch(); }
  if (r && !matched.has(+r.dataset.r)) { selR = +r.dataset.r; drawMatch(); tryMatch(); }
});
drawMatch();

// ---------- 6. Detail questions ----------
$('details').innerHTML = DETAILS.map(d => '<div class="reveal-card" onclick="this.classList.toggle(\'open\')"><div class="q">' + esc(d[0]) + '</div><div class="a">' + esc(d[1]) + '</div></div>').join('');

// ---------- 7. Debrief: the next right stage locks in; any other click does nothing ----------
let picked = [];
function drawOrder(){
  $('order').innerHTML = SHUFFLED.map(lb => {
    const i = picked.indexOf(lb);
    return '<button type="button" class="order-line' + (i !== -1 ? ' done' : '') + '" data-o="' + esc(lb) + '"><span class="num">' + (i !== -1 ? i + 1 : '?') + '</span><span>' + esc(lb) + '</span></button>';
  }).join('');
  $('oStatus').textContent = picked.length === CORRECT_ORDER.length ? 'All ' + CORRECT_ORDER.length + ' in order: that’s the staging.'
    : picked.length + ' of ' + CORRECT_ORDER.length + ' placed: click the one that comes next.';
}
$('order').addEventListener('click', e => {
  const b = e.target.closest('[data-o]'); if (!b) return;
  const lb = b.dataset.o;
  if (picked.indexOf(lb) === -1 && CORRECT_ORDER[picked.length] === lb) { picked.push(lb); drawOrder(); }
});
drawOrder();

// ---------- the answer key: a handout that prints on its own ----------
$('keyTerms').innerHTML = TERMS.map(t => '<div class="krow"><b>' + esc(t[0]) + '</b><span>' + esc(t[1]) + '</span></div>').join('');
$('keyTF').innerHTML = DETAILS.map(d => '<div class="ktf"><p>' + esc(d[0]) + '</p><p>' + esc(d[1]) + '</p></div>').join('');
$('keyOpen').onclick = () => { $('keyBody').hidden = false; $('keyOpen').hidden = true; };
$('keyHide').onclick = () => { $('keyBody').hidden = true; $('keyOpen').hidden = false; };
$('keyPrint').onclick = () => { document.body.classList.add('print-key'); window.print(); };
window.addEventListener('afterprint', () => document.body.classList.remove('print-key'));

// ---------- the staging example ----------
$('exRows').innerHTML = EXAMPLE_ROWS.map(r => '<div class="exrow"><b>' + esc(r[0]) + '</b><span>' + esc(r[1]) + '</span><span>' + esc(r[2]) + '</span></div>').join('');
$('exBtn').onclick = () => { const o = $('exBody').hidden; $('exBody').hidden = !o; $('exBtn').textContent = o ? 'Hide staging example' : 'See staging example'; };
'''
