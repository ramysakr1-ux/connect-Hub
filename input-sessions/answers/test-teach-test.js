/* Connect Lite — Test-teach-test: every answer under its task, for "Print with the answers".
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs test-teach-test <folder> shows what it prints).
 *
 * WHAT THE PRINT SHOWS, PART BY PART
 *   Test                 under each of the twenty sentences, the letter of its response, in bold, and the response (20)
 *   Teach                under each of the five sentences, the use the page counts as right, in bold; then the page's
 *                        own reason (5)
 *   Test again           under each of the ten sentences, the form the page counts as right, in bold; then the page's
 *                        own reason (10)
 *   What just happened   the box behind "Reveal answer"
 *   The stages           under each of the three stages, the words for its gaps, in the order of the gaps (6, on 3 lines)
 *   Which stage?         under each of the fourteen, the stage the page counts as right, in bold; the page's own reason
 *                        where it gives one (4); then the page's note on the three that do not belong (14)
 *   Which approach?      under each of the ten quotations, the approach the page counts as right, in bold; the page's
 *                        own reason where it gives one (4) (10)
 *   When it works        under each of the seven statements, True or False as the page counts it, in bold; then the
 *                        page's own reason (7)
 *   Your turn            "One way to do it", the box behind "Reveal answer"
 * The two boxes behind a button are .reveal-block and the reasons are .why: the stylesheet shows both in this print
 * without being asked. The deep end (agree or disagree) is opinion and Your turn's three boxes are the trainee's own
 * plan: the page keeps no right answer to either, so none is printed.
 *
 * WHERE EACH ANSWER COMES FROM
 *   Test: each sentence's own key in the markup (data-key on its pair of buttons, the one Check marks against), and
 *   the words of that response as they stand beside it.
 *   The stages: each dropdown's own key (data-key), the one Check marks against, said in the words of that dropdown's
 *   own option.
 *   The reasons, the two boxes and the note: the page's own blocks, shown.
 *   Teach, Test again, Which stage?, Which approach? and When it works: the page keeps the right option of each line
 *   inside the buildTask(...) calls that draw the lines, where this file cannot read it. So the right option of each
 *   line is COPIED below, word for word, from those five calls in test-teach-test/index.html, under the line's own
 *   words. IF A LINE OR ITS RIGHT ANSWER CHANGES ON THE PAGE, CHANGE IT HERE TOO, and run the check again. A line
 *   whose words are not in the table gets no answer, and neither does one whose copied answer is not on exactly one of
 *   its own buttons: nothing is ever guessed.
 *
 * Nothing the trainee did is touched: no option is pressed, no dropdown set, nothing opened or shut, no score moves,
 * and what was typed stays. The page's own print rules make every option the same plain word whatever was pressed, a
 * dropdown prints as a line to write on (library.js), and the scores do not print, so an answered page prints the same
 * as an untouched one and each answer is said once.
 */
