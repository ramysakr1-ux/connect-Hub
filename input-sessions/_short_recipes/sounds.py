# Connect's 45-minute "Sounds." (src/app/input-sessions/sessions/sounds.tsx), on Lite's desk. Content word for word,
# American spelling; IPA exactly as Connect has it. Every sound is one of Lite's four recorded house voices (../voices.js,
# lines in sounds-short/audio/lines.json), not the browser's speech: a symbol is heard in its example word, as on the long
# session. The clap game gives each round the next word of a fixed mixed sequence, the same for the whole room (Connect's
# drawWord gave the same word every round). The stage-by-stage trainer script (StaffOnly on Connect) is in NOTES.
TITLE = 'Sounds'
LONG = 'phonology-sounds'
SUB = 'Every phoneme and minimal pair on this page is spoken aloud, not just written as a symbol. Click any word or symbol to hear it.'
NAV = [('s1', '1 · Lead-in'), ('s2', '2 · Terminology'), ('s3', '3 · Where the sound is made'), ('s4', '4 · The phonemic chart'),
       ('s5', '5 · Articulation'), ('s6', '6 · Where learners struggle'), ('s7', '7 · Clap game'), ('s8', '8 · Dictation')]

NOTES = '''<h4>0–2 · Play both, cold</h4>
<p>Say nothing first. Play "ship" then "sheep" and ask by show of hands which was which. Some will be wrong: that's the point, not a problem to fix yet.</p>
<h4>2–10 · Chart, sound then word</h4>
<p>Go symbol by symbol. Click for the example word, model the isolated sound yourself, and ask trainees to repeat both before moving on. Don't explain IPA conventions yet: let the sound come first.</p>
<h4>10–17 · Articulation, on the real chart</h4>
<p>Open Seeing Speech on the shared screen. Click each of the four sounds on the real IPA chart and let the video play: real ultrasound or MRI, not a drawing. Trainees write down, for each sound, what they actually saw: tongue height, lip shape, whether the tongue touches the teeth. Then have them mouth the shape silently before they voice it: isolates the articulation from the sound itself.</p>
<h4>17–25 · Learner struggles, by L1</h4>
<p>Read each pair's "who" line aloud and ask if anyone has taught (or is) a speaker of that L1. Real anecdotes land harder than the printed note: let the room supply them.</p>
<h4>25–38 · Clap game, as a class would run it</h4>
<p>Run it exactly as staged: play, play again if needed, then clap. After two rounds, stop and ask: "What would you change running this with eight A2 students instead of six trainees?": slower pace, fewer pairs at once, more repetition.</p>
<h4>38–43 · Dictation, spelling betrays them</h4>
<p>These three words are chosen because the spelling actively misleads. Let trainees get it wrong once before revealing: the surprise is the lesson.</p>
<h4>43–45 · Close on the transfer question</h4>
<p>One minute: "Which of today's four sounds is most likely to come up in your own TP group, based on their L1s?" No feedback needed: just plant it before they plan.</p>'''

