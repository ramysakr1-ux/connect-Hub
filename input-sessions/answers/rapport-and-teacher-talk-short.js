/* Connect Lite — Rapport, and how much you talk (the short session), printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs rapport-and-teacher-talk-short <folder> shows what it prints).
 *
 * What "Print with the answers" writes on this session:
 *   2  Count the talk             under each of the nine lines: who says it, Teacher or Student, in bold (9); then the
 *                                 split the page shows after "Check, and show the split" (the teacher's share, the
 *                                 word counts and the page's comment), shown where it stands on the page
 *   3  Grading, not dumbing down  under each of the three situations: the option the page counts as right, in bold,
 *                                 and the page's own explanation (3)
 *   4  Rapport, or being liked?   under each of the five things a teacher does: the choice the page counts as right,
 *                                 in bold, and the page's own explanation (5)
 *   5  Involved at the front      the note inside each of the five cards. These are the page's own reveal cards: the
 *                                 stylesheet shows them in this print by itself (.reveal-card .a), open or shut, so
 *                                 nothing is written for them here.
 * Part 1 (the teacher you remember) and part 6 (the wrap-up) are the trainee's own, and so is the guess in part 2: the
 * page holds no answer to them, so none is printed.
 *
 * WHERE THE ANSWERS COME FROM
 *   Part 2: the page's own list (TRANSCRIPT, the one its T and S buttons are marked against), top-level in its script,
 *   read by name and placed by each line's own words. "Teacher" and "Student" are the names the page gives its own two
 *   buttons. The split is the page's own block (#split), which it works out from the same list when it loads.
 *   Parts 3 and 4: the page keeps these lists inside the calls that draw the scenarios, where this file cannot read
 *   them. So the right option and the explanation of each scenario are COPIED below, word for word, from
 *   choices('grading', [...]) and choices('rapport', [...]) in rapport-and-teacher-talk-short/index.html (and its
 *   recipe, _short_recipes/rapport_and_teacher_talk.py), under the scenario's own words: eight scenarios, each with
 *   its right option (choices[correct]) and its feedback (and, for Grading item 3, the second option the page counts
 *   as right too, its "also": 22 Nov 2026). IF A SCENARIO, ITS RIGHT OPTION OR ITS EXPLANATION CHANGES
 *   ON THE PAGE, CHANGE IT HERE TOO, and run the check again. A scenario whose words are not in the table gets no
 *   line, and neither does one whose copied answer is not on exactly one of its own buttons: nothing is ever guessed.
 *
 * Nothing the trainee did is touched: no line is marked, nothing is checked, no option pressed, no card opened or shut,
 * the guess and the wrap-up are left alone. A scenario already answered on the screen carries a tick or a cross and
 * the explanation, and a checked count carries what the page says about the guess; those are put aside for this print
 * (the page's own print rule already takes "Right", "Wrong" and the colors off the paper), so an answered page prints
 * the same as an untouched one, and every answer is said once.
 */
