/* Connect Lite — three questions for the tutors, on the trainee's home.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * Ramy, 28 Oct 2026: the groups should be "a mix of male, female, nationalities ... a mix of experience as well", and
 * Lite must not guess any of it from a name. So the trainee is asked, once, on their home: first language, nationality,
 * teaching experience and (optionally) gender. The answers are their record `about` (chub:about), which Course admin's
 * Mix the groups reads. Shown until answered; nothing here for a tutor, an assessor or a volunteer.
 */
(function(){
  'use strict';
  var S = window.HubStore;
  if (!S || !S.isTrainee || !S.isTrainee()) return;
  var KEY = 'chub:about';
  function rd(){ try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function esc(t){ return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function css(){
    if (document.getElementById('hub-about-css')) return;
    var st = document.createElement('style'); st.id = 'hub-about-css';
    st.textContent = '.aboutme{margin:0 0 18px;padding:18px 20px 20px;background:var(--paper);border-radius:var(--r-card,16px);box-shadow:var(--nb-shadow);border-top:3px solid var(--teal);}'
      + '.aboutme h2{margin:0 0 4px;font:700 1.15rem/1.2 Newsreader,Georgia,serif;} .aboutme .sub{margin:0 0 14px;color:var(--grey);font-size:.9rem;line-height:1.45;}'
      + '.aboutme .f{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px 16px;}'
      + '.aboutme label.l{display:block;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;font-weight:700;color:var(--grey);margin:0 0 5px;}'
      + '.aboutme input[type=text],.aboutme select{box-sizing:border-box;width:100%;padding:10px 12px;border:1px solid var(--sand-line);border-radius:10px;background:var(--field);font:inherit;font-size:.95rem;color:var(--ink);}'
      + '.aboutme .opts{display:flex;flex-wrap:wrap;gap:8px;} .aboutme .opts label{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border:1px solid var(--sand-line);border-radius:999px;cursor:pointer;font-size:.88rem;background:var(--field);}'
      + '.aboutme .opts input{margin:0;} .aboutme .go{margin-top:16px;border:0;border-radius:999px;padding:11px 22px;background:var(--a-forest,var(--teal));color:var(--paper);font:700 .95rem/1 Karla,sans-serif;cursor:pointer;}'
      + '.aboutme .msg{margin:10px 0 0;font-size:.88rem;color:var(--grey);} .aboutme .msg.err{color:var(--a-red);}';
    document.head.appendChild(st);
  }
  function mount(){
    var a = rd(); if ((a && a.at) || document.getElementById('aboutMe')) return;
    var anchor = document.getElementById('onlineRooms'); if (!anchor) return;
    css();
    var box = document.createElement('section'); box.className = 'aboutme'; box.id = 'aboutMe';
    var G = [['woman', 'Woman'], ['man', 'Man'], ['other', 'Another way'], ['unsaid', 'Prefer not to say']];
    box.innerHTML = '<h2>Three questions for your tutors</h2>'
      + '<p class="sub">Your tutors use these to make mixed teaching practice groups. Only the tutors see them.</p>'
      + '<div class="f">'
      + '<div><label class="l" for="abLang">Your first language</label><input type="text" id="abLang" maxlength="60" placeholder="For example, Turkish"></div>'
      + '<div><label class="l" for="abNat">Your nationality</label><input type="text" id="abNat" maxlength="60" placeholder="For example, Brazilian"></div>'
      + '<div><label class="l" for="abExp">Your teaching experience</label><select id="abExp"><option value="">Choose one</option><option value="none">None yet</option><option value="some">Some, under a year</option><option value="year">A year or more</option></select></div>'
      + '</div>'
      + '<div style="margin-top:14px"><label class="l">Your gender <span style="text-transform:none;letter-spacing:0;font-weight:500">(optional)</span></label><div class="opts">'
      + G.map(function(g){ return '<label><input type="radio" name="abGender" value="' + g[0] + '">' + esc(g[1]) + '</label>'; }).join('') + '</div></div>'
      + '<button type="button" class="go">Save my answers</button><p class="msg" role="status"></p>';
    anchor.parentNode.insertBefore(box, anchor.nextSibling);
    box.querySelector('.go').addEventListener('click', function(){
      var lang = box.querySelector('#abLang').value.trim(), nat = box.querySelector('#abNat').value.trim(), exp = box.querySelector('#abExp').value;
      var g = box.querySelector('input[name=abGender]:checked'), msg = box.querySelector('.msg');
      if (!lang || !nat || !exp) { msg.className = 'msg err'; msg.textContent = 'Answer the first three, please. Gender is up to you.'; return; }
      try { localStorage.setItem(KEY, JSON.stringify({ firstLanguage: lang, nationality: nat, experience: exp, gender: g ? g.value : 'unsaid', by: 'trainee', at: new Date().toISOString() })); } catch (e) {}
      box.innerHTML = '<h2>Thank you</h2><p class="sub" style="margin:0">Your tutors have your answers.</p>';
      setTimeout(function(){ box.remove(); }, 3500);
    });
  }
  /* after the store has handed back what is already answered, so nobody is asked twice */
  document.addEventListener('hub:ready', mount);
  setTimeout(mount, 6000);
})();
