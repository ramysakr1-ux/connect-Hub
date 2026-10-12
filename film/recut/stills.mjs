// Stills of an upright film bundle at given seconds, on the same virtual clock upright-mp4.mjs uses.
//   node stills.mjs "<film.html>" <out-prefix> 4 9 15 ...
import { createRequire } from 'node:module'; const { chromium } = createRequire('/Users/work/connect-Hub/package.json')('playwright');
const [FILE, PREFIX, ...TIMES] = process.argv.slice(2);
const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await page.addInitScript({ path: '/Users/work/connect-Hub/film/journey-vclock.js' });
await page.goto('file://' + FILE);
await page.waitForFunction(() => !!document.querySelector('[data-omelette-chrome]'), null, { timeout: 60000 });
await page.addStyleTag({ content: '[data-omelette-chrome]{display:none !important} svg:has(> foreignObject){transform:none !important; box-shadow:none !important} button[style*="2147483000"]{display:none !important}' });
await page.keyboard.press('0'); await page.waitForTimeout(150);
await page.evaluate(() => window.__vclockOn()); await page.evaluate(() => window.__vstep(0));
let at = 0;
for (const s of TIMES.map(Number)) { await page.evaluate(ms => window.__vstep(ms), (s - at) * 1000); at = s; await page.waitForTimeout(120);
  await page.screenshot({ path: `${PREFIX}-${String(s).replace('.', '_')}.png`, type: 'png' }); }
await b.close(); console.log('ok', TIMES.length);
