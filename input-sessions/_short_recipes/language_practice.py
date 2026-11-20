# Connect's 45-minute "Language practice" (src/app/input-sessions/sessions/language-practice.tsx), on Lite's desk.
# Content word for word, American spelling; the stage cards, the sort-the-activity scenarios, the worked examples and the
# loop cards work as they do on Connect. One example joined its two sentences with an arrow; each is a line here.
TITLE = 'Language practice: from controlled to free'
LONG = 'guided-to-less-guided-practice'
SUB = ('Drilling gets the form right with no real message. This session is about what comes after: three stages of practice activity that '
       'gradually hand control from teacher to learner, ending in a loop task that runs all three stages back to back on the same structure.')
NAV = [('s1', '1 · Lead-in'), ('s2', '2 · Three stages'), ('s3', '3 · Sort the activity'), ('s4', '4 · More examples'),
       ('s5', '5 · Loop task'), ('s6', '6 · Spot the mismatch'), ('s7', '7 · Design your own'), ('s8', '8 · Wrap-up')]

NOTES = '''<h4>Running this session</h4>
<p>Same target language throughout (offering/suggesting: "Why don't we...", "How about...") so trainees see the same structure move through all three stages, not three unrelated activities.</p>
<h4>Sort answers</h4>
<p>1 = controlled (gap-fill, one right answer), 2 = semi-controlled (roleplay cards, structure cued but content their own), 3 = free (real class outing decision, no language constraint at all), 4 = semi-controlled (a survey: structure fixed, answers genuinely theirs).</p>
<h4>Common trainee mistake</h4>
<p>Labeling anything with pairs/groups as "free practice." Free practice is about the LANGUAGE being unconstrained, not the seating arrangement: a pair activity with a sentence frame is still semi-controlled.</p>
<h4>If short on time, cut "Design your own" to a quick verbal share</h4>
<p>Rather than dropping it: it's the moment trainees actually apply the framework themselves rather than just recognizing it.</p>
<h4>Loop task: this is the session's real spine, not an add-on</h4>
<p>Same target language ("used to") moving through all three stages back to back, so trainees feel the control gradually loosening in one continuous run rather than three separate demos. Keep each loop genuinely brief (under 4 minutes): the point is contrast between stages, not depth on any one.</p>
<h4>"Design your own" now uses a different structure</h4>
<p>("wish + past simple") from the loop task ("used to"): deliberate, so trainees are applying the controlled/semi-controlled/free framework fresh, not just repeating what they just watched.</p>
<h4>More worked examples ("going to")</h4>
<p>The point is generalization: some trainees think the framework only fits the first structure they saw. Don't skip this even if time is short; cut a loop instead.</p>
<h4>"Spot the mismatch"</h4>
<p>The answer is semi-controlled: the sentence frame ("If I were you, I'd ___") fixes the structure even though it's pairwork. This is the single most common labeling error on written assignments; worth pausing on.</p>
<h4>Whole-class free loop</h4>
<p>Added as the fourth loop: it's the one closest to how free practice actually happens in a real lesson (the whole class, not just one pair), so don't cut it under time pressure if you can help it.</p>'''

BODY = r'''
  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="stage-title">Lead-in <span class="badge">5 minutes</span></div>
      <p class="lead">A learner can drill “Why don’t we go for coffee?” perfectly. Does that mean they can actually use it, to suggest something real, to someone real, when they mean it? That gap is what this session is about.</p>
    </div>
  </section>

  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">The three stages, one target structure each way <span class="badge">25 minutes</span></div>
      <p class="lead">Same language throughout: offering and suggesting. Click each stage to see it worked, then try it yourselves.</p>
      <div id="stages"></div>
    </div>
  </section>

  <section id="s3" data-n="3">
    <div class="card" data-n="3">
      <div class="stage-title">Sort the activity by stage <span class="badge">8 minutes</span></div>
      <p class="lead">Each activity below could be run at one of the three stages. Pick which.</p>
      <div id="scens"></div>
    </div>
  </section>

  <section id="s4" data-n="4">
    <div class="card" data-n="4">
      <div class="stage-title">More worked examples, same three stages <span class="badge">8 minutes</span></div>
      <p class="lead">A second target structure (“going to”: future plans), so the framework generalizes rather than sticking to one example. Click to reveal.</p>
      <div id="more"></div>
    </div>
  </section>

  <section id="s5" data-n="5">
    <div class="card" data-n="5">
      <div class="stage-title">Loop task: do all three stages back to back <span class="badge">12 minutes</span></div>
      <p class="lead">One target structure (“used to”: past habits), one quick task per stage, three to four minutes each. Click a loop to see it and run it live before moving to the next.</p>
      <div id="loops"></div>
    </div>
  </section>

  <section id="s6" data-n="6">
    <div class="card" data-n="6">
      <div class="stage-title">Spot the mismatch <span class="badge">6 minutes</span></div>
      <p class="lead">A trainee labels their pairwork activity “free practice” because learners are talking in pairs, but every learner must complete the sentence frame “If I were you, I’d ___.” What’s the actual stage, and why does “pairs” not decide it?</p>
      <details class="reveal">
        <summary>Reveal answer</summary>
        <div class="content">Semi-controlled: the sentence frame (“If I were you, I’d ___”) fixes the structure even though it’s pairwork.</div>
      </details>
    </div>
  </section>

  <section id="s7" data-n="7">
    <div class="card" data-n="7">
      <div class="stage-title">Design your own <span class="badge">5 minutes</span></div>
      <p class="lead">In pairs: take the target language “wish + past simple” (present regrets). Design one activity for each stage (controlled, semi-controlled, free) in one minute each. Share one with the room.</p>
    </div>
  </section>

  <section id="s8" data-n="8">
    <div class="card" data-n="8">
      <div class="stage-title">Wrap-up <span class="badge">3 minutes</span></div>
      <p class="lead">A lesson doesn’t need all three stages every time, but if you only ever drill and never free-practice, learners can produce a form on command and still never use it when it matters.</p>
    </div>
  </section>
'''

