# Connect Lite — the film

**Spec for the promotional film. 26 September 2026; rewritten 27 September as a journey; captions and pace reset 27 September, mid-morning.**

Audience: **trainers and centre owners**, not trainees. Length: **about five minutes**. **No narration.** Light music under the whole thing, one track, royalty-free. And captions — but far fewer than a script's worth.

## Captions and pace — read this before the scene list

**Fewer words, longer looks.** The first cut put a line on nearly every beat and it read as a wall of text going past too fast. Ramy, 27 Sep: *"Maybe there's too much writing… if something is self-explainable you can skip it… it's just all going too fast… you don't have to show everything. Could be a bit shorter, but a little bit slower."*

So:

- **One caption per scene is the rule.** Two only where a scene genuinely turns twice. **Several scenes carry none at all** — a lesson plan filling itself in does not need to be described.
- **A caption earns its place by saying what the picture cannot.** *"Paste a Drive link"* is visible; *"nothing is uploaded anywhere"* is not. Write the second kind.
- **They float.** Each caption rises a little way up from the bottom of the frame as it fades in, holds still while it is read, then fades out where it stands. Nothing slides sideways, nothing sits on screen waiting for the next one, and two are never on screen together.
- **Timing:** in over 500 ms, still for **at least 3.5 seconds** and longer for a longer line — **8 characters a second**, which is far slower than reading speed because the eye is on the screen and comes to the words late. Out over 500 ms, then 1.2 seconds of silence before the next may begin. In practice a caption is on screen between **5.7 and 11.3 seconds**. All four numbers are together at the top of `film/index.html` (`CAPTION_CPS`, `CAPTION_MIN`, `CAPTION_FADE`, `CAPTION_GAP`) and nothing else sets the pace of the words. *Ramy, 27 Sep: still too fast at 13 characters a second, so 8.*
- **The picture is slower than it wants to be.** Each ◆ hold is a real pause — three seconds where two would do — with the cursor stopped. Cuts are fewer and longer. The film is shorter than the first cut by dropping scenes, not by speeding anything up.

Nobody is introduced and nobody's name is zoomed on. The foot of every screen says *designed and built by Ramy* and that is enough.

Every scene names the screen, what the cursor does, its caption if it has one, and where the picture slows. Zoom is written where it matters; everything else is a plain screen at 1280 px.

**The shape of the film is a journey.** One link is sent. The trainer sets the course up. A trainee does a teaching practice. The trainer gives feedback. The trainee reads it and does the written work. The assessor comes. The course ends with its reports — and, right at the end, paper, if anyone wants paper.

## The centre is invented, and looks it on purpose

**Elmswood English Centre, TR999, CELTA — C/1 2026**, with its own elm-leaf
logo (`assets/elmswood-logo.svg`). Every part of that is made up, and set on
all three courses by `node store/set-demo-identity.mjs --write`.

Ramy, 27 Sep 2026: *“I don't want a real centre — a made up centre with a made
up logo.”* Three things had to change to mean it:

- **`XX000` → `TR999`.** The old number read as an unfilled placeholder rather
  than a centre. TR999 is shaped like a real centre number and is the one
  nobody holds. **Never TR073** — that is the centre Ramy actually works with,
  and it must not appear on anything sent to a prospect.
- **`C/16 2026` → `C/1 2026`.** One digit from his real C/17 2026, so a viewer
  could have read the finished demo as his own previous course.
- **A logo, where there was none.** In the centre's own dark green,
  deliberately none of Connect's colours, so nobody reads the centre and the
  product as the same organisation.

The owner console lists `settings.courseName` in preference to the course's
stored name, so scene 1 shows the same course code as every scene after it.

---

## Everything is the demo — nothing real

Lite lives at **`https://lite.celtaconnect.com/`** — every link in the film shows that address, never `github.io`. Both courses are demo courses in the owner console:

- **`c3` — running.** Elmswood English Centre, twelve candidates, three weeks in: TP1–3 written up and returned, the fourth in progress. Tutors Jordan Blake and Diane Okonkwo; Emily Carter for the trainee side. **Parts 1–5** come from here.
- **`c4` — finished.** *CELTA — C/1 2026*, the same centre, twelve candidates, eight TPs each, four assignments each, a full end-of-course report for every one. **Parts 6–7** come from here — because a course three weeks in has none of those yet, and a report naming TP7 on a course at TP3 is what an assessor notices. **Nothing in the film may show a finished document on the running course.**

