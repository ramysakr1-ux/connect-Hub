# The classes change by TP, not by a date (10 Nov 2026, version 211)

**Why.** Ramy, setting C/21's classes: "can we not make it a date? Can we just
make it like after how many TPs instead ... some centers maybe do two, four,
two ... there's always room for other courses with other combinations." And:
"when they swap level ... the TP points should be released on Friday. The
Friday before."

**The record.** `settings.classes` gains a plan per group and one release
choice for the course:

    plan: { "1": [{ k: 'k1', to: 4 }, { k: 'k2', to: 8 }],
            "3": [{ k: 'k3', to: 2 }, { k: 'k4', to: 6 }, { k: 'k3', to: 8 }] }
    out:  'before' | 'day'        (absent = the course's usual rule)

Course admin still writes the two old fields beside it (`groups: { g: [first,
second] }`, `change: the first change's day`), for a page cached from before
this and for a store not yet deployed.

**The store.** `ownTutor_` (who a trainee books a tutorial with) reads the plan:
the class of the block the day falls in, each block starting on the day the
timetable gives (`classStart_`: the board's new-class day where it falls
between the two classes' TPs, else the course day after the group's last TP in
the old class). `bookSlot` passes it the timetable. A Stage 2 tutorial is with
the class of the last TP before half way, a Stage 3 with the last class's. A
course saved with `[before, after]` and a date reads exactly as it did (v203).
`classBlocks_` and `classStart_` are the store's copies of `hubClassBlocks` and
`hubClassStart` in hub-shared.js: change one, change both.

**The pages.** hub-shared.js (`hubClassBlocks`, `hubClassStart`,
`hubClassStarts`, `hubClassOn`, `hubClassAtTp`, `hubClassOutDay`); Course
admin's Classes card (each group a sentence by TP, Add a change, the release
choice); the TP points page and the trainee's home (a TP that opens a new
class goes out on the chosen day, in place of the usual rule, never in place
of By hand); TP points' set line, deal and repeat check follow the blocks.

**Old store, new pages.** Fine for a course with one change: the old fields
carry it. A group with two changes books its second-change tutorials with the
wrong tutor until the store is deployed.

**Deploy.** `clasp push` and a new version on the same deployment id.
