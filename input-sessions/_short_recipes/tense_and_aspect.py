# Connect's 45-minute "Tense and aspect." (src/app/input-sessions/sessions/tense-and-aspect.tsx), on Lite's desk.
# Content word for word, American spelling; the term match, the aspect choice, the sort (in Connect's seeded order, the
# same for everyone), the answer key and the staging example work as they do on Connect.
TITLE = 'Tense and aspect'
LONG = 'tense-and-aspect'
SUB = ('Tense marks when. Aspect marks how the speaker views the action: complete, ongoing, or connected to another point in '
       'time. Most language-analysis errors trace back to confusing the two.')
NAV = [('s1', '1 · Lead-in'), ('s2', '2 · Match the terms'), ('s3', '3 · Choose the aspect'), ('s4', '4 · Sort by aspect'),
       ('s5', '5 · Discuss: given pairs'), ('s6', '6 · Answer key')]

NOTES = '''<h4>Running this session</h4>
<p>Don't lead with terminology. Start from a situation that needs a particular aspect, and let trainees notice why the "obvious" tense doesn't fit, the same principle as guided discovery, applied to grammar most trainees think they already know.</p>
<h4>Tense and aspect are not the same thing</h4>
<p>"Present perfect" is a tense-and-aspect label, not a single tense: present tense, perfect aspect. Trainees who conflate the two end up teaching form without meaning.</p>
<h4>Meaning before form, every time</h4>
<p>Establish the situation that needs continuous or perfect aspect before naming or drilling the structure, the same guided-discovery principle, applied to grammar most trainees assume they already know.</p>
<h4>Future is a modal, not a tense in English</h4>
<p>English has no future tense inflection: "will" is a modal verb. "Future continuous" is really modal + continuous aspect. Worth flagging so trainees don't teach three "future tenses" as if they were parallel to past and present.</p>'''

BODY = r'''
  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="stage-title">Lead-in <span class="badge">2 minutes</span></div>
      <div class="text-block">"I've eaten three of Grandma Pilar's lemon cakes today" and "I've been eating Grandma Pilar's lemon cake all afternoon." Both present perfect. What's different, and it isn't tense?</div>
    </div>
  </section>

  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">Match the terms <span class="badge">10 minutes</span></div>
      <div class="mhead"><p class="lead">Match each term to its meaning</p><span class="count" id="mCount"></span></div>
      <div class="pill-match-wrap"><div class="pill-col" id="mLeft"></div><div class="pill-col" id="mRight"></div></div>
    </div>
  </section>

  <section id="s3" data-n="3">
    <div class="card" data-n="3">
      <div class="stage-title">Choose the aspect the context needs <span class="badge">13 minutes</span></div>
      <p class="lead">Each situation only works with one option: click your answer, then check.</p>
      <div id="choose"></div>
    </div>
  </section>

  <section id="s4" data-n="4">
    <div class="card" data-n="4">
      <div class="stage-title">Sort by aspect <span class="badge">8 minutes</span></div>
      <p class="lead">Same idea, different aspect. Click each sentence into Simple or Continuous.</p>
      <div class="sortcols" id="sort"></div>
    </div>
  </section>

  <section id="s5" data-n="5">
    <div class="card" data-n="5">
      <div class="stage-title">Discuss: these pairs <span class="badge">9 minutes</span></div>
      <p class="lead">Same idea, two aspects. With a partner, agree what changes in meaning, not just which is "more correct."</p>
      <div id="pairs"></div>
    </div>
  </section>

  <section id="s6" data-n="6">
    <div class="card" data-n="6">
      <div class="stage-title">Answer key</div>
      <button class="btn" type="button" id="keyOpen">Reveal answer key</button>   <!-- 22 Nov 2026 (Ramy: "Remove the print button from the answer key"): the label no longer promises a print -->
      <div class="akey" id="key" hidden>
        <div class="akey-top"><span class="label">Answer key: handout, to keep</span><span class="btn-row"><button class="btn" type="button" id="keyHide">Hide</button></span></div>   <!-- 22 Nov 2026 (Ramy: "Remove the print button from the answer key"): the key's own Print button is gone; Hide is the only button here -->
        <div class="box"><p class="ctx">Terms</p><div id="keyTerms"></div></div>
      </div>
      <div class="staging">
        <button class="btn" type="button" id="stgBtn">See staging example</button>
        <div id="stg" hidden>
          <p class="ctx">Example: staging "used to" vs past simple</p>
          <div class="kv" id="stgRows"></div>
        </div>
      </div>
    </div>
  </section>
'''

