# Connect's 45-minute "Drilling techniques" (src/app/input-sessions/sessions/drilling-techniques.tsx), on Lite's desk.
# Content word for word, American spelling; the warmer video, the discuss cards, the drill cards and the match-the-drill
# scenarios work as they do on Connect. Connect's examples joined their turns with arrows; each turn is a line here.
TITLE = 'Drilling techniques: getting the mouth to say it right'
LONG = 'guided-to-less-guided-practice'
SUB = ('Drilling is mechanical, controlled repetition: no message to communicate, just getting a form or sound out correctly and fluently. '
       'Do this session before Language Practice: drilling is the first, most controlled step; the next session moves from there toward learners actually using the language.')
NAV = [('s1', '1 · Warmer'), ('s2', '2 · Discuss first'), ('s3', '3 · Six drill types'), ('s4', '4 · Match the drill'),
       ('s5', '5 · Four more techniques'), ('s6', '6 · Unknown language'), ('s7', '7 · Wrap-up')]

NOTES = '''<h4>Running this session</h4>
<p>Model each drill type out loud with trainees before they try it in pairs on each other: reading a definition isn't the same as feeling how back-chaining actually works in your mouth.</p>
<h4>Choral first, always</h4>
<p>It's safe, nobody's heard alone. Individual drilling comes second, to find who actually has it versus who's hiding in the chorus. Keep individual drilling fast-moving; don't let it turn into a spotlight moment for a nervous trainee playing "learner."</p>
<h4>Scenario answers</h4>
<p>1 = substitution drill (can say it but can't bend it), 2 = back-chaining (long/awkward phrase), 3 = individual drill (choral is hiding a real gap), 4 = transformation drill (grammar manipulation, e.g. statement to question).</p>
<h4>If trainees dismiss drilling as old-fashioned</h4>
<p>Push back gently: it fell out of favor for being the whole lesson, not for being useless as one stage of one. It still earns criteria points, and used well it's genuinely fast.</p>
<h4>Ten drill types total now, in two batches</h4>
<p>Don't let the second batch feel like an afterthought; guessing drills and jazz chants tend to be the ones trainees actually remember and use.</p>
<h4>Discuss first</h4>
<p>Don't over-explain the advantages/disadvantages up front: let trainees genuinely try to answer before revealing the notes. Most groups get "builds confidence" easily but miss "can become mechanical" until pushed.</p>
<h4>"Drill each other in an unknown language"</h4>
<p>Have a couple of genuinely unfamiliar short phrases ready to hand out (a greeting in a language unlikely to be in the room). Don't let pairs default to a language one of them half-knows, or the exercise loses its point.</p>'''

BODY = r'''
  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="stage-title">Warmer <span class="badge">5 minutes</span></div>
      <div class="btn-row"><button class="btn primary" id="vidBtn" type="button">Click for video</button></div>
      <div class="vid" id="vid" hidden></div>
    </div>
  </section>

  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">Discuss first <span class="badge">5 minutes</span></div>
      <p class="lead">In pairs, discuss each question, then click to compare with the trainer’s notes.</p>
      <div id="discuss"></div>
    </div>
  </section>

  <section id="s3" data-n="3">
    <div class="card" data-n="3">
      <div class="stage-title">Six drill types, trainer-modeled <span class="badge">20 minutes</span></div>
      <p class="lead">Trainer models each one live with the room first, then click a card to reveal the description and try it on your partner.</p>
      <div id="drills1"></div>
    </div>
  </section>

  <section id="s4" data-n="4">
    <div class="card" data-n="4">
      <div class="stage-title">Match the drill to the problem <span class="badge">10 minutes</span></div>
      <p class="lead">A learner has a specific problem below. Which drill type actually fixes it? Click your answer.</p>
      <div id="scens"></div>
    </div>
  </section>

  <section id="s5" data-n="5">
    <div class="card" data-n="5">
      <div class="stage-title">Four more techniques <span class="badge">15 minutes</span></div>
      <p class="lead">Same pattern: trainer models, then click to reveal.</p>
      <div id="drills2"></div>
    </div>
  </section>

  <section id="s6" data-n="6">
    <div class="card" data-n="6">
      <div class="stage-title">Drill each other in an unknown language <span class="badge">7 minutes</span></div>
      <p class="lead">In pairs: teach your partner one short phrase in a language neither of you has studied (ask the trainer for a phrase, or use one you half-remember). Drill it on them using any two techniques from today. Then swap: they drill you.</p>
      <p class="quiet">The point: experiencing drilling as the actual learner, with zero existing anchor in the language, is the closest trainees will get on this course to feeling what a real beginner feels.</p>
    </div>
  </section>

  <section id="s7" data-n="7">
    <div class="card" data-n="7">
      <div class="stage-title">Wrap-up <span class="badge">3 minutes</span></div>
      <p class="lead">Drilling produces accurate, fluent form, but it’s not communication yet. That’s exactly where the next session, Language Practice, picks up.</p>
    </div>
  </section>
'''

