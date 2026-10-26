// Records the volunteer Self-study listenings in Lite's house voices (Ramy, 26 Oct 2026: "Make sure we use the right
// audio sound. We want to use the one from OpenAI"; "needs to be level appropriate, obviously"). Until now the page
// read them aloud with the phone's own voice.
//
// Each listening in _private/homework/<set>.json is cut into lines; a dialogue's speakers (A:, B:, Pat:) each get a
// house voice (first a British woman, then a British man, then the American pair), anything else the British woman.
// The pace follows the set's level: slow and very clear at A1-A2, a little slower than natural at B1, natural at B2+.
// Every take is played back to the transcriber and recorded again until it comes back as its words. The files go to
// out/<set>/ named by a hash of what is said, and the lesson gets "audio": ["selfstudy/<set>/<hash>.mp3", ...] and
// "gap" (the pause between lines, ms). Upload with tools/upload-selfstudy-audio.sh, then load the set with putHomework.
//
// On Ramy's Mac, with the key from Connect's .env.local; nothing here holds a key:
//   node --env-file="../CELTA connect-code prompt/.env.local" tools/make-selfstudy-audio.mjs <outdir> s1 s2 ...
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
const VOICES = [
  { name: "sage", accent: "standard Southern British English (RP)" },
  { name: "fable", accent: "standard Southern British English (RP)" },
  { name: "coral", accent: "General American English" },
  { name: "echo", accent: "General American English" },
];
const key = process.env.OPENAI_API_KEY;
if (!key || key.includes("SENSITIVE")) { console.error("OPENAI_API_KEY is not set. Run it with --env-file on the Mac."); process.exit(1); }
const HUB = new URL("../", import.meta.url).pathname;
const OUT = process.argv[2], SETS = process.argv.slice(3);
if (!OUT || !SETS.length) { console.error("make-selfstudy-audio.mjs <outdir> <set> ..."); process.exit(1); }
const LIB = JSON.parse(readFileSync(HUB + "library/tp-point-sets.json", "utf8"));
const PACE = (lvl) => /A[12]/.test(lvl)
  ? { how: "Speak slowly and very clearly, as a teacher recording a listening for elementary learners of English, with a short pause after each sentence.", gap: 900 }
  : /B1/.test(lvl)
    ? { how: "Speak clearly and a little slower than natural, as in a recording for intermediate learners of English.", gap: 700 }
    : { how: "Speak at a natural, unhurried pace, as in a real conversation or radio programme.", gap: 500 };
const words = (t) => String(t).toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9 ]+/g, " ").trim().split(/\s+/).join(" ");
const EXPAND = { youll: "you will", theyre: "they are", whos: "who is", dont: "do not", didnt: "did not", wont: "will not", cant: "cannot", im: "i am", shes: "she is", hes: "he is", its: "it is", ive: "i have", id: "i would", youre: "you are", thats: "that is", lets: "let us", isnt: "is not", arent: "are not", wasnt: "was not", doesnt: "does not", whats: "what is", theres: "there is", weve: "we have", were: "we are", ill: "i will" };
function close(a, b) {
  const x = a.split(" ").flatMap((w) => (EXPAND[w] || w).split(" ")), y = b.split(" ").flatMap((w) => (EXPAND[w] || w).split(" "));
  const m = Array.from({ length: x.length + 1 }, () => new Array(y.length + 1).fill(0));
  for (let i = 1; i <= x.length; i++) for (let j = 1; j <= y.length; j++) m[i][j] = x[i - 1] === y[j - 1] ? m[i - 1][j - 1] + 1 : Math.max(m[i - 1][j], m[i][j - 1]);
  return m[x.length][y.length] / Math.max(x.length, y.length) >= 0.85;
}
// A dialogue line "A: Hello. B: Hi!" becomes two lines, by speaker; the label is not said.
function cut(h) {
  const lines = Array.isArray(h.script) ? h.script : [h.script], out = [];
  for (const line of lines) {
    if (!h.dialogue) { out.push({ who: "", text: String(line).trim() }); continue; }
    const re = /(?:^|\s)([A-Z][A-Za-z]{0,11}):\s/g; let m, last = 0, who = "", parts = [];
    while ((m = re.exec(line))) { const before = line.slice(last, m.index).trim(); if (before) parts.push({ who, text: before }); who = m[1]; last = m.index + m[0].length; }
    const rest = line.slice(last).trim(); if (rest) parts.push({ who, text: rest });
    out.push(...parts);
  }
  return out.filter((x) => /[a-z]/i.test(x.text));
}
async function speak(voice, text, how) {
  for (let i = 0; i < 4; i++) {
    const r = await fetch("https://api.openai.com/v1/audio/speech", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-4o-mini-tts", voice: voice.name, input: text, response_format: "mp3",
        instructions: `Say this exactly as written, once, in ${voice.accent}. ${how} Do not add or leave out any words.` }) });
    if (r.ok) return Buffer.from(await r.arrayBuffer());
    await new Promise((s) => setTimeout(s, 3000));
  }
  throw new Error("speech failed: " + text.slice(0, 60));
}
async function hear(buf) {
  const fd = new FormData(); fd.append("model", "gpt-4o-transcribe"); fd.append("language", "en");
  fd.append("file", new Blob([buf], { type: "audio/mpeg" }), "x.mp3");
  const r = await fetch("https://api.openai.com/v1/audio/transcriptions", { method: "POST", headers: { Authorization: "Bearer " + key }, body: fd });
  return r.ok ? (await r.json()).text || "" : "";
}
const doubtful = [];
for (const set of SETS) {
  const file = `${HUB}_private/homework/${set}.json`, data = JSON.parse(readFileSync(file, "utf8"));
  const pace = PACE(String((LIB[set] || {}).level || ""));
  mkdirSync(`${OUT}/${set}`, { recursive: true });
  let made = 0;
  for (const [lesson, h] of Object.entries(data)) {
    if (h.k !== "listen" || !h.script) continue;
    const segs = cut(h), cast = {}; let n = 0;
    for (const s of segs) if (s.who && !(s.who in cast)) cast[s.who] = VOICES[n++ % VOICES.length];
    const audio = [];
    for (const s of segs) {
      const voice = s.who ? cast[s.who] : VOICES[0];
      const name = createHash("sha1").update(`${voice.name}|${pace.how}|${s.text}`).digest("hex").slice(0, 16) + ".mp3";
      const path = `${OUT}/${set}/${name}`;
      if (!existsSync(path)) {
        let kept = null, got = "";
        for (let take = 1; take <= 5 && !kept; take++) { const buf = await speak(voice, s.text, pace.how); got = await hear(buf); if (close(words(s.text), words(got)) || take === 5) { kept = buf; if (take === 5 && !close(words(s.text), words(got))) doubtful.push(`${set} ${lesson} "${s.text}" heard as "${got}"`); } }
        writeFileSync(path, kept); made++;
      }
      audio.push(`selfstudy/${set}/${name}`);
    }
    h.audio = audio; h.gap = pace.gap;
  }
  writeFileSync(file, JSON.stringify(data, null, 1));
  console.log(`${set}: ${made} lines recorded`);
}
if (doubtful.length) console.log("LISTEN TO THESE (the transcriber did not hear them as written):\n  " + doubtful.join("\n  "));
