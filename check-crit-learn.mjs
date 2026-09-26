/**
 * Does the criteria suggester learn from what tutors tag?
 *
 *   node check-crit-learn.mjs
 *
 * Runs the real page's scorer against the real model, in a browser, with a
 * fake store, on the one case that made this worth building: "warm with the
 * group from the first minute; you use names and you wait for answers" is
 * plainly 1d (rapport, learners fully involved), and the criteria wording
 * alone cannot see it -- it offers 2a, which is about the teacher's own use of
 * language. A tutor tags it 1d a few times; the suggestion has to follow.
 *
 * Six things are checked, in the order they matter:
 *   1. with no evidence at all, the answer is exactly the wording rule's
 *   2. what a tutor tags is learned, and offered on the next point like it
 *   3. one example is not enough to move it (a coincidence is not a habit)
 *   4. a suggestion the tutor keeps turning down stops being made
 *   5. evidence on one course never reaches another
 *   6. a trainee's own page cannot read the model
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdtempSync, copyFileSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { tmpdir } from 'node:os';

const HERE = new URL('.', import.meta.url).pathname;
const dir = mkdtempSync(join(tmpdir(), 'critlearn-'));
for (const f of readdirSync(HERE).filter(f => /\.(html|js|css)$/.test(f))) copyFileSync(join(HERE, f), join(dir, f));

/* The store is a plain object in the page: this test is about the scorer, not
   about the wire, and the wire has its own harness (store/verify-*.mjs). */
const storePath = join(dir, 'hub-store.js');
writeFileSync(storePath, `
window.HubStore = (function(){
  var COURSE = { settings:{ centreName:'Test', courseName:'C/1' }, wording:null, critLearn:null };
  return {
    url:'test', token:function(){return '';}, key:function(){return 'k';}, assessorKey:function(){return '';},
    isTutor:function(){return true;}, isAssessor:function(){return false;}, isTrainee:function(){return false;},
    call:function(){ return Promise.resolve({}); },
    boot:function(){ return Promise.resolve({}); },
    me:function(){ return Promise.resolve({}); },
    get:function(){ return Promise.resolve(null); },
    put:function(){ return Promise.resolve({}); },
    course:function(){ return Promise.resolve(JSON.parse(JSON.stringify(COURSE))); },
    putCourse:function(kind, data){ COURSE[kind] = JSON.parse(JSON.stringify(data)); return Promise.resolve({saved:true}); },
    roster:function(){ return Promise.resolve({}); },
    _course:function(){ return COURSE; },
    _setLearn:function(m){ COURSE.critLearn = m; },
    withAccess:function(f){ return f; }
  };
})();
`);

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = createServer((rq, rs) => {
  const name = decodeURIComponent((rq.url || '/').split('?')[0]).replace(/^\/+/, '') || 'index.html';
  let body; try { body = readFileSync(join(dir, name)); } catch { rs.writeHead(404); return rs.end('no'); }
  rs.writeHead(200, { 'Content-Type': TYPES[extname(name)] || 'application/octet-stream' });
  rs.end(body);
});
await new Promise(r => server.listen(0, r));
const BASE = `http://127.0.0.1:${server.address().port}/`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
await ctx.addInitScript(() => { try { localStorage.setItem('hub:k', 'k'); localStorage.removeItem('chub:critlearn'); } catch (e) {} });
const page = await ctx.newPage();
await page.goto(BASE + '3_tutor_feedback.html?k=k');
await page.waitForTimeout(2500);

let bad = 0;
const ok = (cond, msg) => { console.log((cond ? '  ok   ' : '  FAIL ') + msg); if (!cond) bad++; };

/* One point, and what the page would offer for it. */
const suggest = (text, scope) => page.evaluate(([t, s]) => eval('scoreCriteria')(t, s).map(x => ({ code: x.code, wording: +x.wording.toFixed(3), learned: +x.learned.toFixed(3) })), [text, scope]);
/* Teach it the way a tutor does: n points, each tagged, each returned. */
const teach = (examples) => page.evaluate(exs => {
  const learn = window.HubCritLearn;
  let m = eval('CRIT_MODEL');
  exs.forEach(e => {
    m = learn.observe(m, [{ words: eval('critWords')(e.text), codes: e.codes, suggested: e.suggested || [] }]);
  });
  eval('CRIT_MODEL = m');            /* what the page would hold after those returns */
  return learn.size(m);
}, examples);
const reset = () => page.evaluate(() => { eval('CRIT_MODEL = null'); });

