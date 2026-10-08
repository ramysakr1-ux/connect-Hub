/* The highest teaching-practice NUMBER any screen will accept. Handbook 9.1.2
   says candidates "should teach on a minimum of eight occasions" -- a minimum,
   and a "should", and no maximum anywhere. The cap sat at 8, which made the
   Handbook's OWN worked example unenterable: 10.2 reasons about "a course
   [that] consists of nine 40-minute TP lessons" (audit, 29 Sep 2026). Twelve
   covers that and the shortest sensible lessons inside six hours; the
   planning grid already allowed twelve. This is a bound on numbering, not a
   requirement -- the eight is a note beside the field on Course admin, in
   Cambridge's own words. */
window.HUB_MAX_TP = 12;

/* WHICH observation sheets a trainee turns in, and what Cambridge asks of
   the set. Four screens each held the literal list
   ['filmed1'..'filmed4','live1','live2'], so a centre that imported a
   different split -- three filmed and three live, which is what 10.1 actually
   allows -- broke them: live3 never counted and filmed4 was demanded forever,
   so the home page asked for a sheet that did not exist (audit, 29 Sep 2026).
   The set now comes from the course's own wording, falling back to the
   shipped sheets.

   11.2 lists six hours of observation among what trainees "are required
   to" do to meet the course requirements. 10.1, in its own verbs: trainees are given six hours' directed
   observation; "All six hours CAN be live observation, but a centre MAY
   choose to provide up to three hours of filmed lessons", and "three hours of
   live online or face-to-face observation MUST be provided by the centre".
   So: at most three filmed hours, at least three live hours, six in total --
   and the count that matters is HOURS, not sheets. Lite counted sheets and
   reported "All six turned in", which reads as the six-hour requirement
   discharged when six sheets could total two hours. */
window.hubObservationSet = function(){
  var w = null;
  try { w = JSON.parse(localStorage.getItem('connect_observation_wording_v1')); } catch (e) {}
  var src = (w && (w.filmed || w.live)) ? w : (window.CONNECT_HUB_OBSERVATION_DEFAULTS || {});
  var ids = function(g){ return ((src && src[g]) || []).map(function(t){ return t && t.id; }).filter(Boolean); };
  var filmed = ids('filmed'), live = ids('live');
  return { filmed: filmed, live: live, all: filmed.concat(live) };
};
/* Minutes turned in, per group, from the sheets' own Length header. */
window.hubObservationHours = function(records){
  var set = window.hubObservationSet(), w = records || {};
  /* A sheet that declares its own length counts at that length when the
     trainee has not written one over it -- the two live sheets are 90
     minutes each. */
  var declared = {};
  (function(){
    var d = null;
    try { d = JSON.parse(localStorage.getItem('connect_observation_wording_v1')); } catch (e) {}
    var from = (d && (d.filmed || d.live)) ? d : (window.CONNECT_HUB_OBSERVATION_DEFAULTS || {});
    ['filmed', 'live'].forEach(function(g){ ((from && from[g]) || []).forEach(function(t){ if (t && t.id && t.minutes) declared[t.id] = t.minutes; }); });
  })();
  var mins = function(list){ var t = 0, n = 0;
    list.forEach(function(k){ var r = w[k]; if (!r || !r.turnedInAt) return; n++;
      var m = parseInt(String(((r.a || {}).hLength) || '').replace(/[^0-9]/g, ''), 10);
      if (!(m > 0)) m = declared[k] || 0;
      if (m > 0) t += m; });
    return { minutes: t, turnedIn: n }; };
  var f = mins(set.filmed), l = mins(set.live);
  var total = f.minutes + l.minutes;
  var notes = [];
  /* The live check used to need some live minutes before it would speak, so a
     course with NO live observation said nothing at all -- the one case that
     most needs saying. It now waits for the sheets to be in, then answers. */
  var complete = (f.turnedIn + l.turnedIn) >= set.all.length && set.all.length > 0;
  if (f.minutes > 180) notes.push('over three hours of filmed observation \u2014 10.1 lets a centre provide up to three');
  if (complete && l.minutes < 180) notes.push('under three hours of live observation \u2014 10.1: three hours of live online or face-to-face observation must be provided');
  if (complete && total < 360) notes.push('under six hours in total \u2014 11.2: trainees are required to observe experienced teachers for a total of six hours');
  return { filmed: f, live: l, totalMinutes: total, turnedIn: f.turnedIn + l.turnedIn, of: set.all.length, notes: notes };
};

