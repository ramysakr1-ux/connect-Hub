/* Connect Lite — Teaching mixed-ability classes: every answer under its task, for "Print with the answers".
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs mixed-ability-classes <folder> shows what it prints).
 *
 * WHAT THE PRINT SHOWS, PART BY PART
 *   2  Why classes are mixed      under each of the seven statements, the option the page counts as right, in bold,
 *                                 then the page's own note (7)
 *   3  Two trainees swap          under each of the seven things said, who said it, then the page's note where it has
 *                                 one (7)
 *   4  One text, three levels     under each of the three teachers, the level, then the page's note (3)
 *   5  What you can vary          under each of the ten, what is varied, then the page's note where it has one (10)
 *   6  Early finishers            under each of the four, the page's answer, then its note where it has one (4)
 *   7  Everyone in                under each of the six, the page's answer, then its note where it has one (6)
 *   8  What is realistic          under each of the six, True or False, then the page's note where it has one (6)
 *   9  Your turn                  the page's own example behind "Reveal answer" (#yoursKey, a .reveal-block, shown by
 *                                 the stylesheet) (1)
 * Part 1 (Your TP group: the four lines and the box) is the trainee's own group and a talk with a partner, and the
 * "Then in pairs" question in part 3 is discussion: the page holds no answer to either, so none is printed.
 *
 * WHERE THE ANSWERS COME FROM
 *   The notes: the page's own, already in each row (.why), shown by the stylesheet for this print. Nothing is copied.
 *   Part 9: the page's own box, shown by the stylesheet.
 *   The right option of each row: the page keeps its seven lists inside its own script's closure (the buildTask(...)
 *   calls), where this file cannot read them. So the right option of each of the 43 rows is COPIED below, word for
 *   word, from the answer of each item in those calls in mixed-ability-classes/index.html, under the row's own words
 *   (its q, as the page shows it, without the number in front). IF A ROW OR ITS RIGHT ANSWER CHANGES ON THE PAGE,
 *   CHANGE IT HERE TOO, and run the check again. A row whose words are not in the table gets no line, and neither
 *   does one whose copied answer is not on exactly one of its own buttons: nothing is ever guessed.
 *
 * Nothing the trainee did is touched: no option is pressed, nothing is opened or shut, the lines and the boxes stay
 * as they are. A row answered on the screen prints the same as an untouched one: the page's own print rule draws
 * every option the same on paper (21 Nov 2026), and the note prints whether or not it is open on the screen.
 */
