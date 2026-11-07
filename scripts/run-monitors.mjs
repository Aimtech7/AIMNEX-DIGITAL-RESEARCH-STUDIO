const origin=process.env.STUDIO_URL,token=process.env.MONITOR_RUN_SECRET,platform=process.env.SITES_SERVICE_TOKEN;
if(!origin||!token){console.log('Monitoring runner not configured; no request sent.');process.exit(0);}
const url=new URL('/api/monitoring',origin);if(url.protocol!=='https:')throw new Error('Scheduler requires an HTTPS site URL.');
const r=await fetch(url,{method:'POST',headers:{Authorization:'Bearer '+token,...(platform?{'OAI-Sites-Authorization':'Bearer '+platform}:{})},redirect:'error',signal:AbortSignal.timeout(180000)});
if(!r.ok)throw new Error(`Monitoring runner returned ${r.status}. Check private-site service access and the workspace scheduler token.`);
const result=await r.json();console.log(JSON.stringify({completed:result.completed,failed:result.errors?.length||0}));if(result.errors?.length)process.exitCode=1;
