/* Functional language: where the house voices speak (Ramy, 22 Oct 2026). The exponents are heard in each answer key (the stress, weak forms and
   intonation are the phonology answer), the twelve matched sentences in their key, the six ways to ask for the salt beside the discussion, and the replies
   as exchanges. The lines are in lines.json. */
(function(){
  var V = window.LiteVoice; if (!V) return;
  var T = function(t, g){ return { text: t, speaker: 'a', gap: g }; }, L = function(t, g){ return { text: t, speaker: 'b', gap: g }; };
  var btn = function(label, items){ return V.button(label, items); };
  var after = function(el, b){ if (!el || (el.nextElementSibling && el.nextElementSibling.classList.contains('say-row'))) return; var p = document.createElement('p'); p.className = 'say-row'; p.appendChild(b); el.parentNode.insertBefore(p, el.nextSibling); };
  var into = function(el, b){ if (!el || el.querySelector(':scope > .say-btn')) return; el.appendChild(document.createTextNode(' ')); el.appendChild(b); };
  /* the deepest element whose own text holds the words */
  var find = function(root, text){ var best = null; (root || document).querySelectorAll('*').forEach(function(e){ if (e.textContent.indexOf(text) !== -1 && !Array.prototype.some.call(e.children, function(c){ return c.textContent.indexOf(text) !== -1; })) best = best || e; }); return best; };

  var EXPS = ["Can you pass me the salt, please?", "You should rest at home.", "If only I'd been more patient with him."], PAIRS = ["Would you like to come to a concert on Friday?", "Sorry to stop you but what do you mean?", "Yes, that's exactly what I think.", "Good morning, how's it going?", "If you do that again there'll be trouble.", "I really don't share your view on this.", "I think you should go and see a doctor.", "Oh, thank you so much for the lovely scarf you gave me!", "What I mean is, this is the important part.", "I think the green one's much more interesting.", "You must be at the airport by 6am.", "I'd love to but I'm busy."], REQS = ["Can you pass me the salt?", "Would you be so kind as to pass me the salt, please?", "Pass the salt, please.", "Salt.", "Could you pass me the salt?", "Would you mind passing the salt?"], ACC = ["Sure, no problem.", "Of course, here you go.", "Yeah, I'd be happy to."], DEC = ["I'm sorry, I can't right now.", "I'd love to, but I'm busy.", "Sorry, I'm afraid not."];
  var keys = Array.prototype.filter.call(document.querySelectorAll('.reveal-block'), function(e){ return /^key\d$/.test(e.id); });
  keys.forEach(function(k, i){
    if (!EXPS[i]) return;
    var ph = Array.prototype.find.call(k.querySelectorAll('.key-row'), function(r){ return /Phonology/.test(r.textContent); });
    into(ph ? ph.querySelector('.key-box') : k, btn('Hear it', [{ text: EXPS[i] }]));
  });
  var km = document.getElementById('keyM');
  if (km) PAIRS.forEach(function(t){ var e = find(km, t.replace(/'/g, "\u2019")) || find(km, t); if (e) into(e, btn('Hear it', [{ text: t }])); });
  document.querySelectorAll('#s8 .checklist li').forEach(function(li, i){ if (REQS[i]) into(li, btn('Hear it', [{ text: REQS[i] }])); });
  var boxes = document.querySelectorAll('#keyR .key-box');
  var ex = function(list){ var o = []; list.forEach(function(r){ o.push(T(REQS[0], 250)); o.push(L(r)); }); return o; };
  if (boxes[0]) into(boxes[0], btn('Hear them', ex(ACC)));
  if (boxes[1]) into(boxes[1], btn('Hear them', ex(DEC)));
})();
