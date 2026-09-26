/**
 * Make the demo course's end-of-course reports look like real ones.
 *
 *   node demo-final-reports.mjs <tutor key>            what it would write
 *   node demo-final-reports.mjs <tutor key> --write    write it
 *
 * Three things were wrong with what the mint planted, and all three show on
 * film (Ramy, 26 Sep 2026: "people need to see what it looks like when it's
 * full, like a real course").
 *
 * ONE: the overall comment was two sentences. A real end-of-course report —
 * measured against the centre's own, IH Istanbul's, which Ramy wrote — runs to
 * four paragraphs in a fixed shape: who they were on the course; what they
 * achieved, across both levels and in the written work; what to keep working
 * on after it; and a closing line. That shape is followed here, in sentences
 * of this course's own, not lifted from his.
 *
 * TWO: all twelve candidates had the same comment, the same strengths and the
 * same action points, so four identical reports would have been printed. Every
 * candidate is their own here, and each one is consistent with what that
 * candidate's teaching-practice records actually say.
 *
 * THREE: seven of the eight criterion codes were wrong against CELTA 5.
 * "Instructions given before the handout and checked with a question" was
 * tagged 5a, which is arranging the classroom; it is 5f. "Purposeful
 * monitoring" was tagged 5g, which is eliciting; it is 5j. The codes below are
 * checked against the list the grades report itself prints.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const KEY = process.argv[2];
const WRITE = process.argv.includes('--write');
if (!KEY || KEY.startsWith('--')) { console.log('usage: node demo-final-reports.mjs <tutor key> [--write]'); process.exit(1); }

const HERE = new URL('.', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const call = async b => {
  for (let i = 0; i < 6; i++) {
    const r = await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) });
    const t = await r.text();
    try { return JSON.parse(t); } catch (e) { await new Promise(res => setTimeout(res, 4000)); }
  }
  return { ok: false, error: 'no JSON' };
};

/* Each candidate's own record. planS/planA/teachS/teachA are what the grades
   report prints under the two assessment areas, with the criterion each one
   shows; `update` is the tutorial note; `overall` is the end-of-course report.
   Only the four who have finished carry an overall and their hours. */
