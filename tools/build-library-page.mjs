import fs from 'node:fs';
import path from 'node:path';
/* THE PAGE A CENTRE IS SENT TO CHOOSE FROM. Ramy, 4 Oct 2026: "maybe we have
   our own library, and with the card we send them a link ... they choose
   according to the levels that they have."

   It is a chooser, not the content. Level, book and edition, how much is
   written, the mix of lesson types, and what travels with the set -- pages,
   recordings. It does NOT print the stages: those are what a centre is buying,
   and a link that can be forwarded should not hand them over. */
const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const LIB = JSON.parse(fs.readFileSync(path.join(ROOT, 'library', 'tp-point-sets.json'), 'utf8'));
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
const ORDER = ['s4', 's1', 's2', 's3'];                   // by level, lowest first
const rank = id => { const l = (LIB[id].level || '').toLowerCase();
  return l.includes('beginner') ? 1 : l.includes('elementary') ? 2 : l.includes('pre') ? 3 : l.includes('upper') ? 5 : 4; };

function stats(S) {
  const slots = [];
  Object.keys(S.sessions || {}).forEach(k => (S.sessions[k].slots || []).forEach(sl => slots.push(sl)));
  const types = {};
  slots.forEach(sl => { const t = sl.type || '—'; types[t] = (types[t] || 0) + 1; });
  return {
    slots: slots.length,
    stages: slots.reduce((a, sl) => a + (sl.stages || []).length, 0),
    scans: slots.reduce((a, sl) => a + (sl.files || []).length, 0),
    tracks: slots.reduce((a, sl) => a + String(sl.tracks || '').split('\n').filter(Boolean).length, 0),
    days: Object.values(S.sessions || {}).filter(x => x.dayPdf && x.dayPdf.url).length,
    types: Object.entries(types).sort((a, b) => b[1] - a[1]),
  };
}
const ids = Object.keys(LIB).sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
const cards = ids.map(id => {
  const S = LIB[id], t = stats(S);
  return `<article class="setcard">
    <p class="lvl">${esc(S.level || '')}</p>
    <h3>${esc((S.book || '').split(',')[0])}</h3>
    <p class="bk">${esc(((S.book || '').split(',').slice(1).join(',') || '').trim())}</p>
    <p class="ct">${t.slots} lessons · ${t.stages} staged · every one 45 minutes</p>
    <div class="mix">${t.types.map(([k, n]) => `<span class="chip"><b>${n}</b> ${esc(k)}</span>`).join('')}</div>
    <div class="travels">
      <span class="tv"><b>${t.scans}</b> pages</span>
      <span class="tv"><b>${t.tracks}</b> recordings</span>
      <span class="tv"><b>${t.days}</b> printable days</span>
    </div>
    <p class="own">The pages each lesson needs travel with it, so a candidate can teach without a copy of the book.</p>
  </article>`;
}).join('\n');

const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>TP points library</title>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:wght@600;700&family=Karla:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../hub-tokens.css">
<style>
  body{margin:0; background:var(--sand); color:var(--ink);
    font:400 15px/1.6 'Karla',system-ui,sans-serif; -webkit-font-smoothing:antialiased;}
  .wrap{max-width:1180px; margin:0 auto; padding:26px 16px 70px;}
  .eyebrow{font-size:.68rem; letter-spacing:.12em; text-transform:uppercase; color:var(--grey); margin:0 0 7px; font-weight:700;}
  h1{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.95rem; margin:0 0 4px; letter-spacing:-.01em;}
  .lede{margin:0 0 6px; color:var(--ink); max-width:64ch;}
  .note{margin:0 0 24px; color:var(--grey); max-width:64ch; font-size:.92rem;}
  .cards{display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:16px;}
  .setcard{background:var(--surface); border:1px solid var(--sand-line); border-bottom-width:3px;
    border-radius:var(--r-card); padding:16px 17px 15px;}
  .setcard .lvl{font-size:.66rem; letter-spacing:.1em; text-transform:uppercase; color:var(--gold-deep); font-weight:700; margin:0 0 4px;}
  .setcard h3{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.2rem; margin:0 0 2px;}
  .setcard .bk{margin:0; font-size:.82rem; color:var(--grey);}
  .setcard .ct{margin:3px 0 11px; font-size:.76rem; color:var(--faint); font-variant-numeric:tabular-nums;}
  .mix{display:flex; flex-wrap:wrap; gap:5px; margin:0 0 13px;}
  .chip{font-size:.7rem; background:var(--paper); border:1px solid var(--row-line);
    border-radius:999px; padding:3px 9px; color:var(--grey);}
  .chip b{color:var(--ink); font-variant-numeric:tabular-nums;}
  .travels{display:flex; flex-wrap:wrap; gap:14px; padding-top:11px; border-top:1px solid var(--sand-line);}
  .tv{font-size:.78rem; color:var(--grey); font-variant-numeric:tabular-nums;}
  .tv b{color:var(--teal); font-size:.92rem;}
  .own{font-size:.76rem; color:var(--faint); margin:11px 0 0;}
  .foot{max-width:64ch; margin:30px 0 0; font-size:.9rem; color:var(--grey);}
</style></head>
<body><div class="wrap">
  <p class="eyebrow">Connect Lite</p>
  <h1>TP points library</h1>
  <p class="lede">Teaching practice written against a real coursebook — twelve teaching days, three lessons a day, each one staged and timed to 45 minutes.</p>
  <p class="note">Tell us which levels your course runs and we put those sets on it. You take the ones you teach; nothing else goes on your course.</p>
  <div class="cards">
${cards}
  </div>
  <p class="foot">Every lesson arrives with the pages it teaches from, the recordings it plays, and the day's pages as one PDF to print. Your candidates get their own lesson on their own card, with the other two at the foot of the day to sit in on.</p>
</div></body></html>`;
const out = path.join(ROOT, 'library', 'index.html');
fs.writeFileSync(out, html);
/* A STANDALONE COPY. The site page links ../hub-tokens.css, which only
   resolves on lite.celtaconnect.com; anywhere else -- a preview panel, a file
   someone is sent -- that 404s and the page arrives unstyled. The second copy
   carries the tokens inside it and depends on nothing. */
const tokens = fs.readFileSync(path.join(ROOT, 'hub-tokens.css'), 'utf8');
fs.writeFileSync(path.join(ROOT, 'library', 'standalone.html'),
  html.replace('<link rel="stylesheet" href="../hub-tokens.css">', '<style>\n' + tokens + '\n</style>'));
console.log(`library/index.html — ${ids.length} sets, ${Math.round(html.length / 1024)} KB`);
ids.forEach(id => { const t = stats(LIB[id]); console.log(`  ${LIB[id].level.padEnd(22)} ${(LIB[id].book||'').split(',')[0].padEnd(34)} ${t.scans} pages · ${t.tracks} tracks · ${t.days} days`); });
