/* Error correction: where the house voices speak (Ramy, 22 Oct 2026). Each learner's error is heard as a learner would say it, in the
   match task and in the practice tables, so the pronunciation mistakes can be told from the grammar ones. The lines are in lines.json. */
(function(){
  var V = window.LiteVoice; if (!V) return;
  var T = function(t, g){ return { text: t, speaker: 'a', gap: g }; }, L = function(t, g){ return { text: t, speaker: 'b', gap: g }; };
  var btn = function(label, items){ return V.button(label, items); };
  var after = function(el, b){ if (!el || (el.nextElementSibling && el.nextElementSibling.classList.contains('say-row'))) return; var p = document.createElement('p'); p.className = 'say-row'; p.appendChild(b); el.parentNode.insertBefore(p, el.nextSibling); };
  var into = function(el, b){ if (!el || el.querySelector(':scope > .say-btn')) return; el.appendChild(document.createTextNode(' ')); el.appendChild(b); };
  /* the deepest element whose own text holds the words */
  var find = function(root, text){ var best = null; (root || document).querySelectorAll('*').forEach(function(e){ if (e.textContent.indexOf(text) !== -1 && !Array.prototype.some.call(e.children, function(c){ return c.textContent.indexOf(text) !== -1; })) best = best || e; }); return best; };

  var ERRS = ["My brother live near here.", "What you did eat for lunch?", "The photographer is outside.", "Give me one eat-box!", "I walk to school every thay.", "She did a big mistake at work.", "He is working here since March.", "It's late; I'm going to bad."], PRAC = {"A": "We must to leave early today.", "B": "He yesterday visited the museum.", "C": "She's wearing hat.", "D": "How much bottles did you buy?", "E": "He walk to work slowly every day.", "F": "I stay three days in the hotel last week.", "G": "I would be most grateful if you could lend me your umbrella.", "H": "I stayed at home because I was constipated.", "I": "This lecture never ends. I'm boring.", "J": "I always feel the tank on Fridays.", "K": "I like to bek cakes on Sundays.", "L": "At the party she was very enjoy.", "M": "Please bring a share."};
  document.querySelectorAll('#errorMatchArea .fill-row').forEach(function(row, i){
    var sp = row.querySelector('span'); if (sp && ERRS[i]) { sp.appendChild(document.createTextNode(' ')); sp.appendChild(btn('Hear it', [{ text: ERRS[i] }])); }
  });
  ['practice1', 'practice2'].forEach(function(id){
    document.querySelectorAll('#' + id + ' tr').forEach(function(tr){
      var c = tr.children; if (!c[1] || !c[0]) return; var k = c[0].textContent.trim();
      if (PRAC[k]) { c[1].appendChild(document.createTextNode(' ')); c[1].appendChild(btn('Hear it', [{ text: PRAC[k] }])); }
    });
  });
})();
