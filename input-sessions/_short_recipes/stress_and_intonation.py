# Connect's 45-minute "Stress and intonation." (src/app/input-sessions/sessions/stress-and-intonation.tsx), on Lite's desk.
# Content word for word, American spelling. Every clip is one of Lite's four recorded house voices (../voices.js, lines in
# stress-and-intonation-short/audio/lines.json), in whichever voice the bar at the top has chosen. Connect's speechSynthesis
# tricks (a pitch glide word by word for intonation, each syllable at its own rate, pitch and volume for stress) are whole
# recordings here, each made with the tune or stress asked for, so the rise or fall is a natural one. Marking stress now
# lets a wrong pick be tried again (Connect locked it and still said "Try again"), and the attitude replies can be heard
# with the stress picked. Two Connect slips are put right here: the marking task showed the stressed syllable in bold before anyone picked,
# and the attitude task's explanations were keyed one word off (picking "take" said "Stress on your"). The stage-by-stage
# trainer script (StaffOnly on Connect) is in NOTES.
TITLE = 'Stress and intonation'
LONG = 'word-and-sentence-stress'
SUB = 'Word stress and sentence tune, both spoken aloud, both worth a mark on FOL and LRT. Click any word or line to hear it.'
NAV = [('s1', '1 · Intonation'), ('s2', '2 · Marking stress for LRT'), ('s3', '3 · Primary and secondary stress'),
       ('s4', '4 · Stress carries attitude')]

NOTES = '''<h4>0–8 · Intonation, minimal context</h4>
<p>Play each line without telling them whether it's a question or statement. The words are identical in two of the three: make the point that punctuation on a page can't carry this, only the ear can.</p>
<h4>8–20 · Marking convention for LRT</h4>
<p>This is a direct LRT skill: showing you can locate and mark word stress is part of the language analysis section. Have trainees mark all four words on paper first, then check against the interactive version.</p>
<h4>20–30 · Primary and secondary stress</h4>
<p>Word stress in longer words, same clap/circle logic as marking: keep it brisk, most trainees pick up the pattern fast.</p>
<h4>30–40 · Connect to FOL</h4>
<p>Ask: "In your FOL recording, did your learner stress any word wrongly, or use a flat/wrong-direction intonation anywhere?" This is the moment to point trainees back to their own recording with new ears.</p>
<h4>Delivery</h4>
<p>For face-to-face, everything above works live off a laptop and projector: no student devices needed. For real spoken intonation beyond synthesized speech, the BBC's Learning English pronunciation series (bbc.co.uk/learningenglish/english/features/pronunciation) has short free videos worth linking to.</p>
<h4>Contrastive stress extension</h4>
<p>Once trainees have picked and read the explanation, play the reply with the stress they chose, then have them say it aloud themselves.</p>
<h4>40–45 · Close</h4>
<p>One-sentence transfer: which of today's two features (stress or intonation) is most likely to trip up their own TP group, based on L1.</p>'''

