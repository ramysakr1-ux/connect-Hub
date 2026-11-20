/* Connect Lite — Lesson framework: finding your shape (the short session), printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs lesson-framework-short <folder> shows what it prints).
 *
 * What "Print with the answers" writes on this session:
 *   4  Card sort              in each shape's box, the stage that belongs there, in bold (6)
 *   5  Build the sequence     under each of the four shapes, its stages in the correct order, numbered (4)
 *   6  Name that framework    under each of the four lessons, the framework the page counts as right, in bold (4)
 *   7  Stage timer            the answer behind "Reveal the answer" (which stage to trim, and why), shown as it stands
 * 1 (Lead-in) is a question for the room, 2 (the decision tree) and 3 (the six shapes) are to read, and the minutes
 * in 7 are the trainee's own budget: the page holds no answer to any of them, so none is printed.
 *
 * WHERE THE ANSWERS COME FROM. All of it from the page itself; nothing is copied into this file.
 *   Parts 4, 5 and 6: the page's own lists, top-level in its script, read by name (STAGES, SEQ, SCENARIOS), the same
 *   ones its buttons are marked against. A box, a shape or a lesson is matched by its own words; one that matches
 *   none, or more than one, gets no line, and in part 6 a right answer that is not on exactly one of the lesson's own
 *   buttons gets none either: nothing is ever guessed. The page gives no explanation in these three parts.
 *   Part 7: the page's own block (#trim), shown.
 *
 * Nothing the trainee did is touched: no card is pinned, no stage placed, no option pressed, no counter moves, the
 * minutes typed stay, nothing is opened or shut. What an answered task shows on the screen (stages in boxes, the built
 * order, "Correct", the counts, the minutes) the page's own print rules leave out, so an answered page prints the same
 * as an untouched one and each answer is said once. On paper part 5 is the page's own print block (#seqPaper: all four
 * shapes, each with its stages scrambled), and the orders are written under those. The six cards of part 4 are each
 * written in their box, so the row of cards is put aside for this print: it would say them twice.
 */
SessionAnswers.register(function(A){
  /* the page's lists are top-level in its own script, so they are read by name; if one is missing, nothing is written */
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var list = function(sel, root){ return [].slice.call((root || document).querySelectorAll(sel)); };

  /* 4 · Card sort. Each item of the page's list is [the stage, the shape it belongs to]. */
  var stages = data(function(){ return STAGES; });
  if (Array.isArray(stages)) {
    A.each('#zones .zone', function(z){
      var name = z.getAttribute('data-zone'); if (!name) return;
      stages.filter(function(s){ return s && s[1] === name && typeof s[0] === 'string'; }).forEach(function(s){ A.line(z, '<b>' + esc(s[0]) + '</b>'); });
    });
    A.hide('#sortCards');
  }

  /* 5 · Build the sequence. The page's list gives each shape's stages in the correct order. */
  var seq = data(function(){ return SEQ; });
  if (seq && typeof seq === 'object') A.each('#seqPaper .seqp-row', function(row){
    var fw = row.getAttribute('data-fw');
    if (!fw || !Object.prototype.hasOwnProperty.call(seq, fw) || !Array.isArray(seq[fw])) return;
    A.line(row, seq[fw].map(function(s, i){ return '<div>' + (i + 1) + '. ' + esc(s) + '</div>'; }).join(''));
  });

  /* 6 · Name that framework. Each item of the page's list is [the lesson, its four options, the right one]. */
  var scen = data(function(){ return SCENARIOS; });
  if (Array.isArray(scen)) A.each('#scens .scen', function(box){
    var p = box.querySelector('p'); if (!p) return;
    var said = norm(p.textContent);
    var it = scen.filter(function(x){ return x && norm(x[0]) === said; });
    if (it.length !== 1 || typeof it[0][2] !== 'string') return;
    var hit = list('.opt', box).filter(function(b){ return b.textContent === it[0][2]; });
    if (hit.length === 1) A.line(box, '<b>' + esc(hit[0].textContent) + '</b>');
  });

  /* 7 · Stage timer: the page's own answer, shown whether it is open or shut on the screen */
  A.show('#trim');
});
