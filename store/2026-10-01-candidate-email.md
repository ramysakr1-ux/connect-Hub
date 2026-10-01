# A candidate may carry an email (1 Oct 2026) — version 53

**Why.** Ramy, 1 Oct 2026: "how about the trainees? do they have an email
section?" They did not: the roster was name, group and a link. Then "size the
trainee email" → "build it" → "build all".

**What.** Column F of the trainees sheet, `email`, optional everywhere. A
sheet made before v53 has no header there; `emailHeader_()` writes it on the
first address written. `cleanEmail_()` trims and refuses anything that is not
shaped like an address.

- `addTrainee {name, group, email?}` — row of six; the answer carries `email`.
- `addTrainees {trainees:[{name, group, email?}]}` — a bad address skips that
  line and says so, like a missing name; six columns written.
- `renameTrainee {token, name?, group?, email?}` — `email` set when given
  (an empty string clears it).
- `roster_` / `traineeAnywhere_` read six columns; `rosterWithRecords_` passes
  `email` through.
- **Who sees it.** A tutor's `boot.roster` and the `roster` op carry it. The
  ASSESSOR's copy of both goes through `withoutEmails_()` — the assessor's
  link never carries a candidate's address. A candidate's own `boot.me` and
  `me` carry their own address and nobody else's. A volunteer's boot never
  had the roster.

**Client.** `hub-store.js`: `addTrainee(name, group, email)`,
`renameTrainee(tok, name, group, email)`; `addTrainees(list)` passes rows
through. Course admin: an Email column on the roster, saved when the box is
left; the add form takes an address; the paste box takes Name, Group, email
in any order; **Email the link** opens the centre's own mail app with the
candidate's link in the message; **Copy the list** puts name, email and link
on the clipboard as three columns for a mail merge. The end-of-course report
gets **Email it to the candidate** (subject set, the tutor attaches the PDF).
Lite still sends nothing itself.

**Proved on a scratch course** — see the session notes for the run.
