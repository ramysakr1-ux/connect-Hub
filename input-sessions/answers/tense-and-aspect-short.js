/* Connect Lite — Tense and aspect (the short session), printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs tense-and-aspect-short <folder> shows what it prints).
 *
 * What "Print with the answers" writes on this session:
 *   2  Match the terms        under the two columns: each of the six terms in bold, then its meaning
 *   3  Choose the aspect      under each of the four situations: the option the page counts as right, in bold, then
 *                             the page's own explanation
 *   4  Sort by aspect         under each of the two columns: the three sentences the page counts as right there
 *   6  The staging example    the page's own example ("See staging example"), shown as it stands on the page, open or
 *                             shut on the screen
 * Part 1 (Lead-in) and part 5 (Discuss: these pairs) are questions for the room: the page holds no answer to either,
 * so none is printed.
 *
 * THE PAGE'S OWN ANSWER KEY ("Reveal answer key: save or print to keep") holds one thing and no more: the six terms
 * with their meanings (part 2). They are printed under their own task here, so the key is left out of this print, open
 * or shut: every answer is said once.
 *
 * WHERE THE ANSWERS COME FROM. Nothing is copied into this file. The page's own lists are read by name: TERMS (the one
 * its two columns are drawn from and matched against, and its key is drawn from), CHOOSE (each situation with its two
 * options, the right one and the explanation its buttons mark against) and SORTED (the six sentences in the order the
 * page shows them, each with the column it is marked against). An answer is written only if it fits the page: every
 * term and meaning on the task's own buttons exactly once, the right option on exactly one button of its own
 * situation, every sentence on exactly one button of its column. If a list is missing or does not fit, that task
 * gets no line: nothing is ever guessed.
 *
 * Nothing the trainee did is touched: nothing is pressed, matched, chosen, sorted, opened or shut. The page's own print
 * rules already put a matched, chosen or sorted task back on paper as the task it was (no "Correct", no explanation,
 * no color), so an answered page prints the same as an untouched one.
 */
SessionAnswers.register(function(A){
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var list = function(sel, root){ return [].slice.call((root || document).querySelectorAll(sel)); };
  var texts = function(sel, root){ return list(sel, root).map(function(e){ return norm(e.textContent); }); };
  var isList = function(x){ return !!x && typeof x.map === 'function' && x.length > 0; };
  /* every item of the list is on the page exactly once, and the page holds no more than the list */
  var fits = function(items, onPage){
    return items.length > 0 && items.length === onPage.length && items.every(function(s){ return onPage.filter(function(t){ return t === norm(s); }).length === 1; });
  };

  /* 2 · Match the terms. Each item of the page's list is [the term, its meaning]. */
  var terms = data(function(){ return TERMS; }), card = document.querySelector('#s2 .card');
  if (isList(terms) && card && terms.every(function(t){ return t && typeof t[0] === 'string' && typeof t[1] === 'string'; })
      && fits(terms.map(function(t){ return t[0]; }), texts('#mLeft [data-l]'))
      && fits(terms.map(function(t){ return t[1]; }), texts('#mRight [data-r]')))
    terms.forEach(function(t){ A.line(card, '<b>' + esc(t[0]) + ':</b> ' + esc(t[1])); });

  /* 3 · Choose the aspect. Each item of the page's list is [the situation, one option, the other option, the right
     one, the explanation]. The line goes under the situation whose own words are the item's, and only if the right
     option is on exactly one of its buttons. */
  var choose = data(function(){ return CHOOSE; });
  if (isList(choose)) A.each('#choose .box', function(box){
    var q = norm((box.querySelector('.ctx') || {}).textContent);
    var hit = choose.filter(function(c){ return c && norm(c[0]) === q; });
    if (hit.length !== 1 || typeof hit[0][3] !== 'string' || typeof hit[0][4] !== 'string') return;
    var opt = list('.opt', box).filter(function(b){ return b.textContent === hit[0][3]; });
    if (opt.length === 1) A.line(box, '<b>' + esc(opt[0].textContent) + '.</b> ' + esc(hit[0][4]));
  });

  /* 4 · Sort by aspect. Each item of the page's list is { s: the sentence, key: the column it is marked against }, in
     the order the page shows them. Each column lists all six; under each go the ones that belong in it. */
  var sorted = data(function(){ return SORTED; });
  if (isList(sorted) && sorted.every(function(it){ return it && typeof it.s === 'string' && typeof it.key === 'string'; }))
    A.each('#sort .col', function(col){
      var btns = list('.sbtn', col); if (!btns.length) return;
      var key = btns[0].getAttribute('data-k');
      if (!key || btns.some(function(b){ return b.getAttribute('data-k') !== key; })) return;
      /* the sentence of a button, without the "Correct" or "Not this one" an answered one carries (a copy is read) */
      var said = btns.map(function(b){ var c = b.cloneNode(true); list('.st', c).forEach(function(x){ x.remove(); }); return norm(c.textContent); });
      if (!fits(sorted.map(function(it){ return it.s; }), said)) return;
      var mine = sorted.filter(function(it){ return it.key === key; });
      if (mine.length) A.line(col, mine.map(function(it){ return '<b>' + esc(it.s) + '</b>'; }).join('<br>'));
    });

  /* 6 · the staging example, shown as it stands on the page, whether it is open or shut on the screen */
  A.show('#stg');

  /* the page's own key repeats part 2, which is answered under its task above */
  A.hide('#key');
});
