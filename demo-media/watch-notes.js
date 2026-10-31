/* THE TUTOR'S OWN WATCH FOR NOTES (31 Oct 2026; Ramy: "the trainer can provide some extra instructions for the
   trainees ... things they can pay attention to"). Every demonstration lesson carries a Watch for note above each
   step, shown on a trainee's link only. This script lets a tutor reword them for their own course:

   - a trainee sees their course's wording where the tutor wrote one, the page's own everywhere else;
   - a tutor's link gets "Edit the trainee notes" in the nav (the notes are hidden from the class, whose screen
     the tutor's is); it opens every note as a box to edit, with Save and Cancel. A note left as the page wrote
     it is not stored, and an emptied box goes back to the page's own.

   The notes live in the course's settings (settings.watchNotes[page][step], store op putWatchNotes). A demo
   saves nothing, like every other write on a demo. Each note's step is the id of the section it sits in. */
(function(){
  var S = window.HubStore;
  if (!S) return;
  var m = location.pathname.match(/demo-media\/([\w-]+\/[\w-]+)\/?/);
  if (!m) return;
  var PAGE = m[1];
  function settings(){ try { return JSON.parse(localStorage.getItem('connect_course_settings') || '{}') || {}; } catch (e) { return {}; } }
  function mine(){ var w = settings().watchNotes; return (w && w[PAGE]) || {}; }
  function esc(t){ return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  var notes = Array.prototype.slice.call(document.querySelectorAll('.watch')).map(function(el){
    var sec = el.closest('section');
    var label = el.querySelector('b');
    var body = el.innerHTML.replace(/^\s*<b>[^<]*<\/b>/, '');
    return { el: el, step: sec ? sec.id : '', label: label ? label.outerHTML : '<b>Watch for</b>', html: body, text: el.textContent.replace(/^\s*Watch for/, '').replace(/\s+/g, ' ').trim() };
  }).filter(function(n){ return n.step; });
  if (!notes.length) return;

  /* the course's wording, where its tutor wrote one */
  function apply(){
    var own = mine();
    notes.forEach(function(n){ n.el.innerHTML = n.label + (own[n.step] ? esc(own[n.step]) : n.html); n.el.classList.toggle('own', !!own[n.step]); });
  }
  apply();

  if (!S.isTutor || !S.isTutor()) return;

  /* the tutor's side */
  var st = document.createElement('style');
  st.textContent = '.wn-edit textarea{display:block; width:100%; min-height:5.2em; margin-top:4px; padding:8px 10px; border:1px solid var(--sand-line); border-radius:var(--r-control); background:var(--field); font:inherit; font-size:.9rem; line-height:1.5; color:var(--ink); resize:vertical;}'
    + '.wn-edit textarea:focus{outline:none; border-color:var(--field-focus);}'
    + '.wn-bar{position:sticky; bottom:0; z-index:30; display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin:18px 0 0; padding:12px 16px; background:var(--card); border:1px solid var(--sand-line); border-top:3px solid var(--gold); border-radius:var(--r-card); box-shadow:var(--nb-shadow);}'
    + '.wn-bar p{flex:1; min-width:200px; margin:0; font-size:.88rem;} .wn-msg{font-weight:600;}'
    + '@media print{ .wn-bar, .wn-toggle{display:none !important;} }';
  document.head.appendChild(st);

  var nav = document.getElementById('stickyNav'), printBtn = nav && nav.querySelector('.print-btn');
  if (!nav) return;
  var toggle = document.createElement('button');
  toggle.type = 'button'; toggle.className = 'print-btn wn-toggle'; toggle.textContent = 'Edit the trainee notes';
  toggle.style.marginLeft = '14px';
  if (printBtn) printBtn.parentNode.insertBefore(toggle, printBtn); else nav.appendChild(toggle);

  var editing = false, bar = null;
  function open(){
    editing = true; toggle.hidden = true;
    var own = mine();
    notes.forEach(function(n){
      n.el.hidden = false; n.el.classList.add('wn-edit');
      n.el.innerHTML = n.label + '<textarea maxlength="700" aria-label="The trainee note for this step"></textarea>';
      n.el.querySelector('textarea').value = own[n.step] || n.text;
    });
    bar = document.createElement('div'); bar.className = 'wn-bar';
    bar.innerHTML = '<p>These notes are for your trainees on this course; the class never sees them. Leave a note as it is to keep the page’s own, or empty it to go back to it. <span class="wn-msg" role="status"></span></p>'
      + '<button type="button" class="btn t wn-save">Save</button><button type="button" class="btn wn-cancel">Cancel</button>';
    (document.querySelector('.sources') || document.querySelector('.hub-brand-foot')).insertAdjacentElement('beforebegin', bar);
    bar.querySelector('.wn-cancel').addEventListener('click', close);
    bar.querySelector('.wn-save').addEventListener('click', save);
    notes[0].el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function close(){
    editing = false; toggle.hidden = false;
    notes.forEach(function(n){ n.el.classList.remove('wn-edit'); n.el.hidden = true; });
    apply();
    if (bar) { bar.remove(); bar = null; }
  }
  function save(){
    var btn = bar.querySelector('.wn-save'), msg = bar.querySelector('.wn-msg'), out = {};
    notes.forEach(function(n){
      var v = n.el.querySelector('textarea').value.replace(/\s+/g, ' ').trim();
      out[n.step] = (v && v !== n.text) ? v : '';
    });
    btn.disabled = true; btn.textContent = 'Saving…'; msg.textContent = '';
    S.call({ op: 'putWatchNotes', page: PAGE, notes: out }).then(function(r){
      if (r && r.demo) { msg.textContent = 'This is a demo course, so nothing was saved. On your own course your trainees would see these now.'; btn.disabled = false; btn.textContent = 'Save'; return; }
      var c = settings(); c.watchNotes = c.watchNotes || {}; c.watchNotes[PAGE] = (r && r.notes) || {};
      try { localStorage.setItem('connect_course_settings', JSON.stringify(c)); } catch (e) {}
      msg.textContent = 'Saved. Your trainees see these now.';
      setTimeout(close, 1400);
    }, function(e){ btn.disabled = false; btn.textContent = 'Save'; msg.textContent = 'Not saved: ' + ((e && e.message) || e); });
  }
  toggle.addEventListener('click', function(){ if (!editing) open(); });
})();
