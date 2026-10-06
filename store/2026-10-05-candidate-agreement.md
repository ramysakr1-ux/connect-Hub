# The candidate agreement, signed on screen (5 Oct 2026)

**Why.** Cambridge's CELTA 5 booklet lists the candidate agreement among the
centre's own responsibilities and says what belongs in it: "to provide a
candidate agreement detailing, for example: the attendance policy, plagiarism
information, the complaints policy, any policies on resubmissions of written
work etc." Until now Lite had one box for it on Course admin — a link to a file
somewhere else — and no record of any trainee having read it. Ramy, 5 Oct 2026:
"they would just sign when they, you know, join the course."

The centre now writes the four sections on Course admin (or pastes a link to its
own agreement, which a centre may still prefer), the trainee reads them on
`29_candidate_agreement.html` and signs with the usual pad, and the assessor's
pack says how many have signed and who.

**No separate "own work" document.** The Handbook for Tutors asks that candidates
"confirm in writing that the written assignments are their own work"; Lite
already takes that on every submission, on the declaration step of
`9_assignment_submission`. Cambridge files plagiarism information *inside* the
candidate agreement, so it is a section here rather than a sheet of its own.

**What the store has to do.** One more TRAINEE-level kind, `agreement`, beside
`plan`, `selfeval`, `celta5` and the rest. The client already sends it:

```js
// hub-sync.js, TRAINEE_KEYS
'chub:agreement': 'agreement'
// which schedules, on a trainee's own page:
{ op: 'put', token: <trainee token>, kind: 'agreement', data: <below> }
```

`data` is one small object — never a list, never chunked:

```js
{ name:  "Wei Chen",                    // typed, as signed
  at:    "2026-10-05T10:00:00.000Z",    // ISO, when
  print: "1pdhgmn",                     // fingerprint of the words signed
  ink:   "M12 40 L..." }                // optional: the drawn path, a few KB
```

`print` is a cheap hash of the agreement text as it stood when it was signed, so
a centre that rewrites the agreement afterwards does not silently keep the old
signatures: the trainee's page notices the mismatch and asks them to sign again.
The store neither reads nor validates it; it only has to keep it.

**Gating — NOT like `staffLinks`.** The trainee writes it and must read their
own back. The tutors and the assessor must read it too: the pack counts who has
signed, and that is the whole point of recording it. So `agreement` travels on
the same terms as `celta5` — the trainee's own on `me`, and present on the roster
the tutors and the assessor read. Nothing about it is staff-only.

**Edits, by anchor.** I could not write these precisely: `Code.gs` is not in this
repo, and no earlier note in this folder records the guard that lists the
trainee kinds, so I have no anchor text to match. What has to change is one
place — wherever `case 'put'` checks the kind is a known trainee kind, add
`agreement` to it, exactly as `critLearn` was added to the course-kind guard in
[2026-09-26-critlearn.md](2026-09-26-critlearn.md):

```js
// the shape, not the text: the real line is whatever Code.gs has
if (k !== 'plan' && k !== 'selfeval' && ... && k !== 'agreement') throw new Error('Not a kind: ' + k);
```

If the kind list is a whitelist object or array rather than a chain of `!==`,
adding the string to it is the whole change. Paste the guard into the session
and the exact patch can be written against it.

**VERIFIED FROM THE CLIENT, 6 Oct 2026.** The browser sends exactly this, caught
by pointing hub-store at a local server and signing on the real screen:

```json
{"op":"put","token":"<trainee token>","kind":"agreement",
 "data":{"name":"Wei Chen","at":"2026-10-06T03:38:26.473Z","print":"1bhgpo8"}}
```

So anything still missing is on the store's side of the wire.

**IT IS TWO EDITS, NOT ONE.** A first deploy left the assessor's row reading
"0 of N" after a trainee had signed on another device. Keeping the record is
half of it: a kind the store keeps but never returns is invisible to everybody
but its author. critLearn needed both -- the `putCourse` guard AND the
`case 'course'` return -- and this needs the same shape one level down.

The surest way to find them: search `Code.gs` for **`celta5`**. It is the
closest existing model -- a trainee's own record that the tutors and the
assessor also read -- and `agreement` belongs beside it in every place it
appears: the `put` guard, the trainee's own `me` read, and the read that builds
each trainee's record for the roster that staff see.

**Until it is deployed.** The client side is complete and harmless: a trainee
can read and sign, and the signature is kept in their own browser. It simply
does not travel — the assessor's row reads "0 of 12 signed" however many have
signed, because the store drops a kind it does not know. Nothing breaks, and
nothing else on the course is affected.

**Proving it.** `npm run check` covers the new screen in all four roles. The
flow was driven in a real browser before this note: the four sections render,
signing writes the record, the trainee's home card turns to "Signed 5 October
2026", and a seeded roster of three with two signed renders "2 of 3 signed:
Ana Lopez, Wei Chen" in the pack. After deploying, the test that matters is a
real trainee signing on one device and the pack counting them on another.
