# Connect's 45-minute "Classroom arrangements and material use" (src/app/input-sessions/sessions/classroom-arrangements.tsx),
# on Lite's desk. Content word for word, American spelling; the layout and materials cards and the three-stage
# "plan the switch" choices work as they do on Connect (one pick locks in, then the reasoning shows).
TITLE = 'Classroom arrangements and material use'
LONG = ''
SUB = ('The room’s shape and what’s on the walls or in trainees’ hands changes what a lesson can do before a single word is '
       'spoken. This session is about matching the arrangement to the activity, not defaulting to whatever’s already set up.')
NAV = [('s1', '1 · Four layouts'), ('s2', '2 · Plan the switch'), ('s3', '3 · Materials'), ('s4', '4 · Online equivalent')]

NOTES = '''<h4>Running this session</h4>
<p>Run it in the room you are actually in: start by asking what the current arrangement is good for, and what it would break. The middle stage is the one that matters: a single lesson where the arrangement has to change twice.</p>
<h4>Start in the room you are in</h4>
<p>Before opening anything, ask what the current arrangement is good for and what it would break. Most training rooms are a horseshoe or clusters, so the answer is in front of them.</p>
<h4>The switch is the session</h4>
<p>Trainees pick one layout and stay there. The middle stage exists to show that a single 45-minute lesson can need the room to change twice, and that the change has to be planned and timed, not improvised.</p>
<h4>Cost, not just job</h4>
<p>On the materials cards, push them on the COST line. Everyone can say what a whiteboard is for; few plan for the fact that what is erased is gone.</p>
<h4>Online is not a lesser case</h4>
<p>Breakouts are an arrangement decision made while planning, exactly like desks. If the course is mixed-mode, run the online pass properly rather than as an afterthought.</p>
<h4>Where this lands in TP</h4>
<p>5a is assessed on teaching practice from TP1. Ask each trainee to name, before they leave, the arrangement they will use for their first lesson and which stage it will have to change for.</p>'''

BODY = r'''
  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="stage-title">Match the layout to the activity <span class="badge">14 minutes</span></div>
      <p class="lead">Click a layout for what it is actually good for, and where it breaks down.</p>
      <div id="layouts"></div>
    </div>
  </section>

  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">Plan the switch: one lesson, three stages <span class="badge">12 minutes</span></div>
      <p class="lead">Same lesson throughout. Pick the arrangement for each stage, then check the reasoning: the answer changes twice, and that is the point.</p>
      <div id="stages"></div>
    </div>
  </section>

  <section id="s3" data-n="3">
    <div class="card" data-n="3">
      <div class="stage-title">Materials: what is the aid actually doing? <span class="badge">12 minutes</span></div>
      <p class="lead">Every material choice has a job, and a cost. Click each for both.</p>
      <div id="materials"></div>
    </div>
  </section>

  <section id="s4" data-n="4">
    <div class="card" data-n="4">
      <div class="stage-title">Online equivalent <span class="badge">7 minutes</span></div>
      <p class="lead">Breakout rooms replace physical rearranging: pair, small-group and whole-class &ldquo;layouts&rdquo; are just different room configurations. The planning question is the same: does this activity need everyone seeing everyone (main room, gallery view), or small isolated groups (breakouts)? Screen-share and annotation tools replace the whiteboard; a shared doc or the chat replaces the handout on the desk.</p>
      <p class="lead">Run the three stages above again, online: which room configuration for each, and what replaces the board?</p>
    </div>
  </section>
'''

STYLE = r'''
  .reveal-card .a p{margin:0 0 8px;} .reveal-card .a p:last-child{margin:0;}
  .scen-wrap{margin:0 0 14px;}
  .scen-wrap .label{margin:0 0 6px; color:var(--grey);}
  .scen{background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 16px;}
  .scen p{margin:0; font-size:.9rem; line-height:1.5;}
  .scen .opts{display:flex; flex-wrap:wrap; gap:8px; margin-top:10px;}
  .scen .opts .btn{margin:0;}
  .scen .fb{margin-top:8px; font-size:.88rem;}
  .scen.good{border-color:var(--teal); background:color-mix(in oklab, var(--teal) 7%, var(--paper));} .scen.good .fb{color:var(--teal);}
  .scen.bad{border-color:var(--a-red); background:color-mix(in oklab, var(--a-red) 5%, var(--paper));} .scen.bad .fb{color:var(--a-red);}
  @media print{ .scen .fb{display:none !important;} }
  /* 21 Nov 2026: an answered stage printed solved on the handout: it kept its right/wrong border and fill. On paper it prints as it did untouched. */
  @media print{ .scen.good, .scen.bad{border-color:var(--sand-line) !important; background:var(--paper) !important;} }
'''

