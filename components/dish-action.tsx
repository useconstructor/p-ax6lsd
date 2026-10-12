'use client';
import {useRouter} from 'next/navigation';
import {Plus} from 'lucide-react';
import {useDraft} from './draft';
import type {MenuItem} from '@/lib/types';

export function DishAction({item}:{item:MenuItem}) {
 const draft=useDraft();
 const router=useRouter();
 return <button type="button" disabled={!item.available} aria-label={`Añadir ${item.name} al pedido`} onClick={()=>{draft.add(item.id,1);router.push('/pedir');}} className="group flex w-full items-start justify-between gap-6 border-b border-border py-6 text-left first:pt-0 disabled:opacity-50"><span><span className="mb-2 block text-sm text-primary">{item.category}</span><span className="block font-heading text-[32px] leading-[1.05] group-hover:text-primary max-sm:text-2xl">{item.name}</span><span className="mt-2 block max-w-[390px] text-base leading-relaxed text-muted-foreground">{item.description}</span></span><span className="mt-7 flex size-11 shrink-0 items-center justify-center rounded-full border border-border text-primary transition-colors group-hover:bg-primary group-hover:text-white group-active:scale-95"><Plus size={20}/></span></button>;
}
