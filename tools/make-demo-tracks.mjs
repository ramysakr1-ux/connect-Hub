// Five short listening tracks for the Connect demo (Ramy, 28 Oct 2026: "this is very important ... to show that the audio
// is built in"). The publishers' recordings are not ours to ship, so the demo's TP points carry recordings of OUR OWN scripts
// in two of the house voices, labelled "Made for the Connect demo". Written by Connect, about everyday things, at an
// elementary level; none is from a coursebook.
//
//   node --env-file="../CELTA connect-code prompt/.env.local" tools/make-demo-tracks.mjs
import { writeFileSync, mkdirSync } from "node:fs";
const key = process.env.OPENAI_API_KEY;
if (!key || key.includes("SENSITIVE")) { console.error("OPENAI_API_KEY is not set. Run it with --env-file on the Mac."); process.exit(1); }
const VOICE = { w: { name: "coral" }, m: { name: "echo" } };
const ACCENT = "General American English";
const TRACKS = {
  1: ["A table for two", [["w", "Good evening. Do you have a table for two?"], ["m", "Yes, we do. Do you have a booking?"], ["w", "No, we don't. Is that a problem?"], ["m", "Not at all. Please follow me. Is by the window okay?"], ["w", "That's perfect, thank you."], ["m", "Here are your menus. I'll be back in a few minutes."]]],
  2: ["A message about a bag", [["w", "Hello, Marta. It's Sam. I think I have your bag."], ["w", "It's the small blue one, with a red scarf inside."], ["w", "I found it on the number twelve bus this morning."], ["w", "I'm at work until six, so please call me before then. Bye for now."]]],
  3: ["My Saturday", [["m", "On Saturdays I get up late, at about nine o'clock."], ["m", "Then I make a big breakfast: eggs, toast and coffee."], ["m", "In the afternoon I play football with my brother."], ["m", "In the evening we cook dinner together and watch a film. I love Saturdays."]]],
  4: ["Where do you live?", [["m", "So, Ana, where do you live?"], ["w", "I live in a small flat near the river, with my sister."], ["m", "Is it far from your work?"], ["w", "Not really. I take the train, and it's only twenty minutes."], ["m", "That's good. And do you like your area?"], ["w", "Yes, I do. There's a park, a market and a lovely cafe on my street."]]],
  5: ["Planning a weekend", [["w", "Are you free this weekend, Tom?"], ["m", "I think so. What are you thinking?"], ["w", "Maybe we could go to the lake on Sunday. The weather is going to be nice."], ["m", "Good idea. I'll bring some sandwiches."], ["w", "And I'll bring the drinks. Shall we meet at ten at the station?"], ["m", "Perfect. See you there."]]],
};
async function speak(who, text) {
  const body = { model: "gpt-4o-mini-tts", voice: VOICE[who].name, input: text, response_format: "mp3",
    instructions: `Say this exactly as written, once, in ${ACCENT}, at a natural, slightly slow pace, as a clear speaker would for elementary learners. Do not add or leave out any words.` };
  const r = await fetch("https://api.openai.com/v1/audio/speech", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`${r.status} ${(await r.text()).slice(0, 200)}`);
  return Buffer.from(await r.arrayBuffer());
}
const OUT = new URL("../demo-media/connect-demo/audio/", import.meta.url).pathname; mkdirSync(OUT, { recursive: true });
for (const [n, [title, lines]] of Object.entries(TRACKS)) {
  const parts = [];
  for (const [who, text] of lines) parts.push(await speak(who, text));
  const buf = Buffer.concat(parts); writeFileSync(`${OUT}track-${n}.mp3`, buf);
  console.log(`track-${n}.mp3  ${title}  ${(buf.length / 1024).toFixed(0)} KB`);
}