// Shared by every screen: the styled confirm (screen 1 had its own since the
// 22 Aug 2026 three-fixes spec; screens 2, 3, 4, 8 and the home page still
// called the browser's confirm(), which shows the page origin in its chrome
// and, in an embedded browser, can be dismissed before anyone sees it --
// "Start next TP" on screen 4 did nothing in review, Hub walk 20 Sep 2026),
// and one date formatter, so a plan dated 2026-09-24 prints as
// 24 September 2026 in the assembled documents.
(function(){
  if(!document.getElementById('hub-shared-css')){
    var css=document.createElement('style'); css.id='hub-shared-css';
    css.textContent=".confirm-overlay{position:fixed; inset:0; background:rgba(35,25,15,0.4); display:flex; align-items:center; justify-content:center; z-index:1000; padding:20px; animation:hubFadeIn 180ms ease-out;}"+
      "@keyframes hubFadeIn{from{opacity:0} to{opacity:1}} @media (prefers-reduced-motion: reduce){.confirm-overlay{animation:none}}"+
      ".confirm-modal{background:var(--paper,#fdfcf9); border-radius:6px; border-top:3px solid var(--brick,#8c2f1f); padding:22px 24px; max-width:400px; width:100%; box-shadow:0 8px 30px rgba(0,0,0,0.18);}"+
      ".confirm-message{margin:0 0 18px; font-size:0.92rem; color:var(--ink,#2b2620); line-height:1.55;}"+
      ".confirm-actions{display:flex; justify-content:flex-end; gap:10px;}"+
      ".confirm-actions button{font-family:'Karla',sans-serif; font-size:0.85rem; font-weight:600; padding:9px 18px; border-radius:20px; border:1.5px solid var(--sand-line,#e2d9c8); cursor:pointer;}"+
      // The cancel button is a control, so it takes the control fill (--box) like
// every other button in Lite; the literal is the same warm tone, for a page
// that has not declared the token.
      ".confirm-cancel{background:var(--box,#faf1e4); color:var(--ink,#2b2620);}"+
      ".confirm-cancel:hover{background:var(--sand-deep,#f3efe6);}"+
      ".confirm-type{display:block; margin:0 0 16px;}"+
      ".confirm-type span{display:block; font-family:'Karla',sans-serif; font-size:0.78rem; font-weight:600; color:var(--grey,#6d655c); margin-bottom:6px;}"+
      ".confirm-type input{width:100%; box-sizing:border-box; font-family:'Karla',sans-serif; font-size:0.92rem; padding:9px 11px; border:1.5px solid var(--sand-line,#e2d9c8); border-radius:6px; background:var(--box,#faf1e4); color:var(--ink,#2b2620);}"+
      ".confirm-type input:focus{outline:none; border-color:var(--teal,#0f4a4b);}"+
      ".confirm-action[disabled]{opacity:.45; cursor:not-allowed;}"+
      ".confirm-action{background:var(--brick,#8c2f1f); color:var(--paper,#fdfcf9); border-color:var(--brick,#8c2f1f);}"+
      ".confirm-action:hover{background:oklch(40% 0.15 27);}";
    document.head.appendChild(css);
  }
  // One hover rule for every clickable card, one for every pill and button
  // (Ramy, 20 Sep 2026: "one rule for all the cards, one rule for all the
  // pills"), on every screen. Chosen states keep their own colour; disabled
  // things do nothing.
  //
  // The ring and wash carry NO HUE (Ramy, 23 Sep 2026: "that green hover on
  // the pills is a bit too much... a softer green or a different colour
  // altogether", then option D of four). They used to be teal in three
  // places at once -- ring, wash and border -- which put a green halo on
  // every control whatever colour the control itself was, and once the
  // structural colour went gold that meant a green ring around a gold fill.
  // Hue-free, hover says "your mouse is on something" and nothing else, so
  // gold still means "the action here" and teal "the decision".
  //
  // A control with a fill of its own is left out of the wash, or the wash
  // replaces the fill -- which is what happened to .btn-gold and .btn-add
  // the moment they existed. Any new filled class has to be added here too.
  if(!document.getElementById('hub-hover-css')){
    var hcss=document.createElement('style'); hcss.id='hub-hover-css';
    // Ramy, 20 Sep 2026: the credit is a watermark like Connect's -- in the header band beside the mark, on the landing screens only, never a door.
    hcss.textContent=":root{ --hub-ring: 0 0 0 2px oklch(86% 0.014 82); --hub-wash: oklch(96% 0.009 82); --bronze: oklch(50% 0.09 62); }"+
      ".hub-credit{ font-family:'Karla',sans-serif; font-size:11px; letter-spacing:0.01em; color:var(--bronze); opacity:.8; white-space:nowrap; margin-left:12px; align-self:center; }"+
      ".hub-credit b{ font-weight:700; }"+
      "@media (max-width:768px){ .hub-credit{ display:none; } }"+
      "a.card, a.room, .tk-card[href], .cell, .list-row > button:first-child{ transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease; }"+
      "a.card:hover, a.room:hover, .cell:hover{ transform: translateY(-1px); box-shadow: var(--hub-ring); }"+
      ".cell:hover .chip{ box-shadow: none; }"+
      "button:not(:disabled), .btn, a.act, .chip[data-role], .pchip, .crit-toggle, .picker button, .filter, .tab, .sg, .rb, .copyfirst, .rowbtn, .export-return, .order-arrows button{ transition: box-shadow .12s ease, background-color .12s ease, border-color .12s ease; }"+
      "button:not(:disabled):not(.tab):not(.filter):not(.sg):not(.say-pill):hover, .btn:not(:disabled):hover, a.act:hover, .chip[data-role]:not(.disabled):hover, .pchip:hover, .crit-toggle:hover, .picker button:hover, .rb:hover, .copyfirst:hover, .rowbtn:hover{ box-shadow: var(--hub-ring); }"+
      /* .btn is excluded too. On a course page .btn is already a FILLED teal
         button (hub-house: .hub-course .btn) with its own lift, but it carries
         none of the class names listed above -- so this rule out-specified the
         lift and washed the fill out to near-white while the label stayed
         paper-coloured. Ramy, 4 Oct 2026, on the Apply button: "it completely
         disappears when you hover over it." */
      /* ...and the say-something pill, a filled plum button with a hover of
         its own (hub-say.js). Ramy, 6 Oct 2026, on the tutor's dashboard: "it
         just goes completely washed." This rule was turning the plum to the
         wash with the label still paper. */
      "button:not(:disabled):not(.primary):not(.btn):not(.btn-teal):not(.btn-gold):not(.btn-add):not(.btn-submit):not(.active):not(.on):not(.picked):not(.confirm-action):not(.act):not(.tab):not(.filter):not(.sg):not(.say-pill):hover{ background-color: var(--hub-wash); }"+
      "@media (prefers-reduced-motion: reduce){ a.card, a.room, .cell, button, .btn{ transition: none; } a.card:hover, a.room:hover, .cell:hover{ transform: none; } }";
    document.head.appendChild(hcss);
  }
  /* Nothing pinned to the screen belongs on paper. The sync pill and the
     dictation bar are both position:fixed and both were printing into the
     corner of every document the TP loop produces -- the lesson plan, the
     self-evaluation, the teaching practice record and the assignment record,
     which are exactly the pages that go into the trainee's portfolio and in
     front of the assessor. Only screens 12 and 13 had thought to hide the pill
     (print sweep, 21 Sep 2026). Done once here so a new screen cannot forget. */
  if(!document.getElementById('hub-print-css')){
    var pcss=document.createElement('style'); pcss.id='hub-print-css';
    pcss.textContent='@media print{#hubSync,.dictbar,.ipa-bar,.credit-pill{display:none !important;}}';
    document.head.appendChild(pcss);
  }
  if(!document.getElementById('hub-steps-css')){
    var scss=document.createElement('style'); scss.id='hub-steps-css';
    scss.textContent=".hub-steps{list-style:none; margin:14px auto 0; padding:0; display:flex; flex-wrap:wrap; justify-content:center; gap:6px 14px; max-width:760px;}"+
      ".hub-steps li{font-family:'Karla',sans-serif; font-size:0.8rem; color:var(--grey,#6b6259); display:flex; align-items:center; gap:6px;}"+
      ".hub-steps li b{font-family:'Karla',sans-serif; font-weight:700; font-size:0.7rem; width:18px; height:18px; border-radius:50%; background:var(--teal,#1E6B63); color:#fff; display:inline-flex; align-items:center; justify-content:center; flex:none;}";
    document.head.appendChild(scss);
  }
  // Connect's auto-bullets (src/lib/bullet-list.ts): an empty field seeds its
  // first bullet on focus, Enter starts the next, Backspace on an empty bullet
  // removes it. Applied to list-type fields only, never to prose.
  /* The online rooms strip (Zoom, Meet, Teams) -- Course admin -> Settings
     -> Online rooms. Returns '' when the course has none, so a page can drop
     it into a container and hide nothing by hand. */
  /* Ramy, 28 Sep 2026: "they should be able to access all rooms and choose
     theirs." Everyone sees every room. A room's optional "For" group never
     hides it: on a trainee's home (opts.group = their group) their group's
     rooms come first and say "your group"; on the tutor and assessor screens
     (opts.all) every button shows its group. Lite does not know which tutor
     is which -- one tutor key -- so tutors pick theirs like everyone else. */
  /* A thing that is leaving fades over 160 ms and goes when the fade has
     ENDED -- not on a timer that could fire mid-fade. The fade starts on the
     next frame so the transition is registered before the opacity moves
     (1 Oct 2026: a timer-based fade was removed at opacity 0.74 and the frame
     scan of the film still saw a cut). */
  window.hubFadeAway=function(el, after){
    if(!el){ if(after) after(); return; }
    var gone=false; function go(){ if(gone) return; gone=true; try{ el.remove(); }catch(e){} if(after) after(); }
    el.style.transition='opacity 160ms ease-in';
    el.addEventListener('transitionend', go, { once:true });
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ el.style.opacity='0'; }); });
    setTimeout(go, 420);
  };
  window.hubOnlineRoomsHTML=function(settings, opts){
    opts=opts||{};
    var rooms=(settings&&Array.isArray(settings.onlineRooms)?settings.onlineRooms:[]).filter(function(r){ return r&&r.url&&/^https?:\/\//i.test(r.url); });
    /* Ramy, 28 Sep 2026: the assessor "should only see the rooms assigned to
       them by the MCT -- too confusing otherwise." opts.assessor keeps the
       ticked rooms only; none ticked, no strip. */
    if(opts.assessor) rooms=rooms.filter(function(r){ return !!r.assessor; });
    if(!rooms.length) return '';
    var mine=String(opts.group||'');
    if(mine) rooms=rooms.slice().sort(function(a,b){ return (String(b.group||'')===mine)-(String(a.group||'')===mine); });
    var e=function(v){ return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); };
    /* An assessor is not choosing between rooms -- the centre has ticked the
       one they are joining -- so the button does not need the centre's own
       label for it. Ramy, 1 Oct 2026: "the assessor link, the online room,
       should not read teaching practice, it should just say join here." It
       says Join the room -- generic on purpose, because the same room holds
       the lesson, the feedback, the tutorial and the grading meeting (Ramy,
       1 Oct 2026: "don't say join the lesson") -- and `opts.when` puts the
       time beside it. */
    var lbl=function(r){ return opts.assessor ? 'Join the room' : (r.label||'Join'); };
    /* The assessor's strip carries no label: two pills that say what they are
       need no heading over them (Ramy, 1 Oct 2026). */
    return '<div class="online-rooms">'+(opts.assessor?'':'<span class="or-lbl">Online rooms</span>')+rooms.map(function(r){
      var g=String(r.group||''), who='';
      if(opts.assessor) who='';
      else if(g&&mine&&g===mine) who='<small>your group</small>';
      else if(g&&(opts.all||mine)) who='<small>Group '+e(g)+'</small>';
      return '<a class="or-join'+(g&&mine&&g===mine?' mine':'')+'" href="'+e(r.url)+'" target="_blank" rel="noopener noreferrer">'+e(lbl(r))+who+'</a>'; }).join('')+'</div>';
  };
  /* An initials tile for a person (Ramy, 28 Sep 2026: "should trainees have
     avatars as well, with their initials, like the tutors? perhaps a
     different colour?"). Staff are teal, trainees sand with ink initials,
     so the two read apart at a glance; the colour never follows the person. */
  window.hubInitials=function(name){ return String(name||'').trim().split(/\s+/).slice(0,2).map(function(w){ return w[0]||''; }).join('').toUpperCase(); };
  window.hubAvatar=function(name, kind){
    var e=function(v){ return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); };
    return '<span class="avi '+(kind==='staff'?'avi-staff':'avi-cand')+'" aria-hidden="true">'+e(window.hubInitials(name))+'</span>';
  };

  /* The install hint, on the pages people live on; never when already
     installed. Chrome/Edge hand us a real Install button (beforeinstallprompt);
     iPhone gets the words for Share -> Add to Home Screen; anything else gets
     the plain sentence.

     IT SHRINKS, IT DOES NOT LEAVE. Ramy, 6 Oct 2026, walking as a tutor: "Not
     now is the only one that is clickable, but I'm afraid if I click on it, it
     won't come back... it should just always be there, like a small coin, out
     of the way but still kind of there... treat it as something important."
     It used to vanish for a week on Not now. Now Not now folds the card into a
     small chip in the same place, the chip stays on every visit until the app
     is installed, and pressing it opens the card again.

     ALREADY INSTALLED, OPENED IN A TAB. Chrome will not fire
     beforeinstallprompt for an app that is installed, so the person who has
     it and happens to open the link in a browser tab (Ramy, today) got the
     sentence with nothing to press. navigator.getInstalledRelatedApps, with
     the manifest listing itself under related_applications, tells us; then
     the card says so and offers nothing to install. */
  window.hubInstallHint = function(host, who){
    if (!host) return;
    try {
      if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone) return;
      if (localStorage.getItem('chub:installHintDone') === 'installed') return;
    } catch (e) { return; }
    var ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
    var deferred = null, already = false;
    var folded = (function(){ try { return !!localStorage.getItem('chub:installHintDone'); } catch (e) { return false; } })();
    var MARK = '<svg viewBox="8 30 104 60" width="16" height="10" fill="none" aria-hidden="true"><path d="M56.1 42.2 A 24 24 0 1 0 56.1 77.8" stroke="currentColor" stroke-width="13" stroke-linecap="round"></path><path d="M96.1 42.2 A 24 24 0 1 0 96.1 77.8" stroke="currentColor" stroke-width="13" stroke-linecap="round" opacity=".55"></path></svg>';
    var draw = function(){
      host.hidden = false;
      host.classList.toggle('coin', folded);
      if (folded) {
        host.innerHTML = '<button type="button" class="install-chip">' + MARK + 'Put Connect Lite on your ' + (ios ? 'phone' : 'phone or computer') + '</button>';
        host.querySelector('.install-chip').addEventListener('click', function(){ folded = false; draw(); });
        return;
      }
      var how = already ? '<span>It is already installed here — this tab is the website. Open <b>Connect Lite</b> from your apps and it remembers your link.</span>'
              : deferred ? '<button type="button" class="btn-install">Install Connect Lite</button>'
              : ios ? '<span>Tap <b>Share</b>, then <b>Add to Home Screen</b>.</span>'
              : '<span>In Chrome or Edge, use <b>Install</b> in the address bar; on a phone, <b>Add to Home Screen</b>.</span>';
      host.innerHTML = '<span><b>Put Connect Lite on your ' + (ios ? 'phone' : 'phone or computer') + '.</b> It opens like an app and remembers your link.</span>' + how + '<button type="button" class="dismiss">Not now</button>';
      var b = host.querySelector('.btn-install'); if (b) b.addEventListener('click', function(){ if (!deferred) return; deferred.prompt(); deferred.userChoice.then(function(r){ if (r && r.outcome === 'accepted') installed(); }); });
      host.querySelector('.dismiss').addEventListener('click', fold);
    };
    var fold = function(){ try { localStorage.setItem('chub:installHintDone', String(Date.now())); } catch (e) {} folded = true; draw(); };
    var installed = function(){ try { localStorage.setItem('chub:installHintDone', 'installed'); } catch (e) {} host.hidden = true; };
    window.addEventListener('beforeinstallprompt', function(e){ e.preventDefault(); deferred = e; if (!folded) draw(); });
    window.addEventListener('appinstalled', installed);
    try {
      if (navigator.getInstalledRelatedApps) navigator.getInstalledRelatedApps().then(function(apps){ if (apps && apps.length) { already = true; if (!folded) draw(); } }, function(){});
    } catch (e) {}
    draw();
  };
  window.hubBullets=function(el){
    if(!el || el.dataset.hubBullets) return; el.dataset.hubBullets='1';
    var B='\u2022 ';
    el.addEventListener('focus',function(){ if(el.value==='' && !el.disabled){ el.value=B; try{ el.setSelectionRange(B.length,B.length); }catch(e){} } });
    el.addEventListener('keydown',function(e){
      var s=el.selectionStart, t=el.selectionEnd, v=el.value; if(s==null) return;
      if(e.key==='Enter'){ e.preventDefault(); var next=v.slice(0,s)+'\n'+B+v.slice(t); el.value=next; var c=s+1+B.length; el.setSelectionRange(c,c); el.dispatchEvent(new Event('input',{bubbles:true})); }
      else if(e.key==='Backspace' && s===t){ var lineStart=v.lastIndexOf('\n',s-1)+1; if(v.slice(lineStart,s)===B){ e.preventDefault(); var cut=lineStart>0?lineStart-1:0; el.value=v.slice(0,cut)+v.slice(s); el.setSelectionRange(cut,cut); el.dispatchEvent(new Event('input',{bubbles:true})); } }
    });
    el.addEventListener('blur',function(){ if(el.value.trim()===B.trim()){ el.value=''; el.dispatchEvent(new Event('input',{bubbles:true})); } });
  };
  if(!window.confirmModal){
    /* A third argument asks the person to TYPE something before the action
       opens: confirmModal(msg, 'Delete', { type:'c4', hint:'Type c4 to delete it' }).
       Used where a click alone is too cheap for what it does. It resolves with
       the typed text, so a caller can pass the very words the person wrote on
       to the store rather than filling the confirmation in for them. */
    window.confirmModal=function(message, actionLabel, opts){
      opts = opts || {};
      var want = opts.type == null ? null : String(opts.type);
      return new Promise(function(resolve){
        var overlay=document.createElement('div');
        overlay.className='confirm-overlay';
        overlay.innerHTML='<div class="confirm-modal" role="alertdialog" aria-modal="true"><p class="confirm-message"></p>'
          + (want==null ? '' : '<label class="confirm-type"><span></span><input type="text" autocomplete="off" autocapitalize="off" spellcheck="false"></label>')
          + '<div class="confirm-actions"><button type="button" class="confirm-cancel">Cancel</button><button type="button" class="confirm-action"></button></div></div>';
        overlay.querySelector('.confirm-message').textContent=message;
        var actionBtn=overlay.querySelector('.confirm-action');
        actionBtn.textContent=actionLabel||'Continue';
        var input=overlay.querySelector('.confirm-type input');
        if(input){
          overlay.querySelector('.confirm-type span').textContent=opts.hint||('Type '+want+' to confirm');
          actionBtn.disabled=true;
          /* Case-insensitive, because the thing being typed is usually on
             screen in a different case: the owner console's cards head with the
             minted handle "C2 - 20 September 2026" while the id is "c2", so
             copying what you can see left the button dead and said nothing
             about why (walk, 21 Sep 2026). Matching still demands the right
             id -- which course goes is the whole point of the guard -- and the
             resolved value is the canonical one, so the store is handed the id
             it stores rather than the reader's capitalisation. */
          input.addEventListener('input',function(){ actionBtn.disabled = input.value.trim().toLowerCase()!==want.toLowerCase(); });
          input.addEventListener('keydown',function(e){ if(e.key==='Enter' && !actionBtn.disabled) actionBtn.click(); });
        }
        document.body.appendChild(overlay);
        function cleanup(result){ document.removeEventListener('keydown',onKey); hubFadeAway(overlay); resolve(result); }
        function onKey(e){ if(e.key==='Escape') cleanup(false); }
        document.addEventListener('keydown',onKey);
        overlay.addEventListener('mousedown',function(e){ if(e.target===overlay) cleanup(false); });
        overlay.querySelector('.confirm-cancel').addEventListener('click',function(){ cleanup(false); });
        actionBtn.addEventListener('click',function(){ if(actionBtn.disabled) return; cleanup(input ? (want==null ? input.value.trim() : want) : true); });
        (input||actionBtn).focus();
      });
    };
  }
  /* Takes a date, or a timestamp with a date at the front. It used to accept
     ONLY a bare YYYY-MM-DD and hand anything else straight back, so passing a
     returnedAt printed "Last updated 2026-10-12T10:00:00.000Z" on screen --
     a formatting slip turning into visible machinery rather than an error
     (21 Sep 2026). A timestamp's date part is read as written, not converted:
     the callers store local days, and a zone shift would move one. */
  window.niceDate=function(iso){
    var s=String(iso||''), m=s.match(/^(\d{4}-\d{2}-\d{2})/);
    if(!m) return s;
    var d=new Date(m[1]+'T00:00:00');
    if(isNaN(d.getTime())) return s;
    return d.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
  };
})();

