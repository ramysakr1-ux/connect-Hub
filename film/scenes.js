/* Connect Lite — the film, scene by scene.
   © 2026 Ramy Sakr.

   The spec is DEMO-ANIMATION-SPEC.md. This file is the spec made executable:
   every scene names a real screen and drives it. Re-timing the film is
   editing numbers here, not re-rendering anything.

   STEPS
     {do:'caption', text}        one line, floats up, holds, fades. The engine
                                 works out how long from its length (2.5s min).
     {do:'move',   to:sel}       glide the cursor to an element
     {do:'click',  on:sel}       glide, then click it
     {do:'type',   into:sel, text, ms}   type into a box, character by character
     {do:'scroll', to:'bottom'|px, ms}
     {do:'hold',   ms}           stop and let the picture sit
     {do:'still',  want, how, ms}   a frame that is not Lite (Classroom, Drive)

   A selector is CSS, or `text:Some words` to find a button by what it says --
   these screens are hand-written and not every control has an id.

   WRITES. A scene lists in `stub` the store ops that must never really
   happen, with the answer to give instead in `answers`. The interface is
   real; only the reply is canned. Read ops always go to the real store, so
   what is on screen is the real demo course.
*/

var SCENES = [

  /* ---------------------------------------------------------------- 1 ---
     Part 1 · The link. The console for one beat -- where the link comes
     from -- and nothing more. No name, no zoom on the header: Ramy, 27 Sep,
     "I don't want that cheesy part where it's focusing on my name."

     Needs the OWNER key, as ?o= on the film's own URL. Without it the
     console asks for one, so the scene says so rather than filming a
     prompt. createCourse is stubbed: a film must not mint a real course
     every take. */
  {
    title: 'A course is made',
    screen: '14_owner.html',
    about: 'The owner console, one beat. Needs <b>?o=</b> (the owner key) on this page’s URL as well as ?k=. createCourse is stubbed — nothing is minted.',
    settle: 1600,
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
      { do: 'hold', ms: 3000 },                    /* the card lands, gold-edged */
      { do: 'move', to: 'text:Copy' },
      { do: 'hold', ms: 1400 }
    ]
  },

  /* ---------------------------------------------------------------- 2 ---
     The card that arrives, and the three places the link can live. The
     Classroom and Drive cuts are not Lite and cannot be iframed, so they are
     `still` slots: drop the captures in and they play. Until then each slot
     says exactly what to capture, so nobody has to re-read the spec.

     Ramy, 27 Sep: "it should show that the link could live inside a G drive
     or inside Google Classroom" -- the earlier cut showed Lite's own page
     three times and never showed either. */
  {
    title: 'Where the link lives',
    screen: 'invite.html',
    about: 'The tutor’s card, then the link inside Classroom and Drive, then offline. Read-only screen — nothing to stub.',
    settle: 1100,
    steps: [
      { do: 'hold', ms: 1200 },
      { do: 'caption', text: 'Put it wherever your course already lives.' },
      { do: 'hold', ms: 1600 },
      {
        do: 'still', ms: 3600,
        want: 'Google Classroom — the Lite link posted as a material',
        how: 'Capture a demo Classroom stream with the link in it, then the click that opens the card. The Classroom post is the frame; the link is a line inside it. A demo class, never a real one.'
      },
      {
        do: 'still', ms: 3600,
        want: 'Google Drive — the link saved in the course folder',
        how: 'Capture a demo Drive folder with the Lite link saved as a shortcut among the course files, then the click. A demo folder, never a real one.'
      },
      { do: 'caption', text: 'It still opens when the internet doesn’t.' },
      { do: 'hold', ms: 4000 },                    /* Wi-Fi off, page still there */
      { do: 'move', to: '#go' },
      { do: 'click', on: '#go', ms: 1800 }
    ]
  },

  /* ---------------------------------------------------------------- 3 ---
     Part 2 · The trainer sets up. The settings are the demo course's real
     ones, so this is the true screen with true content.

     The paste and "Add all" are left for a take against a SCRATCH course --
     see the note. Stubbing them here would type twelve names and then show
     nothing appearing, because the screen re-reads its roster from the
     store; and running them for real would put twelve more people on the
     demo. Neither is the picture the spec asks for. */
  {
    title: 'Setting up',
    screen: '6_centre_admin_dashboard.html',
    about: 'Settings, then the roster paste. <b>The paste is typed but not submitted</b> — for the real take, point this scene at a scratch course and let Add all run.',
    settle: 1800,
    stub: ['addTrainees', 'addTrainee', 'putCourse'],
    answers: { addTrainees: { ok: true, result: { added: [], skipped: [] } } },
    steps: [
      { do: 'hold', ms: 900 },
      { do: 'move', to: '[data-tab="settings"]' },
      { do: 'click', on: '[data-tab="settings"]', ms: 1400 },
      { do: 'hold', ms: 2400 },                    /* centre, dates, TPs, tutors */
      { do: 'caption', text: 'No accounts, no passwords. The link is the account.' },
      { do: 'click', on: '[data-tab="roster"]', ms: 1500 },
      { do: 'hold', ms: 1400 },
      /* The paste box is two doors in, not one: "Add trainee" opens #addBox,
         and "Add several at once" inside it opens #bulkWrap. Clicking only
         the second typed twelve names into a box nobody could see. */
      { do: 'click', on: '#toggleAdd', ms: 1100 },
      { do: 'click', on: '#toggleBulk', ms: 1200 },
      {
        do: 'type', into: '#storeBulkNames', ms: 5200,
        text: 'Defne Yılmaz, 1\nAnastasia Volkova, 1\nJacob Miller, 1\nZeynep Aydın, 1\nEmily Carter, 1\nOmar Haddad, 1\nPriya Nair, 2\nLucas Moreau, 2\nSofia Rossi, 2\nKenji Watanabe, 2\nAmina Diallo, 2\nTom Fletcher, 2'
      },
      { do: 'move', to: '#storeBulkAddBtn' },
      { do: 'hold', ms: 3000 }
    ]
  }

];
