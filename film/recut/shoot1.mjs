// Film 1, "Thirteen books": the real tutor screens at a tablet-narrow width (560), writes blocked.
import { createRequire } from 'node:module'; import fs from 'node:fs';
const { chromium } = createRequire('/Users/work/connect-Hub/package.json')('playwright');
import { guard, blocked, HIDE, MASK } from './guard.mjs';
const R = process.env.RECUT || new URL('.', import.meta.url).pathname, S = R + '/f1';
fs.mkdirSync(S, { recursive: true });
const K = process.env.LITE_KEY   /* the scratch course's tutor key: never written into the repo */, BASE = 'https://lite.celtaconnect.com/', SETS = `28_tp_point_sets.html?k=${K}`;
const VW = 560, VH = 657;   // the film's window: 900 x 1056 film pixels
const b = await chromium.launch();
// each scene starts in a fresh browser: after a faked save, Lite re-reads the course and puts the true values back
let ctx, p;
const fresh = async () => { if (ctx) await ctx.close(); ctx = await b.newContext({ serviceWorkers: 'block', viewport: { width: VW, height: VH }, deviceScaleFactor: 2 });
  await guard(ctx); p = await ctx.newPage(); p.on('dialog', d => d.accept()); };
await fresh();
const meta = {};
const go = async (url) => { await p.goto(BASE + url); await p.waitForTimeout(4000); await p.waitForFunction(() => document.body && !/Checking your link|Loading from the course|Checking the course/.test(document.body.innerText), null, { timeout: 60000 }).catch(() => {}); await p.waitForTimeout(2500); await p.addStyleTag({ content: HIDE }); await p.evaluate(MASK); await p.waitForTimeout(200); };
const at = (sel, text) => p.evaluate(([sel, text]) => { const e = [...document.querySelectorAll(sel)].filter(e => (!text || e.textContent.includes(text)) && e.getBoundingClientRect().height > 0 && e.getBoundingClientRect().bottom > 0 && e.getBoundingClientRect().top < innerHeight && (() => { const r = e.getBoundingClientRect(), h = document.elementFromPoint(r.x + Math.min(r.width / 2, 40), r.y + r.height / 2); return !!h && (h === e || e.contains(h) || h.contains(e)); })()).sort((a, b) => (a.contains(b) ? 1 : b.contains(a) ? -1 : 0))[0]; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }, [sel, text]);
const shot = async (name, y, h = VH, targets = {}) => {
  const parts = []; let want = Math.max(0, y), first = null;
  while (true) {
    await p.evaluate(y => window.scrollTo(0, y), want); await p.waitForTimeout(450); await p.evaluate(MASK);
    const top = await p.evaluate(() => scrollY);
    if (first === null) { first = top; for (const [k, [sel, text]] of Object.entries(targets)) meta[k] = await at(sel, text); }
    const file = `${S}/_${name}-${parts.length}.png`; await p.screenshot({ path: file }); parts.push({ file, top });
    if (top + VH >= first + h || top < want - 1) break;
    want = top + VH - 40;
  }
  meta[name] = { top: first, h: Math.min(h, parts[parts.length - 1].top + VH - first), parts };
  if (parts.length === 1) fs.copyFileSync(parts[0].file, `${S}/${name}.png`);
  await p.evaluate(y => window.scrollTo(0, y), first); await p.waitForTimeout(300);
  return first; };
const yOf = (text, sel = '*') => p.evaluate(([text, sel]) => { const e = [...document.querySelectorAll(sel)].filter(e => e.textContent.trim().startsWith(text) && e.getBoundingClientRect().height > 0).sort((a, b) => (a.contains(b) ? 1 : b.contains(a) ? -1 : 0))[0]; return e ? e.getBoundingClientRect().top + scrollY : null; }, [text, sel]);

