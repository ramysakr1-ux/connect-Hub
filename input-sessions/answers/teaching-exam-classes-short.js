/* Connect Lite — Teaching exam classes (the short session), printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs teaching-exam-classes-short <folder> shows what it prints).
 *
 * What "Print with the answers" writes on this session:
 *   2  Decode the acronyms   under the two columns: each of the eleven terms in bold, then its meaning (11)
 *   4  Which exam?           under each of the five corridor questions: the exam the page counts as right, in bold,
 *                            then the page's own explanation (5)
 *   5  Being an examiner     what stands inside each of the two cards. These are the page's own reveal cards: the
 *                            stylesheet shows them in this print by itself (.reveal-card .a), open or shut, so
 *                            nothing is written for them here.
 * Part 1 (the CEFR ladder) and part 3 (the exam explorer) are to read, and the page's own print rule already opens
 * every rung and every exam on paper. Their questions (a learner from your own TP at each level; the exam you would
 * least like to teach) and the three of the wrap-up (part 6) are the trainee's own: the page holds no answer to them,
 * so none is printed.
 *
 * WHERE THE ANSWERS COME FROM
 *   The page keeps both lists inside the calls that draw the tasks, where this file cannot read them. So they are
 *   COPIED below, word for word, from teaching-exam-classes-short/index.html (and its recipe,
 *   _short_recipes/teaching_exam_classes.py):
 *     TERMS   from matchTerms('match', [...]): the eleven terms, each with its meaning
 *     PICKS   from choices('scenarios', [...]): the five questions, each with the option the page counts as right
 *             (choices[correct]) and its feedback
 *   IF A TERM, A MEANING, A QUESTION, ITS RIGHT OPTION OR ITS FEEDBACK CHANGES ON THE PAGE, CHANGE IT HERE TOO, and
 *   run the check again. The terms are written only if every copied term and every copied meaning is on the page
 *   exactly once, on the task's own buttons, and the page holds no more; a question whose words are not in the table
 *   gets no line, and neither does one whose copied answer is not on exactly one of its own buttons: nothing is ever
 *   guessed.
 *
 * Nothing the trainee did is touched: nothing is pressed, matched, picked, opened or shut. A question already answered
 * on the screen carries a tick or a cross and the same explanation; that is put aside for this print, and the page's
 * own print rules put matched terms and a picked question back on paper as they were untouched, so an answered page
 * prints the same as an untouched one and every answer is said once.
 */
SessionAnswers.register(function(A){
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var list = function(sel, root){ return [].slice.call((root || document).querySelectorAll(sel)); };
  var texts = function(sel){ return list(sel).map(function(e){ return norm(e.textContent); }); };
  /* every item of the list is on the page exactly once, and the page holds no more than the list */
  var fits = function(items, onPage){
    return items.length > 0 && items.length === onPage.length && items.every(function(s){ return onPage.filter(function(t){ return t === norm(s); }).length === 1; });
  };

  /* COPIED from matchTerms('match', [...]): the term, and its meaning. */
  var TERMS = [
    ['CEFR', 'Common European Framework of Reference for Languages'],
    ['YLE', 'Young Learners English (Starters, Movers, Flyers)'],
    ['KET', 'Key English Test, now called A2 Key'],
    ['PET', 'Preliminary English Test, now called B1 Preliminary'],
    ['FCE', 'First Certificate in English, now called B2 First'],
    ['CAE', 'Certificate in Advanced English, now called C1 Advanced'],
    ['CPE', 'Certificate of Proficiency in English, now called C2 Proficiency'],
    ['IELTS', 'International English Language Testing System'],
    ['TOEFL', 'Test of English as a Foreign Language'],
    ['PTE', 'Pearson Test of English'],
    ['TKT', 'Teaching Knowledge Test']
  ];
  /* COPIED from choices('scenarios', [...]): the question's words, the option the page counts as right
     (choices[correct]), and its feedback. */
  var PICKS = [
    ['“I’m 9 and I want to learn English through games, nothing scary!”',
     'YLE (Starters / Movers)',
     'Young Learners exams are built for this age: shields, not grades, and tasks that feel like play.'],
    ['“I want to study for a Bachelor’s degree in the United States.”',
     'TOEFL iBT',
     'TOEFL is the exam US universities know best; IELTS is widely accepted too, but TOEFL is the safe first answer.'],
    ['“I need a fast result: I have a visa deadline in one week and I’m comfortable on a computer.”',
     'PTE Academic',
     'PTE results usually land inside 48 hours, and it is accepted for most visa routes.'],
    ['“I’m B2 and I want a widely recognized certificate that doesn’t expire.”',
     'B2 First',
     'Cambridge certificates do not expire; IELTS and TOEFL scores are usually only accepted for two years.'],
    ['“I’m moving to the UK for a skilled worker visa and need an official score. Face-to-face speaking is fine.”',
     'IELTS',
     'IELTS for UKVI is the standard route, and its speaking test is a live interview.']
  ];

  /* 2 · Decode the acronyms: under the two columns, each term in bold, then its meaning. */
  var match = document.querySelector('#match .pill-match-wrap');
  if (match && fits(TERMS.map(function(t){ return t[0]; }), texts('#match [data-l]'))
            && fits(TERMS.map(function(t){ return t[1]; }), texts('#match [data-r]'))) {
    var at = match;
    TERMS.forEach(function(t){ at = A.after(at, '<b>' + esc(t[0]) + ':</b> ' + esc(t[1])) || at; });
  }

  /* 4 · Which exam? Under each question: the right option, in bold, then the explanation. */
  A.each('#scenarios .scen', function(scen){
    var task = scen.querySelector('.t'); if (!task) return;
    var it = PICKS.filter(function(k){ return k[0] === norm(task.textContent); });
    if (it.length !== 1) return;
    var hit = list('.opt', scen).filter(function(b){ return b.textContent === it[0][1]; });
    if (hit.length !== 1) return;
    A.line(scen, '<b>' + esc(hit[0].textContent) + '.</b> ' + esc(it[0][2]));
  });
  /* an answered question shows the same explanation with a tick or a cross; the line above already says it */
  A.hide('#scenarios .why');

  /* 5 · Being an examiner: the cards are shown by the stylesheet; "Click to reveal" is a word for the screen */
  A.hide('.reveal-card .hint');
});
