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
  // pills"), in the Hub's teal, on every screen. Cards lift a hair and take
  // a teal ring; pills and buttons take the ring and a light teal wash.
  // Chosen states keep their own colour; disabled things do nothing.
  if(!document.getElementById('hub-hover-css')){
    var hcss=document.createElement('style'); hcss.id='hub-hover-css';
    // Ramy, 20 Sep 2026: the credit is a watermark like Connect's -- in the header band beside the mark, on the landing screens only, never a door.
    hcss.textContent=":root{ --hub-ring: 0 0 0 2px oklch(88% 0.04 195); --hub-wash: oklch(94% 0.025 195); --bronze: oklch(50% 0.09 62); }"+
      ".hub-credit{ font-family:'Karla',sans-serif; font-size:11px; letter-spacing:0.01em; color:var(--bronze); opacity:.8; white-space:nowrap; margin-left:12px; align-self:center; }"+
      ".hub-credit b{ font-weight:700; }"+
      "@media (max-width:768px){ .hub-credit{ display:none; } }"+
      "a.card, .tk-card[href], .cell, .list-row > button:first-child{ transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease; }"+
      "a.card:hover, .cell:hover{ transform: translateY(-1px); box-shadow: var(--hub-ring); border-color: var(--teal, #1E6B63); }"+
      ".cell:hover .chip{ box-shadow: none; }"+
      "button:not(:disabled), .btn, a.act, .chip[data-role], .pchip, .crit-toggle, .picker button, .filter, .tab, .sg, .rb, .copyfirst, .export-return, .order-arrows button{ transition: box-shadow .12s ease, background-color .12s ease, border-color .12s ease; }"+
      "button:not(:disabled):hover, .btn:not(:disabled):hover, a.act:hover, .chip[data-role]:not(.disabled):hover, .pchip:hover, .crit-toggle:hover, .picker button:hover, .filter:hover, .tab:hover, .sg:hover, .rb:hover, .copyfirst:hover{ box-shadow: var(--hub-ring); border-color: var(--teal, #1E6B63); }"+
      "button:not(:disabled):not(.primary):not(.btn-teal):not(.btn-submit):not(.active):not(.on):not(.picked):not(.confirm-action):not(.act):hover{ background-color: var(--hub-wash); }"+
      "@media (prefers-reduced-motion: reduce){ a.card, .cell, button, .btn{ transition: none; } a.card:hover, .cell:hover{ transform: none; } }";
    document.head.appendChild(hcss);
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
    if (h > 0) document.documentElement.style.setProperty('--bar-reserve', Math.ceil(h + GAP) + 'px');
    else document.documentElement.style.removeProperty('--bar-reserve');
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

// A centre's assignment wording travels as a file (Ramy, 20 Sep 2026: "export
// the wording from screen 8"). Screen 8 writes it; the trainee's home page and
// the tutor dashboard read it into this browser, so everyone works from the
// same wording without a server. Schema: connect-hub-wording-v1.
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
    if (!c.logo) return;
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

