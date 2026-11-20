/* Connect Lite — Alternative teaching techniques: every answer under its task, for "Print with the answers".
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session step by step in a browser (answers.js says how this file is
 * used; tools/answers-check.mjs alternative-teaching-techniques <folder> shows what it prints).
 *
 * WHAT THE PRINT SHOWS, STEP BY STEP
 *   2  The question              what goes on the board (#marker, shown as it stands) (1)
 *   3  Check the meaning         under each of the six questions, its answer in bold, in the words of its own option
 *                                (6); then the concept and the timeline (#concept and its box, shown) (2)
 *   4  Clarify the form          under the frame, the same frame with each gap's own word in bold (1). "What else to
 *                                highlight" is content, not an answer: the page prints it on every print already.
 *   6  Match the two halves      under each of the eight beginnings, its ending in bold (8)
 *   7  Finish the sentences      Possible answers (#samples and its box, shown) (2)
 *   9  The twist                 on each of the five cards, what the character stands for (.val, shown) (5); then
 *                                How to read it (#rule and its box, shown) (2)
 *   10 Your own story            One story, for used to (#ownstoryKey): a .reveal-block, which the stylesheet already
 *                                shows in this print, so nothing is done for it here.
 * Step 1 (the story) is told and listened to, step 5 is a drill, and step 8 is the group's own ranking, argued aloud:
 * the page holds no answer to any of them, so none is printed. Step 2's "who is most responsible" is an opinion.
 *
 * WHERE EACH ANSWER COMES FROM. All of it from the page's own markup; nothing is copied into this file.
 *   Step 3: each question's own data-a, written only if exactly one of the question's options carries those words.
 *   Step 4: each gap's own data-ans. A copy of the frame is filled in; the frame itself is not touched.
 *   Step 6: the page marks a match right when a beginning and an ending carry the same data-i (its Check compares
 *   exactly that), so the ending printed under a beginning is the one ending in the right-hand column with the
 *   beginning's own data-i. If there is not exactly one, that beginning gets no line.
 *   Steps 2, 3, 7, 9 and 10: the page's own boxes, shown whether they are open or shut on the screen.
 * Nothing the trainee did is touched: no option, gap, half or card is pressed, nothing is opened or shut, no score
 * moves, and what was typed stays as typed. The page's own print rules (21 Nov 2026) leave out what an answered task
 * shows on the screen (the picked person, faded options, filled gaps, numbered endings, the scores, turned cards), so
 * an answered page prints the same as an untouched one, and every answer is said once.
 */
SessionAnswers.register(function(A){
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var words = function(el){ return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; };
  var list = function(sel, root){ return [].slice.call((root || document).querySelectorAll(sel)); };

  /* 2 · The question: the sentence for the board. */
  A.show('#marker');

  /* 3 · Check the meaning: under each question, the option its own data-a names. */
  A.each('#ccqs .ccq', function(row){
    var a = row.getAttribute('data-a'); if (!a) return;
    var hit = list('.opt', row).filter(function(o){ return words(o) === a; });
    if (hit.length === 1) A.line(row, '<b>' + esc(words(hit[0])) + '</b>');
  });
  A.show('#concept, #concept .key');

  /* 4 · Clarify the form: the frame again, each gap holding its own data-ans. Only if every gap has one. */
  var frame = document.querySelector('#form .frame');
  if (frame) {
    var copy = frame.cloneNode(true), gaps = list('.gap', copy);
    if (gaps.length && gaps.every(function(g){ return !!g.getAttribute('data-ans'); })) {
      gaps.forEach(function(g){ var b = document.createElement('b'); b.textContent = g.getAttribute('data-ans'); g.parentNode.replaceChild(b, g); });
      A.after(frame, copy.innerHTML.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim());
    }
  }

  /* 6 · Match the two halves: under each beginning, the ending that carries the same data-i. */
  A.each('#mLeft .mi', function(left){
    var i = left.getAttribute('data-i'); if (i == null || i === '') return;
    var hit = list('#mRight .mi', document).filter(function(r){ return r.getAttribute('data-i') === i; });
    if (hit.length !== 1) return;
    var said = hit[0].querySelector('span:not(.tag)'); if (!said || !words(said)) return;
    A.line(left, '<b>' + esc(words(said)) + '</b>');
  });

  /* 7 · Finish the sentences your own way: the page's possible answers. */
  A.show('#samples, #samples .key');

  /* 9 · The twist: what each character stands for, and how to read the ranking. */
  A.show('#flips .flip .val, #rule, #rule .key');

  /* 10 · Your own story: #ownstoryKey is a .reveal-block, shown by the stylesheet in this print, open or shut. */
});
