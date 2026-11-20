# Connect's 45-minute "Language analysis, start to finish, on the real sheet" (src/app/input-sessions/sessions/language-analysis.tsx),
# on Lite's desk. Content word for word, American spelling; the two discussion cards, the jargon match, the live draft
# (grammar, vocabulary or functional, each keeping its own entries), the answer key and the staging example work as on Connect.
TITLE = 'Language analysis, start to finish'
LONG = 'language-analysis'
SUB = ('Warm up on why analysis exists, clear the jargon, then draft the analysis for your own next TP point under the headings '
       'of the Language Analysis on your Lesson plan page, where the real one goes.')
NAV = [('s1', '1 · Lead-in'), ('s2', '2 · Why analyze it first?'), ('s3', '3 · Jargon match'), ('s4', '4 · Grammar or vocab'),
       ('s5', '5 · Live draft'), ('s6', '6 · Questions')]

NOTES = '''<h4>Running this session</h4>
<p>Open with the two discussion cards: elicit before revealing. Move fast through the jargon match; the real work is the live draft in the last twenty minutes, on each trainee's own point, not a shared example.</p>
<h4>A grammar reference, always open</h4>
<p>Have Practical English Usage or an equivalent to hand: the point isn't memorized knowledge, it's knowing where to check.</p>
<h4>Marker sentences must come from somewhere real</h4>
<p>Push back on invented, decontextualized sentences: a marker sentence should sound like something a person would plausibly say.</p>
<h4>Vocabulary items need the same rigor as grammar</h4>
<p>Trainees often shortcut the vocab sheet because it "feels simpler": a bad clarification technique or missing stress mark is just as damaging as a bad CCQ.</p>'''

BODY = r'''
  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="stage-title">Lead-in <span class="badge">2 minutes</span></div>
      <p class="lead">Quick show of hands: has anyone ever been asked a grammar question mid-lesson they couldn't answer? What did you do?</p>
    </div>
  </section>

  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">Why analyze it first? <span class="badge">6 minutes</span></div>
      <div class="two-col" id="discuss"></div>
    </div>
  </section>

  <section id="s3" data-n="3">
    <div class="card" data-n="3">
      <div class="stage-title">Jargon match <span class="badge">7 minutes</span></div>
      <p class="lead">Match each term to its meaning. <span class="count" id="matchCount"></span></p>
      <div id="match"></div>
    </div>
  </section>

  <section id="s4" data-n="4">
    <div class="card" data-n="4">
      <div class="stage-title">Choose grammar, vocabulary or functional <span class="badge">3 minutes</span></div>
      <p class="lead">Live draft: your next TP point, under the main headings of your Language Analysis. Choose the same type you will choose there.</p>
      <div class="btn-row" id="types"></div>
    </div>
  </section>

  <section id="s5" data-n="5">
    <div class="card" data-n="5">
      <div class="stage-title">Live draft, own TP point <span class="badge">20 minutes</span></div>
      <div class="sheet" id="sheet"></div>
      <p class="small">Type directly into the fields above. This page doesn't save what you type: it's practice, on your own next TP point, before you fill in the actual one in the Language Analysis part of your Lesson plan page.</p>
    </div>
  </section>

  <section id="s6" data-n="6">
    <div class="card" data-n="6">
      <div class="stage-title">Questions <span class="badge">7 minutes</span></div>
      <div class="btn-row"><button class="btn" type="button" id="keyOpen">Reveal answer key: save or print to keep</button></div>
      <div class="answer-key" id="key" hidden>
        <div class="keyhead"><span class="keytitle">Answer key: handout, to keep</span><span class="keybtns"><button class="btn" type="button" id="keyHide">Hide</button><button class="btn" type="button" onclick="window.print()">Print</button></span></div>
        <div class="box"><h3>Terms</h3><table class="grid stk"><tbody id="keyTerms"></tbody></table></div>
      </div>

      <div class="btn-row"><button class="btn" type="button" id="exBtn">See staging example</button></div>
      <div class="example" id="ex" hidden>
        <h3>Example: a completed grammar analysis</h3>
        <table class="grid stk"><tbody id="exRows"></tbody></table>
      </div>
    </div>
  </section>
'''

