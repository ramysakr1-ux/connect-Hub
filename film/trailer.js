/* Connect Lite — the trailer.
 * © 2026 Ramy Sakr.
 *
 * Ramy, 5 Oct 2026: "the film might even be too complex, it's too long. I'm
 * thinking I should do a presentation, and instead of this film I can just
 * make a trailer, like a teaser, just showing all the cool stuff so they'd be
 * like, wow, what's that? How did that work? And then I do the presentation
 * and then they know how it works."
 *
 * So this reel has ONE job: buy the meeting. It is not a short film and it is
 * not an explanation — it never says how anything works, because the moment it
 * explains, the person who is frightened of software starts counting what they
 * would have to learn. It shows things happening and gets out.
 *
 * SECOND PASS, 5 Oct 2026, after he watched it: "it's good, could be a little
 * bit longer, but it doesn't show all the cool stuff. I want to show TP points.
 * I want to show the phonemic chart. I want to show some of the cards the
 * trainees get. All the cool things trainers and trainees have no idea could
 * actually exist on a CELTA course. What the hell is this? What's that?"
 *
 * That is a different test from the one the first cut was written to. The first
 * cut picked what was IMPRESSIVE; this one picks what is UNIMAGINABLE on a
 * CELTA course as they have run it. A signature is impressive. A phonemic
 * keyboard inside the lesson plan is unimaginable.
 *
 * THE RULES THIS IS WRITTEN TO
 *  - No teaching. Not one caption that describes a feature.
 *  - Six words on screen, total, before the end card.
 *  - Every shot is a thing MOVING: ink going down, a sentence appearing as it
 *    is spoken, a page printing itself. A still screen, however good, is a
 *    screenshot, and they have seen screenshots.
 *  - Nothing that needs the previous shot to make sense. It is a reel, not a
 *    story — a viewer can arrive at any second of it.
 *  - It ends on the one sentence the whole pitch rests on, and an address.
 *
 * Shot from the same three standing courses as the film, so nothing here can
 * drift from the product: 'start' (day 6), 'visit' (day 17), 'finished'.
 * Run it with film/?reel=trailer&sk=…&vk=…&fk=…  — ?check=1 to prove every
 * selector before a take.
 */
