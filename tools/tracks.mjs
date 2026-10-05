import fs from 'node:fs';
import path from 'node:path';
import { call, LIBRARY } from './st.mjs';
/* WHICH RECORDING EACH SLOT PLAYS, AND WHERE THAT FILE IS. Thirty-two slots
   tell a candidate to play a track and none of them carries it. Every book
   numbers its audio differently, so each gets its own resolver -- and each was
   checked against a real filename before being written down:
     Language Hub   track 3.5   -> LH_Elementary_SB_Track_3.5.mp3
     Roadmap        track 2.2   -> "RM_A2 PL_SB_U02_R02.mp3"
     Speakout       track 1.01  -> ..._Audio_1_01.mp3
     Straightforward tapescript 1.26 -> "Audio files/.../CD 1/26 26.wma"  (CD.track)
   Straightforward is the odd one: 73 .wma files, which no browser plays, so
   they are transcoded to mp3 with VLC on the way through. */
const D = '/Users/work/Library/CloudStorage/GoogleDrive-ramysakr1@gmail.com/My Drive/Course books';
const BOOK = {
  s1: { dir: `${D}/Elementary/Language Hub/Language_Hub_Elementary_Class_Audio_www.frenglish.ru`,
        find: (files, t) => files.find(f => f === `LH_Elementary_SB_Track_${t}.mp3`) },
  s2: { dir: `${D}/Pre-Intermediate /Roadmap A2+/Roadmap_A2P_SB_audio`,
        find: (files, t) => { const [u, r] = t.split('.');
          return files.find(f => f.includes(`_U${u.padStart(2,'0')}_R${r.padStart(2,'0')}.mp3`)); } },
  s3: { dir: `${D}/Upper- Intermediate /Straightforward/Audio files/05 Upper-Intermediate`,
        find: (files, t) => { const [cd, n] = t.split('.'); const nn = n.padStart(2, '0');
          return files.find(f => f === `CD ${cd}/${nn} ${nn}.wma`); } },
  s4: { dir: `${D}/Beginner/Speakout 3rd ed A1/Class_Audio`,
        find: (files, t) => { const [u, n] = t.split('.');
          return files.find(f => f.endsWith(`_Audio_${u}_${n.padStart(2,'0')}.mp3`)); } },
  /* Set five numbers its audio the same way as set four, and also carries the
     review tracks the unit-end pages play -- "R4.01" is Review 4's first, and
     its file is ..._Audio_R4_01.mp3, so the unit part is taken as written.
     THESE FILES ARE NOT IN Course books YET: they came out of the download and
     want moving to Course books/Intermediate/Speakout 3rd ed B1 with the PDFs. */
  s5: { dir: '/private/tmp/claude-502/-Users-work-CELTA-connect-code-prompt/023670ec-6b2e-479a-b3aa-d7920070f574/scratchpad/b1audio',
        find: (files, t) => { const [u, n] = t.split('.');
          return files.find(f => f.endsWith(`_Audio_${u}_${n.padStart(2,'0')}.mp3`)); } },
};
const listing = {};
for (const [id, b] of Object.entries(BOOK)) {
  const out = [];
  const walk = p => fs.readdirSync(p, { withFileTypes: true }).forEach(e => {
    const full = path.join(p, e.name);
    if (e.isDirectory()) walk(full);
    else out.push(path.relative(b.dir, full));
  });
  walk(b.dir);
  listing[id] = out;
}
/* a track reference, in any of the five books' wordings. The R is Speakout's
   review audio -- "track R4.01" -- and without it the two recordings the unit
   review plays were silently not looked for. */
const TRACK = /(?:track|tapescript|audio)\s*(R?\d{1,2}\.\d{1,2})|(?:^|\s)(R?\d{1,2}\.\d{2})(?=\s|$|[,.)])/g;
const r = await call({ op:'course', key:LIBRARY });
const L = (((r.result && (r.result.records || r.result)) || {}).tppoints || {}).set.library;
const plan = JSON.parse(fs.existsSync("tracks-plan.json") ? fs.readFileSync("tracks-plan.json","utf8") : "{}");
let want = 0, got = 0, miss = [];
for (const id of Object.keys(BOOK)) {
  console.log(`===== ${id}  ${L[id].book.split(',')[0]}`);
  Object.keys(L[id].sessions).sort().forEach(x => L[id].sessions[x].slots.forEach((sl, i) => {
    const blob = [sl.pages, ...(sl.stages || []).map(s => `${s.todo || ''} ${s.avoid || ''}`)].join(' \n ');
    const ts = new Set();
    let m; TRACK.lastIndex = 0;
    while ((m = TRACK.exec(blob))) ts.add(m[1] || m[2]);
    if (!ts.size) return;
    const rows = [...ts].sort().map(t => {
      want++;
      const f = BOOK[id].find(listing[id], t);
      if (f) got++; else miss.push(`${id} ${x}·${i+1} track ${t}`);
      return { track: t, file: f || null };
    });
    plan[`${id}|${x}|${i}`] = rows;
    console.log(`  ${x}·${i+1} [${sl.type.padEnd(19)}] ${rows.map(v => v.track + (v.file ? '' : ' ✗')).join(', ')}`);
  }));
}
fs.writeFileSync('tracks-plan.json', JSON.stringify(plan, null, 1));
console.log(`\n${Object.keys(plan).length} slots · ${want} track references · ${got} resolved to a file · ${want - got} not found`);
if (miss.length) console.log('NOT FOUND: ' + miss.join(', '));
