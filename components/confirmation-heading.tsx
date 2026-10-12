'use client';
import {useEffect,useRef} from 'react';
export function ConfirmationHeading(){const ref=useRef<HTMLHeadingElement>(null);useEffect(()=>ref.current?.focus(),[]);return <h1 ref={ref} tabIndex={-1} className="outline-none">Pedido de prueba guardado</h1>;}
