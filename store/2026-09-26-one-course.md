# One link is one course (26 Sep 2026)

**Why.** The price is per course. Nothing in the store knew what a course was,
so a centre could finish one, purge the twelve candidates, change the dates and
run the next one on the link they had paid for once (Ramy, 26 Sep 2026, asking
the question directly: "can they just start a new course altogether with the
same link?"). They could.

A cap on candidates alone does not fix it — he spotted that too: a centre
running courses of six would get four courses out of a cap of 24. What
separates one course from the next is the dates.

**What.** Two rules, and a course has to break both to be two courses.

*How many.* Every candidate the course has ever had is counted in a course
record the tutor key cannot write (`_seats`, not a `putCourse` kind). Purging
somebody does not give the place back. 24 is the cap, and a pasted list is
counted the same way as a single add.

*How long.* The dates are the centre's while nobody is on the course — they
are still setting it up. The first candidate seals them. After that the start
date cannot move at all, and the end may slip by up to 21 days, because a
course running a few days over is ordinary and a course with a new pair of
dates is a new course.

Neither rule touches reading, printing or the records. A finished course stays
open and printable for ever; only starting a new cohort in it is refused.

**The owner can still put it right.** `seats` (owner only) reads the record and
sets any of `ever`, `cap`, `firstStart`, `firstEnd`, `sealed` — for a centre
that has paid for a bigger cohort, or a course set up wrongly. Only what is
named changes, so raising a cap cannot quietly unseal the dates.

**Courses that already existed are grandfathered.** They have no `_seats`
record, so they have no recorded window and their count starts at zero. That
is deliberate: stamping a window onto a course already running could refuse a
legitimate edit. Use the `seats` op on any course that should be held to the
rule.

**Edits:** `SEATS_KIND`, `SEAT_CAP`, `SEAT_GRACE_DAYS`, `SLIP_DAYS`,
`seatsOf_`, `takeSeats_`, `sealWindow_`, `holdWindow_`, `day_`,
`daysBetween_`, `countTrainees_` as new helpers; `takeSeats_` and
`sealWindow_` called from `addTrainee` and `addTrainees`; `holdWindow_` called
from `putCourse` for `settings`; new owner case `seats`. Deployed as
version 25.

**Proving it.** `node store/verify-one-course.mjs` makes a course, changes its
dates freely, adds a candidate, then checks the start is refused, a new end is
refused, a week's overrun is allowed, a purge does not refund the place, the
25th is refused as a single add and in a pasted list, the owner can raise the
cap without unsealing the dates, and reading is untouched. Fourteen checks. It
never touches c1, c2, c3 or c4.
