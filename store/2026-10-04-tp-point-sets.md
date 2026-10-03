# A course's TP point set rides with the points (4 Oct 2026, version 67)

**Why.** The teaching practice points screen generates a lesson type per
candidate and holds a few fields of materials. What it never held was the
lesson: the aims written out, the pages, the stages, the timings. Those live in
a centre's own Word documents, one per session with three slots in it, and Lite
had nowhere to put them — a candidate got "Reading" and a page reference.

A SET is those documents, written once against the coursebook: 2 × TPS
sessions (TP 1A, 1B, 2A, …), three slots each, each slot carrying its type,
aims, lesson shape, pages, tracks and an ordered list of stages with minutes,
interaction, what to do and what to watch out for. `28_tp_point_sets.html`
writes one — by hand, by pasting, or by importing a .docx, which the browser
unzips and reads without a library and without the file leaving the laptop.

The set decides what each slot IS; the rotation still decides WHO takes it,
because the teaching order already rotates (ABC, BCA, CAB) and a candidate's
place in that order is the slot number. Where no set is written for a place,
the rotation generates the type exactly as before.

**The one-line change.** The set is stored on the `tppoints` record as `set`.
The write path already stored whatever was sent; the READ path shaped the
record and dropped it silently, which is why a set written from the screen
vanished on the next boot:

    -  if (reader) return { groups: byGroup, released: rel, sets: p.sets || {} };
    +  if (reader) return { groups: byGroup, released: rel, sets: p.sets || {}, set: p.set || null };

in `tpPointsFor_`. Readers only — a tutor or an assessor. A candidate's two
branches are untouched and never carry the set: the rotation stamps a slot's
content into each cell when it builds, so a candidate receives their own cells
and nothing else, and an edit to the set cannot silently rewrite a lesson
somebody has already planned. Re-applying is a deliberate press on the TP
points screen.

**Checked.** Written and read back on the scratch course before and after the
deploy: before, `{"groups":{},"released":{},"sets":{}}` — the set gone; after,
the set intact. The probe's own write proved the data had been reaching the
sheet all along, so nothing had been lost, only hidden.

**What it does not do.** The set is per course. Writing Language Hub Elementary
once and sharing it across C/18, C/19 and the walkthrough wants a record above
the course, which is a bigger change to the store (a new kind, its own
credential path, the backup) and is not this one. Cloning a course carries its
records, so a set travels that way for now.
