/* Connect Lite — Teaching speaking: staged the way you'll teach it (the short session), printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 20 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs teaching-speaking-short <folder> shows what it prints).
 *
 * What "Print with the answers" writes on this session:
 *   6  Content feedback, or language feedback?   under each of the four things a teacher notices: the choice the page
 *                                                counts as right, in bold, and the page's own explanation
 *   7  Debrief: put the stages back in order     after the five stages: the order the page counts as right
 *   1  Lead-in                     the answer inside the card ("What is a productive skill?")
 *   3  Six terms you'll need       the meaning inside each of the six cards
 *   4  Five task types             what each of the five is and what it is best for, inside its card
 *   6  Look again                  the answer inside each of the four question cards
 *                                  These are the page's own reveal cards: the stylesheet shows them in this print by
 *                                  itself (.reveal-card .a), open or shut, so nothing is written for them here.
 * Part 2 (prepare an opinion or story) and part 5 (the text to read) ask nothing the page holds an answer to, so none
 * is printed. Which task type a trainee would pick in part 4 is the trainee's own.
 *
 * WHERE THE ANSWERS COME FROM. Nothing is copied into this file.
 *   Part 6: the page's own lists (MONITORING, the one its buttons mark against, and CHOICES, the two labels on the
 *   buttons), read by name and placed by each sentence's own words. A sentence whose words are not in the list gets no
 *   line, nor does one whose right choice is not on exactly one of its own buttons: nothing is ever guessed. Every
 *   explanation opens with the name of its choice ("Task achievement: ...", "Language feedback, but positive. ..."), so
 *   the line is the explanation as the page words it, with the choice in bold where it opens the sentence.
 *   Part 7: the page's own list (CORRECT_ORDER, the one its lines are marked against), read by name; written only if
 *   every stage in it is one of the five lines on the page.
 *
 * Nothing the trainee did is touched: no choice is pressed, no card opened or shut, no stage placed. A sentence already
 * answered on the screen carries a tick or a cross and the explanation; that block is put aside for this print (the
 * page's print rule hides it anyway), so an answered sentence prints the same as an untouched one, and its answer is
 * said once. The page's print rule also prints the five stages without their numbers or the count, placed or not.
 */
SessionAnswers.register(function(A){
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var only = function(list, test){ var hit = list.filter(test); return hit.length === 1 ? hit[0] : null; };

  /* 6 · Content feedback, or language feedback? Each item of the list is { text, correct (0 or 1 in CHOICES), feedback }. */
  var mon = data(function(){ return MONITORING; }), choices = data(function(){ return CHOICES; });
  if (mon && mon.filter && choices && choices.length) A.each('#monitoring .scen', function(scen){
    var task = scen.querySelector('p:not(.fb)'); if (!task) return;
    var it = only(mon, function(x){ return x && norm(x.text) === norm(task.textContent); }); if (!it) return;
    var label = choices[it.correct]; if (typeof label !== 'string' || !label) return;
    /* the choice must be one of this sentence's own buttons; once a sentence is answered its buttons are gone, and
       the label is then checked against the page's own two */
    var btns = scen.querySelectorAll('[data-pick]');
    if (btns.length && [].filter.call(btns, function(b){ return b.textContent === label; }).length !== 1) return;
    if (!btns.length && choices.filter(function(c){ return c === label; }).length !== 1) return;
    var why = it.feedback == null ? '' : String(it.feedback), rest = why.slice(label.length);
    var said = why.indexOf(label) === 0 && /^[^A-Za-z]/.test(rest)
      ? '<b>' + esc(label) + '</b>' + esc(rest)
      : '<b>' + esc(label) + '.</b>' + (why ? ' ' + esc(why) : '');
    A.after(scen.querySelector('.opts') || task, said);
  });
  /* an answered sentence shows the same explanation with a tick or a cross; the line above already says it */
  A.hide('#monitoring .scen .fb');

  /* 7 · Debrief: the order of the stages */
  var order = data(function(){ return CORRECT_ORDER; }), box = document.querySelector('#order .ox');
  if (order && order.map && order.length && box) {
    var lines = [].map.call(box.querySelectorAll('.order-line'), function(b){ var s = b.querySelector('span:not(.num)'); return norm(s ? s.textContent : ''); });
    var ok = order.every(function(s){ return lines.filter(function(l){ return l === norm(s); }).length === 1; }) && lines.length === order.length;
    if (ok) A.after(box, order.map(function(s, i){ return '<b>' + (i + 1) + '</b> ' + esc(s); }).join(', '));
  }
});