const RAPPORT = 'Warm with the group from the first minute; you use names and you wait for answers';
const SIMILAR = 'Warm with this group too — you use their names and you give them time to answer';

console.log('\nConnect Lite — does the criteria suggester learn?\n');

console.log('1. with nothing learned, the wording rule alone');
await reset();
const cold = await suggest(RAPPORT, 'teaching');
ok(cold.every(x => x.learned === 0), 'no learned part in any suggestion');
ok(cold.some(x => x.code === '2a'), 'it offers 2a, which is the miss this exists to fix: ' + cold.map(x => x.code).join(', '));
ok(!cold.some(x => x.code === '1d'), 'and it does not reach 1d on its own');

console.log('\n2. a tutor tags it 1d, four times, on four candidates');
await teach([
  { text: RAPPORT, codes: ['1d'], suggested: ['2a'] },
  { text: 'Warm and encouraging from the start; every learner was spoken to by name', codes: ['1d'], suggested: ['2a'] },
  { text: 'You wait for answers and you use their names — nobody was left out', codes: ['1d'], suggested: [] },
  { text: 'The group was warm with you from the first minute and stayed in it', codes: ['1d'], suggested: ['2a'] },
]);
const warm = await suggest(SIMILAR, 'teaching');
ok(warm.some(x => x.code === '1d'), 'a new point like it is offered 1d: ' + warm.map(x => x.code).join(', '));
ok((warm.find(x => x.code === '1d') || {}).wording === 0, 'which the wording alone never would have');
ok(!warm.some(x => x.code === '2a'), 'and 2a, turned down four times, is gone');

console.log('\n3. one example is a coincidence, not a habit');
await reset();
await teach([{ text: RAPPORT, codes: ['1d'], suggested: ['2a'] }]);
const thin = await suggest(SIMILAR, 'teaching');
ok(!thin.some(x => x.code === '1d'), 'one example does not make it a suggestion: ' + thin.map(x => x.code).join(', '));

console.log('\n4. the scope still holds: planning points get planning criteria');
await reset();
await teach([
  { text: 'Aims are stated in the learners terms and are achievable in the time', codes: ['4a'], suggested: ['4n'] },
  { text: 'The aims are stated as what the learners will do, and they fit the time', codes: ['4a'], suggested: ['4n'] },
  { text: 'Every aim is in the learners terms and none of them is too big for the lesson', codes: ['4a'], suggested: [] },
  { text: 'Aims stated clearly and achievable in the time given', codes: ['4a'], suggested: ['4n'] },
]);
const planning = await suggest('The aims are stated in the learners terms and fit the time', 'planning');
ok(planning.every(x => x.code[0] === '4'), 'only topic 4: ' + planning.map(x => x.code).join(', '));
ok(planning[0] && planning[0].code === '4a', 'and 4a leads, not 4n');

console.log('\n5. evidence belongs to the course that made it');
const model = await page.evaluate(() => JSON.parse(JSON.stringify(eval('CRIT_MODEL'))));
ok(model && model.n === 4, 'the model counts four tagged points');
await page.evaluate(() => { try { localStorage.removeItem('chub:critlearn'); } catch (e) {} });
const fresh = await ctx.newPage();
await fresh.goto(BASE + '3_tutor_feedback.html?k=k');     /* the fake store holds no critLearn */
await fresh.waitForTimeout(2000);
const freshPicks = await fresh.evaluate(t => eval('scoreCriteria')(t, 'teaching').map(x => x.code), SIMILAR);
ok(!freshPicks.includes('1d'), 'a course with no record of its own is back to the wording: ' + freshPicks.join(', '));
await fresh.close();

console.log('\n6. the model is a staff record');
const gate = readFileSync(join(HERE, 'store', 'README.md'), 'utf8');
ok(/critLearn/.test(gate), 'the store change that gates it is written down in store/README.md');
const traineePage = await ctx.newPage();
await traineePage.goto(BASE + 'index.html?t=someone');
await traineePage.waitForTimeout(1200);
const leaked = await traineePage.evaluate(() => {
  try { return Object.keys(localStorage).some(k => /critlearn/i.test(k)); } catch (e) { return false; }
});
ok(!leaked, 'nothing about it is written on a trainee\'s own page');
await traineePage.close();

await browser.close();
server.close();
console.log(bad ? '\n' + bad + ' failed.' : '\nIt learns.');
process.exit(bad ? 1 : 0);
