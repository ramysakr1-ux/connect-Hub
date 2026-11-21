/* Connect Lite — Teaching writing: product, process, and the difference it makes (the short session), printed with
 * its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs teaching-writing-short <folder> shows what it prints).
 *
 * What "Print with the answers" writes on this session:
 *   3  Match each term to a real example     under each of the six examples: its term, in bold
 *   6  Product move, or process move?        under each of the four things a teacher might do: the choice the page
 *                                            counts as right, in bold, and the page's own explanation
 *   7  Debrief: put the stages back in order after the five stages: the order the page counts as right
 *   4  Pick the right task type    what each of the five task types is and what it is best for, inside its card
 *   6  Look again                  the answer inside each of the four question cards
 *                                  These are the page's own reveal cards: the stylesheet shows them in this print by
 *                                  itself (.reveal-card .a), open or shut, so nothing is written for them here.
 * Part 1 (the film and its two questions), part 2 (a piece of writing of your own) and part 5 (the text to read) ask
 * nothing the page holds an answer to, so none is printed. Which task type a trainee would pick in part 4 is the
 * trainee's own.
 *
 * WHERE THE ANSWERS COME FROM
 *   Part 3: the page's own markup. Each term's button and its example's button carry the same number (data-l on the
 *   term, data-r on the example: the pair the page itself locks as matched), so nothing is copied. An example gets a
 *   line only if exactly one term carries its number.
 *   Part 6: the page keeps the four moves inside the call that draws them, choices('moves', [...]), where this file
 *   cannot read them. So the right choice and the explanation of each are COPIED below, word for word, from that call
 *   in teaching-writing-short/index.html (and its recipe, _short_recipes/teaching_writing.py), under the move's own
 *   words. The two labels are the page's own list PP, read by name; the copy holds the number the page holds
 *   (correct: 0 or 1 in PP).
 *   Part 7: the right order is the first list in the page's call orderStages('order', [...], [...]), COPIED below.
 *   IF A MOVE, ITS RIGHT CHOICE, ITS EXPLANATION OR THE ORDER OF THE STAGES CHANGES ON THE PAGE, CHANGE IT HERE TOO,
 *   and run the check again. A move whose words are not in the table gets no line, nor does one whose right choice is
 *   not on exactly one of its own buttons; the order is written only if its five stages are exactly the five lines on
 *   the page. Nothing is ever guessed.
 *
 * Nothing the trainee did is touched: no term or choice is pressed, no card opened or shut, no stage placed. A move
 * already answered on the screen carries a tick or a cross and the explanation; that block is put aside for this
 * print, so an answered move prints the same as an untouched one, and its answer is said once. The page's own print
 * rule (21 Nov 2026) prints matched terms, picked choices and placed stages as they were untouched, without the
 * counts.
 */
SessionAnswers.register(function(A){
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var list = function(sel, root){ return [].slice.call((root || document).querySelectorAll(sel)); };

  /* COPIED from choices('moves', [...]): the move's words, the number of its right choice in PP, its feedback. */
  var MOVES = [
    ['Learners read a sample cover letter, label its sections, then write their own following the same structure.', 0, 'Product move: studying and imitating a model text’s structure.'],
    ['Learners write a first draft of a complaint email, get feedback from the teacher, then rewrite it before submitting.', 1, 'Process move: drafting and redrafting based on feedback rather than stopping at the first attempt.'],
    ['Before the final version, partners swap drafts and suggest one thing to add and one thing to cut.', 1, 'Process move: peer feedback between drafts is a core process-approach stage.'],
    ['The task specifies the writing must follow the exact layout of a formal letter, with a fixed opening and closing.', 0, 'Product move: matching a fixed genre format is the defining feature of a product approach.']
  ];
  /* COPIED from orderStages('order', [...], [...]): its first list, the order the page marks against. */
  var ORDER = ['Lead-in', 'Preparing to write', 'Useful language', 'Task', 'Feedback'];

  /* 3 · Match each term to a real example: under each example, the term that carries the same number. */
  A.each('#match [data-r]', function(mean){
    var terms = list('#match [data-l]').filter(function(t){ return t.getAttribute('data-l') === mean.getAttribute('data-r'); });
    if (terms.length === 1 && norm(terms[0].textContent)) A.after(mean, '<b>' + esc(norm(terms[0].textContent)) + '</b>');
  });

  /* 6 · Product move, or process move? */
  var labels = data(function(){ return PP; });
  if (labels && labels.length) A.each('#moves .scen', function(scen){
    var task = scen.querySelector('p.t'), opts = scen.querySelector('.opts'); if (!task || !opts) return;
    var hit = MOVES.filter(function(s){ return s[0] === norm(task.textContent); }); if (hit.length !== 1) return;
    var label = labels[hit[0][1]]; if (typeof label !== 'string' || !label) return;
    if (list('.opt', scen).filter(function(b){ return b.textContent === label; }).length !== 1) return;
    /* every explanation opens with the name of its choice ("Product move: ...", "Process move: ..."), so the line is
       the explanation as the page words it, with the choice in bold where it opens the sentence */
    var why = hit[0][2], rest = why.slice(label.length);
    A.after(opts, why.indexOf(label) === 0 && /^[^A-Za-z]/.test(rest)
      ? '<b>' + esc(label) + '</b>' + esc(rest)
      : '<b>' + esc(label) + '.</b> ' + esc(why));
  });
  /* an answered move shows the same explanation with a tick or a cross (and an untouched one an empty line); the
     line above already says it */
  A.hide('#moves .why');

  /* 7 · Debrief: the order of the stages */
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
