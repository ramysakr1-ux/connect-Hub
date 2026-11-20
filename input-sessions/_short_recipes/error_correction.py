# Connect's 45-minute "Facilitating self & peer correction of oral errors" (src/app/input-sessions/sessions/error-correction.tsx),
# on Lite's desk. Content word for word, American spelling; the film, the two order exercises and the practice rows
# (choose a technique, reveal a suggestion) work as they do on Connect.
TITLE = 'Facilitating self &amp; peer correction of oral errors'
LONG = 'error-correction'
SUB = ('Not whether to correct, but how to get the learner, or the person next to them, to do it. Two sequences to put in order, '
       'twelve techniques, then five real errors to choose a technique for.')
NAV = [('s1', '1 · Video lead-in'), ('s2', '2 · Decision flow'), ('s3', '3 · Correction sequence'),
       ('s4', '4 · Twelve techniques'), ('s5', '5 · Five errors'), ('s6', '6 · Wrap-up')]

NOTES = '''<h4>Running this session</h4>
<p>Trainees work in pairs throughout. The two ordering exercises are the thinking; the practice is the doing: every error is said out loud to a partner playing the learner before anyone reveals a suggestion.</p>
<h4>0–6 · Video, then one question</h4>
<p>Play the clip once. Ask only: "Who did the correcting?" The answer (the learner, then a peer, and the teacher last) is the whole session in one sentence.</p>
<h4>6–14 · Decision flow</h4>
<p>Pairs work it out, then check. Most put "technique" too early. The order matters because technique depends on who and when: say that when they check.</p>
<h4>14–24 · Correction sequence</h4>
<p>Eight steps is a lot; the point is the gaps: steps 2 and 4 are the waiting. Ask how long they actually waited in their last TP before jumping in. Usually under two seconds.</p>
<h4>24–30 · Techniques, briefly</h4>
<p>Read the list aloud fast, demonstrating three or four (finger correction, echo, one-word question). Do not explain all twelve; the practice does that.</p>
<h4>30–42 · Practice out loud</h4>
<p>The choice is for their own record; the real task is saying it to a partner who plays the learner. Two minutes per error, then reveal. Insist on the learner self-correcting before the teacher gives anything.</p>
<h4>42–45 · Close</h4>
<p>Two techniques each, named. These go in tomorrow's plan under Anticipated problems: that is the transfer.</p>'''

BODY = r'''
  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="stage-title">Video lead-in <span class="badge">6 minutes</span></div>
      <p class="lead">Watch once, then one question: <b>who did the correcting?</b></p>
      <div class="film closed" data-src="https://www.youtube-nocookie.com/embed/nsGY5-tjsFU" data-title="Session video"><button type="button" class="btn teal film-btn">Click for video</button></div>
      <p class="film-link">If the frame stays black, <a href="https://youtu.be/nsGY5-tjsFU" target="_blank" rel="noopener">watch it on YouTube</a>.</p>
    </div>
  </section>

  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">Decision flow: put the steps in order <span class="badge">8 minutes</span></div>
      <div id="flow"></div>
    </div>
  </section>

  <section id="s3" data-n="3">
    <div class="card" data-n="3">
      <div class="stage-title">Correction sequence: put the steps in order <span class="badge">10 minutes</span></div>
      <div id="seq"></div>
    </div>
  </section>

  <section id="s4" data-n="4">
    <div class="card" data-n="4">
      <div class="stage-title">How to correct: twelve techniques <span class="badge">6 minutes</span></div>
      <p class="lead">Read them fast. The practice below is where they get used.</p>
      <ol class="tech" id="tech"></ol>
    </div>
  </section>

  <section id="s5" data-n="5">
    <div class="card" data-n="5">
      <div class="stage-title">Practice: choose a technique <span class="badge">12 minutes</span></div>
      <p class="lead">For each error, pick the technique you would use, <b>try it on your partner out loud</b>, then reveal a suggestion. The suggestion is one answer, not the answer.</p>
      <div id="practice"></div>
    </div>
  </section>

  <section id="s6" data-n="6">
    <div class="card" data-n="6">
      <div class="stage-title">Wrap-up <span class="badge">3 minutes</span></div>
      <p class="lead">Which two techniques will you try in your next TP, and which one error type from your own learners will you try them on? Say it to your partner; write it in your plan tonight.</p>
    </div>
  </section>
'''

