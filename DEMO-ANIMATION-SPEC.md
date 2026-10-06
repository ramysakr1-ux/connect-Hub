# Connect Lite — the film

**Spec for the promotional film. Rewritten 28 September 2026 as a course told by the calendar; restructured 30 September 2026 with the cold open, the two standing demos, and captions that comment.** The earlier journey spec (26–27 September) is in this file's git history; every decision it recorded that still stands is repeated below, so this file is the whole brief.

Ramy, 28 Sep 2026, after the online rooms went live: *"we have a full course on our hand now … we will definitely need a new demo and a new film … so much has changed … a new concept is needed now."* This is the concept he chose.

---

## The concept, in one line

**A whole course in five minutes, told by the calendar, with the CELTA 5 as the thing that fills itself.**

**The spine is time.** The old film followed the link from person to person. This one follows the course day by day. Every scene carries a day stamp at the left of its caption pill — *Day 0 · Day 1 · Day 6 · Day 12 · Day 19 · Day 20* — and the stamp is on screen even when the scene has no caption. The viewer feels a course happening, not a tour of screens.

**The through-line is the booklet.** The film opens with a candidate reading and confirming Cambridge's own words in the CELTA 5, and closes with the same booklet, every table filled from work the viewer watched happen, signed in ink, drawn as Cambridge's own PDF. In between it cuts back to the booklet three times, each time a stage is returned and signed. That is the selling point in one image: **the record wrote itself.**

**Five parts.** Before day one · the first week · the middle · the visit · the end.

Audience: **trainers and centre owners**, not trainees. Length: **about five minutes**. **No narration** — captions and one quiet music track. View only.

---

## Standing decisions — every one of these still holds

- **NO VOICE. Music and captions only.** Ramy, 27 Sep: *"Never forget the voice. I can just do the music and the captions."* Never narration, never a cloned voice.
- **Nobody is introduced and nobody's name is zoomed on.** The foot of every screen says *designed and built by Ramy* and that is enough.
- **Everything is the demo — nothing real.** The centre is **Elmswood English Centre, TR999**, with its elm-leaf logo; never TR073. The Classroom and Drive frames are demo ones made for the film. Never a finished document on the running course.
- **View only.** The film drives the real screens with writes stubbed. The opening card says *"Nothing here needs clicking — sit back. The working demo is a separate link."*
- **Printing appears ONCE, at the very end, as an option.** Never in the assessor's part: the assessor gets a link, and nothing is downloaded, exported or sent.
- **Dictation and the exchange are two scenes**, never cut as one action. Dictation = cursor in the box, talk, done. The exchange = Copy → outside model → Paste something back → every box fills.
- **The analysis scene** opens the type box so all three show (Functional language · Grammar · Vocabulary), then Vocabulary, then the phonemic chart.
- **No criterion codes on the candidate's returned feedback.** Criteria face the candidate on the assignments and in the CELTA 5, nowhere else.
- **The owner console is one silent frame** before part one — held, no caption, no click.
- **Captions and pace:** one caption per scene is the rule; several scenes carry none. A caption earns its place by saying what the picture cannot. Captions float up, hold, fade; never two on screen. 8 characters a second, at least 3.5 s still, 1.2 s of silence between. Every ◆ hold is a real pause with the cursor stopped. The film is shorter by dropping scenes, never by speeding anything up. The four numbers live at the top of `film/index.html` (`CAPTION_CPS`, `CAPTION_MIN`, `CAPTION_FADE`, `CAPTION_GAP`).
- **Music — parked.** No vocals, no build, no drop; warm, quiet, looping. Pixabay's licence is verified; Mixkit's must be read. FreePD is gone. Ramy picks the track by the test of forgetting it is there.

**Two new rules for this concept:**

