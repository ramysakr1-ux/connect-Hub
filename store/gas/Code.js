// Connect Lite store -- the one place Lite's records live, so a trainee's plan
// reaches the tutor without a file and comes back the same way.
//
// Ramy, 20 Sep 2026: "the whole point of not to have download, upload... they
// submit the lesson plan, the trainer will see it, will mark it, it goes back,
// like Connect." A static site on GitHub Pages cannot do that alone, so this
// Apps Script web app keeps the records in a Sheet, the way the C17/2026
// Candidate Tracker does, and the Lite pages read and write through it.
//
// Access is by link, as in Connect: every trainee has a token in their link and
// can read and write only their own records, and only the kinds a trainee
// owns; tutors hold the course key and can read everything and write the
// kinds a tutor owns. There are no accounts.
//
// MANY COURSES, since 21 Sep 2026 (Ramy, wanting to sell Lite: "a dashboard
// where I can generate links. Multiple links. To sell."). Every row carries the
// course it belongs to, and each course has its own tutor and assessor key, so
// a key identifies its course and nothing reaches across. Before this the keys
// were single script properties and the store held exactly one course.
//
// THE KEYS ARE NOT IN THE SHEET. They live in this script's properties, as
// KEY_TUTOR_<course> and KEY_ASSESSOR_<course>. They were briefly on the
// courses sheet on 21 Sep and that was wrong: the Sheet is backed up nightly
// into a folder and can be shared or read by anything with Drive access, so a
// credential in it is a credential in every copy. The Sheet holds only what is
// safe to read.
//
// Wire: POST JSON as text/plain (no CORS preflight) -> JSON out.
//   { op, key?, a?, token?, kind?, data? }

var SHEET_COURSES  = 'courses';   // id | name | created | deleted   (the keys are NOT here -- see below)
var SHEET_RECORDS  = 'records';   // course | token | kind | json | updated
var SHEET_TRAINEES = 'trainees';  // course | token | name | group | created
var SHEET_COURSE   = 'course';    // course | kind | json | updated  (settings, wording)
var SHEET_FEEDBACK = 'feedback';
var SHEET_OFFERS = 'contributions';
var SHEET_REPORTS = 'reports';  // at | page | course | role | thumb | text   (v59: a thumb from a demo or the offer page; no names)
var SHEET_CENTRES = 'centres';   // number | name | first seen | courses made   (v74)

// Who may write what. A trainee owns their paperwork and submissions; a tutor
// owns the marking, the feedback and the record. 'assignments' is shared:
// the trainee submits into it and the tutor marks into it, so both may write
// it and the screens keep the two halves apart.
// celta5: the candidate's half of the CELTA 5 record booklet; celta5t: the tutors' half (28 Sep 2026)
var TRAINEE_WRITES = { plan:1, selfeval:1, assignments:1, observations:1, celta5:1, agreement:1, interview:1, notebook:1, about:1, tpHistory:0 };// staffLinks: about a candidate, for the tutors and the assessor only -- deliberately absent from TRAINEE_READS (28 Sep 2026)
/* about (28 Oct 2026): first language, nationality, teaching experience and gender, for mixing the groups; the trainee's own answers, or Course admin's */
var TUTOR_WRITES = { plan:1, selfeval:1, feedback:1, assignments:1, tracker:1, observations:1, links:1, staffLinks:1, celta5:1, celta5t:1, interview:1, about:1, tpHistory:1 };
// links: a candidate's private links (their CELTA 5, a reading), written by the tutor, read by the candidate (28 Sep 2026)
var TRAINEE_READS = { plan:1, selfeval:1, feedback:1, assignments:1, tracker:1, observations:1, links:1, celta5:1, celta5t:1, agreement:1, interview:1, tpHistory:1, courseFeedbackSent:1, notebook:1, about:1 };
/* THE NOTEBOOK (v129, 25 Oct 2026). Ramy: "a smart notebook... personal, obviously". A trainee's notes are
   theirs alone: written and read on their own token, and NEVER folded into the roster a tutor or the
   assessor boots with, nor answered to a reader's `get`. A note reaches anyone else only when its writer
   shares it (shareNote, below), into the course-level `notes` pool. The tutors' notebooks are the same
   idea on the course side (`tutorNotes`, one list per tutor name, read back only as that tutor). */
var PRIVATE_KINDS = { notebook:1 };
function doGet(e) {
  return json_({ ok: true, service: 'connect-lite-store', hint: 'POST a JSON body' });
}

// ---- the volunteer reminders (v56, 1 Oct 2026) --------------------------------
// Ramy: "an email reminder the day before, like we do with Connect, and then
// they choose: are they coming or not, yes or no. If they choose, it appears on
// the register, maybe also the trainees' card, so they know and the tutors
// know how many are coming." Two mails, both from the store on a half-hourly
// timer: the FIRST eighteen hours before the day's first teaching practice, to
// everyone on the register with an address; the SECOND an hour before it, only
// to those who said yes. Every mail carries a line to stop them. A pinned demo
// never sends; a finished course never sends; a course whose timetable is not
// set never sends. The answers land on the row (replies[day]) and the count
// rides on every boot as `coming`.
var SITE_ = 'https://lite.celtaconnect.com/';
var REMIND_ = {
  en: { subject: 'Are you coming tomorrow?', ask: 'Tomorrow, {when}: {what}. Are you coming?', yes: 'Yes, I am coming', no: 'No, not tomorrow', today: 'See you today at {time}: {what}.', join: 'Join the class', stop: 'Stop these emails', from: '{centre}' },
  tr: { subject: 'Yarın geliyor musunuz?', ask: 'Yarın, {when}: {what}. Geliyor musunuz?', yes: 'Evet, geliyorum', no: 'Hayır, yarın gelemiyorum', today: 'Bugün {time}: {what}. Görüşürüz.', join: 'Derse katıl', stop: 'Bu e-postaları durdur', from: '{centre}' },
  ar: { subject: 'هل ستأتي غدًا؟', ask: 'غدًا، {when}: {what}. هل ستأتي؟', yes: 'نعم، سآتي', no: 'لا، ليس غدًا', today: 'نراك اليوم الساعة {time}: {what}.', join: 'انضم إلى الدرس', stop: 'أوقف هذه الرسائل', from: '{centre}' },
  ru: { subject: 'Вы придёте завтра?', ask: 'Завтра, {when}: {what}. Вы придёте?', yes: 'Да, приду', no: 'Нет, завтра не смогу', today: 'До встречи сегодня в {time}: {what}.', join: 'Войти в класс', stop: 'Больше не присылать', from: '{centre}' },
  fa: { subject: 'فردا می‌آیید؟', ask: 'فردا، {when}: {what}. می‌آیید؟', yes: 'بله، می‌آیم', no: 'نه، فردا نمی‌توانم', today: 'امروز ساعت {time} می‌بینمتان: {what}.', join: 'ورود به کلاس', stop: 'این ایمیل‌ها را متوقف کن', from: '{centre}' },
  uk: { subject: 'Ви прийдете завтра?', ask: 'Завтра, {when}: {what}. Ви прийдете?', yes: 'Так, прийду', no: 'Ні, завтра не зможу', today: 'До зустрічі сьогодні о {time}: {what}.', join: 'Приєднатися до заняття', stop: 'Більше не надсилати', from: '{centre}' }
};
function fill_(s, o) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return o[k] == null ? '' : o[k]; }); }
// A wall-clock time in a zone, as an instant.
function localInstant_(ymd, hm, tz) {
  var guess = new Date(ymd + 'T' + hm + ':00Z');
  var shown = Utilities.formatDate(guess, tz, "yyyy-MM-dd'T'HH:mm");
  var diffMin = (Date.parse(ymd + 'T' + hm + ':00Z') - Date.parse(shown + ':00Z')) / 60000;
  return new Date(guess.getTime() + diffMin * 60000);
}
// The next teaching day with practice, and the first practice slot's start.
function nextClass_(courseId) {
  var set = courseRead_(courseId, 'settings') || {};
  var tz = set.timeZone || 'Europe/London';
  var tt = courseRead_(courseId, 'timetable') || {};
  if (!tt.published) return null;
  var tp = (tt.slots || []).filter(function (s) { return s && s.kind === 'tp' && s.from; })[0];
  var now = courseDay_(set) ? localInstant_(courseDay_(set), '09:00', tz) : new Date();
  /* A class is a teaching practice day, or a day with a slot in the Teaching practice room: the demonstration
     lesson, getting to know a new class (Ramy, 26 Oct 2026: "count Monday"; hub-attendance.js classDays). */
  var inRoom = function (d) { return (d.sessions || []).filter(function (x) { return x && x.s && x.e && x.k !== 'break' && x.k !== 'lunch' && /teaching practice/i.test(String(x.room || '')); }).sort(function (a, b) { return a.s < b.s ? -1 : 1; }); };
  var days = (tt.days || []).filter(function (d) { return d && d.date && ((d.tp && tp) || (!d.tp && inRoom(d).length)); });
  for (var i = 0; i < days.length; i++) {
    var rs = days[i].tp ? null : inRoom(days[i]);
    var from = rs ? rs[0].s : tp.from, to = rs ? rs[rs.length - 1].e : (tp.to || '');
    var start = localInstant_(days[i].date, from, tz);
    if (start.getTime() > now.getTime() - 3 * 36e5) return { day: days[i].date, tp: days[i].tp || '', label: rs ? String(rs[0].t || '') : '', from: from, to: to, startISO: start.toISOString() };
  }
  return null;
}
// How many are coming to the next class, without a name.
function comingFor_(courseId) {
  var nx = nextClass_(courseId); if (!nx) return null;
  var reg = courseRead_(courseId, 'volunteers') || {};
  var yes = 0, no = 0, none = 0;
  (reg.students || []).forEach(function (s) { if (!s) return; var r = (s.replies || {})[nx.day]; if (r && r.coming === 'yes') yes++; else if (r && r.coming === 'no') no++; else none++; });
  return { day: nx.day, tp: nx.tp, label: nx.label || '', from: nx.from, yes: yes, no: no, noAnswer: none, total: yes + no + none };
}
function withoutVolunteerEmails_(reg, strip) {
  if (!strip || !reg || !reg.students) return reg;
  var out = {}; Object.keys(reg).forEach(function (k) { out[k] = reg[k]; });
  out.students = reg.students.map(function (s) { if (!s) return s; var o = {}; Object.keys(s).forEach(function (k) { if (k !== 'email') o[k] = s[k]; }); return o; });
  return out;
}
/* v59: when a comment arrives on the feedback sheet, one mail to the owner
   with the lines since the last one -- on the same half-hourly timer. */
/* THE TWO PILES, FOR THE CONSOLE. Ramy asked for them on the console rather
   than only in the mail, 5 Oct 2026. Newest first, and the whole row, because
   a contribution is nine short fields and a report is eight -- there is
   nothing here worth a second call to fetch. */
function inboxRows_(name, limit) {
  var sh = sheet_(name), l = sh.getLastRow();
  if (l < 2) return [];
  var n = Math.min(limit, l - 1);
  var head = HEADERS[name];
  return sh.getRange(l - n + 1, 1, n, head.length).getValues().map(function (r) {
    var o = {};
    head.forEach(function (h, i) { o[h] = (r[i] instanceof Date) ? r[i].toISOString() : r[i]; });
    return o;
  }).reverse();
}
function inboxSheet_(which) {
  if (which === 'contributions') return SHEET_OFFERS;
  if (which === 'reports') return SHEET_REPORTS;
  throw new Error('contributions or reports');
}
function notifyReports_() {
  try {
    var props = PropertiesService.getScriptProperties();
    var last = props.getProperty('REPORTS_NOTIFIED') || '';
    var sh = sheet_(SHEET_REPORTS), l = sh.getLastRow();
    if (l < 2) return;
    var rows = sh.getRange(2, 1, l - 1, 8).getValues();
    var fresh = rows.filter(function (r) { var at = r[0] ? new Date(r[0]).toISOString() : ''; return at > last && String(r[4] || '').trim(); });
    if (!fresh.length) return;
    var lines = fresh.map(function (r) {
      return '\u2022 ' + (r[1] === 'wrong' ? 'WRONG' : 'IDEA') + '  ' + String(r[4]).trim()
        + '\n    ' + String(r[2] || '') + (r[3] ? ' \u00b7 ' + r[3] : '')
        + (r[5] ? ' \u00b7 ' + r[5] : '') + (r[6] ? ' \u00b7 ' + r[6] : '')
        + ' \u00b7 ' + new Date(r[0]).toISOString().slice(0, 16).replace('T', ' ');
    });
    var to = Session.getEffectiveUser().getEmail();
    if (!to) return;
    var wrong = fresh.filter(function (r) { return r[1] === 'wrong'; }).length;
    MailApp.sendEmail({ to: to, name: 'Connect Lite',
      subject: 'Connect Lite: ' + fresh.length + ' from the people using it'
        + (wrong ? ' (' + wrong + ' said something is wrong)' : ''),
      body: lines.join('\n\n') + '\n\nThe whole sheet: ' + dataSheetUrl() });
    props.setProperty('REPORTS_NOTIFIED', new Date(fresh[fresh.length - 1][0]).toISOString());
  } catch (e) { Logger.log('report mail: ' + e); }
}
function notifyFeedback_() {
  try {
    var props = PropertiesService.getScriptProperties();
    var last = props.getProperty('FEEDBACK_NOTIFIED') || '';
    var sh = sheet_(SHEET_FEEDBACK), l = sh.getLastRow();
    if (l < 2) return;
    var rows = sh.getRange(2, 1, l - 1, 6).getValues();
    var fresh = rows.filter(function (r) { var at = r[0] ? new Date(r[0]).toISOString() : ''; return at > last && String(r[5] || '').trim(); });
    if (!fresh.length) return;
    var lines = fresh.map(function (r) { return '\u2022 ' + (r[4] === 'up' ? '\uD83D\uDC4D' : '\uD83D\uDC4E') + ' ' + String(r[5]).trim() + '  \u2014 ' + String(r[1]) + (r[2] ? ' \u00b7 ' + r[2] : '') + (r[3] ? ' \u00b7 ' + r[3] : '') + ' \u00b7 ' + new Date(r[0]).toISOString().slice(0, 16).replace('T', ' '); });
    var to = Session.getEffectiveUser().getEmail();
    if (!to) return;
    MailApp.sendEmail({ to: to, subject: 'Connect Lite: ' + fresh.length + ' new comment' + (fresh.length === 1 ? '' : 's'), body: lines.join('\n') + '\n\nThe whole sheet: ' + dataSheetUrl(), name: 'Connect Lite' });
    props.setProperty('FEEDBACK_NOTIFIED', new Date(fresh[fresh.length - 1][0]).toISOString());
  } catch (e) { Logger.log('feedback mail: ' + e); }
}
/* The address a volunteer student sees. The name on the mail is the centre's
   and the reply goes to the centre's own address, but the envelope belongs to
   whoever runs this script -- which was Ramy's personal Gmail (2 Oct 2026:
   "those should be coming from the center... make it info"). No mail system
   would let Lite send AS the centre's own domain, so the envelope is Connect's
   own address instead of a private one.

   lite@, not info@ or support@: one address per product, so a message in the
   one inbox says which product it belongs to before it is opened (Ramy,
   2 Oct 2026: "when I get an email, I don't know if it's coming from Connect
   or coming from Connect Lite"). Connect keeps noreply@ and support@.

   It is used only if the account running the script really holds it as a
   verified "send mail as" alias -- which the Workspace account does natively,
   since lite@ is an alias on it; otherwise the mail goes as before rather
   than not at all. */
/* THE COURSE'S DAY (v166, 27 Oct 2026). A demo is pinned to a day (settings.demoToday) and keeps every write off
   the store; a PRESENTATION course (settings.presentToday, Ramy: "open a new course in front of everyone ... fill in")
   moves its day the same way but saves for real, so the tutor's tab and the trainee's tab talk to each other. Either
   one is the course's clock; only the demo is read-only. */
function courseDay_(set) { var d = String((set && (set.demoToday || set.presentToday)) || ''); return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : ''; }
/* Nothing is ever sent to a made-up address: the presentation course's trainees (and any example) live at
   example.com, .test, .example or .invalid, which no mail should reach. */
function realTo_(to) {
  return String(to || '').split(',').map(function (x) { return x.trim(); })
    .filter(function (x) { return x && !/@(example\.(com|org|net)|[^@]*\.(test|example|invalid))$/i.test(x); }).join(', ');
}
var FROM_ = 'lite@celtaconnect.com';
var FROM_OK_ = null;
function sendAs_(msg) {
  msg.to = realTo_(msg.to); if (msg.bcc) msg.bcc = realTo_(msg.bcc);
  if (!msg.to) return;
  if (FROM_OK_ === null) {
    try { FROM_OK_ = GmailApp.getAliases().indexOf(FROM_) !== -1; } catch (e) { FROM_OK_ = false; }
  }
  if (!FROM_OK_) { MailApp.sendEmail(msg); return; }
  var opt = { htmlBody: msg.htmlBody, name: msg.name, replyTo: msg.replyTo, from: FROM_ };
  if (msg.bcc) opt.bcc = msg.bcc;
  if (msg.attachments) opt.attachments = msg.attachments;
  GmailApp.sendEmail(msg.to, msg.subject, msg.body || '', opt);
}
function sendVolunteerReminders() {
  notifyFeedback_();
  notifyReports_();
  var now = new Date();
  courses_().forEach(function (c) {
    try {
      var set = courseRead_(c.id, 'settings') || {};
      if (set.demoToday || set.presentToday) return;
      var tz = set.timeZone || 'Europe/London';
      if (set.end && Utilities.formatDate(now, tz, 'yyyy-MM-dd') > String(set.end)) return;
      var nx = nextClass_(c.id); if (!nx) return;
      var start = new Date(nx.startISO);
      var hours = (start.getTime() - now.getTime()) / 36e5;
      if (hours <= 0 || hours > 18) return;
      var reg = courseRead_(c.id, 'volunteers') || {};
      var done = reg.reminded || {};
      var first = !done[nx.day] && hours > 2;
      var second = !(done[nx.day + ':today'] || false) && hours <= 1.25;
      if (!first && !second) return;
      var rooms = (set.onlineRooms || []).filter(function (r) { return r && r.url && /teaching/i.test(r.label || ''); });
      var what = (nx.tp ? 'Teaching practice' : (nx.label || 'Class')) + (rooms.length === 1 && rooms[0].level ? ' (' + rooms[0].level + ')' : '');
      var when = Utilities.formatDate(start, tz, 'EEEE d MMMM, HH:mm');
      var time = Utilities.formatDate(start, tz, 'HH:mm');
      var contact = (set.volunteerContact && set.volunteerContact.email) ? set.volunteerContact.email : null;
      var centre = set.centreName || 'Connect Lite';
      var sent = 0;
      (reg.students || []).forEach(function (s) {
        if (!s || !s.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email) || s.notify === false) return;
        var r = (s.replies || {})[nx.day];
        if (second && !(r && r.coming === 'yes')) return;
        var L = REMIND_[s.lang] || REMIND_.en, E = REMIND_.en;
        var base = SITE_ + '26_volunteer.html?v=' + encodeURIComponent(s.token);
        var o = { when: when, what: what, time: time, centre: centre };
        var html, subject;
        if (first) {
          subject = (L === E ? '' : fill_(L.subject, o) + ' / ') + fill_(E.subject, o);
          html = '<p style="font:16px/1.5 Arial,sans-serif">' + fill_(L.ask, o) + (L === E ? '' : '<br><span style="color:#666">' + fill_(E.ask, o) + '</span>') + '</p>'
            + '<p><a href="' + base + '&day=' + nx.day + '&coming=yes" style="display:inline-block;padding:12px 20px;background:#1f5f5b;color:#fff;text-decoration:none;border-radius:8px;font:bold 15px Arial">' + fill_(L.yes, o) + '</a> &nbsp; '
            + '<a href="' + base + '&day=' + nx.day + '&coming=no" style="display:inline-block;padding:12px 20px;border:2px solid #1f5f5b;color:#1f5f5b;text-decoration:none;border-radius:8px;font:bold 15px Arial">' + fill_(L.no, o) + '</a></p>';
        } else {
          subject = (L === E ? '' : fill_(L.today, o) + ' / ') + fill_(E.today, o);
          var room = rooms[0] ? rooms[0].url : base;
          html = '<p style="font:16px/1.5 Arial,sans-serif">' + fill_(L.today, o) + (L === E ? '' : '<br><span style="color:#666">' + fill_(E.today, o) + '</span>') + '</p>'
            + '<p><a href="' + room + '" style="display:inline-block;padding:12px 20px;background:#1f5f5b;color:#fff;text-decoration:none;border-radius:8px;font:bold 15px Arial">' + fill_(L.join, o) + '</a></p>';
        }
        html += '<p style="font:12px Arial;color:#888;margin-top:28px"><a href="' + base + '&notify=off" style="color:#888">' + fill_(L.stop, o) + (L === E ? '' : ' / ' + fill_(E.stop, o)) + '</a></p>';
        var msg = { to: s.email, subject: subject, htmlBody: html, name: centre };
        if (contact) msg.replyTo = contact;
        sendAs_(msg);
        sent++;
      });
      courseUpdateObj_(c.id, 'volunteers', function (r) { r.reminded = r.reminded || {}; r.reminded[nx.day + (second ? ':today' : '')] = now.toISOString() + ' x' + sent; return r; });
    } catch (e) { Logger.log(c.id + ': ' + e); }
  });
}
// Run once from the editor: a half-hourly timer, replacing any earlier one.
function installReminderTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'sendVolunteerReminders') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('sendVolunteerReminders').timeBased().everyMinutes(30).create();
}

function doPost(e) {
  var req;
  try { req = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (err) { return json_({ ok: false, error: 'Bad JSON' }); }
  IN_REQUEST_ = true; CHANGED_ = {}; REQ_COURSE_ = null; REQ_VER_ = '';
  try {
    var out = handle_(req);
    var res = { ok: true, result: out };
    /* THE COURSE'S VERSION (v179, 29 Oct 2026; Ramy: "it's been a little bit slow"). Every answer about a course
       carries its version: a read says which version it read, a write what it moved the version from and to, so
       the browser that wrote can keep its copy current without booting again. See versionStamp_. */
    try { var vr = settleVersions_(String(req.op || '')); if (vr) res.ver = vr; } catch (ve) {}
    return json_(res);
  } catch (err) {
    try { settleVersions_(''); } catch (ve2) {}
    return json_({ ok: false, error: String(err && err.message || err) });
  } finally { IN_REQUEST_ = false; }
}

/* ---- THE COURSE'S VERSION (v179, 29 Oct 2026) ---------------------------------------------------------------
   A boot sends the whole course, 2.5 MB on the demo, 4 to 6 seconds, and every page booted on every open. Now a
   page asks for the version first (a few bytes) and boots only when it has moved. The version is a script
   property per course, moved by anything that changes the course: every op that is not a known read, and every
   low-level write wherever it comes from (a timed job, an owner's op, a read that happens to write). Moving it
   too often costs a boot; never moving it would be the bug, so the list below names the READS and everything
   else counts as a change. The course's own day is part of the version, so a page whose content follows the
   date (a demo clock, released points) boots once the day turns. */
var IN_REQUEST_ = false, CHANGED_ = {}, REQ_COURSE_ = null, REQ_VER_ = '';
var READ_OPS_ = { ping: 1, boot: 1, version: 1, me: 1, get: 1, course: 1, roster: 1, celta5Assets: 1, audio: 1, materials: 1,
  questions: 1, getQuestionAudio: 1, getNoteAudio: 1, getInterviewAudio: 1, trainerNotes: 1, peerSheets: 1, passInfo: 1,
  ownerCourses: 1, centres: 1, volunteerCards: 1, readContribution: 1, bookings: 1 };
function verKey_(id) { return 'ver:' + id; }
function versionStamp_(id) {
  var v = PropertiesService.getScriptProperties().getProperty(verKey_(id)) || '0';
  var day = '';
  try { var st = courseRead_(id, 'settings') || {}; day = courseDay_(st) || Utilities.formatDate(new Date(), st.timeZone || 'Europe/London', 'yyyy-MM-dd'); } catch (e) {}
  return v + '|' + day;
}
function bumpVersion_(id) {
  var props = PropertiesService.getScriptProperties();
  var lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    var before = props.getProperty(verKey_(id)) || '0';
    var after = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    props.setProperty(verKey_(id), after);
    return { before: before, after: after };
  } finally { lock.releaseLock(); }
}
/* Called by every low-level writer: inside a request the bump waits for the end of it (one bump a request); a timed
   job bumps at once. */
function markChanged_(id) { if (!id) return; if (IN_REQUEST_) { CHANGED_[String(id)] = 1; return; }
  /* outside a request (a timed job) the writer may already hold the script lock, which is not re-entrant: the stamp
     is written without it, which is safe for a random stamp */
  try { PropertiesService.getScriptProperties().setProperty(verKey_(String(id)), Date.now().toString(36) + Math.random().toString(36).slice(2, 6)); } catch (e) {} }
