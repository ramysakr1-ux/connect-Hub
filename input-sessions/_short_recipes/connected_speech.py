# Connect's 45-minute "Connected speech." (src/app/input-sessions/sessions/connected-speech.tsx), on Lite's desk.
# Content word for word, American spelling. Every clip is one of Lite's four recorded house voices (../voices.js, lines
# in connected-speech-short/audio/lines.json), each recorded at natural speed with the feature it shows; the ones the long
# session already has are its own recordings.
# The stage-by-stage trainer script (StaffOnly on Connect) is in NOTES.
TITLE = 'Connected speech'
LONG = 'connected-speech'
SUB = 'Five features, one example each: strong and weak forms, linking, intrusion, assimilation, elision.'
NAV = [('s1', '1 · Lead-in'), ('s2', '2 · Terminology match'), ('s3', '3 · Strong and weak forms'), ('s4', '4 · Linking'),
       ('s5', '5 · Intrusion'), ('s6', '6 · Assimilation'), ('s7', '7 · Elision'), ('s8', '8 · Close')]

NOTES = '''<h4>0–3 · Lead-in: "gonna"</h4>
<p>Play it cold, no spelling shown. Ask what they heard, then reveal it's "going to." Name the session's promise: five reasons English doesn't sound like it's spelled, two examples each.</p>
<h4>3–7 · Terminology match</h4>
<p>Have trainees match the five terms to their definitions before any audio. This is the vocabulary they need for the rest of the session and for their LRT write-up: get it settled before the listening starts.</p>
<h4>7–14 · Strong and weak forms, 3 items</h4>
<p>Play each sentence, let trainees guess which vowel they heard before revealing. After all three, ask them to say each sentence back themselves using the weak form: producing it is what makes it stick.</p>
<h4>14–22 · Linking, 3 items</h4>
<p>After each guess, replay the careful word-by-word version so the join is audible only by contrast. Ask: what do the examples have in common structurally? (consonant end, vowel start)</p>
<h4>22–30 · Intrusion, 3 items</h4>
<p>This is the hardest of the five to hear. Give each item two plays before revealing. If trainees disagree on exactly which sound intrudes, that's fine: the point is noticing something is added at all.</p>
<h4>30–39 · Assimilation, 3 items</h4>
<p>After each guess, have trainees say the phrase back at natural speed themselves. Producing it usually surfaces the sound change before they can consciously hear it in a recording. Name the direction explicitly: the earlier sound anticipates the later one.</p>
<h4>39–47 · Elision, 3 items</h4>
<p>Good to end the guessing on a high note. Ask what trainees notice in common across the examples: each drops a sound that would otherwise be awkward to fit in.</p>
<h4>47–50 · Close: connect to FOL and LRT</h4>
<p>Ask: "Which of these five features showed up in your FOL learner's listening, or in your own natural speech that a learner might struggle with?" For LRT, remind them the phonological analysis section should name the specific feature, not just say "the pronunciation is different."</p>'''