- **A caption comments; it never reads the screen.** Ramy, 30 Sep: *"I don't want the captions to read what's already there, but rather make a smart comment on what's on the screen."* A line earns its place by saying what the frame cannot, or by naming the benefit of the feature in view in two or three words (*Signed. Dated. Kept.* · *Works offline.* · *It learns your centre.*). The audience is centres and trainers.
- **The day stamp is part of the caption pill**, set in the same small caps as the *Online rooms* label, and it changes only on a cut. A scene never straddles two days.
- **The booklet is never shown twice the same way.** Each return to it shows one more thing filled — a stage signed, a table grown — so the viewer reads progress without a caption.

---

## The three things the film must sell

1. **One link, and a course happens inside it.** No accounts, no passwords, no installing. The link lives wherever the course already lives, and keeps working when the internet drops.
2. **Nothing is typed twice.** The plan becomes the feedback; the feedback becomes the grades; the sheets and assignments become the booklet's tables; the booklet becomes Cambridge's PDF.
3. **It looks like this.** The screens are the selling point. Hold on them.

---

## Cold open · The same course, twice — 0:00–0:35

### A · The Drive column fills — no day stamp
**Screen:** the comparison page (*The Same Course, Twice*), driven as one animated scene: the four Google Drive windows descend one under the other, one cut per folder level; then the Drive column's grey chips fill, one by one, while the Lite column stops at three.
**Caption:** *Most of this is finding the file.*
◆ Hold two seconds on the full Drive column beside the short Lite one.

### B · The tallies — no day stamp
**Screen:** the two totals land, then *fewer by*.
**Caption:** *Same course. Same tutors. One of them had time to teach.*
◆ Hold three seconds. Then cut to black for one beat; the day stamps begin.

---

## Part 1 · Before day one — 0:35–1:32 · *from the beginning demo*

### 0 · The console — silent
**Screen:** the owner console (`14_owner.html`), the demo course's card at the top. Three and a half seconds. No caption, no cursor, no click.

### 1 · The card arrives — *Day 0* — 0:39–0:55
**Screen:** `invite.html`, the tutor's invitation card as the trainer receives it. Three cuts, each showing **the link itself inside the other product**: a demo Classroom stream; a demo Drive folder; a plain tab with the Wi-Fi going off and the page still there.
**Captions:** *Nothing to install. Nothing to remember. Nothing to lose.* → on Wi-Fi off: *Works offline.*
◆ Hold four seconds on Wi-Fi off, page still there. All three are made stills (`film/stills/`), not screen captures.

### 2 · A course is set up — *Day 0* — 0:55–1:16
**Screen:** Course admin (`6_centre_admin_dashboard.html`). Settings: the centre, the dates, the course's clock, three **Online rooms** rows, one ticked *The assessor joins this room*. Then the timetable (`23_timetable.html`): **an Excel file chosen**, the review, *Apply*, the day shape, every day laid out with the rooms on it. Then the roster: a class list pasted → *Add all* → six rows, each with its own link.
**Cursor:** the file chosen, the days appearing, then the paste and the links.
**Captions:** on the timetable appearing: *The spreadsheet you already had, read once.* → on the links: *One link each. No accounts.*
◆ Hold three seconds on the timetable filling. ◆ Hold three seconds on the links appearing.

### 3 · The candidate reads Cambridge's words — *Day 0* — 1:16–1:32
**Screen:** `index.html` as a candidate — the **rooms strip** under the title, the timetable card with day one marked — then the **CELTA 5** card → `20_celta5.html`: *Read and confirm*, the portfolio requirements open, scrolled slowly, then the confirmation box, the name already there, **Sign** → the signature dialog, where her signature **writes itself in her own hand** → *Sign* → the green signed block with the signature on it.
**Captions:** on the empty tables: *This booklet is going to fill itself. Watch.* → on the signed block: *Signed. Dated. Kept.*
◆ Hold on the hand writing. ◆ Hold three seconds on the signed block.
*First look at the booklet. Empty tables, one signature. Everything after fills it.*

---

## Part 2 · The first week — 1:32–3:35 · *from the beginning demo*