function settleVersions_(op) {
  var cid = REQ_COURSE_ ? String(REQ_COURSE_.id) : '';
  if (cid && op && !READ_OPS_[op]) CHANGED_[cid] = 1;
  var out = null;
  Object.keys(CHANGED_).forEach(function (id) {
    var b = bumpVersion_(id);
    if (id === cid) { var day = REQ_VER_.split('|')[1] || ''; out = { before: b.before + '|' + day, after: b.after + '|' + day }; }
  });
  CHANGED_ = {};
  if (!out && cid && REQ_VER_) out = { at: REQ_VER_ };
  return out;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function handle_(req) {
  migrate_();
  var op = String(req.op || '');
  /* THE ROOM'S DOOR (28 Oct 2026): the one op with no key, no token. A Connect demo's audience asks a question on a page of
     its own (ask.html?c=<course>&k=<code>); the code is the course's own and says nothing but "ask". See roomAsk_. */
  if (op === 'roomAsk') return roomAsk_(req);

  // Which course is this? The credential says so: a tutor key and an assessor
  // key each belong to one course, and a trainee's token is on one course's
  // roster. Nothing here reads a course id from the request.
  var byTutor = req.key ? courseByKey_('tutor', req.key) : null;
  var byAssessor = (!byTutor && req.a) ? courseByKey_('assessor', req.a) : null;
  var tutor = !!byTutor;
  var assessor = !!byAssessor;
  var course = byTutor || byAssessor || null;
  if (assessor) assertAssessorInDate_(course);

  // A request carrying the assessor key never writes, even with a trainee's
  // token alongside it: the link is read-only by definition.
  if (assessor && !/^(ping|boot|version|me|get|course|roster|celta5Assets|audio)$/.test(op)) throw new Error('The assessor link is read-only');

  // A VOLUNTEER STUDENT'S OWN LINK (30 Sep 2026). The token carries its
  // course -- "c5-<20 hex>" -- so nothing has to be scanned and the random
  // half is the secret, the same shape as an assessor key but per person.
  // A volunteer READS and never writes, and only their own page: they are a
  // member of the public who came in to be taught, not a user of the course.
  var vol = null;
  if (!course && req.v) {
    var vs = String(req.v);
    var cut = vs.indexOf('-');
    var vc = cut > 0 ? courseById_(vs.slice(0, cut)) : null;
    if (!vc) throw new Error('This link is not on a course');
    var reg = courseRead_(vc.id, 'volunteers') || {};
    var found = (reg.students || []).filter(function (s) { return s && s.token === vs; })[0];
    if (!found) throw new Error('This link no longer opens the course');
    course = vc; vol = found;
  }
  /* volunteerAgree (30 Sep 2026, version 46) is the ONE write a volunteer may
     make: it stamps their own register row with the moment they agreed to
     the centre's joining note, once, and can touch nothing else. */
  /* v56 adds two more: answering a reminder (volunteerReply) and turning the
     mail off or on (volunteerNotify). Still their own row, still nothing else. */
  /* v136: volunteerCards reads the language of their own level's lessons, and nothing of a trainee's (see the op). */
  if (vol && op !== 'boot' && op !== 'version' && op !== 'ping' && op !== 'volunteerAgree' && op !== 'volunteerReply' && op !== 'volunteerNotify' && op !== 'volunteerCards') throw new Error('This link only opens your own page');
  // A trainee's token names their course, and it must agree with any key sent.
  var me = null;
  if (req.token) {
    me = traineeAnywhere_(String(req.token));
    if (course && me.course !== course.id) throw new Error('This link is not on the course');
    if (!course) course = courseById_(me.course);
  }
  var reader = tutor || assessor;
  var owner = isOwner_(req.owner);
  /* A DEMO LINK WITH A DATE ON IT (v131, 25 Oct 2026; Ramy: "I don't want them to stay forever").
     settings.demoExpires = 'YYYY-MM-DD': after that day every link on the course is refused, and the
     refusal says the date. The owner still reaches the course, to delete it. */
  if (course && !owner && op !== 'ping') {
    var dxs = courseRead_(course.id, 'settings');
    if (dxs && /^\d{4}-\d{2}-\d{2}$/.test(String(dxs.demoExpires || '')) && new Date().toISOString().slice(0, 10) > String(dxs.demoExpires)) {
      throw new Error('This demo link expired on ' + new Date(dxs.demoExpires + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) + '.');
    }
  }

  /* A DATED PASS (v132, 25 Oct 2026; Ramy: "a dated pass per person... I like this idea"). A link sent to a
     named person from the console carries a pass (&p=), minted for a number of days; the browser sends it
     with every call, and after its date the store refuses that visit with the date. A link without a pass
     (one sent before passes existed, or "no date") never expires. Demos are sent to individuals only; nothing
     public links into one. Soft by design: the pass is a dated invitation, not a lock; to close links already
     sent, rotate the keys. */
  if (course && !owner && req.pass && op !== 'ping' && op !== 'passInfo') passCheck_(course, String(req.pass));

  /* LINK PINS (v87, 15 Oct 2026). Ramy: "receive the link and then the
     first time they click on it, it prompts them to choose a password and
     they enter it twice. If they lose it, the course admin sends them
     another link and the other one is terminated." So: a course switches
     PINs on (settings.pinLinks); from then on a trainee link opens with
     "choose a PIN" (setMyPin, the one op allowed before a PIN exists) and
     every later call needs it; the tutor link the same, the first tutor to
     open it choosing for the team (setTutorPin). A lost PIN is not reset: a
     new link is issued (reissueTrainee; rotateKey for the team) and the old
     one dies. A course with the switch off is not gated at all, so the demo
     and the old courses keep working. The assessor's link and the volunteers'
     are never gated. 'ping' passes. Three refusals the pages key on:
     'PIN needed' (choose one), 'PIN required' (type yours), 'Wrong PIN'. */
  if (course && op !== 'ping' && !owner) {
    var pinsRec = courseRead_(course.id, 'pins') || {};
    var pinsOn = !!((courseRead_(course.id, 'settings') || {}).pinLinks);
    var want = tutor ? pinsRec.tutor : (me && !assessor && !vol) ? (pinsRec.trainees || {})[me.token] : null;
    var subject = tutor ? 'tutor' : (me && !assessor && !vol) ? 'trainee' : '';
    if (want && want.hash) {
      var given = String(req.pin || '');
      if (!given) throw new Error('PIN required');
      if (pinHash_(given, want.salt) !== want.hash) throw new Error('Wrong PIN');
    } else if (subject && pinsOn && op !== (subject === 'tutor' ? 'setTutorPin' : 'setMyPin')) {
      throw new Error('PIN needed');
    }
  }

  /* the version as it stood before this op ran: a read answers with it, so anything written during the read is
     newer than what it reports and the next check boots */
  if (course) { REQ_COURSE_ = course; try { REQ_VER_ = versionStamp_(course.id); } catch (e) { REQ_VER_ = ''; } }
  if (op === 'version') { if (!course) throw new Error('This link is not on a course'); return { ver: REQ_VER_ }; }

  switch (op) {
    case 'ping': return { tutor: tutor, assessor: assessor, owner: owner, time: new Date().toISOString() };
    /* THE PASS (v132). `mintPass` is the owner's: a pass for a course, for 1 to 60 days (a week when not said).
       `passInfo` is public and tells the invitation card the date to print; it answers nothing else. */
    case 'mintPass': {
      requireOwner_(owner);
      var mpc = courseById_(String(req.course || '').trim());
      if (!mpc) throw new Error('No such course');
      var mpDays = Math.max(1, Math.min(60, Math.round(Number(req.days)) || 7));
      var mpd = new Date(); mpd.setUTCDate(mpd.getUTCDate() + mpDays);
      var mpExp = mpd.toISOString().slice(0, 10), mpId = 'p-' + mpc.id + '-' + newKey_().slice(0, 12);
      var mpOld = new Date(); mpOld.setUTCDate(mpOld.getUTCDate() - 30); var mpCut = mpOld.toISOString().slice(0, 10);
      courseUpdateObj_(mpc.id, 'passes', function (pool) {
        Object.keys(pool).forEach(function (k) { if (pool[k] && String(pool[k].exp) < mpCut) delete pool[k]; });   // a month after it ended, a pass is forgotten
        pool[mpId] = { exp: mpExp, days: mpDays, label: String(req.label || '').slice(0, 60), at: new Date().toISOString() };
        return pool;
      });
      return { id: mpId, exp: mpExp };
    }
    case 'passInfo': {
      var pi = parsePass_(req.p);
      if (!pi) throw new Error('This link is not valid.');
      var pir = (courseRead_(pi.course, 'passes') || {})[String(req.p)];
      if (!pir) throw new Error('This link is not valid.');
      return { exp: pir.exp, expired: new Date().toISOString().slice(0, 10) > String(pir.exp) };
    }

    /* v59 (1 Oct 2026). Ramy: "some kind of likes feedback, connected to
       Google" -- demos and the offer page only. A thumb and an optional line,
       from anyone, with no credential: the page says which page it is, the
       course name if it is a demo, and the role; nothing that names a person.
       Text is capped; a row a tap. */
    case 'feedback': {
      var fbThumb = String(req.thumb || '');
      if (fbThumb !== 'up' && fbThumb !== 'down') throw new Error('up or down');
      var fbText = String(req.text || '').replace(/\s+/g, ' ').trim().slice(0, 400);
      var fbPage = String(req.page || '').slice(0, 60), fbCourse = String(req.course || '').slice(0, 80), fbRole = String(req.role || '').slice(0, 20);
      sheet_(SHEET_FEEDBACK).appendRow([new Date(), fbPage, fbCourse, fbRole, fbThumb, fbText]);
      return { saved: true };
    }
/* SOMETHING IS WRONG, OR SOMETHING WOULD BE BETTER. Ramy, 5 Oct 2026: "people
       like to be part of the platform, like their voice is heard ... they can
       comment if something is wrong ... I wonder if this could just apply
       everywhere in Connect Lite. For the trainers and trainees. And assessor."
       So it takes no credential and names no person: whoever is on a screen can
       say what is wrong with it, and the page says which screen and, where it
       knows, which lesson. A library of a thousand lessons that nobody can
       correct goes stale, and this is the cheapest correction there is. */
    case 'report': {
      var rKind = String(req.kind || 'idea');
      if (rKind !== 'wrong' && rKind !== 'idea') throw new Error('wrong or idea');
      var rText = String(req.text || '').replace(/\s+/g, ' ').trim().slice(0, 600);
      if (!rText) throw new Error('Nothing to say');
      sheet_(SHEET_REPORTS).appendRow([new Date(), rKind,
        String(req.page || '').slice(0, 60), String(req.where || '').slice(0, 120),
        rText, String(req.role || '').slice(0, 20), String(req.course || '').slice(0, 80), 'new']);
      return { saved: true };
    }

        /* A SET OFFERED TO THE POOL. Ramy, 5 Oct 2026: "people are lazy -- can we just
       click contribute, and it goes somewhere in the library where no one else can
       see it, and then I'll get a notification." So: no credential, like
       'feedback' above, because a tutor contributing is not reading anything and
       the page has already stripped every link out of what it sends. The set goes
       to a private folder, a row goes on the sheet, and the mail tells Ramy it is
       there. A set is far too big for a cell, which is why the writing goes to a
       file and the row carries its address. */
    /* NUMBERS ACROSS EVERY COURSE, AND NOTHING ELSE. Ramy, 5 Oct 2026: "it's
       not much of a stat if it's only my courses ... I need stats for all other
       courses, nothing that is like snooping in their business. Just be good to
       have some stats on certain numbers."

       So this counts, and returns counts. No names, no tokens, no email, and no
       centre attached to any outcome: a centre's pass rate is its own business,
       and the moment a number here could be traced to one candidate it has
       stopped being a statistic. Centres are counted, never listed. What comes
       back is what you could print in a brochure.

       Demos, scratch courses and the records-kept-as-courses are left out:
       counting them would put Ramy's own furniture into everybody's numbers. */
    case 'stats': {
      requireOwner_(owner);
      var stToday = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
      var out = {
        asOf: new Date().toISOString(),
        courses: { total: 0, running: 0, finished: 0, toCome: 0, noDates: 0 },
        centres: 0,
        candidates: { total: 0, graded: 0 },
        grades: { provisional: {}, final: {} },
        assignments: { passed: 0, passedOnResubmission: 0, failed: 0 },
        /* Absences are recorded on CELTA 5 by the tutor, one row a day missed,
           with whether the work was made up. Counting them says how often
           candidates are out of the room; it names nobody and no centre. */
        attendance: { absences: 0, madeUp: 0, candidatesWithAbsence: 0 },
        /* How many courses each centre runs, as a SHAPE rather than a list:
           { "1": 5, "2": 3, "6": 1 } reads "five centres ran one, three ran
           two, one ran six". Volume, which is Connect's own business; no
           centre is named and no outcome is attached to it. */
        perCentre: {},
        /* Face-to-face, online or mixed: a real field, set on Course admin
           because Handbook 7.11 makes the final report state it. */
        mode: { f2f: 0, online: 0, mixed: 0, notSet: 0 },
        /* FULL-TIME AND PART-TIME ARE NOT RECORDED ANYWHERE, so this is read
           off the dates rather than invented: a CELTA run in six weeks or less
           is intensive, longer is extended. It is an inference, and the console
           says so. If the split ever has to be exact that wants a real field on
           Course admin, not a cleverer sum here. */
        length: { intensive: 0, extended: 0, notSet: 0, weeks: [] },
        /* The average is of courses that actually have people on them: a course
           made last week with an empty roster is not a cohort of nil. */
        cohort: { courses: 0, candidates: 0, smallest: null, largest: null },
        features: {},
        pool: { sets: 0, contributors: 0 },
        volunteers: 0,
        byMonth: {}
      };
      var stCentres = {};
      var stKinds = kindsByCourse_();
      var FEAT = {
        'Timetable': 'timetable',
        'TP point sets': 'tppoints',
        'Course stream': 'stream',
        'Planning grid': 'grid',
        'Volunteer students': 'volunteers',
        'Assignment wording': 'wording',
        'Observation tasks': 'observations',
        'Shared materials': 'shared'
      };
      Object.keys(FEAT).forEach(function (label) { out.features[label] = { courses: 0, said: 0 }; });
      var stPeople = peopleByCourse_({ tracker: 1, celta5t: 1, assignments: 1 });
      courses_().forEach(function (c) {
        var set = courseRead_(c.id, 'settings') || {};
        // "not a course": the TP point library is kept as a course record, as
        // the pulse below already knows (20 Oct 2026: it counted a test name).
        if (set.demoToday || set.presentToday || /scratch|not a course/i.test(String(c.name || '') + ' ' + String(set.courseName || ''))) return;
        if (/grades/i.test(String(set.courseName || '')) || /grades/i.test(String(c.name || ''))) return;
        out.courses.total++;
        var num = String(set.centreNumber || '').trim().toUpperCase();
        if (num) stCentres[num] = (stCentres[num] || 0) + 1;
        if (num) stCentres[num] = 1;
        var mo = '';
        if (set.start && set.end) {
          if (set.start <= stToday && stToday <= set.end) out.courses.running++;
          else if (stToday < set.start) out.courses.toCome++;
          else out.courses.finished++;
          mo = String(set.start).slice(0, 7);
          out.byMonth[mo] = out.byMonth[mo] || { courses: 0, candidates: 0 };
          out.byMonth[mo].courses++;
        } else out.courses.noDates++;
        var md = String(set.deliveryMode || '').trim().toLowerCase();
        if (md === 'f2f' || md === 'online' || md === 'mixed') out.mode[md]++;
        else out.mode.notSet++;

        if (set.start && set.end) {
          var wk = Math.round((new Date(set.end) - new Date(set.start)) / 6048e5);
          if (wk > 0 && wk < 80) {
            out.length.weeks.push(wk);
            if (wk <= 6) out.length.intensive++; else out.length.extended++;
          } else out.length.notSet++;
        } else out.length.notSet++;

        var people = stPeople[c.id] || {};
        Object.keys(people).forEach(function (tok) {
          var tr = people[tok] || {};
          out.candidates.total++;
          if (mo) out.byMonth[mo].candidates++;
          var g = ((tr.tracker || {}).grades) || {};
          var p = String(g.provisional || '').trim(), f = String(g.final || '').trim();
          if (p) out.grades.provisional[p] = (out.grades.provisional[p] || 0) + 1;
          if (f) { out.grades.final[f] = (out.grades.final[f] || 0) + 1; out.candidates.graded++; }
          var att = ((tr.celta5t || {}).attendance) || {};
          var rows = (att.rows || []).concat(att.other || []);
          if (rows.length) out.attendance.candidatesWithAbsence++;
          rows.forEach(function (row) {
            out.attendance.absences++;
            if (row && String(row.madeUp || '').trim()) out.attendance.madeUp++;
          });
          var subs = tr.assignments || {};
          Object.keys(subs).forEach(function (k) {
            var st = String((subs[k] || {}).state || '').toUpperCase();
            if (st === 'PASS') out.assignments.passed++;
            else if (st === 'RES' || st === 'RESUBMITTED') out.assignments.passedOnResubmission++;
            else if (st === 'FAIL') out.assignments.failed++;
          });
        });
        var heads = Object.keys(people).length;
        if (heads) {
          out.cohort.courses++;
          out.cohort.candidates += heads;
          if (out.cohort.smallest === null || heads < out.cohort.smallest) out.cohort.smallest = heads;
          if (out.cohort.largest === null || heads > out.cohort.largest) out.cohort.largest = heads;
        }
        var mine = stKinds[c.id] || {};
        Object.keys(FEAT).forEach(function (label) {
          if (mine[FEAT[label]]) out.features[label].courses++;
        });
        var vol = courseRead_(c.id, 'volunteers') || {};
        out.volunteers += Object.keys(vol.people || vol.rows || {}).length;
      });

      var rpSh = sheet_(SHEET_REPORTS), rpLast = rpSh.getLastRow();
      if (rpLast > 1) {
        var rpRows = rpSh.getRange(2, 1, rpLast - 1, 4).getValues();
        rpRows.forEach(function (r) {
          var page = String(r[2] || '').toLowerCase();
          Object.keys(out.features).forEach(function (label) {
            if (page.indexOf(label.toLowerCase()) >= 0) out.features[label].said++;
          });
        });
      }
      var ofSh = sheet_(SHEET_OFFERS), ofLast = ofSh.getLastRow();
      if (ofLast > 1) {
        var ofRows = ofSh.getRange(2, 1, ofLast - 1, 2).getValues(), ofWho = {};
        ofRows.forEach(function (r) {
          out.pool.sets++;
          var by = String(r[1] || '').trim().toLowerCase();
          if (by) ofWho[by] = 1;
        });
        out.pool.contributors = Object.keys(ofWho).length;
      }      out.centres = Object.keys(stCentres).length;
      Object.keys(stCentres).forEach(function (k) {
        var n = String(stCentres[k]);
        out.perCentre[n] = (out.perCentre[n] || 0) + 1;
      });
      return out;
    }

case 'inbox': {
      requireOwner_(owner);
      var iLim = Math.min(80, Math.max(1, parseInt(req.limit, 10) || 40));
      return { contributions: inboxRows_(SHEET_OFFERS, iLim), reports: inboxRows_(SHEET_REPORTS, iLim),
               sheet: dataSheetUrl() };
    }

    /* A row is named by its timestamp, not its position: marking one read must
       not act on a different row because something was deleted in between. */
/* READING A CONTRIBUTED SET. The row links the file, but a file in Drive is
       raw JSON and nobody reads a set that way. This hands the console the set
       so it can draw it.

       It will only open a file that is IN the contributions folder: owner-only
       is not enough on its own, because an op that takes an id and returns a
       file is a way to read any file this script can see. */
    case 'readContribution': {
      requireOwner_(owner);
      var rcId = (String(req.file || '').match(/[-\w]{25,}/) || [])[0];
      if (!rcId) throw new Error('Which file?');
      var rcFile = null, rcIt = contributionsFolder_().getFiles();
      while (rcIt.hasNext()) { var rcF = rcIt.next(); if (rcF.getId() === rcId) { rcFile = rcF; break; } }
      if (!rcFile) throw new Error('That file is not in the contributions folder');
      return { name: rcFile.getName(), set: JSON.parse(rcFile.getBlob().getDataAsString()) };
    }

    case 'inboxRow': {
      requireOwner_(owner);
      var iName = inboxSheet_(String(req.sheet || ''));
      var iAt = String(req.at || '');
      if (!iAt) throw new Error('Which row?');
      var iHit = function (r) { return r[0] && new Date(r[0]).toISOString() === iAt; };
      if (req.drop) return { dropped: deleteRowsWhere_(iName, iHit) };
      /* the state column by its name, not the last column: the offers sheet grew a course and a note (v183) */
      var iSh = sheet_(iName), iLast = iSh.getLastRow(), iCol = HEADERS[iName].indexOf('state') + 1, iNote = HEADERS[iName].indexOf('note') + 1;
      if (iLast < 2) return { marked: 0 };
      var iVals = iSh.getRange(2, 1, iLast - 1, iCol).getValues(), iN = 0;
      for (var iz = 0; iz < iVals.length; iz++) {
        if (iHit(iVals[iz])) { iSh.getRange(iz + 2, iCol).setValue(String(req.state || 'done'));
          if (iNote && req.note !== undefined) iSh.getRange(iz + 2, iNote).setValue(String(req.note || '').slice(0, 600)); iN++; }
      }
      return { marked: iN };
    }

        case 'contribute': {
      var cSet = req.set;
      if (!cSet || !cSet.sessions) throw new Error('No set to contribute');
      var cBy = String(req.by || '').replace(/\s+/g, ' ').trim().slice(0, 80);
      if (!cBy) throw new Error('Say who the credit should go to');
      var cJson = JSON.stringify(cSet);
      if (cJson.length > 900000) throw new Error('That set is too big to send');
      /* the page strips the links before it posts; this is the backstop, because
         a link here would put somebody's Drive into the Pool */
      if (/"url"\s*:/.test(cJson)) throw new Error('That set still carries file links');
      var cBook = String(cSet.book || 'untitled').slice(0, 120);
      var cLevel = String(cSet.level || '').slice(0, 60);
      var cSlots = 0, cStages = 0;
      Object.keys(cSet.sessions).forEach(function (k) {
        (cSet.sessions[k].slots || []).forEach(function (sl) {
          if (sl.type || sl.aim) cSlots++;
          cStages += (sl.stages || []).length;
        });
      });
      if (!cSlots) throw new Error('There is nothing written in that set');
      var cName = (cBook.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'tp-points')
        + '--' + cBy.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24)
        + '-' + new Date().toISOString().slice(0, 10) + '.json';
      var cFile = contributionsFolder_().createFile(Utilities.newBlob(cJson, 'application/json', cName));
      var cAt = new Date();
      sheet_(SHEET_OFFERS).appendRow([cAt, cBy, cBook, cLevel, cSlots, cStages,
        String(req.centre || '').slice(0, 80), cFile.getUrl(), 'new', course ? course.id : '', '']);
      try {
        var cTo = Session.getEffectiveUser().getEmail();
        if (cTo) sendAs_({ to: cTo, name: 'Connect',
          subject: 'A set for the Pool: ' + cBook + ' \u2014 ' + cBy,
          body: ['Credit it to: ' + cBy, 'Book: ' + cBook, 'Level: ' + cLevel,
                 cSlots + ' lessons, ' + cStages + ' stages',
                 req.centre ? 'Sent from: ' + String(req.centre).slice(0, 80) : '',
                 '', cFile.getUrl(), '',
                 'Download it, then: ./tools/check-library.sh <the file>'].filter(String).join('\n') });
      } catch (e) { /* the set is saved; a mail that fails must not lose it */ }
      return { saved: true, at: cAt.toISOString() };
    }
    /* WHERE AN OFFERED SET HAS GOT TO (v183, 30 Oct 2026, the specification's R26): a tutor reads this course's own offers,
       each with the state Connect set in the console (new, review, ask, published, declined) and Connect's question. */
    case 'offerStates': {
      requireTutor_(tutor);
      var osSh = sheet_(SHEET_OFFERS), osLast = osSh.getLastRow(), osH = HEADERS[SHEET_OFFERS];
      if (osLast < 2 || !course) return { offers: [] };
      var osRows = osSh.getRange(2, 1, osLast - 1, osH.length).getValues();
      return { offers: osRows.filter(function (r) { return String(r[osH.indexOf('course')] || '') === String(course.id); }).map(function (r) {
        return { at: r[0] instanceof Date ? r[0].toISOString() : String(r[0]), book: String(r[2] || ''), state: String(r[osH.indexOf('state')] || 'new'), note: String(r[osH.indexOf('note')] || '') };
      }) };
    }
    /* The owner's console: this week's thumbs and the latest lines. */
    case 'feedbackSummary': {
      requireOwner_(owner);
      var fsh = sheet_(SHEET_FEEDBACK), fl = fsh.getLastRow();
      var rows = fl >= 2 ? fsh.getRange(2, 1, fl - 1, 6).getValues() : [];
      var since = Date.now() - 7 * 864e5, up = 0, down = 0, comments = 0;
      var latest = [];
      rows.forEach(function (r) {
        var at = r[0] ? new Date(r[0]).getTime() : 0;
        if (at >= since) { if (r[4] === 'up') up++; else if (r[4] === 'down') down++; if (String(r[5] || '').trim()) comments++; }
        if (String(r[5] || '').trim()) latest.push({ at: r[0] ? new Date(r[0]).toISOString() : '', page: String(r[1] || ''), course: String(r[2] || ''), role: String(r[3] || ''), thumb: String(r[4] || ''), text: String(r[5] || '') });
      });
      latest.sort(function (a, b) { return a.at < b.at ? 1 : -1; });
      return { week: { up: up, down: down, comments: comments }, total: rows.length, latest: latest.slice(0, 10) };
    }

    /* v74: the centre book, for the console's number -> name fill. Owner only:
       it is a list of who this account has sold to. */
    case 'centres': {
      requireOwner_(owner);
      return { centres: centreBook_() };
    }
    /* v74: fill the book from a list, [[number, name], ...]. Owner only; a
       number already in the book is never touched. */
    case 'centresSeed': {
      requireOwner_(owner);
      var seedRows = Array.isArray(req.rows) ? req.rows.slice(0, 1000) : [];
      var added = centresSeed_(seedRows);
      return { added: added, centres: centreBook_() };
    }

    // ---- the owner's own ops: provisioning, above any one course ----------
    // Ramy sells a course at a time and mints it here; a centre never creates
    // one. The owner secret opens no course's records -- it lists courses and
    // makes them, and that is all it can do.
    /* v94 (17 Oct 2026): the default marking guidance, for every course that
       has not written its own. Kept in the store under the id '_defaults',
       not in the public site's code: it is for tutors and assessors only. */
    case 'putDefaultGuidance': {
      requireOwner_(owner);
      courseWrite_('_defaults', 'guidance', req.data || null);
      return { saved: true };
    }
    /* HOMEWORK FOR THE VOLUNTEERS (v137, 26 Oct 2026; Ramy: "for every lesson they have a little bit of
       homework, self-study, with the answers"). One record per library set, under '_defaults', keyed by the
       lesson ('1A·1'): { title, k, do, items, script? }. Kept in the store, not in the public site's code, because
       it is built on the coursebooks' own exercises. A volunteer reads only their own level's lessons, on the days
       they were taught (volunteerCards). */
    case 'putHomework': {
      requireOwner_(owner);
      var hwSet = String(req.set || '');
      if (!/^s\d{1,3}$/.test(hwSet)) throw new Error('A library set id like s8 is needed');
      courseWrite_('_defaults', 'homework:' + hwSet, req.data || null);
      return { saved: true, set: hwSet, lessons: Object.keys(req.data || {}).length };
    }
    /* v150: Build up your vocab, written per library lesson: {"1A·1": [{w, def, ex}, ...]} */
    case 'putVocab': {
      requireOwner_(owner);
      var vbSet = String(req.set || '');
      if (!/^s\d{1,3}$/.test(vbSet)) throw new Error('A library set id like s8 is needed');
      courseWrite_('_defaults', 'vocab:' + vbSet, req.data || null);
      return { saved: true, set: vbSet, lessons: Object.keys(req.data || {}).length };
    }
    case 'getVocab': {
      requireOwner_(owner);
      return { set: String(req.set || ''), data: courseRead_('_defaults', 'vocab:' + String(req.set || '')) };
    }
    case 'getHomework': {
      requireOwner_(owner);
      var hwGet = String(req.set || '');
      return { set: hwGet, data: courseRead_('_defaults', 'homework:' + hwGet) };
    }
    /* THE DEMO'S DOOR, FOR A BARE LINK (v123, 25 Oct 2026). The trainers' card
       and anyone typing lite.celtaconnect.com/offer reach the offer card with
       no key on the link, and its doors stood closed ("No demo is attached").
       This names the demo course's tutor key, with no credential: it is the
       key every public card already carries, and only a course pinned to a
       day (settings.demoToday) can be named, never a real one. The mid-course
       demo by name, else the newest pinned course. */
    case 'demoCard': {
      var demos = [];
      courses_().forEach(function (c) {
        var s = courseRead_(c.id, 'settings') || {};
        if (s.demoToday) demos.push({ c: c, mid: /mid-course/i.test(String(c.name || '')) });
      });
      if (!demos.length) return { k: '' };
      demos.sort(function (a, b) { return (b.mid - a.mid) || String(b.c.created).localeCompare(String(a.c.created)); });
      return { k: courseKey_('tutor', demos[0].c.id), course: demos[0].c.id };
    }
    case 'ownerCourses': {
      requireOwner_(owner);
      return { courses: ownerList_() };
    }

    /* 28 Oct 2026: point the store back at its data sheet, after the incident above. Owner only; the sheet must open and
       hold the courses sheet with rows in it, so it cannot be pointed at an empty one by mistake. */
    case 'setSpreadsheet': {
      requireOwner_(owner);
      var nid = String(req.id || '').trim();
      if (!/^[\w-]{20,}$/.test(nid)) throw new Error('Which spreadsheet?');
      var nss = SpreadsheetApp.openById(nid);
      var nc = nss.getSheetByName(SHEET_COURSES);
      if (!nc || nc.getLastRow() < 2) throw new Error('That spreadsheet has no courses in it, so the store was not pointed at it');
      var was = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || '';
      PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', nid);
      PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID_PREVIOUS', was);
      COURSE_MEMO_ = null;
      return { pointedAt: nid, was: was, courses: courses_(true).length };
    }

    /* v88 (19 Oct 2026): the pulse Connect's Command Center reads, with the
       owner key held on Connect's server. One call, every course that is not
       a demo or scratch, read-only: where it is, who is on it, what is waiting
       for a tutor, when the assessor comes, when it last changed. Names of
       trainees never leave here; counts do. */
    case 'ownerPulse': {
      requireOwner_(owner);
      var pulse = [];
      var pToday = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
      var pPeople = peopleByCourse_({ assignments: 1 });
      courses_().forEach(function (c) {
        var set = courseRead_(c.id, 'settings') || {};
        if (set.demoToday || set.presentToday || /scratch|not a course/i.test(String(c.name || '') + ' ' + String(set.courseName || ''))) return;
        if (/grades/i.test(String(set.courseName || '')) || /grades/i.test(String(c.name || ''))) return;
        var people = pPeople[c.id] || {};
        var heads = 0, waiting = 0, resubs = 0, passed = 0, failed = 0;
        Object.keys(people).forEach(function (tok) {
          var tr = people[tok] || {}; heads++;
          var subs = tr.assignments || {};
          Object.keys(subs).forEach(function (k) {
            var sub = subs[k] || {}, st = String(sub.stage || '').toLowerCase(), state = String(sub.state || '').toUpperCase();
            if (st === 'submitted' || st === 'resubmitted') waiting++;
            if (st === 'resubmission_needed') resubs++;
            if (state === 'PASS' || state === 'RES' || state === 'RESUBMITTED') passed++;
            else if (state === 'FAIL') failed++;
          });
        });
        var where = 'no dates';
        if (set.start && set.end) {
          if (pToday < set.start) where = 'to come';
          else if (pToday > set.end) where = 'finished';
          else {
            var d0 = new Date(set.start + 'T00:00:00Z').getTime(), dN = new Date(pToday + 'T00:00:00Z').getTime();
            where = 'week ' + (Math.floor((dN - d0) / (7 * 864e5)) + 1);
          }
        }
        var nx = null;
        try { nx = where.indexOf('week') === 0 ? nextClass_(c.id) : null; } catch (e) { nx = null; }
        pulse.push({
          id: c.id,
          name: set.courseName || c.name || '',
          centre: set.centreName || '',
          centreNumber: set.centreNumber || '',
          start: set.start || '', end: set.end || '',
          where: where,
          trainees: heads,
          waitingToMark: waiting,
          resubmissionsOut: resubs,
          assignments: { passed: passed, failed: failed },
          visit: set.visitDate || '',
          nextTP: nx ? { day: nx.day, tp: nx.tp, from: nx.from } : null,
          timeZone: set.timeZone || ''
        });
      });
      return { asOf: new Date().toISOString(), courses: pulse };
    }

    /* The owner's own key, rotated by a holder of the current one. Every copy
       in circulation dies at once -- including any left in a URL, a browser
       history or a transcript, which is why this exists (27 Sep 2026).
       There is NO LOCKOUT: ownerKey() below reads the property and only mints
       when there is none, so a key lost between rotating and saving it can
       always be read back from this editor. */
    /* v58 (1 Oct 2026): the half-hourly reminder timer, installed by the
       owner's key rather than from the editor's Run button. Idempotent. */
    case 'installReminders': {
      requireOwner_(owner);
      installReminderTrigger();
      return { triggers: ScriptApp.getProjectTriggers().map(function (t) { return t.getHandlerFunction(); }) };
    }
    case 'rotateOwnerKey': {
      requireOwner_(owner);
      var no = newKey_();
      PropertiesService.getScriptProperties().setProperty('OWNER_KEY', no);
      return { key: no, link: 'https://lite.celtaconnect.com/14_owner.html?o=' + no };
    }
    /* v64 (2 Oct 2026): the card goes out AS the email. The console builds
       the HTML (the front of offer.html -- the headline, his note, the demo
       courses and the film as doors, the price) and the store sends it from
       lite@ through sendAs_, because a mailto: can only ever carry plain text
       (Ramy: "I want the email to be the card"). Owner only, one recipient a
       call, the HTML capped, so a leaked owner key is not a mail cannon. */
    case 'sendCard': {
      requireOwner_(owner);
      var okAddr = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      var cTo = String(req.to || '').trim();
      if (!okAddr.test(cTo)) throw new Error('Type the address the card goes to');
      var cHtml = String(req.html || ''), cText = String(req.text || '');
      if (!cHtml) throw new Error('The card is empty');
      if (cHtml.length > 60000) throw new Error('The card is too big to send');
      var cMsg = { to: cTo, subject: String(req.subject || 'Connect Lite').slice(0, 160), htmlBody: cHtml, body: cText || 'This message is the Connect Lite card; open it in a mail app that shows HTML.', name: 'Ramy \u2014 Connect Lite', replyTo: FROM_ };
      var cCopy = String(req.copy || '').trim();
      if (cCopy && cCopy !== cTo && okAddr.test(cCopy)) cMsg.bcc = cCopy;
      sendAs_(cMsg);
      return { sent: cTo, copy: cMsg.bcc || null, from: FROM_OK_ ? FROM_ : 'the account the store runs under (lite@ is not yet a send-as there)' };
    }
    case 'createCourse': {
      requireOwner_(owner);
      // A course cannot exist without a Cambridge centre number, typed by the
      // owner (Ramy, 1 Oct 2026: "that's the only way to ensure this is
      // actually a certified CELTA centre... it should not work without a
      // centre number"). It is written into the course's settings as locked,
      // and putCourse keeps it whatever the centre sends afterwards.
      var centreNumber = String(req.centreNumber || '').trim().toUpperCase().replace(/\s+/g, '');
      // v74: a UK centre number is plain digits (10294 is IH London) and
      // Cambridge also issues a trailing letter (MX026b); the console's own
      // check has the same shape.
      if (!/^([A-Z]{2})?\d{3,5}[A-Z]?$/.test(centreNumber)) throw new Error('A course needs its Cambridge center number, e.g. TR001 or 10294');
      var centreName = String(req.centreName || '').trim();
      var cid = nextCourseId_();
      // A name is not asked for (Ramy, 21 Sep 2026: "each course I build should
      // just automatically have a name... something distinct"). This one is
      // only a handle until the centre sets their own in Settings, which the
      // listing then shows instead.
      var cname = String(req.name || '').trim() || (cid.toUpperCase() + ' \u00b7 ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'd MMM yyyy'));
      sheet_(SHEET_COURSES).appendRow([cid, cname, new Date()]);
      var seed = { centreNumber: centreNumber, centreLocked: true };
      if (centreName) seed.centreName = centreName;
      courseWrite_(cid, 'settings', seed);
      /* v74: the book learns from every course made. */
      try { centreRemember_(centreNumber, centreName); } catch (e) {}
      // The refreshed list rides back with the new course. Apps Script answers
      // in 1.5-13 s whatever it is asked, so the console's old make-then-list
      // pair cost two of those end to end -- which is what Ramy was waiting
      // through on 21 Sep 2026 ("making the course takes a while").
      return { id: cid, name: cname, tutorKey: courseKey_('tutor', cid), assessorKey: courseKey_('assessor', cid), courses: ownerList_(), centres: centreBook_() };
    }
    /* A CONNECT DEMO (v166, 27 Oct 2026). Ramy: "open a new course in front of everyone ... it resets itself ... I can
       also send it to people if they want to play with it ... maybe just for a day or two ... mine will just stay."
       A fresh, empty course at the invented centre, named Connect Lite demo, that saves for real and keeps a movable day
       (settings.presentToday). Each run or visitor gets a fresh copy; `replace` puts the presenter's previous copy in the
       bin; `days` gives a visitor's copy an end (settings.demoExpires), after which every link on it is refused. */
    case 'createPresentation': {
      requireOwner_(owner);
      var pid = nextCourseId_();
      var forWho = String(req.forName || '').trim().slice(0, 60);
      var pname = 'Connect Lite demo' + (forWho ? ' \u00b7 ' + forWho : '');
      sheet_(SHEET_COURSES).appendRow([pid, pname, new Date()]);
      /* a New York course on New York time (Ramy, 27 Oct 2026: "let's go with a New York course, New York time zone") */
      var ptz = 'America/New_York';
      /* v175 (Ramy, 28 Oct 2026: "not have anything written, also remove the logo ... when I click on fill in, everything
         will get filled in, including the logo and the center number and the time zone"): a Connect demo starts blank.
         Only what makes it a Connect demo is set: its day, who it is for, when it ends, and the room's question code.
         The center, its number and logo, the course's name, the time zone and the clock are Course admin's Fill in. */
      var pseed = { presentToday: Utilities.formatDate(new Date(), ptz, 'yyyy-MM-dd'), presentFor: forWho, askCode: newKey_().slice(0, 12), askTo: 'Jordan Blake' };
      var pdays = parseInt(req.days, 10);
      if (pdays > 0) pseed.demoExpires = Utilities.formatDate(new Date(Date.now() + pdays * 864e5), ptz, 'yyyy-MM-dd');
      courseWrite_(pid, 'settings', pseed);
      var rep = req.replace ? courseById_(String(req.replace)) : null;
      if (rep) { var rset = courseRead_(rep.id, 'settings') || {}; if (rset.presentToday && !rep.deleted) setCourseField_(rep.id, 'deleted', new Date().toISOString()); }
      return { id: pid, name: pname, tutorKey: courseKey_('tutor', pid), assessorKey: courseKey_('assessor', pid), expires: pseed.demoExpires || '', courses: ownerList_() };
    }
    // The next course from this one (Ramy, 28 Sep 2026: "can we duplicate the
    // course at the end?"). What is the CENTRE's carries over -- name, number,
    // logo, tutors, the standing instructions, TPs each, hours, mode, the
    // Appian address, the candidates' shared links, the assignment wording,
    // the observation sheets, the timetable's days without their dates (v80).
    // What is THIS course's starts fresh -- dates,
    // the assessment date and picks, the notification reference, the assessor's
    // document links, the roster and every record, and both keys.
    case 'cloneCourse': {
      requireOwner_(owner);
      var fromId = String(req.from || '').trim();
      var src = courseById_(fromId);
      if (!src) throw new Error('No such course to copy from');
      var nid = nextCourseId_();
      var nname = nid.toUpperCase() + ' \u00b7 ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'd MMM yyyy');
      sheet_(SHEET_COURSES).appendRow([nid, nname, new Date()]);
      var s = courseRead_(fromId, 'settings') || {};
      var keep = {};
      /* v75 (8 Oct 2026): the settings added since this list was written are
         the centre's as much as the logo is -- the agreement, Connect's
         pre-course switch and its two overrides, the tutor and volunteer
         contacts, the online rooms, the time zone -- and a clone started
         without them (Ramy: "does it also duplicate all the settings?").
         Still fresh: the dates, the course name and number, the assessment,
         the notification reference, the assessor's documents, the roster. */
      ['centreName', 'centreNumber', 'centreLocked', 'logo', 'tutorNames', 'timetableSet', 'planDueNote', 'selfDueNote', 'tpCount', 'totalHours', 'deliveryMode', 'appianUrl', 'courseLinks',
       'agreement', 'preCourseConnect', 'gtkyWhen', 'gtkyMinutes', 'tutorContacts', 'volunteerContact', 'onlineRooms', 'timeZone', 'clock', 'ttLayout', 'planFrom', 'analysisFrom', 'volunteerCertificateHours'].forEach(function (k) { if (s[k] !== undefined && s[k] !== '' && s[k] !== null) keep[k] = s[k]; });
      /* Of the assessor's documents only the center's own agreement link is the centre's. */
      if (s.docs && s.docs.docAgreement) keep.docs = { docAgreement: s.docs.docAgreement };
      keep.clonedFrom = fromId;
      // Ramy, 28 Sep 2026: "anything connected to a time that carries over
      // requires a switch from the tutor before the trainees see it" -- the
      // carried links arrive hidden (the timetable excepted: "they should see
      // it anyway"), and so does each assignment's wording. The pages show a
      // candidate only what is switched on.
      if (Array.isArray(keep.courseLinks)) keep.courseLinks = keep.courseLinks.map(function (l) { if (!l) return l; var c = {}; for (var k2 in l) c[k2] = l[k2]; delete c.showFrom; /* v75: a show-from day belongs to the course that is over */ if (!/timetable/i.test(String(l.label || '') + ' ' + String(l.card || ''))) c.show = false; else delete c.show; return c; });
      courseWrite_(nid, 'settings', keep);
      var w = courseRead_(fromId, 'wording');
      /* v83 (10 Oct 2026): an assignment's DATES belong to the course that is
         over -- its due date, its per-set dates, its fixed resubmission time
         and the day it goes out -- and came across already in the past. They
         stay behind; who sets it and the resubmission days are the centre's
         and travel. The timetable's layout travels with the settings above. */
      if (w && typeof w === 'object') { for (var wk in w) { if (w[wk] && typeof w[wk] === 'object' && !Array.isArray(w[wk])) {
        w[wk].released = false;
        ['dueAt', 'due', 'dueSets', 'resubDueAt', 'outAt', 'releaseAt'].forEach(function (f) { delete w[wk][f]; });
      } } }
      if (w) courseWrite_(nid, 'wording', w);
      var o = courseRead_(fromId, 'observations'); if (o) courseWrite_(nid, 'observations', o);
      /* v80 (9 Oct 2026): the timetable travels, without its dates (Ramy:
         "duplicate the previous course"). A course's days belong to its own
         calendar, so they come across in order -- day 1, day 2, ... -- with
         their sessions, practices and notes, and the new course's timetable
         page lays them onto its own dates when the tutor asks it to. A closed
         day (a holiday) belonged to that calendar and stays behind; so do
         the pins, the draft and the changes the old course was told about. */
      var ttSrc = courseRead_(fromId, 'timetable');
      var ttDays = ttSrc && Array.isArray(ttSrc.days) ? ttSrc.days.filter(function (d) { return d && !d.closed; }) : [];
      if (ttDays.length) {
        var carried = ttDays.map(function (d) {
          var c = { notes: String(d.notes || '') };
          if (Array.isArray(d.sessions)) c.sessions = d.sessions;
          else if (d.cells) c.cells = d.cells;
          if (d.tp) { c.tp = d.tp; c.setIndex = d.setIndex || 0; }
          return c;
        });
        var ttNew = { v: ttSrc.v || 3, slots: ttSrc.slots || [], carried: { from: String(s.courseName || fromId), days: carried } };
        if (Array.isArray(ttSrc.meets) && ttSrc.meets.length) ttNew.meets = ttSrc.meets;
        courseWrite_(nid, 'timetable', ttNew);
      }
            /* v73: the noticeboard travels (Ramy, 6 Oct 2026: "like Google
         Classroom"). Every post comes across as a draft -- no group, no
         date, no publishAt -- that the new course's tutors post when the
         time comes, from the dashboard (postAt). Groups and dates belong to
         the course that is over. */
      var stSrc = courseRead_(fromId, 'stream');
      var stCarried = Array.isArray(stSrc) ? stSrc.filter(function (p) { return p && p.text; }).map(function (p) {
        return { id: newKey_().slice(0, 12), at: new Date().toISOString(), by: String(p.by || ''), to: '', text: p.text, draft: true, from: String(s.courseName || fromId) };
      }) : [];
      if (stCarried.length) courseWrite_(nid, 'stream', stCarried);
      /* v94: the course's own marking guidance travels, if it has any. */
      var gSrc = courseRead_(fromId, 'guidance');
      if (gSrc) courseWrite_(nid, 'guidance', gSrc);
      return { id: nid, name: nname, from: fromId, copied: { settings: Object.keys(keep).length, wording: !!w, observations: !!o, timetableDays: ttDays.length }, tutorKey: courseKey_('tutor', nid), assessorKey: courseKey_('assessor', nid), courses: ownerList_() };
    }
    // ---- shared assets: Cambridge's CELTA 5 master and the two fonts -------
    // Kept on the owner's Drive, never on the public site (the master is
    // Cambridge's copyrighted document). The owner lodges them once with
    // putAsset; a tutor or assessor link fetches them with celta5Assets when
    // it draws a candidate's booklet in the browser (28 Sep 2026).
    case 'putAsset': {
      requireOwner_(owner);
      var an = String(req.name || '').replace(/[^\w.\-]/g, '');
      if (!an || !req.bytes) throw new Error('Name and bytes, please');
      var af = assetsFolder_();
      var old = af.getFilesByName(an); while (old.hasNext()) old.next().setTrashed(true);
      var blob = Utilities.newBlob(Utilities.base64Decode(String(req.bytes)), String(req.type || 'application/octet-stream'), an);
      var made = af.createFile(blob);
      return { saved: true, name: an, id: made.getId(), bytes: made.getSize() };
    }
    case 'celta5Assets': {
      if (!course) throw new Error('This link is not on a course');
      if (!tutor && !assessor) throw new Error('Not yours to read: celta5Assets');
      var want = ['celta5-master-july-2023.pdf', 'Arimo-Regular.ttf', 'Arimo-Bold.ttf'];
      var outA = {}; var af2 = assetsFolder_();
      want.forEach(function (n) { var it = af2.getFilesByName(n); if (it.hasNext()) outA[n] = Utilities.base64Encode(it.next().getBlob().getBytes()); });
      return outA;
    }
    /* THE SAFE DELETE (25 Oct 2026; Ramy, 24 Oct: "that disaster can never
       happen again"). Deleting a course no longer removes a row. It puts the
       course in the bin: a stamp in the courses sheet's fourth column, which
       every reader of courses_() skips, so its links stop opening at once and
       it leaves the console, the pulse and the reports; nothing else moves.
       The rows go for good 30 days later, from the nightly backup run, one
       course a night, under the script lock, in blocks, and only once that
       night's backup is on Drive. undeleteCourse brings a binned course back
       whole. A LIVE COURSE cannot be binned at all: one with trainees whose
       end date has not passed, unless it is a pinned demo. End the course in
       its settings first. The caller still names the course twice. */
    case 'deleteCourse': {
      requireOwner_(owner);
      var did = String(req.course || '').trim();
      if (!did) throw new Error('Which course?');
      if (String(req.confirm || '') !== did) throw new Error('Deleting a course needs its id as confirmation');
      var dlock = LockService.getScriptLock();
      if (!dlock.tryLock(30000)) throw new Error('Another change is running on the store. Try again in a minute.');
      try {
        var dc = courseById_(did);
        if (!dc) throw new Error('No such course');
        var dset = courseRead_(did, 'settings') || {};
        var dToday = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
        if (!dset.demoToday && !dset.presentToday && dset.end && String(dset.end) >= dToday && roster_(did).length) throw new Error('This is a live course until ' + dset.end + '. Lite does not delete a live course; end it in its settings first.');
        setCourseField_(did, 'deleted', new Date().toISOString());
      } finally { dlock.releaseLock(); }
      return { deleted: did, binned: true, until: Utilities.formatDate(new Date(Date.now() + BIN_DAYS * 86400000), Session.getScriptTimeZone(), 'yyyy-MM-dd'), courses: ownerList_() };
    }
    case 'undeleteCourse': {
      requireOwner_(owner);
      var uid = String(req.course || '').trim();
      var ulock = LockService.getScriptLock();
      if (!ulock.tryLock(30000)) throw new Error('Another change is running on the store. Try again in a minute.');
      try {
        var uc = courses_(true).filter(function (c) { return c.id === uid; })[0];
        if (!uc) throw new Error('No such course');
        if (!uc.deleted) throw new Error('This course is not in the bin');
        setCourseField_(uid, 'deleted', '');
      } finally { ulock.releaseLock(); }
      return { restored: uid, courses: ownerList_() };
    }
    /* The permanent delete, by hand: only a course already in the bin, named
       twice. The console does not offer it; the nightly run does the same
       thing by itself after 30 days. */
    case 'purgeCourse': {
      requireOwner_(owner);
      var pid = String(req.course || '').trim();
      if (!pid || String(req.confirm || '') !== pid) throw new Error('Purging a course needs its id as confirmation');
      var pc = courses_(true).filter(function (c) { return c.id === pid; })[0];
      if (!pc) throw new Error('No such course');
      if (!pc.deleted) throw new Error('Only a course in the bin can be purged; delete it first');
      return { purged: pid, removed: purgeCourse_(pid), courses: ownerList_() };
    }
    /* RESTORE FROM THE NIGHTLY BACKUP (24 Oct 2026), after the c7 delete took
       other courses' records with it. Owner only, and a dry run unless `write`
       is true. For the courses named, the backup's rows that are missing now
       are put back: records and trainees by their key (course, token, kind /
       course, token), so anything written since the backup stays as it is; a
       course-level kind only where the live one no longer reads, and then all
       its pieces from the backup together. It never removes a record, and
       never touches a course it was not given. */
    case 'restoreFromBackup': {
      requireOwner_(owner);
      var bid = String(req.backup || '').trim();
      if (!bid) throw new Error('Which backup?');
      var only = (req.courses || []).map(String);
      if (!only.length) throw new Error('Which courses?');
      only.forEach(function (id) { if (!courseById_(id)) throw new Error('Not a course now: ' + id); });
      var rwrite = req.write === true;
      var want = {}; only.forEach(function (id) { want[id] = 1; });
      var rlock = LockService.getScriptLock();
      if (!rlock.tryLock(30000)) throw new Error('Another change is running on the store. Try again in a minute.');
      try {
        var bk = SpreadsheetApp.openById(bid);
        var report = {};
        var bump = function (c, k, n) { report[c] = report[c] || {}; report[c][k] = (report[c][k] || 0) + n; };
        var bRows = function (name) { var sh = bk.getSheetByName(name); if (!sh) return []; var last = sh.getLastRow(); return last < 2 ? [] : sh.getRange(2, 1, last - 1, sh.getLastColumn()).getValues(); };
        var fit = function (r, w) { var o = r.slice(0, w); while (o.length < w) o.push(''); return o; };
        [[SHEET_RECORDS, function (r) { return r[0] + '|' + r[1] + '|' + r[2]; }],
         [SHEET_TRAINEES, function (r) { return r[0] + '|' + r[1]; }]].forEach(function (pair) {
          var name = pair[0], keyOf = pair[1], lsh = sheet_(name);
          var llast = lsh.getLastRow(), w = lsh.getLastColumn();
          var have = {};
          if (llast >= 2) lsh.getRange(2, 1, llast - 1, w).getValues().forEach(function (r) { if (want[String(r[0])]) have[keyOf(r)] = 1; });
          var add = [];
          bRows(name).forEach(function (r) {
            if (!want[String(r[0])] || have[keyOf(r)]) return;
            have[keyOf(r)] = 1; add.push(fit(r, w)); bump(String(r[0]), name, 1);
          });
          if (rwrite) for (var i = 0; i < add.length; i += 200) {
            var part = add.slice(i, i + 200);
            lsh.getRange(lsh.getLastRow() + 1, 1, part.length, w).setValues(part);
          }
        });
        // course-level kinds: whole kinds only, and only where the live one no longer reads
        var groups = {};
        bRows(SHEET_COURSE).forEach(function (r) {
          var cid = String(r[0]); if (!want[cid]) return;
          var base = String(r[1]).split('#')[0];
          (groups[cid + '|' + base] = groups[cid + '|' + base] || { cid: cid, base: base, rows: [] }).rows.push(r);
        });
        var csh = sheet_(SHEET_COURSE), cw = csh.getLastColumn();
        Object.keys(groups).forEach(function (g) {
          var G = groups[g];
          COURSE_MEMO_ = null;
          if (courseRead_(G.cid, G.base) !== null) return;
          bump(G.cid, 'course:' + G.base, G.rows.length);
          if (!rwrite) return;
          deleteRowsWhere_(SHEET_COURSE, function (r) { return String(r[0]) === G.cid && String(r[1]).split('#')[0] === G.base; });
          csh.getRange(csh.getLastRow() + 1, 1, G.rows.length, cw).setValues(G.rows.map(function (r) { return fit(r, cw); }));
        });
        COURSE_MEMO_ = null;
        return { write: rwrite, backup: bk.getName(), report: report };
      } finally { rlock.releaseLock(); }
    }
    /* v84 (10 Oct 2026): A TRACK THROUGH THE STORE. Drive now answers 403 to a
       track asked for by another site's page (any cross-site media request),
       so the TP points' players stood at 0:00 on Lite. The store reads the
       file from the owner's Drive and hands it over; the page plays it from
       memory, and Drive never sees Lite asking. Only a track this course's TP
       points name, and for a trainee only once their group's points are
       released, so the store is not a way into anybody's Drive. */
    case 'audio': {
      if (!course) throw new Error('Open your course link first');
      var aid = String(req.id || '').replace(/[^\w-]/g, '');
      if (aid.length < 20) throw new Error('Which track?');
      var tpa = courseRead_(course.id, 'tppoints') || {};
      var scopeA = reader ? tpa : (me && (tpa.released || {})[String(me.group || '')] ? (tpa.groups || {})[String(me.group || '')] : null);
      if (!scopeA || JSON.stringify(scopeA).indexOf(aid) === -1) throw new Error('That track is not on this course');
      var fa = DriveApp.getFileById(aid);
      if (fa.getSize() > 15 * 1024 * 1024) throw new Error('That track is too large to play here');
      var ba = fa.getBlob();
      return { id: aid, mime: ba.getContentType() || 'audio/mpeg', b64: Utilities.base64Encode(ba.getBytes()) };
    }
    case 'materials': {
      requireOwner_(owner);
      return materialsInfo_(String(req.course || '').trim());
    }
    case 'purgeMaterials': {
      requireOwner_(owner);
      var pid = String(req.course || '').trim();
      if (!pid) throw new Error('Which course?');
      if (String(req.confirm || '') !== pid) throw new Error('Emptying a course\u2019s materials needs its id as confirmation');
      return { emptied: pid, trashed: trashMaterials_(pid), courses: ownerList_() };
    }
    case 'renameCourse': {
      requireOwner_(owner);
      var rn = String(req.name || '').trim();
      if (!rn) throw new Error('A name is needed');
      setCourseField_(String(req.course || ''), 'name', rn);
      return { saved: true, courses: ownerList_() };
    }

    // The assessor link: made once per course, shown to tutors on course
    // admin's Roster tab; rotating it kills every copy in circulation.
    case 'assessorLink': {
      requireTutor_(tutor);
      var ex0 = assessorExpiry_(course.id);
      return { key: courseKey_('assessor', course.id), expires: ex0 ? ex0.toISOString() : null };
    }
    case 'rotateAssessorKey': {
      requireTutor_(tutor);
      var na = newKey_();
      PropertiesService.getScriptProperties().setProperty(keyProp_('assessor', course.id), na);
      var ex1 = assessorExpiry_(course.id);
      return { key: na, expires: ex1 ? ex1.toISOString() : null };
    }
    // A holder of the current key mints a new one; every old tutor link for
    // THIS course dies at once. The new key is returned to that caller only.
    case 'rotateKey': {
      requireTutor_(tutor);
      var nk = newKey_();
      PropertiesService.getScriptProperties().setProperty(keyProp_('tutor', course.id), nk);
      var tpk = courseRead_(course.id, 'pins'); if (tpk && tpk.tutor) { delete tpk.tutor; courseWrite_(course.id, 'pins', tpk); }
      return { key: nk };
    }

    /* The PINs (v87). Chosen by the person, never by admin; the store keeps a
       salted hash and the moment it was set. setMyPin: a trainee's first
       choice (no PIN yet), or a change (with the current one, which the
       gate above has already checked). setTutorPin: the same for the team.
       reissueTrainee: a new link for a trainee who lost theirs -- new token
       everywhere their old one was, PIN cleared, old link dead. 'pins' says
       which links have one, for the Roster and links tab. */
    case 'setMyPin': {
      if (!me || tutor || assessor) throw new Error('Trainees only');
      var tpm = courseRead_(course.id, 'pins') || {};
      tpm.trainees = tpm.trainees || {};
      var entry = pinEntry_(req.pin);
      if (!entry) throw new Error('A PIN is four to twelve letters or numbers');
      tpm.trainees[me.token] = entry;
      courseWrite_(course.id, 'pins', tpm);
      return { saved: true };
    }
    case 'setTutorPin': {
      requireTutor_(tutor);
      var tp = courseRead_(course.id, 'pins') || {};
      var tentry = pinEntry_(req.pin);
      if (!tentry) throw new Error('A PIN is four to twelve letters or numbers');
      tp.tutor = tentry;
      courseWrite_(course.id, 'pins', tp);
      return { saved: true };
    }
    case 'reissueTrainee': {
      requireTutor_(tutor);
      var oldTok = String(req.token || '');
      var row = roster_(course.id).filter(function (t) { return t.token === oldTok; })[0];
      if (!row) throw new Error('No such trainee');
      var newTok = newKey_();
      var lock = LockService.getScriptLock(); lock.waitLock(10000);
      COURSE_MEMO_ = null;
      try {
        // the roster row and every record row of theirs
        var sh = sheet_(SHEET_TRAINEES), rows = sh.getDataRange().getValues();
        for (var i = 1; i < rows.length; i++) if (String(rows[i][0]) === course.id && String(rows[i][1]) === oldTok) sh.getRange(i + 1, 2).setValue(newTok);
        var rs = sheet_(SHEET_RECORDS), rr = rs.getDataRange().getValues();
        for (var j = 1; j < rr.length; j++) if (String(rr[j][0]) === course.id && String(rr[j][1]) === oldTok) rs.getRange(j + 1, 2).setValue(newTok);
        // and wherever a course-level record names the token (letter order,
        // slots, groups...): the token is a 24-hex string, so a plain
        // replacement in the JSON touches nothing else
        ['settings', 'wording', 'observations', 'timetable', 'tppoints', 'grid', 'stream', 'shared', 'volunteers'].forEach(function (kind) {
          var rec = courseRead_(course.id, kind);
          if (rec == null) return;
          var js = JSON.stringify(rec);
          if (js.indexOf(oldTok) === -1) return;
          courseWriteRaw_(course.id, kind, JSON.parse(js.split(oldTok).join(newTok)));
        });
        var tpr = courseRead_(course.id, 'pins') || {};
        if (tpr.trainees) { delete tpr.trainees[oldTok]; courseWriteRaw_(course.id, 'pins', tpr); }
      } finally { lock.releaseLock(); }
      return { reissued: true, token: newTok, trainees: rosterWithRecords_(course.id, TUTOR_WRITES) };
    }
    case 'pins': {
      requireTutor_(tutor);
      var tp3 = courseRead_(course.id, 'pins') || {};
      var tr = {};
      Object.keys(tp3.trainees || {}).forEach(function (k) { tr[k] = tp3.trainees[k].set || true; });
      return { on: !!((courseRead_(course.id, 'settings') || {}).pinLinks), tutor: tp3.tutor ? (tp3.tutor.set || true) : false, trainees: tr };
    }

    // ---- one call per page load: the course plus the caller's own records ----
    case 'boot': {
      if (!course) throw new Error('This link is not on a course');
      /* A VOLUNTEER'S BOOT is its own small answer, not the course's. They get
         what their page is made of and nothing else: the centre and course
         name, the dates, the clock, the online rooms, the timetable (so the
         page can say when the next class is), and THEIR OWN register row.
         Never the roster, the wording, the points, the observations, the
         stream, or another volunteer's attendance. */
      if (vol) {
        var vset = courseRead_(course.id, 'settings') || {};
        /* marks + level (30 Sep 2026): the register now records three tiers
           per day (present / partial / nothing) in `marks`, and a level per
           student; both go on the certificate. `here` stays for a record
           written before the tiers. */
        /* `cert` (version 47) is the centre's signature on their certificate,
           drawn on screen by a tutor and kept on this row, so the student's
           own copy is signed too. */
        /* v52: `carried` is the hours this student already had at the centre
           before this course. The certificate is 160 hours ACROSS the centre and
           one course gives about thirty-six, so the figure the register carries
           has to reach their own page too. */
        return { volunteer: { name: vol.name, here: vol.here || [], marks: vol.marks || null, level: vol.level || '', note: vol.note || '', agreed: vol.agreed || '', cert: vol.cert || null, carried: vol.carried || 0, levelFrom: vol.levelFrom || '' /* v79: the day they moved up, the count at the level starts there */,
                              /* v56: the reminders (1 Oct 2026) -- their answers by day, and whether they still want mail */
                              replies: vol.replies || {}, email: vol.email || '', notify: vol.notify === false ? false : true, nextClass: nextClass_(course.id),
                              /* v96 (21 Oct 2026): when they joined, so days before it are not shown as missed */
                              added: vol.added || '', invited: vol.invited || '' },
                 course: { settings: { centreName: vset.centreName, courseName: vset.courseName,
                                       start: vset.start, end: vset.end, logo: vset.logo,
                                       timeZone: vset.timeZone, onlineRooms: vset.onlineRooms || [],
                                       /* v81: the course's clock, 12- or 24-hour (Ramy, 10 Oct 2026) */
                                       clock: vset.clock || '',
                                       tutorNames: vset.tutorNames || '',
                                       /* v48: the demo clock, and the centre's own certificate threshold
                                          (which never reached the student's page before: it fell back to 20). */
                                       demoToday: vset.demoToday || '', volunteerCertificateHours: vset.volunteerCertificateHours || '',
                                       /* v168: a Connect demo's day, so its bar and clock reach the volunteer's page too */
                                       presentToday: vset.presentToday || '',
                                       /* v78 (8 Oct 2026): which card the link opens on, so a volunteer
                                          on a ticket course gets the ticket like everyone else. */
                                       cardStyle: vset.cardStyle === 'ticket' ? 'ticket' : '',
                                       /* v79 (8 Oct 2026): who signs the volunteers' certificates for the
                                          centre -- a name, a role and the signature it prints. */
                                       certSigner: (vset.certSigner && vset.certSigner.name) ? { name: vset.certSigner.name, role: vset.certSigner.role || '', ink: vset.certSigner.ink || '' } : null,
                                       /* v54 (1 Oct 2026): the tutor contacts are NOT sent to a volunteer.
                                          Ramy: "we most definitely don't want to give the course tutors'
                                          emails to the volunteer students. Absolutely not." A volunteer
                                          answers a reminder; they never write to a tutor. */
                                       /* v54: what a volunteer CAN write to is the one address the centre
                                          names for its volunteer students on Course admin -- whoever is in
                                          charge of them -- never a tutor. Name and address only. */
                                       volunteerContact: (vset.volunteerContact && vset.volunteerContact.email) ? { name: vset.volunteerContact.name || '', email: vset.volunteerContact.email } : null },
                           timetable: courseRead_(course.id, 'timetable'),
                           shared: courseRead_(course.id, 'shared') } };
      }
      /* The course's own id rides along for a tutor: the register mints a
         volunteer's link as "<courseId>-<random>", and the browser has no
         other way to learn which course it is on (30 Sep 2026). Not a secret
         -- the key already proves the course; the random half is the secret. */
      var boot = { course: { id: course.id, settings: settingsFor_(course, courseRead_(course.id, 'settings'), reader, me), wording: courseRead_(course.id, 'wording'), observations: courseRead_(course.id, 'observations'), stream: streamFor_(course, courseRead_(course.id, 'stream'), tutor), grid: gridFor_(course, courseRead_(course.id, 'grid'), reader, me), timetable: courseRead_(course.id, 'timetable'), tppoints: tpPointsFor_(courseRead_(course.id, 'tppoints'), reader, me), volunteers: reader ? withoutVolunteerEmails_(courseRead_(course.id, 'volunteers'), assessor) : null, shared: courseRead_(course.id, 'shared'), folpool: vol ? null : folPoolFor_(courseRead_(course.id, 'folpool') || {}, tutor || assessor, course.id, me), folprofiles: vol ? null : folProfilesFor_(courseRead_(course.id, 'folprofiles') || {}, tutor || assessor, course.id, me), volunteerNames: (me && !tutor && !assessor && !vol) ? volunteerNamesFor_(course.id) : null, coming: comingFor_(course.id), guidance: reader ? guidanceFor_(course.id) : null } };
      if (tutor) boot.course.courseFeedback = courseFeedbackFor_(course.id);
      if (assessor) { var exb = assessorExpiry_(course.id); boot.assessor = { expires: exb ? exb.toISOString() : null }; }
      if (reader) {
        /* v53: the assessor's link never carries a candidate's address. */
        boot.roster = withoutEmails_(rosterWithRecords_(course.id, TUTOR_WRITES), assessor);
        /* v180 (29 Oct 2026): the trainee's own answers for mixing the groups -- nationality, first language, gender,
           pronouns -- never reach the assessor. Handbook 12.1 (p. 34): "other identifying information e.g. date of birth,
           nationality, address etc. is not required and should not be shared"; 12.2 (p. 35): removed from any
           documentation shared with Cambridge English and the assessor. */
        if (assessor) boot.roster.forEach(function (t) { if (t && t.records) delete t.records.about; });
      } else if (me) {
        boot.me = { token: me.token, name: me.name, group: me.group, email: me.email || '', records: recordsFor_(course.id, me.token, TRAINEE_READS) };
        /* v129: the notes classmates shared with this trainee's group or with the whole course */
        boot.course.notes = sharedNotesFor_(course.id, me);
        /* v133: the peer sheets a classmate connected with this trainee (answers held back until their own self-evaluation is in) */
        boot.course.peerSheets = peerSheetsFor_(course.id, me);
      }
      return boot;
    }

    // Remove a trainee and every record they had -- for test rows, not for a
    // candidate who leaves the course (removeTrainee keeps their records).
    case 'purgeTrainee': {
      requireTutor_(tutor);
      var tokP = String(req.token || '');
      deleteRowsWhere_(SHEET_TRAINEES, function (r) { return String(r[0]) === course.id && String(r[1]) === tokP; });
      deleteRowsWhere_(SHEET_RECORDS, function (r) { return String(r[0]) === course.id && String(r[1]) === tokP; });
      try { courseUpdateObj_(course.id, 'folpool', function (pl) { delete pl[tokP]; return pl; }); } catch (e) {} try { courseUpdateObj_(course.id, 'folprofiles', function (pl) { delete pl[tokP]; return pl; }); } catch (e) {}
      return { purged: true };
    }

    // ---- trainee's own records -------------------------------------------
    case 'me': {
      if (!me) throw new Error('No token');
      return { token: me.token, name: me.name, group: me.group, email: me.email || '', records: recordsFor_(course.id, me.token, TRAINEE_READS) };
    }
    case 'get': {
      var kind = String(req.kind || '');
      if (reader) { if (PRIVATE_KINDS[kind] || (assessor && kind === 'about')) throw new Error('Not yours to read: ' + kind); return { data: read_(course.id, String(req.token || ''), kind) }; }
      if (!me) throw new Error('No token');
      if (!TRAINEE_READS[kind]) throw new Error('Not yours to read: ' + kind);
      if (kind === 'tracker') return { data: traineeTracker_(read_(course.id, me.token, kind)) };
      return { data: read_(course.id, me.token, kind) };
    }
    case 'put': {
      var k2 = String(req.kind || '');
      if (tutor) {
        if (!TUTOR_WRITES[k2]) throw new Error('Not a record kind: ' + k2);
        if (!me) throw new Error('No token');
        write_(course.id, me.token, k2, req.data);
        return { saved: true };
      }
      if (!me) throw new Error('No token');
      // 'Start next TP' clears the trainee's copy of the returned feedback; the
      // tutor's own copy lives on in tpHistory. That is the one write a trainee
      // may make to a tutor-owned kind: clearing it.
      if (!TRAINEE_WRITES[k2] && !(k2 === 'feedback' && req.data == null)) throw new Error('Not yours to write: ' + k2);
      write_(course.id, me.token, k2, req.data);
      return { saved: true };
    }

    // ---- a candidate's materials file ------------------------------------
    // The bytes go to Drive, never into the sheet. A Sheets cell holds 50,000
    // characters and base64 costs about a third on top, so the most a cell
    // could ever carry is roughly 36 KB -- less than a single worksheet. That
    // arithmetic is why the file was made local-only on 21 Sep 2026, and why
    // "just sync it" cannot be the answer. The record still carries no bytes:
    // it carries the link this returns.
    case 'putMaterial': {
      if (!me) throw new Error('No token');
      if (!course) throw new Error('This link is not on a course');
      var mName = String(req.name || 'attachment');
      var mType = String(req.type || 'application/octet-stream');
      var b64 = String(req.bytes || '');
      if (!b64) throw new Error('No file sent');
      var bytes = Utilities.base64Decode(b64);
      // The client's own cap, restated here: a client is a request, not a
      // promise, and this one arrives from an anonymous link.
      /* bytes is ALREADY decoded (base64Decode, just above), so this is the size
         of the file itself. Raised from 2MB on 4 Oct 2026: a teaching day's
         pages as one PDF at 300 dpi is 1.2-1.5MB and was landing on the edge,
         and Ramy's point is that we decide what travels with a TP point
         ("we set the limit here"). Apps Script will take far more in a request.
         v69 briefly had a * 3 / 4 here on the mistaken belief that bytes was
         the base64 string; it was not, and that made the real cap 12MB. */
      /* RAMY, 4 Oct 2026: "the two megabyte thing wasn't about TP points, it was
         more about trainees uploading material on our own drive." Exactly the
         comment above this one -- the cap is a defence against an anonymous
         link, not a statement about file sizes. So it depends on WHO is asking:
         a trainee's token keeps the 2MB it always had, and only a call carrying
         the tutor key -- staff attaching a lesson's pages -- gets the headroom a
         teaching day's PDF needs. v69 and v70 raised it for everybody, which
         quietly removed his protection. */
      var MAX_UPLOAD_MB = byTutor ? 9 : 2;
      if (bytes.length > MAX_UPLOAD_MB * 1024 * 1024) throw new Error('That file is over ' + MAX_UPLOAD_MB + 'MB. Put it on your own Drive and paste the materials link instead.');
      var folder = materialsFolder_(course);
      var file = folder.createFile(Utilities.newBlob(bytes, mType, mName));
      // Ramy, 23 Sep 2026: "anyone with the link". A tutor opening a
      // candidate's worksheet is often not signed into the center's Workspace,
      // and an assessor never is.
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      return { url: file.getUrl(), id: file.getId(), name: file.getName(), size: bytes.length };
    }

    // ---- course-level, readable by all on the course, written by tutors ----
    case 'course': {
      if (!course) throw new Error('This link is not on a course');
      var cres = { settings: settingsFor_(course, courseRead_(course.id, 'settings'), reader, me), wording: courseRead_(course.id, 'wording'), observations: courseRead_(course.id, 'observations'), stream: streamFor_(course, courseRead_(course.id, 'stream'), tutor), grid: gridFor_(course, courseRead_(course.id, 'grid'), reader, me), timetable: courseRead_(course.id, 'timetable'), tppoints: tpPointsFor_(courseRead_(course.id, 'tppoints'), reader, me), volunteers: reader ? courseRead_(course.id, 'volunteers') : null, shared: courseRead_(course.id, 'shared'), folpool: vol ? null : folPoolFor_(courseRead_(course.id, 'folpool') || {}, tutor || assessor, course.id, me), folprofiles: vol ? null : folProfilesFor_(courseRead_(course.id, 'folprofiles') || {}, tutor || assessor, course.id, me), volunteerNames: (me && !tutor && !assessor && !vol) ? volunteerNamesFor_(course.id) : null };
      if (tutor) cres.courseFeedback = courseFeedbackFor_(course.id);
      // critLearn: what this course's tutors have tagged, for the criteria suggester (26 Sep 2026).
      // Tutors only. Restored 24 Oct 2026: it had dropped out of the read and the write when the
      // other course kinds were added, so every course's learning was refused and lost.
      if (tutor) cres.critLearn = courseRead_(course.id, 'critLearn') || null;
      return cres;
    }
    /* ---- TUTORIALS AND CONSULTATIONS, BOOKED FROM THE TIMETABLE (v182, 29 Oct 2026) -----------------------------
       Ramy: "a booking system for tutorials and consultations ... consultation will be 45 minutes ... 15 minutes each
       ... take a look at the Connect rules, we're gonna apply the same rules here". Connect's rules (migration 0275,
       consultation-actions.ts; build-spec.md rule 15): a tile is a sheet, cut into 15-minute places; a trainee books the
       NEXT open place, in order. A consultation: before an assignment's first submission, any tutor; once it is
       submitted, consultation on it is with their own tutor only (judged against the assignment they name, or, naming
       none, against whether they have submitted anything). A tutorial is with their own tutor, one place a sheet.
       Their own tutor is their group's tutor on Course admin > Tutor contacts. The sheets live in the course kind
       `bookings`: { "<date>|<tile id>": { places: { "1": { token, name, asg, at } } } }. Trainees read only their own
       places and how full each sheet is; tutors and the assessor read every name. */
    case 'bookings': {
      if (!course) throw new Error('This link is not on a course');
      var allB = courseRead_(course.id, 'bookings') || {};
      if (tutor || assessor) return { bookings: allB };
      if (!me) throw new Error('No token');
      var mineB = {};
      Object.keys(allB).forEach(function (key) {
        var pl = (allB[key] && allB[key].places) || {}, out = { taken: [], mine: [] };
        Object.keys(pl).forEach(function (n) { if (pl[n] && pl[n].token) { out.taken.push(+n); if (pl[n].token === me.token) out.mine.push({ n: +n, asg: pl[n].asg || '' }); } });
        mineB[key] = out;
      });
      return { bookings: mineB };
    }
    case 'bookSlot': {
      if (!course) throw new Error('This link is not on a course');
      if (!me || tutor || assessor) throw new Error('Only a trainee books a place');
      var bDate = String(req.date || ''), bId = String(req.id || ''), bAsg = String(req.asg || '').toLowerCase();
      var sheet = bookableTile_(course.id, bDate, bId);
      var bSet = courseRead_(course.id, 'settings') || {};
      var own = ownTutor_(bSet, me), isTut = /tutorial/i.test(sheet.tile.t || ''), sheetBy = tutorName_(bSet, sheet.tile.by);
      var ownSheet = !own || !sheetBy || own.toLowerCase() === sheetBy.toLowerCase();
      if (isTut && !ownSheet) throw new Error('Tutorials are with your own tutor, ' + own + '. Book on their sheet.');
      if (!isTut && !ownSheet) {
        var subs = read_(course.id, me.token, 'assignments') || {};
        var sent = function (k) { var a = subs[k]; return !!(a && (a.sub1At || a.stage === 'submitted' || a.stage === 'resubmitted' || a.stage === 'resubmission_needed' || a.stage === 'closed')); };
        var blocked = bAsg ? sent(bAsg) : Object.keys(subs).some(sent);
        if (blocked) throw new Error(bAsg ? 'You have already submitted ' + bAsg.toUpperCase() + ', so consultation on it is with your own tutor only, ' + own + '.' : 'You have submitted an assignment, so consultation is with your own tutor only, ' + own + '. Book on their sheet, or say which assignment this is about.');
      }
      var key = bDate + '|' + bId, got = 0;
      courseUpdateObj_(course.id, 'bookings', function (all) {
        var sh = all[key] || { places: {} }; sh.places = sh.places || {};
        var taken = Object.keys(sh.places).filter(function (n) { return sh.places[n] && sh.places[n].token; });
        if (isTut && taken.some(function (n) { return sh.places[n].token === me.token; })) throw new Error('You already have a place on this sheet.');
        for (var n = 1; n <= sheet.places; n++) { if (!sh.places[n] || !sh.places[n].token) { sh.places[n] = { token: me.token, name: me.name || '', asg: bAsg, at: new Date().toISOString() }; got = n; break; } }
        if (!got) throw new Error('No places left on this sheet.');
        all[key] = sh; return all;
      });
      return { booked: got, from: placeTime_(sheet.tile.s, got) };
    }
    case 'releaseSlot': {
      if (!course) throw new Error('This link is not on a course');
      var rKey = String(req.date || '') + '|' + String(req.id || ''), rN = req.n != null ? String(req.n) : '';
      if (!tutor && !me) throw new Error('No token');
      courseUpdateObj_(course.id, 'bookings', function (all) {
        var sh = all[rKey]; if (!sh || !sh.places) return all;
        Object.keys(sh.places).forEach(function (n) {
          var p = sh.places[n]; if (!p) return;
          /* a trainee frees their own place; a tutor frees any one, by its number */
          if ((tutor && rN && n === rN) || (!tutor && me && p.token === me.token && (!rN || n === rN))) delete sh.places[n];
        });
        all[rKey] = sh; return all;
      });
      return { released: true };
    }
    case 'putCourse': {
      requireTutor_(tutor);
      var ck = String(req.kind || '');
      // observations: the centre's own wording of the observation tasks (27 Sep 2026)
      // timetable: the course's own timetable, native since 29 Sep 2026 -- the
      // course admin writes it, everyone on the course reads it.
      // tppoints: the rotated teaching-practice points, released per group.
      // guidance: the tutors' marking guidance per criterion (v94, 17 Oct 2026) --
      // read by the tutors and the assessor only, never sent to a trainee.
      if (ck !== 'settings' && ck !== 'wording' && ck !== 'observations' && ck !== 'timetable' && ck !== 'tppoints' && ck !== 'volunteers' && ck !== 'guidance' && ck !== 'critLearn') throw new Error('Not a course kind: ' + ck);
      var data = req.data;
      if (ck === 'settings') {
        // The owner's centre number stays (1 Oct 2026): a course made for
        // TR001 is TR001 whatever Course admin sends.
        var was = courseRead_(course.id, 'settings') || {};
        if (was.centreLocked && was.centreNumber && data && typeof data === 'object') { data.centreNumber = was.centreNumber; data.centreLocked = true; }
        /* v166: a Connect demo keeps its day and a visitor's copy keeps its end, whatever a page sends; the day
           moves only when the presenter's switch sends a new one. */
        if (data && typeof data === 'object') {
          if (was.presentToday && !data.presentToday) data.presentToday = was.presentToday;
          if (was.demoExpires && !owner) data.demoExpires = was.demoExpires;
        }
      }
      courseWrite_(course.id, ck, data);
      return { saved: true };
    }

    // ---- the course stream: short posts from the tutors (28 Sep 2026) ------
    // Ramy: "the only thing missing now is an announcement stream -- MCT to
    // whole course / TP group, ACT to TP group." One course-level list, kind
    // 'stream'; appended and removed ONE POST AT A TIME under the lock, so two
    // tutors posting in the same moment cannot overwrite each other. Never
    // written whole through putCourse. Candidates read it with boot/course and
    // apply the audience filter themselves; the assessor gets it with the rest
    // of the course and the pack simply does not draw it.
    /* SHARING A LESSON'S MATERIALS WITH THE VOLUNTEER STUDENTS (30 Sep 2026).
       Ramy: trainees should be able to share material with the volunteers
       while planning, before they teach. A trainee cannot write a course
       record -- they only ever write their own -- so this is an op of its own,
       appending under the lock the way `post` does. A TUTOR may share too.
       The volunteers read it; so does everyone else on the course, which is
       right: it is the candidates' own handouts, not anybody's private data. */
    case 'shareMaterial': {
      if (!course) throw new Error('This link is not on a course');
      if (!tutor && !me) throw new Error('Only a trainee or a tutor can share');
      var shName = String(req.name || '').trim().slice(0, 140);
      var shUrl = String(req.url || '').trim().slice(0, 900);
      if (!shName || !/^https?:\/\//i.test(shUrl)) throw new Error('A name and a link are needed');
      var item = { id: newKey_().slice(0, 12), at: pinnedAt_(course, req.at),
                   name: shName, url: shUrl,
                   by: String(req.by || (me && me.name) || '').slice(0, 80),
                   tp: String(req.tp || '').slice(0, 12),
                   /* what the lesson is about ("Grammar"), which the plan page has sent since
                      1 Oct and the store dropped on the floor (volunteer walk, 24 Oct 2026) */
                   aim: String(req.aim || '').slice(0, 40),
                   /* the class it was made for ("A2"), from the plan, so a volunteer sees their
                      own class's handouts and not the other level's (Fable read, 26 Oct 2026) */
                   level: String(req.level || '').slice(0, 30),
                   kind: String(req.kind || '').slice(0, 20) };
      /* One row per link: sharing the same file twice is a slip, not two
         handouts, and a volunteer should not see it listed twice. */
      return { shared: courseUpdate_(course.id, 'shared', function (list) {
        var out = list.filter(function (x) { return x && x.url !== item.url; });
        out.push(item);
        return out.length > 120 ? out.slice(out.length - 120) : out;
      }) };
    }
    /* THE FOCUS ON THE LEARNER POOL (v90, 15 Oct 2026). Ramy: "make Lite pool
       them too." What each trainee HEARD in their student interview (a
       grammar or pronunciation problem and the student's words, never the
       answers) is written here, one list per trainee, replaced whole each time
       so a removed note goes too, and read back by everyone on the course as
       one pool. Trainees see the notes without who wrote them; the tutors see
       the name. The answers stay in the trainee's own `interview` record. */
    case 'poolHeard': {
      if (!me || tutor || assessor) throw new Error('Trainees only');
      if (!course) throw new Error('This link is not on a course');
      var phIn = Array.isArray(req.items) ? req.items : [];
      var phClean = [];
      phIn.slice(0, 60).forEach(function (it) {
        if (!it) return;
        var phNote = String(it.note || '').trim().slice(0, 400);
        if (!phNote) return;
        phClean.push({ id: String(it.id || newKey_().slice(0, 8)).slice(0, 24),
                       type: it.type === 'pronunciation' ? 'pronunciation' : 'grammar',
                       note: phNote, student: String(it.student || '').trim().slice(0, 60),
                       by: String(me.name || '').slice(0, 80), at: new Date().toISOString() });
      });
      var phTok = me.token;
      var phPool = courseUpdateObj_(course.id, 'folpool', function (pool) {
        if (phClean.length) pool[phTok] = phClean; else delete pool[phTok];
        return pool;
      });
      /* the answers, for the group's profile; an older page that sends none leaves them as they are */
      var phProf;
      if (Array.isArray(req.profiles)) {
        var KEYS = ['who', 'languages', 'history', 'why', 'likes', 'use', 'hard', 'sounds'], prClean = [];
        req.profiles.slice(0, 12).forEach(function (pr) {
          if (!pr) return;
          var nm = String(pr.student || '').trim().slice(0, 60); if (!nm) return;
          var ans = {}, any = false;
          KEYS.forEach(function (k) { var v = String((pr.answers || {})[k] || '').trim().slice(0, 1200); if (v) { ans[k] = v; any = true; } });
          var aud = (Array.isArray(pr.audio) ? pr.audio : []).slice(0, 8).map(function (a) {
            return a && a.id ? { id: String(a.id).slice(0, 80), seconds: Number(a.seconds) || 0, transcript: a.transcript == null ? null : String(a.transcript).slice(0, 12000) } : null;
          }).filter(Boolean);
          if (any || aud.length) prClean.push({ student: nm, answers: ans, audio: aud, by: String(me.name || '').slice(0, 80), at: new Date().toISOString() });
        });
        phProf = courseUpdateObj_(course.id, 'folprofiles', function (pool) {
          if (prClean.length) pool[phTok] = prClean; else delete pool[phTok];
          return pool;
        });
      } else phProf = courseRead_(course.id, 'folprofiles') || {};
      return { folpool: folPoolFor_(phPool, false, course.id, me), folprofiles: folProfilesFor_(phProf, false, course.id, me) };
    }
    /* THE NOTEBOOK (v129, 25 Oct 2026). Ramy: "a smart notebook, connected to the rest of the
       course"; "share with the whole course or share with my TP group"; "one for the trainers as
       well, separate obviously... personal: tutors cannot see each other's notebook. They can share
       but they cannot see each other's notes."
       A TRAINEE'S notes live in their own `notebook` record (put/get, private, see PRIVATE_KINDS).
       Sharing one copies it into the course-level `notes` pool, one list per token, upserted by
       id so two trainees sharing in the same moment cannot overwrite each other; the boot hands
       each trainee the notes shared with their group or with everyone, with the writer's name.
       Tutors and the assessor never get the pool: it is the trainees' own.
       A TUTOR'S notes are the course-level `tutorNotes` pool, one list per tutor name (the name
       the dashboard asks for; the tutors share one key, so the name is the only identity there
       is, and these ops answer only the list for the name given plus what the others shared).
       The pool is never in the boot, so a colleague's page never caches it. */
    case 'shareNote': {
      if (!me || tutor || assessor) throw new Error('Trainees only');
      if (!course) throw new Error('This link is not on a course');
      var snItem = noteClean_(req.item, me.name);
      if (!snItem) throw new Error('Nothing to share');
      snItem.scope = req.scope === 'course' ? 'course' : 'group';
      snItem.group = String(me.group || '');
      var snTok = me.token;
      courseUpdateObj_(course.id, 'notes', function (pool) {
        var list = (pool[snTok] || []).filter(function (x) { return x && x.id !== snItem.id; });
        list.push(snItem);
        pool[snTok] = list.length > 200 ? list.slice(list.length - 200) : list;
        return pool;
      });
      return { shared: true, notes: sharedNotesFor_(course.id, me) };
    }
    case 'unshareNote': {
      if (!me || tutor || assessor) throw new Error('Trainees only');
      if (!course) throw new Error('This link is not on a course');
      var unId = String(req.id || ''), unTok = me.token;
      courseUpdateObj_(course.id, 'notes', function (pool) {
        var list = (pool[unTok] || []).filter(function (x) { return x && x.id !== unId; });
        if (list.length) pool[unTok] = list; else delete pool[unTok];
        return pool;
      });
      return { shared: false, notes: sharedNotesFor_(course.id, me) };
    }
    /* PEER SHEETS, CONNECTED (v133, 25 Oct 2026). Ramy: a trainee who watched a colleague teach may choose to
       share what they wrote about that colleague, "only after the oral feedback", and "it shouldn't open
       until the self-eval is submitted". The observer sends ONE teacher's column (the questions with
       their answers, so the wording is the centre's own whatever it is) to ONE classmate of their own TP
       group, and takes it back the same way. The copy lives in the course's `peerShared` pool, keyed by
       the observer. The teacher gets it in the boot and in `peerSheets`, and the answers stay out of it
       until THEIR self-evaluation for that teaching practice is turned in (or its feedback is returned):
       the store holds that back, not the page. The "after the oral feedback" half is the page's, by the
       timetable's feedback slot; it guards the observer from sharing early, and the sheet is their own.
       Tutors read the observer's own sheet, as before; they never need the pool. */
    case 'shareSheet': {
      if (!me || tutor || assessor) throw new Error('Trainees only');
      if (!course) throw new Error('This link is not on a course');
      var ssTo = peerTo_(course.id, me, req.to);
      var ssItem = peerSheetClean_(req, me, ssTo);
      courseUpdateObj_(course.id, 'peerShared', function (pool) {
        var list = (pool[me.token] || []).filter(function (x) { return x && x.id !== ssItem.id; });
        list.push(ssItem);
        pool[me.token] = list.length > 160 ? list.slice(list.length - 160) : list;
        return pool;
      });
      return { shared: true };
    }
    case 'unshareSheet': {
      if (!me || tutor || assessor) throw new Error('Trainees only');
      if (!course) throw new Error('This link is not on a course');
      var usTo = peerTo_(course.id, me, req.to);
      var usId = peerSheetId_(String(req.task || ''), req.sit === 'b' ? 'b' : 'a', usTo);
      courseUpdateObj_(course.id, 'peerShared', function (pool) {
        var list = (pool[me.token] || []).filter(function (x) { return x && x.id !== usId; });
        if (list.length) pool[me.token] = list; else delete pool[me.token];
        return pool;
      });
      return { shared: false };
    }
    case 'peerSheets': {
      if (!me || tutor || assessor) throw new Error('Trainees only');
      if (!course) throw new Error('This link is not on a course');
      return { sheets: peerSheetsFor_(course.id, me) };
    }
    case 'tutorNotes': {
      requireTutor_(tutor);
      var tnWho = tutorWho_(req.who);
      var tnPool = courseRead_(course.id, 'tutorNotes') || {};
      var tnShared = [];
      Object.keys(tnPool).forEach(function (w) {
        if (w === tnWho) return;
        (tnPool[w] || []).forEach(function (it) { if (it && it.shared) tnShared.push(it); });
      });
      tnShared.sort(function (a, b) { return String(a.at).localeCompare(String(b.at)); });
      /* v130: the replies trainees left on the notes this tutor connected with them */
      var tnConnected = (courseRead_(course.id, 'notes') || {})['tutor:' + tnWho] || [];
      var tnMine = (tnPool[tnWho] || []).map(function (it) {
        var copy = tnConnected.filter(function (c) { return c && c.id === it.id; })[0];
        if (!copy || !copy.replies || !copy.replies.length) return it;
        return Object.assign({}, it, { replies: copy.replies.map(function (r) { return { by: r.by, at: r.at, text: r.text }; }) });
      });
      return { mine: tnMine, shared: tnShared };
    }
    case 'putTutorNote': {
      requireTutor_(tutor);
      var ptWho = tutorWho_(req.who);
      var ptItem = noteClean_(req.item, String(req.who || '').trim());
      if (!ptItem) throw new Error('Nothing to keep');
      ptItem.shared = !!(req.item && req.item.shared);
      /* v130: where the tutor connected it on the trainees' side, so their own list remembers */
      var ptSent = req.item && req.item.sent;
      ptItem.sent = (ptSent && /^(trainee|group|course)$/.test(String(ptSent.scope || ''))) ? { scope: String(ptSent.scope), to: String(ptSent.to || '').slice(0, 40), group: String(ptSent.group || '').slice(0, 20), name: String(ptSent.name || '').slice(0, 80) } : null;
      var ptPool = courseUpdateObj_(course.id, 'tutorNotes', function (pool) {
        var list = (pool[ptWho] || []).filter(function (x) { return x && x.id !== ptItem.id; });
        list.push(ptItem);
        list.sort(function (a, b) { return String(a.at).localeCompare(String(b.at)); });
        pool[ptWho] = list.length > 400 ? list.slice(list.length - 400) : list;
        return pool;
      });
      return { saved: true, mine: ptPool[ptWho] || [] };
    }
    case 'dropTutorNote': {
      requireTutor_(tutor);
      var dtWho = tutorWho_(req.who), dtId = String(req.id || '');
      var dtPool = courseUpdateObj_(course.id, 'tutorNotes', function (pool) {
        var list = (pool[dtWho] || []).filter(function (x) { return x && x.id !== dtId; });
        if (list.length) pool[dtWho] = list; else delete pool[dtWho];
        return pool;
      });
      return { dropped: true, mine: dtPool[dtWho] || [] };
    }
    /* QUESTIONS (v173, 28 Oct 2026; Ramy: "hold to ask ... into the tutor's notebook ... a question wall"). A trainee asks the tutor
       of the input session they are in, by voice (up to thirty seconds) or typed; the audience of a Connect demo asks through
       roomAsk. They land in the course's `questions` pool, one list, newest last. Tutors read them all and mark them
       answered; the asker hears or reads their own. The voice is a file in the course's private notebook folder, described
       by the question it belongs to. */
    case 'askQuestion': {
      if (!me || tutor || assessor) throw new Error('Trainees only');
      if (!course) throw new Error('This link is not on a course');
      var aqItem = questionClean_(course, req, { token: me.token, name: me.name, group: String(me.group || '') });
      courseUpdateObj_(course.id, 'questions', function (pool) { return questionAdd_(pool, aqItem); });
      questionToNotebook_(course.id, aqItem);
      return { asked: true, id: aqItem.id };
    }
    case 'questions': {
      requireTutor_(tutor);
      var qPool = courseRead_(course.id, 'questions') || {};
      return { items: qPool.items || [] };
    }
    case 'answerQuestion': {
      requireTutor_(tutor);
      var anId = String(req.id || ''), anOn = req.state === 'open' ? 'open' : 'answered', anBy = String(req.who || '').trim().slice(0, 80);
      var anPool = courseUpdateObj_(course.id, 'questions', function (pool) {
        (pool.items || []).forEach(function (q) { if (q && q.id === anId) { q.state = anOn; q.answeredAt = anOn === 'answered' ? new Date().toISOString() : ''; q.answeredBy = anOn === 'answered' ? anBy : ''; } });
        return pool;
      });
      return { items: anPool.items || [] };
    }
    case 'getQuestionAudio': {
      if (!course) throw new Error('This link is not on a course');
      var gqId = String(req.id || ''), gqPool = courseRead_(course.id, 'questions') || {};
      var gqQ = (gqPool.items || []).filter(function (q) { return q && q.audio && q.audio.id === gqId; })[0];
      if (!gqQ) throw new Error('No such recording');
      if (!tutor && !(me && gqQ.token === me.token)) throw new Error('Not yours to hear');
      var gqBlob = DriveApp.getFileById(gqId).getBlob();
      return { type: gqBlob.getContentType(), bytes: Utilities.base64Encode(gqBlob.getBytes()) };
    }
    /* the link the room is given: made once, kept in the course's settings, handed only to a tutor */
    case 'roomLink': {
      requireTutor_(tutor);
      var rlSet = courseRead_(course.id, 'settings') || {};
      if (!rlSet.askCode) { rlSet = courseUpdateObj_(course.id, 'settings', function (st) { if (!st.askCode) st.askCode = newKey_().slice(0, 12); return st; }); }
      return { course: course.id, code: rlSet.askCode };
    }
    /* A TUTOR CONNECTS A NOTE WITH A TRAINEE (v130, 25 Oct 2026; Ramy: "can the tutors share notes with
       trainees and email and whatnot?"). The note goes into the same `notes` pool the trainees connect
       through, under the key "tutor:<name>", with its audience: one trainee (`to` is their token), a TP
       group, or the whole course. The trainee's boot hands them what reaches them, signed with the
       tutor's name. The tutor's own notebook stays theirs; only what they connect moves. */
    case 'tutorConnectNote': {
      requireTutor_(tutor);
      var tcWho = tutorWho_(req.who);
      var tcItem = noteClean_(req.item, String(req.who || '').trim());
      if (!tcItem) throw new Error('Nothing to connect');
      tcItem.fromTutor = true;
      tcItem.scope = req.scope === 'trainee' ? 'trainee' : req.scope === 'course' ? 'course' : 'group';
      if (tcItem.scope === 'trainee') {
        var tcTo = String(req.to || '');
        if (!roster_(course.id).some(function (t) { return t.token === tcTo; })) throw new Error('That trainee is not on the course');
        tcItem.to = tcTo;
      } else if (tcItem.scope === 'group') {
        tcItem.group = String(req.group || '').trim();
        if (!tcItem.group) throw new Error('Which TP group?');
      }
      var tcKey = 'tutor:' + tcWho;
      courseUpdateObj_(course.id, 'notes', function (pool) {
        var list = (pool[tcKey] || []).filter(function (x) { return x && x.id !== tcItem.id; });
        list.push(tcItem);
        pool[tcKey] = list.length > 400 ? list.slice(list.length - 400) : list;
        return pool;
      });
      return { connected: true };
    }
    /* A TRAINEE REPLIES TO A TUTOR'S NOTE (v130; Ramy: "they can only reply to the note, but they cannot
       initiate a note. They can only send an email"). A short word back, kept on the tutor's connected
       copy in the pool; the tutor reads it under their note, the trainee sees their own reply, and nobody
       else sees it. A trainee can reply only to a note that reached them. */
    case 'replyNote': {
      if (!me || tutor || assessor) throw new Error('Trainees only');
      if (!course) throw new Error('This link is not on a course');
      var rpId = String(req.id || ''), rpText = String(req.text || '').trim().slice(0, 400);
      if (!rpText) throw new Error('Nothing to send');
      var rpG = String(me.group || ''), rpFound = false;
      courseUpdateObj_(course.id, 'notes', function (pool) {
        Object.keys(pool).forEach(function (k) {
          if (k.indexOf('tutor:') !== 0) return;
          (pool[k] || []).forEach(function (it) {
            if (!it || it.id !== rpId) return;
            var reaches = it.scope === 'course' || (it.scope === 'group' && String(it.group || '') === rpG) || (it.scope === 'trainee' && it.to === me.token);
            if (!reaches) return;
            rpFound = true;
            var list = (it.replies || []).filter(function (r) { return r && r.token !== me.token; });
            list.push({ token: me.token, by: String(me.name || '').slice(0, 80), at: new Date().toISOString(), text: rpText });
            it.replies = list.length > 40 ? list.slice(list.length - 40) : list;
          });
        });
        return pool;
      });
      if (!rpFound) throw new Error('That note did not reach you');
      return { replied: true, notes: sharedNotesFor_(course.id, me) };
    }
    case 'tutorUnconnectNote': {
      requireTutor_(tutor);
      var tuKey = 'tutor:' + tutorWho_(req.who), tuId = String(req.id || '');
      courseUpdateObj_(course.id, 'notes', function (pool) {
        var list = (pool[tuKey] || []).filter(function (x) { return x && x.id !== tuId; });
        if (list.length) pool[tuKey] = list; else delete pool[tuKey];
        return pool;
      });
      return { connected: false };
    }
    /* A VOICE NOTE (v129). The file goes to a private folder under the course's materials, like an
       interview recording, and is played back through the store: by the person who made it, and by
       whoever the note was shared with. Never the bytes in the sheet. Ninety seconds is the most a
       note holds; the page stops the recorder there. */
    case 'putNoteAudio': {
      if (!course) throw new Error('This link is not on a course');
      if (assessor || (!me && !tutor)) throw new Error('Only a trainee or a tutor can keep a voice note');
      var naBytes = Utilities.base64Decode(String(req.bytes || ''));
      if (!naBytes.length) throw new Error('Nothing was recorded');
      if (naBytes.length > 3 * 1024 * 1024) throw new Error('That recording is over 3MB. Keep a voice note under ninety seconds.');
      var naType = String(req.type || '').split(';')[0];
      if (!/^audio\//.test(naType)) naType = 'audio/webm';
      var naExt = naType.indexOf('mp4') >= 0 ? 'm4a' : naType.indexOf('ogg') >= 0 ? 'ogg' : naType.indexOf('mpeg') >= 0 ? 'mp3' : 'webm';
      var naWho = tutor ? String(req.who || '').trim().slice(0, 80) : me.name;
      var naStamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
      var naFile = notebookFolder_(course).createFile(Utilities.newBlob(naBytes, naType, 'Voice note ' + naWho + ' ' + naStamp + '.' + naExt));
      naFile.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
      var naMeta = { by: naWho, seconds: Number(req.seconds) || 0 };
      if (tutor) { naMeta.tutor = true; naMeta.who = tutorWho_(req.who); } else naMeta.token = me.token;
      naFile.setDescription(JSON.stringify(naMeta));
      return { id: naFile.getId(), size: naBytes.length };
    }
    case 'getNoteAudio': {
      var gnFile = noteFileFor_(course, req.id, tutor, me, req.who);
      var gnBlob = gnFile.getBlob();
      return { type: gnBlob.getContentType(), bytes: Utilities.base64Encode(gnBlob.getBytes()) };
    }
    case 'deleteNoteAudio': {
      var dnFile = noteFileFor_(course, req.id, tutor, me, req.who, true);
      dnFile.setTrashed(true);
      return { deleted: true };
    }
    /* RECORDING THE STUDENT INTERVIEW (v91, 15 Oct 2026). Ramy: "we can easily
       have a consent... the same with the video, then it's the audio" and
       "transcribe". The consent is the one a volunteer already gives on their
       own page, in six languages: "I agree to being recorded, in sound or on
       video, during this sign-up and in lessons". So a recording is only ever
       accepted for a student on the register whose row carries `agreed`, on a
       course whose Course admin has switched recording on.
       The file goes to a PRIVATE folder under the course's materials, owned by
       the account the script runs as -- never "anyone with the link", unlike
       a trainee's worksheet. It is played back through this store: the trainee
       who made it, and the tutors of the course, nobody else. The description
       carries who made it. */
    case 'putInterviewAudio': {
      if (!me || tutor || assessor) throw new Error('Trainees only');
      if (!course) throw new Error('This link is not on a course');
      if (((courseRead_(course.id, 'settings') || {}).interviewRecording) === false) throw new Error('Recording is not switched on for this course');   /* v181: on unless the center turned it off */
      var iaName = String(req.student || '').trim();
      var iaReg = courseRead_(course.id, 'volunteers') || {};
      var iaStudent = (iaReg.students || []).filter(function (x) { return x && String(x.name || '').trim().toLowerCase() === iaName.toLowerCase(); })[0];
      if (!iaStudent) throw new Error('That student is not on the register');
      if (!iaStudent.agreed) throw new Error('That student has not agreed to be recorded');
      var iaBytes = Utilities.base64Decode(String(req.bytes || ''));
      if (!iaBytes.length) throw new Error('Nothing was recorded');
      if (iaBytes.length > 8 * 1024 * 1024) throw new Error('That recording is over 8MB. Keep an interview under ten minutes.');
      var iaType = String(req.type || '').split(';')[0];
      if (!/^audio\//.test(iaType)) iaType = 'audio/webm';
      var iaExt = iaType.indexOf('mp4') >= 0 ? 'm4a' : iaType.indexOf('ogg') >= 0 ? 'ogg' : iaType.indexOf('mpeg') >= 0 ? 'mp3' : 'webm';
      var iaStamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
      var iaFile = interviewFolder_(course).createFile(Utilities.newBlob(iaBytes, iaType, 'Interview ' + me.name + ' with ' + iaName + ' ' + iaStamp + '.' + iaExt));
      iaFile.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
      iaFile.setDescription(JSON.stringify({ token: me.token, by: me.name, student: iaName, seconds: Number(req.seconds) || 0 }));
      return { id: iaFile.getId(), size: iaBytes.length };
    }
    case 'getInterviewAudio': {
      var gaFile = interviewFileFor_(course, req.id, tutor, me);
      var gaBlob = gaFile.getBlob();
      return { type: gaBlob.getContentType(), bytes: Utilities.base64Encode(gaBlob.getBytes()) };
    }
    case 'deleteInterviewAudio': {
      var daFile = interviewFileFor_(course, req.id, tutor, me, true);
      daFile.setTrashed(true);
      return { deleted: true };
    }
    /* The transcript is the OpenAI speech model's (key held as a script
       property, set from the owner console). It is a convenience: the model
       tends to tidy a learner's mistakes, so the recording stays the evidence
       and the trainee corrects the text against it. */
    case 'transcribeInterview': {
      var tiFile = interviewFileFor_(course, req.id, tutor, me, true);
      var tiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_KEY');
      if (!tiKey) throw new Error('Transcription is not switched on');
      /* First try the speaker-labelled model, asked to stream: OpenAI cuts a
         plain request off near 80 seconds, a streamed one runs to the end (a
         5-minute recording took 160 s, 15 Oct 2026). If that fails for any
         reason, fall back to the plain transcript with no speakers marked. */
      try {
        var tdResp = UrlFetchApp.fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'post', muteHttpExceptions: true, headers: { Authorization: 'Bearer ' + tiKey },
          payload: { file: tiFile.getBlob(), model: 'gpt-4o-transcribe-diarize', response_format: 'diarized_json',
                     chunking_strategy: 'auto', stream: 'true' }
        });
        if (tdResp.getResponseCode() === 200) {
          var tdText = diarizedTurns_(tdResp.getContentText());
          if (tdText) return { text: tdText, labelled: true };
        }
      } catch (tdErr) { /* fall through to the plain transcript */ }
      var tiResp = UrlFetchApp.fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'post', muteHttpExceptions: true, headers: { Authorization: 'Bearer ' + tiKey },
        payload: { file: tiFile.getBlob(), model: 'whisper-1', response_format: 'text', language: 'en',
                   prompt: 'An interview with a learner of English. Write exactly what is said, including grammar mistakes and hesitations.' }
      });
      if (tiResp.getResponseCode() !== 200) throw new Error('The transcript could not be made (' + tiResp.getResponseCode() + ')');
      return { text: String(tiResp.getContentText() || '').trim(), labelled: false };
    }
    /* THE INPUT SESSIONS' TRAINER NOTES (Ramy, 26 Oct 2026: they sat in each page,
       hidden, where anyone reading the source could see them). They live in
       TrainerNotes.js, generated by input-sessions/_house.py, and a session page
       asks for its own after the tutor ping. Tutors only. */
    case 'trainerNotes': {
      requireTutor_(tutor);
      var tnSlug = String(req.slug || '').replace(/[^a-z0-9-]/g, '').slice(0, 80);
      var tnAll = (typeof TRAINER_NOTES_ === 'object' && TRAINER_NOTES_) || {};
      return { html: tnAll[tnSlug] || '' };
    }
    case 'transcriptionOn': {
      return { on: !!PropertiesService.getScriptProperties().getProperty('OPENAI_KEY') };
    }
    /* STAGE 1 IN NEW WORDS (Ramy, 26 Oct 2026: "I don't want to use the exact
       wording ... there's someone else's wordings"). The CELTA 5 sends the
       points from the first third's feedback, each with its criterion codes;
       the model says each again in fresh words with the same meaning and the
       same detail, strengths as short phrases, action points as imperatives,
       and joins two that say the same thing. Codes come back as they were
       sent. Tutors only; the tutor edits what comes back before returning it. */
    /* WHILE YOU WATCH -> THE BOXES (Ramy, 26-27 Oct 2026: "it shouldn't really
       change what you said. It should just carry over what you said in the right
       box ... with the criteria"). The tutor's lines, each copied as written into
       the right one of the feedback form's four boxes, with up to two suggested
       criteria. Nothing rewritten, nothing added, no grades. Tutors only. */
    case 'tidyNotes': {
      requireTutor_(tutor);
      if (course && (courseRead_(course.id, 'settings') || {}).askConnect === false) throw new Error('Ask Connect is switched off for this course');
      var tnKey = PropertiesService.getScriptProperties().getProperty('OPENAI_KEY');
      if (!tnKey) throw new Error('Tidying is not switched on');
      var tnNotes = String(req.notes || '').slice(0, 6000).trim();
      if (!tnNotes) return { sp: [], ap: [], st: [], at: [] };
      var tnCrit = (Array.isArray(req.criteria) ? req.criteria : []).filter(function(c){ return Array.isArray(c) && /^[1-5][a-n]$/.test(String(c[0])); })
        .map(function(c){ return String(c[0]) + ' ' + String(c[1] || '').slice(0, 200); }).slice(0, 41);
      var tnSys = 'You help a CELTA tutor file the notes they wrote while watching a trainee teach. '
        + 'Split the notes into the tutor\'s own points, one per line or sentence as the tutor separated them, and COPY EACH POINT EXACTLY AS WRITTEN: the same words, spelling, shorthand and punctuation. '
        + 'Do not rewrite, correct, expand, shorten, join, split further or add anything. Drop only a bare bullet mark or dash at the start of a line. '
        + 'Your whole job is to put each point in the right list and to suggest its criteria. '
        + 'Lists: sp = strength in planning (the written plan and the materials as prepared: aims, staging on paper, language analysis, anticipated problems, timings planned, the look of materials, acknowledging sources); '
        + 'ap = action point in planning; st = strength in teaching (what happened in the room: rapport, instructions, CCQs and ICQs, eliciting, board work, monitoring, feedback to students, error correction, pace, timing on the day); at = action point in teaching. '
        + 'A point that praises or says something went well is a strength; a point that names a problem, a lack or something to change is an action point. Most notes are about teaching. '
        + 'For each point give the one or two criterion codes that fit it best: planning points use 4a to 4n only, teaching points use 1a to 3b and 5a to 5n only. '
        + '"Not referenced", "no refs" or "no sources" about materials means the sources were not acknowledged (4d). '
        + 'Criteria: ' + tnCrit.join('; ') + '. '
        + celtaShorthand_()
        + 'Example. Notes: "good rapport. instr too long. vocab analysis clear. no sources on handout". '
        + 'Answer: {"sp":[{"text":"vocab analysis clear","codes":["4i"]}],"ap":[{"text":"no sources on handout","codes":["4d"]}],'
        + '"st":[{"text":"good rapport","codes":["1d"]}],"at":[{"text":"instr too long","codes":["5f"]}]}. '
        + 'Answer as JSON with the four lists sp, ap, st, at.';
      var tnResp = UrlFetchApp.fetch('https://api.openai.com/v1/chat/completions', {
        method: 'post', muteHttpExceptions: true, contentType: 'application/json', headers: { Authorization: 'Bearer ' + tnKey },
        payload: JSON.stringify({ model: 'gpt-4.1', temperature: 0, response_format: { type: 'json_object' },
          messages: [{ role: 'system', content: tnSys }, { role: 'user', content: tnNotes }] })
      });
      if (tnResp.getResponseCode() !== 200) throw new Error('The notes could not be tidied (' + tnResp.getResponseCode() + ')');
      var tnOut = JSON.parse(JSON.parse(tnResp.getContentText()).choices[0].message.content || '{}');
      var tnList = function(a, planning){ return (Array.isArray(a) ? a : []).slice(0, 20).map(function(x){
        return { text: String((x && x.text) || '').trim().slice(0, 400), codes: (Array.isArray(x && x.codes) ? x.codes : []).map(function(c){ return String(c).toLowerCase(); })
          .filter(function(c){ return /^[1-5][a-n]$/.test(c) && (planning ? c.charAt(0) === '4' : c.charAt(0) !== '4'); }).slice(0, 2) }; }).filter(function(x){ return x.text; }); };
      return { sp: tnList(tnOut.sp, true), ap: tnList(tnOut.ap, true), st: tnList(tnOut.st, false), at: tnList(tnOut.at, false) };
    }
    /* THE OVERALL COMMENT FROM THE TUTOR'S NOTES (Ramy, 27 Oct 2026: "the overall
       comment ... that's the prose ... a running commentary about the lesson or a
       summary"; "let's do both"). The same rough notes become a draft of the TP
       feedback's Overall comment, in the supportive or the direct voice as Connect's
       tone tool offers them. Only what the notes say: nothing added, no grade. Tutors only. */
    case 'overallFromNotes': {
      requireTutor_(tutor);
      if (course && (courseRead_(course.id, 'settings') || {}).askConnect === false) throw new Error('Ask Connect is switched off for this course');
      var onKey = PropertiesService.getScriptProperties().getProperty('OPENAI_KEY');
      if (!onKey) throw new Error('Writing is not switched on');
      var onNotes = String(req.notes || '').slice(0, 6000).trim();
      if (!onNotes) return { text: '' };
      var onTone = req.tone === 'direct' ? 'direct' : req.tone === 'own' ? 'own' : 'supportive';
      /* "My own words" (Ramy, 27 Oct 2026: "some want to use it, but keep their own language
         style. Their own voice"): the tutor's lines joined into prose, only spelling and grammar
         put right; no voice of the model's own. */
      var onVoice = onTone === 'direct'
        ? 'direct: clear and concise, unambiguous about what needs to change, no hedging, action-oriented'
        : onTone === 'own'
        ? 'the tutor\'s own: keep their words, phrasing and order as far as possible; only join the lines into sentences, write shorthand out, and put spelling and grammar right; add no warmth, softening, praise or emphasis that is not in the lines'
        : 'supportive: warm and encouraging, leads with what went well, frames what to work on gently';
      /* Register (Ramy, 27 Oct 2026: "you made OpenAI a little bit too informal ... I don't mind
         telling the trainee what to do next, because it makes it more supportive and encouraging"):
         the professional voice of a CELTA candidate record. What happened comes only from the
         notes; what to try next may follow from them, in the supportive and direct voices. */
      var onSys = 'You help a CELTA tutor write the Overall comment on a trainee\'s teaching practice lesson from the rough notes the tutor wrote while watching it. '
        + 'The Overall comment is a short piece of prose: how the lesson went as a whole, what carried it, and what to take into the next lesson. '
        + 'Write it in a ' + onVoice + ' voice, in the clear, professional register of feedback written for a CELTA candidate record: natural and readable, never chatty or slangy, never stiff. '
        + 'Every observation must come from the notes: never add a strength, a problem, an event or a judgement the notes do not contain, and never give a grade or a standard. '
        + (onTone === 'own' ? 'Do not add advice the notes do not give. ' : 'You may say what the trainee could do next where it follows directly from a point in the notes. ')
        + 'Keep the tutor\'s own observations and words where you can; correct spelling and grammar; write shorthand out in full, except TTT, STT, CCQs and ICQs, which trainees know. '
        + 'Address the trainee as "you". No bullet points, no headings, no criterion codes. '
        + 'One or two paragraphs, about 80 to 150 words; shorter if the notes are short. American spelling. No names. '
        + celtaShorthand_()
        + 'Answer as JSON: {"text":"..."}.';
      var onResp = UrlFetchApp.fetch('https://api.openai.com/v1/chat/completions', {
        method: 'post', muteHttpExceptions: true, contentType: 'application/json', headers: { Authorization: 'Bearer ' + onKey },
        payload: JSON.stringify({ model: 'gpt-4.1', temperature: 0.4, response_format: { type: 'json_object' },
          messages: [{ role: 'system', content: onSys }, { role: 'user', content: (req.tp ? 'Lesson: ' + String(req.tp).slice(0, 20) + '\n' : '') + onNotes }] })
      });
      if (onResp.getResponseCode() !== 200) throw new Error('The comment could not be written (' + onResp.getResponseCode() + ')');
      var onOut = JSON.parse(JSON.parse(onResp.getContentText()).choices[0].message.content || '{}');
      return { text: String(onOut.text || '').trim().slice(0, 2000) };
    }
    case 'stage1Words': {
      requireTutor_(tutor);
      var swKey = PropertiesService.getScriptProperties().getProperty('OPENAI_KEY');
      if (!swKey) throw new Error('Rewording is not switched on');
      var swPts = function(a){ return (Array.isArray(a) ? a : []).slice(0, 30).map(function(x){
        return { text: String((x && x.text) || '').slice(0, 600), codes: (Array.isArray(x && x.codes) ? x.codes : []).map(String).slice(0, 4) }; }).filter(function(x){ return x.text; }); };
      var swIn = { strengths: swPts(req.strengths), actions: swPts(req.actions) };
      var swSys = 'You help a CELTA tutor write a trainee\'s Stage 1 record from the tutors\' feedback on the first two lessons. '
        + 'Say every point again in your own words, so it does not repeat the feedback writer\'s phrasing, but keep its meaning, its detail and its strength: '
        + 'a firm point stays firm, a mild one stays mild, and nothing a point names is lost (where, how much, what it led to). '
        + 'The clear, professional register of a CELTA candidate record: natural and readable, never chatty, never stiff or bureaucratic (not prior to, simultaneously, utilize, facilitate). '
        + 'Strengths: short phrases saying what the trainee did, no full stop, e.g. "Warm welcome and great rapport, with a relaxed atmosphere". '
        + 'Action points: imperatives addressed to the trainee, e.g. "Keep instructions short and demonstrate first". '
        + 'If two points say the same thing, join them into one and keep both codes. Keep each point\'s codes exactly as given; never add, change or guess a code. '
        + 'Write "students", never Ss. ' + celtaShorthand_()
        + 'In the points, write shorthand out in full, except TTT, STT, CCQs and ICQs, which trainees know. '
        + 'No praise that is not in the original, no grades, no names, no arrows. American spelling. '
        + 'Answer as JSON: {"strengths":[{"text":"...","codes":["1d"]}],"actions":[{"text":"...","codes":["5f"]}]}.';
      var swResp = UrlFetchApp.fetch('https://api.openai.com/v1/chat/completions', {
        method: 'post', muteHttpExceptions: true, contentType: 'application/json', headers: { Authorization: 'Bearer ' + swKey },
        payload: JSON.stringify({ model: 'gpt-4.1', temperature: 0.3, response_format: { type: 'json_object' },
          messages: [{ role: 'system', content: swSys }, { role: 'user', content: JSON.stringify(swIn) }] })
      });
      if (swResp.getResponseCode() !== 200) throw new Error('The points could not be reworded (' + swResp.getResponseCode() + ')');
      var swOut = JSON.parse(JSON.parse(swResp.getContentText()).choices[0].message.content || '{}');
      var swAllowed = {}; swIn.strengths.concat(swIn.actions).forEach(function(x){ x.codes.forEach(function(c){ swAllowed[c] = 1; }); });
      var swClean = function(a){ return (Array.isArray(a) ? a : []).map(function(x){
        return { text: String((x && x.text) || '').trim().slice(0, 400), codes: (Array.isArray(x && x.codes) ? x.codes : []).map(String).filter(function(c){ return swAllowed[c]; }) }; }).filter(function(x){ return x.text; }); };
      return { strengths: swClean(swOut.strengths), actions: swClean(swOut.actions) };
    }
    /* ---- IS IT THEIR OWN WORK? (25 Oct 2026) ------------------------------
       Ramy: "a deterrent against plagiarism ... anything to do with another
       assignment that was maybe written on Lite, like other courses ... scan
       anything that's been published online." Three passes, each a read, each
       pressed by a tutor and never run by itself:
         similar   every assignment ever submitted on Lite, this course first
                   (collusion) then every other (a previous candidate), by runs
                   of eight words; the other trainee is never named.
         webCheck  the six most distinctive sentences, each searched in quotes
                   through the Brave Search API (key in the properties).
         aiCheck   the pairs similar found, read by Claude for paraphrase.
       Nothing marks anything. On a demo course nothing leaves Lite. */
    case 'checksOn': {
      var cp = PropertiesService.getScriptProperties();
      return { web: !!cp.getProperty('BRAVE_KEY'), ai: !!cp.getProperty('CLAUDE_KEY') };
    }
    /* The web pass searches through the Brave Search API (25 Oct 2026): Google's
       Custom Search JSON API is closed to new customers and ends on 1 Jan 2027. */
    case 'setSearchKey': {
      requireOwner_(owner);
      var sp = PropertiesService.getScriptProperties(), sk = String(req.key || '').trim();
      if (sk) sp.setProperty('BRAVE_KEY', sk); else sp.deleteProperty('BRAVE_KEY');
      return { on: !!sk };
    }
    case 'setClaudeKey': {
      requireOwner_(owner);
      var ck2 = String(req.key || '').trim();
      if (ck2 && !/^sk-ant-/.test(ck2)) throw new Error('That does not look like a Claude API key');
      var cpp = PropertiesService.getScriptProperties();
      if (ck2) cpp.setProperty('CLAUDE_KEY', ck2); else cpp.deleteProperty('CLAUDE_KEY');
      return { on: !!ck2 };
    }
    case 'similar': {
      requireTutor_(tutor);
      if (!me) throw new Error('No token');
      return similar_(course, me.token, String(req.code || ''), String(req.round || 'sub1'));
    }
    case 'webCheck': {
      requireTutor_(tutor);
      if (!me) throw new Error('No token');
      var wset = courseRead_(course.id, 'settings') || {};
      if (wset.demoToday) throw new Error('Not on a demo course: nothing leaves Lite');
      return webCheck_(course, me.token, String(req.code || ''), String(req.round || 'sub1'));
    }
    case 'aiCheck': {
      requireTutor_(tutor);
      if (!me) throw new Error('No token');
      var aset = courseRead_(course.id, 'settings') || {};
      if (aset.demoToday) throw new Error('Not on a demo course: nothing leaves Lite');
      return aiCheck_(course, me.token, String(req.code || ''), String(req.round || 'sub1'));
    }
    case 'setOpenAiKey': {
      requireOwner_(owner);
      var oaKey = String(req.key || '').trim();
      if (oaKey && !/^sk-[A-Za-z0-9_\-]{20,}$/.test(oaKey)) throw new Error('That does not look like an OpenAI key');
      var oaProps = PropertiesService.getScriptProperties();
      if (oaKey) oaProps.setProperty('OPENAI_KEY', oaKey); else oaProps.deleteProperty('OPENAI_KEY');
      return { on: !!oaKey };
    }
    /* v95 (21 Oct 2026): a tutor sends a volunteer student their invitation.
       Ramy: "the course tutors can't invite volunteer Ss" -- the register only
       had "Copy their link", so a tutor pasted it into their own mail, which
       also showed the volunteer the tutor's address. Now the store sends it
       from lite@, in the centre's name, replies going to the center's
       volunteer contact and never to a tutor. One volunteer a call, only a
       row on this course's register, and not twice inside ten minutes. The
       address may come with the call (typed a moment ago, before the register
       has saved); it is written onto that row, so the register and the mail
       agree. A pinned demo course sends but writes nothing. */
    /* THE PRESENT (v151, 26 Oct 2026; Ramy: "how do they take this card?"). On the last page a trainee can have the
       CV present's card sent to themselves: to the address the centre has for them, or one they type. Only the
       trainee, only to themselves, never from a demo course, and not twice in ten minutes. The link it carries is
       public (cv/), so the email keeps working after the course link has gone. */
    case 'presentMail': {
      if (!me || tutor || assessor || vol) throw new Error('Only the trainee can send this to themselves');
      var pmSet = courseRead_(course.id, 'settings') || {};
      if (pmSet.demoToday) throw new Error('This is a demo course, so nothing is sent from it.');
      var pmTo = String(req.email || me.email || '').trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pmTo)) throw new Error('Type your email first');
      var pmProps = PropertiesService.getScriptProperties(), pmKey = 'presentMail:' + me.token;
      if (Date.now() - Number(pmProps.getProperty(pmKey) || 0) < 10 * 60 * 1000) throw new Error('Sent a few minutes ago. Check your inbox, and the spam folder, before sending again.');
      var pmEsc = function (x) { return String(x == null ? '' : x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
      var pmFirst = String(me.name || '').trim().split(/\s+/)[0];
      var pmUrl = SITE_ + 'cv/';
      var pmP = 'font:16px/1.6 Arial,Helvetica,sans-serif;color:#3d3020;margin:0 0 12px';
      var pmHtml = '<div style="max-width:560px">'
        + '<a href="' + pmUrl + '" style="display:block;text-decoration:none"><img src="' + pmUrl + 'share-card.jpg" width="560" alt="A present from Connect Lite: your teaching CV" style="display:block;width:100%;max-width:560px;height:auto;border:0;border-radius:14px"></a>'
        + '<div style="background:#E2C27E;border-radius:14px;padding:24px 26px;margin:14px 0 0">'
        + '<p style="font:500 26px/1.15 Georgia,serif;color:#2b2218;margin:0 0 12px">Well done' + (pmFirst ? ', ' + pmEsc(pmFirst) : '') + '.<br><i>Here’s to what comes next.</i></p>'
        + '<p style="' + pmP + '">You’ve finished the course. Wherever you teach next, we hope it goes brilliantly.</p>'
        + '<p style="' + pmP + '">Your present: a modern teaching CV and cover letter, shaped for where you are in teaching and where you’re applying.</p>'
        + '<p style="margin:18px 0 6px"><a href="' + pmUrl + '" style="display:inline-block;padding:13px 22px;background:#1E3B2F;color:#ffffff;text-decoration:none;border-radius:10px;font:bold 16px Arial,Helvetica,sans-serif">Build your CV</a></p>'
        + '<p style="font:13px/1.5 Arial,Helvetica,sans-serif;color:#4a3a22;margin:0">lite.celtaconnect.com/cv</p></div>'
        + '<p style="font:15px/1.6 Arial,Helvetica,sans-serif;color:#444;margin:20px 0 10px">The link stays open: come back whenever you apply somewhere new, change what you need, and download a fresh copy. Nothing you type is sent to us.</p>'
        + '<p style="font:15px/1.6 Arial,Helvetica,sans-serif;color:#444;margin:0">Good luck, from all of us at Connect Lite.</p>'
        + '</div>';   /* no credit line: the picture carries the mark and the sign-off says who it is from (Ramy, 26 Oct 2026: "overkill") */
      var pmText = 'Well done' + (pmFirst ? ', ' + pmFirst : '') + '. Here’s to what comes next.\n\nYou’ve finished the course. Wherever you teach next, we hope it goes brilliantly.\n\nYour present: a modern teaching CV and cover letter, shaped for where you are in teaching and where you’re applying.\n\nBuild your CV: ' + pmUrl + '\n\nThe link stays open: come back whenever you apply somewhere new. Nothing you type is sent to us.\n\nGood luck, from all of us at Connect Lite.';
      sendAs_({ to: pmTo, subject: 'A present from Connect Lite: your teaching CV', htmlBody: pmHtml, body: pmText, name: 'Connect Lite' });
      pmProps.setProperty(pmKey, String(Date.now()));
      return { to: pmTo };
    }
    case 'volunteerInvite': {
      requireTutor_(tutor);
      var viTok = String(req.v || '');
      var viOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      var viSet = courseRead_(course.id, 'settings') || {};
      var viReg = courseRead_(course.id, 'volunteers') || {};
      var viRow = (viReg.students || []).filter(function (s) { return s && s.token === viTok; })[0];
      if (!viRow) throw new Error('That student is not on this course\u2019s register yet. Wait for \u201cSaved\u201d, then send.');
      var viTo = String(req.email || viRow.email || '').trim();
      if (!viOk.test(viTo)) throw new Error('Type their email first');
      if (viRow.invited && (new Date().getTime() - new Date(viRow.invited).getTime()) < 10 * 60 * 1000) throw new Error('Sent a few minutes ago. Give it a little while before sending again.');
      var viCentre = viSet.centreName || 'Connect Lite';
      var viContact = (viSet.volunteerContact && viOk.test(viSet.volunteerContact.email || '')) ? viSet.volunteerContact : null;
      var viLink = SITE_ + 'invite.html?v=' + encodeURIComponent(viTok);
      var viEsc = function (x) { return String(x == null ? '' : x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
      var viFirst = String(viRow.name || '').trim().split(/\s+/)[0];
      var viP = 'font:16px/1.55 Arial,Helvetica,sans-serif;color:#232220;margin:0 0 14px';
      var viHtml = '<div style="max-width:520px">'
        + '<p style="' + viP + '">' + (viFirst ? 'Hello ' + viEsc(viFirst) + ',' : 'Hello,') + '</p>'
        + '<p style="' + viP + '">Thank you for coming to our English classes at ' + viEsc(viCentre) + '. Your teachers are trainee teachers on our CELTA course, and experienced tutors watch every lesson.</p>'
        + '<p style="' + viP + '">Here is your page for the classes. On it you\u2019ll find your next class, the days you came, and your certificate at the end. You can also tell us whether you\u2019re coming.</p>'
        + '<p style="margin:22px 0"><a href="' + viLink + '" style="display:inline-block;padding:13px 22px;background:#1E3B2F;color:#ffffff;text-decoration:none;border-radius:10px;font:bold 16px Arial,Helvetica,sans-serif">Open my page</a></p>'
        + '<p style="' + viP + '"><b>This link is just for you.</b> Keep it on your phone, your laptop, or both, and open it before each class.</p>'
        + (viContact ? '<p style="font:14px/1.5 Arial,Helvetica,sans-serif;color:#555;margin:22px 0 0">Questions? Reply to this email and it reaches ' + viEsc(viContact.name || viCentre) + '.</p>' : '')
        /* signed by the center (Ramy, 29 Oct 2026: "we should sign it off") */
        + '<p style="' + viP + '">See you in class,<br>The CELTA team at ' + viEsc(viCentre) + '</p>'
        + '</div>';
      var viText = (viFirst ? 'Hello ' + viFirst + ',' : 'Hello,') + '\n\nThank you for coming to our English classes at ' + viCentre + '. Your teachers are trainee teachers on our CELTA course, and experienced tutors watch every lesson.'
        + '\n\nHere is your page for the classes: ' + viLink + '\nOn it you\u2019ll find your next class, the days you came, and your certificate at the end. You can also tell us whether you\u2019re coming.'
        + '\n\nThis link is just for you. Keep it on your phone, your laptop, or both, and open it before each class.'
        + (viContact ? '\n\nQuestions? Reply to this email and it reaches ' + (viContact.name || viCentre) + '.' : '')
        + '\n\nSee you in class,\nThe CELTA team at ' + viCentre;
      var viMsg = { to: viTo, subject: 'Your English classes at ' + viCentre, htmlBody: viHtml, body: viText, name: viCentre };
      if (viContact) viMsg.replyTo = viContact.email;
      sendAs_(viMsg);
      var viAt = new Date().toISOString();
      if (!viSet.demoToday) {
        courseUpdateObj_(course.id, 'volunteers', function (reg) {
          (reg.students || []).forEach(function (s) { if (s && s.token === viTok) { s.invited = viAt; s.email = viTo; } });
          return reg;
        });
      }
      return { invited: viAt, to: viTo };
    }
    /* FROM YOUR CLASSES (v136, 26 Oct 2026; Ramy: "we need to give them something"). The language each lesson
       taught, as flip cards for a volunteer to practise at home: lessons at THEIR level, on days that have come.
       A trainee's plan is never sent. Out of its language analysis come only the learner's side of it: a word,
       what it means and how it is said; or a lesson's example sentences and what they mean. No CCQs, no
       problems, no procedure, no notes, and the teacher's first name only. */
    case 'volunteerCards': {
      if (!vol) throw new Error('Volunteer students only');
      var vcSet = courseRead_(course.id, 'settings') || {};
      var vcTz = vcSet.timeZone || 'Europe/London';
      var vcToday = courseDay_(vcSet) || Utilities.formatDate(new Date(), vcTz, 'yyyy-MM-dd');
      var cefr = function (x) { var m = String(x || '').match(/\b([ABC][12])\b/i); return m ? m[1].toUpperCase() : String(x || '').trim().toLowerCase(); };
      var vcLevel = cefr(vol.level);
      if (!vcLevel) return { today: vcToday, classes: [] };
      /* v150 (Ramy, 26 Oct 2026: "really worried about this taking things from the trainees plan, because sometimes it's
         wrong"): nothing of a trainee's plan reaches a volunteer any more. Only each plan's level is read, to find the
         library set a lesson was taught from; the day's words now come from our own library (Build up your vocab). */
      var lvlOf = {};
      rosterWithRecords_(course.id, { tpHistory: true, plan: true }).forEach(function (t) {
        var R = t.records || {}, docs = {};
        Object.keys(R.tpHistory || {}).forEach(function (k) { var h = R.tpHistory[k]; if (h && h.state && h.state.doc) docs[k] = h.state.doc; });
        if (R.plan && R.plan.state && R.plan.state.meta && !docs[R.plan.state.meta.tp]) docs[R.plan.state.meta.tp] = R.plan.state;
        Object.keys(docs).forEach(function (k) { var m = (docs[k] || {}).meta || {}; if (m.level) lvlOf[t.token + '|' + k] = cefr(m.level); });
      });
      /* HOMEWORK: each lesson taught that day at this level, from the course's TP points. The trainee who taught it
         is found from the TP points (group, token, TP number), the day from the timetable (the TP number and which
         set of the group teaches that day), the level from the library set the group uses. */
      var hwByDay = {};
      var tpp = courseRead_(course.id, 'tppoints') || {};
      var ttb = courseRead_(course.id, 'timetable') || {};
      var libs = (tpp.set && tpp.set.library) || {}, setFor = (tpp.set && tpp.set.setFor) || {};
      var firsts = {}; roster_(course.id).forEach(function (t) { firsts[t.token] = String(t.name || '').split(/\s+/)[0]; });
      var hwMaps = {}, vbMaps = {}, vbByDay = {};
      Object.keys(tpp.groups || {}).forEach(function (g) {
        var halves = (tpp.sets && tpp.sets[g]) || [];
        Object.keys(tpp.groups[g] || {}).forEach(function (tok) {
          var si = 0; halves.forEach(function (arr, ix) { if ((arr || []).indexOf(tok) >= 0) si = ix; });
          var recs = tpp.groups[g][tok] || {};
          Object.keys(recs).forEach(function (tk) {
            var m = /^tp(\d+)$/.exec(tk), x = recs[tk];
            if (!m || !x || !x.from) return;
            /* The group's set, unless the trainee planned this lesson at another level (a class can change level
               partway through a course): then the set that has this lesson, of this kind, at that level. */
            var sid = setFor[g], want = lvlOf[tok + '|' + m[1]];
            if (want && !(libs[sid] && cefr(libs[sid].level) === want)) {
              var par = String(x.from).split('\u00b7');
              var alt = Object.keys(libs).filter(function (id) {
                var L2 = libs[id], ses = L2 && L2.sessions && L2.sessions[par[0]], sl = ses && ses.slots && ses.slots[(+par[1] || 1) - 1];
                return L2 && cefr(L2.level) === want && sl && String(sl.type || '') === String(x.aim || '');
              })[0];
              if (alt) sid = alt;
            }
            var L = sid && libs[sid];
            if (!L || cefr(L.level) !== vcLevel) return;
            var hwMap = hwMaps[sid] || (hwMaps[sid] = courseRead_('_defaults', 'homework:' + sid) || {});
            var vbMap = vbMaps[sid] || (vbMaps[sid] = courseRead_('_defaults', 'vocab:' + sid) || {});
            if (!hwMap[x.from] && !vbMap[x.from]) return;
            var day = (ttb.days || []).filter(function (d) { return d && d.date && d.tp && String(d.tp) === m[1] && (d.setIndex || 0) === si; })[0];
            if (!day || String(day.date) > vcToday) return;
            if (hwMap[x.from]) (hwByDay[day.date] = hwByDay[day.date] || []).push({ by: firsts[tok] || '', from: x.from, aim: String(x.aim || ''), hw: hwMap[x.from] });
            if (vbMap[x.from]) (vbByDay[day.date] = vbByDay[day.date] || []).push({ from: x.from, words: vbMap[x.from] });
          });
        });
      });
      /* v146: today's Self-study is released when the day's TP is over (Ramy, 26 Oct 2026: "released at the end of
         the TP day, depending how many TPs are per day"): the end of the day's last TP lesson, however many there are,
         from that day's own sessions, else from the timetable's TP slots. The demo's clock is a date, so it shows at once.
         v147: today's words (the flip cards) wait for the same moment ("words cards wait for the end of TP too"). */
      if (!courseDay_(vcSet) && (hwByDay[vcToday] || vbByDay[vcToday])) {
        var hwDay = (ttb.days || []).filter(function (d) { return d && d.date === vcToday; })[0];
        var hwEnds = ((hwDay && hwDay.sessions) || []).filter(function (s) { return s && s.e && (s.k === 'tp' || s.room === 'Teaching practice'); }).map(function (s) { return String(s.e); });
        if (!hwEnds.length) hwEnds = (ttb.slots || []).filter(function (x) { return x && x.kind === 'tp' && x.to; }).map(function (x) { return String(x.to); });
        var hwOpen = hwEnds.sort().pop();
        if (hwOpen && Utilities.formatDate(new Date(), vcTz, 'HH:mm') < hwOpen) { delete hwByDay[vcToday]; delete vbByDay[vcToday]; }
      }
      /* BUILD UP YOUR VOCAB (v150): ten words a day, taken in turn from each of the day's lessons (4, 3, 3 on a
         three-lesson day), each lesson's words written by us from its coursebook pages, with our own meaning and example. */
      var vbDay = function (d) {
        var ls = (vbByDay[d] || []).sort(function (a, b) { return a.from < b.from ? -1 : 1; }), out = [], seen = {};
        for (var r = 0; out.length < 10 && r < 12; r++) ls.forEach(function (l) {
          var w = (l.words || [])[r];
          if (w && w.w && !seen[String(w.w).toLowerCase()] && out.length < 10) { seen[String(w.w).toLowerCase()] = 1; out.push({ w: String(w.w), def: String(w.def || ''), ex: String(w.ex || ''), from: l.from }); }
        });
        return out;
      };
      var allDays = {}; Object.keys(vbByDay).forEach(function (d) { allDays[d] = 1; }); Object.keys(hwByDay).forEach(function (d) { allDays[d] = 1; });
      var vcDays = Object.keys(allDays).sort().reverse().slice(0, 20);
      return { today: vcToday, classes: vcDays.map(function (d) {
        var hws = (hwByDay[d] || []).sort(function (a, b) { return a.from < b.from ? -1 : 1; });
        return { date: d, vocab: vbDay(d), homework: hws };
      }) };
    }
    case 'volunteerAgree': {
      if (!vol) throw new Error('Only a volunteer student can agree for themselves');
      /* The moment is the browser's; the store only refuses nonsense. Written
         once: a second click, or a second device, never moves the date. */
      var agAt = String(req.at || '');
      if (!/^\d{4}-\d{2}-\d{2}T/.test(agAt)) agAt = new Date().toISOString();
      var agTok = vol.token;
      var agReg = courseUpdateObj_(course.id, 'volunteers', function (reg) {
        (reg.students || []).forEach(function (s) { if (s && s.token === agTok) { if (!s.agreed) s.agreed = agAt; if (req.lang) s.lang = String(req.lang).slice(0, 5); } });
        return reg;
      });
      var agRow = (agReg.students || []).filter(function (s) { return s && s.token === agTok; })[0] || {};
      return { agreed: agRow.agreed || '' };
    }
    /* v56 (1 Oct 2026): a volunteer answers a reminder -- "are you coming?" --
       for one day, yes or no; and may turn the mail off. Both touch their own
       row and nothing else. */
    case 'volunteerReply': {
      if (!vol) throw new Error('Only a volunteer student can answer for themselves');
      var rDay = String(req.day || ''), rComing = String(req.coming || '');
      if (!/^\d{4}-\d{2}-\d{2}$/.test(rDay)) throw new Error('Which day?');
      if (rComing !== 'yes' && rComing !== 'no') throw new Error('yes or no');
      var rTok = vol.token, rAt = new Date().toISOString();
      var rReg = courseUpdateObj_(course.id, 'volunteers', function (reg) {
        (reg.students || []).forEach(function (s) { if (s && s.token === rTok) { s.replies = s.replies || {}; s.replies[rDay] = { coming: rComing, at: rAt }; } });
        return reg;
      });
      var rRow = (rReg.students || []).filter(function (s) { return s && s.token === rTok; })[0] || {};
      return { replies: rRow.replies || {}, coming: comingFor_(course.id) };
    }
    case 'volunteerNotify': {
      if (!vol) throw new Error('Only a volunteer student can say this for themselves');
      var nOn = !!req.on, nTok = vol.token;
      courseUpdateObj_(course.id, 'volunteers', function (reg) {
        (reg.students || []).forEach(function (s) { if (s && s.token === nTok) s.notify = nOn; });
        return reg;
      });
      return { notify: nOn };
    }
    case 'unshareMaterial': {
      if (!course) throw new Error('This link is not on a course');
      if (!tutor && !me) throw new Error('Only a trainee or a tutor can unshare');
      var rmId = String(req.id || '');
      return { shared: courseUpdate_(course.id, 'shared', function (list) {
        return list.filter(function (x) {
          if (!x || x.id !== rmId) return true;
          /* A trainee takes back their own; a tutor may take back any. */
          if (tutor) return false;
          return String(x.by || '') !== String((me && me.name) || '');
        });
      }) };
    }
    /* END-OF-COURSE FEEDBACK (v96, 23 Oct 2026). Ramy: a short form at the end
       of the course -- the course, the tutors, the workload, the centre's
       support, the platform, anything else. ANONYMOUS unless the trainee
       chooses otherwise ("should be a choice"): each answer is appended to one
       course-level list carrying the day only, no token, and a name only when
       the trainee ticked to add it. Their own record remembers THAT they
       answered, never what, so nobody answers twice. The tutors read the list
       (boot and course, tutor only); a trainee and the assessor never do. */
    case 'courseFeedback': {
      if (!me || tutor || assessor) throw new Error('Only a trainee answers the course feedback');
      if (read_(course.id, me.token, 'courseFeedbackSent')) return { sent: true, already: true };
      var fa = (req.answers && typeof req.answers === 'object') ? req.answers : {};
      var fclean = {};
      Object.keys(fa).slice(0, 24).forEach(function (q) { fclean[String(q).slice(0, 40)] = String(fa[q] == null ? '' : fa[q]).slice(0, 3000); });
      var fentry = { day: Utilities.formatDate(new Date(), 'UTC', 'yyyy-MM-dd'), answers: fclean };
      if (req.named === true) fentry.name = String(me.name || '').slice(0, 120);
      courseUpdate_(course.id, 'courseFeedback', function (list) { list.push(fentry); return list; });
      write_(course.id, me.token, 'courseFeedbackSent', { at: new Date().toISOString() });
      return { sent: true };
    }
    /* The answers, sent to the centre (v96, 23 Oct 2026). Ramy: "we need to
       be able to either download them or email them to the center. Or
       both." The tutors' page builds the summary and the spreadsheet from
       the answers it already holds; this sends them, to ONE address, from
       Lite's own address, with the spreadsheet attached. */
    case 'mailCourseFeedback': {
      requireTutor_(tutor);
      var mto = String(req.to || '').trim();
      if (!/^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(mto)) throw new Error('That is not an email address');
      var msubj = String(req.subject || 'Course feedback').slice(0, 200);
      var mbody = String(req.body || '').slice(0, 20000);
      var mcsv = String(req.csv || '');
      if (mcsv.length > 400000) throw new Error('The spreadsheet is too large to send');
      var mmsg = { to: mto, subject: msubj, body: mbody, name: 'Connect Lite' };
      if (mcsv) mmsg.attachments = [Utilities.newBlob(mcsv, 'text/csv', String(req.filename || 'course-feedback.csv').replace(/[^\w .-]+/g, '').slice(0, 80) || 'course-feedback.csv')];
      sendAs_(mmsg);
      return { sent: true, to: mto };
    }
    case 'post': {
      requireTutor_(tutor);
      var ptext = String(req.text || '').trim();
      if (!ptext) throw new Error('Nothing to post');
      if (ptext.length > 2000) throw new Error('A post is at most 2000 characters');
      var post = { id: newKey_().slice(0, 12), at: pinnedAt_(course, req.at), by: String(req.by || '').slice(0, 80), to: String(req.to || '').slice(0, 12), text: ptext };
      // An optional 'by when' (28 Sep 2026): a reminder the pages count down;
      // the post stays at the top of a candidate's stream until it passes.
      if (req.due) post.due = String(req.due).slice(0, 40);
            /* v73 (6 Oct 2026): a post may be written to go out later. `publishAt`
         is when; until then streamFor_ keeps it out of every candidate's
         boot. A date already gone means now. */
      if (req.publishAt && /^\d{4}-\d{2}-\d{2}T/.test(String(req.publishAt))) {
        var pAt = new Date(String(req.publishAt));
        if (!isNaN(pAt.getTime()) && pAt.getTime() > Date.now()) post.publishAt = pAt.toISOString();
      }
      var after = courseUpdate_(course.id, 'stream', function (list) { list.push(post); return list.length > 200 ? list.slice(list.length - 200) : list; });
      return { posted: post, stream: after };
    }
    // ---- the TP7-TP8 planning grid (28 Sep 2026) ---------------------------
    // Ramy: the last two teaching practices are the candidates' own to plan;
    // "they fill it out... everyone should be able to see it", but not until
    // "the MCT releases it". One course-level object, kind 'grid':
    // { rows: { <token>: { tp7: {main, sub, material, at}, tp8: {...} } },
    //   released: { <group>: true } }. A candidate writes their own row only;
    // a tutor any row, and releases per group. Written a row at a time under
    // the lock. What a CANDIDATE reads back never carries a token: gridFor_
    // hands them their group's rows by name, and nothing at all before the
    // release.
    case 'gridSet': {
      if (!tutor && !me) throw new Error('Not yours to write');
      var gtok = tutor ? String(req.token || '') : me.token;
      if (!gtok) throw new Error('Which candidate?');
      if (!tutor && gtok !== me.token) throw new Error('Not yours to write');
      var gtp = String(req.tp || ''); if (!/^\d{1,2}$/.test(gtp)) throw new Error('Which teaching practice?');
      var grow = { main: String(req.main || '').slice(0, 40), sub: String(req.sub || '').slice(0, 40), material: String(req.material || '').slice(0, 300), at: pinnedAt_(course, req.at) };
      var gnext = courseUpdateObj_(course.id, 'grid', function (g) { g.rows = g.rows || {}; g.rows[gtok] = g.rows[gtok] || {}; g.rows[gtok]['tp' + gtp] = grow; return g; });
      return { saved: true, grid: gridFor_(course, gnext, reader, me) };
    }
    case 'gridRelease': {
      requireTutor_(tutor);
      var ggrp = String(req.group || ''), gon = !!req.released;
      // An optional 'fill in by' date rides with the release (28 Sep 2026); a
      // reminder the pages show, never a lock. Unreleasing keeps it.
      var gdue = req.due === undefined ? undefined : String(req.due || '').slice(0, 40);
      var gnext2 = courseUpdateObj_(course.id, 'grid', function (g) { g.released = g.released || {}; g.due = g.due || {}; if (gon) g.released[ggrp] = true; else delete g.released[ggrp]; if (gdue !== undefined) { if (gdue) g.due[ggrp] = gdue; else delete g.due[ggrp]; } return g; });
      return { saved: true, grid: gridFor_(course, gnext2, true, null) };
    }    /* v73: a held-back post (scheduled, or carried from the last course by
       cloneCourse) is posted now, or given a date. publishAt '' means now:
       the post is stamped afresh so it reads as posted today. */
    case 'postAt': {
      requireTutor_(tutor);
      var paId = String(req.id || '');
      var paWhen = '';
      if (req.publishAt && /^\d{4}-\d{2}-\d{2}T/.test(String(req.publishAt))) {
        var paD = new Date(String(req.publishAt));
        if (!isNaN(paD.getTime()) && paD.getTime() > Date.now()) paWhen = paD.toISOString();
      }
      var paList = courseUpdate_(course.id, 'stream', function (list) {
        return list.map(function (p) {
          if (!p || String(p.id) !== paId) return p;
          delete p.draft;
          if (paWhen) { p.publishAt = paWhen; } else { delete p.publishAt; p.at = new Date().toISOString(); }
          return p;
        });
      });
      return { saved: true, stream: paList };
    }
    case 'unpost': {
      requireTutor_(tutor);
      var pid = String(req.id || '');
      var left = courseUpdate_(course.id, 'stream', function (list) { return list.filter(function (p) { return p && String(p.id) !== pid; }); });
      return { removed: true, stream: left };
    }

    // ---- roster, tutors and the assessor ----------------------------------
    case 'roster': {
      if (!reader) throw new Error('Tutors only');
      var rl = withoutEmails_(rosterWithRecords_(course.id, TUTOR_WRITES), assessor);
      if (assessor) rl.forEach(function (t) { if (t && t.records) delete t.records.about; });   /* v180: see boot */
      return { trainees: rl };
    }
    case 'addTrainee': {
      requireTutor_(tutor);
      var name = String(req.name || '').trim(), group = String(req.group || '').trim(), email = cleanEmail_(req.email);
      if (!name) throw new Error('A name is needed');
      var token = Utilities.getUuid().replace(/-/g, '').slice(0, 20);
      if (email) emailHeader_();
      sheet_(SHEET_TRAINEES).appendRow([course.id, token, name, group, new Date(), email]);
      // The refreshed roster rides back, so the screen repaints from this one
      // answer instead of asking again -- two round trips per trainee added.
      return { token: token, name: name, group: group, email: email, trainees: rosterWithRecords_(course.id, TUTOR_WRITES) };
    }
    /* A pasted class list, in ONE call. It used to go one name per call, each
       awaited, so a list of twelve was twelve round trips one after another --
       minutes of "Adding 4 of 12...". One appendRows instead, and the roster
       comes back with it. Bad rows are reported, not thrown: a typo on line
       nine should not lose the other eleven. */
    case 'addTrainees': {
      requireTutor_(tutor);
      var list = Array.isArray(req.trainees) ? req.trainees : [];
      if (!list.length) throw new Error('No names to add');
      if (list.length > 200) throw new Error('Too many at once -- 200 is the limit');
      var rows = [], added = [], skipped = [];
      list.forEach(function (row, i) {
        var nm = String((row && row.name) || '').trim();
        var gp = String((row && row.group) || '').trim();
        if (!nm) { skipped.push('line ' + (i + 1) + ': no name'); return; }
        var em = '';
        try { em = cleanEmail_(row && row.email); } catch (e) { skipped.push('line ' + (i + 1) + ': ' + e.message); return; }
        var tk = Utilities.getUuid().replace(/-/g, '').slice(0, 20);
        rows.push([course.id, tk, nm, gp, new Date(), em]);
        added.push(nm);
      });
      if (rows.length) {
        var tsh = sheet_(SHEET_TRAINEES);
        if (rows.some(function (r) { return r[5]; })) emailHeader_();
        tsh.getRange(tsh.getLastRow() + 1, 1, rows.length, 6).setValues(rows);
      }
      return { added: added.length, skipped: skipped, trainees: rosterWithRecords_(course.id, TUTOR_WRITES) };
    }
    /* A CENTER'S FOLDER, ONE SUBFOLDER PER TRAINEE (v170, 27 Oct 2026). Ramy: "they link it to a folder with the
       different subfolders for the trainees ... could be pushed automatically into their own folders on Lite."
       Tutors only, and it reads names alone: the folders directly inside the one linked, with their links. Never a
       file, never a file's contents, and nothing is copied or kept here -- Course admin matches the names to the
       roster and files each link in that trainee's staff file. Lite sees only what is shared with its account. */
    case 'folderTrainees': {
      requireTutor_(tutor);
      var ftUrl = String(req.url || '');
      var ftId = (ftUrl.match(/\/folders\/([A-Za-z0-9_-]{10,})/) || ftUrl.match(/[?&]id=([A-Za-z0-9_-]{10,})/) || [])[1];
      if (!ftId) throw new Error('That is not a link to a Drive folder');
      var ftFolder = null;
      try { ftFolder = DriveApp.getFolderById(ftId); ftFolder.getName(); } catch (e) { throw new Error('Lite cannot see inside that folder. Share it so anyone with the link can view, then try again.'); }
      var ftOut = [], ftIt = ftFolder.getFolders();
      while (ftIt.hasNext() && ftOut.length < 200) { var ftF = ftIt.next(); ftOut.push({ name: ftF.getName(), url: ftF.getUrl() }); }
      ftOut.sort(function (a, b) { return a.name.localeCompare(b.name); });
      return { folder: ftFolder.getName(), folders: ftOut };
    }
    case 'renameTrainee': {
      requireTutor_(tutor);
      var sh2 = sheet_(SHEET_TRAINEES);
      var rows = sh2.getDataRange().getValues();
      for (var i = 1; i < rows.length; i++) if (String(rows[i][0]) === course.id && String(rows[i][1]) === String(req.token)) {
        if (req.name != null) sh2.getRange(i + 1, 3).setValue(String(req.name).trim());
        if (req.group != null) sh2.getRange(i + 1, 4).setValue(String(req.group).trim());
        if (req.email != null) { var em2 = cleanEmail_(req.email); if (em2) emailHeader_(); sh2.getRange(i + 1, 6).setValue(em2); }
        return { saved: true, trainees: rosterWithRecords_(course.id, TUTOR_WRITES) };
      }
      throw new Error('No such trainee');
    }
    case 'removeTrainee': {
      requireTutor_(tutor);
      var removed = deleteRowsWhere_(SHEET_TRAINEES, function (r) { return String(r[0]) === course.id && String(r[1]) === String(req.token); });
      if (!removed) throw new Error('No such trainee');
      try { courseUpdateObj_(course.id, 'folpool', function (pl) { delete pl[String(req.token)]; return pl; }); } catch (e) {} try { courseUpdateObj_(course.id, 'folprofiles', function (pl) { delete pl[String(req.token)]; return pl; }); } catch (e) {}
      return { removed: true, trainees: rosterWithRecords_(course.id, TUTOR_WRITES) };
    }
    default: throw new Error('Unknown op: ' + op);
  }
}

// ---- the migration ----------------------------------------------------------
// Runs once, on the first request after this version is deployed, and is a
// no-op afterwards. It gives every existing row a course, and turns the two
// script-property keys into that course's own keys, so the links in
// circulation keep working and nothing has to be re-issued.
function migrate_() {
  var props = PropertiesService.getScriptProperties();
  var schema = Number(props.getProperty('SCHEMA') || 0);
  if (schema >= 3) return;
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    schema = Number(props.getProperty('SCHEMA') || 0);
    if (schema >= 3) return;
    var ss = spreadsheet_();

    // ---- to 2: a courses sheet, and a course stamped on every existing row ----
    if (schema < 2) {
      var cs2 = sheet_(SHEET_COURSES);
      var id = 'c1';
      if (cs2.getLastRow() < 2) {
        // Only an upgrade from the single-course store seeds a first course; a
        // brand new store starts empty and is provisioned deliberately.
        var legacy = props.getProperty('TUTOR_KEY');
        if (legacy) {
          var nm = '';
          var old = ss.getSheetByName(SHEET_COURSE);
          if (old && old.getLastRow() >= 2 && String(old.getRange(1, 1).getValue()) === 'kind') {
            var orows = old.getRange(2, 1, old.getLastRow() - 1, 2).getValues();
            for (var o = 0; o < orows.length; o++) if (String(orows[o][0]) === 'settings') {
              try { nm = (JSON.parse(orows[o][1]) || {}).courseName || ''; } catch (e) {}
            }
          }
          cs2.appendRow([id, nm, new Date()]);
          props.setProperty(keyProp_('tutor', id), legacy);
          props.setProperty(keyProp_('assessor', id), props.getProperty('ASSESSOR_KEY') || newKey_());
        }
      } else {
        id = String(cs2.getRange(2, 1).getValue());
      }
      if (cs2.getLastRow() >= 2) {
        [SHEET_RECORDS, SHEET_TRAINEES, SHEET_COURSE].forEach(function (name) {
          var sh = ss.getSheetByName(name);
          if (!sh) return;                                                 // sheet_() will make it in the new shape
          if (String(sh.getRange(1, 1).getValue()) === 'course') return;   // already stamped
          sh.insertColumnBefore(1);
          sh.getRange(1, 1).setValue('course').setFontWeight('bold');
          var last = sh.getLastRow();
          if (last >= 2) sh.getRange(2, 1, last - 1, 1).setValue(id);
        });
      }
    }

    // ---- to 3: the keys leave the Sheet ---------------------------------------
    // They were on the courses sheet for one deployment on 21 Sep. The Sheet is
    // backed up nightly and can be shared, so a key in it is a key in every
    // copy; they belong in this script's properties. Any key found here is
    // moved and the columns are dropped.
    var cs = ss.getSheetByName(SHEET_COURSES);
    if (cs && cs.getLastColumn() > 0) {
      var hdr = cs.getRange(1, 1, 1, cs.getLastColumn()).getValues()[0].map(String);
      var ti = hdr.indexOf('tutorKey'), ai = hdr.indexOf('assessorKey');
      if (ti > -1 || ai > -1) {
        var last2 = cs.getLastRow();
        if (last2 >= 2) {
          cs.getRange(2, 1, last2 - 1, hdr.length).getValues().forEach(function (r) {
            var cid = String(r[0]).trim();
            if (!cid) return;
            if (ti > -1 && String(r[ti]).trim()) props.setProperty(keyProp_('tutor', cid), String(r[ti]).trim());
            if (ai > -1 && String(r[ai]).trim()) props.setProperty(keyProp_('assessor', cid), String(r[ai]).trim());
          });
        }
        [ai, ti].filter(function (i) { return i > -1; })
                .sort(function (a, b) { return b - a; })
                .forEach(function (i) { cs.deleteColumn(i + 1); });
      }
    }

    // the single-course leftovers, now duplicated per course
    props.deleteProperty('TUTOR_KEY');
    props.deleteProperty('ASSESSOR_KEY');
    props.setProperty('SCHEMA', '3');
  } finally { lock.releaseLock(); }
}

// ---- courses ----------------------------------------------------------------
function newKey_() { return Utilities.getUuid().replace(/-/g, '').slice(0, 24); }
/* The courses that exist. A course in the bin (v122, 25 Oct 2026: column D
   carries the moment it was deleted) is left out unless asked for, so its keys
   open nothing, the console and the pulse do not list it, the reports and
   reminders skip it, and its id is still taken. */
function courses_(withDeleted) {
  var sh = sheet_(SHEET_COURSES);
  var last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2, 1, last - 1, 4).getValues().filter(function (r) { return String(r[0]).trim(); })
    .map(function (r) { return { id: String(r[0]), name: String(r[1]), created: r[2] ? new Date(r[2]).toISOString() : '', deleted: r[3] ? new Date(r[3]).toISOString() : '' }; })
    .filter(function (c) { return withDeleted || !c.deleted; });
}
// A course's two secrets, in the script's properties rather than the Sheet.
function keyProp_(kind, courseId) { return 'KEY_' + String(kind).toUpperCase() + '_' + courseId; }
function courseKey_(kind, courseId) {
  var props = PropertiesService.getScriptProperties();
  var name = keyProp_(kind, courseId);
  var v = props.getProperty(name);
  if (!v) { v = newKey_(); props.setProperty(name, v); }
  return v;
}
// Which course does this key open? Read every property once and compare.
function courseByKey_(kind, value) {
  value = String(value || '').trim();
  if (!value) return null;
  var all = PropertiesService.getScriptProperties().getProperties();
  var list = courses_();
  for (var i = 0; i < list.length; i++) if (all[keyProp_(kind, list[i].id)] === value) return list[i];
  return null;
}
function courseById_(id) {
  return courses_().filter(function (c) { return c.id === String(id); })[0] || null;
}
function setCourseField_(id, field, value) {
  var col = { name: 2, deleted: 4 }[field];
  if (!col) throw new Error('Not a course field: ' + field);
  var sh = sheet_(SHEET_COURSES);
  // a sheet made before v122 has no header in D; the first bin sets it
  if (col === 4 && !String(sh.getRange(1, 4).getValue() || '')) sh.getRange(1, 4).setValue('deleted').setFontWeight('bold');
  var rows = sh.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) if (String(rows[i][0]) === String(id)) { sh.getRange(i + 1, col).setValue(value); return; }
  throw new Error('No such course');
}

