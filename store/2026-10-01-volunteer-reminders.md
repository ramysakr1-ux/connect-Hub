# The volunteer reminders (1 Oct 2026) — version 56

**Why.** Ramy: "they're just going to get an email reminder the day before
like we do with Connect and then they choose, are they coming or not, yes or
no. If they choose, it appears on the register, maybe also the trainees' card,
so they know and the tutors know how many are coming. It should be part of the
planning." Then: eighteen hours before the first teaching practice, not a
fixed hour, "because different courses, different times"; a second reminder
an hour before class, only to those who said yes; and "they have a choice to
say stop sending me notifications".

**What.**
- `sendVolunteerReminders()` on a **half-hourly time trigger**
  (`installReminderTrigger()` installs it; needs MailApp authorisation once).
  For each course: skip a pinned demo (`settings.demoToday`), a finished course,
  and a course whose timetable is not published. `nextClass_` finds the next
  teaching day and the first `tp` slot's start in the course's zone. First
  mail when `0 < hours ≤ 18` and `hours > 2`, to every student with an address
  and `notify !== false`; second mail when `hours ≤ 1.25`, only to those whose
  `replies[day].coming === 'yes'`. Each is recorded on the record as
  `reminded[day]` / `reminded[day + ':today']` so it never repeats. Sender:
  the account's MailApp, display name the centre, reply-to
  `settings.volunteerContact.email`. Six languages (`REMIND_`), the student's
  (`s.lang`, kept by `volunteerAgree` since v56) over English.
- The mail's buttons open the student's own page:
  `26_volunteer.html?v=TOKEN&day=YYYY-MM-DD&coming=yes|no`, and a last line
  `&notify=off`.
- Ops, volunteer-only: `volunteerReply {day, coming:'yes'|'no'}` →
  `replies[day] = {coming, at}`; `volunteerNotify {on}` → `notify`.
- Boots: the volunteer's carries `replies`, `email`, `notify`, `nextClass`;
  everyone's course carries `coming: {day, tp, from, yes, no, noAnswer, total}`
  (no names); the assessor's `volunteers` has no `email` field.

**Proved live** on the first-week demo: count present; a reply kept and the
count moved; "maybe" and a tutor's attempt refused; notify off kept; the
assessor's copy without addresses. The demo reply was then set back.

**Not yet done here:** the trigger is NOT installed until `installReminderTrigger`
is run once from the editor and MailApp authorised — Ramy's account, his click.