### 4 · A volunteer's page — *Day 1* — 1:32–1:44
**Screen:** `26_volunteer.html` on a phone frame, opened from a fresh link. The joining note slides up **in Turkish**; the language row; *Kabul ediyorum*. The page behind: *Your next class*, the course clock and the reader's, **Join on Zoom**.
**Captions:** on the note: *Their language for the small print. English for the lesson.* → on Join: *One tap to the room.*
◆ Hold on the Turkish note before the tap.

### 5 · The TP points arrive — *Day 3* — 1:44–1:56
**Screen:** the candidate's home, the TP points card → `24_tp_points.html` as the candidate: their own lesson highlighted — aim, framework, the coursebook pages attached, the audio link — with the other two lessons of the day beside it for reference.
**Caption:** *The pages, the audio, the aim. Already on the card when they wake up.*
◆ Hold three seconds on the materials line.

### 6 · The plan — *Day 3* — 1:56–2:22
**Screen:** `1_trainee_plan_and_analysis.html`.
**Cursor:** click into *Main aim*; **Dictate** — the dot goes garnet — the aim writes itself as it is spoken; *Stop dictating*. **Lesson shape** → *Receptive skills* → six stages appear. The time budget fills to *45 of 45 · fits exactly*. A Drive link pasted → *Drive file attached* → the **share switch** under it goes green: *shared with the volunteer students*.
**Caption:** on the stages appearing: *The shape is given. The thinking is theirs.*
◆ Hold on the words arriving. ◆ Hold on the stages appearing. ◆ Hold on the switch going green, silent.

### 7 · Taught, and written up — *Day 4* — 2:22–2:34
**Screen:** *Turn in* → the confirm. Cut to `2_trainee_self_evaluation.html`: four boxes full, the fifth being dictated. Cut to `18_observation_tasks.html`: a filmed-lesson sheet, the notes typed, **Turn in** → the date lands on it.
**Caption:** *Written before the feedback is read. That is the point of it.*
◆ Hold on the sheet's date landing.

### 8 · The trainer's desk — *Day 4* — 2:34–2:42
**Screen:** `5_tutor_dashboard.html` — the rooms strip, then the counters: **3 ready for your feedback · 2 waiting to be marked · 1 back with the candidate**, and under a name, *turned in* with its time.
**Caption:** *Nobody asked "did you get it?"*
◆ Hold four seconds on the counters.

### 9 · Feedback, said — *Day 4* — 2:42–3:00
**Screen:** `3_tutor_feedback.html` for a candidate. The date and the level already on the form. Click into *Strengths in teaching*, **Dictate**, a point arrives; the **criterion chips** under it, one with a solid edge — hover: *tagged 12 times on this course* — click, the code sits on the point. The star on an action point.
**Captions:** *Said, not typed.* → on the solid chip: *It learns your centre.*
◆ Hold four seconds, zoomed, on the solid chip and its tip.

### 10 · Feedback, all at once — *Day 4* — 3:00–3:15
**Screen:** the same sheet, the **exchange** card. *Copy* → an outside model, the lesson talked through → *Paste something back* → **every box fills** → *Return to trainee*.
**Caption:** *The rest of the form was already there.*
◆ **Hold five seconds on the paste landing.**

### 11 · Stage 1, signed — *Day 6* — 3:15–3:35
**Screen:** `20_celta5.html` as the tutor: Stage 1, hours taught, strengths, action plan → **Return to candidate** → the signature dialog, the tutor's own hand already on it → *Sign*. Cut to the candidate's side: *Returned — to sign* → **Sign** → the dialog → the green block. Then the **Teaching practice** table below, already holding TP1 with its grade.
**Captions:** on the pad: *Signed on screen. Personal, and dated to the second.* → on the table: *Nothing here was typed twice.*
◆ Hold on both signatures on the page. ◆ Hold three seconds on the table.
*Second look at the booklet: one stage signed, one table with a row.*

---

## Part 3 · The middle — 3:35–4:18 · *from the before-the-visit demo; the records carry their own dates*

