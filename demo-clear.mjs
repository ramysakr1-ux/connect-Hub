/**
 * Connect Lite — list demo courses, and delete them.
 *
 *   node demo-clear.mjs                 list every course, newest last
 *   node demo-clear.mjs <id>            delete that one
 *   node demo-clear.mjs --demos         delete every course named "CELTA — demo course"
 *
 * Deleting a course kills its tutor link, its assessor link and every
 * candidate link at once. That is what "the demo expires" means in Lite:
 * there is no per-link expiry to set, and a course you delete is the same
 * thing arrived at without new machinery.
 *
 * It will not delete a course whose name it does not recognise unless you name
 * that course's id yourself — a real centre's course is one careless --demos
 * away otherwise, and there is no undo.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const HERE = new URL('.', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const DEMO_NAME = /demo course/i;

const KEYFILE = join(HERE, '.owner-key');
function ownerKey() {
  if (process.env.OWNER_KEY) return process.env.OWNER_KEY.trim();
  if (existsSync(KEYFILE)) return readFileSync(KEYFILE, 'utf8').trim();
  console.error('No owner key. Put it in .owner-key beside this script, or set OWNER_KEY.');
  process.exit(1);
}
const RAW = ownerKey();
if (RAW === 'PASTE_THE_KEY_HERE' || !RAW) {
  console.error('\n' + KEYFILE + ' holds the placeholder text, not your owner key.\n');
  console.error('  Open the store in the Apps Script editor, choose ownerKey in the function');
  console.error('  list, press Run, and copy the part after ?o= into that file.\n');
  process.exit(1);
}
const OWNER = RAW;

/* A wrong key is an ordinary thing to happen, not a crash. The store answers
   "Not yours to open", which said nothing about WHICH key was wrong or where
   it is kept -- and arrived as a stack trace (Ramy hit exactly this with the
   placeholder still in the file, 25 Sep 2026). */
function explain(err){
  const m = String(err && err.message || err);
  if (/not yours|owner|denied|forbidden/i.test(m)) {
    console.error('\nThe store refused that owner key.\n');
    console.error('  It is read from ' + KEYFILE + (process.env.OWNER_KEY ? ' (overridden by OWNER_KEY)' : ''));
    console.error('  and right now it holds ' + (RAW === 'PASTE_THE_KEY_HERE'
      ? 'the placeholder text, not a key.'
      : RAW.length + ' characters.'));
    console.error('\n  To find the real one: open the store in the Apps Script editor, choose');
    console.error('  ownerKey in the function list, press Run, and copy the part after ?o=.\n');
  } else {
    console.error('\nThe store said: ' + m + '\n');
  }
  process.exit(1);
}

const call = async body => {
  const r = await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ owner: OWNER }, body)) });
  const out = await r.json();
  if (!out.ok) explain(new Error(out.error || 'store error'));
  return out.result;
};

const arg = process.argv[2];
const listed = await call({ op: 'ownerCourses' });
const courses = listed.courses || listed || [];

if (!arg) {
  console.log(courses.length + ' course(s):\n');
  for (const c of courses) {
    const name = (c.settings && c.settings.courseName) || c.name || '(no name)';
    console.log('  ' + String(c.id).padEnd(12) + (DEMO_NAME.test(name) ? 'DEMO  ' : '      ') + name);
  }
  console.log('\nDelete one:  node demo-clear.mjs <id>');
  console.log('Delete every demo:  node demo-clear.mjs --demos');
  process.exit(0);
}

const targets = arg === '--demos'
  ? courses.filter(c => DEMO_NAME.test((c.settings && c.settings.courseName) || c.name || ''))
  : courses.filter(c => String(c.id) === String(arg));

if (!targets.length) {
  console.error(arg === '--demos' ? 'No demo courses to delete.' : 'No course with id ' + arg + '.');
  process.exit(1);
}

/* Named the courses about to go before going, because the id alone is not
   something anybody can check at a glance. */
console.log('About to delete:');
for (const c of targets) console.log('  ' + c.id + '  ' + ((c.settings && c.settings.courseName) || c.name || '(no name)'));

for (const c of targets) {
  /* The store asks for the id typed back as a confirmation; the owner console
     does the same with a text box. */
  await call({ op: 'deleteCourse', course: c.id, confirm: c.id });
  console.log('deleted ' + c.id);
}
console.log('\nTheir links no longer open anything.');
