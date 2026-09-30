/**
 * Connect Lite — record the film.
 *
 *   node film/take.mjs            the whole film
 *   node film/take.mjs --scene 13 one scene, for a retake
 *
 * The film plays itself; this is the camera. A 1280 x 800 browser opens the
 * film in `?take=1` (stage only: no bar, no scene tabs, no note), plays to
 * the end, and the recording lands in film/takes/. The engine sets
 * window.filmEnded when the last scene finishes, which is what this waits for.
 *
 * The pages come from a local copy of the repository, so a take shows exactly
 * what is in the working tree; the records still come from the live store, so
 * the demo courses must be up (c6, c7, c4) and the machine online. Writes are
 * held back scene by scene, as they are in a normal viewing.
 *
 * Format: webm (VP8). Playwright's own ffmpeg is the only encoder here and it
 * writes nothing else; every browser plays it, and YouTube and Vimeo take it
 * as it is. For an mp4, run it through an ffmpeg with H.264.
 */
import { readFileSync, mkdirSync, renameSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { join, extname } from 'node:path';
import { chromium } from 'playwright';

const HERE = new URL('..', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(join(HERE, '.owner-key'), 'utf8').trim();
const arg = (n) => { const i = process.argv.indexOf(n); return i === -1 ? null : process.argv[i + 1]; };
const SCENE = arg('--scene');

const raw = async (b) => { for (let i = 0; i < 8; i++) { try { const r = await (await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) })).json(); if (r && (r.ok || r.error)) return r; } catch (e) {} await new Promise(res => setTimeout(res, 2500)); } throw new Error('the store would not answer'); };
const courses = (await raw({ op: 'ownerCourses', owner: OWNER })).result.courses;
const key = (id) => { const c = courses.find(c => c.id === id); if (!c) throw new Error('the film needs course ' + id + ', which is not in the store'); return c.tutorKey; };

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webmanifest': 'application/manifest+json' };
const server = createServer((rq, rs) => {
  const name = decodeURIComponent((rq.url || '/').split('?')[0]).replace(/^\/+/, '') || 'index.html';
  let body; try { body = readFileSync(join(HERE, name)); } catch { rs.writeHead(404); return rs.end('no'); }
  rs.writeHead(200, { 'Content-Type': TYPES[extname(name)] || 'application/octet-stream' });
  rs.end(body);
});
await new Promise(r => server.listen(0, r));
const port = server.address().port;

const takes = join(HERE, 'film', 'takes');
mkdirSync(takes, { recursive: true });
/* The microphone is granted and faked so the dictation beats show the button
   in its real recording state; the words themselves are typed by the film,
   as they are in any take -- Chromium's speech service is not reachable here. */
const browser = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, permissions: ['microphone'], recordVideo: { dir: takes, size: { width: 1280, height: 800 } } });
const page = await ctx.newPage();
const errs = []; page.on('pageerror', e => errs.push(e.message));

const url = `http://127.0.0.1:${port}/film/index.html?take=1&sk=${key('c6')}&vk=${key('c7')}&fk=${key('c4')}&o=${OWNER}` + (SCENE ? '&scene=' + SCENE : '');
console.log('rolling' + (SCENE ? ' on scene ' + SCENE : '') + '…');
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });

const t0 = Date.now();
let ended = false;
for (let i = 0; i < 2400; i++) {          /* up to 40 minutes */
  const s = await page.evaluate(() => ({ ended: !!window.filmEnded, now: (document.getElementById('now') || {}).textContent || '' }));
  if (s.ended) { ended = true; break; }
  if (i % 12 === 0) process.stdout.write('\r  ' + Math.round((Date.now() - t0) / 1000) + 's · scene ' + (s.now || '…') + '        ');
  await page.waitForTimeout(1000);
}
process.stdout.write('\n');
if (!ended) console.log('the film did not reach its end; what was recorded is kept');
const warns = await page.evaluate(() => [...document.querySelectorAll('.warn')].map(w => w.textContent.trim()).filter(Boolean));

const video = page.video();
await page.close(); await ctx.close();        /* the file is only written on close */
const made = await video.path();
const name = 'lite-film-' + new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '').replace(/(\d{8})(\d{4})/, '$1-$2') + (SCENE ? '-scene' + SCENE : '') + '.webm';
const out = join(takes, name);
renameSync(made, out);
await browser.close(); server.close();

console.log('take: ' + out + ' · ' + (statSync(out).size / 1e6).toFixed(1) + ' MB · ' + Math.round((Date.now() - t0) / 1000) + 's');
if (warns.length) console.log('the film warned about: ' + warns.join(' | '));
if (errs.length) console.log('page errors: ' + errs.slice(0, 5).join(' | '));
