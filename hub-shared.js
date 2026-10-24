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
/* Minutes as a person says them: "3 h 15 min", not "3.3" (walk, 24 Oct 2026:
   195 minutes read as 3.3 of 6 hours). */
window.hubHoursText = function(min){
  min = Math.max(0, Math.round(Number(min) || 0));
  var h = Math.floor(min / 60), m = min % 60;
  return h ? h + ' h' + (m ? ' ' + m + ' min' : '') : m + ' min';
};
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
      ".hub-credit{ font-family:'Karla',sans-serif; font-size:11px; letter-spacing:0.01em; color:color-mix(in oklab, var(--bronze) 85%, transparent); white-space:nowrap; margin-left:12px; align-self:center; }"+
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
  /* ONE RULE FOR A TRAINEE'S TILE (Ramy, 24 Oct 2026: "lose the avatar with
     the initials ... keep the letters all the way through everywhere"). A
     trainee is their teaching-set letter, A to F in each group, as the course
     admin places them (settings.slotOf) and hub-rotation deals them. Never
     initials, never an alphabetical count: where no letter is known there is
     no tile. Staff keep their initials. */
  var LETTERS = null;
  window.hubLetters = function(){
    if (LETTERS) return LETTERS;
    var out = { byToken: {}, byName: {} };
    if (!window.hubRotation || !hubRotation.lettersFor) return out;
    var r = null; try { r = JSON.parse(localStorage.getItem('connect_roster_v1') || 'null'); } catch (err) {}
    var by = {};
    Object.values((r && r.trainees) || {}).forEach(function(t){ if (!t || !t.name) return; var g = String(t.group || ''); (by[g] = by[g] || []).push({ token: String(t.id || t.token || ''), name: t.name }); });
    Object.keys(by).forEach(function(g){ hubRotation.lettersFor(by[g]).forEach(function(p){ if (!p.letter) return; var v = { letter: p.letter, idx: p.idx, group: g }; out.byToken[p.token] = v; out.byName[p.name] = v; }); });
    if (Object.keys(out.byToken).length) LETTERS = out;
    return out;
  };
  window.hubLetterOf = function(token, name){
    var L = window.hubLetters();
    var v = (token && L.byToken[String(token)]) || (name && L.byName[name]);
    if (v) return v.letter;
    /* a trainee's browser has no roster: the places the course admin set say it directly */
    var s = null; try { s = JSON.parse(localStorage.getItem('connect_course_settings') || 'null'); } catch (err) {}
    return (token && s && s.slotOf && /^[A-F]$/.test(String(s.slotOf[String(token)] || ''))) ? String(s.slotOf[String(token)]) : '';
  };
  window.hubAvatar=function(name, kind, token){
    var e=function(v){ return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); };
    if (kind==='staff') return '<span class="avi avi-staff" aria-hidden="true">'+e(window.hubInitials(name))+'</span>';
    var l = window.hubLetterOf(token, name);
    return l ? '<span class="avi avi-cand" aria-hidden="true">'+e(l)+'</span>' : '';
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
    /* Ramy, 17 Oct 2026, in Chrome on his Mac: the card said "use Install in
       the address bar" and there was no Install. Chrome offers Install only
       when it will install the page; when it will not -- most often because
       another Lite app (the tutor's, a trainee's) is already installed, and
       they share one address -- the card now says so instead of pointing at
       a button that is not there. Safari on a Mac gets its own words, and
       Firefox, which cannot install it, says so. */
    var ua = navigator.userAgent;
    var macSafari = !ios && /Macintosh/.test(ua) && /Safari\//.test(ua) && !/Chrome|Chromium|Edg\//.test(ua);
    var firefox = /Firefox\//.test(ua);
    /* One state per page, whatever redraws the card: Chrome fires
       beforeinstallprompt once, so a card drawn after it must still know. */
    var G = window.__hubInstall || (window.__hubInstall = { deferred: null, already: false, t0: Date.now(), hosts: [] });
    var noOffer = false;
    var deferred = G.deferred, already = G.already;
    var folded = (function(){ try { return !!localStorage.getItem('chub:installHintDone'); } catch (e) { return false; } })();
    var MARK = '<svg viewBox="8 28 104 64" width="16" height="10" fill="none" aria-hidden="true"><path d="M56.1 42.2 A 24 24 0 1 0 56.1 77.8" stroke="currentColor" stroke-width="13" stroke-linecap="round"></path><path d="M96.1 42.2 A 24 24 0 1 0 96.1 77.8" stroke="currentColor" stroke-width="13" stroke-linecap="round" opacity=".55"></path></svg>';
    var draw = function(){
      /* Only when there is something to press or follow (Ramy, 18 Oct 2026: "I
         can't really put it anywhere. The only thing I can click on is not
         now"): Chrome's own Install button, or Safari's and the iPhone's steps.
         Chrome that will not install, Firefox, or an app already installed:
         no card at all. */
      if (already || !(ios || macSafari || deferred)) { host.hidden = true; return; }
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
              : macSafari ? '<span>In Safari, choose <b>File</b>, then <b>Add to Dock</b>.</span>'
              : firefox ? '<span>Firefox cannot install it. Open this link in Chrome, Edge or Safari to install it.</span>'
              : noOffer ? '<span>This browser is not offering to install it here. That usually means Connect Lite is already installed on this ' + (/Android|Mobi/i.test(ua) ? 'phone' : 'computer') + ': look for it in your apps.</span>'
              : '<span>Checking whether this browser can install it\u2026</span>';
      host.innerHTML = '<span><b>Put Connect Lite on your ' + (ios ? 'phone' : 'phone or computer') + '.</b> It opens like an app and remembers your link.</span>' + how + '<button type="button" class="dismiss">Not now</button>';
      var b = host.querySelector('.btn-install'); if (b) b.addEventListener('click', function(){ if (!deferred) return; deferred.prompt(); deferred.userChoice.then(function(r){ if (r && r.outcome === 'accepted') installed(); }); });
      host.querySelector('.dismiss').addEventListener('click', fold);
    };
    var fold = function(){ try { localStorage.setItem('chub:installHintDone', String(Date.now())); } catch (e) {} folded = true; draw(); };
    var installed = function(){ try { localStorage.setItem('chub:installHintDone', 'installed'); } catch (e) {} host.hidden = true; };
    window.addEventListener('beforeinstallprompt', function(e){ e.preventDefault(); G.deferred = deferred = e; if (!folded) draw(); });
    window.addEventListener('appinstalled', installed);
    try {
      if (navigator.getInstalledRelatedApps) navigator.getInstalledRelatedApps().then(function(apps){ if (apps && apps.length) { G.already = already = true; if (!folded) draw(); } }, function(){});
    } catch (e) {}
    draw();
    /* Chrome fires beforeinstallprompt within a moment of loading when it
       will install; silence after that means it will not, here. */
    if (!ios && !macSafari && !firefox) setTimeout(function(){ if (!G.deferred && !G.already) { noOffer = true; if (!folded) draw(); } }, Math.max(0, 3500 - (Date.now() - G.t0)));
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
    + '<span style="width:30px;height:30px;border-radius:7px;background:#f8f6f1;box-shadow:inset 0 0 0 1px oklch(85% 0.02 80);display:inline-flex;align-items:center;justify-content:center;">'
    + '<svg viewBox="8 28 104 64" width="20" height="12" fill="none">'
    + '<path d="M56.1 42.2 A 24 24 0 1 0 56.1 77.8" stroke="#a8803f" stroke-width="13" stroke-linecap="round"></path>'
    + '<path d="M96.1 42.2 A 24 24 0 1 0 96.1 77.8" stroke="#2b2218" stroke-width="13" stroke-linecap="round"></path>'
    + '</svg></span>'
    + '<span style="position:relative;display:inline-block;">'
    + '<span style="font-family:Instrument Serif,Georgia,serif;font-style:italic;font-size:21px;line-height:0.85;color:oklch(63% 0.096 72);">Connect</span>'
    + '<span style="position:absolute;left:1px;top:100%;margin-top:2px;font-family:Instrument Sans,Karla,sans-serif;font-weight:600;font-size:8px;line-height:1;letter-spacing:0.24em;text-transform:uppercase;">Lite</span>'
    + '</span></div>'
    + '<h1 style="font-family:Newsreader,Georgia,serif;font-weight:700;font-size:1.9rem;line-height:1.2;margin:0 0 10px;">' + title + '</h1>'
    + '<p style="font-size:0.92rem;line-height:1.65;color:oklch(42% 0.02 68);margin:0 0 20px;">' + who + ' Nothing you change here would reach the course.</p>'
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
/* On a phone the dictation language reads UK / US / AU, so the pill, the
   language and Dictate fit on one row above the bar (10 Oct 2026). The full
   name stays as the option's title. The bar is built by each screen's own
   script, which has run by hub:ready. */
