/* Classroom management: where the house voices speak (Ramy, 22 Oct 2026). One contrast, because it is the one that is better heard than read:
   the rambling instruction, then the clear one. The lines are in lines.json. */
(function(){
  var V = window.LiteVoice; if (!V) return;
  var T = function(t, g){ return { text: t, speaker: 'a', gap: g }; }, L = function(t, g){ return { text: t, speaker: 'b', gap: g }; };
  var btn = function(label, items){ return V.button(label, items); };
  var after = function(el, b){ if (!el || (el.nextElementSibling && el.nextElementSibling.classList.contains('say-row'))) return; var p = document.createElement('p'); p.className = 'say-row'; p.appendChild(b); el.parentNode.insertBefore(p, el.nextSibling); };
  var into = function(el, b){ if (!el || el.querySelector(':scope > .say-btn')) return; el.appendChild(document.createTextNode(' ')); el.appendChild(b); };
  /* the deepest element whose own text holds the words */
  var find = function(root, text){ var best = null; (root || document).querySelectorAll('*').forEach(function(e){ if (e.textContent.indexOf(text) !== -1 && !Array.prototype.some.call(e.children, function(c){ return c.textContent.indexOf(text) !== -1; })) best = best || e; }); return best; };

  var RAMBLE = "Right, so what we're gonna do is, er, I'm gonna put you into groups, but before that there are a few things we've gotta sort out. So just jot down, if you've got a pencil, could you write this, then when we've finished that we're going to move on to the next bit, which involves…", MODEL = ["Work with your partner.", "Read the five questions. Don't write.", "Ask your partner the questions. Write their answers.", "Five minutes.", "Are you writing your answers, or your partner's?"];
  after(document.querySelector('.ramble'), btn('Hear the rambling teacher', [{ text: RAMBLE }]));
  var m = document.getElementById('model');
  if (m) { var b = btn('Hear the clear version', MODEL.map(function(t, i){ return { text: t, speaker: 'a', gap: i < 3 ? 1100 : 800 }; })); m.appendChild(b); }
})();
