/**
 * Connect Lite — mint a demo course someone can actually try.
 *
 *   node demo-mint.mjs "Jane Okonkwo"      (the name is just a label on the course)
 *
 * Ramy, 25 Sep 2026, on sending a demo to a trainer who asks: they must not
 * open an empty course. Then, 26 Sep, on the animation: "I want the plan to be
 * full and LA sheet included. I want the feedback to be full. A lot of
 * writing. Trainers like to write a lot." So this leaves a course standing
 * that has been LIVED IN, end to end:
 *
 *   six candidates in two groups; three teaching practices each for the first
 *   three, two for the next two, one plus a plan awaiting feedback for the
 *   last -- every plan full, with its language analysis sheet; every feedback
 *   long, in every box, returned through the exchange the way a tutor who
 *   dictates would; the first-half tutor signing weeks 1-2 and the second
 *   signing week 3; the assignments through submission, marking, one
 *   resubmission cycle, one returned unmarked and one extension; a provisional
 *   grade for all six with the four course-level fields written, three final
 *   grades, and the final report ready to open.
 *
 * It drives the REAL pages against the REAL store, exactly as a tutor and a
 * candidate would, for the same reason the walks do: hand-writing store
 * records means guessing at their shape, and a guess about that shape is what
 * cost an afternoon on 25 Sep.
 *
 * Three rules make it deterministic, and all three exist because guessing
 * failed first:
 *
 *   WAIT FOR THE RECORD BEFORE TYPING. Every screen paints from static HTML,
 *   then repaints when the store answers, and the repaint WIPES what was typed
 *   in between -- silently.
 *
 *   TYPE, THEN CHECK IT STUCK (stickyFill / stickyType).
 *
 *   NEVER WAIT ON AN ON-SCREEN MESSAGE. The store is the only durable proof;
 *   `until` polls that.
 *
 * The owner key is not in this repo and must not be. Put it in a file called
 * .owner-key beside this script, or pass OWNER_KEY in the environment.
 * Delete the course afterwards with demo-clear.mjs — deleting it kills all
 * three of its links at once, which is what "the demo expires" means here.
 */
import { chromium } from 'playwright';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const HERE = new URL('.', import.meta.url).pathname;
const SITE = process.env.SITE || 'https://ramysakr1-ux.github.io/connect-Hub/';
const STORE = (readFileSync(join(HERE, 'hub-store.js'), 'utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/) || [])[0];
const LABEL = process.argv[2] || 'Demo';
const DAY = 864e5;

const KEYFILE = join(HERE, '.owner-key');
function ownerKey() {
  if (process.env.OWNER_KEY) return process.env.OWNER_KEY.trim();
  if (existsSync(KEYFILE)) return readFileSync(KEYFILE, 'utf8').trim();
  console.error('No owner key. Put it in .owner-key beside this script, or pass OWNER_KEY=...');
  process.exit(1);
}
const OWNER = ownerKey();

function explain(err){
  const m = String(err && err.message || err);
  if (/not yours|owner/i.test(m)) { console.error('The store did not accept the owner key. Check .owner-key holds the whole key.'); process.exit(1); }
  console.error('The store said: ' + m); process.exit(1);
}
/* The store sometimes answers a call with an HTML page instead of JSON -- a
   Google interstitial under load -- and hub-store.js treats that as transient
   and tries again. So does this: the third run died on exactly that, one
   poll after Emily Carter's first feedback had landed. */
const call = async (body, tries = 6) => {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(STORE, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(body) });
      const text = await r.text();
      let out; try { out = JSON.parse(text); } catch (e) { throw Object.assign(new Error('the store answered with a page, not JSON'), { transient: true }); }
      if (!out.ok) explain(new Error(out.error || 'store error'));
      return out.result;
    } catch (e) {
      last = e; if (!(e && (e.transient || /fetch failed|ECONNRESET|ETIMEDOUT/.test(String(e))))) throw e;
      await new Promise(res => setTimeout(res, 3000 * (i + 1)));
    }
  }
  throw last;
};
const settle = (p, ms) => p.waitForTimeout(ms);
const log = s => console.log('  ' + s);

async function stickyFill(p, sel, value, tries = 8) {
  for (let i = 0; i < tries; i++) {
    await p.fill(sel, value);
    await p.waitForTimeout(1200);
    if ((await p.inputValue(sel)) === value) return;
  }
  throw new Error(sel + ' would not hold its value');
}
/* Twenty seconds for the confirm, not four: the turn-in (and the return) go
   to the store BEFORE they ask, and the store takes what it takes -- run nine
   died on a plan that was never turned in because its "Turn in anyway" came
   up after the four seconds had passed. Every click routed through here is
   one that expects a question, so the long wait costs nothing when it comes
   and only waits when it does not. */
async function clickAndConfirm(p, selector) {
  await p.click(selector);
  const dialog = await p.waitForSelector('.confirm-action', { state: 'visible', timeout: 20000 }).catch(() => null);
  if (dialog) { await dialog.click(); }
  return !!dialog;
}
/* Set a value the way the page's own listeners expect: value, then an input
   event, so autosave, dirty and the running totals all see it. */
const setVal = (p, sel, v) => p.evaluate(([s, v]) => { const el = document.querySelector(s); if (!el) throw new Error('no ' + s); el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); }, [sel, v]);
/* Paste text onto the page: the exchange listens for it and fills the boxes. */
const paste = (p, txt) => p.evaluate(txt => { const dt = new DataTransfer(); dt.setData('text/plain', txt); document.body.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true })); }, txt);

/* hub-sync RELOADS a page when the course record has moved on ("The course
   has moved on -- refreshing", hub-sync.js:477), which on a fresh course is
   most pages the first time they open after a save. A handle taken before
   that reload dies with "execution context was destroyed". So: go, wait for
   the marker, and keep waiting until three seconds pass with no navigation. */
async function gotoSettled(p, u, marker) {
  await p.goto(u, { waitUntil: 'domcontentloaded' });
  for (let i = 0; i < 8; i++) {
    await p.waitForSelector(marker, { timeout: 40000 });
    const nav = await p.waitForEvent('framenavigated', { predicate: f => f === p.mainFrame(), timeout: 3000 }).then(() => true).catch(() => false);
    if (!nav) break;
    if (i === 7) throw new Error('the page kept reloading: ' + u.replace(/\?.*/, ''));
  }
  /* ...and then for the boot itself. The sync pill (#hubSync) reads "Checking
     the course..." until the store has answered and the app script has been
     replaced; touching the form before that is typing into a page that is
     about to be repainted. "Live -- saved to the course as you go" is the
     all-clear (hub-sync.js:482); "Could not reach" is an answer too. */
  await p.waitForFunction(() => { const el = document.getElementById('hubSync'); return el && /^(Live|Assessor view|Could not reach)/.test(el.textContent || ''); }, null, { timeout: 45000 }).catch(() => {});
  await p.waitForTimeout(800);
}
/* The lesson shape is a menu: open it, see it open, then pick. If the page
   repainted between the two clicks the menu is gone; open it again. */
async function pickShape(p, label) {
  for (let i = 0; i < 6; i++) {
    await p.click('#fwBtn'); await p.waitForTimeout(350);
    const open = await p.$eval('#fwMenu', m => !m.hidden).catch(() => false);
    if (!open) continue;
    try { await p.click(`.fw-item:has-text("${label}")`, { timeout: 4000 }); return; } catch (e) {}
  }
  throw new Error('could not pick the lesson shape ' + label);
}
async function evalRetry(p, fn, arg, tries = 6) {
  for (let i = 0; i < tries; i++) {
    try { return await p.evaluate(fn, arg); }
    catch (e) { if (!/context was destroyed|navigation/i.test(String(e))) throw e; await p.waitForTimeout(1500); }
  }
  throw new Error('the page would not hold still for evaluate');
}
const day = n => new Date(Date.now() + n * DAY).toISOString().slice(0, 10);
const recOf = t => (t && t.records) || {};
/* Wait for the STORE to show it, by name, rather than guessing how long a
   sync takes. */
async function untilRec(name, what, test, tries = 15, gap = 5000) {
  for (let i = 0; i < tries; i++) {
    const r = await call({ op: 'roster', key: K });
    const t = Object.values((r && r.trainees) || {}).find(x => x.name === name);
    if (t && test(recOf(t), t)) return t;
    await new Promise(res => setTimeout(res, gap));
  }
  throw new Error('waited a minute and ' + what + ' for ' + name + ' never reached the store');
}

/* ======================= the course, as content ======================= */
/* Connect's own demo tutors -- the MCT and the ACT, one TP group each,
   swapping at the halfway point (Ramy, 26 Sep 2026: "I don't want to be the tutor... use a name from
   Connect. MCT and ACT"). */
const TUTOR_1 = 'Jordan Blake', TUTOR_2 = 'Diane Okonkwo';   // ACT a woman (Ramy, 26 Sep 2026)
/* Twelve, in two teaching practice groups of six (Ramy, 26 Sep 2026: "make
   it 12 candidates"), invented names in the mix his courses have -- American,
   Turkish, Russian -- and NOT the names of anyone on a real course (his
   words, same day). Work is spread unevenly, the way a real course is. */
