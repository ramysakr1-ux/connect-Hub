/* Connect Lite — Evaluating your plan: what changes in the next one (the short session), printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs evaluating-your-plan-short <folder> shows what it prints).
 *
 * What "Print with the answers" writes on this session:
 *   2  The plan, or the teaching?   under each of the six sentences: the option the page counts as right, in bold, and
 *                                   the page's own feedback (6). Two of the six are both: the page takes either option,
 *                                   so both are in bold, and the feedback says it is both.
 *   3  The three questions          what each question asks for, inside its card (3)
 *   4  Rewrite it                   the version that works, inside the card under each of the three sentences (3)
 *   5  Carry it forward             what each part of the next plan takes, inside its card (5)
 *                       3, 4 and 5 are the page's own reveal cards: the stylesheet shows them in this print by itself
 *                       (.reveal-card .a), open or shut, so nothing is written for them here.
 * Part 1 (the two lists), part 6 (the wrap-up) and "open your own last self-evaluation" in part 4 are the trainee's
 * own: the page holds no answer to them, so none is printed. What the trainee typed in a rewrite box stays as typed.
 *
 * WHERE THE ANSWERS COME FROM
 *   Parts 3, 4 and 5: the page's own cards, as they stand.
 *   Part 2: the page keeps this list inside the call that draws the six items, choices('sort', [...]), where this file
 *   cannot read it. So each item's right option (correct, and also where it has one) and its feedback are COPIED
 *   below, word for word, from that call in evaluating-your-plan-short/index.html, under the item's own words. IF AN
 *   ITEM, ITS RIGHT ANSWER OR ITS FEEDBACK CHANGES ON THE PAGE, CHANGE IT HERE TOO, and run the check again. The
 *   answer printed is the label of the item's own button, read from the page. An item whose words are not in the
 *   table gets no line, and neither does one that does not have exactly the page's two buttons: nothing is guessed.
 *
 * Nothing the trainee did is touched: no option is pressed, no card opened or shut, nothing typed over. An item
 * already answered on the screen carries a tick or a cross and its feedback; that is put aside for this print, so an
 * answered item prints the same as an untouched one, and its answer is said once.
 */
SessionAnswers.register(function(A){
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

  /* COPIED from choices('sort', [...]): the item's words, the options that count (0 is the first button, 1 the
     second; correct first, then also), and the feedback. */
  var SORT = [
    ['“I spent eleven minutes on the lead-in. I’d allowed four.”', [0], 'The plan. Four minutes was never enough for that lead-in: the timing was wrong on paper before anyone stood up. Next plan: three minutes, and the discussion question cut to one.'],
    ['“I was really nervous at the start and my hands were shaking.”', [1], 'The teaching, and it belongs in your self-evaluation, which is criterion 5m. It is real and it matters; it is just not what 4n is asking about.'],
    ['“Nobody could do the gist task. The text was too hard for them.”', [0, 1], 'Both, and the plan first. In the room, monitoring could have caught it early enough to adapt the task (5m). But choosing a text above the level is a materials decision made at the desk (4c), and the anticipated-problems section should have caught it. Next plan: check the text against the level before you write the tasks, not after.'],
    ['“My instructions for the second activity confused everyone and I had to start again.”', [1, 0], 'Both. Delivering the instructions was the teaching (5m), but look at the plan before you stop there. If the procedure column said “set up activity 2” rather than the words you would actually say, the plan let you improvise, and that IS a plan weakness.'],
    ['“The practice stage had no purpose. They just did it and we moved on.”', [0], 'The plan. A stage with no stated aim is a staging failure on paper (4b). If you cannot say in one line what a stage is FOR, it should not be in the plan.'],
    ['“I finished eight minutes early and had nothing left.”', [0], 'The plan, specifically the absence of one. Every plan needs an extension you can drop if you have time and lose if you do not. Next plan: write it in, at the bottom, every time.']
  ];

  /* 2 · The plan, or the teaching? */
  A.each('#sort .scen', function(d){
    var t = d.querySelector('.t'), opts = d.querySelectorAll('.opt'); if (!t || opts.length !== 2) return;
    var hit = SORT.filter(function(s){ return s[0] === norm(t.textContent); });
    if (hit.length !== 1) return;
    var labels = hit[0][1].map(function(i){ return '<b>' + esc(norm(opts[i].textContent)) + '</b>'; });
    A.line(d, labels.join(' · ') + ' ' + esc(hit[0][2]));
  });
  /* what an item answered on the screen shows (the tick or the cross, and the feedback): the lines above say it */
  A.hide('#sort .why');
});
