# Timetable system — spec for Claude Code

Written 9 Oct 2026. Prototype: `Timetable System.dc.html` (five screens behind one switcher: Start, Import, Board, Changes, Trainee view). Supporting prototypes: `Timetable Import.dc.html` (fuller import flow with the Source step, the All rows / Needs you filter, the "Remember" checkbox and the Built summary) and `Adaptive Timetable.dc.html` (earlier board; the shape presets and the "Doesn't fit" tray were worked out there).

Where this spec and `for-claude-code-timetable-tiles.md` (16 Aug) disagree, this spec wins. The main changes: tiles are now positioned by time inside each day, not stacked; amber drops apply directly instead of opening a confirm panel; the detail panel is in the sidebar, not below the grid.

Where this spec and `for-claude-code-assignment-schedule-rule.md` (17 Aug) disagree on **when a deadline may fall**, that spec wins. See rule R3.

---

## 0. Principles

1. **The sheet is a way in, not the master.** Once a timetable is built, Connect is the master copy. Edits happen in Connect. The sheet is kept only so Connect can tell the admin when it changes.
2. **Every session has a meaning.** A session is never just text. It has a type, and the rules run on every change, however the change arrived (drag, sheet check, reshape, copy from a previous course).
3. **Shape-agnostic.** The calendar is an ordered list of teaching days. Sessions sit on a teaching-day index plus a start and end time. Five days a week, two evenings a week, a closed Wednesday: all the same model.
4. **Nothing moves behind the admin's back.** A sheet change is a proposal to accept or ignore. A Connect edit is a draft until the admin publishes.

---

## 1. Data model

### Course (timetable-relevant fields)
- `startDate` — the Monday of week 1 in the prototype (7 Sep 2026). Any weekday in production.
- `teachingWeekdays` — set of ISO weekdays, 1 = Mon … 6 = Sat. Prototype default `{1,2,3,4,5}`.
- `weeks` — integer, 1–16.
- `closedDates[]` — calendar dates removed from the course (holiday, assessor visit, snow day).
- `dayStart`, `dayEnd` — the visible span of a day. Prototype fixed at 09:00–17:30. In production derive from the earliest start and latest end across the course, rounded out to the hour, with 09:00–17:30 as the floor for full-time and an evening span for evening courses.
- `sheetSource` — URL or file reference kept after import, plus `lastCheckedAt`.
- `publishedAt` — last publish time; null if never published.

### Teaching days (derived, never stored)
Walk `weeks × teachingWeekdays` in date order, skip `closedDates`, number the rest 0…D-1. `D` is the number of teaching days. Sessions refer to the index, not the date, so closing a day shifts everything after it by one teaching day and reopening it shifts them back. Changing `teachingWeekdays` or `weeks` re-derives the list; sessions keep their index.

### Session
| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `dayIndex` | int | 0-based teaching-day index |
| `start`, `end` | HH:MM | deadlines use `09:00`/`09:00` (point in time) |
| `type` | enum | `tp` · `feedback` · `input` · `deadline` · `fixed` · `bookable` · `planning` |
| `title` | string | as written in the sheet after review |
| `group` | `A` · `B` · `all` | `tp` only in the prototype; production uses the course's real TP groups (ABC/DEF etc.) |
| `zoom` | bool | whole-group online session |
| `zoomLink` | URL or ref | `course-room` · `tutor-room:<tutorId>` · explicit URL |
| `tutorId` | optional | |
| `room` | optional | |
| `prerequisiteId` | session id | `input` → the input it builds on |
| `linkedInputId` | session id | `deadline` → the input it depends on |
| `followsId` | session id | `feedback` → its `tp` |
| `locked` | bool | cannot be dragged (orientation, course close) |
| `source` | `import` · `copy` · `manual` | |
| `sourceRow` | ref | sheet cell/row the session came from, for the sheet check |
| `history[]` | change ids | a session with any `move`/`time` entry shows the hand-moved dot |

A session whose `dayIndex ≥ D` is **unplaced** (shown in the "Doesn't fit" tray). It keeps its index so re-adding days puts it back.

### Vocabulary (per centre)
`term → { type, canonicalTitle?, assignment? }`. Filled from review answers with "Remember for future imports" ticked. Looked up case-insensitively, ignoring punctuation, before any heuristic.

