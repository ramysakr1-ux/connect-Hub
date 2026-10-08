/**
 * Connect Lite — a Journey film (the bundled HTML animation) as MP4.
 *
 *   node film/journey-mp4.mjs "<film.html>" <music.mp3> <out.mp4>
 *
 * To share the films on Instagram, Facebook and LinkedIn they have to be
 * ordinary video files (8 Oct 2026). Neither of the usual recorders can see
 * these films: Playwright's video and Chrome's own tab capture both show the
 * background and none of the scene, which the film draws inside an SVG
 * <foreignObject>. A screenshot does see it. So:
 *   1. FRAMES. The film's clock is taken over (film/journey-vclock.js:
 *      performance.now, Date.now and requestAnimationFrame) and stepped 1/30 s
 *      at a time, with a screenshot after every step -- exact, never dropped,
 *      faster than real time. The player bar is hidden and the stage drawn
 *      at its full 1920 x 1080.
 *   2. THE FILE. The installed Chrome paints those frames on a canvas at 30
 *      a second and records the canvas as H.264, with the music laid under it
 *      through WebAudio (looped with a three-second crossfade at the seam and
 *      faded out over the last four seconds, as the page's own music does).
 * film/flatten.mjs then makes it a plain, moov-first MP4.
 *
 * UPRIGHT (TikTok, Instagram Reels): VERTICAL=1 DECOR=<1080x1920 png> lays
 * each frame into that branded frame, the film across the middle at full
 * width. FRAMES=<dir> keeps the frames, and PASS2=1 FRAMES=<dir> reuses them,
 * so one capture gives both the landscape and the upright file.
 */
import { readFileSync, writeFileSync, appendFileSync, rmSync, existsSync, renameSync, statSync, mkdtempSync, mkdirSync, readdirSync } from 'node:fs';
import { createServer } from 'node:http';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

const [,, FILE, MUSIC, OUT] = process.argv;
if (!FILE || !MUSIC || !OUT) { console.log('node film/journey-mp4.mjs "<film.html>" <music.mp3> <out.mp4>'); process.exit(1); }
const TRIAL = +process.env.TRIAL || 0, FPS = 30;
if (existsSync(OUT)) rmSync(OUT);
const dir = process.env.FRAMES || mkdtempSync(join(tmpdir(), 'journey-'));
mkdirSync(dir, { recursive: true });

// ---- 1. frames --------------------------------------------------------------
// PASS2=1 with FRAMES=<dir> skips this and lays an existing set of frames.
let b, page, N;
if (process.env.PASS2) {
  N = readdirSync(dir).filter(f => f.endsWith('.jpg')).length;
  console.log('using ' + N + ' frames in ' + dir);
} else {
  b = await chromium.launch();
  page = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.addInitScript({ path: new URL('./journey-vclock.js', import.meta.url).pathname });
  await page.goto('file://' + FILE);
  await page.waitForFunction(() => !!document.querySelector('[data-omelette-chrome]'), null, { timeout: 60000 });
  await page.addStyleTag({ content: '[data-omelette-chrome]{display:none !important} svg:has(> foreignObject){transform:none !important; box-shadow:none !important} button[style*="2147483000"]{display:none !important}' });
  const clock = () => page.evaluate(() => { const t = [...document.querySelector('[data-omelette-chrome]').querySelectorAll('div')].filter(d => /^\d+:\d{2}\.\d{2}$/.test(d.textContent.trim()) && !d.children.length); const p = x => { const m = x.textContent.trim().split(':'); return +m[0] * 60 + +m[1]; }; return [p(t[0]), p(t[1])]; });
  const [, total] = await clock();
  const LEN = TRIAL ? Math.min(TRIAL, total) : total;
  N = Math.ceil(LEN * FPS);
  await page.keyboard.press('0');
  await page.waitForTimeout(150);
  await page.evaluate(() => window.__vclockOn());
  await page.evaluate(() => window.__vstep(0));
  const zero = (await clock())[0];
  console.log('film ' + total.toFixed(1) + ' s; ' + N + ' frames from ' + zero.toFixed(2) + ' s');
  const t0 = Date.now();
  for (let i = 0; i < N; i++) {
    if (i) await page.evaluate((ms) => window.__vstep(ms), 1000 / FPS);
    await page.screenshot({ path: join(dir, String(i).padStart(6, '0') + '.jpg'), type: 'jpeg', quality: 92 });
    if (i % 900 === 0) console.log('  frame ' + i + ' / ' + N + '  (film ' + (await clock())[0].toFixed(2) + ' s, ' + Math.round((Date.now() - t0) / 1000) + ' s in)');
  }
  const end = (await clock())[0];
  console.log('frames done in ' + Math.round((Date.now() - t0) / 1000) + ' s; film clock at ' + end.toFixed(2) + ' s');
  await b.close();

}

