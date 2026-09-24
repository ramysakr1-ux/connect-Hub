/* What a real model might send back. Each variant mangles the filled brief the
 * way models actually do, and asks: does every answer still land? */
import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await (await b.newContext()).newPage();
p.on('pageerror', e => console.log('PAGE ERROR', e.message));
await p.goto('http://127.0.0.1:8792/3_tutor_feedback.html?k=tutor-key-1&trainee=' + process.argv[2], { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(5000);

const filled = await p.evaluate(() => {
  const brief = HubExchange.brief(DOC);
  const man = JSON.parse(brief.match(/<!--\s*lite:slots\s*(\[[\s\S]*?\])\s*-->/)[1]);
  // fill every slot with something recognisable
  let out = brief;
  man.forEach(([id, heading], i) => {
    const body = heading === 'Grade' ? 'To standard'
      : /Strengths|Action points/.test(heading) ? ('★ point A for ' + id + '\npoint B for ' + id)
      : ('answer for ' + id);
    out = out.replace(new RegExp('(## ' + heading.replace(/[.*+?^${}()|[\]\\—-]/g, '\\$&') + '\\s*\\n)'), '$1' + body + '\n');
  });
  return { brief: out, ids: man.map(x => x[0]) };
});

const variants = {
  'as sent':                 t => t,
  'bold headings':           t => t.replace(/^## (.+)$/gm, '**$1**'),
  'H3 headings':             t => t.replace(/^## /gm, '### '),
  'numbered headings':       t => t.replace(/^## (.+)$/gm, (m, h, o, s) => '## ' + (s.slice(0, o).split(/^## /gm).length) + '. ' + h),
  'trailing colons':         t => t.replace(/^## (.+)$/gm, '## $1:'),
  'en dashes for em':        t => t.replace(/—/g, '–'),
  'bold inside points':      t => t.replace(/^point A for (.+)$/gm, '**point A** for $1'),
  'wrapped in a code fence': t => '```markdown\n' + t + '\n```',
  'chatty preamble':         t => "Sure! Here's the completed feedback for you:\n\n" + t,
  'chatty ending':           t => t + "\n\nLet me know if you'd like me to adjust anything!",
  'marker dropped':          t => t.replace(/^#\s+Feedback.*$/m, ''),
};

console.log('slots to fill:', filled.ids.length, '\n');
for (const [name, fn] of Object.entries(variants)) {
  const text = fn(filled.brief);
  const r = await p.evaluate(([t]) => { const x = HubExchange.read(t, DOC); return { n: Object.keys(x.found).length, unplaced: x.unplaced.length, sample: x.found.fGrade || null, listOk: Array.isArray(x.found.lSP) ? x.found.lSP.length : 0 }; }, [text]);
  const miss = filled.ids.length - r.n;
  console.log(String(name).padEnd(24), 'landed ' + String(r.n).padStart(2) + '/' + filled.ids.length,
    miss ? '  MISSING ' + miss : '  ok      ', ' unplaced ' + r.unplaced, ' grade=' + (r.sample || '—'), ' lSP pts=' + r.listOk);
}
await b.close();