### Change
`{ id, at, by, kind: move | time | add | remove | reshape | sheet-accept, text, effects[], publishedAt | null }`.
`text` is the one-line description shown to admins and later to trainees. `effects[]` are the knock-ons (deadline moved, feedback moved). Pending = `publishedAt === null`.

---

## 2. Rules engine

Runs on: drop evaluation (preview, every open day, while dragging), drop, import build, copy from previous course, reshape, sheet-check classification, manual add/edit. Returns one of:

- **clean** — apply, no side effects.
- **shift** — apply, with `effects[]` naming what else moved.
- **block** — refuse, with one reason string.

Rules, in evaluation order:

**R1 Clash.** Two non-deadline sessions on the same day whose `[start, end)` overlap → block. Reason: `Clashes with {title} {start}–{end}`. Deadlines never clash. When a TP moves, its feedback is included in the clash test.

**R2 Order.** An input must not land on a day earlier than its prerequisite, and nothing may land before an input that builds on it. Block reasons: `Comes before “{prerequisite title}”` and `“{dependent title}” builds on it and would come first`. Same day is allowed in the prototype; in production also require `start ≥ prerequisite.end` on the same day.

**R3 Deadline placement.** The prototype uses a stand-in rule (deadline ≥ linked input + 2 teaching days) to demonstrate the mechanics. Build the real rule from `for-claude-code-assignment-schedule-rule.md`: a group's due or resubmission date falls on a day that group is **not** teaching TP, computed from the course's actual TP roster, and after the assignment's release/input. The mechanics to keep:
- Moving an input or TP so that a dependent deadline no longer satisfies the rule → **shift**: the deadline moves to the next valid day. Effect text: `{assignment} deadline moves to {date}`.
- No valid day left before the course ends → block: `No room left for its deadline`.
- Dragging a deadline onto an invalid day → block: `Needs two days after “{input}”` in the prototype; in production the reason names the real rule, e.g. `Group A teaches TP that day`.
- Deadlines are always 09:00 (see `timetable-findings.md`, decision 1). Never 18:00.

**R4 Feedback follows TP.** Moving a `tp` moves its `feedback` to the same day, same time → shift with effect `Feedback moves with it`.

**R5 Locked.** `locked` sessions are not draggable (cursor default, dragstart prevented). Unlocking is an edit in the session details, not on the board.

**R6 Fit.** A session with `dayIndex ≥ D` goes to the "Doesn't fit" tray. Dragging it onto a day evaluates R1–R5 like any other move.

**Checks panel** (persistent, not only while dragging): `{placed} of {total} sessions placed on {D} days` (red dot if any unplaced); one red line per standing R2/R3 violation; when none and nothing unplaced: `Every input follows what it builds on. Every deadline is at least two days after its input. No clashes.` (reword to the real R3). The "heavy day" check from the earlier spec was dropped; don't build it.

**Undo.** Not in `Timetable System.dc.html`, but required: one-step undo of the last change in the Status card (`Adaptive Timetable.dc.html` shows the button). Clean and shift drops apply immediately with no confirm; undo is the safety net.

---

## 3. Shared chrome (all screens)

- Page background `oklch(93.5% 0.02 78)`. Page padding 24px 32px 56px. Column gap 22px.
- **Header row**: left, eyebrow `C17 · Sept 2026 · 4 weeks · Mon Tue Wed Thu Fri · 20 teaching days` (11px, 700, 0.12em tracking, uppercase, muted) over the screen title (Newsreader 600, 30px). Right, the screen switcher: pill track `oklch(89% 0.018 80)`, padding 3px, radius 8px; pills 12.5px/600, padding 7px 13px, radius 6px; active pill `oklch(99% 0.005 90)`. In production the switcher becomes the course's sub-navigation; the Import pill is only shown while no timetable exists (or as "Import again" inside Changes).
- **Note banner** (system messages: "Reflowed onto…", "Published…", "Built from the sheet…"): gold-tinted, bg `oklch(97% 0.03 85)`, border `oklch(85% 0.06 85)`, text `oklch(35% 0.05 65)`, 13.5px, radius 8px, padding 10px 14px, max-width 80ch. Clears on the next navigation.
- Cards: bg `oklch(98.5% 0.008 85)`, border 1px `oklch(88% 0.016 82)`, radius 8px (sidebar) or 10px (full-width), padding 14px (sidebar) or 20–24px.
- Sidebar section labels: 11px, 700, 0.1em, uppercase, muted.