STYLE = r'''
  .count{font-weight:700; color:var(--teal); white-space:nowrap;}
  .small{font-size:.86rem; color:var(--grey); margin:10px 0 0; line-height:1.5;}
  #discuss .reveal-card{margin:0;}
  #discuss .reveal-card .q{font-family:'Newsreader',Georgia,serif; font-size:1.1rem; line-height:1.35;}
  button.pill{text-align:left; font-family:'Karla',sans-serif; width:100%;}
  button.pill.term{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1rem;}
  button.pill.matched{cursor:default;}
  #types .btn.on{background:var(--teal); color:var(--paper);}
  .sheet{border:1.5px solid var(--sand-line); border-radius:var(--r-strip); overflow:hidden; background:var(--paper);}
  .srow{display:grid; grid-template-columns:200px 1fr; border-top:1px solid var(--row-line);}
  .srow:first-child{border-top:0;}
  .srow .lbl{background:var(--box); padding:10px 12px; font-weight:600; font-size:.88rem; line-height:1.4;}
  .srow .lbl i{display:block; font-weight:400; font-size:.78rem; color:var(--grey); margin-top:2px;}
  .srow input{border:0; background:transparent; padding:10px 12px; font:400 .9rem 'Karla',sans-serif; color:var(--ink); width:100%; min-width:0;}
  .srow input:focus{outline:2px solid var(--gold); outline-offset:-2px;}
  .srow input::placeholder{color:var(--field-ph);}
  @media(max-width:560px){ .srow{grid-template-columns:1fr;} .srow input{min-height:44px;} }
  .box{background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 16px; margin:10px 0 0;}
  .box h3, .example h3{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.08rem; margin:0 0 6px; color:var(--ink);}
  .answer-key{margin-top:14px;}
  .keyhead{display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;}
  .keytitle{font-size:10px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:var(--grey);}
  .keybtns{display:flex; gap:8px;}
  .example{margin-top:12px;}
  table.grid td.lab{font-weight:700; width:200px;}
  @media(max-width:560px){
    table.stk, table.stk tbody, table.stk tr, table.stk td{display:block; width:100% !important;}
    table.stk thead{display:none;}
    table.stk tr{border:1px solid var(--sand-line); background:var(--paper); padding:6px 10px; margin:0 0 6px;}
    table.stk td{border:0; padding:2px 0;}
  }
  @media print{ .answer-key, .example{display:none !important;} .srow input{border-bottom:1px solid #999;} }
  /* 21 Nov 2026: an answered jargon match printed solved on the handout: the matched meanings in a heavier weight, with "4 of 7 matched" beside the task. On paper it now prints as it did untouched, without the count. */
  @media print{ #matchCount{display:none !important;} .pill.matched:not(.term){font-weight:500;} }
'''