BODY = r'''
  <div class="pre">
    <div class="feeds"><p class="label">Where this feeds back in</p><p>FOL asks you to record and analyze a learner's pronunciation errors: stress and intonation are two of the categories you'll be sorting those errors into. LRT asks you to analyze language for teaching, including its phonological features: the word-stress marking convention practiced here is the one your LRT write-up should use.</p></div>
    <div class="vbar" data-voices-here></div>
  </div>

  <section id="s1" data-n="1">
    <div class="card" data-n="1">
      <div class="stage-title">Intonation: question or statement? <span class="badge">8 minutes</span></div>
      <p class="lead">The words don't change, only the tune does. "You're coming." falling means a statement; rising means a question: click each line to hear the tune, then guess before revealing.</p>
      <div id="into"></div>
    </div>
  </section>

  <section id="s2" data-n="2">
    <div class="card" data-n="2">
      <div class="stage-title">Marking stress for LRT <span class="badge">12 minutes</span></div>
      <p class="lead">The convention: a bold syllable, or a small mark before it: <b>re</b>cord vs re<b>cord</b>. Click a word to hear it, then click the syllable you think carries the stress.</p>
      <div id="mark"></div>
    </div>
  </section>

  <section id="s3" data-n="3">
    <div class="card" data-n="3">
      <div class="stage-title">Primary and secondary stress <span class="badge">10 minutes</span></div>
      <p class="lead">Longer words often carry two stresses, not one: a strong primary stress and a weaker secondary stress. Click Play to hear the word said naturally, then listen for the two stresses yourself, or say the word aloud. Click each circle once for secondary stress, twice for primary.</p>
      <div id="dbl"></div>
    </div>
  </section>

  <section id="s4" data-n="4">
    <div class="card" data-n="4">
      <div class="stage-title">Extension, if there's time: stress carries attitude</div>
      <p class="lead">Same sentence, same words: the stressed word changes what's actually meant. Read the context, then click the word you'd stress in the reply. Reveal it to read why, and hear the reply said that way.</p>
      <div id="con"></div>
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
  .line{flex:1 1 160px; margin:0; font-size:.98rem;}
  .ans{margin:0; font-size:.88rem; font-weight:700; color:var(--grey);}
  .ans.rise{color:var(--teal);}
  .linkbtn{background:none; border:0; padding:0; font:700 .86rem 'Karla',sans-serif; color:var(--teal); cursor:pointer; flex:none;}
  .linkbtn:hover{text-decoration:underline; text-underline-offset:3px;}
  .syls{display:flex; gap:5px; flex-wrap:wrap; flex:1 1 200px;}
  .syl{border:1.5px solid var(--sand-line); background:var(--paper); padding:6px 12px; font:400 1.02rem 'Newsreader',Georgia,serif; color:var(--ink); cursor:pointer; min-height:38px;}
  .syl:hover{border-color:var(--gold);}
  .syl.bold{font-weight:700;}
  .syl.right{border-color:var(--teal); background:var(--teal); color:var(--paper);}
  .syl.miss{border-color:var(--brick); color:var(--brick); background:color-mix(in oklab, var(--brick) 6%, var(--paper));}
  .syl:disabled{cursor:default;}
  .st{width:72px; flex:none; text-align:right; font-size:.86rem; font-weight:700;}
  .st.good{color:var(--teal);} .st.bad{color:var(--brick);}
  .word{width:130px; flex:none; font:600 1.02rem 'Newsreader',Georgia,serif;}
  .dots{display:flex; align-items:flex-end; gap:8px; flex:1 1 140px; min-height:34px;}
  .dot{padding:0; border:1.5px solid var(--sand-line); background:var(--paper); border-radius:999px !important; cursor:pointer; flex:none;}
  .dot.done{border-color:var(--teal); background:color-mix(in oklab, var(--teal) 14%, var(--paper));}
  .dot.rev{border-color:var(--grey); background:color-mix(in oklab, var(--grey) 15%, var(--paper)); cursor:default;}
  .togg{width:72px; text-align:right; background:none; border:0; padding:0; font:700 .86rem 'Karla',sans-serif; color:var(--teal); cursor:pointer; flex:none;}
  .togg.done{cursor:default;} .togg.hide{color:var(--grey);}
  @media(max-width:560px){
    #dbl .row{display:grid; grid-template-columns:auto 1fr auto; grid-template-areas:"play word togg" "dots dots dots"; gap:10px 12px;}
    #dbl .play{grid-area:play;} #dbl .word{grid-area:word; width:auto;} #dbl .togg{grid-area:togg;} #dbl .dots{grid-area:dots;}
  }
  .ctxl{font-style:italic; color:var(--grey); font-size:.9rem; margin:0 0 8px;}
  .words{display:flex; flex-wrap:wrap; gap:4px; flex:1 1 220px;}
  .w{background:none; border:0; padding:3px 7px; font:500 1.02rem 'Karla',sans-serif; color:var(--ink); cursor:pointer;}
  .w:hover{background:var(--box);}
  .w.on{background:color-mix(in oklab, var(--teal) 12%, var(--paper)); color:var(--teal); font-weight:800;}
  .expl{margin:10px 0 0; padding-top:8px; border-top:1px solid var(--row-line); font-size:.9rem; line-height:1.55;}
  @media print{ .play, .linkbtn, .togg{display:none !important;} }
  .vbar .lite-voices{margin:0;}
  .play.hear{margin-left:6px; min-height:30px; padding:3px 12px; vertical-align:middle;}
'''