const openSession = async (label) => {   // the open session is remembered between loads: open it only if it is shut
  const btn = p.locator('button.shead', { hasText: label }).first();
  const isOpen = () => btn.evaluate(b => { const s = b.closest('.sess'); return !!s && !!s.querySelector('input[data-sl], textarea[data-sl], label[for^="file-"]') && [...s.querySelectorAll('input[data-sl]')].some(i => i.getBoundingClientRect().height > 0); });
  if (!(await isOpen())) { await btn.click(); await p.waitForTimeout(1200); }
  if (!(await isOpen())) { await btn.click(); await p.waitForTimeout(1200); }
  await p.evaluate(MASK); };
// 1 · the course's TP point sets screen, top
await go(SETS); await shot('sets', 0);
// 2 · the public library page
await go('library/'); await shot('library', 0, VH + 1700);
// 3 · one card, close: the first, Speakout A1
const card = p.locator('article, .card, section, div', { hasText: 'Speakout A1' }).filter({ hasText: 'teaching days' }).last();
await card.screenshot({ path: `${S}/card.png` }); meta.card = await card.boundingBox();
// 4 · inside one lesson: TP 1 · ABC, slot 1, its stages and its clock
await go(SETS); await openSession('TP 1 · ABC');
const s1 = await yOf('Slot 1'), c1 = await p.evaluate(() => { const e = [...document.querySelectorAll('*')].find(e => /^\d+ of \d+ minutes$/.test(e.textContent.trim()) && e.getBoundingClientRect().height > 0); return e.getBoundingClientRect().top + scrollY; });
await shot('lesson', s1 - 12, c1 + 60 - (s1 - 12));
await fresh();
// 5 · take a set from the library
await go(SETS); await p.click('text=+ from the library'); await p.waitForTimeout(1000);
const ty = await p.evaluate(() => { const c = [...document.querySelectorAll('*')].filter(e => e.textContent.trim() === 'Speakout Elementary')[0]; return c.getBoundingClientRect().top + scrollY; });
await shot('take-a', ty - 230, VH, { takeBtn: ['button', 'Take this set'] });
await p.mouse.click(meta.takeBtn.x + meta.takeBtn.w / 2, meta.takeBtn.y + meta.takeBtn.h / 2); await p.waitForTimeout(2500);
meta.takeStatus = await p.evaluate(() => (document.getElementById('status') || {}).textContent || '');
const sy = await yOf('THIS SET IS');
await shot('take-b', Math.max(0, sy - 300), VH, { newPill: ['button, a, .pill, div', 'Elementary · Speakout'] });
// 8 (taken here, while the new set is open) · the pages, cut from a copy of the book
const py = await yOf('The pages this set teaches from');
await shot('pages-a', py - 40, VH, { pdfBtn: ['label, button, span', 'Point at your PDF'] });
const inp = await p.evaluate(() => { const i = document.querySelector('input[data-pdf]'); return i && i.id; });
await p.setInputFiles('#' + inp, R + '/placeholder-book.pdf');
await p.waitForFunction(() => /Is this page|And is this page/.test(document.body.innerText), null, { timeout: 60000 }); await p.waitForTimeout(1500);
let qy = await p.evaluate(() => { const e = [...document.querySelectorAll('.pgcal')].find(e => e.getBoundingClientRect().height > 0); return e.getBoundingClientRect().top + scrollY; });
await shot('pages-b', qy - 120, VH, { yes1: ['#pggo', ''] });
meta.q1 = await p.evaluate(() => document.querySelector('.pgcal .q').textContent);
await p.click('#pggo'); await p.waitForTimeout(1800);
qy = await p.evaluate(() => { const e = [...document.querySelectorAll('.pgcal')].find(e => e.getBoundingClientRect().height > 0); return e.getBoundingClientRect().top + scrollY; });
meta.q2 = await p.evaluate(() => document.querySelector('.pgcal .q').textContent + ' | ' + document.getElementById('pggo').textContent);
await shot('pages-c', qy - 120, VH, { yes2: ['#pggo', ''] });
if (/cut out all/.test(meta.q2)) { await p.click('#pggo');
  await p.waitForFunction(() => /Cutting out page \d+ — (\d+)/.test(document.body.innerText) && +(document.body.innerText.match(/Cutting out page \d+ — (\d+)/) || [])[1] >= 12, null, { timeout: 120000 }).catch(() => {});
  qy = await p.evaluate(() => { const e = [...document.querySelectorAll('.pgcal')].find(e => e.getBoundingClientRect().height > 0); return e ? e.getBoundingClientRect().top + scrollY : 0; });
  await shot('pages-d', qy - 120); meta.q3 = await p.evaluate(() => (document.querySelector('.pgcal .q') || {}).textContent || ''); }
