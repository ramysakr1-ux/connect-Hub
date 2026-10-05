# v72 — contribute a set to the Pool, and say something from any screen

Deployed 5 October 2026 as **version 72**.

## Why

Ramy, 5 Oct: *"people are lazy. Can we just click contribute, and it goes
somewhere in the library where no one else can see it? And then I'll get a
notification."* And, minutes later: *"people like to be part of the platform,
like their voice is heard … they can comment if something is wrong … I wonder
if this could just apply everywhere in Connect Lite. For the trainers and
trainees. And assessor."*

## What went in

**`contribute`** — a set offered to the Pool. No credential, like `feedback`:
a tutor contributing is not reading anything, and the page strips every link
before it posts. The set goes to its own Drive folder (`contributionsFolder_`,
property `OFFERS_FOLDER`), shared with nobody; a row goes on the
`contributions` sheet; and `sendAs_` tells Ramy it is there with the file's
address and the command to check it.

Refusals, all tested against the live store: no set, no credit name, nothing
written in it, and — the backstop that matters — **a set still carrying file
links**, because a link here would put somebody's Drive into the Pool.

A set is ~125 KB, far past a cell, which is why the writing goes to a file and
the row carries its address.

**`report`** — "something is wrong" or "an idea", from any screen and any
role. Takes no credential and stores no identity: the row is the screen, the
place within it, the role, the course and the line. `notifyReports_()` mails
them in a batch off the trigger that already carries the comments
(`REPORTS_NOTIFIED`).

**Nothing reads either of them back.** There is no op that returns a
contribution or a report, by design.

## The client

`hub-say.js`, on all 30 screens that load the store: a quiet pill, and a small
link on anything carrying `data-say` (every slot on the TP point sets screen
names itself, so a report says *Speakout B1 · TP 1A · slot 1 (Grammar)*).
`body[data-say-pill="off"]` turns the pill off for a screen that wants it
somewhere else.

## Checked after the deploy

`ping`, all six refusals above, a real `contribute` and a real `report` from
node, and both again through the browser. **Two test rows are on the sheets and
one test file is in the contributions folder, all marked "TEST — delete me".**
