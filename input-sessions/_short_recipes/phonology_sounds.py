# Connect's "Phonology: sounds" (src/app/input-sessions/sessions/phonology-sounds.tsx), on Lite's desk. Content word for
# word, American spelling, IPA exactly as Connect has it. Every word is one of Lite's four recorded house voices
# (../voices.js, lines in phonology-sounds-short/audio/lines.json, the same words the long session recorded); a symbol is
# heard in its example word, as on the long session, since a recording cannot say /b/ on its own. Every stage checks
# itself as on Connect: Check marks each answer, any edit clears the marks.
TITLE = 'Phonology: sounds'
LONG = 'phonology-sounds'
SUB = ('Sounds against letters, the terminology, where consonants are made, voicing, the whole phonemic chart spoken aloud, and then '
       'writing in phonemic script until it stops feeling foreign. Every word on this page can be heard, not just read.')
NAV = [('s1', '1 · Sounds vs letters'), ('s2', '2 · Terminology'), ('s3', '3 · Obstruction'), ('s4', '4 · Voicing'),
       ('s5', '5 · The chart'), ('s6', '6 · Phonemic script'), ('s7', '7 · Film titles')]

NOTES = '''<h4>Running this session</h4>
<p>Trainees type answers on their own screens and check themselves; you only reveal. Keep the chart open on the shared screen from stage 5 onwards: stages 6 and 7 are done with it in view. The film titles are a race; call it after ten minutes whatever the state of play.</p>
<h4>0–8 · Dictate, then count</h4>
<p>Play each word twice at most. Let them argue over the count of sounds in "letter": four or five is the point, not a problem: it depends on rhoticity. Ask a non-British speaker in the room what they say.</p>
<h4>8–15 · Match, then say it back</h4>
<p>After matching, close the screen and ask pairs to define "diphthong" and "voiced" from memory. If they can't, they haven't got it yet.</p>
<h4>15–25 · Hands on mouths</h4>
<p>Have them say each sound with a hand on the lips, then a finger on the throat. Open Seeing Speech on the shared screen for /r/ and /k/, the two most people get wrong, and watch the tongue.</p>
<h4>25–33 · Voicing from the throat</h4>
<p>Hand on the throat for /s/ then /z/, holding each for two seconds. Then the table. Learners devoice final consonants in many L1s (Turkish, German, Russian): say so here, it is why "last sound" is in the task.</p>
<h4>33–40 · Chart, sound then word</h4>
<p>Click through by row: the page plays each word; model the sound on its own yourself. Don't explain conventions; let the sound come first. Point out the color groups and that the chart is arranged by mouth position, not alphabet.</p>
<h4>40–50 · Script, keys not memory</h4>
<p>Nobody memorizes symbols today; they look them up on the chart above. Common slips: "yelled" starting with y not j, "edge" starting with a vowel, "stretched" ending in /t/ not /d/. Check as a class before revealing.</p>
<h4>50–60 · Race, then close</h4>
<p>Pairs race; first to eight wins. Close on the transfer question: which two sounds from today are most likely to trouble your own TP group?</p>'''

