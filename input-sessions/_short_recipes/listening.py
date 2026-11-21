# Connect's 45-minute "Listening — taught the way you'll teach it" (src/app/input-sessions/sessions/listening.tsx), on Lite's
# desk. Content word for word, American spelling; the reveals, the term match, the stage order, the answer key and the
# staging example work as they do on Connect. The dialogue is Lite's recorded house voices (../voices.js, lines in
# listening-short/audio/lines.json): Zoe the woman and Marcus the man of the accent chosen at the top, one line at a time
# with the line shown and the plays counted, as on Connect.
TITLE = 'Listening: taught the way you’ll teach it'
LONG = 'receptive-skills'
SUB = ('This session is staged exactly like the lesson it teaches: pre-taught vocab, a discussion of how listening should be taught, '
       'then listening to a dialogue to check those ideas. Do the tasks first: the debrief afterward is where it gets named.')
NAV = [('s1', '1 · Lead-in'), ('s2', '2 · Pre-teach vocab'), ('s3', '3 · Predict the staging'), ('s4', '4 · Listen to the dialogue'),
       ('s5', '5 · Detail task'), ('s6', '6 · Debrief')]

NOTES = '''<h4>Running this session</h4>
<p>Don’t name “listening” or its stages until the debrief. The audio track is two synthesized voices, not a real recording: flag that once, then play it exactly as many times as each task says, no more.</p>
<h4>Gist really is once only</h4>
<p>Resist replaying for gist even when trainees ask: the pressure is what forces global listening instead of word-by-word decoding.</p>
<h4>The synthetic voice is a known limitation, say so once</h4>
<p>Real material should use authentic or professionally recorded audio: this session models staging, not audio quality.</p>
<h4>Timing (not shown to trainees)</h4>
<p>Lead-in 0–2′ · Pre-teach vocab 2–8′ · Predict the staging 8–11′ · Listen to the dialogue 11–25′ · Detail task + discuss 25–33′ · Debrief + trainer notes 33–45′.</p>
<h4>Pre-teaching vocab shouldn’t pre-teach the answers</h4>
<p>Only clarify words essential to following the audio: over-teaching vocab turns a listening lesson into a vocabulary lesson.</p>'''

BODY = r'''
  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="stage-title">Lead-in <span class="badge">2 minutes</span></div>
      <div class="reveal-card hero" onclick="this.classList.toggle('open')"><div class="q">How many times should you play audio for gist?</div><div class="hint">Click to reveal</div><div class="a">Once.</div></div>
    </div>
  </section>

  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">Pre-teach vocab <span class="badge">6 minutes</span></div>
      <div id="match"></div>
    </div>
  </section>

  <section id="s3" data-n="3">
    <div class="card" data-n="3">
      <div class="stage-title">Stage 2 · Predict the staging <span class="badge">3 minutes</span></div>
      <p class="lead">How do you think a listening lesson should be staged?</p>
      <p class="quiet">Discuss with your partner, about a minute, no wrong answers yet.</p>
    </div>
  </section>

  <section id="s4" data-n="4">
    <div class="card" data-n="4">
      <div class="stage-title">Stage 3 · Listen to the dialogue and check if your ideas were right or wrong <span class="badge">14 minutes</span></div>
      <div class="player">
        <div class="phead">
          <button type="button" class="btn primary" id="play">Play</button>
          <div><p class="ptitle">Zoe asks Marcus: “Staging a listening lesson”</p><p class="pmeta" id="played">Not played yet · two voices</p></div>
        </div>
        <div class="vbar" data-voices-here></div>
        <div class="nowline" id="nowLine" hidden></div>
        <button type="button" class="tlink" id="tBtn">Show transcript</button>
        <div class="transcript" id="transcript" hidden></div>
      </div>
    </div>
  </section>

  <section id="s5" data-n="5">
    <div class="card" data-n="5">
      <div class="stage-title">Stage 4 · Detail task and discuss <span class="badge">8 minutes</span></div>
      <p class="quiet">More time now: answer these from the dialogue, then check with your partner.</p>
      <div id="details"></div>
    </div>
  </section>

  <section id="s6" data-n="6">
    <div class="card" data-n="6">
      <div class="stage-title">Debrief <span class="badge">12 minutes</span></div>
      <div id="order"></div>
      <div id="key"></div>
      <div id="staging"></div>
    </div>
  </section>
'''