const COHORT = [
  { name: 'Emily Carter',        group: '1', tps: 3 },
  { name: 'Defne Yılmaz',        group: '1', tps: 3 },
  { name: 'Anastasia Volkova',   group: '1', tps: 3 },
  { name: 'Jacob Miller',        group: '1', tps: 2 },
  { name: 'Zeynep Aydın',        group: '1', tps: 2, pending: true },   // TP3 plan turned in, awaiting feedback
  { name: 'Dmitry Sokolov',      group: '1', tps: 1, pending: true },   // TP2 plan turned in, awaiting feedback
  { name: 'Madison Reyes',       group: '2', tps: 3 },
  { name: 'Emre Koçak',          group: '2', tps: 2 },
  { name: 'Ekaterina Morozova',  group: '2', tps: 2 },
  { name: 'Tyler Brooks',        group: '2', tps: 1, pending: true },   // TP2 plan turned in, awaiting feedback
  { name: 'Can Demir',           group: '2', tps: 1 },
  { name: 'Nikita Petrov',       group: '2', tps: 1 },
];
const DRIVE = id => 'https://drive.google.com/file/d/1' + id + 'Lite/view';

/* Three lessons, one per teaching practice -- a grammar lesson, a reading
   lesson, a functional one -- each with its full plan and its analysis sheet. */
