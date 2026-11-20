/* Connect Lite — Giving feedback on tasks (the short session), printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs giving-feedback-on-tasks-short <folder> shows what it prints).
 *
 * What "Print with the answers" writes on this session:
 *   2  Method to task     the feedback method inside each of the five task cards. These are the page's own reveal
 *                         cards: the stylesheet shows them in this print by itself (.reveal-card .a), open or shut,
 *                         so nothing is written for them here.
 *   3  Weak moves         under each of the five moves: whether the page counts it as one that works or a weak one,
 *                         in bold, and the page's own reason
 *   4  The order          after the four stages: the order the page counts as right
 *   5  Run it live        the "Watch for" note inside each of the three task cards, shown where it stands on the page
 *                         (the page's own note for the observers; the task itself is the trainees' own)
 * Part 1 (the lead-in) and part 6 (the wrap-up) are the trainee's own, and the page holds no answer to either, so
 * nothing is printed for them.
 *
 * WHERE THE ANSWERS COME FROM
 *   Part 3: the page's own list (MOVES: [the move, works or not, the reason]), top-level in its script, read by name.
 *   A move on the page is matched by its own words; one that matches none, or more than one, gets no line.
 *   The two words "Works" and "Weak" are COPIED from the page's own marks ('✓ Works' and '✗ Weak', in the click
 *   handler under "3. Spot the weak move" in giving-feedback-on-tasks-short/index.html), which this file cannot read.
 *   IF THE PAGE'S MARKS CHANGE, CHANGE THEM HERE TOO, and run the check again.
 *   Part 4: the page's own list (ORDER_CORRECT, the one its lines are marked against), read by name; the order is
 *   written only if every stage in it is exactly one of the lines on the page and the page has no other line.
 *   If a list is missing, nothing is written for it: nothing is ever guessed.
 *
 * Nothing the trainee did is touched: no move is judged, no stage placed, no card opened or shut. A move already
 * judged on the screen carries its own reason; that is put aside for this print (its mark and the placed stages are
 * left off the paper by the page's own print rule, its colors by library.js), so an answered page prints the same as
 * an untouched one and each answer is said once.
 */
SessionAnswers.register(function(A){
  /* the page's lists are top-level in its own script, so they are read by name; if one is missing, nothing is written */
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

  /* 3 · Weak moves. COPIED from the page's marks: '✓ Works' and '✗ Weak'. */
  var MARK = { yes: 'Works', no: 'Weak' };
  var moves = data(function(){ return MOVES; });
  if (moves && moves.filter) A.each('#moves .move', function(b){
    var s = b.querySelector('.top > span:not(.mark)'); if (!s) return;
    var said = norm(s.textContent);
    var hit = moves.filter(function(m){ return m && norm(m[0]) === said; });
    if (hit.length !== 1 || typeof hit[0][1] !== 'boolean' || typeof hit[0][2] !== 'string') return;
    A.line(b, '<b>' + (hit[0][1] ? MARK.yes : MARK.no) + '.</b> ' + esc(hit[0][2]));
  });
  /* the reason a move judged on the screen already carries: the line above says it */
  A.hide('#moves .why');

  /* 4 · The order: the stages in order, one to a line */
  var order = data(function(){ return ORDER_CORRECT; });
  var box = document.querySelector('#order .ox');
  if (order && order.map && order.length && box) {
    var lines = [].map.call(box.querySelectorAll('.order-line'), function(b){ var s = b.querySelector('span:not(.num)'); return norm(s ? s.textContent : ''); });
    var ok = lines.length === order.length && order.every(function(s){ return lines.filter(function(l){ return l === norm(s); }).length === 1; });
    if (ok) A.after(box, order.map(function(s, i){ return '<b>' + (i + 1) + '</b> ' + esc(s); }).join('<br>'));
  }

  /* 5 · Run it live: what to watch for on each task card, shown whether the card is taken or not */
  A.show('#live .watch');
});
