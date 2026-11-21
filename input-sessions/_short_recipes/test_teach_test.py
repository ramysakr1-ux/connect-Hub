# Connect's 45-minute "Test-Teach-Test: taught the way you'll teach it" (src/app/input-sessions/sessions/test-teach-test.tsx),
# on Lite's desk. Content word for word, American spelling; the hero card, the term match, the detail cards, the
# ordering debrief, the answer key and the staging example work as on Connect.
TITLE = "Test-Teach-Test: taught the way you'll teach it"
LONG = 'test-teach-test'
SUB = ('This session is staged exactly like the lesson framework it teaches. Do the tasks first: naming what happened is what '
       'the debrief is for.')
NAV = [('s1', '1 · Lead-in'), ('s2', '2 · What is TTT?'), ('s3', '3 · Match the terms'), ('s4', '4 · Predict the staging'),
       ('s5', '5 · Read the text'), ('s6', '6 · Detail questions'), ('s7', '7 · Debrief')]

NOTES = '''<h4>Running this session</h4>
<p>Don't name "Test-Teach-Test" until the debrief. Make sure the first test genuinely diagnoses gaps rather than teaching in disguise, and keep the teach stage limited to what the test actually revealed.</p>
<h4>Cap the teach stage</h4>
<p>It's easy to over-run here. Teach only what the test actually revealed, even if there's more you could say about the point.</p>
<h4>Only for grammar or lexis</h4>
<p>TTT doesn't work for writing or speaking: flag that limit explicitly during the debrief.</p>
<h4>A weak first test defeats the framework</h4>
<p>If the test doesn't genuinely diagnose gaps, the teach stage has nothing real to target: it's worth stressing this is the stage most likely to be rushed in a real TP.</p>'''

