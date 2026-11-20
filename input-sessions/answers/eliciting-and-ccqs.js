/* Connect Lite — Eliciting and CCQs: every answer under its task, for "Print with the answers".
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 20 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs eliciting-and-ccqs <folder> shows what it prints). answers.js calls this when
 * the button is pressed, prints, and takes everything away again. Nothing a trainee has clicked, opened or typed is
 * touched: no card is turned, no answer opened, the game stays on the moment and the score it was on.
 *
 * WHAT THE PRINT SHOWS, PART BY PART
 *   1  Spot the elicitor       the back of each card: Telling or Eliciting, and the page's reason (2)
 *   2  Why do we elicit?       the five reasons and the reminder under them, as the page lists them (1 list)
 *   3  Name the technique      the page does not print its game, so each of the eleven moments is written out, and
 *                              under it the technique that is right for it and the word it elicits (11); then the
 *                              eleven cards behind See all eleven, each with its back (11)
 *   4  In the classroom        the line that opens, Afterward, in pairs: its words, written out under it (1). "Write
 *                              as you watch" has no answer on the page, so none is printed.
 *   5  Building CCQs           Task A and Task B: the answer card of each (6)
 *   6  CCQ worksheet           items 2 to 7: the answer card of each (6); item 1 is the worked example, shown already
 *   7  Other ways to check     the back of each of the eight cards (8)
 *   8  Your turn               the answer card of each word (12)
 *   9  The blind test          How to read the result (1)
 * Parts 5, 6, 8 and 9 keep their answers in blocks the stylesheet already shows in this print (.reveal-card .a and
 * .reveal-block), so nothing is done for them here.
 *
 * WHERE EACH ANSWER COMES FROM. All of it from the page: the backs of the cards, the list of reasons and the line that
 * opens are the page's own markup, shown or written out as they stand; the game is read from the page's own list,
 * techniques, the one its buttons are marked against (its moment, its name, its word). One thing is copied by hand,
 * because it lives inside choose() and nowhere else: the sentence the game says after a right answer,
 * This elicits "…". IF THAT SENTENCE CHANGES ON THE PAGE, CHANGE IT HERE TOO, and run the check again.
 */
SessionAnswers.register(function(A){
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var words = function(el){ return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; };

  /* The page's own list of techniques, read first (a top-level const in its script, so it is read by name). If the
     page is ever rebuilt without it, this stops here, before anything is written, and tools/answers-check.mjs reports
     the error: a print with half the answers would be worse than none. */
  var list = techniques;

  /* 1 · Spot the elicitor, and 7 · Other ways to check meaning. The back of a card is its answer, and the stylesheet
     hides every back on paper, open or shut. */
  A.show('#leadInGrid .flip-back, #checkGrid .flip-back');

  /* 2 · Why do we elicit? The reasons, as the page lists them. */
  A.show('#whyList');

  /* 3 · Name the technique. The game is left off the paper by the page itself, so each moment is written out under
     where the game stands, in the order of the page's list, with the technique that is right for it. The technique is
     named by its own button, and a moment whose technique is not on a button is left out. */
  var box = document.getElementById('gameBox');
  if (box) {
    var labels = [].map.call(box.querySelectorAll('#gameOpts .tech-btn'), function(b){ return b.textContent; });
    var at = box;
    list.forEach(function(t){
      var label = labels[labels.indexOf(t.name)];
      if (!label || !t.moment || !t.word) return;
      at = A.after(at, esc(t.moment) + '<br><b>' + esc(label) + '.</b> This elicits "' + esc(t.word) + '".') || at;
    });
  }
  /* the eleven cards behind See all eleven: the grid, and the back of each card */
  A.show('#techGrid'); A.show('#techGrid .flip-back');

  /* 4 · In the classroom. The line that opens is hidden on paper, open or shut, so its words are written out straight
     after it. */
  A.each('#s2b details.reveal', function(d){
    var note = d.querySelector('.content'); if (!note || !words(note)) return;
    A.after(d, note.innerHTML);
  });
  A.hide('#s2b details.reveal .content');   /* a tutor's own print shows the line itself; here it would say it twice */
});
