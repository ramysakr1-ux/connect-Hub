// Give each assignment on a course its hidden word (17 Oct 2026). Ramy: "one
// word per assignment, and all different sections. And this word will be
// disclosed in the guidelines for each assignment." The word is wording[k].trap;
// the pages hide it in every section (hubTrapSpan) and the marking page looks
// for it. An assignment that already has a word keeps it. Every word differs
// from every other on the courses named, and from anything in the brief itself.
// Dry run without --write; snapshot first; read back after.
//   node store/set-trap-words.mjs "Demo" [--write]
import fs from 'node:fs'; import vm from 'node:vm';
const HUB = new URL('..', import.meta.url).pathname;
const STORE = (fs.readFileSync(HUB + 'hub-store.js', 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = fs.readFileSync(HUB + '.owner-key', 'utf8').trim();
const WRITE = process.argv.includes('--write');
const NAMES = process.argv.slice(2).filter(a => !a.startsWith('--'));
const ctx = { window: { crypto: globalThis.crypto }, crypto: globalThis.crypto, document: { getElementById: () => true, head: null } };
vm.createContext(ctx);
const src = fs.readFileSync(HUB + 'hub-shared.js', 'utf8');
vm.runInContext(src.slice(src.indexOf('window.HUB_TRAP_WORDS')), ctx);
const WORDS = ctx.window.HUB_TRAP_WORDS;
const post = async b => { for (let i = 0; i < 6; i++) { try { return await (await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) })).json(); } catch (e) { await new Promise(r => setTimeout(r, 8000)); } } throw new Error('store did not answer'); };
const list = await post({ op: 'ownerCourses', owner: OWNER });
const courses = (list.result.courses || list.result).filter(c => NAMES.some(n => String(c.name).includes(n)));
const used = new Set();
for (const c of courses) {
  const boot = await post({ op: 'boot', key: c.tutorKey });
  const w = boot.ok && boot.result.course.wording;
  if (!w || !w.fol) { console.log(c.name + ': no wording read, skipped'); continue; }
  Object.values(w).forEach(a => a && a.trap && used.add(a.trap));
  const before = JSON.stringify(w), all = before.toUpperCase(), set = [];
  for (const k of ['fol', 'lrt', 'lsrt', 'lfc']) {
    if (!w[k] || w[k].trap) { if (w[k]) set.push(k + ' keeps ' + w[k].trap); continue; }
    const free = WORDS.filter(x => !used.has(x) && !all.includes(x));
    const pick = free[crypto.getRandomValues(new Uint32Array(1))[0] % free.length];
    w[k].trap = pick; used.add(pick); set.push(k + ' ' + pick);
  }
  console.log(c.name + ': ' + set.join(' · '));
  if (!WRITE || JSON.stringify(w) === before) continue;
  fs.mkdirSync(HUB + '_store-snapshots', { recursive: true });
  fs.writeFileSync(HUB + '_store-snapshots/wording-' + c.id + '-' + new Date().toISOString().replace(/[:.]/g, '-') + '.json', before);
  const r = await post({ op: 'putCourse', key: c.tutorKey, kind: 'wording', data: w });
  if (!r.ok) { console.log('  write FAILED: ' + r.error); continue; }
  await new Promise(r => setTimeout(r, 4000));
  await new Promise(r => setTimeout(r, 8000));
  const bb = await post({ op: 'boot', key: c.tutorKey }); const back = bb.ok && bb.result.course.wording;
  console.log('  read back: ' + (JSON.stringify(back) === JSON.stringify(w) ? 'matches' : 'DIFFERS'));
  await new Promise(r => setTimeout(r, 6000));
}
