/* Connect Lite — MFPA: meaning, form, pronunciation, appropriacy (the short session), printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 20 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs mfp-short <folder> shows what it prints).
 *
 * What "Print with the answers" writes on this session:
 *   3  Write a CCQ          the model CCQ of each of the three targets, shown where it stands on the page
 *   4  Analyze the form     under each of the three sentences: the piece the page counts as right, in bold, and the
 *                           page's own note
 *   5  Weak forms           under each of the five phrases: the transcription the page counts as right
 *   6  Mark the stress      under each of the three sentences: the word the page counts as right, in bold, and the
 *                           page's own note
 *   7  Which register?      under each of the three sentences: who the page counts as right
 *   8  Quick fire           under each of the six tasks: which of the four it checks
 *   9  Spot the flaw        what is missing from each of the three plans, shown where it stands on the page; then the
 *                           staging example behind "See staging example", shown as it stands
 * 1 (Lead-in) is a question for the room and 2 (The four) is to read: the page holds no answer to either, so none is
 * printed.
 *
 * THE PAGE'S OWN ANSWER KEY ("Reveal answer key: save or print to keep") holds two things and no more: which of the
 * four each quick fire task checks (part 8), and the three model CCQs (part 3). Both are printed under their own
 * tasks here, so the key is put aside for this print, open or shut: every answer is said once.
 *
 * WHERE THE ANSWERS COME FROM
 *   Parts 3 and 9: the page's own blocks (the model under each target, the fix under each plan, the example), shown.
 *   Part 8: the page's own list (MF_ITEMS, the one its buttons mark against and its key is drawn from), read by name.
 *   Parts 4, 5, 6 and 7: the page keeps these lists inside the calls that draw the rows, where this file cannot read
 *   them. So the right piece, word or option of each row, and the note of each sentence in 4 and 6, are COPIED below,
 *   word for word, from the tokenTask(...) and choiceTask(...) calls in mfp-short/index.html, under the row's own
 *   words. IF A ROW, ITS RIGHT ANSWER OR ITS NOTE CHANGES ON THE PAGE, CHANGE IT HERE TOO, and run the check again.
 *   A row whose words are not in the table gets no line, and neither does one whose copied answer is not on exactly
 *   one of its own buttons: nothing is ever guessed. Part 6 gives one sentence twice, with the stress on a different
 *   word each time; the two are told apart by which comes first on the page, and if the page ever holds more or fewer
 *   of a sentence than were copied, that sentence gets no line at all.
 *
 * Nothing the trainee did is touched: no word or option is pressed, nothing is opened or shut, the score stays. A row
 * already answered on the screen carries "Right" or "Not quite", its note and the score; those are put aside for this
 * print, so an answered row prints the same as an untouched one, and its answer is said once.
 */
