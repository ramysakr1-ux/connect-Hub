import fs from 'node:fs';
import path from 'node:path';
/* Fill in the file for any track the plan does not yet have one for. Same four
   resolvers, each checked against a real filename. */
const D = '/Users/work/Library/CloudStorage/GoogleDrive-ramysakr1@gmail.com/My Drive/Course books';
const BOOK = {
  s1: { dir: `${D}/Elementary/Language Hub/Language_Hub_Elementary_Class_Audio_www.frenglish.ru`,
        find: (f, t) => f.find(x => x === `LH_Elementary_SB_Track_${t}.mp3`) },
  s2: { dir: `${D}/Pre-Intermediate /Roadmap A2+/Roadmap_A2P_SB_audio`,
        find: (f, t) => { const [u, r] = t.split('.');
          return f.find(x => x.includes(`_U${u.padStart(2,'0')}_R${r.padStart(2,'0')}.mp3`)); } },
  s3: { dir: `${D}/Upper- Intermediate /Straightforward/Audio files/05 Upper-Intermediate`,
        find: (f, t) => { const [cd, n] = t.split('.'); const nn = n.padStart(2, '0');
          return f.find(x => x === `CD ${cd}/${nn} ${nn}.wma`); } },
  s4: { dir: `${D}/Beginner/Speakout 3rd ed A1/Class_Audio`,
        find: (f, t) => { const [u, n] = t.split('.');
          return f.find(x => x.endsWith(`_Audio_${u}_${n.padStart(2,'0')}.mp3`)); } },
};
const listing = {};
for (const [id, b] of Object.entries(BOOK)) {
  const out = [];
  (function walk(p) { fs.readdirSync(p, { withFileTypes: true }).forEach(e => {
    const full = path.join(p, e.name);
    e.isDirectory() ? walk(full) : out.push(path.relative(b.dir, full)); }); })(b.dir);
  listing[id] = out;
}
const plan = JSON.parse(fs.readFileSync('tracks-plan.json', 'utf8'));
let filled = 0, miss = [];
for (const [k, rows] of Object.entries(plan)) {
  const id = k.split('|')[0];
  rows.forEach(r => {
    if (r.file) return;
    r.file = BOOK[id].find(listing[id], r.track) || null;
    if (r.file) filled++; else miss.push(`${k} ${r.track}`);
  });
}
fs.writeFileSync('tracks-plan.json', JSON.stringify(plan, null, 1));
const total = Object.values(plan).reduce((a, r) => a + r.length, 0);
console.log(`${Object.keys(plan).length} slots · ${total} tracks · ${filled} newly resolved · ${miss.length} not found`);
if (miss.length) console.log('NOT FOUND: ' + miss.join(', '));
