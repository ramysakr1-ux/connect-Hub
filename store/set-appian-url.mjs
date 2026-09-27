// Sets a course's Appian address -- the same thing Course admin -> Settings
// writes, from the command line, for testing and for setting up a demo.
//
//   node store/set-appian-url.mjs <courseId> <https://...>
//   node store/set-appian-url.mjs <courseId> --clear
//
// GUARDED. A `course` read can come back with an empty settings object (an
// Apps Script hiccup, not an empty course), and putCourse REPLACES -- that is
// how c4 lost twelve fields on 27 Sep 2026. So this refuses to write unless
// the read returned a settings object that already looks whole.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const HERE = new URL('..', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(join(HERE, '.owner-key'), 'utf8').trim();

const [, , courseId, value] = process.argv;
if (!courseId || !value) {
  console.error('Usage: node store/set-appian-url.mjs <courseId> <https://... | --clear>');
  process.exit(1);
}
const url = value === '--clear' ? '' : value;
if (url && !/^https?:\/\//i.test(url)) { console.error('Must be an http(s) address.'); process.exit(1); }

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

const list = await call({ op: 'ownerCourses', owner: OWNER });
if (!list.ok) { console.error('ownerCourses failed: ' + list.error); process.exit(1); }
const course = (list.result.courses || list.result).find((c) => c.id === courseId);
if (!course) { console.error('no course ' + courseId); process.exit(1); }

const read = await call({ op: 'course', key: course.tutorKey });
const cur = (read.result && read.result.settings) || {};
const n = Object.keys(cur).length;
// THE GUARD. A settings object this small is a failed read, not a bare course.
if (n < 6) {
  console.error(`Read returned only ${n} settings fields for ${courseId}. That is a FAILED READ, not an empty course — refusing to write over it. Try again.`);
  process.exit(1);
}

const next = { ...cur, appianUrl: url };
const w = await call({ op: 'putCourse', key: course.tutorKey, kind: 'settings', data: next });
if (!w.ok) { console.error('write refused: ' + w.error); process.exit(1); }

const after = ((await call({ op: 'course', key: course.tutorKey })).result || {}).settings || {};
console.log(`${courseId} — ${course.name}`);
console.log(`  settings fields: ${n} before, ${Object.keys(after).length} after`);
console.log(`  appianUrl: ${JSON.stringify(after.appianUrl)}`);
if (Object.keys(after).length < n) { console.error('\nFields were lost. Put them back before doing anything else.'); process.exit(1); }
