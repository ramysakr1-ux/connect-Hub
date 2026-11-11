/* Connect Lite — worth a look: where two parts of a course's set-up do not agree.
 *
 * Ramy, 10 Nov 2026, setting up C/21: "Lite [should] give a warning when there's a mismatch ... go through all of it
 * and see potential mismatches and how Lite can issue a warning. It doesn't have to block, but just warning. We already
 * have this with few things." Every note here happened on C/21 that week and Lite said nothing: the timetable changed
 * class with no classes set, a class saved with the wrong level, a TP group of three, a TP day with no feedback after
 * it, an assignment with a deadline and no set-up, a session that opened nothing, cards dealt before the set was fixed.
 *
 * ONE FUNCTION, NO SCREEN. hubCourseNotes(data, opt) reads the course's own records and returns the notes; it writes
 * nothing and blocks nothing. The pages that own each thing show their own notes (Course admin, TP points, the
 * timetable's checks) and the tutor's dashboard gathers them all. Tutors only: a trainee never sees one.
 *
 *   data = { settings, timetable, tppoints, roster: [{ token, group }], wording }
 *   opt  = { pageFor: session -> truthy when the session opens a page of Connect's }   (without it, that note is left out)
 *   -> [{ id, area: 'classes' | 'roster' | 'tppoints' | 'timetable' | 'admin', text, href, door }]
 */
