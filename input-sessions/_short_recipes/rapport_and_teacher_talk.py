# Connect's 45-minute "Rapport, and how much you talk" (src/app/input-sessions/sessions/rapport-and-teacher-talk.tsx), on
# Lite's desk. Content word for word, American spelling; the talk count (mark each line, check, see the split), the
# grading and rapport choices (locked on the first pick) and the reveal cards work as they do on Connect.
# Lite has no long session of this.
TITLE = 'Rapport, and how much you talk'
LONG = ''
SUB = ('Two criteria that tutors write about more than almost any others, and they are the same thing from two sides: what you do '
       'with your presence, and what you do with your voice. You have now taught once: this session starts from what that sounded like.')
NAV = [('s1', '1 · The teacher you remember'), ('s2', '2 · Count the talk'), ('s3', '3 · Grading'), ('s4', '4 · Rapport'),
       ('s5', '5 · Involved at the front'), ('s6', '6 · Wrap-up')]

NOTES = '''<h4>Running this session</h4>
<p>Run this after TP1, not before it: every stage is better when trainees have heard themselves teach. The transcript is deliberately not a bad teacher: everything in it is kind, encouraging and well meant, which is why the count at the end lands.</p>
<h4>Why these two together</h4>
<p>They are one thing from two sides. Talking over learners' heads is a rapport failure as much as a language one, and every minute of teacher talk is a minute a learner is not talking. If you separate them, trainees treat TTT as a stopwatch problem.</p>
<h4>1 · The teacher you remember</h4>
<p>Push them off adjectives. "Kind", "funny", "passionate" are not actions. Keep asking "what did they DO" until you get behaviors on the board: they will almost all be 1d, and you will point at them again at the end.</p>
<h4>2 · The count</h4>
<p>Let them predict the split before revealing it. Most guess 60/40. The real answer is around 90/10 by words, and this teacher is doing nothing wrong in the ordinary sense: she is warm, she recasts errors well, she encourages. That is the point: the problem is invisible from inside.</p>
<h4>2 · What to cut</h4>
<p>Run it again as a rewrite: give them the first three teacher turns and two minutes to cut them to the bone without losing anything a learner needs. Read the best one aloud.</p>
<h4>3 · The third option is the trap</h4>
<p>Every grading item has a too-long option, a good option, and an ungrammatical "simple" one. Trainees who have been told "keep it short" pick the third. Name it: simplified is not the same as broken, and learners copy what they hear.</p>
<h4>4 · Praise</h4>
<p>The automatic-praise card is the one that starts an argument. Let it. The distinction worth landing is specific versus reflexive: "that's the past simple, and you used it in a question" beats "perfect!" every time.</p>
<h4>5 · Wait time</h4>
<p>Three seconds feels endless from the front. Time it in the room: ask a question, count to three aloud, then nominate. They will find it unbearable, and that is the lesson.</p>
<h4>Where this lands</h4>
<p>1d and 2a are assessed from TP1 onwards, so this session should have come before it and cannot. Set the transfer task explicitly: both go in tonight's plan under the stage they apply to.</p>'''