---

## 4. Screen 1 — Start

Shown when the course has no sessions. Title `Set up the timetable`.

Three cards in a responsive grid (`repeat(auto-fit, minmax(260px, 1fr))`, gap 16px), each: eyebrow (11px label) · Newsreader 24px title · 13.5px body · one button.

1. **From a sheet or file — Import the centre's timetable.** Dark card: bg ink-warm `oklch(30% 0.042 58)`, text cream. Body: `Google Sheets link, Word, Excel or PDF. Any layout, any times. Connect reads it and asks about anything unclear.` Button `Import`: gold fill `oklch(82% 0.1 78)`, text `oklch(25% 0.04 60)` → Screen 2.
2. **From a previous course — Copy C16, January 2026.** Body: `4 weeks full-time, 82 sessions. Lands on the new dates with deadlines re-set by rule.` Button `Copy C16` (outlined ink-warm). In production this is a picker of the centre's past courses; the card shows the most recent. Behaviour: copy every session with its `dayIndex`, times, type and links; the calendar is the new course's; recompute R3 for all deadlines; set `source = copy`; land on the Board with note `Copied from C16 onto 7 Sep – 2 Oct. Deadlines re-set by rule. Edit here from now on.`
3. **By hand — Start with an empty board.** Body: `Set the teaching days and weeks, then add sessions day by day.` Button `Start empty` (outlined neutral) → Board with no sessions and note `Empty board. Set the shape, then add sessions day by day.`

Footer line (13px, `oklch(45% 0.02 65)`, max 72ch): `Whichever way it comes in, the result is the same board. Every session has a meaning, so the timetable sets deadlines, builds the TP schedule and feeds the trainee and tutor views. From then on, edits happen here.`

---

## 5. Screen 2 — Import

### 5.1 Source step (see `Timetable Import.dc.html`)
Two cards side by side. Left, bordered 2px ink-warm: `Paste a Google Sheets link`, body `Any layout works. Connect reads dates, times and session names as they are written.`, a mono URL field, button `Read timetable`. Right, dashed border: `Or upload a file`, body `Word, Excel or PDF. The same reading and review happens either way.`, drop zone `Drop .docx, .xlsx or .pdf here`.

