/* Connect Lite — "From the course": the shelf for the demonstration lesson and
 * the getting-to-know-you activities (2 Oct 2026).
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * Ramy: "I want the trainers to be able to share their demo lesson with the
 * trainees, that's all... perhaps GTKY activities too... trainees can do the
 * latter." So: one card on the tutor dashboard and on the candidate home. A
 * tutor puts up the demonstration lesson and any GTKY activity; a candidate
 * puts up a GTKY activity of their own. Everyone on the course sees the lot.
 *
 * It rides on the store's share list (op shareMaterial / unshareMaterial,
 * course kind `shared`, v44): a row is {id, at, name, url, by, tp, kind}. The
 * candidates' lesson materials use kind 'materials' and go to the volunteer
 * students' page; these use 'demo' and 'gtky' and stay on the course -- the
 * volunteer page hides them. The store lets a tutor take back any row and a
 * candidate only their own; the buttons here follow the same rule, and the
 * store is the one that enforces it.
 *
 * Links, not uploads: the demonstration lesson and the GTKY sheets already
 * live in a Drive, a Doc or a site, and a link is what a candidate needs.
 */
(function () {
  var KEY = 'connect_shared_v1';
  var GROUPS = [
    { kind: 'demo', title: 'The demonstration lesson', note: 'The plan and the materials of the lesson the tutors taught on day one.' },
    { kind: 'gtky', title: 'Getting-to-know-you activities', note: 'Activities for a first lesson with a new class. Tutors and candidates can both put one here.' },
  ];
  var esc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var read = function () { try { return (JSON.parse(localStorage.getItem(KEY)) || []).filter(function (x) { return x && x.url && x.name; }); } catch (e) { return []; } };
  var write = function (list) { try { localStorage.setItem(KEY, JSON.stringify(list || [])); } catch (e) {} };
  var host_ = function (u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return ''; } };
  var when = function (iso) { var d = new Date(iso); return isNaN(d) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); };

  /* opts: { role: 'tutor' | 'trainee', by: () => name, token: () => token | null,
             canAdd: ['demo','gtky'] } */
  window.hubShelf = function (host, opts) {
    if (!host) return;
    var role = opts.role, canAdd = opts.canAdd || [], note = '', busy = false, open = null;
    var mine = function (x) { return role === 'tutor' || (opts.by && x.by === opts.by()); };
    function draw() {
      var rows = read().filter(function (x) { return x.kind === 'demo' || x.kind === 'gtky'; });
      var any = rows.length || canAdd.length;
      host.hidden = !any; if (!any) return;
      host.innerHTML = '<div class="shead"><h2>From the course</h2><span class="new">' + esc(note) + '</span></div>'
        + GROUPS.map(function (g) {
          var list = rows.filter(function (x) { return x.kind === g.kind; }).slice().reverse();
          var may = canAdd.indexOf(g.kind) !== -1;
          if (!list.length && !may) return '';
          return '<div class="shelf-group">'
            + '<div class="shelf-head"><b>' + esc(g.title) + '</b><span class="shelf-note">' + esc(g.note) + '</span>'
            + (may ? '<button class="shelf-add" type="button" data-open="' + g.kind + '">' + (open === g.kind ? 'Cancel' : (g.kind === 'demo' ? 'Put the lesson here' : 'Add an activity')) + '</button>' : '')
            + '</div>'
            + (open === g.kind ? '<form class="shelf-form" data-kind="' + g.kind + '">'
                + '<input type="text" name="name" placeholder="' + (g.kind === 'demo' ? 'What to call it, e.g. Demo lesson — A2 Speaking' : 'What to call it, e.g. Find someone who…') + '" required maxlength="120">'
                + '<input type="url" name="url" placeholder="The link — a Drive file, a Doc, a page" required>'
                + '<button class="btn small" type="submit">Share with the course</button>'
                + '<span class="shelf-hint">A link, so everyone opens the same copy. It is signed with your name.</span>'
              + '</form>' : '')
            + (list.length ? list.map(function (x) {
                return '<div class="shelf-row"><a href="' + esc(x.url) + '" target="_blank" rel="noopener noreferrer">' + esc(x.name) + '</a>'
                  + '<span class="shelf-meta">' + esc(x.by || '') + (x.at ? ' · ' + esc(when(x.at)) : '') + (host_(x.url) ? ' · ' + esc(host_(x.url)) : '') + '</span>'
                  + (mine(x) ? '<button class="rm" type="button" data-rm="' + esc(x.id) + '">Take back</button>' : '')
                  + '</div>';
              }).join('') : (may && open !== g.kind ? '<p class="shelf-empty">Nothing here yet.</p>' : ''))
            + '</div>';
        }).join('');
      host.querySelectorAll('[data-open]').forEach(function (b) { b.addEventListener('click', function () { open = open === b.dataset.open ? null : b.dataset.open; note = ''; draw(); var f = host.querySelector('.shelf-form input'); if (f) f.focus(); }); });
      host.querySelectorAll('.shelf-form').forEach(function (f) { f.addEventListener('submit', function (ev) { ev.preventDefault(); add(f); }); });
      host.querySelectorAll('[data-rm]').forEach(function (b) { b.addEventListener('click', function () { remove(b.dataset.rm); }); });
    }
    async function add(f) {
      if (busy) return;
      var name = f.name.value.trim(), url = f.url.value.trim(), by = (opts.by && opts.by()) || '';
      if (!/^https?:\/\//i.test(url)) { note = 'The link has to start with http.'; draw(); return; }
      if (!by) { note = role === 'tutor' ? 'Type your name at the top first — it signs the share.' : 'Your name is missing — open your own link again.'; draw(); return; }
      busy = true; note = 'Sharing…'; draw();
      try {
        var body = { op: 'shareMaterial', name: name, url: url, by: by, tp: '', kind: f.dataset.kind };
        if (opts.token && opts.token()) body.token = opts.token();
        var r = await window.HubStore.call(body);
        write(r.shared || []); open = null; note = 'Shared with the course.';
      } catch (err) { note = 'Not shared — ' + (err && err.message || err); }
      busy = false; draw(); setTimeout(function () { note = ''; draw(); }, 2600);
    }
    async function remove(id) {
      if (busy) return;
      var ok = window.confirmModal ? await confirmModal('Take this back from everyone on the course?', 'Take back') : confirm('Take this back?');
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
