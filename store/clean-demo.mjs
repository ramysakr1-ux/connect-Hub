/**
 * Connect Lite — what a walkthrough left behind on a demo course, and how to
 * take it off again.
 *
 *   node store/clean-demo.mjs                 report on every demo course (READ ONLY)
 *   node store/clean-demo.mjs --write         clean every demo course
 *   node store/clean-demo.mjs --write c6      clean just that one
 *
 * WHY THIS EXISTS. Ramy, 6 Oct 2026: "Maybe you should like clean the demo,
 * whatever I did there." A demo course goes out to prospective centres under
 * the promise in DEMO-NOTE.md -- "it is a demo course of mine, so nothing you
 * do touches anybody's real record" -- so anything typed into one while
 * testing is the next person's first impression of Lite.
 *
 * WHAT IT CLEANS, and why only this. Everything the seed owns is already
 * restorable: `node seed-standing-demos.mjs --which start --write --course c6`
 * re-dresses a course it made. What the seed does NOT know about is the
 * candidate agreement, built on 5-6 Oct 2026, after both standing demos were
 * seeded. That is the one thing a walkthrough can leave on a demo that
 * nothing else puts back:
 *
 *   settings.agreement        the four sections the centre writes
 *   settings.docs.docAgreement  a link to the centre's own agreement instead
 *   each trainee's `agreement` record   the signature typed on screen
 *
 * A signature is written with the TRAINEE'S OWN TOKEN, not the course key: the
 * store's TUTOR_WRITES has no `agreement` in it on purpose -- the centre
 * writes the words, only the candidate signs them. The owner key gets the
 * roster, the roster carries the tokens, and each clear goes out as that
 * candidate.
 *
 * REFUSALS. c1 (the scratch course), c2, c3 (the TP point library) and c5 are
 * never touched, whatever is asked, and a course whose name is not a demo's is
 * skipped. There is no undo.
 *
 * THE GUARD, from 27 Sep 2026 (see restore-c4-settings.mjs): `putCourse`
 * REPLACES. A `course` read that comes back with fewer fields than it should
 * has FAILED -- it has not returned an empty course. Never merge onto it and
 * never write the result. Here that means: a settings read of under eight
 * fields stops the run.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const HERE = new URL('..', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
/* A missing key is an ordinary thing to happen -- it is gitignored, so a
   fresh clone never has one -- and it arrived as a stack trace the first
   time (25 Sep 2026). Say where it goes instead. */
const KEYFILE = join(HERE, '.owner-key');
const OWNER = (process.env.OWNER_KEY || (existsSync(KEYFILE) ? readFileSync(KEYFILE, 'utf8') : '')).trim();
if (!OWNER || OWNER === 'PASTE_THE_KEY_HERE') {
  console.error('\nNo owner key, so there is nothing to read the demo courses with.\n');
  console.error('  It belongs in ' + KEYFILE + ' (gitignored), or in OWNER_KEY.');
  console.error('  To find it: open the store in the Apps Script editor, choose ownerKey');
  console.error('  in the function list, press Run, and copy the part after ?o=.\n');
  process.exit(1);
}

const WRITE = process.argv.includes('--write');
const NAMED = process.argv.slice(2).filter((a) => /^c\d+$/.test(a));
const KEEP = new Set(['c1', 'c2', 'c3', 'c5']);
const IS_DEMO = /^(Demo — |Finished course — )/;
/* A settings object has fourteen-odd fields. Eight is well under anything real
   and well over anything an Apps Script hiccup returns. */
const FLOOR = 8;
const AGREEMENT_FIELDS = ['agrExpectations', 'agrSpecialRequirements', 'agrPreCourse', 'agrAttendance', 'agrPlagiarism', 'agrResubmissions', 'agrDeferrals', 'agrFees', 'agrSpecialConsideration', 'agrFromUs', 'agrComplaints', 'agrMode', 'agrData'];

const once = async (b) => {
  const r = await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) });
  const t = await r.text();
  try { return JSON.parse(t); } catch { return { ok: false, transient: true, error: 'non-JSON' }; }
};
const call = async (b) => {
  for (let i = 0; i < 5; i++) {
    const r = await once(b);
    if (r.ok || !r.transient) return r;
    await new Promise((x) => setTimeout(x, 3000 * (i + 1)));
  }
  return { ok: false, error: 'gave up' };
};

const snip = (s, n = 72) => { const t = String(s || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1) + '…' : t; };

const list = await call({ op: 'ownerCourses', owner: OWNER });
if (!list.ok) { console.error('ownerCourses failed: ' + list.error); process.exit(1); }
const all = list.result.courses || list.result;

let targets = all.filter((c) => IS_DEMO.test(c.courseName || c.name || ''));
if (NAMED.length) targets = targets.filter((c) => NAMED.includes(String(c.id)));
for (const id of NAMED) {
  if (KEEP.has(id)) { console.error('\n' + id + ' is not a demo and is never cleaned by this script. Stopping.\n'); process.exit(1); }
  if (!targets.some((c) => String(c.id) === id)) {
    const c = all.find((x) => String(x.id) === id);
    console.error('\n' + id + (c ? ' is "' + (c.courseName || c.name) + '", which is not a demo course.' : ' does not exist.') + ' Stopping.\n');
    process.exit(1);
  }
}
if (!targets.length) { console.log('No demo courses found.'); process.exit(0); }

