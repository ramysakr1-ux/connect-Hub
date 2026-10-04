import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { call } from './st.mjs';
const KEY = '5fade4f069614afd9b6e5a3a';
const D = '/Users/work/Library/CloudStorage/GoogleDrive-ramysakr1@gmail.com/My Drive/Course books';
const DIR = {
  s1: `${D}/Elementary/Language Hub/Language_Hub_Elementary_Class_Audio_www.frenglish.ru`,
  s2: `${D}/Pre-Intermediate /Roadmap A2+/Roadmap_A2P_SB_audio`,
  s3: `${D}/Upper- Intermediate /Straightforward/Audio files/05 Upper-Intermediate`,
  s4: `${D}/Beginner/Speakout 3rd ed A1/Class_Audio`,
};
const TITLE = { s1:'Language Hub Elementary', s2:'Roadmap A2+', s3:'Straightforward Upper-Intermediate', s4:'Speakout A1' };
const VLC = '/Applications/VLC.app/Contents/MacOS/VLC';
const plan = JSON.parse(fs.readFileSync('tracks-plan.json', 'utf8'));
const CACHE = 'track-urls.json';
const done = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
const r0 = await call({ op:'roster', key: KEY });
const token = (((r0.result || {}).trainees) || [])[0].token;

for (const [k, rows] of Object.entries(plan)) {
  const [id] = k.split('|');
  for (const row of rows) {
    const key = `${id}|${row.track}`;
    if (done[key] || !row.file) continue;
    let src = path.join(DIR[id], row.file);
    /* Straightforward ships .wma, which no browser plays. Transcode on the way
       through rather than attaching something that will not open. */
    if (src.endsWith('.wma')) {
      const tmp = `/tmp/tr-${id}-${row.track}.mp3`;
      execFileSync(VLC, ['-I', 'dummy', '--no-sout-video', src, '--sout',
        `#transcode{acodec=mp3,ab=96,channels=2,samplerate=44100}:standard{access=file,mux=raw,dst=${tmp}}`,
        'vlc://quit'], { stdio: 'ignore' });
      src = tmp;
    }
    const buf = fs.readFileSync(src);
    const res = await call({ op:'putMaterial', key: KEY, token,
      name: `${TITLE[id]} — track ${row.track}.mp3`, type:'audio/mpeg',
      bytes: buf.toString('base64') }, 3);
    if (!res.ok) { console.log(`  ${key}: FAILED ${res.error}`); continue; }
    done[key] = (res.result && (res.result.url || res.result.link)) || res.url;
    fs.writeFileSync(CACHE, JSON.stringify(done, null, 1));
    console.log(`  ${key}  ${(buf.length/1048576).toFixed(1)} MB`);
  }
}
console.log(`\n${Object.keys(done).length} tracks in Drive`);