STYLE = r'''
  .quiet{font-size:.88rem; font-style:italic; color:var(--grey); margin:4px 0 0;}
  .vid{position:relative; width:100%; max-width:480px; padding-top:42%; border-radius:8px; overflow:hidden; background:var(--ink); margin-top:12px;}
  .vid iframe{position:absolute; inset:0; width:100%; height:100%; border:0;}
  @media(max-width:560px){ .vid{padding-top:56.25%;} }
  .dq{display:flex; align-items:baseline; gap:10px; flex-wrap:wrap;}
  .dq .n{min-width:20px; font-size:.74rem; font-weight:700;}
  .dq .n.teal{color:var(--teal);} .dq .n.grey{color:var(--grey);} .dq .n.red{color:var(--a-red);}
  .dq .nm{flex:1; font-weight:600; font-size:.92rem; color:var(--ink);}
  .dq .ht{font-size:.74rem; font-weight:600; color:var(--grey);}
  .reveal-card .dd{display:none; margin-top:8px;}
  .reveal-card.open .dd{display:block;}
  .dd .desc{margin:0 0 8px; font-size:.88rem; line-height:1.55; color:var(--grey);}
  .dd .ex{border-left:4px solid var(--a-red); padding:2px 0 2px 12px; font:italic 400 1rem/1.5 'Newsreader',Georgia,serif; color:var(--ink);}
  .dd .ex p{margin:0;}
  .scen{background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 16px; margin:8px 0;}
  .scen.good{border-color:var(--teal); background:color-mix(in oklab, var(--teal) 6%, var(--paper));}
  .scen.bad{border-color:var(--a-red); background:color-mix(in oklab, var(--a-red) 5%, var(--paper));}
  .scen > p{margin:0; font-size:.92rem; line-height:1.55;}
  .chips{display:flex; flex-wrap:wrap; gap:8px; margin-top:10px;}
  .opt{font:700 .82rem 'Karla',sans-serif; padding:6px 14px; border:1.5px solid var(--sand-line); background:var(--field); color:var(--ink); cursor:pointer; min-height:34px;}
  .opt:hover{border-color:var(--gold);}
  .scen .why{margin:8px 0 0; font-size:.88rem; line-height:1.5;}
  .scen.good .why{color:var(--teal);} .scen.bad .why{color:var(--a-red);}
  .chips.on-paper{display:none;}   /* 20 Nov 2026: an answered scenario keeps its options in the page for the paper only (see draw() below) */
  @media print{ .vid, #vidBtn{display:none !important;} .reveal-card .dd{display:block;} .chips.on-paper{display:flex;} .scen.good, .scen.bad{border-color:var(--sand-line); background:var(--paper);} }   /* 20 Nov 2026: on paper an answered scenario is the task again, its options back and no mark of right or wrong */
'''

