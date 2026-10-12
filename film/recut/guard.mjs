// The recorder's guard: reads go to the store, writes never do. Book pages and day PDFs are
// swapped for placeholders in Lite's colours, so no publisher's page is ever filmed.
export const READS = new Set(['ping', 'me', 'get', 'course', 'boot', 'audio', 'roster', 'library', 'catalogue', 'ownerCourses', 'readCourse']);
export const blocked = [];
export const seen = [];
export const labels = new Map();   // drive file id -> the label Lite shows for it
export function placeholder(label) {
  return `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;height:100%;background:#525659;font-family:Karla,Arial,sans-serif;overflow:hidden}
  .bar{position:absolute;left:0;right:0;top:0;height:40px;background:#323639;display:flex;align-items:center;gap:14px;padding:0 14px;color:#e8eaed;font-size:13px}
  .bar .sp{flex:1}.bar b{font-weight:600}.ic{width:18px;height:18px;border:2px solid #e8eaed;border-radius:3px;opacity:.85}
  .p{position:absolute;left:8%;right:8%;top:56px;bottom:0;background:#fffdf8;box-shadow:0 2px 8px rgba(0,0,0,.4)}
  .h{position:absolute;left:8%;right:8%;top:5%;height:5%;background:#1e4d4a;opacity:.85;border-radius:3px}
  .l{position:absolute;left:8%;right:8%;height:1.6%;background:#e9e2d4;border-radius:5px}
  .b{position:absolute;left:8%;width:40%;height:18%;background:#f3ead9;border-radius:6px}
  .n{position:absolute;left:0;right:0;top:46%;text-align:center;color:#8a8478;font-size:17px;letter-spacing:.04em}</style>
  <div class="bar"><b>${label}</b><span class="sp"></span><span>−</span><span>+</span><span class="ic"></span></div>
  <div class="p"><div class="h"></div>${[14,18,22,26].map(y => `<div class="l" style="top:${y}%"></div>`).join('')}
  <div class="n">${label}</div>
  <div class="b" style="top:56%"></div><div class="b" style="top:56%;left:auto;right:8%"></div>
  ${[78,82,86,90].map(y => `<div class="l" style="top:${y}%"></div>`).join('')}</div>`;
}
export function sheet(label) {
  const l = y => `<rect x="70" y="${y}" width="660" height="14" rx="7" fill="#e9e2d4"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1100" viewBox="0 0 800 1100"><rect width="800" height="1100" fill="#fffdf8"/>
  <rect x="70" y="60" width="660" height="54" rx="4" fill="#1e4d4a" opacity=".85"/>${[150,180,210,240].map(l).join('')}
  <rect x="70" y="300" width="300" height="200" rx="8" fill="#f3ead9"/><rect x="430" y="300" width="300" height="200" rx="8" fill="#f3ead9"/>
  ${[560,590,620,650,680,710].map(l).join('')}<text x="400" y="1040" text-anchor="middle" font-family="Karla,Arial" font-size="26" fill="#8a8478">${label}</text></svg>`;
}
export async function guard(ctx) {
  await ctx.route('https://script.google.com/**', async (route) => {
    const req = route.request(); let op = '';
    try { op = JSON.parse(req.postData() || '{}').op || ''; } catch (e) {}
    if (req.method() !== 'POST' || READS.has(op)) return route.continue();
    blocked.push(op);
    // an upload answers with a link, as the store would; nothing is uploaded
    const body = { ok: true, result: op === 'putMaterial' ? { url: 'https://drive.google.com/file/d/placeholder/view', id: 'placeholder' } : {} };
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  });
  await ctx.route(/https:\/\/((drive|docs)\.google\.com|[a-z0-9-]+\.googleusercontent\.com)\/.*/, async (route) => {
    const url = route.request().url(), type = route.request().resourceType();
    const m = /\/d\/([^/?]+)/.exec(url) || /[?&]id=([^&]+)/.exec(url), label = (m && labels.get(m[1])) || 'Student’s Book';
    seen.push(type + ' ' + url.slice(0, 60));
    if (type === 'document' || type === 'iframe') return route.fulfill({ status: 200, contentType: 'text/html', body: placeholder(label) });
    return route.fulfill({ status: 200, contentType: 'image/svg+xml', body: sheet(label) });
  });
}
// Drive links in fields show only their host: a link to the scans folder is not for a public film.
export const MASK = `(() => { const re = /(https:\\/\\/(?:drive|docs)\\.google\\.com\\/[^\\s|]*?)(?:\\/d\\/|folders\\/|id=)[-\\w]{6,}[^\\s|]*/g;
  document.querySelectorAll('input, textarea').forEach(e => { if (re.test(e.value)) { re.lastIndex = 0; e.value = e.value.replace(re, '$1/…'); } re.lastIndex = 0; }); })()`;
export const HIDE = '#hubSync, .say-pill { display:none !important; } html{scroll-behavior:auto !important}';
