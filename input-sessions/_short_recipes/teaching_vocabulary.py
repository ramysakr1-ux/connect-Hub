# Connect's 45-minute "Teaching vocabulary and lexis" (src/app/input-sessions/sessions/teaching-vocabulary.tsx), on Lite's desk.
# Content word for word, American spelling; the term match, the technique choice, the collocations (the same seeded mixed
# order for everyone, Connect's own generator), the answer key and the example work as they do on Connect.
TITLE = 'Teaching vocabulary and lexis'
LONG = 'teaching-vocabulary'
SUB = ('A word isn’t one fact to give. It’s several: meaning, form, pronunciation, and how it combines with other words. This session '
       'works through a real item using techniques you’ll use in your own teaching.')
NAV = [('s1', '1 · Lead-in'), ('s2', '2 · Match the terms'), ('s3', '3 · Choose a technique'), ('s4', '4 · Build the collocations'),
       ('s5', '5 · Discuss: your own examples')]

NOTES = '''<h4>Running this session</h4>
<p>Push past “look it up in a dictionary”: the point of this session is choosing a clarification technique deliberately, not defaulting to the same one every time.</p>
<h4>Chunks, not just single words</h4>
<p>Push trainees to teach “take up a hobby” as one chunk, not “take” plus “up” separately: much vocabulary is multi-word by nature.</p>
<h4>Don’t over-teach</h4>
<p>Not every item needs full MFP treatment: a receptive vocabulary item met in a text may only need a quick gloss, not a full clarification stage.</p>
<h4>Watch for false friends between techniques and levels</h4>
<p>A technique that works cleanly at B1 (a definition) may need a very different one at A1 (realia, mime): the “right” technique depends on the group.</p>'''

BODY = r'''
  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="stage-title">Lead-in <span class="badge">2 minutes</span></div>
      <p class="lead">Quick show of hands: how many words do you think “take up (a hobby)” actually is: one, or more than one?</p>
    </div>
  </section>

  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">Match the terms <span class="badge">10 minutes</span></div>
      <div id="match"></div>
    </div>
  </section>

  <section id="s3" data-n="3">
    <div class="card" data-n="3">
      <div class="stage-title">Choose a technique <span class="badge">13 minutes</span></div>
      <p class="sl">Choose a technique for each item</p>
      <p class="quiet">For each word, click the technique you’d actually use to clarify it, then check.</p>
      <div id="choose"></div>
    </div>
  </section>

  <section id="s4" data-n="4">
    <div class="card" data-n="4">
      <div class="stage-title">Build the collocations <span class="badge">10 minutes</span></div>
      <p class="lead">Vocabulary rarely stands alone. Click the words that naturally collocate with “make,” then with “do.”</p>
      <div class="collos" id="collos"></div>
    </div>
  </section>

  <section id="s5" data-n="5">
    <div class="card" data-n="5">
      <div class="stage-title">Discuss: your own examples <span class="badge">5 minutes</span></div>
      <p class="lead">Think of your own next TP point’s vocabulary. For each question, jot a quick answer before comparing with a partner.</p>
      <div class="stack" id="discuss"></div>
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
  /* 21 Nov 2026: "Print the handout" printed the whole answer key (the six terms of part 2 with their meanings) once it had been opened, and the example once it had been opened. The key now prints only from its own Print button (body.print-key, set in answerKey below) or in a tutor's print with the notes; the example prints for a tutor only. */
  @media print{ .keyblock{display:block;} body:not(.print-key):not(.tutor) .keyblock, html.hub-clean .keyblock{display:none !important;} .stagebox .btn{display:none;} body:not(.tutor) .stagebox h4, body:not(.tutor) .stagebox table, html.hub-clean .stagebox h4, html.hub-clean .stagebox table{display:none !important;} }
  /* 21 Nov 2026: an answered task printed solved on the handout: matched meanings in a heavier weight with "6 of 6 matched"; the tick or cross and the explanation under each word of part 3; a tick or cross on every collocation clicked in part 4. On paper each prints as it did untouched, without the count. */
  @media print{
    .mhead span, .item .fb, .opts .tick{display:none !important;}
    .pill.matched, .pill.selected{background:var(--field); border-color:var(--sand-line); color:var(--ink);} .pill.matched:not(.term){font-weight:500;}
    .opts button.ok, .opts button.no{border-color:var(--sand-line); background:var(--paper); color:var(--ink);}
  }
  .sl{font-weight:700; font-size:.92rem; color:var(--ink); margin:4px 0 6px;}
  .item{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 16px; margin-top:10px;}
  .item .w, .collo .w{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.08rem; margin:0 0 8px;}
  .opts{display:flex; flex-wrap:wrap; gap:6px;}
  .opts button{background:var(--paper); border:1.5px solid var(--sand-line); padding:6px 12px; font:600 .84rem 'Karla',sans-serif; color:var(--ink); cursor:pointer;}
  .opts button:hover{border-color:var(--gold);}
  .opts button.ok{border-color:var(--teal); background:color-mix(in oklab, var(--teal) 9%, var(--paper)); color:var(--teal);}
  .opts button.no{border-color:var(--a-red); background:color-mix(in oklab, var(--a-red) 8%, var(--paper)); color:var(--a-red);}
  .item .fb{margin:8px 0 0; font-size:.88rem; line-height:1.5; color:var(--grey);}
  .collos{display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:10px;}
  @media(max-width:640px){ .collos{grid-template-columns:1fr;} }
  .collo{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 16px;}
  .dq{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-control); padding:10px 14px; font-weight:600; font-size:.92rem;}
  .dq .write-area{display:block; margin:8px 0 0; font-weight:400;}
  .stagebox table.ex td:nth-child(2){white-space:normal;}
  .stagebox table.ex td:first-child{width:150px; background:var(--box); font-weight:600;}
  @media(max-width:560px){ .stagebox table.ex td:first-child{width:auto;} }
'''

