// Film 3, "On the day": the real trainee screens on the scratch course, at phone width.
import { createRequire } from 'node:module'; import fs from 'node:fs';
const { chromium } = createRequire('/Users/work/connect-Hub/package.json')('playwright');
import { guard, blocked, labels, HIDE, seen } from './guard.mjs';
const S = (process.env.RECUT || new URL('.', import.meta.url).pathname) + '/f3';
fs.mkdirSync(S, { recursive: true });
const T = process.env.LITE_TOKEN   /* a scratch-course trainee's token: never written into the repo */, BASE = 'https://lite.celtaconnect.com/';
const VW = 390, VH = 713;   // the film's phone screen, 612 x 1118, in CSS pixels
const b = await chromium.launch();
const ctx = await b.newContext({ serviceWorkers: 'block', viewport: { width: VW, height: VH }, deviceScaleFactor: 2, hasTouch: true,
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
await guard(ctx);
const p = await ctx.newPage();
const meta = {};
const go = async (url) => { await p.goto(BASE + url); await p.waitForTimeout(4000); await p.waitForFunction(() => document.body && !/Checking your link|Loading from the course|Checking the course/.test(document.body.innerText), null, { timeout: 60000 }).catch(() => {}); await p.waitForTimeout(2500); await p.addStyleTag({ content: HIDE }); await p.waitForTimeout(300); };
const rect = (sel, text) => p.evaluate(([sel, text]) => { const els = [...document.querySelectorAll(sel)].filter(e => (!text || e.textContent.includes(text)) && e.getBoundingClientRect().height > 0).sort((a, b) => (a.contains(b) ? 1 : b.contains(a) ? -1 : 0)); const e = els[0]; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x, y: r.y + scrollY, w: r.width, h: r.height }; }, [sel, text]);
const at = (sel, text) => p.evaluate(([sel, text]) => { const e = [...document.querySelectorAll(sel)].filter(e => (!text || e.textContent.includes(text)) && e.getBoundingClientRect().height > 0 && e.getBoundingClientRect().bottom > 0 && e.getBoundingClientRect().top < innerHeight && (() => { const r = e.getBoundingClientRect(), h = document.elementFromPoint(r.x + Math.min(r.width / 2, 40), r.y + r.height / 2); return !!h && (h === e || e.contains(h) || h.contains(e)); })()).sort((a, b) => (a.contains(b) ? 1 : b.contains(a) ? -1 : 0))[0]; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }, [sel, text]);
// Screen-sized captures only: a full-length capture resizes the page and shifts its layout,
// which put the tap markers about 27px off. A taller scene is joined from screen-sized pieces.
const shot = async (name, y, h = VH, targets = {}) => {
  const parts = []; let want = Math.max(0, y), first = null;
  while (true) {
    await p.evaluate(y => window.scrollTo(0, y), want); await p.waitForTimeout(450);
    const top = await p.evaluate(() => scrollY);
    if (first === null) { first = top; for (const [k, [sel, text]] of Object.entries(targets)) meta[k] = await at(sel, text); }
    const file = `${S}/_${name}-${parts.length}.png`; await p.screenshot({ path: file }); parts.push({ file, top });
    // the measures and the picture must agree: a late layout shift between them shows as a moved scroll
    if (parts.length === 1 && Object.keys(targets).length) { const again = await p.evaluate(() => scrollY); if (again !== top) console.log('WARN scroll moved during', name, top, again); }
    if (top + VH >= first + h || top < want - 1) break;   // covered, or the page ended
    want = top + VH - 40;
  }
  meta[name] = { top: first, h: Math.min(h, parts[parts.length - 1].top + VH - first), parts };
  if (parts.length === 1) fs.copyFileSync(parts[0].file, `${S}/${name}.png`);
  // re-scroll to the first piece so anything measured next is measured on that screen
  await p.evaluate(y => window.scrollTo(0, y), first); await p.waitForTimeout(350);
  return first; };

// 1 · the invite card, then home
await go(`invite.html?t=${T}`); await shot('invite', 0);
await go(`index.html?t=${T}`); await shot('home', 0, VH, { homeLink: ['a', 'Your TP points for TP 3'] });

// the TP points page: read the frames' labels first, so each placeholder carries its own page number
await go(`24_tp_points.html?t=${T}`);
await p.waitForFunction(() => document.querySelectorAll('.pg iframe').length >= 3, null, { timeout: 60000 });
const frames = await p.evaluate(() => [...document.querySelectorAll('iframe')].map(f => ({ src: f.getAttribute('src') || '', title: f.title || '' })));
frames.forEach(f => { const m = /\/d\/([^/?]+)/.exec(f.src); if (m) labels.set(m[1], f.title.replace(/\s*—\s*not yours$/i, '')); });
// frames that loaded before the labels were known load again, now with their page numbers
await p.evaluate(() => document.querySelectorAll('iframe').forEach(f => { const s = f.getAttribute('src'); f.setAttribute('loading', 'eager'); f.setAttribute('src', 'about:blank'); f.setAttribute('src', s); }));
await p.evaluate(() => document.querySelectorAll('img').forEach(i => { if (/google/.test(i.src)) { const s = i.src; i.src = ''; i.src = s; } }));
// load every lazy frame, then come back
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 500) { await p.evaluate(y => window.scrollTo(0, y), y); await p.waitForTimeout(250); }
await p.waitForFunction(() => [...document.querySelectorAll('.pg iframe')].every(f => { try { return f.contentDocument === null || f.contentDocument.readyState === 'complete'; } catch (e) { return true; } }), null, { timeout: 30000 }).catch(() => {});
await p.waitForTimeout(3000);
const L = {
  lesson: await rect('.whoami'), myframe: await p.evaluate(() => { const f = [...document.querySelectorAll('.pg iframe')].find(f => f.getBoundingClientRect().height > 0 && /p\. 30/.test(f.title)); if (!f) return null; const r = f.getBoundingClientRect(); return { y: r.y + scrollY, h: r.height }; }), proc: await rect('*', 'THE PROCEDURE'), frame: await rect('.pg iframe'),
  audio: await rect('.audwrap'), play: await rect('.audplay'), others: await rect('h2, h3, .others-h, *', 'What the other two are teaching'),
  printme: await rect('.printme', 'Print my TP point'),
};
meta.L = L; meta.frames = frames.map(f => f.title);
await shot('day', 0, VH + 260);
await shot('lesson', L.lesson.y - 16, VH + 420);
await shot('pages', L.myframe.y - 150, VH, { pagesFrame: ['.pg iframe[title*="p. 30"]', ''], openDrive: ['a', 'Open in Drive'] });
await shot('print-a', L.lesson.y - 16, VH, { printme: ['.printme', 'Print my TP point'] });
// the printed TP point: Lite's own print stylesheet, on a sheet of A4 width
await p.evaluate(() => { window.print = () => {}; });
await p.setViewportSize({ width: 794, height: 1123 });
await p.locator('.printme:visible', { hasText: 'Print my TP point' }).first().click().catch(e => console.log('print click', e.message));
await p.emulateMedia({ media: 'print' }); await p.waitForTimeout(800);
await p.screenshot({ path: `${S}/print-sheet.png`, fullPage: false });
await p.emulateMedia({ media: 'screen' }); await p.setViewportSize({ width: VW, height: VH });
await p.waitForTimeout(500);
await shot('track-a', L.audio.y - 260, VH, { play: ['.audplay', ''] });
await p.locator('.audplay:visible').first().click(); for (let i = 0; i < 40; i++) { await p.waitForTimeout(500); if (!(await p.evaluate(() => /Getting the track/.test(document.body.innerText)))) break; } await p.waitForTimeout(800);
const findCopy = () => p.evaluate(() => { const au = [...document.querySelectorAll('audio')].find(a => a.getBoundingClientRect().height > 0);
  const below = au ? au.getBoundingClientRect().bottom : 0;
  const c = [...document.querySelectorAll('button, a')].filter(e => /copy link/i.test(e.textContent) && e.getBoundingClientRect().height > 0 && e.getBoundingClientRect().top >= below - 2).sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0];
  const r = c.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, below }; });