BODY = r'''
  <div class="pre">
    <div class="feeds"><p class="label">What you're actually learning to teach</p><p>Hearing "ship" and "sheep" apart is the easy part: you already can. The job is teaching a student who genuinely can't yet: knowing why they can't, what to do with your mouth to show the difference, and which pairs are worth drilling for their L1. That's what the next two sections are for.</p></div>
    <div class="vbar" data-voices-here></div>
  </div>

  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="stage-title">Lead-in <span class="badge">2 minutes</span></div>
      <div class="box row"><button class="play" type="button" id="lead">Play</button><p>Listen: "ship" then "sheep." Same spelling pattern almost, one letter of difference on the page. Can you hear which is which without seeing the words?</p></div>
    </div>
  </section>

  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">Terminology: match it up</div>
      <div class="mhead"><p class="lead">Click a term, then click the definition you think it goes with.</p><span class="count" id="mCount"></span></div>
      <div class="pill-match-wrap"><div class="pill-col" id="mLeft"></div><div class="pill-col" id="mRight"></div></div>
    </div>
  </section>

  <section id="s3" data-n="3">
    <div class="card" data-n="3">
      <div class="stage-title">Where the sound is made</div>
      <p class="lead">Click each sound to hear it, then say it back yourself and notice where your own tongue, lips or teeth move.</p>
      <div class="box"><p class="fb" style="margin:0 0 10px">Consonants are formed when airflow from the lungs is obstructed by the moveable parts of the mouth: tongue, teeth, lips, palate. Click a sound to hear it in a word and see where it's obstructed.</p><div class="opts" id="obs"></div></div>
    </div>
  </section>

  <section id="s4" data-n="4">
    <div class="card" data-n="4">
      <div class="stage-title">The phonemic chart, spoken <span class="badge">8 minutes</span></div>
      <p class="lead">Click any symbol to hear its sound in a real word.</p>
      <div class="chart" id="chart"></div>
    </div>
  </section>

  <section id="s5" data-n="5">
    <div class="card" data-n="5">
      <div class="stage-title">Articulation: how to physically produce it</div>
      <p class="lead">A learner can't copy a written symbol: they need to see the mouth move. On the site below, click each of these four sounds on the real IPA chart and watch the video, then write down what you actually see (tongue, lips, teeth) before checking it against the summary underneath.</p>
      <div class="link-card"><span class="lc-text">Show the real thing rather than a diagram: <b>Seeing Speech</b> is a clickable IPA chart with real ultrasound, MRI and animated vocal-tract video for every sound, free.</span><a href="https://www.seeingspeech.ac.uk/ipa-charts/" target="_blank" rel="noreferrer">seeingspeech.ac.uk</a></div>
      <div id="artic"></div>
    </div>
  </section>

  <section id="s6" data-n="6">
    <div class="card" data-n="6">
      <div class="stage-title">Where learners typically struggle</div>
      <p class="lead">The same four pairs from the clap game: each is a known trouble spot for a common set of L1 backgrounds.</p>
      <div id="struggles"></div>
    </div>
  </section>

  <section id="s7" data-n="7">
    <div class="card" data-n="7">
      <div class="stage-title">Now try it yourself: clap for what you heard <span class="badge">15 minutes</span></div>
      <div class="mhead"><p class="lead">The same drill, from the student's seat. Hit Play to hear the word (Play again repeats it), then clap the pad you heard. The next Play gives the next word, the same one for everyone in the room: the technique you'd run live with a class.</p><span class="count" id="clapCount"></span></div>
      <div id="clap"></div>
    </div>
  </section>

  <section id="s8" data-n="8">
    <div class="card" data-n="8">
      <div class="stage-title">Dictation: sound to spelling <span class="badge">13 minutes</span></div>
      <p class="lead">English spelling doesn't reliably show pronunciation. Listen and pick the word that matches the sound, not the sound that matches the usual spelling.</p>
      <div id="dict"></div>
    </div>
  </section>
'''

