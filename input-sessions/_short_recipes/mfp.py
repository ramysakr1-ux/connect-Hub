# Connect's 45-minute "MFPA: meaning, form, pronunciation, appropriacy" (src/app/input-sessions/sessions/mfp.tsx),
# on Lite's desk. Content word for word, American spelling; the CCQ models, the form and stress pickers, the weak
# forms, the register choice, the quick fire, the flaws, the answer key and the staging example work as on Connect.
# The stages follow Connect's agenda order (on Connect the quick fire sits after "Analyse the form", before the
# agenda says it should). The weak forms are heard, as the stage asks ("Listen for how each phrase is actually said"),
# in Lite's four recorded house voices (../voices.js, lines in mfp-short/audio/lines.json): each is recorded from its
# fast-speech spelling ("I wanna go"), so the voice says the weak form, while the page shows the phrase as written.
TITLE = 'MFPA: meaning, form, pronunciation, appropriacy'
LONG = 'language-analysis'
SUB = ('Every target item needs all four covered before it\'s ready to teach. This session gives each real weight: writing CCQs '
       'that isolate meaning, analyzing form precisely, not skipping pronunciation, and checking when a form is actually the right choice.')
NAV = [('s1', '1 · Lead-in'), ('s2', '2 · The four'), ('s3', '3 · Write a CCQ'), ('s4', '4 · Analyze the form'),
       ('s5', '5 · Weak forms'), ('s6', '6 · Mark the stress'), ('s7', '7 · Which register?'), ('s8', '8 · Quick fire'),
       ('s9', '9 · Spot the flaw')]

NOTES = '''<h4>Running this session</h4>
<p>Give meaning and form the same rigor you'd give pronunciation: a vague CCQ is as much a gap as an undrilled weak form. Model pronunciation features yourself before naming them.</p>
<h4>Not every item needs all three drilled equally</h4>
<p>A TTT lesson only teaches the gap the test revealed: flag that MFP is a checklist to consider, not three things to always spend equal time on.</p>
<h4>Sentence stress carries meaning</h4>
<p>If trainees mark the "wrong" word, ask what it would mean if THAT word carried the stress: stress is a meaning choice, not decoration.</p>
<h4>Weak forms are for listening as much as speaking</h4>
<p>Students who can't recognize "gonna," "wanna," or a weak "to" /tə/ struggle with listening far more than with grammar.</p>
<h4>Appropriacy is easy to forget entirely</h4>
<p>It rarely gets a CCQ or a drill of its own, usually just a one-line comment. Push trainees to build a real, quick check for it, the same as the other three.</p>'''

