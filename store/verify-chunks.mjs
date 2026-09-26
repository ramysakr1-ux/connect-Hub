/**
 * Prove a record too big for one cell survives the round trip -- against the
 * LIVE store, on the demo course c3 only, with a candidate added for the run
 * and purged after it.
 *
 *   node store/verify-chunks.mjs
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
const HERE = new URL('..', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(join(HERE, '.owner-key'), 'utf8').trim();
const call = async b => {
  for (let i = 0; i < 6; i++) {
    const r = await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) });
    const t = await r.text();
    try { return JSON.parse(t); } catch (e) { await new Promise(res => setTimeout(res, 4000)); }
  }
  return { ok: false, error: 'no JSON after 6 tries' };
};
const ok = (c, m) => { console.log((c ? '  ok   ' : '  FAIL ') + m); if (!c) process.exitCode = 1; };

const oc = await call({ op: 'ownerCourses', owner: OWNER });
const c3 = (oc.result.courses || []).find(c => c.id === 'c3');
if (!c3) { console.log('no course c3'); process.exit(1); }
const added = await call({ op: 'addTrainee', key: c3.tutorKey, name: 'Chunk Probe', group: '9' });
if (!added.ok) { console.log('could not add the probe candidate: ' + added.error); process.exit(1); }
const token = added.result.token;
/* beforeExit fires again after the await inside it resolves, so this has to
   latch: without the flag it purges once and then retries for ever. */
let cleaned = false;
process.on('beforeExit', async () => {
  if (cleaned || process.env.KEEP) return;
  cleaned = true;
  const p = await call({ op: 'purgeTrainee', key: c3.tutorKey, token });
  console.log(p.ok ? 'probe candidate purged' : 'purge failed: ' + p.error);
});

const big = { docHTML: '<h1>x</h1>' + 'y'.repeat(120000), state: { f: { fTP: 'TP1' } } };
console.log('1. a 120 KB record, over two cells');
const w = await call({ op: 'put', key: c3.tutorKey, token, kind: 'feedback', data: big });
ok(w.ok, 'the put was accepted' + (w.ok ? '' : ': ' + w.error));
const g = await call({ op: 'get', key: c3.tutorKey, token, kind: 'feedback' });
ok(((g.result || {}).data || {}).docHTML === big.docHTML, 'get returns it whole (' + (((g.result||{}).data||{}).docHTML||'').length + ' chars)');
const ro = await call({ op: 'roster', key: c3.tutorKey });
const mine = Object.values(ro.result.trainees || {}).find(t => t.token === token) || {};
ok((((mine.records || {}).feedback) || {}).docHTML === big.docHTML, 'the roster assembles it too');
ok(!('_chunks' in (mine.records || {})), 'no working keys leak into the roster');
const me = await call({ op: 'me', token });
ok(((((me.result || {}).records || {}).feedback) || {}).docHTML === big.docHTML, 'the trainee\'s own read assembles it');

console.log('2. the same record, back under the limit');
const small = { docHTML: '<h1>small again</h1>', state: { f: { fTP: 'TP1' } } };
const w2 = await call({ op: 'put', key: c3.tutorKey, token, kind: 'feedback', data: small });
ok(w2.ok, 'the put was accepted' + (w2.ok ? '' : ': ' + w2.error));
const g2 = await call({ op: 'get', key: c3.tutorKey, token, kind: 'feedback' });
ok(((g2.result || {}).data || {}).docHTML === small.docHTML, 'no stale tail is appended: ' + JSON.stringify((((g2.result||{}).data||{}).docHTML||'').slice(0, 40)));

console.log('3. a teaching practice too big for one cell');
const tp = { 1: { status: 'returned', label: 'TP1', docHTML: 'z'.repeat(90000) } };
const w3 = await call({ op: 'put', key: c3.tutorKey, token, kind: 'tpHistory', data: tp });
ok(w3.ok, 'the put was accepted' + (w3.ok ? '' : ': ' + w3.error));
const g3 = await call({ op: 'get', key: c3.tutorKey, token, kind: 'tpHistory' });
ok((((g3.result || {}).data || {})[1] || {}).docHTML === tp[1].docHTML, 'the history assembles it (' + ((((g3.result||{}).data||{})[1]||{}).docHTML||'').length + ' chars)');

console.log(process.exitCode ? '\nSomething failed.' : '\nA record can outgrow a cell.');
