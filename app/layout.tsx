import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'AIMNEX Digital Research Studio',description:'Private cybersecurity case management, evidence and reporting.',manifest:'/manifest.webmanifest',icons:{icon:'/favicon.svg'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