(function(){
  function shorten(){
    try { if (!window.matchMedia || !matchMedia('(max-width:560px)').matches) return; } catch (e) { return; }
    var SHORT = { 'en-GB':'UK', 'en-US':'US', 'en-AU':'AU' };
    document.querySelectorAll('.dictbar select option').forEach(function(o){ if (SHORT[o.value] && o.textContent !== SHORT[o.value]) { o.title = o.textContent; o.textContent = SHORT[o.value]; } });
    var sel = document.querySelector('.dictbar select'); if (sel) sel.setAttribute('aria-label', 'Dictation language');
  }
  document.addEventListener('hub:ready', function(){ shorten(); setTimeout(shorten, 0); });
})();
window.hubReserveForBar = function(selector){
  var bar = document.querySelector(selector || '.actionbar');
  if (!bar) return;
  var GAP = 28;
  function fit(){
    var h = 0;
    try { h = getComputedStyle(bar).position === 'fixed' ? bar.getBoundingClientRect().height : 0; } catch(e){ return; }
    if (h > 0) {
      var root = document.documentElement;
      /* The sync pill is fixed to the bottom-left corner, which on a screen
         with an action bar is underneath it -- and on the plan, on top of
         Turn in (23 Sep 2026). It rides above the bar instead. */
      root.style.setProperty('--sync-bottom', Math.ceil(h + 14) + 'px');
      /* The reserve clears whatever floats above the bar, measured where it
         actually sits once --sync-bottom is set: the dictation controls and
         the sync pill. Worked out by width before -- the phone's row was
         counted and a tablet's was not, so on an iPad in Chrome, Dictate sat
         on the last line of the page, the credit (10 Oct 2026; the phone
         case was walk-with-data.mjs, 6 Oct). */
      var need = h + GAP;
      try {
        var vh = window.innerHeight;
        [document.querySelector('.dictbar'), document.getElementById('hubSync')].forEach(function(el){
          if (!el) return;
          var r = el.getBoundingClientRect(); if (!r.height) return;
          if (el.id === 'hubSync' && getComputedStyle(el).opacity === '0') return;
          need = Math.max(need, vh - r.top + 14);
        });
      } catch (e) {}
      root.style.setProperty('--bar-reserve', Math.ceil(need) + 'px');
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
/* AN ASSIGNMENT WITH ONLY A DEADLINE (10 Oct 2026). The timetable's import
   from a sheet wrote {title, due} for an assignment the course had no wording
   for yet, and every page treated that as the course's wording: the wording
   editor and the trainee's submission page threw on the missing criteria, and
   the standard wording never filled in. An assignment that has no sections or
   no criteria takes them from the standard wording here; whatever the course
   did set (its title, its deadline, its release) stays. Nothing is written
   back; the next save from the wording editor carries it to the store. */
/* A DEADLINE PER TEACHING SET (10 Oct 2026). Ramy: "what we're going to do is
   identical to C18" -- and on C/18 the LRT is due Monday for DEF and Tuesday
   for ABC, because nobody hands in on a day they teach. An assignment may
   carry `dueSets`, { '<group>': [first set's instant, second set's] }; an
   empty entry falls back to the assignment's own deadline. An extension still
   sits on top of whichever applies (HubDue.forPerson).

   hubSetIndexOf: which teaching set a trainee is in -- 0 or 1 -- read from
   the sets the TP points screen stored when it dealt the rotation, which is
   what a trainee's own page holds too; failing that, worked out from the
   roster the way the rotation does. -1 when it cannot be told. */
window.hubSetIndexOf = function(token, group){
  var g = String(group == null ? '' : group);
  try {
    var pts = JSON.parse(localStorage.getItem('connect_tp_points_v1') || 'null');
    /* a tutor's record keys the sets by group; the copy a trainee is handed
       carries only their own group's, as a bare list */
    var sets = pts && pts.sets && (Array.isArray(pts.sets) ? pts.sets : pts.sets[g]);
    if (sets && sets.length) for (var i = 0; i < sets.length; i++) if ((sets[i] || []).indexOf(token) >= 0) return i;
  } catch (e) {}
  try {
    var roster = JSON.parse(localStorage.getItem('connect_roster_v1') || 'null');
    var people = Object.values((roster && roster.trainees) || {}).filter(function(t){ return t && String(t.group || '') === g; })
      .map(function(t){ return { token: t.id || t.token, name: t.name }; });
    if (people.length && window.hubRotation) {
      var ss = window.hubRotation.setsFor(people);
      for (var j = 0; j < ss.length; j++) if (ss[j].some(function(p){ return p.token === token; })) return j;
    }
  } catch (e) {}
  return -1;
};
/* The deadline that applies to one trainee before any extension. */
window.hubDueFor = function(a, token, group){
  if (!a) return '';
  var base = a.dueAt || a.due || '';
  var g = a.dueSets && a.dueSets[String(group == null ? '' : group)];
  if (!g) return base;
  var i = window.hubSetIndexOf(token, group);
  return (i >= 0 && g[i]) || base;
};
/* ONE DEADLINE, TWO NAMES (10 Oct 2026). The assignment screens -- the wording
   editor, the trainee's submission, marking, the tracker -- keep a deadline as
   `dueAt` (24 Sep); the timetable, the dashboard's deadline strip and the demo
   seed as `due` (29 Sep). Neither saw the other's: a deadline moved on the
   timetable never reached the trainee, and one set in the wording editor never
   showed on the timetable. Every writer now sets both; here, a course that
   holds only one has the other filled from it, so every reader agrees. */
window.hubWordingFilled = function(w){
  var D = window.CONNECT_HUB_DEFAULT_WORDING;
  if (!w || typeof w !== 'object') return w;
  Object.keys(w).forEach(function(k){
    var a = w[k];
    if (a && typeof a === 'object') {
      if (a.dueAt == null && a.due != null) a.dueAt = a.due;
      else if (a.due == null && a.dueAt != null) a.due = a.dueAt;
    }
  });
  if (!D) return w;
  Object.keys(w).forEach(function(k){
    var a = w[k], d = D[k];
    if (!a || typeof a !== 'object' || !d) return;
    if (Array.isArray(a.criteria) && Array.isArray(a.sections)) return;
    var full = JSON.parse(JSON.stringify(d));
    Object.keys(a).forEach(function(f){ if (a[f] != null) full[f] = a[f]; });
    if (!Array.isArray(full.criteria)) full.criteria = JSON.parse(JSON.stringify(d.criteria || []));
    if (!Array.isArray(full.sections)) full.sections = JSON.parse(JSON.stringify(d.sections || []));
    w[k] = full;
  });
  return w;
};

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
    /* THE COURSE'S OWN SESSION (11 Oct 2026). This assumed Lite's default
       first day -- the third TP slot, "the unassessed teaching slot". C/18's
       is Student interviews at that hour, and its getting-to-know-you with the
       students on Day 1 is that ("the interview is in a way our getting to know
       you activity ... we're just going by what's on the timetable"). So the
       first session in the course called getting to know you, GTKY or
       interview wins, in the timetable's own words -- never the orientation's
       GTKY, which is the trainees meeting each other -- then a first day's
       "unassessed" slot, then the default words. */
    var gt = null;
    (T.days || []).some(function(dd){ return (dd && !dd.closed && Array.isArray(dd.sessions) ? dd.sessions : []).some(function(x){
      var t = String(x && x.t || '');
      /* a session with the students, never an input ("jobs and interviews") */
      if (/^(input|plan|feedback|reflect|task|break|lunch)$/.test(String(x && x.k || ''))) return false;
      if (/getting to know|gtky|interview/i.test(t) && !/orientation|welcome/i.test(t)) { gt = { day: dd, s: x }; return true; }
      return false; }); });
    if (!gt && day && Array.isArray(day.sessions)) { var un = day.sessions.filter(function(x){ return x && /unassessed/i.test(String(x.t || '')); })[0]; if (un) gt = { day: day, s: un }; }
    if (gt) day = gt.day;
    var at = gt ? gt.s : null;
    var m = day && String(day.date || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) {
      var d = new Date(+m[1], +m[2] - 1, +m[3]);
      var name = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
      var from = at ? at.s : (slot && slot.from);
      out.when = 'on ' + name + (from ? ' at ' + window.hubClock(from) : '');
      out.fromTimetable = true;
    } else out.when = 'on the first day of the course';
    out.slot = at ? String(at.t) : 'the unassessed teaching slot';
  }
  return out;
};
/* THE CLOCK, the course's choice (Ramy, 10 Oct 2026: "two options for the
   clock ... the course admin can decide if they want to go with the 24 or the
   12-hour clock"). Course admin, Clock: 12-hour, the default since 8 Oct
   ("I'm really bad with the 24-hour clock"), or 24-hour. Times are stored as
   HH:MM either way; this is only how they read. 12-hour: "9:05 AM", "1:30 PM",
   and a range shares its AM or PM when both ends are in the same half:
   "1:30–2:15 PM". 24-hour: "09:05", "13:30", "13:30–14:15". */
window.hubClockIs24 = function(){
  try { var cs = JSON.parse(localStorage.getItem('connect_course_settings') || '{}') || {}; return String(cs.clock || '') === '24'; }
  catch (e) { return false; }
};
window.hubClock = function(hhmm){
  var m = String(hhmm || '').match(/^(\d{1,2}):(\d{2})/); if (!m) return String(hhmm || '');
  var h = +m[1], mm = m[2];
  if (window.hubClockIs24()) return (h < 10 ? '0' : '') + h + ':' + mm;
  var pm = h >= 12, h12 = h % 12 || 12;
  return h12 + ':' + mm + ' ' + (pm ? 'PM' : 'AM');
};
window.hubClockRange = function(a, b){
  var A = window.hubClock(a), B = window.hubClock(b); if (!A) return B; if (!B) return A;
  if (window.hubClockIs24()) return A + '\u2013' + B;
  var sa = A.slice(-2), sb = B.slice(-2);
  return (sa === sb ? A.slice(0, -3) : A) + '\u2013' + B;
};
/* THE INPUT TUTORS' COLOURS (Ramy, 10 Oct 2026: "what if there are four
   different tutors doing input sessions?" -- build the picker). Eight colours,
   and none of them is one that already means something on the board: teal is
   an input with no tutor, gold teaching practice, amber a plan not in, garnet
   a lesson not to standard. The first four are the board's colours since 30
   Sep, unchanged. Course admin may pick one per tutor (settings.tutorColours,
   name -> palette index); a tutor nobody picked for takes the next colour
   nobody has, so up to eight tutors never share one. */
window.HUB_TUTOR_COLOURS = [
  /* Solid, under the workbook (20 Oct 2026): a tutor's colour is a full
     fill with cream type, like every other tile. Coral, not orange (10 Oct
     2026): the orange sat beside teaching practice, and a tutor's colour
     must never read as TP, which is now the red. */
  { name: 'Coral',  bg: 'oklch(52% 0.14 32)',  bd: 'oklch(52% 0.14 32)',  fg: '#F0EEE9' },
  { name: 'Blue',   bg: 'oklch(46% 0.1 250)',  bd: 'oklch(46% 0.1 250)',  fg: '#F0EEE9' },
  { name: 'Green',  bg: 'oklch(44% 0.08 150)', bd: 'oklch(44% 0.08 150)', fg: '#F0EEE9' },
  { name: 'Purple', bg: 'oklch(45% 0.09 320)', bd: 'oklch(45% 0.09 320)', fg: '#F0EEE9' },
  { name: 'Pink',   bg: 'oklch(50% 0.12 355)', bd: 'oklch(50% 0.12 355)', fg: '#F0EEE9' },
  { name: 'Olive',  bg: 'oklch(46% 0.08 115)', bd: 'oklch(46% 0.08 115)', fg: '#F0EEE9' },
  { name: 'Indigo', bg: 'oklch(44% 0.12 280)', bd: 'oklch(44% 0.12 280)', fg: '#F0EEE9' },
  { name: 'Sky',    bg: 'oklch(48% 0.1 230)',  bd: 'oklch(48% 0.1 230)',  fg: '#F0EEE9' }
];
/* THE COURSE'S TUTORS, from both lists on Course admin (10 Oct 2026). Ramy
   added Narges under "Add a tutor" and the timetable never knew her: it read
   only the signatures field. The signatures come first, in their order (an
   input tile names its tutor by place in this list, so the order must not
   move); anyone in the contacts who is not already there follows. */
window.hubTutorNames = function(cs){
  cs = cs || {};
  var out = [];
  var add = function(n){ n = String(n || '').trim(); if (n && !out.some(function(x){ return x.toLowerCase() === n.toLowerCase(); })) out.push(n); };
  String(cs.tutorNames || '').split(/[,\n;]+/).forEach(add);
  (Array.isArray(cs.tutorContacts) ? cs.tutorContacts : []).forEach(function(c){ if (c) add(c.name); });
  return out;
};
/* Every tutor's colour, in the order the names are typed. */
window.hubTutorColours = function(names, chosen){
  var P = window.HUB_TUTOR_COLOURS.length, pick = chosen && typeof chosen === 'object' ? chosen : {};
  var out = [], taken = {};
  (names || []).forEach(function(n, i){ var c = pick[n]; if (c !== undefined && c !== '' && +c >= 0 && +c < P) { out[i] = +c; taken[+c] = true; } });
  /* Everyone else keeps their usual colour (their place in the list) unless a
     chosen one took it; only then do they move, to the first colour free. So
     choosing orange for one tutor swaps two colours instead of moving everyone. */
  (names || []).forEach(function(n, i){ if (out[i] === undefined && i < P && !taken[i]) { out[i] = i; taken[i] = true; } });
  (names || []).forEach(function(n, i){
    if (out[i] !== undefined) return;
    var c = 0; while (c < P && taken[c]) c++;
    if (c >= P) c = i % P;
    out[i] = c; taken[c] = true;
  });
  return out;
};
/* A moment (a Date, milliseconds or ISO) on the course's clock: "2:32 PM" or
   "14:32". Every "saved at", "posted at" and "due at" goes through here, so a
   course on the 24-hour clock never meets a stray AM or PM. */
window.hubTimeOf = function(when, timeZone){
  var d = when instanceof Date ? when : new Date(when); if (isNaN(d)) return '';
  var h24 = window.hubClockIs24();
  var o = h24 ? { hour: '2-digit', minute: '2-digit', hour12: false } : { hour: 'numeric', minute: '2-digit', hour12: true };
  if (timeZone) o.timeZone = timeZone;
  try { return d.toLocaleTimeString(h24 ? 'en-GB' : 'en-US', o); } catch (e) { return ''; }
};
/* THE DAY'S SHAPE FOR A DATE (9 Oct 2026). A timetable has one usual day
   (`slots`) and may have more shapes (`shapes`), each used from a date, on
   certain weekdays, or both: C/18's teaching practice moves from 3 PM to 2 PM
   from 26 Oct (Ramy: "the second half of the course is changing the time"),
   and a part-time course can have a long Saturday and a short Tuesday. The
   most particular shape wins: one tied to weekdays beats one that is not, then
   the later start date, then the later one in the list. Every page that reads
   a time off the timetable asks this, so they all agree. */
window.hubShapeFor = function(tt, dateISO){
  var T = tt || {}, m = String(dateISO || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  var dow = m ? new Date(+m[1], +m[2] - 1, +m[3]).getDay() : -1, iso = m ? m[0] : '';
  var best = null, bestKey = '';
  (Array.isArray(T.shapes) ? T.shapes : []).forEach(function(sh, i){
    if (!sh || !Array.isArray(sh.slots) || !sh.slots.length) return;
    if (sh.from && (!iso || iso < sh.from)) return;
    var days = Array.isArray(sh.days) ? sh.days : [];
    if (days.length && days.indexOf(dow) === -1) return;
    if (!sh.from && !days.length) return;          // a shape used nowhere
    var key = (days.length ? '1' : '0') + (sh.from || '0000-00-00') + ('000' + i).slice(-4);
    if (key > bestKey) { bestKey = key; best = sh; }
  });
  return best;
};
/* Since stage 1 of the timetable system (9 Oct 2026) a day keeps its own
   SESSIONS, each with a kind and its own times. This hands them to the rest of
   Lite as slots, so every page that asks "what are this day's times?" gets
   the day's own answer without knowing the new shape. */
window.hubSessionSlots = function(sessions){
  var KIND = { input:'input', tp:'tp', demo:'event', assessor:'event', plan:'plan', feedback:'feedback', reflect:'feedback', prep:'prep', 'break':'break', lunch:'break', event:'event', task:'task' };
  var LABEL = { input:'Input', tp:'Teaching practice', plan:'Lesson planning', feedback:'TP feedback', reflect:'Reflection', 'break':'Break', lunch:'Lunch', demo:'', assessor:'', event:'', task:'' };
  return (sessions || []).filter(function(x){ return x && x.s && x.e; }).slice().sort(function(a, b){ return a.s < b.s ? -1 : a.s > b.s ? 1 : 0; })
    .map(function(x){ return { key: x.id, from: x.s, to: x.e, kind: KIND[x.k] || 'event', label: x.t || LABEL[x.k] || '', room: x.room || (x.k === 'tp' ? 'Teaching practice' : x.k === 'input' ? 'Input' : '') }; });
};
window.hubSlotsFor = function(tt, dateISO){
  var T = tt || {}, iso = String(dateISO || '').slice(0, 10), days = Array.isArray(T.days) ? T.days : [];
  for (var i = 0; i < days.length; i++) if (days[i] && days[i].date === iso && Array.isArray(days[i].sessions)) return window.hubSessionSlots(days[i].sessions);
  var sh = window.hubShapeFor(T, dateISO);
  return sh ? sh.slots : (Array.isArray(T.slots) ? T.slots : []);
};
/* The assessment date, one fact in two places (Ramy, 17 Oct 2026: "having it
   in the timetable is not enough. It has to be here as well."). Course admin's
   date wins when it is typed; left empty, the day of the timetable's Assessor
   tile stands in, so a course that only put the visit on the timetable still
   tells the assessor when. Only days the tutors placed tiles on count -- a
   course shape is a default, not a visit. */
window.hubAssessorDayFromTimetable = function(tt){
  var days = (tt && Array.isArray(tt.days)) ? tt.days : [], found = '';
  days.forEach(function(d){
    if (!d || !d.date || !Array.isArray(d.sessions)) return;
    /* The raw tile kind: as slots, an Assessor tile becomes a general event. */
    if (d.sessions.some(function(x){ return x && x.k === 'assessor'; }) && (!found || d.date < found)) found = String(d.date).slice(0, 10);
  });
  return found;
};
window.hubVisitDate = function(settings, tt){
  var typed = String((settings && settings.visitDate) || '').slice(0, 10);
  if (typed) return { date: typed, from: 'admin' };
  var t = window.hubAssessorDayFromTimetable(tt);
  return t ? { date: t, from: 'timetable' } : null;
};
/* Which weekdays the course meets on (0 = Sunday). Full-time is Monday to
   Friday, the default; a part-time course ticks only its own days. */
window.hubMeets = function(tt){
  var m = tt && Array.isArray(tt.meets) ? tt.meets.filter(function(n){ return n >= 0 && n <= 6; }) : [];
  return m.length ? m : [1, 2, 3, 4, 5];
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
/* Switched off, an assignment can still have a time it opens by itself
   (`releaseFrom`, an instant; Ramy, 17 Oct 2026: "where do I set the dates for
   the assignments to be released?"). From that moment the trainees see it, on
   the course's clock (hubNow, so the demo's pinned day counts too). */
window.hubReleased = function(wording, key){
  var x = wording && wording[key];
  if (!x || x.released !== false) return true;
  if (x.releaseFrom) {
    var t = Date.parse(x.releaseFrom), now = window.hubNow ? window.hubNow() : Date.now();
    if (!isNaN(t) && now >= t) return true;
  }
  return false;
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

  /* A passage attached to the record (10_, 25 Oct 2026) is marked where it sits in the text.
     The text is escaped first, so the quote is matched escaped; a long quote is matched on its
     first sixty characters when the whole of it does not sit on one line. */
  function markFlags(html, flags){
    (flags || []).forEach(function (f) {
      var q = esc(String(f.quote || '').trim()); if (q.length < 12) return;
      var at = html.indexOf(q), len = q.length;
      if (at < 0) { var head = esc(String(f.quote).trim().slice(0, 60)); at = html.indexOf(head); len = head.length; if (at < 0 || head.length < 12) return; }
      html = html.slice(0, at) + '<mark class="flag">' + html.slice(at, at + len) + '</mark>' + html.slice(at + len);
    });
    return html;
  }
  function submissionHTML(a, snap, flags){
    if (!snap) return '<p class="readonly">Nothing submitted.</p>';
    let out = '';
    /* The materials link the trainee gave, first, so a marker or an assessor
       reading the record can open what the writing refers to (24 Sep 2026). */
    var ml = (snap && snap.materialsLink || '').trim();
    if (ml) out += '<p style="margin:0 0 10px;"><a href="' + esc(ml) + '" target="_blank" rel="noopener" style="display:inline-block;font-size:0.78rem;font-weight:700;padding:5px 12px;border-radius:16px;background:oklch(37.5% 0.058 195);color:#fff;text-decoration:none;">Open the materials \u2197</a></p>';
    a.sections.forEach((s,i) => {
      if (s.type==='text' && !/before you start/i.test(s.label) && snap.text && snap.text[i]) {
        out += `<div class="roundlabel">${esc(s.label)}</div><div class="readonly">${markFlags(nl2br(snap.text[i]), flags)}</div>`;
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
      + '<div class="section"><h2>First submission</h2>' + submissionHTML(a, sub.sub1, (sub.flags || {}).sub1) + '</div>';
    if (sub.sub2) html += '<div class="section"><h2>Resubmission</h2>' + submissionHTML(a, sub.sub2, (sub.flags || {}).sub2) + '</div>';
    /* PASSAGES FOUND ELSEWHERE (Ramy, 25 Oct 2026): what the tutor attached from the own-work check
       goes back with the assignment, for the trainee and the assessor alike. Each is marked in the
       text above and listed here with where it was found: a course and a centre, or a web page,
       never a person. The warning letter stays the letter. */
    var FL = sub.flags || {}, fl = function (r) { return (FL[r] || []).filter(Boolean); };
    if (fl('sub1').length || fl('sub2').length) {
      var where = function (f) {
        var code = String(f.code || '').toUpperCase();
        if (f.kind === 'web') return 'Found on the web: <a href="' + esc(f.link || '') + '" target="_blank" rel="noopener">' + esc(f.title || f.link || '') + '</a>';
        if (f.kind === 'paraphrase') return 'Says the same, in other words, as a passage in ' + esc(f.course || 'another course') + (f.centre ? ' (' + esc(f.centre) + ')' : '') + (code ? ', ' + esc(code) : '') + (f.pair ? ': <em>\u201C' + esc(f.pair) + '\u201D</em>' : '') + (f.note ? ' \u2014 ' + esc(f.note) : '');
        return 'Also in ' + (code ? esc(code) + ' ' : '') + 'on ' + esc(f.course || 'another course') + (f.centre ? ' (' + esc(f.centre) + ')' : '') + (f.round === 'sub2' ? ', the resubmission' : '') + (f.pct ? ' \u00b7 ' + f.pct + '% of this text shared' : '');
      };
      var whenF = function (iso) { if (!iso) return ''; var d = new Date(iso); return isNaN(d) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); };
      html += '<div class="section flags"><h2>Passages found elsewhere</h2><p class="readonly" style="white-space:normal;">Marked in the text above. Attached by the tutors from the own-work check; the centre\u2019s plagiarism policy in the candidate agreement says what follows.</p>' + ['sub1', 'sub2'].map(function (r) {
        var l = fl(r); if (!l.length) return '';
        return (sub.sub2 ? '<div class="roundlabel">' + (r === 'sub1' ? 'In the first submission' : 'In the resubmission') + '</div>' : '') +
          l.map(function (f) { return '<div class="comment"><em>\u201C' + esc(f.quote) + '\u201D</em><br>' + where(f) + ((f.by || f.at) ? ' <span style="color:#777;">(' + esc([f.by, whenF(f.at)].filter(Boolean).join(', ')) + ')</span>' : '') + '</div>'; }).join('');
      }).join('') + '</div>';
    }
    html += '<div class="section"><h2>Assessment criteria</h2>'
      + criteriaTable(a, marks.sub1 || [], marks.sub2 || [], comments.sub1 || [], comments.sub2 || [], !!sub.sub2) + '</div>';
    /* The tutors' comments on the text itself (17 Oct 2026): what each one
       was about, in the trainee's words, then the comment. Empty ones never
       reach the record. */
    var mg = sub.margin || {};
    var mList = function (r) { return (mg[r] || []).filter(function (c) { return c && (c.text || (c.tick && c.quote)); }); };
    if (mList('sub1').length || mList('sub2').length) {
      html += '<div class="section"><h2>Comments on the text</h2>' + ['sub1', 'sub2'].map(function (r) {
        var l = mList(r); if (!l.length) return '';
        return (sub.sub2 ? '<div class="roundlabel">' + (r === 'sub1' ? 'On the first submission' : 'On the resubmission') + '</div>' : '') +
          l.map(function (c) { if (c.tick) return '<div class="comment">\u2713' + ((c.n || 1) > 1 ? ' \u00d7' + c.n : '') + ' <em>\u201C' + esc(c.quote) + '\u201D</em>' + (c.by ? ' <span style="color:#777;">(' + esc(c.by) + ')</span>' : '') + '</div>'; return '<div class="comment">' + (c.crit != null && c.crit !== '' ? '<span style="font-size:11px; letter-spacing:.06em; text-transform:uppercase; color:#777;">Criterion ' + (+c.crit + 1) + '</span><br>' : '') + (c.quote ? '<em>\u201C' + esc(c.quote) + '\u201D</em><br>' : '') + nl2br(c.text) + (c.by ? ' <span style="color:#777;">(' + esc(c.by) + (c.role === 'second' ? ', second marker' : '') + ')</span>' : '') + '</div>'; }).join('');
      }).join('') + '</div>';
    }
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
      + '</p>' + (function () {
        /* Double marking is not blind: the second marker saw the first's marks
           and agreed or disagreed with each (17 Oct 2026). */
        var sec = sub.second || {}, out = '';
        ['sub1', 'sub2'].forEach(function (r) {
          var x = sec[r]; if (!x || !x.crit) return;
          var n = (a.criteria || []).length, keys = Object.keys(x.crit).filter(function (i) { return typeof x.crit[i].agree === 'boolean'; });
          var dis = keys.filter(function (i) { return x.crit[i].agree === false; });
          out += '<p class="readonly">' + (sec.sub1 && sec.sub2 ? (r === 'sub1' ? 'First submission: ' : 'Resubmission: ') : '') + esc(x.by || 'The second marker') + ' agreed with ' + (keys.length - dis.length) + ' of ' + n + ' marks' + (dis.length ? '; disagreed on criterion ' + dis.map(function (i) { return +i + 1; }).join(' and ') : '') + '.' +
            dis.map(function (i) { return x.crit[i].note ? '<br>' + (+i + 1) + ': ' + esc(x.crit[i].note) : ''; }).join('') + '</p>';
        });
        return out;
      })() + '</div>';
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
  /* A DATE, AS THE DAY IT NAMES (10 Oct 2026). A course's start and end and a
     TP's date are stored as bare dates, "2026-03-02", and new Date() reads a
     bare date as midnight in London: anywhere west of London that is still
     the evening before, so a course starting 2 March read "1 March" on the
     course record, the dashboard and the CELTA 5. A bare date is read here as
     that day wherever the reader is; anything with a time is left as it is. */
  window.hubDateOf = function(s){
    var m = String(s == null ? '' : s).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date(s);
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
    /* `local` is HH:MM on the 24-hour clock, like `course`, so the two
       compare and a page formats both the same way (hubClock). It was handed
       back already formatted ("4:30 PM"), and the volunteer's page formatted
       it again: hubClock read the "4:30" and printed "4:30 AM" for a class at
       half past four in the afternoon (10 Oct 2026). */
    var local;
    try {
      var parts = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: reader }).formatToParts(new Date(inst));
      var hh = (parts.find(function(x){ return x.type === 'hour'; }) || {}).value, mi = (parts.find(function(x){ return x.type === 'minute'; }) || {}).value;
      if (!hh || !mi) return out;
      local = hh + ':' + mi;
    } catch (e) { return out; }
    var pad = function(x){ var m = String(x).match(/^(\d{1,2}):(\d{2})/); return m ? (m[1].length < 2 ? '0' : '') + m[1] + ':' + m[2] : String(x); };
    out.local = local;
    out.differs = local !== pad(out.course);
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
  /* On a phone or tablet flatpickr keeps the native picker by adding a box of
     its own (.flatpickr-mobile) -- itself a date box. Dressing that one adds
     another, and the observer below dresses that: on every iPhone, iPad and
     Android the page locked up the moment it showed a date (10 Oct 2026, the
     tablet check, lesson plan). Its own boxes are never dressed. */
  function wanted(el){ return el && el.tagName === 'INPUT' && (el.type === 'date' || el.type === 'datetime-local' || el.type === 'time') && !el._fp && !el.disabled && !el.classList.contains('flatpickr-mobile'); }
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
/* THE CREDIT (the rule, Ramy 19 Oct 2026): the logo alone, then "designed and
   built by" in the quiet bronze, then Ramy in gold. Nothing between the logo
   and the credit -- the product's name lives on top, never in this line. */
window.hubMark = function(size){
  var s = size || 18;
  return '<span class="hub-lockup"><span class="hub-lockup-tile" style="width:' + s + 'px;height:' + s + 'px;border-radius:' + Math.round(s * 0.23) + 'px">'
    + '<svg viewBox="8 28 104 64" width="' + Math.round(s * 0.66) + '" height="' + Math.round(s * 0.4) + '" fill="none" aria-hidden="true">'
    + '<path d="M56.1 42.2 A 24 24 0 1 0 56.1 77.8" stroke="#a8803f" stroke-width="13" stroke-linecap="round"></path>'
    + '<path d="M96.1 42.2 A 24 24 0 1 0 96.1 77.8" stroke="#2b2218" stroke-width="13" stroke-linecap="round"></path></svg></span></span>';
};
/* The turning mark, for anything Lite is waiting on (21 Oct 2026). */
window.hubSpinner = function(size){
  var s = size || 18;
  return '<span class="hub-spin hub-lockup-tile" style="width:' + s + 'px;height:' + s + 'px;border-radius:' + Math.round(s * 0.23) + 'px;background:#f8f6f1;box-shadow:inset 0 0 0 1px oklch(85% 0.02 80)" aria-hidden="true">'
    + '<svg viewBox="8 28 104 64" width="' + Math.round(s * 0.66) + '" height="' + Math.round(s * 0.4) + '" fill="none">'
    + '<path d="M56.1 42.2 A 24 24 0 1 0 56.1 77.8" stroke="#a8803f" stroke-width="13" stroke-linecap="round"></path>'
    + '<path d="M96.1 42.2 A 24 24 0 1 0 96.1 77.8" stroke="#2b2218" stroke-width="13" stroke-linecap="round"></path></svg></span>';
};
window.hubCredit = function(size){ return window.hubMark(size || 16) + '<span class="hub-cred">designed and built by <b>Ramy</b></span>'; };
window.hubLockup = function(size){
  var s = size || 18;
  return '<span class="hub-lockup"><span class="hub-lockup-tile" style="width:' + s + 'px;height:' + s + 'px;border-radius:' + Math.round(s * 0.23) + 'px">'
    + '<svg viewBox="8 28 104 64" width="' + Math.round(s * 0.66) + '" height="' + Math.round(s * 0.4) + '" fill="none" aria-hidden="true">'
    + '<path d="M56.1 42.2 A 24 24 0 1 0 56.1 77.8" stroke="#a8803f" stroke-width="13" stroke-linecap="round"></path>'
    + '<path d="M96.1 42.2 A 24 24 0 1 0 96.1 77.8" stroke="#2b2218" stroke-width="13" stroke-linecap="round"></path></svg></span>'
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
      + ".hub-lockup-tile{display:inline-flex; align-items:center; justify-content:center; flex:none; background:#f8f6f1; box-shadow:inset 0 0 0 1px oklch(85% 0.02 80);}"
      + ".hub-lockup-c{font-family:'Instrument Serif',Georgia,serif; font-style:italic; font-size:17px; line-height:.85; color:oklch(63% 0.096 72);}"
      + ".hub-lockup-l{font-family:'Instrument Sans','Karla',sans-serif; font-weight:500; font-size:8px; letter-spacing:.24em; text-transform:uppercase; color:inherit; margin-left:-3px;}"
      + ".hub-brand-foot{display:flex; align-items:center; justify-content:center; gap:10px; flex-wrap:wrap; margin:28px auto 22px; padding:0 16px;"
      +   " font-family:'Karla',sans-serif; font-size:11px; color:oklch(50% 0.09 62);}"
      + ".hub-brand-foot .hub-lockup{color:var(--ink, oklch(23.5% 0.017 65));}"
      + ".hub-brand-foot b{font-weight:700;}"
      /* the name is gold, the words are not: everywhere the credit appears */
      + ".hub-credit b, .hub-brand-foot b, .hub-cred b, .credit .by b, .fp-foot b, .foot .hub-credit b, .tpcredit .hub-cred b{color:oklch(63% 0.096 72) !important; font-weight:700; opacity:1;}"
      + ".hub-cred{white-space:nowrap;}"
      /* the words quiet grey, so the gold name stands apart (as in Connect: muted words, Ramy in gold) */
      + ".hub-credit, .hub-brand-foot, .hub-cred, .credit .by, .fp-foot > span:first-child, .foot .hub-credit{color:oklch(42% 0.02 68) !important;}"
      /* the mark turns while Lite is waiting on something (Ramy, 21 Oct 2026:
         "every time there is a checking your link... the logo to spin, so
         people understand it's not stuck. Also, it looks cool"). The same
         turn the home's mark makes, quicker. */
      + "@keyframes hub-spin{from{transform:rotateY(0deg);}to{transform:rotateY(360deg);}}"
      + ".hub-spin{display:inline-flex; align-items:center; justify-content:center; flex:none; perspective:300px; vertical-align:middle;}"
      + ".hub-spin svg{animation:hub-spin 1.4s cubic-bezier(.45,.05,.55,.95) infinite; transform-origin:50% 50%;}"
      + "@media (prefers-reduced-motion: reduce){.hub-spin svg{animation-duration:3s;}}"
      + "@media print{.hub-brand-foot{display:none !important;}}";
    document.head.appendChild(c);
  }
  function foot(){
    var b = document.body; if (!b || b.dataset.brand === 'off') return;
    if (document.querySelector('.hub-brand-foot, .hub-credit, .credit, .fp-foot')) return;
    var f = document.createElement('footer'); f.className = 'hub-brand-foot';
    f.innerHTML = window.hubCredit(16);
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

/* SIGN OUT (15 Oct 2026). Ramy: "there is no sign out... I can't close the
   page", on a phone he opens many trainees' links on. A link is the login and
   the device remembers the last one opened, so on a shared phone or computer
   the next person lands in the last person's work. "They sign in with a PIN
   now, right?" -- yes, so this says what it is: Sign out. It sits top right in
   the header of the landing pages, beside the role label.

   What it does: asks once; sends anything not yet sent (the course keeps the
   work, and "clearing localStorage is a write" -- never silently drop an
   unsent draft); if something still has not reached the course, says so and
   makes the person choose; then forgets this device (the remembered link, the
   PIN, the cached course) and goes to the front page. The link itself still
   works: opening it again brings the person back. */
(function(){
  var KEEP_NOT = /^(hub|chub|connect)[:_]/;
  function pending(){
    try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && k.indexOf('hub:pending:') === 0) { var v = JSON.parse(localStorage.getItem(k) || '{}'); if (v && Object.keys(v).length) return true; } } } catch (e) {}
    return false;
  }
  function leave(){
    try { var gone = []; for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && KEEP_NOT.test(k)) gone.push(k); } gone.forEach(function(k){ localStorage.removeItem(k); }); } catch (e) {}
    try { sessionStorage.clear(); } catch (e) {}
    location.replace(/14_owner\.html$/.test(location.pathname) ? '14_owner.html' : 'index.html');
  }
  function ask(msg, label){ return window.confirmModal ? window.confirmModal(msg, label) : Promise.resolve(window.confirm(msg)); }
  window.hubSignOut = function(){
    ask('Sign out of Connect Lite on this device? Your work is saved on the course. Open your link again to come back.', 'Sign out').then(function(ok){
      if (!ok) return;
      var sent = (window.HubSync && HubSync.flushNow) ? HubSync.flushNow(true).catch(function(){}) : Promise.resolve();
      sent.then(function(){
        if (!pending()) { leave(); return; }
        ask('Some of your changes have not reached the course yet. If you sign out now, they are lost. Wait a moment and try again, or sign out and lose them.', 'Sign out and lose them').then(function(yes){ if (yes) leave(); });
      });
    });
  };
  /* Only where a link is held on this device: the front page a stranger sees
     has nothing to sign out of. */
  function signedIn(){ try { return !!(localStorage.getItem('hub:t') || localStorage.getItem('hub:k') || localStorage.getItem('hub:a') || localStorage.getItem('hub:v') || localStorage.getItem('hub:o')); } catch (e) { return false; } }
  /* A page with no header strip of its own (the assessor's pack, a volunteer's
     page) asks for the same control floated top right: body data-signout="float". */
  function mountFloat(){
    if (!signedIn() || document.body.dataset.signout !== 'float' || document.querySelector('.hub-signout')) return;
    var st = document.createElement('style'); st.id = 'hub-signout-float-css';
    st.textContent = '.hub-signout-float{position:absolute; top:14px; right:18px; z-index:60; font-family:inherit; font-size:.74rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--teal, #1f4f4c); background:none; border:0; padding:8px 0; cursor:pointer; text-decoration:underline; text-underline-offset:3px; text-decoration-color:var(--gold, #b8863f);} .hub-signout-float:hover{color:var(--ink, #2b2622);} @media print{.hub-signout-float{display:none !important;}}';
    document.head.appendChild(st);
    if (getComputedStyle(document.body).position === 'static') document.body.style.position = 'relative';
    var b = document.createElement('button'); b.type = 'button'; b.className = 'hub-signout hub-signout-float'; b.textContent = 'Sign out';
    b.addEventListener('click', window.hubSignOut); document.body.appendChild(b);
  }
  function mount(){
    if (!signedIn()) return;
    mountFloat();
    document.querySelectorAll('.chrome .role').forEach(function(role){
      if (role.dataset.signout === 'off' || role.parentNode.querySelector('.hub-signout')) return;
      if (!document.getElementById('hub-signout-css')) {
        var st = document.createElement('style'); st.id = 'hub-signout-css';
        st.textContent = '.hub-chrome-right{display:flex; align-items:center; gap:16px;}'
          + '.hub-signout{font-family:inherit; font-size:.74rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:var(--teal, #1f4f4c); background:none; border:0; padding:8px 0; cursor:pointer; text-decoration:underline; text-underline-offset:3px; text-decoration-color:var(--gold, #b8863f);}'
          + '.hub-signout:hover{color:var(--ink, #2b2622);}'
          + '@media print{.hub-signout{display:none !important;}}';
        document.head.appendChild(st);
      }
      var wrap = document.createElement('div'); wrap.className = 'hub-chrome-right';
      role.parentNode.insertBefore(wrap, role); wrap.appendChild(role);
      var b = document.createElement('button'); b.type = 'button'; b.className = 'hub-signout'; b.textContent = 'Sign out';
      b.addEventListener('click', window.hubSignOut); wrap.appendChild(b);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();

/* THE MARKING GUIDANCE (17 Oct 2026). Ramy: "do we have like a marking
   guidelines? Like we do with C18 on Classroom." Per assignment: a general
   note, one note per criterion (same order as the criteria) and a
   section-by-section note. It lives in its own course record that the store
   sends to the tutors and the assessor only -- never in the wording, which
   every trainee reads, and never in this public code: the defaults are kept
   in the store. Plain text; a line starting "• " is a bullet, a short line
   with no full stop followed by text is a heading. */
/* A course's criteria can be the syllabus's, the centre's own rows among them,
   or any list a tutor has made, so the guidance for a criterion is found by the
   criterion's WORDS, not its position (18 Oct 2026): each entry carries
   critText, the criterion it is for, and a criterion whose words begin with
   (or are begun by) another's counts as the same. A record with no critText is
   positional, as it always was. */
window.hubGuidanceCrit = function(x, criteria){
  var c = (x && x.crit) || [], t = x && x.critText;
  if (!t || !criteria) return c;
  var norm = function(v){ return String(v && v.text != null ? v.text : v).toLowerCase().replace(/[^a-z0-9]+/g, ''); };
  return criteria.map(function(cr){
    var n = norm(cr), k = t.findIndex(function(y){ var m = norm(y); return m === n || (Math.min(m.length, n.length) > 24 && (m.indexOf(n) === 0 || n.indexOf(m) === 0)); });
    return k >= 0 ? (c[k] || '') : '';
  });
};
window.hubGuidance = function(key){
  try {
    var g = JSON.parse(localStorage.getItem('connect_marking_guidance_v1') || 'null');
    var x = g && g.items && g.items[key];
    if (!x) return null;
    if (x.critText) {
      var w = JSON.parse(localStorage.getItem('connect_assignment_wording_v2') || 'null'), cr = w && w[key] && w[key].criteria;
      if (cr) x = Object.assign({}, x, { crit: hubGuidanceCrit(x, cr) });
    }
    return x.general || x.sections || (x.crit && x.crit.some(Boolean)) ? x : null;
  } catch (e) { return null; }
};
window.hubGuidanceHTML = function(text){
  var esc = function(s){ return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };
  return String(text || '').split(/\n{2,}/).map(function(block){
    /* "Quick:" lines are the marking bar's one-tap comments, not guidance to read */
    var lines = block.split('\n').filter(function(l){ return !/^Quick:/.test(l); }), out = '', list = [];
    var flush = function(){ if (list.length) { out += '<ul>' + list.map(function(l){ return '<li>' + esc(l) + '</li>'; }).join('') + '</ul>'; list = []; } };
    lines.forEach(function(l, i){
      if (/^\s*[•\-]\s+/.test(l)) { list.push(l.replace(/^\s*[•\-]\s+/, '')); return; }
      flush();
      var head = i === 0 && lines.length > 1 && l.length < 70 && !/[.:;]$/.test(l.trim());
      var m = l.match(/^(Met|Shortfalls|Meaning|Form|Pronunciation|Use|Problems|References|CCQs)(:)/);
      out += head ? '<h4>' + esc(l) + '</h4>' : '<p>' + (m ? '<b>' + esc(m[1]) + ':</b>' + esc(l.slice(m[0].length)) : esc(l)) + '</p>';
    });
    flush();
    return out;
  }).join('');
};

/* THE HIDDEN WORD (17 Oct 2026). Ramy, after the C/18 guides, which hide a
   word in white text in every section of each assignment file: "add the trap
   words to the assignments online... one word per assignment, and all
   different sections. And this word will be disclosed in the guidelines for
   each assignment." The word is wording[k].trap. On the trainee's page it is
   invisible -- transparent, 1px, no space taken -- and aria-hidden so a screen
   reader never says it; but it is real text, so copying the brief, or any
   tool that reads the page, carries it. The marking page looks for it in the
   submission and tells the tutor; the trainee is never told. It is a prompt to
   look closer, never proof. */
(function(){
  if (document.getElementById('hub-tw-css')) return;
  var st = document.createElement('style'); st.id = 'hub-tw-css';
  st.textContent = '.hub-tw{color:transparent !important; font-size:1px !important; line-height:0 !important; letter-spacing:0 !important; user-select:text; -webkit-user-select:text;} @media print{.hub-tw{color:#fff !important;}}';
  (document.head || document.documentElement).appendChild(st);
})();
window.hubTrapSpan = function(word){
  word = String(word || '').replace(/[^A-Za-z]/g, '');
  return word ? '<span class="hub-tw" aria-hidden="true"> ' + word + ' </span>' : '';
};
/* Every piece of writing in one submission round, as one string. */
window.hubSubmissionText = function(round){
  if (!round) return '';
  var out = [];
  var walk = function(v){ if (v == null) return; if (typeof v === 'string') out.push(v); else if (Array.isArray(v)) v.forEach(walk); else if (typeof v === 'object') Object.keys(v).forEach(function(k){ walk(v[k]); }); };
  walk(round.text); walk(round.fields); walk(round.links); walk(round.materials); walk(round.aiNote); walk(round.ai);
  return out.join('\n');
};
window.hubTrapFound = function(word, sub){
  word = String(word || '').replace(/[^A-Za-z]/g, '');
  if (!word || !sub) return false;
  var re = new RegExp('\\b' + word + '\\b', 'i');
  return [sub.sub1, sub.sub2].some(function(r){ return r && re.test(window.hubSubmissionText(r)); });
};
window.hubTrapNote = function(word){
  word = String(word || '').replace(/[^A-Za-z]/g, '');
  return word ? 'The hidden word for this assignment is ' + word + '. It is in every section of the brief: invisible on the page and in print, but anything that copies or reads the page’s text picks it up. If it appears in a trainee’s answer, the work was probably produced from a copy of the brief rather than from the brief as read. Treat it as a prompt to look more closely at how the work was produced, and follow the centre’s usual process rather than acting on it alone. Lite checks every submission for it and tells you on the marking page.' : '';
};
/* Words for the hidden word: odd enough never to turn up in a CELTA
   assignment on their own, none of them the C/18 files' words. */
window.HUB_TRAP_WORDS = ['PELICAN','TAMBOURINE','PAPRIKA','ARMADILLO','HARMONICA','NUTMEG','ACCORDION','PISTACHIO','WALRUS','MANDOLIN','TOUCAN','CARDAMOM','OCARINA','CHINCHILLA','PERSIMMON','XYLOPHONE','MONGOOSE','TAPIOCA','BASSOON','QUINCE','PLATYPUS','SAFFRON','CORMORANT','BANJO','LORIKEET','TAMARIND','UKULELE','WOMBAT','KOHLRABI','CASTANET','NARWHAL','RHUBARB','DIDGERIDOO','AARDVARK','GOOSEBERRY','PICCOLO','IGUANA','PARSNIP','TRUMPETER','MARMOSET'];
window.hubPickTrap = function(taken){
  var t = {}; (taken || []).forEach(function(w){ if (w) t[String(w).toUpperCase()] = 1; });
  var free = window.HUB_TRAP_WORDS.filter(function(w){ return !t[w]; });
  var a = new Uint32Array(1); (window.crypto || {}).getRandomValues ? crypto.getRandomValues(a) : (a[0] = Date.now());
  return free[a[0] % free.length];
};

/* THE CHECKS LITE CAN DO ON A PIECE OF WRITTEN WORK (17 Oct 2026). One list,
   worded for whoever reads it: the tutor before marking (hub-marking.js), the
   trainee before Submit (9_assignment_submission.html). Only what can be told
   from the text; a flag is never a mark. who = 'tutor' | 'trainee'. The
   hidden word, the AI declaration and the declaration itself are the tutor's
   only: a trainee is never told there is a hidden word. */
window.hubWorkChecks = function (a, snap, key, who) {
  var T = who === 'trainee', items = [];
  var add = function (state, label, tutor, trainee) { items.push({ state: state, label: label, detail: (T ? trainee : tutor) || '' }); };
  var isRef = window.hubIsReference || function () { return false; };
  var isBib = function (l) { return /bibliograph|^references?\b|references used/i.test(l); };
  var textOf = function (test) {
    var out = [];
    (a.sections || []).forEach(function (sec, i) {
      if (sec.type === 'text' && !isRef(sec) && test(sec.label || '')) out.push((snap.text || {})[i] || '');
      if (sec.type === 'fields') (sec.fields || []).forEach(function (f, fi) {
        if (!test(f.label || '')) return;
        Object.keys(snap.fields || {}).forEach(function (k) { var m = k.match(/^s(\d+)_i\d+_f(\d+)$/); if (m && +m[1] === i && +m[2] === fi) out.push(snap.fields[k]); });
      });
    });
    return out.join('\n');
  };
  var fieldVals = function (re) { var out = []; (a.sections || []).forEach(function (sec, i) { if (sec.type !== 'fields') return; (sec.fields || []).forEach(function (f, fi) { if (!re.test(f.label || '')) return; Object.keys(snap.fields || {}).forEach(function (k) { var m = k.match(/^s(\d+)_i\d+_f(\d+)$/); if (m && +m[1] === i && +m[2] === fi) out.push(snap.fields[k] || ''); }); }); }); return out; };
  /* words */
  if (a.wordMin) {
    var w = (Object.keys(snap.text || {}).map(function (i) { return hubBareText(snap.text[i], ((a.sections || [])[i] || {}).heads); }).join(' ') + ' ' + Object.values(snap.fields || {}).join(' ')).match(/\S+/g); w = w ? w.length : 0;
    var inR = w >= a.wordMin && w <= a.wordMax;
    add(inR ? 'ok' : 'look', w + ' words',
      w < a.wordMin ? 'Under ' + a.wordMin + '. Not a criterion, but thin work usually fails on the analysis anyway.' : w > a.wordMax ? 'Over ' + a.wordMax + '. Not a criterion: do not fail it for length.' : 'In the range.',
      w < a.wordMin ? 'The brief asks for ' + a.wordMin + '–' + a.wordMax + ' words. A short answer often leaves out something the criteria need.' : w > a.wordMax ? 'The brief asks for ' + a.wordMin + '–' + a.wordMax + ' words. Cut what repeats.' : 'In the range.');
  }
  /* sources in the text and in the bibliography (LRT names them per item instead) */
  var body = textOf(function (l) { return !isBib(l); }), bib = textOf(isBib);
  if (key !== 'lrt' && (bib || /\(\D*\d{4}\)/.test(body))) {
    var set = {}, m, re1 = /\(([A-Z][A-Za-z’'\-]+)(?:\s+(?:and|&)\s+[A-Z][A-Za-z’'\-]+)?(?:\s+et al\.?)?,?\s*(\d{4})/g, re2 = /\b([A-Z][A-Za-z’'\-]+)(?:\s+(?:and|&)\s+[A-Z][A-Za-z’'\-]+)?(?:\s+et al\.?)?\s+\((\d{4})/g;
    while ((m = re1.exec(body))) set[m[1]] = 1;
    while ((m = re2.exec(body))) if (!/^(In|The|See|Page|Appendix|TP|Section|Text)$/.test(m[1])) set[m[1]] = 1;
    var cited = Object.keys(set), missing = cited.filter(function (n) { return bib.indexOf(n) < 0; });
    var names = bib.split(/\n+/).map(function (l) { var mm = l.trim().match(/^([A-Z][A-Za-z’'\-]+),/); return mm ? mm[1] : ''; }).filter(Boolean);
    var unused = names.filter(function (n, i) { return body.indexOf(n) < 0 && names.indexOf(n) === i; });
    if (!cited.length) add(key === 'lfc' ? 'info' : 'look', 'No source cited in the text',
      key === 'lfc' ? 'LFC has no referencing criterion: credit reading where it is cited.' : 'A source in the bibliography but never used in the body does not meet the referencing criterion.',
      key === 'lfc' ? 'Not required here, but a book you mention by name in the text counts in your favour.' : 'Name your reading in the text where you use it, for example (Harmer, 2015). A bibliography on its own is not enough.');
    else add(missing.length ? 'look' : 'ok', 'Sources in the text: ' + cited.join(', '),
      missing.length ? 'Not in the bibliography: ' + missing.join(', ') + '.' : 'Each one is in the bibliography.',
      missing.length ? 'Add to your bibliography: ' + missing.join(', ') + '.' : 'Each one is in your bibliography.');
    if (unused.length && key !== 'lfc') add('info', 'In the bibliography only: ' + unused.join(', '), 'Listed but not used in the text.', 'Listed, but not mentioned in the text. Use it where it helps, or leave it out.');
  }
  /* LRT: a source per item with a page; phonemic script and stress */
  if (key === 'lrt') {
    var refs = fieldVals(/^references?/i), pron = fieldVals(/^pronunciation/i);
    if (refs.length) { var pg = refs.filter(function (r) { return /\bpp?\.\s*\d|\b\d{1,4}\s*[–\-]\s*\d{1,4}\b|,\s*\d{1,4}\b/.test(r); }).length;
      add(pg === refs.length ? 'ok' : 'look', 'Page numbers: ' + pg + ' of ' + refs.length + ' items', pg === refs.length ? 'Each item names a source with a page.' : 'The brief asks for a page number where the source has one.', pg === refs.length ? 'Each item names a source with a page.' : 'Give a page number for each source where it has one.'); }
    if (pron.length) {
      var ipa = pron.filter(function (t) { return /\/[^\/\n]*[ɐ-ʯˈˌːəθð][^\/\n]*\//.test(t); }).length;
      var st = pron.filter(function (t) { return /ˈ/.test(t); }).length;
      add(ipa === pron.length ? 'ok' : 'look', 'Phonemic script: ' + ipa + ' of ' + pron.length + ' items', ipa === pron.length ? 'Check the symbols themselves as you read.' : 'An item with no phonemic script fails criterion 1.', ipa === pron.length ? 'Every item has it.' : 'Write the pronunciation in phonemic script, between slashes, for every item.');
      add(st === pron.length ? 'ok' : (T ? 'look' : 'info'), 'Stress marked: ' + st + ' of ' + pron.length + ' items', 'Missing stress is usually a note, not a fail, unless stress is the point of the item.', st === pron.length ? 'Every item has it.' : 'Mark the main stress with ˈ before the stressed syllable.');
    }
  }
  /* FoL: IPA in the pronunciation section */
  if (key === 'fol') {
    var pr = textOf(function (l) { return /pronunciation/i.test(l); });
    if (pr) { var has = /[ɐ-ʯəˈːθð]/.test(pr);
      add(has ? 'ok' : 'look', has ? 'IPA in the pronunciation problem' : 'No IPA in the pronunciation problem', has ? 'There is phonemic script in section C.' : 'Missing IPA is a criterion 3 failure.', has ? 'There is phonemic script in section C.' : 'Section C asks for the sounds in IPA, both what the student said and the correct form.'); }
  }
  /* the materials link the brief asks for */
  var intro = ((a.sections || []).filter(function (x) { return /^before you start$/i.test((x.label || '').trim()); })[0] || {}).body || '';
  if (/materials link|appendi/i.test(intro)) add(snap.materialsLink ? 'ok' : 'look', snap.materialsLink ? 'Materials link attached' : 'No materials link', snap.materialsLink ? 'Open it from the top of the work.' : 'The brief asks for the tasks to be attached.', snap.materialsLink ? 'Your tutor can open it.' : 'The brief asks you to attach your tasks: paste the link in the declaration at the foot of the page.');
  if (T) return items;
  /* the tutor's only */
  var d = null; (a.sections || []).forEach(function (sec, i) { if (sec.type === 'declaration') d = (snap.decl || {})[i]; });
  if (d) {
    var all = (d.checks || []).every(Boolean);
    add(all ? 'ok' : 'look', all ? 'Declaration signed' : 'Declaration not complete', all ? '' : 'Every line of the declaration should be ticked.');
    if (d.aiUsed === 'yes') add(d.aiLink ? 'info' : 'look', 'AI declared: ' + (d.aiPurpose || 'no purpose given'), d.aiLink ? 'Check it is one of the permitted uses and cited in the text.' : 'No link to the conversation.');
    else if (d.aiUsed) add('ok', 'No AI declared');
  }
  if (a.trap && window.hubTrapFound) { var hit = hubTrapFound(a.trap, { sub1: snap }); add(hit ? 'look' : 'ok', hit ? 'Hidden word used' : 'Hidden word not used', ''); }
  return items;
};

/* THE TUTOR'S MARGIN COMMENTS, ON THE TRAINEE'S PAGE (17 Oct 2026). Each
   [data-loc][data-round] block holds one piece of returned work; a comment on
   it highlights the words it is about and sits under the block, from "Your
   tutor". Read-only: the tutor writes them on the marking page. */
window.hubPaintMargin = function (root, margin) {
  if (!root || !margin) return;
  var esc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  [].forEach.call(root.querySelectorAll('.tmloc[data-loc]'), function (loc) {
    var items = (margin[loc.getAttribute('data-round')] || []).filter(function (c) { return c.loc === loc.getAttribute('data-loc') && (c.text || c.tick); });
    if (!items.length) return;
    var box = loc.querySelector('.readonly'), gut = loc.querySelector('.tmgut');
    items.forEach(function (c, n) {
      var id = c.id || ('n' + n);
      var at = hubHighlight(box, c.quote, id, c.tick ? 'tmc tmc-tick' : 'tmc' + (c.tone ? ' tmc-' + c.tone : ''), 'tmc');
      if (at >= 0 && c.tick) hubTickSpots(c.quote, c.n || 1).forEach(function (sp) {
        var span = document.createElement('span'); span.className = 'tmc-mark'; span.setAttribute('role', 'img'); span.setAttribute('aria-label', 'ticked by your tutor');
        span.innerHTML = hubTickSVG('draw'); hubInsertAt(box, at + sp, span);
      });
      if (c.tick) return;
      gut.insertAdjacentHTML('beforeend', '<div class="tmcard' + (c.tone ? ' tone-' + c.tone : '') + '"><span>Your tutor' + (c.quote ? ', on “' + esc(c.quote.length > 60 ? c.quote.slice(0, 58) + '…' : c.quote) + '”' : '') + '</span><p>' + esc(c.text) + '</p></div>');
    });
  });
  if (!document.getElementById('hub-tmc-css')) {
    var st = document.createElement('style'); st.id = 'hub-tmc-css';
    st.textContent = 'mark.tmc{background:oklch(72% 0.035 250 / .2); color:inherit; border-bottom:2px solid oklch(52% 0.045 250); border-radius:2px; padding:0 1px;}' +
      'mark.tmc.tmc-good{background:oklch(70% 0.1 158 / .22); border-bottom-color:oklch(46% 0.1 158);} mark.tmc.tmc-fix{background:oklch(72% 0.11 40 / .24); border-bottom-color:oklch(52% 0.13 40);}' +
      /* the trainee sees only the ticks, not a highlight under them (Ramy, 18 Oct 2026: "the trainees should only see the ticks... highlight will either go for the good comments or the action points"); the tutor's marking page keeps the highlight */ 'mark.tmc-tick{background:none !important; border-bottom:0 !important; padding:0 !important;} .tmc-mark{white-space:nowrap;}' +
      '.tmgut:empty{display:none;} .tmgut{display:flex; flex-direction:column; gap:8px; margin:6px 0 10px;}' +
      '.tmcard{background:var(--paper); border:1px solid var(--sand-line); border-left:3px solid oklch(52% 0.045 250); border-radius:10px; padding:8px 11px; font-size:0.86rem; line-height:1.5;}' +
      '.tmcard.tone-good{border-left-color:oklch(46% 0.1 158);} .tmcard.tone-fix{border-left-color:oklch(52% 0.13 40);}' +
      '.tmcard span{display:block; font-size:0.72rem; font-weight:700; color:var(--grey); text-transform:uppercase; letter-spacing:.05em;} .tmcard p{margin:3px 0 0;}';
    document.head.appendChild(st);
  }
};

/* HIGHLIGHTING AND TICKING IN A BLOCK OF WORK (18 Oct 2026). One flat reading
   of a block, shared by the tutor's page and the trainee's: its text nodes
   joined in order, a line break counting as one space, so a quote that runs
   over several lines is still found. */
window.hubFlat = function (box) {
  var all = '', nodes = [], w = document.createTreeWalker(box, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null), n;
  while ((n = w.nextNode())) {
    if (n.nodeType === 3) { nodes.push([n, all.length]); all += n.nodeValue; }
    else if (n.nodeName === 'BR') { all += ' '; }
  }
  return { all: all, nodes: nodes };
};
/* Wrap the first match of quote in <mark>s (one per text node it touches).
   Returns where it starts in the flat reading, or -1. */
window.hubHighlight = function (box, quote, id, cls, key) {
  if (!quote) return -1;
  var f = hubFlat(box), at = f.all.indexOf(quote); if (at < 0) return -1;
  var end = at + quote.length;
  f.nodes.forEach(function (pair) {
    var node = pair[0], start = pair[1], stop = start + node.nodeValue.length;
    if (stop <= at || start >= end) return;
    var a = Math.max(0, at - start), b = Math.min(node.nodeValue.length, end - start);
    var mid = node.splitText(a); mid.splitText(b - a);
    var m = document.createElement('mark'); m.className = cls || 'mc'; m.dataset[key || 'mc'] = id;
    mid.parentNode.insertBefore(m, mid); m.appendChild(mid);
  });
  return at;
};
/* Put an element at a place in the flat reading. */
window.hubInsertAt = function (box, off, el) {
  var f = hubFlat(box), node = null, local = 0;
  for (var i = 0; i < f.nodes.length; i++) {
    var st = f.nodes[i][1], len = f.nodes[i][0].nodeValue.length;
    if (off >= st && off <= st + len) { node = f.nodes[i][0]; local = off - st; if (off < st + len) break; }
  }
  if (!node) return;
  if (local < node.nodeValue.length) { var tail = node.splitText(local); tail.parentNode.insertBefore(el, tail); }
  else node.parentNode.insertBefore(el, node.nextSibling);
};
/* WHERE n TICKS GO IN A QUOTE (Ramy, 18 Oct 2026: "if I click good twice it
   should show two ticks... spread out around the paragraph... three presses,
   three ticks, on each line"). The ticks sit at the ends of sentences, spread
   evenly: one tick at the end, two at the end of the middle and the last, and
   so on; more ticks than sentences are spread by words. Sentences, not
   screen lines, because a line is a different place on a phone. */
window.hubTickSpots = function (quote, n) {
  var q = String(quote || '').replace(/\s+$/, ''); if (!q) return [];
  n = Math.max(1, Math.min(+n || 1, 12));
  var ends = [], re = /[.!?…]+["'”’)\]]*(?=\s|$)/g, m;
  while ((m = re.exec(q))) ends.push(m.index + m[0].length);
  if (!ends.length || ends[ends.length - 1] < q.length) ends.push(q.length);
  var S = ends.length, out = [], k;
  if (n <= S) { for (k = 0; k < n; k++) out.push(ends[Math.min(S - 1, Math.max(0, Math.round((k + 1) * S / n) - 1))]); }
  else { for (k = 0; k < n; k++) { var pos = Math.round((k + 1) * q.length / n), sp = q.indexOf(' ', Math.max(0, pos - 1)); out.push(sp < 0 || sp > q.length ? q.length : sp); } }
  return out.filter(function (v, i, a) { return a.indexOf(v) === i; }).sort(function (x, y) { return x - y; });
};

/* THE TICK (17 Oct 2026). Ramy: "instead of typing good... a nice tick...
   make it like worth it." A green badge with a hand-drawn tick that draws
   itself in, the same on the tutor's marking page and the trainee's page.
   Still under reduced motion: it simply appears. */
window.hubTickSVG = function(cls){
  return '<svg class="hub-tick' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="11"></circle><path d="M6.4 12.9 C7.7 14.1 9 15.4 10.3 16.8 C12.7 13.5 15.1 10.4 18 7.3"></path></svg>';
};
(function(){
  if (document.getElementById('hub-tick-css')) return;
  var st = document.createElement('style'); st.id = 'hub-tick-css';
  st.textContent =
    '.hub-tick{display:inline-block; width:1.15em; height:1.15em; vertical-align:-0.22em; margin:0 1px 0 4px; overflow:visible; filter:drop-shadow(0 1px 1.5px oklch(30% 0.05 160 / .28));}' +
    '.hub-tick circle{fill:oklch(46% 0.1 158); stroke:oklch(98% 0.02 158 / .9); stroke-width:1.4;}' +
    '.hub-tick path{fill:none; stroke:#fff; stroke-width:2.7; stroke-linecap:round; stroke-linejoin:round; stroke-dasharray:22; stroke-dashoffset:0;}' +
    '.hub-tick.draw{animation:hubTickPop .42s cubic-bezier(.2,1.5,.4,1) both;} .hub-tick.draw path{stroke-dashoffset:22; animation:hubTickDraw .5s ease-out .18s forwards;}' +
    '@keyframes hubTickPop{from{transform:scale(.4); opacity:0;} to{transform:scale(1); opacity:1;}} @keyframes hubTickDraw{to{stroke-dashoffset:0;}}' +
    '@media (prefers-reduced-motion: reduce){ .hub-tick.draw, .hub-tick.draw path{animation:none; stroke-dashoffset:0;} }' +
    '@media print{ .hub-tick{filter:none;} }';
  (document.head || document.documentElement).appendChild(st);
})();

/* HEADLINES FOR THE PARTS OF AN ANSWER (18 Oct 2026). Ramy: "give headlines to
   each part of the assignment, for the trainees to write under... length,
   level, genre... in a different color... it's already organised, we just
   give it a bit of a nudge... and on the trainee side too."
   A text section may carry `heads`: ["Level", "Length", ...]. The trainee
   writes under each headline in its own box; the answer is still STORED as
   one piece of text, each part starting "Level: ", so every other screen,
   the record, the word count and a resubmission work as they did. Each
   headline stays a signpost for a paragraph of prose, not a form field. */
window.hubJoinHeads = function (heads, vals) {
  return (heads || []).map(function (h, k) { var v = String((vals || [])[k] || '').replace(/^\s+|\s+$/g, ''); return v ? h + ': ' + v : ''; }).filter(Boolean).join('\n\n');
};
window.hubSplitHeads = function (text, heads) {
  var t = String(text || ''), vals = (heads || []).map(function () { return ''; });
  if (!t) return vals;
  var found = [], from = 0;
  (heads || []).forEach(function (h, k) {
    var at = (k === 0 || from === 0) && t.indexOf(h + ': ') === 0 ? 0 : t.indexOf('\n\n' + h + ': ', from);
    if (at < 0) return;
    var cs = at + (at === 0 && t.indexOf(h + ': ') === 0 ? 0 : 2) + h.length + 2;
    found.push({ k: k, at: at, cs: cs }); from = cs;
  });
  if (!found.length) {
    var ps = t.split('\n\n');
    if (heads.length > 1 && ps.length === heads.length) return ps.map(function (x) { return x.replace(/^\s+|\s+$/g, ''); });
    vals[0] = t; return vals;
  }
  var lead = found[0].at > 0 ? t.slice(0, found[0].at).replace(/^\s+|\s+$/g, '') : '';
  found.forEach(function (f, n) { vals[f.k] = t.slice(f.cs, n + 1 < found.length ? found[n + 1].at : t.length).replace(/^\s+|\s+$/g, ''); });
  /* writing before the first headline is not lost: it goes in the first box */
  if (lead) vals[0] = found[0].k > 0 ? lead : lead + '\n\n' + vals[0];
  return vals;
};
/* the text with its headline labels taken off, for counting words */
window.hubBareText = function (text, heads) {
  var t = String(text || ''); if (!heads || !heads.length) return t;
  return t.split('\n\n').map(function (p) { var h = heads.filter(function (x) { return p.indexOf(x + ': ') === 0; })[0]; return h ? p.slice(h.length + 2) : p; }).join('\n\n');
};
/* the same text, read-only, with each headline in its colour on its own line */
window.hubHeadHTML = function (text, heads) {
  var e = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var paras = String(text || '').split('\n\n'), hs = heads || [];
  var named = paras.map(function (p) { return hs.filter(function (x) { return p.indexOf(x + ': ') === 0; })[0] || null; });
  /* An answer written before headlines existed, with one paragraph for each
     headline, still gets them: the k-th paragraph under the k-th headline. */
  var positional = hs.length > 1 && paras.length === hs.length;
  return paras.map(function (p, k) {
    var h = named[k], body = e(p).replace(/\n/g, '<br>');
    if (h) { var lab = e(h + ': '); return '<span class="hl">' + lab + '</span>' + body.slice(lab.length); }
    if (positional && named.indexOf(hs[k]) < 0) return '<span class="hl">' + e(hs[k] + ': ') + '</span>' + body;
    return body;
  }).join('<br><br>');
};
(function () {
  if (document.getElementById('hub-hl-css')) return;
  var st = document.createElement('style'); st.id = 'hub-hl-css';
  st.textContent = '.hl{display:block; font:700 0.72rem Karla,sans-serif; letter-spacing:.08em; text-transform:uppercase; color:var(--as, var(--teal)); margin:2px 0 1px;}' +
    '.hdl{display:flex; align-items:center; gap:8px; font:700 0.76rem Karla,sans-serif; letter-spacing:.08em; text-transform:uppercase; color:var(--as, var(--teal)); margin:14px 0 4px;}' +
    '.hdl::after{content:""; flex:1; height:1px; background:color-mix(in oklab, var(--as, var(--teal)) 30%, transparent);}' +
    '.hdl:first-of-type{margin-top:4px;}';
  (document.head || document.documentElement).appendChild(st);
})();

/* ---- THE TEXTS TO READ (Ramy, 18 Oct 2026: "when the trainee says I chose text B,
   I should be able to click on Text B and see what it is... the text chosen should
   be a link"; then "add the links on the trainee's page too"). An assignment
   carries its texts as reading sections ("Text A — ...", "Text B — ...");
   every mention of one in the writing, and the "Text chosen" headline, opens it
   in a reader with all three a tab away. Used by the marking page and the
   trainee's own page; the look is in hub-house.css. */
(function(){
  var CUR = null; /* {a, key, chosen} of the page that linked last */
  function esc(s){ return (s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function of(a) {
    return ((a && a.sections) || []).map(function (sec) {
      var m = String(sec.label || '').match(/^\s*Text\s+([A-C])\b[\s—–:\-]*(.*)$/i);
      return m && window.hubIsReference && hubIsReference(sec) ? { id: m[1].toUpperCase(), title: m[2].trim(), body: String(sec.body || '') } : null;
    }).filter(Boolean);
  }
  function chosen(snap) {
    if (!snap) return '';
    var vals = [];
    if (snap.text) Object.keys(snap.text).sort(function (x, y) { return x - y; }).forEach(function (k) { vals.push(snap.text[k]); });
    if (snap.fields) Object.keys(snap.fields).sort().forEach(function (k) { vals.push(snap.fields[k]); });
    for (var i = 0; i < vals.length; i++) { var m = String(vals[i] || '').match(/\b[Tt]ext\s+([ABC])\b/); if (m) return m[1].toUpperCase(); }
    return '';
  }
  function open(letter) {
    if (!CUR) return;
    var texts = of(CUR.a); if (!texts.length) return;
    var ch = CUR.chosen, cur = texts.filter(function (x) { return x.id === letter; })[0] || texts.filter(function (x) { return x.id === ch; })[0] || texts[0];
    var wrap = document.getElementById('hubTexts');
    if (!wrap) { wrap = document.createElement('div'); wrap.id = 'hubTexts'; document.body.appendChild(wrap); }
    wrap.className = 'tx-wrap as-' + CUR.key;
    var body = esc(cur.body).replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    wrap.innerHTML = '<div class="tx-sheet" role="dialog" aria-label="The texts"><div class="tx-tabs">' + texts.map(function (x) { return '<button type="button" class="tx-tab' + (x.id === cur.id ? ' on' : '') + '" data-txtab="' + x.id + '"><b>Text ' + x.id + '</b>' + (x.id === ch ? '<span>chosen</span>' : '') + '</button>'; }).join('') + '</div>' +
      '<h3>Text ' + cur.id + (cur.title ? ' · ' + esc(cur.title) : '') + '</h3><div class="tx-body">' + body + '</div></div>';
    wrap.hidden = false;
  }
  function close() { var w = document.getElementById('hubTexts'); if (w) w.hidden = true; }
  /* root: where the writing is; sel: its read-only blocks inside root */
  function link(root, sel, a, key, ch, title) {
    CUR = { a: a, key: key, chosen: ch };
    if (!root || !of(a).length) return;
    [].forEach.call(root.querySelectorAll('.hl'), function (h) {
      if (!/^\s*text chosen/i.test(h.textContent) || h.querySelector('a') || !ch) return;
      var l = document.createElement('a'); l.href = '#'; l.className = 'txtlink'; l.setAttribute('data-text', ch); l.title = title || 'Read the text';
      while (h.firstChild) l.appendChild(h.firstChild); h.appendChild(l);
    });
    [].forEach.call(root.querySelectorAll(sel), function (box) {
      var w = document.createTreeWalker(box, NodeFilter.SHOW_TEXT, null), nodes = [], n;
      while ((n = w.nextNode())) if (!(n.parentNode.closest && n.parentNode.closest('a, .hl'))) nodes.push(n);
      nodes.forEach(function (node) {
        var re = /\b[Tt]ext\s+([ABC])\b/g, m, last = 0, frag = null, v = node.nodeValue;
        while ((m = re.exec(v))) {
          if (!frag) frag = document.createDocumentFragment();
          frag.appendChild(document.createTextNode(v.slice(last, m.index)));
          var l = document.createElement('a'); l.href = '#'; l.className = 'txtlink'; l.setAttribute('data-text', m[1].toUpperCase()); l.textContent = m[0]; frag.appendChild(l);
          last = m.index + m[0].length;
        }
        if (frag) { frag.appendChild(document.createTextNode(v.slice(last))); node.parentNode.replaceChild(frag, node); }
      });
    });
  }
  document.addEventListener('click', function (e) {
    var t = e.target; if (!t || !t.closest) return;
    var l = t.closest('a.txtlink'); if (l) { e.preventDefault(); open(l.getAttribute('data-text')); return; }
    if (t.closest('[data-readtexts]')) { open(''); return; }
    var tab = t.closest('[data-txtab]'); if (tab) { open(tab.getAttribute('data-txtab')); return; }
    var w = document.getElementById('hubTexts'); if (w && !w.hidden && !t.closest('.tx-sheet')) close();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  window.hubTexts = { of: of, chosen: chosen, link: link, open: open, close: close };
})();

/* ---- ONE MIC THAT FOLLOWS THE CURSOR (Ramy, 18 Oct 2026: "one mic that follows
   the cursor, like TP feedback"; the same rule he set in Connect on 12 Sep).
   A Dictate button at the bottom right writes into whichever box you last
   clicked in. Spoken punctuation as on the TP feedback page ("comma", "full
   stop", "new line"). Chrome and Edge only: WebKit (Safari, and every browser
   on iPhone and iPad) stops after one sentence, so the button is not shown
   there; the Mac's own dictation and the phone keyboard's mic do the job.
   hubMic.bar(scope) puts the button on the page once; scope is the selector
   of the boxes it writes into. The look is .dictbar / .dictbtn in hub-house.css. */
(function(){
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var ua = navigator.userAgent;
  var WEBKIT = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) || (/Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR|Firefox/.test(ua));
  var OK = !!SR && !WEBKIT;
  var rec = null, on = false, target = null, BAR = null, SCOPE = null;
  var LANG = 'en-GB';   /* as on the TP feedback page */
  var SPOKEN = [
    [/\b(full stop|fullstop|period)\b/gi,'.'], [/\b(question mark)\b/gi,'?'], [/\b(exclamation mark|exclamation point)\b/gi,'!'],
    [/\b(comma)\b/gi,','], [/\b(semicolon|semi colon)\b/gi,';'], [/\b(colon)\b/gi,':'],
    [/\b(new paragraph)\b/gi,'\n\n'], [/\b(new line|next line)\b/gi,'\n'], [/\b(dash|em dash)\b/gi,' — '], [/\b(hyphen)\b/gi,'-'],
    [/\b(open bracket|open parenthesis)\b/gi,'('], [/\b(close bracket|close parenthesis)\b/gi,')'],
    [/\b(open quote|open quotes)\b/gi,'“'], [/\b(close quote|close quotes)\b/gi,'”'], [/\b(ellipsis|dot dot dot)\b/gi,'…']
  ];
  function punctuate(t){
    SPOKEN.forEach(function(p){ t = t.replace(p[0], p[1]); });
    t = t.replace(/\s+([,.;:?!…])/g,'$1').replace(/([,;:])(?=\S)/g,'$1 ').replace(/([.?!])(?=\S)/g,'$1 ')
         .replace(/\s*\n\s*/g,'\n').replace(/[ \t]{2,}/g,' ').replace(/\(\s+/g,'(').replace(/\s+\)/g,')')
         .replace(/“\s+/g,'“').replace(/\s+”/g,'”');
    t = t.replace(/^\s*([a-z])/, function(m,c){ return c.toUpperCase(); });
    t = t.replace(/([.?!]\s+|\n)([a-z])/g, function(m,p,c){ return p + c.toUpperCase(); });
    return t.trim();
  }
  function insert(text){
    if (!target || !target.isConnected) { stop(); return; }
    var s = target.selectionStart == null ? target.value.length : target.selectionStart;
    var e = target.selectionEnd == null ? target.value.length : target.selectionEnd;
    var before = target.value.slice(0, s);
    /* a new sentence after one that ended starts with a capital; mid-sentence it doesn't */
    if (before.trim() && !/[.?!\n]\s*$/.test(before)) text = text.replace(/^([A-Z])(?![A-Z])/, function(m){ return m.toLowerCase(); });
    var pad = before && !/\s$/.test(before) ? ' ' : '';
    target.value = before + pad + text + target.value.slice(e);
    var pos = s + pad.length + text.length;
    try { target.setSelectionRange(pos, pos); } catch (x) {}
    target.dispatchEvent(new Event('input', { bubbles: true }));
  }
  function paint(){
    if (!BAR) return;
    var b = BAR.querySelector('.dictbtn'); b.classList.toggle('rec', on);
    b.querySelector('.lbl').textContent = on ? 'Stop dictating' : 'Dictate';
  }
  function stop(){ on = false; if (rec) { try { rec.stop(); } catch (x) {} } paint(); var a = document.activeElement; if (BAR && !(a && a.matches && a.matches(SCOPE))) BAR.hidden = true; }
  function start(){
    if (!target || !target.isConnected) { var n = BAR.querySelector('.dict-hint'); n.hidden = false; setTimeout(function(){ n.hidden = true; }, 2600); return; }
    if (!rec) {
      rec = new SR(); rec.continuous = true; rec.interimResults = false; rec.lang = LANG;
      rec.onresult = function(ev){
        for (var i = ev.resultIndex; i < ev.results.length; i++) {
          if (!ev.results[i].isFinal) continue;
          var t = punctuate(ev.results[i][0].transcript.trim()); if (!t) continue;
          /* only the punctuation you say: no full stop added when you pause (Ramy, 18 Oct 2026) */
          insert(/\n$/.test(t) ? t : t + ' ');
        }
      };
      rec.onend = function(){ if (on && target && target.isConnected) { try { rec.start(); } catch (x) {} } else { on = false; paint(); } };
      rec.onerror = function(ev){ if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed') { on = false; paint(); } };
    }
    rec.lang = LANG; target.setAttribute('lang', LANG); target.focus();
    on = true; try { rec.start(); } catch (x) {}
    paint();
  }
  function bar(scope){
    if (!OK || BAR) return;
    SCOPE = scope || 'textarea';
    BAR = document.createElement('div'); BAR.className = 'dictbar';
    BAR.innerHTML = '<span class="dict-hint" hidden>Click into a box first</span>' +
      '<select title="Dictation language: English (UK), (US) or (Australia)" aria-label="Dictation language"><option value="en-GB">UK</option><option value="en-US">US</option><option value="en-AU">AU</option></select>' +
      '<button type="button" class="dictbtn" title="Say the punctuation: comma, full stop, question mark, colon, dash, open bracket, close bracket, new line, new paragraph"><span class="dot"></span><span class="lbl">Dictate</span></button>';
    var sel = BAR.querySelector('select'); sel.value = LANG;
    sel.addEventListener('change', function(){ LANG = sel.value; if (rec) rec.lang = LANG; if (target) target.setAttribute('lang', LANG); if (on) { rec.stop(); setTimeout(function(){ try { rec.start(); } catch (x) {} }, 250); } });
    var btn = BAR.querySelector('.dictbtn');
    btn.addEventListener('mousedown', function(e){ e.preventDefault(); });   /* the box keeps its cursor */
    btn.addEventListener('click', function(){ if (on) stop(); else start(); });
    document.body.appendChild(BAR);
    /* It shows only while you are in a box it writes into, or while it is
       listening (Ramy, 19 Oct 2026: it sat on Save & return). */
    BAR.hidden = true;
    document.addEventListener('focusin', function(e){
      var t = e.target; if (!t.matches || !t.matches(SCOPE)) return;
      if (on && target !== t) { target = t; t.setAttribute('lang', LANG); } else target = t;
      BAR.hidden = false;
    });
    document.addEventListener('focusout', function(){
      setTimeout(function(){ var a = document.activeElement; if (!on && !(a && a.matches && a.matches(SCOPE)) && !(a && BAR.contains(a))) BAR.hidden = true; }, 150);
    });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && on) stop(); }, true);
  }
  if (OK) {
    var st = document.createElement('style');
    st.textContent = '.dictbar .dict-hint{font:600 0.78rem Karla,sans-serif; color:var(--ink); background:var(--paper); border:1px solid var(--sand-line); border-radius:12px; padding:6px 10px;}' +
      '.dictbar .dict-hint[hidden]{display:none;} .dictbar[hidden]{display:none !important;}';
    (document.head || document.documentElement).appendChild(st);
  }
  window.hubMic = { ok: OK, bar: bar, stop: stop };
})();

/* THE DEMO IS VIEW ONLY (Ramy, 24 Oct 2026: "I want it to be view only. For
   everyone ... they can't download anything"). On a demo course (the demo
   clock is set) printing and downloading say so instead of happening: the
   print buttons, Cmd+P, a link marked download, a Drive download link and the
   files the pages build themselves (Word, PDF, spreadsheets). Each check is
   made at the moment of the click, so a page opened before the course
   settings arrived is still covered. The public pages (the offer card, the
   films) are never a course, so they are left alone. */
(function(){
  if (/\/(offer\.html|film\/|brand\/)/.test(location.pathname)) return;
  var MSG = 'This is a demo course. Printing and downloading are turned off.';
  function demo(){ try { return !!(window.hubDemoToday && window.hubDemoToday()); } catch (e) { return false; } }
  function say(msg){
    var t = document.getElementById('hubDemoLock');
    if (!t) {
      t = document.createElement('div'); t.id = 'hubDemoLock'; t.setAttribute('role', 'status');
      t.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2000;max-width:calc(100vw - 32px);'
        + 'background:var(--ink,#1f1a14);color:var(--paper,#fdfcf9);font:600 0.88rem/1.4 Karla,sans-serif;padding:11px 18px;border-radius:10px;box-shadow:0 6px 24px rgba(0,0,0,.18);text-align:center;';
      document.body.appendChild(t);
    }
    t.textContent = msg || MSG; t.hidden = false;
    clearTimeout(say._t); say._t = setTimeout(function(){ t.hidden = true; }, 3200);
  }
  var st = document.createElement('style');
  st.textContent = '@media print{html.hub-demo-lock body > *{display:none !important;} html.hub-demo-lock body::before{content:"' + MSG + '";display:block;padding:40px;font:16px Karla,sans-serif;}}';
  (document.head || document.documentElement).appendChild(st);
  var realPrint = window.print;
  window.print = function(){ if (demo()) { say(); return; } return realPrint.apply(window, arguments); };
  window.addEventListener('beforeprint', function(){ document.documentElement.classList.toggle('hub-demo-lock', demo()); });
  function isDownload(a){ return !!a && (a.hasAttribute('download') || /export=download|drive\.usercontent\.google\.com\/download/.test(a.href || '')); }
  document.addEventListener('click', function(e){
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (isDownload(a) && demo()) { e.preventDefault(); e.stopPropagation(); say(); return; }
    /* The demo centre's own documents are placeholders (drive.google.com/.../demo-...),
       and opened a Drive error (assessor walk, 24 Oct 2026). Say what would open. */
    /* Every link on the Course files card, too (Ramy, 25 Oct 2026): on the demo its rows are the centre's own
       files, and one of them opened Cambridge's site instead of saying what it is. */
    if (a && demo() && a.closest && a.closest('.room.files') && a.target === '_blank') {
      e.preventDefault(); e.stopPropagation(); say('This is a demo course. On a real course this opens the file itself.'); return;
    }
    if (a && /drive\.google\.com\/drive\/folders\/demo-/.test(a.href || '') && demo()) {
      e.preventDefault(); e.stopPropagation(); say('This is a demo course. On a real course this opens the file itself.');
    }
  }, true);
  var realClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function(){ if (isDownload(this) && demo()) { say(); return; } return realClick.apply(this, arguments); };
  window.hubDemoLocked = demo; window.hubDemoSay = say;
})();
