// The Hub's pages were written against localStorage. This shim keeps them
// that way and moves the truth to the store: before a page's own script runs
// it fills the browser's storage from the store (the trainee's own records,
// or the whole roster for a tutor), and every write a page makes to a known
// key is pushed back to the store a moment later. Open the site with no link
// and there is no course to read, so the page does not run at all: it is
// replaced by a note asking for the link (Ramy, 21 Sep 2026: "get rid of solo
// mode"). Before that, a linkless visit rendered a working one-browser tool
// that moved work by exported files.
//
// Each page's app script is a <script type="text/x-hub-app"> block; it is
// run once the preload has finished.
(function(){
  /* A card drawn as a preview inside Course admin (invite.html ?preview=):
     no link, no boot, no gate, no writes. */
  if (window.HUB_PREVIEW) { window.HubMode = ''; return; }
  var S = window.HubStore;
  // Assessor mode (Ramy, 20 Sep 2026): boots like a tutor, writes nothing.
  var mode = !S ? '' : S.isTutor() ? 'tutor' : S.isAssessor() ? 'assessor' : S.isTrainee() ? 'trainee' : (S.isVolunteer && S.isVolunteer()) ? 'volunteer' : '';
  window.HubMode = mode;
  /* AN ASSESSOR ALWAYS HAS A WAY BACK (Ramy, 21 Oct 2026: "they don't know how this thing works... they
     should be able to easily get back"). On every page an assessor opens from the pack, a clear forest
     pill at the top goes back to it. Only for the assessor; the pack itself does not need it, and nor
     does the invitation card (23 Oct 2026): it is the way in, and the pill sat beside the card and
     pushed it off centre. */
  if (mode === 'assessor' && !/(12_assessor_pack|invite)\.html/.test(location.pathname)) {
    var addWayBack = function(){
      if (!document.body || document.getElementById('hubAkBack')) return;
      var a = document.createElement('a');
      a.id = 'hubAkBack'; a.href = '12_assessor_pack.html'; a.textContent = 'Back to the assessor pack';
      a.style.cssText = 'display:inline-block;margin:14px 0 0 16px;padding:9px 16px;border-radius:999px;background:#1E3B2F;color:#fff;font:700 0.86rem Karla,Helvetica,sans-serif;text-decoration:none;box-shadow:0 1px 2px rgba(35,34,32,.08),0 6px 16px rgba(35,34,32,.1);position:relative;z-index:5;';
      document.body.insertBefore(a, document.body.firstChild);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addWayBack); else addWayBack();
  }
  var TRAINEE_KEYS = { 'chub:plan':'plan', 'chub:selfeval':'selfeval', 'chub:feedback':'feedback', 'connect_assignment_submissions_v1':'assignments', 'chub:tpHistory':'tpHistory', 'chub:tracker':'tracker', 'connect_observations_v1':'observations', 'chub:links':'links', 'chub:celta5':'celta5', 'chub:celta5t':'celta5t', 'chub:agreement':'agreement', 'connect_fol_interview_v1':'interview' };
  var TUTOR_ONLY = { feedback:1, tpHistory:1, tracker:1, links:1, celta5t:1 }; // links: a trainee's private links, the tutor's to write; celta5t: the tutors' half of the CELTA 5
  // staffLinks -- about a trainee, for staff only -- has no trainee key at all: the store never hands it to a trainee's token
  var COURSE_KEYS = { 'connect_assignment_wording_v2':'wording', 'connect_course_settings':'settings', 'connect_observation_wording_v1':'observations', 'connect_timetable_v1':'timetable', 'connect_tp_points_v1':'tppoints', 'connect_volunteers_v1':'volunteers', 'connect_marking_guidance_v1':'guidance' };
  var origSet = localStorage.setItem.bind(localStorage), origRemove = localStorage.removeItem.bind(localStorage);
  var origGet = localStorage.getItem.bind(localStorage);
  var snapshot = {};   // tutor mode: token -> kind -> json, what the store holds
  var pill;

  function status(text, kind){
    /* A page that saves nothing (the invitation card) never says it saved:
       <body data-sync-quiet>. Errors still show (20 Oct 2026: the card's
       corner read "Saved as you go" on a page with nothing to save). */
    if (document.body && document.body.hasAttribute('data-sync-quiet') && (kind === 'ok' || kind === 'busy' || kind === 'demo')) return;
    /* A pinned demo course says so on the pill, so nobody reading a demo
       wonders why "today" is a Tuesday in March. */
    /* On a phone the pill says it in fewer words (10 Oct 2026: the bars at the
       foot of the plan took a quarter of an iPhone's screen). */
    var narrow = false; try { narrow = window.matchMedia('(max-width:560px)').matches; } catch (e) {}
    /* A page whose work waits for its own Save button says so instead of
       "saved as you go" (the assignment editor, 11 Oct 2026): <body
       data-sync-ok="..." data-sync-ok-short="...">. */
    if (text === 'Live \u2014 saved to the course as you go' && document.body && document.body.dataset.syncOk) text = narrow ? (document.body.dataset.syncOkShort || document.body.dataset.syncOk) : document.body.dataset.syncOk;
    /* Shorter everywhere (Ramy, 19 Oct 2026: "unnecessarily big"). */
    if (text === 'Live \u2014 saved to the course as you go') text = 'Saved as you go';
    try { var cs0 = JSON.parse(localStorage.getItem('connect_course_settings') || '{}') || {}; if (cs0.demoToday && kind === 'ok' && !/^Demo/.test(text)) { text = narrow ? (text === 'Saved as you go' ? 'Saved' : text) + ' \u00b7 Demo ' + cs0.demoToday : text + ' \u00b7 Demo, today is ' + cs0.demoToday; kind = 'demo'; } } catch (e) {}
    /* Until the page has measured its bar (hubReserveForBar, once the app has
       run), the pill sat at the corner -- on top of Turn in for the whole of
       "Loading from the course..." (10 Oct 2026). It measures the bar itself
       the first time; the page's own fit takes over from there. */
    try {
      var root = document.documentElement;
      if (!root.style.getPropertyValue('--sync-bottom')) {
        var bar0 = document.querySelector('.actionbar');
        if (bar0 && getComputedStyle(bar0).position === 'fixed') { var h0 = bar0.getBoundingClientRect().height; if (h0 > 0) root.style.setProperty('--sync-bottom', Math.ceil(h0 + 14) + 'px'); }
      }
    } catch (e) {}
    if (!pill){ pill = document.createElement('div'); pill.id = 'hubSync'; pill.style.cssText = 'position:fixed;left:14px;bottom:var(--sync-bottom,14px);z-index:900;font:600 11px/1 Karla,sans-serif;padding:7px 11px;border-radius:999px;background:oklch(37.5% 0.058 195);color:#fff;opacity:.85;pointer-events:none;transition:opacity .3s;'; document.body.appendChild(pill); }
    pill.textContent = text; pill.style.background = kind === 'error' ? '#7A2E2E' : kind === 'busy' ? '#6B6963' : '#1E3B2F';
    /* the mark turns beside anything Lite is waiting on (21 Oct 2026) */
    if (kind === 'busy' && window.hubSpinner) { pill.insertAdjacentHTML('afterbegin', window.hubSpinner(14)); pill.style.display = 'inline-flex'; pill.style.alignItems = 'center'; pill.style.gap = '7px'; }
    pill.style.opacity = '.85';
    if (kind === 'ok' || kind === 'demo') setTimeout(function(){ if (pill.textContent === text) pill.style.opacity = '0'; }, kind === 'demo' ? 4000 : 1800);
    if (kind === 'demo') pill.style.background = 'oklch(52% 0.098 70)';   // gold: a demo, and it stays up
  }
  function parse(v){ try { return JSON.parse(v); } catch (e) { return null; } }
  function runApp(){
    var blocks = Array.prototype.slice.call(document.querySelectorAll('script[type="text/x-hub-app"]'));
    blocks.forEach(function(b){ var el = document.createElement('script'); el.textContent = b.textContent; b.parentNode.replaceChild(el, b); });
    document.dispatchEvent(new Event('hub:ready'));
  }

  // No link, no course. Every screen answers the same way rather than rendering
  // an empty shell of itself, and the page's own script never runs.
  /* Shutting the screen down before the gate paints over it.
   *
   * gate() replaced document.body and left everything else running. The
   * screen's own intervals kept ticking and its document-level listeners kept
   * firing against elements that no longer existed -- "Cannot set properties
   * of null (setting 'textContent')" from a handler writing to a status line
   * that had just been deleted. Harmless in that the page was already a dead
   * end, but a page that is dead should stop moving (24 Sep 2026).
   *
   * Three things end it, and none of them hides an error:
   *   1. every timer the page set, so nothing ticks;
   *   2. a capture-phase damper, so an event never reaches the screen's own
   *      handlers -- capture on document runs before anything the screens
   *      registered, and stopImmediatePropagation ends it there. The banner is
   *      let through, because it is the one thing still meant to work;
   *   3. a brand-new <body>, so nothing holds a live reference into the old
   *      one.
   */
  var STOPPED = false;
  function shutdown(){
    if (STOPPED) return; STOPPED = true;
    try {
      var last = setTimeout(function(){}, 0);
      for (var i = 1; i <= last; i++) { clearTimeout(i); clearInterval(i); }
    } catch (e) {}
    try {
      ['focusin','focusout','keydown','keyup','keypress','input','change',
       'click','mousedown','mouseup','paste','drop','submit'].forEach(function(t){
        document.addEventListener(t, function(e){
          var n = e.target;
          if (n && n.closest && n.closest('#hubUnsaved')) return;   // the banner still works
          e.stopImmediatePropagation();
        }, true);
      });
    } catch (e) {}
    try {
      if (document.body) document.documentElement.replaceChild(document.createElement('body'), document.body);
    } catch (e) {}
  }

  /* A PIN refusal (v87). The invitation card never asks, so for it the link
     is fine: the card says the link also has a PIN and stays drawn. On a
     course page the sheet has already asked: three wrong tries, or Not now,
     and the page gates with the way out, which is a new link from course
     admin, not another guess. */
  function pinRefused(err){
    if (window.HUB_NO_PIN_PROMPT) { try { document.body.dataset.pin = '1'; status('This link has a PIN \u2014 the page behind Open asks for it', 'ok'); } catch (e) {} return 'pin'; }
    gate(err.message === 'Wrong PIN'
      ? 'The PIN did not match three times. If you remember it, reload the page and try again. If not, ask your course admin for a new link; it lets you choose a PIN again.'
      : 'This link needs its PIN. Reload the page to type it.');
    return 'gated';
  }
  function gate(reason){
    shutdown();
    /* The heading is neutral and the store's reason, under it, says which:
       "not on the course" (a link that never was), "no longer opens the
       course" (a volunteer taken off the register), an expired assessor link.
       It said "This link no longer opens the course" for all of them, which is
       wrong for a link that never worked (bug walk, 10 Oct 2026). */
    /* A page may offer a front page for somebody who has no link at all
       (index.html does, through hub-front.js, 3 Oct 2026). A link that has
       STOPPED working carries a reason and always gets the plain refusal:
       that is news, not an invitation. */
    if (!reason && typeof window.hubNoLink === 'function') { window.hubNoLink(); return; }
    /* In the notebook (Ramy, 21 Oct 2026: it "doesn't match what we have now"): the Bright White page,
       a white card with the shadow, ink text, the cream mark. It used to be the old beige. */
    document.documentElement.style.background = '#F3F3F7';
    document.body.style.cssText = 'margin:0;background:#F3F3F7;min-height:100vh;';
    document.body.innerHTML =
      '<div style="max-width:560px;margin:14vh auto 40px;padding:30px 28px 28px;background:#fff;border-radius:16px;box-shadow:0 1px 2px rgba(35,34,32,.06),0 10px 30px rgba(35,34,32,.08);font-family:Karla,Helvetica,sans-serif;color:#232220;box-sizing:border-box;width:calc(100% - 32px);">'
      + '<div style="display:flex;align-items:center;gap:9px;margin-bottom:26px;">'
      + '<span style="width:30px;height:30px;border-radius:7px;background:#f8f6f1;box-shadow:inset 0 0 0 1px oklch(85% 0.02 80);display:inline-flex;align-items:center;justify-content:center;">'
      + '<svg viewBox="8 28 104 64" width="20" height="12" fill="none">'
      + '<path d="M56.1 42.2 A 24 24 0 1 0 56.1 77.8" stroke="#a8803f" stroke-width="13" stroke-linecap="round"></path>'
      + '<path d="M96.1 42.2 A 24 24 0 1 0 96.1 77.8" stroke="#2b2218" stroke-width="13" stroke-linecap="round"></path>'
      + '</svg></span>'
      + '<span style="position:relative;display:inline-block;">'
      + '<span style="font-family:Instrument Serif,Georgia,serif;font-style:italic;font-size:21px;line-height:0.85;color:#a8803f;">Connect</span>'
      + '<span style="position:absolute;left:1px;top:100%;margin-top:2px;font-family:Instrument Sans,Karla,sans-serif;font-weight:600;font-size:8px;line-height:1;letter-spacing:0.24em;text-transform:uppercase;">Lite</span>'
      + '</span></div>'
      + '<h1 style="font-family:Newsreader,Georgia,serif;font-weight:400;font-size:2rem;line-height:1.2;margin:0 0 12px;color:#232220;">' + (reason ? 'The course could not be opened from this link' : 'Open your course link') + '</h1>'
      + (reason ? '<p style="font-size:0.92rem;line-height:1.65;color:#7A2E2E;font-weight:700;margin:0 0 14px;">' + String(reason).replace(/[<&]/g, ' ') + '</p>' : '')
      + '<p style="font-size:0.92rem;line-height:1.65;color:#55524c;margin:0;">This page reads one course, through the link your centre sent you. Trainees have their own personal link, tutors share the tutor link, and an assessor has a read-only one. Open the page from that link and everything appears.</p>'
      + '<p style="font-size:0.92rem;line-height:1.65;color:#55524c;margin:14px 0 0;">Lost it? Your course admin can send it again from the Roster and links tab.</p>'
      + '</div>';
    /* This page has just been wiped. If anything of this person's is unsaved,
       that is the single most important thing on the screen. */
    try { showUnsaved(); } catch (e) {}
  }

  // ---- write-through --------------------------------------------------------
  // Writes are queued for 600 ms and sent together. A page that writes and
  // then navigates in the same breath ('Start next TP' clears three keys and
  // goes home) would lose them, so on pagehide whatever is still queued goes
  // out as beacons, which the browser delivers after the page is gone.
  var queue = {}, timer = null;
  // Unconfirmed writes are kept in the browser until the store has answered,
  // so a write handed to the beacon as a page closed is re-sent by the next
  // page, and a boot never overwrites a record this browser has changed but
  // the store has not confirmed yet (the cache-first race, 20 Sep 2026).
  /* A DEMO COURSE IS PRIVATE TO EACH VISIT (Ramy, 19 Oct 2026: "if I'm going to
     share this with other people, are they going to type over each other?").
     A demo course (one with a pinned demo date) is read from the store as
     usual, but nothing is ever sent back: each write is kept in THIS TAB's
     session storage, laid over the course on every page of the visit, and
     gone when the tab closes. The next visit starts from the clean demo.
     hub-store.js refuses the writes that do not come through here (emails,
     uploads, roster changes). */
  function demoNow(){ try { var c = JSON.parse(localStorage.getItem('connect_course_settings') || '{}') || {}; return !!c.demoToday; } catch (e) { return false; } }
  var DEMO = demoNow();
  window.HUB_DEMO = DEMO;
  function demoSession(){ try { return sessionStorage.getItem('hub:demoVisit') === '1'; } catch (e) { return false; } }
  function LS(){ return DEMO ? sessionStorage : localStorage; }
  var LEDGER = 'hub:pending:' + mode + ':' + (!S ? '' : mode === 'tutor' ? S.key() : mode === 'assessor' ? S.assessorKey() : mode === 'volunteer' ? S.volunteerToken() : S.token());
  function ledger(){ return parse((function(){ try { return LS().getItem(LEDGER); } catch (e) { return null; } })()) || {}; }
  function ledgerSet(l){ try { var st = LS(); if (Object.keys(l).length) { if (st === localStorage) origSet(LEDGER, JSON.stringify(l)); else st.setItem(LEDGER, JSON.stringify(l)); } else { if (st === localStorage) origRemove(LEDGER); else st.removeItem(LEDGER); } } catch (e) {} }
  function remember(id, job){ var l = ledger(); l[id] = job; ledgerSet(l); }
  function confirmed(id){ var l = ledger(); if (l[id]) { delete l[id]; ledgerSet(l); } unnote(id); }

  /* WHAT DID NOT SAVE, kept apart from the ledger and outliving the page.
   *
   * Found 24 Sep 2026 on Ramy's own live course, with a real cohort two weeks
   * away. flush() used to read: if the error was not marked `transient`, call
   * confirmed(id) -- which DELETES the job from the ledger -- and rethrow. Only
   * TRANSPORT failures are marked transient (hub-store: timed out, could not
   * reach, did not answer as JSON). Everything the Apps Script returns as a
   * JSON error is therefore "permanent", so the write was thrown away and the
   * ledger was left EMPTY, which is indistinguishable from having saved. The
   * one signal was the sync pill reading "Not saved -- ...", on a page the
   * boot's gate() had already replaced. A tutor's feedback could go that way
   * in silence.
   *
   * So a rejected write now leaves a record that survives the page, the tab
   * and the browser being closed, and says so on screen until it saves or the
   * person dismisses it. The job also stays in the ledger to be retried on the
   * next page -- up to RETRIES, because an error that really is permanent
   * (a trainee removed from the course) must not be re-sent for ever. After
   * that it stops being sent and the record stays, which is the honest state:
   * this did not save, and nothing is still trying. */
  var UNSAVED = 'hub:unsaved:' + mode + ':' + (!S ? '' : mode === 'tutor' ? S.key() : mode === 'assessor' ? S.assessorKey() : mode === 'volunteer' ? S.volunteerToken() : S.token());
  var RETRIES = 3;
  function unsaved(){ return parse((function(){ try { return localStorage.getItem(UNSAVED); } catch (e) { return null; } })()) || {}; }
  function unsavedSet(u){ try { if (Object.keys(u).length) origSet(UNSAVED, JSON.stringify(u)); else origRemove(UNSAVED); } catch (e) {} }
  function note(id, job, err){
    var u = unsaved();
    var prev = u[id] || { tries: 0 };
    u[id] = { what: describe(job), message: (err && err.message) || String(err || 'refused'),
              at: Date.now(), tries: (prev.tries || 0) + 1, job: job };
    unsavedSet(u);
    return u[id].tries;
  }
  function unnote(id){ var u = unsaved(); if (u[id]) { delete u[id]; unsavedSet(u); showUnsaved(); } }
  /* Named for the person reading it, not for the wire. */
  function describe(job){
    var kind = job && job.kind;
    return ({ plan: 'a lesson plan', selfeval: 'a self-evaluation', feedback: 'tutor feedback',
              tpHistory: 'the teaching practice record', assignments: 'assignment work', observations: 'observation tasks', links: 'a trainee\u2019s links', staffLinks: 'a staff-only link', celta5: 'the CELTA 5', celta5t: 'the CELTA 5',
              tracker: 'the tracker', settings: 'the course settings',
              wording: 'the assignment wording', roster: 'the roster' })[kind] || 'a change';
  }
  // Which storage key a queued job stands for, so a boot can leave it alone.
  function keyOfJob(id){
    if (id.indexOf('t:') === 0) { var kind = id.slice(2); for (var k in TRAINEE_KEYS) if (TRAINEE_KEYS[k] === kind) return k; }
    if (id.indexOf('c:') === 0) { var ck = id.slice(2); for (var c in COURSE_KEYS) if (COURSE_KEYS[c] === ck) return c; }
    if (id.indexOf('r:') === 0) return 'connect_roster_v1';
    return null;
  }
  /* The banner. It has to outlive the page it was raised on: the boot's gate()
     replaces document.body outright, and the failure that matters most is
     exactly the one that arrives alongside a refused boot. Hence the observer
     -- if the body loses it, it goes back. */
  var HIDDEN = false;
  function showUnsaved(){
    if (!document.body) { document.addEventListener('DOMContentLoaded', showUnsaved); return; }
    var u = unsaved(), ids = Object.keys(u);
    var el = document.getElementById('hubUnsaved');
    if (!ids.length || HIDDEN){ if (el) el.remove(); return; }
    if (!el){
      el = document.createElement('div');
      el.id = 'hubUnsaved';
      el.style.cssText = 'position:fixed;left:0;right:0;top:0;z-index:2147483000;' +
        'background:oklch(96% 0.03 27);border-bottom:2px solid oklch(45% 0.15 27);' +
        'color:oklch(23.5% 0.017 65);font:600 13px/1.5 Karla,Helvetica,sans-serif;' +
        'padding:11px 16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;';
    }
    var newest = ids.map(function(i){ return u[i]; }).sort(function(a,b){ return b.at - a.at; })[0];
    var what = ids.length === 1 ? newest.what : ids.length + ' changes';
    var stalled = ids.every(function(i){ return (u[i].tries || 0) >= RETRIES; });
    el.innerHTML =
      '<span style="flex:1;min-width:240px;">' +
      '<b style="color:oklch(45% 0.15 27);">Not saved to the course \u2014 ' + esc(what) + '.</b> ' +
      esc(newest.message) + '. It is still here in this browser' +
      (stalled ? ', and nothing is trying any more.' : ' and will be sent again.') +
      '</span>' +
      '<button type="button" data-u="retry" style="font:700 12px Karla,sans-serif;padding:7px 14px;border-radius:20px;border:1.5px solid oklch(45% 0.15 27);background:none;color:oklch(45% 0.15 27);cursor:pointer;">Try again</button>' +
      '<button type="button" data-u="hide" style="font:600 12px Karla,sans-serif;padding:7px 12px;border-radius:20px;border:none;background:none;color:oklch(42% 0.02 68);cursor:pointer;">Hide</button>';
    el.querySelector('[data-u=retry]').onclick = function(){
      var uu = unsaved();
      Object.keys(uu).forEach(function(i){ if (uu[i].job) schedule(i, uu[i].job); });
    };
    /* Hide, not dismiss: it is back on the next page, because the change is
       still unsaved and quietly forgetting it is the bug being fixed. */
    el.querySelector('[data-u=hide]').onclick = function(){ HIDDEN = true; el.remove(); };
    if (el.parentNode !== document.body) document.body.appendChild(el);
    document.documentElement.style.scrollPaddingTop = el.offsetHeight + 'px';
  }
  function esc(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  if (typeof MutationObserver === 'function') {
    var watch = function(){
      if (!document.body) return;
      new MutationObserver(function(){
        if (Object.keys(unsaved()).length && !document.getElementById('hubUnsaved')) showUnsaved();
      }).observe(document.body, { childList: true });
    };
    if (document.body) watch(); else document.addEventListener('DOMContentLoaded', watch);
  }

  function payloadFor(job){ var pl = Object.assign({}, job); if (key()) pl.key = key(); return pl; }
  function key(){ return S.key(); }
  function schedule(id, job){ queue[id] = job; remember(id, job); clearTimeout(timer); timer = setTimeout(flush, 600); status('Saving…', 'busy'); }
  /* One flush at a time. Each flush used to start the moment it was asked,
     so a Return clicked while the last autosave was still on its way sent the
     returned record alongside the draft, and Apps Script finished them in
     whichever order it liked: the draft landed second and the store kept it,
     while both answered ok and the pill said "Saved to the course" (Ramy's
     walkthrough, practice course, 8 Oct 2026). Now a flush waits for the one
     in flight, then takes whatever is queued by then -- the later write is
     always the later arrival. */
  var inflight = Promise.resolve();
  function flush(){
    var run = inflight.then(flushOnce, flushOnce);
    inflight = run.catch(function(){});
    return run;
  }
  function flushOnce(){
    var jobs = queue; queue = {}; clearTimeout(timer); timer = null;
    var keys = Object.keys(jobs);
    if (!keys.length) return Promise.resolve();
    if (DEMO) { status('Demo \u00b7 kept on this device', 'demo'); return Promise.resolve(); }   /* stays in this tab's ledger; never sent */
    // One at a time: Apps Script copes badly with a burst.
    var all = keys.reduce(function(chain, k){ return chain.then(function(){ return S.call(jobs[k]).then(function(r){ confirmed(k); return r; }, function(err){
      if (err && err.transient) throw err;          // stays in the ledger; the next page sends it again
      if (note(k, jobs[k], err) >= RETRIES) {       // recorded either way -- the record is the point
        var l = ledger(); if (l[k]) { delete l[k]; ledgerSet(l); }  // stop re-sending, KEEP the record
      }
      showUnsaved();
      throw err;
    }); }); }, Promise.resolve());
    all.then(function(){ status('Saved to the course', 'ok'); }).catch(function(err){ status('Not saved \u2014 ' + (err && err.message || err), 'error'); });
    return all;
  }
  // A page about to navigate awaits this, so nothing is left to the beacon.
  // A page about to navigate waits up to 2.5 s for the store; after that the
  // beacon and the ledger carry the rest, so 'Start next TP' never hangs.
  // A page that is STAYING passes `wait` and gets the store's actual answer,
  // however long it takes: the tutor's Return holds its button down on this,
  // and a 2.5 s cap would have let the screen say "Returned" with a 100 KB
  // document still on its way (26 Sep 2026).
  window.HubSync = { flushNow: function(wait){ var f = flush(); return wait ? f : Promise.race([f, new Promise(function(r){ setTimeout(r, 2500); })]); }, mode: mode };
  function flushBeacon(){
    if (DEMO) { queue = {}; clearTimeout(timer); timer = null; return; }
    var jobs = queue; queue = {}; clearTimeout(timer); timer = null;
    Object.keys(jobs).forEach(function(k){
      var body = JSON.stringify(payloadFor(jobs[k]));
      var sent = false;
      try { sent = navigator.sendBeacon(S.url, new Blob([body], { type: 'text/plain' })); } catch (e) {}
      if (!sent) { try { fetch(S.url, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: body, keepalive: true }); } catch (e) {} }
    });
  }
  window.addEventListener('pagehide', flushBeacon);

  /* And if anything is still unsent, SAY SO before the tab goes.
   *
   * Ramy, 25 Sep 2026, after a deadline he had set looked right on his own
   * screen and had never reached the course: "someone could imagine that this
   * is actually working, because they can't see it." Quite. The pill says
   * "Saving…" and then "Saved to the course", but nothing stops you closing
   * the tab in between, and a page you have closed cannot tell you it failed.
   *
   * The beacon above is the belt: it hands what is queued to the browser to
   * deliver after the page is gone. This is the braces, for the case the
   * beacon cannot cover -- a write the store has already refused and which is
   * sitting in the ledger, or a queue that has not flushed yet. The browser
   * shows its own "Leave site?" dialog; the wording is the browser's and
   * cannot be changed, which is why the pill carries the detail.
   *
   * Only when something is genuinely outstanding, so an ordinary close is
   * never interrupted. */
  window.addEventListener('beforeunload', function(e){
    if (DEMO) return;   /* a demo's writes are meant to stay behind */
    var pending = Object.keys(queue).length || Object.keys(ledger()).length;
    if (!pending) return;
    e.preventDefault();
    e.returnValue = '';           // required for the dialog to appear at all
    return '';
  });
  function recordOf(tr){ return { plan: (tr.tp && tr.tp.plan) || null, selfeval: (tr.tp && tr.tp.selfeval) || null, feedback: (tr.tp && tr.tp.feedback) || null, tpHistory: (tr.tp && tr.tp.history) || {}, assignments: tr.assignments || {}, tracker: tr.tracker || {}, observations: tr.observations || {}, links: tr.links || [], staffLinks: tr.staffLinks || [], celta5: tr.celta5 || {}, celta5t: tr.celta5t || {} }; }
  /* The store's roster, with this browser's own unconfirmed records laid over
     it -- one trainee's one record at a time.
     The boot used to leave the WHOLE roster alone if anything in it was
     dirty: one pending write for one trainee, and every other trainee's
     records stayed as this browser last saw them. So the feedback screen for
     Defne opened locked on "Returned -- Reopen for edits" for a TP she had
     already filed away and moved on from, because Emily's return a minute
     earlier was still waiting on the store (demo course, 26 Sep 2026). A
     fresh browser boots clean, which is why no walk and no new device ever
     saw it. What this browser has written and the store has not confirmed
     -- a held job, or a write this page made -- is a (token, kind) pair, and
     that pair is what is kept; everything else is the store's. */
  var wrotePairs = {};
  function mergeRoster(incoming){
    var keep = Object.assign({}, heldPairs, wrotePairs);
    if (!Object.keys(keep).length) return incoming;
    var theirs = parse(incoming), mine = parse(current('connect_roster_v1'));
    if (!theirs || !theirs.trainees || !mine || !mine.trainees) return incoming;
    Object.keys(theirs.trainees).forEach(function(token){
      var m = mine.trainees[token]; if (!m) return;
      var t = theirs.trainees[token], rm = recordOf(m);
      Object.keys(rm).forEach(function(kind){
        if (!keep[token + ':' + kind]) return;
        if (kind === 'assignments' || kind === 'tracker' || kind === 'observations' || kind === 'links' || kind === 'staffLinks' || kind === 'celta5' || kind === 'celta5t') t[kind] = rm[kind];
        else { t.tp = t.tp || {}; t.tp[kind === 'tpHistory' ? 'history' : kind] = rm[kind]; }
      });
    });
    return JSON.stringify(theirs);
  }
  function route(key, value){
    if (mode === 'assessor' || mode === 'volunteer') return; // read-only: nothing this browser does reaches the course
    var data = value == null ? null : parse(value);
    if (mode === 'trainee' && TRAINEE_KEYS[key]) {
      if (!S.token()) return; // the link is gone from this browser: nothing to write to
      var kind = TRAINEE_KEYS[key];
      if (TUTOR_ONLY[kind] && !(kind === 'feedback' && data === null)) return; // the tutor's records: read here, never written
      schedule('t:' + kind, { op: 'put', token: S.token(), kind: kind, data: data });
    }
    if (mode === 'tutor' && COURSE_KEYS[key]) schedule('c:' + COURSE_KEYS[key], { op: 'putCourse', kind: COURSE_KEYS[key], data: data });
    if (mode === 'tutor' && key === 'connect_roster_v1' && data && data.trainees) {
      Object.keys(data.trainees).forEach(function(token){
        var rec = recordOf(data.trainees[token]);
        snapshot[token] = snapshot[token] || {};
        Object.keys(rec).forEach(function(kind){
          var json = JSON.stringify(rec[kind]);
          if (snapshot[token][kind] === json) return;
          snapshot[token][kind] = json;
          if (started) wrotePairs[token + ':' + kind] = true;
          schedule('r:' + token + ':' + kind, { op: 'put', token: token, kind: kind, data: rec[kind] });
        });
      });
    }
  }
  /* SAFARI (21 Oct 2026). Assigning localStorage.setItem = fn works in
     Chrome, but Safari (and Firefox) follow the Storage rules and store a
     key called "setItem" instead: the hook was never installed, and nothing
     a tutor saved through localStorage in Safari reached the course. Found
     when C/18's first volunteer would not save. The hook goes on the
     prototype, for this one storage object only, which every engine honours;
     the stray keys an earlier load left behind are cleared. */
  var pSet = Storage.prototype.setItem, pRemove = Storage.prototype.removeItem;
  Storage.prototype.setItem = function(k, v){ pSet.call(this, k, v); if (this === localStorage) route(k, v); };
  Storage.prototype.removeItem = function(k){ pRemove.call(this, k); if (this === localStorage) route(k, null); };
  try { ['setItem', 'removeItem'].forEach(function(k){ if (Object.prototype.hasOwnProperty.call(localStorage, k) || origGet(k) !== null) pRemove.call(localStorage, k); }); } catch (e) {}

  // ---- preload ------------------------------------------------------------------
  // Apps Script answers in 1.5-13 s even for a ping (measured 20 Sep 2026), so
  // a page cannot wait for it. Once this browser has booted this link once, the
  // page runs at once from what it holds (the same localStorage keys) and the
  // boot runs behind it; if the course has moved on and nothing was written
  // here in the meantime, the page reloads itself -- instantly, from the fresh
  // copy. A write made before the boot answers wins: the boot then only
  // refreshes the keys it did not touch and leaves the page alone.
  // gate(reason) treats its argument as the reason a link STOPPED working, so
  // handing it straight to addEventListener passed the DOMContentLoaded Event
  // as that reason: someone opening the bare URL with no link at all was told
  // "This link no longer opens the course" -- a different and much more
  // alarming claim than "Open your course link" -- over a paragraph reading
  // "[object Event]". Only on a page that had not finished parsing, which is
  // the ordinary case for a fresh visit, so this is what the live site showed
  // (walked 23 Sep 2026).
  if (!mode) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ gate(); }); else gate(); return; }
  showUnsaved();   // a refusal from an earlier session is still a refusal
  var identity = mode + ':' + (mode === 'tutor' ? S.key() : mode === 'assessor' ? S.assessorKey() : mode === 'volunteer' ? S.volunteerToken() : S.token());
  var cached = false; try { cached = localStorage.getItem('hub:booted') === identity; } catch (e) {}
  if (DEMO && !demoSession()) cached = false;   /* a new visit: wait for the clean course, not last visit's copy */
  var dirty = {}, started = false;
  // Writes the store never confirmed: their keys are off-limits to the boot,
  // and they go out again now. A roster write is one trainee's one record,
  // and it is that PAIR the boot leaves alone, not the roster: held roster
  // jobs go into heldPairs and are merged in by mergeRoster below.
  var held = ledger(), heldPairs = {};
  Object.keys(held).forEach(function(id){
    if (id.indexOf('r:') === 0) { heldPairs[id.slice(2)] = true; return; }
    var k = keyOfJob(id); if (k) dirty[k] = true;
  });
  if (Object.keys(held).length) setTimeout(function(){ Object.keys(held).forEach(function(id){ schedule(id, held[id]); }); }, 0);
  // ...and again the moment the connection comes back, without waiting for a
  // page change. Ramy, 24 Sep 2026: "I have it on my desktop and write the
  // plan, and then when the internet is back, we can upload." A write made
  // while offline fails as transient and sits in the ledger; until this it
  // only went out on the NEXT page load, so a tab left open all evening
  // never sent anything by itself.
  window.addEventListener('online', function(){
    var l = ledger(); var ids = Object.keys(l); if (!ids.length) return;
    status('Back online — sending what was written', 'busy');
    ids.forEach(function(id){ schedule(id, l[id]); });
  });
  var origRoute = route;
  route = function(k, v){ if (started) dirty[k] = true; origRoute(k, v); };

  // What a boot answer means for this browser's storage: key -> JSON or null.
  //
  // A null in here DELETES. That is right when the store has spoken and the
  // record is genuinely gone, and dangerous when the answer was not about this
  // person at all: `boot.me || { records: {} }` used to read an empty answer as
  // "you have nothing", and every draft in the browser went with it.
  //
  // The store never resolves a trainee boot without `me`, nor a tutor's or
  // assessor's without `roster` -- an unknown token or key throws instead. So a
  // resolved boot missing its own subject is a malformed answer, and the only
  // safe reading of it is that nothing is known: change nothing.
  //
  // Walking the trainee role on 21 Sep 2026 left `hub:me` as "{}" and
  // `hub:name` as "" with the course records gone -- which is exactly what
  // plan({}) writes. The trigger was not reproducible afterwards (a rejected
  // boot correctly changes nothing and says "showing this browser's copy"), but
  // the effect was real, and this makes it impossible rather than unlikely.
  function plan(boot){
    boot = boot || {};
    /* A VOLUNTEER'S BOOT is its own small shape (30 Sep 2026): the store
       answers with { volunteer, course:{settings, timetable} } and nothing
       else. Their page is made of exactly that, so that is all that lands. */
    if (mode === 'volunteer') {
      if (!boot.volunteer) return {};
      var vc = boot.course || {};
      return {
        'hub:volunteer': JSON.stringify(boot.volunteer),
        'connect_course_settings': vc.settings ? JSON.stringify(vc.settings) : null,
        'connect_timetable_v1': vc.timetable ? JSON.stringify(vc.timetable) : null,
        'connect_shared_v1': vc.shared ? JSON.stringify(vc.shared) : null
      };
    }
    if (mode === 'trainee' ? !boot.me : !boot.roster) return {};
    var course = boot.course || {}, out = {};
    /* The course's own id, for a tutor: the volunteer register mints each
       student's link as "<courseId>-<random>" and this is the only way the
       browser can learn which course it is on (store version 43). */
    if (course.id) out['hub:course'] = String(course.id);
    /* A correction to the shipped criteria, adopted once by a course that never
       had its own -- see CONNECT_HUB_ADOPT_CORRECTED_CRITERIA in
       assignment-defaults.js for why, and for the shape of the question it
       asks. Here are its guards.
         - Tutor only: one writer, and the putCourse below heals the store, so
           every trainee then reads the same criteria the tutor is marking to.
         - Nothing marked anywhere on the course: criteriaMarks are positional,
           and the corrected lists are shorter, so on marked work a Met would
           move to a different criterion.
       The put goes through the same queue as any other course write, so it is
       ledgered and retried like the rest, and a course that has already adopted
       no longer matches -- this cannot fire twice. */
    if (mode === 'tutor' && course.wording && window.CONNECT_HUB_ADOPT_CORRECTED_CRITERIA) {
      var marked = (boot.roster || []).some(function(t){
        var a = ((t || {}).records || {}).assignments;
        return !!a && Object.keys(a).length > 0;
      });
      if (!marked && window.CONNECT_HUB_ADOPT_CORRECTED_CRITERIA(course.wording).length) {
        schedule('c:wording', { op: 'putCourse', kind: 'wording', data: course.wording });
      }
    }
    out['connect_assignment_wording_v2'] = course.wording ? JSON.stringify(window.hubWordingFilled ? window.hubWordingFilled(course.wording) : course.wording) : null;
    out['connect_course_settings'] = course.settings ? JSON.stringify(course.settings) : null;
    /* The marking guidance (17 Oct 2026): the store sends it to the tutors and
       the assessor only, so a trainee's copy is always null here. */
    out['connect_marking_guidance_v1'] = course.guidance ? JSON.stringify(course.guidance) : null;
    out['connect_observation_wording_v1'] = course.observations ? JSON.stringify(course.observations) : null;
    /* The course stream (28 Sep 2026): read-only here for every mode -- a
       tutor posts through the store's own post/unpost ops, never by putting
       the list whole. */
    out['connect_course_stream_v1'] = course.stream ? JSON.stringify(course.stream) : null;
    /* The TP7-TP8 planning grid (28 Sep 2026): the store shapes it per
       reader -- a trainee gets their group's rows by name once released,
       nothing before; tutors the whole thing. Written through gridSet /
       gridRelease, never put whole. */
    out['connect_tp_grid_v1'] = course.grid ? JSON.stringify(course.grid) : null;
    /* The timetable (29 Sep 2026): one record for the whole course, read by
       everyone on it, written by the course admin through putCourse like
       settings and wording. There is nothing per-reader about a timetable --
       the same grid is what the trainee, the tutor and the assessor need to
       be looking at. */
    out['connect_timetable_v1'] = course.timetable ? JSON.stringify(course.timetable) : null;
    /* The rotated teaching-practice points (29 Sep 2026): the store shapes it
       per reader, the same rule as the planning grid -- a trainee gets their
       own group's points once released and nothing before, tutors and the
       assessor get the whole rotation. */
    out['connect_tp_points_v1'] = course.tppoints ? JSON.stringify(course.tppoints) : null;
    /* The volunteer register (30 Sep 2026). The store sends it to tutors and
       the assessor and nobody else: these are members of the public, and a
       trainee has no business holding a list of their names and who turned
       up when. Written whole by a tutor, like the timetable. */
    out['connect_volunteers_v1'] = course.volunteers ? JSON.stringify(course.volunteers) : null;
    /* v56 (1 Oct 2026): how many volunteer students are coming to the next
       class -- a count, no names -- for the home and the dashboard. */
    out['connect_coming_v1'] = course.coming ? JSON.stringify(course.coming) : null;
    /* What the trainees have shared with the volunteer students (30 Sep
       2026). Everyone on the course reads it -- it is the trainees' own
       handouts, not anybody's private data -- and it is written through the
       store's shareMaterial op, never put whole. */
    out['connect_shared_v1'] = course.shared ? JSON.stringify(course.shared) : null;
    /* The Focus on the Learner pool (15 Oct 2026): what trainees heard in their
       student interviews, one list for the course; tutors get who heard it. */
    out['connect_fol_pool_v1'] = course.folpool ? JSON.stringify(course.folpool) : null;
    /* The register as a trainee may read it: names, levels, and whether each
       student has agreed to be recorded. Tutors read the whole register above. */
    out['connect_volunteer_names_v1'] = course.volunteerNames ? JSON.stringify(course.volunteerNames) : null;
    /* The end-of-course feedback (23 Oct 2026): the answers, for the tutors
       only -- anonymous unless a trainee chose to add their name. Read-only
       here; a trainee sends through the store's courseFeedback op. */
    out['connect_course_feedback_v1'] = course.courseFeedback ? JSON.stringify(course.courseFeedback) : null;
    if (mode === 'trainee') {
      var me = boot.me || { records: {} };
      /* that this trainee has answered, and when -- never what */
      out['chub:courseFeedbackSent'] = me.records.courseFeedbackSent ? JSON.stringify(me.records.courseFeedbackSent) : null;
      out['hub:name'] = me.name || '';
      out['hub:me'] = JSON.stringify({ token: me.token, name: me.name, group: me.group });
      Object.keys(TRAINEE_KEYS).forEach(function(key){ var v = me.records[TRAINEE_KEYS[key]]; out[key] = v == null ? null : JSON.stringify(v); });
      /* The history is the tutor's to write, so a trainee's own filing of it
         never leaves this browser (TUTOR_ONLY, above). "Start next TP" files
         the returned feedback into the history and then DELETES the live copy,
         and that delete does reach the store -- so if the store's history had
         not already been given this teaching practice, the next boot replaced
         the local filing with the store's shorter one and the document was
         gone for good (trainee walk, 22 Sep 2026). The store still wins for
         every teaching practice it knows; this only keeps the ones it does
         not, which is the trainee's own copy of what they were returned. */
      out['chub:tpHistory'] = (function(){
        var theirs = me.records.tpHistory || {}, mine = parse(current('chub:tpHistory')) || {};
        var merged = null;
        Object.keys(mine).forEach(function(n){
          if (theirs[n] || !mine[n] || !mine[n].docHTML) return;
          if (!merged) merged = JSON.parse(JSON.stringify(theirs));
          merged[n] = mine[n];
        });
        if (!merged) return out['chub:tpHistory'];
        return JSON.stringify(merged);
      })();
      return out;
    }
    if (mode === 'assessor') out['hub:assessor'] = JSON.stringify(boot.assessor || {});
    var roster = { trainees: {} };
    /* The tutor's own filings, kept the way the trainee's are above. Returning
       feedback files the TP into this browser's copy of the history; if that
       write never reached the store -- a beacon that could not carry the
       document, a put the store turned down until the ledger gave up -- the
       boot used to replace the roster with the store's shorter one and the
       document was gone from everywhere (Emily Carter's TP2 on the demo
       course, 26 Sep 2026: store feedback null, history {1}). The store still
       wins for every teaching practice it knows, unless this browser returned
       that same one again later (a reopened and re-returned TP carries a newer
       returnedAt); a filing only this browser holds is kept, and sent, so the
       store catches up rather than the browser forgetting. Tutor only: an
       assessor writes nothing. */
    var mine = mode === 'tutor' ? (parse(current('connect_roster_v1')) || {}).trainees || {} : {};
    (boot.roster || []).forEach(function(t){
      var r = t.records || {};
      var history = r.tpHistory || {};
      var local = ((mine[t.token] || {}).tp || {}).history || {}, kept = false;
      Object.keys(local).forEach(function(n){
        if (!local[n] || !local[n].docHTML) return;
        if (history[n] && !((local[n].returnedAt || 0) > (history[n].returnedAt || 0))) return;
        if (!kept) { history = JSON.parse(JSON.stringify(history)); kept = true; }
        history[n] = local[n];
      });
      if (kept) schedule('r:' + t.token + ':tpHistory', { op: 'put', token: t.token, kind: 'tpHistory', data: history });
      /* v53: the address rides with the row for a tutor; the store already
         leaves it off an assessor's roster, so nothing to strip here. */
      /* THE FOURTH PLACE. Found 6 Oct 2026, after a trainee's signature was
         confirmed sent, confirmed kept by the store, confirmed returned in
         t.records.agreement -- and the assessor's pack still read "0 signed".
         This function names, by hand, every kind the store is allowed to carry
         onto the flattened object this page actually reads; a kind the store
         returns under t.records but that is not named here is dropped right
         here, before localStorage ever sees it. The store side (TRAINEE_WRITES,
         TRAINEE_READS in Code.gs) was the first two places and both were right
         days ago; nobody had reason to open this file as well, because every
         kind added before today -- celta5, celta5t, staffLinks -- had been
         added here in the same sitting as its store change. agreement was not. */
      roster.trainees[t.token] = { id: t.token, name: t.name, group: t.group, email: t.email || '', importedAt: t.created, tp: { plan: r.plan || null, selfeval: r.selfeval || null, feedback: r.feedback || null, history: history }, assignments: r.assignments || {}, tracker: r.tracker || {}, observations: r.observations || {}, links: r.links || [], staffLinks: r.staffLinks || [], celta5: r.celta5 || {}, celta5t: r.celta5t || {}, agreement: r.agreement || {}, interview: r.interview || {} };
    });
    out['connect_roster_v1'] = JSON.stringify(roster);
    return out;
  }
  function current(key){ try { return localStorage.getItem(key); } catch (e) { return null; } }
  // A page rewrites the roster in its own shape (extra fields, its own key
  // order), so the roster is compared record by record, not as a string.
  function rosterEqual(a, b){
    var ra = parse(a), rb = parse(b); if (!ra || !rb) return a === b;
    var ta = ra.trainees || {}, tb = rb.trainees || {};
    var ka = Object.keys(ta).sort(), kb = Object.keys(tb).sort();
    if (ka.join('|') !== kb.join('|')) return false;
    return ka.every(function(token){
      var x = ta[token], y = tb[token];
      if ((x.name || '') !== (y.name || '') || (x.group || '') !== (y.group || '')) return false;
      var rx = recordOf(x), ry = recordOf(y);
      return Object.keys(ry).every(function(kind){ return JSON.stringify(rx[kind]) === JSON.stringify(ry[kind]); });
    });
  }
  function same(key, incoming){ var now = current(key); if (key === 'connect_roster_v1') return rosterEqual(now, incoming); return now === incoming; }
  function apply(p, only){
    var changed = [];
    Object.keys(p).forEach(function(key){
      if (only && !only(key)) return;
      if (same(key, p[key])) return;
      changed.push(key);
      if (p[key] == null) origRemove(key); else origSet(key, p[key]);
    });
    return changed;
  }
  function rebuildSnapshot(){
    snapshot = {};
    var roster = parse(current('connect_roster_v1')); if (!roster || !roster.trainees) return;
    Object.keys(roster.trainees).forEach(function(token){
      var rec = recordOf(roster.trainees[token]); snapshot[token] = {};
      Object.keys(rec).forEach(function(kind){ snapshot[token][kind] = JSON.stringify(rec[kind]); });
    });
  }
  function afterBoot(){
    var was = DEMO; DEMO = demoNow(); window.HUB_DEMO = DEMO;
    if (DEMO) { try { sessionStorage.setItem('hub:demoVisit', '1'); } catch (e) {} }
    if (DEMO && !was) { var l0 = parse((function(){ try { return localStorage.getItem(LEDGER); } catch (e) { return null; } })()); if (l0) { try { origRemove(LEDGER); } catch (e) {} } }
  }
  function exposeMeta(){
    if (mode === 'trainee') window.HubMe = parse(current('hub:me')) || {};
    if (mode === 'assessor') window.HubAssessor = parse(current('hub:assessor')) || {};
    if (mode === 'volunteer') window.HubVolunteer = parse(current('hub:volunteer')) || {};
  }
  /* A refusal is the store's answer, not a bad minute: it is not retried.
     (With PINs, v87, a retry re-asked for the PIN after the person had given
     up, and the sheet came back over the refusal.) */
  function bootWithRetries(){
    function again(err){ if (err && err.refused) throw err; return S.boot(); }
    return S.boot().catch(again).catch(function(err){ if (err && err.refused) throw err; return new Promise(function(res){ setTimeout(res, 1500); }).then(function(){ return S.boot(); }); });
  }
  function start(){ started = true; if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', runApp); else runApp(); }

  if (cached) {
    // Instant: the page runs from this browser's copy; the course is checked behind it.
    exposeMeta(); rebuildSnapshot(); start();
    status('Checking the course\u2026', 'busy');
    bootWithRetries().then(function(boot){
      var p = plan(boot);
      if (p['connect_roster_v1'] != null) p['connect_roster_v1'] = mergeRoster(p['connect_roster_v1']);
      var untouched = Object.keys(p).every(function(k){ return !dirty[k]; });
      if (untouched) {
        var changed = apply(p);
        if (changed.length) { status('The course has moved on \u2014 refreshing', 'busy'); flushBeacon(); setTimeout(function(){ location.reload(); }, 150); return; }
      } else {
        // The roster goes in merged: this page's own records are already laid over it.
        apply(p, function(k){ return !dirty[k] || k === 'connect_roster_v1'; });
        rebuildSnapshot();
      }
      try { localStorage.setItem('hub:booted', identity); } catch (e) {}
      afterBoot();
      status(DEMO ? 'Demo \u00b7 kept on this device' : mode === 'assessor' ? 'Assessor view \u2014 read-only' : mode === 'volunteer' ? 'Your page' : 'Live \u2014 saved to the course as you go', DEMO ? 'demo' : 'ok');
    }, function(err){
      // The store answering "no" is not the network failing. An expired
      // assessor link, a rotated tutor key, a trainee removed from the course:
      // the page says the link stops working, so it has to stop working, and
      // going on showing the cached course would make that line a lie (found
      // walking the assessor role, 21 Sep 2026). Nothing is deleted -- a
      // trainee may hold drafts the store never got -- the screen simply
      // refuses to render the course.
      /* A PIN refusal with no sheet to ask (the invitation card) is not a dead
         link: the card says the link also has a PIN and stays drawn (v87). */
      if (err && err.refused) { if (err.pin) { pinRefused(err); return; } gate(err.message); return; }
      status('Could not reach the course \u2014 ' + (err && err.message || err) + ' (showing this browser\u2019s copy)', 'error');
    });
    return;
  }

  // First time on this link in this browser: nothing to show yet, so wait.
  status('Loading from the course\u2026', 'busy');
  /* CHECKING YOUR LINK (10 Oct 2026). Until the store answers, the page's own
     empty frame was on screen -- a made-up trainee link showed "Your CELTA
     paperwork" for several seconds before it was refused, as if it had
     worked. The frame is covered until the answer: lifted for a link that
     opens, replaced by the refusal for one that does not (gate rewrites the
     body), lifted too if the course cannot be reached, so the page and its
     red pill show. */
  var cover = null;
  try {
    cover = document.createElement('div');
    cover.id = 'hubChecking'; cover.setAttribute('role', 'status'); cover.setAttribute('aria-live', 'polite');
    cover.style.cssText = 'position:fixed;inset:0;z-index:2147482000;background:#F3F3F7;display:flex;align-items:center;justify-content:center;transition:opacity .25s;font-family:Karla,Helvetica,sans-serif;color:oklch(42% 0.02 68);';
    /* the mark turns while the link is checked (21 Oct 2026) */
    cover.innerHTML = '<style>@keyframes hubChkSpin{from{transform:rotateY(0deg)}to{transform:rotateY(360deg)}}#hubChecking svg{animation:hubChkSpin 1.4s cubic-bezier(.45,.05,.55,.95) infinite;transform-origin:50% 50%}@media (prefers-reduced-motion:reduce){#hubChecking svg{animation-duration:3s}}</style>'
      + '<div style="display:flex;flex-direction:column;align-items:center;gap:16px;">'
      + '<span style="width:52px;height:52px;border-radius:12px;background:#f8f6f1;box-shadow:inset 0 0 0 1px oklch(85% 0.02 80),0 10px 30px -14px rgba(35,34,32,.25);display:inline-flex;align-items:center;justify-content:center;perspective:300px;">'
      + '<svg viewBox="8 28 104 64" width="34" height="21" fill="none" aria-hidden="true"><path d="M56.1 42.2 A 24 24 0 1 0 56.1 77.8" stroke="#a8803f" stroke-width="13" stroke-linecap="round"></path><path d="M96.1 42.2 A 24 24 0 1 0 96.1 77.8" stroke="#2b2218" stroke-width="13" stroke-linecap="round"></path></svg></span>'
      + '<span style="font-size:0.95rem;">Checking your link\u2026</span></div>';
    (document.body || document.documentElement).appendChild(cover);
  } catch (e) { cover = null; }
  var uncover = function(){ if (!cover) return; var c = cover; cover = null; c.style.opacity = '0'; setTimeout(function(){ if (c.parentNode) c.parentNode.removeChild(c); }, 260); };
  bootWithRetries().then(function(boot){
    var p = plan(boot);
    if (p['connect_roster_v1'] != null) p['connect_roster_v1'] = mergeRoster(p['connect_roster_v1']);
    apply(p, function(k){ return !dirty[k] || k === 'connect_roster_v1'; }); exposeMeta(); rebuildSnapshot();
    try { localStorage.setItem('hub:booted', identity); } catch (e) {}
    afterBoot();
    status(DEMO ? 'Demo \u00b7 kept on this device' : mode === 'assessor' ? 'Assessor view \u2014 read-only' : mode === 'volunteer' ? 'Your page' : 'Live \u2014 saved to the course as you go', DEMO ? 'demo' : 'ok');
  }, function(err){
    if (err && err.refused) { if (err.pin) { return pinRefused(err); } gate(err.message); return 'gated'; }
    status('Could not reach the course \u2014 ' + (err && err.message || err), 'error');
  })
    .then(function(gated){ if (gated !== 'gated') { uncover(); start(); } });
})();
