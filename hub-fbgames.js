/* Connect Lite -- the feedback games: Spin the criteria, Criteria bingo, XO.
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
    if (!codes.length) { if (window.hubSay) hubSay('No input sessions on the timetable yet, so there are no criteria to spin.'); return; }
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
    if (codes.length < 9) { if (window.hubSay) hubSay('Not enough criteria on the timetable yet for a 3 by 3.'); return; }
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
  window.HubFbGames = {
    /* use(() => the course's timetable days); then wheel(day, list) or game('bingo' | 'xo', day, list); day = { date }; list = [{ name }] or none */
    use: function(days){ DAYS_SRC = days; },
    focus: function(date){ return focusOn(date); },
    wheel: function(day, list){ openWheel(day, list); },
    game: function(kind, day, list){ openGame(kind, day, list); }
  };
})();
