/**
 * Connect Lite — the day-one demos' TP points, dealt from the Pool.
 *
 * Ramy, 14 Nov 2026: "re-deal the day one demo from the Pool sets". The day-one demos were seeded with hand-made
 * cards for a book the Pool does not hold, with a made-up address where the audio should be, so a visitor who pressed
 * a recording went nowhere. They now teach from two Pool sets that arrive whole: every card has its cut pages and
 * its recordings.
 *
 * The lessons come from the store's library copy of each set at seed time (op poolSet), never from this repo: the
 * page scans and recordings stay out of the public files. What is kept here is only who teaches which of a day's
 * three lessons, by trainee name: Lite's own Deal on 14 Nov 2026, then the best arrangement for no aim twice inside
 * a TP level and an even mix of language and skills.
 */
export const POOL_FOR = { 1: 's11', 2: 's8' };   // group 1: Empower B2 · group 2: Speakout Elementary
export const POOL_TPS = 6;                        // TP 7 and 8 are the trainees' own planning: no TP points
/* the place (1 to 3) each trainee takes in their set's day, TP 1 to 6 */
export const POOL_DEAL = {
  'Aiko Tanaka': [1, 3, 2, 1, 3, 2], 'Amara Nwosu': [2, 1, 3, 2, 1, 3], 'Mateo Fernández': [3, 2, 1, 3, 2, 1],
  'Nour El-Sayed': [1, 3, 2, 3, 2, 3], 'Priya Raghunathan': [3, 1, 3, 2, 1, 2], 'Wei Zhang': [2, 2, 1, 1, 3, 1],
  'Camille Moreau': [1, 2, 3, 1, 2, 3], 'Dmitri Volkov': [2, 3, 2, 3, 1, 1], 'Elif Yıldız': [3, 1, 1, 2, 3, 2],
  'Isabella Rossi': [1, 1, 3, 2, 2, 3], 'Minseo Park': [2, 3, 1, 3, 1, 2], 'Tomás Oliveira': [3, 2, 2, 1, 3, 1],
};

/* One card from one lesson of a set: the same fields, in the same way, as the TP points page stamps them
   (24_tp_points.html, stamp). Keep the two in step. */
export function poolStamp(set, tp, setIndex, pos) {
  const id = tp + (setIndex === 0 ? 'A' : 'B');
  const ses = (set.sessions || {})[id], sl = ses && (ses.slots || [])[pos];
  if (!sl || !(sl.type || sl.aim)) return null;
  const out = {};
  if (sl.type) out.aim = sl.type;
  if (sl.aim) out.point = sl.aim;
  if (sl.sub) out.sub = sl.sub;
  if (sl.shape) out.framework = sl.shape;
  const book = {};
  if (sl.pages) book.ref = sl.pages;
  if (sl.page) book.page = sl.page;
  if (set.url) book.url = set.url;
  if (book.url || book.ref || book.page) out.book = book;
  if (sl.tracks) out.audio = { url: sl.tracks };
  if (set.audioUrl) { out.audio = Object.assign({}, out.audio || {}); out.audio.folder = set.audioUrl; }
  if (ses.dayPdf && ses.dayPdf.url) out.dayPdf = ses.dayPdf;
  if ((sl.files || []).length) out.pages = sl.files.map(f => ({ name: f.name, url: f.url, fromSet: 1 }));
  out.stages = (sl.stages || []).filter(s => s && (s.name || s.todo))
    .map(s => ({ name: s.name || '', aim: s.aim || '', minutes: s.minutes || '', interaction: s.interaction || '', todo: s.todo || '', avoid: s.avoid || '' }));
  out.scaffold = ses.scaffold || '';
  if (ses.context) out.context = ses.context;
  if (sl.watch) out.watch = sl.watch;
  if (tp <= 2 && set.sources) out.sources = set.sources;
  out.from = id + '·' + (pos + 1);
  return out;
}

/* The whole record. `people` are { token, name, group }; `sets` is { group: [[token, ...], [token, ...]] };
   `pool` is { s11: <the full set>, s8: <the full set> } as the store's poolSet gives them. */
export function poolPoints(people, sets, pool) {
  const groups = {}, released = {};
  Object.keys(sets).forEach(g => {
    const set = pool[POOL_FOR[g]]; if (!set) return;
    groups[g] = {}; released[g] = true;
    sets[g].forEach((tokens, si) => tokens.forEach((token, j) => {
      const who = people.find(p => p.token === token) || {};
      const deal = POOL_DEAL[who.name];
      const row = {};
      for (let tp = 1; tp <= POOL_TPS; tp++) {
        const pos = deal ? deal[tp - 1] - 1 : (j + tp - 1) % 3;   // a name this file does not know takes its turn round the three
        const cell = poolStamp(set, tp, si, pos);
        if (cell) row['tp' + tp] = cell;
      }
      groups[g][token] = row;
    }));
  });
  const library = {}; Object.values(POOL_FOR).forEach(id => { if (pool[id]) library[id] = pool[id]; });
  return { groups, released, sets, set: { library, setFor: Object.assign({}, POOL_FOR) } };
}
