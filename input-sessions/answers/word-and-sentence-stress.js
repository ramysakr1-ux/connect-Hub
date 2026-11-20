/* Connect Lite — the answers of "Word and sentence stress", written under their tasks for the print.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * answers.js says how this works. This file is the session's own part: when "Print with the answers" is pressed it
 * writes every answer on the page under its task, and answers.js takes them away again after the print. Nothing a
 * trainee has clicked, opened or typed is touched.
 *
 * Where each answer comes from (all of it from the page itself; nothing is copied into this file):
 *   Lead-in, and Mark it, drill it   their Reveal blocks (.reveal-block), which the stylesheet prints without being asked.
 *                                    The nine actors have no word-by-word key on the page, so none is printed.
 *   Every line that opens            (rhythm, the sort, the board, seven meanings, in context, the café, Lisbon, some
 *                                    ways in, the round-up): the note inside it, as the page wrote it. The page hides
 *                                    these lines on paper, open or shut, so each note is written out straight after
 *                                    its line.
 *   The sixteen words                the page's WORDS list. A card's bubbles are colors, which paper does not print,
 *                                    so the stress is written the way the page's own key writes it (aus-TRA-lia).
 *   Noun or verb                     the page's QUIZ list: the right button's own word, then the page's reason.
 */
SessionAnswers.register(function(A){
  /* The page's own lists, read first: if the page is ever rebuilt without one, this stops here, before anything is
     written, and tools/answers-check.mjs reports the error. A print with half the answers would be worse than none. */
  var words = {}, quiz = {}, kinds = STRESS_CLASS;
  WORDS.forEach(function(w){ words[w.word] = w; });
  QUIZ.forEach(function(q){ quiz[q.word.toUpperCase() + ' | ' + A.txt(q.sentence)] = q; });

  /* The lines that open. A recording's button (audio/hooks.js puts them inside the notes) stays on the screen. Three of
     the lines are notes with a name of their own, not the check of a task above them, and keep that name in front. */
  var NAMED = { 'How to mark stress on the board': 1, 'What the café shows': 1, 'Some ways in': 1 };
  A.each('section:not(#trainer) details.reveal', function(d){
    var note = d.querySelector('.content'), sum = d.querySelector('summary'); if (!note) return;
    var copy = note.cloneNode(true);
    A.each('.say-row, .say-btn', function(x){ x.remove(); }, copy);
    var name = sum && NAMED[A.txt(sum.innerHTML)] ? '<b>' + sum.innerHTML.trim() + '.</b> ' : '';
    A.after(d, name + copy.innerHTML);
  });

  /* 2 · the sixteen words, each found by its own name. The main stress in capitals; a secondary stress is named. The
     answer goes inside the word's own line, the one part of a card that prints whether the card is open or shut. There
     it is set in the page's text face like every other answer, not in the word's serif, and sits close under the word:
     with the looser spacing this part ran 27px past one A4 page and the last row of cards was cut in two. */
  var face = getComputedStyle(document.body).fontFamily;
  A.each('#wordGrid details.word-card', function(d){
    var s = d.querySelector('summary'), w = s && words[A.txt(s.innerHTML)]; if (!w) return;
    var second = [];
    var said = w.syll.map(function(x, i){
      var kind = kinds[w.stress[i]];
      if (kind === 'secondary') second.push(x.toLowerCase());
      return kind === 'primary' ? x.toUpperCase() : x.toLowerCase();
    }).join('-');
    var line = A.line(s, '<b>' + said + '</b>' + (second.length ? ', secondary stress on <b>' + second.join(', ') + '</b>' : ''));
    if (line) { line.style.fontFamily = face; line.style.margin = '2px 0 0'; }
  });

  /* 7 · noun or verb, each found by its own word and sentence. */
  A.each('#quizBlock .quiz-word', function(w){
    var h = w.querySelector('h3'), s = w.querySelector('.quiz-sentence');
    var q = h && s && quiz[A.txt(h.innerHTML) + ' | ' + A.txt(s.innerHTML)]; if (!q) return;
    A.line(w, '<b>' + (q.correct === 'A' ? q.a : q.b) + '.</b> ' + q.explain);
  });
});
