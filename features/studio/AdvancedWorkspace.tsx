'use client';
import type {RecordItem,Case,Report} from './types';
import ToolDesk from './ToolDesk';
import Remediation from './Remediation';
import Intelligence from './Intelligence';
import Monitoring from './Monitoring';
import TeamPortal from './TeamPortal';
import LearningHub from './LearningHub';
import OfflineDesk from './OfflineDesk';
export const advancedPages=['Research tools','Remediation','Intelligence','Monitoring','Learning','Team & portal','Offline'];
export default function AdvancedWorkspace({page,records,demo,onSaved}:{page:string;records:RecordItem[];demo:boolean;onSaved:()=>void}){const cases=records.filter((r):r is Case=>r.kind==='case');const reports=records.filter((r):r is Report=>r.kind==='report');const props={cases,records,demo,onSaved};switch(page){case'Research tools':return <ToolDesk {...props}/>;case'Remediation':return <Remediation {...props}/>;case'Intelligence':return <Intelligence {...props}/>;case'Monitoring':return <Monitoring {...props}/>;case'Learning':return <LearningHub {...props}/>;case'Team & portal':return <TeamPortal {...props} reports={reports}/>;case'Offline':return <OfflineDesk {...props}/>;default:return null;}}