**The Classroom and Drive frames in scene 2 are demo ones too** — a demo class and a demo Drive folder made for the film, named for the demo course. Never a real course, never real candidates.

Capture from the live links, not from mock-ups. Never paste a link into this file — the repo is public and a link is a key.

## The three things the film must sell

1. **One link, and a course happens inside it.** No accounts, no passwords, no installing. The link lives wherever the course already lives, and keeps working when the internet drops.
2. **Nothing is typed twice.** The plan becomes the feedback sheet; the feedback becomes the grades; the grades become the assessor's view and the final report.
3. **It looks like this.** The screens are the selling point. Hold on them.

**And one thing it must not say:** that anything is downloaded, exported or sent to anyone. The assessor gets a link. Paper is an *option*, and it comes at the very end.

**Said out loud, early.** Ramy, 27 Sep: *“no download, no upload, no hunting for paper”* is the whole point and it was buried in the middle. It is now the first caption of scene 2, before the link goes into Classroom.

---

## Part 1 · The link — 0:00–0:40

### 1 · A course is made — 0:00–0:14
**Screen:** the owner console (`14_owner.html`). No zoom on the header.
**Cursor:** *Make a course* → the new card lands at the top, gold-edged → *Copy* on the tutor link.
**Caption:** *A course is one link.*
◆ Hold three seconds on the card as it lands. *The console is where the link comes from and nothing else; the film does not stay in it.*

### 2 · The link lives where the course lives — 0:14–0:40
**Screen:** `invite.html` — the tutor's invitation card, as the trainer receives it. Then three cuts, each showing the **link itself inside the other product**:
1. a **demo Google Classroom** stream, the Lite link posted as a material — click it, the card opens;
2. a **demo Google Drive** folder, the link saved as a shortcut among the course's files — click it, the card opens;
3. the card in a plain browser tab; the Wi-Fi icon goes off — the page is still there.
**Cursor:** arrives on the card; a beat; the three cuts, each with its click; then *Open*.
**Captions:** *Put it wherever your course already lives.* → *It still opens when the internet doesn't.*
◆ Hold on the card before the click. ◆ Hold four seconds on Wi-Fi off, page still there — this is the one that surprises people.

---

## Part 2 · The trainer sets up — 0:40–1:15

### 3 · Setting up — 0:40–1:00
**Screen:** Course admin (`6_centre_admin_dashboard.html`): Settings — centre, dates, eight TPs, two tutors — *Save*. Roster and links — a class list pasted, twelve names → *Add all* → twelve rows, each with its own link.
**Cursor:** the paste, the button, the rows appearing.
**Caption:** *No accounts, no passwords. The link is the account.*
◆ Hold three seconds on the twelve links appearing. *The paste needs no caption; it explains itself.*

### 4 · The centre's own assignments — 1:00–1:15
**Screen:** Course admin → *Written assignments* → **Edit wording** (`8_assignment_wording.html`): one assignment's sections, fields, declarations and marking criteria, every one in an editable box.
**Cursor:** one criterion's wording changed; *Save*. Cut to `9_assignment_submission.html` as a candidate: the changed wording is what they see.
**Caption:** *Every word of the four Cambridge assignments is yours to rewrite.*
◆ Hold three seconds on the edited criterion appearing on the candidate's page.

---

## Part 3 · The trainee's teaching practice — 1:15–2:30

### 5 · The trainee's home — 1:15–1:27
**Screen:** `index.html` — the **hero card**: one lifted card headed *Teaching practice*, three panels inside it, each a card of its own; exactly one **gold**, *Finish it and turn it in* beneath it.
**Caption:** *One thing is gold: the next step.*
◆ Hold four seconds. Zoom slowly so the panels-inside-a-card reads.

