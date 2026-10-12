import type {ReactNode} from 'react';
import {BrandGlyph} from './brand-glyph';
export function PackagingSeal(){return <span className="brava-seal" aria-hidden="true"><BrandGlyph/>MESA<br/>BRAVA<span>Buen antojo</span></span>;}
export function Ticket({children,className='',title,masthead}:{children:ReactNode;className?:string;title:string;masthead?:ReactNode}){return <section className={`brava-ticket ${className}`} aria-label={title}><div className="ticket-masthead">{masthead||<><div><p className="ticket-brand">Mesa Brava</p><p className="ticket-caption">{title}</p></div><PackagingSeal/></>}</div>{children}</section>;}
