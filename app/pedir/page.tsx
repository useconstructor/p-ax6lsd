import {menu} from '@/lib/data';
import {OrderForm} from '@/components/order-form';
export const dynamic='force-dynamic';
export const metadata={title:'Preparar pedido de prueba',description:'Elige platos, una fecha y una franja de demostración. Guarda un pedido de prueba sin pagos ni recogidas reales.'};
export default async function OrderPage(){return <main id="contenido" className="order-page mx-auto max-w-[1280px] px-6 py-8 max-sm:py-6 md:px-10 lg:px-8 lg:py-16"><div className="mb-8 max-sm:mb-5"><h1>Tu próximo antojo<span className="text-radish">.</span></h1><p className="mt-4 max-sm:mt-3 max-w-2xl text-muted-foreground">Prepara un pedido de ejemplo. No hay compras ni recogidas reales.</p></div><OrderForm initialMenu={await menu()}/></main>;}