// ---- storage ----------------------------------------------------------------
var HEADERS = {};
HEADERS[SHEET_COURSES]  = ['id', 'name', 'created', 'deleted'];
HEADERS[SHEET_RECORDS]  = ['course', 'token', 'kind', 'json', 'updated'];
HEADERS[SHEET_TRAINEES] = ['course', 'token', 'name', 'group', 'created', 'email'];
/* v53 (1 Oct 2026): a candidate may carry an email, column F. A sheet made
   before v53 has no header there, so the first write of an address sets it. */
function emailHeader_() {
  var sh = sheet_(SHEET_TRAINEES);
  if (!String(sh.getRange(1, 6).getValue() || '')) sh.getRange(1, 6).setValue('email').setFontWeight('bold');
}
function cleanEmail_(e) {
  e = String(e == null ? '' : e).trim();
  if (e && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) throw new Error('Not an email address: ' + e);
  return e;
}
HEADERS[SHEET_COURSE]   = ['course', 'kind', 'json', 'updated'];
HEADERS[SHEET_FEEDBACK] = ['at', 'page', 'course', 'role', 'thumb', 'text'];
HEADERS[SHEET_OFFERS]   = ['at', 'by', 'book', 'level', 'lessons', 'stages', 'centre', 'file', 'state', 'course', 'note'];   /* course + note (v183, 30 Oct 2026): where an offer came from, and Connect's question */
HEADERS[SHEET_REPORTS]  = ['at', 'kind', 'page', 'where', 'text', 'role', 'course', 'state'];
/* v74 (6 Oct 2026): the centres Connect has sold to, number -> name. Written
   when a course is made, read by the console to fill the name in. Not a
   register of Cambridge's and never presented as one: it is this account's
   own record of who it has sold to. */
