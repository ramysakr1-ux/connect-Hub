# The switch: a cloned course arrives with everything off (28 Sep 2026) — version 38

**Why.** Ramy: "anything connected to a time that carries over or is cloned
requires a tick from the tutor — not a tick, an on/off switch." The pages show
a candidate only what a tutor has turned on. The store's part is the clone.

**What.** In `cloneCourse`, after `keep` is built:

- every carried `settings.courseLinks[]` row gets `show: false`, except a row
  whose label or card contains "timetable" ("they should see it anyway");
- every assignment object in `wording` gets `released: false` — the same
  "held back" flag screen 8 has always set.

No new op. The pages (`hubLinkShown`, `hubReleased`) read the two flags; the
switches on Course admin write them through the ordinary `putCourse`.

**Gotcha that cost a deploy:** a `//` comment appended to a line that ended in
`}` swallowed the brace; the editor saved it, the deploy failed with "An error
occurred", and `new Function(model.getValue())` in the editor tab found it
("Unexpected token 'case'"). Parse before deploying.

**Proved on c5 → clone, 28 Sep 2026:** two planted links came across as
timetable (no flag) and input session (`show:false`); all five wording keys
`released:false`; the clone deleted; c5 put back.
