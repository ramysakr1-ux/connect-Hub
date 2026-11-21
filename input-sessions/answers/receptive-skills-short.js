/* Connect Lite — Receptive skills: taught the way you'll teach it (the short session), printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs receptive-skills-short <folder> shows what it prints).
 *
 * What "Print with the answers" writes on this session:
 *   2  What are receptive skills?   the answer inside the card ("Reading or listening")
 *   3  Pre-teach vocab              under the two columns: each of the six terms in bold, then its meaning
 *   6  Detail questions             "True." or "False." (and the page's note, where it has one) inside each of the
 *                                   twelve cards
 *   7  Debrief                      under the seven stages: the stages in their order
 * The answers of parts 2 and 6 are the page's own reveal cards: the stylesheet shows them in this print by itself
 * (.reveal-card .a), open or shut, so nothing is written for them here.
 * Parts 1 (lead-in) and 4 (predict the staging) are questions for the room, and part 5 is the text to read: the page
 * holds no answer of its own to them, so none is printed.
 *
 * THE PAGE'S OWN ANSWER KEY ("Reveal answer key: trainer only") is for a tutor's page alone, and repeats parts 3, 6
 * and 7. The stylesheet leaves every tutor-only box out of this print, so every answer is said once.
 *
 * WHERE THE ANSWERS COME FROM. Nothing is copied into this file. The page's own lists are read by name: TERMS (the
 * one its two columns are drawn from and matched against), and CORRECT_ORDER with ORDER_ITEMS (the keys its stages
 * are checked against, and the label of each key; two stages share the label "Peer check"). An answer is written only
 * if every item of its list is on the page exactly once, on the task's own buttons; if a list is missing or does not
 * fit the page, that task gets no line: nothing is ever guessed.
 *
 * Nothing the trainee did is touched: nothing is pressed, matched, placed, opened or shut. The page's own print rules
 * put a matched task, the placed stages and an opened card back on paper as they were untouched, without the counts,
 * so an answered page prints the same as an untouched one.
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

  /* 3 · Pre-teach vocab. Each item of the page's list is [the term, its meaning]. */
  var terms = data(function(){ return TERMS; }), match = document.getElementById('match');
  if (isList(terms) && match && terms.every(function(t){ return t && typeof t[0] === 'string' && typeof t[1] === 'string'; })
      && fits(terms.map(function(t){ return t[0]; }), texts('#match [data-l]'))
      && fits(terms.map(function(t){ return t[1]; }), texts('#match [data-r]')))
    terms.forEach(function(t){ A.line(match, '<b>' + esc(t[0]) + ':</b> ' + esc(t[1])); });

  /* 7 · Debrief: put the stages back in order. The page's list is the stages' keys, first to last; each key is on one
     of the task's own buttons (data-o), and that button's label is the key's label in ORDER_ITEMS (the number circle
     in front of the label is left out of the match). */
  var order = data(function(){ return CORRECT_ORDER; }), names = data(function(){ return ORDER_ITEMS; }), box = document.getElementById('order');
  var btns = box ? [].slice.call(box.querySelectorAll('[data-o]')) : [];
  if (isList(order) && names && box && btns.length === order.length && order.every(function(k){
        var b = btns.filter(function(x){ return x.getAttribute('data-o') === k; }), lab = b.length === 1 ? b[0].querySelector('span:not(.num)') : null;
        return typeof names[k] === 'string' && !!names[k] && !!lab && norm(lab.textContent) === norm(names[k]);
      }))
    A.line(box, '<ol style="margin:0;padding-left:22px;">' + order.map(function(k){ return '<li><b>' + esc(names[k]) + '</b></li>'; }).join('') + '</ol>');

  /* "Click to reveal" is a word for the screen; here the answer stands under the question */
  A.hide('.reveal-card .hint');
});