HEADERS[SHEET_CENTRES] = ['number', 'name', 'first', 'courses'];

function spreadsheet_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SPREADSHEET_ID');
  var ss = null;
  /* NEVER REPLACE A SHEET THAT IS MERELY SLOW TO OPEN (28 Oct 2026). One transient failure of openById, with a burst of
     requests in flight, used to fall through to SpreadsheetApp.create and overwrite SPREADSHEET_ID: twenty empty
     "Connect Lite (data)" sheets in two seconds, and every course vanished from the list until the property was put
     back by hand. A sheet that is set is retried, and then reported; only a store with no sheet at all makes one. */
  if (id) {
    var lastErr = null;
    for (var tries = 0; tries < 4 && !ss; tries++) {
      try { ss = SpreadsheetApp.openById(id); } catch (e) { lastErr = e; Utilities.sleep(400 * (tries + 1)); }
    }
    if (!ss) throw new Error('The data sheet could not be opened just now (' + lastErr + '). Nothing was changed; try again in a moment.');
    return ss;
  }
  ss = SpreadsheetApp.create('Connect Lite (data)'); props.setProperty('SPREADSHEET_ID', ss.getId());
  return ss;
}
function dataSheetUrl() { var u = spreadsheet_().getUrl(); Logger.log(u); return u; }
function sheet_(name) {
  if (name === SHEET_COURSE) COURSE_MEMO_ = null;   // a writer may be about to change it
  var header = HEADERS[name];
  var ss = spreadsheet_();
  var sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight('bold'); sh.setFrozenRows(1); }
  return sh;
}
/* Rows go in BLOCKS (24 Oct 2026). One deleteRow per matching row is one
   round trip to Sheets each, and a course's records run to hundreds of rows
   (feedback documents are chunked across rows), so deleting c7 ran out of
   Apps Script's time limit partway through, every time: the trainees went,
   some records went, and the course itself, deleted last, never did --
   "it's like it's deleted, but still there". A course's rows sit mostly
   together, so each run of neighbouring matches is one deleteRows call,
   taken bottom-up so the row numbers above stay true. */
