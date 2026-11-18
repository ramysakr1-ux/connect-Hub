/* Can a trainee read their TP feedback before their self-evaluation is in, or while the tutor is writing it?
 * (19 Nov 2026, store v263)
 * Against the role check's scratch course only ("Role check — not a course"), never a real one. As the tutor, writes
 * marked feedback for "Role Check One" -- first a draft, then returned, with the TP filed in the history -- and as that
 * trainee reads it every way a trainee can (get feedback, get tpHistory, me, boot), looking for the marks. Then turns
 * the self-evaluation in and looks again. Ends by putting the feedback and the self-evaluation back as they were; the
 * history cannot lose a TP once it has one, so TP7 on the scratch trainee stays as an empty placeholder.
 *   node store/check-feedback-hold.mjs
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
const DOC = 'HOLD-MARK-DOCUMENT', AP = 'HOLD-MARK-ACTION-POINT', GR = 'HOLD-MARK-GRADE';
const tget = async (kind) => ((await raw({ op: 'get', key: TK, token: T1, kind })).result || {}).data || null;
const was = { feedback: await tget('feedback'), selfeval: await tget('selfeval'), tpHistory: await tget('tpHistory') };
const TP = 7;   // a TP number the scratch trainee has nothing filed under
const fb = (status) => Object.assign({ status, label: 'TP' + TP, docHTML: '<p>' + DOC + '</p>', state: { f: { fTP: 'TP' + TP, fTutor: 'Check Tutor', fDate: '2026-11-17', fGrade: GR }, lists: { lAP: [{ html: AP, star: true }] } } }, status === 'returned' ? { returnedAt: new Date().toISOString() } : {});
let bad = 0;
const say = (ok, what) => { if (!ok) bad++; console.log((ok ? 'ok   ' : 'FAIL ') + what); };
/* every way a trainee's own records leave the store */
const asTrainee = async () => { const out = {};
  out.getFb = JSON.stringify((await raw({ op: 'get', token: T1, kind: 'feedback' })).result || {});
  out.getHist = JSON.stringify((await raw({ op: 'get', token: T1, kind: 'tpHistory' })).result || {});
  out.me = JSON.stringify((await raw({ op: 'me', token: T1 })).result || {});
  out.boot = JSON.stringify(((await raw({ op: 'boot', token: T1 })).result || {}).me || {});
  return out; };
const marks = (v) => Object.keys(v).filter((k) => [DOC, AP, GR].some((m) => v[k].includes(m)));
try {
  /* 1. the tutor is still writing */
  await raw({ op: 'put', key: TK, token: T1, kind: 'selfeval', data: null });
  await raw({ op: 'put', key: TK, token: T1, kind: 'feedback', data: fb('draft') });
  let v = await asTrainee();
  say(!marks(v).length, 'a draft: nothing of it reaches the trainee' + (marks(v).length ? ' (found in ' + marks(v).join(', ') + ')' : ''));
  say(/"status":"draft"/.test(v.getFb) && /"held":true/.test(v.getFb) && v.getFb.includes('TP' + TP), 'a draft: the trainee is told only that it exists and which TP');
  /* 2. returned, the self-evaluation not in */
  const ret = fb('returned');
  await raw({ op: 'put', key: TK, token: T1, kind: 'feedback', data: ret });
  await raw({ op: 'put', key: TK, token: T1, kind: 'tpHistory', data: Object.assign({}, was.tpHistory || {}, { [TP]: ret }) });
  v = await asTrainee();
  say(!marks(v).length, 'returned, no self-evaluation: nothing of it reaches the trainee' + (marks(v).length ? ' (found in ' + marks(v).join(', ') + ')' : ''));
  say(/"status":"returned"/.test(v.getFb) && /"held":true/.test(v.getFb) && v.getFb.includes('Check Tutor'), 'returned, no self-evaluation: the trainee is told it is back, which TP and whose');
  say(v.getHist.includes('"' + TP + '"') && /"held":true/.test(v.getHist), 'the history keeps that TP’s place, without its document');
  const t = JSON.stringify(await tget('feedback')) + JSON.stringify(await tget('tpHistory'));
  say(t.includes(DOC) && t.includes(AP) && t.includes(GR), 'the tutor still reads all of it');
  const rb = JSON.stringify(((await raw({ op: 'boot', key: TK })).result || {}).roster || []);
  say(rb.includes(DOC) && rb.includes(AP), 'and so does the tutors’ roster');
  /* 3. a self-evaluation saved but not turned in */
  await raw({ op: 'put', token: T1, kind: 'selfeval', data: { status: 'draft', state: { f: { fTP: 'TP' + TP } } } });
  v = await asTrainee();
  say(!marks(v).length, 'a self-evaluation saved but not turned in: still held');
  /* 4. turned in, by the trainee */
  await raw({ op: 'put', token: T1, kind: 'selfeval', data: { status: 'turned_in', turnedInAt: new Date().toISOString(), state: { f: { fTP: 'TP' + TP } } } });
  v = await asTrainee();
  say(marks(v).length === 4, 'the self-evaluation turned in: the whole of it reaches the trainee, every way (' + marks(v).join(', ') + ')');
  /* 5. taken back */
  await raw({ op: 'put', token: T1, kind: 'selfeval', data: { status: 'draft', state: { f: { fTP: 'TP' + TP } } } });
  v = await asTrainee();
  say(!marks(v).length, 'the self-evaluation taken back: held again');
} finally {
  await raw({ op: 'put', key: TK, token: T1, kind: 'feedback', data: was.feedback });
  await raw({ op: 'put', key: TK, token: T1, kind: 'selfeval', data: was.selfeval });
  /* the store never deletes a TP from a history, so the test's TP is left as an empty placeholder no page reads
     (it is not "returned"); the next run writes over the same row */
  await raw({ op: 'put', key: TK, token: T1, kind: 'tpHistory', data: { [TP]: { status: 'placeholder', label: 'TP' + TP, note: 'left by store/check-feedback-hold.mjs' } } });
  const end = JSON.stringify(await tget('feedback')) + JSON.stringify(await tget('selfeval')) + JSON.stringify(await tget('tpHistory'));
  say(![DOC, AP, GR].some((m) => end.includes(m)), 'the records are back as they were');
}
console.log(bad ? '\n' + bad + ' failure(s)' : '\nA trainee reads their feedback only once it is returned and their self-evaluation is in.');
process.exit(bad ? 1 : 0);
