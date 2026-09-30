/* Connect Lite — what counts as having been in the room.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * Ramy, 30 Sep 2026: "the logic for the certificate of attendance already
 * lives in Connect, so we get that from Connect... also check the attendance
 * logic." This is Connect's rule, ported: src/lib/volunteer-attendance.ts.
 * Lite's first pass got three things wrong, and all three mattered.
 *
 * 1. A TICK CREDITS THE WHOLE SESSION, not the lessons attended. Connect's
 *    own words: "90 minutes earns a tick, and the tick credits the whole
 *    session (e.g. 2¼ hours) regardless of the exact time logged." Somebody
 *    who sits through two of the day's three lessons is credited the day.
 *    Lite was multiplying marks by the day's length, which is the same answer
 *    only when a day has one lesson.
 *
 * 2. PRESENT IS A SHARE OF THE DAY'S OWN LESSONS, not a fixed ninety minutes.
 *    round(2N/3) of N lessons: two of three, and one of two. The flat ninety
 *    minutes got a two-lesson day wrong, reading one 45-minute lesson as "one
 *    lesson" and banking nothing.
 *
 * 3. THERE IS A MIDDLE TIER. 45 to 89 minutes -- one lesson of three -- is
 *    recorded as its own mark and credits no hours. Connect keeps it because
 *    "a tutor seeing someone who repeatedly arrives for one lesson has a
 *    different problem from someone who never comes, and the register should
 *    show the difference." Nothing part-credits.
 *
 * WHAT LITE RECORDS. Connect marks each teaching-practice event separately
 * and derives the tier. Lite's register is one row per DAY, so the tier is
 * recorded directly -- 'present' or 'partial' -- and the lesson counts are
 * read off the timetable. Same three tiers, same credit, without asking a
 * tutor to tap forty-eight times.
 *
 * THE THRESHOLD. Connect's is 160 hours and banks them ACROSS courses, so a
 * volunteer earns one certificate over several courses. Lite holds one course
 * at a time and has no bank, so its threshold is per course and the centre
 * sets it (settings.volunteerCertificateHours). A four-week course is about
 * 36 hours, so Connect's 160 would mean no certificate is ever earned here.
 */
(function (root) {
  'use strict';

  /* Connect: TICK_THRESHOLD_MINUTES / PARTIAL_THRESHOLD_MINUTES. */
  var TICK_MINUTES = 90;
  var PARTIAL_MINUTES = 45;

  /* How many of a day's lessons a person has to sit through to be counted
     present: round(2N/3), never less than one. Connect's
     blocksNeededForPresent, unchanged. */
  function lessonsNeededForPresent(totalLessons) {
    return Math.max(1, Math.round((totalLessons * 2) / 3));
  }

  /* One day, as the register holds it: mark is '', 'present' or 'partial'.
     Returns the tier and the minutes CREDITED -- the whole day when present,
     nothing otherwise. */
  function dayCredit(mark, lessonsInDay, lessonMinutes) {
    var total = (lessonsInDay || 0) * (lessonMinutes || 0);
    if (mark === 'present') return { tier: 'present', creditedMinutes: total };
    if (mark === 'partial') return { tier: 'partial', creditedMinutes: 0 };
    return { tier: 'absent', creditedMinutes: 0 };
  }

  /* The whole record for one student.
     marks: { '2026-10-05': 'present', ... }   days: ['2026-10-05', ...]
     Returns hours credited, the counts per tier, and the day list in order. */
  function record(marks, days, lessonsInDay, lessonMinutes) {
    marks = marks || {};
    days = days || [];
    var out = { hours: 0, present: 0, partial: 0, absent: 0, days: [] };
    days.forEach(function (d) {
      var c = dayCredit(marks[d], lessonsInDay, lessonMinutes);
      out[c.tier]++;
      out.hours += c.creditedMinutes / 60;
      out.days.push({ date: d, tier: c.tier, creditedMinutes: c.creditedMinutes });
    });
    out.hours = Math.round(out.hours * 1000) / 1000;
    return out;
  }

  /* What the register says a mark MEANS, in the tutor's own terms, so the
     screen and this file cannot drift apart. */
  function describe(tier, lessonsInDay, lessonMinutes) {
    var need = lessonsNeededForPresent(lessonsInDay);
    var total = lessonsInDay * lessonMinutes;
    if (tier === 'present') return 'In the room — ' + need + ' of ' + lessonsInDay + ' lessons or more, credited the whole ' + (Math.round(total / 60 * 100) / 100) + ' hours';
    if (tier === 'partial') return 'Came for part of it — recorded, but it credits no hours';
    return 'Not marked';
  }

  /* Is the certificate earned, and how far off is it? Stated in CLASSES,
     because "two more classes" is a thing a person can act on. */
  function certificate(hours, target, lessonsInDay, lessonMinutes) {
    target = parseFloat(target) || 0;
    var perDay = (lessonsInDay * lessonMinutes) / 60;
    var left = Math.max(0, target - hours);
    return {
      target: target,
      earned: target > 0 && hours >= target,
      hoursLeft: Math.round(left * 100) / 100,
      classesLeft: perDay > 0 ? Math.ceil(left / perDay - 1e-9) : 0
    };
  }

  /* The next mark when a tutor taps one: nothing, in the room, part of it,
     and back. Three taps to get where you started, so nothing is trapped. */
  function nextMark(mark) {
    return mark === 'present' ? 'partial' : mark === 'partial' ? '' : 'present';
  }

  var api = { TICK_MINUTES: TICK_MINUTES, PARTIAL_MINUTES: PARTIAL_MINUTES,
              lessonsNeededForPresent: lessonsNeededForPresent, dayCredit: dayCredit,
              record: record, describe: describe, certificate: certificate, nextMark: nextMark };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.hubAttendance = api;
})(typeof window !== 'undefined' ? window : globalThis);