STYLE = r'''
  .box{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 16px; margin:8px 0;}
  .ctx{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.06rem; color:var(--ink); margin:0 0 4px;}
  .opts{display:flex; flex-wrap:wrap; gap:8px; margin-top:8px;}
  .opt{background:var(--field); border:1.5px solid var(--sand-line); border-radius:999px; padding:7px 14px; font:600 .86rem 'Karla',sans-serif; color:var(--ink); cursor:pointer; min-height:36px; text-align:left;}
  .opt:hover{border-color:var(--gold);}
  .opt.right{background:var(--teal); border-color:var(--teal); color:var(--paper);}
  .opt.miss{border-color:var(--brick); color:var(--brick); background:color-mix(in oklab, var(--brick) 6%, var(--paper));}
  .fb{margin:8px 0 0; font-size:.9rem; line-height:1.55; color:var(--ink);}
  .fb b.good{color:var(--teal);} .fb b.bad{color:var(--brick);}
  .mhead{display:flex; justify-content:space-between; align-items:baseline; gap:10px; flex-wrap:wrap;}
  .mhead .lead{margin:0;}
  .count{font-size:.84rem; font-weight:600; color:var(--grey);}
  .pill-col .pill{text-align:left; width:100%;}
  .pill-col .pill.term{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:.98rem;}
  .pill.matched{cursor:default;}
  .sortcols{display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:6px;}
  @media(max-width:640px){ .sortcols{grid-template-columns:1fr;} }
  .sortcols .col{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 14px; display:flex; flex-direction:column; gap:7px;}
  .sortcols .sbtn{text-align:left; border-radius:8px; padding:8px 11px;}
  .sbtn .st{display:block; font-size:.74rem; font-weight:700; margin-top:2px;}
  .pairline{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1rem; margin:0 0 4px; color:var(--ink);}
  .prompt{font-style:italic; color:var(--grey); font-size:.9rem; margin:4px 0 0;}
  .akey{margin-top:12px;}
  .akey-top{display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;}
  .akey-top .label{margin:0;} .akey-top .btn-row{margin:0;}
  .krow{display:grid; grid-template-columns:150px 1fr; gap:10px; padding:6px 0; border-bottom:1px solid var(--row-line); font-size:.88rem; line-height:1.5;}
  .krow:last-child{border-bottom:0;}
  .krow b{font-family:'Newsreader',Georgia,serif; font-weight:600; color:var(--ink);}
  .krow span{color:var(--grey);}
  .staging{margin-top:22px; padding-top:16px; border-top:1px solid var(--row-line);}
  .staging .ctx{margin:14px 0 8px;}
  .kv{border:1px solid var(--sand-line); border-radius:var(--r-strip); overflow:hidden; background:var(--paper);}
  .kv .krow{padding:8px 12px; grid-template-columns:150px 1fr;}
  .kv .krow b{font-family:'Karla',sans-serif; font-size:.86rem;}
  @media(max-width:560px){ .krow, .kv .krow{grid-template-columns:1fr; gap:2px;} }
  @media print{ #keyOpen, .akey-top .btn-row, #stgBtn{display:none !important;} }
  /* 21 Nov 2026: "Print the handout" printed the whole answer key once it had been opened (the answers to part 2), and the staging example once it had been opened. The key now prints only from its own Print button (body.print-key, set on that button) or in a tutor's print with the trainer notes; the example prints with the answers, or in that tutor's print if it is open. */
  @media print{ body:not(.print-key):not(.tutor) #key, html.hub-clean #key, body:not(.with-answers):not(.tutor) #stg, html.hub-clean #stg{display:none !important;} }
  /* 22 Nov 2026 (Ramy: "Remove the print button from the answer key"): that Print button is gone, so body.print-key is never set and no trainee print carries the key. The rule above stays as it is: a tutor's print and "Print with the answers" are untouched. */
  /* 21 Nov 2026: an answered task printed solved on the handout: matched meanings in a heavier weight; in part 3 the option picked in its right or wrong color, with "Correct." or "Not this one." and the explanation under it; in part 4 each sentence marked "Correct" or "Not this one" in its color. On paper each prints as it did untouched. */
  @media print{ .fb, .sbtn .st{display:none !important;} .pill.matched, .pill.selected, .pill.wrong{font-weight:500;} .opt.right, .opt.miss{background:var(--field); border-color:var(--sand-line); color:var(--ink);} }
'''

