/**
 * Connect Lite — every screen, every role, WITH A COURSE ON IT.
 *
 *   npm run check:data                      every screen, every role, with data
 *   npm run check:doors                     every link off each role's landing screen
 *   SHOTS=1 node walk-with-data.mjs         and keep a picture of each screen in _walk-shots/
 *   SHOTS=1 VIEW=1 ...                      the picture is the viewport at the foot of the page
 *   SHOTS=1 VIEW=top ...                    ...or at the top
 *   ONLY='tutor · 3_' ...                   just the screens matching (a regexp on "role · file")
 *   PORT=8124 ...                           another port, to run two at once
 *
 * Neither needs the owner key: nothing here talks to the store.
 *
 * WHY THIS EXISTS. check-screens.mjs opens all 33 screens in all four rooms
 * and reports "nothing screamed" — and it was saying that on 6 Oct 2026 while
 * Ramy, walking the product himself, hit something broken on nearly every
 * screen he opened. Both were true. check-screens neutralises the store, so
 * every page it has ever seen was in its no-data state: it proves a page does
 * not crash when it knows nothing, which is not the state anybody uses.
 *
 * walk-roles.mjs and walk-cohort.mjs do test with data, but they drive the
 * real store and need the owner key, so they cannot run anywhere the key is
 * not — which is most places, including a fresh clone and this container.
 *
 * This fills the gap: the store stays dead, and a whole course is written
 * straight into localStorage in the shape hub-sync leaves it. Every screen
 * then renders as it does on a real course, and the checks are the ones a
 * person would make by looking.
 *
 * WHAT IT LOOKS FOR, beyond "did it throw":
 *   - the screen rendered something, rather than an empty shell
 *   - nothing runs off the right edge at phone width
 *   - no fixed or sticky thing covers a button
 *   - no door is a dead end: a link that looks clickable and goes nowhere
 *   - a disabled control that gives no reason for being disabled
 *
 * THE STORE IS NEVER TOUCHED. The site is copied to a temp directory and
 * hub-store.js is neutralised IN THE COPY before a page is served; the run
 * refuses to start if that substitution did not take.
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdtempSync, cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { tmpdir } from 'node:os';

const HERE = new URL('.', import.meta.url).pathname;
const SHOTS = process.env.SHOTS ? join(HERE, '_walk-shots') : '';
if (SHOTS && !existsSync(SHOTS)) mkdirSync(SHOTS, { recursive: true });

/* ---- the copy, and the dead store ------------------------------------- */
const DIR = mkdtempSync(join(tmpdir(), 'lite-walk-'));
cpSync(HERE, DIR, { recursive: true, filter: s => !/node_modules|\.git$|\.git\/|_walk-shots/.test(s) });
const storePath = join(DIR, 'hub-store.js');
const store = readFileSync(storePath, 'utf8');
const dead = store.replace(/var URL = 'https:\/\/script\.google\.com[^']*'/, "var URL = 'http://127.0.0.1:9/dead'");
if (dead === store) { console.error('Could not neutralise hub-store.js in the copy — refusing to run.'); process.exit(1); }
writeFileSync(storePath, dead);

/* ---- a course, in the shape hub-sync leaves it ------------------------- */
const TOKENS = ['t-aylin', 't-mert', 't-olivia', 't-selin', 't-gul', 't-ali'];
const NAMES  = ['Aylin Demir', 'Mert Kaya', 'Olivia Hart', 'Selin Yilmaz', 'Gül Öztürk', 'Ali Behnami'];
const DAYS = ['2026-03-02','2026-03-03','2026-03-04','2026-03-05','2026-03-06','2026-03-09','2026-03-10','2026-03-11'];
const AIMS = ['Grammar','Reading','Listening','Speaking','Vocabulary','Writing'];

const plan = (who, n) => ({ meta:{ name:who, tp:'TP'+n, date:DAYS[n-1], level:'B1', length:'60' },
  plan:{ main:'By the end of the lesson learners will be better able to use the past simple.',
         sub:'To give controlled practice.', pers:'Watch my instructions.', mats:'Speakout B1 p.42',
         matsLink:'https://drive.google.com/file/d/abc/view',
         profile:'12 learners at B1, mostly Turkish L1.',
         rows:[{stage:'Lead-in',time:'5',inter:'T-S',proc:'Show the picture and ask what they did.'},
               {stage:'Practice',time:'15',inter:'S-S',proc:'Pairs do the gap-fill, then check.'}],
         probs:[{form:'did + infinitive',mean:'finished past',pron:'/dɪd/'}] }, turnedInAt: n<=2 ? '2026-03-04T10:00:00Z' : '' });
