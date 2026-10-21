// Records an input session's spoken lines in Lite's four house voices, once,
// into input-sessions/<session>/audio/<voice>/<line>.mp3 (Ramy, 22 Oct 2026).
// The lines are listed in input-sessions/<session>/audio/lines.json:
//   { "lines": [ "letter", { "text": "We don't have any oat milk.", "stress": "oat milk", "speaker": "b" }, ... ] }
// "stress" asks for the main stress on those words; "how" adds a line of direction.
// Every recording is played back to a transcriber, and a take that does not
// come back as its words is recorded again (up to six takes). The transcriber
// cannot hear stress, so lines with "stress" are listed at the end for a person
// to listen to.
//
// On Ramy's Mac, with the key from Connect's .env.local; nothing here holds a key:
//   node --env-file="../CELTA connect-code prompt/.env.local" tools/make-session-audio.mjs phonology-sounds [--all] [--voice uk-man]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const VOICES = {
  "uk-woman": { name: "sage", accent: "standard Southern British English (RP)" },
  "uk-man": { name: "fable", accent: "standard Southern British English (RP)" },
  "us-woman": { name: "coral", accent: "General American English" },
  "us-man": { name: "echo", accent: "General American English" },
};
const key = process.env.OPENAI_API_KEY;
if (!key || key.includes("SENSITIVE")) { console.error("OPENAI_API_KEY is not set. Run it with --env-file on the Mac."); process.exit(1); }
const session = process.argv[2];
if (!session) { console.error("Which session?"); process.exit(1); }
const ROOT = new URL(`../input-sessions/${session}/audio/`, import.meta.url).pathname;
const { lines } = JSON.parse(readFileSync(ROOT + "lines.json", "utf8"));
const all = process.argv.includes("--all");
const only = process.argv.includes("--voice") ? process.argv[process.argv.indexOf("--voice") + 1] : null;
const slug = (t) => String(t).toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
const words = (t) => String(t).toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9 ]+/g, " ").trim().split(/\s+/).join(" ");
// A sentence passes when nearly every word comes back in order: natural speech
// is written "must've" or "gonna" by the transcriber, which is the point of it.
const EXPAND = { mustve: "must have", youll: "you will", theyre: "they are", whos: "who is", dont: "do not", didnt: "did not", wont: "will not", cant: "cannot", im: "i am", shes: "she is", hasnt: "has not", aint: "is not" };
function close(a, b) {
  const x = a.split(" ").flatMap((w) => (EXPAND[w] || w).split(" ")), y = b.split(" ").flatMap((w) => (EXPAND[w] || w).split(" "));
  const m = Array.from({ length: x.length + 1 }, () => new Array(y.length + 1).fill(0));
  for (let i = 1; i <= x.length; i++) for (let j = 1; j <= y.length; j++) m[i][j] = x[i - 1] === y[j - 1] ? m[i - 1][j - 1] + 1 : Math.max(m[i - 1][j], m[i][j - 1]);
  return m[x.length][y.length] / Math.max(x.length, y.length) >= 0.85;
}
const SAME = { too: ["two", "to"], buy: ["bye", "by"], see: ["c", "sea"], four: ["for"], no: ["know"], so: ["sew"], ear: ["here"], tea: ["t", "tee"], key: ["quay"], air: ["heir"], pen: ["pan"] };

async function speak(voice, item) {
  const v = VOICES[voice];
  const single = !/\s/.test(item.text.trim());
  let how = single
    ? `Say only this one English word, once, clearly and slowly enough to hear every sound, in ${v.accent}, as a teacher modelling it for learners. No other words.`
    : `Say this exactly as written, once, in ${v.accent}, at a natural, unhurried pace, as a real person would. Do not add or leave out any words.`;
  if (item.stress) how += ` Put the main sentence stress clearly on "${item.stress}", and keep the other words light.`;
  if (item.how) how += " " + item.how;
  const r = await fetch("https://api.openai.com/v1/audio/speech", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-4o-mini-tts", voice: v.name, input: item.text, instructions: how, response_format: "mp3" }) });
  if (!r.ok) throw new Error(`${r.status} ${(await r.text()).slice(0, 200)}`);
  return Buffer.from(await r.arrayBuffer());
}
async function hear(buf, single) {
  const fd = new FormData(); fd.append("model", "gpt-4o-transcribe"); fd.append("language", "en");
  if (single) fd.append("prompt", "A single English word.");
  fd.append("file", new Blob([buf], { type: "audio/mpeg" }), "x.mp3");
  const r = await fetch("https://api.openai.com/v1/audio/transcriptions", { method: "POST", headers: { Authorization: "Bearer " + key }, body: fd });
  return r.ok ? (await r.json()).text || "" : "";
}
const items = lines.map((l) => (typeof l === "string" ? { text: l } : l));
const listen = [], doubtful = [];
for (const voice of Object.keys(VOICES)) {
  if (only && voice !== only) continue;
  mkdirSync(ROOT + voice, { recursive: true });
  let made = 0;
  for (const it of items) {
    const target = `${ROOT}${voice}/${slug(it.text)}${it.stress ? "--" + slug(it.stress) : ""}.mp3`;
    if (existsSync(target) && !all) continue;
    const want = words(it.text), single = !/\s/.test(it.text.trim());
    let kept = null, last = "";
    for (let take = 1; take <= (+process.env.TAKES || 6) && !kept; take++) {
      const buf = await speak(voice, it);
      const got = words(await hear(buf, single)); last = got;
      if (got === want || (SAME[want] || []).includes(got) || (!single && close(got, want))) kept = buf;
      else if (take === 1) kept = null;
      if (!kept && take === (+process.env.TAKES || 6)) { kept = buf; doubtful.push(`${voice} "${it.text}" heard as "${got}"`); }
    }
    writeFileSync(target, kept); made++;
    if (it.stress) listen.push(`${voice} "${it.text}" (stress on ${it.stress})`);
  }
  console.log(`${voice}: ${made} made`);
}
if (doubtful.length) console.log("\nNever heard right in six takes, kept the last; listen to these:\n" + doubtful.join("\n"));
if (listen.length) console.log(`\n${listen.length} lines ask for a stress the transcriber cannot hear; listen to a few of them.`);
