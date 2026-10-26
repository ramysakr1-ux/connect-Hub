/* Every store op, in every role, against a scratch course: who may do what.
 *
 *   npm run check:roles            compare with store/role-matrix.json; fail on any change
 *   npm run check:roles -- --write save today's answers as the matrix (after you have read the diff)
 *
 * Run before every `clasp deploy`. Written 25 Oct 2026 after a week in which the
 * three worst bugs were all about roles: a trainee's course reply carried every
 * classmate's key, an assessor key in the browser turned a public read into
 * "read-only", and a delete reached other courses' rows. None of them needed a
 * clever test; they needed someone to ask the store, as each role, and look.
 *
 * Two halves.
 *  1. THE MATRIX. Each op is called as nobody, a trainee, a volunteer, the
 *     assessor, a tutor, the owner, and as a tutor of ANOTHER course holding this
 *     course's trainee token. The answer is recorded as "ok" or the refusal's
 *     words. The matrix is a ratchet: a change in who may do what fails the run
 *     until someone reads it and writes it in. Ops that mutate, mail, upload,
 *     rotate or delete are only called as the roles that must be refused; the
 *     permitted role is never exercised on them.
 *  2. THE SECRETS. Whatever a trainee, a volunteer or nobody gets back must
 *     carry no other person's key: not a classmate's token, not the tutor key,
 *     not the assessor key, not the owner key, not a volunteer's token.
 *
 * The scratch course is "Role check — not a course" (TR999, Elmswood): made
 * here if missing, found by name, never anything else. Its records are
 * written to and are nobody's. The cross-course tutor key is the TP point
 * library's (.library-key), a course nobody is on.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const HERE = new URL('..', import.meta.url).pathname;
const STORE = (readFileSync(HERE + 'hub-store.js', 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(HERE + '.owner-key', 'utf8').trim();
const OTHER_KEY = existsSync(HERE + '.library-key') ? readFileSync(HERE + '.library-key', 'utf8').trim() : '';
const WRITE = process.argv.includes('--write');
const NAME = 'Role check — not a course';
const MATRIX = HERE + 'store/role-matrix.json';

const raw = async (b) => {
  for (let i = 0; i < 5; i++) {
    try {
      const r = await (await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b), signal: AbortSignal.timeout(30000) })).json();
      if (r && (r.ok || r.error)) return r;
    } catch (e) { if (i === 4) return { ok: false, error: 'no answer in 30 s x5 (' + String(e.message || e).slice(0, 30) + ')' }; }
    await new Promise((r) => setTimeout(r, 1500));
  }
  throw new Error('store unreachable');
};
const hex = (n) => Array.from({ length: n / 2 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');

/* ---- the scratch course ---------------------------------------------- */
let { courses } = (await raw({ op: 'ownerCourses', owner: OWNER })).result;
let sc = courses.find((c) => c.name === NAME && !c.deleted);
if (!sc) {
  const made = await raw({ op: 'createCourse', owner: OWNER, centreNumber: 'TR999', centreName: 'Elmswood English Centre', name: NAME });
  if (!made.ok) { console.error('could not make the scratch course: ' + made.error); process.exit(1); }
  courses = made.result.courses; sc = courses.find((c) => c.id === made.result.id);
  console.log('made the scratch course', sc.id);
}
const TK = sc.tutorKey, AK = sc.assessorKey;
let roster = (await raw({ op: 'roster', key: TK })).result.trainees || [];
roster = Object.values(roster).filter(Boolean);
for (const n of ['Role Check One', 'Role Check Two']) {
  if (!roster.find((t) => t.name === n)) { const a = await raw({ op: 'addTrainee', key: TK, name: n, group: '1' }); if (!a.ok) { console.error(a.error); process.exit(1); } roster = Object.values(a.result.trainees || []).filter(Boolean); }
}
const T1 = roster.find((t) => t.name === 'Role Check One').token, T2 = roster.find((t) => t.name === 'Role Check Two').token;
let reg = (await raw({ op: 'course', key: TK })).result.volunteers || { students: [] };
if ((reg.students || []).length < 2) {
  reg = { students: [{ name: 'Role Student One', level: 'A2', token: sc.id + '-' + hex(20), here: [] }, { name: 'Role Student Two', level: 'A2', token: sc.id + '-' + hex(20), here: [] }] };
  const put = await raw({ op: 'putCourse', key: TK, kind: 'volunteers', data: reg });
  if (!put.ok) { console.error('could not put the students on the register: ' + put.error); process.exit(1); }
}
const V1 = reg.students[0].token, V2 = reg.students[1].token;
const SECRETS = { 'classmate token': T2, 'tutor key': TK, 'assessor key': AK, 'owner key': OWNER, 'volunteer token': V1, 'other volunteer token': V2 };
console.log('scratch course', sc.id, '| trainees', roster.length, '| students', reg.students.length, '| other-course key', OTHER_KEY ? 'yes' : 'NO (.library-key missing; cross-course checks skipped)');

