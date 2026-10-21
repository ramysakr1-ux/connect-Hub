/* Guided to less-guided practice: where the house voices speak (Ramy, 22 Oct
   2026). The drills are heard as a class would hear them: the teacher in the
   chosen voice, the learners in the other; Carlos and Ingrid keep their own
   sex in whichever accent is chosen. The cued dialogue stays silent: the
   trainees write it. The lines are in lines.json beside this file. */
(function(){
  var V = window.LiteVoice; if (!V) return;
  var T = function(t, g){ return { text: t, speaker: 'a', gap: g }; }, L = function(t, g){ return { text: t, speaker: 'b', gap: g }; };
  var after = function(el, label, items){ if (!el) return; var p = document.createElement('p'); p.className = 'say-row'; p.appendChild(V.button(label, items)); el.parentNode.insertBefore(p, el.nextSibling); };
  var blocks = function(sel){ return document.querySelectorAll(sel + ' .text-block'); };

  // 3 · the chain drill: three people, each in turn.
  after(blocks('#s3')[0], 'Hear the chain', [T("How are you?"), L("I'm fine, thanks. How are you?"), T("I'm fine too. How are you?")]);

  // 4 · a guessing drill.
  after(blocks('#s4')[0], 'Hear it', [L('Is it a team sport?'), T('Yes.'), L('Do you play outside?'), T('No.'), L('Do you need special equipment?')]);

  // 5 · the jazz chant, to a beat: the lines close up so the beat carries.
  var CH = ["Hello. How's it going?", "Good. How's it going?", "I'm good. How's Karim?", "He's good.", "How's Lucia?", "She's good.", "How are the twins?", "They're good.", "How's your trip?", "It's good.", "How's Anders?", "He's sick!", "Oh dear!"];
  after(blocks('#s5')[0], 'Hear the chant', CH.map(function(t, i){ return { text: t, speaker: i % 2 ? 'b' : 'a', gap: 120 }; }));

  // 6 · transformation, then substitution: the cue, then the answer.
  var s6 = blocks('#s6');
  after(s6[0], 'Hear it', [T('I get up early every day. Mei.'), L('Mei gets up early every day.'), T('I have a bath.'), L('She has a bath.'), T("I have breakfast at eight o'clock."), L("She has breakfast at eight o'clock.")]);
  after(s6[1], 'Hear it', [T('I always play tennis on Saturdays. Sometimes.'), L('I sometimes play tennis on Saturdays.')]);

  // 7 · Carlos and Ingrid.
  after(blocks('#s8')[0], 'Hear the dialogue', [
    { text: "I'm just going to the market. Do you need anything?", speaker: 'man' },
    { text: "No, I don't think so. Oh, wait. We've run out of rice.", speaker: 'woman' },
    { text: "Don't worry. It's on my list. I'm going to get some.", speaker: 'man' },
    { text: 'What about eggs?', speaker: 'woman' },
    { text: "OK. I'll go to the farm stall and buy a dozen.", speaker: 'man' }
  ]);

  // 2 · the two chaining techniques, in their answers.
  var CHAIN = {
    'Back chaining': [T('to the market.', 700), T('going to the market.', 700), T("I'm going to the market.", 700)],
    'Forward chaining': [T('I.', 600), T("I'm.", 600), T("I'm going.", 600), T("I'm going to the market.", 600)]
  };
  document.querySelectorAll('#tryItArea .tryit-card').forEach(function(c){
    var h = c.querySelector('h4'), a = c.querySelector('.tryit-answer');
    if (h && a && CHAIN[h.textContent.trim()]) { a.appendChild(document.createTextNode(' ')); a.appendChild(V.button('Hear it', CHAIN[h.textContent.trim()])); }
  });

  // 3 · the drill types' examples, once they have checked their matching.
  var EX = {
    'Whole class': [T('I go to school.'), L('I go to school.')],
    'Half-half': [T('Where do you live?'), L('I live in Lisbon.')],
    'Open pairs': [T('What time is it?'), L("It's three o'clock.")],
    'Transformation': [T('I play tennis.'), T('She.', 500), L('She plays tennis.')],
    'Substitution': [T('I like coffee. Tea.'), L('I like tea.')],
    'A round': [T('I.', 300), L('I went.', 300), T('I went to.', 300)],
    'Chanting': [T("How's it going? How's Karim? How long does it take?")]
  };
  var area = document.getElementById('drillExamplesArea');
  if (area) new MutationObserver(function(){
    area.querySelectorAll('li').forEach(function(li){
      var b = li.querySelector('b'); var k = b && b.textContent.replace(/:$/, '').trim();
      if (EX[k] && !li.querySelector('.say-btn')) { li.appendChild(document.createTextNode(' ')); li.appendChild(V.button('Hear it', EX[k])); }
    });
  }).observe(area, { childList: true, subtree: true });
})();