const feedback = n => ({ returnedAt:'2026-03-04T16:00:00Z', by:'Selin Yilmaz', grade:'S',
  strengths:[{text:'Clear instructions, checked with a question.',codes:['2a']}],
  actions:[{text:'Give the handout after the instruction, not before.',codes:['4c'],star:true}] });

const roster = { trainees: {} };
TOKENS.forEach((tok, i) => {
  roster.trainees[tok] = { id:tok, name:NAMES[i], group:i<3?'ABC':'DEF', email:'', importedAt:'2026-03-01T00:00:00Z',
    tp:{ plan: plan(NAMES[i], i+1), selfeval:{ went:'It went well.', next:'Shorter instructions.' },
         feedback: i<3 ? feedback(i+1) : null, history:{} },
    assignments:{ fol:{ state:'PASS', submittedAt:'2026-03-05T09:00:00Z', text:'Focus on the learner…' } },
    tracker:{ grades:{ provisional: i===0?'Pass B':'' } }, observations:{}, links:[], staffLinks:[],
    celta5:{ stage1:{ signed:{ name:NAMES[i], at:'2026-03-06T10:00:00Z', ink:'@caveat,3' } } },
    celta5t:{ stage1:{ returnedAt:'2026-03-06T09:00:00Z', signedBy:{ name:'Selin Yilmaz', at:'2026-03-06T09:00:00Z', ink:'@allura,-2' }, strengths:'Good rapport.', actionPlan:'Tighten the stages.' } },
    agreement: i===0 ? { name:NAMES[0], at:'2026-03-05T08:00:00Z', print:'abc' } : {} };
});

const SETTINGS = { centreName:'Elmswood English Centre', centreNumber:'TR999', courseName:'CELTA — C/1 2026',
  start:'2026-03-02', end:'2026-03-27', timeZone:'Europe/Istanbul', deliveryMode:'f2f',
  tutorNames:'Selin Yilmaz, Olivia Hart', totalHours:120, planFrom:1, analysisFrom:3,
  volunteerCertificateHours:20, visitDate:'2026-03-24', demoToday:'2026-03-09',
  agreement:{ agrAttendance:'We expect 100% attendance.', agrPlagiarism:'Your own work, always.' },
  docs:{}, courseLinks:[], onlineRooms:[{label:'Teaching practice',url:'https://meet.google.com/x'}],
  tutorContacts:[], volunteerContact:{ name:'Reception', email:'r@x.com' } };
/* SETTINGS_JSON='{"demoToday":"2026-02-27","preCourseConnect":true}' merges
   into the seeded settings, so a run can stand on another day of the course
   or with another switch set without editing this file (8 Oct 2026, to see
   the welcome card before day one with Connect's pre-course set on). */
if (process.env.SETTINGS_JSON) Object.assign(SETTINGS, JSON.parse(process.env.SETTINGS_JSON));

/* The timetable's shape (23_timetable.html): `slots` is the DAY'S template --
   no dates on it -- and `days` carries the dates. Sixteen dated slots here
   made every day sixteen lessons long and every volunteer's hours eightfold. */
const TIMETABLE = { published:true,
  slots: [{ key:'tp1', from:'18:00', to:'19:00', kind:'tp', label:'Teaching practice', room:'Teaching practice' },
          { key:'tp2', from:'19:15', to:'20:15', kind:'tp', label:'Teaching practice', room:'Teaching practice' }],
  days: DAYS.map((d,i) => ({ date:d, tp:i+1, setIndex:0, cells:{}, notes:'' })) };
const TPPOINTS = { groups:{ ABC: Object.fromEntries(TOKENS.slice(0,3).map((t,i) => [t, Object.fromEntries(
  Array.from({length:8},(_,n)=>['tp'+(n+1),{ aim:AIMS[(i+n)%AIMS.length], stages:[{name:'Lead-in',todo:'Set the scene'}] }])) ])) },
  released:{ ABC:true }, sets:{}, set:null };