BODY = r'''
  <div class="vbar" data-voices-here></div>

  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="stage-title">Sounds vs letters <span class="badge">8 minutes</span></div>
      <p class="lead">Listen, write the word, then count its letters and its sounds. They are not the same number.</p>
      <div class="rows" id="lead"></div>
      <div class="btn-row"><button type="button" class="btn primary" data-check="lead">Check</button><span class="score" id="leadScore"></span></div>
      <div class="reveal-card" onclick="this.classList.toggle('open')"><div class="q">Why doesn’t the number of letters match the number of sounds?</div><div class="hint">Click to reveal</div><div class="a">Because English spelling records history, not pronunciation. “letter” has six letters and four or five sounds depending on whether you pronounce the r; “phoneme” has seven letters and five sounds. A phoneme is a unit of sound, and the alphabet was never built to write one.</div></div>
    </div>
  </section>

  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">Terminology <span class="badge">7 minutes</span></div>
      <p class="lead">Six terms. Match each to its definition, then close the screen and say them back from memory.</p>
      <div id="match"></div>
    </div>
  </section>

  <section id="s3" data-n="3">
    <div class="card" data-n="3">
      <div class="stage-title">Where is the obstruction? <span class="badge">10 minutes</span></div>
      <p class="lead">Play the word, then say its first sound yourself with a hand on your lips: where is the airflow actually stopped?</p>
      <div class="rows grid2" id="obs"></div>
      <div class="btn-row"><button type="button" class="btn primary" data-check="obs">Check</button><span class="score" id="obsScore"></span></div>
      <p><a class="ext" href="https://www.seeingspeech.ac.uk/ipa-charts/" target="_blank" rel="noreferrer">Seeing Speech: real ultrasound and MRI of each sound, on the IPA chart</a></p>
    </div>
  </section>

  <section id="s4" data-n="4">
    <div class="card" data-n="4">
      <div class="stage-title">Voiced or unvoiced? <span class="badge">8 minutes</span></div>
      <p class="lead">A finger on your throat. Write the word from the script, then say whether its first and last sounds are voiced.</p>
      <div class="rows" id="voi"></div>
      <div class="btn-row"><button type="button" class="btn primary" data-check="voi">Check</button><span class="score" id="voiScore"></span></div>
    </div>
  </section>

  <section id="s5" data-n="5">
    <div class="card" data-n="5">
      <div class="stage-title">The phonemic chart, spoken <span class="badge">7 minutes</span></div>
      <p class="lead">Forty-four phonemes. Click any cell to hear the sound in its word. The chart is arranged by where the sound is made, not by the alphabet.</p>
      <div class="legend">
        <span><i style="background:var(--c-teal)"></i>Long vowels</span><span><i style="background:var(--c-gold)"></i>Short vowels</span><span><i style="background:var(--c-red)"></i>Diphthongs</span><span><i style="background:var(--c-warm)"></i>Voiced consonants</span><span><i style="background:var(--c-muted)"></i>Unvoiced consonants</span>
      </div>
      <div id="chart"></div>
    </div>
  </section>

  <section id="s6" data-n="6">
    <div class="card" data-n="6">
      <div class="stage-title">Write it in phonemic script <span class="badge">10 minutes</span></div>
      <p class="lead">Nobody memorizes symbols today: look them up on the chart above. Click a box, then tap the keys.</p>
      <div class="keys" id="keys"></div>
      <div class="rows grid2" id="scr"></div>
      <div class="btn-row"><button type="button" class="btn primary" data-check="scr">Check</button><span class="score" id="scrScore"></span></div>
      <div id="scrKey"></div>
    </div>
  </section>

  <section id="s7" data-n="7">
    <div class="card" data-n="7">
      <div class="stage-title">Film titles <span class="badge">10 minutes</span></div>
      <p class="lead">In pairs, against the clock. First to eight. A leading “the” doesn’t matter.</p>
      <div class="rows grid2" id="films"></div>
      <div class="btn-row"><button type="button" class="btn primary" data-check="films">Check</button><span class="score" id="filmsScore"></span></div>
      <div id="filmKey"></div>
      <p>To close: which two sounds from today are most likely to trouble your own TP group, and why?</p>
    </div>
  </section>
'''

