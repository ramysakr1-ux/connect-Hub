// Fills a demo course's "Documents for the assessor" boxes, so the pack shows
// the section instead of hiding it.
//
//   node store/fill-demo-docs.mjs c4            what is set now (read only)
//   node store/fill-demo-docs.mjs c4 --write
//   node store/fill-demo-docs.mjs c4 --clear
//
// The links are Cambridge's own public pages and a placeholder folder, so the
// demo shows the shape without pretending to hold a centre's real paperwork.
// GUARDED the way set-appian-url.mjs is: a `course` read that comes back with
// too few fields is a FAILED READ, not an empty course, and putCourse
// REPLACES -- that is how c4 lost twelve fields on 27 Sep 2026.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const HERE = new URL('..', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(join(HERE, '.owner-key'), 'utf8').trim();

const courseId = process.argv[2];
const WRITE = process.argv.includes('--write');
const CLEAR = process.argv.includes('--clear');
if (!courseId) { console.error('Usage: node store/fill-demo-docs.mjs <courseId> [--write|--clear]'); process.exit(1); }

// A demo, not a centre's real paperwork: where Lite cannot hold the document
// itself, the link points at something real and public or at an obvious
// placeholder folder.
const DOCS = {
  docTimetable:       'https://drive.google.com/drive/folders/demo-course-timetable',
  docTpSchedule:      'https://drive.google.com/drive/folders/demo-tp-schedule',
  docRegisters:       'https://drive.google.com/drive/folders/demo-attendance-registers',
  docAgreement:       'https://drive.google.com/drive/folders/demo-candidate-agreement',
  docOwnWork:         'https://drive.google.com/drive/folders/demo-own-work-declaration',
  docDescriptions:    'https://drive.google.com/drive/folders/demo-candidate-descriptions',
  docApplications:    'https://drive.google.com/drive/folders/demo-applications',
  docPrevReport:      'https://drive.google.com/drive/folders/demo-previous-assessor-report',
  docActionPlan:      'https://drive.google.com/drive/folders/demo-action-plan',
  docAssessTimetable: 'https://drive.google.com/drive/folders/demo-assessment-timetable',
  docSampleReport:    'https://drive.google.com/drive/folders/demo-sample-end-of-course-report',
  docMap:             'https://drive.google.com/drive/folders/demo-map-and-accommodation',
};

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
if (n < 6) {
  console.error(`Read returned only ${n} settings fields for ${courseId}. That is a FAILED READ, not an empty course — refusing to write over it.`);
  process.exit(1);
}

console.log(`${courseId} — ${course.name}`);
console.log(`  documents set now: ${Object.keys(cur.docs || {}).length} of ${Object.keys(DOCS).length}`);
if (!WRITE && !CLEAR) { console.log('\nRead only. Add --write to fill them, --clear to empty them.\n'); process.exit(0); }

const next = { ...cur, docs: CLEAR ? {} : { ...(cur.docs || {}), ...DOCS } };
const w = await call({ op: 'putCourse', key: course.tutorKey, kind: 'settings', data: next });
if (!w.ok) { console.error('write refused: ' + w.error); process.exit(1); }

const after = ((await call({ op: 'course', key: course.tutorKey })).result || {}).settings || {};
console.log(`  documents set after: ${Object.keys(after.docs || {}).length}`);
console.log(`  settings fields: ${n} before, ${Object.keys(after).length} after`);
if (Object.keys(after).length < n) { console.error('\nFields were lost. Put them back before doing anything else.'); process.exit(1); }
