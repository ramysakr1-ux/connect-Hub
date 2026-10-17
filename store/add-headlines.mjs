// Headlines for the parts of each answer (18 Oct 2026, Ramy: "give headlines
// to each part of the assignment, for the trainees to write under"). Adds
// `heads` to the text sections of courses that already have their own wording
// (the demos), matching each section by its label against the defaults. Only
// adds: no section moves, no text changes, so marks and submissions are safe.
// Dry run without --write; snapshot first; read back after.
//   node store/add-headlines.mjs "Demo" [--write]
import fs from 'node:fs'; import vm from 'node:vm';
const HUB = new URL('..', import.meta.url).pathname;
const STORE = (fs.readFileSync(HUB + 'hub-store.js', 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = fs.readFileSync(HUB + '.owner-key', 'utf8').trim();
const WRITE = process.argv.includes('--write');
const NAMES = process.argv.slice(2).filter(a => !a.startsWith('--'));
const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(fs.readFileSync(HUB + 'assignment-defaults.js', 'utf8'), ctx);
const D = ctx.window.CONNECT_HUB_DEFAULT_WORDING;
const norm = l => String(l).replace(/\s+/g, ' ').trim();
const post = async b => { for (let i = 0; i < 8; i++) { try { const r = await (await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) })).json(); if (r.ok && r.result) return r; } catch (e) {} await new Promise(r => setTimeout(r, 12000)); } throw new Error('store did not answer'); };
const list = await post({ op: 'ownerCourses', owner: OWNER });
for (const c of (list.result.courses || list.result).filter(c => NAMES.some(n => String(c.name).includes(n)))) {
  const w = (await post({ op: 'boot', key: c.tutorKey })).result.course.wording;
  if (!w || !w.fol) { console.log(c.name + ': no wording read'); continue; }
  const before = JSON.stringify(w); let n = 0;
  for (const k of ['fol', 'lsrt', 'lfc']) (w[k] || { sections: [] }).sections.forEach(s => {
    const d = D[k].sections.find(x => norm(x.label) === norm(s.label));
    if (d && d.heads && !s.heads) { s.heads = d.heads; n++; }
  });
  console.log(c.name + ': ' + n + ' sections get headlines');
  if (!WRITE || !n) continue;
  fs.mkdirSync(HUB + '_store-snapshots', { recursive: true });
  fs.writeFileSync(HUB + '_store-snapshots/wording-' + c.id + '-pre-headlines-' + new Date().toISOString().replace(/[:.]/g, '-') + '.json', before);
  const r = await post({ op: 'putCourse', key: c.tutorKey, kind: 'wording', data: w });
  console.log('  write: ' + (r.ok ? 'saved' : 'FAILED'));
  await new Promise(r => setTimeout(r, 9000));
  const back = (await post({ op: 'boot', key: c.tutorKey })).result.course.wording;
  console.log('  read back: ' + (JSON.stringify(back) === JSON.stringify(w) ? 'matches' : 'DIFFERS'));
  await new Promise(r => setTimeout(r, 9000));
}
