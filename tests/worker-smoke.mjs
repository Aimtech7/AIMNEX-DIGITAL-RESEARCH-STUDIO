import {Miniflare,FormData,createFetchMock} from 'miniflare';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
import {createHash} from 'node:crypto';
const allFiles=await fs.readdir('dist/server',{recursive:true});
const paths=['index.js',...allFiles.filter(p=>p.endsWith('.js')&&p!=='index.js')];
const modules=await Promise.all(paths.map(async p=>({type:'ESModule',path:path.resolve('dist/server',p),contents:await fs.readFile(path.join('dist/server',p),'utf8')})));
const fetchMock=createFetchMock();fetchMock.disableNetConnect();
for(const type of ['A','AAAA'])fetchMock.get('https://cloudflare-dns.com').intercept({path:'/dns-query?name=example.com&type='+type}).reply(200,{Status:0,Answer:type==='A'?[{type:1,data:'93.184.215.14'}]:[]});
fetchMock.get('https://example.com').intercept({path:'/',method:'HEAD'}).reply(200,'',{headers:{'strict-transport-security':'max-age=31536000','x-content-type-options':'nosniff'}});
for(const type of ['A','AAAA'])fetchMock.get('https://cloudflare-dns.com').intercept({path:'/dns-query?name=restricted.example.com&type='+type}).reply(200,{Status:0,Answer:type==='A'?[{type:1,data:'127.0.0.1'}]:[]});
let headCount=0;for(const type of ['A','AAAA'])fetchMock.get('https://cloudflare-dns.com').intercept({path:'/dns-query?name=monitor.example.com&type='+type}).reply(200,{Status:0,Answer:type==='A'?[{type:1,data:'93.184.215.14'}]:[]}).persist();
fetchMock.get('https://monitor.example.com').intercept({path:'/',method:'HEAD'}).reply(200,'',{headers:{'x-content-type-options':'nosniff'}});
fetchMock.get('https://monitor.example.com').intercept({path:'/',method:'HEAD'}).reply(503,'').persist();
let aiEvidenceId='',modelCalls=0;
fetchMock.get('https://api.openai.com').intercept({path:'/v1/responses',method:'POST'}).reply(200,()=>({output:[{content:[{type:'output_text',text:JSON.stringify({answer:'Draft based on saved evidence',citations:modelCalls++===0?[aiEvidenceId]:['invented']})}]}],usage:{total_tokens:100}})).persist();
const mf=new Miniflare({bindings:{OPENAI_API_KEY:'test-only-no-real-credential',AI_DAILY_LIMIT:'2',AI_TOKEN_LIMIT:'100000'},fetchMock,modules,modulesRoot:path.resolve('dist/server'),compatibilityDate:'2026-05-15',compatibilityFlags:['nodejs_compat'],d1Databases:['DB'],r2Buckets:['BUCKET']});
try {
 const db=await mf.getD1Database('DB');for(const file of (await fs.readdir('drizzle')).filter(f=>f.endsWith('.sql')).sort()){const sql=await fs.readFile('drizzle/'+file,'utf8');for(const statement of sql.split('--> statement-breakpoint'))if(statement.trim())await db.prepare(statement.trim()).run();}
 async function req(path,data,user='qa-user',extra={}){const headers={'oai-authenticated-user-id':user,'oai-authenticated-user-email':'qa@example.invalid',...extra};if(!user){delete headers['oai-authenticated-user-id'];delete headers['oai-authenticated-user-email'];}if(data&&!(data instanceof FormData))headers['Content-Type']='application/json';return mf.dispatchFetch('https://studio.example/api/'+path,{method:data?'POST':'GET',headers,body:data?(data instanceof FormData?data:JSON.stringify(data)):undefined});}
 async function create(b){const r=await req('workspace',b);const d=await r.json();assert.equal(r.status,200,JSON.stringify(d));return d.record;}
 assert.equal((await req('workspace',null,'')).status,401);
 assert.equal((await req('workspace',{kind:'case',title:'Denied'},'qa-user',{Origin:'https://other.example'})).status,400);
 const c=await create({kind:'case',title:'QA workflow verification',client:'Synthetic test client',purpose:'Isolated acceptance test.',domain:'',authorized:false});
 const e=await create({kind:'evidence',parent:c.id,title:'Synthetic observation',type:'Note',source:'https://example.com/',content:'Synthetic evidence; no real security allegation.'});
 aiEvidenceId=e.id;
 assert.equal((await req('workspace',{kind:'finding',parent:c.id,title:'Forbidden'},'qa-other')).status,400);
 const f=await create({kind:'finding',parent:c.id,title:'Synthetic finding',severity:'Low',detail:'Test linkage.',recommendation:'Verify workflow.',evidenceIds:[e.id]});
 assert.equal((await req('workspace',{action:'updateFinding',id:f.id,status:'Confirmed'})).status,200);
 assert.equal((await req('workspace',{action:'updateCase',id:c.id,status:'In progress'})).status,200);
 assert.equal((await req('checks',{caseId:c.id})).status,400);
 const content='AIMNEX synthetic evidence fixture.\n';const form=new FormData();form.set('parent',c.id);form.set('file',new File([content],'qa-evidence.txt',{type:'text/plain'}));let r=await req('evidence',form);let d=await r.json();assert.equal(r.status,200,JSON.stringify(d));const u=d.record;assert.equal(u.hash,createHash('sha256').update(content).digest('hex'));
 r=await req('evidence?id='+u.id);assert.equal(r.status,200);assert.equal(await r.text(),content);assert.equal((await req('evidence?id='+u.id,null,'qa-other')).status,400);
 const report=await create({kind:'report',parent:c.id,title:'QA report',summary:'Synthetic snapshot verification.'});const s=JSON.parse(report.snapshot);assert.equal(s.evidence.length,2);assert.equal(s.findings.length,1);assert.equal(s.findings[0].status,'Confirmed');
 d=await(await req('workspace')).json();assert(d.records.some(x=>x.id===c.id));assert.deepEqual((await(await req('workspace',null,'qa-other')).json()).records,[]);
 const web=await create({kind:'case',title:'Synthetic web check',domain:'example.com',authorized:true});
 let checkResponse=await req('checks',{caseId:web.id});let checkData=await checkResponse.json();assert.equal(checkResponse.status,200,JSON.stringify(checkData));assert(checkData.record.content.includes('max-age=31536000'));assert.equal((await req('checks',{caseId:web.id})).status,400);
 const restricted=await create({kind:'case',title:'Private-address rejection',domain:'restricted.example.com',authorized:true});checkResponse=await req('checks',{caseId:restricted.id});assert.equal(checkResponse.status,400);assert((await checkResponse.json()).error.includes('restricted address'));

 async function op(b,user='qa-user',headers={}){const r=await req('operations',b,user,headers);const d=await r.json();assert.equal(r.status,200,JSON.stringify(d));return d;}
 const task=(await op({action:'task',parent:c.id,title:'Fix verification',findingId:f.id,assignee:'QA',due:'2026-12-01'})).record;
 assert.equal((await req('operations',{action:'taskStatus',id:task.id,status:'Done'})).status,400);
 await op({action:'taskStatus',id:task.id,status:'Done',resolutionEvidence:u.id});
 assert.equal((await req('operations',{action:'relationship',parent:c.id,from:'A',to:'B',basis:'Observed'})).status,400);
 await op({action:'relationship',parent:c.id,from:'A',to:'B',basis:'Observed',evidenceIds:[e.id]});
 const scan=JSON.stringify({"template-id":"test","matched-at":"https://example.com/","info":{"name":"Example scan finding","severity":"medium"}});
 const scan1=await op({action:'importScan',parent:c.id,tool:'Nuclei',text:scan,evidenceId:u.id});assert.equal(scan1.imported,1);
 const scan2=await op({action:'importScan',parent:c.id,tool:'Nuclei',text:scan,evidenceId:u.id});assert.equal(scan2.duplicates,1);
 assert((await op({action:'verifyEvidence',id:u.id})).match);
 await op({action:'extractedText',parent:c.id,evidenceId:u.id,text:'Reviewed extracted text.'});
 const draft={id:'11111111-1111-4111-8111-111111111111',parent:c.id,title:'Offline draft',content:'Saved offline.',source:''};
 assert.equal((await op({action:'syncDrafts',drafts:[draft]})).saved,1);assert.equal((await op({action:'syncDrafts',drafts:[draft]})).saved,0);
 const phone=await op({action:'phone',number:'0712345678'});assert.equal(phone.country,'KE');assert.equal(phone.number,'+254712345678');
 const lesson=await op({action:'learning',lesson:'evidence-basics',answers:[1,0]});assert.equal(lesson.score,2);
 assert.equal((await req('team',{action:'invite',email:'client@example.invalid',role:'client',caseIds:[c.id]})).status,200);
 await op({action:'publish',id:report.id,published:true});
 const clientHeaders={'oai-authenticated-user-email':'client@example.invalid','x-workspace-id':'qa-user'};
 assert.equal((await req('workspace',null,'qa-client',clientHeaders)).status,403);
 let portal=await req('portal',null,'qa-client',clientHeaders);assert.equal(portal.status,200);let pd=await portal.json();assert.equal(pd.reports.length,1);let ps=JSON.parse(pd.reports[0].snapshot);assert.equal(ps.evidence.length,0);assert(!('detail'in ps.findings[0]));
 assert.equal((await req('team',{action:'invite',email:'other@example.invalid',role:'analyst'},'qa-client',clientHeaders)).status,403);
 assert.equal((await req('workspace',null,'qa-stranger',{'x-workspace-id':'qa-user'})).status,403);
 const ai=await req('assistant',{parent:c.id,question:'Explain the saved observation',evidenceIds:[e.id],consent:true});assert.equal(ai.status,200,await ai.clone().text());const aid=await ai.json();assert.equal(aid.record.citations[0],e.id);
 assert.equal((await req('assistant',{parent:c.id,question:'invalid citation example',evidenceIds:[e.id],consent:true})).status,400);
 assert.equal((await req('assistant',{parent:c.id,question:'Limit reached',evidenceIds:[e.id],consent:true})).status,400);
 assert.equal((await req('assistant',{parent:c.id,question:'No consent',evidenceIds:[e.id],consent:false})).status,400);
 const mc=await create({kind:'case',title:'Monitor test',domain:'monitor.example.com',authorized:true});const monitor=(await op({action:'monitor',parent:mc.id,intervalHours:24})).record;
 await op({action:'runMonitor',id:monitor.id});await op({action:'runMonitor',id:monitor.id});
 let all=(await(await req('workspace')).json()).records;assert(all.some(x=>x.kind==='alert'&&x.parent===mc.id));
 assert.equal((await req('monitoring',{})).status,401);
 const issued=await op({action:'schedulerToken'});assert(issued.token.length>40);const hashed=await db.prepare('SELECT hash FROM studio_scheduler_secrets WHERE workspace = ?').bind('qa-user').first();assert.notEqual(hashed.hash,issued.token);
 const sched=await mf.dispatchFetch('https://studio.example/api/monitoring',{method:'POST',headers:{Authorization:'Bearer '+issued.token}});assert.equal(sched.status,200);
 assert.equal((await req('team',{action:'revoke',id:'qa-user:client@example.invalid'})).status,200);assert.equal((await req('portal',null,'qa-client',clientHeaders)).status,403);
 console.log('PASS: remediation proof gate, observed relationship proof gate, import deduplication, integrity verification, extraction lineage, offline idempotency, phone metadata, learning scores, client redaction, role denial/revocation, AI consent/citations/quota, monitoring change alerts and scheduler token hashing.');
 console.log('PASS: DNS/HTTPS result collection, cooldown, private-address rejection, auth, origin guard, case/note/finding creation, status updates, permission gate, SHA-256 upload, exact original download, owner isolation, report snapshot, persisted read.');
} finally {await mf.dispose();}