function deleteRowsWhere_(name, match) {
  var sh = sheet_(name);
  var rows = sh.getDataRange().getValues();
  var n = 0, i = rows.length - 1;
  while (i >= 1) {
    if (!match(rows[i])) { i--; continue; }
    var end = i;
    while (i >= 1 && match(rows[i])) i--;
    var count = end - i;                 // rows i+1 .. end (0-based) are a run
    sh.deleteRows(i + 2, count);         // sheet rows are 1-based; row 0 is the header
    n += count;
  }
  return n;
}
function roster_(courseId) {
  var sh = sheet_(SHEET_TRAINEES);
  var last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2, 1, last - 1, 6).getValues()
    .filter(function (r) { return String(r[0]) === String(courseId) && String(r[1]).trim(); })
    .map(function (r) { return { token: String(r[1]), name: String(r[2]), group: String(r[3]), created: r[4] ? new Date(r[4]).toISOString() : '', email: String(r[5] || '') }; });
}
/* EVERY COURSE'S TRAINEES, WITH THE RECORDS ASKED FOR (20 Oct 2026).
   The owner's figures and the pulse Connect's Command Center reads both
   counted people from courseRead_(id, 'roster'), a record no course has had
   since trainees moved to their own sheet, so every course counted nobody:
   "0 candidates" with six on C/18. One pass over the trainees sheet and one
   over the records, for every course at once:
   { courseId: { token: { kind: data, ... } } }. */