SessionAnswers.register(function(A){
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var list = function(sel, root){ return [].slice.call((root || document).querySelectorAll(sel)); };
  var own = function(o, k){ return Object.prototype.hasOwnProperty.call(o, k); };
  var DOT = ' · ';

  /* COPIED from the five buildTask(...) calls: the line's words as the page shows them (without its number), and the
     option the page counts as right (answer). */
  var RIGHT = {
    usesTask: {
      'They’re always talking away in Arabic to each other when I arrive.': 'Always doing it (and it annoys me)',
      'What are you writing?': 'In progress now',
      'They’re usually having lunch at twelve thirty.': 'Regularly in progress around a time',
      'My sister’s living in Paris.': 'Temporary, for a period',
      'Mei’s coming from Auckland.': 'A future arrangement'
    },
    chooseTask: {
      'Sales of electric cars ___ these days.': 'are increasing',
      'I ___ my mother more or less once a month.': 'visit',
      'I’m out here on the balcony! I ___ the plants.': '’m watering',
      'Oh, sorry, I can’t come. I ___ my mother this weekend.': '’m visiting',
      'In this city people ___ suddenly in front of you on the pavement.': 'are always stopping',
      'She ___ around the park every morning at six.': 'runs',
      'On the coast, tourist numbers ___ dramatically every summer.': 'increase',
      'If you ___ plants too much, it’s bad for them.': 'water',
      'In Thailand people ___ when the national anthem starts playing.': 'always stop',
      'Don’t ask the trainees then: they ___ around in a last-minute flap at that time.': '’re usually running'
    },
    sortTask: {
      'Students fill gaps with a suitable word or structure.': 'A test (first, or the controlled second)',
      'Students discuss the answers to concept checking questions on a handout.': 'Teach',
      'Students read a text and answer gist questions.': 'Not in a test-teach-test lesson',
      'Students do a role-play.': 'The freer second test',
      'Students select the correct word or structure to complete a sentence from a choice.': 'A test (first, or the controlled second)',
      'Students draw their own timelines.': 'Teach',
      'Students conduct a survey.': 'The freer second test',
      'The teacher stands at the front and repeats the grammar rules.': 'Not in a test-teach-test lesson',
      'Students discuss the differences in meaning between similar sentences.': 'A test (first, or the controlled second)',
      'Students complete an information gap.': 'The freer second test',
      'Students arrange words or structures on a cline.': 'Teach',
      'Students write five random sentences using the target language.': 'Not in a test-teach-test lesson',
      'Students find matching responses for sentences from a choice.': 'A test (first, or the controlled second)',
      'Students do a discussion activity.': 'The freer second test'
    },
    whoTask: {
      '“By incorporating elements of discovery and problem solving, it fosters a collaborative atmosphere.”': 'Guided discovery',
      '“Some learners may find the approach dry and unmotivating.”': 'Test-teach-test',
      '“Its direct and uncompromising grammar focus suits adult students who are not put off by an analytical approach.”': 'Test-teach-test',
      '“It is an economical use of time, as students are communicating in English and it brings in other skills.”': 'Guided discovery',
      '“Sometimes there is a tendency for teachers to start lecturing the students.”': 'Test-teach-test',
      '“It encourages learners to take responsibility for their own learning.”': 'Guided discovery',
      '“The mental work involved in explaining grammar points to each other has a powerful effect on the memory.”': 'Guided discovery',
      '“It is economical of time, through getting straight to the point.”': 'Test-teach-test',
      '“In the absence of context, sentences may become leached of meaning, and the discussion of differences becomes theoretical and hard to grasp.”': 'Test-teach-test',
      '“It enables learners to see the patterns in English and to understand its use in their own language.”': 'Guided discovery'
    },
    whenTask: {
      'A test-teach-test lesson only works if the learners have met the language before, in texts, in listening, in life.': 'True',
      'The first test has to be a controlled exercise.': 'False',
      'If the first test shows that the whole class can use the language, you still teach the full teach stage.': 'False',
      'A test-teach-test lesson is harder to plan in full before the lesson than a PPP lesson.': 'True',
      'Test-teach-test suits a writing skills lesson.': 'False',
      'The second test should be like the first, so the difference can be seen.': 'True',
      'Beginners can never be taught with test-teach-test.': 'False'
    }
  };

  /* Test: under each sentence, the letter the page marks as right and the words of that response. The letter is only
     said if exactly one of the sentence's two buttons carries it and exactly one response of its pair starts with it. */
  A.each('#pairs .pair', function(pair){
    var resp = list('.resp', pair);
    list('.sent', pair).forEach(function(sent){
      var opts = sent.querySelector('.opts'), key = opts && opts.getAttribute('data-key'); if (!key) return;
      var btn = list('.opt', opts).filter(function(b){ return b.textContent === key; });
      var said = resp.filter(function(r){ var b = r.querySelector('b'); return b && b.textContent === key; });
      if (btn.length !== 1 || said.length !== 1) return;
      var c = said[0].cloneNode(true); list('b', c).forEach(function(x){ x.remove(); });   /* a copy is read; the page is not touched */
      A.line(sent, '<b>' + esc(key) + '.</b> ' + esc(norm(c.textContent)));
    });
  });

  /* Teach, Test again, Which stage?, Which approach?, When it works: straight under the line's options, the right one
     in bold. The page's own reason (.why) stands under it and is shown by the stylesheet. */
  Object.keys(RIGHT).forEach(function(id){
    A.each('#' + id + ' .qrow', function(row){
      var q = row.querySelector('.q'), opts = row.querySelector('.opts'); if (!q || !opts) return;
      var words = norm(q.textContent).replace(/^\d+\.\s*/, '');
      if (!own(RIGHT[id], words)) return;
      var hit = list('.opt', opts).filter(function(b){ return b.textContent === RIGHT[id][words]; });
      if (hit.length === 1) A.after(opts, '<b>' + esc(hit[0].textContent) + '</b>');
    });
  });

  /* The stages: under each stage, the words for its gaps, in the order the gaps stand. The answer of a gap is the
     words on its own option for the value the page counts as right; if one gap of a stage has none, the stage gets no
     line at all. */
  A.each('#gapTtt p', function(p){
    var sels = list('select.blank', p), said = [];
    sels.forEach(function(sel){
      var key = (sel.getAttribute('data-key') || '').toLowerCase();
      var hit = key ? [].filter.call(sel.options, function(o){ return o.value && o.value.toLowerCase() === key; }) : [];
      if (hit.length === 1) said.push('<b>' + esc(norm(hit[0].textContent)) + '</b>');
    });
    if (!sels.length || said.length !== sels.length) return;
    var line = A.after(p, said.join(DOT));
    if (line) line.style.marginBottom = '10px';
  });

  /* Which stage?: the page's own note on the three that do not belong, shown whether or not it is open on the screen */
  A.show('#sortNote');
});