BODY = r'''
  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="stage-title">Lead-in <span class="badge">2 minutes</span></div>
      <p class="lead">Quick show of hands: has anyone taught a grammar point perfectly, then watched students say it unintelligibly out loud? What went missing?</p>
    </div>
  </section>

  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">Meaning, form, pronunciation defined <span class="badge">3 minutes</span></div>
      <p class="lead">The three, in thirty seconds each.</p>
      <div class="pillars" id="pillars"></div>
    </div>
  </section>

  <section id="s3" data-n="3">
    <div class="card" data-n="3">
      <div class="stage-title">Write a CCQ: meaning <span class="badge">6 minutes</span></div>
      <p class="lead">For each target item, write one CCQ that isolates the tricky part of the meaning. Compare with the model once you've tried.</p>
      <div id="ccqs"></div>
    </div>
  </section>

  <section id="s4" data-n="4">
    <div class="card" data-n="4">
      <div class="stage-title">Analyze the form <span class="badge">5 minutes</span></div>
      <p class="lead">Click the piece of each pattern that's most likely to trip students up.</p>
      <div id="forms"></div>
    </div>
  </section>

  <section id="s5" data-n="5">
    <div class="card" data-n="5">
      <div class="stage-title">Transcribe the weak forms <span class="badge">6 minutes</span></div>
      <p class="lead">Listen for how each phrase is actually said in fast speech, not how it's spelled. Click your guess, then check.</p>
      <div class="vbar" data-voices-here></div>
      <div id="weak"></div>
    </div>
  </section>

  <section id="s6" data-n="6">
    <div class="card" data-n="6">
      <div class="stage-title">Mark the sentence: stress and weak forms <span class="badge">6 minutes</span></div>
      <p class="lead">Click the word you think carries the main sentence stress in each example.</p>
      <div id="stress"></div>
    </div>
  </section>

  <section id="s7" data-n="7">
    <div class="card" data-n="7">
      <div class="stage-title">Appropriacy: which register? <span class="badge">5 minutes</span></div>
      <p class="lead">Same meaning, different register. Click who you'd actually say each one to.</p>
      <div id="approp"></div>
    </div>
  </section>

  <section id="s8" data-n="8">
    <div class="card" data-n="8">
      <div class="stage-title">Meaning, form, pron, or appropriacy? Quick fire <span class="badge">6 minutes</span></div>
      <p class="lead">For each task type, click which of the four it's checking. <span class="count" id="qfCount"></span></p>
      <div id="quick"></div>
    </div>
  </section>

  <section id="s9" data-n="9">
    <div class="card" data-n="9">
      <div class="stage-title">Spot the flaw: MFPA done badly <span class="badge">6 minutes</span></div>
      <p class="lead">Each mini-plan skips part of MFP. Click to reveal what's missing.</p>
      <div id="flaws"></div>

      <div class="btn-row"><button class="btn" type="button" id="keyOpen">Reveal answer key: save or print to keep</button></div>
      <div class="answer-key" id="key" hidden>
        <div class="keyhead"><span class="keytitle">Answer key: handout, to keep</span><span class="keybtns"><button class="btn" type="button" id="keyHide">Hide</button><button class="btn" type="button" onclick="window.print()">Print</button></span></div>
        <div class="box"><h3>Meaning, form or pronunciation?</h3><table class="grid stk"><tbody id="keyQuick"></tbody></table></div>
        <div class="box"><h3>Model CCQs</h3><div id="keyCcq"></div></div>
      </div>

      <div class="btn-row"><button class="btn" type="button" id="exBtn">See staging example</button></div>
      <div class="example" id="ex" hidden>
        <h3>Example: clarifying “used to,” fully MFP’d</h3>
        <table class="grid stk"><thead><tr><th>Focus</th><th>What the teacher does</th></tr></thead><tbody id="exRows"></tbody></table>
      </div>
    </div>
  </section>
'''