SCRIPT = r'''
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

// ---------- 2. Why analyze it first? ----------
const DISCUSS = [
  ['Why analyze language before you teach it, rather than just teaching what you already know?', 'Because what you already know is intuitive, not explicit: you can use “used to” correctly without being able to explain why it’s wrong to say “I use to play.” Teaching requires the explicit version.'],
  ['What happens if you skip the phonetic transcription and stress?', 'Students learn a grammatically correct sentence they can’t say naturally, and can’t recognize in fast speech: accuracy on paper, failure in conversation.']
];
$('discuss').innerHTML = DISCUSS.map(d => '<div class="reveal-card" onclick="this.classList.toggle(\'open\')"><div class="q">' + esc(d[0]) + '</div><div class="a">' + esc(d[1]) + '</div></div>').join('');

// ---------- 3. Jargon match: a term, then its meaning (either order); a wrong pair flashes and clears ----------
const TERMS = [
  ['Marker sentence', 'The example sentence you’ll use to present the structure: natural, in context.'],
  ['CCQ', 'A concept checking question: tests meaning without naming the grammar.'],
  ['Anticipated problem', 'A specific error or confusion you predict for this group, with this item.'],
  ['Form analysis', 'The pattern the structure follows: word order, morphology, what changes.'],
  ['Phonemic transcription', 'The pronunciation written in phonemic symbols, stress marked.'],
  ['Connected speech', 'How words run together and change in natural fast speech: “gonna,” weak “to.”'],
  ['Clarification technique', 'The method used to make meaning clear: a timeline, realia, a definition.']
];
function matchTerms(el, countEl, terms){
  const right = terms.map((_, i) => i).reverse();
  let selL = null, selR = null, shake = null;
  const matched = new Set();
  function cls(i, sel){ return matched.has(i) ? ' matched' : sel === i ? (shake ? ' wrong' : ' selected') : ''; }
  function draw(){
    el.innerHTML = '<div class="pill-match-wrap"><div class="pill-col">'
      + terms.map((t, i) => '<button type="button" class="pill term' + cls(i, selL) + '" data-l="' + i + '">' + esc(t[0]) + '</button>').join('')
      + '</div><div class="pill-col">'
      + right.map(i => '<button type="button" class="pill' + cls(i, selR) + '" data-r="' + i + '">' + esc(terms[i][1]) + '</button>').join('')
      + '</div></div>';
    countEl.textContent = matched.size + ' of ' + terms.length + ' matched';
  }
  function tryMatch(){
    if (selL === null || selR === null) return;
    if (selL === selR) { matched.add(selL); selL = selR = null; }
    else { shake = true; setTimeout(() => { selL = selR = null; shake = null; draw(); }, 400); }
  }
  el.addEventListener('click', e => {
    const l = e.target.closest('[data-l]'), r = e.target.closest('[data-r]');
    if (shake) return;
    if (l && !matched.has(+l.dataset.l)) { selL = +l.dataset.l; tryMatch(); draw(); }
    if (r && !matched.has(+r.dataset.r)) { selR = +r.dataset.r; tryMatch(); draw(); }
  });
  draw();
}
matchTerms($('match'), $('matchCount'), TERMS);

// ---------- 4 and 5. The live draft: each type keeps what was typed into it ----------
const FIELDS = {
  Grammar: [
    ['Name of the structure', '', 'e.g. going to for future plans'],
    ['Marker sentence(s)', 'The sentence(s) you will use to present the structure above.', 'Write a natural, in-context example sentence'],
    ['Meaning analysis', '', 'What does it mean? What could it be confused with?'],
    ['Form analysis', '', 'subject + ... : the pattern, spelled out'],
    ['Phonetic transcription & stress', '', 'Write it in phonemic script, mark the stress'],
    ['Source', 'Where your analysis came from: grammar reference, learner dictionary.', 'e.g. Practical English Usage, §___']
  ],
  Vocabulary: [
    ['Item', '', 'e.g. take up (a hobby)'],
    ['Definition', '', 'A clear, learner-level definition'],
    ['Clarification technique', '', 'How will you make the meaning clear?'],
    ['Phonetic transcription & stress', '', 'Write it in phonemic script, mark the stress'],
    ['Meaning problems and solutions', '', 'What could it be confused with, and how will you head that off?'],
    ['Source', '', 'e.g. Cambridge Learner’s Dictionary']
  ],
  Functional: [
    ['Function', '', 'e.g. making suggestions'],
    ['Exponent(s)', 'The phrase(s) that carry out the function.', 'e.g. How about...? Why don’t you...? You could...'],
    ['Meaning analysis', '', 'What is being achieved socially, not just literally?'],
    ['Appropriacy', '', 'Which context, formality level, relationship does this suit?'],
    ['Phonetic transcription & stress, intonation', '', 'Mark stress and the intonation pattern: often what makes it sound genuine'],
    ['Source', '', 'e.g. a functional language reference or coursebook exponent list']
  ]
};
let laType = 'Grammar'; const draft = {};
function drawSheet(){
  $('types').innerHTML = Object.keys(FIELDS).map(t => '<button type="button" class="btn' + (t === laType ? ' on' : '') + '" data-type="' + t + '">' + t + '</button>').join('');
  $('sheet').innerHTML = FIELDS[laType].map((f, i) => {
    const k = laType + ':' + i;
    return '<div class="srow"><div class="lbl">' + esc(f[0]) + (f[1] ? '<i>' + esc(f[1]) + '</i>' : '') + '</div>'
      + '<input type="text" data-k="' + k + '" placeholder="' + esc(f[2]) + '" value="' + esc(draft[k] || '') + '" aria-label="' + esc(f[0]) + '"></div>';
  }).join('');
}
$('types').addEventListener('click', e => { const b = e.target.closest('[data-type]'); if (!b) return; laType = b.dataset.type; drawSheet(); });
$('sheet').addEventListener('input', e => { if (e.target.dataset.k) draft[e.target.dataset.k] = e.target.value; });
drawSheet();

// ---------- 6. The answer key and the staging example ----------
$('keyTerms').innerHTML = TERMS.map(t => '<tr><td class="lab">' + esc(t[0]) + '</td><td>' + esc(t[1]) + '</td></tr>').join('');
$('keyOpen').onclick = () => { $('key').hidden = false; $('keyOpen').hidden = true; };
$('keyHide').onclick = () => { $('key').hidden = true; $('keyOpen').hidden = false; };
const EXAMPLE_ROWS = [
  ['Name of the structure', 'going to for future plans'],
  ['Marker sentence(s)', 'I’m going to visit my sister in June.'],
  ['Meaning analysis', 'A plan decided before the moment of speaking. Not a prediction, not a spontaneous decision.'],
  ['Form analysis', 'subject + be + going to + bare infinitive'],
  ['Phonetic transcription & stress', '/aɪm ˈɡəʊɪŋ tə ˈvɪzɪt/: going to often /ɡənə/ in connected speech'],
  ['Source', 'Practical English Usage, §217']
];
$('exRows').innerHTML = EXAMPLE_ROWS.map(r => '<tr><td class="lab">' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td></tr>').join('');
$('exBtn').onclick = () => { $('ex').hidden = !$('ex').hidden; $('exBtn').textContent = $('ex').hidden ? 'See staging example' : 'Hide staging example'; };
'''
