/* Connect Lite — Teaching one-to-one: every answer under its task, for "Print with the answers".
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs teaching-one-to-one <folder> shows what it prints).
 *
 * WHAT THE PRINT SHOWS, PART BY PART
 *   Will it transfer?         under each of the nine stages: the right option, in bold, and the page's own note (9)
 *   Better or worse           under each of the ten points: One-to-one or A group, in bold, and the note (10)
 *   Tuning in                 the table behind "Reveal answer" (who, where, when, what, how), shown as it stands;
 *                             under each of the eight statements: Need, Lack or Want, in bold, and the note (8)
 *   The first lesson          the seven stages in their order, then what the page says when "Show the order" is
 *                             pressed (1)
 *   Your roles                under each of the seven moments: the role, in bold, and the note (7)
 *   Correction                "He became the judge", behind "Reveal answer", shown; under each of the seven
 *                             moments: what to do, in bold, and the note (7); "One way to say each", shown
 *   The student as material   under each of the four steps: First to Fourth, in bold, and the note (4);
 *                             "Some that need no preparation", shown
 *   When it goes wrong        under each of the six situations: the right option, in bold, and the note (6)
 *   Your turn                 "Kaito, for example", behind "Reveal answer", shown
 *
 * WHERE EACH ANSWER COMES FROM
 *   The seven option tasks: the page builds them with buildTask(...) inside its own closure, where this file cannot
 *   read them. So the right option of each row is COPIED below, word for word, from the buildTask(...) calls in
 *   teaching-one-to-one/index.html (the names OK, CH, NO, ONE, GR, NE, LA, WA, TE, IN, LI, PA, CO, NOW, LATER, REF,
 *   LEAVE, F1 to F4 written out), under the row's own words as the page shows them. A row whose words are not in the
 *   table gets no line, and neither does one whose copied answer is not exactly one of its own buttons: nothing is
 *   guessed. IF A ROW OR ITS RIGHT OPTION CHANGES ON THE PAGE, CHANGE IT HERE TOO, and run the check again. The note
 *   is not copied: it is read from the page (the row's own .why), and that block is put aside for this print so it is
 *   said once.
 *   The first lesson: the order (FIRST, in the page's script) and the sentence its "Show the order" button writes are
 *   in the same closure, so both are COPIED below. The order is written only if the seven copied stages are exactly
 *   the page's own seven; if a stage is reworded, added or dropped on the page, nothing is written for this task.
 *   The five boxes behind "Reveal answer" (#tuneKey, #skiKey, #reformKey, #recycleKey, #yoursKey): the page's own,
 *   shown as they stand, open or shut.
 * Nothing the trainee did is touched: no option is pressed, no stage placed or taken out, no box opened or shut, the
 * typing stays. The page's print rules leave out what an answered task shows on screen (faded options, the order the
 * trainee built and its feedback), so an answered exercise prints the same as an untouched one.
 */
