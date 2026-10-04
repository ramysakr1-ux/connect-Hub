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
  return `<article class="set">
    <p class="lvl">${esc(S.level || '')}</p>
    <h2>${esc(S.book || S.name || '')}</h2>
    <p class="counts"><b>${t.slots}</b> lessons · <b>${t.stages}</b> staged · every one 45 minutes</p>
    <ul class="travels">
      <li><b>${t.scans}</b> book pages, scanned and on the card</li>
      <li><b>${t.tracks}</b> recordings, playing in the page</li>
      <li><b>${t.days}</b> teaching days as a printable PDF</li>
    </ul>
    <p class="mixlab">What your candidates teach</p>
    <ul class="mix">${t.types.map(([k, n]) => `<li><b>${n}</b> ${esc(k)}</li>`).join('')}</ul>
    <p class="own">You teach from <b>${esc(S.book || '')}</b>. The pages each lesson needs travel with the TP point, so a candidate can teach without a copy — your class still needs the book for the rest of the course.</p>
  </article>`;
}).join('\n');

const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>TP points library</title>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:wght@600;700&family=Karla:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../hub-tokens.css">
<style>
  body{background:var(--paper); color:var(--ink); font-family:'Karla',sans-serif; margin:0; padding:34px 20px 70px; line-height:1.55;}
  .wrap{max-width:1000px; margin:0 auto;}
  .eyebrow{font-size:0.7rem; letter-spacing:0.12em; text-transform:uppercase; color:var(--grey); margin:0 0 6px;}
  h1{font-family:'Newsreader',Georgia,serif; font-size:2.1rem; margin:0 0 10px;}
  .lede{max-width:62ch; color:var(--ink); margin:0 0 8px;}
  .note{max-width:62ch; color:var(--grey); font-size:0.9rem; margin:0 0 30px;}
  .sets{display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:18px;}
  .set{background:var(--surface); border:1px solid var(--sand-line); border-left:4px solid var(--gold); border-radius:11px; padding:18px 20px;}
  .lvl{font-size:0.68rem; letter-spacing:0.1em; text-transform:uppercase; color:var(--gold-deep); font-weight:700; margin:0 0 3px;}
  .set h2{font-family:'Newsreader',Georgia,serif; font-size:1.2rem; margin:0 0 9px; line-height:1.25;}
  .counts{font-size:0.86rem; margin:0 0 12px; color:var(--ink);}
  ul{list-style:none; margin:0 0 13px; padding:0;}
  .travels li{font-size:0.86rem; padding:3px 0 3px 17px; position:relative;}
  .travels li::before{content:"·"; position:absolute; left:4px; color:var(--gold-deep); font-weight:700;}
  .mixlab{font-size:0.66rem; letter-spacing:0.09em; text-transform:uppercase; color:var(--grey); font-weight:700; margin:0 0 5px;}
  .mix{display:flex; flex-wrap:wrap; gap:5px;}
  .mix li{font-size:0.74rem; padding:2px 9px; border:1px solid var(--sand-line); border-radius:999px; background:var(--paper); white-space:nowrap;}
  .own{font-size:0.8rem; color:var(--grey); margin:13px 0 0; border-top:1px solid var(--sand-line); padding-top:11px;}
  .foot{max-width:62ch; margin:34px 0 0; font-size:0.9rem; color:var(--grey);}
  @media (prefers-color-scheme: dark){ :root:not([data-theme="light"]) body{background:var(--paper);} }
</style></head>
<body><div class="wrap">
  <p class="eyebrow">Connect Lite</p>
  <h1>TP points library</h1>
  <p class="lede">Teaching practice written against a real coursebook — twelve teaching days, three lessons a day, each one staged and timed to 45 minutes.</p>
  <p class="note">Tell us which levels your course runs and we put those sets on it. You take the ones you teach; nothing else goes on your course.</p>
  <div class="sets">
${cards}
  </div>
  <p class="foot">Every lesson arrives with the pages it teaches from, the recordings it plays, and the day's pages as one PDF to print. Your candidates get their own lesson on their own card, with the other two at the foot of the day to sit in on.</p>
</div></body></html>`;
const out = path.join(ROOT, 'library', 'index.html');
fs.writeFileSync(out, html);
console.log(`library/index.html — ${ids.length} sets, ${Math.round(html.length / 1024)} KB`);
ids.forEach(id => { const t = stats(LIB[id]); console.log(`  ${LIB[id].level.padEnd(22)} ${(LIB[id].book||'').split(',')[0].padEnd(34)} ${t.scans} pages · ${t.tracks} tracks · ${t.days} days`); });
