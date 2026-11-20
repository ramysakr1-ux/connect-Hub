# Connect's 45-minute "Lesson planning, start to finish, in one input session" (src/app/input-sessions/sessions/lesson-planning.tsx),
# on Lite's desk. Content word for word, American spelling, and the trainee's plan is the "lesson plan" as Lite calls it.
# The question cards, the jargon match (abbreviations and terminology, in batches), its answer key, the staging example,
# the front page, problems and procedure drafts and the closing cards work as on Connect. The draft is split into its
# three agenda stages (aims, problems, procedure); on Connect it is one two-column block.
TITLE = 'Lesson planning, start to finish, in one input session'
LONG = 'writing-the-lesson-plan'
SUB = ('Warm up on why a lesson plan exists and who reads it, clear the jargon, then draft the real thing on the real TP2 point. '
       'Everything a trainee needs for this session lives on this one page.')
NAV = [('s1', '1 · Why plan?'), ('s2', '2 · Jargon match'), ('s3', '3 · Your TP2 point'), ('s4', '4 · Aims'),
       ('s5', '5 · Problems and solutions'), ('s6', '6 · Procedure'), ('s7', '7 · What comes after')]

NOTES = '''<h4>Running this session</h4>
<p>Open with the two discussion cards: elicit from the room before clicking to reveal. Move fast through the jargon match; the answer key unlocks once every item is matched. The remaining thirty-five minutes is real drafting on each trainee's own TP2 point, not a worksheet about one.</p>
<h4>The jargon match</h4>
<p>Don't let anyone get stuck rewriting the jargon match by hand: the point is speed and shared vocabulary, not memorization. The real work is the last thirty-five minutes; keep the room moving there.</p>
<h4>The point is real, but this draft isn't saved</h4>
<p>Starting from the point they will actually teach makes the drafting real, but this page doesn't carry into their lesson plan on Lite, and it keeps nothing once it is closed. They copy what they draft into their Lesson plan page before they leave.</p>
<h4>Language analysis is deliberately absent</h4>
<p>TP2's point supplies the target language already. This session is about aims, problems and procedure: the parts a trainee builds themselves regardless of framework.</p>
<h4>The draft isn't the submission</h4>
<p>Copied into the Lesson plan page, not turned in. Tomorrow's supervised lesson planning slot is where it gets finished: today's forty-five minutes just removes the blank page.</p>'''

