/* How many teaching practices a course may give each candidate. Eight, which
   is what the Administration Handbook (June 2025, p25) asks for as a minimum
   inside the six assessed hours, and what this centre runs. The Handbook sets
   no maximum, so this is a centre decision rather than a Cambridge one -- it
   used to be written into twenty separate bounds and is now written once
   (Ramy, 22 Sep 2026: "the cap is eight TPs"). */
window.HUB_MAX_TP = 8;

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
    css.textContent=".confirm-overlay{position:fixed; inset:0; background:rgba(35,25,15,0.4); display:flex; align-items:center; justify-content:center; z-index:1000; padding:20px;}"+
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
      "a.card, .tk-card[href], .cell, .list-row > button:first-child{ transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease; }"+
      "a.card:hover, .cell:hover{ transform: translateY(-1px); box-shadow: var(--hub-ring); }"+
      ".cell:hover .chip{ box-shadow: none; }"+
      "button:not(:disabled), .btn, a.act, .chip[data-role], .pchip, .crit-toggle, .picker button, .filter, .tab, .sg, .rb, .copyfirst, .export-return, .order-arrows button{ transition: box-shadow .12s ease, background-color .12s ease, border-color .12s ease; }"+
      "button:not(:disabled):hover, .btn:not(:disabled):hover, a.act:hover, .chip[data-role]:not(.disabled):hover, .pchip:hover, .crit-toggle:hover, .picker button:hover, .filter:hover, .tab:hover, .sg:hover, .rb:hover, .copyfirst:hover{ box-shadow: var(--hub-ring); }"+
      "button:not(:disabled):not(.primary):not(.btn-teal):not(.btn-gold):not(.btn-add):not(.btn-submit):not(.active):not(.on):not(.picked):not(.confirm-action):not(.act):hover{ background-color: var(--hub-wash); }"+
      "@media (prefers-reduced-motion: reduce){ a.card, .cell, button, .btn{ transition: none; } a.card:hover, .cell:hover{ transform: none; } }";
    document.head.appendChild(hcss);
  }
  /* Nothing pinned to the screen belongs on paper. The sync pill and the
     dictation bar are both position:fixed and both were printing into the
     corner of every document the TP loop produces -- the lesson plan, the
     self-evaluation, the teaching practice record and the assignment record,
     which are exactly the pages that go into the candidate's portfolio and in
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
        function cleanup(result){ overlay.remove(); document.removeEventListener('keydown',onKey); resolve(result); }
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
   21 Sep 2026) -- and the tutor's feedback screen and the candidate's
   submission form were still open to everyone (walk, 22 Sep 2026). */
function hubRoomRefusal(title, who, mode){
  var back = mode === 'assessor'
    ? { href: '12_assessor_pack.html', label: 'Open your assessor pack' }
    : mode === 'tutor'
      ? { href: '5_tutor_dashboard.html', label: 'Back to your dashboard' }
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

/* The tutor's own screens: writing feedback, marking an assignment. */
window.hubTutorRoomOnly = function(){
  var mode = window.HubMode;
  if (mode === 'tutor' || !mode) return false;
  return hubRoomRefusal('This room belongs to your tutors',
    mode === 'assessor'
      ? 'Your link is read-only. The returned feedback and the marked records are in your pack.'
      : 'This is where your tutors write up your teaching practice. What they return to you is on your own feedback page.', mode);
};

/* The candidate's own writing screens. */
window.hubTraineeRoomOnly = function(){
  var mode = window.HubMode;
  if (mode === 'trainee' || !mode) return false;
  return hubRoomRefusal('This room belongs to the candidate',
    mode === 'assessor'
      ? 'Your link is read-only. Submitted work is in the candidate portfolios and the assignment records.'
      : 'This is the candidate\u2019s own submission form. What they have submitted is on your marking screen.', mode);
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
      document.documentElement.style.setProperty('--bar-reserve', Math.ceil(h + GAP) + 'px');
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
  if(!btn.dataset.copyLabel) btn.dataset.copyLabel = btn.textContent;
  var back = btn.dataset.copyLabel;
  var host = btn.closest('.link') || btn.parentElement || btn;
  /* Every revealed link goes, not just this row's: they are one per row, so
     copying the tutor link and then the assessor link left both on screen at
     once, and a link revealed earlier outlived a later successful copy. Only
     ever one, and only where the copy has just failed (walk, 21 Sep 2026). */
  var stale = document.querySelectorAll('.copy-fallback');
  for (var i = 0; i < stale.length; i++) stale[i].remove();
  if(await window.hubCopy(text)){
    btn.textContent='Copied';
    clearTimeout(btn._copyT);
    btn._copyT=setTimeout(function(){ btn.textContent=back; },1500);
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
// the four: it exists for a candidate only once a tutor has set it after a
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
    + (c.logo ? '<img src="' + c.logo + '" alt="" style="width:44px;height:44px;object-fit:contain;border-radius:6px;flex-shrink:0;">' : '')
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
       candidate's own lesson plan, self-evaluation and teaching practice
       record, where it reads as a broken image (walk, 21 Sep 2026). The
       letterhead in the printed document has always simply left the logo out;
       the on-screen header now does the same. Course admin's own upload box is
       a different element (#logoSlot) and keeps its prompt, which is the one
       place the instruction belongs. */
    if (!c.logo) { slot.style.display = 'none'; return; }
    slot.style.display = '';
    slot.innerHTML = '<img src="' + c.logo + '" alt="' + c.name.replace(/"/g,'&quot;') + ' logo" style="width:100%;height:100%;object-fit:contain;border-radius:6px;">';
    slot.style.border = 'none';
  });
  document.querySelectorAll('.hub-centre-name').forEach(function(el){
    if (!c.name) return;
    if (el.tagName === 'INPUT') { if (!el.value) el.value = c.name; el.readOnly = true; el.style.borderBottomColor = 'transparent'; el.title = 'Set on course admin\u2019s Settings tab'; }
    else el.textContent = c.name;
  });
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
    /* The materials link the candidate gave, first, so a marker or an assessor
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
           was stored, shown to the candidate on their own screen, and missing
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
