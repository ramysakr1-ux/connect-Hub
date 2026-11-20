/* Connect Lite — Life after CELTA: every answer under its task, for "Print with the answers".
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 20 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs life-after-celta <folder> shows what it prints).
 *
 * WHAT THE PRINT SHOWS, PART BY PART
 *   2  Your CV          Fix this CV: the answer behind Reveal answer (#cvKey), where it stands
 *   3  One CV line      the weak line, the stronger one and what made it stronger (#cvlineKey), where it stands
 *   5  The interview    Questions they'll ask you: How to handle the awkward ones (#answers), the four notes, where
 *                       they stand under the list
 * Parts 2 and 3 keep their answers in .reveal-block, which the stylesheet already shows in this print, so nothing is
 * done for them here. Part 5's notes are the page's own block, shown.
 *
 * NO ANSWER ON THE PAGE, SO NONE IS PRINTED: 1 So, where next? (pair talk); 3 the trainee's own CELTA line (the key is
 * a model, printed); 5 Questions to ask them (the trainee ticks the ones that matter; no right ones); 9 Your first-year
 * plan (the trainee's own). Parts 4, 6, 7 and 8 are to read. What happened to the old list (part 8) is information,
 * not an answer, and prints in both prints as before.
 *
 * Nothing is copied into this file. Nothing the trainee did is touched: the ticks, the typed boxes and the plan stay as
 * they are, and nothing is opened or shut on the screen.
 */
SessionAnswers.register(function(A){
  /* 5 · The interview. The notes behind How to handle the awkward ones, open or shut on the screen. */
  A.show('#answers');
});