STYLE = r'''
  .reveal-card.edge{border-left-width:4px;}
  .reveal-card.edge.teal{border-left-color:var(--teal);} .reveal-card.edge.grey{border-left-color:var(--grey);} .reveal-card.edge.red{border-left-color:var(--a-red);}
  .sq{display:flex; justify-content:space-between; align-items:baseline; gap:10px; flex-wrap:wrap;}
  .sq .nm{font-weight:700; font-size:.95rem; color:var(--ink);}
  .sq .ctl{font-size:.74rem; font-weight:600;}
  .teal .ctl, .teal .wl{color:var(--teal);} .grey .ctl, .grey .wl{color:var(--grey);} .red .ctl, .red .wl{color:var(--a-red);}
  .sdesc{margin:6px 0 0; font-size:.88rem; line-height:1.55; color:var(--grey);}
  .reveal-card .wx{display:none; margin-top:8px; background:var(--box); border-radius:8px; padding:9px 14px;}
  .reveal-card.open .wx{display:block;}
  .wx .wl{display:block; font-size:.74rem; font-weight:700; margin-bottom:2px;}
  .wx p{margin:0; font-size:.88rem; line-height:1.55; color:var(--ink);}
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
  @media print{ .reveal-card .wx{display:block;} .chips.on-paper{display:flex;} .scen.good, .scen.bad{border-color:var(--sand-line); background:var(--paper);} }   /* 20 Nov 2026: on paper an answered scenario is the task again, its options back and no mark of right or wrong */
  @media print{ details.reveal > summary{display:none;} }   /* 20 Nov 2026: "Reveal answer" is a word for the screen; on paper the question stands alone, and the answers print writes the answer under it */
'''