// ---- 2. the file -------------------------------------------------------------
const server = createServer((rq, rs) => {
  const u = rq.url.split('?')[0];
  const f = u === '/music.mp3' ? MUSIC : u === '/decor.png' ? process.env.DECOR : u.startsWith('/f/') ? join(dir, u.slice(3)) : null;
  if (!f || !existsSync(f)) { rs.writeHead(404); rs.end(); return; }
  rs.writeHead(200, { 'Content-Type': f.endsWith('.mp3') ? 'audio/mpeg' : f.endsWith('.png') ? 'image/png' : 'image/jpeg', 'Access-Control-Allow-Origin': '*' }); rs.end(readFileSync(f));
});
await new Promise(r => server.listen(0, r));
const port = server.address().port;
b = await chromium.launch({ channel: 'chrome', args: ['--autoplay-policy=no-user-gesture-required'] });
page = await (await b.newContext({ viewport: { width: 400, height: 300 } })).newPage();
await page.exposeFunction('mp4Chunk', (b64) => { appendFileSync(OUT, Buffer.from(b64, 'base64')); });
await page.exposeFunction('mp4Say', (s) => console.log(s));
const VERT = !!process.env.VERTICAL;
await page.setContent(VERT ? '<canvas id="c" width="1080" height="1920" style="width:108px"></canvas>' : '<canvas id="c" width="1920" height="1080" style="width:192px"></canvas>');
await page.evaluate(([N, FPS, BASE, DBG, VERT]) => new Promise(async (done, fail) => {
  try {
    const name = i => BASE + '/f/' + String(i).padStart(6, '0') + '.jpg';
    const load = i => fetch(name(i)).then(r => r.blob()).then(b => createImageBitmap(b));
    const ahead = new Map(); const want = i => { if (i < N && !ahead.has(i)) ahead.set(i, load(i)); };
    for (let i = 0; i < 90; i++) want(i);
    window.mp4Say('pass 2: loading frames');
    const c = document.getElementById('c'), g = c.getContext('2d', { alpha: false });
    /* upright: the branded frame once, then each picture across the middle */
    const decor = VERT ? await fetch(BASE + '/decor.png').then(r => r.blob()).then(b => createImageBitmap(b)) : null;
    const put = (bmp) => { if (VERT) { g.drawImage(decor, 0, 0); g.drawImage(bmp, 0, 656, 1080, 608); } else g.drawImage(bmp, 0, 0); };
    put(await ahead.get(0));
    const ac = new AudioContext();
    const track = await ac.decodeAudioData(await (await fetch(BASE + '/music.mp3')).arrayBuffer());
    const dest = ac.createMediaStreamDestination();
    const master = ac.createGain(); master.connect(dest);
    const LEN = N / FPS, L = track.duration, XF = 3, END = 4, step = L - XF;
    const vtrack = c.captureStream(0).getVideoTracks()[0];
    const stream = new MediaStream([vtrack, dest.stream.getAudioTracks()[0]]);
    const type = ['video/mp4;codecs=avc1.640028,mp4a.40.2', 'video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4'].find(t => MediaRecorder.isTypeSupported(t));
    if (!type) return fail(new Error('this Chrome cannot record MP4'));
    const rec = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 10000000, audioBitsPerSecond: 160000, videoKeyFrameIntervalCount: 60 });
    let bytes = 0, pending = Promise.resolve();
    rec.ondataavailable = (e) => {
      if (!e.data || !e.data.size) return;
      bytes += e.data.size;
      pending = pending.then(() => e.data.arrayBuffer()).then((buf) => {
        const u = new Uint8Array(buf); let s = '';
        for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
        return window.mp4Chunk(btoa(s));
      });
    };
    rec.onstop = () => { pending.then(() => { window.mp4Say('recorded ' + (bytes / 1048576).toFixed(1) + ' MB as ' + type); done(); }); };
    window.mp4Say('pass 2: audio ' + track.duration.toFixed(1) + ' s, recorder ' + type);
    await ac.resume();
    window.mp4Say('pass 2: audio running ' + ac.state);
    const T = ac.currentTime + 0.5;
    for (let k = 0; k * step < LEN; k++) {
      const src = ac.createBufferSource(); src.buffer = track;
      const gn = ac.createGain(); src.connect(gn); gn.connect(master);
      const at = T + k * step;
      if (k > 0) { gn.gain.setValueAtTime(0, at); gn.gain.linearRampToValueAtTime(1, at + XF); }
      if ((k + 1) * step < LEN) { gn.gain.setValueAtTime(1, at + step); gn.gain.linearRampToValueAtTime(0, at + L); }
      src.start(at);
    }
    master.gain.setValueAtTime(0.9, T); master.gain.setValueAtTime(0.9, T + LEN - END); master.gain.linearRampToValueAtTime(0, T + LEN);
    rec.start(1000);
    // frames on the audio clock: frame i goes up at T + i / FPS
    let i = 0, said = 0, prev = null;
    if (DBG) setInterval(() => { const d = g.getImageData(0, 0, 1920, 1080).data; let mn = 255; for (let k = 0; k < d.length; k += 400) mn = Math.min(mn, d[k]); window.mp4Say('dbg i=' + i + ' now=' + (ac.currentTime - T).toFixed(2) + ' ahead=' + ahead.size + ' canvas min=' + mn); }, 1000);
    const tick = async () => { try {
      const now = ac.currentTime;
      if (now >= T + i / FPS) {
        // never behind the frame just drawn: (now - T) * FPS can land a hair under i
        const due = Math.max(i, Math.min(N - 1, Math.floor((now - T) * FPS + 1e-6)));
        for (let j = i; j < due; j++) { ahead.delete(j); }    // late: skip to the frame that is due
        i = due;
        // The previous frame's bitmap is released only now: a canvas paints
        // lazily, and closing a bitmap straight after drawImage left every
        // recorded frame as the first one.
        const bmp = await ahead.get(i); put(bmp); ahead.delete(i);
        if (prev && prev.close) prev.close(); prev = bmp;
        vtrack.requestFrame();
        for (let j = i + 1; j < i + 90; j++) want(j);
        i++;
        if (i / FPS - said >= 30) { said = i / FPS; window.mp4Say('  ' + Math.round(said) + ' s'); }
        if (i >= N) { setTimeout(() => rec.stop(), 300); return; }
      }
      setTimeout(tick, 4);
    } catch (e) { window.mp4Say('tick failed: ' + (e && e.message || e)); fail(e); } };
    tick();
  } catch (e) { fail(e); }
}), [N, FPS, 'http://127.0.0.1:' + port, !!process.env.DBG, VERT]);
await b.close(); server.close();
if (!process.env.FRAMES) rmSync(dir, { recursive: true, force: true });

const FRAG = OUT.replace(/\.mp4$/, '-fragmented.mp4');
renameSync(OUT, FRAG);
const r = spawnSync(process.execPath, [new URL('./flatten.mjs', import.meta.url).pathname, FRAG, OUT], { encoding: 'utf8' });
if (r.status !== 0 || !existsSync(OUT)) { console.log('flatten failed: ' + (r.stderr || r.stdout)); process.exit(1); }
rmSync(FRAG);
console.log((r.stdout || '').trim());
console.log('wrote ' + OUT + ' (' + (statSync(OUT).size / 1048576).toFixed(1) + ' MB)');
