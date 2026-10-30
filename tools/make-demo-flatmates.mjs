// Page 16 and tracks 2.6 and 2.7 for the Connect demo (Ramy, 31 Oct 2026: "when I click on TP points for one of the trainees
// ... the page they're teaching from ... the audio should play ... at least for one trainee ... maybe the first two"). The
// demo's first two trainees teach TP2 from page 16 on the same day: a vocabulary lesson (friendly, funny, quiet, sad, tidy,
// track 2.6) and a listening lesson (three flatmates, Zoe, Alice and Jody, track 2.7). The book's own page and recordings are
// not ours to ship, so this page and these tracks are Connect's own, in our words, labelled as made for the demo.
//
//   node --env-file="../CELTA connect-code prompt/.env.local" tools/make-demo-flatmates.mjs        (tracks and page)
//   node tools/make-demo-flatmates.mjs --page                                                       (the page only)
import { writeFileSync, mkdirSync } from "node:fs";
const ROOT = new URL("../demo-media/connect-demo/", import.meta.url).pathname;
const TRACKS = {
  "2-6": ["Listen and check: five adjectives", [
    ["w", "Exercise A. Listen and check."], ["w", "Friendly. She's very friendly."], ["m", "Funny. He's really funny."],
    ["w", "Quiet. My flatmate is quiet."], ["m", "Sad. Why are you sad?"], ["w", "Tidy. Their kitchen is always tidy."]]],
  "2-7": ["Three flatmates", [
    ["w", "Hi, I'm Zoe. I share a flat with Alice and Jody. Alice is really tidy. She cleans the kitchen every day. And Jody is very funny. He always makes us laugh."],
    ["a", "I'm Alice. Zoe is friendly. She talks to everyone in our building. Jody is funny, but he isn't very tidy. His room is a mess!"],
    ["m", "Hi, I'm Jody. Alice is quiet. She reads a lot, and she's the tidy one. Zoe is friendly, but she's sad on Sundays, when her football team loses!"]]]
};
const VOICE = { w: "coral", m: "echo", a: "shimmer" };
async function speak(key, who, text) {
  const body = { model: "gpt-4o-mini-tts", voice: VOICE[who], input: text, response_format: "mp3",
    instructions: "Say this exactly as written, once, in General American English, at a natural, slightly slow pace, as a clear speaker would for elementary learners. Do not add or leave out any words." };
  const r = await fetch("https://api.openai.com/v1/audio/speech", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`${r.status} ${(await r.text()).slice(0, 200)}`);
  return Buffer.from(await r.arrayBuffer());
}
const pageOnly = process.argv.includes("--page");
if (!pageOnly) {
  const key = process.env.OPENAI_API_KEY;
  if (!key || key.includes("SENSITIVE")) { console.error("OPENAI_API_KEY is not set. Run it with --env-file on the Mac."); process.exit(1); }
  mkdirSync(ROOT + "audio", { recursive: true });
  for (const [n, [title, lines]] of Object.entries(TRACKS)) {
    const parts = []; for (const [who, text] of lines) parts.push(await speak(key, who, text));
    const buf = Buffer.concat(parts); writeFileSync(`${ROOT}audio/track-${n}.mp3`, buf);
    console.log(`track-${n}.mp3  ${title}  ${(buf.length / 1024).toFixed(0)} KB`);
  }
}
// the page, drawn like the demo's other sample pages and photographed at A4 proportions
const html = `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,700&family=Karla:wght@400;600;700;800&display=swap" rel="stylesheet"><style>
*{box-sizing:border-box} body{margin:0;width:1240px;height:1754px;background:#fffdf8;font:22px/1.5 Karla,sans-serif;color:#1c2430;padding:60px 86px;position:relative}
.top{display:flex;align-items:center;gap:22px} .badge{background:#2f6e8e;color:#fff;font:800 32px Karla;padding:14px 18px;border-radius:12px} h1{font:700 64px Newsreader,serif;margin:0}
.rule{height:5px;background:#2f6e8e;margin:18px 0 14px} .sub{color:#3c4a5a;font-size:20px} .sub b{color:#1c2430}
h2{color:#2f6e8e;font:800 26px Karla;letter-spacing:.12em;margin:26px 0 12px;padding-top:16px;border-top:1px solid #d9dee5} h2 span{color:#6a7686;margin-left:10px}
.ex{display:flex;gap:18px;margin:12px 0} .n{flex:0 0 auto;width:46px;height:46px;border-radius:50%;background:#2f6e8e;color:#fff;font:800 17px Karla;display:flex;align-items:center;justify-content:center}
.t b{font-weight:800} .trk{display:inline-block;background:#e6eef3;color:#2f6e8e;font-weight:800;font-size:17px;padding:2px 10px;border-radius:999px;margin-left:6px}
.words{display:flex;gap:12px;flex-wrap:wrap;margin:10px 0 0 64px} .words span{border:2px solid #2f6e8e;border-radius:10px;padding:6px 16px;font-weight:700}
.pics{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:12px 0 0 64px} .pic{height:190px;border-radius:12px;position:relative;overflow:hidden}
.p1{background:linear-gradient(135deg,#f6d6b8,#c97b4f)} .p2{background:linear-gradient(135deg,#cfe3f3,#5b8fb8)} .p3{background:linear-gradient(135deg,#d8ecd1,#5f9a62)}
.pic em{position:absolute;left:10px;bottom:10px;background:rgba(0,0,0,.6);color:#fff;font-style:normal;font-weight:700;font-size:17px;padding:4px 10px;border-radius:8px}
.pic b{position:absolute;left:12px;top:8px;font:800 34px Karla;color:#fff}
ol{margin:8px 0 0 64px;padding-left:22px} li{margin:4px 0} .names{margin:10px 0 0 64px;font-weight:800}
.foot{position:absolute;left:86px;right:86px;bottom:50px;border-top:1px solid #d9dee5;padding-top:10px;display:flex;justify-content:space-between;color:#6a7686;font-size:17px}
</style></head><body>
<div class="top"><div class="badge">2.3</div><h1>Flatmates</h1></div><div class="rule"></div>
<div class="sub"><b>Vocabulary</b> adjectives for personality · <b>Listening</b> three flatmates talk about each other</div>
<h2>SPEAKING</h2>
<div class="ex"><div class="n">1</div><div class="t">Work in pairs. Do you live with other people? What makes someone easy to live with?</div></div>
<h2>VOCABULARY <span>PERSONALITY</span></h2>
<div class="ex"><div class="n">2A</div><div class="t">Find these adjectives in the email on page 15. Then listen and check. <span class="trk">2.6</span></div></div>
<div class="words"><span>friendly</span><span>funny</span><span>quiet</span><span>sad</span><span>tidy</span></div>
<div class="ex"><div class="n">2B</div><div class="t">Complete the sentences with an adjective from 2A.</div></div>
<ol><li>My brother always makes me laugh. He's really ______.</li><li>She says hello to everyone. She's very ______.</li><li>Their kitchen is clean every day. They're ______.</li><li>He doesn't talk much. He's ______.</li></ol>
<div class="ex"><div class="n">2C</div><div class="t">Work in pairs. Describe someone you live or work with. Use three adjectives.</div></div>
<h2>LISTENING</h2>
<div class="ex"><div class="n">3A</div><div class="t">Listen to three flatmates. Match the people A–C to the names. <span class="trk">2.7</span></div></div>
<div class="pics"><div class="pic p1"><b>A</b><em>She is cleaning the kitchen</em></div><div class="pic p2"><b>B</b><em>She is talking to a neighbor</em></div><div class="pic p3"><b>C</b><em>He is laughing at a joke</em></div></div>
<div class="names">Zoe · Alice · Jody</div>
<div class="ex"><div class="n">3B</div><div class="t">Listen again. Who…</div></div>
<ol><li>cleans the kitchen every day?</li><li>makes everyone laugh?</li><li>has a messy room?</li><li>talks to everyone in the building?</li><li>reads a lot?</li></ol>
<div class="ex"><div class="n">3C</div><div class="t">Which of the three would you like to live with? Why?</div></div>
<div class="foot"><span>Sample page made for the Connect Lite demo</span><span>16</span></div>
</body></html>`;
writeFileSync(ROOT + "pages/sb-016.html", html);
const { chromium } = await import("../node_modules/playwright/index.mjs");
const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1240, height: 1754 } })).newPage();
await p.goto("file://" + ROOT + "pages/sb-016.html"); await p.waitForTimeout(1500);
await p.screenshot({ path: ROOT + "pages/sb-016.png" }); await b.close();
console.log("pages/sb-016.png");
