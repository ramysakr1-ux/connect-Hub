# Upload cap depends on who is asking — v69, v70, v71

`putMaterial` capped every upload at 2MB. That cap exists for a reason Ramy
stated plainly on 4 Oct 2026:

> "The two megabyte thing wasn't about TP points. It was more about trainees
> uploading material on our own Drive. They can upload a link to their own
> Drive, but if they choose to upload on our Drive, we capped it at 2MB."

The code already said so, in the line above the test: *"a client is a request,
not a promise, and this one arrives from an anonymous link."*

What needed the headroom was the other caller: a teaching day's book pages as
one PDF at 300 dpi is 1.2–2.3MB, and that is us attaching material to a TP
point, not a trainee filling the Drive.

**v71 is the fix:** `var MAX_UPLOAD_MB = byTutor ? 9 : 2;` — `byTutor` is
already in scope from `req.key`, so a trainee's anonymous token keeps the 2MB
it always had and only a call carrying the tutor key gets 9MB. Callers that
attach set material must now send `key` as well as `token`.

## Two wrong turns on the way, recorded so they are not repeated

**v69 raised it for everybody AND got the arithmetic wrong.** I read
`bytes.length > 2 * 1024 * 1024` and decided `bytes` was the base64 string, so
the real limit was "about 1.5MB". It is not: the line above is
`var bytes = Utilities.base64Decode(b64)`, so it was already a true 2MB on the
decoded file. v69 shipped `bytes.length * 3 / 4 > 9MB`, which made the real cap
**12MB**. A 10MB upload sailed through and that is how it was caught.

**v70 fixed the arithmetic but still raised it for everybody**, which removed
Ramy's protection without noticing it was a protection.

Lessons: read the line above the one being changed; and when a guard looks
arbitrary, ask who it is guarding against before moving it.

## Verified against the live store after v71

- trainee token, 3MB → refused, "That file is over 2MB…"
- tutor key, 3MB → accepted
- assessor key write → still refused, "Tutors only"
- `ping`, a course read of the scratch course → ok
