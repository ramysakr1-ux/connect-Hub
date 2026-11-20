/* Connect Lite — Error correction: every answer under its task, for "Print with the answers".
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 20 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs error-correction <folder> shows what it prints).
 *
 * WHAT THE PRINT SHOWS, PART BY PART
 *   2  The decision flow       Part A and Part B: the page's own two answer keys (.answer-key), which the stylesheet
 *                              shows in this print without being asked (5 steps and 8 steps)
 *   3  Match the errors        under each of the eight errors: the type of mistake the page counts as right, in bold (8)
 *   4  How to correct          under each of the twelve ideas: the page's own explanation, the one behind the card (12)
 *   7  Correct me, live        the block behind "Reveal answer" (.reveal-block), shown by the stylesheet
 * The lead-in, 1 (Attitudes: "There are no right answers"), 5 and 6 (the practice tables) and the notes in 7 hold no
 * answer on the page, so none is printed.
 *
 * WHERE EACH ANSWER COMES FROM. All of it from the page; nothing is copied into this file.
 *   3: the page's own list, errorItems (top-level in its script, the one Check answers marks against), read by name.
 *      Row i is the page's select err<i>; a row gets its line only if its words are the item's error and the answer
 *      is one of its own options. If the list is missing, nothing is written for it.
 *   4: the explanation is the hidden part of each card, written out as the page wrote it.
 * Nothing the trainee did is touched: no option is chosen, no card opened, no score moves. The dropdowns of part 3 are
 * put aside for this print, chosen or not, so an answered row prints the same as an untouched one and its answer is
 * said once; the order clicked in part 2 does not print (the page's own print rule).
 */
SessionAnswers.register(function(A){
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };

  /* 3 · Match the errors with their descriptions */
  var items = null; try { items = errorItems; } catch (e) {}
  if (Array.isArray(items)) {
    items.forEach(function(it, i){
      var sel = document.getElementById('err' + i), row = sel && sel.closest('.fill-row');
      if (!row || !it || !it.error || !it.answer) return;
      var words = row.querySelector('span');
      if (!words || norm(words.textContent).indexOf(norm('"' + it.error + '"')) !== 0) return;
      var opt = [].filter.call(sel.options, function(o){ return o.value === it.answer; });
      if (opt.length !== 1) return;
      A.after(row, '<b>' + esc(opt[0].textContent) + '</b>');   /* after the row: inside it, the line would stand beside the error */
    });
    A.hide('#errorMatchArea select');
  }

  /* 4 · How to correct: the explanation behind each card */
  A.each('#ideasArea .flash', function(card){
    var d = card.querySelector(':scope > div:not(.ans-line)');
    if (d && norm(d.textContent)) A.line(card, d.innerHTML);
  });
});
