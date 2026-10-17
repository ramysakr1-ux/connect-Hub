/* THE MARKING PAGE'S HELP (17 Oct 2026).
 *
 * Ramy: "everything started with me wanting to improve the assignments...
 * use all the innovation that you can think of... as you're typing, the
 * screen is not crowded, but it will just show what you should watch out
 * for... the guideline would just appear over you while you're making a
 * comment... not fixed there, but just there as a reminder."
 *
 * One rule: the help comes to where you are, then gets out of the way.
 *   - Reading: a small card at the top of the marking panel shows what a Met
 *     answer looks like for the section you are reading, and its shortfalls.
 *   - Typing a criterion's note: its guidance floats beside the box, and goes
 *     when you leave it.
 *   - Margin comments, as in the Google Docs: select words in the work and a
 *     bar offers Comment, plus one-tap comments taken from the shortfalls for
 *     that section. A comment can be tied to a criterion; it is then listed
 *     under that criterion as evidence.
 *   - A note is a link until it is wanted, and an empty one never shows.
 *
 * Data: sub.margin = { sub1: [...], sub2: [...] }, each
 *   { id, loc, quote, text, crit, by, at }. A comment belongs to the round it
 *   was written on, so first-round comments stay on the first submission.
 *   loc is "t<section>" for a written section, "f:<field key>" for a table
 *   cell. The page calls hubMarking.afterRender(ctx) after every draw.
 */