await p.evaluate(y => window.scrollTo(0, y), L.audio.y - 260);
for (let k = 0; k < 20; k++) { await p.waitForTimeout(400); const a1 = await findCopy(); await p.waitForTimeout(400); const a2 = await findCopy(); if (a1.below > 0 && a1.y === a2.y) break; }
meta.copyLink = await findCopy();
await shot('track-b', L.audio.y - 260);
const after = await findCopy(); if (after.y !== meta.copyLink.y) console.log('WARN copy link moved', meta.copyLink.y, after.y);
const oth = await p.evaluate(() => { const e = [...document.querySelectorAll('h1,h2,h3,h4,p,div')].filter(e => e.textContent.trim().startsWith('What the other two are teaching') && e.getBoundingClientRect().height > 0).pop(); const r = e.getBoundingClientRect(); return { y: r.y + scrollY }; });
meta.others = oth;
meta.tpH = await p.evaluate(() => document.documentElement.scrollHeight);
await shot('others-1', oth.y - 20); await shot('others-2', meta.tpH - VH);

// 8 · into the plan, opened the way the home page opens it
await go(`1_trainee_plan_and_analysis.html?t=${T}&tp=3`);
const st = await rect('#tpStart'); meta.tpStart = st;
await shot('plan-a', st.y - 330, VH, { tpStartV: ['#tpStart', ''] });
await p.click('#tpStart'); await p.waitForTimeout(1500);
await shot('plan-b', st.y - 330, VH + 500);
fs.writeFileSync(`${S}/meta.json`, JSON.stringify(meta, null, 1));
console.log('google requests:', [...new Set(seen.map(x => x.split(' ')[0]))].join(','), seen.length); console.log(JSON.stringify(meta.L), '\nframes:', meta.frames.join(' | '), '\nblocked writes:', blocked.join(',') || 'none');
await b.close();
