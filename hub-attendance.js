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
    /* HALF A TICK. Ramy, 1 Oct 2026: "make partial half a tick." It used to
       credit nothing at all, which made coming for part of a day worth the
       same as not coming -- and these are people giving a centre their
       evenings. Half the day, rounded to the minute. */
    if (mark === 'partial') return { tier: 'partial', creditedMinutes: Math.round(total / 2) };
    return { tier: 'absent', creditedMinutes: 0 };
  }

  /* The whole record for one student.
     marks: { '2026-10-05': 'present', ... }   days: ['2026-10-05', ...]
     Returns hours credited, the counts per tier, and the day list in order. */
  function record(marks, days, lessonsInDay, lessonMinutes, perDay) {
    marks = marks || {};
    days = days || [];
    var out = { hours: 0, present: 0, partial: 0, absent: 0, days: [] };
    days.forEach(function (d) {
      var own = perDay && perDay[d];
      var c = own ? dayCredit(marks[d], own.lessons, own.lessonMinutes) : dayCredit(marks[d], lessonsInDay, lessonMinutes);
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
    if (tier === 'partial') return 'Came for part of it — credits half the day, ' + (Math.round(total / 2 / 60 * 100) / 100) + ' hours';
    return 'Not marked';
  }

  /* Is the certificate earned, and how far off is it? Stated in CLASSES,
     because "two more classes" is a thing a person can act on. */
  /* `carried` is what a student already had at this centre before this
     course. Ramy, 1 Oct 2026: the certificate is "160 hours across the
     centre", and a four-week course can only give a volunteer about 36 -- so
     the hours have to come forward. Lite has no identity across courses (a
     volunteer is a token on one course), so the centre types the figure into
     the register and it is added here. */
  function certificate(hours, target, lessonsInDay, lessonMinutes, carried) {
    target = parseFloat(target) || 0;
    var before = parseFloat(carried) || 0;
    var total = hours + before;
    var perDay = (lessonsInDay * lessonMinutes) / 60;
    var left = Math.max(0, target - total);
    return {
      target: target,
      carried: before,
      total: Math.round(total * 100) / 100,
      earned: target > 0 && total >= target,
      hoursLeft: Math.round(left * 100) / 100,
      classesLeft: perDay > 0 ? Math.ceil(left / perDay - 1e-9) : 0
    };
  }

  /* HOURS PER LEVEL (Ramy, 21 Oct 2026: "check the number of hours per
     level according to Cambridge"). Cambridge's guided learning hours are
     cumulative from beginner: A1 90-100, A2 180-200, B1 350-400, B2 500-600,
     C1 700-800, C2 1,000-1,200 (support.cambridgeenglish.org, "Guided
     learning hours"). The hours for a level alone are the step from the one
     below it. A centre's own number, when it sets one, still wins. */
  var LEVEL_HOURS = { A1: 100, A2: 100, B1: 200, B2: 200, C1: 200, C2: 400 };
  function hoursForLevel(level, settings) {
    var own = settings && Number(settings.volunteerCertificateHours);
    if (own > 0) return own;
    return LEVEL_HOURS[String(level || '').trim().toUpperCase()] || 200;
  }

  /* PER LEVEL (Ramy, 8 Oct 2026). The certificate of attendance is 160 hours
     AT A LEVEL -- a level's 200 hours less twenty per cent leeway -- so the
     count is the hours at the student's current level: what they carried in
     at that level, plus this course's days from the day they moved up (if the
     centre moved them up during this course). `levelFrom` is that day; the
     days before it belonged to the level they left. */
  function atLevel(marks, levelFrom) {
    if (!levelFrom) return marks || {};
    var out = {};
    Object.keys(marks || {}).forEach(function (d) { if (d >= levelFrom) out[d] = marks[d]; });
    return out;
  }
  /* The day the hours at the level reached the target: the certificate's
     date. '' when they have not. */
  function completedOn(marks, days, lessonsInDay, lessonMinutes, carried, target, perDay) {
    var total = parseFloat(carried) || 0; target = parseFloat(target) || 0;
    if (!target) return '';
    for (var i = 0; i < (days || []).length; i++) {
      var own = perDay && perDay[days[i]];
      total += (dayCredit((marks || {})[days[i]], own ? own.lessons : lessonsInDay, own ? own.lessonMinutes : lessonMinutes).creditedMinutes || 0) / 60;
      if (total >= target - 1e-9) return days[i];
    }
    return '';
  }

  /* WHICH DAYS ARE CLASSES (Ramy, 26 Oct 2026: "count Monday"). A day the timetable gives teaching practice
     to, as always, at the course's teaching-practice length; and now also a day with a slot in the Teaching
     practice room -- the demonstration lesson, getting to know a new class, the student interviews -- because
     the students are in the room for it. Such a day counts its own slots there, so a 14:00-16:30 session is
     two and a half hours, not a teaching day. A filmed observation is not in that room and does not count. */
  function hm(t) { var m = String(t || '').match(/^(\d{1,2}):(\d{2})/); return m ? +m[1] * 60 + +m[2] : null; }
  function classDays(tt) {
    tt = tt || {};
    var tp = (tt.slots || []).filter(function (s) { return s && s.kind === 'tp'; });
    var tpMin = tp.reduce(function (n, s) { var a = hm(s.from), b = hm(s.to); return a != null && b != null && b > a ? n + b - a : n; }, 0);
    var out = { days: [], perDay: {}, lessons: tp.length, lessonMinutes: tp.length ? Math.round(tpMin / tp.length) : 0 };
    (tt.days || []).forEach(function (d) {
      if (!d || !d.date) return;
      if (d.tp) { out.days.push(d.date); return; }
      var inRoom = (d.sessions || []).filter(function (x) { return x && x.k !== 'break' && x.k !== 'lunch' && /teaching practice/i.test(String(x.room || '')) && hm(x.s) != null && hm(x.e) > hm(x.s); });
      if (!inRoom.length) return;
      var total = inRoom.reduce(function (n, x) { return n + hm(x.e) - hm(x.s); }, 0);
      out.days.push(d.date);
      out.perDay[d.date] = { lessons: inRoom.length, lessonMinutes: Math.round(total / inRoom.length), from: inRoom[0].s, to: inRoom[inRoom.length - 1].e };
    });
    out.days.sort();
    return out;
  }

  /* The next mark when a tutor taps one: nothing, in the room, part of it,
     and back. Three taps to get where you started, so nothing is trapped. */
  function nextMark(mark) {
    return mark === 'present' ? 'partial' : mark === 'partial' ? '' : 'present';
  }

  var api = { TICK_MINUTES: TICK_MINUTES, PARTIAL_MINUTES: PARTIAL_MINUTES,
              lessonsNeededForPresent: lessonsNeededForPresent, dayCredit: dayCredit,
              record: record, describe: describe, certificate: certificate, nextMark: nextMark,
              atLevel: atLevel, completedOn: completedOn, hoursForLevel: hoursForLevel, classDays: classDays };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.hubAttendance = api;
})(typeof window !== 'undefined' ? window : globalThis);