function peopleByCourse_(kinds) {
  var out = {};
  var tsh = sheet_(SHEET_TRAINEES), tl = tsh.getLastRow();
  if (tl >= 2) tsh.getRange(2, 1, tl - 1, 2).getValues().forEach(function (r) {
    var cid = String(r[0]), tok = String(r[1]).trim(); if (!tok) return;
    (out[cid] = out[cid] || {})[tok] = {};
  });
  var rsh = sheet_(SHEET_RECORDS), rl = rsh.getLastRow();
  if (rl >= 2) rsh.getRange(2, 1, rl - 1, 4).getValues().forEach(function (r) {
    var kind = String(r[2]); if (!kinds[kind]) return;
    var bucket = (out[String(r[0])] || {})[String(r[1])]; if (!bucket) return;
    try { bucket[kind] = JSON.parse(r[3]); } catch (e) {}
  });
  return out;
}
// A token is unique across the store, so it finds its own course.
function traineeAnywhere_(token) {
  token = String(token || '').trim();
  if (!token) throw new Error('No token');
  var sh = sheet_(SHEET_TRAINEES);
  var last = sh.getLastRow();
  if (last >= 2) {
    var rows = sh.getRange(2, 1, last - 1, 6).getValues();
    for (var i = 0; i < rows.length; i++) if (String(rows[i][1]) === token) {
      return { course: String(rows[i][0]), token: token, name: String(rows[i][2]), group: String(rows[i][3]), created: rows[i][4] ? new Date(rows[i][4]).toISOString() : '', email: String(rows[i][5] || '') };
    }
  }
  throw new Error('This link is not on the course');
}
function read_(courseId, token, kind) {
  var sh = sheet_(SHEET_RECORDS);
  var last = sh.getLastRow();
  if (last < 2) return null;
  var rows = sh.getRange(2, 1, last - 1, 4).getValues();
  if (kind === 'tpHistory') return historyFromRows_(rows, courseId, token);
  for (var i = rows.length - 1; i >= 0; i--) {
    if (String(rows[i][0]) === String(courseId) && String(rows[i][1]) === token && String(rows[i][2]) === kind) {
      try { return JSON.parse(rows[i][3]); } catch (e) { return null; }
    }
  }
  return null;
}
/* The roster for a course, every trainee's records attached, from ONE read of
   the trainees sheet and ONE of the records sheet.

   It used to be roster_() then recordsFor_() per trainee, and recordsFor_ reads
   the WHOLE records sheet every time -- so listing a roster of twelve read that
   sheet twelve times, and the wait grew with the course. Apps Script answers in
   1.5-13 s at the best of times (Ramy, 21 Sep 2026: "there seems to be a lag"),
   so the reads inside one call are the part worth not repeating. */
/* ---- is it their own work: the three passes (25 Oct 2026) ------------------ */
function submissionText_(sub) {
  if (!sub) return '';
  /* The prose sections only: the short fields (the text's title, its level, its
     source) are shared by anyone who chose the same text, which is not copying. */
  var parts = [], t = sub.text || {};
  Object.keys(t).sort().forEach(function (k) { parts.push(String(t[k] || '')); });
  return parts.join('\n').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
}
function words_(s) { return String(s || '').toLowerCase().replace(/[\u2019']/g, '').match(/[a-z0-9\u00c0-\u024f]+/g) || []; }
function shingles_(w, n) { var out = {}; for (var i = 0; i + n <= w.length; i++) { var k = w.slice(i, i + n).join(' '); if (out[k] === undefined) out[k] = i; } return out; }
/* Every submission on the store with at least 80 words: course, token, assignment, round, text. */
function allSubmissions_() {
  var sh = sheet_(SHEET_RECORDS), last = sh.getLastRow(); if (last < 2) return [];
  var rows = sh.getRange(2, 1, last - 1, 4).getValues(), out = [];
  rows.forEach(function (r) {
    if (String(r[2]) !== 'assignments') return;
    var A; try { A = JSON.parse(r[3]); } catch (e) { return; }
    if (!A || typeof A !== 'object') return;
    Object.keys(A).forEach(function (code) {
      var a = A[code]; if (!a) return;
      ['sub1', 'sub2'].forEach(function (round) {
        var txt = submissionText_(a[round]); if (txt.split(' ').length < 80) return;
        out.push({ course: String(r[0]), token: String(r[1]), code: code, round: round, text: txt, at: a[round + 'At'] || '' });
      });
    });
  });
  return out;
}
function similar_(course, token, code, round) {
  var all = allSubmissions_(), mine = null;
  all.forEach(function (s) { if (s.course === course.id && s.token === token && s.code === code && s.round === round) mine = s; });
  if (!mine) throw new Error('Nothing submitted for that round, or too short to compare');
  var N = 8, w = words_(mine.text), S = shingles_(w, N), total = Object.keys(S).length;
  if (!total) return { total: 0, words: w.length, matches: [], compared: 0 };
  var names = {}; courses_(true).forEach(function (c) { names[c.id] = c.name; });
  /* Boilerplate is not copying: the brief's own phrases ("I chose speaking because
     the class"), a reference every candidate cites, the declaration. A run that
     appears in three or more OTHER submissions is common property and is ignored;
     what is left has to amount to a paragraph (eight runs, or five per cent). */
  var others = [], df = {};
  all.forEach(function (o) {
    if (o === mine) return;
    if (o.course === course.id && o.token === token) return;   // the same trainee's other rounds and assignments
    var OS = shingles_(words_(o.text), N);
    others.push({ o: o, OS: OS });
    Object.keys(S).forEach(function (k) { if (OS[k] !== undefined) df[k] = (df[k] || 0) + 1; });
  });
  var rare = {}; Object.keys(S).forEach(function (k) { if ((df[k] || 0) <= 2) rare[k] = S[k]; });
  var rareTotal = Object.keys(rare).length;
  var matches = [], compared = others.length;
  others.forEach(function (x) {
    var o = x.o, OS = x.OS, shared = [];
    Object.keys(rare).forEach(function (k) { if (OS[k] !== undefined) shared.push(rare[k]); });
    if (!shared.length) return;
    shared.sort(function (a, b) { return a - b; });
    var runs = [], start = shared[0], prev = shared[0];
    for (var i = 1; i <= shared.length; i++) {
      if (i < shared.length && shared[i] === prev + 1) { prev = shared[i]; continue; }
      runs.push([start, prev + N]);
      if (i < shared.length) { start = shared[i]; prev = shared[i]; }
    }
    runs.sort(function (a, b) { return (b[1] - b[0]) - (a[1] - a[0]); });
    /* A match is a lifted passage (25 words running) or a lot of it (five per cent
       of the text); scattered phrases two writers on the same brief would both use
       (a title they both chose, a reference they both cite) are neither. */
    var longest = runs.length ? runs[0][1] - runs[0][0] : 0;
    if (longest < 25 && (!rareTotal || 100 * shared.length / rareTotal < 5)) return;
    var passages = runs.slice(0, 3).map(function (r) { return w.slice(r[0], Math.min(r[1], r[0] + 70)).join(' '); });
    var same = o.course === course.id, cset = same ? {} : (courseRead_(o.course, 'settings') || {});
    matches.push({ sameCourse: same, course: same ? 'this course' : (cset.courseName || names[o.course] || 'another course'), centre: same ? '' : (cset.centreName || ''),
                   code: o.code, round: o.round, when: o.at, shared: shared.length, pct: Math.round(100 * shared.length / total), passages: passages, ref: o.course + '|' + o.token + '|' + o.code + '|' + o.round });
  });
  matches.sort(function (a, b) { return b.shared - a.shared; });
  return { total: total, words: w.length, compared: compared, common: total - rareTotal, matches: matches.slice(0, 8) };
}
function webCheck_(course, token, code, round) {
  var key = PropertiesService.getScriptProperties().getProperty('BRAVE_KEY');
  if (!key) return { off: true };
  var A = read_(course.id, token, 'assignments') || {}, txt = submissionText_((A[code] || {})[round]);
  if (!txt) throw new Error('Nothing submitted for that round');
  var sents = txt.split(/(?<=[.!?])\s+/).map(function (x) { return x.trim(); }).filter(function (x) { var n = x.split(' ').length; return n >= 10 && n <= 30; });
  var score = function (x) { return x.replace(/[^a-z]/gi, '').length / x.split(' ').length; };   // longer words, more distinctive
  sents.sort(function (a, b) { return score(b) - score(a); });
  var picked = [], seen = {};
  for (var i = 0; i < sents.length && picked.length < 6; i++) { var k = sents[i].slice(0, 40); if (seen[k]) continue; seen[k] = 1; picked.push(sents[i]); }
  var out = [];
  picked.forEach(function (s) {
    var q = '"' + s.replace(/"/g, '').slice(0, 160) + '"';
    var url = 'https://api.search.brave.com/res/v1/web/search?count=5&q=' + encodeURIComponent(q);
    try {
      var r = UrlFetchApp.fetch(url, { muteHttpExceptions: true, headers: { 'Accept': 'application/json', 'X-Subscription-Token': key } });
      var j = JSON.parse(r.getContentText());
      var results = (j.web && j.web.results) || [];
      var items = results.map(function (it) { return { title: String(it.title || '').replace(/<[^>]+>/g, '').slice(0, 120), link: String(it.url || ''), snippet: String(it.description || '').replace(/<[^>]+>/g, '').slice(0, 240) }; });
      var err = r.getResponseCode() >= 400 ? ('Brave answered ' + r.getResponseCode() + (j && j.error ? ': ' + String(j.error.detail || j.error.code || '').slice(0, 80) : '')) : '';
      out.push({ sentence: s, hits: items, error: err });
    } catch (e) { out.push({ sentence: s, hits: [], error: String(e && e.message || e).slice(0, 120) }); }
  });
  return { checked: out.length, found: out.filter(function (x) { return x.hits.length; }).length, sentences: out };
}
function aiCheck_(course, token, code, round) {
  var key = PropertiesService.getScriptProperties().getProperty('CLAUDE_KEY');
  if (!key) return { off: true };
  var sim = similar_(course, token, code, round);
  if (!sim.matches.length) return { model: '', results: [], note: 'No candidate pair to read: the first pass found nothing shared.' };
  var all = allSubmissions_(), byRef = {};
  all.forEach(function (s) { byRef[s.course + '|' + s.token + '|' + s.code + '|' + s.round] = s; });
  var mine = byRef[course.id + '|' + token + '|' + code + '|' + round];
  var model = 'claude-haiku-5-5', results = [];
  sim.matches.slice(0, 3).forEach(function (m) {
    var o = byRef[m.ref]; if (!o) return;
    var prompt = 'Two CELTA written assignments follow, each cut to its first 6000 characters. Both answer the same brief, so shared quotations of the brief, of set texts and of standard terminology are expected and do not count. ' +
      'Do they contain passages that say the same thing in different words, beyond what two independent writers on the same brief would share? ' +
      'Answer with JSON only, nothing before or after it: {"verdict":"none"|"some"|"substantial","pairs":[{"a":"<up to 25 words from text A>","b":"<the matching up to 25 words from text B>","note":"<one short sentence>"}]} with at most 3 pairs. Keep every string short.\n\nTEXT A:\n' + mine.text.slice(0, 6000) + '\n\nTEXT B:\n' + o.text.slice(0, 6000);
    try {
      var r = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', { method: 'post', contentType: 'application/json', muteHttpExceptions: true,
        headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        payload: JSON.stringify({ model: model, max_tokens: 1600, messages: [{ role: 'user', content: prompt }] }) });
      var j = JSON.parse(r.getContentText());
      if (j.error) { results.push({ course: m.course, code: m.code, round: m.round, error: String(j.error.message || j.error.type || '').slice(0, 160) }); return; }
      var text = ((j.content || []).map(function (c) { return c.text || ''; }).join('')).trim();
      var jm = text.match(/\{[\s\S]*\}/), parsed = null; try { parsed = jm ? JSON.parse(jm[0]) : null; } catch (e) {}
      /* The answer can be cut short (25 Oct 2026: a long pair ran past the token
         limit): the verdict is salvaged from the text, and whole pairs with it. */
      var verdict = parsed ? String(parsed.verdict || '') : ((text.match(/"verdict"\s*:\s*"(none|some|substantial)"/) || [])[1] || '');
      var pairs = parsed && Array.isArray(parsed.pairs) ? parsed.pairs : [];
      if (!parsed) { var pm, re = /\{\s*"a"\s*:\s*"((?:[^"\\]|\\.)*)"\s*,\s*"b"\s*:\s*"((?:[^"\\]|\\.)*)"\s*(?:,\s*"note"\s*:\s*"((?:[^"\\]|\\.)*)")?\s*\}/g; while ((pm = re.exec(text)) && pairs.length < 3) pairs.push({ a: pm[1], b: pm[2], note: pm[3] || '' }); }
      results.push({ course: m.course, code: m.code, round: m.round, verdict: verdict, pairs: pairs.slice(0, 3).map(function (x) { return { a: String(x.a || '').slice(0, 400), b: String(x.b || '').slice(0, 400), note: String(x.note || '').slice(0, 240) }; }), raw: (parsed || verdict) ? '' : text.slice(0, 300), stop: j.stop_reason || '' });
    } catch (e) { results.push({ course: m.course, code: m.code, round: m.round, error: String(e && e.message || e).slice(0, 160) }); }
  });
  return { model: model, results: results };
}
function withoutEmails_(list, strip) {
  if (!strip) return list;
  return list.map(function (t) { var o = {}; Object.keys(t).forEach(function (k) { if (k !== 'email') o[k] = t[k]; }); return o; });
}
function rosterWithRecords_(courseId, kinds) {
  var people = roster_(courseId);
  if (!people.length) return [];
  var byToken = {};
  people.forEach(function (t) { byToken[t.token] = {}; });
  var sh = sheet_(SHEET_RECORDS);
  var last = sh.getLastRow();
  if (last >= 2) {
    sh.getRange(2, 1, last - 1, 4).getValues().forEach(function (r) {
      if (String(r[0]) !== String(courseId)) return;
      var bucket = byToken[String(r[1])]; if (!bucket) return;
      foldRecord_(bucket, String(r[2]), r[3], kinds);
    });
  }
  return people.map(function (t) {
    return { token: t.token, name: t.name, group: t.group, created: t.created, email: t.email || '', records: finishBucket_(byToken[t.token]) };
  });
}
function recordsFor_(courseId, token, kinds) {
  var out = {};
  var sh = sheet_(SHEET_RECORDS);
  var last = sh.getLastRow();
  if (last < 2) return out;
  sh.getRange(2, 1, last - 1, 4).getValues().forEach(function (r) {
    if (String(r[0]) !== String(courseId) || String(r[1]) !== token) return;
    foldRecord_(out, String(r[2]), r[3], kinds);
  });
  return finishBucket_(out);
}
function write_(courseId, token, kind, data) {
  markChanged_(courseId);
  if (kind === 'tpHistory') return writeHistory_(courseId, token, data);
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sh = sheet_(SHEET_RECORDS);
    var last = sh.getLastRow();
    var json = JSON.stringify(data == null ? null : data);
    assertFits_(json, kind);
    if (last >= 2) {
      var keys = sh.getRange(2, 1, last - 1, 3).getValues();
      for (var i = 0; i < keys.length; i++) {
        if (String(keys[i][0]) === String(courseId) && String(keys[i][1]) === token && String(keys[i][2]) === kind) {
          sh.getRange(i + 2, 4, 1, 2).setValues([[json, new Date()]]);
          return;
        }
      }
    }
    sh.appendRow([courseId, token, kind, json, new Date()]);
  } finally { lock.releaseLock(); }
}
/* A Sheets cell holds 50,000 characters. A course record that does not fit is
   written across as many rows as it needs, kind "<kind>#0", "#1", ... -- plain
   string slices of the one JSON, concatenated in index order and parsed once,
   so nothing upstream knows. The per-TP split on the records sheet (26 Sep
   2026) fixed the same ceiling for a candidate history; this is the course
   side of it, and a TP point set with its stages is what crossed it (4 Oct
   2026: twelve sessions came to 68,861 characters and the write was refused).
   A record is never both spellings at once: a write clears the other. */
function chunkIndex_(k, kind) {
  k = String(k);
  if (k.length <= kind.length + 1) return -1;
  if (k.slice(0, kind.length + 1) !== kind + "#") return -1;
  var t = k.slice(kind.length + 1);
  return /^[0-9]+$/.test(t) ? Number(t) : -1;
}
function kindsByCourse_() {
  var sh = sheet_(SHEET_COURSE), last = sh.getLastRow();
  var out = {};
  if (last < 2) return out;
  var rows = sh.getRange(2, 1, last - 1, 2).getValues();
  for (var i = 0; i < rows.length; i++) {
    var id = String(rows[i][0]), k = String(rows[i][1]);
    var cut = k.indexOf("~");
    if (cut > 0) k = k.slice(0, cut);
    if (!id || !k) continue;
    if (!out[id]) out[id] = {};
    out[id][k] = 1;
  }
  return out;
}
/* THE COURSE SHEET, READ ONCE PER REQUEST (v92, 15 Oct 2026). Every
   courseRead_ used to pull the WHOLE sheet -- every course's rows, the library's
   1.5MB among them -- and a boot makes a dozen of them, the PIN gate two more
   on every call. Ramy: opening a trainee link took "a very long time". The rows
   are now read the first time and kept for the rest of this request (an Apps
   Script execution starts with empty globals, so nothing outlives it). Anything
   that touches the sheet through sheet_(SHEET_COURSE) -- every writer, every
   deleter -- throws the copy away, and the two read-modify-write helpers throw
   it away again after they take their lock, so a read under a lock is always
   fresh. */
var COURSE_MEMO_ = null;
function courseRows_() {
  if (COURSE_MEMO_) return COURSE_MEMO_;
  var sh = sheet_(SHEET_COURSE);            // drops any copy; set below
  var last = sh.getLastRow();
  COURSE_MEMO_ = last < 2 ? [] : sh.getRange(2, 1, last - 1, 3).getValues();
  return COURSE_MEMO_;
}
/* ---- the booking sheets' helpers (v182) ---- */
function bookableTile_(courseId, date, id) {
  var tt = courseRead_(courseId, 'timetable') || {};
  var days = (tt.days || []);
  var day = null; for (var i = 0; i < days.length; i++) if (days[i] && days[i].date === date) { day = days[i]; break; }
  if (!day) throw new Error('That day is not on the timetable.');
  var tile = null; (day.sessions || []).forEach(function (x) { if (x && x.id === id) tile = x; });
  if (!tile || !/consultation|tutorial/i.test(tile.t || '')) throw new Error('That is not a sheet you can book.');
  var len = mins_(tile.e) - mins_(tile.s);
  return { tile: tile, places: Math.max(1, Math.floor(len / 15)) };
}
function mins_(hm) { var m = /^(\d{1,2}):(\d{2})/.exec(String(hm || '')); return m ? +m[1] * 60 + +m[2] : 0; }
function placeTime_(s, n) { var m = mins_(s) + (n - 1) * 15; return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2); }
function tutorName_(set, by) {
  if (by === undefined || by === null || by === '') return '';
  var names = String((set && set.tutorNames) || '').split(/[,\n;]+/).map(function (x) { return x.trim(); }).filter(Boolean);
  return names[+by] || '';
}
/* their own tutor: their group's row on Course admin > Tutor contacts */
function ownTutor_(set, me) {
  var rows = (set && set.tutorContacts) || [], g = String((me && me.group) || '');
  for (var i = 0; i < rows.length; i++) if (rows[i] && rows[i].name && g && String(rows[i].group || '') === g) return String(rows[i].name);
  return '';
}
function courseRead_(courseId, kind) {
  var rows = courseRows_();
  if (!rows.length) return null;
  var parts = [], plain = null, n = 0;
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][0]) !== String(courseId)) continue;
    var k = String(rows[i][1]);
    if (k === kind) { plain = rows[i][2]; continue; }
    var ix = chunkIndex_(k, kind);
    if (ix >= 0) { parts[ix] = rows[i][2]; n++; }
  }
  var json = (plain !== null && String(plain) !== "") ? String(plain) : null;
  if (json === null && n) {
    for (var j = 0; j < n; j++) if (parts[j] === undefined) return null;
    json = parts.slice(0, n).join("");
  }
  if (json === null) return null;
  try { return JSON.parse(json); } catch (e) { return null; }
}
/* The marking guidance (v94, 17 Oct 2026): the course's own, else the
   store's defaults. The tutors and the assessor read it; nobody else does --
   boot sends it only to a reader. */
