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
  /* The one-tap comments for a section: "Quick: Label = Comment" lines in the
     guidance (17 Oct 2026, Ramy: "is that a headline?"), a short label on the
     button and a finished comment to the trainee in the box. A guidance with
     none falls back to its shortfalls, label and text the same. */
  function quickFor(b) {
    if (!b) return [];
    var q = b.all.split('\n').filter(function (l) { return /^Quick:/.test(l); }).map(function (l) {
      var m = l.replace(/^Quick:\s*/, '').split(/\s*=\s*/); return { label: m[0], text: m.slice(1).join(' = ') || m[0], good: /^good\b/i.test(m[0]) };
    });
    return q.length ? q : shortfalls(b).map(function (t) { return { label: t, text: t + '.', good: false }; });
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
  function canWrite(round) {
    if (secondMode()) return round === secondRound();
    return CTX.marking && round === CTX.round;
  }
  function writeRound() { return secondMode() ? secondRound() : CTX.round; }
  function mine(c) { return !c.by || c.by === CTX.me; }
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
        return '<div class="mcard' + (c.role === 'second' ? ' by-second' : '') + '" data-mcard="' + c.id + '">' +
          (c.crit != null && c.crit !== '' ? '<span class="mc-crit">Criterion ' + (+c.crit + 1) + '</span>' : '') +
          '<p>' + esc(c.text) + '</p>' +
          '<span class="mc-by">' + esc(c.by || '') + '</span>' +
          (canWrite(round) && mine(c) ? '<span class="mc-acts"><button type="button" data-medit="' + c.id + '">Edit</button><button type="button" data-mdel="' + c.id + '">Delete</button></span>' : '') +
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
    /* No ready-made comments (Ramy, 17 Oct 2026: "everyone will just sound
       the same... copy-paste it from each other"). The bar only opens the
       comment box; the guidance stays in the reading card as a reminder. */
    var chips = [];
    b.innerHTML = '<button type="button" class="sb-main" data-sb="">Comment</button>' + (chips.length ? '<span class="sb-lab">or a quick one:</span>' : '') + chips.map(function (c, k) { return '<button type="button"' + (c.good ? ' class="sb-good"' : '') + ' data-sb="' + k + '" title="' + esc(c.text) + '">' + esc(c.label) + '</button>'; }).join('');
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
      var l = list(writeRound());
      if (opts.id) { var c = l.filter(function (x) { return x.id === opts.id; })[0]; if (c) { c.text = text; c.crit = cv === '' ? null : +cv; } }
      else l.push({ id: 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), loc: opts.loc, quote: opts.quote, text: text, crit: cv === '' ? null : +cv, by: CTX.me, role: secondMode() ? 'second' : 'first', at: new Date().toISOString() });
      CTX.save(); CTX.rerender();
    };
  }
  function remove(id) { var l = list(writeRound()); var k = l.findIndex(function (x) { return x.id === id; }); if (k >= 0) l.splice(k, 1); CTX.save(); CTX.rerender(); }

  /* ---- wiring ---------------------------------------------------------- */
  document.addEventListener('mouseup', function (e) { if (e.target.closest && e.target.closest('#mkSelBar, #mkEditor')) return; setTimeout(onSelect, 10); });
  document.addEventListener('selectionchange', function () { var s = window.getSelection(); if (!s || s.isCollapsed) { var b = $('mkSelBar'); if (b && !b.matches(':hover')) setTimeout(function () { var s2 = window.getSelection(); if (!s2 || s2.isCollapsed) b.hidden = true; }, 200); } });
  document.addEventListener('touchend', function () { setTimeout(onSelect, 350); });
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target : null; if (!t || !CTX) return;
    var sb = t.closest('[data-sb]');
    if (sb && SEL) { var k = sb.getAttribute('data-sb'); var b = bar(); b.hidden = true; editor({ loc: SEL.loc.getAttribute('data-loc'), quote: SEL.quote, text: k === '' ? '' : b._chips[+k].text }); window.getSelection().removeAllRanges(); return; }
    var ed = t.closest('[data-medit]');
    if (ed) { var c = list(writeRound()).filter(function (x) { return x.id === ed.getAttribute('data-medit'); })[0]; if (c) editor({ id: c.id, loc: c.loc, quote: c.quote, text: c.text, crit: c.crit }); return; }
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


  /* ======================= STEP TWO (17 Oct 2026) ======================= */

  /* ---- the checks Lite can do before you mark ----------------------------
     Only what can be told from the text. Each line is ticked, flagged for a
     look, or just information; a flag is never a mark. */
  function snapNow() { var s = CTX.sub; return CTX.marking ? s[CTX.round] : (s.sub2 || s.sub1); }
  function checksHTML() {
    var snap = snapNow(); if (!snap || !window.hubWorkChecks) return '';
    var items = hubWorkChecks(CTX.a, snap, CTX.key, 'tutor');
    var looks = items.filter(function (x) { return x.state === 'look'; }).length;
    return '<details class="guide-box mk-checks"' + (looks ? ' open' : '') + '><summary>Before you mark: ' + items.length + ' checks' + (looks ? ', ' + looks + ' to look at' : ', all clear') + '</summary><div class="gb"><ul class="mkc">' +
      items.map(function (x) { return '<li class="' + x.state + '"><b>' + (x.state === 'ok' ? 'Done' : x.state === 'look' ? 'Look' : 'Note') + '</b><span>' + esc(x.label) + (x.detail ? '<small>' + esc(x.detail) + '</small>' : '') + '</span></li>'; }).join('') +
      '</ul><p class="mkc-foot">Lite checks what it can read. The judgement is yours.</p></div></details>';
  }

  /* ---- double marking (not blind: the second marker sees everything) ---- */
  function allMarked(r) { var cr = CTX.a.criteria || [], m = CTX.sub.criteriaMarks[r] || []; return cr.length > 0 && cr.every(function (c, i) { return m[i] === true || m[i] === false; }); }
  function secondRound() {
    if (CTX.marking) return allMarked(CTX.round) ? CTX.round : null;
    if (CTX.sub.sub2 && allMarked('sub2')) return 'sub2';
    return allMarked('sub1') ? 'sub1' : null;
  }
  function modeKey() { return 'mk2:' + (CTX.trainee || '') + ':' + CTX.key; }
  function secondMode() { try { return sessionStorage.getItem(modeKey()) === '1'; } catch (e) { return false; } }
  function setSecondMode(on) { try { on ? sessionStorage.setItem(modeKey(), '1') : sessionStorage.removeItem(modeKey()); } catch (e) {} }
  function secRec(r) { var s = CTX.sub; s.second = s.second || {}; return (s.second[r] = s.second[r] || { by: '', at: '', crit: {}, done: false }); }
  function secondHTML() {
    var r = secondRound(); if (!r) return '';
    var s = CTX.sub, cr = CTX.a.criteria || [], first = (s.markers && s.markers.first) || 'the first marker';
    var rec = (s.second || {})[r], mode = secondMode();
    var disagree = rec ? cr.map(function (c, i) { return i; }).filter(function (i) { return rec.crit[i] && rec.crit[i].agree === false; }) : [];
    var decided = rec ? cr.filter(function (c, i) { return rec.crit[i] && typeof rec.crit[i].agree === 'boolean'; }).length : 0;
    var roundWord = r === 'sub2' ? 'the resubmission' : 'the first submission';
    if (!mode) {
      if (!rec || !decided) return '<div class="card mk-second"><h2>Double marking</h2><p class="mk-how">First marker: <b>' + esc(first) + '</b>. If this one is in the double-marked sample, the second marker sees every mark and note on ' + roundWord + ', agrees or disagrees with each, and initials it.</p><button type="button" class="mk-btn" data-second="on">Second-mark this</button></div>';
      return '<div class="card mk-second"><h2>Double marking</h2><p class="mk-how">First marker <b>' + esc(first) + '</b>, second marker <b>' + esc(rec.by) + '</b>' + (rec.done ? '' : ' (not finished: ' + decided + ' of ' + cr.length + ')') + '.</p>' +
        (disagree.length ? '<div class="mk-disagree"><b>The markers disagree on criterion ' + disagree.map(function (i) { return i + 1; }).join(' and ') + '.</b> ' + (CTX.marking ? 'Settle it between you before it goes back to the trainee.' : 'Talk it through and record what you agree.') + disagree.map(function (i) { var n = rec.crit[i].note; return n ? '<span>' + (i + 1) + ': ' + esc(n) + '</span>' : ''; }).join('') + '</div>' : (rec.done ? '<p class="mk-agree">Agreed on all ' + cr.length + ' criteria.</p>' : '')) +
        '<button type="button" class="mk-btn quiet" data-second="on">' + (rec.done ? 'Open the second marking' : 'Carry on second marking') + '</button></div>';
    }
    var me = CTX.me || '';
    var m = s.criteriaMarks[r] || [], notes = (s.criteriaComments || {})[r] || [];
    return '<div class="card mk-second on"><h2>Second marking</h2>' +
      '<p class="mk-how">You see ' + esc(first) + '’s marks and notes on ' + roundWord + '. Agree or disagree with each; a note is optional. Your margin comments show in teal with your name.' + (me && me === first ? ' <b>You were the first marker: the second should be another tutor.</b>' : '') + (me ? '' : ' <b>Put your name in the header first: it initials the record.</b>') + '</p>' +
      cr.map(function (c, i) {
        var x = (rec && rec.crit[i]) || {}, note = x.note || '';
        return '<div class="sm-row"><div class="sm-c"><span class="mk-n">' + (i + 1) + '</span>' + esc(c.text || c) + '</div>' +
          '<div class="sm-first"><span class="crit-toggle ' + (m[i] === true ? 'met' : 'not') + '" style="cursor:default">' + (m[i] === true ? 'Met' : 'Not met') + '</span>' + (notes[i] ? '<span class="sm-fn">' + esc(notes[i]) + '</span>' : '') + '</div>' +
          '<div class="sm-acts"><button type="button" class="sm-b' + (x.agree === true ? ' on' : '') + '" data-agree="' + i + '" aria-pressed="' + (x.agree === true) + '">Agree</button><button type="button" class="sm-b no' + (x.agree === false ? ' on' : '') + '" data-disagree="' + i + '" aria-pressed="' + (x.agree === false) + '">Disagree</button>' +
          '<button type="button" class="mk-addnote" data-snote="' + i + '"' + (note ? ' hidden' : '') + '>Add a note</button></div>' +
          '<textarea class="sm-note" data-snotebox="' + i + '" rows="2" placeholder="Why, briefly. The first marker reads this."' + (note ? '' : ' hidden') + '>' + esc(note) + '</textarea></div>';
      }).join('') +
      '<button type="button" class="mk-btn quiet" data-second="off">Done</button></div>';
  }
  function secondSet(i, patch) {
    var r = secondRound(); if (!r) return;
    var rec = secRec(r), cr = CTX.a.criteria || [];
    rec.crit[i] = Object.assign({}, rec.crit[i] || {}, patch);
    rec.by = CTX.me || rec.by || 'Second marker'; rec.at = new Date().toISOString();
    rec.done = cr.every(function (c, k) { return rec.crit[k] && typeof rec.crit[k].agree === 'boolean'; });
    var mk = CTX.sub.markers = CTX.sub.markers || { first: '', second: '', doubleMarked: false };
    if (rec.done) { mk.second = rec.by; mk.doubleMarked = true; }
    CTX.save();
  }
  /* the first marker sees a disagreement under the criterion itself */
  function paintDisagreements() {
    var r = CTX.marking ? CTX.round : null; if (!r) return;
    var rec = (CTX.sub.second || {})[r]; if (!rec) return;
    Object.keys(rec.crit || {}).forEach(function (i) {
      var x = rec.crit[i]; if (x.agree !== false) return;
      var host = document.querySelector('[data-linked="' + i + '"]'); if (!host) return;
      host.insertAdjacentHTML('beforebegin', '<div class="mk-disagree small"><b>' + esc(rec.by) + ' disagrees.</b>' + (x.note ? ' ' + esc(x.note) : '') + '</div>');
    });
  }

  /* ---- keys: M met, N not met, J and K next and previous ---------------- */
  var CURI = 0;
  function markCur() { [].forEach.call(document.querySelectorAll('.critrow.mk-cur'), function (r) { r.classList.remove('mk-cur'); }); var b = document.querySelector('.crit-toggle[data-crit="' + CURI + '"]'); if (b) { var row = b.closest('.critrow'); row.classList.add('mk-cur'); } }
  document.addEventListener('keydown', function (e) {
    if (!CTX || !CTX.marking || secondMode()) return;
    var t = e.target; if (t && (t.matches('input, textarea, select, [contenteditable]') || (t.closest && t.closest('#mkEditor')))) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var n = (CTX.a.criteria || []).length; if (!n) return;
    var key = e.key.toLowerCase();
    if (key === 'm' || key === 'n') { e.preventDefault(); var v = key === 'm'; var i = CURI; var next = i; var marks = CTX.sub.criteriaMarks[CTX.round] || []; for (var k = 1; k <= n; k++) { var j = (i + k) % n; if (j !== i && marks[j] !== true && marks[j] !== false) { next = j; break; } } CURI = next; CTX.setMark(i, v); return; }
    if (key === 'j' || e.key === 'ArrowDown') { if (key !== 'j' && !document.querySelector('.critrow.mk-cur')) return; e.preventDefault(); CURI = Math.min(n - 1, CURI + 1); markCur(); var r1 = document.querySelector('.critrow.mk-cur'); if (r1) r1.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); return; }
    if (key === 'k' || e.key === 'ArrowUp') { if (key !== 'k' && !document.querySelector('.critrow.mk-cur')) return; e.preventDefault(); CURI = Math.max(0, CURI - 1); markCur(); var r2 = document.querySelector('.critrow.mk-cur'); if (r2) r2.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); return; }
  });

  /* ---- preview as the trainee will see it ------------------------------- */
  function preview() {
    var a = CTX.a, r = CTX.round, cr = a.criteria || [], m = CTX.sub.criteriaMarks[r] || [];
    var notes = cr.map(function (c, i) { var ta = document.querySelector('[data-crit-comment="' + i + '"]'); return ta ? ta.value.trim() : (((CTX.sub.criteriaComments || {})[r] || [])[i] || ''); });
    var gen = (($('comment') || {}).value || '').trim(), out = CTX.outcome();
    var mc = list(r);
    var ov = $('mkPreview'); if (!ov) { ov = document.createElement('div'); ov.id = 'mkPreview'; ov.className = 'mk-prev-wrap'; document.body.appendChild(ov); }
    ov.className = 'mk-prev-wrap as-' + CTX.key;
    ov.innerHTML = '<div class="mk-prev" role="dialog" aria-label="What the trainee will see">' +
      '<div class="mkp-top"><span>What the trainee will see when you save and return it</span><button type="button" data-prevclose>Close</button></div>' +
      '<div class="mkp-band"><p>' + esc(a.title) + '</p><h3>' + (out ? esc(out) : 'Not decided yet: mark every criterion first') + '</h3></div>' +
      (gen ? '<div class="mkp-gen">' + esc(gen).replace(/\n/g, '<br>') + '</div>' : '') +
      '<ul class="mkp-crit">' + cr.map(function (c, i) { return '<li><span class="crit-toggle ' + (m[i] === true ? 'met' : m[i] === false ? 'not' : '') + '" style="cursor:default">' + (m[i] === true ? 'Met' : m[i] === false ? 'Not met' : 'Not marked') + '</span><div><b>' + esc(c.text || c) + '</b>' + (notes[i] ? '<p>' + esc(notes[i]) + '</p>' : '') + '</div></li>'; }).join('') + '</ul>' +
      (mc.length ? '<h4>Comments on her text</h4><ul class="mkp-mc">' + mc.map(function (c) { return '<li><q>' + esc(c.quote) + '</q><p>' + esc(c.text) + '</p></li>'; }).join('') + '</ul>' : '') +
      '</div>';
    ov.hidden = false;
  }

  function paintStep2() {
    var panel = $('mkPanel'); if (!panel) return;
    /* checks, at the top of the panel under the reading card */
    var ch = checksHTML();
    if (ch) { var holder = document.createElement('div'); holder.id = 'mkChecks'; holder.innerHTML = ch; var f = $('mkFloat'); panel.insertBefore(holder, f ? f.nextSibling : panel.firstChild); }
    /* double marking, above the marker record */
    var sh = secondHTML();
    if (sh) { var marker = panel.querySelector('.mk-marker'); var box = document.createElement('div'); box.innerHTML = sh; panel.insertBefore(box.firstChild, marker || null); }
    if (secondMode()) { var crit = $('mkCrit'); if (crit) crit.classList.add('mk-dim'); var sec = panel.querySelector('.mk-second.on'); if (sec) sec.scrollIntoView({ block: 'start' }); }
    paintDisagreements();
    /* the preview, beside Save; the keys, under the instructions */
    var acts = document.querySelector('#mkCrit .actions');
    if (acts && !$('mkPrevBtn')) acts.insertAdjacentHTML('afterbegin', '<button type="button" class="btn btn-quiet" id="mkPrevBtn">Preview as trainee</button>');
    var how = document.querySelector('#mkCrit .mk-how');
    if (how && CTX.marking && innerWidth >= 1080) how.insertAdjacentHTML('afterend', '<p class="mk-keys">On a keyboard: M for Met, N for Not met, J and K for the next and the previous criterion.</p>');
    markCur();
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target : null; if (!t || !CTX) return;
    var sm = t.closest('[data-second]'); if (sm) { setSecondMode(sm.getAttribute('data-second') === 'on'); CTX.rerender(); return; }
    var ag = t.closest('[data-agree]'); if (ag) { secondSet(ag.getAttribute('data-agree'), { agree: true }); CTX.rerender(); return; }
    var dg = t.closest('[data-disagree]'); if (dg) { var i = dg.getAttribute('data-disagree'); secondSet(i, { agree: false }); CTX.rerender(); setTimeout(function () { var b = document.querySelector('[data-snote="' + i + '"]'); if (b && !b.hidden) b.click(); }, 30); return; }
    var sn = t.closest('[data-snote]'); if (sn) { var j = sn.getAttribute('data-snote'), ta = document.querySelector('[data-snotebox="' + j + '"]'); sn.hidden = true; ta.hidden = false; ta.focus(); return; }
    if (t.closest('#mkPrevBtn')) { preview(); return; }
    if (t.closest('[data-prevclose]') || t.id === 'mkPreview') { var ov = $('mkPreview'); if (ov) ov.hidden = true; return; }
    var crit = t.closest('.crit-toggle[data-crit]'); if (crit) CURI = +crit.getAttribute('data-crit');
  });
  document.addEventListener('input', function (e) {
    var ta = e.target.closest && e.target.closest('[data-snotebox]'); if (!ta) return;
    secondSet(ta.getAttribute('data-snotebox'), { note: ta.value });
  });
  document.addEventListener('focusout', function (e) {
    var ta = e.target.closest && e.target.closest('[data-snotebox]'); if (!ta || ta.value.trim()) return;
    ta.hidden = true; var b = document.querySelector('[data-snote="' + ta.getAttribute('data-snotebox') + '"]'); if (b) b.hidden = false;
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { var ov = $('mkPreview'); if (ov && !ov.hidden) ov.hidden = true; var ed = $('mkEditor'); if (ed && !ed.hidden) ed.hidden = true; } });

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
      paintStep2();
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
      '.mk-pair .mloc.has-mc{display:block !important;}',
      '@media (min-width:1280px){ .mloc.has-mc{display:grid; grid-template-columns:minmax(0,1fr) 230px; gap:12px; align-items:start;} .mloc.has-mc .mgut{margin:0;} }',
      '.mk-selbar{position:fixed; z-index:60; display:flex; flex-wrap:wrap; gap:6px; max-width:min(560px, calc(100vw - 24px)); padding:7px; background:var(--ink); border-radius:12px; box-shadow:0 10px 30px oklch(20% 0.02 60 / .3);}',
      '.mk-selbar button{font:600 0.78rem Karla,sans-serif; color:var(--paper); background:oklch(32% 0.02 65); border:none; border-radius:8px; padding:7px 10px; cursor:pointer; text-align:left;}',
      '.mk-selbar button.sb-main{background:var(--gold); color:var(--ink); font-weight:700;}',
      '.mk-selbar .sb-lab{flex-basis:100%; font:600 0.72rem Karla,sans-serif; color:oklch(80% 0.02 70); padding:2px 2px 0;}',
      '.mk-selbar button.sb-good{background:oklch(38% 0.06 160); color:var(--paper);}',
      '.mk-selbar button:hover{background:oklch(40% 0.03 65) !important; box-shadow:none !important;} .mk-selbar button.sb-main:hover{background:var(--gold-lifted) !important;}',
      '.mk-editor{position:fixed; z-index:61; left:50%; top:50%; transform:translate(-50%,-50%); width:min(460px, calc(100vw - 32px)); background:var(--paper); border:1px solid var(--sand-line); border-top:3px solid var(--gold); border-radius:var(--r-card); padding:16px; box-shadow:0 18px 50px oklch(20% 0.02 60 / .28);}',
      '.me-q{font-size:0.84rem; color:var(--grey); font-style:italic; margin:0 0 10px; line-height:1.45;}',
      '.mk-editor textarea{width:100%; box-sizing:border-box; font:inherit; font-size:0.9rem; padding:9px 11px; border:1.5px solid var(--row-line); border-radius:6px; resize:vertical;}',
      '.me-c{display:block; margin:10px 0 0; font-size:0.8rem; font-weight:700;} .me-c select{display:block; width:100%; margin-top:5px; font:inherit; font-weight:400; padding:7px; border:1.5px solid var(--row-line); border-radius:6px; background:var(--field);}',
      '.me-acts{display:flex; justify-content:flex-end; gap:10px; margin-top:14px;}',
      '.me-acts button{font:700 0.86rem Karla,sans-serif; border-radius:var(--r-control); padding:9px 16px; cursor:pointer; border:1.5px solid var(--sand-line); background:var(--paper); color:var(--ink);}',
      '.me-acts .me-save{background:var(--teal); border-color:var(--teal); color:var(--paper);}',
      '.mk-float{position:relative; margin:0 0 12px; background:var(--sand); border:1px solid var(--sand-line); border-left:3px solid var(--as, var(--teal)); border-radius:var(--r-strip); box-shadow:0 6px 18px oklch(30% 0.02 70 / .08); max-height:42vh; overflow:auto; font-size:0.82rem; line-height:1.5;}',
      '.mkf-top{display:flex; justify-content:space-between; align-items:center; gap:10px; padding:8px 12px; font-weight:700; color:var(--as, var(--teal)); border-bottom:1px solid var(--sand-line); position:sticky; top:0; background:var(--sand);}',
      '.mkf-x{background:none; border:none; font:600 0.76rem Karla,sans-serif; color:var(--grey); cursor:pointer; text-decoration:underline;} .mkf-x:hover{background:none !important; box-shadow:none !important;}',
      '.mkf-body{padding:4px 12px 10px;} .mkf-body p{margin:5px 0;} .mkf-body h4{margin:8px 0 2px; font-size:0.82rem;}',
      '@media (max-width:1079px){ .mk-float{display:none;} }',
      '.mk-tip{position:fixed; z-index:59; background:var(--sand); border:1px solid var(--sand-line); border-left:3px solid var(--teal); border-radius:var(--r-strip); padding:9px 13px 10px; font-size:0.82rem; line-height:1.5; box-shadow:0 12px 34px oklch(25% 0.02 60 / .18); max-height:60vh; overflow:auto;}',
      '.mkt-h{font-weight:700; color:var(--teal); margin:0 0 4px;} .mk-tip p{margin:4px 0;}',
      '.mk-tied{margin:8px 0 0; padding:7px 10px; border-radius:var(--r-strip); background:var(--gold-wash); font-size:0.8rem;}',
      '.mk-tied span{display:block; font-weight:700; font-size:0.72rem; text-transform:uppercase; letter-spacing:.06em; color:var(--gold-deep); margin:0 0 3px;}',
      '.mk-tied button{display:block; text-align:left; background:none; border:none; padding:3px 0; font:inherit; color:var(--ink); cursor:pointer;} .mk-tied button:hover{background:none !important; box-shadow:none !important; text-decoration:underline;}',
      '.mcard.by-second{border-color:color-mix(in oklab, var(--teal) 40%, var(--sand-line)); border-left-color:var(--teal);}',
      '.mk-checks{margin:0 0 12px;} .mkc{list-style:none; margin:4px 0 0; padding:0;} .mkc li{display:flex; gap:10px; align-items:flex-start; padding:6px 0; border-top:1px solid var(--row-line); font-size:0.82rem; line-height:1.45;} .mkc li:first-child{border-top:none;}',
      '.mkc b{flex:none; width:40px; font-size:0.7rem; text-transform:uppercase; letter-spacing:.06em; padding-top:1px;} .mkc .ok b{color:var(--mark-met-text);} .mkc .look b{color:var(--gold-deep);} .mkc .info b{color:var(--grey);}',
      '.mkc small{display:block; color:var(--grey); font-size:0.78rem;} .mkc-foot{font-size:0.76rem; color:var(--grey); margin:6px 0 0;}',
      '.mk-btn{font:700 0.86rem Karla,sans-serif; border-radius:var(--r-control); padding:9px 16px; cursor:pointer; border:1.5px solid var(--teal); background:var(--paper); color:var(--teal);} .mk-btn.quiet{border-color:var(--sand-line); color:var(--ink); margin-top:10px;}',
      '.mk-second.on{border-left-color:var(--teal);} .mk-second .mk-agree{color:var(--mark-met-text); font-weight:600; font-size:0.86rem; margin:0;}',
      '.mk-disagree{margin:8px 0; padding:8px 11px; border-radius:var(--r-strip); background:var(--gold-wash); border:1px solid var(--amber-edge); border-left:4px solid var(--amber-edge); font-size:0.84rem; line-height:1.5;} .mk-disagree span{display:block; margin-top:4px;} .mk-disagree.small{margin:6px 0 0; font-size:0.8rem;}',
      '.sm-row{padding:10px 0; border-top:1px solid var(--row-line);} .sm-c{font-size:0.86rem; line-height:1.45; margin:0 0 6px;}',
      '.sm-first{display:flex; gap:10px; align-items:flex-start; font-size:0.82rem; color:var(--grey); margin:0 0 8px;} .sm-fn{line-height:1.45;}',
      '.sm-acts{display:flex; gap:8px; flex-wrap:wrap; align-items:center;} .sm-b{font:700 0.8rem Karla,sans-serif; border-radius:14px; padding:6px 14px; border:1.5px solid var(--sand-line); background:var(--paper); color:var(--ink); cursor:pointer; min-height:34px;}',
      '.sm-b.on{background:var(--mark-met-bg); border-color:var(--mark-met-line); color:var(--mark-met-text);} .sm-b.no.on{background:var(--mark-not-bg); border-color:var(--mark-not-line); color:var(--mark-not-text);}',
      '.sm-note{width:100%; box-sizing:border-box; margin-top:8px; font:inherit; font-size:0.86rem; padding:8px 10px; border:1.5px solid var(--row-line); border-radius:6px;}',
      '.mk-dim{opacity:.55;} .mk-dim:hover{opacity:1;}',
      '.critrow.mk-cur{box-shadow:inset 3px 0 0 var(--as, var(--teal)); padding-left:10px !important; border-radius:4px;}',
      '.mk-keys{font-size:0.76rem; color:var(--grey); margin:-6px 0 12px;}',
      '.mk-prev-wrap{position:fixed; inset:0; z-index:70; background:oklch(20% 0.02 60 / .38); display:flex; align-items:flex-start; justify-content:center; padding:5vh 16px; overflow:auto;}',
      '.mk-prev{width:min(640px, 100%); background:var(--paper); border-radius:var(--r-card); box-shadow:0 24px 70px oklch(20% 0.02 60 / .35); overflow:hidden;}',
      '.mkp-top{display:flex; justify-content:space-between; align-items:center; gap:12px; padding:10px 16px; font-size:0.8rem; color:var(--grey); border-bottom:1px solid var(--sand-line);} .mkp-top button{font:700 0.82rem Karla,sans-serif; background:none; border:1.5px solid var(--sand-line); border-radius:var(--r-control); padding:6px 12px; cursor:pointer;}',
      '.mkp-band{padding:16px 20px; background:color-mix(in oklab, var(--as) 8%, var(--surface)); border-top:4px solid var(--as);} .mkp-band p{margin:0; font-size:0.78rem; text-transform:uppercase; letter-spacing:.08em; color:var(--as); font-weight:700;} .mkp-band h3{margin:4px 0 0; font-family:Newsreader,Georgia,serif; font-size:1.4rem; color:var(--ink);}',
      '.mkp-gen{padding:14px 20px 0; font-size:0.9rem; line-height:1.6;} .mkp-crit,.mkp-mc{list-style:none; margin:0; padding:10px 20px 14px;} .mkp-crit li{display:flex; gap:12px; align-items:flex-start; padding:9px 0; border-top:1px solid var(--row-line); font-size:0.88rem;} .mkp-crit li:first-child{border-top:none;} .mkp-crit p{margin:4px 0 0; color:var(--ink);}',
      '.mk-prev h4{margin:0; padding:4px 20px 0; font-size:0.82rem; text-transform:uppercase; letter-spacing:.07em; color:var(--grey);} .mkp-mc li{padding:8px 0; border-top:1px solid var(--row-line); font-size:0.86rem;} .mkp-mc q{display:block; background:color-mix(in oklab, var(--gold-lifted) 25%, transparent); padding:2px 5px; border-radius:3px;} .mkp-mc p{margin:4px 0 0;}',
      '@media print{ .mk-selbar,.mk-editor,.mk-tip,.mk-float,.mk-prev-wrap,.mk-checks,.mk-keys{display:none !important;} }'
    ].join('\n');
    (document.head || document.documentElement).appendChild(st);
  }
})();
