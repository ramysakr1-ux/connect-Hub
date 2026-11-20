/* Connect Lite — Drilling techniques: getting the mouth to say it right (the short session), printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 20 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs drilling-techniques-short <folder> shows what it prints).
 *
 * What "Print with the answers" writes on this session:
 *   4  Match the drill to the problem   under each of the four problems, after its four options: the drill the page
 *                                       counts as right, in bold, and the page's own explanation.
 *   2  Discuss first                    the trainer's note inside each of the four cards. The stylesheet shows these in
 *                                       this print by itself (.reveal-card .a), so nothing is written for them here.
 *   3  Six drill types                  the description and the example inside each of the six cards
 *   5  Four more techniques             the description and the example inside each of the four cards
 *                                       These ten are shown as they stand on the page, open or shut. The page's own print
 *                                       rule already prints them, on the plain handout too; they are named here so that
 *                                       this print never depends on that rule.
 * Part 1 (the warmer film), part 6 (drill each other in an unknown language) and part 7 (the wrap-up) ask nothing the
 * page holds an answer to, so none is printed.
 *
 * WHERE THE ANSWERS COME FROM. Nothing is copied into this file. The drill and the explanation of each problem are
 * read from the page's own list (SCENARIOS, the one its buttons mark against), and each is placed by the problem's own
 * words, so a correction made on the page is a correction here. A problem whose words are not in the list gets no
 * line, and neither does one whose right drill is not on one of its own buttons: nothing is ever guessed.
 * Every explanation on this page opens with the name of its drill ("Substitution drill: they have the frame ...",
 * "Back-chaining: building it ..."), so the line is the explanation as the page words it, with the option's own label
 * in bold where it opens the sentence, and the name is not said twice. An explanation that does not open with its
 * option's label is written whole after the label.
 *
 * Nothing the trainee did is touched: no option is pressed, no card opened or shut. A problem already answered on the
 * screen shows the page's explanation with a tick or a cross; that block is put aside for this print only, so the
 * explanation is said once, in the same place, whatever was pressed.
 */
SessionAnswers.register(function(A){
  /* the page's list is top-level in its own script, so it is read by name; if it is missing, nothing is written */
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var only = function(list, test){ var hit = list.filter(test); return hit.length === 1 ? hit[0] : null; };

  /* 4 · Match the drill to the problem. Each item of the list is [the problem, its options, which option is right, why]. */
  var items = data(function(){ return SCENARIOS; });
  if (items && items.filter) A.each('#scens .scen', function(scen){
    var task = scen.firstElementChild; if (!task || task.tagName !== 'P' || task.classList.contains('why')) return;
    var it = only(items, function(x){ return x && norm(x[0]) === norm(task.textContent); }); if (!it || !it[1]) return;
    var drill = it[1][it[2]], why = it[3] == null ? '' : String(it[3]); if (typeof drill !== 'string' || !drill) return;
    /* the drill must be one of this problem's own options */
    var opts = scen.querySelectorAll('.opt');
    if (opts.length && ![].some.call(opts, function(b){ return b.textContent === drill; })) return;
    /* the explanation opens with the label as a whole word: "Substitution drill: ...", "Back-chaining: ..." */
    var rest = why.slice(drill.length);
    var said = why.indexOf(drill) === 0 && /^(:|\s)/.test(rest)
      ? '<b>' + esc(drill) + '</b>' + esc(rest)
      : '<b>' + esc(drill) + '.</b>' + (why ? ' ' + esc(why) : '');
    A.after(scen.querySelector('.chips') || task, said);
  });
  /* a problem answered on the screen carries the same explanation in its own block; the line above already says it */
  A.hide('#scens .scen .ans-line + .why');

  /* 3 and 5 · the drill cards: the description and the example inside each one, shown whether it is open or shut */
  A.show('#drills1 .reveal-card .dd, #drills2 .reveal-card .dd');
});