SessionAnswers.register(function(A){
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var list = function(sel, root){ return [].slice.call((root || document).querySelectorAll(sel)); };

  /* COPIED from the seven buildTask(...) calls: [the row's words, the option the page counts as right]. */
  var KEY = {
    /* 2 · Why classes are mixed */
    whyTask: [
      ['The school groups students by age, not by level.', 'Makes the class mixed'],
      ['The teacher speaks too fast for some of them.', 'Something else'],
      ['The same group moves up together, course after course.', 'Makes the class mixed'],
      ['The placement test gave one overall level, but one student reads at B2 and speaks at A2.', 'Makes the class mixed'],
      ['The coursebook is a level too high for most of the class.', 'Something else'],
      ['The school has only three levels, so A2 and B1 share a class.', 'Makes the class mixed'],
      ['Two students joined late and missed the first four weeks.', 'Makes the class mixed']
    ],
    /* 3 · Two trainees swap */
    swapTask: [
      ['“With the other group I didn’t mind a bit of their own language. Now I keep it to an absolute minimum.”', 'Maria (now B2)'],
      ['“These learners can already say most of what they want to. My job is partly to give them other ways of saying it.”', 'Maria (now B2)'],
      ['“I got a real shock in the first lesson. I don’t think they understood anything I said. There was an easy activity and I just couldn’t get across what they had to do.”', 'Salim (now A1 to A2)'],
      ['“I have more activities in a lesson now, and they’re shorter. Pair work doesn’t last as long.”', 'Salim (now A1 to A2)'],
      ['“I really have to research the grammar now. They ask quite difficult questions, and the research makes me feel confident.”', 'Maria (now B2)'],
      ['“I had to remember to show them what to click on and where to type, not just tell them.”', 'Salim (now A1 to A2)'],
      ['“I can’t just chat to this group and find out about them so easily. I don’t think I have such good rapport.”', 'Salim (now A1 to A2)']
    ],
    /* 4 · One text, three levels */
    textTask: [
      ['Teacher A. “They’re at a party and overhear the story. The next day they tell it to a friend. They listened once, retold it in pairs, listened again for what they had forgotten, then discussed what in the way it was told made some parts easier to remember than others.”', 'Advanced'],
      ['Teacher B. “I put up pictures of the events: a party, two people meeting, a snowy airport, a wedding. They predicted the order, listened and checked. I played it two or three times with pair talk between, then gave out the transcript for one last listening.”', 'Elementary'],
      ['Teacher C. “I dictated four questions: where did they meet, where is Hana from, why couldn’t she fly, when did they marry. Played it, checked, replayed the hard bits. Then they listened for the phrases that helped the storytelling, and talked in pairs about a memorable moment of their own.”', 'Intermediate']
    ],
    /* 5 · What you can vary */
    tenTask: [
      ['The same reading text; group A turns the information into a chart, group B answers open questions, group C answers multiple-choice questions.', 'The task'],
      ['Four students get a newspaper article on the topic; four get a simplified reader; four get a short text you wrote yourself.', 'The content'],
      ['In the role-play, the police officers get their questions on a card; the witnesses have to find their own words.', 'The support or the role'],
      ['You give the instructions for the next task to the whole class, once, with a demonstration.', 'Nothing: everyone the same'],
      ['When a nervous student makes a mistake you note it for later; when a confident one makes the same mistake you stop him and ask him to try again.', 'Your response'],
      ['“Write up to twelve true sentences using these six words in three minutes.”', 'The task'],
      ['Students choose which of three grammar exercises to do.', 'The content'],
      ['While monitoring, you give one group a model answer to look at and ask another group how they could say it more precisely.', 'Your response'],
      ['The student who draws well leads the poster; the one who knows about engines explains the diagram before the class reads about it.', 'The support or the role'],
      ['Before a debate, group A gets a list of suggested arguments; group B has to come up with their own.', 'The support or the role']
    ],
    /* 6 · Early finishers */
    earlyTask: [
      ['Another eight gap-fill sentences from the workbook.', 'More of the same'],
      ['Turn four of the sentences into questions and ask your partner; note anything surprising.', 'A real challenge'],
      ['Write the eight sentences out again in your best handwriting.', 'More of the same'],
      ['Find the two sentences that could be said another way, and write the other way.', 'A real challenge']
    ],
    /* 7 · Everyone in */
    inTask: [
      ['Each group numbers its members one to four in secret; at the end you call a group and a number, and that person presents.', 'Keeps everyone in'],
      ['Ask the strongest student in each group to present first, so the others hear a model.', 'Leaves someone out'],
      ['Give the stronger students the role of chair, responsible for getting a contribution from everyone.', 'Keeps everyone in'],
      ['Give the weaker two the easy half of the presentation, the introduction and the thanks.', 'Leaves someone out'],
      ['Tell the groups the task is not complete until every member has written one point and can explain it.', 'Keeps everyone in'],
      ['Wait a few seconds before nominating anyone, so everyone has a chance to think of an answer.', 'Keeps everyone in']
    ],
    /* 8 · What is realistic */
    realTask: [
      ['Responding to individuals differently, as you monitor and give feedback, counts as differentiation.', 'True'],
      ['Differentiation means preparing a different worksheet for each student.', 'False'],
      ['There are times when the whole class should do exactly the same thing.', 'True'],
      ['A mixed-level class is always a problem to be solved.', 'False'],
      ['A flexible task is one that everyone can do, to a different extent.', 'True'],
      ['The ultimate differentiation is learners taking responsibility for their own learning.', 'True']
    ]
  };

  Object.keys(KEY).forEach(function(id){
    var rows = list('#' + id + ' .qrow');
    /* a list of more than one row carries "1. ", "2. " in front of each row's words; the page puts it there */
    var said = rows.map(function(row){ var q = row.querySelector('.q'); return q ? norm(q.textContent).replace(/^\d+\.\s*/, '') : ''; });
    rows.forEach(function(row, i){
      var hit = KEY[id].filter(function(k){ return k[0] === said[i]; });
      if (hit.length !== 1 || said.filter(function(s){ return s === said[i]; }).length !== 1) return;
      var opts = row.querySelector('.opts'); if (!opts) return;
      var b = list('.opt', opts).filter(function(x){ return x.textContent === hit[0][1]; });
      if (b.length !== 1) return;
      A.after(opts, '<b>' + esc(b[0].textContent) + '</b>');   /* after the options and before the row's own note */
    });
  });
  /* the notes (.why) and the example in part 9 (#yoursKey, a .reveal-block) are shown by the stylesheet */
});
