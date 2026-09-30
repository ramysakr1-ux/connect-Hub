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
     {do:'still',  img, want, how, ms} a frame that is not Lite: `img` is a
                                      frame made for the film (film/stills/,
                                      by make-stills.mjs); without one, a card
                                      saying what to capture
     {do:'draw',   name, ms}          draw a signature on the open pad, then Sign
     {do:'zoom',   on:sel, scale, ms} push in on something
     {do:'zoom',   out:true, ms}      pull back to the whole screen
                                      (a click or a keystroke also pushes in a
                                      little by itself; ?zoom=0 turns that off)

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
   PDF beat is a `still` captured by hand, as the spec's build notes say;
   the other stills are made by make-stills.mjs. */

var SCENES = [

  /* ====================================================== The cold open == */

  {
    title: 'The same course, twice',
    screen: 'film/open.html',
    about: 'The comparison page as one animated scene, no keys, no store: four Drive windows descend, the Drive column fills with grey chips while Lite’s stops at five, the tallies land. Two captions, then a beat of black before the day stamps begin.',
    settle: 800,
    steps: [
      { do: 'hold', ms: 17200 },
      { do: 'caption', text: 'Most of this is finding the file.' },
      { do: 'hold', ms: 20400 },
      /* Tutors train; trainees teach. The line said the tutors had time to
         teach, which is not what happens on a CELTA (Ramy, 30 Sep 2026). */
      { do: 'caption', text: 'Same course. Same trainees. One of them spent the week filing.' },
      { do: 'hold', ms: 8400 }
    ]
  },

  /* ========================================== Part 1 · Before day one == */

  {
    title: 'The console',
    screen: '14_owner.html',
    about: 'The centre\u2019s console, announced. Ramy, 30 Sep 2026: the start "gets a bit back and forth\u2026 it\u2019s confusing what\u2019s happening", so each part now says whose world it is before it opens \u2014 and this one says what happens next: a link arrives. <b>Needs &amp;o=</b> (the owner key). Read-only.',
    settle: 3800,
    steps: [
      { do: 'chapter', num: 'One', text: 'The centre sets a course up', sub: 'One console. One link out to the tutors, one to each candidate.', ms: 3600 },
      { do: 'hold', ms: 1800 },
      { do: 'caption', text: 'You will be sent a link. That is the whole of it.' },
      { do: 'hold', ms: 3200 }
    ]
  },

  {
    title: 'The card arrives',
    screen: 'invite.html',
    course: 'start', day: 'Day 0',
    about: 'The card, the fact that it keeps working with the network off, and the screen it opens. Ramy, 30 Sep 2026: the two cuts showing the link parked in a Classroom stream and a Drive folder \u2014 "it lives anywhere" \u2014 read as confusing and are cut. The Wi-Fi still is made for the film; stills/classroom-stream.png and stills/drive-folder.png are kept in the folder but no longer used.',
    settle: 1400,
    steps: [
      { do: 'hold', ms: 1600 },
      { do: 'caption', text: 'Nothing to install. Nothing to remember. Nothing to lose.' },
      { do: 'hold', ms: 3400 },
      { do: 'still', ms: 4200, img: 'stills/wifi-off.png', want: 'A plain tab, Wi-Fi switched off, the page still there' },
      { do: 'caption', text: 'Works offline, and catches up when you are back.' },
      { do: 'hold', ms: 3000 },
      /* And then the screen the link opens, so the card is not left hanging. */
      { do: 'click', on: '#go', ms: 2400 },
      { do: 'goto', screen: '5_tutor_dashboard.html', course: 'start', ms: 2600 },
      { do: 'hold', ms: 2400 },
      { do: 'caption', text: 'That link, and this is behind it.' },
      { do: 'hold', ms: 3000 }
    ]
  },

  {
    title: 'A course is set up',
    screen: '6_centre_admin_dashboard.html',
    course: 'start', day: 'Day 0',
    about: 'Course admin, shown as a room before anything is done in it \u2014 the film used to open straight onto the Settings tab, which read as a jump into somebody else\u2019s screen, and looked old because its four numbered steps were never seen (Ramy, 30 Sep 2026). Then the centre, the dates, the clock, the rooms; the timetable from a pasted spreadsheet (a file chooser cannot be driven); then the roster with six links. <b>Writes stubbed</b> \u2014 the standing demo must not change.',
    settle: 2400,
    stub: ['putCourse', 'addTrainees', 'addTrainee'],
    steps: [
      { do: 'hold', ms: 2200 },
      { do: 'caption', text: 'Course admin. Four steps, once, at the start.' },
      { do: 'hold', ms: 2800 },
      { do: 'click', on: '[data-tab="settings"]', ms: 1600 },
      { do: 'hold', ms: 1200 },
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
    about: 'Selin’s home — the rooms strip, the timetable card with day one marked — then the CELTA 5: <i>Read and confirm</i>, Cambridge’s own words scrolled, the confirmation box with her name in it, <b>Confirm and sign</b>, the pad. Selin was left unconfirmed on the demo for this beat; <b>writes stubbed</b> so she stays that way. The pad is drawn by the film.',
    settle: 1800,
    stub: ['put'],
    steps: [
      { do: 'chapter', num: 'Two', text: 'The candidates arrive', sub: 'Their own link, their own booklet, and the first thing Cambridge asks of them.', ms: 3400 },
      { do: 'hold', ms: 1400 },
      { do: 'goto', screen: '20_celta5.html', course: 'start', role: 'trainee', as: 'Selin Kaya', stub: ['put'], ms: 2600 },
      { do: 'scroll', to: 420, ms: 1800 },
      { do: 'hold', ms: 600 },
      /* It used to say "this booklet is going to fill itself -- watch", and
         then nothing filled: the payoff is four minutes away, at Cambridge's
         booklet. A caption may comment, but it must not promise something the
         next shot does not do (Ramy, 30 Sep 2026). */
      { do: 'caption', text: 'Cambridge\u2019s own words, on day one, in her own hands.' },
      { do: 'scroll', to: '[data-sig="conf:portfolio"]', ms: 2200 },
      { do: 'zoom', on: '[data-sig="conf:portfolio"]', scale: 1.5, ms: 900 },
      { do: 'click', on: '[data-sign="conf:portfolio"]', ms: 1800 },
      { do: 'hold', ms: 700 },
      { do: 'zoom', on: '.ink-pad', scale: 1.5, ms: 700 },
      { do: 'draw', name: 'Selin Kaya', ms: 1500 },
      { do: 'hold', ms: 1400 },
      { do: 'zoom', out: true, ms: 1200 },
      { do: 'caption', text: 'Signed. Dated. Kept.' },
      { do: 'hold', ms: 3400 }
    ]
  },

  /* ============================================ Part 2 · The first week == */


  {
    title: 'The TP points arrive',
    screen: '24_tp_points.html',
    course: 'start', role: 'trainee', as: 'Olivia Bennett', day: 'Day 3',
    about: 'The brief for tomorrow\u2019s lesson, released by the tutor at the end of today\u2019s session: Olivia\u2019s aim, the framework, the coursebook pages, the audio, with the other two lessons of the day beside hers. Read-only. Ramy, 30 Sep 2026: the points are released after a session, so the film no longer pretends they appear overnight.',
    settle: 1800,
    steps: [
      { do: 'hold', ms: 1400 },
      { do: 'scroll', to: 260, ms: 2000 },
      { do: 'hold', ms: 1200 },
      { do: 'caption', text: 'Released at the end of the session. Tomorrow\u2019s lesson, in one card.' },
      { do: 'move', to: '.tbl .mats-read, .tbl' },
      { do: 'hold', ms: 4200 }
    ]
  },

  {
    title: 'The plan',
    screen: '1_trainee_plan_and_analysis.html',
    course: 'start', role: 'trainee', as: 'Olivia Bennett', day: 'Day 3',
    about: 'The longest scene, and deliberately \u2014 Ramy, 30 Sep 2026: "I don\u2019t see anything about the lesson plan\u2026 writing the lesson plan should be a nice part, and the language analysis." Olivia\u2019s next plan is BLANK on the demo (she teaches tomorrow; it is due today). The aim dictated, a lesson shape chosen, the stages appearing under it, the Language Analysis opened and read, a materials link pasted, the share switch to the volunteers going green. <b>Writes stubbed</b> so it stays blank for the next take.',
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
      { do: 'hold', ms: 2800 },
      { do: 'zoom', on: '#fwBtn', scale: 1.4, ms: 900 },
      { do: 'hold', ms: 2000 },
      { do: 'zoom', out: true, ms: 900 },
      /* The language analysis is half of what a CELTA plan IS, and the film
         walked past it. It opens, and the film reads it. */
      { do: 'scroll', to: '#laToggle', ms: 2200 },
      { do: 'click', on: '#laToggle', ms: 1600 },
      { do: 'hold', ms: 1600 },
      { do: 'caption', text: 'Form, meaning, pronunciation. On the same page as the lesson.' },
      { do: 'scroll', to: '#laSection', ms: 2400 },
      { do: 'hold', ms: 3200 },
      { do: 'scroll', to: '#fMatsLink', ms: 2200 },
      { do: 'type', into: '#fMatsLink', ms: 1800, text: 'https://drive.google.com/file/d/demo-penguins-adapted/view' },
      { do: 'hold', ms: 900 },
      { do: 'zoom', on: '#fShareVol', scale: 1.5, ms: 900 },
      { do: 'click', on: '#fShareVol', ms: 1800 },
      { do: 'hold', ms: 1600 },
      { do: 'caption', text: 'One switch, and tonight\u2019s reading is on every student\u2019s page.' },
      { do: 'hold', ms: 3000 },
      { do: 'zoom', out: true, ms: 1000 }
    ]
  },

  {
    title: 'A volunteer’s page',
    screen: '26_volunteer.html',
    course: 'start', role: 'volunteer', as: 'Omar', day: 'Day 1',
    about: 'The other end of that switch, which is why it now follows the plan rather than interrupting it (Ramy, 30 Sep 2026). Omar has not agreed yet on the demo, so his link opens on the joining note: Turkish is chosen, <i>Kabul ediyorum</i>, and behind it his page \u2014 the next class in the course\u2019s clock, the material the candidate just shared, <b>Join on Zoom</b>. <b>volunteerAgree stubbed</b> \u2014 he stays unagreed for the next take.',
    settle: 1800,
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
    about: 'The trainer\u2019s own screen, announced as one: the counters and the rows \u2014 two waiting for feedback, one assignment to mark, and beside a name the time a plan was turned in. Read-only.',
    settle: 1800,
    steps: [
      { do: 'chapter', num: 'Three', text: 'Now the trainer\u2019s screen', sub: 'Everything the course has turned in, waiting in one list.', ms: 3600 },
      { do: 'hold', ms: 1600 },
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
      { do: 'zoom', on: '#lST .pt:last-child', scale: 1.7, ms: 900 },
      { do: 'click', on: '.dictbtn', ms: 1500 },
      { do: 'type', into: '#lST .pt:last-child .pt-text', ms: 4000, text: 'Set the task before handing out the text, and checked it with a quick question' },
      { do: 'caption', text: 'Said, not typed.' },
      { do: 'hold', ms: 1800 },
      { do: 'move', to: '#lST .pt:last-child .suggest-row' },
      { do: 'hold', ms: 1500 },
      { do: 'click', on: '#lST .pt:last-child .suggest-chip', ms: 1800 },
      { do: 'caption', text: 'It learns your centre.' },
      { do: 'hold', ms: 2200 },
      { do: 'zoom', out: true, ms: 1200 }
    ]
  },

  {
    title: 'Feedback, all at once',
    screen: '3_tutor_feedback.html',
    course: 'start', params: { trainee: 'Sofia' }, day: 'Day 4',
    about: 'The exchange: Copy, talk it through elsewhere, Paste something back, every box fills, Return \u2014 and then the finished thing, on the candidate\u2019s own screen, with the comments in it and a Print button under them (Ramy, 30 Sep 2026: "I want to see the finished PDF of the tutor feedback as well, with the comments"). Writes stubbed.',
    settle: 2200,
    stub: ['put'],
    steps: [
      { do: 'scroll', to: 300, ms: 1440 },
      { do: 'click', on: '#xCopy', ms: 1800 },
      { do: 'still', ms: 2400, img: 'stills/exchange-window.png', want: 'The brief pasted into any model, and the trainer talking the lesson through', how: 'A dictation window with the copied brief in it. If it cannot be shown, cut straight from Copy to Paste something back.' },
      { do: 'click', on: '#xPasteToggle', ms: 1400 },
      { do: 'hold', ms: 1400 },
      { do: 'caption', text: 'The rest of the form was already there.' },
      { do: 'move', to: '#returnBtn' },
      { do: 'hold', ms: 2400 },
      /* What the candidate opens: every teaching practice the tutor has
         returned, the plan and the self-evaluation beside each one, and Print
         at the foot of it. The document, not the form. */
      { do: 'goto', screen: '4_feedback_returned.html', course: 'start', role: 'trainee', as: 'Sofia Kuznetsova', ms: 3200 },
      { do: 'hold', ms: 2000 },
      { do: 'caption', text: 'Her copy, the same evening. Printable, and hers to keep.' },
      { do: 'scroll', to: 700, ms: 3000 },
      { do: 'hold', ms: 2200 },
      { do: 'scroll', to: 'bottom', ms: 3000 },
      { do: 'hold', ms: 2600 }
    ]
  },

  {
    title: 'Stage 1, signed',
    screen: '20_celta5.html',
    course: 'start', params: { trainee: 'Sofia' }, day: 'Day 6',
    about: 'The tutor’s side of Sofia’s CELTA 5: Stage 1 written, <b>Return to candidate</b>, the pad (drawn by the film). Then Deniz’s side — his Stage 1 is returned and unsigned on the demo — <b>Sign</b>, the pad, the green block; below it the teaching practice table already holding TP1 and TP2. <b>Writes stubbed</b> on both sides.',
    settle: 2400,
    stub: ['put'],
    steps: [
      { do: 'scroll', to: '#s1', ms: 2200 },
      { do: 'hold', ms: 1400 },
      /* One signature in the whole film. It was drawn three times over and
         Ramy counted five or six (Ramy, 30 Sep 2026: "I just wanted to show
         it once"); the one that stays is Selin signing Cambridge\u2019s
         confirmation, because that is a candidate\u2019s own hand on the record
         Cambridge reads. Here the tutor returns the stage and the film moves
         on. */
      { do: 'click', on: '[data-return="stage1"]', ms: 1800 },
      { do: 'hold', ms: 2600 },
      { do: 'caption', text: 'Signed on screen. Personal, and dated to the second.' },
      { do: 'goto', screen: '20_celta5.html', course: 'start', role: 'trainee', as: 'Deniz Arslan', stub: ['put'], ms: 3000 },
      { do: 'scroll', to: '#s1', ms: 2000 },
      { do: 'hold', ms: 1400 },
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
      { do: 'zoom', on: '.derived', scale: 1.8, ms: 1000 },
      { do: 'hold', ms: 1600 },
      { do: 'zoom', out: true, ms: 1000 },
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
    settle: 1800,
    stub: ['gridSet'],
    steps: [
      { do: 'hold', ms: 1400 },
      { do: 'move', to: '.cell.clash' },
      { do: 'zoom', on: '.cell.clash', scale: 1.7, ms: 900 },
      { do: 'hold', ms: 1200 },
      { do: 'caption', text: 'Two of them chose grammar. The grid noticed first.' },
      { do: 'hold', ms: 2800 },
      { do: 'zoom', out: true, ms: 1200 }
    ]
  },

  /* ================================================ Part 4 · The visit == */

  {
    title: 'The register, and the certificate',
    screen: '25_volunteer_register.html',
    course: 'visit', day: 'Day 17',
    about: 'One tap on today’s block for the first student, the hours tick up, then the certificate: hers, already signed by the centre on the demo. <b>putCourse stubbed</b> so the tap does not stick.',
    settle: 1800,
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
    about: 'The assessor\u2019s own view, announced as one \u2014 Ramy could not tell it was in the film. Opened with the assessor\u2019s read-only key: the header line, the Handbook panel, the candidates chosen first, the double-marking record, the volunteer students, the course documents. Scrolled, never clicked into. Nothing is downloaded, exported or sent.',
    settle: 2400,
    steps: [
      { do: 'chapter', num: 'Four', text: 'The assessor\u2019s visit', sub: 'A link of their own, read-only, that ends when the course does.', ms: 3600 },
      { do: 'hold', ms: 1600 },
      { do: 'caption', text: 'This is the assessor\u2019s screen. Nothing was assembled for it.' },
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
      { do: 'chapter', num: 'Five', text: 'The end of the course', sub: 'The grades, Cambridge\u2019s booklet, and what the candidate is sent.', ms: 3400 },
      { do: 'hold', ms: 1200 },
      { do: 'scroll', to: 800, ms: 2400 },
      { do: 'hold', ms: 1000 },
      { do: 'click', on: 'text:Add from the TP records', ms: 1800 },
      { do: 'hold', ms: 1400 },
      { do: 'caption', text: 'That sentence was written in week two. It just came back.' },
      { do: 'hold', ms: 2800 },
      { do: 'zoom', out: true, ms: 1200 }
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
      { do: 'zoom', on: '#final', scale: 1.35, ms: 1100 },
      { do: 'hold', ms: 1400 },
      { do: 'caption', text: 'Twenty days. Two signatures.' },
      { do: 'hold', ms: 2600 },
      { do: 'zoom', out: true, ms: 1400 }
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
      /* Now it has: this is the shot the booklet was filling itself for. */
      { do: 'caption', text: 'Nobody filled this in. The course did.' },
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
      { do: 'still', ms: 4200, img: 'stills/print-dialog.png', want: 'The print dialog over Cambridge’s booklet', how: 'Press Print on camera and capture the dialog; the film cannot drive it.' },
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
      { do: 'still', ms: 3800, img: 'stills/next-course-card.png', want: 'The new course’s card on the console, an empty roster, the switches all off', how: 'Clone once by hand, capture the card, delete the course.' }
    ]
  },

  {
    title: 'The report she is sent',
    screen: '16_final_report.html',
    course: 'finished', params: { id: 'Olivia Bennett' }, day: 'Day 20',
    about: 'What the centre sends the candidate at the end: the confirmation line, the hours, the grade, the assessment areas, the overall comment, both tutors\u2019 signatures. Shot from the tutor\u2019s link because the room is shut to a candidate on purpose \u2014 Lite has no release step yet, and the page says so to a trainee. Read-only.',
    settle: 5000,
    steps: [
      { do: 'hold', ms: 1800 },
      { do: 'zoom', on: '.name', scale: 1.7, ms: 1300 },
      { do: 'caption', text: 'Four weeks, and it is hers.' },
      { do: 'hold', ms: 2000 },
      { do: 'zoom', out: true, ms: 1200 },
      { do: 'scroll', to: 700, ms: 2800 },
      { do: 'hold', ms: 2400 },
      { do: 'scroll', to: 1500, ms: 2800 },
      { do: 'caption', text: 'Nothing on it was written twice.' },
      { do: 'hold', ms: 3200 }
    ]
  },

  {
    title: 'Email me',
    screen: 'film/end.html',
    about: 'The last card, a page of the film\u2019s own: the mark, the one line, and the address \u2014 which arrives as <b>&amp;email=</b> on the film\u2019s own URL and is in no file, because this repository is public. Without it the address line is simply left out.',
    settle: 600,
    steps: [
      { do: 'hold', ms: 9000 }
    ]
  },
];