SessionAnswers.register(function(A){
  /* the page's list is top-level in its own script, so it is read by name; if it is missing, nothing is written */
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var list = function(sel, root){ return [].slice.call((root || document).querySelectorAll(sel)); };
  var own = function(o, k){ return Object.prototype.hasOwnProperty.call(o, k); };

  /* COPIED from tokenTask($('forms'), [...]) and tokenTask($('stress'), [...]): the sentence as its words read, the
     word the page counts as right (words[answer]), and the page's note. */
  var WORD = {
    forms: [
      ['She hasn’t finished her homework yet', 'hasn’t', 'The contraction “hasn’t” hides two pieces students often separate incorrectly when writing: has + not.'],
      ['If I had known, I’d have called', 'I’d', '“I’d” is ambiguous in writing: students need to work out from context whether it’s “I had” or “I would.”'],
      ['He suggested that she see a doctor', 'see', 'The bare infinitive “see” (not “sees” or “to see”) after “suggested that” is the subjunctive, an irregular pattern students misform constantly.']
    ],
    stress: [
      ['I don’t want the red one', 'want', 'Neutral answer to “which one?”: the new information is stressed.'],
      ['I don’t want the red one', 'red', 'Contrast: implies someone else does, or a different color was offered.'],
      ['She’s coming on Friday not Monday', 'Monday', 'Correcting a wrong assumption: the corrected word takes the stress.']
    ]
  };
  /* COPIED from choiceTask($('weak'), [...]) (the right option of every row is its second, answer: 1) and from
     choiceTask($('approp'), [...]): the row's words as the page shows them, and the option the page counts as right. */
  var OPTION = {
    weak: {
      '“I want to go”': '/aɪ ˈwɒnə gəʊ/',
      '“What are you doing?”': '/ˈwɒtʃə ˈduːɪŋ/',
      '“Going to be late”': '/ˈgɒnə biː leɪt/',
      '“Give me a hand”': '/ˈgɪmiː ə hænd/',
      '“She has to leave”': '/ʃiː ˈhæstə liːv/'
    },
    approp: {
      '“Could you possibly pass the salt?”': 'A stranger at a formal dinner',
      '“Gimme a sec”': 'A close friend, in person',
      '“I would be grateful if you could confirm receipt.”': 'A formal business email'
    }
  };

  /* 4 · Analyze the form, and 6 · Mark the stress: under each row of words, the right one in bold and the note. */
  Object.keys(WORD).forEach(function(id){
    var boxes = list('#' + id + ' .box');
    var said = boxes.map(function(box){ return norm(list('.tok', box).map(function(t){ return t.textContent; }).join(' ')); });
    boxes.forEach(function(box, i){
      var same = WORD[id].filter(function(k){ return k[0] === said[i]; });
      if (!same.length || same.length !== said.filter(function(s){ return s === said[i]; }).length) return;
      var it = same[said.slice(0, i).filter(function(s){ return s === said[i]; }).length];   /* the first time this sentence comes, or the second */
      var hit = list('.tok', box).filter(function(t){ return t.textContent === it[1]; });
      if (hit.length === 1) A.line(box, '<b>' + esc(hit[0].textContent) + '.</b> ' + esc(it[2]));
    });
  });

  /* a row of options: its own words, without the Play button and without the small line under them (a copy is read;
     the page is not touched) */
  var asked = function(box){
    var say = box.querySelector('.say'); if (!say) return '';
    var c = say.cloneNode(true);
    list('.play, .small', c).forEach(function(x){ x.remove(); });
    return norm(c.textContent);
  };
  /* the answer is the right option's own label, and only if exactly one of the row's buttons carries it. The row is
     laid out side by side, so the line is given the full width, to stand under the row and not beside it. */
  var under = function(box, label){
    var hit = list('.opt', box).filter(function(b){ return b.textContent === label; });
    if (hit.length !== 1) return;
    var l = A.line(box, '<b>' + esc(hit[0].textContent) + '</b>');
    if (l) l.style.flex = '0 0 100%';
  };

  /* 5 · Weak forms, and 7 · Which register? */
  Object.keys(OPTION).forEach(function(id){
    A.each('#' + id + ' .box', function(box){
      var q = asked(box);
      if (own(OPTION[id], q)) under(box, OPTION[id][q]);
    });
  });

  /* 8 · Quick fire. Each item of the page's list is [the task, its type, which of the four it checks]. */
  var tasks = data(function(){ return MF_ITEMS; });
  if (tasks && tasks.filter) A.each('#quick .box', function(box){
    var q = asked(box);
    var hit = tasks.filter(function(m){ return m && '“' + norm(m[0]) + '”' === q; });
    if (hit.length === 1 && typeof hit[0][2] === 'string') under(box, hit[0][2]);
  });

  /* what a row answered on the screen shows (Right or Not quite, the note, the score): the lines above say it */
  A.hide('#forms .box > .small, #stress .box > .small, #weak .fb, #approp .fb, #quick .fb, #qfCount');

  /* 3 · Write a CCQ and 9 · Spot the flaw: the model under each target and the fix under each plan, and the staging
     example, shown whether they are open or shut on the screen */
  A.show('#ccqs .model, #flaws .model, #ex');

  /* the page's own key repeats parts 8 and 3, which are answered under their tasks above */
  A.hide('#key');
});
