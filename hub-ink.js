/* Connect Lite — signing.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * Ramy, 28 Sep 2026: "should we add a digital signature?" The record of a
 * signature stays what it was — a name and the moment, written under the link
 * that made it, which is what proves anything. This is the mark that sits
 * above it, and the dialog that asks before one is made.
 *
 * It used to be a pad you drew on with a finger or a mouse. That is gone
 * (6 Oct 2026). Three things killed it, in the order they were found:
 *
 *   "I can't seem to do it on my trackpad."  A stroke began on pointerdown,
 *   so a finger slid across a trackpad drew nothing. The first fix was to
 *   explain that you must hold the click down. That was the wrong fix.
 *
 *   "You cannot have a consistent signature with your finger on a trackpad."
 *   Right, and a candidate signs seven times on a course while a tutor signs
 *   four times per candidate — seventy-one on a six-candidate course, no two
 *   alike. On a Cambridge document that reads as wrong.
 *
 *   "There's no option to change it, there shouldn't be one." A signature you
 *   can redraw differently each time is not a signature. So there is no pad,
 *   no second choice, and nothing stored that could be edited: the mark is
 *   derived from the signer every time it is drawn (hub-hand.js).
 *
 *   hubInk.confirm({ name, seed, title, askName }) -> Promise<spec|{name,ink}|null>
 *       null = cancelled. Otherwise the signature to keep in the record.
 *   hubInk.svg(ink, cls, name) -> the signature for the screen
 *
 * `svg` still renders a drawn path, because signatures drawn before this are
 * on real records and must keep showing as what they were.
 */
