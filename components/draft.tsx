'use client';
import {createContext,useContext,useState,useEffect, type ReactNode} from 'react';
type Line={id:string;quantity:number};
type Draft={lines:Line[];add:(id:string,q:number)=>void;set:(id:string,q:number,label?:string)=>void;clear:()=>void;announcement:string;revision:number};
const Context=createContext<Draft|null>(null);
export function DraftProvider({children}:{children:ReactNode}){
 const [lines,setLines]=useState<Line[]>([]);const [hydrated,setHydrated]=useState(false);
 useEffect(()=>{const timer=setTimeout(()=>{try{const stored=JSON.parse(sessionStorage.getItem('mesa-brava-draft')||'[]');if(Array.isArray(stored))setLines(stored.filter((l:Line)=>typeof l?.id==='string'&&Number.isInteger(l.quantity)&&l.quantity>=1&&l.quantity<=20));}catch{}setHydrated(true);},0);return()=>clearTimeout(timer);},[]);
 useEffect(()=>{if(hydrated)try{sessionStorage.setItem('mesa-brava-draft',JSON.stringify(lines));}catch{}},[lines,hydrated]);const [announcement,setAnnouncement]=useState('');const [revision,setRevision]=useState(0);
 function set(id:string,quantity:number,label=id){setRevision(n=>n+1);setAnnouncement(quantity<=0?`${label}: retirado del pedido.`:`${label}: ${Math.min(20,quantity)} unidades en tu pedido.`);setLines(old=>quantity<=0?old.filter(l=>l.id!==id):old.some(l=>l.id===id)?old.map(l=>l.id===id?{id,quantity:Math.min(20,quantity)}:l):[...old,{id,quantity:Math.min(20,quantity)}]);}
 function add(id:string,q:number){setLines(old=>{const found=old.find(l=>l.id===id);return found?old.map(l=>l.id===id?{id,quantity:Math.min(20,l.quantity+q)}:l):[...old,{id,quantity:q}];});setRevision(n=>n+1);setAnnouncement('Plato añadido al borrador. Máximo 20 unidades por plato.');}
 return <Context.Provider value={{lines,add,set,clear:()=>setLines([]),announcement,revision}}>{children}<span className="sr-only" aria-live="polite">{announcement}</span></Context.Provider>;
}
export function useDraft(){const context=useContext(Context);if(!context)throw new Error('Draft provider missing');return context;}