(function () {
  var CTX = null;
  var esc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var $ = function (id) { return document.getElementById(id); };

  /* ---- the guidance, cut into blocks ---------------------------------- */
  function blocks(text) {
    return String(text || '').split(/\n{2,}/).map(function (b) {
      var lines = b.split('\n'); return { head: lines[0].trim(), body: lines.slice(1).join('\n'), all: b };
    }).filter(function (x) { return x.head; });
  }
  function letterOf(label) { var m = String(label || '').match(/^\s*([A-H])\b[.·\s]/); return m ? m[1] : ''; }
  /* The block for one place in the work: a written section by its letter
     (A. Choosing your text -> "A · Choosing the text"), a table row by its
     field name (Clarification of meaning -> "Meaning and clarification"). */
  function blockFor(loc) {
    var g = CTX && CTX.guide; if (!g || !g.sections || !loc) return null;
    var bl = blocks(g.sections);
    var sec = CTX.a.sections[+loc.getAttribute('data-sec')] || {};
    var field = loc.getAttribute('data-field');
    if (field) {
      var w = field.toLowerCase().split(/\s+/);
      var key = w[0] === 'clarification' ? 'clarification' : w[0] === 'anticipated' ? 'anticipated' : w[0];
      return bl.filter(function (b) { return b.head.toLowerCase().indexOf(key) >= 0 && !/^model/i.test(b.head); })[0] || null;
    }
    var L = letterOf(sec.label);
    return L ? (bl.filter(function (b) { return letterOf(b.head) === L; })[0] || null) : null;
  }
  function shortfalls(b) {
    if (!b) return [];
    var m = b.all.match(/Shortfalls:\s*([^\n]+)/);
    if (!m) return [];
    return m[1].split(/;\s*/).map(function (t) {
      t = t.replace(/\.$/, '').trim(); return t.charAt(0).toUpperCase() + t.slice(1);
    }).filter(function (t) { return t.length > 3 && t.length < 120; }).slice(0, 4);
  }

  /* ---- the floating card for the section being read -------------------- */
  var SHUT = {}, OBS = null, CUR = null;
  function paintFloat(loc) {
    var host = $('mkFloat'); if (!host) return;
    var b = blockFor(loc), id = b ? b.head : '';
    if (!b || SHUT[id]) { host.hidden = true; CUR = null; return; }
    if (CUR === id && !host.hidden) return;
    CUR = id;
    host.innerHTML = '<div class="mkf-top"><span>While you read: ' + esc(b.head) + '</span><button type="button" class="mkf-x" aria-label="Hide this">Hide</button></div>' +
      '<div class="mkf-body">' + (window.hubGuidanceHTML ? hubGuidanceHTML(b.body) : esc(b.body)) + '</div>';
    host.hidden = false;
    host.querySelector('.mkf-x').onclick = function () { SHUT[id] = 1; host.hidden = true; };
  }
  function watchReading() {
    if (OBS) OBS.disconnect();
    var locs = [].slice.call(document.querySelectorAll('#mkWork .mloc'));
    if (!locs.length || !('IntersectionObserver' in window)) return;
    var seen = new Map();
    OBS = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) { seen.set(e.target, e.isIntersecting ? e.boundingClientRect.top : null); });
      var best = null, bt = Infinity;
      seen.forEach(function (t, el) { if (t != null && t > -400 && t < bt) { bt = t; best = el; } });
      if (best) paintFloat(best);
    }, { rootMargin: '-15% 0px -45% 0px' });
    locs.forEach(function (l) { OBS.observe(l); });
  }

  /* ---- the criterion's guidance, beside its note ------------------------ */
  function showTip(i, anchor) {
    var g = CTX && CTX.guide; var t = g && g.crit && g.crit[i];
    var tip = $('mkTip'); if (!tip) { tip = document.createElement('div'); tip.id = 'mkTip'; tip.className = 'mk-tip'; tip.setAttribute('role', 'note'); document.body.appendChild(tip); }
    if (!t) { tip.hidden = true; return; }
    tip.innerHTML = '<div class="mkt-h">Watch out for: criterion ' + (+i + 1) + '</div>' + (window.hubGuidanceHTML ? hubGuidanceHTML(t) : esc(t));
    tip.hidden = false;
    var r = anchor.getBoundingClientRect(), w = Math.min(360, innerWidth - 32);
    tip.style.width = w + 'px';
    if (innerWidth >= 1080) {
      /* beside the panel, over the work's edge, level with the box */
      var panel = $('mkPanel').getBoundingClientRect();
      tip.style.left = Math.max(16, panel.left - w - 14) + 'px';
      tip.style.top = Math.min(Math.max(16, r.top - 20), innerHeight - tip.offsetHeight - 16) + 'px';
      tip.classList.remove('below');
    } else {
      tip.style.left = '16px';
      tip.style.top = Math.max(16, r.top - tip.offsetHeight - 10) + 'px';
      tip.classList.add('below');
    }
  }
  function hideTip() { var t = $('mkTip'); if (t) t.hidden = true; }

  /* ---- margin comments -------------------------------------------------- */
  function list(round) { var s = CTX.sub; s.margin = s.margin || {}; return (s.margin[round] = s.margin[round] || []); }
  function canWrite(round) { return CTX.marking && round === CTX.round; }
  function critShort(i) { var c = (CTX.a.criteria || [])[i]; var t = c ? (c.text || c) : ''; return (+i + 1) + '. ' + (t.length > 60 ? t.slice(0, 58) + '…' : t); }

  /* Highlight the first match of the quote inside one block of text. */
  function highlight(box, quote, id) {
    if (!quote) return false;
    var walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT, null), nodes = [], n, all = '';
    while ((n = walker.nextNode())) { nodes.push([n, all.length]); all += n.nodeValue; }
    var at = all.indexOf(quote); if (at < 0) return false;
    var end = at + quote.length;
    nodes.forEach(function (pair) {
      var node = pair[0], start = pair[1], stop = start + node.nodeValue.length;
      if (stop <= at || start >= end) return;
      var a = Math.max(0, at - start), b = Math.min(node.nodeValue.length, end - start);
      var mid = node.splitText(a); mid.splitText(b - a);
      var m = document.createElement('mark'); m.className = 'mc'; m.dataset.mc = id;
      mid.parentNode.insertBefore(m, mid); m.appendChild(mid);
    });
    return true;
  }
  function paintMargin() {
    var marking = CTX.marking;
    [].forEach.call(document.querySelectorAll('#mkWork .mloc'), function (loc) {
      var round = loc.getAttribute('data-round'), here = loc.getAttribute('data-loc');
      var items = list(round).filter(function (c) { return c.loc === here; });
      var gut = loc.querySelector('.mgut'); if (!gut) return;
      var box = loc.querySelector('.readonly');
      gut.innerHTML = items.map(function (c) {
        highlight(box, c.quote, c.id);
        return '<div class="mcard" data-mcard="' + c.id + '">' +
          (c.crit != null && c.crit !== '' ? '<span class="mc-crit">Criterion ' + (+c.crit + 1) + '</span>' : '') +
          '<p>' + esc(c.text) + '</p>' +
          '<span class="mc-by">' + esc(c.by || '') + '</span>' +
          (canWrite(round) ? '<span class="mc-acts"><button type="button" data-medit="' + c.id + '">Edit</button><button type="button" data-mdel="' + c.id + '">Delete</button></span>' : '') +
          '</div>';
      }).join('');
      loc.classList.toggle('has-mc', items.length > 0);
    });
    /* under each criterion: the margin comments tied to it */
    [].forEach.call(document.querySelectorAll('[data-linked]'), function (el) {
      var i = el.getAttribute('data-linked');
      var tied = list(CTX.round).filter(function (c) { return String(c.crit) === String(i); });
      el.innerHTML = tied.length ? '<div class="mk-tied"><span>From your margin comments</span>' + tied.map(function (c) {
        return '<button type="button" data-goto="' + c.id + '">“' + esc(c.quote.length > 50 ? c.quote.slice(0, 48) + '…' : c.quote) + '”: ' + esc(c.text) + '</button>';
      }).join('') + '</div>' : '';
    });
    if (!marking) return;
  }

  /* the bar that appears over a selection */
  var SEL = null;
  function bar() { var b = $('mkSelBar'); if (!b) { b = document.createElement('div'); b.id = 'mkSelBar'; b.className = 'mk-selbar'; b.hidden = true; document.body.appendChild(b); } return b; }
  function onSelect() {
    var s = window.getSelection(), b = bar();
    if (!CTX || !s || s.isCollapsed) { b.hidden = true; return; }
    var r = s.getRangeAt(0), box = r.commonAncestorContainer;
    box = box.nodeType === 1 ? box : box.parentNode;
    var loc = box.closest && box.closest('#mkWork .mloc');
    var q = s.toString().replace(/\s+/g, ' ').trim();
    if (!loc || !q || q.length < 2 || !canWrite(loc.getAttribute('data-round'))) { b.hidden = true; return; }
    var readonly = loc.querySelector('.readonly');
    var exact = s.toString(); if (readonly.textContent.indexOf(exact) < 0) exact = q;
    /* whole words: a selection that stops mid-word takes the rest of the word */
    var full = readonly.textContent, at = full.indexOf(exact);
    if (at >= 0) {
      var st = at, en = at + exact.length;
      while (st > 0 && /\w/.test(full[st - 1]) && /\w/.test(full[st])) st--;
      while (en < full.length && /\w/.test(full[en]) && /\w/.test(full[en - 1])) en++;
      exact = full.slice(st, en);
    }
    SEL = { loc: loc, quote: exact.trim().slice(0, 300) };
    var chips = shortfalls(blockFor(loc));
    b.innerHTML = '<button type="button" class="sb-main" data-sb="">Comment</button>' + chips.map(function (c, k) { return '<button type="button" data-sb="' + k + '">' + esc(c) + '</button>'; }).join('');
    b._chips = chips;
    b.hidden = false;
    var rr = r.getBoundingClientRect();
    var w = Math.min(b.offsetWidth, innerWidth - 24);
    b.style.left = Math.max(12, Math.min(rr.left, innerWidth - w - 12)) + 'px';
    b.style.top = (rr.bottom + 8 + b.offsetHeight > innerHeight ? rr.top - b.offsetHeight - 8 : rr.bottom + 8) + 'px';
  }
  /* the small editor, for a new comment or an old one */
  function editor(opts) {
    var ed = $('mkEditor'); if (!ed) { ed = document.createElement('div'); ed.id = 'mkEditor'; ed.className = 'mk-editor'; document.body.appendChild(ed); }
    var crit = (CTX.a.criteria || []);
    ed.innerHTML = '<div class="me-q">“' + esc(opts.quote.length > 140 ? opts.quote.slice(0, 138) + '…' : opts.quote) + '”</div>' +
      '<textarea id="meText" rows="3" placeholder="Your comment. The trainee reads it beside these words.">' + esc(opts.text || '') + '</textarea>' +
      '<label class="me-c">Tie it to a criterion <select id="meCrit"><option value="">None</option>' + crit.map(function (c, i) { return '<option value="' + i + '"' + (String(opts.crit) === String(i) ? ' selected' : '') + '>' + esc(critShort(i)) + '</option>'; }).join('') + '</select></label>' +
      '<div class="me-acts"><button type="button" class="me-cancel">Cancel</button><button type="button" class="me-save">Save the comment</button></div>';
    ed.hidden = false;
    var t = $('meText'); setTimeout(function () { t.focus(); t.setSelectionRange(t.value.length, t.value.length); }, 30);
    ed.querySelector('.me-cancel').onclick = function () { ed.hidden = true; };
    ed.querySelector('.me-save').onclick = function () {
      var text = t.value.trim(), cv = $('meCrit').value;
      ed.hidden = true;
      if (!text) { if (opts.id) remove(opts.id); return; }   /* an empty comment is no comment */
      var l = list(CTX.round);
      if (opts.id) { var c = l.filter(function (x) { return x.id === opts.id; })[0]; if (c) { c.text = text; c.crit = cv === '' ? null : +cv; } }
      else l.push({ id: 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), loc: opts.loc, quote: opts.quote, text: text, crit: cv === '' ? null : +cv, by: CTX.me, at: new Date().toISOString() });
      CTX.save(); CTX.rerender();
    };
  }
  function remove(id) { var l = list(CTX.round); var k = l.findIndex(function (x) { return x.id === id; }); if (k >= 0) l.splice(k, 1); CTX.save(); CTX.rerender(); }

  /* ---- wiring ---------------------------------------------------------- */
  document.addEventListener('mouseup', function (e) { if (e.target.closest && e.target.closest('#mkSelBar, #mkEditor')) return; setTimeout(onSelect, 10); });
  document.addEventListener('selectionchange', function () { var s = window.getSelection(); if (!s || s.isCollapsed) { var b = $('mkSelBar'); if (b && !b.matches(':hover')) setTimeout(function () { var s2 = window.getSelection(); if (!s2 || s2.isCollapsed) b.hidden = true; }, 200); } });
  document.addEventListener('touchend', function () { setTimeout(onSelect, 350); });
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target : null; if (!t || !CTX) return;
    var sb = t.closest('[data-sb]');
    if (sb && SEL) { var k = sb.getAttribute('data-sb'); var b = bar(); b.hidden = true; editor({ loc: SEL.loc.getAttribute('data-loc'), quote: SEL.quote, text: k === '' ? '' : b._chips[+k] + '.' }); window.getSelection().removeAllRanges(); return; }
    var ed = t.closest('[data-medit]');
    if (ed) { var c = list(CTX.round).filter(function (x) { return x.id === ed.getAttribute('data-medit'); })[0]; if (c) editor({ id: c.id, loc: c.loc, quote: c.quote, text: c.text, crit: c.crit }); return; }
    var del = t.closest('[data-mdel]'); if (del) { remove(del.getAttribute('data-mdel')); return; }
    var go = t.closest('[data-goto]');
    if (go) { var m = document.querySelector('mark[data-mc="' + go.getAttribute('data-goto') + '"]'); if (m) { m.scrollIntoView({ block: 'center', behavior: 'smooth' }); m.classList.remove('mc-hit'); void m.offsetWidth; m.classList.add('mc-hit'); } return; }
    var mk = t.closest('mark.mc');
    if (mk) { var card = document.querySelector('[data-mcard="' + mk.dataset.mc + '"]'); if (card) { card.classList.remove('mc-hit'); void card.offsetWidth; card.classList.add('mc-hit'); card.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } return; }
    var add = t.closest('[data-addnote]');
    if (add) { var i = add.getAttribute('data-addnote'); var ta = document.querySelector('[data-crit-comment="' + i + '"]'); add.hidden = true; ta.hidden = false; ta.focus(); return; }
    var tl = t.closest('[data-tip]');
    if (tl) { var tip = $('mkTip'); if (tip && !tip.hidden && tip._i === tl.getAttribute('data-tip')) { hideTip(); return; } showTip(tl.getAttribute('data-tip'), tl); $('mkTip')._i = tl.getAttribute('data-tip'); return; }
    if (!t.closest('#mkTip')) hideTip();
  });
  document.addEventListener('focusin', function (e) {
    var ta = e.target.closest && e.target.closest('[data-crit-comment]');
    if (ta) { showTip(ta.getAttribute('data-crit-comment'), ta); $('mkTip')._i = ta.getAttribute('data-crit-comment'); }
  });
  document.addEventListener('focusout', function (e) {
    var ta = e.target.closest && e.target.closest('[data-crit-comment]');
    if (!ta) return;
    setTimeout(hideTip, 120);
    /* an empty note folds back to its link */
    if (!ta.value.trim()) { ta.hidden = true; var a = document.querySelector('[data-addnote="' + ta.getAttribute('data-crit-comment') + '"]'); if (a) a.hidden = false; }
  });
  addEventListener('scroll', function () { var t = $('mkTip'); if (t && !t.hidden && document.activeElement && document.activeElement.matches && !document.activeElement.matches('[data-crit-comment]')) hideTip(); }, { passive: true });

  window.hubMarking = {
    afterRender: function (ctx) {
      CTX = ctx;
      var panel = $('mkPanel');
      if (panel && ctx.guide && ctx.guide.sections && !$('mkFloat')) {
        var f = document.createElement('div'); f.id = 'mkFloat'; f.className = 'mk-float'; f.hidden = true; panel.insertBefore(f, panel.firstChild);
      }
      CUR = null;
      paintMargin();
      watchReading();
    }
  };

  /* styles, once */
  if (!document.getElementById('hub-marking-css')) {
    var st = document.createElement('style'); st.id = 'hub-marking-css';
    st.textContent = [
      '.mloc{position:relative;}',
      '.mloc .readonly{margin-bottom:10px;}',
      'mark.mc{background:color-mix(in oklab, var(--gold-lifted) 34%, transparent); color:inherit; border-bottom:2px solid var(--gold); border-radius:2px; cursor:pointer; padding:0 1px;}',
      '.mgut:empty{display:none;}',
      '.mgut{display:flex; flex-direction:column; gap:8px; margin:-2px 0 12px;}',
      '.mcard{background:var(--paper); border:1px solid var(--amber-edge); border-left:3px solid var(--gold); border-radius:var(--r-strip); padding:8px 11px; font-size:0.84rem; line-height:1.5;}',
      '.mcard p{margin:2px 0 4px;}',
      '.mc-crit{display:inline-block; font-size:0.7rem; font-weight:700; color:var(--teal); text-transform:uppercase; letter-spacing:.06em;}',
      '.mc-by{font-size:0.74rem; color:var(--grey);}',
      '.mc-acts{float:right;} .mc-acts button{background:none; border:none; padding:0 0 0 10px; font:600 0.76rem Karla,sans-serif; color:var(--teal); cursor:pointer; text-decoration:underline; text-decoration-color:var(--sand-line);}',
      '.mc-acts button:hover{background:none !important; box-shadow:none !important;}',
      '.mc-hit{animation:mcHit 1.3s ease-out 1;} @keyframes mcHit{0%{box-shadow:0 0 0 3px oklch(70% 0.12 72 / .7);}100%{box-shadow:0 0 0 3px oklch(70% 0.12 72 / 0);}}',
      '@media (min-width:1280px){ .mloc.has-mc{display:grid; grid-template-columns:minmax(0,1fr) 230px; gap:12px; align-items:start;} .mloc.has-mc .mgut{margin:0;} }',
      '.mk-selbar{position:fixed; z-index:60; display:flex; flex-wrap:wrap; gap:6px; max-width:min(560px, calc(100vw - 24px)); padding:7px; background:var(--ink); border-radius:12px; box-shadow:0 10px 30px oklch(20% 0.02 60 / .3);}',
      '.mk-selbar button{font:600 0.78rem Karla,sans-serif; color:var(--paper); background:oklch(32% 0.02 65); border:none; border-radius:8px; padding:7px 10px; cursor:pointer; text-align:left;}',
      '.mk-selbar button.sb-main{background:var(--gold); color:var(--ink); font-weight:700;}',
      '.mk-selbar button:hover{background:oklch(40% 0.03 65) !important; box-shadow:none !important;} .mk-selbar button.sb-main:hover{background:var(--gold-lifted) !important;}',
      '.mk-editor{position:fixed; z-index:61; left:50%; top:50%; transform:translate(-50%,-50%); width:min(460px, calc(100vw - 32px)); background:var(--paper); border:1px solid var(--sand-line); border-top:3px solid var(--gold); border-radius:var(--r-card); padding:16px; box-shadow:0 18px 50px oklch(20% 0.02 60 / .28);}',
      '.me-q{font-size:0.84rem; color:var(--grey); font-style:italic; margin:0 0 10px; line-height:1.45;}',
      '.mk-editor textarea{width:100%; box-sizing:border-box; font:inherit; font-size:0.9rem; padding:9px 11px; border:1.5px solid var(--row-line); border-radius:6px; resize:vertical;}',
      '.me-c{display:block; margin:10px 0 0; font-size:0.8rem; font-weight:700;} .me-c select{display:block; width:100%; margin-top:5px; font:inherit; font-weight:400; padding:7px; border:1.5px solid var(--row-line); border-radius:6px; background:var(--field);}',
      '.me-acts{display:flex; justify-content:flex-end; gap:10px; margin-top:14px;}',
      '.me-acts button{font:700 0.86rem Karla,sans-serif; border-radius:var(--r-control); padding:9px 16px; cursor:pointer; border:1.5px solid var(--sand-line); background:var(--paper); color:var(--ink);}',
      '.me-acts .me-save{background:var(--teal); border-color:var(--teal); color:var(--paper);}',
      '.mk-float{position:sticky; top:0; z-index:3; margin:0 0 12px; background:var(--sand); border:1px solid var(--sand-line); border-left:3px solid var(--as, var(--teal)); border-radius:var(--r-strip); box-shadow:0 6px 18px oklch(30% 0.02 70 / .08); max-height:42vh; overflow:auto; font-size:0.82rem; line-height:1.5;}',
      '.mkf-top{display:flex; justify-content:space-between; align-items:center; gap:10px; padding:8px 12px; font-weight:700; color:var(--as, var(--teal)); border-bottom:1px solid var(--sand-line); position:sticky; top:0; background:var(--sand);}',
      '.mkf-x{background:none; border:none; font:600 0.76rem Karla,sans-serif; color:var(--grey); cursor:pointer; text-decoration:underline;} .mkf-x:hover{background:none !important; box-shadow:none !important;}',
      '.mkf-body{padding:4px 12px 10px;} .mkf-body p{margin:5px 0;} .mkf-body h4{margin:8px 0 2px; font-size:0.82rem;}',
      '@media (max-width:1079px){ .mk-float{display:none;} }',
      '.mk-tip{position:fixed; z-index:59; background:var(--sand); border:1px solid var(--sand-line); border-left:3px solid var(--teal); border-radius:var(--r-strip); padding:9px 13px 10px; font-size:0.82rem; line-height:1.5; box-shadow:0 12px 34px oklch(25% 0.02 60 / .18); max-height:60vh; overflow:auto;}',
      '.mkt-h{font-weight:700; color:var(--teal); margin:0 0 4px;} .mk-tip p{margin:4px 0;}',
      '.mk-tied{margin:8px 0 0; padding:7px 10px; border-radius:var(--r-strip); background:var(--gold-wash); font-size:0.8rem;}',
      '.mk-tied span{display:block; font-weight:700; font-size:0.72rem; text-transform:uppercase; letter-spacing:.06em; color:var(--gold-deep); margin:0 0 3px;}',
      '.mk-tied button{display:block; text-align:left; background:none; border:none; padding:3px 0; font:inherit; color:var(--ink); cursor:pointer;} .mk-tied button:hover{background:none !important; box-shadow:none !important; text-decoration:underline;}',
      '@media print{ .mk-selbar,.mk-editor,.mk-tip,.mk-float{display:none !important;} }'
    ].join('\n');
    (document.head || document.documentElement).appendChild(st);
  }
})();
