/* Connect Lite — Test-Teach-Test: taught the way you'll teach it (the short session), printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs test-teach-test-short <folder> shows what it prints).
 *
 * What "Print with the answers" writes on this session:
 *   2  What is TTT?           the answer inside the card
 *   3  Match the terms        under the two columns: each of the five terms in bold, then its meaning (5)
 *   6  Detail questions       "True" or "False" and the page's note, inside each of the six cards
 *   7  Debrief                under the four stages: the four in the order the page counts as right, numbered (1);
 *                             then the page's own example lesson ("See staging example"), shown as it stands, whether
 *                             it is open or shut on the screen
 * The cards of parts 2 and 6 are the page's own reveal cards: the stylesheet shows them in this print by itself
 * (.reveal-card .a), open or shut, so nothing is written for them here.
 * Part 1 (the show of hands) and part 4 (predict the staging, with a partner) are questions for the room: the page
 * holds no answer to either, so none is printed. Part 5 is the text to read.
 *
 * THE PAGE'S OWN ANSWER KEY ("Reveal answer key: save or print to keep") holds two things and no more: the five terms
 * with their meanings (part 3) and the six true or false statements (part 6). Both are printed under their own tasks
 * here, so the key is left out of this print, open or shut: every answer is said once.
 *
 * WHERE THE ANSWERS COME FROM. Nothing is copied into this file. The page's own lists are top-level in its script and
 * are read by name: TERMS (the one its two columns are drawn from and matched against) and CORRECT_ORDER (the one a
 * click on a stage is marked against). An answer is written only if every item of its list is on the page exactly
 * once, on the task's own buttons, and the page holds no more of them than the list; if a list is missing or does not
 * fit the page, that task gets no line: nothing is ever guessed. The example lesson is the page's own block (#ex).
 *
 * Nothing the trainee did is touched: nothing is pressed, matched, placed, opened or shut, and no count moves. The
 * page's own print rules put a matched term, a numbered stage and an opened card back on paper as they were
 * untouched, without the counts, so an answered page prints the same as an untouched one.
 */
SessionAnswers.register(function(A){
  /* the page's lists are read by name; if one is missing, nothing is written for its task */
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var texts = function(sel){ return [].map.call(document.querySelectorAll(sel), function(e){ return norm(e.textContent); }); };
  /* every item of the list is on the page exactly once, and the page holds no more than the list */
  var fits = function(items, onPage){
    return items.length > 0 && items.length === onPage.length && items.every(function(s){ return onPage.filter(function(t){ return t === norm(s); }).length === 1; });
  };
  var isList = function(x){ return !!x && typeof x.map === 'function' && x.length > 0; };

  /* 3 · Match the terms. Each item of the page's list is [the term, its meaning]. */
  var terms = data(function(){ return TERMS; }), match = document.getElementById('match');
  if (isList(terms) && match && terms.every(function(t){ return t && typeof t[0] === 'string' && typeof t[1] === 'string'; })
      && fits(terms.map(function(t){ return t[0]; }), texts('#match [data-l]'))
      && fits(terms.map(function(t){ return t[1]; }), texts('#match [data-r]')))
    terms.forEach(function(t){ A.line(match, '<b>' + esc(t[0]) + ':</b> ' + esc(t[1])); });

  /* 7 · Debrief: put the stages back in order. The page's list is the four stages in the order it counts as right.
     Each stage's words are read from its button without the circle that holds its number (the page is not touched). */
  var order = data(function(){ return CORRECT_ORDER; }), box = document.getElementById('order');
  var stages = [].map.call(document.querySelectorAll('#order .order-line'), function(b){ var s = b.querySelector('span:not(.num)'); return s ? norm(s.textContent) : ''; });
  if (isList(order) && box && order.every(function(s){ return typeof s === 'string'; }) && fits(order, stages))
    A.after(box, order.map(function(s, i){ return '<div><b>' + (i + 1) + '.</b> ' + esc(s) + '</div>'; }).join(''));

  /* 7 · the page's own example lesson, shown whether it is open or shut on the screen */
  A.show('#ex');

  /* the page's own key repeats parts 3 and 6, which are answered under their tasks above */
  A.hide('#key');
});
