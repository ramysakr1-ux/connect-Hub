/* Connect Lite — Language practice: from controlled to free (the short session), printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 20 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs language-practice-short <folder> shows what it prints).
 *
 * What "Print with the answers" writes on this session:
 *   3  Sort the activity by stage   under each of the four activities, after its three options: the stage the page
 *                                   counts as right, in bold, and the page's own explanation.
 *   2  The three stages             the worked example inside each of the three cards
 *   4  More worked examples         the example inside each of the three cards
 *   5  Loop task                    the task inside each of the four cards
 *                                   These ten are shown as they stand on the page, open or shut. The page's own print
 *                                   rule already prints them, on the plain handout too; they are named here so that
 *                                   this print never depends on that rule.
 *   6  Spot the mismatch            the answer the page keeps behind "Reveal answer", written out under the question
 *                                   (the page had no answer here until 20 Nov 2026; it is the trainer notes' own sentence)
 * The questions in 1 (Lead-in) and 7 (Design your own) are for the room: the page holds no answer to them, so none
 * is printed.
 *
 * WHERE THE ANSWERS COME FROM. Nothing is copied into this file. The stage and the explanation of each activity are
 * read from the page's own list (SORT_ITEMS, the one its buttons mark against), and each is placed by the activity's
 * own words, so a correction made on the page is a correction here. An activity whose words are not in the list gets no
 * line, and neither does one whose right stage is not on one of its own buttons: nothing is ever guessed.
 * Every explanation on this page opens with the name of its stage ("Controlled: one right answer per item ..."), so the
 * line is the explanation as the page words it, with that name in bold, and the name is not said twice.
 *
 * Nothing the trainee did is touched: no option is pressed, no card opened or shut. An activity already answered on
 * the screen shows the page's explanation with a tick or a cross; that block is put aside for this print only, so the
 * explanation is said once, in the same place, whatever was pressed.
 */
SessionAnswers.register(function(A){
  /* the page's list is top-level in its own script, so it is read by name; if it is missing, nothing is written */
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var only = function(list, test){ var hit = list.filter(test); return hit.length === 1 ? hit[0] : null; };

  /* 3 · Sort the activity by stage. Each item of the list is [the activity, its options, which option is right, why]. */
  var items = data(function(){ return SORT_ITEMS; });
  if (items && items.filter) A.each('#scens .scen', function(scen){
    var task = scen.firstElementChild; if (!task || task.classList.contains('why')) return;
    var it = only(items, function(x){ return x && norm(x[0]) === norm(task.textContent); }); if (!it || !it[1]) return;
    var stage = it[1][it[2]], why = it[3] == null ? '' : String(it[3]); if (typeof stage !== 'string' || !stage) return;
    /* the stage must be one of this activity's own options */
    var opts = scen.querySelectorAll('.opt');
    if (opts.length && ![].some.call(opts, function(b){ return b.textContent === stage; })) return;
    var said = why.indexOf(stage + ':') === 0
      ? '<b>' + esc(stage) + '</b>' + esc(why.slice(stage.length))
      : '<b>' + esc(stage) + '.</b>' + (why ? ' ' + esc(why) : '');
    A.after(scen.querySelector('.chips') || task, said);
  });
  /* an activity answered on the screen carries the same explanation in its own block; the line above already says it */
  A.hide('#scens .scen .ans-line + .why');

  /* 6 · Spot the mismatch: the line behind "Reveal answer", written out under it (a closed one does not print) */
  A.each('#s6 details.reveal', function(d){ var c = d.querySelector('.content'); if (c && A.txt(c.innerHTML)) A.after(d, c.innerHTML); });

  /* 2, 4 and 5 · the cards that open: what is inside each one, shown whether it is open or shut */
  A.show('#stages .reveal-card .wx, #more .reveal-card .wx, #loops .reveal-card .wx');
});