const SHARED = [{id:'s1',at:'2026-03-09T10:00:00Z',name:'Past simple slides',url:'https://docs.google.com/presentation/d/x/edit',by:'Mert Kaya',kind:'materials',aim:'Grammar'}];
const VOLUNTEERS = { students: [
  { token:'c1-v1', name:'Elif Kaya', level:'B1', marks:{'2026-03-02':'present','2026-03-03':'present'}, carried:0, email:'e@x.com', agreed:'2026-03-02T10:00:00Z', replies:{} },
  { token:'c1-v2', name:'Deniz Arslan', level:'A2', marks:{'2026-03-02':'present'}, carried:4, email:'', replies:{} } ] };

const COMMON = {
  connect_course_settings: SETTINGS, connect_timetable_v1: TIMETABLE,
  connect_tp_points_v1: TPPOINTS, connect_shared_v1: SHARED,
  connect_volunteers_v1: VOLUNTEERS, connect_observations_v1: {},
  connect_tp_grid_v1: { rows: Object.fromEntries(TOKENS.map((t,i)=>[t,{ aim:AIMS[i%6] }])), released:{ ABC:true } },
  connect_coming_v1: { day:DAYS[5], tp:6, from:'18:00', yes:1, no:0, noAnswer:1 },
  'hub:course': 'c1'
};
/* hub:booted IS THE WHOLE TRICK. hub-sync only renders a page straight from
   this browser's copy when hub:booted equals `mode + ':' + token`; anything
   else and it waits on the store, which here is dead. Get this wrong and
   every screen walked shows the loading gate, which is what check-screens
   has always seen. */
const booted = (mode, tok) => ({ 'hub:booted': mode + ':' + tok });
/* THE STORE SHAPES THESE PER READER (hub-sync.js, 28-29 Sep 2026): a tutor
   holds the whole grid and the whole rotation, keyed by token and by group; a
   trainee gets their own group's rows as a list, and their set as a list of
   lists. Seeding a trainee with the tutor's shape threw on three screens and
   proved nothing. */
const GRID_T = { group:'ABC', released:true, rows: TOKENS.slice(0,3).map((t,i) => ({ name:NAMES[i], mine:i===0,
  plan:{ aim:AIMS[i], mats:'Speakout B1 p.'+(40+i) } })) };
const POINTS_T = { released:true, sets:[TOKENS.slice(0,3)], points: Object.fromEntries(TOKENS.slice(0,3).map((t,i) => [t,
  Object.fromEntries(Array.from({length:8},(_,n)=>['tp'+(n+1),{ aim:AIMS[(i+n)%AIMS.length], stages:[{name:'Lead-in',todo:'Set the scene'}] }]))])) };
const SEED = {
  tutor:     { ...COMMON, ...booted('tutor','KEY'), 'hub:k':'KEY',
               connect_roster_v1: roster, 'chub:tutorName':'Selin Yilmaz' },
  assessor:  { ...COMMON, ...booted('assessor','AKEY'), 'hub:a':'AKEY', connect_roster_v1: roster,
               'hub:assessor':{ name:'Dr Jane Powell', expires:'2026-04-10' } },
  trainee:   { ...COMMON, ...booted('trainee',TOKENS[0]),
               'hub:t':TOKENS[0], 'hub:me':{ token:TOKENS[0], name:NAMES[0], group:'ABC' },
               'chub:plan': plan(NAMES[0],1).plan, 'chub:selfeval':{ went:'Good.' },
               'chub:feedback': feedback(1), 'chub:tracker':{}, 'chub:celta5':roster.trainees[TOKENS[0]].celta5,
               'chub:celta5t':roster.trainees[TOKENS[0]].celta5t, 'chub:tpHistory':{},
               'chub:agreement': roster.trainees[TOKENS[0]].agreement,
               connect_tp_grid_v1: GRID_T, connect_tp_points_v1: POINTS_T,
               connect_assignment_submissions_v1: roster.trainees[TOKENS[0]].assignments },
  volunteer: { ...COMMON, ...booted('volunteer','c1-v1'),
               'hub:v':'c1-v1', 'hub:volunteer': VOLUNTEERS.students[0] }
};

/* ---- who may open what, from check-screens' own matrix ----------------- */
const matrix = readFileSync(join(HERE, 'check-screens.mjs'), 'utf8');
const ROOMS = {};
for (const m of matrix.matchAll(/'(\d+_[\w.]+\.html|index\.html)':\s*\{([^}]*)\}/g)) {
  const who = {};
  for (const r of m[2].matchAll(/(\w+)\s*:\s*'([^']+)'/g)) who[r[1]] = r[2];
  ROOMS[m[1]] = who;
}
/* Every page on disk, the way check-screens counts them -- ROOMS only names
   the screens with a door rule, and reading it as the screen list walked 20
   of the 33 and quietly skipped the other 13. */
