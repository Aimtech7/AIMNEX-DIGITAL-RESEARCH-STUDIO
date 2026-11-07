import {env} from 'cloudflare:workers';
import {access,analyst} from './access';
import type {RecordItem} from '@/features/studio/types';
export async function owner(requestedWorkspace?:string){const a=await access(requestedWorkspace);analyst(a);return a.workspace;}
export function database(){if(!env.DB)throw new Error('Database is unavailable. Please retry shortly.');return env.DB;}
export function fail(e:unknown){return Response.json({error:e instanceof Error?e.message:'Request failed'},{status:e instanceof Error&&e.message.startsWith('Sign in')?401:e instanceof Error&&/access|Only the workspace/.test(e.message)?403:400,headers:{'Cache-Control':'no-store'}});}
export function mutationGuard(req:Request){const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)throw new Error('Cross-origin writes are not permitted.');}
export async function list(uid:string){const rows=await database().prepare('SELECT data FROM studio_records WHERE owner = ? ORDER BY created DESC').bind(uid).all<{data:string}>();return rows.results.map(r=>JSON.parse(r.data) as RecordItem);}
export async function owned(id:string,uid:string){const row=await database().prepare('SELECT data FROM studio_records WHERE id = ? AND owner = ?').bind(id,uid).first<{data:string}>();if(!row)throw new Error('Record not found in this workspace.');return JSON.parse(row.data) as RecordItem;}
export function insert(uid:string,r:RecordItem){return database().prepare('INSERT INTO studio_records (id, owner, kind, parent, data, created) VALUES (?, ?, ?, ?, ?, ?)').bind(r.id,uid,r.kind,'parent' in r?r.parent??null:null,JSON.stringify(r),r.created);}
export function event(parent:string,title:string,detail:string){return {id:crypto.randomUUID(),kind:'activity' as const,parent,title,detail,created:new Date().toISOString()};}
export function str(v:unknown,max=1000){if(typeof v!=='string'||v.length>max)throw new Error('Invalid or oversized text field.');return v.trim();}
export function domainName(v:unknown){const d=str(v,253).toLowerCase();if(!d)return '';if(!/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(d)||/\.(local|internal|localhost|test|invalid|onion)$/.test(d))throw new Error('Enter a public domain such as example.com, without a URL or path.');return d;}

export function updateRecord(uid:string,r:RecordItem){return database().prepare('UPDATE studio_records SET data = ? WHERE id = ? AND owner = ?').bind(JSON.stringify(r),r.id,uid);}
export async function claim(key:string,seconds=90){const now=new Date().toISOString();const until=new Date(Date.now()+seconds*1000).toISOString();const r=await database().prepare('INSERT INTO studio_locks (id,expires) VALUES (?,?) ON CONFLICT(id) DO UPDATE SET expires=excluded.expires WHERE studio_locks.expires < ?').bind(key,until,now).run();if(!r.meta.changes)throw new Error('A matching operation is already running. Retry shortly.');}
export async function release(key:string){await database().prepare('DELETE FROM studio_locks WHERE id = ?').bind(key).run();}
export async function jsonBody(req:Request,max=300000){const reader=req.body?.getReader();if(!reader)throw new Error('Request body required.');let size=0;const parts:Uint8Array[]=[];while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>max){await reader.cancel();throw new Error('Request too large.');}parts.push(value);}const bytes=new Uint8Array(size);let at=0;for(const p of parts){bytes.set(p,at);at+=p.length;}return JSON.parse(new TextDecoder().decode(bytes));}
