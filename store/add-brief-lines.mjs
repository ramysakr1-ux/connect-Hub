// Add the three Cambridge lines (17 Oct 2026) to courses that already have
// their own wording. Ramy: "add the three lines to C/18 and the demos".
//   1. FoL D and E: one source or support the learners can use on their own
//      (syllabus 2.1, "sources for language and/or skills development and,
//      where appropriate, personal support systems").
//   2. LFC A: a peer comment, or something the students said or showed
//      (2.4 criterion a, "feedback from learners, teachers and teacher educators").
//   3. LRT and LSRT Before you start: not the basis of an assessed TP lesson
//      (Handbook 9.2.1).
// Text is only ADDED to section bodies; no section moves, so submissions and
// marks (keyed by section and criterion index) are untouched. A line already
// there is skipped. Dry run without --write; a snapshot of each course's
// wording goes to _store-snapshots/ before anything is written.
//   node store/add-brief-lines.mjs "C/18" "Demo" [--write]
import fs from 'node:fs';
const HUB = new URL('..', import.meta.url).pathname;
const STORE = (fs.readFileSync(HUB + 'hub-store.js', 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = fs.readFileSync(HUB + '.owner-key', 'utf8').trim();
const WRITE = process.argv.includes('--write');
const NAMES = process.argv.slice(2).filter(a => !a.startsWith('--'));
const post = async b => { for (let i = 0; i < 6; i++) { try { const r = await (await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) })).json(); return r; } catch (e) { await new Promise(r => setTimeout(r, 8000)); } } throw new Error('store did not answer'); };

const FOL_D = '• Suggest one source the learners could use on their own to keep working on this grammar — a book, a website or an app — or someone who could support them, and say why it suits them.';
const FOL_E = '• Suggest one source or support for working on this sound on their own, as in D.';
const LRT_TP = "Don't use this analysis as the basis of an assessed TP lesson.";
const LSRT_TP = "Don't use this text or these tasks as the basis of an assessed TP lesson.";
const lab = s => String(s.label || '').trim();
const addSentence = (body, sentence) => {
  if (/assessed TP lesson/i.test(body)) return null;
  const at = body.search(/Passing on first or second submission/);
  return at >= 0 ? body.slice(0, at) + sentence + ' ' + body.slice(at) : body.replace(/\s*$/, '') + ' ' + sentence;
};
function patch(w) {
  const done = [], miss = [];
  const sec = (k, test) => ((w[k] || {}).sections || []).find(s => s.type === 'text' && test(lab(s)));
  const edit = (name, k, test, fn) => { const s = sec(k, test); if (!s) { miss.push(name + ' (no such section)'); return; } const nb = fn(String(s.body || '')); if (nb == null) { done.push(name + ': already there'); return; } s.body = nb; done.push(name); };
  edit('FoL D', 'fol', l => /^D\b/.test(l), b => /on their own/i.test(b) ? null : b.replace(/\s*$/, '') + '\n' + FOL_D);
  edit('FoL E', 'fol', l => /^E\b/.test(l), b => /on their own/i.test(b) ? null : b.replace(/\s*$/, '') + '\n' + FOL_E);
  edit('LFC A', 'lfc', l => /^A\b/.test(l), b => /students said or showed/i.test(b) ? null : (/Add a peer comment too if you can\./.test(b) ? b.replace('Add a peer comment too if you can.', 'Add a peer comment, or something your students said or showed, if you can.') : b.replace(/(\n\s*Strength 1)/, '\n• Add a peer comment, or something your students said or showed, if you can.$1')));
  edit('LRT intro', 'lrt', l => /^before you start$/i.test(l), b => addSentence(b, LRT_TP));
  edit('LSRT intro', 'lsrt', l => /^before you start$/i.test(l), b => addSentence(b, LSRT_TP));
  return { done, miss };
}
const list = await post({ op: 'ownerCourses', owner: OWNER });
const courses = (list.result.courses || list.result).filter(c => NAMES.some(n => String(c.name).includes(n)));
for (const c of courses) {
  const boot = await post({ op: 'boot', key: c.tutorKey });
  const w = boot.ok && boot.result.course.wording;
  if (!w || !w.fol) { console.log(c.name + ': no wording read, skipped'); continue; }
  const before = JSON.stringify(w);
  const { done, miss } = patch(w);
  console.log(c.name + ': ' + done.join(' · ') + (miss.length ? ' | MISSING ' + miss.join(', ') : ''));
  if (!WRITE || JSON.stringify(w) === before) continue;
  fs.mkdirSync(HUB + '_store-snapshots', { recursive: true });
  fs.writeFileSync(HUB + '_store-snapshots/wording-' + c.id + '-' + new Date().toISOString().replace(/[:.]/g, '-') + '.json', before);
  const r = await post({ op: 'putCourse', key: c.tutorKey, kind: 'wording', data: w });
  if (!r.ok) { console.log('  write FAILED: ' + r.error); continue; }
  await new Promise(r => setTimeout(r, 4000));
  const back = await post({ op: 'boot', key: c.tutorKey });
  const bw = back.result.course.wording;
  console.log('  read back: ' + (JSON.stringify(bw) === JSON.stringify(w) ? 'matches' : 'DIFFERS'));
  await new Promise(r => setTimeout(r, 6000));
}
