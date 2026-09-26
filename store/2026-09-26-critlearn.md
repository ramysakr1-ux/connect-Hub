# critLearn: a course record for what its tutors tag (26 Sep 2026)

**Why.** The criteria suggester matched a point's words against the CELTA 5
wording and nothing else. Measured on one course's sixteen points it was right
about half the time, and it could not improve, because it kept no record of
what the tutor did with its suggestions (Ramy, 26 Sep 2026: "do they learn from
the trainers' choices?" — they did not).

**What.** One more course-level kind, `critLearn`, beside `settings` and
`wording`. It holds counts: for each criterion code, how many tagged points
carried it and how often each word appeared in them, plus the same for
suggestions the tutors turned down. The page writes it when feedback is
returned and reads it when the screen opens. What it means is in
`hub-crit-learn.js`; the store only has to keep it and gate it.

**Gated, because it is a staff record.** A trainee and an assessor call `course`
on the same course and must not receive it: what the tutors tag is about how
the tutors work. `putCourse` was already tutor-only.

**Edits, by anchor (each occurs exactly once):**

1. `case 'course'`: the return becomes

   ```js
   return { settings: courseRead_(course.id, 'settings'), wording: courseRead_(course.id, 'wording'),
            critLearn: tutor ? courseRead_(course.id, 'critLearn') : null };
   ```

2. `case 'putCourse'`: the guard becomes

   ```js
   if (ck !== 'settings' && ck !== 'wording' && ck !== 'critLearn') throw new Error('Not a course kind: ' + ck);
   ```

Deployed as version 22.

**Proving it.** `node check-crit-learn.mjs` drives the real page and the real
model: it checks the cold answer is the wording rule's alone, that four tagged
points teach a code the wording cannot reach, that one does not, that a
suggestion turned down stops being made, that a course with no record of its
own is back to the wording, and that nothing of it is written on a trainee's
page.