const LESSONS = [
  { shape: 'Present – Practice – Produce (PPP)', level: 'A2', length: 45, la: 'grammar',
    main: '• To clarify and give controlled and freer practice of the past simple (regular and common irregular verbs) in the context of talking about last weekend',
    sub: '• To develop oral fluency through a personalised speaking task\n• To revise time expressions for the past (yesterday, last night, two days ago)',
    pers: '• Give the instruction before handing out the paper, and check it with a question (TP action point)\n• Keep the open-class feedback short — take two answers, not six',
    profile: '12 adults at A2, mixed L1 (Turkish, Arabic, Spanish, one Farsi speaker). A warm, talkative group who enjoy pair work; three are quiet in open class but contribute well in pairs. They have met the past simple of "be" and a handful of regular verbs; irregulars are new.',
    mats: '• Speakout 2nd ed. Elementary, Unit 6.1 (adapted)\n• Handout 1 — six photos of a weekend\n• Handout 2 — gap-fill, 10 items\n• Board timeline',
    probs: [['The audio for the listening may be hard to hear at the back of the room.', 'Test the speakers before the lesson; play it twice if the first gist check shows they missed it.'],
            ['Three learners are quiet in open class and may not contribute in the production stage.', 'Put each with a stronger partner and nominate them by name after the pair work, when they already have an answer ready.'],
            ['The gap-fill handout may be too easy for the two strongest learners.', 'Have a second, harder question ready: "Write two more sentences about your own weekend."']],
    stages: [
      ['Lead-in', 'To set the context and generate interest in the topic', '• Show two of the weekend photos on the board. Ss discuss in pairs: what did these people do?\n• Take two or three answers in open class. No correction at this stage — the aim is interest, not accuracy.', 'PW + OC', 5],
      ['Present: clarify and focus on TL', 'To clarify the meaning, form and pronunciation of the past simple', '• Elicit a marker sentence from the photos: "She played tennis on Saturday."\n• Timeline on the board; CCQs: Is it now? (no) Is it finished? (yes) Do we know when? (yes)\n• Highlight the form: subject + verb-ed. Board three irregulars from the lesson: went, had, saw.\n• Drill: choral, then individual, with attention to the /d/ /t/ /ɪd/ endings.', 'T–S + OC', 12],
      ['Practice', 'To give controlled practice of the target language with a focus on accuracy', '• Handout 2, the gap-fill. Ss work alone, then compare in pairs.\n• Monitor closely; note any errors with the irregulars for the feedback stage.\n• Open-class check: nominate, then ask "Why?" for two of the trickier items.', 'Ind. + PW + OC', 10],
      ['Production', 'To give freer, personalised practice of the target language', '• "Three things you did last weekend, one is a lie." Ss write three sentences.\n• In new pairs, Ss read their three sentences; the partner guesses the lie.\n• Monitor for use of the past simple; note good examples and errors on a slip for delayed correction.', 'Ind. + PW', 13],
      ['Error correction', 'To correct learners’ output and consolidate the key teaching points', '• Board four sentences from the monitoring — two correct, two with errors. Ss decide in pairs which need fixing.\n• Open-class check; drill the corrected forms.', 'PW + OC', 5]],
    laBlock: { item: 'Past simple (regular and irregular) for finished actions at a definite time in the past',
      marker: '“She played tennis on Saturday.”\n“We went to the cinema last night.”',
      meaning: 'The action started and finished in the past, at a time we know or can name. The time can be stated (on Saturday, last night) or clear from the context. It is not connected to the present — contrast with the present perfect, which these learners have not yet met and which I will not raise.',
      source: 'Swan, Practical English Usage, 4th ed., §§ 48–50; Parrott, Grammar for English Language Teachers, ch. 21.',
      clarify: 'Timeline with a cross at "Saturday" and "now" marked at the right, no line between them.\nCCQs: Is she playing tennis now? (no) · Did it happen before now? (yes) · Do we know when? (yes — Saturday) · Is it finished? (yes)',
      form: 'Regular: subject + verb + -ed (played, watched, cooked).\nIrregular: subject + past form (went, had, saw, ate).\nNegative: subject + didn’t + base form. Question: Did + subject + base form?\nSpelling: stop → stopped, study → studied.',
      phon: '/ʃiː pleɪd ˈtenɪs ɒn ˈsætədeɪ/',
      phonfeat: 'The -ed ending: /d/ after voiced sounds (played), /t/ after unvoiced (watched), /ɪd/ after /t/ and /d/ (wanted, needed). Learners tend to say /ɪd/ for all three. Weak form of "on" /ən/ in connected speech.',
      probM: [['Ss use the present simple for finished past actions: "I play tennis on Saturday" meaning last Saturday.', 'Timeline contrast on the board, then a quick choice drill: "now or Saturday?"']],
      probF: [['Ss add -ed to irregulars: "goed", "haved".', 'Board the three irregulars from the lesson and drill them; keep a running list on the side of the board.'], ['Ss keep the past form after didn’t: "I didn’t went".', 'Highlight didn’t + base form with a substitution drill of four verbs.']],
      probP: [['Ss pronounce every -ed as /ɪd/: "playedid".', 'Sort six verbs into three columns by ending sound; drill each column.']] },
    self: { well: '• The lead-in worked — the photos got everyone talking straight away, and by the time I boarded the marker sentence they had already produced two of the irregulars themselves.\n• The gap-fill was pitched right for most of the group. The pair check meant the quiet three had an answer before I nominated them, which was my personal aim, and it worked.',
      not: '• The presentation stage ran nearly four minutes over. I spent too long on the timeline for a group that had mostly got it, and that ate into the production stage.\n• I gave the instruction for the "one is a lie" task while handing out slips, so half the room heard it and half didn’t — exactly the thing I said I would not do.',
      learn: '• That the CCQs were doing the work, not the timeline. Two questions would have been enough.\n• That a task instruction given before the handout is a completely different thing from one given during it. I knew it in theory; I saw it in the room.',
      diff: '• Put the timeline up in advance, ready to reveal, and cap the presentation at ten minutes with a visible clock.\n• Handouts face down on the desks before the instruction; instruction, check, then "turn it over".',
      next: '• Instructions before the paper, every time — and check with a question, not "OK?"\n• Keep the presentation stage inside its time so the production stage gets the minutes the plan gives it.' } },

  { shape: 'Receptive Skills (reading or listening)', level: 'A2', length: 45, la: 'vocab',
    main: '• To practise reading for gist and for specific information using a short article about an unusual job\n• To pre-teach and consolidate the vocabulary the text depends on',
    sub: '• To develop oral fluency through a reaction task\n• To give practice in predicting content from a headline and picture',
    pers: '• Keep the open-class feedback short (TP action point — carried forward)\n• Set the gist task before handing out the text, and check it',
    profile: 'Same 12 adults at A2. Since TP1 two more have found their voice in open class. Reading is the skill they say they find hardest; several read word by word and translate. Skimming under time pressure is the thing this lesson is for.',
    mats: '• Adapted article, "The man who counts penguins" (140 words, simplified from a news piece)\n• Handout 1 — vocabulary matching, six items\n• Handout 2 — gist question and four detail questions\n• Two photos for the lead-in',
    probs: [['Ss will try to read every word and translate, and the gist task will take too long.', 'Set a tight time limit (90 seconds), say it, show it on the clock, and stop them when it ends even if they have not finished.'],
            ['The two photos may give the answer away before the prediction task.', 'Show the photos one at a time, the second only after predictions are in.'],
            ['Detail questions may split the group: some finish in two minutes, some need five.', 'Early finishers compare with a neighbour and write one more question of their own for the class.']],
    stages: [
      ['Lead-in', 'To activate learners’ existing knowledge of the topic and generate interest', '• Photo 1 on the board: a penguin colony. Ss in pairs: where is this, and would you like to work there?\n• Two answers in open class.', 'PW + OC', 4],
      ['Prediction task', 'To encourage learners to predict the content of the text', '• Board the headline only. Ss predict three things the article will say, in pairs.\n• Collect predictions on the board — they will be checked after the gist reading.', 'PW + OC', 4],
      ['Pre-teach vocabulary', 'To unblock the six items the tasks depend on', '• Handout 1: match six words to pictures/definitions (count, colony, remote, freezing, volunteer, survey).\n• Check in pairs, then open class; drill the three with tricky stress: COLony, reMOTE, VOLunteer.', 'Ind. + PW + OC', 8],
      ['Reading for gist', 'To practise reading quickly for the main idea', '• Set the gist question BEFORE handing out the text: "What is his job, and does he like it?" Check the instruction with a question.\n• 90 seconds, alone. Text face down until "go".\n• Ss compare in pairs; quick open-class check, then back to the predictions on the board — which were right?', 'Ind. + PW + OC', 8],
      ['Reading for detail', 'To practise reading for specific information', '• Handout 2, the four detail questions. Ss work alone, then check in pairs.\n• Monitor; note who is still reading word by word.\n• Open-class check: Ss justify each answer by pointing to the line in the text.', 'Ind. + PW + OC', 12],
      ['Post-reading task', 'To develop oral fluency by reacting to the text', '• In groups of three: would you do this job for a year? What would be the best and worst thing about it?\n• Monitor for fluency; note two good phrases and two errors for the board.\n• Brief open-class round-up; delayed correction of the two errors.', 'GW + OC', 9]],
    laVocab: [['count (v)', 'to find out how many of something there are, by saying the numbers in order', 'Mime counting on fingers; CCQ: do I want to know how many? (yes)', 'verb, regular; count + noun', 'Confusion with "account"; Ss may use "number" as a verb'],
              ['colony (n)', 'a large group of animals of the same kind living together in one place', 'Photo of the penguin colony; CCQ: one penguin or many? (many) together or apart? (together)', 'noun, countable; a colony of penguins/ants', 'Stress on COL-ony, not co-LO-ny; Ss may read the L1 cognate meaning'],
              ['remote (adj)', 'far away from any town or city; hard to get to', 'Map: point to the island, then the nearest town, 400 km away', 'adjective; a remote island/village', 'Stress: re-MOTE; Ss confuse with "remote control"'],
              ['volunteer (n)', 'a person who does a job without being paid, because they want to', 'CCQ: does he get money? (no) does he want to do it? (yes)', 'noun, countable; also a verb (to volunteer)', 'Stress: vol-un-TEER; Ss stress the first syllable']],
    self: { well: '• Setting the gist task before the handout, and checking it with a question. It was the thing I most wanted to get right after TP1 and it changed the whole stage — they read fast because they knew what they were reading for.\n• The vocabulary matching was quick and the drilling of the three stress patterns paid off; I heard "reMOTE" correctly in the group discussion.',
      not: '• The prediction stage was slightly flat: the headline alone did not give them much to go on and two pairs just waited.\n• I over-monitored during the detail reading and interrupted a pair who were about to work it out themselves.',
      learn: '• A time limit only works if you stop them when it ends. I said 90 seconds and gave them nearly three minutes, and the point of the gist stage was lost for the slower readers.\n• Justifying answers by pointing to the line in the text was the best part of the lesson — it made the detail stage about reading, not about memory.',
      diff: '• Give the prediction stage a picture as well as the headline, or drop it and give the time to the post-reading discussion, which they clearly wanted more of.\n• Set the timer where they can see it and stop at zero.',
      next: '• Stop at the time limit.\n• Monitor from a distance during individual reading; save the intervention for the pair check.' } },

  { shape: 'Text-Based Presentation of Language', level: 'B1', length: 45, la: 'function',
    main: '• To present and give practice of functional language for making, accepting and declining invitations, in the context of a weekend plan',
    sub: '• To develop speaking fluency in a role-play\n• To raise awareness of intonation in polite refusals',
    pers: '• Stop at the time limit (TP2 action point)\n• Monitor from a distance during individual work',
    profile: '10 adults at B1 (the higher level for the second half of the course). Two Spanish speakers, three Turkish, two Arabic, one Ukrainian, one Japanese, one Brazilian. Confident and fluent for the level, with fossilised errors in polite forms — a refusal often comes out as a flat "no". They enjoy role-play.',
    mats: '• A short dialogue (WhatsApp exchange, 8 turns) written for the lesson\n• Handout 1 — the dialogue with the key phrases gapped\n• Role cards for the final task, six situations\n• Audio of the dialogue recorded by two colleagues',
    probs: [['Ss may treat the dialogue as a reading text and try to translate every line.', 'Play it as a listening first with a gist question; the text comes out only for the language focus.'],
            ['The role-play may stall if the cards are too open.', 'Each card has one line of situation and one line of "you want to / you can’t because", so both sides know their job.'],
            ['Polite refusals are longer than the "no" they are used to, and they may drop the softening.', 'Drill the whole chunk with the intonation, then the substitution drill keeps the chunk and changes only the reason.']],
    stages: [
      ['Lead-in / building context', 'To generate interest in the context of the text', '• "What are you doing this weekend?" — Ss in pairs for one minute, then two answers in open class.\n• Photo of two friends looking at phones: what are they arranging?', 'PW + OC', 4],
      ['Reading or listening task', 'To introduce the target language through a text', '• Gist question on the board: "Who says yes, who says no, and why?" Play the audio once.\n• Ss compare in pairs; open-class check.', 'Ind. + PW + OC', 6],
      ['Highlighting target language', 'To draw attention to the exponents in the text', '• Handout 1 with the eight phrases gapped. Ss complete from memory, then listen again to check.\n• Ss underline: which phrases invite, which accept, which decline?', 'Ind. + PW', 7],
      ['Clarifying target language', 'To clarify the meaning, form and pronunciation of the exponents', '• Board the three groups. Meaning: CCQs on register — would you say this to your boss? to a friend?\n• Form: "Would you like to + base form", "I’d love to, but…", "I’m afraid I can’t — I’m …ing".\n• Pronunciation: the fall-rise on "I’d love to, but…"; drill the whole chunk, then backchain.', 'T–S + OC', 10],
      ['Language practice', 'To give controlled then freer practice of the target language', '• Substitution drill around the room: invite → decline with a reason → accept.\n• Role cards in pairs: three rounds, swapping cards and partners each round.\n• Monitor for the softening; note examples.', 'PW', 13],
      ['Feedback', 'To establish correct answers and deal with the results of the task', '• Two good exchanges re-enacted for the class.\n• Board two refusals heard without the softening; Ss repair them.', 'OC', 5]],
    laBlock: { item: 'Making, accepting and declining an invitation — informal, between friends arranging a weekend',
      register: 'Informal',
      marker: 'Inviting: “Would you like to come to the cinema on Saturday?” · “Do you fancy a coffee later?”\nAccepting: “I’d love to.” · “Sounds great — what time?”\nDeclining: “I’d love to, but I’m working.” · “I’m afraid I can’t — I’ve got a thing on Saturday.”',
      meaning: 'The invitation is genuine but not pressing; the reply is expected to be warm even when it is a no. The declining forms carry a softener (“I’d love to, but…”, “I’m afraid…”) followed by a reason; a bare “no” reads as rude in this register. Accepting is short and enthusiastic.',
      source: 'Cambridge English Dictionary entries for "fancy", "I’m afraid"; Speakout B1 Unit 3.2 functional language box.',
      clarify: 'Register CCQs: Is this a friend or your manager? (friend) · Is "I’m afraid I can’t" polite or rude? (polite) · If I only say "No", how does my friend feel? (a bit hurt)\nShow the WhatsApp exchange as the model — the softener is always there.',
      form: 'Would you like + to-infinitive · Do you fancy + noun/-ing · I’d love to (+ but + clause) · I’m afraid + I can’t (+ reason in present continuous or "I’ve got…")',
      phon: '/aɪd ˈlʌv tuː | bʌt aɪm ˈwɜːkɪŋ/',
      phonfeat: 'Fall-rise on "I’d love to" signals the coming "but". "Would you" → /wʊdʒə/ in fast speech. Weak "to" /tə/ before a consonant.',
      probM: [['Ss decline with a flat "No, I can’t" and think it is fine.', 'Play the two versions and ask the class which friend they would invite again; then drill the softened chunk.']],
      probF: [['Ss say "Would you like come" without "to".', 'Highlight "to" on the board in a second colour and finger-highlight in the drill.']],
      probP: [['Flat intonation on "I’d love to, but" makes it sound sarcastic.', 'Hand gesture for the fall-rise; drill in chorus, then individually, exaggerated first.']] },
    self: { well: '• The listening-first approach meant nobody translated the dialogue; they heard the phrases as chunks and the gapped handout worked as a check, not a test.\n• The intonation drilling landed. In the role-play I heard the fall-rise from most pairs without prompting.',
      not: '• The clarification stage was heavy — three groups of phrases, meaning, form and pronunciation for each. Ten minutes was optimistic and I went to fourteen.\n• I did not get to the feedback stage properly; one exchange re-enacted, no board work.',
      learn: '• Functional language needs fewer exponents, drilled better, not more exponents covered. Two per function would have been plenty.\n• Role cards with a "you can’t because" line work — the refusals were natural because they had a reason ready.',
      diff: '• Cut the exponents to two per function and give the minutes saved to the feedback stage.\n• Put the feedback board work up during the last round of the role-play so it is ready.',
      next: '• Plan the clarification stage with a hard stop, and put the timer where I can see it.\n• Protect the feedback stage — it is where the learning gets consolidated.' } },
];

