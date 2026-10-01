# The volunteer boot carries the tutors to write to — version 51, 1 Oct 2026

Ramy: "let's add an email section to the volunteer students — there is an
email your tutor tab for the trainees, so it should already be built." It was,
on the candidates' home; the volunteer's page could not use it because the
store's volunteer boot sends a trimmed settings object and `tutorContacts` was
not in it.

`volunteerBoot_` now adds, beside `demoToday` and `volunteerCertificateHours`:

    tutorContacts: (vset.tutorContacts || [])
      .filter(c => c && c.email)
      .map(c => ({ name: c.name || '', email: c.email || '', role: c.role || '' }))

Name, address and role only. No key, no token, and nothing about a candidate.

`26_volunteer.html` draws the block from it: "If you cannot come, tell your
teacher", the tutors by name with the main course tutor marked, a mailto with
the course and the student's name already in the subject. Lite still sends no
mail of its own — this is the student's own mail app, like the candidates'.

Proved on c7 after deploying: the volunteer's settings now carry two contacts
and the block shows Jordan Blake and Diane Okonkwo.