STYLE = r'''
  .box{background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 16px; margin:10px 0 0;}
  .box h3, .example h3{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.08rem; margin:0 0 6px; color:var(--ink);}
  .box .item{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.02rem; margin:0;}
  .small{font-size:.86rem; color:var(--grey); margin:4px 0 0; line-height:1.5;}
  .model{margin:10px 0 0; padding:4px 0 4px 12px; border-left:4px solid var(--teal); font-size:.9rem; line-height:1.55;}
  .model[hidden]{display:none;}
  .box .btn{margin-top:10px;}
  .pillars{display:grid; grid-template-columns:repeat(4,1fr); gap:10px;}
  @media(max-width:760px){ .pillars{grid-template-columns:1fr 1fr;} }
  @media(max-width:420px){ .pillars{grid-template-columns:1fr;} }
  .pillar{background:var(--paper); border:1.5px solid var(--sand-line); border-top:3px solid var(--teal); border-radius:var(--r-strip); padding:12px 14px;}
  .pillar.red{border-top-color:var(--a-red);} .pillar.grey{border-top-color:var(--grey);}
  .pillar b{display:block; font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--teal);}
  .pillar.red b{color:var(--a-red);} .pillar.grey b{color:var(--grey);}
  .pillar p{margin:6px 0 0; font-size:.88rem; line-height:1.5;}
  .row{display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:10px 14px;}
  .play{display:inline-flex; align-items:center; justify-content:center; background:var(--teal); color:var(--paper); border:none; border-radius:999px !important; padding:5px 14px; font:700 .78rem 'Karla',sans-serif; cursor:pointer; min-height:34px; margin-right:8px; vertical-align:middle;}
  .play:hover{background:var(--teal-lifted);}
  .vbar .lite-voices{margin:0 0 6px;}
  @media print{ .play{display:none !important;} }
  .row .say{flex:1 1 200px; font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.02rem; margin:0;}
  .optrow{display:flex; flex-wrap:wrap; gap:6px;}
  .opt{background:var(--field); border:1.5px solid var(--sand-line); border-radius:999px !important; padding:6px 13px; font:700 .84rem/1.3 'Karla',sans-serif; color:var(--ink); cursor:pointer; min-height:36px; text-align:left;}
  .opt:hover{border-color:var(--gold);}
  .opt.good{border-color:var(--teal); background:color-mix(in oklab, var(--teal) 10%, var(--paper)); color:var(--teal);}
  .opt.bad{border-color:var(--a-red); background:color-mix(in oklab, var(--a-red) 8%, var(--paper)); color:var(--a-red);}
  .toks{display:flex; flex-wrap:wrap; gap:4px; font-family:'Newsreader',Georgia,serif; font-size:1.1rem;}
  .toks.big{font-size:1.35rem;}
  .tok{background:none; border:1.5px solid transparent; padding:2px 7px; font:inherit; color:var(--ink); cursor:pointer;}
  .tok:hover{border-color:var(--sand-line);}
  .tok.good{color:var(--teal); background:color-mix(in oklab, var(--teal) 10%, var(--paper)); font-weight:700;}
  .tok.bad{color:var(--a-red); background:color-mix(in oklab, var(--a-red) 8%, var(--paper)); font-weight:700;}
  .fb{font-weight:700; font-size:.84rem;} .fb.good{color:var(--teal);} .fb.bad{color:var(--a-red);}
  .count{font-weight:700; color:var(--teal); white-space:nowrap;}
  .answer-key{margin-top:14px;}
  .keyhead{display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;}
  .keytitle{font-size:10px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:var(--grey);}
  .keybtns{display:flex; gap:8px;}
  .keyccq{border-bottom:1px solid var(--row-line); padding:6px 0;} .keyccq:last-child{border-bottom:0;}
  .keyccq p{margin:0; font-size:.88rem;} .keyccq p.m{font-style:italic; color:var(--grey);}
  .example{margin-top:12px;}
  table.grid td.lab{font-weight:700; white-space:nowrap;} td.lab.teal{color:var(--teal);} td.lab.red{color:var(--a-red);}
  @media(max-width:560px){
    table.stk, table.stk tbody, table.stk tr, table.stk td{display:block; width:100%;}
    table.stk thead{display:none;}
    table.stk tr{border:1px solid var(--sand-line); background:var(--paper); padding:6px 10px; margin:0 0 6px;}
    table.stk td{border:0; padding:2px 0;}
  }
  @media print{ .model, .answer-key, .example, .toks + .small, .fb, .count{display:none !important;} .tok.good, .tok.bad{color:var(--ink); background:none; font-weight:inherit;} .opt.good, .opt.bad{border-color:var(--sand-line); background:var(--field); color:var(--ink);} body.tutor .model:not([hidden]){display:block !important;} }   /* 20 Nov 2026: on paper an answered row is the task again. "Print the handout" printed the right word in bold with "Right." and its explanation under it, "Right" or "Not quite" beside the options, and the score. */
'''