SCRIPT = r'''
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

const TERMS = [
  ['Lexical set', 'A group of words that share a topic, e.g. weather words.'],
  ['Collocation', 'Words that naturally occur together: “make a decision,” not “do a decision.”'],
  ['Receptive vocabulary', 'Words a learner can understand but might not produce.'],
  ['Productive vocabulary', 'Words a learner can understand and actively use.'],
  ['Realia', 'Real objects brought into the classroom to clarify meaning.'],
  ['Connotation', 'The feeling or association a word carries beyond its literal meaning.']
];
const CHOOSE_OPTIONS = ['Realia / picture', 'Cline / scale', 'Situation / example sentences', 'Definition + example'];
const CHOOSE_ITEMS = [
  ['furious', 'Cline / scale', 'A cline against “angry” and “annoyed” shows the relative strength: a definition alone doesn’t convey intensity.'],
  ['umbrella', 'Realia / picture', 'A concrete object: showing beats defining.'],
  ['take up (a hobby)', 'Situation / example sentences', 'A phrasal verb with a non-literal meaning needs context to show what “take up” actually means here.'],
  ['nostalgic', 'Definition + example', 'An abstract feeling word usually needs a clear definition plus a relatable example, since it can’t be shown.']
];
const COLLO_MAKE = ['a decision', 'a mistake', 'progress', 'money'];
const COLLO_MAKE_DISTRACTORS = ['homework', 'a favor'];
const COLLO_DO = ['homework', 'a favor', 'business', 'the shopping'];
const COLLO_DO_DISTRACTORS = ['a decision', 'money'];
const DISCUSS_QS = [
  'What’s one item from your point that could be a whole lexical set, not just a single word?',
  'Which technique would you use for it, and why not one of the others?',
  'Is there a collocation your students are likely to get wrong with this item?'
];
const EXAMPLE_TITLE = 'Example: clarifying “take up (a hobby)”';
const EXAMPLE_ROWS = [
  ['Item', 'take up (a hobby)'],
  ['Meaning', 'To start doing something regularly, as a new habit or interest.'],
  ['Technique', 'Situation: “I was bored last year, so I took up painting.” Elicit what “took up” means from context.'],
  ['Form', 'take up + noun (the object, an activity)'],
  ['Pronunciation', '/ˈteɪk ʌp/: stress on both words equally, linking across the phrasal verb.']
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
    if (b.dataset.k === 'open') open = true; else if (b.dataset.k === 'hide') open = false; else { document.body.classList.add('print-key'); window.print(); return; }   // 21 Nov 2026: the key prints from its own Print button only (see the print rule above)
    draw();
  });
  window.addEventListener('afterprint', () => document.body.classList.remove('print-key'));   // 21 Nov 2026
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


// the example here is a two-column card (label, value), not a staging table
function itemEx(el, title, rows){
  let open = false;
  function draw(){
    el.innerHTML = '<div class="stagebox"><div class="btn-row"><button type="button" class="btn" data-s>' + (open ? 'Hide staging example' : 'See staging example') + '</button></div>'
      + (open ? '<h4>' + esc(title) + '</h4><table class="grid ex"><tbody>' + rows.map(r => '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td></tr>').join('') + '</tbody></table>' : '') + '</div>';
  }
  el.addEventListener('click', e => { if (e.target.closest('[data-s]')) { open = !open; draw(); } });
  draw();
}

// ---------- choose a technique: a pick can change; the note shows once anything is picked ----------
const chosen = {};
function drawChoose(){
  $('choose').innerHTML = CHOOSE_ITEMS.map((it, ci) => {
    const pick = chosen[ci];
    return '<div class="item"><p class="w">' + esc(it[0]) + '</p><div class="opts">'
      + CHOOSE_OPTIONS.map(o => '<button type="button" data-c="' + ci + '" data-opt="' + esc(o) + '" class="' + (pick === o ? (o === it[1] ? 'ok' : 'no') : '') + '">' + esc(o) + '</button>').join('')
      + '</div>' + (pick ? '<p class="fb">' + (pick === it[1] ? '✓ ' : '✗ ') + esc(it[2]) + '</p>' : '') + '</div>';
  }).join('');
}
$('choose').addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (!b) return; chosen[b.dataset.c] = b.dataset.opt; drawChoose(); });
drawChoose();

// ---------- the collocations: Connect's seeded mixed order, the same on every device ----------
function seededRandom(key){
  let s = [...key].reduce((a, c, i) => (a + (i + 1) * c.charCodeAt(0)) % 2147483647, 0) || 1;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
function shuffle(arr, key){
  const rand = seededRandom(key), copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
  return copy;
}
const GROUPS = [
  { verb: 'Make', options: shuffle(COLLO_MAKE.concat(COLLO_MAKE_DISTRACTORS), 'teaching-vocabulary|Make'), correct: COLLO_MAKE, picked: new Set() },
  { verb: 'Do', options: shuffle(COLLO_DO.concat(COLLO_DO_DISTRACTORS), 'teaching-vocabulary|Do'), correct: COLLO_DO, picked: new Set() }
];
function drawCollos(){
  $('collos').innerHTML = GROUPS.map((g, gi) => '<div class="collo"><p class="w">' + g.verb + ' ___</p><div class="opts">'
    + g.options.map(w => { const p = g.picked.has(w), ok = g.correct.indexOf(w) !== -1;
        // 21 Nov 2026: the tick or cross sits in a span of its own (.tick), which the print rule above leaves off the paper; on the screen nothing changes.
        return '<button type="button" data-g="' + gi + '" data-w="' + esc(w) + '" class="' + (p ? (ok ? 'ok' : 'no') : '') + '">' + (p ? '<span class="tick">' + (ok ? '✓ ' : '✗ ') + '</span>' : '') + esc(w) + '</button>'; }).join('')
    + '</div></div>').join('');
}
$('collos').addEventListener('click', e => { const b = e.target.closest('[data-g]'); if (!b) return; GROUPS[+b.dataset.g].picked.add(b.dataset.w); drawCollos(); });
drawCollos();

// "jot a quick answer": each question has its own box to jot it in
$('discuss').innerHTML = DISCUSS_QS.map((q, i) => '<div class="dq">' + (i + 1) + '. ' + esc(q)
  + '<textarea class="write-area" rows="2" placeholder="A quick answer" aria-label="' + esc(q) + '"></textarea></div>').join('');
matchTerms($('match'), TERMS);
answerKey($('key'), TERMS, []);
itemEx($('staging'), EXAMPLE_TITLE, EXAMPLE_ROWS);
'''
