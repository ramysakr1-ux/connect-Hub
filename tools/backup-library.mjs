/* THE LIBRARY, ON DISK, WITH ITS LINKS.
 *
 * The store already keeps a nightly copy of the whole spreadsheet (30 of them,
 * `nightlyBackup`), and that is the real safety net. This is for the two
 * things it does not cover.
 *
 * ONE: the gap inside a day. The library was overwritten at about half past
 * one on 5 Oct 2026 by a test page that still held its key, and the nightly
 * copy was from half past midnight. Restoring from it would have cost
 * whatever had happened in between. A snapshot takes four seconds, so take one
 * before touching the library and the gap closes.
 *
 * TWO: getting one record back out. A nightly backup is a copy of the whole
 * spreadsheet: to recover the library from it you open a sheet, find the rows
 * for that course, reassemble JSON that has been chunked across cells, and
 * hope. This writes exactly what `putCourse` wants, so putting it back is one
 * command -- which is not a thing to be working out while something is broken.
 *
 *   node tools/backup-library.mjs              take one
 *   node tools/backup-library.mjs --list       what is kept
 *   node tools/backup-library.mjs --restore <file>   put one back
 *
 * Snapshots live in _library-backups/, which is gitignored: the file carries
 * every Drive link in the library and the repository is public.
 */
import fs from 'node:fs';
import path from 'node:path';
import { call, readCourse, LIBRARY, FILE } from './st.mjs';

if (FILE) {
  console.error('LIBRARY_FILE is set, so this would back up a file rather than the library.');
  process.exit(1);
}

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const DIR = path.join(ROOT, '_library-backups');
const KEEP = 40;

const count = lib => {
  let sets = 0, slots = 0, stages = 0, files = 0, tracks = 0, days = 0;
  for (const id of Object.keys(lib)) {
    sets++;
    for (const ses of Object.values(lib[id].sessions || {})) {
      if (ses.dayPdf) days++;
      for (const sl of ses.slots || []) {
        if (sl.type || sl.aim) slots++;
        stages += (sl.stages || []).length;
        files += (sl.files || []).length;
        tracks += String(sl.tracks || '').split('\n').filter(x => x.trim()).length;
      }
    }
  }
  return { sets, slots, stages, files, tracks, days };
};
const say = c => `${c.sets} sets · ${c.slots} slots · ${c.stages} stages · ` +
  `${c.files} pages · ${c.tracks} recordings · ${c.days} day PDFs`;

/* The stamp sorts: one a minute is plenty, and two in the same minute is the
   same library anyway. */
const stamp = () => new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16);

async function take() {
  const { rec } = await readCourse(LIBRARY);
  const lib = (rec.set || {}).library || {};
  if (!Object.keys(lib).length) {
    console.error('The library course has no sets in it. NOT writing a snapshot over the good ones.');
    process.exit(1);
  }
  const c = count(lib);
  fs.mkdirSync(DIR, { recursive: true });
  const out = path.join(DIR, `library-${stamp()}.json`);
  /* the WHOLE record, not just the library, so a restore puts back what was
     there -- groups, released and the rest included */
  fs.writeFileSync(out, JSON.stringify(rec, null, 1));
  console.log(`${path.basename(out)} — ${say(c)} — ${(fs.statSync(out).size / 1024) | 0} KB`);
  prune();
}

function kept() {
  if (!fs.existsSync(DIR)) return [];
  return fs.readdirSync(DIR).filter(f => /^library-.*\.json$/.test(f)).sort().reverse();
}

function prune() {
  const old = kept().slice(KEEP);
  old.forEach(f => fs.unlinkSync(path.join(DIR, f)));
  if (old.length) console.log(`dropped ${old.length} older than the last ${KEEP}`);
}

function list() {
  const all = kept();
  if (!all.length) { console.log('No snapshots yet.'); return; }
  all.forEach(f => {
    const rec = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
    console.log(`  ${f.padEnd(34)} ${say(count((rec.set || {}).library || {}))}`);
  });
}

async function restore(file) {
  const p = path.isAbsolute(file) ? file : path.join(DIR, file);
  if (!fs.existsSync(p)) { console.error(`No such snapshot: ${p}`); process.exit(1); }
  const rec = JSON.parse(fs.readFileSync(p, 'utf8'));
  const want = count((rec.set || {}).library || {});
  if (!want.sets) { console.error('That snapshot has no sets in it.'); process.exit(1); }

  /* ALWAYS take one first. Whatever is on the store is some state of the
     library, and a restore is exactly when somebody discovers they wanted it. */
  console.log('first, a snapshot of what is there now:');
  await take();

  console.log(`\nrestoring ${path.basename(p)} — ${say(want)}`);
  process.env.LIBRARY_NO_SNAPSHOT = '1';      // the one above is the snapshot
  const w = await call({ op: 'putCourse', key: LIBRARY, kind: 'tppoints', data: rec });
  if (!w.ok) { console.error('the write was refused:', w.error); process.exit(1); }

  const back = count(((await readCourse(LIBRARY)).rec.set || {}).library || {});
  console.log(`read back    — ${say(back)}`);
  const same = JSON.stringify(back) === JSON.stringify(want);
  console.log(same ? 'RESTORED — the store matches the snapshot' : 'MISMATCH — do not walk away from this');
  process.exit(same ? 0 : 1);
}

const arg = process.argv[2];
if (arg === '--list') list();
else if (arg === '--restore') await restore(process.argv[3] || '');
else if (arg) { console.error('take one, --list, or --restore <file>'); process.exit(1); }
else await take();