const P = {
  'Emily Carter': {
    planS: [['4a', 'Aims are stated in the learners’ terms and are achievable in the time'],
            ['4e', 'The procedure reads as a lesson: one action per line, each with its interaction and its minutes'],
            ['4j', 'Anticipated problems are specific to this group, and each has a solution she could use']],
    planA: [['4h', 'Give each stage the time the plan allows — the presentation ran over more than once'],
            ['4e', 'Write the concept questions into the plan with the answers she expects']],
    teachS: [['5f', 'Instructions are given before the handout and checked with a question, every time'],
             ['5j', 'Monitoring is purposeful: she listens for the target language and the slip of examples makes the feedback stage'],
             ['1d', 'Warm with the group from the first minute; she uses names and waits for answers']],
    teachA: [['5h', 'Keep the feedback stages short — two answers, not six'],
             ['5b', 'Nominate the quieter learners by name after the pair check']],
    update: 'Both action points from the first tutorial — stage timing, and the length of the feedback stages — were under control by TP6 and stayed there. The second tutorial agreed no further targets.',
    overall: [
      'Emily was a thoroughly professional member of the course. She met every deadline without being chased, came to every planning session with the work already done, and took feedback the way it is meant to be taken — she wrote it down, she asked what it would look like in practice, and the next lesson showed it.',
      'Her teaching was to standard from the first assessed practice and improved steadily across both levels. By the end of the course she was setting up tasks with instructions her learners understood the first time, monitoring for the language she had taught rather than for silence, and running a feedback stage out of what she had actually heard. Her written assignments were submitted on time and passed at the first attempt, and her language analysis was consistently the most careful in the group. Her self-evaluations were the best on the course: specific, honest about what had not worked, and already proposing the fix.',
      'For her development after the course, Emily should keep working on the pace of her later stages — the lesson she plans is still a little longer than the lesson she has — and on drawing the quieter learners in by name rather than waiting for them to volunteer. She would also benefit from planning the concept questions she will use, with the answers she expects, rather than finding them in the moment.',
      'Emily will be an asset to any staffroom, and we wish her well in her teaching career.'
    ].join('\n\n'),
  },
  'Madison Reyes': {
    planS: [['4a', 'Aims are stated in the learners’ terms and sized to the lesson'],
            ['4g', 'Materials are adapted, not just used — the coursebook text was cut to what the task needed'],
            ['4e', 'The procedure is detailed enough for another tutor to teach it']],
    planA: [['4h', 'The last stage is the one that gets squeezed; give it its minutes in the plan'],
            ['4i', 'Take the language analysis past meaning — form and phonology deserve the same care']],
    teachS: [['5d', 'The lesson arrives where the plan said it would, and the learners know it has'],
             ['5g', 'A real range of questions — she elicits, then checks, and waits for the answer'],
             ['2e', 'Clear, economical clarification: the board work is worth copying down']],
    teachA: [['5i', 'Hold the pace in the freer stages — she moves on while learners are still producing'],
             ['5j', 'Monitor from further away during pair work; her presence stops the conversation']],
    update: 'The first tutorial set pace and stage timing as the targets. Both were met by TP5, and TP7 was graded above standard. The second tutorial confirmed a Pass A was in reach if the standard held, and it did.',
    overall: [
      'Madison was an energetic and very quick learner who set the tone for the group. She was punctual with every deadline, generous with her materials, and the first to volunteer for the parts of teaching practice that nobody else wanted.',
      'Her development over the four weeks was the strongest on the course. From the fourth teaching practice onwards she was planning with very little guidance, adapting coursebook material rather than delivering it, and clarifying language on the board with an economy that other candidates began to copy. She taught confidently at both levels and her last two lessons were graded above standard. All four written assignments were passed at the first attempt, and her Lessons from the Classroom assignment showed a genuinely critical eye for her own teaching.',
      'For her development after the course, Madison should keep watching the pace of her freer practice stages — she is inclined to close an activity while the learners are still using the language — and monitor from a little further away so that pair work carries on without her. Her language analysis is the part of her planning that still lags her teaching: form and phonology deserve the same attention she already gives to meaning.',
      'Madison is ready for her own classes and will be an immediate asset to a staffroom. We wish her every success.'
    ].join('\n\n'),
  },
  'Anastasia Volkova': {
    planS: [['4j', 'Anticipated problems are specific to these learners and each carries a solution'],
            ['4f', 'Interaction patterns suit the task rather than filling a column'],
            ['4a', 'Aims are stated in the learners’ terms']],
    planA: [['4h', 'Timing: the presentation stages take what the practice stages need'],
            ['4b', 'Order the stages so the freer practice is protected, not last in the queue']],
    teachS: [['1d', 'Genuine rapport — the group talks to her and to each other'],
             ['5f', 'Instructions are staged and checked before anything is handed out'],
             ['5m', 'She sees her own lesson clearly afterwards, without being told']],
    teachA: [['5h', 'Cut the teacher talk in feedback — take two answers and move on'],
             ['5i', 'A firmer hand on the clock inside each stage']],
    update: 'The first tutorial named timing and teacher talk in the feedback stages. Both were addressed by TP6 and held to the end of the course. Rapport and task set-up were consistent strengths throughout.',
    overall: [
      'Anastasia was a conscientious and well-liked member of the group who worked hard from the first day. She managed her time carefully, met every deadline, and prepared thoroughly for each assisted planning session.',
      'She taught to standard at both levels and her strongest quality throughout was her relationship with the learners — the group spoke readily with her and with each other, and her instructions were staged and checked so that tasks started cleanly. The timing of her lessons was the area she had to work at, and she did: the action points agreed at her first tutorial were visible in her practice by the sixth teaching practice and held to the end. Her written assignments were all passed, one after a resubmission that she turned round quickly and well.',
      'For her development after the course, Anastasia should keep reducing her own talking time in the feedback stages — two answers are usually enough — and keep a firmer hand on the clock inside each stage, so that the productive work at the end of a lesson gets the minutes it was planned to have.',
      'Anastasia will be a warm and reliable colleague in any staffroom, and we wish her well.'
    ].join('\n\n'),
  },
  'Zeynep Aydın': {
    planS: [['4e', 'The procedure is written as a lesson, in short steps'],
            ['4a', 'Aims are realistic for the time available'],
            ['4k', 'Solutions to anticipated problems are practical rather than decorative']],
    planA: [['4i', 'The language analysis needs more on form; meaning is already well handled'],
            ['4h', 'Build the timings from the practice stages backwards']],
    teachS: [['5f', 'Instructions are clear and always checked'],
             ['5j', 'She monitors closely and collects real examples for correction'],
             ['2b', 'Correction is sensitive and well timed — learners repair their own errors']],
    teachA: [['5g', 'Widen the range of questions — she asks the same learners the same way'],
             ['5b', 'Vary the grouping; pairs become predictable by the second week']],
    update: 'An extension was agreed on the Language Skills Related Tasks assignment for documented personal reasons; the work was submitted within the extended deadline and passed. Teaching targets from the first tutorial were met.',
    overall: [
      'Zeynep approached the course seriously and with real humility about what she did not yet know, which is the quality that made her improve as fast as she did. She was well prepared for planning sessions and dealt with a difficult fortnight in her personal life without letting it affect the group.',
      'Her teaching was to standard at both levels and showed particular strength in error correction: she monitored closely, collected what she actually heard, and handled the correction so that learners repaired their own mistakes rather than being told the answer. Her instructions were clear and always checked. Of the four written assignments, three were submitted on time and passed; an extension was agreed on the fourth for documented personal reasons, and the work was submitted within the extended deadline and passed.',
      'For her development after the course, Zeynep should widen her range of questions — she tends to ask the same learners in the same way — and vary how she groups the class, which became predictable by the second week. In planning, her language analysis is strong on meaning and needs the same care given to form.',
      'Zeynep leaves the course a capable and thoughtful teacher, and we wish her every success.'
    ].join('\n\n'),
  },
};

