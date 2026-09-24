# Scope: make a course like an existing one

Written 25 September 2026, for after the October course. Ramy, having set
C/18 2026 up by hand: *"There is no way to have sort of certain default
settings, so I don't have to do this every time I create a course."*

There is not. This is the cheapest way there could be.

---

## What happens today

The owner console mints with `createCourse` and **sends nothing**:

```js
const made = await call({ op: 'createCourse' });
```

The store hands back an empty course, and then a dozen fields are typed by
hand on course admin: centre name, centre number, teaching practices each, the
two turn-in sentences, the logo, and the eight document links.

**The four assignments are NOT among them.** `assignment-defaults.js` ships
with the site, so every new course already has Focus on the Learner with its
eight criteria, Language Related Tasks with five, Language Skills Related Task
with six and Lessons from the Classroom with seven, all at 750-1,000 words and
open to trainees. Checked on the live October course, 25 September. The wording
screen exists to CHANGE them; a centre that never opens it has the Cambridge
four as they should be.

So the honest size of the prize is one screen of settings, not the assignments.
Setting up C/18 2026 took four screens, but two of them were the deadlines and
the roster, and a template cannot fill either. Worth half a day; not worth
pretending it is more.

## Why the owner console is the right place

A tutor key sees exactly one course. `boot`, `course` and `putCourse` are all
scoped to the key that called them, so course admin **cannot** read another
course's settings however it is asked. There is no cross-course read at the
tutor level and there should not be.

The owner console already holds every course and both keys for each:

```
c.id · c.tutorKey · c.assessorKey
```

So it is the one screen that can read course A with A's key and write course B
with B's key, using ops that already exist. **No change to the Apps Script.**

## What it does

One new control on the owner console, beside Make a course:

> **Make a course like…** [ C/18 2026 ▾ ]

It then, in order:

1. `createCourse` — mints the empty course, exactly as now.
2. `course` with the SOURCE tutor key — reads `settings` and `wording`.
3. `putCourse` twice with the NEW tutor key — writes the copied settings, then
   the copied wording.
4. Repaints the list and scrolls to the new course, as Make a course does now.

Four round trips instead of one. At 1.5-13 s each (Ramy, 21 Sep) that is worth
saying out loud in the status line: *"Making the course… copying settings…
copying assignments…"*, rather than a spinner that looks stuck.

## What copies, and what must not

**Copies** — the things that are true of the centre, not of the course:

| | |
|---|---|
| `centreName`, `centreNumber` | the centre |
| `tpCount` | how the centre runs a course |
| `planDueNote`, `selfDueNote` | the centre's own wording |
| `logo` | the centre's mark |
| `docs.*` | the eight assessor documents, where stable |
| `wording`, **only where the centre has edited it** | the four assignments ship with the site, so copying them from a source is copying the same defaults twice. What is worth carrying is a centre's own edits: a reworded brief, an extra section, a changed word count, a criterion added, `released` set to held back. |

**Does not copy** — the things that make it a different course:

| | why |
|---|---|
| `courseName` | it is a new course; a copied name is a wrong name |
| `start`, `end` | a copied date looks deliberate and is worse than a blank |
| `dueAt` on every assignment | dates from another course's calendar |
| the roster | different people |
| `docPrevReport`, `docActionPlan` | course-specific by definition |

`resubDays` **does** copy: it is a policy in days, not a date.

The new course therefore arrives needing exactly four things: name, start,
end, and the four deadlines. Then the roster. That is the fifteen minutes cut
to two.

## Edge cases

1. **The source has assignment deadlines.** Strip `dueAt` from every
   assignment on the way through, and say so in the status: *"deadlines are
   not copied."* A tutor who finds last course's dates on a new course will
   not trust the feature again.
2. **The source is mid-course.** Only `settings` and `wording` are read, never
   a trainee record, so a live source is safe to copy from. Worth stating in
   the UI, because it will not feel safe.
3. **Wording that has not been edited.** Copying `wording` wholesale is
   harmless but pointless, and it hides the one case that matters: a source
   whose wording the centre HAS changed. Either copy it always and say so
   plainly, or diff against `assignment-defaults.js` and report "3 of 4
   assignments as shipped, 1 edited". The second is better and costs an hour.
4. **A copy that half fails.** Four round trips, any of which can fail. If
   `createCourse` succeeds and a `putCourse` does not, the result is an empty
   course with a confusing name. Rule: the course is minted FIRST and the
   copies are retried; on final failure the screen says which part did not
   land and offers the copy again, and never silently leaves a half course.
5. **No source courses yet.** The control is hidden until there is at least
   one other course.
6. **A deleted source.** The list is refreshed from the store on every render,
   so a stale choice fails at step 2 and reports it.

## What this is not

- Not a template object in the store. There is nothing to maintain, nothing to
  keep in step with the wording screen, and nothing that goes stale. The
  source of truth is a real course that already works.
- Not defaults applied at `createCourse`. That is the cleaner answer and it
  lives in the Apps Script, not in this repo. If the store is ever opened up,
  this feature is the specification for what those defaults should be.
- Not a way for a tutor to copy anything. It stays behind the owner key.

## What it costs

- Owner console: the control, the source list, the four-step run with its
  status line and its retry. **Half a day**, most of it in step 3 above.
- `walk-roles.mjs`: one new step -- mint from a source, assert the settings
  and wording arrived and that `courseName`, dates and `dueAt` did not.
  **An hour.**

## How it gets proved

In the walk, against the fake store:

- a source course with settings, wording and four deadlines;
- a copy made from it;
- the copy has the centre, the practices and both notes;
- the copy's assignments match the source's, INCLUDING an edit made to the
  source before copying -- the point being the edit, not the defaults, which
  the copy would have had anyway;
- the copy has **no** course name, **no** dates, **no** `dueAt`, **no**
  trainees;
- the source is untouched, checked field by field after the copy.
