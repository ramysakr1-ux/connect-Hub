# Connect's 45-minute "Eliciting and concept checking." (src/app/input-sessions/sessions/eliciting-and-concept-checking.tsx),
# on Lite's desk. Content word for word, American spelling; the technique cards, elicit or tell, spot the bad CCQ, the
# model CCQs, beyond CCQs, the near misses, the answer key and the staging example work as they do on Connect.
TITLE = 'Eliciting and concept checking'
LONG = 'eliciting-and-ccqs'
SUB = ('Two related skills: drawing language out of learners instead of just giving it to them, and checking they\'ve actually '
       'understood it once it\'s there. "Do you understand?" tells you nothing: this session works through better tools for both.')
NAV = [('s1', '1 · Lead-in'), ('s2', '2 · Eliciting techniques'), ('s3', '3 · Elicit or tell?'), ('s4', '4 · Spot the bad CCQ'),
       ('s5', '5 · Write your own CCQs'), ('s6', '6 · Beyond CCQs'), ('s7', '7 · Near misses'), ('s8', '8 · Answer key')]

NOTES = '''<h4>Running this session</h4>
<p>Ban "Do you understand?" and "Is that clear?" from the room for the next ~60 minutes, including from yourself. Trainees will reach for them constantly; that's the point of banning them.</p>
<h4>A good CCQ never contains the target language</h4>
<p>If the question requires understanding the item to answer it, it isn't checking anything: flag this constantly, it's the single most common CCQ mistake.</p>
<h4>Simpler language than the target, always</h4>
<p>A CCQ pitched at or above the target item's level defeats the purpose: push trainees to go simpler than feels natural.</p>
<h4>Non-verbal techniques aren't a fallback, they're often better</h4>
<p>A timeline or realia can check meaning faster and more reliably than a string of questions, especially at lower levels.</p>
<h4>Eliciting only works on what's partly already there</h4>
<p>It's not a virtue in itself: trainees sometimes try to elicit genuinely new information nobody in the room has. If nobody can supply it, stop after one attempt and just give it.</p>
<h4>"Elicit or tell?": there's a real judgment call here</h4>
<p>Push trainees past "always elicit" as a reflex: the right instinct is speed and safety versus depth of understanding, not eliciting for its own sake.</p>'''

