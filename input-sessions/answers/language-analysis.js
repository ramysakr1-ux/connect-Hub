/* Connect Lite — Language analysis: filling it in: every answer under its task, for "Print with the answers".
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 20 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs language-analysis <folder> shows what it prints).
 *
 * WHAT THE PRINT SHOWS, PART BY PART
 *   One page, three kinds   under each of the seven aims: the kind, in bold, and the page's own note (7)
 *   Name and marker         under the name task and the marker task: the right option, in bold, and the note (2);
 *                           the top of a filled-in block, behind "Show the top of a filled-in block"
 *   Meaning                 under the meaning task (1) and each of the six CCQs (6): the answer, in bold, and the note
 *   Form                    under "Build the form line": the line, in bold, as the page's "Show answer" says it;
 *                           the full form box, behind "Compare with a full form box"
 *   Pronunciation           under each of the four notes: the feature, in bold, and the note (4); the three boxes
 *                           filled in, behind "Show the three pronunciation boxes, filled in"
 *   Problems                under each of the eight problems: the box, in bold, and the note (8)
 *   Functional language     under each of the four exponents: the register, in bold, and the note (4); the three
 *                           patterns, behind "Show the patterns"
 *   Vocabulary              the row for commute, behind "Compare with one version"
 *   Source                  under each of the four sources: Accept it or Not enough, in bold, and the note (4)
 *   Before you submit       under each of the seven boxes of the spot task: the page's own feedback for it, the five
 *                           problems in bold, the two that are fine after a bold "Fine:", as the page says it (7)
 * The last check (the fourteen ticks) is the trainee's own check: there is no answer, so nothing is printed.
 *
 * WHERE EACH ANSWER COMES FROM
 *   The nine option tasks: the page builds them with buildTask(...) inside its own closure, where this file cannot
 *   read them. So the right option of each row is COPIED below, word for word, from the buildTask(...) calls in
 *   language-analysis/index.html (the names G, V, F, PF, PM, PFm, PP, LP, RF, RN, RI, OK, NO written out), under the
 *   row's own words as the page shows them. A row whose words are not in the table gets no line, and neither does one
 *   whose copied answer is not exactly one of its own buttons: nothing is guessed. IF A ROW OR ITS RIGHT OPTION
 *   CHANGES ON THE PAGE, CHANGE IT HERE TOO, and run the check again. The note is not copied: it is read from the
 *   page (the row's own .why), and that block is put aside for this print so it is said once.
 *   The form line: the words the page's own "Show answer" writes (formShow in the page's script), COPIED.
 *   The five boxes behind a button (.la-key): the page's own, shown as they stand.
 *   The spot task: each box's own data-f and data-w, read from the page.
 * Nothing the trainee did is touched: no option is pressed, no box opened or shut, no spot marked, the form line, the
 * typing and the ticks stay. The page's print rules leave out what an answered task shows on screen (faded options,
 * marked spots, the feedback lines, the ticks), so an answered exercise prints the same as an untouched one.
 */
SessionAnswers.register(function(A){
  var KEY = {
    kindTask: {
      "To introduce and practice the present perfect for experience, in the context of travel.": "Grammar",
      "To teach eight items of lexis for describing personality.": "Vocabulary",
      "To clarify and practice phrases for making suggestions, in the context of planning a night out.": "Functional language",
      "To develop reading for gist and detail, with a sub-aim of clarifying four items of lexis from the text.": "Vocabulary",
      "To teach phrasal verbs connected with daily routine.": "Vocabulary",
      "To clarify the difference between used to and would for past habits.": "Grammar",
      "To practice polite ways of interrupting in a meeting.": "Functional language"
    },
    nameTask: {
      "Which name belongs in Name of the structure?": "Present perfect simple for life experience, unspecified time; affirmative, negative and questions with ever"
    },
    markerTask: {
      "Which belongs in Marker sentence(s)?": "I’ve been to Italy."
    },
    conceptTask: {
      "Which belongs in Meaning analysis?": "An experience in my life. The time isn’t important."
    },
    ccqTask: {
      "Do I know exactly when?": "Good CCQ",
      "Am I talking about my whole life?": "Good CCQ",
      "Do we use the present perfect for experience?": "Not a good CCQ",
      "Have you ever been to Italy?": "Not a good CCQ",
      "Is everyone clear on that?": "Not a good CCQ",
      "Is the trip to Italy finished, or am I going next week?": "Good CCQ"
    },
    pronTask: {
      "I’ve BEEN to Italy.": "Sentence stress",
      "I have becomes I’ve /aɪv/": "Contraction",
      "been_to, lived_in: one word running into the next": "Linking",
      "to becomes /tə/, not /tuː/": "Weak form"
    },
    probTask: {
      "Ss may confuse been and gone.": "Meaning problems",
      "The video may not load.": "The lesson plan",
      "Ss may say I have went.": "Form problems",
      "Ss may stress have and lose the contraction.": "Pronunciation problems",
      "Faster students may finish the reading task early.": "The lesson plan",
      "Ss may say I have been to Italy in 2019.": "Meaning problems",
      "Ss may put ever after the participle: Have you been ever…?": "Form problems",
      "Breakout rooms may take too long to set up.": "The lesson plan"
    },
    regTask: {
      "Sorry to jump in, but… to a colleague in a team meeting": "Neutral",
      "Got a sec? to a friend at the next desk": "Informal",
      "I wonder if I might raise a point at this stage. to a board of directors": "Formal",
      "Can I just add something? to a teacher in class": "Neutral"
    },
    sourceTask: {
      "Swan, M. Practical English Usage, 4th ed., pp. 456 to 458": "Accept it",
      "The internet": "Not enough",
      "My coursebook": "Not enough",
      "Cambridge Dictionary online, the entry for exhausted": "Accept it"
    }
  };
  /* what the page's own "Show answer" under the form line writes (formShow, in its script) */
  var FORM_LINE = 'subject + have / has + past participle.';

  var own = function(o, k){ return Object.prototype.hasOwnProperty.call(o, k); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var words = function(el){ return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; };

  /* the nine option tasks: the right option's own label, then the page's note, under the options */
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
      var label = hit[0].textContent;
      A.after(opts, '<b>' + esc(label) + (/[.?!]$/.test(label) ? '' : '.') + '</b>' + (note ? ' ' + esc(note) : ''));
    });
  });
  /* the note is in the line now; its own block would say it a second time */
  A.hide('.qrow .ans-line + .why');

  /* the form line, as the page's own "Show answer" says it */
  var fb = document.getElementById('formFb');
  if (fb) A.after(fb, '<b>' + esc(FORM_LINE) + '</b>');

  /* the five boxes behind a button: the top of a block, the full form box, the pronunciation boxes, the patterns,
     the row for commute */
  A.show('.la-key');

  /* spot what's wrong: under each box, the page's own feedback for it */
  A.each('#spotArea .sp', function(sp){
    var w = sp.getAttribute('data-w'), f = sp.getAttribute('data-f'); if (!w || (f !== '1' && f !== '0')) return;
    A.line(sp.parentNode, f === '1' ? '<b>' + esc(w) + '</b>' : '<b>Fine:</b> ' + esc(w));
  });
});
