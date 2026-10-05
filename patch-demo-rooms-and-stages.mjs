/**
 * Connect Lite — a patch, not a reseed, for the two standing demos.
 *
 *   node patch-demo-rooms-and-stages.mjs [--write]
 *
 * Three things Ramy found on the before-the-visit demo (30 Sep 2026):
 *   1. A third online room, "Feedback and tutorials" — feedback and tutorials
 *      happen in the teaching practice room, so the room goes.
 *   2. Stage 1 said 3 hours taught. Stage 1 is written after TP2, so it is
 *      1.5, on both demos; Stage 2, after TP4, is 3.
 *   3. The Stage 1 strengths and action plan ran as prose. They are the
 *      tutor's points from the feedback, so they read as bullets with the
 *      criterion each one was tagged against.
 *
 * Why a patch. Re-running the seed would re-mint every volunteer's link, and
 * those links have been sent. This touches only the three things above, reads
 * each record back afterwards, and refuses any course that is not c6 or c7.
 */
import { readFileSync } from 'node:fs';

const HERE = new URL('.', import.meta.url).pathname;
const WRITE = process.argv.includes('--write');
const STORE = (readFileSync(HERE + 'hub-store.js', 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const OWNER = readFileSync(HERE + '.owner-key', 'utf8').trim();
const DEMOS = ['c6', 'c7'];

const call = async (b, tries = 6) => {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await (await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) })).json();
      if (r && (r.ok || r.error)) return r;
    } catch (e) {}
    await new Promise(res => setTimeout(res, 2500));
  }
  throw new Error('the store would not answer ' + b.op);
};

/* A short read is a failed read: settings come back twice and must agree
   before anything is written over them. */
async function settingsTwice(key) {
  const a = await call({ op: 'course', key });
  await new Promise(r => setTimeout(r, 1200));
  const b = await call({ op: 'course', key });
  const sa = (a.result || {}).settings, sb = (b.result || {}).settings;
  if (!sa || !sb) throw new Error('no settings came back');
  if (JSON.stringify(sa) !== JSON.stringify(sb)) throw new Error('two reads of the settings disagreed — not writing');
  return sa;
}

const { CANDIDATES } = await import(HERE + 'demo-finished-data.mjs').catch(() => ({ CANDIDATES: null }));

const bullets = (pairs) => pairs.slice(0, 2).map(([code, text]) => '• ' + text + ' (' + code + ')').join('\n');

for (const id of DEMOS) {
  const list = (await call({ op: 'ownerCourses', owner: OWNER })).result.courses;
  const course = list.find(c => c.id === id);
  if (!course) { console.log(id + ': not in the store'); continue; }
  if (!/^Demo — /.test(course.name)) { console.log(id + ' is "' + course.name + '", which is not a demo — skipped'); continue; }
  console.log('\n' + id + ' — ' + course.name);
  const KEY = course.tutorKey;

  /* 1. the rooms */
  const settings = await settingsTwice(KEY);
  const rooms = (settings.onlineRooms || []).filter(r => r && !/feedback and tutorials/i.test(r.label || ''));
  if (rooms.length !== (settings.onlineRooms || []).length) {
    console.log('  rooms: ' + (settings.onlineRooms || []).map(r => r.label).join(', ') + '  ->  ' + rooms.map(r => r.label).join(', '));
    if (WRITE) {
      settings.onlineRooms = rooms;
      const w = await call({ op: 'putCourse', key: KEY, kind: 'settings', data: settings });
      if (!w.ok) throw new Error('settings write refused: ' + w.error);
      const back = await settingsTwice(KEY);
      console.log('  read back: ' + (back.onlineRooms || []).map(r => r.label).join(', '));
    }
  } else console.log('  rooms: already two');

  /* 2 and 3. every trainee's tutor half of the CELTA 5 */
  const roster = await call({ op: 'roster', key: KEY });
  const people = Object.values(roster.result.trainees || {}).filter(Boolean);
  for (const p of people) {
    const got = await call({ op: 'get', key: KEY, token: p.token, kind: 'celta5t' });
    const T = (got.result && got.result.data) || got.result || null;
    if (!T || (!T.stage1 && !T.stage2)) { console.log('  ' + p.name + ': no tutor record yet'); continue; }
    const before = JSON.stringify(T);
    if (T.stage1) {
      T.stage1.hoursTaught = '1.5';
      const cand = CANDIDATES && CANDIDATES.find(c => c.name === p.name);
      if (cand && cand.teachS && cand.teachA) {
        T.stage1.strengths = bullets(cand.teachS);
        T.stage1.actionPlan = bullets(cand.teachA);
      }
    }
    if (T.stage2) T.stage2.hoursTaught = '3';
    if (JSON.stringify(T) === before) { console.log('  ' + p.name + ': already right'); continue; }
    console.log('  ' + p.name + ': stage 1 ' + (T.stage1 ? T.stage1.hoursTaught + 'h' : '—') + ', stage 2 ' + (T.stage2 ? T.stage2.hoursTaught + 'h' : '—') + (T.stage1 && /•/.test(T.stage1.strengths || '') ? ', bulleted' : ''));
    if (WRITE) {
      const w = await call({ op: 'put', key: KEY, token: p.token, kind: 'celta5t', data: T });
      if (!w.ok) throw new Error('write refused for ' + p.name + ': ' + w.error);
      const check = await call({ op: 'get', key: KEY, token: p.token, kind: 'celta5t' });
      const C2 = (check.result && check.result.data) || check.result || {};
      const ok = (!T.stage1 || C2.stage1 && C2.stage1.hoursTaught === '1.5') && (!T.stage2 || C2.stage2 && C2.stage2.hoursTaught === '3');
      console.log('    read back: ' + (ok ? 'right' : 'WRONG — ' + JSON.stringify((C2.stage1 || {}).hoursTaught) + ' / ' + JSON.stringify((C2.stage2 || {}).hoursTaught)));
    }
  }
}
console.log(WRITE ? '\nwritten.' : '\ndry run — nothing written. Add --write.');
