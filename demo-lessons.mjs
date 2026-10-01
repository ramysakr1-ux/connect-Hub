/**
 * The demo courses' lessons, feedback and assignments -- the pure builders,
 * lifted from demo-finished.mjs (30 Sep 2026) so the standing demos can be
 * built from the same content without a second copy drifting. demo-finished
 * still carries its own copy and is untouched; this file is the one the new
 * seed imports. Everything here is a pure function of the data file.
 */
import { COURSE, SLOTS, TOPICS, CANDIDATES } from './demo-finished-data.mjs';
export { COURSE, SLOTS, TOPICS, CANDIDATES };

/* ---- one lesson --------------------------------------------------------- */
const bullets = a => a.map(x => '• ' + x).join('\n');
/* The dates a lesson carries come from the course being built: the caller
   sets them once. Two a week by default, as the finished demo had. */
let _tpDate = n => COURSE.settings.start;
export function setTpDate(fn){ _tpDate = fn; }
const tpDate = n => _tpDate(n);

export function lesson(cand, ci, slot) {
  const topic = TOPICS[(ci + slot.n) % TOPICS.length];
  const tl = topic.tl, level = slot.level;
  const rows = slot.stages.map((name, i) => ({
    stage: name, aim: '', int: ['T–S + OC', 'PW + OC', 'Ind. + PW', 'PW', 'Ind. + PW + OC', 'OC'][i % 6],
    time: String([5, 8, 8, 7, 10, 7][i % 6]),
    proc: bullets(procFor(name, topic, level)),
  }));
  const total = rows.reduce((s, r) => s + Number(r.time), 0);
  if (total !== 45) rows[rows.length - 1].time = String(Number(rows[rows.length - 1].time) + (45 - total));
  return {
    v: 1, kind: 'celta-tp',
    meta: { name: cand.name, tp: String(slot.n), level, date: tpDate(slot.n), length: '45', framework: slot.shape },
    plan: {
      main: bullets([`To ${slot.focus.toLowerCase()} in the context of ${topic.text.toLowerCase()}`,
                     `To clarify and practise ${tl} at ${level}`]),
      sub: bullets(['To develop oral fluency through a short reaction task',
                    'To give practice in working out meaning from context']),
      pers: bullets(slot.n === 1 ? ['To set every task before handing anything out']
                                 : [`${cand.teachA[0][1]} (carried from TP${slot.n - 1})`]),
      mats: bullets([`${topic.text}, adapted to ${level}`, 'Handout 1 — gist and detail questions',
                     'Handout 2 — controlled practice', 'Board plan in the appendix']),
      matsLink: '', matsFile: null,
      profile: `Twelve adults at ${level}. Mixed first languages — Turkish, Arabic, Spanish, one Farsi speaker — and mixed ages. They are confident speakers for the level and prefer to see language written down before they use it.`,
      /* problem and solution as their own pair, which is what the analysis
         sheet prints and what 4j and 4k are actually about. */
      probs: [
        { problem: `Some learners may already know ${topic.items[0]}, and the presentation stage stalls.`,
          solution: 'Elicit before teaching; if it is known, check it once and move straight to the next item.' },
        { problem: 'Reading every word and translating, so the gist task overruns.',
          solution: 'A tight time limit, said aloud and shown on the clock, and stop them when it ends.' },
        { problem: 'Stronger learners finish the detail task in half the time.',
          solution: 'They compare with a neighbour and write one more question of their own for the class.' },
      ],
      rows,
    },
    la: {
      type: 'vocab', context: topic.text, mainAim: 'Yes', blocks: [],
      vocab: topic.items.map(item => ({
        item, def: `as used in ${topic.text.toLowerCase()}`,
        convey: 'Elicit from the context, then check with a concept question',
        clar: 'Elicit from the context, then check with a concept question',
        form: 'See the analysis sheet for part of speech and pattern',
        prob: 'Stress is the likely difficulty; drill the whole chunk, then backchain',
      })),
      ref: 'Oxford Learner’s Dictionary; the adapted text',
    },
    self: {
      well: bullets(['The task was set before the handout went out, and checked.',
                     'The pair check before open class meant everybody had an answer ready.']),
      not: bullets(['The clarification stage ran over and the last stage lost time.']),
      learn: bullets(['A time limit only works if I stop them when it ends.']),
      diff: bullets(['I would cut one of the detail questions and give the minutes to the freer stage.']),
      next: bullets([cand.teachA[0][1]]),
      actions: '',
    },
    feedback: null,
  };
}

