import type {Metadata} from 'next';
import localFont from 'next/font/local';
import './globals.css';
import {DraftProvider} from '@/components/draft';
import {Header,Footer} from '@/components/shell';
const poster=localFont({src:'../public/fonts/MesaLetterpress-Regular.otf',variable:'--font-poster',weight:'400',display:'swap'});
const narrow=localFont({src:'../public/fonts/MesaLetterpress-Narrow.otf',variable:'--font-poster-narrow',weight:'400',display:'swap'});
const wordmark=localFont({src:'../public/fonts/AlfaSlabOne-Regular.ttf',variable:'--font-wordmark',weight:'400',display:'swap'});
const handwritten=localFont({src:'../public/fonts/Kalam-Regular.ttf',variable:'--font-handwritten',weight:'400',display:'swap'});
const heading=localFont({src:'../public/fonts/ArchivoBlack-Regular.ttf',variable:'--font-title',weight:'400',display:'swap'});
const condensed=localFont({src:'../public/fonts/BarlowCondensed-SemiBold.ttf',variable:'--font-condensed',weight:'600',display:'swap'});
const body=localFont({src:'../public/fonts/SourceSans3.ttf',variable:'--font-body',weight:'200 900',display:'swap'});
export const metadata:Metadata={title:{default:'Mesa Brava | Cocina mexicana de ejemplo',template:'%s | Mesa Brava'},description:'Descubre un menú mexicano de ejemplo y guarda un pedido de prueba. Sin pagos ni recogidas reales.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es" data-scroll-behavior="smooth"><body className={`${poster.variable} ${narrow.variable} ${wordmark.variable} ${handwritten.variable} ${heading.variable} ${condensed.variable} ${body.variable} font-sans antialiased`}><DraftProvider><Header/>{children}<Footer/></DraftProvider></body></html>;}