const NOT_A_SCREEN = new Set(['celta-c17-timetable.html']);
const SCREENS = readdirSync(HERE)
  .filter(f => f.endsWith('.html') && !NOT_A_SCREEN.has(f))
  .sort((a, b) => { const n = s => (s === 'index.html' ? 0 : parseInt(s, 10) || 99);
                    return n(a) - n(b) || a.localeCompare(b); });
const ROLES = ['tutor', 'trainee', 'assessor', 'volunteer'];
/* ONLY='tutor · 3_' walks the screens whose "role · file" matches; VIEW=1
   keeps the viewport as a person sees it, scrolled to the foot, instead of
   the whole page -- a fixed bar only shows what it covers in a viewport. */
const ONLY = process.env.ONLY ? new RegExp(process.env.ONLY) : null;
const VIEW = process.env.VIEW || '';            // '1' = the foot, 'top' = the top
/* States that are right and still read as "almost nothing": a trainee who
   has no fail letter has no letter to read, and a volunteer's browser holds
   no candidate at all -- the store never sends one -- so a candidate screen
   opened on that link has nobody to show. Named here so the run is green
   and anything new stands out. */
const EXPECTED = new Set(['trainee · 22_fail_letter.html', 'volunteer · 20_celta5.html', 'volunteer · 22_fail_letter.html']);

/* ---- the link each screen is really opened with ------------------------- */
/* Half the record screens name their subject in the link -- the tutor opens
   a trainee's feedback, CELTA 5, final report or fail letter from a door
   that carries ?trainee=; the certificate carries ?who=. Opened bare they
   say "name a candidate in the link" and render nothing else, which is
   correct and tells us nothing. */
const T0 = TOKENS[0];
const PARAMS = {
  '3_tutor_feedback.html': '?trainee=' + T0,
  '4_feedback_returned.html': '?trainee=' + T0,
  '9_assignment_submission.html': '?a=fol',
  '10_tutor_assignment_marking.html': '?trainee=' + T0 + '&a=fol',
  '11_assignment_record.html': '?trainee=' + T0 + '&a=fol',
  '16_final_report.html': '?id=' + T0,
  '20_celta5.html': '?trainee=' + T0,
  '22_fail_letter.html': '?trainee=' + T0,
  '27_volunteer_certificate.html': '?who=c1-v1',
};

/* ---- serve the copy ---------------------------------------------------- */
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json',
                '.svg':'image/svg+xml', '.png':'image/png', '.ico':'image/x-icon', '.ttf':'font/ttf', '.webmanifest':'application/manifest+json' };
