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
 *
 * Music goes in here, not in the take: Playwright records picture only, so a
 * take is silent however the page sounds. Pass a track as the second argument,
 * or leave film/music.mp3 where it is and it is found. It fades in, it pauses
 * with the recorder so the cuts do not jump in the music, and it fades out
 * over the last seconds.
 */
import { readFileSync, statSync, appendFileSync, rmSync, renameSync, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { spawnSync } from 'node:child_process';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

const FILE = process.argv[2];
if (!FILE) { console.log('name a take: node film/cut.mjs film/takes/<file>.webm [music.mp3]'); process.exit(1); }
const HERE_DIR = new URL('.', import.meta.url).pathname;
const MUSIC = process.argv[3] || (existsSync(join(HERE_DIR, 'music.mp3')) ? join(HERE_DIR, 'music.mp3') : null);
/* WHERE IN THE TRACK TO START. Ramy, 5 Oct 2026: "the music should get intense
   with the scene." A track's build is a region, not a frame, so the way to put
   a swell under the right shot is to slide the track, not to re-time the film.
   Measured per second, the documentary track is sparse for twenty seconds,
   climbs, and peaks at 0:63 -- so a 62-second trailer started three seconds in
   hits its loudest moment on the last card. */
const MUSIC_FROM = Number(process.argv[4] || 0);
const OUT = FILE.replace(/\.webm$/, '-cut.webm');
if (existsSync(OUT)) rmSync(OUT);

const server = createServer((rq, rs) => {
  const music = MUSIC && /music/.test(rq.url || '');
  const f = music ? MUSIC : FILE;
  rs.writeHead(200, { 'Content-Type': music ? 'audio/mpeg' : 'video/webm', 'Content-Length': statSync(f).size, 'Access-Control-Allow-Origin': '*' });
  rs.end(readFileSync(f));
});
await new Promise(r => server.listen(0, r));
const port = server.address().port;

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 400, height: 300 } })).newPage();
await page.exposeFunction('cutChunk', (b64) => { appendFileSync(OUT, Buffer.from(b64, 'base64')); });
await page.exposeFunction('cutSay', (s) => console.log(s));

await page.setContent(`<body style="margin:0;background:#111;color:#ccc;font:12px system-ui">
<video id="v" crossorigin="anonymous" muted style="width:200px" src="http://127.0.0.1:${port}/take.webm"></video>
${MUSIC ? `<audio id="m" crossorigin="anonymous" loop src="http://127.0.0.1:${port}/music.mp3"></audio>
<script>window.__MUSIC_FROM = ${MUSIC_FROM};</script>` : ''}
<canvas id="probe" width="8" height="8" style="display:none"></canvas>
<p id="p">…</p></body>`);
await page.waitForFunction(() => { const v = document.getElementById('v'); return v.readyState >= 2 && isFinite(v.duration); }, null, { timeout: 120000 });
const dur = await page.evaluate(() => document.getElementById('v').duration);
console.log('take ' + Math.floor(dur / 60) + ':' + String(Math.round(dur % 60)).padStart(2, '0') + ' — cutting the curtains out');

console.log(MUSIC ? 'music: ' + MUSIC.split('/').pop() + (MUSIC_FROM ? ' from ' + MUSIC_FROM + 's' : '') : 'no music track — the cut will be silent');
await page.evaluate(({ dur }) => new Promise((done) => {
  const v = document.getElementById('v');
  const pr = document.getElementById('probe'), pg = pr.getContext('2d');
  /* VP8, not VP9: the only ffmpeg on this machine is the one Playwright ships,
     and it can copy a VP8 stream into a fresh container (which is what gives
     the cut a duration and a seek index) but not a VP9 one. */
  const types = ['video/webm;codecs=vp8,opus', 'video/webm;codecs=vp8', 'video/webm'];
  const type = types.find(t => MediaRecorder.isTypeSupported(t));
  /* The video's OWN stream, not a canvas. Drawing each frame to a canvas and
     re-encoding that cost a third of the colour: measured against the live
     page, saturation fell from 12.2 to 8.1 and the picture lifted eight points
     brighter -- the wash Ramy saw on the first cut (30 Sep 2026). Taking the
     decoded frames straight from the element skips the round trip through
     canvas RGB, and the cut now measures like the take. The canvas below is
     eight pixels wide and only looks for the curtain's cue. */
  /* The music is mixed in here, on its own track. It plays while the recorder
     does and pauses when the recorder pauses, so a curtain taken out of the
     picture takes nothing out of the music: the track runs continuously
     through the finished film. Two fades, in at the start and out at the end,
     done on the gain node rather than the element's volume so they are smooth. */
  const m = document.getElementById('m');
  const FROM = window.__MUSIC_FROM || 0;
  const stream = v.captureStream(25);
  let gain = null, ac = null;
  if (m) {
    ac = new AudioContext();
    const dest = ac.createMediaStreamDestination();
    gain = ac.createGain(); gain.gain.value = 0;
    ac.createMediaElementSource(m).connect(gain).connect(dest);
    stream.addTrack(dest.stream.getAudioTracks()[0]);
  }
  /* 25 frames a second and a calmer bitrate. The first cut came out at 50fps
     and 4.4 Mbps -- 236 MB for seven minutes -- and it stalled after the first
     scenes on an ordinary machine (Ramy, 1 Oct 2026: "the film is freezing, I
     couldn't play it"). Nothing in a film of screens moves fast enough to need
     50, and the cut is a third of the size at 25. */
  const rec = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 2200000 });
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
    if (v.ended) { try { if (rec.state === 'paused') rec.resume(); } catch (e) {} if (m) m.pause(); rec.stop(); return; }
    /* Fade out over the last four seconds of the take. */
    if (gain && dur - v.currentTime < 4) gain.gain.setTargetAtTime(0, ac.currentTime, 1.1);
    /* The curtain's mark: six magenta pixels in the very corner. */
    pg.drawImage(v, 0, 0, 8, 8, 0, 0, 8, 8);
    const d = pg.getImageData(1, 1, 1, 1).data;
    const curtain = d[0] > 190 && d[1] < 90 && d[2] > 190;
    if (curtain && !paused) { try { rec.pause(); } catch (e) {} if (m) m.pause(); paused = true; }
    else if (!curtain && paused) { try { rec.resume(); } catch (e) {} if (m) m.play().catch(() => {}); paused = false; }
    const dt = Math.max(0, v.currentTime - lastT); lastT = v.currentTime;
    if (paused) dropped += dt; else kept += dt;
    if (++frames % 900 === 0) document.getElementById('p').textContent = Math.round(v.currentTime) + 's';
    requestAnimationFrame(draw);
  };
  v.play().then(() => {
    if (m && ac) { ac.resume(); try { m.currentTime = FROM; } catch (e) {} m.play().catch(() => {}); gain.gain.setTargetAtTime(0.22, ac.currentTime, 0.9); }
    requestAnimationFrame(draw);
  });
}), { dur });

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
