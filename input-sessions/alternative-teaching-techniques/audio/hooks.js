/* Alternative teaching techniques: where the house voices speak (Ramy, 22 Oct 2026). Step 5 drills the sentence backwards, so each ladder is heard a
   chunk at a time, as a class would hear it; the model sentence follows, and the learner's first attempt from step 2. The lines are in lines.json. */
(function(){
  var V = window.LiteVoice; if (!V) return;
  var T = function(t, g){ return { text: t, speaker: 'a', gap: g }; }, L = function(t, g){ return { text: t, speaker: 'b', gap: g }; };
  var btn = function(label, items){ return V.button(label, items); };
  var after = function(el, b){ if (!el || (el.nextElementSibling && el.nextElementSibling.classList.contains('say-row'))) return; var p = document.createElement('p'); p.className = 'say-row'; p.appendChild(b); el.parentNode.insertBefore(p, el.nextSibling); };
  var into = function(el, b){ if (!el || el.querySelector(':scope > .say-btn')) return; el.appendChild(document.createTextNode(' ')); el.appendChild(b); };
  /* the deepest element whose own text holds the words */
  var find = function(root, text){ var best = null; (root || document).querySelectorAll('*').forEach(function(e){ if (e.textContent.indexOf(text) !== -1 && !Array.prototype.some.call(e.children, function(c){ return c.textContent.indexOf(text) !== -1; })) best = best || e; }); return best; };

  var L1 = ["safe", "have been safe", "would have been safe", "she'd have been safe"], L2 = ["home", "at home", "stayed at home", "if she'd stayed at home"], FULL = "If she'd stayed at home, she'd have been safe.", LEARNER = "If she stay home, she not be hurt.";
  var lad = [L1, L2];
  document.querySelectorAll('.bcBtn').forEach(function(b, i){
    if (!lad[i]) return; var s = document.createElement('button'); s.type = 'button'; s.className = 'say-btn'; s.textContent = 'Hear the drill';
    s.setAttribute('data-say-seq', JSON.stringify(lad[i].map(function(t){ return { text: t, speaker: 'a', gap: 1300 }; }))); b.parentNode.appendChild(document.createTextNode(' ')); b.parentNode.appendChild(s);
  });
  var grid = document.querySelector('.grid2'); if (grid) after(grid, btn('Hear the whole sentence', [{ text: FULL }]));
  var l = find(document, LEARNER.replace(/ she not/, ' she not')); if (l) into(l, btn('Hear the student', [{ text: LEARNER }]));
})();
