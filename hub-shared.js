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
      ".confirm-cancel{background:var(--paper,#fdfcf9); color:var(--ink,#2b2620);}"+
      ".confirm-cancel:hover{background:var(--sand-deep,#f3efe6);}"+
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
    hcss.textContent=":root{ --hub-ring: 0 0 0 2px oklch(88% 0.04 195); --hub-wash: oklch(94% 0.025 195); }"+
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
    window.confirmModal=function(message, actionLabel){
      return new Promise(function(resolve){
        var overlay=document.createElement('div');
        overlay.className='confirm-overlay';
        overlay.innerHTML='<div class="confirm-modal" role="alertdialog" aria-modal="true"><p class="confirm-message"></p><div class="confirm-actions"><button type="button" class="confirm-cancel">Cancel</button><button type="button" class="confirm-action"></button></div></div>';
        overlay.querySelector('.confirm-message').textContent=message;
        var actionBtn=overlay.querySelector('.confirm-action');
        actionBtn.textContent=actionLabel||'Continue';
        document.body.appendChild(overlay);
        function cleanup(result){ overlay.remove(); document.removeEventListener('keydown',onKey); resolve(result); }
        function onKey(e){ if(e.key==='Escape') cleanup(false); }
        document.addEventListener('keydown',onKey);
        overlay.addEventListener('mousedown',function(e){ if(e.target===overlay) cleanup(false); });
        overlay.querySelector('.confirm-cancel').addEventListener('click',function(){ cleanup(false); });
        actionBtn.addEventListener('click',function(){ cleanup(true); });
        actionBtn.focus();
      });
    };
  }
  window.niceDate=function(iso){
    if(!iso||!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso||'';
    var d=new Date(iso+'T00:00:00');
    return d.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
  };
})();

// A centre's assignment wording travels as a file (Ramy, 20 Sep 2026: "export
// the wording from screen 8"). Screen 8 writes it; the trainee's home page and
// the tutor dashboard read it into this browser, so everyone works from the
// same wording without a server. Schema: connect-hub-wording-v1.
window.HUB_WORDING_KEY = 'connect_assignment_wording_v2';
window.exportWordingFile = function(wording, centreName){
  var payload = { schema:'connect-hub-wording-v1', exportedAt:new Date().toISOString(), centreName:centreName||'', wording:wording };
  var blob = new Blob([JSON.stringify(payload,null,2)], {type:'application/json'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'connect-hub-wording-' + new Date().toISOString().slice(0,10) + '.json';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
};
window.readWordingFile = function(file){
  return new Promise(function(resolve, reject){
    var reader = new FileReader();
    reader.onload = function(){
      var data = null;
      try { data = JSON.parse(reader.result); } catch(e) { reject(new Error('That file isn’t valid — could not read it.')); return; }
      if (!data || data.schema !== 'connect-hub-wording-v1' || !data.wording || typeof data.wording !== 'object') { reject(new Error('That doesn’t look like a wording file from your centre.')); return; }
      localStorage.setItem(window.HUB_WORDING_KEY, JSON.stringify(data.wording));
      resolve(data);
    };
    reader.onerror = function(){ reject(new Error('Could not read that file.')); };
    reader.readAsText(file);
  });
};

// Assignment 5 (the plagiarism reflection) is a centre sanction, not one of
// the four: it exists for a candidate only once a tutor has set it after a
// plagiarism finding. Ramy, 20 Sep 2026: "I don't want assignment five to be
// visible... can we have it out of the way somehow?" Nothing lists it until
// then; a submission of it already on file counts as set.
window.a5InPlay = function(subs){
  var s = subs && subs.a5;
  return !!(s && (s.assigned || (s.stage && s.stage !== 'draft')));
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

