/* LITE'S OWN AUTOCORRECT, FOR TUTORS (Ramy, 18 Nov 2026: "we should have spelling auto correct for the trainers. an
   intuitive one ... could be turned on and off"). The browser underlines a misspelling but on a laptop it never fixes one,
   so a tutor writing feedback fast leaves "teh" and "recieve" in a document the trainee keeps. This fixes a word the moment
   it ends (a space, a full stop, a comma), the way a phone does:
   - spelling only (Ramy: "no suggestions, auto ... only spelling though"): real misspellings from the list below, fixed
     with no list to choose from. No grammar, no capitals, no style, and never British to American spelling or the other
     way: the tutor's English is theirs.
   - Backspace straight after puts the word back, and that word is left alone on this page from then on.
   - no note when a word changes (Ramy: "distracting").
   - on or off per device, from the pill in the page's bottom bar or the dashboard's Course menu (localStorage 'hub:autocorrect').
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

  function undo(){
    var c = last; last = null; if (!c) return;
    kept[c.was.toLowerCase()] = 1;
    c.field.focus();
    var before = textBefore(c.field);
    var tail = c.fix + c.end;
    if (before != null && before.slice(-tail.length) === tail) replaceBefore(c.field, tail.length, c.was + c.end);
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
  }, true);

  document.addEventListener('keydown', function(e){
    if (!last) return;
    if (e.key === 'Backspace' && !e.metaKey && !e.ctrlKey && !e.altKey && editable(e.target) === last.field) { e.preventDefault(); undo(); return; }
    if (e.key.length === 1 || e.key === 'Enter') last = null; // they kept typing: Backspace is theirs again
  }, true);
  document.addEventListener('mousedown', function(){ last = null; }, true);

  /* THE SWITCH (Ramy, 18 Nov 2026: "we can do without the comments at the bottom. It's distracting. Let's just have like a
     general on and off pill"). No note when a word changes. One setting for every page on this device, shown as a pill in
     the page's bottom bar (the feedback form, beside Dictate; on a phone, under the form's opening lines) and as a line in the dashboard's Course menu. */
  function pillCss(){
    if (document.getElementById('acStyle')) return;
    var s = document.createElement('style'); s.id = 'acStyle';
    s.textContent = '.ac-pill{display:inline-flex; align-items:center; gap:7px; white-space:nowrap; background:var(--field,#fbf7ee); color:var(--teal,#1e6b63); border:2px solid var(--teal,#1e6b63); padding:9px 14px; border-radius:20px; font:700 0.86rem Karla,sans-serif; cursor:pointer;}' +
      '.ac-pill .sw{width:26px; height:14px; border-radius:8px; background:var(--teal,#1e6b63); position:relative; flex:none; transition:background .15s;}' +
      '.ac-pill .sw::after{content:""; position:absolute; top:2px; left:14px; width:10px; height:10px; border-radius:50%; background:var(--paper,#fffdf8); transition:left .15s;}' +
      '.ac-pill.off{color:var(--grey,#6b6458); border-color:var(--sand-line,#d9cdb5);} .ac-pill.off .sw{background:var(--sand-line,#d9cdb5);} .ac-pill.off .sw::after{left:2px;}' +
      '.ac-pill:hover{background:var(--sand-deep,#f1e8d6);}' +
      '.ac-row{display:flex; justify-content:center; margin:4px 0 12px;}';
    document.head.appendChild(s);
  }
  function placePill(){
    if (!tutor() || document.getElementById('acPill')) return;
    var slot = document.querySelector('.actionbar .rhs'); if (!slot) return;
    pillCss();
    var b = document.createElement('button'); b.type = 'button'; b.id = 'acPill'; b.className = 'ac-pill';
    /* A phone's bottom bar is full (Return, Dictate, Print): there the pill sits under the form's opening lines instead. */
    var head = document.querySelector('.header .sub');
    if (innerWidth < 560 && head) { var row = document.createElement('div'); row.className = 'ac-row'; row.appendChild(b); head.parentNode.insertBefore(row, head.nextSibling); }
    else { var before = slot.querySelector('.dictbar') || document.getElementById('pdfBtn');
      if (before && before.parentNode === slot) slot.insertBefore(b, before); else slot.appendChild(b); }
    syncMenu();
  }
  function syncMenu(){
    var on = isOn();
    var a = document.getElementById('menuAutocorrect');
    if (a) { a.hidden = !tutor(); a.innerHTML = 'Autocorrect <small>' + (on ? 'On. Press to turn it off.' : 'Off. Press to turn it on.') + '</small>'; }
    var b = document.getElementById('acPill');
    if (b) { b.classList.toggle('off', !on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.title = on ? 'Autocorrect fixes misspelled words as you type. Press to turn it off.' : 'Autocorrect is off. Press to turn it on.';
      b.innerHTML = '<span class="sw" aria-hidden="true"></span><span>Autocorrect ' + (on ? 'on' : 'off') + '</span>'; }
  }
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('#menuAutocorrect, #acPill'); if (!a) return;
    e.preventDefault(); setOn(!isOn()); last = null; syncMenu();
  });
  addEventListener('storage', function(e){ if (e.key === KEY) syncMenu(); });
  var boot = function(){ placePill(); syncMenu(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  document.addEventListener('hub:ready', boot);
  setTimeout(boot, 1500);

  window.hubAutocorrect = { on: isOn, set: function(v){ setOn(v); syncMenu(); }, fixFor: fixFor };
})();