BODY = r'''
  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="stage-title">The teacher you remember <span class="badge">5 minutes</span></div>
      <p class="lead">Think of one teacher (any subject, any language) whose classes you actually wanted to be in. In pairs: what did they <em>do</em>? Not what they were like. What did they do.</p>
      <p class="quiet">Two minutes in pairs, three answers to the room. Write them on the board; you will come back to them at the end.</p>
    </div>
  </section>

  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">Count the talk <span class="badge">12 minutes</span></div>
      <p class="lead">Three minutes of a pre-intermediate lesson. Mark each line, teacher or student, then guess the split by number of words before you check.</p>
      <div class="tlines" id="talk"></div>
      <p class="guessrow"><label for="guess">Your guess: the teacher’s share of the words</label> <input type="number" id="guess" class="write-area" min="0" max="100" inputmode="numeric" placeholder="%"> <span>%</span></p>
      <div class="btn-row"><button type="button" class="btn" id="talkCheck" disabled>Mark every line first</button></div>
      <div class="split" id="split" hidden></div>
    </div>
  </section>

  <section id="s3" data-n="3">
    <div class="card" data-n="3">
      <div class="stage-title">Grading, not dumbing down <span class="badge">10 minutes</span></div>
      <p class="lead">Cambridge 2a: “use comprehensible language… <b>keep your simplified language natural</b>.” Both halves matter, and the second is the one trainees drop.</p>
      <div id="grading"></div>
    </div>
  </section>

  <section id="s4" data-n="4">
    <div class="card" data-n="4">
      <div class="stage-title">Rapport, or being liked? <span class="badge">9 minutes</span></div>
      <p class="lead">Five things a teacher does. Rapport is not the same as being liked: the test is whether it hands the floor over.</p>
      <div id="rapport"></div>
    </div>
  </section>

  <section id="s5" data-n="5">
    <div class="card" data-n="5">
      <div class="stage-title">Involved at the front <span class="badge">7 minutes</span></div>
      <p class="lead">1d asks for learners “fully involved… during teacher-fronted <em>and</em> learner-centered stages”. Pairwork is the easy half. Five moves for the other one.</p>
      <div id="moves"></div>
    </div>
  </section>

  <section id="s6" data-n="6">
    <div class="card" data-n="6">
      <div class="stage-title">Wrap-up <span class="badge">2 minutes</span></div>
      <p class="lead">Back to the board. Which of the things your remembered teacher <em>did</em> are on this page? And one sentence each: the one thing you will do differently in your next TP, a rapport move, or a place you will stop talking.</p>
      <textarea class="write-area" rows="3" placeholder="The one thing I will do differently in my next TP"></textarea>
    </div>
  </section>
'''

