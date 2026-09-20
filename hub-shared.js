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