BODY = r'''
  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="stage-title">Lead-in <span class="badge">2 minutes</span></div>
      <p class="lead">Quick show of hands: has a teacher ever corrected you on something you actually already knew? How did that feel, compared to genuinely being taught something new?</p>
    </div>
  </section>

  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">What is TTT? <span class="badge">3 minutes</span></div>
      <div class="reveal-card hero" onclick="this.classList.toggle('open')"><div class="q">What is Test-Teach-Test?</div><div class="a">A test comes first, diagnosing gaps, then teaching targets only those gaps.</div></div>
    </div>
  </section>

  <section id="s3" data-n="3">
    <div class="card" data-n="3">
      <div class="stage-title">Match the terms <span class="badge">5 minutes</span></div>
      <p class="lead">Match each term to its meaning. <span class="count" id="matchCount"></span></p>
      <div id="match"></div>
    </div>
  </section>

  <section id="s4" data-n="4">
    <div class="card" data-n="4">
      <div class="stage-title">Predict the staging <span class="badge">3 minutes</span></div>
      <p class="sl">Stage 2</p>
      <p class="lead">How do you think a Test-Teach-Test lesson should be staged?</p>
      <p class="hint">Discuss with your partner, about a minute.</p>
    </div>
  </section>

  <section id="s5" data-n="5">
    <div class="card" data-n="5">
      <div class="stage-title">Read the text, check ideas <span class="badge">10 minutes</span></div>
      <p class="sl">Stage 3 · Read the text and check if your ideas were right or wrong</p>
      <div class="text-block">
        <h3>Staging a Test-Teach-Test lesson</h3>
        <p>TTT begins with a test, not a presentation. Students attempt a task (sentence choice, gap-fill, matching, or a discussion that requires the target language) before any teaching happens. The point isn't to catch students out; it's diagnostic, revealing exactly which gaps exist, and which of meaning, form or pronunciation each gap belongs to: different students in the same room often need different things. The teach stage that follows is aimed only at those gaps: <strong>meaning</strong> via a cline, a timeline, or CCQs on a handout; <strong>form</strong> via a short board explanation, only if students got it wrong; <strong>pronunciation</strong> via drilling, only if the test showed students couldn't say it. There's no need to re-teach what students already showed they know. A second test closes the loop, usually reusing the same task type as the first test but with new items, so the teacher and the students can see whether the gap has actually closed. Freer practice follows once accuracy is in place.</p>
      </div>
    </div>
  </section>

  <section id="s6" data-n="6">
    <div class="card" data-n="6">
      <div class="stage-title">Detail questions <span class="badge">10 minutes</span></div>
      <p class="sl">Stage 4</p>
      <p class="hint">More time now: answer these from the text, then check with your partner.</p>
      <div id="details"></div>

      <div class="text-block">
        <h3>Handling the teach stage without over-explaining</h3>
        <p>The test already showed which gap is real, so the teach stage only closes that gap: the fastest ways to do it involve the teacher talking least. Some examples:</p>
        <ul>
          <li><strong>Meaning gap</strong>: put the sentence on the board and ask two or three CCQs (“did this happen once or many times?”) rather than explaining the rule; let students answer their way to the meaning.</li>
          <li><strong>Form gap</strong>: board a correct model next to the error students actually produced, then elicit the difference from the group (“what’s different here?”) instead of naming the rule yourself.</li>
          <li><strong>Pronunciation gap</strong>: mark stress on the board and drill chorally, then individually; no explanation of word stress needed, just enough repetition to fix it.</li>
          <li>If only two or three students had the gap, deal with it in quick 1-to-1 concept-check while the rest move on: don't re-teach the whole class something most of them already showed they know.</li>
        </ul>
      </div>

      <div class="text-block">
        <h3>What the second test can look like</h3>
        <p>Test 2 checks the same gap the first test found: same task type, new items, so students can't just recall answers from Test 1. Examples, matched to the first test's task type:</p>
        <ul>
          <li>Test 1 was a gap-fill: Test 2 is a fresh gap-fill with the same target language in new sentences, not the same sentences reused.</li>
          <li>Test 1 was sentence choice (right/wrong): Test 2 is a short set of new sentences to judge, or a quick error-correction task.</li>
          <li>Test 1 was matching: Test 2 asks students to produce the language themselves (a short written sentence or a spoken exchange), a slightly freer check than the first test, since accuracy should now be closer.</li>
          <li>Keep Test 2 short: it's a check, not a new task. If most students still get it wrong, the teach stage needs revisiting, not a longer Test 2.</li>
        </ul>
      </div>
    </div>
  </section>

  <section id="s7" data-n="7">
    <div class="card" data-n="7">
      <div class="stage-title">Debrief: put the stages back in order <span class="badge">10 minutes</span></div>
      <p class="lead">Click each stage in the order you just experienced it. This is a <b>loop input</b>: the session modeled the framework instead of only describing it.</p>
      <div id="order"></div>
      <p class="status" id="orderStatus"></p>

      <div class="btn-row"><button class="btn" type="button" id="keyOpen">Reveal answer key: save or print to keep</button></div>
      <div class="answer-key" id="key" hidden>
        <div class="keyhead"><span class="keytitle">Answer key: handout, to keep</span><span class="keybtns"><button class="btn" type="button" id="keyHide">Hide</button><button class="btn" type="button" onclick="window.print()">Print</button></span></div>
        <div class="box"><h3>Terms</h3><table class="grid stk"><tbody id="keyTerms"></tbody></table></div>
        <div class="box"><h3>True or false</h3><div id="keyTf"></div></div>
      </div>

      <div class="btn-row"><button class="btn" type="button" id="exBtn">See staging example</button></div>
      <div class="example" id="ex" hidden>
        <h3>Example lesson: uses of the present continuous</h3>
        <table class="grid stk"><thead><tr><th>Stage</th><th>Time</th><th>Procedure</th></tr></thead><tbody id="exRows"></tbody></table>
      </div>
    </div>
  </section>
'''

