/* Connect Lite — Teaching exam classes: every answer under its task, for "Print with the answers".
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs teaching-exam-classes <folder> shows what it prints).
 *
 * WHAT THE PRINT SHOWS, PART BY PART
 *   1  Climb the CEFR ladder      under each of the six learners, the level, in bold (6); the ladder under them prints
 *                                 with every rung open (the page's own print rule), which is the reason for each
 *   2  Decode the acronyms        under each of the eleven acronyms, its full name, in bold (11)
 *   4  Which exam?                under each of the five questions, the exam the page counts as right, in bold (5)
 *   5  Try it                     Ways to prepare a class for it (#examPrepKey, shown as it stands)
 *   7  Mark a sample              Where teachers usually land (#markKey, shown as it stands)
 * Parts 3 (the exams) and 6 (being an examiner) are to read: their cards print open on every print. Part 8 is
 * discussion. The page holds no answer to those, so none is printed.
 *
 * WHERE EACH ANSWER COMES FROM. All of it from the page; nothing is copied into this file.
 *   Part 1: each row's own dropdown carries its level (data-k), the one "Reveal answer" marks against; the line is
 *   written only if that level is exactly one of the dropdown's own options. The page's key (#cefrKey) says the same
 *   six in one line, and then speaks of clicking a rung, so it is put aside for this print: each answer is said once.
 *   Parts 2 and 4: the page's own lists, top-level in its script, read by name (acronyms, scenarios), the same ones
 *   its pills and its Check button are marked against. A row is matched by its own words; a row that matches none, or
 *   more than one, gets no line, and neither does an answer that is not exactly one of the row's own pills or options.
 *   Nothing is ever guessed.
 *   Parts 5 and 7: the page's own answer boxes, which the stylesheet shows for this print without being asked.
 * Nothing the trainee did is touched: no dropdown is changed, no pill pressed, no rung, card or box opened or shut, no
 * score moves, what was typed stays. The page's print rules already leave out what an answered task shows (the scores,
 * the filled pills, the dropdowns' choices and their borders), so an answered page prints the same as an untouched one.
 */
SessionAnswers.register(function(A){
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var list = function(sel, root){ return [].slice.call((root || document).querySelectorAll(sel)); };
  var one = function(arr, fn){ var h = (arr || []).filter(fn); return h.length === 1 ? h[0] : null; };

  /* 1 · Climb the CEFR ladder: after each row (the row is a grid line), the level its own dropdown is marked against. */
  A.each('#cefrGuess .cg-row', function(row){
    var sel = row.querySelector('select[data-k]'); if (!sel) return;
    var opt = one(list('option', sel), function(o){ return o.value !== '' && o.value === sel.getAttribute('data-k'); });
    if (opt) A.after(row, '<b>' + esc(opt.textContent) + '</b>');
  });
  A.hide('#cefrKey');   /* the same six in one line, and words about clicking a rung: said above, once */

  /* 2 · Decode the acronyms: after each acronym, its full name. Each item of the page's list is {t: acronym, d: name}. */
  var acro = data(function(){ return acronyms; });
  if (Array.isArray(acro)) A.each('#acroLeft .pill', function(pill){
    var it = one(acro, function(x){ return x && x.t === pill.textContent; });
    if (!it) return;
    var full = one(list('#acroRight .pill'), function(p){ return p.textContent === it.d; });
    if (full) A.after(pill, '<b>' + esc(full.textContent) + '</b>');
  });

  /* 4 · Which exam would you recommend: under each question, the option the page counts as right. */
  var scen = data(function(){ return scenarios; });
  if (Array.isArray(scen)) A.each('#scenarioArea .scenario', function(box){
    var t = box.querySelector('.sc-text'); if (!t) return;
    var it = one(scen, function(x){ return x && A.txt(x.text) === norm(t.textContent); });
    if (!it) return;
    var opt = one(list('select option', box), function(o){ return o.value !== '' && o.value === it.answer; });
    if (opt) A.line(box, '<b>' + esc(opt.textContent) + '</b>');
  });

  /* 5 · Try it and 7 · Mark a sample: #examPrepKey and #markKey are the page's own answer boxes (.reveal-block), shown
     for this print by the stylesheet, open or shut on the screen. */
});
