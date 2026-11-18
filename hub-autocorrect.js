/* LITE'S OWN AUTOCORRECT, FOR TUTORS (Ramy, 18 Nov 2026: "we should have spelling auto correct for the trainers. an
   intuitive one ... could be turned on and off"). The browser underlines a misspelling but on a laptop it never fixes one,
   so a tutor writing feedback fast leaves "teh" and "recieve" in a document the trainee keeps. This fixes a word the moment
   it ends (a space, a full stop, a comma), the way a phone does:
   - spelling only (Ramy: "no suggestions, auto ... only spelling though"): real misspellings from the list below, fixed
     with no list to choose from. No grammar, no capitals, no style, and never British to American spelling or the other
     way: the tutor's English is theirs.
   - Backspace straight after puts the word back, and that word is left alone on this page from then on.
   - a small note on the field says what changed, with Undo and Turn off.
   - on or off per device, from the note or the dashboard's Course menu (localStorage 'hub:autocorrect').
   Tutors only: trainees and students get no correction at all (hub-store.js, 16 Nov 2026). A field marked
   autocorrect="off" is left alone. Loaded by hub-store.js. */
(function(){
  if (window.hubAutocorrect) return;
  var H = window.HubStore;
  var KEY = 'hub:autocorrect';
  var isOn = function(){ try { return localStorage.getItem(KEY) !== 'off'; } catch (e) { return true; } };
  var setOn = function(v){ try { if (v) localStorage.removeItem(KEY); else localStorage.setItem(KEY, 'off'); } catch (e) {} };
  var tutor = function(){ try { return !!(H && H.isTutor() && !H.isTrainee() && !H.isVolunteer()); } catch (e) { return false; } };

  var LIST = (
    'teh the|hte the|teh the|thh the|adn and|nad and|anf and|wiht with|wtih with|iwth with|waht what|whta what|taht that|thta that|tath that|' +
    'tehy they|thye they|thier their|theri their|thsi this|tihs this|htis this|jsut just|juts just|abotu about|aobut about|abuot about|' +
    'becuase because|beacuse because|becasue because|becuse because|becaus because|alot a lot|alos also|aslo also|alredy already|allready already|' +
    'allways always|alwasy always|alwyas always|actualy actually|acutally actually|ahve have|hvae have|agian again|agin again|againts against|' +
    'basicaly basically|bascially basically|beign being|bieng being|betwen between|bewteen between|cheked checked|chekc check|' +
    'doign doing|exmaple example|exapmle example|examlpe example|firts first|frist first|givne given|goign going|giong going|' +
    'helpfull helpful|usefull useful|infomation information|informaiton information|knwo know|konw know|kwon know|littel little|' +
    'makign making|mkae make|amke make|mroe more|mabye maybe|maybee maybe|onyl only|olny only|probelm problem|problme problem|' +
    'realy really|realyl really|rigth right|siad said|shoud should|shoudl should|woudl would|wolud would|coudl could|cuold could|' +
    'somthing something|soemthing something|everthing everything|anythign anything|thign thing|thnig thing|tiem time|tmie time|' +
    'peopel people|poeple people|togehter together|toghether together|veyr very|vrey very|wehn when|whne when|wnat want|wnats wants|' +
    'whcih which|whihc which|wihch which|wich which|yuo you|yoru your|yuor your|whith with|whit with|hwo how|wiat wait|' +
    'dont don\'t|doesnt doesn\'t|didnt didn\'t|isnt isn\'t|wasnt wasn\'t|werent weren\'t|arent aren\'t|hasnt hasn\'t|havent haven\'t|' +
    'hadnt hadn\'t|couldnt couldn\'t|wouldnt wouldn\'t|shouldnt shouldn\'t|im I\'m|ive I\'ve|youre you\'re|theyre they\'re|thats that\'s|' +
    'whats what\'s|theres there\'s|heres here\'s|' +
    'recieve receive|recieved received|recieving receiving|beleive believe|belive believe|beleived believed|acheive achieve|acheived achieved|' +
    'seperate separate|seperately separately|definately definitely|definatly definitely|definetly definitely|occured occurred|occurence occurrence|' +
    'untill until|begining beginning|calender calendar|collegue colleague|collegues colleagues|comming coming|completly completely|' +
    'concious conscious|consistant consistent|critisism criticism|curiousity curiosity|decison decision|develope develop|diffrent different|' +
    'diferent different|differnt different|dissapoint disappoint|dissapointed disappointed|embarass embarrass|enviroment environment|' +
    'existance existence|explaination explanation|familar familiar|finaly finally|foriegn foreign|freind friend|freinds friends|' +
    'happend happened|immediatly immediately|independant independent|interupt interrupt|interupted interrupted|knowlege knowledge|' +
    'noticable noticeable|neccessary necessary|necesary necessary|neccesary necessary|occassion occasion|oppurtunity opportunity|' +
    'opportunty opportunity|oportunity opportunity|probaly probably|probabley probably|quesiton question|questoin question|qeustion question|' +
    'quesitons questions|refered referred|relevent relevant|remeber remember|rember remember|responsiblity responsibility|rythm rhythm|' +
    'sentance sentence|sentances sentences|similiar similar|speach speech|strenght strength|strenghts strengths|suprise surprise|' +
    'suprised surprised|tommorow tomorrow|tomorow tomorrow|tommorrow tomorrow|truely truly|wierd weird|writting writing|wriitng writing|' +
    'sucessful successful|succesful successful|successfull successful|sucessfully successfully|succesfully successfully|sucess success|' +
    'apropriate appropriate|approprate appropriate|appropiate appropriate|recomend recommend|reccomend recommend|recomended recommended|' +
    'accomodate accommodate|effecive effective|efective effective|effectivly effectively|intresting interesting|interestign interesting|' +
    'elicted elicited|eliciated elicited|elicted elicited|eliciation elicitation|elictation elicitation|elciit elicit|' +
    'instrucitons instructions|instuctions instructions|insturctions instructions|intructions instructions|instrucions instructions|' +
    'monitering monitoring|moniter monitor|monitered monitored|monitorign monitoring|vocabulery vocabulary|vocabluary vocabulary|' +
    'vocabualry vocabulary|pronounciation pronunciation|pronunciaton pronunciation|pronuncation pronunciation|grammer grammar|' +
    'gramatical grammatical|grammatial grammatical|stuents students|studnets students|studetns students|stduents students|sutdents students|' +
    'studnet student|stuent student|lerners learners|learenrs learners|leraners learners|lerner learner|activites activities|' +
    'actvities activities|activties activities|actvity activity|acitvity activity|excercise exercise|exersice exercise|excercises exercises|' +
    'feeback feedback|feedbak feedback|fedback feedback|lesosn lesson|lessson lesson|lessosn lessons|teahcer teacher|techer teacher|' +
    'teachr teacher|teahcing teaching|teachign teaching|trainne trainee|traniee trainee|trainee\'s trainee\'s|traineee trainee|' +
    'pracitce practice|practcie practice|contxt context|contetx context|meanign meaning|meanig meaning|' +
    'concpet concept|intonaton intonation|intonatoin intonation|controled controlled|' +
    'staging staging|rapor rapport|rapoort rapport|raport rapport|engagment engagement|engagemnt engagement|interation interaction|' +
    'interacion interaction|corection correction|corretion correction|accuratly accurately|accuarcy accuracy|fluecny fluency|' +
    'demonstation demonstration|demostration demonstration|demonstrtion demonstration|clarifiy clarify|clarfy clarify|' +
    'expalin explain|explian explain|expalined explained|explaned explained|exampels examples|exmaples examples|' +
    'timeing timing|timming timing|alloted allotted|neccessarily necessarily|particulary particularly|' +
    'paticular particular|particluar particular|espeically especially|especialy especially|genrally generally|generaly generally|' +
    'overal overall|ovearll overall|imporve improve|improvment improvement|improvemnt improvement|imporvement improvement|' +
    'strenghten strengthen|weakenss weakness|weaknes weakness|confidnet confident|confidance confidence|confindence confidence|' +
    'considerd considered|consier consider|carefuly carefully|carefull careful|clearlly clearly|clealry clearly|quikly quickly|quickyl quickly'
  ).split('|').reduce(function(m, p){ var i = p.indexOf(' '); var a = p.slice(0, i), b = p.slice(i + 1); if (a !== b.toLowerCase()) m[a] = b; return m; }, {});

  var FIELD = 'textarea, input:not([type]), input[type=text], input[type=search], [contenteditable], [contenteditable] *';
  var ENDS = /^[\s.,;:!?)\]"”’]$/;
  var kept = {}; // words Undone on this page: never corrected again here
  var last = null; // the correction just made, for Backspace and Undo

  function caseLike(word, fix){
    if (/^[A-Z]+$/.test(word) && word.length > 1 && fix.indexOf(' ') === -1) return fix.toUpperCase();
    if (/^[A-Z]/.test(word) && /^[a-z]/.test(fix)) return fix.charAt(0).toUpperCase() + fix.slice(1);
    return fix;
  }
  function fixFor(word){
    var low = word.toLowerCase();
    if (kept[low]) return null;
    var f = LIST[low];
    if (f) { var out = /^[A-Z]{2}/.test(f) ? f : caseLike(word, f); return out === word ? null : out; }
    return null;
  }
  function editable(el){
    if (!el || !el.closest) return null;
    var f = el.closest('textarea, input, [contenteditable]');
    if (!f || f.closest('[autocorrect="off"], [data-noautocorrect]')) return null;
    if (f.tagName === 'INPUT' && !/^(text|search|)$/.test((f.getAttribute('type') || '').toLowerCase())) return null;
    if (f.isContentEditable === false && f.tagName !== 'TEXTAREA' && f.tagName !== 'INPUT') return null;
    return f;
  }

  /* Replace the n characters before the caret with text, through the browser's own editing so Cmd+Z still works and the
     page's own input listeners see the change (autosave). */
  function replaceBefore(field, n, text){
    if (field.tagName === 'TEXTAREA' || field.tagName === 'INPUT') {
      var end = field.selectionStart;
      field.setSelectionRange(end - n, end);
      if (!document.execCommand('insertText', false, text)) { field.setRangeText(text, end - n, end, 'end'); field.dispatchEvent(new Event('input', { bubbles: true })); }
      return;
    }
    var sel = getSelection(); if (!sel.rangeCount) return;
    var r = sel.getRangeAt(0), node = r.startContainer, off = r.startOffset;
    if (node.nodeType !== 3 || off < n) return;
    var rr = document.createRange(); rr.setStart(node, off - n); rr.setEnd(node, off);
    sel.removeAllRanges(); sel.addRange(rr);
    document.execCommand('insertText', false, text);
  }
  function textBefore(field){
    if (field.tagName === 'TEXTAREA' || field.tagName === 'INPUT') {
      if (field.selectionStart !== field.selectionEnd) return null;
      return field.value.slice(Math.max(0, field.selectionStart - 40), field.selectionStart);
    }
    var sel = getSelection(); if (!sel.rangeCount || !sel.isCollapsed) return null;
    var r = sel.getRangeAt(0); if (r.startContainer.nodeType !== 3) return null;
    return r.startContainer.data.slice(Math.max(0, r.startOffset - 40), r.startOffset);
  }

  /* THE NOTE: small, on the field's own bottom edge, gone after five seconds. It sits over the field, never over a
     button below it. */
  var note, noteTimer;
  function css(){
    if (document.getElementById('acStyle')) return;
    var s = document.createElement('style'); s.id = 'acStyle';
    s.textContent = '.ac-note{position:absolute; z-index:60; display:flex; align-items:center; gap:10px; flex-wrap:wrap; max-width:calc(100vw - 32px); padding:6px 10px; background:var(--paper,#fffdf8); border:1px solid var(--sand-line,#e2d6bf); border-top:3px solid var(--teal,#1e6b63); border-radius:8px; box-shadow:0 6px 18px -8px rgba(40,30,15,.3); font:500 0.8rem/1.3 Karla,sans-serif; color:var(--ink,#2a2418);}' +
      '.ac-note b{font-weight:700;} .ac-note button{font:700 0.78rem Karla,sans-serif; color:var(--teal,#1e6b63); background:none; border:0; padding:4px 2px; cursor:pointer; text-decoration:underline; text-underline-offset:2px;}' +
      '.ac-note button:hover{color:var(--ink,#2a2418);}';
    document.head.appendChild(s);
  }
  function hideNote(){ clearTimeout(noteTimer); if (note) { note.remove(); note = null; } }
  function say(field, html, buttons, ms){
    css(); hideNote();
    note = document.createElement('div'); note.className = 'ac-note'; note.setAttribute('role', 'status');
    note.innerHTML = '<span>' + html + '</span>';
    (buttons || []).forEach(function(b){ var x = document.createElement('button'); x.type = 'button'; x.textContent = b[0];
      x.addEventListener('mousedown', function(e){ e.preventDefault(); }); x.addEventListener('click', function(){ b[1](); }); note.appendChild(x); });
    document.body.appendChild(note);
    var r = field.getBoundingClientRect(), w = note.offsetWidth, h = note.offsetHeight;
    var left = Math.min(Math.max(16, r.right - w - 6), innerWidth - w - 16), top = r.bottom - h - 6;
    if (r.bottom > innerHeight) top = Math.min(innerHeight, r.bottom) - h - 6; // the field runs off the screen: keep it in view
    if (top < r.top + 4) top = r.bottom + 4;
    note.style.left = (left + scrollX) + 'px'; note.style.top = (top + scrollY) + 'px';
    noteTimer = setTimeout(hideNote, ms || 5000);
  }
  var esc = function(s){ return String(s).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  function undo(){
    var c = last; last = null; hideNote(); if (!c) return;
    kept[c.was.toLowerCase()] = 1;
    c.field.focus();
    var before = textBefore(c.field);
    var tail = c.fix + c.end;
    if (before != null && before.slice(-tail.length) === tail) replaceBefore(c.field, tail.length, c.was + c.end);
  }
  function turnOff(field){
    setOn(false); last = null;
    say(field, 'Autocorrect is off on this device. Turn it back on from the Course menu on your dashboard.', [], 6000);
    syncMenu();
  }

  document.addEventListener('input', function(e){
    if (e.inputType !== 'insertText' || e.isComposing || !isOn() || !tutor()) return;
    var field = editable(e.target); if (!field) return;
    if (!ENDS.test(e.data || '')) { last = null; return; }
    var before = textBefore(field); if (before == null) return;
    var m = /(^|[^A-Za-z'’\-@\/._#:\d])([A-Za-z][A-Za-z'’]*)([\s.,;:!?)\]"”’])$/.exec(before);
    if (!m) return;
    var word = m[2].replace(/’/g, "'"), fix = fixFor(word), endCh = m[3];
    if (!fix) { last = null; return; }
    replaceBefore(field, m[2].length + endCh.length, fix + endCh);
    last = { field: field, was: m[2], fix: fix, end: endCh };
    say(field, 'Changed <b>' + esc(m[2]) + '</b> to <b>' + esc(fix) + '</b>.', [['Undo', undo], ['Turn off', function(){ turnOff(field); }]]);
  }, true);

  document.addEventListener('keydown', function(e){
    if (!last) return;
    if (e.key === 'Backspace' && !e.metaKey && !e.ctrlKey && !e.altKey && editable(e.target) === last.field) { e.preventDefault(); undo(); return; }
    if (e.key === 'Escape') { hideNote(); return; }
    if (e.key.length === 1 || e.key === 'Enter') last = null; // they kept typing: the note stays, Backspace is theirs again
  }, true);
  document.addEventListener('mousedown', function(e){ if (note && !note.contains(e.target)) { last = null; } }, true);
  addEventListener('scroll', function(){ if (note) hideNote(); }, { passive: true });

  /* The dashboard's switch: <a id="menuAutocorrect"> in the Course menu. */
  function syncMenu(){
    var a = document.getElementById('menuAutocorrect'); if (!a) return;
    a.hidden = !tutor();
    a.innerHTML = 'Autocorrect <small>' + (isOn() ? 'On. Press to turn it off.' : 'Off. Press to turn it on.') + '</small>';
  }
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('#menuAutocorrect'); if (!a) return;
    e.preventDefault(); setOn(!isOn()); syncMenu();
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', syncMenu); else syncMenu();
  document.addEventListener('hub:ready', syncMenu);

  window.hubAutocorrect = { on: isOn, set: function(v){ setOn(v); syncMenu(); }, fixFor: fixFor };
})();
