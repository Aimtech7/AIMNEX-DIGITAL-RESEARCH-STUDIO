'use client';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {Field,FieldGroup,FieldLabel} from '@/components/ui/field';
import type {ReactNode} from 'react';
export function Modal({title,description,children,onClose}:{title:string;description?:string;children:ReactNode;onClose:()=>void}){return <Dialog open onOpenChange={v=>{if(!v)onClose();}}><DialogContent className="studio-modal"><DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>{description||'Changes are saved to your private workspace.'}</DialogDescription></DialogHeader>{children}</DialogContent></Dialog>;}
export function FormFields({children}:{children:ReactNode}){return <FieldGroup>{children}</FieldGroup>;}
export function FormField({label,children}:{label:string;children:ReactNode}){return <Field><FieldLabel>{label}</FieldLabel>{children}</Field>;}
export function Pill({value}:{value:string}){return <span className={'pill '+value.toLowerCase().replaceAll(' ','-')}>{value}</span>;}
export function Empty({title,detail,children}:{title:string;detail:string;children?:ReactNode}){return <div className="empty"><h3>{title}</h3><p>{detail}</p>{children}</div>;}
export const fmt=(n:number)=>String(n).padStart(2,'0');