function guidanceFor_(courseId) {
  var own = courseRead_(courseId, 'guidance');
  if (own) return own;
  var d = courseRead_('_defaults', 'guidance');
  return d ? { fromDefaults: true, items: d.items || {} } : null;
}
function courseWrite_(courseId, kind, data) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try { courseWriteRaw_(courseId, kind, data); } finally { lock.releaseLock(); }
}
// Read, change, write, under ONE lock -- for a list that several tutors append
// to (the course stream, 28 Sep 2026). The script lock is not re-entrant, so
// the write inside is the raw one.
function courseUpdate_(courseId, kind, fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    COURSE_MEMO_ = null;   // another request may have written while this one waited
    var cur = courseRead_(courseId, kind);
    var next = fn(Array.isArray(cur) ? cur : []);
    courseWriteRaw_(courseId, kind, next);
    return next;
  } finally { lock.releaseLock(); }
}
// The same for an object record (the planning grid).
function courseUpdateObj_(courseId, kind, fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    COURSE_MEMO_ = null;   // as above
    var cur = courseRead_(courseId, kind);
    var next = fn(cur && typeof cur === 'object' && !Array.isArray(cur) ? cur : {});
    courseWriteRaw_(courseId, kind, next);
    return next;
  } finally { lock.releaseLock(); }
}
// The private folder for a course's interview recordings, under its materials.
/* A streamed, speaker-labelled transcript (server-sent events, one JSON
   segment per "data:" line) as lines of "Student: ..." and "Trainee: ...".
   The student is whoever speaks the most words in an interview; every other
   voice is the trainee. The trainee can swap them on the page. Returns '' when
   there is nothing usable, so the caller falls back to the plain transcript. */
function diarizedTurns_(sse) {
  var segs = [];
  String(sse || '').split('\n').forEach(function (line) {
    if (line.indexOf('data:') !== 0) return;
    var raw = line.slice(5).trim();
    if (!raw || raw === '[DONE]') return;
    var o; try { o = JSON.parse(raw); } catch (e) { return; }
    if (o && o.type === 'transcript.text.segment' && o.text && String(o.text).trim()) segs.push({ who: String(o.speaker || '?'), text: String(o.text).trim() });
  });
  if (!segs.length) return '';
  var words = {};
  segs.forEach(function (g) { words[g.who] = (words[g.who] || 0) + g.text.split(/\s+/).length; });
  var student = Object.keys(words).sort(function (a, b) { return words[b] - words[a]; })[0];
  var turns = [];
  segs.forEach(function (g) {
    var who = g.who === student ? 'Student' : 'Trainee';
    var last = turns[turns.length - 1];
    if (last && last.who === who) last.text += ' ' + g.text; else turns.push({ who: who, text: g.text });
  });
  return turns.map(function (t) { return t.who + ': ' + t.text; }).join('\n');
}

/* THE PASS's helpers (v132). A pass is "p-<course id>-<12 hex>", so its course is read from it. */
function parsePass_(p) {
  var m = /^p-([A-Za-z0-9]+)-([0-9a-f]{12})$/.exec(String(p || ''));
  return m ? { course: m[1] } : null;
}
function passCheck_(course, p) {
  var pi = parsePass_(p);
  if (!pi || pi.course !== course.id) throw new Error('This link is not valid.');
  var rec = (courseRead_(course.id, 'passes') || {})[p];
  if (!rec) throw new Error('This link is not valid.');
  if (new Date().toISOString().slice(0, 10) > String(rec.exp)) {
    throw new Error('This link expired on ' + new Date(rec.exp + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) + '.');
  }
}
/* THE NOTEBOOK's helpers (v129). */
// A note as the pool keeps it: the words, where it was written, when, and a voice note's id. Never more.
function noteClean_(it, byName) {
  if (!it || typeof it !== 'object') return null;
  var text = String(it.text || '').trim().slice(0, 4000);
  var audio = (it.audio && it.audio.id) ? { id: String(it.audio.id).slice(0, 80), seconds: Number(it.audio.seconds) || 0 } : null;
  if (!text && !audio) return null;
  var th = it.thread && typeof it.thread === 'object' ? it.thread : {};
  return { id: String(it.id || newKey_().slice(0, 10)).slice(0, 24), at: /^\d{4}-\d{2}-\d{2}T/.test(String(it.at || '')) ? String(it.at) : new Date().toISOString(),
           day: /^\d{4}-\d{2}-\d{2}$/.test(String(it.day || '')) ? String(it.day) : new Date().toISOString().slice(0, 10),
           thread: { k: String(th.k || 'day').slice(0, 12), id: String(th.id || '').slice(0, 60), t: String(th.t || '').slice(0, 120) },
           text: text, audio: audio, by: String(byName || '').slice(0, 80) };
}
// A tutor's name as the pool keys it: lower case, one space between words. The name is the identity (one shared key).
function tutorWho_(who) {
  var w = String(who || '').trim().toLowerCase().replace(/\s+/g, ' ');
  if (!w) throw new Error('Say which tutor you are first: your name, on the dashboard');
  return w.slice(0, 80);
}
// The notes classmates shared with this trainee: everyone's "course" notes, and their own group's "group" notes. Never their own.
function sharedNotesFor_(courseId, me) {
  var pool = courseRead_(courseId, 'notes') || {}, out = [], g = String(me.group || '');
  Object.keys(pool).forEach(function (tok) {
    if (tok === me.token) return;
    (pool[tok] || []).forEach(function (it) {
      if (!it) return;
      if (it.scope === 'course' || (it.scope === 'group' && String(it.group || '') === g) || (it.scope === 'trainee' && it.to === me.token)) {
        if (it.replies) { var mineOnly = it.replies.filter(function (r) { return r && r.token === me.token; }).map(function (r) { return { by: r.by, at: r.at, text: r.text }; }); it = Object.assign({}, it, { replies: mineOnly }); }
        out.push(it);
      }
    });
  });
  out.sort(function (a, b) { return String(a.at).localeCompare(String(b.at)); });
  return out;
}
/* PEER SHEETS (v133). The observer is a trainee; the teacher they write about is another trainee of the SAME TP
   group, named in the browser by a stand-in id (standIn_), never by a key. */
function peerTo_(courseId, me, standIn) {
  var want = String(standIn || '');
  if (!want) throw new Error('Which classmate?');
  var hit = roster_(courseId).filter(function (t) {
    return t.token !== me.token && String(t.group) === String(me.group || '') && standIn_(courseId, t.token) === want;
  })[0];
  if (!hit) throw new Error('That classmate is not in your TP group');
  return hit.token;
}
function peerSheetId_(task, sit, to) { return String(task).slice(0, 40) + '#' + sit + '>' + to; }
function peerSheetClean_(req, me, to) {
  var task = String(req.task || '');
  if (!/^[A-Za-z0-9_-]{1,40}$/.test(task)) throw new Error('Which sheet?');
  var tp = parseInt(req.tp, 10);
  if (!(tp >= 1 && tp <= 20)) throw new Error('Which teaching practice?');
  var sit = req.sit === 'b' ? 'b' : 'a';
  var rows = (Array.isArray(req.rows) ? req.rows : []).slice(0, 40).map(function (r) {
    return { q: String((r && r.q) || '').trim().slice(0, 400), a: String((r && r.a) || '').trim().slice(0, 4000) };
  });
  if (!rows.some(function (r) { return r.a; })) throw new Error('Nothing is written on this sheet yet');
  var col = parseInt(req.col, 10);
  return { id: peerSheetId_(task, sit, to), task: task, sit: sit, tp: tp, col: (col >= 0 && col <= 2) ? col : -1,
           title: String(req.title || '').trim().slice(0, 120), rows: rows, to: to, by: String(me.name || '').slice(0, 80),
           group: String(me.group || ''), at: new Date().toISOString() };
}
// Has this trainee turned in their self-evaluation for teaching practice `tp`? The live one carries "TP 3 · ..." in its
// label; once the tutor returns the feedback the live copy moves into the history under the number.
function selfEvalDone_(recs, tp) {
  var hist = (recs && recs.tpHistory) || {};
  if (hist[tp]) return true;
  var se = recs && recs.selfeval;
  if (se && se.status === 'turned_in') {
    var m = String(se.label || '').match(/\d+/);
    if (m && parseInt(m[0], 10) === tp) return true;
  }
  return false;
}
// What classmates connected with this trainee. The answers are in it only for a teaching practice the trainee has
// already written their own self-evaluation for; before that the row says it exists and nothing else.
function peerSheetsFor_(courseId, me) {
  var pool = courseRead_(courseId, 'peerShared') || {}, mine = [];
  Object.keys(pool).forEach(function (tok) {
    if (tok === me.token) return;
    (pool[tok] || []).forEach(function (it) { if (it && it.to === me.token) mine.push({ from: tok, it: it }); });
  });
  if (!mine.length) return [];
  var recs = recordsFor_(courseId, me.token, { selfeval: 1, tpHistory: 1 }), done = {};
  var out = mine.map(function (m) {
    var it = m.it;
    if (done[it.tp] === undefined) done[it.tp] = selfEvalDone_(recs, it.tp);
    var row = { id: standIn_(courseId, m.from) + ':' + it.task + '#' + it.sit, task: it.task, sit: it.sit, tp: it.tp, title: it.title, by: it.by, at: it.at };
    if (done[it.tp]) row.rows = it.rows; else row.locked = true;
    return row;
  });
  out.sort(function (a, b) { return String(a.at).localeCompare(String(b.at)); });
  return out;
}
function notebookFolder_(course) {
  var props = PropertiesService.getScriptProperties(), key = 'NB_FOLDER_' + course.id, id = props.getProperty(key);
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) { /* gone: make another */ } }
  var f = materialsFolder_(course).createFolder('Notebook recordings (private)');
  f.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
  props.setProperty(key, f.getId());
  return f;
}
/* Who may hear a voice note: the one who made it; a tutor, their own and the ones a colleague shared; a
   trainee, their own and the ones shared with their group or the course. `own` asks for the maker alone. */
function noteFileFor_(course, id, tutor, me, who, own) {
  if (!course) throw new Error('This link is not on a course');
  var f; try { f = DriveApp.getFileById(String(id || '')); } catch (e) { throw new Error('No such recording'); }
  var inFolder = false, parents = f.getParents(), want = notebookFolder_(course).getId();
  while (parents.hasNext()) { if (parents.next().getId() === want) inFolder = true; }
  if (!inFolder) throw new Error('No such recording');
  var meta = {}; try { meta = JSON.parse(f.getDescription() || '{}'); } catch (e) {}
  var fid = f.getId();
  function listed(list, test) { return (list || []).some(function (it) { return it && it.audio && it.audio.id === fid && test(it); }); }
  if (meta.tutor) {
    /* a trainee hears a tutor's voice note only when that note was connected with them (v130) */
    if (!tutor && me && !own) {
      var npool = courseRead_(course.id, 'notes') || {}, ng = String(me.group || '');
      if (listed(npool['tutor:' + meta.who], function (it) { return it.scope === 'course' || (it.scope === 'group' && String(it.group || '') === ng) || (it.scope === 'trainee' && it.to === me.token); })) return f;
    }
    if (!tutor) throw new Error('Not yours to hear');
    var mine = !!who && tutorWho_(who) === meta.who;
    if (mine) return f;
    if (own) throw new Error('Not yours to hear');
    var tpool = courseRead_(course.id, 'tutorNotes') || {};
    if (listed(tpool[meta.who], function (it) { return !!it.shared; })) return f;
    throw new Error('Not yours to hear');
  }
  if (!me || tutor) throw new Error('Not yours to hear');
  if (meta.token === me.token) return f;
  if (own) throw new Error('Not yours to hear');
  var pool = courseRead_(course.id, 'notes') || {}, g = String(me.group || '');
  if (listed(pool[meta.token], function (it) { return it.scope === 'course' || (it.scope === 'group' && String(it.group || '') === g); })) return f;
  throw new Error('Not yours to hear');
}
function interviewFolder_(course) {
  var props = PropertiesService.getScriptProperties(), key = 'IV_FOLDER_' + course.id, id = props.getProperty(key);
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) { /* gone: make another */ } }
  var f = materialsFolder_(course).createFolder('Interview recordings (private)');
  f.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
  props.setProperty(key, f.getId());
  return f;
}
// A recording the caller may use: the tutors of this course, or the trainee who made it.
function interviewFileFor_(course, id, tutor, me, own) {
  if (!course) throw new Error('This link is not on a course');
  var f; try { f = DriveApp.getFileById(String(id || '')); } catch (e) { throw new Error('No such recording'); }
  var inFolder = false, parents = f.getParents(), want = interviewFolder_(course).getId();
  while (parents.hasNext()) { if (parents.next().getId() === want) inFolder = true; }
  if (!inFolder) throw new Error('No such recording');
  var meta = {}; try { meta = JSON.parse(f.getDescription() || '{}'); } catch (e) {}
  if (tutor || (me && meta.token && meta.token === me.token)) return f;
  /* a trainee of the same TP group may listen; only the maker may delete (deleteInterviewAudio passes own) */
  if (!own && me && meta.token && folGroupTokens_(course.id, me)[meta.token]) return f;
  throw new Error('Not yours to hear');
  return f;
}
// The register as a trainee may see it: names and levels, and whether each
// student has agreed to be recorded. No tokens, no addresses, no notes.
function volunteerNamesFor_(courseId) {
  var reg = courseRead_(courseId, 'volunteers') || {};
  return (reg.students || []).filter(function (x) { return x && x.name; }).map(function (x) { return { name: String(x.name), level: x.level || '', agreed: !!x.agreed }; });
}
// The Focus on the Learner pool, flattened. Tutors see who heard each note;
// a trainee sees the notes alone.
/* ONLY THE TP GROUP (Ramy, 28 Oct 2026: "we're never sharing with the whole course ... it's always meant to be only
   sharing with the TP group"). A trainee gets what the trainees of their own group wrote; tutors and the assessor get
   everything. The group is read from the roster as it stands, so an entry follows its writer's group. */
function folGroupTokens_(courseId, me) {
  var g = String((me && me.group) || ''), ok = {};
  roster_(courseId).forEach(function (t) { if (String(t.group || '') === g) ok[t.token] = 1; });
  if (me && me.token) ok[me.token] = 1;
  return ok;
}
function folPoolFor_(pool, forTutor, courseId, me) {
  var out = [], ok = forTutor ? null : folGroupTokens_(courseId, me);
  Object.keys(pool || {}).forEach(function (tok) {
    if (ok && !ok[tok]) return;
    (pool[tok] || []).forEach(function (it) {
      var row = { id: it.id, type: it.type, note: it.note, student: it.student || '', at: it.at };
      if (forTutor) row.by = it.by || '';
      out.push(row);
    });
  });
  out.sort(function (a, b) { return String(a.at).localeCompare(String(b.at)); });
  return out;
}
/* THE GROUP'S PROFILE (Ramy, 28 Oct 2026: Part A of Focus on the Learner is the whole TP group, so the answers to the
   eight questions are shared with the group, not kept by the one trainee who asked them; "everything should be shared in
   the TP group, including the transcripts"). One entry per student a trainee interviewed: the student's first name, the
   answers, and the recordings with their transcripts. The students agreed to be recorded for teacher training. */
function folProfilesFor_(prof, forTutor, courseId, me) {
  var out = [], ok = forTutor ? null : folGroupTokens_(courseId, me);
  Object.keys(prof || {}).forEach(function (tok) {
    if (ok && !ok[tok]) return;
    (prof[tok] || []).forEach(function (it) {
      if (!it || !it.student) return;
      var row = { student: it.student, answers: it.answers || {}, audio: it.audio || [], at: it.at, mine: !!(me && tok === me.token) };
      if (forTutor) row.by = it.by || '';
      out.push(row);
    });
  });
  out.sort(function (a, b) { return String(a.student).localeCompare(String(b.student)); });
  return out;
}
// What each reader may see of the grid. Tutors and the assessor: the whole
// thing, rows by token (theirs to know). A candidate: nothing until their
// group is released, then their group's rows BY NAME, their own marked.
function gridFor_(course, g, reader, me) {
  g = (g && typeof g === 'object' && !Array.isArray(g)) ? g : {};
  var rows = g.rows || {}, rel = g.released || {}, due = g.due || {};
  if (reader) return { rows: rows, released: rel, due: due };
  if (!me) return null;
  var grp = String(me.group || '');
  if (!rel[grp]) return { released: false };
  var people = roster_(course.id).filter(function (t) { return String(t.group || '') === grp; });
  var slot = ((courseRead_(course.id, 'settings') || {}).slotOf) || {};
  return { released: true, group: grp, due: due[grp] || '', rows: people.map(function (t) { return { name: t.name, letter: /^[A-F]$/.test(String(slot[t.token] || '')) ? String(slot[t.token]) : '', mine: t.token === me.token, plan: rows[t.token] || {} }; }) };
}
// What each reader may see of the teaching-practice points. Tutors and the
// assessor: the whole rotation, every group, whether released or not -- it is
// the timetable's backbone and they plan from it. A candidate: nothing until
// their own group is released, then that group's points only, their own
// marked, so they learn what they are teaching without reading round the
// other group. Same shape and same rule as gridFor_ above (29 Sep 2026).
/* NO TRAINEE EVER RECEIVES ANOTHER'S KEY (walk, 24 Oct 2026). A trainee's token
   is their key, and the course settings carried every one of them to every
   trainee and volunteer: settings.slotOf (token -> letter, the places the course
   admin set), letterOrder, assessorVisit; and the TP points carried the group's,
   in the sets and as the keys of the points. Anyone who is not staff now gets a
   stand-in for every token but their own: a one-way digest, the same on every
   read, so the rotation still places people and their letters still match, and
   a stand-in opens nothing. Who the assessor observes is staff business only. */
function standIn_(courseId, t) {
  var d = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(courseId) + '|' + String(t));
  return 'p' + d.slice(0, 8).map(function (b) { return ('0' + ((b + 256) % 256).toString(16)).slice(-2); }).join('');
}
function hideTokens_(courseId, me) {
  var mine = me ? String(me.token) : '';
  return function (t) { return (t == null || t === '') ? t : String(t) === mine ? t : standIn_(courseId, t); };
}
/* THE ANONYMITY THRESHOLD (30 Oct 2026, the Connect Lite specification's R32:
   "hold narrative feedback and small breakouts below the configured response
   minimum"). Until as many trainees have answered as the course's minimum (five
   unless the centre sets another), the tutors read the taps of an anonymous
   answer but not its comments or its day: with three answers in, a comment's
   wording or date can say whose it is. A trainee who ticked to add their name
   is not anonymous, so their comments show. Nothing stored changes; the read
   holds them back, and they appear once the minimum is reached. */
function courseFeedbackFor_(courseId) {
  var list = courseRead_(courseId, 'courseFeedback') || [];
  var cf = (courseRead_(courseId, 'settings') || {}).courseFeedback || {};
  var min = Math.max(1, Math.min(50, parseInt(cf.minComments, 10) || 5));
  if (list.length >= min) return list;
  return list.map(function (e) {
    if (e && e.name) return e;
    var a = (e && e.answers) || {}, kept = {}, held = 0;
    Object.keys(a).forEach(function (q) { if (/Note$/.test(q)) { if (String(a[q] || '').trim()) held++; } else kept[q] = a[q]; });
    return { answers: kept, heldNotes: held, held: true };
  });
}

function settingsFor_(course, s, reader, me) {
  if (reader || !s || typeof s !== 'object') return s;
  var hide = hideTokens_(course.id, me), out = {};
  Object.keys(s).forEach(function (k) { out[k] = s[k]; });
  delete out.assessorVisit;
  delete out.askCode;   /* the room's question page is the tutors' to hand out (28 Oct 2026) */
  if (out.slotOf && typeof out.slotOf === 'object') { var so = {}; Object.keys(out.slotOf).forEach(function (t) { so[hide(t)] = out.slotOf[t]; }); out.slotOf = so; }
  if (Array.isArray(out.letterOrder)) out.letterOrder = out.letterOrder.map(hide);
  return out;
}
function tpPointsFor_(p, reader, me) {
  p = (p && typeof p === 'object' && !Array.isArray(p)) ? p : {};
  var byGroup = p.groups || {}, rel = p.released || {};
  /* v67 (4 Oct 2026): a course's TP point SET travels with the points, for
     readers only. The set is the lessons written once against the coursebook —
     twelve sessions, three slots each, with their stages — and the rotation
     stamps a slot's content into each cell, so a candidate still receives only
     their own cells and never the set itself. Without this line the record
     came back shaped and the set was silently dropped on every read. */
  if (reader) return { groups: byGroup, released: rel, sets: p.sets || {}, set: p.set || null };
  if (!me) return null;
  var grp = String(me.group || '');
  /* v55 (1 Oct 2026): the sets -- who teaches with whom, and in which order --
     reach a candidate BEFORE the points are released, because the timetable
     draws its letters from them and a candidate's timetable showed a dash in
     every teaching slot until then. The points themselves still wait. */
  var hide = hideTokens_(me.course || '', me);
  var sets = (p.sets || {})[grp] || null;
  if (Array.isArray(sets)) sets = sets.map(function (set) { return Array.isArray(set) ? set.map(hide) : set; });
  /* v153 (26 Oct 2026): the LEVEL of the set the group teaches from, and nothing else of the set, so the
     getting-to-know-you page can deal a trainee the three for their own students before day one (Ramy: "we know what
     level they're teaching, why don't they just get their own"). */
  var level = '';
  try { var st = p.set || {}, sid = (st.setFor || {})[grp], S = sid && (st.library || {})[sid]; level = S ? String(S.level || S.book || '').slice(0, 40) : ''; } catch (e) { level = ''; }
  if (!rel[grp]) return { released: false, group: grp, sets: sets, me: me.token, level: level };
  var pts = byGroup[grp] || {}, mine = {};
  Object.keys(pts).forEach(function (t) { mine[hide(t)] = pts[t]; });
  return { released: true, group: grp, points: mine, sets: sets, me: me.token, level: level };
}
function courseWriteRaw_(courseId, kind, data) {
  markChanged_(courseId);
  var sh = sheet_(SHEET_COURSE);
  var json = JSON.stringify(data == null ? null : data);
  /* One cell while it fits, several when it does not. A row this write does
     not use is emptied rather than deleted: deleting shifts every row below it
     and the numbers gathered a moment ago would all be wrong. */
  var pieces = null;
  if (json.length > CELL_LIMIT) {
    pieces = [];
    /* A piece must never START with =, + or ': setValues reads such a cell as a
       formula (or strips the quote as a text prefix), the cell becomes an error
       and 50,000 characters are gone -- the read then fails to parse and the
       course answers with the empty default. It happened to the library on
       11 Oct 2026 (piece #7 began "=drivesdk", the tail of a Drive link). The
       cut moves back a character or two instead; the read joins the pieces in
       order whatever their lengths, so nothing else changes. */
    for (var p = 0; p < json.length;) {
      var end = Math.min(p + CELL_LIMIT, json.length);
      while (end < json.length && end > p + 1 && "=+'".indexOf(json.charAt(end)) >= 0) end--;
      pieces.push(json.slice(p, end));
      p = end;
    }
    if (pieces.length > 40) throw new Error("Too large to store: " + kind + " is " + json.length + " characters");
  }
  var last = sh.getLastRow();
  var rows = last >= 2 ? sh.getRange(2, 1, last - 1, 2).getValues() : [];
  var mine = {};
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][0]) !== String(courseId)) continue;
    var k = String(rows[i][1]);
    if (k === kind || chunkIndex_(k, kind) >= 0) mine[k] = i + 2;
  }
  var now = new Date();
  function put(k, text) {
    if (mine[k]) { sh.getRange(mine[k], 3, 1, 2).setValues([[text, now]]); delete mine[k]; }
    else sh.appendRow([courseId, k, text, now]);
  }
  if (!pieces) put(kind, json);
  else for (var q = 0; q < pieces.length; q++) put(kind + "#" + q, pieces[q]);
  Object.keys(mine).forEach(function (k) { sh.getRange(mine[k], 3, 1, 2).setValues([["", now]]); });
}

// ---- the teaching-practice history: one row per TP -------------------------
// A Sheets cell holds 50,000 characters, and a returned teaching practice --
// the plan, the analysis sheet and the feedback as one document -- is 25-35 KB.
// The history used to be every returned TP of a candidate in ONE cell, so the
// second one was refused, every time (measured on this store, 26 Sep 2026:
// 49,495 characters accepted, 50,995 refused with an HTML error page). Each TP
// now has its own row, kind 'tpHistory:<n>', and the pages never see the
// difference: a put of the whole map is split here, and a read assembles the
// map back. A legacy single-row 'tpHistory' is folded in on read and emptied
// on the next write, so it cannot resurrect a stale map.
var CELL_LIMIT = 50000;
function assertFits_(json, kind) {
  if (json.length > CELL_LIMIT) throw new Error('Too large to store: ' + kind + ' is ' + json.length + ' characters and a record holds ' + CELL_LIMIT);
}
function tpOf_(kind) { var m = /^tpHistory:(\d+)$/.exec(String(kind)); return m ? m[1] : null; }
// Fold one records row into a bucket of {kind: data}, assembling the history
// from its rows. A per-TP row always wins over the legacy whole-map row,
// whichever order the sheet holds them in.
/* A TRAINEE READS THEIR OWN TRACKER, NOT THE STAFF'S (30 Oct 2026). The tracker record is the tutors': the grade form's
   strengths and areas for development, letter drafts, a withdrawn letter's history and reason, the decision before a
   malpractice warning. A trainee's pages show only their extensions, an issued letter (its date, signer and text), the
   provisional and final grade on their own tracker view, and the old hand-set stages and withdrawn flag. Everything else
   stays on the staff side. Before this the whole object went to the trainee's browser and only the pages hid it. */