SCRIPT = r'''
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

const LAYOUTS = [
  /* 21 Nov 2026: "theatre" was British spelling on an American site */
  ['Rows / theater style', 'Lecture-style input, watching a demonstration, exam conditions: anything where the teacher is the sole focus.',
    'Any pair or group task: half the room can only see the backs of heads, and moving desks mid-lesson costs time.'],
  ['Horseshoe / U-shape', 'Whole-class discussion, eliciting from the board, keeping everyone visible to you and each other.',
    'Large classes: the shape gets too wide for genuine eye contact with everyone, and pair work still needs a rearrange.'],
  ['Clusters / islands', 'Group work as the default mode, project-style tasks, ongoing pair/group activities without rearranging each time.',
    'Whole-class input or discussion: students face each other, not you, so attention drifts during teacher-led moments.'],
  ['Open space / no fixed seating', 'Mingling activities, running dictation, physical response tasks: anything needing movement.',
    'Any task needing sustained writing or a stable surface: students end up hunting for somewhere to put a pen down.']
];
const MATERIALS = [
  ['Whiteboard', 'Job: capture language that emerges live, a model sentence, marked stress, a student’s own error. Cost: whatever’s erased is gone, so anything worth keeping needs copying down before you move on.'],
  ['Handout', 'Job: gives every student the same fixed text to work from, at their own pace. Cost: printed once, it can’t adapt mid-lesson the way a whiteboard can.'],
  ['Realia (real objects)', 'Job: concept-checks meaning instantly, no translation needed; holding up an actual umbrella beats defining one. Cost: only works for concrete, portable things.'],
  ['Pictures / flashcards', 'Job: elicits vocabulary or sets a scene without a wall of text. Cost: open to more than one interpretation, worth a quick check that the picture means what you think it means.'],
  ['Audio / video', 'Job: the only aid that brings real pronunciation, pace, and connected speech into the room. Cost: needs working playback checked before the lesson, not during it.']
];
// One lesson, three stages, and the arrangement changes twice. The feedback names the right answer and why the other two are wrong.
const STAGES = [
  { stage: 'Stage 1: Lead-in', text: 'Whole-class discussion to activate what students already know about the topic.', choices: ['Rows', 'Horseshoe', 'Clusters'], correct: 1,
    feedback: 'A horseshoe keeps you and every student mutually visible: right for a whole-class discussion. Rows keep everyone facing you, not each other; clusters split attention into small groups before you have even set up the topic.' },
  { stage: 'Stage 2: Pair task', text: 'Students interview each other using the target language.', choices: ['Rows', 'Horseshoe', 'Clusters'], correct: 2,
    feedback: 'Clusters put pairs naturally facing each other: the easiest fit for this stage. Rows force students to twist around to face a partner; a horseshoe still isn’t built for pair-facing conversation.' },
  { stage: 'Stage 3: Whole-class feedback', text: 'Comparing answers and clarifying language as a class.', choices: ['Rows', 'Horseshoe', 'Clusters'], correct: 1,
    feedback: 'Back to a horseshoe (or a quick reset toward it): feedback is whole-class again, same reasoning as Stage 1. Rows work, but the horseshoe keeps students facing each other too; clusters leave them facing their own group, not the board.' }
];

const reveal = (q, aHtml) => '<div class="reveal-card" onclick="this.classList.toggle(\'open\')"><div class="q">' + esc(q) + '</div><div class="a">' + aHtml + '</div></div>';
$('layouts').innerHTML = LAYOUTS.map(l => reveal(l[0], '<p>Good for: ' + esc(l[1]) + '</p><p>Breaks down when: ' + esc(l[2]) + '</p>')).join('');
$('materials').innerHTML = MATERIALS.map(m => reveal(m[0], esc(m[1]))).join('');

// ---------- 2. Plan the switch (Connect's ChoiceScenarioCard): the first pick locks in; a wrong pick shows the right reasoning ----------
function drawStage(i, picked){
  const s = STAGES[i], answered = picked !== undefined, ok = picked === s.correct;
  return '<p class="label">' + esc(s.stage) + '</p><div class="scen' + (answered ? (ok ? ' good' : ' bad') : '') + '"><p>' + esc(s.text) + '</p>'
    + (answered ? '<p class="fb">' + (ok ? '✓ ' : '✗ ') + esc(s.feedback) + '</p>'
                : '<div class="opts">' + s.choices.map((c, j) => '<button type="button" class="btn" data-pick="' + i + ':' + j + '">' + esc(c) + '</button>').join('') + '</div>') + '</div>';
}
$('stages').innerHTML = STAGES.map((_, i) => '<div class="scen-wrap" id="st' + i + '">' + drawStage(i) + '</div>').join('');
$('stages').addEventListener('click', e => {
  const b = e.target.closest('[data-pick]'); if (!b) return;
  const [i, j] = b.dataset.pick.split(':').map(Number);
  $('st' + i).innerHTML = drawStage(i, j);
});
'''
