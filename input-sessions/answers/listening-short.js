/* Connect Lite — Listening: taught the way you'll teach it (the short session), printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs listening-short <folder> shows what it prints).
 *
 * What "Print with the answers" writes on this session:
 *   1  Lead-in                     the answer inside the card ("Once.")
 *   2  Pre-teach vocab             under the two columns: each of the seven terms in bold, then its meaning
 *   4  Listen to the dialogue      the page's own transcript of the dialogue ("Show transcript"), shown whether it is
 *                                  open or shut on the screen: it is what the ideas of part 3 are checked against
 *   5  Detail task                 "True" or "False" and the page's note, inside each of the six cards
 *   6  Debrief                     under the five stages: the stages in their order; then the page's own example
 *                                  lesson ("See staging example"), stage by stage, written whether it is open or shut
 * The answers of parts 1 and 5 are the page's own reveal cards: the stylesheet shows them in this print by itself
 * (.reveal-card .a), open or shut, so nothing is written for them here.
 * Part 3 (predict the staging, "no wrong answers yet") is a question for the room: the page holds no answer of its
 * own to it, so none is printed.
 *
 * THE PAGE'S OWN ANSWER KEY ("Reveal answer key: save or print to keep") holds two things and no more: the seven
 * terms with their meanings (part 2) and the six true or false statements (part 5). Both are printed under their own
 * tasks here, so the key is left out of this print, open or shut: every answer is said once.
 *
 * WHERE THE ANSWERS COME FROM. Nothing is copied into this file. The page's own lists are read by name: TERMS (the
 * one its two columns are drawn from and matched against), CORRECT_ORDER (the one its stages are checked against),
 * EXAMPLE_TITLE and EXAMPLE_ROWS (the staging example). An answer is written only if every item of its list is on
 * the page exactly once, on the task's own buttons; if a list is missing or does not fit the page, that task gets no
 * line: nothing is ever guessed.
 *
 * Nothing the trainee did is touched: nothing is pressed, matched, placed, played, opened or shut. The page's own
 * print rules already put a matched task, the placed stages and an opened card back on paper as they were untouched,
 * without the counts, so an answered page prints the same as an untouched one.
 */
SessionAnswers.register(function(A){
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var texts = function(sel){ return [].map.call(document.querySelectorAll(sel), function(e){ return norm(e.textContent); }); };
  /* every item of the list is on the page exactly once, and the page holds no more than the list */
  var fits = function(items, onPage){
    return items.length > 0 && items.length === onPage.length && items.every(function(s){ return onPage.filter(function(t){ return t === norm(s); }).length === 1; });
  };
  var isList = function(x){ return !!x && typeof x.map === 'function' && x.length > 0; };

  /* 2 · Pre-teach vocab. Each item of the page's list is [the term, its meaning]. */
  var terms = data(function(){ return TERMS; }), match = document.getElementById('match');
  if (isList(terms) && match && terms.every(function(t){ return t && typeof t[0] === 'string' && typeof t[1] === 'string'; })
      && fits(terms.map(function(t){ return t[0]; }), texts('#match [data-l]'))
      && fits(terms.map(function(t){ return t[1]; }), texts('#match [data-r]')))
    terms.forEach(function(t){ A.line(match, '<b>' + esc(t[0]) + ':</b> ' + esc(t[1])); });

  /* 4 · Listen to the dialogue: the page's own transcript, as it stands */
  A.show('#transcript');

  /* 6 · Debrief: put the stages back in order. The page's list is the stages, first to last; each is the label of
     one of the task's own buttons (the number circle in front of the label is left out of the match). */
  var order = data(function(){ return CORRECT_ORDER; }), box = document.getElementById('order');
  if (isList(order) && box && order.every(function(s){ return typeof s === 'string'; }) && fits(order, texts('#order [data-o] > span:not(.num)')))
    A.line(box, '<ol style="margin:0;padding-left:22px;">' + order.map(function(s){ return '<li><b>' + esc(s) + '</b></li>'; }).join('') + '</ol>');

  /* 6 · The staging example. Each row of the page's list is [the stage, its time, the procedure]. The page draws it
     only while it is open, so it is written here from the same list, and the page's own copy is put aside. */
  var title = data(function(){ return EXAMPLE_TITLE; }), rows = data(function(){ return EXAMPLE_ROWS; }), stg = document.querySelector('#staging .stagebox');
  if (typeof title === 'string' && title && isList(rows) && stg && rows.every(function(r){ return r && r.length === 3; }))
    A.line(stg, '<b>' + esc(title) + '</b><br>' + rows.map(function(r){ return '<b>' + esc(r[0]) + '</b> (' + esc(r[1]) + '): ' + esc(r[2]); }).join('<br>'));
  A.hide('#staging .stagebox h4, #staging .stagebox table');

  /* the page's own key repeats parts 2 and 5, which are answered under their tasks above */
  A.hide('#key .keyblock');
  /* "Click to reveal" is a word for the screen; here the answer stands under the question */
  A.hide('.reveal-card .hint');
});