/* Feedback, written the way a tutor writes -- long, specific, second person.
   Varied by grade so the six records do not read as one. */
const STAGE_COMMENTS = [
  'A good, quick way in. The photos did the work and you resisted correcting at this stage — right call.',
  'Clear and well staged. Your CCQs were concise and you waited for the answers. Watch the time: this ran long, and it was the presentation rather than the practice that took it.',
  'Well set up — instruction, then paper, then a check question. This is the thing you said you would do and you did it.',
  'Good monitoring here, and the slip of errors for later was exactly right. You could have let this run another two minutes; they were engaged and producing.',
  'Nicely handled. Two correct and two incorrect on the board is a good pattern — it keeps the correction from feeling like a list of failures.',
  'You ran out of time for this stage, which is a planning point rather than a teaching one: the minutes went earlier.',
];
const LA_COMMENTS = [
  'Thorough and accurate. The anticipated problems are the right ones for this group and the solutions are practical, not theoretical.',
  'Good. Your form analysis would benefit from one more example of the negative; otherwise this is a sheet you could teach from.',
  'The phonology here is careful and correct, and I saw you use it — the -ed endings were drilled as you planned.',
  'Clear. The register note is exactly what the lesson needed and it showed in the drilling.',
];
function feedbackFor(name, tpIndex, grade) {
  const strong = grade === 'Above standard';
  return {
    grade,
    sp: [ 'Aims are stated in the learners’ terms and are achievable in the time — a real improvement on the first plan',
          'The procedure reads as a lesson: one action per line, with the interaction pattern and timing for every stage',
          'Anticipated problems are specific to this group, and each has a solution you could actually use',
          strong ? 'The language analysis is a model of its kind — meaning, form and pronunciation, each with a problem and a solution' : 'The language analysis covers meaning, form and pronunciation, with a source cited' ].slice(0, strong ? 4 : 3),
    ap: [ '★ Give each stage the time the plan says it has — the presentation ran over and the production stage paid for it',
          'Write the CCQs into the plan with the expected answers, so you can see at a glance which ones are doing the work',
          tpIndex === 0 ? 'Add a stage aim for the error-correction stage — it is the only one without one' : 'Cut the exponents to the two you will actually drill; the rest can stay in the analysis sheet' ],
    st: [ 'Warm with the group from the first minute; you use names and you wait for answers',
          'Instructions were given before the handout and checked with a question — clearly, every time',
          'Monitoring was purposeful: you were listening for the target language, and the slip of examples you collected made the feedback stage',
          strong ? 'The drilling was crisp and the intonation work was genuinely good — the learners were using it unprompted by the role-play' : 'Board work was clear and organised, and the learners could copy from it' ].slice(0, strong ? 4 : 3),
    at: [ '★ Reduce teacher talk in the feedback stages: take two answers, not six, and move on',
          'Nominate the quieter learners by name after the pair check, when they have an answer ready',
          tpIndex < 2 ? 'Stop at the time limit you set — say it, show it, and stop them at zero' : 'Protect the final feedback stage; it is where the lesson gets consolidated' ],
    overall: `A ${strong ? 'strong' : 'solid'} lesson, ${name.split(' ')[0]}, and a clear step forward from the last one. The learners were engaged from the first minute and they produced the target language — that is the test, and you passed it. The plan was thorough and you taught the plan you wrote, which is not nothing. The single thing to work on is time: the lesson lost its last stage because the earlier ones ran over, and the last stage is where the learning gets consolidated. Everything else here is a matter of degree.`,
    self: 'This is an honest and useful self-evaluation. You have identified the same two things I did — the timing and the instruction given during the handout — and you have said what you will do about them. That is what this document is for. One note: give yourself credit for what went well in the same detail you give to what did not.',
    la: LA_COMMENTS[tpIndex % LA_COMMENTS.length],
  };
}

/* A written assignment, at length -- roughly 850 words, the way a candidate
   writes one. */
const FOL_TEXT = [
  'My teaching practice group is a class of twelve adults at A2 level. They are mixed in first language — Turkish, Arabic, Spanish and one Farsi speaker — and mixed in age, from a nineteen-year-old student to a retired engineer in his sixties. Most of them are learning English for work or for travel; two are preparing to join family abroad. This mix matters for the classroom because their reasons for learning shape what they are willing to do: the younger learners are happy to take risks in speaking, while the older learners prefer to see the language written down before they use it.',
  'For this assignment I chose to focus on one learner, Selin, a Turkish speaker in her thirties who works in a hotel reception. I spoke to her for twenty minutes after class and looked at two pieces of her written work. Her motivation is clear and specific: she needs to deal with guests in English, on the phone and at the desk, and she is embarrassed when she cannot. This gives her a strong instrumental motivation and a clear picture of what success looks like, which is an advantage. It also means she is impatient with language that does not obviously connect to her job.',
  'Her strengths are in listening and in vocabulary for her field. She understands more than she can produce and she has picked up a large stock of hotel-related words from work. Her main difficulties are with grammar in speaking — she uses the present simple for almost everything, including past events and future arrangements — and with pronunciation, particularly word stress and the /w/ and /v/ sounds, which Turkish does not distinguish in the same way. In writing she is more accurate than in speech, because she has time to think.',
  'The first problem I want to address is her use of the present simple for past events, for example "Yesterday I check in a guest from Germany." This is partly a transfer from Turkish, where tense is marked very differently, and partly a habit that has worked well enough at the desk not to be corrected. A suitable activity would be a short, personalised speaking task built around a hotel shift: what happened yesterday? The task would require the past simple in every sentence, and the correction would come in delayed feedback, on the board, from her own examples. The rationale is that she needs to notice the gap between what she says and the form, in a context she cares about.',
  'The second problem is word stress. She places stress on the first syllable of almost every word, which is the Turkish pattern, so "reception", "reservation" and "available" all come out wrongly stressed and are sometimes not understood by guests. A suitable activity is a stress-sorting task using twenty words from her own work vocabulary, followed by drilling and a short role-play at the desk. The rationale is that these are words she uses every day and will use again tomorrow; the practice transfers directly.',
  'What I have learned from this assignment is that a learner’s difficulties are not random. Almost everything Selin finds hard can be traced to her first language or to her context, and knowing that changes how I would teach her: less explaining, more noticing, and activities built from the language of her own job. I would also give her more of the delayed correction she asks for — she wants to be corrected and it is a mistake to be too gentle with a learner who is asking for it.',
].join('\n\n');
const RESUB_TEXT = FOL_TEXT.replace('What I have learned from this assignment', 'Having looked again at the first activity after my tutor’s comments, I have made the task more focused: instead of "what happened yesterday", the learner describes three specific incidents from one shift, each with a time expression, so that the past simple is required every time and the delayed correction has more to work with. The stress activity is unchanged.\n\nWhat I have learned from this assignment');

/* ============================== the run ============================== */
/* What a candidate's record says has already happened -- so a run that died
   half way (four did, on 26 Sep 2026) picks up where the store is rather than
   minting a fifth course. COURSE=c3 reuses that course. */
const numOf = v => { const m = String(v == null ? '' : v).match(/\d+/); return m ? parseInt(m[0], 10) : 0; };
const fbTP = r => (r.feedback && r.feedback.status === 'returned') ? numOf(r.feedback.state && r.feedback.state.f && r.feedback.state.f.fTP || r.feedback.label) : 0;
const planTP = r => (r.plan && r.plan.status === 'turned_in') ? numOf(r.plan.state && r.plan.state.meta && r.plan.state.meta.tp || r.plan.label) : 0;
const histMax = r => Math.max(0, ...Object.keys(r.tpHistory || {}).map(Number).filter(n => n > 0));
async function recordOf(name) { const r = await call({ op: 'roster', key: K }); const t = Object.values((r && r.trainees) || {}).find(x => x.name === name); return recOf(t); }

let made, course;
if (process.env.COURSE) {
  const oc = await call({ op: 'ownerCourses', owner: OWNER });
  course = (oc.courses || []).find(c => c.id === process.env.COURSE);
  if (!course) explain(new Error('no course ' + process.env.COURSE + ' on the store'));
  made = { id: course.id, courses: oc.courses };
  console.log('Resuming the demo course ' + course.id + ' for: ' + LABEL);
} else {
  console.log('Minting a demo course for: ' + LABEL);
  made = await call({ op: 'createCourse', owner: OWNER });
  course = (made.courses || []).slice(-1)[0] || {};
}
const K = course.tutorKey, AK = course.assessorKey;
if (!K) explain(new Error('the store made a course but gave no tutor key'));
const RESUMING = !!process.env.COURSE;
log('course ' + made.id + (RESUMING ? ' reused' : ' made'));