STYLE = r'''
  .sl{font-weight:700; font-size:.9rem; margin:0 0 6px; color:var(--ink);}
  .hint{font-style:italic; font-size:.86rem; color:var(--grey); margin:0 0 8px; line-height:1.5;}
  .count{font-weight:700; color:var(--teal); white-space:nowrap;}
  .reveal-card.hero{max-width:460px;}
  .reveal-card.hero .q{font-family:'Newsreader',Georgia,serif; font-size:1.25rem; line-height:1.3;}
  .text-block h3, .box h3, .example h3{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.08rem; margin:0 0 6px; color:var(--ink);}
  .text-block p{margin:0 0 6px;} .text-block ul{margin:4px 0 0; padding-left:20px;} .text-block li{margin:5px 0;}
  .text-block strong{color:var(--ink);}
  button.pill{text-align:left; font-family:'Karla',sans-serif; width:100%;}
  button.pill.term{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1rem;}
  button.pill.matched{cursor:default;}
  button.order-line{width:100%; justify-content:flex-start; font-family:'Karla',sans-serif; color:var(--ink); text-align:left;}
  .order-line .num{flex:none; width:22px; height:22px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; background:var(--box); color:var(--grey); font-size:.74rem; text-align:center; min-width:0;}
  .order-line.done{border-color:var(--teal); background:color-mix(in oklab, var(--teal) 8%, var(--paper)); cursor:default;}
  .order-line.done .num{background:var(--teal); color:#fff;}
  .status{font-size:.88rem; font-weight:700; color:var(--teal); margin:4px 0 0;}
  .box{background:var(--paper); border:1.5px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 16px; margin:10px 0 0;}
  .answer-key{margin-top:14px;}
  .keyhead{display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;}
  .keytitle{font-size:10px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:var(--grey);}
  .keybtns{display:flex; gap:8px;}
  .tf{border-bottom:1px solid var(--row-line); padding:6px 0;} .tf:last-child{border-bottom:0;}
  .tf p{margin:0; font-size:.88rem;} .tf p.m{font-style:italic; color:var(--grey);}
  .example{margin-top:12px;}
  table.grid td.lab{font-weight:700; white-space:nowrap;}
  td.st{font-weight:700; white-space:nowrap;}
  @media(max-width:560px){
    table.stk, table.stk tbody, table.stk tr, table.stk td{display:block; width:100%;}
    table.stk thead{display:none;}
    table.stk tr{border:1px solid var(--sand-line); background:var(--paper); padding:6px 10px; margin:0 0 6px;}
    table.stk td{border:0; padding:2px 0;}
  }
  @media print{ .answer-key, .example{display:none !important;} }
  /* 21 Nov 2026: an answered task printed solved on the handout: "5 of 5 matched" beside the terms, with the matched meanings in a heavier weight; the ordered stages with their numbers, their fill and "All 4 in order". On paper each prints as it did untouched: a blank circle to number in, no counts. */
  @media print{
    .count, .status{display:none !important;}
    .pill.matched{background:var(--field); border-color:var(--sand-line); color:var(--ink);} .pill.matched:not(.term){font-weight:500;}
    .order-line.done{border-color:var(--sand-line); background:var(--paper);}
    .order-line.done .num{background:var(--box); color:var(--grey); font-size:0;} .order-line.done .num::after{content:"?"; font-size:.74rem;}
  }
'''

