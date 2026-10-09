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

var SHEET_COURSES  = 'courses';   // id | name | created   (the keys are NOT here -- see below)
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
var TRAINEE_WRITES = { plan:1, selfeval:1, assignments:1, observations:1, celta5:1, agreement:1, tpHistory:0 };// staffLinks: about a candidate, for the tutors and the assessor only -- deliberately absent from TRAINEE_READS (28 Sep 2026)
var TUTOR_WRITES = { plan:1, selfeval:1, feedback:1, assignments:1, tracker:1, observations:1, links:1, staffLinks:1, celta5:1, celta5t:1, tpHistory:1 };
// links: a candidate's private links (their CELTA 5, a reading), written by the tutor, read by the candidate (28 Sep 2026)
var TRAINEE_READS = { plan:1, selfeval:1, feedback:1, assignments:1, tracker:1, observations:1, links:1, celta5:1, celta5t:1, agreement:1, tpHistory:1 };
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
  if (!tp) return null;
  var now = set.demoToday ? localInstant_(String(set.demoToday), '09:00', tz) : new Date();
  var days = (tt.days || []).filter(function (d) { return d && d.tp && d.date; });
  for (var i = 0; i < days.length; i++) {
    var start = localInstant_(days[i].date, tp.from, tz);
    if (start.getTime() > now.getTime() - 3 * 36e5) return { day: days[i].date, tp: days[i].tp, from: tp.from, to: tp.to || '', startISO: start.toISOString() };
  }
  return null;
}
// How many are coming to the next class, without a name.
function comingFor_(courseId) {
  var nx = nextClass_(courseId); if (!nx) return null;
  var reg = courseRead_(courseId, 'volunteers') || {};
  var yes = 0, no = 0, none = 0;
  (reg.students || []).forEach(function (s) { if (!s) return; var r = (s.replies || {})[nx.day]; if (r && r.coming === 'yes') yes++; else if (r && r.coming === 'no') no++; else none++; });
  return { day: nx.day, tp: nx.tp, from: nx.from, yes: yes, no: no, noAnswer: none, total: yes + no + none };
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
   "those should be coming from the centre... make it info"). No mail system
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
var FROM_ = 'lite@celtaconnect.com';
var FROM_OK_ = null;
function sendAs_(msg) {
  if (FROM_OK_ === null) {
    try { FROM_OK_ = GmailApp.getAliases().indexOf(FROM_) !== -1; } catch (e) { FROM_OK_ = false; }
  }
  if (!FROM_OK_) { MailApp.sendEmail(msg); return; }
  var opt = { htmlBody: msg.htmlBody, name: msg.name, replyTo: msg.replyTo, from: FROM_ };
  if (msg.bcc) opt.bcc = msg.bcc;
  GmailApp.sendEmail(msg.to, msg.subject, msg.body || '', opt);
}
function sendVolunteerReminders() {
  notifyFeedback_();
  notifyReports_();
  var now = new Date();
  courses_().forEach(function (c) {
    try {
      var set = courseRead_(c.id, 'settings') || {};
      if (set.demoToday) return;
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
      var what = 'Teaching practice' + (rooms.length === 1 && rooms[0].level ? ' (' + rooms[0].level + ')' : '');
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
  try {
    var out = handle_(req);
    return json_({ ok: true, result: out });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function handle_(req) {
  migrate_();
  var op = String(req.op || '');

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
  if (assessor && !/^(ping|boot|me|get|course|roster|celta5Assets)$/.test(op)) throw new Error('The assessor link is read-only');

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
  if (vol && op !== 'boot' && op !== 'ping' && op !== 'volunteerAgree' && op !== 'volunteerReply' && op !== 'volunteerNotify') throw new Error('This link only opens your own page');
  // A trainee's token names their course, and it must agree with any key sent.
  var me = null;
  if (req.token) {
    me = traineeAnywhere_(String(req.token));
    if (course && me.course !== course.id) throw new Error('This link is not on the course');
    if (!course) course = courseById_(me.course);
  }
  var reader = tutor || assessor;
  var owner = isOwner_(req.owner);

  switch (op) {
    case 'ping': return { tutor: tutor, assessor: assessor, owner: owner, time: new Date().toISOString() };

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
      courses_().forEach(function (c) {
        var set = courseRead_(c.id, 'settings') || {};
        if (set.demoToday || /scratch/i.test(String(c.name || ''))) return;
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

        var ros = courseRead_(c.id, 'roster') || {};
        var people = ros.trainees || {};
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
      var iSh = sheet_(iName), iLast = iSh.getLastRow(), iCol = HEADERS[iName].length;
      if (iLast < 2) return { marked: 0 };
      var iVals = iSh.getRange(2, 1, iLast - 1, iCol).getValues(), iN = 0;
      for (var iz = 0; iz < iVals.length; iz++) {
        if (iHit(iVals[iz])) { iSh.getRange(iz + 2, iCol).setValue(String(req.state || 'done')); iN++; }
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
      sheet_(SHEET_OFFERS).appendRow([new Date(), cBy, cBook, cLevel, cSlots, cStages,
        String(req.centre || '').slice(0, 80), cFile.getUrl(), 'new']);
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
      return { saved: true };
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
    case 'ownerCourses': {
      requireOwner_(owner);
      return { courses: ownerList_() };
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
      if (!/^([A-Z]{2})?\d{3,5}[A-Z]?$/.test(centreNumber)) throw new Error('A course needs its Cambridge centre number, e.g. TR001 or 10294');
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
      ['centreName', 'centreNumber', 'centreLocked', 'logo', 'tutorNames', 'tutorColours', 'planDueNote', 'selfDueNote', 'tpCount', 'totalHours', 'deliveryMode', 'appianUrl', 'courseLinks',
       'agreement', 'preCourseConnect', 'gtkyWhen', 'gtkyMinutes', 'tutorContacts', 'volunteerContact', 'onlineRooms', 'timeZone', 'clock', 'planFrom', 'analysisFrom', 'volunteerCertificateHours'].forEach(function (k) { if (s[k] !== undefined && s[k] !== '' && s[k] !== null) keep[k] = s[k]; });
      /* Of the assessor's documents only the centre's own agreement link is the centre's. */
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
      if (w && typeof w === 'object') { for (var wk in w) { if (w[wk] && typeof w[wk] === 'object' && !Array.isArray(w[wk])) w[wk].released = false; } }
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
    // Destructive, and the only op that is. The dialog does the asking; this
    // asks again in its own terms -- the caller must name the course twice,
    // so a stray or repeated request cannot delete one by accident.
    case 'deleteCourse': {
      requireOwner_(owner);
      var did = String(req.course || '').trim();
      if (!did) throw new Error('Which course?');
      if (String(req.confirm || '') !== did) throw new Error('Deleting a course needs its id as confirmation');
      if (!courseById_(did)) throw new Error('No such course');
      var removed = {
        trainees: deleteRowsWhere_(SHEET_TRAINEES, function (r) { return String(r[0]) === did; }),
        records: deleteRowsWhere_(SHEET_RECORDS, function (r) { return String(r[0]) === did; }),
        settings: deleteRowsWhere_(SHEET_COURSE, function (r) { return String(r[0]) === did; })
      };
      deleteRowsWhere_(SHEET_COURSES, function (r) { return String(r[0]) === did; });
      // and its two secrets, so the links cannot outlive the course
      var dprops = PropertiesService.getScriptProperties();
      dprops.deleteProperty(keyProp_('tutor', did));
      dprops.deleteProperty(keyProp_('assessor', did));
      // ...and its materials. Deleting a course used to leave its Drive folder
      // behind for ever, with nothing left pointing at it: an orphan nobody
      // would ever find, on the centre's own storage (23 Sep 2026).
      removed.materials = trashMaterials_(did);
      return { deleted: did, removed: removed, courses: ownerList_() };
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
      return { key: nk };
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
                              replies: vol.replies || {}, email: vol.email || '', notify: vol.notify === false ? false : true, nextClass: nextClass_(course.id) },
                 course: { settings: { centreName: vset.centreName, courseName: vset.courseName,
                                       start: vset.start, end: vset.end, logo: vset.logo,
                                       timeZone: vset.timeZone, onlineRooms: vset.onlineRooms || [],
                                       /* v81: the course's clock, 12- or 24-hour (Ramy, 10 Oct 2026) */
                                       clock: vset.clock || '',
                                       tutorNames: vset.tutorNames || '',
                                       /* v48: the demo clock, and the centre's own certificate threshold
                                          (which never reached the student's page before: it fell back to 20). */
                                       demoToday: vset.demoToday || '', volunteerCertificateHours: vset.volunteerCertificateHours || '',
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
      var boot = { course: { id: course.id, settings: courseRead_(course.id, 'settings'), wording: courseRead_(course.id, 'wording'), observations: courseRead_(course.id, 'observations'), stream: streamFor_(course, courseRead_(course.id, 'stream'), tutor), grid: gridFor_(course, courseRead_(course.id, 'grid'), reader, me), timetable: courseRead_(course.id, 'timetable'), tppoints: tpPointsFor_(courseRead_(course.id, 'tppoints'), reader, me), volunteers: reader ? withoutVolunteerEmails_(courseRead_(course.id, 'volunteers'), assessor) : null, shared: courseRead_(course.id, 'shared'), coming: comingFor_(course.id) } };
      if (assessor) { var exb = assessorExpiry_(course.id); boot.assessor = { expires: exb ? exb.toISOString() : null }; }
      if (reader) {
        /* v53: the assessor's link never carries a candidate's address. */
        boot.roster = withoutEmails_(rosterWithRecords_(course.id, TUTOR_WRITES), assessor);
      } else if (me) {
        boot.me = { token: me.token, name: me.name, group: me.group, email: me.email || '', records: recordsFor_(course.id, me.token, TRAINEE_READS) };
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
      return { purged: true };
    }

    // ---- trainee's own records -------------------------------------------
    case 'me': {
      if (!me) throw new Error('No token');
      return { token: me.token, name: me.name, group: me.group, email: me.email || '', records: recordsFor_(course.id, me.token, TRAINEE_READS) };
    }
    case 'get': {
      var kind = String(req.kind || '');
      if (reader) { return { data: read_(course.id, String(req.token || ''), kind) }; }
      if (!me) throw new Error('No token');
      if (!TRAINEE_READS[kind]) throw new Error('Not yours to read: ' + kind);
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
      // candidate's worksheet is often not signed into the centre's Workspace,
      // and an assessor never is.
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      return { url: file.getUrl(), id: file.getId(), name: file.getName(), size: bytes.length };
    }

    // ---- course-level, readable by all on the course, written by tutors ----
    case 'course': {
      if (!course) throw new Error('This link is not on a course');
      return { settings: courseRead_(course.id, 'settings'), wording: courseRead_(course.id, 'wording'), observations: courseRead_(course.id, 'observations'), stream: streamFor_(course, courseRead_(course.id, 'stream'), tutor), grid: gridFor_(course, courseRead_(course.id, 'grid'), reader, me), timetable: courseRead_(course.id, 'timetable'), tppoints: tpPointsFor_(courseRead_(course.id, 'tppoints'), reader, me), volunteers: reader ? courseRead_(course.id, 'volunteers') : null, shared: courseRead_(course.id, 'shared') };
    }
    case 'putCourse': {
      requireTutor_(tutor);
      var ck = String(req.kind || '');
      // observations: the centre's own wording of the observation tasks (27 Sep 2026)
      // timetable: the course's own timetable, native since 29 Sep 2026 -- the
      // course admin writes it, everyone on the course reads it.
      // tppoints: the rotated teaching-practice points, released per group.
      if (ck !== 'settings' && ck !== 'wording' && ck !== 'observations' && ck !== 'timetable' && ck !== 'tppoints' && ck !== 'volunteers') throw new Error('Not a course kind: ' + ck);
      var data = req.data;
      if (ck === 'settings') {
        // The owner's centre number stays (1 Oct 2026): a course made for
        // TR001 is TR001 whatever Course admin sends.
        var was = courseRead_(course.id, 'settings') || {};
        if (was.centreLocked && was.centreNumber && data && typeof data === 'object') { data.centreNumber = was.centreNumber; data.centreLocked = true; }
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
                   kind: String(req.kind || '').slice(0, 20) };
      /* One row per link: sharing the same file twice is a slip, not two
         handouts, and a volunteer should not see it listed twice. */
      return { shared: courseUpdate_(course.id, 'shared', function (list) {
        var out = list.filter(function (x) { return x && x.url !== item.url; });
        out.push(item);
        return out.length > 120 ? out.slice(out.length - 120) : out;
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
      return { trainees: withoutEmails_(rosterWithRecords_(course.id, TUTOR_WRITES), assessor) };
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
function courses_() {
  var sh = sheet_(SHEET_COURSES);
  var last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2, 1, last - 1, 3).getValues().filter(function (r) { return String(r[0]).trim(); })
    .map(function (r) { return { id: String(r[0]), name: String(r[1]), created: r[2] ? new Date(r[2]).toISOString() : '' }; });
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
  var col = { name: 2 }[field];
  if (!col) throw new Error('Not a course field: ' + field);
  var sh = sheet_(SHEET_COURSES);
  var rows = sh.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) if (String(rows[i][0]) === String(id)) { sh.getRange(i + 1, col).setValue(value); return; }
  throw new Error('No such course');
}

// ---- storage ----------------------------------------------------------------
var HEADERS = {};
HEADERS[SHEET_COURSES]  = ['id', 'name', 'created'];
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
HEADERS[SHEET_OFFERS]   = ['at', 'by', 'book', 'level', 'lessons', 'stages', 'centre', 'file', 'state'];
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
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; } }
  if (!ss) { ss = SpreadsheetApp.create('Connect Lite (data)'); props.setProperty('SPREADSHEET_ID', ss.getId()); }
  return ss;
}
function dataSheetUrl() { var u = spreadsheet_().getUrl(); Logger.log(u); return u; }
function sheet_(name) {
  var header = HEADERS[name];
  var ss = spreadsheet_();
  var sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight('bold'); sh.setFrozenRows(1); }
  return sh;
}
function deleteRowsWhere_(name, match) {
  var sh = sheet_(name);
  var rows = sh.getDataRange().getValues();
  var n = 0;
  for (var i = rows.length - 1; i >= 1; i--) if (match(rows[i])) { sh.deleteRow(i + 1); n++; }
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
function courseRead_(courseId, kind) {
  var sh = sheet_(SHEET_COURSE);
  var last = sh.getLastRow();
  if (last < 2) return null;
  var rows = sh.getRange(2, 1, last - 1, 3).getValues();
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
    var cur = courseRead_(courseId, kind);
    var next = fn(cur && typeof cur === 'object' && !Array.isArray(cur) ? cur : {});
    courseWriteRaw_(courseId, kind, next);
    return next;
  } finally { lock.releaseLock(); }
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
  return { released: true, group: grp, due: due[grp] || '', rows: people.map(function (t) { return { name: t.name, mine: t.token === me.token, plan: rows[t.token] || {} }; }) };
}
// What each reader may see of the teaching-practice points. Tutors and the
// assessor: the whole rotation, every group, whether released or not -- it is
// the timetable's backbone and they plan from it. A candidate: nothing until
// their own group is released, then that group's points only, their own
// marked, so they learn what they are teaching without reading round the
// other group. Same shape and same rule as gridFor_ above (29 Sep 2026).
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
  if (!rel[grp]) return { released: false, group: grp, sets: (p.sets || {})[grp] || null, me: me.token };
  return { released: true, group: grp, points: byGroup[grp] || {}, sets: (p.sets || {})[grp] || null, me: me.token };
}
function courseWriteRaw_(courseId, kind, data) {
  var sh = sheet_(SHEET_COURSE);
  var json = JSON.stringify(data == null ? null : data);
  /* One cell while it fits, several when it does not. A row this write does
     not use is emptied rather than deleted: deleting shifts every row below it
     and the numbers gathered a moment ago would all be wrong. */
  var pieces = null;
  if (json.length > CELL_LIMIT) {
    pieces = [];
    for (var p = 0; p < json.length; p += CELL_LIMIT) pieces.push(json.slice(p, p + CELL_LIMIT));
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
function foldRecord_(bucket, kind, json, kinds) {
  var n = tpOf_(kind);
  var base = n ? 'tpHistory' : kind;
  if (!kinds[base] && !TRAINEE_READS[base]) return;
  var data; try { data = JSON.parse(json); } catch (e) { return; }
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
function ownerList_() {
  var list = courses_();
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
      centreName: s.centreName || '', centreNumber: s.centreNumber || '', courseName: s.courseName || '',
      // v76 (8 Oct 2026): which card the course's links open on, so the
      // console can show the course as a ticket book when it is the ticket.
      cardStyle: s.cardStyle === 'ticket' ? 'ticket' : '',
      start: s.start || '', end: s.end || '',
      demoToday: s.demoToday || '',     // v50: the console marks a pinned demo course
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
  courses_().forEach(function (c) { used[c.id] = 1; });
  for (var i = 1; i < 10000; i++) if (!used['c' + i]) return 'c' + i;
  throw new Error('Too many courses');
}

// ---- keys --------------------------------------------------------------------
function requireTutor_(tutor) { if (!tutor) throw new Error('Tutors only'); }

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
  var now = (s && s.demoToday && /^\d{4}-\d{2}-\d{2}$/.test(String(s.demoToday)))
    ? new Date(String(s.demoToday) + 'T23:59:59Z').getTime() : Date.now();
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
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) { /* deleted or moved: make a new one */ } }
  var name = 'Connect Lite materials — ' + (course.name || course.id);
  var folder = matsRoot_().createFolder(name);
  props.setProperty(propKey, folder.getId());
  return folder;
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
  return 'wrote ' + name + '; kept ' + Math.min(mine.length, BACKUP_KEEP) + ', trashed ' + dropped;
}