const url = (page, q) => SITE + page + '?' + q;
const br = await chromium.launch();
const tutorCtx = async name => { const c = await br.newContext(); const p = await c.newPage();
  await p.goto(url('invite.html', 'k=' + K), { waitUntil: 'domcontentloaded' }); await settle(p, 3000);
  await p.evaluate(nm => localStorage.setItem('chub:tutorName', nm), name); return { c, p, name }; };
const T1 = await tutorCtx(TUTOR_1);
let p = T1.p;

/* ---- 1. the course itself ---- */
const tokens = {};
if (!RESUMING) {
await gotoSettled(p, url('6_centre_admin_dashboard.html', 'k=' + K), '#courseName'); await settle(p, 1500);
const set = async (sel, v) => { const el = await p.$(sel); if (!el) throw new Error('no field ' + sel + ' on the course admin screen'); await el.fill(String(v)); await settle(p, 200); };
await set('#centreName', 'Demo Centre');
await set('#centreNumber', 'XX000');
await set('#courseName', 'CELTA — demo course');
await set('#courseStart', day(-11));
await set('#courseEnd', day(11));
await set('#tpCount', '8');
await set('#totalHours', '120');
await set('#tutorNames', TUTOR_1 + ', ' + TUTOR_2);
await p.click('#saveSettings');
await settle(p, 3000);
const named = await p.$eval('#courseName', e => e.value).catch(() => '');
if (!/demo course/i.test(named)) throw new Error('the course name did not save: ' + named);
log('course details saved');

/* ---- 2. the cohort ---- */
await p.click('.tab[data-tab="roster"]'); await settle(p, 1500);
await p.waitForSelector('#toggleAdd', { state: 'visible', timeout: 20000 });
await p.click('#toggleAdd'); await settle(p, 600);
await p.click('#toggleBulk'); await settle(p, 600);
await p.fill('#storeBulkNames', COHORT.map(c => c.name + ', ' + c.group).join('\n'));
await settle(p, 400);
await p.click('#storeBulkAddBtn');
await settle(p, 900);
const confirmAdd = await p.$('.confirm-action');
if (!confirmAdd) throw new Error('no confirmation appeared for the bulk add');
await confirmAdd.click();
await settle(p, 12000);
{
  const roster = await call({ op: 'roster', key: K });
  for (const [id, t] of Object.entries((roster && roster.trainees) || {})) tokens[t.name] = t.token || id;
  if (Object.keys(tokens).length < COHORT.length) throw new Error('only ' + Object.keys(tokens).length + ' of ' + COHORT.length + ' candidates reached the store');
}
log(Object.keys(tokens).length + ' candidates added');

/* ---- 3. deadlines on the four assignments, spread across the course ---- */
await gotoSettled(p, url('8_assignment_wording.html', 'k=' + K), 'input[type="datetime-local"]'); await settle(p, 1500);
var ORDER, PLAIN, A1, A2, A3;
ORDER = await evalRetry(p, () => eval('hubAssignmentOrder(DATA).filter(k => k !== "a5")'));
PLAIN = await evalRetry(p, () => eval('hubAssignmentOrder(DATA).filter(k => k !== "a5" && DATA[k] && DATA[k].sections && !DATA[k].sections.some(s => s.type === "picker") && DATA[k].sections.some(s => s.type === "text" && !hubIsReference(s)))'));
A1 = PLAIN[0]; A2 = PLAIN[1] || ORDER.find(k => k !== A1); A3 = PLAIN[2] || ORDER.find(k => k !== A1 && k !== A2);
const DUE = { [A1]: -9, [A2]: -2, [A3]: 5 };
for (const k of ORDER) { if (!(k in DUE)) DUE[k] = 3; }
for (const [k, off] of Object.entries(DUE)) {
  await p.evaluate(k => eval(`CURRENT='${k}'; renderList(); renderEditor();`), k); await settle(p, 300);
  const local = await p.evaluate(off => HubDue.toLocalInput(new Date(Date.now() + off).toISOString()), off * DAY);
  await p.fill('input[type="datetime-local"]', local); await p.dispatchEvent('input[type="datetime-local"]', 'change'); await settle(p, 300);
  await p.fill('input[type="number"][max="30"]', '5'); await p.dispatchEvent('input[type="number"][max="30"]', 'change');
}
await p.evaluate(() => eval('persist()')); await settle(p, 3000);
log('deadlines set: ' + Object.entries(DUE).map(([k, d]) => k.toUpperCase() + ' ' + (d < 0 ? d : '+' + d) + 'd').join(', '));
}
/* Resuming: the roster and the assignment keys are read back rather than made. */
if (RESUMING) {
  const roster = await call({ op: 'roster', key: K });
  for (const [id, t] of Object.entries((roster && roster.trainees) || {})) tokens[t.name] = t.token || id;
  if (Object.keys(tokens).length < COHORT.length) explain(new Error('the reused course has ' + Object.keys(tokens).length + ' candidates, not ' + COHORT.length));
  await gotoSettled(p, url('6_centre_admin_dashboard.html', 'k=' + K), '#tutorNames'); await settle(p, 1000);
  await p.fill('#tutorNames', TUTOR_1 + ', ' + TUTOR_2); await p.fill('#courseStart', day(-11)); await p.fill('#courseEnd', day(11));
  await p.click('#saveSettings'); await settle(p, 3000); log('settings re-saved: ' + TUTOR_1 + ', ' + TUTOR_2 + '; ' + day(-11) + ' to ' + day(11));
  await gotoSettled(p, url('8_assignment_wording.html', 'k=' + K), 'input[type="datetime-local"]'); await settle(p, 1000);
  ORDER = await evalRetry(p, () => eval('hubAssignmentOrder(DATA).filter(k => k !== "a5")'));
  PLAIN = await evalRetry(p, () => eval('hubAssignmentOrder(DATA).filter(k => k !== "a5" && DATA[k] && DATA[k].sections && !DATA[k].sections.some(s => s.type === "picker") && DATA[k].sections.some(s => s.type === "text" && !hubIsReference(s)))'));
  A1 = PLAIN[0]; A2 = PLAIN[1] || ORDER.find(k => k !== A1); A3 = PLAIN[2] || ORDER.find(k => k !== A1 && k !== A2);
  log(Object.keys(tokens).length + ' candidates on the course');
}