STYLE = r'''

  .crit{display:flex; gap:12px; align-items:flex-start; background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 14px; margin:0 0 8px;}
  .crit .code{flex:none; background:var(--teal); color:var(--paper); font-weight:700; font-size:.8rem; padding:3px 8px; border-radius:5px;}
  .crit p{margin:0; font-size:.9rem; line-height:1.55;}
  .quiet{font-size:.84rem; font-style:italic; color:var(--grey); margin:8px 0 0;}
  .sub-title{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.12rem; margin:22px 0 4px;}
  .passage{font-size:.97rem; line-height:1.75; background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:14px 18px; margin:10px 0 0;}
  .passage h3{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.15rem; margin:0 0 8px;}
  .passage p{margin:0 0 10px;} .passage p:last-child{margin:0;}
  .reveal-card.open .hint{display:none;}
  .mhead{display:flex; justify-content:space-between; align-items:baseline; gap:10px; flex-wrap:wrap; margin:10px 0 0; font-size:.9rem;}
  .mhead span{color:var(--grey); font-weight:600;}
  .pill-match-wrap .pill{font-family:'Karla',sans-serif; text-align:left; width:100%; display:block;}
  .pill-match-wrap .pill.term{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:.98rem;}
  .pill.matched{cursor:default;}
  .scen{background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 14px; margin:0 0 8px;}
  .scen .lane-tag{margin-bottom:6px;}
  .scen .t{font-size:.92rem; margin:0 0 8px; line-height:1.55;}
  .scen .opts{display:flex; gap:8px; flex-wrap:wrap;}
  .scen .opt{background:var(--field); border:1.5px solid var(--sand-line); border-radius:999px; padding:5px 14px; font-size:.82rem; font-weight:700; color:var(--ink); cursor:pointer; min-height:34px; font-family:'Karla',sans-serif; text-align:left; line-height:1.35; transition:border-color .12s ease;}
  .scen .opt:hover{border-color:var(--gold);}
  .scen .opt:disabled{cursor:default;}
  .scen .opt.good{background:color-mix(in oklab, var(--teal) 11%, transparent); border-color:color-mix(in oklab, var(--teal) 30%, transparent); color:var(--teal);}
  .scen .opt.bad{background:color-mix(in oklab, var(--brick) 10%, transparent); border-color:color-mix(in oklab, var(--brick) 28%, transparent); color:var(--brick);}
  .scen .opt.dim{opacity:.45;}
  .scen .why{display:none; margin:8px 0 0; font-size:.88rem; line-height:1.5; border-top:1px solid var(--row-line); padding-top:8px;}
  .scen.done .why{display:block;}
  .scen.done.right{border-color:var(--teal);} .scen.done.right .why{color:var(--teal);}
  .scen.done.wrong{border-color:color-mix(in oklab, var(--brick) 40%, transparent);} .scen.done.wrong .why{color:var(--brick);}
  button.order-line{width:100%; font-family:'Karla',sans-serif; color:var(--ink); text-align:left;}
  .order-line.done{border-color:var(--teal); color:var(--teal); cursor:default;}
  .status{font-size:.86rem; font-weight:600; color:var(--gold-deep); margin:10px 0 0;}

  :root{--c-teal:oklch(38% 0.072 195); --c-gold:oklch(60% 0.11 70); --c-muted:oklch(51% 0.017 70); --c-red:oklch(45% 0.15 27); --c-warm:oklch(30% 0.042 58);}
  .vu button{font:600 .84rem 'Karla',sans-serif; border:1.5px solid var(--sand-line); background:var(--field); color:var(--ink); border-radius:999px; padding:6px 12px; cursor:pointer; min-height:36px;}
  .vu button.on{border-color:var(--teal); background:var(--teal); color:var(--paper);}
  .rows{display:flex; flex-direction:column; gap:8px; margin:12px 0 0;}
  .rows.grid2{display:grid; grid-template-columns:1fr 1fr; gap:8px;}
  @media(max-width:640px){ .rows.grid2{grid-template-columns:1fr;} }
  .row{display:flex; flex-wrap:wrap; align-items:center; gap:8px; background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-strip); padding:8px 12px; min-width:0;}
  .row.ok{border-color:var(--teal); background:color-mix(in oklab, var(--teal) 5%, var(--paper));}
  .row.no{border-color:var(--brick); background:color-mix(in oklab, var(--brick) 5%, var(--paper));}
  .play{flex:none; width:32px; height:32px; border-radius:50%; border:1.5px solid var(--sand-line); background:var(--paper); cursor:pointer; position:relative; padding:0;}
  .play::after{content:''; position:absolute; left:12px; top:9px; border-style:solid; border-width:6px 0 6px 10px; border-color:transparent transparent transparent var(--teal);}
  .play:hover{border-color:var(--teal);}
  .fld{font:400 .92rem 'Karla',sans-serif; color:var(--ink); background:var(--field); border:1.5px solid var(--sand-line); border-radius:6px; padding:5px 8px; min-height:34px; min-width:0;}
  .fld:focus, .fld.act{outline:none; border-color:var(--teal);}
  .fld.w{width:8rem;} .fld.n{width:3rem; text-align:center;} .fld.grow{flex:1 1 6rem;}
  select.fld{flex:1 1 10rem; max-width:100%;}
  .row label{display:flex; align-items:center; gap:6px; font-size:.84rem; color:var(--grey);}
  .sym{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.2rem; color:var(--ink);}
  .ipa{font-family:'Newsreader',Georgia,serif; font-size:1.1rem; color:var(--ink); min-width:5rem;}
  .word{min-width:5rem; font-size:.92rem;}
  .slash{color:var(--grey);}
  .vu{display:flex; align-items:center; gap:4px; flex-wrap:wrap;}
  .vu .k{font-size:.74rem; color:var(--grey); margin-right:2px;}
  .vu button{font-size:.74rem; padding:3px 9px; min-height:30px;}
  .score{font-weight:700; font-size:.9rem;} .score.all{color:var(--teal);} .score.some{color:var(--gold-deep);}
  a.ext{display:inline-block; background:var(--paper); border:1px solid var(--sand-line); border-radius:8px; padding:8px 14px; color:var(--ink); text-decoration:none; font-size:.9rem;}
  a.ext:hover{border-color:var(--teal);}
  .legend{display:flex; flex-wrap:wrap; gap:6px 14px; margin:10px 0 4px; font-size:.78rem; color:var(--grey);}
  .legend span{display:flex; align-items:center; gap:6px;} .legend i{width:9px; height:9px; border-radius:2px; display:inline-block;}
  .cblock{margin:12px 0 0;} .cblock p{margin:0 0 6px; font-size:.72rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--grey);}
  .cgrid{display:grid; gap:6px;}
  .cell{display:flex; flex-direction:column; align-items:center; gap:2px; background:var(--paper); border:2px solid; border-radius:6px; padding:6px 2px; cursor:pointer; min-width:0;}
  .cell b{font-family:'Newsreader',Georgia,serif; font-weight:400; font-size:1.2rem; line-height:1; color:var(--ink);}
  .cell small{font-size:.68rem; color:var(--grey); max-width:100%; overflow:hidden; text-overflow:ellipsis;}
  .keys{display:flex; flex-wrap:wrap; gap:4px; margin:10px 0 0;}
  .keys button{min-width:34px; min-height:36px; font:400 1rem 'Newsreader',Georgia,serif; color:var(--ink); background:var(--paper); border:1px solid var(--sand-line); border-radius:5px; padding:3px 6px; cursor:pointer;}
  .keys button:hover{border-color:var(--teal);}
  .keys .sep{width:1px; align-self:stretch; background:var(--sand-line); margin:0 4px;}
  @media print{ .play{display:none !important;} }
  .vbar .lite-voices{margin:0 0 8px;}
'''

