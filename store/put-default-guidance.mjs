// Put the store's default marking guidance (v94, 17 Oct 2026): what every
// course shows its tutors and assessor until it writes its own.
//
//   node store/put-default-guidance.mjs <path/to/defaults.json>
//
// The JSON is { items: { fol: { general, crit: [...], sections }, ... } }.
// It is kept OUT of this repo on purpose: the guidance is for tutors and
// assessors only, and this repo and the site are public. Never print a key.
import fs from 'node:fs';
const file = process.argv[2];
if (!file) { console.error('usage: node store/put-default-guidance.mjs <defaults.json>'); process.exit(1); }
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
if (!data.items) { console.error('no items in ' + file); process.exit(1); }
const HUB = new URL('..', import.meta.url).pathname;
const STORE = (fs.readFileSync(HUB + 'hub-store.js', 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const owner = fs.readFileSync(HUB + '.owner-key', 'utf8').trim();
for (let i = 0; i < 5; i++) {
  try {
    const r = await (await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'putDefaultGuidance', owner, data }) })).json();
    if (r.ok) { console.log('saved:', Object.keys(data.items).join(', ')); process.exit(0); }
    console.error('store said:', r.error); process.exit(1);
  } catch (e) { await new Promise(r => setTimeout(r, 8000)); }
}
console.error('the store did not answer'); process.exit(1);