STYLE = r'''  .quiet{font-size:.88rem; font-style:italic; color:var(--grey); margin:0 0 10px;}
  .reveal-card .hint{margin-top:4px;} .reveal-card.open .hint{display:none;}
  .reveal-card.hero{max-width:520px; padding:18px 20px;}
  .reveal-card.hero .q{font-family:'Newsreader',Georgia,serif; font-size:1.3rem; line-height:1.25;}
  .text-block p{margin:0 0 10px; line-height:1.6;} .text-block p:last-child{margin-bottom:0;}
  .text-block .tb-title{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.1rem; color:var(--ink);}
  .mhead{display:flex; justify-content:space-between; align-items:baseline; gap:10px; flex-wrap:wrap; font-size:.9rem;}
  .mhead span{color:var(--grey);}
  button.pill{font-family:'Karla',sans-serif; text-align:left; width:100%;}
  button.pill.term{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:.98rem;}
  button.pill.matched{cursor:default;}
  button.pill.opt{min-height:0;}   /* 21 Nov 2026: "opt" is on the meanings for the paper print only (see matchTerms below); on a phone they keep the height they had */
  button.order-line{width:100%; justify-content:flex-start; text-align:left; font-family:'Karla',sans-serif; color:var(--ink);}
  .order-line .num{min-width:26px; height:26px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; text-align:center; background:var(--box); color:var(--grey); font-size:.8rem; flex:none;}
  .order-line.done{border-color:var(--teal); background:color-mix(in oklab, var(--teal) 7%, var(--paper)); cursor:default;}
  .order-line.done .num{background:var(--teal); color:#F0EEE9;}
  .ostatus{font-size:.88rem; color:var(--grey); margin:4px 0 0;}
  .ohead{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.15rem; margin:0 0 4px;}
  .ohead + p{font-size:.88rem; color:var(--grey); margin:0 0 10px;} .ohead + p b{color:var(--ink);}
  .btn-row{margin-top:14px;}
  .keyblock{margin-top:14px; border-top:1px solid var(--row-line); padding-top:12px;}
  .keyhead{display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;}
  .keyhead .lbl{font-size:.74rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--grey);}
  .keyhead .btn-row{margin:0;}
  .keypart{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 16px; margin-top:10px;}
  .keypart h4{margin:0 0 6px; font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.05rem;}
  .krow{display:grid; grid-template-columns:150px 1fr; gap:10px; padding:5px 0; border-bottom:1px solid var(--row-line); font-size:.88rem; line-height:1.45;}
  .krow:last-child{border-bottom:0;} .krow b{font-family:'Newsreader',Georgia,serif;} .krow span{color:var(--grey);}
  .krow.tf{grid-template-columns:1fr;} .krow.tf span{font-style:italic;}
  @media(max-width:560px){ .krow{grid-template-columns:1fr; gap:2px;} }
  .stagebox{margin-top:14px; border-top:1px solid var(--row-line); padding-top:12px;}
  .stagebox h4{margin:12px 0 4px; font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.1rem;}
  table.grid td:nth-child(2){white-space:nowrap;}
  /* 21 Nov 2026: "Print the handout" printed the whole answer key once it had been opened, and the staging example once it had been opened. The key now prints only from its own Print button (body.print-key, set in answerKey below) or in a tutor's print with the notes; the example prints for a tutor only. */
  @media print{ .keyblock{display:block;} body:not(.print-key):not(.tutor) .keyblock, html.hub-clean .keyblock{display:none !important;} .stagebox .btn{display:none;} body:not(.tutor) .stagebox h4, body:not(.tutor) .stagebox table, html.hub-clean .stagebox h4, html.hub-clean .stagebox table{display:none !important;} }
  /* 22 Nov 2026 (Ramy: "Remove the print button from the answer key"): that Print button is gone, so body.print-key is never set and no trainee print carries the key. The rule above stays as it is: a tutor's print and "Print with the answers" are untouched. */
  /* 21 Nov 2026: an answered task printed solved on the handout: matched terms and meanings filled dark, in a heavier weight, with "7 of 7 matched"; the ordered stages with their numbers, their fill and "All 5 in order"; an opened card with its teal edge; "Played 1 time". On paper each prints as it did untouched, without the counts. */
  @media print{
    .mhead span, .ostatus, #played{display:none !important;}
    .pill.matched, .pill.selected{background:var(--field); border-color:var(--sand-line); color:var(--ink);} .pill.matched:not(.term){font-weight:500;}
    .order-line.done{border-color:var(--sand-line); background:var(--paper);}
    .order-line.done .num{background:var(--box); color:var(--grey); font-size:0;} .order-line.done .num::after{content:"?"; font-size:.8rem;}
    .reveal-card.open{border-color:var(--sand-line);}
  }
  .player{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:14px 16px; display:flex; flex-direction:column; gap:10px; align-items:flex-start;}
  .phead{display:flex; align-items:center; gap:14px; flex-wrap:wrap;}
  .ptitle{margin:0; font-weight:600; font-size:.92rem;} .pmeta{margin:2px 0 0; font-size:.84rem; color:var(--grey);}
  .nowline{display:flex; gap:10px; align-items:baseline; background:var(--box); border-radius:var(--r-control); padding:9px 14px; width:100%; font-size:.92rem;}
  .who{flex:none; font-size:.7rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--grey);}
  .nowline .who.zoe{color:oklch(45% 0.09 260);} .nowline .who.marcus{color:var(--teal);}
  .tlink{background:none; border:0; padding:0; font:600 .84rem 'Karla',sans-serif; color:var(--teal); cursor:pointer;}
  .tlink:hover{text-decoration:underline; text-underline-offset:3px;}
  .transcript{border-top:1px solid var(--row-line); padding-top:10px; width:100%; display:flex; flex-direction:column; gap:6px;}
  .transcript .ln{display:flex; gap:10px; font-size:.88rem; line-height:1.5;} .transcript .who{width:60px; padding-top:3px;}
  @media print{ .phead .btn, .tlink, .nowline{display:none !important;} }
  .vbar{width:100%;} .vbar .lite-voices{margin:0;}
'''