BODY = r'''
  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="stage-title">Warm-up: why plan? <span class="badge">5 minutes</span></div>
      <p class="sl">Lead-in · 2 minutes</p>
      <p class="lead">Quick show of hands: has anyone here ever taught, or tried to teach, without writing anything down first? How did it go?</p>
      <p class="sl">Open with these two questions</p>
      <div class="two-col" id="questions"></div>
    </div>
  </section>

  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">Now, the jargon <span class="badge">5 minutes</span></div>
      <p class="lead">A lesson plan is only clear to someone else if it uses shared terms correctly. Click a term, then its meaning.</p>
      <div class="cats"><span class="btn-row" id="cats"></span><span class="count" id="matchCount"></span></div>
      <div id="match"></div>
      <div class="batchnav"><button class="btn" type="button" id="prev">Previous</button><span class="small" id="batchLbl"></span><button class="btn primary" type="button" id="next">Next</button></div>

      <div class="btn-row"><button class="btn" type="button" id="keyOpen" disabled>Reveal answer key: save or print to keep</button></div>
      <div class="answer-key" id="key" hidden>
        <div class="keyhead"><span class="keytitle" id="keyTitle">All matched: handout · answer key, to keep</span><span class="keybtns"><button class="btn" type="button" id="keyHide">Hide</button><button class="btn" type="button" onclick="window.print()">Print</button></span></div>
        <div class="two-col">
          <div class="box" id="boxAbbr"><h3>Abbreviations</h3><table class="grid"><tbody id="keyAbbr"></tbody></table></div>
          <div class="box" id="boxTerms"><h3>Terminology</h3><table class="grid"><tbody id="keyTerms"></tbody></table></div>
        </div>
      </div>

      <div class="btn-row"><button class="btn" type="button" id="exBtn">See staging example</button></div>
      <div class="example" id="ex" hidden>
        <h3>Example: a completed procedure section</h3>
        <table class="grid stk"><thead><tr><th>Stage</th><th>Interaction</th><th>Time</th><th>Procedure</th></tr></thead><tbody id="exRows"></tbody></table>
        <p class="small">This is one stage written in full: this is the standard your one modeled stage should meet by minute 40.</p>
      </div>
    </div>
  </section>

  <section id="s3" data-n="3">
    <div class="card" data-n="3">
      <div class="stage-title">Your TP2 point <span class="badge">5 minutes</span></div>
      <p class="sl">TP2 · three points per teaching group, however many groups the cohort needs</p>
      <p class="lead">A shared input session, not a per-group one. Each group runs ABC on Thursday and DEF on Friday from its own three points, at its own level and coursebook. The cards below are stand-ins to show the shape only: every trainee opens their own real point.</p>
      <div id="groups"></div>
    </div>
  </section>

  <section id="s4" data-n="4">
    <div class="card" data-n="4">
      <div class="stage-title">Aims <span class="badge">5 minutes</span></div>
      <p class="sl">The top of the plan: the same boxes as your Lesson plan page</p>
      <p class="hint">This page does not keep what you type. Copy your draft into your Lesson plan page before you close it.</p>
      <div id="aims"></div>
    </div>
  </section>

  <section id="s5" data-n="5">
    <div class="card" data-n="5">
      <div class="stage-title">Anticipated Problems &amp; Solutions <span class="badge">7 minutes</span></div>
      <p class="hint">Think classroom management, not language: that's tomorrow's session.</p>
      <div id="probs"></div>
    </div>
  </section>

  <section id="s6" data-n="6">
    <div class="card" data-n="6">
      <div class="stage-title">Procedure: stages come from your lesson shape <span class="badge">13 minutes</span></div>
      <div class="prochead"><p class="hint">On your Lesson plan page, choosing a lesson shape names the stages, and Start from your TP point brings in what your TP point holds. Here the stage names are set: you write the interaction, timing and procedure.</p><span class="fw">Stage names set</span></div>
      <div class="proc">
        <div class="prow phead"><span>Stage</span><span>Interaction</span><span>Time</span><span>Procedure</span></div>
        <div id="stages"></div>
      </div>
      <p class="small">By minute 40 every trainee has stage names in, timings estimated, and one stage's procedure written in full as a model for the rest.</p>
    </div>
  </section>

  <section id="s7" data-n="7">
    <div class="card" data-n="7">
      <div class="stage-title">What comes after <span class="badge">5 minutes</span></div>
      <p class="lead">Two more questions before they leave: elicit first, then reveal.</p>
      <div class="two-col" id="after"></div>
    </div>
  </section>
'''