/* Bringing something into view, and actually getting there.

   Three screens asked the browser to scroll smoothly -- the tracker to its
   detail strip, the assessor pack to a teaching practice it was deep-linked
   to, the owner console to a course just made. `behavior: 'smooth'` is
   SILENTLY A NO-OP in some engines: measured on 21 Sep 2026, both
   scrollIntoView and window.scrollTo moved nothing at all with it and moved
   correctly without it. So a tutor clicking a cell on the tracker opened a
   detail strip below the fold and saw nothing happen, and the owner console's
   new course was never brought up.

   Same shape as hubCopy: ask for the nice thing, then check, and guarantee the
   outcome. Reduced motion skips straight to the reliable one. */
window.hubScrollIntoView = function(el, block){
  if (!el || !el.scrollIntoView) return;
  var where = block || 'center';
  var reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(e){}
  var seen = function(){
    var r = el.getBoundingClientRect();
    return r.top < (window.innerHeight || 0) && r.bottom > 0;
  };
  if (seen()) return;
  if (reduce) { try { el.scrollIntoView({ block: where }); } catch(e){} return; }
  var was = window.scrollY;
  try { el.scrollIntoView({ behavior: 'smooth', block: where }); } catch(e){}
  setTimeout(function(){
    if (Math.abs(window.scrollY - was) < 2 && !seen()) {
      try { el.scrollIntoView({ block: where }); } catch(e){}
    }
  }, 300);
};

/* Course admin and the assignment-wording editor are the CENTRE's rooms, and
   they never checked who was in them. An assessor -- or a trainee -- who
   reached either got the full form: 13 editable fields and a live Save on
   Course admin, 41 on the wording editor. hub-sync blocks the write, so
   nothing they typed ever reached the course and the centre's record was never
   at risk. But the screen said "Saved -- <course>." and their own copy of the
   course took the change, so from then on they were reading a course that did
   not exist: walking the assessor role on 21 Sep 2026 the header read
   "ASSESSOR CHANGED THIS" for the rest of the session.

   A door, not a disabled form: there is nothing here for them to read, so the
   room says whose it is and points them back to their own. Tutors are
   untouched. */
/* Whose room a screen belongs to. A link that is not for this room gets the
   refusal below rather than the working screen: before this, a trainee or an
   assessor who reached the centre's setup got the full editable form and a
   Save that said "Saved" while hub-sync quietly dropped the write (walk,
   21 Sep 2026) -- and the tutor's feedback screen and the trainee's
   submission form were still open to everyone (walk, 22 Sep 2026). */