SCRIPT = r'''
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

// ---------- 3. Match the terms: a term, then its meaning (either order); a wrong pair flashes and clears ----------
const TERMS = [
  ['Diagnostic test', 'An initial task that reveals what students already know and don’t know.'],
  ['Gap', 'A specific problem in knowledge that the test stage uncovers.'],
  ['Remedial teach', 'Teaching aimed only at the gaps just found, not the whole point.'],
  ['Retest', 'A second, similar task that checks whether the gap has closed.'],
  ['MFP', 'Meaning, form, pronunciation: the three things the teach stage still has to cover, just only where there’s a gap.']
];
function matchTerms(el, countEl, terms){
  const right = terms.map((_, i) => i).reverse();
  let selL = null, selR = null, shake = null;
  const matched = new Set();
  function cls(i, sel){ return matched.has(i) ? ' matched' : sel === i ? (shake ? ' wrong' : ' selected') : ''; }
  function draw(){
    el.innerHTML = '<div class="pill-match-wrap"><div class="pill-col">'
      + terms.map((t, i) => '<button type="button" class="pill term' + cls(i, selL) + '" data-l="' + i + '">' + esc(t[0]) + '</button>').join('')
      + '</div><div class="pill-col">'
      + right.map(i => '<button type="button" class="pill' + cls(i, selR) + '" data-r="' + i + '">' + esc(terms[i][1]) + '</button>').join('')
      + '</div></div>';
    countEl.textContent = matched.size + ' of ' + terms.length + ' matched';
  }
  function tryMatch(){
    if (selL === null || selR === null) return;
    if (selL === selR) { matched.add(selL); selL = selR = null; }
    else { shake = true; setTimeout(() => { selL = selR = null; shake = null; draw(); }, 400); }
  }
  el.addEventListener('click', e => {
    if (shake) return;
    const l = e.target.closest('[data-l]'), r = e.target.closest('[data-r]');
    if (l && !matched.has(+l.dataset.l)) { selL = +l.dataset.l; tryMatch(); draw(); }
    if (r && !matched.has(+r.dataset.r)) { selR = +r.dataset.r; tryMatch(); draw(); }
  });
  draw();
}
matchTerms($('match'), $('matchCount'), TERMS);

// ---------- 6. Detail questions ----------
const DETAILS = [
  ['Teaching happens before any test.', 'False: the test comes first.'],
  ['The first test reveals what students already know.', 'True.'],
  ['If every student already gets the meaning right, the teach stage still has to cover it again from scratch.', 'False: teach only the gap, whether that’s meaning, form, or pronunciation.'],
  ['The second test can reuse the first test’s task type with new items.', 'True.'],
  ['A class might need meaning covered but not pronunciation, or the reverse: TTT doesn’t assume it’s always all three.', 'True.'],
  ['Freer practice comes before the second test.', 'False: after it.']
];
$('details').innerHTML = DETAILS.map(d => '<div class="reveal-card" onclick="this.classList.toggle(\'open\')"><div class="q">' + esc(d[0]) + '</div><div class="a">' + esc(d[1]) + '</div></div>').join('');

// ---------- 7. Debrief: only the stage that comes next takes its number ----------
const CORRECT_ORDER = ['Pre-teach terms', 'Predict the staging', 'Read the text, check ideas', 'Detail check'];
const SHUFFLED = ['Read the text, check ideas', 'Pre-teach terms', 'Detail check', 'Predict the staging'];
const picked = [];
function drawOrder(){
  $('order').innerHTML = SHUFFLED.map(l => {
    const i = picked.indexOf(l);
    return '<button type="button" class="order-line' + (i !== -1 ? ' done' : '') + '" data-stage="' + esc(l) + '"><span class="num">' + (i !== -1 ? i + 1 : '?') + '</span><span>' + esc(l) + '</span></button>';
  }).join('');
  $('orderStatus').textContent = picked.length === CORRECT_ORDER.length ? 'All ' + CORRECT_ORDER.length + ' in order: that’s the staging.'
    : picked.length + ' of ' + CORRECT_ORDER.length + ' placed: click the one that comes next.';
}
$('order').addEventListener('click', e => {
  const b = e.target.closest('[data-stage]'); if (!b) return;
  const l = b.dataset.stage;
  if (!picked.includes(l) && CORRECT_ORDER[picked.length] === l) { picked.push(l); drawOrder(); }
});
drawOrder();

// the answer key and the staging example
$('keyTerms').innerHTML = TERMS.map(t => '<tr><td class="lab">' + esc(t[0]) + '</td><td>' + esc(t[1]) + '</td></tr>').join('');
$('keyTf').innerHTML = DETAILS.map(d => '<div class="tf"><p>' + esc(d[0]) + '</p><p class="m">' + esc(d[1]) + '</p></div>').join('');
$('keyOpen').onclick = () => { $('key').hidden = false; $('keyOpen').hidden = true; };
$('keyHide').onclick = () => { $('key').hidden = true; $('keyOpen').hidden = false; };
const EXAMPLE_ROWS = [
  ['Test 1', '8′', 'Ss match 10 sentence pairs testing present simple vs present continuous uses.'],
  ['Check answers', '3′', 'Pairs compare, T notes which items caused problems.'],
  ['Teach', '12′', 'T addresses only the uses that caused errors (e.g. temporary states, future arrangements) via example/use matching and a short board explanation.'],
  ['Test 2', '8′', 'Same task type, new items, checking whether the gap has closed.'],
  ['Freer practice', '14′', 'Ss discuss their own current temporary situations and upcoming plans.']
];
$('exRows').innerHTML = EXAMPLE_ROWS.map(r => '<tr><td class="st">' + r[0] + '</td><td>' + r[1] + '</td><td>' + esc(r[2]) + '</td></tr>').join('');
$('exBtn').onclick = () => { $('ex').hidden = !$('ex').hidden; $('exBtn').textContent = $('ex').hidden ? 'See staging example' : 'Hide staging example'; };
'''
