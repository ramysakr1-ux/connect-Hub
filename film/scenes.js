/* Connect Lite — the film, scene by scene.
   © 2026 Ramy Sakr.

   The spec is DEMO-ANIMATION-SPEC.md. This file is the spec made executable:
   every scene names a real screen and drives it. Re-timing the film is
   editing numbers here, not re-rendering anything.

   WHO A SCENE IS
     course: 'demo'      the running demo, c3      (?k=)   -- default
             'scratch'   the empty course, c5      (?s=)
             'finished'  the completed demo, c4    (?fk=)
     role:   'tutor'     the course's tutor key             -- default
             'trainee'   that candidate's own token, with `as: 'Their Name'`
             'assessor'  the course's read-only key
   The token and the assessor key are looked up from the store with READ ops,
   so only the three tutor keys go on the film's URL.

   STEPS
     {do:'caption', text}             one line, floats up, holds, fades
     {do:'move',   to:sel}            glide the cursor there
     {do:'click',  on:sel}            glide, then click
     {do:'type',   into:sel, text, ms}
     {do:'scroll', to:'bottom'|px, ms}
     {do:'hold',   ms}
     {do:'goto',   screen, role, as}  same scene, another screen or person
     {do:'still',  want, how, ms}     a frame that is not Lite, or a PDF

   A selector is CSS, or `text:Some words` to find a control by what it says.

   WRITES. A scene lists in `stub` the ops that must never really happen.
   The demo courses are what a prospect will be sent, so nothing on them may
   be altered by a take: their scenes stub `put` (the record write) and the
   engine always holds HubSync's flush. The SCRATCH course is the exception --
   scene 3 and 4 really write, because setting a course up is the thing being
   shown, and `node store/scratch-course.mjs --reset` puts it back.

   PRINTING. The print buttons call window.print(), a browser dialog the film
   cannot drive and which would stop it dead. Every PDF beat is therefore a
   `still` to be captured by hand -- the spec's build notes say the same.
*/

