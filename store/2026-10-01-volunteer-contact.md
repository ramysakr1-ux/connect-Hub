# A volunteer writes to the centre, never a tutor (1 Oct 2026) — version 54

**Why.** v51 sent the tutor contacts on a volunteer's boot so the student's
page could offer "if you cannot come, tell your teacher". Ramy, watching the
film: *"we most definitely don't want to give the course tutors' emails to
the volunteer students. Absolutely not."* Then: *"if you already built that
email thingy, then leave it — but it will be the centre, whoever is in charge
of the volunteer students: whatever email is entered in Course admin, that's
the one they will see."*

**What.** The volunteer boot no longer carries `tutorContacts`. It carries
`volunteerContact: {name, email} | null` from `settings.volunteerContact`,
which Course admin now has a field for (Settings → Volunteer students). The
page shows that one name under "If you cannot come, tell the centre".
Nothing else changed. Patched live on c6 and c7; the seed sets it.
