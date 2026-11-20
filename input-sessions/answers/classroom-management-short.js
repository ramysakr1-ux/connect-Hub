/* Connect Lite — Classroom management: think on your feet (the short session), printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs classroom-management-short <folder> shows what it prints).
 *
 * What "Print with the answers" writes on this session:
 *   3  Monitoring       one line for each of the five pairs: the pair and what it is doing, the reply the page counts
 *                       as right, in bold, and the page's own reason (5). The simulation itself is not on the paper
 *                       (the page's own print rule leaves it off), so each line names its pair.
 *   4  Instructions     under each of the four tasks (the page's paper list): the check that differs from task to
 *                       task, in bold, and the page's own note (4); after the list, the four checks the page makes of
 *                       every instruction, each in bold with its note (4). These are the page's checks, not a model
 *                       instruction: the page holds none.
 *   2  What classroom management entails   the discussion prompt inside each of the eight cards
 *   5  Stopping an activity                when each of the five is the right one, inside its card
 *                       These are the page's own reveal cards: the stylesheet shows them in this print by itself
 *                       (.reveal-card .a), open or shut, so nothing is written for them here.
 * Part 1 (the brainstorm) and part 7 (the wrap-up) are the trainee's own. Part 6 (the internal clock) answers with the
 * trainee's own time. None is printed.
 *
 * WHERE THE ANSWERS COME FROM. Nothing is copied into this file.
 *   Part 3: the page's own lists, top-level in its script, read by name: PAIRS (each pair's letter, what it turns into
 *   and its words) and RESPONSES (for each state three replies: [the words, right or not, the reason]). A pair that
 *   never changes (changeAt null) is "Working fine" all the way, as the page draws it. A line is written only if
 *   exactly one of the three replies is marked right: nothing is ever guessed.
 *   Part 4: the page's own list TASKS ([the task, whether it needs an ICQ]) and its own checkInstruction(), which only
 *   reads what it is given and returns the five checks as [passed, the name, the note]. It is asked here about a
 *   made-up word, never about what the trainee wrote, and only the names and notes are used. Each task of the paper
 *   list (#taskPaper, built from TASKS) is matched by its own words; one that matches none, or more than one, gets no
 *   line.
 *
 * Nothing the trainee did is touched: no pair is gone to, no reply pressed, nothing typed over, no card opened or shut,
 * the clock is left alone. The line "The check appears as you type" is for the screen and goes once something is
 * typed; it is put aside for this print, so an answered page prints the same as an untouched one.
 */
SessionAnswers.register(function(A){
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var isList = function(x){ return !!x && typeof x.filter === 'function'; };

  /* 3 · Monitoring. The pairs are not on the paper, so the lines go after them, in the page's order. */
  var pairs = data(function(){ return PAIRS; }), replies = data(function(){ return RESPONSES; });
  var box = document.getElementById('pairs');
  if (box && isList(pairs) && replies) pairs.slice().reverse().forEach(function(p){   /* each goes straight after the box, so the last is written first */
    if (!p || !p.key) return;
    var state = p.changeAt === null ? 'fine' : p.status, opts = replies[state];
    if (!isList(opts) || typeof p.text !== 'string') return;
    var right = opts.filter(function(o){ return o && o[1] === true; });
    if (right.length !== 1 || typeof right[0][0] !== 'string') return;
    A.after(box, 'Pair ' + esc(p.key) + ' · ' + esc(p.text) + ': <b>' + esc(right[0][0]) + '</b>' + (right[0][2] ? ' ' + esc(right[0][2]) : ''));
  });

  /* 4 · Instructions. The page's five checks: the first four are the same for every task, the fifth depends on it. */
  var tasks = data(function(){ return TASKS; });
  var checks = function(needsICQ){
    var r = data(function(){ return checkInstruction('x', needsICQ); });
    return isList(r) && r.length === 5 && r.every(function(c){ return c && typeof c[1] === 'string' && typeof c[2] === 'string'; }) ? r : null;
  };
  var said = function(c){ return '<b>' + esc(c[1]) + '</b>. ' + esc(c[2]); };   /* as the page writes a check: the name, then the note */
  var paper = document.getElementById('taskPaper');
  if (paper && isList(tasks)) {
    A.each('li', function(li){
      var hit = tasks.filter(function(t){ return t && norm(t[0]) === norm(li.textContent); });
      if (hit.length !== 1) return;
      var c = checks(!!hit[0][1]); if (c) A.line(li, said(c[4]));
    }, paper);
    var with_ = checks(true), without = checks(false);
    /* the four that do not depend on the task, and only if they really are the same either way */
    if (with_ && without) [3, 2, 1, 0].forEach(function(i){
      if (with_[i][1] === without[i][1] && with_[i][2] === without[i][2]) A.after(paper, said(with_[i]));
    });
  }
  /* a line for the screen, there only until something is typed */
  A.hide('#ihint');
});
