// Mint a new owner key and put the old one out of use.
//
//   node store/rotate-owner-key.mjs             what it would do (read only)
//   node store/rotate-owner-key.mjs --rotate
//
// WHY. Every course key can be rotated; the owner key could not, and it is the
// one that ends up in addresses while working -- the film's console shot takes
// it as &o=, so it reaches URLs, browser history and transcripts. See
// store/2026-09-27-rotate-the-owner-key.md for the store-side patch this
// needs; without it the call comes back "unknown op" and nothing changes.
//
// It rewrites .owner-key, which is gitignored and is the only copy on this
// machine. It will not write a key it cannot then use: the new key has to list
// the courses before the file is touched.
//
// If anything goes wrong, run ownerKey() in the Apps Script editor. It READS
// the property and only mints when there is none, so it hands back whatever
// the current key is. There is no lockout.
import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const HERE = new URL('..', import.meta.url).pathname;
const KEYFILE = join(HERE, '.owner-key');
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const CURRENT = readFileSync(KEYFILE, 'utf8').trim();
const GO = process.argv.includes('--rotate');

const once = async (b) => {
  const r = await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) });
  const t = await r.text();
  try { return JSON.parse(t); } catch { return { ok: false, transient: true, error: 'non-JSON' }; }
};
const call = async (b) => {
  for (let i = 0; i < 5; i++) { const r = await once(b); if (r.ok || !r.transient) return r; await new Promise((x) => setTimeout(x, 3000 * (i + 1))); }
  return { ok: false, error: 'gave up' };
};

const before = await call({ op: 'ownerCourses', owner: CURRENT });
if (!before.ok) { console.error('The key in .owner-key does not work: ' + before.error); process.exit(1); }
const n = (before.result.courses || before.result).length;
console.log(`The current key opens ${n} courses.`);

if (!GO) {
  console.log('\nRead only. Add --rotate to mint a new one.');
  console.log('Everything holding the old key stops working the moment it is rotated:');
  console.log('  · any bookmark of 14_owner.html');
  console.log('  · the film’s &o= on any address you have saved');
  console.log('  · every store script in this folder (they all read .owner-key, so they follow automatically)\n');
  process.exit(0);
}

const r = await call({ op: 'rotateOwnerKey', owner: CURRENT });
if (!r.ok) {
  console.error('rotateOwnerKey was refused: ' + r.error);
  console.error('If it says the op is unknown, the store has not been patched yet — see');
  console.error('store/2026-09-27-rotate-the-owner-key.md. Nothing has changed.');
  process.exit(1);
}
const fresh = (r.result && r.result.key) || '';
if (!/^[0-9a-f]{16,}$/i.test(fresh)) { console.error('The store did not return a key. Nothing written.'); process.exit(1); }

/* Prove the new key works BEFORE the only copy of the old one is overwritten. */
const after = await call({ op: 'ownerCourses', owner: fresh });
if (!after.ok) {
  console.error('The new key does not open the store: ' + after.error);
  console.error('NOTHING HAS BEEN WRITTEN to .owner-key. Run ownerKey() in the Apps Script editor to read the current key.');
  process.exit(1);
}
const m = (after.result.courses || after.result).length;
if (m !== n) console.error(`WARNING: ${n} courses before, ${m} after.`);

if (existsSync(KEYFILE)) copyFileSync(KEYFILE, KEYFILE + '.previous');
writeFileSync(KEYFILE, fresh + '\n', 'utf8');
const back = readFileSync(KEYFILE, 'utf8').trim();
if (back !== fresh) { console.error('.owner-key did not save. The new key is live and this file is wrong — fix it before anything else.'); process.exit(1); }

console.log(`\nRotated. ${m} courses, same as before.`);
console.log('.owner-key updated; the old one is in .owner-key.previous (also gitignored).');
console.log('\nYour console, on the new key:');
console.log('  ' + ((r.result && r.result.link) || ('https://lite.celtaconnect.com/14_owner.html?o=' + fresh)));
console.log('\nEvery bookmark and saved address on the old key is now dead. Delete them.\n');
