/* Connect Lite — the film, scene by scene.
   © 2026 Ramy Sakr.

   The spec is DEMO-ANIMATION-SPEC.md (restructured 30 Sep 2026): a cold open
   from the Drive-versus-Lite page, then five parts told by the calendar, with
   the CELTA 5 as the through-line. This file is the spec made executable:
   every scene names a real screen and drives it. Re-timing the film is
   editing numbers here, not re-rendering anything.

   WHO A SCENE IS
     course: 'start'     the first-week demo, c6, pinned to day 6      (?sk=)
             'visit'     the before-the-visit demo, c7, day 17         (?vk=)
             'finished'  the finished course, c4 -- part 5             (?fk=)
             'demo'      the running demo, c3                          (?k=)
             'scratch'   the film's scratch course, c5                 (?s=)
     role:   'tutor'     the course's tutor key                        -- default
             'trainee'   that candidate's own token, with `as: 'Their Name'`
             'assessor'  the course's read-only key
             'volunteer' a volunteer student's own link, with `as: 'First'`
     day:    the day stamp on the stage, bottom left, for the whole scene.
   Every token and key is looked up from the store with READ ops, so only the
   course keys go on the film's URL and nothing secret lives in this file.

   STEPS
     {do:'caption', text}             one line, floats up, holds, fades
     {do:'move',   to:sel}            glide the cursor there
     {do:'click',  on:sel}            glide, then click
     {do:'type',   into:sel, text, ms}
     {do:'scroll', to:'bottom'|px|sel, ms}
     {do:'hold',   ms}
     {do:'goto',   screen, role, as}  same scene, another screen or person
     {do:'still',  want, how, ms}     a frame that is not Lite, or a PDF

   A selector is CSS, or `text:Some words` to find a control by what it says.

   CAPTIONS. Ramy, 30 Sep 2026: "I don't want the captions to read what's
   already there, but rather make a smart comment on what's on the screen."
   Every line below is a comment or a benefit, never a description.

   WRITES. The two standing demos are what a centre will be sent, so nothing
   on them may be altered by a take: every scene that could write lists the
   op in `stub`, and the engine always holds HubSync's flush. Two beats were
   left open on the first-week demo for the camera (Selin's confirmations,
   Olivia's next plan) and the stub is what keeps them open.

   PRINTING. window.print() is a browser dialog the film cannot drive; every
   PDF beat is a `still` captured by hand, as the spec's build notes say. */