### 6 · The plan — 1:27–2:02
**Screen:** `1_trainee_plan_and_analysis.html`.
**Cursor:** click into *Main aim*; **Dictate** — the dot goes red — the aim writes itself as it is spoken; *Stop dictating*. Then **Lesson shape** → *Receptive skills* → six stages appear. Aims into the stages, minutes stepped, interaction chips picked. The **time budget** fills to *45 of 45 · fits exactly*. Then the Materials card: a Drive link pasted → *Drive file attached* with its preview.
**Captions:** *Click into a box and talk.* → *Worksheets stay on the trainee's own Drive. Nothing is uploaded.*
◆ Hold on the words arriving as they are spoken. ◆ Hold three seconds on the stages appearing. ◆ Hold on *fits exactly*. ◆ Hold on the preview.
*The shape filling the stages needs no caption — it is the clearest thing in the film. Dictation is cursor-in-the-box and talk; nothing is copied or pasted. Chrome or Edge on a computer only.*

### 7 · The analysis sheet — 2:02–2:18
**Screen:** Language Analysis, empty.
**Cursor:** click the **type** box → the menu shows all three — *Functional language · Grammar · Vocabulary* — a beat, then *Vocabulary*. Four items: meaning, form, pronunciation, problems and solutions. Click into a transcription → the **phonemic chart** appears → a symbol lands.
**Caption:** *The language analysis is part of the same document.*
◆ Hold three seconds on the open menu showing all three. ◆ Hold on the chart and the symbol landing.

### 8 · Turning in, and the self-evaluation — 2:18–2:30
**Screen:** *Turn in* → the confirm. Cut to `2_trainee_self_evaluation.html` after the lesson: four boxes full, the fifth being **dictated**.
**Caption:** *Written before they read their tutor. That is the point of it.*
◆ Hold on *Turn in*. *No caption for the turn-in itself — the confirm says it.*

---

## Part 4 · The trainer gives feedback — 2:30–3:25

### 9 · The trainer's desk — 2:30–2:42
**Screen:** `5_tutor_dashboard.html` — twelve rows; the counters: **3 ready for your feedback · 2 waiting to be marked · 1 back with the candidate**.
**Caption:** *Nothing to hunt for.*
◆ Hold four seconds on the counters. Zoom on the three numbers.

### 10 · Feedback, said — 2:42–3:05
**Screen:** `3_tutor_feedback.html` for Zeynep Aydın (TP3). *What they planned*: the spine, read-only, the comment column beside it.
**Cursor:** click into *Strengths in teaching*, **Dictate**, a point arrives as it is said. Under it, **criterion chips**; one has a **solid edge** — hover: *tagged 12 times on this course*. Click it; the code sits on the point. Then the star on an action point.
**Captions:** *Say a point. It's written.* → *The solid chips are what your own tutors tag. It learns your centre.*
◆ Hold on the point arriving with its chips. ◆ Hold four seconds, zoomed, on the solid chip and its tip — this is the cleverest thing in the product and it needs the time.
*Dictation: cursor, talk, done. No clipboard. The next scene is a different thing.*

### 11 · Feedback, all at once — 3:05–3:25
**Screen:** the same sheet, the **exchange** card.
**Cursor:** *Copy* → cut to a dictation window (any model; the brief pasted, the trainer talking the lesson through) → back → *Paste something back* → **every box fills**: the grade, a comment per stage, the four lists, the overall comment, the notes on the self-evaluation and the analysis. *Return to trainee* → *Returned*.
**Caption:** *Or talk the whole lesson through somewhere else, and paste it all back.*
◆ **Hold five seconds on the paste landing.** The strongest picture in the film. Let the boxes fill, then stop, and let it sit.
*The exchange, not dictation: the clipboard goes out and comes back. Never cut the two together as one action.*

---

## Part 5 · Back with the trainee — 3:25–3:45

### 12 · The trainee reads it — 3:25–3:45
**Screen:** `4_feedback_returned.html` for Emily Carter — three sheets on the desk, newest on top.
**Cursor:** the current sheet lifts under the mouse; scroll its length, slowly — the feedback and its grade, the plan, the analysis, the self-evaluation with the trainer's note beneath it. The starred points. **No printing here.**
**Caption:** *Read-only. Not a word of their tutor's can be touched.*
◆ Hold on the stack. ◆ Hold on the starred points.
*Note: the candidate's returned sheet carries **no criterion codes** — that was decided and it holds. The criteria live on the tutor's side, and on the assignments. Do not show or claim codes here.*

