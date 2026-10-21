/* Connected speech: where the house voices speak (Ramy, 22 Oct 2026). Every
   task here is "say it, work it out, then check", so each recording sits in
   the answer: the real sentence at natural speed, once the card is open. The
   link maze has none: hearing a phrase would tell you which way to move. The
   lines are in lines.json beside this file. */
(function(){
  var V = window.LiteVoice; if (!V) return;
  var btn = function(label, items){ var b = V.button(label, items); b.addEventListener('click', function(e){ e.stopPropagation(); }); return b; };
  var add = function(el, b){ if (el && !el.querySelector('.say-btn')) { el.appendChild(document.createTextNode(' ')); el.appendChild(b); } };

  // Lead-in and elision: inside each card's answer.
  document.querySelectorAll('#decodeArea .reveal-card .a').forEach(function(a){ add(a, btn('Hear it', [{ text: a.textContent.trim() }])); });
  var ELISION = ['tallest building', 'fastest mammal'];
  document.querySelectorAll('#elisionArea .reveal-card .a').forEach(function(a, i){ if (ELISION[i]) add(a, btn('Hear it', [{ text: ELISION[i] }])); });

  // The dictation computer: the real sentence, once the pair is matched.
  document.querySelectorAll('#dcLeft .dc-real').forEach(function(r){
    var t = (r.querySelector('b, strong') || r).textContent.replace(/^[^A-Z]*/, '').trim();
    var m = t.match(/^(.*?[.?!])/); if (m) t = m[1];
    add(r, btn('Hear it', [{ text: t }]));
  });

  // Mark the links: the whole story, beside the suggested links.
  var keyBtn = Array.prototype.find.call(document.querySelectorAll('button'), function(b){ return /suggested links/i.test(b.textContent); });
  var story = Array.prototype.map.call(document.querySelectorAll('#linkingPara .word-plain'), function(w){ return w.textContent; }).join(' ');
  if (keyBtn && story) keyBtn.parentNode.appendChild(btn('Hear the story read', [{ text: story }]));

  // Weak forms: each sentence, shown with the answer.
  var weakRow = document.querySelector('#weakArea .btn-row');
  if (weakRow) {
    var row = document.createElement('div'); row.className = 'say-row'; row.hidden = true;
    document.querySelectorAll('#weakArea .text-block').forEach(function(tb){
      var t = Array.prototype.map.call(tb.querySelectorAll('.word-link'), function(w){ return w.textContent; }).join(' ');
      row.appendChild(btn(t, [{ text: t }]));
    });
    weakRow.parentNode.appendChild(row);
    weakRow.addEventListener('click', function(){ setTimeout(function(){ row.hidden = !document.querySelector('#weakArea .word-link.weak'); }, 0); });
  }

  // All five together: each example, on the back of its card.
  document.querySelectorAll('#featGrid .feat-ex-row').forEach(function(r){
    var w = r.querySelector('.feat-written'); if (w) add(r, btn('Hear it', [{ text: w.textContent.trim() }]));
  });
})();
