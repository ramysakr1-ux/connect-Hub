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
    students = students.filter(function (s) { return s && (s.heard && s.heard.length || Object.keys(s.answers || {}).some(function (k) { return String(s.answers[k] || '').trim(); })); });
    if (!students.length) return '';
    return students.map(function (s) {
      var ans = QUESTIONS.filter(function (q) { return String((s.answers || {})[q.key] || '').trim(); }).map(function (q) {
        return '<p style="margin:6px 0 0;font-size:.86rem;line-height:1.5"><b>' + esc(q.topic) + '.</b> ' + esc(s.answers[q.key]) + '</p>';
      }).join('');
      var heard = (s.heard || []).map(function (h) {
        return '<li style="margin:3px 0"><b>' + (h.type === 'pronunciation' ? 'Pronunciation' : 'Grammar') + ':</b> &ldquo;' + esc(h.note) + '&rdquo;</li>';
      }).join('');
      return '<div style="margin:10px 0 0;padding-top:8px;border-top:1px solid var(--row-line, #e6e0d4)"><p style="margin:0;font-weight:700">' + esc(s.name) + '</p>' + ans +
        (heard ? '<p style="margin:8px 0 2px;font-size:.78rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--grey)">What was heard</p><ul style="margin:0;padding-left:18px;font-size:.86rem;line-height:1.5">' + heard + '</ul>' : '') + '</div>';
    }).join('');
  }
  window.CONNECT_HUB_FOL = { questions: QUESTIONS, advice: ADVICE, summaryHtml: summaryHtml };
})();
