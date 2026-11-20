/* Connect Lite — The flipped classroom: every answer under its task, for "Print with the answers".
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs flipped-classroom <folder> shows what it prints).
 *
 * WHAT THE PRINT SHOWS, PART BY PART
 *   Read             under each of the seven parts of the article, its heading, in bold (7)
 *   Check            "The six", the box behind "Reveal answer": True or False for each of the six predictions, with
 *                    the page's own reason. The predictions themselves (Predict) are answered here and nowhere else.
 *   Flip a page      "One way", the box behind "Reveal answer"
 *   When they don't  under each of the four learners, what the page counts as right, in bold; then the page's own
 *                    reason (4)
 *   This course      under each of the six parts of the course, Before we meet or In the room as the page counts it,
 *                    in bold; then the page's own reason (6)
 *   Your turn        "A reading TP, flipped", the box behind "Reveal answer"
 * The three boxes behind a button are .reveal-block and the reasons are .why: the stylesheet shows both in this print
 * without being asked. At school, "In one line" and the boxes of Flip a page and Your turn are the trainee's own
 * words: the page keeps no right answer to them beyond the two suggested ones above, so none is printed.
 *
 * WHERE EACH ANSWER COMES FROM
 *   Read: each dropdown's own key in the markup (data-key, the one Check marks against), said in the words of that
 *   dropdown's own option. A part whose key is not on exactly one of its own options gets no line.
 *   Check, Flip a page, Your turn and the reasons: the page's own blocks, shown.
 *   When they don't and This course: the page keeps the right option of each line inside the buildTask(...) calls
 *   that draw the lines, where this file cannot read it. So the right option of each line is COPIED below, word for
 *   word, from those two calls in flipped-classroom/index.html, under the line's own words. IF A LINE OR ITS RIGHT
 *   ANSWER CHANGES ON THE PAGE, CHANGE IT HERE TOO, and run the check again. A line whose words are not in the table
 *   gets no answer, and neither does one whose copied answer is not on exactly one of its own buttons: nothing is
 *   ever guessed.
 *
 * Nothing the trainee did is touched: no option is pressed, no dropdown set, nothing opened or shut, and what was
 * typed stays. The page's own print rules make every option the same plain word whatever was pressed, a dropdown
 * prints as a line to write on (library.js), and the score does not print, so an answered page prints the same as an
 * untouched one and each answer is said once.
 */
SessionAnswers.register(function(A){
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var list = function(sel, root){ return [].slice.call((root || document).querySelectorAll(sel)); };
  var own = function(o, k){ return Object.prototype.hasOwnProperty.call(o, k); };

  /* COPIED from the two buildTask(...) calls that carry answers: the line's words as the page shows them (without its
     number), and the option the page counts as right (answer). */
  var RIGHT = {
    nobodyTask: {
      'Dilara read the text on the bus and did the gist task, but not the grammar box.': 'Pair them with someone who did it',
      'Marco opened nothing. Second week running.': 'They do the input now, in class',
      'Nineteen of twenty-two did nothing. The folder link had expired on Saturday.': 'Change the flip for next time',
      'Priya did it all, including the writing you had not set.': 'Carry on; the lesson covers it'
    },
    courseTask: {
      'The pre-course task.': 'Before we meet',
      'An input session like this one.': 'In the room',
      'The TP point and the lesson plan.': 'Before we meet',
      'TP feedback.': 'In the room',
      'The written assignments.': 'Before we meet',
      'The demonstration lesson on day one.': 'In the room'
    }
  };

  /* Read: under the head of each part, the heading the page marks as right, in the words of the dropdown's own option. */
  A.each('#reading .part', function(part){
    var hd = part.querySelector('.hd'), sel = part.querySelector('select.blank'); if (!hd || !sel) return;
    var key = sel.getAttribute('data-key'); if (!key) return;
    var hit = [].filter.call(sel.options, function(o){ return o.value && o.value === key; });
    if (hit.length === 1) A.after(hd, '<b>' + esc(norm(hit[0].textContent)) + '</b>');
  });

  /* When they don't, and This course: straight under the line's options, the right one in bold. The page's own reason
     (.why) stands under it and is shown by the stylesheet. */
  Object.keys(RIGHT).forEach(function(id){
    A.each('#' + id + ' .qrow', function(row){
      var q = row.querySelector('.q'), opts = row.querySelector('.opts'); if (!q || !opts) return;
      var words = norm(q.textContent).replace(/^\d+\.\s*/, '');
      if (!own(RIGHT[id], words)) return;
      var hit = list('.opt', opts).filter(function(b){ return b.textContent === RIGHT[id][words]; });
      if (hit.length === 1) A.after(opts, '<b>' + esc(hit[0].textContent) + '</b>');
    });
  });
});