let dirty = 0, skipped = 0, cleaned = 0;

for (const c of targets) {
  const name = c.courseName || c.name || '(no name)';
  if (KEEP.has(String(c.id))) { console.log('\n' + c.id + ' skipped (never cleaned).'); continue; }
  console.log('\n' + c.id + '  ' + name);

  const read = await call({ op: 'course', key: c.tutorKey });
  const s = read.result && read.result.settings;
  if (s == null) { console.log('  settings: MISSING — failed read, skipping this course'); skipped++; continue; }
  const fields = Object.keys(s).length;
  if (fields < FLOOR) {
    console.log('  settings: only ' + fields + ' fields. That is a FAILED READ, not an empty course — skipping, nothing written.');
    skipped++;
    continue;
  }
  console.log('  settings: ' + fields + ' fields');

  const agr = s.agreement || {};
  const written = AGREEMENT_FIELDS.filter((k) => String(agr[k] || '').trim());
  const ownDoc = String((s.docs || {}).docAgreement || '').trim();
  if (written.length) { for (const k of written) console.log('  agreement.' + k.replace(/^agr/, '').padEnd(14) + snip(agr[k])); }
  else console.log('  agreement:     (not written)');
  console.log('  own document:  ' + (ownDoc || '(none)'));

  const r = await call({ op: 'roster', key: c.tutorKey });
  const people = (r.result && r.result.trainees) || [];
  const signed = people.filter((p) => {
    const a = (p.records || {}).agreement;
    return a && (a.name || a.at || a.ink);
  });
  console.log('  roster:        ' + people.length + (people.length === 1 ? ' candidate, ' : ' candidates, ') + signed.length + ' signed');
  for (const p of signed) {
    const a = p.records.agreement;
    console.log('                 ' + String(p.name || '?').padEnd(22) + 'signed "' + snip(a.name, 30) + '"' + (a.at ? ' on ' + String(a.at).slice(0, 10) : '') + (a.ink ? ' (+ drawn)' : ''));
  }

  const toDo = written.length || ownDoc || signed.length;
  if (!toDo) { console.log('  → clean already.'); continue; }
  dirty++;

  if (!WRITE) {
    console.log('  → would clear: ' + [written.length ? written.length + ' written section(s)' : '', ownDoc ? 'the own-document link' : '', signed.length ? signed.length + ' signature(s)' : ''].filter(Boolean).join(', '));
    continue;
  }

  /* The course's own words. Read-modify-write of the WHOLE settings object,
     because putCourse replaces it; `docs` keeps its other seven fields. */
  const docs = { ...(s.docs || {}) };
  delete docs.docAgreement;
  const want = { ...s, agreement: {}, docs: docs };
  const w = await call({ op: 'putCourse', key: c.tutorKey, kind: 'settings', data: want });
  if (!w.ok) { console.log('  write refused: ' + w.error); skipped++; continue; }

  const after = (await call({ op: 'course', key: c.tutorKey })).result?.settings;
  if (!after || Object.keys(after).length < FLOOR) {
    console.log('  read-back returned ' + (after ? Object.keys(after).length + ' fields' : 'nothing') + '. That is a FAILED READ — run the dry run again before touching anything.');
    skipped++;
    continue;
  }
  let bad = 0;
  for (const k of Object.keys(want)) {
    if (JSON.stringify(after[k]) !== JSON.stringify(want[k])) { console.log('  MISMATCH ' + k + ': ' + snip(JSON.stringify(after[k]))); bad++; }
  }
  console.log(bad ? '  ' + bad + ' settings field(s) wrong.' : '  agreement cleared from settings; the other ' + (Object.keys(want).length - 2) + ' fields unchanged.');
  if (bad) { skipped++; continue; }
  cleaned++;

  /* The signatures, each as the candidate who made it. */
  for (const p of signed) {
    const cl = await call({ op: 'put', token: p.token, kind: 'agreement', data: {} });
    console.log('  ' + (cl.ok ? 'cleared  ' : 'REFUSED  ') + String(p.name || p.token) + (cl.ok ? '' : ' — ' + cl.error));
  }
  const back = await call({ op: 'roster', key: c.tutorKey });
  const left = ((back.result && back.result.trainees) || []).filter((p) => { const a = (p.records || {}).agreement; return a && (a.name || a.at || a.ink); });
  console.log('  ' + (left.length ? left.length + ' signature(s) STILL THERE: ' + left.map((p) => p.name).join(', ') : 'no signatures left.'));
}

/* The summary says what happened, including what did NOT: a course skipped
   for a short read looked exactly like a clean one in the first draft of this
   script, under a closing line that said "Done". */
if (!WRITE) {
  console.log(dirty
    ? '\nDry run \u2014 nothing written. Re-run with --write to clear it.'
    : '\nNothing to clean.');
} else {
  console.log('\n' + (cleaned ? cleaned + ' course(s) cleaned. ' : 'Nothing cleaned. ')
    + 'Everything else on these courses is the seed\u2019s, and\n'
    + 'seed-standing-demos.mjs --write --course <id> puts that back.');
}
if (skipped) console.log(skipped + ' course(s) SKIPPED and left exactly as they were \u2014 see above for why.');
console.log('');
process.exit(skipped ? 1 : 0);