BODY = r'''
  <div class="pre">
    <div class="feeds"><p class="label">Where this feeds back in</p><p>FOL's listening-comprehension section is where connected speech usually shows up: a learner who reads a script fine but can't follow the same words spoken naturally. LRT's phonological analysis should note where a text's natural pronunciation departs from its spelling: these five terms are the vocabulary for that.</p></div>
    <div class="vbar" data-voices-here></div>
  </div>

  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="stage-title">Lead-in <span class="badge">3 minutes</span></div>
      <div class="box row"><button class="play" type="button" id="gonna">Play</button><p>Listen: "gonna." Now try writing what you heard using only words from a dictionary. There isn't one: that's the session.</p></div>
      <p class="ctx sub2">Lead-in, alternative · read these aloud</p>
      <p class="lead">Sound out each line fast: they're homophone strings, not real sentences on the page.</p>
      <div id="homo"></div>
    </div>
  </section>

  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">Terminology match <span class="badge">4 minutes</span></div>
      <div class="mhead"><p class="lead">Match each term to its meaning</p><span class="count" id="mCount"></span></div>
      <div class="pill-match-wrap"><div class="pill-col" id="mLeft"></div><div class="pill-col" id="mRight"></div></div>
    </div>
  </section>

  <section id="s3" data-n="3"><div class="card" data-n="3"><div class="stage-title">Strong and weak forms <span class="badge">7 minutes</span></div><p class="lead">For each feature below: listen to the clip, then choose the answer that matches what you heard.</p><div class="feat" data-f="0"></div></div></section>
  <section id="s4" data-n="4"><div class="card" data-n="4"><div class="stage-title">Linking <span class="badge">8 minutes</span></div><div class="feat" data-f="1"></div></div></section>
  <section id="s5" data-n="5"><div class="card" data-n="5"><div class="stage-title">Intrusion <span class="badge">8 minutes</span></div><div class="feat" data-f="2"></div></div></section>
  <section id="s6" data-n="6"><div class="card" data-n="6"><div class="stage-title">Assimilation <span class="badge">9 minutes</span></div><div class="feat" data-f="3"></div></div></section>
  <section id="s7" data-n="7"><div class="card" data-n="7"><div class="stage-title">Elision <span class="badge">8 minutes</span></div><div class="feat" data-f="4"></div></div></section>

  <section id="s8" data-n="8">
    <div class="card" data-n="8">
      <div class="stage-title">Close <span class="badge">3 minutes</span></div>
      <div class="link-card"><span class="lc-text">For face-to-face, run every clip live from a laptop speaker: no headphones needed. The BBC's <b>Learning English</b> pronunciation series has short free clips of natural connected speech if you want more examples beyond today's five.</span><a href="https://www.bbc.co.uk/learningenglish/english/features/pronunciation" target="_blank" rel="noreferrer">bbc.co.uk/learningenglish</a></div>
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
  .ctx{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.06rem; color:var(--ink); margin:0 0 4px;}
  .sub2{margin-top:18px;}
  .homo{font-family:'Newsreader',Georgia,serif; font-style:italic; font-size:1.05rem;}
  .homo-a{flex-basis:100%; margin:0; font-size:.9rem; color:var(--grey);}
  .linkbtn{background:none; border:0; padding:0; font:700 .84rem 'Karla',sans-serif; color:var(--teal); cursor:pointer; flex:none;}
  .linkbtn:hover{text-decoration:underline; text-underline-offset:3px;}
  .def{font-style:italic; color:var(--grey); margin:0 0 6px; font-size:.95rem;}
  .ex-top{display:flex; align-items:center; gap:12px;}
  .ex-top p{margin:0; font-size:.95rem; font-weight:600;}
  .opts{display:flex; flex-wrap:wrap; gap:8px; margin-top:10px;}
  .opt{background:var(--field); border:1.5px solid var(--sand-line); border-radius:8px; padding:7px 14px; font:600 .86rem 'Karla',sans-serif; color:var(--ink); cursor:pointer; min-height:36px; text-align:left;}
  .opt:hover{border-color:var(--gold);}
  .opt.right{background:var(--teal); border-color:var(--teal); color:var(--paper);}
  .opt.miss{border-color:var(--brick); color:var(--brick); background:color-mix(in oklab, var(--brick) 6%, var(--paper));}
  .opt:disabled{cursor:default;}
  .fb{margin:8px 0 0; font-size:.9rem; line-height:1.55; color:var(--ink);}
  .fb b.good{color:var(--teal);} .fb b.bad{color:var(--brick);}
  .mhead{display:flex; justify-content:space-between; align-items:baseline; gap:10px; flex-wrap:wrap;}
  .mhead .lead{margin:0;}
  .count{font-size:.84rem; font-weight:600; color:var(--grey);}
  .pill-col .pill{text-align:left; width:100%;}
  .pill-col .pill.term{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:.98rem;}
  .pill.matched{cursor:default;}
  @media print{ .play, .linkbtn{display:none !important;} }
  /* 21 Nov 2026: an answered page printed solved on the handout: "Correct." or "Not this one." and the explanation under each clip, a revealed homophone line, and matched meanings in a heavier weight. On paper it prints as it did untouched. */
  @media print{ .fb, .homo-a{display:none !important;} .pill.matched{font-weight:500;} }
  .vbar .lite-voices{margin:0;}
'''

