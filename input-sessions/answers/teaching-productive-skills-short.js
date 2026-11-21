/* Connect Lite — Teaching productive skills: one shape, two skills (the short session), printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs teaching-productive-skills-short <folder> shows what it prints).
 *
 * What "Print with the answers" writes on this session:
 *   3  Match each term to its meaning            under each of the eight meanings: its term, in bold
 *   6  Content feedback, or language feedback?   under each of the six things a teacher notices: the choice the page
 *                                                counts as right, in bold, and the page's own explanation
 *   8  Debrief: put the stages back in order     after the five stages: the order the page counts as right
 *   1  Lead-in                     the answer inside the card ("What is a productive skill?")
 *   4  Pick the right task type    what each of the ten task types is and what it is best for, inside its card
 *   6  Look again at the text      the answer inside each of the five question cards
 *                                  These are the page's own reveal cards: the stylesheet shows them in this print by
 *                                  itself (.reveal-card .a), open or shut, so nothing is written for them here.
 * Part 2 (prepare an opinion and a piece of writing), part 5 (the text to read) and part 7 (the table to read) ask
 * nothing the page holds an answer to, so none is printed. Which task type a trainee would pick in part 4 is the
 * trainee's own.
 *
 * WHERE THE ANSWERS COME FROM
 *   Part 3: the page's own markup. Each term's button and its meaning's button carry the same number (data-l on the
 *   term, data-r on the meaning: the pair the page itself locks as matched), so nothing is copied. A meaning gets a
 *   line only if exactly one term carries its number.
 *   Part 6: the page keeps the six scenarios inside the call that draws them, choices('scenarios', [...]), where this
 *   file cannot read them. So the right choice and the explanation of each are COPIED below, word for word, from that
 *   call in teaching-productive-skills-short/index.html (and its recipe, _short_recipes/teaching_productive_skills.py),
 *   under the scenario's own words. The two labels are the page's own list TL, read by name; the copy holds the
 *   number the page holds (correct: 0 or 1 in TL).
 *   Part 8: the right order is the first list in the page's call orderStages('order', [...], [...]), COPIED below.
 *   IF A SCENARIO, ITS RIGHT CHOICE, ITS EXPLANATION OR THE ORDER OF THE STAGES CHANGES ON THE PAGE, CHANGE IT HERE
 *   TOO, and run the check again. A scenario whose words are not in the table gets no line, nor does one whose right
 *   choice is not on exactly one of its own buttons; the order is written only if its five stages are exactly the five
 *   lines on the page. Nothing is ever guessed.
 *
 * Nothing the trainee did is touched: no term or choice is pressed, no card opened or shut, no stage placed. A
 * scenario already answered on the screen carries a tick or a cross and the explanation; that block is put aside for
 * this print, so an answered scenario prints the same as an untouched one, and its answer is said once. The page's own
 * print rule (21 Nov 2026) prints matched terms, picked choices and placed stages as they were untouched, without the
 * counts.
 */
SessionAnswers.register(function(A){
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var list = function(sel, root){ return [].slice.call((root || document).querySelectorAll(sel)); };

  /* COPIED from choices('scenarios', [...]): the scenario's words, the number of its right choice in TL, its feedback. */
  var SCEN = [
    ['Two pairs never actually decided on a restaurant: they got distracted and ran out of time.', 0, 'Task achievement: worth raising in feedback on the task itself, separate from any language point.'],
    ['Half the class said "I am agree" instead of "I agree."', 1, 'Language feedback: a common form error, worth a quick delayed correction slot with the whole class.'],
    ['A student went completely silent when it was their turn; their partner did all the talking.', 0, 'Task achievement / participation: worth noting for feedback, but it isn’t a language point.'],
    ['A complaint email is polite and accurate but never says what the writer wants done about it.', 0, 'Task achievement: the text didn’t do its job, whatever its accuracy.'],
    ['Four learners opened their formal letters with "Hey" before the greeting.', 1, 'Language feedback: register, and worth naming as register rather than as a mistake.'],
    ['One pair used "I would be grateful if you could" entirely naturally in their first draft.', 1, 'Language feedback: the positive kind. Good language noticed while monitoring is fed back too, not only errors.']
  ];
  /* COPIED from orderStages('order', [...], [...]): its first list, the order the page marks against. */
  var ORDER = ['Lead-in', 'Preparing to speak or write', 'Useful language', 'Task', 'Feedback'];

  /* 3 · Match each term to its meaning: under each meaning, the term that carries the same number. */
  A.each('#match [data-r]', function(mean){
    var terms = list('#match [data-l]').filter(function(t){ return t.getAttribute('data-l') === mean.getAttribute('data-r'); });
    if (terms.length === 1 && norm(terms[0].textContent)) A.after(mean, '<b>' + esc(norm(terms[0].textContent)) + '</b>');
  });

  /* 6 · Content feedback, or language feedback? */
  var labels = data(function(){ return TL; });
  if (labels && labels.length) A.each('#scenarios .scen', function(scen){
    var task = scen.querySelector('p.t'), opts = scen.querySelector('.opts'); if (!task || !opts) return;
    var hit = SCEN.filter(function(s){ return s[0] === norm(task.textContent); }); if (hit.length !== 1) return;
    var label = labels[hit[0][1]]; if (typeof label !== 'string' || !label) return;
    if (list('.opt', scen).filter(function(b){ return b.textContent === label; }).length !== 1) return;
    /* every explanation opens with the name of its choice ("Task achievement: ...", "Task achievement / participation:
       ..."), so the line is the explanation as the page words it, with the choice in bold where it opens the sentence */
    var why = hit[0][2], rest = why.slice(label.length);
    A.after(opts, why.indexOf(label) === 0 && /^[^A-Za-z]/.test(rest)
      ? '<b>' + esc(label) + '</b>' + esc(rest)
      : '<b>' + esc(label) + '.</b> ' + esc(why));
  });
  /* an answered scenario shows the same explanation with a tick or a cross; the line above already says it */
  A.hide('#scenarios .why');

  /* 8 · Debrief: the order of the stages */
  var box = document.getElementById('order');
  if (box) {
    var lines = list('.order-line', box).map(function(b){ var s = b.querySelector('span:not(.num)'); return norm(s ? s.textContent : ''); });
    var ok = lines.length === ORDER.length && ORDER.every(function(s){ return lines.filter(function(l){ return l === s; }).length === 1; });
    var last = list('.order-line', box).pop();
    if (ok && last) A.after(last, ORDER.map(function(s, i){ return '<b>' + (i + 1) + '</b> ' + esc(s); }).join(', '));
  }

  /* "Click to reveal" under a card whose answer is printed says nothing on this paper */
  A.hide('.reveal-card .hint');
});