const srv = createServer((q, r) => {
  const f = join(DIR, (q.url.split('?')[0] || '/').replace(/^\//, '') || 'index.html');
  if (!existsSync(f)) { r.writeHead(404); r.end(); return; }
  r.writeHead(200, { 'Content-Type': TYPES[extname(f)] || 'application/octet-stream' });
  r.end(readFileSync(f));
});
const PORT = Number(process.env.PORT) || 8123;
await new Promise(r => srv.listen(PORT, r));

/* ---- the walk ---------------------------------------------------------- */
const found = [];
const browser = await chromium.launch();
let opened = 0;

/* DOORS=1: not the screens, the links between them. Ramy's bugs on 6 Oct
   2026 were mostly doors -- a card that opened nothing, a link that landed
   on a screen refusing the person who clicked it. So: stand on each role's
   landing screen with the course seeded, take every link to a Lite screen
   on it, open each one, and ask the destination the same questions, plus
   the two a door can get wrong: did it refuse me, and did it arrive with
   nobody named ("name a candidate in the link"). */
const LANDING = { tutor: ['5_tutor_dashboard.html', '6_centre_admin_dashboard.html'],
                  trainee: ['index.html'], assessor: ['12_assessor_pack.html'], volunteer: ['26_volunteer.html'] };
const REFUSED = /This room belongs to|Open your course link|This link no longer opens/i;
const NOBODY = /Name a (candidate|trainee) in the link|isn[’']t set up yet/i;
if (process.env.DOORS) {
  for (const role of ROLES) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 860 } });
    const page = await ctx.newPage();
    await page.goto(`http://127.0.0.1:${PORT}/${LANDING[role][0]}`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(seed => { localStorage.clear();
      for (const k of Object.keys(seed)) localStorage.setItem(k, typeof seed[k] === 'string' ? seed[k] : JSON.stringify(seed[k]));
    }, SEED[role]);
    const doors = [];
    for (const land of LANDING[role]) {
      await page.goto(`http://127.0.0.1:${PORT}/${land}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2600);
      /* Hidden ones too: the admin dashboard keeps most of its doors in tab
         panels that are display:none until the tab is pressed. */
      const links = await page.evaluate(() => [...document.querySelectorAll('a[href]')]
        .map(a => ({ href: a.getAttribute('href'), text: (a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40) }))
        .filter(l => /^[\w.-]+\.html(\?|#|$)/.test(l.href)));
      for (const l of links) if (!doors.some(d => d.href === l.href)) doors.push({ ...l, from: land });
    }
    for (const d of doors) {
      const where = `${role} · ${d.from} → "${d.text}" (${d.href})`;
      const errs = [];
      const onErr = e => { const t = String(e); if (!/stopping this page on purpose|leaving for your own room/.test(t)) errs.push('threw: ' + t.slice(0, 110)); };
      page.on('pageerror', onErr);
      try {
        await page.goto(`http://127.0.0.1:${PORT}/${d.href}`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(2200);
        opened++;
        const seen = await page.evaluate(() => ({ text: (document.body.innerText || '').trim(), url: location.pathname.split('/').pop() }));
        if (REFUSED.test(seen.text)) found.push(`${where}: the door opens on a REFUSAL`);
        else if (NOBODY.test(seen.text)) found.push(`${where}: arrives with nobody named — "${seen.text.slice(0, 80).replace(/\s+/g, ' ')}"`);
        else if (seen.text.length < 120) found.push(`${where}: almost nothing there — "${seen.text.slice(0, 70).replace(/\s+/g, ' ')}"`);
        for (const e of errs) found.push(`${where}: ${e}`);
      } catch (e) { found.push(`${where}: did not load — ${String(e).slice(0, 90)}`); }
      page.off('pageerror', onErr);
    }
    console.log(`${role}: ${doors.length} doors`);
    if (process.env.DOORS === '2') for (const d of doors) console.log(`    ${d.from} → "${d.text}" ${d.href}`);
    await ctx.close();
  }
  await browser.close(); srv.close();
  console.log(`\nConnect Lite — ${opened} doors opened with a course on them.`);
  if (!found.length) { console.log('Every door opens on what it names.\n'); process.exit(0); }
  console.log(`\n${found.length} DOOR(S) TO LOOK AT:\n`); for (const f of found) console.log('  ' + f); console.log('');
  process.exit(1);
}