SCRIPT = r'''
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

const TERMS = [
  ['Tense', 'The grammatical marking of time (past, present, future), usually shown by the verb form.'],
  ['Aspect', 'How the speaker views the action: as complete, ongoing, or connected to another point in time.'],
  ['Simple aspect', 'An action or state viewed as a whole: complete, or a general habit or fact.'],
  ['Continuous (progressive) aspect', 'An action viewed as ongoing or in progress at a particular time.'],
  ['Perfect aspect', 'An action connected to a later point in time, often showing a result or present relevance.'],
  ['Perfect continuous aspect', 'An ongoing action connected to another point in time, usually emphasizing duration.']
];

// ---------- 2. Match: click a term, then its meaning (either order); a wrong pair flashes, then clears ----------
(function(){
  // 22 Nov 2026 (Ramy: "just fix it"): the meanings stood in the terms' order reversed, so the pairs could be read off. They are now mixed afresh each time the page loads (a Fisher-Yates shuffle), never in the terms' order or its exact reverse. The terms keep their order, and a pair is still matched by its number (data-l, data-r), not by where it stands.
  const right = TERMS.map((_, i) => i);
  if (right.length > 2) do { for (let i = right.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [right[i], right[j]] = [right[j], right[i]]; } } while (right.every((v, i) => v === i) || right.every((v, i) => v === right.length - 1 - i));
  let selL = null, selR = null, shake = [], matched = new Set();
  function cls(i, sel){ return matched.has(i) ? ' matched' : sel === i ? ' selected' : shake.includes(i) ? ' wrong' : ''; }
  function draw(){
    $('mCount').textContent = matched.size + ' of ' + TERMS.length + ' matched';
    $('mLeft').innerHTML = TERMS.map((t, i) => '<button type="button" class="pill term' + cls(i, selL) + '" data-l="' + i + '">' + esc(t[0]) + '</button>').join('');
    $('mRight').innerHTML = right.map(i => '<button type="button" class="pill' + cls(i, selR) + '" data-r="' + i + '">' + esc(TERMS[i][1]) + '</button>').join('');
  }
  function tryMatch(){
    if (selL === null || selR === null) return;
    if (selL === selR) { matched.add(selL); selL = selR = null; }
    else { shake = [selL, selR]; setTimeout(() => { selL = selR = null; shake = []; draw(); }, 400); }
  }
  document.querySelector('#s2 .pill-match-wrap').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.l !== undefined) { const i = +b.dataset.l; if (matched.has(i)) return; selL = i; }
    else { const i = +b.dataset.r; if (matched.has(i)) return; selR = i; }
    tryMatch(); draw();
  });
  draw();
})();

// ---------- 3. Choose the aspect ----------
const CHOOSE = [
  ['Look! Your dog ___ (eat) my sandwich.', 'is eating', 'eats', 'is eating', 'Present continuous: an action in progress right now, visible at the moment of speaking.'],
  ['I ___ (finish) my homework, so I can go to the concert now.', 'have finished', 'finished', 'have finished', 'Present perfect: the action is in the past, but its result (being free to go to the concert) is relevant right now.'],
  ['When the lights went out, Tomás ___ (sing) in the shower.', 'was singing', 'sang', 'was singing', 'Past continuous: sets a scene in progress at a specific past moment, interrupted by another past event.'],
  ['By the time we got to the station, the last train ___ (leave).', 'had left', 'left', 'had left', 'Past perfect: one past action completed before a second, later past action.']
];
const chosen = {};
// 22 Nov 2026 (Ramy: "just fix it"): the right option was always the first of the two buttons. Each situation's two options are now put in a random order once, when the page loads, and never all four the same way round. Marking follows the option's own words (data-o), not where it stands.
const CHOOSE_OPTS = CHOOSE.map(c => [c[1], c[2]]);
do { CHOOSE_OPTS.forEach(o => { if (Math.random() < .5) o.reverse(); }); } while (CHOOSE_OPTS.every((o, i) => o[0] === CHOOSE[i][3]) || CHOOSE_OPTS.every((o, i) => o[1] === CHOOSE[i][3]));
function drawChoose(){
  $('choose').innerHTML = CHOOSE.map((c, ci) => {
    const pick = chosen[ci];
    const opts = CHOOSE_OPTS[ci].map(o => '<button type="button" class="opt' + (pick === o ? (o === c[3] ? ' right' : ' miss') : '') + '" data-c="' + ci + '" data-o="' + esc(o) + '">' + esc(o) + '</button>').join('');
    const fb = pick ? '<p class="fb"><b class="' + (pick === c[3] ? 'good">Correct.' : 'bad">Not this one.') + '</b> ' + esc(c[4]) + '</p>' : '';
    return '<div class="box"><p class="ctx">' + esc(c[0]) + '</p><div class="opts">' + opts + '</div>' + fb + '</div>';
  }).join('');
}
$('choose').addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (!b) return; chosen[b.dataset.c] = b.dataset.o; drawChoose(); });
drawChoose();

// ---------- 4. Sort by aspect: Connect's seeded order, the same mixed order for everyone ----------
const SORT_A = ['I play table tennis every Sunday.', 'She wrote her wedding speech yesterday.', 'The twins will visit us next week.'];
const SORT_B = ["I'm playing table tennis right now.", 'She was writing her wedding speech when I called.', 'The twins will be visiting us this time next week.'];
const SORT_ITEMS = SORT_A.map(s => ({ s, key: 'simple' })).concat(SORT_B.map(s => ({ s, key: 'continuous' })));
function seededRandom(key){
  let s = [...key].reduce((a, c, i) => (a + (i + 1) * c.charCodeAt(0)) % 2147483647, 0) || 1;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
function shuffle(arr, key){
  const rand = seededRandom(key), copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
  return copy;
}
const SORTED = shuffle(SORT_ITEMS, 'tense-and-aspect');
const placed = {};
function drawSort(){
  $('sort').innerHTML = [['Simple aspect', 'simple'], ['Continuous aspect', 'continuous']].map(([label, key]) =>
    '<div class="col"><p class="ctx">' + label + '</p>' + SORTED.map((it, i) => {
      const shown = placed[i] === key, ok = it.key === key;
      return '<button type="button" class="opt sbtn' + (shown ? (ok ? ' right' : ' miss') : '') + '" data-i="' + i + '" data-k="' + key + '">' + esc(it.s)
        + (shown ? '<span class="st">' + (ok ? 'Correct' : 'Not this one') + '</span>' : '') + '</button>';
    }).join('') + '</div>').join('');
}
$('sort').addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (!b) return; placed[b.dataset.i] = b.dataset.k; drawSort(); });
drawSort();

// ---------- 5. Discuss ----------
const PAIRS = [
  ["I've lived on this houseboat for ten years.", "I've been living on this houseboat for ten years.", "Both are true: what does the continuous add that the simple doesn't?"],
  ['Priya was exhausted because she had chased the goat across three fields.', 'Priya was exhausted because she had been chasing the goat for an hour.', 'One tells you how much was completed, the other how long it went on. Which is which?'],
  ["I'm meeting Kofi at the climbing wall at six.", 'I meet Kofi at the climbing wall at six every Tuesday.', 'Same verb, same time: one is a fixed arrangement, one is a routine. How does aspect signal that?'],
  ['I read the instructions before I built the wardrobe.', 'I had read the instructions before I built the wardrobe.', 'Both put the reading first: what does the second sentence make explicit that the first leaves you to infer?'],
  ["I'll be seeing Rosa at band practice tomorrow anyway, so I'll tell her then.", "I'll tell Rosa tomorrow.", 'One treats the meeting as already arranged and in motion, the other as a decision made right now. Which is which?']
];
$('pairs').innerHTML = PAIRS.map(p => '<div class="box"><p class="pairline">' + esc(p[0]) + '</p><p class="pairline">' + esc(p[1]) + '</p><p class="prompt">' + esc(p[2]) + '</p></div>').join('');

// ---------- 6. Answer key and staging example ----------
$('keyTerms').innerHTML = TERMS.map(t => '<div class="krow"><b>' + esc(t[0]) + '</b><span>' + esc(t[1]) + '</span></div>').join('');
$('keyOpen').onclick = () => { $('key').hidden = false; $('keyOpen').hidden = true; };
$('keyHide').onclick = () => { $('key').hidden = true; $('keyOpen').hidden = false; };
const EXAMPLE = [
  ['Item', 'used to + infinitive, vs past simple'],
  ['Meaning', 'A past habit or state that is no longer true, contrasted with the present.'],
  ['Technique', 'Timeline: mark a habit spanning several years in the past, then a clear break to "now, not true." Elicit why past simple alone doesn\'t show the contrast.'],
  ['Form', 'used to + base verb (no -ed on the main verb)'],
  ['Pronunciation', '/ˈjuːst tə/: "used to" weakens in connected speech; "use to" is a common learner spelling error worth flagging.']
];
$('stgRows').innerHTML = EXAMPLE.map(r => '<div class="krow"><b>' + esc(r[0]) + '</b><span>' + esc(r[1]) + '</span></div>').join('');
$('stgBtn').onclick = () => { const o = $('stg').hidden; $('stg').hidden = !o; $('stgBtn').textContent = o ? 'Hide staging example' : 'See staging example'; };
'''
