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

  /* ================================================== Part 1 · The link == */

  {
    title: 'A course is made',
    screen: '14_owner.html',
    about: 'The owner console, one beat. Needs <b>&o=</b> (the owner key) as well. createCourse is stubbed — nothing is minted.',
    /* The console draws its Make a course button only after the store has
       answered with the courses, so it needs longer than a static screen. */
    settle: 3800,
    stub: ['createCourse'],
    answers: {
      createCourse: function () {
        return { ok: true, result: { course: { id: 'c9', name: 'CELTA — new course', tutorKey: 'film-demo-key', trainees: 0 } } };
      }
    },
    steps: [
      { do: 'hold', ms: 900 },
      { do: 'caption', text: 'A course is one link.' },
      { do: 'move', to: '#makeBtn' },
      { do: 'click', on: '#makeBtn', ms: 1600 },
      { do: 'hold', ms: 3000 },
      { do: 'move', to: 'text:Copy' },
      { do: 'hold', ms: 1400 }
    ]
  },

  {
    title: 'Where the link lives',
    screen: 'invite.html',
    about: 'The tutor’s card, then the link inside Classroom and Drive, then offline. Read-only screen.',
    settle: 1100,
    steps: [
      { do: 'hold', ms: 1200 },
      { do: 'caption', text: 'Put it wherever your course already lives.' },
      { do: 'hold', ms: 1600 },
      {
        do: 'still', ms: 3600,
        want: 'Google Classroom — the Lite link posted as a material',
        how: 'A demo Classroom stream with the link in it, then the click that opens the card. The Classroom post is the frame; the link is a line inside it. Never a real class.'
      },
      {
        do: 'still', ms: 3600,
        want: 'Google Drive — the link saved in the course folder',
        how: 'A demo Drive folder with the Lite link saved as a shortcut among the course files, then the click. Never a real folder.'
      },
      { do: 'caption', text: 'It still opens when the internet doesn’t.' },
      { do: 'hold', ms: 4000 },
      { do: 'move', to: '#go' },
      { do: 'click', on: '#go', ms: 1800 }
    ]
  },

  /* ========================================== Part 2 · The trainer sets up == */

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
      { do: 'hold', ms: 2400 },
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
      { do: 'hold', ms: 3600 }
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
      { do: 'caption', text: 'Every word of the four Cambridge assignments is yours to rewrite.' },
      /* The screen opens on the list of four; the editor, and its Save, belong
         to whichever one is picked. */
      { do: 'click', on: '#list button[data-a]', ms: 1800 },
      { do: 'scroll', to: 800, ms: 2600 },
      { do: 'hold', ms: 2200 },
      { do: 'scroll', to: 1600, ms: 2400 },
      { do: 'hold', ms: 3000 },
      { do: 'click', on: 'text:Save assignment', ms: 2000 },
      /* The point of the scene: the centre's words are what the candidate is
         marked against. Same course, the candidate's own side. */
      { do: 'goto', screen: '9_assignment_submission.html', role: 'trainee', ms: 3200 },
      { do: 'caption', text: 'And that is what your candidates see.' },
      { do: 'scroll', to: 600, ms: 2800 },
      { do: 'hold', ms: 3000 }
    ]
  },

  /* ================================ Part 3 · The trainee's teaching practice == */

  {
    title: 'The trainee’s home',
    screen: 'index.html',
    role: 'trainee', as: 'Emily Carter',
    about: 'The hero card: one lifted card, three panels inside it, exactly one gold. Read-only.',
    settle: 1300,
    steps: [
      { do: 'hold', ms: 1800 },
      { do: 'caption', text: 'One thing is gold: the next step.' },
      { do: 'hold', ms: 4000 },
      { do: 'move', to: '#roomPlan' },
      { do: 'hold', ms: 2200 }
    ]
  },

  {
    title: 'The plan',
    screen: '1_trainee_plan_and_analysis.html',
    role: 'trainee', as: 'Emily Carter',
    about: 'Dictation, the lesson shape, the time budget, a Drive link. <b>Writes are stubbed</b> — this is a real candidate’s real plan on the demo and a take must not change it.',
    settle: 2000,
    stub: ['put'],
    steps: [
      { do: 'hold', ms: 1200 },
      { do: 'caption', text: 'Click into a box and talk.' },
      { do: 'click', on: '#fMain', ms: 900 },
      /* The words arrive as if spoken. The real take clicks Dictate and says
         them; the engine cannot hold a microphone, and typing shows the same
         picture. See the spec's build notes. */
      { do: 'type', into: '#fMain', ms: 3400, text: 'By the end of the lesson learners will be better able to ask for and give advice using should and ought to.' },
      { do: 'hold', ms: 1800 },
      { do: 'click', on: '#fwBtn', ms: 1400 },
      { do: 'hold', ms: 2600 },
      { do: 'caption', text: 'Choose a lesson shape — the stages appear.' },
      { do: 'hold', ms: 2400 },
      { do: 'caption', text: 'Worksheets stay on the trainee’s own Drive. Nothing is uploaded.' },
      { do: 'move', to: '#fMatsLink' },
      { do: 'hold', ms: 2600 }
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
      { do: 'hold', ms: 1600 },
      { do: 'caption', text: 'The language analysis is part of the same document.' },
      /* Ramy, 27 Sep: open the box so all three show before taking one. */
      { do: 'click', on: '#typeSel', ms: 1200 },
      { do: 'hold', ms: 3000 },
      { do: 'move', to: '#ipaBar' },
      { do: 'hold', ms: 3200 }
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
      { do: 'hold', ms: 1600 },
      { do: 'caption', text: 'Written before they read their tutor. That is the point of it.' },
      { do: 'scroll', to: 600, ms: 2600 },
      { do: 'hold', ms: 2400 },
      { do: 'move', to: '#turnInBtn' },
      { do: 'hold', ms: 2600 }
    ]
  },

  /* ==================================== Part 4 · The trainer gives feedback == */

  {
    title: 'The trainer’s desk',
    screen: '5_tutor_dashboard.html',
    about: 'Twelve rows and the three counters. Read-only.',
    settle: 1600,
    steps: [
      { do: 'hold', ms: 2000 },
      { do: 'caption', text: 'Nothing to hunt for.' },
      { do: 'move', to: '#cTp' },
      { do: 'hold', ms: 4000 },
      { do: 'scroll', to: 420, ms: 2200 },
      { do: 'hold', ms: 2000 }
    ]
  },

  {
    title: 'Feedback, said',
    screen: '3_tutor_feedback.html',
    params: { trainee: 'Zeyne' },
    about: 'A point dictated, the criterion chips underneath, the solid one that the course’s own tutors have tagged. <b>Writes stubbed</b> — a take must not alter a real candidate’s feedback.',
    settle: 2200,
    stub: ['put'],
    steps: [
      { do: 'hold', ms: 1400 },
      { do: 'caption', text: 'Say a point. It’s written.' },
      /* #lST is an empty container -- its own "+ Add point" button, which
         carries data-list="lST", is what puts an input in it. */
      { do: 'click', on: 'button[data-list="lST"]', ms: 1200 },
      { do: 'type', into: '#lST textarea:last-of-type, #lST input:last-of-type', ms: 3200, text: 'Set the task before handing out the text, and checked it with a quick question' },
      { do: 'hold', ms: 2600 },
      { do: 'caption', text: 'The solid chips are what your own tutors tag. It learns your centre.' },
      { do: 'hold', ms: 4000 }
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
        do: 'still', ms: 3400,
        want: 'The brief, pasted into any model, and the trainer talking',
        how: 'Capture a dictation window with the copied brief in it and the trainer speaking the lesson through. If it cannot be shown, cut straight from Copy to Paste something back.'
      },
      { do: 'click', on: '#xPasteToggle', ms: 1400 },
      { do: 'hold', ms: 2000 },
      { do: 'caption', text: 'Every stage, every list, every comment — to read before it goes anywhere.' },
      { do: 'move', to: '#returnBtn' },
      { do: 'hold', ms: 5000 }
    ]
  },

  /* ======================================= Part 5 · Back with the trainee == */

  {
    title: 'The trainee reads it',
    screen: '4_feedback_returned.html',
    role: 'trainee', as: 'Emily Carter',
    about: 'Newest on top, read-only. <b>No criterion codes here</b> — checked 27 Sep: this screen carries none, and that is the decision.',
    settle: 1800,
    steps: [
      { do: 'hold', ms: 1800 },
      { do: 'caption', text: 'Read-only. Not a word of their tutor’s can be touched.' },
      { do: 'scroll', to: 900, ms: 3400 },
      { do: 'hold', ms: 2600 },
      { do: 'scroll', to: 1900, ms: 3200 },
      { do: 'hold', ms: 3000 }
    ]
  },

  {
    title: 'The written assignments',
    screen: '9_assignment_submission.html',
    role: 'trainee', as: 'Emily Carter',
    about: 'Submitted by the candidate, marked by the tutor, returned for one resubmission. Writes stubbed on both sides.',
    settle: 6000,
    stub: ['put'],
    steps: [
      { do: 'hold', ms: 1400 },
      { do: 'caption', text: 'Four assignments, each with its criteria and deadline.' },
      /* Nothing is on screen until one of the four is chosen: #submitBtn
         belongs to the assignment, not to the page. */
      { do: 'click', on: '#picker button', ms: 1600 },
      { do: 'scroll', to: 700, ms: 2800 },
      { do: 'hold', ms: 2000 },
      { do: 'move', to: '#submitBtn' },
      { do: 'hold', ms: 1800 },
      { do: 'goto', screen: '10_tutor_assignment_marking.html', role: 'tutor', ms: 3000 },
      { do: 'caption', text: 'The outcome comes from the marks, not from a box.' },
      { do: 'scroll', to: 800, ms: 2800 },
      { do: 'hold', ms: 3400 }
    ]
  },

  /* ============================================ Part 6 · The assessor (c4) == */

  {
    title: 'The assessor’s view',
    screen: '12_assessor_pack.html',
    course: 'finished', role: 'assessor',
    about: 'Opened from the assessor’s own read-only link on the finished course. Scrolled, never printed — nothing is downloaded or sent.',
    settle: 2200,
    steps: [
      { do: 'hold', ms: 2000 },
      { do: 'caption', text: 'The assessor gets a link. Read-only.' },
      { do: 'scroll', to: 900, ms: 3600 },
      { do: 'hold', ms: 2600 },
      { do: 'scroll', to: 2000, ms: 3600 },
      { do: 'hold', ms: 3000 }
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
      { do: 'hold', ms: 1800 },
      { do: 'caption', text: 'Cambridge’s own form. Into Appian by paste, not by retyping.' },
      { do: 'scroll', to: 800, ms: 3000 },
      { do: 'hold', ms: 2400 },
      { do: 'scroll', to: 1700, ms: 3000 },
      { do: 'hold', ms: 4000 }
    ]
  },

  /* ================================== Part 7 · The end of the course (c4) == */

  {
    title: 'The final report, whole',
    screen: '16_final_report.html',
    course: 'finished', role: 'trainee', as: 'Olivia Bennett',
    about: 'The whole document, scrolled at reading pace, with its colour. Ramy: the whole report should be seen.',
    settle: 2400,
    steps: [
      { do: 'hold', ms: 2400 },
      { do: 'caption', text: 'Assembled from the record. Not written.' },
      { do: 'scroll', to: 900, ms: 4000 },
      { do: 'hold', ms: 2000 },
      { do: 'scroll', to: 2000, ms: 4000 },
      { do: 'hold', ms: 2000 },
      { do: 'scroll', to: 'bottom', ms: 4200 },
      { do: 'hold', ms: 3400 }
    ]
  },

  {
    title: 'Paper, if you want it',
    screen: '4_feedback_returned.html',
    course: 'finished', role: 'trainee', as: 'Olivia Bennett',
    about: 'Eight teaching practices, the whole course, printed as one. The PDF itself is a capture — window.print() is a browser dialog the film cannot drive.',
    /* The sheets, and the print button appended after them, arrive only
       once every record has loaded -- eight teaching practices, not three. */
    settle: 5000,
    steps: [
      { do: 'hold', ms: 1600 },
      { do: 'scroll', to: 1200, ms: 3600 },
      { do: 'caption', text: 'And if you want paper, one button prints the lot.' },
      { do: 'move', to: '#printBtn' },
      { do: 'hold', ms: 2000 },
      {
        do: 'still', ms: 6000,
        want: 'The PDF itself, in colour, pages flipping',
        how: 'Print this screen to PDF and capture the PDF in Preview: every teaching practice’s feedback and grade, the plan’s spine, the analysis, the self-evaluation. Hold five seconds at least, and zoom one page so the colour reads.'
      }
    ]
  },

  {
    title: 'Close',
    screen: 'invite.html',
    about: 'The card at rest. The credit is in frame; nothing zooms on it.',
    settle: 1400,
    steps: [
      { do: 'hold', ms: 2400 },
      { do: 'caption', text: 'One link. The whole course.' },
      { do: 'hold', ms: 3000 }
    ]
  }

];
