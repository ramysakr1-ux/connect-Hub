import { call } from './st.mjs';
/* WHAT A CANDIDATE ACTUALLY HAS ON THE CARD: pages, audio, video. A stage that
   says "play track 3.5" with no audio attached is the same fault as a stage
   that names an unattached page -- the trainee is told to use something they
   have not got. */
const TRACK = /\btrack\s*(\d+\.\d+)|\b(\d\.\d{1,2})\b(?=\s*(?:,|\.|and|$|\)))/gi;
const VIDEO = /\bvideo\b|Caf[ée] Hub|Street Interviews|BBC|DVD/i;
const r = await call({ op:'course', key:'5fade4f069614afd9b6e5a3a' });
const L = (((r.result && (r.result.records || r.result)) || {}).tppoints || {}).set.library;
const NAME = { s1:'Language Hub El (A2)', s2:'Roadmap A2+ (B1 pre)', s3:'Straightforward UI (B2)', s4:'Speakout A1 (A1)' };
let T = { slots:0, pages:0, withAudio:0, needAudio:0, needVideo:0, hasVideo:0 };
for (const id of ['s4','s1','s2','s3']) {
  let slots=0, pages=0, withAudio=0, needAudio=0, needVideo=0, hasVideo=0;
  const missing = [];
  Object.keys(L[id].sessions).sort().forEach(x => L[id].sessions[x].slots.forEach((sl,i) => {
    slots++; pages += (sl.files||[]).length;
    const audioAttached = !!(sl.tracks && String(sl.tracks).trim()) ||
      (sl.files||[]).some(f => /audio|\.mp3/i.test(String(f.name)));
    const videoAttached = (sl.files||[]).some(f => /video|\.mp4/i.test(String(f.name)));
    const blob = [sl.pages, ...(sl.stages||[]).map(s => `${s.todo||''} ${s.avoid||''}`)].join(' ');
    const wantsAudio = /\btrack\b|\baudio\b|\blisten again\b|\bplay (?:it|the)\b/i.test(blob);
    const wantsVideo = VIDEO.test(blob);
    if (audioAttached) withAudio++;
    if (videoAttached) hasVideo++;
    if (wantsAudio && !audioAttached) { needAudio++; missing.push(`${x}·${i+1} [${sl.type}] audio`); }
    if (wantsVideo && !videoAttached) { needVideo++; missing.push(`${x}·${i+1} [${sl.type}] VIDEO`); }
  }));
  console.log(`${NAME[id].padEnd(24)} ${slots} slots · ${pages} page scans · audio attached on ${withAudio} · video on ${hasVideo}`);
  console.log(`${' '.repeat(24)} asks for audio it hasn't got: ${needAudio} · asks for video it hasn't got: ${needVideo}`);
  if (missing.length) console.log('    ' + missing.join(', '));
  T.slots+=slots; T.pages+=pages; T.withAudio+=withAudio; T.needAudio+=needAudio; T.needVideo+=needVideo; T.hasVideo+=hasVideo;
}
console.log(`\nTOTAL ${T.slots} slots · ${T.pages} pages · audio on ${T.withAudio} · video on ${T.hasVideo}`);
console.log(`      ${T.needAudio} slots play audio that is not attached · ${T.needVideo} need video that is not attached`);