STYLE = r'''
  .ox{display:flex; flex-direction:column; margin-top:10px;}
  .ox .order-line{justify-content:flex-start; width:100%; text-align:left; font-family:'Karla',sans-serif; color:var(--ink);}
  .ox .order-line .num{flex:none; min-width:24px; height:24px; border-radius:50%; background:var(--box); color:var(--grey); display:inline-flex; align-items:center; justify-content:center; font-size:.78rem;}
  .ox .order-line.done{border-color:var(--teal); background:color-mix(in oklab, var(--teal) 7%, var(--paper)); cursor:default;}
  .ox .order-line.done .num{background:var(--teal); color:var(--paper);}
  .ostat{font-size:.86rem; color:var(--grey); margin:4px 0 0;}
  .ointro{font-size:.95rem; color:#3b3a37; margin:0 0 6px;}
  .tech{list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:6px;}
  .tech li{display:flex; gap:12px; align-items:flex-start; background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-control); padding:9px 14px; font-size:.9rem; line-height:1.5;}
  .tech .n{flex:none; width:22px; height:22px; border-radius:50%; background:var(--box); color:var(--grey); font-size:.74rem; font-weight:700; display:inline-flex; align-items:center; justify-content:center; margin-top:1px;}
  .prow{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 16px; margin:0 0 10px;}
  .prow .utt{font:600 1.2rem/1.35 'Newsreader',Georgia,serif; color:var(--ink); margin:0 0 8px;}
  .prow select.blank{width:100%; max-width:340px;}
  .prow .reveal-card{margin:10px 0 0;}
  @media print{ .prow select{display:none;} }
  /* 21 Nov 2026: an answered task printed solved: the ordered steps printed their numbers, their fill and "All 5 in order". On paper each prints as it did untouched: a blank circle to number in, no count. */
  @media print{ .ostat{display:none !important;} .ox .order-line.done{border-color:#999 !important; background:none !important;} .ox .order-line .num{display:none !important;} .ox .order-line::before{content:""; flex:none; width:22px; height:22px; border:1px solid #999; border-radius:50%;} }
'''