STYLE = r'''
  .guessrow{display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin:12px 0 0; font-weight:600; font-size:.9rem;}
  .guessrow input.write-area{width:84px; margin:0; text-align:center;}
  .guess-say{font-weight:600; margin:4px 0 8px;}

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

  .tlines{display:flex; flex-direction:column; gap:6px; margin:12px 0 0;}
  .tline{display:flex; gap:10px; align-items:flex-start; background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-strip); padding:8px 12px; font-size:.92rem; line-height:1.55;}
  .tline.ok{border-color:var(--teal); background:color-mix(in oklab, var(--teal) 5%, var(--paper));}
  .tline.no{border-color:var(--brick); background:color-mix(in oklab, var(--brick) 5%, var(--paper));}
  .ts{display:flex; gap:4px; flex:none;}
  .ts button{width:32px; height:32px; border-radius:50%; border:1.5px solid var(--sand-line); background:var(--field); color:var(--grey); font:700 .8rem 'Karla',sans-serif; cursor:pointer; padding:0;}
  .ts button.on{background:var(--teal); border-color:var(--teal); color:var(--paper);}
  .tline .tag{font-size:.74rem; font-weight:700; margin-left:4px;} .tline.ok .tag{color:var(--teal);} .tline.no .tag{color:var(--brick);}
  #talkCheck:disabled{opacity:.6; cursor:default; color:var(--grey);}
  .split{border:1.5px solid var(--c-red); border-radius:var(--r-strip); padding:14px 16px; margin:12px 0 0; background:var(--paper);}
  .split h3{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.2rem; margin:0 0 8px;}
  .split .bar{display:flex; height:12px; border-radius:999px; overflow:hidden; margin:0 0 8px;}
  .split .n{font-size:.84rem; color:var(--grey); margin:0 0 8px;}
  .split p{margin:0; line-height:1.6;}
  :root{--c-red:oklch(45% 0.15 27);}
  @media print{ .ts{display:none;} }
  /* 21 Nov 2026: an answered task printed solved on the handout: each transcript line with "Right" or "Wrong" and its teal or red edge and fill; the split itself (the teacher's share, the word counts and the comment), which is the answer; the number typed as a guess; a picked scenario with its teal or red edge and the other options faded. On paper each prints as it did untouched. The split still prints with the answers and on the tutor's print. */
  @media print{
    .tline.ok, .tline.no{border-color:var(--sand-line); background:var(--paper);} .tline .tag{display:none;}
    body:not(.with-answers):not(.tutor) #split{display:none !important;}
    .guessrow input.write-area{color:transparent !important;}
    .scen.done.right, .scen.done.wrong{border-color:var(--sand-line);} .scen .opt.dim{opacity:1;}
  }
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
    // 22 Nov 2026 (Ramy: "fix that one"): s.also is another answer that counts too (Grading, item 3: its feedback says the third "is fine too, and often right", yet picking it was marked wrong). A right pick is the one marked; after a wrong pick every right answer is shown.
    const s = list[+d.dataset.k], v = +b.dataset.v, also = s.also || [], ok = v === s.correct || also.includes(v);
    d.classList.add('done', ok ? 'right' : 'wrong');
    d.querySelectorAll('.opt').forEach(o => { o.disabled = true; const ov = +o.dataset.v; o.classList.add((ok ? ov === v : ov === s.correct || also.includes(ov)) ? 'good' : ov === v ? 'bad' : 'dim'); });
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


// ---------- 2. count the talk ----------
const TRANSCRIPT = [
  ['T', 'OK so now what we’re going to do, we’re going to do a little activity, it’s a speaking activity, so you’re going to work with your partner, the person next to you, OK?'],
  ['S', 'Yes.'],
  ['T', 'And what you’re going to do is you’re going to ask each other about your weekend, so what did you do at the weekend, did you go anywhere, did you see anyone, that kind of thing, OK, so just have a chat about it.'],
  ['S', 'With partner?'],
  ['T', 'Yes, with your partner, the person sitting next to you, so just turn to them and have a conversation about your weekend, and you’ve got about three minutes, OK, so off you go.'],
  ['S', 'I go to my sister house.'],
  ['T', 'Ah lovely, you went to your sister’s house, yes, and what did you do there, did you have dinner, did you watch something?'],
  ['S', 'We eat and watch film.'],
  ['T', 'Lovely, you ate and you watched a film, that sounds like a nice weekend, OK everyone, keep going.']
];
const marks = {}; let checked = false, TEACHER_PCT = 0;
const words = t => t.trim().split(/\s+/).length;
function drawTalk(){
  $('talk').innerHTML = TRANSCRIPT.map((l, i) => {
    const m = marks[i], cls = checked && m ? (m === l[0] ? ' ok' : ' no') : '';
    return '<div class="tline' + cls + '"><span class="ts">' + ['T', 'S'].map(s => '<button type="button" data-mark="' + i + ':' + s + '" class="' + (m === s ? 'on' : '') + '" aria-label="' + (s === 'T' ? 'Teacher' : 'Student') + '">' + s + '</button>').join('') + '</span><span>' + l[1] + (cls ? ' <span class="tag">' + (cls === ' ok' ? 'Right' : 'Wrong') + '</span>' : '') + '</span></div>';
  }).join('');
  const all = TRANSCRIPT.every((_, i) => marks[i]), b = $('talkCheck');
  b.disabled = !all; b.className = 'btn' + (all ? ' primary' : ''); b.textContent = all ? 'Check, and show the split' : 'Mark every line first';
  $('split').hidden = !checked;
}
$('talk').addEventListener('click', e => { const b = e.target.closest('[data-mark]'); if (!b) return; const [i, s] = b.dataset.mark.split(':'); marks[i] = s; checked = false; drawTalk(); });
$('talkCheck').addEventListener('click', () => { checked = true; drawTalk(); drawGuess(); });
// "guess the split before you check": the guess box above the button, read back beside the real figure
function drawGuess(){
  const g = parseInt($('guess').value, 10), el = $('guessSay'); if (!el) return;
  el.textContent = isNaN(g) ? 'You did not write a guess.' : 'You guessed ' + g + '%. ' + (Math.abs(g - TEACHER_PCT) <= 5 ? 'Close.' : g < TEACHER_PCT ? 'The teacher talked more than you thought.' : 'The teacher talked less than you thought, but still most of it.');
}
(function(){
  const tw = TRANSCRIPT.filter(l => l[0] === 'T').reduce((n, l) => n + words(l[1]), 0);
  const sw = TRANSCRIPT.filter(l => l[0] === 'S').reduce((n, l) => n + words(l[1]), 0);
  const pct = TEACHER_PCT = Math.round(tw / (tw + sw) * 100);
  $('split').innerHTML = '<h3>' + pct + '% of the words in that exchange are the teacher’s.</h3><p class="guess-say" id="guessSay"></p>'
    + '<div class="bar"><span style="flex:' + tw + ';background:var(--c-red)"></span><span style="flex:' + sw + ';background:var(--teal)"></span></div>'
    + '<p class="n">' + tw + ' teacher words · ' + sw + ' student words, in three minutes of a speaking activity.</p>'
    + '<p>Nothing here is unkind or incompetent. She is warm, she recasts both errors accurately, she encourages. That is exactly why this is worth looking at: from inside the lesson it felt like good teaching, and the learners said fourteen words.</p>';
})();
drawTalk();

// ---------- 3. grading ----------
choices('grading', [
  { text: 'Setting up a pairwork task with a pre-intermediate class.', choices: ['“Right, so if you could possibly turn to the person beside you and have a bit of a chat about it.”', '“Work in pairs. Talk about your weekend. Three minutes.”', '“You talk now partner yes? Weekend. Three minute.”'], correct: 1,
    feedback: 'The second. The first is padded with hedges a pre-intermediate learner has to unpick before finding the instruction. The third is the trap: it is shorter, but it is not English. Grading your language means making it simpler AND keeping it natural, not speaking a broken version of it.' },
  { text: 'Explaining what “commute” means to an A2 class.', choices: ['“It’s the journey you make to work, usually every day.”', '“A commute is a regular journey undertaken between one’s residence and place of employment.”', '“Commute, you know, travel, go, work, every day, yes?”'], correct: 0,
    feedback: 'The first. The second is accurate and completely out of reach. The third is a string of words, not a sentence: the learner has to assemble the meaning themselves and has no model to copy.' },
  { text: 'A learner says “I am agree with you.” You want to respond in the moment without stopping the discussion.', choices: ['“I agree with you. Good. Carry on.”', '“No, we don’t say ‘I am agree’, we say ‘I agree’, because agree is a verb, not an adjective.”', 'Say nothing and note it for delayed correction.'], correct: 0, also: [2],   // 22 Nov 2026 (Ramy: "fix that one"): the third counts as right too, as the feedback says
    feedback: 'The first: a natural, accurate recast that models the form without a grammar lecture mid-discussion. The second stops the conversation dead. The third is fine too, and often right; but a recast costs nothing and keeps the floor with the learner.' }
]);

// ---------- 4. rapport, or being liked? ----------
const RL = ['Builds rapport', 'Just being liked'];
choices('rapport', [
  { text: 'You arrive five minutes early and chat to the two students already there about their journey in.', choices: RL, correct: 0, feedback: 'Builds it. Cambridge’s own wording is “interact naturally with learners before, during and after the lesson”: before and after are in the criterion for a reason.' },
  { text: 'You praise every answer with “Great!”, “Perfect!”, “Well done!”, including the wrong ones.', choices: RL, correct: 1, feedback: 'Just being liked, and it stops meaning anything. Praise that is given for everything carries no information, and learners work out very fast that it is automatic.' },
  { text: 'You use learners’ names while teaching, not only when taking the register, and you have checked how each one is pronounced.', choices: RL, correct: 0, feedback: 'Builds it, and it is the cheapest thing on this list. Getting a name wrong for four weeks is a harder thing to undo than most trainees realize.' },
  { text: 'A learner gives a long, halting answer. You wait, keep eye contact, and let them finish.', choices: RL, correct: 0, feedback: 'Builds it. Waiting is a rapport move and a TTT move at once: filling the silence is the single most common way trainees take the floor back.' },
  { text: 'You tell the class a long, funny story about your own weekend to warm them up.', choices: RL, correct: 1, feedback: 'Careful. A short personal example gives learners something to respond to; a long one is teacher talk with a smile on it. The test is whether it hands the floor over or keeps it.' }
]);

// ---------- 5. involved at the front ----------
const INVOLVEMENT = [
  ['Ask, then pause, then nominate', 'Asking “anyone?” gets you the same three hands every time. Ask the question, leave three full seconds, then name someone: everyone has to think, because anyone might be next.'],
  ['Check answers in pairs before whole-class feedback', 'A learner who has already said the answer to one person will say it to the room. It also tells you where the class actually is before you find out in public.'],
  ['Hands down, everybody writes', 'Mini-whiteboards, a scrap of paper, fingers held up for A/B/C. Every learner commits to an answer instead of four learners answering for twenty.'],
  ['Re-route the question', '“Maria said the past simple. Ahmed, do you agree?” Two learners involved in one exchange, and the second one has to have been listening.'],
  ['Stand where you are not the center', 'Moving to the side of the room during feedback turns it from teacher-to-class into class-to-class. Cambridge 1d asks for involvement in teacher-fronted stages too, not only in pairwork.']
];
$('moves').innerHTML = INVOLVEMENT.map(m => revealCard(m[0], m[1])).join('');
'''
