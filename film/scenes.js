/* Connect Lite — the film, scene by scene.
   © 2026 Ramy Sakr.

   The spec is DEMO-ANIMATION-SPEC.md (restructured 30 Sep 2026): a cold open
   from the Drive-versus-Lite page, then five parts told by the calendar, with
   the CELTA 5 as the through-line. This file is the spec made executable:
   every scene names a real screen and drives it. Re-timing the film is
   editing numbers here, not re-rendering anything.

   WHO A SCENE IS
     course: 'start'     the first-week demo, c6, pinned to day 6      (?sk=)
             'visit'     the before-the-visit demo, c7, day 13         (?vk=)
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
   left open on the first-week demo for the camera (Wei's confirmations,
   Aiko's next plan) and the stub is what keeps them open.

   PRINTING. window.print() is a browser dialog the film cannot drive; every
   PDF beat is a `still` captured by hand, as the spec's build notes say;
   the other stills are made by make-stills.mjs.

   LENGTH. Ramy asked for seven minutes; the fourth take ran thirteen and a
   half. The cut of 1 Oct 2026 took it down without losing a chapter: a third
   of the film was holds on a picture that had stopped moving, so every hold,
   click, scroll and zoom came down by a fixed fraction; the cold open stopped
   waiting ten seconds for its own tallies; and four beats that said what the
   NEXT shot showed were dropped -- Stage 2 of the booklet, the final
   declaration, the walk back to the Course menu, and a third assignment
   screen with nothing said over it. The volunteer chapter was left at full
   pace on purpose (Ramy, 1 Oct 2026: slow that part down), and the volunteer
   student's own page moved into it, where it belongs. The chapters now run
   One to Ten; they used to skip Four, because the chapter that carried it was
   deleted and nothing renumbered. */