const REEL = [

  /* A signature writing itself, in a hand that is hers and nobody else's, is
     the single most "that's not a website" thing Lite does, so it opens. It
     used to be a finger on a pad; since 6 Oct 2026 the signature is written
     from the name (hub-hand.js), the same every time she signs, and the
     dialog writes it across the pad as it opens. No caption: a signature does
     not need one. */
  { title: 'Ink',
    /* The signing lives on the CELTA 5, not on the candidate's home — the first
       pass pointed at index.html and ?check=1 caught it before any take, which
       is what that mode is for. The candidate is the one the film already uses
       on this screen, so her signature is one she has given before. */
    course: 'start', role: 'trainee', as: 'Wei Zhang',
    screen: '20_celta5.html',
    about: 'The candidate signs Cambridge’s confirmation — her signature writes itself in her own hand, then Sign.',
    settle: 12000,
    steps: [
      { do: 'hold', ms: 600 },
      { do: 'scroll', to: '[data-sig="conf:portfolio"]', ms: 1200 },
      { do: 'zoom', on: '[data-sig="conf:portfolio"]', scale: 1.5, ms: 600 },
      { do: 'click', on: '[data-sign="conf:portfolio"]', ms: 1200 },
      { do: 'zoom', on: '.ink-pad', scale: 1.5, ms: 600 },
      { do: 'sign', ms: 1800 },
      { do: 'zoom', out: true, ms: 800 },
      { do: 'hold', ms: 700 }
    ],
    stub: ['put']
  },

  /* Talking to a form. Two words on screen, and they are the only promise the
     trailer makes about effort. */
  { title: 'Said, not typed',
    course: 'start', role: 'tutor',
    screen: '3_tutor_feedback.html',
    about: 'The cursor goes into a feedback box, the dictation button, and a sentence arrives as if spoken.',
    settle: 12000,
    steps: [
      { do: 'hold', ms: 500 },
      { do: 'click', on: '.dictbtn' },
      { do: 'type', into: '#lST .pt:last-child .pt-text',
        text: 'The instructions were clear and the demonstration was quick, so they were into the task inside a minute.', ms: 2600 },
      { do: 'hold', ms: 700 }
    ]
  },

  /* A real person, in their own language, on their phone. Nothing about CELTA
     on screen -- which is why it lands. */
  { title: 'In her language',
    course: 'start', role: 'volunteer', as: 'Omar',
    screen: '26_volunteer.html',
    about: 'A volunteer student’s own page, switched into Turkish.',
    settle: 9000,
    steps: [
      { do: 'hold', ms: 500 },
      { do: 'click', on: '.consent [data-lang="tr"]' },
      { do: 'hold', ms: 1600 },
      { do: 'scroll', to: 'bottom', ms: 1400 }
    ]
  },

  /* The grid filling itself. Movement, no explanation. */
  { title: 'It fills itself',
    course: 'visit', role: 'tutor',
    screen: '13_grades_report.html',
    about: 'Grades, every candidate, already there — scrolled, not read.',
    settle: 12000,
    steps: [
      { do: 'hold', ms: 500 },
      { do: 'scroll', to: 'bottom', ms: 2600 },
      { do: 'hold', ms: 500 }
    ]
  },

  /* Cambridge's own booklet, drawn from what is already on the course. The one
     shot that answers "but is it allowed?" without the question being asked. */
  { title: 'Cambridge’s own',
    course: 'finished', role: 'tutor',
    screen: '20_celta5.html',
    about: 'The CELTA 5, and Cambridge’s PDF drawn straight out of it.',
    settle: 12000,
    steps: [
      { do: 'hold', ms: 600 },
      { do: 'caption', text: 'Cambridge’s own form.' },
      { do: 'scroll', to: '#cambridgePdf', ms: 1600 },
      { do: 'hold', ms: 1200 }
    ]
  },

  /* The assessor, on a link, reading everything. No download, nothing sent. */
  { title: 'The assessor',
    course: 'visit', role: 'assessor',
    screen: '12_assessor_pack.html',
    about: 'The pack, assembled, scrolling past.',
    settle: 12000,
    steps: [
      { do: 'hold', ms: 400 },
      { do: 'scroll', to: 'bottom', ms: 3000 }
    ]
  },

  /* Last before the card: a signed certificate. It is the end of a course in
     one picture, and it is the thing a centre's owner recognises instantly. */
  { title: 'Signed',
    course: 'visit', role: 'tutor',
    screen: '25_volunteer_register.html',
    about: 'The volunteer register, and a certificate with a real signature on it.',
    settle: 12000,
    steps: [
      { do: 'hold', ms: 500 },
      { do: 'scroll', to: 'bottom', ms: 2000 },
      { do: 'caption', text: 'Signed. Dated. Kept.' },
      { do: 'hold', ms: 900 }
    ]
  },

  /* THE ONE NOBODY EXPECTS. A phonemic keyboard, inside the lesson plan, on the
     candidate's own screen. Every trainer in the room has watched a candidate
     fight a transcription in Word; none of them has seen this. */
  { title: 'The phonemic chart',
    course: 'start', role: 'trainee', as: 'Wei Zhang',
    screen: '1_trainee_plan_and_analysis.html',
    about: 'The language analysis opens, and the phonemic keyboard comes up inside the plan.',
    settle: 12000,
    steps: [
      { do: 'hold', ms: 500 },
      { do: 'click', on: '#laToggle', ms: 1000 },
      { do: 'scroll', to: '#ipaBar', ms: 1200 },
      { do: 'zoom', on: '#ipaBar', scale: 1.4, ms: 700 },
      { do: 'hold', ms: 1800 },
      { do: 'zoom', out: true, ms: 700 }
    ],
    stub: ['put']
  },

  /* TP POINTS. A teaching practice written out as a lesson -- stages, timings,
     interaction -- waiting for the candidate before they have asked. */
  { title: 'TP points',
    course: 'start', role: 'tutor',
    screen: '5_tutor_dashboard.html',
    about: 'Behind one word on the dashboard: the TP points, every practice staged and timed.',
    settle: 12000,
    steps: [
      { do: 'hold', ms: 400 },
      { do: 'click', on: '#courseMenuBtn', ms: 900 },
      { do: 'hold', ms: 800 },
      { do: 'goto', screen: '24_tp_points.html', course: 'start', role: 'tutor', ms: 1600 },
      { do: 'scroll', to: 'bottom', ms: 2400 }
    ]
  },

  /* THE CARD A CANDIDATE OPENS. Not a folder. Their own page, with what is
     theirs today on it. */
  { title: 'Her own card',
    course: 'start', role: 'trainee', as: 'Wei Zhang',
    screen: 'index.html',
    about: 'The candidate’s home: her teaching practice, her state, what is back.',
    settle: 12000,
    steps: [
      { do: 'hold', ms: 600 },
      { do: 'zoom', on: '.tpgroup', scale: 1.25, ms: 800 },
      { do: 'hold', ms: 1400 },
      { do: 'zoom', out: true, ms: 700 },
      { do: 'scroll', to: 'bottom', ms: 1800 }
    ]
  },

  /* The whole argument, once, and where to find it. */
  { title: 'The card',
    screen: 'film/end.html',
    about: 'The end card: the mark, the one line, the address.',
    settle: 1200,
    steps: [ { do: 'hold', ms: 4200 } ]
  }
];

/* THE RUNNING ORDER, set here rather than by where a shot happens to be written.
   It alternates who the screen belongs to -- candidate, trainer, candidate --
   so the reel never feels like a tour of one person's software, and it opens on
   the two nobody expects (a signature drawn by hand; a phonemic keyboard inside
   a lesson plan) rather than building to them. A trailer has no third act. */
const ORDER = [
  'Ink',
  'The phonemic chart',
  'Said, not typed',
  'Her own card',
  'TP points',
  'In her language',
  'It fills itself',
  'Cambridge\u2019s own',
  'The assessor',
  'Signed',
  'The card',
];
const SCENES = ORDER.map(t => {
  const sc = REEL.find(x => x.title === t);
  if (!sc) throw new Error('the running order names a shot that is not written: ' + t);
  return sc;
});