STYLE = r'''
  .pre{padding:18px 0 4px; display:flex; flex-direction:column; gap:10px;}
  .feeds{background:var(--paper); border:1px solid var(--sand-line); border-left:4px solid var(--teal); border-radius:var(--r-strip); padding:12px 16px;}
  .feeds p:last-child{margin:0; font-size:.92rem; line-height:1.6;}
  .play{display:inline-flex; align-items:center; justify-content:center; background:var(--teal); color:var(--paper); border:none; border-radius:999px !important; padding:5px 14px; font:700 .78rem 'Karla',sans-serif; cursor:pointer; min-height:34px; flex:none;}
  .play:hover{background:var(--teal-lifted);}
  .box{background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 16px; margin:8px 0;}
  .row{display:flex; align-items:center; gap:12px; flex-wrap:wrap;}
  .row > p{flex:1 1 220px; margin:0; font-size:.92rem; line-height:1.55;}
  .fb{margin:8px 0 0; font-size:.9rem; line-height:1.55; color:var(--ink);}
  .opts{display:flex; flex-wrap:wrap; gap:8px;}
  .opt{background:var(--field); border:1.5px solid var(--sand-line); border-radius:999px; padding:7px 14px; font:600 .86rem 'Karla',sans-serif; color:var(--ink); cursor:pointer; min-height:36px; text-align:left;}
  .opt:hover{border-color:var(--gold);}
  .opt.right{background:var(--teal); border-color:var(--teal); color:var(--paper);}
  .opt.miss{border-color:var(--brick); color:var(--brick); background:color-mix(in oklab, var(--brick) 6%, var(--paper));}
  .sym{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.05rem;}
  .opt .place{font-weight:400; color:var(--grey); margin-left:4px;}
  .mhead{display:flex; justify-content:space-between; align-items:baseline; gap:10px; flex-wrap:wrap;}
  .mhead .lead{margin:0; flex:1 1 300px;}
  .count{font-size:.84rem; font-weight:600; color:var(--grey);}
  .pill-col .pill{text-align:left; width:100%;}
  .pill-col .pill.term{font-weight:700;}
  .pill.matched{cursor:default;}
  .chart{display:grid; grid-template-columns:repeat(8, 1fr); gap:6px; margin-top:6px;}
  @media(max-width:640px){ .chart{grid-template-columns:repeat(4, 1fr);} }
  .chart button{display:flex; flex-direction:column; align-items:center; gap:2px; background:var(--paper); border:1.5px solid var(--sand-line); padding:10px 4px; cursor:pointer;}
  .chart button:hover{border-color:var(--gold);}
  .chart .sym{font-size:1.3rem;}
  .chart small{font-size:.74rem; color:var(--grey);}
  .art{display:flex; align-items:center; gap:12px; width:100%; text-align:left; background:var(--paper); border:1px solid var(--sand-line); border-radius:var(--r-strip); padding:12px 14px; margin:8px 0; cursor:pointer; font:inherit; color:var(--ink);}
  .art:hover{border-color:var(--gold);}
  .art .play{pointer-events:none; order:-1;}   /* 21 Nov 2026: "Play" is last in the row's markup (see the script) and first on the screen, as before */
  .art .sym{width:46px; flex:none; font-size:1.3rem;}
  .art .how{flex:1; font-size:.88rem; line-height:1.5; color:var(--grey);}
  .strug .top{display:flex; align-items:baseline; gap:10px; flex-wrap:wrap;}
  .strug .who{font-size:.68rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--grey);}
  .strug p.n{margin:4px 0 0; font-size:.88rem; line-height:1.55; color:var(--grey);}
  .clap{display:flex; align-items:center; gap:12px; flex-wrap:wrap;}
  .pads{display:flex; gap:10px; flex:1 1 220px;}
  .pad{flex:1; border:2px solid var(--sand-line); background:var(--paper); border-radius:999px !important; padding:11px 8px; font:700 1.02rem 'Newsreader',Georgia,serif; color:var(--ink); cursor:pointer;}
  .pad:hover{border-color:var(--gold);}
  .pad.right{border-color:var(--teal); background:var(--teal); color:var(--paper);}
  .pad.miss{border-color:var(--brick); color:var(--brick); background:color-mix(in oklab, var(--brick) 6%, var(--paper));}
  .st{width:70px; flex:none; text-align:right; font-size:.86rem; font-weight:700;}
  .st.good{color:var(--teal);} .st.bad{color:var(--brick);}
  .dict{display:flex; align-items:center; gap:12px; flex-wrap:wrap;}
  .dict .opts{flex:1 1 220px;}
  @media print{ .play{display:none !important;} }
  /* 21 Nov 2026: an answered task printed solved on the handout: "Correct", "Not quite" and "Try again" beside a clapped pair or a chosen word, and matched definitions in a heavier weight. On paper each row prints as it did untouched. */
  @media print{ .st{display:none !important;} .pill.matched:not(.term){font-weight:500;} }
  .vbar .lite-voices{margin:0;}
  .opt .eg{font-style:italic; margin-left:4px;}
  .art .sym small{display:block; font-family:'Karla',sans-serif; font-size:.74rem; font-weight:600; color:var(--grey);}
  .st{width:auto; min-width:70px;}
'''

