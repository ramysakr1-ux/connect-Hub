/* Connect Lite — Functional language: taught the way you'll teach it (the short session), printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs functional-language-short <folder> shows what it prints).
 *
 * What "Print with the answers" writes on this session:
 *   3  Match the terms             under the two columns: each of the five terms in bold, then its meaning
 *   5  Rank by formality           under the four exponents: the order the page counts as right, most formal first
 *   6  Debrief: put the stages back in order   under the five stages: the order the page counts as right
 *   6  The staging example         the page's own example lesson ("See staging example"), stage by stage, written
 *                                  whether it is open or shut on the screen
 *   2  What is functional language?   the answer inside the card
 *   4  Detail check (Stage 4)      "True" or "False" and the page's note, inside each of the six cards
 *                                  These are the page's own reveal cards: the stylesheet shows them in this print by
 *                                  itself (.reveal-card .a), open or shut, so nothing is written for them here.
 * Part 1 (the show of hands) and Stage 2 of part 4 (predict the staging, "no wrong answers yet") are questions for the
 * room: the page holds no answer to either, so none is printed. Stage 3 is the text to read.
 *
 * THE PAGE'S OWN ANSWER KEY ("Reveal answer key: save or print to keep") holds two things and no more: the five terms
 * with their meanings (part 3) and the six true or false statements (part 4). Both are printed under their own tasks
 * here, so the key is left out of this print, open or shut: every answer is said once.
 *
 * WHERE THE ANSWERS COME FROM. Nothing is copied into this file. The page's own lists are read by name: TERMS (the
 * one its two columns are drawn from and matched against), RANK_CORRECT (the one a finished ranking is marked
 * against), CORRECT_ORDER (the one the stages are marked against), EXAMPLE_TITLE and EXAMPLE_ROWS (the staging
 * example). An answer is written only if every item of its list is on the page exactly once, on the task's own
 * buttons; if a list is missing or does not fit the page, that task gets no line: nothing is ever guessed.
 *
 * Nothing the trainee did is touched: nothing is pressed, matched, ranked, placed, opened or shut. The page's own
 * print rules already put a matched, ranked or ordered task back on paper as the task it was, without its count or
 * its "In order", so an answered page prints the same as an untouched one.
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
  var numbered = function(items){ return items.map(function(s, i){ return '<b>' + (i + 1) + '</b> ' + esc(s); }).join(', '); };

  /* 3 · Match the terms. Each item of the page's list is [the term, its meaning]. */
  var terms = data(function(){ return TERMS; }), match = document.getElementById('match');
  if (isList(terms) && match && terms.every(function(t){ return t && typeof t[0] === 'string' && typeof t[1] === 'string'; })
      && fits(terms.map(function(t){ return t[0]; }), texts('#match [data-l]'))
      && fits(terms.map(function(t){ return t[1]; }), texts('#match [data-r]')))
    terms.forEach(function(t){ A.line(match, '<b>' + esc(t[0]) + ':</b> ' + esc(t[1])); });

  /* 5 · Rank by formality: the order a finished ranking is marked against, checked against the four exponents the
     page keeps for the paper (the ones on the screen go as they are picked) */
  var rank = data(function(){ return RANK_CORRECT; }), rankBox = document.getElementById('rank');
  if (isList(rank) && rankBox && fits(rank, texts('#rank .rank.paper .opt'))) A.line(rankBox, numbered(rank));

  /* 6 · Debrief: the order of the stages */
  var order = data(function(){ return CORRECT_ORDER; }), orderBox = document.getElementById('order');
  if (isList(order) && orderBox && fits(order, texts('#order .order-line span:not(.num)'))) A.line(orderBox, numbered(order));

  /* 6 · The staging example. Each row of the page's list is [the stage, its time, the procedure]. The page draws it
     only while it is open, and its print rule keeps it off the paper, so it is written here from the same list. */
  var title = data(function(){ return EXAMPLE_TITLE; }), rows = data(function(){ return EXAMPLE_ROWS; }), stg = document.querySelector('#staging .stagebox');
  if (typeof title === 'string' && title && isList(rows) && stg && rows.every(function(r){ return r && r.length === 3; }))
    A.line(stg, '<b>' + esc(title) + '</b><br>' + rows.map(function(r){ return '<b>' + esc(r[0]) + '</b> (' + esc(r[1]) + '): ' + esc(r[2]); }).join('<br>'));

  /* the page's own key repeats parts 3 and 4, which are answered under their tasks above */
  A.hide('#key .keyblock');
  /* "Click to reveal" is a word for the screen; here the answer stands under the question */
  A.hide('.reveal-card .hint');
});
