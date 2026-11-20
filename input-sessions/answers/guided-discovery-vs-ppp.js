/* Connect Lite — Guided discovery versus PPP: every answer under its task, for "Print with the answers".
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 20 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs guided-discovery-vs-ppp <folder> shows what it prints). answers.js calls this
 * when the button is pressed, prints, and takes everything away again.
 *
 * WHAT THE PRINT SHOWS, PART BY PART
 *   2  Look at the sentences    under each of the ten questions, the answer the page keeps behind "Check the answers" (10)
 *   2  Function                 under the rule, the word for each of its four gaps, in the order of the gaps (4, on 1 line)
 *   2  Form                     under each of the four patterns, the words for its gaps, in the order of the gaps (11, on 4 lines)
 *   3  Watch a lesson           the three stages behind "Reveal answer"
 *   4  Two approaches           which was which, behind "Show which was which"
 *   5  The stages of each       under each stage of the two texts, the words for its gaps, in the order of the gaps (15, on 6 lines)
 *   6  Turn it round            one way to turn it round, behind "Reveal answer"
 * The three boxes behind a button are .reveal-block, which the stylesheet shows in this print without being asked.
 * The lead-in, "Is Frank unlucky, or lucky?", the stage notes and questions 3 to 5 of Two approaches are for the room:
 * the page holds no answer to them, so none is printed.
 *
 * WHERE EACH ANSWER COMES FROM. All of it from the page itself; nothing is copied into this file.
 *   The ten questions: each question's own answer in the markup (.ans). The page's print rule keeps that block off the
 *   paper whether or not "Check the answers" has been pressed, so the answer is written out under its question.
 *   The gaps: each dropdown's own key (data-key), the one the page's Check buttons mark against, said in the words of
 *   that dropdown's own option. A gap whose key is on none of its options is not guessed: its rule, pattern or stage
 *   gets no line at all, and the check will show it missing.
 *
 * Nothing the trainee did is touched: no dropdown is set, no mark or score moves, no answer is opened or shut on the
 * screen, and what was typed stays as it is. A dropdown prints as a line to write on whatever was chosen in it
 * (library.js does that for every print), so an exercise answered on the screen prints the same as an untouched one.
 */
SessionAnswers.register(function(A){
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var words = function(el){ return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; };
  var DOT = ' · ';

  /* The answer of one dropdown: the words on its own option for the value the page counts as right (the page's test:
     the two in small letters are the same). No such option, or more than one: no answer. */
  var answer = function(sel){
    var key = (sel.getAttribute('data-key') || '').toLowerCase(); if (!key) return '';
    var hit = [].filter.call(sel.options, function(o){ return o.value && o.value.toLowerCase() === key; });
    return hit.length === 1 ? words(hit[0]) : '';
  };
  /* Every gap of one rule, pattern or stage, in the order the gaps stand. If one of them has no answer, none is said. */
  var gaps = function(root){
    var said = [], whole = true;
    A.each('select.blank', function(sel){ var a = answer(sel); if (a) said.push('<b>' + esc(a) + '</b>'); else whole = false; }, root);
    return whole && said.length ? said.join(DOT) : '';
  };

  /* 2 · Look at the sentences: the ten questions, each with its own answer under it. */
  A.each('#discover > li', function(li){
    var ans = li.querySelector('.ans'); if (!ans || !A.txt(ans.innerHTML)) return;
    A.line(ans.parentNode, '<b>' + ans.innerHTML + '</b>');
  });

  /* 2 · Function: the rule's four words, under the rule. */
  var rule = document.querySelector('#s2 .rule'), ruleSaid = rule ? gaps(rule) : '';
  if (ruleSaid) A.after(rule, ruleSaid);

  /* 2 · Form: under each pattern of the table, the words for its gaps. */
  A.each('#formTable tr', function(row){
    var first = row.querySelector('select.blank'), cell = first && first.closest('td'), said = cell ? gaps(row) : '';
    if (said) A.line(cell, said);
  });

  /* 5 · The stages of each: under each stage of the two texts, the words for its gaps. */
  A.each('#s5 .gaptext p', function(p){
    var said = p.querySelector('select.blank') ? gaps(p) : '';
    if (said) A.after(p, said);
  });
});
