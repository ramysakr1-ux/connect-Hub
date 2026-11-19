/* LITE'S OWN AUTOCORRECT, FOR TUTORS (Ramy, 18 Nov 2026: "we should have spelling auto correct for the trainers. an
   intuitive one ... could be turned on and off"). The browser underlines a misspelling but on a laptop it never fixes one,
   so a tutor writing feedback fast leaves "teh" and "recieve" in a document the trainee keeps. This fixes a word the moment
   it ends (a space, a full stop, a comma), the way a phone does:
   - spelling only (Ramy: "no suggestions, auto ... only spelling though"): real misspellings from the list below, fixed
     with no list to choose from. No grammar, no capitals, no style, and never British to American spelling or the other
     way: the tutor's English is theirs.
   - Backspace straight after puts the word back, and that word is left alone on this page from then on.
   - no note when a word changes (Ramy: "distracting").
   - on or off per device, from the Typing pill in the feedback form's bottom bar (localStorage 'hub:autocorrect').
   Tutors only: trainees and students get no correction at all (hub-store.js, 16 Nov 2026). A field marked
   autocorrect="off" is left alone. Loaded by hub-store.js. */
(function(){
  if (window.hubAutocorrect) return;
  var H = window.HubStore;
  var KEY = 'hub:autocorrect';
  /* the dictionary and its guesser come from beside this file, loaded once for a tutor with autocorrect on */
  var SRC = (document.currentScript && document.currentScript.src) || '';
  var HERE = SRC.replace(/[?#].*$/, '').replace(/[^\/]*$/, '');
  /* the helper and the list carry this file's own ?v=, so a browser never pairs this file with an older helper it kept
     (19 Nov 2026: word completion did not show because a kept hub-spell.js from the push before had no completion) */
  var VQ = (SRC.match(/\?v=[^&#]*/) || [''])[0];
  function wantDictionary(){
    if (window.hubSpell) { hubSpell.load(HERE + 'library/words-en.txt' + VQ); return; }
    if (document.getElementById('hubSpellJs')) return;
    var sc = document.createElement('script'); sc.id = 'hubSpellJs'; sc.src = HERE + 'hub-spell.js' + VQ;
    sc.onload = function(){ if (window.hubSpell) hubSpell.load(HERE + 'library/words-en.txt' + VQ); };
    document.head.appendChild(sc);
  }
  var isOn = function(){ try { return localStorage.getItem(KEY) !== 'off'; } catch (e) { return true; } };
  var setOn = function(v){ try { if (v) localStorage.removeItem(KEY); else localStorage.setItem(KEY, 'off'); } catch (e) {} };
  /* LARGER TEXT IN THE WRITING BOXES (Ramy, 19 Nov 2026: "there's no kind of like place anywhere for a font change"). One
     setting per device, beside Autocorrect: the boxes a tutor writes in go from about 14px to about 17px, with more room
     between lines. Nothing else on the page changes size. */
  var TKEY = 'hub:textsize';
  var isBig = function(){ try { return localStorage.getItem(TKEY) === 'large'; } catch (e) { return false; } };
  var setBig = function(v){ try { if (v) localStorage.setItem(TKEY, 'large'); else localStorage.removeItem(TKEY); } catch (e) {} };
  function sizeCss(){
    if (document.getElementById('tsStyle')) return;
    var s = document.createElement('style'); s.id = 'tsStyle';
    s.textContent = 'html.hub-bigtext textarea, html.hub-bigtext input[type=text], html.hub-bigtext input:not([type]), html.hub-bigtext input[type=search], html.hub-bigtext [contenteditable=true], html.hub-bigtext [contenteditable=""]{font-size:1.06rem !important; line-height:1.65 !important;}';
    document.head.appendChild(s);
  }
  function applySize(){ if (!tutor()) return; sizeCss(); document.documentElement.classList.toggle('hub-bigtext', isBig()); }
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
  function fixFor(word, start){
    var low = word.toLowerCase();
    if (kept[low]) return null;
    var f = LIST[low];
    if (f) { var out = /^[A-Z]{2}/.test(f) ? f : caseLike(word, f); return out === word ? null : out; }
    /* Beyond the list, the dictionary (hub-spell.js, 19 Nov 2026): only a word typed all in small letters, so a name,
       a book title or an abbreviation in capitals is never touched. */
    if (word === low && window.hubSpell && hubSpell.ready()) return hubSpell.guess(low);
    /* the first word of a sentence or a line has a capital and is no name for that (19 Nov 2026): fixed too, only on a
       stricter guess, and given its capital back */
    if (start && /^[A-Z][a-z]{2,}$/.test(word) && window.hubSpell && hubSpell.ready()) { var g = hubSpell.guess(low, true); if (g) return g.charAt(0).toUpperCase() + g.slice(1); }
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
    /* Enter ends a word too (19 Nov 2026: the last word of every line went unchecked, and feedback is written a point a line) */
    var nl = e.inputType === 'insertLineBreak' || e.inputType === 'insertParagraph';
    if ((e.inputType !== 'insertText' && !nl) || e.isComposing || !isOn() || !tutor()) return;
    var field = editable(e.target); if (!field) return;
    if (!nl && !ENDS.test(e.data || '')) { last = null; return; }
    var before = textBefore(field); if (before == null) return;
    var m = /(^|[^A-Za-z'’\-@\/._#:\d])([A-Za-z][A-Za-z'’]*)([\s.,;:!?)\]"”’])$/.exec(before);
    if (!m) return;
    var lead = before.slice(0, before.length - m[2].length - m[3].length);
    var start = /(^|[.!?]\s+|\n\s*|[•\-*–]\s+)$/.test(lead) && (lead.length < 40 - m[2].length - m[3].length - 1 || /[.!?\n•\-*–]\s*$/.test(lead));
    var word = m[2].replace(/’/g, "'"), fix = fixFor(word, start), endCh = m[3];
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

  /* WORD COMPLETION (Ramy, 19 Nov 2026: "predict the word and the text ... like Google"). While a tutor types a word of three
     letters or more in a writing box, the rest of the likeliest word shows after the cursor in light grey; Tab takes it,
     anything else carries on as normal. The likeliest word is one of the tutor's own first (the words they have typed
     most on this device, learnt as they write, kept in this browser only), then the commonest English word. On with
     Autocorrect, off with it. Not on a phone or tablet: their keyboards already suggest words. Text boxes only. */
  var MINE_KEY = 'hub:mywords', PAIR_KEY = 'hub:mypairs', mine = null, pairs = null;
  function myWords(){ if (mine) return mine; try { mine = JSON.parse(localStorage.getItem(MINE_KEY) || '{}') || {}; } catch (e) { mine = {}; } return mine; }
  function myPairs(){ if (pairs) return pairs; try { pairs = JSON.parse(localStorage.getItem(PAIR_KEY) || '{}') || {}; } catch (e) { pairs = {}; } return pairs; }
  function trim(m, max){ var keys = Object.keys(m); if (keys.length <= max) return m; keys.sort(function(a, b){ return m[b] - m[a]; }); var k = {}; keys.slice(0, Math.round(max * 0.75)).forEach(function(x){ k[x] = m[x]; }); return k; }
  var saveT = null;
  /* a word just finished, and the word before it: both remembered on this device (two-word phrases, 19 Nov 2026) */
  function learn(w, prev){
    if (!w || !/^[a-z]+$/.test(w) || !(window.hubSpell && hubSpell.isWord(w))) return;
    var m = myWords(), p = myPairs();
    if (w.length >= 5) m[w] = (m[w] || 0) + 1;
    if (prev && w.length >= 4 && /^[a-z']+$/.test(prev)) { var k = prev.replace(/'/g, '') + ' ' + w; p[k] = (p[k] || 0) + 1; }
    clearTimeout(saveT); saveT = setTimeout(function(){
      mine = trim(m, 800); pairs = trim(p, 1500);
      try { localStorage.setItem(MINE_KEY, JSON.stringify(mine)); localStorage.setItem(PAIR_KEY, JSON.stringify(pairs)); } catch (e) {}
    }, 1500);
  }
  /* THE TUTORS' PHRASES FROM PAST COURSES (19 Nov 2026: "it should be able to learn from different feedback in different
     courses"). The store keeps counts of the words and two-word phrases in tutors' returned feedback (op tutorPhrases,
     tutor links only); they are fetched once a session, kept in this browser and refreshed when two hours old, and added to what this device has learnt. */
  var shared = null, SH_KEY = 'hub:tutorphrases';
  function sharedPhrases(){
    if (shared) return shared;
    /* the copy this browser kept is used at once; one older than two hours is fetched again behind it, so a list
       rebuilt during a course reaches a tutor the same day (it used to wait a full day) */
    var kept = null;
    try { var c = JSON.parse(localStorage.getItem(SH_KEY) || 'null'); if (c && c.data) kept = c; } catch (e) {}
    shared = kept ? kept.data : { words: {}, pairs: {} };
    if (kept && Date.now() - kept.at < 72e5) return shared;
    try { if (H && H.call) H.call({ op: 'tutorPhrases' }).then(function(r){ var d = r && (r.data || (r.result && r.result.data)); if (d && (d.words || d.pairs)) { shared = d; merged = null; try { localStorage.setItem(SH_KEY, JSON.stringify({ at: Date.now(), data: d })); } catch (e) {} } }, function(){}); } catch (e) {}
    return shared;
  }
  var merged = null, mergedAt = 0;
  function both(){
    if (merged && Date.now() - mergedAt < 5000) return merged;
    var sh = sharedPhrases(), w = {}, p = {}, k;
    for (k in sh.words || {}) w[k] = sh.words[k]; for (k in sh.pairs || {}) p[k] = sh.pairs[k];
    var mw = myWords(), mp = myPairs();
    for (k in mw) w[k] = (w[k] || 0) + mw[k]; for (k in mp) p[k] = (p[k] || 0) + mp[k] * 2;   // this tutor's own use counts double
    merged = { words: w, pairs: p }; mergedAt = Date.now(); return merged;
  }
  function bestFor(prefix, prev){
    return window.hubSpell && typeof hubSpell.complete === 'function' ? hubSpell.complete(prefix, prev, both()) : null;
  }
  /* completion has its own switch (19 Nov 2026), on unless turned off, and only while Autocorrect is on */
  var CKEY = 'hub:complete';
  var completeOn = function(){ try { return localStorage.getItem(CKEY) !== 'off'; } catch (e) { return true; } };
  var setComplete = function(v){ try { if (v) localStorage.removeItem(CKEY); else localStorage.setItem(CKEY, 'off'); } catch (e) {} };
  var touch = (function(){ try { return matchMedia('(pointer: coarse)').matches && !matchMedia('(pointer: fine)').matches; } catch (e) { return false; } })();
  var ghost = null, sugg = null;   // the grey ending on screen, and what Tab would add
  /* The grey ending is drawn by a see-through copy of the box laid exactly over it: the same size, padding, font and
     wrapping, the text up to the cursor invisible and the rest of the word in grey after it, so it sits on the line. */
  function ghostEl(){
    if (ghost) return ghost;
    ghost = document.createElement('div'); ghost.id = 'acGhost'; ghost.setAttribute('aria-hidden', 'true');
    ghost.style.cssText = 'position:absolute; z-index:2147483000; pointer-events:none; overflow:hidden; display:none; background:transparent; border-color:transparent !important; box-shadow:none;';
    document.body.appendChild(ghost);
    return ghost;
  }
  function hideGhost(){ sugg = null; if (ghost) ghost.style.display = 'none'; }
  var COPY = ['boxSizing','paddingTop','paddingRight','paddingBottom','paddingLeft','borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth','borderStyle',
              'fontFamily','fontSize','fontWeight','fontStyle','letterSpacing','lineHeight','textTransform','wordSpacing','textIndent','tabSize','textAlign'];
  function showGhost(f){
    hideGhost();
    if (touch || !isOn() || !completeOn() || !tutor() || !(window.hubSpell && hubSpell.ready())) return;
    if (!(f.tagName === 'TEXTAREA' || f.tagName === 'INPUT') || f.selectionStart !== f.selectionEnd) return;
    var v = f.value, at = f.selectionStart;
    if (/[A-Za-z'’]/.test(v.charAt(at))) return;                       // only at the end of a word
    var m = /(^|[^A-Za-z'’\-@\/._#:\d])([A-Za-z]{3,})$/.exec(v.slice(Math.max(0, at - 30), at)); if (!m) return;
    var typed = m[2], low = typed.toLowerCase();
    if (typed !== low && !/^[A-Z][a-z]+$/.test(typed)) return;          // all capitals: an abbreviation, left alone
    var pm = /([A-Za-z'’]+)[^A-Za-z'’\n]*$/.exec(v.slice(Math.max(0, at - typed.length - 40), at - typed.length));
    var prevW = pm && !/[.!?\n]/.test(v.slice(at - typed.length - (pm ? pm[0].length - pm[1].length : 0), at - typed.length)) ? pm[1].toLowerCase().replace(/’/g, "'") : '';
    var w = bestFor(low, prevW); if (!w) return;
    var rest = w.slice(low.length);
    var cs = getComputedStyle(f), r = f.getBoundingClientRect(), g = ghostEl();
    COPY.forEach(function(k){ g.style[k] = cs[k]; });
    g.style.whiteSpace = f.tagName === 'TEXTAREA' ? 'pre-wrap' : 'pre'; g.style.overflowWrap = 'break-word';
    g.style.left = (r.left + scrollX) + 'px'; g.style.top = (r.top + scrollY) + 'px'; g.style.width = r.width + 'px'; g.style.height = r.height + 'px';
    g.textContent = '';
    var a = document.createElement('span'); a.style.color = 'transparent'; a.textContent = v.slice(0, at);
    var b = document.createElement('span'); b.style.color = 'rgba(60,60,70,.45)'; b.textContent = rest;
    g.appendChild(a); g.appendChild(b); g.style.display = 'block';
    g.scrollTop = f.scrollTop; g.scrollLeft = f.scrollLeft;
    var br = b.getBoundingClientRect(); if (br.bottom > r.bottom + 1 || br.top < r.top - 1) { hideGhost(); return; }
    sugg = { field: f, rest: rest, at: at };
  }
  document.addEventListener('input', function(e){
    var f = editable(e.target); if (!f) { hideGhost(); return; }
    if (e.inputType === 'insertText' && ENDS.test(e.data || '')) {     // a word just ended: remember it as one of theirs
      var before = (f.value || '').slice(0, f.selectionStart - 1), mm = /(?:([A-Za-z'’]+)[ ,;:]+)?([a-z]{4,})$/.exec(before); if (mm) learn(mm[2], mm[1] ? mm[1].toLowerCase().replace(/’/g, "'") : '');
    }
    if (e.inputType === 'insertText' || e.inputType === 'deleteContentBackward') showGhost(f); else hideGhost();
  });
  document.addEventListener('keydown', function(e){
    if (!sugg) return;
    if (e.key === 'Tab' && !e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey && editable(e.target) === sugg.field && sugg.field.selectionStart === sugg.at) {
      e.preventDefault(); var s = sugg; hideGhost(); last = null;
      if (!document.execCommand('insertText', false, s.rest)) { s.field.setRangeText(s.rest, s.at, s.at, 'end'); s.field.dispatchEvent(new Event('input', { bubbles: true })); }
      return;
    }
    if (e.key !== 'Shift') hideGhost();
  }, true);
  ['mousedown', 'scroll', 'resize'].forEach(function(ev){ addEventListener(ev, hideGhost, true); });
  document.addEventListener('focusout', hideGhost, true);

  /* THE SWITCHES, BEHIND ONE PILL (19 Nov 2026). There was one pill, Autocorrect (Ramy, 18 Nov: "a general on and off
     pill"); Larger text and Word completion each added one, and three more lines in the dashboard's Course menu. Ramy:
     "The Course drop-down menu is getting longer and longer ... we don't need to have them there", and on a 1280px
     laptop the three pills pushed the feedback form's bottom bar onto a second row. Now one pill, Typing, in the bar
     (on a phone, under the form's opening lines); pressing it shows the three switches. Nothing is in the Course menu.
     One setting each for every page on this device. No note when a word changes ("distracting"). */
  function pillCss(){
    if (document.getElementById('acStyle')) return;
    var s = document.createElement('style'); s.id = 'acStyle';
    s.textContent = '.ac-pill{display:inline-flex; align-items:center; gap:7px; white-space:nowrap; background:var(--field); color:var(--teal); border:2px solid var(--teal); padding:9px 14px; border-radius:20px; font:700 0.86rem Karla,sans-serif; cursor:pointer;}' +
      '.ac-pill:hover{background:var(--sand-deep);}' +
      '.ac-row{display:flex; justify-content:center; margin:4px 0 12px;}' +
      '#typePop{position:fixed; z-index:1500; width:min(320px, calc(100vw - 24px)); background:var(--paper); border:1px solid var(--sand-line); border-radius:14px; box-shadow:0 10px 30px rgba(20,20,30,.18); padding:6px;}' +
      '#typePop[hidden]{display:none;}' +
      '#typePop button{display:flex; align-items:center; justify-content:space-between; gap:14px; width:100%; min-height:44px; padding:9px 12px; border:0; border-radius:9px; background:none; font:700 0.9rem Karla,sans-serif; color:var(--ink); text-align:left; cursor:pointer;}' +
      '#typePop button:hover{background:var(--sand);}' +
      '#typePop button[hidden]{display:none;}' +
      '#typePop small{display:block; font-weight:400; font-size:0.78rem; line-height:1.35; color:var(--grey); margin-top:1px;}' +
      '#typePop .sw{width:30px; height:16px; border-radius:9px; background:var(--teal); position:relative; flex:none; transition:background .15s;}' +
      '#typePop .sw::after{content:""; position:absolute; top:2px; left:16px; width:12px; height:12px; border-radius:50%; background:var(--paper); transition:left .15s;}' +
      '#typePop button.off .sw{background:var(--sand-line);} #typePop button.off .sw::after{left:2px;}' +
      '@media print{ #typePop, .ac-pill, .ac-row{display:none !important;} }';
    document.head.appendChild(s);
  }
  function placePill(){
    if (!tutor() || document.getElementById('typePill')) return;
    var slot = document.querySelector('.actionbar .rhs'); if (!slot) return;
    pillCss();
    var b = document.createElement('button'); b.type = 'button'; b.id = 'typePill'; b.className = 'ac-pill'; b.textContent = 'Typing';
    b.setAttribute('aria-haspopup', 'true'); b.setAttribute('aria-expanded', 'false'); b.title = 'Autocorrect, word completion and larger text, on this device';
    /* A phone's bottom bar is full (Return, Dictate, Print): there the pill sits under the form's opening lines instead. */
    var head = document.querySelector('.header .sub');
    if (innerWidth < 560 && head) { var row = document.createElement('div'); row.className = 'ac-row'; row.appendChild(b); head.parentNode.insertBefore(row, head.nextSibling); }
    else { var before = slot.querySelector('.dictbar') || document.getElementById('pdfBtn');
      if (before && before.parentNode === slot) slot.insertBefore(b, before); else slot.appendChild(b); }
    var pop = document.createElement('div'); pop.id = 'typePop'; pop.hidden = true; pop.setAttribute('role', 'group'); pop.setAttribute('aria-label', 'Typing, on this device');
    pop.innerHTML = '<button type="button" id="acPill"></button><button type="button" id="wcPill"></button><button type="button" id="tsPill"></button>';
    document.body.appendChild(pop);
    syncMenu();
  }
  function popClose(){ var pop = document.getElementById('typePop'), b = document.getElementById('typePill'); if (pop) pop.hidden = true; if (b) b.setAttribute('aria-expanded', 'false'); }
  function popOpen(){
    var pop = document.getElementById('typePop'), b = document.getElementById('typePill'); if (!pop || !b) return;
    pop.hidden = false; b.setAttribute('aria-expanded', 'true');
    var r = b.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight;
    pop.style.left = Math.max(12, Math.min(r.left, innerWidth - w - 12)) + 'px';
    /* above the pill when the pill is in the bottom bar, below it when it sits under the heading */
    pop.style.top = (r.top > innerHeight / 2 ? Math.max(12, r.top - h - 8) : Math.min(innerHeight - h - 12, r.bottom + 8)) + 'px';
  }
  function syncMenu(){
    var on = isOn(), cOn = completeOn(), big = isBig();
    var row = function(id, isOnNow, name, what){ var el = document.getElementById(id); if (!el) return null;
      el.classList.toggle('off', !isOnNow); el.setAttribute('aria-pressed', isOnNow ? 'true' : 'false');
      el.innerHTML = '<span>' + name + '<small>' + what + '</small></span><span class="sw" aria-hidden="true"></span>'; return el; };
    row('acPill', on, 'Autocorrect', 'Fixes a misspelled word as you finish it');
    var c = row('wcPill', on && cOn, 'Word completion', on ? 'The rest of a word in grey. Tab takes it' : 'Works when Autocorrect is on');
    if (c) c.hidden = touch;                                     // a phone's own keyboard suggests words
    row('tsPill', big, 'Larger text', 'In the boxes you write in');
  }
  document.addEventListener('click', function(e){
    var t = e.target.closest ? e.target : null; if (!t) return;
    if (t.closest('#typePill')) { e.preventDefault(); var pop = document.getElementById('typePop'); if (pop && pop.hidden) popOpen(); else popClose(); return; }
    if (t.closest('#wcPill')) { e.preventDefault(); if (isOn()) { setComplete(!completeOn()); hideGhost(); syncMenu(); } return; }
    if (t.closest('#tsPill')) { e.preventDefault(); setBig(!isBig()); applySize(); syncMenu(); return; }
    if (t.closest('#acPill')) { e.preventDefault(); setOn(!isOn()); last = null; hideGhost(); syncMenu(); if (isOn()) wantDictionary(); return; }
    if (!t.closest('#typePop')) popClose();
  });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') popClose(); });
  addEventListener('resize', popClose);
  addEventListener('storage', function(e){ if (e.key === KEY || e.key === TKEY || e.key === CKEY) { applySize(); syncMenu(); } });
  var boot = function(){ applySize(); placePill(); syncMenu(); if (tutor() && isOn()) wantDictionary(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  document.addEventListener('hub:ready', boot);
  setTimeout(boot, 1500);

  window.hubAutocorrect = { on: isOn, set: function(v){ setOn(v); syncMenu(); }, fixFor: fixFor };
})();
