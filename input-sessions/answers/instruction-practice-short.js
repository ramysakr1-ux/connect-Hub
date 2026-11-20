/* Connect Lite — Classroom management: instructions (the short session), printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 20 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs instruction-practice-short <folder> shows what it prints).
 *
 * What "Print with the answers" writes on this session:
 *   1  In brief                    the answer under each of the six questions, shown where it stands on the page
 *   2  Fix the instruction         what goes wrong in each of the five instructions and one way to say it, shown where
 *                                  it stands on the page
 *   3  Good check, or no check?    under each of the eight ICQs: the option the page counts as right, in bold, and the
 *                                  page's own explanation
 *   4  Practice in threes          the model instruction and ICQs for each of the eight tasks, written after the
 *                                  "Compare yours with a model" sentence (the page leaves its own list of models off
 *                                  paper, so the models are written out from that list here)
 * The list in 1 ("what does a teacher have to manage?"), the instruction and ICQs a trainee writes in 4, the students'
 * checklist in 4 and the instruction for the next TP in 5 are the trainees' own: the page holds no answer to them, so
 * none is printed.
 *
 * WHERE THE ANSWERS COME FROM. Nothing is copied into this file.
 *   Parts 1 and 2: the page's own answer blocks (.ans), shown whether "Show the answers" was pressed or not.
 *   Part 3: the page's own list (ICQS, the one "Check our answers" marks against), read by name and placed by each
 *   question's own words. The label is the text of the option button the page counts as right (data-a 1 for a real
 *   check, 0 for one that checks nothing). A question whose words are not in the list gets no line, nor does one whose
 *   right option is not on exactly one of its own buttons: nothing is ever guessed.
 *   Part 4: the page's own list (TASKS), read by name, in the words and order the page's models use.
 *
 * Nothing the trainee did is touched: no option is pressed, nothing is opened or shut, the score stays. A checked ICQ
 * carries its explanation and its answer on the screen; those are put aside for this print (the page's print rule
 * already hides the answer word, the score and the colors), so a checked ICQ prints the same as an untouched one, and
 * its answer is said once.
 */
SessionAnswers.register(function(A){
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var norm = function(t){ return String(t == null ? '' : t).replace(/[“”"]/g, '').replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var only = function(list, test){ var hit = list.filter(test); return hit.length === 1 ? hit[0] : null; };

  /* 1 and 2 · the answer under each question, and the fix under each instruction */
  A.show('#review .ans, #fixes .ans');

  /* 3 · Good check, or no check? Each item of the list is [the question, is it a real check, why]. */
  var icqs = data(function(){ return ICQS; });
  if (icqs && icqs.filter) A.each('#icqs .scen', function(scen){
    var t = scen.querySelector('.t'); if (!t) return;
    var words = norm([].filter.call(t.childNodes, function(n){ return n.nodeType === 3; }).map(function(n){ return n.nodeValue; }).join('')).replace(/^\d+\.\s*/, '');
    var q = only(icqs, function(x){ return x && norm(x[0]) === words; }); if (!q) return;
    var hit = [].filter.call(scen.querySelectorAll('.opt'), function(b){ return b.dataset.a === (q[1] ? '1' : '0'); });
    if (hit.length !== 1) return;
    var label = hit[0].textContent.trim(), why = q[2] == null ? '' : String(q[2]);
    A.after(scen.querySelector('.opts') || t, '<b>' + esc(label) + '.</b>' + (why ? ' ' + esc(why) : ''));
  });
  /* the page's own explanation block says the same thing once the ICQs are checked; the line above already says it */
  A.hide('#icqs .scen .why, #icqs .scen .mark');

  /* 4 · the model for each task, in the page's own words, after the sentence that asks for them */
  var tasks = data(function(){ return TASKS; }), models = document.getElementById('models');
  var lead = models && models.previousElementSibling;
  if (tasks && tasks.map && lead) {
    var at = lead;
    tasks.forEach(function(t, i){
      if (!t || !t[1]) return;
      at = A.after(at, '<b>Task ' + (i + 1) + '.</b> ' + esc(t[0]) + '<br>“' + esc(t[1]) + '”<br>ICQs: ' + esc(t[2])) || at;
    });
  }
});
