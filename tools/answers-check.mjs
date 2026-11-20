/**
 * Connect Lite — does an input session print with every answer?
 *
 *   node tools/answers-check.mjs <slug> <out-folder>
 *
 * Opens input-sessions/<slug>/ from this folder (never the live site, never the store), presses "Print with the
 * answers" with the print itself stubbed, and writes into <out-folder>:
 *   <slug>-answers.pdf   what would print, with the answers
 *   <slug>-answers.txt   the same as text, part by part, to read against the session's exercises
 * and prints a count for each part: answers written, answer blocks shown, and the buttons, dropdowns and boxes still
 * showing. It then checks the answers are gone again afterwards and that the plain handout shows none.
 *
 * The session's answers file (input-sessions/answers/<slug>.js) is loaded here whether or not library.js lists the
 * session as ready, so a file can be written and checked before it is switched on.
 *
 * It counts and it shows; it cannot know whether an answer is the right one or whether an exercise was missed. Read
 * the text file against the page.
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join, extname, resolve } from 'node:path';

const ROOT = resolve(new URL('.', import.meta.url).pathname, '..');
const [slug, outArg] = process.argv.slice(2);
if (!slug || !outArg) { console.error('usage: node tools/answers-check.mjs <slug> <out-folder>'); process.exit(2); }
const OUT = resolve(outArg); mkdirSync(OUT, { recursive: true });
if (!existsSync(join(ROOT, 'input-sessions', slug, 'index.html'))) { console.error('no such session: ' + slug); process.exit(2); }

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8' };
const server = createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = join(ROOT, p);
  if (!f.startsWith(ROOT) || !existsSync(f) || statSync(f).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'Content-Type': TYPES[extname(f)] || 'application/octet-stream' }); res.end(readFileSync(f));
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = 'http://127.0.0.1:' + server.address().port;

const browser = await chromium.launch();
let failed = false;
try {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.route(/script\.google(usercontent)?\.com/, rt => rt.abort());          // the store is never reached
  const page = await ctx.newPage(); const errors = [];
  page.on('pageerror', e => errors.push(String(e.message).slice(0, 200)));
  await page.goto(`${base}/input-sessions/${slug}/index.html`, { waitUntil: 'load' }); await page.waitForTimeout(1500);

  const own = existsSync(join(ROOT, 'input-sessions', 'answers', slug + '.js'));
  if (!(await page.evaluate(() => !!window.SessionAnswers))) await page.addScriptTag({ url: `${base}/input-sessions/answers.js` });
  if (own && !(await page.evaluate(() => !!document.getElementById('ansCard')))) await page.addScriptTag({ url: `${base}/input-sessions/answers/${slug}.js` });
  await page.waitForTimeout(300);
  const hasCard = await page.evaluate(() => !!document.getElementById('ansPrint'));

  const parts = () => page.evaluate(() => {
    const vis = e => { const cs = getComputedStyle(e); return cs.display !== 'none' && cs.visibility !== 'hidden' && e.getClientRects().length > 0; };
    const count = (root, sel) => [...root.querySelectorAll(sel)].filter(vis).length;
    return [...document.querySelectorAll('section')].filter(s => s.id !== 'trainer' && !s.classList.contains('trainer-notes') && vis(s)).map(s => ({
      id: s.id || '', head: ((s.querySelector('h2, h3, .stage-title, .section-label') || {}).textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60),
      answersWritten: count(s, '.ans-line'), blocksShown: count(s, '.reveal-block, .reveal-card .a, .answer-key, .ans-show'),
      buttonsLeft: count(s, 'button'), dropdownsLeft: count(s, 'select'), boxesLeft: count(s, 'input, textarea'),
      text: s.innerText.replace(/\n{3,}/g, '\n\n').trim() }));
  });

  await page.evaluate(() => { window.__printed = 0; window.print = () => { window.__printed++; }; });
  let report = { slug, answersFile: own, card: hasCard, errors: [] };
  if (hasCard) {
    await page.locator('#ansPrint').click(); await page.waitForTimeout(400);
    await page.emulateMedia({ media: 'print' }); await page.waitForTimeout(200);
    const withA = await parts();
    await page.pdf({ path: join(OUT, slug + '-answers.pdf'), format: 'A4', margin: { top: '12mm', bottom: '12mm', left: '10mm', right: '10mm' } });
    writeFileSync(join(OUT, slug + '-answers.txt'), withA.map(p => `===== ${p.id} | ${p.head} | answers written ${p.answersWritten}, blocks shown ${p.blocksShown} =====\n${p.text}\n`).join('\n'));
    report.printCalled = await page.evaluate(() => window.__printed);
    report.parts = withA.map(({ text, ...p }) => p);
    report.answersWritten = withA.reduce((n, p) => n + p.answersWritten, 0);
    report.blocksShown = withA.reduce((n, p) => n + p.blocksShown, 0);
    await page.evaluate(() => window.dispatchEvent(new Event('afterprint'))); await page.waitForTimeout(150);
    const plain = await parts();
    report.afterwards = { answersLeft: await page.evaluate(() => document.querySelectorAll('.ans-line, .ans-show, .ans-hide').length), classLeft: await page.evaluate(() => document.body.classList.contains('with-answers')),
      plainHandoutAnswers: plain.reduce((n, p) => n + p.answersWritten, 0), plainHandoutBlocks: plain.reduce((n, p) => n + p.blocksShown, 0) };
    await page.emulateMedia({ media: 'screen' });
    report.onScreenAnswers = await page.evaluate(() => [...document.querySelectorAll('.ans-line')].length);
  }
  report.errors = errors;
  console.log(JSON.stringify(report, null, 1));
  failed = !hasCard || errors.length > 0;
} finally { await browser.close(); server.close(); }
process.exit(failed ? 1 : 0);