/* ---- the roles -------------------------------------------------------- */
const ROLES = {
  nobody: {},
  trainee: { token: T1 },
  volunteer: { v: V1 },
  assessor: { a: AK },
  tutor: { key: TK },
  owner: { owner: OWNER },
};
if (OTHER_KEY) ROLES.cross = { key: OTHER_KEY, token: T1 };

/* Every op the store answers (the switch in Code.js), with the smallest body
   that names a real thing on the scratch course. */
const OPS = (readFileSync(HERE + 'store/gas/Code.js', 'utf8').match(/case '([A-Za-z0-9_]+)'/g) || []).map((s) => s.slice(6, -1));
const ARGS = {
  get: { kind: 'plan', token: T1 }, put: { kind: 'plan', token: T1, data: { v: 1, roleCheck: true } },
  putCourse: { kind: 'folpool', data: [] }, post: { text: 'role check', by: 'Role check' }, unpost: { id: 'none' },
  shareMaterial: { name: 'role check', url: 'https://example.com/role-check', by: 'Role check', tp: '1', kind: 'materials' }, unshareMaterial: { id: 'none' },
  gridSet: { token: T1, tp: 7, main: 'role check' }, gridRelease: { released: {} }, volunteerAgree: {}, volunteerReply: { yes: true },
  courseFeedback: { answers: {}, named: false }, materials: { course: sc.id }, feedback: { text: 'role check', page: 'check', role: 'check' },
  report: { text: 'role check', page: 'check', role: 'check', kind: 'check' }, readContribution: { set: 'none' }, pins: {}, inbox: {},
  feedbackSummary: {}, stats: {}, ownerPulse: {}, centres: {}, celta5Assets: {}, audio: { id: 'none' }, assessorLink: {}, demoCard: {}, me: {}, roster: {}, course: {}, boot: {}, ping: {},
  similar: { token: T1, code: 'lsrt', round: 'sub1' }, webCheck: { token: T1, code: 'lsrt', round: 'sub1' }, aiCheck: { token: T1, code: 'lsrt', round: 'sub1' }, checksOn: {},
};
/* Called ONLY as the roles that must be refused: the permitted role would
   mutate, mail, upload, rotate or delete something that is not this check's. */
const DANGER = new Set(['deleteCourse', 'purgeCourse', 'undeleteCourse', 'restoreFromBackup', 'rotateKey', 'rotateAssessorKey', 'rotateOwnerKey', 'setOpenAiKey', 'setTutorPin', 'setMyPin',
  'installReminders', 'mailCourseFeedback', 'sendCard', 'volunteerInvite', 'volunteerNotify', 'transcribeInterview', 'transcriptionOn', 'putInterviewAudio', 'deleteInterviewAudio', 'getInterviewAudio',
  'putAsset', 'putMaterial', 'purgeMaterials', 'purgeTrainee', 'removeTrainee', 'reissueTrainee', 'renameTrainee', 'renameCourse', 'cloneCourse', 'createCourse', 'addTrainee', 'addTrainees',
  'centresSeed', 'putDefaultGuidance', 'inboxRow', 'postAt', 'contribute', 'poolHeard', 'feedback', 'report', 'webCheck', 'aiCheck', 'setSearchKey', 'setClaudeKey']);
const MAY = { tutor: 1, owner: 1 };   // the roles a DANGER op is never exercised as
/* presentMail as the trainee is the one call that would really send an email (to the test trainee's address), so it is
   never exercised; every other role is still asked, and must be refused (26 Oct 2026). */
const SENDS_AS = { presentMail: { trainee: 1 } };

/* ---- 1. the matrix ---------------------------------------------------- */
const matrix = {}, replies = {};
/* The seven roles are asked at once for each op: Apps Script answers in 2-13 s,
   and one after another the seventy ops took over an hour (25 Oct 2026). */
/* A token names a trainee, so "nobody" and the volunteer must not carry one in
   an op's arguments (the first run gave nobody a trainee's token for get, put
   and gridSet, and nobody was a trainee). Five ops at a time: at 10 s a call
   the seventy took eighty minutes one after another. */
