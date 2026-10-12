'use client';
import {useRouter} from 'next/navigation';
import {ArrowUpRight} from 'lucide-react';
import {useDraft} from './draft';
import type {MenuItem} from '@/lib/types';
export function AssemblyAction({item}:{item:MenuItem}){const draft=useDraft();const router=useRouter();return <button className="assembly-link" disabled={!item.available} onClick={()=>{if(!draft.lines.some(l=>l.id===item.id))draft.add(item.id,1);router.push('/pedir');}}>Armar con tacos<ArrowUpRight size={22}/></button>;}
