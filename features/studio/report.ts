import type {Report} from './types';
export function downloadJson(data:unknown,name:string){const u=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
export function printReport(r:Report){const w=window.open('/report?id='+encodeURIComponent(r.id)+'&workspace='+encodeURIComponent(sessionStorage.getItem('aimnex-workspace')||''),'_blank');if(!w)throw new Error('Allow pop-ups to open the printable report.');}