SCRIPT = r'''
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

// ---------- 2. The four ----------
const PILLARS = [
  ['Meaning', '', 'What the item means, checked with CCQs: not the definition, the concept.'],
  ['Form', '', 'How it’s built and how it changes: spelling, word order, morphology.'],
  ['Pronunciation', 'red', 'How it sounds: stress, individual sounds, weak forms, connected speech.'],
  ['Appropriacy', 'grey', 'When it’s the right choice: register, formality, who says it to whom.']
];
$('pillars').innerHTML = PILLARS.map(p => '<div class="pillar ' + p[1] + '"><b>' + p[0] + '</b><p>' + esc(p[2]) + '</p></div>').join('');

// ---------- 3. Write a CCQ ----------
const CCQ_ITEMS = [
  ['Target: “I wish I had studied harder.”', 'Trap: students often think this describes the present, not a regret about the past.', 'Model CCQ: “Did I study hard? Can I change that now? Am I happy about it?” Three questions, each isolating one part of the concept.'],
  ['Target: “She might be at work.”', 'Trap: confusing possibility with certainty, or with permission (a different use of “might”).', 'Model CCQ: “Do I know for sure where she is? Is this a guess or a fact? Could she be somewhere else?”'],
  ['Target: “By the time I arrived, the meeting had started.”', 'Trap: students often can’t sequence which event happened first.', 'Model CCQ: “Which happened first, my arriving or the meeting starting? Was the meeting still starting when I got there, or already underway?”']
];
$('ccqs').innerHTML = CCQ_ITEMS.map((c, i) => '<div class="box"><p class="item">' + esc(c[0]) + '</p><p class="small">' + esc(c[1]) + '</p>'
  + '<button class="btn" type="button" data-ccq="' + i + '">Compare with a model CCQ</button><div class="model" id="ccq' + i + '" hidden>' + esc(c[2]) + '</div></div>').join('');
$('ccqs').addEventListener('click', e => {
  const b = e.target.closest('[data-ccq]'); if (!b) return;
  const m = $('ccq' + b.dataset.ccq); m.hidden = !m.hidden;
  b.textContent = m.hidden ? 'Compare with a model CCQ' : 'Hide model CCQ';
});

// a row of words where one is the answer: the first pick locks, the answer shows
function tokenTask(el, items, big){
  const picks = {};
  function draw(){
    el.innerHTML = items.map((it, ii) => {
      const picked = picks[ii], answered = picked !== undefined;
      const toks = it.words.map((w, wi) => {
        let cls = '';
        if (answered && wi === picked) cls = wi === it.answer ? ' good' : ' bad';
        else if (answered && wi === it.answer) cls = ' good';
        return '<button type="button" class="tok' + cls + '" data-t="' + ii + ':' + wi + '">' + esc(w) + '</button>';
      }).join('');
      const fb = answered ? '<p class="small"><span class="fb ' + (picked === it.answer ? 'good">Right.' : 'bad">Not quite.') + '</span> ' + esc(it.note) + '</p>' : '';
      return '<div class="box"><div class="toks' + (big ? ' big' : '') + '">' + toks + '</div>' + fb + '</div>';
    }).join('');
  }
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-t]'); if (!b) return;
    const [ii, wi] = b.dataset.t.split(':').map(Number);
    if (picks[ii] === undefined) { picks[ii] = wi; draw(); }
  });
  draw();
}

// ---------- 4. Analyze the form ----------
tokenTask($('forms'), [
  { words: ['She', 'hasn’t', 'finished', 'her', 'homework', 'yet'], answer: 1, note: 'The contraction “hasn’t” hides two pieces students often separate incorrectly when writing: has + not.' },
  { words: ['If', 'I', 'had', 'known,', 'I’d', 'have', 'called'], answer: 4, note: '“I’d” is ambiguous in writing: students need to work out from context whether it’s “I had” or “I would.”' },
  { words: ['He', 'suggested', 'that', 'she', 'see', 'a', 'doctor'], answer: 4, note: 'The bare infinitive “see” (not “sees” or “to see”) after “suggested that” is the subjunctive, an irregular pattern students misform constantly.' }
]);

// options in a row: any pick shows right or wrong, and can be changed
function choiceTask(el, items, onChange){
  const picks = {};
  function draw(){
    el.innerHTML = items.map((it, ii) => {
      const picked = picks[ii];
      const opts = it.options.map((o, oi) => '<button type="button" class="opt' + (picked === oi ? (oi === it.answer ? ' good' : ' bad') : '') + '" data-o="' + ii + ':' + oi + '">' + esc(o) + '</button>').join('');
      const fb = picked === undefined ? '' : '<span class="fb ' + (picked === it.answer ? 'good">Right' : 'bad">Not quite') + '</span>';
      return '<div class="box row"><div class="say">' + it.head + '</div><div class="optrow">' + opts + fb + '</div></div>';
    }).join('');
    if (onChange) onChange(items.filter((it, i) => picks[i] === it.answer).length);
  }
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-o]'); if (!b) return;
    const [ii, oi] = b.dataset.o.split(':').map(Number); picks[ii] = oi; draw();
  });
  draw();
}

// ---------- 5. Weak forms: Play says the phrase as it is said in fast speech (its recording's own spelling, the third item) ----------
choiceTask($('weak'), [
  ['I want to go', ['/aɪ ˈwɒnt tuː gəʊ/', '/aɪ ˈwɒnə gəʊ/', '/aɪ wɒnt tə gəʊ/'], 'I wanna go'],
  ['What are you doing?', ['/wɒt ɑː juː ˈduːɪŋ/', '/ˈwɒtʃə ˈduːɪŋ/', '/wɒt ɑː jʊ duːɪŋ/'], 'Whatcha doing?'],
  ['Going to be late', ['/ˈgəʊɪŋ tuː biː leɪt/', '/ˈgɒnə biː leɪt/', '/gəʊɪŋ tə biː leɪt/'], 'Gonna be late'],
  ['Give me a hand', ['/gɪv miː ə hænd/', '/ˈgɪmiː ə hænd/', '/gɪv mə hænd/'], 'Gimme a hand'],
  ['She has to leave', ['/ʃiː hæz tuː liːv/', '/ʃiː ˈhæstə liːv/', '/ʃiː həz tə liːv/'], 'She hasta leave']
].map(w => ({ head: '<button type="button" class="play" data-say="' + esc(w[2]) + '" aria-label="Play: ' + esc(w[0]) + '">Play</button> “' + esc(w[0]) + '”', options: w[1], answer: 1 })));

// ---------- 6. Mark the stress ----------
tokenTask($('stress'), [
  { words: ['I', 'don’t', 'want', 'the', 'red', 'one'], answer: 2, note: 'Neutral answer to “which one?”: the new information is stressed.' },
  { words: ['I', 'don’t', 'want', 'the', 'red', 'one'], answer: 4, note: 'Contrast: implies someone else does, or a different color was offered.' },
  { words: ['She’s', 'coming', 'on', 'Friday', 'not', 'Monday'], answer: 5, note: 'Correcting a wrong assumption: the corrected word takes the stress.' }
], true);

// ---------- 7. Which register ----------
choiceTask($('approp'), [
  ['Could you possibly pass the salt?', ['A stranger at a formal dinner', 'Your best friend', 'A small child'], 0],
  ['Gimme a sec', ['Your boss in an email', 'A close friend, in person', 'A job interviewer'], 1],
  ['I would be grateful if you could confirm receipt.', ['A text to your sister', 'A formal business email', 'A spoken request to a flatmate'], 1]
].map(a => ({ head: '“' + esc(a[0]) + '”', options: a[1], answer: a[2] })));

// ---------- 8. Quick fire ----------
const MF_OPTIONS = ['Meaning', 'Form', 'Pronunciation', 'Appropriacy'];
const MF_ITEMS = [
  ['I ___ (play) basketball in high school.', 'Gap-fill', 'Form'],
  ['Mark the stressed syllable: com-FORT-able', 'Syllable stress task', 'Pronunciation'],
  ['Does she still play now, or is that finished?', 'CCQ against a timeline', 'Meaning'],
  ['“Could you possibly...?” vs. “Gimme...”: which fits a job interview?', 'Register choice task', 'Appropriacy'],
  ['I used playing basketball every day.', 'Spot the mistake', 'Form'],
  ['Listen: “saɪdə”, what two words is the speaker actually saying?', 'Weak-form / connected-speech dictation', 'Pronunciation']
];
choiceTask($('quick'), MF_ITEMS.map(m => ({ head: '“' + esc(m[0]) + '”<p class="small"><i>' + esc(m[1]) + '</i></p>', options: MF_OPTIONS, answer: MF_OPTIONS.indexOf(m[2]) })),
  n => { $('qfCount').textContent = n + ' of ' + MF_ITEMS.length + ' correct'; });

// ---------- 9. Spot the flaw ----------
const FLAWS = [
  ['Plan A: present perfect for experience', 'The teacher presents the form on the board (subject + have/has + past participle), drills the sentence chorally twice, then moves straight to a gap-fill.', 'Missing meaning. No CCQs check whether students understand this describes an experience up to now, with no specific time given: students could produce perfect grammatical form while completely misunderstanding when to use it.'],
  ['Plan B: third conditional', 'The teacher asks two CCQs against a timeline (“Did this really happen? Can we change the past?”), then hands out a gap-fill on the form, and moves to freer practice.', 'Missing pronunciation. The weak, contracted “’d have” (as in “I’d have gone”) is never modeled or drilled: students will likely produce three separate, over-stressed words instead of the natural contracted form.'],
  ['Plan C: polite requests (“Could you possibly...?”)', 'The teacher clarifies meaning with CCQs, drills the sentence stress and intonation carefully, then moves to controlled practice.', 'Missing appropriacy. Students never discuss when this level of formality is needed versus when it would sound strange: without that, they may use it with a close friend or skip it entirely with a stranger.']
];
$('flaws').innerHTML = FLAWS.map((f, i) => '<div class="box"><p class="item">' + esc(f[0]) + '</p><p class="small" style="color:var(--ink)">' + esc(f[1]) + '</p>'
  + '<button class="btn" type="button" data-flaw="' + i + '">What’s missing?</button><div class="model" id="flaw' + i + '" hidden>' + esc(f[2]) + '</div></div>').join('');
$('flaws').addEventListener('click', e => {
  const b = e.target.closest('[data-flaw]'); if (!b) return;
  const m = $('flaw' + b.dataset.flaw); m.hidden = !m.hidden;
  b.textContent = m.hidden ? 'What’s missing?' : 'Hide the fix';
});

// the answer key
$('keyQuick').innerHTML = MF_ITEMS.map(m => '<tr><td>' + esc(m[0]) + '</td><td class="lab">' + m[2] + '</td></tr>').join('');
$('keyCcq').innerHTML = CCQ_ITEMS.map(c => '<div class="keyccq"><p>' + esc(c[0]) + '</p><p class="m">' + esc(c[2]) + '</p></div>').join('');
$('keyOpen').onclick = () => { $('key').hidden = false; $('keyOpen').hidden = true; };
$('keyHide').onclick = () => { $('key').hidden = true; $('keyOpen').hidden = false; };

// the staging example
const EXAMPLE_ROWS = [
  ['Meaning', 'teal', 'CCQs against a timeline: “Did I do this once, or many times? Do I do it now?”'],
  ['Form', 'teal', 'Board: subject + used to + base verb. Highlight it never changes for person or number.'],
  ['Pronunciation', 'red', 'Drill the weak, run-together sound: /ˈjuːstə/, not /juːzd tuː/. Mark the schwa.']
];
$('exRows').innerHTML = EXAMPLE_ROWS.map(r => '<tr><td class="lab ' + r[1] + '">' + r[0] + '</td><td>' + esc(r[2]) + '</td></tr>').join('');
$('exBtn').onclick = () => { $('ex').hidden = !$('ex').hidden; $('exBtn').textContent = $('ex').hidden ? 'See staging example' : 'Hide staging example'; };
'''