---

## Part 5b · The written assignments, end to end — 3:45–4:35

Ramy, 27 Sep: the film showed a submission and a mark sheet and stopped, so the
thing that makes the four assignments work — the going back and forth — was
missing. It is now three scenes, and **every rung is a candidate who is really
at it.** No stubbed save is asked to stand for a stage change.

| rung | course | candidate | what the screen says |
|---|---|---|---|
| submitted | `c3` | Anastasia Volkova | Awaiting marking |
| resubmission needed | `c5` scratch | Marta Kowalczyk | Resubmission needed — planted |
| closed | `c3` | Emily Carter | Closed |

The middle rung is the one no demo course holds, so it is planted on the scratch
course — the one course a take may write to:

    node store/plant-assignment-rungs.mjs --plant

It rewinds a real closed-on-resubmission record from the finished demo by one
step, so the writing on screen is the seed's own and the section indices cannot
drift. `--clear` takes it away again.

### 13 · The written assignments — 3:45–3:58
**Screen:** `9_assignment_submission.html`, Emily Carter. One of the four picked; its criteria, its declaration, its deadline; the writing happens in the page.
**Captions:** *Four assignments, each with its criteria and its deadline.* → *Written in the page. Nothing to download, nothing to upload.*
◆ Move to *Submit*, do not press it — writes are stubbed.
*The candidate DOES see an assignment's marking criteria — that is the one place criteria face them, and it is right.*

### 14 · Marked against the criteria — 3:58–4:16
**Screen:** `10_tutor_assignment_marking.html` for **Anastasia Volkova**, `?a=fol` — really awaiting marking on `c3`.
Six criteria marked one at a time on camera; `.derived` only exists once every one of them is judged, so this beat cannot be faked by skipping one. Then the general comment, then *Save & return* — moved to, not pressed.
**Captions:** *One sheet, one candidate, the centre's own criteria.* → *Met, or not yet met. One judgement each.* → *The outcome comes from the marks, not from a box.* → *Sent back with your comment on every criterion.*

### 15 · Sent back, and one more go — 4:16–4:35
**Screen:** `9_assignment_submission.html` on the **scratch** course as **Marta Kowalczyk**, `?a=fol`: the amber *Resubmission needed* banner, the two criteria not met with the tutor's words beside each, the first submission read-only above the amber boxes. Then a cut back to `c3` and **Emily Carter**'s closed one.
**Captions:** *One resubmission. The candidate can see exactly what to fix.* → *Met, or not met, with your tutor's words beside each one.* → *The first submission stays as it was. The new writing goes in the amber boxes.* → *Closed. The outcome, the marks, and every word of it, kept.*
◆ Hold on the amber banner. ◆ Hold on *Closed*.

---

## Part 6 · The assessor — 4:35–5:10 · *from `c4`, the finished course*

### 16 · The assessor's view — 4:35–4:53
**Screen:** `12_assessor_pack.html`, opened from the assessor's own link: candidates first, each with their standing and both grades; the double-marking record; the briefs. **Scrolled, not printed.** Nothing is downloaded, exported or sent.
**Cursor:** scroll slowly; try to edit a grade — nothing moves.
**Caption:** *The assessor gets a link. Read-only.*
◆ Hold on the scroll. ◆ Hold three seconds on the grade that will not move.

### 17 · Grades — 4:53–5:10
**Screen:** `13_grades_report.html` — the course-level fields, the provisional table, a candidate's four sections with criterion codes, the final grade box with Appian's two fields.
**Cursor:** *Add from the TP records* → the trainer's own feedback offered back → one click puts it in the box with its code.
**Caption:** *Cambridge's own form. Into Appian by paste, not by retyping.*
◆ Hold four seconds on *Add from the TP records* and the point landing in the box.

---

## Part 7 · The end of the course — 5:10–5:53 · *from `c4`*

