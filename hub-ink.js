/* Connect Lite — a drawn signature.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * Ramy, 28 Sep 2026: "should we add a digital signature?" The record of a
 * signature stays what it was — a typed name and the moment, written under
 * the link that made it, which is what proves anything. This adds the ink:
 * a finger or mouse on a pad, kept on the record as a small SVG path in a
 * 300 x 100 box (a signature is a few KB, never an image), shown on the
 * screen and drawn onto Cambridge's booklet where the name went before.
 *
 *   hubInk.pad({ name, title }) -> Promise<string | '' | null>
 *       the path ('' = sign with the typed name only, null = cancelled)
 *   hubInk.pad({ askName: true, name, title }) -> Promise<{name, ink} | null>
 *       the same pad with a name field on it, for a signer whose name the
 *       page does not know yet (a tutor on a fresh browser). No browser
 *       prompt() anywhere: the desktop pane cannot show one, and it looks
 *       like a fault.
 *   hubInk.svg(path, cls)       -> inline SVG for the screen
 *   hubInk.saved(name) / hubInk.remember(name, path)
 *       the last signature drawn on THIS browser for that name, so a tutor
 *       signing many booklets draws once. Local only; never synced.
 */
(function(){
  'use strict';
  var W = 300, H = 100, SAVE = 'chub:ink';
  var css = document.createElement('style');
  css.textContent =
    ".ink-overlay{position:fixed; inset:0; background:rgba(35,25,15,0.4); display:flex; align-items:center; justify-content:center; z-index:1000; padding:20px;}"+
    ".ink-modal{background:var(--paper,#fdfcf9); color:var(--ink,#1f1a14); border-radius:10px; border-top:3px solid var(--teal,#1f6f6b); padding:20px 22px; max-width:460px; width:100%; box-shadow:0 8px 30px rgba(0,0,0,0.18); font-family:'Karla',sans-serif;}"+
    ".ink-modal h3{font-family:'Newsreader',Georgia,serif; font-size:1.1rem; margin:0 0 4px;}"+
    ".ink-modal .ink-sub{font-size:0.82rem; color:var(--grey,#6b625a); margin:0 0 12px; line-height:1.5;}"+
    ".ink-name{display:block; margin:0 0 10px;}"+
    ".ink-name span{display:block; font-size:0.68rem; letter-spacing:.08em; text-transform:uppercase; color:var(--grey,#6b625a); font-weight:700; margin-bottom:4px;}"+
    ".ink-name input{width:100%; box-sizing:border-box; font-family:'Karla',sans-serif; font-size:0.95rem; padding:9px 11px; border:1.5px solid var(--sand-line,#e3dccf); border-radius:8px; background:var(--sand-deep,#efe9dc); color:inherit;}"+
    ".ink-pad{position:relative; width:100%; aspect-ratio:3/1; background:#fff; border:1.5px solid var(--sand-line,#e3dccf); border-radius:8px; overflow:hidden; touch-action:none; cursor:crosshair;}"+
    ".ink-pad canvas{display:block; width:100%; height:100%;}"+
    ".ink-pad .ink-line{position:absolute; left:8%; right:8%; bottom:26%; border-bottom:1px dashed var(--sand-line,#cfc6b6); pointer-events:none;}"+
    ".ink-pad .ink-hint{position:absolute; left:0; right:0; bottom:8%; text-align:center; font-size:0.72rem; color:var(--grey,#8a8078); pointer-events:none;}"+
    ".ink-bar{display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin-top:12px;}"+
    ".ink-bar .grow{flex:1;}"+
    ".ink-bar .btn{font-family:'Karla',sans-serif; font-size:0.84rem; font-weight:700; padding:9px 16px; border-radius:8px; border:0; background:var(--teal,#1f6f6b); color:#fff; cursor:pointer;}"+
    ".ink-bar .btn.quiet{background:none; color:var(--grey,#6b625a); border:1.5px solid var(--sand-line,#e3dccf);}"+
    ".ink-bar .btn:disabled{opacity:.45; cursor:not-allowed;}"+
    ".ink-bar .btn.primary:not(:disabled):hover{background:var(--teal-lifted,#2a7f7a);}"+
    "svg.ink{display:block; height:44px; width:auto; max-width:180px; color:var(--ink,#1f1a14);}";
  document.head.appendChild(css);

  function toPath(strokes){
    return strokes.filter(function(s){ return s.length; }).map(function(s){
      var out = 'M' + s[0][0] + ' ' + s[0][1];
      if (s.length === 1) out += ' L' + s[0][0] + ' ' + s[0][1];
      for (var i = 1; i < s.length; i++) out += ' L' + s[i][0] + ' ' + s[i][1];
      return out;
    }).join(' ');
  }
  function fromPath(path){
    var strokes = [], cur = null;
    (path || '').replace(/([ML])\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g, function(m, c, x, y){
      if (c === 'M') { cur = []; strokes.push(cur); }
      if (cur) cur.push([+x, +y]);
    });
    return strokes;
  }

  function svg(path, cls){
    if (!path) return '';
    return '<svg class="ink' + (cls ? ' ' + cls : '') + '" viewBox="0 0 ' + W + ' ' + H + '" aria-label="Signature"><path d="' + path.replace(/"/g, '') + '" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function saved(name){
    try { var v = JSON.parse(localStorage.getItem(SAVE) || 'null'); return v && v.name === name && v.ink ? v.ink : null; } catch (e) { return null; }
  }
  function remember(name, ink){ try { localStorage.setItem(SAVE, JSON.stringify({ name: name, ink: ink })); } catch (e) {} }

  function pad(opts){
    opts = opts || {};
    return new Promise(function(resolve){
      var overlay = document.createElement('div'); overlay.className = 'ink-overlay';
      overlay.innerHTML = '<div class="ink-modal" role="dialog" aria-modal="true">'
        + '<h3></h3><p class="ink-sub"></p>'
        + '<label class="ink-name"><span>Your name, to sign</span><input type="text" placeholder="Type your name"></label>'
        + '<div class="ink-pad"><canvas></canvas><div class="ink-line"></div><div class="ink-hint"></div></div>'
        + '<div class="ink-bar"><button type="button" class="btn quiet ink-clear">Clear</button><span class="grow"></span>'
        + '<button type="button" class="btn quiet ink-cancel">Cancel</button>'
        + '<button type="button" class="btn quiet ink-typed">Typed name only</button>'
        + '<button type="button" class="btn primary ink-ok" disabled>Sign</button></div></div>';
      overlay.querySelector('h3').textContent = opts.title || 'Sign';
      var nameRow = overlay.querySelector('.ink-name'), nameIn = nameRow.querySelector('input');
      if (opts.askName) { nameIn.value = opts.name || ''; overlay.querySelector('.ink-sub').textContent = 'Draw your signature with a finger, a pen or the mouse; the typed name and the moment stay on the record underneath.'; }
      else { nameRow.remove(); overlay.querySelector('.ink-sub').textContent = 'Signing as ' + (opts.name || '') + '. Draw your signature with a finger, a pen or the mouse; the typed name and the moment stay on the record underneath.'; }
      var nameNow = function(){ return opts.askName ? nameIn.value.trim() : (opts.name || ''); };
      var answer = function(ink){ return opts.askName ? { name: nameNow(), ink: ink } : ink; };
      var padEl = overlay.querySelector('.ink-pad'), canvas = overlay.querySelector('canvas'), hint = overlay.querySelector('.ink-hint');
      var ok = overlay.querySelector('.ink-ok'), strokes = [], drawing = null, prior = saved(opts.name);
      document.body.appendChild(overlay);

      var ctx = canvas.getContext('2d');
      function fit(){
        var r = padEl.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
        canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
        redraw();
      }
      function redraw(){
        var r = padEl.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.setTransform(dpr * r.width / W, 0, 0, dpr * r.height / H, 0, 0);
        ctx.lineWidth = 2.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#1f1a14';
        strokes.forEach(function(s){
          ctx.beginPath(); ctx.moveTo(s[0][0], s[0][1]);
          if (s.length === 1) ctx.lineTo(s[0][0], s[0][1]);
          for (var i = 1; i < s.length; i++) ctx.lineTo(s[i][0], s[i][1]);
          ctx.stroke();
        });
        ok.disabled = !strokes.length || !nameNow();
        hint.textContent = strokes.length ? '' : 'Sign here';
      }
      function pt(e){
        var r = padEl.getBoundingClientRect();
        return [Math.round(Math.max(0, Math.min(W, (e.clientX - r.left) / r.width * W)) * 10) / 10,
                Math.round(Math.max(0, Math.min(H, (e.clientY - r.top) / r.height * H)) * 10) / 10];
      }
      padEl.addEventListener('pointerdown', function(e){ if (e.button !== undefined && e.button !== 0) return; e.preventDefault(); padEl.setPointerCapture(e.pointerId); drawing = [pt(e)]; strokes.push(drawing); redraw(); });
      padEl.addEventListener('pointermove', function(e){ if (!drawing) return; e.preventDefault(); var p = pt(e), l = drawing[drawing.length - 1]; if (Math.abs(p[0] - l[0]) + Math.abs(p[1] - l[1]) < 1) return; drawing.push(p); redraw(); });
      function up(e){ if (!drawing) return; drawing = null; redraw(); }
      padEl.addEventListener('pointerup', up); padEl.addEventListener('pointercancel', up); padEl.addEventListener('pointerleave', up);

      if (prior) { strokes = fromPath(prior); hint.textContent = ''; }
      fit();
      if (opts.askName) { nameIn.addEventListener('input', function(){ var p2 = saved(nameNow()); if (p2 && !strokes.length) { strokes = fromPath(p2); } redraw(); }); if (!nameIn.value) setTimeout(function(){ nameIn.focus(); }, 0); }
      if (prior) { var note = document.createElement('div'); note.className = 'ink-sub'; note.style.marginTop = '8px'; note.textContent = 'Your saved signature from this browser. Clear to draw it again.'; padEl.after(note); }
      window.addEventListener('resize', fit);

      function done(v){ overlay.remove(); window.removeEventListener('resize', fit); document.removeEventListener('keydown', onKey); resolve(v); }
      function onKey(e){ if (e.key === 'Escape') done(null); }
      document.addEventListener('keydown', onKey);
      overlay.querySelector('.ink-clear').addEventListener('click', function(){ strokes = []; redraw(); });
      overlay.querySelector('.ink-cancel').addEventListener('click', function(){ done(null); });
      overlay.querySelector('.ink-typed').addEventListener('click', function(){ if (!nameNow()) { nameIn.focus(); return; } done(answer('')); });
      ok.addEventListener('click', function(){ var p = toPath(strokes); if (!p || !nameNow()) return; remember(nameNow(), p); done(answer(p)); });
      overlay.addEventListener('mousedown', function(e){ if (e.target === overlay) done(null); });
    });
  }

  window.hubInk = { pad: pad, svg: svg, saved: saved, remember: remember, toPath: toPath, fromPath: fromPath, W: W, H: H };
})();
