import fs from 'node:fs';
import { call, LIBRARY } from './st.mjs';
const KEY = LIBRARY;
/* The card parses "Track 1.26 | <drive url>", one per line, and builds a
   player per track for the trainee whose lesson it is. */
const plan = JSON.parse(fs.readFileSync('tracks-plan.json', 'utf8'));
const urls = JSON.parse(fs.readFileSync('track-urls.json', 'utf8'));
const cr = await call({ op:'course', key: KEY });
const P = ((cr.result && (cr.result.records || cr.result)) || {}).tppoints;
let slots = 0, lines = 0, missing = [];
for (const [k, rows] of Object.entries(plan)) {
  const [id, x, i] = k.split('|');
  const sl = P.set.library[id].sessions[x].slots[+i];
  const out = rows.map(r => {
    const u = urls[`${id}|${r.track}`];
    if (!u) { missing.push(`${id} ${x}·${+i+1} track ${r.track}`); return null; }
    return `Track ${r.track} | ${u}`;
  }).filter(Boolean);
  if (!out.length) continue;
  sl.tracks = out.join('\n');
  slots++; lines += out.length;
}
console.log(`${slots} slots · ${lines} track lines · record ${(JSON.stringify(P).length/1024).toFixed(0)} KB`);
if (missing.length) { console.log(`NOT UPLOADED YET: ${missing.join(', ')}`); process.exit(1); }
if (!process.argv.includes('--write')) { console.log('(dry run)'); process.exit(0); }
const w = await call({ op:'putCourse', key: KEY, kind:'tppoints', data: P });
console.log('write:', w.ok ? 'ok' : 'FAILED ' + w.error);
const back = await call({ op:'course', key: KEY });
const B = ((back.result && (back.result.records || back.result)) || {}).tppoints;
let n = 0, t = 0;
['s1','s2','s3','s4'].forEach(id => Object.values(B.set.library[id].sessions).forEach(s => s.slots.forEach(sl => {
  if (sl.tracks) { n++; t += String(sl.tracks).split('\n').filter(Boolean).length; } })));
console.log(`read back: ${n} slots carry audio · ${t} tracks`);
