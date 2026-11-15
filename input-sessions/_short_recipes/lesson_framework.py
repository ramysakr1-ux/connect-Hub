# Connect's 45-minute "Lesson framework: finding your shape" (src/app/input-sessions/sessions/lesson-framework.tsx),
# on Lite's desk. Content word for word, American spelling; the decision tree, the six shapes (their stages as a
# numbered list where Connect joins them with arrows), the card sort, the sequence builder, "name that framework" and
# the stage timer work as on Connect.
TITLE = 'Lesson framework: finding your shape'
LONG = 'lesson-framework'
SUB = ('A map of the six lesson shapes trainees will meet across the course, and the one question that decides between them: '
       'is the main aim language or skills?')
NAV = [('s1', '1 · Lead-in'), ('s2', '2 · The decision tree'), ('s3', '3 · The six shapes'), ('s4', '4 · Card sort'),
       ('s5', '5 · Build the sequence'), ('s6', '6 · Name that framework'), ('s7', '7 · Stage timer')]

NOTES = '''<h4>Running this session</h4>
<p>This is deliberately an overview, not a deep dive: each shape gets its own full loop input elsewhere. Treat this as the map trainees return to before choosing a framework for their own TP.</p>
<h4>This is a map, not a rulebook</h4>
<p>Some real lessons blend two shapes: flag that a text-based lesson's language-focus stage can itself run as guided discovery.</p>
<h4>"Useful language" isn't target language</h4>
<p>In Productive Skills lessons, this trips people up constantly: it's optional support for the task, not something to formally present and drill.</p>'''

BODY = r'''
  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="stage-title">Lead-in <span class="badge">2 minutes</span></div>
      <p class="lead">Quick show of hands: when you plan a lesson, what's the first decision you make, the language point, the skill, or the activity?</p>
    </div>
  </section>

  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">The one question that decides your shape <span class="badge">5 minutes</span></div>
      <div class="tree">
        <p class="root">Is the main aim language or skills?</p>
        <div class="branches">
          <div class="branch">
            <p class="bl teal">Language</p>
            <p class="bq">Does the target language arise from a text?</p>
            <div class="leaves"><span class="leaf teal">No: PPP / TTT</span><span class="leaf teal">Yes: Text-Based</span></div>
            <span class="leaf grey wide">Practice only: Language Practice</span>
          </div>
          <div class="branch">
            <p class="bl red">Skills</p>
            <p class="bq">Is it listening or reading?</p>
            <div class="leaves"><span class="leaf red">Yes: Receptive Skills</span><span class="leaf grey">No: Productive Skills</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="s3" data-n="3">
    <div class="card" data-n="3">
      <div class="stage-title">The six shapes, stage by stage <span class="badge">5 minutes</span></div>
      <p class="lead">Study these for a couple of minutes before the card sort below: you'll need them.</p>
      <div class="shapes" id="shapes"></div>
    </div>
  </section>

  <section id="s4" data-n="4">
    <div class="card" data-n="4">
      <div class="stage-title">Card sort: pin each stage to its shape <span class="badge">10 minutes</span></div>
      <p class="lead">Click a stage, then the shape you think it belongs to. <span class="count" id="sortCount"></span></p>
      <div class="chips" id="sortCards"></div>
      <div class="zones" id="zones"></div>
    </div>
  </section>

  <section id="s5" data-n="5">
    <div class="card" data-n="5">
      <div class="stage-title">Build the sequence: pick a shape <span class="badge">8 minutes</span></div>
      <p class="lead"><span class="count" id="seqStatus"></span></p>
      <div class="chips" id="seqFws"></div>
      <div class="chips" id="seqChips"></div>
      <div class="slots" id="seqSlots"></div>
    </div>
  </section>

  <section id="s6" data-n="6">
    <div class="card" data-n="6">
      <div class="stage-title">Name that framework <span class="badge">8 minutes</span></div>
      <p class="lead"><span class="count" id="nameCount"></span></p>
      <div id="scens"></div>
    </div>
  </section>

  <section id="s7" data-n="7">
    <div class="card" data-n="7">
      <div class="stage-title">Stage timer: pacing challenge <span class="badge">5 minutes</span></div>
      <p class="lead">You have 45 minutes for a Text-Based lesson. Budget the minutes across the three stages below: the total should land close to 45.</p>
      <div id="pacing"></div>
      <p class="total" id="total"></p>
      <div class="box">
        <p class="bq2">If your Lead-in &amp; Text Reading stage runs 5 minutes over, which stage do you trim without destroying the lesson aim?</p>
        <button class="btn" type="button" id="trimBtn">Reveal the answer</button>
        <div class="model" id="trim" hidden>Trim <b>Controlled Practice &amp; Feedback</b>, not Clarification. Clarification (meaning, form, pronunciation) is where the actual learning happens: cutting it short undermines the lesson aim. Practice can run one activity instead of two, or feedback can be briefer, without losing the core teaching point.</div>
      </div>
    </div>
  </section>
'''