/* The eight still on the course keep their empty final grade: they are mid-course
   and their reports are not written yet. Their codes are corrected all the same,
   because the grades report already shows them. */
const CODES_ONLY = {
  'Defne Yılmaz':   { planS: [['4a', 'Aims are stated in the learners’ terms and are achievable in the time'], ['4e', 'The procedure reads as a lesson, with interaction and timing on every stage']], planA: [['4h', 'Give each stage the time the plan allows'], ['4e', 'Write the concept questions into the plan with their expected answers']], teachS: [['5f', 'Instructions given before the handout and checked with a question'], ['5j', 'Purposeful monitoring that feeds the feedback stage']], teachA: [['5h', 'Reduce teacher talk in the feedback stages'], ['5b', 'Nominate the quieter learners by name after the pair check']] },
};

const roster = await call({ op: 'roster', key: KEY });
if (!roster.ok) { console.log('could not read the roster: ' + roster.error); process.exit(1); }
const people = Object.values(roster.result.trainees || {}).sort((a, b) => a.name.localeCompare(b.name));

const pts = list => (list || []).map(([code, text]) => ({ text, code }));
let done = 0;

for (const who of people) {
  const rec = (who.records || {}).tracker || {};
  const g = rec.grades || {};
  const spec = P[who.name] || CODES_ONLY[who.name] || CODES_ONLY['Defne Yılmaz'];
  const next = Object.assign({}, g, {
    planS: pts(spec.planS), planA: pts(spec.planA),
    teachS: pts(spec.teachS), teachA: pts(spec.teachA),
  });
  if (spec.update) next.update = spec.update;
  if (spec.overall) { next.overall = spec.overall; next.hoursAttended = next.hoursAttended || '120'; }

  const words = (next.overall || '').split(/\s+/).filter(Boolean).length;
  console.log(who.name.padEnd(20) + (g.final ? '[' + g.final + '] ' : '[in progress] ')
    + (spec.overall ? words + '-word report' : 'codes only')
    + '   ' + [...pts(spec.planS), ...pts(spec.teachS)].map(x => x.code).join(' '));

  if (!WRITE) continue;
  const out = await call({ op: 'put', key: KEY, token: who.token, kind: 'tracker', data: Object.assign({}, rec, { grades: next }) });
  if (!out.ok) { console.log('   WRITE FAILED: ' + out.error); continue; }
  done++;
}
console.log('\n' + (WRITE ? done + ' candidates written' : 'dry run — nothing written'));
