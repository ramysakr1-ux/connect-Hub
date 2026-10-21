/* Word and sentence stress: where the house voices speak (Ramy, 22 Oct 2026).
   The tasks ask trainees to decide where the stress falls before they check,
   so a recording sits in the answer, never beside the question: decide, open
   the answer, then hear it. The chant is the one exception: it is a model to
   copy. The lines are in lines.json beside this file. */
(function(){
  var V = window.LiteVoice; if (!V) return;
  var btn = function(label, items){ return V.button(label, items); };
  var add = function(el, b){ if (el && !el.querySelector('.say-btn')) { var p = document.createElement('p'); p.className = 'say-row'; p.appendChild(b); el.appendChild(p); } };

  // 1 · the chant: a model to copy, so it plays beside each line.
  var CHANT = ['Cook, bake, fry, roast.', 'Cook and bake and fry and roast.', 'Cook and then bake and then fry and then roast.', "Cook and then it's bake and then it's fry and then it's roast."];
  document.querySelectorAll('#s1 .chant-line').forEach(function(line, i){ if (CHANT[i]) line.appendChild(btn('Hear it', [{ text: CHANT[i] }])); });

  // 2 · word stress: in each word's answer.
  document.querySelectorAll('#wordGrid details.word-card').forEach(function(d){
    var w = d.querySelector('summary').textContent.trim();
    add(d.querySelector('.bubbles'), btn('Hear it', [{ text: w }]));
  });

  // 3 · one sentence, seven meanings: in each answer, with the stress where the line puts it.
  var ROSES = 'We didn’t bring them three blue balloons.'.replace('’', "'");
  document.querySelectorAll('#rosesBlock .rose-line').forEach(function(line){
    var st = line.querySelector('.stress'); var det = line.nextElementSibling;
    if (st && det) add(det.querySelector('.content'), btn('Hear it', [{ text: ROSES, stress: st.textContent.trim() }]));
  });

  // 4 · the questions alone, then asked back.
  var moved = document.querySelector('#s3b details.reveal .content');
  if (moved) {
    var row = function(label, list){
      var p = document.createElement('p'); p.className = 'say-row'; p.innerHTML = '<b>' + label + '</b> ';
      list.forEach(function(x){ p.appendChild(btn(x[0], [{ text: x[0], stress: x[1] }])); });
      moved.appendChild(p);
    };
    row('On their own:', [["What's your name?", 'name'], ['Nice to meet you.', 'meet'], ['How are you?', 'are'], ['Where are you from?', 'from'], ['Where do you live?', 'live']]);
    row('Asked back:', [['Nice to meet you too.', 'you'], ['How are you?', 'you'], ['And where are you from?', 'you'], ['And where do you live?', 'you']]);
  }

  // 5 · the café: the exchange, customer then server, in each answer.
  var CAFE = ['oat milk', 'any', 'have', "don't", 'We'];
  document.querySelectorAll('#s3c .paris-block').forEach(function(b, i){
    var q = b.querySelector('.qline'); if (!q || !CAFE[i]) return;
    var said = q.textContent.replace(/^\s*Customer\s*/, '').trim();
    add(b.querySelector('details.reveal .content'), btn('Hear the exchange', [{ text: said }, { text: "We don't have any oat milk.", stress: CAFE[i], speaker: 'b' }]));
  });

  // 6 · Lisbon: the question with its stress, then the answer.
  var LISBON = [['is', 'Yes, of course she is. Stop worrying.'], ['she', 'No, Amara is.'], ['driving', 'No, taking the train.'], ['Lisbon', 'No, Porto.'], ['Friday', 'No, on Thursday.']];
  document.querySelectorAll('#parisBlock .paris-block').forEach(function(b, i){
    if (!LISBON[i]) return;
    add(b.querySelector('details.reveal .content'), btn('Hear the exchange', [{ text: 'Is she driving to Lisbon on Friday?', stress: LISBON[i][0] }, { text: LISBON[i][1], speaker: 'b' }]));
  });

  // 7 · noun or verb: once they have chosen.
  var QUIZ = ['I bought a new record.', 'Please record the lesson.', "Here's your present.", "I'd like to present my idea.", 'Sign the contract.', 'They will contract a builder.', "What's that object on the desk?", 'I object to that decision.'];
  document.querySelectorAll('#quizBlock .quiz-word').forEach(function(w, i){
    if (!QUIZ[i]) return;
    var b = btn('Hear it', [{ text: QUIZ[i] }]); b.hidden = true;
    w.appendChild(b);
    w.querySelector('.quiz-options').addEventListener('click', function(){ setTimeout(function(){ b.hidden = false; }, 0); });
  });
})();
