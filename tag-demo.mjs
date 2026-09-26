/**
 * Tag the demo course's feedback points with the criteria they show.
 *
 * The mint wrote every point untagged, so every pill on the tutor's screen
 * still read "+ criteria" and no returned document carried the legend that
 * lists the criteria referred to. This walks every feedback record on the
 * course -- the one on screen and every TP already filed in the history --
 * and tags each point with what the screen's own suggester picks for it,
 * then rebuilds that record's document from the tagged state.
 *
 * The rebuild is the same call the Return button makes, on the same state, so
 * a record rebuilt WITHOUT tagging comes back byte-identical to the stored
 * one. That is asserted for every record before anything is written: a record
 * whose untagged rebuild does not match is left exactly as it was and named
 * at the end.
 *
 *   node tag-demo.mjs            what it would do, writing nothing
 *   node tag-demo.mjs --write    do it
 */
import {chromium} from 'playwright';
import {readFileSync} from 'node:fs';
import {MAP} from './criteria-map.mjs';
const WRITE=process.argv.includes('--write');
const HERE='/Users/work/connect-Hub/';
const STORE=(readFileSync(HERE+'hub-store.js','utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/)||[])[0];
const K=process.env.KEY||'6940749234e54144bba44ce5';
const B='https://ramysakr1-ux.github.io/connect-Hub/';
const call=async b=>{ for(let i=0;i<6;i++){ const r=await fetch(STORE,{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify(b)});
  const t=await r.text(); try{ return JSON.parse(t);}catch(e){ await new Promise(s=>setTimeout(s,4000)); } } return {ok:false,error:'no JSON'}; };

const ro=await call({op:'roster', key:K});
const people=Object.values(ro.result.trainees||{}).sort((a,b)=>a.name.localeCompare(b.name));
console.log(people.length+' candidates on the course'+(WRITE?'':'   (dry run -- nothing will be written)'));

const br=await chromium.launch();
const ctx=await br.newContext({viewport:{width:1280,height:900}});
await ctx.addInitScript(k=>{ localStorage.setItem('hub:k',k); }, K);
const page=await ctx.newPage();

/* Runs in the page. Applies one record's state, tags every untagged point
   with what the screen would suggest for it, and hands back the new state and
   document -- plus the untagged rebuild, so the caller can check fidelity. */
const work = (st, MAP) => {
  const fnApply=eval('draftApply'), fnCollect=eval('collect'), fnBuild=eval('buildHTML'), fnDraft=eval('draftState');
  const fnTag=eval('tagHTML');
  fnApply(st);
  const before=fnBuild(fnCollect());
  const tagged=[], unmapped=[];
  ['lSP','lAP','lST','lAT'].forEach(id=>{
    const host=document.getElementById(id), scope=host.dataset.scope;
    [...host.children].forEach(row=>{
      const box=row.querySelector('.pt-text');
      const text=(box.textContent||'').trim();
      if(!text) return;
      if(box.querySelector('.tag')) return;          /* already tagged by hand */
      const codes=MAP[text];
      if(!codes){ unmapped.push(text); return; }
      box.innerHTML = box.innerHTML.replace(/(\s|&nbsp;)+$/,'') + ' ' + codes.map(fnTag).join('');
      tagged.push(codes.join('+')+'  '+text.slice(0,64));
    });
  });
  return { before, after: fnBuild(fnCollect()), state: fnDraft(), tagged, unmapped };
};

const norm=s=>String(s||'').replace(/\s+/g,' ').trim();
let records=0, points=0, skipped=[], untagged=[];

for(const who of people){
  await page.goto(B+'3_tutor_feedback.html?trainee='+who.token);
  await page.waitForFunction(()=>{const s=document.querySelector('#hubSync'); return s&&/Live/.test(s.textContent);},{timeout:60000}).catch(()=>{});
  await page.waitForTimeout(3500);
  const rec=(who.records||{});
  const jobs=[];
  if(rec.feedback && rec.feedback.state) jobs.push(['feedback', null, rec.feedback]);
  Object.entries(rec.tpHistory||{}).forEach(([n,e])=>{ if(e && e.state) jobs.push(['tpHistory', n, e]); });
  if(!jobs.length){ console.log('\n'+who.name+': nothing written yet'); continue; }
  console.log('\n'+who.name);
  for(const [kind,n,entry] of jobs){
    const label=kind==='feedback' ? (entry.status==='returned'?'on screen (returned)':'on screen ('+(entry.status||'draft')+')') : 'filed TP'+n;
    const r=await page.evaluate(new Function('a','const work='+work.toString()+'; return work(a[0],a[1]);'), [entry.state, MAP]);
    if(norm(r.before)!==norm(entry.docHTML||'')){
      console.log('  '+label+': SKIPPED -- an untagged rebuild does not match what is stored');
      skipped.push(who.name+' / '+label); continue;
    }
    if(!r.tagged.length){ console.log('  '+label+': nothing to tag'); continue; }
    console.log('  '+label+': '+r.tagged.length+' points');
    r.tagged.forEach(t=>console.log('      '+t));
    records++; points+=r.tagged.length;
    (r.unmapped||[]).forEach(t=>{ if(!untagged.includes(t)) untagged.push(t); });
    if(WRITE){
      const next=Object.assign({}, entry, {state:r.state, docHTML:r.after});
      const out = kind==='feedback'
        ? await call({op:'put', key:K, token:who.token, kind:'feedback', data:next})
        : await call({op:'put', key:K, token:who.token, kind:'tpHistory', data:{[n]:next}});
      if(!out.ok){ console.log('      WRITE FAILED: '+out.error); skipped.push(who.name+' / '+label+' (write failed)'); }
    }
  }
}
await br.close();
console.log('\n'+points+' points tagged across '+records+' records'+(WRITE?'':'  -- dry run, nothing written'));
if(untagged.length){ console.log('not in the map, left untagged:'); untagged.forEach(t=>console.log('  '+t)); process.exitCode=1; }
if(skipped.length){ console.log('left alone:'); skipped.forEach(s=>console.log('  '+s)); process.exitCode=1; }
