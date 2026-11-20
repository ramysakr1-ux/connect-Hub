/* Connect Lite — Lesson frameworks: finding your shape, printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 20 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs lesson-framework <folder> shows what it prints).
 *
 * WHAT IT WRITES, PART BY PART
 *   2   The six shapes        under each shape, its stages in order (numbered), from the list behind "Reveal answer"
 *   3   Card sort             in each shape's box, the stage card that belongs there, in bold
 *   4   Quick quiz            under each card, the answer on its back, in bold
 *   5   Scenarios             under each mini lesson, the framework the page counts as right, in bold
 *   6   Meaning or form?      under each task type, the answer the page counts as right, in bold
 *   7   Spot the flaw         the fix under each plan, shown as it stands
 *   8   Pacing                the answer behind "Reveal the answer" (which stage to trim, and the target minutes), shown
 *   9   Sequence              under the task, the correct order of each of the four frameworks
 *   10  One page              Step 1: under each activity, its lesson in bold and the page's reason; Step 2 (shown even
 *                             if Step 1 is not finished): under each question, the page's reason, whose first words
 *                             (the shape) are in bold
 * Part 1 (the decision tree) is to read: there is nothing to answer, so nothing is printed.
 *
 * WHERE EACH ANSWER COMES FROM. All of it from the page itself; nothing is copied into this file.
 *   Part 2: each shape's own list on the page (#fwGrid ol), its words written out under the card. The page's print rule
 *   for that list is tied to its id and would beat the shared "show" rule, so the list is written, not shown.
 *   Parts 3 to 6, 9 and 10: the page's own lists, top-level in its script, read by name (stages, quiz, scenarios,
 *   mfItems, seqFrameworks, SPREAD, LESSONS, SHAPES), the same ones its buttons are marked against. A row is matched by
 *   its own words; a row that matches none, or more than one, gets no line, and a right answer that is not exactly one
 *   of the row's own buttons gets none either: nothing is ever guessed.
 *   Parts 7 and 8: the page's own blocks (.flaw-fix, #pacingAnswer), shown.
 * Nothing the trainee did is touched: no card is pinned, no option pressed, no counter moves, the typed guesses and
 * minutes stay, nothing is opened or shut. What an answered task shows on the screen (cards in boxes, picks, the built
 * order, the scores, the step 1 reasons) the page's own print rules leave out, so an answered task prints the same as
 * an untouched one and each answer is said once. Part 9's own "Reveal correct order" box is put aside for this print:
 * the four orders are written under the task.
 */
