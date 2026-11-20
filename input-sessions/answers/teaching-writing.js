/* Connect Lite — Teaching writing: every answer under its task, for "Print with the answers".
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 20 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs teaching-writing <folder> shows what it prints).
 *
 * WHAT IT WRITES, PART BY PART
 *   3   Attitudes to writing         in each box, the words that belong in it (8)
 *   5   Product or process writing   in each box, its statements (10)
 *   8   Controlled to freer          in each box, its examples (5)
 *   4   Before we write              the checklist behind "Reveal the checklist", shown as it stands
 *   6   Wall dictation               the key behind "Reveal answer key", shown as it stands (the text itself is on every print)
 *   7   Parallel writing             the paragraph behind "Reveal a model answer", shown as it stands
 *   9   Write the model first        its "Reveal answer" block, which the stylesheet prints without being asked
 *   10  Backs to the board           under the task, the twelve terms "New term" picks from, each with the page's definition
 * Parts 1 and 2 and the cartoon strip in part 4 are done live in the room. The page holds no answer for them, so
 * none is printed.
 *
 * WHERE EACH ANSWER COMES FROM. All of it from the page itself; nothing is copied into this file.
 *   The three sorts: every chip carries the name of the box it belongs to (data-zone, written by the page's own
 *   makeSorter, and the value its click is marked against). A chip's own words go into the box of that name, in bold.
 *   A chip whose box is not on the page gets no line, and a sort with two boxes of one name is left alone: nothing is
 *   ever guessed.
 *   The terms: the page's own list (terms), the one "New term" reads, in the page's order.
 * Nothing the trainee did is touched: no chip is chosen or placed, no counter moves, no line of the dictation is
 * revealed, no answer is opened on the screen, and what is in the two writing boxes stays as it is.
 */
SessionAnswers.register(function(A){
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var own = function(o, k){ return Object.prototype.hasOwnProperty.call(o, k); };

  /* 3, 5 and 8 · the three sorts: in each box, the chips that belong in it, in the order they stand above it. */
  ['att', 'pp', 'sub'].forEach(function(pre){
    var bank = document.getElementById(pre + 'Bank'), zones = document.getElementById(pre + 'Zones');
    if (!bank || !zones) return;
    var boxes = {}, clear = true;
    A.each('.sort-zone', function(z){
      var t = z.querySelector('.sort-zone-title'), name = t ? t.textContent : '';
      if (!name || own(boxes, name)) { clear = false; return; }
      boxes[name] = z;
    }, zones);
    if (!clear) return;
    A.each('.sort-chip', function(chip){
      var name = chip.getAttribute('data-zone');
      if (name && own(boxes, name)) A.line(boxes[name], '<b>' + esc(chip.textContent) + '</b>');
    }, bank);
  });
  /* what has been sorted on the screen, and its counter, are put aside for this print: the lines above already say
     where every chip goes (the page's own print rule hides them too; this keeps each answer there once without it) */
  A.hide('.sort-zone .dropped, .sort-progress');

  /* 4, 6 and 7 · the three boxes behind a button: the checklist, the dictation's answer key, the model paragraph. */
  A.show('#considerBox, #dictAnsBox, #parallelBox');

  /* 10 · backs to the board: the twelve terms and what the page says each one means, under the task. The list is
     top-level in the page's own script, so it is read by name; if it is ever missing, nothing is written. */
  var list = null; try { list = terms; } catch (e) {}
  var board = document.getElementById('termDisplay'), task = board && board.parentNode.querySelector('p.intro');
  if (task && Array.isArray(list)) {
    var at = task;
    list.forEach(function(t){
      if (!t || !t.word || !t.def) return;
      at = A.after(at, '<b>' + esc(t.word) + '.</b> ' + esc(t.def)) || at;
    });
  }
});
