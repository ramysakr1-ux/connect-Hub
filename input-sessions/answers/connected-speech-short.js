/* Connect Lite — Connected speech (the short session), printed with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * 21 Nov 2026. Written after going through the session exercise by exercise in a browser (answers.js says how this
 * file is used; tools/answers-check.mjs connected-speech-short <folder> shows what it prints).
 *
 * What "Print with the answers" writes on this session:
 *   1  Lead-in, alternative     under each of the three homophone strings: the sentence it sounds out, in bold
 *   2  Terminology match        after the two columns: each of the five terms in bold, then its meaning
 *   3  Strong and weak forms    under each of the three clips: the option the page counts as right, in bold, then
 *   4  Linking                  the page's own explanation (the one it shows once an option is chosen). The same in
 *   5  Intrusion                each of the five parts: fifteen clips in all.
 *   6  Assimilation
 *   7  Elision
 * 1 (Lead-in, "gonna") answers itself in its own words ("There isn't one"), and 8 (Close) asks nothing: no answer is
 * printed for either.
 *
 * WHERE THE ANSWERS COME FROM. Nothing is copied into this file. The page's three lists are top-level in its own
 * script, so they are read by name: HOMO (each string and its sentence), TERMS (each term and its meaning, the list
 * the match is marked against) and SECTIONS (each clip, its two options, which is right, and the explanation). Each
 * answer is placed by the task's own words on the page. A string, term or clip whose words are not in its list gets
 * no line, and neither does a clip whose right option is not on exactly one of its own buttons: nothing is guessed.
 *
 * Nothing the trainee did is touched: no option is chosen, no pair matched, no line revealed or hidden. On the screen
 * an answered clip carries "Correct." or "Not this one." with the explanation, and a revealed string carries its
 * sentence; the page's own print rule (21 Nov 2026) leaves both off the paper, and they are put aside here as well, so
 * an answered page prints the same as an untouched one and every answer is said once.
 */
SessionAnswers.register(function(A){
  var data = function(fn){ try { return fn(); } catch (e) { return null; } };
  var norm = function(t){ return String(t == null ? '' : t).replace(/\s+/g, ' ').trim(); };
  var esc = function(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var list = function(sel, root){ return [].slice.call((root || document).querySelectorAll(sel)); };
  var only = function(arr, test){ var hit = arr.filter(test); return hit.length === 1 ? hit[0] : null; };

  /* 1 · Lead-in, alternative. Each item of the page's list is [the string, the sentence it sounds out]. The row is
     laid out side by side, so the line is given the full width, to stand under the string and not beside it. */
  var homo = data(function(){ return HOMO; });
  if (homo && homo.filter) A.each('#homo .box', function(box){
    var p = box.querySelector('.homo'); if (!p) return;
    var it = only(homo, function(h){ return h && norm(h[0]) === norm(p.textContent); });
    if (!it || typeof it[1] !== 'string' || !it[1]) return;
    var l = A.line(box, '<b>' + esc(it[1]) + '</b>');
    if (l) l.style.flex = '0 0 100%';
  });

  /* 2 · Terminology match. Each item of the page's list is [the term, its meaning]. Written only for a term that is
     on exactly one button of the left column and whose meaning is on exactly one of the right. */
  var terms = data(function(){ return TERMS; }), wrap = document.querySelector('#s2 .pill-match-wrap');
  if (terms && terms.filter && wrap) {
    var left = list('#mLeft .pill').map(function(b){ return norm(b.textContent); });
    var right = list('#mRight .pill').map(function(b){ return norm(b.textContent); });
    var at = wrap;
    left.forEach(function(term){
      var it = only(terms, function(t){ return t && norm(t[0]) === term; });
      if (!it || left.filter(function(x){ return x === term; }).length !== 1) return;
      if (right.filter(function(x){ return x === norm(it[1]); }).length !== 1) return;
      var l = A.after(at, '<b>' + esc(it[0]) + ':</b> ' + esc(it[1]));
      if (l) at = l;
    });
  }

  /* 3 to 7 · The five features. Each item of the page's list is [the feature's meaning, its clips]; each clip is
     [the words as shown, the words as spoken, the two options, which option is right, the explanation]. */
  var secs = data(function(){ return SECTIONS; });
  if (secs && secs.length) A.each('.feat', function(feat){
    var sec = secs[+feat.dataset.f]; if (!sec || !sec[1] || !sec[1].filter) return;
    A.each('.box', function(box){
      var p = box.querySelector('.ex-top p'); if (!p) return;
      var ex = only(sec[1], function(x){ return x && norm(x[0]) === norm(p.textContent); }); if (!ex || !ex[2]) return;
      var label = ex[2][ex[3]]; if (typeof label !== 'string' || !label) return;
      if (list('.opt', box).filter(function(b){ return b.textContent === label; }).length !== 1) return;
      A.line(box, '<b>' + esc(label) + '.</b>' + (ex[4] ? ' ' + esc(ex[4]) : ''));
    }, feat);
  });

  /* what an answered clip and a revealed string show on the screen: the lines above say it. The count of pairs
     matched is the trainee's score, and the handout leaves it off too. */
  A.hide('.feat .fb, #homo .homo-a, #mCount');
});