STYLE = r'''
  .count{font-weight:700; color:var(--teal);}
  .box{background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 16px; margin:10px 0 0;}
  .model{margin:10px 0 0; padding:4px 0 4px 12px; border-left:4px solid var(--teal); font-size:.9rem; line-height:1.55;}
  .model[hidden]{display:none;}
  .bq2{margin:0 0 8px; font-weight:600; font-size:.92rem; line-height:1.5;}
  .tree{background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-strip); padding:18px; display:flex; flex-direction:column; align-items:center;}
  .tree .root{margin:0; padding:10px 18px; border:1.5px solid var(--sand-line); border-radius:var(--r-control); background:var(--box); font:600 1.15rem/1.3 'Newsreader',Georgia,serif; text-align:center;}
  .tree .root::after{content:''; display:block;}
  .branches{display:grid; grid-template-columns:1fr 1fr; gap:24px; width:100%; margin-top:18px; position:relative;}
  .branches::before{content:''; position:absolute; top:-18px; left:50%; width:1.5px; height:18px; background:var(--sand-line);}
  .branch{display:flex; flex-direction:column; align-items:center; gap:8px;}
  .bl{margin:0; font-size:10px; font-weight:700; letter-spacing:.14em; text-transform:uppercase;}
  .bl.teal{color:var(--teal);} .bl.red{color:var(--a-red);}
  .bq{margin:0; font-size:.88rem; color:var(--grey); text-align:center;}
  .leaves{display:flex; gap:8px; width:100%;}
  .leaf{flex:1; border:1px solid var(--sand-line); border-radius:var(--r-control); padding:8px; text-align:center; font-size:.86rem; font-weight:700;}
  .leaf.wide{width:100%;}
  .leaf.teal{color:var(--teal); background:color-mix(in oklab, var(--teal) 7%, var(--paper)); border-color:color-mix(in oklab, var(--teal) 30%, var(--paper));}
  .leaf.red{color:var(--a-red); background:color-mix(in oklab, var(--a-red) 6%, var(--paper)); border-color:color-mix(in oklab, var(--a-red) 30%, var(--paper));}
  .leaf.grey{color:var(--grey); background:var(--box);}
  @media(max-width:640px){ .branches{grid-template-columns:1fr; gap:18px;} }
  .shapes{display:grid; grid-template-columns:repeat(3,1fr); gap:10px;}
  @media(max-width:760px){ .shapes{grid-template-columns:1fr 1fr;} }
  @media(max-width:480px){ .shapes{grid-template-columns:1fr;} }
  .shape{background:var(--paper); border:1.5px solid var(--sand-line); border-top:3px solid var(--teal); border-radius:var(--r-strip); padding:12px 14px;}
  .shape.grey{border-top-color:var(--grey);} .shape.red{border-top-color:var(--a-red);} .shape.gold{border-top-color:oklch(63% 0.096 72);}
  .shape h3{margin:0 0 6px; font:600 1.05rem 'Newsreader',Georgia,serif;}
  .shape ol{margin:0; padding-left:20px; font-size:.84rem; line-height:1.5; color:var(--grey);}
  .chips{display:flex; flex-wrap:wrap; gap:8px; margin:0 0 12px;}
  .chip-b{background:var(--paper); border:1.5px solid var(--sand-line); padding:8px 13px; font:700 .86rem/1.35 'Karla',sans-serif; color:var(--ink); cursor:pointer; text-align:left; min-height:40px;}
  .chip-b:hover:not(:disabled){border-color:var(--gold);}
  .chip-b.sel{border-color:var(--teal); background:color-mix(in oklab, var(--teal) 8%, var(--paper));}
  .chip-b:disabled{opacity:.25; cursor:default;}
  .chip-b.fw{border-radius:999px !important;}
  .chip-b.fw.on{border-color:var(--teal); color:var(--teal); background:color-mix(in oklab, var(--teal) 10%, var(--paper));}
  .zones{display:grid; grid-template-columns:repeat(3,1fr); gap:10px;}
  @media(max-width:640px){ .zones{grid-template-columns:1fr 1fr;} }
  .zone{min-height:74px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:5px; border:1.5px dashed var(--sand-line); background:var(--box); padding:10px; cursor:pointer; font:inherit; color:var(--ink);}
  .zone b{font:600 .98rem 'Newsreader',Georgia,serif;}
  .zone span{font-size:.76rem; font-weight:700; color:var(--teal); text-align:center;}
  .zone.filled{border-color:var(--teal); background:color-mix(in oklab, var(--teal) 8%, var(--paper));}
  .slots{display:flex; flex-direction:column; gap:6px; min-height:40px;}
  .slot{display:flex; align-items:center; gap:10px; background:var(--paper); border:1.5px solid var(--sand-line); padding:8px 12px; text-align:left; font:700 .88rem 'Karla',sans-serif; color:var(--ink); cursor:pointer;}
  .slot .n{width:20px; height:20px; border-radius:50%; flex:none; display:inline-flex; align-items:center; justify-content:center; font-size:.72rem; background:var(--box); color:var(--grey);}
  .slot.good{border-color:var(--teal); background:color-mix(in oklab, var(--teal) 8%, var(--paper));} .slot.good .n{background:var(--teal); color:#fff;}
  .slot.bad{border-color:var(--a-red); background:color-mix(in oklab, var(--a-red) 7%, var(--paper));} .slot.bad .n{background:var(--a-red); color:#fff;}
  .scen{background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 16px; margin:0 0 10px;}
  .scen p{margin:0 0 10px; font-size:.92rem; line-height:1.55;}
  .optrow{display:flex; flex-wrap:wrap; gap:6px; align-items:center;}
  .opt{background:var(--field); border:1.5px solid var(--sand-line); border-radius:999px !important; padding:6px 13px; font:700 .84rem/1.3 'Karla',sans-serif; color:var(--ink); cursor:pointer; min-height:36px;}
  .opt:hover{border-color:var(--gold);}
  .opt.good{border-color:var(--teal); background:color-mix(in oklab, var(--teal) 10%, var(--paper)); color:var(--teal);}
  .fb{font-weight:700; font-size:.84rem; color:var(--teal);}
  .prow{display:flex; align-items:center; justify-content:space-between; gap:12px; background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-control); padding:9px 14px; margin:0 0 8px; font-weight:600; font-size:.9rem;}
  .prow label{display:flex; align-items:center; gap:6px; color:var(--grey); font-weight:400; flex:none;}
  .prow input{width:64px; text-align:center; border:1.5px solid var(--sand-line); border-radius:8px; padding:6px; font:600 .9rem 'Karla',sans-serif; color:var(--ink); background:var(--field); min-height:38px;}
  .total{margin:4px 0 0; padding:10px 16px; text-align:center; font:600 1.15rem 'Newsreader',Georgia,serif; background:var(--box); border-radius:var(--r-control);}
  .total.ok{background:color-mix(in oklab, var(--teal) 10%, var(--paper)); color:var(--teal);}
  .total.over{background:color-mix(in oklab, var(--a-red) 8%, var(--paper)); color:var(--a-red);}
  @media print{ .model{display:none !important;} body.tutor .model:not([hidden]){display:block !important;} }
'''

