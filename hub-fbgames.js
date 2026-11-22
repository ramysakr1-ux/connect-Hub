/* Connect Lite -- the feedback games: Spin the criteria, Criteria bingo, XO, Roll for it, Flip a card.
 * (c) 2026 Ramy Sakr. All rights reserved.
 * One file for the tutor's TP feedback screen (40_tp_feedback.html) and the trainees' own page (41_feedback_games.html),
 * so the two cannot drift (Ramy, 30 Oct 2026: "add it to a trainee page": in a breakout room one trainee shares and taps).
 * The criteria come from the course's timetable; nothing is saved. Needs celta5-criteria.js loaded first.
 */
(function(){
  var DAYS_SRC = function(){ return []; };
  function DAYS(){ try { return DAYS_SRC() || []; } catch (e) { return []; } }
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  /* SPIN THE CRITERIA (Ramy, 30 Oct 2026: "spin the wheel ... it pops up and you discuss each criterion, whether it went well or
     not"; "relate feedback to the stage of the course and the criteria they're being assessed on at that stage ... you have
     this from Connect"). Connect's rule (peer-observation.ts criteriaForTpDate, timetable-skeleton.ts): the criteria in focus
     come from the input sessions taught up to the TP. Here: the input sessions of the five course days up to this one, by
     Connect's own session-to-criteria list, at most eight on the wheel. The questions are from "Feedback for TP: a few ideas"
     (the IH list in Ramy's Drive). Nothing is saved: it is a game for the room. */
  const SES_CRIT = [
    [/classroom management/, ['5b', '5d', '5f', '5i', '5j', '5k', '4g', '1d']], [/focus on the learner|course intro/, ['1a', '1b', '1c']],
    [/lesson plan|framework|\blp\b/, ['4a', '4b', '4e', '4f', '4h', '4j', '4k']], [/receptive/, ['3a', '4l']], [/elicit|ccq|concept check/, ['5g', '2c', '2e']],
    [/vocab/, ['2a', '2c']], [/ppp|guided discovery/, ['5c', '4b', '4f', '2c']], [/text.based/, ['3a', '3b', '4c']],
    [/sounds|stress|connected speech|phonolog/, ['2e', '4i']], [/language analysis|analysing language/, ['4i', '2b', '2f']],
    [/feedback and monitoring|giving feedback on tasks/, ['5h', '5j']], [/drill|models/, ['2d']], [/less.guided|controlled practice|language practice/, ['2g']],
    [/speaking|writing|productive/, ['3b']], [/error correction/, ['2b']], [/functional/, ['2c', '2f']]
  ];
  const CRIT = {}; (window.CONNECT_HUB_CRITERIA || []).forEach(c => { CRIT[c[0]] = c[2]; });
  const ASK = {
    '5f': 'How did we make sure the students understood the instructions? Handouts before or after the demonstration?',
    '5b': 'How many different ways can you think of to change the pairs and groups? How many copies for a pair task?',
    '5g': 'What evidence do you have that the students actually understood the new language? Give examples.',
    '2e': 'Meaning first or form first, and why? When does the new language go on the board: before or after drilling?',
    '2d': 'How can we make the drilling snappier? How do we help with long, difficult sentences?',
    '2b': 'At what stage did correction happen, and why then? How does a student feel if you repeat everything they say?',
    '1d': 'How did we make sure every student took part?',
    '5d': 'What was taught today? What was learned? Give evidence.',
    '5i': 'Where did the pace work, and where did it drag?',
    '5j': 'Where were you while the students worked, and what did you notice?',
    '5k': 'Did the lessons start and finish on time? What helped?',
    '4g': 'How much of today was teacher-centred and how much learner-centred? Count the minutes.',
    '3a': 'Did the students have a reason to read or listen before the text came out?',
    '3b': 'How did we make sure the students used the target language in the activity?',
    '2c': 'Was the context clear before the new language came?',
    '2g': 'Did the practice let the students use the language, not just repeat it?',
    '2a': 'How did you grade your own language for this level?',
    '5c': 'Why that technique for this language?',
    '5h': 'How did the students find out how they did on the task?',
    '4b': 'Did the order of the stages lead to the aim?', '4h': 'Which stage needed more time, and which less?',
    '4a': 'Were the aims written in the students’ terms? Did the lesson reach them? How do you know?',
    '4e': 'Could someone else teach this lesson from the procedure alone?',
    '4f': 'Did each activity have the right interaction: alone, pairs, groups, whole class?',
    '4i': 'Was the language analysis ready for the problems that came up in the room?',
    '4j': 'What difficulty did the plan predict, and did it happen?', '4k': 'Did the planned solution work when the problem came?',
    '4c': 'Why this material for this class? What would you adapt?', '4l': 'Which subskills did the lesson practise, and did the plan name them?',
    '2f': 'Where did the students meet formal or informal language, and how did they notice the difference?',
    '1a': 'What did you know about these students that shaped the lesson?', '1b': 'How did the lesson suit different ways of learning?',
    '1c': 'Where did the students’ own experience come into the lesson?', '5e': 'Did the board, handouts and pictures help the learning, or just fill time?'
  };
  function focusOn(dateISO){
    const all = DAYS().filter(d => d && d.date && d.date <= dateISO && !d.closed);
    const take = n => { const out = []; all.slice(-n).reverse().forEach(d => (d.sessions || []).filter(x => x.k === 'input' && x.t).forEach(x => { const t = String(x.t).toLowerCase(); SES_CRIT.forEach(([re, cs2]) => { if (re.test(t)) cs2.forEach(c => { if (out.indexOf(c) === -1) out.push(c); }); }); })); return out; };
    let codes = take(5); if (codes.length < 4) codes = take(10); if (codes.length < 4) codes = take(40);
    return codes.filter(c => CRIT[c]).slice(0, 8);
  }
  let SPIN = null;   /* { codes, used, at, rot } while the wheel is open */
  function openWheel(day, list){ list = list || [];
    const codes = focusOn(day.date);
    if (!codes.length) { if (window.hubDemoSay) hubDemoSay('No input sessions on the timetable yet, so there are no criteria to spin.'); return; }
    SPIN = { codes, used: [], at: -1, rot: 0, list };
    let back = document.querySelector('.wheel-back');
    if (!back) { back = document.createElement('div'); back.className = 'wheel-back'; document.body.appendChild(back); }
    drawWheel(back);
  }
  function drawWheel(back){
    const W = SPIN, n = W.codes.length, R = 150, C = 160;
    const seg = i => { const a0 = (i / n) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;
      const p = a => [C + R * Math.cos(a), C + R * Math.sin(a)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); const large = a1 - a0 > Math.PI ? 1 : 0;
      const mid = (a0 + a1) / 2, tx = C + R * 0.66 * Math.cos(mid), ty = C + R * 0.66 * Math.sin(mid);
      return `<path d="M${C},${C} L${x0},${y0} A${R},${R} 0 ${large} 1 ${x1},${y1} Z" class="sg s${i % 4}${W.used.indexOf(i) !== -1 && i !== W.at ? ' used' : ''}${i === W.at ? ' here' : ''}"/><text x="${tx}" y="${ty}" class="sl">${esc(W.codes[i])}</text>`; };
    const c = W.at >= 0 ? W.codes[W.at] : '';
    back.innerHTML = `<div class="wheel" role="dialog" aria-modal="true" aria-label="Spin the criteria">
      <div class="wh-top"><b>Spin the criteria</b><span>The criteria in focus this week, from the input sessions so far.</span><button type="button" class="x" id="whClose" aria-label="Close">×</button></div>
      <div class="wh-body"><div class="wh-wheel"><div class="pointer"></div><svg viewBox="0 0 320 320" id="whSvg" style="transform:rotate(${W.rot}deg)">${W.codes.map((_, i) => seg(i)).join('')}<circle cx="${C}" cy="${C}" r="26" class="hub"/></svg>
        <button type="button" class="spin" id="whSpin">${W.at < 0 ? 'Spin' : 'Spin again'}</button></div>
        <div class="wh-card">${c ? `<p class="code">${esc(c)}</p><p class="crit">${esc(CRIT[c])}</p><p class="ask">${esc(ASK[c] || 'Where did we see this today? What went well, and what would you try next time?')}</p>
          <div class="who">${(W.list.length ? W.list : [{ name: 'The group' }]).map(t => `<div class="wr"><span>${esc(String(t.name).split(' ')[0])}</span><button type="button" data-g="w">Went well</button><button type="button" data-g="n">Next time</button></div>`).join('')}</div>`
          : '<p class="ask">Spin, and the wheel lands on a criterion. Talk about where it showed today: what went well, and what to try next time.</p>'}</div></div></div>`;
    $('whClose').onclick = () => { back.remove(); SPIN = null; };
    back.onclick = e => { if (e.target === back) { back.remove(); SPIN = null; } };
    back.querySelectorAll('[data-g]').forEach(b => b.onclick = () => { b.parentNode.querySelectorAll('[data-g]').forEach(x => x.classList.toggle('on', x === b && !b.classList.contains('on'))); });
    $('whSpin').onclick = () => {
      const left = W.codes.map((_, i) => i).filter(i => W.used.indexOf(i) === -1); const pool = left.length ? left : W.codes.map((_, i) => i);
      if (!left.length) W.used = [];
      const pick = pool[Math.floor(Math.random() * pool.length)], n2 = W.codes.length;
      const centre = (pick + 0.5) * (360 / n2), target = 360 * 5 + (360 - centre);
      W.rot = W.rot - (W.rot % 360) + target; W.at = -1;
      const svg = $('whSvg'); svg.style.transition = 'transform 3.2s cubic-bezier(.17,.67,.2,1)'; svg.style.transform = 'rotate(' + W.rot + 'deg)'; $('whSpin').disabled = true;
      setTimeout(() => { W.at = pick; W.used.push(pick); drawWheel(back); }, 3300);
    };
  }

  /* BINGO AND XO (Ramy, 30 Oct 2026: "a game of bingo ... three criteria they all did well ... or XO"). The same criteria as the
     wheel, nine of them on a 3x3: this week's first, then earlier ones from the course so far. Full screen, for the room's
     screen or a shared screen; only the criteria, the questions and first names show. Nothing is saved. */
  function nineFor(dateISO){
    let codes = focusOn(dateISO);
    if (codes.length < 9) {
      const all = DAYS().filter(d => d && d.date && d.date <= dateISO && !d.closed);
      all.slice().reverse().forEach(d => (d.sessions || []).filter(x => x.k === 'input' && x.t).forEach(x => { const t = String(x.t).toLowerCase(); SES_CRIT.forEach(([re, cs2]) => { if (re.test(t)) cs2.forEach(c => { if (codes.indexOf(c) === -1 && CRIT[c]) codes.push(c); }); }); }));
    }
    ['5f', '5g', '1d', '5j', '4a', '2e', '5b', '5i', '3b'].forEach(c => { if (codes.length < 9 && codes.indexOf(c) === -1 && CRIT[c]) codes.push(c); });
    return codes.slice(0, 9);
  }
  const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  const shortOf = c => { const w = String(CRIT[c] || '').split(' '); return w.slice(0, 7).join(' ') + (w.length > 7 ? '…' : ''); };
  let GAME = null;
  function openGame(kind, day, list){ list = list || [];
    const codes = nineFor(day.date);
    if (codes.length < 9) { if (window.hubDemoSay) hubDemoSay('Not enough criteria on the timetable yet for a 3 by 3.'); return; }
    GAME = { kind, codes, cells: Array(9).fill(''), at: -1, turn: 'X', win: null, list };
    let back = document.querySelector('.wheel-back');
    if (!back) { back = document.createElement('div'); back.className = 'wheel-back'; document.body.appendChild(back); }
    drawGame(back);
  }
  function drawGame(back){
    const G = GAME, bingo = G.kind === 'bingo';
    const wins = LINES.filter(l => bingo ? l.every(i => G.cells[i] === 'w') : (G.cells[l[0]] && l.every(i => G.cells[i] === G.cells[l[0]])));
    const won = new Set(wins.flat());
    if (!bingo && wins.length && !G.win) G.win = G.cells[wins[0][0]];
    const full = G.cells.every(Boolean);
    const c = G.at >= 0 ? G.codes[G.at] : '';
    const status = bingo
      ? (wins.length ? `<b class="bang">Bingo!</b> ${wins.map(l => l.map(i => G.codes[i]).join(' · ')).join(' and ')}: the group did these well today.` : 'Tap a square when the group finds a moment from today: went well or next time. Three “went well” in a row is bingo.')
      : (G.win ? `<b class="bang">Team ${G.win} wins!</b>` : full ? '<b class="bang">A draw.</b> Every criterion found.' : `<b>Team ${G.turn}</b>, pick a square. Give one real moment from today’s lessons for it: something that worked, or something to try.`);
    back.innerHTML = `<div class="wheel game" role="dialog" aria-modal="true" aria-label="${bingo ? 'Criteria bingo' : 'XO'}">
      <div class="wh-top"><b>${bingo ? 'Criteria bingo' : 'XO'}</b><span>${status}</span><button type="button" class="x" id="gmClose" aria-label="Close">×</button></div>
      <div class="wh-body"><div class="board3">${G.codes.map((code, i) => { const v = G.cells[i];
          const cls = bingo ? (v === 'w' ? ' w' : v === 'n' ? ' n' : '') : (v ? ' t' + v : '');
          return `<button type="button" class="sq${cls}${i === G.at ? ' at' : ''}${won.has(i) ? ' won' : ''}" data-sq="${i}">${!bingo && v ? `<span class="mark">${v}</span>` : ''}<b>${esc(code)}</b><small>${esc(shortOf(code))}</small>${bingo && v ? `<em>${v === 'w' ? 'Went well' : 'Next time'}</em>` : ''}</button>`; }).join('')}</div>
        <div class="wh-card">${c ? `<p class="code">${esc(c)}</p><p class="crit">${esc(CRIT[c])}</p><p class="ask">${esc(ASK[c] || 'Where did we see this today? What went well, and what would you try next time?')}</p>
          ${bingo ? `<div class="row2"><button type="button" class="g w" data-mark="w">Went well</button><button type="button" class="g n" data-mark="n">Next time</button><button type="button" class="g" data-mark="">Clear</button></div>`
                  : (G.win || G.cells[G.at] ? '' : `<div class="row2"><button type="button" class="g w" data-claim="1">Good answer: Team ${G.turn} takes it</button><button type="button" class="g" data-claim="0">Not yet: pass to Team ${G.turn === 'X' ? 'O' : 'X'}</button></div>`)}`
          : `<p class="ask">${bingo ? 'Pick a criterion on the card. Talk about where it showed today.' : 'Two teams. The board holds this week’s criteria.'}</p>`}
          ${(!bingo && (G.win || full)) || (bingo && wins.length) ? '<div class="row2"><button type="button" class="g" id="gmNew">New game</button></div>' : ''}</div></div></div>`;
    $('gmClose').onclick = () => { back.remove(); GAME = null; };
    back.onclick = e => { if (e.target === back) { back.remove(); GAME = null; } };
    back.querySelectorAll('[data-sq]').forEach(b => b.onclick = () => { if (!bingo && (G.win || G.cells[+b.dataset.sq])) return; G.at = +b.dataset.sq; drawGame(back); });
    back.querySelectorAll('[data-mark]').forEach(b => b.onclick = () => { G.cells[G.at] = b.dataset.mark; drawGame(back); });
    back.querySelectorAll('[data-claim]').forEach(b => b.onclick = () => { if (b.dataset.claim === '1') G.cells[G.at] = G.turn; G.turn = G.turn === 'X' ? 'O' : 'X'; G.at = -1; drawGame(back); });
    if ($('gmNew')) $('gmNew').onclick = () => { G.cells = Array(9).fill(''); G.at = -1; G.win = null; G.turn = 'X'; drawGame(back); };
  }
  const style = document.createElement('style'); style.textContent = "  .wheel-back{position:fixed; inset:0; z-index:9000; background:var(--sand); display:flex; align-items:center; justify-content:center; padding:16px;}\n  .wheel{background:var(--paper); border-radius:18px; box-shadow:0 30px 80px -30px rgba(0,0,0,.6); width:min(940px,100%); max-height:calc(100vh - 32px); overflow:auto; padding:20px 22px;}\n  .wh-top{display:flex; align-items:baseline; gap:12px; flex-wrap:wrap; margin:0 0 12px;} .wh-top b{font-family:'Newsreader',Georgia,serif; font-size:24px;} .wh-top span{color:var(--grey); font-size:14px; flex:1;}\n  .wh-top .x{border:1px solid var(--sand-line); background:var(--paper); border-radius:10px; width:36px; height:36px; font-size:20px; cursor:pointer;}\n  .wh-body{display:grid; grid-template-columns:340px minmax(0,1fr); gap:22px; align-items:center;}\n  .wh-wheel{position:relative; text-align:center;} .wh-wheel svg{width:320px; height:320px;}\n  .wh-wheel .pointer{position:absolute; left:50%; top:-4px; transform:translateX(-50%); width:0; height:0; border-left:12px solid transparent; border-right:12px solid transparent; border-top:20px solid var(--ink); z-index:2;}\n  .sg{stroke:var(--paper); stroke-width:2;} .sg.s0{fill:oklch(86% 0.06 245);} .sg.s1{fill:oklch(87% 0.07 145);} .sg.s2{fill:oklch(89% 0.07 55);} .sg.s3{fill:oklch(86% 0.06 300);}\n  .sg.used{opacity:.35;} .sg.here{stroke:var(--ink); stroke-width:3;} .sl{font:700 18px Karla,sans-serif; fill:var(--ink); text-anchor:middle; dominant-baseline:middle;} .hub{fill:var(--paper); stroke:var(--sand-line); stroke-width:2;}\n  .wh-wheel .spin{margin-top:10px; font:700 16px Karla,sans-serif; padding:10px 26px; border-radius:999px; border:0; background:var(--a-mustard); color:var(--ink); cursor:pointer;}\n  .wh-wheel .spin:disabled{opacity:.5;}\n  .wh-card .code{font-family:'Newsreader',Georgia,serif; font-size:44px; font-weight:700; margin:0; line-height:1;}\n  .wh-card .crit{font-size:18px; line-height:1.4; margin:6px 0 12px;}\n  .wh-card .ask{font-size:16px; line-height:1.5; padding:12px 14px; background:oklch(95% 0.035 85); border-left:3px solid var(--a-mustard); border-radius:10px; margin:0 0 12px;}\n  .wh-card .wr{display:flex; align-items:center; gap:8px; padding:6px 0; border-top:1px solid var(--row-line);} .wh-card .wr span{font-weight:700; min-width:90px;}\n  .wh-card .wr button{font:600 13px Karla,sans-serif; padding:6px 12px; border-radius:999px; border:1px solid var(--sand-line); background:var(--paper); cursor:pointer;}\n  .wh-card .wr button.on[data-g=\"w\"]{background:oklch(87% 0.07 145); border-color:oklch(70% 0.08 145);} .wh-card .wr button.on[data-g=\"n\"]{background:oklch(90% 0.07 85); border-color:oklch(75% 0.09 85);}\n  @media (max-width:760px){ .wh-body{grid-template-columns:1fr;} .wh-wheel svg{width:260px; height:260px;} .wh-card .code{font-size:34px;} }\n  @media(prefers-reduced-motion:reduce){ .wh-wheel svg{transition:none !important;} }\n\n  .wheel.game .wh-body{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr); align-items:start;}\n  .wh-top .bang{font-family:'Newsreader',Georgia,serif; font-size:20px; color:var(--teal);}\n  .board3{display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:8px;}\n  .sq{position:relative; display:flex; flex-direction:column; align-items:flex-start; gap:3px; text-align:left; min-height:118px; padding:12px; border-radius:12px; border:2px solid var(--sand-line); background:var(--field); color:var(--ink); cursor:pointer; font:inherit;}\n  .sq b{font-family:'Newsreader',Georgia,serif; font-size:26px; line-height:1;} .sq small{font-size:12px; line-height:1.3; color:var(--grey);} .sq em{margin-top:auto; font-style:normal; font-weight:700; font-size:12px;}\n  .sq.at{border-color:var(--ink);} .sq.w{background:oklch(90% 0.07 145); border-color:oklch(72% 0.09 145);} .sq.n{background:oklch(93% 0.07 85); border-color:oklch(78% 0.1 85);}\n  .sq.won{box-shadow:0 0 0 3px var(--a-mustard), 0 0 18px 2px color-mix(in oklch, var(--a-mustard) 55%, transparent);}\n  .sq.tX{background:oklch(90% 0.05 245);} .sq.tO{background:oklch(91% 0.06 25);}\n  .sq .mark{position:absolute; right:10px; top:4px; font-family:'Newsreader',Georgia,serif; font-weight:700; font-size:52px; line-height:1; opacity:.55;}\n  .row2{display:flex; gap:8px; flex-wrap:wrap;}\n  .row2 .g{font:700 14px Karla,sans-serif; padding:9px 14px; border-radius:999px; border:1px solid var(--sand-line); background:var(--paper); cursor:pointer;}\n  .row2 .g.w{background:oklch(87% 0.07 145); border-color:oklch(72% 0.09 145);} .row2 .g.n{background:oklch(90% 0.07 85); border-color:oklch(78% 0.1 85);}\n  @media (max-width:760px){ .wheel.game .wh-body{grid-template-columns:1fr;} .sq{min-height:92px; padding:9px;} .sq b{font-size:22px;} .sq small{display:none;} }\n"; document.head.appendChild(style);
  /* ROLL FOR IT AND FLIP A CARD (Ramy, 22 Nov 2026: "think of another sort of fun interactive game that we can add, maybe 2
     more ... go online and look for ideas"). Two that need no criteria, so they work from day one: a die whose six faces are
     six questions about today's lessons (the dice debrief), and nine cards face down, each a sentence to finish about a
     classmate's lesson, two that praise for every one that suggests. Full screen like the others; nothing is saved. */
  const FACES = [
    ['The best ten seconds', 'Name the best ten seconds of a classmate’s lesson. What made them work?'],
    ['A surprise', 'What surprised you in today’s lessons?'],
    ['A student’s view', 'Pick one student from the class. What would they say about the lesson?'],
    ['Steal it', 'Name one thing from a classmate’s lesson that you will use in your next TP.'],
    ['One change', 'The teacher names one thing they would do differently. The others say what it would change for the students.'],
    ['Ask the teacher', 'Ask the teacher one question about their lesson. Start with something that worked.']
  ];
  const PIPS = [[4], [0, 8], [0, 4, 8], [0, 2, 6, 8], [0, 2, 4, 6, 8], [0, 2, 3, 5, 6, 8]];
  const dieSVG = n => '<svg viewBox="0 0 120 120" aria-hidden="true"><rect x="6" y="6" width="108" height="108" rx="22" class="die-b"/>' + PIPS[n].map(i => '<circle cx="' + (30 + (i % 3) * 30) + '" cy="' + (30 + Math.floor(i / 3) * 30) + '" r="9" class="die-p"/>').join('') + '</svg>';
  let DICE = null;
  function backdrop(){ let back = document.querySelector('.wheel-back'); if (!back) { back = document.createElement('div'); back.className = 'wheel-back'; document.body.appendChild(back); } return back; }
  function openDice(day, list){ DICE = { at: -1, n: 0, rolls: 0, list: list || [], who: 0 }; drawDice(backdrop(), false); }
  function drawDice(back, rolling){
    const D = DICE, f = D.at >= 0 ? FACES[D.at] : null, names = D.list.map(t => String(t.name || '').split(' ')[0]).filter(Boolean);
    back.innerHTML = `<div class="wheel game" role="dialog" aria-modal="true" aria-label="Roll for it">
      <div class="wh-top"><b>Roll for it</b><span>Six faces, six questions about today’s lessons.</span><button type="button" class="x" id="dcClose" aria-label="Close">×</button></div>
      <div class="wh-body"><div class="wh-wheel"><div class="die${rolling ? ' rolling' : ''}" id="dcDie">${dieSVG(D.at >= 0 ? D.at : D.n)}</div>
        <button type="button" class="spin" id="dcRoll"${rolling ? ' disabled' : ''}>${D.rolls ? 'Roll again' : 'Roll'}</button></div>
        <div class="wh-card">${f && !rolling ? `<p class="code">${D.at + 1}</p><p class="crit">${esc(f[0])}</p><p class="ask">${esc(f[1])}</p>${names.length ? `<p class="about">About <b>${esc(names[D.who % names.length])}</b>’s lesson first.</p>` : ''}`
          : `<p class="ask">${rolling ? 'Rolling…' : 'Roll the die. Whatever it lands on, the group answers, starting with something that worked.'}</p>`}
          <ol class="faces">${FACES.map((x, i) => `<li class="${i === D.at && !rolling ? 'on' : ''}">${esc(x[0])}</li>`).join('')}</ol></div></div></div>`;
    $('dcClose').onclick = () => { back.remove(); DICE = null; };
    back.onclick = e => { if (e.target === back) { back.remove(); DICE = null; } };
    $('dcRoll').onclick = () => {
      let pick = Math.floor(Math.random() * 6); if (pick === D.at) pick = (pick + 1 + Math.floor(Math.random() * 5)) % 6;
      D.rolls++; if (D.rolls > 1) D.who++; drawDice(back, true);
      const die = $('dcDie'); let k = 0; const t = setInterval(() => { if (!DICE || !die.isConnected) { clearInterval(t); return; } die.innerHTML = dieSVG(Math.floor(Math.random() * 6)); if (++k >= 9) { clearInterval(t); D.at = pick; drawDice(back, false); } }, 110);
    };
  }
  const STARTS = [
    ['w', 'I noticed that the students…'], ['w', 'The moment that worked best was…'], ['w', 'The students looked most engaged when…'],
    ['w', 'Something I would like to borrow is…'], ['w', 'The instructions were clear when…'], ['w', 'I could tell the students understood because…'],
    ['n', 'Next time, I wonder if…'], ['n', 'One thing I would try differently is…'], ['n', 'The students might have needed more…']
  ];
  let CARDS = null;
  function shuffled(){ const a = STARTS.map((_, i) => i); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function openCards(day, list){ CARDS = { order: shuffled(), open: [], at: -1, list: list || [] }; drawCards(backdrop()); }
  function drawCards(back){
    const K = CARDS, left = 9 - K.open.length, cur = K.at >= 0 ? STARTS[K.order[K.at]] : null;
    back.innerHTML = `<div class="wheel game" role="dialog" aria-modal="true" aria-label="Flip a card">
      <div class="wh-top"><b>Flip a card</b><span>${left ? 'Take turns. Flip a card and finish the sentence about a classmate’s lesson.' : '<b class="bang">All nine.</b> Every card turned.'}</span><button type="button" class="x" id="cdClose" aria-label="Close">×</button></div>
      <div class="wh-body"><div class="board3 flip">${K.order.map((si, i) => { const up = K.open.indexOf(i) !== -1, s = STARTS[si];
          return `<button type="button" class="fc${up ? ' up ' + s[0] : ''}${i === K.at ? ' at' : ''}" data-fc="${i}" aria-label="${up ? esc(s[1]) : 'Card ' + (i + 1) + ', face down'}"><span class="fc-in"><span class="fc-f"><i>?</i></span><span class="fc-b">${esc(s[1])}</span></span></button>`; }).join('')}</div>
        <div class="wh-card">${cur ? `<p class="code">${cur[0] === 'w' ? 'What worked' : 'To try'}</p><p class="crit">${esc(cur[1])}</p><p class="ask">Finish the sentence about one moment you saw today. The teacher listens, then says what they were thinking.</p>`
          : '<p class="ask">Nine cards, face down. Six start with something that worked, three with something to try.</p>'}
          <div class="row2"><button type="button" class="g" id="cdNew">${left ? 'Shuffle again' : 'New cards'}</button></div></div></div></div>`;
    $('cdClose').onclick = () => { back.remove(); CARDS = null; };
    back.onclick = e => { if (e.target === back) { back.remove(); CARDS = null; } };
    back.querySelectorAll('[data-fc]').forEach(b => b.onclick = () => { const i = +b.dataset.fc; if (K.open.indexOf(i) === -1) K.open.push(i); K.at = i; drawCards(back); });
    $('cdNew').onclick = () => { K.order = shuffled(); K.open = []; K.at = -1; drawCards(back); };
  }
  const style2 = document.createElement('style'); style2.textContent = `
  .die{width:190px; height:190px; margin:10px auto 0;} .die svg{width:100%; height:100%; filter:drop-shadow(0 10px 14px rgba(0,0,0,.22));}
  .die-b{fill:var(--paper); stroke:var(--ink); stroke-width:4;} .die-p{fill:var(--brick);}
  .die.rolling{animation:dieroll .22s linear infinite;} @keyframes dieroll{0%{transform:rotate(-9deg) translateY(0)}50%{transform:rotate(9deg) translateY(-12px)}100%{transform:rotate(-9deg) translateY(0)}}
  .wh-card .about{margin:10px 0 0; font-size:15px;} .faces{margin:16px 0 0; padding:0; list-style:none; counter-reset:f; display:grid; grid-template-columns:1fr 1fr; gap:6px 14px; font-size:13.5px; color:var(--grey);}
  .faces li{counter-increment:f;} .faces li::before{content:counter(f); display:inline-grid; place-items:center; width:18px; height:18px; border-radius:5px; border:1.5px solid currentColor; font-size:11px; font-weight:700; margin-right:7px;} .faces li.on{color:var(--ink); font-weight:700;}
  .board3.flip{perspective:900px;} .fc{aspect-ratio:1 / 1; border:0; background:none; padding:0; cursor:pointer; font:inherit;}
  .fc-in{position:relative; display:block; width:100%; height:100%; transform-style:preserve-3d; transition:transform .5s cubic-bezier(.2,.7,.2,1);} .fc.up .fc-in{transform:rotateY(180deg);}
  .fc-f, .fc-b{position:absolute; inset:0; border-radius:14px; display:flex; align-items:center; justify-content:center; text-align:center; -webkit-backface-visibility:hidden; backface-visibility:hidden; padding:10px;}
  .fc-f{background:var(--teal); color:var(--paper); box-shadow:0 4px 0 rgba(0,0,0,.18);} .fc-f i{font-style:normal; font-family:Newsreader,Georgia,serif; font-size:44px; font-weight:700; opacity:.9;}
  .fc:hover .fc-f{filter:brightness(1.12);} .fc-b{transform:rotateY(180deg); font-size:14.5px; line-height:1.3; font-weight:600; color:var(--ink); background:var(--fb-good-wash);} .fc.n .fc-b{background:var(--fb-act-wash);}
  .fc.at .fc-b{box-shadow:0 0 0 3px var(--ink);}
  @media (max-width:560px){ .die{width:140px; height:140px;} .fc-b{font-size:12px; padding:6px;} .fc-f i{font-size:32px;} .faces{grid-template-columns:1fr;} }
  @media (prefers-reduced-motion:reduce){ .die.rolling{animation:none;} .fc-in{transition:none;} }`;
  document.head.appendChild(style2);
  window.HubFbGames = {
    /* use(() => the course's timetable days); then wheel(day, list) or game('bingo' | 'xo', day, list); day = { date }; list = [{ name }] or none */
    use: function(days){ DAYS_SRC = days; },
    focus: function(date){ return focusOn(date); },
    wheel: function(day, list){ openWheel(day, list); },
    game: function(kind, day, list){ if (kind === 'dice') openDice(day, list); else if (kind === 'cards') openCards(day, list); else openGame(kind, day, list); }
  };
})();