SCRIPT = r'''
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const reveal = (q, a) => '<div class="reveal-card" onclick="this.classList.toggle(\'open\')"><div class="q">' + esc(q) + '</div><div class="hint">Click to reveal</div><div class="a">' + esc(a) + '</div></div>';

const TERMS = [
  ['Gist', 'Listening once for the general idea, not the details.'],
  ['Detail', 'Particular facts a listener listens for on a second, closer pass.'],
  ['Prediction', 'Guessing content from a title, picture or context before listening.'],
  ['Authentic audio', 'A real recording made for real listeners, not simplified for learners.'],
  ['Scaffolding', 'Support given before a task, e.g. seeing the questions before you listen.'],
  ['Peer check', 'Comparing answers with a partner before whole-class feedback.'],
  ['Jigsaw listening', 'Each pair hears a different part of the audio, then shares to complete the picture.']
];
const DIALOGUE = [
  ['Zoe', 'I need to plan a listening lesson for my CELTA course.'],
  ['Zoe', 'Okay so for the listening lesson, I was just going to play the recording like five times until they get it. Foolproof, right?'],
  ['Marcus', 'Please don’t. If you play it five times you’re not testing listening, you’re testing memory. One play for gist, that’s it.'],
  ['Zoe', 'Should I at least get them to guess what it’s about first, from a picture or the title?'],
  ['Marcus', 'Yes, that’s prediction, and it primes them before they’ve heard a single word.'],
  ['Zoe', 'Fine. But can I pre-teach every single word first, just so nothing surprises them?'],
  ['Marcus', 'Also no! Only the words they truly can’t survive without. Otherwise you’ve taught a vocab lesson wearing a listening costume.'],
  ['Zoe', 'A listening costume. Great. And should I record this myself, or find something real?'],
  ['Marcus', 'Authentic audio if you can get it: a real recording beats a scripted one every time.'],
  ['Zoe', 'Okay: lead-in, prediction, pre-teach, then play once for gist. What am I even asking them, “did you enjoy that”?'],
  ['Marcus', 'Close! Something broad: who’s talking, where are they, what’s the general idea. Save the tricky detail questions for later.'],
  ['Zoe', 'Later meaning... a second play? I thought you just told me off for replaying it.'],
  ['Marcus', 'Different task, different rules. For detail work, a replay or two is totally fair: that’s the harder listening, they’ve earned it.'],
  ['Zoe', 'Okay so once they’ve got their answers, I just tell them if they’re right?'],
  ['Marcus', 'Nope, get them to peer check with each other first. Way less scary than you looming over them with the answer key.'],
  ['Zoe', 'I don’t loom! ...okay maybe a little. And after all that, we’re done?'],
  ['Marcus', 'Almost: give them a follow-up task tied to the content, so the listening actually leads somewhere instead of just ending.'],
  ['Zoe', 'Should I scaffold any of this, or just throw them in?'],
  ['Marcus', 'A bit of scaffolding helps: give them the questions before they listen, not after.'],
  ['Zoe', 'What about jigsaw listening, is that for another day?'],
  ['Marcus', 'Definitely another day: that’s each pair hearing a different half of the audio, then piecing it together.'],
  ['Zoe', 'Oh, two by two, thank you very much, that actually sounds pretty easy now.']
];
const DETAILS = [
  ['It’s fine to jump straight into playing the audio with no lead-in.', 'False: background knowledge helps students follow what they’ll hear.'],
  ['All new vocabulary in the recording should be pre-taught first.', 'False: only what’s essential to following the audio.'],
  ['Students should hear the recording more than once on the first listen.', 'False: gist is once only.'],
  ['A replay is expected for the detail task.', 'True.'],
  ['Peer check happens before whole-class feedback.', 'True.'],
  ['The lesson should end right after the detail task, with no follow-up.', 'False: a follow-up task connects to the content or language.']
];
const CORRECT_ORDER = ['Lead-in', 'Pre-teach vocab', 'Predict the staging', 'Listen to the dialogue, check ideas', 'Detail task'];
const SHUFFLED = ['Detail task', 'Pre-teach vocab', 'Predict the staging', 'Lead-in', 'Listen to the dialogue, check ideas'];
const EXAMPLE_TITLE = 'Example lesson: a phone call about a delayed flight';
const EXAMPLE_ROWS = [
  ['Lead-in', '3′', 'Ss look at a photo of an airport departures board: “What’s happening here?”'],
  ['Pre-teach vocab', '5′', 'Clarify “delayed,” “gate,” “boarding”: only what’s essential to follow the call.'],
  ['Gist', '5′', 'Play once: “Why is she calling?”'],
  ['Detail', '15′', 'Play again (2–3 times): specific questions on times, reasons, next steps.'],
  ['Follow-on', '12′', 'Ss roleplay their own “delayed flight” phone call using the new vocab.']
];

// ---------- match each term to its meaning (Connect's MatchTermsExercise; the right column is mixed at each load, 22 Nov 2026; a wrong pair flashes red and clears) ----------
function matchTerms(el, terms){
  let selL = null, selR = null, matched = new Set(), shake = [];
  // 22 Nov 2026 (Ramy: "just fix it"): the meanings stood in the terms' order reversed, so the pairs could be read off. They are now mixed afresh each time the page loads (a Fisher-Yates shuffle), never in the terms' order or its exact reverse. The terms keep their order, and a pair is still matched by its number (data-l, data-r), not by where it stands.
  const right = terms.map((_, i) => i);
  if (right.length > 2) do { for (let i = right.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [right[i], right[j]] = [right[j], right[i]]; } } while (right.every((v, i) => v === i) || right.every((v, i) => v === right.length - 1 - i));
  const cls = (i, sel, side) => matched.has(i) ? ' matched' : (shake[side] === i ? ' wrong' : sel === i ? ' selected' : '');
  function draw(){
    // 21 Nov 2026: each meaning carries "opt" (an answer option, which the paper print in library.js keeps). Without it "Print the handout" left out the meaning of Gist, "Listening once for the general idea, not the details.": it starts with "Listen", so it was taken for a button that works the page.
    el.innerHTML = '<div class="mhead"><b>Match each term to its meaning</b><span>' + matched.size + ' of ' + terms.length + ' matched</span></div>'
      + '<div class="pill-match-wrap"><div class="pill-col">' + terms.map((t, i) => '<button type="button" class="pill term' + cls(i, selL, 0) + '" data-l="' + i + '">' + esc(t[0]) + '</button>').join('') + '</div>'
      + '<div class="pill-col">' + right.map(i => '<button type="button" class="pill opt' + cls(i, selR, 1) + '" data-r="' + i + '">' + esc(terms[i][1]) + '</button>').join('') + '</div></div>';
  }
  function tryMatch(){
    if (selL === null || selR === null) return;
    if (selL === selR) { matched.add(selL); selL = selR = null; }
    else { shake = [selL, selR]; setTimeout(() => { selL = selR = null; shake = []; draw(); }, 400); }
  }
  el.addEventListener('click', e => {
    if (shake.length) return;
    const l = e.target.closest('[data-l]'), r = e.target.closest('[data-r]');
    if (l && !matched.has(+l.dataset.l)) { selL = +l.dataset.l; tryMatch(); draw(); }
    if (r && !matched.has(+r.dataset.r)) { selR = +r.dataset.r; tryMatch(); draw(); }
  });
  draw();
}

// ---------- put the stages back in order (Connect's OrderExercise: only the correct next one locks in) ----------
function orderEx(el, correct, shuffled, title, intro){
  let picked = [];
  function draw(){
    const done = picked.length === correct.length;
    el.innerHTML = '<p class="ohead">' + title + '</p><p>' + intro + '</p>'
      + shuffled.map(lbl => { const idx = picked.indexOf(lbl);
          return '<button type="button" class="order-line' + (idx !== -1 ? ' done' : '') + '" data-o="' + esc(lbl) + '"><span class="num">' + (idx !== -1 ? idx + 1 : '?') + '</span><span>' + esc(lbl) + '</span></button>'; }).join('')
      + '<p class="ostatus">' + (done ? 'All ' + correct.length + ' in order: that’s the staging.' : picked.length + ' of ' + correct.length + ' placed: click the one that comes next.') + '</p>';
  }
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-o]'); if (!b) return;
    const lbl = b.dataset.o;
    if (picked.indexOf(lbl) === -1 && correct[picked.length] === lbl) { picked.push(lbl); draw(); }
  });
  draw();
}

// ---------- the answer key: hidden, then a handout to keep ----------
function answerKey(el, terms, details){
  let open = false;
  function draw(){
    if (!open) { el.innerHTML = '<div class="btn-row"><button type="button" class="btn" data-k="open">Reveal answer key</button></div>'; return; }   // 22 Nov 2026 (Ramy: "Remove the print button from the answer key"): the label no longer promises a print
    el.innerHTML = '<div class="keyblock"><div class="keyhead"><span class="lbl">Answer key: handout, to keep</span><div class="btn-row"><button type="button" class="btn" data-k="hide">Hide</button></div></div>'   // 22 Nov 2026 (Ramy: "Remove the print button from the answer key"): Hide is the only button here now
      + (terms.length ? '<div class="keypart"><h4>Terms</h4>' + terms.map(t => '<div class="krow"><b>' + esc(t[0]) + '</b><span>' + esc(t[1]) + '</span></div>').join('') + '</div>' : '')
      + (details.length ? '<div class="keypart"><h4>True or false</h4>' + details.map(d => '<div class="krow tf"><b>' + esc(d[0]) + '</b><span>' + esc(d[1]) + '</span></div>').join('') + '</div>' : '')
      + '</div>';
  }
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-k]'); if (!b) return;
    if (b.dataset.k === 'open') open = true; else if (b.dataset.k === 'hide') open = false; else return;   // 22 Nov 2026 (Ramy: "Remove the print button from the answer key"): the key has no Print button, so nothing here prints
    draw();
  });
  draw();
}

// ---------- the staging example ----------
function stagingEx(el, title, rows){
  let open = false;
  function draw(){
    el.innerHTML = '<div class="stagebox"><div class="btn-row"><button type="button" class="btn" data-s>' + (open ? 'Hide staging example' : 'See staging example') + '</button></div>'
      + (open ? '<h4>' + esc(title) + '</h4><table class="grid"><thead><tr><th>Stage</th><th>Time</th><th>Procedure</th></tr></thead><tbody>'
          + rows.map(r => '<tr><td><b>' + esc(r[0]) + '</b></td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>').join('') + '</tbody></table>' : '') + '</div>';
  }
  el.addEventListener('click', e => { if (e.target.closest('[data-s]')) { open = !open; draw(); } });
  draw();
}


// ---------- the dialogue: Lite's house voices, Zoe the woman and Marcus the man of the chosen accent ----------
// Played here line by line (not LiteVoice.sayAll) so each line can be shown as it is heard, as on Connect's DialoguePlayer.
// The file is the one voices.js would play: audio/<accent>-<woman|man>/<LiteVoice.fileFor(line)>.mp3. A line with no
// recording yet is spoken by the browser, as voices.js does.
const player = new Audio();
let speaking = false, played = 0, cancelled = false, at = -1;
function voiceFor(who){
  const on = document.querySelector('#liteVoices button.on[data-voice]');
  const chosen = on ? on.getAttribute('data-voice') : 'uk-woman';
  return chosen.split('-')[0] + '-' + (who === 'Zoe' ? 'woman' : 'man');
}
function showLine(i){
  const el = $('nowLine');
  if (i < 0) { el.hidden = true; el.innerHTML = ''; return; }
  const l = DIALOGUE[i]; el.hidden = false;
  el.innerHTML = '<span class="who ' + l[0].toLowerCase() + '">' + l[0] + '</span><span>' + esc(l[1]) + '</span>';
}
function drawPlayer(){
  $('play').textContent = speaking ? 'Stop' : 'Play';
  $('played').textContent = (played === 0 ? 'Not played yet' : 'Played ' + played + ' time' + (played > 1 ? 's' : '')) + ' · two voices';
}
function finish(){ speaking = false; at = -1; showLine(-1); drawPlayer(); }
function stop(){ cancelled = true; player.pause(); if (window.speechSynthesis) speechSynthesis.cancel(); finish(); }
function browserLine(line, then){
  if (!window.speechSynthesis) { then(); return; }
  const u = new SpeechSynthesisUtterance(line[1]);
  u.lang = /^us/.test(voiceFor(line[0])) ? 'en-US' : 'en-GB'; u.rate = 0.94; u.pitch = line[0] === 'Zoe' ? 1.12 : 0.9;
  u.onend = then; u.onerror = then;
  speechSynthesis.speak(u);
}
function next(i){
  if (cancelled) return;
  if (i >= DIALOGUE.length) { finish(); return; }
  const line = DIALOGUE[i]; at = i; showLine(i);
  const after = () => { if (!cancelled && at === i) setTimeout(() => next(i + 1), 320); };
  player.onended = after;
  player.src = 'audio/' + voiceFor(line[0]) + '/' + LiteVoice.fileFor(line[1]) + '.mp3';
  const p = player.play(); if (p && p.catch) p.catch(() => { if (!cancelled && at === i) browserLine(line, after); });
}
$('play').onclick = () => {
  if (speaking) { stop(); return; }
  cancelled = false; if (window.speechSynthesis) speechSynthesis.cancel();
  speaking = true; played++; drawPlayer();
  next(0);
};
window.addEventListener('pagehide', () => { cancelled = true; player.pause(); if (window.speechSynthesis) speechSynthesis.cancel(); });
$('transcript').innerHTML = DIALOGUE.map(l => '<div class="ln"><span class="who">' + l[0] + '</span><span>' + esc(l[1]) + '</span></div>').join('');
$('tBtn').onclick = () => { const t = $('transcript'); t.hidden = !t.hidden; $('tBtn').textContent = t.hidden ? 'Show transcript' : 'Hide transcript'; };
drawPlayer();

matchTerms($('match'), TERMS);
$('details').innerHTML = DETAILS.map(d => reveal(d[0], d[1])).join('');
orderEx($('order'), CORRECT_ORDER, SHUFFLED, 'Debrief: put the stages back in order',
  'Click each stage in the order you just experienced it. This is a <b>loop input</b>: the session modeled the framework instead of only describing it.');
answerKey($('key'), TERMS, DETAILS);
stagingEx($('staging'), EXAMPLE_TITLE, EXAMPLE_ROWS);
'''