BODY = r'''
  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="stage-title">Lead-in <span class="badge">2 minutes</span></div>
      <div class="text-block">Quick show of hands: has anyone ever said "yes, I understand" in a foreign language class, and not actually understood?</div>
    </div>
  </section>

  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">Eliciting: drawing it out instead of giving it <span class="badge">10 minutes</span></div>
      <p class="lead">Get learners to produce or work out language themselves before you supply it. Click each technique for a real example.</p>
      <div id="elicit"></div>
    </div>
  </section>

  <section id="s3" data-n="3">
    <div class="card" data-n="3">
      <div class="stage-title">Match: elicit, or just tell them? <span class="badge">8 minutes</span></div>
      <p class="lead">A teaching moment below. Would eliciting actually work here, or is telling faster and clearer? Click your answer.</p>
      <div id="eot"></div>
    </div>
  </section>

  <section id="s4" data-n="4">
    <div class="card" data-n="4">
      <div class="stage-title">Spot the bad CCQ <span class="badge">9 minutes</span></div>
      <div class="mhead"><p class="lead">Target: "I've lived here for six years." Click the question you think is genuinely a bad CCQ.</p><span class="count" id="ccqCount">0 of 5 examined</span></div>
      <div class="stack" id="ccq"></div>
      <div class="why-box" id="ccqWhy" hidden></div>
    </div>
  </section>

  <section id="s5" data-n="5">
    <div class="card" data-n="5">
      <div class="stage-title">Write your own CCQs <span class="badge">14 minutes</span></div>
      <p class="lead">For each target item, write two CCQs. Compare with a model once you've tried.</p>
      <div id="write"></div>
    </div>
  </section>

  <section id="s6" data-n="6">
    <div class="card" data-n="6">
      <div class="stage-title">Beyond CCQs: when to use each <span class="badge">11 minutes</span></div>
      <p class="lead">CCQs aren't the only tool. For each technique, say when you'd actually use it, then click to check.</p>
      <div id="beyond"></div>
    </div>
  </section>

  <section id="s7" data-n="7">
    <div class="card" data-n="7">
      <div class="stage-title">Discuss: near misses <span class="badge">6 minutes</span></div>
      <p class="lead">These sound like CCQs but aren't quite. Click each to see why, then discuss: what would fix it?</p>
      <div id="near"></div>
    </div>
  </section>

  <section id="s8" data-n="8">
    <div class="card" data-n="8">
      <div class="stage-title">Answer key</div>
      <button class="btn" type="button" id="keyOpen">Reveal answer key: save or print to keep</button>
      <div class="akey" id="key" hidden>
        <div class="akey-top"><span class="label">Answer key: handout, to keep</span><span class="btn-row"><button class="btn" type="button" id="keyHide">Hide</button><button class="btn" type="button" onclick="window.print()">Print</button></span></div>
        <div class="box"><p class="ctx">Good CCQ or bad CCQ?</p><div id="keyCcq"></div></div>
        <div class="box"><p class="ctx">Model CCQs</p><div id="keyModel"></div></div>
      </div>
      <div class="staging">
        <button class="btn" type="button" id="stgBtn">See staging example</button>
        <div id="stg" hidden>
          <p class="ctx">Example: checking "used to" for past habits</p>
          <div class="kv" id="stgRows"></div>
        </div>
      </div>
    </div>
  </section>
'''

STYLE = r'''
  .box{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 16px; margin:8px 0;}
  .box.good{border-color:var(--teal);} .box.bad{border-color:var(--brick);}
  .ctx{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.06rem; color:var(--ink); margin:0 0 4px;}
  .opts{display:flex; flex-wrap:wrap; gap:8px; margin-top:8px;}
  .opt{background:var(--field); border:1.5px solid var(--sand-line); border-radius:999px; padding:7px 14px; font:600 .86rem 'Karla',sans-serif; color:var(--ink); cursor:pointer; min-height:36px; text-align:left;}
  .opt:hover{border-color:var(--gold);}
  .fb{margin:8px 0 0; font-size:.9rem; line-height:1.55; color:var(--ink);}
  .fb b.good{color:var(--teal);} .fb b.bad{color:var(--brick);}
  .mhead{display:flex; justify-content:space-between; align-items:baseline; gap:10px; flex-wrap:wrap;}
  .mhead .lead{margin:0; flex:1 1 300px;}
  .count{font-size:.84rem; font-weight:600; color:var(--grey);}
  .reveal-card .q{display:flex; justify-content:space-between; align-items:baseline; gap:10px; flex-wrap:wrap;}
  .reveal-card .q .hint{font-weight:600;}
  .reveal-card.open .q .closed{display:none;}
  .ccqb{display:flex; justify-content:space-between; align-items:center; gap:12px; text-align:left; width:100%; background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-strip); padding:11px 14px; font:400 .92rem/1.5 'Karla',sans-serif; color:var(--ink); cursor:pointer;}
  .ccqb:hover{border-color:var(--gold);}
  .ccqb.good{border-color:var(--teal); background:color-mix(in oklab, var(--teal) 7%, var(--paper));}
  .ccqb.bad{border-color:var(--brick); background:color-mix(in oklab, var(--brick) 5%, var(--paper));}
  .ccqb .st{flex:none; font-size:.76rem; font-weight:700;}
  .ccqb.good .st{color:var(--teal);} .ccqb.bad .st{color:var(--brick);}
  .why-box{margin-top:10px; border-left:4px solid var(--teal); background:var(--paper); padding:10px 14px; font-size:.9rem; line-height:1.55;}
  .box .write-area{margin:6px 0 0;}
  .box .model-btn{margin-top:8px;}
  .model{margin-top:8px; border-left:4px solid var(--teal); padding:6px 12px; font-size:.9rem; line-height:1.55;}
  .akey{margin-top:12px;}
  .akey-top{display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;}
  .akey-top .label{margin:0;} .akey-top .btn-row{margin:0;}
  .krow{padding:6px 0; border-bottom:1px solid var(--row-line); font-size:.88rem; line-height:1.5;}
  .krow:last-child{border-bottom:0;}
  .krow p{margin:0;} .krow p + p{font-style:italic; color:var(--grey);}
  .staging{margin-top:22px; padding-top:16px; border-top:1px solid var(--row-line);}
  .staging .ctx{margin:14px 0 8px;}
  .kv{border:1px solid var(--sand-line); border-radius:var(--r-strip); overflow:hidden; background:var(--paper);}
  .kv .kvr{display:grid; grid-template-columns:150px 1fr; gap:10px; padding:8px 12px; border-bottom:1px solid var(--row-line); font-size:.88rem; line-height:1.5;}
  .kv .kvr:last-child{border-bottom:0;} .kv .kvr b{font-weight:700;} .kv .kvr span{color:var(--grey);}
  @media(max-width:560px){ .kv .kvr{grid-template-columns:1fr; gap:2px;} }
  @media print{ #keyOpen, .akey-top .btn-row, #stgBtn, .model-btn{display:none !important;} }
'''

