# Connect's 45-minute "Text-based teaching" (src/app/input-sessions/sessions/text-based-teaching.tsx), on Lite's desk.
# Content word for word, American spelling; the term match, the reveal cards, the order exercise, the answer key and
# the staging example work as they do on Connect.
TITLE = 'Text-based teaching: taught the way you’ll teach it'
LONG = 'text-based-teaching'
SUB = ('This session is staged exactly like the lesson framework it teaches. Do the tasks first: naming what happened is what '
       'the debrief is for.')
NAV = [('s1', '1 · Lead-in'), ('s2', '2 · What is text-based teaching?'), ('s3', '3 · Match the terms'),
       ('s4', '4 · Predict the staging'), ('s5', '5 · Read the text'), ('s6', '6 · Detail questions'),
       ('s7', '7 · Language focus'), ('s8', '8 · Debrief')]

NOTES = '''<h4>Running this session</h4>
<p>Don't name "text-based teaching" until the debrief. Keep the language focus stage tied visibly back to the text: that's the detail trainees tend to lose first.</p>
<h4>Watch for PPP wearing a text-based costume</h4>
<p>Some trainees pick the text last and force it to fit a language point they already chose. The text has to come first and genuinely drive everything else.</p>
<h4>Language items can be plural</h4>
<p>Unlike PPP or GD, a text-based lesson can lift more than one target item, wherever it occurs: don't force it back down to a single point.</p>'''

BODY = r'''
  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="stage-title">Lead-in <span class="badge">2 minutes</span></div>
      <p class="lead">Quick show of hands: think of the last coursebook lesson you did as a student. Did it start from a grammar point, or from a text?</p>
    </div>
  </section>

  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">What is text-based teaching? <span class="badge">3 minutes</span></div>
      <div class="reveal-card hero" onclick="this.classList.toggle('open')"><div class="q">What makes a lesson text-based?</div><div class="a">A text drives the whole lesson: topic, language and skills work all come from it.</div></div>
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
      <div class="stage-title">Predict the staging <span class="badge">3 minutes</span></div>
      <p class="label">Stage 2</p>
      <p class="lead">How do you think a text-based lesson should be staged?</p>
      <p class="quiet">Discuss with your partner, about a minute, no wrong answers yet.</p>
    </div>
  </section>

  <section id="s5" data-n="5">
    <div class="card" data-n="5">
      <div class="stage-title">Read the text, check ideas <span class="badge">10 minutes</span></div>
      <p class="label">Stage 3 · Read the text and check if your ideas were right or wrong</p>
      <div class="text-block passage">
        <h3>Staging a text-based lesson</h3>
        <p>A text-based lesson starts from a text, a reading or a listening, chosen for its content and its language together, not from a grammar point chosen first. It opens with a lead-in that creates interest in the topic, often a prediction task from a title or image. A gist task comes next, testing global understanding only: skim reading under a time limit, or hearing the audio once. Only once gist is secure does a detail task follow, prompting a closer, slower pass. From there the lesson turns to language: target items are lifted straight from the text itself, wherever they occur, rather than pre-selected, sometimes several different items, not just one. The lesson closes with a follow-on task that responds to the text&rsquo;s content, a discussion, a role play or a piece of writing. Everything in the lesson (topic, language, skills work) comes from that one text.</p>
      </div>
    </div>
  </section>

  <section id="s6" data-n="6">
    <div class="card" data-n="6">
      <div class="stage-title">Detail questions <span class="badge">10 minutes</span></div>
      <p class="label">Stage 4</p>
      <p class="quiet">More time now: answer these from the text, then check with your partner.</p>
      <div id="details"></div>
    </div>
  </section>

  <section id="s7" data-n="7">
    <div class="card" data-n="7">
      <div class="stage-title">Highlight, then language focus and practice</div>
      <p class="quiet">Click each card for an example of how that stage can look with language that emerged from this text.</p>
      <div id="lang"></div>
    </div>
  </section>

  <section id="s8" data-n="8">
    <div class="card" data-n="8">
      <div class="stage-title">Debrief: order the stages <span class="badge">10 minutes</span></div>
      <div id="order"></div>

      <div class="akey-wrap">
        <button type="button" class="btn" id="akeyOpen">Reveal answer key</button><!-- 22 Nov 2026 (Ramy: "Remove the print button from the answer key"): the key had its own Print button here, and its reveal button read "Reveal answer key: save or print to keep" -->
        <div class="akey" id="akey" hidden>
          <div class="akey-head"><p class="label">Answer key: handout, to keep</p>
            <div class="akey-acts"><button type="button" class="btn" id="akeyHide">Hide</button></div></div>
          <div class="akey-box"><h3>Terms</h3><div id="akeyTerms"></div></div>
          <div class="akey-box"><h3>True or false</h3><div id="akeyTf"></div></div>
        </div>
      </div>

      <div class="ex-wrap">
        <button type="button" class="btn" id="exBtn">See staging example</button>
        <div id="ex" hidden>
          <h3 class="ex-title">Example lesson: a magazine article about changing city life</h3>
          <table class="grid ex"><thead><tr><th>Stage</th><th>Time</th><th>Procedure</th></tr></thead><tbody id="exRows"></tbody></table>
        </div>
      </div>
    </div>
  </section>
'''

