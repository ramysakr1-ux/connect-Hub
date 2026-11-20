/* Connect Lite — Functional language: every answer under its task, for "Print with the answers".
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs functional-language <folder> shows what it prints).
 *
 * WHAT THE PRINT SHOWS, PART BY PART
 *   2   Answer key: exponent 1     the page's own key to part 1 (#key1: form, function, phonology, CCQs, context) (1)
 *   7   Matching: answer key       the page's own key to part 6, the twelve phrases each beside its function (#keyM) (1)
 *   8   Requests                   Points to cover (#keyReq) (1)
 *   9   The other side             under the sentence with the gap, the word the page counts as right, in bold (1 line);
 *                                  then the page's own examples of accepting and declining (#keyR) (1)
 *   10  Answer key: exponent 2     the page's own key to part 3 (#key2) (1)
 *   11  Answer key: exponent 3     the page's own key to part 4 (#key3) (1)
 *   12  Board it, then teach it    A worked example, and what to look for in the other pair's teaching (#boardKey) (1)
 * The keys to parts 1, 3, 4 and 6 are parts of their own on this page (2, 10, 11 and 7), each under its own heading, so
 * they print where the page has them and are said once. Part 5 (think of exponents you already know) is the trainee's
 * own ideas: the page holds no answer to it, so none is printed.
 *
 * WHERE EACH ANSWER COMES FROM
 *   The seven keys are the page's own boxes (.reveal-block). The stylesheet shows those for this print without being
 *   asked, open or shut on the screen, so nothing is done for them here.
 *   The gap in part 9: the page keeps its answer inside checkGap(), which says "Yes: respond." and also counts "reply"
 *   and "answer" as right. Those three words are COPIED below from that function, in its order. IF THE WORDS IT
 *   ACCEPTS CHANGE ON THE PAGE, CHANGE THEM HERE TOO, and run the check again. The line is written only while
 *   checkGap() still holds exactly that list and still says "Yes: respond."; otherwise nothing is written: nothing is
 *   ever guessed.
 * Nothing the trainee did is touched: no key is opened or shut, no phrase matched, the count stays, and what was typed
 * stays as typed. The page's own print rules (21 Nov 2026) print matched phrases and the gap as untouched, and the
 * stylesheet leaves the feedback lines off the paper, so an answered page prints the same as an untouched one.
 */
SessionAnswers.register(function(A){
  /* COPIED from checkGap() in functional-language/index.html: the words it counts as right, the first being the one
     its own feedback gives ("Yes: respond."). */
  var GAP = ['respond', 'reply', 'answer'];

  /* 9 · The other side of the conversation: the gap. */
  var gap = document.getElementById('gap1');
  var src = ''; try { src = String(checkGap); } catch (e) { src = ''; }
  var same = src.indexOf("['" + GAP.join("','") + "'].includes(v)") !== -1 && src.indexOf("'Yes: " + GAP[0] + ".'") !== -1;
  if (gap && same) {
    var box = gap.closest ? gap.closest('.text-block') : gap.parentNode;
    A.after(box, '<b>' + GAP[0] + '</b> (the page also counts as right: ' + GAP.slice(1).join(', ') + ')');
  }
});
