/* Connect Lite — print an input session with its answers.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * Ramy, 20 Nov 2026, after teaching Writing the lesson plan: "they need to print the lesson planning session with the
 * answers. How can they do that?" and then "let's make sure that they can do that with all input sessions."
 *
 * They could not. "Print the handout" leaves every answer out, on purpose, and most answers are not on the page at all
 * until somebody presses something: they sit in each session's own exercise data. So no stylesheet rule can print them.
 *
 * HOW IT WORKS. A session that has been gone through, exercise by exercise, gets a file of its own in answers/<slug>.js.
 * That file tells this one how to write every answer under its task. library.js loads both, and only for a session on
 * its READY list, so the card never appears on a session whose answers have not been checked: a print that showed half
 * the answers would be worse than none.
 *
 * The card, "Take the answers with you", goes at the end of the session's last part. Pressing it writes the answers
 * under the tasks, prints, and takes them away again. What the trainee has clicked or typed is never touched, no score
 * moves, and "Print the handout" still prints without answers.
 *
 * A session's file calls SessionAnswers.register(function(A){ ... }) and uses:
 *   A.line(el, html)   an answer written under el (inside it, at the end)
 *   A.after(el, html)  an answer written straight after el
 *   A.show(selector)   something already on the page that holds an answer, shown for the print
 *   A.hide(selector)   something that only gets in the way of the print (a row of buttons, a dropdown)
 *   A.each(selector, fn, root)   and   A.txt(html)  the plain words of a piece of markup, for matching
 * The blocks the stylesheet already knows hold answers (.reveal-block, .reveal-card .a, .answer-key, .why) are shown
 * without being asked.
 */
window.SessionAnswers = (function(){
  var fill = null, card = null;
  var txt = function(h){ var d = document.createElement('div'); d.innerHTML = h == null ? '' : String(h); return d.textContent.replace(/\s+/g, ' ').trim(); };
  var each = function(sel, fn, root){ [].forEach.call((root || document).querySelectorAll(sel), fn); };
  var make = function(html){ var a = document.createElement('div'); a.className = 'ans-line'; a.innerHTML = html; return a; };
  var line = function(el, html){ if (!el) return null; return el.appendChild(make(html)); };
  var after = function(el, html){ if (!el || !el.parentNode) return null; return el.parentNode.insertBefore(make(html), el.nextSibling); };
  var show = function(sel){ each(sel, function(e){ e.classList.add('ans-show'); }); };
  var hide = function(sel){ each(sel, function(e){ e.classList.add('ans-hide'); }); };
  var API = { txt: txt, each: each, line: line, after: after, show: show, hide: hide };
  function clear(){
    each('.ans-line', function(x){ x.remove(); });
    each('.ans-show', function(e){ e.classList.remove('ans-show'); });
    each('.ans-hide', function(e){ e.classList.remove('ans-hide'); });
  }
  function prepare(){ clear(); if (fill) fill(API); document.body.classList.add('with-answers'); }
  function done(){ document.body.classList.remove('with-answers'); clear(); }
  function mount(){
    if (card || !fill || document.getElementById('ansCard')) return;
    var parts = [].filter.call(document.querySelectorAll('section'), function(s){ return s.id !== 'trainer' && !s.classList.contains('trainer-notes') && !s.hidden; });
    var last = parts[parts.length - 1]; if (!last) return;
    card = document.createElement('div'); card.className = 'ans-card'; card.id = 'ansCard';
    card.innerHTML = '<h4>Take the answers with you</h4><p>When you have finished, print this session with every answer shown under its task.</p>'
      + '<div class="btn-row"><button type="button" class="btn" id="ansPrint">Print with the answers</button></div>';
    last.appendChild(card);
    card.querySelector('#ansPrint').addEventListener('click', function(){ prepare(); window.print(); });
    window.addEventListener('afterprint', done);
  }
  return {
    register: function(fn){ fill = fn; if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount(); },
    prepare: prepare, done: done, api: API
  };
})();
