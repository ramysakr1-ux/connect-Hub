/**
 * Teach a course's criteria suggester from the points already tagged on it.
 *
 *   node learn-from-course.mjs <tutor key>            what it would learn
 *   node learn-from-course.mjs <tutor key> --write    write it to the course
 *
 * The suggester normally learns at the moment a tutor clicks Return. A course
 * whose feedback was written before the feature existed — or tagged in bulk,
 * as the demo course was — has the evidence sitting in its records and nothing
 * that ever looked at it. This walks those records once and builds the same
 * model the screen would have built.
 *
 * The counter-examples are reconstructed, not remembered: for each tagged
 * point it asks what the criteria WORDING alone would have offered, and treats
 * anything the tutor did not keep as a suggestion turned down. That is what
 * the tutor was in fact looking at, and it is what teaches the model that
 * "aims are stated in the learners' terms" is 4a and not the 4n the wording
 * reaches for.
 *
 * It refuses a course that already has a model, the same way the store's own
 * seeding does: this can only ever start one, never overwrite one.
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdtempSync, copyFileSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { tmpdir } from 'node:os';

const KEY = process.argv[2];
const WRITE = process.argv.includes('--write');
if (!KEY || KEY.startsWith('--')) { console.log('usage: node learn-from-course.mjs <tutor key> [--write]'); process.exit(1); }

const HERE = new URL('.', import.meta.url).pathname;
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const call = async b => {
  for (let i = 0; i < 6; i++) {
    const r = await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(b) });
    const t = await r.text();
    try { return JSON.parse(t); } catch (e) { await new Promise(res => setTimeout(res, 4000)); }
  }
  return { ok: false, error: 'no JSON after 6 tries' };
};

const course = await call({ op: 'course', key: KEY });
if (!course.ok) { console.log('could not read the course: ' + course.error); process.exit(1); }
const already = (course.result || {}).critLearn;
if (already && Number(already.n) > 0) {
  console.log('this course has already learned from ' + already.n + ' tagged points — leaving it alone');
  process.exit(0);
}
const roster = await call({ op: 'roster', key: KEY });
if (!roster.ok) { console.log('could not read the roster: ' + roster.error); process.exit(1); }
const people = Object.values(roster.result.trainees || {}).sort((a, b) => a.name.localeCompare(b.name));

/* Every tagged point on the course, with the list it came from — the list is
   what says whether it is a planning point or a teaching one, and the two draw
   on different halves of the criteria. */
const SCOPE = { lSP: 'planning', lAP: 'planning', lST: 'teaching', lAT: 'teaching' };
const tagsOf = html => [...String(html || '').matchAll(/class="tag"[^>]*data-c="([0-9][a-n])"/g)].map(m => m[1]);
const textOf = html => String(html || '').replace(/<span class="tag"[\s\S]*?<\/span>/g, ' ').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

const points = [];
for (const who of people) {
  const rec = who.records || {};
  for (const entry of [rec.feedback, ...Object.values(rec.tpHistory || {})]) {
    if (!entry || !entry.state || !entry.state.lists) continue;
    for (const [id, rows] of Object.entries(entry.state.lists)) {
      const scope = SCOPE[id]; if (!scope) continue;
      for (const row of rows || []) {
        const codes = tagsOf(row.html), text = textOf(row.html);
        if (!codes.length || !text) continue;
        points.push({ scope, text, codes });
      }
    }
  }
}
console.log(points.length + ' tagged points on the course, from ' + people.length + ' candidates');
if (!points.length) { console.log('nothing to learn from'); process.exit(0); }

/* The page's own tokeniser, wording rule and model, rather than a second copy
   of any of them here. */
const dir = mkdtempSync(join(tmpdir(), 'learn-'));
for (const f of readdirSync(HERE).filter(f => /\.(html|js|css)$/.test(f))) copyFileSync(join(HERE, f), join(dir, f));
writeFileSync(join(dir, 'hub-store.js'), `window.HubStore={url:'x',token:function(){return '';},key:function(){return 'k';},assessorKey:function(){return '';},isTutor:function(){return true;},isAssessor:function(){return false;},isTrainee:function(){return false;},call:function(){return Promise.resolve({});},boot:function(){return Promise.resolve({});},me:function(){return Promise.resolve({});},get:function(){return Promise.resolve(null);},put:function(){return Promise.resolve({});},course:function(){return Promise.resolve({settings:{},wording:null,critLearn:null});},putCourse:function(){return Promise.resolve({saved:true});},seedCritLearn:function(){return Promise.resolve({seeded:false});},roster:function(){return Promise.resolve({});},withAccess:function(f){return f;}};`);
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = createServer((rq, rs) => {
  const name = decodeURIComponent((rq.url || '/').split('?')[0]).replace(/^\/+/, '') || 'index.html';
  let body; try { body = readFileSync(join(dir, name)); } catch { rs.writeHead(404); return rs.end('no'); }
  rs.writeHead(200, { 'Content-Type': TYPES[extname(name)] || 'application/octet-stream' }); rs.end(body);
});
await new Promise(r => server.listen(0, r));
const browser = await chromium.launch();
const ctx = await browser.newContext();
await ctx.addInitScript(() => { try { localStorage.setItem('hub:k', 'k'); localStorage.removeItem('chub:critlearn'); } catch (e) {} });
const page = await ctx.newPage();
await page.goto(`http://127.0.0.1:${server.address().port}/3_tutor_feedback.html?k=k`);
await page.waitForTimeout(2500);

const built = await page.evaluate(pts => {
  const learn = window.HubCritLearn;
  const words = eval('critWords'), wording = eval('wordingScores');
  let m = null;
  pts.forEach(p => {
    /* What the wording alone would have put in front of the tutor: up to
       three, by the screen's own floors. */
    const scored = Object.keys(wording(p.text, p.scope)).map(c => ({ c, s: wording(p.text, p.scope)[c] })).sort((a, b) => b.s - a.s);
    const MIN = Math.log(eval('CRITERIA').length / 6);
    const floor = scored.length ? Math.max(scored[0].s * 0.55, MIN) : 0;
    const offered = scored.filter(x => x.s >= floor).slice(0, 3).map(x => x.c);
    m = learn.observe(m, [{ words: words(p.text), codes: p.codes, suggested: offered }]);
  });
  const top = Object.keys(m.codes).map(c => ({ code: c, n: m.codes[c].n, turned: m.codes[c].noN || 0 }))
    .sort((a, b) => (b.n - a.n) || (b.turned - a.turned));
  return { model: m, size: learn.size(m), top };
}, points);
await browser.close(); server.close();

console.log('\nlearned from ' + built.model.n + ' points, ' + built.size + ' characters');
console.log('\n  code   tagged   turned down');
built.top.forEach(t => console.log('  ' + t.code.padEnd(6) + String(t.n).padStart(5) + String(t.turned).padStart(13)));

if (!WRITE) { console.log('\n(dry run — nothing written; add --write)'); process.exit(0); }
const out = await call({ op: 'putCourse', key: KEY, kind: 'critLearn', data: built.model });
console.log(out.ok ? '\nwritten to the course' : '\nWRITE FAILED: ' + out.error);
process.exit(out.ok ? 0 : 1);
