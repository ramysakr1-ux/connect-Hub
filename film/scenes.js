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

  /* ======================================== Chapter one \u00b7 The trainer == */

  {
    title: 'The trainer\u2019s link',
    screen: 'invite.html',
    about: 'Chapter one opens. The trainer\u2019s card, held, then it opens the course. The film\u2019s first words are here because this is its first frame.',
    settle: 1400,
    steps: [
      /* The film's own opening card covers the stage for 3.2 seconds while the
         first screen loads behind it. Chapter one's card used to play UNDER
         it and was almost entirely spent by the time it cleared. This waits
         it out. The other two chapters need no such wait. */
      { do: 'hold', ms: 2400 },
      { do: 'chapter', num: 'Chapter one', text: 'The trainer', sub: 'A course set up, its assignments written, its assessor expected, and eight lessons of feedback to give.', ms: 3600 },
      { do: 'hold', ms: 1400 },
      { do: 'caption', text: 'No download, no upload, no hunting for paper.' },
      { do: 'hold', ms: 2600 },
      { do: 'caption', text: 'A course arrives as one link, and a card that says what it opens.' },
      { do: 'hold', ms: 3120 },
      { do: 'caption', text: 'No account to make. No password to forget.' },
      { do: 'hold', ms: 2080 },
      { do: 'move', to: '#go' },
      { do: 'hold', ms: 1400 },
      { do: 'click', on: '#go', ms: 2400 }
    ]
  },

  {
    title: 'Setting up',
    screen: '6_centre_admin_dashboard.html',
    course: 'scratch',
    about: 'The scratch course (<b>&s=</b>): real dates, empty roster, so the twelve rows really appear. <b>This scene writes.</b> Between takes: <code>node store/scratch-course.mjs --reset</code>',
    settle: 1800,
    steps: [
      { do: 'hold', ms: 900 },
      { do: 'move', to: '[data-tab="settings"]' },
      { do: 'click', on: '[data-tab="settings"]', ms: 1400 },
      { do: 'hold', ms: 1560 },
      { do: 'caption', text: 'No accounts, no passwords. The link is the account.' },
      { do: 'click', on: '[data-tab="roster"]', ms: 1500 },
      { do: 'hold', ms: 1400 },
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
      { do: 'hold', ms: 2340 }
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
      { do: 'hold', ms: 1200 },
      /* The screen opens on the list of four. That list IS the point of the
         first beat: a new course already has Cambridge's four assignments in
         it, with their criteria, before anybody has set anything up. The scene
         used to click straight past it. */
      { do: 'caption', text: 'A new course already has the four assignments in it.' },
      { do: 'move', to: '#list' },
      { do: 'hold', ms: 2600 },
      { do: 'caption', text: 'Every word of them is yours to rewrite.' },
      { do: 'click', on: '#list button[data-a]', ms: 1800 },
      { do: 'scroll', to: 800, ms: 2600 },
      { do: 'hold', ms: 1500 },
      { do: 'caption', text: 'The sections, the fields, the declaration — your centre’s wording.' },
      { do: 'scroll', to: 1600, ms: 2400 },
      { do: 'hold', ms: 1690 },
      /* The criteria are the load-bearing half of this screen: they are what
         the mark sheet two scenes later is built from, and what the candidate
         is judged against. */
      { do: 'caption', text: 'And the marking criteria — which is what your tutors will mark against.' },
      { do: 'scroll', to: 2400, ms: 2600 },
      { do: 'hold', ms: 1950 },
      { do: 'click', on: 'text:Save assignment', ms: 2000 },
      /* The point of the scene: the centre's words are what the candidate is
         marked against. Same course, the candidate's own side. */
      { do: 'goto', screen: '9_assignment_submission.html', role: 'trainee', ms: 3200 },
      { do: 'caption', text: 'And that is what your candidates see.' },
      { do: 'scroll', to: 600, ms: 2800 },
      { do: 'hold', ms: 1950 }
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
      { do: 'hold', ms: 1200 },
      { do: 'caption', text: 'The assessor\u2019s visit is part of setting the course up, not a scramble at the end.' },
      { do: 'scroll', to: 900, ms: 2600 },
      { do: 'type', into: '#visitDate', ms: 1400, text: '2026-10-21' },
      { do: 'hold', ms: 1500 },
      { do: 'caption', text: 'Everything the Handbook asks you to have ready, in one list.' },
      { do: 'scroll', to: 1700, ms: 2800 },
      { do: 'hold', ms: 2080 },
      { do: 'caption', text: 'And the candidates the assessor will observe \u2014 your choice, recorded.' },
      { do: 'scroll', to: 2500, ms: 2600 },
      { do: 'hold', ms: 2600 }
    ]
  },

  {
    title: 'And it makes the others',
    screen: '6_centre_admin_dashboard.html',
    about: 'Where the other two links come from: the course\u2019s own links panel, and a Copy beside every candidate\u2019s name. Read-only \u2014 nothing is rotated and nothing is added.',
    settle: 2200,
    steps: [
      { do: 'click', on: '[data-tab="roster"]', ms: 1600 },
      { do: 'hold', ms: 1400 },
      { do: 'caption', text: 'Everyone gets their own link. Nobody gets anyone else\u2019s.' },
      { do: 'move', to: '#assessorBlock' },
      { do: 'hold', ms: 2600 },
      { do: 'scroll', to: 600, ms: 2400 },
      { do: 'move', to: '.roster .acts button[data-copy]' },
      { do: 'hold', ms: 2600 }
    ]
  },

  {
    title: 'The trainer’s desk',
    screen: '5_tutor_dashboard.html',
    about: 'Twelve rows and the three counters. Read-only.',
    settle: 1600,
    steps: [
      { do: 'hold', ms: 1500 },
      { do: 'caption', text: 'Nothing to hunt for.' },
      { do: 'move', to: '#cTp' },
      { do: 'hold', ms: 2600 },
      { do: 'scroll', to: 420, ms: 2200 },
      { do: 'hold', ms: 1500 }
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
      { do: 'hold', ms: 1400 },
      { do: 'caption', text: 'The tutor writes the same way. Box, then Dictate.' },
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
      { do: 'hold', ms: 1690 },
      /* THE CLEVEREST THING IN THE PRODUCT, and it had one caption and no
         picture. The suggester reads the point 500ms after it stops changing,
         so the chips are there by now; clicking one puts the code inside the
         sentence, where it stays with the words it belongs to. */
      { do: 'caption', text: 'It reads the point and offers the criteria it meets.' },
      { do: 'move', to: '#lST .pt:last-child .suggest-row' },
      { do: 'hold', ms: 2200 },
      { do: 'click', on: '#lST .pt:last-child .suggest-chip', ms: 1800 },
      { do: 'hold', ms: 1690 },
      { do: 'caption', text: 'Tagged inside the sentence — not on a separate form afterwards.' },
      { do: 'hold', ms: 2080 },
      /* Checked on the demo, 27 Sep: this sentence draws 5g and 5f and BOTH
         come back solid -- the course's own tutors have tagged them before. So
         the caption claims only what is in the frame. The dashed/solid contrast
         is real but there is no dashed chip on screen to compare it against,
         and a caption naming one would be describing a picture the viewer
         cannot see. */
      { do: 'caption', text: 'Solid means your own tutors have tagged it before. It learns your centre.' },
      { do: 'hold', ms: 2600 }
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
      { do: 'scroll', to: 300, ms: 1800 },
      { do: 'caption', text: 'Or talk the whole lesson through somewhere else, and paste it all back.' },
      { do: 'click', on: '#xCopy', ms: 1800 },
      {
        do: 'still', ms: 2380,
        want: 'The brief, pasted into any model, and the trainer talking',
        how: 'Capture a dictation window with the copied brief in it and the trainer speaking the lesson through. If it cannot be shown, cut straight from Copy to Paste something back.'
      },
      { do: 'click', on: '#xPasteToggle', ms: 1400 },
      { do: 'hold', ms: 1500 },
      { do: 'caption', text: 'Every stage, every list, every comment — to read before it goes anywhere.' },
      { do: 'move', to: '#returnBtn' },
      { do: 'hold', ms: 3250 }
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
      { do: 'hold', ms: 1400 },
      { do: 'caption', text: 'One sheet, one candidate, the centre’s own criteria.' },
      { do: 'scroll', to: 700, ms: 2600 },
      { do: 'hold', ms: 1200 },
      /* Six criteria, one at a time. Each click re-renders the sheet, which is
         why they are separate steps against the same selectors rather than one
         loop: the buttons are new elements each time. */
      { do: 'caption', text: 'Met, or not yet met. One judgement each.' },
      { do: 'click', on: '[data-crit="0"]', ms: 1100 },
      { do: 'click', on: '[data-crit="1"]', ms: 1000 },
      { do: 'click', on: '[data-crit="2"]', ms: 1000 },
      { do: 'click', on: '[data-crit="3"]', ms: 1000 },
      { do: 'click', on: '[data-crit="4"]', ms: 1000 },
      { do: 'click', on: '[data-crit="5"]', ms: 1400 },
      /* .derived carries the outcome, and it only exists once every criterion
         is marked -- so this beat cannot be faked by skipping one. */
      { do: 'caption', text: 'The outcome comes from the marks, not from a box.' },
      { do: 'move', to: '.derived' },
      { do: 'hold', ms: 2600 },
      { do: 'type', into: '#comment', ms: 3200, text: 'Strong on the learner’s background and needs. The two language points need more evidence from the interview.' },
      { do: 'hold', ms: 1200 },
      { do: 'caption', text: 'Sent back with your comment on every criterion.' },
      { do: 'move', to: '#saveBtn' },
      { do: 'hold', ms: 1950 }
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
      { do: 'chapter', num: 'Chapter two', text: 'The trainee', sub: 'One link, and everything they write on the course lives behind it \u2014 plans, self-evaluations, the feedback they are given, four assignments.', ms: 3600 },
      { do: 'hold', ms: 1400 },
      { do: 'caption', text: 'The same card, in their words.' },
      { do: 'hold', ms: 2600 },
      { do: 'caption', text: 'This one is theirs alone \u2014 and the card says so.' },
      { do: 'hold', ms: 2600 },
      { do: 'click', on: '#go', ms: 2400 }
    ]
  },

  {
    title: 'The trainee’s home',
    screen: 'index.html',
    role: 'trainee', as: 'Emily Carter',
    about: 'The hero card: one lifted card, three panels inside it, exactly one gold. Read-only.',
    settle: 1300,
    steps: [
      { do: 'hold', ms: 1500 },
      { do: 'caption', text: 'One thing is gold: the next step.' },
      { do: 'hold', ms: 2600 },
      { do: 'move', to: '#roomPlan' },
      { do: 'hold', ms: 1500 }
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
      { do: 'hold', ms: 1200 },
      /* Ramy, 27 Sep: "you put the cursor inside the box and you dictate."
         So that is the order on screen -- the box first, then the button.
         Pressing it with nothing focused raises an alert and stops the film. */
      { do: 'caption', text: 'Click into a box. Then press Dictate.' },
      { do: 'click', on: '#fMain', ms: 900 },
      /* The real control, really pressed: it turns garnet and the dot pulses,
         which is the whole point of the beat -- voice was the most-wanted
         feature and the film never showed it being switched on. */
      { do: 'click', on: '.dictbtn', ms: 1600 },
      { do: 'hold', ms: 1400 },
      /* The words arrive as if spoken. The microphone is live and listening;
         the engine supplies the sentence so a take does not depend on the
         room being quiet or on what the recogniser hears. */
      { do: 'type', into: '#fMain', ms: 4200, text: 'By the end of the lesson learners will be better able to ask for and give advice using should and ought to.' },
      { do: 'hold', ms: 1200 },
      { do: 'caption', text: 'Punctuation is spoken too — comma, full stop, new line.' },
      /* Off again, so the bar is not left recording under the next beats. */
      { do: 'click', on: '.dictbtn', ms: 1400 },
      { do: 'hold', ms: 1500 },
      { do: 'click', on: '#fwBtn', ms: 1400 },
      { do: 'hold', ms: 1690 },
      { do: 'caption', text: 'Choose a lesson shape — the stages appear.' },
      { do: 'hold', ms: 1560 },
      { do: 'caption', text: 'Worksheets stay on the trainee’s own Drive. Nothing is uploaded.' },
      { do: 'move', to: '#fMatsLink' },
      { do: 'hold', ms: 1690 }
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
      { do: 'hold', ms: 1500 },
      { do: 'caption', text: 'The language analysis is part of the same document.' },
      /* Ramy, 27 Sep: open the box so all three show before taking one. */
      { do: 'click', on: '#typeSel', ms: 1200 },
      { do: 'hold', ms: 1950 },
      { do: 'move', to: '#ipaBar' },
      { do: 'hold', ms: 2080 }
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
      { do: 'hold', ms: 1500 },
      { do: 'caption', text: 'Written before they read their tutor. That is the point of it.' },
      { do: 'scroll', to: 600, ms: 2600 },
      { do: 'hold', ms: 1560 },
      { do: 'move', to: '#turnInBtn' },
      { do: 'hold', ms: 1690 }
    ]
  },

  {
    title: 'The trainee reads it',
    screen: '4_feedback_returned.html',
    role: 'trainee', as: 'Emily Carter',
    about: 'Newest on top, read-only. <b>No criterion codes here</b> — checked 27 Sep: this screen carries none, and that is the decision.',
    settle: 1800,
    steps: [
      { do: 'hold', ms: 1500 },
      { do: 'caption', text: 'Read-only. Not a word of their tutor’s can be touched.' },
      { do: 'scroll', to: 900, ms: 3400 },
      { do: 'hold', ms: 1690 },
      { do: 'scroll', to: 1900, ms: 3200 },
      { do: 'hold', ms: 1950 }
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
      { do: 'hold', ms: 1400 },
      { do: 'caption', text: 'Four assignments, each with its criteria and its deadline.' },
      /* Nothing is on screen until one of the four is chosen: #submitBtn
         belongs to the assignment, not to the page. */
      { do: 'click', on: '#picker button', ms: 1600 },
      { do: 'scroll', to: 700, ms: 2800 },
      { do: 'hold', ms: 1500 },
      { do: 'caption', text: 'Written in the page. Nothing to download, nothing to upload.' },
      { do: 'move', to: '#submitBtn' },
      { do: 'hold', ms: 1690 }
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
      { do: 'hold', ms: 1500 },
      { do: 'caption', text: 'One resubmission. The candidate can see exactly what to fix.' },
      { do: 'scroll', to: 500, ms: 2600 },
      { do: 'hold', ms: 1690 },
      { do: 'caption', text: 'Met, or not met, with your tutor’s words beside each one.' },
      { do: 'scroll', to: 1100, ms: 2800 },
      { do: 'hold', ms: 1950 },
      { do: 'caption', text: 'The first submission stays as it was. The new writing goes in the amber boxes.' },
      { do: 'scroll', to: 1900, ms: 3000 },
      { do: 'hold', ms: 1690 },
      { do: 'move', to: '#submitBtn' },
      { do: 'hold', ms: 1500 },
      /* And the end of it, on a candidate who is really finished. */
      /* Emily's FOCUS ON THE LEARNER is the closed one. Without ?a= the screen
         opens on whichever assignment the centre put first, which for this
         course is Language Related Tasks -- a closing beat reading
         "Not submitted". */
      { do: 'goto', screen: '9_assignment_submission.html', course: 'demo', role: 'trainee', as: 'Emily Carter', params: { a: 'fol' }, ms: 6000 },
      { do: 'caption', text: 'Closed. The outcome, the marks, and every word of it, kept.' },
      { do: 'scroll', to: 600, ms: 2800 },
      { do: 'hold', ms: 2210 }
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
      { do: 'chapter', num: 'Chapter three', text: 'The assessor', sub: 'Everything Cambridge asks a centre to have ready, gathered behind one read-only link.', ms: 3600 },
      { do: 'hold', ms: 1400 },
      { do: 'caption', text: 'And the assessor\u2019s \u2014 read-only, and it expires.' },
      { do: 'hold', ms: 3120 },
      { do: 'click', on: '#go', ms: 2400 }
    ]
  },

  {
    title: 'The assessor’s view',
    screen: '12_assessor_pack.html',
    course: 'finished', role: 'assessor',
    about: 'Opened from the assessor’s own read-only link on the finished course. Scrolled, never printed — nothing is downloaded or sent.',
    settle: 2200,
    steps: [
      { do: 'hold', ms: 1500 },
      { do: 'caption', text: 'The assessor gets a link. Read-only.' },
      { do: 'scroll', to: 900, ms: 3600 },
      { do: 'hold', ms: 1690 },
      { do: 'scroll', to: 2000, ms: 3600 },
      { do: 'hold', ms: 1950 }
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
      { do: 'hold', ms: 1500 },
      { do: 'caption', text: 'Cambridge’s own form. Into Appian by paste, not by retyping.' },
      { do: 'scroll', to: 800, ms: 3000 },
      { do: 'hold', ms: 1560 },
      { do: 'scroll', to: 1700, ms: 3000 },
      { do: 'hold', ms: 2600 }
    ]
  },

  {
    title: 'The final report \u2014 the end',
    screen: '16_final_report.html',
    course: 'finished', role: 'trainee', as: 'Olivia Bennett',
    about: 'The whole document, scrolled, with its colour. <b>This is where the film ends</b> (Ramy, 27 Sep) \u2014 nothing after it: no card, no credit, no PDF.',
    settle: 2400,
    steps: [
      { do: 'hold', ms: 1560 },
      { do: 'caption', text: 'Assembled from the record. Not written.' },
      { do: 'scroll', to: 900, ms: 4000 },
      { do: 'hold', ms: 1500 },
      { do: 'scroll', to: 2000, ms: 4000 },
      { do: 'hold', ms: 1500 },
      { do: 'scroll', to: 'bottom', ms: 4200 },
      { do: 'hold', ms: 2210 }
    ]
  },
];