### 12 · An assignment, marked and back — *Day 9* — 3:35–3:55
**Screen:** `10_tutor_assignment_marking.html`: the script with its sections, the criteria met, the outcome, *resubmission*. Cut to the **double-marking table** on the assessor pack, both markers' initials on one row. Cut to the candidate's `11_assignment_record.html`: two rounds, one outcome.
**Caption:** on the double-marking row: *Two markers. One script. No second copy anywhere.*
◆ Hold three seconds on the record's two rounds.

### 13 · Stage 2, both halves — *Day 12* — 3:55–4:08
**Screen:** `20_celta5.html`: the candidate's self-assessment column beside the tutor's, 41 criteria, the tutor's return, both signatures. Then the tables: four TPs, two assignments, three observations.
**Caption:** *Same booklet. More of it full.*
◆ Hold three seconds on the tables.
*Third look at the booklet.*

### 14 · The planning grid — *Day 15* — 4:08–4:18
**Screen:** `21_tp_grid.html` as a candidate: the group's rows for TP7 and TP8, their own row editable, two cells amber where two of them chose the same aim.
**Caption:** *Two of them chose grammar. The grid noticed first.*
◆ Hold on the amber cells.

---

## Part 4 · The visit — 4:18–5:04 · *from the before-the-visit demo*

### 15 · The register, and the certificate — *Day 17* — 4:18–4:32
**Screen:** `25_volunteer_register.html`: one row tapped, the block goes teal, the hours tick up, *Certificate*. Cut to `27_volunteer_certificate.html`: the sheet, the name, the level, the hours, the centre's signature already drawn on it.
**Captions:** on the tap: *One tap. The hours did the rest.* → on the certificate: *Signed by the centre. Printed by the student.*
◆ Hold four seconds on the certificate.

### 16 · The assessor's link — *Day 19* — 4:32–4:50
**Screen:** `12_assessor_pack.html` from the assessor key: the header's *this link stops working on…*, the Handbook panel, the candidates chosen first, the double-marking record, **Volunteer students**, the course documents. Scrolled, never clicked into.
**Captions:** *Everything the Handbook lists, and nothing was gathered.* → on the header line: *Read-only. Ends with the course.*
◆ Hold on the Handbook panel. Nothing is downloaded, exported or sent.

### 17 · Grades — *Day 19* — 4:50–5:04
**Screen:** `13_grades_report.html` — the provisional table, a candidate's four sections, the final grade box with Appian's two fields. *Add from the TP records* → the trainer's own point lands with its code.
**Caption:** on the point landing: *That sentence was written in week two. It just came back.*
◆ Hold three seconds on the landed point.

---

## Part 5 · The end — 5:04–5:45 · *from the finished course, kept for the film only*

### 18 · The final declaration — *Day 20* — 5:04–5:14
**Screen:** `20_celta5.html`: the five checks, the candidate's signature, the tutor's, both dated.
**Caption:** *Twenty days. Two signatures.*

### 19 · Cambridge's booklet — *Day 20* — 5:14–5:29
**Screen:** *Cambridge's PDF* → the July 2023 form drawn in the browser, page by page: the cover, the confirmations, Stage 1, Stage 2, Stage 3, every table full, every signature in ink.
**Caption:** *The record wrote itself.*
◆ Hold. This is the line the film was made for; nothing moves under it.
*Fourth and last look at the booklet.*

### 20 · Paper, if you want it — *Day 20* — 5:29–5:35 · *a made still*
**Screen:** the print dialog over the booklet, a still.
**Caption:** *Print it, if a drawer needs it.*

### 21 · The next course — *Day 20* — 5:35–5:41
**Screen:** Course admin, *Start the next course from this* → the new course's card: the wording, the rooms and the timetable shape carried, every switch off, an empty roster.
**Caption:** *The wording stays. The people change.*

### 22 · Close — 5:41–5:45
**Screen:** the Connect Lite mark on the sand ground, the foot's credit.
**Caption:** *One link, and a course happens inside it.*

---

## What the demo courses need before a frame is shot

The film is shot from **three courses that never age**: the two standing demos Ramy will send to centres, and one finished course kept only to be filmed.

