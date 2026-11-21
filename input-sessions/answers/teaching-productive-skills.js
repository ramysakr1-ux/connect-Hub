/* Connect Lite — Teaching productive skills: every answer under its task, for "Print with the answers".
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs teaching-productive-skills <folder> shows what it prints).
 *
 * WHAT THE PRINT SHOWS, PART BY PART
 *   Lead-in                  What is a productive skill? The page's own answer, shown where it stands (1)
 *   3  Useful language       under each of the eight terms, its own description, shown where it stands (8)
 *   4  Pick the task type    under each of the ten task types, its own example and what it is best for, shown (10)
 *   5  Detail questions      under each of the five questions, its own answer, shown where it stands (5)
 *   5  Content feedback, or language feedback?   under each of the six things a teacher notices: the page's own
 *                            explanation, which opens with the right option's words; those are set in bold (6)
 *   Debrief                  Put the stages back in order: the five stages, first to last (1)
 *   The table                under each of the five writing boxes, the page's own writing side; then the page's
 *                            note under the table, shown where it stands (5 + 1)
 *   Run the task             What good feedback sounds like, and Look out for (#runtaskKey, a .reveal-block, which
 *                            the stylesheet shows without being asked) (1)
 * Stage 2 (Preparing), the film question in the lead-in, the reading text and the monitoring sheet are the trainee's
 * own ideas: the page holds no answer to them, so none is printed.
 *
 * WHERE EACH ANSWER COMES FROM. All of it from the page; nothing is copied into this file.
 *   The lead-in, the terms, the task types, the detail questions and the note under the table: the page's own
 *   blocks, shown for the print.
 *   The six scenarios and the order: the page's own lists, top-level in its script, read by name (SCENARIOS, CORRECT).
 *   A scenario is matched by its own words; its answer is the row's own button whose value is the list's answer. A
 *   row that matches none, or more than one, gets no line. If the page is ever rebuilt without the lists, nothing
 *   is written for those two tasks.
 *   The table: the writing side the page keeps in each row (.cmp-key), read from the row and written under its box.
 *   It is written, not shown, because the page draws it differently once Reveal answer has been pressed.
 * Nothing the trainee did is touched: nothing is opened or shut, no option or stage is clicked, no box is changed.
 * A scenario answered on the screen shows its explanation; that is put aside for this print, because the line under
 * the scenario says it, so an answered page prints the same as an untouched one and every answer is said once.
 */
SessionAnswers.register(function(A){
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var words = function(el){ return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; };

  /* Lead-in, 3, 4 and 5: the page's own answers, shown whether they are open or shut on the screen. */
  A.show('#openCard .ans, #terms .term .d, #speakingTasks .task .d, #writingTasks .task .d, #details .dq .a');

  /* 5 · Content feedback, or language feedback? Each item of the page's list is { lane, text, answer, feedback }. */
  var scen = data(function(){ return SCENARIOS; });
  if (scen && scen.filter) A.each('#scenarios .scen', function(row){
    var said = words(row.querySelector('.t'));
    var hit = scen.filter(function(s){ return s && A.txt(s.text) === said; });
    if (hit.length !== 1) return;
    var opt = [].filter.call(row.querySelectorAll('.opt'), function(o){ return o.dataset.v === String(hit[0].answer); });
    if (opt.length !== 1) return;
    /* the page's explanation opens with the option's own words in all six, so those words are set in bold where they
       stand; if one ever does not, the option's words go in front of it */
    var label = words(opt[0]), why = String(hit[0].feedback);
    A.line(row, why.indexOf(label) === 0 ? '<b>' + esc(label) + '</b>' + why.slice(label.length) : '<b>' + esc(label) + '.</b> ' + why);
  });
  A.hide('#scenarios .scen .why');   /* the line above says it */

  /* Debrief · Put the stages back in order: the page's own order, first to last. */
  var order = data(function(){ return CORRECT; }), box = document.getElementById('order');
  if (box && order && order.map && order.length === box.querySelectorAll('.order-line').length)
    A.after(box, '<ol style="margin:0;padding-left:22px;">' + order.map(function(s){ return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>');

  /* The table: the writing side of each row, under its box; then the page's own note under the table. */
  A.each('#compare td', function(td){
    var key = td.querySelector('.cmp-key');
    if (key && words(key)) A.line(td, key.innerHTML);
  });
  A.show('#s7 p.cmp-key');
});
