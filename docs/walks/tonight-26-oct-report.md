# Homework, night of 26–27 October 2026

Three things were on the list: the TP point library, the input session timings, and the trainer notes. All three are done and committed. **Nothing is pushed, and nothing has been written to the live store.** Each part below says what waits for your word.

---

## 1. The TP point library, to the standard

**Done:** all twelve sets are rewritten to TP-POINT-STANDARD.md, and every one passes the standard check. **Set four (Speakout A1, Narges's) is untouched.**

| TP | What the trainee now gets |
|---|---|
| 1–2 | Everything as before, plus a stage aim under every stage: "To…", one short line |
| 3–4 | One-word aims; each stage named, with one short line saying which exercise and what it is for; a watch-out only where it matters; no times, no interaction, no shape |
| 5 | Stage names only |
| 6 | The one-word aim, the pages, and a few watch-out lines. Nothing else |

The library holds 12 sets × 36 lessons. That came to about 860 new stage aims, 870 TP3–4 lines and 72 TP6 watch-out notes, all written in my own words from what each lesson already held. Nothing was copied from the book or the teacher's book.

**Also fixed on the way:**
- **Spelling:** American spelling in Connect's words. The book's own words stay as printed: *sense of humour*, *jewellery*, *neighbour*, *programme* as a TV item, *Agnes Grey*, *slow the ageing process*, *sceptical*, *go to the theatre*.
- **No Istanbul left:** the last two references were "Istanbul's shop cats" in set three and "Istanbul's turn" in set seven. Both are now general.
- **The set editor:** it now accepts an "If-time" stage without a time, as it already did for "If time".

**A sample to check:** one lesson at each level from set two (Roadmap A2+). It is at the end of this report.

**Waits for your word. Neither step has been done:**
1. **Writing the rewritten library into the store's library course (c3).** The pre-rewrite copy is kept as `library-now.json` in my scratch folder. C/18's own copy (c5) is not touched either way.
2. **Publishing `library/tp-point-sets.json`.** The new file is ready (`tp-point-sets-new.json` in my scratch folder). Like the last one, it carries the writing only, with no links to scans or recordings, and set four stays as published. It goes live with a push.

---

## 2. Every input session timed, part by part

**Done:** every trainer-notes table has a **Min** column, for tutors only; the trainees' pages still show no lengths. Two sessions' notes had fallen behind their pages and are corrected:
- **Lesson framework:** part 2 is guess-first now (12 minutes, not 8), and part 10 is "One page, three lessons" (10 minutes, no book needed). About 75 minutes in all.
- **Writing the lesson plan:** gains Fix this plan (12) and Your turn (15). 72 minutes in all.

**One build problem fixed along the way:** the three hand-built pages could not be rebuilt since the notebook script joined their gate. They rebuild again, and only their notes tables changed.

### The sessions under 75 minutes, each with one proposed task

You asked for proposals only, not builds. Run these by me and I'll build the ones you want.

| Session | Now | One task to add | Adds |
|---|---|---|---|
| Error correction | 45 | **Correct me, live.** Groups of four: one trainee runs a 3-minute controlled-practice moment from their next TP, the others plant errors from cards, and the "teacher" corrects with a technique from part 4. Rotate. | 30 |
| Functional language | 45 | **Board it, then teach it.** Pairs take one function from their TP points and build the board: exponents, meaning, form, intonation. Then they clarify it to another pair in 4 minutes. | 30 |
| PPP | 45 | **Stage a real page.** Pairs stage a PPP lesson from a coursebook page with minutes per stage. The class checks it against "practice gets the time". | 30 |
| Text-based teaching | 45 | **Find it in the text.** From a short text, pairs write the highlighting task and two CCQs for the target language. Then swap and critique. | 30 |
| Receptive skills | 45 | **Write the tasks.** From one short text, pairs write a gist task and a detail task, then do another pair's. Is their gist task really gist? | 30 |
| Teaching literacy | 45 | **Adapt a TP handout** for a learner who is still decoding (layout, font, pictures, chunking), shown as a gallery. | 30 |
| Teaching productive skills | 45 | **Run the task as students.** One trainee teaches a coursebook speaking task and monitors on a feedback sheet, then gives content and language feedback. The room comments. | 30 |
| Teaching exam classes | 54 | **Mark a sample** (speaking or writing) against the public scales in pairs, then agree a band as a room. | 20 |
| Guided discovery vs PPP | 54 | **Turn it round.** A PPP clarification of one TP-point item becomes a guided-discovery handout. | 20 |
| Connected speech | 58 | **Dictogloss** of a short natural clip, then mark where the speech joined. | 17 |
| Guided to less guided practice | 59 | **Build the bridge.** From one controlled exercise, write the semi-controlled and freer steps that follow it. | 16 |
| Classroom management | 60 | **Instructions clinic.** Each trainee gives the instructions and ICQs for one task from their next TP; peers time them and note one thing. | 15 |
| Phonology: sounds | 60 | **Transcribe your TP language.** Five target words from their next TP in phonemic script, checked in a dictionary, then drilled. | 15 |
| Teaching writing | 60 | **Write the model first.** Pairs write the A2 model text for a writing task, then pull out its useful language. | 15 |
| Alternative teaching techniques | 60 | **Your own story.** Plan a story lead-in that carries the target language of their next TP. | 15 |
| Drama in the ELT classroom | 60 | **Give it an aim.** Run one drama activity with a language aim taken from a TP point. | 15 |
| Eliciting and CCQs | 68 | **CCQs for your next TP.** Three items, CCQs written, then answered by a partner without the sentence. | 10 |
| Word and sentence stress | 68 | **Mark it, drill it:** the stress on their next TP's language, drilled in pairs. | 7 |
| Life after CELTA | 70 | **One CV line.** Each writes the CELTA line of their CV; pairs make it specific. | 5 |
| Course introduction | 70 | *(none: 70 is right for day one)* | 0 |
| Writing the lesson plan | 72 | **One item on the language analysis sheet,** timed. | 8 |
| Lesson framework | about 75 | *(none)* | 0 |

Teaching speaking (80) already reaches 75.

---

## 3. Trainer notes out of the pages, to a tutor's link only

**Done:**
- **How the pages are built:** the session pages are still built with their notes in full, so every edit and spelling pass reaches them. A last build step then lifts each page's notes into the store's own file (`store/gas/TrainerNotes.js`) and leaves an empty frame.
- **How a tutor gets them:** after the tutor check, the page asks the store (new op `trainerNotes`, tutors only) for that session's notes and puts them in the frame. "Print with the trainer notes" still works.
- **Course introduction:** its notes were written into its page; they now live in `_notes.py` with the rest.
- **Tested:** I opened three sessions as a tutor and the notes arrived with the minutes column. No page's source holds any notes now.
- **One thing to know:** a tutor offline sees the session but not its notes, since the notes now come from the store.

**Waits for the push:** the store deploy (the `trainerNotes` op and the notes file). If the pages went live without it, tutors would see "The trainer notes could not be loaded", so push and deploy go together.

---

## Commits waiting for "push"

- `5b5d73df` Tutor notebook: no Notebook button; corrected wording on connecting to trainees.
- `c9e818e0` Ask Connect on or off in Course admin; the overall comment in the professional register.
- `5dbb7159` Sessions timed part by part.
- `86980e6c` Trainer notes out of the pages (with its store change).

Store changes deploy with the same push: Ask Connect off per course, the overall comment's register, Stage 1's register, and the trainer notes.

---

## Sample: set two, one lesson at each level

**1A · Grammar** (level: full)
- Main aim: By the end of the lesson, students will have learned and practiced word order in questions in the context of getting to know you.
- Sub aim: To develop students’ oral fluency
- Shape: Text-Based Presentation of Language
- Lead-in — *To get students noticing word order in questions* (5 min, OC)
  - One question from the post on the board with its words in the wrong order. They fix it.
- Highlight target language — *To focus students on the questions in the post* (7 min, Ind.)
  - Exercise 4b — the Grammar box examples all come from Magda’s post, read earlier today. They find them there; do not set the text again.
- Clarify target language — meaning, form, pronunciation — *To clarify the meaning, form and pronunciation of question forms* (14 min, OC)
  - The book’s way in: write How ___ ___ ___ to work? on the board with you, travel, do underneath and let them place the words. Then the Grammar box and Grammar bank 1A. The pronunciation is Exercise 5a 
  - Watch out: Do not teach the rule that yes/no questions rise — the book says the research does not support it.
- Controlled practice — *To give students controlled practice of question forms* (10 min, Ind.)
  - The Grammar bank exercises, one worked on the board first, then alone and checked in pairs.
- Freer practice — *To give students freer practice asking their own questions* (9 min, PW)
  - They write three questions of their own and ask them.

**3A · Grammar** (level: guided)
- Main aim: Grammar
- Sub aim: Speaking
- Lead-in
  - Two questions about their weekend, one negative.
- Highlight target language
  - The negatives and questions in this morning's article.
  - Watch out: Do not set the article again.
- Clarify target language — meaning, form, pronunciation
  - Grammar bank 2B, pp. 118–119, and ex 5a, track 2.3: weak did and was.
  - Watch out: Questions with be are the ones to check.
- Controlled practice
  - The Grammar bank exercises, then ex 3a if they need the time expressions.
- Freer practice
  - The Grammar bank questions, asked for real.

**5A · Grammar** (level: outline)
- Main aim: Grammar
- Sub aim: Speaking
- Lead-in
- Highlight target language
- Clarify target language — meaning, form, pronunciation
- Controlled practice
- Freer practice

**6A · Grammar** (level: bare)
- Main aim: Grammar
- Sub aim: You decide
- Watch out for:
  - Three options have no will at all: 1c, 5b and 6a.
  - The Grammar box answers itself. Spend the time on decisions against offers.
  - The best-event discussion on the page is not this lesson's speaking.