STYLE = r'''
  .reveal-card.hero{max-width:460px; padding:20px 22px; border-top:3px solid var(--teal);}
  .reveal-card.hero .q{font:600 1.3rem/1.3 'Newsreader',Georgia,serif;}
  .quiet{font-size:.88rem; font-style:italic; color:var(--grey); margin:4px 0 10px;}
  .passage h3, .akey-box h3, .ex-title{font:600 1.15rem/1.3 'Newsreader',Georgia,serif; color:var(--ink); margin:4px 0 8px;}
  .passage p{margin:0 0 6px;}
  .mhead{display:flex; justify-content:space-between; align-items:baseline; gap:10px; flex-wrap:wrap;}
  .mhead .label{margin:0;} .mcount{font-size:.84rem; color:var(--grey);}
  .pill{text-align:left; font-family:'Karla',sans-serif;} .pill.term{font:600 .98rem/1.3 'Newsreader',Georgia,serif;}
  .pill.matched{cursor:default;}
  .ox{display:flex; flex-direction:column; margin-top:10px;}
  .ox .order-line{justify-content:flex-start; width:100%; text-align:left; font-family:'Karla',sans-serif; color:var(--ink);}
  .ox .order-line .num{flex:none; min-width:24px; height:24px; border-radius:50%; background:var(--box); color:var(--grey); display:inline-flex; align-items:center; justify-content:center; font-size:.78rem;}
  .ox .order-line.done{border-color:var(--teal); background:color-mix(in oklab, var(--teal) 7%, var(--paper)); cursor:default;}
  .ox .order-line.done .num{background:var(--teal); color:var(--paper);}
  .ostat{font-size:.86rem; color:var(--grey); margin:4px 0 0;}
  .ointro{font-size:.9rem; color:var(--grey); margin:0 0 6px;} .ointro b{color:var(--ink);}
  .akey-wrap, .ex-wrap{margin-top:22px; padding-top:16px; border-top:1px solid var(--row-line);}
  .akey-head{display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;}
  .akey-head .label{margin:0;} .akey-acts{display:flex; gap:8px;}
  .akey-box{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 16px; margin:12px 0 0;}
  .krow{display:grid; grid-template-columns:150px 1fr; gap:10px; padding:5px 0; border-bottom:1px solid var(--row-line); font-size:.88rem;}
  .krow:last-child{border-bottom:0;} .krow b{font-family:'Newsreader',Georgia,serif;}
  .tfrow{padding:5px 0; border-bottom:1px solid var(--row-line); font-size:.88rem;} .tfrow:last-child{border-bottom:0;}
  .tfrow p{margin:0;} .tfrow .ans{font-style:italic; color:var(--grey);}
  table.grid.ex td:nth-child(2){white-space:nowrap; color:var(--grey);}
  @media(max-width:560px){ .krow{grid-template-columns:1fr; gap:2px;} table.grid.ex th, table.grid.ex td{padding:6px 7px;} }
  @media print{ #akeyOpen, .akey-acts, #exBtn{display:none !important;} .akey-head .label{color:#000;} }
  /* 21 Nov 2026: an answered task printed solved on "Print the handout": matched meanings in a heavier weight (and, with their terms, in their teal fill when the print was not made from the button); a term picked but not yet matched, with its gold edge; the ordered stages with their numbers in teal circles and "All 5 in order". On paper each now prints as it did untouched: every stage carries its "?" circle to number in, and the two counts (screen words: "click the one that comes next") stay off the paper. */
  @media print{
    .pill.matched, .pill.selected, .pill.wrong{background:var(--field); border-color:var(--sand-line); color:var(--ink); font-weight:500;} .pill.term.matched, .pill.term.selected, .pill.term.wrong{font-weight:600;}
    .mcount, .ostat{display:none !important;}
    .ox .order-line.done{border-color:var(--sand-line); background:var(--paper);}
    .ox .order-line.done .num{background:var(--box); color:var(--grey); font-size:0;} .ox .order-line.done .num::after{content:"?"; font-size:.78rem;}
  }
  /* 21 Nov 2026: the handout printed the whole answer key (every term with its meaning, every true or false) once "Reveal answer key" had been pressed, and the staging example once "See staging example" had been. The key still prints from its own Print button and on the tutor's print, the example on the tutor's print and with the answers; the plain handout carries neither. */
  @media print{
    body:not(.print-key):not(.tutor) #akey, html.hub-clean body:not(.print-key) #akey{display:none !important;}
    body:not(.tutor):not(.with-answers) #ex, html.hub-clean body #ex{display:none !important;}
  }
'''

