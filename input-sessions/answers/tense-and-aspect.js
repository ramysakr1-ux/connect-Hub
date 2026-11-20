/* Connect Lite — Tense and aspect: every answer under its task, for "Print with the answers".
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 20 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs tense-and-aspect <folder> shows what it prints).
 *
 * WHAT THE PRINT SHOWS, PART BY PART
 *   1  Time or tense?          under each of the nine sentences: the time, in bold, and the page's own note (9)
 *   2  The grid                under each of the eight cells: the form the page's Check marks against (8)
 *   3  Three families          the answer to Set A, Set B and Set C, behind "Reveal answer"
 *   4  The thirteen            under each of the thirteen examples: the meaning, in bold (13)
 *   5  What aspect adds        the six pairs, behind "Reveal answer"
 *   6  The futures             under each of the four sentences: what the form is doing, in bold (4)
 *   7  The passive             the sentence said the second way, behind "Reveal answer"; then under each of the four
 *                              statements: True or False, in bold, and the page's own note (4)
 *   8  A learner's sentences   the six corrections, behind "Reveal answer"
 *   9  Your turn               the worked example (I've been painting the kitchen), behind "Reveal answer"
 * The boxes behind a button are .reveal-block, which the stylesheet shows in this print without being asked.
 *
 * WHERE EACH ANSWER COMES FROM
 *   Parts 1, 4, 6 and the statements of 7: the page builds them with buildTask(...) and keeps the right option inside
 *   its own script, where this file cannot read it. So the right option of each row is COPIED below, word for word,
 *   from the buildTask(...) calls in tense-and-aspect/index.html (the names PA, NW, FU, AL, M.*, F1 to F4, T and F
 *   written out), under the row's own words as the page shows them. A row whose words are not in the table gets no
 *   line, and neither does one whose copied answer is not on one of its own buttons: nothing is ever guessed. IF A
 *   ROW OR ITS RIGHT OPTION CHANGES ON THE PAGE, CHANGE IT HERE TOO, and run the check again. The note is not copied:
 *   it is read from the page (the row's own .why), and that block is put aside for this print so it is said once.
 *   Part 2: each dropdown's own key (data-key), said in the words of its own option.
 *   Parts 3, 5, 7, 8 and 9: the page's own answer blocks, shown as they stand.
 *
 * Nothing the trainee did is touched: no option is pressed, no dropdown set, nothing opened or shut. A dropdown
 * prints as a line to write on whatever was chosen (library.js), and the page's print rule no longer fades the
 * other options of an answered row, so an answered exercise prints the same as an untouched one.
 */
SessionAnswers.register(function(A){
  var KEY = {
    timeTask: {
      "This session ends at 2.30.": "The future",
      "What was your name again?": "Now",
      "They’ll have arrived by now.": "Now",
      "Wood floats on water.": "All time",
      "Wish you were here!": "Now",
      "What are you doing after this session?": "The future",
      "I’d tell you if I knew.": "Now",
      "Stop it. You’re being silly.": "Now",
      "You’ve been drinking.": "Now"
    },
    thirteenTask: {
      "Present simple She drives to work every day.": "A habitual or regular action",
      "Present continuous I’m taking two days off next week.": "A definite future arrangement",
      "Present perfect I’ve won small amounts on the lottery twice.": "An experience at an indefinite time in the past",
      "Present perfect continuous Sorry I look such a mess. I’ve been painting the kitchen.": "A recent continuous activity, possibly unfinished, with a result in the present",
      "Past simple I bought some new shoes at the weekend.": "An action completed at a definite point in the past",
      "Past continuous When she came back into the room, the children were throwing jelly at each other.": "An activity in progress at a point in the past",
      "Past perfect They’d left by the time we got there.": "An action completed before another action or point in the past",
      "Past perfect continuous He’d been driving without a break for hours when the accident happened.": "An activity that began before a point in the past and continued up to it",
      "Going to Our mango tree’s going to have lots of fruit this year.": "A confident prediction based on something seen or felt in the present",
      "Will There’s the phone. I’ll get it.": "A spontaneous decision made at the time of speaking",
      "Future continuous Don’t ring then. We’ll be having a meeting.": "An activity in progress at a point in the future",
      "Future perfect The painters will have finished by Friday.": "An action looked back on as complete from a point in the future",
      "Future perfect continuous By the end of the month she’ll have been working here for a year.": "An action seen as continuing up to and still in progress at a point in the future"
    },
    futTask: {
      "Look at those clouds. It’s going to pour.": "A prediction from what they can see",
      "I’m meeting Yusuf at six; the table’s booked.": "An arrangement, fixed with other people",
      "Oh, you’re stuck? I’ll give you a hand.": "A decision made as they speak",
      "I’m going to learn to drive this year. I’ve decided.": "A plan or intention, decided already"
    },
    pasTask: {
      "We use the passive when the person who did it is unknown, obvious or unimportant.": "True",
      "The passive is more common in conversation than in writing.": "False",
      "In the passive, be carries the tense and the aspect, and the main verb is always a past participle.": "True",
      "A passive sentence needs a by-phrase.": "False"
    }
  };
  var own = function(o, k){ return Object.prototype.hasOwnProperty.call(o, k); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var words = function(el){ return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; };

  /* Parts 1, 4, 6 and 7: the right option's own label, then the page's note, under the options. */
  Object.keys(KEY).forEach(function(id){
    A.each('#' + id + ' .qrow', function(row){
      var q = row.querySelector('.q'), opts = row.querySelector('.opts'), why = row.querySelector('.why');
      if (!q || !opts) return;
      var said = A.txt(q.innerHTML).replace(/^\d+\.\s*/, '');            /* the row's words without its number */
      if (!own(KEY[id], said)) return;
      var ans = KEY[id][said];
      var hit = [].filter.call(opts.querySelectorAll('.opt'), function(b){ return b.textContent === ans; });
      if (hit.length !== 1) return;
      var note = why ? words(why) : '';
      A.after(opts, '<b>' + esc(hit[0].textContent) + '.</b>' + (note ? ' ' + esc(note) : ''));
    });
  });
  /* the note is in the line now; its own block would say it a second time */
  A.hide('.qrow .ans-line + .why');

  /* Part 2 · The grid: under each cell, the form its dropdown's key names, in the words of its own option. */
  A.each('#gridTable select.blank', function(sel){
    var key = (sel.getAttribute('data-key') || '').toLowerCase(), cell = sel.closest('td');
    var hit = [].filter.call(sel.options, function(o){ return o.value && o.value.toLowerCase() === key; });
    if (cell && hit.length === 1) A.line(cell, '<b>' + esc(words(hit[0])) + '</b>');
  });
});