### 18 · The final report, whole — 5:10–5:32
**Screen:** `16_final_report.html` for one candidate — **the whole document**, top to bottom: the cover, the two assessment areas with their colour, the descriptor, the criteria, both tutors' signatures. Scrolled at reading pace, no cuts. Then two more candidates' covers.
**Cursor:** the scroll and nothing else.
**Caption:** *Assembled from the record. Not written.*
◆ **Let the whole report scroll.** This is a selling point; do not cut it short. ◆ Hold on the signatures.

### 19 · Paper, if you want it — 5:32–5:45 · *not a scene in the engine — a `still` to capture by hand*
**Screen:** back on `4_feedback_returned.html` for a `c4` candidate — eight sheets, the whole course. *Print / Save as PDF* → the dialog → **the PDF itself, in colour**, page after page: every TP's feedback and grade, the plan's spine, the analysis, the self-evaluation — flipping steadily. Then the final report's PDF.
**Cursor:** the print button, then nothing; the pages do the work.
**Caption:** *And if you want paper, one button prints the lot.*
◆ **Hold on the PDF flipping**, five seconds at least. Zoom on one page so the colour reads.
*The only place printing appears, framed as an option at the end — never as how the assessor gets anything.*

### 20 · Close — 5:45–5:53 · *not a scene in the engine*
**Screen:** the tutor's invitation card from scene 2, at rest. The foot is in frame — *designed and built by Ramy* — nothing zooms on it.
**Caption:** *One link. The whole course.*

**Running time ≈ 5:53.** Twenty scenes here, of which **eighteen are in the engine** — 19 and 20 are a captured still and a held card, not driven screens. Against the first cut: three scenes gone (the three cards cut fast, the candidate tracker, the Drive materials folded into the plan), roughly half the captions, and every hold longer. Two scenes were added back on 27 Sep, both inside the assignment cycle (14 and 15), because the going back and forth was the thing the film was missing.

**The engine's scene numbers are the ones in `film/scenes.js`, and `?scene=N` counts the same way.** They match the headings above through 18.

---

## Music — parked

**Ramy, 27 September: not important, leave it.** The slot stays wired so it costs nothing to change his mind — a track goes in as `film/music.mp3` or with `&music=<url>`, starts on the first click (browsers refuse audio before one) at 18% volume, and the film plays silently without one. Everything below is only for the day it matters.

**The brief, which matters more than the track.** No vocals — a lyric competes with a caption for the same reader. No drop, no build, no arrival: the film has no climax and music that promises one makes the screens look slow. Nothing percussive enough to imply urgency; this is a tool a centre will use for four weeks, not an app launch. Warm rather than bright, and quiet enough that a viewer could talk over it. Two to four minutes, looping cleanly, because the film is about five and nobody should hear a seam.

**Where to look, both checked 27 September 2026:**

- **Pixabay** — pixabay.com/music. Licence verified: attribution **not** required, commercial use allowed, and a soundtrack inside a video is fine because what it forbids is redistributing the track *standalone*. It also warns that a particular track may carry extra rights, so check the one you pick.
- **Mixkit** — mixkit.co/free-stock-music. Free, but I could not retrieve the actual licence text, so read it before this goes out commercially. Understated instrumentals there include **Meditation**, **Infinity** and **Nature Yoga**, all by Arulo, and **Voxscape** by Eugenio Mininni.

**FreePD.com is gone** — the site has closed. Anything still recommending it is out of date.

**I cannot hear any of these**, so the pick is Ramy's: play three against the film with the transport running and take the one you stop noticing. That is the test — the right track is the one you forget is there.

## Build notes before filming

