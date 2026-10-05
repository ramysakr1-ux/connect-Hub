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

/* WHICH PAGES OF THE BOOK, for a pool that holds more than one set per book.
   Ramy, 5 Oct 2026: two centres may both offer Speakout B1 and that is the
   point -- so a card has to say how this one differs, or the second card is
   dead weight. There are no unit numbers in a set (nothing records them), but
   every slot names the pages it teaches from, and the pages ARE the answer to
   the only question a centre asks: do my photocopies match?

   A set teaches from the front of the book and then reaches into the reference
   section at the back -- Grammar Bank, Vocabulary Bank. Printed as one range
   that reads "pp. 9-138", which is the whole book and tells nobody anything.
   So a jump of more than twenty pages starts a new range: "SB pp. 9-58 + 104-138". */
const SRC_RANK = { SB: 1, WB: 2, TB: 3 };
function span(slots) {
  const bySrc = {};
  slots.forEach(sl => (sl.files || []).forEach(f => {
    if (!f || !f.page) return;
    const k = f.src || '?';
    (bySrc[k] = bySrc[k] || []).push(Number(f.page));
  }));
  return Object.entries(bySrc)
    .sort((a, b) => (SRC_RANK[a[0]] || 9) - (SRC_RANK[b[0]] || 9) || a[0].localeCompare(b[0]))
    .map(([src, pages]) => {
      const sorted = [...new Set(pages)].filter(n => n > 0).sort((x, y) => x - y);
      if (!sorted.length) return '';
      const runs = [[sorted[0]]];
      sorted.slice(1).forEach(n => {
        const run = runs[runs.length - 1];
        if (n - run[run.length - 1] > 20) runs.push([n]); else run.push(n);
      });
      return src + ' pp. ' + runs.map(r => r.length > 1 ? r[0] + '\u2013' + r[r.length - 1] : r[0]).join(' + ');
    }).filter(Boolean).join(' \u00b7 ');
}

function stats(S) {
  const slots = [];
  Object.keys(S.sessions || {}).forEach(k => (S.sessions[k].slots || []).forEach(sl => slots.push(sl)));
  const types = {};
  slots.forEach(sl => { const t = sl.type || '—'; types[t] = (types[t] || 0) + 1; });
  return {
    slots: slots.length,
    stages: slots.reduce((a, sl) => a + (sl.stages || []).length, 0),
    /* NAMED, not carried. Since 5 Oct 2026 the published library holds the
       writing only -- the pages and the recordings stay on the course that
       scanned them -- so `covers` carries the counts as numbers and the page
       says what a set needs rather than what it hands over. */
    scans: (S.covers || {}).pages ?? slots.reduce((a, sl) => a + (sl.files || []).length, 0),
    tracks: (S.covers || {}).tracks ?? slots.reduce((a, sl) => a + String(sl.tracks || '').split('\n').filter(Boolean).length, 0),
    days: (S.covers || {}).days ?? Object.values(S.sessions || {}).filter(x => x.dayPdf && x.dayPdf.url).length,
    types: Object.entries(types).sort((a, b) => b[1] - a[1]),
    span: span(slots),
  };
}
const ids = Object.keys(LIB).sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));

/* WHO PUT THEM IN. Ramy, 5 Oct 2026: the Pool is open to everyone whether they
   contribute or not, so the credit is the only pull there is -- which means it
   has to be visible somewhere a centre's peers will see it, not only on the
   card of the set they wrote. */
const by = [...new Set(ids.map(id => (LIB[id].by || 'Connect').trim()).filter(Boolean))];
const others = by.filter(n => n !== 'Connect');
const creditLine = !others.length ? ''
  : `<p class="credit">${ids.length} sets, ${by.length} contributors — ${
      by.map(n => `<b>${esc(n)}</b>`).join(', ')}.</p>`;

/* THE CATALOGUE THE SETS SCREEN READS. A tutor opening the chooser should not
   pull the whole library down to look at it -- the master file is 400 KB and
   growing with every set. This is the same facts the cards above show, about
   2 KB, so the chooser renders instantly; the full set is fetched from the
   master only at the moment someone takes one. `kb` is what that set will add
   to the course record, which every trainee's browser downloads. */
fs.writeFileSync(path.join(ROOT, 'library', 'catalogue.json'), JSON.stringify(
  ids.map(id => { const S = LIB[id], t = stats(S);
    return { id, level: S.level || '', book: S.book || S.name || '', minutes: S.minutes || 45,
             /* WHO WROTE IT. A set from the pool carries `by` -- the contributor's
                own name or their centre's, whichever they chose. Connect's own
                five have no field and are Connect's, so that is the default; it
                is never a guess at someone else's work. */
             by: S.by || 'Connect',
             slots: t.slots, stages: t.stages, scans: t.scans, tracks: t.tracks, days: t.days,
             span: t.span,
             types: t.types, kb: Math.round(JSON.stringify(S).length / 1024) }; }), null, 1));
