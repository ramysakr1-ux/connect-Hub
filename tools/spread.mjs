import { call, LIBRARY } from './st.mjs';
import { createRequire } from 'node:module';
const require = createRequire('file:///Users/work/connect-Hub/');
require('/Users/work/connect-Hub/hub-rotation.js');
/* the file attaches its api to the global and only sets module.exports when it
   is loaded as CommonJS from the same realm, so read it off the global. */
const R = globalThis.hubRotation;
const SET = process.argv[2] || 's2';
const r = await call({ op:'course', key:LIBRARY });
const recs = (r.result && (r.result.records || r.result)) || {};
const S = recs.tppoints.set.library[SET];
const TPS = 6;   // the set covers practices 1 to 6; 7 and 8 are the candidates' own
/* the roster is its own op, not a course record; the store says token where the
   page says id, and the page's groups() reads id -- either is the same person
   here because we build the list ourselves. */
const ros = await call({ op:'roster', key:LIBRARY });
const people = (((ros.result || {}).trainees) || []).filter(Boolean)
  .map(t => ({ token: t.token || t.id, name: t.name, group: String(t.group || '') }));
const typeAt = (tp, si, pos) => {
  const ses = S.sessions[`${tp}${si === 0 ? 'A' : 'B'}`];
  const sl = ses && ses.slots[pos];
  return (sl && sl.type) || '?';
};
const rot = R.rotate(people, { tps: TPS, groupOffset: 0 });
const got = {};
for (let tp = 1; tp <= TPS; tp++)
  rot.sets.forEach((st, si) => R.orderFor(st, tp).forEach((p, pos) => {
    (got[p.token] = got[p.token] || [])[tp-1] = typeAt(tp, si, pos);
  }));
const name = {}; people.forEach(p => name[p.token] = p.name);
console.log(`${SET} — ${S.name || S.book}\n`);
let repeats = 0, missing = 0;
Object.keys(got).forEach(t => {
  const ty = got[t];
  const half = ty.slice(0, 3);
  const dupFirstHalf = half.length !== new Set(half).size;
  const fam = new Set(ty.map(x => R.familyOf(x)));
  const want = ['language focus','receptive skills','productive skills'];
  const never = want.filter(f => ![...fam].some(x => String(x).toLowerCase().includes(f.split(' ')[0])));
  if (dupFirstHalf) repeats++;
  if (never.length) missing++;
  console.log(`  ${(name[t]||t).padEnd(14)} ${ty.join(', ')}`);
  console.log(`  ${''.padEnd(14)} first half: ${half.join(', ')}${dupFirstHalf ? '   (a repeat)' : ''}` +
              `   families: ${[...fam].join(' / ')}${never.length ? '   (no ' + never.join(', ') + ' yet)' : ''}`);
});
/* NOT A FAULT, and this used to read like one. Ramy, 5 Oct 2026: "we just give
   them a mix of sort of skill and language lessons, different aims. First half
   of the course, second half of the course, they can repeat a little bit. And
   that's all. The last two TPs, they can always make up for anything that is
   missing." So this counts and says what it sees; it does not accuse. */
console.log(`\nfirst half: ${repeats} with a repeat · ${missing} with a family still to come` +
            ` — both fine, and practices 7 and 8 are theirs to fill the gaps.`);