const argsFor = (op, role) => { const a = Object.assign({}, ARGS[op] || {}); if (role === 'nobody' || role === 'volunteer') delete a.token; return a; };
const one = async (op) => {
  matrix[op] = {};
  await Promise.all(Object.entries(ROLES).map(async ([role, cred]) => {
    if (DANGER.has(op) && MAY[role]) { matrix[op][role] = '(not exercised)'; return; }
    if (SENDS_AS[op] && SENDS_AS[op][role]) { matrix[op][role] = '(not exercised: sends mail)'; return; }
    const r = await raw(Object.assign({ op }, cred, argsFor(op, role)));
    matrix[op][role] = r.ok ? 'ok' : String(r.error || 'refused').slice(0, 60);
    (replies[role] = replies[role] || {})[op] = r;
  }));
  process.stdout.write('.');
};
for (let i = 0; i < OPS.length; i += 5) await Promise.all(OPS.slice(i, i + 5).map(one));
console.log('\n' + OPS.length + ' ops x ' + Object.keys(ROLES).length + ' roles');

/* ---- 2. the secrets ----------------------------------------------------- */
const fails = [];
const check = (what, ok) => { console.log((ok ? '  ok    ' : '  FAIL  ') + what); if (!ok) fails.push(what); };
for (const role of ['nobody', 'trainee', 'volunteer', 'cross']) {
  if (!replies[role]) continue;
  for (const [op, r] of Object.entries(replies[role])) {
    if (!r.ok) continue;
    const s = JSON.stringify(r.result || {});
    for (const [what, secret] of Object.entries(SECRETS)) {
      if (role === 'volunteer' && what === 'volunteer token') continue;   // their own
      if (secret && s.includes(secret)) check(`${role}'s ${op} reply carries the ${what}`, false);
    }
  }
}
check('a trainee reads their own plan', replies.trainee.get.ok);
check('a trainee cannot read the volunteer register', !replies.trainee.course.ok || !(replies.trainee.course.result || {}).volunteers);
check('the assessor gets the register (Handbook 14.1)', !!((replies.assessor.boot.result || {}).course || {}).volunteers);
check('the volunteer gets their own row and no roster', !!(replies.volunteer.boot.result || {}).volunteer && !('roster' in (replies.volunteer.boot.result || {})));
check('the volunteer never sees the other student', !JSON.stringify(replies.volunteer.boot).includes(reg.students[1].name));
check('the assessor writes nothing', OPS.every((op) => ['ping', 'boot', 'me', 'get', 'course', 'roster', 'celta5Assets', 'audio'].includes(op) || matrix[op].assessor !== 'ok'));
check('nobody opens nothing that names a course', ['boot', 'me', 'course', 'roster', 'get', 'put', 'putCourse', 'ownerCourses', 'stats', 'inbox'].every((op) => matrix[op].nobody !== 'ok'));
if (ROLES.cross) check('another course\'s tutor key with this course\'s token opens nothing', OPS.every((op) => op === 'ping' || matrix[op].cross !== 'ok'));
check('the tutor key works', replies.tutor.roster.ok && replies.tutor.get.ok);
check('the owner key works', replies.owner.ownerCourses.ok);
const secretsClean = fails.length === 0;

/* ---- the ratchet -------------------------------------------------------- */
let changed = 0;
if (existsSync(MATRIX) && !WRITE) {
  const was = JSON.parse(readFileSync(MATRIX, 'utf8'));
  for (const op of Object.keys(matrix)) for (const role of Object.keys(matrix[op])) {
    const a = (was[op] || {})[role], b = matrix[op][role];
    if (a !== b) { changed++; console.log(`  CHANGED ${op} as ${role}: ${a === undefined ? '(new)' : JSON.stringify(a)} -> ${JSON.stringify(b)}`); }
  }
  for (const op of Object.keys(was)) if (!matrix[op]) { changed++; console.log(`  GONE ${op}`); }
  console.log(changed ? `${changed} change(s) against role-matrix.json: read them; if right, run with --write.` : 'matrix unchanged');
} else {
  writeFileSync(MATRIX, JSON.stringify(matrix, null, 1) + '\n'); console.log('matrix written to store/role-matrix.json');
}
console.log(secretsClean && !changed ? '\nEvery role behaved.' : `\n${fails.length} failure(s), ${changed} change(s)`);
process.exit(secretsClean && !changed ? 0 : 1);
