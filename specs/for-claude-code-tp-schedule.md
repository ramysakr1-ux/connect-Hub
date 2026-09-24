# Scope: the teaching practice schedule, and deadlines that follow from it

Written 25 September 2026, for November. Deliberately **not** built before the
5 October course: it adds a new kind of data, a screen to maintain it, and it
rewires deadline logic that was proved working the day this was written.
October runs on the standing sentences, and the course tells us what the
schedule actually needs to hold.

Ramy: *"Is there a way to connect the deadlines to the timetable, and then use
the information on the timetable and deadline submissions, resubmissions, etc."*

---

## What Lite knows about dates today

- Four **assignment deadlines**, instants, set by hand on the wording screen.
- **Course start and end**, on course admin.
- A **date the trainee types on their own plan**, after the fact, in `meta.date`.
- `docTimetable` and `docTpSchedule` on course admin, which are **links to
  documents**. Lite shows the assessor where they are and cannot read a word
  of them.

Everything about teaching practice deadlines is therefore a sentence:
`planDueNote` ("by 6pm the day before you teach") and `selfDueNote` ("before
your feedback session"). They are honest, and they are not dates.

## What this adds

One table, held on the course, of **when each teaching practice happens**.
Not a timetable: a schedule. Sixteen rows for a six-candidate course in two
groups over eight practices, not forty-eight.

```
group  tp   date        (optional) time
A      1    2026-10-07  14:00
B      1    2026-10-07  16:00
A      2    2026-10-09  14:00
...
```

Per GROUP, not per candidate. Two candidates in the same group teach on the
same day; which of them teaches first is a running order, not a deadline, and
the plan is due the night before either way.

### Where it is edited

A fourth tab on course admin: **Settings · Roster and links · Teaching
practice · Assignments**. A grid, groups across, practices down, one date per
cell. Empty cells are allowed throughout — a schedule half filled is the
normal state in week one.

### Where it is stored

`course.schedule`, alongside `settings` and `wording`, as
`{ "A": { "1": "2026-10-07T14:00", ... }, "B": { ... } }`. Instants with the
offset, the way `dueAt` already is (see `hub-due.js`). It is a TUTOR write, so
it rides the same `putCourse` path and the same ledger.

## What follows from it

### 1. Real deadlines for the plan and the self-evaluation

`planDueNote` and `selfDueNote` stop being the deadline and become the
explanation beneath it.

- **Plan**: due at a time before the candidate's own next practice. The rule
  itself is a course setting, not a constant — "18:00 the day before" is the
  default, "09:00 the same day" is a legitimate centre choice. One field:
  *plans are due [18:00] [the day before ▾] the practice*.
- **Self-evaluation**: due before the feedback session. Lite does not know
  when feedback happens, so the default is an offset from the practice, and
  the same one-field shape: *self-evaluations are due [18:00] [the same day ▾]*.

Then screens 1 and 2 get exactly what screen 9 already has: the `.duepill`,
the countdown, amber inside three days, red and closed after, and the tutor
override per candidate. **`hub-due.js` already does all of this** — it takes a
deadline, an extension and a now, and answers. Nothing new is needed in it.

### 2. The dashboard says what is due, not only what has arrived

Today the queue cards count what has been turned in. With a schedule they can
count what is *late*: "2 plans overdue", "TP3 tomorrow, 1 plan not in". That is
the change most likely to earn its keep day to day.

### 3. The tracker shows a missing plan on the day it went missing

`A_STATE.DUE` and `MISSING` already exist for assignments. The teaching
practice tab has no equivalent because there was no date to compare against.
With one, the same three chips work.

### 4. The assessor pack carries the schedule

Handbook 14.1 asks for the teaching practice schedule "with details of the
teaching practice arrangements for the time of the assessment". Today that is
a link the centre pastes. With the data, the pack prints the table itself, and
the `docTpSchedule` field becomes optional rather than necessary.

### 5. The assessor visit day can be checked

If the visit date has no practice on it, the pack can say so. The main Connect
app already has this check (`assessorVisitDayProblem`); Lite could not have it
because it had no schedule.

## What this does NOT do

- **Resubmission windows gain nothing.** They already count from the day the
  work is returned, which differs per candidate and has no relation to the
  schedule. Leave them alone.
- **Assignment deadlines gain nothing.** They are four fixed dates a centre
  chooses; a schedule would not improve them.
- **It is not a timetable.** No input sessions, no rooms, no tutor allocation,
  no levels. Those belong to the course timetable document, which stays a link.
- **It does not reschedule anything.** Moving a date moves a deadline; it does
  not move work already turned in, and it never reopens a locked record.

## Edge cases that must be decided before any code

1. **A candidate who joins late, or moves group.** Deadlines are per group, so
   moving a candidate moves their deadlines. Past practices they did not teach
   must not appear as missing. Needs a per-candidate "from practice N" marker,
   or an explicit exemption.
2. **A practice that moves after plans are in.** The turned-in plan is locked
   and stays; the deadline pill must not retro-shame a candidate who met the
   old date. Rule: a record already turned in is never late.
3. **An empty cell.** No date means no deadline, and the standing sentence
   shows instead. The two must never both appear.
4. **The last practice.** Self-evaluations due "the same day" on the final day
   collide with the course ending. Same shape as the assignment problem we hit
   on 24 September.
5. **Two groups, one candidate teaching in both.** Happens when a group is
   short. Whose schedule applies?
6. **Time zones.** Instants, as now. A candidate travelling sees their own
   local equivalent, which is correct and must be tested, not assumed.

## Migration and compatibility

- A course with no `schedule` behaves exactly as it does today. This is the
  state every existing course is in, including the October one.
- `planDueNote` and `selfDueNote` stay in the settings and stay editable. They
  become the sentence under a real deadline rather than the deadline itself.
- No change to any stored record, so nothing has to be migrated and the
  printed documents are untouched.

## What it costs

- **Course admin**: a fourth tab and the grid. Half a day.
- **The two due rules**: two fields and the offsets. An hour.
- **Screens 1 and 2**: the pill and the gate. Mostly reuse from screen 9, but
  the plan screen's turn-in path is the most load-bearing in Lite. Half a day,
  most of it testing.
- **Dashboard, tracker, assessor pack**: a day between them.
- **Walk and fuzz**: three or four new steps in `walk-roles.mjs` covering a
  late plan, an extension, and a rescheduled practice. Half a day.

Call it three days, of which a third is the testing that stops it hurting the
part of Lite a candidate cannot work without.

## How it gets proved

Extend `walk-roles.mjs`, which already walks tutor, trainee and assessor
through a store. New steps:

- a schedule set by the tutor reaches the trainee's plan as a dated pill;
- a plan not turned in by its time shows as overdue on the dashboard and as
  `due` then `missing` on the tracker;
- an extension given on one candidate moves only theirs;
- a practice moved later does not make an already turned-in plan late;
- the pack prints the schedule.

Nothing ships until all of them pass alongside the existing twenty.
