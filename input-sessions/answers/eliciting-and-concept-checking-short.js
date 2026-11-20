/* Connect Lite — Eliciting and concept checking (the short session), printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs eliciting-and-concept-checking-short <folder> shows what it prints).
 *
 * What "Print with the answers" writes on this session:
 *   2  Eliciting techniques   the real example inside each of the five cards
 *   6  Beyond CCQs            when to use each of the eight techniques, inside its card
 *   7  Near misses            why each of the two is a near miss, inside its card
 *                             These are the page's own reveal cards: the stylesheet shows them in this print by itself
 *                             (.reveal-card .a), open or shut, so nothing is written for them here.
 *   3  Elicit or tell?        under each of the four moments: the option the page counts as right, in bold, and the
 *                             page's own explanation (4)
 *   4  Spot the bad CCQ       under each of the five questions: Bad CCQ or Good CCQ, in bold, as the page's own answer
 *                             key says it, and the page's explanation (5)
 *   5  Write your own CCQs    the model CCQs of each of the four targets, shown where they stand on the page (4)
 *   8  The staging example behind "See staging example", shown as it stands (1)
 * Part 1 (the lead-in) is a show of hands, and "what would fix it?" in part 7 is a discussion: the page holds no
 * answer to either, so none is printed.
 *
 * THE PAGE'S OWN ANSWER KEY ("Reveal answer key: save or print to keep") holds two things and no more: good or bad for
 * each of the five questions of part 4, and the four model CCQs of part 5. Both are printed under their own tasks
 * here, so the key is put aside for this print, open or shut: every answer is said once.
 *
 * WHERE THE ANSWERS COME FROM
 *   Part 3: the page's own list EOT (top-level in its script, read by name): [the moment, "elicit" or "tell", the
 *   explanation]. The answer's words are the label of the moment's own button for that option.
 *   Part 4: the page's own list CCQ (read by name): [the question, bad or not, why it is bad], and the page's own key
 *   (#keyCcq), whose row for the question gives the words "Bad CCQ" or "Good CCQ".
 *   Parts 5 and 8: the page's own blocks, shown.
 *   ONE THING IS COPIED BY HAND, because it lives inside drawCcq() and nowhere else: the sentence the page shows when
 *   a good CCQ is clicked (GOOD below), kept under the words of each of the two questions it belongs to. IF THAT
 *   SENTENCE OR THOSE QUESTIONS CHANGE ON THE PAGE, CHANGE THEM HERE TOO, and run the check again. A good question
 *   whose words are not in the table gets "Good CCQ" and no sentence.
 *   A moment or question that matches nothing, or more than one thing, gets no line: nothing is ever guessed.
 *
 * Nothing the trainee did is touched: no option or question is pressed, no card or model opened or shut, nothing
 * typed over. What an answered task shows on the screen (Correct or Not this one, Bad CCQ or Actually fine, the
 * explanation box) is left off paper by the page's own print rule, so an answered page prints the same as an untouched
 * one.
 */
SessionAnswers.register(function(A){
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var list = function(sel, root){ return [].slice.call((root || document).querySelectorAll(sel)); };
  var isList = function(x){ return !!x && typeof x.filter === 'function'; };
  var own = function(o, k){ return Object.prototype.hasOwnProperty.call(o, k); };

  /* COPIED from drawCcq() in eliciting-and-concept-checking-short/index.html: what the page says of a good CCQ. */
  var GOOD_SAID = 'This one is a genuinely good CCQ: simple, doesn\'t contain the target language, and checks meaning directly.';
  var GOOD = {
    'Did I move here six years ago?': GOOD_SAID,
    'Do I still live here now?': GOOD_SAID
  };

  /* 3 · Elicit or tell? The moment is the first line of its box; the option's words are its own button's (on an
     answered moment the two buttons are kept for the paper, marked data-o). */
  var moments = data(function(){ return EOT; });
  if (isList(moments)) A.each('#eot .box', function(box){
    var q = box.querySelector('p.fb'); if (!q) return;
    var hit = moments.filter(function(m){ return m && norm(m[0]) === norm(q.textContent); });
    if (hit.length !== 1 || typeof hit[0][1] !== 'string' || typeof hit[0][2] !== 'string') return;
    var btn = list('.opt', box).filter(function(b){ return (b.dataset.p || b.dataset.o) === hit[0][1]; });
    if (btn.length !== 1) return;
    A.line(box, '<b>' + esc(btn[0].textContent) + '.</b> ' + esc(hit[0][2]));
  });

  /* 4 · Spot the bad CCQ. Under each question: the words of its row in the page's key, and the page's explanation. */
  var qs = data(function(){ return CCQ; });
  var rows = list('#keyCcq .krow');
  if (isList(qs)) A.each('#ccq .ccqb', function(b){
    var s = b.querySelector('span'); if (!s) return;
    var q = norm(s.textContent);
    var hit = qs.filter(function(c){ return c && norm(c[0]) === q; });
    var row = rows.filter(function(r){ var p = r.querySelector('p'); return p && norm(p.textContent) === q; });
    if (hit.length !== 1 || row.length !== 1 || typeof hit[0][1] !== 'boolean') return;
    var said = norm((row[0].querySelectorAll('p')[1] || {}).textContent);
    var label = hit[0][1] ? 'Bad CCQ' : 'Good CCQ';
    if (said.indexOf(label) !== 0) return;                       /* the key and the list must say the same */
    var why = hit[0][1] ? hit[0][2] : (own(GOOD, q) ? GOOD[q] : '');
    A.after(b, '<b>' + esc(label) + '.</b>' + (why ? ' ' + esc(why) : ''));
  });

  /* 5 · Write your own CCQs: the model under each target, and 8 · the staging example, open or shut on the screen */
  A.show('#write .model, #stg');

  /* the page's own key repeats parts 4 and 5, which are answered under their tasks above */
  A.hide('#key');
});
