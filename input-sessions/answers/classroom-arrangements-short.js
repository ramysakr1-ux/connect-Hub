/* Connect Lite — Classroom arrangements and material use (the short session), printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs classroom-arrangements-short <folder> shows what it prints).
 *
 * What "Print with the answers" writes on this session:
 *   2  Plan the switch     under each of the three stages: the arrangement the page counts as right, in bold, and the
 *                          page's own reasoning
 *   1  Four layouts        what each of the four is good for and where it breaks down, inside its card
 *   3  Materials           the job and the cost of each of the five, inside its card
 *                          These are the page's own reveal cards: the stylesheet shows them in this print by itself
 *                          (.reveal-card .a), open or shut, so nothing is written for them here.
 * Part 4 (Online equivalent) asks the room to run the three stages again online. The page holds no answer to that, so
 * none is printed.
 *
 * WHERE THE ANSWERS COME FROM. Nothing is copied into this file.
 *   Part 2: the page's own list (STAGES, the one its buttons mark against), read by name and placed by each stage's
 *   own name and words. A stage that is not in the list exactly once gets no line, nor does one whose right
 *   arrangement is not on exactly one of its own buttons: nothing is ever guessed.
 *
 * Nothing the trainee did is touched: no arrangement is pressed, no card opened or shut. A stage already answered on
 * the screen carries a tick or a cross and the reasoning; that block is put aside for this print (the page's print
 * rule hides it anyway), so an answered stage prints the same as an untouched one, and its answer is said once.
 */
SessionAnswers.register(function(A){
  /* the page's list is top-level in its own script, so it is read by name; if it is missing, nothing is written */
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

  /* 2 · Plan the switch. Each item of the list is { stage, text, choices, correct (its place in choices), feedback }. */
  var stages = data(function(){ return STAGES; });
  if (stages && stages.filter) A.each('#stages .scen-wrap', function(wrap){
    var name = wrap.querySelector('.label'), scen = wrap.querySelector('.scen'); if (!name || !scen) return;
    var task = scen.querySelector('p:not(.fb)'); if (!task) return;
    var hit = stages.filter(function(x){ return x && norm(x.stage) === norm(name.textContent) && norm(x.text) === norm(task.textContent); });
    if (hit.length !== 1 || !hit[0].choices) return;
    var it = hit[0], label = it.choices[it.correct]; if (typeof label !== 'string' || !label) return;
    /* the arrangement must be one of this stage's own buttons; once a stage is answered its buttons are gone, and the
       label is then checked against the stage's own choices in the list */
    var btns = scen.querySelectorAll('[data-pick]');
    if (btns.length && [].filter.call(btns, function(b){ return b.textContent === label; }).length !== 1) return;
    if (!btns.length && it.choices.filter(function(c){ return c === label; }).length !== 1) return;
    A.line(scen, '<b>' + esc(label) + '.</b>' + (it.feedback ? ' ' + esc(it.feedback) : ''));
  });
  /* an answered stage shows the same reasoning with a tick or a cross; the line above already says it */
  A.hide('#stages .scen .fb');
});
