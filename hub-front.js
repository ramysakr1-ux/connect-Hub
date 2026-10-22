/* Connect Lite — the front page, for someone arriving with no link at all.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * Ramy, 3 Oct 2026, reading his own signature: "what is lite.celtaconnect.com?"
 * A fair question, because until now the answer was a locked door. Every page
 * of Lite is opened with a link, so a centre director who got an email, grew
 * curious and clicked the address in it landed on "Open your course link" --
 * a page written for somebody who has mislaid theirs, not for somebody who has
 * never had one.
 *
 * hub-sync calls gate() when no credential is present. This defines the hook
 * it checks first, so on index.html ONLY, a visitor with no link gets a page
 * about the product instead. Anyone who arrives with a token never sees it,
 * and a link that has STOPPED working still gets the plain refusal, because
 * that carries a reason and this hook is only for the reasonless case.
 *
 * It is one screen of writing. No store, no keys, nothing fetched.
 *
 * 3 Oct 2026, later the same day: the page still did not answer the question
 * he actually asked -- a visitor learned what Lite DOES but never why the
 * address says "lite." in front. The "Why it says Lite" block is that answer,
 * and it says plainly that Connect itself is not open yet rather than
 * promising a date.
 */
(function () {
  var esc = function (s) { return String(s == null ? '' : s).replace(/[<&>"]/g, ' '); };

  /* The root is the front door, not a room. It is also the trainee's home,
     which is why a tutor who clicked lite.celtaconnect.com used to be told
     "This room belongs to the candidate" and left there (Ramy, 3 Oct 2026:
     "why is it taking me to the trainee? The trainee is not emailing me").
     Whoever arrives is sent to their own room instead; a trainee and a
     stranger both stay, and the stranger gets the page below. */
  window.hubFrontRoute = function () {
    var where = { tutor: '5_tutor_dashboard.html', assessor: '12_assessor_pack.html', volunteer: '26_volunteer.html' }[window.HubMode];
    if (!where) return false;
    location.replace(where + location.search);
    return true;
  };

  window.hubNoLink = function () {
    document.title = 'Connect Lite — your CELTA course, in one place';
    document.documentElement.style.background = 'var(--sand)';
    var mark = '<span class="fp-tile"><svg viewBox="8 28 104 64" width="20" height="12" fill="none">'
      + '<path d="M56.1 42.2 A 24 24 0 1 0 56.1 77.8" stroke="var(--gold-lifted)" stroke-width="13" stroke-linecap="round"></path>'
      + '<path d="M96.1 42.2 A 24 24 0 1 0 96.1 77.8" stroke="var(--paper)" stroke-width="13" stroke-linecap="round"></path>'
      + '</svg></span><span class="fp-word"><span class="c">Connect</span><span class="l">Lite</span></span>';

    document.body.className = 'fp-body';
    document.body.innerHTML =
      '<div class="fp-card">'
      + '<div class="fp-mark">' + mark + '</div>'
      + '<p class="fp-eyebrow">For a CELTA centre</p>'
      + '<h1>Teach the course. Lite does the rest.</h1>'
      + '<p class="fp-lede">Every trainee gets a course of their own. Every tutor gets their evenings back. Connect Lite was built by a CELTA tutor, for the four weeks every tutor knows: plans arriving at midnight, feedback typed twice, a booklet filled in from memory, and a scramble for volunteer students. Lite takes all of it on. Each trainee opens one link and finds a course of their own. Each tutor opens theirs and sees exactly what needs them next. And when the assessor arrives, the pack is already there. Each link arrives as a card with a QR code, so it opens on a phone as easily as on a laptop.</p>'

      + '<h2>What it does</h2>'
      + '<ul class="fp-does">'
      + '<li><b>A course of their own.</b> One link, and each trainee finds their timetable, their TP, their pages and their feedback.</li>'
      + '<li><b>It always knows what\u2019s next.</b> Every screen opens on what is waiting for you. No training: if you can open an email, you can run a course.</li>'
      + '<li><b>Write it once.</b> A plan carries on into the feedback, the tracker, CELTA 5 and the assessor\u2019s pack. One written assignment: 13 clicks, not 70.</li>'
      + '<li><b>Cambridge, built in.</b> The 41 criteria, the CELTA 5 stages and the grade form, in Cambridge\u2019s own words.</li>'
      + '<li><b>CELTA 5, written as you go.</b> Trainee and tutor each write their half and sign on the screen; on the last day it prints as Cambridge\u2019s booklet, already signed.</li>'
      + '<li><b>TP points, dealt fairly.</b> Every trainee teaches every type, and nobody always goes first.</li>'
      + '<li><b>A timetable that understands CELTA.</b> Built in a minute, or read from your spreadsheet; everyone sees their own day.</li>'
      + '<li><b>Volunteer students who come back.</b> A page in their own language, the trainees\u2019 handouts before the class, and a certificate they have earned.</li>'
      + '<li><b>Your centre, your way.</b> Your wording, your criteria and your TP points, with a library of interactive input sessions. Duplicate a finished course and go.</li>'
      + '</ul>'

      + '<div class="fp-film">'
      + '<div><b>See a whole course, start to finish</b><span>A whole course, start to finish, in three minutes. A real course, not a mock-up.</span></div>'
      + '<a class="fp-btn" href="film/course-journey.html">Watch the film</a>'
      + '</div>'

      /* No figure on the front either (Ramy, 7 Oct 2026): the front page and
         the card had come to name two different prices. The rates go out by
         email, from the console. */
      + '<h2>How it’s priced</h2>'
      + '<p class="fp-lede fp-small">Priced per course, not per trainee. Packages get cheaper the more you take, and a finished course can be duplicated and run again. Email <a href="mailto:lite@celtaconnect.com">lite@celtaconnect.com</a> for the rates.</p>'

      + '<div class="fp-ask">'
      + '<b>Ask for a demo</b>'
      + '<p>I will send you three real courses you can walk around — as a tutor, as one of the trainees, as the assessor and as a volunteer student — and you can type in all of them. Nothing you do there touches anybody’s record.</p>'
      + '<a class="fp-btn wide" href="mailto:lite@celtaconnect.com?subject=' + encodeURIComponent('Connect Lite — a demo link, please') + '">Email me for a demo link</a>'
      + '</div>'

      + '<div class="fp-have">'
      + '<b>Already on a course?</b>'
      + '<p>You need your own link. Your centre emailed it to you as a card, with a button and a QR code. Open Lite from that card and your course is there. Lost it? Ask your course admin to send it again.</p>'
      + '</div>'

      + '<div class="fp-foot"><span>' + (window.hubMark ? hubMark(16) + ' ' : '') + 'designed and built by <b>Ramy</b></span><a href="mailto:lite@celtaconnect.com">lite@celtaconnect.com</a></div>'
      + '</div>';

    var css = document.createElement('style');
    css.textContent = [
      '.fp-body{margin:0; background:var(--sand); color:var(--ink); font-family:Karla,system-ui,sans-serif;',
      '  display:flex; align-items:flex-start; justify-content:center; padding:6vh 18px 48px;}',
      '.fp-card{background:var(--paper); box-shadow:0 1px 2px rgba(35,34,32,.05), 0 12px 32px rgba(35,34,32,.10); border-radius:14px; max-width:600px; width:100%; padding:30px 34px 28px;}',
      '.fp-mark{display:flex; align-items:center; gap:9px; margin-bottom:26px;}',
      '.fp-tile{width:30px; height:30px; border-radius:7px; background:var(--ink-warm); display:inline-flex; align-items:center; justify-content:center; flex:none;}',
      '.fp-word{display:inline-flex; align-items:baseline; gap:4px;}',
      '.fp-word .c{font-family:"Instrument Serif",Georgia,serif; font-style:italic; font-size:21px; line-height:0.85; color:var(--gold);}',
      '.fp-word .l{font-family:"Instrument Sans",Karla,sans-serif; font-weight:500; font-size:9px; letter-spacing:0.24em; text-transform:uppercase;}',
      '.fp-eyebrow{font-family:"Instrument Sans",Karla,sans-serif; font-weight:600; font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color:var(--grey); margin:0 0 5px;}',
      '.fp-card h1{font-family:Newsreader,Georgia,serif; font-weight:700; font-size:1.75rem; line-height:1.2; margin:0 0 8px; color:var(--teal); text-wrap:balance;}',
      '.fp-card h2{font-family:Newsreader,Georgia,serif; font-weight:600; font-size:1.05rem; color:var(--ink-warm); margin:26px 0 8px;}',
      '.fp-lede{font-size:0.95rem; line-height:1.7; margin:0;}',
      '.fp-small{font-size:0.9rem;}',
      '.fp-lede a{color:var(--teal); font-weight:700; text-decoration:none; border-bottom:1.5px solid var(--amber-edge);}',
      '.fp-lede a:hover{border-bottom-color:var(--teal);}',
      '.fp-does{list-style:none; margin:0; padding:0;}',
      '.fp-does li{position:relative; padding:0 0 0 22px; margin:0 0 9px; font-size:0.9rem; line-height:1.6;}',
      '.fp-does li:before{content:""; position:absolute; left:2px; top:9px; width:7px; height:7px; border-radius:50%; background:var(--gold);}',
      '.fp-does b{color:var(--ink-warm);}',
      '.fp-film{display:flex; align-items:center; gap:16px; flex-wrap:wrap; margin:24px 0 0; padding:16px 18px; background:var(--box); border-radius:var(--r-strip);}',
      '.fp-film div{flex:1 1 240px;}',
      '.fp-film b{display:block; font-family:Newsreader,Georgia,serif; font-size:1rem; color:var(--ink-warm);}',
      '.fp-film span{display:block; font-size:0.82rem; color:var(--grey); line-height:1.55; margin-top:2px;}',
      '.fp-btn{font-family:Karla,sans-serif; font-size:0.86rem; font-weight:700; color:var(--teal); text-decoration:none;',
      '  border:1.5px solid var(--teal); border-radius:20px; padding:8px 16px; flex:none; white-space:nowrap;}',
      '.fp-btn:hover{background:rgba(30,107,99,.08);}',
      '.fp-btn.wide{display:block; text-align:center; background:var(--teal); color:var(--paper); border-color:var(--teal); padding:13px 20px; border-radius:26px; margin-top:12px; font-size:0.95rem;}',
      '.fp-btn.wide:hover{background:var(--teal-deep);}',
      '.fp-ask{margin:26px 0 0; padding:18px 20px; background:var(--gold-wash); border-radius:var(--r-strip);}',
      '.fp-ask b{font-family:Newsreader,Georgia,serif; font-size:1.05rem; color:var(--ink-warm);}',
      '.fp-ask p{font-size:0.88rem; line-height:1.6; margin:6px 0 0;}',
      '.fp-why{margin:20px 0 0; padding:2px 0 2px 16px; border-left:2px solid var(--amber-edge);}',
      '.fp-why b{display:block; font-family:Newsreader,Georgia,serif; font-size:0.98rem; color:var(--ink-warm); margin-bottom:3px;}',
      '.fp-why p{font-size:0.88rem; line-height:1.65; color:var(--grey); margin:0;}',
      '.fp-have{margin:26px 0 0; padding:18px 0 0; border-top:1px solid var(--sand-line);}',
      '.fp-have b{font-size:0.9rem; color:var(--ink-warm);}',
      '.fp-have p{font-size:0.84rem; line-height:1.6; color:var(--grey); margin:5px 0 0;}',
      '.fp-foot{display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; margin:22px 0 0; padding-top:16px; border-top:1px solid var(--sand-line);}',
      '.fp-foot span{font-size:11px; color:oklch(50% 0.09 62); opacity:.8;}',
      '.fp-foot a{font-size:0.8rem; color:var(--teal); font-weight:600; text-decoration:none;}',
      '@media(max-width:420px){ .fp-card{padding:24px 20px 22px;} .fp-card h1{font-size:1.45rem;} .fp-btn{width:100%; text-align:center;} }',
    ].join('\n');
    document.head.appendChild(css);
  };
})();
