# c4's missing assignment wording — and the course record I wiped restoring it

## What was wrong

`demo-finished.mjs` built the finished demo course with twelve candidates, four
closed assignments each, and **no assignment wording behind them**. Its stubbed
store answered `course()` with `wording: null` and it never wrote one. So every
assignment screen on c4 read *"This assignment isn't set up yet"* — and the
self-heal that fills a course's wording in **refuses a course that has marks on
it**, by design, so it could never repair itself.

The same seed wrote exactly **four** criteria marks for every assignment. The
real counts are **6 / 4 / 4 / 5** (`assignment-defaults.js`, from the syllabus),
so writing the wording alone would have left two criteria of Focus on the
Learner and the fifth of Lessons from the Classroom sitting *unmarked* on a
closed, passed assignment. Both halves had to happen together.

It also gave every resubmitted assignment the same general comment — *"the
rationale for the second activity"* — which is a Focus on the Learner story.
Language Related Tasks and Lessons from the Classroom have no rationale
criterion at all, so on those two the tutor's words described something the
assignment does not ask for. And the first-round marks read all-Met while that
comment said one criterion was not met: the tutor's words and the tutor's marks
disagreed on one screen.

## The fix

- **`demo-finished.mjs`** now writes the wording from `assignment-defaults.js`,
  sizes every mark array to that assignment's own criteria count, puts the
  not-met on the criterion the note is about (the rationale one where there is
  one), and writes both notes from the criterion's own text.
- **`store/repair-course-wording.mjs`** does the same to a course already built.
  Re-runnable; writes the wording only when it is missing.
- **`store/set-assessor-visit.mjs`** sets `visitDate` / `notificationRef`.

## The thing that went wrong while fixing it — READ THIS

Between two passes I opened a **c4 tutor page** in a browser and then ran

    Object.keys(localStorage).forEach(k => { if (/^(chub:|connect_|hub:)/.test(k)) localStorage.removeItem(k); });

to stop it showing the previous course's data. `hub-sync` in tutor mode watches
those keys and pushes what it holds **up to the store**. It pushed the
emptiness: c4's `settings` (17 fields), `wording` (5 assignments) and
`critLearn` were all replaced with nothing. The roster and all 72 candidate
records survived, because they are keyed per token and none of them was in the
cleared set.

**Clearing localStorage on a live tutor page is a WRITE.** To look at a
different course, open a new tab or use the assessor link (`?ak=`), which
writes nothing. Never clear storage under a page that syncs.

Recovery, in this order:

    node store/restore-c4-settings.mjs --write      # the 14 seed fields
    node store/fill-demo-docs.mjs c4 --write        # the 11 assessor documents
    node store/set-assessor-visit.mjs c4 --date 2026-09-01
    node store/repair-course-wording.mjs c4 --write # wording + the marks

Two settings could not be reconstructed and are Ramy's to set on the centre
admin screen: **`notificationRef`**, and **`assessorVisit`** — which candidates
the MCT has chosen for the assessor to observe. The pack says so rather than
guessing.
