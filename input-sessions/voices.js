/* Lite's four house voices (Ramy, 22 Oct 2026: "male, female, American,
   British, not a lot, just maybe four"). Every session that speaks uses the
   same four, recorded once with OpenAI's voices by tools/make-session-audio.mjs
   and kept beside the page as audio/<voice>/<line>.mp3. A play costs nothing,
   and the offline shell keeps a recording once it has been heard.

   A page joins in by having an audio/ folder with its lines and either
   calling LiteVoice.say(text) or marking an element data-say="text" (with
   data-speaker="b" for the second person in a dialogue). The choice of voice
   sits at the top of the page, four buttons, remembered on the device. */
window.LiteVoice = window.LiteVoice || (function(){
  var VOICES = [
    { id: 'uk-woman', label: 'British woman' },
    { id: 'uk-man', label: 'British man' },
    { id: 'us-woman', label: 'American woman' },
    { id: 'us-man', label: 'American man' }
  ];
  var KEY = 'lite-voice-v2';
  var chosen = 'uk-woman';
  try { var v = localStorage.getItem(KEY); if (v && VOICES.some(function(x){ return x.id === v; })) chosen = v; } catch (e) {}
  var cfg = { britishChart: false };
  var player = new Audio();

  function slug(text){ return String(text).toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80); }
  /* The second person in a dialogue is the other voice of the same accent. */
  function partner(id){ return { 'uk-woman': 'uk-man', 'uk-man': 'uk-woman', 'us-woman': 'us-man', 'us-man': 'us-woman' }[id]; }

  function fallback(text){
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text); u.lang = /^us/.test(chosen) ? 'en-US' : 'en-GB'; u.rate = 0.9;
    speechSynthesis.speak(u);
  }
  /* The same words with the stress in another place are another recording. */
  function fileFor(text, stress){ return slug(text) + (stress ? '--' + slug(stress) : ''); }
  var queue = [];
  function play(item){
    var voice = item.speaker === 'b' ? partner(chosen) : chosen;
    player.src = 'audio/' + voice + '/' + fileFor(item.text, item.stress) + '.mp3';
    var p = player.play(); if (p && p.catch) p.catch(function(){ queue = []; fallback(item.text); });
  }
  player.addEventListener('ended', function(){ if (queue.length) setTimeout(function(){ if (queue.length) play(queue.shift()); }, 450); });
  function say(text, speaker, stress){ sayAll([{ text: text, speaker: speaker, stress: stress }]); }
  /* A dialogue: each line in turn, the second speaker in the other voice. */
  function sayAll(items){
    player.pause(); queue = items.slice(1);
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    if (items[0]) play(items[0]);
  }

  function paint(){
    var bar = document.getElementById('liteVoices'); if (!bar) return;
    bar.querySelectorAll('button[data-voice]').forEach(function(b){
      var on = b.getAttribute('data-voice') === chosen;
      b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    var note = bar.querySelector('.lv-note');
    if (note) note.hidden = !(cfg.britishChart && /^us/.test(chosen));
  }
  function mount(){
    if (document.getElementById('liteVoices')) return;
    var at = document.querySelector('[data-voices-here]') || document.querySelector('main section, section');
    if (!at) return;
    var bar = document.createElement('div');
    bar.id = 'liteVoices'; bar.className = 'lite-voices';
    bar.innerHTML = '<span class="lv-label">Voice</span>'
      + VOICES.map(function(x){ return '<button type="button" data-voice="' + x.id + '">' + x.label + '</button>'; }).join('')
      + '<span class="lv-note" hidden>The chart’s symbols are British, so some vowels will not match an American voice.</span>';
    if (at.hasAttribute && at.hasAttribute('data-voices-here')) at.appendChild(bar); else at.parentNode.insertBefore(bar, at);
    bar.addEventListener('click', function(e){
      var b = e.target.closest('button[data-voice]'); if (!b) return;
      chosen = b.getAttribute('data-voice');
      try { localStorage.setItem(KEY, chosen); } catch (err) {}
      paint();
    });
    paint();
  }
  /* Anything marked data-say speaks when pressed; data-say-seq is a dialogue. */
  document.addEventListener('click', function(e){
    var el = e.target.closest && e.target.closest('[data-say], [data-say-seq]'); if (!el) return;
    if (el.tagName !== 'BUTTON' && e.target.closest('input, select, textarea, a')) return;
    if (el.hasAttribute('data-say-seq')) { try { sayAll(JSON.parse(el.getAttribute('data-say-seq'))); } catch (err) {} return; }
    say(el.getAttribute('data-say'), el.getAttribute('data-speaker') || 'a', el.getAttribute('data-stress') || '');
  });
  /* A button that says something, for the sessions' own hooks. */
  function button(label, items){
    var b = document.createElement('button'); b.type = 'button'; b.className = 'say-btn'; b.textContent = label || 'Hear it';
    b.setAttribute('data-say-seq', JSON.stringify(items)); return b;
  }
  var css = document.createElement('style');
  css.textContent = '.lite-voices{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:0 0 18px;}'
    + '.lite-voices .lv-label{font:700 .72rem Karla,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--grey,#5b5f6b);margin-right:4px;}'
    + '.lite-voices button{font:600 .86rem Karla,sans-serif;padding:8px 14px;min-height:40px;border-radius:999px;border:1.5px solid var(--a-forest,#1E3B2F);background:#fff;color:var(--a-forest,#1E3B2F);cursor:pointer;}'
    + '.lite-voices button.on{background:var(--a-forest,#1E3B2F);color:#fff;}'
    + '.lite-voices .lv-note{flex-basis:100%;font-size:.84rem;color:var(--a-red,#7A2E2E);}'
    + '.say-btn{font:700 .78rem Karla,sans-serif;padding:5px 12px;min-height:32px;border-radius:999px;border:0;background:var(--a-forest,#1E3B2F);color:#fff;cursor:pointer;margin-left:8px;vertical-align:middle;}'
    + '@media print{.lite-voices,.say-btn{display:none !important;}}';
  document.head.appendChild(css);
  /* The sessions that speak. Their hooks live beside them in audio/hooks.js,
     so the voice bar only appears where there is something to hear. */
  var VOICED = ['phonology-sounds', 'word-and-sentence-stress', 'connected-speech'];
  var here = (location.pathname.match(/input-sessions\/([^/]+)\//) || [])[1];
  function start(){
    if (VOICED.indexOf(here) === -1) return;
    mount();
    if (here !== 'phonology-sounds') { var sc = document.createElement('script'); sc.src = 'audio/hooks.js?v=' + (window.LITE_V || '1'); document.body.appendChild(sc); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  return { say: say, sayAll: sayAll, button: button, fileFor: fileFor, slug: slug, set: function(o){ for (var k in o) cfg[k] = o[k]; paint(); }, voices: VOICES };
})();