(function () {
  'use strict';
  var NAMES = ['Upper-intermediate', 'Pre-intermediate', 'Intermediate', 'Elementary', 'Beginner', 'Advanced'];   /* longest first: "upper-intermediate" holds "intermediate" */
  var CODES = { 'A1': 'Beginner', 'A2': 'Elementary', 'A2+': 'Pre-intermediate', 'B1': 'Intermediate', 'B2': 'Upper-intermediate', 'C1': 'Advanced' };
  /* a level as one word, whether it was written as a code ("A2+"), a name, or a set's "A2+/B1 (pre-intermediate)" */
  function levelWord(v) {
    var s = String(v == null ? '' : v).trim(); if (!s) return '';
    var low = s.toLowerCase().replace(/[\s_]+/g, '-');
    for (var i = 0; i < NAMES.length; i++) if (low.indexOf(NAMES[i].toLowerCase()) !== -1) return NAMES[i];
    return CODES[s.toUpperCase()] || '';
  }
  function nice(date) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(date || '')); if (!m) return String(date || '');
    return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 12)).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }).replace(',', '');
  }
  function dayIn(iso, tz) {
    var d = new Date(iso); if (isNaN(d.getTime())) return '';
    try { return d.toLocaleDateString('en-CA', { timeZone: tz || 'UTC' }); } catch (e) { return d.toISOString().slice(0, 10); }
  }
  function mins(hm) { var m = /^(\d{1,2}):(\d{2})/.exec(String(hm || '')); return m ? +m[1] * 60 + +m[2] : 0; }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }
  function same(a, b) { return String(a == null ? '' : a).replace(/\s+/g, ' ').trim() === String(b == null ? '' : b).replace(/\s+/g, ' ').trim(); }
  function tpList(set) { var a = Object.keys(set).map(Number).sort(function (x, y) { return x - y; }); return a.length === 1 ? 'TP' + a[0] : 'TP' + a.slice(0, -1).join(', TP') + ' and TP' + a[a.length - 1]; }

  var ASSIGNMENTS = [
    ['lrt', 'Language Related Tasks', /\bLRT\b|language[- ]related/i],
    ['lsrt', 'Language Skills Related Tasks', /\bLSRT\b|language skills/i],
    ['fol', 'Focus on the Learner', /\bFOL\b|focus on the learner/i],
    ['lfc', 'Lessons from the Classroom', /\bLFC\b|lessons from the classroom/i]
  ];
  var SETUP = /set[- ]?up|brief|introduc/i;

  function hubCourseNotes(data, opt) {
    data = data || {}; opt = opt || {};
    var cs = data.settings || {}, tt = data.timetable || {}, P = data.tppoints || {}, W = data.wording || {};
    var roster = Array.isArray(data.roster) ? data.roster.filter(function (t) { return t && t.token; }) : [];
    var out = [];
    var add = function (id, area, text) {
      var href = area === 'timetable' ? '23_timetable.html' : area === 'tppoints' ? '24_tp_points.html' : area === 'roster' ? '6_centre_admin_dashboard.html#roster' : '6_centre_admin_dashboard.html#settings';
      var door = area === 'timetable' ? 'Open the timetable' : area === 'tppoints' ? 'Open TP points' : 'Open Course admin';
      out.push({ id: id, area: area, text: text, href: href, door: door });
    };
    /* THE TIMETABLE AS TUTORS SEE IT (Ramy, 11 Nov 2026: "make sure that the worth a look is consistent with the
       information on the timetable"). An edit made after publishing is a draft that rides beside the published days
       (23_timetable.html, openDraft); the timetable shows tutors the draft, so the notes read it too. Only the
       timetable page hands over a timetable with the draft already laid on; every other page reads the record. */
    var dr = tt.draft;
    var allDays = Array.isArray(tt.days) ? tt.days : [];
    if (dr && Array.isArray(dr.all)) allDays = dr.all;
    else if (dr && dr.days) allDays = allDays.map(function (d) { return (d && dr.days[d.date]) || d; });
    var days = allDays.filter(function (d) { return d && d.date && !d.closed; });
    var lib = (P.set && P.set.library) || {}, setIds = Object.keys(lib);
    var setName = function (id) { var s = lib[id] || {}; return s.name || s.book || 'a set'; };
    var tps = parseInt(cs.tpCount, 10) || 8, half = Math.floor(tps / 2) + 1;

    /* ---- the classes ------------------------------------------------------------------------------------------- */
    var K = (cs.classes && Array.isArray(cs.classes.list) && cs.classes.list.some(function (k) { return k && k.id; })) ? cs.classes : null;
    var newClassDay = '';
    days.forEach(function (d) { if (!newClassDay && (d.how === 'newclass' || (d.sessions || []).some(function (x) { return /\bnew class\b/i.test((x && x.t) || ''); }))) newClassDay = d.date; });
    if (K) {
      K.list.forEach(function (k, i) {
        var n = 'Class ' + (i + 1);
        if (!k.set) add('class-set-' + k.id, 'classes', n + ' has no TP points chosen. A group in that class keeps its old set’s lessons.');
        else if (!lib[k.set] && setIds.length) add('class-set-' + k.id, 'classes', n + '’s TP points are a set that is no longer on the course.');
        if (!k.tutor) add('class-tutor-' + k.id, 'classes', n + ' has no tutor chosen.');
        var a = levelWord(k.level), b = lib[k.set] ? levelWord(lib[k.set].level) : '';
        if (a && b && a !== b) add('class-level-' + k.id, 'classes', n + ' is set to ' + a + ', but its TP points are ' + b + '.');
      });
      /* a course saved with a date (before the plan by TP) can disagree with the board; a plan takes its days from the board */
      if (!K.plan && K.change && newClassDay && String(K.change).slice(0, 10) !== newClassDay) add('class-change', 'classes', 'The classes change on ' + nice(K.change) + ', but the timetable’s new class day is ' + nice(newClassDay) + '.');
    } else if (newClassDay) {
      add('class-none', 'classes', 'The timetable changes class on ' + nice(newClassDay) + ', but Course admin has no classes. Every group keeps one set of TP points for the whole course.');
    }

    /* ---- the roster: a teaching practice group is four to six (Handbook 7.1) ----------------------------------- */
    var byGroup = {};
    roster.forEach(function (t) { var g = String(t.group == null ? '' : t.group).trim(); if (g) (byGroup[g] = byGroup[g] || []).push(t); });
    Object.keys(byGroup).sort().forEach(function (g) {
      var n = byGroup[g].length;
      if (n < 4 || n > 6) add('group-size-' + g, 'roster', 'Group ' + g + ' has ' + plural(n, 'trainee', 'trainees') + '. Cambridge asks for four to six in a teaching practice group (Handbook 7.1).');
    });

    /* ---- the TP points: what was dealt against what the course now says ---------------------------------------- */
    /* the class a group teaches a TP in: its plan by TP where it has one (10 Nov 2026), else the old two halves */
    var classOf = function (g, tp) {
      if (!K) return null;
      var by = function (id) { return K.list.filter(function (k) { return k && id && k.id === id; })[0] || null; };
      var plan = K.plan && K.plan[g];
      if (Array.isArray(plan) && plan.length) {
        var from = 1, hit = null, lastK = null;
        plan.forEach(function (b, i) { var to = i === plan.length - 1 ? tps : Math.max(from, Math.min(tps, parseInt(b && b.to, 10) || tps)), k = by(b && b.k); if (k) { lastK = k; if (!hit && tp >= from && tp <= to) hit = k; } from = to + 1; });
        return hit || lastK;
      }
      var row = (K.groups || {})[g]; if (!Array.isArray(row)) return null;
      var a = by(row[0]), b = by(row[1]); if (!a && !b) return null;
      return tp >= half ? (b || a) : (a || b);
    };
    var setIdFor = function (g, tp) {
      var k = classOf(g, tp); if (k && k.set && lib[k.set]) return k.set;
      var chosen = ((P.set && P.set.setFor) || {})[g] || '';
      return lib[chosen] ? chosen : (setIds[0] || '');
    };
    var slotFor = function (g, tp, from) {
      var m = /^(\d+[A-Za-z])\D+(\d+)$/.exec(String(from || '')); if (!m) return null;
      var s = lib[setIdFor(g, tp)], ses = s && s.sessions && s.sessions[m[1]];
      return (ses && ses.slots && ses.slots[+m[2] - 1]) || null;
    };
    var hasUrl = function (list) { return (Array.isArray(list) ? list : []).some(function (f) { return f && /^https?:/i.test(String(f.url || '')); }); };
    var dealt = P.groups || {};
    Object.keys(dealt).sort().forEach(function (g) {
      var rows = dealt[g] || {}, tokens = Object.keys(rows);
      if (!tokens.length) return;
      var late = (byGroup[g] || []).filter(function (t) { return !rows[t.token]; }).length;
      if (late) add('deal-late-' + g, 'tppoints', plural(late, 'trainee', 'trainees') + ' in Group ' + g + (late === 1 ? ' has' : ' have') + ' no TP points: they joined after the deal. Deal again to give them their lessons.');
      var off = 0, offTp = {}, bare = 0;
      tokens.forEach(function (tok) {
        Object.keys(rows[tok] || {}).forEach(function (key) {
          var m = /^tp(\d+)$/.exec(key), c = rows[tok][key]; if (!m || !c || !c.from) return;
          var tp = +m[1], slot = slotFor(g, tp, c.from);
          if (!slot || !same(c.point, slot.aim) || !same(c.sub, slot.sub)) { off++; offTp[tp] = 1; return; }
          if (hasUrl(slot.files) && !hasUrl(c.pages)) bare++;
        });
      });
      if (off) add('deal-off-' + g, 'tppoints', 'Group ' + g + ': ' + plural(off, 'dealt lesson', 'dealt lessons') + ' (' + tpList(offTp) + ') no longer ' + (off === 1 ? 'matches' : 'match') + ' the set the group teaches from. Deal again to bring the set’s lessons, unless you changed them by hand.');
      if (bare) add('deal-pages-' + g, 'tppoints', 'Group ' + g + ': ' + plural(bare, 'dealt lesson has', 'dealt lessons have') + ' no pages on the trainee’s card, though the set has them. Deal again to attach them.');
    });
    /* a set in use that names pages or recordings it cannot open */
    var inUse = {};
    Object.keys(byGroup).concat(Object.keys(dealt)).forEach(function (g) { [1, tps].forEach(function (tp) { var id = setIdFor(g, tp); if (id) inUse[id] = 1; }); });
    Object.keys(inUse).forEach(function (id) {
      var s = lib[id] || {}, noPage = 0, noTrack = 0;
      Object.keys(s.sessions || {}).forEach(function (k) { ((s.sessions[k] || {}).slots || []).forEach(function (sl) {
        if (!sl) return;
        if (Array.isArray(sl.files) && sl.files.length && !hasUrl(sl.files)) noPage++;
        if (String(sl.tracks || '').trim() && !/https?:/i.test(String(sl.tracks)) && !s.audioUrl) noTrack++;
      }); });
      if (noPage) add('set-pages-' + id, 'tppoints', setName(id) + ': ' + plural(noPage, 'lesson names', 'lessons name') + ' pages with no file attached. Trainees see the page numbers and nothing to open.');
      if (noTrack) add('set-audio-' + id, 'tppoints', setName(id) + ': ' + plural(noTrack, 'lesson names', 'lessons name') + ' a recording, and the set has no audio link.');
    });

    /* ---- the timetable ----------------------------------------------------------------------------------------- */
    var isFeedback = function (x) { return x && (x.k === 'feedback' || /feedback/i.test(x.t || '')); };
    days.forEach(function (d, i) {
      var lessons = (d.sessions || []).filter(function (x) { return x && x.k === 'tp'; }); if (!lessons.length) return;
      var end = Math.max.apply(null, lessons.map(function (x) { return mins(x.e); }));
      var sameDay = (d.sessions || []).some(function (x) { return isFeedback(x) && mins(x.s) >= end; });
      var next = days[i + 1], nextDay = next && (next.sessions || []).some(isFeedback);
      if (!sameDay && !nextDay) add('tp-feedback-' + d.date, 'timetable', 'TP ' + (d.tp || '') + ' on ' + nice(d.date) + ' has no feedback after it: nothing later that day' + (next ? ', and none on ' + nice(next.date) : ', and it is the last day') + '.');
    });
    var sessions = []; days.forEach(function (d) { (d.sessions || []).forEach(function (x) { if (x) sessions.push({ d: d, x: x }); }); });
    var due = ASSIGNMENTS.map(function (a) { var w = W[a[0]] || {}; return { key: a[0], name: a[1], re: a[2], due: w.dueAt || w.due || '', resub: w.resubDueAt || '' }; }).filter(function (a) { return a.due; });
    var setUp = function (a) { return sessions.some(function (o) { return a.re.test(o.x.t || '') && SETUP.test(o.x.t || ''); }); };
    if (days.length && due.some(setUp)) due.forEach(function (a) {   /* only on a timetable that sets assignments up at all */
      if (!setUp(a)) add('setup-' + a.key, 'timetable', a.name + ' is due on ' + nice(dayIn(a.due, cs.timeZone)) + ', but the timetable has no session that sets it up.');
    });
    if (days.length) due.forEach(function (a) {
      [['due', a.due], ['resubmission is due', a.resub]].forEach(function (p) {
        if (!p[1]) return; var day = dayIn(p[1], cs.timeZone); if (!day) return;
        if (!days.some(function (d) { return d.date === day; })) add('due-' + a.key + '-' + p[0].slice(0, 3), 'timetable', (p[0] === 'due' ? a.name + ' is due' : 'The resubmission of ' + a.name + ' is due') + ' on ' + nice(day) + ', a day the course does not meet.');
      });
    });
    if (typeof opt.pageFor === 'function' && String(cs.inputSessions || 'connect') !== 'own') sessions.forEach(function (o) {
      var x = o.x; if (x.k !== 'input' || !String(x.t || '').trim() || x.mat || x.lib) return;
      var page = false; try { page = !!opt.pageFor(x); } catch (e) { page = true; }
      if (!page) add('input-bare-' + o.d.date + '-' + (x.id || x.s), 'timetable', '“' + x.t + '” on ' + nice(o.d.date) + ' opens nothing for trainees: it has no session page and no materials link.');
    });

    /* ---- Course admin ------------------------------------------------------------------------------------------ */
    var assDay = ''; sessions.forEach(function (o) { if (!assDay && (o.x.k === 'assessor' || /assessor/i.test(o.x.t || ''))) assDay = o.d.date; });
    var visit = String(cs.visitDate || '').slice(0, 10), who = String(cs.assessorName || '').trim();
    /* The name is not known when a course starts: Cambridge gives it later. So a missing name is worth a look only
       once the first week is over (Ramy, 11 Nov 2026: "a problem only … after the first week, like a reminder").
       A missing visit date is said from the start. opt.today is for tests. */
    var today = String(opt.today || dayIn(new Date().toISOString(), cs.timeZone)).slice(0, 10);
    var st0 = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(cs.start || '')), week2 = '';
    if (st0) week2 = new Date(Date.UTC(+st0[1], +st0[2] - 1, +st0[3] + 7)).toISOString().slice(0, 10);
    var nameDue = !who && !!week2 && today >= week2;
    if (assDay && (!visit || nameDue)) add('assessor-missing', 'admin', 'The timetable has the assessor on ' + nice(assDay) + ', but Course admin has ' + (!visit && nameDue ? 'no visit date and no assessor’s name' : !visit ? 'no visit date' : 'no assessor’s name') + '.');
    if (visit && days.length && !sessions.some(function (o) { return o.d.date === visit && (o.x.k === 'assessor' || /assessor/i.test(o.x.t || '')); })) add('assessor-day', 'admin', 'Course admin has the assessor’s visit on ' + nice(visit) + ', but the timetable has no assessor session that day.');
    var spellings = {};
    String(cs.tutorNames || '').split(/[,\n;]+/).concat((Array.isArray(cs.tutorContacts) ? cs.tutorContacts : []).map(function (t) { return (t && t.name) || ''; })).forEach(function (n) {
      n = String(n).replace(/\s+/g, ' ').trim(); if (!n) return;
      var k = n.toLowerCase(); (spellings[k] = spellings[k] || {})[n] = 1;
    });
    Object.keys(spellings).forEach(function (k) { var v = Object.keys(spellings[k]); if (v.length > 1) add('tutor-name-' + k, 'admin', 'A tutor’s name is written two ways: “' + v.join('” and “') + '”. Trainees see the name as it is written on the session.'); });
    var signer = cs.certSigner || {};
    if (signer.name && /@/.test(String(signer.role || ''))) add('signer-role', 'admin', 'The certificate signer’s role is an email address. It should be their job title.');

    return out;
  }

  /* the course as this browser holds it. Tutors only: a trainee's page gets nothing. */
  function now(opt) {
    var S = window.HubStore;
    if (!S || !S.key || !S.key()) return [];
    var rd = function (k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } };
    var r = rd('connect_roster_v1') || {}, people = r.trainees || {};
    var roster = (Array.isArray(people) ? people : Object.keys(people).map(function (tok) { return Object.assign({ token: tok }, people[tok]); }));
    var o = Object.assign({}, opt || {});
    if (!o.pageFor && window.InputLib && window.InputLib.inputsOf) o.pageFor = function (x) {
      return window.InputLib.inputsOf({ days: [{ date: '2000-01-01', sessions: [x] }] }).some(function (i) { return i.slug; });
    };
    return hubCourseNotes({ settings: o.settings || rd('connect_course_settings'), timetable: o.timetable || rd('connect_timetable_v1'), tppoints: o.tppoints || rd('connect_tp_points_v1'), roster: o.roster || roster, wording: rd('connect_assignment_wording_v2') }, o);
  }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  /* the sand note box, as a list. `here` names the areas this page owns: their notes carry no door. */
  function html(list, o) {
    o = o || {}; list = (list || []).filter(function (n) { return !o.areas || o.areas.indexOf(n.area) !== -1; });
    if (!list.length) return '';
    var here = o.here || [];
    return '<div class="guide-box hub-notes" role="note"><h3>' + esc(o.title || 'Worth a look') + '</h3><div class="gb">'
      + (o.lede ? '<p>' + esc(o.lede) + '</p>' : '')
      + '<ul style="margin:6px 0 0; padding-left:20px;">' + list.map(function (n) {
        return '<li style="margin:4px 0;">' + esc(n.text) + (here.indexOf(n.area) === -1 ? ' <a href="' + esc(n.href) + '" style="font-weight:700; white-space:nowrap;">' + esc(n.door) + '</a>' : '') + '</li>';
      }).join('') + '</ul></div></div>';
  }
  var api = { notes: hubCourseNotes, now: now, html: html, levelWord: levelWord };
  if (typeof window !== 'undefined') { window.hubCourseNotes = hubCourseNotes; window.hubNotes = api; }
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