SessionAnswers.register(function(A){
  /* the page's list is top-level in its own script, so it is read by name; if it is missing, nothing is written */
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var list = function(sel, root){ return [].slice.call((root || document).querySelectorAll(sel)); };

  /* 2 · Count the talk. Each item of the page's list is [who: 'T' or 'S', the words]. */
  var lines = data(function(){ return TRANSCRIPT; });
  if (lines && lines.filter) A.each('#talk .tline', function(row){
    var say = row.children[row.children.length - 1]; if (!say || say.classList.contains('ts')) return;
    var c = say.cloneNode(true);                       /* a copy is read, without "Right" or "Wrong"; the page is not touched */
    list('.tag', c).forEach(function(x){ x.remove(); });
    var hit = lines.filter(function(l){ return l && norm(l[1]) === norm(c.textContent); });
    if (hit.length !== 1) return;
    /* the name is the page's own: the label of this line's own T or S button */
    var b = list('.ts button', row).filter(function(x){ return x.textContent === hit[0][0]; });
    var name = b.length === 1 ? b[0].getAttribute('aria-label') : '';
    if (name) A.line(say, '<b>' + esc(name) + '</b>');
  });
  /* the split, shown whether or not the count has been checked; what the page says about the trainee's guess is not an answer */
  A.show('#split');
  A.hide('#guessSay');

  /* COPIED from choices('grading', [...]) and choices('rapport', [...]): the scenario's words, the option the page
     counts as right (choices[correct]), and its feedback. */
  var COPIED = {
    grading: [
      ['Setting up a pairwork task with a pre-intermediate class.',
       '“Work in pairs. Talk about your weekend. Three minutes.”',
       'The second. The first is padded with hedges a pre-intermediate learner has to unpick before finding the instruction. The third is the trap: it is shorter, but it is not English. Grading your language means making it simpler AND keeping it natural, not speaking a broken version of it.'],
      ['Explaining what “commute” means to an A2 class.',
       '“It’s the journey you make to work, usually every day.”',
       'The first. The second is accurate and completely out of reach. The third is a string of words, not a sentence: the learner has to assemble the meaning themselves and has no model to copy.'],
      ['A learner says “I am agree with you.” You want to respond in the moment without stopping the discussion.',
       '“I agree with you. Good. Carry on.”',
       'The first: a natural, accurate recast that models the form without a grammar lecture mid-discussion. The second stops the conversation dead. The third is fine too, and often right; but a recast costs nothing and keeps the floor with the learner.',
       /* 22 Nov 2026 (Ramy: "fix that one"): the page now counts the third option as right too (its "also"), so both are printed in bold */
       ['Say nothing and note it for delayed correction.']]
    ],
    rapport: [
      ['You arrive five minutes early and chat to the two students already there about their journey in.',
       'Builds rapport',
       'Builds it. Cambridge’s own wording is “interact naturally with learners before, during and after the lesson”: before and after are in the criterion for a reason.'],
      ['You praise every answer with “Great!”, “Perfect!”, “Well done!”, including the wrong ones.',
       'Just being liked',
       'Just being liked, and it stops meaning anything. Praise that is given for everything carries no information, and learners work out very fast that it is automatic.'],
      ['You use learners’ names while teaching, not only when taking the register, and you have checked how each one is pronounced.',
       'Builds rapport',
       'Builds it, and it is the cheapest thing on this list. Getting a name wrong for four weeks is a harder thing to undo than most trainees realize.'],
      ['A learner gives a long, halting answer. You wait, keep eye contact, and let them finish.',
       'Builds rapport',
       'Builds it. Waiting is a rapport move and a TTT move at once: filling the silence is the single most common way trainees take the floor back.'],
      ['You tell the class a long, funny story about your own weekend to warm them up.',
       'Just being liked',
       'Careful. A short personal example gives learners something to respond to; a long one is teacher talk with a smile on it. The test is whether it hands the floor over or keeps it.']
    ]
  };

  /* 3 · Grading, and 4 · Rapport, or being liked? Under each scenario: the right option, in bold, then the explanation. */
  Object.keys(COPIED).forEach(function(id){
    A.each('#' + id + ' .scen', function(scen){
      var task = scen.querySelector('.t'); if (!task) return;
      var it = COPIED[id].filter(function(k){ return k[0] === norm(task.textContent); });
      if (it.length !== 1) return;
      var hit = list('.opt', scen).filter(function(b){ return b.textContent === it[0][1]; });
      if (hit.length !== 1) return;
      var label = hit[0].textContent, why = it[0][2], rest = why.slice(label.length);
      /* 22 Nov 2026: a scenario with a second right option (the fourth entry, the page's "also") prints both in bold, then
         the explanation. Each must be on exactly one of the scenario's own buttons, or the scenario gets no line. */
      var more = it[0][3] || [], found = more.filter(function(m){ return list('.opt', scen).filter(function(b){ return b.textContent === m; }).length === 1; });
      if (found.length !== more.length) return;
      var dot = function(t){ return '<b>' + esc(t) + (/[.!?”]$/.test(t) ? '' : '.') + '</b>'; };
      if (more.length) { A.line(scen, [label].concat(more).map(dot).join(' Or: ') + ' ' + esc(why)); return; }
      /* an explanation that opens with the name of its choice ("Just being liked, and it ...") is written as the page
         words it, with the choice in bold where it opens the sentence; otherwise the option, then the explanation */
      A.line(scen, why.indexOf(label) === 0 && /^[^A-Za-z]/.test(rest)
        ? '<b>' + esc(label) + '</b>' + esc(rest)
        : '<b>' + esc(label) + (/[.!?”]$/.test(label) ? '' : '.') + '</b> ' + esc(why));
    });
  });
  /* an answered scenario shows the same explanation with a tick or a cross; the line above already says it */
  A.hide('#grading .why, #rapport .why');

  /* 5 · Involved at the front: the cards are shown by the stylesheet; "Click to reveal" is for the screen */
  A.hide('.reveal-card .hint');
});