STYLE = r'''
  .sl{font-weight:700; font-size:.9rem; margin:14px 0 6px; color:var(--ink);}
  .sl:first-of-type{margin-top:0;}
  .hint{font-style:italic; font-size:.86rem; color:var(--grey); margin:0 0 8px; line-height:1.5;}
  .small{font-size:.86rem; color:var(--grey); margin:10px 0 0; line-height:1.5;}
  .count{font-weight:700; color:var(--teal); white-space:nowrap; font-size:.88rem;}
  .two-col .reveal-card{margin:0;}
  .reveal-card .q.big{font-family:'Newsreader',Georgia,serif; font-size:1.1rem; line-height:1.35;}
  .reveal-card .a ul{margin:0; padding-left:18px;} .reveal-card .a li{margin:3px 0;}
  .reveal-card .a .ans{font-style:normal; font-weight:600; font-size:1.3rem; display:block;}
  .reveal-card .a .note{font:400 .86rem/1.5 'Karla',sans-serif; color:var(--grey); display:block; margin-top:4px;}
  .cats{display:flex; align-items:center; justify-content:space-between; gap:8px 14px; flex-wrap:wrap;}
  .cats .btn-row{margin-top:0;}
  #cats .btn.on{background:var(--teal); color:var(--paper);}
  button.pill{text-align:left; font-family:'Karla',sans-serif; width:100%;}
  button.pill.term{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1rem;}
  button.pill.matched{cursor:default;}
  .batchnav{display:flex; align-items:center; justify-content:space-between; gap:10px;}
  .batchnav .small{margin:0;}
  .box{background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 16px; margin:10px 0 0;}
  .box h3, .example h3{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.08rem; margin:0 0 6px; color:var(--ink);}
  .answer-key{margin-top:14px;}
  .keyhead{display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;}
  .keytitle{font-size:10px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:var(--grey);}
  .keybtns{display:flex; gap:8px;}
  #keyOpen:disabled{opacity:.62; cursor:default;}
  .answer-key td.t{font-family:'Newsreader',Georgia,serif; font-weight:600; white-space:nowrap;}
  .example{margin-top:12px;}
  td.st{font-weight:700; font-size:.78rem; letter-spacing:.06em; white-space:nowrap;}
  .groups{display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin:6px 0 14px;}
  @media(max-width:700px){ .groups{grid-template-columns:1fr;} }
  .glbl{font-weight:600; font-size:.86rem; color:var(--grey); margin:12px 0 0;}
  .point{background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 14px;}
  .point .who{font-size:10px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--grey);}
  .point h3{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.1rem; line-height:1.25; margin:6px 0;}
  .point p{margin:0; font-size:.86rem; color:var(--grey); line-height:1.5;}
  .field{margin:0 0 12px;}
  .field b{display:block; font-size:.9rem;}
  .field .hint{margin:2px 0 0;}
  .field .write-area{margin-top:4px;}
  .prob{border-bottom:1px dashed var(--sand-line); padding:0 0 10px; margin:0 0 10px;}
  .prob:last-child{border-bottom:0;}
  .prob .write-area{margin-top:6px;} .prob .write-area.sol{margin-left:14px; width:calc(100% - 14px);}
  .prochead{display:flex; justify-content:space-between; align-items:flex-start; gap:10px; flex-wrap:wrap;}
  .fw{display:inline-flex; align-items:center; min-height:34px; padding:0 14px; border:1px solid var(--sand-line); border-radius:var(--r-control); background:var(--box); font-size:.86rem; font-weight:600;}
  .proc{border:1.5px solid var(--sand-line); border-radius:var(--r-strip); overflow:hidden; background:var(--paper); margin-top:8px;}
  .prow{display:grid; grid-template-columns:168px 110px 70px 1fr; gap:8px; align-items:start; padding:10px; border-top:1px solid var(--row-line);}
  .prow.phead{border-top:0; background:var(--box); font-size:10px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--grey); padding:8px 10px;}
  .prow .stg{background:var(--box); border:1px solid var(--sand-line); border-radius:6px; padding:7px 9px; font-size:.84rem; font-weight:700;}
  .prow .write-area{margin:0; padding:7px 9px; font-size:.86rem;}
  .prow input.write-area[data-s$=":t"]{text-align:center;}
  @media(max-width:700px){
    .prow{grid-template-columns:1fr 80px;} .prow.phead{display:none;}
    .prow .stg, .prow textarea{grid-column:1 / -1;}
  }
  @media(max-width:560px){
    table.stk, table.stk tbody, table.stk tr, table.stk td{display:block; width:100%;}
    table.stk thead{display:none;}
    table.stk tr{border:1px solid var(--sand-line); background:var(--paper); padding:6px 10px; margin:0 0 6px;}
    table.stk td{border:0; padding:2px 0;}
  }
  @media print{ .answer-key, .example, .batchnav, .cats{display:none !important;} }
  /* 21 Nov 2026: "Print the handout" printed only the batch on the screen (6 of the 20 abbreviations, or 5 of the 13 terms, and never both sets), with any matched meaning in a heavier weight. On paper the task now prints whole and as it does untouched: both sets, batch by batch, each batch's meanings in the same order as on the screen (.matchp, drawn in the script below, never on the screen). */
  .matchp{display:none;}
  @media print{
    #match{display:none !important;}
    .matchp{display:block;}
    .matchp .sl{margin:12px 0 0;}
    .matchp .pill-match-wrap{break-inside:avoid;}
    .matchp .pill{background:none; border:1px solid #999; color:#000; cursor:default;}
    .matchp .pill.term{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1rem;}
  }
'''

