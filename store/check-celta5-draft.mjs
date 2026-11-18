/* Can a trainee read a stage of the CELTA 5 that their tutor has not returned? (18 Nov 2026, store v261)
 * Against the role check's scratch course only ("Role check — not a course"), never a real one. As the tutor, writes a
 * marked draft into Stage 1 and the final part of "Role Check One"; as that trainee, reads the record and boots, and
 * looks for the mark; then returns the stage and looks again. Ends by putting the tutors' half back as it was.
 *   node store/check-celta5-draft.mjs
 */
import { readFileSync } from 'fs';
const HERE = new URL('..', import.meta.url).pathname;
const STORE = (readFileSync(HERE + 'hub-store.js', 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(HERE + '.owner-key', 'utf8').trim();
const raw = async (b) => {
  for (let i = 0; i < 5; i++) {
    try {
      const r = await (await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b), signal: AbortSignal.timeout(90000) })).json();
      if (r && (r.ok || r.error)) return r;
    } catch (e) { if (i === 4) return { ok: false, error: 'no answer (' + String(e.message || e).slice(0, 40) + ')' }; }
    await new Promise((r) => setTimeout(r, 2000));
  }
};
const { courses } = (await raw({ op: 'ownerCourses', owner: OWNER })).result;
const sc = courses.find((c) => c.name === 'Role check — not a course' && !c.deleted);
if (!sc) { console.error('no scratch course: run node store/check-roles.mjs first'); process.exit(1); }
const TK = sc.tutorKey;
const roster = Object.values((await raw({ op: 'roster', key: TK })).result.trainees || {}).filter(Boolean);
const T1 = (roster.find((t) => t.name === 'Role Check One') || {}).token;
if (!T1) { console.error('no Role Check One on the scratch course'); process.exit(1); }
const S1 = 'DRAFT-MARK-STAGE-ONE', FIN = 'DRAFT-MARK-FINAL';
const was = ((await raw({ op: 'get', key: TK, token: T1, kind: 'celta5t' })).result || {}).data || null;
let bad = 0;
const say = (ok, what) => { if (!ok) bad++; console.log((ok ? 'ok   ' : 'FAIL ') + what); };
const seen = async () => { const g = JSON.stringify((await raw({ op: 'get', token: T1, kind: 'celta5t' })).result || {}), b = JSON.stringify((await raw({ op: 'boot', token: T1 })).result || {});
  return { getS1: g.includes(S1), bootS1: b.includes(S1), getFin: g.includes(FIN), bootFin: b.includes(FIN) }; };
const base = Object.assign({}, was || {});
try {
  await raw({ op: 'put', key: TK, token: T1, kind: 'celta5t', data: Object.assign({}, base, { stage1: { strengths: S1, actionPlan: S1 }, final: { gradeReview: FIN } }) });
  let v = await seen();
  say(!v.getS1 && !v.bootS1, 'a Stage 1 draft is not handed to the trainee (read, and boot)');
  say(!v.getFin && !v.bootFin, 'an unsigned final part is not handed to the trainee');
  const t = JSON.stringify((await raw({ op: 'get', key: TK, token: T1, kind: 'celta5t' })).result || {});
  say(t.includes(S1) && t.includes(FIN), 'the tutor still reads both');
  await raw({ op: 'put', key: TK, token: T1, kind: 'celta5t', data: Object.assign({}, base, { stage1: { strengths: S1, actionPlan: S1, returnedAt: new Date().toISOString() }, final: { gradeReview: FIN, signed: { name: 'Check Tutor', at: new Date().toISOString() } } }) });
  v = await seen();
  say(v.getS1 && v.bootS1, 'a returned Stage 1 reaches the trainee');
  say(v.getFin && v.bootFin, 'a signed final part reaches the trainee');
} finally {
  await raw({ op: 'put', key: TK, token: T1, kind: 'celta5t', data: was || {} });
  const end = JSON.stringify((await raw({ op: 'get', key: TK, token: T1, kind: 'celta5t' })).result || {});
  say(!end.includes(S1) && !end.includes(FIN), 'the record is back as it was');
}
console.log(bad ? '\n' + bad + ' failure(s)' : '\nA trainee reads a stage only once it is returned.');
process.exit(bad ? 1 : 0);
