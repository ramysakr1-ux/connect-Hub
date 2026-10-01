/**
 * Connect Lite — how long the film runs, scene by scene.
 *
 *   node film/length.mjs
 *
 * The take is thirteen minutes of wall clock and the cut is what a viewer
 * sees, so "how long is the film?" used to mean shooting it. This models the
 * scene list instead: it reads film/scenes.js, applies the same durations the
 * engine's step table returns, and prints a scene a line.
 *
 * Two things to know about the number.
 *
 *   1. A scene's `settle` and a goto's load wait are NOT in the film. The cut
 *      pauses the recorder whenever the curtain's cue is on screen, so the
 *      curtain time is dropped. This prints the modelled total both ways.
 *   2. A caption does not stop the film: it hands back one beat
 *      (CAPTION_STEP) and fades on its own timer under whatever happens next.
 *      So a caption costs 1.2 s here however long its words are.
 *
 * Keep the table below in step with STEP in film/index.html.
 */
import { readFileSync } from 'node:fs';

const HERE = new URL('.', import.meta.url).pathname;
const SCENES = new Function(readFileSync(HERE + 'scenes.js', 'utf8') + '\nreturn SCENES;')();

const CAPTION_STEP = 1200;
const dur = (s) => {
  switch (s.do) {
    case 'caption': return CAPTION_STEP;
    case 'zoom':    return (s.ms || (s.out ? 1100 : 900)) + 150;
    case 'move':    return s.ms || 700;
    case 'click':   return (s.ms || 900) + 400;
    case 'type':    return (s.ms || String(s.text || '').length * 34) + 400;
    case 'scroll':  return (s.ms || 900) + 200;
    case 'hold':    return s.ms || 2000;
    case 'goto':    return s.ms || 2200;
    case 'chapter': return (s.ms || 3400) + 700;
    case 'draw':    return s.ms || 3000;
    case 'choose':  return s.ms || 1400;
    case 'offline': return s.ms || (s.off ? 600 : 2400);
    case 'who':     return (s.ms || 2200) + 500;
    case 'still':   return (s.ms || 3000) + 200;
    default:        return 200;
  }
};
const mmss = (ms) => Math.floor(ms / 60000) + ':' + String(Math.round((ms % 60000) / 1000)).padStart(2, '0');

let film = 0, curtain = 0, caps = 0, chapters = 0;
const spend = {};
SCENES.forEach((sc, i) => {
  const steps = sc.steps || [];
  const t = steps.reduce((a, s) => { spend[s.do] = (spend[s.do] || 0) + dur(s); return a + dur(s); }, 0) + 700;
  film += t;
  curtain += (sc.settle || 900);
  const c = steps.filter(s => s.do === 'caption').length;
  caps += c;
  const ch = steps.find(s => s.do === 'chapter');
  if (ch) chapters++;
  console.log(String(i + 1).padStart(2) + '  ' + mmss(t).padStart(5) + '  ' +
    String(steps.length).padStart(3) + ' steps  ' + String(c).padStart(2) + ' cap  ' +
    (ch ? ('CH ' + ch.num).padEnd(10) : ''.padEnd(10)) + '  ' + (sc.title || '?'));
});
console.log('\nthe cut, as a viewer sees it:  ' + mmss(film));
console.log('the take, curtains included:  ' + mmss(film + curtain) + '   (' + Math.round(curtain / 1000) + 's of curtain, which the cut drops)');
console.log(SCENES.length + ' scenes, ' + chapters + ' chapter cards, ' + caps + ' captions');
console.log('\nwhere the time goes:');
Object.entries(spend).sort((a, b) => b[1] - a[1])
  .forEach(([k, v]) => console.log('  ' + k.padEnd(9) + String(Math.round(v / 1000)).padStart(4) + 's'));