SCRIPT = r'''
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

// ---------- 1. Why plan? ----------
const QUESTION_CARDS = [
  ['Why do we need a lesson plan at all?', ['To know your lesson aims', 'To keep the timing honest', 'To know the stages of the lesson you’re teaching', 'To anticipate problems and solutions', 'To look prepared', 'Because on the CELTA course, you have to 🙂']],
  ['Who are you actually writing it for?', ['On the course, you’re writing it for your tutor and for the Cambridge assessor.', 'Outside the course, you’re writing it for whoever covers your class if you can’t make it in.']]
];
$('questions').innerHTML = QUESTION_CARDS.map(q => '<div class="reveal-card" onclick="this.classList.toggle(\'open\')"><div class="q big">' + esc(q[0]) + '</div><div class="a"><ul>' + q[1].map(a => '<li>' + esc(a) + '</li>').join('') + '</ul></div></div>').join('');

// ---------- 2. Jargon match: two sets, in batches; a term then its meaning (either order) ----------
const ABBR = [
  ['OHP', 'Overhead projector'], ['H/O', 'Handout'], ['SS', 'Student(s)'], ['T', 'Teacher'], ['P/W', 'Pair work'], ['G/W', 'Group work'],
  ['CB/SB', 'Coursebook / student’s book'], ['W/B', 'Whiteboard / workbook'], ['H/W', 'Homework'], ['TTT', 'Teacher talking time'],
  ['STT', 'Student talking time'], ['S / L / R / W', 'Speaking / listening / reading / writing'], ['W/C', 'Whole class'], ['O/C', 'Open class'],
  ['F/B', 'Feedback'], ['Realia', 'Using the real thing, e.g. the real table or chair'], ['ICQ', 'Instruction concept question'],
  ['CCQ', 'Concept checking question'], ['M/F/P', 'Meaning, form, pronunciation'], ['TL', 'Target language']
];
const TERMS = [
  ['Eliciting', 'Asking Ss questions to draw information out of them and keep them involved.'],
  ['Nominating', 'The T asks an individual Ss to answer, rather than the whole class.'],
  ['Modeling', 'The T says a word or sentence a few times so Ss hear the correct pronunciation before repeating it.'],
  ['Choral drilling', 'The T asks the whole class to repeat a word or sentence together.'],
  ['Open pairs', 'Ss talk to each other across the room as a demo, usually for question and answer.'],
  ['Closed pairs', 'Ss practice language sitting together.'],
  ['Monitoring', 'The T listens to Ss talking during pair or group work.'],
  ['Target language', 'The language the T is focusing on in a lesson.'],
  ['A mingling activity', 'Ss practice while walking around the room.'],
  ['Functional language', 'What we do with language: requesting, advising, suggesting, and so on.'],
  ['Language grading', 'The T simplifies their own language so Ss can understand.'],
  ['Skills work', 'Practicing or developing one or more of the four skills.'],
  ['Student-centered activity', 'An activity where Ss do most of the work, usually a lot of pair or group work.']
];
const chunk = (a, n) => { const o = []; for (let i = 0; i < a.length; i += n) o.push(a.slice(i, i + n)); return o; };
const SETS = { abbr: [ABBR, chunk(ABBR, 6)], terms: [TERMS, chunk(TERMS, 5)] };
let cat = 'abbr', batch = 0, selL = null, selR = null, shake = null;
const matched = new Set();
function cls(i, sel){ return matched.has(cat + ':' + batch + ':' + i) ? ' matched' : sel === i ? (shake ? ' wrong' : ' selected') : ''; }
function drawMatch(){
  const pairs = SETS[cat][1][batch], right = pairs.map((_, i) => i).reverse();
  $('cats').innerHTML = '<button type="button" class="btn' + (cat === 'abbr' ? ' on' : '') + '" data-cat="abbr">Abbreviations (' + ABBR.length + ')</button>'
    + '<button type="button" class="btn' + (cat === 'terms' ? ' on' : '') + '" data-cat="terms">Terminology (' + TERMS.length + ')</button>';
  $('matchCount').textContent = [...matched].filter(k => k.startsWith(cat + ':')).length + ' of ' + SETS[cat][0].length + ' matched';
  $('match').innerHTML = '<div class="pill-match-wrap"><div class="pill-col">'
    + pairs.map((p, i) => '<button type="button" class="pill term' + cls(i, selL) + '" data-l="' + i + '">' + esc(p[0]) + '</button>').join('')
    + '</div><div class="pill-col">'
    + right.map(i => '<button type="button" class="pill' + cls(i, selR) + '" data-r="' + i + '">' + esc(pairs[i][1]) + '</button>').join('')
    + '</div></div>';
  $('batchLbl').textContent = 'Batch ' + (batch + 1) + ' of ' + SETS[cat][1].length;
  drawKey();
}
// The key for a set unlocks once every item in that set is matched (its running note says so); until then the button
// says how many are left. It shows the key of each set that is finished.
const left = c => SETS[c][0].length - [...matched].filter(k => k.startsWith(c + ':')).length;
const NAMES = { abbr: ['abbreviation', 'abbreviations'], terms: ['term', 'terms'] };
function drawKey(){
  const n = left(cat), b = $('keyOpen');
  b.disabled = n > 0;
  b.textContent = n > 0 ? 'Answer key: match the last ' + (n === 1 ? NAMES[cat][0] : n + ' ' + NAMES[cat][1]) + ' to unlock it'
                        : 'Reveal answer key: save or print to keep';
  $('boxAbbr').hidden = left('abbr') > 0; $('boxTerms').hidden = left('terms') > 0;
  if (n > 0 && !$('key').hidden && $('boxAbbr').hidden && $('boxTerms').hidden) $('key').hidden = true;
  if (!$('key').hidden) b.hidden = true; else b.hidden = false;
}
function tryMatch(){
  if (selL === null || selR === null) return;
  if (selL === selR) { matched.add(cat + ':' + batch + ':' + selL); selL = selR = null; drawKey(); }
  else { shake = true; setTimeout(() => { selL = selR = null; shake = null; drawMatch(); }, 400); }
}
$('match').addEventListener('click', e => {
  if (shake) return;
  const l = e.target.closest('[data-l]'), r = e.target.closest('[data-r]'), k = i => matched.has(cat + ':' + batch + ':' + i);
  if (l && !k(+l.dataset.l)) { selL = +l.dataset.l; tryMatch(); drawMatch(); }
  if (r && !k(+r.dataset.r)) { selR = +r.dataset.r; tryMatch(); drawMatch(); }
});
$('cats').addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (!b || shake) return; cat = b.dataset.cat; batch = 0; selL = selR = null; drawMatch(); });
$('prev').onclick = () => { if (shake) return; batch = Math.max(0, batch - 1); selL = selR = null; drawMatch(); };
$('next').onclick = () => { if (shake) return; batch = Math.min(SETS[cat][1].length - 1, batch + 1); selL = selR = null; drawMatch(); };
drawMatch();
// 21 Nov 2026: for the paper only (see the print rule in the style above). The screen shows one batch of one set at a time, so the handout printed only that batch; this prints every batch of both sets, each with its meanings in the same order as its buttons. They are not buttons and carry no data-l or data-r, so nothing here can be clicked or matched.
$('match').insertAdjacentHTML('afterend', '<div class="matchp" id="matchPaper">' + [['abbr', 'Abbreviations'], ['terms', 'Terminology']].map(s => '<p class="sl">' + s[1] + '</p>' + SETS[s[0]][1].map(pairs => '<div class="pill-match-wrap"><div class="pill-col">' + pairs.map(p => '<div class="pill term">' + esc(p[0]) + '</div>').join('') + '</div><div class="pill-col">' + pairs.slice().reverse().map(p => '<div class="pill">' + esc(p[1]) + '</div>').join('') + '</div></div>').join('')).join('') + '</div>');

// the answer key and the staging example
$('keyAbbr').innerHTML = ABBR.map(r => '<tr><td class="t">' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td></tr>').join('');
$('keyTerms').innerHTML = TERMS.map(r => '<tr><td class="t">' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td></tr>').join('');
$('keyOpen').onclick = () => { if (left(cat) > 0) return; $('key').hidden = false; drawKey(); };
$('keyHide').onclick = () => { $('key').hidden = true; drawKey(); };
const EXAMPLE_ROWS = [
  ['LEAD IN', 'T-Ss', '3′', 'T shows two photos of phones and asks “Which is more expensive?” to set up comparatives.'],
  ['PRESENTATION', 'T-Ss, W/B', '10′', 'T models target sentences, checks meaning with CCQs, drills, boards form.'],
  ['FREER PRACTICE', 'P/W', '8′', 'Ss compare their hometown and this city in open pairs, T monitors, feedback at the end.']
];
$('exRows').innerHTML = EXAMPLE_ROWS.map(r => '<tr><td class="st">' + r[0] + '</td><td>' + esc(r[1]) + '</td><td>' + r[2] + '</td><td>' + esc(r[3]) + '</td></tr>').join('');
$('exBtn').onclick = () => { $('ex').hidden = !$('ex').hidden; $('exBtn').textContent = $('ex').hidden ? 'See staging example' : 'Hide staging example'; };

// ---------- 3. Your TP2 point ----------
const GROUPS = [
  ['Group 1 · illustrative only, not this cohort’s book or level', [
    ['Trainees A / D', 'Function', 'Making and responding to invitations', 'Sample coursebook · Unit 2B, ex. 1–5 + audio 2.2'],
    ['Trainees B / E', 'Grammar', 'Comparative adjectives', 'Sample coursebook · Unit 2A, ex. 2–6'],
    ['Trainees C / F', 'Productive', 'Speaking: describing a place you know well', 'Sample coursebook · Unit 2C, ex. 1–3']]],
  ['Group 2 · illustrative only, not this cohort’s book or level', [
    ['Trainees A / D', 'Lexis', 'Vocabulary: clothes and shopping', 'Sample coursebook · Unit 2B, ex. 1–4'],
    ['Trainees B / E', 'Grammar', 'Present continuous for future arrangements', 'Sample coursebook · Unit 2A, ex. 2–5'],
    ['Trainees C / F', 'Receptive', 'Listening: booking a hotel room', 'Sample coursebook · Unit 2C, audio 2.3 + ex. 1–3']]]
];
$('groups').innerHTML = GROUPS.map(g => '<p class="glbl">' + esc(g[0]) + '</p><div class="groups">'
  + g[1].map(p => '<div class="point"><span class="who">' + esc(p[0]) + ' · ' + esc(p[1]) + '</span><h3>' + esc(p[2]) + '</h3><p>' + esc(p[3]) + '</p></div>').join('') + '</div>').join('');

// ---------- 4. Aims ----------
const AIM_FIELDS = [
  ['Main Aims', 'What the learners will be able to do by the end.', 3, '• By the end of the lesson, Ss will be better able to…'],
  ['Subsidiary Aims', 'What else the lesson develops along the way.', 2, '• By the end of the lesson, Ss will have practiced…'],
  ['Personal Aims', 'Take these from the action points in your last feedback.', 2, '• Think classroom management: what do you want to work on?'],
  ['Class Profile', 'Who you are teaching: two or three lines is enough.', 3, 'Number, level range, ages, anything that shapes today’s lesson.']
];
$('aims').innerHTML = AIM_FIELDS.map(f => '<div class="field"><b>' + esc(f[0]) + '</b><p class="hint">' + esc(f[1]) + '</p><textarea class="write-area" rows="' + f[2] + '" placeholder="' + esc(f[3]) + '" aria-label="' + esc(f[0]) + '"></textarea></div>').join('');

// ---------- 5. Problems and solutions ----------
$('probs').innerHTML = [0, 1].map(() => '<div class="prob"><input type="text" class="write-area" placeholder="A problem with the materials or task." aria-label="A problem">'
  + '<input type="text" class="write-area sol" placeholder="What you will do about it." aria-label="What you will do about it"></div>').join('');

// ---------- 6. Procedure ----------
const STAGE_ROWS = [
  ['LEAD IN', 'One line: how you open the lesson.'],
  ['PRESENTATION', 'One line: how meaning and form get clarified.'],
  ['FREER PRACTICE', 'One line: what learners do with it.']
];
$('stages').innerHTML = STAGE_ROWS.map((r, i) => '<div class="prow"><div class="stg">' + r[0] + '</div>'
  + '<input type="text" class="write-area" data-s="' + i + ':i" placeholder="interaction" aria-label="Interaction">'
  + '<input type="text" class="write-area" data-s="' + i + ':t" placeholder="min" aria-label="Minutes">'
  + '<textarea class="write-area" rows="2" data-s="' + i + ':p" placeholder="' + esc(r[1]) + '" aria-label="Procedure"></textarea></div>').join('');

// ---------- 7. What comes after ----------
const AFTER_CARDS = [
  ['What do you do after writing your lesson plan and teaching the lesson?', 'Self-evaluation', 'On Lite, your Self-evaluation page: you write it and turn it in before you read your tutor’s feedback, and turning it in opens the feedback.'],
  ['What do you do while observing your classmates teach?', 'Peer observation', 'On Lite, the peer observation sheets on your Observation tasks page: your notes during their TP, for the feedback. They save as you go and are not turned in.']
];
$('after').innerHTML = AFTER_CARDS.map(c => '<div class="reveal-card" onclick="this.classList.toggle(\'open\')"><div class="q big">' + esc(c[0]) + '</div><div class="a"><span class="ans">' + esc(c[1]) + '</span><span class="note">' + esc(c[2]) + '</span></div></div>').join('');
'''
