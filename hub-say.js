/* YOUR OPINION MATTERS -- one line, from any screen, from anybody.
 *
 * Ramy, 5 Oct 2026: "people like to be part of the platform, like their voice
 * is heard ... they can comment if something is wrong ... I wonder if this
 * could just apply everywhere in Connect Lite. For the trainers and trainees.
 * And assessor."
 *
 * So it is not a feedback form on one screen. It is on every screen, it asks
 * for no name and no address, and it carries where the person was standing
 * when they wrote it -- the screen, their role, their course, and on a screen
 * that says so (data-say on any element) the lesson they were looking at.
 *
 * It matters most for the library. A library of a thousand lessons that nobody
 * can correct goes stale, and the people who find the mistakes are the ones
 * teaching from them, not the ones who wrote them.
 *
 * It writes through the store's `report` op (v72), which takes no credential
 * and stores no identity. Nothing on Lite reads these back; they reach Ramy as
 * mail on the timer that already carries the comments.
 */
(function () {
  'use strict';
  if (window.hubSay) return;

  var SENT = 'hub:said';           // the last thing sent, so a double tap is not two rows

  function role() {
    try {
      if (!window.HubStore) return '';
      if (HubStore.isTutor()) return 'tutor';
      if (HubStore.isAssessor()) return 'assessor';
      if (HubStore.isVolunteer()) return 'volunteer';
      if (HubStore.isTrainee()) return 'trainee';
    } catch (e) { }
    return '';
  }

  function courseName() {
    try {
      var cs = JSON.parse(localStorage.getItem('connect_course_settings') || 'null') || {};
      return String(cs.courseName || cs.centreName || '');
    } catch (e) { return ''; }
  }

  /* The screen, as a person would name it: the <h1> beats the filename, which
     beats nothing. The <title> carries "Connect Lite -- " on every page. */
  function pageName() {
    var h = document.querySelector('h1');
    var t = (h && h.textContent) || String(document.title || '').replace(/^.*?—\s*/, '');
    return String(t || location.pathname.split('/').pop() || '').trim().slice(0, 60);
  }

  function css() {
    if (document.getElementById('hub-say-css')) return;
    var s = document.createElement('style');
    s.id = 'hub-say-css';
    s.textContent = [
      /* IT IS NOT A FLOATING THING ANY MORE. Ramy, 6 Oct 2026: "I don't want
         it hovering everywhere. I want it out of the way... if it's covering
         anything, move it to the side. You make a call."

         The call: nothing fixed. It sat bottom-right and covered Save as PDF;
         it moved to bottom-centre and covered whatever was in the middle;
         lifting it above a page's own bar fixed the bars and not the rest. A
         fixed element on a page that already has its own bottom controls is a
         collision looking for a screen. In the flow at the foot of the page it
         cannot cover anything, on any screen, at any width, for ever. It is a
         way to report something, not a tool anybody reaches for mid-task. */
      '.say-pill{display:block; margin:34px auto 26px; font:600 0.8rem/1 inherit;',
      '  background:var(--plum,#5d2450); color:var(--paper,#fff); border:0;',
      '  border-radius:999px; padding:11px 20px; cursor:pointer;',
      '  box-shadow:0 1px 2px rgba(0,0,0,.14);}',
      '.say-pill:hover{background:var(--plum-lifted,#6f2c60);}',
      '.say-pill:focus-visible{outline:3px solid var(--gold,#c89b4a); outline-offset:3px;}',
      '.say-here{font:600 0.72rem/1 inherit; background:none; border:0; padding:3px 0; margin:0;',
      '  color:var(--faint,#999); cursor:pointer; text-decoration:underline; text-underline-offset:3px;}',
      '.say-here:hover{color:var(--teal,#0b6);}',
      '.say-back{position:fixed; inset:0; z-index:9001; background:rgba(28,26,22,.34);',
      '  display:flex; align-items:center; justify-content:center; padding:18px;}',
      '.say-box{background:var(--surface,#f3f0ea); color:var(--ink,#222); border-radius:13px; padding:20px 22px;',
      '  width:min(460px,100%); max-height:92vh; overflow:auto; box-shadow:0 18px 50px rgba(0,0,0,.26);}',
      '.say-box h2{font-family:Newsreader,Georgia,serif; font-weight:600; font-size:1.25rem; margin:0 0 3px;}',
      '.say-box .sub{font-size:.84rem; color:var(--grey,#555); margin:0 0 14px;}',
      '.say-box .where{font-size:.76rem; color:var(--faint,#999); margin:0 0 12px;}',
      '.say-kinds{display:flex; gap:7px; margin:0 0 11px;}',
      '.say-kind{font:600 .8rem/1 inherit; cursor:pointer; padding:7px 13px; border-radius:999px;',
      '  border:1px solid var(--sand-line,#ddd); background:none; color:var(--grey,#555);}',
      '.say-kind.on{border-color:var(--teal,#0b6); color:var(--teal,#0b6); background:var(--box,#f4f4f2);}',
      '.say-box textarea{width:100%; box-sizing:border-box; font:inherit; font-size:.92rem; padding:9px 11px;',
      '  border:1px solid var(--sand-line,#ddd); border-radius:8px; background:var(--field,#fff); color:inherit;',
      '  resize:vertical; min-height:92px;}',
      '.say-acts{display:flex; gap:9px; align-items:center; margin-top:12px;}',
      '.say-note{font-size:.78rem; color:var(--grey,#555); margin:10px 0 0;}'
    ].join('\n');
    document.head.appendChild(s);
  }

  var KIND = 'wrong', WHERE = '', BUSY = false;

  function close() {
    var b = document.querySelector('.say-back');
    if (b) b.remove();
  }

  function open(where) {
    css();
    close();
    WHERE = where || '';
    KIND = where ? 'wrong' : 'idea';
    var back = document.createElement('div');
    back.className = 'say-back';
    back.innerHTML =
      '<div class="say-box" role="dialog" aria-label="Say something">' +
        '<h2>Your opinion matters</h2>' +
        '<p class="sub">Connect reads every one of these. No name, no address — just tell us.</p>' +
        (WHERE ? '<p class="where">About: <b>' + esc(WHERE) + '</b></p>' : '') +
        '<div class="say-kinds">' +
          '<button type="button" class="say-kind" data-kind="wrong">Something is wrong</button>' +
          '<button type="button" class="say-kind" data-kind="idea">An idea</button>' +
        '</div>' +
        '<textarea maxlength="600" placeholder="' +
          'What is wrong with it, or what would make it better?"></textarea>' +
        '<div class="say-acts"><button type="button" class="btn say-send">Send it</button>' +
          '<button type="button" class="btn quiet say-cancel">Cancel</button></div>' +
        '<p class="say-note"></p>' +
      '</div>';
    document.body.appendChild(back);
    var box = back.querySelector('.say-box');
    var ta = back.querySelector('textarea');
    var note = back.querySelector('.say-note');
    var mark = function () {
      [].forEach.call(back.querySelectorAll('.say-kind'), function (b) {
        b.classList.toggle('on', b.dataset.kind === KIND);
      });
    };
    mark();
    [].forEach.call(back.querySelectorAll('.say-kind'), function (b) {
      b.onclick = function () { KIND = b.dataset.kind; mark(); ta.focus(); };
    });
    back.onclick = function (e) { if (e.target === back) close(); };
    document.addEventListener('keydown', function esc2(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc2); }
    });
    back.querySelector('.say-cancel').onclick = close;
    back.querySelector('.say-send').onclick = function () {
      var text = String(ta.value || '').trim();
      if (!text) { note.textContent = 'Write a line first.'; ta.focus(); return; }
      if (BUSY) return;
      BUSY = true;
      this.disabled = true;
      this.textContent = 'Sending…';
      var btn = this;
      send(text).then(function () {
        BUSY = false;
        box.innerHTML = '<h2>Thank you</h2><p class="sub">That is with Connect. ' +
          'If it needs a reply, it will come from lite@celtaconnect.com.</p>' +
          '<div class="say-acts"><button type="button" class="btn say-cancel">Close</button></div>';
        box.querySelector('.say-cancel').onclick = close;
      }).catch(function (e) {
        BUSY = false;
        btn.disabled = false;
        btn.textContent = 'Send it';
        note.textContent = 'That did not send — ' + ((e && e.message) || e) + '. Try again in a moment.';
      });
    };
    setTimeout(function () { ta.focus(); }, 30);
  }

  function send(text) {
    try { localStorage.setItem(SENT, text.slice(0, 80)); } catch (e) { }
    return HubStore.call({ op: 'report', kind: KIND, text: text,
      page: pageName(), where: WHERE, role: role(), course: courseName() });
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* THE PILL, on every screen. Quiet until it is wanted. A screen that would
     rather put it somewhere of its own sets `data-say-pill="off"` on <body>. */
  function pill() {
    if (document.body.dataset.sayPill === 'off') return;
    /* NOT TO A VOLUNTEER STUDENT. Ramy, 6 Oct 2026: "I don't think the
       volunteer students need to have a Say something card." They are members
       of the public who came in to be taught, not users of the product, and
       asking them what is wrong with Lite asks the wrong person about the
       wrong thing. Decided by the link in the browser rather than by a flag on
       each page, so a volunteer screen written next year inherits it. */
    try { if (window.HubStore && HubStore.isVolunteer && HubStore.isVolunteer()) return; } catch (e) {}
    if (document.querySelector('.say-pill')) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'say-pill';
    b.textContent = 'Say something';
    b.title = 'Tell Connect what is wrong, or what would be better';
    b.onclick = function () { open(''); };
    host().appendChild(b);
  }

  /* WHERE IN THE FLOW. Not simply the end of <body>: ten screens centre their
     board with body{display:flex; justify-content:center}, a flex ROW, so a
     pill appended to the body there became a second column squeezed in beside
     the board -- off the right edge at phone width, and under the action bar
     (found by walk-with-data.mjs the first time it ran, 6 Oct 2026). So it goes
     INSIDE the page's own container: the tallest element child of the body
     that is in the flow, which on those screens is the board and everywhere
     else is the page wrapper. The body's own bottom padding, which every
     screen with a fixed bar already reserves, then keeps it clear of the bar.
     If nothing has a height yet, the last in-flow child; failing that, body. */
  function host() {
    var best = null, tall = 0, last = null;
    [].forEach.call(document.body.children, function (el) {
      if (/^(SCRIPT|STYLE|LINK|TEMPLATE|NOSCRIPT)$/.test(el.tagName)) return;
      var cs = getComputedStyle(el);
      if (cs.display === 'none' || /^(fixed|absolute|sticky)$/.test(cs.position)) return;
      last = el;
      if (el.offsetHeight > tall) { tall = el.offsetHeight; best = el; }
    });
    return best || last || document.body;
  }

  /* ANYTHING CAN NAME ITSELF. A lesson card carrying
     data-say="Speakout B1 · TP 2A · lesson 1" gets its own small link, and
     what arrives says which lesson it was about. */
  function hooks(root) {
    [].forEach.call((root || document).querySelectorAll('[data-say]'), function (el) {
      if (el.dataset.sayWired) return;
      el.dataset.sayWired = '1';
      var a = document.createElement('button');
      a.type = 'button';
      a.className = 'say-here';
      a.textContent = el.dataset.sayLabel || 'Something wrong here?';
      a.onclick = function (e) { e.preventDefault(); e.stopPropagation(); open(el.dataset.say); };
      el.appendChild(a);
    });
  }

  function start() {
    css();
    pill();
    hooks();
    /* pages here re-render whole panels, so the hooks are re-applied rather
       than wired once */
    if (window.MutationObserver) {
      new MutationObserver(function () { hooks(); }).observe(document.body, { childList: true, subtree: true });
    }
  }

  window.hubSay = { open: open, hooks: hooks };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
