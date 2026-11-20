/* Connect Lite — Language analysis, start to finish (the short session), printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs language-analysis-short <folder> shows what it prints).
 *
 * What "Print with the answers" writes on this session:
 *   2  Why analyze it first?   the answer inside each of the two cards
 *                              These are the page's own reveal cards: the stylesheet shows them in this print by
 *                              itself (.reveal-card .a), open or shut, so nothing is written for them here.
 *   3  Jargon match            under the two columns: each of the seven terms in bold, then its meaning
 *   6  The staging example     the page's own example ("See staging example": a completed grammar analysis, the
 *                              model for the live draft of parts 4 and 5), shown as it stands, open or shut
 * Part 1 (the show of hands) is a question for the room, and parts 4 and 5 (the live draft) are the trainee's own
 * TP point: the page holds no answer to either beyond the example above, so none is printed.
 *
 * THE PAGE'S OWN ANSWER KEY ("Reveal answer key: save or print to keep") holds one thing and no more: the seven terms
 * with their meanings (part 3). They are printed under their own task here, so the key is left out of this print,
 * open or shut: every answer is said once.
 *
 * WHERE THE ANSWERS COME FROM. Nothing is copied into this file. The page's own list is read by name: TERMS (the one
 * its two columns are drawn from and matched against, and its key is drawn from). The lines are written only if every
 * term and every meaning of the list is on the page exactly once, on the task's own buttons; if the list is missing
 * or does not fit the page, the task gets no line: nothing is ever guessed. The example is the page's own block.
 *
 * Nothing the trainee did is touched: nothing is pressed, matched, typed, opened or shut. The page's own print rules
 * put a matched task back on paper as it was untouched, without the count, so an answered page prints the same as an
 * untouched one.
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

  /* 3 · Jargon match. Each item of the page's list is [the term, its meaning]. */
  var terms = data(function(){ return TERMS; }), match = document.getElementById('match');
  if (isList(terms) && match && terms.every(function(t){ return t && typeof t[0] === 'string' && typeof t[1] === 'string'; })
      && fits(terms.map(function(t){ return t[0]; }), texts('#match [data-l]'))
      && fits(terms.map(function(t){ return t[1]; }), texts('#match [data-r]')))
    terms.forEach(function(t){ A.line(match, '<b>' + esc(t[0]) + ':</b> ' + esc(t[1])); });

  /* 6 · The staging example: the page's own block, shown whether it is open or shut on the screen */
  A.show('#ex');

  /* the page's own key repeats part 3, which is answered under its task above */
  A.hide('#key');
});