for (const role of ROLES) {
  for (const screen of SCREENS) {
    const want = (ROOMS[screen] || {})[role] || 'open';
    if (want === 'refuse' || want.startsWith('goes:')) continue;   // check-screens owns those
    const where = `${role} · ${screen}`;
    if (ONLY && !ONLY.test(where)) continue;
    const ctx = await browser.newContext({ viewport: { width: 390, height: 860 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => { const t = String(e); if (!/stopping this page on purpose/.test(t)) errs.push('threw: ' + t.slice(0, 120)); });
    page.on('console', c => { if (c.type() === 'error') { const t = c.text();
      if (!/ERR_UNSAFE_PORT|Failed to load resource|net::|ERR_CONNECTION|ServiceWorker/.test(t)) errs.push('console: ' + t.slice(0, 120)); } });
    try {
      await page.goto(`http://127.0.0.1:${PORT}/${screen}${PARAMS[screen] || ''}`, { waitUntil: 'domcontentloaded' });
      await page.evaluate(seed => { localStorage.clear();
        for (const k of Object.keys(seed)) localStorage.setItem(k, typeof seed[k] === 'string' ? seed[k] : JSON.stringify(seed[k]));
      }, SEED[role]);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2600);
      opened++;

      const seen = await page.evaluate(() => {
        const body = document.body;
        const text = (body.innerText || '').trim();
        const vw = document.documentElement.clientWidth;
        /* anything whose box runs past the right edge by more than a hair */
        const over = [...body.querySelectorAll('*')].filter(el => {
          const r = el.getBoundingClientRect();
          if (!r.width || !r.height) return false;
          const cs = getComputedStyle(el);
          if (cs.position === 'fixed' || cs.overflowX === 'auto' || cs.overflowX === 'scroll') return false;
          return r.right > vw + 2;
        }).slice(0, 3).map(el => (el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : '')));
        /* a fixed or sticky thing sitting on top of a button */
        /* A thing a tap passes straight through (pointer-events:none -- the
           sync status chip) covers nothing that matters. */
        const floats = [...body.querySelectorAll('*')].filter(el => {
          const cs = getComputedStyle(el);
          return (cs.position === 'fixed' || cs.position === 'sticky') && cs.pointerEvents !== 'none' && el.offsetHeight && el.offsetWidth;
        });
        const covered = [];
        for (const f of floats) {
          const fr = f.getBoundingClientRect();
          if (fr.height > innerHeight * 0.5) continue;
          for (const b of body.querySelectorAll('button, a.btn, .btn, a[href]')) {
            if (f === b || f.contains(b) || b.contains(f)) continue;
            const br = b.getBoundingClientRect();
            if (!br.width || !br.height) continue;
            const hit = !(br.right < fr.left || br.left > fr.right || br.bottom < fr.top || br.top > fr.bottom);
            if (hit) { covered.push((f.className || f.tagName) + ' over ' + (b.textContent || '').trim().slice(0, 26)); break; }
          }
          if (covered.length > 2) break;
        }
        /* A THING THE PAGE SAID TO HIDE, STILL ON SCREEN. `hidden` is how
           every screen here says "not yet", and the browser's own
           [hidden]{display:none} lives in the user-agent sheet -- so any
           author rule setting display beats it. `.room{display:block}` did
           exactly that and un-hid four cards on the trainee's home for a
           fortnight (6 Oct 2026). Cheap to check, and it would have caught
           it the day it was written. */
        const unhidden = [...body.querySelectorAll('[hidden]')]
          .filter(el => el.offsetWidth > 0 && el.offsetHeight > 0)
          .slice(0, 4)
          .map(el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : el.className ? '.' + String(el.className).split(' ')[0] : ''));
        /* doors that go nowhere */
        const dead = [...body.querySelectorAll('a')].filter(a => {
          const h = a.getAttribute('href');
          if (h === null || h === '' || h === '#') {
            if (!a.offsetWidth || !a.offsetHeight) return false;
            return !a.hasAttribute('aria-disabled') && !a.id;   // ids are wired by script
          }
          return false;
        }).slice(0, 3).map(a => (a.textContent || '').trim().slice(0, 30));
        return { len: text.length, head: text.slice(0, 70).replace(/\s+/g, ' '), over, covered, dead, unhidden,
                 scrollW: document.documentElement.scrollWidth, vw };
      });

      for (const e of errs) found.push(`${where}: ${e}`);
      if (seen.len < 120 && !EXPECTED.has(where)) found.push(`${where}: almost nothing rendered — "${seen.head}"`);
      if (seen.scrollW > seen.vw + 2) found.push(`${where}: runs ${seen.scrollW - seen.vw}px off the right edge${seen.over.length ? ' (' + seen.over.join(', ') + ')' : ''}`);
      for (const c of seen.covered) found.push(`${where}: ${c}`);
      for (const d of seen.dead) found.push(`${where}: a link that goes nowhere — "${d}"`);
      for (const u of seen.unhidden) found.push(`${where}: ${u} is marked hidden and is on screen anyway`);
      if (SHOTS && VIEW === '1') { await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await page.waitForTimeout(300); }
      if (SHOTS) await page.screenshot({ path: join(SHOTS, `${role}-${screen.replace('.html','')}${VIEW === '1' ? '-foot' : VIEW ? '-top' : ''}.png`), fullPage: !VIEW });
    } catch (e) {
      found.push(`${where}: did not load — ${String(e).slice(0, 100)}`);
    }
    await ctx.close();
  }
}
await browser.close();
srv.close();

console.log(`\nConnect Lite — ${opened} screens walked with a course on them, at phone width.`);
if (!found.length) { console.log('Nothing to report.\n'); process.exit(0); }
console.log(`\n${found.length} THING(S) TO LOOK AT:\n`);
for (const f of found) console.log('  ' + f);
console.log('');
process.exit(1);