/* ---- helpers for the TP cycle ---- */
async function traineePage(name) {
  const c = await br.newContext(); const tp = await c.newPage();
  await tp.goto(url('invite.html', 't=' + tokens[name]), { waitUntil: 'domcontentloaded' }); await settle(tp, 3500);
  return { c, tp };
}
async function writePlan(tp, name, n, L) {
  await gotoSettled(tp, url('1_trainee_plan_and_analysis.html', 't=' + tokens[name]), '#fwBtn'); await settle(tp, 1500);
  /* A locked page means an old turned-in plan is still in this browser (or
     came back from the store). Clear and reopen once; then it is an error. */
  if (await tp.$eval('#fwBtn', b => b.disabled)) {
    await tp.evaluate(() => { ['chub:plan', 'chub:selfeval', 'chub:feedback'].forEach(k => localStorage.removeItem(k)); });
    await untilRec(name, 'a clear plan slot', r => !r.plan || r.plan.status !== 'turned_in', 12, 5000);
    await gotoSettled(tp, url('1_trainee_plan_and_analysis.html', 't=' + tokens[name]), '#fwBtn'); await settle(tp, 1500);
    if (await tp.$eval('#fwBtn', b => b.disabled)) throw new Error('the plan page for ' + name + ' is locked on an old plan');
  }
  await setVal(tp, '#fName', name); await setVal(tp, '#fTP', String(n)); await setVal(tp, '#fLevel', L.level);
  await setVal(tp, '#fDate', day(-11 + n * 3)); await setVal(tp, '#fLength', String(L.length));
  await setVal(tp, '#fMain', L.main); await setVal(tp, '#fSub', L.sub); await setVal(tp, '#fPers', L.pers);
  await setVal(tp, '#fProfile', L.profile); await setVal(tp, '#fMats', L.mats);
  await setVal(tp, '#fMatsLink', DRIVE(name.replace(/\W/g, '').slice(0, 6) + n));
  await tp.evaluate(probs => { const pairs = [...document.querySelectorAll('.prob-pair')];
    probs.forEach((pr, i) => { if (!pairs[i]) return; const a = pairs[i].querySelector('.p-prob'), b = pairs[i].querySelector('.p-sol');
      a.value = pr[0]; b.value = pr[1]; a.dispatchEvent(new Event('input', { bubbles: true })); b.dispatchEvent(new Event('input', { bubbles: true })); }); }, L.probs);
  // the shape, then the stages -- the pick is the action; a fresh plan is not asked to confirm
  await pickShape(tp, L.shape.split(' (')[0]); await settle(tp, 500);
  const cf = await tp.$('.confirm-action'); if (cf) { await cf.click(); await settle(tp, 400); }
  await tp.evaluate(stages => {
    const rows = [...document.querySelectorAll('#procBody .stg')];
    while (rows.length < stages.length) { document.getElementById('addRow').click(); rows.push(document.querySelectorAll('#procBody .stg')[rows.length]); }
    stages.forEach((s, i) => { const tr = rows[i];
      const put = (sel, v) => { const el = tr.querySelector(sel); el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); };
      put('.t-stage', s[0]); put('.t-aim', s[1]); put('.t-proc', s[2]); put('.t-int', s[3]); put('.t-time', String(s[4])); });
    document.querySelector('#procBody .t-proc').dispatchEvent(new Event('input', { bubbles: true }));
  }, L.stages);
  // the language analysis sheet
  await tp.evaluate(() => { const t = document.getElementById('laToggle'); if (t && document.getElementById('laSection').classList.contains('hidden')) t.click(); });
  await settle(tp, 400);
  await tp.selectOption('#typeSel', L.la); await settle(tp, 500);
  await setVal(tp, '#fContext', n === 1 ? 'Talking about last weekend' : n === 2 ? 'An unusual job — the man who counts penguins' : 'Arranging a weekend with a friend');
  await tp.evaluate(() => { const r = document.querySelector('input[name="mainaim"][value="Yes"]'); if (r) { r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); } });
  if (L.la === 'vocab') {
    await tp.evaluate(items => {
      const body = document.getElementById('vocabBody');
      const need = items.length - body.querySelectorAll('tr:not(.example)').length;
      for (let i = 0; i < need; i++) document.getElementById('addVocab').click();
      const rows = [...body.querySelectorAll('tr:not(.example)')];
      items.forEach((it, i) => { const tr = rows[i]; if (!tr) return;
        const cells = ['.v-item', '.v-def', '.v-convey', '.v-clar', '.v-form', '.v-prob'];
        cells.forEach((cls, j) => { const el = tr.querySelector(cls); if (el) { el.value = it[j] !== undefined ? it[j] : ''; el.dispatchEvent(new Event('input', { bubbles: true })); } }); });
      const ref = document.getElementById('vRef'); if (ref) { ref.value = 'Oxford Learner’s Dictionary; the adapted article'; ref.dispatchEvent(new Event('input', { bubbles: true })); }
    }, L.laVocab.map(v => [v[0], v[1], v[2], v[2], v[3], v[4]]));
  } else {
    await tp.evaluate(B => {
      if (!document.querySelector('#blocks .blk')) document.getElementById('addBlock').click();
      const blk = document.querySelector('#blocks .blk');
      const put = (k, v) => { const el = blk.querySelector(`.fld[data-k="${k}"]`); if (!el) return; el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); };
      ['item', 'marker', 'meaning', 'source', 'clarify', 'form', 'phon', 'phonfeat', 'register'].forEach(k => { if (B[k] !== undefined) put(k, B[k]); });
      ['probM', 'probF', 'probP'].forEach(k => { const row = blk.querySelector(`.row.pairs[data-k="${k}"]`); if (!row) return;
        const want = B[k] || []; let pairs = row.querySelectorAll('.p-prob');
        while (pairs.length < want.length) { row.querySelector('.add-pair').click(); pairs = row.querySelectorAll('.p-prob'); }
        const probs = [...row.querySelectorAll('.p-prob')], sols = [...row.querySelectorAll('.p-sol')];
        want.forEach((pr, i) => { if (!probs[i]) return; probs[i].value = pr[0]; sols[i].value = pr[1]; probs[i].dispatchEvent(new Event('input', { bubbles: true })); sols[i].dispatchEvent(new Event('input', { bubbles: true })); }); });
    }, L.laBlock);
  }
  await settle(tp, 1200);
  await clickAndConfirm(tp, '#turnInBtn');
  await settle(tp, 1500);
  await untilRec(name, 'plan ' + n, r => r.plan && r.plan.status === 'turned_in' && /"rows"/.test(JSON.stringify(r.plan)), 15, 4000);
}
async function writeSelfEval(tp, name, L) {
  await gotoSettled(tp, url('2_trainee_self_evaluation.html', 't=' + tokens[name]), '#sWell'); await settle(tp, 1200);
  for (const [id, v] of [['#sWell', L.self.well], ['#sNot', L.self.not], ['#sLearn', L.self.learn], ['#sDiff', L.self.diff], ['#sNext', L.self.next]]) await setVal(tp, id, v);
  await settle(tp, 1000);
  await clickAndConfirm(tp, '#turnInBtn'); await settle(tp, 1500);
  await untilRec(name, 'self-evaluation', r => r.selfeval && r.selfeval.status === 'turned_in', 15, 4000);
}
/* The tutor's feedback goes in through the exchange: the brief out, every
   slot filled, pasted back -- which is how a tutor who dictates does it, and
   the only way to fill a stage comment for every stage without knowing in
   advance how many there are. */
