/* Connect Lite — Lesson planning, start to finish, in one input session (the short session), printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs lesson-planning-short <folder> shows what it prints).
 *
 * What "Print with the answers" writes on this session:
 *   2  Jargon match             under each batch of the two sets (four batches of abbreviations, three of terms):
 *                               each term of that batch in bold, then its meaning. 20 abbreviations and 13 terms.
 *   2  The staging example      the page's own example ("See staging example"), shown as it stands, open or shut
 *   1  Why plan?                the answers inside the two cards
 *   7  What comes after         the answer and its note inside the two cards
 *                               These four are the page's own reveal cards: the stylesheet shows them in this print
 *                               by itself (.reveal-card .a), open or shut, so nothing is written for them here.
 * The lead-in of part 1 (the show of hands) is a question for the room. Part 3 is to read. Parts 4, 5 and 6 (aims,
 * problems and solutions, procedure) are the trainee's own draft: the page holds no answer to them, so none is
 * printed. What the trainee typed there prints as typed, as it does on the plain handout.
 *
 * THE PAGE'S OWN ANSWER KEY ("Reveal answer key: save or print to keep") holds the same 20 abbreviations and 13 terms
 * and no more. They are printed under their own batches here, so the key is left out of this print, open or shut:
 * every answer is said once.
 *
 * WHERE THE ANSWERS COME FROM. Nothing is copied into this file. The page's own lists are read by name: ABBR and
 * TERMS (the ones its two columns are drawn from and matched against, and its key is drawn from). The task stands on
 * the paper as #matchPaper (the page draws it for the print: every batch of both sets). A batch gets its line only if
 * every term in it is the term of exactly one pair of the two lists whose meaning stands in that same batch; if a
 * list is missing or does not fit the page, that batch gets no line: nothing is ever guessed.
 *
 * Nothing the trainee did is touched: nothing is pressed, matched, opened or shut, and no count moves. The page's own
 * print rules already put the match on paper as it was untouched, without the count, so an answered page prints the
 * same as an untouched one.
 */
SessionAnswers.register(function(A){
  /* the page's lists are top-level in its own script, so they are read by name; if one is missing, nothing is written */
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var list = function(sel, root){ return [].slice.call((root || document).querySelectorAll(sel)); };
  var isPairs = function(x){ return !!x && typeof x.filter === 'function' && x.length > 0 && x.every(function(p){ return p && typeof p[0] === 'string' && typeof p[1] === 'string'; }); };

  /* 2 · Jargon match. Each item of the page's two lists is [the term, its meaning]. */
  var abbr = data(function(){ return ABBR; }), terms = data(function(){ return TERMS; });
  if (isPairs(abbr) && isPairs(terms)) {
    var pairs = abbr.concat(terms);
    A.each('#matchPaper .pill-match-wrap', function(wrap){
      var left = list('.pill.term', wrap).map(function(e){ return norm(e.textContent); });
      var right = list('.pill:not(.term)', wrap).map(function(e){ return norm(e.textContent); });
      if (!left.length || left.length !== right.length) return;
      var out = [], used = [];
      for (var i = 0; i < left.length; i++) {
        var hit = pairs.filter(function(p){ return norm(p[0]) === left[i] && right.indexOf(norm(p[1])) > -1; });
        if (hit.length !== 1 || used.indexOf(hit[0][1]) > -1) return;      /* not one pair, or a meaning claimed twice: no line for this batch */
        used.push(hit[0][1]);
        out.push('<b>' + esc(hit[0][0]) + ':</b> ' + esc(hit[0][1]));
      }
      A.after(wrap, out.join('<br>'));
    });
  }

  /* 2 · The staging example: the page's own block, shown whether it is open or shut on the screen */
  A.show('#ex');

  /* the page's own key repeats the match, which is answered under its batches above */
  A.hide('#key');
});
