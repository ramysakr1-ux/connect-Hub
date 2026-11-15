import { chromium } from '/Users/work/connect-Hub/node_modules/playwright/index.mjs';
import { spawn } from 'child_process'; import fs from 'fs';
const slug = process.argv[2] || 'classroom-management';
const O = '/Users/work/CELTA connect-code prompt/docs/walks/short-sessions-2026-11-15'; fs.mkdirSync(O, { recursive: true });
const srv = spawn('python3', ['-m', 'http.server', '8765', '--bind', '127.0.0.1'], { cwd: '/Users/work/connect-Hub', stdio: 'ignore' });
await new Promise(r => setTimeout(r, 900));
const br = await chromium.launch(); const out = [];
try {
  for (const [nm, vp] of [['phone', { width: 390, height: 844 }], ['desk', { width: 1280, height: 900 }]]) {
    const ctx = await br.newContext({ viewport: vp, deviceScaleFactor: nm === 'phone' ? 2 : 1 });
    await ctx.route(/script\.google(usercontent)?\.com/, rt => rt.fulfill({ contentType: 'application/json', body: '{"ok":false,"error":"offline"}' }));
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message.slice(0, 160)));
    await p.goto(`http://127.0.0.1:8765/input-sessions/${slug}-short/index.html`, { waitUntil: 'load' }); await p.waitForTimeout(1500);
    // press every reveal and the first buttons, so the screenshot shows the parts working
    if (slug === 'classroom-management-x') {
      await p.click('#simStart'); await p.waitForTimeout(6000); await p.click('[data-go="C"]'); await p.click('[data-pick="C:1"]');
      await p.fill('#instr', 'Could you maybe work in pairs?');
      await p.click('#vars .reveal-card');
    }
    const info = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth > innerWidth + 1, gating: document.documentElement.className, h: document.body.scrollHeight }));
    out.push({ nm, ...info, errs });
    await p.evaluate(() => document.querySelectorAll('.reveal-card').forEach(c => c.classList.add('open'))); await p.screenshot({ path: `${O}/${slug}-${nm}.png`, fullPage: true });
    await ctx.close();
  }
} finally { await br.close(); srv.kill(); }
console.log(JSON.stringify(out));
