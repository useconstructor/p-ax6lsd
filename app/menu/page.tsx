import {menu} from '@/lib/data';
import {Catalog} from '@/components/catalog';
export const dynamic='force-dynamic';
export const metadata={title:'Menú de ejemplo',description:'Tacos, antojitos, acompañamientos y una bebida de ejemplo. Descubre ingredientes de muestra y prepara un pedido sin pagos.'};
export default async function Menu(){return <main id="contenido" className="menu-page mx-auto max-w-[1280px] px-6 py-10 md:px-10 lg:px-8 lg:py-16"><div className="mb-8 max-w-2xl"><p className="mb-3 text-sm text-primary">Descubre, elige y prueba</p><h1>Todo el antojo.</h1><p className="mt-5 leading-relaxed text-muted-foreground">Tacos, antojitos y sabores para compartir. Los platos, las descripciones y los ingredientes son de muestra. Sin precios, pagos ni preparación de comida.</p></div><Catalog items={await menu()}/></main>;}
