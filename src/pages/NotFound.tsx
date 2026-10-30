import { ArrowLeft, ArrowRight } from 'lucide-react'
import SiteFooter from '@/components/SiteFooter'
import SiteHeader from '@/components/SiteHeader'
import { usePageMeta } from '@/lib/pageMeta'

export default function NotFound() {
  usePageMeta({
    title: 'Página no encontrada | RP Abogados',
    description: 'La página solicitada no está disponible.',
    path: '/404',
    noindex: true,
  })

  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <SiteHeader />
      <main id="contenido" className="not-found section-dark">
        <div className="container not-found-inner" id="inicio">
          <span className="section-kicker">Error 404</span>
          <h1>Esta página no está disponible.</h1>
          <p>Puede que el enlace haya cambiado o que el contenido todavía no se haya publicado.</p>
          <div>
            <a className="button-primary" href="/"><ArrowLeft size={18} aria-hidden="true" />Volver al inicio</a>
            <a className="text-link text-link-light" href="/actualidad">Ir a Actualidad <ArrowRight size={17} aria-hidden="true" /></a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
