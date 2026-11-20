/* Connect Lite — Connected speech: every answer under its task, for "Print with the answers".
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * answers.js calls this when the button is pressed, prints, and takes everything away again. Nothing a trainee has
 * clicked, marked or typed is touched: no card is opened, no pair is matched, the walker stays where he is.
 *
 * The session has eight tasks. Three keep their answer in a block the print already knows how to show:
 *   Lead-in and Elision trivia   the sentence inside each card (.reveal-card .a)
 *   Dictogloss                   the text and its table (.reveal-block)
 * and five need a hand:
 *   The dictation computer       under each printed sentence, the reply that goes with it, then the real sentence and
 *                                the feature the page gives for it
 *   The link maze                the letter he comes out at, then the route, step by step
 *   Mark the links               the suggested links, each as the two words it joins
 *   Spot the weak forms          under each sentence, the words that are weak
 *   All five, together           the back of each card, shown as it is
 *
 * Every answer is read from the page's own lists (dcItems, mazeData, MAZE_TURN, keyIdx, weakSentences) and from the
 * words on the screen (the letter on each reply, the words of the story), so a correction made on the page is a
 * correction here. Each one is checked against the words on the screen before it is written, and left out if they do
 * not agree, so an answer cannot land under the wrong task. One sentence is copied from the page by hand, because it
 * lives inside revealMaze() and nowhere else: "The way out, facing up from Start:", each step as "1. phrase /sound/
 * turn", " · " between the steps and " · out at " before the letter.
 */
SessionAnswers.register(function(A){
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var has = function(v){ return typeof v !== 'undefined' && v !== null; };
  var DOT = ' \u00B7 ';

  /* 2 · The dictation computer: sentence 1 goes with the reply that carries the same data-i. */
  if (typeof dcItems !== 'undefined' && has(dcItems)) {
    A.each('#dcLeft .pill', function(pill){
      var i = parseInt(pill.getAttribute('data-i'), 10), it = dcItems[i]; if (!it) return;
      var said = pill.firstElementChild; if (!said || A.txt(said.innerHTML) !== (i + 1) + '. ' + A.txt(it.heard)) return;
      var reply = document.querySelector('#dcRight .pill[data-i="' + i + '"]'); if (!reply) return;
      var label = reply.textContent.replace(/\s+/g, ' ').trim(); if (label.slice(-A.txt(it.reply).length) !== A.txt(it.reply)) return;
      A.line(pill, '<b>' + esc(label) + '</b> ' + it.real + '<br>' + it.feature);
    });
  }

  /* 3 · The link maze: the page prints no maze, so the answer is the door and the route in words, as Reveal the answer
     writes it. If the route is already showing on the screen it is put aside for this print, so it is not there twice. */
  if (typeof mazeData !== 'undefined' && has(mazeData) && typeof MAZE_TURN !== 'undefined' && has(MAZE_TURN)) {
    var grid = document.getElementById('mazeGrid'), ok = !!grid, steps = [];
    (mazeData.route || []).forEach(function(rc, n){
      var cell = mazeData.grid[rc[0]] && mazeData.grid[rc[0]][rc[1]]; if (!cell || !MAZE_TURN[cell[1]]) { ok = false; return; }
      steps.push((n + 1) + '. ' + cell[0] + ' /' + cell[1] + '/ ' + MAZE_TURN[cell[1]]);
    });
    /* the letter must be a door that is on the board */
    var door = false; A.each('.maze-cell.exit', function(e){ if (e.textContent === mazeData.exit) door = true; }, grid || document);
    if (ok && door && steps.length) {
      A.after(grid, '<b>' + esc(mazeData.exit) + '.</b> The way out, facing up from Start: ' + steps.join(DOT) + DOT + 'out at ' + esc(mazeData.exit) + '.');
      A.hide('#mazeRoute');
    }
  }

  /* 4 · Mark the links: each suggested link, as the two words on either side of it. */
  var para = document.getElementById('linkingPara');
  if (para && typeof keyIdx !== 'undefined' && has(keyIdx)) {
    var shown = []; A.each('.word-plain', function(w){ shown.push(w.innerHTML); }, para);
    var links = keyIdx.filter(function(k){ return has(shown[k]) && has(shown[k + 1]) && !!para.querySelector('.link-gap[data-idx="' + k + '"]'); })
      .map(function(k){ return '<b>' + shown[k] + '\u203F' + shown[k + 1] + '</b>'; });
    if (links.length === keyIdx.length) A.after(para, links.join(DOT));
  }

  /* 5 · Spot the weak forms: under each sentence, its weak words, in the order they come. */
  if (typeof weakSentences !== 'undefined' && has(weakSentences)) {
    var blocks = document.querySelectorAll('#weakArea .text-block');
    weakSentences.forEach(function(s, n){
      var block = blocks[n]; if (!block) return;
      var said = [].map.call(block.querySelectorAll('.word-link'), function(w){ return w.textContent; });
      if (said.join(' ') !== A.txt(s.text)) return;
      var weak = s.weak.map(function(k){ return '<b>' + esc(said[k]) + '</b>'; });
      if (weak.length) A.line(block, weak.join(', '));
    });
  }

  /* All five, together: the back of each card is the answer, and the page's own print rule hides it. */
  A.show('#featGrid .feat-back');
});
