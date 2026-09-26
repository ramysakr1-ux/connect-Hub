# seedCritLearn: a centre's next course starts from its last (26 Sep 2026)

**Why.** `critLearn` is per course, so a centre that has taught its tutors' way
of reading the criteria into one course went back to the bare wording rule on
the next one (Ramy, 26 Sep 2026: "seed it from the centre's last course").

**What.** A tutor op on their own course. It finds the centre's most recently
created OTHER course that has any tagging, and copies its counts, halved.

* **Halved**, because it is a starting opinion, not a fact: the new course's
  own tagging should be able to talk it out of the old one's habits. Half is
  rounded up, so nothing seen at all becomes unseen, and it is applied to the
  totals as well as the per-code counts — halving only one side would make a
  word read as more exclusive to a code than it ever was.
* **The centre is its number**, normalised, and its name only when there is no
  number, because a name gets retyped and respaced.
* **It seeds, it never overwrites.** A course with tagging of its own is
  refused, so the op is safe to call at any time and safe to call twice.
* **The seeded model records where it came from** (`seed: {course, name, at}`),
  which survives every later merge, so the tutor's tooltip says "12 points
  tagged 5f, counting what carried over from C/16 2026" rather than claiming
  twelve points this course cannot show.
* **It carries counts of words, and nothing else**: no name, no point, nothing
  a candidate wrote.

**Edits:** one new case beside `putCourse`, and two helpers (`centreOf_`,
`halveCounts_`) beside the chunking ones. Deployed as version 23.

**Proving it.** `node store/verify-seed.mjs` creates two courses, teaches one,
seeds the other and deletes both: a different centre gets nothing, the same
centre gets the counts halved with the rejections intact, a tutor sees it and a
trainee on the same course does not, and a second ask is refused.
