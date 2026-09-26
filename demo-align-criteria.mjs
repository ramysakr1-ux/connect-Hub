/* Two readings that disagreed between the grades report and the feedback:
   "nominate the quieter learners" was 5b on one and 1d+5b on the other, and
   "keep the feedback stages short" was 5h against 5h+5i. A criterion is not a
   matter of which screen you are on. The feedback's reading is the fuller one
   and wins; only the grades report changes. */
import {readFileSync} from 'node:fs';
const H='/Users/work/connect-Hub/';
const STORE=(readFileSync(H+'hub-store.js','utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/)||[])[0];
const K=process.argv[2], WRITE=process.argv.includes('--write');
const call=async b=>{for(let i=0;i<6;i++){const r=await fetch(STORE,{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify(b)});const t=await r.text();try{return JSON.parse(t);}catch(e){await new Promise(s=>setTimeout(s,3500));}}return{ok:false,error:'no JSON'};};
/* A point may carry more than one criterion; the grades report stores one code
   per line, so the second reading becomes its own line, which is how a tutor
   would write it anyway. */
const EXTRA = [
  [/Nominate the quieter learners/i, 'teachA', '1d', 'Nominate the quieter learners by name after the pair check — they take part once they have an answer ready'],
  [/feedback stages short|teacher talk in feedback/i, 'teachA', '5i', 'Keep the pace through the feedback stage — two answers, then move on'],
];
const ro=await call({op:'roster', key:K});
let n=0;
for(const who of Object.values(ro.result.trainees||{}).sort((a,b)=>a.name.localeCompare(b.name))){
  const rec=(who.records||{}).tracker||{}; const g=Object.assign({},rec.grades||{});
  let touched=false;
  for(const [re, field, code, text] of EXTRA){
    const list=(g[field]||[]).slice();
    if(!list.some(p=>re.test(p.text||''))) continue;
    if(list.some(p=>p.code===code && re.test(p.text||''))) continue;
    if(list.some(p=>p.code===code)) continue;
    list.push({text, code}); g[field]=list; touched=true;
  }
  if(!touched){ console.log(who.name.padEnd(20)+'already aligned'); continue; }
  console.log(who.name.padEnd(20)+'+ '+EXTRA.map(e=>e[2]).join(' + '));
  n++;
  if(WRITE){ const o=await call({op:'put',key:K,token:who.token,kind:'tracker',data:Object.assign({},rec,{grades:g})});
    if(!o.ok) console.log('   FAILED: '+o.error); }
}
console.log('\n'+n+(WRITE?' candidates aligned':' would change (dry run)'));