SCRIPT = r'''
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

// ---------- 3. The six shapes ----------
const SHAPES = [
  ['PPP', '', ['Lead-in', 'Present (meaning, form, pronunciation)', 'Practice (accuracy)', 'Production (fluency)', 'Error correction']],
  ['Test-Teach-Test', 'grey', ['Lead-in', 'First test (diagnostic)', 'Teach (clarify gaps)', 'Second test', 'Feedback']],
  ['Text-Based', '', ['Lead-in', 'Reading/listening task', 'Highlight target language', 'Clarify', 'Practice', 'Feedback']],
  ['Language Practice', 'grey', ['Lead-in (optional)', 'Set up', 'Controlled practice', 'Freer practice', 'Feedback']],
  ['Receptive Skills', 'red', ['Lead-in', '(Prediction)', 'Pre-teach vocab', 'Gist', 'Detail', 'Specific info', 'Post-task response']],
  ['Productive Skills', 'gold', ['Lead-in', 'Preparing to write/speak', 'Useful language (optional)', 'Task', 'Feedback']]
];
$('shapes').innerHTML = SHAPES.map(s => '<div class="shape ' + s[1] + '"><h3>' + s[0] + '</h3><ol>' + s[2].map(x => '<li>' + esc(x) + '</li>').join('') + '</ol></div>').join('');

// ---------- 4. Card sort: a stage, then a shape; the wrong shape just lets go ----------
const ZONE_NAMES = ['PPP', 'TTT', 'Text-Based', 'Language Practice', 'Receptive Skills', 'Productive Skills'];
const STAGES = [
  ['Present: clarify meaning, form, pronunciation', 'PPP'],
  ['First test: diagnostic', 'TTT'],
  ['Highlight target language in the text', 'Text-Based'],
  ['Set up a controlled practice activity', 'Language Practice'],
  ['Prediction task', 'Receptive Skills'],
  ['Useful language (optional support)', 'Productive Skills']
];
let selected = null; const placed = {};
function drawSort(){
  $('sortCount').textContent = Object.keys(placed).length + ' of ' + STAGES.length + ' pinned';
  $('sortCards').innerHTML = STAGES.map((s, i) => '<button type="button" class="chip-b' + (selected === i ? ' sel' : '') + '" data-card="' + i + '"' + (placed[i] ? ' disabled' : '') + '>' + esc(s[0]) + '</button>').join('');
  $('zones').innerHTML = ZONE_NAMES.map(z => {
    const k = Object.keys(placed).find(i => placed[i] === z);
    return '<button type="button" class="zone' + (k !== undefined ? ' filled' : '') + '" data-zone="' + z + '"><b>' + z + '</b>' + (k !== undefined ? '<span>' + esc(STAGES[k][0]) + '</span>' : '') + '</button>';
  }).join('');
}
$('sortCards').addEventListener('click', e => { const b = e.target.closest('[data-card]'); if (!b || b.disabled) return; selected = +b.dataset.card; drawSort(); });
$('zones').addEventListener('click', e => {
  const b = e.target.closest('[data-zone]'); if (!b || selected === null) return;
  if (STAGES[selected][1] === b.dataset.zone) placed[selected] = b.dataset.zone;
  selected = null; drawSort();
});
drawSort();

// ---------- 5. Build the sequence ----------
const SEQ = {
  PPP: ['Lead-in', 'Present: clarify and focus on TL', 'Practice', 'Production', 'Error correction'],
  TTT: ['Lead-in', 'First test (diagnostic)', 'Teach (clarifying)', 'Second test', 'Feedback'],
  'Receptive Skills': ['Lead-in', '(Prediction task)', 'Pre-teach vocabulary', 'Gist task', 'Detail task', 'Post-task response'],
  'Language Practice': ['Lead-in (optional)', 'Set up', 'Controlled practice', 'Freer practice', 'Feedback']
};
// The chips are dealt in a fixed scrambled order (the same on every device and every load), never the answer's own
// order: listing them correctly gave the sequence away. Each is a permutation of the stage numbers, no stage in its place.
const SEQ_DEAL = { 5: [3, 0, 4, 1, 2], 6: [2, 5, 0, 4, 1, 3] };
let seqFw = 'PPP', built = [];
function drawSeq(){
  const correct = SEQ[seqFw], done = built.length === correct.length, allCorrect = done && built.every((s, i) => s === correct[i]);
  $('seqStatus').textContent = done ? (allCorrect ? 'Correct order!' : 'Not quite: click a slot to remove it and retry') : built.length + ' of ' + correct.length + ' placed';
  $('seqStatus').style.color = done && !allCorrect ? 'var(--a-red)' : '';
  $('seqFws').innerHTML = Object.keys(SEQ).map(f => '<button type="button" class="chip-b fw' + (f === seqFw ? ' on' : '') + '" data-fw="' + esc(f) + '">' + esc(f) + '</button>').join('');
  $('seqChips').innerHTML = SEQ_DEAL[correct.length].map(i => [correct[i], i]).map(([s, i]) => '<button type="button" class="chip-b" data-chip="' + i + '"' + (built.includes(s) ? ' disabled' : '') + '>' + esc(s) + '</button>').join('');
  $('seqSlots').innerHTML = built.map((s, i) => {
    const c = done ? (s === correct[i] ? ' good' : ' bad') : '';
    return '<button type="button" class="slot' + c + '" data-slot="' + i + '"><span class="n">' + (i + 1) + '</span>' + esc(s) + '</button>';
  }).join('');
}
$('seqFws').addEventListener('click', e => { const b = e.target.closest('[data-fw]'); if (!b) return; seqFw = b.dataset.fw; built = []; drawSeq(); });
$('seqChips').addEventListener('click', e => { const b = e.target.closest('[data-chip]'); if (!b || b.disabled) return; built.push(SEQ[seqFw][+b.dataset.chip]); drawSeq(); });
$('seqSlots').addEventListener('click', e => { const b = e.target.closest('[data-slot]'); if (!b) return; built.splice(+b.dataset.slot, 1); drawSeq(); });
drawSeq();

// ---------- 6. Name that framework: only the right one answers ----------
const SCENARIOS = [
  ['Students do a gap-fill on reported speech with no prior teaching. The teacher notes common errors, then clarifies just those before a second, similar task.', ['PPP', 'TTT', 'Text-Based', 'Language Practice'], 'TTT'],
  ['A short listening about someone’s daily routine. The teacher elicits present simple examples from the audio script, then clarifies meaning, form and pronunciation before controlled practice.', ['Text-Based', 'PPP', 'Receptive Skills', 'Productive Skills'], 'Text-Based'],
  ['The teacher presents the third conditional with a timeline and CCQs, drills pronunciation, then moves to a gap-fill followed by a freer personalized speaking task.', ['PPP', 'TTT', 'Language Practice', 'Text-Based'], 'PPP'],
  ['Students skim a news article for gist, read again for detail, then react orally to the content in pairs.', ['Receptive Skills', 'Productive Skills', 'Text-Based', 'TTT'], 'Receptive Skills']
];
const solved = {};
function drawScens(){
  $('nameCount').textContent = Object.keys(solved).length + ' of ' + SCENARIOS.length + ' correct';
  $('scens').innerHTML = SCENARIOS.map((s, si) => '<div class="scen"><p>' + esc(s[0]) + '</p><div class="optrow">'
    + s[1].map((o, oi) => '<button type="button" class="opt' + (solved[si] && o === s[2] ? ' good' : '') + '" data-sc="' + si + ':' + oi + '">' + esc(o) + '</button>').join('')
    + (solved[si] ? '<span class="fb">Correct</span>' : '') + '</div></div>').join('');
}
$('scens').addEventListener('click', e => {
  const b = e.target.closest('[data-sc]'); if (!b) return;
  const [si, oi] = b.dataset.sc.split(':').map(Number);
  if (SCENARIOS[si][1][oi] === SCENARIOS[si][2]) { solved[si] = true; drawScens(); }
});
drawScens();

// ---------- 7. Stage timer ----------
const PACING = ['Lead-in & Text Reading (Gist/Detail)', 'Clarification (MFPA)', 'Controlled Practice & Feedback'];
const pacing = [0, 0, 0];
$('pacing').innerHTML = PACING.map((n, i) => '<div class="prow"><span>' + esc(n) + '</span><label><input type="number" min="0" max="45" placeholder="15" data-p="' + i + '" aria-label="' + esc(n) + ' minutes">min</label></div>').join('');
function drawTotal(){
  const t = pacing.reduce((a, b) => a + b, 0);
  $('total').textContent = 'Total: ' + t + ' / 45 min';
  $('total').className = 'total' + (t === 45 ? ' ok' : t > 45 ? ' over' : '');
}
$('pacing').addEventListener('input', e => { const i = e.target.dataset.p; if (i === undefined) return; pacing[+i] = parseInt(e.target.value, 10) || 0; drawTotal(); });
drawTotal();
$('trimBtn').onclick = () => { $('trim').hidden = !$('trim').hidden; };
'''