SCRIPT = r'''
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const card = (q, a) => '<div class="reveal-card" onclick="this.classList.toggle(\'open\')"><div class="q">' + q + '</div><div class="a">' + esc(a) + '</div></div>';

// ---------- 2. Eliciting techniques ----------
const ELICIT = [
  ['Visuals / realia', "Show, don't tell", 'Hold up a real umbrella and ask "What\'s this?" instead of defining the word: the object elicits the label from students who already know it.'],
  ['Situation / context clue', 'Build a scenario first', 'Describe a scene ("It\'s raining hard, I forgot mine, I\'m getting soaked") and ask what you need: students supply "an umbrella" themselves.'],
  ['Definitions worked backward', 'Give the definition, they give the word', 'T: "A place where you borrow books for free, what\'s it called?" S: "A library." Reverses the usual direction: they produce the target word from a description.'],
  ["Students' existing knowledge", 'Ask before you tell', 'Before presenting a grammar point, ask "Does anyone know how we make the passive?": some may already have partial knowledge worth surfacing first.'],
  ['Gesture / mime', 'Physical prompt', 'Mime drinking from a cup and raise an eyebrow questioningly: students supply "Would you like a drink?" without you saying a word of it.']
];
$('elicit').innerHTML = ELICIT.map(e => card('<span>' + esc(e[0]) + '</span><span class="hint">' + esc(e[1]) + '</span>', e[2])).join('');

// ---------- 3. Elicit or tell ----------
const EOT = [
  ['Introducing the word "photosynthesis-level" vocabulary like "chlorophyll" to absolute beginners with zero science background in either language.', 'tell', "Just tell them: there's nothing to elicit if the concept and the word are both entirely new. Eliciting works by surfacing something already partly known."],
  ['Presenting "used to" for past habits to an intermediate class who already know past simple well.', 'elicit', 'Elicit: they likely already produce sentences like "I played a lot as a kid" naturally; drawing "used to" out via a situation builds on what they have.'],
  ['A fire alarm is about to go off for a drill and you need the class to line up at the door immediately.', 'tell', "Just tell them: eliciting takes time you don't have, and the stakes of a misunderstanding are too high to risk."],
  ['A learner uses "furious" when they mean "annoyed" and you want the class to notice the difference in strength.', 'elicit', 'Elicit: a cline (scale) works well here, and having students place the words themselves cements the distinction better than you stating it.']
];
const eot = {};
function drawEot(){
  $('eot').innerHTML = EOT.map((s, i) => {
    const pick = eot[i];
    if (pick === undefined) return '<div class="box"><p class="fb" style="margin:0">' + esc(s[0]) + '</p><div class="opts"><button type="button" class="opt" data-i="' + i + '" data-p="elicit">Elicit it</button><button type="button" class="opt" data-i="' + i + '" data-p="tell">Just tell them</button></div></div>';
    const ok = pick === s[1];
    return '<div class="box ' + (ok ? 'good' : 'bad') + '"><p class="fb" style="margin:0">' + esc(s[0]) + '</p><p class="fb"><b class="' + (ok ? 'good">Correct.' : 'bad">Not this one.') + '</b> ' + esc(s[2]) + '</p></div>';
  }).join('');
}
$('eot').addEventListener('click', e => { const b = e.target.closest('[data-p]'); if (!b) return; eot[b.dataset.i] = b.dataset.p; drawEot(); });
drawEot();

// ---------- 4. Spot the bad CCQ ----------
const CCQ = [
  ['Do you understand "I\'ve lived here for six years"?', true, 'This just asks if they understand: it contains the target language and gives no way to check anything beyond a yes/no guess.'],
  ['Did I move here six years ago?', false, ''],
  ['Do I still live here now?', false, ''],
  ['Have you ever lived somewhere for six years?', true, "This asks about the student's own experience, not the meaning of the target sentence: it doesn't check anything about the grammar."],
  ['Is this a completed action in the past, or does it continue?', true, 'This uses grammatical terminology ("completed action") the student may not know: a CCQ should be simpler than the target, not more technical.']
];
// Each question clicked stays examined (its verdict stays on it); the box below explains the last one clicked.
let ccqPick = null; const examined = new Set();
function drawCcq(){
  $('ccqCount').textContent = examined.size + ' of ' + CCQ.length + ' examined';
  $('ccq').innerHTML = CCQ.map((c, i) => {
    const show = examined.has(i);
    return '<button type="button" class="ccqb' + (show ? (c[1] ? ' good' : ' bad') : '') + '" data-i="' + i + '"><span>' + esc(c[0]) + '</span>' + (show ? '<span class="st">' + (c[1] ? 'Bad CCQ' : 'Actually fine') + '</span>' : '') + '</button>';
  }).join('');
  $('ccqWhy').hidden = ccqPick === null;
  if (ccqPick !== null) $('ccqWhy').textContent = CCQ[ccqPick][2] || "This one is a genuinely good CCQ: simple, doesn't contain the target language, and checks meaning directly.";
}
$('ccq').addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (!b) return; ccqPick = +b.dataset.i; examined.add(ccqPick); drawCcq(); });
drawCcq();

// ---------- 5. Write your own ----------
const WRITE = [
  ['Target: "She might be at work."', 'Model: "Do I know for sure where she is?" (No.) "Is this a guess?" (Yes.)'],
  ['Target: "If I were you, I\'d apologize."', 'Model: "Am I really you?" (No.) "Is this real advice or an imaginary situation?" (Imaginary, but real advice.)'],
  ['Target: "I wish I hadn\'t said that."', 'Model: "Did I say it?" (Yes.) "Am I happy about it?" (No.) "Can I change it now?" (No.)'],
  ['Target: "By the time I arrived, the film had started."', 'Model: "Which happened first, my arriving or the film starting?" (The film.) "Was the film still starting when I got there?" (No, already going.)']
];
$('write').innerHTML = WRITE.map((w, i) => '<div class="box"><p class="ctx">' + esc(w[0]) + '</p>'
  + [1, 2].map(n => '<textarea class="write-area" rows="2" placeholder="CCQ ' + n + '" aria-label="' + esc(w[0]) + ', CCQ ' + n + '"></textarea>').join('')
  + '<button type="button" class="btn model-btn" data-w="' + i + '">Compare with model CCQs</button><div class="model" id="model' + i + '" hidden>' + esc(w[1]) + '</div></div>').join('');
$('write').addEventListener('click', e => {
  const b = e.target.closest('[data-w]'); if (!b) return;
  const m = $('model' + b.dataset.w); m.hidden = !m.hidden; b.textContent = m.hidden ? 'Compare with model CCQs' : 'Hide model CCQs';
});

// ---------- 6. Beyond CCQs ----------
const TECH = [
  ['Timeline', 'Best for tense and aspect: showing when an action happens relative to now.'],
  ['Realia (the real object)', 'Fast and unambiguous for concrete nouns: showing an umbrella beats defining one.'],
  ['Situation / short story', 'Good for functional language or attitude words: meaning that needs a context to make sense.'],
  ['Cline (a scale drawn on the board)', 'Good for grading words like "furious" vs. "annoyed": shows relative strength.'],
  ['Discrimination (compare two structures)', 'Higher levels: give a minimal pair, "She left when the police got there" vs. "She\'d left when the police got there", and have students work out the difference themselves.'],
  ['Negative checking', 'Establish when the item CAN\'T be used: e.g. is "I used to walk to school this morning" OK? (No: "used to" needs a past habit, not one specific morning.)'],
  ['Extension / completion', 'Give the start of a sentence with the target item and have students complete it: "He used to drink champagne, but..." (now he\'s in prison) shows they\'ve grasped the contrast.'],
  ['Personalizing / giving examples', 'Ask students to supply their own example of the concept: if they can, that proves understanding better than a yes/no answer.']
];
$('beyond').innerHTML = TECH.map(t => card('<span>' + esc(t[0]) + '</span><span class="hint closed">When would you use this? Click to reveal</span>', t[1])).join('');

// ---------- 7. Near misses ----------
const NEAR = [
  ['"Is \'might\' the same as \'will\'?"', 'A near miss: it sounds like a CCQ but only tests if they can spot a synonym, not whether they grasp the concept of possibility versus certainty.'],
  ['"So it means maybe, right?"', 'A near miss: the teacher supplies the answer inside the question. Students agree without proving understanding.']
];
$('near').innerHTML = NEAR.map(n => card('<span>' + esc(n[0]) + '</span>', n[1])).join('');

// ---------- 8. Answer key and staging example ----------
$('keyCcq').innerHTML = CCQ.map(c => '<div class="krow"><p>' + esc(c[0]) + '</p><p>' + esc(c[1] ? 'Bad CCQ: ' + c[2] : 'Good CCQ') + '</p></div>').join('');
$('keyModel').innerHTML = WRITE.map(w => '<div class="krow"><p>' + esc(w[0]) + '</p><p>' + esc(w[1]) + '</p></div>').join('');
$('keyOpen').onclick = () => { $('key').hidden = false; $('keyOpen').hidden = true; };
$('keyHide').onclick = () => { $('key').hidden = true; $('keyOpen').hidden = false; };
const EXAMPLE = [
  ['Target', '"I used to play basketball." (past habit, not now)'],
  ['CCQ 1', '"Do I play basketball now?" (No.)'],
  ['CCQ 2', '"Did I play basketball in the past, many times?" (Yes.)'],
  ['Non-verbal backup', 'A timeline: mark repeated Xs in the past, a clear stop before "now."']
];
$('stgRows').innerHTML = EXAMPLE.map(r => '<div class="kvr"><b>' + esc(r[0]) + '</b><span>' + esc(r[1]) + '</span></div>').join('');
$('stgBtn').onclick = () => { const o = $('stg').hidden; $('stg').hidden = !o; $('stgBtn').textContent = o ? 'Hide staging example' : 'See staging example'; };
'''
