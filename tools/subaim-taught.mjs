/* A SUB AIM THAT NO STAGE TEACHES.
 *
 * s5 1A.2 named the linking words as its sub aim and taught them in a six-minute
 * writing lead-in on the end of a speaking lesson. Cutting that stage would have
 * left the aim with nothing working on it, and nothing would have said so --
 * every other check in the suite looks at the clock, the pages, the audio or
 * the shape, and none of them reads the aim against the procedure.
 *
 * This does. For every slot it asks one question: is there a stage that works
 * on what the sub aim names? It REPORTS rather than pronounces -- a stage can
 * serve an aim without using its words -- so a miss is something to look at.
 * Run with --all to see what satisfied every slot, which is how you check the
 * check: the first version called 34 of 120 a miss, and all but two of those
 * were the checker not knowing that a freer practice is where fluency happens
 * and a post-reading discussion is where the speaking is.
 *
 *   node subaim-taught.mjs          the misses
 *   node subaim-taught.mjs --all    every slot and the stage that answers it
 */
import { readCourse, LIBRARY } from './st.mjs';

/* A focus is served by particular kinds of stage. The stage NAME is the first
   evidence and what the stage says is the second, because a stage called
   "Freer practice" can be the speaking and a "Post-reading" can be the
   discussion. */
const FOCUS = {
  listening: [/listen|viewing|video/i,
              /\btrack\b|\baudio\b|recording|play (?:the|it)|listen/i],
  reading:   [/reading/i,
              /\bread\b|\breads\b|the (?:text|article|story|programme information)/i],
  speaking:  [/speaking|freer|preparing to speak|discussion|response|roleplay|mingle|post-(?:reading|listening)|follow-up|produc/i,
              /\bspeak|tell (?:their|the|each)|in (?:pairs|groups)|conversation|interview|anecdote|discuss/i],
  writing:   [/writing/i, /\bwrite\b|\bwrites\b|draft|composes?/i],
  pronunciation: [/pronunciation|phonolog|MFP|MPF/i,
              /stress|drill|weak form|syllable|intonation|rhythm|silent|contracted/i],
  grammar:   [/clarif|highlight|present|teach|useful language|MFP|MPF|exposure/i,
              /\bform\b|tense|concept[- ]check|concept question|grammar bank/i],
  vocabulary:[/clarif|highlight|present|teach|useful language|vocabular|lexis|MFP|MPF|exposure/i,
              /\bword|lexis|meaning|collocation|vocabular/i],
  'functional language': [/clarif|highlight|present|teach|useful language|MFP|MPF|exposure/i,
              /phrase|expression|function/i],
};
/* A full sentence that names a skill is the same question in longer words. */
const NAMES_FOCUS = [
  [/fluency|speaking|discussion|orally/i, 'speaking'],
  [/listening/i, 'listening'],
  [/\breading\b/i, 'reading'],
  [/\bwriting\b/i, 'writing'],
  [/pronunciation|stress|intonation/i, 'pronunciation'],
];

const STOP = new Set(('to develop develops developing students student their of the and for with in on a an by using use used ' +
  'practise practice practised provide providing awareness context will have about that this those these each more less ' +
  'order so they them it its own when what which who from into at as is are be been very also able same their').split(/\s+/));

/* What a full-sentence sub aim names: the long words, and anything it lists out
   -- "also, as well as, because, too and for example" is a list of the very
   items a stage has to be working on. */
function signals(sub) {
  const out = new Set();
  (sub.match(/—[^—]+—|:[^.]+/g) || []).join(' ')
    .split(/[,;]| and | or /).forEach(x => {
      const t = x.replace(/[—:.]/g, '').trim().toLowerCase();
      if (t.length > 2 && t.split(/\s+/).length <= 4) out.add(t);
    });
  sub.toLowerCase().replace(/[^a-zÀ-ɏ\s-]/g, ' ').split(/\s+/).forEach(w => {
    if (w.length >= 5 && !STOP.has(w)) out.add(w);
  });
  return [...out];
}

function answeredBy(sub, stages) {
  const focus = FOCUS[sub.toLowerCase().trim()];
  if (focus) {
    const [byName, byBody] = focus;
    const s = stages.find(x => byName.test(x.name)) || stages.find(x => byBody.test(x.body));
    return s ? { stage: s, why: 'the focus' } : null;
  }
  /* its own words first: they are the strongest evidence */
  const sig = signals(sub);
  for (const x of stages) {
    const got = sig.filter(t => x.body.toLowerCase().includes(t));
    if (got.length) return { stage: x, why: got.slice(0, 3).join(', ') };
  }
  /* then the skill it names, which a stage can serve without naming it */
  for (const [re, key] of NAMES_FOCUS) {
    if (!re.test(sub)) continue;
    const [byName, byBody] = FOCUS[key];
    const s = stages.find(x => byName.test(x.name)) || stages.find(x => byBody.test(x.body));
    if (s) return { stage: s, why: key };
  }
  return null;
}

const L = (await readCourse(LIBRARY)).rec.set.library;
const ALL = process.argv.includes('--all');
let checked = 0, theirs = 0, miss = 0;

for (const id of Object.keys(L).sort())
  for (const [nm, s] of Object.entries(L[id].sessions))
    (s.slots || []).forEach((sl, i) => {
      const sub = String(sl.sub || '').trim();
      const where = `${id} ${nm}·${i + 1} [${sl.type}]`;
      if (!sub || /^you decide$/i.test(sub)) { theirs++; return; }
      checked++;
      const stages = (sl.stages || []).map(x => ({
        name: x.name || '', body: `${x.name || ''} ${x.todo || ''} ${x.avoid || ''}` }));
      const hit = answeredBy(sub, stages);
      if (!hit) {
        miss++;
        console.log(`${where}\n   sub aim: ${sub}`);
        console.log(`   stages : ${stages.map(x => x.name).join(' / ')}`);
      } else if (ALL) {
        console.log(`${where}  "${sub.slice(0, 46)}" <- "${hit.stage.name}"  (${hit.why})`);
      }
    });

console.log(`\n${checked} sub aims read against their stages · ${miss} with no stage working on them` +
  ` · ${theirs} left to the trainee`);
