/* Connect Lite — Receptive skills: every answer under its task, for "Print with the answers".
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs receptive-skills <folder> shows what it prints).
 *
 * WHAT THE PRINT SHOWS, PART BY PART
 *   Lead-in      What is a receptive skill?   the page's own answer (#rev1 .ans, shown) (1)
 *   Stage 1      Match each term              under each term, its meaning, in bold (6); the shuffled column of
 *                                             meanings is put aside, or each would be said twice
 *   Stage 4      True or false?               under each statement, True or False in bold, then the page's own reason (12)
 *   Debrief      Put the stages back in order the seven stages in their order, under the task (1)
 *   Task types   Which stage?                 under each task, its stage in bold, in the words of its own dropdown (12);
 *                                             then the bank behind "Reveal answer" (#typesBox, shown) (1)
 *   Your turn    Write the tasks              What to check, and one example of each (#writetasksKey, shown) (1)
 * Stage 2 (predict) is a discussion and Stage 3 (the gist read) checks the trainee's own ideas against the text: the
 * page holds no answer for either, so none is printed.
 * The page's own "Answer key" part says the same terms, statements and order a second time, so it is put aside for this
 * print: every answer is under its task, once.
 *
 * WHERE EACH ANSWER COMES FROM. All of it from the page's own markup; nothing is copied into this file. The page keeps
 * its lists (TERMS, TF, CORRECT) inside a closure, but writes all three into its answer key when it loads, and builds
 * each statement's reason into the statement's row:
 *   Stage 1: the key's Terminology table (#keyTerms), a row matched to a term by the term's own words.
 *   Stage 4: each row's own reason (.why), which begins with True or False; the word is checked against the row's own
 *            two options before it is written.
 *   Debrief: the key's own line (#keyOrder), checked against the seven stages on the page before it is written.
 *   Task types: each dropdown's own option whose value is the one the page marks right (data-k).
 * A row that matches none, or more than one, gets no line: nothing is guessed.
 * Nothing the trainee did is touched: no term matched, no option pressed, no stage placed, no dropdown changed, no box
 * opened or shut, no counter moves. What an answered task shows on the screen the page's own print rules leave out, so
 * an answered page prints the same as an untouched one.
 */
SessionAnswers.register(function(A){
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var words = function(el){ return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; };
  var list = function(sel, root){ return [].slice.call((root || document).querySelectorAll(sel)); };

  /* Lead-in · What is a receptive skill? The page's own answer. */
  A.show('#rev1 .ans');

  /* Stage 1 · Match each term to its meaning: under each term, the meaning the key's own table gives it. */
  var meaning = {}, twice = {};
  A.each('#keyTerms tr', function(tr){
    var td = tr.querySelectorAll('td'); if (td.length !== 2) return;
    var k = words(td[0]); if (k in meaning) twice[k] = 1; meaning[k] = words(td[1]);
  });
  A.each('#termsCol .mt', function(b){
    var k = words(b); if (!meaning[k] || twice[k]) return;
    A.after(b, '<b>' + esc(meaning[k]) + '</b>');
  });
  A.hide('#defsCol');   /* the six meanings, shuffled, are the task's other column: each is written under its term above */

  /* Stage 4 · True or false: under each statement, the right word in bold, then the row's own reason. The reason is
     written here, with its first word in bold, so the row's own copy is put aside for this print. */
  A.each('#tfArea .qrow', function(row){
    var why = row.querySelector('.why'); if (!why) return;
    var m = /^(True|False)\.\s*(.*)$/.exec(words(why)); if (!m) return;
    if (list('.opt', row).filter(function(o){ return words(o) === m[1]; }).length !== 1) return;
    A.line(row, '<b>' + esc(m[1]) + '.</b> ' + esc(m[2]));
  });
  A.hide('#tfArea .why');

  /* Debrief · Put the stages back in order: the key's own line, written as a numbered list under the task. */
  var area = document.getElementById('orderArea'), keyOrder = document.getElementById('keyOrder');
  if (area && keyOrder) {
    var order = keyOrder.textContent.split('→').map(function(t){ return t.replace(/\s+/g, ' ').trim(); }).filter(Boolean);
    var onPage = list('.ob', area).map(function(b){ return words(b.querySelector('span:not(.n)')); });
    var same = order.length === onPage.length && order.slice().sort().join('|') === onPage.slice().sort().join('|');
    if (same && order.length) A.after(area, '<ol style="margin:0;padding-left:22px;">' + order.map(function(t){ return '<li><b>' + esc(t) + '</b></li>'; }).join('') + '</ol>');
  }

  /* Task types · Which stage? Under each task, the stage its own dropdown counts as right. */
  A.each('#typeSort .ts-row', function(row){
    var sel = row.querySelector('select'); if (!sel || !sel.dataset.k) return;
    var opt = list('option', sel).filter(function(o){ return o.value === sel.dataset.k; });
    if (opt.length !== 1) return;
    var l = A.line(row, '<b>' + esc(words(opt[0])) + '</b>'); if (l) l.style.gridColumn = '1 / -1';   /* the row is a two-column grid */
  });
  A.show('#typesBox');   /* the whole bank, by stage: what "Reveal answer" opens */

  /* Your turn · Write the tasks: #writetasksKey is a .reveal-block, which the print shows without being asked. */

  /* The page's own Answer key repeats the terms, the statements and the order: each is under its task above. */
  A.hide('#key');
});
