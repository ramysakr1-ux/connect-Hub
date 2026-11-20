/* Connect Lite — Teaching speaking: every answer under its task, for "Print with the answers".
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 20 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs teaching-speaking <folder> shows what it prints).
 *
 * WHAT THE PRINT SHOWS, PART BY PART
 *   3  Free or controlled?        under each feature, the heading it goes under, in the words of its own dropdown (10)
 *   4  What makes it work         Nine things that make a fluency task work (#fluencyKey, shown) (1)
 *   5  Put the stages in order    the twelve stages in their order, then the page's note under it (#orderReveal) (1 + 1)
 *   6  The productive skills shape   The five stages (#shapeKey, shown) (1)
 *   7  Common speaking problems   under each problem, its solution, in the words of its own dropdown (5)
 *   8  Plan a speaking lesson     One way to plan it (#planModel, shown) (1)
 *   9  Key takeaways              Ours (#takeKey, shown) (1)
 * Parts 1 (warm-up) and 2 (the party task) are discussion and a task done as learners: there is no answer on the page,
 * so none is printed.
 *
 * WHERE EACH ANSWER COMES FROM. All of it from the page; nothing is copied into this file.
 *   Parts 3, 5 and 7: the page's own lists, top-level in its script, read by name (sortItems, stages, problemItems).
 *   Each row is matched by its own words; the answer is the row's own option whose value is the list's answer. A row
 *   that matches none, or more than one, gets no line. The order is written out here because the page builds its own
 *   list (#orderKeyList) only when Reveal answer is pressed.
 *   Parts 4, 6, 8 and 9: the page's own answer boxes, shown for the print.
 * Nothing the trainee did is touched: no dropdown is changed, no stage clicked, no box opened or shut, no score moves.
 */
SessionAnswers.register(function(A){
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var words = function(el){ return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; };

  /* The page's own lists, read first. If the page is ever rebuilt without them, this stops here, before anything is
     written, and tools/answers-check.mjs reports the error. */
  var sorts = sortItems, order = stages, problems = problemItems;

  /* 3 · Free or controlled, and 7 · Common speaking problems: under each row, the option that is right for it. */
  var rows = function(area, list, key){
    A.each(area + ' > .fill-row', function(row){
      var said = words(row.querySelector('span'));
      var hit = list.filter(function(x){ return A.txt(x[key]) === said; });
      if (hit.length !== 1) return;
      var opt = [].filter.call(row.querySelectorAll('select option'), function(o){ return o.value === hit[0].answer; });
      if (opt.length !== 1) return;
      A.after(row, '<b>' + esc(opt[0].textContent) + '</b>');   /* after the row: the row is a flex line */
    });
  };
  rows('#sortArea', sorts, 'term');
  rows('#problemArea', problems, 'problem');

  /* 5 · Put the stages in order: the twelve, first to last, then the page's own note. */
  var area = document.getElementById('orderArea');
  if (area) {
    var head = document.querySelector('#orderKey h4');
    var li = order.slice().sort(function(a, b){ return a.correct - b.correct; }).map(function(s){ return '<li>' + esc(s.text) + '</li>'; }).join('');
    A.after(area, (head ? '<b>' + esc(words(head)) + '</b>' : '') + '<ol style="margin:4px 0 0;padding-left:22px;">' + li + '</ol>');
  }
  A.show('#orderReveal');

  /* 4, 6, 8 and 9: the page's own answer boxes. */
  A.show('#fluencyKey, #shapeKey, #planModel, #takeKey');
});