SCRIPT = r'''
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

const DECISION_FLOW = ['Decide on the type of error', 'Will you deal with it or not?', 'When will you deal with it?', 'Who will deal with it?', 'Decide on technique to use'];
// the design's own starting scramble, kept so the exercise opens the same way
const DECISION_FLOW_SHUFFLED = ['When will you deal with it?', 'Decide on technique to use', 'Decide on the type of error', 'Who will deal with it?', 'Will you deal with it or not?'];
const CORRECTION_SEQUENCE = [
  'Indicate to the student that an error has been made.', 'Give the student a chance to identify the error.', 'Teacher identifies the error for the student.',
  'Give the student time to self-correct.', 'Teacher models the correct version.', 'Student repeats the correct version.',
  'Drill for pronunciation and correct use.', 'Give a mini practice.'];
const CORRECTION_SEQUENCE_SHUFFLED = [
  'Give the student time to self-correct.', 'Indicate to the student that an error has been made.', 'Student repeats the correct version.',
  'Give a mini practice.', 'Give the student a chance to identify the error.', 'Teacher models the correct version.',
  'Teacher identifies the error for the student.', 'Drill for pronunciation and correct use.'];
const TECHNIQUES = [
  ['Facial expression', 'quizzical look, raised eyebrows.'],
  ['Gesture & facial expression', 'a quizzical look plus a hand movement to ‘hold’ the sentence, showing it needs attention.'],
  ['Finger correction', 'rebuild the sentence and use a finger to indicate the missing word.'],
  ['Repeat leading up to the error', '“They went…?” with questioning intonation.'],
  ['Echo with different intonation', 'draw attention to the problem.'],
  ['Ask a question', '“Did you go yesterday?” to establish which tense the learner meant.'],
  ['One-word question', '“Tense?” “Preposition?”'],
  ['Timelines', 'especially useful for tenses.'],
  ['Write it on the board', 'for whole-class discussion, if it’s a common issue.'],
  ['Exploit the funny side', '“You cooked kitchen in the chicken? I’ve never eaten kitchen before!”'],
  ['Phonemic chart', 'draw attention to a sound problem.'],
  ['Tell them', 'sometimes, just give the correct form.']
];
const PRACTICE = [
  ['He like this school.', 'Finger correction, or a one-word question (“Verb?”): subject-verb agreement.'],
  ['Where you did go yesterday?', 'Repeat leading up to the error with questioning intonation, or write it on the board: word order.'],
  ['I eat schocolate every day.', 'Phonemic chart, or echo with different intonation: pronunciation.'],
  ['I am here since Tuesday.', 'Timelines, or a one-word question (“Tense?”): wrong tense.'],
  ['Give me one butterbread!', 'Tell them, or exploit the funny side: wrong collocation.']
];

// ---------- 2 and 3. Put the steps in order (Connect's OrderExercise) ----------
// Only the right next step locks in, numbered; any other click does nothing.
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
orderEx($('flow'), DECISION_FLOW, DECISION_FLOW_SHUFFLED, 'Five decisions, and they only work in one order. Click each one in the order you would make it.');
orderEx($('seq'), CORRECTION_SEQUENCE, CORRECTION_SEQUENCE_SHUFFLED, 'What actually happens, moment to moment, once you have decided to correct.');

// ---------- 4. Twelve techniques ----------
$('tech').innerHTML = TECHNIQUES.map((t, i) => '<li><span class="n">' + (i + 1) + '</span><span><b>' + esc(t[0]) + '</b>: ' + esc(t[1]) + '</span></li>').join('');

// ---------- 5. Practice: choose a technique, then reveal a suggestion ----------
$('practice').innerHTML = PRACTICE.map(p => '<div class="prow"><p class="utt">“' + esc(p[0]) + '”</p>'
  + '<select class="blank" aria-label="Choose a technique"><option value="">Choose a technique…</option>' + TECHNIQUES.map(t => '<option>' + esc(t[0]) + '</option>').join('') + '</select>'
  + '<div class="reveal-card" onclick="this.classList.toggle(\'open\')"><div class="q">Suggested technique</div><div class="a">' + esc(p[1]) + '</div></div></div>').join('');

// ---------- 1. The film: nothing loads from YouTube until it is asked for; Hide takes it out again ----------
document.querySelectorAll('.film[data-src]').forEach(f => {
  const btn = f.querySelector('.film-btn'); if (!btn) return;
  function close(){ f.innerHTML = ''; f.classList.add('closed'); f.appendChild(btn); const a = f.parentNode.querySelector('.film-acts'); if (a) a.remove(); }
  btn.addEventListener('click', () => {
    f.classList.remove('closed'); f.innerHTML = '';
    const i = document.createElement('iframe'); i.src = f.dataset.src + '?autoplay=1'; i.title = f.dataset.title || 'Film';
    i.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'; i.referrerPolicy = 'strict-origin-when-cross-origin'; i.allowFullscreen = true; f.appendChild(i);
    const acts = document.createElement('p'); acts.className = 'film-acts';
    const c = document.createElement('button'); c.type = 'button'; c.className = 'btn'; c.textContent = 'Hide the video'; c.addEventListener('click', close);
    acts.appendChild(c); f.parentNode.insertBefore(acts, f.nextSibling);
  });
});
'''