SCRIPT = r'''
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

// [name, control, accent, description, example lines]
const STAGES = [
  ['Controlled practice', 'One right answer', 'teal', 'Learners produce the target form with little to no choice in what they say: the answer is fixed, the focus is accuracy.',
    ['Gap-fill: “___ we get pizza tonight?” (Why don’t): only one correct completion, everyone produces the identical structure.']],
  ['Semi-controlled practice', 'Structure fixed, content theirs', 'grey', 'The frame or task is set by the teacher, but learners supply their own real content within it: some genuine choice, some constraint.',
    ['Roleplay cards: “Suggest doing something this weekend to your partner, using ‘Why don’t we...’ or ‘How about...’”: structure is cued, but what they suggest is up to them.']],
  ['Free practice', 'No constraint at all', 'red', 'Learners communicate freely to achieve a real goal: no required structure, no correct answer, language choice entirely their own.',
    ['The class has to actually agree, as a group, where to go on a real end-of-course outing: the target language may come up naturally, or it may not; nothing forces it.']]
];
const MORE_EXAMPLES = [
  ['Controlled', 'One right answer', 'teal', ['Sentence transformation: “I finish work at six.”', '“I ___ finish work at six.” (’m going to): one correct form, no content choice.']],
  ['Semi-controlled', 'Structure fixed, content theirs', 'grey', ['Diary cards: learners fill in three real plans for next weekend, then tell a partner using “I’m going to...”: the structure is fixed, the plans are genuinely theirs.']],
  ['Free', 'No constraint at all', 'red', ['Groups plan a real class trip together, deciding where, when, and how: “going to” may surface naturally in the planning, or may not; nothing requires it.']]
];
const LOOPS = [
  ['Controlled loop', 'Same answer for everyone', 'teal', 'Ten quick prompts, one word each, chorally answered as a class: teacher says a habit that’s now stopped (“smoke”, “live in Paris”), trainees respond in unison “I used to ___.” One right answer each time, done in under a minute, moving fast.'],
  ['Semi-controlled loop', 'Structure fixed, content real', 'grey', 'In pairs, ask and answer: “What did you use to do as a child that you don’t do now?” The frame is fixed, but the actual habit each person names is their own. Swap partners once, repeat with a new person.'],
  ['Free loop', 'No constraint', 'red', 'Groups of three: “Tell the group one thing about your life five years ago that’s completely different now.” No structure required: “used to” may come up naturally, or a learner might say it a different way entirely. That’s fine.'],
  ['Whole-class free loop', 'No constraint, bigger stakes', 'teal', 'The whole “class” (the trainee group) has to agree on one thing they all used to believe as children that turned out to be false, and vote on the best one. Genuinely free: the goal is the vote, not the grammar.']
];
const head = (nm, ctl) => '<div class="sq"><span class="nm">' + esc(nm) + '</span><span class="ctl">' + esc(ctl) + '</span></div>';
const card = (accent, inner) => '<div class="reveal-card edge ' + accent + '" onclick="this.classList.toggle(\'open\')">' + inner + '</div>';
$('stages').innerHTML = STAGES.map(s => card(s[2], head(s[0], s[1]) + '<p class="sdesc">' + esc(s[3]) + '</p><div class="wx"><span class="wl">Worked example</span>' + s[4].map(t => '<p>' + esc(t) + '</p>').join('') + '</div>')).join('');
$('more').innerHTML = MORE_EXAMPLES.map(m => card(m[2], head(m[0], m[1]) + '<div class="wx">' + m[3].map(t => '<p>' + esc(t) + '</p>').join('') + '</div>')).join('');
$('loops').innerHTML = LOOPS.map(l => card(l[2], head(l[0], l[1]) + '<div class="wx"><p>' + esc(l[3]) + '</p></div>')).join('');

// ---------- 3. Sort the activity: the first pick locks, as on Connect ----------
const CH = ['Controlled', 'Semi-controlled', 'Free'];
const SORT_ITEMS = [
  ['A worksheet where learners fill in the missing modal verb in ten sentences, each with only one correct answer.', CH, 0, 'Controlled: one right answer per item, no learner choice in content.'],
  ['Learners get a roleplay card (“Suggest a restaurant to a friend using the target structure”) and act it out in pairs.', CH, 1, 'Semi-controlled: structure is cued by the card, but the actual restaurant/content is theirs.'],
  ['The class has to genuinely agree where to go for an end-of-course outing, with no language requirement at all.', CH, 2, 'Free: a real decision, real stakes, no structure imposed on how they get there.'],
  ['Learners walk around asking classmates a fixed set of survey questions and noting down real answers.', CH, 1, 'Semi-controlled: the questions (structure) are fixed, but the answers are genuinely the classmates’ own.']
];
function scenCards(host, list){
  const st = list.map(() => null);
  function draw(){
    host.innerHTML = list.map((s, i) => {
      const p = st[i], cls = p === null ? '' : p === s[2] ? ' good' : ' bad';
      /* 20 Nov 2026: an answered scenario keeps its three options in the page, shown on paper only (.on-paper). They were dropped at the first pick, so "Print the handout" then printed that scenario with nothing to circle. They carry no data-s, so the first pick still locks. */
      const chips = '<div class="chips' + (p === null ? '' : ' on-paper') + '">' + s[1].map((c, j) => '<button type="button" class="opt"' + (p === null ? ' data-s="' + i + ':' + j + '"' : '') + '>' + esc(c) + '</button>').join('') + '</div>';
      const inner = p === null ? chips : chips + '<p class="why">' + (p === s[2] ? '✓ ' : '✗ ') + esc(s[3]) + '</p>';
      return '<div class="scen' + cls + '"><p>' + esc(s[0]) + '</p>' + inner + '</div>';
    }).join('');
  }
  host.addEventListener('click', e => { const b = e.target.closest('[data-s]'); if (!b) return; const [i, j] = b.dataset.s.split(':'); st[+i] = +j; draw(); });
  draw();
}
scenCards($('scens'), SORT_ITEMS);
'''