SCRIPT = r'''
const $ = id => document.getElementById(id);
const revealCard = (q, a) => '<div class="reveal-card" onclick="this.classList.toggle(\'open\')"><div class="q">' + q + '</div><div class="hint">Click to reveal</div><div class="a">' + a + '</div></div>';

// ---------- match each term to its meaning (Connect's MatchTermsExercise) ----------
// Click a term, then its meaning, in either order. A right pair locks; a wrong pair flashes red and clears.
// The meanings run in reverse order, as on Connect.
function matchTerms(id, terms){
  const box = $(id), right = terms.map((_, i) => i).reverse(), matched = new Set();
  let selL = null, selR = null, bad = null;
  const cls = (i, sel, side) => 'pill' + (matched.has(i) ? ' matched' : bad && bad[side] === i ? ' wrong' : sel === i ? ' selected' : '');
  function draw(){
    box.innerHTML = '<div class="mhead"><b>Match each term to its meaning</b><span>' + matched.size + ' of ' + terms.length + ' matched</span></div>'
      + '<div class="pill-match-wrap"><div class="pill-col">' + terms.map((t, i) => '<button type="button" class="' + cls(i, selL, 0) + ' term" data-l="' + i + '">' + t[0] + '</button>').join('') + '</div>'
      + '<div class="pill-col">' + right.map(i => '<button type="button" class="' + cls(i, selR, 1) + '" data-r="' + i + '">' + terms[i][1] + '</button>').join('') + '</div></div>';
  }
  function tryMatch(){
    if (selL === null || selR === null) return;
    if (selL === selR) { matched.add(selL); selL = selR = null; }
    else { bad = [selL, selR]; setTimeout(() => { bad = null; selL = selR = null; draw(); }, 400); }
  }
  box.addEventListener('click', e => {
    if (bad) return;
    const l = e.target.closest('[data-l]'), r = e.target.closest('[data-r]');
    if (l && !matched.has(+l.dataset.l)) { selL = +l.dataset.l; tryMatch(); draw(); }
    if (r && !matched.has(+r.dataset.r)) { selR = +r.dataset.r; tryMatch(); draw(); }
  });
  draw();
}

// ---------- one scenario, a row of choices, feedback once picked (Connect's ChoiceScenarioCard) ----------
// The answer locks on the first pick, as on Connect.
function choices(id, list){
  const box = $(id);
  box.innerHTML = list.map((s, k) => '<div class="scen" data-k="' + k + '">' + (s.lane ? '<div class="lane-tag"><span class="chip">' + s.lane + '</span></div>' : '')
    + '<p class="t">' + s.text + '</p><div class="opts">' + s.choices.map((c, i) => '<button type="button" class="opt" data-v="' + i + '">' + c + '</button>').join('') + '</div><p class="why"></p></div>').join('');
  box.addEventListener('click', e => {
    const b = e.target.closest('.opt'); if (!b) return;
    const d = b.closest('.scen'); if (d.classList.contains('done')) return;
    const s = list[+d.dataset.k], v = +b.dataset.v, ok = v === s.correct;
    d.classList.add('done', ok ? 'right' : 'wrong');
    d.querySelectorAll('.opt').forEach(o => { o.disabled = true; const ov = +o.dataset.v; o.classList.add(ov === s.correct ? 'good' : ov === v ? 'bad' : 'dim'); });
    d.querySelector('.why').textContent = (ok ? '✓ ' : '✗ ') + s.feedback;
  });
}

// ---------- put the stages back in order (Connect's OrderExercise) ----------
// Clicking the right next stage locks it in, numbered; any other click does nothing.
function orderStages(id, correct, shuffled){
  const box = $(id), picked = [];
  function draw(){
    box.innerHTML = shuffled.map(l => { const i = picked.indexOf(l); return '<button type="button" class="order-line' + (i > -1 ? ' done' : '') + '" data-o="' + l + '"><span>' + l + '</span><span class="num">' + (i > -1 ? i + 1 : '?') + '</span></button>'; }).join('')
      + '<p class="status">' + (picked.length === correct.length ? 'All ' + correct.length + ' in order: that’s the staging.' : picked.length + ' of ' + correct.length + ' placed. Click the one that comes next.') + '</p>';
  }
  box.addEventListener('click', e => { const b = e.target.closest('[data-o]'); if (!b) return; const l = b.dataset.o; if (!picked.includes(l) && correct[picked.length] === l) { picked.push(l); draw(); } });
  draw();
}


// ---------- the voice: Lite's four house voices (../voices.js); the bar sits at the top ----------
// The chart is British, so an American voice gets a note, as on the long session.
LiteVoice.set({ britishChart: true });
function say(text){ LiteVoice.say(text); }
document.addEventListener('click', e => { const p = e.target.closest('[data-speak]'); if (p) say(p.dataset.speak); });
const play = (text, label) => '<button type="button" class="play" data-speak="' + text + '" aria-label="' + label + '" title="' + label + '"></button>';

// ---------- self-checking stages: Check marks each row, any edit clears the marks ----------
const STAGES = {};
function stage(key, n, okFn){ STAGES[key] = { n, ok: okFn, checked: false }; }
function mark(key){
  const s = STAGES[key], rows = document.querySelectorAll('#' + key + ' .row');
  let right = 0;
  rows.forEach((r, i) => { const ok = s.checked && s.ok(i); if (ok) right++; r.classList.toggle('ok', s.checked && ok); r.classList.toggle('no', s.checked && !ok); });
  const sc = $(key + 'Score');
  sc.textContent = s.checked ? right + ' / ' + s.n + ' correct' : '';
  sc.className = 'score ' + (right === s.n ? 'all' : 'some');
}
function clear(key){ if (STAGES[key].checked) { STAGES[key].checked = false; mark(key); } }
document.addEventListener('click', e => { const b = e.target.closest('[data-check]'); if (b) { STAGES[b.dataset.check].checked = true; mark(b.dataset.check); } });
['lead', 'obs', 'voi', 'scr', 'films'].forEach(k => { const box = $(k); box.addEventListener('input', () => clear(k)); box.addEventListener('change', () => clear(k)); });
const val = (key, i, f) => (document.querySelector('#' + key + ' [data-i="' + i + '"][data-f="' + f + '"]') || {}).value || '';

// ---------- 1. sounds vs letters ----------
const LEAD = [
  { word: 'letter', letters: 6, sounds: [4, 5] },
  { word: 'sound', letters: 5, sounds: [4] },
  { word: 'vowel', letters: 5, sounds: [4] },
  { word: 'consonant', letters: 9, sounds: [9] },
  { word: 'phoneme', letters: 7, sounds: [5] }
];
$('lead').innerHTML = LEAD.map((r, i) => '<div class="row">' + play(r.word, 'Play word ' + (i + 1))
  + '<input class="fld w" data-i="' + i + '" data-f="word" placeholder="the word" autocomplete="off" autocapitalize="off">'
  + '<label>letters <input class="fld n" data-i="' + i + '" data-f="letters" inputmode="numeric"></label>'
  + '<label>sounds <input class="fld n" data-i="' + i + '" data-f="sounds" inputmode="numeric"></label></div>').join('');
stage('lead', LEAD.length, i => { const r = LEAD[i]; return val('lead', i, 'word').trim().toLowerCase() === r.word && Number(val('lead', i, 'letters')) === r.letters && r.sounds.includes(Number(val('lead', i, 'sounds'))); });

// ---------- 2. terminology ----------
matchTerms('match', [
  ['Vowels', 'are formed by modifying the airflow’s passage through the mouth, principally with the tongue and lips'],
  ['Diphthongs', 'are a glide from one vowel to another'],
  ['Monophthongs', 'are single vowels'],
  ['Consonants', 'are formed when the airflow from the lungs is obstructed by the moveable parts of the mouth, including the tongue and the lips'],
  ['Voiced consonants', 'are formed by activating the vocal cords'],
  ['Unvoiced consonants', 'do not require the activation of the vocal cords']
]);

// ---------- 3. obstruction ----------
const PLACES = ['where?', 'the lips', 'lower lip + top teeth', 'tongue tip + ridge behind the teeth', 'tongue tip near the ridge (not touching)', 'back of the tongue + soft palate'];
const OBS = [
  { sound: 'b', word: 'ban', answer: 1 }, { sound: 'm', word: 'man', answer: 1 }, { sound: 'v', word: 'van', answer: 2 }, { sound: 'n', word: 'nan', answer: 3 },
  { sound: 't', word: 'tan', answer: 3 }, { sound: 'r', word: 'ran', answer: 4 }, { sound: 'k', word: 'can', answer: 5 }, { sound: 'p', word: 'pan', answer: 1 }
];
$('obs').innerHTML = OBS.map((o, i) => '<div class="row"><span class="sym">/' + o.sound + '/</span>' + play(o.word, 'Play the word ' + o.word)
  + '<select class="fld" data-i="' + i + '" data-f="p" aria-label="Where is the obstruction for /' + o.sound + '/">' + PLACES.map((p, j) => '<option value="' + j + '">' + p + '</option>').join('') + '</select></div>').join('');
stage('obs', OBS.length, i => Number(val('obs', i, 'p')) === OBS[i].answer);

// ---------- 4. voicing ----------
const VOICING = [
  { ipa: '/met/', word: 'met', first: 'v', last: 'u' }, { ipa: '/dek/', word: 'deck', first: 'v', last: 'u' },
  { ipa: '/ðen/', word: 'then', first: 'v', last: 'v' }, { ipa: '/hedʒ/', word: 'hedge', first: 'u', last: 'v' },
  { ipa: '/breθ/', word: 'breath', first: 'v', last: 'u' }, { ipa: '/fetʃ/', word: 'fetch', first: 'u', last: 'u' },
  { ipa: '/nekst/', word: 'next', first: 'v', last: 'u' }, { ipa: '/jet/', word: 'yet', first: 'v', last: 'u' }
];
const VU = VOICING.map(() => ({ first: '', last: '' }));
function vuButtons(i, which){ return '<span class="vu"><span class="k">' + which + '</span>' + ['v', 'u'].map(v => '<button type="button" data-vu="' + i + ':' + which + ':' + v + '" class="' + (VU[i][which] === v ? 'on' : '') + '">' + (v === 'v' ? 'voiced' : 'unvoiced') + '</button>').join('') + '</span>'; }
$('voi').innerHTML = VOICING.map((r, i) => '<div class="row"><span class="ipa">' + r.ipa + '</span>' + play(r.word, 'Play ' + r.word)
  + '<input class="fld w" data-i="' + i + '" data-f="word" placeholder="spelling" autocomplete="off" autocapitalize="off">'
  + '<span id="vu' + i + '" class="vu">' + vuButtons(i, 'first') + vuButtons(i, 'last') + '</span></div>').join('');
$('voi').addEventListener('click', e => {
  const b = e.target.closest('[data-vu]'); if (!b) return;
  const [i, which, v] = b.dataset.vu.split(':'); VU[+i][which] = v;
  $('vu' + i).innerHTML = vuButtons(+i, 'first') + vuButtons(+i, 'last'); clear('voi');
});
stage('voi', VOICING.length, i => { const r = VOICING[i]; return val('voi', i, 'word').trim().toLowerCase() === r.word && VU[i].first === r.first && VU[i].last === r.last; });

// ---------- 5. the chart: each sound in its word ----------
const T = 'var(--c-teal)', G = 'var(--c-gold)', R = 'var(--c-red)', W = 'var(--c-warm)', M = 'var(--c-muted)';
const VOWELS = [['iː','see',T],['ɪ','his',G],['ʊ','put',G],['uː','too',T],['e','ten',G],['ə','ago',G],['ɜː','her',T],['ɔː','saw',T],['æ','hat',G],['ʌ','but',G],['ɑː','car',T],['ɒ','hot',G]];
const DIPHTHONGS = [['ɪə','ear',R],['eɪ','say',R],null,['ʊə','pure',R],['ɔɪ','boy',R],['əʊ','so',R],['eə','air',R],['aɪ','buy',R],['aʊ','now',R]];
const CONSONANTS = [['p','pen',M],['b','book',W],['t','tea',M],['d','day',W],['tʃ','chair',M],['dʒ','jam',W],['k','key',M],['g','go',W],
  ['f','four',M],['v','very',W],['θ','thin',M],['ð','that',W],['s','sun',M],['z','zoo',W],['ʃ','she',M],['ʒ','vision',W],
  ['m','man',W],['n','no',W],['ŋ','sing',W],['h','hat',M],['l','look',W],['r','red',W],['w','want',W],['j','yes',W]];
const block = (title, cells, cols) => '<div class="cblock"><p>' + title + '</p><div class="cgrid" style="grid-template-columns:repeat(' + cols + ',minmax(0,1fr))">'
  + cells.map(c => c ? '<button type="button" class="cell" style="border-color:' + c[2] + '" data-cell="' + c[0] + '|' + c[1] + '"><b>' + c[0] + '</b><small>' + c[1] + '</small></button>' : '<span aria-hidden="true"></span>').join('') + '</div></div>';
$('chart').innerHTML = block('Vowels', VOWELS, 4) + block('Diphthongs', DIPHTHONGS, 3) + block('Consonants', CONSONANTS, 8);
$('chart').addEventListener('click', e => { const c = e.target.closest('[data-cell]'); if (!c) return; say(c.dataset.cell.split('|')[1]); });

// ---------- 6. phonemic script ----------
const KEYS = 'ɪ e æ ʌ ɒ ʊ ə iː ɑː ɔː uː ɜː | eɪ aɪ ɔɪ əʊ aʊ ɪə eə ʊə | θ ð ʃ ʒ tʃ dʒ ŋ j'.split(' ');
const SCRIPT_WORDS = [['sent','sent'],['edge','edʒ'],['thin','θɪn'],['thing','θɪŋ'],['think','θɪŋk'],['this','ðɪs'],['fixed','fɪkst'],['jest','dʒest'],['yelled','jeld'],['stretched','stretʃt']];
// typed IPA is forgiving about the things a keyboard makes hard, and nothing else
const normIPA = v => v.trim().replace(/[/\s]/g, '').replace(/ʤ/g, 'dʒ').replace(/ʧ/g, 'tʃ').replace(/:/g, 'ː').replace(/ɡ/g, 'g');
let active = 0;
$('keys').innerHTML = KEYS.map(k => k === '|' ? '<span class="sep"></span>' : '<button type="button" data-key="' + k + '">' + k + '</button>').join('');
$('scr').innerHTML = SCRIPT_WORDS.map((r, i) => '<div class="row"><span class="word">' + r[0] + '</span><span class="slash">/</span><input class="fld grow ipa-in' + (i === 0 ? ' act' : '') + '" data-i="' + i + '" data-f="ipa" placeholder="the sounds, not the letters" autocomplete="off" autocapitalize="off" spellcheck="false"><span class="slash">/</span></div>').join('');
$('scr').addEventListener('focusin', e => { const f = e.target.closest('.ipa-in'); if (!f) return; active = +f.dataset.i; document.querySelectorAll('#scr .ipa-in').forEach(x => x.classList.toggle('act', x === f)); });
$('keys').addEventListener('click', e => { const k = e.target.closest('[data-key]'); if (!k) return; const f = document.querySelector('#scr [data-i="' + active + '"]'); f.value += k.dataset.key; clear('scr'); });
stage('scr', SCRIPT_WORDS.length, i => normIPA(val('scr', i, 'ipa')) === SCRIPT_WORDS[i][1]);
$('scrKey').innerHTML = revealCard('Reveal the answers', SCRIPT_WORDS.map(s => s[0] + ' /' + s[1] + '/').join('  ·  '));

// ---------- 7. film titles ----------
const FILMS = [['/bætmæn/','batman'],['/kɪŋ kɒŋ/','king kong'],['/eəpleɪn/','airplane'],['/dʒɔːz/','jaws'],['/ðə bɜːdz/','the birds'],['/saɪkəʊ/','psycho'],['/ʃɪkɑːgəʊ/','chicago'],['/dɒktə ʒɪvɑːgəʊ/','doctor zhivago']];
$('films').innerHTML = FILMS.map((f, i) => '<div class="row"><span class="ipa">' + f[0] + '</span><input class="fld grow" data-i="' + i + '" data-f="t" placeholder="the title" autocomplete="off" autocapitalize="off"></div>').join('');
stage('films', FILMS.length, i => val('films', i, 't').trim().toLowerCase().replace(/^the\s+/, '') === FILMS[i][1].replace(/^the\s+/, ''));
$('filmKey').innerHTML = revealCard('Reveal the titles', FILMS.map(f => f[0] + ': ' + f[1]).join('  ·  '));
'''