SCRIPT = r'''
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
// ---------- the voice: Lite's four house voices (../voices.js); the bar sits at the top ----------
// A line with a tune or a stress of its own is its own recording (the stress picks the file); see audio/lines.json.
const say = (text, stress) => LiteVoice.say(text, 'a', stress || '');
// ---------- 1. Intonation ----------
// the fourth item is the recording's stress: "You're coming?" and "You're coming." would otherwise share a file name
const INTO = [
  ["You're coming?", true, 'Question: rising tune, checking', 'coming'],
  ["You're coming.", false, 'Statement: falling tune, telling', ''],
  ['Coffee or tea?', false, 'Choice question: rise on the first option, fall on the last', '']
];
const intoShown = {};
function drawInto(){
  $('into').innerHTML = INTO.map((it, i) => '<div class="box row"><button type="button" class="play" data-it="' + i + '">Play</button><p class="line">"' + esc(it[0]) + '"</p>'
    + (intoShown[i] ? '<p class="ans' + (it[1] ? ' rise' : '') + '">' + esc(it[2]) + '</p>' : '<button type="button" class="linkbtn" data-rev="' + i + '">Reveal</button>') + '</div>').join('');
}
$('into').addEventListener('click', e => {
  const p = e.target.closest('[data-it]'); if (p) { const it = INTO[p.dataset.it]; say(it[0], it[3]); return; }
  const r = e.target.closest('[data-rev]'); if (r) { intoShown[r.dataset.rev] = true; drawInto(); }
});
drawInto();

// ---------- 2. Marking stress: a wrong pick says so and can be tried again; the right one locks, in bold ----------
// Each word is one recording said naturally; the bold shows only once it is found.
const MARK = [[['pho', 'to', 'graph'], 0], [['pho', 'to', 'gra', 'phy'], 2], [['pho', 'to', 'gra', 'phic'], 2], [['con', 'sid', 'er'], 1]];
const markPick = {}, markMiss = {};
function drawMark(){
  $('mark').innerHTML = MARK.map((w, wi) => {
    const pick = markPick[wi], found = pick === w[1], missed = markMiss[wi] || [];
    const syls = w[0].map((s, si) => '<button type="button" class="syl' + (found && si === w[1] ? ' bold right' : !found && missed.includes(si) ? ' miss' : '') + '" data-w="' + wi + '" data-s="' + si + '"' + (found ? ' disabled' : '') + '>' + s + '</button>').join('');
    const st = found ? 'Correct' : pick !== undefined ? 'Try again' : '';
    return '<div class="box row"><button type="button" class="play" data-mw="' + wi + '">Play</button><div class="syls">' + syls + '</div><span class="st ' + (found ? 'good' : 'bad') + '">' + st + '</span></div>';
  }).join('');
}
$('mark').addEventListener('click', e => {
  const p = e.target.closest('[data-mw]'); if (p) { say(MARK[p.dataset.mw][0].join('')); return; }
  const b = e.target.closest('[data-s]'); if (!b) return;
  const wi = +b.dataset.w, si = +b.dataset.s; if (markPick[wi] === MARK[wi][1]) return;
  markPick[wi] = si; if (si !== MARK[wi][1]) (markMiss[wi] = markMiss[wi] || []).push(si);
  drawMark();
});
drawMark();

// ---------- 3. Primary and secondary stress: a circle cycles none, secondary, primary ----------
const DBL = [
  ['information', 4, [1, 0, 2, 0]], ['understand', 3, [1, 0, 2]], ['afternoon', 3, [1, 0, 2]],
  ['engineer', 3, [1, 0, 2]], ['conversation', 4, [1, 0, 2, 0]], ['university', 5, [1, 0, 2, 0, 0]]
];
const SIZE = [14, 22, 32];
const dblPick = {}, dblRev = {};
function drawDbl(){
  $('dbl').innerHTML = DBL.map((w, wi) => {
    const cur = dblPick[wi] || Array(w[1]).fill(0), rev = !!dblRev[wi], shown = rev ? w[2] : cur;
    const done = cur.every((p, i) => p === w[2][i]) && cur.some(p => p > 0);
    const dots = shown.map((lv, si) => '<button type="button" class="dot' + (done ? ' done' : rev ? ' rev' : '') + '" data-dw="' + wi + '" data-ds="' + si + '"' + (rev ? ' disabled' : '') + ' style="width:' + SIZE[lv] + 'px;height:' + SIZE[lv] + 'px" aria-label="Syllable ' + (si + 1) + '"></button>').join('');
    return '<div class="box row"><button type="button" class="play" data-pw="' + wi + '">Play</button><span class="word">' + w[0] + '</span><div class="dots">' + dots + '</div>'
      + '<button type="button" class="togg' + (done ? ' done' : rev ? ' hide' : '') + '" data-tw="' + wi + '">' + (done ? 'Correct' : rev ? 'Hide' : 'Reveal') + '</button></div>';
  }).join('');
}
$('dbl').addEventListener('click', e => {
  const p = e.target.closest('[data-pw]'); if (p) { say(DBL[p.dataset.pw][0]); return; }
  const d = e.target.closest('[data-ds]');
  if (d) { const wi = +d.dataset.dw, w = DBL[wi]; const next = (dblPick[wi] || Array(w[1]).fill(0)).slice(); next[+d.dataset.ds] = (next[+d.dataset.ds] + 1) % 3; dblPick[wi] = next; drawDbl(); return; }
  const t = e.target.closest('[data-tw]');
  if (t) { const wi = +t.dataset.tw, w = DBL[wi], cur = dblPick[wi] || Array(w[1]).fill(0);
    if (cur.every((x, i) => x === w[2][i]) && cur.some(x => x > 0)) return; dblRev[wi] = !dblRev[wi]; drawDbl(); }
});
drawDbl();

// ---------- 4. Stress carries attitude (each explanation sits on the word it names) ----------
const CON = [
  ['A: "Did Sara take my charger?"', "I didn't take your charger.", { 0: 'Stress on "I": someone else did, not me.', 3: 'Stress on "your": I took a charger, just not yours.', 4: 'Stress on "charger": I took something of yours, but not that.' }],
  ['A: "You said you\'d finish the report today."', "I said I'd try to finish it today.", { 3: 'Stress on "try": pushing back on the accusation of a broken promise; "try" was the actual claim.', 7: 'Stress on "today": conceding the deadline was today, defending only the effort.' }],
  ['A: "This isn\'t the shirt I ordered."', "That's the shirt we sent.", { 0: 'Stress on "that\'s": flat correction, almost defensive.', 3: 'Stress on "we": shifting blame toward the warehouse, away from the speaker.', 4: 'Stress on "sent": emphasizing the order was fulfilled correctly on their end.' }]
];
const conPick = {}, conRev = {};
const stressWord = w => w.replace(/[.,?!]/g, '');   // the reply said with the stress on that word: its own recording
function drawCon(){
  $('con').innerHTML = CON.map((c, ci) => {
    const words = c[1].split(' '), pick = conPick[ci], rev = !!conRev[ci];
    const ws = words.map((w, wi) => '<button type="button" class="w' + (pick === wi ? ' on' : '') + '" data-c="' + ci + '" data-cw="' + wi + '">' + esc(w) + '</button>').join('');
    return '<div class="box"><p class="ctxl">' + esc(c[0]) + '</p><div class="row"><div class="words">' + ws + '</div><button type="button" class="togg" data-cr="' + ci + '">' + (rev ? 'Hide' : 'Reveal') + '</button></div>'
      + (rev && pick !== undefined ? '<p class="expl">' + esc(c[2][pick] || 'Try one of the words with an explanation below: not every word carries a distinct attitude here.')
        + (c[2][pick] ? ' <button type="button" class="play hear" data-ch="' + ci + '">Hear it</button>' : '') + '</p>' : '') + '</div>';
  }).join('');
}
$('con').addEventListener('click', e => {
  const w = e.target.closest('[data-cw]'); if (w) { conPick[w.dataset.c] = +w.dataset.cw; drawCon(); return; }
  const h = e.target.closest('[data-ch]'); if (h) { const ci = +h.dataset.ch, c = CON[ci]; say(c[1], stressWord(c[1].split(' ')[conPick[ci]])); return; }
  const r = e.target.closest('[data-cr]'); if (r) { conRev[r.dataset.cr] = !conRev[r.dataset.cr]; drawCon(); }
});
drawCon();
'''
