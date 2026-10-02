/**
 * Connect Lite — flatten a fragmented MP4 into a plain, fast-start MP4.
 *
 *   node film/flatten.mjs in-fragmented.mp4 out.mp4
 *
 * Chrome's MediaRecorder writes fragmented MP4 (moof + mdat pairs, empty
 * sample tables). It plays, but Chrome reads its length from the track
 * headers and Safari adds the headers to the fragments, so no header patch
 * satisfies both; and macOS's avconvert gave up a third of the way through
 * the film every time (2 Oct 2026). This reads every fragment's sample
 * list and writes the same samples with ordinary stbl tables, moov first.
 * No decoding, no re-encoding: the H.264 and AAC bytes are copied as they are.
 */
import { readFileSync, writeFileSync } from 'node:fs';
const [,, IN, OUT] = process.argv;
if (!IN || !OUT) { console.log('node film/flatten.mjs in-fragmented.mp4 out.mp4'); process.exit(1); }
const buf = readFileSync(IN);
const u32 = (o) => buf.readUInt32BE(o), i32 = (o) => buf.readInt32BE(o);
function boxes(start, end) { const out = []; let o = start; while (o + 8 <= end) { let size = u32(o); const type = buf.toString('latin1', o + 4, o + 8); let hdr = 8; if (size === 1) { size = Number(buf.readBigUInt64BE(o + 8)); hdr = 16; } if (size === 0) size = end - o; out.push({ type, start: o, size, body: o + hdr, end: o + size }); o += size; } return out; }
const kids = (b) => boxes(b.body, b.end);
const find = (list, t) => list.find(b => b.type === t);

const top = boxes(0, buf.length);
const ftyp = find(top, 'ftyp'), moov = find(top, 'moov');
if (!ftyp || !moov) throw new Error('not an MP4 with ftyp + moov');
const moovKids = kids(moov);
const mvhd = find(moovKids, 'mvhd');
const mvTimescale = buf[mvhd.body] === 1 ? u32(mvhd.body + 20) : u32(mvhd.body + 12);

/* tracks and their fragment defaults */
const tracks = new Map();
for (const trak of moovKids.filter(b => b.type === 'trak')) {
  const tk = kids(trak); const tkhd = find(tk, 'tkhd');
  const id = buf[tkhd.body] === 1 ? u32(tkhd.body + 20) : u32(tkhd.body + 12);
  const mdia = find(tk, 'mdia'); const md = kids(mdia); const mdhd = find(md, 'mdhd'); const hdlr = find(md, 'hdlr');
  const timescale = buf[mdhd.body] === 1 ? u32(mdhd.body + 20) : u32(mdhd.body + 12);
  const handler = buf.toString('latin1', hdlr.body + 8, hdlr.body + 12);
  tracks.set(id, { id, trak, timescale, handler, samples: [], trex: null });
}
const mvex = find(moovKids, 'mvex');
if (mvex) for (const trex of kids(mvex).filter(b => b.type === 'trex')) { const t = trex.body + 4; const id = u32(t); const tr = tracks.get(id); if (tr) tr.trex = { sdi: u32(t + 4), dur: u32(t + 8), size: u32(t + 12), flags: u32(t + 16) }; }

/* every fragment: traf -> tfhd defaults, trun sample lists, data offsets */
let order = []; // samples in file order, for interleaving
for (const moof of top.filter(b => b.type === 'moof')) {
  for (const traf of kids(moof).filter(b => b.type === 'traf')) {
    const tb = kids(traf); const tfhd = find(tb, 'tfhd');
    const f = u32(tfhd.body) & 0xffffff; let o = tfhd.body + 4; const id = u32(o); o += 4;
    const tr = tracks.get(id); if (!tr) throw new Error('fragment for unknown track ' + id);
    let base = moof.start;
    if (f & 0x1) { base = Number(buf.readBigUInt64BE(o)); o += 8; }
    else if (!(f & 0x20000)) throw new Error('traf without default-base-is-moof or base-data-offset: not handled');
    if (f & 0x2) o += 4;
    const d = { dur: tr.trex ? tr.trex.dur : 0, size: tr.trex ? tr.trex.size : 0, flags: tr.trex ? tr.trex.flags : 0 };
    if (f & 0x8) { d.dur = u32(o); o += 4; }
    if (f & 0x10) { d.size = u32(o); o += 4; }
    if (f & 0x20) { d.flags = u32(o); o += 4; }
    let next = null; // where the next trun's data starts when it names no offset
    for (const trun of tb.filter(b => b.type === 'trun')) {
      const ver = buf[trun.body], tf = u32(trun.body) & 0xffffff; let p = trun.body + 4;
      const n = u32(p); p += 4;
      let pos = next == null ? base : next;
      if (tf & 0x1) { pos = base + i32(p); p += 4; }
      let first = null; if (tf & 0x4) { first = u32(p); p += 4; }
      for (let i = 0; i < n; i++) {
        let dur = d.dur, size = d.size, flags = d.flags, cto = 0;
        if (tf & 0x100) { dur = u32(p); p += 4; }
        if (tf & 0x200) { size = u32(p); p += 4; }
        if (tf & 0x400) { flags = u32(p); p += 4; }
        if (tf & 0x800) { cto = ver === 0 ? u32(p) : i32(p); p += 4; }
        if (i === 0 && first != null) flags = first;
        const s = { tr, dur, size, cto, sync: !(flags & 0x10000), off: pos };
        tr.samples.push(s); order.push(s); pos += size;
      }
      next = pos;
    }
  }
}
for (const tr of tracks.values()) if (!tr.samples.length) throw new Error('track ' + tr.id + ' has no samples');

