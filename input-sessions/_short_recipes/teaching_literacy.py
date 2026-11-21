# Connect's 45-minute "Teaching literacy" (src/app/input-sessions/sessions/teaching-literacy.tsx), on Lite's desk.
# Content word for word, American spelling; the concept cards, the spot-the-barrier scenarios, the adapt-the-handout
# choice and the technique rows work as they do on Connect.
TITLE = 'Teaching literacy: when the barrier isn’t the language'
LONG = 'teaching-literacy'
SUB = ('Some learners can’t yet read or write fluently in ANY script, including their own. This session is about noticing that, and adapting, '
       'not about ESOL methodology in general, which the rest of this course already covers.')
NAV = [('s1', '1 · Lead-in'), ('s2', '2 · What literacy covers'), ('s3', '3 · Spot the barrier'), ('s4', '4 · Adapt the handout'),
       ('s5', '5 · Techniques'), ('s6', '6 · Wrap-up')]

NOTES = '''<h4>Running this session</h4>
<p>One shared screen: project it, or have trainees open it on their own devices for the individual activities. These trainer notes show only on a tutor’s link.</p>
<h4>Framing this session</h4>
<p>Most trainees will never teach a fully pre-literate class on this course: the point isn't to make them experts, it's to make them notice the possibility before they misread silence as low ability or disengagement.</p>
<h4>"Spot the barrier": there's no trick answer</h4>
<p>Scenario 3 (can't hold a pen correctly) is deliberately the one most likely to be misjudged as babyish or irrelevant: it's a real signal in adult pre-literacy classes and worth a beat of discussion.</p>
<h4>"Adapt the handout": push past "make it simpler"</h4>
<p>The wrong-but-tempting answer is usually the version that's just shorter text: still assumes fluent decoding. The right answer relies on images/realia doing the work language can't yet.</p>
<h4>Techniques: there's genuine disagreement here</h4>
<p>Don't present the notes as the only right sequencing: some centers introduce letter names before letter sounds, or vice versa. Use disagreement in the room as the discussion, not a wrong-answer moment.</p>
<h4>Time is tight: protect the wrap-up</h4>
<p>45 minutes is short for this much ground. If the handout activity runs long, cut to two of the three techniques cards rather than skipping the wrap-up question: that question is the actual takeaway.</p>'''

BODY = r'''
  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="stage-title">Lead-in <span class="badge">3 minutes</span></div>
      <p class="lead">Look at the line below for two seconds, then look away. What did it say?</p>
      <div class="script-line" lang="mn-Mong">ᠮᠣᠩᠭᠣᠯ ᠬᠡᠯᠡ ᠰᠤᠷᠬᠤ</div>
      <p class="quiet">Most people can’t hold or reproduce a script they’ve never learned to decode. That’s the position some of your learners are in with the Latin alphabet, even after weeks in your class.</p>
    </div>
  </section>

  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">What “literacy” covers here <span class="badge">10 minutes</span></div>
      <p class="lead">Click each to reveal what it actually looks like in the room.</p>
      <div id="concepts"></div>
    </div>
  </section>

  <section id="s3" data-n="3">
    <div class="card" data-n="3">
      <div class="stage-title">Spot the pre-literacy barrier <span class="badge">7 minutes</span></div>
      <p class="lead">Each of these is a real moment from a beginner class. Decide: does this need a literacy adaptation, or is it a normal beginner-level language gap? Click to check.</p>
      <div id="scens"></div>
    </div>
  </section>

  <section id="s4" data-n="4">
    <div class="card" data-n="4">
      <div class="stage-title">Adapt the handout <span class="badge">8 minutes</span></div>
      <p class="lead">This handout is written for a fluent reader. Pick the version you’d actually give a pre-literate beginner group.</p>
      <p class="count" id="hCount"></p>
      <div class="text-block"><span class="tb-l">Original handout</span><p id="hOrig"></p></div>
      <div id="hOpts"></div>
      <div class="btn-row"><button class="btn" id="hNext" type="button" hidden>Next handout</button></div>
    </div>
  </section>

  <section id="s5" data-n="5">
    <div class="card" data-n="5">
      <div class="stage-title">Techniques for a pre-literate class <span class="badge">12 minutes</span></div>
      <p class="lead">In pairs, look at each technique below and agree: would you use this in week one, or only once basic letter recognition is established? Click to compare with the note.</p>
      <div id="techs"></div>
    </div>
  </section>

  <section id="s6" data-n="6">
    <div class="card" data-n="6">
      <div class="stage-title">Wrap-up <span class="badge">5 minutes</span></div>
      <p class="lead">In one sentence each: what’s one thing you’d check about a new learner’s literacy before assuming their silence in a reading task is a language problem?</p>
    </div>
  </section>
'''

