// Fill the centre book from Cambridge's public list, without pasting.
//
//   node store/seed-centres.mjs            what the book holds, and what would be added
//   node store/seed-centres.mjs --write    append the missing centres
//
// Store v74 (7 Oct 2026). The book normally learns one centre at a time, as
// courses are made; this starts it full from store/centres-seed.tsv, the 479
// centres read off CELTATrainers.com on 6 Oct 2026 (TR073 added from Ramy's
// own CELTA 5s, since the site's list skips it). The store's `centresSeed` op
// never touches a number already in the book, so running this twice, or
// after Ramy has corrected a name on the console, changes nothing he typed.
//
// Owner only. The key is read from .owner-key at the repo root (gitignored)
// the way every other owner tool reads it; nothing here carries one.
import { readFileSync } from 'node:fs';
import { call, owner } from '../tools/st.mjs';

const HERE = new URL('.', import.meta.url).pathname;
const WRITE = process.argv.includes('--write');

const rows = readFileSync(HERE + 'centres-seed.tsv', 'utf8').split(/\r?\n/)
  .map(l => l.split('\t'))
  .filter((r, i) => i > 0 && r[0] && r[1])
  .map(r => [r[0].trim().toUpperCase(), r[1].trim()]);

const before = await call({ op: 'centres', owner: owner() });
if (!before.ok) throw new Error('could not read the book: ' + before.error);
const book = before.result.centres || {};
const missing = rows.filter(r => !book[r[0]]);
console.log(`book holds ${Object.keys(book).length}; the file has ${rows.length}; ${missing.length} to add`);
if (!WRITE || !missing.length) { if (!WRITE) console.log('dry run: pass --write to add them'); process.exit(0); }

// A single batch is one setValues call on the store side; 479 rows is well
// under the op's 1000-row cap, so this is normally one round trip.
let added = 0;
for (let i = 0; i < missing.length; i += 500) {
  const r = await call({ op: 'centresSeed', owner: owner(), rows: missing.slice(i, i + 500) });
  if (!r.ok) throw new Error('seed refused: ' + r.error);
  added += r.result.added;
}
const after = await call({ op: 'centres', owner: owner() });
const n = Object.keys((after.result || {}).centres || {}).length;
console.log(`added ${added}; the book now holds ${n}; TR073 = ${((after.result || {}).centres || {}).TR073 || '(missing)'}`);