/* box builders */
const box = (type, ...parts) => { const body = Buffer.concat(parts); const h = Buffer.alloc(8); h.writeUInt32BE(8 + body.length, 0); h.write(type, 4, 'latin1'); return Buffer.concat([h, body]); };
const full = (type, version, flags, ...parts) => { const vf = Buffer.alloc(4); vf.writeUInt32BE(((version & 0xff) << 24) | (flags & 0xffffff), 0); return box(type, vf, ...parts); };
const u32s = (arr) => { const b = Buffer.alloc(arr.length * 4); arr.forEach((v, i) => b.writeUInt32BE(v >>> 0, i * 4)); return b; };
const i32s = (arr) => { const b = Buffer.alloc(arr.length * 4); arr.forEach((v, i) => b.writeInt32BE(v, i * 4)); return b; };
const runs = (vals) => { const out = []; for (const v of vals) { if (out.length && out[out.length - 1][1] === v) out[out.length - 1][0]++; else out.push([1, v]); } return out; };

function stbl(tr, oldStbl, offsets) {
  const sd = find(kids(oldStbl), 'stsd'); const stsd = buf.subarray(sd.start, sd.end);
  const S = tr.samples;
  const stts = full('stts', 0, 0, u32s([ ...[runs(S.map(s => s.dur)).length], ...runs(S.map(s => s.dur)).flat() ]));
  const ctoRuns = runs(S.map(s => s.cto)); const needCtts = S.some(s => s.cto !== 0);
  const ctts = needCtts ? full('ctts', S.some(s => s.cto < 0) ? 1 : 0, 0, u32s([ctoRuns.length]), S.some(s => s.cto < 0) ? i32s(ctoRuns.flat()) : u32s(ctoRuns.flat())) : null;
  const syncIdx = S.map((s, i) => s.sync ? i + 1 : 0).filter(Boolean);
  const stss = (tr.handler === 'vide' && syncIdx.length !== S.length) ? full('stss', 0, 0, u32s([syncIdx.length, ...syncIdx])) : null;
  const stsz = full('stsz', 0, 0, u32s([0, S.length, ...S.map(s => s.size)]));
  const stsc = full('stsc', 0, 0, u32s([1, 1, 1, 1]));
  const big = offsets[offsets.length - 1] > 0xfffffff0;
  const stco = big ? full('co64', 0, 0, u32s([offsets.length]), Buffer.concat(offsets.map(o => { const b = Buffer.alloc(8); b.writeBigUInt64BE(BigInt(o)); return b; })))
                   : full('stco', 0, 0, u32s([offsets.length, ...offsets]));
  return box('stbl', ...[stsd, stts, ctts, stss, stsz, stsc, stco].filter(Boolean));
}
function patchedFull(b, durField32, durField64, dur) { const out = Buffer.from(buf.subarray(b.start, b.end)); const ver = out[8]; if (ver === 1) out.writeBigUInt64BE(BigInt(dur), 8 + durField64); else out.writeUInt32BE(dur, 8 + durField32); return out; }
const movieDur = Math.max(...[...tracks.values()].map(tr => Math.round(tr.samples.reduce((a, s) => a + s.dur, 0) / tr.timescale * mvTimescale)));
function rebuild(b, tr, offsets) {
  if (b.type === 'stbl') return stbl(tr, b, offsets);
  if (b.type === 'tkhd') return patchedFull(b, 20, 28, movieDur);
  if (b.type === 'mdhd') return patchedFull(b, 16, 24, tr.samples.reduce((a, s) => a + s.dur, 0));
  if (b.type === 'mdia' || b.type === 'minf' || b.type === 'trak') return box(b.type, ...kids(b).map(k => rebuild(k, tr, offsets)));
  return buf.subarray(b.start, b.end);
}
function buildMoov(offsetsByTrack) {
  const parts = [];
  for (const k of moovKids) {
    if (k.type === 'mvhd') parts.push(patchedFull(k, 16, 24, movieDur));
    else if (k.type === 'trak') { const tr = [...tracks.values()].find(t => t.trak.start === k.start); parts.push(rebuild(k, tr, offsetsByTrack.get(tr.id))); }
    else if (k.type === 'mvex') continue;
    else parts.push(buf.subarray(k.start, k.end));
  }
  return box('moov', ...parts);
}
/* two passes: the sample offsets depend on moov's size, which does not depend on their values */
const totalData = order.reduce((a, s) => a + s.size, 0);
const ftypBuf = buf.subarray(ftyp.start, ftyp.end);
function offsetsFrom(dataStart) { const by = new Map([...tracks.keys()].map(id => [id, []])); let pos = dataStart; for (const s of order) { by.get(s.tr.id).push(pos); pos += s.size; } return by; }
const guess = buildMoov(offsetsFrom(ftypBuf.length + 1 + 8)); // size only
const dataStart = ftypBuf.length + guess.length + 8;
const moovBuf = buildMoov(offsetsFrom(dataStart));
if (moovBuf.length !== guess.length) throw new Error('moov size changed between passes');
const mdatHdr = Buffer.alloc(8); mdatHdr.writeUInt32BE(8 + totalData, 0); mdatHdr.write('mdat', 4, 'latin1');
const out = Buffer.concat([ftypBuf, moovBuf, mdatHdr, ...order.map(s => buf.subarray(s.off, s.off + s.size))]);
writeFileSync(OUT, out);
const desc = [...tracks.values()].map(tr => tr.handler + ' ' + tr.samples.length + ' samples, ' + (tr.samples.reduce((a, s) => a + s.dur, 0) / tr.timescale).toFixed(1) + ' s').join('; ');
console.log('flat MP4: ' + (out.length / 1048576).toFixed(1) + ' MB, movie ' + (movieDur / mvTimescale).toFixed(1) + ' s; ' + desc);
