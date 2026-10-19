import fs from 'node:fs';
const HUB='/Users/work/connect-Hub/';
const STORE=(fs.readFileSync(HUB+'hub-store.js','utf8').match(/https:\/\/script\.google\.com\/macros\/s\/[^'"]+/)||[])[0];
const OWNER=fs.readFileSync(HUB+'.owner-key','utf8').trim();
const WRITE=process.argv.includes('--write');
const post=async b=>{for(let i=0;i<8;i++){try{const r=await (await fetch(STORE,{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify(b)})).json(); if(r.ok)return r; console.log('store said',r.error);}catch(e){} await new Promise(r=>setTimeout(r,12000));} throw new Error('no answer');};
const list=(await post({op:'ownerCourses',owner:OWNER})).result;
const c=(list.courses||list).find(x=>x.name==='Demo — week four, before the visit');
const boot=(await post({op:'boot',key:c.tutorKey})).result;
const targets={'Aiko Tanaka':['lfc'],'Mateo Fernández':['lsrt'],'Priya Raghunathan':['lsrt','lfc']};
for (const [name,keys] of Object.entries(targets)) {
  const t=boot.roster.find(x=>x.name===name); const recs=JSON.parse(JSON.stringify(t.records.assignments));
  if (WRITE) fs.writeFileSync(HUB+'_store-snapshots/demo4-'+name.split(' ')[0]+'-assignments-before-clear-'+new Date().toISOString().replace(/[:.]/g,'-')+'.json', JSON.stringify(recs));   /* only on a write, and a new file each time: a read-only look must never replace the copy */
  for (const k of keys) { const a=recs[k];
    console.log(name,k,'| marks',JSON.stringify(a.criteriaMarks),'| notes',JSON.stringify(a.criteriaComments).slice(0,120),'| general',JSON.stringify(a.feedback&&a.feedback.generalComment1||'').slice(0,60),'| margin items',Object.values(a.margin||{}).flat().length);
    if (WRITE) { if (a.criteriaMarks) for (const r of Object.keys(a.criteriaMarks)) a.criteriaMarks[r] = []; delete a.markers; if (a.margin) for (const r of Object.keys(a.margin)) a.margin[r]=a.margin[r].filter(x=>x.by!=='Ramy Sakr'); }
  }
  if (WRITE) { await post({op:'put', key:c.tutorKey, token:t.token, kind:'assignments', data:recs}); await new Promise(r=>setTimeout(r,2500)); }
}
if (WRITE) { const b2=(await post({op:'boot',key:c.tutorKey})).result; for (const [name,keys] of Object.entries(targets)) { const t=b2.roster.find(x=>x.name===name); for (const k of keys) { const a=t.records.assignments[k]; console.log('read back',name,k,'| stage',a.stage,'| markers',JSON.stringify(a.markers||null),'| Ramy margin',Object.values(a.margin||{}).flat().filter(x=>x.by==='Ramy Sakr').length); } } }
