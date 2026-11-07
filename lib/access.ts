import {headers} from 'next/headers';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {env} from 'cloudflare:workers';
export type Access={workspace:string;userId:string;email:string;role:'owner'|'analyst'|'client';caseIds:string[]};
export async function access(requestedWorkspace?:string):Promise<Access>{const u=await getChatGPTUser();if(!u)throw new Error('Sign in to use your private workspace.');const h=await headers();const workspace=requestedWorkspace||h.get('x-workspace-id')||u.userId;if(workspace===u.userId)return {workspace,userId:u.userId,email:u.email.toLowerCase(),role:'owner',caseIds:[]};const m=await env.DB!.prepare('SELECT role, cases FROM studio_members WHERE workspace = ? AND email = ?').bind(workspace,u.email.toLowerCase()).first<{role:'analyst'|'client';cases:string}>();if(!m)throw new Error('Workspace access denied.');return {workspace,userId:u.userId,email:u.email.toLowerCase(),role:m.role,caseIds:JSON.parse(m.cases)};}
export function analyst(a:Access){if(a.role==='client')throw new Error('Analyst access is required.');}
export function administrator(a:Access){if(a.role!=='owner')throw new Error('Only the workspace owner can manage access and settings.');}
