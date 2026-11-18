/* Does a record of any size go in and come back whole? (18 Nov 2026, store v256)
 * Against the role check's scratch course only ("Role check — not a course"), never a real one.
 * Writes, as the tutor, a feedback record and a filed TP for "Role Check One" at four sizes:
 * one that fits a cell, one that fits packed, and two that fit neither (pictures in a document do
 * not pack, so random text stands in for them), then reads each back three ways (the record, the
 * trainee's own boot, the tutor's boot) and compares. Ends by putting a small record back.
 *   node store/check-big-records.mjs
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

const prose = (n) => { const w = 'the trainee set the task clearly and monitored closely while learners worked in pairs '.split(' '); let s = ''; for (let i = 0; s.length < n; i++) s += w[i % w.length] + ' '; return s.slice(0, n); };
const noise = (n) => { let s = ''; while (s.length < n) s += Math.random().toString(36).slice(2); return s.slice(0, n); };
const rec = (label, body) => ({ status: 'returned', label: 'TP1 · ' + label, returnedAt: Date.now(), state: { f: { fTP: 'TP1' } }, docHTML: '<h1>Tutor’s Feedback</h1><p>' + body + '</p>' });
const SIZES = [['fits a cell', prose(30000)], ['fits packed', prose(150000)], ['too big packed', noise(140000)], ['far too big', noise(900000)], ['back to small', prose(8000)]];

let bad = 0;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
for (const [label, body] of SIZES) {
  const r = rec(label, body), t0 = Date.now();
  const put = await raw({ op: 'put', key: TK, token: T1, kind: 'feedback', data: r });
  const putH = await raw({ op: 'put', key: TK, token: T1, kind: 'tpHistory', data: { 1: r } });
  const ms = Date.now() - t0;
  if (!put.ok || !putH.ok) { bad++; console.log('FAIL', label, '| put refused:', (put.error || putH.error || '').slice(0, 160)); continue; }
  const got = (await raw({ op: 'get', key: TK, token: T1, kind: 'feedback' })).result;
  const gotH = (await raw({ op: 'get', key: TK, token: T1, kind: 'tpHistory' })).result;
  const tb = (await raw({ op: 'boot', token: T1 })).result || {};
  const own = ((tb.me || {}).records || tb.records || {});
  const kb = (await raw({ op: 'boot', key: TK })).result || {};
  const mine = (Array.isArray(kb.roster) ? kb.roster : Object.values(kb.roster || {})).find((t) => t && t.token === T1) || {};
  const checks = {
    record: same((got || {}).data ?? got, r),
    history: same((((gotH || {}).data ?? gotH) || {})[1], r),
    'tutor boot': same((mine.records || {}).feedback, r) && same(((mine.records || {}).tpHistory || {})[1], r),
    'trainee boot': own.feedback ? same(own.feedback, r) : 'not in boot',
  };
  const ok = Object.values(checks).every((v) => v === true || v === 'not in boot');
  if (!ok) bad++;
  console.log(ok ? 'ok  ' : 'FAIL', label.padEnd(15), String(JSON.stringify(r).length).padStart(7), 'characters |', 'put', ms, 'ms |', JSON.stringify(checks));
}
console.log(bad ? bad + ' size(s) failed' : 'Every size went in and came back whole.');
process.exit(bad ? 1 : 0);