Supported sources: Google Sheets (read-only via the Sheets API; the sheet must be shared with Connect's service account or the admin signs in with Google), `.xlsx`, `.docx` (tables), `.pdf` (text layer; scanned PDFs are rejected with a clear message). Three-step progress pills top right: `1 Source · 2 Review · 3 Built`.

### 5.2 Reading
Flatten whatever layout the file has into rows `{ date, time, text, cellRef }`:
- **Grid layout** — weekdays or dates across the top, times down the side or inside the cell text. Each non-empty cell becomes a row. Merged cells become one row spanning the merged time range.
- **List layout** — one row per session with date and time columns.
- **Dates**: `Mon 7/9`, `7 Sep`, `07/09/2026`, weekday-only (resolved from the course start and the column's position). A date outside the course span is a question (5.4).
- **Times**: `09:30-11:30`, `9.30–11.30`, `09:30`, `pm`/`am`, `TBC`, blank. Anything without both a start and an end is a question.
- **Type** from vocabulary first, then keywords: `TP`, `Teaching practice`, `Grp A`, `Group B` → `tp` (+ group); `feedback` → `feedback`; `in`, `due`, `deadline`, `assgt`, `hand in`, assignment codes (`FOL`, `LRT`, `SRT`, `LFC`, `LSA`) → `deadline` (+ which assignment, else a question); `tutorial`, `sign-up`, `consultation` → `bookable`; `planning`, `supervised` → `planning`; `orientation`, `welcome`, `close`, `closing` → `fixed`; `Zoom` or a link in the cell → `zoom = true` (type still from the rest of the text); otherwise `input`.
- **Links**: a hyperlink in the cell becomes `zoomLink`.

Everything the reader is unsure of becomes a **question** attached to the row. The reader never guesses silently on type, date or time.

### 5.3 Review step
Title `Import a timetable`. Header row: mono source URL · `{n} rows read` · `{n} understood` (green) · `{n} need you` (gold while > 0, green at 0). Filter pills `All rows` / `Needs you` (prototype `Timetable Import.dc.html`). In `Timetable System.dc.html` the list is pre-filtered to flagged rows plus their neighbours, with the caption `Showing the rows that need you, with their neighbours`.

Table card, two columns `minmax(0,1.1fr) minmax(0,1fr)`, column headers `IN YOUR SHEET` / `CONNECT UNDERSTOOD`.
- Left cell: mono 12px, three columns 62px / 92px / rest — date (blank when same as the row above), time, text as written.
- Right cell: type chip (10.5px, 700, uppercase, radius 4px) + understood text (13px) + a green `✓` on the right (or `Answered` after a question is resolved).
- Chip colours: Fixed / Bookable / Planning bg `oklch(92% 0.008 70)` ink `oklch(38% 0.017 70)`; Input bg `oklch(93% 0.06 80)` ink `oklch(42% 0.09 65)`; TP bg ink-warm, ink `oklch(98% 0.01 85)`; Deadline bg `oklch(93% 0.04 28)` ink `oklch(45% 0.14 28)`; Zoom bg `oklch(93% 0.03 240)` ink `oklch(40% 0.08 245)`; unresolved `?` bg `oklch(90% 0.08 85)` ink `oklch(40% 0.09 65)`.
- A flagged row has bg `oklch(97% 0.04 85)` and, under it, the question (14px/600, `oklch(35% 0.07 65)`) with answer buttons (13px/600, bordered, radius 6px). Picking an answer rewrites the right cell, turns the mark to `Answered`, and collapses the question. Where the question is about a term, add the checkbox `Remember “{term}” for future imports`.
- Rows appear progressively as they are read (prototype: one every 70–90ms) so a long sheet shows progress.

Footer: `Back` (left). Right: hint text + `Build timetable`. Hint: `Reading…` while rows are still arriving; `Answer {n} more to continue` with the button disabled (`oklch(70% 0.02 70)`, cursor not-allowed); `Everything is understood` with the button enabled.

### 5.4 Question types (copy verbatim)
| Situation | Question | Answers |
|---|---|---|
| Unknown term | `“Lang Analysis”: what kind of session is this?` | `Input session` · `Supervised planning` · `Assignment deadline` (+ Remember) |
| Vague time | `“pm” has no exact time. When does it run?` | `Usual Thursday slot, 14:00–15:30` · `Leave without a time` (+ Remember) |
| TBC time | `The time is “TBC”. What should Connect use?` | `Usual Thursday slot, 14:00–15:30` · `Leave as to be confirmed` |
| Deadline, unclear assignment | `“LSA2 in”: which assignment is due?` | one button per assignment of this course (+ Remember) |
| Two rows, same slot | `Two sessions share Tue 13:00–14:30. How should they run?` | `In parallel, one per group` · `One after the other` (second moves to the next free slot that day) |
| Row after course end | `This row is after Fri 2 Oct, the last course day. What should happen?` | `Move to Fri 2 Oct, 10:00` · `Extend the course a day` · `Ignore this row` |
| Zoom with no link | `“{title}” is on Zoom but has no link. Which room?` | `Course room` · `{Tutor}'s room` · `Paste a link` |
| Deadline too early for the rule | `{assignment} is due on a day Group {X} teaches TP. Where should it go?` | `Next non-teaching day, {date}` · `Keep the sheet's date` (recorded as a standing violation in Checks) |

"Usual slot" = the most common start–end on that weekday in this sheet.

"Leave without a time" / "to be confirmed" sessions are placed at the top of the afternoon with a dashed outline and `time to be confirmed` in the tag; they take part in no clash test until a time is set.

### 5.5 Build
1. Create sessions from the interpreted rows (`source = import`, keep `sourceRow`).
2. Link inputs to prerequisites and deadlines to inputs from the course's assignment definitions (which input each assignment depends on is course configuration, not read from the sheet).
3. For assignments with no deadline row in the sheet, place the deadline by R3 and list it as `set by rule` in the Built summary.
4. Save vocabulary entries that were ticked.
5. Land on the Board with note `Built from the sheet: {n} sessions on {D} days, times as written. The sheet is finished with. Edit here from now on.`

**Built summary** (step 3 in `Timetable Import.dc.html`): title `Timetable built`; body `From now on, edit the timetable in Connect. Changes to the sheet won't affect it. You can import again at any time.`; four facts with a 2px ink-warm top rule — Course shape (`4 weeks full-time, Mon–Fri` / `20 teaching days · 7 Sep – 2 Oct`), Times (`Mornings 09:30–11:30 TP` / `Afternoon times vary by day; kept as written`), Deadlines (what came from the sheet, what was set by rule), Remembered (`{n} new terms` / `Used automatically next time you import`); buttons `Open timetable`, `Start over`.

---

## 6. Screen 3 — Board

Title `Timetable`. Two columns: sticky sidebar `flex: 0 0 240px` (`position: sticky; top: 16px`) and the board `flex: 1 1 440px; min-width: 0`. Gap 22px. Below ~700px the board wraps under the sidebar.

### 6.1 Week rows
Rows stacked with 26px gap. Row header: numeral `01` (Newsreader 600, 34px, line-height 1) beside a two-line label `WEEK` (10.5px, 700, 0.14em, muted) / `7 Sep – 11 Sep` (12.5px). Then a grid `grid-template-columns: 26px repeat(N, minmax(0, 1fr))`, gap 6px, where N = teaching weekdays per week.

Column 1 is the **hour gutter**: a 39px spacer, then hour labels `09`…`17` (IBM Plex Mono 9.5px, `oklch(58% 0.017 70)`) positioned at `(h − dayStart) × scale − 6px`.

### 6.2 Day column
Card: radius 8px, border 1px (colour is the drop-state border), bg `oklch(98.5% 0.008 85)`, `overflow: hidden`.
- **Header**, 38px: date numeral (Newsreader 600, 21px) + weekday (10.5px, 700, 0.08em, uppercase, muted) as one button (click = close/reopen the day; tooltip `Close this day` / `Reopen this day`); right, the day index `D7` in mono 10px.
- **Time area**: height `(dayEnd − dayStart) / 60 × scale`; scale 34px per hour on the admin board (289px for 09:00–17:30). Background: hour lines, `repeating-linear-gradient(to bottom, transparent 0, transparent 33px, oklch(91% 0.012 80) 33px, oklch(91% 0.012 80) 34px)` over `oklch(98.5% 0.008 85)`.
- **Closed day**: time area bg `repeating-linear-gradient(135deg, oklch(92% 0.012 80) 0 6px, oklch(95% 0.01 80) 6px 12px)`, centred text `Closed / click date to reopen`, numeral greyed `oklch(60% 0.017 70)`, no day index, not a drop target.

### 6.3 Tiles
Absolute inside the time area: `left: 3px; right: 3px; top: (start − dayStart)/60 × scale; height: max(14, duration/60 × scale − 2)`. Radius 4px, `box-sizing: border-box`, `overflow: hidden`, column flex, gap 1px, `transition: opacity .15s`.

Content by height `h`:
- `h < 24`: padding 1px 6px, title 10.5px, one line.
- `24 ≤ h < 52`: padding 3px 6px, title 12px, wraps to `lines` whole lines.
- `h ≥ 52`: adds a time line `09:30–11:30` (9.5px, 600, 75% opacity) above the title.
- `h ≥ 66` and a tag exists: adds the tag (9.5px, 75% opacity) below.
- `lines = max(1, floor((h − 6 − 12·showTime − 12·showTag) / 14.4))`; title rendered with `-webkit-line-clamp: lines`, `white-space: normal` when lines > 1 else `nowrap` with ellipsis. `hyphens: auto` needs `lang="en"` on an ancestor.
- Tooltip (`title` attr) always carries `{title} · {start}–{end} · {tag}`.

Colours by type:
| Type | Background | Text | Border |
|---|---|---|---|
| tp | `oklch(30% 0.042 58)` | cream `oklch(97% 0.012 80)` | none |
| feedback | `oklch(88% 0.03 60)` | ink-warm | none |
| input | `oklch(82% 0.1 78)` | `oklch(25% 0.04 60)` | none |
| input, zoom | `oklch(93% 0.05 80)` | body `oklch(23.5% 0.017 65)` | 1.5px dashed gold `oklch(60% 0.11 70)` |
| fixed | `oklch(42% 0.015 70)` | cream | none |
| bookable, planning | `oklch(98% 0.008 85)` | `oklch(45% 0.02 65)` | 1px dashed `oklch(70% 0.03 70)` |
| deadline | ribbon, see below | | |

Tags: `tp` → `Group A teaches`; zoom → `Zoom`; otherwise none.

**Deadline ribbon**: full-width bar at the top of the time area (`top: i × 17px` for the i-th deadline that day), height 16px, bg red `oklch(55% 0.15 28)`, white text 9.5px/700, 0.06em, uppercase: `A1 DUE · 09:00`. Draggable and selectable like a tile. In production use the real assignment codes (FOL, LRT, SRT, LFC) and show group where dates differ by group (`SRT · ABC DUE`).

**Hand-moved dot**: any session with a move/time change shows a 6px gold dot (`oklch(82% 0.1 78)`, 1.5px ink-warm ring) top-right, tooltip `Changed by hand`.

### 6.4 Selection
Click a tile or ribbon → selected (click again to clear; `Close` in the sidebar card also clears).
- Selected tile: `box-shadow: 0 0 0 2px oklch(23.5% 0.017 65)`.
- Linked tiles (prerequisite, dependents, its deadline / its input, its feedback / its TP): `0 0 0 2px oklch(60% 0.11 70)`.
- Everything else dims to opacity 0.3.
- **Threads**: an SVG overlay over the whole board (`position: absolute; inset: 0; pointer-events: none; overflow: visible`) draws a cubic curve from the centre of the selected tile to the centre of each linked tile. Horizontal pairs bend through the horizontal midpoint, vertical pairs (different weeks) through the vertical midpoint. Stroke 2px, round caps; gold for prerequisite/dependent and feedback links; red dashed `5 4` for deadline links; a 4px dot (white 1.5px ring) at the far end. Recompute after every render and on window resize (measure with `getBoundingClientRect` relative to the board container).
- **Selected card** (sidebar, dark ink-warm bg, cream text): `SELECTED` label + `Close`; title Newsreader 19px (`TP 3 · Group A`); `Thu 10 Sep · 09:30–11:30`; `LINKED TO IT` list with a gold dot per line.

"Linked to it" lines by type:
- tp: `Feedback 11:45–12:30 follows it` · `Group A lesson plans due 09:00 that morning` · `Reminder to Group A the evening before`
- input: `Materials folder opens the day before` · (if a deadline depends on it) `{assignment} is due at least two days after it` (reword to R3) · (if zoom) `Zoom link goes out 15 minutes before` · (if prerequisite) `Builds on “{title}”`
- deadline: `Submission box opens 48 hours before` · `Marking queue opens for tutors at 09:00` · `Set from “{input}”`
- feedback: `Follows TP 3` · `Both groups attend`
- bookable: `Trainees book a slot from the week before`
- planning: `Tutor on duty is rostered from this slot`
- fixed: `Fixed. Cannot move.`

### 6.5 Drag and drop
- Drag handle is the whole tile. On dragstart the tile drops to 40% opacity in place. Locked tiles prevent dragstart.
- While dragging, **every open day** is evaluated by the rules engine and tints its time area and border:
  - clean: bg `color-mix(in oklch, ink-warm 9%, white)` (18% when hovered), border ink-warm.
  - shift: bg `oklch(95.5% 0.05 85)` (`oklch(91% 0.08 85)` hovered), border gold.
  - block: bg `color-mix(in oklch, red 9%, white)` (18% hovered), border red.
  - The origin day (no change) and closed days keep their normal look.
- The hovered day shows a **hint toast** pinned to the bottom of its time area (11px/600, radius 4px, padding 5px 7px): shift → gold bg `oklch(82% 0.1 78)`, dark text, the effects joined with ` · `; block → red bg, white text, the reason. Clean shows no toast.
- Drop on clean or shift: apply at once, keep the tile's time, record a Change `“{title}” moved to {date}` with `effects[]`, clear selection highlights. Drop on block: nothing happens (the tile snaps back). No modal at any point.
- Dragging a tile from the "Doesn't fit" tray works the same way.
- Keyboard: not in the prototype. Provide an equivalent in the session details (a day picker) for accessibility.

### 6.6 Sidebar cards (top to bottom)
1. **Status** — pill `Draft` (bg `oklch(93% 0.06 80)`, text `oklch(42% 0.09 65)`) or `Published` (bg `oklch(92% 0.05 150)`, text `oklch(35% 0.08 150)`). Text: `{n} change(s) trainees can't see yet.` or `Trainees and tutors see this board.` Buttons: `Publish` (ink-warm fill, only while pending) and `Changes` (outlined). Add `Undo` here (see §2).
2. **Selected** — only while something is selected (§6.4).
3. **Course shape** — six weekday chips `Mon…Sat` (selected: ink-warm fill, cream text; at least one must stay on), `Weeks` with − / + steppers (1–16), caption `Click a date to close that day. Later sessions move along, keeping their times.` Any change re-derives the calendar and shows the note `Reflowed onto {D} teaching days. Sessions keep their order and times.` Reshaping is itself a Change (`kind: reshape`) and needs publishing.
4. **Checks** — see §2.
5. **Doesn't fit · {n}** — only when something is unplaced. Red-tinted card (bg `oklch(97% 0.025 30)`, border `oklch(80% 0.08 30)`, label `oklch(45% 0.13 30)`), caption `Add days or weeks, or drag one onto a day.`, one draggable chip per session in its type colours.
6. **Legend** — swatches for Teaching practice, Feedback, Input, Input on Zoom, Planning/tutorials, Deadline; then the three drop states `Drop: moves cleanly`, `Drop: moves something else too`, `Drop: clash or broken rule`.

### 6.7 Not in the prototype, needed for production
- **Add a session** (empty board, or an extra session): click an empty time in a day → inline form: title, type, start/end, group, Zoom + link, tutor, room, locked. Saves as `source = manual`.
- **Edit / remove** from the Selected card (times, title, type, links, lock). Removing is a Change.
- **Parallel sessions** (two groups taught at once, from the import answer `In parallel, one per group`): render side by side at half width within the same time span.
- **Evening and part-time spans**: `dayStart`/`dayEnd` from the course (§1); the hour gutter and scale follow.
- **Print / export**: reuse the existing timetable exports (Sheets, Word, PDF) from the Timetable Refresh work; the board is the data source.

---

## 7. Screen 4 — Changes

Title `Changes`. Two cards in a responsive grid (`minmax(320px, 1fr)`, gap 18px, `align-items: start`).

### 7.1 Edits made in Connect (left)
Header: Newsreader 22px title + `{n} waiting` (muted) on the right.
- While pending changes exist: a list, each entry with a 3px ink-warm left rule, bg `oklch(96% 0.014 80)`, radius 0 6px 6px 0: the `text` (13.5px/600) and each effect under it in gold text `oklch(42% 0.09 65)` (12.5px). Then the line `Trainees and tutors still see the published version. Publishing sends them a short note of what moved.` and the button `Publish to trainees and tutors`.
- When none: `Nothing waiting. What trainees see matches the board.`
- Below a rule, when anything has been published: label `PUBLISHED {when}` and the published entries' texts (12.5px, muted). Production: group by publish time, newest first, with who published.

**Publish** sets `publishedAt` on every pending change, bumps the course's published version, regenerates reminders and notifications from the new timetable, and posts the "Timetable updated" banner (§8) to trainees and tutors. Note shown: `Published. Trainees and tutors see the change and get a short note.`

### 7.2 The sheet has changed (right)
Header: Newsreader 22px title + `{n} difference(s)` / `All dealt with`. Caption: `Connect checked the sheet this morning. Nothing moves unless you accept it.`

Connect re-reads `sheetSource` once a day (and on a `Check now` button, not in the prototype) and compares each session's `sourceRow` with the current sheet. Each difference is classified by the rules engine as if it were a drop:
- **Row changed time or day** → clean or shift.
- **Rows swapped** → one difference covering both.
- **New row** → clean, shift, or block (clash). Title suffixed `(new row)`.
- **Row removed** → `Removed from the sheet`; Accept removes the session (a Change). Not in the prototype.

Difference card: 3px left rule in the outcome colour (clean ink-warm, shift gold, block red); title 14px/600; two mini columns `SHEET` / `CONNECT` with the values (`Mon 14 Sep · 15:30–17:00`); an effect line coloured by outcome (`Time change only. Nothing else moves.` · `A2 Language skills deadline would move from Tue 22 Sep to Fri 25 Sep.` · `Clashes with “Monitoring” 15:45–17:00. Fix it in the sheet, or add it by hand.`); buttons `Accept` (not offered for block) and `Ignore`. After a decision the card dims to 60% and shows `Accepted, waiting to publish` or `Ignored`.

**Accept** applies the change to the board as a pending Change (`kind: sheet-accept`, text suffixed `(from the sheet)`, with effects) and updates `sourceRow`. **Ignore** records the decision so the same difference is not raised again until the sheet row changes further.

---

## 8. Screen 5 — Trainee view (summary; the trainee workspace spec covers the rest)

Title `My timetable`. Header line `Priya Raman · Group A` and `Next deadline: {assignment} · {date} 09:00`. Week pills right. Read-only.

Same day columns as the board at 40px per hour (340px for 09:00–17:30), no hour-gutter interactions, no drag, no selection. Differences:
- My group's TP: solid ink-warm, title `You teach`, tag `TP 3 · Group A teaches`.
- Other group's TP: bg `oklch(93% 0.02 60)`, border 1px `oklch(80% 0.03 60)`, title `Observe`.
- Deadlines as ribbons; closed days striped with `No course today`.
- **Timetable updated** banner (gold tint) when there are published changes since the trainee last looked: label `TIMETABLE UPDATED {when}` and the published change texts.
- Zoom sessions show a `Join` control from 15 minutes before start (not in the prototype).

---

## 9. What the timetable drives

Every published timetable is the single source for:
- **Assignment deadlines**: submission box opens 48 h before, closes 09:00 on the day; marking queue opens for tutors at 09:00; resubmission dates from the same rule.
- **TP schedule**: which group teaches when; lesson plans due 09:00 that morning from the teaching group; reminders the evening before; the feedback slot that follows.
- **Zoom**: course room (one recurring link per course), tutor rooms, or per-session links; `Join` 15 minutes before; links in reminders; a moved session keeps its link.
- **Materials**: an input's folder opens to trainees the day before.
- **Planning slots**: tutor-on-duty rota.
- **FOL evidence plan, tutor desk day view, roster**: all read sessions by type and date; none keep their own copy of the timetable.

A publish regenerates all of the above. Nothing downstream is edited by hand to match the timetable.

---

## 10. Permissions

- Centre admin: import, build, edit, reshape, publish, accept sheet changes.
- Tutors: view the published timetable and their own day; no board editing in this round.
- Trainees: view the published timetable only.

---

## 11. Prototype data, and what is simulated

- Sessions are generated: 32 inputs (titles are plausible CELTA input topics, not a syllabus), TP 1–18 alternating Group A/B with a 45-minute feedback slot each, Supervised planning on Wednesdays, Tutorials on Fridays, Orientation on day 1, Final tutorials and Course close on day 20, four deadlines named A1–A4 (production: FOL, LRT, SRT, LFC per the assignment-schedule spec).
- Prerequisites (`PRE` in the logic) and Zoom sessions are sample choices.
- The import screen's rows and the three sheet differences are hard-coded. The import does not yet feed the board; `Build timetable` shows the generated timetable.
- `82 rows read` is a fixed number.
- Drag-and-drop uses native HTML5 DnD; touch is not handled.

---

## 12. Open questions

1. Confirm the R3 placeholder is replaced by the roster-based non-teaching-day rule, and whether a deadline may ever be hand-placed on a teaching day (currently a block).
2. Closing a day shifts later sessions by one teaching day. Should an admin be able to choose "drop that day's sessions into the tray" instead?
3. Parallel sessions: half-width side-by-side tiles, or a single tile with both groups named?
4. Day span for evening courses and for a course that mixes a Saturday morning with weekday evenings.
5. Sheet check frequency: daily is assumed. Should "Check now" also be available to tutors?
6. Whether tutors may edit their own sessions' rooms and Zoom links without admin publishing.
