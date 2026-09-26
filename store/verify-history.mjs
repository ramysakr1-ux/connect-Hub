/**
 * Prove the store keeps a two-TP history -- against the LIVE store, on the
 * demo course c3 only. Run after a deploy of the per-TP change.
 *
 *   node store/verify-history.mjs
 *
 * Writes a history of two real-sized documents for one demo candidate, reads
 * it back through the three reads the pages use (get, roster, me), then puts
 * a third entry alone and checks the first two were kept. Restores nothing:
 * c3 is the demo course and this is what it is for.
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
    try { return JSON.parse(t); } catch (e) { console.log('  (HTML answer: ' + ((t.match(/<title>([^<]*)/) || [])[1] || '?') + ', retrying)'); }
    await new Promise(res => setTimeout(res, 4000));
  }
  return { ok: false, error: 'no JSON after 6 tries' };
};
const ok = (cond, msg) => { console.log((cond ? '  ok   ' : '  FAIL ') + msg); if (!cond) process.exitCode = 1; };

const oc = await call({ op: 'ownerCourses', owner: OWNER });
const c3 = (oc.result.courses || []).find(c => c.id === 'c3');
if (!c3) { console.log('no course c3 -- mint the demo course first'); process.exit(1); }
/* Its own candidate, added for the run and purged after it -- a probe must not
   write fake documents into a real record (it did, once: Emily Carter's TP1). */
const added = await call({ op: 'addTrainee', key: c3.tutorKey, name: 'Probe Candidate', group: '9' });
if (!added.ok) { console.log('could not add the probe candidate: ' + added.error); process.exit(1); }
const who = { token: added.result.token, name: added.result.name };
console.log('candidate: ' + who.name + ' (added for this run)');
process.on('beforeExit', async () => { if (process.env.KEEP) return; const p = await call({ op: 'purgeTrainee', key: c3.tutorKey, token: who.token }); console.log(p.ok ? 'probe candidate purged' : 'purge failed: ' + p.error); });
const doc = n => ({ label: 'TP' + n + ' · ' + who.name, status: 'returned', returnedAt: Date.now() - n * 864e5,
  state: { f: { fTP: 'TP' + n } }, docHTML: '<h1>Teaching practice ' + n + '</h1>' + 'x'.repeat(30000) });

console.log('1. a two-TP history, 60 KB in one put');
const w = await call({ op: 'put', key: c3.tutorKey, token: who.token, kind: 'tpHistory', data: { 1: doc(1), 2: doc(2) } });
ok(w.ok, 'the put was accepted' + (w.ok ? '' : ': ' + w.error));

const g = await call({ op: 'get', key: c3.tutorKey, token: who.token, kind: 'tpHistory' });
const h = (g.result || {}).data || {};
ok(h[1] && h[2], 'get assembles both TPs: ' + Object.keys(h).join(','));
ok((h[2] || {}).docHTML && h[2].docHTML.length > 30000, 'TP2 came back whole (' + ((h[2] || {}).docHTML || '').length + ' chars)');

const ro2 = await call({ op: 'roster', key: c3.tutorKey });
const me2 = Object.values(ro2.result.trainees || {}).find(t => t.token === who.token);
ok(((me2.records || {}).tpHistory || {})[1] && ((me2.records || {}).tpHistory || {})[2], 'roster assembles both TPs');
ok(!('_tpRows' in (me2.records || {})), 'no working keys leak into the roster');

const meR = await call({ op: 'me', token: who.token });
const meH = ((meR.result || {}).records || {}).tpHistory || {};
ok(meH[1] && meH[2], 'the trainee\'s own read assembles both TPs');

console.log('2. a third TP put alone keeps the first two');
const w3 = await call({ op: 'put', key: c3.tutorKey, token: who.token, kind: 'tpHistory', data: { 3: doc(3) } });
ok(w3.ok, 'the put was accepted' + (w3.ok ? '' : ': ' + w3.error));
const g3 = await call({ op: 'get', key: c3.tutorKey, token: who.token, kind: 'tpHistory' });
const h3 = (g3.result || {}).data || {};
ok(h3[1] && h3[2] && h3[3], 'history holds 1, 2 and 3: ' + Object.keys(h3).join(','));

console.log('3. a record over the limit is refused with words, not a page');
const big = await call({ op: 'put', key: c3.tutorKey, token: who.token, kind: 'tracker', data: { pad: 'x'.repeat(50500) } });
ok(!big.ok && /Too large to store/.test(big.error || ''), 'refused: ' + (big.error || 'no error'));

console.log(process.exitCode ? '\nSomething failed.' : '\nThe store keeps a history.');