function hubRoomRefusal(title, who, mode){
  var back = mode === 'assessor'
    ? { href: '12_assessor_pack.html', label: 'Open your assessor pack' }
    : mode === 'tutor'
      ? { href: '5_tutor_dashboard.html', label: 'Back to your dashboard' }
      : mode === 'volunteer'
        ? { href: '26_volunteer.html', label: 'Back to your page' }
        : { href: 'index.html', label: 'Back to your course' };
  document.documentElement.style.background = 'oklch(92.5% 0.012 85)';
  document.body.style.cssText = 'margin:0;background:oklch(92.5% 0.012 85);';
  document.body.innerHTML =
    '<div style="max-width:560px;margin:0 auto;padding:16vh 20px 0;font-family:Karla,Helvetica,sans-serif;color:oklch(23.5% 0.017 65);">'
    + '<div style="display:flex;align-items:center;gap:9px;margin-bottom:26px;">'
    + '<span style="width:30px;height:30px;border-radius:7px;background:oklch(30% 0.042 58);display:inline-flex;align-items:center;justify-content:center;">'
    + '<svg viewBox="8 30 104 60" width="20" height="12" fill="none">'
    + '<path d="M56.1 42.2 A 24 24 0 1 0 56.1 77.8" stroke="oklch(70% 0.12 72)" stroke-width="13" stroke-linecap="round"></path>'
    + '<path d="M96.1 42.2 A 24 24 0 1 0 96.1 77.8" stroke="oklch(99.5% 0.004 90)" stroke-width="13" stroke-linecap="round"></path>'
    + '</svg></span>'
    + '<span style="display:inline-flex;align-items:baseline;gap:4px;">'
    + '<span style="font-family:Instrument Serif,Georgia,serif;font-style:italic;font-size:21px;line-height:0.85;color:oklch(63% 0.096 72);">Connect</span>'
    + '<span style="font-family:Instrument Sans,Karla,sans-serif;font-weight:500;font-size:9px;letter-spacing:0.24em;text-transform:uppercase;">Lite</span>'
    + '</span></div>'
    + '<h1 style="font-family:Newsreader,Georgia,serif;font-weight:700;font-size:1.9rem;line-height:1.2;margin:0 0 10px;">' + title + '</h1>'
    + '<p style="font-size:0.92rem;line-height:1.65;color:oklch(51% 0.017 70);margin:0 0 20px;">' + who + ' Nothing you change here would reach the course.</p>'
    + '<a href="' + back.href + '" style="font-family:Karla,sans-serif;font-size:0.82rem;font-weight:600;height:34px;padding:0 15px;border-radius:6px;border:1.5px solid oklch(89.5% 0.012 82);background:oklch(96.2% 0.02 80);color:oklch(23.5% 0.017 65);display:inline-flex;align-items:center;text-decoration:none;">' + back.label + '</a>'
    + '</div>';
  return true;
}

window.hubCentreRoomOnly = function(){
  var mode = window.HubMode;
  if (mode === 'tutor' || !mode) return false;
  return hubRoomRefusal('This room belongs to the centre',
    mode === 'assessor'
      ? 'Your link is read-only, and this page is where the centre sets the course up.'
      : 'This page is where your centre sets the course up.', mode);
};

/* The tutor's own screens: writing feedback, marking an assignment.
   `hubTutorRoomOnly({ assessor: true })` lets the assessor in as well, for a
   screen that is the tutors' to WRITE but the assessor's to READ. The grades
   report is the one: agreeing the final grades and filing them is the
   assessor's own job, and that page has always had a read-only mode built for
   them -- it was this guard, added on 22 Sep 2026 to keep a trainee out,
   that swept the assessor out with them. Read-only is enforced separately, by
   the page's own RO flag and by the store, which refuses every write from an
   assessor key. */
window.hubTutorRoomOnly = function(opts){
  var mode = window.HubMode;
  if (mode === 'tutor' || !mode) return false;
  if (opts && opts.assessor && mode === 'assessor') return false;
  return hubRoomRefusal('This room belongs to your tutors',
    mode === 'assessor'
      ? 'Your link is read-only. The returned feedback and the marked records are in your pack.'
      : 'This is where your tutors write up your teaching practice. What they return to you is on your own feedback page.', mode);
};

/* A VOLUNTEER STUDENT'S OWN PAGES (30 Sep 2026). A member of the public who
   came in to be taught has exactly two: their own page and the certificate
   printed from it. `hubVolunteerRoomOnly({ tutor: true })` lets a tutor in as
   well, for the certificate, which a centre sometimes has to print from the
   register. */
window.hubVolunteerRoomOnly = function(opts){
  var mode = window.HubMode;
  if (mode === 'volunteer' || !mode) return false;
  if (opts && opts.tutor && mode === 'tutor') return false;
  return hubRoomRefusal('This room belongs to a volunteer student',
    mode === 'tutor'
      ? 'Each student who comes in to be taught has a link of their own, and this is what it opens. Their links are on the volunteer register.'
      : 'Each student who comes in to be taught has a link of their own, and this is what it opens.', mode);
};

/* The course's own rooms, which a volunteer is not part of. They are not on
   the course; they come in to be taught, and their own page carries the only
   part of it they need. */
window.hubNotVolunteerRoom = function(){
  if (window.HubMode !== 'volunteer') return false;
  /* The house voice for every refusal is "This room belongs to ...", and the
     screen check reads it: a refusal worded any other way reads as the room
     opening (sweep, 30 Sep 2026). */
  return hubRoomRefusal('This room belongs to the course',
    'Your own page has your classes, what your teachers have shared and your attendance.', 'volunteer');
};

/* The trainee's own writing screens. */
window.hubTraineeRoomOnly = function(){
  var mode = window.HubMode;
  if (mode === 'trainee' || !mode) return false;
  return hubRoomRefusal('This room belongs to the trainee',
    mode === 'assessor'
      ? 'Your link is read-only. Submitted work is in the trainee portfolios and the assignment records.'
      : 'This is the trainee\u2019s own submission form. What they have submitted is on your marking screen.', mode);
};

/* The three writing screens (plan, self-evaluation, tutor feedback) put their
   controls in a `position:fixed` bar across the bottom, and reserve room for it
   with a fixed padding on the body -- 150px on the plan, 110px on the other
   two. The bar WRAPS on a narrow screen: at 375px the self-evaluation's grew
   from 132px to 186px against a 110px reserve, so the bottom 36px of the last
   field ("What do you want to work on in the next TP?") sat behind the bar and
   could not be scrolled clear (walk, 21 Sep 2026).

   The reserve now follows the bar's real height. It is published as a custom
   property rather than set inline, so the print rule's `body{padding:0}` still
   wins and nothing reserves a strip on paper. */
window.hubReserveForBar = function(selector){
  var bar = document.querySelector(selector || '.actionbar');
  if (!bar) return;
  var GAP = 28;
  function fit(){
    var h = 0;
    try { h = getComputedStyle(bar).position === 'fixed' ? bar.getBoundingClientRect().height : 0; } catch(e){ return; }
    if (h > 0) {
      /* On a phone the dictation pill rides a row ABOVE the bar (hub-house.css,
         max-width:560px), so the reserve has to clear that too, or the last
         field's corner and the say-something pill scroll to a stop behind
         Dictate (walk-with-data.mjs, 6 Oct 2026). The pill is built by the
         page's own script, which has run by the hub:ready fit below. */
      var lift = 0;
      try {
        var dict = document.querySelector('.dictbar');
        if (dict && window.matchMedia && matchMedia('(max-width:560px)').matches) {
          var dh = dict.getBoundingClientRect().height; if (dh > 0) lift = Math.ceil(dh + 46);
        }
      } catch (e) {}
      document.documentElement.style.setProperty('--bar-reserve', Math.ceil(h + GAP + lift) + 'px');
      /* The sync pill is fixed to the bottom-left corner, which on a screen
         with an action bar is underneath it -- and on the plan, on top of
         Turn in (23 Sep 2026). It rides above the bar instead. */
      document.documentElement.style.setProperty('--sync-bottom', Math.ceil(h + 14) + 'px');
    } else {
      document.documentElement.style.removeProperty('--bar-reserve');
      document.documentElement.style.removeProperty('--sync-bottom');
    }
  }
  fit();
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', fit);
  if (window.ResizeObserver) { try { new ResizeObserver(fit).observe(bar); } catch(e){} }
  document.addEventListener('hub:ready', fit);
  return fit;
};

/* Copying a link is the whole product of two screens -- the owner console hands
   a centre its course, and the roster hands a trainee their workspace -- and it
   used to be able to fail in total silence. Both called
   navigator.clipboard.writeText and, if it threw, prompt(). Walking the owner
   console on 21 Sep 2026 both failed at once: the clipboard refused with
   NotAllowedError and prompt() threw "not supported". The click did nothing at
   all -- no copy, no dialog, no message, the button still reading "Copy". A
   link that silently does not arrive is worse than one that visibly fails.

   So: the modern API, then execCommand, which needs no permission, and if both
   are gone the link is put on screen, selected, to be copied by hand. */
window.hubCopy = async function(text){
  try { await navigator.clipboard.writeText(text); return true; } catch(e){}
  try {
    var ta=document.createElement('textarea');
    ta.value=text; ta.setAttribute('readonly','');
    ta.style.cssText='position:fixed; top:0; left:0; width:1px; height:1px; opacity:0;';
    document.body.appendChild(ta);
    ta.select(); try{ ta.setSelectionRange(0,text.length); }catch(e2){}
    var ok=document.execCommand('copy');
    ta.remove();
    if(ok) return true;
  } catch(e){}
  return false;
};

/* The button-shaped version: says "Copied", and when it cannot, shows the link
   instead of pretending. Pass the button and what should land on the clipboard. */