var SCENES = [

  /* ====================================================== The cold open == */

  {
    title: 'The same course, twice',
    screen: 'film/open.html',
    about: 'The comparison page as one animated scene, no keys, no store: four Drive windows descend, the Drive column fills with grey chips while Lite’s stops at five, the tallies land. Two captions, then a beat of black before the day stamps begin.',
    settle: 800,
    steps: [
      { do: 'hold', ms: 10700 },
      { do: 'caption', text: 'Most of this is finding the file.' },
      { do: 'hold', ms: 12700 },
      /* Tutors train; trainees teach. The line said the tutors had time to
         teach, which is not what happens on a CELTA (Ramy, 30 Sep 2026). */
      { do: 'caption', text: 'Same course. Same trainees. One of them spent it filing.' },
      { do: 'hold', ms: 5200 }
    ]
  },

  {
    title: 'The console',
    screen: '14_owner.html',
    about: 'The centre\u2019s console, announced. Ramy, 30 Sep 2026: the start "gets a bit back and forth\u2026 it\u2019s confusing what\u2019s happening", so each part now says whose world it is before it opens \u2014 and this one says what happens next: a link arrives. <b>Needs &amp;o=</b> (the owner key). Read-only.',
    settle: 3800,
    steps: [
      { do: 'chapter', num: 'One', text: 'The link', sub: 'It arrives in an email. Everything else is behind it.', ms: 2400 },
      { do: 'hold', ms: 1100 },
      { do: 'caption', text: 'You will be sent a link. That is the whole of it.' },
      { do: 'hold', ms: 1600 }
    ]
  },

  {
    title: 'The card arrives',
    screen: 'invite.html',
    course: 'start', day: 'Day 0',
    about: 'The card, the fact that it keeps working with the network off, and the screen it opens. Ramy, 30 Sep 2026: the two cuts showing the link parked in a Classroom stream and a Drive folder \u2014 "it lives anywhere" \u2014 read as confusing and are cut. The Wi-Fi still is made for the film; stills/classroom-stream.png and stills/drive-folder.png are kept in the folder but no longer used.',
    settle: 1400,
    steps: [
      { do: 'hold', ms: 1000 },
      { do: 'caption', text: 'Nothing to install. Nothing to remember. Nothing to lose.' },
      { do: 'hold', ms: 1300 },
      /* The card goes offline where it stands. The made still of a Wi-Fi-off
         tab was a second invitation and did not look like the real one
         (Ramy, 1 Oct 2026: "it does not look like the invitation that I sent
         — delete this second one"), so the offline mark goes on the live
         card instead and the two captions run back to back over it. */
      { do: 'offline', ms: 2000 },
      { do: 'caption', text: 'Works offline, and catches up when you are back.' },
      { do: 'hold', ms: 1600 },
      { do: 'offline', off: true, ms: 900 },
      /* And then the screen the link opens, so the card is not left hanging. */
      { do: 'click', on: '#go', ms: 1900 },
      { do: 'goto', screen: '5_tutor_dashboard.html', course: 'start', ms: 2100 },
      { do: 'who', text: 'The trainer', sub: 'Jordan Blake', ms: 1800 },
      { do: 'zoom', on: '#courseName', scale: 1.6, ms: 900 },
      { do: 'hold', ms: 900 },
      { do: 'zoom', out: true, ms: 700 },
      /* The first thing a trainer does on this screen: their name, which is
         what signs their marking and their feedback. */
      { do: 'type', into: '#tutorName', ms: 1400, text: 'Jordan Blake' },
      { do: 'hold', ms: 1000 },
      { do: 'caption', text: 'One link, and the whole course is behind it.' },
      { do: 'hold', ms: 1600 }
    ]
  },

  {
    title: 'A course is set up',
    screen: '6_centre_admin_dashboard.html',
    course: 'start', day: 'Day 0',
    about: 'The whole of setting a course up, in one scene: Course admin shown as a room before anything is done in it \u2014 the film used to open straight onto the Settings tab, which read as a jump into somebody else\u2019s screen, and looked old because its four numbered steps were never seen (Ramy, 30 Sep 2026). Then the centre, the dates, the clock, the rooms; the timetable from a pasted spreadsheet (a file chooser cannot be driven); then the roster with six links. <b>Writes stubbed</b> \u2014 the standing demo must not change.',
    settle: 2400,
    stub: ['putCourse', 'addTrainees', 'addTrainee'],
    steps: [
      { do: 'chapter', num: 'Two', text: 'Setting the course up', sub: 'Once, at the start: the centre, the timetable, the roster, and the centre’s own wording for the assignments.', ms: 2400 },
      /* Ramy, 30 Sep 2026: "when you're on a page you should zoom in on the
         title, so people know where you are." Every room the film enters is
         named by its own heading before anything is done in it. */
      { do: 'zoom', on: '#boardTitle', scale: 1.7, ms: 1000 },
      { do: 'hold', ms: 1000 },
      { do: 'zoom', out: true, ms: 800 },
      /* Settings first, then the people, then the timetable. It used to open
         on Settings and cut straight to the timetable, which is not the order
         anybody sets a course up in (Ramy, 30 Sep 2026). */
      { do: 'click', on: '[data-tab="settings"]', ms: 1300 },
      { do: 'scroll', to: '#courseZone', ms: 1400 },
      { do: 'hold', ms: 900 },
      { do: 'goto', screen: '6_centre_admin_dashboard.html', course: 'start', stub: ['putCourse', 'addTrainees', 'addTrainee'], ms: 1500 },
      { do: 'click', on: '[data-tab="roster"]', ms: 1300 },
      { do: 'caption', text: 'The centre invites its candidates and its tutors. One link each.' },
      { do: 'move', to: '.roster .acts button[data-copy]' },
      { do: 'hold', ms: 1100 },
      { do: 'goto', screen: '23_timetable.html', course: 'start', stub: ['putCourse'], ms: 1800 },
      { do: 'click', on: '#importOpen', ms: 1200 },
      { do: 'type', into: '#impPaste', ms: 2300, text: 'Date\tSession 1\tSession 2\n02/03/2026\tWelcome and the portfolio\tDemonstration lesson\n03/03/2026\tThe lesson framework\tClassroom management' },
      { do: 'click', on: '#impRead', ms: 1400 },
      { do: 'hold', ms: 1000 },
      { do: 'caption', text: 'The spreadsheet you already had, read once.' },
      { do: 'click', on: '#impApply', ms: 1800 },
      { do: 'hold', ms: 900 },
      { do: 'goto', screen: '6_centre_admin_dashboard.html', course: 'start', stub: ['putCourse', 'addTrainees', 'addTrainee'], ms: 1700 },
      /* Setting a course up is not only dates and names. Ramy, 30 Sep 2026:
         a centre "can just take it as it was, or set up their own course and
         do the wording, change the wording for the assignments". So the film
         shows the four Cambridge assignments plus the centre's own, and opens
         one of them. */
      { do: 'click', on: '[data-tab="assignments"]', ms: 1300 },
      { do: 'hold', ms: 1000 },
      { do: 'caption', text: 'Cambridge sets four. The wording is the centre\u2019s.' },
      { do: 'hold', ms: 1300 },
      { do: 'goto', screen: '8_assignment_wording.html', course: 'start', params: { a: 'fol' }, stub: ['putCourse'], ms: 2100 },
      { do: 'scroll', to: 520, ms: 1300 },
      { do: 'caption', text: 'Your sections, your fields, your criteria.' },
      { do: 'hold', ms: 1300 },
      { do: 'caption', text: 'Or keep last course\u2019s. Nothing here has to be written twice.' },
      { do: 'hold', ms: 1400 }
    ]
  },

  {
    title: 'The candidate reads Cambridge’s words',
    screen: 'index.html',
    course: 'start', role: 'trainee', as: 'Wei Zhang', day: 'Day 0',
    about: 'Wei’s home — the rooms strip, the timetable card with day one marked — then the CELTA 5: <i>Read and confirm</i>, Cambridge’s own words scrolled, the confirmation box with her name in it, <b>Confirm and sign</b>, the pad. Wei was left unconfirmed on the demo for this beat; <b>writes stubbed</b> so she stays that way. The pad is drawn by the film.',
    settle: 9000,
    stub: ['put'],
    steps: [
      { do: 'chapter', num: 'Three', text: 'Day one', sub: 'Each candidate’s own link, and the first thing Cambridge asks of them.', ms: 2400 },
      { do: 'zoom', on: '#boardTitle', scale: 1.6, ms: 1000 },
      { do: 'hold', ms: 900 },
      { do: 'zoom', out: true, ms: 800 },
      { do: 'caption', text: 'A candidate\u2019s own page. Her course, and nobody else\u2019s.' },
      { do: 'hold', ms: 1500 },
      { do: 'goto', screen: '20_celta5.html', course: 'start', role: 'trainee', as: 'Wei Zhang', stub: ['put'], ms: 1800 },
      { do: 'scroll', to: 420, ms: 1400 },
      /* It used to say "this booklet is going to fill itself -- watch", and
         then nothing filled: the payoff is four minutes away, at Cambridge's
         booklet. A caption may comment, but it must not promise something the
         next shot does not do (Ramy, 30 Sep 2026). */
      { do: 'caption', text: 'Cambridge\u2019s own words, on day one, in her own hands.' },
      { do: 'scroll', to: '[data-sig="conf:portfolio"]', ms: 1600 },
      { do: 'zoom', on: '[data-sig="conf:portfolio"]', scale: 1.5, ms: 700 },
      { do: 'click', on: '[data-sign="conf:portfolio"]', ms: 1400 },
      { do: 'zoom', on: '.ink-pad', scale: 1.5, ms: 700 },
      { do: 'draw', name: 'Wei Zhang', ms: 1500 },
      { do: 'zoom', out: true, ms: 1000 },
      { do: 'caption', text: 'Signed. Dated. Kept.' },
      { do: 'hold', ms: 1300 }
    ]
  },


  {
    title: 'The plan',
    screen: '1_trainee_plan_and_analysis.html',
    course: 'start', role: 'trainee', as: 'Aiko Tanaka', day: 'Day 3',
    about: 'The chapter Ramy asked to be a nice part, rebuilt on his notes of 1 Oct 2026: the aim spoken OR typed (dictation is an option, not a replacement), the lesson shape, the stages appearing, then the LANGUAGE ANALYSIS as a real sequence \u2014 the three kinds, vocabulary chosen, a word typed, and the phonemic keyboard coming up. Then the material shared with the volunteer students, which is the point of the chapter, and the plan turned in. The caption over the analysis is gone: "I don\u2019t know what that means, just don\u2019t say anything here." <b>Writes stubbed</b> so the demo stays blank.',
    settle: 12000,
    stub: ['put', 'shareMaterial'],
    steps: [
      { do: 'who', text: 'The candidate', sub: 'Aiko Tanaka', ms: 1800 },
      { do: 'click', on: '#fMain', ms: 1200 },
      { do: 'click', on: '.dictbtn', ms: 1200 },
      { do: 'type', into: '#fMain', ms: 2900, text: 'By the end of the lesson learners will be better able to understand a short article about jobs, reading first for gist and then for detail.' },
      { do: 'caption', text: 'Speak it or type it. Both land in the same box.' },
      { do: 'hold', ms: 900 },
      { do: 'click', on: '#fwBtn', ms: 1200 },
      { do: 'hold', ms: 900 },
      { do: 'caption', text: 'The shape is given. The thinking is theirs.' },
      { do: 'hold', ms: 1400 },
      /* The language analysis, shown rather than mentioned: open it, the three
         kinds, vocabulary, a word, and the phonemic keyboard. */
      { do: 'scroll', to: '#laToggle', ms: 1500 },
      { do: 'click', on: '#laToggle', ms: 1200 },
      { do: 'hold', ms: 900 },
      /* The three kinds are a select on the analysis: grammar, vocabulary,
         functional language. Vocabulary opens the table whose first column
         wants stress and a phonemic transcription, and typing in it raises
         the phonemic keyboard. */
      { do: 'choose', on: '#typeSel', value: 'vocab', ms: 1400 },
      { do: 'type', into: '#vocabBody .v-item', ms: 1400, text: 'give up (phr v)' },
      { do: 'hold', ms: 1200 },
      { do: 'caption', text: 'The phonemic keyboard is on the page, not in another app.' },
      { do: 'hold', ms: 1400 },
      /* The share: the point of the chapter. */
      { do: 'scroll', to: '#fMatsLink', ms: 1500 },
      { do: 'type', into: '#fMatsLink', ms: 1400, text: 'https://drive.google.com/file/d/demo-penguins-adapted/view' },
      { do: 'zoom', on: '#fShareVol', scale: 1.5, ms: 700 },
      { do: 'click', on: '#fShareVol', ms: 1300 },
      { do: 'caption', text: 'One click, and every material is with the students before the lesson has started.' },
      { do: 'hold', ms: 1200 },
      { do: 'zoom', out: true, ms: 700 },
      { do: 'scroll', to: '#turnInBtn', ms: 1500 },
      { do: 'click', on: '#turnInBtn', ms: 1300 },
      { do: 'caption', text: 'Turned in. It is on her tutor\u2019s screen already.' },
      { do: 'hold', ms: 1300 }
    ]
  },


  {
    title: 'Taught, and written up',
    screen: '2_trainee_self_evaluation.html',
    course: 'start', role: 'trainee', as: 'Nour El-Sayed', day: 'Day 4',
    about: 'Nour taught today and has not written yet. The first box, dictated; then the observation sheet for the second filmed lesson, which he has not done either — notes typed, <b>Turn in</b>, the date lands. <b>Writes stubbed.</b>',
    settle: 12000,
    stub: ['put'],
    steps: [
      { do: 'chapter', num: 'Four', text: 'Teaching practice', sub: 'The lesson taught, the self-evaluation written, the observation turned in.', ms: 2400 },
      { do: 'click', on: '#sWell', ms: 1200 },
      { do: 'type', into: '#sWell', ms: 2900, text: 'The task was set before the handout went out, and the pair check gave everyone an answer ready before I nominated.' },
      { do: 'hold', ms: 900 },
      { do: 'caption', text: 'Written before the feedback is read. That is the point of it.' },
      { do: 'hold', ms: 1300 },
      { do: 'goto', screen: '18_observation_tasks.html', course: 'start', role: 'trainee', as: 'Nour El-Sayed', params: { task: 'filmed2' }, stub: ['put'], ms: 2100 },
      { do: 'click', on: 'textarea[data-f="r0"]', ms: 1200 },
      { do: 'type', into: 'textarea[data-f="r0"]', ms: 1800, text: 'Yes — the instruction came before the paper, and she checked it with one question.' },
      { do: 'click', on: '#turnIn', ms: 1400 },
      { do: 'hold', ms: 1100 }
    ]
  },


  {
    title: 'The trainer’s desk',
    screen: '5_tutor_dashboard.html',
    course: 'start', day: 'Day 4',
    about: 'The trainer\u2019s own screen, announced as one: the counters and the rows \u2014 two waiting for feedback, one assignment to mark, and beside a name the time a plan was turned in. Read-only.',
    settle: 1800,
    steps: [
      { do: 'chapter', num: 'Five', text: 'Feedback', sub: 'Everything waiting in one list, written against the plan, and back the same evening.', ms: 2400 },
      { do: 'hold', ms: 1000 },
      { do: 'move', to: '.qcard[data-tab="tp"]' },
      { do: 'hold', ms: 1000 },
      { do: 'caption', text: 'Nobody asked “did you get it?”' },
      { do: 'hold', ms: 1300 },
      { do: 'scroll', to: 420, ms: 1400 },
      { do: 'hold', ms: 1000 }
    ]
  },

  {
    title: 'Behind one word: Course',
    screen: '5_tutor_dashboard.html',
    course: 'visit', day: 'Day 15',
    about: 'Ramy, 30 Sep 2026: "this is all the stuff that does not happen elsewhere." The Course menu opened on the tutor\u2019s dashboard, then the two rooms behind it that exist nowhere else \u2014 the teaching practice points, rotated so every candidate covers the full range by construction, and the grid the last two practices are self-planned on. Read-only. It used to walk back to the menu a second time to point at the grid; the next scene opens the grid anyway, so the walk back is gone (1 Oct 2026, cutting the film to length).',
    settle: 2400,
    steps: [
      { do: 'hold', ms: 900 },
      { do: 'click', on: '#courseMenuBtn', ms: 1400 },
      { do: 'hold', ms: 1100 },
      { do: 'caption', text: 'One word, and everything a course needs once.' },
      { do: 'hold', ms: 1300 },
      { do: 'goto', screen: '24_tp_points.html', course: 'visit', ms: 2100 },
      { do: 'zoom', on: 'h1', scale: 1.6, ms: 900 },
      { do: 'hold', ms: 900 },
      { do: 'zoom', out: true, ms: 800 },
      { do: 'scroll', to: 300, ms: 1800 },
      { do: 'caption', text: 'Seven lesson types, rotated. Nobody has to remember whose turn it is.' },
      { do: 'hold', ms: 1600 }
    ]
  },
  {
    title: 'The planning grid',
    screen: '21_tp_grid.html',
    course: 'visit', role: 'trainee', as: 'Aiko Tanaka', day: 'Day 15',
    about: 'Entered through the door the Course menu just opened. The group’s rows for TP7 and TP8 as Aiko sees them: hers editable, the others read, and two cells amber where two of them chose the same aim. Read-only in the take.',
    settle: 1800,
    stub: ['gridSet'],
    steps: [
      { do: 'who', text: 'The candidate', sub: 'Aiko Tanaka', ms: 1500 },
      { do: 'move', to: '.cell.clash' },
      { do: 'zoom', on: '.cell.clash', scale: 1.7, ms: 700 },
      { do: 'hold', ms: 900 },
      { do: 'caption', text: 'Two of them chose grammar. The grid noticed first.' },
      { do: 'hold', ms: 1400 },
      { do: 'zoom', out: true, ms: 1000 }
    ]
  },

  {
    title: 'Feedback, said',
    screen: '3_tutor_feedback.html',
    course: 'start', params: { trainee: 'Priya' }, day: 'Day 4',
    about: 'Priya taught on Friday and is waiting: her plan and self-evaluation are in, the feedback is not. The date and the level are already on the form. A point dictated, the criterion chips under it, one solid — tagged before on this course — and the code lands inside the sentence. <b>Writes stubbed</b>, so she keeps waiting for the next take.',
    settle: 2200,
    stub: ['put'],
    steps: [
      { do: 'hold', ms: 900 },
      { do: 'click', on: 'button[data-list="lST"]', ms: 1200 },
      { do: 'click', on: '#lST .pt:last-child .pt-text', ms: 1200 },
      { do: 'zoom', on: '#lST .pt:last-child', scale: 1.7, ms: 700 },
      { do: 'click', on: '.dictbtn', ms: 1200 },
      { do: 'type', into: '#lST .pt:last-child .pt-text', ms: 3400, text: 'Set the task before handing out the text, and checked it with a quick question' },
      { do: 'caption', text: 'Spoken here, typed on the next one. The form does not care.' },
      { do: 'hold', ms: 1100 },
      { do: 'click', on: '#lST .pt:last-child .suggest-chip', ms: 1400 },
      { do: 'caption', text: 'It learns your centre.' },
      { do: 'hold', ms: 1300 },
      { do: 'zoom', out: true, ms: 1000 }
    ]
  },

  {
    title: 'Feedback, all at once',
    screen: '3_tutor_feedback.html',
    course: 'start', params: { trainee: 'Priya' }, day: 'Day 4',
    about: 'The exchange: Copy, talk it through elsewhere, Paste something back, every box fills, Return \u2014 and then the finished thing, on the candidate\u2019s own screen, with the comments in it and a Print button under them (Ramy, 30 Sep 2026: "I want to see the finished PDF of the tutor feedback as well, with the comments"). Writes stubbed.',
    settle: 2200,
    stub: ['put'],
    steps: [
      { do: 'scroll', to: 300, ms: 1100 },
      { do: 'click', on: '#xCopy', ms: 1400 },
      { do: 'still', ms: 2000, img: 'stills/exchange-window.png', want: 'The brief pasted into any model, and the trainer talking the lesson through', how: 'A dictation window with the copied brief in it. If it cannot be shown, cut straight from Copy to Paste something back.' },
      { do: 'click', on: '#xPasteToggle', ms: 1200 },
      { do: 'hold', ms: 900 },
      { do: 'caption', text: 'The rest of the form was already there.' },
      { do: 'move', to: '#returnBtn' },
      { do: 'hold', ms: 1400 },
      /* What the candidate opens: every teaching practice the tutor has
         returned, the plan and the self-evaluation beside each one, and Print
         at the foot of it. The document, not the form. */
      { do: 'goto', screen: '4_feedback_returned.html', course: 'start', role: 'trainee', as: 'Priya Raghunathan', ms: 2200 },
      { do: 'hold', ms: 1200 },
      { do: 'caption', text: 'Her copy, the same evening. Printable, and hers to keep.' },
      { do: 'scroll', to: 700, ms: 2200 },
      { do: 'hold', ms: 1300 },
      { do: 'scroll', to: 'bottom', ms: 2200 },
      { do: 'hold', ms: 1300 }
    ]
  },

  {
    title: 'An assignment, marked and back',
    screen: '10_tutor_assignment_marking.html',
    course: 'visit', params: { trainee: 'Aiko', a: 'lfc' }, day: 'Day 9',
    about: 'Aiko’s Lessons from the Classroom is really awaiting marking on the visit demo. Five criteria marked on camera, the outcome works itself out, a comment typed; <b>writes stubbed</b>. Then the double-marking table on the assessor pack. Mateo’s record — two rounds, one outcome — was a third screen with nothing said over it and is cut (1 Oct 2026).',
    settle: 5000,
    stub: ['put'],
    steps: [
      { do: 'chapter', num: 'Six', text: 'Written assignments', sub: 'Marked against the centre’s own criteria, returned, resubmitted, recorded.', ms: 2400 },
      { do: 'scroll', to: 700, ms: 1500 },
      { do: 'click', on: '[data-crit="0"]', ms: 1000 },
      { do: 'click', on: '[data-crit="1"]', ms: 1000 },
      { do: 'click', on: '[data-crit="2"]', ms: 1000 },
      { do: 'click', on: '[data-crit="3"]', ms: 1000 },
      { do: 'click', on: '[data-crit="4"]', ms: 1000 },
      { do: 'zoom', on: '.derived', scale: 1.8, ms: 800 },
      { do: 'hold', ms: 1000 },
      { do: 'zoom', out: true, ms: 800 },
      { do: 'type', into: '#comment', ms: 2400, text: 'Honest about the lesson that did not work, and specific about what changed after it. Passed.' },
      { do: 'hold', ms: 900 },
      { do: 'goto', screen: '12_assessor_pack.html', course: 'visit', role: 'assessor', ms: 2200 },
      { do: 'scroll', to: 'text:Double-marking record', ms: 1800 },
      { do: 'caption', text: 'Two markers. One script. No second copy anywhere.' },
      { do: 'hold', ms: 1400 }
    ]
  },

  {
    title: 'Stage 1, signed',
    screen: '20_celta5.html',
    course: 'start', params: { trainee: 'Priya' }, day: 'Day 6',
    about: 'The tutor’s side of Priya’s CELTA 5: Stage 1 written, <b>Return to candidate</b>, the pad (drawn by the film). Then Mateo’s side — his Stage 1 is returned and unsigned on the demo — <b>Sign</b>, the pad, the green block; below it the teaching practice table already holding TP1 and TP2. <b>Writes stubbed</b> on both sides.',
    settle: 2400,
    stub: ['put'],
    steps: [
      { do: 'chapter', num: 'Seven', text: 'The progress records', sub: 'Stage by stage, both halves of Cambridge’s booklet, signed on screen.', ms: 2400 },
      { do: 'scroll', to: '#s1', ms: 1600 },
      { do: 'hold', ms: 900 },
      /* One signature in the whole film. It was drawn three times over and
         Ramy counted five or six (Ramy, 30 Sep 2026: "I just wanted to show
         it once"); the one that stays is Wei signing Cambridge\u2019s
         confirmation, because that is a candidate\u2019s own hand on the record
         Cambridge reads. Here the tutor returns the stage and the film moves
         on. */
      { do: 'click', on: '[data-return="stage1"]', ms: 1400 },
      { do: 'hold', ms: 1300 },
      { do: 'caption', text: 'Signed on screen. Personal, and dated to the second.' },
      { do: 'goto', screen: '20_celta5.html', course: 'start', role: 'trainee', as: 'Mateo Fernández', stub: ['put'], ms: 2100 },
      { do: 'scroll', to: '#s1', ms: 1500 },
      { do: 'hold', ms: 900 },
      { do: 'scroll', to: '#tp', ms: 1600 },
      { do: 'caption', text: 'Nothing here was typed twice.' },
      { do: 'hold', ms: 1600 }
    ]
  },


  {
    title: 'The register, and the certificate',
    screen: '25_volunteer_register.html',
    course: 'visit', day: 'Day 17',
    about: 'One tap on today’s block for the first student, the hours tick up, then the certificate: hers, already signed by the centre on the demo. <b>putCourse stubbed</b> so the tap does not stick.',
    settle: 1800,
    stub: ['putCourse'],
    steps: [
      { do: 'chapter', num: 'Eight', text: 'Volunteer students', sub: 'The people who make teaching practice possible: a register, their hours, and a certificate.', ms: 3400 },
      { do: 'who', text: 'The register', sub: 'kept by the centre', ms: 1900 },
      { do: 'click', on: '.who .seg.soon', ms: 1800 },
      { do: 'caption', text: 'One tap a day. Nobody adds anything up.' },
      { do: 'hold', ms: 3200 },
      { do: 'zoom', on: 'table.mid, table', scale: 1.3, ms: 1100 },
      { do: 'hold', ms: 2600 },
      { do: 'caption', text: 'Classes, part-classes and hours, per student, as they happen.' },
      { do: 'hold', ms: 3000 },
      { do: 'zoom', out: true, ms: 1000 },
      { do: 'goto', screen: '27_volunteer_certificate.html', course: 'visit', role: 'volunteer', as: 'Ayşe', ms: 3200 },
      { do: 'who', text: 'The volunteer student', sub: 'Ayşe Demir', ms: 1900 },
      { do: 'caption', text: 'And it adds up to this, without anybody writing it out.' },
      { do: 'hold', ms: 3600 },
      { do: 'caption', text: 'Signed by the centre. Printed by the student.' },
      { do: 'hold', ms: 3400 }
    ]
  },
  {
    title: 'A volunteer’s page',
    screen: '26_volunteer.html',
    course: 'start', role: 'volunteer', as: 'Omar', day: 'Day 1',
    about: 'The other end of the share switch, which is why it follows the plan. The film now stays long enough to show the material itself sitting on the student\u2019s page (Ramy, 1 Oct 2026: "show where the material from the trainees has landed \u2014 it is very important"). Omar has not agreed yet on the demo, so his link opens on the joining note: Turkish is chosen, <i>Kabul ediyorum</i>, and behind it his page \u2014 the next class in the course\u2019s clock, the material the candidate just shared, <b>Join on Zoom</b>. <b>volunteerAgree stubbed</b> \u2014 he stays unagreed for the next take.',
    settle: 1800,
    stub: ['volunteerAgree'],
    steps: [
      { do: 'who', text: 'The volunteer student', sub: 'Omar Haddad', ms: 1500 },
      { do: 'click', on: '.consent [data-lang="tr"]', ms: 1300 },
      { do: 'caption', text: 'Their language for the small print. English for the lesson.' },
      { do: 'hold', ms: 1400 },
      { do: 'click', on: '#cAgree', ms: 1400 },
      { do: 'hold', ms: 1000 },
      /* Where the material went. The switch was thrown two scenes ago. */
      { do: 'scroll', to: '.card .mat', ms: 1500 },
      { do: 'zoom', on: '.card .mat', scale: 1.5, ms: 800 },
      { do: 'caption', text: 'The reading her teacher shared is already here.' },
      { do: 'hold', ms: 1600 },
      { do: 'zoom', out: true, ms: 700 },
      { do: 'move', to: '.next .room' },
      { do: 'caption', text: 'One tap to the room.' },
      { do: 'hold', ms: 1300 }
    ]
  },

  {
    title: 'The assessor’s link',
    screen: '12_assessor_pack.html',
    course: 'visit', role: 'assessor', day: 'Day 19',
    about: 'The assessor\u2019s own view, announced as one \u2014 Ramy could not tell it was in the film. Opened with the assessor\u2019s read-only key: the header line, the Handbook panel, the candidates chosen first, the double-marking record, the volunteer students, the course documents. Scrolled, never clicked into. Nothing is downloaded, exported or sent.',
    settle: 2400,
    steps: [
      { do: 'chapter', num: 'Nine', text: 'The assessor’s visit', sub: 'A link of their own, read-only, that ends when the course does.', ms: 2400 },
      { do: 'hold', ms: 900 },
      { do: 'zoom', on: '.eyebrow', scale: 1.8, ms: 1000 },
      { do: 'hold', ms: 900 },
      { do: 'zoom', out: true, ms: 800 },
      { do: 'caption', text: 'The assessor\u2019s own page. Nothing was assembled for it.' },
      { do: 'hold', ms: 1400 },
      { do: 'scroll', to: 900, ms: 2100 },
      { do: 'hold', ms: 900 },
      { do: 'scroll', to: 'text:Volunteer students', ms: 2100 },
      { do: 'caption', text: 'Everything the Handbook lists, and nothing was gathered.' },
      { do: 'hold', ms: 1800 }
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
      { do: 'chapter', num: 'Ten', text: 'The end of the course', sub: 'The grades, Cambridge’s booklet, and what the candidate is sent.', ms: 2400 },
      { do: 'hold', ms: 900 },
      { do: 'scroll', to: 800, ms: 1800 },
      { do: 'hold', ms: 900 },
      /* Ramy, 1 Oct 2026: spend this chapter on the provisional grades and
         where they come from, not on the grading-meeting boxes. */
      { do: 'zoom', on: '.prov, table', scale: 1.35, ms: 900 },
      { do: 'hold', ms: 1000 },
      { do: 'caption', text: 'Nobody typed these. They were earned one lesson at a time.' },
      { do: 'hold', ms: 1200 },
      { do: 'zoom', out: true, ms: 800 },
      { do: 'click', on: 'text:Add from the TP records', ms: 1400 },
      { do: 'hold', ms: 1400 },
      { do: 'caption', text: 'And the evidence is the feedback the tutors already wrote.' },
      { do: 'hold', ms: 1200 }
    ]
  },


  {
    title: 'Cambridge’s booklet',
    screen: '20_celta5.html',
    course: 'finished', params: { trainee: 'Aiko' }, day: 'Day 20',
    about: 'The real pages, not a description of them. The July 2023 form drawn in the browser from the record: the cover, the confirmations, the three stages, every table full, every signature in ink. The line the film was made for; nothing moves under it.',
    settle: 2400,
    steps: [
      { do: 'click', on: '#cambridgePdf', ms: 1800 },
      { do: 'hold', ms: 1300 },
      /* THE SHOT THE FILM WAS MADE FOR. Not a card describing the booklet --
         the booklet. These are pages of the real Cambridge July 2023 form,
         drawn from Aiko's finished record by celta5-pdf.js and photographed
         by film/booklet-pages.mjs. Ramy, 1 Oct 2026: "we have the original.
         Show the original. This is the original that the centre will have in
         the end, with all the information in it." */
      { do: 'caption', text: 'Nobody filled this in. The course did.' },
      { do: 'still', ms: 2600, img: 'stills/celta5-p01.png', want: 'The cover, filled in' },
      { do: 'still', ms: 2200, img: 'stills/celta5-p02.png', want: 'Cambridge’s own words, confirmed' },
      { do: 'still', ms: 2400, img: 'stills/celta5-p07.png', want: 'Stage 2, both columns' },
      { do: 'still', ms: 2200, img: 'stills/celta5-p10.png', want: 'The teaching practice record' },
      { do: 'caption', text: 'Every box came from something somebody already wrote.' },
      { do: 'still', ms: 2800, img: 'stills/celta5-p13.png', want: 'The final declaration, signed both sides' }
    ]
  },


  {
    title: 'The report she is sent',
    screen: '16_final_report.html',
    course: 'finished', params: { id: 'Aiko Tanaka' }, day: 'Day 20',
    about: 'What the centre sends the candidate at the end: the confirmation line, the hours, the grade, the assessment areas, the overall comment, both tutors\u2019 signatures. Shot from the tutor\u2019s link because the room is shut to a candidate on purpose \u2014 Lite has no release step yet, and the page says so to a trainee. Read-only.',
    settle: 5000,
    steps: [
      { do: 'hold', ms: 1100 },
      { do: 'zoom', on: '.name', scale: 1.7, ms: 1000 },
      { do: 'caption', text: 'Four weeks, and it is hers.' },
      { do: 'hold', ms: 1200 },
      { do: 'zoom', out: true, ms: 1000 },
      { do: 'scroll', to: 700, ms: 1700 },
      { do: 'hold', ms: 1100 },
      { do: 'scroll', to: 1500, ms: 1700 },
      { do: 'caption', text: 'Nothing on it was written twice.' },
      { do: 'hold', ms: 1300 }
    ]
  },

  {
    title: 'The next course',
    screen: '14_owner.html',
    course: 'finished', day: 'Day 20',
    about: '<b>Start the next course from this</b> on the console: the cursor rests on it, and a still of the new course’s card — the wording, the rooms, the timetable shape carried, every switch off, an empty roster. Not clicked in the take: it would really make a course.',
    settle: 3800,
    steps: [
      { do: 'hold', ms: 900 },
      { do: 'move', to: '[data-clone]' },
      { do: 'hold', ms: 1000 },
      { do: 'caption', text: 'The wording stays. The people change.' },
      { do: 'still', ms: 3000, img: 'stills/next-course-card.png', want: 'The new course’s card on the console, an empty roster, the switches all off', how: 'Clone once by hand, capture the card, delete the course.' }
    ]
  },

  {
    title: 'Email me',
    screen: 'film/end.html',
    about: 'The last card, a page of the film\u2019s own: the mark, the one line, and the address \u2014 which arrives as <b>&amp;email=</b> on the film\u2019s own URL and is in no file, because this repository is public. Without it the address line is simply left out.',
    settle: 600,
    steps: [
      { do: 'hold', ms: 4900 }
    ]
  },
];