- **Make the running demo permanent first.** `c3` runs 15 Sep → 7 Oct 2026: it reads as finished in October, and its assessor link — the same door the offer card carries — dies fourteen days after that. A demo course must have no beginning and no end. Its dates are **not sealed** (`seats.ever` is 0 on every course, so nothing has been counted against them yet), so this is an edit to `c3`'s settings, not a re-mint: no new links, and the 404 tagged points and the criteria learning stay where they are. See the note below on what an empty end date costs.
- **Everything else the film shows is built and live** as of 27 Sep: the hero card, the criterion chips and their tip, the finished demo course, the domain.
- **Demo Classroom and demo Drive for scene 2** — make them for the film, named for the demo course, nothing real in frame.
- **Dictation — Chrome or Edge on a computer, always, and the microphone must already be permitted.** Safari and every browser on iPhone and iPad have no *Dictate* button at all (`if(!SR || WEBKIT) return;`), so there is nothing to click. Scenes 6 and 10 now **really press it**: the button turns garnet and its dot pulses, which is the beat. A refused microphone fires `onerror` and drops it straight back to “Dictate” on camera, and pressing it with no box focused raises an `alert()` that stops the film — which is why both scenes click into the box first. Ramy, 27 Sep: *“you put the cursor inside the box and you dictate.”*
- **Dictation and the exchange are two features.** Scene 10 is cursor-in-the-box; scene 11 is Copy → outside → Paste.
- **The criteria suggester is scene 10's second half.** The chips appear 500ms after the point stops changing; clicking one puts the code *inside the sentence*. Dashed is the criteria wording talking, solid (`.taught`) is what this course's own tutors have tagged. Hold long enough that the difference reads.
- **Plant the resubmission rung before filming scene 15** — `node store/plant-assignment-rungs.mjs --plant`, after `scratch-course.mjs`.
- **Watch the Dictate button on the first take of scenes 6 and 10.** A refused or unavailable microphone fails *silently*: `rec.start()` throws `not-allowed`, the button drops back to “Dictate” and the film plays on with the words appearing and no sign of voice. **If the button does not go garnet with the dot pulsing, stop the take** — nothing in the film will tell you.
- **Film with the recording window focused.** `element.focus()` fires no focus event while the OS window is unfocused, which is how the dictation bar learns which box to write into. The engine now announces the focus itself so this cannot bite, but the window should be in front anyway.
- **`?scene=N`** starts the film at that scene and plays on — one take at a time, instead of watching four minutes to reach the one being filmed.
- **Printing appears once, in scene 19.** Not in 12, not in 16.
- **No criterion codes on the candidate's returned feedback** (scene 12). Checked 27 Sep: `4_feedback_returned.html` contains the word "criteria" zero times, and no codes. The candidate meets criteria on their assignments, not on their TP feedback.
- **Offline for scene 2.** The offline shell (`sw.js`) must have cached the pages once before the Wi-Fi goes off.
- **Drive link for scene 6.** A real shared file; the preview needs "anyone with the link".
- **The PDF for scene 19.** macOS Safari's dialog is cleanest; export and show the PDF in Preview for the flip and the zoom.

## Screens to capture, in order

All at `https://lite.celtaconnect.com/`. From **`c3`** (running): `14_owner.html` · `invite.html?k=` · `index.html` · `1_trainee_plan_and_analysis.html` · `2_trainee_self_evaluation.html` · `5_tutor_dashboard.html` · `3_tutor_feedback.html` (Zeynep) · `4_feedback_returned.html` (Emily) · `9_assignment_submission.html` (Emily — one blank for scene 13, her closed `?a=fol` for the tail of 15) · `10_tutor_assignment_marking.html` (Anastasia, `?a=fol`).

From the **scratch** course (`c5`): `6_centre_admin_dashboard.html` (both tabs) · `8_assignment_wording.html` · `9_assignment_submission.html` (Marta Kowalczyk, `?a=fol`, at Resubmission needed).

`?trainee=` is a **token**, never a name, on every screen that takes one — and no token goes in `film/scenes.js`, because the repository is public. The scenes name the candidate and the engine looks the token up from the roster when it builds the URL.

From **`c4`** (finished): `12_assessor_pack.html` (via the assessor link) · `13_grades_report.html` · `16_final_report.html` (one whole, two covers) · `4_feedback_returned.html` (one candidate, all eight TPs, printed to PDF for scene 17).

Not Lite: a demo Classroom stream and a demo Drive folder, each with the Lite link in it, for scene 2.

Both courses' three links are in the owner console. Never paste a link into this file.

## Still needed from Ramy, not from the code

- **The demo's dates** — the call below, before anything is filmed or sent.
- **The price** for the card (`&p=`), and the tiers if there are tiers.
- **The film's link** (`&f=`) once it exists.
- **The five questions** from 26 Sep — they never arrived.
- **The music** — pick one of the three when they are shortlisted.
