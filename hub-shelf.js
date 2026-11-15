/* Connect Lite — "From the course": the shelf for the demonstration lesson and
 * the getting-to-know-you activities (2 Oct 2026).
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * Ramy: "I want the trainers to be able to share their demo lesson with the
 * trainees, that's all... perhaps GTKY activities too... trainees can do the
 * latter." So: one card on the tutor dashboard and on the trainee home. A
 * tutor puts up the demonstration lesson and any GTKY activity; a trainee
 * puts up a GTKY activity of their own. Everyone on the course sees the lot.
 *
 * It rides on the store's share list (op shareMaterial / unshareMaterial,
 * course kind `shared`, v44): a row is {id, at, name, url, by, tp, kind}. The
 * trainees' lesson materials use kind 'materials' and go to the volunteer
 * students' page; these use 'demo' and 'gtky' and stay on the course -- the
 * volunteer page hides them. The store lets a tutor take back any row and a
 * trainee only their own; the buttons here follow the same rule, and the
 * store is the one that enforces it.
 *
 * Links, not uploads: the demonstration lesson and the GTKY sheets already
 * live in a Drive, a Doc or a site, and a link is what a trainee needs.
 *
 * ONE SHELF, NOT TWO, AND IT GOES TO THE STUDENTS (Ramy, 6 Oct 2026, walking
 * the tutor's dashboard): "I'm not sure we need a special getting-to-know-you
 * activities button... this just could be one: share with the volunteer
 * students. One is enough, doesn't matter what's in there." The demo lesson
 * and the first-day activities are taught TO the volunteer students, so that
 * is who a share here reaches: it appears on their page under "For your next
 * class" (26_volunteer.html shows these kinds now) and stays on the course
 * for the trainees too. New rows carry kind 'course'; the 'demo' and 'gtky'
 * rows already on courses show in the same list and reach the students the
 * same way. A trainee's own lesson handouts are a different thing -- kind
 * 'materials', shared from the plan's switch with a TP on them.
 *
 * A TRAINEE ONLY READS IT (Ramy, 6 Oct 2026, seeing a Share with the students
 * button on a candidate's home: "why are they sharing from here? I thought
 * sharing with the students was with the lesson plan"). It is. This shelf is
 * what the TUTORS put up for the class; a candidate shares their own handouts
 * from the plan's switch, which stamps the TP on them. The button here is a
 * tutor's, so a candidate's home passes no canAdd and gets the list alone.
 */