SCRIPT = r'''
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

// ---------- 1. Warmer: the player appears only when asked for ----------
$('vidBtn').onclick = () => {
  $('vid').innerHTML = '<iframe src="https://www.youtube.com/embed/lz0IT4Uk2xQ?si=6KQSBkeS1d-tYfSl" title="Session video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
  $('vid').hidden = false; $('vidBtn').hidden = true;
};

// ---------- 2. Discuss first ----------
const DISCUSS = [
  ['What is a drill?', 'Controlled, repetitive oral practice of a form: manipulating grammar, intonation, or stress with no real message being communicated.'],
  ['Why drill?', 'Builds oral confidence with new language, gives weaker learners a way to hide behind stronger ones at first, and lets the teacher hear problems directly rather than guessing from written work.'],
  ['When should we drill?', 'Most naturally at the presentation stage, right after modeling new language, sometimes again just before a practice activity, as a quick warm-up for the form.'],
  ['Advantages and disadvantages?', 'Advantages: builds confidence, reduces teacher talking time, works for a wide range of language, surfaces pronunciation problems, raises awareness of appropriate intonation. Disadvantages: can become mechanical and meaningless if overused, and a less confident teacher can make it feel flat rather than energetic.']
];
$('discuss').innerHTML = DISCUSS.map(d => '<div class="reveal-card" onclick="this.classList.toggle(\'open\')"><div class="q">' + esc(d[0]) + '</div><div class="a">' + esc(d[1]) + '</div></div>').join('');

// ---------- 3 and 5. The drill cards: name, hint, then the description and an example ----------
// [name, hint, accent, description, example turns]
const DRILLS = [
  ['Choral drill', 'Whole class, together', 'teal', 'The whole group repeats together. Always go first: nobody can be heard failing alone, so it’s safe, and it gets the sound into the room.',
    ['T: “I’d rather not.”', 'Class (all together): “I’d rather not.”']],
  ['Individual drill', 'One learner at a time', 'teal', 'Same phrase, one learner at a time after the choral round. The only drill that tells you honestly who’s actually got it versus who was hiding in the chorus. Keep it fast: don’t let it become a spotlight.',
    ['T: “I’d rather not.”', 'S1 (alone): “I’d rather not.”', 'S2 (alone): “I’d rather not.”']],
  ['Back-chaining', 'Build from the end', 'grey', 'For long or awkward phrases. Start at the last word or syllable, then add backwards toward the front, one piece at a time: each addition is easier than saying the whole thing cold.',
    ['“...that’s all right”', '“...if that’s all right”', '“I’d rather not, if that’s all right”']],
  ['Substitution drill', 'Swap one part', 'grey', 'Keep the frame, swap one slot. Turns a single memorized chunk into a usable, flexible pattern. This is the step most teachers skip, and it’s the one that actually builds fluency, not just recall.',
    ['T: “I’d rather not go to the party.” (cue: “the gym”)', 'S: “I’d rather not go to the gym.”']],
  ['Transformation drill', 'Change the grammar', 'red', 'Same core content, but the learner has to change the grammatical form: statement to negative, active to passive, statement to question.',
    ['T: “She works on Fridays.” (cue: question)', 'S: “Does she work on Fridays?”']],
  ['Mumble / silent drill', 'Quiet, own pace', 'teal', 'Learners repeat under their breath, at their own pace, rather than aloud on cue. Useful for shyer learners, or as a private rehearsal step right before an individual drill.',
    ['T models once aloud', 'learners each mutter it to themselves a few times before anyone speaks up.']]
];
const DRILLS_2 = [
  ['Forward (build-up) chaining', 'Grows from the front', 'teal', 'The opposite direction from back-chaining: start with a short core phrase and add a piece each round, building forward instead of backward. Useful when the front of a phrase is the easy, anchoring part.',
    ['“I get up early”', '“I get up early every day”', '“Ayşe gets up early every day”']],
  ['Guessing drill', 'Meaningful, not mechanical', 'grey', 'A meaningful drill, not a mechanical one: the teacher thinks of something real (a favorite sport, an imaginary move abroad), and learners take turns asking yes/no questions to find out what it is. Slower, and the teacher can’t be as strict about 100% correct form, but the language is genuinely purposeful.',
    ['L: “Is it a team sport?” T: “No.” L: “Do you need special equipment?” T: “Yes.” ...']],
  ['Finger counting & gesture', 'Visual, not verbal, cue', 'red', 'Count syllables or words on your fingers as learners say them, or use a hand shape to show sentence stress and intonation instead of saying “listen to the stress again.” Non-verbal cueing keeps the drill moving without extra teacher talk.',
    ['Hold up one finger per word as the class says “I’d, rather, not,” raising the “not” finger higher to show the stressed word.']],
  ['Jazz chant', 'Rhythmic, set to a beat', 'teal', 'A short exchange drilled to a fixed rhythm rather than natural speech pace: makes repetitive drilling genuinely fun and memorable, and naturally reinforces stress and intonation because the beat forces it.',
    ['“How’s Jack?” / “He’s sick.” / “Oh no!”, chanted with a steady clap or beat under it, repeated faster each round.']]
];
function drillCards(list, from){
  return list.map((d, i) => '<div class="reveal-card" onclick="this.classList.toggle(\'open\')"><div class="dq"><span class="n ' + d[2] + '">' + String(from + i).padStart(2, '0') + '</span><span class="nm">' + esc(d[0]) + '</span><span class="ht">' + esc(d[1]) + '</span></div>'
    + '<div class="dd"><p class="desc">' + esc(d[3]) + '</p><div class="ex">' + d[4].map(t => '<p>' + esc(t) + '</p>').join('') + '</div></div></div>').join('');
}
$('drills1').innerHTML = drillCards(DRILLS, 1);
$('drills2').innerHTML = drillCards(DRILLS_2, 7);

// ---------- 4. Match the drill to the problem: the first pick locks, as on Connect ----------
const CH = ['Back-chaining', 'Substitution', 'Individual', 'Transformation'];
const SCENARIOS = [
  ['A learner can say “I’d rather not go to the party” perfectly, but freezes when asked to say the same thing about the gym instead.', CH, 1, 'Substitution drill: they have the frame, they just need practice swapping the slot.'],
  ['A learner keeps saying “Mussorgsky” wrong, dropping a syllable every time, no matter how many times you model the whole word.', CH, 0, 'Back-chaining: building it from the last syllable forward makes each addition small and manageable.'],
  ['The whole class nails a phrase chorally, but you suspect two or three learners are just mouthing along without really producing it.', CH, 2, 'Individual drill: choral repetition can mask exactly this; only hearing them alone tells you the truth.'],
  ['A learner can say “She works on Fridays” but can’t turn it into a question when you ask them to check with a partner.', CH, 3, 'Transformation drill: the grammar manipulation (statement to question) is the actual gap here.']
];
function scenCards(host, list){
  const st = list.map(() => null);
  function draw(){
    host.innerHTML = list.map((s, i) => {
      const p = st[i], cls = p === null ? '' : p === s[2] ? ' good' : ' bad';
      /* 20 Nov 2026: an answered scenario keeps its four options in the page, shown on paper only (.on-paper). They were dropped at the first pick, so "Print the handout" then printed that scenario with nothing to circle. They carry no data-s, so the first pick still locks. */
      const chips = '<div class="chips' + (p === null ? '' : ' on-paper') + '">' + s[1].map((c, j) => '<button type="button" class="opt"' + (p === null ? ' data-s="' + i + ':' + j + '"' : '') + '>' + esc(c) + '</button>').join('') + '</div>';
      const inner = p === null ? chips : chips + '<p class="why">' + (p === s[2] ? '✓ ' : '✗ ') + esc(s[3]) + '</p>';
      return '<div class="scen' + cls + '"><p>' + esc(s[0]) + '</p>' + inner + '</div>';
    }).join('');
  }
  host.addEventListener('click', e => { const b = e.target.closest('[data-s]'); if (!b) return; const [i, j] = b.dataset.s.split(':'); st[+i] = +j; draw(); });
  draw();
}
scenCards($('scens'), SCENARIOS);
'''
