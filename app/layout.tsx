import type {Metadata} from 'next';
import localFont from 'next/font/local';
import './globals.css';
import {DraftProvider} from '@/components/draft';
import {Header,Footer} from '@/components/shell';
const heading=localFont({src:'../public/fonts/BarlowCondensed-SemiBold.ttf',variable:'--font-title',weight:'600',display:'swap'});
const body=localFont({src:'../public/fonts/SourceSans3.ttf',variable:'--font-body',weight:'200 900',display:'swap'});
export const metadata:Metadata={title:{default:'Cocina mexicana | Negocio de ejemplo',template:'%s | Cocina mexicana'},description:'Descubre un menú mexicano de ejemplo y guarda un pedido de prueba. Sin pagos ni recogidas reales.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body className={`${heading.variable} ${body.variable} font-sans antialiased`}><DraftProvider><Header/>{children}<Footer/></DraftProvider><script src={"https://constructor-api-prod.vercel.app/v1/projects/P-AX6LSD/analytics/script.js"} defer></script><script src="/constructor-editor.js" defer></script></body></html>;}