SCRIPT = r'''
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
// ---------- the voice: Lite's four house voices (../voices.js), recorded into audio/<voice>/; the bar sits at the top ----------
// A symbol is heard in its example word, as on the long session: a recorded voice cannot say /b/ or /θ/ on its own.
const say = text => LiteVoice.say(text);
// the second word starts about 900 ms after the first, as on Connect: the gap runs from the end of the first recording
const sayTwo = (a, b) => LiteVoice.sayAll([{ text: a }, { text: b, gap: 450 }]);

// ---------- 1. Lead-in ----------
$('lead').onclick = () => sayTwo('ship', 'sheep');

// ---------- 2. Terminology: a term first, then its definition; a wrong definition flashes ----------
const MATCH = [
  ['Vowels', "are formed by modifying the airflow's passage through the mouth, principally with the tongue and lips"],
  ['Diphthongs', 'are a glide from one vowel to another'],
  ['Monophthongs', 'are single vowels'],
  ['Consonants', 'are formed when the airflow from the lungs is obstructed by the moveable parts of the mouth, including the tongue and the lips'],
  ['Voiced consonants', 'are formed by activating the vocal cords'],
  ['Unvoiced consonants', 'do not require the activation of vocal cords']
];
(function(){
  const right = MATCH.map((_, i) => i).reverse();
  let sel = null, wrong = null, solved = new Set(), t = null;
  function draw(){
    $('mCount').textContent = solved.size ? solved.size + ' of ' + MATCH.length + ' matched' : '';
    $('mLeft').innerHTML = MATCH.map((m, i) => '<button type="button" class="pill term' + (solved.has(i) ? ' matched' : sel === i ? ' selected' : '') + '" data-l="' + i + '">' + esc(m[0]) + '</button>').join('');
    $('mRight').innerHTML = right.map(i => '<button type="button" class="pill' + (solved.has(i) ? ' matched' : wrong === i ? ' wrong' : '') + '" data-r="' + i + '">' + esc(MATCH[i][1]) + '</button>').join('');
  }
  document.querySelector('#s2 .pill-match-wrap').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.l !== undefined) { const i = +b.dataset.l; if (solved.has(i)) return; sel = i; wrong = null; }
    else {
      const i = +b.dataset.r; if (sel === null || solved.has(i)) return;
      if (sel === i) { solved.add(i); sel = null; wrong = null; }
      else { wrong = i; clearTimeout(t); t = setTimeout(() => { wrong = null; draw(); }, 700); }
    }
    draw();
  });
  draw();
})();

// ---------- 3. Where the sound is made ----------
const OBS = [['b', 'ban', 'lips'], ['m', 'man', 'lips'], ['v', 'van', 'lips and teeth'], ['n', 'nan', 'tongue tip, alveolar ridge'], ['t', 'tan', 'tongue tip, alveolar ridge'], ['k', 'can', 'tongue back, velum']];
$('obs').innerHTML = OBS.map((o, i) => '<button type="button" class="opt" data-o="' + i + '"><span class="sym">/' + o[0] + '/</span><span class="eg">' + o[1] + '</span><span class="place">' + esc(o[2]) + '</span></button>').join('');
$('obs').addEventListener('click', e => { const b = e.target.closest('[data-o]'); if (!b) return; say(OBS[b.dataset.o][1]); });

// ---------- 4. The phonemic chart ----------
const CHART = [['iː','sheep'],['ɪ','ship'],['ʊ','book'],['uː','boot'],['e','bed'],['ə','about'],['ɜː','bird'],['ɔː','door'],['æ','cat'],['ʌ','cup'],['ɑː','car'],['ɒ','hot'],['p','pen'],['b','bad'],['θ','think'],['ð','this']];
$('chart').innerHTML = CHART.map((c, i) => '<button type="button" data-c="' + i + '"><span class="sym">/' + c[0] + '/</span><small>' + c[1] + '</small></button>').join('');
$('chart').addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (!b) return; say(CHART[b.dataset.c][1]); });

// ---------- 5. Articulation ----------
// each sound with the word it is heard in (the chart's own words)
const ARTIC = [
  ['iː', 'sheep', 'Lips spread wide, like a small smile. Tongue high and forward, tense. Longer than /ɪ/.'],
  ['ɪ', 'ship', 'Lips relaxed, more open than /iː/. Tongue lower and more central, muscles relaxed. Shorter.'],
  ['θ', 'think', 'Tongue tip between the teeth, air pushed through: voiceless, so no vocal cord buzz. Compare with /ð/, same position, voiced.'],
  ['ð', 'this', 'Same tongue position as /θ/, tongue tip between the teeth, but voiced, so the vocal cords buzz. Put a hand on your throat to feel the difference.']
];
// 21 Nov 2026: each row is one button, and with "Play" as its first word the print took the whole row for a control and left it off the handout: part 5 printed without its four sounds and their summaries. "Play" now comes last in the row's markup and is put back first on the screen by the stylesheet (.art .play{order:-1}).
$('artic').innerHTML = ARTIC.map((a, i) => '<button type="button" class="art" data-a="' + i + '"><span class="sym">/' + a[0] + '/<small>' + a[1] + '</small></span><span class="how">' + esc(a[2]) + '</span><span class="play">Play</span></button>').join('');
$('artic').addEventListener('click', e => { const b = e.target.closest('[data-a]'); if (!b) return; say(ARTIC[b.dataset.a][1]); });

// ---------- 6. Struggles ----------
const STRUG = [
  ['/iː/ vs /ɪ/: sheep / ship', 'Turkish, Spanish, Japanese, Korean speakers', "Many languages have only one vowel in this space. Learners often can't hear the contrast before they can produce it: the ear has to be trained first, which is why this session leads with listening."],
  ['/θ/ vs /ð/: think / this', 'Almost every L1 without a dental fricative', 'Commonly replaced with /s/, /z/, /t/, or /d/ (French: "zis" for "this"; many Asian L1s: "tink" for "think"). Showing the tongue position directly is far more effective than describing it.'],
  ['/r/ vs /l/: right / light', 'Japanese, Korean speakers', 'A famously hard pair because many East Asian languages have one sound occupying the space between English /r/ and /l/. Needs sustained, low-pressure drilling rather than one-off correction.'],
  ['/v/ vs /w/: vest / west', 'German, Turkish, Hindi speakers', "Some L1s don't distinguish these, or map both onto one sound. Lip position is the visible cue worth demonstrating: teeth on lip for /v/, rounded lips for /w/."]
];
$('struggles').innerHTML = STRUG.map(s => '<div class="box strug"><div class="top"><span class="sym">' + esc(s[0]) + '</span><span class="who">' + esc(s[1]) + '</span></div><p class="n">' + esc(s[2]) + '</p></div>').join('');

// ---------- 7. Clap game: the hidden word is the same for everyone in the room (Ramy, 21 Oct 2026) ----------
// Each round takes the next word of a fixed sequence that mixes the pair's two words, the same on every device, so round 3
// is the same word for the whole class. Play starts a round, Play again repeats its word; once the pad is clapped, the
// next Play starts the next round. (Connect's drawWord gave the same word every round.)
const PAIRS = [['ship', 'sheep'], ['sink', 'think'], ['light', 'right'], ['vest', 'west']];
const MIX = [1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1];   // which word of the pair, round by round; each pair starts at its own place
const wordFor = (i, round) => MIX[(round + i * 3) % MIX.length];
const answer = {}, picks = {}, waiting = {}, round = {};
function drawClap(){
  const done = Object.keys(picks).length, right = Object.values(picks).filter(v => v === 'correct').length;
  $('clapCount').textContent = done ? right + ' of ' + done + ' correct' : '';
  $('clap').innerHTML = PAIRS.map((p, i) => {
    const picked = picks[i], hidden = answer[i];
    const pads = [0, 1].map(k => {
      const cls = picked ? (k === hidden ? ' right' : picked === 'wrong' ? ' miss' : '') : '';
      return '<button type="button" class="pad' + cls + '" data-p="' + i + '" data-k="' + k + '">👏 ' + p[k] + '</button>';
    }).join('');
    const st = picked ? (picked === 'correct' ? 'Correct' : 'Not quite') : waiting[i] ? 'Play first' : '';
    const label = answer[i] === undefined || picked ? 'Play' : 'Play again';
    return '<div class="box clap"><button type="button" class="play" data-replay="' + i + '">' + label + '</button><div class="pads">' + pads + '</div><span class="st ' + (picked === 'correct' ? 'good' : 'bad') + '">' + st + '</span></div>';
  }).join('');
}
$('clap').addEventListener('click', e => {
  const r = e.target.closest('[data-replay]');
  if (r) {
    const i = +r.dataset.replay;
    if (answer[i] === undefined || picks[i]) { round[i] = round[i] === undefined ? 0 : round[i] + 1; answer[i] = wordFor(i, round[i]); delete picks[i]; }
    delete waiting[i]; drawClap(); say(PAIRS[i][answer[i]]); return;
  }
  const b = e.target.closest('[data-p]'); if (!b) return;
  const i = +b.dataset.p; if (picks[i]) return;
  if (answer[i] === undefined) { waiting[i] = true; drawClap(); return; }
  picks[i] = +b.dataset.k === answer[i] ? 'correct' : 'wrong'; drawClap();
});
drawClap();

// ---------- 8. Dictation ----------
const DICT = [['through', ['though', 'thorough', 'tough']], ['colonel', ['kernel', 'coronal', 'colonial']], ['debt', ['debit', 'deb', 'debate']]];
const dPick = {};
function drawDict(){
  $('dict').innerHTML = DICT.map((d, di) => {
    const pick = dPick[di];
    const opts = [d[0]].concat(d[1]).map(o => '<button type="button" class="opt' + (pick === o ? (o === d[0] ? ' right' : ' miss') : '') + '" data-d="' + di + '" data-w="' + o + '">' + o + '</button>').join('');
    return '<div class="box dict"><button type="button" class="play" data-say-d="' + di + '">Play</button><div class="opts">' + opts + '</div>' + (pick ? '<span class="st ' + (pick === d[0] ? 'good">Correct' : 'bad">Try again') + '</span>' : '') + '</div>';
  }).join('');
}
$('dict').addEventListener('click', e => {
  const s = e.target.closest('[data-say-d]'); if (s) { say(DICT[s.dataset.sayD][0]); return; }
  const b = e.target.closest('[data-d]'); if (!b) return; dPick[b.dataset.d] = b.dataset.w; drawDict();
});
drawDict();
'''