var SCENES = [

  /* ====================================================== The cold open == */

  {
    title: 'The same course, twice',
    screen: 'film/open.html',
    about: 'The comparison page as one animated scene, no keys, no store: four Drive windows descend, the Drive column fills with grey chips while Lite’s stops at five, the tallies land. Two captions, then a beat of black before the day stamps begin.',
    settle: 800,
    steps: [
      { do: 'hold', ms: 12800 },
      { do: 'caption', text: 'Most of this is finding the file.' },
      { do: 'hold', ms: 15200 },
      { do: 'caption', text: 'Same course. Same tutors. One of them had time to teach.' },
      { do: 'hold', ms: 6200 }
    ]
  },

  /* ========================================== Part 1 · Before day one == */

  {
    title: 'The console',
    screen: '14_owner.html',
    about: 'A held frame, no words. <b>Needs &amp;o=</b> (the owner key) on the film’s address. Read-only.',
    settle: 3800,
    steps: [{ do: 'hold', ms: 1540 }]
  },

  {
    title: 'The card arrives',
    screen: 'invite.html',
    course: 'start', day: 'Day 0',
    about: 'The tutor’s invitation card as the trainer receives it, then three cuts of the link sitting where a course already lives: a Classroom stream, a Drive folder, a plain tab with the Wi-Fi going off. The stills are made for the film, from the demo.',
    settle: 1400,
    steps: [
      { do: 'hold', ms: 1200 },
      { do: 'caption', text: 'Nothing to install. Nothing to remember. Nothing to lose.' },
      { do: 'hold', ms: 3200 },
      { do: 'still', ms: 3000, want: 'The link inside a demo Classroom stream, then inside a demo Drive folder', how: 'Two frames, one cut each. Made-up centre, made-up names.' },
      { do: 'still', ms: 3400, want: 'A plain tab, Wi-Fi switched off, the page still there', how: 'Toggle Wi-Fi on camera; hold four seconds on the page not changing.' },
      { do: 'caption', text: 'Works offline.' },
      { do: 'hold', ms: 2600 },
      { do: 'click', on: '#go', ms: 2200 }
    ]
  },

  {
    title: 'A course is set up',
    screen: '6_centre_admin_dashboard.html',
    course: 'start', day: 'Day 0',
    about: 'Course admin: the centre, the dates, the clock, the three online rooms. Then the timetable: a spreadsheet PASTED in (a file chooser cannot be driven), the review, Apply, every day laid out. Then the roster with six links. <b>Writes stubbed</b> — the standing demo must not change.',
    settle: 2000,
    stub: ['putCourse', 'addTrainees', 'addTrainee'],
    steps: [
      { do: 'click', on: '[data-tab="settings"]', ms: 1400 },
      { do: 'hold', ms: 900 },
      { do: 'scroll', to: '#courseZone', ms: 1800 },
      { do: 'hold', ms: 1400 },
      { do: 'goto', screen: '23_timetable.html', course: 'start', stub: ['putCourse'], ms: 2600 },
      { do: 'click', on: '#importOpen', ms: 1400 },
      { do: 'type', into: '#impPaste', ms: 3600, text: 'Date\tSession 1\tSession 2\n02/03/2026\tWelcome and the portfolio\tDemonstration lesson\n03/03/2026\tThe lesson framework\tClassroom management\n04/03/2026\tReceptive skills: reading\tLanguage analysis 1' },
      { do: 'click', on: '#impRead', ms: 1800 },
      { do: 'hold', ms: 1600 },
      { do: 'caption', text: 'The spreadsheet you already had, read once.' },
      { do: 'click', on: '#impApply', ms: 2200 },
      { do: 'hold', ms: 2200 },
      { do: 'goto', screen: '6_centre_admin_dashboard.html', course: 'start', stub: ['putCourse', 'addTrainees', 'addTrainee'], ms: 2400 },
      { do: 'click', on: '[data-tab="roster"]', ms: 1400 },
      { do: 'hold', ms: 1200 },
      { do: 'caption', text: 'One link each. No accounts.' },
      { do: 'move', to: '.roster .acts button[data-copy]' },
      { do: 'hold', ms: 2600 }
    ]
  },

  {
    title: 'The candidate reads Cambridge’s words',
    screen: 'index.html',
    course: 'start', role: 'trainee', as: 'Selin Kaya', day: 'Day 0',
    about: 'Selin’s home — the rooms strip, the timetable card with day one marked — then the CELTA 5: <i>Read and confirm</i>, Cambridge’s own words scrolled, the confirmation box with her name in it, <b>Confirm and sign</b>, the pad. Selin was left unconfirmed on the demo for this beat; <b>writes stubbed</b> so she stays that way. The pad is drawn on camera.',
    settle: 1800,
    stub: ['put'],
    steps: [
      { do: 'hold', ms: 1400 },
      { do: 'goto', screen: '20_celta5.html', course: 'start', role: 'trainee', as: 'Selin Kaya', stub: ['put'], ms: 2600 },
      { do: 'scroll', to: 420, ms: 2400 },
      { do: 'hold', ms: 1200 },
      { do: 'caption', text: 'This booklet is going to fill itself. Watch.' },
      { do: 'scroll', to: '[data-sig="conf:portfolio"]', ms: 2200 },
      { do: 'click', on: '[data-sign="conf:portfolio"]', ms: 1800 },
      { do: 'hold', ms: 5200 },
      { do: 'caption', text: 'Signed. Dated. Kept.' },
      { do: 'hold', ms: 3400 }
    ]
  },

  /* ============================================ Part 2 · The first week == */

  {
    title: 'A volunteer’s page',
    screen: '26_volunteer.html',
    course: 'start', role: 'volunteer', as: 'Omar', day: 'Day 1',
    about: 'Omar has not agreed yet on the demo, so his link opens on the joining note. Turkish is chosen, <i>Kabul ediyorum</i>, and the page behind it: the next class in the course’s clock, <b>Join on Zoom</b>. <b>volunteerAgree stubbed</b> — he stays unagreed for the next take.',
    settle: 12000,
    stub: ['volunteerAgree'],
    steps: [
      { do: 'hold', ms: 1400 },
      { do: 'click', on: '.consent [data-lang="tr"]', ms: 1600 },
      { do: 'hold', ms: 1800 },
      { do: 'caption', text: 'Their language for the small print. English for the lesson.' },
      { do: 'hold', ms: 2200 },
      { do: 'click', on: '#cAgree', ms: 1800 },
      { do: 'hold', ms: 1600 },
      { do: 'move', to: '.next .room' },
      { do: 'caption', text: 'One tap to the room.' },
      { do: 'hold', ms: 3000 }
    ]
  },

  {
    title: 'The TP points arrive',
    screen: '24_tp_points.html',
    course: 'start', role: 'trainee', as: 'Olivia Bennett', day: 'Day 3',
    about: 'Olivia’s own lesson on the released points: aim, framework, the coursebook pages, the audio, with the other two lessons of the day beside hers for reference. Read-only.',
    settle: 12000,
    steps: [
      { do: 'hold', ms: 1400 },
      { do: 'scroll', to: 260, ms: 2000 },
      { do: 'hold', ms: 1200 },
      { do: 'caption', text: 'The pages, the audio, the aim. Already on the card when they wake up.' },
      { do: 'move', to: '.tbl .mats-read, .tbl' },
      { do: 'hold', ms: 4200 }
    ]
  },

  {
    title: 'The plan',
    screen: '1_trainee_plan_and_analysis.html',
    course: 'start', role: 'trainee', as: 'Olivia Bennett', day: 'Day 3',
    about: 'Olivia’s next plan is BLANK on the demo (she teaches tomorrow; it is due today). The aim dictated, a lesson shape chosen, the stages appear, a Drive link pasted, the share switch to the volunteers goes green. <b>Writes stubbed</b> so it stays blank. Dictation needs Chrome with the microphone already permitted.',
    settle: 2000,
    stub: ['put', 'shareMaterial'],
    steps: [
      { do: 'hold', ms: 1100 },
      { do: 'click', on: '#fMain', ms: 900 },
      { do: 'click', on: '.dictbtn', ms: 1500 },
      { do: 'type', into: '#fMain', ms: 3800, text: 'By the end of the lesson learners will be better able to understand a short article about jobs, reading first for gist and then for detail.' },
      { do: 'hold', ms: 1000 },
      { do: 'click', on: '#fwBtn', ms: 1400 },
      { do: 'hold', ms: 1400 },
      { do: 'caption', text: 'The shape is given. The thinking is theirs.' },
      { do: 'hold', ms: 2600 },
      { do: 'scroll', to: '#fMatsLink', ms: 2200 },
      { do: 'type', into: '#fMatsLink', ms: 1800, text: 'https://drive.google.com/file/d/demo-penguins-adapted/view' },
      { do: 'hold', ms: 900 },
      { do: 'click', on: '#fShareVol', ms: 1600 },
      { do: 'hold', ms: 2600 }
    ]
  },

  {
    title: 'Taught, and written up',
    screen: '2_trainee_self_evaluation.html',
    course: 'start', role: 'trainee', as: 'Marcus Ellery', day: 'Day 4',
    about: 'Marcus taught today and has not written yet. The first box, dictated; then the observation sheet for the second filmed lesson, which he has not done either — notes typed, <b>Turn in</b>, the date lands. <b>Writes stubbed.</b>',
    settle: 1800,
    stub: ['put'],
    steps: [
      { do: 'hold', ms: 900 },
      { do: 'click', on: '#sWell', ms: 900 },
      { do: 'type', into: '#sWell', ms: 3400, text: 'The task was set before the handout went out, and the pair check gave everyone an answer ready before I nominated.' },
      { do: 'hold', ms: 1100 },
      { do: 'caption', text: 'Written before the feedback is read. That is the point of it.' },
      { do: 'hold', ms: 2600 },
      { do: 'goto', screen: '18_observation_tasks.html', course: 'start', role: 'trainee', as: 'Marcus Ellery', params: { task: 'filmed2' }, stub: ['put'], ms: 3000 },
      { do: 'click', on: 'textarea[data-f="r0"]', ms: 900 },
      { do: 'type', into: 'textarea[data-f="r0"]', ms: 2600, text: 'Yes — the instruction came before the paper, and she checked it with one question.' },
      { do: 'hold', ms: 800 },
      { do: 'click', on: '#turnIn', ms: 1800 },
      { do: 'hold', ms: 2200 }
    ]
  },

  {
    title: 'The trainer’s desk',
    screen: '5_tutor_dashboard.html',
    course: 'start', day: 'Day 4',
    about: 'The counters and the rows: two waiting for feedback, one assignment to mark, and beside a name the time a plan was turned in. Read-only.',
    settle: 12000,
    steps: [
      { do: 'hold', ms: 1200 },
      { do: 'move', to: '.qcard[data-tab="tp"]' },
      { do: 'hold', ms: 1600 },
      { do: 'caption', text: 'Nobody asked “did you get it?”' },
      { do: 'hold', ms: 2600 },
      { do: 'scroll', to: 420, ms: 1800 },
      { do: 'hold', ms: 1600 }
    ]
  },

  {
    title: 'Feedback, said',
    screen: '3_tutor_feedback.html',
    course: 'start', params: { trainee: 'Sofia' }, day: 'Day 4',
    about: 'Sofia taught on Friday and is waiting: her plan and self-evaluation are in, the feedback is not. The date and the level are already on the form. A point dictated, the criterion chips under it, one solid — tagged before on this course — and the code lands inside the sentence. <b>Writes stubbed</b>, so she keeps waiting for the next take.',
    settle: 2200,
    stub: ['put'],
    steps: [
      { do: 'hold', ms: 900 },
      { do: 'click', on: 'button[data-list="lST"]', ms: 1200 },
      { do: 'click', on: '#lST .pt:last-child .pt-text', ms: 900 },
      { do: 'click', on: '.dictbtn', ms: 1500 },
      { do: 'type', into: '#lST .pt:last-child .pt-text', ms: 4000, text: 'Set the task before handing out the text, and checked it with a quick question' },
      { do: 'caption', text: 'Said, not typed.' },
      { do: 'hold', ms: 1800 },
      { do: 'move', to: '#lST .pt:last-child .suggest-row' },
      { do: 'hold', ms: 1500 },
      { do: 'click', on: '#lST .pt:last-child .suggest-chip', ms: 1800 },
      { do: 'caption', text: 'It learns your centre.' },
      { do: 'hold', ms: 3000 }
    ]
  },

  {
    title: 'Feedback, all at once',
    screen: '3_tutor_feedback.html',
    course: 'start', params: { trainee: 'Sofia' }, day: 'Day 4',
    about: 'The exchange: Copy, talk it through elsewhere, Paste something back, every box fills, Return. Writes stubbed.',
    settle: 2200,
    stub: ['put'],
    steps: [
      { do: 'scroll', to: 300, ms: 1440 },
      { do: 'click', on: '#xCopy', ms: 1800 },
      { do: 'still', ms: 2400, want: 'The brief pasted into any model, and the trainer talking the lesson through', how: 'A dictation window with the copied brief in it. If it cannot be shown, cut straight from Copy to Paste something back.' },
      { do: 'click', on: '#xPasteToggle', ms: 1400 },
      { do: 'hold', ms: 1400 },
      { do: 'caption', text: 'The rest of the form was already there.' },
      { do: 'move', to: '#returnBtn' },
      { do: 'hold', ms: 3200 }
    ]
  },

  {
    title: 'Stage 1, signed',
    screen: '20_celta5.html',
    course: 'start', params: { trainee: 'Sofia' }, day: 'Day 6',
    about: 'The tutor’s side of Sofia’s CELTA 5: Stage 1 written, <b>Return to candidate</b>, the pad (drawn on camera). Then Deniz’s side — his Stage 1 is returned and unsigned on the demo — <b>Sign</b>, the pad, the green block; below it the teaching practice table already holding TP1 and TP2. <b>Writes stubbed</b> on both sides.',
    settle: 2400,
    stub: ['put'],
    steps: [
      { do: 'scroll', to: '#s1', ms: 2200 },
      { do: 'hold', ms: 1400 },
      { do: 'click', on: '[data-return="stage1"]', ms: 1800 },
      { do: 'hold', ms: 4200 },
      { do: 'caption', text: 'Signed on screen. Personal, and dated to the second.' },
      { do: 'goto', screen: '20_celta5.html', course: 'start', role: 'trainee', as: 'Deniz Arslan', stub: ['put'], ms: 3000 },
      { do: 'scroll', to: '#s1', ms: 2000 },
      { do: 'click', on: '[data-sign="c1:signed"]', ms: 1800 },
      { do: 'hold', ms: 3600 },
      { do: 'scroll', to: '#tp', ms: 2200 },
      { do: 'caption', text: 'Nothing here was typed twice.' },
      { do: 'hold', ms: 3400 }
    ]
  },

  /* ============================================== Part 3 · The middle == */

  {
    title: 'An assignment, marked and back',
    screen: '10_tutor_assignment_marking.html',
    course: 'visit', params: { trainee: 'Olivia', a: 'lfc' }, day: 'Day 9',
    about: 'Olivia’s Lessons from the Classroom is really awaiting marking on the visit demo. Five criteria marked on camera, the outcome works itself out, a comment typed; <b>writes stubbed</b>. Then the double-marking table on the assessor pack, then Deniz’s record: two rounds, one outcome.',
    settle: 5000,
    stub: ['put'],
    steps: [
      { do: 'hold', ms: 900 },
      { do: 'scroll', to: 700, ms: 2000 },
      { do: 'click', on: '[data-crit="0"]', ms: 1000 },
      { do: 'click', on: '[data-crit="1"]', ms: 900 },
      { do: 'click', on: '[data-crit="2"]', ms: 900 },
      { do: 'click', on: '[data-crit="3"]', ms: 900 },
      { do: 'click', on: '[data-crit="4"]', ms: 1200 },
      { do: 'move', to: '.derived' },
      { do: 'hold', ms: 1400 },
      { do: 'type', into: '#comment', ms: 2800, text: 'Honest about the lesson that did not work, and specific about what changed after it. Passed.' },
      { do: 'hold', ms: 1000 },
      { do: 'goto', screen: '12_assessor_pack.html', course: 'visit', role: 'assessor', ms: 3200 },
      { do: 'scroll', to: 'text:Double-marking record', ms: 2400 },
      { do: 'caption', text: 'Two markers. One script. No second copy anywhere.' },
      { do: 'hold', ms: 3200 },
      { do: 'goto', screen: '11_assignment_record.html', course: 'visit', role: 'trainee', as: 'Deniz Arslan', ms: 3000 },
      { do: 'scroll', to: 500, ms: 2200 },
      { do: 'hold', ms: 2600 }
    ]
  },

  {
    title: 'Stage 2, both halves',
    screen: '20_celta5.html',
    course: 'visit', params: { trainee: 'Olivia' }, day: 'Day 12',
    about: 'The tutor’s view of Olivia’s CELTA 5 at Stage 2: her self-assessment column beside the tutor’s, 41 criteria, both signatures. Then the tables: seven TPs, three assignments, the observations. Read-only.',
    settle: 2400,
    steps: [
      { do: 'scroll', to: '#s2', ms: 2400 },
      { do: 'hold', ms: 1800 },
      { do: 'scroll', to: 1900, ms: 2400 },
      { do: 'hold', ms: 1400 },
      { do: 'scroll', to: '#tp', ms: 2400 },
      { do: 'caption', text: 'Same booklet. More of it full.' },
      { do: 'hold', ms: 3600 }
    ]
  },

  {
    title: 'The planning grid',
    screen: '21_tp_grid.html',
    course: 'visit', role: 'trainee', as: 'Olivia Bennett', day: 'Day 15',
    about: 'The group’s rows for TP7 and TP8 as Olivia sees them: hers editable, the others read, and two cells amber where two of them chose the same aim. Read-only in the take.',
    settle: 12000,
    stub: ['gridSet'],
    steps: [
      { do: 'hold', ms: 1400 },
      { do: 'move', to: '.cell.clash' },
      { do: 'hold', ms: 1200 },
      { do: 'caption', text: 'Two of them chose grammar. The grid noticed first.' },
      { do: 'hold', ms: 3600 }
    ]
  },

  /* ================================================ Part 4 · The visit == */

  {
    title: 'The register, and the certificate',
    screen: '25_volunteer_register.html',
    course: 'visit', day: 'Day 17',
    about: 'One tap on today’s block for the first student, the hours tick up, then the certificate: hers, already signed by the centre on the demo. <b>putCourse stubbed</b> so the tap does not stick.',
    settle: 12000,
    stub: ['putCourse'],
    steps: [
      { do: 'hold', ms: 1200 },
      { do: 'click', on: '.who .seg.soon', ms: 1800 },
      { do: 'caption', text: 'One tap. The hours did the rest.' },
      { do: 'hold', ms: 2800 },
      { do: 'goto', screen: '27_volunteer_certificate.html', course: 'visit', role: 'volunteer', as: 'Ayşe', ms: 3200 },
      { do: 'hold', ms: 1200 },
      { do: 'caption', text: 'Signed by the centre. Printed by the student.' },
      { do: 'hold', ms: 4000 }
    ]
  },

  {
    title: 'The assessor’s link',
    screen: '12_assessor_pack.html',
    course: 'visit', role: 'assessor', day: 'Day 19',
    about: 'The pack from the assessor’s own read-only key: the header line, the Handbook panel, the candidates chosen first, the double-marking record, the volunteer students, the course documents. Scrolled, never clicked into. Nothing is downloaded, exported or sent.',
    settle: 2400,
    steps: [
      { do: 'hold', ms: 1400 },
      { do: 'caption', text: 'Read-only. Ends with the course.' },
      { do: 'hold', ms: 2400 },
      { do: 'scroll', to: 900, ms: 2800 },
      { do: 'hold', ms: 1200 },
      { do: 'scroll', to: 'text:Volunteer students', ms: 2800 },
      { do: 'caption', text: 'Everything the Handbook lists, and nothing was gathered.' },
      { do: 'hold', ms: 3600 }
    ]
  },

  {
    title: 'Grades',
    screen: '13_grades_report.html',
    course: 'visit', day: 'Day 19',
    about: 'Cambridge’s own form: the provisional table, a candidate’s four sections, <b>Add from the TP records</b> and the trainer’s own point lands with its code. Writes stubbed.',
    settle: 2400,
    stub: ['put', 'putCourse'],
    steps: [
      { do: 'hold', ms: 1200 },
      { do: 'scroll', to: 800, ms: 2400 },
      { do: 'hold', ms: 1000 },
      { do: 'click', on: 'text:Add from the TP records', ms: 1800 },
      { do: 'hold', ms: 1600 },
      { do: 'caption', text: 'That sentence was written in week two. It just came back.' },
      { do: 'hold', ms: 3800 }
    ]
  },

  /* ================================================== Part 5 · The end == */

  {
    title: 'The final declaration',
    screen: '20_celta5.html',
    course: 'finished', role: 'trainee', as: 'Olivia Bennett', day: 'Day 20',
    about: 'The five checks, the candidate’s signature, the tutor’s, both dated. <b>The finished course (c4) still needs its CELTA 5 dressed</b> — every stage signed, the declarations both sides — before this and the two scenes after it can be shot.',
    settle: 2400,
    steps: [
      { do: 'scroll', to: '#final', ms: 2600 },
      { do: 'hold', ms: 1400 },
      { do: 'caption', text: 'Twenty days. Two signatures.' },
      { do: 'hold', ms: 3400 }
    ]
  },

  {
    title: 'Cambridge’s booklet',
    screen: '20_celta5.html',
    course: 'finished', params: { trainee: 'Olivia' }, day: 'Day 20',
    about: 'The July 2023 form drawn in the browser from the record: the cover, the confirmations, the three stages, every table full, every signature in ink. The line the film was made for; nothing moves under it.',
    settle: 2400,
    steps: [
      { do: 'click', on: '#cambridgePdf', ms: 2200 },
      { do: 'hold', ms: 2400 },
      { do: 'caption', text: 'The record wrote itself.' },
      { do: 'hold', ms: 6000 },
      { do: 'still', ms: 3200, want: 'The booklet’s pages turning: Stage 1, Stage 2, Stage 3, the tables', how: 'Scroll the drawn PDF slowly on camera; the film holds this frame for it.' }
    ]
  },

  {
    title: 'Paper, if you want it',
    screen: '20_celta5.html',
    course: 'finished', params: { trainee: 'Olivia' }, day: 'Day 20',
    about: 'A captured still of the print dialog over the booklet. The one printing beat in the film, as an option.',
    settle: 1600,
    steps: [
      { do: 'still', ms: 4200, want: 'The print dialog over Cambridge’s booklet', how: 'Press Print on camera and capture the dialog; the film cannot drive it.' },
      { do: 'caption', text: 'Print it, if a drawer needs it.' },
      { do: 'hold', ms: 2200 }
    ]
  },

  {
    title: 'The next course',
    screen: '14_owner.html',
    course: 'finished', day: 'Day 20',
    about: '<b>Start the next course from this</b> on the console: the cursor rests on it, and a still of the new course’s card — the wording, the rooms, the timetable shape carried, every switch off, an empty roster. Not clicked in the take: it would really make a course.',
    settle: 3800,
    steps: [
      { do: 'hold', ms: 1000 },
      { do: 'move', to: '[data-clone]' },
      { do: 'hold', ms: 1600 },
      { do: 'caption', text: 'The wording stays. The people change.' },
      { do: 'still', ms: 3800, want: 'The new course’s card on the console, an empty roster, the switches all off', how: 'Clone once by hand, capture the card, delete the course.' }
    ]
  },

  {
    title: 'Close',
    screen: 'offer.html',
    course: 'start',
    about: 'The card a centre receives: what Lite is, what it costs, the four doors. The last frame.',
    settle: 2600,
    steps: [
      { do: 'hold', ms: 1800 },
      { do: 'caption', text: 'One link, and a course happens inside it.' },
      { do: 'hold', ms: 3000 },
      { do: 'scroll', to: 600, ms: 3000 },
      { do: 'hold', ms: 3200 }
    ]
  },
];
