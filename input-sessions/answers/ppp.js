/* Connect Lite — Presentation, Practice, Production, printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs ppp <folder> shows what it prints).
 *
 * WHAT IT WRITES, PART BY PART
 *   Stage 0  What is PPP?        the answer behind "Tap to reveal", shown where it stands on the page
 *   Stage 1  Match the terms     under each of the five terms, its meaning, in bold
 *   Stage 4  Detail questions    under each of the six statements, True or False in bold, and the page's own reason
 *   Debrief  Order the stages    under the four stages, the order the page counts as right
 *   Your turn  Stage a page      "One way to stage the page" and "Where plans usually go wrong", behind "Reveal
 *                                answer": a .reveal-block, which the stylesheet shows in this print without being asked
 * The lead-in and Stage 2 (predict) are the trainee's own ideas and Stage 3 is a text to read: the page holds no answer
 * to them, so none is printed.
 *
 * WHERE EACH ANSWER COMES FROM. All of it from the page itself; nothing is copied into this file.
 *   Stage 0 and Your turn: the page's own blocks, shown.
 *   Stage 1, Stage 4 and the debrief: the page's own lists, top-level in its script, read by name (pairs, tfItems,
 *   correctDebriefOrder), the same ones its clicks are marked against. A row is matched by its own words; a row that
 *   matches none, or more than one, gets no line, and an answer that is not exactly one of the row's own options gets
 *   none either: nothing is ever guessed.
 *
 * Nothing the trainee did is touched: nothing is matched, pressed, placed, opened or shut, and what was typed stays.
 * What an answered task shows on the screen (matched pairs, the count, True and False picked, the reasons, the stages
 * placed and the line under them) the page's own print rules leave out, so an answered task prints the same as an
 * untouched one and each answer is said once.
 */
SessionAnswers.register(function(A){
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var list = function(sel, root){ return [].slice.call((root || document).querySelectorAll(sel)); };
  var one = function(arr, fn){ var h = (arr || []).filter(fn); return h.length === 1 ? h[0] : null; };

  /* Stage 0 · What is PPP?: the card's own answer, shown open or shut; "Tap to reveal" has nothing left to reveal */
  A.show('#whatisppp .reveal-card .answer');
  A.hide('#whatisppp .reveal-card .tap');

  /* Stage 1 · Match the terms: under each term, the meaning the page pairs it with, if that meaning is one of the
     meanings on the page */
  var pairList = data(function(){ return pairs; });
  if (Array.isArray(pairList)) A.each('#termCol .match-item', function(el){
    var it = one(pairList, function(x){ return x && norm(x.term) === norm(el.textContent); });
    if (!it) return;
    var hit = list('#defCol .match-item').filter(function(d){ return d.textContent === it.def; });
    if (hit.length === 1) A.line(el, '<b>' + esc(hit[0].textContent) + '</b>');
  });

  /* Stage 4 · Detail questions: under each statement, True or False and the page's reason. The reason starts with the
     answer itself ("False — in PPP the teacher..."): that start is put in bold. */
  var tf = data(function(){ return tfItems; });
  if (Array.isArray(tf)) A.each('#tfList .tf-item', function(row){
    var st = row.querySelector('.tf-statement'); if (!st) return;
    var it = one(tf, function(x){ return x && A.txt(x.s) === norm(st.textContent); });
    if (!it || typeof it.t !== 'boolean') return;
    var hit = list('.tf-buttons button', row).filter(function(b){ return b.getAttribute('data-val') === String(it.t); });
    if (hit.length !== 1) return;
    var lab = hit[0].textContent, why = String(it.fb || '');
    if (why.indexOf(lab + ' ') === 0) A.line(row, '<b>' + esc(lab) + '</b>' + why.slice(lab.length));
    else A.line(row, '<b>' + esc(lab) + '.</b> ' + why);
  });

  /* Debrief · Order the stages: the page's own order, under the stages, if it is made of the stages on the page */
  var order = data(function(){ return correctDebriefOrder; }), pool = document.getElementById('debriefPool');
  if (Array.isArray(order) && pool) {
    var chips = list('.debrief-chip', pool).map(function(c){ return c.textContent; });
    var whole = order.length === chips.length && order.every(function(s){ return chips.filter(function(c){ return c === s; }).length === 1; });
    if (whole) A.after(pool, '<b>The order:</b>' + order.map(function(s, i){ return '<div>' + (i + 1) + '. ' + esc(s) + '</div>'; }).join(''));
  }
});
