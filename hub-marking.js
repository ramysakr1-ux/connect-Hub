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
  function letterOf(label) { var m = String(label || '').match(/^\s*([A-H])\b[.\u00b7\s]/); return m ? m[1] : ''; }
  /* The block for one place in the work: a written section by its letter
     ("A.  Choosing Your Text" -> "A \u00b7 Choosing the text"), a table row by its
     field name ("Clarification of meaning" -> "Meaning and clarification"). */
  function blockFor(loc) {
    var g = CTX && CTX.guide; if (!g || !g.sections || !loc) return null;
    var bl = blocks(g.sections), sec = CTX.a.sections[+loc.getAttribute('data-sec')] || {}, field = loc.getAttribute('data-field');
    if (field) { var w = field.toLowerCase().split(/\s+/)[0]; return bl.filter(function (b) { return b.head.toLowerCase().indexOf(w) >= 0 && !/^model/i.test(b.head); })[0] || null; }
    var L = letterOf(sec.label);
    return L ? (bl.filter(function (b) { return letterOf(b.head) === L; })[0] || null) : null;
  }
  /* THE "WHILE YOU READ" GUIDANCE, ON TOP OF THE SECTION IT IS FOR (18 Oct 2026).
     Ramy: "while you read A should sit on top of A... and before you mark
     underneath the front page, next to each other." The guidance for the first
     section sits beside "Before you mark" just under the front page; each
     later section carries its own, shut, on top of it. For a table section
     (LRT) it holds the row-by-row guidance in one box. */
  function sectionGuide(i) {
    var g = CTX && CTX.guide; if (!g || !g.sections) return null;
    var sec = CTX.a.sections[i]; if (!sec) return null;
    var bl = blocks(g.sections);
    if (sec.type === 'text') {
      var L = letterOf(sec.label), b = L ? bl.filter(function (x) { return letterOf(x.head) === L; })[0] : null;
      return b ? { head: b.head, body: b.body } : null;
    }
    if (sec.type === 'fields') {
      var rows = bl.filter(function (x) { return !/^model/i.test(x.head) && !letterOf(x.head); });
      return rows.length ? { head: String(sec.label || 'This section').replace(/\s+/g, ' ').trim(), body: rows.map(function (x) { return x.head + '\n' + x.body; }).join('\n\n') } : null;
    }
    return null;
  }
  var OPENSET = {};
  document.addEventListener('toggle', function (e) { var d = e.target; if (d && d.dataset && d.dataset.bk) OPENSET[d.dataset.bk] = d.open; }, true);
  function gbox(key, title, bodyHtml, cls) { return '<details class="guide-box ' + (cls || '') + '" data-bk="' + key + '"' + (OPENSET[key] ? ' open' : '') + '><summary>' + esc(title) + '</summary><div class="gb">' + bodyHtml + '</div></details>'; }
  function firstGuidedSection() {
    var seen = {}, out = [];
    [].forEach.call(document.querySelectorAll('#mkWork .roundlabel[data-sec]'), function (l) { var i = l.getAttribute('data-sec'); if (!seen[i]) { seen[i] = l; out.push([+i, l]); } });
    return out;
  }
  function paintSectionHelp() {
    [].forEach.call(document.querySelectorAll('.mk-sbox'), function (x) { x.remove(); });
    if (!CTX || !CTX.marking || helpHidden()) return;
    firstGuidedSection().forEach(function (pair, n) {
      if (n === 0) return;   /* the first one lives under the front page */
      var g = sectionGuide(pair[0]); if (!g) return;
      pair[1].insertAdjacentHTML('beforebegin', gbox('sec' + pair[0], 'While you read: ' + g.head, hubGuidanceHTML(g.body), 'mk-sbox'));
    });
  }
  function firstSectionBox() {
    var f = firstGuidedSection()[0]; if (!f) return '';
    var g = sectionGuide(f[0]); if (!g) return '';
    return gbox('sec' + f[0], 'While you read: ' + g.head, hubGuidanceHTML(g.body), 'mk-hbox');
  }

  /* ---- the criterion's guidance, inline above its note ------------------ */
  /* It used to float and could sit over the note box (Ramy, 18 Oct 2026: "it
     should not cover the note... on top of the note so you can still write and
     maybe look at the criteria"). It is a panel in the row now, between the
     criterion and its note, open until pressed again. */
  var OPENTIP = null;
  function paintTipIn() {
    [].forEach.call(document.querySelectorAll('.mk-tipin'), function (x) { x.remove(); });
    var i = OPENTIP, g = CTX && CTX.guide, t = g && g.crit && g.crit[i];
    if (i == null || !t || (document.body.className || '').indexOf('mk-nohelp') >= 0) return;
    var link = document.querySelector('[data-tip="' + i + '"]'); if (!link) return;
    link.insertAdjacentHTML('afterend', '<div class="mk-tipin" role="note"><div class="mkt-h"><span>Watch out for: criterion ' + (+i + 1) + '</span><button type="button" data-tipclose>Close</button></div>' + (window.hubGuidanceHTML ? hubGuidanceHTML(t) : esc(t)) + '</div>');
  }
  function hideTip() { if (OPENTIP != null) { OPENTIP = null; paintTipIn(); } }

  /* ---- margin comments -------------------------------------------------- */
  function list(round) { var s = CTX.sub; s.margin = s.margin || {}; return (s.margin[round] = s.margin[round] || []); }
  function canWrite(round) {
    if (secondMode()) return round === secondRound();
    return CTX.marking && round === CTX.round;
  }
  function writeRound() { return secondMode() ? secondRound() : CTX.round; }
  function mine(c) { return !c.by || c.by === CTX.me; }
  function critShort(i) { var c = (CTX.a.criteria || [])[i]; var t = c ? (c.text || c) : ''; return (+i + 1) + '. ' + (t.length > 60 ? t.slice(0, 58) + '…' : t); }
  function newId(p) { return p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function evidenceFor(i, round) { return list(round || CTX.round).filter(function (c) { return c.crit != null && c.crit !== '' && String(c.crit) === String(i); }); }
  var SEL = null, JUST_TICKED = null, RESEL = null;

  function paintMargin() {
    [].forEach.call(document.querySelectorAll('#mkWork .mloc'), function (loc) {
      var round = loc.getAttribute('data-round'), here = loc.getAttribute('data-loc');
      var items = list(round).filter(function (c) { return c.loc === here; });
      var gut = loc.querySelector('.mgut'); if (!gut) return;
      var box = loc.querySelector('.readonly');
      /* ticks first: n of them, spread over the words (hubTickSpots) */
      items.filter(function (c) { return c.tick; }).forEach(function (c) {
        var at = hubHighlight(box, c.quote, c.id, 'mc mc-tick');
        if (at < 0) return;
        hubTickSpots(c.quote, c.n || 1).forEach(function (sp) {
          var span = document.createElement('span'); span.className = 'tickmark'; span.setAttribute('role', 'img'); span.setAttribute('aria-label', 'ticked');
          span.innerHTML = hubTickSVG(c.id === JUST_TICKED ? 'draw' : ''); hubInsertAt(box, at + sp, span);
        });
      });
      var cm = items.filter(function (c) { return !c.tick; });
      gut.innerHTML = cm.map(function (c) {
        hubHighlight(box, c.quote, c.id);
        return '<div class="mcard' + (c.role === 'second' ? ' by-second' : '') + '" data-mcard="' + c.id + '">' +
          (c.crit != null && c.crit !== '' ? '<span class="mc-crit">Criterion ' + (+c.crit + 1) + '</span>' : '') +
          '<p>' + esc(c.text) + '</p>' +
          '<span class="mc-by">' + esc(c.by || '') + '</span>' +
          (canWrite(round) && mine(c) ? '<span class="mc-acts"><button type="button" data-medit="' + c.id + '">Edit</button><button type="button" data-mdel="' + c.id + '">Delete</button></span>' : '') +
          '</div>';
      }).join('');
      loc.classList.toggle('has-mc', cm.length > 0);
    });
    paintEvidence();
  }
  /* under each criterion on the front page: what you tied to it, as you read */
  function paintEvidence() {
    [].forEach.call(document.querySelectorAll('[data-linked]'), function (el) {
      var i = el.getAttribute('data-linked'), ev = evidenceFor(i);
      if (!ev.length) { el.innerHTML = ''; return; }
      var cm = ev.filter(function (c) { return !c.tick; }), tk = ev.filter(function (c) { return c.tick; });
      var nt = tk.reduce(function (a, c) { return a + (c.n || 1); }, 0);
      var head = [cm.length ? cm.length + ' comment' + (cm.length > 1 ? 's' : '') : '', tk.length ? nt + ' tick' + (nt > 1 ? 's' : '') : ''].filter(Boolean).join(', ') + ' under this criterion';
      var q = function (t) { return esc(t.length > 56 ? t.slice(0, 54) + '…' : t); };
      el.innerHTML = '<div class="mk-tied"><span>' + head + '</span>' +
        cm.map(function (c) { return '<button type="button" data-goto="' + c.id + '">“' + q(c.quote) + '”: ' + esc(c.text) + '</button>'; }).join('') +
        tk.map(function (c) { return '<button type="button" data-goto="' + c.id + '">' + hubTickSVG() + ' “' + q(c.quote) + '”' + ((c.n || 1) > 1 ? ' ×' + c.n : '') + '</button>'; }).join('') + '</div>';
    });
  }

  /* what was selected, as one flat string (a line break is a space) */
  function flatText(frag) {
    var out = '', w = document.createTreeWalker(frag, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null), n;
    while ((n = w.nextNode())) { if (n.nodeType === 3) out += n.nodeValue; else if (n.nodeName === 'BR') out += ' '; }
    return out;
  }
  function selectionInfo(range) {
    var node = range.commonAncestorContainer; node = node.nodeType === 1 ? node : node.parentNode;
    var loc = node.closest && node.closest('#mkWork .mloc'); if (!loc) return null;
    var box = loc.querySelector('.readonly');
    if (!box || !box.contains(range.startContainer) || !box.contains(range.endContainer)) return null;
    var pre = document.createRange(); pre.setStart(box, 0); pre.setEnd(range.startContainer, range.startOffset);
    var st = flatText(pre.cloneContents()).length, en = st + flatText(range.cloneContents()).length;
    var full = hubFlat(box).all, isW = /[\p{L}\p{N}]/u;
    /* whole words: a selection that stops mid-word takes the rest of the word */
    while (st > 0 && isW.test(full[st - 1]) && isW.test(full[st])) st--;
    while (en < full.length && isW.test(full[en]) && isW.test(full[en - 1])) en++;
    var q = full.slice(st, en).replace(/^\s+|\s+$/g, '');
    return q.length < 2 ? null : { loc: loc, quote: q.slice(0, 2000) };
  }

  /* the bar that appears over a selection */
  function bar() { var b = $('mkSelBar'); if (!b) { b = document.createElement('div'); b.id = 'mkSelBar'; b.className = 'mk-selbar'; b.hidden = true; document.body.appendChild(b); } return b; }
  function tickRec() { return SEL && SEL.tickId ? list(writeRound()).filter(function (x) { return x.id === SEL.tickId; })[0] : null; }
  function showBar(r) {
    var b = bar(), cr = CTX.a.criteria || [], ex = tickRec(), n = ex ? (ex.n || 1) : 0;
    b.innerHTML = '<div class="sb-row"><button type="button" class="sb-main" data-sb="">Comment</button>' +
      '<button type="button" class="sb-good" data-tick>' + hubTickSVG() + ' Good' + (n ? '<span class="sb-n">×' + n + '</span>' : '') + '</button>' +
      (n ? '<button type="button" class="sb-minus" data-untick title="One tick fewer" aria-label="One tick fewer">−</button>' : '') + '</div>' +
      (cr.length ? '<div class="sb-row sb-ties"><span class="sb-lab">Tie to criterion</span>' + cr.map(function (c, i) { return '<button type="button" class="sb-c' + (SEL.crit === i ? ' on' : '') + '" data-bcrit="' + i + '" title="' + esc(critShort(i)) + '">' + (i + 1) + '</button>'; }).join('') + '</div>' : '');
    b.hidden = false;
    var rr = r.getBoundingClientRect(), w = Math.min(b.offsetWidth, innerWidth - 24);
    b.style.left = Math.max(12, Math.min(rr.left, innerWidth - w - 12)) + 'px';
    b.style.top = (rr.bottom + 8 + b.offsetHeight > innerHeight ? Math.max(70, rr.top - b.offsetHeight - 8) : rr.bottom + 8) + 'px';
  }
  function onSelect() {
    var s = window.getSelection(), b = bar();
    if (!CTX || !s || s.isCollapsed || !s.rangeCount) { b.hidden = true; return; }
    var r = s.getRangeAt(0), info = selectionInfo(r);
    if (!info || !canWrite(info.loc.getAttribute('data-round'))) { b.hidden = true; return; }
    SEL = { loc: info.loc, quote: info.quote, crit: null, tickId: null };
    /* the same words already ticked: Good adds another tick to them */
    var here = info.loc.getAttribute('data-loc');
    var ex = list(writeRound()).filter(function (c) { return c.tick && c.loc === here && c.quote === info.quote; })[0];
    if (ex) { SEL.tickId = ex.id; SEL.crit = ex.crit == null || ex.crit === '' ? null : +ex.crit; }
    showBar(r);
  }
  /* after a redraw, the same words are selected again so Good can be pressed again */
  function reselect(id) {
    var ms = document.querySelectorAll('#mkWork mark[data-mc="' + id + '"]'); if (!ms.length) return;
    var rec = list(writeRound()).filter(function (x) { return x.id === id; })[0], loc = ms[0].closest('.mloc'); if (!rec || !loc) return;
    var r = document.createRange(); r.setStartBefore(ms[0]); r.setEndAfter(ms[ms.length - 1]);
    var s = getSelection(); s.removeAllRanges(); s.addRange(r);
    SEL = { loc: loc, quote: rec.quote, crit: rec.crit == null || rec.crit === '' ? null : +rec.crit, tickId: id };
    showBar(r);
  }

  /* CLICK TO SELECT (Ramy, 18 Oct 2026): one click takes the word, a second
     click on it takes the whole paragraph (the whole line if it stands alone),
     a third the whole answer. Dragging still picks an exact phrase. The
     browser's own double and triple click did the same thing a click late. */
  var PICK = null, DOWN = null;
  function inUI(t) { return t.closest && t.closest('#mkSelBar, #mkEditor, #mkDock, #mkDrop, #mkTip, #mkPreview'); }
  function readonlyOf(t) { return t.closest && t.closest('#mkWork .mloc .readonly'); }
  function caretAt(x, y) {
    if (document.caretPositionFromPoint) { var p = document.caretPositionFromPoint(x, y); return p ? { node: p.offsetNode, offset: p.offset } : null; }
    if (document.caretRangeFromPoint) { var r = document.caretRangeFromPoint(x, y); return r ? { node: r.startContainer, offset: r.startOffset } : null; }
    return null;
  }
  function paragraphRange(node, box) {
    var top = node; while (top.parentNode && top.parentNode !== box) top = top.parentNode;
    var first = top, last = top, n = top.previousSibling;
    while (n) { if (n.nodeName === 'BR' && (!n.previousSibling || n.previousSibling.nodeName === 'BR')) break; first = n; n = n.previousSibling; }
    n = top.nextSibling;
    while (n) { if (n.nodeName === 'BR' && (!n.nextSibling || n.nextSibling.nodeName === 'BR')) break; last = n; n = n.nextSibling; }
    var r = document.createRange(); r.setStartBefore(first); r.setEndAfter(last); return r;
  }
  /* ONE CLICK, ONE WORD; the same word again, its paragraph; again, the whole
     answer. It widens only when you click the SAME WORD again: a click on any
     other word starts over at that word, and a click on a blank part of the
     page, outside the highlight, clears it (Ramy, 18 Oct 2026). */
  function clickPick(e, box) {
    var loc = box.closest('.mloc'); if (!canWrite(loc.getAttribute('data-round'))) return false;
    var pos = caretAt(e.clientX, e.clientY); if (!pos || pos.node.nodeType !== 3 || !box.contains(pos.node)) return false;
    var t = pos.node.nodeValue, a = pos.offset, z = pos.offset, isW = /[\p{L}\p{N}'’\-]/u;
    while (a > 0 && isW.test(t[a - 1])) a--;
    while (z < t.length && isW.test(t[z])) z++;
    if (a === z) return false;
    var word = document.createRange(); word.setStart(pos.node, a); word.setEnd(pos.node, z);
    /* clicks count only when they come one right after another on the same word,
       like any double or triple click; a click later, or after clicking out,
       starts again at one word (Ramy, 18 Oct 2026: "I click back again on one,
       I get the whole section. Not just one word") */
    var same = false, now = Date.now();
    try { same = !!(PICK && PICK.box === box && now - PICK.t < 650 && PICK.word && PICK.word.compareBoundaryPoints(Range.START_TO_START, word) === 0 && PICK.word.compareBoundaryPoints(Range.END_TO_END, word) === 0); } catch (x) {}
    var level = same ? Math.min(3, PICK.level + 1) : 1;   /* no fourth click: clicking OUTSIDE the highlight lets go (Ramy, 18 Oct 2026) */
    var range = level === 1 ? word : level === 2 ? paragraphRange(pos.node, box) : (function () { var r = document.createRange(); r.selectNodeContents(box); return r; })();
    PICK = { box: box, level: level, word: word.cloneRange(), t: now };
    var sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
    onSelect();
    return true;
  }
  document.addEventListener('mousedown', function (e) {
    DOWN = { x: e.clientX, y: e.clientY };
    if (!(e.target.closest && e.target.closest('#mkSelBar'))) { var ro = readonlyOf(e.target); if (!ro) PICK = null; else if (e.detail > 1) e.preventDefault(); }
  });
  document.addEventListener('mouseup', function (e) {
    if (inUI(e.target)) return;
    var ro = readonlyOf(e.target), moved = DOWN && Math.hypot(e.clientX - DOWN.x, e.clientY - DOWN.y) > 4;
    if (ro && CTX && !moved && !e.target.closest('mark.mc, .mcard, a, button') && clickPick(e, ro)) return;
    PICK = null;
    setTimeout(onSelect, 10);
  });

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
      else l.push({ id: newId('m'), loc: opts.loc, quote: opts.quote, text: text, crit: cv === '' ? null : +cv, by: CTX.me, role: secondMode() ? 'second' : 'first', at: new Date().toISOString() });
      CTX.save(); CTX.rerender();
    };
  }
  function remove(id) { var l = list(writeRound()); var k = l.findIndex(function (x) { return x.id === id; }); if (k >= 0) l.splice(k, 1); CTX.save(); CTX.rerender(); }

  /* ---- wiring ---------------------------------------------------------- */
  document.addEventListener('selectionchange', function () { var s = window.getSelection(); if (!s || s.isCollapsed) { var b = $('mkSelBar'); if (b && !b.matches(':hover')) setTimeout(function () { var s2 = window.getSelection(); if (!s2 || s2.isCollapsed) b.hidden = true; }, 200); } });
  document.addEventListener('touchend', function (e) { if (!inUI(e.target) && !readonlyOf(e.target)) setTimeout(onSelect, 350); });
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target : null; if (!t || !CTX) return;
    /* Good: one tick; press again for another, spread over the words */
    var tk = t.closest('[data-tick]');
    if (tk && SEL) {
      var wl = list(writeRound()), rec = tickRec();
      if (rec) rec.n = Math.min(9, (rec.n || 1) + 1);
      else { rec = { id: newId('t'), loc: SEL.loc.getAttribute('data-loc'), quote: SEL.quote, text: '', tick: true, n: 1, crit: SEL.crit == null ? null : SEL.crit, by: CTX.me, role: secondMode() ? 'second' : 'first', at: new Date().toISOString() }; wl.push(rec); }
      JUST_TICKED = rec.id; RESEL = rec.id; CTX.save(); CTX.rerender(); return;
    }
    var ut = t.closest('[data-untick]');
    if (ut && SEL) { var r0 = tickRec(); if (r0) { if ((r0.n || 1) > 1) { r0.n--; RESEL = r0.id; CTX.save(); CTX.rerender(); } else { bar().hidden = true; remove(r0.id); } } return; }
    var bc = t.closest('[data-bcrit]');
    if (bc && SEL) {
      var ci = +bc.getAttribute('data-bcrit'); SEL.crit = SEL.crit === ci ? null : ci;
      var r1 = tickRec();
      if (r1) { r1.crit = SEL.crit; RESEL = r1.id; CTX.save(); CTX.rerender(); }
      else [].forEach.call(bar().querySelectorAll('[data-bcrit]'), function (x) { x.classList.toggle('on', +x.getAttribute('data-bcrit') === SEL.crit); });
      return;
    }
    var mt = t.closest('mark.mc-tick');
    if (mt) {
      var tc = list(writeRound()).filter(function (x) { return x.id === mt.dataset.mc; })[0];
      var locEl = mt.closest('.mloc');
      if (tc && locEl && canWrite(locEl.getAttribute('data-round')) && mine(tc) && !getSelection().toString()) { (window.confirmModal ? confirmModal('Take the ' + ((tc.n || 1) > 1 ? (tc.n + ' ticks') : 'tick') + ' off these words?', 'Take off') : Promise.resolve(confirm('Take the tick off?'))).then(function (ok) { if (ok) remove(tc.id); }); }
      return;
    }
    var sb = t.closest('[data-sb]');
    if (sb && SEL) { bar().hidden = true; editor({ loc: SEL.loc.getAttribute('data-loc'), quote: SEL.quote, text: '', crit: SEL.crit }); window.getSelection().removeAllRanges(); return; }
    var ed = t.closest('[data-medit]');
    if (ed) { var c = list(writeRound()).filter(function (x) { return x.id === ed.getAttribute('data-medit'); })[0]; if (c) editor({ id: c.id, loc: c.loc, quote: c.quote, text: c.text, crit: c.crit }); return; }
    var del = t.closest('[data-mdel]'); if (del) { remove(del.getAttribute('data-mdel')); return; }
    var go = t.closest('[data-goto]');
    if (go) { DROP = null; paintDrop(); var m = document.querySelector('mark[data-mc="' + go.getAttribute('data-goto') + '"]'); if (m) { m.scrollIntoView({ block: 'center', behavior: 'smooth' }); m.classList.remove('mc-hit'); void m.offsetWidth; m.classList.add('mc-hit'); } return; }
    var mk = t.closest('mark.mc');
    if (mk) { var card = document.querySelector('[data-mcard="' + mk.dataset.mc + '"]'); if (card) { card.classList.remove('mc-hit'); void card.offsetWidth; card.classList.add('mc-hit'); card.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } return; }
    var add = t.closest('[data-addnote]');
    if (add) { var i = add.getAttribute('data-addnote'); var ta = document.querySelector('[data-crit-comment="' + i + '"]'); add.hidden = true; ta.hidden = false; ta.focus(); return; }
    var tl = t.closest('[data-tip]');
    if (tl) { var ti = +tl.getAttribute('data-tip'); OPENTIP = OPENTIP === ti ? null : ti; paintTipIn(); return; }
    if (t.closest('[data-tipclose]')) { hideTip(); return; }
  });
  /* The guidance opens only when "Guidance" is pressed. It used to open as soon
     as you started a note (Ramy, 18 Oct 2026: "clicking on add a note should
     not open the guidance box"). */
  document.addEventListener('focusout', function (e) {
    var ta = e.target.closest && e.target.closest('[data-crit-comment]');
    if (!ta) return;
    /* an empty note folds back to its link, unless you went to its Guidance */
    var idx = ta.getAttribute('data-crit-comment');
    setTimeout(function () {
      if (ta.value.trim() || !ta.isConnected || String(OPENTIP) === idx) return;
      var row = ta.closest('.critrow'); if (row && row.contains(document.activeElement)) return;
      ta.hidden = true; var a = document.querySelector('[data-addnote="' + idx + '"]'); if (a) a.hidden = false;
    }, 180);
  });


  /* ======================= STEP TWO (17 Oct 2026) ======================= */

  /* ---- the checks Lite can do before you mark ----------------------------
     Only what can be told from the text. Each line is ticked, flagged for a
     look, or just information; a flag is never a mark. */
  function snapNow() { var s = CTX.sub; return CTX.marking ? s[CTX.round] : (s.sub2 || s.sub1); }
  function checksHTML() {
    var snap = snapNow(); if (!snap || !window.hubWorkChecks) return '';
    var items = hubWorkChecks(CTX.a, snap, CTX.key, 'tutor');
    var looks = items.filter(function (x) { return x.state === 'look'; }).length;
    return '<details class="guide-box mk-checks" data-bk="checks"' + (OPENSET.checks === undefined ? (looks ? ' open' : '') : (OPENSET.checks ? ' open' : '')) + '><summary>Before you mark: ' + items.length + ' checks' + (looks ? ', ' + looks + ' to look at' : ', all clear') + '</summary><div class="gb"><ul class="mkc">' +
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
    var mc = list(r).filter(function (c) { return !c.tick; }), ticks = list(r).filter(function (c) { return c.tick; });
    var ov = $('mkPreview'); if (!ov) { ov = document.createElement('div'); ov.id = 'mkPreview'; ov.className = 'mk-prev-wrap'; document.body.appendChild(ov); }
    ov.className = 'mk-prev-wrap as-' + CTX.key;
    ov.innerHTML = '<div class="mk-prev" role="dialog" aria-label="What the trainee will see">' +
      '<div class="mkp-top"><span>What the trainee will see when you save and return it</span><button type="button" data-prevclose>Close</button></div>' +
      '<div class="mkp-band"><p>' + esc(a.title) + '</p><h3>' + (out ? esc(out) : 'Not decided yet: mark every criterion first') + '</h3></div>' +
      (gen ? '<div class="mkp-gen">' + esc(gen).replace(/\n/g, '<br>') + '</div>' : '') +
      '<ul class="mkp-crit">' + cr.map(function (c, i) { return '<li><span class="crit-toggle ' + (m[i] === true ? 'met' : m[i] === false ? 'not' : '') + '" style="cursor:default">' + (m[i] === true ? 'Met' : m[i] === false ? 'Not met' : 'Not marked') + '</span><div><b>' + esc(c.text || c) + '</b>' + (notes[i] ? '<p>' + esc(notes[i]) + '</p>' : '') + '</div></li>'; }).join('') + '</ul>' +
      (ticks.length ? '<h4>Ticked</h4><ul class="mkp-mc">' + ticks.map(function (c) { return '<li><q class="tk">' + esc(c.quote) + '</q>' + (window.hubTickSVG ? hubTickSVG() : ' \u2713') + ((c.n || 1) > 1 ? ' \u00d7' + c.n : '') + '</li>'; }).join('') + '</ul>' : '') +
      (mc.length ? '<h4>Comments on her text</h4><ul class="mkp-mc">' + mc.map(function (c) { return '<li><q>' + esc(c.quote) + '</q><p>' + esc(c.text) + '</p></li>'; }).join('') + '</ul>' : '') +
      '</div>';
    ov.hidden = false;
  }

  function paintStep2() {
    var panel = $('mkPanel'); if (!panel) return;
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

  /* ---- THE FRONT PAGE THAT STAYS WITH YOU (Ramy, 18 Oct 2026: "as you scroll
     down, the criteria stays with you... the front page is like still there").
     Once the criteria have scrolled out of sight a thin bar holds them: each
     criterion as a chip with its state and how much you have tied to it.
     Tap a chip and it opens over the work with its Met and Not met, its note
     and everything tied to it; tap away and it folds back. */
  var DROP = null, DOCK_OPEN = false;   /* the bar is shut until you ask for it (Ramy, 18 Oct 2026) */
  function tabEl() { var t = $('mkDockTab'); if (!t) { t = document.createElement('button'); t.id = 'mkDockTab'; t.type = 'button'; t.className = 'mk-dock-tab'; t.setAttribute('data-dktab', ''); t.hidden = true; document.body.appendChild(t); } return t; }
  function dockEl() { var d = $('mkDock'); if (!d) { d = document.createElement('div'); d.id = 'mkDock'; d.className = 'mk-dock'; d.hidden = true; document.body.appendChild(d); } return d; }
  function dropEl() { var d = $('mkDrop'); if (!d) { d = document.createElement('div'); d.id = 'mkDrop'; d.className = 'mk-drop'; d.hidden = true; document.body.appendChild(d); } return d; }
  function dockShould() { var c = $('mkCrit'); if (!c) return false; return c.getBoundingClientRect().top < -40; }   /* once you have scrolled past the top of the criteria */
  function paintDock() {
    var d = dockEl(), dr = dropEl(), cr = (CTX && CTX.a && CTX.a.criteria) || [];
    if (!CTX || !CTX.marking || !cr.length || !$('mkCrit')) { d.hidden = true; dr.hidden = true; tabEl().hidden = true; return; }
    var m = CTX.sub.criteriaMarks[CTX.round] || [], done = cr.filter(function (c, i) { return m[i] === true || m[i] === false; }).length;
    d.innerHTML = '<button type="button" class="dk-up" data-dkup>Front page</button><div class="dk-chips">' + cr.map(function (c, i) {
      var st = m[i] === true ? 'met' : m[i] === false ? 'not' : '', word = st === 'met' ? 'Met' : st === 'not' ? 'Not met' : 'To mark';
      var nt = evidenceFor(i).reduce(function (a, x) { return a + (x.tick ? (x.n || 1) : 1); }, 0);
      return '<button type="button" class="dk-chip ' + st + (DROP === i ? ' open' : '') + '" data-dk="' + i + '" aria-label="Criterion ' + (i + 1) + ': ' + word + (nt ? ', ' + nt + ' marks in the text' : '') + '"><b>' + (i + 1) + '</b><span>' + word + '</span>' + (nt ? '<em>' + nt + '</em>' : '') + '</button>';
    }).join('') + '</div><span class="dk-prog">' + done + ' of ' + cr.length + ' marked</span><button type="button" class="dk-hide" data-dkhide>Hide</button>';
    tabEl().innerHTML = 'Criteria \u00b7 ' + done + ' of ' + cr.length;
    placeDock();
  }
  function placeDock() {
    var d = $('mkDock'); if (!d || !CTX || !CTX.marking) return;
    var show = dockShould(), tab = tabEl();
    d.hidden = !(show && DOCK_OPEN); tab.hidden = !(show && !DOCK_OPEN);
    if (d.hidden) { var dr = $('mkDrop'); if (dr) dr.hidden = true; return; }
    paintDrop();
  }
  function paintDrop() {
    var dr = dropEl(), d = $('mkDock'), i = DROP;
    if (i == null || !d || d.hidden || !CTX || !CTX.marking) { dr.hidden = true; return; }
    var c = CTX.a.criteria[i]; if (!c) { dr.hidden = true; return; }
    var mk = (CTX.sub.criteriaMarks[CTX.round] || [])[i], note = ((CTX.sub.criteriaComments || {})[CTX.round] || [])[i] || '', ev = evidenceFor(i);
    var q = function (t) { return esc(t.length > 60 ? t.slice(0, 58) + '…' : t); };
    dr.innerHTML = '<div class="dr-h"><b>Criterion ' + (i + 1) + '</b><button type="button" data-drclose>Close</button></div><p class="dr-t">' + esc(c.text || c) + '</p>' +
      '<div class="dr-btns"><button type="button" class="dr-met' + (mk === true ? ' on' : '') + '" data-drmark="1">Met</button><button type="button" class="dr-not' + (mk === false ? ' on' : '') + '" data-drmark="0">Not met</button></div>' +
      (note ? '' : '<button type="button" class="mk-addnote" data-drnote>Add a note</button>') +
      '<textarea class="dr-note" data-drnotebox rows="2" placeholder="Why, in a sentence or two. The trainee reads this."' + (note ? '' : ' hidden') + '>' + esc(note) + '</textarea>' +
      (ev.length ? '<div class="dr-ev"><span>Under this criterion</span>' + ev.map(function (x) { return '<button type="button" data-goto="' + x.id + '">' + (x.tick ? hubTickSVG() + ' ' : '') + '“' + q(x.quote) + '”' + (x.tick ? ((x.n || 1) > 1 ? ' ×' + x.n : '') : ': ' + esc(x.text)) + '</button>'; }).join('') + '</div>' : '<p class="dr-none">Nothing tied to this yet. Select words in the work and tie them to it.</p>');
    dr.hidden = false;
    var chip = d.querySelector('[data-dk="' + i + '"]'), cr = chip ? chip.getBoundingClientRect() : { left: 12 }, db = d.getBoundingClientRect();
    if (innerWidth >= 1080) { dr.style.top = db.bottom + 'px'; dr.style.bottom = 'auto'; dr.style.left = Math.max(12, Math.min(cr.left, innerWidth - dr.offsetWidth - 12)) + 'px'; }
    else { dr.style.top = 'auto'; dr.style.bottom = (innerHeight - db.top) + 'px'; dr.style.left = '8px'; }
  }
  var RAF = 0;
  function onScroll() { if (RAF) return; RAF = requestAnimationFrame(function () { RAF = 0; placeDock(); }); }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target : null; if (!t || !CTX) return;
    if (t.closest('[data-dktab]')) { DOCK_OPEN = true; placeDock(); return; }
    if (t.closest('[data-dkhide]')) { DOCK_OPEN = false; DROP = null; paintDock(); return; }
    if (t.closest('[data-dkup]')) { var c = $('mkCrit'); if (c) c.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    var dk = t.closest('[data-dk]'); if (dk) { var i = +dk.getAttribute('data-dk'); DROP = DROP === i ? null : i; paintDock(); return; }
    if (t.closest('[data-drclose]')) { DROP = null; paintDock(); return; }
    var dm = t.closest('[data-drmark]');
    if (dm && DROP != null) { var v = dm.getAttribute('data-drmark') === '1', cur = (CTX.sub.criteriaMarks[CTX.round] || [])[DROP]; CTX.setMark(DROP, cur === v ? null : v); return; }
    var dn = t.closest('[data-drnote]'); if (dn) { var ta = document.querySelector('[data-drnotebox]'); dn.hidden = true; ta.hidden = false; ta.focus(); return; }
    if (DROP != null && !t.closest('#mkDock, #mkDrop, #mkTip')) { DROP = null; paintDrop(); var chips = document.querySelectorAll('.dk-chip.open'); [].forEach.call(chips, function (x) { x.classList.remove('open'); }); }
  });
  document.addEventListener('input', function (e) {
    var ta = e.target.closest && e.target.closest('[data-drnotebox]'); if (!ta || DROP == null) return;
    CTX.setNote(DROP, ta.value);
    var cov = document.querySelector('[data-crit-comment="' + DROP + '"]'), add = document.querySelector('[data-addnote="' + DROP + '"]');
    if (cov) { cov.value = ta.value; if (ta.value.trim()) { cov.hidden = false; if (add) add.hidden = true; } }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && DROP != null) { DROP = null; paintDock(); } });

  /* ---- the help, in collapsibles ("it just needs to disappear eventually") */
  function helpHidden() { try { return localStorage.getItem('mk:hideHelp') === '1'; } catch (e) { return false; } }
  function paintHelp() {
    var host = $('mkHelp'); if (!host) return;
    var hidden = helpHidden();
    document.body.classList.toggle('mk-nohelp', hidden && !!CTX.marking);
    if (!CTX.marking) { host.innerHTML = ''; return; }
    var g = CTX.guide, parts = [];
    var ch = checksHTML(); if (ch) parts.push(ch);
    var fs = firstSectionBox(); if (fs) parts.push(fs);
    var gen = [g && g.general, CTX.a.trap ? 'The hidden word\n' + hubTrapNote(CTX.a.trap) : ''].filter(Boolean).join('\n\n');
    if (gen) parts.push(gbox('how', 'How to mark this assignment', hubGuidanceHTML(gen), 'mk-hbox'));
    if (g && g.sections) parts.push(gbox('bysec', 'Section by section', hubGuidanceHTML(g.sections), 'mk-hbox'));
    if (!parts.length) { host.innerHTML = ''; return; }
    host.innerHTML = '<div class="mk-help-bar"><span>Marking help</span><button type="button" data-helptoggle>' + (hidden ? 'Show the guidance' : 'Hide the guidance') + '</button></div>' + (hidden ? '' : '<div class="mk-help-grid">' + parts.join('') + '</div>');
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-helptoggle]')) { try { localStorage.setItem('mk:hideHelp', helpHidden() ? '' : '1'); } catch (x) {} paintHelp(); hideTip(); }
  });

  window.hubMarking = {
    afterRender: function (ctx) {
      CTX = ctx;
      paintMargin();
      paintStep2();
      paintHelp();
      paintSectionHelp();
      paintTipIn();
      paintDock();
      if (RESEL) { var id = RESEL; RESEL = null; reselect(id); }
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
      '.mcard{background:var(--paper); border:1px solid var(--amber-edge); border-left:4px solid var(--gold); border-radius:12px; padding:12px 16px 11px; font-size:0.95rem; line-height:1.55; box-shadow:0 2px 8px oklch(30% 0.03 70 / .06);}',
      '.mcard p{margin:4px 0 6px;}',
      '.mc-crit{display:inline-block; font-size:0.7rem; font-weight:700; color:var(--teal); text-transform:uppercase; letter-spacing:.06em;}',
      '.mc-by{font-size:0.8rem; color:var(--grey);}',
      '.mc-acts{float:right;} .mc-acts button{background:none; border:none; padding:0 0 0 10px; font:600 0.76rem Karla,sans-serif; color:var(--teal); cursor:pointer; text-decoration:underline; text-decoration-color:var(--sand-line);}',
      '.mc-acts button:hover{background:none !important; box-shadow:none !important;}',
      '.mc-hit{animation:mcHit 1.3s ease-out 1;} @keyframes mcHit{0%{box-shadow:0 0 0 3px oklch(70% 0.12 72 / .7);}100%{box-shadow:0 0 0 3px oklch(70% 0.12 72 / 0);}}',
      '.mk-pair .mloc.has-mc{display:block !important;}',
      '@media (min-width:1080px){ .mloc.has-mc{display:grid; grid-template-columns:minmax(0,1fr) minmax(320px,30%); gap:12px; align-items:start;} .mloc.has-mc .mgut{margin:0;} .mloc.has-mc .readonly{margin-bottom:0;} }',
      '.mk-selbar{position:fixed; z-index:60; display:flex; flex-wrap:wrap; gap:6px; max-width:min(560px, calc(100vw - 24px)); padding:7px; background:var(--ink); border-radius:12px; box-shadow:0 10px 30px oklch(20% 0.02 60 / .3);}',
      '.mk-selbar button{font:600 0.78rem Karla,sans-serif; color:var(--paper); background:oklch(32% 0.02 65); border:none; border-radius:8px; padding:7px 10px; cursor:pointer; text-align:left;}',
      '.mk-selbar button.sb-main{background:var(--gold); color:var(--ink); font-weight:700;}',
      '.mk-selbar .sb-lab{flex-basis:100%; font:600 0.72rem Karla,sans-serif; color:oklch(80% 0.02 70); padding:2px 2px 0;}',
      '.mk-selbar button.sb-good{background:oklch(38% 0.06 160); color:var(--paper);}',
      'mark.mc-tick{background:color-mix(in oklab, oklch(70% 0.1 158) 22%, transparent); border-bottom:2px solid oklch(46% 0.1 158);} .tickmark{white-space:nowrap;}',
      '.mk-selbar .hub-tick{width:1.05em; height:1.05em; margin:0 3px 0 0; filter:none;}',
      '.mkp-mc q.tk{background:color-mix(in oklab, var(--mark-met-line) 30%, transparent);}',
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
      '.mk-tipin{margin:8px 0 6px; padding:8px 12px 9px; background:var(--sand); border:1px solid var(--sand-line); border-left:3px solid var(--as, var(--teal)); border-radius:var(--r-strip); font-size:0.82rem; line-height:1.5;}',
      '.mk-tipin .mkt-h{display:flex; justify-content:space-between; align-items:center; gap:10px; font-weight:700; color:var(--as, var(--teal)); margin:0 0 4px;} .mk-tipin .mkt-h button{font:600 0.76rem Karla,sans-serif; background:none; border:none; color:var(--grey); text-decoration:underline; cursor:pointer;} .mk-tipin .mkt-h button:hover{background:none !important; box-shadow:none !important;}',
      '.mk-tipin p{margin:4px 0;} .mk-tipin ul{margin:3px 0 5px; padding-left:18px;} .mk-tipin li{margin:2px 0;}',
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
      '.mk-selbar{flex-direction:column; gap:6px;} .sb-row{display:flex; gap:6px; align-items:center; flex-wrap:wrap;}',
      '.sb-lab{font:600 0.72rem Karla,sans-serif; color:oklch(80% 0.02 70); margin-right:2px;}',
      '.sb-n{margin-left:6px; font-weight:700; opacity:.9;} .mk-selbar button.sb-minus{background:oklch(32% 0.02 65); padding:7px 11px; font-weight:700;}',
      '.mk-selbar button.sb-c{min-width:34px; text-align:center; padding:6px 0; border:1.5px solid oklch(46% 0.02 65); background:transparent;} .mk-selbar button.sb-c.on{background:var(--gold); border-color:var(--gold); color:var(--ink); font-weight:700;}',
      '.mk-dock{position:fixed; left:0; right:0; top:0; z-index:50; display:flex; align-items:center; gap:12px; padding:8px 28px; background:color-mix(in oklab, var(--paper) 95%, transparent); -webkit-backdrop-filter:blur(8px); backdrop-filter:blur(8px); border-bottom:1px solid var(--sand-line); box-shadow:0 6px 20px oklch(25% 0.02 60 / .10);}',
      '.dk-up{background:none; border:none; font:700 0.8rem Karla,sans-serif; color:var(--as, var(--teal)); cursor:pointer; text-decoration:underline; text-decoration-color:var(--sand-line); text-underline-offset:3px; white-space:nowrap; padding:4px 0;} .dk-up:hover{background:none !important; box-shadow:none !important;}',
      '.dk-chips{display:flex; gap:6px; flex:1; overflow-x:auto; padding:2px 0; scrollbar-width:none;} .dk-chips::-webkit-scrollbar{display:none;}',
      '.dk-chip{display:flex; align-items:center; gap:7px; font:600 0.78rem Karla,sans-serif; border:1.5px solid var(--sand-line); background:var(--paper); color:var(--ink); border-radius:18px; padding:5px 12px; cursor:pointer; white-space:nowrap; min-height:36px;}',
      '.dk-chip b{font:700 0.82rem Karla,sans-serif;} .dk-chip.met{background:var(--mark-met-bg); border-color:var(--mark-met-line); color:var(--mark-met-text);} .dk-chip.not{background:var(--mark-not-bg); border-color:var(--mark-not-line); color:var(--mark-not-text);}',
      '.dk-chip.open{box-shadow:0 0 0 2px var(--as, var(--teal));} .dk-chip em{font-style:normal; font-size:0.7rem; font-weight:700; background:var(--as, var(--teal)); color:var(--paper); border-radius:9px; padding:1px 6px; min-width:18px; text-align:center;}',
      '.dk-prog{font-size:0.78rem; color:var(--grey); white-space:nowrap;}',
      '.dk-hide{background:none; border:none; font:600 0.8rem Karla,sans-serif; color:var(--grey); text-decoration:underline; text-decoration-color:var(--sand-line); text-underline-offset:3px; cursor:pointer; padding:4px 0;} .dk-hide:hover{background:none !important; box-shadow:none !important;}',
      '.mk-dock-tab{position:fixed; left:18px; bottom:18px; z-index:49; font:700 0.8rem Karla,sans-serif; color:var(--as, var(--teal)); background:var(--paper); border:1.5px solid var(--as, var(--teal)); border-radius:20px; padding:9px 16px; cursor:pointer; box-shadow:0 8px 24px oklch(25% 0.02 60 / .16);} .mk-dock-tab:hover{background:var(--sand) !important;}',
      '@media (max-width:1079px){ .mk-dock-tab{left:auto; right:12px; bottom:calc(14px + env(safe-area-inset-bottom));} }',
      '.mk-drop{position:fixed; z-index:51; width:min(440px, calc(100vw - 16px)); background:var(--paper); border:1px solid var(--sand-line); border-top:3px solid var(--as, var(--teal)); border-radius:var(--r-card); padding:12px 14px 14px; box-shadow:0 18px 50px oklch(20% 0.02 60 / .25); max-height:70vh; overflow:auto;}',
      '.dr-h{display:flex; justify-content:space-between; align-items:center;} .dr-h button{font:700 0.78rem Karla,sans-serif; background:none; border:1.5px solid var(--sand-line); border-radius:var(--r-control); padding:4px 10px; cursor:pointer;}',
      '.dr-t{font-size:0.88rem; line-height:1.5; margin:6px 0 10px;} .dr-btns{display:flex; gap:8px; margin:0 0 4px;}',
      '.dr-btns button{flex:1; font:700 0.88rem Karla,sans-serif; padding:10px; border-radius:var(--r-control); border:1.5px solid var(--sand-line); background:var(--paper); color:var(--ink); cursor:pointer; min-height:44px;}',
      '.dr-btns .dr-met.on{background:var(--mark-met-bg); border-color:var(--mark-met-line); color:var(--mark-met-text);} .dr-btns .dr-not.on{background:var(--mark-not-bg); border-color:var(--mark-not-line); color:var(--mark-not-text);}',
      '.dr-note{width:100%; box-sizing:border-box; margin-top:8px; font:inherit; font-size:0.86rem; padding:8px 10px; border:1.5px solid var(--row-line); border-radius:6px;}',
      '.dr-ev{margin-top:10px; padding:7px 10px; border-radius:var(--r-strip); background:var(--gold-wash); font-size:0.8rem;} .dr-ev span{display:block; font-weight:700; font-size:0.72rem; text-transform:uppercase; letter-spacing:.06em; color:var(--gold-deep); margin:0 0 3px;}',
      '.dr-ev button{display:block; text-align:left; background:none; border:none; padding:3px 0; font:inherit; color:var(--ink); cursor:pointer;} .dr-ev button:hover{background:none !important; box-shadow:none !important; text-decoration:underline;} .dr-none{font-size:0.8rem; color:var(--grey); margin:10px 0 0;}',
      '.mk-help-bar{display:flex; justify-content:space-between; align-items:center; margin:0 0 6px; font-size:0.78rem; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:var(--grey);} .mk-help-bar button{background:none; border:none; font:600 0.8rem Karla,sans-serif; letter-spacing:0; text-transform:none; color:var(--teal); text-decoration:underline; text-decoration-color:var(--sand-line); text-underline-offset:3px; cursor:pointer;} .mk-help-bar button:hover{background:none !important; box-shadow:none !important;}',
      '.mk-help-grid{display:flex; flex-wrap:wrap; gap:8px; align-items:flex-start;} .mk-help-grid .guide-box{flex:1 1 300px; margin:0;}',
      '.mk-help-grid .guide-box, .mk-sbox{background:var(--gold-wash); border-color:var(--amber-edge);} .mk-help-grid .guide-box[open] > summary, .mk-sbox[open] > summary{border-bottom-color:var(--amber-edge);}',
      '.mk-nohelp .mk-tiplink{display:none;}',
      '.mk-tied svg.hub-tick, .dr-ev svg.hub-tick{width:1em; height:1em; vertical-align:-0.18em; margin:0 2px 0 0; filter:none;}',
      '@media (max-width:1079px){ .mk-dock{top:auto; bottom:0; padding:8px 10px calc(8px + env(safe-area-inset-bottom)); border-bottom:none; border-top:1px solid var(--sand-line); box-shadow:0 -6px 20px oklch(25% 0.02 60 / .12);} .dk-up{display:none;} .dk-prog{font-size:0.72rem;} .dk-chip{padding:5px 10px;} }',
      '.mk-sbox{margin:2px 0 10px;} .mk-sbox > summary{font-size:0.8rem;}',
      '@media print{ .mk-dock-tab,.mk-selbar,.mk-editor,.mk-tip,.mk-dock,.mk-drop,.mk-prev-wrap,.mk-checks,.mk-keys,.mk-help{display:none !important;} }'
    ].join('\n');
    (document.head || document.documentElement).appendChild(st);
  }
})();
