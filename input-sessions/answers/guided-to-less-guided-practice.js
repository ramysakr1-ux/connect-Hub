/* Connect Lite — Guided to less-guided practice: every answer under its task, for "Print with the answers".
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs guided-to-less-guided-practice <folder> shows what it prints).
 *
 * WHAT THE PRINT SHOWS, PART BY PART
 *   Cued dialogue          One way it could go (#phoneModel, the page's own box, shown) (1)
 *   1  Why drill?          the three points behind Reveal (#whyDrillReveal, shown) (1)
 *   2  Drilling techniques under each technique, the example it matches, in bold (9)
 *                          (the mixed column of examples on the right is put aside for this print: each is under its technique)
 *   Now you try            under each technique, the page's own "Answer:" (.tryit-answer, shown) (9)
 *   3  Types of drill      under each drill type, its definition in bold, in the words of its own dropdown, then the
 *                          page's example of it (13)
 *   4  Meaningful drills   what each of the four cards says when it is opened (.flash .detail, shown) (4), and
 *                          One way each (#drillKey, shown) (1)
 *   8  Build the bridge    One way to build it, and Check the bridge (#bridgeKey, shown) (1)
 * The video question, the exit ticket, part 5 (the chant), part 6 (write two cues of your own) and part 7 (the
 * information gap) are the trainee's own ideas or a task done as learners: the page holds no answer for them, so none
 * is printed.
 *
 * WHERE EACH ANSWER COMES FROM. All of it from the page; nothing is copied into this file.
 *   Parts 2 and 3: the page's own lists, top-level in its script, read by name (drillTechniques, drillTypes), the same
 *   ones its pills and dropdowns are marked against. A pill or a row is matched by its own words; one that matches
 *   none, or more than one, gets no line. In part 3 the definition is the row's own option whose value is the list's
 *   answer. The page builds its own box of examples (#drillExamplesArea, "An example of each") only once Check answers
 *   has been pressed; so each example is written under its drill type here, and that box is put aside for this print:
 *   a checked page and an untouched one print the same, and each example is said once.
 *   The rest: the page's own boxes, shown for the print whether open or shut on the screen.
 * Nothing the trainee did is touched: no pill is matched, no dropdown changed, no box opened or shut, no counter moves,
 * and what was typed stays.
 */
SessionAnswers.register(function(A){
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var words = function(el){ return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; };

  /* The page's own lists, read first. If the page is ever rebuilt without them, this stops here, before anything is
     written, and tools/answers-check.mjs reports the error. */
  var techniques = drillTechniques, types = drillTypes;

  /* 2 · Drilling techniques: under each technique on the left, the example it matches. */
  A.each('#pillsLeft .pill', function(pill){
    var said = words(pill);
    var hit = techniques.filter(function(x){ return A.txt(esc(x.term)) === said; });
    if (hit.length !== 1) return;
    A.after(pill, '<b>' + esc(hit[0].example) + '</b>');
  });
  A.hide('#pillsRight');   /* the nine examples are each written under their technique; the mixed column would say them twice */

  /* Now you try: the page's own answer under each technique. */
  A.show('#tryItArea .tryit-answer');

  /* 3 · Types of drill: under each row, its definition (the row's own option), then the page's example of it. */
  A.each('#drillMatchArea > .fill-row', function(row){
    var said = words(row.querySelector('span'));
    var hit = types.filter(function(x){ return A.txt(esc(x.term)) === said; });
    if (hit.length !== 1) return;
    var opt = [].filter.call(row.querySelectorAll('select option'), function(o){ return o.value === hit[0].def; });
    if (opt.length !== 1) return;
    A.after(row, '<b>' + esc(opt[0].textContent) + '</b><div>' + esc(hit[0].example) + '</div>');   /* after the row: the row is a flex line */
  });
  A.hide('#drillExamplesArea');   /* the same thirteen examples, there only once Check answers is pressed */

  /* 4 · More meaningful drills: what each card says when opened. */
  A.show('#s4 .flash .detail');

  /* The cued dialogue, 1, 4 and 8: #phoneModel, #whyDrillReveal, #drillKey and #bridgeKey are answer blocks the
     stylesheet already shows for this print. */
});
