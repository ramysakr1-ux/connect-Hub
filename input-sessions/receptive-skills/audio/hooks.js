/* Receptive skills: where the house voices speak (Ramy, 22 Oct 2026). The gist text can be read against the clock or, for the other receptive skill,
   heard: the same text, once, as a listening. The lines are in lines.json. */
(function(){
  var V = window.LiteVoice; if (!V) return;
  var T = function(t, g){ return { text: t, speaker: 'a', gap: g }; }, L = function(t, g){ return { text: t, speaker: 'b', gap: g }; };
  var btn = function(label, items){ return V.button(label, items); };
  var after = function(el, b){ if (!el || (el.nextElementSibling && el.nextElementSibling.classList.contains('say-row'))) return; var p = document.createElement('p'); p.className = 'say-row'; p.appendChild(b); el.parentNode.insertBefore(p, el.nextSibling); };
  var into = function(el, b){ if (!el || el.querySelector(':scope > .say-btn')) return; el.appendChild(document.createTextNode(' ')); el.appendChild(b); };
  /* the deepest element whose own text holds the words */
  var find = function(root, text){ var best = null; (root || document).querySelectorAll('*').forEach(function(e){ if (e.textContent.indexOf(text) !== -1 && !Array.prototype.some.call(e.children, function(c){ return c.textContent.indexOf(text) !== -1; })) best = best || e; }); return best; };

  var PARAS = ["A receptive skills lesson never starts cold. It opens by creating interest in the topic: visuals, personalisation, brainstorming what the class already knows. Background knowledge is part of how anyone understands a text, not a shortcut around it. Only then does the lesson pre-teach vocabulary, and only the words essential to understanding.", "The gist task comes next, testing global understanding only. For reading, students read silently under a time limit, so they read quickly and concentrate on the gist rather than the detail; for listening, the recording plays once. Only once gist is secure does the lesson set a specific information or detail task, prompting closer reading or listening.", "Peer checking before whole-class feedback plays a major role in a receptive skills lesson. It increases involvement, builds confidence by making correction feel safer than the teacher stepping in first, deepens understanding as students explain answers to each other, and builds the teamwork and communication skills that matter beyond the classroom.", "The lesson closes with a follow-up task based on something related to the text: a language focus, a discussion, a role play or a written task."];
  var timer = document.querySelector('.timer');
  if (timer) { var p = document.createElement('p'); p.className = 'say-row'; p.appendChild(document.createTextNode('Or hear the text instead, as you would play a recording for a class, once: ')); p.appendChild(btn('Listen to it', PARAS.map(function(t){ return { text: t, speaker: 'a', gap: 700 }; }))); timer.parentNode.insertBefore(p, timer.nextSibling); }
})();