window.hubCopyButton = async function(btn, text){
  /* A ticket (the console's ticket book, 1b) is a whole button with a small
     state line inside it: only that line says "Copied", or the ticket's name
     and note would be wiped. */
  var lbl = (btn.querySelector && btn.querySelector('.tk-state')) || btn;
  if(!btn.dataset.copyLabel) btn.dataset.copyLabel = lbl.textContent;
  var back = btn.dataset.copyLabel;
  var host = btn.closest('.link, .tk') || btn.parentElement || btn;
  /* Every revealed link goes, not just this row's: they are one per row, so
     copying the tutor link and then the assessor link left both on screen at
     once, and a link revealed earlier outlived a later successful copy. Only
     ever one, and only where the copy has just failed (walk, 21 Sep 2026). */
  var stale = document.querySelectorAll('.copy-fallback');
  for (var i = 0; i < stale.length; i++) stale[i].remove();
  if(await window.hubCopy(text)){
    /* "Copied ✓" for 1.8s, and the row it sits in lit while it lasts (the
       link cards, 7 Oct 2026); a page with no .copied style just sees the
       word change, as before. */
    lbl.textContent='Copied \u2713';
    btn.classList.add('copied'); if (host !== btn) host.classList.add('copied');
    clearTimeout(btn._copyT);
    btn._copyT=setTimeout(function(){ lbl.textContent=back; btn.classList.remove('copied'); host.classList.remove('copied'); },1800);
    return true;
  }
  var wrap=document.createElement('div');
  wrap.className='copy-fallback';
  wrap.style.cssText='flex-basis:100%; width:100%; display:flex; gap:8px; align-items:center; margin-top:9px; flex-wrap:wrap;';
  var note=document.createElement('span');
  note.textContent='Copying is blocked here \u2014 select this and copy it:';
  note.style.cssText='font-size:0.78rem; color:var(--grey,#6f6257);';
  var inp=document.createElement('input');
  inp.type='text'; inp.readOnly=true; inp.value=text;
  inp.style.cssText="flex:1; min-width:200px; font-family:'Karla',sans-serif; font-size:0.78rem; height:30px; padding:0 10px; border:1.5px solid var(--sand-line,#e2d9c8); border-radius:6px; background:var(--box,#faf1e4); color:var(--ink,#2b2620);";
  inp.addEventListener('focus',function(){ inp.select(); });
  wrap.appendChild(note); wrap.appendChild(inp);
  host.appendChild(wrap);
  inp.focus(); inp.select();
  return false;
};

// A centre's assignment wording. Screen 8 writes this key; every other screen
// reads it, so the centre's own wording is what a trainee writes against and
// what a tutor marks from.
//
// It used to travel as a FILE between browsers (Ramy, 20 Sep 2026: "export the
// wording from screen 8"), which is what this note described until 21 Sep.
// The store replaced that: the key is a COURSE_KEY in hub-sync (carried as
// `wording`), so an edit on screen 8 reaches the course by itself and there is
// no export to look for. Screen 8's "Import from a file" is a different thing
// and still earns its place -- it lifts section text out of the centre's own
// document into the editor.
// Schema: connect-hub-wording-v1.
window.HUB_WORDING_KEY = 'connect_assignment_wording_v2';

// Assignment 5 (the plagiarism reflection) is a centre sanction, not one of
// the four: it exists for a trainee only once a tutor has set it after a
// plagiarism finding. Ramy, 20 Sep 2026: "I don't want assignment five to be
// visible... can we have it out of the way somehow?" Nothing lists it until
// then; a submission of it already on file counts as set.
window.a5InPlay = function(subs){
  var s = subs && subs.a5;
  return !!(s && (s.assigned || (s.stage && s.stage !== 'draft')));
};

// Held back, or open to trainees? The flag lives on the wording, per assignment
// (screen 8 sets it). ABSENT MEANS RELEASED -- every course that existed before
// the toggle keeps all four open, and holding one back is a deliberate act.
// Assignment 5 is not covered here: it has its own gate, a5InPlay.
/* A course link the trainees may see: off only when switched off. The
   timetable is never switched (Ramy: "they should see it anyway"). */
/* WHEN THE GETTING-TO-KNOW-YOU RUNS, AND FOR HOW LONG. Day one on the
   timetable is the demonstration lesson and then forty-five minutes of
   unassessed teaching (23_timetable), which is where the activities go; so
   the day and the hour are read off the timetable, and the centre may type
   over either on Course admin (settings.gtkyWhen, settings.gtkyMinutes).
   Ramy, 8 Oct 2026: "not necessarily the first afternoon... this should be
   editable, but also connected to the timetable". A trainee's browser holds
   no roster, so the minutes are only ever stated when the centre set them;
   otherwise the page says the slot is shared. */
window.hubGtkyPlan = function(settings, tt){
  var cs = settings || {}, T = tt || {};
  var out = { when: String(cs.gtkyWhen || '').trim(), minutes: parseInt(cs.gtkyMinutes, 10) || 0, slotMinutes: 45, fromTimetable: false, slot: '' };
  if (!out.when) {
    var day = (T.days || [])[0], tp = (T.slots || []).filter(function(sl){ return sl && sl.kind === 'tp'; });
    var slot = tp[2] || tp[tp.length - 1] || null;
    var m = day && String(day.date || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) {
      var d = new Date(+m[1], +m[2] - 1, +m[3]);
      var name = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
      out.when = 'on ' + name + (slot && slot.from ? ' at ' + window.hubClock(slot.from) : '');
      out.fromTimetable = true;
    } else out.when = 'on the first day of the course';
    out.slot = 'the unassessed teaching slot';
  }
  return out;
};
/* THE CLOCK, 12-hour everywhere a time is printed (Ramy, 8 Oct 2026: "I'm
   really bad with the 24-hour clock"). Times are stored as HH:MM and stay
   so; this is only how they read. "9:05 AM", "1:30 PM"; a range shares its
   AM or PM when both ends are in the same half: "1:30–2:15 PM". */
window.hubClock = function(hhmm){
  var m = String(hhmm || '').match(/^(\d{1,2}):(\d{2})/); if (!m) return String(hhmm || '');
  var h = +m[1], mm = m[2], pm = h >= 12, h12 = h % 12 || 12;
  return h12 + ':' + mm + ' ' + (pm ? 'PM' : 'AM');
};
window.hubClockRange = function(a, b){
  var A = window.hubClock(a), B = window.hubClock(b); if (!A) return B; if (!B) return A;
  var sa = A.slice(-2), sb = B.slice(-2);
  return (sa === sb ? A.slice(0, -3) : A) + '\u2013' + B;
};
window.hubLinkIsTimetable = function(l){ return /timetable/i.test(String((l && l.label) || '') + ' ' + String((l && l.card) || '')); };
/* The CELTA 5 and the TP points are Lite's own rooms now (20_celta5, 24_tp_points),
   so a bare row by that name shows the trainees nothing; a row the centre LINKED
   under that name is theirs and stays (8 Oct 2026). */
window.hubLinkIsNative = function(l){ return !!l && !l.url && /^(celta ?5|tp points)$/i.test(String(l.label || '').trim()); };
/* Shown when switched on, or from the moment the centre set (showFrom, an
   instant, the noticeboard's publishAt rule): an input session held back
   until its day (Ramy, 8 Oct 2026: "the default should be that trainees
   cannot see it... shown depending on the date and time, or triggered
   manually"). */
window.hubLinkShown = function(l){
  if (!l) return false;
  if (window.hubLinkIsTimetable(l)) return true;
  if (l.show !== false) return true;
  return !!(l.showFrom && window.HubDue && HubDue.state(l.showFrom).past);
};
window.hubReleased = function(wording, key){
  return !(wording && wording[key] && wording[key].released === false);
};

// The four assignments in the order this centre runs them. The order lives
// in the wording as `_order` (screen 8 sets it; Ramy, 20 Sep 2026: "the
// order also could change, maybe depending on the centre"). Anything missing
// falls in after in the default order; Assignment 5 is always last.
window.hubAssignmentOrder = function(wording){
  var base = ['fol', 'lrt', 'lsrt', 'lfc'];
  var o = (wording && Array.isArray(wording._order)) ? wording._order.filter(function(k){ return base.indexOf(k) > -1; }) : [];
  base.forEach(function(k){ if (o.indexOf(k) === -1) o.push(k); });
  return o.concat(['a5']);
};

