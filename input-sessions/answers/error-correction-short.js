/* Connect Lite — Facilitating self & peer correction of oral errors (the short session), printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs error-correction-short <folder> shows what it prints).
 *
 * What "Print with the answers" writes on this session:
 *   2  Decision flow          after the five steps: the order the page counts as right
 *   3  Correction sequence    after the eight steps: the order the page counts as right
 *   5  Choose a technique     the suggestion inside each of the five cards ("Suggested technique"). These are the
 *                             page's own reveal cards: the stylesheet shows them in this print by itself
 *                             (.reveal-card .a), open or shut, so nothing is written for them here.
 * Part 1 (the film, "who did the correcting?") and part 6 (the wrap-up) hold no answer on the page, and part 4 (the
 * twelve techniques) is to read, so nothing is printed for them. Which technique a trainee chose in part 5 is the
 * trainee's own, and the page's print rule already leaves the dropdowns off the paper.
 *
 * WHERE THE ANSWERS COME FROM. Nothing is copied into this file.
 *   Parts 2 and 3: the page's own lists (DECISION_FLOW and CORRECTION_SEQUENCE, the ones its lines are marked
 *   against), read by name; an order is written only if every step in it is exactly one of the lines on the page and
 *   the page has no other line. If a list is missing, nothing is written for it: nothing is ever guessed.
 *
 * Nothing the trainee did is touched: no step is placed, no card opened or shut, no technique chosen. The steps a
 * trainee has placed do not print as placed (the page's own print rule), so an answered page prints the same as an
 * untouched one and each answer is said once.
 */
SessionAnswers.register(function(A){
  /* the page's lists are top-level in its own script, so they are read by name; if one is missing, nothing is written */
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

  /* 2 · Decision flow, and 3 · Correction sequence: the order of the steps, one step to a line */
  var ordered = function(id, order){
    var box = document.querySelector('#' + id + ' .ox');
    if (!order || !order.map || !order.length || !box) return;
    var lines = [].map.call(box.querySelectorAll('.order-line'), function(b){ var s = b.querySelector('span:not(.num)'); return norm(s ? s.textContent : ''); });
    var ok = lines.length === order.length && order.every(function(s){ return lines.filter(function(l){ return l === norm(s); }).length === 1; });
    if (ok) A.after(box, order.map(function(s, i){ return '<b>' + (i + 1) + '</b> ' + esc(s); }).join('<br>'));
  };
  ordered('flow', data(function(){ return DECISION_FLOW; }));
  ordered('seq', data(function(){ return CORRECTION_SEQUENCE; }));
});
