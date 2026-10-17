// One marked, returned assignment on the "week four, before the visit" demo
// (Ramy, 17 Oct 2026: "put a marked, returned example on the demo"), so the
// trainee's side of the new marking can be seen: Aiko's LSRT, sent back for
// resubmission, with margin comments on her text and notes only where a
// criterion has one. Dry run without --write; snapshot first; read back after.
//   node store/demo-returned-example.mjs [--write]
import fs from 'node:fs';
const HUB = new URL('..', import.meta.url).pathname;
const STORE = (fs.readFileSync(HUB + 'hub-store.js', 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = fs.readFileSync(HUB + '.owner-key', 'utf8').trim();
const WRITE = process.argv.includes('--write');
const post = async b => { for (let i = 0; i < 6; i++) { try { const r = await (await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) })).json(); if (r.ok) return r; if (r.error) { console.log('store said: ' + r.error); } } catch (e) {} await new Promise(r => setTimeout(r, 10000)); } throw new Error('store did not answer'); };
const list = await post({ op: 'ownerCourses', owner: OWNER });
const c = (list.result.courses || list.result).find(x => /week four, before the visit/.test(x.name));
const bootR = await post({ op: 'boot', key: c.tutorKey }); const boot = bootR.result; if (!boot) { console.log('boot answered without a course:', JSON.stringify(bootR).slice(0, 200)); process.exit(1); }
const W = boot.course.wording, S = boot.course.settings || {};
const tr = boot.roster.find(t => /^Aiko/.test(t.name));
const recs = JSON.parse(JSON.stringify((tr.records || {}).assignments || {}));
const l = recs.lsrt;
if (!l || l.stage !== 'submitted') { console.log('Aiko’s LSRT is not waiting to be marked (' + (l && l.stage) + '); nothing done.'); process.exit(0); }
const sec = lab => W.lsrt.sections.findIndex(s => s.type === 'text' && new RegExp('^' + lab).test(s.label || ''));
const tutor = String(S.tutorNames || '').split(/[,;\n]/).map(x => x.trim()).filter(Boolean)[0] || 'Jordan Blake';
const comments = [
  [sec('A\\.'), 'Length: about 400 words', 'Say how long the reading stage is, so the length can be judged against it.', 1],
  [sec('B\\.'), 'Reading for gist means reading quickly', 'A clear definition, and sourced. Good.', 0],
  [sec('C\\.'), 'True/false/not given is also an IELTS task type', 'A good link to the two students taking IELTS.', null],
  [sec('D\\.'), 'then I put three errors I heard on the board for the class to correct', 'This is feedback on language. The brief asks for feedback on whether the task was achieved: did each pair agree a time and a topic?', 1],
];
const margin = [];
for (const [i, quote, text, crit] of comments) {
  const body = (l.sub1.text || {})[i] || '';
  if (i < 0 || body.indexOf(quote) < 0) { console.log('Quote not found in section ' + i + ': ' + quote); process.exit(1); }
  margin.push({ id: 'demo' + margin.length, loc: 't' + i, quote, text, crit, by: tutor, role: 'first', at: new Date().toISOString() });
}
const day = String(S.demoToday || '').slice(0, 10) || new Date().toISOString().slice(0, 10);
Object.assign(l, {
  stage: 'resubmission_needed', round2Seeded: false, marked1At: day + 'T15:30:00.000Z',
  criteriaMarks: { sub1: [true, false, true], sub2: [] },
  criteriaComments: { sub1: ['', 'Section D: your feedback stage checks language, not whether the pairs achieved the task. Add how you find out if each pair agreed a time and a topic, and what you do if one did not.', ''], sub2: [] },
  feedback: { outcome: 'Resubmission needed', generalComment1: 'A thoughtful choice of text, and both reading tasks are well built. One thing to fix in the follow-up task: see criterion 2 and the comments on section D.', generalComment2: '' },
  markers: Object.assign({}, l.markers || {}, { first: tutor }),
  margin: { sub1: margin },
});
console.log('Aiko · LSRT · Resubmission needed · marked by ' + tutor + ' · ' + margin.length + ' margin comments');
if (!WRITE) process.exit(0);
fs.mkdirSync(HUB + '_store-snapshots', { recursive: true });
fs.writeFileSync(HUB + '_store-snapshots/assignments-' + c.id + '-aiko-' + new Date().toISOString().replace(/[:.]/g, '-') + '.json', JSON.stringify((tr.records || {}).assignments || {}));
const r = await post({ op: 'put', key: c.tutorKey, token: tr.token, kind: 'assignments', data: recs });
console.log('write: ' + (r.ok ? 'saved' : 'FAILED ' + r.error));
await new Promise(r => setTimeout(r, 8000));
const back = (await post({ op: 'boot', key: c.tutorKey })).result.roster.find(t => t.token === tr.token).records.assignments.lsrt;
console.log('read back: ' + back.stage + ', ' + ((back.margin || {}).sub1 || []).length + ' margin comments');
