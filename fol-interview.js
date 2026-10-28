/* Connect Lite — the Focus on the Learner interview.
 *
 * Ramy, 15 Oct 2026: a getting-to-know-you session can be a Focus on the
 * Learner interview, with the questions prepared, and what the trainee hears
 * counts as evidence for the assignment. Connect did it first; this is the same
 * on Lite. The eight questions are the tutor's own and are the same eight as
 * Connect's. The trainee's notes are one record on their own link
 * (connect_fol_interview_v1, kind 'interview'): who they interviewed, the
 * answers, and the grammar and pronunciation problems they heard. Private to
 * them and the tutors; the FOL assignment page shows them back as evidence.
 *
 *   window.CONNECT_HUB_FOL.questions   the eight
 *   window.CONNECT_HUB_FOL.advice      three lines
 *   window.CONNECT_HUB_FOL.summaryHtml(record)  a read-only summary (escaped)
 */
(function () {
  'use strict';
  var QUESTIONS = [
    { key: 'who', topic: 'Who they are', ask: 'Where are you from, and what do you do?', listenFor: 'Their first language and what they use English for. Write their words, not yours.' },
    { key: 'languages', topic: 'Other languages', ask: 'Which languages do you speak?', listenFor: 'Any language that might explain a pattern you hear later.' },
    { key: 'history', topic: 'Learning so far', ask: 'How long have you studied English, and how?', listenFor: 'Classes, apps, work, living abroad. How much speaking they have really done.' },
    { key: 'why', topic: 'Why English', ask: 'Why do you want to learn English?', listenFor: 'What they need it for: work, study, travel, family.' },
    { key: 'likes', topic: 'How they like to learn', ask: 'What do you like doing in an English class? What do you not like?', listenFor: 'Speaking or writing, games or books, working alone or with others.' },
    { key: 'use', topic: 'English outside class', ask: 'When do you use English outside class?', listenFor: 'Real situations. These are good contexts for the activities in your assignment.' },
    { key: 'hard', topic: 'What is difficult', ask: 'What is easy for you in English? What is difficult?', listenFor: 'Grammar they name. Then listen for what they get wrong while they answer.' },
    { key: 'sounds', topic: 'Speaking and sounds', ask: 'Is there a word or a sound in English that you find hard to say? Can you say it for me?', listenFor: 'Ask them to say it twice. Note the sound you hear, not the one you expected.' }
  ];
  var ADVICE = [
    'Ask each question in your own simple words and let the student talk. Do not correct them.',
    'Write the student’s exact words where you can. A real sentence is evidence; a summary is not.',
    'If you hear a mistake, finish the question first. Add it under What you heard when you are done.'
  ];
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  /* A read-only summary of a trainee's interview record, for the assignment
     page and the tutor's marking: each student, what they answered, and what
     was heard. Empty answers are left out. */
  function summaryHtml(rec) {
    var students = rec && rec.students ? Object.keys(rec.students).map(function (k) { return rec.students[k]; }) : [];
    students = students.filter(function (s) { return s && ((s.heard && s.heard.length) || (s.audio && s.audio.length) || Object.keys(s.answers || {}).some(function (k) { return String(s.answers[k] || '').trim(); })); });
    if (!students.length) return '';
    return students.map(function (s) {
      var ans = QUESTIONS.filter(function (q) { return String((s.answers || {})[q.key] || '').trim(); }).map(function (q) {
        return '<p style="margin:6px 0 0;font-size:.86rem;line-height:1.5"><b>' + esc(q.topic) + '.</b> ' + esc(s.answers[q.key]) + '</p>';
      }).join('');
      var heard = (s.heard || []).map(function (h) {
        return '<li style="margin:3px 0"><b>' + (h.type === 'pronunciation' ? 'Pronunciation' : 'Grammar') + ':</b> &ldquo;' + esc(h.note) + '&rdquo;</li>';
      }).join('');
      var recs = (s.audio || []).map(function (a, i) {
        return '<div style="margin:8px 0 0;font-size:.86rem"><button type="button" data-play="' + esc(a.id) + '" style="font:inherit;font-size:.8rem;font-weight:600;padding:5px 12px;border-radius:8px;border:1.5px solid var(--sand-line);background:var(--field);cursor:pointer">Listen</button> ' +
          '<span style="color:var(--grey)">Recording ' + (i + 1) + (a.seconds ? ', ' + Math.floor(a.seconds / 60) + ':' + ('0' + (a.seconds % 60)).slice(-2) : '') + '</span>' +
          (a.transcript ? '<p style="margin:6px 0 0;line-height:1.5;white-space:pre-line"><b>Transcript.</b>\n' + esc(a.transcript) + '</p>' : '') + '<span class="fol-audio"></span></div>';
      }).join('');
      return '<div style="margin:10px 0 0;padding-top:8px;border-top:1px solid var(--row-line, #e6e0d4)"><p style="margin:0;font-weight:700">' + esc(s.name) + '</p>' + ans + recs +
        (heard ? '<p style="margin:8px 0 2px;font-size:.78rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--grey)">What was heard</p><ul style="margin:0;padding-left:18px;font-size:.86rem;line-height:1.5">' + heard + '</ul>' : '') + '</div>';
    }).join('');
  }
  /* THE POOL (15 Oct 2026, Ramy: "make Lite pool them too"). What everyone in
     the trainee's TP group heard in their student interviews (28 Oct 2026: the group only, never the course): the problem and the student's
     words, never the answers. Trainees see the notes alone; tutors also see who
     heard each (the store only sends the name to a tutor). */
  function poolHtml(list) {
    list = Array.isArray(list) ? list : [];
    if (!list.length) return '<p class="note" style="margin:0">Nothing in the pool yet.</p>';
    return '<ul style="margin:0;padding-left:0;list-style:none">' + list.map(function (h) {
      return '<li style="margin:0;padding:8px 0;border-top:1px solid var(--row-line, #e6e0d4);font-size:.9rem;line-height:1.5">' +
        '<b style="font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:var(--gold-deep)">' + (h.type === 'pronunciation' ? 'Pronunciation' : 'Grammar') + '</b> ' +
        '&ldquo;' + esc(h.note) + '&rdquo;' +
        '<span style="color:var(--grey);font-size:.8rem"> &mdash; ' + esc(h.student || 'a student') + ', interview' + (h.by ? ', heard by ' + esc(h.by) : '') + '</span></li>';
    }).join('') + '</ul>';
  }
  /* What this trainee has heard, as the list the store takes (each student's
     name on each note). */
  function itemsFrom(rec) {
    var out = [];
    var st = rec && rec.students ? rec.students : {};
    Object.keys(st).forEach(function (k) {
      var s = st[k]; (s && s.heard || []).forEach(function (h) { if (h && String(h.note || '').trim()) out.push({ id: h.id, type: h.type, note: h.note, student: s.name || k }); });
    });
    return out;
  }
  /* THE TP GROUP'S INTERVIEWS (Ramy, 28 Oct 2026: Part A is the whole group, and "everything should be shared in the TP
     group, including the transcripts"). profilesFrom: what this trainee sends, one entry per student, the answers and the
     recordings with their transcripts. groupHtml: the group's, as the store sends them back (never the whole course). */
  function profilesFrom(rec) {
    var out = [], st = rec && rec.students ? rec.students : {};
    Object.keys(st).forEach(function (k) {
      var s = st[k]; if (!s) return;
      var answers = {}; QUESTIONS.forEach(function (q) { var v = String((s.answers || {})[q.key] || '').trim(); if (v) answers[q.key] = v; });
      var audio = (s.audio || []).filter(function (a) { return a && a.id; }).map(function (a) { return { id: a.id, seconds: a.seconds || 0, transcript: a.transcript == null ? null : a.transcript }; });
      if (Object.keys(answers).length || audio.length) out.push({ student: s.name || k, answers: answers, audio: audio });
    });
    return out;
  }
  function groupHtml(list, opts) {
    list = (Array.isArray(list) ? list : []).filter(function (p) { return p && !(opts && opts.others && p.mine); });
    if (!list.length) return '<p class="note" style="margin:0">' + (opts && opts.others ? 'Nobody else in your TP group has written up an interview yet.' : 'No interviews written up yet.') + '</p>';
    var students = {};
    list.forEach(function (p, i) { students['p' + i] = { name: p.student + (p.mine ? ' (yours)' : '') + (p.by ? ', interviewed by ' + p.by : ''), answers: p.answers || {}, audio: p.audio || [], heard: [] }; });
    return summaryHtml({ students: students });
  }
  /* Playing a recording: it lives in a private folder, so it comes through the
     store (the trainee who made it and the tutors only), as audio in the page. */
  function audioUrl(res) {
    var bin = atob(res.bytes), n = bin.length, u8 = new Uint8Array(n);
    for (var i = 0; i < n; i++) u8[i] = bin.charCodeAt(i);
    return URL.createObjectURL(new Blob([u8], { type: res.type || 'audio/webm' }));
  }
  function wirePlay(root) {
    if (!root) return;
    root.querySelectorAll('[data-play]').forEach(function (b) {
      if (b.dataset.wired) return; b.dataset.wired = '1';
      b.addEventListener('click', function () {
        var slot = b.parentNode.querySelector('.fol-audio') || (b.parentNode.parentNode && b.parentNode.parentNode.querySelector('.fol-audio')); if (!slot || !window.HubStore) return;
        b.disabled = true; b.textContent = 'Loading\u2026';
        var body = { op: 'getInterviewAudio', id: b.dataset.play }; if (HubStore.token && HubStore.token()) body.token = HubStore.token();
        HubStore.call(body, 90000).then(function (r) {
          slot.innerHTML = ''; var a = document.createElement('audio'); a.controls = true; a.src = audioUrl(r); a.style.cssText = 'display:block;width:100%;margin-top:6px'; slot.appendChild(a); a.play().catch(function () {});
          b.textContent = 'Listen again'; b.disabled = false;
        }, function (e) { b.textContent = 'Listen'; b.disabled = false; slot.textContent = ' ' + ((e && e.message) || 'Could not load the recording'); });
      });
    });
  }
  window.CONNECT_HUB_FOL = { questions: QUESTIONS, advice: ADVICE, summaryHtml: summaryHtml, poolHtml: poolHtml, profilesFrom: profilesFrom, groupHtml: groupHtml, itemsFrom: itemsFrom, wirePlay: wirePlay, audioUrl: audioUrl };
})();
