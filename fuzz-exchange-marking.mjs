import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await (await b.newContext()).newPage();
p.on('pageerror', e => console.log('PAGE ERROR', e.message));
await p.goto('http://127.0.0.1:8792/10_tutor_assignment_marking.html?k=tutor-key-1&trainee=' + process.argv[2] + '&a=lsrt', { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(5000);
const filled = await p.evaluate(() => {
  const brief = eval('xBrief(WORDING[CURRENT], subFor(CURRENT), "sub1")');
  const man = eval('xSlotsFor(WORDING[CURRENT])');
  let out = brief;
  man.forEach(m => {
    const body = m.id === 'comment' ? 'A careful piece of work.' : 'Met\nComment for ' + m.id;
    out = out.replace(new RegExp('(## ' + m.heading.replace(/[.*+?^${}()|[\]\\—-]/g, '\\$&') + '\\s*\\n)'), '$1' + body + '\n');
  });
  return { brief: out, n: man.length };
});
const variants = {
  'as sent':            t => t,
  'bold headings':      t => t.replace(/^## (.+)$/gm, '**$1**'),
  'H3 headings':        t => t.replace(/^## /gm, '### '),
  'numbered headings':  t => t.replace(/^## (.+)$/gm, (m,h,o,s) => '## ' + (s.slice(0,o).split(/^## /gm).length) + '. ' + h),
  'chatty preamble':    t => "Of course — here you go:\n\n" + t,
};
console.log('slots:', filled.n, '\n');
for (const [name, fn] of Object.entries(variants)) {
  const r = await p.evaluate(([t]) => {
    const before = JSON.stringify(eval('subFor(CURRENT).criteriaMarks'));
    document.getElementById('xText') || eval("wireExchange()");
    const dt = new DataTransfer(); dt.setData('text/plain', t);
    document.body.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
    return new Promise(res => setTimeout(() => {
      const s = eval('subFor(CURRENT)');
      res({ marks: (s.criteriaMarks.sub1||[]).filter(x=>x===true).length,
            comments: (s.criteriaComments.sub1||[]).filter(Boolean).length,
            general: !!(document.getElementById('comment')||{}).value,
            note: (document.getElementById('xDone')||{}).textContent.slice(0,60) });
    }, 900));
  }, [fn(filled.brief)]);
  console.log(String(name).padEnd(20), 'marks', r.marks, ' comments', r.comments, ' general', r.general ? 'yes' : 'NO ', ' |', r.note.replace(/\s+/g,' ').slice(0,48));
  // undo before the next variant
  await p.evaluate(() => { const u = document.getElementById('xUndo'); if (u) u.click(); });
  await p.waitForTimeout(400);
}
await b.close();
