'use client';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
export default function ErrorPage({reset}:{reset:()=>void}){return <main id="contenido" className="mx-auto min-h-[60vh] max-w-3xl px-6 py-16"><h1>No se pudo cargar el contenido</h1><p className="mt-5">Vuelve a intentarlo para consultar el menú y los pedidos de prueba.</p><div className="mt-6 flex gap-4"><Button onClick={reset} className="h-12">Volver a intentar</Button><Link href="/" className="flex min-h-11 items-center text-primary underline">Volver al inicio</Link></div></main>;}