(function(){
  'use strict';
  var W = 300, H = 100;
  var css = document.createElement('style');
  css.textContent =
    ".ink-overlay{position:fixed; inset:0; background:rgba(35,25,15,0.4); display:flex; align-items:center; justify-content:center; z-index:1000; padding:20px; animation:hubInkFadeIn 180ms ease-out;}"+
    "@keyframes hubInkFadeIn{from{opacity:0} to{opacity:1}} @media (prefers-reduced-motion: reduce){.ink-overlay{animation:none}}"+
    ".ink-modal{background:var(--paper,#fdfcf9); color:var(--ink,#1f1a14); border-radius:10px; border-top:3px solid var(--teal,#1f6f6b); padding:20px 22px; max-width:460px; width:100%; box-shadow:0 8px 30px rgba(0,0,0,0.18); font-family:'Karla',sans-serif;}"+
    ".ink-modal h3{font-family:'Newsreader',Georgia,serif; font-size:1.1rem; margin:0 0 4px;}"+
    ".ink-modal .ink-sub{font-size:0.82rem; color:var(--grey,#6b625a); margin:0 0 12px; line-height:1.5;}"+
    ".ink-name{display:block; margin:0 0 10px;}"+
    ".ink-name span{display:block; font-size:0.68rem; letter-spacing:.08em; text-transform:uppercase; color:var(--grey,#6b625a); font-weight:700; margin-bottom:4px;}"+
    ".ink-name input{width:100%; box-sizing:border-box; font-family:'Karla',sans-serif; font-size:0.95rem; padding:9px 11px; border:1.5px solid var(--sand-line,#e3dccf); border-radius:8px; background:var(--sand-deep,#efe9dc); color:inherit;}"+
    ".ink-pad{position:relative; width:100%; aspect-ratio:3/1; background:#fff; border:1.5px solid var(--sand-line,#e3dccf); border-radius:8px; overflow:hidden; display:flex; align-items:flex-end; justify-content:center; padding:0 16px 14%; box-sizing:border-box;}"+
    ".ink-pad .ink-line{position:absolute; left:8%; right:8%; bottom:12%; border-bottom:1px dashed var(--sand-line,#cfc6b6);}"+
    ".ink-pad .ink-hint{position:absolute; left:0; right:0; bottom:4%; text-align:center; font-size:0.72rem; color:var(--grey,#8a8078);}"+
    ".ink-pad .hand{max-width:100%; overflow:hidden; text-overflow:clip;}"+
    ".ink-bar{display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin-top:12px;}"+
    ".ink-bar .grow{flex:1;}"+
    ".ink-bar .btn{font-family:'Karla',sans-serif; font-size:0.84rem; font-weight:700; padding:9px 16px; border-radius:8px; border:0; background:var(--teal,#1f6f6b); color:#fff; cursor:pointer;}"+
    ".ink-bar .btn.quiet{background:none; color:var(--grey,#6b625a); border:1.5px solid var(--sand-line,#e3dccf);}"+
    ".ink-bar .btn:disabled{opacity:.45; cursor:not-allowed;}"+
    ".ink-bar .btn.primary:not(:disabled):hover{background:var(--teal-lifted,#2a7f7a);}"+
    "svg.ink{display:block; height:44px; width:auto; max-width:180px; color:var(--ink,#1f1a14);}";
  document.head.appendChild(css);

  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]; }); }

  /* A record's `ink` is either a written signature's spec or, on anything
     signed before 6 Oct 2026, the path a finger drew. Both render. */
  function svg(ink, cls, name){
    if (!ink) return '';
    if (window.hubHand && window.hubHand.written(ink)) return window.hubHand.html(ink, name, cls);
    return '<svg class="ink' + (cls ? ' ' + cls : '') + '" viewBox="0 0 ' + W + ' ' + H + '" aria-label="Signature"><path d="'
      + String(ink).replace(/"/g, '') + '" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function confirmSign(opts){
    opts = opts || {};
    return new Promise(function(resolve){
      var overlay = document.createElement('div'); overlay.className = 'ink-overlay';
      overlay.innerHTML = '<div class="ink-modal" role="dialog" aria-modal="true">'
        + '<h3></h3><p class="ink-sub"></p>'
        + '<label class="ink-name"><span>Your name, as it goes on the record</span><input type="text" placeholder="Type your name"></label>'
        + '<div class="ink-pad"><div class="ink-mark"></div><div class="ink-line"></div><div class="ink-hint"></div></div>'
        + '<div class="ink-bar"><span class="grow"></span>'
        + '<button type="button" class="btn quiet ink-cancel">Cancel</button>'
        + '<button type="button" class="btn primary ink-ok" disabled>Sign</button></div></div>';
      overlay.querySelector('h3').textContent = opts.title || 'Sign';

      var nameRow = overlay.querySelector('.ink-name'), nameIn = nameRow.querySelector('input');
      var mark = overlay.querySelector('.ink-mark'), hint = overlay.querySelector('.ink-hint');
      var ok = overlay.querySelector('.ink-ok');

      /* The seed decides whose hand this is. A candidate's own link carries
         their token; staff have no token, so their course key and name make
         one that is stable for them across every candidate they sign for. */
      var seed = opts.seed || (function(){
        try {
          var S = window.HubStore;
          if (S && S.token && S.token()) return S.token();
          if (S && S.key && S.key()) return 'k:' + S.key() + ':' + (opts.name || '');
        } catch (e) {}
        return opts.name || '';
      })();

      var nameNow = function(){ return opts.askName ? nameIn.value.trim() : String(opts.name || '').trim(); };
      if (opts.askName) nameIn.value = opts.name || ''; else nameRow.remove();
      overlay.querySelector('.ink-sub').textContent = opts.askName
        ? 'This is your signature. It is written from your name, it is yours alone, and it is the same every time you sign — here, on this course, and on Cambridge’s booklet.'
        : 'This is your signature, ' + (opts.name || '') + '. It is the same every time you sign — here, on this course, and on Cambridge’s booklet. It cannot be changed afterwards.';

      var spec = (window.hubHand && window.hubHand.spec(seed)) || '';
      function draw(){
        var n = nameNow();
        mark.innerHTML = n && spec ? window.hubHand.html(spec, n) : '';
        ok.disabled = !n || !spec;
        hint.textContent = n ? '' : 'Your signature appears here';
      }
      document.body.appendChild(overlay);
      draw();
      if (opts.askName) { nameIn.addEventListener('input', draw); if (!nameIn.value) setTimeout(function(){ nameIn.focus(); }, 0); }

      function done(v){ (window.hubFadeAway || function (el) { el.remove(); })(overlay); document.removeEventListener('keydown', onKey); resolve(v); }
      function onKey(e){ if (e.key === 'Escape') done(null); }
      document.addEventListener('keydown', onKey);
      overlay.querySelector('.ink-cancel').addEventListener('click', function(){ done(null); });
      ok.addEventListener('click', function(){
        if (!nameNow() || !spec) return;
        done(opts.askName ? { name: nameNow(), ink: spec } : spec);
      });
      overlay.addEventListener('mousedown', function(e){ if (e.target === overlay) done(null); });
    });
  }

  window.hubInk = { confirm: confirmSign, pad: confirmSign, svg: svg, W: W, H: H };
})();