SCRIPT = r'''
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const reveal = (q, a) => '<div class="reveal-card" onclick="this.classList.toggle(\'open\')"><div class="q">' + esc(q) + '</div><div class="a">' + esc(a) + '</div></div>';

const TERMS = [
  ['Gist', 'Reading or listening fast, once, for the main idea only.'],
  ['Detail', 'A slower, closer pass for specific information.'],
  ['Authentic text', 'A real text or recording made for real readers, not simplified for learners.'],
  ['Follow-on task', 'A speaking, writing or discussion task that responds to the text’s content.'],
  ['Lead-in', 'A short task that creates interest in the topic before the text appears.']
];
const DETAILS = [
  ['The target language is chosen before the text.', 'False: the text comes first, language is lifted from it.'],
  ['A gist task should be timed, to keep students reading fast.', 'True.'],
  ['Students should look up every unknown word before reading for gist.', 'False: only pre-teach words essential to understanding.'],
  ['Detail tasks come before gist tasks.', 'False: gist always comes first.'],
  ['The follow-on task should relate to the text’s content.', 'True.'],
  ['A text-based lesson can only use one language item from the text.', 'False: it can use several, wherever they occur.']
];
const LANG_CARDS = [
  ['Example: highlighting stage', 'Students go back into the same text, alone or in pairs, and underline or highlight the target language themselves, e.g. every phrase used to talk about renting. Clarification then works from exactly what they marked, so the language stays visibly anchored to the text rather than announced by the teacher.'],
  ['Example: clarifying the teach stage', 'The text mentions renting, not buying. Board the sentence, ask two or three CCQs (“do they own the flat?”, “is this permanent?”) and let students answer their way to the meaning, rather than explaining the rule.'],
  ['Example: the practice stage', 'Controlled first: a gap-fill using sentences adapted from the same text. Then freer: students write or say two sentences about their own housing situation, using the target language: the text stays the anchor, the practice does not float free of it.']
];
const CORRECT_ORDER = ['Pre-teach terms', 'Predict the staging', 'Read the text, check ideas', 'Detail check', 'Highlight, then language focus and practice'];
const SHUFFLED = ['Read the text, check ideas', 'Highlight, then language focus and practice', 'Pre-teach terms', 'Detail check', 'Predict the staging'];
const EXAMPLE_ROWS = [
  ['Lead-in', '4′', 'Ss predict the article’s content from its photo and headline.'],
  ['Gist task', '6′', 'Ss skim-read once, timed, to answer one general question.'],
  ['Detail task', '8′', 'Ss read again, slower, for specific information.'],
  ['Language focus', '15′', 'Comparative structures lifted from the article, unpacked with CCQs and practiced.'],
  ['Follow-on task', '12′', 'Ss discuss how their own city has changed, using the target structures.']
];

// ---------- 3. Match the terms (Connect's MatchTermsExercise) ----------
// Click a term, then its meaning (either order). A right pair locks teal; a wrong pair flashes red, then both clear.
// 22 Nov 2026 (Ramy, of the meanings standing as the terms in exact reverse order: "just fix it"): the meanings are mixed afresh each time the page loads (a Fisher-Yates shuffle), and never stand in the exact order or the exact reverse order of the terms. The terms keep their order; a pair is still matched by its number (data-l, data-r), not by where it stands.
function mixed(n){
  const a = [...Array(n).keys()], told = b => b.every((v, i) => v === i) || b.every((v, i) => v === n - 1 - i);
  do { for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } } while (n > 2 && told(a));   // two meanings can only stand one way or the other: a coin toss
  return a;
}
function matchEx(el, terms){
  const right = mixed(terms.length);   // 22 Nov 2026 (Ramy, of the meanings standing as the terms in exact reverse order: "just fix it"): it was the terms reversed
  let selL = null, selR = null, shakeL = null, shakeR = null; const matched = new Set();
  const cls = (id, sel, sh) => matched.has(id) ? ' matched' : sh === id ? ' wrong' : sel === id ? ' selected' : '';
  function draw(){
    el.innerHTML = '<div class="mhead"><p class="label">Match each term to its meaning</p><span class="mcount">' + matched.size + ' of ' + terms.length + ' matched</span></div>'
      + '<div class="pill-match-wrap"><div class="pill-col">' + terms.map((t, i) => '<button type="button" class="pill term' + cls(i, selL, shakeL) + '" data-l="' + i + '">' + esc(t[0]) + '</button>').join('') + '</div>'
      + '<div class="pill-col">' + right.map(i => '<button type="button" class="pill' + cls(i, selR, shakeR) + '" data-r="' + i + '">' + esc(terms[i][1]) + '</button>').join('') + '</div></div>';
  }
  function tryMatch(){
    if (selL === null || selR === null) return;
    if (selL === selR) { matched.add(selL); selL = selR = null; draw(); return; }
    shakeL = selL; shakeR = selR; draw();
    setTimeout(() => { selL = selR = shakeL = shakeR = null; draw(); }, 400);
  }
  el.addEventListener('click', e => {
    if (shakeL !== null) return;
    const l = e.target.closest('[data-l]'), r = e.target.closest('[data-r]');
    if (l && !matched.has(+l.dataset.l)) { selL = +l.dataset.l; draw(); tryMatch(); }
    if (r && !matched.has(+r.dataset.r)) { selR = +r.dataset.r; draw(); tryMatch(); }
  });
  draw();
}
matchEx($('match'), TERMS);

// ---------- 6 and 7. Reveal cards ----------
$('details').innerHTML = DETAILS.map(d => reveal(d[0], d[1])).join('');
$('lang').innerHTML = LANG_CARDS.map(d => reveal(d[0], d[1])).join('');

// ---------- 8. Debrief: order the stages (Connect's OrderExercise) ----------
// Only the right next stage locks in, numbered; any other click does nothing.
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

// ---------- Answer key ----------
$('akeyTerms').innerHTML = TERMS.map(t => '<div class="krow"><b>' + esc(t[0]) + '</b><span>' + esc(t[1]) + '</span></div>').join('');
$('akeyTf').innerHTML = DETAILS.map(d => '<div class="tfrow"><p>' + esc(d[0]) + '</p><p class="ans">' + esc(d[1]) + '</p></div>').join('');
$('akeyOpen').onclick = () => { $('akey').hidden = false; $('akeyOpen').hidden = true; };
$('akeyHide').onclick = () => { $('akey').hidden = true; $('akeyOpen').hidden = false; };
// 22 Nov 2026 (Ramy: "Remove the print button from the answer key"): the key's Print button is gone, and its handler with it. Nothing sets print-key on the body any more, so the plain handout leaves the open key out (the print rule in the style above), and a tutor's print carries it, as before.

// ---------- Staging example ----------
$('exRows').innerHTML = EXAMPLE_ROWS.map(r => '<tr><td><b>' + esc(r[0]) + '</b></td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>').join('');
$('exBtn').onclick = () => { const o = $('ex').hidden; $('ex').hidden = !o; $('exBtn').textContent = o ? 'Hide staging example' : 'See staging example'; };
'''
