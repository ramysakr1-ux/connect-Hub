/* Connect Lite — Teaching vocabulary and lexis (the short session), printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs teaching-vocabulary-short <folder> shows what it prints).
 *
 * What "Print with the answers" writes on this session:
 *   2  Match the terms          under the two columns: each of the six terms in bold, then its meaning
 *   3  Choose a technique       under each of the four words: the technique the page counts as right, in bold, then
 *                               the page's own note
 *   4  Build the collocations   under "Make ___" and under "Do ___": the four words the page counts as right, in bold
 *   5  Discuss                  the page's own example ("See staging example": clarifying "take up (a hobby)"), row
 *                               by row, written whether it is open or shut on the screen
 * Part 1 (the show of hands) is a question for the room, and the three questions of part 5 are about the trainee's
 * own TP point: the page holds no answer to either beyond the example above, so none is printed.
 *
 * THE PAGE'S OWN ANSWER KEY ("Reveal answer key: save or print to keep") holds one thing and no more: the six terms
 * with their meanings (part 2). They are printed under their own task here, so the key is left out of this print,
 * open or shut: every answer is said once.
 *
 * WHERE THE ANSWERS COME FROM. Nothing is copied into this file. The page's own lists are read by name: TERMS (the
 * one its two columns are drawn from and matched against), CHOOSE_ITEMS (the one its options are marked against, and
 * its notes come from), GROUPS (the one a clicked collocation is marked against), EXAMPLE_TITLE and EXAMPLE_ROWS (the
 * example). An answer is written only if it fits the page: every term and meaning on the task's own buttons exactly
 * once; a word of part 3 on the page exactly once, with its right technique on exactly one of its own buttons; every
 * right collocation on exactly one of its verb's own buttons. If a list is missing or does not fit the page, that
 * task gets no line: nothing is ever guessed.
 *
 * Nothing the trainee did is touched: nothing is pressed, matched, typed, opened or shut. The page's own print rules
 * put a matched task, a chosen technique and a clicked collocation back on paper as they were untouched (no count,
 * no tick or cross, no note), so an answered page prints the same as an untouched one.
 */
SessionAnswers.register(function(A){
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var list = function(sel, root){ return [].slice.call((root || document).querySelectorAll(sel)); };
  var texts = function(sel){ return list(sel).map(function(e){ return norm(e.textContent); }); };
  /* every item of the list is on the page exactly once, and the page holds no more than the list */
  var fits = function(items, onPage){
    return items.length > 0 && items.length === onPage.length && items.every(function(s){ return onPage.filter(function(t){ return t === norm(s); }).length === 1; });
  };
  var isList = function(x){ return !!x && typeof x.map === 'function' && x.length > 0; };

  /* 2 · Match the terms. Each item of the page's list is [the term, its meaning]. */
  var terms = data(function(){ return TERMS; }), match = document.getElementById('match');
  if (isList(terms) && match && terms.every(function(t){ return t && typeof t[0] === 'string' && typeof t[1] === 'string'; })
      && fits(terms.map(function(t){ return t[0]; }), texts('#match [data-l]'))
      && fits(terms.map(function(t){ return t[1]; }), texts('#match [data-r]')))
    terms.forEach(function(t){ A.line(match, '<b>' + esc(t[0]) + ':</b> ' + esc(t[1])); });

  /* 3 · Choose a technique. Each item of the page's list is [the word, the right technique, the note]. The option is
     read from the button's own data-opt, so a tick the screen has put on it makes no difference. */
  var items = data(function(){ return CHOOSE_ITEMS; });
  if (isList(items)) list('#choose .item').forEach(function(box){
    var w = box.querySelector('.w'); if (!w) return;
    var word = norm(w.textContent);
    if (texts('#choose .item .w').filter(function(t){ return t === word; }).length !== 1) return;
    var hit = items.filter(function(it){ return it && norm(it[0]) === word; });
    if (hit.length !== 1 || typeof hit[0][1] !== 'string' || typeof hit[0][2] !== 'string') return;
    var on = list('button[data-opt]', box).filter(function(b){ return b.getAttribute('data-opt') === hit[0][1]; });
    if (on.length === 1) A.line(box, '<b>' + esc(hit[0][1]) + '.</b> ' + esc(hit[0][2]));
  });

  /* 4 · Build the collocations. Each group of the page's list holds its verb, the words on its buttons and the ones
     that are right. The right ones are written in the order they stand on the buttons. */
  var groups = data(function(){ return GROUPS; }), cols = list('#collos .collo');
  if (isList(groups) && groups.length === cols.length) groups.forEach(function(g, gi){
    var box = cols[gi], w = box.querySelector('.w');
    if (!g || typeof g.verb !== 'string' || !isList(g.correct) || !w || norm(w.textContent) !== g.verb + ' ___') return;
    var on = list('button[data-w]', box).map(function(b){ return b.getAttribute('data-w'); });
    if (!g.correct.every(function(c){ return typeof c === 'string' && on.filter(function(x){ return x === c; }).length === 1; })) return;
    var right = on.filter(function(x){ return g.correct.indexOf(x) !== -1; });
    A.line(box, right.map(function(x){ return '<b>' + esc(x) + '</b>'; }).join(', '));
  });

  /* 5 · The example. Each row of the page's list is [the label, what goes with it]. The page draws it only while it
     is open, so it is written here from the same list, and the page's own copy is put aside. */
  var title = data(function(){ return EXAMPLE_TITLE; }), rows = data(function(){ return EXAMPLE_ROWS; }), stg = document.querySelector('#staging .stagebox');
  if (typeof title === 'string' && title && isList(rows) && stg && rows.every(function(r){ return r && r.length === 2 && typeof r[0] === 'string' && typeof r[1] === 'string'; }))
    A.line(stg, '<b>' + esc(title) + '</b><br>' + rows.map(function(r){ return '<b>' + esc(r[0]) + ':</b> ' + esc(r[1]); }).join('<br>'));
  A.hide('#staging .stagebox h4, #staging .stagebox table');

  /* the page's own key repeats part 2, which is answered under its task above */
  A.hide('#key .keyblock');
  /* what an answered row shows on the screen (the tick or cross and the note): the lines above say it */
  A.hide('#choose .fb');
});