SessionAnswers.register(function(A){
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var list = function(sel, root){ return [].slice.call((root || document).querySelectorAll(sel)); };
  var one = function(arr, fn){ var h = (arr || []).filter(fn); return h.length === 1 ? h[0] : null; };
  var full = function(l){ if (l) l.style.flex = '0 0 100%'; return l; };   /* a line under a row laid out side by side */

  /* 2 · The six shapes: the stages of each shape, as its own list gives them */
  A.each('#fwGrid .fw-card', function(card){
    var ol = card.querySelector('ol'); if (!ol) return;
    /* numbered lines, not a list: the page hides every ol inside #fwGrid, and this line stands inside it */
    var items = list('li', ol).map(function(li, i){ return '<div>' + (i + 1) + '. ' + esc(norm(li.textContent)) + '</div>'; });
    if (items.length) A.line(card, items.join(''));
  });

  /* 3 · Card sort: in each shape's box, the card that belongs in it */
  var stagesList = data(function(){ return stages; });
  if (Array.isArray(stagesList)) A.each('#zoneGrid .zone', function(z){
    var name = z.getAttribute('data-zone'); if (!name) return;
    stagesList.filter(function(s){ return s && s.zone === name; }).forEach(function(s){ A.line(z, '<b>' + esc(s.text) + '</b>'); });
  });
  A.hide('#stageTray');   /* the six cards are each written in their box above; the tray would say them twice */

  /* 4 · Quick quiz: under each card, its answer */
  var quizList = data(function(){ return quiz; });
  if (Array.isArray(quizList)) A.each('#quizGrid .flip-card', function(card){
    var front = card.querySelector('.flip-front'); if (!front) return;
    var c = front.cloneNode(true); list('.quiz-num', c).forEach(function(x){ x.remove(); });
    var said = norm(c.textContent);
    var it = one(quizList, function(x){ return x && A.txt(x.q) === said; });
    if (it) A.line(card, '<b>' + it.a + '</b>');
  });

  /* 5 · Scenarios and 6 · Meaning or form: under each row, the option the page counts as right */
  var mark = function(row, label){
    var hit = list('.opt-btn', row).filter(function(b){ return b.textContent === label; });
    if (hit.length === 1) full(A.line(row, '<b>' + esc(hit[0].textContent) + '</b>'));
  };
  var scen = data(function(){ return scenarios; });
  if (Array.isArray(scen)) A.each('#scenarioContainer .scenario-card', function(row){
    var t = row.querySelector('.scenario-text'); if (!t) return;
    var it = one(scen, function(x){ return x && A.txt(x.text) === norm(t.textContent); });
    if (it) mark(row, it.correct);
  });
  var mf = data(function(){ return mfItems; });
  if (Array.isArray(mf)) A.each('#mfContainer .mf-card', function(row){
    var ex = row.querySelector('.mf-example'); if (!ex) return;
    var it = one(mf, function(x){ return x && A.txt('"' + x.example + '"<em>' + x.note + '</em>') === norm(ex.textContent); });
    if (it) mark(row, it.answer);
  });

  /* 7 · Spot the flaw and 8 · Pacing: the page's own answers, shown whether open or shut on the screen */
  A.show('#flawContainer .flaw-fix, #pacingAnswer');

  /* 9 · Sequence: the correct order of every framework, under the task */
  var seq = data(function(){ return seqFrameworks; });
  var build = document.getElementById('seqBuild');
  if (seq && typeof seq === 'object' && build) {
    var at = build;
    Object.keys(seq).forEach(function(fw){
      if (!Array.isArray(seq[fw])) return;
      at = A.after(at, '<b>Correct order for ' + esc(fw) + ':</b><ol style="margin:2px 0 0; padding-left:20px;">' + seq[fw].map(function(s){ return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>') || at;
    });
  }
  A.hide('#seqAnswer');

  /* 10 · One page, three lessons. Step 1: each activity's lesson and why. Step 2: each lesson's shape and why. */
  var spread = data(function(){ return SPREAD; }), lessons = data(function(){ return LESSONS; }), shapes = data(function(){ return SHAPES; });
  if (Array.isArray(spread) && Array.isArray(lessons)) A.each('#spRows .sp-row', function(row){
    var t = row.querySelector('.sp-t'); if (!t) return;
    var it = one(spread, function(x){ return x && A.txt('<b>' + x.n + '</b> ' + x.t) === norm(t.textContent); });
    if (!it) return;
    var hit = list('.sp-opt', row).filter(function(b){ return b.textContent === lessons[it.lesson]; });
    if (hit.length === 1) A.line(row, '<b>' + esc(hit[0].textContent) + '.</b> ' + esc(it.why));
  });
  if (Array.isArray(shapes)) A.each('#spShapes .sp-row', function(row){
    var t = row.querySelector('.sp-t'); if (!t) return;
    var said = norm(t.textContent).replace(/^\d+\.\s*/, '');
    var it = one(shapes, function(x){ return x && A.txt(x.q) === said; });
    if (!it || !Array.isArray(it.opts)) return;
    var hit = list('.sp-opt', row).filter(function(b){ return b.textContent === it.opts[it.r]; });
    if (hit.length !== 1) return;
    /* the page's reason starts with the shape itself ("Text-Based: the text comes first..."): that start is the answer, in bold */
    var lab = hit[0].textContent, why = String(it.why || '');
    if (why.indexOf(lab + ':') === 0) A.line(row, '<b>' + esc(lab) + ':</b>' + esc(why.slice(lab.length + 1)));
    else A.line(row, '<b>' + esc(lab) + '.</b> ' + esc(why));
  });
  A.show('#spShapeHead, #spShapes');   /* Step 2 opens on the screen once Step 1 is done; the answers print carries it either way */
});