SessionAnswers.register(function(A){
  var KEY = {
    transferTask: {
      "Students compare their answers in pairs before you check them.": "Change it",
      "A mingle: \"Find someone who ...\"": "Won't work",
      "Peer correction: \"Can anyone help her?\"": "Won't work",
      "A gist question with a time limit before a reading.": "Works as it is",
      "You monitor from the back while students speak.": "Change it",
      "Choral drilling of a new phrase.": "Change it",
      "Concept checking questions.": "Works as it is",
      "Jigsaw reading: each student reads half and tells the other.": "Change it",
      "Setting homework for the next lesson.": "Works as it is"
    },
    betterTask: {
      "Going at the student's own pace.": "One-to-one",
      "Hearing other accents and other cultures.": "A group",
      "Switching off for a minute when tired.": "A group",
      "Dropping an activity that isn't working.": "One-to-one",
      "Honest feedback without losing face.": "One-to-one",
      "Practicing a meeting with several speakers.": "A group",
      "Making friends and practicing English after class.": "A group",
      "Learning fast.": "One-to-one",
      "The teacher listening as an outsider.": "A group",
      "Cost.": "A group"
    },
    nlwTask: {
      "He runs a weekly video call with the Chicago team.": "Need",
      "He mixes up the past simple and the present perfect.": "Lack",
      "He wants to talk, not do exercises.": "Want",
      "He can't follow two Americans talking fast.": "Lack",
      "He has to send a written summary after each call.": "Need",
      "He would like the lessons at 8 in the morning.": "Want",
      "He doesn't know the words for a delay or a penalty in a contract.": "Lack",
      "He'd like to talk about American football with the Chicago team.": "Want"
    },
    roleTask: {
      "You explain why \"I am here since May\" is wrong.": "Teacher",
      "You argue the other side in a discussion about working from home.": "Conversation partner",
      "Your student arrives upset after a call with his boss and talks for fifteen minutes.": "Sympathetic listener",
      "A fifteen-year-old has forgotten her homework again, and you agree a plan with her.": "Parent figure",
      "Your student tells you about a problem at home, in confidence.": "Confidant",
      "You play the supplier who won't lower the price.": "Conversation partner",
      "You show how the stress moves in photograph and photographer.": "Teacher"
    },
    corrTask: {
      "Paulo is telling you, with feeling, about a shipment that went wrong. He says, \"The container have arrive late.\"": "Note it for later",
      "Kaito is doing a gap fill for his exam and asks you to tell him at once when he is wrong.": "Correct it now",
      "Mrs. Haddad says, \"The book has very much sadness inside it in the end.\"": "Reformulate it",
      "A shy student, afraid to speak, tells you a long story about her weekend. You agreed this task was only for speaking.": "Leave it",
      "You agreed with a student that today you correct only comparatives. He says, \"It's more cheaper.\"": "Correct it now",
      "The same student, same lesson, says, \"I have 40 years.\"": "Leave it",
      "Paulo writes, \"We are in the situation of no possibility to deliver at the time.\"": "Reformulate it"
    },
    jobTask: {
      "You give him the words he was missing, and reformulate a few of his sentences.": "Third",
      "He explains how a delayed shipment is handled, as he would to a new colleague.": "First",
      "You listen and take notes, and record it on his phone if he agrees.": "Second",
      "The new words come back in the next lessons.": "Fourth"
    },
    troubleTask: {
      "Your student says, \"This exercise is useless.\"": "Ask what would be more useful, and change it",
      "Your student wants every mistake corrected, all the time.": "Agree on a version: some now, the rest noted for the end",
      "Your student is used to teachers who decide everything, and looks uneasy when you ask what she would like to do.": "Explain why you ask, and offer two choices",
      "Forty minutes into a 90-minute lesson at the end of his working day, Paulo is clearly tired.": "Switch to something lighter: talk, a walk, a different activity",
      "You find your student boring.": "Get him to teach you something he knows well",
      "A senior manager, used to running things, seems annoyed that you are in charge.": "Let him choose the topics and the order"
    }
  };
  /* FIRST, in the page's script: the first lesson in its order */
  var FIRST = [
    "A warm welcome and a little small talk",
    "His profile talked through: his job, his English, his week",
    "You tell him the same things about yourself",
    "Agree how you will work: what, how often, homework or not",
    "A first real task from his work, while you take notes",
    "Ten minutes on your notes: what went well, a few things to fix",
    "Something easy to end on, and something to take away"
  ];
  /* what the page's own "Show the order" writes under it (firstShow, in its script) */
  var FIRST_NOTE = "Getting to know each other comes first and goes both ways; the work starts once you have agreed how. The notes wait for the last ten minutes, and he leaves with something easy and something to keep.";

  var own = function(o, k){ return Object.prototype.hasOwnProperty.call(o, k); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var words = function(el){ return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; };

  /* the seven option tasks: the right option's own label, then the page's note, under the options */
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

  /* the first lesson: the seven stages, first to last, then the page's own note; only if they are the page's seven */
  var bank = document.getElementById('firstBank');
  if (bank) {
    var chips = [].map.call(bank.querySelectorAll('.chip'), function(c){ return c.textContent; });
    var same = chips.length === FIRST.length && FIRST.every(function(s){ return chips.filter(function(c){ return c === s; }).length === 1; });
    if (same) A.after(bank, '<ol style="margin:0 0 4px;padding-left:22px;font-weight:700;">' + FIRST.map(function(s){ return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>' + esc(FIRST_NOTE));
  }

  /* the five boxes behind "Reveal answer" */
  A.show('#tuneKey, #skiKey, #reformKey, #recycleKey, #yoursKey');
});