STYLE = r'''
  .quiet{font-size:.88rem; color:var(--grey); margin:8px 0 0;}
  .script-line{background:var(--box); border-radius:var(--r-strip); padding:12px 16px; text-align:center; font-size:1.6rem; letter-spacing:.04em; color:var(--ink); margin-top:4px;}
  .scen{background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 16px; margin:8px 0;}
  .scen.good{border-color:var(--teal); background:color-mix(in oklab, var(--teal) 6%, var(--paper));}
  .scen.bad{border-color:var(--a-red); background:color-mix(in oklab, var(--a-red) 5%, var(--paper));}
  .scen > p{margin:0; font-size:.92rem; line-height:1.55;}
  .chips{display:flex; flex-wrap:wrap; gap:8px; margin-top:10px;}
  .opt{font:700 .82rem 'Karla',sans-serif; padding:6px 14px; border:1.5px solid var(--sand-line); background:var(--field); color:var(--ink); cursor:pointer; min-height:34px;}
  .opt:hover{border-color:var(--gold);}
  .scen .why{margin:8px 0 0; font-size:.88rem; line-height:1.5;}
  .scen.good .why{color:var(--teal);} .scen.bad .why{color:var(--a-red);}
  .count{font-size:.8rem; font-weight:700; color:var(--grey); margin:0;}
  .tb-l{display:block; font-size:.8rem; font-weight:700; color:var(--grey); margin-bottom:4px;}
  .text-block p{margin:0;}
  .hopt{display:block; width:100%; text-align:left; background:var(--paper); border:1.5px solid var(--sand-line); padding:11px 14px; margin:8px 0; cursor:pointer; font:400 .92rem/1.55 'Karla',sans-serif; color:var(--ink);}
  .hopt:hover{border-color:var(--gold);}
  .hopt.good{border-color:var(--teal); background:color-mix(in oklab, var(--teal) 6%, var(--paper));}
  .hopt.bad{border-color:var(--a-red); background:color-mix(in oklab, var(--a-red) 5%, var(--paper));}
  .hopt .note{display:block; margin-top:6px; font-size:.88rem;}
  .hopt.good .note{color:var(--teal);} .hopt.bad .note{color:var(--a-red);}
  .trow{display:grid; grid-template-columns:1fr 1.3fr; gap:12px; align-items:center; width:100%; text-align:left; background:var(--paper); border:1.5px solid var(--sand-line); padding:10px 14px; margin:6px 0; cursor:pointer; font:600 .88rem/1.5 'Karla',sans-serif; color:var(--ink);}
  .trow:hover{border-color:var(--gold);}
  .trow .tn{font-weight:600; font-size:.76rem; color:var(--grey);}
  .trow.open{border-color:var(--teal); background:color-mix(in oklab, var(--teal) 6%, var(--paper));}
  .trow.open .tn{font-weight:400; font-size:.88rem; color:var(--teal);}
  @media(max-width:560px){ .trow{grid-template-columns:1fr; gap:4px;} }
  /* 21 Nov 2026: an answered task printed solved on the handout: a moment in part 3 with its teal or red edge and fill and without its two options; the version picked in part 4 with its tick or cross and its explanation; an opened technique in part 5 with "Week one" or "Once basic decoding is established" and the note. And part 4 printed only the handout that was on the screen. On paper each now prints as it did untouched: .chips.paper is the two options of an answered moment and .h-paper is both handouts whole, both for the paper only (see the script). */
  .chips.paper, .h-paper{display:none;}
  @media print{
    .scen.good, .scen.bad{border-color:var(--sand-line); background:var(--paper);} .chips.paper{display:flex;}
    #s4 .card > .count, #s4 .card > .text-block, #hOpts{display:none !important;} .h-paper{display:block;}
    .h-paper .hset{break-inside:avoid; margin:0 0 12px;} .h-paper .hopt{cursor:default; background:none; border:1px solid #999; color:#000;} #s4 > .card{break-inside:auto;}
    .trow, .trow.open{grid-template-columns:1fr; border-color:var(--sand-line); background:var(--paper);} .trow .tn{display:none !important;}
  }
'''