function procFor(name, topic, level) {
  const n = name.toLowerCase();
  if (/lead-in/.test(n)) return ['Photo and headline on the board. In pairs: what is this about, and do you do it?', 'Two answers in open class. No correction here.'];
  if (/prediction/.test(n)) return ['Headline only. In pairs, three things they expect the text to say.', 'Take four ideas on the board; they check them in the next stage.'];
  if (/pre-teach/.test(n)) return [`Elicit ${topic.items.join(', ')} from the context, one at a time.`, 'Concept check each, drill the stress, board the form.'];
  if (/gist/.test(n)) return ['Set the question before the handout. Three minutes.', 'Pairs compare, then whole-class check against their predictions.'];
  if (/detail/.test(n)) return ['Four questions on the board, six minutes, alone.', 'Pairs compare; nominate for the answers and ask them to justify from the text.'];
  if (/post-/.test(n)) return ['Prompt on the board; model with a strong pair.', 'Monitor for content and for the target language; collect examples for the feedback.'];
  if (/present:|highlighting/.test(n)) return [`Board the marker sentence from the text. Elicit meaning with concept questions.`, `Form on the board; drill the whole chunk, then backchain.`];
  if (/clarif/.test(n)) return ['Meaning, then form, then pronunciation, in that order.', 'Check with two concept questions before any practice.'];
  if (/first test/.test(n)) return ['Handout 1 — they do what they can alone, then compare.', 'Monitor to find out what they already know; do not correct yet.'];
  if (/teach \(/.test(n)) return ['Clarify only the items the diagnostic showed they need.', 'Board them; drill; check with concept questions.'];
  if (/second test/.test(n)) return ['Handout 2, the same task type as the diagnostic.', 'Pairs compare; open-class check against the board.'];
  if (/controlled practice/.test(n)) return ['Handout 2, eight items, alone then in pairs.', 'Open-class check; drill any item that caused trouble.'];
  if (/freer practice/.test(n)) return ['Role cards in pairs, three rounds, swapping partners.', 'Monitor from a distance; note examples for correction.'];
  if (/preparing to/.test(n)) return ['Give the task and the time; two minutes to plan alone.', 'Model the first exchange with a strong learner.'];
  if (/speaking \/ writing task|reading or listening task/.test(n)) return ['The task itself, in pairs, eight minutes.', 'Monitor and collect language for the feedback stage.'];
  if (/error correction|feedback/.test(n)) return ['Four sentences from the monitoring on the board — two right, two wrong.', 'Pairs decide which need fixing; drill the corrected forms.'];
  if (/extension/.test(n)) return ['If time: change partners and repeat the task with a new prompt.'];
  return ['Set the task, check it, and let them do it.', 'Monitor; take feedback from what you hear.'];
}

/* ---- one returned feedback ---------------------------------------------- */
export const tag = (code, text) => `${text} <span class="tag" contenteditable="false" data-c="${code}" title="">${code}</span>&nbsp;`;

export function feedbackState(cand, doc, slot) {
  const grade = cand.arc[slot.n - 1];
  const tutor = (cand.group === '1') === (slot.n <= 4) ? 'Jordan Blake' : 'Diane Okonkwo';
  const pick = (bank, k) => bank[Math.min(k, bank.length - 1)];
  const lists = {
    lSP: [pick(cand.planS, 0), pick(cand.planS, (slot.n) % cand.planS.length)].map(([c, t]) => ({ html: tag(c, t), star: false })),
    lAP: [pick(cand.planA, (slot.n) % cand.planA.length)].map(([c, t]) => ({ html: tag(c, t), star: slot.n < 8 })),
    lST: [pick(cand.teachS, 0), pick(cand.teachS, (slot.n + 1) % cand.teachS.length)].map(([c, t]) => ({ html: tag(c, t), star: false })),
    lAT: [pick(cand.teachA, (slot.n) % cand.teachA.length)].map(([c, t]) => ({ html: tag(c, t), star: slot.n < 8 })),
  };
  const tcomm = {};
  doc.plan.rows.forEach((r, i) => { tcomm['st' + i] = stageComment(i, grade); });
  doc.la.vocab.forEach((v, i) => { tcomm['vo' + i] = 'Accurate, and the concept question would do the work in class.'; });
  return {
    f: {
      fTP: 'TP' + slot.n, fDate: doc.meta.date, fTutor: tutor, fLevel: slot.level, fTime: '45',
      fStudents: '12', fMain: focusMain(slot), fSub: focusSub(slot), fGrade: grade,
      tOverall: overallFor(cand, slot, grade),
      tSelf: 'An honest self-evaluation that names the same things I did, and says what you will do about them. That is what this document is for.',
      tLA: 'Accurate and usable. One more example of the negative form would finish it.',
    },
    lists, tcomm, doc,
  };
}

function stageComment(i, grade) {
  const good = ['A quick, clean way in — and you resisted correcting here, which was right.',
    'Well set up: the instruction came before the paper and you checked it.',
    'Clear clarification, and the board work was worth copying down.',
    'Purposeful monitoring — you were listening for the language you had taught.',
    'Good pattern in the correction: two right and two wrong keeps it from feeling like a list of failures.',
    'You protected this stage, which is where the lesson consolidates.'];
  const weak = ['This ran long, and it was the presentation rather than the practice that took the time.',
    'The instruction went out with the paper; give it first and check it.',
    'Too many items for one stage — three would have been taught properly.',
    'You were close enough to the pairs that the talking stopped.',
    'This stage was cut for time, and it is the one the lesson needed.',
    'Take two answers here, not six.'];
  return grade === 'Below standard' ? weak[i % weak.length]
       : grade === 'Above standard' ? good[i % good.length]
       : (i % 2 ? good[i % good.length] : weak[i % weak.length]);
}

/* The CELTA 5's teaching practice record reads the lesson focus off the
   feedback (fMain / fSub). Ramy, 1 Oct 2026: show it -- "vocabulary and
   speaking, grammar and reading" -- so the page reads as completed. The slot's
   shape says what kind of lesson it was; the pair comes from that. */
function focusMain(slot) {
  const sh = String(slot.shape || ''); const f = String(slot.focus || '');
  if (/receptive/i.test(sh)) return /listen/i.test(f) ? 'Listening' : 'Reading';
  if (/productive/i.test(sh)) return /writ/i.test(f) ? 'Writing' : 'Speaking';
  if (/vocab|lexis|lexical/i.test(sh + f)) return 'Vocabulary';
  if (/function/i.test(sh + f)) return 'Functional language';
  if (/ppp|test.teach|guided discovery|grammar|task/i.test(sh + f)) return 'Grammar';
  return f || 'Grammar';
}
function focusSub(slot) {
  const m = focusMain(slot);
  return { Reading: 'Speaking', Listening: 'Vocabulary', Writing: 'Grammar', Speaking: 'Vocabulary', Vocabulary: 'Speaking', 'Functional language': 'Listening', Grammar: 'Speaking' }[m] || 'Speaking';
}
function overallFor(cand, slot, grade) {
  const first = cand.name.split(' ')[0];
  if (grade === 'Above standard') return `A very good lesson, ${first}. The aims were met, the learners produced the language, and you made two adjustments in the room that the plan did not contain. ${cand.teachA[0][1]} is the one thing still worth your attention.`;
  if (grade === 'Below standard') return `This lesson did not meet the standard, ${first}, and the reason is the one we have talked about: the early stages took the time the later ones needed, so the lesson did not arrive where your plan said it would. What was good was real — the learners were with you and they wanted to do the work. Take the action points into the next one and we will look at it again.`;
  return `A solid lesson, ${first}. The plan was thorough and you taught the plan you wrote, which is not nothing. The learners were engaged and they produced the target language — that is the test, and you passed it. ${cand.teachA[0][1]} is what to carry into the next one.`;
}


/* A resubmission's not-met note has to be about the criterion it sits under,
   and the general comment must not name a criterion at all. This file used to
   give every resubmitted assignment the same sentence -- "the rationale for
   the second activity" -- which is a Focus on the Learner story: Language
   Related Tasks and Lessons from the Classroom have no rationale criterion, so
   on those two the tutor's words described something the assignment does not
   ask for (27 Sep 2026). */
const notMetNote = (c) => `Not met yet: ${String((c && c.text) || 'this criterion').replace(/^[A-Z]/, (m) => m.toLowerCase())} \u2014 the evidence for this is not there yet. Rewrite this section only and resubmit.`;
export const notMetIndexFor = (DEFAULT_WORDING, code) => {
  const crit = (DEFAULT_WORDING[code] && DEFAULT_WORDING[code].criteria) || [];
  const byWord = crit.findIndex((c) => /rationale/i.test(c.text || ''));
  return byWord >= 0 ? byWord : Math.min(3, crit.length - 1);
};

export function assignment(cand, code, how, DEFAULT_WORDING, asgAt) {
  const marker = cand.group === '1' ? 'Jordan Blake' : 'Diane Okonkwo';
  const crit = (DEFAULT_WORDING[code] && DEFAULT_WORDING[code].criteria) || [];
  const n = crit.length || 4;
  const notMetAt = notMetIndexFor(DEFAULT_WORDING, code);
  const body = `This assignment is submitted as part of the CELTA course at ${COURSE.settings.centreName}. It addresses each of the criteria set out in the brief, in the order the brief gives them, with reference to the teaching practice class and to the reading listed at the end.`;
  const sub = { picked: {}, text: { 1: body }, fields: {}, decl: { 8: { checks: [true, true, true], aiUsed: 'no', aiLink: '', aiPurpose: '' } }, materialsLink: '' };
  const base = {
    stage: 'closed', usedResubmission: how === 'resub',
    sub1: sub, sub2: how === 'resub' ? sub : null,
    /* One mark per criterion the assignment HAS. This was four for all of
       them, so once the wording was written the two extra criteria of Focus on
       the Learner and the fifth of Lessons from the Classroom sat unmarked on
       a closed, passed assignment.
       And a resubmission is asked for because something was NOT met: the
       general comment below says "not yet met on one criterion" while every
       first-round mark read Met, so the tutor's words and the tutor's marks
       disagreed on the same screen. The last criterion of the first round
       carries the reason; the resubmission meets it. */
    criteriaMarks: {
      sub1: Array.from({ length: n }, (_, i) => !(how === 'resub' && i === notMetAt)),
      sub2: how === 'resub' ? Array.from({ length: n }, () => true) : [],
    },
    criteriaComments: {
      sub1: Array.from({ length: n }, (_, i) => (how === 'resub' && i === notMetAt ? notMetNote(crit[i]) : 'Met.')),
      sub2: how === 'resub' ? Array.from({ length: n }, () => '') : [],
    },
    markers: { first: marker, second: '', doubleMarked: false },
    sub1At: asgAt[code] - 864e5, marked1At: asgAt[code],
    feedback: {
      outcome: how === 'resub' ? 'Pass (on resubmission)' : 'Pass',
      generalComment1: how === 'resub'
        ? 'Not yet met on one criterion \u2014 the note against it says what is missing. Everything else is there and is well done. Resubmit that section only.'
        : 'A careful, well-organised piece of work that does what the brief asks. The examples are from your own teaching practice class and they are used, not just mentioned.',
      generalComment2: how === 'resub' ? 'The resubmitted section deals fully with the point raised. Passed.' : '',
    },
  };
  if (how === 'extension') base.extension = { until: new Date(asgAt[code] + 3 * 864e5).toISOString().slice(0, 10), reason: 'Documented personal circumstances; agreed with the course tutor.' };
  return base;
}

