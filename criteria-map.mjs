/**
 * The demo course's feedback points, and the criteria each one actually shows.
 *
 * Written by hand against the CELTA 5 wording, not taken from the screen's own
 * suggester: the suggester matches on words, and on these sixteen points it was
 * right about half the time -- it put 2a ("adjusting their own use of language")
 * on a point about rapport, and 4n ("reflecting on and evaluating their plans")
 * on "aims are stated in the learners' terms", which is 4a. A demo read by CELTA
 * trainers cannot carry criteria that are visibly wrong.
 *
 * Keyed by the point's plain text. A point not in this map is left untagged and
 * named, rather than guessed at.
 */
export const MAP = {
  /* ---- strengths in planning ---- */
  'Aims are stated in the learners’ terms and are achievable in the time — a real improvement on the first plan':
    ['4a','4h'],                    /* stating appropriate aims; timing the stages */
  'The procedure reads as a lesson: one action per line, with the interaction pattern and timing for every stage':
    ['4e','4f','4h'],               /* procedure in sufficient detail; interaction patterns; timing */
  'Anticipated problems are specific to this group, and each has a solution you could actually use':
    ['4j','4k'],                    /* anticipating difficulties; suggesting solutions */
  'The language analysis is a model of its kind — meaning, form and pronunciation, each with a problem and a solution':
    ['4i','4j'],                    /* analysing form, meaning and phonology; anticipating difficulties */

  /* ---- action points in planning ---- */
  'Give each stage the time the plan says it has — the presentation ran over and the production stage paid for it':
    ['4h'],
  'Write the CCQs into the plan with the expected answers, so you can see at a glance which ones are doing the work':
    ['4e'],                         /* the procedure, in sufficient detail -- the planning half of 5g */
  'Cut the exponents to the two you will actually drill; the rest can stay in the analysis sheet':
    ['4g'],                         /* balance and a communicative focus in what is taught */
  'Add a stage aim for the error-correction stage — it is the only one without one':
    ['4a'],

  /* ---- strengths in teaching ---- */
  'Warm with the group from the first minute; you use names and you wait for answers':
    ['1d'],                         /* rapport, and learners fully involved */
  'Instructions were given before the handout and checked with a question — clearly, every time':
    ['5f','5g'],                    /* clear instructions; questions to check understanding */
  'Monitoring was purposeful: you were listening for the target language, and the slip of examples you collected made the feedback stage':
    ['5j','5h'],                    /* monitoring; feedback on the task */
  'The drilling was crisp and the intonation work was genuinely good — the learners were using it unprompted by the role-play':
    ['2e','2g'],                    /* clarifying phonology; appropriate practice of the item */

  /* ---- action points in teaching ---- */
  'Reduce teacher talk in the feedback stages: take two answers, not six, and move on':
    ['5h','5i'],                    /* feedback on tasks; learning pace */
  'Nominate the quieter learners by name after the pair check, when they have an answer ready':
    ['1d','5b'],                    /* learners fully involved; managing whole-class activity */
  'Stop at the time limit you set — say it, show it, and stop them at zero':
    ['5i'],                         /* an appropriate pace in relation to the task */
  'Protect the final feedback stage; it is where the lesson gets consolidated':
    ['5d','5h'],                    /* managing the process so the aims are achieved; feedback */
};