- **The beginning demo** — pinned to **day 6**. Timetable built from an Excel file, rooms, the clock; six candidates with links; every CELTA 5 confirmed and signed with ink; TP points released for days 3–6 with pages and audio; plans and self-evaluations in for TP1–2; TP1 feedback returned, one point starred; Stage 1 returned and signed for at least one candidate; two observation sheets turned in; four volunteer students, one with the joining note agreed in Turkish, one not yet; shared materials on a lesson. Parts 1 and 2.
- **The before-the-visit demo** — pinned to **day 17**, the assessor's visit on day 19. Everything above carried through: seven TPs returned, all four assignments through with one double-marked and one resubmitted, Stage 2 returned and signed, the planning grid released with a clash, volunteers with marks and one certificate earned and signed by the centre, provisional grades in, the assessor pack complete. Parts 3 and 4.
- **The finished course** — every stage signed, the final declarations both sides, attendance filled, so scene 19 draws a complete booklet. Never sent to anyone. Part 5.

**Pinning a course to a day is built (30 Sep 2026, store v48–v50):** `settings.demoToday`, `hubToday()` / `hubNow()` in hub-shared, the gold "Demo, today is …" pill, the Course admin field, no assessor expiry on a pinned course, and `post` / `shareMaterial` / `gridSet` stamped with the moment a seed gives. **The two standing demos exist: c6 (day 6) and c7 (day 17)**, built by `seed-standing-demos.mjs`; the console marks them. Two beats are left open on c6 for the camera: Selin has not confirmed Cambridge's words (scene 3) and Olivia's next plan is blank (scene 6); the scenes stub their writes so they stay open.

Nothing is written to a demo course until Ramy says so. Then the clock, then the seed, then `film/scenes.js` against the scene list above, then the `film/` page.

## Where it stands — 6 Oct 2026

- **The film as written runs 8:51** (`node film/length.mjs`), 27 scenes, after the reshoot list of 5 Oct put eight scenes built since the 2 Oct cut on the calendar spine — TP point sets from the library, the rooms on the timetable, the shelf, the switch, who is coming tomorrow, the printed day — and cut the owner console, the one beat about Ramy rather than the centre. The published `film/connect-lite-film.mp4` is the 2 Oct cut (8:10) and carries none of that; the reshoot has not been taken. The remaining length lever, if one is wanted, is the course-setup chapter (0:51).
- **The trailer** (`film/trailer.js`, `film/?reel=trailer`) is written and not yet shot: eleven shots, two captions, six words, **1:09** as modelled (`node film/length.mjs trailer`). Ramy's second pass of 5 Oct chose what is *unimaginable* on a CELTA course over what is impressive — the phonemic keyboard inside the plan, the TP points staged and timed, a candidate's own card — and the running order alternates whose screen it is. It is what gets sent to buy the meeting; the film is for after.
- **A take needs the owner key and the standing demos up (c6, c7, c4)**, so it is shot from Ramy's machine, not from a cloud session. What can be done without the store has been: every selector in both reels checked against the current pages, and the signing step rewritten for the signature that replaced the pad.

## Build notes

