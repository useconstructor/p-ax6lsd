import Image from 'next/image';

export const metadata = {title: 'Prueba de imagen'};

export default function QaAyuda() {
 return <main id="contenido" className="mx-auto max-w-[1280px] px-6 py-10 md:px-10 lg:px-8 lg:py-16">
  <h1 className="mb-8">Prueba de imagen</h1>
  <Image src="/images/change-context-1-constructor-upload-qa.png" alt="Rectángulo azul sobre un fondo oscuro" width={640} height={360} sizes="(max-width: 1279px) 100vw, 1216px" priority className="h-auto w-full rounded-lg" />
 </main>;
}