await fresh();
// 6 · it's yours: a sub aim rewritten, a timing trimmed, the clock follows
await go(SETS); await openSession('TP 1 · ABC');
const mins = await p.evaluate(() => {
  const nm = [...document.querySelectorAll('input')].find(i => i.value === 'Post-reading' && i.getBoundingClientRect().height > 0);
  let box = nm.parentElement; while (box && !box.querySelector('select')) box = box.parentElement;   // the stage's own box
  const m = [...box.querySelectorAll('input')].find(i => i !== nm && /^\d+$/.test(i.value));
  return { y: nm.getBoundingClientRect().top + scrollY, st: m.getAttribute('data-st') }; });
const MINS = `input[data-st="${mins.st}"]`;
await shot('yours-c', mins.y - 60, VH, { minsIn: [MINS, ''], clockA: ['b, span, div', ' of 45 minutes'] });
await p.fill(MINS, '11'); await p.evaluate(sel => { const e = document.querySelector(sel); e.dispatchEvent(new Event('change', { bubbles: true })); e.blur(); }, MINS); await p.waitForTimeout(900);
await shot('yours-d', mins.y - 60);
meta.clockAfter = await p.evaluate(() => { const c = [...document.querySelectorAll('*')].filter(e => /^\d+ of 45 minutes$/.test(e.textContent.trim()) && e.getBoundingClientRect().top > 0 && e.getBoundingClientRect().top < innerHeight); return c.map(e => e.textContent.trim()).join(' / '); });
await fresh(); await go(SETS); await openSession('TP 1 · ABC');
const sub = await p.evaluate(() => { const e = [...document.querySelectorAll('input[data-sl$="|0|sub"]')].find(e => e.getBoundingClientRect().height > 0); e.setAttribute('data-film', 'sub'); return e.getBoundingClientRect().top + scrollY; });
await shot('yours-a', sub - 260, VH, { subIn: ['input[data-film="sub"]', ''] });
await p.fill('input[data-film="sub"]', 'To clarify vocabulary for family members, in their own words'); await p.waitForTimeout(400);
await shot('yours-b', sub - 260);
await fresh();
// 7 · bring your own: a Word document, read into stages
await go(SETS); await openSession('TP 3 · ABC');
const iy = await yOf('Import a document', 'label');
await shot('import-a', iy - 200, VH, { impBtn: ['label', 'Import a document'] });
const fid = await p.evaluate(() => { const l = [...document.querySelectorAll('label')].find(l => /Import a document/.test(l.textContent) && l.getBoundingClientRect().height > 0); return l.getAttribute('for'); });
await p.setInputFiles('#' + fid, R + '/TP3.docx'); await p.waitForTimeout(2500); await p.evaluate(MASK);
meta.importStatus = await p.evaluate(() => (document.getElementById('status') || {}).textContent || '');
const s1b = await yOf('Slot 1');
await shot('import-b', s1b - 140, VH + 500);
fs.writeFileSync(`${S}/meta.json`, JSON.stringify(meta, null, 1));
console.log('take:', meta.takeStatus, '| q1:', meta.q1, '| q2:', meta.q2, '| q3:', meta.q3, '| clock:', meta.clockAfter, '| import:', meta.importStatus);
console.log('blocked writes:', [...new Set(blocked)].join(',') || 'none', blocked.length); await b.close();