- Dictation: Chrome or Edge on a computer, the microphone already permitted; if the button does not go garnet with the dot pulsing, stop the take.
- **The signature writes itself (6 Oct 2026; it replaced the pad of 30 Sep).** There is no ink pad any more: a signature is written from the person's name in a hand that is theirs alone (`hub-hand.js`, five open-licensed scripts that all write Turkish), set the first time they sign and the same every time after, and it cannot be changed. Pressing *Sign* opens `hub-ink`'s dialog with the signature on it, and when the name is already known the hand writes itself across the pad over a second and a half — that is the shot. The engine's `{do:'sign', ms}` waits for the dialog, gives the hand `ms`, and presses *Sign*; `draw` is gone from the engine and from both reels. Proved on the booklet with a dead store: the dialog opens, the hand writes, *Sign* is live, the signed block carries the hand.
- **The five stills are made, not captured (30 Sep 2026).** `node film/make-stills.mjs` draws the Classroom stream, the Drive folder, the Wi-Fi-off tab, the exchange window and the print dialog as pages of the film's own, photographs them at 1280 x 800 into `film/stills/`, and takes the sixth for real: it clones the finished course, photographs the new card on the console, and deletes the clone. Invented centre, invented names. A `still` step names its `img`.
- The rooms strip appears only when the course has rooms saved — seed them first or scenes 3, 7 and 14 show nothing there.
- Scene 17 needs the store's assets (the July 2023 master and the two fonts) reachable from the tutor link the take uses; the assessor link can draw it too.
- **The film's address carries five keys, none of them in this repo:** `?k=` the running demo (c3), `&sk=` the first-week demo (c6), `&vk=` the before-the-visit demo (c7), `&fk=` the finished course (c4), `&s=` the scratch course (c5), and `&o=` the owner key for the console frame. A scene names its course (`start`, `visit`, `finished`) and its person; candidate tokens, the assessor key and a volunteer's link are looked up from the store at run time.
- **The cold open** is `film/open.html`, a page of the film's own: it plays itself (the Drive windows, the chips, the tallies, 35 s) and the engine lays the two captions over it. No keys reach it.
- **Store-painted screens need `settle: 12000`.** Apps Script answers in 6–18 s; a scene judged earlier finds an empty page, and `?check=1` reports selectors as missing that are only late.
- **Check before a take:** `?check=1` on the film's address walks every scene and names any selector that is not there. The scratchpad's `film-check.mjs` serves the repo locally and runs it headless with all five keys read from the store.
- **Recording:** `node film/take.mjs` — `?take=1` shows the stage alone (no bar, no scene tabs, no note) at 1280 x 800, the film plays to its end, and the take lands in `film/takes/`. `--scene N` records one scene for a retake. The pages come from a local copy of the working tree; the records come from the live store, so c6, c7 and c4 must be up. Format is **webm (VP8)** — Playwright's own encoder writes nothing else; every browser plays it and YouTube and Vimeo take it as it is. For an mp4, run the webm through an ffmpeg with H.264.
- **A raw take runs about 11 minutes; the cut runs at the written length.** The extra is the store: each scene loads its screen fresh and waits for hub-sync's boot flag, 6-18 s on Apps Script, so roughly twelve seconds sit between one scene and the next. The engine holds a **curtain** over that wait, and **`node film/cut.mjs film/takes/<file>.webm`** takes every curtain out -- it plays the take through a canvas into a MediaRecorder and pauses the recorder whenever the six magenta pixels in the corner say a curtain is up, then copies the result into a fresh container so it has a duration and a seek index. The cut plays in real time, so it takes about as long as the take. The one to send is `…-cut.webm`.
- **The camera (30 Sep 2026).** A `.cam` layer holds the screen, a still, the cursor and the click ring, and moves them together; the chapter card, the curtain, the caption and the day stamp sit outside it and never scale. `{do:'zoom', on:sel, scale, ms}` pushes in, `{do:'zoom', out:true}` pulls back, and a click or a keystroke pushes in a little by itself and returns unless a written zoom has taken over. The clamp keeps the edge of the picture out of frame at every scale, so a push in can never show a border. Each scene opens a touch in and pulls back as its screen arrives; a long scroll pulls back first. `?zoom=0` turns the automatic push-in off.
- `?scene=N` starts at that scene.
- `?trainee=` is a **token**, never a name; no token and no key goes in `film/scenes.js` or in this file. The repository is public.

## Still needed from Ramy, not from the code

- **The go** for the seed and the scenes.
- **The price** for the card, and the tiers if there are tiers.
- **The film's link** once it exists.
- **The music** — "Calm Emotional Piano Corporate" (Pixabay 157258, stock_music, 2:21), laid under the cut at a low level and looped. Cleanly licensed for commercial use with no credit needed. Rockot's "Corporate Ambient Piano" is the better character and its page says non-commercial; it needs the artist's permission first.