const cards = ids.map(id => {
  const S = LIB[id], t = stats(S);
  return `<article class="setcard">
    <p class="lvl">${esc(S.level || '')}</p>
    <h3>${esc((S.book || '').split(',')[0])}</h3>
    <p class="bk">${esc(((S.book || '').split(',').slice(1).join(',') || '').trim())}</p>
    <p class="by">Contributed by ${esc(S.by || 'Connect')}</p>
    <p class="ct">${t.slots} lessons · ${t.stages} staged · every one 45 minutes</p>
    ${t.span ? `<p class="pg">${esc(t.span)}</p>` : ''}
    <div class="mix">${t.types.map(([k, n]) => `<span class="chip"><b>${n}</b> ${esc(k)}</span>`).join('')}</div>
    <div class="travels">
      <span class="tv"><b>${t.scans}</b> pages named</span>
      <span class="tv"><b>${t.tracks}</b> recordings named</span>
      <span class="tv"><b>${t.days}</b> teaching days</span>
    </div>
    <p class="own">Every lesson names the pages it teaches from. Point Lite at your own copy of the book and it cuts them out for you.</p>
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
  .setcard .by{margin:4px 0 0; font-size:.78rem; color:var(--teal); font-weight:600;}
  .setcard .ct{margin:3px 0 2px; font-size:.76rem; color:var(--faint); font-variant-numeric:tabular-nums;}
  .setcard .pg{margin:0 0 11px; font-size:.76rem; color:var(--grey); font-variant-numeric:tabular-nums;}
  .mix{display:flex; flex-wrap:wrap; gap:5px; margin:0 0 13px;}
  .chip{font-size:.7rem; background:var(--paper); border:1px solid var(--row-line);
    border-radius:999px; padding:3px 9px; color:var(--grey);}
  .chip b{color:var(--ink); font-variant-numeric:tabular-nums;}
  .travels{display:flex; flex-wrap:wrap; gap:14px; padding-top:11px; border-top:1px solid var(--sand-line);}
  .tv{font-size:.78rem; color:var(--grey); font-variant-numeric:tabular-nums;}
  .tv b{color:var(--teal); font-size:.92rem;}
  .own{font-size:.76rem; color:var(--faint); margin:11px 0 0;}
  .foot{max-width:64ch; margin:30px 0 0; font-size:.9rem; color:var(--grey);}
  .credit{max-width:72ch; margin:26px 0 0; font-size:.9rem; color:var(--grey);}
  .credit b{color:var(--teal);}
  .offer{max-width:66ch; margin:30px 0 0; padding:20px 22px; background:var(--paper);
    border:1px solid var(--sand-line); border-bottom-width:3px; border-radius:11px;}
  .offer h2{font-family:'Newsreader',Georgia,serif; font-weight:600; font-size:1.3rem; margin:0 0 9px;}
  .offer p{margin:0 0 11px; font-size:.92rem;}
  .offer p:last-child{margin-bottom:0;}
  .offer .small{font-size:.84rem; color:var(--grey);}
  .offer a{color:var(--teal);}
</style></head>
<body><div class="wrap">
  <p class="eyebrow">Connect Lite</p>
  <h1>TP points library</h1>
  <p class="lede">Teaching practice written against a real coursebook — twelve teaching days, three lessons a day, each one staged and timed to 45 minutes.</p>
  <p class="note">Open the TP point sets screen on your course and take the levels you run. A set you take is yours to change, and nothing else goes on your course.</p>
  <div class="cards">
${cards}
  </div>
  ${creditLine}
  <section class="offer">
    <h2>Offer a set</h2>
    <p>The library is open to every centre on Lite, whether they have put anything into it or not. What offering a set buys is the credit on it: <b>Contributed by</b> and then whatever you choose &mdash; your centre&rsquo;s name or your own &mdash; travelling with those lessons wherever they are taught.</p>
    <p>Open <b>TP point sets</b> on your course, choose the set, and click <b>Offer this set to the Pool</b>. It saves a file; send it to <b><a href="mailto:lite@celtaconnect.com?subject=TP%20point%20set">lite@celtaconnect.com</a></b> with the file attached. We read it, run the library&rsquo;s checks over it and write back.</p>
    <p class="small"><b>What is in the file:</b> the aims, the lesson shapes, every stage with its timing and its watch notes, and the page and track numbers each lesson teaches from. <b>What is not:</b> your scans, your recordings and your printed days &mdash; not one link leaves your course, and the centre that takes the set points Lite at its own copy of the book.</p>
    <p class="small"><b>It stays yours.</b> Offering it lets Connect edit it and publish it here for other centres to teach from, credited as you asked. Ask and it comes out again, and it is yours to go on using however you like. <b>It has to be yours to give</b> &mdash; your own lessons, not stages copied out of a teacher&rsquo;s book. Naming the pages of a coursebook is how every set here works; copying the publisher&rsquo;s procedure is not, and a set that does will not go in.</p>
  </section>
    <p class="foot">What travels is the writing: the aims, the staging, the timings, and which page and which recording each lesson uses. The book stays yours — point Lite at your own copy and it cuts out the pages, onto your own course, and prints the day. Your trainees get their own lesson on their own card, with the other two at the foot of the day to sit in on.</p>
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