SCRIPT = r'''
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
// ---------- the voice: Lite's four house voices (../voices.js); the bar sits at the top ----------
const say = text => LiteVoice.say(text);
// the intrusive /r/ is a British feature: "I saw it" is always heard in the British voice of the chosen sex
const BRITISH = ['I saw it'];
const sayClip = text => BRITISH.includes(text) ? LiteVoice.sayAll([{ text, accent: 'uk' }]) : say(text);
// ---------- 1. Lead-in ----------
$('gonna').onclick = () => say('gonna');
const HOMO = [
  ['Eye here you want to meat hour sun.', 'I hear you want to meet our son.'],
  ['Hour jump a risen may jet.', "Our jumper isn't made yet."],
  ['Weave scene hour glass is.', "We've seen our glasses."]
];
const homoShown = {};
function drawHomo(){
  $('homo').innerHTML = HOMO.map((h, i) => '<div class="box row"><p class="homo">' + esc(h[0]) + '</p><button type="button" class="linkbtn" data-h="' + i + '">' + (homoShown[i] ? 'Hide' : 'Reveal') + '</button>'
    + (homoShown[i] ? '<p class="homo-a">' + esc(h[1]) + '</p>' : '') + '</div>').join('');
}
$('homo').addEventListener('click', e => { const b = e.target.closest('[data-h]'); if (!b) return; homoShown[b.dataset.h] = !homoShown[b.dataset.h]; drawHomo(); });
drawHomo();

// ---------- 2. Match: either order; a wrong pair flashes, then clears ----------
const TERMS = [
  ['Linking', "a final consonant joins onto the next word's vowel"],
  ['Intrusion', 'an extra /r/, /w/ or /j/ is inserted between two vowel sounds'],
  ['Assimilation', 'a sound changes to match the sound that follows it'],
  ['Elision', 'a sound or whole syllable is dropped to make a phrase easier to say'],
  ['Weak form', 'the reduced, schwa-vowel version a function word takes in fast speech']
];
(function(){
  const right = TERMS.map((_, i) => i).reverse();
  let selL = null, selR = null, shake = [], matched = new Set();
  function cls(i, sel){ return matched.has(i) ? ' matched' : sel === i ? ' selected' : shake.includes(i) ? ' wrong' : ''; }
  function draw(){
    $('mCount').textContent = matched.size + ' of ' + TERMS.length + ' matched';
    $('mLeft').innerHTML = TERMS.map((t, i) => '<button type="button" class="pill term' + cls(i, selL) + '" data-l="' + i + '">' + esc(t[0]) + '</button>').join('');
    $('mRight').innerHTML = right.map(i => '<button type="button" class="pill' + cls(i, selR) + '" data-r="' + i + '">' + esc(TERMS[i][1]) + '</button>').join('');
  }
  document.querySelector('#s2 .pill-match-wrap').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.l !== undefined) { const i = +b.dataset.l; if (matched.has(i)) return; selL = i; }
    else { const i = +b.dataset.r; if (matched.has(i)) return; selR = i; }
    if (selL !== null && selR !== null) {
      if (selL === selR) { matched.add(selL); selL = selR = null; }
      else { shake = [selL, selR]; setTimeout(() => { selL = selR = null; shake = []; draw(); }, 400); }
    }
    draw();
  });
  draw();
})();

// ---------- 3-7. The five features: listen, then choose (the first pick locks) ----------
const SECTIONS = [
  ['small function words shrink and lose their vowel sound in fast speech', [
    ['"A cup of tea, please."', 'A cup of tea, please.', ['/ɒv/, the full vowel', '/əv/, the weak form'], 1, '/əv/: the vowel shrinks to schwa. Function words like "of," "to," "and" almost always take their weak form in running speech.'],
    ['"I\'d like to go."', "I'd like to go.", ['/tuː/, the full vowel', '/tə/, the weak form'], 1, '/tə/: "to" loses its vowel the same way "of" does. Learners who only ever hear the dictionary form /tuː/ won\'t recognize it here.'],
    ['"What are you doing?"', 'What are you doing?', ['/ɑː/, the full vowel', '/ə/, the weak form'], 1, '/ə/: "are" almost always weakens in a question like this, running into "you" as "whaddaya."']]],
  ["a final consonant joins onto the next word's vowel", [
    ['"an egg"', 'an egg', ['Said as two separate words', 'The /n/ joins onto "egg"'], 1, '/əˈneg/: the final /n/ of "an" links onto the vowel that starts "egg," so the words run together.'],
    ['"turn it off"', 'turn it off', ['Said as three separate words', 'The /n/ and /t/ link across the words'], 1, '"Turn it" links to sound like "tur-nit," and "it off" links to sound like "i-toff": every consonant-to-vowel boundary is a potential join.'],
    ['"far away"', 'far away', ['Said as two separate words', 'The /r/ links onto "away"'], 1, 'The written /r/ at the end of "far," silent on its own in most British accents, resurfaces because a vowel follows: "fa-raway."']]],
  ['an extra /r/, /w/ or /j/ is inserted between two vowel sounds', [
    ['"go away"', 'go away', ['Nothing is added between the words', 'An extra /w/ sound appears'], 1, 'A /w/ sound intrudes between "go" and "away": neither word\'s spelling shows it, but two vowel sounds in a row are hard to say cleanly, so English inserts a glide.'],
    ['"I saw it"', 'I saw it', ['Nothing is added between the words', 'An extra /r/ sound appears after "saw"'], 1, 'The famous "intrusive r": "saw it" is often pronounced "saw-r-it," even though there\'s no r in "saw" at all.'],
    ['"do it"', 'do it', ['Nothing is added between the words', 'An extra /w/ sound appears'], 1, '"Do it" becomes "do-w-it": the lip-rounding from /uː/ carries over as a /w/ before the next vowel starts.']]],
  ['a sound changes to match the sound that follows it', [
    ['"ten bikes"', 'ten bikes', ['/n/ stays /n/', '/n/ becomes /m/'], 1, '/n/ becomes /m/ before the /b/ that follows: "tem bikes." The tongue is already anticipating the lips closing for /b/.'],
    ['"good girl"', 'good girl', ['/d/ stays /d/', '/d/ becomes /g/'], 1, '/d/ shifts toward /g/ before the /g/ of "girl": "gug girl." Same principle: the earlier sound moves to anticipate the later one.'],
    ['"handbag"', 'handbag', ['/d/ stays /d/', '/d/ becomes /b/'], 1, '/d/ shifts toward /b/ before the /b/ of "bag": "hambag." Same anticipation, this time with the lips.']]],
  ['a sound or whole syllable is dropped to make a phrase easier to say', [
    ['"next day"', 'next day', ['All sounds are said', 'The /t/ disappears'], 1, 'The /t/ in "next" is dropped: "nex\' day." Three consonants in a row (/k/, /s/, /t/) followed by another consonant is too much, so one goes.'],
    ['"probably"', 'probably', ['All three syllables are said', 'The middle syllable disappears'], 1, 'The middle syllable vanishes: "prob\'ly," two syllables instead of three. Very common in fast, informal speech.'],
    ['"friendship"', 'friendship', ['The /d/ is fully said', 'The /d/ disappears'], 1, 'The /d/ drops between /n/ and /ʃ/: "frien\'ship." Same crowded-consonant pattern as "next day."']]]
];
const featPick = {};
// 22 Nov 2026 (Ramy: "just fix it"): in all fifteen clips the right option was the second one. Each clip's two options are now put in a random order once when the page loads (Fisher-Yates on a copy), and mixed again if the right one would sit in the same place in every clip. Marking goes by the option's own number (data-o), not by its place.
const mixed = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
let OPT_ORDER; do { OPT_ORDER = SECTIONS.map(sec => sec[1].map(ex => mixed(ex[2].map((_, i) => i)))); } while (new Set(SECTIONS.flatMap((sec, f) => sec[1].map((ex, ei) => OPT_ORDER[f][ei].indexOf(ex[3])))).size === 1);
function drawFeat(el){
  const f = +el.dataset.f, sec = SECTIONS[f];
  el.innerHTML = '<p class="def">' + esc(sec[0]) + '</p>' + sec[1].map((ex, ei) => {
    const k = f + ':' + ei, pick = featPick[k], show = pick !== undefined;
    const opts = OPT_ORDER[f][ei].map(oi => [ex[2][oi], oi]).map(([o, oi]) => '<button type="button" class="opt' + (show && oi === ex[3] ? ' right' : show && oi === pick ? ' miss' : '') + '" data-k="' + k + '" data-o="' + oi + '"' + (show ? ' disabled' : '') + '>' + esc(o) + '</button>').join('');
    const fb = show ? '<p class="fb"><b class="' + (pick === ex[3] ? 'good">Correct.' : 'bad">Not this one.') + '</b> ' + esc(ex[4]) + '</p>' : '';
    return '<div class="box"><div class="ex-top"><button type="button" class="play" data-clip="' + k + '">Play</button><p>' + esc(ex[0]) + '</p></div><div class="opts">' + opts + '</div>' + fb + '</div>';
  }).join('');
}
document.querySelectorAll('.feat').forEach(el => {
  drawFeat(el);
  el.addEventListener('click', e => {
    const s = e.target.closest('[data-clip]');
    if (s) { const [f, ei] = s.dataset.clip.split(':'); sayClip(SECTIONS[f][1][ei][1]); return; }
    const b = e.target.closest('[data-o]'); if (!b || featPick[b.dataset.k] !== undefined) return;
    featPick[b.dataset.k] = +b.dataset.o; drawFeat(el);
  });
});
'''