// The centre on the documents (Ramy, 20 Sep 2026: "put the centre name and
// logo on the documents"). Course admin's Settings hold the centre's name,
// number and logo; the store boots them into this browser, so every page and
// every assembled document can carry them. A document keeps the letterhead it
// was assembled with.
window.hubCentre = function(){
  var cs = {}; try { cs = JSON.parse(localStorage.getItem('connect_course_settings') || '{}') || {}; } catch (e) {}
  return { name: cs.centreName || '', number: cs.centreNumber || '', logo: cs.logo || '', course: cs.courseName || '' };
};
window.hubLetterheadHTML = function(eyebrow){
  var c = window.hubCentre(); if (!c.name && !c.logo) return '';
  var esc = function(t){ return String(t || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); };
  return '<div style="display:flex;align-items:center;gap:12px;padding:0 0 12px;margin:0 0 16px;border-bottom:1px solid #e3ddd0;">'
    + (c.logo ? '<img src="' + c.logo + '" alt="" style="height:44px;width:auto;max-width:160px;object-fit:contain;flex-shrink:0;">' : '')
    + '<div><div style="font-family:Newsreader,Georgia,serif;font-size:16pt;font-weight:700;color:#1e4d4a;line-height:1.15;">' + esc(c.name) + '</div>'
    + (c.number || eyebrow ? '<div style="font-family:Karla,Calibri,Arial,sans-serif;font-size:8.5pt;letter-spacing:0.12em;text-transform:uppercase;color:#6b665c;margin-top:3px;">' + esc([c.number ? 'Cambridge centre ' + c.number : '', eyebrow].filter(Boolean).join(' \u00b7 ')) + '</div>' : '')
    + '</div></div>';
};
// The page headers' "Centre logo" box and centre-name line, filled from the settings.
window.hubApplyCentre = function(){
  var c = window.hubCentre();
  document.querySelectorAll('.hub-centre-logo').forEach(function(slot){
    /* No logo: the slot GOES. It used to stay, a dashed box reading "Centre
       logo" -- an instruction addressed to the centre, sitting on the
       trainee's own lesson plan, self-evaluation and teaching practice
       record, where it reads as a broken image (walk, 21 Sep 2026). The
       letterhead in the printed document has always simply left the logo out;
       the on-screen header now does the same. Course admin's own upload box is
       a different element (#logoSlot) and keeps its prompt, which is the one
       place the instruction belongs. */
    if (!c.logo) { slot.style.display = 'none'; return; }
    slot.style.display = '';
    /* The logo keeps its own shape: height fixed at the slot's, width follows
       (7 Oct 2026, the IH wordmark came out a sliver in a 44px square and the
       round mark on its own sat in a box). */
    slot.innerHTML = '<img src="' + c.logo + '" alt="' + c.name.replace(/"/g,'&quot;') + ' logo" style="height:44px;width:auto;max-width:140px;object-fit:contain;display:block;">';
    slot.style.border = 'none';
    slot.style.width = 'auto';
    slot.style.borderRadius = '0';
  });
  document.querySelectorAll('.hub-centre-name').forEach(function(el){
    if (!c.name) return;
    if (el.tagName === 'INPUT') { if (!el.value) el.value = c.name; el.readOnly = true; el.style.borderBottomColor = 'transparent'; el.title = 'Set on course admin\u2019s Settings tab'; }
    else el.textContent = c.name;
  });
};
/* THE RULE (Ramy, 8 Oct 2026): "the assessor, trainee, trainer sort of
   landing pages should show the centre name and the centre logo." Each of
   those pages writes its centre line (name, number, dates); this puts the
   logo in front of it, in the logo's own shape, 28px high and up to 84 wide.
   Call it AFTER the line's text is set -- setting textContent clears it. */
window.hubCentreLogo = function(el){
  if (!el) return;
  var c = window.hubCentre();
  var old = el.querySelector && el.querySelector('img.hub-centre-mark');
  if (!c.logo || !/^(data:image\/|https:\/\/)/.test(String(c.logo))) { if (old) old.remove(); el.classList.remove('hub-with-logo'); return; }
  if (!document.getElementById('hub-centre-mark-css')) {
    var st = document.createElement('style'); st.id = 'hub-centre-mark-css';
    st.textContent = '.hub-with-logo{display:flex; align-items:center; gap:10px; flex-wrap:wrap;}'
      + '.hub-centre-mark{height:28px; width:auto; max-width:84px; object-fit:contain; display:block; flex:none;}';
    document.head.appendChild(st);
  }
  var img = old || document.createElement('img');
  img.className = 'hub-centre-mark'; img.alt = ''; if (img.getAttribute('src') !== c.logo) img.src = c.logo;
  if (!old) el.insertBefore(img, el.firstChild);
  el.classList.add('hub-with-logo');
  // a centred line (the assessor's pack) stays centred with its logo
  try { if (getComputedStyle(el).textAlign === 'center') el.style.justifyContent = 'center'; } catch (e) {}
};
document.addEventListener('hub:ready', window.hubApplyCentre);
if (!window.HubStore) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', window.hubApplyCentre); else window.hubApplyCentre(); }



/* ---- one assignment's record, as it prints -------------------------------
   Lifted out of 11_assignment_record.html on 23 Sep 2026 so the course record
   (screen 15) prints exactly what the single-assignment screen prints. Copying
   it would have been two records that drift; this is the one. The caller adds
   its own letterhead, because screen 15 wants one for the whole document
   rather than one per assignment. */
(function(){
  function esc(s){ return (s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function nl2br(s){ return esc(s).replace(/\n/g,'<br>'); }

  function submissionHTML(a, snap){
    if (!snap) return '<p class="readonly">Nothing submitted.</p>';
    let out = '';
    /* The materials link the trainee gave, first, so a marker or an assessor
       reading the record can open what the writing refers to (24 Sep 2026). */
    var ml = (snap && snap.materialsLink || '').trim();
    if (ml) out += '<p style="margin:0 0 10px;"><a href="' + esc(ml) + '" target="_blank" rel="noopener" style="display:inline-block;font-size:0.78rem;font-weight:700;padding:5px 12px;border-radius:16px;background:oklch(37.5% 0.058 195);color:#fff;text-decoration:none;">Open the materials \u2197</a></p>';
    a.sections.forEach((s,i) => {
      if (s.type==='text' && !/before you start/i.test(s.label) && snap.text && snap.text[i]) {
        out += `<div class="roundlabel">${esc(s.label)}</div><div class="readonly">${nl2br(snap.text[i])}</div>`;
      } else if (s.type==='picker' && snap.picked && snap.picked[i]) {
        const p = snap.picked[i];
        out += `<div class="roundlabel">${esc(s.label)}</div><div class="readonly">${esc(s.catA.label)}: ${p.A.map(esc).join(', ')||'\u2014'}\n${esc(s.catB.label)}: ${p.B.map(esc).join(', ')||'\u2014'}</div>`;
      } else if (s.type==='fields' && snap.fields) {
        const items = (snap.picked && (function(){ for(let j=i-1;j>=0;j--){ if(a.sections[j].type==='picker'){ const p=snap.picked[j]||{A:[],B:[]}; return p.A.concat(p.B);} } return []; })());
        (items||[]).forEach((item, ii) => {
          out += `<div class="roundlabel">${esc(s.label)} \u2014 ${esc(item)}</div>`;
          s.fields.forEach((f,fi) => {
            const v = snap.fields[`s${i}_i${ii}_f${fi}`];
            if (v) out += `<div class="readonly"><strong>${esc(f.label)}:</strong> ${nl2br(v)}</div>`;
          });
        });
      } else if (s.type==='declaration' && snap.decl && snap.decl[i]) {
        const d = snap.decl[i];
        out += `<div class="roundlabel">Declaration</div><div class="readonly">${s.items.map((it,ci)=>`${d.checks[ci]?'\u2611':'\u2610'} ${esc(it)}`).join('\n')}${s.aiToggle?`\nAI used: ${d.aiUsed==='yes'?('Yes \u2014 '+esc(d.aiPurpose)+' \u2014 '+esc(d.aiLink)):'No'}`:''}</div>`;
      }
    });
    return out || '<p class="readonly">Nothing submitted.</p>';
  }

  function criteriaTable(a, marksRound1, marksRound2, commentsRound1, commentsRound2, hasRound2){
    const crit = a.criteria || [];
    if (!crit.length) return '';
    return `<table class="crit"><tr><th>Criterion</th><th>1st sub.</th>${hasRound2?'<th>2nd sub.</th>':''}</tr>
      ${crit.map((c,i)=>{
        const m1 = marksRound1[i]; const m2 = hasRound2 ? marksRound2[i] : undefined;
        const cm1 = commentsRound1[i]; const cm2 = hasRound2 ? commentsRound2[i] : '';
        /* The comment goes with the mark whatever the mark is. It used to print
           only under "Not met", so a tutor's comment on a criterion they HAD met
           was stored, shown to the trainee on their own screen, and missing
           from this record -- the one Handbook 12.1.1 puts in the portfolio the
           assessor reads (walk, 21 Sep 2026). The marking screen offers the box
           on every criterion regardless of the mark, so the tutor has no way to
           know which of their comments will survive. */
        const note = cm => cm ? `<div class="note" style="font-weight:400; text-transform:none; font-size:0.8rem; margin-top:3px; color:var(--ink);">${nl2br(cm)}</div>` : '';
        const cell = (m,cm) => m===true ? `<td class="mark met">Met${note(cm)}</td>` : m===false ? `<td class="mark not">Not met${note(cm)}</td>` : `<td class="mark">\u2014${note(cm)}</td>`;
        return `<tr><td>${esc(c.text)}</td>${cell(m1,cm1)}${hasRound2?cell(m2,cm2):''}</tr>`;
      }).join('')}
    </table>`;
  }

  window.hubAssignmentRecordHTML = function(a, sub){
    if (!a || !sub || sub.stage === 'draft') return '';
    var fb = sub.feedback || {};
    var isPass = /Pass/.test(fb.outcome || '');
    var marks = sub.criteriaMarks || { sub1: [], sub2: [] };
    var comments = sub.criteriaComments || { sub1: [], sub2: [] };
    var html = '<div class="header"><p class="eyebrow">Cambridge CELTA \u00b7 written assignment record</p>'
      + '<h1>' + esc(a.title) + '</h1>'
      + (fb.outcome ? '<div class="outcome-badge ' + (isPass ? 'pass' : 'fail') + '">' + esc(fb.outcome) + '</div>' : '')
      + '</div>'
      + '<div class="section"><h2>First submission</h2>' + submissionHTML(a, sub.sub1) + '</div>';
    if (sub.sub2) html += '<div class="section"><h2>Resubmission</h2>' + submissionHTML(a, sub.sub2) + '</div>';
    html += '<div class="section"><h2>Assessment criteria</h2>'
      + criteriaTable(a, marks.sub1 || [], marks.sub2 || [], comments.sub1 || [], comments.sub2 || [], !!sub.sub2) + '</div>';
    html += '<div class="section"><h2>Tutor\u2019s general comments</h2>'
      + (fb.generalComment1 ? '<div class="roundlabel">On the first submission</div><div class="comment">' + nl2br(fb.generalComment1) + '</div>' : '')
      + (fb.generalComment2 ? '<div class="roundlabel">On the resubmission</div><div class="comment">' + nl2br(fb.generalComment2) + '</div>' : '')
      + ((!fb.generalComment1 && !fb.generalComment2) ? '<p class="readonly">No general comment \u2014 feedback is per-criterion above.</p>' : '')
      + '</div>';
    /* Handbook 9.2.3: the record carries who marked it, and whether it was
       double-marked (found missing on the 20 Sep 2026 tutor walk). */
    var mk = sub.markers || {};
    var when = function(iso){ if (!iso) return ''; var d = new Date(iso); return isNaN(d) ? '' : d.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' }); };
    html += '<div class="section"><h2>Marking record</h2><p class="readonly">First marker: <strong>' + esc(mk.first || '\u2014') + '</strong>'
      + (sub.marked1At ? ' \u00b7 ' + esc(when(sub.marked1At)) : '')
      + (sub.marked2At ? ' \u00b7 resubmission marked ' + esc(when(sub.marked2At)) : '')
      + '<br>Second marker: <strong>' + esc(mk.second || '\u2014') + '</strong> \u00b7 ' + (mk.doubleMarked ? 'double-marked' : 'not double-marked')
      + '</p></div>';
    return html;
  };
})();

/* The offline shell (sw.js): one registration here, since every screen loads
   this file. Same-origin pages and assets are kept in the browser once
   visited -- and the whole shell on first visit -- so a page can be opened
   with no connection. Online, nothing changes: network first. */
try { if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register('sw.js'); } catch (e) {}

/* Tables that stack on a phone.
 *
 * The plan, the language analysis and the marked assignment are stored as
 * HTML, generated for A4, with no classes on anything -- so at 390px a four
 * column procedure table is far wider than the screen and has to be shoved
 * about sideways to be read (Ramy, 24 Sep 2026: "stack the plan table on a
 * phone").
 *
 * Rather than change the generator, which would only help records written
 * from today, each table is labelled as it is rendered: the first row is the
 * header, so its cells name the columns, and every cell below carries its
 * column's name in data-l. hub-house.css turns that into a stacked row at
 * narrow widths and ignores it everywhere else, so A4 and print are untouched.
 *
 * A cell spanning columns (the procedure table's Total) has no single column
 * to be named by, and says so instead. */
window.hubStackTables = function(root){
  var scope = root || document;
  [].forEach.call(scope.querySelectorAll('table'), function(t){
    if (t.getAttribute('data-stacked')) return;
    var rows = t.rows; if (!rows || rows.length < 2) return;
    var labels = [].map.call(rows[0].cells, function(c){
      return ((c.textContent || '').trim().split('\n')[0] || '').trim();
    });
    /* A row of <th> IS a header, however few rows follow it -- which is how
       the assessor pack's two tables say so, and they can have one trainee
       on them. Everything else has to earn it by having rows to spare, because
       the stored documents mark their header row with a background colour on
       plain <td>s and a label/value grid's first row is data. */
    var headRow = [].every.call(rows[0].cells, function(c){ return c.tagName === 'TH'; });
    if (!headRow && rows.length < 3) return;
    /* Only a table that is genuinely too wide, and genuinely has a header row.
       Three columns or more, three rows or more: that is the procedure table
       and the criteria table, and it leaves alone the label/value grids -- the
       feedback points, the analysis sheets, the meta band -- whose first row
       is DATA, not headings. Stacking those put "Strengths in planning" over
       every row beneath it (caught on a phone, 24 Sep 2026). */
    /* Three columns or more, and enough of them named to be worth labelling --
       a trailing empty heading (the pack's actions column) is allowed. */
    if (labels.length < 3 || labels.filter(Boolean).length < 3) return;
    for (var i = 1; i < rows.length; i++){
      /* Count COLUMNS, not cells: the procedure table's Total row spans three,
         so the number after it is the fourth column and was being labelled
         with the second one's name. */
      var col = 0;
      [].forEach.call(rows[i].cells, function(c){
        if (c.colSpan > 1) { c.setAttribute('data-full', '1'); col += c.colSpan; return; }
        if (labels[col]) c.setAttribute('data-l', labels[col]);
        col += 1;
      });
    }
    t.setAttribute('data-stacked', '1');
    t.classList.add('hub-stack');
  });
};

/* ---- assignment sections: two shapes a real centre's assignments need ----
 *
 * Both came out of copying IH Istanbul's C/17 assignments into Lite word for
 * word (25 Sep 2026). Neither could be expressed before, and both are general:
 * they are not about that centre.
 *
 * 1. A picker with more than two groups, each with its own count, and a group
 *    the trainee does not choose. C/17's Language Related Tasks analyses
 *    FOUR items -- one grammar structure chosen from three, one functional
 *    exponent that is fixed for everyone, and two vocabulary items chosen from
 *    three. The picker was hard-wired to exactly two categories sharing one
 *    pickCount, so that assignment could not be written down.
 *
 * 2. Reference material the trainee reads and does not write in: the letter
 *    the items come from, the three texts, the class profile, the submission
 *    rules. A text section always rendered a textarea, with one exception
 *    keyed on the LABEL being "Before you start" -- so the only read-only block
 *    an assignment could have was one called that, and only one of it.
 */

/* Every group in a picker, old shape or new, as one array.
 * Old: catA + catB + pickCount (both groups share the count).
 * New: cats: [{ key, label, options, pick, fixed }] -- any number of groups,
 * each with its own count. `fixed` means the group is not chosen: its options
 * are simply part of the assignment, shown and always included. */
window.hubPickerCats = function(s){
  if (s && Array.isArray(s.cats) && s.cats.length) {
    return s.cats.map(function(c, i){
      return { key: c.key || String.fromCharCode(65 + i), label: c.label || '',
               options: c.options || [], pick: c.fixed ? (c.options || []).length : (c.pick == null ? 1 : c.pick),
               fixed: !!c.fixed };
    });
  }
  var n = s && s.pickCount == null ? 1 : s.pickCount;
  return ['A','B'].filter(function(k){ return s && s['cat'+k]; }).map(function(k){
    return { key: k, label: s['cat'+k].label || '', options: s['cat'+k].options || [], pick: n, fixed: false };
  });
};

/* What a trainee ends up with from a picker, in the groups' own order.
 * A fixed group contributes its options whether or not anything was clicked,
 * which is what makes "everyone analyses this one" expressible. */
window.hubPickedItems = function(s, picked){
  picked = picked || {};
  var out = [];
  window.hubPickerCats(s).forEach(function(c){
    if (c.fixed) { c.options.forEach(function(o){ if (out.indexOf(o) < 0) out.push(o); }); return; }
    (picked[c.key] || []).forEach(function(o){ if (out.indexOf(o) < 0) out.push(o); });
  });
  return out;
};

/* Reference material, not a question. True for a section the trainee reads
 * and does not write in. The "Before you start" label keeps working so that
 * every assignment written before this stays as it was. */
window.hubIsReference = function(s){
  return !!(s && (s.readonly === true || /before you start/i.test(s.label || '')));
};

/* ---- the course's clock -------------------------------------------------
 * Ramy, 29 Sep 2026: "how does Lite deal with different time zones? Trainees
 * and trainers in different time zones, with deadlines and timings."
 *
 * Lite answers that in three different ways, on purpose, because the three
 * things are not alike:
 *   a DEADLINE is an INSTANT — stored with its offset, rendered in each
 *     reader's own clock (hub-due.js). Nobody sets a zone, nobody sets it
 *     wrong;
 *   a course DATE is a DAY — the 5th of October is the 5th everywhere, so it
 *     is stored bare and never read as a moment;
 *   a TIMETABLE TIME is a WALL CLOCK in the course's own zone. "Input at
 *     10:00" means ten in the morning where the course is, on every day of
 *     the course, through a daylight-saving change. It is not an instant,
 *     because it does not move when the clocks do.
 *
 * So a timetable time needs the course's zone to mean anything to somebody
 * reading it from elsewhere — which an online course with join links on the
 * timetable is, by definition. That is what this is for.
 */
(function(){
  /* What a zone's offset is at a given instant, in ms. Intl knows the rules,
     including daylight saving, so nothing here has a table of its own. */
  function offsetAt(t, tz){
    try {
      var dtf = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour12:false,
        year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit' });
      var p = {}; dtf.formatToParts(new Date(t)).forEach(function(x){ p[x.type] = x.value; });
      var asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, (+p.hour) % 24, +p.minute, +p.second);
      return asUTC - t;
    } catch (e) { return 0; }
  }
  /* A wall-clock time in a zone, as an instant. Guess, then correct: the
     first guess can land on the wrong side of a daylight-saving change, so
     the offset is taken again at the corrected instant. */
  window.hubZonedInstant = function(dateISO, hhmm, tz){
    var d = String(dateISO || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
    var t = String(hhmm || '').match(/^(\d{1,2}):(\d{2})/);
    if (!d || !t || !tz) return null;
    var guess = Date.UTC(+d[1], +d[2] - 1, +d[3], +t[1], +t[2]);
    var inst = guess - offsetAt(guess, tz);
    return guess - offsetAt(inst, tz);
  };
  /* The reader's own zone, as the browser reports it. */
  window.hubReaderZone = function(){
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { return ''; }
  };
  /* The short name a zone goes by on screen: "Istanbul", not
     "Europe/Istanbul", because the second half is the only part anyone says. */
  window.hubZoneName = function(tz){
    return String(tz || '').split('/').pop().replace(/_/g, ' ');
  };
  /* What a timetable time reads as for THIS reader. Returns the course's own
     label always, and a local one only when the reader is somewhere that
     makes it a different time — a face-to-face centre never sees two clocks. */
  /* THE DEMO CLOCK (30 Sep 2026). Ramy: "a demo for a course that has no end
     date so it would last... one showing the beginning of the course and one
     towards the end before the assessor visit." A course pinned to a day
     (settings.demoToday, YYYY-MM-DD) reads THAT day as today on every screen
     that decides anything by the date -- the timetable's marks, the
     register's past/future blocks, the volunteer's next class, hub-due's
     deadline states -- so a demo planted on day 6 is still on day 6 next
     spring. The time of day stays real, so "your class is at 13:30" still
     turns into "today" and "in an hour" naturally. Stamps on records (turned
     in at, signed at) are never touched: they are history, and the seed
     writes them consistent with the pinned day. Never set on a real course. */
  window.hubDemoToday = function(){
    try { var cs = JSON.parse(localStorage.getItem('connect_course_settings') || '{}') || {}; var d = String(cs.demoToday || ''); return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : ''; }
    catch (e) { return ''; }
  };
  window.hubToday = function(){
    var d = window.hubDemoToday(); if (d) return d;
    var n = new Date(); return n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0') + '-' + String(n.getDate()).padStart(2, '0');
  };
  window.hubNow = function(){
    var d = window.hubDemoToday(); if (!d) return Date.now();
    var n = new Date(), p = d.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2], n.getHours(), n.getMinutes(), n.getSeconds()).getTime();
  };
  window.hubTimeFor = function(dateISO, hhmm, courseZone){
    var out = { course: String(hhmm || ''), local: '', differs: false, zone: courseZone || '' };
    var reader = window.hubReaderZone();
    if (!courseZone || !reader || courseZone === reader) return out;
    var inst = window.hubZonedInstant(dateISO, hhmm, courseZone);
    if (inst == null) return out;
    var local;
    try { local = new Date(inst).toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit', hour12:true, timeZone: reader }); }
    catch (e) { return out; }
    out.local = local;
    out.differs = local !== out.course;
    return out;
  };
})();


/* ---- THE DATE PICKER (8 Oct 2026) ------------------------------------------
   The browser's own calendar cannot be styled and looks like a spreadsheet
   dropped on the page (Ramy: "can we make it prettier somehow"). flatpickr,
   vendored under assets/ so the shell caches it and nothing is fetched from
   anyone else's server, is put on every date and date-time box, dressed in
   the house colours (hub-house.css, .flatpickr-*). The box's own value stays
   exactly what the page reads -- YYYY-MM-DD, or YYYY-MM-DDTHH:MM -- and the
   picker shows a readable copy beside it. On a phone the native picker is
   kept: it is the better one there. If the script does not load, nothing
   changes: the native box is still a native box. */
(function(){
  if (typeof document === 'undefined' || !document.currentScript) return;
  var src = document.currentScript.getAttribute('src') || '';
  var stamp = (src.match(/\?v=([0-9]+)/) || [])[1];
  var q = stamp ? '?v=' + stamp : '';
  var css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'assets/flatpickr.min.css' + q;
  document.head.appendChild(css);
  var js = document.createElement('script'); js.src = 'assets/flatpickr.min.js' + q; js.defer = true;
  js.onload = function(){ start(); };
  document.head.appendChild(js);

  var seen = [];
  function wanted(el){ return el && el.tagName === 'INPUT' && (el.type === 'date' || el.type === 'datetime-local' || el.type === 'time') && !el._fp && !el.disabled; }
  function dress(el){
    if (!window.flatpickr || !wanted(el)) return;
    var withTime = el.type === 'datetime-local', onlyTime = el.type === 'time';
    var fmt = onlyTime ? 'H:i' : withTime ? 'Y-m-d\\TH:i' : 'Y-m-d';
    var fp = window.flatpickr(el, {
      dateFormat: fmt, enableTime: withTime || onlyTime, noCalendar: onlyTime, time_24hr: false, minuteIncrement: 5,
      altInput: true, altFormat: onlyTime ? 'h:i K' : withTime ? 'D j M Y, h:i K' : 'D j M Y', allowInput: false,
      locale: { firstDayOfWeek: 1 }, disableMobile: false, monthSelectorType: 'static',
      onChange: function(){ try { el.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) {} },
      onOpen: function(){ sync(el); }
    });
    el._fp = fp; el._fpLast = el.value;
    if (fp.altInput) { fp.altInput.placeholder = el.getAttribute('placeholder') || (onlyTime ? 'Time' : withTime ? 'Pick a day and time' : 'Pick a day'); fp.altInput.setAttribute('aria-label', el.getAttribute('aria-label') || el.title || ''); }
    seen.push(el);
  }
  /* A page that sets a box's value from script (every settings load does)
     leaves the readable copy stale; so a value that changed under the picker
     is read back in, on open and once a second. */
  function sync(el){ var fp = el._fp; if (!fp) return; if (el.value !== el._fpLast) { el._fpLast = el.value; if (el.value) fp.setDate(el.value, false, fp.config.dateFormat); else fp.clear(false); } }
  function sweep(root){ (root || document).querySelectorAll('input[type=date], input[type=datetime-local], input[type=time]').forEach(dress); }
  function start(){
    sweep(document);
    try { new MutationObserver(function(){ sweep(document); }).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
    setInterval(function(){ seen.forEach(sync); }, 1000);
  }
})();

/* THE BRAND, ALWAYS THERE (Ramy, 8 Oct 2026: "we're going to use this logo
   everywhere where it says Connect Lite and next to my credit... this is a
   branding, so it's always going to be there"). A screen that does not
   already carry the mark and the credit gets them as one quiet line at its
   foot: the tile, Connect LITE, designed and built by Ramy. A screen with its
   own credit (the landings, the cards, the console) keeps its own; a page can
   opt out with data-brand="off" on <body>. Never on paper -- the printed
   documents are Cambridge's and the trainee's, not ours. */
window.hubLockup = function(size){
  var s = size || 18;
  return '<span class="hub-lockup"><span class="hub-lockup-tile" style="width:' + s + 'px;height:' + s + 'px;border-radius:' + Math.round(s * 0.23) + 'px">'
    + '<svg viewBox="8 30 104 60" width="' + Math.round(s * 0.66) + '" height="' + Math.round(s * 0.4) + '" fill="none" aria-hidden="true">'
    + '<path d="M56.1 42.2 A 24 24 0 1 0 56.1 77.8" stroke="oklch(70% 0.12 72)" stroke-width="13" stroke-linecap="round"></path>'
    + '<path d="M96.1 42.2 A 24 24 0 1 0 96.1 77.8" stroke="oklch(99.5% 0.004 90)" stroke-width="13" stroke-linecap="round"></path></svg></span>'
    + '<span class="hub-lockup-c">Connect</span><span class="hub-lockup-l">Lite</span></span>';
};
(function(){
  /* The wordmark's two faces, for the screens whose own font link never
     asked for them. */
  if (!document.querySelector('link[href*="Instrument+Serif"]') && !document.getElementById('hub-brand-fonts')) {
    var fl = document.createElement('link'); fl.id = 'hub-brand-fonts'; fl.rel = 'stylesheet';
    fl.href = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Instrument+Sans:wght@500&display=swap';
    document.head.appendChild(fl);
  }
  if (!document.getElementById('hub-brand-css')) {
    var c = document.createElement('style'); c.id = 'hub-brand-css';
    c.textContent = ".hub-lockup{display:inline-flex; align-items:center; gap:7px; vertical-align:middle;}"
      + ".hub-lockup-tile{display:inline-flex; align-items:center; justify-content:center; flex:none; background:oklch(30% 0.042 58);}"
      + ".hub-lockup-c{font-family:'Instrument Serif',Georgia,serif; font-style:italic; font-size:17px; line-height:.85; color:oklch(63% 0.096 72);}"
      + ".hub-lockup-l{font-family:'Instrument Sans','Karla',sans-serif; font-weight:500; font-size:8px; letter-spacing:.24em; text-transform:uppercase; color:inherit; margin-left:-3px;}"
      + ".hub-brand-foot{display:flex; align-items:center; justify-content:center; gap:10px; flex-wrap:wrap; margin:28px auto 22px; padding:0 16px;"
      +   " font-family:'Karla',sans-serif; font-size:11px; color:oklch(50% 0.09 62);}"
      + ".hub-brand-foot .hub-lockup{color:var(--ink, oklch(23.5% 0.017 65));}"
      + ".hub-brand-foot b{font-weight:700;}"
      + "@media print{.hub-brand-foot{display:none !important;}}";
    document.head.appendChild(c);
  }
  function foot(){
    var b = document.body; if (!b || b.dataset.brand === 'off') return;
    if (document.querySelector('.hub-brand-foot, .hub-credit, .credit, .fp-foot')) return;
    var f = document.createElement('footer'); f.className = 'hub-brand-foot';
    f.innerHTML = window.hubLockup(18) + '<span>designed and built by <b>Ramy</b></span>';
    /* A screen whose body is a centred row (the assignment page, say) would
       put the footer beside its column, not under it: give it a line of its
       own. */
    var cs = getComputedStyle(b);
    if (/flex/.test(cs.display) && !/column/.test(cs.flexDirection)) { b.style.flexWrap = 'wrap'; f.style.flexBasis = '100%'; }
    else if (/grid/.test(cs.display)) { f.style.gridColumn = '1 / -1'; }
    b.appendChild(f);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', foot); else foot();
})();
