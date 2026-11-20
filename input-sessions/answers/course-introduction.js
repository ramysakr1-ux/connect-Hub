/* Connect Lite — Course introduction: every answer under its task, for "Print with the answers".
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 20 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs course-introduction <folder> shows what it prints).
 *
 * WHAT THE PRINT SHOWS, PART BY PART
 *   2  Your course, in Lite   under each of the six questions, the page's own answer behind "Reveal answer", read from
 *                             this trainee's course (or the page's general answer when no course is open) (6)
 *   3  The rules              under each of the twelve questions, the option the page counts as right, in bold, then
 *                             the page's own explanation and its source (12)
 *   4  Your CELTA 5           the same for each of the eight parts: You, Your tutor or Both of you, in bold, then the
 *                             page's explanation and its source (8)
 * Parts 1 (bingo), 5 (the hunt: six things to find and open) and 6 (your question) have no answer on the page, so none
 * is printed.
 *
 * WHERE EACH ANSWER COMES FROM. All of it from the page's markup; nothing is copied into this file. The page's lists
 * (R1, R2, R3) live inside its own closure and cannot be read by name, but the page writes everything into the markup:
 *   Part 2: each question's own answer block (#round1 .q .ans), shown.
 *   Parts 3 and 4: each question's data-r names its right option; the label is the words of that option's own button
 *   (.opt[data-j]), and the explanation is the question's own .why, which the shared stylesheet shows for this print. A
 *   question without exactly one such button gets no line. The "Find it on your CELTA 5" link inside each .why is put
 *   aside for the print.
 * Nothing the trainee did is touched: no answer is opened or shut, no option pressed, the bingo, ticks and typed words
 * stay. What an answered question shows on the screen (the right option bold, the others faded) the page's own print
 * rules leave out, so an answered task prints the same as an untouched one.
 */
SessionAnswers.register(function(A){
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

  /* 2 · Your course, in Lite: the page's own answers */
  A.show('#round1 .q .ans');

  /* 3 · The rules and 4 · Your CELTA 5: the right option in bold, above the page's own explanation */
  A.each('#round2 .q, #round3 .q', function(q){
    var r = q.getAttribute('data-r'), opts = q.querySelector('.opts'); if (r == null || !opts) return;
    var b = q.querySelectorAll('.opt[data-j="' + r + '"]'); if (b.length !== 1) return;
    A.after(opts, '<b>' + esc(A.txt(b[0].innerHTML)) + '</b>');
  });
  A.hide('#round3 .find');
});