SCRIPT = r'''
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

// ---------- 2. What literacy covers ----------
const CONCEPTS = [
  ['Non-literate vs. non-fluent', 'A learner may speak conversational English well but have never learned to read or write any language, including their own: literacy and oral fluency develop independently.'],
  ['Different script vs. no script', 'Someone literate in Arabic, Mandarin, or Amharic script is transferring existing decoding skill to a new alphabet. Someone with no prior literacy is building decoding itself for the first time.'],
  ['Pen-and-paper motor skill', 'Holding a pen, writing left to right, forming letter shapes: these are learned physical skills, not given. Some adult beginners are doing this for the first time in your class.'],
  ['Print concepts', 'Which way is up on a page, that print (not the picture) carries the meaning, that spaces separate words: none of this is obvious without prior exposure.'],
  ['Where this shows up on this course', 'Mostly relevant for community/ESOL-style teaching contexts, less so exam-prep or academic groups. It rarely applies to a whole class, usually one or two learners within an otherwise literate group.']
];
$('concepts').innerHTML = CONCEPTS.map((c, i) => '<div class="reveal-card" onclick="this.classList.toggle(\'open\')"><div class="q">' + String(i + 1).padStart(2, '0') + ' · ' + esc(c[0]) + '</div><div class="a">' + esc(c[1]) + '</div></div>').join('');

// ---------- 3. Spot the barrier: the first pick locks, as on Connect ----------
const CH = ['Literacy barrier', 'Normal language gap'];
const SCENARIOS = [
  ['A learner consistently writes letters as mirror images or upside down, well past the point classmates have stopped.', CH, 0, 'Literacy barrier: likely still building basic letter-formation and orientation, not a language-level issue.'],
  ['A learner asks you to repeat a word slower and mispronounces the /θ/ sound in “think” as /s/.', CH, 1, 'Normal language gap: a pronunciation/phonology issue any beginner might have, unrelated to literacy.'],
  ['A learner grips the pen awkwardly, writes very slowly, and seems to copy letter-by-letter rather than word-by-word.', CH, 0, 'Literacy barrier: the motor and visual-processing skills behind fluent writing haven’t developed yet.'],
  ['Given a matching worksheet with printed words and pictures, a learner can’t find where to start or which direction to read in.', CH, 0, 'Literacy barrier: this is a print-concepts gap (direction, layout), not vocabulary or grammar.']
];
function scenCards(host, list){
  const st = list.map(() => null);
  function draw(){
    host.innerHTML = list.map((s, i) => {
      const p = st[i], cls = p === null ? '' : p === s[2] ? ' good' : ' bad';
      const inner = p === null ? '<div class="chips">' + s[1].map((c, j) => '<button type="button" class="opt" data-s="' + i + ':' + j + '">' + esc(c) + '</button>').join('') + '</div>'
        : '<p class="why">' + (p === s[2] ? '✓ ' : '✗ ') + esc(s[3]) + '</p>'
          // 21 Nov 2026: the two options stay in an answered moment for the paper only (.chips.paper, never on the screen, no data-s so nothing can be picked again), so "Print the handout" prints it as the task it was.
          + '<div class="chips paper">' + s[1].map(c => '<button type="button" class="opt">' + esc(c) + '</button>').join('') + '</div>';
      return '<div class="scen' + cls + '"><p>' + esc(s[0]) + '</p>' + inner + '</div>';
    }).join('');
  }
  host.addEventListener('click', e => { const b = e.target.closest('[data-s]'); if (!b) return; const [i, j] = b.dataset.s.split(':'); st[+i] = +j; draw(); });
  draw();
}
scenCards($('scens'), SCENARIOS);

// ---------- 4. Adapt the handout: a pick can change; Next appears once one is picked ----------
const ADAPT_ORIGINAL = [
  'Complete the form below. Write your full name, date of birth, and address in the boxes provided. Sign at the bottom once finished.',
  'Read the instructions carefully, then underline the correct word in each sentence and check your answers with a partner.'
];
const ADAPT_OPTIONS = [
  [
    ['Shortened version: “Write your name, birthday, and address. Sign at the bottom.”', false, 'Still assumes fluent reading and writing of connected text: shorter isn’t the same as accessible to a non-reader.'],
    ['One box at a time, each labeled with a matching picture icon (a person for name, a calendar for date of birth), teacher demonstrates each step live before learners attempt it.', true, 'Breaks the task into pieces small enough to model, and uses images to carry meaning the print alone can’t yet.'],
    ['Same form, but read aloud to the class first.', false, 'Helps comprehension of what’s being asked, but doesn’t solve the actual barrier: still requires writing fluently into the boxes unaided.']
  ],
  [
    ['Same worksheet, with extra time given.', false, 'Extra time helps a slow-but-capable reader, not someone who can’t yet decode the sentence at all.'],
    ['Replace “underline the correct word” with matching a picture to one of two spoken/repeated words, no independent reading required.', true, 'Removes the reading step entirely and checks the same language point through listening and image matching instead.'],
    ['Pair the learner with a stronger reader to do the worksheet together.', false, 'Common but risky as a default: it can mean the stronger learner does all the actual reading while the other watches, learning nothing about print themselves.']
  ]
];
let hIdx = 0, hChoice = null;
function drawHandout(){
  $('hCount').textContent = 'Handout ' + (hIdx + 1) + ' of ' + ADAPT_OPTIONS.length;
  $('hOrig').textContent = ADAPT_ORIGINAL[hIdx];
  $('hOpts').innerHTML = ADAPT_OPTIONS[hIdx].map((o, i) => {
    const on = hChoice === i;
    return '<button type="button" class="hopt' + (on ? (o[1] ? ' good' : ' bad') : '') + '" data-h="' + i + '">' + esc(o[0]) + (on ? '<span class="note">' + (o[1] ? '✓ ' : '✗ ') + esc(o[2]) + '</span>' : '') + '</button>';
  }).join('');
  $('hNext').hidden = !(hChoice !== null && hIdx < ADAPT_OPTIONS.length - 1);
}
$('hOpts').addEventListener('click', e => { const b = e.target.closest('[data-h]'); if (!b) return; hChoice = +b.dataset.h; drawHandout(); });
$('hNext').onclick = () => { hIdx++; hChoice = null; drawHandout(); };
drawHandout();
// 21 Nov 2026: both handouts whole, for the paper only (the screen shows one at a time, and printed whichever it was on, with the version picked marked). No buttons, so nothing here can be clicked.
(function(){ const P = document.createElement('div'); P.className = 'h-paper'; P.id = 'hPaper';
  P.innerHTML = ADAPT_OPTIONS.map((opts, h) => '<div class="hset"><p class="count">Handout ' + (h + 1) + ' of ' + ADAPT_OPTIONS.length + '</p>'
    + '<div class="text-block"><span class="tb-l">Original handout</span><p>' + esc(ADAPT_ORIGINAL[h]) + '</p></div>'
    + opts.map(o => '<div class="hopt">' + esc(o[0]) + '</div>').join('') + '</div>').join('');
  $('hOpts').after(P); })();

// ---------- 5. Techniques: week one, or once decoding is established ----------
const TECHNIQUES = [
  ['Language Experience Approach (learner dictates, teacher writes)', true, 'connects spoken words the learner already has to their written form, no prior print skill assumed.'],
  ['Phonics / letter-sound drilling', true, 'foundational, usually starts immediately alongside oral work.'],
  ['Independent silent reading of a short text', false, 'asking for this too early just produces guessing or copying.'],
  ['Realia and picture-based vocabulary matching (no text)', true, 'carries meaning without requiring any reading at all.'],
  ['Cloze/gap-fill worksheets', false, 'filling a gap requires reading the surrounding text.']
];
$('techs').innerHTML = TECHNIQUES.map((t, i) => '<button type="button" class="trow" data-t="' + i + '"><span>' + esc(t[0]) + '</span><span class="tn">Click to reveal</span></button>').join('');
$('techs').addEventListener('click', e => {
  const b = e.target.closest('[data-t]'); if (!b) return;
  const t = TECHNIQUES[+b.dataset.t], open = b.classList.toggle('open');
  b.querySelector('.tn').textContent = open ? (t[1] ? 'Week one. ' : 'Once basic decoding is established. ') + t[2] : 'Click to reveal';
});
'''