(function () {
  var KEY = 'connect_shared_v1';
  var KINDS = { demo: 1, gtky: 1, course: 1 };    // what belongs on this shelf
  var ADD = 'course';                              // what a new share is filed as
  /* One short line (Ramy, 18 Oct 2026: "it's too much talking... just say share something with the volunteer students, for example demo lesson material"). */
  var NOTE = 'Share with the volunteer students and the trainees: something from the library, a link, or a note.';
  var esc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var read = function () { try { return (JSON.parse(localStorage.getItem(KEY)) || []).filter(function (x) { return x && ((x.url && x.name) || (x.kind === 'note' && x.text)); }); } catch (e) { return []; } };
  /* THREE WAYS TO SHARE (Ramy, 15 Nov 2026: "I can share something for the library, or I can share a link if I want to paste it,
     or I can make an announcement"). From the library: the demo lessons' handouts, read off the Demo lessons page itself so the
     two cannot drift, each for its own level. A link: as before. A note: a short message on the students' own page. */
  var LIB = null;
  var loadLib = function (then) {
    if (LIB) return then();
    fetch('input-sessions/demo-lessons/', { credentials: 'same-origin' }).then(function (r) { return r.text(); }).then(function (h) {
      var doc = new DOMParser().parseFromString(h, 'text/html'), out = [];
      doc.querySelectorAll('.level').forEach(function (sec) {
        var lv = ((sec.querySelector('h2') || {}).textContent || '').match(/\(([ABC][12]\+?)\)/);
        sec.querySelectorAll('.demo').forEach(function (d) {
          /* every file or page the lesson offers on the Demo lessons page is a part, named as the page names it ("The handout as a
             PDF", "Open the lesson" read as "The lesson"): a lesson with more files has more rows (Ramy, 15 Nov 2026: "those boxes
             should read what's in the library") */
          var parts = [].slice.call(d.querySelectorAll('.go a[href]')).map(function (x) {
            var href = x.getAttribute('href'), page = !/\.(pdf|mp3|m4a|docx?|pptx?)$/i.test(href), t = (x.textContent || '').trim();
            var label = page ? t.replace(/^open\s+/i, '').replace(/^the lesson$/i, 'The interactive lesson').replace(/^\w/, function (c) { return c.toUpperCase(); }) : t;
            return { label: label, url: new URL(href, location.origin + '/input-sessions/demo-lessons/').href, page: page, key: /answer/i.test(href + ' ' + t) };
          });
          if (parts.length) out.push({ name: ((d.querySelector('h3') || {}).textContent || '').trim(), parts: parts, level: lv ? lv[1] : '', levelName: sec.querySelector('h2').textContent.trim() });
        });
      });
      /* demo lessons only (Ramy, 15 Nov 2026: the input sessions came out of the share box again; the timetable gives them) */
      LIB = out; then();
    }, function () { LIB = []; then(); });
  };
  var write = function (list) { try { localStorage.setItem(KEY, JSON.stringify(list || [])); } catch (e) {} };
  var host_ = function (u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return ''; } };
  /* WHICH CLASS (Ramy, 12 Nov 2026, before his C/21 demo: "I want to share my demo material with ... the volunteer students.
     Does Lite know which level to share the material with?"). It did not: a tutor's share carried no level, so every class saw it.
     The course's classes (Course admin, Classes) are offered; Every class leaves it as before. */
  var classPick = function () {
    var cs = {}; try { cs = JSON.parse(localStorage.getItem('connect_course_settings') || '{}') || {}; } catch (e) {}
    var list = ((cs.classes && cs.classes.list) || []).filter(function (c) { return c && c.level; });
    if (!list.length) return '';
    var nm = function (l) { return window.hubLevelName ? hubLevelName(l) : l; };
    return '<label class="shelf-class">For <select name="level"><option value="">every class</option>' + list.map(function (c, i) {
      return '<option value="' + esc(c.level) + '">Class ' + (i + 1) + ' \u00b7 ' + esc(nm(c.level)) + '</option>'; }).join('') + '</select></label>';
  };
  var when = function (iso) { var d = new Date(iso); return isNaN(d) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); };

  /* opts: { role: 'tutor' | 'trainee', by: () => name, token: () => token | null,
             canAdd: [...] -- anything non-empty means this person may share } */
  window.hubShelf = function (host, opts) {
    if (!host) return;
    var role = opts.role, canAdd = opts.canAdd || [], note = '', busy = false, open = null, mode = 'lib', libSel = '';
    /* A candidate's home passes 'materials' as well, so a classmate's handout
       for their own teaching practice lands beside the tutors' shelf
       (6 Oct 2026). The tutors' own dashboard does not: a candidate's handouts
       are already on their plan. */
    var kinds = {}; (opts.kinds || Object.keys(KINDS)).forEach(function (k) { kinds[k] = 1; });
    if (role === 'tutor') kinds.note = 1;   /* the notes are the tutors' to see and take back; trainees never get them */
    var mine = function (x) { return role === 'tutor' || (opts.by && x.by === opts.by()); };
    function draw() {
      var list = read().filter(function (x) { return kinds[x.kind || 'course']; }).slice().reverse();
      var may = !!(canAdd && canAdd.length);
      var any = list.length || may;
      host.hidden = !any; if (!any) return;
      host.innerHTML = '<div class="shead"><h2>' + esc(opts.title || 'Shared with the students') + '</h2><span class="new">' + esc(note) + '</span></div>'
        + '<div class="shelf-group">'
          + (opts.lede ? '<p class="shelf-note" style="margin:0 0 8px">' + esc(opts.lede) + '</p>' : '')
          + '<div class="shelf-head">' + (may ? '<span class="shelf-note">' + NOTE + '</span>' : '')
          + (may ? '<button class="shelf-add" type="button" data-open="' + ADD + '">' + (open ? 'Cancel' : 'Share with the students') + '</button>' : '')
          + '</div>'
          + (open ? '<div class="shelf-modes">' + [['lib', 'From the library'], ['link', 'A link'], ['note', 'A note']].map(function (m) { return '<button type="button" class="shelf-mode' + (mode === m[0] ? ' on' : '') + '" data-mode="' + m[0] + '">' + m[1] + '</button>'; }).join('') + '</div>'
              + '<form class="shelf-form" data-kind="' + ADD + '" data-mode="' + mode + '">'
              + (mode === 'lib'
                  ? (LIB === null ? '<span class="shelf-hint">Opening the library\u2026</span>' : LIB.length
                      ? '<select name="lib" required><option value="">Choose a demo lesson</option>' + LIB.map(function (x, i) { return '<option value="' + i + '"' + (String(i) === libSel ? ' selected' : '') + '>' + esc(x.name) + ' \u00b7 ' + esc(x.levelName) + '</option>'; }).join('') + '</select>'
                        + (libSel === '' ? '' :
                        '<div class="shelf-parts"><span class="hd"></span><span class="hd">Students</span><span class="hd">Trainees</span><span class="hd"></span>'
                        + ((LIB[+libSel] || {}).parts || []).map(function (w, i) {
                            /* the handout starts ticked for both; the answer key and the rest start empty */
                            var on = !w.page && !w.key && !((LIB[+libSel].parts || []).slice(0, i).some(function (y) { return !y.page && !y.key; }));
                            return '<span class="nm">' + esc(w.label) + '</span>' + (w.noStudents ? '<span class="na">not for students</span>' : '<label><input type="checkbox" name="s_' + i + '"' + (on ? ' checked' : '') + ' aria-label="' + esc(w.label) + ' for the students"></label>')
                              + '<label><input type="checkbox" name="t_' + i + '"' + (on || w.noStudents ? ' checked' : '') + ' aria-label="' + esc(w.label) + ' for the trainees"></label>'
                              + '<button type="button" class="shelf-copy" data-copy="' + esc(w.url) + '">Copy the link</button>'; }).join('')
                        + (((LIB[+libSel] || {}).parts || []).some(function (w) { return w.page; }) ? '<span class="nm"></span><span></span><label class="nt"><input type="checkbox" name="t_notes"> with the teaching notes</label><span></span>' : '') + '</div>')
                        + '<button class="btn small" type="submit">Share</button><span class="shelf-hint">' + (LIB[+libSel] && !LIB[+libSel].session ? 'Students: only the ' + esc(LIB[+libSel].levelName.replace(/\s*\(.*\)$/, '').toLowerCase()) + ' students see it. ' : '') + 'Trainees: every trainee sees it' + (LIB[+libSel] && LIB[+libSel].session ? ' now, whatever day the timetable gives it' : '') + '. Only trainees can get the teaching notes. Copy the link to send it to someone outside the course.</span>'
                      : '<span class="shelf-hint">The library could not be opened. Use A link instead.</span>')
                  : mode === 'link'
                  ? '<input type="text" name="name" placeholder="What to call it, e.g. Demo lesson \u2014 A2 Speaking" required maxlength="120">'
                    + '<input type="url" name="url" placeholder="The link \u2014 a Drive file, a Doc, a page" required>'
                    + '<label class="shelf-class">For <select name="to"><option value="">the students and the trainees</option><option value="students">the students only</option><option value="trainees">the trainees only</option></select></label>'
                    + classPick() + '<button class="btn small" type="submit">Share it</button><span class="shelf-hint">It is signed with your name.</span>'
                  : '<textarea name="text" rows="2" maxlength="400" required placeholder="A short note for the students, e.g. Please bring a photo of your room tomorrow."></textarea>'
                    + classPick() + '<button class="btn small" type="submit">Post the note</button><span class="shelf-hint">It shows at the top of the students\u2019 own page. It is not an email.</span>')
            + '</form>' : '')
          + (list.length ? list.map(function (x) {
              if (x.kind === 'note') return '<div class="shelf-row"><span class="shelf-text">Note: ' + esc(x.text) + '</span><span class="shelf-meta">' + (x.level ? esc(window.hubLevelName ? hubLevelName(x.level) : x.level) + ' \u00b7 ' : 'Every class \u00b7 ') + esc(x.by || '') + (x.at ? ' \u00b7 ' + esc(when(x.at)) : '') + '</span><button class="rm" type="button" data-rm="' + esc(x.id) + '">Take it down</button></div>';
              return '<div class="shelf-row"><a href="' + esc(x.url) + '" target="_blank" rel="noopener noreferrer">' + esc(x.name) + '</a>'
                + '<span class="shelf-meta">' + (x.kind !== 'materials' ? (x.to === 'students' ? 'Students \u00b7 ' : x.to === 'trainees' ? 'Trainees' + (x.notes ? ', with the teaching notes' : '') + ' \u00b7 ' : 'Students and trainees \u00b7 ') : '') + (x.level && x.kind !== 'materials' ? esc(window.hubLevelName ? hubLevelName(x.level) : x.level) + ' \u00b7 ' : '') + esc(x.by || '') + (x.tp ? ' · ' + esc(x.tp) : '') + (x.at ? ' · ' + esc(when(x.at)) : '') + (host_(x.url) ? ' · ' + esc(host_(x.url)) : '') + '</span>'
                + (mine(x) ? '<button class="rm" type="button" data-rm="' + esc(x.id) + '">Stop sharing</button>' : '')
                + '</div>';
            }).join('') : (may && !open ? '<p class="shelf-empty">Nothing here yet.</p>' : ''))
        + '</div>';
      host.querySelectorAll('[data-open]').forEach(function (b) { b.addEventListener('click', function () { open = open ? null : b.dataset.open; note = ''; draw(); if (open && role === 'tutor') loadLib(draw); var f = host.querySelector('.shelf-form input, .shelf-form select, .shelf-form textarea'); if (f) f.focus(); }); });
      host.querySelectorAll('[data-copy]').forEach(function (b) { b.addEventListener('click', function () {
        var done = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy the link'; }, 1800); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(b.dataset.copy).then(done, function () { window.prompt('Copy this link', b.dataset.copy); });
        else window.prompt('Copy this link', b.dataset.copy);
      }); });
      var ls = host.querySelector('select[name=lib]'); if (ls) ls.addEventListener('change', function () { libSel = ls.value; draw(); });   /* the rows follow the lesson picked */
      host.querySelectorAll('[data-mode]').forEach(function (b) { if (!b.classList.contains('shelf-mode')) return; b.addEventListener('click', function () { mode = b.dataset.mode; note = ''; draw(); }); });
      host.querySelectorAll('.shelf-form').forEach(function (f) { f.addEventListener('submit', function (ev) { ev.preventDefault(); add(f); }); });
      host.querySelectorAll('[data-rm]').forEach(function (b) { b.addEventListener('click', function () { remove(b.dataset.rm); }); });
    }
    async function add(f) {
      if (busy) return;
      var by = (opts.by && opts.by()) || '', m = f.dataset.mode || 'link', pickL = m === 'lib' && LIB ? LIB[+f.lib.value] : null;
      var name = m === 'lib' ? (pickL ? pickL.name + ': the handout' : '') : m === 'link' ? f.name.value.trim() : '';
      var url = m === 'lib' ? (pickL ? pickL.url : '') : m === 'link' ? f.url.value.trim() : '';
      if (m === 'lib' && !pickL) { note = 'Choose a lesson first.'; draw(); return; }
      /* each part to the students, the trainees or both; the interactive lesson to the trainees may carry its teaching notes,
         and then it goes as two rows, so the students' copy never has them */
      var parts = null;
      if (m === 'lib' && pickL) {
        parts = [];
        (pickL.parts || []).forEach(function (w, i) {
          var S = f['s_' + i] && f['s_' + i].checked, T = f['t_' + i] && f['t_' + i].checked, N = w.page && T && f.t_notes && f.t_notes.checked;
          var it = function (to, notes) { parts.push({ name: pickL.name + ': ' + w.label.charAt(0).toLowerCase() + w.label.slice(1), url: w.url, to: to, notes: !!notes }); };
          if (S && T && !N) it('', false); else { if (S) it('students', false); if (T) it('trainees', N); }
        });
      }
      if (parts && !parts.length) { note = 'Tick at least one thing to share.'; draw(); return; }
      if (m === 'link' && !/^https?:\/\//i.test(url)) { note = 'The link has to start with http.'; draw(); return; }
      if (!by) { note = role === 'tutor' ? 'Type your name at the top first — it signs the share.' : 'Your name is missing — open your own link again.'; draw(); return; }
      busy = true; note = 'Sharing…'; draw();
      try {
        var body = m === 'note' ? { op: 'volunteerNote', text: f.text.value.trim(), by: by } : { op: 'shareMaterial', name: name, url: url, by: by, tp: '', kind: f.dataset.kind };
        if (m === 'lib' && pickL.level) body.level = pickL.level;
        else if (f.level && f.level.value) body.level = f.level.value;
        if (opts.token && opts.token()) body.token = opts.token();
        var r = null;
        if (parts) { for (var pi = 0; pi < parts.length; pi++) { r = await window.HubStore.call(Object.assign({}, body, { name: parts[pi].name, url: parts[pi].url, to: parts[pi].to, notes: parts[pi].notes })); } }
        else if (m === 'link' && f.to) { body.to = f.to.value; r = await window.HubStore.call(body); }
        else r = await window.HubStore.call(body);
        write(r.shared || []); open = null; note = m === 'note' ? 'Posted for the students.' : 'Shared with the students.';
      } catch (err) { note = 'Not shared — ' + (err && err.message || err); }
      busy = false; draw(); setTimeout(function () { note = ''; draw(); }, 2600);
    }
    async function remove(id) {
      if (busy) return;
      var ok = window.confirmModal ? await confirmModal('Stop sharing this? The other trainees and the volunteer students will no longer see it.', 'Stop sharing') : confirm('Stop sharing this?');
      if (!ok) return;
      busy = true; note = 'Taking back…'; draw();
      try {
        var body = { op: 'unshareMaterial', id: id };
        if (opts.token && opts.token()) body.token = opts.token();
        var r = await window.HubStore.call(body);
        write(r.shared || []); note = 'Taken back.';
      } catch (err) { note = 'Still there — ' + (err && err.message || err); }
      busy = false; draw(); setTimeout(function () { note = ''; draw(); }, 2600);
    }
    draw();
    return { draw: draw };
  };
})();
