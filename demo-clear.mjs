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

function ownerKey() {
  if (process.env.OWNER_KEY) return process.env.OWNER_KEY.trim();
  const f = join(HERE, '.owner-key');
  if (existsSync(f)) return readFileSync(f, 'utf8').trim();
  console.error('No owner key. Put it in .owner-key beside this script, or set OWNER_KEY.');
  process.exit(1);
}
const OWNER = ownerKey();

const call = async body => {
  const r = await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ owner: OWNER }, body)) });
  const out = await r.json();
  if (!out.ok) throw new Error(out.error || 'store error');
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
