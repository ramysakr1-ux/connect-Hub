// The malpractice assignment (a5) told a trainee to quote "the Cambridge AI
// guidance" and a "trainee agreement", and said both were "in the resource
// hub". No Cambridge document of that name exists in the centre's folder, and
// Lite has no resource hub -- so the brief sent a trainee to look for two
// documents nobody could hand them, in a place that is not there. Found in the
// compliance audit, 29 Sep 2026; Ramy: "remove that AI sentence and keep the
// centre policy one."
//
//   node store/drop-ai-guidance-sentence.mjs c5
//   node store/drop-ai-guidance-sentence.mjs c5 --write
//
// The shipped default (assignment-defaults.js) is already fixed, but a course
// that has saved its own wording keeps its own copy and never re-reads the
// default. This edits that saved copy, in place, on ONE named course.
//
// GUARDS.
//   - A `course` read answering with fewer kinds than it should is a FAILED
//     read, not an empty course, and writing onto it would replace the course
//     with the failure (see restore-c4-settings.mjs). It refuses one.
//   - The wording must carry all five assignment keys, a5 among them.
//   - It replaces two exact strings and nothing else; if either is missing or
//     appears twice it stops and says so, rather than guessing.
//   - Nothing is written without --write, and everything is read back after.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const HERE = new URL('..', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(join(HERE, '.owner-key'), 'utf8').trim();

const courseId = process.argv[2];
const WRITE = process.argv.includes('--write');
if (!courseId || courseId.startsWith('--')) {
  console.error('Usage: node store/drop-ai-guidance-sentence.mjs <courseId> [--write]');
  process.exit(1);
}

const call = async (body) => {
  for (let i = 0; i < 5; i++) {
    try { const r = await (await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(body) })).json(); if (r && r.ok) return r.result; if (r && r.error) throw new Error(r.error); }
    catch (e) { if (i === 4) throw e; }
    await new Promise((r) => setTimeout(r, 1200));
  }
};

/* The sentence to go, and the marking criterion that asked for it. A criterion
   that still asks for "Cambridge guidance" after the brief stops asking would
   mark a trainee down for leaving out what they were never told to put in. */
const OLD_BODY = 'Quote the relevant line from the Cambridge AI guidance and the trainee agreement you accepted when you set up your account.\nBoth documents are in the resource hub. You have already signed one of them.';
const NEW_BODY = 'If you are not sure which clause, ask — the policy is the centre’s to hand you, and quoting the wrong line is not what this section is testing.';
const OLD_CRIT = 'Quotes the specific centre policy and Cambridge guidance clause breached, and explains why it applies here.';
const NEW_CRIT = 'Quotes the specific centre policy clause breached, and explains why it applies here.';

const { courses } = await call({ op: 'ownerCourses', owner: OWNER });
const course = courses.find((c) => c.id === courseId);
if (!course) { console.error('No course ' + courseId); process.exit(1); }
console.log(courseId + ' — ' + (course.courseName || course.name || ''));

const res = await call({ op: 'course', key: course.tutorKey });
const kinds = Object.keys(res || {});
if (kinds.length < 2 || !res.wording) { console.error('Short read (' + kinds.join(', ') + ') — refusing. Run it again.'); process.exit(1); }
const w = res.wording;
const keys = Object.keys(w || {});
if (!keys.includes('a5')) { console.error('No a5 in the wording (' + keys.join(', ') + ') — nothing to do.'); process.exit(0); }
console.log('wording keys: ' + keys.join(', '));

const before = JSON.stringify(w);
const bodyHits = before.split(JSON.stringify(OLD_BODY).slice(1, -1)).length - 1;
const critHits = before.split(OLD_CRIT).length - 1;
console.log('the AI sentence: ' + bodyHits + ' · the criterion: ' + critHits);
if (!bodyHits && !critHits) { console.log('Already clean — nothing to write.'); process.exit(0); }
if (bodyHits > 1 || critHits > 1) { console.error('More than one match — refusing to guess.'); process.exit(1); }

let after = before;
if (bodyHits) after = after.replace(JSON.stringify(OLD_BODY).slice(1, -1), JSON.stringify(NEW_BODY).slice(1, -1));
if (critHits) after = after.replace(OLD_CRIT, NEW_CRIT);
const next = JSON.parse(after);
if (Object.keys(next).length !== keys.length) { console.error('Key count changed — refusing.'); process.exit(1); }
console.log('\n--- section 2 after ---\n' + (next.a5.sections.find((s) => /which rule it breached/i.test(s.label || '')) || {}).body);

if (!WRITE) { console.log('\nDry run. Add --write to save it.'); process.exit(0); }
await call({ op: 'putCourse', key: course.tutorKey, kind: 'wording', data: next });
const back = await call({ op: 'course', key: course.tutorKey });
const blob = JSON.stringify(back.wording);
console.log('\nread back — keys: ' + Object.keys(back.wording).join(', '));
console.log('AI sentence now present: ' + /Cambridge AI guidance/.test(blob));
console.log('resource hub now present: ' + /resource hub/.test(blob));