async function returnFeedback(T, name, n, F) {
  const tp = T.p;
  await gotoSettled(tp, url('3_tutor_feedback.html', 'k=' + K + '&trainee=' + tokens[name]), '#fGrade');
  await tp.waitForFunction(nm => (document.body.innerText || '').includes(nm), name, { timeout: 40000 }).catch(() => {});
  /* The brief is built from DOC, the candidate's plan as the screen holds it.
     Run five built it before the plan had arrived and got a brief of nothing.
     This wait is not tolerant: no plan, no feedback. */
  await tp.waitForFunction(() => { try { return typeof DOC !== 'undefined' && DOC && DOC.plan && (DOC.plan.rows || []).length > 0; } catch (e) { return false; } }, null, { timeout: 60000 });
  await settle(tp, 1500);
  const brief = await evalRetry(tp, () => eval('HubExchange.brief(DOC)'));
  let si = 0, li = 0;
  const filled = brief.split(/\n(?=## )/).map(sec => {
    const h = (sec.match(/^## ([^\n]*)/) || [, ''])[1].trim();
    const body = (() => {
      if (/^Grade$/i.test(h)) return F.grade;
      if (/^Stage \d+/i.test(h)) return STAGE_COMMENTS[(si++) % STAGE_COMMENTS.length];
      if (/^Vocabulary — |^Analysis \d+ — /.test(h)) return LA_COMMENTS[(li++) % LA_COMMENTS.length];
      if (/^Strengths in planning$/i.test(h)) return F.sp.map(x => '- ' + x).join('\n');
      if (/^Action points in planning$/i.test(h)) return F.ap.map(x => x.startsWith('★') ? x : '- ' + x).join('\n');
      if (/^Strengths in teaching$/i.test(h)) return F.st.map(x => '- ' + x).join('\n');
      if (/^Action points in teaching$/i.test(h)) return F.at.map(x => x.startsWith('★') ? x : '- ' + x).join('\n');
      if (/^Overall comment$/i.test(h)) return F.overall;
      if (/^On their self-evaluation$/i.test(h)) return F.self;
      if (/^On the language analysis$/i.test(h)) return F.la;
      return null;
    })();
    if (body === null) return sec;
    return sec.replace(/^(## [^\n]*\n)[\s\S]*$/, '$1' + body + '\n');
  }).join('\n');
  await paste(tp, filled); await settle(tp, 1500);
  await stickyFill(tp, '#fTP', 'TP' + n);
  const got = await tp.evaluate(() => eval('(function(){ const c = collect(); return { grade: c.grade, sp: c.sp.length, at: c.at.length, st0: c.tcomm.st0 || "", overall: (c.overall||c.tOverall||"").length }; })()'));
  if (got.grade !== F.grade || got.sp < 3 || got.at < 3 || !got.st0) throw new Error('the paste did not land for ' + name + ': ' + JSON.stringify(got));
  await tp.waitForSelector('#returnBtn', { state: 'visible', timeout: 20000 });
  await clickAndConfirm(tp, '#returnBtn'); await settle(tp, 1500);
  /* The return writes TWO things: `feedback`, and the filing of this TP into
     `tpHistory`. Both go through hub-sync's debounced flush, and a tab that
     leaves before the flush has sent them loses the second one for good --
     the store has no local-wins merge for the tutor's history (Emily's TP2,
     run eight). So: stay on the page until the pill says the course has it,
     and then until the store shows both. A real tutor does this by sitting
     still for two seconds. */
  await tp.waitForFunction(() => { const el = document.getElementById('hubSync'); return el && /Saved to the course|Live/.test(el.textContent || '') && !/Saving/.test(el.textContent || ''); }, null, { timeout: 60000 }).catch(() => {});
  await settle(tp, 2500);
  await untilRec(name, 'feedback TP' + n + ' and its filing', r => r.feedback && r.feedback.status === 'returned' && r.feedback.docHTML && fbTP(r) === n && (r.tpHistory || {})[n], 18, 5000);
}
async function startNextTP(tp, name) {
  await gotoSettled(tp, url('4_feedback_returned.html', 't=' + tokens[name]), '#nextTpBtn'); await settle(tp, 1000);
  await clickAndConfirm(tp, '#nextTpBtn'); await settle(tp, 4000);
  /* All three clears, not just the plan's: the feedback's clear is the one the
     tutor's next page boots on, and it can land a beat after the plan's. */
  await untilRec(name, 'the cleared teaching practice', r => !r.plan && !r.selfeval && !r.feedback, 18, 5000);
  /* Belt and braces (run seven): the page pulls the store on a timer, and a
     pull that lands between the clear and its flush puts the old plan back in
     this browser, which the next page then pushes up again -- and opens
     locked. The store is clear; make sure this browser is too. */
  await tp.evaluate(() => { ['chub:plan', 'chub:selfeval', 'chub:feedback'].forEach(k => localStorage.removeItem(k)); });
}

/* ---- 4. the teaching-practice cycle ---- */
const GRADES = ['To standard', 'Above standard', 'To standard', 'Not to standard', 'To standard', 'To standard', 'Above standard', 'To standard', 'To standard', 'To standard', 'Not to standard', 'To standard'];
const T2 = await tutorCtx(TUTOR_2);
for (const [ci, c] of COHORT.entries()) {
  const { c: tc, tp } = await traineePage(c.name);
  for (let n = 1; n <= c.tps; n++) {
    const L = LESSONS[n - 1];
    /* Eight teaching practices each. The MCT has one group for TP1-4 and the
       ACT the other; they swap groups for TP5-8 (Ramy, 26 Sep 2026: "the first
       tutor has four TPs with one group, second tutor has four TPs with the
       other group, and then they swap halfway through"). The demo stands at
       TP3, before the swap, so Group 1 is all the MCT's and Group 2 all the
       ACT's. */
    const T = ((c.group === '1') === (n <= 4)) ? T1 : T2;
    const grade = n === 1 && GRADES[ci] === 'Not to standard' ? 'Not to standard' : n === c.tps ? GRADES[ci] === 'Not to standard' ? 'To standard' : GRADES[ci] : 'To standard';
    const r = await recordOf(c.name);
    const returned = histMax(r) >= n || fbTP(r) === n;
    if (!returned) {
      if (planTP(r) !== n) await writePlan(tp, c.name, n, L);
      const r2 = planTP(r) === n ? r : await recordOf(c.name);
      if (!(r2.selfeval && r2.selfeval.status === 'turned_in')) await writeSelfEval(tp, c.name, L);
      await returnFeedback(T, c.name, n, feedbackFor(c.name, n - 1, grade));
      log(c.name + ': TP' + n + ' returned by ' + T.name + ' (' + grade + ')');
    } else log(c.name + ': TP' + n + ' already returned');
    if (n < c.tps || c.pending) { const r3 = await recordOf(c.name); if (r3.plan && planTP(r3) === n) await startNextTP(tp, c.name); }
  }
  if (c.pending) { const r = await recordOf(c.name); if (planTP(r) !== c.tps + 1) { await writePlan(tp, c.name, c.tps + 1, LESSONS[c.tps]); log(c.name + ': TP' + (c.tps + 1) + ' plan turned in, awaiting feedback'); } }
  await tc.close();
}

/* ---- 5. the assignments ---- */
async function submitAssignment(name, key, text) {
  { const r = await recordOf(name); const st = ((r.assignments || {})[key] || {}).stage; if (st && st !== 'draft' && st !== 'resubmission_needed' && st !== 'returned_unmarked') { log(name + ': ' + key.toUpperCase() + ' already ' + st); return; } }
  const { c, tp } = await traineePage(name);
  await gotoSettled(tp, url('9_assignment_submission.html', 't=' + tokens[name] + '&a=' + key), '#submitBtn'); await settle(tp, 1200);
  await tp.evaluate(txt => { const ta = document.querySelector('textarea:not([disabled])'); ta.value = txt; ta.dispatchEvent(new Event('input', { bubbles: true })); }, text);
  await tp.evaluate(() => { const ml = document.querySelector('[data-role="materialslink"]'); if (ml) { ml.value = 'https://drive.google.com/file/d/1FOLnotesLite/view'; ml.dispatchEvent(new Event('input', { bubbles: true })); } });
  for (let i = 0; i < 8; i++) { const box = await tp.$('[data-role="decl-check"]:not(:checked)'); if (!box) break; await box.click(); await settle(tp, 250); }
  const no = await tp.$('[data-role="ai"][value="no"]'); if (no) { await no.click(); await settle(tp, 300); }
  if (await tp.$eval('#submitBtn', b => b.disabled)) throw new Error('Submit still off for ' + name + ' on ' + key + ': ' + await tp.$eval('#emptyHint', n => n.textContent).catch(() => ''));
  await clickAndConfirm(tp, '#submitBtn'); await settle(tp, 1500);
  await untilRec(name, key + ' submission', r => (r.assignments || {})[key] && /submitted|resubmitted/.test(r.assignments[key].stage), 15, 4000);
  await c.close();
}
async function markAssignment(T, name, key, round, notMetIndex, comment) {
  { const r = await recordOf(name); const sub = (r.assignments || {})[key] || {}; const marks = (sub.criteriaMarks || {})[round] || []; if (marks.length && marks.every(m => m === true || m === false)) { log(name + ': ' + key.toUpperCase() + ' ' + round + ' already marked'); return marks; } }
  const tp = T.p;
  await gotoSettled(tp, url('10_tutor_assignment_marking.html', 'k=' + K + '&trainee=' + tokens[name] + '&a=' + key), '[data-crit]');
  await tp.waitForFunction(nm => (document.body.innerText || '').includes(nm), name, { timeout: 30000 }).catch(() => {});
  await settle(tp, 1500);
  const marker = await tp.$('[data-role="marker1"], #marker1, [data-role="marker2"], #marker2'); if (marker) { await marker.fill(T.name); await settle(tp, 300); }
  const brief = await evalRetry(tp, r => eval(`xBrief(WORDING[CURRENT], subFor(CURRENT), "${r}")`), round);
  let ci = 0;
  const NOTES = ['You describe the learner in real detail, and the detail is used — it feeds the two problems you chose.', 'The two problems are well chosen and the activities follow from them. The rationale for the first could say more about why THIS activity and not another.', 'Accurate throughout; the references are the right ones and they are cited.', 'The reflection is honest and specific. It would be stronger still with one thing you would do differently in the classroom next week.', 'Within the word count and clearly organised under the headings.', 'Clear, readable, and written for a reader who was not in the room.'];
  const filled = brief.split(/\n(?=## )/).map(sec => {
    const h = (sec.match(/^## ([^\n]*)/) || [, ''])[1].trim();
    if (/^Criterion \d+/i.test(h)) { const i = ci++; const nm = notMetIndex === i;
      return sec.replace(/^(## [^\n]*\n)[\s\S]*$/, '$1' + (nm ? 'Not met\nThe second activity needs a rationale: you say what you would do but not why it fits the problem you identified. One paragraph will do it — resubmit with that added.' : 'Met\n' + NOTES[i % NOTES.length]) + '\n'); }
    if (/^General comment$/i.test(h)) return sec.replace(/^(## [^\n]*\n)[\s\S]*$/, '$1' + comment + '\n');
    return sec;
  }).join('\n');
  await paste(tp, filled); await settle(tp, 1500);
  const marks = await tp.evaluate(r => eval(`(subFor(CURRENT).criteriaMarks["${r}"] || [])`), round);
  if (!marks.length || marks.some(m => m === null || m === undefined)) throw new Error('marking did not land for ' + name + ' on ' + key + ': ' + JSON.stringify(marks));
  await tp.waitForSelector('#saveBtn:not([disabled])', { timeout: 15000 });
  await clickAndConfirm(tp, '#saveBtn'); await settle(tp, 1500);
  await untilRec(name, key + ' marking', r => (r.assignments || {})[key] && /closed|resubmission_needed/.test(r.assignments[key].stage), 15, 4000);
  return marks;
}
const [D, A, B, E, N, W, Y] = COHORT.map(c => c.name);
// Defne: first assignment in, marked Met on every criterion -- closed
await submitAssignment(D, A1, FOL_TEXT);
await markAssignment(T1, D, A1, 'sub1', -1, 'A careful, well-organised piece of work, and a pleasure to read. You have done exactly what the assignment asks: described one learner in detail and let that description drive the two problems and the two activities. Passed at the first submission.');
log(D + ': ' + A1.toUpperCase() + ' submitted, marked, closed');
// Arash: the resubmission cycle -- one criterion not met, resubmits, closed
await submitAssignment(A, A1, FOL_TEXT.replace('The rationale is that these are words', 'These are words'));
await markAssignment(T1, A, A1, 'sub1', 3, 'Nearly there. Five of the six criteria are met and met well; the one that is not is the rationale for the second activity, which the assignment asks for and which is missing. Add it and resubmit — you have until the end of next week.');
await submitAssignment(A, A1, RESUB_TEXT);
await markAssignment(T2, A, A1, 'sub2', -1, 'The rationale is there now and it is a good one. Passed on resubmission.');
log(A + ': ' + A1.toUpperCase() + ' not met on one criterion, resubmitted, closed');
// Beatriz: submitted, awaiting marking -- work waiting on the dashboard
await submitAssignment(B, A1, FOL_TEXT.replace('Selin', 'Marta').replace('Turkish speaker', 'Spanish speaker'));
log(B + ': ' + A1.toUpperCase() + ' submitted, awaiting marking');
// Emre: the second assignment, not met and not yet resubmitted
await submitAssignment(E, A2, FOL_TEXT.replace('For this assignment', 'For this task'));
await markAssignment(T1, E, A2, 'sub1', 1, 'Criterion two is the one to look at again: the problems you identify are real, but the activity you propose for the first does not require the target language. Resubmit with an activity that does.');
log(E + ': ' + A2.toUpperCase() + ' resubmission needed, not yet resubmitted');
// Nadia: first closed, and an extension on the second, which has passed its deadline
await submitAssignment(N, A1, FOL_TEXT.replace('Selin', 'Youssef').replace('her ', 'his ').replace('She ', 'He '));
await markAssignment(T1, N, A1, 'sub1', -1, 'Thorough and thoughtful. The strongest section is the reflection, which reads as something you actually learned rather than something you were told to say. Passed.');
{
  await gotoSettled(T1.p, url('10_tutor_assignment_marking.html', 'k=' + K + '&trainee=' + tokens[N] + '&a=' + A2), '#extSet'); await settle(T1.p, 800); await T1.p.click('#extSet'); await settle(T1.p, 3500);
  await untilRec(N, 'the extension', r => ((r.tracker || {}).extensions || {})['a:' + A2], 12, 4000);
}
log(N + ': ' + A1.toUpperCase() + ' closed; extension on ' + A2.toUpperCase());
// Yuki: submitted, and returned unmarked -- "submit it again" on her side
await submitAssignment(Y, A1, FOL_TEXT.replace('Selin', 'Kenji').replace('her ', 'his ').replace('She ', 'He ').slice(0, 900));
{
  await gotoSettled(T1.p, url('10_tutor_assignment_marking.html', 'k=' + K + '&trainee=' + tokens[Y] + '&a=' + A1), '#unmarkedBtn'); await settle(T1.p, 800);
  await clickAndConfirm(T1.p, '#unmarkedBtn'); await settle(T1.p, 1500);
  await untilRec(Y, 'the unmarked return', r => ((r.assignments || {})[A1] || {}).stage === 'returned_unmarked', 12, 4000);
}
log(Y + ': ' + A1.toUpperCase() + ' returned unmarked');

/* ---- 6. the grades report: all six provisional, the course fields, three finals ---- */
p = T1.p;
await gotoSettled(p, url('13_grades_report.html', 'k=' + K), '.cand .grow select.grade[data-grade="provisional"]');
await p.waitForFunction(n => document.querySelectorAll('.cand').length >= n, COHORT.length, { timeout: 40000 });
await settle(p, 2500);
const COURSE_TEXT = {
  tp: 'Six candidates in two teaching practice groups of three, teaching alternate days; each candidate teaches eight assessed lessons of forty-five minutes, four at A2 in the first half of the course and four at B1 in the second. Levels swap after TP4. Lessons are observed by the tutor responsible for that group in that half of the course.',
  tpSup: 'Every lesson is followed by a feedback session of forty-five minutes with the observing tutor and the TP group. Written feedback is returned to the candidate on the same day, through Connect Lite, with strengths and action points in planning and in teaching, a comment on each stage of the plan, and a comment on the self-evaluation. Starred action points carry forward into the personal aims of the next plan.',
  tutorials: 'Two tutorials for each candidate: the first at the end of week two, the second at the end of week three. The first round is this week and is recorded on each candidate’s tracker with the standing at that point and the action points agreed. Candidates whose standing is below the standard at the first tutorial are seen again in week three.',
  extra: 'The course runs with a first-half tutor and a second-half tutor sharing one course record, so every document a candidate produces is seen by both. One candidate has used a resubmission on the first written assignment; one has an extension on the second. No cause for concern at the time of writing.',
};
for (const [k, v] of Object.entries(COURSE_TEXT)) await setVal(p, `#course textarea[data-coursefield="${k}"]`, v);
const PROVS = ['PASS A', 'PASS / PASS B', 'PASS B', 'PASS', 'PASS B', 'PASS', 'PASS A', 'PASS B', 'PASS', 'FAIL / PASS', 'PASS', 'PASS B'];
const PROV = Object.fromEntries(COHORT.map((c, i) => [c.name, PROVS[i]]));
const FINAL = { [D]: 'PASS A', [B]: 'PASS B', [N]: 'PASS B', [Y]: 'PASS A' };
const POINTS = {
  planS: [['Aims stated in the learners’ terms and achievable in the time', '4a'], ['Procedure reads as a lesson: one action per line, with interaction and timing', '4c']],
  planA: [['Give each stage the time the plan allows — presentation stages run long', '4d'], ['Write CCQs into the plan with their expected answers', '4b']],
  teachS: [['Instructions given before the handout and checked with a question', '5a'], ['Purposeful monitoring that feeds the feedback stage', '5g']],
  teachA: [['Reduce teacher talk in feedback stages', '5b'], ['Nominate the quieter learners by name after the pair check', '5c']],
};
for (const c of COHORT) {
  const card = p.locator('.cand', { hasText: c.name });
  await card.locator('.grow select.grade[data-grade="provisional"]').first().selectOption(PROV[c.name]); await settle(p, 400);
  for (const [sec, pts] of Object.entries(POINTS)) {
    const s = card.locator(`.sec[data-sec="${sec}"]`);
    if (await s.locator('.pt').count()) continue;   // already written on a previous run
    for (const [text, code] of pts) {
      await s.locator('button.add').click(); await settle(p, 250);
      const ta = s.locator('.pt textarea[data-text]').last(); await ta.fill(text);
      await ta.dispatchEvent('input'); await settle(p, 150);
      const codes = await s.locator('.pt select[data-code]').last().locator('option').allTextContents();
      if (codes.some(o => o.startsWith(code + ' '))) { await s.locator('.pt select[data-code]').last().selectOption(code); await settle(p, 150); }
    }
  }
  if (PROV[c.name].includes('/')) {
    const ev = card.locator('.evwrap textarea'); if (await ev.count()) { await ev.first().fill('A Pass B is within reach if the last two teaching practices show the timing under control and the feedback stages protected. The planning is already at that standard; the teaching is close.'); await ev.first().dispatchEvent('input'); }
  }
  if (FINAL[c.name]) {
    await card.locator('.grow.final select.grade').selectOption(FINAL[c.name]); await settle(p, 500);
    const upd = card.locator('.fside textarea[data-field="update"]'); if (await upd.count()) { await upd.fill('The action points from the first tutorial — timing, and teacher talk in feedback stages — were addressed by the sixth teaching practice and held to the end. Strengths in rapport and in the setting up of tasks were consistent throughout.'); await upd.dispatchEvent('input'); }
    const prov = card.locator('.fside textarea[data-field="provided"]'); if (await prov.count()) { await prov.fill(FINAL[c.name] === 'PASS A' ? 'Consistently above the standard from the fourth teaching practice: language analysis of a very high order, lessons that were staged and timed as planned, and written work that needed no resubmission.' : 'Not applicable — the grade is a Pass B.'); await prov.dispatchEvent('input'); }
    const hrs = card.locator('input[data-field="hoursAttended"]'); if (await hrs.count()) { await hrs.fill('120'); await hrs.dispatchEvent('input'); }
    const ov = card.locator('textarea[data-field="overall"]'); if (await ov.count()) { await ov.fill('Congratulations. You arrived able to teach and you leave able to teach well, and — more to the point — able to see what you are doing while you do it. The self-evaluations were the best in the group.'); await ov.dispatchEvent('input'); }
  }
}
await p.click('#saveBtn');
await p.waitForFunction(() => { const el = document.getElementById('saveState'); return el && /saved/i.test(el.textContent) && !/unsaved/i.test(el.textContent); }, null, { timeout: 20000 }).catch(() => {});
await settle(p, 2500);
await untilRec(D, 'the final grade', r => ((r.tracker || {}).grades || {}).final === 'PASS A', 12, 4000);
{
  const last = await call({ op: 'roster', key: K });
  const n = Object.values((last && last.trainees) || {}).filter(t => ((recOf(t).tracker || {}).grades || {}).provisional).length;
  log(n + ' provisional grades, ' + Object.keys(FINAL).length + ' final grades, four course fields saved');
}

await br.close();

const someone = [D, tokens[D]];
console.log('\n' + '='.repeat(66));
console.log('DEMO COURSE ' + made.id + '  (' + LABEL + ')');
console.log('='.repeat(66));
console.log('\nTutor — this is the one to send:\n  ' + url('invite.html', 'k=' + K));
console.log('\nA candidate, ' + someone[0] + ', so they can see the other side:\n  ' + url('invite.html', 't=' + someone[1]));
if (AK) console.log('\nAssessor, view only:\n  ' + url('invite.html', 'ak=' + AK));
console.log('\nWhen you are done:  node demo-clear.mjs ' + made.id);
console.log('Deleting it kills all three links at once.\n');