var SCENES = [

  /* THREE CHAPTERS, EACH OPENING ON ITS OWN LINK.

     Ramy, 27 Sep 2026: "we don't have to have an overture. It could be a big
     title \u2014 the assessor link \u2014 and then it shows the assessor. The trainee
     shows the trainee link again. So we don't have to build something new."

     So there is no separate introduction. Each chapter opens with a title
     card, then the invitation card for that person, then what they do. The
     card is the same design three times over and only the words change, which
     is the point being made: one link each, and the link says what it opens.

     The owner console is not here at all \u2014 it is how the product's owner
     mints a course, not how a centre uses one. */

  /* ================================================== Before chapter one == */

  /* One silent shot of the owner console, and nothing else. Ramy, 27 Sep 2026:
     "just show it \u2014 it shows owner, my name, and the console, because it
     looks cool. And then go straight to the trainer receiving the link."

     No caption, no cursor, no click. It is a title frame that happens to be a
     real screen. It was the film's first SCENE once and that was wrong: the
     console is how the product's owner mints a course, not how a centre uses
     one, so it cannot carry an explanation. As a held frame it carries none.

     It is the only screen that needs the owner key, as &o= on the film's own
     address, and the engine passes it to this screen and to no other. Without
     it the console draws nothing and this scene is four blank seconds \u2014 so
     leave &o= off only if you mean to cut this shot. */

  {
    title: 'The console',
    screen: '14_owner.html',
    about: 'A held frame, no words. <b>Needs &amp;o=</b> (the owner key) on the film\u2019s address as well as the three course keys. Read-only: nothing is minted, nothing is clicked.',
    /* The console draws its courses only once the store has answered, and a
       held frame with nothing in it is the whole shot wasted. */
    settle: 3800,
    steps: [
      /* Quick. Ramy, 27 Sep 2026: "the console should be quick." There is
         nothing to read on it \u2014 it is a look, not a screen a viewer has to
         take anything from. */
      { do: 'hold', ms: 1540 }
    ]
  },

  /* ======================================== Chapter one \u00b7 The trainer == */

  {
    title: 'The trainer\u2019s link',
    screen: 'invite.html',
    course: 'scratch',
    about: 'Chapter one opens, and <b>every word in the film is here</b>. Ramy, 27 Sep 2026: \u201cat the beginning we give some information, some captions. After that it\u2019s just show, not tell \u2014 only when there is something a trainer doesn\u2019t understand, something only Connect Lite does.\u201d A trainer knows how a CELTA course works; what they do not know is that this one is a link. So the four things that are true of the LINK are said here and never again.',
    settle: 1400,
    steps: [
      { do: 'chapter', num: 'Chapter one', text: 'The trainer', sub: 'Sets the course up in one screen, and hands out the links.', ms: 3000 },
      { do: 'hold', ms: 900 },
      /* Each caption is followed by something that takes time, so the next one
         does not land on it -- a caption hands back after 1.2s and floats for
         about five. */
      { do: 'caption', text: 'No download. No upload. No paper.' },
      { do: 'hold', ms: 3600 },
      { do: 'caption', text: 'The link is the account.' },
      {
        do: 'still', ms: 3400,
        want: 'Google Classroom, or Drive \u2014 the link sitting where the course already lives',
        how: 'Simple: a stream or a folder with the Lite link in it. It only has to say WHERE the link can live. ONE shot.'
      },
      { do: 'caption', text: 'It lives where your course already lives.' },
      { do: 'hold', ms: 3600 },
      { do: 'caption', text: 'And it opens when the internet doesn\u2019t.' },
      { do: 'hold', ms: 3600 },
      /* The card's own button, then the room it opens, then one door on. A
         tutor's link lands on their dashboard -- that is the product -- and
         course admin is one click off it, which is where the next scene
         carries on. */
      { do: 'click', on: '#go', ms: 2200 },
      { do: 'hold', ms: 1400 },
      { do: 'click', on: 'a[href="6_centre_admin_dashboard.html"]', ms: 2400 }
    ]
  },

  {
    title: 'Setting up',
    screen: '6_centre_admin_dashboard.html',
    course: 'scratch',
    about: 'The scratch course (<b>&s=</b>): real dates, empty roster, so the twelve rows really appear. <b>This scene writes.</b> Between takes: <code>node store/scratch-course.mjs --reset</code>',
    settle: 1800,
    steps: [
      { do: 'hold', ms: 800 },
      { do: 'move', to: '[data-tab="settings"]' },
      { do: 'click', on: '[data-tab="settings"]', ms: 1400 },
      { do: 'hold', ms: 1092 },
      { do: 'click', on: '[data-tab="roster"]', ms: 1500 },
      { do: 'hold', ms: 979 },
      /* The paste box is two doors in: "Add trainee" opens #addBox, and
         "Add several at once" inside it opens #bulkWrap. */
      { do: 'click', on: '#toggleAdd', ms: 1100 },
      { do: 'click', on: '#toggleBulk', ms: 1200 },
      {
        do: 'type', into: '#storeBulkNames', ms: 5200,
        text: 'Defne Yılmaz, 1\nAnastasia Volkova, 1\nJacob Miller, 1\nZeynep Aydın, 1\nEmily Carter, 1\nOmar Haddad, 1\nPriya Nair, 2\nLucas Moreau, 2\nSofia Rossi, 2\nKenji Watanabe, 2\nAmina Diallo, 2\nTom Fletcher, 2'
      },
      { do: 'click', on: '#storeBulkAddBtn', ms: 1400 },
      { do: 'click', on: '.confirm-action', ms: 2600 },
      { do: 'hold', ms: 1638 }
    ]
  },

  {
    title: 'The centre’s own assignments',
    screen: '8_assignment_wording.html',
    course: 'scratch',
    about: 'Every section, field, declaration and marking criterion in an editable box, then the cut to a candidate seeing it. On the scratch course, so the edit is real. Played in order, scene 3 has just put twelve people here; on its own, run <code>node store/scratch-course.mjs --reset --one</code> first.',
    /* The editor draws itself once the assignment wording has arrived;
       its Save button does not exist before that. */
    settle: 6000,
    steps: [
      { do: 'hold', ms: 840 },
      /* The screen opens on the list of four. That list IS the point of the
         first beat: a new course already has Cambridge's four assignments in
         it, with their criteria, before anybody has set anything up. The scene
         used to click straight past it. */
      { do: 'move', to: '#list' },
      { do: 'hold', ms: 1819 },
      /* BOTH halves. Ramy, 27 Sep 2026: "every word is yours to type if you
         choose to \u2014 because some people don't want to bother, so they just use
         the native assignments." The caption said only that you could rewrite
         them, which reads as work to do rather than work already done. */
      { do: 'click', on: '#list button[data-a]', ms: 1800 },
      { do: 'scroll', to: 800, ms: 2080 },
      { do: 'hold', ms: 1050 },
      { do: 'scroll', to: 1600, ms: 1920 },
      { do: 'hold', ms: 1183 },
      /* The criteria are the load-bearing half of this screen: they are what
         the mark sheet two scenes later is built from, and what the candidate
         is judged against. */
      { do: 'scroll', to: 2400, ms: 2080 },
      { do: 'hold', ms: 1365 },
      { do: 'click', on: 'text:Save assignment', ms: 2000 },
      /* The point of the scene: the centre's words are what the candidate is
         marked against. Same course, the candidate's own side. */
      { do: 'goto', screen: '9_assignment_submission.html', role: 'trainee', ms: 3200 },
      { do: 'scroll', to: 600, ms: 2240 },
      { do: 'hold', ms: 1365 }
    ]
  },

  {
    title: 'Ready for the assessor',
    screen: '6_centre_admin_dashboard.html',
    course: 'scratch',
    about: 'The half of course admin the film never showed: the visit date, the documents Cambridge asks the centre to have ready (Handbook 14.1), and the candidates the MCT chooses for the assessor to observe (14.2). <b>Writes to the scratch course</b>, like the two scenes before it \u2014 this is a centre setting its course up, on camera.',
    settle: 2000,
    steps: [
      { do: 'click', on: '[data-tab="settings"]', ms: 1500 },
      { do: 'hold', ms: 840 },
      { do: 'scroll', to: 900, ms: 2080 },
      { do: 'type', into: '#visitDate', ms: 1400, text: '2026-10-21' },
      { do: 'hold', ms: 1050 },
      { do: 'scroll', to: 1700, ms: 2240 },
      { do: 'hold', ms: 1456 },
      { do: 'scroll', to: 2500, ms: 2080 },
      { do: 'hold', ms: 1819 }
    ]
  },

  {
    title: 'And it makes the others',
    screen: '6_centre_admin_dashboard.html',
    about: 'Where the other two links come from: the course\u2019s own links panel, and a Copy beside every candidate\u2019s name. Read-only \u2014 nothing is rotated and nothing is added.',
    settle: 2200,
    steps: [
      { do: 'click', on: '[data-tab="roster"]', ms: 1600 },
      { do: 'hold', ms: 800 },
      { do: 'move', to: '#assessorBlock' },
      { do: 'hold', ms: 1128 },
      { do: 'scroll', to: 600, ms: 1920 },
      { do: 'move', to: '.roster .acts button[data-copy]' },
      { do: 'hold', ms: 1128 }
    ]
  },

  {
    title: 'The trainer’s desk',
    screen: '5_tutor_dashboard.html',
    about: 'Twelve rows and the three counters. Read-only.',
    settle: 1600,
    steps: [
      { do: 'hold', ms: 1050 },
      { do: 'move', to: '#cTp' },
      { do: 'hold', ms: 1819 },
      { do: 'scroll', to: 420, ms: 1760 },
      { do: 'hold', ms: 1050 }
    ]
  },

  {
    title: 'Feedback, said',
    screen: '3_tutor_feedback.html',
    params: { trainee: 'Zeyne' },
    about: 'A point dictated, the criterion chips underneath, the solid one that the course’s own tutors have tagged, and the code landing inside the sentence. <b>Writes stubbed</b> — a take must not alter a real candidate’s feedback.<br><b>Chrome, microphone permitted</b>, as with the plan.',
    settle: 2200,
    stub: ['put'],
    steps: [
      { do: 'hold', ms: 979 },
      /* #lST is an empty container -- its own "+ Add point" button, which
         carries data-list="lST", is what puts a point row in it. A point is a
         contenteditable div, not a field: the tag chips live inside it. The
         selector here used to look for a textarea, found nothing, and the
         scene played through typing not one word (27 Sep 2026). */
      { do: 'click', on: 'button[data-list="lST"]', ms: 1200 },
      { do: 'click', on: '#lST .pt:last-child .pt-text', ms: 900 },
      { do: 'click', on: '.dictbtn', ms: 1500 },
      { do: 'type', into: '#lST .pt:last-child .pt-text', ms: 4000, text: 'Set the task before handing out the text, and checked it with a quick question' },
      { do: 'click', on: '.dictbtn', ms: 1400 },
      { do: 'hold', ms: 1183 },
      /* THE CLEVEREST THING IN THE PRODUCT, and it had one caption and no
         picture. The suggester reads the point 500ms after it stops changing,
         so the chips are there by now; clicking one puts the code inside the
         sentence, where it stays with the words it belongs to. */
      { do: 'move', to: '#lST .pt:last-child .suggest-row' },
      { do: 'hold', ms: 1540 },
      { do: 'click', on: '#lST .pt:last-child .suggest-chip', ms: 1800 },
      { do: 'hold', ms: 1183 },
      { do: 'hold', ms: 800 },
      /* Checked on the demo, 27 Sep: this sentence draws 5g and 5f and BOTH
         come back solid -- the course's own tutors have tagged them before. So
         the caption claims only what is in the frame. The dashed/solid contrast
         is real but there is no dashed chip on screen to compare it against,
         and a caption naming one would be describing a picture the viewer
         cannot see. */
      { do: 'hold', ms: 800 }
    ]
  },

  {
    title: 'Feedback, all at once',
    screen: '3_tutor_feedback.html',
    params: { trainee: 'Zeyne' },
    about: 'The exchange: Copy, talk it through elsewhere, Paste something back, every box fills. Writes stubbed.',
    settle: 2200,
    stub: ['put'],
    steps: [
      { do: 'scroll', to: 300, ms: 1440 },
      { do: 'click', on: '#xCopy', ms: 1800 },
      {
        do: 'still', ms: 2380,
        want: 'The brief, pasted into any model, and the trainer talking',
        how: 'Capture a dictation window with the copied brief in it and the trainer speaking the lesson through. If it cannot be shown, cut straight from Copy to Paste something back.'
      },
      { do: 'click', on: '#xPasteToggle', ms: 1400 },
      { do: 'hold', ms: 1050 },
      { do: 'move', to: '#returnBtn' },
      { do: 'hold', ms: 2275 }
    ]
  },

  {
    title: 'Marked against the criteria',
    screen: '10_tutor_assignment_marking.html',
    params: { trainee: 'Anastasia', a: 'fol' },
    about: 'Anastasia Volkova’s Focus on the Learner is really awaiting marking on the demo course. Six criteria are marked on camera and the outcome works itself out; <b>writes stubbed</b>, so Save &amp; return changes nothing and the record is the same after the take.',
    settle: 6000,
    stub: ['put'],
    steps: [
      { do: 'hold', ms: 979 },
      { do: 'scroll', to: 700, ms: 2080 },
      { do: 'hold', ms: 840 },
      /* Six criteria, one at a time. Each click re-renders the sheet, which is
         why they are separate steps against the same selectors rather than one
         loop: the buttons are new elements each time. */
      { do: 'click', on: '[data-crit="0"]', ms: 1100 },
      { do: 'click', on: '[data-crit="1"]', ms: 1000 },
      { do: 'click', on: '[data-crit="2"]', ms: 1000 },
      { do: 'click', on: '[data-crit="3"]', ms: 1000 },
      { do: 'click', on: '[data-crit="4"]', ms: 1000 },
      { do: 'click', on: '[data-crit="5"]', ms: 1400 },
      /* .derived carries the outcome, and it only exists once every criterion
         is marked -- so this beat cannot be faked by skipping one. */
      { do: 'move', to: '.derived' },
      { do: 'hold', ms: 1819 },
      { do: 'type', into: '#comment', ms: 3200, text: 'Strong on the learner’s background and needs. The two language points need more evidence from the interview.' },
      { do: 'hold', ms: 840 },
      { do: 'move', to: '#saveBtn' },
      { do: 'hold', ms: 1365 }
    ]
  },


  /* ======================================== Chapter two \u00b7 The trainee == */

  {
    title: 'The trainee\u2019s link',
    screen: 'invite.html',
    role: 'trainee', as: 'Emily Carter',
    about: 'Chapter two opens. The same card, the candidate\u2019s words \u2014 and the line that matters to them: this one is theirs alone.',
    settle: 1400,
    steps: [
      { do: 'chapter', num: 'Chapter two', text: 'The trainee', sub: 'One link. Everything they write, and everything they are given, behind it.', ms: 3000 },
      { do: 'hold', ms: 800 },
      { do: 'click', on: '#go', ms: 2200 }
    ]
  },

  {
    title: 'The trainee’s home',
    screen: 'index.html',
    role: 'trainee', as: 'Emily Carter',
    about: 'The hero card: one lifted card, three panels inside it, exactly one gold. Read-only.',
    settle: 1300,
    steps: [
      { do: 'hold', ms: 1050 },
      { do: 'hold', ms: 800 },
      { do: 'move', to: '#roomPlan' },
      { do: 'hold', ms: 1050 }
    ]
  },

  {
    title: 'The plan',
    screen: '1_trainee_plan_and_analysis.html',
    role: 'trainee', as: 'Emily Carter',
    about: 'Dictation, the lesson shape, the time budget, a Drive link. <b>Writes are stubbed</b> — this is a real candidate’s real plan on the demo and a take must not change it.<br><b>Capture in Chrome with the microphone already permitted.</b> The Dictate button is really pressed: Safari has no dictation bar at all, and a refused microphone drops the button straight back to “Dictate” on camera.',
    settle: 2000,
    stub: ['put'],
    steps: [
      { do: 'hold', ms: 840 },
      /* Ramy, 27 Sep: "you put the cursor inside the box and you dictate."
         So that is the order on screen -- the box first, then the button.
         Pressing it with nothing focused raises an alert and stops the film. */
      /* The dictation bar is on screen and was pressed in chapter one; the
         plan simply uses it. Pressing it a second time taught nobody
         anything (Ramy, 27 Sep 2026). */
      { do: 'click', on: '#fMain', ms: 900 },
      /* The real control, really pressed: it turns garnet and the dot pulses,
         which is the whole point of the beat -- voice was the most-wanted
         feature and the film never showed it being switched on. */
      { do: 'hold', ms: 979 },
      /* The words arrive as if spoken. The microphone is live and listening;
         the engine supplies the sentence so a take does not depend on the
         room being quiet or on what the recogniser hears. */
      { do: 'type', into: '#fMain', ms: 4200, text: 'By the end of the lesson learners will be better able to ask for and give advice using should and ought to.' },
      { do: 'hold', ms: 840 },
      /* Off again, so the bar is not left recording under the next beats. */
      { do: 'hold', ms: 1050 },
      { do: 'click', on: '#fwBtn', ms: 1400 },
      { do: 'hold', ms: 1183 },
      { do: 'move', to: '#fMatsLink' },
      { do: 'hold', ms: 1183 }
    ]
  },

  {
    title: 'The analysis sheet',
    screen: '1_trainee_plan_and_analysis.html',
    role: 'trainee', as: 'Emily Carter',
    about: 'The type box opens showing all three — Functional language, Grammar, Vocabulary — then Vocabulary, then the phonemic chart.',
    settle: 2000,
    stub: ['put'],
    steps: [
      { do: 'click', on: '#laToggle', ms: 1600 },
      { do: 'hold', ms: 800 },
      /* Ramy, 27 Sep: open the box so all three show before taking one. */
      { do: 'click', on: '#typeSel', ms: 1200 },
      { do: 'hold', ms: 846 },
      { do: 'move', to: '#ipaBar' },
      { do: 'hold', ms: 902 }
    ]
  },

  {
    title: 'Turning in, and the self-evaluation',
    screen: '2_trainee_self_evaluation.html',
    role: 'trainee', as: 'Emily Carter',
    about: 'Written before they read their tutor. Writes stubbed — Turn in is moved to, not clicked.',
    settle: 1600,
    stub: ['put'],
    steps: [
      { do: 'hold', ms: 1050 },
      { do: 'scroll', to: 600, ms: 2080 },
      { do: 'hold', ms: 1092 },
      { do: 'move', to: '#turnInBtn' },
      { do: 'hold', ms: 1183 }
    ]
  },

  {
    title: 'The trainee reads it',
    screen: '4_feedback_returned.html',
    role: 'trainee', as: 'Emily Carter',
    about: 'Newest on top, read-only. <b>No criterion codes here</b> — checked 27 Sep: this screen carries none, and that is the decision.',
    settle: 1800,
    steps: [
      { do: 'hold', ms: 1050 },
      { do: 'scroll', to: 900, ms: 2720 },
      { do: 'hold', ms: 1183 },
      { do: 'scroll', to: 1900, ms: 2560 },
      { do: 'hold', ms: 1365 }
    ]
  },


  /* THE ASSIGNMENT CYCLE, in three scenes. Ramy, 27 Sep 2026: the film showed
     a submission and a mark sheet and stopped, so the thing that makes the
     four assignments work -- the going back and forth -- was missing.

     Every rung below is a candidate who is REALLY at it. Nothing is staged and
     no stubbed save is asked to stand for a stage change:

       submitted           c3  Anastasia Volkova   the sheet awaiting marking
       resubmission_needed c5  Marta Kowalczyk     planted, see below
       closed              c3  Emily Carter        done, read-only

     The middle rung is the one no demo course holds, so it is planted on the
     scratch course -- the one course a take may write to:

       node store/plant-assignment-rungs.mjs --plant

     which rewinds a real closed-on-resubmission record from the finished demo
     by one step. Run it after scratch-course.mjs, and before filming 13b.

     ?trainee= is a TOKEN, and no token may go in this file -- the repository
     is public. So these scenes name the candidate and the engine looks the
     token up at run time from the roster. */

  {
    title: 'The written assignments',
    screen: '9_assignment_submission.html',
    role: 'trainee', as: 'Emily Carter',
    about: 'The candidate’s side: four assignments, each with the centre’s own criteria, its declaration and its deadline. Writes stubbed.',
    settle: 6000,
    stub: ['put'],
    steps: [
      { do: 'hold', ms: 979 },
      /* Nothing is on screen until one of the four is chosen: #submitBtn
         belongs to the assignment, not to the page. */
      { do: 'click', on: '#picker button', ms: 1600 },
      { do: 'scroll', to: 700, ms: 2240 },
      { do: 'hold', ms: 1050 },
      { do: 'move', to: '#submitBtn' },
      { do: 'hold', ms: 1183 }
    ]
  },

  {
    title: 'Sent back, and one more go',
    screen: '9_assignment_submission.html',
    course: 'scratch',
    role: 'trainee', as: 'Marta Kowalczyk',
    params: { a: 'fol' },
    about: 'The rung no demo course holds: a candidate at <b>Resubmission needed</b>, reading which criteria were not met and why, with their first submission read-only above the amber boxes. On the scratch course — run <code>node store/plant-assignment-rungs.mjs --plant</code> first. Writes stubbed, so Submit is moved to, not pressed.',
    settle: 6000,
    stub: ['put'],
    steps: [
      { do: 'hold', ms: 1050 },
      { do: 'scroll', to: 500, ms: 2080 },
      { do: 'hold', ms: 1183 },
      { do: 'scroll', to: 1100, ms: 2240 },
      { do: 'hold', ms: 1365 },
      { do: 'scroll', to: 1900, ms: 2400 },
      { do: 'hold', ms: 1183 },
      { do: 'move', to: '#submitBtn' },
      { do: 'hold', ms: 1050 },
      /* And the end of it, on a candidate who is really finished. */
      /* Emily's FOCUS ON THE LEARNER is the closed one. Without ?a= the screen
         opens on whichever assignment the centre put first, which for this
         course is Language Related Tasks -- a closing beat reading
         "Not submitted". */
      { do: 'goto', screen: '9_assignment_submission.html', course: 'demo', role: 'trainee', as: 'Emily Carter', params: { a: 'fol' }, ms: 6000 },
      { do: 'scroll', to: 600, ms: 2240 },
      { do: 'hold', ms: 1547 }
    ]
  },




  /* ===================================== Chapter three \u00b7 The assessor == */

  {
    title: 'The assessor\u2019s link',
    screen: 'invite.html',
    course: 'finished', role: 'assessor',
    about: 'Chapter three opens. The third card \u2014 read-only, and it says when it stops working: the course end plus fourteen days (Handbook 15).',
    settle: 1400,
    steps: [
      { do: 'chapter', num: 'Chapter three', text: 'The assessor', sub: 'One read-only link, and the pack is already assembled.', ms: 3000 },
      { do: 'hold', ms: 800 },
      { do: 'click', on: '#go', ms: 2200 }
    ]
  },

  {
    title: 'The assessor’s view',
    screen: '12_assessor_pack.html',
    course: 'finished', role: 'assessor',
    about: 'Opened from the assessor’s own read-only link on the finished course. Scrolled, never printed — nothing is downloaded or sent.',
    settle: 2200,
    steps: [
      { do: 'hold', ms: 1050 },
      { do: 'scroll', to: 900, ms: 2880 },
      { do: 'hold', ms: 1183 },
      { do: 'scroll', to: 2000, ms: 2880 },
      { do: 'hold', ms: 1365 }
    ]
  },

  {
    title: 'Grades',
    screen: '13_grades_report.html',
    course: 'finished',
    about: 'Cambridge’s own form, and the trainer’s feedback offered back into it. Writes stubbed.',
    settle: 2200,
    stub: ['put', 'putCourse'],
    steps: [
      { do: 'hold', ms: 1050 },
      { do: 'scroll', to: 800, ms: 2400 },
      { do: 'hold', ms: 1092 },
      { do: 'scroll', to: 1700, ms: 2400 },
      { do: 'hold', ms: 1819 }
    ]
  },

  {
    title: 'The final report',
    screen: '16_final_report.html',
    /* THE ASSESSOR, not a candidate. 16_final_report.html REFUSES a candidate's
       link on purpose -- the final report reaches them from the centre after
       the course, once the grade is confirmed. Opened as Olivia, the film's
       closing shot was the door politely closing. */
    course: 'finished', role: 'assessor',
    /* This screen takes ?id=, not ?trainee=, and matches it against the id OR
       the name -- so the name is enough and no token goes in this file. */
    params: { id: 'Olivia Bennett' },
    about: 'Down the whole document, then back up to the head of it. Ramy, 27 Sep 2026: \u201cend with the TOP side of the final report, the side that says Pass A \u2014 it goes down, shows the rest of it, and then it goes up again.\u201d A document you have seen the length of, resting on the thing it says.',
    settle: 2400,
    steps: [
      { do: 'hold', ms: 1100 },
      { do: 'scroll', to: 1200, ms: 3000 },
      { do: 'hold', ms: 900 },
      { do: 'scroll', to: 'bottom', ms: 3400 },
      { do: 'hold', ms: 1200 },
      /* And back up, so the film rests where the report says what it says
         rather than on its last line. */
      { do: 'scroll', to: 0, ms: 3600 },
      { do: 'hold', ms: 2600 }
    ]
  },

  /* ===================================================== And the ask == */

  {
    title: 'Connect Lite \u2014 the card',
    screen: 'offer.html',
    about: 'The last frame. Ramy, 27 Sep 2026: \u201cmaybe the final slide goes back to Connect \u2014 email me. It\u2019s a sales pitch. Make it a sales pitch.\u201d This is the card a centre is sent before they have bought anything: what it is, what it costs, his note in his own voice, and the three demo doors. It renders from <b>?k=</b> alone. <b>The film ends here</b> \u2014 nothing after it.',
    settle: 2600,
    steps: [
      { do: 'hold', ms: 2600 },
      { do: 'scroll', to: 700, ms: 3400 },
      { do: 'hold', ms: 2600 },
      { do: 'scroll', to: 0, ms: 2600 },
      { do: 'hold', ms: 3200 }
    ]
  },
];
