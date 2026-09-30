/**
 * Connect Lite — cut the waiting out of a take.
 *
 *   node film/cut.mjs film/takes/lite-film-<stamp>.webm
 *
 * A take is about eleven minutes; the film is about six. The difference is
 * the store: every scene loads its screen and waits six to eighteen seconds
 * for it, and the engine holds a curtain over that wait (`.curtain`) with a
 * six-pixel mark in the top left corner in a colour no screen uses. This plays
 * the take through a canvas into a MediaRecorder and pauses the recorder
 * whenever that corner is the mark's colour, so every curtain lands on the
 * cutting-room floor and the cut file runs at the film's written length.
 *
 * The browser is the encoder: the machine has no ffmpeg of its own, and the
 * one Playwright ships writes VP8 and nothing else. The cut is VP8 in webm,
 * which every browser plays and YouTube and Vimeo take as it is.
 *
 * It plays in real time, so the cut takes about as long as the take.
 */
import { readFileSync, statSync, appendFileSync, rmSync, renameSync, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { spawnSync } from 'node:child_process';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

const FILE = process.argv[2];
if (!FILE) { console.log('name a take: node film/cut.mjs film/takes/<file>.webm'); process.exit(1); }
const OUT = FILE.replace(/\.webm$/, '-cut.webm');
if (existsSync(OUT)) rmSync(OUT);

const server = createServer((rq, rs) => { rs.writeHead(200, { 'Content-Type': 'video/webm', 'Content-Length': statSync(FILE).size, 'Access-Control-Allow-Origin': '*' }); rs.end(readFileSync(FILE)); });
await new Promise(r => server.listen(0, r));
const port = server.address().port;

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 400, height: 300 } })).newPage();
await page.exposeFunction('cutChunk', (b64) => { appendFileSync(OUT, Buffer.from(b64, 'base64')); });
await page.exposeFunction('cutSay', (s) => console.log(s));

await page.setContent(`<body style="margin:0;background:#111;color:#ccc;font:12px system-ui">
<video id="v" crossorigin="anonymous" muted style="width:200px" src="http://127.0.0.1:${port}/take.webm"></video>
<canvas id="c" width="1280" height="800" style="display:none"></canvas>
<canvas id="probe" width="8" height="8" style="display:none"></canvas>
<p id="p">…</p></body>`);
await page.waitForFunction(() => { const v = document.getElementById('v'); return v.readyState >= 2 && isFinite(v.duration); }, null, { timeout: 120000 });
const dur = await page.evaluate(() => document.getElementById('v').duration);
console.log('take ' + Math.floor(dur / 60) + ':' + String(Math.round(dur % 60)).padStart(2, '0') + ' — cutting the curtains out');

await page.evaluate(() => new Promise((done) => {
  const v = document.getElementById('v'), c = document.getElementById('c'), g = c.getContext('2d');
  const pr = document.getElementById('probe'), pg = pr.getContext('2d');
  /* VP8, not VP9: the only ffmpeg on this machine is the one Playwright ships,
     and it can copy a VP8 stream into a fresh container (which is what gives
     the cut a duration and a seek index) but not a VP9 one. */
  const types = ['video/webm;codecs=vp8', 'video/webm'];
  const type = types.find(t => MediaRecorder.isTypeSupported(t));
  const rec = new MediaRecorder(c.captureStream(30), { mimeType: type, videoBitsPerSecond: 3500000 });
  let pending = Promise.resolve(), dropped = 0, kept = 0, lastT = 0;
  rec.ondataavailable = (e) => {
    if (!e.data || !e.data.size) return;
    pending = pending.then(() => e.data.arrayBuffer()).then((buf) => {
      const u = new Uint8Array(buf); let s = '';
      for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
      return window.cutChunk(btoa(s));
    });
  };
  rec.onstop = () => { pending.then(() => { window.cutSay('kept ' + Math.round(kept) + 's of picture, dropped ' + Math.round(dropped) + 's of curtain'); done(); }); };
  rec.start(2000);
  let paused = false, frames = 0;
  const draw = () => {
    if (v.ended) { try { if (rec.state === 'paused') rec.resume(); } catch (e) {} rec.stop(); return; }
    g.drawImage(v, 0, 0, 1280, 800);
    /* The curtain's mark: six magenta pixels in the very corner. */
    pg.drawImage(c, 0, 0, 8, 8, 0, 0, 8, 8);
    const d = pg.getImageData(1, 1, 1, 1).data;
    const curtain = d[0] > 190 && d[1] < 90 && d[2] > 190;
    if (curtain && !paused) { try { rec.pause(); } catch (e) {} paused = true; }
    else if (!curtain && paused) { try { rec.resume(); } catch (e) {} paused = false; }
    const dt = Math.max(0, v.currentTime - lastT); lastT = v.currentTime;
    if (paused) dropped += dt; else kept += dt;
    if (++frames % 900 === 0) document.getElementById('p').textContent = Math.round(v.currentTime) + 's';
    requestAnimationFrame(draw);
  };
  v.play().then(() => requestAnimationFrame(draw));
}));

await browser.close(); server.close();

/* A file straight out of MediaRecorder has no duration and no seek index --
   a player cannot say how long it is or jump about in it. Copying the stream
   into a fresh container writes both. */
const FFMPEG = join(homedir(), 'Library/Caches/ms-playwright/ffmpeg-1011/ffmpeg-mac');
if (existsSync(FFMPEG)) {
  const tmp = OUT.replace(/\.webm$/, '.raw.webm');
  renameSync(OUT, tmp);
  const r = spawnSync(FFMPEG, ['-y', '-i', tmp, '-c', 'copy', OUT], { encoding: 'utf8' });
  if (existsSync(OUT) && statSync(OUT).size > 1000) rmSync(tmp);
  else { renameSync(tmp, OUT); console.log('the container could not be rewritten: ' + (r.stderr || '').split('\n').slice(-3).join(' ')); }
}
console.log('cut: ' + OUT + ' · ' + (statSync(OUT).size / 1e6).toFixed(1) + ' MB');
