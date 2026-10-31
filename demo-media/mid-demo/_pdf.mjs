/* Print the student handouts of the demonstration lessons to PDF (31 Oct 2026): the two here and the bridge story's. Run from connect-Hub with Lite served on 127.0.0.1:8765:
     node demo-media/mid-demo/_pdf.mjs
   Each lesson folder gets handout.pdf beside handout.html. */
const LESSONS = [['mid-demo/sarahs-date', "Sarah's date"], ['mid-demo/describing-people', 'Describing people'], ['dayone-demo/bridge-story', 'The bridge story']];
import { chromium } from '../../node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [l, title] of LESSONS) {
  const p = await b.newPage();
  await p.goto(`http://127.0.0.1:8765/demo-media/${l}/handout.html`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: new URL(`../${l}/handout.pdf`, import.meta.url).pathname, format: 'A4', printBackground: true, preferCSSPageSize: true,
    displayHeaderFooter: true, headerTemplate: '<span></span>',
    footerTemplate: '<div style="width:100%;font:8px Karla,sans-serif;color:gray;text-align:center;">' + title + ' · page <span class="pageNumber"></span> of <span class="totalPages"></span></div>' });
  console.log(l, 'done');
}
await b.close();