function traineeTracker_(t) {
  if (!t || typeof t !== 'object') return t;
  var out = {};
  ['extensions', 'stage1', 'stage2', 'stage3', 'withdrawn'].forEach(function (k) { if (t[k] !== undefined) out[k] = t[k]; });
  if (t.grades && typeof t.grades === 'object') out.grades = { provisional: t.grades.provisional || '', final: t.grades.final || '' };
  ['failLetter', 'malpracticeLetter'].forEach(function (p) {
    if (!t[p + 'IssuedAt']) return;   // a draft, or a withdrawn letter, is not the trainee's to read
    out[p] = t[p] || ''; out[p + 'IssuedAt'] = t[p + 'IssuedAt']; out[p + 'By'] = t[p + 'By'] || ''; out[p + 'Doc'] = t[p + 'Doc'] || '';
  });
  return out;
}
function foldRecord_(bucket, kind, json, kinds) {
  var n = tpOf_(kind);
  var base = n ? 'tpHistory' : kind;
  if (PRIVATE_KINDS[base] && kinds !== TRAINEE_READS) return;   // the notebook: the trainee's own, never a reader's
  if (!kinds[base] && !TRAINEE_READS[base]) return;
  var data; try { data = JSON.parse(json); } catch (e) { return; }
  if (base === 'tracker' && kinds === TRAINEE_READS) data = traineeTracker_(data);
  if (base !== 'tpHistory') { bucket[kind] = data; return; }
  bucket.tpHistory = bucket.tpHistory || {};
  bucket._tpRows = bucket._tpRows || {};
  if (n) { if (data) bucket.tpHistory[n] = data; bucket._tpRows[n] = 1; return; }
  if (data && typeof data === 'object') Object.keys(data).forEach(function (k) { if (!bucket._tpRows[k] && data[k]) bucket.tpHistory[k] = data[k]; });
}
function finishBucket_(bucket) {
  if (!bucket) return bucket;
  delete bucket._tpRows;
  if (bucket.tpHistory && !Object.keys(bucket.tpHistory).length) delete bucket.tpHistory;
  return bucket;
}
function historyFromRows_(rows, courseId, token) {
  var b = {};
  rows.forEach(function (r) { if (String(r[0]) === String(courseId) && String(r[1]) === token) foldRecord_(b, String(r[2]), r[3], TUTOR_WRITES); });
  finishBucket_(b);
  return b.tpHistory || null;
}
// The history only grows: an entry the caller does not send is kept, and an
// entry it does send replaces the row for that TP alone. One read of the
// sheet, one write per TP that changed, one append for the new ones.
function writeHistory_(courseId, token, data) {
  markChanged_(courseId);
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sh = sheet_(SHEET_RECORDS);
    var last = sh.getLastRow();
    var rows = last >= 2 ? sh.getRange(2, 1, last - 1, 4).getValues() : [];
    var have = historyFromRows_(rows, courseId, token) || {};
    var want = (data && typeof data === 'object') ? data : {};
    var merged = {};
    Object.keys(have).forEach(function (k) { merged[k] = have[k]; });
    Object.keys(want).forEach(function (k) { if (want[k]) merged[k] = want[k]; });
    var rowOf = {};
    rows.forEach(function (r, i) { if (String(r[0]) === String(courseId) && String(r[1]) === token) rowOf[String(r[2])] = i + 2; });
    var appends = [];
    Object.keys(merged).forEach(function (k) {
      if (!/^\d+$/.test(k)) return;
      var kind = 'tpHistory:' + k;
      var json = JSON.stringify(merged[k]);
      assertFits_(json, kind);
      if (rowOf[kind]) { if (String(rows[rowOf[kind] - 2][3]) !== json) sh.getRange(rowOf[kind], 4, 1, 2).setValues([[json, new Date()]]); }
      else appends.push([courseId, token, kind, json, new Date()]);
    });
    if (appends.length) sh.getRange(sh.getLastRow() + 1, 1, appends.length, 5).setValues(appends);
    if (rowOf['tpHistory']) sh.getRange(rowOf['tpHistory'], 4, 1, 2).setValues([['null', new Date()]]);
  } finally { lock.releaseLock(); }
}

// ---- the owner ---------------------------------------------------------------
// One secret for the whole store, held only by Ramy. Run ownerKey() in the
// editor to read it; it is never returned to an unauthenticated call.
function ownerKey() {
  var props = PropertiesService.getScriptProperties();
  var k = props.getProperty('OWNER_KEY');
  if (!k) { k = newKey_(); props.setProperty('OWNER_KEY', k); }
  // The whole link, ready to click -- not the bare key. Ramy, 21 Sep 2026, on
  // being told to paste a key onto the end of a URL: "I don't understand what
  // you're talking about." Nothing should ask him to assemble an address.
  var link = 'https://lite.celtaconnect.com/14_owner.html?o=' + k;
  Logger.log('Open this link once, then bookmark it:');
  Logger.log(link);
  return link;
}
function isOwner_(o) {
  o = String(o || '').trim();
  if (!o) return false;
  var k = PropertiesService.getScriptProperties().getProperty('OWNER_KEY');
  return !!k && o === k;
}
function requireOwner_(owner) { if (!owner) throw new Error('Not yours to open'); }
// c1, c2, c3... whichever is free.
/* Every course the owner has, with the centre's own name for it, how many
   trainees are on it and both its links -- built from ONE read of each sheet
   and ONE read of the properties.

   It used to be a .map over the courses in which each pass called
   courseRead_() (a full read of the course sheet), roster_() (a full read of
   the trainees sheet) and courseKey_() twice (a property read each). So
   listing N courses cost 2N+1 sheet reads and 2N property reads, and every
   course Ramy sold made the console slower for every course after it. */
/* ---------- questions: the helpers (v173) ---------- */
function questionAdd_(pool, item) {
  var list = (pool.items || []).filter(function (q) { return q && q.id !== item.id; });
  list.push(item);
  pool.items = list.length > 400 ? list.slice(list.length - 400) : list;
  return pool;
}
function questionClean_(course, req, asker) {
  var text = String(req.text || '').replace(/\s+/g, ' ').trim().slice(0, 500);
  var hasAudio = !!String(req.bytes || '');
  if (!text && !hasAudio) throw new Error('Nothing to ask');
  var q = {
    id: Utilities.getUuid().slice(0, 12), at: new Date().toISOString(),
    token: asker.token || '', name: String(asker.name || '').slice(0, 80), group: asker.group || '',
    session: { k: String((req.session && req.session.k) || 'input').slice(0, 12), id: String((req.session && req.session.id) || '').slice(0, 80),
               title: String((req.session && req.session.title) || '').slice(0, 120), date: String((req.session && req.session.date) || '').slice(0, 10) },
    to: String(req.to || '').trim().slice(0, 80), text: text, audio: null, state: 'open', answeredAt: '', answeredBy: ''
  };
  if (hasAudio) {
    var bytes = Utilities.base64Decode(String(req.bytes));
    if (!bytes.length) throw new Error('Nothing was recorded');
    if (bytes.length > 1.5 * 1024 * 1024) throw new Error('That recording is too long. Keep a question to thirty seconds.');
    var type = String(req.type || '').split(';')[0]; if (!/^audio\//.test(type)) type = 'audio/webm';
    var ext = type.indexOf('mp4') >= 0 ? 'm4a' : type.indexOf('ogg') >= 0 ? 'ogg' : type.indexOf('mpeg') >= 0 ? 'mp3' : 'webm';
    var f = notebookFolder_(course).createFile(Utilities.newBlob(bytes, type, 'Question ' + q.name + ' ' + q.at.slice(0, 16).replace('T', ' ') + '.' + ext));
    f.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
    f.setDescription(JSON.stringify({ question: q.id, by: q.name }));
    q.audio = { id: f.getId(), seconds: Math.min(60, Number(req.seconds) || 0), mime: type };
    /* the words, for the wall and the notebook (v174): the recording stays the question, the text is a convenience */
    var oKey = PropertiesService.getScriptProperties().getProperty('OPENAI_KEY');
    if (oKey) {
      try {
        var tr = UrlFetchApp.fetch('https://api.openai.com/v1/audio/transcriptions', { method: 'post', muteHttpExceptions: true, headers: { Authorization: 'Bearer ' + oKey },
          payload: { file: f.getBlob(), model: 'gpt-4o-transcribe', response_format: 'text', language: 'en' } });
        if (tr.getResponseCode() === 200) q.heard = String(tr.getContentText() || '').trim().slice(0, 600);
      } catch (e) { /* the voice is there either way */ }
    }
  }
  return q;
}
/* A copy in the tutor's notebook, under the session it came from (v174; Ramy: "it lands in the tutor's notebook"). */
function questionToNotebook_(courseId, q) {
  if (!q || !q.to) return;
  try {
    var who = tutorWho_(q.to), words = q.text || q.heard || '';
    var note = noteClean_({ id: 'q-' + q.id, at: q.at, day: q.session.date || q.at.slice(0, 10),
      thread: q.session.k === 'room' ? { k: 'input', id: 'room', t: 'Questions from the room' } : { k: 'input', id: q.session.id, t: q.session.title },
      text: 'Question from ' + q.name + (words ? ': \u201c' + words + '\u201d' : '') + (q.audio ? ' (asked by voice; it plays on the question wall)' : '') }, q.name);
    if (!note) return;
    courseUpdateObj_(courseId, 'tutorNotes', function (pool) {
      var list = (pool[who] || []).filter(function (x) { return x && x.id !== note.id; });
      list.push(note); list.sort(function (a, b) { return String(a.at).localeCompare(String(b.at)); });
      pool[who] = list.length > 400 ? list.slice(list.length - 400) : list;
      return pool;
    });
  } catch (e) { /* the wall has it either way */ }
}
/* The room asks (ask.html). No key: the course's own ask code, a name, a question, and a ceiling on how many a name may send. */
function roomAsk_(req) {
  var c = courseById_(String(req.course || '').trim());
  if (!c || c.deleted) throw new Error('This question page is not open');
  var st = courseRead_(c.id, 'settings') || {};
  var code = String(req.code || '');
  if (!st.askCode || code.length < 8 || code !== String(st.askCode)) throw new Error('This question page is not open');
  var name = String(req.name || '').replace(/\s+/g, ' ').trim().slice(0, 60);
  if (!name) throw new Error('Your name first');
  var cache = CacheService.getScriptCache(), ck = 'rq:' + c.id + ':' + name.toLowerCase().slice(0, 40) + ':' + Utilities.formatDate(new Date(), 'UTC', 'yyyyMMddHH');
  var n = parseInt(cache.get(ck) || '0', 10);
  if (n >= 12) throw new Error('That is a lot of questions this hour. Ask the rest out loud.');
  var to = String(st.askTo || '').trim() || String(st.tutorNames || '').split(/[,\n;]+/)[0].trim();
  var item = questionClean_(c, { text: req.text, bytes: req.bytes, type: req.type, seconds: req.seconds, to: to,
                                 session: { k: 'room', id: 'room', title: 'Questions from the room', date: String(st.presentToday || '') } },
                            { token: 'room', name: name, group: '' });
  courseUpdateObj_(c.id, 'questions', function (pool) { return questionAdd_(pool, item); });
  questionToNotebook_(c.id, item);
  cache.put(ck, String(n + 1), 3600);
  return { asked: true };
}
function ownerList_() {
  var list = courses_(true);   // the bin too, marked, so the console can offer to put a course back
  if (!list.length) return [];

  // v77 (8 Oct 2026): a course whose settings outgrew one cell (a centre's
  // logo is enough) keeps them as settings#0, #1, ... and this list used to
  // read only the plain row -- so c5 showed with no centre name and could
  // not show as a ticket book. The pieces are joined here, as courseRead_
  // joins them, in one pass over the sheet.
  var settings = {}, plainS = {}, partsS = {};
  var csh = sheet_(SHEET_COURSE), clast = csh.getLastRow();
  if (clast >= 2) {
    csh.getRange(2, 1, clast - 1, 3).getValues().forEach(function (r) {
      var id = String(r[0]), k = String(r[1]);
      if (k === 'settings') { plainS[id] = r[2]; return; }
      var ix = chunkIndex_(k, 'settings');
      if (ix >= 0) { (partsS[id] = partsS[id] || [])[ix] = r[2]; }
    });
  }
  Object.keys(plainS).concat(Object.keys(partsS)).forEach(function (id) {
    if (settings[id]) return;
    var json = (plainS[id] !== undefined && String(plainS[id]) !== '') ? String(plainS[id]) : null;
    if (json === null && partsS[id]) {
      var ps = partsS[id], whole = true;
      for (var j = 0; j < ps.length; j++) if (ps[j] === undefined) { whole = false; break; }
      if (whole) json = ps.join('');
    }
    if (json === null) return;
    try { settings[id] = JSON.parse(json) || {}; } catch (e) {}
  });

  var counts = {};
  var tsh = sheet_(SHEET_TRAINEES), tlast = tsh.getLastRow();
  if (tlast >= 2) {
    tsh.getRange(2, 1, tlast - 1, 2).getValues().forEach(function (r) {
      if (!String(r[1]).trim()) return;
      var id = String(r[0]); counts[id] = (counts[id] || 0) + 1;
    });
  }

  // Keys are minted on demand, so a course listed before either of its links
  // has been asked for gets them here -- all of them in one write, not one
  // property write per course.
  var props = PropertiesService.getScriptProperties();
  var all = props.getProperties(), minted = {};
  function keyOf(kind, id) {
    var name = keyProp_(kind, id);
    if (!all[name]) { all[name] = newKey_(); minted[name] = all[name]; }
    return all[name];
  }
  var out = list.map(function (c) {
    // The centre's own words win once they have set them, so a course that
    // was minted as "C3 / 21 Sep 2026" becomes their course name by itself.
    var s = settings[c.id] || {};
    return {
      id: c.id, name: c.name, created: c.created,
      deleted: c.deleted || '',
      goesOn: c.deleted ? Utilities.formatDate(new Date(new Date(c.deleted).getTime() + BIN_DAYS * 86400000), Session.getScriptTimeZone(), 'yyyy-MM-dd') : '',
      centreName: s.centreName || '', centreNumber: s.centreNumber || '', courseName: s.courseName || '',
      // v76 (8 Oct 2026): which card the course's links open on, so the
      // console can show the course as a ticket book when it is the ticket.
      cardStyle: s.cardStyle === 'ticket' ? 'ticket' : '',
      start: s.start || '', end: s.end || '',
      demoToday: s.demoToday || '',     // v50: the console marks a pinned demo course
      presentToday: s.presentToday || '',   // v166: and a Connect demo
      presentFor: s.presentFor || '', demoExpires: s.demoExpires || '',
      trainees: counts[c.id] || 0,
      tutorKey: keyOf('tutor', c.id),
      assessorKey: keyOf('assessor', c.id)
    };
  });
  if (Object.keys(minted).length) props.setProperties(minted);
  return out;
}

/* v74: every centre this account has made a course for. */
function centreBook_() {
  var sh = sheet_(SHEET_CENTRES), last = sh.getLastRow();
  var out = {};
  if (last < 2) return out;
  sh.getRange(2, 1, last - 1, 2).getValues().forEach(function (r) {
    var n = String(r[0] || '').trim().toUpperCase();
    if (n && String(r[1] || '').trim()) out[n] = String(r[1]).trim();
  });
  return out;
}
/* Remember a number and its centre. A name typed over an old one wins: the
   owner correcting the book is the only way it is ever corrected. */
function centreRemember_(number, name) {
  number = String(number || '').trim().toUpperCase();
  name = String(name || '').trim().slice(0, 120);
  if (!number) return;
  var sh = sheet_(SHEET_CENTRES), last = sh.getLastRow();
  var rows = last >= 2 ? sh.getRange(2, 1, last - 1, 4).getValues() : [];
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][0] || '').trim().toUpperCase() !== number) continue;
    var made = (parseInt(rows[i][3], 10) || 0) + 1;
    sh.getRange(i + 2, 2, 1, 3).setValues([[name || rows[i][1], rows[i][2] || new Date(), made]]);
    return;
  }
  if (name) sh.appendRow([number, name, new Date(), 1]);
}
/* v74: a list of centres, appended in one go. The book normally learns one
   course at a time; this is how it starts full, from Cambridge's public list
   (store/centres-seed.tsv), without the owner pasting into the Sheet. A number
   already in the book is left alone, so the seed can never overwrite a name
   the owner typed. */
function centresSeed_(rows) {
  var book = centreBook_(), sh = sheet_(SHEET_CENTRES), add = [];
  (rows || []).forEach(function (r) {
    var n = String((r && r[0]) || '').trim().toUpperCase();
    var name = String((r && r[1]) || '').trim().slice(0, 120);
    if (!n || !name || book[n]) return;
    if (!/^([A-Z]{2})?\d{3,5}[A-Z]?$/.test(n)) return;
    book[n] = name;
    add.push([n, name, '', 0]);
  });
  if (add.length) sh.getRange(sh.getLastRow() + 1, 1, add.length, 4).setValues(add);
  return add.length;
}

function nextCourseId_() {
  var used = {};
  courses_(true).forEach(function (c) { used[c.id] = 1; });   // a binned id stays taken: a reused id would inherit its rows
  for (var i = 1; i < 10000; i++) if (!used['c' + i]) return 'c' + i;
  throw new Error('Too many courses');
}

/* The shorthand tutors write, for the note tidier and Stage 1: Lite's own TP points glossary
   (24_tp_points.html GLOSSARY), the acronyms and terms of the CELTA glossary the C/17 course
   used, and note-taking shorthand (Ramy, 27 Oct 2026: "use the glossary from C17 ... and the one
   we have at the bottom of TP points"). The C/17 terms are named, not quoted. */
function celtaShorthand_() {
  return 'The tutor writes in CELTA shorthand. From the TP points: SB = student\'s book; WB = workbook; p. = page; HO = handout; AK = answer key; TL = target language; '
    + 'MFP = meaning, form and pronunciation; CCQ = concept checking question; ICQ = instruction checking question; ECDW = elicit, CCQ, drill, write; PW = pair work; GW = group work; '
    + 'PC = peer check; Ind. = individually; OC = open class; WC = whole class; Ming. = mingle; T–S = teacher to students; S–S = student to student; FB = feedback; '
    + 'WCFB = whole class feedback; TTT = teacher talking time; STT = student talking time. '
    + 'From the CELTA glossary: MFPA = meaning, form, pronunciation and appropriacy; L1 = the learner\'s first language; L2 = their second language; TBL = task-based learning; '
    + 'TPR = Total Physical Response; CALL = computer assisted language learning; DOS/ADOS = Director and Assistant Director of Studies; EAP, ESP, ESOL, ELT, IELTS as usual. '
    + 'Terms tutors use as written: appropriacy, backchaining, choral and individual drilling, cline, concept questions, connected speech, controlled and freer practice, '
    + 'deducing meaning from context, elicit, finger highlighting, grade (language), guided discovery, language feedback, lead-in, lexical set, live listening, monitor, nominate, '
    + 'peer check, realia, reformulate, receptive and productive skills, sub-skills, student-centred and teacher-centred, timelines, top-down and bottom-up, weak forms, word stress. '
    + 'Note-taking shorthand: Ss or sts = students; T = teacher; EC = error correction; DEC = delayed error correction; instr = instructions; demo = demonstration; ex = exercise; '
    + 'BW = board work; monit = monitoring; pron = pronunciation; voc or vocab = vocabulary; gram = grammar; prep = preparation; LA = language analysis; GD = guided discovery; '
    + 'PPP = presentation, practice, production; v = very; + = and; w/ = with; w/o = without; b4 = before. ';
}

// ---- keys --------------------------------------------------------------------
function requireTutor_(tutor) { if (!tutor) throw new Error('Tutors only'); }

/* PINs (v87): four to twelve letters or numbers; SHA-256 over salt + pin, hex. The salt is a
   fresh uuid per setting, so two people with the same digits do not share a
   hash. */
function pinEntry_(raw) {
  var pin = String(raw == null ? '' : raw).replace(/\s+/g, '');
  if (!pin) return null;
  if (!/^[A-Za-z0-9]{4,12}$/.test(pin)) throw new Error('A PIN is four to twelve letters or numbers');
  var salt = Utilities.getUuid();
  return { hash: pinHash_(pin, salt), salt: salt, set: new Date().toISOString() };
}
function pinHash_(pin, salt) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(salt) + ':' + String(pin), Utilities.Charset.UTF_8);
  return bytes.map(function (b) { return ('0' + (b & 255).toString(16)).slice(-2); }).join('');
}

// The end of the course's last day, from that course's settings; null while no
// end is set. It was the end date plus fourteen days until 29 Sep 2026 -- ours,
// chosen to match the assessor's two-week reporting deadline (Handbook 15.2);
// Cambridge sets no expiry on assessor access at all. Ramy: "let's just end it
// when the course ends" -- another link can always be issued.
/* When a record is stamped (v49). A real course stamps now. A DEMO course
   pinned to a day (settings.demoToday) may be told the moment instead, so a
   seed can plant a post "on day 4" of a course that is for ever on day 6;
   without the pin, `at` is ignored. Never a way to backdate a real record. */
   /* v73 (6 Oct 2026). What of the stream each reader gets. The tutor key sees
   everything: posts scheduled for later (`publishAt` ahead) and posts carried
   from the last course (`draft`). A candidate, and the assessor, see only
   what has gone out. A demo course pinned to a day (settings.demoToday) is
   "now" at the end of that day, so a seeded post scheduled for it shows. */
function streamFor_(course, list, tutor) {
  list = Array.isArray(list) ? list : [];
  if (tutor) return list;
  var s = course ? courseRead_(course.id, 'settings') : null;
  var now = courseDay_(s) ? new Date(courseDay_(s) + 'T23:59:59Z').getTime() : Date.now();
  return list.filter(function (p) {
    if (!p || p.draft) return false;
    if (!p.publishAt) return true;
    var t = new Date(String(p.publishAt)).getTime();
    return isNaN(t) || t <= now;
  });
}
function pinnedAt_(course, at) {
  var s = course ? courseRead_(course.id, 'settings') : null;
  if (s && s.demoToday && /^\d{4}-\d{2}-\d{2}T/.test(String(at || ''))) return String(at);
  return new Date().toISOString();
}
function assessorExpiry_(courseId) {
  var s = courseRead_(courseId, 'settings');
  /* A demo course pinned to a day (v48, settings.demoToday) never ages, so
     its assessor link never expires either. Never set on a real course. */
  if (s && s.demoToday) return null;
  if (!s || !s.end || !/^\d{4}-\d{2}-\d{2}$/.test(String(s.end))) return null;
  var d = new Date(String(s.end) + 'T23:59:59');
  if (isNaN(d.getTime())) return null;
  return d;
}
function assertAssessorInDate_(course) {
  var exp = assessorExpiry_(course.id);
  if (exp && new Date() > exp) throw new Error('This assessor link expired on ' + exp.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }));
}

// Read the tutor link's key for a course, from the editor. Logged, never
// returned to an unauthenticated call.
function tutorKey() {
  migrate_();
  var c = courses_()[0];
  if (!c) { Logger.log('no courses yet'); return ''; }
  Logger.log(c.id + ' ' + c.name + ' ' + courseKey_('tutor', c.id));
  return courseKey_('tutor', c.id);
}

/**
 * One Drive folder per course, made on first use and remembered by id.
 * Ramy, 23 Sep 2026: "one course folder" -- not one per candidate. The file
 * names carry the candidate, and a folder per person would be a filing system
 * nobody asked for.
 */
function materialsFolder_(course){
  var props = PropertiesService.getScriptProperties();
  var propKey = 'MATS_FOLDER_' + course.id;
  var id = props.getProperty(propKey);
  var name = materialsFolderName_(course);
  if (id) {
    try {
      var had = DriveApp.getFolderById(id);
      if (had.getName() !== name) had.setName(name);
      return had;
    } catch (e) { /* deleted or moved: make a new one */ }
  }
  var folder = matsRoot_().createFolder(name);
  props.setProperty(propKey, folder.getId());
  return folder;
}

/**
 * Ramy, 12 Oct 2026: every course has its own folder, and the name says whose
 * it is -- centre, centre number, course -- so a folder still reads a year on.
 * The name follows Course admin: a course renamed there is renamed here at its
 * next upload. The id is what is remembered, so links never change.
 */
function materialsFolderName_(course){
  var set = {};
  try { set = courseRead_(course.id, 'settings') || {}; } catch (e) {}
  var parts = [set.centreName, set.centreNumber, set.courseName || course.name || course.id]
    .map(function (x) { return String(x || '').trim(); }).filter(Boolean);
  return parts.join(' · ');
}

/**
 * The one folder every course's materials folder lives inside.
 *
 * DriveApp.createFolder makes a folder at the ROOT of the running account's
 * Drive, so every course Lite has ever had put another loose folder beside
 * everything else in My Drive. That is untidy today and worse at the moment
 * the data moves into a Shared Drive, which is the plan -- it would arrive
 * scattered instead of filed (27 Sep 2026).
 *
 * Remembered by id like everything else here, so moving it later changes
 * nothing: a folder keeps its id when it moves, including into a Shared Drive.
 */
/** Where the shared assets live: one folder under the materials root, remembered by id. */
/* WHERE A CONTRIBUTED SET LANDS. Its own folder, made by the script and shared
   with nobody, so a set offered to the Pool is private until Connect puts it in
   the library. Nothing in this file reads it back: there is no op that returns
   a contribution, by design. */
function contributionsFolder_(){
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('OFFERS_FOLDER');
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) {} }
  var f = matsRoot_().createFolder('Connect Lite contributions');
  props.setProperty('OFFERS_FOLDER', f.getId());
  return f;
}
function assetsFolder_(){
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('ASSETS_FOLDER');
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) {} }
  var f = matsRoot_().createFolder('Connect Lite assets');
  props.setProperty('ASSETS_FOLDER', f.getId());
  return f;
}
function matsRoot_(){
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('MATS_ROOT');
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) { /* deleted: make another */ } }
  var root = DriveApp.createFolder('Connect Lite');
  props.setProperty('MATS_ROOT', root.getId());
  return root;
}

/**
 * One-off, run from this editor: file every course folder that already exists
 * under MATS_ROOT. Safe to run twice -- a folder already there is left alone,
 * and one that has been deleted is counted, not thrown.
 */
function tidyMaterialsFolders(){
  var props = PropertiesService.getScriptProperties();
  var root = matsRoot_();
  var all = props.getProperties();
  var moved = 0, already = 0, gone = 0;
  Object.keys(all).forEach(function(k){
    if (k.indexOf('MATS_FOLDER_') !== 0) return;
    try {
      var f = DriveApp.getFolderById(all[k]);
      var ps = f.getParents(), inRoot = false;
      while (ps.hasNext()) { if (ps.next().getId() === root.getId()) inRoot = true; }
      if (inRoot) { already++; return; }
      f.moveTo(root);
      moved++;
    } catch (e) { gone++; }
  });
  Logger.log('Course folders: ' + moved + ' moved into "Connect Lite", ' + already + ' already there, ' + gone + ' missing.');
  Logger.log('MATS_ROOT = ' + root.getId());
  return moved;
}

/**
 * What a course's materials folder holds, without opening anything.
 * Returns zeroes rather than throwing when the course never had one -- a
 * course with no attachments is the normal case, not an error.
 */
function materialsInfo_(courseId){
  if (!courseId) return { files: 0, bytes: 0, exists: false };
  var id = PropertiesService.getScriptProperties().getProperty('MATS_FOLDER_' + courseId);
  if (!id) return { files: 0, bytes: 0, exists: false };
  var folder;
  try { folder = DriveApp.getFolderById(id); } catch (e) { return { files: 0, bytes: 0, exists: false }; }
  if (folder.isTrashed()) return { files: 0, bytes: 0, exists: false };
  var files = folder.getFiles(), n = 0, bytes = 0;
  while (files.hasNext()) { var f = files.next(); n++; bytes += f.getSize(); }
  return { files: n, bytes: bytes, exists: true, name: folder.getName(), url: folder.getUrl() };
}

/**
 * Trash a course's materials folder and forget it. Trashed, not destroyed:
 * Drive keeps it for 30 days, which is the right amount of caution for
 * somebody else's teaching materials.
 */
function trashMaterials_(courseId){
  var props = PropertiesService.getScriptProperties();
  var propKey = 'MATS_FOLDER_' + courseId;
  var id = props.getProperty(propKey);
  if (!id) return { files: 0, folder: false };
  var info = materialsInfo_(courseId);
  try { DriveApp.getFolderById(id).setTrashed(true); } catch (e) { /* already gone */ }
  props.deleteProperty(propKey);
  return { files: info.files, folder: true };
}

/* ---------- the nightly backup of the records Sheet ---------- */

var BACKUP_KEEP = 30;

function backupFolder_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('BACKUP_FOLDER');
  if (id) {
    try { return DriveApp.getFolderById(id); } catch (e) {}
  }
  var it = DriveApp.getFoldersByName('CELTA hub backups');
  var folder = it.hasNext() ? it.next() : DriveApp.createFolder('CELTA hub backups');
  props.setProperty('BACKUP_FOLDER', folder.getId());
  return folder;
}

function nightlyBackup() {
  var props = PropertiesService.getScriptProperties();
  var stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  var name = 'Connect Lite backup ' + stamp;
  var folder = backupFolder_();

  if (folder.getFilesByName(name).hasNext()) {
    props.setProperty('BACKUP_LAST', stamp);
    return name + ' was already there';
  }

  var srcId = props.getProperty('SPREADSHEET_ID');
  if (!srcId) throw new Error('No SPREADSHEET_ID, so nothing to back up');
  DriveApp.getFileById(srcId).makeCopy(name, folder);

  /* Prune only copies this function wrote. The older 'Connect Hub backup'
     files are the pre-migration history and are left alone. */
  var mine = [];
  var all = folder.getFiles();
  while (all.hasNext()) {
    var f = all.next();
    if (/^Connect Lite backup \d{4}-\d{2}-\d{2}$/.test(f.getName())) mine.push(f);
  }
  mine.sort(function (a, b) { return b.getName().localeCompare(a.getName()); });
  var dropped = 0;
  for (var i = BACKUP_KEEP; i < mine.length; i++) { mine[i].setTrashed(true); dropped++; }

  props.setProperty('BACKUP_LAST', stamp);
  var after = nightlyAfterBackup_(stamp);
  return 'wrote ' + name + '; kept ' + Math.min(mine.length, BACKUP_KEEP) + ', trashed ' + dropped + '; ' + after;
}

/* ---------- after the backup: the bin, and the count of every course ---------- */

var BIN_DAYS = 30;

/* Runs once a night, only after the night's copy is on Drive, so anything it
   removes is in a backup first. Two jobs. ONE: a course that has sat in the
   bin for BIN_DAYS goes for good -- one course a night, so a run can never
   outlast Apps Script's time limit halfway through a second course. TWO: the
   watch. Every course's rows are counted and compared with last night's; a
   course that LOST records or trainees overnight is mailed to the owner with
   the backup to restore from, before anyone notices it on a page. A tutor
   removing a trainee shows here too, and the mail says so. */
function nightlyAfterBackup_(stamp) {
  var props = PropertiesService.getScriptProperties();
  var out = [];
  try {
    var cutoff = Date.now() - BIN_DAYS * 86400000;
    var due = courses_(true).filter(function (c) { return c.deleted && new Date(c.deleted).getTime() <= cutoff; })
      .sort(function (a, b) { return a.deleted.localeCompare(b.deleted); })[0];
    if (due) { var gone = purgeCourse_(due.id); out.push('purged ' + due.id + ' (' + gone.trainees + ' trainees, ' + gone.records + ' records)'); }
    else out.push('nothing due from the bin');
  } catch (e) { out.push('purge failed: ' + e); }
  try {
    var counts = rowCounts_();
    var before = {};
    try { before = JSON.parse(props.getProperty('COUNTS_LAST') || '{}'); } catch (e) {}
    var lost = [];
    courses_().forEach(function (c) {
      var was = before[c.id], now = counts[c.id] || { trainees: 0, records: 0 };
      if (!was) return;
      if (now.records < was.records || now.trainees < was.trainees) lost.push(c.id + ' (' + (c.name || '') + '): records ' + was.records + ' \u2192 ' + now.records + ', trainees ' + was.trainees + ' \u2192 ' + now.trainees);
    });
    props.setProperty('COUNTS_LAST', JSON.stringify(counts));
    if (lost.length) {
      var to = Session.getEffectiveUser().getEmail();
      if (to) MailApp.sendEmail({ to: to, name: 'Connect Lite',
        subject: 'Connect Lite: ' + lost.length + ' course' + (lost.length === 1 ? '' : 's') + ' lost rows overnight',
        body: 'Since last night these courses have fewer rows in the store:\n\n' + lost.join('\n') + '\n\nA tutor removing a trainee, or a resubmission replacing a record, shows here too. If it was not that, restore from last night\'s backup with restoreFromBackup, dry run first:\n  Connect Lite backup ' + (props.getProperty('BACKUP_PREV') || '(the night before)') + '\n\nThe store: ' + dataSheetUrl() });
      out.push('mailed about ' + lost.length);
    } else out.push('counts steady');
    props.setProperty('BACKUP_PREV', stamp);
  } catch (e) { out.push('count check failed: ' + e); }
  return out.join('; ');
}
function rowCounts_() {
  var counts = {};
  var bump = function (id, k) { var c = counts[id] = counts[id] || { trainees: 0, records: 0 }; c[k]++; };
  var t = sheet_(SHEET_TRAINEES), tl = t.getLastRow();
  if (tl >= 2) t.getRange(2, 1, tl - 1, 2).getValues().forEach(function (r) { if (String(r[1]).trim()) bump(String(r[0]), 'trainees'); });
  var rr = sheet_(SHEET_RECORDS), rl = rr.getLastRow();
  if (rl >= 2) rr.getRange(2, 1, rl - 1, 1).getValues().forEach(function (r) { if (String(r[0]).trim()) bump(String(r[0]), 'records'); });
  return counts;
}
/* The rows go. Under the script lock (24 Oct 2026: two deletes running
   together, each on row numbers read at its start, took other courses' rows),
   in blocks, this course only, and it must already be in the bin. Its two
   secrets go with it so the links cannot outlive it, and its materials folder
   goes to Drive's trash (23 Sep 2026: an orphan folder nobody would find). */
function purgeCourse_(id) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) throw new Error('Another change is running on the store. Try again in a minute.');
  try {
    var c = courses_(true).filter(function (x) { return x.id === id; })[0];
    if (!c) throw new Error('No such course');
    if (!c.deleted) throw new Error('Not in the bin: ' + id);
    var removed = {
      trainees: deleteRowsWhere_(SHEET_TRAINEES, function (r) { return String(r[0]) === id; }),
      records: deleteRowsWhere_(SHEET_RECORDS, function (r) { return String(r[0]) === id; }),
      settings: deleteRowsWhere_(SHEET_COURSE, function (r) { return String(r[0]) === id; })
    };
    deleteRowsWhere_(SHEET_COURSES, function (r) { return String(r[0]) === id; });
    var props = PropertiesService.getScriptProperties();
    props.deleteProperty(keyProp_('tutor', id));
    props.deleteProperty(keyProp_('assessor', id));
    removed.materials = trashMaterials_(id);
    return removed;
  } finally { lock.releaseLock(); }
}
