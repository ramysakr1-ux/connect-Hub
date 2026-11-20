/* Connect Lite — Text-based teaching: every answer under its task, for "Print with the answers".
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs text-based-teaching <folder> shows what it prints).
 *
 * WHAT THE PRINT SHOWS, PART BY PART
 *   Stage 0  What makes a lesson text-based?   the sentence inside the card (.reveal-card .answer, shown) (1)
 *   Stage 3  Detail questions                  under each of the nine statements: True or False in bold, and the
 *                                              page's own note (9)
 *   Debrief  Order the stages                  the four stages in their order, under the stages to click (1)
 *   Your turn  Find it in the text             One way to do it (#finditKey, a .reveal-block, shown by itself) (1)
 * The lead-in and Stage 1 (predict) are the trainee's own ideas, and Stage 2 is the text to read: the page holds no
 * answer to any of them, so none is printed.
 *
 * WHERE EACH ANSWER COMES FROM. All of it from the page; nothing is copied into this file.
 *   Stage 3 and the debrief: the page's own lists, top-level in its script, read by name (tfItems,
 *   correctDebriefOrder). A statement is matched by its own words; the answer is its own button (True or False) whose
 *   value is the list's answer, and the note is the list's own, which opens with the same word. A statement that
 *   matches none, or more than one, gets no line. The order is written only if every stage of it is one of the
 *   stages on the page.
 *   Stage 0 and Find it in the text: the page's own answer boxes, shown for the print.
 * Nothing the trainee did is touched: no button is pressed, no stage placed or taken back, no box opened or shut. What
 * an answered page shows (the colors on True and False, the note under a statement, the order built so far and its
 * message) is already left out of every print by the page and by library.js, so an answered page prints the same as
 * an untouched one, and each answer is said once.
 */
SessionAnswers.register(function(A){
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var words = function(el){ return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; };

  /* The page's own lists, read first. If the page is ever rebuilt without them, this stops here, before anything is
     written, and tools/answers-check.mjs reports the error. */
  var items = tfItems, order = correctDebriefOrder;

  /* Stage 0: the sentence inside the card, open or shut on the screen. "Tap to reveal" has nothing left to say. */
  A.show('#whatis .reveal-card .answer');
  A.hide('#whatis .reveal-card .tap');

  /* Stage 3 · Detail questions: under each statement, its right button's own label in bold, then the page's note.
     The note is put on the page as markup by the page itself (item.fb), so it is written the same way here. Every
     note opens with the answer ("True — ..."): that word is the one set in bold, so it is not said twice. */
  A.each('#tfList .tf-item', function(row){
    var said = words(row.querySelector('.tf-statement'));
    var hit = items.filter(function(x){ return A.txt(x.s) === said; });
    if (hit.length !== 1) return;
    var btn = [].filter.call(row.querySelectorAll('.tf-buttons button'), function(b){ return (b.dataset.val === 'true') === hit[0].t; });
    if (btn.length !== 1) return;
    var label = words(btn[0]), note = String(hit[0].fb == null ? '' : hit[0].fb);
    if (note.indexOf(label + ' ') === 0) A.line(row, '<b>' + esc(label) + '</b>' + note.slice(label.length));
    else A.line(row, '<b>' + esc(label) + '.</b> ' + note);
  });

  /* Debrief · Order the stages: the four, first to last, under the stages to click. */
  var pool = document.getElementById('debriefPool');
  if (pool && order && order.length) {
    var chips = [].map.call(pool.querySelectorAll('.debrief-chip'), words);
    var all = order.every(function(n){ return chips.filter(function(c){ return c === n; }).length === 1; });
    if (all && chips.length === order.length) A.after(pool, '<ol style="margin:0;padding-left:22px;font-weight:700;">' + order.map(function(n){ return '<li>' + esc(n) + '</li>'; }).join('') + '</ol>');
  }

  /* Your turn · Find it in the text: #finditKey is a .reveal-block, which this print shows by itself. */
});
